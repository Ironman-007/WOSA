import binascii
import struct
import time
from bluepy.btle import UUID, Peripheral, DefaultDelegate

from PyQt5 import QtWidgets, QtCore, QtGui
from pyqtgraph import PlotWidget, plot
import pyqtgraph as pg

from numpy import *

import sys  # We need sys so that we can pass argv to QApplication
import os

red_uuid = UUID(0xddd1)

app = QtGui.QApplication([])
win = pg.GraphicsWindow(title="Signal from serial port")
p = win.addPlot(title="Realtime plot")
curve = p.plot()

windowWidth = 500                       # width of the window displaying the curve
Xm = linspace(0,0,windowWidth)          # create array that will contain the relevant time series     
ptr = -windowWidth                      # set first x position

class MyDelegate(DefaultDelegate):
    def __init__(self):
        DefaultDelegate.__init__(self)
        # ... initialise here

    def handleNotification(self, cHandle, data):
        global curve, ptr, Xm
        val = binascii.b2a_hex(data)
        val = binascii.unhexlify(val)
        val = struct.unpack('f', val)[0]
        # print(str(val))

        Xm[:-1] = Xm[1:]                      # shift data in the temporal mean 1 sample left
        Xm[-1] = float(val)                   # vector containing the instantaneous values      
        ptr += 1                              # update x position for displaying the curve
        curve.setData(Xm)                     # set the curve with this data
        curve.setPos(ptr,0)                   # set x position in the graph to 0
        QtGui.QApplication.processEvents()    # you MUST process the plot now

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
    pg.QtGui.QApplication.exec_() # you MUST put this at the end

finally:
    p.disconnect()
    ### END QtApp ####
    pg.QtGui.QApplication.exec_() # you MUST put this at the end
    
