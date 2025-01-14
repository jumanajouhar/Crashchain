#include "BluetoothSerial.h"

BluetoothSerial SerialBT;

void setup() {
  Serial.begin(115200);

  if (!SerialBT.begin("ESP32")) {
    Serial.println("An error occurred initializing Bluetooth");
    return;
  }
  Serial.println("Bluetooth started. Scanning...");

  // Scan for devices
  SerialBT.discoverDevices();
  delay(5000);

  // List devices
  int deviceCount = SerialBT.availableDevices();
  Serial.printf("Found %d devices:\n", deviceCount);
  for (int i = 0; i < deviceCount; i++) {
    Serial.printf("Device %d: %s\n", i, SerialBT.getDeviceName(i));
  }
}

void loop() {}
