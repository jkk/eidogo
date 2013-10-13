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
        var keyTemp = "", c = 0, lastKey = "", value = "";

        while (this.index < this.sgf.length) {
            c = this.getChar();

            if (c === ';' || c === '(' || c === ')') {
                this.index--;
                break;
            } else if (c === '[') {
                value = "";
                lastKey = keyTemp || lastKey;
                keyTemp = "";

                c = this.getChar();

                while ( c !== ']')  {
                    value += c;
                    c = this.getChar();
                    if (c === '\\') {
                        c = this.getChar();
                    }
                }

                node.pushProperty(lastKey,value);
            } else if (c !== " " && c !== "\n" && c !== "\r" && c !== "\t") {
                keyTemp += c;
            }
        }
        return node;
    },
    getChar: function() {
        this.curChar = this.sgf.charAt(this.index);
        this.index++;
        return this.curChar;
    }
};
