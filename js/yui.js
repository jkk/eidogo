/*
Copyright (c) 2006, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
Version: 0.11.4

This file includes the Dom, Event, and Connection packages
*/
if(typeof YAHOO=="undefined"){
YAHOO={};
}
YAHOO.namespace=function(ns){
if(!ns||!ns.length){
return null;
}
var _2=ns.split(".");
var _3=YAHOO;
for(var i=(_2[0]=="YAHOO")?1:0;i<_2.length;++i){
_3[_2[i]]=_3[_2[i]]||{};
_3=_3[_2[i]];
}
return _3;
};
YAHOO.log=function(_5,_6,_7){
var l=YAHOO.widget.Logger;
if(l&&l.log){
return l.log(_5,_6,_7);
}else{
return false;
}
};
YAHOO.extend=function(_9,_a){
var f=function(){
};
f.prototype=_a.prototype;
_9.prototype=new f();
_9.prototype.constructor=_9;
_9.superclass=_a.prototype;
if(_a.prototype.constructor==Object.prototype.constructor){
_a.prototype.constructor=_a;
}
};
YAHOO.namespace("util");
YAHOO.namespace("widget");
YAHOO.namespace("example");

YAHOO.util.Dom=function(){
var ua=navigator.userAgent.toLowerCase();
var _2=(ua.indexOf("opera")>-1);
var _3=(ua.indexOf("safari")>-1);
var _4=(window.ActiveXObject);
var _5=0;
var _6=YAHOO.util;
var _7={};
var _8=function(_9){
var _a=function(_b){
var _c=/(-[a-z])/i.exec(_b);
return _b.replace(RegExp.$1,RegExp.$1.substr(1).toUpperCase());
};
while(_9.indexOf("-")>-1){
_9=_a(_9);
}
return _9;
};
var _d=function(_e){
if(_e.indexOf("-")>-1){
return _e;
}
var _f="";
for(var i=0,len=_e.length;i<len;++i){
if(_e.charAt(i)==_e.charAt(i).toUpperCase()){
_f=_f+"-"+_e.charAt(i).toLowerCase();
}else{
_f=_f+_e.charAt(i);
}
}
return _f;
};
var _11=function(_12){
_7[_12]={camel:_8(_12),hyphen:_d(_12)};
};
return {get:function(el){
if(!el){
return null;
}
if(typeof el!="string"&&!(el instanceof Array)){
return el;
}
if(typeof el=="string"){
return document.getElementById(el);
}else{
var _14=[];
for(var i=0,len=el.length;i<len;++i){
_14[_14.length]=_6.Dom.get(el[i]);
}
return _14;
}
return null;
},getStyle:function(el,_17){
var f=function(el){
var _1a=null;
var dv=document.defaultView;
if(!_7[_17]){
_11(_17);
}
var _1c=_7[_17]["camel"];
var _1d=_7[_17]["hyphen"];
if(_17=="opacity"&&el.filters){
_1a=1;
try{
_1a=el.filters.item("DXImageTransform.Microsoft.Alpha").opacity/100;
}
catch(e){
try{
_1a=el.filters.item("alpha").opacity/100;
}
catch(e){
}
}
}else{
if(el.style[_1c]){
_1a=el.style[_1c];
}else{
if(_4&&el.currentStyle&&el.currentStyle[_1c]){
_1a=el.currentStyle[_1c];
}else{
if(dv&&dv.getComputedStyle){
var _1e=dv.getComputedStyle(el,"");
if(_1e&&_1e.getPropertyValue(_1d)){
_1a=_1e.getPropertyValue(_1d);
}
}
}
}
}
return _1a;
};
return _6.Dom.batch(el,f,_6.Dom,true);
},setStyle:function(el,_20,val){
if(!_7[_20]){
_11(_20);
}
var _22=_7[_20]["camel"];
var f=function(el){
switch(_20){
case "opacity":
if(_4&&typeof el.style.filter=="string"){
el.style.filter="alpha(opacity="+val*100+")";
if(!el.currentStyle||!el.currentStyle.hasLayout){
el.style.zoom=1;
}
}else{
el.style.opacity=val;
el.style["-moz-opacity"]=val;
el.style["-khtml-opacity"]=val;
}
break;
default:
el.style[_22]=val;
}
};
_6.Dom.batch(el,f,_6.Dom,true);
},getXY:function(el){
var f=function(el){
if(el.offsetParent===null||this.getStyle(el,"display")=="none"){
return false;
}
var _28=null;
var pos=[];
var box;
if(el.getBoundingClientRect){
box=el.getBoundingClientRect();
var doc=document;
if(!this.inDocument(el)&&parent.document!=document){
doc=parent.document;
if(!this.isAncestor(doc.documentElement,el)){
return false;
}
}
var _2c=Math.max(doc.documentElement.scrollTop,doc.body.scrollTop);
var _2d=Math.max(doc.documentElement.scrollLeft,doc.body.scrollLeft);
return [box.left+_2d,box.top+_2c];
}else{
pos=[el.offsetLeft,el.offsetTop];
_28=el.offsetParent;
if(_28!=el){
while(_28){
pos[0]+=_28.offsetLeft;
pos[1]+=_28.offsetTop;
_28=_28.offsetParent;
}
}
if(_3&&this.getStyle(el,"position")=="absolute"){
pos[0]-=document.body.offsetLeft;
pos[1]-=document.body.offsetTop;
}
}
if(el.parentNode){
_28=el.parentNode;
}else{
_28=null;
}
while(_28&&_28.tagName.toUpperCase()!="BODY"&&_28.tagName.toUpperCase()!="HTML"){
if(_6.Dom.getStyle(_28,"display")!="inline"){
pos[0]-=_28.scrollLeft;
pos[1]-=_28.scrollTop;
}
if(_28.parentNode){
_28=_28.parentNode;
}else{
_28=null;
}
}
return pos;
};
return _6.Dom.batch(el,f,_6.Dom,true);
},getX:function(el){
var f=function(el){
return _6.Dom.getXY(el)[0];
};
return _6.Dom.batch(el,f,_6.Dom,true);
},getY:function(el){
var f=function(el){
return _6.Dom.getXY(el)[1];
};
return _6.Dom.batch(el,f,_6.Dom,true);
},setXY:function(el,pos,_36){
var f=function(el){
var _39=this.getStyle(el,"position");
if(_39=="static"){
this.setStyle(el,"position","relative");
_39="relative";
}
var _3a=this.getXY(el);
if(_3a===false){
return false;
}
var _3b=[parseInt(this.getStyle(el,"left"),10),parseInt(this.getStyle(el,"top"),10)];
if(isNaN(_3b[0])){
_3b[0]=(_39=="relative")?0:el.offsetLeft;
}
if(isNaN(_3b[1])){
_3b[1]=(_39=="relative")?0:el.offsetTop;
}
if(pos[0]!==null){
el.style.left=pos[0]-_3a[0]+_3b[0]+"px";
}
if(pos[1]!==null){
el.style.top=pos[1]-_3a[1]+_3b[1]+"px";
}
var _3c=this.getXY(el);
if(!_36&&(_3c[0]!=pos[0]||_3c[1]!=pos[1])){
this.setXY(el,pos,true);
}
};
_6.Dom.batch(el,f,_6.Dom,true);
},setX:function(el,x){
_6.Dom.setXY(el,[x,null]);
},setY:function(el,y){
_6.Dom.setXY(el,[null,y]);
},getRegion:function(el){
var f=function(el){
var _44=new YAHOO.util.Region.getRegion(el);
return _44;
};
return _6.Dom.batch(el,f,_6.Dom,true);
},getClientWidth:function(){
return _6.Dom.getViewportWidth();
},getClientHeight:function(){
return _6.Dom.getViewportHeight();
},getElementsByClassName:function(_45,tag,_47){
var _48=function(el){
return _6.Dom.hasClass(el,_45);
};
return _6.Dom.getElementsBy(_48,tag,_47);
},hasClass:function(el,_4b){
var re=new RegExp("(?:^|\\s+)"+_4b+"(?:\\s+|$)");
var f=function(el){
return re.test(el["className"]);
};
return _6.Dom.batch(el,f,_6.Dom,true);
},addClass:function(el,_50){
var f=function(el){
if(this.hasClass(el,_50)){
return;
}
el["className"]=[el["className"],_50].join(" ");
};
_6.Dom.batch(el,f,_6.Dom,true);
},removeClass:function(el,_54){
var re=new RegExp("(?:^|\\s+)"+_54+"(?:\\s+|$)","g");
var f=function(el){
if(!this.hasClass(el,_54)){
return;
}
var c=el["className"];
el["className"]=c.replace(re," ");
if(this.hasClass(el,_54)){
this.removeClass(el,_54);
}
};
_6.Dom.batch(el,f,_6.Dom,true);
},replaceClass:function(el,_5a,_5b){
if(_5a===_5b){
return false;
}
var re=new RegExp("(?:^|\\s+)"+_5a+"(?:\\s+|$)","g");
var f=function(el){
if(!this.hasClass(el,_5a)){
this.addClass(el,_5b);
return;
}
el["className"]=el["className"].replace(re," "+_5b+" ");
if(this.hasClass(el,_5a)){
this.replaceClass(el,_5a,_5b);
}
};
_6.Dom.batch(el,f,_6.Dom,true);
},generateId:function(el,_60){
_60=_60||"yui-gen";
el=el||{};
var f=function(el){
if(el){
el=_6.Dom.get(el);
}else{
el={};
}
if(!el.id){
el.id=_60+_5++;
}
return el.id;
};
return _6.Dom.batch(el,f,_6.Dom,true);
},isAncestor:function(_63,_64){
_63=_6.Dom.get(_63);
if(!_63||!_64){
return false;
}
var f=function(_66){
if(_63.contains&&!_3){
return _63.contains(_66);
}else{
if(_63.compareDocumentPosition){
return !!(_63.compareDocumentPosition(_66)&16);
}else{
var _67=_66.parentNode;
while(_67){
if(_67==_63){
return true;
}else{
if(!_67.tagName||_67.tagName.toUpperCase()=="HTML"){
return false;
}
}
_67=_67.parentNode;
}
return false;
}
}
};
return _6.Dom.batch(_64,f,_6.Dom,true);
},inDocument:function(el){
var f=function(el){
return this.isAncestor(document.documentElement,el);
};
return _6.Dom.batch(el,f,_6.Dom,true);
},getElementsBy:function(_6b,tag,_6d){
tag=tag||"*";
_6d=_6.Dom.get(_6d)||document;
var _6e=[];
var _6f=_6d.getElementsByTagName(tag);
if(!_6f.length&&(tag=="*"&&_6d.all)){
_6f=_6d.all;
}
for(var i=0,len=_6f.length;i<len;++i){
if(_6b(_6f[i])){
_6e[_6e.length]=_6f[i];
}
}
return _6e;
},batch:function(el,_72,o,_74){
var id=el;
el=_6.Dom.get(el);
var _76=(_74)?o:window;
if(!el||el.tagName||!el.length){
if(!el){
return false;
}
return _72.call(_76,el,o);
}
var _77=[];
for(var i=0,len=el.length;i<len;++i){
if(!el[i]){
id=id[i];
}
_77[_77.length]=_72.call(_76,el[i],o);
}
return _77;
},getDocumentHeight:function(){
var _79=-1,windowHeight=-1,bodyHeight=-1;
var _7a=parseInt(_6.Dom.getStyle(document.body,"marginTop"),10);
var _7b=parseInt(_6.Dom.getStyle(document.body,"marginBottom"),10);
var _7c=document.compatMode;
if((_7c||_4)&&!_2){
switch(_7c){
case "CSS1Compat":
_79=((window.innerHeight&&window.scrollMaxY)?window.innerHeight+window.scrollMaxY:-1);
windowHeight=[document.documentElement.clientHeight,self.innerHeight||-1].sort(function(a,b){
return (a-b);
})[1];
bodyHeight=document.body.offsetHeight+_7a+_7b;
break;
default:
_79=document.body.scrollHeight;
bodyHeight=document.body.clientHeight;
}
}else{
_79=document.documentElement.scrollHeight;
windowHeight=self.innerHeight;
bodyHeight=document.documentElement.clientHeight;
}
var h=[_79,windowHeight,bodyHeight].sort(function(a,b){
return (a-b);
});
return h[2];
},getDocumentWidth:function(){
var _82=-1,bodyWidth=-1,winWidth=-1;
var _83=parseInt(_6.Dom.getStyle(document.body,"marginRight"),10);
var _84=parseInt(_6.Dom.getStyle(document.body,"marginLeft"),10);
var _85=document.compatMode;
if(_85||_4){
switch(_85){
case "CSS1Compat":
_82=document.documentElement.clientWidth;
bodyWidth=document.body.offsetWidth+_84+_83;
break;
default:
bodyWidth=document.body.clientWidth;
_82=document.body.scrollWidth;
break;
}
}else{
_82=document.documentElement.clientWidth;
bodyWidth=document.body.offsetWidth+_84+_83;
}
var w=Math.max(_82,bodyWidth);
return w;
},getViewportHeight:function(){
var _87=-1;
var _88=document.compatMode;
if((_88||_4)&&!_2){
switch(_88){
case "CSS1Compat":
_87=document.documentElement.clientHeight;
break;
default:
_87=document.body.clientHeight;
}
}else{
_87=self.innerHeight;
}
return _87;
},getViewportWidth:function(){
var _89=-1;
var _8a=document.compatMode;
if(_8a||_4){
switch(_8a){
case "CSS1Compat":
_89=document.documentElement.clientWidth;
break;
default:
_89=document.body.clientWidth;
}
}else{
_89=self.innerWidth;
}
return _89;
}};
}();
YAHOO.util.Region=function(t,r,b,l){
this.top=t;
this[1]=t;
this.right=r;
this.bottom=b;
this.left=l;
this[0]=l;
};
YAHOO.util.Region.prototype.contains=function(_8f){
return (_8f.left>=this.left&&_8f.right<=this.right&&_8f.top>=this.top&&_8f.bottom<=this.bottom);
};
YAHOO.util.Region.prototype.getArea=function(){
return ((this.bottom-this.top)*(this.right-this.left));
};
YAHOO.util.Region.prototype.intersect=function(_90){
var t=Math.max(this.top,_90.top);
var r=Math.min(this.right,_90.right);
var b=Math.min(this.bottom,_90.bottom);
var l=Math.max(this.left,_90.left);
if(b>=t&&r>=l){
return new YAHOO.util.Region(t,r,b,l);
}else{
return null;
}
};
YAHOO.util.Region.prototype.union=function(_95){
var t=Math.min(this.top,_95.top);
var r=Math.max(this.right,_95.right);
var b=Math.max(this.bottom,_95.bottom);
var l=Math.min(this.left,_95.left);
return new YAHOO.util.Region(t,r,b,l);
};
YAHOO.util.Region.prototype.toString=function(){
return ("Region {"+"top: "+this.top+", right: "+this.right+", bottom: "+this.bottom+", left: "+this.left+"}");
};
YAHOO.util.Region.getRegion=function(el){
var p=YAHOO.util.Dom.getXY(el);
var t=p[1];
var r=p[0]+el.offsetWidth;
var b=p[1]+el.offsetHeight;
var l=p[0];
return new YAHOO.util.Region(t,r,b,l);
};
YAHOO.util.Point=function(x,y){
if(x instanceof Array){
y=x[1];
x=x[0];
}
this.x=this.right=this.left=this[0]=x;
this.y=this.top=this.bottom=this[1]=y;
};
YAHOO.util.Point.prototype=new YAHOO.util.Region();

YAHOO.util.CustomEvent=function(_1,_2,_3){
this.type=_1;
this.scope=_2||window;
this.silent=_3;
this.subscribers=[];
if(!this.silent){
}
};
YAHOO.util.CustomEvent.prototype={subscribe:function(fn,_5,_6){
this.subscribers.push(new YAHOO.util.Subscriber(fn,_5,_6));
},unsubscribe:function(fn,_8){
var _9=false;
for(var i=0,len=this.subscribers.length;i<len;++i){
var s=this.subscribers[i];
if(s&&s.contains(fn,_8)){
this._delete(i);
_9=true;
}
}
return _9;
},fire:function(){
var _c=this.subscribers.length;
if(!_c&&this.silent){
return;
}
var _d=[];
for(var i=0;i<arguments.length;++i){
_d.push(arguments[i]);
}
if(!this.silent){
}
for(i=0;i<_c;++i){
var s=this.subscribers[i];
if(s){
if(!this.silent){
}
var _10=(s.override)?s.obj:this.scope;
s.fn.call(_10,this.type,_d,s.obj);
}
}
},unsubscribeAll:function(){
for(var i=0,len=this.subscribers.length;i<len;++i){
this._delete(len-1-i);
}
},_delete:function(_12){
var s=this.subscribers[_12];
if(s){
delete s.fn;
delete s.obj;
}
this.subscribers.splice(_12,1);
},toString:function(){
return "CustomEvent: "+"'"+this.type+"', "+"scope: "+this.scope;
}};
YAHOO.util.Subscriber=function(fn,obj,_16){
this.fn=fn;
this.obj=obj||null;
this.override=(_16);
};
YAHOO.util.Subscriber.prototype.contains=function(fn,obj){
return (this.fn==fn&&this.obj==obj);
};
YAHOO.util.Subscriber.prototype.toString=function(){
return "Subscriber { obj: "+(this.obj||"")+", override: "+(this.override||"no")+" }";
};
if(!YAHOO.util.Event){
YAHOO.util.Event=function(){
var _19=false;
var _1a=[];
var _1b=[];
var _1c=[];
var _1d=[];
var _1e=[];
var _1f=0;
var _20=[];
var _21=[];
var _22=0;
return {POLL_RETRYS:200,POLL_INTERVAL:50,EL:0,TYPE:1,FN:2,WFN:3,SCOPE:3,ADJ_SCOPE:4,isSafari:(/Safari|Konqueror|KHTML/gi).test(navigator.userAgent),isIE:(!this.isSafari&&!navigator.userAgent.match(/opera/gi)&&navigator.userAgent.match(/msie/gi)),addDelayedListener:function(el,_24,fn,_26,_27){
_1b[_1b.length]=[el,_24,fn,_26,_27];
if(_19){
_1f=this.POLL_RETRYS;
this.startTimeout(0);
}
},startTimeout:function(_28){
var i=(_28||_28===0)?_28:this.POLL_INTERVAL;
var _2a=this;
var _2b=function(){
_2a._tryPreloadAttach();
};
this.timeout=setTimeout(_2b,i);
},onAvailable:function(_2c,_2d,_2e,_2f){
_20.push({id:_2c,fn:_2d,obj:_2e,override:_2f});
_1f=this.POLL_RETRYS;
this.startTimeout(0);
},addListener:function(el,_31,fn,_33,_34){
if(!fn||!fn.call){
return false;
}
if(this._isValidCollection(el)){
var ok=true;
for(var i=0,len=el.length;i<len;++i){
ok=(this.on(el[i],_31,fn,_33,_34)&&ok);
}
return ok;
}else{
if(typeof el=="string"){
var oEl=this.getEl(el);
if(_19&&oEl){
el=oEl;
}else{
this.addDelayedListener(el,_31,fn,_33,_34);
return true;
}
}
}
if(!el){
return false;
}
if("unload"==_31&&_33!==this){
_1c[_1c.length]=[el,_31,fn,_33,_34];
return true;
}
var _38=(_34)?_33:el;
var _39=function(e){
return fn.call(_38,YAHOO.util.Event.getEvent(e),_33);
};
var li=[el,_31,fn,_39,_38];
var _3c=_1a.length;
_1a[_3c]=li;
if(this.useLegacyEvent(el,_31)){
var _3d=this.getLegacyIndex(el,_31);
if(_3d==-1||el!=_1d[_3d][0]){
_3d=_1d.length;
_21[el.id+_31]=_3d;
_1d[_3d]=[el,_31,el["on"+_31]];
_1e[_3d]=[];
el["on"+_31]=function(e){
YAHOO.util.Event.fireLegacyEvent(YAHOO.util.Event.getEvent(e),_3d);
};
}
_1e[_3d].push(li);
}else{
if(el.addEventListener){
el.addEventListener(_31,_39,false);
}else{
if(el.attachEvent){
el.attachEvent("on"+_31,_39);
}
}
}
return true;
},fireLegacyEvent:function(e,_40){
var ok=true;
var le=_1e[_40];
for(var i=0,len=le.length;i<len;++i){
var li=le[i];
if(li&&li[this.WFN]){
var _45=li[this.ADJ_SCOPE];
var ret=li[this.WFN].call(_45,e);
ok=(ok&&ret);
}
}
return ok;
},getLegacyIndex:function(el,_48){
var key=this.generateId(el)+_48;
if(typeof _21[key]=="undefined"){
return -1;
}else{
return _21[key];
}
},useLegacyEvent:function(el,_4b){
if(!el.addEventListener&&!el.attachEvent){
return true;
}else{
if(this.isSafari){
if("click"==_4b||"dblclick"==_4b){
return true;
}
}
}
return false;
},removeListener:function(el,_4d,fn,_4f){
if(!fn||!fn.call){
return false;
}
var i,len;
if(typeof el=="string"){
el=this.getEl(el);
}else{
if(this._isValidCollection(el)){
var ok=true;
for(i=0,len=el.length;i<len;++i){
ok=(this.removeListener(el[i],_4d,fn)&&ok);
}
return ok;
}
}
if("unload"==_4d){
for(i=0,len=_1c.length;i<len;i++){
var li=_1c[i];
if(li&&li[0]==el&&li[1]==_4d&&li[2]==fn){
_1c.splice(i,1);
return true;
}
}
return false;
}
var _53=null;
if("undefined"==typeof _4f){
_4f=this._getCacheIndex(el,_4d,fn);
}
if(_4f>=0){
_53=_1a[_4f];
}
if(!el||!_53){
return false;
}
if(this.useLegacyEvent(el,_4d)){
var _54=this.getLegacyIndex(el,_4d);
var _55=_1e[_54];
if(_55){
for(i=0,len=_55.length;i<len;++i){
li=_55[i];
if(li&&li[this.EL]==el&&li[this.TYPE]==_4d&&li[this.FN]==fn){
_55.splice(i,1);
}
}
}
}else{
if(el.removeEventListener){
el.removeEventListener(_4d,_53[this.WFN],false);
}else{
if(el.detachEvent){
el.detachEvent("on"+_4d,_53[this.WFN]);
}
}
}
delete _1a[_4f][this.WFN];
delete _1a[_4f][this.FN];
_1a.splice(_4f,1);
return true;
},getTarget:function(ev,_57){
var t=ev.target||ev.srcElement;
return this.resolveTextNode(t);
},resolveTextNode:function(_59){
if(_59&&_59.nodeName&&"#TEXT"==_59.nodeName.toUpperCase()){
return _59.parentNode;
}else{
return _59;
}
},getPageX:function(ev){
var x=ev.pageX;
if(!x&&0!==x){
x=ev.clientX||0;
if(this.isIE){
x+=this._getScrollLeft();
}
}
return x;
},getPageY:function(ev){
var y=ev.pageY;
if(!y&&0!==y){
y=ev.clientY||0;
if(this.isIE){
y+=this._getScrollTop();
}
}
return y;
},getXY:function(ev){
return [this.getPageX(ev),this.getPageY(ev)];
},getRelatedTarget:function(ev){
var t=ev.relatedTarget;
if(!t){
if(ev.type=="mouseout"){
t=ev.toElement;
}else{
if(ev.type=="mouseover"){
t=ev.fromElement;
}
}
}
return this.resolveTextNode(t);
},getTime:function(ev){
if(!ev.time){
var t=new Date().getTime();
try{
ev.time=t;
}
catch(e){
return t;
}
}
return ev.time;
},stopEvent:function(ev){
this.stopPropagation(ev);
this.preventDefault(ev);
},stopPropagation:function(ev){
if(ev.stopPropagation){
ev.stopPropagation();
}else{
ev.cancelBubble=true;
}
},preventDefault:function(ev){
if(ev.preventDefault){
ev.preventDefault();
}else{
ev.returnValue=false;
}
},getEvent:function(e){
var ev=e||window.event;
if(!ev){
var c=this.getEvent.caller;
while(c){
ev=c.arguments[0];
if(ev&&Event==ev.constructor){
break;
}
c=c.caller;
}
}
return ev;
},getCharCode:function(ev){
return ev.charCode||((ev.type=="keypress")?ev.keyCode:0);
},_getCacheIndex:function(el,_6b,fn){
for(var i=0,len=_1a.length;i<len;++i){
var li=_1a[i];
if(li&&li[this.FN]==fn&&li[this.EL]==el&&li[this.TYPE]==_6b){
return i;
}
}
return -1;
},generateId:function(el){
var id=el.id;
if(!id){
id="yuievtautoid-"+_22;
++_22;
el.id=id;
}
return id;
},_isValidCollection:function(o){
return (o&&o.length&&typeof o!="string"&&!o.tagName&&!o.alert&&typeof o[0]!="undefined");
},elCache:{},getEl:function(id){
return document.getElementById(id);
},clearCache:function(){
},_load:function(e){
_19=true;
var EU=YAHOO.util.Event;
EU._simpleRemove(window,"load",EU._load);
},_tryPreloadAttach:function(){
if(this.locked){
return false;
}
this.locked=true;
var _75=!_19;
if(!_75){
_75=(_1f>0);
}
var _76=[];
for(var i=0,len=_1b.length;i<len;++i){
var d=_1b[i];
if(d){
var el=this.getEl(d[this.EL]);
if(el){
this.on(el,d[this.TYPE],d[this.FN],d[this.SCOPE],d[this.ADJ_SCOPE]);
delete _1b[i];
}else{
_76.push(d);
}
}
}
_1b=_76;
var _7a=[];
for(i=0,len=_20.length;i<len;++i){
var _7b=_20[i];
if(_7b){
el=this.getEl(_7b.id);
if(el){
var _7c=(_7b.override)?_7b.obj:el;
_7b.fn.call(_7c,_7b.obj);
delete _20[i];
}else{
_7a.push(_7b);
}
}
}
_1f=(_76.length===0&&_7a.length===0)?0:_1f-1;
if(_75){
this.startTimeout();
}
this.locked=false;
return true;
},purgeElement:function(el,_7e,_7f){
var _80=this.getListeners(el,_7f);
if(_80){
for(var i=0,len=_80.length;i<len;++i){
var l=_80[i];
this.removeListener(el,l.type,l.fn);
}
}
if(_7e&&el&&el.childNodes){
for(i=0,len=el.childNodes.length;i<len;++i){
this.purgeElement(el.childNodes[i],_7e,_7f);
}
}
},getListeners:function(el,_84){
var _85=[];
if(_1a&&_1a.length>0){
for(var i=0,len=_1a.length;i<len;++i){
var l=_1a[i];
if(l&&l[this.EL]===el&&(!_84||_84===l[this.TYPE])){
_85.push({type:l[this.TYPE],fn:l[this.FN],obj:l[this.SCOPE],adjust:l[this.ADJ_SCOPE],index:i});
}
}
}
return (_85.length)?_85:null;
},_unload:function(e){
var EU=YAHOO.util.Event;
for(var i=0,len=_1c.length;i<len;++i){
var l=_1c[i];
if(l){
var _8c=(l[EU.ADJ_SCOPE])?l[EU.SCOPE]:window;
l[EU.FN].call(_8c,EU.getEvent(e),l[EU.SCOPE]);
delete _1c[i];
l=null;
}
}
if(_1a&&_1a.length>0){
var j=_1a.length;
while(j){
var _8e=j-1;
l=_1a[_8e];
if(l){
EU.removeListener(l[EU.EL],l[EU.TYPE],l[EU.FN],_8e);
}
l=null;
j=j-1;
}
EU.clearCache();
}
for(i=0,len=_1d.length;i<len;++i){
delete _1d[i][0];
delete _1d[i];
}
EU._simpleRemove(window,"unload",EU._unload);
},_getScrollLeft:function(){
return this._getScroll()[1];
},_getScrollTop:function(){
return this._getScroll()[0];
},_getScroll:function(){
var dd=document.documentElement,db=document.body;
if(dd&&(dd.scrollTop||dd.scrollLeft)){
return [dd.scrollTop,dd.scrollLeft];
}else{
if(db){
return [db.scrollTop,db.scrollLeft];
}else{
return [0,0];
}
}
},_simpleAdd:function(el,_91,fn,_93){
if(el.addEventListener){
el.addEventListener(_91,fn,(_93));
}else{
if(el.attachEvent){
el.attachEvent("on"+_91,fn);
}
}
},_simpleRemove:function(el,_95,fn,_97){
if(el.removeEventListener){
el.removeEventListener(_95,fn,(_97));
}else{
if(el.detachEvent){
el.detachEvent("on"+_95,fn);
}
}
}};
}();
YAHOO.util.Event.on=YAHOO.util.Event.addListener;
if(document&&document.body){
YAHOO.util.Event._load();
}else{
YAHOO.util.Event._simpleAdd(window,"load",YAHOO.util.Event._load);
}
YAHOO.util.Event._simpleAdd(window,"unload",YAHOO.util.Event._unload);
YAHOO.util.Event._tryPreloadAttach();
}

YAHOO.util.Connect={_msxml_progid:["MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],_http_header:{},_has_http_headers:false,_use_default_post_header:true,_default_post_header:"application/x-www-form-urlencoded",_isFormSubmit:false,_isFileUpload:false,_formNode:null,_sFormData:null,_poll:{},_timeOut:{},_polling_interval:50,_transaction_id:0,setProgId:function(id){
this._msxml_progid.unshift(id);
},setDefaultPostHeader:function(b){
this._use_default_post_header=b;
},setPollingInterval:function(i){
if(typeof i=="number"&&isFinite(i)){
this._polling_interval=i;
}
},createXhrObject:function(_4){
var _5,http;
try{
http=new XMLHttpRequest();
_5={conn:http,tId:_4};
}
catch(e){
for(var i=0;i<this._msxml_progid.length;++i){
try{
http=new ActiveXObject(this._msxml_progid[i]);
_5={conn:http,tId:_4};
break;
}
catch(e){
}
}
}
finally{
return _5;
}
},getConnectionObject:function(){
var o;
var _8=this._transaction_id;
try{
o=this.createXhrObject(_8);
if(o){
this._transaction_id++;
}
}
catch(e){
}
finally{
return o;
}
},asyncRequest:function(_9,_a,_b,_c){
var o=this.getConnectionObject();
if(!o){
return null;
}else{
if(this._isFormSubmit){
if(this._isFileUpload){
this.uploadFile(o.tId,_b,_a);
this.releaseObject(o);
return;
}
if(_9=="GET"){
_a+="?"+this._sFormData;
}else{
if(_9=="POST"){
_c=(_c?this._sFormData+"&"+_c:this._sFormData);
}
}
this._sFormData="";
}
o.conn.open(_9,_a,true);
if(this._isFormSubmit||(_c&&this._use_default_post_header)){
this.initHeader("Content-Type",this._default_post_header);
if(this._isFormSubmit){
this._isFormSubmit=false;
}
}
if(this._has_http_headers){
this.setHeader(o);
}
this.handleReadyState(o,_b);
o.conn.send(_c?_c:null);
return o;
}
},handleReadyState:function(o,_f){
var _10=this;
if(_f&&_f.timeout){
this._timeOut[o.tId]=window.setTimeout(function(){
_10.abort(o,_f,true);
},_f.timeout);
}
this._poll[o.tId]=window.setInterval(function(){
if(o.conn&&o.conn.readyState==4){
window.clearInterval(_10._poll[o.tId]);
delete _10._poll[o.tId];
if(_f&&_f.timeout){
delete _10._timeOut[o.tId];
}
_10.handleTransactionResponse(o,_f);
}
},this._polling_interval);
},handleTransactionResponse:function(o,_12,_13){
if(!_12){
this.releaseObject(o);
return;
}
var _14,responseObject;
try{
if(o.conn.status!==undefined&&o.conn.status!=0){
_14=o.conn.status;
}else{
_14=13030;
}
}
catch(e){
_14=13030;
}
if(_14>=200&&_14<300){
try{
responseObject=this.createResponseObject(o,_12.argument);
if(_12.success){
if(!_12.scope){
_12.success(responseObject);
}else{
_12.success.apply(_12.scope,[responseObject]);
}
}
}
catch(e){
}
}else{
try{
switch(_14){
case 12002:
case 12029:
case 12030:
case 12031:
case 12152:
case 13030:
responseObject=this.createExceptionObject(o.tId,_12.argument,(_13?_13:false));
if(_12.failure){
if(!_12.scope){
_12.failure(responseObject);
}else{
_12.failure.apply(_12.scope,[responseObject]);
}
}
break;
default:
responseObject=this.createResponseObject(o,_12.argument);
if(_12.failure){
if(!_12.scope){
_12.failure(responseObject);
}else{
_12.failure.apply(_12.scope,[responseObject]);
}
}
}
}
catch(e){
}
}
this.releaseObject(o);
responseObject=null;
},createResponseObject:function(o,_16){
var obj={};
var _18={};
try{
var _19=o.conn.getAllResponseHeaders();
var _1a=_19.split("\n");
for(var i=0;i<_1a.length;i++){
var _1c=_1a[i].indexOf(":");
if(_1c!=-1){
_18[_1a[i].substring(0,_1c)]=_1a[i].substring(_1c+2);
}
}
}
catch(e){
}
obj.tId=o.tId;
obj.status=o.conn.status;
obj.statusText=o.conn.statusText;
obj.getResponseHeader=_18;
obj.getAllResponseHeaders=_19;
obj.responseText=o.conn.responseText;
obj.responseXML=o.conn.responseXML;
if(typeof _16!==undefined){
obj.argument=_16;
}
return obj;
},createExceptionObject:function(tId,_1e,_1f){
var _20=0;
var _21="communication failure";
var _22=-1;
var _23="transaction aborted";
var obj={};
obj.tId=tId;
if(_1f){
obj.status=_22;
obj.statusText=_23;
}else{
obj.status=_20;
obj.statusText=_21;
}
if(_1e){
obj.argument=_1e;
}
return obj;
},initHeader:function(_25,_26){
if(this._http_header[_25]===undefined){
this._http_header[_25]=_26;
}else{
this._http_header[_25]=_26+","+this._http_header[_25];
}
this._has_http_headers=true;
},setHeader:function(o){
for(var _28 in this._http_header){
if(this._http_header.hasOwnProperty(_28)){
o.conn.setRequestHeader(_28,this._http_header[_28]);
}
}
delete this._http_header;
this._http_header={};
this._has_http_headers=false;
},setForm:function(_29,_2a,_2b){
this._sFormData="";
if(typeof _29=="string"){
var _2c=(document.getElementById(_29)||document.forms[_29]);
}else{
if(typeof _29=="object"){
var _2d=_29;
}else{
return;
}
}
if(_2a){
this.createFrame(_2b?_2b:null);
this._isFormSubmit=true;
this._isFileUpload=true;
this._formNode=_2d;
return;
}
var _2e,oName,oValue,oDisabled;
var _2f=false;
for(var i=0;i<_2d.elements.length;i++){
_2e=_2d.elements[i];
oDisabled=_2d.elements[i].disabled;
oName=_2d.elements[i].name;
oValue=_2d.elements[i].value;
if(!oDisabled&&oName){
switch(_2e.type){
case "select-one":
case "select-multiple":
for(var j=0;j<_2e.options.length;j++){
if(_2e.options[j].selected){
if(window.ActiveXObject){
this._sFormData+=encodeURIComponent(oName)+"="+encodeURIComponent(_2e.options[j].attributes["value"].specified?_2e.options[j].value:_2e.options[j].text)+"&";
}else{
this._sFormData+=encodeURIComponent(oName)+"="+encodeURIComponent(_2e.options[j].hasAttribute("value")?_2e.options[j].value:_2e.options[j].text)+"&";
}
}
}
break;
case "radio":
case "checkbox":
if(_2e.checked){
this._sFormData+=encodeURIComponent(oName)+"="+encodeURIComponent(oValue)+"&";
}
break;
case "file":
case undefined:
case "reset":
case "button":
break;
case "submit":
if(_2f==false){
this._sFormData+=encodeURIComponent(oName)+"="+encodeURIComponent(oValue)+"&";
_2f=true;
}
break;
default:
this._sFormData+=encodeURIComponent(oName)+"="+encodeURIComponent(oValue)+"&";
break;
}
}
}
this._isFormSubmit=true;
this._sFormData=this._sFormData.substr(0,this._sFormData.length-1);
},createFrame:function(_32){
var _33="yuiIO"+this._transaction_id;
if(window.ActiveXObject){
var io=document.createElement("<IFRAME id=\""+_33+"\" name=\""+_33+"\">");
if(typeof _32=="boolean"){
io.src="javascript:false";
}else{
io.src=_32;
}
}else{
var io=document.createElement("IFRAME");
io.id=_33;
io.name=_33;
}
io.style.position="absolute";
io.style.top="-1000px";
io.style.left="-1000px";
document.body.appendChild(io);
},uploadFile:function(id,_37,uri){
var _39="yuiIO"+id;
var io=document.getElementById(_39);
this._formNode.action=uri;
this._formNode.enctype="multipart/form-data";
this._formNode.method="POST";
this._formNode.target=_39;
this._formNode.submit();
this._formNode=null;
this._isFileUpload=false;
this._isFormSubmit=false;
var _3b=function(){
var obj={};
obj.tId=id;
obj.responseText=io.contentWindow.document.body?io.contentWindow.document.body.innerHTML:null;
obj.responseXML=io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;
obj.argument=_37.argument;
if(_37.upload){
if(!_37.scope){
_37.upload(obj);
}else{
_37.upload.apply(_37.scope,[obj]);
}
}
if(YAHOO.util.Event){
YAHOO.util.Event.removeListener(io,"load",_3b);
}else{
if(window.ActiveXObject){
io.detachEvent("onload",_3b);
}else{
io.removeEventListener("load",_3b,false);
}
}
setTimeout(function(){
document.body.removeChild(io);
},100);
};
if(YAHOO.util.Event){
YAHOO.util.Event.addListener(io,"load",_3b);
}else{
if(window.ActiveXObject){
io.attachEvent("onload",_3b);
}else{
io.addEventListener("load",_3b,false);
}
}
},abort:function(o,_3e,_3f){
if(this.isCallInProgress(o)){
o.conn.abort();
window.clearInterval(this._poll[o.tId]);
delete this._poll[o.tId];
if(_3f){
delete this._timeOut[o.tId];
}
this.handleTransactionResponse(o,_3e,true);
return true;
}else{
return false;
}
},isCallInProgress:function(o){
if(o.conn){
return o.conn.readyState!=4&&o.conn.readyState!=0;
}else{
return false;
}
},releaseObject:function(o){
o.conn=null;
o=null;
}};

