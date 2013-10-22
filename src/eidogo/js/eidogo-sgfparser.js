/**
 * EidoGo -- Web-based SGF Editor
 * Copyright (c) 2007, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under AGPLv3:
 * http://www.fsf.org/licensing/licenses/agpl-3.0.html
 */

/**
 * @class Returns an SGF-like JSON object of the form:
 *      { PROP1: value,  PROP2: value, ..., _children: [...]}
 */

var NS = Y.namespace('Eidogo');

NS.SgfParser = function(sgf, completeFn) {
    this.sgf = sgf;
    this.index = 0;
    this.curChar = "";
    this.root = new NS.GameNode();
    this.parseTree(this.root);
    if( typeof completeFn === "function" ) { completeFn.call(this); }
};

NS.SgfParser.NAME = 'eidogo-sgfparser';

NS.SgfParser.prototype =  {
    parseTree: function(startNode) {
        var nodeStack = [], c;

        curNode = startNode;
        while (this.index < this.sgf.length) {
            c = this.sgf.charAt(this.index++);
            switch (c) {
            case ';':
                curNode = curNode.appendChild();
                this.parseProperties(curNode);
                break;
            case '(':
                nodeStack.push(curNode);
                break;
            case ')':
                curNode = nodeStack.pop();
                break;
            }
        }
    },

    parseProperties: function(node) {
        var c = 0, lastKey = "", self = this;
        function nextChar()
        {
            return self.sgf.charAt(self.index++);
        }

        function readValue () {
            var c = nextChar(), valueChars = ""; //oldIndex = self.index - 1;

            while ( c !== "" && c !== ']')  {
                valueChars += c;
                c = nextChar();
                if (c === '\\') {
                    c = nextChar();
                }
            }

            return valueChars;
            //return self.sgf.slice(oldIndex,self.index - 1);
        }
        function readKey(c) {
            var keyChars = "";
            //var oldIndex = self.index - 1;

            while ( c !== "" && c !== '['&& c !== ';' && c !== '(')  {
                keyChars += c;
                c = nextChar();
            }
            self.index--;
            return keyChars;
            //return self.sgf.slice(oldIndex,self.index);
        }

        while (this.index < this.sgf.length) {
            c = nextChar();
            if (c === ';' || c === '(' || c === ')') {
                this.index--;
                break;
            } else if (c === '[') { //Get a value!
                node.pushProperty(lastKey, readValue());
            } else if (c !== " " && c !== "\n" && c !== "\r" && c !== "\t") {  // Get a key
                lastKey = readKey(c);
            }
        }
        return node;
    },

//Old?
    getChar: function() {
        var oldChar = this.curChar;
        
        this.curChar = this.sgf.charAt(this.index);
        this.index++;

        //Compress whitespace.  We don't want to return who consecutive whitespace characters.
        if( (this.curChar === " " || this.curChar === "\n" || this.curChar === "\r" || this.curChar === "\t") &&
            (oldChar === " " || oldChar === "\n" || oldChar === "\r" || oldChar === "\t")) {
            this.getChar();
        }
        return this.curChar;
    }
};
