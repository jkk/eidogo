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
eidogo.i18n=eidogo.i18n||{"move":"Move","loading":"Loading","passed":"passed","resigned":"resigned","variations":"Variations","no variations":"none","tool":"Tool","play":"Play","region":"Select Region","add_b":"Black Stone","add_w":"White Stone","edit comment":"Edit Comment","done":"Done","triangle":"Triangle","square":"Square","circle":"Circle","x":"X","letter":"Letter","number":"Number","dim":"Dim","score":"Score","search":"Search","search corner":"Corner Search","search center":"Center Search","region info":"Click and drag to select a region.","two stones":"Please select at least two stones to search for.","two edges":"For corner searches, your selection must touch two adjacent edges of the board.","no search url":"No search URL provided.","close search":"close search","matches found":"matches found.","save to server":"Save to Server","download sgf":"Download SGF","next game":"Next Game","previous game":"Previous Game","white":"White","white rank":"White rank","white team":"White team","black":"Black","black rank":"Black rank","black team":"Black team","captures":"captures","time left":"time left","you":"You","game":"Game","handicap":"Handicap","komi":"Komi","result":"Result","date":"Date","info":"Info","place":"Place","event":"Event","round":"Round","overtime":"Overtime","opening":"Openning","ruleset":"Ruleset","annotator":"Annotator","copyright":"Copyright","source":"Source","time limit":"Time limit","transcriber":"Transcriber","created with":"Created with","january":"January","february":"February","march":"March","april":"April","may":"May","june":"June","july":"July","august":"August","september":"September","october":"October","november":"November","december":"December","gw":"Good for White","vgw":"Very good for White","gb":"Good for Black","vgb":"Very good for Black","dm":"Even position","dmj":"Even position (joseki)","uc":"Unclear position","te":"Tesuji","bm":"Bad move","vbm":"Very bad move","do":"Doubtful move","it":"Interesting move","black to play":"Black to play","white to play":"White to play","ho":"Hotspot","dom error":"Error finding DOM container","error retrieving":"There was a problem retrieving the game data.","invalid data":"Received invalid game data","error board":"Error loading board container","unsaved changes":"There are unsaved changes in this game. You must save before you can permalink or download.","bad path":"Don't know how to get to path: ","gnugo thinking":"GNU Go is thinking..."};

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
var _1e;
for(var x=0;x<this.boardSize;x++){
for(var y=0;y<this.boardSize;y++){
_1e=y*this.boardSize+x;
if(_19[_1e]==null){
continue;
}else{
if(_19[_1e]==this.EMPTY){
_1b="empty";
}else{
_1b=(_19[_1e]==this.WHITE?"white":"black");
}
}
this.renderer.renderStone({x:x,y:y},_1b);
this.lastRender.stones[_1e]=_19[_1e];
}
}
for(var x=0;x<this.boardSize;x++){
for(var y=0;y<this.boardSize;y++){
_1e=y*this.boardSize+x;
if(_1a[_1e]==null){
continue;
}
this.renderer.renderMarker({x:x,y:y},_1a[_1e]);
this.lastRender.markers[_1e]=_1a[_1e];
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
this.uniq=_23.id+"-";
this.renderCache={stones:[].setLength(this.boardSize,0).addDimension(this.boardSize,0),markers:[].setLength(this.boardSize,0).addDimension(this.boardSize,0)};
this.pointWidth=0;
this.pointHeight=0;
this.margin=0;
var _26=this.renderStone({x:0,y:0},"black");
this.pointWidth=this.pointHeight=_26.offsetWidth;
this.renderStone({x:0,y:0},"white");
this.renderMarker({x:0,y:0},"current");
this.clear();
this.margin=(this.domNode.offsetWidth-(this.boardSize*this.pointWidth))/2;
},clear:function(){
this.domNode.innerHTML="";
},renderStone:function(pt,_28){
var _29=document.getElementById(this.uniq+"stone-"+pt.x+"-"+pt.y);
if(_29){
_29.parentNode.removeChild(_29);
}
if(_28!="empty"){
var div=document.createElement("div");
div.id=this.uniq+"stone-"+pt.x+"-"+pt.y;
div.className="point stone "+_28;
div.style.left=(pt.x*this.pointWidth+this.margin)+"px";
div.style.top=(pt.y*this.pointHeight+this.margin)+"px";
this.domNode.appendChild(div);
return div;
}
return null;
},renderMarker:function(pt,_2c){
if(this.renderCache.markers[pt.x][pt.y]){
var _2d=document.getElementById(this.uniq+"marker-"+pt.x+"-"+pt.y);
if(_2d){
_2d.parentNode.removeChild(_2d);
}
}
if(_2c=="empty"||!_2c){
this.renderCache.markers[pt.x][pt.y]=0;
return null;
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
case "dim":
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
div.id=this.uniq+"marker-"+pt.x+"-"+pt.y;
div.className="point marker "+_2c;
div.style.left=(pt.x*this.pointWidth+this.margin)+"px";
div.style.top=(pt.y*this.pointHeight+this.margin)+"px";
div.appendChild(document.createTextNode(_2e));
this.domNode.appendChild(div);
return div;
}
return null;
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
var t=eidogo.i18n,_2=eidogo.util.byId,_3=eidogo.util.ajax,_4=eidogo.util.addEvent,_5=eidogo.util.onClick,_6=eidogo.util.getElClickXY,_7=eidogo.util.stopEvent,_8=eidogo.util.addClass,_9=eidogo.util.removeClass,_a=eidogo.util.show,_b=eidogo.util.hide,_c=eidogo.util.getPlayerPath(),ua=navigator.userAgent.toLowerCase(),_e=/mozilla/.test(ua)&&!/(compatible|webkit)/.test(ua);
eidogo.Player=function(_f){
this.init(_f);
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
this.sgfPath=cfg.sgfPath;
this.searchUrl=cfg.searchUrl;
this.showingSearch=false;
this.saveUrl=cfg.saveUrl;
this.downloadUrl=cfg.downloadUrl;
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
},hook:function(_11,_12){
if(_11 in this.hooks){
this.hooks[_11].bind(this)(_12);
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
},loadSgf:function(cfg,_15){
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
this.remoteLoad(cfg.sgfUrl,null,false,null,_15);
var _17=true;
if(cfg.progressiveLoad){
this.progressiveLoads=0;
this.progressiveUrl=cfg.progressiveUrl||cfg.sgfUrl.replace(/\?.+$/,"");
}
}else{
var _18=cfg.boardSize||"19";
var _19={nodes:[],trees:[{nodes:[{SZ:_18}],trees:[]}]};
if(cfg.opponentUrl){
this.opponentUrl=cfg.opponentUrl;
this.opponentColor=cfg.opponentColor=="B"?cfg.opponentColor:"W";
var _1a=_19.trees.first().nodes.first();
_1a.PW=t["you"];
_1a.PB="GNU Go";
this.gameName="gnugo";
}
this.load(_19);
}
}
}
if(!_17&&typeof _15=="function"){
_15();
}
},initGame:function(_1b){
this.handleDisplayPrefs();
var _1c=_1b.trees.first().nodes.first();
var _1d=_1c.SZ;
if(!this.board){
this.createBoard(_1d||19);
}
this.unsavedChanges=false;
this.resetCursor(true);
this.totalMoves=0;
var _1e=new eidogo.GameCursor(this.cursor.node);
while(_1e.next()){
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
},createBoard:function(_1f){
_1f=_1f||19;
if(this.board&&this.board.renderer&&this.board.boardSize==_1f){
return;
}
try{
this.dom.boardContainer.innerHTML="";
var _20=new eidogo.BoardRendererHtml(this.dom.boardContainer,_1f);
this.board=new eidogo.Board(_20,_1f);
}
catch(e){
if(e=="No DOM container"){
this.croak(t["error board"]);
return;
}
}
if(_1f!=19){
_9(this.dom.boardContainer,"with-coords");
}else{
_8(this.dom.boardContainer,"with-coords");
}
this.board.renderer.domNode.appendChild(this.dom.searchRegion);
this.rules=new eidogo.Rules(this.board);
var _21=this.board.renderer.domNode;
_4(_21,"mousemove",this.handleBoardHover,this,true);
_4(_21,"mousedown",this.handleBoardMouseDown,this,true);
_4(_21,"mouseup",this.handleBoardMouseUp,this,true);
},load:function(_22,_23){
if(!_23){
_23=new eidogo.GameTree();
this.gameTree=_23;
}
_23.loadJson(_22);
_23.cached=true;
this.doneLoading();
if(!_23.parent){
this.initGame(_23);
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
},remoteLoad:function(url,_25,_26,_27,_28){
_26=_26=="undefined"?true:_26;
_28=(typeof _28=="function")?_28:null;
if(_26){
if(!_25){
this.gameName=url;
}
url=this.sgfPath+url+".sgf";
}
if(_27){
this.loadPath=_27;
}
var _29=function(req){
var _2b=req.responseText;
var _2c=_2b.charAt(0);
var i=1;
while(i<_2b.length&&(_2c==" "||_2c=="\r"||_2c=="\n")){
_2c=_2b.charAt(i++);
}
if(_2c=="("){
var me=this;
var sgf=new eidogo.SgfParser(_2b,function(){
me.load(this.tree,_25);
_28&&_28();
});
}else{
if(_2c=="{"){
_2b=eval("("+_2b+")");
this.load(_2b,_25);
_28&&_28();
}else{
this.croak(t["invalid data"]);
}
}
};
var _30=function(req){
this.croak(t["error retrieving"]);
};
_3("get",url,null,_29,_30,this,30000);
},fetchOpponentMove:function(){
this.nowLoading(t["gnugo thinking"]);
var _32=function(req){
this.doneLoading();
this.createMove(req.responseText);
};
var _34=function(req){
this.croak(t["error retrieving"]);
};
var _36={sgf:this.gameTree.trees[0].toSgf(),move:this.currentColor,size:this.gameTree.trees.first().nodes.first().SZ};
_3("post",this.opponentUrl,_36,_32,_34,this,45000);
},goTo:function(_37,_38){
_38=typeof _38!="undefined"?_38:true;
var _39;
var _3a;
if(_37 instanceof Array){
if(!_37.length){
return;
}
if(_38){
this.resetCursor(true);
}
while(_37.length){
_39=_37[0];
if(isNaN(parseInt(_39,10))){
_3a=this.getVariations(true);
if(!_3a.length||_3a[0].move==null){
this.variation(null,true);
if(this.progressiveLoads){
this.loadPath.push(_39);
return;
}
}
for(var i=0;i<_3a.length;i++){
if(_3a[i].move==_39){
this.variation(_3a[i].treeNum,true);
break;
}
}
_37.shift();
}else{
_39=parseInt(_37.shift(),10);
if(_37.length==0){
for(var i=0;i<_39;i++){
this.variation(null,true);
}
}else{
if(_37.length){
this.variation(_39,true);
if(_37.length!=1){
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
if(!isNaN(parseInt(_37,10))){
var _3c=parseInt(_37,10);
if(_38){
this.resetCursor(true);
_3c++;
}
for(var i=0;i<_3c;i++){
this.variation(null,true);
}
this.refresh();
}else{
alert(t["bad path"]+" "+_37);
}
}
},resetCursor:function(_3d,_3e){
this.board.reset();
this.currentColor="B";
this.moveNumber=0;
if(_3e){
this.cursor.node=this.gameTree.trees.first().nodes.first();
}else{
this.cursor.node=this.gameTree.nodes.first();
}
this.refresh(_3d);
},refresh:function(_3f){
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
this.execNode(_3f);
},variation:function(_41,_42){
if(this.cursor.next(_41)){
this.execNode(_42);
this.resetLastLabels();
if(this.progressiveLoads){
return false;
}
return true;
}
return false;
},execNode:function(_43,_44){
if(!_44&&this.progressiveLoads){
var me=this;
setTimeout(function(){
me.execNode.call(me,_43);
},10);
return;
}
if(!_43){
this.dom.comments.innerHTML="";
this.board.clearMarkers();
}
if(this.moveNumber<1){
this.currentColor="B";
}
var _46=this.cursor.node.getProperties();
for(var _47 in _46){
if(this.propertyHandlers[_47]){
(this.propertyHandlers[_47]).apply(this,[this.cursor.node[_47],_47,_43]);
}
}
if(_43){
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
if(!_44&&this.progressiveUrl&&!this.cursor.node.parent.cached){
this.nowLoading();
this.progressiveLoads++;
this.remoteLoad(this.progressiveUrl+"?id="+this.cursor.node.parent.id,this.cursor.node.parent);
}
},findVariations:function(){
this.variations=this.getVariations(this.prefs.markNext);
},getVariations:function(_48){
var _49=[];
if(!this.cursor.node){
return _49;
}
if(_48&&this.cursor.node.nextSibling!=null){
_49.push({move:this.cursor.node.nextSibling.getMove(),treeNum:null});
}
if(this.cursor.node.nextSibling==null&&this.cursor.node.parent&&this.cursor.node.parent.trees.length){
var _4a=this.cursor.node.parent.trees;
for(var i=0;i<_4a.length;i++){
_49.push({move:_4a[i].nodes.first().getMove(),treeNum:i});
}
}
return _49;
},back:function(e,obj,_4e){
if(this.cursor.previous()){
this.moveNumber--;
if(this.moveNumber<0){
this.moveNumber=0;
}
this.board.revert(1);
this.refresh(_4e);
this.resetLastLabels();
}
},forward:function(e,obj,_51){
this.variation(null,_51);
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
},getXY:function(e){
var _54=_6(e,this.board.renderer.domNode);
var m=this.board.renderer.margin;
var pw=this.board.renderer.pointWidth;
var ph=this.board.renderer.pointHeight;
var x=Math.round((_54[0]-m-(pw/2))/pw);
var y=Math.round((_54[1]-m-(ph/2))/ph);
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
},handleBoardMouseUp:function(e){
if(this.domLoading){
return;
}
this.mouseDown=false;
var xy=this.getXY(e);
var x=xy[0];
var y=xy[1];
var _66=this.pointToSgfCoord({x:x,y:y});
if(this.mode=="play"){
for(var i=0;i<this.variations.length;i++){
var _68=this.sgfCoordToPoint(this.variations[i].move);
if(_68.x==x&&_68.y==y){
this.variation(this.variations[i].treeNum);
_7(e);
return;
}
}
if(!this.rules.check({x:x,y:y},this.currentColor)){
return;
}
if(_66){
var _69=this.cursor.getNextMoves();
if(_69&&_66 in _69){
this.variation(_69[_66]);
}else{
this.createMove(_66);
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
var _6a;
var _6b=this.board.getStone({x:x,y:y});
if(this.mode=="add_b"||this.mode=="add_w"){
this.cursor.node.emptyPoint(this.pointToSgfCoord({x:x,y:y}));
if(_6b!=this.board.BLACK&&this.mode=="add_b"){
_6a="AB";
}else{
if(_6b!=this.board.WHITE&&this.mode=="add_w"){
_6a="AW";
}else{
_6a="AE";
}
}
}else{
switch(this.mode){
case "tr":
_6a="TR";
break;
case "sq":
_6a="SQ";
break;
case "cr":
_6a="CR";
break;
case "x":
_6a="MA";
break;
case "dim":
_6a="DD";
break;
case "number":
_6a="LB";
_66=_66+":"+this.labelLastNumber;
this.labelLastNumber++;
break;
case "letter":
_6a="LB";
_66=_66+":"+this.labelLastLetter;
this.labelLastLetter=String.fromCharCode(this.labelLastLetter.charCodeAt(0)+1);
}
}
this.cursor.node.pushProperty(_6a,_66);
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
},boundsCheck:function(x,y,_6f){
if(_6f.length==2){
_6f[3]=_6f[2]=_6f[1];
_6f[1]=_6f[0];
}
return (x>=_6f[0]&&y>=_6f[1]&&x<=_6f[2]&&y<=_6f[3]);
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
var _74=this.getRegionBounds();
this.dom.searchRegion.style.top=(this.board.renderer.margin+this.board.renderer.pointHeight*_74[0])+"px";
this.dom.searchRegion.style.left=(this.board.renderer.margin+this.board.renderer.pointWidth*_74[1])+"px";
this.dom.searchRegion.style.width=this.board.renderer.pointWidth*_74[2]+"px";
this.dom.searchRegion.style.height=this.board.renderer.pointHeight*_74[3]+"px";
_a(this.dom.searchRegion);
},loadSearch:function(q,dim,p,a){
var _79={nodes:[],trees:[{nodes:[{SZ:this.board.boardSize}],trees:[]}]};
this.load(_79);
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
var _84=this.dom.searchAlgo.value;
var _85=this.getRegionBounds();
var _86=this.board.getRegion(_85[0],_85[1],_85[2],_85[3]);
var _87=_86.join("").replace(new RegExp(this.board.EMPTY,"g"),".").replace(new RegExp(this.board.BLACK,"g"),"x").replace(new RegExp(this.board.WHITE,"g"),"o");
var _88=/^\.*$/.test(_87);
var _89=/^\.*O\.*$/.test(_87);
var _8a=/^\.*X\.*$/.test(_87);
if(_88||_89||_8a){
this.searching=false;
_a(this.dom.comments);
_b(this.dom.searchContainer);
this.prependComment(t["two stones"]);
return;
}
var _8b=[];
if(_85[0]==0){
_8b.push("n");
}
if(_85[1]==0){
_8b.push("w");
}
if(_85[0]+_85[3]==this.board.boardSize){
_8b.push("s");
}
if(_85[1]+_85[2]==this.board.boardSize){
_8b.push("e");
}
if(_84=="corner"&&!(_8b.length==2&&((_8b.contains("n")&&_8b.contains("e"))||(_8b.contains("n")&&_8b.contains("w"))||(_8b.contains("s")&&_8b.contains("e"))||(_8b.contains("s")&&_8b.contains("w"))))){
this.searching=false;
_a(this.dom.comments);
_b(this.dom.searchContainer);
this.prependComment(t["two edges"]);
return;
}
var _8c=(_8b.contains("n")?"n":"s");
_8c+=(_8b.contains("w")?"w":"e");
this.showComments("");
this.gameName="search";
var _8d=function(req){
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
var _8f=eval("("+req.responseText+")");
var _90;
var _91="";
var odd;
for(var i=0;_90=_8f[i];i++){
odd=odd?false:true;
_91+="<a class='search-result"+(odd?" odd":"")+"' href='#'>                    <span class='id'>"+_90.id+"</span>                    <span class='mv'>"+_90.mv+"</span>                    <span class='pw'>"+_90.pw+" "+_90.wr+"</span>                    <span class='pb'>"+_90.pb+" "+_90.br+"</span>                    <span class='re'>"+_90.re+"</span>                    <span class='dt'>"+_90.dt+"</span>                    <div class='clear'>&nbsp;</div>                    </a>";
}
_a(this.dom.searchResultsContainer);
this.dom.searchResults.innerHTML=_91;
this.dom.searchCount.innerHTML=_8f.length;
};
var _94=function(req){
this.croak(t["error retrieving"]);
};
var _96={q:_8c,w:_85[2],h:_85[3],p:_87,a:_84,t:(new Date()).getTime()};
this.progressiveLoad=false;
this.progressiveUrl=null;
this.prefs.markNext=false;
this.prefs.showPlayerInfo=true;
this.hook("searchRegion",_96);
this.nowLoading();
_3("get",this.searchUrl,_96,_8d,_94,this,45000);
},loadSearchResult:function(e){
this.nowLoading();
var _98=e.target||e.srcElement;
if(_98.nodeName=="SPAN"){
_98=_98.parentNode;
}
if(_98.nodeName=="A"){
var _99;
var id;
var mv;
for(var i=0;_99=_98.childNodes[i];i++){
if(_99.className=="id"){
id=_99.innerHTML;
}
if(_99.className=="mv"){
mv=parseInt(_99.innerHTML,10);
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
},compressPattern:function(_9d){
var c=null;
var pc="";
var n=1;
var ret="";
for(var i=0;i<_9d.length;i++){
c=_9d.charAt(i);
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
},uncompressPattern:function(_a3){
var c=null;
var s=null;
var n="";
var ret="";
for(var i=0;i<_a3.length;i++){
c=_a3.charAt(i);
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
},createMove:function(_aa){
var _ab={};
_ab[this.currentColor]=_aa;
_ab["MN"]=(++this.moveNumber).toString();
var _ac=new eidogo.GameNode(_ab);
this.totalMoves++;
if(this.cursor.hasNext()){
if(this.cursor.node.nextSibling){
this.cursor.node.parent.createVariationTree(this.cursor.node.getPosition());
}
this.cursor.node.parent.appendTree(new eidogo.GameTree({nodes:[_ac],trees:[]}));
this.variation(this.cursor.node.parent.trees.length-1);
}else{
this.cursor.node.parent.appendNode(_ac);
this.variation();
}
this.unsavedChanges=true;
},handleKeypress:function(e){
if(this.editingComment){
return true;
}
var _ae=e.keyCode||e.charCode;
if(!_ae||e.ctrlKey||e.altKey||e.metaKey){
return true;
}
var _af=String.fromCharCode(_ae).toLowerCase();
for(var i=0;i<this.variations.length;i++){
var _b1=this.sgfCoordToPoint(this.variations[i].move);
var _b2=""+(i+1);
if(_b1.x!=null&&this.board.getMarker(_b1)!=this.board.EMPTY&&typeof this.board.getMarker(_b1)=="string"){
_b2=this.board.getMarker(_b1).toLowerCase();
}
_b2=_b2.replace(/^var:/,"");
if(_af==_b2.charAt(0)){
this.variation(this.variations[i].treeNum);
_7(e);
return;
}
}
if(_ae==112||_ae==27){
this.selectTool("play");
}
var _b3=true;
switch(_ae){
case 32:
if(e.shiftKey){
this.back();
}else{
this.forward();
}
break;
case 39:
if(e.shiftKey){
var _b4=this.totalMoves-this.moveNumber;
var _b5=(_b4>9?9:_b4-1);
for(var i=0;i<_b5;i++){
this.forward(null,null,true);
}
}
this.forward();
break;
case 37:
if(e.shiftKey){
var _b5=(this.moveNumber>9?9:this.moveNumber-1);
for(var i=0;i<_b5;i++){
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
_b3=false;
break;
}
if(_b3){
_7(e);
}
},showInfo:function(){
this.dom.infoGame.innerHTML="";
this.dom.whiteName.innerHTML="";
this.dom.blackName.innerHTML="";
var _b6=this.gameTree.trees.first().nodes.first();
var dl=document.createElement("dl");
for(var _b8 in this.infoLabels){
if(_b6[_b8]){
if(_b8=="PW"){
this.dom.whiteName.innerHTML=_b6[_b8]+(_b6["WR"]?", "+_b6["WR"]:"");
continue;
}else{
if(_b8=="PB"){
this.dom.blackName.innerHTML=_b6[_b8]+(_b6["BR"]?", "+_b6["BR"]:"");
continue;
}
}
if(_b8=="WR"||_b8=="BR"){
continue;
}
if(_b8=="DT"){
var _b9=_b6[_b8].split(/[\.-]/);
if(_b9.length==3){
_b6[_b8]=_b9[2].replace(/^0+/,"")+" "+this.months[_b9[1]-1]+" "+_b9[0];
}
}
var dt=document.createElement("dt");
dt.innerHTML=this.infoLabels[_b8]+":";
var dd=document.createElement("dd");
dd.innerHTML=_b6[_b8];
dl.appendChild(dt);
dl.appendChild(dd);
}
}
this.dom.infoGame.appendChild(dl);
},selectTool:function(_bc){
var _bd;
if(_bc=="region"){
_bd="crosshair";
}else{
if(_bc=="comment"){
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
_bd="default";
this.regionBegun=false;
_b(this.dom.searchRegion);
_b(this.dom.searchButton);
_b(this.dom.searchAlgo);
}
}
this.board.renderer.domNode.style.cursor=_bd;
this.mode=_bc;
this.dom.toolsSelect.value=_bc;
},finishEditComment:function(){
var _bf=this.cursor.node.C;
var _c0=this.dom.commentsEditTa.value;
if(_bf!=_c0){
this.unsavedChanges=true;
this.cursor.node.C=_c0;
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
var _c2=i+1;
if(!this.variations[i].move||this.variations[i].move=="tt"){
_8(this.dom.controlPass,"pass-on");
}else{
var _c3=this.sgfCoordToPoint(this.variations[i].move);
if(this.board.getMarker(_c3)!=this.board.EMPTY){
_c2=this.board.getMarker(_c3);
}
if(this.prefs.markVariations){
this.board.addMarker(_c3,"var:"+_c2);
}
}
var _c4=document.createElement("div");
_c4.className="variation-nav";
_c4.innerHTML=_c2;
_4(_c4,"click",function(e,arg){
arg.me.variation(arg.treeNum);
},{me:this,treeNum:this.variations[i].treeNum});
this.dom.variations.appendChild(_c4);
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
var _c7="";
if(!this.prefs.showPlayerInfo){
_c7+=this.getGameDescription(true);
}
if(!this.prefs.showGameInfo){
_c7+=this.dom.infoGame.innerHTML;
}
if(_c7.length){
this.prependComment(_c7,"comment-info");
}
}
if(!this.progressiveLoad){
this.updateNavSlider();
}
},setColor:function(_c8){
this.prependComment(_c8=="B"?t["black to play"]:t["white to play"]);
this.currentColor=_c8;
},setMoveNumber:function(num){
this.moveNumber=num;
},playMove:function(_ca,_cb,_cc){
_cb=_cb||this.currentColor;
this.currentColor=(_cb=="B"?"W":"B");
_cb=_cb=="W"?this.board.WHITE:this.board.BLACK;
var pt=this.sgfCoordToPoint(_ca);
if(!this.cursor.node["MN"]){
this.moveNumber++;
}
if((!_ca||_ca=="tt"||_ca=="")&&!_cc){
this.prependComment((_cb==this.board.WHITE?t["white"]:t["black"])+" "+t["passed"],"comment-pass");
}else{
if(_ca=="resign"){
this.prependComment((_cb==this.board.WHITE?t["white"]:t["black"])+" "+t["resigned"],"comment-resign");
}else{
this.board.addStone(pt,_cb);
this.rules.apply(pt,_cb);
if(this.prefs.markCurrent&&!_cc){
this.addMarker(_ca,"current");
}
}
}
},addStone:function(_ce,_cf){
if(!(_ce instanceof Array)){
_ce=[_ce];
}
_ce=this.expandCompressedPoints(_ce);
for(var i=0;i<_ce.length;i++){
this.board.addStone(this.sgfCoordToPoint(_ce[i]),_cf=="AW"?this.board.WHITE:_cf=="AB"?this.board.BLACK:this.board.EMPTY);
}
},addMarker:function(_d1,_d2){
if(!(_d1 instanceof Array)){
_d1=[_d1];
}
_d1=this.expandCompressedPoints(_d1);
var _d3;
for(var i=0;i<_d1.length;i++){
switch(_d2){
case "TR":
_d3="triangle";
break;
case "SQ":
_d3="square";
break;
case "CR":
_d3="circle";
break;
case "MA":
_d3="ex";
break;
case "TW":
_d3="territory-white";
break;
case "TB":
_d3="territory-black";
break;
case "DD":
_d3="dim";
break;
case "LB":
_d3=(_d1[i].split(":"))[1];
_d1[i];
break;
default:
_d3=_d2;
break;
}
this.board.addMarker(this.sgfCoordToPoint((_d1[i].split(":"))[0]),_d3);
}
},showTime:function(_d5,_d6){
var tp=(_d6=="BL"||_d6=="OB"?"timeB":"timeW");
if(_d6=="BL"||_d6=="WL"){
var _d8=Math.floor(_d5/60);
var _d9=(_d5%60).toFixed(0);
_d9=(_d9<10?"0":"")+_d9;
this[tp]=_d8+":"+_d9;
}else{
this[tp]+=" ("+_d5+")";
}
},showAnnotation:function(_da,_db){
var msg;
switch(_db){
case "N":
msg=_da;
break;
case "GB":
msg=(_da>1?t["vgb"]:t["gb"]);
break;
case "GW":
msg=(_da>1?t["vgw"]:t["gw"]);
break;
case "DM":
msg=(_da>1?t["dmj"]:t["dm"]);
break;
case "UC":
msg=t["uc"];
break;
case "TE":
msg=t["te"];
break;
case "BM":
msg=(_da>1?t["vbm"]:t["bm"]);
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
},showComments:function(_dd,_de,_df){
if(!_dd||_df){
return;
}
this.dom.comments.innerHTML+=_dd.replace(/\n/g,"<br />");
},prependComment:function(_e0,cls){
cls=cls||"comment-status";
this.dom.comments.innerHTML="<div class='"+cls+"'>"+_e0+"</div>"+this.dom.comments.innerHTML;
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
var _e4=function(req){
this.hook("saved",[req.responseText]);
};
var _e6=function(req){
this.croak(t["error retrieving"]);
};
var sgf=this.gameTree.trees.first().toSgf();
_3("POST",this.saveUrl,{sgf:sgf},_e4,_e6,this,30000);
},constructDom:function(){
this.dom.player=document.createElement("div");
this.dom.player.className="eidogo-player"+(this.theme?" theme-"+this.theme:"");
this.dom.player.id="player-"+this.uniq;
this.dom.container.innerHTML="";
eidogo.util.show(this.dom.container);
this.dom.container.appendChild(this.dom.player);
var _e9="            <div id='board-container' class='board-container with-coords'></div>            <div id='controls-container' class='controls-container'>                <ul id='controls' class='controls'>                    <li id='control-first' class='control first'>First</li>                    <li id='control-back' class='control back'>Back</li>                    <li id='control-forward' class='control forward'>Forward</li>                    <li id='control-last' class='control last'>Last</li>                    <li id='control-pass' class='control pass'>Pass</li>                </ul>                <div id='move-number' class='move-number"+(this.permalinkable?" permalink":"")+"'></div>                <div id='nav-slider' class='nav-slider'>                    <div id='nav-slider-thumb' class='nav-slider-thumb'></div>                </div>                <div id='variations-container' class='variations-container'>                    <div id='variations-label' class='variations-label'>"+t["variations"]+":</div>                    <div id='variations' class='variations'></div>                </div>                <div class='controls-stop'></div>            </div>            <div id='tools-container' class='tools-container'"+(this.prefs.showTools?"":" style='display: none'")+">                <div id='tools-label' class='tools-label'>"+t["tool"]+":</div>                <select id='tools-select' class='tools-select'>                    <option value='play'>"+t["play"]+"</option>                    <option value='add_b'>"+t["add_b"]+"</option>                    <option value='add_w'>"+t["add_w"]+"</option>                    "+(this.searchUrl?("<option value='region'>"+t["region"]+"</option>"):"")+"                    <option value='comment'>"+t["edit comment"]+"</option>                    <option value='tr'>"+t["triangle"]+"</option>                    <option value='sq'>"+t["square"]+"</option>                    <option value='cr'>"+t["circle"]+"</option>                    <option value='x'>"+t["x"]+"</option>                    <option value='letter'>"+t["letter"]+"</option>                    <option value='number'>"+t["number"]+"</option>                    <option value='dim'>"+t["dim"]+"</option>                </select>                <select id='search-algo' class='search-algo'>                    <option value='corner'>"+t["search corner"]+"</option>                    <option value='center'>"+t["search center"]+"</option>                </select>                <input type='button' id='search-button' class='search-button' value='"+t["search"]+"'>            </div>            <div id='comments' class='comments'></div>            <div id='comments-edit' class='comments-edit'>                <textarea id='comments-edit-ta' class='comments-edit-ta'></textarea>                <div id='comments-edit-done' class='comments-edit-done'>"+t["done"]+"</div>            </div>            <div id='search-container' class='search-container'>                <div id='search-close' class='search-close'>"+t["close search"]+"</div>                <p class='search-count'><span id='search-count'></span>&nbsp;"+t["matches found"]+"</p>                <div id='search-results-container' class='search-results-container'>                    <div class='search-result'>                        <span class='pw'><b>"+t["white"]+"</b></span>                        <span class='pb'><b>"+t["black"]+"</b></span>                        <span class='re'><b>"+t["result"]+"</b></span>                        <span class='dt'><b>"+t["date"]+"</b></span>                        <div class='clear'></div>                    </div>                    <div id='search-results' class='search-results'></div>                </div>            </div>            <div id='info' class='info'>                <div id='info-players' class='players'>                    <div id='white' class='player white'>                        <div id='white-name' class='name'></div>                        <div id='white-captures' class='captures'></div>                        <div id='white-time' class='time'></div>                    </div>                    <div id='black' class='player black'>                        <div id='black-name' class='name'></div>                        <div id='black-captures' class='captures'></div>                        <div id='black-time' class='time'></div>                    </div>                </div>                <div id='info-game' class='game'></div>            </div>            <div id='options' class='options'>                "+(this.saveUrl?"<a id='option-save' class='option-save' href='#'>"+t["save to server"]+"</a>":"")+"                "+(this.downloadUrl||_e?"<a id='option-download' class='option-download' href='#'>"+t["download sgf"]+"</a>":"")+"                <div class='options-stop'></div>            </div>            <div id='preferences' class='preferences'>                <div><input type='checkbox'> Show variations on board</div>                <div><input type='checkbox'> Mark current move</div>            </div>            <div id='footer' class='footer'></div>            <div id='shade' class='shade'></div>        ";
_e9=_e9.replace(/ id='([^']+)'/g," id='$1-"+this.uniq+"'");
this.dom.player.innerHTML=_e9;
var re=/ id='([^']+)-\d+'/g;
var _eb;
var id;
var _ed;
while(_eb=re.exec(_e9)){
id=_eb[0].replace(/'/g,"").replace(/ id=/,"");
_ed="";
_eb[1].split("-").forEach(function(_ee,i){
_ee=i?_ee.charAt(0).toUpperCase()+_ee.substring(1):_ee;
_ed+=_ee;
});
this.dom[_ed]=_2(id);
}
this.dom.searchRegion=document.createElement("div");
this.dom.searchRegion.id="search-region-"+this.uniq;
this.dom.searchRegion.className="search-region";
this.dom.navSlider._width=this.dom.navSlider.offsetWidth;
this.dom.navSliderThumb._width=this.dom.navSliderThumb.offsetWidth;
[["moveNumber","setPermalink"],["controlFirst","first"],["controlBack","back"],["controlForward","forward"],["controlLast","last"],["controlPass","pass"],["searchButton","searchRegion"],["searchResults","loadSearchResult"],["searchClose","closeSearch"],["optionDownload","downloadSgf"],["optionSave","save"],["commentsEditDone","finishEditComment"]].forEach(function(eh){
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
var _f2=false;
var _f3=null;
_4(this.dom.navSlider,"mousedown",function(e){
_f2=true;
_7(e);
},this,true);
_4(document,"mousemove",function(e){
if(!_f2){
return;
}
var xy=_6(e,this.dom.navSlider);
clearTimeout(_f3);
_f3=setTimeout(function(){
this.updateNavSlider(xy[0]);
}.bind(this),10);
_7(e);
},this,true);
_4(document,"mouseup",function(e){
if(!_f2){
return true;
}
_f2=false;
var xy=_6(e,this.dom.navSlider);
this.updateNavSlider(xy[0]);
return true;
},this,true);
},updateNavSlider:function(_f9){
var _fa=this.dom.navSlider._width-this.dom.navSliderThumb._width;
var _fb=this.totalMoves;
var _fc=!!_f9;
_f9=_f9||(this.moveNumber/_fb*_fa);
_f9=_f9>_fa?_fa:_f9;
_f9=_f9<0?0:_f9;
var _fd=parseInt(_f9/_fa*_fb,10);
if(_fc){
this.nowLoading();
var _fe=_fd-this.cursor.node.getPosition();
for(var i=0;i<Math.abs(_fe);i++){
if(_fe>0){
this.variation(null,true);
}else{
if(_fe<0){
this.cursor.previous();
this.moveNumber--;
}
}
}
if(_fe<0){
if(this.moveNumber<0){
this.moveNumber=0;
}
this.board.revert(Math.abs(_fe));
}
this.doneLoading();
this.refresh();
}
_f9=parseInt(_fd/_fb*_fa,10)||0;
this.dom.navSliderThumb.style.left=_f9+"px";
},resetLastLabels:function(){
this.labelLastNumber=1;
this.labelLastLetter="A";
},getGameDescription:function(_100){
var root=this.gameTree.trees.first().nodes.first();
var desc=(_100?"":root.GN||this.gameName);
if(root.PW&&root.PB){
var wr=root.WR?" "+root.WR:"";
var br=root.BR?" "+root.BR:"";
desc+=(desc.length?" - ":"")+root.PW+wr+" vs "+root.PB+br;
}
return desc;
},sgfCoordToPoint:function(_105){
if(!_105||_105=="tt"){
return {x:null,y:null};
}
var _106={a:0,b:1,c:2,d:3,e:4,f:5,g:6,h:7,i:8,j:9,k:10,l:11,m:12,n:13,o:14,p:15,q:16,r:17,s:18};
return {x:_106[_105.charAt(0)],y:_106[_105.charAt(1)]};
},pointToSgfCoord:function(pt){
if(!pt||!this.boundsCheck(pt.x,pt.y,[0,this.board.boardSize-1])){
return null;
}
var pts={0:"a",1:"b",2:"c",3:"d",4:"e",5:"f",6:"g",7:"h",8:"i",9:"j",10:"k",11:"l",12:"m",13:"n",14:"o",15:"p",16:"q",17:"r",18:"s"};
return pts[pt.x]+pts[pt.y];
},expandCompressedPoints:function(_109){
var _10a;
var ul,lr;
var x,y;
var _10f=[];
var hits=[];
for(var i=0;i<_109.length;i++){
_10a=_109[i].split(/:/);
if(_10a.length>1){
ul=this.sgfCoordToPoint(_10a[0]);
lr=this.sgfCoordToPoint(_10a[1]);
for(x=ul.x;x<=lr.x;x++){
for(y=ul.y;y<=lr.y;y++){
_10f.push(this.pointToSgfCoord({x:x,y:y}));
}
}
hits.push(i);
}
}
_109=_109.concat(_10f);
return _109;
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
var _3=(_1.playerPath||_2||"player").replace(/\/$/);
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

