#include <SPI.h>
#include <BLEPeripheral.h>

#define BTN_PIN 6
#define BTN_ACTIVE LOW

const char * localName = "nRF52832 Button";
BLEPeripheral blePeriph;
BLEService bleServ("1234");
BLECharCharacteristic btnChar("1234", BLERead | BLENotify);

void setup() {
  Serial.begin(9600);
  // put your setup code here, to run once:
    pinMode(BTN_PIN, INPUT_PULLUP);
    digitalWrite(7, HIGH);

    setupBLE();
}

void setupBLE()
{
  // Advertise name and service:
  blePeriph.setDeviceName(localName);
  blePeriph.setLocalName(localName);
  blePeriph.setAdvertisedServiceUuid(bleServ.uuid());

  // Add service
  blePeriph.addAttribute(bleServ);

  // Add characteristic
  blePeriph.addAttribute(btnChar);

  // Now that device6, service, characteristic are set up,
  // initialize BLE:
  blePeriph.begin();
}

void loop() {
  blePeriph.poll();
  // put your main code here, to run repeatedly:

}
