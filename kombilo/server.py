#!/usr/bin/env python2.4
#
# Example inputs (must end with newline):
#   ne 6 5 .............O.......X........ corner
#   ne 6 6 .............OOOX....X....X.X....... corner
#
import os
from socket import *
from libkombilo import *

gl = GameList(os.path.join(os.path.dirname(os.path.abspath(__file__)), 't1.db'))

ss = socket(AF_INET, SOCK_STREAM)
ss.bind(('', 6060))
ss.listen(1)

while 1:
    (cs, ca) = ss.accept()
    
    #print "Accepted %s\n" % (str(ca))
    
    cf = cs.makefile('rw', 0)
    args = cf.readline().strip().split(' ')
    
    quadrant = args[0]
    width = int(args[1])
    height = int(args[2])
    pattern = args[3]
    algo = args[4]
    
    #print "Args:\n  q: %s, w: %d, h: %d, p: %s, a: %s\n" % (quadrant, width, height, pattern, algo)
    
    if algo == "center":
      algo = CENTER_PATTERN
    else:
        if quadrant == "nw":
            algo = CORNER_NW_PATTERN
        elif quadrant == "ne":
            algo = CORNER_NE_PATTERN
        elif quadrant == "sw":
            algo = CORNER_SW_PATTERN
        elif quadrant == "se":
            algo = CORNER_SE_PATTERN
    
    p = Pattern(algo, 19, width, height, pattern)
    
    so = SearchOptions()
    
    #print "Searching...\n"
    
    gl.search(p, so)
    
    #print "Done. Sending results...\n"
    
    for i in range(gl.size()):
        cf.write(gl.getCurrentProperty(i, 'filename') + "\t" +\
            gl.getCurrentProperty(i, 'PW') + "\t" +\
            gl.getCurrentProperty(i, 'WR') + "\t" +\
            gl.getCurrentProperty(i, 'PB') + "\t" +\
            gl.getCurrentProperty(i, 'BR') + "\t" +\
            gl.getCurrentProperty(i, 'RE') + "\t" +\
            gl.getCurrentProperty(i, 'DT') + "\t" +\
            gl.currentEntryAsString(i) + "\n");
    
    #print "Done. Closing connection...\n"
    
    cf.close()
    cs.close()
    
    #print "Resetting GameList...\n"
    
    gl.reset()
    
    #print "Done.\n\n"
