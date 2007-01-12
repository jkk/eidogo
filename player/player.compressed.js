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

YAHOO.widget.Slider=function(_1,_2,_3,_4){
if(_1){
this.type=_4;
this.init(_1,_2,true);
var _5=this;
this.createEvent("change",this);
this.createEvent("slideStart",this);
this.createEvent("slideEnd",this);
this.thumb=_3;
_3.onChange=function(){
_5.handleThumbChange();
};
this.isTarget=false;
this.animate=YAHOO.widget.Slider.ANIM_AVAIL;
this.backgroundEnabled=true;
this.tickPause=40;
this.enableKeys=true;
this.keyIncrement=20;
this.moveComplete=true;
this.animationDuration=0.2;
if(_3._isHoriz&&_3.xTicks&&_3.xTicks.length){
this.tickPause=Math.round(360/_3.xTicks.length);
}else{
if(_3.yTicks&&_3.yTicks.length){
this.tickPause=Math.round(360/_3.yTicks.length);
}
}
_3.onMouseDown=function(){
return _5.focus();
};
_3.onMouseUp=function(){
_5.thumbMouseUp();
};
_3.onDrag=function(){
_5.fireEvents();
};
_3.onAvailable=function(){
return _5.setStartSliderState();
};
}
};
YAHOO.widget.Slider.getHorizSlider=function(_6,_7,_8,_9,_a){
return new YAHOO.widget.Slider(_6,_6,new YAHOO.widget.SliderThumb(_7,_6,_8,_9,0,0,_a),"horiz");
};
YAHOO.widget.Slider.getVertSlider=function(_b,_c,_d,_e,_f){
return new YAHOO.widget.Slider(_b,_b,new YAHOO.widget.SliderThumb(_c,_b,0,0,_d,_e,_f),"vert");
};
YAHOO.widget.Slider.getSliderRegion=function(_16,_17,_18,_19,iUp,_20,_21){
return new YAHOO.widget.Slider(_16,_16,new YAHOO.widget.SliderThumb(_17,_16,_18,_19,iUp,_20,_21),"region");
};
YAHOO.widget.Slider.ANIM_AVAIL=true;
YAHOO.extend(YAHOO.widget.Slider,YAHOO.util.DragDrop,{onAvailable:function(){
var _22=YAHOO.util.Event;
_22.on(this.id,"keydown",this.handleKeyDown,this,true);
_22.on(this.id,"keypress",this.handleKeyPress,this,true);
},handleKeyPress:function(e){
if(this.enableKeys){
var _24=YAHOO.util.Event;
var kc=_24.getCharCode(e);
switch(kc){
case 37:
case 38:
case 39:
case 40:
case 36:
case 35:
_24.preventDefault(e);
break;
default:
}
}
},handleKeyDown:function(e){
if(this.enableKeys){
var _26=YAHOO.util.Event;
var kc=_26.getCharCode(e),t=this.thumb;
var h=this.getXValue(),v=this.getYValue();
var _28=false;
var _29=true;
switch(kc){
case 37:
h-=this.keyIncrement;
break;
case 38:
v-=this.keyIncrement;
break;
case 39:
h+=this.keyIncrement;
break;
case 40:
v+=this.keyIncrement;
break;
case 36:
h=t.leftConstraint;
v=t.topConstraint;
break;
case 35:
h=t.rightConstraint;
v=t.bottomConstraint;
break;
default:
_29=false;
}
if(_29){
if(t._isRegion){
this.setRegionValue(h,v,true);
}else{
var _30=(t._isHoriz)?h:v;
this.setValue(_30,true);
}
_26.stopEvent(e);
}
}
},setStartSliderState:function(){
this.setThumbCenterPoint();
this.baselinePos=YAHOO.util.Dom.getXY(this.getEl());
this.thumb.startOffset=this.thumb.getOffsetFromParent(this.baselinePos);
if(this.thumb._isRegion){
if(this.deferredSetRegionValue){
this.setRegionValue.apply(this,this.deferredSetRegionValue,true);
this.deferredSetRegionValue=null;
}else{
this.setRegionValue(0,0,true);
}
}else{
if(this.deferredSetValue){
this.setValue.apply(this,this.deferredSetValue,true);
this.deferredSetValue=null;
}else{
this.setValue(0,true,true);
}
}
},setThumbCenterPoint:function(){
var el=this.thumb.getEl();
if(el){
this.thumbCenterPoint={x:parseInt(el.offsetWidth/2,10),y:parseInt(el.offsetHeight/2,10)};
}
},lock:function(){
this.thumb.lock();
this.locked=true;
},unlock:function(){
this.thumb.unlock();
this.locked=false;
},thumbMouseUp:function(){
if(!this.isLocked()&&!this.moveComplete){
this.endMove();
}
},getThumb:function(){
return this.thumb;
},focus:function(){
var el=this.getEl();
if(el.focus){
try{
el.focus();
}
catch(e){
}
}
this.verifyOffset();
if(this.isLocked()){
return false;
}else{
this.onSlideStart();
return true;
}
},onChange:function(_32,_33){
},onSlideStart:function(){
},onSlideEnd:function(){
},getValue:function(){
return this.thumb.getValue();
},getXValue:function(){
return this.thumb.getXValue();
},getYValue:function(){
return this.thumb.getYValue();
},handleThumbChange:function(){
var t=this.thumb;
if(t._isRegion){
t.onChange(t.getXValue(),t.getYValue());
this.fireEvent("change",{x:t.getXValue(),y:t.getYValue()});
}else{
t.onChange(t.getValue());
this.fireEvent("change",t.getValue());
}
},setValue:function(_35,_36,_37){
if(!this.thumb.available){
this.deferredSetValue=arguments;
return false;
}
if(this.isLocked()&&!_37){
return false;
}
if(isNaN(_35)){
return false;
}
var t=this.thumb;
var _38,_2e;
this.verifyOffset();
if(t._isRegion){
return false;
}else{
if(t._isHoriz){
this.onSlideStart();
_38=t.initPageX+_35+this.thumbCenterPoint.x;
this.moveThumb(_38,t.initPageY,_36);
}else{
this.onSlideStart();
_2e=t.initPageY+_35+this.thumbCenterPoint.y;
this.moveThumb(t.initPageX,_2e,_36);
}
}
return true;
},setRegionValue:function(_39,_40,_41){
if(!this.thumb.available){
this.deferredSetRegionValue=arguments;
return false;
}
if(this.isLocked()&&!force){
return false;
}
if(isNaN(_39)){
return false;
}
var t=this.thumb;
if(t._isRegion){
this.onSlideStart();
var _42=t.initPageX+_39+this.thumbCenterPoint.x;
var _43=t.initPageY+_40+this.thumbCenterPoint.y;
this.moveThumb(_42,_43,_41);
return true;
}
return false;
},verifyOffset:function(){
var _44=YAHOO.util.Dom.getXY(this.getEl());
if(_44[0]!=this.baselinePos[0]||_44[1]!=this.baselinePos[1]){
this.thumb.resetConstraints();
this.baselinePos=_44;
return false;
}
return true;
},moveThumb:function(x,y,_47){
var t=this.thumb;
var _48=this;
if(!t.available){
return;
}
t.setDelta(this.thumbCenterPoint.x,this.thumbCenterPoint.y);
var _p=t.getTargetCoord(x,y);
var p=[_p.x,_p.y];
this.fireEvent("slideStart");
if(this.animate&&YAHOO.widget.Slider.ANIM_AVAIL&&t._graduated&&!_47){
this.lock();
setTimeout(function(){
_48.moveOneTick(p);
},this.tickPause);
}else{
if(this.animate&&YAHOO.widget.Slider.ANIM_AVAIL&&!_47){
this.lock();
var _51=new YAHOO.util.Motion(t.id,{points:{to:p}},this.animationDuration,YAHOO.util.Easing.easeOut);
_51.onComplete.subscribe(function(){
_48.endMove();
});
_51.animate();
}else{
t.setDragElPos(x,y);
this.endMove();
}
}
},moveOneTick:function(_52){
var t=this.thumb;
var _53=YAHOO.util.Dom.getXY(t.getEl());
var tmp;
var _55=null;
if(t._isRegion){
_55=this._getNextX(_53,_52);
var _56=(_55)?_55[0]:_53[0];
_55=this._getNextY([_56,_53[1]],_52);
}else{
if(t._isHoriz){
_55=this._getNextX(_53,_52);
}else{
_55=this._getNextY(_53,_52);
}
}
if(_55){
this.thumb.alignElWithMouse(t.getEl(),_55[0],_55[1]);
if(!(_55[0]==_52[0]&&_55[1]==_52[1])){
var _57=this;
setTimeout(function(){
_57.moveOneTick(_52);
},this.tickPause);
}else{
this.endMove();
}
}else{
this.endMove();
}
},_getNextX:function(_58,_59){
var t=this.thumb;
var _60;
var tmp=[];
var _61=null;
if(_58[0]>_59[0]){
_60=t.tickSize-this.thumbCenterPoint.x;
tmp=t.getTargetCoord(_58[0]-_60,_58[1]);
_61=[tmp.x,tmp.y];
}else{
if(_58[0]<_59[0]){
_60=t.tickSize+this.thumbCenterPoint.x;
tmp=t.getTargetCoord(_58[0]+_60,_58[1]);
_61=[tmp.x,tmp.y];
}else{
}
}
return _61;
},_getNextY:function(_62,_63){
var t=this.thumb;
var _64;
var tmp=[];
var _65=null;
if(_62[1]>_63[1]){
_64=t.tickSize-this.thumbCenterPoint.y;
tmp=t.getTargetCoord(_62[0],_62[1]-_64);
_65=[tmp.x,tmp.y];
}else{
if(_62[1]<_63[1]){
_64=t.tickSize+this.thumbCenterPoint.y;
tmp=t.getTargetCoord(_62[0],_62[1]+_64);
_65=[tmp.x,tmp.y];
}else{
}
}
return _65;
},b4MouseDown:function(e){
this.thumb.autoOffset();
this.thumb.resetConstraints();
},onMouseDown:function(e){
if(!this.isLocked()&&this.backgroundEnabled){
var x=YAHOO.util.Event.getPageX(e);
var y=YAHOO.util.Event.getPageY(e);
this.focus();
this.moveThumb(x,y);
}
},onDrag:function(e){
if(!this.isLocked()){
var x=YAHOO.util.Event.getPageX(e);
var y=YAHOO.util.Event.getPageY(e);
this.moveThumb(x,y,true);
}
},endMove:function(){
this.unlock();
this.moveComplete=true;
this.fireEvents();
},fireEvents:function(){
var t=this.thumb;
t.cachePosition();
if(!this.isLocked()){
if(t._isRegion){
var _66=t.getXValue();
var _67=t.getYValue();
if(_66!=this.previousX||_67!=this.previousY){
this.onChange(_66,_67);
this.fireEvent("change",{x:_66,y:_67});
}
this.previousX=_66;
this.previousY=_67;
}else{
var _68=t.getValue();
if(_68!=this.previousVal){
this.onChange(_68);
this.fireEvent("change",_68);
}
this.previousVal=_68;
}
if(this.moveComplete){
this.onSlideEnd();
this.fireEvent("slideEnd");
this.moveComplete=false;
}
}
},toString:function(){
return ("Slider ("+this.type+") "+this.id);
}});
YAHOO.augment(YAHOO.widget.Slider,YAHOO.util.EventProvider);
YAHOO.widget.SliderThumb=function(id,_70,_71,_72,iUp,_73,_74){
if(id){
this.init(id,_70);
this.parentElId=_70;
}
this.isTarget=false;
this.tickSize=_74;
this.maintainOffset=true;
this.initSlider(_71,_72,iUp,_73,_74);
this.scroll=false;
};
YAHOO.extend(YAHOO.widget.SliderThumb,YAHOO.util.DD,{startOffset:null,_isHoriz:false,_prevVal:0,_graduated:false,getOffsetFromParent:function(_75){
var _76=YAHOO.util.Dom.getXY(this.getEl());
var _77=_75||YAHOO.util.Dom.getXY(this.parentElId);
return [(_76[0]-_77[0]),(_76[1]-_77[1])];
},initSlider:function(_78,_79,iUp,_80,_81){
this.setXConstraint(_78,_79,_81);
this.setYConstraint(iUp,_80,_81);
if(_81&&_81>1){
this._graduated=true;
}
this._isHoriz=(_78||_79);
this._isVert=(iUp||_80);
this._isRegion=(this._isHoriz&&this._isVert);
},clearTicks:function(){
YAHOO.widget.SliderThumb.superclass.clearTicks.call(this);
this._graduated=false;
},getValue:function(){
if(!this.available){
return 0;
}
var val=(this._isHoriz)?this.getXValue():this.getYValue();
return val;
},getXValue:function(){
if(!this.available){
return 0;
}
var _83=this.getOffsetFromParent();
return (_83[0]-this.startOffset[0]);
},getYValue:function(){
if(!this.available){
return 0;
}
var _84=this.getOffsetFromParent();
return (_84[1]-this.startOffset[1]);
},toString:function(){
return "SliderThumb "+this.id;
},onChange:function(x,y){
}});
if("undefined"==typeof YAHOO.util.Anim){
YAHOO.widget.Slider.ANIM_AVAIL=false;
}

YAHOO.namespace("ext");
YAHOO.ext.DomHelper=new function(){
var d=document;
var _2=null;
this.useDom=false;
var _3=/^(?:base|basefont|br|frame|hr|img|input|isindex|link|meta|nextid|range|spacer|wbr|audioscope|area|param|keygen|col|limittext|spot|tab|over|right|left|choose|atop|of)$/i;
this.applyStyles=function(el,_5){
if(_5){
var D=YAHOO.util.Dom;
if(typeof _5=="string"){
var re=/\s?([a-z\-]*)\:([^;]*);?/gi;
var _8;
while((_8=re.exec(_5))!=null){
D.setStyle(el,_8[1],_8[2]);
}
}else{
if(typeof _5=="object"){
for(var _9 in _5){
D.setStyle(el,_9,_5[_9]);
}
}else{
if(typeof _5=="function"){
YAHOO.ext.DomHelper.applyStyles(el,_5.call());
}
}
}
}
};
function createHtml(o){
var b="";
b+="<"+o.tag;
for(var _c in o){
if(_c=="tag"||_c=="children"||_c=="html"||typeof o[_c]=="function"){
continue;
}
if(_c=="style"){
var s=o["style"];
if(typeof s=="function"){
s=s.call();
}
if(typeof s=="string"){
b+=" style=\""+s+"\"";
}else{
if(typeof s=="object"){
b+=" style=\"";
for(var _e in s){
if(typeof s[_e]!="function"){
b+=_e+":"+s[_e]+";";
}
}
b+="\"";
}
}
}else{
if(_c=="cls"){
b+=" class=\""+o["cls"]+"\"";
}else{
if(_c=="htmlFor"){
b+=" for=\""+o["htmlFor"]+"\"";
}else{
b+=" "+_c+"=\""+o[_c]+"\"";
}
}
}
}
if(_3.test(o.tag)){
b+=" />";
}else{
b+=">";
if(o.children){
for(var i=0,len=o.children.length;i<len;i++){
b+=createHtml(o.children[i],b);
}
}
if(o.html){
b+=o.html;
}
b+="</"+o.tag+">";
}
return b;
}
function createDom(o,_12){
var el=d.createElement(o.tag);
var _14=el.setAttribute?true:false;
for(var _15 in o){
if(_15=="tag"||_15=="children"||_15=="html"||_15=="style"||typeof o[_15]=="function"){
continue;
}
if(_15=="cls"){
el.className=o["cls"];
}else{
if(_14){
el.setAttribute(_15,o[_15]);
}else{
el[_15]=o[_15];
}
}
}
this.applyStyles(el,o.style);
if(o.children){
for(var i=0,len=o.children.length;i<len;i++){
createDom(o.children[i],el);
}
}
if(o.html){
el.innerHTML=o.html;
}
if(_12){
_12.appendChild(el);
}
return el;
}
function insertIntoTable(tag,_19,el,_1b){
if(!_2){
_2=document.createElement("div");
}
var _1c;
if(tag=="table"||tag=="tbody"){
_2.innerHTML="<table><tbody>"+_1b+"</tbody></table>";
_1c=_2.firstChild.firstChild.firstChild;
}else{
_2.innerHTML="<table><tbody><tr>"+_1b+"</tr></tbody></table>";
_1c=_2.firstChild.firstChild.firstChild.firstChild;
}
if(_19=="beforebegin"){
el.parentNode.insertBefore(_1c,el);
return _1c;
}else{
if(_19=="afterbegin"){
el.insertBefore(_1c,el.firstChild);
return _1c;
}else{
if(_19=="beforeend"){
el.appendChild(_1c);
return _1c;
}else{
if(_19=="afterend"){
el.parentNode.insertBefore(_1c,el.nextSibling);
return _1c;
}
}
}
}
}
this.insertHtml=function(_1d,el,_1f){
_1d=_1d.toLowerCase();
if(el.insertAdjacentHTML){
var tag=el.tagName.toLowerCase();
if(tag=="table"||tag=="tbody"||tag=="tr"){
return insertIntoTable(tag,_1d,el,_1f);
}
if(_1d=="beforebegin"){
el.insertAdjacentHTML(_1d,_1f);
return el.previousSibling;
}else{
if(_1d=="afterbegin"){
el.insertAdjacentHTML(_1d,_1f);
return el.firstChild;
}else{
if(_1d=="beforeend"){
el.insertAdjacentHTML(_1d,_1f);
return el.lastChild;
}else{
if(_1d=="afterend"){
el.insertAdjacentHTML(_1d,_1f);
return el.nextSibling;
}
}
}
}
throw "Illegal insertion point -> \""+_1d+"\"";
}
var _21=el.ownerDocument.createRange();
var _22;
if(_1d=="beforebegin"){
_21.setStartBefore(el);
_22=_21.createContextualFragment(_1f);
el.parentNode.insertBefore(_22,el);
return el.previousSibling;
}else{
if(_1d=="afterbegin"){
_21.selectNodeContents(el);
_21.collapse(true);
_22=_21.createContextualFragment(_1f);
el.insertBefore(_22,el.firstChild);
return el.firstChild;
}else{
if(_1d=="beforeend"){
_21.selectNodeContents(el);
_21.collapse(false);
_22=_21.createContextualFragment(_1f);
el.appendChild(_22);
return el.lastChild;
}else{
if(_1d=="afterend"){
_21.setStartAfter(el);
_22=_21.createContextualFragment(_1f);
el.parentNode.insertBefore(_22,el.nextSibling);
return el.nextSibling;
}else{
throw "Illegal insertion point -> \""+_1d+"\"";
}
}
}
}
};
this.insertBefore=function(el,o,_25){
el=YAHOO.util.Dom.get(el);
var _26;
if(this.useDom){
_26=createDom(o,null);
el.parentNode.insertBefore(_26,el);
}else{
var _27=createHtml(o);
_26=this.insertHtml("beforeBegin",el,_27);
}
return _25?YAHOO.ext.Element.get(_26,true):_26;
};
this.insertAfter=function(el,o,_2a){
el=YAHOO.util.Dom.get(el);
var _2b;
if(this.useDom){
_2b=createDom(o,null);
el.parentNode.insertBefore(_2b,el.nextSibling);
}else{
var _2c=createHtml(o);
_2b=this.insertHtml("afterEnd",el,_2c);
}
return _2a?YAHOO.ext.Element.get(_2b,true):_2b;
};
this.append=function(el,o,_2f){
el=YAHOO.util.Dom.get(el);
var _30;
if(this.useDom){
_30=createDom(o,null);
el.appendChild(_30);
}else{
var _31=createHtml(o);
_30=this.insertHtml("beforeEnd",el,_31);
}
return _2f?YAHOO.ext.Element.get(_30,true):_30;
};
this.overwrite=function(el,o,_34){
el=YAHOO.util.Dom.get(el);
el.innerHTML=createHtml(o);
return _34?YAHOO.ext.Element.get(el.firstChild,true):el.firstChild;
};
this.createTemplate=function(o){
var _36=createHtml(o);
return new YAHOO.ext.DomHelper.Template(_36);
};
}();
YAHOO.ext.DomHelper.Template=function(_37){
this.html=_37;
this.re=/\{(\w+)\}/g;
};
YAHOO.ext.DomHelper.Template.prototype={applyTemplate:function(_38){
if(this.compiled){
return this.compiled(_38);
}
var _39="";
var fn=function(_3b,_3c){
if(typeof _38[_3c]!="undefined"){
return _38[_3c];
}else{
return _39;
}
};
return this.html.replace(this.re,fn);
},compile:function(){
var _3d=this.html;
var re=/\{(\w+)\}/g;
var _3f=[];
_3f.push("this.compiled = function(values){ return ");
var _40;
var _41=0;
while((_40=re.exec(_3d))!=null){
_3f.push("'",_3d.substring(_41,_40.index),"' + ");
_3f.push("values['",_3d.substring(_40.index+1,re.lastIndex-1),"'] + ");
_41=re.lastIndex;
}
_3f.push("'",_3d.substr(_41),"';};");
eval(_3f.join(""));
},insertBefore:function(el,_43,_44){
el=YAHOO.util.Dom.get(el);
var _45=YAHOO.ext.DomHelper.insertHtml("beforeBegin",el,this.applyTemplate(_43));
return _44?YAHOO.ext.Element.get(_45,true):_45;
},insertAfter:function(el,_47,_48){
el=YAHOO.util.Dom.get(el);
var _49=YAHOO.ext.DomHelper.insertHtml("afterEnd",el,this.applyTemplate(_47));
return _48?YAHOO.ext.Element.get(_49,true):_49;
},append:function(el,_4b,_4c){
el=YAHOO.util.Dom.get(el);
var _4d=YAHOO.ext.DomHelper.insertHtml("beforeEnd",el,this.applyTemplate(_4b));
return _4c?YAHOO.ext.Element.get(_4d,true):_4d;
},overwrite:function(el,_4f,_50){
el=YAHOO.util.Dom.get(el);
el.innerHTML="";
var _51=YAHOO.ext.DomHelper.insertHtml("beforeEnd",el,this.applyTemplate(_4f));
return _50?YAHOO.ext.Element.get(_51,true):_51;
}};
YAHOO.ext.Template=YAHOO.ext.DomHelper.Template;

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

var eidogo={};

eidogo.gameTreeIdCounter=1;
eidogo.gameNodeIdCounter=1;
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
},loadJson:function(_5){
for(var _6 in _5){
this.setProperty(_6,_5[_6]);
}
},getProperties:function(){
var _7={};
for(var _8 in this){
if(_8!="reserved"&&(typeof this[_8]=="string"||this[_8] instanceof Array)){
_7[_8]=this[_8];
}
}
return _7;
},getMove:function(){
if(typeof this.W!="undefined"){
return this.W;
}else{
if(typeof this.B!="undefined"){
return this.B;
}
}
return null;
},getPosition:function(){
for(var i=0;i<this.parent.nodes.length;i++){
if(this.parent.nodes[i].id==this.id){
return i;
}
}
return null;
}};
eidogo.GameTree=function(_a){
this.init(_a);
};
eidogo.GameTree.prototype={init:function(_b){
this.id=eidogo.gameTreeIdCounter++;
this.nodes=[];
this.trees=[];
this.parent=null;
this.preferredTree=0;
if(typeof _b!="undefined"){
this.loadJson(_b);
}
if(!this.nodes.length){
this.appendNode(new eidogo.GameNode());
}
},appendNode:function(_c){
_c.parent=this;
if(this.nodes.length){
_c.previousSibling=this.nodes.last();
_c.previousSibling.nextSibling=_c;
}
this.nodes.push(_c);
},appendTree:function(_d){
_d.parent=this;
this.trees.push(_d);
},loadJson:function(_e){
for(var i=0;i<_e.nodes.length;i++){
this.appendNode(new eidogo.GameNode(_e.nodes[i]));
}
for(var i=0;i<_e.trees.length;i++){
this.appendTree(new eidogo.GameTree(_e.trees[i]));
}
if(_e.id){
this.id=_e.id;
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
}};
eidogo.GameCursor=function(_11){
this.init(_11);
};
eidogo.GameCursor.prototype={init:function(_12){
this.node=_12;
},nextNode:function(){
if(this.node.nextSibling!=null){
this.node=this.node.nextSibling;
return true;
}else{
return false;
}
},next:function(_13){
if(!this.hasNext()){
return false;
}
if((typeof _13=="undefined"||_13==null)&&this.node.nextSibling!=null){
this.node=this.node.nextSibling;
}else{
if(this.node.parent.trees.length){
if(typeof _13=="undefined"||_13==null){
_13=this.node.parent.preferredTree;
}else{
this.node.parent.preferredTree=_13;
}
this.node=this.node.parent.trees[_13].nodes.first();
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
var _14=[];
var _15=new eidogo.GameCursor(this.node);
var _16=prevId=_15.node.parent.id;
_14.push(_15.node.getPosition());
_14.push(_15.node.parent.getPosition());
while(_15.previous()){
_16=_15.node.parent.id;
if(prevId!=_16){
_14.push(_15.node.parent.getPosition());
prevId=_16;
}
}
return _14.reverse();
}};

eidogo.SGF=function(_1){
this.init(_1);
};
eidogo.SGF.prototype={init:function(_2){
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
}
_8[i]+=this.getChar();
this.nextChar();
}
i++;
if(this.getChar()=="]"){
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
},addMarker:function(pt,_e){
this.markers[pt.y*this.boardSize+pt.x]=_e;
},getMarker:function(pt){
return this.markers[pt.y*this.boardSize+pt.x];
},render:function(_10){
var _11=this.makeBoardArray(null);
var _12=this.makeBoardArray(null);
var _13,_14;
if(!_10&&this.cache.last()){
for(var i=0;i<this.stones.length;i++){
if(this.cache.last().stones[i]!=this.lastRender.stones[i]){
_11[i]=this.cache.last().stones[i];
}
}
_12=this.markers;
}else{
_11=this.stones;
_12=this.markers;
}
for(var x=0;x<this.boardSize;x++){
for(var y=0;y<this.boardSize;y++){
var _18=y*this.boardSize+x;
if(_11[_18]==null){
continue;
}else{
if(_11[_18]==this.EMPTY){
_13="empty";
}else{
_13=(_11[_18]==this.WHITE?"white":"black");
}
}
this.renderer.renderStone({x:x,y:y},_13);
this.lastRender.stones[_18]=_11[_18];
}
}
for(var x=0;x<this.boardSize;x++){
for(var y=0;y<this.boardSize;y++){
var _18=y*this.boardSize+x;
if(_12[_18]==null){
continue;
}
this.renderer.renderMarker({x:x,y:y},_12[_18]);
this.lastRender.markers[_18]=_12[_18];
}
}
}};
eidogo.BoardRendererHtml=function(_19,_1a){
this.init(_19,_1a);
};
eidogo.BoardRendererHtml.prototype={pointWidth:19,pointHeight:19,margin:5,init:function(_1b,_1c){
if(!_1b){
throw "No DOM container";
return;
}
this.boardSize=_1c||19;
var _1d=document.createElement("div");
_1d.className="board size"+this.boardSize;
_1b.appendChild(_1d);
this.domNode=_1d;
this.renderCache={stones:[].setLength(this.boardSize,0).addDimension(this.boardSize,0),markers:[].setLength(this.boardSize,0).addDimension(this.boardSize,0)};
this.pointTpl=new YAHOO.ext.DomHelper.Template("<div id=\"{id}\" class=\"{cls}\" style=\"left: {left}; top: {top};\">{text}</div>");
this.pointTpl.compile();
},clear:function(){
this.domNode.innerHTML="";
},renderStone:function(pt,_1f){
var _20=document.getElementById("stone-"+pt.x+"-"+pt.y);
if(_20){
_20.parentNode.removeChild(_20);
}
if(_1f!="empty"){
this.pointTpl.append(this.domNode,{id:"stone-"+pt.x+"-"+pt.y,cls:"point stone "+_1f,left:(pt.x*this.pointWidth+this.margin)+"px",top:(pt.y*this.pointHeight+this.margin)+"px",text:""});
}
},renderMarker:function(pt,_22){
if(this.renderCache.markers[pt.x][pt.y]){
marker=document.getElementById("marker-"+pt.x+"-"+pt.y);
if(marker){
marker.parentNode.removeChild(marker);
}
}
if(_22=="empty"||!_22){
this.renderCache.markers[pt.x][pt.y]=0;
return;
}
this.renderCache.markers[pt.x][pt.y]=1;
if(_22){
var _23="";
switch(_22){
case "triangle":
case "square":
case "circle":
case "ex":
case "territory-white":
case "territory-black":
case "current":
break;
default:
if(_22.indexOf("var:")==0){
_23=_22.substring(4);
_22="variation";
}else{
_23=_22;
_22="label";
}
break;
}
this.pointTpl.append(this.domNode,{id:"marker-"+pt.x+"-"+pt.y,cls:"point marker "+_22,left:(pt.x*this.pointWidth+this.margin)+"px",top:(pt.y*this.pointHeight+this.margin)+"px",text:_23});
}
}};
eidogo.BoardRendererAscii=function(_24,_25){
this.init(_24,_25);
};
eidogo.BoardRendererAscii.prototype={pointWidth:2,pointHeight:1,margin:1,blankBoard:"+-------------------------------------+\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"+-------------------------------------+",init:function(_26,_27){
this.domNode=_26||null;
this.boardSize=_27||19;
this.content=this.blankBoard;
},clear:function(){
this.content=this.blankBoard;
this.domNode.innerHTML="<pre>"+this.content+"</pre>";
},renderStone:function(pt,_29){
var _2a=(this.pointWidth*this.boardSize+this.margin*2)*(pt.y*this.pointHeight+1)+(pt.x*this.pointWidth)+2;
this.content=this.content.substring(0,_2a-1)+"."+this.content.substring(_2a);
if(_29!="empty"){
this.content=this.content.substring(0,_2a-1)+(_29=="white"?"O":"#")+this.content.substring(_2a);
}
this.domNode.innerHTML="<pre>"+this.content+"</pre>";
},renderMarker:function(pt,_2c){
}};

eidogo.Rules=function(_1){
this.init(_1);
};
eidogo.Rules.prototype={init:function(_2){
this.board=_2;
this.pendingCaptures=[];
},apply:function(pt,_4){
var _5=this.doCaptures(pt,_4);
_4=_4==this.board.WHITE?"W":"B";
this.board.captures[_4]+=_5;
},doCaptures:function(pt,_7){
var _8=0;
_8+=this.doCapture({x:pt.x-1,y:pt.y},_7);
_8+=this.doCapture({x:pt.x+1,y:pt.y},_7);
_8+=this.doCapture({x:pt.x,y:pt.y-1},_7);
_8+=this.doCapture({x:pt.x,y:pt.y+1},_7);
_8+=this.doCapture(pt,-_7);
return _8;
},doCapture:function(pt,_a){
var x,y;
var _d=this.board.boardSize;
if(pt.x<0||pt.y<0||pt.x>=_d||pt.y>=_d){
return 0;
}
if(this.board.getStone(pt)==_a){
return 0;
}
this.pendingCaptures=[];
if(this.doCaptureRecurse(pt,_a)){
return 0;
}
var _e=this.pendingCaptures.length;
while(this.pendingCaptures.length){
this.board.addStone(this.pendingCaptures.pop(),this.board.EMPTY);
}
return _e;
},doCaptureRecurse:function(pt,_10){
if(pt.x<0||pt.y<0||pt.x>=this.board.boardSize||pt.y>=this.board.boardSize){
return 0;
}
if(this.board.getStone(pt)==_10){
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
if(this.doCaptureRecurse({x:pt.x-1,y:pt.y},_10)){
return 1;
}
if(this.doCaptureRecurse({x:pt.x+1,y:pt.y},_10)){
return 1;
}
if(this.doCaptureRecurse({x:pt.x,y:pt.y-1},_10)){
return 1;
}
if(this.doCaptureRecurse({x:pt.x,y:pt.y+1},_10)){
return 1;
}
return 0;
}};

eidogo.Player=function(_1){
this.init(_1);
};
eidogo.Player.prototype={infoLabels:{GN:"Game",PW:"White",WR:"White rank",WT:"White team",PB:"Black",BR:"Black rank",BT:"Black team",HA:"Handicap",KM:"Komi",RE:"Result",DT:"Date",GC:"Info",PC:"Place",EV:"Event",RO:"Round",OT:"Overtime",ON:"Opening",RU:"Ruleset",AN:"Annotator",CP:"Copyright",SO:"Source",TM:"Time limit",US:"Transcriber",AP:"Created with"},months:["January","February","March","April","May","June","July","August","September","October","November","December"],init:function(_2){
_2=_2||{};
this.mode=_2.mode?_2.mode:"replay";
this.dom={};
this.dom.container=document.getElementById(_2.domId);
if(!this.dom.container){
alert("Error finding DOM container.");
return;
}
this.uniq=Math.round(10000*Math.random());
this.gameTree=new eidogo.GameTree();
this.cursor=new eidogo.GameCursor();
this.progressiveLoad=_2.progressiveLoad?true:false;
this.progressiveLoads=null;
this.progressiveUrl=null;
this.board=null;
this.rules=null;
this.currentColor=null;
this.moveNumber=null;
this.totalMoves=null;
this.variations=null;
this.prefs={};
this.prefs.markCurrent=typeof _2.markCurrent!="undefined"?_2.markCurrent:true;
this.prefs.markNext=typeof _2.markNext!="undefined"?_2.markNext:false;
this.prefs.markVariations=typeof _2.markVariations!="undefined"?_2.markVariations:true;
this.prefs.showGameInfo=typeof _2.showGameInfo!="undefined"?_2.showGameInfo:true;
this.prefs.showPlayerInfo=typeof _2.showPlayerInfo!="undefined"?_2.showPlayerInfo:true;
this.propertyHandlers={W:this.playMove,B:this.playMove,AW:this.addStone,AB:this.addStone,AE:this.addStone,CR:this.addMarker,LB:this.addMarker,TR:this.addMarker,MA:this.addMarker,SQ:this.addMarker,TW:this.addMarker,TB:this.addMarker,C:this.showComments};
this.slider=null;
this.constructDom();
this.nowLoading();
this.loadPath=_2.loadPath&&_2.loadPath.length>1?_2.loadPath:[0,0];
if(typeof _2.sgf=="string"){
var _3=new eidogo.SGF(_2.sgf);
this.load(_3.tree);
}else{
if(typeof _2.sgf=="object"){
this.load(_2.sgf);
}else{
if(typeof _2.sgfUrl=="string"){
this.remoteLoad(_2.sgfUrl);
if(_2.progressiveLoad){
this.progressiveLoads=0;
this.progressiveUrl=_2.progressiveUrl||_2.sgfUrl.replace(/\?.+$/,"");
}
}else{
this.croak("No game data provided.");
return;
}
}
}
},createBoard:function(_4){
_4=_4||19;
try{
this.board=new eidogo.Board(new eidogo.BoardRendererHtml(document.getElementById("board-container-"+this.uniq),_4));
}
catch(e){
if(e=="No DOM container"){
this.croak("Error loading board container.");
return;
}
}
this.rules=new eidogo.Rules(this.board);
YAHOO.util.Event.on(this.board.renderer.domNode,"click",this.handleBoardClick,this,true);
YAHOO.util.Event.on(document,"keydown",this.handleKeypress,this,true);
},initGame:function(_5){
var _6=_5.trees.first().nodes.first().SZ;
this.createBoard(_6||19);
this.reset(true);
this.totalMoves=0;
var _7=new eidogo.GameCursor(this.cursor.node);
while(_7.next()){
this.totalMoves++;
}
this.totalMoves--;
this.showInfo();
if(this.prefs.showPlayerInfo){
this.dom.infoPlayers.style.display="block";
}
this.enableNavSlider();
},load:function(_8,_9){
_9=_9||this.gameTree;
_9.loadJson(_8);
_9.cached=true;
this.doneLoading();
if(!_9.parent){
this.initGame(_9);
}else{
this.progressiveLoads--;
}
if(this.loadPath.length){
this.goTo(this.loadPath,false);
}else{
this.refresh();
}
},remoteLoad:function(_a,_b){
YAHOO.util.Connect.asyncRequest("GET",_a,{success:function(o){
if(o.responseText.charAt(0)=="("){
var _d=new eidogo.SGF(o.responseText);
this.load(_d.tree,_b);
}else{
if(o.responseText.charAt(0)=="{"){
eval("var data = "+o.responseText);
this.load(data,_b);
}else{
this.croak("Received invalid game data.");
}
}
},failure:function(o){
this.croak("There was a problem retrieving the game data:\n\n"+o.statusText);
},scope:this,timeout:10000},null);
},goTo:function(_f,_10){
_10=typeof _10!="undefined"?_10:true;
if(_f instanceof Array){
if(!_f.length){
return;
}
if(_10){
this.reset(true);
}
while(_f.length){
var _11=parseInt(_f.shift());
if(_f.length==0){
for(var i=0;i<_11;i++){
this.variation(null,true);
}
}else{
if(_f.length){
this.variation(_11,true);
if(_f.length!=1){
while(this.cursor.nextNode()){
this.execNode(true);
}
}
if(_f.length>1&&this.progressiveLoads){
return;
}
}
}
}
this.refresh();
}else{
if(!isNaN(parseInt(_f))){
var _13=parseInt(_f);
if(_10){
this.reset(true);
_13++;
}
for(var i=0;i<_13;i++){
this.variation(null,true);
}
this.refresh();
}else{
alert("Don't know how to get to '"+_f+"'!");
}
}
},reset:function(_14,_15){
this.board.reset();
this.currentColor="B";
this.moveNumber=0;
if(_15){
this.cursor.node=this.gameTree.trees.first().nodes.first();
}else{
this.cursor.node=this.gameTree.nodes.first();
}
this.refresh(_14);
},refresh:function(_16){
if(this.progressiveLoads){
var me=this;
setTimeout(function(){
me.refresh.call(me);
},10);
return;
}
this.board.revert(1);
this.moveNumber--;
if(this.moveNumber<0){
this.moveNumber=0;
}
this.execNode(_16);
},variation:function(_18,_19){
if(this.cursor.next(_18)){
this.execNode(_19);
if(this.progressiveLoads){
return false;
}
return true;
}
return false;
},execNode:function(_1a){
if(this.progressiveLoads){
var me=this;
setTimeout(function(){
me.execNode.call(me,_1a);
},10);
return;
}
if(!_1a){
this.dom.comments.innerHTML="";
this.board.clearMarkers();
}
var _1c=this.cursor.node.getProperties();
for(var _1d in _1c){
if(this.propertyHandlers[_1d]){
(this.propertyHandlers[_1d]).apply(this,[this.cursor.node[_1d],_1d,_1a]);
}
}
if(_1a){
this.board.commit();
}else{
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
var _1e=this.cursor.node.parent.trees;
for(var i=0;i<_1e.length;i++){
this.variations.push({move:_1e[i].nodes.first().getMove(),treeNum:i});
}
}
},back:function(e,obj,_22){
if(this.cursor.previous()){
this.board.revert(1);
this.moveNumber-=1;
if(this.moveNumber<0){
this.moveNumber=0;
}
this.refresh(_22);
}
},forward:function(e,obj,_25){
this.variation(null,_25);
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
},handleBoardClick:function(e){
var _28=YAHOO.util.Dom.getXY(this.board.renderer.domNode);
var x=Math.round((e.clientX-_28[0]-this.board.renderer.margin-(this.board.renderer.pointWidth/2))/this.board.renderer.pointWidth);
var y=Math.round((e.clientY-_28[1]-this.board.renderer.margin-(this.board.renderer.pointHeight/2))/this.board.renderer.pointHeight);
for(var i=0;i<this.variations.length;i++){
var _2c=this.sgfCoordToPoint(this.variations[i].move);
if(_2c.x==x&&_2c.y==y){
this.variation(this.variations[i].treeNum);
YAHOO.util.Event.stopEvent(e);
return;
}
}
},handleKeypress:function(e){
var _2e=e.keyCode||YAHOO.util.Event.getCharCode(e);
if(!_2e||e.ctrlKey||e.altKey||e.metaKey){
return true;
}
var _2f=String.fromCharCode(_2e).toLowerCase();
for(var i=0;i<this.variations.length;i++){
var _31=this.sgfCoordToPoint(this.variations[i].move);
var _32=""+(i+1);
if(_31.x!=null&&this.board.getMarker(_31)!=this.board.EMPTY&&typeof this.board.getMarker(_31)=="string"){
_32=this.board.getMarker(_31).toLowerCase();
}
_32=_32.replace(/^var:/,"");
if(_2f==_32.charAt(0)){
this.variation(this.variations[i].treeNum);
YAHOO.util.Event.stopEvent(e);
return;
}
}
var _33=true;
switch(_2e){
case 32:
if(e.shiftKey){
this.back();
}else{
this.forward();
}
break;
case 39:
if(e.shiftKey){
var _34=this.totalMoves-this.moveNumber;
var _35=(_34>9?9:_34-1);
for(var i=0;i<_35;i++){
this.forward(null,null,true);
}
}
this.forward();
break;
case 37:
if(e.shiftKey){
var _35=(this.moveNumber>9?9:this.moveNumber-1);
for(var i=0;i<_35;i++){
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
_33=false;
break;
}
if(_33){
YAHOO.util.Event.stopEvent(e);
}
},showInfo:function(){
var _36=this.gameTree.trees.first().nodes.first();
var dl=document.createElement("dl");
for(var _38 in this.infoLabels){
if(_36[_38]){
if(_38=="PW"){
this.dom.playerW.name.innerHTML=_36[_38]+(_36["WR"]?", "+_36["WR"]:"");
continue;
}else{
if(_38=="PB"){
this.dom.playerB.name.innerHTML=_36[_38]+(_36["BR"]?", "+_36["BR"]:"");
continue;
}
}
if(_38=="WR"||_38=="BR"){
continue;
}
if(_38=="DT"){
var _39=_36[_38].split(/[\.-]/);
_36[_38]=_39[2].replace(/^0+/,"")+" "+this.months[_39[1]-1]+" "+_39[0];
}
var dt=document.createElement("dt");
dt.innerHTML=this.infoLabels[_38]+":";
var dd=document.createElement("dd");
dd.innerHTML=_36[_38];
dl.appendChild(dt);
dl.appendChild(dd);
}
}
if(this.prefs.showGameInfo){
this.dom.infoGame.appendChild(dl);
}
},updateControls:function(){
if(this.moveNumber){
this.dom.moveNumber.innerHTML="move "+this.moveNumber;
}else{
this.dom.moveNumber.innerHTML="";
}
this.dom.playerW.captures.innerHTML="Captures: <span>"+this.board.captures.W+"</span>";
this.dom.playerB.captures.innerHTML="Captures: <span>"+this.board.captures.B+"</span>";
YAHOO.util.Dom.removeClass(this.dom.controls.pass,"pass-on");
this.dom.variations.innerHTML="";
for(var i=0;i<this.variations.length;i++){
var _3d=i+1;
if(!this.variations[i].move||this.variations[i].move=="tt"){
YAHOO.util.Dom.addClass(this.dom.controls.pass,"pass-on");
}else{
var _3e=this.sgfCoordToPoint(this.variations[i].move);
if(this.board.getMarker(_3e)!=this.board.EMPTY){
_3d=this.board.getMarker(_3e);
}
if(this.prefs.markVariations){
this.board.addMarker(_3e,"var:"+_3d);
}
}
var _3f=document.createElement("div");
_3f.className="variation-nav";
_3f.innerHTML=_3d;
YAHOO.util.Event.on(_3f,"click",function(e,arg){
arg.me.variation(arg.treeNum);
},{me:this,treeNum:this.variations[i].treeNum});
this.dom.variations.appendChild(_3f);
}
if(!this.variations.length){
this.dom.variations.innerHTML="<div class='variation-nav none'>none</div>";
}
if(this.cursor.hasNext()){
YAHOO.util.Dom.addClass(this.dom.controls.forward,"forward-on");
YAHOO.util.Dom.addClass(this.dom.controls.last,"last-on");
}else{
YAHOO.util.Dom.removeClass(this.dom.controls.forward,"forward-on");
YAHOO.util.Dom.removeClass(this.dom.controls.last,"last-on");
}
if(this.cursor.hasPrevious()){
YAHOO.util.Dom.addClass(this.dom.controls.back,"back-on");
YAHOO.util.Dom.addClass(this.dom.controls.first,"first-on");
}else{
YAHOO.util.Dom.removeClass(this.dom.controls.back,"back-on");
YAHOO.util.Dom.removeClass(this.dom.controls.first,"first-on");
}
var _42=this.dom.slider.offsetWidth-this.dom.sliderThumb.offsetWidth;
this.sliderIgnore=true;
this.slider.setValue(this.moveNumber/this.totalMoves*_42);
this.sliderIgnore=false;
},toggleCurrentColor:function(){
this.currentColor=="B"?"W":"B";
},playMove:function(_43,_44,_45){
this.toggleCurrentColor();
this.moveNumber++;
if(_43&&_43!="tt"){
var pt=this.sgfCoordToPoint(_43);
_44=_44=="W"?this.board.WHITE:this.board.BLACK;
this.board.addStone(pt,_44);
this.rules.apply(pt,_44);
if(this.prefs.markCurrent){
this.addMarker(_43,"current");
}
}else{
if(!_45){
this.dom.comments.innerHTML="<div class='comment-pass'>"+(_44=="W"?"White":"Black")+" passed</div>"+this.dom.comments.innerHTML;
}
}
},addStone:function(_47,_48){
if(!(_47 instanceof Array)){
_47=[_47];
}
for(var i=0;i<_47.length;i++){
this.board.addStone(this.sgfCoordToPoint(_47[i]),_48=="AW"?this.board.WHITE:_48=="AB"?this.board.BLACK:this.board.EMPTY);
}
},addMarker:function(_4a,_4b){
if(!(_4a instanceof Array)){
_4a=[_4a];
}
var _4c;
for(var i=0;i<_4a.length;i++){
switch(_4b){
case "TR":
_4c="triangle";
break;
case "SQ":
_4c="square";
break;
case "CR":
_4c="circle";
break;
case "MA":
_4c="ex";
break;
case "TW":
_4c="territory-white";
break;
case "TB":
_4c="territory-black";
break;
case "LB":
_4c=(_4a[i].split(":"))[1];
_4a[i];
break;
default:
_4c=_4b;
break;
}
this.board.addMarker(this.sgfCoordToPoint((_4a[i].split(":"))[0]),_4c);
}
},showComments:function(_4e,_4f,_50){
if(!_4e||_50){
return;
}
this.dom.comments.innerHTML+=_4e.replace(/\n/g,"<br />");
},constructDom:function(){
YAHOO.ext.DomHelper.append(this.dom.container,{tag:"div",id:"player-"+this.uniq,cls:"eidogo-player",children:[{tag:"div",id:"controls-container-"+this.uniq,cls:"controls-container",children:[{tag:"ul",id:"controls-"+this.uniq,cls:"controls",children:[{tag:"li",id:"control-first-"+this.uniq,cls:"control first",html:"First"},{tag:"li",id:"control-back-"+this.uniq,cls:"control back",html:"Back"},{tag:"li",id:"control-forward-"+this.uniq,cls:"control forward",html:"Forward"},{tag:"li",id:"control-last-"+this.uniq,cls:"control last",html:"Last"},{tag:"li",id:"control-pass-"+this.uniq,cls:"control pass",html:"Pass"}]},{tag:"div",id:"move-number-"+this.uniq,cls:"move-number"},{tag:"div",id:"nav-slider-"+this.uniq,cls:"nav-slider",children:[{tag:"div",id:"nav-slider-thumb-"+this.uniq,cls:"nav-slider-thumb"}]},{tag:"div",id:"variations-container-"+this.uniq,cls:"variations-container",children:[{tag:"div",id:"variations-label"+this.uniq,cls:"variations-label",html:"Variations: "},{tag:"div",id:"variations-"+this.uniq,cls:"variations"}]}]},{tag:"div",id:"comments-"+this.uniq,cls:"comments"},{tag:"div",id:"board-container-"+this.uniq,cls:"board-container"},{tag:"div",id:"info-"+this.uniq,cls:"info",children:[{tag:"div",id:"info-players-"+this.uniq,cls:"players",children:[{tag:"div",id:"white-"+this.uniq,cls:"player white",children:[{tag:"div",id:"white-name-"+this.uniq,cls:"name"},{tag:"div",id:"white-captures-"+this.uniq,cls:"captures"},{tag:"div",id:"white-time-"+this.uniq,cls:"time"}]},{tag:"div",id:"white-"+this.uniq,cls:"player black",children:[{tag:"div",id:"black-name-"+this.uniq,cls:"name"},{tag:"div",id:"black-captures-"+this.uniq,cls:"captures"},{tag:"div",id:"black-time-"+this.uniq,cls:"time"}]}]},{tag:"div",id:"info-game-"+this.uniq,cls:"game"}]}]});
this.dom.player=document.getElementById("player-"+this.uniq);
this.dom.comments=document.getElementById("comments-"+this.uniq);
this.dom.info=document.getElementById("info-"+this.uniq);
this.dom.infoGame=document.getElementById("info-game-"+this.uniq);
this.dom.infoPlayers=document.getElementById("info-players-"+this.uniq);
this.dom.playerW={};
this.dom.playerW.name=document.getElementById("white-name-"+this.uniq);
this.dom.playerW.captures=document.getElementById("white-captures-"+this.uniq);
this.dom.playerW.time=document.getElementById("white-time-"+this.uniq);
this.dom.playerB={};
this.dom.playerB.name=document.getElementById("black-name-"+this.uniq);
this.dom.playerB.captures=document.getElementById("black-captures-"+this.uniq);
this.dom.playerB.time=document.getElementById("black-time-"+this.uniq);
this.dom.moveNumber=document.getElementById("move-number-"+this.uniq);
YAHOO.util.Event.on(this.dom.moveNumber,"click",this.setPermalink,this,true);
this.dom.variations=document.getElementById("variations-"+this.uniq);
this.dom.controls={};
this.dom.controls.first=document.getElementById("control-first-"+this.uniq);
YAHOO.util.Event.on(this.dom.controls.first,"click",this.first,this,true);
this.dom.controls.back=document.getElementById("control-back-"+this.uniq);
YAHOO.util.Event.on(this.dom.controls.back,"click",this.back,this,true);
this.dom.controls.forward=document.getElementById("control-forward-"+this.uniq);
YAHOO.util.Event.on(this.dom.controls.forward,"click",this.forward,this,true);
this.dom.controls.last=document.getElementById("control-last-"+this.uniq);
YAHOO.util.Event.on(this.dom.controls.last,"click",this.last,this,true);
this.dom.controls.pass=document.getElementById("control-pass-"+this.uniq);
YAHOO.util.Event.on(this.dom.controls.pass,"click",this.pass,this,true);
this.dom.slider=document.getElementById("nav-slider-"+this.uniq);
this.dom.sliderThumb=document.getElementById("nav-slider-thumb-"+this.uniq);
},enableNavSlider:function(){
if(!this.progressiveLoad){
this.dom.slider.style.display="block";
}
this.slider=YAHOO.widget.Slider.getHorizSlider(this.dom.slider.id,this.dom.sliderThumb.id,0,300);
this.slider.animate=false;
this.slider.enableKeys=false;
this.slider.subscribe("change",function(_51){
if(this.sliderIgnore){
return;
}
var _52=this.dom.slider.offsetWidth-this.dom.sliderThumb.offsetWidth;
this.sliderOffset=parseInt(_51/_52*this.totalMoves);
},null,this);
this.slider.subscribe("slideEnd",function(){
if(this.sliderIgnore){
return;
}
if(this.totalMoves){
var _53=this.sliderOffset-this.moveNumber;
for(var i=0;i<Math.abs(_53);i++){
if(_53>0){
this.variation(null,true);
}else{
if(_53<0){
this.cursor.previous();
this.moveNumber--;
}
}
}
if(_53<0){
if(this.moveNumber<0){
this.moveNumber=0;
}
this.board.revert(Math.abs(_53));
}
this.refresh();
}
},null,this);
},sgfCoordToPoint:function(_55){
if(!_55||_55=="tt"){
return {x:null,y:null};
}
var _56={a:0,b:1,c:2,d:3,e:4,f:5,g:6,h:7,i:8,j:9,k:10,l:11,m:12,n:13,o:14,p:15,q:16,r:17,s:18};
return {x:_56[_55.charAt(0)],y:_56[_55.charAt(1)]};
},setPermalink:function(){
var _57=/Apple/.test(navigator.vendor)?"":"#";
location.hash=_57+this.cursor.getPath().join(",");
},nowLoading:function(){
if(this.croaked){
return;
}
if(document.getElementById("eidogo-loading-"+this.uniq)){
return;
}
this.domLoading=document.createElement("div");
this.domLoading.id="eidogo-loading-"+this.uniq;
this.domLoading.className="eidogo-loading";
this.domLoading.innerHTML="Loading...";
this.dom.player.appendChild(this.domLoading);
},doneLoading:function(){
if(this.domLoading&&this.domLoading!=null&&this.domLoading.parentNode){
this.domLoading.parentNode.removeChild(this.domLoading);
this.domLoading=null;
}
},croak:function(msg){
this.doneLoading();
YAHOO.ext.DomHelper.append(this.dom.player,{tag:"div",cls:"eidogo-error",html:msg.replace(/\n/g,"<br />")});
this.croaked=true;
}};

