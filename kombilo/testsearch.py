#! /usr/bin/env python2.4

import os
import sys
import time
from libkombilo import *

start = time.time()
gl = GameList('t1.db')
end = time.time()
print gl.size(), 'games in the database'
print 'Opening the db took %.2f seconds.' % (end - start)
# gl.gisearch("pw = 'Cho Chikun'")
# print gl.size(), 'games in the database'

# p = Pattern(CENTER_PATTERN, 19, 3,4,"..O.....OX..")
p = Pattern(CORNER_NW_PATTERN, 19, 7, 7, 
      '''.......
         .......
         .......
         ...X...
         .......
         .......
         .......'''.replace(' ','').replace('\n',''))
# p = Pattern(CORNER_SW_PATTERN, 19, 7, 7, '........................X........................')
# p = Pattern(CENTER_PATTERN, 19, 3, 3, '.X.XXXXOX')
# p = Pattern(CENTER_PATTERN, 19, 3, 5, '.X.' + '.OX' + '.OX' + '.OX' + 'OXO') 
# p = Pattern(CENTER_PATTERN, 19, 5, 4, '..XOO'+ '...XX'+ '.....'+ '..X..') 
so = SearchOptions()
# so.algos = ALGO_FINALPOS | ALGO_MOVELIST
# so.fixedColor = True
# so.nextMove = 2
start = time.time()
gl.search(p, so)
end = time.time()
# for i in range(gl.size()):
#     print gl.currentEntryAsString(i)
#     print gl.getCurrentProperty(i, 'EV')
# print '\n'.join(gl.currentEntriesAsStrings())
print gl.size(), 'games, ', gl.numHits(), 'hits.'
print 'Search pattern:'
print p.printPattern()
print 'Continuations:'
for y in range(p.sizeY):
    for x in range(p.sizeX):
        print gl.lookupLabel(x,y),
    print

print
print "Statistics:" 
print "Continuation | Black ( B wins / W wins ) | White (B wins / W wins) |"
for y in range(p.sizeY):
    for x in range(p.sizeX):
        if gl.lookupLabel(x,y) != '.':
            cont = gl.lookupContinuation(x,y);
            print "      %c      |   %3d (    %3d /    %3d ) |   %3d (   %3d /    %3d) |" % \
                  (gl.lookupLabel(x,y), cont.B, cont.wB, cont.lB, cont.W, cont.wW, cont.lW)
print 'This search took %.2f seconds.' % (end - start)

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

for sig in ['cfcgjbbeckjc', 'qfqgjbreqkjc', 'aaaaaaaaaaaa', 'dfcnfmepgkjo', 'dfcn________', 'dfcn%']:
    # SQL-wildcards are allowed: _ for a single character, % for an arbitrary number of characters
    gl.reset()
    gl.sigsearch(sig, 19)
    print gl.size(), 'games with signature', sig
# gl.reset()
# print gl.currentEntryAsString(200)
# print 'signature of game 200: ', gl.getSignature(200)

# check for duplicates
gl.reset()
i = gl.find_duplicates(19)
for j in range(i):
    dupl = gl.retrieve_duplicates_VI(j)
    for x in dupl:
        print x, gl.currentEntryAsString(x)

