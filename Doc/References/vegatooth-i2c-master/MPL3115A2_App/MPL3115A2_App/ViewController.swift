//
//  ViewController.swift
//  blueMarc
//
//  Created by Tomas Vega on 12/7/17.
//  Copyright © 2017 Tomas Vega. All rights reserved.
//

import UIKit
import CoreBluetooth

class ViewController: UIViewController,
                      CBCentralManagerDelegate,
                      CBPeripheralDelegate {
  
  var manager:CBCentralManager!
  var _peripheral:CBPeripheral!
  var sendCharacteristic: CBCharacteristic!
  var loadedService: Bool = true
  
  let NAME = "MPL3115A2"
  let UUID_SERVICE = CBUUID(string: "6E400001-B5A3-F393-E0A9-E50E24DCCA9E")
  let UUID_WRITE = CBUUID(string: "6E400002-B5A3-F393-E0A9-E50E24DCCA9E")
  let UUID_READ = CBUUID(string: "6E400003-B5A3-F393-E0A9-E50E24DCCA9E")
  
  @IBOutlet weak var altValue: UILabel!
  @IBOutlet weak var presValue: UILabel!
  @IBOutlet weak var tempValue: UILabel!
  

//// To send data, first format and then send!
//  func getData() -> NSData{
//    let state: UInt16 = stateValue ? 1 : 0
//    let power:UInt16 = UInt16(thresholdValue)
//    var theData : [UInt16] = [ state, power ]
//    print(theData)
//    let data = NSData(bytes: &theData, length: theData.count)
//    return data
//  }
//
//
//  func updateSettings() {
//    if loadedService {
//      if _peripheral?.state == CBPeripheralState.connected {
//        if let characteristic:CBCharacteristic? = sendCharacteristic{
//          let data: Data = getData() as Data
//          _peripheral?.writeValue(data,
//                                  for: characteristic!,
//                                  type: CBCharacteristicWriteType.withResponse)
//        }
//      }
//    }
//  }
  
  override func viewDidLoad() {
    super.viewDidLoad()
    manager = CBCentralManager(delegate: self, queue: nil)
  }


  override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning()
    // Dispose of any resources that can be recreated.
  }

  func centralManagerDidUpdateState(_ central: CBCentralManager) {
    if central.state == CBManagerState.poweredOn {
      print("Buscando a Marc")
      central.scanForPeripherals(withServices: nil, options: nil)
    }
  }
  
  // Found a peripheral
  func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
//    print("found a peripheral")
    // Device
    let device = (advertisementData as NSDictionary).object(forKey: CBAdvertisementDataLocalNameKey) as? NSString
    // Check if this is the device we want
    if device?.contains(NAME) == true {

      // Stop looking for devices
      // Track as connected peripheral
      // Setup delegate for events
      self.manager.stopScan()
      self._peripheral = peripheral
      self._peripheral.delegate = self
      
      // Connect to the perhipheral proper
      manager.connect(peripheral, options: nil)
      
      // Debug
      debugPrint("Found Bean.")
    }
  }
  
  // Connected to peripheral
  func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
    // Ask for services
    peripheral.discoverServices(nil)
    
    // Debug
    debugPrint("Getting services ...")
  }
  
  // Discovered peripheral services
  func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
    // Look through the service list
    for service in peripheral.services! {
      let thisService = service as CBService
      
      // If this is the service we want
      print(service.uuid)
      if service.uuid == UUID_SERVICE {
        // Ask for specific characteristics
        peripheral.discoverCharacteristics(nil, for: thisService)
        
        // Debug
        debugPrint("Using scratch.")
      }
      
      // Debug
      debugPrint("Service: ", service.uuid)
    }
  }
  
  // Discovered peripheral characteristics
  func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
    debugPrint("Enabling ...")
    
    // Look at provided characteristics
    for characteristic in service.characteristics! {
      let thisCharacteristic = characteristic as CBCharacteristic
      
      // If this is the characteristic we want
      print(thisCharacteristic.uuid)
      if thisCharacteristic.uuid == UUID_READ {
        // Start listening for updates
        // Potentially show interface
        self._peripheral.setNotifyValue(true, for: thisCharacteristic)
        
        // Debug
        debugPrint("Set to notify: ", thisCharacteristic.uuid)
      } else if thisCharacteristic.uuid == UUID_WRITE {
        sendCharacteristic = thisCharacteristic
        loadedService = true
      }
      
      // Debug
      debugPrint("Characteristic: ", thisCharacteristic.uuid)
    }
  }


  func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
    // print("Data")
    // Make sure it is the peripheral we want

    if characteristic.uuid == UUID_READ {
      // Get bytes into string
      let dataReceived = characteristic.value! as NSData
      print(dataReceived)
      
      var pressure: Float = 0
      var altitude: Float = 0
      var temperature: Float = 0
      
      dataReceived.getBytes(&pressure, range: NSRange(location: 0, length: 4))
      dataReceived.getBytes(&altitude, range: NSRange(location: 4, length: 4))
      dataReceived.getBytes(&temperature, range: NSRange(location: 8, length: 4))

      print(pressure, altitude, temperature);
      presValue.text = String(format: "%.1f inches (Hg)", pressure);
      altValue.text = String(format: "%.1f meters", altitude);
      tempValue.text = String(format: "%.1f *C", temperature);
    }
  }
  
  func peripheral(_ peripheral: CBPeripheral, didUpdateNotificationStateFor characteristic: CBCharacteristic, error: Error?) {
    print("success")
    print(characteristic.uuid)
    print(error)
  }
  
  // Peripheral disconnected
  // Potentially hide relevant interface
  func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?) {
    debugPrint("Disconnected.")
    
    // Start scanning again
    central.scanForPeripherals(withServices: nil, options: nil)
  }
}
