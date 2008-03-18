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
eidogo.i18n=eidogo.i18n||{"move":"Move","loading":"Loading","passed":"passed","resigned":"resigned","variations":"Variations","no variations":"none","tool":"Tool","play":"Play","region":"Select Region","add_b":"Black Stone","add_w":"White Stone","edit comment":"Edit Comment","done":"Done","triangle":"Triangle","square":"Square","circle":"Circle","x":"X","letter":"Letter","number":"Number","dim":"Dim","score":"Score","score est":"Score Estimate","search":"Search","search corner":"Corner Search","search center":"Center Search","region info":"Click and drag to select a region.","two stones":"Please select at least two stones to search for.","two edges":"For corner searches, your selection must touch two adjacent edges of the board.","no search url":"No search URL provided.","close search":"close search","matches found":"matches found.","save to server":"Save to Server","download sgf":"Download SGF","next game":"Next Game","previous game":"Previous Game","end of variation":"End of variation","white":"White","white rank":"White rank","white team":"White team","black":"Black","black rank":"Black rank","black team":"Black team","captures":"captures","time left":"time left","you":"You","game":"Game","handicap":"Handicap","komi":"Komi","result":"Result","date":"Date","info":"Info","place":"Place","event":"Event","round":"Round","overtime":"Overtime","opening":"Openning","ruleset":"Ruleset","annotator":"Annotator","copyright":"Copyright","source":"Source","time limit":"Time limit","transcriber":"Transcriber","created with":"Created with","january":"January","february":"February","march":"March","april":"April","may":"May","june":"June","july":"July","august":"August","september":"September","october":"October","november":"November","december":"December","gw":"Good for White","vgw":"Very good for White","gb":"Good for Black","vgb":"Very good for Black","dm":"Even position","dmj":"Even position (joseki)","uc":"Unclear position","te":"Tesuji","bm":"Bad move","vbm":"Very bad move","do":"Doubtful move","it":"Interesting move","black to play":"Black to play","white to play":"White to play","ho":"Hotspot","dom error":"Error finding DOM container","error retrieving":"There was a problem retrieving the game data.","invalid data":"Received invalid game data","error board":"Error loading board container","unsaved changes":"There are unsaved changes in this game. You must save before you can permalink or download.","bad path":"Don't know how to get to path: ","gnugo thinking":"GNU Go is thinking..."};

eidogo.gameNodeIdCounter=15000;
eidogo.GameNode=function(){
this.init.apply(this,arguments);
};
eidogo.GameNode.prototype={init:function(_1,_2){
this._id=eidogo.gameNodeIdCounter++;
this._parent=_1||null;
this._children=[];
this._preferredChild=0;
if(_2){
this.loadJson(_2);
}
},pushProperty:function(_3,_4){
if(this[_3]){
if(!(this[_3] instanceof Array)){
this[_3]=[this[_3]];
}
if(!this[_3].contains(_4)){
this[_3].push(_4);
}
}else{
this[_3]=_4;
}
},loadJson:function(_5){
var _6=[_5],_7=[this];
var _8,_9;
var i,_b;
while(_6.length){
_8=_6.pop();
_9=_7.pop();
_9.loadJsonNode(_8);
_b=(_8._children?_8._children.length:0);
for(i=0;i<_b;i++){
_6.push(_8._children[i]);
if(!_9._children[i]){
_9._children[i]=new eidogo.GameNode(_9);
}
_7.push(_9._children[i]);
}
}
},loadJsonNode:function(_c){
for(var _d in _c){
if(_d=="_id"){
this[_d]=_c[_d].toString();
eidogo.gameNodeIdCounter=Math.max(eidogo.gameNodeIdCounter,parseInt(_c[_d],10));
continue;
}
if(_d.charAt(0)!="_"){
this[_d]=_c[_d];
}
}
},appendChild:function(_e){
_e._parent=this;
this._children.push(_e);
},getProperties:function(){
var _f={},_10,_11,_12,_13;
for(_10 in this){
isPrivate=(_10.charAt(0)=="_");
_12=(typeof this[_10]=="string");
_13=(this[_10] instanceof Array);
if(!isPrivate&&(_12||_13)){
_f[_10]=this[_10];
}
}
return _f;
},walk:function(fn){
var _15=[this];
var _16;
var i,len;
while(_15.length){
_16=_15.pop();
fn(_16);
len=(_16._children?_16._children.length:0);
for(i=0;i<len;i++){
_15.push(_16._children[i]);
}
}
},getMove:function(){
if(typeof this.W!="undefined"){
return this.W;
}else{
if(typeof this.B!="undefined"){
return this.B;
}
}
return null;
},emptyPoint:function(_19){
var _1a=this.getProperties();
for(var _1b in _1a){
if(_1b=="AW"||_1b=="AB"||_1b=="AE"){
if(!(this[_1b] instanceof Array)){
this[_1b]=[this[_1b]];
}
this[_1b]=this[_1b].filter(function(v){
return v!=_19;
});
if(!this[_1b].length){
delete this[_1b];
}
}else{
if((_1b=="B"||_1b=="W")&&this[_1b]==_19){
delete this[_1b];
}
}
}
},getPosition:function(){
var _1d=this._parent._children;
for(var i=0;i<_1d.length;i++){
if(_1d[i]._id==this._id){
return i;
}
}
return null;
},toSgf:function(){
var sgf=(this._parent?"(":"");
var _20=this;
function propsToSgf(_21){
if(!_21){
return "";
}
var sgf=";",key,val;
for(key in _21){
if(_21[key] instanceof Array){
val=_21[key].map(function(val){
return val.toString().replace(/\]/,"\\]");
}).join("][");
}else{
val=_21[key].toString().replace(/\]/,"\\]");
}
sgf+=key+"["+val+"]";
}
return sgf;
}
sgf+=propsToSgf(_20.getProperties());
while(_20._children.length==1){
_20=_20._children[0];
sgf+=propsToSgf(_20.getProperties());
}
for(var i=0;i<_20._children.length;i++){
sgf+=_20._children[i].toSgf();
}
sgf+=(this._parent?")":"");
return sgf;
}};
eidogo.GameCursor=function(){
this.init.apply(this,arguments);
};
eidogo.GameCursor.prototype={init:function(_27){
this.node=_27;
},next:function(_28){
if(!this.hasNext()){
return false;
}
_28=(typeof _28=="undefined"||_28==null?this.node._preferredChild:_28);
this.node._preferredChild=_28;
this.node=this.node._children[_28];
return true;
},previous:function(){
if(!this.hasPrevious()){
return false;
}
this.node=this.node._parent;
return true;
},hasNext:function(){
return this.node&&this.node._children.length;
},hasPrevious:function(){
return this.node&&this.node._parent&&this.node._parent._parent;
},getNextMoves:function(){
if(!this.hasNext()){
return null;
}
var _29={};
var i,_2b;
for(i=0;_2b=this.node._children[i];i++){
_29[_2b.getMove()]=i;
}
return _29;
},getNextColor:function(){
if(!this.hasNext()){
return null;
}
var i,_2d;
for(var i=0;_2d=this.node._children[i];i++){
if(_2d.W||_2d.B){
return _2d.W?"W":"B";
}
}
return null;
},getNextNodeWithVariations:function(){
var _2e=this.node;
while(_2e._children.length==1){
_2e=_2e._children[0];
}
return _2e;
},getPath:function(){
var _2f=[];
var cur=new eidogo.GameCursor(this.node);
var mn=0;
var _32=cur.node;
cur.previous();
while(cur.hasPrevious()&&cur.node._children.length==1){
_32=cur.node;
cur.previous();
mn++;
}
_2f.push(mn);
_2f.push(_32.getPosition());
var _33=null;
do{
_32=cur.node;
cur.previous();
while(cur.hasPrevious()&&cur.node._children.length==1){
_32=cur.node;
cur.previous();
}
_2f.push(_32.getPosition());
_33=_32._id;
}while(cur.previous());
if(_33!=cur.node._id){
_2f.push(cur.node.getPosition());
}
return _2f.reverse();
},getPathMoves:function(){
var _34=[];
var cur=new eidogo.GameCursor(this.node);
_34.push(cur.node.getMove());
while(cur.previous()){
var _36=cur.node.getMove();
if(_36){
_34.push(_36);
}
}
return _34.reverse();
},getMoveNumber:function(){
var num=0,_38=this.node;
while(_38&&(_38.W||_38.B)){
num++;
_38=_38._parent;
}
return num;
},getGameRoot:function(){
var cur=new eidogo.GameCursor(this.node);
if(!this.node._parent&&this.node._children.length){
return this.node._children[0];
}
while(cur.previous()){
}
return cur.node;
}};

eidogo.SgfParser=function(){
this.init.apply(this,arguments);
};
eidogo.SgfParser.prototype={init:function(_1,_2){
_2=(typeof _2=="function")?_2:null;
this.sgf=_1;
this.index=0;
this.root={_children:[]};
this.parseTree(this.root);
_2&&_2.call(this);
},parseTree:function(_3){
while(this.index<this.sgf.length){
var c=this.curChar();
this.index++;
switch(c){
case ";":
_3=this.parseNode(_3);
break;
case "(":
this.parseTree(_3);
break;
case ")":
return;
break;
}
}
},parseNode:function(_5){
var _6={_children:[]};
if(_5){
_5._children.push(_6);
}else{
this.root=_6;
}
_6=this.parseProperties(_6);
return _6;
},parseProperties:function(_7){
var _8="";
var _9=[];
var i=0;
while(this.index<this.sgf.length){
var c=this.curChar();
if(c==";"||c=="("||c==")"){
break;
}
if(this.curChar()=="["){
while(this.curChar()=="["){
this.index++;
_9[i]="";
while(this.curChar()!="]"&&this.index<this.sgf.length){
if(this.curChar()=="\\"){
this.index++;
while(this.curChar()=="\r"||this.curChar()=="\n"){
this.index++;
}
}
_9[i]+=this.curChar();
this.index++;
}
i++;
while(this.curChar()=="]"||this.curChar()=="\n"||this.curChar()=="\r"){
this.index++;
}
}
if(_7[_8]){
if(!(_7[_8] instanceof Array)){
_7[_8]=[_7[_8]];
}
_7[_8]=_7[_8].concat(_9);
}else{
_7[_8]=_9.length>1?_9:_9[0];
}
_8="";
_9=[];
i=0;
continue;
}
if(c!=" "&&c!="\n"&&c!="\r"&&c!="\t"){
_8+=c;
}
this.index++;
}
return _7;
},curChar:function(){
return this.sgf.charAt(this.index);
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
var len;
if(!_16&&this.cache.last()){
var _1c=this.cache.last();
len=this.stones.length;
for(var i=0;i<len;i++){
if(_1c.stones[i]!=this.lastRender.stones[i]){
_17[i]=_1c.stones[i];
}
}
_18=this.markers;
}else{
_17=this.stones;
_18=this.markers;
}
var _1e;
for(var x=0;x<this.boardSize;x++){
for(var y=0;y<this.boardSize;y++){
_1e=y*this.boardSize+x;
if(_18[_1e]!=null){
this.renderer.renderMarker({x:x,y:y},_18[_1e]);
this.lastRender.markers[_1e]=_18[_1e];
}
if(_17[_1e]==null){
continue;
}else{
if(_17[_1e]==this.EMPTY){
_19="empty";
}else{
_19=(_17[_1e]==this.WHITE?"white":"black");
}
}
this.renderer.renderStone({x:x,y:y},_19);
this.lastRender.stones[_1e]=_17[_1e];
}
}
}};
eidogo.BoardRendererHtml=function(){
this.init.apply(this,arguments);
};
eidogo.BoardRendererHtml.prototype={init:function(_21,_22,_23,_24){
if(!_21){
throw "No DOM container";
return;
}
this.boardSize=_22||19;
var _25=document.createElement("div");
_25.className="board-gutter"+(this.boardSize==19?" with-coords":"");
_21.appendChild(_25);
var _26=document.createElement("div");
_26.className="board size"+this.boardSize;
_26.style.position=(_24&&eidogo.browser.ie?"static":"relative");
_25.appendChild(_26);
this.domNode=_26;
this.domGutter=_25;
this.domContainer=_21;
this.player=_23;
this.uniq=_21.id+"-";
this.renderCache={stones:[].setLength(this.boardSize,0).addDimension(this.boardSize,0),markers:[].setLength(this.boardSize,0).addDimension(this.boardSize,0)};
this.pointWidth=0;
this.pointHeight=0;
this.margin=0;
var _27=this.renderStone({x:0,y:0},"black");
this.pointWidth=this.pointHeight=_27.offsetWidth;
this.renderStone({x:0,y:0},"white");
this.renderMarker({x:0,y:0},"current");
this.clear();
this.margin=(this.domNode.offsetWidth-(this.boardSize*this.pointWidth))/2;
this.scrollX=0;
this.scrollY=0;
if(_24){
this.crop(_24);
if(eidogo.browser.ie){
var _28=this.domNode.parentNode;
while(_28&&_28.tagName&&!/^body|html$/i.test(_28.tagName)){
this.scrollX+=_28.scrollLeft;
this.scrollY+=_28.scrollTop;
_28=_28.parentNode;
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
},showRegion:function(_29){
this.dom.searchRegion.style.top=(this.margin+this.pointHeight*_29[0])+"px";
this.dom.searchRegion.style.left=(this.margin+this.pointWidth*_29[1])+"px";
this.dom.searchRegion.style.width=this.pointWidth*_29[2]+"px";
this.dom.searchRegion.style.height=this.pointHeight*_29[3]+"px";
eidogo.util.show(this.dom.searchRegion);
},hideRegion:function(){
eidogo.util.hide(this.dom.searchRegion);
},clear:function(){
this.domNode.innerHTML="";
},renderStone:function(pt,_2b){
var _2c=document.getElementById(this.uniq+"stone-"+pt.x+"-"+pt.y);
if(_2c){
_2c.parentNode.removeChild(_2c);
}
if(_2b!="empty"){
var div=document.createElement("div");
div.id=this.uniq+"stone-"+pt.x+"-"+pt.y;
div.className="point stone "+_2b;
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
},renderMarker:function(pt,_2f){
if(this.renderCache.markers[pt.x][pt.y]){
var _30=document.getElementById(this.uniq+"marker-"+pt.x+"-"+pt.y);
if(_30){
_30.parentNode.removeChild(_30);
}
}
if(_2f=="empty"||!_2f){
this.renderCache.markers[pt.x][pt.y]=0;
return null;
}
this.renderCache.markers[pt.x][pt.y]=1;
if(_2f){
var _31="";
switch(_2f){
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
if(_2f.indexOf("var:")==0){
_31=_2f.substring(4);
_2f="variation";
}else{
_31=_2f;
_2f="label";
}
break;
}
var div=document.createElement("div");
div.id=this.uniq+"marker-"+pt.x+"-"+pt.y;
div.className="point marker "+_2f;
try{
div.style.left=(pt.x*this.pointWidth+this.margin-this.scrollX)+"px";
div.style.top=(pt.y*this.pointHeight+this.margin-this.scrollY)+"px";
}
catch(e){
}
div.appendChild(document.createTextNode(_31));
this.domNode.appendChild(div);
return div;
}
return null;
},setCursor:function(_33){
this.domNode.style.cursor=_33;
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
var _3b=eidogo.util.getElClickXY(e,this.domNode);
var m=this.margin;
var pw=this.pointWidth;
var ph=this.pointHeight;
var x=Math.round((_3b[0]-m-(pw/2))/pw);
var y=Math.round((_3b[1]-m-(ph/2))/ph);
return [x,y];
},crop:function(_41){
eidogo.util.addClass(this.domContainer,"shrunk");
this.domGutter.style.overflow="hidden";
var _42=_41.width*this.pointWidth+this.margin;
var _43=_41.height*this.pointHeight+this.margin;
this.domGutter.style.width=_42+"px";
this.domGutter.style.height=_43+"px";
this.player.dom.player.style.width=_42+"px";
this.domGutter.scrollLeft=_41.left*this.pointWidth;
this.domGutter.scrollTop=_41.top*this.pointHeight;
}};
eidogo.BoardRendererFlash=function(){
this.init.apply(this,arguments);
};
eidogo.BoardRendererFlash.prototype={init:function(_44,_45,_46,_47){
if(!_44){
throw "No DOM container";
return;
}
this.ready=false;
this.swf=null;
this.unrendered=[];
var _48=_44.id+"-board";
var so=new SWFObject(eidogo.playerPath+"/swf/board.swf",_48,"421","421","8","#665544");
so.addParam("allowScriptAccess","sameDomain");
so.write(_44);
var _4a=0;
var _4b=function(){
swf=eidogo.util.byId(_48);
if(!swf||!swf.init){
if(_4a>2000){
throw "Error initializing board";
return;
}
setTimeout(arguments.callee.bind(this),10);
_4a+=10;
return;
}
this.swf=swf;
this.swf.init(_46.uniq,_45);
this.ready=true;
}.bind(this);
_4b();
},showRegion:function(_4c){
},hideRegion:function(){
},clear:function(){
if(!this.swf){
return;
}
this.swf.clear();
},renderStone:function(pt,_4e){
if(!this.swf){
this.unrendered.push(["stone",pt,_4e]);
return;
}
for(var i=0;i<this.unrendered.length;i++){
if(this.unrendered[i][0]=="stone"){
this.swf.renderStone(this.unrendered[i][1],this.unrendered[i][2]);
}
}
this.unrendered=[];
this.swf.renderStone(pt,_4e);
},renderMarker:function(pt,_51){
if(!_51){
return;
}
if(!this.swf){
this.unrendered.push(["marker",pt,_51]);
return;
}
for(var i=0;i<this.unrendered.length;i++){
if(this.unrendered[i][0]=="marker"){
this.swf.renderMarker(this.unrendered[i][1],this.unrendered[i][2]);
}
}
this.unrendered=[];
this.swf.renderMarker(pt,_51);
},setCursor:function(_53){
},crop:function(){
}};
eidogo.BoardRendererAscii=function(_54,_55){
this.init(_54,_55);
};
eidogo.BoardRendererAscii.prototype={pointWidth:2,pointHeight:1,margin:1,blankBoard:"+-------------------------------------+\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"|. . . . . . . . . . . . . . . . . . .|\n"+"+-------------------------------------+",init:function(_56,_57){
this.domNode=_56||null;
this.boardSize=_57||19;
this.content=this.blankBoard;
},clear:function(){
this.content=this.blankBoard;
this.domNode.innerHTML="<pre>"+this.content+"</pre>";
},renderStone:function(pt,_59){
var _5a=(this.pointWidth*this.boardSize+this.margin*2)*(pt.y*this.pointHeight+1)+(pt.x*this.pointWidth)+2;
this.content=this.content.substring(0,_5a-1)+"."+this.content.substring(_5a);
if(_59!="empty"){
this.content=this.content.substring(0,_5a-1)+(_59=="white"?"O":"#")+this.content.substring(_5a);
}
this.domNode.innerHTML="<pre>"+this.content+"</pre>";
},renderMarker:function(pt,_5c){
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
this.cropParams.left=cfg.cropLeft;
this.cropParams.top=cfg.cropTop;
this.cropParams.padding=cfg.cropPadding||1;
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
this.collectionRoot=new eidogo.GameNode();
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
this.load(sgf.root);
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
var _1a={_children:[{SZ:_19,_children:[]}]};
if(cfg.opponentUrl){
this.opponentUrl=cfg.opponentUrl;
this.opponentColor=cfg.opponentColor=="B"?cfg.opponentColor:"W";
var _1b=_1a._children[0];
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
},load:function(_1c,_1d){
if(!_1d){
_1d=new eidogo.GameNode();
this.collectionRoot=_1d;
}
_1d.loadJson(_1c);
_1d._cached=true;
this.doneLoading();
if(!_1d._parent){
var _1e=this.loadPath.length?parseInt(this.loadPath[0],10):0;
this.initGame(_1d._children[_1e||0]);
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
if(!_1d._parent&&this.problemMode){
this.currentColor=this.problemColor=this.cursor.getNextColor();
}
},remoteLoad:function(url,_20,_21,_22,_23){
_21=_21=="undefined"?true:_21;
_23=(typeof _23=="function")?_23:null;
if(_21){
if(!_20){
this.gameName=url;
}
url=this.sgfPath+url+".sgf";
}
if(_22){
this.loadPath=_22;
}
var _24=function(req){
var _26=req.responseText.replace(/^( |\t|\r|\n)*/,"");
if(_26.charAt(0)=="("){
var me=this;
var sgf=new eidogo.SgfParser(_26,function(){
me.load(this.root,_20);
_23&&_23();
});
}else{
if(_26.charAt(0)=="{"){
_26=eval("("+_26+")");
this.load(_26,_20);
_23&&_23();
}else{
this.croak(t["invalid data"]);
}
}
};
var _29=function(req){
this.croak(t["error retrieving"]);
};
_3("get",url,null,_24,_29,this,30000);
},initGame:function(_2b){
_2b=_2b||{};
this.handleDisplayPrefs();
var _2c=_2b.SZ||19;
if(this.shrinkToFit){
this.calcShrinkToFit(_2b,_2c);
}
if(!this.board){
this.createBoard(_2c);
this.rules=new eidogo.Rules(this.board);
}
this.unsavedChanges=false;
this.resetCursor(true);
this.totalMoves=0;
var _2d=new eidogo.GameCursor(this.cursor.node);
while(_2d.next()){
this.totalMoves++;
}
this.totalMoves--;
this.showInfo(_2b);
this.enableNavSlider();
this.selectTool(this.mode=="view"?"view":"play");
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
},createBoard:function(_2e){
_2e=_2e||19;
if(this.board&&this.board.renderer&&this.board.boardSize==_2e){
return;
}
try{
this.dom.boardContainer.innerHTML="";
var _2f;
if(this.renderer=="flash"){
_2f=eidogo.BoardRendererFlash;
}else{
_2f=eidogo.BoardRendererHtml;
}
var _30=new _2f(this.dom.boardContainer,_2e,this,this.cropParams);
this.board=new eidogo.Board(_30,_2e);
}
catch(e){
if(e=="No DOM container"){
this.croak(t["error board"]);
return;
}
}
},calcShrinkToFit:function(_31,_32){
var l=null,t=null,r=null,b=null;
var _36={};
var me=this;
_31.walk(function(_38){
var _39,i,_3b;
for(_39 in _38){
if(/^(W|B|AW|AB|LB)$/.test(_39)){
_3b=_38[_39];
if(!(_3b instanceof Array)){
_3b=[_3b];
}
if(_39!="LB"){
_3b=me.expandCompressedPoints(_3b);
}else{
_3b=[_3b[0].split(/:/)[0]];
}
for(i=0;i<_3b.length;i++){
_36[_3b[i]]="";
}
}
}
});
for(var key in _36){
var pt=this.sgfCoordToPoint(key);
if(l==null||pt.x<l){
l=pt.x;
}
if(r==null||pt.x>r){
r=pt.x;
}
if(t==null||pt.y<t){
t=pt.y;
}
if(b==null||pt.y>b){
b=pt.y;
}
}
this.cropParams.width=r-l+1;
this.cropParams.height=b-t+1;
this.cropParams.left=l;
this.cropParams.top=t;
var pad=this.cropParams.padding;
for(var _3f=pad;l-_3f<0;_3f--){
}
if(_3f){
this.cropParams.width+=_3f;
this.cropParams.left-=_3f;
}
for(var _40=pad;t-_40<0;_40--){
}
if(_40){
this.cropParams.height+=_40;
this.cropParams.top-=_40;
}
for(var _41=pad;r+_41>_32;_41--){
}
if(_41){
this.cropParams.width+=_41;
}
for(var _42=pad;b+_42>_32;_42--){
}
if(_42){
this.cropParams.height+=_42;
}
},fetchOpponentMove:function(){
this.nowLoading(t["gnugo thinking"]);
var _43=function(req){
this.doneLoading();
this.createMove(req.responseText);
};
var _45=function(req){
this.croak(t["error retrieving"]);
};
var _47=this.cursor.getGameRoot();
var _48={sgf:_47.toSgf(),move:this.currentColor,size:_47.SZ};
_3("post",this.opponentUrl,_48,_43,_45,this,45000);
},fetchScoreEstimate:function(){
this.nowLoading(t["gnugo thinking"]);
var _49=function(req){
this.doneLoading();
var _4b=req.responseText.split("\n");
var _4c,_4d=_4b[1].split(" ");
for(var i=0;i<_4d.length;i++){
_4c=_4d[i].split(":");
if(_4c[1]){
this.addMarker(_4c[1],_4c[0]);
}
}
this.board.render();
this.prependComment(_4b[0]);
};
var _4f=function(req){
this.croak(t["error retrieving"]);
};
var _51=this.cursor.getGameRoot();
var _52={sgf:_51.toSgf(),move:"est",size:_51.SZ,komi:_51.KM,mn:this.moveNumber+1};
_3("post",this.scoreEstUrl,_52,_49,_4f,this,45000);
},playProblemResponse:function(_53){
setTimeout(function(){
this.variation(null,_53);
if(!this.cursor.hasNext()){
this.prependComment(t["end of variation"]);
}
}.bind(this),200);
},goTo:function(_54,_55){
_55=typeof _55!="undefined"?_55:true;
if(_55){
this.resetCursor(true);
}
var _56=parseInt(_54,10);
if(!(_54 instanceof Array)&&!isNaN(_56)){
if(_55){
_56++;
}
for(var i=0;i<_56;i++){
this.variation(null,true);
}
this.refresh();
return;
}
if(!(_54 instanceof Array)||!_54.length){
alert(t["bad path"]+" "+_54);
return;
}
var _58;
var _59;
if(isNaN(parseInt(_54[0],10))){
this.variation(0,true);
while(_54.length){
_58=_54.shift();
_59=this.getVariations(true);
for(var i=0;i<_59.length;i++){
if(_59[i].move==_58){
this.variation(_59[i].varNum,true);
break;
}
}
if(this.progressiveLoads){
this.loadPath.push(_58);
return;
}
}
this.refresh();
return;
}
var _5a=true;
while(_54.length){
_58=parseInt(_54.shift(),10);
if(!_54.length){
for(var i=0;i<_58;i++){
this.variation(0,true);
}
}else{
if(_54.length){
if(!_5a){
while(this.cursor.node._children.length==1){
this.variation(0,true);
}
}
this.variation(_58,true);
}
}
_5a=false;
}
this.refresh();
},resetCursor:function(_5b,_5c){
this.board.reset();
this.currentColor=(this.problemMode?this.problemColor:"B");
this.moveNumber=0;
if(_5c){
this.cursor.node=this.cursor.getGameRoot();
}else{
this.cursor.node=this.collectionRoot;
}
this.refresh(_5b);
},refresh:function(_5d){
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
this.execNode(_5d);
},variation:function(_5f,_60){
if(this.cursor.next(_5f)){
this.execNode(_60);
this.resetLastLabels();
if(this.progressiveLoads){
return false;
}
return true;
}
return false;
},execNode:function(_61,_62){
if(!_62&&this.progressiveLoads){
var me=this;
setTimeout(function(){
me.execNode.call(me,_61);
},10);
return;
}
if(!_61){
this.dom.comments.innerHTML="";
this.board.clearMarkers();
}
if(this.moveNumber<1){
this.currentColor=(this.problemMode?this.problemColor:"B");
}
var _64=this.cursor.node.getProperties();
for(var _65 in _64){
if(this.propertyHandlers[_65]){
(this.propertyHandlers[_65]).apply(this,[this.cursor.node[_65],_65,_61]);
}
}
if(_61){
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
if(!_62&&this.progressiveUrl){
this.fetchProgressiveData();
}
if(this.problemMode&&this.currentColor&&this.currentColor!=this.problemColor&&!this.goingBack){
this.playProblemResponse(_61);
}
this.goingBack=false;
},fetchProgressiveData:function(){
var _66=this.cursor.node;
if(_66._cached){
return;
}
this.nowLoading();
this.progressiveLoads++;
this.remoteLoad(this.progressiveUrl+"?id="+_66._id,_66);
},findVariations:function(){
this.variations=this.getVariations();
},getVariations:function(){
var _67=[],_68=this.cursor.node._children;
for(var i=0;i<_68.length;i++){
_67.push({move:_68[i].getMove(),varNum:i});
}
return _67;
},back:function(e,obj,_6c){
if(this.cursor.previous()){
this.moveNumber--;
if(this.moveNumber<0){
this.moveNumber=0;
}
this.board.revert(1);
this.goingBack=true;
this.refresh(_6c);
this.resetLastLabels();
}
},forward:function(e,obj,_6f){
this.variation(null,_6f);
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
this.variation(this.variations[i].varNum);
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
var _7a=this.pointToSgfCoord({x:x,y:y});
if(this.mode=="view"||this.mode=="play"){
for(var i=0;i<this.variations.length;i++){
var _7c=this.sgfCoordToPoint(this.variations[i].move);
if(_7c.x==x&&_7c.y==y){
this.variation(this.variations[i].varNum);
_7(e);
return;
}
}
}
if(this.mode=="play"){
if(!this.rules.check({x:x,y:y},this.currentColor)){
return;
}
if(_7a){
var _7d=this.cursor.getNextMoves();
if(_7d&&_7a in _7d){
this.variation(_7d[_7a]);
}else{
this.createMove(_7a);
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
var _7e;
var _7f=this.board.getStone({x:x,y:y});
if(this.mode=="add_b"||this.mode=="add_w"){
this.cursor.node.emptyPoint(this.pointToSgfCoord({x:x,y:y}));
if(_7f!=this.board.BLACK&&this.mode=="add_b"){
_7e="AB";
}else{
if(_7f!=this.board.WHITE&&this.mode=="add_w"){
_7e="AW";
}else{
_7e="AE";
}
}
}else{
switch(this.mode){
case "tr":
_7e="TR";
break;
case "sq":
_7e="SQ";
break;
case "cr":
_7e="CR";
break;
case "x":
_7e="MA";
break;
case "dim":
_7e="DD";
break;
case "number":
_7e="LB";
_7a=_7a+":"+this.labelLastNumber;
this.labelLastNumber++;
break;
case "letter":
_7e="LB";
_7a=_7a+":"+this.labelLastLetter;
this.labelLastLetter=String.fromCharCode(this.labelLastLetter.charCodeAt(0)+1);
}
}
if(_7e){
this.cursor.node.pushProperty(_7e,_7a);
this.refresh();
}
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
},boundsCheck:function(x,y,_83){
if(_83.length==2){
_83[3]=_83[2]=_83[1];
_83[1]=_83[0];
}
return (x>=_83[0]&&y>=_83[1]&&x<=_83[2]&&y<=_83[3]);
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
var _88=this.getRegionBounds();
this.board.renderer.showRegion(_88);
},hideRegion:function(){
this.board.renderer.hideRegion();
},loadSearch:function(q,dim,p,a){
var _8d={_children:[{SZ:this.board.boardSize,_children:[]}]};
this.load(_8d);
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
var _98=this.dom.searchAlgo.value;
var _99=this.getRegionBounds();
var _9a=this.board.getRegion(_99[0],_99[1],_99[2],_99[3]);
var _9b=_9a.join("").replace(new RegExp(this.board.EMPTY,"g"),".").replace(new RegExp(this.board.BLACK,"g"),"x").replace(new RegExp(this.board.WHITE,"g"),"o");
var _9c=/^\.*$/.test(_9b);
var _9d=/^\.*O\.*$/.test(_9b);
var _9e=/^\.*X\.*$/.test(_9b);
if(_9c||_9d||_9e){
this.searching=false;
_a(this.dom.comments);
_b(this.dom.searchContainer);
this.prependComment(t["two stones"]);
return;
}
var _9f=[];
if(_99[0]==0){
_9f.push("n");
}
if(_99[1]==0){
_9f.push("w");
}
if(_99[0]+_99[3]==this.board.boardSize){
_9f.push("s");
}
if(_99[1]+_99[2]==this.board.boardSize){
_9f.push("e");
}
if(_98=="corner"&&!(_9f.length==2&&((_9f.contains("n")&&_9f.contains("e"))||(_9f.contains("n")&&_9f.contains("w"))||(_9f.contains("s")&&_9f.contains("e"))||(_9f.contains("s")&&_9f.contains("w"))))){
this.searching=false;
_a(this.dom.comments);
_b(this.dom.searchContainer);
this.prependComment(t["two edges"]);
return;
}
var _a0=(_9f.contains("n")?"n":"s");
_a0+=(_9f.contains("w")?"w":"e");
this.showComments("");
this.gameName="search";
var _a1=function(req){
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
var _a3=eval("("+req.responseText+")");
var _a4;
var _a5="";
var odd;
for(var i=0;_a4=_a3[i];i++){
odd=odd?false:true;
_a5+="<a class='search-result"+(odd?" odd":"")+"' href='#'>                    <span class='id'>"+_a4.id+"</span>                    <span class='mv'>"+_a4.mv+"</span>                    <span class='pw'>"+_a4.pw+" "+_a4.wr+"</span>                    <span class='pb'>"+_a4.pb+" "+_a4.br+"</span>                    <span class='re'>"+_a4.re+"</span>                    <span class='dt'>"+_a4.dt+"</span>                    <div class='clear'>&nbsp;</div>                    </a>";
}
_a(this.dom.searchResultsContainer);
this.dom.searchResults.innerHTML=_a5;
this.dom.searchCount.innerHTML=_a3.length;
};
var _a8=function(req){
this.croak(t["error retrieving"]);
};
var _aa={q:_a0,w:_99[2],h:_99[3],p:_9b,a:_98,t:(new Date()).getTime()};
this.progressiveLoad=false;
this.progressiveUrl=null;
this.prefs.markNext=false;
this.prefs.showPlayerInfo=true;
this.hook("searchRegion",_aa);
this.nowLoading();
_3("get",this.searchUrl,_aa,_a1,_a8,this,45000);
},loadSearchResult:function(e){
this.nowLoading();
var _ac=e.target||e.srcElement;
if(_ac.nodeName=="SPAN"){
_ac=_ac.parentNode;
}
if(_ac.nodeName=="A"){
var _ad;
var id;
var mv;
for(var i=0;_ad=_ac.childNodes[i];i++){
if(_ad.className=="id"){
id=_ad.innerHTML;
}
if(_ad.className=="mv"){
mv=parseInt(_ad.innerHTML,10);
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
},compressPattern:function(_b1){
var c=null;
var pc="";
var n=1;
var ret="";
for(var i=0;i<_b1.length;i++){
c=_b1.charAt(i);
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
},uncompressPattern:function(_b7){
var c=null;
var s=null;
var n="";
var ret="";
for(var i=0;i<_b7.length;i++){
c=_b7.charAt(i);
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
},createMove:function(_be){
var _bf={};
_bf[this.currentColor]=_be;
_bf["MN"]=(++this.moveNumber).toString();
var _c0=new eidogo.GameNode(null,_bf);
_c0._cached=true;
this.totalMoves++;
this.cursor.node.appendChild(_c0);
this.variation(this.cursor.node._children.length-1);
this.unsavedChanges=true;
},handleKeypress:function(e){
if(this.editingComment){
return true;
}
var _c2=e.keyCode||e.charCode;
if(!_c2||e.ctrlKey||e.altKey||e.metaKey){
return true;
}
var _c3=String.fromCharCode(_c2).toLowerCase();
for(var i=0;i<this.variations.length;i++){
var _c5=this.sgfCoordToPoint(this.variations[i].move);
var _c6=""+(i+1);
if(_c5.x!=null&&this.board.getMarker(_c5)!=this.board.EMPTY&&typeof this.board.getMarker(_c5)=="string"){
_c6=this.board.getMarker(_c5).toLowerCase();
}
_c6=_c6.replace(/^var:/,"");
if(_c3==_c6.charAt(0)){
this.variation(this.variations[i].varNum);
_7(e);
return;
}
}
if(_c2==112||_c2==27){
this.selectTool("play");
}
var _c7=true;
switch(_c2){
case 32:
if(e.shiftKey){
this.back();
}else{
this.forward();
}
break;
case 39:
if(e.shiftKey){
var _c8=this.totalMoves-this.moveNumber;
var _c9=(_c8>9?9:_c8-1);
for(var i=0;i<_c9;i++){
this.forward(null,null,true);
}
}
this.forward();
break;
case 37:
if(e.shiftKey){
var _c9=(this.moveNumber>9?9:this.moveNumber-1);
for(var i=0;i<_c9;i++){
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
_c7=false;
break;
}
if(_c7){
_7(e);
}
},showInfo:function(_ca){
if(!_ca){
return;
}
this.dom.infoGame.innerHTML="";
this.dom.whiteName.innerHTML="";
this.dom.blackName.innerHTML="";
var dl=document.createElement("dl");
for(var _cc in this.infoLabels){
if(_ca[_cc] instanceof Array){
_ca[_cc]=_ca[_cc][0];
}
if(_ca[_cc]){
if(_cc=="PW"){
this.dom.whiteName.innerHTML=_ca[_cc]+(_ca["WR"]?", "+_ca["WR"]:"");
continue;
}else{
if(_cc=="PB"){
this.dom.blackName.innerHTML=_ca[_cc]+(_ca["BR"]?", "+_ca["BR"]:"");
continue;
}
}
if(_cc=="WR"||_cc=="BR"){
continue;
}
if(_cc=="DT"){
var _cd=_ca[_cc].split(/[\.-]/);
if(_cd.length==3){
_ca[_cc]=_cd[2].replace(/^0+/,"")+" "+this.months[_cd[1]-1]+" "+_cd[0];
}
}
var dt=document.createElement("dt");
dt.innerHTML=this.infoLabels[_cc]+":";
var dd=document.createElement("dd");
dd.innerHTML=_ca[_cc];
dl.appendChild(dt);
dl.appendChild(dd);
}
}
this.dom.infoGame.appendChild(dl);
},selectTool:function(_d0){
var _d1;
_b(this.dom.scoreEst);
if(_d0=="region"){
_d1="crosshair";
}else{
if(_d0=="comment"){
this.startEditComment();
}else{
_d1="default";
this.regionBegun=false;
this.hideRegion();
_b(this.dom.searchButton);
_b(this.dom.searchAlgo);
if(this.searchUrl){
_a(this.dom.scoreEst,"inline");
}
}
}
this.board.renderer.setCursor(_d1);
this.mode=_d0;
this.dom.toolsSelect.value=_d0;
},startEditComment:function(){
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
},finishEditComment:function(){
var _d3=this.cursor.node.C;
var _d4=this.dom.commentsEditTa.value;
if(_d3!=_d4){
this.unsavedChanges=true;
this.cursor.node.C=_d4;
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
var _d6=i+1;
if(!this.variations[i].move||this.variations[i].move=="tt"){
_8(this.dom.controlPass,"pass-on");
}else{
if(this.prefs.markNext||this.variations.length>1){
var _d7=this.sgfCoordToPoint(this.variations[i].move);
if(this.board.getMarker(_d7)!=this.board.EMPTY){
_d6=this.board.getMarker(_d7);
}
if(this.prefs.markVariations){
this.board.addMarker(_d7,"var:"+_d6);
}
}
}
var _d8=document.createElement("div");
_d8.className="variation-nav";
_d8.innerHTML=_d6;
_4(_d8,"click",function(e,arg){
arg.me.variation(arg.varNum);
},{me:this,varNum:this.variations[i].varNum});
this.dom.variations.appendChild(_d8);
}
if(this.variations.length<2){
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
var _db="";
if(!this.prefs.showPlayerInfo){
_db+=this.getGameDescription(true);
}
if(!this.prefs.showGameInfo){
_db+=this.dom.infoGame.innerHTML;
}
if(_db.length&&this.theme!="problem"){
this.prependComment(_db,"comment-info");
}
}
if(!this.progressiveLoad){
this.updateNavSlider();
}
},setColor:function(_dc){
this.prependComment(_dc=="B"?t["black to play"]:t["white to play"]);
this.currentColor=_dc;
},setMoveNumber:function(num){
this.moveNumber=num;
},playMove:function(_de,_df,_e0){
_df=_df||this.currentColor;
this.currentColor=(_df=="B"?"W":"B");
_df=_df=="W"?this.board.WHITE:this.board.BLACK;
var pt=this.sgfCoordToPoint(_de);
if(!this.cursor.node["MN"]){
this.moveNumber++;
}
if((!_de||_de=="tt"||_de=="")&&!_e0){
this.prependComment((_df==this.board.WHITE?t["white"]:t["black"])+" "+t["passed"],"comment-pass");
}else{
if(_de=="resign"){
this.prependComment((_df==this.board.WHITE?t["white"]:t["black"])+" "+t["resigned"],"comment-resign");
}else{
if(_de&&_de!="tt"){
this.board.addStone(pt,_df);
this.rules.apply(pt,_df);
if(this.prefs.markCurrent&&!_e0){
this.addMarker(_de,"current");
}
}
}
}
},addStone:function(_e2,_e3){
if(!(_e2 instanceof Array)){
_e2=[_e2];
}
_e2=this.expandCompressedPoints(_e2);
for(var i=0;i<_e2.length;i++){
this.board.addStone(this.sgfCoordToPoint(_e2[i]),_e3=="AW"?this.board.WHITE:_e3=="AB"?this.board.BLACK:this.board.EMPTY);
}
},addMarker:function(_e5,_e6){
if(!(_e5 instanceof Array)){
_e5=[_e5];
}
_e5=this.expandCompressedPoints(_e5);
var _e7;
for(var i=0;i<_e5.length;i++){
switch(_e6){
case "TR":
_e7="triangle";
break;
case "SQ":
_e7="square";
break;
case "CR":
_e7="circle";
break;
case "MA":
_e7="ex";
break;
case "TW":
_e7="territory-white";
break;
case "TB":
_e7="territory-black";
break;
case "DD":
_e7="dim";
break;
case "LB":
_e7=(_e5[i].split(":"))[1];
_e5[i];
break;
default:
_e7=_e6;
break;
}
this.board.addMarker(this.sgfCoordToPoint((_e5[i].split(":"))[0]),_e7);
}
},showTime:function(_e9,_ea){
var tp=(_ea=="BL"||_ea=="OB"?"timeB":"timeW");
if(_ea=="BL"||_ea=="WL"){
var _ec=Math.floor(_e9/60);
var _ed=(_e9%60).toFixed(0);
_ed=(_ed<10?"0":"")+_ed;
this[tp]=_ec+":"+_ed;
}else{
this[tp]+=" ("+_e9+")";
}
},showAnnotation:function(_ee,_ef){
var msg;
switch(_ef){
case "N":
msg=_ee;
break;
case "GB":
msg=(_ee>1?t["vgb"]:t["gb"]);
break;
case "GW":
msg=(_ee>1?t["vgw"]:t["gw"]);
break;
case "DM":
msg=(_ee>1?t["dmj"]:t["dm"]);
break;
case "UC":
msg=t["uc"];
break;
case "TE":
msg=t["te"];
break;
case "BM":
msg=(_ee>1?t["vbm"]:t["bm"]);
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
},showComments:function(_f1,_f2,_f3){
if(!_f1||_f3){
return;
}
this.dom.comments.innerHTML+=_f1.replace(/\n/g,"<br />");
},prependComment:function(_f4,cls){
cls=cls||"comment-status";
this.dom.comments.innerHTML="<div class='"+cls+"'>"+_f4+"</div>"+this.dom.comments.innerHTML;
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
location.href="data:text/plain,"+encodeURIComponent(this.cursor.getGameRoot().toSgf());
}
}
},save:function(evt){
_7(evt);
var _f8=function(req){
this.hook("saved",[req.responseText]);
};
var _fa=function(req){
this.croak(t["error retrieving"]);
};
var sgf=this.cursor.getGameRoot().toSgf();
_3("POST",this.saveUrl,{sgf:sgf},_f8,_fa,this,30000);
},constructDom:function(){
this.dom.player=document.createElement("div");
this.dom.player.className="eidogo-player"+(this.theme?" theme-"+this.theme:"");
this.dom.player.id="player-"+this.uniq;
this.dom.container.innerHTML="";
eidogo.util.show(this.dom.container);
this.dom.container.appendChild(this.dom.player);
var _fd="            <div id='board-container' class='board-container'></div>            <div id='controls-container' class='controls-container'>                <ul id='controls' class='controls'>                    <li id='control-first' class='control first'>First</li>                    <li id='control-back' class='control back'>Back</li>                    <li id='control-forward' class='control forward'>Forward</li>                    <li id='control-last' class='control last'>Last</li>                    <li id='control-pass' class='control pass'>Pass</li>                </ul>                <div id='move-number' class='move-number"+(this.permalinkable?" permalink":"")+"'></div>                <div id='nav-slider' class='nav-slider'>                    <div id='nav-slider-thumb' class='nav-slider-thumb'></div>                </div>                <div id='variations-container' class='variations-container'>                    <div id='variations-label' class='variations-label'>"+t["variations"]+":</div>                    <div id='variations' class='variations'></div>                </div>                <div class='controls-stop'></div>            </div>            <div id='tools-container' class='tools-container'"+(this.prefs.showTools?"":" style='display: none'")+">                <div id='tools-label' class='tools-label'>"+t["tool"]+":</div>                <select id='tools-select' class='tools-select'>                    <option value='play'>"+t["play"]+"</option>                    <option value='add_b'>"+t["add_b"]+"</option>                    <option value='add_w'>"+t["add_w"]+"</option>                    "+(this.searchUrl?("<option value='region'>"+t["region"]+"</option>"):"")+"                    <option value='comment'>"+t["edit comment"]+"</option>                    <option value='tr'>"+t["triangle"]+"</option>                    <option value='sq'>"+t["square"]+"</option>                    <option value='cr'>"+t["circle"]+"</option>                    <option value='x'>"+t["x"]+"</option>                    <option value='letter'>"+t["letter"]+"</option>                    <option value='number'>"+t["number"]+"</option>                    <option value='dim'>"+t["dim"]+"</option>                </select>                <input type='button' id='score-est' class='score-est-button' value='"+t["score est"]+"' />                <select id='search-algo' class='search-algo'>                    <option value='corner'>"+t["search corner"]+"</option>                    <option value='center'>"+t["search center"]+"</option>                </select>                <input type='button' id='search-button' class='search-button' value='"+t["search"]+"' />            </div>            <div id='comments' class='comments'></div>            <div id='comments-edit' class='comments-edit'>                <textarea id='comments-edit-ta' class='comments-edit-ta'></textarea>                <div id='comments-edit-done' class='comments-edit-done'>"+t["done"]+"</div>            </div>            <div id='search-container' class='search-container'>                <div id='search-close' class='search-close'>"+t["close search"]+"</div>                <p class='search-count'><span id='search-count'></span>&nbsp;"+t["matches found"]+"</p>                <div id='search-results-container' class='search-results-container'>                    <div class='search-result'>                        <span class='pw'><b>"+t["white"]+"</b></span>                        <span class='pb'><b>"+t["black"]+"</b></span>                        <span class='re'><b>"+t["result"]+"</b></span>                        <span class='dt'><b>"+t["date"]+"</b></span>                        <div class='clear'></div>                    </div>                    <div id='search-results' class='search-results'></div>                </div>            </div>            <div id='info' class='info'>                <div id='info-players' class='players'>                    <div id='white' class='player white'>                        <div id='white-name' class='name'></div>                        <div id='white-captures' class='captures'></div>                        <div id='white-time' class='time'></div>                    </div>                    <div id='black' class='player black'>                        <div id='black-name' class='name'></div>                        <div id='black-captures' class='captures'></div>                        <div id='black-time' class='time'></div>                    </div>                </div>                <div id='info-game' class='game'></div>            </div>            <div id='options' class='options'>                "+(this.saveUrl?"<a id='option-save' class='option-save' href='#'>"+t["save to server"]+"</a>":"")+"                "+(this.downloadUrl||_c?"<a id='option-download' class='option-download' href='#'>"+t["download sgf"]+"</a>":"")+"                <div class='options-stop'></div>            </div>            <div id='preferences' class='preferences'>                <div><input type='checkbox'> Show variations on board</div>                <div><input type='checkbox'> Mark current move</div>            </div>            <div id='footer' class='footer'></div>            <div id='shade' class='shade'></div>        ";
_fd=_fd.replace(/ id='([^']+)'/g," id='$1-"+this.uniq+"'");
this.dom.player.innerHTML=_fd;
var re=/ id='([^']+)-\d+'/g;
var _ff;
var id;
var _101;
while(_ff=re.exec(_fd)){
id=_ff[0].replace(/'/g,"").replace(/ id=/,"");
_101="";
_ff[1].split("-").forEach(function(word,i){
word=i?word.charAt(0).toUpperCase()+word.substring(1):word;
_101+=word;
});
this.dom[_101]=_2(id);
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
var _106=false;
var _107=null;
_4(this.dom.navSlider,"mousedown",function(e){
_106=true;
_7(e);
},this,true);
_4(document,"mousemove",function(e){
if(!_106){
return;
}
var xy=_6(e,this.dom.navSlider);
clearTimeout(_107);
_107=setTimeout(function(){
this.updateNavSlider(xy[0]);
}.bind(this),10);
_7(e);
},this,true);
_4(document,"mouseup",function(e){
if(!_106){
return true;
}
_106=false;
var xy=_6(e,this.dom.navSlider);
this.updateNavSlider(xy[0]);
return true;
},this,true);
},updateNavSlider:function(_10d){
var _10e=this.dom.navSlider._width-this.dom.navSliderThumb._width;
var _10f=this.totalMoves;
var _110=!!_10d;
_10d=_10d||(this.moveNumber/_10f*_10e);
_10d=_10d>_10e?_10e:_10d;
_10d=_10d<0?0:_10d;
var _111=parseInt(_10d/_10e*_10f,10);
if(_110){
this.nowLoading();
var _112=_111-this.cursor.getMoveNumber();
for(var i=0;i<Math.abs(_112);i++){
if(_112>0){
this.variation(null,true);
}else{
if(_112<0){
this.cursor.previous();
this.moveNumber--;
}
}
}
if(_112<0){
if(this.moveNumber<0){
this.moveNumber=0;
}
this.board.revert(Math.abs(_112));
}
this.doneLoading();
this.refresh();
}
_10d=parseInt(_111/_10f*_10e,10)||0;
this.dom.navSliderThumb.style.left=_10d+"px";
},resetLastLabels:function(){
this.labelLastNumber=1;
this.labelLastLetter="A";
},getGameDescription:function(_114){
var root=this.cursor.getGameRoot();
if(!root){
return;
}
var desc=(_114?"":root.GN||this.gameName);
if(root.PW&&root.PB){
var wr=root.WR?" "+root.WR:"";
var br=root.BR?" "+root.BR:"";
desc+=(desc.length?" - ":"")+root.PW+wr+" vs "+root.PB+br;
}
return desc;
},sgfCoordToPoint:function(_119){
if(!_119||_119=="tt"){
return {x:null,y:null};
}
var _11a={a:0,b:1,c:2,d:3,e:4,f:5,g:6,h:7,i:8,j:9,k:10,l:11,m:12,n:13,o:14,p:15,q:16,r:17,s:18};
return {x:_11a[_119.charAt(0)],y:_11a[_119.charAt(1)]};
},pointToSgfCoord:function(pt){
if(!pt||!this.boundsCheck(pt.x,pt.y,[0,this.board.boardSize-1])){
return null;
}
var pts={0:"a",1:"b",2:"c",3:"d",4:"e",5:"f",6:"g",7:"h",8:"i",9:"j",10:"k",11:"l",12:"m",13:"n",14:"o",15:"p",16:"q",17:"r",18:"s"};
return pts[pt.x]+pts[pt.y];
},expandCompressedPoints:function(_11d){
var _11e;
var ul,lr;
var x,y;
var _123=[];
var hits=[];
for(var i=0;i<_11d.length;i++){
_11e=_11d[i].split(/:/);
if(_11e.length>1){
ul=this.sgfCoordToPoint(_11e[0]);
lr=this.sgfCoordToPoint(_11e[1]);
for(x=ul.x;x<=lr.x;x++){
for(y=ul.y;y<=lr.y;y++){
_123.push(this.pointToSgfCoord({x:x,y:y}));
}
}
hits.push(i);
}
}
_11d=_11d.concat(_123);
return _11d;
},setPermalink:function(){
if(!this.permalinkable){
return true;
}
if(this.unsavedChanges){
alert(t["unsaved changes"]);
return;
}
this.hook("setPermalink");
},nowLoading:function(msg){
if(this.croaked||this.problemMode){
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
var _2={theme:"problem",problemMode:true,markVariations:false,markNext:false,shrinkToFit:true};
var _3=eidogo.util.getPlayerPath();
var _4=eidogo.playerPath=(_1.playerPath||_3||"player").replace(/\/$/,"");
if(!_1.skipCss){
eidogo.util.addStyleSheet(_4+"/css/player.css");
if(eidogo.browser.ie&&parseInt(eidogo.browser.ver,10)<=6){
eidogo.util.addStyleSheet(_4+"/css/player-ie6.css");
}
}
eidogo.util.addEvent(window,"load",function(){
eidogo.autoPlayers=[];
var _5=[];
var _6=document.getElementsByTagName("div");
var _7=_6.length;
for(var i=0;i<_7;i++){
if(eidogo.util.hasClass(_6[i],"eidogo-player-auto")||eidogo.util.hasClass(_6[i],"eidogo-player-problem")){
_5.push(_6[i]);
}
}
var el;
for(var i=0;el=_5[i];i++){
var _a={container:el,disableShortcuts:true,theme:"compact"};
if(eidogo.util.hasClass(el,"eidogo-player-problem")){
for(var _b in _2){
_a[_b]=_2[_b];
}
}else{
for(var _b in _1){
_a[_b]=_1[_b];
}
}
var _c=el.getAttribute("sgf");
if(_c){
_a.sgfUrl=_c;
}else{
if(el.innerHTML){
_a.sgf=el.innerHTML;
}
}
el.innerHTML="";
eidogo.util.show(el);
var _d=new eidogo.Player(_a);
eidogo.autoPlayers.push(_d);
}
});
})();

