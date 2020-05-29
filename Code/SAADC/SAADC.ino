//sec, 2017
#define N_SAMPLES 48
static int16_t data_buffer[N_SAMPLES] = {0};

void adc_setup() {
  //configure SAADC resolution
  NRF_SAADC->RESOLUTION = SAADC_RESOLUTION_VAL_12bit;

  //enable SAADC
  NRF_SAADC->ENABLE = (SAADC_ENABLE_ENABLE_Enabled << SAADC_ENABLE_ENABLE_Pos);

  //set channel 0 resistor network, gain, reference, sample time, and mode
  NRF_SAADC->CH[0].CONFIG =   ((SAADC_CH_CONFIG_RESP_Bypass    << SAADC_CH_CONFIG_RESP_Pos)   & SAADC_CH_CONFIG_RESP_Msk)
                            | ((SAADC_CH_CONFIG_RESP_Bypass    << SAADC_CH_CONFIG_RESN_Pos)   & SAADC_CH_CONFIG_RESN_Msk)
                            | ((SAADC_CH_CONFIG_GAIN_Gain1_6   << SAADC_CH_CONFIG_GAIN_Pos)   & SAADC_CH_CONFIG_GAIN_Msk)
                            | ((SAADC_CH_CONFIG_REFSEL_VDD1_4  << SAADC_CH_CONFIG_REFSEL_Pos) & SAADC_CH_CONFIG_REFSEL_Msk)
                            | ((SAADC_CH_CONFIG_TACQ_5us       << SAADC_CH_CONFIG_TACQ_Pos)   & SAADC_CH_CONFIG_TACQ_Msk)
                            | ((SAADC_CH_CONFIG_BURST_Disabled << SAADC_CH_CONFIG_BURST_Pos)  & SAADC_CH_CONFIG_BURST_Msk)
                            | ((SAADC_CH_CONFIG_MODE_SE        << SAADC_CH_CONFIG_MODE_Pos)   & SAADC_CH_CONFIG_MODE_Msk);

  //configure Channel 0 to use A0 as positive, A1 as negative
  NRF_SAADC->CH[0].PSELP = SAADC_CH_PSELP_PSELP_AnalogInput0; 
  // NRF_SAADC->CH[0].PSELN = SAADC_CH_PSELP_PSELP_AnalogInput1;

  //set result pointer
  NRF_SAADC->RESULT.PTR = (uint32_t)(&data_buffer);
  NRF_SAADC->RESULT.MAXCNT = N_SAMPLES; // number of samples

}

void setup(){
  Serial.begin(115200);
  // setup ADC registers
  adc_setup();
  //start task
  NRF_SAADC->TASKS_START = 0x01UL;

  while (!NRF_SAADC->EVENTS_STARTED); // The adc has started
  NRF_SAADC->EVENTS_STARTED = 0x00UL; // Clear the started flag

  for(int i=0; i<N_SAMPLES; i++){
    //sample task channel 0
    NRF_SAADC->TASKS_SAMPLE = 0x01UL;
    while (!NRF_SAADC->EVENTS_DONE);
    NRF_SAADC->EVENTS_DONE = 0x00UL;

    if (data_buffer[i] < 0) {
      Serial.println(0);
    } else {
      Serial.println(data_buffer[i]*6*3.3/4096/4);
    }
    delay(1000);

    //sample task channel 1
    // NRF_SAADC->TASKS_SAMPLE = 0x01UL;
    // while (!NRF_SAADC->EVENTS_DONE);
    // NRF_SAADC->EVENTS_DONE = 0x00UL;
  }

  NRF_SAADC->TASKS_STOP = 0x01UL;
  while (!NRF_SAADC->EVENTS_STOPPED);
  NRF_SAADC->EVENTS_STOPPED = 0x00UL;    
}

void loop() {}
