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
    this.root = new NS.GameNode();
    this.parseTree(this.root);
    if( typeof completeFn === "function" ) { completeFn.call(this); }
};

NS.SgfParser.NAME = 'eidogo-sgfparser';

NS.SgfParser.prototype =  {
    parseTree: function(startNode) {
        var index = 0, nodeStack = [], c, lastKey, self=this, curNode;

        function nextChar()
        {
            return self.sgf.charAt(index++);
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
            index--;
            return keyChars;
        }

        curNode = startNode;
        while (index < this.sgf.length) {
            c = nextChar();

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
            case '[':
                curNode.pushProperty(lastKey, readValue());
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

    }
};
