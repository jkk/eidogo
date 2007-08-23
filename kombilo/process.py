#! /usr/bin/env python2.4

# from pysqlite2 import dbapi2
import os
import os.path
import sys
import glob
import time
from libkombilo import *

try: 
    os.system('rm t1.db*')
except: 
    pass

def process(filenames):
    """Process a list of sgf files, put the game info into "table" of the database
    given by con, and call the relevant processing functions for the algorithms in algos"""

    starttime = time.time()
    try:
        pop = ProcessOptions()
        # pop.algos = 0
        # pop.rootNodeTags = 'PW,PB,RE,DT'
        pop.sgfInDB = False
        pop.algos = ALGO_FINALPOS | ALGO_MOVELIST
        gl = GameList('t1.db', 'id', '', pop, 100)
    except DBError:
        print 'Database error'
    gl.start_processing()
    counter = 0
    i = 0;
    for filename in filenames:
        i += 1
        if i % 4 != 0:
            continue
        # print filename
        try:
            file = open(filename)
            sgf = file.read()
            file.close()
        except:
            print 'Unable to read file %s' % filename
            continue

        path, fn = os.path.split(filename)
        if gl.process(sgf, path, fn, '', CHECK_FOR_DUPLICATES_STRICT):
            if gl.process_results() & IS_DUPLICATE: 
                print 'duplicate', counter
        else: print 'SGF error'
        counter += 1
        
    gl.finalize_processing()
    print 'Processed %d games in %.2f seconds' % (counter, time.time()-starttime)

# filelist = glob.glob('./*.sgf')
# filelist = glob.glob('/home/ug/go/KGS2005/*.sgf')
# filelist = glob.glob('/Users/tin/Sites/eidogo/sgf/downloaded/Honinbo/*.sgf')
filelist = glob.glob('/Users/tin/Sites/eidogo/sgf/games/*.sgf')

filelist.sort()
process(filelist)

gl = GameList("t1.db", "id", "")

# .X.
# .OX
# .OX
# .OX
# OXO
p = Pattern(CENTER_PATTERN, 19, 3, 5, ".X..OX.OX.OXOXO")
so = SearchOptions()

gl.reset()
gl.search(p, so)

for i in range(gl.size())[-10:]:
      print gl.currentEntryAsString(i)


