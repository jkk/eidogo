#! /usr/bin/env python2.4

import os
import sys
import time
from libkombilo import *

gl = GameList('t1.db', '', '[[PW]] - [[PB]] ([[winner]]), [[filename]], ')
print gl.size(), 'games in the database'

contList = vectorMNC() # this is a little awkward at the moment ...
for m in [MoveNC(6,15,'X'), MoveNC(6,13,'O'), MoveNC(4,15,'X')]: contList.push_back(m)

p = Pattern(FULLBOARD_PATTERN, 19, 19, 19,
            '...................' + \
            '..O.O........OX....' + \
            '..XO......X.OXX.XX.' + \
            '..X,.OOXXX..OOOX.O.' + \
            '...X.OXOOXOO..OX...' + \
            '....XOXXOXXOOXXOO..' + \
            '..OX.XXXOOOXO.O.O..' + \
            '.OXX..XOX..XO.X.XO.' + \
            '..O.......X.....XO.' + \
            '.O.,X....,.....XOO.' + \
            '...............X...' + \
            '...X............X..' + \
            '..O................' + \
            '...................' + \
            '........O.O........' + \
            '...O.....,.....X...' + \
            '........X.O.X......' + \
            '...................' + \
            '...................', contList)

# p = Pattern(FULLBOARD_PATTERN, 19, 19, 19, "..O.O....X...XXXXX.OOXO....OXO.XXOOOXOXXXXOO.OOXO.OXO..O..X.X..OOX,X.XO.O.....XOOOXOXX..XO......X.XOXXX..XXXO........XOX..XXOOXO.OOO.....OOXOXOO.O...XX...X..OXXOO.XOX........O..OX.,..X..X.....X...OX...X..........O....XXXO...XO...X...OOOXOOXX...X....O..OX.O..OX..........OXX....OX..OO..O.OOOOX..O.OX..XX..OOXXXOX.XOOX..X....XXXXXOX...OX.......X.O.XO.............")

start = time.time()
gl.search(p, SearchOptions())
end = time.time()
print '\n'.join(gl.currentEntriesAsStrings())
print gl.size(), 'games, ', gl.numHits(), 'hits.'
for i in range(19):
    print ' '.join(gl.labels[19*i:19*i+19])
print 'This search took %.2f seconds.' % (end - start)

print 'Search again without using the hashing algorithm.'
gl.reset()
print gl.size(), 'games in the database.'
so = SearchOptions()
so.algos = ALGO_MOVELIST | ALGO_FINALPOS
start = time.time()
gl.search(p, so)
end = time.time()
print gl.size(), 'games, ', gl.numHits(), 'hits.'
print 'This search took %.2f seconds.' % (end - start)

