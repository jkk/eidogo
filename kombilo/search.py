#!/usr/bin/env python2.4

import os
import sys
import time
from libkombilo import *

if len(sys.argv) < 6:
	sys.exit(1)

quadrant = sys.argv[1]
width = int(sys.argv[2])
height = int(sys.argv[3])
pattern = sys.argv[4]
algo = sys.argv[5]

#start = time.time()
gl = GameList('../kombilo/t1.db')
#end = time.time()

#print gl.size(), 'games in the database'
#print 'Opening the db took %.2f seconds.' % (end - start)

# gl.gisearch("pw = 'Cho Chikun'")
# print gl.size(), 'games in the database'

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
# so.algos = ALGO_FINALPOS | ALGO_MOVELIST
# so.fixedColor = True
# so.nextMove = 2

start = time.time()
gl.search(p, so)
end = time.time()


#print gl.size(), 'games, ', gl.numHits(), 'hits.'
#print 'This search took %.2f seconds.' % (end - start)

for i in range(gl.size()):
    print gl.getCurrentProperty(i, 'filename') + "\t" +\
        gl.getCurrentProperty(i, 'PW') + "\t" +\
        gl.getCurrentProperty(i, 'WR') + "\t" +\
        gl.getCurrentProperty(i, 'PB') + "\t" +\
        gl.getCurrentProperty(i, 'BR') + "\t" +\
        gl.getCurrentProperty(i, 'RE') + "\t" +\
        gl.getCurrentProperty(i, 'DT') + "\t" +\
        gl.currentEntryAsString(i);
#	print gl.currentEntryAsString(i) + "\t" + gl.getCurrentProperty(i, 'filename')
# print '\n'.join(gl.currentEntriesAsStrings())

#print 'Search pattern:'
#print p.printPattern()
#print 'Continuations:'
#for y in range(p.sizeY):
#    for x in range(p.sizeX):
#        print gl.lookupLabel(x,y),
#    print

#print
#print "Statistics:" 
#print "Continuation | Black ( B wins / W wins ) | White (B wins / W wins) |"
#for y in range(p.sizeY):
#    for x in range(p.sizeX):
#        if gl.lookupLabel(x,y) != '.':
#            cont = gl.lookupContinuation(x,y);
#            print "      %c      |   %3d (    %3d /    %3d ) |   %3d (   %3d /    %3d) |" % \
#                  (gl.lookupLabel(x,y), cont.B, cont.wB, cont.lB, cont.W, cont.wW, cont.lW)

# p = Pattern(CENTER_PATTERN, 19, 2, 2, 'XO' + 'OX') 
# start = time.time()
# gl.search(p)
# end = time.time()
# print '\n'.join(gl.currentEntriesAsStrings())
# print gl.size(), 'games, ', gl.numHits(), 'hits.'
# print 'This search took %.2f seconds.' % (end - start)

# print gl.currentEntryAsString(gl.size()-1)
# print gl.getCurrentProperty(gl.size()-1, 'PW'),  gl.getSGF(gl.size()-1)

# gl.reset()
# gl.tagsearch(HANDI_TAG)
# print gl.size(), 'handicap games'

# print gl.plSize(), 'players in the whole database.'
# for i in range(100,110):
#     print 'Player %d: %s' % (i, gl.plEntry(i))

#for sig in ['cfcgjbbeckjc', 'qfqgjbreqkjc', 'aaaaaaaaaaaa', 'dfcnfmepgkjo', 'dfcn________', 'dfcn%']:
    # SQL-wildcards are allowed: _ for a single character, % for an arbitrary number of characters
#    gl.reset()
#    gl.sigsearch(sig, 19)
#    print gl.size(), 'games with signature', sig
# gl.reset()
# print gl.currentEntryAsString(200)
# print 'signature of game 200: ', gl.getSignature(200)

# check for duplicates
#gl.reset()
#i = gl.find_duplicates(19)
#for j in range(i):
#    dupl = gl.retrieve_duplicates_VI(j)
#    for x in dupl:
#        print x, gl.currentEntryAsString(x)

