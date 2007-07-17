if(typeof YAHOO=="undefined"){
var YAHOO={};
}
YAHOO.namespace=function(){
var a=arguments,o=null,i,j,d;
for(i=0;i<a.length;++i){
d=a[i].split(".");
o=YAHOO;
for(j=(d[0]=="YAHOO")?1:0;j<d.length;++j){
o[d[j]]=o[d[j]]||{};
o=o[d[j]];
}
}
return o;
};
YAHOO.log=function(_2,_3,_4){
var l=YAHOO.widget.Logger;
if(l&&l.log){
return l.log(_2,_3,_4);
}else{
return false;
}
};
YAHOO.extend=function(_6,_7,_8){
var F=function(){
};
F.prototype=_7.prototype;
_6.prototype=new F();
_6.prototype.constructor=_6;
_6.superclass=_7.prototype;
if(_7.prototype.constructor==Object.prototype.constructor){
_7.prototype.constructor=_7;
}
if(_8){
for(var i in _8){
_6.prototype[i]=_8[i];
}
}
};
YAHOO.augment=function(r,s){
var rp=r.prototype,sp=s.prototype,a=arguments,i,p;
if(a[2]){
for(i=2;i<a.length;++i){
rp[a[i]]=sp[a[i]];
}
}else{
for(p in sp){
if(!rp[p]){
rp[p]=sp[p];
}
}
}
};
YAHOO.namespace("util","widget","example");
(function(){
var Y=YAHOO.util,_17,_18,_19=0,_1a={};
var ua=navigator.userAgent.toLowerCase(),_1c=(ua.indexOf("opera")>-1),_1d=(ua.indexOf("safari")>-1),_1e=(!_1c&&!_1d&&ua.indexOf("gecko")>-1),_1f=(!_1c&&ua.indexOf("msie")>-1);
var _20={HYPHEN:/(-[a-z])/i};
var _21=function(_22){
if(!_20.HYPHEN.test(_22)){
return _22;
}
if(_1a[_22]){
return _1a[_22];
}
while(_20.HYPHEN.exec(_22)){
_22=_22.replace(RegExp.$1,RegExp.$1.substr(1).toUpperCase());
}
_1a[_22]=_22;
return _22;
};
if(document.defaultView&&document.defaultView.getComputedStyle){
_17=function(el,_24){
var _25=null;
var _26=document.defaultView.getComputedStyle(el,"");
if(_26){
_25=_26[_21(_24)];
}
return el.style[_24]||_25;
};
}else{
if(document.documentElement.currentStyle&&_1f){
_17=function(el,_28){
switch(_21(_28)){
case "opacity":
var val=100;
try{
val=el.filters["DXImageTransform.Microsoft.Alpha"].opacity;
}
catch(e){
try{
val=el.filters("alpha").opacity;
}
catch(e){
}
}
return val/100;
break;
default:
var _2a=el.currentStyle?el.currentStyle[_28]:null;
return (el.style[_28]||_2a);
}
};
}else{
_17=function(el,_2c){
return el.style[_2c];
};
}
}
if(_1f){
_18=function(el,_2e,val){
switch(_2e){
case "opacity":
if(typeof el.style.filter=="string"){
el.style.filter="alpha(opacity="+val*100+")";
if(!el.currentStyle||!el.currentStyle.hasLayout){
el.style.zoom=1;
}
}
break;
default:
el.style[_2e]=val;
}
};
}else{
_18=function(el,_31,val){
el.style[_31]=val;
};
}
YAHOO.util.Dom={get:function(el){
if(!el){
return null;
}
if(typeof el!="string"&&!(el instanceof Array)){
return el;
}
if(typeof el=="string"){
return document.getElementById(el);
}else{
var _34=[];
for(var i=0,len=el.length;i<len;++i){
_34[_34.length]=Y.Dom.get(el[i]);
}
return _34;
}
return null;
},getStyle:function(el,_38){
_38=_21(_38);
var f=function(_3a){
return _17(_3a,_38);
};
return Y.Dom.batch(el,f,Y.Dom,true);
},setStyle:function(el,_3c,val){
_3c=_21(_3c);
var f=function(_3f){
_18(_3f,_3c,val);
};
Y.Dom.batch(el,f,Y.Dom,true);
},getXY:function(el){
var f=function(el){
if(el.parentNode===null||el.offsetParent===null||this.getStyle(el,"display")=="none"){
return false;
}
var _43=null;
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
var _47=Math.max(doc.documentElement.scrollTop,doc.body.scrollTop);
var _48=Math.max(doc.documentElement.scrollLeft,doc.body.scrollLeft);
return [box.left+_48,box.top+_47];
}else{
pos=[el.offsetLeft,el.offsetTop];
_43=el.offsetParent;
if(_43!=el){
while(_43){
pos[0]+=_43.offsetLeft;
pos[1]+=_43.offsetTop;
_43=_43.offsetParent;
}
}
if(_1d&&this.getStyle(el,"position")=="absolute"){
pos[0]-=document.body.offsetLeft;
pos[1]-=document.body.offsetTop;
}
}
if(el.parentNode){
_43=el.parentNode;
}else{
_43=null;
}
while(_43&&_43.tagName.toUpperCase()!="BODY"&&_43.tagName.toUpperCase()!="HTML"){
if(Y.Dom.getStyle(_43,"display")!="inline"){
pos[0]-=_43.scrollLeft;
pos[1]-=_43.scrollTop;
}
if(_43.parentNode){
_43=_43.parentNode;
}else{
_43=null;
}
}
return pos;
};
return Y.Dom.batch(el,f,Y.Dom,true);
},getX:function(el){
var f=function(el){
return Y.Dom.getXY(el)[0];
};
return Y.Dom.batch(el,f,Y.Dom,true);
},getY:function(el){
var f=function(el){
return Y.Dom.getXY(el)[1];
};
return Y.Dom.batch(el,f,Y.Dom,true);
},setXY:function(el,pos,_51){
var f=function(el){
var _54=this.getStyle(el,"position");
if(_54=="static"){
this.setStyle(el,"position","relative");
_54="relative";
}
var _55=this.getXY(el);
if(_55===false){
return false;
}
var _56=[parseInt(this.getStyle(el,"left"),10),parseInt(this.getStyle(el,"top"),10)];
if(isNaN(_56[0])){
_56[0]=(_54=="relative")?0:el.offsetLeft;
}
if(isNaN(_56[1])){
_56[1]=(_54=="relative")?0:el.offsetTop;
}
if(pos[0]!==null){
el.style.left=pos[0]-_55[0]+_56[0]+"px";
}
if(pos[1]!==null){
el.style.top=pos[1]-_55[1]+_56[1]+"px";
}
var _57=this.getXY(el);
if(!_51&&(_57[0]!=pos[0]||_57[1]!=pos[1])){
this.setXY(el,pos,true);
}
};
Y.Dom.batch(el,f,Y.Dom,true);
},setX:function(el,x){
Y.Dom.setXY(el,[x,null]);
},setY:function(el,y){
Y.Dom.setXY(el,[null,y]);
},getRegion:function(el){
var f=function(el){
var _5f=new Y.Region.getRegion(el);
return _5f;
};
return Y.Dom.batch(el,f,Y.Dom,true);
},getClientWidth:function(){
return Y.Dom.getViewportWidth();
},getClientHeight:function(){
return Y.Dom.getViewportHeight();
},getElementsByClassName:function(_60,tag,_62){
var _63=function(el){
return Y.Dom.hasClass(el,_60);
};
return Y.Dom.getElementsBy(_63,tag,_62);
},hasClass:function(el,_66){
var re=new RegExp("(?:^|\\s+)"+_66+"(?:\\s+|$)");
var f=function(el){
return re.test(el["className"]);
};
return Y.Dom.batch(el,f,Y.Dom,true);
},addClass:function(el,_6b){
var f=function(el){
if(this.hasClass(el,_6b)){
return;
}
el["className"]=[el["className"],_6b].join(" ");
};
Y.Dom.batch(el,f,Y.Dom,true);
},removeClass:function(el,_6f){
var re=new RegExp("(?:^|\\s+)"+_6f+"(?:\\s+|$)","g");
var f=function(el){
if(!this.hasClass(el,_6f)){
return;
}
var c=el["className"];
el["className"]=c.replace(re," ");
if(this.hasClass(el,_6f)){
this.removeClass(el,_6f);
}
};
Y.Dom.batch(el,f,Y.Dom,true);
},replaceClass:function(el,_75,_76){
if(_75===_76){
return false;
}
var re=new RegExp("(?:^|\\s+)"+_75+"(?:\\s+|$)","g");
var f=function(el){
if(!this.hasClass(el,_75)){
this.addClass(el,_76);
return;
}
el["className"]=el["className"].replace(re," "+_76+" ");
if(this.hasClass(el,_75)){
this.replaceClass(el,_75,_76);
}
};
Y.Dom.batch(el,f,Y.Dom,true);
},generateId:function(el,_7b){
_7b=_7b||"yui-gen";
el=el||{};
var f=function(el){
if(el){
el=Y.Dom.get(el);
}else{
el={};
}
if(!el.id){
el.id=_7b+_19++;
}
return el.id;
};
return Y.Dom.batch(el,f,Y.Dom,true);
},isAncestor:function(_7e,_7f){
_7e=Y.Dom.get(_7e);
if(!_7e||!_7f){
return false;
}
var f=function(_81){
if(_7e.contains&&!_1d){
return _7e.contains(_81);
}else{
if(_7e.compareDocumentPosition){
return !!(_7e.compareDocumentPosition(_81)&16);
}else{
var _82=_81.parentNode;
while(_82){
if(_82==_7e){
return true;
}else{
if(!_82.tagName||_82.tagName.toUpperCase()=="HTML"){
return false;
}
}
_82=_82.parentNode;
}
return false;
}
}
};
return Y.Dom.batch(_7f,f,Y.Dom,true);
},inDocument:function(el){
var f=function(el){
return this.isAncestor(document.documentElement,el);
};
return Y.Dom.batch(el,f,Y.Dom,true);
},getElementsBy:function(_86,tag,_88){
tag=tag||"*";
_88=Y.Dom.get(_88)||document;
var _89=[];
var _8a=_88.getElementsByTagName(tag);
if(!_8a.length&&(tag=="*"&&_88.all)){
_8a=_88.all;
}
for(var i=0,len=_8a.length;i<len;++i){
if(_86(_8a[i])){
_89[_89.length]=_8a[i];
}
}
return _89;
},batch:function(el,_8e,o,_90){
var id=el;
el=Y.Dom.get(el);
var _92=(_90)?o:window;
if(!el||el.tagName||!el.length){
if(!el){
return false;
}
return _8e.call(_92,el,o);
}
var _93=[];
for(var i=0,len=el.length;i<len;++i){
if(!el[i]){
id=el[i];
}
_93[_93.length]=_8e.call(_92,el[i],o);
}
return _93;
},getDocumentHeight:function(){
var _96=(document.compatMode!="CSS1Compat")?document.body.scrollHeight:document.documentElement.scrollHeight;
var h=Math.max(_96,Y.Dom.getViewportHeight());
return h;
},getDocumentWidth:function(){
var _98=(document.compatMode!="CSS1Compat")?document.body.scrollWidth:document.documentElement.scrollWidth;
var w=Math.max(_98,Y.Dom.getViewportWidth());
return w;
},getViewportHeight:function(){
var _9a=self.innerHeight;
var _9b=document.compatMode;
if((_9b||_1f)&&!_1c){
_9a=(_9b=="CSS1Compat")?document.documentElement.clientHeight:document.body.clientHeight;
}
return _9a;
},getViewportWidth:function(){
var _9c=self.innerWidth;
var _9d=document.compatMode;
if(_9d||_1f){
_9c=(_9d=="CSS1Compat")?document.documentElement.clientWidth:document.body.clientWidth;
}
return _9c;
}};
})();
YAHOO.util.Region=function(t,r,b,l){
this.top=t;
this[1]=t;
this.right=r;
this.bottom=b;
this.left=l;
this[0]=l;
};
YAHOO.util.Region.prototype.contains=function(_a2){
return (_a2.left>=this.left&&_a2.right<=this.right&&_a2.top>=this.top&&_a2.bottom<=this.bottom);
};
YAHOO.util.Region.prototype.getArea=function(){
return ((this.bottom-this.top)*(this.right-this.left));
};
YAHOO.util.Region.prototype.intersect=function(_a3){
var t=Math.max(this.top,_a3.top);
var r=Math.min(this.right,_a3.right);
var b=Math.min(this.bottom,_a3.bottom);
var l=Math.max(this.left,_a3.left);
if(b>=t&&r>=l){
return new YAHOO.util.Region(t,r,b,l);
}else{
return null;
}
};
YAHOO.util.Region.prototype.union=function(_a8){
var t=Math.min(this.top,_a8.top);
var r=Math.max(this.right,_a8.right);
var b=Math.max(this.bottom,_a8.bottom);
var l=Math.min(this.left,_a8.left);
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
YAHOO.util.CustomEvent=function(_1,_2,_3,_4){
this.type=_1;
this.scope=_2||window;
this.silent=_3;
this.signature=_4||YAHOO.util.CustomEvent.LIST;
this.subscribers=[];
if(!this.silent){
}
var _5="_YUICEOnSubscribe";
if(_1!==_5){
this.subscribeEvent=new YAHOO.util.CustomEvent(_5,this,true);
}
};
YAHOO.util.CustomEvent.LIST=0;
YAHOO.util.CustomEvent.FLAT=1;
YAHOO.util.CustomEvent.prototype={subscribe:function(fn,_7,_8){
if(this.subscribeEvent){
this.subscribeEvent.fire(fn,_7,_8);
}
this.subscribers.push(new YAHOO.util.Subscriber(fn,_7,_8));
},unsubscribe:function(fn,_9){
var _10=false;
for(var i=0,len=this.subscribers.length;i<len;++i){
var s=this.subscribers[i];
if(s&&s.contains(fn,_9)){
this._delete(i);
_10=true;
}
}
return _10;
},fire:function(){
var len=this.subscribers.length;
if(!len&&this.silent){
return true;
}
var _14=[],ret=true,i;
for(i=0;i<arguments.length;++i){
_14.push(arguments[i]);
}
var _15=_14.length;
if(!this.silent){
}
for(i=0;i<len;++i){
var s=this.subscribers[i];
if(s){
if(!this.silent){
}
var _16=s.getScope(this.scope);
if(this.signature==YAHOO.util.CustomEvent.FLAT){
var _17=null;
if(_14.length>0){
_17=_14[0];
}
ret=s.fn.call(_16,_17,s.obj);
}else{
ret=s.fn.call(_16,this.type,_14,s.obj);
}
if(false===ret){
if(!this.silent){
}
return false;
}
}
}
return true;
},unsubscribeAll:function(){
for(var i=0,len=this.subscribers.length;i<len;++i){
this._delete(len-1-i);
}
},_delete:function(_18){
var s=this.subscribers[_18];
if(s){
delete s.fn;
delete s.obj;
}
this.subscribers.splice(_18,1);
},toString:function(){
return "CustomEvent: "+"'"+this.type+"', "+"scope: "+this.scope;
}};
YAHOO.util.Subscriber=function(fn,obj,_20){
this.fn=fn;
this.obj=obj||null;
this.override=_20;
};
YAHOO.util.Subscriber.prototype.getScope=function(_21){
if(this.override){
if(this.override===true){
return this.obj;
}else{
return this.override;
}
}
return _21;
};
YAHOO.util.Subscriber.prototype.contains=function(fn,obj){
if(obj){
return (this.fn==fn&&this.obj==obj);
}else{
return (this.fn==fn);
}
};
YAHOO.util.Subscriber.prototype.toString=function(){
return "Subscriber { obj: "+(this.obj||"")+", override: "+(this.override||"no")+" }";
};
if(!YAHOO.util.Event){
YAHOO.util.Event=function(){
var _22=false;
var _23=[];
var _24=[];
var _25=[];
var _26=[];
var _27=0;
var _28=[];
var _29=[];
var _30=0;
return {POLL_RETRYS:200,POLL_INTERVAL:20,EL:0,TYPE:1,FN:2,WFN:3,OBJ:3,ADJ_SCOPE:4,isSafari:(/Safari|Konqueror|KHTML/gi).test(navigator.userAgent),isIE:(!this.isSafari&&!navigator.userAgent.match(/opera/gi)&&navigator.userAgent.match(/msie/gi)),_interval:null,startInterval:function(){
if(!this._interval){
var _31=this;
var _32=function(){
_31._tryPreloadAttach();
};
this._interval=setInterval(_32,this.POLL_INTERVAL);
}
},onAvailable:function(_33,_34,_35,_36){
_28.push({id:_33,fn:_34,obj:_35,override:_36,checkReady:false});
_27=this.POLL_RETRYS;
this.startInterval();
},onContentReady:function(_37,_38,_39,_40){
_28.push({id:_37,fn:_38,obj:_39,override:_40,checkReady:true});
_27=this.POLL_RETRYS;
this.startInterval();
},addListener:function(el,_42,fn,obj,_43){
if(!fn||!fn.call){
return false;
}
if(this._isValidCollection(el)){
var ok=true;
for(var i=0,len=el.length;i<len;++i){
ok=this.on(el[i],_42,fn,obj,_43)&&ok;
}
return ok;
}else{
if(typeof el=="string"){
var oEl=this.getEl(el);
if(oEl){
el=oEl;
}else{
this.onAvailable(el,function(){
YAHOO.util.Event.on(el,_42,fn,obj,_43);
});
return true;
}
}
}
if(!el){
return false;
}
if("unload"==_42&&obj!==this){
_24[_24.length]=[el,_42,fn,obj,_43];
return true;
}
var _46=el;
if(_43){
if(_43===true){
_46=obj;
}else{
_46=_43;
}
}
var _47=function(e){
return fn.call(_46,YAHOO.util.Event.getEvent(e),obj);
};
var li=[el,_42,fn,_47,_46];
var _50=_23.length;
_23[_50]=li;
if(this.useLegacyEvent(el,_42)){
var _51=this.getLegacyIndex(el,_42);
if(_51==-1||el!=_25[_51][0]){
_51=_25.length;
_29[el.id+_42]=_51;
_25[_51]=[el,_42,el["on"+_42]];
_26[_51]=[];
el["on"+_42]=function(e){
YAHOO.util.Event.fireLegacyEvent(YAHOO.util.Event.getEvent(e),_51);
};
}
_26[_51].push(li);
}else{
this._simpleAdd(el,_42,_47,false);
}
return true;
},fireLegacyEvent:function(e,_52){
var ok=true;
var le=_26[_52];
for(var i=0,len=le.length;i<len;++i){
var li=le[i];
if(li&&li[this.WFN]){
var _54=li[this.ADJ_SCOPE];
var ret=li[this.WFN].call(_54,e);
ok=(ok&&ret);
}
}
return ok;
},getLegacyIndex:function(el,_56){
var key=this.generateId(el)+_56;
if(typeof _29[key]=="undefined"){
return -1;
}else{
return _29[key];
}
},useLegacyEvent:function(el,_58){
if(!el.addEventListener&&!el.attachEvent){
return true;
}else{
if(this.isSafari){
if("click"==_58||"dblclick"==_58){
return true;
}
}
}
return false;
},removeListener:function(el,_59,fn){
var i,len;
if(typeof el=="string"){
el=this.getEl(el);
}else{
if(this._isValidCollection(el)){
var ok=true;
for(i=0,len=el.length;i<len;++i){
ok=(this.removeListener(el[i],_59,fn)&&ok);
}
return ok;
}
}
if(!fn||!fn.call){
return this.purgeElement(el,false,_59);
}
if("unload"==_59){
for(i=0,len=_24.length;i<len;i++){
var li=_24[i];
if(li&&li[0]==el&&li[1]==_59&&li[2]==fn){
_24.splice(i,1);
return true;
}
}
return false;
}
var _60=null;
var _61=arguments[3];
if("undefined"==typeof _61){
_61=this._getCacheIndex(el,_59,fn);
}
if(_61>=0){
_60=_23[_61];
}
if(!el||!_60){
return false;
}
if(this.useLegacyEvent(el,_59)){
var _62=this.getLegacyIndex(el,_59);
var _63=_26[_62];
if(_63){
for(i=0,len=_63.length;i<len;++i){
li=_63[i];
if(li&&li[this.EL]==el&&li[this.TYPE]==_59&&li[this.FN]==fn){
_63.splice(i,1);
}
}
}
}else{
this._simpleRemove(el,_59,_60[this.WFN],false);
}
delete _23[_61][this.WFN];
delete _23[_61][this.FN];
_23.splice(_61,1);
return true;
},getTarget:function(ev,_65){
var t=ev.target||ev.srcElement;
return this.resolveTextNode(t);
},resolveTextNode:function(_67){
if(_67&&3==_67.nodeType){
return _67.parentNode;
}else{
return _67;
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
return ev.charCode||ev.keyCode||0;
},_getCacheIndex:function(el,_71,fn){
for(var i=0,len=_23.length;i<len;++i){
var li=_23[i];
if(li&&li[this.FN]==fn&&li[this.EL]==el&&li[this.TYPE]==_71){
return i;
}
}
return -1;
},generateId:function(el){
var id=el.id;
if(!id){
id="yuievtautoid-"+_30;
++_30;
el.id=id;
}
return id;
},_isValidCollection:function(o){
return (o&&o.length&&typeof o!="string"&&!o.tagName&&!o.alert&&typeof o[0]!="undefined");
},elCache:{},getEl:function(id){
return document.getElementById(id);
},clearCache:function(){
},_load:function(e){
_22=true;
var EU=YAHOO.util.Event;
if(this.isIE){
EU._simpleRemove(window,"load",EU._load);
}
},_tryPreloadAttach:function(){
if(this.locked){
return false;
}
this.locked=true;
var _75=!_22;
if(!_75){
_75=(_27>0);
}
var _76=[];
for(var i=0,len=_28.length;i<len;++i){
var _77=_28[i];
if(_77){
var el=this.getEl(_77.id);
if(el){
if(!_77.checkReady||_22||el.nextSibling||(document&&document.body)){
var _78=el;
if(_77.override){
if(_77.override===true){
_78=_77.obj;
}else{
_78=_77.override;
}
}
_77.fn.call(_78,_77.obj);
delete _28[i];
}
}else{
_76.push(_77);
}
}
}
_27=(_76.length===0)?0:_27-1;
if(_75){
this.startInterval();
}else{
clearInterval(this._interval);
this._interval=null;
}
this.locked=false;
return true;
},purgeElement:function(el,_79,_80){
var _81=this.getListeners(el,_80);
if(_81){
for(var i=0,len=_81.length;i<len;++i){
var l=_81[i];
this.removeListener(el,l.type,l.fn);
}
}
if(_79&&el&&el.childNodes){
for(i=0,len=el.childNodes.length;i<len;++i){
this.purgeElement(el.childNodes[i],_79,_80);
}
}
},getListeners:function(el,_83){
var _84=[];
if(_23&&_23.length>0){
for(var i=0,len=_23.length;i<len;++i){
var l=_23[i];
if(l&&l[this.EL]===el&&(!_83||_83===l[this.TYPE])){
_84.push({type:l[this.TYPE],fn:l[this.FN],obj:l[this.OBJ],adjust:l[this.ADJ_SCOPE],index:i});
}
}
}
return (_84.length)?_84:null;
},_unload:function(e){
var EU=YAHOO.util.Event,i,j,l,len,_14b;
for(i=0,len=_24.length;i<len;++i){
l=_24[i];
if(l){
var _85=window;
if(l[EU.ADJ_SCOPE]){
if(l[EU.ADJ_SCOPE]===true){
_85=l[EU.OBJ];
}else{
_85=l[EU.ADJ_SCOPE];
}
}
l[EU.FN].call(_85,EU.getEvent(e),l[EU.OBJ]);
delete _24[i];
l=null;
_85=null;
}
}
if(_23&&_23.length>0){
j=_23.length;
while(j){
_14b=j-1;
l=_23[_14b];
if(l){
EU.removeListener(l[EU.EL],l[EU.TYPE],l[EU.FN],_14b);
}
j=j-1;
}
l=null;
EU.clearCache();
}
for(i=0,len=_25.length;i<len;++i){
delete _25[i][0];
delete _25[i];
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
},_simpleAdd:function(){
if(window.addEventListener){
return function(el,_87,fn,_88){
el.addEventListener(_87,fn,(_88));
};
}else{
if(window.attachEvent){
return function(el,_89,fn,_90){
el.attachEvent("on"+_89,fn);
};
}else{
return function(){
};
}
}
}(),_simpleRemove:function(){
if(window.removeEventListener){
return function(el,_91,fn,_92){
el.removeEventListener(_91,fn,(_92));
};
}else{
if(window.detachEvent){
return function(el,_93,fn){
el.detachEvent("on"+_93,fn);
};
}else{
return function(){
};
}
}
}()};
}();
(function(){
var EU=YAHOO.util.Event;
EU.on=EU.addListener;
if(document&&document.body){
EU._load();
}else{
EU._simpleAdd(window,"load",EU._load);
}
EU._simpleAdd(window,"unload",EU._unload);
EU._tryPreloadAttach();
})();
}
YAHOO.util.EventProvider=function(){
};
YAHOO.util.EventProvider.prototype={__yui_events:null,__yui_subscribers:null,subscribe:function(_94,_95,_96,_97){
this.__yui_events=this.__yui_events||{};
var ce=this.__yui_events[_94];
if(ce){
ce.subscribe(_95,_96,_97);
}else{
this.__yui_subscribers=this.__yui_subscribers||{};
var _99=this.__yui_subscribers;
if(!_99[_94]){
_99[_94]=[];
}
_99[_94].push({fn:_95,obj:_96,override:_97});
}
},unsubscribe:function(_100,p_fn,_102){
this.__yui_events=this.__yui_events||{};
var ce=this.__yui_events[_100];
if(ce){
return ce.unsubscribe(p_fn,_102);
}else{
return false;
}
},createEvent:function(_103,_104){
this.__yui_events=this.__yui_events||{};
var opts=_104||{};
var _106=this.__yui_events;
if(_106[_103]){
}else{
var _107=opts.scope||this;
var _108=opts.silent||null;
var ce=new YAHOO.util.CustomEvent(_103,_107,_108,YAHOO.util.CustomEvent.FLAT);
_106[_103]=ce;
if(opts.onSubscribeCallback){
ce.subscribeEvent.subscribe(opts.onSubscribeCallback);
}
this.__yui_subscribers=this.__yui_subscribers||{};
var qs=this.__yui_subscribers[_103];
if(qs){
for(var i=0;i<qs.length;++i){
ce.subscribe(qs[i].fn,qs[i].obj,qs[i].override);
}
}
}
return _106[_103];
},fireEvent:function(_110,arg1,arg2,etc){
this.__yui_events=this.__yui_events||{};
var ce=this.__yui_events[_110];
if(ce){
var args=[];
for(var i=1;i<arguments.length;++i){
args.push(arguments[i]);
}
return ce.fire.apply(ce,args);
}else{
return null;
}
},hasEvent:function(type){
if(this.__yui_events){
if(this.__yui_events[type]){
return true;
}
}
return false;
}};
YAHOO.util.Anim=function(el,_17b,_17c,_17d){
if(el){
this.init(el,_17b,_17c,_17d);
}
};
YAHOO.util.Anim.prototype={toString:function(){
var el=this.getEl();
var id=el.id||el.tagName;
return ("Anim "+id);
},patterns:{noNegatives:/width|height|opacity|padding/i,offsetAttribute:/^((width|height)|(top|left))$/,defaultUnit:/width|height|top$|bottom$|left$|right$/i,offsetUnit:/\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i},doMethod:function(attr,_181,end){
return this.method(this.currentFrame,_181,end-_181,this.totalFrames);
},setAttribute:function(attr,val,unit){
if(this.patterns.noNegatives.test(attr)){
val=(val>0)?val:0;
}
YAHOO.util.Dom.setStyle(this.getEl(),attr,val+unit);
},getAttribute:function(attr){
var el=this.getEl();
var val=YAHOO.util.Dom.getStyle(el,attr);
if(val!=="auto"&&!this.patterns.offsetUnit.test(val)){
return parseFloat(val);
}
var a=this.patterns.offsetAttribute.exec(attr)||[];
var pos=!!(a[3]);
var box=!!(a[2]);
if(box||(YAHOO.util.Dom.getStyle(el,"position")=="absolute"&&pos)){
val=el["offset"+a[0].charAt(0).toUpperCase()+a[0].substr(1)];
}else{
val=0;
}
return val;
},getDefaultUnit:function(attr){
if(this.patterns.defaultUnit.test(attr)){
return "px";
}
return "";
},setRuntimeAttribute:function(attr){
var _18e;
var end;
var _190=this.attributes;
this.runtimeAttributes[attr]={};
var _191=function(prop){
return (typeof prop!=="undefined");
};
if(!_191(_190[attr]["to"])&&!_191(_190[attr]["by"])){
return false;
}
_18e=(_191(_190[attr]["from"]))?_190[attr]["from"]:this.getAttribute(attr);
if(_191(_190[attr]["to"])){
end=_190[attr]["to"];
}else{
if(_191(_190[attr]["by"])){
if(_18e.constructor==Array){
end=[];
for(var i=0,len=_18e.length;i<len;++i){
end[i]=_18e[i]+_190[attr]["by"][i];
}
}else{
end=_18e+_190[attr]["by"];
}
}
}
this.runtimeAttributes[attr].start=_18e;
this.runtimeAttributes[attr].end=end;
this.runtimeAttributes[attr].unit=(_191(_190[attr].unit))?_190[attr]["unit"]:this.getDefaultUnit(attr);
},init:function(el,_196,_197,_198){
var _199=false;
var _19a=null;
var _19b=0;
el=YAHOO.util.Dom.get(el);
this.attributes=_196||{};
this.duration=_197||1;
this.method=_198||YAHOO.util.Easing.easeNone;
this.useSeconds=true;
this.currentFrame=0;
this.totalFrames=YAHOO.util.AnimMgr.fps;
this.getEl=function(){
return el;
};
this.isAnimated=function(){
return _199;
};
this.getStartTime=function(){
return _19a;
};
this.runtimeAttributes={};
this.animate=function(){
if(this.isAnimated()){
return false;
}
this.currentFrame=0;
this.totalFrames=(this.useSeconds)?Math.ceil(YAHOO.util.AnimMgr.fps*this.duration):this.duration;
YAHOO.util.AnimMgr.registerElement(this);
};
this.stop=function(_19c){
if(_19c){
this.currentFrame=this.totalFrames;
this._onTween.fire();
}
YAHOO.util.AnimMgr.stop(this);
};
var _19d=function(){
this.onStart.fire();
this.runtimeAttributes={};
for(var attr in this.attributes){
this.setRuntimeAttribute(attr);
}
_199=true;
_19b=0;
_19a=new Date();
};
var _19f=function(){
var data={duration:new Date()-this.getStartTime(),currentFrame:this.currentFrame};
data.toString=function(){
return ("duration: "+data.duration+", currentFrame: "+data.currentFrame);
};
this.onTween.fire(data);
var _1a1=this.runtimeAttributes;
for(var attr in _1a1){
this.setAttribute(attr,this.doMethod(attr,_1a1[attr].start,_1a1[attr].end),_1a1[attr].unit);
}
_19b+=1;
};
var _1a3=function(){
var _1a4=(new Date()-_19a)/1000;
var data={duration:_1a4,frames:_19b,fps:_19b/_1a4};
data.toString=function(){
return ("duration: "+data.duration+", frames: "+data.frames+", fps: "+data.fps);
};
_199=false;
_19b=0;
this.onComplete.fire(data);
};
this._onStart=new YAHOO.util.CustomEvent("_start",this,true);
this.onStart=new YAHOO.util.CustomEvent("start",this);
this.onTween=new YAHOO.util.CustomEvent("tween",this);
this._onTween=new YAHOO.util.CustomEvent("_tween",this,true);
this.onComplete=new YAHOO.util.CustomEvent("complete",this);
this._onComplete=new YAHOO.util.CustomEvent("_complete",this,true);
this._onStart.subscribe(_19d);
this._onTween.subscribe(_19f);
this._onComplete.subscribe(_1a3);
}};
YAHOO.util.AnimMgr=new function(){
var _1a6=null;
var _1a7=[];
var _1a8=0;
this.fps=200;
this.delay=1;
this.registerElement=function(_1a9){
_1a7[_1a7.length]=_1a9;
_1a8+=1;
_1a9._onStart.fire();
this.start();
};
this.unRegister=function(_1aa,_1ab){
_1aa._onComplete.fire();
_1ab=_1ab||_1ac(_1aa);
if(_1ab!=-1){
_1a7.splice(_1ab,1);
}
_1a8-=1;
if(_1a8<=0){
this.stop();
}
};
this.start=function(){
if(_1a6===null){
_1a6=setInterval(this.run,this.delay);
}
};
this.stop=function(_1ad){
if(!_1ad){
clearInterval(_1a6);
for(var i=0,len=_1a7.length;i<len;++i){
if(_1a7[i].isAnimated()){
this.unRegister(_1ad,i);
}
}
_1a7=[];
_1a6=null;
_1a8=0;
}else{
this.unRegister(_1ad);
}
};
this.run=function(){
for(var i=0,len=_1a7.length;i<len;++i){
var _1b2=_1a7[i];
if(!_1b2||!_1b2.isAnimated()){
continue;
}
if(_1b2.currentFrame<_1b2.totalFrames||_1b2.totalFrames===null){
_1b2.currentFrame+=1;
if(_1b2.useSeconds){
_1b3(_1b2);
}
_1b2._onTween.fire();
}else{
YAHOO.util.AnimMgr.stop(_1b2,i);
}
}
};
var _1ac=function(anim){
for(var i=0,len=_1a7.length;i<len;++i){
if(_1a7[i]==anim){
return i;
}
}
return -1;
};
var _1b3=function(_1b7){
var _1b8=_1b7.totalFrames;
var _1b9=_1b7.currentFrame;
var _1ba=(_1b7.currentFrame*_1b7.duration*1000/_1b7.totalFrames);
var _1bb=(new Date()-_1b7.getStartTime());
var _1bc=0;
if(_1bb<_1b7.duration*1000){
_1bc=Math.round((_1bb/_1ba-1)*_1b7.currentFrame);
}else{
_1bc=_1b8-(_1b9+1);
}
if(_1bc>0&&isFinite(_1bc)){
if(_1b7.currentFrame+_1bc>=_1b8){
_1bc=_1b8-(_1b9+1);
}
_1b7.currentFrame+=_1bc;
}
};
};
YAHOO.util.Bezier=new function(){
this.getPosition=function(_1bd,t){
var n=_1bd.length;
var tmp=[];
for(var i=0;i<n;++i){
tmp[i]=[_1bd[i][0],_1bd[i][1]];
}
for(var j=1;j<n;++j){
for(i=0;i<n-j;++i){
tmp[i][0]=(1-t)*tmp[i][0]+t*tmp[parseInt(i+1,10)][0];
tmp[i][1]=(1-t)*tmp[i][1]+t*tmp[parseInt(i+1,10)][1];
}
}
return [tmp[0][0],tmp[0][1]];
};
};
(function(){
YAHOO.util.ColorAnim=function(el,_1c4,_1c5,_1c6){
YAHOO.util.ColorAnim.superclass.constructor.call(this,el,_1c4,_1c5,_1c6);
};
YAHOO.extend(YAHOO.util.ColorAnim,YAHOO.util.Anim);
var Y=YAHOO.util;
var _1c8=Y.ColorAnim.superclass;
var _1c9=Y.ColorAnim.prototype;
_1c9.toString=function(){
var el=this.getEl();
var id=el.id||el.tagName;
return ("ColorAnim "+id);
};
_1c9.patterns.color=/color$/i;
_1c9.patterns.rgb=/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;
_1c9.patterns.hex=/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;
_1c9.patterns.hex3=/^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;
_1c9.patterns.transparent=/^transparent|rgba\(0, 0, 0, 0\)$/;
_1c9.parseColor=function(s){
if(s.length==3){
return s;
}
var c=this.patterns.hex.exec(s);
if(c&&c.length==4){
return [parseInt(c[1],16),parseInt(c[2],16),parseInt(c[3],16)];
}
c=this.patterns.rgb.exec(s);
if(c&&c.length==4){
return [parseInt(c[1],10),parseInt(c[2],10),parseInt(c[3],10)];
}
c=this.patterns.hex3.exec(s);
if(c&&c.length==4){
return [parseInt(c[1]+c[1],16),parseInt(c[2]+c[2],16),parseInt(c[3]+c[3],16)];
}
return null;
};
_1c9.getAttribute=function(attr){
var el=this.getEl();
if(this.patterns.color.test(attr)){
var val=YAHOO.util.Dom.getStyle(el,attr);
if(this.patterns.transparent.test(val)){
var _1d1=el.parentNode;
val=Y.Dom.getStyle(_1d1,attr);
while(_1d1&&this.patterns.transparent.test(val)){
_1d1=_1d1.parentNode;
val=Y.Dom.getStyle(_1d1,attr);
if(_1d1.tagName.toUpperCase()=="HTML"){
val="#fff";
}
}
}
}else{
val=_1c8.getAttribute.call(this,attr);
}
return val;
};
_1c9.doMethod=function(attr,_1d3,end){
var val;
if(this.patterns.color.test(attr)){
val=[];
for(var i=0,len=_1d3.length;i<len;++i){
val[i]=_1c8.doMethod.call(this,attr,_1d3[i],end[i]);
}
val="rgb("+Math.floor(val[0])+","+Math.floor(val[1])+","+Math.floor(val[2])+")";
}else{
val=_1c8.doMethod.call(this,attr,_1d3,end);
}
return val;
};
_1c9.setRuntimeAttribute=function(attr){
_1c8.setRuntimeAttribute.call(this,attr);
if(this.patterns.color.test(attr)){
var _1d9=this.attributes;
var _1da=this.parseColor(this.runtimeAttributes[attr].start);
var end=this.parseColor(this.runtimeAttributes[attr].end);
if(typeof _1d9[attr]["to"]==="undefined"&&typeof _1d9[attr]["by"]!=="undefined"){
end=this.parseColor(_1d9[attr].by);
for(var i=0,len=_1da.length;i<len;++i){
end[i]=_1da[i]+end[i];
}
}
this.runtimeAttributes[attr].start=_1da;
this.runtimeAttributes[attr].end=end;
}
};
})();
YAHOO.util.Easing={easeNone:function(t,b,c,d){
return c*t/d+b;
},easeIn:function(t,b,c,d){
return c*(t/=d)*t+b;
},easeOut:function(t,b,c,d){
return -c*(t/=d)*(t-2)+b;
},easeBoth:function(t,b,c,d){
if((t/=d/2)<1){
return c/2*t*t+b;
}
return -c/2*((--t)*(t-2)-1)+b;
},easeInStrong:function(t,b,c,d){
return c*(t/=d)*t*t*t+b;
},easeOutStrong:function(t,b,c,d){
return -c*((t=t/d-1)*t*t*t-1)+b;
},easeBothStrong:function(t,b,c,d){
if((t/=d/2)<1){
return c/2*t*t*t*t+b;
}
return -c/2*((t-=2)*t*t*t-2)+b;
},elasticIn:function(t,b,c,d,a,p){
if(t==0){
return b;
}
if((t/=d)==1){
return b+c;
}
if(!p){
p=d*0.3;
}
if(!a||a<Math.abs(c)){
a=c;
var s=p/4;
}else{
var s=p/(2*Math.PI)*Math.asin(c/a);
}
return -(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;
},elasticOut:function(t,b,c,d,a,p){
if(t==0){
return b;
}
if((t/=d)==1){
return b+c;
}
if(!p){
p=d*0.3;
}
if(!a||a<Math.abs(c)){
a=c;
var s=p/4;
}else{
var s=p/(2*Math.PI)*Math.asin(c/a);
}
return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b;
},elasticBoth:function(t,b,c,d,a,p){
if(t==0){
return b;
}
if((t/=d/2)==2){
return b+c;
}
if(!p){
p=d*(0.3*1.5);
}
if(!a||a<Math.abs(c)){
a=c;
var s=p/4;
}else{
var s=p/(2*Math.PI)*Math.asin(c/a);
}
if(t<1){
return -0.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;
}
return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*0.5+c+b;
},backIn:function(t,b,c,d,s){
if(typeof s=="undefined"){
s=1.70158;
}
return c*(t/=d)*t*((s+1)*t-s)+b;
},backOut:function(t,b,c,d,s){
if(typeof s=="undefined"){
s=1.70158;
}
return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;
},backBoth:function(t,b,c,d,s){
if(typeof s=="undefined"){
s=1.70158;
}
if((t/=d/2)<1){
return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;
}
return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;
},bounceIn:function(t,b,c,d){
return c-YAHOO.util.Easing.bounceOut(d-t,0,c,d)+b;
},bounceOut:function(t,b,c,d){
if((t/=d)<(1/2.75)){
return c*(7.5625*t*t)+b;
}else{
if(t<(2/2.75)){
return c*(7.5625*(t-=(1.5/2.75))*t+0.75)+b;
}else{
if(t<(2.5/2.75)){
return c*(7.5625*(t-=(2.25/2.75))*t+0.9375)+b;
}else{
return c*(7.5625*(t-=(2.625/2.75))*t+0.984375)+b;
}
}
}
},bounceBoth:function(t,b,c,d){
if(t<d/2){
return YAHOO.util.Easing.bounceIn(t*2,0,c,d)*0.5+b;
}
return YAHOO.util.Easing.bounceOut(t*2-d,0,c,d)*0.5+c*0.5+b;
}};
(function(){
YAHOO.util.Motion=function(el,_22b,_22c,_22d){
if(el){
YAHOO.util.Motion.superclass.constructor.call(this,el,_22b,_22c,_22d);
}
};
YAHOO.extend(YAHOO.util.Motion,YAHOO.util.ColorAnim);
var Y=YAHOO.util;
var _22f=Y.Motion.superclass;
var _230=Y.Motion.prototype;
_230.toString=function(){
var el=this.getEl();
var id=el.id||el.tagName;
return ("Motion "+id);
};
_230.patterns.points=/^points$/i;
_230.setAttribute=function(attr,val,unit){
if(this.patterns.points.test(attr)){
unit=unit||"px";
_22f.setAttribute.call(this,"left",val[0],unit);
_22f.setAttribute.call(this,"top",val[1],unit);
}else{
_22f.setAttribute.call(this,attr,val,unit);
}
};
_230.getAttribute=function(attr){
if(this.patterns.points.test(attr)){
var val=[_22f.getAttribute.call(this,"left"),_22f.getAttribute.call(this,"top")];
}else{
val=_22f.getAttribute.call(this,attr);
}
return val;
};
_230.doMethod=function(attr,_239,end){
var val=null;
if(this.patterns.points.test(attr)){
var t=this.method(this.currentFrame,0,100,this.totalFrames)/100;
val=Y.Bezier.getPosition(this.runtimeAttributes[attr],t);
}else{
val=_22f.doMethod.call(this,attr,_239,end);
}
return val;
};
_230.setRuntimeAttribute=function(attr){
if(this.patterns.points.test(attr)){
var el=this.getEl();
var _23f=this.attributes;
var _240;
var _241=_23f["points"]["control"]||[];
var end;
var i,len;
if(_241.length>0&&!(_241[0] instanceof Array)){
_241=[_241];
}else{
var tmp=[];
for(i=0,len=_241.length;i<len;++i){
tmp[i]=_241[i];
}
_241=tmp;
}
if(Y.Dom.getStyle(el,"position")=="static"){
Y.Dom.setStyle(el,"position","relative");
}
if(_246(_23f["points"]["from"])){
Y.Dom.setXY(el,_23f["points"]["from"]);
}else{
Y.Dom.setXY(el,Y.Dom.getXY(el));
}
_240=this.getAttribute("points");
if(_246(_23f["points"]["to"])){
end=_247.call(this,_23f["points"]["to"],_240);
var _248=Y.Dom.getXY(this.getEl());
for(i=0,len=_241.length;i<len;++i){
_241[i]=_247.call(this,_241[i],_240);
}
}else{
if(_246(_23f["points"]["by"])){
end=[_240[0]+_23f["points"]["by"][0],_240[1]+_23f["points"]["by"][1]];
for(i=0,len=_241.length;i<len;++i){
_241[i]=[_240[0]+_241[i][0],_240[1]+_241[i][1]];
}
}
}
this.runtimeAttributes[attr]=[_240];
if(_241.length>0){
this.runtimeAttributes[attr]=this.runtimeAttributes[attr].concat(_241);
}
this.runtimeAttributes[attr][this.runtimeAttributes[attr].length]=end;
}else{
_22f.setRuntimeAttribute.call(this,attr);
}
};
var _247=function(val,_24a){
var _24b=Y.Dom.getXY(this.getEl());
val=[val[0]-_24b[0]+_24a[0],val[1]-_24b[1]+_24a[1]];
return val;
};
var _246=function(prop){
return (typeof prop!=="undefined");
};
})();
(function(){
YAHOO.util.Scroll=function(el,_24e,_24f,_250){
if(el){
YAHOO.util.Scroll.superclass.constructor.call(this,el,_24e,_24f,_250);
}
};
YAHOO.extend(YAHOO.util.Scroll,YAHOO.util.ColorAnim);
var Y=YAHOO.util;
var _252=Y.Scroll.superclass;
var _253=Y.Scroll.prototype;
_253.toString=function(){
var el=this.getEl();
var id=el.id||el.tagName;
return ("Scroll "+id);
};
_253.doMethod=function(attr,_257,end){
var val=null;
if(attr=="scroll"){
val=[this.method(this.currentFrame,_257[0],end[0]-_257[0],this.totalFrames),this.method(this.currentFrame,_257[1],end[1]-_257[1],this.totalFrames)];
}else{
val=_252.doMethod.call(this,attr,_257,end);
}
return val;
};
_253.getAttribute=function(attr){
var val=null;
var el=this.getEl();
if(attr=="scroll"){
val=[el.scrollLeft,el.scrollTop];
}else{
val=_252.getAttribute.call(this,attr);
}
return val;
};
_253.setAttribute=function(attr,val,unit){
var el=this.getEl();
if(attr=="scroll"){
el.scrollLeft=val[0];
el.scrollTop=val[1];
}else{
_252.setAttribute.call(this,attr,val,unit);
}
};
})();
(function(){
var _1=YAHOO.util.Event;
var _2=YAHOO.util.Dom;
YAHOO.util.DragDrop=function(id,_4,_5){
if(id){
this.init(id,_4,_5);
}
};
YAHOO.util.DragDrop.prototype={id:null,config:null,dragElId:null,handleElId:null,invalidHandleTypes:null,invalidHandleIds:null,invalidHandleClasses:null,startPageX:0,startPageY:0,groups:null,locked:false,lock:function(){
this.locked=true;
},unlock:function(){
this.locked=false;
},isTarget:true,padding:null,_domRef:null,__ygDragDrop:true,constrainX:false,constrainY:false,minX:0,maxX:0,minY:0,maxY:0,maintainOffset:false,xTicks:null,yTicks:null,primaryButtonOnly:true,available:false,hasOuterHandles:false,b4StartDrag:function(x,y){
},startDrag:function(x,y){
},b4Drag:function(e){
},onDrag:function(e){
},onDragEnter:function(e,id){
},b4DragOver:function(e){
},onDragOver:function(e,id){
},b4DragOut:function(e){
},onDragOut:function(e,id){
},b4DragDrop:function(e){
},onDragDrop:function(e,id){
},onInvalidDrop:function(e){
},b4EndDrag:function(e){
},endDrag:function(e){
},b4MouseDown:function(e){
},onMouseDown:function(e){
},onMouseUp:function(e){
},onAvailable:function(){
},getEl:function(){
if(!this._domRef){
this._domRef=_2.get(this.id);
}
return this._domRef;
},getDragEl:function(){
return _2.get(this.dragElId);
},init:function(id,_9,_10){
this.initTarget(id,_9,_10);
_1.on(this.id,"mousedown",this.handleMouseDown,this,true);
},initTarget:function(id,_11,_12){
this.config=_12||{};
this.DDM=YAHOO.util.DDM;
this.groups={};
if(typeof id!=="string"){
YAHOO.log("id is not a string, assuming it is an HTMLElement");
id=_2.generateId(id);
}
this.id=id;
this.addToGroup((_11)?_11:"default");
this.handleElId=id;
_1.onAvailable(id,this.handleOnAvailable,this,true);
this.setDragElId(id);
this.invalidHandleTypes={A:"A"};
this.invalidHandleIds={};
this.invalidHandleClasses=[];
this.applyConfig();
},applyConfig:function(){
this.padding=this.config.padding||[0,0,0,0];
this.isTarget=(this.config.isTarget!==false);
this.maintainOffset=(this.config.maintainOffset);
this.primaryButtonOnly=(this.config.primaryButtonOnly!==false);
},handleOnAvailable:function(){
this.available=true;
this.resetConstraints();
this.onAvailable();
},setPadding:function(_13,_14,_15,_16){
if(!_14&&0!==_14){
this.padding=[_13,_13,_13,_13];
}else{
if(!_15&&0!==_15){
this.padding=[_13,_14,_13,_14];
}else{
this.padding=[_13,_14,_15,_16];
}
}
},setInitPosition:function(_17,_18){
var el=this.getEl();
if(!this.DDM.verifyEl(el)){
return;
}
var dx=_17||0;
var dy=_18||0;
var p=_2.getXY(el);
this.initPageX=p[0]-dx;
this.initPageY=p[1]-dy;
this.lastPageX=p[0];
this.lastPageY=p[1];
this.setStartPosition(p);
},setStartPosition:function(pos){
var p=pos||_2.getXY(this.getEl());
this.deltaSetXY=null;
this.startPageX=p[0];
this.startPageY=p[1];
},addToGroup:function(_24){
this.groups[_24]=true;
this.DDM.regDragDrop(this,_24);
},removeFromGroup:function(_25){
if(this.groups[_25]){
delete this.groups[_25];
}
this.DDM.removeDDFromGroup(this,_25);
},setDragElId:function(id){
this.dragElId=id;
},setHandleElId:function(id){
if(typeof id!=="string"){
YAHOO.log("id is not a string, assuming it is an HTMLElement");
id=_2.generateId(id);
}
this.handleElId=id;
this.DDM.regHandle(this.id,id);
},setOuterHandleElId:function(id){
if(typeof id!=="string"){
YAHOO.log("id is not a string, assuming it is an HTMLElement");
id=_2.generateId(id);
}
_1.on(id,"mousedown",this.handleMouseDown,this,true);
this.setHandleElId(id);
this.hasOuterHandles=true;
},unreg:function(){
_1.removeListener(this.id,"mousedown",this.handleMouseDown);
this._domRef=null;
this.DDM._remove(this);
},isLocked:function(){
return (this.DDM.isLocked()||this.locked);
},handleMouseDown:function(e,oDD){
var _27=e.which||e.button;
if(this.primaryButtonOnly&&_27>1){
return;
}
if(this.isLocked()){
return;
}
this.DDM.refreshCache(this.groups);
var pt=new YAHOO.util.Point(_1.getPageX(e),_1.getPageY(e));
if(!this.hasOuterHandles&&!this.DDM.isOverTarget(pt,this)){
}else{
if(this.clickValidator(e)){
this.setStartPosition();
this.b4MouseDown(e);
this.onMouseDown(e);
this.DDM.handleMouseDown(e,this);
this.DDM.stopEvent(e);
}else{
}
}
},clickValidator:function(e){
var _29=_1.getTarget(e);
return (this.isValidHandleChild(_29)&&(this.id==this.handleElId||this.DDM.handleWasClicked(_29,this.id)));
},addInvalidHandleType:function(_30){
var _31=_30.toUpperCase();
this.invalidHandleTypes[_31]=_31;
},addInvalidHandleId:function(id){
if(typeof id!=="string"){
YAHOO.log("id is not a string, assuming it is an HTMLElement");
id=_2.generateId(id);
}
this.invalidHandleIds[id]=id;
},addInvalidHandleClass:function(_32){
this.invalidHandleClasses.push(_32);
},removeInvalidHandleType:function(_33){
var _34=_33.toUpperCase();
delete this.invalidHandleTypes[_34];
},removeInvalidHandleId:function(id){
if(typeof id!=="string"){
YAHOO.log("id is not a string, assuming it is an HTMLElement");
id=_2.generateId(id);
}
delete this.invalidHandleIds[id];
},removeInvalidHandleClass:function(_35){
for(var i=0,len=this.invalidHandleClasses.length;i<len;++i){
if(this.invalidHandleClasses[i]==_35){
delete this.invalidHandleClasses[i];
}
}
},isValidHandleChild:function(_37){
var _38=true;
var _39;
try{
_39=_37.nodeName.toUpperCase();
}
catch(e){
_39=_37.nodeName;
}
_38=_38&&!this.invalidHandleTypes[_39];
_38=_38&&!this.invalidHandleIds[_37.id];
for(var i=0,len=this.invalidHandleClasses.length;_38&&i<len;++i){
_38=!_2.hasClass(_37,this.invalidHandleClasses[i]);
}
return _38;
},setXTicks:function(_40,_41){
this.xTicks=[];
this.xTickSize=_41;
var _42={};
for(var i=this.initPageX;i>=this.minX;i=i-_41){
if(!_42[i]){
this.xTicks[this.xTicks.length]=i;
_42[i]=true;
}
}
for(i=this.initPageX;i<=this.maxX;i=i+_41){
if(!_42[i]){
this.xTicks[this.xTicks.length]=i;
_42[i]=true;
}
}
this.xTicks.sort(this.DDM.numericSort);
},setYTicks:function(_43,_44){
this.yTicks=[];
this.yTickSize=_44;
var _45={};
for(var i=this.initPageY;i>=this.minY;i=i-_44){
if(!_45[i]){
this.yTicks[this.yTicks.length]=i;
_45[i]=true;
}
}
for(i=this.initPageY;i<=this.maxY;i=i+_44){
if(!_45[i]){
this.yTicks[this.yTicks.length]=i;
_45[i]=true;
}
}
this.yTicks.sort(this.DDM.numericSort);
},setXConstraint:function(_46,_47,_48){
this.leftConstraint=_46;
this.rightConstraint=_47;
this.minX=this.initPageX-_46;
this.maxX=this.initPageX+_47;
if(_48){
this.setXTicks(this.initPageX,_48);
}
this.constrainX=true;
},clearConstraints:function(){
this.constrainX=false;
this.constrainY=false;
this.clearTicks();
},clearTicks:function(){
this.xTicks=null;
this.yTicks=null;
this.xTickSize=0;
this.yTickSize=0;
},setYConstraint:function(iUp,_50,_51){
this.topConstraint=iUp;
this.bottomConstraint=_50;
this.minY=this.initPageY-iUp;
this.maxY=this.initPageY+_50;
if(_51){
this.setYTicks(this.initPageY,_51);
}
this.constrainY=true;
},resetConstraints:function(){
if(this.initPageX||this.initPageX===0){
var dx=(this.maintainOffset)?this.lastPageX-this.initPageX:0;
var dy=(this.maintainOffset)?this.lastPageY-this.initPageY:0;
this.setInitPosition(dx,dy);
}else{
this.setInitPosition();
}
if(this.constrainX){
this.setXConstraint(this.leftConstraint,this.rightConstraint,this.xTickSize);
}
if(this.constrainY){
this.setYConstraint(this.topConstraint,this.bottomConstraint,this.yTickSize);
}
},getTick:function(val,_53){
if(!_53){
return val;
}else{
if(_53[0]>=val){
return _53[0];
}else{
for(var i=0,len=_53.length;i<len;++i){
var _54=i+1;
if(_53[_54]&&_53[_54]>=val){
var _55=val-_53[i];
var _56=_53[_54]-val;
return (_56>_55)?_53[i]:_53[_54];
}
}
return _53[_53.length-1];
}
}
},toString:function(){
return ("DragDrop "+this.id);
}};
})();
if(!YAHOO.util.DragDropMgr){
YAHOO.util.DragDropMgr=function(){
var _57=YAHOO.util.Event;
return {ids:{},handleIds:{},dragCurrent:null,dragOvers:{},deltaX:0,deltaY:0,preventDefault:true,stopPropagation:true,initalized:false,locked:false,init:function(){
this.initialized=true;
},POINT:0,INTERSECT:1,mode:0,_execOnAll:function(_58,_59){
for(var i in this.ids){
for(var j in this.ids[i]){
var oDD=this.ids[i][j];
if(!this.isTypeOfDD(oDD)){
continue;
}
oDD[_58].apply(oDD,_59);
}
}
},_onLoad:function(){
this.init();
_57.on(document,"mouseup",this.handleMouseUp,this,true);
_57.on(document,"mousemove",this.handleMouseMove,this,true);
_57.on(window,"unload",this._onUnload,this,true);
_57.on(window,"resize",this._onResize,this,true);
},_onResize:function(e){
this._execOnAll("resetConstraints",[]);
},lock:function(){
this.locked=true;
},unlock:function(){
this.locked=false;
},isLocked:function(){
return this.locked;
},locationCache:{},useCache:true,clickPixelThresh:3,clickTimeThresh:1000,dragThreshMet:false,clickTimeout:null,startX:0,startY:0,regDragDrop:function(oDD,_61){
if(!this.initialized){
this.init();
}
if(!this.ids[_61]){
this.ids[_61]={};
}
this.ids[_61][oDD.id]=oDD;
},removeDDFromGroup:function(oDD,_62){
if(!this.ids[_62]){
this.ids[_62]={};
}
var obj=this.ids[_62];
if(obj&&obj[oDD.id]){
delete obj[oDD.id];
}
},_remove:function(oDD){
for(var g in oDD.groups){
if(g&&this.ids[g][oDD.id]){
delete this.ids[g][oDD.id];
}
}
delete this.handleIds[oDD.id];
},regHandle:function(_65,_66){
if(!this.handleIds[_65]){
this.handleIds[_65]={};
}
this.handleIds[_65][_66]=_66;
},isDragDrop:function(id){
return (this.getDDById(id))?true:false;
},getRelated:function(_67,_68){
var _69=[];
for(var i in _67.groups){
for(j in this.ids[i]){
var dd=this.ids[i][j];
if(!this.isTypeOfDD(dd)){
continue;
}
if(!_68||dd.isTarget){
_69[_69.length]=dd;
}
}
}
return _69;
},isLegalTarget:function(oDD,_71){
var _72=this.getRelated(oDD,true);
for(var i=0,len=_72.length;i<len;++i){
if(_72[i].id==_71.id){
return true;
}
}
return false;
},isTypeOfDD:function(oDD){
return (oDD&&oDD.__ygDragDrop);
},isHandle:function(_73,_74){
return (this.handleIds[_73]&&this.handleIds[_73][_74]);
},getDDById:function(id){
for(var i in this.ids){
if(this.ids[i][id]){
return this.ids[i][id];
}
}
return null;
},handleMouseDown:function(e,oDD){
this.currentTarget=YAHOO.util.Event.getTarget(e);
this.dragCurrent=oDD;
var el=oDD.getEl();
this.startX=YAHOO.util.Event.getPageX(e);
this.startY=YAHOO.util.Event.getPageY(e);
this.deltaX=this.startX-el.offsetLeft;
this.deltaY=this.startY-el.offsetTop;
this.dragThreshMet=false;
this.clickTimeout=setTimeout(function(){
var DDM=YAHOO.util.DDM;
DDM.startDrag(DDM.startX,DDM.startY);
},this.clickTimeThresh);
},startDrag:function(x,y){
clearTimeout(this.clickTimeout);
if(this.dragCurrent){
this.dragCurrent.b4StartDrag(x,y);
this.dragCurrent.startDrag(x,y);
}
this.dragThreshMet=true;
},handleMouseUp:function(e){
if(!this.dragCurrent){
return;
}
clearTimeout(this.clickTimeout);
if(this.dragThreshMet){
this.fireEvents(e,true);
}else{
}
this.stopDrag(e);
this.stopEvent(e);
},stopEvent:function(e){
if(this.stopPropagation){
YAHOO.util.Event.stopPropagation(e);
}
if(this.preventDefault){
YAHOO.util.Event.preventDefault(e);
}
},stopDrag:function(e){
if(this.dragCurrent){
if(this.dragThreshMet){
this.dragCurrent.b4EndDrag(e);
this.dragCurrent.endDrag(e);
}
this.dragCurrent.onMouseUp(e);
}
this.dragCurrent=null;
this.dragOvers={};
},handleMouseMove:function(e){
if(!this.dragCurrent){
return true;
}
if(YAHOO.util.Event.isIE&&!e.button){
this.stopEvent(e);
return this.handleMouseUp(e);
}
if(!this.dragThreshMet){
var _76=Math.abs(this.startX-YAHOO.util.Event.getPageX(e));
var _77=Math.abs(this.startY-YAHOO.util.Event.getPageY(e));
if(_76>this.clickPixelThresh||_77>this.clickPixelThresh){
this.startDrag(this.startX,this.startY);
}
}
if(this.dragThreshMet){
this.dragCurrent.b4Drag(e);
this.dragCurrent.onDrag(e);
this.fireEvents(e,false);
}
this.stopEvent(e);
return true;
},fireEvents:function(e,_78){
var dc=this.dragCurrent;
if(!dc||dc.isLocked()){
return;
}
var x=YAHOO.util.Event.getPageX(e);
var y=YAHOO.util.Event.getPageY(e);
var pt=new YAHOO.util.Point(x,y);
var _80=[];
var _81=[];
var _82=[];
var _83=[];
var _84=[];
for(var i in this.dragOvers){
var ddo=this.dragOvers[i];
if(!this.isTypeOfDD(ddo)){
continue;
}
if(!this.isOverTarget(pt,ddo,this.mode)){
_81.push(ddo);
}
_80[i]=true;
delete this.dragOvers[i];
}
for(var _86 in dc.groups){
if("string"!=typeof _86){
continue;
}
for(i in this.ids[_86]){
var oDD=this.ids[_86][i];
if(!this.isTypeOfDD(oDD)){
continue;
}
if(oDD.isTarget&&!oDD.isLocked()&&oDD!=dc){
if(this.isOverTarget(pt,oDD,this.mode)){
if(_78){
_83.push(oDD);
}else{
if(!_80[oDD.id]){
_84.push(oDD);
}else{
_82.push(oDD);
}
this.dragOvers[oDD.id]=oDD;
}
}
}
}
}
if(this.mode){
if(_81.length){
dc.b4DragOut(e,_81);
dc.onDragOut(e,_81);
}
if(_84.length){
dc.onDragEnter(e,_84);
}
if(_82.length){
dc.b4DragOver(e,_82);
dc.onDragOver(e,_82);
}
if(_83.length){
dc.b4DragDrop(e,_83);
dc.onDragDrop(e,_83);
}
}else{
var len=0;
for(i=0,len=_81.length;i<len;++i){
dc.b4DragOut(e,_81[i].id);
dc.onDragOut(e,_81[i].id);
}
for(i=0,len=_84.length;i<len;++i){
dc.onDragEnter(e,_84[i].id);
}
for(i=0,len=_82.length;i<len;++i){
dc.b4DragOver(e,_82[i].id);
dc.onDragOver(e,_82[i].id);
}
for(i=0,len=_83.length;i<len;++i){
dc.b4DragDrop(e,_83[i].id);
dc.onDragDrop(e,_83[i].id);
}
}
if(_78&&!_83.length){
dc.onInvalidDrop(e);
}
},getBestMatch:function(dds){
var _89=null;
var len=dds.length;
if(len==1){
_89=dds[0];
}else{
for(var i=0;i<len;++i){
var dd=dds[i];
if(dd.cursorIsOver){
_89=dd;
break;
}else{
if(!_89||_89.overlap.getArea()<dd.overlap.getArea()){
_89=dd;
}
}
}
}
return _89;
},refreshCache:function(_90){
for(var _91 in _90){
if("string"!=typeof _91){
continue;
}
for(var i in this.ids[_91]){
var oDD=this.ids[_91][i];
if(this.isTypeOfDD(oDD)){
var loc=this.getLocation(oDD);
if(loc){
this.locationCache[oDD.id]=loc;
}else{
delete this.locationCache[oDD.id];
}
}
}
}
},verifyEl:function(el){
try{
if(el){
var _93=el.offsetParent;
if(_93){
return true;
}
}
}
catch(e){
}
return false;
},getLocation:function(oDD){
if(!this.isTypeOfDD(oDD)){
return null;
}
var el=oDD.getEl(),pos,x1,x2,y1,y2,t,r,b,l;
try{
pos=YAHOO.util.Dom.getXY(el);
}
catch(e){
}
if(!pos){
return null;
}
x1=pos[0];
x2=x1+el.offsetWidth;
y1=pos[1];
y2=y1+el.offsetHeight;
t=y1-oDD.padding[0];
r=x2+oDD.padding[1];
b=y2+oDD.padding[2];
l=x1-oDD.padding[3];
return new YAHOO.util.Region(t,r,b,l);
},isOverTarget:function(pt,_94,_95){
var loc=this.locationCache[_94.id];
if(!loc||!this.useCache){
loc=this.getLocation(_94);
this.locationCache[_94.id]=loc;
}
if(!loc){
return false;
}
_94.cursorIsOver=loc.contains(pt);
var dc=this.dragCurrent;
if(!dc||!dc.getTargetCoord||(!_95&&!dc.constrainX&&!dc.constrainY)){
return _94.cursorIsOver;
}
_94.overlap=null;
var pos=dc.getTargetCoord(pt.x,pt.y);
var el=dc.getDragEl();
var _96=new YAHOO.util.Region(pos.y,pos.x+el.offsetWidth,pos.y+el.offsetHeight,pos.x);
var _97=_96.intersect(loc);
if(_97){
_94.overlap=_97;
return (_95)?true:_94.cursorIsOver;
}else{
return false;
}
},_onUnload:function(e,me){
this.unregAll();
},unregAll:function(){
if(this.dragCurrent){
this.stopDrag();
this.dragCurrent=null;
}
this._execOnAll("unreg",[]);
for(i in this.elementCache){
delete this.elementCache[i];
}
this.elementCache={};
this.ids={};
},elementCache:{},getElWrapper:function(id){
var _99=this.elementCache[id];
if(!_99||!_99.el){
_99=this.elementCache[id]=new this.ElementWrapper(YAHOO.util.Dom.get(id));
}
return _99;
},getElement:function(id){
return YAHOO.util.Dom.get(id);
},getCss:function(id){
var el=YAHOO.util.Dom.get(id);
return (el)?el.style:null;
},ElementWrapper:function(el){
this.el=el||null;
this.id=this.el&&el.id;
this.css=this.el&&el.style;
},getPosX:function(el){
return YAHOO.util.Dom.getX(el);
},getPosY:function(el){
return YAHOO.util.Dom.getY(el);
},swapNode:function(n1,n2){
if(n1.swapNode){
n1.swapNode(n2);
}else{
var p=n2.parentNode;
var s=n2.nextSibling;
if(s==n1){
p.insertBefore(n1,n2);
}else{
if(n2==n1.nextSibling){
p.insertBefore(n2,n1);
}else{
n1.parentNode.replaceChild(n2,n1);
p.insertBefore(n1,s);
}
}
}
},getScroll:function(){
var t,l,dde=document.documentElement,db=document.body;
if(dde&&(dde.scrollTop||dde.scrollLeft)){
t=dde.scrollTop;
l=dde.scrollLeft;
}else{
if(db){
t=db.scrollTop;
l=db.scrollLeft;
}else{
YAHOO.log("could not get scroll property");
}
}
return {top:t,left:l};
},getStyle:function(el,_104){
return YAHOO.util.Dom.getStyle(el,_104);
},getScrollTop:function(){
return this.getScroll().top;
},getScrollLeft:function(){
return this.getScroll().left;
},moveToEl:function(_105,_106){
var _107=YAHOO.util.Dom.getXY(_106);
YAHOO.util.Dom.setXY(_105,_107);
},getClientHeight:function(){
return YAHOO.util.Dom.getViewportHeight();
},getClientWidth:function(){
return YAHOO.util.Dom.getViewportWidth();
},numericSort:function(a,b){
return (a-b);
},_timeoutCount:0,_addListeners:function(){
var DDM=YAHOO.util.DDM;
if(YAHOO.util.Event&&document){
DDM._onLoad();
}else{
if(DDM._timeoutCount>2000){
}else{
setTimeout(DDM._addListeners,10);
if(document&&document.body){
DDM._timeoutCount+=1;
}
}
}
},handleWasClicked:function(node,id){
if(this.isHandle(id,node.id)){
return true;
}else{
var p=node.parentNode;
while(p){
if(this.isHandle(id,p.id)){
return true;
}else{
p=p.parentNode;
}
}
}
return false;
}};
}();
YAHOO.util.DDM=YAHOO.util.DragDropMgr;
YAHOO.util.DDM._addListeners();
}
YAHOO.util.DD=function(id,_111,_112){
if(id){
this.init(id,_111,_112);
}
};
YAHOO.extend(YAHOO.util.DD,YAHOO.util.DragDrop,{scroll:true,autoOffset:function(_113,_114){
var x=_113-this.startPageX;
var y=_114-this.startPageY;
this.setDelta(x,y);
},setDelta:function(_115,_116){
this.deltaX=_115;
this.deltaY=_116;
},setDragElPos:function(_117,_118){
var el=this.getDragEl();
this.alignElWithMouse(el,_117,_118);
},alignElWithMouse:function(el,_119,_120){
var _121=this.getTargetCoord(_119,_120);
if(!this.deltaSetXY){
var _122=[_121.x,_121.y];
YAHOO.util.Dom.setXY(el,_122);
var _123=parseInt(YAHOO.util.Dom.getStyle(el,"left"),10);
var _124=parseInt(YAHOO.util.Dom.getStyle(el,"top"),10);
this.deltaSetXY=[_123-_121.x,_124-_121.y];
}else{
YAHOO.util.Dom.setStyle(el,"left",(_121.x+this.deltaSetXY[0])+"px");
YAHOO.util.Dom.setStyle(el,"top",(_121.y+this.deltaSetXY[1])+"px");
}
this.cachePosition(_121.x,_121.y);
this.autoScroll(_121.x,_121.y,el.offsetHeight,el.offsetWidth);
},cachePosition:function(_125,_126){
if(_125){
this.lastPageX=_125;
this.lastPageY=_126;
}else{
var _127=YAHOO.util.Dom.getXY(this.getEl());
this.lastPageX=_127[0];
this.lastPageY=_127[1];
}
},autoScroll:function(x,y,h,w){
if(this.scroll){
var _130=this.DDM.getClientHeight();
var _131=this.DDM.getClientWidth();
var st=this.DDM.getScrollTop();
var sl=this.DDM.getScrollLeft();
var bot=h+y;
var _135=w+x;
var _136=(_130+st-y-this.deltaY);
var _137=(_131+sl-x-this.deltaX);
var _138=40;
var _139=(document.all)?80:30;
if(bot>_130&&_136<_138){
window.scrollTo(sl,st+_139);
}
if(y<st&&st>0&&y-st<_138){
window.scrollTo(sl,st-_139);
}
if(_135>_131&&_137<_138){
window.scrollTo(sl+_139,st);
}
if(x<sl&&sl>0&&x-sl<_138){
window.scrollTo(sl-_139,st);
}
}
},getTargetCoord:function(_140,_141){
var x=_140-this.deltaX;
var y=_141-this.deltaY;
if(this.constrainX){
if(x<this.minX){
x=this.minX;
}
if(x>this.maxX){
x=this.maxX;
}
}
if(this.constrainY){
if(y<this.minY){
y=this.minY;
}
if(y>this.maxY){
y=this.maxY;
}
}
x=this.getTick(x,this.xTicks);
y=this.getTick(y,this.yTicks);
return {x:x,y:y};
},applyConfig:function(){
YAHOO.util.DD.superclass.applyConfig.call(this);
this.scroll=(this.config.scroll!==false);
},b4MouseDown:function(e){
this.autoOffset(YAHOO.util.Event.getPageX(e),YAHOO.util.Event.getPageY(e));
},b4Drag:function(e){
this.setDragElPos(YAHOO.util.Event.getPageX(e),YAHOO.util.Event.getPageY(e));
},toString:function(){
return ("DD "+this.id);
}});
YAHOO.util.DDProxy=function(id,_142,_143){
if(id){
this.init(id,_142,_143);
this.initFrame();
}
};
YAHOO.util.DDProxy.dragElId="ygddfdiv";
YAHOO.extend(YAHOO.util.DDProxy,YAHOO.util.DD,{resizeFrame:true,centerFrame:false,createFrame:function(){
var self=this;
var body=document.body;
if(!body||!body.firstChild){
setTimeout(function(){
self.createFrame();
},50);
return;
}
var div=this.getDragEl();
if(!div){
div=document.createElement("div");
div.id=this.dragElId;
var s=div.style;
s.position="absolute";
s.visibility="hidden";
s.cursor="move";
s.border="2px solid #aaa";
s.zIndex=999;
body.insertBefore(div,body.firstChild);
}
},initFrame:function(){
this.createFrame();
},applyConfig:function(){
YAHOO.util.DDProxy.superclass.applyConfig.call(this);
this.resizeFrame=(this.config.resizeFrame!==false);
this.centerFrame=(this.config.centerFrame);
this.setDragElId(this.config.dragElId||YAHOO.util.DDProxy.dragElId);
},showFrame:function(_147,_148){
var el=this.getEl();
var _149=this.getDragEl();
var s=_149.style;
this._resizeProxy();
if(this.centerFrame){
this.setDelta(Math.round(parseInt(s.width,10)/2),Math.round(parseInt(s.height,10)/2));
}
this.setDragElPos(_147,_148);
YAHOO.util.Dom.setStyle(_149,"visibility","visible");
},_resizeProxy:function(){
if(this.resizeFrame){
var DOM=YAHOO.util.Dom;
var el=this.getEl();
var _151=this.getDragEl();
var bt=parseInt(DOM.getStyle(_151,"borderTopWidth"),10);
var br=parseInt(DOM.getStyle(_151,"borderRightWidth"),10);
var bb=parseInt(DOM.getStyle(_151,"borderBottomWidth"),10);
var bl=parseInt(DOM.getStyle(_151,"borderLeftWidth"),10);
if(isNaN(bt)){
bt=0;
}
if(isNaN(br)){
br=0;
}
if(isNaN(bb)){
bb=0;
}
if(isNaN(bl)){
bl=0;
}
var _156=Math.max(0,el.offsetWidth-br-bl);
var _157=Math.max(0,el.offsetHeight-bt-bb);
DOM.setStyle(_151,"width",_156+"px");
DOM.setStyle(_151,"height",_157+"px");
}
},b4MouseDown:function(e){
var x=YAHOO.util.Event.getPageX(e);
var y=YAHOO.util.Event.getPageY(e);
this.autoOffset(x,y);
this.setDragElPos(x,y);
},b4StartDrag:function(x,y){
this.showFrame(x,y);
},b4EndDrag:function(e){
YAHOO.util.Dom.setStyle(this.getDragEl(),"visibility","hidden");
},endDrag:function(e){
var DOM=YAHOO.util.Dom;
var lel=this.getEl();
var del=this.getDragEl();
DOM.setStyle(del,"visibility","");
DOM.setStyle(lel,"visibility","hidden");
YAHOO.util.DDM.moveToEl(lel,del);
DOM.setStyle(del,"visibility","hidden");
DOM.setStyle(lel,"visibility","");
},toString:function(){
return ("DDProxy "+this.id);
}});
YAHOO.util.DDTarget=function(id,_160,_161){
if(id){
this.initTarget(id,_160,_161);
}
};
YAHOO.extend(YAHOO.util.DDTarget,YAHOO.util.DragDrop,{toString:function(){
return ("DDTarget "+this.id);
}});
YAHOO.util.Connect={_msxml_progid:["MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],_http_header:{},_has_http_headers:false,_use_default_post_header:true,_default_post_header:"application/x-www-form-urlencoded",_isFormSubmit:false,_isFileUpload:false,_formNode:null,_sFormData:null,_poll:{},_timeOut:{},_polling_interval:50,_transaction_id:0,setProgId:function(id){
this._msxml_progid.unshift(id);
},setDefaultPostHeader:function(b){
this._use_default_post_header=b;
},setPollingInterval:function(i){
if(typeof i=="number"&&isFinite(i)){
this._polling_interval=i;
}
},createXhrObject:function(_388){
var obj,http;
try{
http=new XMLHttpRequest();
obj={conn:http,tId:_388};
}
catch(e){
for(var i=0;i<this._msxml_progid.length;++i){
try{
http=new ActiveXObject(this._msxml_progid[i]);
obj={conn:http,tId:_388};
break;
}
catch(e){
}
}
}
finally{
return obj;
}
},getConnectionObject:function(){
var o;
var tId=this._transaction_id;
try{
o=this.createXhrObject(tId);
if(o){
this._transaction_id++;
}
}
catch(e){
}
finally{
return o;
}
},asyncRequest:function(_38e,uri,_390,_391){
var o=this.getConnectionObject();
if(!o){
return null;
}else{
if(this._isFormSubmit){
if(this._isFileUpload){
this.uploadFile(o.tId,_390,uri,_391);
this.releaseObject(o);
return;
}
if(_38e=="GET"){
if(this._sFormData.length!=0){
uri+=((uri.indexOf("?")==-1)?"?":"&")+this._sFormData;
}else{
uri+="?"+this._sFormData;
}
}else{
if(_38e=="POST"){
_391=_391?this._sFormData+"&"+_391:this._sFormData;
}
}
}
o.conn.open(_38e,uri,true);
if(this._isFormSubmit||(_391&&this._use_default_post_header)){
this.initHeader("Content-Type",this._default_post_header);
if(this._isFormSubmit){
this.resetFormState();
}
}
if(this._has_http_headers){
this.setHeader(o);
}
this.handleReadyState(o,_390);
o.conn.send(_391||null);
return o;
}
},handleReadyState:function(o,_394){
var _395=this;
if(_394&&_394.timeout){
this._timeOut[o.tId]=window.setTimeout(function(){
_395.abort(o,_394,true);
},_394.timeout);
}
this._poll[o.tId]=window.setInterval(function(){
if(o.conn&&o.conn.readyState==4){
window.clearInterval(_395._poll[o.tId]);
delete _395._poll[o.tId];
if(_394&&_394.timeout){
delete _395._timeOut[o.tId];
}
_395.handleTransactionResponse(o,_394);
}
},this._polling_interval);
},handleTransactionResponse:function(o,_397,_398){
if(!_397){
this.releaseObject(o);
return;
}
var _399,_39a;
try{
if(o.conn.status!==undefined&&o.conn.status!=0){
_399=o.conn.status;
}else{
_399=13030;
}
}
catch(e){
_399=13030;
}
if(_399>=200&&_399<300){
try{
_39a=this.createResponseObject(o,_397.argument);
if(_397.success){
if(!_397.scope){
_397.success(_39a);
}else{
_397.success.apply(_397.scope,[_39a]);
}
}
}
catch(e){
}
}else{
try{
switch(_399){
case 12002:
case 12029:
case 12030:
case 12031:
case 12152:
case 13030:
_39a=this.createExceptionObject(o.tId,_397.argument,(_398?_398:false));
if(_397.failure){
if(!_397.scope){
_397.failure(_39a);
}else{
_397.failure.apply(_397.scope,[_39a]);
}
}
break;
default:
_39a=this.createResponseObject(o,_397.argument);
if(_397.failure){
if(!_397.scope){
_397.failure(_39a);
}else{
_397.failure.apply(_397.scope,[_39a]);
}
}
}
}
catch(e){
}
}
this.releaseObject(o);
_39a=null;
},createResponseObject:function(o,_39c){
var obj={};
var _39e={};
try{
var _39f=o.conn.getAllResponseHeaders();
var _3a0=_39f.split("\n");
for(var i=0;i<_3a0.length;i++){
var _3a2=_3a0[i].indexOf(":");
if(_3a2!=-1){
_39e[_3a0[i].substring(0,_3a2)]=_3a0[i].substring(_3a2+2);
}
}
}
catch(e){
}
obj.tId=o.tId;
obj.status=o.conn.status;
obj.statusText=o.conn.statusText;
obj.getResponseHeader=_39e;
obj.getAllResponseHeaders=_39f;
obj.responseText=o.conn.responseText;
obj.responseXML=o.conn.responseXML;
if(typeof _39c!==undefined){
obj.argument=_39c;
}
return obj;
},createExceptionObject:function(tId,_3a4,_3a5){
var _3a6=0;
var _3a7="communication failure";
var _3a8=-1;
var _3a9="transaction aborted";
var obj={};
obj.tId=tId;
if(_3a5){
obj.status=_3a8;
obj.statusText=_3a9;
}else{
obj.status=_3a6;
obj.statusText=_3a7;
}
if(_3a4){
obj.argument=_3a4;
}
return obj;
},initHeader:function(_3ab,_3ac){
if(this._http_header[_3ab]===undefined){
this._http_header[_3ab]=_3ac;
}else{
this._http_header[_3ab]=_3ac+","+this._http_header[_3ab];
}
this._has_http_headers=true;
},setHeader:function(o){
for(var prop in this._http_header){
if(this._http_header.hasOwnProperty(prop)){
o.conn.setRequestHeader(prop,this._http_header[prop]);
}
}
delete this._http_header;
this._http_header={};
this._has_http_headers=false;
},setForm:function(_3af,_3b0,_3b1){
this.resetFormState();
var _3b2;
if(typeof _3af=="string"){
_3b2=(document.getElementById(_3af)||document.forms[_3af]);
}else{
if(typeof _3af=="object"){
_3b2=_3af;
}else{
return;
}
}
if(_3b0){
this.createFrame(_3b1?_3b1:null);
this._isFormSubmit=true;
this._isFileUpload=true;
this._formNode=_3b2;
return;
}
var _3b3,_3b4,_3b5,_3b6;
var _3b7=false;
for(var i=0;i<_3b2.elements.length;i++){
_3b3=_3b2.elements[i];
_3b6=_3b2.elements[i].disabled;
_3b4=_3b2.elements[i].name;
_3b5=_3b2.elements[i].value;
if(!_3b6&&_3b4){
switch(_3b3.type){
case "select-one":
case "select-multiple":
for(var j=0;j<_3b3.options.length;j++){
if(_3b3.options[j].selected){
if(window.ActiveXObject){
this._sFormData+=encodeURIComponent(_3b4)+"="+encodeURIComponent(_3b3.options[j].attributes["value"].specified?_3b3.options[j].value:_3b3.options[j].text)+"&";
}else{
this._sFormData+=encodeURIComponent(_3b4)+"="+encodeURIComponent(_3b3.options[j].hasAttribute("value")?_3b3.options[j].value:_3b3.options[j].text)+"&";
}
}
}
break;
case "radio":
case "checkbox":
if(_3b3.checked){
this._sFormData+=encodeURIComponent(_3b4)+"="+encodeURIComponent(_3b5)+"&";
}
break;
case "file":
case undefined:
case "reset":
case "button":
break;
case "submit":
if(_3b7==false){
this._sFormData+=encodeURIComponent(_3b4)+"="+encodeURIComponent(_3b5)+"&";
_3b7=true;
}
break;
default:
this._sFormData+=encodeURIComponent(_3b4)+"="+encodeURIComponent(_3b5)+"&";
break;
}
}
}
this._isFormSubmit=true;
this._sFormData=this._sFormData.substr(0,this._sFormData.length-1);
return this._sFormData;
},resetFormState:function(){
this._isFormSubmit=false;
this._isFileUpload=false;
this._formNode=null;
this._sFormData="";
},createFrame:function(_3ba){
var _3bb="yuiIO"+this._transaction_id;
if(window.ActiveXObject){
var io=document.createElement("<iframe id=\""+_3bb+"\" name=\""+_3bb+"\" />");
if(typeof _3ba=="boolean"){
io.src="javascript:false";
}else{
if(typeof secureURI=="string"){
io.src=_3ba;
}
}
}else{
var io=document.createElement("iframe");
io.id=_3bb;
io.name=_3bb;
}
io.style.position="absolute";
io.style.top="-1000px";
io.style.left="-1000px";
document.body.appendChild(io);
},appendPostData:function(_3bd){
var _3be=new Array();
var _3bf=_3bd.split("&");
for(var i=0;i<_3bf.length;i++){
var _3c1=_3bf[i].indexOf("=");
if(_3c1!=-1){
_3be[i]=document.createElement("input");
_3be[i].type="hidden";
_3be[i].name=_3bf[i].substring(0,_3c1);
_3be[i].value=_3bf[i].substring(_3c1+1);
this._formNode.appendChild(_3be[i]);
}
}
return _3be;
},uploadFile:function(id,_3c3,uri,_3c5){
var _3c6="yuiIO"+id;
var io=document.getElementById(_3c6);
this._formNode.action=uri;
this._formNode.method="POST";
this._formNode.target=_3c6;
if(this._formNode.encoding){
this._formNode.encoding="multipart/form-data";
}else{
this._formNode.enctype="multipart/form-data";
}
if(_3c5){
var _3c8=this.appendPostData(_3c5);
}
this._formNode.submit();
if(_3c8&&_3c8.length>0){
try{
for(var i=0;i<_3c8.length;i++){
this._formNode.removeChild(_3c8[i]);
}
}
catch(e){
}
}
this.resetFormState();
var _3ca=function(){
var obj={};
obj.tId=id;
obj.argument=_3c3.argument;
try{
obj.responseText=io.contentWindow.document.body?io.contentWindow.document.body.innerHTML:null;
obj.responseXML=io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;
}
catch(e){
}
if(_3c3.upload){
if(!_3c3.scope){
_3c3.upload(obj);
}else{
_3c3.upload.apply(_3c3.scope,[obj]);
}
}
if(YAHOO.util.Event){
YAHOO.util.Event.removeListener(io,"load",_3ca);
}else{
if(window.detachEvent){
io.detachEvent("onload",_3ca);
}else{
io.removeEventListener("load",_3ca,false);
}
}
setTimeout(function(){
document.body.removeChild(io);
},100);
};
if(YAHOO.util.Event){
YAHOO.util.Event.addListener(io,"load",_3ca);
}else{
if(window.attachEvent){
io.attachEvent("onload",_3ca);
}else{
io.addEventListener("load",_3ca,false);
}
}
},abort:function(o,_3cd,_3ce){
if(this.isCallInProgress(o)){
o.conn.abort();
window.clearInterval(this._poll[o.tId]);
delete this._poll[o.tId];
if(_3ce){
delete this._timeOut[o.tId];
}
this.handleTransactionResponse(o,_3cd,true);
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

Array.prototype.contains=function(_1){
for(var i in this){
if(this[i]==_1){
return true;
}
}
return false;
};
Array.prototype.setLength=function(_3,_4){
_4=typeof _4!="undefined"?_4:null;
for(var i=0;i<_3;i++){
this[i]=_4;
}
return this;
};
Array.prototype.addDimension=function(_6,_7){
_7=typeof _7!="undefined"?_7:null;
var _8=this.length;
for(var i=0;i<_8;i++){
this[i]=[].setLength(_6,_7);
}
return this;
};
Array.prototype.first=function(){
return this[0];
};
Array.prototype.last=function(){
return this[this.length-1];
};
Array.prototype.copy=function(){
var _a=[];
var _b=this.length;
for(var i=0;i<_b;i++){
if(this[i] instanceof Array){
_a[i]=this[i].copy();
}else{
_a[i]=this[i];
}
}
return _a;
};
if(!Array.prototype.map){
Array.prototype.map=function(_d){
var _e=this.length;
if(typeof _d!="function"){
throw new TypeError();
}
var _f=new Array(_e);
var _10=arguments[1];
for(var i=0;i<_e;i++){
if(i in this){
_f[i]=_d.call(_10,this[i],i,this);
}
}
return _f;
};
}
if(!Array.prototype.filter){
Array.prototype.filter=function(fun){
var len=this.length;
if(typeof fun!="function"){
throw new TypeError();
}
var res=new Array();
var _15=arguments[1];
for(var i=0;i<len;i++){
if(i in this){
var val=this[i];
if(fun.call(_15,val,i,this)){
res.push(val);
}
}
}
return res;
};
}
if(!Array.prototype.forEach){
Array.prototype.forEach=function(fun){
var len=this.length;
if(typeof fun!="function"){
throw new TypeError();
}
var _1a=arguments[1];
for(var i=0;i<len;i++){
if(i in this){
fun.call(_1a,this[i],i,this);
}
}
};
}
if(!Array.prototype.every){
Array.prototype.every=function(fun){
var len=this.length;
if(typeof fun!="function"){
throw new TypeError();
}
var _1e=arguments[1];
for(var i=0;i<len;i++){
if(i in this&&!fun.call(_1e,this[i],i,this)){
return false;
}
}
return true;
};
}
if(!Array.prototype.some){
Array.prototype.some=function(fun){
var len=this.length;
if(typeof fun!="function"){
throw new TypeError();
}
var _22=arguments[1];
for(var i=0;i<len;i++){
if(i in this&&fun.call(_22,this[i],i,this)){
return true;
}
}
return false;
};
}
Array.from=function(it){
var arr=[];
for(var i=0;i<it.length;i++){
arr[i]=it[i];
}
return arr;
};
Function.prototype.bind=function(_27){
var _28=this;
var _29=Array.from(arguments).slice(1);
return function(){
return _28.apply(_27,_29.concat(Array.from(arguments)));
};
};

var eidogo=eidogo||{};

eidogo.util={byId:function(id){
return YAHOO.util.Dom.get(id);
},ajax:function(_2,_3,_4,_5,_6,_7,_8){
var _9=[];
for(var _a in _4){
_9.push(_a+"="+encodeURIComponent(_4[_a]));
}
_4=_9.join("&");
if(_2.toUpperCase()=="GET"){
_3=_3+"?"+_4;
_4=null;
}
YAHOO.util.Connect.asyncRequest(_2.toUpperCase(),_3,{success:_5,failure:_6,scope:_7,timeout:_8},_4);
},addEvent:function(el,_c,_d,_e,_f){
if(_f){
_d=_d.bind(_e);
}else{
if(_e){
var _10=_d;
_d=function(e){
_10(e,_e);
};
}
}
YAHOO.util.Event.on(el,_c,_d);
},onClick:function(el,_13,_14){
eidogo.util.addEvent(el,"click",_13,_14,true);
},getElClickXY:function(e,el){
if(!e.pageX){
e.pageX=e.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft);
e.pageY=e.clientY+(document.documentElement.scrollTop||document.body.scrollTop);
}
var elX=eidogo.util.getElX(el);
var elY=eidogo.util.getElY(el);
return [e.pageX-elX,e.pageY-elY];
},stopEvent:YAHOO.util.Event.stopEvent.bind(YAHOO.util.Event),addClass:YAHOO.util.Dom.addClass,removeClass:YAHOO.util.Dom.removeClass,hasClass:YAHOO.util.Dom.hasClass,getElX:YAHOO.util.Dom.getX,getElY:YAHOO.util.Dom.getY};

if(typeof eidogo.i18n=="undefined"){
eidogo.i18n={"move":"Move","loading":"Loading","passed":"passed","variations":"Variations","no variations":"none","tool":"Tool","play":"Play","region":"Select Region","add_b":"Black Stone","add_w":"White Stone","triangle":"Triangle","square":"Square","circle":"Circle","x":"X","letter":"Letter","number":"Number","search":"Search","search corner":"Corner Search","search center":"Center Search","region info":"Click and drag to select a region. If your browser            does not support dragging (e.g., iPhone), click once to begin the selection            and click once to end it.","white":"White","white rank":"White rank","white team":"White team","black":"Black","black rank":"Black rank","black team":"Black team","captures":"captures","time left":"time left","you":"You","game":"Game","handicap":"Handicap","komi":"Komi","result":"Result","date":"Date","info":"Info","place":"Place","event":"Event","round":"Round","overtime":"Overtime","opening":"Openning","ruleset":"Ruleset","annotator":"Annotator","copyright":"Copyright","source":"Source","time limit":"Time limit","transcriber":"Transcriber","created with":"Created with","january":"January","february":"February","march":"March","april":"April","may":"May","june":"June","july":"July","august":"August","september":"September","october":"October","november":"November","december":"December","gw":"Good for White","vgw":"Very good for White","gb":"Good for Black","vgb":"Very good for Black","dm":"Even position","dmj":"Even position (joseki)","uc":"Unclear position","te":"Tesuji","bm":"Bad move","vbm":"Very bad move","do":"Doubtful move","it":"Interesting move","black to play":"Black to play","white to play":"White to play","ho":"Hotspot","dom error":"Error finding DOM container","error retrieving":"There was a problem retrieving the game data.","invalid data":"Received invalid game data","error board":"Error loading board container","gnugo thinking":"GNU Go is thinking..."};
}

eidogo.gameTreeIdCounter=15000;
eidogo.gameNodeIdCounter=15000;
eidogo.GameNode=function(_1){
this.init(_1);
};
eidogo.GameNode.prototype={reserved:["parent","nextSibling","previousSibling"],init:function(_2){
_2=_2||{};
this.id=eidogo.gameNodeIdCounter++;
this.parent=null;
this.nextSibling=null;
this.previousSibling=null;
this.loadJson(_2);
},setProperty:function(_3,_4){
if(!this.reserved.contains(_3)){
this[_3]=_4;
}
},pushProperty:function(_5,_6){
if(this.reserved.contains(_5)){
return;
}
if(this[_5]){
if(!(this[_5] instanceof Array)){
this[_5]=[this[_5]];
}
if(!this[_5].contains(_6)){
this[_5].push(_6);
}
}else{
this[_5]=_6;
}
},loadJson:function(_7){
for(var _8 in _7){
this.setProperty(_8,_7[_8]);
}
},getProperties:function(){
var _9={};
for(var _a in this){
if(_a!="reserved"&&(typeof this[_a]=="string"||this[_a] instanceof Array)){
_9[_a]=this[_a];
}
}
return _9;
},getMove:function(){
if(typeof this.W!="undefined"){
return this.W;
}else{
if(typeof this.B!="undefined"){
return this.B;
}
}
return null;
},emptyPoint:function(_b){
var _c=this.getProperties();
for(var _d in _c){
if(_d=="AW"||_d=="AB"||_d=="AE"){
if(!(this[_d] instanceof Array)){
this[_d]=[this[_d]];
}
this[_d]=this[_d].filter(function(v){
return v!=_b;
});
if(!this[_d].length){
delete this[_d];
}
}else{
if((_d=="B"||_d=="W")&&this[_d]==_b){
delete this[_d];
}
}
}
},getPosition:function(){
for(var i=0;i<this.parent.nodes.length;i++){
if(this.parent.nodes[i].id==this.id){
return i;
}
}
return null;
}};
eidogo.GameTree=function(_10){
this.init(_10);
};
eidogo.GameTree.prototype={init:function(_11){
this.id=eidogo.gameTreeIdCounter++;
this.nodes=[];
this.trees=[];
this.parent=null;
this.preferredTree=0;
if(typeof _11!="undefined"){
this.loadJson(_11);
}
if(!this.nodes.length){
this.appendNode(new eidogo.GameNode());
}
},appendNode:function(_12){
_12.parent=this;
if(this.nodes.length){
_12.previousSibling=this.nodes.last();
_12.previousSibling.nextSibling=_12;
}
this.nodes.push(_12);
},appendTree:function(_13){
_13.parent=this;
this.trees.push(_13);
},createVariationTree:function(_14){
var _15=this.nodes[_14];
var _16=[];
var len=_15.parent.nodes.length;
var i;
for(i=0;i<len;i++){
var n=_15.parent.nodes[i];
_16.push(n);
if(n.id==_15.id){
n.nextSibling=null;
break;
}
}
var _1a=new eidogo.GameTree();
i++;
_15.parent.nodes[i].previousSibling=null;
var _1b=[];
for(;i<len;i++){
var n=_15.parent.nodes[i];
n.parent=_1a;
_1b.push(n);
}
_1a.nodes=_1b;
_1a.trees=_15.parent.trees;
_15.parent.nodes=_16;
_15.parent.trees=[];
_15.parent.appendTree(_1a);
},loadJson:function(_1c){
for(var i=0;i<_1c.nodes.length;i++){
this.appendNode(new eidogo.GameNode(_1c.nodes[i]));
}
for(var i=0;i<_1c.trees.length;i++){
this.appendTree(new eidogo.GameTree(_1c.trees[i]));
}
if(_1c.id){
this.id=_1c.id;
eidogo.gameTreeIdCounter=Math.max(this.id,eidogo.gameTreeIdCounter);
}
},getPosition:function(){
if(!this.parent){
return null;
}
for(var i=0;i<this.parent.trees.length;i++){
if(this.parent.trees[i].id==this.id){
return i;
}
}
return null;
},toSgf:function(){
function treeToSgf(_1f){
var sgf="(";
for(var i=0;i<_1f.nodes.length;i++){
sgf+=nodeToSgf(_1f.nodes[i]);
}
for(var i=0;i<_1f.trees.length;i++){
sgf+=treeToSgf(_1f.trees[i]);
}
return sgf+")";
}
function nodeToSgf(_22){
var sgf=";";
var _24=_22.getProperties();
for(var key in _24){
var val;
if(_24[key] instanceof Array){
val=_24[key].map(function(val){
return val.replace(/\]/,"\\]");
}).join("][");
}else{
val=_24[key].replace(/\]/,"\\]");
}
sgf+=key+"["+val+"]";
}
return sgf;
}
return treeToSgf(this);
}};
eidogo.GameCursor=function(_28){
this.init(_28);
};
eidogo.GameCursor.prototype={init:function(_29){
this.node=_29;
},nextNode:function(){
if(this.node.nextSibling!=null){
this.node=this.node.nextSibling;
return true;
}else{
return false;
}
},next:function(_2a){
if(!this.hasNext()){
return false;
}
if((typeof _2a=="undefined"||_2a==null)&&this.node.nextSibling!=null){
this.node=this.node.nextSibling;
}else{
if(this.node.parent.trees.length){
if(typeof _2a=="undefined"||_2a==null){
_2a=this.node.parent.preferredTree;
}else{
this.node.parent.preferredTree=_2a;
}
this.node=this.node.parent.trees[_2a].nodes.first();
}
}
return true;
},previous:function(){
if(!this.hasPrevious()){
return false;
}
if(this.node.previousSibling!=null){
this.node=this.node.previousSibling;
}else{
this.node=this.node.parent.parent.nodes.last();
}
return true;
},hasNext:function(){
return this.node&&(this.node.nextSibling!=null||(this.node.parent&&this.node.parent.trees.length));
},hasPrevious:function(){
return this.node&&((this.node.parent.parent&&this.node.parent.parent.nodes.length&&this.node.parent.parent.parent)||(this.node.previousSibling!=null));
},getPath:function(){
var _2b=[];
var _2c=new eidogo.GameCursor(this.node);
var _2d=prevId=_2c.node.parent.id;
_2b.push(_2c.node.getPosition());
_2b.push(_2c.node.parent.getPosition());
while(_2c.previous()){
_2d=_2c.node.parent.id;
if(prevId!=_2d){
_2b.push(_2c.node.parent.getPosition());
prevId=_2d;
}
}
return _2b.reverse();
}};

eidogo.SgfParser=function(_1){
this.init(_1);
};
eidogo.SgfParser.prototype={init:function(_2){
this.sgf=_2;
this.index=0;
this.tree=this.parseTree(null);
},parseTree:function(_3){
var _4={};
_4.nodes=[];
_4.trees=[];
while(this.index<this.sgf.length){
var c=this.sgf.charAt(this.index);
this.index++;
switch(c){
case ";":
_4.nodes.push(this.parseNode());
break;
case "(":
_4.trees.push(this.parseTree(_4));
break;
case ")":
return _4;
break;
}
}
return _4;
},getChar:function(){
return this.sgf.charAt(this.index);
},nextChar:function(){
this.index++;
},parseNode:function(){
var _6={};
var _7="";
var _8=[];
var i=0;
while(this.index<this.sgf.length){
var c=this.getChar();
if(c==";"||c=="("||c==")"){
break;
}
if(this.getChar()=="["){
while(this.getChar()=="["){
this.nextChar();
_8[i]="";
while(this.getChar()!="]"&&this.index<this.sgf.length){
if(this.getChar()=="\\"){
this.nextChar();
while(this.getChar()=="\r"||this.getChar()=="\n"){
this.nextChar();
}
}
_8[i]+=this.getChar();
this.nextChar();
}
i++;
while(this.getChar()=="]"||this.getChar()=="\n"||this.getChar()=="\r"){
this.nextChar();
}
}
_6[_7]=_8.length>1?_8:_8[0];
_7="";
_8=[];
i=0;
continue;
}
if(c!=" "&&c!="\n"&&c!="\r"&&c!="\t"){
_7+=c;
}
this.nextChar();
}
return _6;
}};

eidogo.Board=function(_1,_2){
this.init(_1,_2);
};
eidogo.Board.prototype={WHITE:1,BLACK:-1,EMPTY:0,init:function(_3,_4){
this.boardSize=_4||19;
this.stones=this.makeBoardArray(this.EMPTY);
this.markers=this.makeBoardArray(this.EMPTY);
this.captures={};
this.captures.W=0;
this.captures.B=0;
this.cache=[];
this.renderer=_3||new eidogo.BoardRendererHtml();
this.lastRender={stones:this.makeBoardArray(null),markers:this.makeBoardArray(null)};
},reset:function(){
this.init(this.renderer,this.boardSize);
},clear:function(){
this.clearStones();
this.clearMarkers();
this.clearCaptures();
},clearStones:function(){
for(var i=0;i<this.stones.length;i++){
this.stones[i]=this.EMPTY;
}
},clearMarkers:function(){
for(var i=0;i<this.markers.length;i++){
this.markers[i]=this.EMPTY;
}
},clearCaptures:function(){
this.captures.W=0;
this.captures.B=0;
},makeBoardArray:function(_7){
return [].setLength(this.boardSize*this.boardSize,_7);
},commit:function(){
this.cache.push({stones:this.stones.concat(),captures:{W:this.captures.W,B:this.captures.B}});
},rollback:function(){
if(this.cache.last()){
this.stones=this.cache.last().stones.concat();
this.captures.W=this.cache.last().captures.W;
this.captures.B=this.cache.last().captures.B;
}else{
this.clear();
}
},revert:function(_8){
_8=_8||1;
this.rollback();
for(var i=0;i<_8;i++){
this.cache.pop();
}
this.rollback();
},addStone:function(pt,_b){
this.stones[pt.y*this.boardSize+pt.x]=_b;
},getStone:function(pt){
return this.stones[pt.y*this.boardSize+pt.x];
},getRegion:function(t,l,w,h){
var _11=[].setLength(w*h,this.EMPTY);
var _12;
for(var y=t;y<t+h;y++){
for(var x=l;x<l+w;x++){
_12=(y-t)*w+(x-l);
_11[_12]=this.getStone({x:x,y:y});
}
}
return _11;
},addMarker:function(pt,_16){
this.markers[pt.y*this.boardSize+pt.x]=_16;
},getMarker:function(pt){
return this.markers[pt.y*this.boardSize+pt.x];
},render:function(_18){
var _19=this.makeBoardArray(null);
var _1a=this.makeBoardArray(null);
var _1b,_1c;
if(!_18&&this.cache.last()){
for(var i=0;i<this.stones.length;i++){
if(this.cache.last().stones[i]!=this.lastRender.stones[i]){
_19[i]=this.cache.last().stones[i];
}
}
_1a=this.markers;
}else{
_19=this.stones;
_1a=this.markers;
}
for(var x=0;x<this.boardSize;x++){
for(var y=0;y<this.boardSize;y++){
var _20=y*this.boardSize+x;
if(_19[_20]==null){
continue;
}else{
if(_19[_20]==this.EMPTY){
_1b="empty";
}else{
_1b=(_19[_20]==this.WHITE?"white":"black");
}
}
this.renderer.renderStone({x:x,y:y},_1b);
this.lastRender.stones[_20]=_19[_20];
}
}
for(var x=0;x<this.boardSize;x++){
for(var y=0;y<this.boardSize;y++){
var _20=y*this.boardSize+x;
if(_1a[_20]==null){
continue;
}
this.renderer.renderMarker({x:x,y:y},_1a[_20]);
this.lastRender.markers[_20]=_1a[_20];
}
}
}};
eidogo.BoardRendererHtml=function(_21,_22){
this.init(_21,_22);
};
eidogo.BoardRendererHtml.prototype={init:function(_23,_24){
if(!_23){
throw "No DOM container";
return;
}
this.boardSize=_24||19;
var _25=document.createElement("div");
_25.className="board size"+this.boardSize;
_23.appendChild(_25);
this.domNode=_25;
this.renderCache={stones:[].setLength(this.boardSize,0).addDimension(this.boardSize,0),markers:[].setLength(this.boardSize,0).addDimension(this.boardSize,0)};
this.pointWidth=0;
this.pointHeight=0;
this.margin=0;
var _26=this.renderStone({x:0,y:0},"black");
this.pointWidth=this.pointHeight=_26.offsetWidth;
this.clear();
this.margin=(this.domNode.offsetWidth-(this.boardSize*this.pointWidth))/2;
},clear:function(){
this.domNode.innerHTML="";
},renderStone:function(pt,_28){
var _29=document.getElementById("stone-"+pt.x+"-"+pt.y);
if(_29){
_29.parentNode.removeChild(_29);
}
if(_28!="empty"){
var div=document.createElement("div");
div.id="stone-"+pt.x+"-"+pt.y;
div.className="point stone "+_28;
div.style.left=(pt.x*this.pointWidth+this.margin)+"px";
div.style.top=(pt.y*this.pointHeight+this.margin)+"px";
this.domNode.appendChild(div);
return div;
}
},renderMarker:function(pt,_2c){
if(this.renderCache.markers[pt.x][pt.y]){
var _2d=document.getElementById("marker-"+pt.x+"-"+pt.y);
if(_2d){
_2d.parentNode.removeChild(_2d);
}
}
if(_2c=="empty"||!_2c){
this.renderCache.markers[pt.x][pt.y]=0;
return;
}
this.renderCache.markers[pt.x][pt.y]=1;
if(_2c){
var _2e="";
switch(_2c){
case "triangle":
case "square":
case "circle":
case "ex":
case "territory-white":
case "territory-black":
case "current":
break;
default:
if(_2c.indexOf("var:")==0){
_2e=_2c.substring(4);
_2c="variation";
}else{
_2e=_2c;
_2c="label";
}
break;
}
var div=document.createElement("div");
div.id="marker-"+pt.x+"-"+pt.y;
div.className="point marker "+_2c;
div.style.left=(pt.x*this.pointWidth+this.margin)+"px";
div.style.top=(pt.y*this.pointHeight+this.margin)+"px";
div.appendChild(document.createTextNode(_2e));
this.domNode.appendChild(div);
return div;
}
}};
eidogo.BoardRendererAscii=function(_30,_31){
this.init(_30,_31);
};
eidogo.BoardRendererAscii.prototype={pointWidth:2,pointHeight:1,margin:1,blankBoard:"+-------------------------------------+\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"+-------------------------------------+",init:function(_32,_33){
this.domNode=_32||null;
this.boardSize=_33||19;
this.content=this.blankBoard;
},clear:function(){
this.content=this.blankBoard;
this.domNode.innerHTML="<pre>"+this.content+"</pre>";
},renderStone:function(pt,_35){
var _36=(this.pointWidth*this.boardSize+this.margin*2)*(pt.y*this.pointHeight+1)+(pt.x*this.pointWidth)+2;
this.content=this.content.substring(0,_36-1)+"."+this.content.substring(_36);
if(_35!="empty"){
this.content=this.content.substring(0,_36-1)+(_35=="white"?"O":"#")+this.content.substring(_36);
}
this.domNode.innerHTML="<pre>"+this.content+"</pre>";
},renderMarker:function(pt,_38){
}};

eidogo.Rules=function(_1){
this.init(_1);
};
eidogo.Rules.prototype={init:function(_2){
this.board=_2;
this.pendingCaptures=[];
},check:function(pt,_4){
if(this.board.getStone(pt)!=this.board.EMPTY){
return false;
}
return true;
},apply:function(pt,_6){
var _7=this.doCaptures(pt,_6);
if(_7<0){
_6=-_6;
_7=-_7;
}
_6=_6==this.board.WHITE?"W":"B";
this.board.captures[_6]+=_7;
},doCaptures:function(pt,_9){
var _a=0;
_a+=this.doCapture({x:pt.x-1,y:pt.y},_9);
_a+=this.doCapture({x:pt.x+1,y:pt.y},_9);
_a+=this.doCapture({x:pt.x,y:pt.y-1},_9);
_a+=this.doCapture({x:pt.x,y:pt.y+1},_9);
_a-=this.doCapture(pt,-_9);
return _a;
},doCapture:function(pt,_c){
var x,y;
var _f=this.board.boardSize;
if(pt.x<0||pt.y<0||pt.x>=_f||pt.y>=_f){
return 0;
}
if(this.board.getStone(pt)==_c){
return 0;
}
this.pendingCaptures=[];
if(this.doCaptureRecurse(pt,_c)){
return 0;
}
var _10=this.pendingCaptures.length;
while(this.pendingCaptures.length){
this.board.addStone(this.pendingCaptures.pop(),this.board.EMPTY);
}
return _10;
},doCaptureRecurse:function(pt,_12){
if(pt.x<0||pt.y<0||pt.x>=this.board.boardSize||pt.y>=this.board.boardSize){
return 0;
}
if(this.board.getStone(pt)==_12){
return 0;
}
if(this.board.getStone(pt)==this.board.EMPTY){
return 1;
}
for(var i=0;i<this.pendingCaptures.length;i++){
if(this.pendingCaptures[i].x==pt.x&&this.pendingCaptures[i].y==pt.y){
return 0;
}
}
this.pendingCaptures.push(pt);
if(this.doCaptureRecurse({x:pt.x-1,y:pt.y},_12)){
return 1;
}
if(this.doCaptureRecurse({x:pt.x+1,y:pt.y},_12)){
return 1;
}
if(this.doCaptureRecurse({x:pt.x,y:pt.y-1},_12)){
return 1;
}
if(this.doCaptureRecurse({x:pt.x,y:pt.y+1},_12)){
return 1;
}
return 0;
}};

(function(){
var t=eidogo.i18n;
var _2=eidogo.util.byId;
var _3=eidogo.util.ajax;
var _4=eidogo.util.addEvent;
var _5=eidogo.util.onClick;
var _6=eidogo.util.getElClickXY;
var _7=eidogo.util.stopEvent;
var _8=eidogo.util.addClass;
var _9=eidogo.util.removeClass;
var _a=eidogo.util.getElX;
var _b=eidogo.util.getElY;
eidogo.Player=function(_c){
this.init(_c);
};
eidogo.Player.prototype={infoLabels:{GN:t["game"],PW:t["white"],WR:t["white rank"],WT:t["white team"],PB:t["black"],BR:t["black rank"],BT:t["black team"],HA:t["handicap"],KM:t["komi"],RE:t["result"],DT:t["date"],GC:t["info"],PC:t["place"],EV:t["event"],RO:t["round"],OT:t["overtime"],ON:t["opening"],RU:t["ruleset"],AN:t["annotator"],CP:t["copyright"],SO:t["source"],TM:t["time limit"],US:t["transcriber"],AP:t["created with"]},months:[t["january"],t["february"],t["march"],t["april"],t["may"],t["june"],t["july"],t["august"],t["september"],t["october"],t["november"],t["december"]],init:function(_d){
_d=_d||{};
this.mode=_d.mode?_d.mode:"play";
this.dom={};
this.dom.container=_2(_d.domId);
if(!this.dom.container){
alert(t["dom error"]);
return;
}
this.uniq=(new Date()).getTime();
this.gameTree=new eidogo.GameTree();
this.cursor=new eidogo.GameCursor();
this.progressiveLoad=_d.progressiveLoad?true:false;
this.progressiveLoads=null;
this.progressiveUrl=null;
this.searchUrl=_d.searchUrl;
this.board=null;
this.rules=null;
this.currentColor=null;
this.moveNumber=null;
this.totalMoves=null;
this.variations=null;
this.timeB="";
this.timeW="";
this.regionTop=null;
this.regionLeft=null;
this.regionWidth=null;
this.regionHeight=null;
this.regionBegun=null;
this.regionClickSelect=null;
this.mouseDown=null;
this.mouseDownX=null;
this.mouseDownY=null;
this.labelLastLetter=null;
this.labelLastNumber=null;
this.resetLastLabels();
this.prefs={};
this.prefs.markCurrent=typeof _d.markCurrent!="undefined"?_d.markCurrent:true;
this.prefs.markNext=typeof _d.markNext!="undefined"?_d.markNext:false;
this.prefs.markVariations=typeof _d.markVariations!="undefined"?_d.markVariations:true;
this.prefs.showGameInfo=typeof _d.showGameInfo!="undefined"?_d.showGameInfo:true;
this.prefs.showPlayerInfo=typeof _d.showPlayerInfo!="undefined"?_d.showPlayerInfo:true;
this.propertyHandlers={W:this.playMove,B:this.playMove,KO:this.playMove,MN:this.setMoveNumber,AW:this.addStone,AB:this.addStone,AE:this.addStone,CR:this.addMarker,LB:this.addMarker,TR:this.addMarker,MA:this.addMarker,SQ:this.addMarker,TW:this.addMarker,TB:this.addMarker,PL:this.setColor,C:this.showComments,N:this.showAnnotation,GB:this.showAnnotation,GW:this.showAnnotation,DM:this.showAnnotation,HO:this.showAnnotation,UC:this.showAnnotation,V:this.showAnnotation,BM:this.showAnnotation,DO:this.showAnnotation,IT:this.showAnnotation,TE:this.showAnnotation,BL:this.showTime,OB:this.showTime,WL:this.showTime,OW:this.showTime};
this.constructDom();
this.nowLoading();
this.loadPath=_d.loadPath&&_d.loadPath.length>1?_d.loadPath:[0,0];
this.sgfPath=_d.sgfPath;
this.gameName=_d.gameName;
if(typeof _d.sgf=="string"){
var _e=new eidogo.SgfParser(_d.sgf);
this.load(_e.tree);
}else{
if(typeof _d.sgf=="object"){
this.load(_d.sgf);
}else{
if(typeof _d.sgfUrl=="string"||this.gameName){
if(!_d.sgfUrl){
_d.sgfUrl=this.sgfPath+this.gameName+".sgf";
}
this.remoteLoad(_d.sgfUrl,null,false);
if(_d.progressiveLoad){
this.progressiveLoads=0;
this.progressiveUrl=_d.progressiveUrl||_d.sgfUrl.replace(/\?.+$/,"");
}
}else{
var _f=_d.boardSize||"19";
var _10={nodes:[],trees:[{nodes:[{SZ:_f}],trees:[]}]};
if(_d.opponentUrl){
this.opponentUrl=_d.opponentUrl;
this.opponentColor=_d.opponentColor=="B"?_d.opponentColor:"W";
var _11=_10.trees.first().nodes.first();
_11.PW=t["you"];
_11.PB="GNU Go";
}
this.load(_10);
}
}
}
},initGame:function(_12){
var _13=_12.trees.first().nodes.first().SZ;
if(!this.board){
this.createBoard(_13||19);
}
this.reset(true);
this.totalMoves=0;
var _14=new eidogo.GameCursor(this.cursor.node);
while(_14.next()){
this.totalMoves++;
}
this.totalMoves--;
this.showInfo();
if(this.prefs.showPlayerInfo){
this.dom.infoPlayers.style.display="block";
}
this.enableNavSlider();
this.selectTool("play");
},createBoard:function(_15){
_15=_15||19;
try{
var _16=new eidogo.BoardRendererHtml(this.dom.boardContainer,_15);
this.board=new eidogo.Board(_16,_15);
}
catch(e){
if(e=="No DOM container"){
this.croak(t["error board"]);
return;
}
}
if(_15!=19){
_9(this.dom.boardContainer,"with-coords");
}
this.board.renderer.domNode.appendChild(this.dom.searchRegion);
this.rules=new eidogo.Rules(this.board);
var _17=this.board.renderer.domNode;
_4(_17,"mousemove",this.handleBoardHover,this,true);
_4(_17,"mousedown",this.handleBoardMouseDown,this,true);
_4(_17,"mouseup",this.handleBoardMouseUp,this,true);
_4(document,"keydown",this.handleKeypress,this,true);
},load:function(_18,_19){
if(!_19){
_19=new eidogo.GameTree();
this.gameTree=_19;
}
_19.loadJson(_18);
_19.cached=true;
this.doneLoading();
if(!_19.parent){
this.initGame(_19);
}else{
this.progressiveLoads--;
}
if(this.loadPath.length){
this.goTo(this.loadPath,false);
if(!this.progressiveLoad){
this.loadPath=[0,0];
}
}else{
this.refresh();
}
},remoteLoad:function(url,_1b,_1c,_1d){
_1c=_1c=="undefined"?true:_1c;
if(_1c){
url=this.sgfPath+url+".sgf";
}
var _1e=function(req){
var _20=req.responseText;
var _21=_20.charAt(0);
var i=1;
while(i<_20.length&&(_21==" "||_21=="\r"||_21=="\n")){
_21=_20.charAt(i++);
}
if(_21=="("){
var sgf=new eidogo.SgfParser(_20);
this.load(sgf.tree,_1b);
}else{
if(_21=="{"){
_20=eval("("+_20+")");
this.load(_20,_1b);
}else{
this.croak(t["invalid data"]);
}
}
};
var _24=function(req){
this.croak(t["error retrieving"]+req.statusText);
};
_3("get",url,null,_1e,_24,this,10000);
},fetchOpponentMove:function(){
this.nowLoading(t["gnugo thinking"]);
var _26=function(req){
this.doneLoading();
this.createMove(req.responseText);
};
var _28=function(req){
this.croak(t["error retrieving"]+o.statusText);
};
var _2a={sgf:this.gameTree.trees[0].toSgf(),move:this.currentColor,size:this.gameTree.trees.first().nodes.first().SZ};
_3("post",this.opponentUrl,_2a,_26,_28,this,45000);
},goTo:function(_2b,_2c){
_2c=typeof _2c!="undefined"?_2c:true;
if(_2b instanceof Array){
if(!_2b.length){
return;
}
if(_2c){
this.reset(true);
}
while(_2b.length){
var _2d=parseInt(_2b.shift(),10);
if(_2b.length==0){
for(var i=0;i<_2d;i++){
this.variation(null,true);
}
}else{
if(_2b.length){
this.variation(_2d,true);
if(_2b.length!=1){
while(this.cursor.nextNode()){
this.execNode(true);
}
}
if(_2b.length>1&&this.progressiveLoads){
return;
}
}
}
}
this.refresh();
}else{
if(!isNaN(parseInt(_2b,10))){
var _2f=parseInt(_2b,10);
if(_2c){
this.reset(true);
_2f++;
}
for(var i=0;i<_2f;i++){
this.variation(null,true);
}
this.refresh();
}else{
alert("Don't know how to get to '"+_2b+"'!");
}
}
},reset:function(_30,_31){
this.board.reset();
this.currentColor="B";
this.moveNumber=0;
if(_31){
this.cursor.node=this.gameTree.trees.first().nodes.first();
}else{
this.cursor.node=this.gameTree.nodes.first();
}
this.refresh(_30);
},refresh:function(_32){
if(this.progressiveLoads){
var me=this;
setTimeout(function(){
me.refresh.call(me);
},10);
return;
}
this.moveNumber--;
if(this.moveNumber<0){
this.moveNumber=0;
}
this.board.revert(1);
this.execNode(_32);
},variation:function(_34,_35){
if(this.cursor.next(_34)){
this.execNode(_35);
this.resetLastLabels();
if(this.progressiveLoads){
return false;
}
return true;
}
return false;
},execNode:function(_36){
if(this.progressiveLoads){
var me=this;
setTimeout(function(){
me.execNode.call(me,_36);
},10);
return;
}
if(!_36){
this.dom.comments.innerHTML="";
this.timeB="";
this.timeW="";
this.board.clearMarkers();
}
if(this.moveNumber<1){
this.currentColor="B";
}
var _38=this.cursor.node.getProperties();
for(var _39 in _38){
if(this.propertyHandlers[_39]){
(this.propertyHandlers[_39]).apply(this,[this.cursor.node[_39],_39,_36]);
}
}
if(_36){
this.board.commit();
}else{
if(this.opponentUrl&&this.opponentColor==this.currentColor&&this.moveNumber==this.totalMoves){
this.fetchOpponentMove();
}
this.findVariations();
this.updateControls();
this.board.commit();
this.board.render();
}
if(this.progressiveUrl&&!this.cursor.node.parent.cached){
this.nowLoading();
this.progressiveLoads++;
this.remoteLoad(this.progressiveUrl+"?id="+this.cursor.node.parent.id,this.cursor.node.parent);
}
},findVariations:function(){
this.variations=[];
if(!this.cursor.node){
return;
}
if(this.prefs.markNext&&this.cursor.node.nextSibling!=null){
this.variations.push({move:this.cursor.node.nextSibling.getMove(),treeNum:null});
}
if(this.cursor.node.nextSibling==null&&this.cursor.node.parent&&this.cursor.node.parent.trees.length){
var _3a=this.cursor.node.parent.trees;
for(var i=0;i<_3a.length;i++){
this.variations.push({move:_3a[i].nodes.first().getMove(),treeNum:i});
}
}
},back:function(e,obj,_3e){
if(this.cursor.previous()){
this.moveNumber--;
if(this.moveNumber<0){
this.moveNumber=0;
}
this.board.revert(1);
this.refresh(_3e);
this.resetLastLabels();
}
},forward:function(e,obj,_41){
this.variation(null,_41);
},first:function(){
if(!this.cursor.hasPrevious()){
return;
}
this.reset(false,true);
},last:function(){
if(!this.cursor.hasNext()){
return;
}
while(this.variation(null,true)){
}
this.refresh();
},pass:function(){
if(!this.variations){
return;
}
for(var i=0;i<this.variations.length;i++){
if(!this.variations[i].move||this.variations[i].move=="tt"){
this.variation(this.variations[i].treeNum);
return;
}
}
this.createMove("tt");
},getXY:function(e){
var _44=_6(e,this.board.renderer.domNode);
var m=this.board.renderer.margin;
var pw=this.board.renderer.pointWidth;
var ph=this.board.renderer.pointHeight;
var x=Math.round((_44[0]-m-(pw/2))/pw);
var y=Math.round((_44[1]-m-(ph/2))/ph);
return [x,y];
},handleBoardMouseDown:function(e){
if(this.domLoading){
return;
}
var xy=this.getXY(e);
var x=xy[0];
var y=xy[1];
if(!this.boundsCheck(x,y,[0,this.board.boardSize-1])){
return;
}
this.mouseDown=true;
this.mouseDownX=x;
this.mouseDownY=y;
if(this.mode=="region"&&x>=0&&y>=0&&!this.regionBegun){
this.regionTop=y;
this.regionLeft=x;
this.regionBegun=true;
}
},handleBoardHover:function(e){
if(this.domLoading){
return;
}
if(this.mouseDown||this.regionBegun){
var xy=this.getXY(e);
var x=xy[0];
var y=xy[1];
if(!this.boundsCheck(x,y,[0,this.board.boardSize-1])){
return;
}
if(!this.regionBegun&&(x!=this.mouseDownX||y!=this.mouseDownY)){
this.selectTool("region");
this.regionBegun=true;
this.regionTop=this.mouseDownY;
this.regionLeft=this.mouseDownX;
}
if(this.regionBegun){
this.regionRight=x+(x>=this.regionLeft?1:0);
this.regionBottom=y+(y>=this.regionTop?1:0);
this.showRegion();
}
}
},handleBoardMouseUp:function(e){
if(this.domLoading){
return;
}
this.mouseDown=false;
var xy=this.getXY(e);
var x=xy[0];
var y=xy[1];
var _56=this.pointToSgfCoord({x:x,y:y});
if(this.mode=="play"){
for(var i=0;i<this.variations.length;i++){
var _58=this.sgfCoordToPoint(this.variations[i].move);
if(_58.x==x&&_58.y==y){
this.variation(this.variations[i].treeNum);
_7(e);
return;
}
}
if(!this.rules.check({x:x,y:y},this.currentColor)){
return;
}
if(_56){
this.createMove(_56);
}
}else{
if(this.mode=="region"&&x>=-1&&y>=-1&&this.regionBegun){
if(this.regionTop==y&&this.regionLeft==x&&!this.regionClickSelect){
this.regionClickSelect=true;
}else{
this.regionBegun=false;
this.regionClickSelect=false;
this.regionBottom=(y<0?0:(y>=this.board.boardSize)?y:y+(y>this.regionTop?1:0));
this.regionRight=(x<0?0:(x>=this.board.boardSize)?x:x+(x>this.regionLeft?1:0));
this.showRegion();
this.dom.searchAlgo.style.display="inline";
this.dom.searchButton.style.display="inline";
}
}else{
var _59;
var _5a=this.board.getStone({x:x,y:y});
if(this.mode=="add_b"||this.mode=="add_w"){
this.cursor.node.emptyPoint(this.pointToSgfCoord({x:x,y:y}));
if(_5a!=this.board.BLACK&&this.mode=="add_b"){
_59="AB";
}else{
if(_5a!=this.board.WHITE&&this.mode=="add_w"){
_59="AW";
}else{
_59="AE";
}
}
}else{
switch(this.mode){
case "tr":
_59="TR";
break;
case "sq":
_59="SQ";
break;
case "cr":
_59="CR";
break;
case "x":
_59="MA";
break;
case "number":
_59="LB";
_56=_56+":"+this.labelLastNumber;
this.labelLastNumber++;
break;
case "letter":
_59="LB";
_56=_56+":"+this.labelLastLetter;
this.labelLastLetter=String.fromCharCode(this.labelLastLetter.charCodeAt(0)+1);
}
}
this.cursor.node.pushProperty(_59,_56);
this.refresh();
}
}
},boundsCheck:function(x,y,_5d){
if(_5d.length==2){
_5d[3]=_5d[2]=_5d[1];
_5d[1]=_5d[0];
}
return (x>=_5d[0]&&y>=_5d[1]&&x<=_5d[2]&&y<=_5d[3]);
},getRegionBounds:function(){
var l=this.regionLeft;
var w=this.regionRight-this.regionLeft;
if(w<0){
l=this.regionRight;
w=-w+1;
}
var t=this.regionTop;
var h=this.regionBottom-this.regionTop;
if(h<0){
t=this.regionBottom;
h=-h+1;
}
return [t,l,w,h];
},showRegion:function(){
var _62=this.getRegionBounds();
this.dom.searchRegion.style.top=(this.board.renderer.margin+this.board.renderer.pointHeight*_62[0])+"px";
this.dom.searchRegion.style.left=(this.board.renderer.margin+this.board.renderer.pointWidth*_62[1])+"px";
this.dom.searchRegion.style.width=this.board.renderer.pointWidth*_62[2]+"px";
this.dom.searchRegion.style.height=this.board.renderer.pointHeight*_62[3]+"px";
this.dom.searchRegion.style.display="block";
},searchRegion:function(){
var _63=this.getRegionBounds();
var _64=this.board.getRegion(_63[0],_63[1],_63[2],_63[3]);
var _65=_64.join("").replace(new RegExp(this.board.EMPTY,"g"),".").replace(new RegExp(this.board.BLACK,"g"),"X").replace(new RegExp(this.board.WHITE,"g"),"O");
var _66=(_63[0]<this.board.boardSize/2)?"n":"s";
_66+=(_63[1]<this.board.boardSize/2)?"w":"e";
var _67=this.dom.searchAlgo.value;
this.showComments("");
this.nowLoading();
var _68=function(req){
this.doneLoading();
this.dom.comments.style.display="none";
this.dom.searchContainer.style.display="block";
this.dom.searchContainer.innerHTML=req.responseText;
this.progressiveLoad=false;
this.progressiveUrl=null;
this.prefs.markNext=false;
};
var _6a=function(req){
this.croak(t["error retrieving"]+req.statusText);
};
var _6c={q:_66,w:_63[2],h:_63[3],p:_65,a:_67,t:(new Date()).getTime()};
_3("get",this.searchUrl,_6c,_68,_6a,this,45000);
},compressPattern:function(_6d){
var c=null;
var pc="";
var n=1;
var ret="";
for(var i=0;i<_6d.length;i++){
c=_6d.charAt(i);
if(c==pc){
n++;
}else{
ret=ret+pc+(n>1?n:"");
n=1;
pc=c;
}
}
ret=ret+pc+(n>1?n:"");
return ret;
},uncompressPattern:function(_73){
var c=null;
var s=null;
var n="";
var ret="";
for(var i=0;i<_73.length;i++){
c=_73.charAt(i);
if(c=="."||c=="X"||c=="O"){
if(s!=null){
n=parseInt(n,10);
n=isNaN(n)?1:n;
for(var j=0;j<n;j++){
ret+=s;
}
n="";
}
s=c;
}else{
n+=c;
}
}
n=parseInt(n,10);
n=isNaN(n)?1:n;
for(var j=0;j<n;j++){
ret+=s;
}
return ret;
},createMove:function(_7a){
var _7b={};
_7b[this.currentColor]=_7a;
_7b["MN"]=(++this.moveNumber).toString();
var _7c=new eidogo.GameNode(_7b);
this.totalMoves++;
if(this.cursor.hasNext()){
if(this.cursor.node.nextSibling){
this.cursor.node.parent.createVariationTree(this.cursor.node.getPosition());
}
this.cursor.node.parent.appendTree(new eidogo.GameTree({nodes:[_7c],trees:[]}));
this.variation(this.cursor.node.parent.trees.length-1);
}else{
this.cursor.node.parent.appendNode(_7c);
this.variation();
}
},handleKeypress:function(e){
var _7e=e.keyCode||e.charCode;
if(!_7e||e.ctrlKey||e.altKey||e.metaKey){
return true;
}
var _7f=String.fromCharCode(_7e).toLowerCase();
for(var i=0;i<this.variations.length;i++){
var _81=this.sgfCoordToPoint(this.variations[i].move);
var _82=""+(i+1);
if(_81.x!=null&&this.board.getMarker(_81)!=this.board.EMPTY&&typeof this.board.getMarker(_81)=="string"){
_82=this.board.getMarker(_81).toLowerCase();
}
_82=_82.replace(/^var:/,"");
if(_7f==_82.charAt(0)){
this.variation(this.variations[i].treeNum);
_7(e);
return;
}
}
if(_7e==112||_7e==27){
this.selectTool("play");
}
var _83=true;
switch(_7e){
case 32:
if(e.shiftKey){
this.back();
}else{
this.forward();
}
break;
case 39:
if(e.shiftKey){
var _84=this.totalMoves-this.moveNumber;
var _85=(_84>9?9:_84-1);
for(var i=0;i<_85;i++){
this.forward(null,null,true);
}
}
this.forward();
break;
case 37:
if(e.shiftKey){
var _85=(this.moveNumber>9?9:this.moveNumber-1);
for(var i=0;i<_85;i++){
this.back(null,null,true);
}
}
this.back();
break;
case 40:
this.last();
break;
case 38:
this.first();
break;
case 192:
this.pass();
break;
default:
_83=false;
break;
}
if(_83){
_7(e);
}
},showInfo:function(){
this.dom.infoGame.innerHTML="";
var _86=this.gameTree.trees.first().nodes.first();
var dl=document.createElement("dl");
for(var _88 in this.infoLabels){
if(_86[_88]){
if(_88=="PW"){
this.dom.whiteName.innerHTML=_86[_88]+(_86["WR"]?", "+_86["WR"]:"");
continue;
}else{
if(_88=="PB"){
this.dom.blackName.innerHTML=_86[_88]+(_86["BR"]?", "+_86["BR"]:"");
continue;
}
}
if(_88=="WR"||_88=="BR"){
continue;
}
if(_88=="DT"){
var _89=_86[_88].split(/[\.-]/);
if(_89.length==3){
_86[_88]=_89[2].replace(/^0+/,"")+" "+this.months[_89[1]-1]+" "+_89[0];
}
}
var dt=document.createElement("dt");
dt.innerHTML=this.infoLabels[_88]+":";
var dd=document.createElement("dd");
dd.innerHTML=_86[_88];
dl.appendChild(dt);
dl.appendChild(dd);
}
}
if(this.prefs.showGameInfo){
this.dom.infoGame.appendChild(dl);
}
},selectTool:function(_8c){
var _8d;
if(_8c=="region"){
_8d="crosshair";
}else{
_8d="default";
this.regionBegun=false;
this.dom.searchRegion.style.display="none";
this.dom.searchButton.style.display="none";
this.dom.searchAlgo.style.display="none";
}
this.board.renderer.domNode.style.cursor=_8d;
this.mode=_8c;
this.dom.toolsSelect.value=_8c;
},updateControls:function(){
this.dom.moveNumber.innerHTML=(this.moveNumber?t["move"]+" "+this.moveNumber:"permalink");
this.dom.whiteCaptures.innerHTML=t["captures"]+": <span>"+this.board.captures.W+"</span>";
this.dom.blackCaptures.innerHTML=t["captures"]+": <span>"+this.board.captures.B+"</span>";
this.dom.whiteTime.innerHTML=t["time left"]+": <span>"+(this.timeW?this.timeW:"--")+"</span>";
this.dom.blackTime.innerHTML=t["time left"]+": <span>"+(this.timeB?this.timeB:"--")+"</span>";
_9(this.dom.controlPass,"pass-on");
this.dom.variations.innerHTML="";
for(var i=0;i<this.variations.length;i++){
var _8f=i+1;
if(!this.variations[i].move||this.variations[i].move=="tt"){
_8(this.dom.controlPass,"pass-on");
}else{
var _90=this.sgfCoordToPoint(this.variations[i].move);
if(this.board.getMarker(_90)!=this.board.EMPTY){
_8f=this.board.getMarker(_90);
}
if(this.prefs.markVariations){
this.board.addMarker(_90,"var:"+_8f);
}
}
var _91=document.createElement("div");
_91.className="variation-nav";
_91.innerHTML=_8f;
_4(_91,"click",function(e,arg){
arg.me.variation(arg.treeNum);
},{me:this,treeNum:this.variations[i].treeNum});
this.dom.variations.appendChild(_91);
}
if(!this.variations.length){
this.dom.variations.innerHTML="<div class='variation-nav none'>"+t["no variations"]+"</div>";
}
if(this.cursor.hasNext()){
_8(this.dom.controlForward,"forward-on");
_8(this.dom.controlLast,"last-on");
}else{
_9(this.dom.controlForward,"forward-on");
_9(this.dom.controlLast,"last-on");
}
if(this.cursor.hasPrevious()){
_8(this.dom.controlBack,"back-on");
_8(this.dom.controlFirst,"first-on");
}else{
_9(this.dom.controlBack,"back-on");
_9(this.dom.controlFirst,"first-on");
}
if(!this.progressiveLoad){
this.updateNavSlider();
}
},setColor:function(_94){
this.prependComment(_94=="B"?t["black to play"]:t["white to play"]);
this.currentColor=_94;
},setMoveNumber:function(num){
this.moveNumber=num;
},playMove:function(_96,_97,_98){
_97=_97||this.currentColor;
this.currentColor=(_97=="B"?"W":"B");
_97=_97=="W"?this.board.WHITE:this.board.BLACK;
var pt=this.sgfCoordToPoint(_96);
if(!this.cursor.node["MN"]){
this.moveNumber++;
}
if(_96&&_96!="tt"){
this.board.addStone(pt,_97);
this.rules.apply(pt,_97);
if(this.prefs.markCurrent){
this.addMarker(_96,"current");
}
}else{
if(!_98){
this.prependComment((_97==this.board.WHITE?t["white"]:t["black"])+" "+t["passed"],"comment-pass");
}
}
},addStone:function(_9a,_9b){
if(!(_9a instanceof Array)){
_9a=[_9a];
}
_9a=this.expandCompressedPoints(_9a);
for(var i=0;i<_9a.length;i++){
this.board.addStone(this.sgfCoordToPoint(_9a[i]),_9b=="AW"?this.board.WHITE:_9b=="AB"?this.board.BLACK:this.board.EMPTY);
}
},addMarker:function(_9d,_9e){
if(!(_9d instanceof Array)){
_9d=[_9d];
}
_9d=this.expandCompressedPoints(_9d);
var _9f;
for(var i=0;i<_9d.length;i++){
switch(_9e){
case "TR":
_9f="triangle";
break;
case "SQ":
_9f="square";
break;
case "CR":
_9f="circle";
break;
case "MA":
_9f="ex";
break;
case "TW":
_9f="territory-white";
break;
case "TB":
_9f="territory-black";
break;
case "LB":
_9f=(_9d[i].split(":"))[1];
_9d[i];
break;
default:
_9f=_9e;
break;
}
this.board.addMarker(this.sgfCoordToPoint((_9d[i].split(":"))[0]),_9f);
}
},showTime:function(_a1,_a2){
var tp=(_a2=="BL"||_a2=="OB"?"timeB":"timeW");
if(_a2=="BL"||_a2=="WL"){
var _a4=Math.floor(_a1/60);
var _a5=(_a1%60).toFixed(0);
_a5=(_a5<10?"0":"")+_a5;
this[tp]=_a4+":"+_a5+this[tp];
}else{
this[tp]+=" ("+_a1+")";
}
},showAnnotation:function(_a6,_a7){
var msg;
switch(_a7){
case "N":
msg=_a6;
break;
case "GB":
msg=(_a6>1?t["vgb"]:t["gb"]);
break;
case "GW":
msg=(_a6>1?t["vgw"]:t["gw"]);
break;
case "DM":
msg=(_a6>1?t["dmj"]:t["dm"]);
break;
case "UC":
msg=t["uc"];
break;
case "TE":
msg=t["te"];
break;
case "BM":
msg=(_a6>1?t["vbm"]:t["bm"]);
break;
case "DO":
msg=t["do"];
break;
case "IT":
msg=t["it"];
break;
case "HO":
msg=t["ho"];
break;
}
this.prependComment(msg);
},showComments:function(_a9,_aa,_ab){
if(!_a9||_ab){
return;
}
this.dom.comments.innerHTML+=_a9.replace(/\n/g,"<br />");
},prependComment:function(_ac,cls){
cls=cls||"comment-status";
this.dom.comments.innerHTML="<div class='"+cls+"'>"+_ac+"</div>"+this.dom.comments.innerHTML;
},constructDom:function(){
this.dom.player=document.createElement("div");
this.dom.player.className="eidogo-player";
this.dom.player.id="player-"+this.uniq;
this.dom.container.appendChild(this.dom.player);
var _ae="    \t        <div id='controls-container' class='controls-container'>    \t            <ul id='controls' class='controls'>    \t                <li id='control-first' class='control first'>First</li>    \t                <li id='control-back' class='control back'>Back</li>    \t                <li id='control-forward' class='control forward'>Forward</li>    \t                <li id='control-last' class='control last'>Last</li>    \t                <li id='control-pass' class='control pass'>Pass</li>    \t            </ul>    \t            <div id='move-number' class='move-number'></div>    \t            <div id='nav-slider' class='nav-slider'>    \t                <div id='nav-slider-thumb' class='nav-slider-thumb'></div>    \t            </div>    \t            <div id='variations-container' class='variations-container'>    \t                <div id='variations-label' class='variations-label'>"+t["variations"]+":</div>    \t                <div id='variations' class='variations'></div>    \t            </div>    \t        </div>    \t        <div id='tools-container' class='tools-container'>                    <div id='tools-label' class='tools-label'>"+t["tool"]+":</div>                    <select id='tools-select' class='tools-select'>                        <option value='play'>"+t["play"]+"</option>                        <option value='add_b'>"+t["add_b"]+"</option>                        <option value='add_w'>"+t["add_w"]+"</option>                        <option value='region'>"+t["region"]+"</option>                        <option value='tr'>"+t["triangle"]+"</option>                        <option value='sq'>"+t["square"]+"</option>                        <option value='cr'>"+t["circle"]+"</option>                        <option value='x'>"+t["x"]+"</option>                        <option value='letter'>"+t["letter"]+"</option>                        <option value='number'>"+t["number"]+"</option>                    </select>                    <select id='search-algo' class='search-algo'>                        <option value='corner'>"+t["search corner"]+"</option>                        <option value='center'>"+t["search center"]+"</option>                    </select>                    <input type='button' id='search-button' class='search-button' value='"+t["search"]+"'>                </div>    \t        <div id='comments' class='comments'></div>    \t        <div id='search-container' class='search-container'></div>    \t        <div id='board-container' class='board-container with-coords'></div>    \t        <div id='info' class='info'>    \t            <div id='info-players' class='players'>        \t            <div id='white' class='player white'>        \t                <div id='white-name' class='name'></div>        \t                <div id='white-captures' class='captures'></div>        \t                <div id='white-time' class='time'></div>        \t            </div>        \t            <div id='black' class='player black'>        \t                <div id='black-name' class='name'></div>        \t                <div id='black-captures' class='captures'></div>        \t                <div id='black-time' class='time'></div>        \t            </div>        \t        </div>    \t            <div id='info-game' class='game'></div>    \t        </div>    \t        <div id='preferences' class='preferences'>    \t            <div><input type='checkbox'> Show variations on board</div>    \t            <div><input type='checkbox'> Mark current move</div>    \t        </div>    \t        <div id='footer' class='footer'></div>    \t    ";
_ae=_ae.replace(/ id='([^']+)'/g," id='$1-"+this.uniq+"'");
this.dom.player.innerHTML=_ae;
var re=/ id='([^']+)-\d+'/g;
var _b0;
var id;
var _b2;
while(_b0=re.exec(_ae)){
id=_b0[0].replace(/'/g,"").replace(/ id=/,"");
_b2="";
_b0[1].split("-").forEach(function(_b3,i){
_b3=i?_b3.charAt(0).toUpperCase()+_b3.substring(1):_b3;
_b2+=_b3;
});
this.dom[_b2]=_2(id);
}
this.dom.searchRegion=document.createElement("div");
this.dom.searchRegion.id="search-region-"+this.uniq;
this.dom.searchRegion.className="search-region";
[["moveNumber","setPermalink"],["controlFirst","first"],["controlBack","back"],["controlForward","forward"],["controlPass","pass"],["searchButton","searchRegion"]].forEach(function(eh){
_5(this.dom[eh[0]],this[eh[1]],this);
}.bind(this));
_4(this.dom.toolsSelect,"change",function(e){
this.selectTool.apply(this,[(e.target||e.srcElement).value]);
},this,true);
},enableNavSlider:function(){
if(this.progressiveLoad){
return;
}
this.dom.navSliderThumb.style.display="block";
this.dom.navSlider.style.cursor="pointer";
var _b7=false;
var _b8=null;
_4(this.dom.navSlider,"mousedown",function(e){
_b7=true;
},this,true);
_4(document,"mousemove",function(e){
if(!_b7){
return;
}
var xy=_6(e,this.dom.navSlider);
clearTimeout(_b8);
_b8=setTimeout(function(){
this.updateNavSlider(xy[0]);
}.bind(this),10);
_7(e);
},this,true);
_4(document,"mouseup",function(e){
if(!_b7){
return;
}
_b7=false;
var xy=_6(e,this.dom.navSlider);
this.updateNavSlider(xy[0]);
},this,true);
},updateNavSlider:function(_be){
var _bf=this.dom.navSlider.offsetWidth-this.dom.navSliderThumb.offsetWidth;
var _c0=this.totalMoves;
var _c1=!!_be;
var _be=_be||this.moveNumber/_c0*_bf;
_be=_be>_bf?_bf:_be;
_be=_be<0?0:_be;
var _c2=parseInt(_be/_bf*_c0,10);
if(_c1){
var _c3=_c2-this.cursor.node.getPosition();
for(var i=0;i<Math.abs(_c3);i++){
if(_c3>0){
this.variation(null,true);
}else{
if(_c3<0){
this.cursor.previous();
this.moveNumber--;
}
}
}
if(_c3<0){
if(this.moveNumber<0){
this.moveNumber=0;
}
this.board.revert(Math.abs(_c3));
}
this.refresh();
}
_be=parseInt(_c2/_c0*_bf,10)||0;
this.dom.navSliderThumb.style.left=_be+"px";
},resetLastLabels:function(){
this.labelLastNumber=1;
this.labelLastLetter="A";
},sgfCoordToPoint:function(_c5){
if(!_c5||_c5=="tt"){
return {x:null,y:null};
}
var _c6={a:0,b:1,c:2,d:3,e:4,f:5,g:6,h:7,i:8,j:9,k:10,l:11,m:12,n:13,o:14,p:15,q:16,r:17,s:18};
return {x:_c6[_c5.charAt(0)],y:_c6[_c5.charAt(1)]};
},pointToSgfCoord:function(pt){
if(!pt||!this.boundsCheck(pt.x,pt.y,[0,this.board.boardSize-1])){
return null;
}
var pts={0:"a",1:"b",2:"c",3:"d",4:"e",5:"f",6:"g",7:"h",8:"i",9:"j",10:"k",11:"l",12:"m",13:"n",14:"o",15:"p",16:"q",17:"r",18:"s"};
return pts[pt.x]+pts[pt.y];
},expandCompressedPoints:function(_c9){
var _ca;
var ul,lr;
var x,y;
var _cf=[];
var _d0=[];
for(var i=0;i<_c9.length;i++){
_ca=_c9[i].split(/:/);
if(_ca.length>1){
ul=this.sgfCoordToPoint(_ca[0]);
lr=this.sgfCoordToPoint(_ca[1]);
for(x=ul.x;x<=lr.x;x++){
for(y=ul.y;y<=lr.y;y++){
_cf.push(this.pointToSgfCoord({x:x,y:y}));
}
}
_d0.push(i);
}
}
_c9=_c9.concat(_cf);
return _c9;
},setPermalink:function(){
var _d2=/Apple/.test(navigator.vendor)?"":"#";
location.hash=_d2+(this.gameName?this.gameName:"")+":"+this.cursor.getPath().join(",");
},nowLoading:function(msg){
if(this.croaked){
return;
}
msg=msg||t["loading"]+"...";
if(_2("eidogo-loading-"+this.uniq)){
return;
}
this.domLoading=document.createElement("div");
this.domLoading.id="eidogo-loading-"+this.uniq;
this.domLoading.className="eidogo-loading";
this.domLoading.innerHTML=msg;
this.dom.player.appendChild(this.domLoading);
},doneLoading:function(){
if(this.domLoading&&this.domLoading!=null&&this.domLoading.parentNode){
this.domLoading.parentNode.removeChild(this.domLoading);
this.domLoading=null;
}
},croak:function(msg){
this.doneLoading();
this.dom.player.innerHTML+="<div class='eidogo-error'>"+msg.replace(/\n/g,"<br />")+"</div>";
this.croaked=true;
}};
})();

