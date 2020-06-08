#include <SPI.h>
#include <BLEPeripheral.h>

#include <Wire.h>
#include "MAX30105.h"

MAX30105 particleSensor;

// define pins (varies per shield/board)
#define BLE_REQ   10
#define BLE_RDY   2
#define BLE_RST   9

BLEPeripheral blePeripheral = BLEPeripheral(BLE_REQ, BLE_RDY, BLE_RST);

BLEService tempService = BLEService("DDD0");
BLEFloatCharacteristic tempCharacteristic = BLEFloatCharacteristic("DDD1", BLERead | BLEWrite | BLENotify);
BLEDescriptor tempDescriptor = BLEDescriptor("2901", "Temp Celsius");

volatile bool readFromSensor = false;

long red_reflect = 0;

void setup() {
  Serial.begin(115200);
#if defined (__AVR_ATmega32U4__)
  delay(5000);  //5 seconds delay for enabling to see the start up comments on the serial board
#endif

  Serial.println("MAX30105 Basic Readings Example");
  // Initialize sensor
  if (particleSensor.begin() == false)
  {
    Serial.println("MAX30105 was not found. Please check wiring/power. ");
    while (1);
  }

  particleSensor.setup(); //Configure sensor. Use 6.4mA for LED drive

  blePeripheral.setLocalName("Temperature");

  blePeripheral.setAdvertisedServiceUuid(tempService.uuid());
  Serial.println(tempService.uuid());
  blePeripheral.addAttribute(tempService);
  blePeripheral.addAttribute(tempCharacteristic);
  blePeripheral.addAttribute(tempDescriptor);

  blePeripheral.setEventHandler(BLEConnected, blePeripheralConnectHandler);
  blePeripheral.setEventHandler(BLEDisconnected, blePeripheralDisconnectHandler);

  blePeripheral.begin();

  Serial.println(F("BLE Temperature Sensor Peripheral"));
}

void loop() {
  blePeripheral.poll();

  tempCharacteristic.setValue(red_reflect);
//  lastTempReading = lastTempReading + 1;
  red_reflect = particleSensor.getRed();
  Serial.println(red_reflect);
  delay(10);
}

void blePeripheralConnectHandler(BLECentral& central) {
  Serial.print(F("Connected event, central: "));
  Serial.println(central.address());
}

void blePeripheralDisconnectHandler(BLECentral& central) {
  Serial.print(F("Disconnected event, central: "));
  Serial.println(central.address());
}
