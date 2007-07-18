/**
 * Copyright (c) 2006, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under the BSD license:
 * http://www.opensource.org/licenses/bsd-license.php
 *
 * General-purpose utility functions. All references to external libraries are
 * in this file. Pretty much any modern JS library could be used (YUI, jQuery,
 * Dojo, Prototype, Mootools).
 */

eidogo.util = {

    byId: function(id) {
        return YAHOO.util.Dom.get(id);
    },
    
    ajax: function(method, url, params, successFn, failureFn, scope, timeout) {
        params = params || {};
        // params.stamp = (new Date()).getTime(); // prevent caching
        var pairs = [];
        for (var key in params) {
            pairs.push(key + "=" + encodeURIComponent(params[key]));
        }
        params = pairs.join("&");
        if (method.toUpperCase() == "GET") {   
            url = url + "?" + params;
            params = null;
        }
        YAHOO.util.Connect.asyncRequest(method.toUpperCase(), url,
            {success: successFn, failure: failureFn, scope: scope, timeout: timeout},
            params);
    },
    
    addEvent: function(el, eventType, handler, arg, override) {
        if (override) {
            handler = handler.bind(arg);
        } else if (arg) {
            // use a closure to pass an extra argument
            var oldHandler = handler;
            handler = function(e) {
                oldHandler(e, arg);
            }
        }
        YAHOO.util.Event.on(el, eventType, handler);
    },
    
    onClick: function(el, handler, scope) {
        eidogo.util.addEvent(el, "click", handler, scope, true);
    },
    
    getElClickXY: function(e, el) {
        // for IE
	    if(!e.pageX) {
            e.pageX = e.clientX + (document.documentElement.scrollLeft ||
                document.body.scrollLeft);
            e.pageY = e.clientY + (document.documentElement.scrollTop ||
                document.body.scrollTop);
        }
        var elX = eidogo.util.getElX(el);
        var elY = eidogo.util.getElY(el);
		return [e.pageX - elX, e.pageY - elY];
    },
    
    // var addEvent = YAHOO.util.Event.on.bind(YAHOO.util.Event);
    stopEvent: YAHOO.util.Event.stopEvent.bind(YAHOO.util.Event),
    addClass: YAHOO.util.Dom.addClass,
    removeClass: YAHOO.util.Dom.removeClass,
    hasClass: YAHOO.util.Dom.hasClass,
    getElX: YAHOO.util.Dom.getX,
    getElY: YAHOO.util.Dom.getY
    
};