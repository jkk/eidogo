if(typeof deconcept=="undefined"){
var deconcept=new Object();
}
if(typeof deconcept.util=="undefined"){
deconcept.util=new Object();
}
if(typeof deconcept.SWFObjectUtil=="undefined"){
deconcept.SWFObjectUtil=new Object();
}
deconcept.SWFObject=function(_1,id,w,h,_5,c,_7,_8,_9,_a){
if(!document.getElementById){
return;
}
this.DETECT_KEY=_a?_a:"detectflash";
this.skipDetect=deconcept.util.getRequestParameter(this.DETECT_KEY);
this.params=new Object();
this.variables=new Object();
this.attributes=new Array();
if(_1){
this.setAttribute("swf",_1);
}
if(id){
this.setAttribute("id",id);
}
if(w){
this.setAttribute("width",w);
}
if(h){
this.setAttribute("height",h);
}
if(_5){
this.setAttribute("version",new deconcept.PlayerVersion(_5.toString().split(".")));
}
this.installedVer=deconcept.SWFObjectUtil.getPlayerVersion();
if(!window.opera&&document.all&&this.installedVer.major>7){
deconcept.SWFObject.doPrepUnload=true;
}
if(c){
this.addParam("bgcolor",c);
}
var q=_7?_7:"high";
this.addParam("quality",q);
this.setAttribute("useExpressInstall",false);
this.setAttribute("doExpressInstall",false);
var _c=(_8)?_8:window.location;
this.setAttribute("xiRedirectUrl",_c);
this.setAttribute("redirectUrl","");
if(_9){
this.setAttribute("redirectUrl",_9);
}
};
deconcept.SWFObject.prototype={useExpressInstall:function(_d){
this.xiSWFPath=!_d?"expressinstall.swf":_d;
this.setAttribute("useExpressInstall",true);
},setAttribute:function(_e,_f){
this.attributes[_e]=_f;
},getAttribute:function(_10){
return this.attributes[_10];
},addParam:function(_11,_12){
this.params[_11]=_12;
},getParams:function(){
return this.params;
},addVariable:function(_13,_14){
this.variables[_13]=_14;
},getVariable:function(_15){
return this.variables[_15];
},getVariables:function(){
return this.variables;
},getVariablePairs:function(){
var _16=new Array();
var key;
var _18=this.getVariables();
for(key in _18){
_16[_16.length]=key+"="+_18[key];
}
return _16;
},getSWFHTML:function(){
var _19="";
if(navigator.plugins&&navigator.mimeTypes&&navigator.mimeTypes.length){
if(this.getAttribute("doExpressInstall")){
this.addVariable("MMplayerType","PlugIn");
this.setAttribute("swf",this.xiSWFPath);
}
_19="<embed type=\"application/x-shockwave-flash\" src=\""+this.getAttribute("swf")+"\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+this.getAttribute("style")+"\"";
_19+=" id=\""+this.getAttribute("id")+"\" name=\""+this.getAttribute("id")+"\" ";
var _1a=this.getParams();
for(var key in _1a){
_19+=[key]+"=\""+_1a[key]+"\" ";
}
var _1c=this.getVariablePairs().join("&");
if(_1c.length>0){
_19+="flashvars=\""+_1c+"\"";
}
_19+="/>";
}else{
if(this.getAttribute("doExpressInstall")){
this.addVariable("MMplayerType","ActiveX");
this.setAttribute("swf",this.xiSWFPath);
}
_19="<object id=\""+this.getAttribute("id")+"\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+this.getAttribute("style")+"\">";
_19+="<param name=\"movie\" value=\""+this.getAttribute("swf")+"\" />";
var _1d=this.getParams();
for(var key in _1d){
_19+="<param name=\""+key+"\" value=\""+_1d[key]+"\" />";
}
var _1f=this.getVariablePairs().join("&");
if(_1f.length>0){
_19+="<param name=\"flashvars\" value=\""+_1f+"\" />";
}
_19+="</object>";
}
return _19;
},write:function(_20){
if(this.getAttribute("useExpressInstall")){
var _21=new deconcept.PlayerVersion([6,0,65]);
if(this.installedVer.versionIsValid(_21)&&!this.installedVer.versionIsValid(this.getAttribute("version"))){
this.setAttribute("doExpressInstall",true);
this.addVariable("MMredirectURL",escape(this.getAttribute("xiRedirectUrl")));
document.title=document.title.slice(0,47)+" - Flash Player Installation";
this.addVariable("MMdoctitle",document.title);
}
}
if(this.skipDetect||this.getAttribute("doExpressInstall")||this.installedVer.versionIsValid(this.getAttribute("version"))){
var n=(typeof _20=="string")?document.getElementById(_20):_20;
n.innerHTML=this.getSWFHTML();
return true;
}else{
if(this.getAttribute("redirectUrl")!=""){
document.location.replace(this.getAttribute("redirectUrl"));
}
}
return false;
}};
deconcept.SWFObjectUtil.getPlayerVersion=function(){
var _23=new deconcept.PlayerVersion([0,0,0]);
if(navigator.plugins&&navigator.mimeTypes.length){
var x=navigator.plugins["Shockwave Flash"];
if(x&&x.description){
_23=new deconcept.PlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split("."));
}
}else{
if(navigator.userAgent&&navigator.userAgent.indexOf("Windows CE")>=0){
var axo=1;
var _26=3;
while(axo){
try{
_26++;
axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+_26);
_23=new deconcept.PlayerVersion([_26,0,0]);
}
catch(e){
axo=null;
}
}
}else{
try{
var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
}
catch(e){
try{
var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
_23=new deconcept.PlayerVersion([6,0,21]);
axo.AllowScriptAccess="always";
}
catch(e){
if(_23.major==6){
return _23;
}
}
try{
axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
}
catch(e){
}
}
if(axo!=null){
_23=new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));
}
}
}
return _23;
};
deconcept.PlayerVersion=function(_29){
this.major=_29[0]!=null?parseInt(_29[0]):0;
this.minor=_29[1]!=null?parseInt(_29[1]):0;
this.rev=_29[2]!=null?parseInt(_29[2]):0;
};
deconcept.PlayerVersion.prototype.versionIsValid=function(fv){
if(this.major<fv.major){
return false;
}
if(this.major>fv.major){
return true;
}
if(this.minor<fv.minor){
return false;
}
if(this.minor>fv.minor){
return true;
}
if(this.rev<fv.rev){
return false;
}
return true;
};
deconcept.util={getRequestParameter:function(_2b){
var q=document.location.search||document.location.hash;
if(_2b==null){
return q;
}
if(q){
var _2d=q.substring(1).split("&");
for(var i=0;i<_2d.length;i++){
if(_2d[i].substring(0,_2d[i].indexOf("="))==_2b){
return _2d[i].substring((_2d[i].indexOf("=")+1));
}
}
}
return "";
}};
deconcept.SWFObjectUtil.cleanupSWFs=function(){
var _2f=document.getElementsByTagName("OBJECT");
for(var i=_2f.length-1;i>=0;i--){
_2f[i].style.display="none";
for(var x in _2f[i]){
if(typeof _2f[i][x]=="function"){
_2f[i][x]=function(){
};
}
}
}
};
if(deconcept.SWFObject.doPrepUnload){
if(!deconcept.unloadSet){
deconcept.SWFObjectUtil.prepUnload=function(){
__flash_unloadHandler=function(){
};
__flash_savedUnloadHandler=function(){
};
window.attachEvent("onunload",deconcept.SWFObjectUtil.cleanupSWFs);
};
window.attachEvent("onbeforeunload",deconcept.SWFObjectUtil.prepUnload);
deconcept.unloadSet=true;
}
}
if(!document.getElementById&&document.all){
document.getElementById=function(id){
return document.all[id];
};
}
var getQueryParamValue=deconcept.util.getRequestParameter;
var FlashObject=deconcept.SWFObject;
var SWFObject=deconcept.SWFObject;

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

eidogo=window.eidogo||{};

(function(){
var ua=navigator.userAgent.toLowerCase();
var _2=(ua.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[])[1];
eidogo.browser={ua:ua,ver:_2,ie:/msie/.test(ua)&&!/opera/.test(ua),moz:/mozilla/.test(ua)&&!/(compatible|webkit)/.test(ua)};
eidogo.util={byId:function(id){
return document.getElementById(id);
},ajax:function(_4,_5,_6,_7,_8,_9,_a){
_4=_4.toUpperCase();
var _b=window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest();
var qs=null;
if(_6&&typeof _6=="object"){
var _d=[];
for(var _e in _6){
if(_6[_e]&&_6[_e].constructor==Array){
for(var i=0;i<_6[_e].length;i++){
_d.push(encodeURIComponent(_e)+"="+encodeURIComponent(_6[_e]));
}
}else{
_d.push(encodeURIComponent(_e)+"="+encodeURIComponent(_6[_e]));
}
}
qs=_d.join("&").replace(/%20/g,"+");
}
if(qs&&_4=="GET"){
_5+=(_5.match(/\?/)?"&":"?")+qs;
qs=null;
}
_b.open(_4,_5,true);
if(qs){
_b.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
var _10=false;
var _11=/webkit/.test(navigator.userAgent.toLowerCase());
function httpSuccess(r){
try{
return !r.status&&location.protocol=="file:"||(r.status>=200&&r.status<300)||r.status==304||_11&&r.status==undefined;
}
catch(e){
}
return false;
}
function handleReadyState(_13){
if(!_10&&_b&&(_b.readyState==4||_13=="timeout")){
_10=true;
if(_14){
clearInterval(_14);
_14=null;
}
var _15=_13=="timeout"&&"timeout"||!httpSuccess(_b)&&"error"||"success";
if(_15=="success"){
_7.call(_9,_b);
}else{
_8.call(_9);
}
_b=null;
}
}
var _14=setInterval(handleReadyState,13);
if(_a){
setTimeout(function(){
if(_b){
_b.abort();
if(!_10){
handleReadyState("timeout");
}
}
},_a);
}
_b.send(qs);
return _b;
},addEventHelper:function(_16,_17,_18){
if(_16.addEventListener){
_16.addEventListener(_17,_18,false);
}else{
if(!eidogo.util.addEventId){
eidogo.util.addEventId=1;
}
if(!_18.$$guid){
_18.$$guid=eidogo.util.addEventId++;
}
if(!_16.events){
_16.events={};
}
var _19=_16.events[_17];
if(!_19){
_19=_16.events[_17]={};
if(_16["on"+_17]){
_19[0]=_16["on"+_17];
}
}
_19[_18.$$guid]=_18;
_16["on"+_17]=eidogo.util.handleEvent;
}
},handleEvent:function(_1a){
var _1b=true;
_1a=_1a||((this.ownerDocument||this.document||this).parentWindow||window).event;
var _1c=this.events[_1a.type];
for(var i in _1c){
this.$$handleEvent=_1c[i];
if(this.$$handleEvent(_1a)===false){
_1b=false;
}
}
return _1b;
},addEvent:function(el,_1f,_20,arg,_22){
if(_22){
_20=_20.bind(arg);
}else{
if(arg){
var _23=_20;
_20=function(e){
_23(e,arg);
};
}
}
eidogo.util.addEventHelper(el,_1f,_20);
},onClick:function(el,_26,_27){
eidogo.util.addEvent(el,"click",_26,_27,true);
},getElClickXY:function(e,el,_2a){
if(!e.pageX){
e.pageX=e.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft);
e.pageY=e.clientY+(document.documentElement.scrollTop||document.body.scrollTop);
}
var _2b=eidogo.util.getElXY(el,_2a);
return [e.pageX-_2b[0],e.pageY-_2b[1]];
},stopEvent:function(e){
if(!e){
return;
}
if(e.stopPropagation){
e.stopPropagation();
}else{
e.cancelBubble=true;
}
if(e.preventDefault){
e.preventDefault();
}else{
e.returnValue=false;
}
},getTarget:function(ev){
var t=ev.target||ev.srcElement;
return (t&&t.nodeName&&t.nodeName.toUpperCase()=="#TEXT")?t.parentNode:t;
},addClass:function(el,cls){
if(!cls){
return;
}
var ca=cls.split(/\s+/);
for(var i=0;i<ca.length;i++){
if(!eidogo.util.hasClass(el,ca[i])){
el.className+=(el.className?" ":"")+ca[i];
}
}
},removeClass:function(el,cls){
var ca=el.className.split(/\s+/);
var nc=[];
for(var i=0;i<ca.length;i++){
if(ca[i]!=cls){
nc.push(ca[i]);
}
}
el.className=nc.join(" ");
},hasClass:function(el,cls){
var ca=el.className.split(/\s+/);
for(var i=0;i<ca.length;i++){
if(ca[i]==cls){
return true;
}
}
return false;
},show:function(el,_3d){
_3d=_3d||"block";
if(typeof el=="string"){
el=eidogo.util.byId(el);
}
if(!el){
return;
}
el.style.display=_3d;
},hide:function(el){
if(typeof el=="string"){
el=eidogo.util.byId(el);
}
if(!el){
return;
}
el.style.display="none";
},getElXY:function(el,_40){
if(el._x&&el._y){
return [el._x,el._y];
}
var _41=el,elX=0,elY=0,_44=el.parentNode,sx=0,sy=0;
while(_41){
elX+=_41.offsetLeft;
elY+=_41.offsetTop;
_41=_41.offsetParent?_41.offsetParent:null;
}
while(!_40&&_44&&_44.tagName&&!/^body|html$/i.test(_44.tagName)){
sx+=_44.scrollLeft;
sy+=_44.scrollTop;
elX-=_44.scrollLeft;
elY-=_44.scrollTop;
_44=_44.parentNode;
}
el._x=elX;
el._y=elY;
return [elX,elY,sx,sy];
},getElX:function(el){
return this.getElXY(el)[0];
},getElY:function(el){
return this.getElXY(el)[1];
},addStyleSheet:function(_49){
if(document.createStyleSheet){
document.createStyleSheet(_49);
}else{
var _4a=document.createElement("link");
_4a.rel="stylesheet";
_4a.type="text/css";
_4a.href=_49;
document.getElementsByTagName("head")[0].appendChild(_4a);
}
},getPlayerPath:function(){
var _4b=document.getElementsByTagName("script");
var _4c;
var _4d;
for(var i=0;_4d=_4b[i];i++){
if(/(all\.compressed\.js|eidogo\.js)/.test(_4d.src)){
_4c=_4d.src.replace(/\/js\/[^\/]+$/,"");
}
}
return _4c;
}};
})();

eidogo=window.eidogo||{};
eidogo.i18n=eidogo.i18n||{"move":"Move","loading":"Loading","passed":"passed","resigned":"resigned","variations":"Variations","no variations":"none","tool":"Tool","play":"Play","region":"Select Region","add_b":"Black Stone","add_w":"White Stone","edit comment":"Edit Comment","done":"Done","triangle":"Triangle","square":"Square","circle":"Circle","x":"X","letter":"Letter","number":"Number","dim":"Dim","score":"Score","score est":"Score Estimate","search":"Search","search corner":"Corner Search","search center":"Center Search","region info":"Click and drag to select a region.","two stones":"Please select at least two stones to search for.","two edges":"For corner searches, your selection must touch two adjacent edges of the board.","no search url":"No search URL provided.","close search":"close search","matches found":"matches found.","save to server":"Save to Server","download sgf":"Download SGF","next game":"Next Game","previous game":"Previous Game","white":"White","white rank":"White rank","white team":"White team","black":"Black","black rank":"Black rank","black team":"Black team","captures":"captures","time left":"time left","you":"You","game":"Game","handicap":"Handicap","komi":"Komi","result":"Result","date":"Date","info":"Info","place":"Place","event":"Event","round":"Round","overtime":"Overtime","opening":"Openning","ruleset":"Ruleset","annotator":"Annotator","copyright":"Copyright","source":"Source","time limit":"Time limit","transcriber":"Transcriber","created with":"Created with","january":"January","february":"February","march":"March","april":"April","may":"May","june":"June","july":"July","august":"August","september":"September","october":"October","november":"November","december":"December","gw":"Good for White","vgw":"Very good for White","gb":"Good for Black","vgb":"Very good for Black","dm":"Even position","dmj":"Even position (joseki)","uc":"Unclear position","te":"Tesuji","bm":"Bad move","vbm":"Very bad move","do":"Doubtful move","it":"Interesting move","black to play":"Black to play","white to play":"White to play","ho":"Hotspot","dom error":"Error finding DOM container","error retrieving":"There was a problem retrieving the game data.","invalid data":"Received invalid game data","error board":"Error loading board container","unsaved changes":"There are unsaved changes in this game. You must save before you can permalink or download.","bad path":"Don't know how to get to path: ","gnugo thinking":"GNU Go is thinking..."};

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
this[_3]=_4;
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
},getNextMoves:function(){
if(!this.hasNext()){
return null;
}
var _2a={};
if(this.node.nextSibling&&this.node.nextSibling.getMove()){
_2a[this.node.nextSibling.getMove()]=null;
}else{
var _2b=this.node.parent.trees;
var _2c;
for(var i=0;_2c=_2b[i];i++){
_2a[_2c.nodes[0].getMove()]=i;
}
}
return _2a;
},next:function(_2e){
if(!this.hasNext()){
return false;
}
if((typeof _2e=="undefined"||_2e==null)&&this.node.nextSibling!=null){
this.node=this.node.nextSibling;
}else{
if(this.node.parent.trees.length){
if(typeof _2e=="undefined"||_2e==null){
_2e=this.node.parent.preferredTree;
}else{
this.node.parent.preferredTree=_2e;
}
this.node=this.node.parent.trees[_2e].nodes[0];
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
var _2f=[];
var cur=new eidogo.GameCursor(this.node);
var _31=prevId=cur.node.parent.id;
_2f.push(cur.node.getPosition());
_2f.push(cur.node.parent.getPosition());
while(cur.previous()){
_31=cur.node.parent.id;
if(prevId!=_31){
_2f.push(cur.node.parent.getPosition());
prevId=_31;
}
}
return _2f.reverse();
},getPathMoves:function(){
var _32=[];
var cur=new eidogo.GameCursor(this.node);
_32.push(cur.node.getMove());
while(cur.previous()){
var _34=cur.node.getMove();
if(_34){
_32.push(_34);
}
}
return _32.reverse();
}};

eidogo.SgfParser=function(_1,_2){
this.init(_1,_2);
};
eidogo.SgfParser.prototype={init:function(_3,_4){
_4=(typeof _4=="function")?_4:null;
this.sgf=_3;
this.index=0;
this.tree=this.parseTree(null);
_4&&_4.call(this);
},parseTree:function(_5){
var _6={};
_6.nodes=[];
_6.trees=[];
while(this.index<this.sgf.length){
var c=this.sgf.charAt(this.index);
this.index++;
switch(c){
case ";":
_6.nodes.push(this.parseNode());
break;
case "(":
_6.trees.push(this.parseTree(_6));
break;
case ")":
return _6;
break;
}
}
return _6;
},getChar:function(){
return this.sgf.charAt(this.index);
},nextChar:function(){
this.index++;
},parseNode:function(){
var _8={};
var _9="";
var _a=[];
var i=0;
while(this.index<this.sgf.length){
var c=this.getChar();
if(c==";"||c=="("||c==")"){
break;
}
if(this.getChar()=="["){
while(this.getChar()=="["){
this.nextChar();
_a[i]="";
while(this.getChar()!="]"&&this.index<this.sgf.length){
if(this.getChar()=="\\"){
this.nextChar();
while(this.getChar()=="\r"||this.getChar()=="\n"){
this.nextChar();
}
}
_a[i]+=this.getChar();
this.nextChar();
}
i++;
while(this.getChar()=="]"||this.getChar()=="\n"||this.getChar()=="\r"){
this.nextChar();
}
}
if(_8[_9]){
if(!(_8[_9] instanceof Array)){
_8[_9]=[_8[_9]];
}
_8[_9]=_8[_9].concat(_a);
}else{
_8[_9]=_a.length>1?_a:_a[0];
}
_9="";
_a=[];
i=0;
continue;
}
if(c!=" "&&c!="\n"&&c!="\r"&&c!="\t"){
_9+=c;
}
this.nextChar();
}
return _8;
}};

eidogo.Board=function(){
this.init.apply(this,arguments);
};
eidogo.Board.prototype={WHITE:1,BLACK:-1,EMPTY:0,init:function(_1,_2){
this.boardSize=_2||19;
this.stones=this.makeBoardArray(this.EMPTY);
this.markers=this.makeBoardArray(this.EMPTY);
this.captures={};
this.captures.W=0;
this.captures.B=0;
this.cache=[];
this.renderer=_1||new eidogo.BoardRendererHtml();
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
},makeBoardArray:function(_5){
return [].setLength(this.boardSize*this.boardSize,_5);
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
},revert:function(_6){
_6=_6||1;
this.rollback();
for(var i=0;i<_6;i++){
this.cache.pop();
}
this.rollback();
},addStone:function(pt,_9){
this.stones[pt.y*this.boardSize+pt.x]=_9;
},getStone:function(pt){
return this.stones[pt.y*this.boardSize+pt.x];
},getRegion:function(t,l,w,h){
var _f=[].setLength(w*h,this.EMPTY);
var _10;
for(var y=t;y<t+h;y++){
for(var x=l;x<l+w;x++){
_10=(y-t)*w+(x-l);
_f[_10]=this.getStone({x:x,y:y});
}
}
return _f;
},addMarker:function(pt,_14){
this.markers[pt.y*this.boardSize+pt.x]=_14;
},getMarker:function(pt){
return this.markers[pt.y*this.boardSize+pt.x];
},render:function(_16){
var _17=this.makeBoardArray(null);
var _18=this.makeBoardArray(null);
var _19,_1a;
if(!_16&&this.cache.last()){
for(var i=0;i<this.stones.length;i++){
if(this.cache.last().stones[i]!=this.lastRender.stones[i]){
_17[i]=this.cache.last().stones[i];
}
}
_18=this.markers;
}else{
_17=this.stones;
_18=this.markers;
}
var _1c;
for(var x=0;x<this.boardSize;x++){
for(var y=0;y<this.boardSize;y++){
_1c=y*this.boardSize+x;
if(_17[_1c]==null){
continue;
}else{
if(_17[_1c]==this.EMPTY){
_19="empty";
}else{
_19=(_17[_1c]==this.WHITE?"white":"black");
}
}
this.renderer.renderStone({x:x,y:y},_19);
this.lastRender.stones[_1c]=_17[_1c];
}
}
for(var x=0;x<this.boardSize;x++){
for(var y=0;y<this.boardSize;y++){
_1c=y*this.boardSize+x;
if(_18[_1c]==null){
continue;
}
this.renderer.renderMarker({x:x,y:y},_18[_1c]);
this.lastRender.markers[_1c]=_18[_1c];
}
}
}};
eidogo.BoardRendererHtml=function(){
this.init.apply(this,arguments);
};
eidogo.BoardRendererHtml.prototype={init:function(_1f,_20,_21,_22){
if(!_1f){
throw "No DOM container";
return;
}
this.boardSize=_20||19;
var _23=document.createElement("div");
_23.className="board-gutter"+(this.boardSize==19?" with-coords":"");
_1f.appendChild(_23);
var _24=document.createElement("div");
_24.className="board size"+this.boardSize;
_24.style.position=(_22&&eidogo.browser.ie?"static":"relative");
_23.appendChild(_24);
this.domNode=_24;
this.domGutter=_23;
this.domContainer=_1f;
this.player=_21;
this.uniq=_1f.id+"-";
this.renderCache={stones:[].setLength(this.boardSize,0).addDimension(this.boardSize,0),markers:[].setLength(this.boardSize,0).addDimension(this.boardSize,0)};
this.pointWidth=0;
this.pointHeight=0;
this.margin=0;
var _25=this.renderStone({x:0,y:0},"black");
this.pointWidth=this.pointHeight=_25.offsetWidth;
this.renderStone({x:0,y:0},"white");
this.renderMarker({x:0,y:0},"current");
this.clear();
this.margin=(this.domNode.offsetWidth-(this.boardSize*this.pointWidth))/2;
this.scrollX=0;
this.scrollY=0;
if(_22){
this.crop(_22);
if(eidogo.browser.ie){
var _26=this.domNode.parentNode;
while(_26&&_26.tagName&&!/^body|html$/i.test(_26.tagName)){
this.scrollX+=_26.scrollLeft;
this.scrollY+=_26.scrollTop;
_26=_26.parentNode;
}
}
}
this.dom={};
this.dom.searchRegion=document.createElement("div");
this.dom.searchRegion.id=this.uniq+"search-region";
this.dom.searchRegion.className="search-region";
this.domNode.appendChild(this.dom.searchRegion);
eidogo.util.addEvent(this.domNode,"mousemove",this.handleHover,this,true);
eidogo.util.addEvent(this.domNode,"mousedown",this.handleMouseDown,this,true);
eidogo.util.addEvent(this.domNode,"mouseup",this.handleMouseUp,this,true);
},showRegion:function(_27){
this.dom.searchRegion.style.top=(this.margin+this.pointHeight*_27[0])+"px";
this.dom.searchRegion.style.left=(this.margin+this.pointWidth*_27[1])+"px";
this.dom.searchRegion.style.width=this.pointWidth*_27[2]+"px";
this.dom.searchRegion.style.height=this.pointHeight*_27[3]+"px";
eidogo.util.show(this.dom.searchRegion);
},hideRegion:function(){
eidogo.util.hide(this.dom.searchRegion);
},clear:function(){
this.domNode.innerHTML="";
},renderStone:function(pt,_29){
var _2a=document.getElementById(this.uniq+"stone-"+pt.x+"-"+pt.y);
if(_2a){
_2a.parentNode.removeChild(_2a);
}
if(_29!="empty"){
var div=document.createElement("div");
div.id=this.uniq+"stone-"+pt.x+"-"+pt.y;
div.className="point stone "+_29;
try{
div.style.left=(pt.x*this.pointWidth+this.margin-this.scrollX)+"px";
div.style.top=(pt.y*this.pointHeight+this.margin-this.scrollY)+"px";
}
catch(e){
}
this.domNode.appendChild(div);
return div;
}
return null;
},renderMarker:function(pt,_2d){
if(this.renderCache.markers[pt.x][pt.y]){
var _2e=document.getElementById(this.uniq+"marker-"+pt.x+"-"+pt.y);
if(_2e){
_2e.parentNode.removeChild(_2e);
}
}
if(_2d=="empty"||!_2d){
this.renderCache.markers[pt.x][pt.y]=0;
return null;
}
this.renderCache.markers[pt.x][pt.y]=1;
if(_2d){
var _2f="";
switch(_2d){
case "triangle":
case "square":
case "circle":
case "ex":
case "territory-white":
case "territory-black":
case "dim":
case "current":
break;
default:
if(_2d.indexOf("var:")==0){
_2f=_2d.substring(4);
_2d="variation";
}else{
_2f=_2d;
_2d="label";
}
break;
}
var div=document.createElement("div");
div.id=this.uniq+"marker-"+pt.x+"-"+pt.y;
div.className="point marker "+_2d;
try{
div.style.left=(pt.x*this.pointWidth+this.margin-this.scrollX)+"px";
div.style.top=(pt.y*this.pointHeight+this.margin-this.scrollY)+"px";
}
catch(e){
}
div.appendChild(document.createTextNode(_2f));
this.domNode.appendChild(div);
return div;
}
return null;
},setCursor:function(_31){
this.domNode.style.cursor=_31;
},handleHover:function(e){
var xy=this.getXY(e);
this.player.handleBoardHover(xy[0],xy[1]);
},handleMouseDown:function(e){
var xy=this.getXY(e);
this.player.handleBoardMouseDown(xy[0],xy[1]);
},handleMouseUp:function(e){
var xy=this.getXY(e);
this.player.handleBoardMouseUp(xy[0],xy[1]);
},getXY:function(e){
var _39=eidogo.util.getElClickXY(e,this.domNode);
var m=this.margin;
var pw=this.pointWidth;
var ph=this.pointHeight;
var x=Math.round((_39[0]-m-(pw/2))/pw);
var y=Math.round((_39[1]-m-(ph/2))/ph);
return [x,y];
},crop:function(_3f){
eidogo.util.addClass(this.domContainer,"shrunk");
this.domGutter.style.overflow="hidden";
var _40=_3f.width*this.pointWidth+this.margin;
var _41=_3f.height*this.pointHeight+this.margin;
this.domGutter.style.width=_40+"px";
this.domGutter.style.height=_41+"px";
this.player.dom.player.style.width=_40+"px";
this.domGutter.scrollTop=(_3f.corner=="se"||_3f.corner=="sw"?"1000":"0");
this.domGutter.scrollLeft=(_3f.corner=="se"||_3f.corner=="ne"?"1000":"0");
}};
eidogo.BoardRendererFlash=function(){
this.init.apply(this,arguments);
};
eidogo.BoardRendererFlash.prototype={init:function(_42,_43,_44,_45){
if(!_42){
throw "No DOM container";
return;
}
this.ready=false;
this.swf=null;
this.unrendered=[];
var _46=_42.id+"-board";
var so=new SWFObject(eidogo.playerPath+"/swf/board.swf",_46,"421","421","8","#665544");
so.addParam("allowScriptAccess","sameDomain");
so.write(_42);
var _48=0;
var _49=function(){
swf=eidogo.util.byId(_46);
if(!swf||!swf.init){
if(_48>2000){
throw "Error initializing board";
return;
}
setTimeout(arguments.callee.bind(this),10);
_48+=10;
return;
}
this.swf=swf;
this.swf.init(_44.uniq,_43);
this.ready=true;
}.bind(this);
_49();
},showRegion:function(_4a){
},hideRegion:function(){
},clear:function(){
if(!this.swf){
return;
}
this.swf.clear();
},renderStone:function(pt,_4c){
if(!this.swf){
this.unrendered.push(["stone",pt,_4c]);
return;
}
for(var i=0;i<this.unrendered.length;i++){
if(this.unrendered[i][0]=="stone"){
this.swf.renderStone(this.unrendered[i][1],this.unrendered[i][2]);
}
}
this.unrendered=[];
this.swf.renderStone(pt,_4c);
},renderMarker:function(pt,_4f){
if(!_4f){
return;
}
if(!this.swf){
this.unrendered.push(["marker",pt,_4f]);
return;
}
for(var i=0;i<this.unrendered.length;i++){
if(this.unrendered[i][0]=="marker"){
this.swf.renderMarker(this.unrendered[i][1],this.unrendered[i][2]);
}
}
this.unrendered=[];
this.swf.renderMarker(pt,_4f);
},setCursor:function(_51){
},crop:function(){
}};
eidogo.BoardRendererAscii=function(_52,_53){
this.init(_52,_53);
};
eidogo.BoardRendererAscii.prototype={pointWidth:2,pointHeight:1,margin:1,blankBoard:"+-------------------------------------+\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"+-------------------------------------+",init:function(_54,_55){
this.domNode=_54||null;
this.boardSize=_55||19;
this.content=this.blankBoard;
},clear:function(){
this.content=this.blankBoard;
this.domNode.innerHTML="<pre>"+this.content+"</pre>";
},renderStone:function(pt,_57){
var _58=(this.pointWidth*this.boardSize+this.margin*2)*(pt.y*this.pointHeight+1)+(pt.x*this.pointWidth)+2;
this.content=this.content.substring(0,_58-1)+"."+this.content.substring(_58);
if(_57!="empty"){
this.content=this.content.substring(0,_58-1)+(_57=="white"?"O":"#")+this.content.substring(_58);
}
this.domNode.innerHTML="<pre>"+this.content+"</pre>";
},renderMarker:function(pt,_5a){
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
var t=eidogo.i18n,_2=eidogo.util.byId,_3=eidogo.util.ajax,_4=eidogo.util.addEvent,_5=eidogo.util.onClick,_6=eidogo.util.getElClickXY,_7=eidogo.util.stopEvent,_8=eidogo.util.addClass,_9=eidogo.util.removeClass,_a=eidogo.util.show,_b=eidogo.util.hide,_c=eidogo.browser.moz,_d=eidogo.util.getPlayerPath();
eidogo.players=eidogo.players||{};
eidogo.delegate=function(_e,fn){
var _10=eidogo.players[_e];
_10[fn].apply(_10,Array.from(arguments).slice(2));
};
eidogo.Player=function(){
this.init.apply(this,arguments);
};
eidogo.Player.prototype={init:function(cfg){
cfg=cfg||{};
this.mode=cfg.mode?cfg.mode:"play";
this.dom={};
this.dom.container=(typeof cfg.container=="string"?_2(cfg.container):cfg.container);
if(!this.dom.container){
alert(t["dom error"]);
return;
}
this.uniq=(new Date()).getTime();
eidogo.players[this.uniq]=this;
this.sgfPath=cfg.sgfPath;
this.searchUrl=cfg.searchUrl;
this.showingSearch=false;
this.saveUrl=cfg.saveUrl;
this.downloadUrl=cfg.downloadUrl;
this.scoreEstUrl=cfg.scoreEstUrl;
this.hooks=cfg.hooks||{};
this.permalinkable=!!this.hooks.setPermalink;
this.propertyHandlers={W:this.playMove,B:this.playMove,KO:this.playMove,MN:this.setMoveNumber,AW:this.addStone,AB:this.addStone,AE:this.addStone,CR:this.addMarker,LB:this.addMarker,TR:this.addMarker,MA:this.addMarker,SQ:this.addMarker,TW:this.addMarker,TB:this.addMarker,DD:this.addMarker,PL:this.setColor,C:this.showComments,N:this.showAnnotation,GB:this.showAnnotation,GW:this.showAnnotation,DM:this.showAnnotation,HO:this.showAnnotation,UC:this.showAnnotation,V:this.showAnnotation,BM:this.showAnnotation,DO:this.showAnnotation,IT:this.showAnnotation,TE:this.showAnnotation,BL:this.showTime,OB:this.showTime,WL:this.showTime,OW:this.showTime};
this.infoLabels={GN:t["game"],PW:t["white"],WR:t["white rank"],WT:t["white team"],PB:t["black"],BR:t["black rank"],BT:t["black team"],HA:t["handicap"],KM:t["komi"],RE:t["result"],DT:t["date"],GC:t["info"],PC:t["place"],EV:t["event"],RO:t["round"],OT:t["overtime"],ON:t["opening"],RU:t["ruleset"],AN:t["annotator"],CP:t["copyright"],SO:t["source"],TM:t["time limit"],US:t["transcriber"],AP:t["created with"]};
this.months=[t["january"],t["february"],t["march"],t["april"],t["may"],t["june"],t["july"],t["august"],t["september"],t["october"],t["november"],t["december"]];
this.theme=cfg.theme;
this.reset(cfg);
this.renderer=cfg.renderer||"html";
this.cropParams=null;
this.shrinkToFit=cfg.shrinkToFit;
if(this.shrinkToFit||cfg.cropWidth||cfg.cropHeight){
this.cropParams={};
this.cropParams.width=cfg.cropWidth;
this.cropParams.height=cfg.cropHeight;
this.cropParams.corner=cfg.cropCorner;
}
this.constructDom();
if(cfg.enableShortcuts){
_4(document,_c?"keypress":"keydown",this.handleKeypress,this,true);
}
_4(document,"mouseup",this.handleDocMouseUp,this,true);
if(cfg.sgf||cfg.sgfUrl||(cfg.sgfPath&&cfg.gameName)){
this.loadSgf(cfg);
}
this.hook("initDone");
},hook:function(_12,_13){
if(_12 in this.hooks){
this.hooks[_12].bind(this)(_13);
}
},reset:function(cfg){
this.gameName="";
this.gameTree=new eidogo.GameTree();
this.cursor=new eidogo.GameCursor();
this.progressiveLoad=cfg.progressiveLoad?true:false;
this.progressiveLoads=null;
this.progressiveUrl=null;
this.opponentUrl=null;
this.opponentColor=null;
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
this.unsavedChanges=false;
this.searching=false;
this.editingComment=false;
this.goingBack=false;
this.problemMode=cfg.problemMode;
this.problemColor=cfg.problemColor||"W";
this.prefs={};
this.prefs.markCurrent=typeof cfg.markCurrent!="undefined"?!!cfg.markCurrent:true;
this.prefs.markNext=typeof cfg.markNext!="undefined"?cfg.markNext:false;
this.prefs.markVariations=typeof cfg.markVariations!="undefined"?!!cfg.markVariations:true;
this.prefs.showGameInfo=!!cfg.showGameInfo;
this.prefs.showPlayerInfo=!!cfg.showPlayerInfo;
this.prefs.showTools=!!cfg.showTools;
this.prefs.showComments=typeof cfg.showComments!="undefined"?!!cfg.showComments:true;
this.prefs.showOptions=!!cfg.showOptions;
},loadSgf:function(cfg,_16){
this.nowLoading();
this.reset(cfg);
this.sgfPath=cfg.sgfPath||this.sgfPath;
this.loadPath=cfg.loadPath&&cfg.loadPath.length>1?cfg.loadPath:[0,0];
this.gameName=cfg.gameName||"";
if(typeof cfg.sgf=="string"){
var sgf=new eidogo.SgfParser(cfg.sgf);
this.load(sgf.tree);
}else{
if(typeof cfg.sgf=="object"){
this.load(cfg.sgf);
}else{
if(typeof cfg.sgfUrl=="string"||this.gameName){
if(!cfg.sgfUrl){
cfg.sgfUrl=this.sgfPath+this.gameName+".sgf";
}
this.remoteLoad(cfg.sgfUrl,null,false,null,_16);
var _18=true;
if(cfg.progressiveLoad){
this.progressiveLoads=0;
this.progressiveUrl=cfg.progressiveUrl||cfg.sgfUrl.replace(/\?.+$/,"");
}
}else{
var _19=cfg.boardSize||"19";
var _1a={nodes:[],trees:[{nodes:[{SZ:_19}],trees:[]}]};
if(cfg.opponentUrl){
this.opponentUrl=cfg.opponentUrl;
this.opponentColor=cfg.opponentColor=="B"?cfg.opponentColor:"W";
var _1b=_1a.trees.first().nodes.first();
_1b.PW=t["you"];
_1b.PB="GNU Go";
this.gameName="gnugo";
}
this.load(_1a);
}
}
}
if(!_18&&typeof _16=="function"){
_16();
}
},initGame:function(_1c){
this.handleDisplayPrefs();
var _1d=_1c.trees.first().nodes.first();
var _1e=_1d.SZ;
if(!this.board){
if(this.shrinkToFit){
this.calcShrinkToFit();
}
this.createBoard(_1e||19);
this.rules=new eidogo.Rules(this.board);
}
this.unsavedChanges=false;
this.resetCursor(true);
this.totalMoves=0;
var _1f=new eidogo.GameCursor(this.cursor.node);
while(_1f.next()){
this.totalMoves++;
}
this.totalMoves--;
this.showInfo();
this.enableNavSlider();
this.selectTool("play");
this.hook("initGame");
},handleDisplayPrefs:function(){
(this.prefs.showGameInfo||this.prefs.showPlayerInfo?_a:_b)(this.dom.info);
(this.prefs.showGameInfo?_a:_b)(this.dom.infoGame);
(this.prefs.showPlayerInfo?_a:_b)(this.dom.infoPlayers);
(this.prefs.showTools?_a:_b)(this.dom.toolsContainer);
if(!this.showingSearch){
(this.prefs.showComments?_a:_b)(this.dom.comments);
}
(this.prefs.showOptions?_a:_b)(this.dom.options);
},createBoard:function(_20){
_20=_20||19;
if(this.board&&this.board.renderer&&this.board.boardSize==_20){
return;
}
try{
this.dom.boardContainer.innerHTML="";
var _21;
if(this.renderer=="flash"){
_21=eidogo.BoardRendererFlash;
}else{
_21=eidogo.BoardRendererHtml;
}
var _22=new _21(this.dom.boardContainer,_20,this,this.cropParams);
this.board=new eidogo.Board(_22,_20);
}
catch(e){
if(e=="No DOM container"){
this.croak(t["error board"]);
return;
}
}
},calcShrinkToFit:function(){
this.cropParams.width=12;
this.cropParams.height=8;
this.cropParams.corner="sw";
},load:function(_23,_24){
if(!_24){
_24=new eidogo.GameTree();
this.gameTree=_24;
}
_24.loadJson(_23);
_24.cached=true;
this.doneLoading();
if(!_24.parent){
this.initGame(_24);
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
},remoteLoad:function(url,_26,_27,_28,_29){
_27=_27=="undefined"?true:_27;
_29=(typeof _29=="function")?_29:null;
if(_27){
if(!_26){
this.gameName=url;
}
url=this.sgfPath+url+".sgf";
}
if(_28){
this.loadPath=_28;
}
var _2a=function(req){
var _2c=req.responseText;
var _2d=_2c.charAt(0);
var i=1;
while(i<_2c.length&&(_2d==" "||_2d=="\r"||_2d=="\n")){
_2d=_2c.charAt(i++);
}
if(_2d=="("){
var me=this;
var sgf=new eidogo.SgfParser(_2c,function(){
me.load(this.tree,_26);
_29&&_29();
});
}else{
if(_2d=="{"){
_2c=eval("("+_2c+")");
this.load(_2c,_26);
_29&&_29();
}else{
this.croak(t["invalid data"]);
}
}
};
var _31=function(req){
this.croak(t["error retrieving"]);
};
_3("get",url,null,_2a,_31,this,30000);
},fetchOpponentMove:function(){
this.nowLoading(t["gnugo thinking"]);
var _33=function(req){
this.doneLoading();
this.createMove(req.responseText);
};
var _35=function(req){
this.croak(t["error retrieving"]);
};
var _37={sgf:this.gameTree.trees[0].toSgf(),move:this.currentColor,size:this.gameTree.trees.first().nodes.first().SZ};
_3("post",this.opponentUrl,_37,_33,_35,this,45000);
},fetchScoreEstimate:function(){
this.nowLoading(t["gnugo thinking"]);
var _38=function(req){
this.doneLoading();
var _3a=req.responseText.split("\n");
var _3b,_3c=_3a[1].split(" ");
for(var i=0;i<_3c.length;i++){
_3b=_3c[i].split(":");
if(_3b[1]){
this.addMarker(_3b[1],_3b[0]);
}
}
this.board.render();
this.prependComment(_3a[0]);
};
var _3e=function(req){
this.croak(t["error retrieving"]);
};
var _40=this.gameTree.trees.first().nodes.first();
var _41={sgf:this.gameTree.trees[0].toSgf(),move:"est",size:_40.SZ,komi:_40.KM,mn:this.moveNumber+1};
_3("post",this.scoreEstUrl,_41,_38,_3e,this,45000);
},playProblemResponse:function(_42){
this.variation(null,_42);
},goTo:function(_43,_44){
_44=typeof _44!="undefined"?_44:true;
var _45;
var _46;
if(_43 instanceof Array){
if(!_43.length){
return;
}
if(_44){
this.resetCursor(true);
}
while(_43.length){
_45=_43[0];
if(isNaN(parseInt(_45,10))){
_46=this.getVariations(true);
if(!_46.length||_46[0].move==null){
this.variation(null,true);
if(this.progressiveLoads){
this.loadPath.push(_45);
return;
}
}
for(var i=0;i<_46.length;i++){
if(_46[i].move==_45){
this.variation(_46[i].treeNum,true);
break;
}
}
_43.shift();
}else{
_45=parseInt(_43.shift(),10);
if(_43.length==0){
for(var i=0;i<_45;i++){
this.variation(null,true);
}
}else{
if(_43.length){
this.variation(_45,true);
if(_43.length!=1){
while(this.cursor.nextNode()){
this.execNode(true,true);
}
}
}
}
}
if(this.progressiveLoads){
return;
}
}
this.refresh();
}else{
if(!isNaN(parseInt(_43,10))){
var _48=parseInt(_43,10);
if(_44){
this.resetCursor(true);
_48++;
}
for(var i=0;i<_48;i++){
this.variation(null,true);
}
this.refresh();
}else{
alert(t["bad path"]+" "+_43);
}
}
},resetCursor:function(_49,_4a){
this.board.reset();
this.currentColor=(this.problemMode?this.problemColor:"B");
this.moveNumber=0;
if(_4a){
this.cursor.node=this.gameTree.trees.first().nodes.first();
}else{
this.cursor.node=this.gameTree.nodes.first();
}
this.refresh(_49);
},refresh:function(_4b){
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
this.execNode(_4b);
},variation:function(_4d,_4e){
if(this.cursor.next(_4d)){
this.execNode(_4e);
this.resetLastLabels();
if(this.progressiveLoads){
return false;
}
return true;
}
return false;
},execNode:function(_4f,_50){
if(!_50&&this.progressiveLoads){
var me=this;
setTimeout(function(){
me.execNode.call(me,_4f);
},10);
return;
}
if(!_4f){
this.dom.comments.innerHTML="";
this.board.clearMarkers();
}
if(this.moveNumber<1){
this.currentColor=(this.problemMode?this.problemColor:"B");
}
var _52=this.cursor.node.getProperties();
for(var _53 in _52){
if(this.propertyHandlers[_53]){
(this.propertyHandlers[_53]).apply(this,[this.cursor.node[_53],_53,_4f]);
}
}
if(_4f){
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
if(!_50&&this.progressiveUrl&&!this.cursor.node.parent.cached){
this.nowLoading();
this.progressiveLoads++;
this.remoteLoad(this.progressiveUrl+"?id="+this.cursor.node.parent.id,this.cursor.node.parent);
}
if(this.problemMode&&this.currentColor&&this.currentColor!=this.problemColor&&!this.goingBack){
this.playProblemResponse(_4f);
}
this.goingBack=false;
},findVariations:function(){
this.variations=this.getVariations(this.prefs.markNext);
},getVariations:function(_54){
var _55=[];
if(!this.cursor.node){
return _55;
}
if(_54&&this.cursor.node.nextSibling!=null){
_55.push({move:this.cursor.node.nextSibling.getMove(),treeNum:null});
}
if(this.cursor.node.nextSibling==null&&this.cursor.node.parent&&this.cursor.node.parent.trees.length){
var _56=this.cursor.node.parent.trees;
for(var i=0;i<_56.length;i++){
_55.push({move:_56[i].nodes.first().getMove(),treeNum:i});
}
}
return _55;
},back:function(e,obj,_5a){
if(this.cursor.previous()){
this.moveNumber--;
if(this.moveNumber<0){
this.moveNumber=0;
}
this.board.revert(1);
this.goingBack=true;
this.refresh(_5a);
this.resetLastLabels();
}
},forward:function(e,obj,_5d){
this.variation(null,_5d);
},first:function(){
if(!this.cursor.hasPrevious()){
return;
}
this.resetCursor(false,true);
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
},handleBoardMouseDown:function(x,y,e){
if(this.domLoading){
return;
}
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
},handleBoardHover:function(x,y,e){
if(this.domLoading){
return;
}
if(this.mouseDown||this.regionBegun){
if(!this.boundsCheck(x,y,[0,this.board.boardSize-1])){
return;
}
if(this.searchUrl&&!this.regionBegun&&(x!=this.mouseDownX||y!=this.mouseDownY)){
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
_7(e);
}
},handleBoardMouseUp:function(x,y,e){
if(this.domLoading){
return;
}
this.mouseDown=false;
var _68=this.pointToSgfCoord({x:x,y:y});
if(this.mode=="play"){
for(var i=0;i<this.variations.length;i++){
var _6a=this.sgfCoordToPoint(this.variations[i].move);
if(_6a.x==x&&_6a.y==y){
this.variation(this.variations[i].treeNum);
_7(e);
return;
}
}
if(!this.rules.check({x:x,y:y},this.currentColor)){
return;
}
if(_68){
var _6b=this.cursor.getNextMoves();
if(_6b&&_68 in _6b){
this.variation(_6b[_68]);
}else{
this.createMove(_68);
}
}
}else{
if(this.mode=="region"&&x>=-1&&y>=-1&&this.regionBegun){
if(this.regionTop==y&&this.regionLeft==x&&!this.regionClickSelect){
this.regionClickSelect=true;
this.regionRight=x+1;
this.regionBottom=y+1;
this.showRegion();
}else{
this.regionBegun=false;
this.regionClickSelect=false;
this.regionBottom=(y<0?0:(y>=this.board.boardSize)?y:y+(y>this.regionTop?1:0));
this.regionRight=(x<0?0:(x>=this.board.boardSize)?x:x+(x>this.regionLeft?1:0));
this.showRegion();
_a(this.dom.searchAlgo,"inline");
_a(this.dom.searchButton,"inline");
_7(e);
}
}else{
var _6c;
var _6d=this.board.getStone({x:x,y:y});
if(this.mode=="add_b"||this.mode=="add_w"){
this.cursor.node.emptyPoint(this.pointToSgfCoord({x:x,y:y}));
if(_6d!=this.board.BLACK&&this.mode=="add_b"){
_6c="AB";
}else{
if(_6d!=this.board.WHITE&&this.mode=="add_w"){
_6c="AW";
}else{
_6c="AE";
}
}
}else{
switch(this.mode){
case "tr":
_6c="TR";
break;
case "sq":
_6c="SQ";
break;
case "cr":
_6c="CR";
break;
case "x":
_6c="MA";
break;
case "dim":
_6c="DD";
break;
case "number":
_6c="LB";
_68=_68+":"+this.labelLastNumber;
this.labelLastNumber++;
break;
case "letter":
_6c="LB";
_68=_68+":"+this.labelLastLetter;
this.labelLastLetter=String.fromCharCode(this.labelLastLetter.charCodeAt(0)+1);
}
}
this.cursor.node.pushProperty(_6c,_68);
this.refresh();
}
}
},handleDocMouseUp:function(evt){
if(this.domLoading){
return true;
}
if(this.mode=="region"&&this.regionBegun&&!this.regionClickSelect){
this.mouseDown=false;
this.regionBegun=false;
_a(this.dom.searchAlgo,"inline");
_a(this.dom.searchButton,"inline");
}
return true;
},boundsCheck:function(x,y,_71){
if(_71.length==2){
_71[3]=_71[2]=_71[1];
_71[1]=_71[0];
}
return (x>=_71[0]&&y>=_71[1]&&x<=_71[2]&&y<=_71[3]);
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
var _76=this.getRegionBounds();
this.board.renderer.showRegion(_76);
},hideRegion:function(){
this.board.renderer.hideRegion();
},loadSearch:function(q,dim,p,a){
var _7b={nodes:[],trees:[{nodes:[{SZ:this.board.boardSize}],trees:[]}]};
this.load(_7b);
a=a||"corner";
this.dom.searchAlgo.value=a;
p=this.uncompressPattern(p);
dim=dim.split("x");
var w=dim[0];
var h=dim[1];
var bs=this.board.boardSize;
var l;
var t;
switch(q){
case "nw":
l=0;
t=0;
break;
case "ne":
l=bs-w;
t=0;
break;
case "se":
l=bs-w;
t=bs-h;
break;
case "sw":
l=0;
t=bs-h;
break;
}
var c;
var x;
var y;
for(y=0;y<h;y++){
for(x=0;x<w;x++){
c=p.charAt(y*w+x);
if(c=="o"){
c="AW";
}else{
if(c=="x"){
c="AB";
}else{
c="";
}
}
this.cursor.node.pushProperty(c,this.pointToSgfCoord({x:l+x,y:t+y}));
}
}
this.refresh();
this.regionLeft=l;
this.regionTop=t;
this.regionRight=l+x;
this.regionBottom=t+y;
var b=this.getRegionBounds();
var r=[b[1],b[0],b[1]+b[2],b[0]+b[3]];
for(y=0;y<this.board.boardSize;y++){
for(x=0;x<this.board.boardSize;x++){
if(!this.boundsCheck(x,y,r)){
this.board.renderer.renderMarker({x:x,y:y},"dim");
}
}
}
this.searchRegion();
},searchRegion:function(){
if(this.searching){
return;
}
this.searching=true;
if(!this.searchUrl){
_a(this.dom.comments);
_b(this.dom.searchContainer);
this.prependComment(t["no search url"]);
return;
}
var _86=this.dom.searchAlgo.value;
var _87=this.getRegionBounds();
var _88=this.board.getRegion(_87[0],_87[1],_87[2],_87[3]);
var _89=_88.join("").replace(new RegExp(this.board.EMPTY,"g"),".").replace(new RegExp(this.board.BLACK,"g"),"x").replace(new RegExp(this.board.WHITE,"g"),"o");
var _8a=/^\.*$/.test(_89);
var _8b=/^\.*O\.*$/.test(_89);
var _8c=/^\.*X\.*$/.test(_89);
if(_8a||_8b||_8c){
this.searching=false;
_a(this.dom.comments);
_b(this.dom.searchContainer);
this.prependComment(t["two stones"]);
return;
}
var _8d=[];
if(_87[0]==0){
_8d.push("n");
}
if(_87[1]==0){
_8d.push("w");
}
if(_87[0]+_87[3]==this.board.boardSize){
_8d.push("s");
}
if(_87[1]+_87[2]==this.board.boardSize){
_8d.push("e");
}
if(_86=="corner"&&!(_8d.length==2&&((_8d.contains("n")&&_8d.contains("e"))||(_8d.contains("n")&&_8d.contains("w"))||(_8d.contains("s")&&_8d.contains("e"))||(_8d.contains("s")&&_8d.contains("w"))))){
this.searching=false;
_a(this.dom.comments);
_b(this.dom.searchContainer);
this.prependComment(t["two edges"]);
return;
}
var _8e=(_8d.contains("n")?"n":"s");
_8e+=(_8d.contains("w")?"w":"e");
this.showComments("");
this.gameName="search";
var _8f=function(req){
this.searching=false;
this.doneLoading();
_b(this.dom.comments);
_a(this.dom.searchContainer);
this.showingSearch=true;
if(req.responseText=="ERROR"){
this.croak(t["error retrieving"]);
return;
}else{
if(req.responseText=="NONE"){
_b(this.dom.searchResultsContainer);
this.dom.searchCount.innerHTML="No";
return;
}
}
var _91=eval("("+req.responseText+")");
var _92;
var _93="";
var odd;
for(var i=0;_92=_91[i];i++){
odd=odd?false:true;
_93+="<a class='search-result"+(odd?" odd":"")+"' href='#'>                    <span class='id'>"+_92.id+"</span>                    <span class='mv'>"+_92.mv+"</span>                    <span class='pw'>"+_92.pw+" "+_92.wr+"</span>                    <span class='pb'>"+_92.pb+" "+_92.br+"</span>                    <span class='re'>"+_92.re+"</span>                    <span class='dt'>"+_92.dt+"</span>                    <div class='clear'>&nbsp;</div>                    </a>";
}
_a(this.dom.searchResultsContainer);
this.dom.searchResults.innerHTML=_93;
this.dom.searchCount.innerHTML=_91.length;
};
var _96=function(req){
this.croak(t["error retrieving"]);
};
var _98={q:_8e,w:_87[2],h:_87[3],p:_89,a:_86,t:(new Date()).getTime()};
this.progressiveLoad=false;
this.progressiveUrl=null;
this.prefs.markNext=false;
this.prefs.showPlayerInfo=true;
this.hook("searchRegion",_98);
this.nowLoading();
_3("get",this.searchUrl,_98,_8f,_96,this,45000);
},loadSearchResult:function(e){
this.nowLoading();
var _9a=e.target||e.srcElement;
if(_9a.nodeName=="SPAN"){
_9a=_9a.parentNode;
}
if(_9a.nodeName=="A"){
var _9b;
var id;
var mv;
for(var i=0;_9b=_9a.childNodes[i];i++){
if(_9b.className=="id"){
id=_9b.innerHTML;
}
if(_9b.className=="mv"){
mv=parseInt(_9b.innerHTML,10);
}
}
}
this.remoteLoad(id,null,true,[0,mv],function(){
this.doneLoading();
this.setPermalink();
this.prefs.showOptions=true;
this.handleDisplayPrefs();
}.bind(this));
_7(e);
},closeSearch:function(){
this.showingSearch=false;
_b(this.dom.searchContainer);
_a(this.dom.comments);
},compressPattern:function(_9f){
var c=null;
var pc="";
var n=1;
var ret="";
for(var i=0;i<_9f.length;i++){
c=_9f.charAt(i);
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
},uncompressPattern:function(_a5){
var c=null;
var s=null;
var n="";
var ret="";
for(var i=0;i<_a5.length;i++){
c=_a5.charAt(i);
if(c=="."||c=="x"||c=="o"){
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
},createMove:function(_ac){
var _ad={};
_ad[this.currentColor]=_ac;
_ad["MN"]=(++this.moveNumber).toString();
var _ae=new eidogo.GameNode(_ad);
this.totalMoves++;
if(this.cursor.hasNext()){
if(this.cursor.node.nextSibling){
this.cursor.node.parent.createVariationTree(this.cursor.node.getPosition());
}
this.cursor.node.parent.appendTree(new eidogo.GameTree({nodes:[_ae],trees:[]}));
this.variation(this.cursor.node.parent.trees.length-1);
}else{
this.cursor.node.parent.appendNode(_ae);
this.variation();
}
this.unsavedChanges=true;
},handleKeypress:function(e){
if(this.editingComment){
return true;
}
var _b0=e.keyCode||e.charCode;
if(!_b0||e.ctrlKey||e.altKey||e.metaKey){
return true;
}
var _b1=String.fromCharCode(_b0).toLowerCase();
for(var i=0;i<this.variations.length;i++){
var _b3=this.sgfCoordToPoint(this.variations[i].move);
var _b4=""+(i+1);
if(_b3.x!=null&&this.board.getMarker(_b3)!=this.board.EMPTY&&typeof this.board.getMarker(_b3)=="string"){
_b4=this.board.getMarker(_b3).toLowerCase();
}
_b4=_b4.replace(/^var:/,"");
if(_b1==_b4.charAt(0)){
this.variation(this.variations[i].treeNum);
_7(e);
return;
}
}
if(_b0==112||_b0==27){
this.selectTool("play");
}
var _b5=true;
switch(_b0){
case 32:
if(e.shiftKey){
this.back();
}else{
this.forward();
}
break;
case 39:
if(e.shiftKey){
var _b6=this.totalMoves-this.moveNumber;
var _b7=(_b6>9?9:_b6-1);
for(var i=0;i<_b7;i++){
this.forward(null,null,true);
}
}
this.forward();
break;
case 37:
if(e.shiftKey){
var _b7=(this.moveNumber>9?9:this.moveNumber-1);
for(var i=0;i<_b7;i++){
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
_b5=false;
break;
}
if(_b5){
_7(e);
}
},showInfo:function(){
this.dom.infoGame.innerHTML="";
this.dom.whiteName.innerHTML="";
this.dom.blackName.innerHTML="";
var _b8=this.gameTree.trees.first().nodes.first();
var dl=document.createElement("dl");
for(var _ba in this.infoLabels){
if(_b8[_ba] instanceof Array){
_b8[_ba]=_b8[_ba][0];
}
if(_b8[_ba]){
if(_ba=="PW"){
this.dom.whiteName.innerHTML=_b8[_ba]+(_b8["WR"]?", "+_b8["WR"]:"");
continue;
}else{
if(_ba=="PB"){
this.dom.blackName.innerHTML=_b8[_ba]+(_b8["BR"]?", "+_b8["BR"]:"");
continue;
}
}
if(_ba=="WR"||_ba=="BR"){
continue;
}
if(_ba=="DT"){
var _bb=_b8[_ba].split(/[\.-]/);
if(_bb.length==3){
_b8[_ba]=_bb[2].replace(/^0+/,"")+" "+this.months[_bb[1]-1]+" "+_bb[0];
}
}
var dt=document.createElement("dt");
dt.innerHTML=this.infoLabels[_ba]+":";
var dd=document.createElement("dd");
dd.innerHTML=_b8[_ba];
dl.appendChild(dt);
dl.appendChild(dd);
}
}
this.dom.infoGame.appendChild(dl);
},selectTool:function(_be){
var _bf;
_b(this.dom.scoreEst);
if(_be=="region"){
_bf="crosshair";
}else{
if(_be=="comment"){
this.closeSearch();
var ta=this.dom.commentsEdit;
ta.style.position="absolute";
ta.style.top=this.dom.comments.offsetTop+"px";
ta.style.left=this.dom.comments.offsetLeft+"px";
_a(this.dom.shade);
this.dom.comments.innerHTML="";
this.dom.player.appendChild(ta);
_a(ta);
_a(this.dom.commentsEditDone);
this.dom.commentsEditTa.value=this.cursor.node.C||"";
this.dom.commentsEditTa.focus();
this.editingComment=true;
}else{
_bf="default";
this.regionBegun=false;
this.hideRegion();
_b(this.dom.searchButton);
_b(this.dom.searchAlgo);
if(this.searchUrl){
_a(this.dom.scoreEst,"inline");
}
}
}
this.board.renderer.setCursor(_bf);
this.mode=_be;
this.dom.toolsSelect.value=_be;
},finishEditComment:function(){
var _c1=this.cursor.node.C;
var _c2=this.dom.commentsEditTa.value;
if(_c1!=_c2){
this.unsavedChanges=true;
this.cursor.node.C=_c2;
}
_b(this.dom.shade);
_b(this.dom.commentsEdit);
_a(this.dom.comments);
this.selectTool("play");
this.refresh();
},updateControls:function(){
this.dom.moveNumber.innerHTML=(this.moveNumber?(t["move"]+" "+this.moveNumber):(this.permalinkable?"permalink":""));
this.dom.whiteCaptures.innerHTML=t["captures"]+": <span>"+this.board.captures.W+"</span>";
this.dom.blackCaptures.innerHTML=t["captures"]+": <span>"+this.board.captures.B+"</span>";
this.dom.whiteTime.innerHTML=t["time left"]+": <span>"+(this.timeW?this.timeW:"--")+"</span>";
this.dom.blackTime.innerHTML=t["time left"]+": <span>"+(this.timeB?this.timeB:"--")+"</span>";
_9(this.dom.controlPass,"pass-on");
this.dom.variations.innerHTML="";
for(var i=0;i<this.variations.length;i++){
var _c4=i+1;
if(!this.variations[i].move||this.variations[i].move=="tt"){
_8(this.dom.controlPass,"pass-on");
}else{
var _c5=this.sgfCoordToPoint(this.variations[i].move);
if(this.board.getMarker(_c5)!=this.board.EMPTY){
_c4=this.board.getMarker(_c5);
}
if(this.prefs.markVariations){
this.board.addMarker(_c5,"var:"+_c4);
}
}
var _c6=document.createElement("div");
_c6.className="variation-nav";
_c6.innerHTML=_c4;
_4(_c6,"click",function(e,arg){
arg.me.variation(arg.treeNum);
},{me:this,treeNum:this.variations[i].treeNum});
this.dom.variations.appendChild(_c6);
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
var _c9="";
if(!this.prefs.showPlayerInfo){
_c9+=this.getGameDescription(true);
}
if(!this.prefs.showGameInfo){
_c9+=this.dom.infoGame.innerHTML;
}
if(_c9.length&&this.theme!="problem"){
this.prependComment(_c9,"comment-info");
}
}
if(!this.progressiveLoad){
this.updateNavSlider();
}
},setColor:function(_ca){
this.prependComment(_ca=="B"?t["black to play"]:t["white to play"]);
this.currentColor=_ca;
},setMoveNumber:function(num){
this.moveNumber=num;
},playMove:function(_cc,_cd,_ce){
_cd=_cd||this.currentColor;
this.currentColor=(_cd=="B"?"W":"B");
_cd=_cd=="W"?this.board.WHITE:this.board.BLACK;
var pt=this.sgfCoordToPoint(_cc);
if(!this.cursor.node["MN"]){
this.moveNumber++;
}
if((!_cc||_cc=="tt"||_cc=="")&&!_ce){
this.prependComment((_cd==this.board.WHITE?t["white"]:t["black"])+" "+t["passed"],"comment-pass");
}else{
if(_cc=="resign"){
this.prependComment((_cd==this.board.WHITE?t["white"]:t["black"])+" "+t["resigned"],"comment-resign");
}else{
if(_cc&&_cc!="tt"){
this.board.addStone(pt,_cd);
this.rules.apply(pt,_cd);
if(this.prefs.markCurrent&&!_ce){
this.addMarker(_cc,"current");
}
}
}
}
},addStone:function(_d0,_d1){
if(!(_d0 instanceof Array)){
_d0=[_d0];
}
_d0=this.expandCompressedPoints(_d0);
for(var i=0;i<_d0.length;i++){
this.board.addStone(this.sgfCoordToPoint(_d0[i]),_d1=="AW"?this.board.WHITE:_d1=="AB"?this.board.BLACK:this.board.EMPTY);
}
},addMarker:function(_d3,_d4){
if(!(_d3 instanceof Array)){
_d3=[_d3];
}
_d3=this.expandCompressedPoints(_d3);
var _d5;
for(var i=0;i<_d3.length;i++){
switch(_d4){
case "TR":
_d5="triangle";
break;
case "SQ":
_d5="square";
break;
case "CR":
_d5="circle";
break;
case "MA":
_d5="ex";
break;
case "TW":
_d5="territory-white";
break;
case "TB":
_d5="territory-black";
break;
case "DD":
_d5="dim";
break;
case "LB":
_d5=(_d3[i].split(":"))[1];
_d3[i];
break;
default:
_d5=_d4;
break;
}
this.board.addMarker(this.sgfCoordToPoint((_d3[i].split(":"))[0]),_d5);
}
},showTime:function(_d7,_d8){
var tp=(_d8=="BL"||_d8=="OB"?"timeB":"timeW");
if(_d8=="BL"||_d8=="WL"){
var _da=Math.floor(_d7/60);
var _db=(_d7%60).toFixed(0);
_db=(_db<10?"0":"")+_db;
this[tp]=_da+":"+_db;
}else{
this[tp]+=" ("+_d7+")";
}
},showAnnotation:function(_dc,_dd){
var msg;
switch(_dd){
case "N":
msg=_dc;
break;
case "GB":
msg=(_dc>1?t["vgb"]:t["gb"]);
break;
case "GW":
msg=(_dc>1?t["vgw"]:t["gw"]);
break;
case "DM":
msg=(_dc>1?t["dmj"]:t["dm"]);
break;
case "UC":
msg=t["uc"];
break;
case "TE":
msg=t["te"];
break;
case "BM":
msg=(_dc>1?t["vbm"]:t["bm"]);
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
},showComments:function(_df,_e0,_e1){
if(!_df||_e1){
return;
}
this.dom.comments.innerHTML+=_df.replace(/\n/g,"<br />");
},prependComment:function(_e2,cls){
cls=cls||"comment-status";
this.dom.comments.innerHTML="<div class='"+cls+"'>"+_e2+"</div>"+this.dom.comments.innerHTML;
},downloadSgf:function(evt){
_7(evt);
if(this.downloadUrl){
if(this.unsavedChanges){
alert(t["unsaved changes"]);
return;
}
location.href=this.downloadUrl+this.gameName;
}else{
if(_c){
location.href="data:text/plain,"+encodeURIComponent(this.gameTree.trees.first().toSgf());
}
}
},save:function(evt){
_7(evt);
var _e6=function(req){
this.hook("saved",[req.responseText]);
};
var _e8=function(req){
this.croak(t["error retrieving"]);
};
var sgf=this.gameTree.trees.first().toSgf();
_3("POST",this.saveUrl,{sgf:sgf},_e6,_e8,this,30000);
},constructDom:function(){
this.dom.player=document.createElement("div");
this.dom.player.className="eidogo-player"+(this.theme?" theme-"+this.theme:"");
this.dom.player.id="player-"+this.uniq;
this.dom.container.innerHTML="";
eidogo.util.show(this.dom.container);
this.dom.container.appendChild(this.dom.player);
var _eb="            <div id='board-container' class='board-container'></div>            <div id='controls-container' class='controls-container'>                <ul id='controls' class='controls'>                    <li id='control-first' class='control first'>First</li>                    <li id='control-back' class='control back'>Back</li>                    <li id='control-forward' class='control forward'>Forward</li>                    <li id='control-last' class='control last'>Last</li>                    <li id='control-pass' class='control pass'>Pass</li>                </ul>                <div id='move-number' class='move-number"+(this.permalinkable?" permalink":"")+"'></div>                <div id='nav-slider' class='nav-slider'>                    <div id='nav-slider-thumb' class='nav-slider-thumb'></div>                </div>                <div id='variations-container' class='variations-container'>                    <div id='variations-label' class='variations-label'>"+t["variations"]+":</div>                    <div id='variations' class='variations'></div>                </div>                <div class='controls-stop'></div>            </div>            <div id='tools-container' class='tools-container'"+(this.prefs.showTools?"":" style='display: none'")+">                <div id='tools-label' class='tools-label'>"+t["tool"]+":</div>                <select id='tools-select' class='tools-select'>                    <option value='play'>"+t["play"]+"</option>                    <option value='add_b'>"+t["add_b"]+"</option>                    <option value='add_w'>"+t["add_w"]+"</option>                    "+(this.searchUrl?("<option value='region'>"+t["region"]+"</option>"):"")+"                    <option value='comment'>"+t["edit comment"]+"</option>                    <option value='tr'>"+t["triangle"]+"</option>                    <option value='sq'>"+t["square"]+"</option>                    <option value='cr'>"+t["circle"]+"</option>                    <option value='x'>"+t["x"]+"</option>                    <option value='letter'>"+t["letter"]+"</option>                    <option value='number'>"+t["number"]+"</option>                    <option value='dim'>"+t["dim"]+"</option>                </select>                <input type='button' id='score-est' class='score-est-button' value='"+t["score est"]+"' />                <select id='search-algo' class='search-algo'>                    <option value='corner'>"+t["search corner"]+"</option>                    <option value='center'>"+t["search center"]+"</option>                </select>                <input type='button' id='search-button' class='search-button' value='"+t["search"]+"' />            </div>            <div id='comments' class='comments'></div>            <div id='comments-edit' class='comments-edit'>                <textarea id='comments-edit-ta' class='comments-edit-ta'></textarea>                <div id='comments-edit-done' class='comments-edit-done'>"+t["done"]+"</div>            </div>            <div id='search-container' class='search-container'>                <div id='search-close' class='search-close'>"+t["close search"]+"</div>                <p class='search-count'><span id='search-count'></span>&nbsp;"+t["matches found"]+"</p>                <div id='search-results-container' class='search-results-container'>                    <div class='search-result'>                        <span class='pw'><b>"+t["white"]+"</b></span>                        <span class='pb'><b>"+t["black"]+"</b></span>                        <span class='re'><b>"+t["result"]+"</b></span>                        <span class='dt'><b>"+t["date"]+"</b></span>                        <div class='clear'></div>                    </div>                    <div id='search-results' class='search-results'></div>                </div>            </div>            <div id='info' class='info'>                <div id='info-players' class='players'>                    <div id='white' class='player white'>                        <div id='white-name' class='name'></div>                        <div id='white-captures' class='captures'></div>                        <div id='white-time' class='time'></div>                    </div>                    <div id='black' class='player black'>                        <div id='black-name' class='name'></div>                        <div id='black-captures' class='captures'></div>                        <div id='black-time' class='time'></div>                    </div>                </div>                <div id='info-game' class='game'></div>            </div>            <div id='options' class='options'>                "+(this.saveUrl?"<a id='option-save' class='option-save' href='#'>"+t["save to server"]+"</a>":"")+"                "+(this.downloadUrl||_c?"<a id='option-download' class='option-download' href='#'>"+t["download sgf"]+"</a>":"")+"                <div class='options-stop'></div>            </div>            <div id='preferences' class='preferences'>                <div><input type='checkbox'> Show variations on board</div>                <div><input type='checkbox'> Mark current move</div>            </div>            <div id='footer' class='footer'></div>            <div id='shade' class='shade'></div>        ";
_eb=_eb.replace(/ id='([^']+)'/g," id='$1-"+this.uniq+"'");
this.dom.player.innerHTML=_eb;
var re=/ id='([^']+)-\d+'/g;
var _ed;
var id;
var _ef;
while(_ed=re.exec(_eb)){
id=_ed[0].replace(/'/g,"").replace(/ id=/,"");
_ef="";
_ed[1].split("-").forEach(function(_f0,i){
_f0=i?_f0.charAt(0).toUpperCase()+_f0.substring(1):_f0;
_ef+=_f0;
});
this.dom[_ef]=_2(id);
}
this.dom.navSlider._width=this.dom.navSlider.offsetWidth;
this.dom.navSliderThumb._width=this.dom.navSliderThumb.offsetWidth;
[["moveNumber","setPermalink"],["controlFirst","first"],["controlBack","back"],["controlForward","forward"],["controlLast","last"],["controlPass","pass"],["scoreEst","fetchScoreEstimate"],["searchButton","searchRegion"],["searchResults","loadSearchResult"],["searchClose","closeSearch"],["optionDownload","downloadSgf"],["optionSave","save"],["commentsEditDone","finishEditComment"]].forEach(function(eh){
if(this.dom[eh[0]]){
_5(this.dom[eh[0]],this[eh[1]],this);
}
}.bind(this));
_4(this.dom.toolsSelect,"change",function(e){
this.selectTool.apply(this,[(e.target||e.srcElement).value]);
},this,true);
},enableNavSlider:function(){
if(this.progressiveLoad){
_b(this.dom.navSliderThumb);
return;
}
this.dom.navSlider.style.cursor="pointer";
var _f4=false;
var _f5=null;
_4(this.dom.navSlider,"mousedown",function(e){
_f4=true;
_7(e);
},this,true);
_4(document,"mousemove",function(e){
if(!_f4){
return;
}
var xy=_6(e,this.dom.navSlider);
clearTimeout(_f5);
_f5=setTimeout(function(){
this.updateNavSlider(xy[0]);
}.bind(this),10);
_7(e);
},this,true);
_4(document,"mouseup",function(e){
if(!_f4){
return true;
}
_f4=false;
var xy=_6(e,this.dom.navSlider);
this.updateNavSlider(xy[0]);
return true;
},this,true);
},updateNavSlider:function(_fb){
var _fc=this.dom.navSlider._width-this.dom.navSliderThumb._width;
var _fd=this.totalMoves;
var _fe=!!_fb;
_fb=_fb||(this.moveNumber/_fd*_fc);
_fb=_fb>_fc?_fc:_fb;
_fb=_fb<0?0:_fb;
var _ff=parseInt(_fb/_fc*_fd,10);
if(_fe){
this.nowLoading();
var _100=_ff-this.cursor.node.getPosition();
for(var i=0;i<Math.abs(_100);i++){
if(_100>0){
this.variation(null,true);
}else{
if(_100<0){
this.cursor.previous();
this.moveNumber--;
}
}
}
if(_100<0){
if(this.moveNumber<0){
this.moveNumber=0;
}
this.board.revert(Math.abs(_100));
}
this.doneLoading();
this.refresh();
}
_fb=parseInt(_ff/_fd*_fc,10)||0;
this.dom.navSliderThumb.style.left=_fb+"px";
},resetLastLabels:function(){
this.labelLastNumber=1;
this.labelLastLetter="A";
},getGameDescription:function(_102){
var root=this.gameTree.trees.first().nodes.first();
var desc=(_102?"":root.GN||this.gameName);
if(root.PW&&root.PB){
var wr=root.WR?" "+root.WR:"";
var br=root.BR?" "+root.BR:"";
desc+=(desc.length?" - ":"")+root.PW+wr+" vs "+root.PB+br;
}
return desc;
},sgfCoordToPoint:function(_107){
if(!_107||_107=="tt"){
return {x:null,y:null};
}
var _108={a:0,b:1,c:2,d:3,e:4,f:5,g:6,h:7,i:8,j:9,k:10,l:11,m:12,n:13,o:14,p:15,q:16,r:17,s:18};
return {x:_108[_107.charAt(0)],y:_108[_107.charAt(1)]};
},pointToSgfCoord:function(pt){
if(!pt||!this.boundsCheck(pt.x,pt.y,[0,this.board.boardSize-1])){
return null;
}
var pts={0:"a",1:"b",2:"c",3:"d",4:"e",5:"f",6:"g",7:"h",8:"i",9:"j",10:"k",11:"l",12:"m",13:"n",14:"o",15:"p",16:"q",17:"r",18:"s"};
return pts[pt.x]+pts[pt.y];
},expandCompressedPoints:function(_10b){
var _10c;
var ul,lr;
var x,y;
var _111=[];
var hits=[];
for(var i=0;i<_10b.length;i++){
_10c=_10b[i].split(/:/);
if(_10c.length>1){
ul=this.sgfCoordToPoint(_10c[0]);
lr=this.sgfCoordToPoint(_10c[1]);
for(x=ul.x;x<=lr.x;x++){
for(y=ul.y;y<=lr.y;y++){
_111.push(this.pointToSgfCoord({x:x,y:y}));
}
}
hits.push(i);
}
}
_10b=_10b.concat(_111);
return _10b;
},setPermalink:function(){
if(!this.permalinkable){
return true;
}
if(this.unsavedChanges){
alert(eidogo.i18n["unsaved changes"]);
return;
}
this.hook("setPermalink");
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
this.domLoading.className="eidogo-loading"+(this.theme?" theme-"+this.theme:"");
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

(function(){
var _1=window.eidogoConfig||{};
var _2=eidogo.util.getPlayerPath();
var _3=eidogo.playerPath=(_1.playerPath||_2||"player").replace(/\/$/,"");
if(!_1.skipCss){
eidogo.util.addStyleSheet(_3+"/css/player.css");
if(eidogo.browser.ie&&parseInt(eidogo.browser.ver,10)<=6){
eidogo.util.addStyleSheet(_3+"/css/player-ie6.css");
}
}
eidogo.util.addEvent(window,"load",function(){
eidogo.autoPlayers=[];
var _4=[];
var _5=document.getElementsByTagName("div");
var _6=_5.length;
for(var i=0;i<_6;i++){
if(eidogo.util.hasClass(_5[i],"eidogo-player-auto")){
_4.push(_5[i]);
}
}
var el;
for(var i=0;el=_4[i];i++){
var _9={container:el,disableShortcuts:true,theme:"compact"};
for(var _a in _1){
_9[_a]=_1[_a];
}
var _b=el.getAttribute("sgf");
if(_b){
_9.sgfUrl=_b;
}else{
if(el.innerHTML){
_9.sgf=el.innerHTML;
}
}
el.innerHTML="";
eidogo.util.show(el);
var _c=new eidogo.Player(_9);
eidogo.autoPlayers.push(_c);
}
});
})();

