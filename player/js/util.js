/**
 * Copyright (c) 2006, Justin Kramer <jkkramer@gmail.com>
 * Code licensed under the BSD license:
 * http://www.opensource.org/licenses/bsd-license.php
 *
 * General-purpose utility functions. All references to external libraries are
 * in this file. Pretty much any modern JS library could be used (YUI, jQuery,
 * Dojo, Prototype, Mootools).
 */
 
jQuery.noConflict();

eidogo.util = {

    byId: function(id) {
        return jQuery("#" + id)[0];
    },
    
    byClass: function(cls) {
        return jQuery("." + cls);
    },
    
    ajax: function(method, url, params, successFn, failureFn, scope, timeout) {
        scope = scope || window;
        jQuery.ajax({
            type: method.toUpperCase(),
            url: url,
            data: params,
            success: function(text) { successFn.call(scope, {responseText: text}) },
            error: failureFn.bind(scope),
            timeout: timeout
        });
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
        jQuery(el).bind(eventType, {}, handler);
    },
    
    onReady: function(fn) {
        jQuery(fn);
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
        if (!el._x) {
            var elX = eidogo.util.getElX(el);
            var elY = eidogo.util.getElY(el);
            el._x = elX;
            el._y = elY;
        } else {
            var elX = el._x;
            var elY = el._y;
        }
		return [e.pageX - elX, e.pageY - elY];
    },
    
    stopEvent: function(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    },
    
    getTarget: function(ev) {
        var t = ev.target || ev.srcElement;
        return (t && t.nodeName && t.nodeName.toUpperCase() == "#TEXT") ?
            t.parentNode : t;
    },
    
    addClass: function(el, cls) {
        jQuery(el).addClass(cls);
    },
    
    removeClass: function(el, cls) {
        jQuery(el).removeClass(cls);
    },
    
    show: function(el, display) {
        display = display || "block";
        if (typeof el == "string") {
            el = eidogo.util.byId(el);
        }
        el.style.display = display;
    },
    
    hide: function(el) {
        if (typeof el == "string") {
            el = eidogo.util.byId(el);
        }
        el.style.display = "none";
    },
    
    getElX: function(el) {
        return jQuery(el).offsetLite({scroll:false}).left;
    },
    
    getElY: function(el) {
        return jQuery(el).offsetLite({scroll:false}).top;
    }
    
};