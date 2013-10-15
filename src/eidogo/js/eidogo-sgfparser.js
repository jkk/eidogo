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
            c = this.getChar();
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
        var c = 0, lastKey = "", value = "", self = this;

        function readValue () {
            var c = self.getChar(), valueChars = [];

            while ( c !== "" && c !== ']')  {
                valueChars.push(c);
                c = self.getChar();
                if (c === '\\') {
                    c = self.getChar();
                }
            }

            return valueChars.join("");
        }
        function readKey() {
            var c = self.getChar(), keyChars = [];

            while ( c !== "" && c !== '['&& c !== ';' && c !== '(')  {
                keyChars.push(c);
                c = self.getChar();
                if (c === '\\') {
                    c = self.getChar();
                }
            }
            self.index--;
            return keyChars.join("");
        }

        while (this.index < this.sgf.length) {
            c = this.getChar();
            if (c === ';' || c === '(' || c === ')') {
                this.index--;
                break;
            } else if (c === '[') {  //Get a value!
                value = readValue();
                node.pushProperty(lastKey,value);
            } else if (c !== " " && c !== "\n" && c !== "\r" && c !== "\t") {  // Get a key
                this.index--;
                lastKey = readKey();
            }
        }
        return node;
    },
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
