/**
 * EidoGo -- Web-based SGF Editor
 * Copyright (c) 2007, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under AGPLv3:
 * http://www.fsf.org/licensing/licenses/agpl-3.0.html
 *
 * This file contains GameNode and related structures such as GameCursor.
 */

/**
 * For uniquely identifying trees and nodes. Should work even if we have
 * multiple Player instantiations. Setting this to 15000 is kind of a hack
 * to avoid overlap with ids of as-yet-unloaded trees.
 */
eidogo.gameNodeIdCounter = 15000;

/**
 * @class GameNode holds SGF-like data containing things like moves, labels
 * game information, and so on. Each GameNode has children and (usually) a
 * parent. The first child is the main line.
 */
eidogo.GameNode = function() {
    this.init.apply(this, arguments);
};
eidogo.GameNode.prototype = {
    /**
     * @constructor
     * @param {Object} properties A JSON object to load into the node
     */
    init: function(parent, properties) {
        this._id = eidogo.gameNodeIdCounter++;
        this._parent = parent || null; // a tree, not a node
        this._children = [];
        this._preferredChild = 0;
        if (properties)
            this.loadJson(properties);
    },
    /**
     * Adds a property to this node without replacing existing values. If
     * the given property already exists, it will make the value an array
     * containing the given value and any existing values.
    **/
    pushProperty: function(prop, value) {
        if (this[prop]) {
            if (!(this[prop] instanceof Array))
                this[prop] = [this[prop]];
            if (!this[prop].contains(value))
                this[prop].push(value);
        } else {
            this[prop] = value;
        }
    },
    /**
     * Loads SGF-like data given in JSON format. The data will consist of
     * objects (nodes) with properties, with one special _children property.
    **/
    loadJson: function(data) {
        var jsonStack = [data], gameStack = [this];
        var jsonNode, gameNode;
        var i, len;
        while (jsonStack.length) {
            jsonNode = jsonStack.pop();
            gameNode = gameStack.pop();
            gameNode.loadJsonNode(jsonNode);
            len = (jsonNode._children ? jsonNode._children.length : 0);
            for (i = 0; i < len; i++) {
                jsonStack.push(jsonNode._children[i]);
                if (!gameNode._children[i])
                    gameNode._children[i] = new eidogo.GameNode(gameNode);
                gameStack.push(gameNode._children[i]);
            }
        }
    },
    /**
     * Adds properties to the current node from a JSON object
    **/
    loadJsonNode: function(data) {
        for (var prop in data) {
            if (prop == "_id") {
                this[prop] = data[prop].toString();
                eidogo.gameNodeIdCounter = Math.max(eidogo.gameNodeIdCounter,
                                                    parseInt(data[prop], 10));
                continue;
            }
            if (prop.charAt(0) != "_")
                this[prop] = data[prop];
        }
    },
    /**
     * Add a new child (variation)
    **/
    appendChild: function(node) {
        node._parent = this;
        this._children.push(node);
    },
    /**
     * Returns all the properties for this node
    **/
    getProperties: function() {
        var properties = {}, propName, isReserved, isString, isArray;
        for (propName in this) {
            isPrivate = (propName.charAt(0) == "_");
            isString = (typeof this[propName] == "string");
            isArray = (this[propName] instanceof Array);
            if (!isPrivate && (isString || isArray))
                properties[propName] = this[propName];
        }
        return properties;
    },
    /**
     * Get the current black or white move as a raw SGF coordinate
    **/
    getMove: function() {
        if (typeof this.W != "undefined")
            return this.W;
        else if (typeof this.B != "undefined")
            return this.B;
        return null;
    },
    /**
     * Empty the current node of any black or white stones (played or added)
    **/
    emptyPoint: function(coord) {
        var props = this.getProperties();
        for (var propName in props) {
            if (propName == "AW" || propName == "AB" || propName == "AE") {
                if (!(this[propName] instanceof Array))
                    this[propName] = [this[propName]];
                this[propName] = this[propName].filter(function(v) { return v != coord});
                if (!this[propName].length)
                    delete this[propName];
            } else if ((propName == "B" || propName == "W") && this[propName] == coord) {
                delete this[propName];
            }
        }
    },
    /**
     * Returns the node's position relative to parent tree (deprecated??)
    **/
    getPosition: function() {
        var siblings = this._parent._children;
        for (var i = 0; i < siblings.length; i++)
            if (siblings[i]._id == this._id) {
                return i;
            }
        return null;
    }
};

/**
 * @class GameTree holds all of the game's moves and variations
 */
eidogo.GameTree = function(jsonTree) {
    this.init(jsonTree);
};
eidogo.GameTree.prototype = {
    toSgf: function() {
        function treeToSgf(tree) {
            var sgf = "(";
            for (var i = 0; i < tree.nodes.length; i++) {
                sgf += nodeToSgf(tree.nodes[i]);
            }
            for (var i = 0; i < tree.trees.length; i++) {
                sgf += treeToSgf(tree.trees[i]);
            }
            return sgf + ")";
        }
        function nodeToSgf(node) {
            var sgf = ";";
            var props = node.getProperties();
            for (var key in props) {
                var val;
                if (props[key] instanceof Array) {
                    val = props[key].map(function (val) {
                        return val.replace(/\]/, "\\]");
                    }).join("][");
                } else {
                    val = props[key].replace(/\]/, "\\]");
                }
                
                sgf += key + "[" + val  + "]";
            }
            return sgf;
        }
        return treeToSgf(this);
    }
};

/**
 * @class GameCursor is used to navigate among the nodes of a game tree.
 */
eidogo.GameCursor = function() {
    this.init.apply(this, arguments);
}
eidogo.GameCursor.prototype = {
    /**
     * @constructor
     * @param {eidogo.GameNode} A node to start with
     */
    init: function(node) {
        this.node = node;
    },
    next: function(varNum) {
        if (!this.hasNext()) return false;
        varNum = (typeof varNum == "undefined" || varNum == null ?
            this.node._preferredChild : varNum);
        this.node._preferredChild = varNum;
        this.node = this.node._children[varNum];
        return true;
    },
    previous: function() {
        if (!this.hasPrevious()) return false;
        this.node = this.node._parent;
        return true;
    },
    hasNext: function() {
        return this.node && this.node._children.length;
    },
    hasPrevious: function() {
        // Checking _parent of _parent is to prevent returning to root
        return this.node && this.node._parent && this.node._parent._parent;
    },
    getNextMoves: function() {
        if (!this.hasNext()) return null;
        var moves = {};
        var i, node;
        for (i = 0; node = this.node._children[i]; i++)
            moves[node.getMove()] = i;
        return moves;
    },
    getNextColor: function() {
        if (!this.hasNext()) return null;
        var i, node;
        for (var i = 0; node = this.node._children[i]; i++)
            if (node.W || node.B)
                return node.W ? "W" : "B";
        return null;
    },
    getPath: function() {
        var path = [];
        var cur = new eidogo.GameCursor(this.node);
        var mn = 0;
        var prev = cur.node;
        cur.previous();
        while (cur.hasPrevious() && cur.node._children.length == 1) {
            prev = cur.node;
            cur.previous();
            mn++;
        }
        path.push(mn);
        path.push(prev.getPosition());
        var lastId = null;
        do {
            prev = cur.node;
            cur.previous();
            while (cur.hasPrevious() && cur.node._children.length == 1) {
                prev = cur.node;
                cur.previous();
            }
            path.push(prev.getPosition());
            lastId = prev._id;
        } while (cur.previous());
        if (lastId != cur.node._id)
            path.push(cur.node.getPosition());
        return path.reverse();
    },
    getPathMoves: function() {
        var path = [];
        var cur = new eidogo.GameCursor(this.node);
        path.push(cur.node.getMove());
        while (cur.previous()) {
            var move = cur.node.getMove();
            if (move) path.push(move);
        }
        return path.reverse();
    },
    getGameTreeRoot: function() {
        var cur = new eidogo.GameCursor(this.node);
        while (cur.previous()) {};
        return cur.node;
    }
};