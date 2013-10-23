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
    this.sgf = sgf[0] ===';' ? sgf.slice(1) : sgf; //Support SGF fragments
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
                break;
            case '(':
                nodeStack.push(curNode);
                break;
            case ')':
                curNode = nodeStack.pop();
                break;
            case '\r':
            case '\n':
            case ' ':
            case '\t':
                continue;
            default:
                this.index--;
                this.parseProperties(curNode); //Doing this here, instead of after ';' allows us to parse root node properties.
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
            var c = nextChar(), valueChars = "";

            while ( c !== "" && c !== ']')  {
                valueChars += c;
                c = nextChar();
                if (c === '\\') {
                    c = nextChar();
                }
            }

            return valueChars;
        }
        function readKey(c) {
            var keyChars = "";

            while ( c !== "" && c !== '['&& c !== ';' && c !== '(')  {
                keyChars += c;
                c = nextChar();
            }
            self.index--;
            return keyChars;
        }

        while (this.index < this.sgf.length) {
            c = nextChar();
            switch (c)
            {
            case ';':
            case '(':
            case ')':
                this.index--;
                return;
            case '[':
                node.pushProperty(lastKey, readValue());
                break;
            case '\r':
            case '\n':
            case ' ':
            case '\t':
                continue;
            default:
                lastKey = readKey(c);
            }
        }
        return node;
    }
};
