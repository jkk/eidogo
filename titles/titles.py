#!/usr/bin/env python2.5

import os
import sqlite3
import simplejson

con = sqlite3.connect(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'titles.db'), isolation_level=None)
cur = con.cursor()

cur.execute("select * from games order by dt desc limit 200")
rows = cur.fetchall()

print simplejson.dumps(rows)
