import binascii
import struct
import time
from bluepy.btle import UUID, Peripheral, DefaultDelegate

red_uuid = UUID(0xddd1)

class MyDelegate(DefaultDelegate):
    def __init__(self):
        DefaultDelegate.__init__(self)
        # ... initialise here

    def handleNotification(self, cHandle, data):
        print(data)
# Initialisation  -------

p = Peripheral("D6:30:BD:2C:E4:58", "random")

try:
    p.setDelegate(MyDelegate())

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