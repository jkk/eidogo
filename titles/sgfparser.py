# File: sgfparser.py

##   Copyright (C) 2001-4 Ulrich Goertz (u@g0ertz.de)

##   This is part of Kombilo, a go database program.

##   This program is free software; you can redistribute it and/or modify
##   it under the terms of the GNU General Public License as published by
##   the Free Software Foundation; either version 2 of the License, or
##   (at your option) any later version.

##   This program is distributed in the hope that it will be useful,
##   but WITHOUT ANY WARRANTY; without even the implied warranty of
##   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
##   GNU General Public License for more details.

##   You should have received a copy of the GNU General Public License
##   along with this program (see doc/license.txt); if not, write to the Free Software
##   Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
##   The GNU GPL is also currently available at
##   http://www.gnu.org/copyleft/gpl.html


import re
import string

class SGFError(Exception): pass

reGameStart = re.compile(r'\(\s*;')
reRelevant = re.compile(r'[\[\]\(\);]')
reStartOfNode = re.compile(r'\s*;\s*')

def SGFescape(s):
    t = string.replace(s, '\\', '\\\\')
    t = string.replace(t, ']', '\\]')
    return t

class Node:
    def __init__(self, previous=None, SGFstring = '', level=0):
        self.previous = previous
        self.next = None
        self.up = None
        self.down = None
        self.level = level # self == self.previous.next[self.level]

        self.numChildren = 0
        
        self.SGFstring = SGFstring
        self.parsed = 0
        if self.SGFstring:
            self.parseNode()
        else:
            self.data = {}

        self.posyD = 0


    def getData(self):
        if not self.parsed: self.parseNode()
        return self.data

    def pathToNode(self):
        l = []
        n = self

        while n.previous:
            l.append(n.level)
            n = n.previous
            
        l.reverse()
        return l


    def parseNode(self):

        if self.parsed: return

        s = self.SGFstring
        i = 0

        match = reStartOfNode.search(s, i)
        if not match:
            raise SGFError('No node found')
        i = match.end()

        node = {}
        while i < len(s):

            while i < len(s) and s[i] in string.whitespace: i += 1
            if i >= len(s): break
            
            ID = []
            
            while not s[i] == '[':
                if s[i] in string.uppercase:
                    ID.append(s[i])
                elif not s[i] in string.lowercase + string.whitespace:
                    raise SGFError('Invalid Property ID')
                    
                i += 1

                if i >= len(s):
                    raise SGFError('Property ID does not have any value')

            i += 1

            key = string.join(ID, '')

            if key == '': raise SGFError('Property does not have a correct ID')


            if node.has_key(key):
                if not Node.sloppy:
                    raise SGFError('Multiple occurrence of SGF tag')
            else:
                node[key] = []
                
            propertyValueList = []
            while 1:
                propValue = []
                while s[i] != ']':
                    if s[i] == '\t':      # convert whitespace to ' '
                        propValue.append(' ')
                        i += 1
                        continue
                    if s[i] == '\\':
                        i += 1            # ignore escaped characters, throw away backslash
                        if s[i:i+2] in ['\n\r', '\r\n']:
                            i += 2
                            continue
                        elif s[i] in ['\n', '\r']:
                            i += 1
                            continue
                    propValue.append(s[i])
                    i += 1
                    
                    if i >= len(s):
                        raise SGFError('Property value does not end')

                propertyValueList.append(string.join(propValue, ''))

                i += 1
                        
                while i < len(s) and s[i] in string.whitespace:
                    i += 1
                    
                if i >= len(s) or s[i] != '[': break   
                else: i += 1

            if key in ['B', 'W', 'AB', 'AW']:
                for N in range(len(propertyValueList)):
                    en = propertyValueList[N]
                    if Node.sloppy:
                        en = string.replace(en, '\n', '')
                        en = string.replace(en, '\r', '')
                    if not (len(en) == 2 or (len(en) == 0 and key in ['B', 'W'])):
                        raise SGFError('')
                    propertyValueList[N] = en
                                            
            node[key].extend(propertyValueList)
            
        self.data = node
        self.parsed = 1


Node.sloppy = 1

# ------------------------------------------------------------------------------------

class Cursor:

    """ Initialized with an SGF file. Then use game(n); next(n), previous to navigate.
    self.collection is list of Nodes, namely of the root nodes of the game trees.
    
    self.currentN is the current Node
    self.currentNode() returns self.currentN.data 

    The sloppy option for __init__ determines if the following things, which are not allowed
    according to the SGF spec, are accepted nevertheless:
     - multiple occurrences of a tag in one node
     - line breaks in AB[]/AW[]/B[]/W[] tags (e.g. "B[a\nb]")
    """


    def __init__(self, sgf, sloppy = 1):
        Node.sloppy = sloppy

        self.height = 0
        self.width = 0
        self.posx = 0
        self.posy = 0

        self.root = Node(None, '', 0)
        
        self.parse(sgf)
        self.currentN = self.root.next

        
    def atEnd(self):
        if self.currentN.next: return 0
        return 1

    def atStart(self):
        if self.currentN.previous: return 0
        else: return 1
        
    def noChildren(self):
        return self.currentN.numChildren

    def currentNode(self):
        if not self.currentN.parsed:
            self.currentN.parseNode()
        return self.currentN.data

    def parse(self, sgf):

        curr = self.root
        
        p = -1           # start of the currently parsed node
        c = []           # list of nodes from which variations started
        last = ')'       # type of last aprsed bracked ('(' or ')')
        inbrackets = 0   # are the currently parsed characters in []'s?

        height_previous = 0
        width_currentVar = 0

    	i = 0 # current parser position

        # skip everything before first (; :

        match = reGameStart.search(sgf, i)
        if not match:
            raise SGFError('No game found')

        i = match.start()
        
        while i < len(sgf):

	    match = reRelevant.search(sgf, i)
	    if not match:
		break
	    i = match.end() - 1
	    
            if inbrackets:
                if sgf[i]==']':
                    numberBackslashes = 0
                    j = i-1
                    while sgf[j] == '\\':
                        numberBackslashes += 1
                        j -= 1
                    if not (numberBackslashes % 2):
                        inbrackets = 0
                i = i + 1
                continue

            if sgf[i] == '[':
                inbrackets = 1
        
            if sgf[i] == '(':
                if last != ')':       # start of first variation of previous node
                    if p != -1: curr.SGFstring = sgf[p:i]

                nn = Node()
                nn.previous = curr

                width_currentVar += 1
                if width_currentVar > self.width: self.width = width_currentVar
                
                if curr.next:
                    last = curr.next
                    while last.down: last = last.down
                    nn.up = last
                    last.down = nn
                    nn.level = last.level + 1
                    self.height += 1
                    nn.posyD = self.height - height_previous
                else:
                    curr.next = nn
                    nn.posyD = 0
                    height_previous = self.height

                curr.numChildren += 1
                
                c.append((curr, width_currentVar-1, self.height))
                
                curr = nn
                
                p = -1
                last = '('
        
            if sgf[i] == ')':
                if last != ')' and p != -1:
                    curr.SGFstring = sgf[p:i]
                try:
                    curr, width_currentVar, height_previous = c.pop()
                except IndexError:
                    raise SGFError('Game tree parse error')
                last = ')'

            if sgf[i] == ';':
                if p != -1:
                    curr.SGFstring = sgf[p:i]
                    nn = Node()
                    nn.previous = curr
                    width_currentVar += 1
                    if width_currentVar > self.width: self.width = width_currentVar
                    nn.posyD = 0
                    curr.next = nn
                    curr.numChildren = 1
                    curr = nn
                p = i

	    i = i + 1

        if inbrackets or c:
            raise SGFError('Game tree parse error')

        n = curr.next
        n.previous = None
        n.up = None

        while n.down:
            n = n.down
            n.previous = None


    def game(self, n):
        if n < self.root.numChildren:
            self.posx = 0
            self.posy = 0
            self.currentN = self.root.next
            for i in range(n): self.currentN = self.currentN.down
        else:
            raise SGFError('Game not found')


    def delVariation(self, c):

        if c.previous:
            self.delVar(c)
        else:
            if c.next:
                node = c.next
                while node.down:
                    node = node.down
                    self.delVar(node.up)
      
                self.delVar(node)
    
            c.next = None


    def delVar(self, node):
        if node.up: node.up.down = node.down
        else: node.previous.next = node.down
  
        if node.down:
            node.down.up = node.up
            node.down.posyD = node.posyD
            n = node.down
            while n: 
                n.level -= 1
                n = n.down

        h = 0
        n = node
        while n.next:
            n = n.next
            while n.down:
                n = n.down
                h += n.posyD

        if node.up or node.down: h += 1

        p = node.previous
        p.numChildren -= 1

        while p:
            if p.down: p.down.posyD -= h
            p = p.previous
  

        self.height -= h


    def add(self, st):
        node = Node(self.currentN,st,0)

        node.down = None
        node.next = None
        node.numChildren = 0

        if not self.currentN.next:
            node.level = 0
            node.posyD = 0
            node.up = 0

            self.currentN.next = node
            self.currentN.numChildren = 1
        else:
            n = self.currentN.next
            while n.down:
                n = n.down
                self.posy += n.posyD
                
    
            n.down = node
            node.up = n
            node.level = n.level + 1
            node.next = None
            self.currentN.numChildren += 1

            node.posyD = 1
            while n.next:
                n = n.next
                while n.down:
                    n = n.down
                    node.posyD += n.posyD
      
            self.posy += node.posyD

            self.height += 1

            n = node
            while n.previous:
                n = n.previous
                if n.down: n.down.posyD += 1

        self.currentN = node

        self.posx += 1
        if self.posx > self.width: self.width += 1


    def next(self, n=0):
        if n >= self.noChildren():
            raise SGFError('Variation not found')

        self.posx += 1

        self.currentN = self.currentN.next
        for i in range(n):
            self.currentN = self.currentN.down
            self.posy += self.currentN.posyD 
        return self.currentNode()
    
    def previous(self):
        if self.currentN.previous:
            while self.currentN.up:
                self.posy -= self.currentN.posyD
                self.currentN = self.currentN.up
            self.currentN = self.currentN.previous
            self.posx -= 1
        else: 
            raise SGFError('No previous node')
        return self.currentNode()

    def getRootNode(self, n):
        if not self.root: return
        if n >= self.root.numChildren: raise SGFError('Game not found')

        nn = self.root.next
        for i in range(n): nn = nn.down

        if not nn.parsed: nn.parseNode()

        return nn.data


    def updateCurrentNode(self):
        """ Put the data in self.currentNode into the corresponding string in self.collection.
        This will be called from an application which may have modified self.currentNode."""

        self.currentN.SGFstring = self.nodeToString(self.currentN.data)
        

    def updateRootNode(self, data, n=0):
        if n >= self.root.numChildren:
            raise SGFError('Game not found')

        nn = self.root.next
        for i in range(n): nn = nn.down
        
        nn.SGFstring = self.rootNodeToString(data)
        nn.parsed = 0
        nn.parseNode()


    def rootNodeToString(self, node):
       
        result = [';']
        keylist = ['GM', 'FF', 'SZ', 'PW', 'WR', 'PB', 'BR',
                   'EV', 'RO', 'DT', 'PC', 'KM', 'RE', 'US', 'GC']
        for key in keylist:
            if node.has_key(key):
                result.append(key)
                result.append('[' + SGFescape(node[key][0]) + ']\n')
                
        l = 0
        for key in node.keys():
            if not key in keylist:
                result.append(key)
                l += len(key)
                for item in node[key]:
                    result.append('[' + SGFescape(item) + ']\n')
                    l += len(item) + 2
                    if l > 72:
                        result.append('\n')
                        l = 0
                        
        return string.join(result, '')

    def nodeToString(self, node):
        l = 0
        result = [';']
        for k in node.keys():
            if l + len(k) > 72:
                result.append('\n')
                l = 0
            if not node[k]: continue
            result.append(k)
            l += len(k) 
            for item in node[k]:
                if l + len(item) > 72:
                    result.append('\n')
                    l = 0
                l += len(item) + 2
                result.append('[' + SGFescape(item) + ']')

        return string.join(result, '')


    def outputVar(self, node):

        result = []
        
        result.append(node.SGFstring)

        while node.next:
            node = node.next

            if node.down:
                while node.down:
                    result.append('(' + self.outputVar(node) + ')' )
                    node = node.down

                result.append('(' + self.outputVar(node) + ')' )
                return string.join(result, '')

            else:
                result.append(node.SGFstring)

        return string.join(result, '')



    def output(self):
        result = []

        n = self.root.next

        while n:
            result.append('(' + self.outputVar(n)+ ')\n')
            n = n.down

        return string.join(result, '')


