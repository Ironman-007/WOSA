import binascii
import struct
import time
from bluepy.btle import UUID, Peripheral
 
temp_uuid = UUID(0xddd1)
 
p = Peripheral("D6:30:BD:2C:E4:58", "random")
 
try:
    ch = p.getCharacteristics(uuid=temp_uuid)[0]
    if (ch.supportsRead()):
        while 1:
            val = binascii.b2a_hex(ch.read())
            val = binascii.unhexlify(val)
            val = struct.unpack('f', val)[0]
            print(str(val) + " deg C")
 
finally:
    p.disconnect()