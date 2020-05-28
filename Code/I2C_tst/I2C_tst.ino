#define n_tx_bytes 2 //only as many as needed for application
#define n_rx_bytes 1 //only as many as needed for application

#define scl_pin 27 //XL1, need to disconnect from clock
#define sda_pin 26 //XL2, need to disconnect from clock

#define sent_cnt 50

static uint8_t txdata[n_tx_bytes] = {0};
static uint8_t rxdata[n_rx_bytes] = {0};

void twi_set_cnts(uint8_t n_tx, uint8_t n_rx){
  NRF_TWIM0->TXD.MAXCNT = (n_tx << TWIM_TXD_MAXCNT_MAXCNT_Pos) & TWIM_TXD_MAXCNT_MAXCNT_Msk;
  NRF_TWIM0->RXD.MAXCNT = (n_rx << TWIM_RXD_MAXCNT_MAXCNT_Pos) & TWIM_RXD_MAXCNT_MAXCNT_Msk;  
  NRF_TWIM0->TXD.PTR = (uint32_t)(&txdata);
  NRF_TWIM0->RXD.PTR = (uint32_t)(&rxdata);
}

void twi_setup(){
  NRF_TWIM0->ENABLE = (TWI_ENABLE_ENABLE_Disabled << TWI_ENABLE_ENABLE_Pos) & TWI_ENABLE_ENABLE_Msk;

//  Set GPIO
//  NRF_GPIO->PIN_CNF[scl_pin] =    ((uint32_t)GPIO_PIN_CNF_DIR_Input        << GPIO_PIN_CNF_DIR_Pos)
//                                | ((uint32_t)GPIO_PIN_CNF_INPUT_Connect    << GPIO_PIN_CNF_INPUT_Pos)
//                                | ((uint32_t)GPIO_PIN_CNF_PULL_Pullup      << GPIO_PIN_CNF_PULL_Pos)
//                                | ((uint32_t)GPIO_PIN_CNF_DRIVE_S0D1       << GPIO_PIN_CNF_DRIVE_Pos);
//
//  NRF_GPIO->PIN_CNF[sda_pin] =    ((uint32_t)GPIO_PIN_CNF_DIR_Input        << GPIO_PIN_CNF_DIR_Pos)
//                                | ((uint32_t)GPIO_PIN_CNF_INPUT_Connect    << GPIO_PIN_CNF_INPUT_Pos)
//                                | ((uint32_t)GPIO_PIN_CNF_PULL_Pullup      << GPIO_PIN_CNF_PULL_Pos)
//                                | ((uint32_t)GPIO_PIN_CNF_DRIVE_S0D1       << GPIO_PIN_CNF_DRIVE_Pos);

  NRF_GPIO->PIN_CNF[scl_pin] = (GPIO_PIN_CNF_DRIVE_S0D1 << GPIO_PIN_CNF_DRIVE_Pos) & GPIO_PIN_CNF_DRIVE_Msk;
  NRF_GPIO->PIN_CNF[sda_pin] = (GPIO_PIN_CNF_DRIVE_S0D1 << GPIO_PIN_CNF_DRIVE_Pos) & GPIO_PIN_CNF_DRIVE_Msk;
  NRF_GPIO->DIRCLR = (1<<scl_pin)|(1<<sda_pin); //set SDA/SCL as inputs (likely not necessary)



  NRF_TWIM0->PSEL.SCL = ((scl_pin << TWIM_PSEL_SCL_PIN_Pos) & TWIM_PSEL_SCL_PIN_Msk)
                      | ((TWIM_PSEL_SCL_CONNECT_Connected << TWIM_PSEL_SCL_CONNECT_Pos) & TWIM_PSEL_SCL_CONNECT_Msk);
  NRF_TWIM0->PSEL.SDA = ((sda_pin << TWIM_PSEL_SDA_PIN_Pos) & TWIM_PSEL_SDA_PIN_Msk)
                      | ((TWIM_PSEL_SDA_CONNECT_Connected << TWIM_PSEL_SDA_CONNECT_Pos) & TWIM_PSEL_SDA_CONNECT_Msk);

  NRF_TWIM0->FREQUENCY = (TWI_FREQUENCY_FREQUENCY_K100 << TWI_FREQUENCY_FREQUENCY_Pos) & TWI_FREQUENCY_FREQUENCY_Msk;
  NRF_TWIM0->ADDRESS = (0x04 << TWI_ADDRESS_ADDRESS_Pos) & TWI_ADDRESS_ADDRESS_Msk;

  NRF_TWIM0->TXD.PTR = (uint32_t)(&txdata);
  NRF_TWIM0->RXD.PTR = (uint32_t)(&rxdata);

  twi_set_cnts(n_tx_bytes, n_rx_bytes);
  //set up short between LASTTX and STOP and between LASTRX and STOP
  NRF_TWIM0->SHORTS = ((TWIM_SHORTS_LASTTX_STOP_Enabled << TWIM_SHORTS_LASTTX_STOP_Pos) & TWIM_SHORTS_LASTTX_STOP_Msk)
                    | ((TWIM_SHORTS_LASTRX_STOP_Enabled << TWIM_SHORTS_LASTRX_STOP_Pos) & TWIM_SHORTS_LASTRX_STOP_Msk);
  //NRF_TWIM0->ENABLE = (TWI_ENABLE_ENABLE_Enabled << TWI_ENABLE_ENABLE_Pos) & TWI_ENABLE_ENABLE_Msk;

  //There's a typo in nrf52_bitfields, so we set this manually.
  NRF_TWIM0->ENABLE = (6 << TWI_ENABLE_ENABLE_Pos) & TWI_ENABLE_ENABLE_Msk;
}

void twi_tx(){
  // clear the stopped event
  NRF_TWIM0->EVENTS_STOPPED = 0;
  // triggering the STARTTX task
  NRF_TWIM0->TASKS_STARTTX = 1;
  while( !(NRF_TWIM0->EVENTS_STOPPED) ){
//    Serial.println("EVENTS_not_STOPPED");
  }
  Serial.println("EVENTS_STOPPED");
}

void twi_rx(){
  // clear the stopped event
  NRF_TWIM0->EVENTS_STOPPED = 0;
  // trigger the STARTRX task
  NRF_TWIM0->TASKS_STARTRX = 1;
  while( !(NRF_TWIM0->EVENTS_STOPPED) ){}
}

void setup() {
  Serial.begin(9600);

  Serial.println("twi_setup");
  twi_setup();
  Serial.println("twi_setup OK");

  int i = 0;

  for(i = 0; i < sent_cnt; i++) {
    // Single TWI write to register 0x2A of value 0x3F
    // twi_set_cnts(2, 0);

    txdata[0] = 0x0A + i;
    txdata[1] = 0x3F;
    twi_tx();
    Serial.println("twi_tx OK");
    delay(1000);
  }

//  //Multiple TWI Write to registers 0x2A and 0x2B of values 0x00 and 0x01 respectively
//  twi_set_cnts(3, 0);
//  txdata[0] = 0x2A;
//  txdata[1] = 0x00; //high
//  txdata[2] = 0x01; //low
//  twi_tx(); 
//
//  //Single TWI Read at register 0x2A.  Result shows up in rxdata[0]
//  twi_set_cnts(1, 1);
//  txdata[0] = 0x2A;
//  twi_tx();
//  twi_rx(); 
//
//  //Multiple TWI Read starting at register 0x2A.  Results show up in rxdata[0],rxdata[1]
//  //untested
//  twi_set_cnts(1, 2);
//  txdata[0] = 0x2A;
//  twi_tx();
//  twi_rx(); 
}

void loop() {}
