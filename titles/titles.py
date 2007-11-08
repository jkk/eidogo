#!/usr/bin/env python2.5

import os
import sqlite3

con = sqlite3.connect(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'titles.db'), isolation_level=None)
cur = con.cursor()

cur.execute("select * from games order by dt desc limit 250")
rows = cur.fetchall()

f = open("titles.html", "w")
f.write("<table id='tourney-games'><tr><th>Date</th><th>Event</th><th>White</th><th>Black</th><th>Result</th></tr>")
cl = ""
for row in rows:
    if (cl == " class='odd'"):
        cl = " class='even'"
    else:
        cl = " class='odd'"
    fn = row[0].replace(".sgf", "")
    f.write("<tr" + cl + ">")
    for col in row[1:]:
        f.write("<td><a href='./#titles/" + fn + "'>" + col + "</a></td>")
    f.write("</tr>")
f.write("</table>")
f.close()