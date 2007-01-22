/**
 * EidoGo -- Web-based SGF Replayer
 * Copyright (c) 2006, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under the BSD license:
 * http://www.opensource.org/licenses/bsd-license.php
 *
 * Quick and dirty SGF parser.
 */

/**
 * @class Returns a JSON object of the form:
 * 		{ nodes: [], trees: [{nodes: [], trees:[]}, ...] }
 */
eidogo.SgfParser = function(sgf) {
	this.init(sgf);
}
eidogo.SgfParser.prototype = {
	/**
	 * @constructor
	 * @param {String} sgf Raw SGF data to parse
	 */
	init: function(sgf) {
		this.sgf = sgf;
		this.index = 0;
		this.tree = this.parseTree(null);
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
			if (c == ';' || c == '(' || c == ')')
				break;
			if (this.getChar() == '[') {
				while (this.getChar() == '[') {
					this.nextChar();
					values[i] = "";
					while (this.getChar() != ']' && this.index < this.sgf.length) {
						if (this.getChar() == '\\')
							this.nextChar();
						values[i] += this.getChar();
						this.nextChar();
					}
					i++;
					if (this.getChar() == ']')
						this.nextChar();
				}
				node[key] = values.length > 1 ? values : values[0];
				key = "";
				values = [];
				i = 0;
				continue;
			}
			if (c != " " && c != "\n" && c != "\r" && c != "\t")
				key += c;
			this.nextChar();
		}
		return node;
	}
};