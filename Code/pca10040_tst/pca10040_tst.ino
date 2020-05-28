/*
   Pins for SPI
*/
#define MOSI_PIN    14
#define MISO_PIN    2
#define SCK_PIN     16
#define CS_PIN      19

/*
   buffers
*/
#define NUM_WORDS_BUFFER    1 // # of 'words' in the buffer
#define NUM_BYTES_WORD   5 // # of bytes per 'word'

typedef struct SPIArrayList {
  uint8_t buf[NUM_BYTES_WORD];
} SPIArrayList_type;

SPIArrayList_type SPI_RX[NUM_WORDS_BUFFER];
SPIArrayList_type SPI_TX[NUM_WORDS_BUFFER];

void setup() {
  /*
     NRF52 Datasheet pg 283: must cfg pins for GPIO 1st
     CS: Output, value 0
     SCK: Output, value 'same as CONFIG.CPOL' (so dep. on SPI mode)
     MOSI: Output, value 0
     MISO: Input
     FOR REGISTERS: look in (version #s may change) (from windows machine, probably different-but-similar on mac / ubuntu
     /yourusername/AppData/Local/Arduino15/packages/adafruit/hardware/nrf52/0.7.5/cores/nRF5/SKD/components/device/nrf52_bitfields.h
     and /nrf.h
     and /nrf52.h
     also available in SDK from Nordic
  */
  NRF_GPIO->DIRSET = (1 << CS_PIN);
  NRF_GPIO->DIRSET = (1 << SCK_PIN);
  NRF_GPIO->DIRSET = (1 << MOSI_PIN);
  NRF_GPIO->DIRSET = (0 << MISO_PIN);
  NRF_GPIO->PIN_CNF[MISO_PIN] = (GPIO_PIN_CNF_DIR_Input << GPIO_PIN_CNF_DIR_Pos) |
                                (GPIO_PIN_CNF_PULL_Pullup << GPIO_PIN_CNF_PULL_Pos);
  /*
     Enabling SPI, setting pins
     CS Pin is not associated with this module, u do u
  */
  NRF_SPIM0->ENABLE = (SPIM_ENABLE_ENABLE_Enabled << SPIM_ENABLE_ENABLE_Pos);
  NRF_SPIM0->PSEL.SCK = SCK_PIN;
  NRF_SPIM0->PSEL.MOSI = MOSI_PIN;
  NRF_SPIM0->PSEL.MISO = MISO_PIN;
  /*
     Frequency - device & electronics quality dependent. I generally dial this up until it breaks, and then come down by 2/3
  */
  NRF_SPIM0->FREQUENCY = SPI_FREQUENCY_FREQUENCY_M1; // 1MBps
  // SPI_FREQUENCY_FREQUENCY_K250 // 250kB/s
  // SPI_FREQUENCY_FREQUENCY_K500 // 500kB/s
  // SPI_FREQUENCY_FREQUENCY_M1 // 1MB/s
  // SPI_FREQUENCY_FREQUENCY_M2 // 2MB/s
  /*
     Config - device dependent, best to read datasheet carefully
  */
  NRF_SPIM0->CONFIG = (SPIM_CONFIG_CPOL_Msk << SPIM_CONFIG_CPOL_ActiveHigh) | // or ActiveLow
                      (SPIM_CONFIG_CPHA_Msk << SPIM_CONFIG_CPHA_Leading) |    // or CPHA_Trailing
                      (SPIM_CONFIG_ORDER_Msk << SPIM_CONFIG_ORDER_LsbFirst);  // or MsbFirst
  /*
     DMA to Send Buffers
     MAXCNT is the # of bytes the SPI module will send
     PTR an address to those bytes. see globally defined buffers above
  */
  NRF_SPIM0->TXD.MAXCNT = NUM_BYTES_WORD * NUM_WORDS_BUFFER;
  NRF_SPIM0->TXD.PTR = (uint32_t)&SPI_TX;
  NRF_SPIM0->RXD.MAXCNT = NUM_BYTES_WORD * NUM_WORDS_BUFFER;
  NRF_SPIM0->RXD.PTR = (uint32_t)&SPI_RX;

  NRF_GPIO->OUTSET = (1 << CS_PIN); // set line inactive (high)

  Serial.begin(115200); // for testing
}

uint32_t lastms = 0;
uint32_t period = 1000;

void loop() {
  if((millis() - lastms) > period){
    lastms - millis();
    /*
     * setup your buffer, do this however you'd like
     */
    SPI_TX[0].buf[0] = 0x00;
    SPI_TX[0].buf[1] = 0x01;
    SPI_TX[0].buf[2] = 0x02;
    SPI_TX[0].buf[3] = 0x03;
    SPI_TX[0].buf[4] = 0x04;
    /*
     * do the business
     */
    blockingSpiTransfer();
    /*
     * reply is now available in SPI_RX[0].buf[n] 
     * -> this is set up as an MD array because most spi 'words' are longer than 1 byte,
     * so it's useful to have a buffer[x].ofWords[n]
     * in the event you are transferring lots of data and want to not-block, 
     * you can keep filling the buffer[x] and set up events to fire when it's empty, full etc...
     */
     Serial.print(SPI_RX[0].buf[0], BIN); // will print 0s and 1s to the line, can also spec HEX (default is ASCII)
     Serial.println(" || ");
     Serial.print(SPI_RX[0].buf[1], BIN);
     Serial.println(" || ");
     Serial.print(SPI_RX[0].buf[2], BIN);
     Serial.println(" || ");
     Serial.print(SPI_RX[0].buf[3], BIN);
     Serial.println(" || ");
     Serial.print(SPI_RX[0].buf[4], BIN);
     Serial.println(" || ");
     /*
      * also: when reading a register, you normally have to send the 'read from' command twice
      * as the device has to have a chance to shift its reply bits into the buffer it uses to reply with.
      */
  }
}


void blockingSpiTransfer() {
  NRF_GPIO->OUTCLR = (1 << CS_PIN); // tells device to start listening (active low)

  NRF_SPIM0->EVENTS_STARTED = 0; // clear these events
  NRF_SPIM0->EVENTS_END = 0;
  NRF_SPIM0->TASKS_START = 1; // ready go 

  // now SPI hardware is pulling from the TX and pushing into the RX buffers

  while (NRF_SPIM0->EVENTS_STARTED == 0) {} // wait 4 start
  while (NRF_SPIM0->EVENTS_END == 0) {} // wait 4 spi module to do the business (todo: non blocking event based C++!)

  NRF_GPIO->OUTSET = (1 << CS_PIN); // goodbye
}
