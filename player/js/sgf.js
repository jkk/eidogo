/**
 * EidoGo -- Web-based SGF Editor
 * Copyright (c) 2007, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under AGPLv3:
 * http://www.fsf.org/licensing/licenses/agpl-3.0.html
 *
 * Quick and dirty SGF parser.
 */

/**
 * @class Returns a JSON object of the form:
 *      { nodes: [], trees: [{nodes: [], trees:[]}, ...] }
 */
eidogo.SgfParser = function(sgf, completeFn) {
    this.init(sgf, completeFn);
}
eidogo.SgfParser.prototype = {
    /**
     * @constructor
     * @param {String} sgf Raw SGF data to parse
     */
    init: function(sgf, completeFn) {
        completeFn = (typeof completeFn == "function") ? completeFn : null;
        this.sgf = sgf;
        this.index = 0;
        this.tree = this.parseTree(null);
        completeFn && completeFn.call(this);
    },
    parseTree: function(parent) {
        var tree = {};
        tree.nodes = [];
        tree.trees = [];
        while (this.index < this.sgf.length) {
            var c = this.sgf.charAt(this.index);
            this.index++;
            switch (c) {
                case ';':
                    tree.nodes.push(this.parseNode());
                    break;
                case '(':
                    tree.trees.push(this.parseTree(tree));
                    break;
                case ')':
                    return tree;
                    break;
            }
        }
        return tree;
    },
    getChar: function() {
        return this.sgf.charAt(this.index);
    },
    nextChar: function() {
        this.index++;
    },
    parseNode: function() {
        var node = {};
        var key = "";
        var values = [];
        var i = 0;
        while (this.index < this.sgf.length) {
            var c = this.getChar();
            if (c == ';' || c == '(' || c == ')') {
                break;
            }
            if (this.getChar() == '[') {
                while (this.getChar() == '[') {
                    this.nextChar();
                    values[i] = "";
                    while (this.getChar() != ']' && this.index < this.sgf.length) {
                        if (this.getChar() == '\\') {
                            this.nextChar();
                            // not technically correct, but works in practice
                            while (this.getChar() == "\r" || this.getChar() == "\n") {
                                this.nextChar();
                            }
                        }
                        values[i] += this.getChar();
                        this.nextChar();
                    }
                    i++;
                    while (this.getChar() == ']' || this.getChar() == "\n" || this.getChar() == "\r") {
                        this.nextChar();
                    }
                }
                if (node[key]) {
                    if (!(node[key] instanceof Array)) {
                        node[key] = [node[key]];
                    }
                    node[key] = node[key].concat(values);
                } else {
                    node[key] = values.length > 1 ? values : values[0];
                }
                key = "";
                values = [];
                i = 0;
                continue;
            }
            if (c != " " && c != "\n" && c != "\r" && c != "\t") {
                key += c;
            }
            this.nextChar();
        }
        return node;
    }
};