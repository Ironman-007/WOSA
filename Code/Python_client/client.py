import binascii
import struct
import time
from bluepy.btle import UUID, Peripheral, DefaultDelegate

from pylive import live_plotter
import numpy as np

red_uuid = UUID(0xddd1)

size = 500
x_vec = np.linspace(0,1,size+1)[0:-1]
sensor_data = np.zeros(len(x_vec))
line1 = []

class MyDelegate(DefaultDelegate):
    def __init__(self, sensor_data, line1):
        DefaultDelegate.__init__(self)
        # ... initialise here
        self.sensor_data = sensor_data
        self.line1 = line1

    def handleNotification(self, cHandle, data):
        val = binascii.b2a_hex(data)
        val = binascii.unhexlify(val)
        val = struct.unpack('f', val)[0]
        # print(str(val))
        self.sensor_data[-1] = val
        self.line1 = live_plotter(x_vec,self.sensor_data,self.line1)
        self.sensor_data = np.append(self.sensor_data[1:],0.0)

# Initialisation  -------

p = Peripheral("D6:30:BD:2C:E4:58", "random")

try:
    p.setDelegate(MyDelegate(sensor_data, line1))

    # enable notification
    setup_data = b"\x01\x00"
    notify = p.getCharacteristics(uuid=red_uuid)[0]
    notify_handle = notify.getHandle() + 1
    p.writeCharacteristic(notify_handle, setup_data, withResponse=True)

    while(True):
        if p.waitForNotifications(1.0):
            # handleNotification() was called
            continue
        print("Waiting...")
        # Perhaps do something else here

finally:
    p.disconnect()
