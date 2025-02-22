const axios = require("axios");
const { DEEPSEEK_API_KEY } = process.env;

async function analyzeOBDDataWithDeepSeek(data) {
    const prompt = `
    Analyze the following OBD vehicle data for crash detection:
    
    Data: ${JSON.stringify(data)}
    
    Provide a structured report:
    - **Crash Likelihood**: High/Medium/Low
    - **Detected Anomalies**
    - **Possible Causes**
    - **Recommendations**
    `;

    const maxRetries = 3; // Number of retries
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await axios.post(
                "https://api.deepseek.com/v1/chat/completions",
                {
                    model: "deepseek-chat",
                    messages: [
                        { role: "system", content: "You are an expert in vehicle crash detection." },
                        { role: "user", content: prompt },
                    ],
                    max_tokens: 1000,
                    temperature: 0.5,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
                    },
                }
            );

            // Log the response for debugging
            console.log("DeepSeek API Response:", response.data);

            // Check if response data and choices are valid
            if (response.data && response.data.choices && Array.isArray(response.data.choices) && response.data.choices.length > 0) {
                return response.data.choices[0].message.content;
            } else if (response.data === '') {
                console.error("Received empty response data:", {
                    status: response.status,
                    data: response.data,
                });
                if (attempt < maxRetries - 1) {
                    console.log(`Retrying... Attempt ${attempt + 2}`);
                    continue; // Retry
                }
                return "Error analyzing OBD data with DeepSeek: Received empty response after retries.";
            } else {
                console.error("Unexpected response structure:", {
                    status: response.status,
                    data: response.data,
                });
                return "Error analyzing OBD data with DeepSeek: Unexpected response structure.";
            }
        } catch (error) {
            console.error("DeepSeek API Error:", error.response ? {
                status: error.response.status,
                data: error.response.data,
                message: error.message
            } : error.message);
            return "Error analyzing OBD data with DeepSeek.";
        }
    }
}

module.exports = { analyzeOBDDataWithDeepSeek };
