#include <SPI.h>
#include <BLEPeripheral.h>

// define pins (varies per shield/board)
#define BLE_REQ   10
#define BLE_RDY   2
#define BLE_RST   9

BLEPeripheral blePeripheral = BLEPeripheral(BLE_REQ, BLE_RDY, BLE_RST);

BLEService tempService = BLEService("DDD0");
BLEFloatCharacteristic tempCharacteristic = BLEFloatCharacteristic("DDD1", BLERead | BLENotify);
BLEDescriptor tempDescriptor = BLEDescriptor("2901", "Temp Celsius");

volatile bool readFromSensor = false;

char lastTempReading = 'B';

void setup() {
  Serial.begin(115200);
#if defined (__AVR_ATmega32U4__)
  delay(5000);  //5 seconds delay for enabling to see the start up comments on the serial board
#endif

  blePeripheral.setLocalName("Temperature");

  blePeripheral.setAdvertisedServiceUuid(tempService.uuid());
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

  tempCharacteristic.setValue(lastTempReading);
//  lastTempReading = lastTempReading + 1;
  Serial.println(lastTempReading);
  delay(1000);

//  if (readFromSensor) {
//    setTempCharacteristicValue();
//    setHumidityCharacteristicValue();
//    readFromSensor = false;
//  }
}

//void timerHandler() {
//  readFromSensor = true;
//}
//
//void setTempCharacteristicValue() {
//  float reading = dht.readTemperature();
////  float reading = random(100);
//
//  if (!isnan(reading) && significantChange(lastTempReading, reading, 0.5)) {
//    tempCharacteristic.setValue(reading);
//
//    Serial.print(F("Temperature: ")); Serial.print(reading); Serial.println(F("C"));
//
//    lastTempReading = reading;
//  }
//}

//void setHumidityCharacteristicValue() {
//  float reading = dht.readHumidity();
////  float reading = random(100);
//
//  if (!isnan(reading) && significantChange(lastHumidityReading, reading, 1.0)) {
//    humidityCharacteristic.setValue(reading);
//
//    Serial.print(F("Humidity: ")); Serial.print(reading); Serial.println(F("%"));
//
//    lastHumidityReading = reading;
//  }
//}

//boolean significantChange(float val1, float val2, float threshold) {
//  return (abs(val1 - val2) >= threshold);
//}

void blePeripheralConnectHandler(BLECentral& central) {
  Serial.print(F("Connected event, central: "));
  Serial.println(central.address());
}

void blePeripheralDisconnectHandler(BLECentral& central) {
  Serial.print(F("Disconnected event, central: "));
  Serial.println(central.address());
}
