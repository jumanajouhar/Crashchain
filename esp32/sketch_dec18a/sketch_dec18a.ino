#include "BluetoothSerial.h"

// Initialize Bluetooth Serial
BluetoothSerial SerialBT;

// OBD-II Bluetooth device name (change to your scanner's name)
const char* obdDeviceName = "OBDII";

// Define a buffer for incoming data
char responseBuffer[128];
int bufferIndex = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("Starting Bluetooth...");

  // Initialize Bluetooth Serial
  if (!SerialBT.begin("ESP32-OBD")) {
    Serial.println("Bluetooth initialization failed!");
    while (1);
  }
  Serial.println("Bluetooth initialized");

  // Attempt to connect to the OBD-II device
  Serial.printf("Connecting to %s...\n", obdDeviceName);
  if (SerialBT.connect(obdDeviceName)) {
    Serial.println("Connected to OBD-II scanner!");
  } else {
    Serial.println("Failed to connect to OBD-II scanner. Restart and try again.");
    while (1);
  }

  // Send initialization commands to OBD-II scanner
  initializeOBD();
}

void loop() {
  // Example: Request vehicle speed (PID 010D)
  sendOBDCommand("010D");
  delay(1000); // Allow time for response

  // Parse the response
  String speed = parseOBDResponse();
  if (!speed.isEmpty()) {
    Serial.printf("Vehicle Speed: %s km/h\n", speed.c_str());
  } else {
    Serial.println("Failed to retrieve vehicle speed");
  }

  delay(2000); // Wait before next command
}

// Function to send a command to the OBD-II scanner
void sendOBDCommand(const char* command) {
  String cmd = String(command) + "\r"; // Append \r for command termination
  SerialBT.print(cmd);
  Serial.printf("Sent command: %s\n", command);
}

// Function to parse the OBD-II response
String parseOBDResponse() {
  memset(responseBuffer, 0, sizeof(responseBuffer)); // Clear buffer
  bufferIndex = 0;

  unsigned long startTime = millis();
  while (millis() - startTime < 2000) { // Wait for 2 seconds for a response
    while (SerialBT.available()) {
      char c = SerialBT.read();
      if (c == '>') { // End of response
        responseBuffer[bufferIndex] = '\0';
        return extractDataFromResponse(responseBuffer);
      } else if (bufferIndex < sizeof(responseBuffer) - 1) {
        responseBuffer[bufferIndex++] = c;
      }
    }
  }
  return ""; // Timeout or no response
}

// Function to extract data from the OBD-II response
String extractDataFromResponse(const char* response) {
  String resp = String(response);
  Serial.printf("Raw OBD Response: %s\n", resp.c_str());

  // Basic parsing: Find the data portion
  int startIdx = resp.indexOf("41 ");
  if (startIdx != -1) {
    String data = resp.substring(startIdx + 3);
    data.trim();
    return String(strtol(data.c_str(), NULL, 16)); // Convert hex to decimal
  }
  return ""; // Parsing failed
}

// Function to initialize OBD-II scanner
void initializeOBD() {
  // Set OBD-II protocol to automatic
  sendOBDCommand("ATZ"); // Reset OBD-II
  delay(1000);
  sendOBDCommand("ATE0"); // Disable echo
  delay(1000);
  sendOBDCommand("ATSP0"); // Set protocol to auto
  delay(1000);
  Serial.println("OBD-II initialization complete");
}
