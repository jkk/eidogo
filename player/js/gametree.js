/**
 * EidoGo -- Web-based SGF Editor
 * Copyright (c) 2007, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under AGPLv3:
 * http://www.fsf.org/licensing/licenses/agpl-3.0.html
 *
 * This file contains GameTree and related structures GameNode and GameCursor.
 */

/**
 * For uniquely identifying trees and nodes. Should work even if we have
 * multiple Player instantiations. Setting this to 15000 is kind of a hack
 * to avoid overlap with ids of as-yet-unloaded trees.
 */
eidogo.gameTreeIdCounter = 15000;
eidogo.gameNodeIdCounter = 15000;

/**
 * @class GameNode holds the information for a specific node in the game tree,
 * such as moves, labels, game information, and variations.
 */
eidogo.GameNode = function(properties) {
    this.init(properties);
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
        if (properties)
            this.loadJson(properties);
    },
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
    loadJsonNode: function(data) {
        for (var prop in data)
            if (typeof data[prop] == "string")
                this[prop] = data[prop];
    },
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
    getMove: function() {
        if (typeof this.W != "undefined")
            return this.W;
        else if (typeof this.B != "undefined")
            return this.B;
        return null;
    },
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
    getPosition: function() {
        alert('TO DO?');
        return;
        for (var i = 0; i < this.parent.nodes.length; i++)
            if (this.parent.nodes[i].id == this.id)
                return i;
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
    /**
     * @constructor
     * @param {Object} jsonTree A JSON object to load into the tree
     */
    init: function(jsonTree) {
        this.id = eidogo.gameTreeIdCounter++;
        this.nodes = [];
        this.trees = [];
        this.parent = null;
        this.preferredTree = 0;
        if (typeof jsonTree != "undefined") {
            this.loadJson(jsonTree);
        }
        if (!this.nodes.length) {
            // must have at least one node
            this.appendNode(new eidogo.GameNode());
        }
    },
    appendNode: function(node) {
        node.parent = this;
        if (this.nodes.length) {
            node.previousSibling = this.nodes.last();
            node.previousSibling.nextSibling = node;
        }
        this.nodes.push(node);
    },
    appendTree: function(tree) {
        tree.parent = this;
        this.trees.push(tree);
    },
    // creates a variation tree at the given node position
    createVariationTree: function(nodePos) {
        var posNode = this.nodes[nodePos];
        var preNodes = [];
        var len = posNode.parent.nodes.length;
        var i;
        for (i = 0; i < len; i++) {
            var n = posNode.parent.nodes[i];
            preNodes.push(n);
            if (n.id == posNode.id) {
                n.nextSibling = null;
                break;
            }
        }
        var mainlineTree = new eidogo.GameTree();
        i++;
        posNode.parent.nodes[i].previousSibling = null;
        var postNodes = [];
        for (; i < len; i++) {
            var n = posNode.parent.nodes[i];
            n.parent = mainlineTree;
            postNodes.push(n);
        }                   
        mainlineTree.nodes = postNodes;
        mainlineTree.trees = posNode.parent.trees;
        posNode.parent.nodes = preNodes;
        posNode.parent.trees = [];
        posNode.parent.appendTree(mainlineTree);
    },
    loadJson: function(jsonTree) {
        for (var i = 0; i < jsonTree.nodes.length; i++) {
            this.appendNode(new eidogo.GameNode(jsonTree.nodes[i]));
        }
        for (var i = 0; i < jsonTree.trees.length; i++) {
            this.appendTree(new eidogo.GameTree(jsonTree.trees[i]));
        }
        if (jsonTree.id) {
            // overwrite default id
            this.id = jsonTree.id;
            // so we never have overlap, even for nodes created later
            eidogo.gameTreeIdCounter = Math.max(this.id, eidogo.gameTreeIdCounter);
        }
    },
    getPosition: function() {
        if (!this.parent) return null;
        for (var i = 0; i < this.parent.trees.length; i++) {
            if (this.parent.trees[i].id == this.id) {
                return i;
            }
        }
        return null;
    },
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
eidogo.GameCursor = function(node) {
    this.init(node);
}
eidogo.GameCursor.prototype = {
    /**
     * @constructor
     * @param {eidogo.GameNode} A node to start with
     */
    init: function(node) {
        this.node = node;
    },
    nextNode: function() {
        if (this.node.nextSibling != null) {
            this.node = this.node.nextSibling;
            return true;
        } else {
            return false;
        }
    },
    getNextMoves: function() {
        if (!this.hasNext()) return null;
        var moves = {};
        if (this.node.nextSibling && this.node.nextSibling.getMove()) {
            // null indicates a sibling move rather than a var tree number
            moves[this.node.nextSibling.getMove()] = null; 
        } else {
            var vars = this.node.parent.trees;
            var tree;
            for (var i = 0; tree = vars[i]; i++) {
                moves[tree.nodes[0].getMove()] = i;
            }
        }
        return moves;
    },
    getNextColor: function() {
        if (!this.hasNext()) return null;
        if (this.node.nextSibling && (this.node.nextSibling.W || this.node.nextSibling.B))
            return this.node.nextSibling.W ? "W" : "B";
        var vars = this.node.parent.trees;
        var tree;
        for (var i = 0; tree = vars[i]; i++) {
            if (tree.nodes[0].W || tree.nodes[0].B)
                return tree.nodes[0].W ? "W" : "B";
        }
        return null;
    },
    next: function(treeNum) {
        if (!this.hasNext()) return false;
        if ((typeof treeNum == "undefined" || treeNum == null)
            && this.node.nextSibling != null) {
            this.node = this.node.nextSibling;
        } else if (this.node.parent.trees.length) {
            // remember the last line followed
            if (typeof treeNum == "undefined" || treeNum == null) {
                treeNum = this.node.parent.preferredTree;
            } else {
                this.node.parent.preferredTree = treeNum;
            }
            this.node = this.node.parent.trees[treeNum].nodes[0];
        }
        return true;
    },
    previous: function() {
        if (!this.hasPrevious()) return false;
        if (this.node.previousSibling != null) {
            this.node = this.node.previousSibling;
        } else {
            // ascend one level
            this.node = this.node.parent.parent.nodes.last();
        }
        return true;
    },
    hasNext: function() {
        return this.node && (this.node.nextSibling != null ||
            (this.node.parent && this.node.parent.trees.length));
    },
    hasPrevious: function() {
        return this.node && ((this.node.parent.parent
            && this.node.parent.parent.nodes.length
            && this.node.parent.parent.parent) ||
            (this.node.previousSibling != null));
    },
    getPath: function() {
        var path = [];
        var cur = new eidogo.GameCursor(this.node);
        var treeId = prevId = cur.node.parent.id;
        path.push(cur.node.getPosition());
        path.push(cur.node.parent.getPosition());
        while (cur.previous()) {
            treeId = cur.node.parent.id;
            if (prevId != treeId) {
                path.push(cur.node.parent.getPosition());
                prevId = treeId;
            }
        }
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
    }
};