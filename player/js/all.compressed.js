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
eidogo.util={byId:function(id){
return document.getElementById(id);
},ajax:function(_2,_3,_4,_5,_6,_7,_8){
_2=_2.toUpperCase();
var _9=window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest();
var qs=null;
if(_4&&typeof _4=="object"){
var _b=[];
for(var _c in _4){
if(_4[_c]&&_4[_c].constructor==Array){
for(var i=0;i<_4[_c].length;i++){
_b.push(encodeURIComponent(_c)+"="+encodeURIComponent(_4[_c]));
}
}else{
_b.push(encodeURIComponent(_c)+"="+encodeURIComponent(_4[_c]));
}
}
qs=_b.join("&").replace(/%20/g,"+");
}
if(qs&&_2=="GET"){
_3+=(_3.match(/\?/)?"&":"?")+qs;
qs=null;
}
_9.open(_2,_3,true);
if(qs){
_9.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}
var _e=false;
var _f=/webkit/.test(navigator.userAgent.toLowerCase());
function httpSuccess(r){
try{
return !r.status&&location.protocol=="file:"||(r.status>=200&&r.status<300)||r.status==304||_f&&r.status==undefined;
}
catch(e){
}
return false;
}
function handleReadyState(_11){
if(!_e&&_9&&(_9.readyState==4||_11=="timeout")){
_e=true;
if(_12){
clearInterval(_12);
_12=null;
}
var _13=_11=="timeout"&&"timeout"||!httpSuccess(_9)&&"error"||"success";
if(_13=="success"){
_5.call(_7,_9);
}else{
_6.call(_7);
}
_9=null;
}
}
var _12=setInterval(handleReadyState,13);
if(_8){
setTimeout(function(){
if(_9){
_9.abort();
if(!_e){
handleReadyState("timeout");
}
}
},_8);
}
_9.send(qs);
return _9;
},addEventHelper:function(_14,_15,_16){
if(_14.addEventListener){
_14.addEventListener(_15,_16,false);
}else{
if(!eidogo.util.addEventId){
eidogo.util.addEventId=1;
}
if(!_16.$$guid){
_16.$$guid=eidogo.util.addEventId++;
}
if(!_14.events){
_14.events={};
}
var _17=_14.events[_15];
if(!_17){
_17=_14.events[_15]={};
if(_14["on"+_15]){
_17[0]=_14["on"+_15];
}
}
_17[_16.$$guid]=_16;
_14["on"+_15]=eidogo.util.handleEvent;
}
},handleEvent:function(_18){
var _19=true;
_18=_18||((this.ownerDocument||this.document||this).parentWindow||window).event;
var _1a=this.events[_18.type];
for(var i in _1a){
this.$$handleEvent=_1a[i];
if(this.$$handleEvent(_18)===false){
_19=false;
}
}
return _19;
},addEvent:function(el,_1d,_1e,arg,_20){
if(_20){
_1e=_1e.bind(arg);
}else{
if(arg){
var _21=_1e;
_1e=function(e){
_21(e,arg);
};
}
}
eidogo.util.addEventHelper(el,_1d,_1e);
},onClick:function(el,_24,_25){
eidogo.util.addEvent(el,"click",_24,_25,true);
},getElClickXY:function(e,el){
if(!e.pageX){
e.pageX=e.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft);
e.pageY=e.clientY+(document.documentElement.scrollTop||document.body.scrollTop);
}
if(!el._x){
var _28=eidogo.util.getElXY(el),elX=_28[0],elY=_28[1];
el._x=elX;
el._y=elY;
}else{
var elX=el._x;
var elY=el._y;
}
return [e.pageX-elX,e.pageY-elY];
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
},show:function(el,_3c){
_3c=_3c||"block";
if(typeof el=="string"){
el=eidogo.util.byId(el);
}
if(!el){
return;
}
el.style.display=_3c;
},hide:function(el){
if(typeof el=="string"){
el=eidogo.util.byId(el);
}
if(!el){
return;
}
el.style.display="none";
},getElXY:function(el){
if(el._x&&el._y){
return [el._x,el._y];
}
var _3f=el,elX=0,elY=0;
while(_3f){
elX+=_3f.offsetLeft;
elY+=_3f.offsetTop;
_3f=_3f.offsetParent?_3f.offsetParent:null;
}
el._x=elX;
el._y=elY;
return [elX,elY];
},getElX:function(el){
return this.getElXY(el)[0];
},getElY:function(el){
return this.getElXY(el)[1];
},addStyleSheet:function(_44){
if(document.createStyleSheet){
document.createStyleSheet(_44);
}else{
var _45=document.createElement("link");
_45.rel="stylesheet";
_45.type="text/css";
_45.href=_44;
document.getElementsByTagName("head")[0].appendChild(_45);
}
},getPlayerPath:function(){
var _46=document.getElementsByTagName("script");
var _47;
var _48;
for(var i=0;_48=_46[i];i++){
if(/(all\.compressed\.js|eidogo\.js)/.test(_48.src)){
_47=_48.src.replace(/\/js\/[^\/]+$/,"");
}
}
return _47;
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
}
var _2b=this.node.parent.trees;
var _2c;
for(var i=0;_2c=_2b[i];i++){
_2a[_2c.nodes[0].getMove()]=i;
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
eidogo.BoardRendererHtml.prototype={init:function(_1f,_20,_21){
if(!_1f){
throw "No DOM container";
return;
}
this.boardSize=_20||19;
var _22=document.createElement("div");
_22.className="board-gutter"+(this.boardSize==19?" with-coords":"");
_1f.appendChild(_22);
var _23=document.createElement("div");
_23.className="board size"+this.boardSize;
_22.appendChild(_23);
this.domNode=_23;
this.player=_21;
this.uniq=_1f.id+"-";
this.renderCache={stones:[].setLength(this.boardSize,0).addDimension(this.boardSize,0),markers:[].setLength(this.boardSize,0).addDimension(this.boardSize,0)};
this.pointWidth=0;
this.pointHeight=0;
this.margin=0;
var _24=this.renderStone({x:0,y:0},"black");
this.pointWidth=this.pointHeight=_24.offsetWidth;
this.renderStone({x:0,y:0},"white");
this.renderMarker({x:0,y:0},"current");
this.clear();
this.margin=(this.domNode.offsetWidth-(this.boardSize*this.pointWidth))/2;
this.dom={};
this.dom.searchRegion=document.createElement("div");
this.dom.searchRegion.id=this.uniq+"search-region";
this.dom.searchRegion.className="search-region";
this.domNode.appendChild(this.dom.searchRegion);
eidogo.util.addEvent(this.domNode,"mousemove",this.handleHover,this,true);
eidogo.util.addEvent(this.domNode,"mousedown",this.handleMouseDown,this,true);
eidogo.util.addEvent(this.domNode,"mouseup",this.handleMouseUp,this,true);
},showRegion:function(_25){
this.dom.searchRegion.style.top=(this.margin+this.pointHeight*_25[0])+"px";
this.dom.searchRegion.style.left=(this.margin+this.pointWidth*_25[1])+"px";
this.dom.searchRegion.style.width=this.pointWidth*_25[2]+"px";
this.dom.searchRegion.style.height=this.pointHeight*_25[3]+"px";
eidogo.util.show(this.dom.searchRegion);
},hideRegion:function(){
eidogo.util.hide(this.dom.searchRegion);
},clear:function(){
this.domNode.innerHTML="";
},renderStone:function(pt,_27){
var _28=document.getElementById(this.uniq+"stone-"+pt.x+"-"+pt.y);
if(_28){
_28.parentNode.removeChild(_28);
}
if(_27!="empty"){
var div=document.createElement("div");
div.id=this.uniq+"stone-"+pt.x+"-"+pt.y;
div.className="point stone "+_27;
div.style.left=(pt.x*this.pointWidth+this.margin)+"px";
div.style.top=(pt.y*this.pointHeight+this.margin)+"px";
this.domNode.appendChild(div);
return div;
}
return null;
},renderMarker:function(pt,_2b){
if(this.renderCache.markers[pt.x][pt.y]){
var _2c=document.getElementById(this.uniq+"marker-"+pt.x+"-"+pt.y);
if(_2c){
_2c.parentNode.removeChild(_2c);
}
}
if(_2b=="empty"||!_2b){
this.renderCache.markers[pt.x][pt.y]=0;
return null;
}
this.renderCache.markers[pt.x][pt.y]=1;
if(_2b){
var _2d="";
switch(_2b){
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
if(_2b.indexOf("var:")==0){
_2d=_2b.substring(4);
_2b="variation";
}else{
_2d=_2b;
_2b="label";
}
break;
}
var div=document.createElement("div");
div.id=this.uniq+"marker-"+pt.x+"-"+pt.y;
div.className="point marker "+_2b;
div.style.left=(pt.x*this.pointWidth+this.margin)+"px";
div.style.top=(pt.y*this.pointHeight+this.margin)+"px";
div.appendChild(document.createTextNode(_2d));
this.domNode.appendChild(div);
return div;
}
return null;
},setCursor:function(_2f){
this.domNode.style.cursor=_2f;
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
var _37=eidogo.util.getElClickXY(e,this.domNode);
var m=this.margin;
var pw=this.pointWidth;
var ph=this.pointHeight;
var x=Math.round((_37[0]-m-(pw/2))/pw);
var y=Math.round((_37[1]-m-(ph/2))/ph);
return [x,y];
}};
eidogo.BoardRendererFlash=function(){
this.init.apply(this,arguments);
};
eidogo.BoardRendererFlash.prototype={init:function(_3d,_3e,_3f){
if(!_3d){
throw "No DOM container";
return;
}
this.ready=false;
this.swf=null;
this.unrendered=[];
var _40=_3d.id+"-board";
var so=new SWFObject(eidogo.playerPath+"/swf/board.swf",_40,"421","421","8","#665544");
so.addParam("allowScriptAccess","sameDomain");
so.write(_3d);
var _42=0;
var _43=function(){
swf=eidogo.util.byId(_40);
if(!swf||!swf.init){
if(_42>2000){
throw "Error initializing board";
return;
}
setTimeout(arguments.callee.bind(this),10);
_42+=10;
return;
}
this.swf=swf;
this.swf.init(_3f.uniq,_3e);
this.ready=true;
}.bind(this);
_43();
},showRegion:function(_44){
},hideRegion:function(){
},clear:function(){
if(!this.swf){
return;
}
this.swf.clear();
},renderStone:function(pt,_46){
if(!this.swf){
this.unrendered.push(["stone",pt,_46]);
return;
}
for(var i=0;i<this.unrendered.length;i++){
if(this.unrendered[i][0]=="stone"){
this.swf.renderStone(this.unrendered[i][1],this.unrendered[i][2]);
}
}
this.unrendered=[];
this.swf.renderStone(pt,_46);
},renderMarker:function(pt,_49){
if(!_49){
return;
}
if(!this.swf){
this.unrendered.push(["marker",pt,_49]);
return;
}
for(var i=0;i<this.unrendered.length;i++){
if(this.unrendered[i][0]=="marker"){
this.swf.renderMarker(this.unrendered[i][1],this.unrendered[i][2]);
}
}
this.unrendered=[];
this.swf.renderMarker(pt,_49);
},setCursor:function(_4b){
}};
eidogo.BoardRendererAscii=function(_4c,_4d){
this.init(_4c,_4d);
};
eidogo.BoardRendererAscii.prototype={pointWidth:2,pointHeight:1,margin:1,blankBoard:"+-------------------------------------+\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"+-------------------------------------+",init:function(_4e,_4f){
this.domNode=_4e||null;
this.boardSize=_4f||19;
this.content=this.blankBoard;
},clear:function(){
this.content=this.blankBoard;
this.domNode.innerHTML="<pre>"+this.content+"</pre>";
},renderStone:function(pt,_51){
var _52=(this.pointWidth*this.boardSize+this.margin*2)*(pt.y*this.pointHeight+1)+(pt.x*this.pointWidth)+2;
this.content=this.content.substring(0,_52-1)+"."+this.content.substring(_52);
if(_51!="empty"){
this.content=this.content.substring(0,_52-1)+(_51=="white"?"O":"#")+this.content.substring(_52);
}
this.domNode.innerHTML="<pre>"+this.content+"</pre>";
},renderMarker:function(pt,_54){
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
var t=eidogo.i18n,_2=eidogo.util.byId,_3=eidogo.util.ajax,_4=eidogo.util.addEvent,_5=eidogo.util.onClick,_6=eidogo.util.getElClickXY,_7=eidogo.util.stopEvent,_8=eidogo.util.addClass,_9=eidogo.util.removeClass,_a=eidogo.util.show,_b=eidogo.util.hide,_c=eidogo.util.getPlayerPath(),ua=navigator.userAgent.toLowerCase(),_e=/mozilla/.test(ua)&&!/(compatible|webkit)/.test(ua);
eidogo.players=eidogo.players||{};
eidogo.delegate=function(_f,fn){
var _11=eidogo.players[_f];
_11[fn].apply(_11,Array.from(arguments).slice(2));
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
this.constructDom();
if(cfg.enableShortcuts){
_4(document,_e?"keypress":"keydown",this.handleKeypress,this,true);
}
_4(document,"mouseup",this.handleDocMouseUp,this,true);
if(cfg.sgf||cfg.sgfUrl||(cfg.sgfPath&&cfg.gameName)){
this.loadSgf(cfg);
}
this.hook("initDone");
},hook:function(_13,_14){
if(_13 in this.hooks){
this.hooks[_13].bind(this)(_14);
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
this.prefs={};
this.prefs.markCurrent=typeof cfg.markCurrent!="undefined"?!!cfg.markCurrent:true;
this.prefs.markNext=typeof cfg.markNext!="undefined"?cfg.markNext:false;
this.prefs.markVariations=typeof cfg.markVariations!="undefined"?!!cfg.markVariations:true;
this.prefs.showGameInfo=!!cfg.showGameInfo;
this.prefs.showPlayerInfo=!!cfg.showPlayerInfo;
this.prefs.showTools=!!cfg.showTools;
this.prefs.showComments=typeof cfg.showComments!="undefined"?!!cfg.showComments:true;
this.prefs.showOptions=!!cfg.showOptions;
},loadSgf:function(cfg,_17){
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
this.remoteLoad(cfg.sgfUrl,null,false,null,_17);
var _19=true;
if(cfg.progressiveLoad){
this.progressiveLoads=0;
this.progressiveUrl=cfg.progressiveUrl||cfg.sgfUrl.replace(/\?.+$/,"");
}
}else{
var _1a=cfg.boardSize||"19";
var _1b={nodes:[],trees:[{nodes:[{SZ:_1a}],trees:[]}]};
if(cfg.opponentUrl){
this.opponentUrl=cfg.opponentUrl;
this.opponentColor=cfg.opponentColor=="B"?cfg.opponentColor:"W";
var _1c=_1b.trees.first().nodes.first();
_1c.PW=t["you"];
_1c.PB="GNU Go";
this.gameName="gnugo";
}
this.load(_1b);
}
}
}
if(!_19&&typeof _17=="function"){
_17();
}
},initGame:function(_1d){
this.handleDisplayPrefs();
var _1e=_1d.trees.first().nodes.first();
var _1f=_1e.SZ;
if(!this.board){
this.createBoard(_1f||19);
this.rules=new eidogo.Rules(this.board);
}
this.unsavedChanges=false;
this.resetCursor(true);
this.totalMoves=0;
var _20=new eidogo.GameCursor(this.cursor.node);
while(_20.next()){
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
},createBoard:function(_21){
_21=_21||19;
if(this.board&&this.board.renderer&&this.board.boardSize==_21){
return;
}
try{
this.dom.boardContainer.innerHTML="";
var _22=new eidogo.BoardRendererHtml(this.dom.boardContainer,_21,this);
this.board=new eidogo.Board(_22,_21);
}
catch(e){
if(e=="No DOM container"){
this.croak(t["error board"]);
return;
}
}
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
},goTo:function(_42,_43){
_43=typeof _43!="undefined"?_43:true;
var _44;
var _45;
if(_42 instanceof Array){
if(!_42.length){
return;
}
if(_43){
this.resetCursor(true);
}
while(_42.length){
_44=_42[0];
if(isNaN(parseInt(_44,10))){
_45=this.getVariations(true);
if(!_45.length||_45[0].move==null){
this.variation(null,true);
if(this.progressiveLoads){
this.loadPath.push(_44);
return;
}
}
for(var i=0;i<_45.length;i++){
if(_45[i].move==_44){
this.variation(_45[i].treeNum,true);
break;
}
}
_42.shift();
}else{
_44=parseInt(_42.shift(),10);
if(_42.length==0){
for(var i=0;i<_44;i++){
this.variation(null,true);
}
}else{
if(_42.length){
this.variation(_44,true);
if(_42.length!=1){
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
if(!isNaN(parseInt(_42,10))){
var _47=parseInt(_42,10);
if(_43){
this.resetCursor(true);
_47++;
}
for(var i=0;i<_47;i++){
this.variation(null,true);
}
this.refresh();
}else{
alert(t["bad path"]+" "+_42);
}
}
},resetCursor:function(_48,_49){
this.board.reset();
this.currentColor="B";
this.moveNumber=0;
if(_49){
this.cursor.node=this.gameTree.trees.first().nodes.first();
}else{
this.cursor.node=this.gameTree.nodes.first();
}
this.refresh(_48);
},refresh:function(_4a){
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
this.execNode(_4a);
},variation:function(_4c,_4d){
if(this.cursor.next(_4c)){
this.execNode(_4d);
this.resetLastLabels();
if(this.progressiveLoads){
return false;
}
return true;
}
return false;
},execNode:function(_4e,_4f){
if(!_4f&&this.progressiveLoads){
var me=this;
setTimeout(function(){
me.execNode.call(me,_4e);
},10);
return;
}
if(!_4e){
this.dom.comments.innerHTML="";
this.board.clearMarkers();
}
if(this.moveNumber<1){
this.currentColor="B";
}
var _51=this.cursor.node.getProperties();
for(var _52 in _51){
if(this.propertyHandlers[_52]){
(this.propertyHandlers[_52]).apply(this,[this.cursor.node[_52],_52,_4e]);
}
}
if(_4e){
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
if(!_4f&&this.progressiveUrl&&!this.cursor.node.parent.cached){
this.nowLoading();
this.progressiveLoads++;
this.remoteLoad(this.progressiveUrl+"?id="+this.cursor.node.parent.id,this.cursor.node.parent);
}
},findVariations:function(){
this.variations=this.getVariations(this.prefs.markNext);
},getVariations:function(_53){
var _54=[];
if(!this.cursor.node){
return _54;
}
if(_53&&this.cursor.node.nextSibling!=null){
_54.push({move:this.cursor.node.nextSibling.getMove(),treeNum:null});
}
if(this.cursor.node.nextSibling==null&&this.cursor.node.parent&&this.cursor.node.parent.trees.length){
var _55=this.cursor.node.parent.trees;
for(var i=0;i<_55.length;i++){
_54.push({move:_55[i].nodes.first().getMove(),treeNum:i});
}
}
return _54;
},back:function(e,obj,_59){
if(this.cursor.previous()){
this.moveNumber--;
if(this.moveNumber<0){
this.moveNumber=0;
}
this.board.revert(1);
this.refresh(_59);
this.resetLastLabels();
}
},forward:function(e,obj,_5c){
this.variation(null,_5c);
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
var _67=this.pointToSgfCoord({x:x,y:y});
if(this.mode=="play"){
for(var i=0;i<this.variations.length;i++){
var _69=this.sgfCoordToPoint(this.variations[i].move);
if(_69.x==x&&_69.y==y){
this.variation(this.variations[i].treeNum);
_7(e);
return;
}
}
if(!this.rules.check({x:x,y:y},this.currentColor)){
return;
}
if(_67){
var _6a=this.cursor.getNextMoves();
if(_6a&&_67 in _6a){
this.variation(_6a[_67]);
}else{
this.createMove(_67);
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
var _6b;
var _6c=this.board.getStone({x:x,y:y});
if(this.mode=="add_b"||this.mode=="add_w"){
this.cursor.node.emptyPoint(this.pointToSgfCoord({x:x,y:y}));
if(_6c!=this.board.BLACK&&this.mode=="add_b"){
_6b="AB";
}else{
if(_6c!=this.board.WHITE&&this.mode=="add_w"){
_6b="AW";
}else{
_6b="AE";
}
}
}else{
switch(this.mode){
case "tr":
_6b="TR";
break;
case "sq":
_6b="SQ";
break;
case "cr":
_6b="CR";
break;
case "x":
_6b="MA";
break;
case "dim":
_6b="DD";
break;
case "number":
_6b="LB";
_67=_67+":"+this.labelLastNumber;
this.labelLastNumber++;
break;
case "letter":
_6b="LB";
_67=_67+":"+this.labelLastLetter;
this.labelLastLetter=String.fromCharCode(this.labelLastLetter.charCodeAt(0)+1);
}
}
this.cursor.node.pushProperty(_6b,_67);
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
},boundsCheck:function(x,y,_70){
if(_70.length==2){
_70[3]=_70[2]=_70[1];
_70[1]=_70[0];
}
return (x>=_70[0]&&y>=_70[1]&&x<=_70[2]&&y<=_70[3]);
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
var _75=this.getRegionBounds();
this.board.renderer.showRegion(_75);
},hideRegion:function(){
this.board.renderer.hideRegion();
},loadSearch:function(q,dim,p,a){
var _7a={nodes:[],trees:[{nodes:[{SZ:this.board.boardSize}],trees:[]}]};
this.load(_7a);
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
var _85=this.dom.searchAlgo.value;
var _86=this.getRegionBounds();
var _87=this.board.getRegion(_86[0],_86[1],_86[2],_86[3]);
var _88=_87.join("").replace(new RegExp(this.board.EMPTY,"g"),".").replace(new RegExp(this.board.BLACK,"g"),"x").replace(new RegExp(this.board.WHITE,"g"),"o");
var _89=/^\.*$/.test(_88);
var _8a=/^\.*O\.*$/.test(_88);
var _8b=/^\.*X\.*$/.test(_88);
if(_89||_8a||_8b){
this.searching=false;
_a(this.dom.comments);
_b(this.dom.searchContainer);
this.prependComment(t["two stones"]);
return;
}
var _8c=[];
if(_86[0]==0){
_8c.push("n");
}
if(_86[1]==0){
_8c.push("w");
}
if(_86[0]+_86[3]==this.board.boardSize){
_8c.push("s");
}
if(_86[1]+_86[2]==this.board.boardSize){
_8c.push("e");
}
if(_85=="corner"&&!(_8c.length==2&&((_8c.contains("n")&&_8c.contains("e"))||(_8c.contains("n")&&_8c.contains("w"))||(_8c.contains("s")&&_8c.contains("e"))||(_8c.contains("s")&&_8c.contains("w"))))){
this.searching=false;
_a(this.dom.comments);
_b(this.dom.searchContainer);
this.prependComment(t["two edges"]);
return;
}
var _8d=(_8c.contains("n")?"n":"s");
_8d+=(_8c.contains("w")?"w":"e");
this.showComments("");
this.gameName="search";
var _8e=function(req){
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
var _90=eval("("+req.responseText+")");
var _91;
var _92="";
var odd;
for(var i=0;_91=_90[i];i++){
odd=odd?false:true;
_92+="<a class='search-result"+(odd?" odd":"")+"' href='#'>                    <span class='id'>"+_91.id+"</span>                    <span class='mv'>"+_91.mv+"</span>                    <span class='pw'>"+_91.pw+" "+_91.wr+"</span>                    <span class='pb'>"+_91.pb+" "+_91.br+"</span>                    <span class='re'>"+_91.re+"</span>                    <span class='dt'>"+_91.dt+"</span>                    <div class='clear'>&nbsp;</div>                    </a>";
}
_a(this.dom.searchResultsContainer);
this.dom.searchResults.innerHTML=_92;
this.dom.searchCount.innerHTML=_90.length;
};
var _95=function(req){
this.croak(t["error retrieving"]);
};
var _97={q:_8d,w:_86[2],h:_86[3],p:_88,a:_85,t:(new Date()).getTime()};
this.progressiveLoad=false;
this.progressiveUrl=null;
this.prefs.markNext=false;
this.prefs.showPlayerInfo=true;
this.hook("searchRegion",_97);
this.nowLoading();
_3("get",this.searchUrl,_97,_8e,_95,this,45000);
},loadSearchResult:function(e){
this.nowLoading();
var _99=e.target||e.srcElement;
if(_99.nodeName=="SPAN"){
_99=_99.parentNode;
}
if(_99.nodeName=="A"){
var _9a;
var id;
var mv;
for(var i=0;_9a=_99.childNodes[i];i++){
if(_9a.className=="id"){
id=_9a.innerHTML;
}
if(_9a.className=="mv"){
mv=parseInt(_9a.innerHTML,10);
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
},compressPattern:function(_9e){
var c=null;
var pc="";
var n=1;
var ret="";
for(var i=0;i<_9e.length;i++){
c=_9e.charAt(i);
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
},uncompressPattern:function(_a4){
var c=null;
var s=null;
var n="";
var ret="";
for(var i=0;i<_a4.length;i++){
c=_a4.charAt(i);
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
},createMove:function(_ab){
var _ac={};
_ac[this.currentColor]=_ab;
_ac["MN"]=(++this.moveNumber).toString();
var _ad=new eidogo.GameNode(_ac);
this.totalMoves++;
if(this.cursor.hasNext()){
if(this.cursor.node.nextSibling){
this.cursor.node.parent.createVariationTree(this.cursor.node.getPosition());
}
this.cursor.node.parent.appendTree(new eidogo.GameTree({nodes:[_ad],trees:[]}));
this.variation(this.cursor.node.parent.trees.length-1);
}else{
this.cursor.node.parent.appendNode(_ad);
this.variation();
}
this.unsavedChanges=true;
},handleKeypress:function(e){
if(this.editingComment){
return true;
}
var _af=e.keyCode||e.charCode;
if(!_af||e.ctrlKey||e.altKey||e.metaKey){
return true;
}
var _b0=String.fromCharCode(_af).toLowerCase();
for(var i=0;i<this.variations.length;i++){
var _b2=this.sgfCoordToPoint(this.variations[i].move);
var _b3=""+(i+1);
if(_b2.x!=null&&this.board.getMarker(_b2)!=this.board.EMPTY&&typeof this.board.getMarker(_b2)=="string"){
_b3=this.board.getMarker(_b2).toLowerCase();
}
_b3=_b3.replace(/^var:/,"");
if(_b0==_b3.charAt(0)){
this.variation(this.variations[i].treeNum);
_7(e);
return;
}
}
if(_af==112||_af==27){
this.selectTool("play");
}
var _b4=true;
switch(_af){
case 32:
if(e.shiftKey){
this.back();
}else{
this.forward();
}
break;
case 39:
if(e.shiftKey){
var _b5=this.totalMoves-this.moveNumber;
var _b6=(_b5>9?9:_b5-1);
for(var i=0;i<_b6;i++){
this.forward(null,null,true);
}
}
this.forward();
break;
case 37:
if(e.shiftKey){
var _b6=(this.moveNumber>9?9:this.moveNumber-1);
for(var i=0;i<_b6;i++){
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
_b4=false;
break;
}
if(_b4){
_7(e);
}
},showInfo:function(){
this.dom.infoGame.innerHTML="";
this.dom.whiteName.innerHTML="";
this.dom.blackName.innerHTML="";
var _b7=this.gameTree.trees.first().nodes.first();
var dl=document.createElement("dl");
for(var _b9 in this.infoLabels){
if(_b7[_b9] instanceof Array){
_b7[_b9]=_b7[_b9][0];
}
if(_b7[_b9]){
if(_b9=="PW"){
this.dom.whiteName.innerHTML=_b7[_b9]+(_b7["WR"]?", "+_b7["WR"]:"");
continue;
}else{
if(_b9=="PB"){
this.dom.blackName.innerHTML=_b7[_b9]+(_b7["BR"]?", "+_b7["BR"]:"");
continue;
}
}
if(_b9=="WR"||_b9=="BR"){
continue;
}
if(_b9=="DT"){
var _ba=_b7[_b9].split(/[\.-]/);
if(_ba.length==3){
_b7[_b9]=_ba[2].replace(/^0+/,"")+" "+this.months[_ba[1]-1]+" "+_ba[0];
}
}
var dt=document.createElement("dt");
dt.innerHTML=this.infoLabels[_b9]+":";
var dd=document.createElement("dd");
dd.innerHTML=_b7[_b9];
dl.appendChild(dt);
dl.appendChild(dd);
}
}
this.dom.infoGame.appendChild(dl);
},selectTool:function(_bd){
var _be;
_b(this.dom.scoreEst);
if(_bd=="region"){
_be="crosshair";
}else{
if(_bd=="comment"){
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
_be="default";
this.regionBegun=false;
this.hideRegion();
_b(this.dom.searchButton);
_b(this.dom.searchAlgo);
if(this.searchUrl){
_a(this.dom.scoreEst,"inline");
}
}
}
this.board.renderer.setCursor(_be);
this.mode=_bd;
this.dom.toolsSelect.value=_bd;
},finishEditComment:function(){
var _c0=this.cursor.node.C;
var _c1=this.dom.commentsEditTa.value;
if(_c0!=_c1){
this.unsavedChanges=true;
this.cursor.node.C=_c1;
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
var _c3=i+1;
if(!this.variations[i].move||this.variations[i].move=="tt"){
_8(this.dom.controlPass,"pass-on");
}else{
var _c4=this.sgfCoordToPoint(this.variations[i].move);
if(this.board.getMarker(_c4)!=this.board.EMPTY){
_c3=this.board.getMarker(_c4);
}
if(this.prefs.markVariations){
this.board.addMarker(_c4,"var:"+_c3);
}
}
var _c5=document.createElement("div");
_c5.className="variation-nav";
_c5.innerHTML=_c3;
_4(_c5,"click",function(e,arg){
arg.me.variation(arg.treeNum);
},{me:this,treeNum:this.variations[i].treeNum});
this.dom.variations.appendChild(_c5);
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
var _c8="";
if(!this.prefs.showPlayerInfo){
_c8+=this.getGameDescription(true);
}
if(!this.prefs.showGameInfo){
_c8+=this.dom.infoGame.innerHTML;
}
if(_c8.length){
this.prependComment(_c8,"comment-info");
}
}
if(!this.progressiveLoad){
this.updateNavSlider();
}
},setColor:function(_c9){
this.prependComment(_c9=="B"?t["black to play"]:t["white to play"]);
this.currentColor=_c9;
},setMoveNumber:function(num){
this.moveNumber=num;
},playMove:function(_cb,_cc,_cd){
_cc=_cc||this.currentColor;
this.currentColor=(_cc=="B"?"W":"B");
_cc=_cc=="W"?this.board.WHITE:this.board.BLACK;
var pt=this.sgfCoordToPoint(_cb);
if(!this.cursor.node["MN"]){
this.moveNumber++;
}
if((!_cb||_cb=="tt"||_cb=="")&&!_cd){
this.prependComment((_cc==this.board.WHITE?t["white"]:t["black"])+" "+t["passed"],"comment-pass");
}else{
if(_cb=="resign"){
this.prependComment((_cc==this.board.WHITE?t["white"]:t["black"])+" "+t["resigned"],"comment-resign");
}else{
if(_cb&&_cb!="tt"){
this.board.addStone(pt,_cc);
this.rules.apply(pt,_cc);
if(this.prefs.markCurrent&&!_cd){
this.addMarker(_cb,"current");
}
}
}
}
},addStone:function(_cf,_d0){
if(!(_cf instanceof Array)){
_cf=[_cf];
}
_cf=this.expandCompressedPoints(_cf);
for(var i=0;i<_cf.length;i++){
this.board.addStone(this.sgfCoordToPoint(_cf[i]),_d0=="AW"?this.board.WHITE:_d0=="AB"?this.board.BLACK:this.board.EMPTY);
}
},addMarker:function(_d2,_d3){
if(!(_d2 instanceof Array)){
_d2=[_d2];
}
_d2=this.expandCompressedPoints(_d2);
var _d4;
for(var i=0;i<_d2.length;i++){
switch(_d3){
case "TR":
_d4="triangle";
break;
case "SQ":
_d4="square";
break;
case "CR":
_d4="circle";
break;
case "MA":
_d4="ex";
break;
case "TW":
_d4="territory-white";
break;
case "TB":
_d4="territory-black";
break;
case "DD":
_d4="dim";
break;
case "LB":
_d4=(_d2[i].split(":"))[1];
_d2[i];
break;
default:
_d4=_d3;
break;
}
this.board.addMarker(this.sgfCoordToPoint((_d2[i].split(":"))[0]),_d4);
}
},showTime:function(_d6,_d7){
var tp=(_d7=="BL"||_d7=="OB"?"timeB":"timeW");
if(_d7=="BL"||_d7=="WL"){
var _d9=Math.floor(_d6/60);
var _da=(_d6%60).toFixed(0);
_da=(_da<10?"0":"")+_da;
this[tp]=_d9+":"+_da;
}else{
this[tp]+=" ("+_d6+")";
}
},showAnnotation:function(_db,_dc){
var msg;
switch(_dc){
case "N":
msg=_db;
break;
case "GB":
msg=(_db>1?t["vgb"]:t["gb"]);
break;
case "GW":
msg=(_db>1?t["vgw"]:t["gw"]);
break;
case "DM":
msg=(_db>1?t["dmj"]:t["dm"]);
break;
case "UC":
msg=t["uc"];
break;
case "TE":
msg=t["te"];
break;
case "BM":
msg=(_db>1?t["vbm"]:t["bm"]);
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
},showComments:function(_de,_df,_e0){
if(!_de||_e0){
return;
}
this.dom.comments.innerHTML+=_de.replace(/\n/g,"<br />");
},prependComment:function(_e1,cls){
cls=cls||"comment-status";
this.dom.comments.innerHTML="<div class='"+cls+"'>"+_e1+"</div>"+this.dom.comments.innerHTML;
},downloadSgf:function(evt){
_7(evt);
if(this.downloadUrl){
if(this.unsavedChanges){
alert(t["unsaved changes"]);
return;
}
location.href=this.downloadUrl+this.gameName;
}else{
if(_e){
location.href="data:text/plain,"+encodeURIComponent(this.gameTree.trees.first().toSgf());
}
}
},save:function(evt){
_7(evt);
var _e5=function(req){
this.hook("saved",[req.responseText]);
};
var _e7=function(req){
this.croak(t["error retrieving"]);
};
var sgf=this.gameTree.trees.first().toSgf();
_3("POST",this.saveUrl,{sgf:sgf},_e5,_e7,this,30000);
},constructDom:function(){
this.dom.player=document.createElement("div");
this.dom.player.className="eidogo-player"+(this.theme?" theme-"+this.theme:"");
this.dom.player.id="player-"+this.uniq;
this.dom.container.innerHTML="";
eidogo.util.show(this.dom.container);
this.dom.container.appendChild(this.dom.player);
var _ea="            <div id='board-container' class='board-container'></div>            <div id='controls-container' class='controls-container'>                <ul id='controls' class='controls'>                    <li id='control-first' class='control first'>First</li>                    <li id='control-back' class='control back'>Back</li>                    <li id='control-forward' class='control forward'>Forward</li>                    <li id='control-last' class='control last'>Last</li>                    <li id='control-pass' class='control pass'>Pass</li>                </ul>                <div id='move-number' class='move-number"+(this.permalinkable?" permalink":"")+"'></div>                <div id='nav-slider' class='nav-slider'>                    <div id='nav-slider-thumb' class='nav-slider-thumb'></div>                </div>                <div id='variations-container' class='variations-container'>                    <div id='variations-label' class='variations-label'>"+t["variations"]+":</div>                    <div id='variations' class='variations'></div>                </div>                <div class='controls-stop'></div>            </div>            <div id='tools-container' class='tools-container'"+(this.prefs.showTools?"":" style='display: none'")+">                <div id='tools-label' class='tools-label'>"+t["tool"]+":</div>                <select id='tools-select' class='tools-select'>                    <option value='play'>"+t["play"]+"</option>                    <option value='add_b'>"+t["add_b"]+"</option>                    <option value='add_w'>"+t["add_w"]+"</option>                    "+(this.searchUrl?("<option value='region'>"+t["region"]+"</option>"):"")+"                    <option value='comment'>"+t["edit comment"]+"</option>                    <option value='tr'>"+t["triangle"]+"</option>                    <option value='sq'>"+t["square"]+"</option>                    <option value='cr'>"+t["circle"]+"</option>                    <option value='x'>"+t["x"]+"</option>                    <option value='letter'>"+t["letter"]+"</option>                    <option value='number'>"+t["number"]+"</option>                    <option value='dim'>"+t["dim"]+"</option>                </select>                <input type='button' id='score-est' class='score-est-button' value='"+t["score est"]+"' />                <select id='search-algo' class='search-algo'>                    <option value='corner'>"+t["search corner"]+"</option>                    <option value='center'>"+t["search center"]+"</option>                </select>                <input type='button' id='search-button' class='search-button' value='"+t["search"]+"' />            </div>            <div id='comments' class='comments'></div>            <div id='comments-edit' class='comments-edit'>                <textarea id='comments-edit-ta' class='comments-edit-ta'></textarea>                <div id='comments-edit-done' class='comments-edit-done'>"+t["done"]+"</div>            </div>            <div id='search-container' class='search-container'>                <div id='search-close' class='search-close'>"+t["close search"]+"</div>                <p class='search-count'><span id='search-count'></span>&nbsp;"+t["matches found"]+"</p>                <div id='search-results-container' class='search-results-container'>                    <div class='search-result'>                        <span class='pw'><b>"+t["white"]+"</b></span>                        <span class='pb'><b>"+t["black"]+"</b></span>                        <span class='re'><b>"+t["result"]+"</b></span>                        <span class='dt'><b>"+t["date"]+"</b></span>                        <div class='clear'></div>                    </div>                    <div id='search-results' class='search-results'></div>                </div>            </div>            <div id='info' class='info'>                <div id='info-players' class='players'>                    <div id='white' class='player white'>                        <div id='white-name' class='name'></div>                        <div id='white-captures' class='captures'></div>                        <div id='white-time' class='time'></div>                    </div>                    <div id='black' class='player black'>                        <div id='black-name' class='name'></div>                        <div id='black-captures' class='captures'></div>                        <div id='black-time' class='time'></div>                    </div>                </div>                <div id='info-game' class='game'></div>            </div>            <div id='options' class='options'>                "+(this.saveUrl?"<a id='option-save' class='option-save' href='#'>"+t["save to server"]+"</a>":"")+"                "+(this.downloadUrl||_e?"<a id='option-download' class='option-download' href='#'>"+t["download sgf"]+"</a>":"")+"                <div class='options-stop'></div>            </div>            <div id='preferences' class='preferences'>                <div><input type='checkbox'> Show variations on board</div>                <div><input type='checkbox'> Mark current move</div>            </div>            <div id='footer' class='footer'></div>            <div id='shade' class='shade'></div>        ";
_ea=_ea.replace(/ id='([^']+)'/g," id='$1-"+this.uniq+"'");
this.dom.player.innerHTML=_ea;
var re=/ id='([^']+)-\d+'/g;
var _ec;
var id;
var _ee;
while(_ec=re.exec(_ea)){
id=_ec[0].replace(/'/g,"").replace(/ id=/,"");
_ee="";
_ec[1].split("-").forEach(function(_ef,i){
_ef=i?_ef.charAt(0).toUpperCase()+_ef.substring(1):_ef;
_ee+=_ef;
});
this.dom[_ee]=_2(id);
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
var _f3=false;
var _f4=null;
_4(this.dom.navSlider,"mousedown",function(e){
_f3=true;
_7(e);
},this,true);
_4(document,"mousemove",function(e){
if(!_f3){
return;
}
var xy=_6(e,this.dom.navSlider);
clearTimeout(_f4);
_f4=setTimeout(function(){
this.updateNavSlider(xy[0]);
}.bind(this),10);
_7(e);
},this,true);
_4(document,"mouseup",function(e){
if(!_f3){
return true;
}
_f3=false;
var xy=_6(e,this.dom.navSlider);
this.updateNavSlider(xy[0]);
return true;
},this,true);
},updateNavSlider:function(_fa){
var _fb=this.dom.navSlider._width-this.dom.navSliderThumb._width;
var _fc=this.totalMoves;
var _fd=!!_fa;
_fa=_fa||(this.moveNumber/_fc*_fb);
_fa=_fa>_fb?_fb:_fa;
_fa=_fa<0?0:_fa;
var _fe=parseInt(_fa/_fb*_fc,10);
if(_fd){
this.nowLoading();
var _ff=_fe-this.cursor.node.getPosition();
for(var i=0;i<Math.abs(_ff);i++){
if(_ff>0){
this.variation(null,true);
}else{
if(_ff<0){
this.cursor.previous();
this.moveNumber--;
}
}
}
if(_ff<0){
if(this.moveNumber<0){
this.moveNumber=0;
}
this.board.revert(Math.abs(_ff));
}
this.doneLoading();
this.refresh();
}
_fa=parseInt(_fe/_fc*_fb,10)||0;
this.dom.navSliderThumb.style.left=_fa+"px";
},resetLastLabels:function(){
this.labelLastNumber=1;
this.labelLastLetter="A";
},getGameDescription:function(_101){
var root=this.gameTree.trees.first().nodes.first();
var desc=(_101?"":root.GN||this.gameName);
if(root.PW&&root.PB){
var wr=root.WR?" "+root.WR:"";
var br=root.BR?" "+root.BR:"";
desc+=(desc.length?" - ":"")+root.PW+wr+" vs "+root.PB+br;
}
return desc;
},sgfCoordToPoint:function(_106){
if(!_106||_106=="tt"){
return {x:null,y:null};
}
var _107={a:0,b:1,c:2,d:3,e:4,f:5,g:6,h:7,i:8,j:9,k:10,l:11,m:12,n:13,o:14,p:15,q:16,r:17,s:18};
return {x:_107[_106.charAt(0)],y:_107[_106.charAt(1)]};
},pointToSgfCoord:function(pt){
if(!pt||!this.boundsCheck(pt.x,pt.y,[0,this.board.boardSize-1])){
return null;
}
var pts={0:"a",1:"b",2:"c",3:"d",4:"e",5:"f",6:"g",7:"h",8:"i",9:"j",10:"k",11:"l",12:"m",13:"n",14:"o",15:"p",16:"q",17:"r",18:"s"};
return pts[pt.x]+pts[pt.y];
},expandCompressedPoints:function(_10a){
var _10b;
var ul,lr;
var x,y;
var _110=[];
var hits=[];
for(var i=0;i<_10a.length;i++){
_10b=_10a[i].split(/:/);
if(_10b.length>1){
ul=this.sgfCoordToPoint(_10b[0]);
lr=this.sgfCoordToPoint(_10b[1]);
for(x=ul.x;x<=lr.x;x++){
for(y=ul.y;y<=lr.y;y++){
_110.push(this.pointToSgfCoord({x:x,y:y}));
}
}
hits.push(i);
}
}
_10a=_10a.concat(_110);
return _10a;
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
this.domLoading.className="eidogo-loading"+(this.theme?" theme-compact":"");
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
var ua=navigator.userAgent.toLowerCase();
var _5=(ua.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[])[1];
var _6=/msie/.test(ua)&&!/opera/.test(ua);
if(!_1.skipCss){
eidogo.util.addStyleSheet(_3+"/css/player.css");
if(_6&&parseInt(_5,10)<=6){
eidogo.util.addStyleSheet(_3+"/css/player-ie6.css");
}
}
eidogo.util.addEvent(window,"load",function(){
eidogo.autoPlayers=[];
var _7=[];
var _8=document.getElementsByTagName("div");
var _9=_8.length;
for(var i=0;i<_9;i++){
if(eidogo.util.hasClass(_8[i],"eidogo-player-auto")){
_7.push(_8[i]);
}
}
var el;
for(var i=0;el=_7[i];i++){
var _c={container:el,disableShortcuts:true,theme:"compact"};
for(var _d in _1){
_c[_d]=_1[_d];
}
var _e=el.getAttribute("sgf");
if(_e){
_c.sgfUrl=_e;
}else{
if(el.innerHTML){
_c.sgf=el.innerHTML;
}
}
el.innerHTML="";
eidogo.util.show(el);
var _f=new eidogo.Player(_c);
eidogo.autoPlayers.push(_f);
}
});
})();

