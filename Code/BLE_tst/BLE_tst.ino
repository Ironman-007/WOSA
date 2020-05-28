#define PACKET_BASE_ADDRESS_LENGTH  (2UL)  //Packet base address length field size in bytes
#define PACKET_LENGTH 4
#define REDUNDANCY_COUNT 1000 //number of transmissions to ensure delivery... hack.

static int16_t radio_buffer[PACKET_LENGTH] = {0};

void radio_setup(){
  NRF_RADIO->POWER = RADIO_POWER_POWER_Disabled; //turn off radio to reset registers
  delay(10);
  NRF_RADIO->POWER = RADIO_POWER_POWER_Enabled; //turn on radio
  delay(10);

  NRF_RADIO->TXPOWER   = (RADIO_TXPOWER_TXPOWER_Pos3dBm << RADIO_TXPOWER_TXPOWER_Pos);
  NRF_RADIO->FREQUENCY = 11UL;  // 2400 + X MHz
  NRF_RADIO->MODE      = (RADIO_MODE_MODE_Nrf_2Mbit << RADIO_MODE_MODE_Pos);

  NRF_RADIO->PREFIX0 = ((uint32_t)0xC0 << 0); // Prefix byte of address 0
  NRF_RADIO->BASE0 = 0x01234567UL;  // Base address for prefix 0
  NRF_RADIO->BASE1 = 0x02345678UL;  // Base address for prefix 0
  NRF_RADIO->TXADDRESS   = 0x00UL;  // Set device address 0 to use when transmitting
  NRF_RADIO->RXADDRESSES = 0x03UL;  // Enable device addresses 0 and 1 to receive on

  // Packet configuration
  NRF_RADIO->PCNF0 = (0 << RADIO_PCNF0_S1LEN_Pos) | (0 << RADIO_PCNF0_S0LEN_Pos) | (0 << RADIO_PCNF0_LFLEN_Pos); 
  NRF_RADIO->PCNF1 = (RADIO_PCNF1_WHITEEN_Enabled << RADIO_PCNF1_WHITEEN_Pos) |
                     ((PACKET_LENGTH) << RADIO_PCNF1_STATLEN_Pos) |
                     (RADIO_PCNF1_ENDIAN_Big       << RADIO_PCNF1_ENDIAN_Pos)  |
                     (2 << RADIO_PCNF1_BALEN_Pos);
  NRF_RADIO->CRCCNF = (RADIO_CRCCNF_LEN_Three << RADIO_CRCCNF_LEN_Pos); // Number of checksum bits
  NRF_RADIO->CRCINIT = 0xFFFFUL; // Initial value
  NRF_RADIO->CRCPOLY = 0x18D; //x8 + x7 + x3 + x2 + 1 = 110001101 
  NRF_RADIO->MODECNF0 |= RADIO_MODECNF0_RU_Fast << RADIO_MODECNF0_RU_Pos; //turn on fast ramp up
  NRF_RADIO->SHORTS = 0; //turn off all shortcuts, for debug
  NRF_RADIO->PACKETPTR = (uint32_t)&radio_buffer; //set pointer to packet buffer
  //start HFCLK
  NRF_CLOCK->TASKS_HFCLKSTART = 1;
  while(!(NRF_CLOCK->HFCLKSTAT & CLOCK_HFCLKSTAT_STATE_Msk)); //wait for hfclk to start
  delay(10);
}

//clear end event
void radio_wait_for_end(){
  while(!(NRF_RADIO->EVENTS_END));
  NRF_RADIO->EVENTS_END = 0;
}

//clear ready event
void radio_wait_for_ready(){
  while(!(NRF_RADIO->EVENTS_READY));
  NRF_RADIO->EVENTS_READY = 0;
}

void radio_disable(){
  NRF_RADIO->EVENTS_DISABLED = 0; //clear disabled event
  NRF_RADIO->TASKS_DISABLE = 1;
  while(!(NRF_RADIO->EVENTS_DISABLED)); 
}

void radio_send(){
  NRF_RADIO->EVENTS_READY = 0; //clear ready event
  NRF_RADIO->TASKS_TXEN=1; //trigger tx enable task
  delayMicroseconds(20);
  //radio_wait_for_ready(); //only generated when actually switching to tx mode
  NRF_RADIO->TASKS_START=1;  //start
  radio_wait_for_end();
}

void radio_send_redundant(){
  for(int i=0; i<REDUNDANCY_COUNT; i++){
    radio_send();
  }
}

int radio_recv(){
  //return number of packets before CRC match
  NRF_RADIO->EVENTS_CRCOK = 0; 
  //NRF_RADIO->EVENTS_CRCERROR = 0; 
  int i=1;
  while(true){
    NRF_RADIO->EVENTS_READY = 0; //clear ready event
    NRF_RADIO->TASKS_RXEN=1; //trigger rx enable task
    delayMicroseconds(20);
    //radio_wait_for_ready(); //only generated when actually switching to rx mode 
    NRF_RADIO->TASKS_START=1;
    radio_wait_for_end();
    if (NRF_RADIO->EVENTS_CRCOK == 1){ break;}
    i++;
  }
  return i;
}

void setup() {
  radio_setup();
  
  NRF_RADIO->TXADDRESS   = 0x00UL;  // Set address to send to device 0
  radio_buffer[0] = 1; 
  radio_buffer[1] = 2;
  radio_buffer[2] = 3;
  radio_buffer[3] = 4; //set up packet 1,2,3,4
  radio_send_redundant(); //send with redundant tx to device 0

  NRF_RADIO->TXADDRESS   = 0x01UL;  // Set address to send to device 1
  radio_buffer[0] = 5; 
  radio_buffer[1] = 6;
  radio_buffer[2] = 7;
  radio_buffer[3] = 8; //set up packet 5,6,7,8
  radio_send_redundant(); //send with redundant tx to device 1

  int result = radio_recv(); //wait until recieve
  //which pipe a packet arrive on is available in the RXMATCH register
}

void loop() {}
