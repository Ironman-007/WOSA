import pygatt
from binascii import hexlify

adapter = pygatt.GATTToolBackend()

def handle_data(handle, value):
    """
    handle -- integer, characteristic read handle the data was received on
    value -- bytearray, the data returned in the notification
    """
    print("Received data: %s" % hexlify(value))

try:
    adapter.start()
    device = adapter.connect('D6:30:BD:2C:E4:58')

    device.subscribe("0000ddd1-0000-1000-8000-00805f9b34fb", callback=handle_data)
finally:
    adapter.stop()