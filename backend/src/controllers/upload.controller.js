const PDFService = require('../services/pdf.service');
const { pinata } = require('../config/pinata');
const { getCrashContract, getDefaultAccount } = require('../config/blockchain');
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const FormData = require('form-data');
const fs = require('fs');

class UploadController {
  static async processUpload(req, res) {
    try {
      if (!this.validateRequest(req)) {
        logger.error('[DEBUG] Missing required fields');
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create Pinata group
      logger.info('[DEBUG] Creating Pinata group');
      const group = await pinata.groups.create({
        name: `Crash-Report-${Date.now()}`,
      });
      
      const groupCids = [];

      // Handle file upload if present
      if (req.file) {
        const fileCid = await this.handleFileUpload(req.file);
        groupCids.push(fileCid);
      }

      // Generate and upload PDF
      const pdfCid = await this.handlePdfGeneration(req.body);
      groupCids.push(pdfCid);

      // Add CIDs to Pinata group
      await pinata.groups.addCids({
        cids: groupCids,
        groupId: group.id,
      });

      // Store in blockchain
      await this.storeInBlockchain(req.body, groupCids);

      res.json({
        message: 'Upload successful',
        groupId: group.id,
        files: groupCids.map(cid => ({
          cid,
          url: `https://${process.env.GATEWAY_URL}/ipfs/${cid}`
        }))
      });
    } catch (error) {
      logger.error('[DEBUG] Upload error:', error);
      res.status(500).json({ error: 'Error processing upload' });
    }
  }

  static validateRequest(req) {
    const required = ['vinNumber', 'location', 'impactSeverity', 'throttlePosition', 'brakePosition'];
    return required.every(field => req.body[field] !== undefined && req.body[field] !== '');
  }

  static async handleFileUpload(file) {
    logger.info('[DEBUG] Processing uploaded file');
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const response = await pinata.pinFileToIPFS(formData);
    return response.IpfsHash;
  }

  static async handlePdfGeneration(data) {
    const pdfPath = await PDFService.generatePDF(data);
    const formData = new FormData();
    formData.append('file', fs.createReadStream(pdfPath));

    try {
      const response = await pinata.pinFileToIPFS(formData);
      return response.IpfsHash;
    } finally {
      // Clean up PDF file
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }
  }

  static async storeInBlockchain(data, groupCids) {
    try {
      const crashContract = getCrashContract();
      const dataId = new mongoose.Types.ObjectId().toString();
      
      const transaction = await crashContract.methods.storeMetadata(
        dataId,
        data.vinNumber,
        data.location,
        groupCids
      ).send({
        from: getDefaultAccount(),
        gas: 500000
      });
      
      logger.info('[DEBUG] Blockchain transaction successful:', transaction.transactionHash);
      return transaction;
    } catch (error) {
      logger.error('[DEBUG] Error storing metadata in blockchain:', error);
      throw error;
    }
  }
}

module.exports = UploadController;