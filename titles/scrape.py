#!/usr/bin/env python2.5

import sys
import sqlite3
import urllib2
from BeautifulSoup import BeautifulSoup
import re
import os
import sgfparser

curdir = os.path.dirname(os.path.abspath(__file__))
con = sqlite3.connect(os.path.join(curdir, 'titles.db'), isolation_level=None)
cur = con.cursor()
cur.executescript("""
    create table if not exists notices (
        sig text primary key
    );
    create table if not exists games (
        fn text primary key,
        dt text,
        ev text,
        pw text,
        pb text,
        re text
    );
""")

base_url = "http://igo-kisen.hp.infoseek.co.jp/"
# base_url = "http://eidogo_dev/titles/"
re_tags = re.compile("<[^>]+>")

def scrape_news():
    page = urllib2.urlopen(base_url + "news.html")
    soup = BeautifulSoup(page)
    scraped_subpages = []
    trs = soup.findAll("tr", {"align": "center"})
    for tr in trs:
        tds = tr.findAll("td")
        if (len(tds) == 0):
            continue
        sig = []
        for td in tds:
            sig.append(re_tags.sub("", str(td.contents[0])))
        sig = ' '.join(sig)
        
        cur.execute("select * from notices where sig=?", (sig,))
        if (cur.fetchone()):
            continue
        cur.execute("insert into notices (sig) values (?)", (sig,))
        
        subpage_fn = tr.a['href']
        if (scraped_subpages.count(subpage_fn) > 0):
            continue
        print subpage_fn
        scraped_subpages.append(subpage_fn)
        scrape_subpage(subpage_fn)

def scrape_topics():
    page = urllib2.urlopen(base_url + "topics.html")
    soup = BeautifulSoup(page)
    scraped_subpages = []
    trs = soup.find("table", {"width": "1050"}).findAll("tr")
    dt = ""
    for tr in trs:
        tds = tr.findAll("td")
        if (len(tds) == 0):
            continue
        td0 = tds.pop(0).contents[0]
        if (td0 != "&nbsp;"):
            dt = td0
        sig = [dt]
        for td in tds:
            sig.append(re_tags.sub("", str(td.contents[0])))
        sig = ' '.join(sig)
        
        cur.execute("select * from notices where sig=?", (sig,))
        if (cur.fetchone()):
            continue
        cur.execute("insert into notices (sig) values (?)", (sig,))
    
        subpage_fn = tr.a['href']
        if (scraped_subpages.count(subpage_fn) > 0):
            continue
        print subpage_fn
        scraped_subpages.append(subpage_fn)
        scrape_subpage(subpage_fn)

def scrape_subpage(subpage_fn):
    try:
        subpage = urllib2.urlopen(base_url + subpage_fn)
    except:
        print "! not found"
        return
    subsoup = BeautifulSoup(subpage)
    
    sgf_path = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../sgf/titles'))
    
    for a in subsoup.findAll("a"):
        fn = a['href']
        if (not fn.endswith(".sgf")):
            continue
        cur.execute("select * from games where fn=?", (fn,))
        if (cur.fetchone()):
            continue
        try:
            raw_sgf = urllib2.urlopen(base_url + fn).read()
        except:
            print "  ! " + fn + " not found"
            continue
        if (len(raw_sgf) > 0):
            print "  " + fn
            sgf = sgfparser.Cursor(raw_sgf)
            info = sgf.getRootNode(0)
            cur.execute(
                "insert into games (fn, dt, ev, pw, pb, re) values (?,?,?,?,?,?)",
                (fn,
                 info['DT'][0],
                 info['EV'][0],
                 info['PW'][0] + ' ' + info['WR'][0],
                 info['PB'][0] + ' ' + info['BR'][0],
                 info['RE'][0]))
            f = open(os.path.join(sgf_path, fn), "w")
            f.write(raw_sgf)
            f.close()

def output_games():
    cur.execute("select * from games order by dt desc limit 250")
    rows = cur.fetchall()

    f = open(os.path.join(curdir, 'titles.html'), "w")
    f.write("<table id='tourney-games'><tr>" +
            "<th>Date</th><th>Event</th><th>White</th><th>Black</th><th>Result</th>" +
            "</tr>")
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

scrape_news()
output_games()