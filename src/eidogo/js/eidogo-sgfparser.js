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
    completeFn = (typeof completeFn == "function") ? completeFn : null;
    this.sgf = sgf;
    this.index = 0;
    this.curChar = "";
    this.root = new NS.GameNode();
    this.parseTree(this.root);
    completeFn && completeFn.call(this);
}

NS.SgfParser.NAME = 'eidogo-sgfparser';

NS.SgfParser.prototype =  {
    parseTree: function(startNode) {
        var nodeStack = [];

        curNode = startNode;
        while (this.index < this.sgf.length) {
            var c = this.getChar();
            switch (c) {
            case ';':
                curNode = curNode.appendChild();
                this.parseProperties(curNode);
                break;
            case '(':
                nodeStack.push(curNode);
                //curNode = curNode.appendChild();
                break;
            case ')':
                curNode = nodeStack.pop();
                break;
            }
        }
    },

    parseProperties: function(node) {
        var keyTemp = "";
        var i = 0;
        var c = 0;
        var lastKey = "";
        while (this.index < this.sgf.length) {
            var c = this.getChar();

            if (c == ';' || c == '(' || c == ')') {
                this.index--;
                break;
            } else if (c == '[') {
                var value = ""
                var lastKey = keyTemp || lastKey;
                keyTemp = "";

                c = this.getChar();

                while ( c != ']')  {
                    value += c;
                    c = this.getChar();
                    if (c == '\\') {
                        c = this.getChar();
                    }
                }

                node.pushProperty(lastKey,value);
            } else if (c != " " && c != "\n" && c != "\r" && c != "\t") {
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
