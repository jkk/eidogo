/**
 * Copyright (c) 2006, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under the BSD license:
 * http://www.opensource.org/licenses/bsd-license.php
 *
 * Supplements the Array prototype with useful methods.
 */
Array.prototype.contains = function(needle) {
	for (var i in this) {
		if (this[i] == needle) {
			return true;
		}
	}
	return false;
}
Array.prototype.setLength = function(len, val) {
	val = typeof val != "undefined" ? val : null;
	for (var i = 0; i < len; i++) {
		this[i] = val;
	}
	return this;
}
Array.prototype.addDimension = function(len, val) {
	val = typeof val != "undefined" ? val : null;
	var thisLen = this.length; // minor optimization
	for (var i = 0; i < thisLen; i++) {
		this[i] = [].setLength(len, val);
	}
	return this;
}
Array.prototype.first = function() {
	return this[0];
}
Array.prototype.last = function() {
	return this[this.length-1];
}
Array.prototype.copy = function() {
	var copy = [];
	var len = this.length; // minor optimization
	for (var i = 0; i < len; i++) {
		if (this[i] instanceof Array) {
			copy[i] = this[i].copy();
		} else {
			copy[i] = this[i];
		}
	}
	return copy;
}