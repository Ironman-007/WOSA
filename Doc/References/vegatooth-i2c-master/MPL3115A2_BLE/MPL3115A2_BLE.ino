#include <Wire.h>
#include <Adafruit_MPL3115A2.h>
#include <bluefruit.h>

// BLE Service
BLEDis  bledis;
BLEUart bleuart;
BLEBas  blebas;

Adafruit_MPL3115A2 baro = Adafruit_MPL3115A2();

 

void setup(void) {
  Serial.begin(115200);
  delay(2000);
  Serial.println(sizeof(float));
  Serial.println("Hello!");
  bleSetup();
  
  if (! baro.begin()) {
    Serial.println("Couldnt find sensor");
    return;
  }
}

void bleSetup() {
    Bluefruit.configPrphBandwidth(BANDWIDTH_MAX);
    Bluefruit.begin();
    Bluefruit.setTxPower(4);
    Bluefruit.setName("MPL3115A2");
    Bluefruit.setConnectCallback(connect_callback);
    Bluefruit.setDisconnectCallback(disconnect_callback);
    bledis.setManufacturer("MIT Media Lab");
    bledis.setModel("V2.0");
    bledis.begin();
  // Configure and Start BLE Uart Service
    bleuart.begin();
    Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
    Bluefruit.Advertising.addTxPower();
    Bluefruit.Advertising.addService(bleuart);
    Bluefruit.ScanResponse.addName();
    Bluefruit.Advertising.restartOnDisconnect(true);
    Bluefruit.Advertising.setInterval(32, 244);   
    Bluefruit.Advertising.setFastTimeout(30);     
    Bluefruit.Advertising.start(0); 
}

void connect_callback(uint16_t conn_handle) {
  char central_name[32] = { 0 };
  Bluefruit.Gap.getPeerName(conn_handle, central_name, sizeof(central_name));
  Serial.print("Connected to ");
  Serial.println(central_name);
}

void disconnect_callback(uint16_t conn_handle, uint8_t reason) {
  (void) conn_handle;
  (void) reason;
  Serial.println();
  Serial.println("Disconnected");
}

float pascals, altm, tempC;

void sendData(){
  int numVals = 3;
  float vals[numVals];
  vals[0] = pascals;
  vals[1] = altm;
  vals[2] = tempC;
  int cnt = numVals * 4 ;
  uint8_t buf[cnt];
  for (int _i=0; _i<numVals; _i++)
    memcpy(&buf[_i*sizeof(float)], &vals[_i], sizeof(float));
  bleuart.write( buf, cnt );
}

void loop(void) {
  pascals = baro.getPressure();
  Serial.print(pascals/3377); 
  Serial.println(" Inches (Hg)");
  altm = baro.getAltitude();
  Serial.print(altm); 
  Serial.println(" meters");
  tempC = baro.getTemperature();
  Serial.print(tempC); 
  Serial.println("*C");
  sendData();
  delay(100);
}
