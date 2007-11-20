(function(){
if(typeof _1!="undefined"){
var _2=_1;
}
var _1=window.jQuery=function(_3,_4){
return this instanceof _1?this.init(_3,_4):new _1(_3,_4);
};
if(typeof $!="undefined"){
var _$=$;
}
window.$=_1;
var _6=/^[^<]*(<(.|\s)+>)[^>]*$|^#(\w+)$/;
_1.fn=_1.prototype={init:function(_7,_8){
_7=_7||document;
if(typeof _7=="string"){
var m=_6.exec(_7);
if(m&&(m[1]||!_8)){
if(m[1]){
_7=_1.clean([m[1]],_8);
}else{
var _a=document.getElementById(m[3]);
if(_a){
if(_a.id!=m[3]){
return _1().find(_7);
}else{
this[0]=_a;
this.length=1;
return this;
}
}else{
_7=[];
}
}
}else{
return new _1(_8).find(_7);
}
}else{
if(_1.isFunction(_7)){
return new _1(document)[_1.fn.ready?"ready":"load"](_7);
}
}
return this.setArray(_7.constructor==Array&&_7||(_7.jquery||_7.length&&_7!=window&&!_7.nodeType&&_7[0]!=undefined&&_7[0].nodeType)&&_1.makeArray(_7)||[_7]);
},jquery:"1.2.1",size:function(){
return this.length;
},length:0,get:function(_b){
return _b==undefined?_1.makeArray(this):this[_b];
},pushStack:function(a){
var _d=_1(a);
_d.prevObject=this;
return _d;
},setArray:function(a){
this.length=0;
Array.prototype.push.apply(this,a);
return this;
},each:function(fn,_10){
return _1.each(this,fn,_10);
},index:function(obj){
var pos=-1;
this.each(function(i){
if(this==obj){
pos=i;
}
});
return pos;
},attr:function(key,_15,_16){
var obj=key;
if(key.constructor==String){
if(_15==undefined){
return this.length&&_1[_16||"attr"](this[0],key)||undefined;
}else{
obj={};
obj[key]=_15;
}
}
return this.each(function(_18){
for(var _19 in obj){
_1.attr(_16?this.style:this,_19,_1.prop(this,obj[_19],_16,_18,_19));
}
});
},css:function(key,_1b){
return this.attr(key,_1b,"curCSS");
},text:function(e){
if(typeof e!="object"&&e!=null){
return this.empty().append(document.createTextNode(e));
}
var t="";
_1.each(e||this,function(){
_1.each(this.childNodes,function(){
if(this.nodeType!=8){
t+=this.nodeType!=1?this.nodeValue:_1.fn.text([this]);
}
});
});
return t;
},wrapAll:function(_1e){
if(this[0]){
_1(_1e,this[0].ownerDocument).clone().insertBefore(this[0]).map(function(){
var _1f=this;
while(_1f.firstChild){
_1f=_1f.firstChild;
}
return _1f;
}).append(this);
}
return this;
},wrapInner:function(_20){
return this.each(function(){
_1(this).contents().wrapAll(_20);
});
},wrap:function(_21){
return this.each(function(){
_1(this).wrapAll(_21);
});
},append:function(){
return this.domManip(arguments,true,1,function(a){
this.appendChild(a);
});
},prepend:function(){
return this.domManip(arguments,true,-1,function(a){
this.insertBefore(a,this.firstChild);
});
},before:function(){
return this.domManip(arguments,false,1,function(a){
this.parentNode.insertBefore(a,this);
});
},after:function(){
return this.domManip(arguments,false,-1,function(a){
this.parentNode.insertBefore(a,this.nextSibling);
});
},end:function(){
return this.prevObject||_1([]);
},find:function(t){
var _27=_1.map(this,function(a){
return _1.find(t,a);
});
return this.pushStack(/[^+>] [^+>]/.test(t)||t.indexOf("..")>-1?_1.unique(_27):_27);
},clone:function(_29){
var ret=this.map(function(){
return this.outerHTML?_1(this.outerHTML)[0]:this.cloneNode(true);
});
var _2b=ret.find("*").andSelf().each(function(){
if(this[expando]!=undefined){
this[expando]=null;
}
});
if(_29===true){
this.find("*").andSelf().each(function(i){
var _2d=_1.data(this,"events");
for(var _2e in _2d){
for(var _2f in _2d[_2e]){
_1.event.add(_2b[i],_2e,_2d[_2e][_2f],_2d[_2e][_2f].data);
}
}
});
}
return ret;
},filter:function(t){
return this.pushStack(_1.isFunction(t)&&_1.grep(this,function(el,_32){
return t.apply(el,[_32]);
})||_1.multiFilter(t,this));
},not:function(t){
return this.pushStack(t.constructor==String&&_1.multiFilter(t,this,true)||_1.grep(this,function(a){
return (t.constructor==Array||t.jquery)?_1.inArray(a,t)<0:a!=t;
}));
},add:function(t){
return this.pushStack(_1.merge(this.get(),t.constructor==String?_1(t).get():t.length!=undefined&&(!t.nodeName||_1.nodeName(t,"form"))?t:[t]));
},is:function(_36){
return _36?_1.multiFilter(_36,this).length>0:false;
},hasClass:function(_37){
return this.is("."+_37);
},val:function(val){
if(val==undefined){
if(this.length){
var _39=this[0];
if(_1.nodeName(_39,"select")){
var _3a=_39.selectedIndex,a=[],_3c=_39.options,one=_39.type=="select-one";
if(_3a<0){
return null;
}
for(var i=one?_3a:0,max=one?_3a+1:_3c.length;i<max;i++){
var _40=_3c[i];
if(_40.selected){
var val=_1.browser.msie&&!_40.attributes["value"].specified?_40.text:_40.value;
if(one){
return val;
}
a.push(val);
}
}
return a;
}else{
return this[0].value.replace(/\r/g,"");
}
}
}else{
return this.each(function(){
if(val.constructor==Array&&/radio|checkbox/.test(this.type)){
this.checked=(_1.inArray(this.value,val)>=0||_1.inArray(this.name,val)>=0);
}else{
if(_1.nodeName(this,"select")){
var tmp=val.constructor==Array?val:[val];
_1("option",this).each(function(){
this.selected=(_1.inArray(this.value,tmp)>=0||_1.inArray(this.text,tmp)>=0);
});
if(!tmp.length){
this.selectedIndex=-1;
}
}else{
this.value=val;
}
}
});
}
},html:function(val){
return val==undefined?(this.length?this[0].innerHTML:null):this.empty().append(val);
},replaceWith:function(val){
return this.after(val).remove();
},eq:function(i){
return this.slice(i,i+1);
},slice:function(){
return this.pushStack(Array.prototype.slice.apply(this,arguments));
},map:function(fn){
return this.pushStack(_1.map(this,function(_46,i){
return fn.call(_46,i,_46);
}));
},andSelf:function(){
return this.add(this.prevObject);
},domManip:function(_48,_49,dir,fn){
var _4c=this.length>1,a;
return this.each(function(){
if(!a){
a=_1.clean(_48,this.ownerDocument);
if(dir<0){
a.reverse();
}
}
var obj=this;
if(_49&&_1.nodeName(this,"table")&&_1.nodeName(a[0],"tr")){
obj=this.getElementsByTagName("tbody")[0]||this.appendChild(document.createElement("tbody"));
}
_1.each(a,function(){
var _4f=_4c?this.cloneNode(true):this;
if(!evalScript(0,_4f)){
fn.call(obj,_4f);
}
});
});
}};
function evalScript(i,_51){
var _52=_1.nodeName(_51,"script");
if(_52){
if(_51.src){
_1.ajax({url:_51.src,async:false,dataType:"script"});
}else{
_1.globalEval(_51.text||_51.textContent||_51.innerHTML||"");
}
if(_51.parentNode){
_51.parentNode.removeChild(_51);
}
}else{
if(_51.nodeType==1){
_1("script",_51).each(evalScript);
}
}
return _52;
}
_1.extend=_1.fn.extend=function(){
var _53=arguments[0]||{},a=1,al=arguments.length,_56=false;
if(_53.constructor==Boolean){
_56=_53;
_53=arguments[1]||{};
}
if(al==1){
_53=this;
a=0;
}
var _57;
for(;a<al;a++){
if((_57=arguments[a])!=null){
for(var i in _57){
if(_53==_57[i]){
continue;
}
if(_56&&typeof _57[i]=="object"&&_53[i]){
_1.extend(_53[i],_57[i]);
}else{
if(_57[i]!=undefined){
_53[i]=_57[i];
}
}
}
}
}
return _53;
};
var _59="jQuery"+(new Date()).getTime(),_5a=0,win={};
_1.extend({noConflict:function(_5c){
window.$=_$;
if(_5c){
window.jQuery=_2;
}
return _1;
},isFunction:function(fn){
return !!fn&&typeof fn!="string"&&!fn.nodeName&&fn.constructor!=Array&&/function/i.test(fn+"");
},isXMLDoc:function(_5e){
return _5e.documentElement&&!_5e.body||_5e.tagName&&_5e.ownerDocument&&!_5e.ownerDocument.body;
},globalEval:function(_5f){
_5f=_1.trim(_5f);
if(_5f){
if(window.execScript){
window.execScript(_5f);
}else{
if(_1.browser.safari){
window.setTimeout(_5f,0);
}else{
eval.call(window,_5f);
}
}
}
},nodeName:function(_60,_61){
return _60.nodeName&&_60.nodeName.toUpperCase()==_61.toUpperCase();
},cache:{},data:function(_62,_63,_64){
_62=_62==window?win:_62;
var id=_62[_59];
if(!id){
id=_62[_59]=++_5a;
}
if(_63&&!_1.cache[id]){
_1.cache[id]={};
}
if(_64!=undefined){
_1.cache[id][_63]=_64;
}
return _63?_1.cache[id][_63]:id;
},removeData:function(_66,_67){
_66=_66==window?win:_66;
var id=_66[_59];
if(_67){
if(_1.cache[id]){
delete _1.cache[id][_67];
_67="";
for(_67 in _1.cache[id]){
break;
}
if(!_67){
_1.removeData(_66);
}
}
}else{
try{
delete _66[_59];
}
catch(e){
if(_66.removeAttribute){
_66.removeAttribute(_59);
}
}
delete _1.cache[id];
}
},each:function(obj,fn,_6b){
if(_6b){
if(obj.length==undefined){
for(var i in obj){
fn.apply(obj[i],_6b);
}
}else{
for(var i=0,ol=obj.length;i<ol;i++){
if(fn.apply(obj[i],_6b)===false){
break;
}
}
}
}else{
if(obj.length==undefined){
for(var i in obj){
fn.call(obj[i],i,obj[i]);
}
}else{
for(var i=0,ol=obj.length,val=obj[0];i<ol&&fn.call(val,i,val)!==false;val=obj[++i]){
}
}
}
return obj;
},prop:function(_6f,_70,_71,_72,_73){
if(_1.isFunction(_70)){
_70=_70.call(_6f,[_72]);
}
var _74=/z-?index|font-?weight|opacity|zoom|line-?height/i;
return _70&&_70.constructor==Number&&_71=="curCSS"&&!_74.test(_73)?_70+"px":_70;
},className:{add:function(_75,c){
_1.each((c||"").split(/\s+/),function(i,cur){
if(!_1.className.has(_75.className,cur)){
_75.className+=(_75.className?" ":"")+cur;
}
});
},remove:function(_79,c){
_79.className=c!=undefined?_1.grep(_79.className.split(/\s+/),function(cur){
return !_1.className.has(c,cur);
}).join(" "):"";
},has:function(t,c){
return _1.inArray(c,(t.className||t).toString().split(/\s+/))>-1;
}},swap:function(e,o,f){
for(var i in o){
e.style["old"+i]=e.style[i];
e.style[i]=o[i];
}
f.apply(e,[]);
for(var i in o){
e.style[i]=e.style["old"+i];
}
},css:function(e,p){
if(p=="height"||p=="width"){
var old={},_85,_86,d=["Top","Bottom","Right","Left"];
_1.each(d,function(){
old["padding"+this]=0;
old["border"+this+"Width"]=0;
});
_1.swap(e,old,function(){
if(_1(e).is(":visible")){
_85=e.offsetHeight;
_86=e.offsetWidth;
}else{
e=_1(e.cloneNode(true)).find(":radio").removeAttr("checked").end().css({visibility:"hidden",position:"absolute",display:"block",right:"0",left:"0"}).appendTo(e.parentNode)[0];
var _88=_1.css(e.parentNode,"position")||"static";
if(_88=="static"){
e.parentNode.style.position="relative";
}
_85=e.clientHeight;
_86=e.clientWidth;
if(_88=="static"){
e.parentNode.style.position="static";
}
e.parentNode.removeChild(e);
}
});
return p=="height"?_85:_86;
}
return _1.curCSS(e,p);
},curCSS:function(_89,_8a,_8b){
var ret,_8d=[],_8e=[];
function color(a){
if(!_1.browser.safari){
return false;
}
var ret=document.defaultView.getComputedStyle(a,null);
return !ret||ret.getPropertyValue("color")=="";
}
if(_8a=="opacity"&&_1.browser.msie){
ret=_1.attr(_89.style,"opacity");
return ret==""?"1":ret;
}
if(_8a.match(/float/i)){
_8a=styleFloat;
}
if(!_8b&&_89.style[_8a]){
ret=_89.style[_8a];
}else{
if(document.defaultView&&document.defaultView.getComputedStyle){
if(_8a.match(/float/i)){
_8a="float";
}
_8a=_8a.replace(/([A-Z])/g,"-$1").toLowerCase();
var cur=document.defaultView.getComputedStyle(_89,null);
if(cur&&!color(_89)){
ret=cur.getPropertyValue(_8a);
}else{
for(var a=_89;a&&color(a);a=a.parentNode){
_8d.unshift(a);
}
for(a=0;a<_8d.length;a++){
if(color(_8d[a])){
_8e[a]=_8d[a].style.display;
_8d[a].style.display="block";
}
}
ret=_8a=="display"&&_8e[_8d.length-1]!=null?"none":document.defaultView.getComputedStyle(_89,null).getPropertyValue(_8a)||"";
for(a=0;a<_8e.length;a++){
if(_8e[a]!=null){
_8d[a].style.display=_8e[a];
}
}
}
if(_8a=="opacity"&&ret==""){
ret="1";
}
}else{
if(_89.currentStyle){
var _93=_8a.replace(/\-(\w)/g,function(m,c){
return c.toUpperCase();
});
ret=_89.currentStyle[_8a]||_89.currentStyle[_93];
if(!/^\d+(px)?$/i.test(ret)&&/^\d/.test(ret)){
var _96=_89.style.left;
var _97=_89.runtimeStyle.left;
_89.runtimeStyle.left=_89.currentStyle.left;
_89.style.left=ret||0;
ret=_89.style.pixelLeft+"px";
_89.style.left=_96;
_89.runtimeStyle.left=_97;
}
}
}
}
return ret;
},clean:function(a,doc){
var r=[];
doc=doc||document;
_1.each(a,function(i,arg){
if(!arg){
return;
}
if(arg.constructor==Number){
arg=arg.toString();
}
if(typeof arg=="string"){
arg=arg.replace(/(<(\w+)[^>]*?)\/>/g,function(m,all,tag){
return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area)$/i)?m:all+"></"+tag+">";
});
var s=_1.trim(arg).toLowerCase(),div=doc.createElement("div"),tb=[];
var _a3=!s.indexOf("<opt")&&[1,"<select>","</select>"]||!s.indexOf("<leg")&&[1,"<fieldset>","</fieldset>"]||s.match(/^<(thead|tbody|tfoot|colg|cap)/)&&[1,"<table>","</table>"]||!s.indexOf("<tr")&&[2,"<table><tbody>","</tbody></table>"]||(!s.indexOf("<td")||!s.indexOf("<th"))&&[3,"<table><tbody><tr>","</tr></tbody></table>"]||!s.indexOf("<col")&&[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"]||_1.browser.msie&&[1,"div<div>","</div>"]||[0,"",""];
div.innerHTML=_a3[1]+arg+_a3[2];
while(_a3[0]--){
div=div.lastChild;
}
if(_1.browser.msie){
if(!s.indexOf("<table")&&s.indexOf("<tbody")<0){
tb=div.firstChild&&div.firstChild.childNodes;
}else{
if(_a3[1]=="<table>"&&s.indexOf("<tbody")<0){
tb=div.childNodes;
}
}
for(var n=tb.length-1;n>=0;--n){
if(_1.nodeName(tb[n],"tbody")&&!tb[n].childNodes.length){
tb[n].parentNode.removeChild(tb[n]);
}
}
if(/^\s/.test(arg)){
div.insertBefore(doc.createTextNode(arg.match(/^\s*/)[0]),div.firstChild);
}
}
arg=_1.makeArray(div.childNodes);
}
if(0===arg.length&&(!_1.nodeName(arg,"form")&&!_1.nodeName(arg,"select"))){
return;
}
if(arg[0]==undefined||_1.nodeName(arg,"form")||arg.options){
r.push(arg);
}else{
r=_1.merge(r,arg);
}
});
return r;
},attr:function(_a5,_a6,_a7){
var fix=_1.isXMLDoc(_a5)?{}:_1.props;
if(_a6=="selected"&&_1.browser.safari){
_a5.parentNode.selectedIndex;
}
if(fix[_a6]){
if(_a7!=undefined){
_a5[fix[_a6]]=_a7;
}
return _a5[fix[_a6]];
}else{
if(_1.browser.msie&&_a6=="style"){
return _1.attr(_a5.style,"cssText",_a7);
}else{
if(_a7==undefined&&_1.browser.msie&&_1.nodeName(_a5,"form")&&(_a6=="action"||_a6=="method")){
return _a5.getAttributeNode(_a6).nodeValue;
}else{
if(_a5.tagName){
if(_a7!=undefined){
if(_a6=="type"&&_1.nodeName(_a5,"input")&&_a5.parentNode){
throw "type property can't be changed";
}
_a5.setAttribute(_a6,_a7);
}
if(_1.browser.msie&&/href|src/.test(_a6)&&!_1.isXMLDoc(_a5)){
return _a5.getAttribute(_a6,2);
}
return _a5.getAttribute(_a6);
}else{
if(_a6=="opacity"&&_1.browser.msie){
if(_a7!=undefined){
_a5.zoom=1;
_a5.filter=(_a5.filter||"").replace(/alpha\([^)]*\)/,"")+(parseFloat(_a7).toString()=="NaN"?"":"alpha(opacity="+_a7*100+")");
}
return _a5.filter?(parseFloat(_a5.filter.match(/opacity=([^)]*)/)[1])/100).toString():"";
}
_a6=_a6.replace(/-([a-z])/ig,function(z,b){
return b.toUpperCase();
});
if(_a7!=undefined){
_a5[_a6]=_a7;
}
return _a5[_a6];
}
}
}
}
},trim:function(t){
return (t||"").replace(/^\s+|\s+$/g,"");
},makeArray:function(a){
var r=[];
if(typeof a!="array"){
for(var i=0,al=a.length;i<al;i++){
r.push(a[i]);
}
}else{
r=a.slice(0);
}
return r;
},inArray:function(b,a){
for(var i=0,al=a.length;i<al;i++){
if(a[i]==b){
return i;
}
}
return -1;
},merge:function(_b4,_b5){
if(_1.browser.msie){
for(var i=0;_b5[i];i++){
if(_b5[i].nodeType!=8){
_b4.push(_b5[i]);
}
}
}else{
for(var i=0;_b5[i];i++){
_b4.push(_b5[i]);
}
}
return _b4;
},unique:function(_b7){
var r=[],_b9={};
try{
for(var i=0,fl=_b7.length;i<fl;i++){
var id=_1.data(_b7[i]);
if(!_b9[id]){
_b9[id]=true;
r.push(_b7[i]);
}
}
}
catch(e){
r=_b7;
}
return r;
},grep:function(_bd,fn,inv){
if(typeof fn=="string"){
fn=eval("false||function(a,i){return "+fn+"}");
}
var _c0=[];
for(var i=0,el=_bd.length;i<el;i++){
if(!inv&&fn(_bd[i],i)||inv&&!fn(_bd[i],i)){
_c0.push(_bd[i]);
}
}
return _c0;
},map:function(_c3,fn){
if(typeof fn=="string"){
fn=eval("false||function(a){return "+fn+"}");
}
var _c5=[];
for(var i=0,el=_c3.length;i<el;i++){
var val=fn(_c3[i],i);
if(val!==null&&val!=undefined){
if(val.constructor!=Array){
val=[val];
}
_c5=_c5.concat(val);
}
}
return _c5;
}});
var _c9=navigator.userAgent.toLowerCase();
_1.browser={version:(_c9.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[])[1],safari:/webkit/.test(_c9),opera:/opera/.test(_c9),msie:/msie/.test(_c9)&&!/opera/.test(_c9),mozilla:/mozilla/.test(_c9)&&!/(compatible|webkit)/.test(_c9)};
var _ca=_1.browser.msie?"styleFloat":"cssFloat";
_1.extend({boxModel:!_1.browser.msie||document.compatMode=="CSS1Compat",styleFloat:_1.browser.msie?"styleFloat":"cssFloat",props:{"for":"htmlFor","class":"className","float":_ca,cssFloat:_ca,styleFloat:_ca,innerHTML:"innerHTML",className:"className",value:"value",disabled:"disabled",checked:"checked",readonly:"readOnly",selected:"selected",maxlength:"maxLength"}});
_1.each({parent:"a.parentNode",parents:"jQuery.dir(a,'parentNode')",next:"jQuery.nth(a,2,'nextSibling')",prev:"jQuery.nth(a,2,'previousSibling')",nextAll:"jQuery.dir(a,'nextSibling')",prevAll:"jQuery.dir(a,'previousSibling')",siblings:"jQuery.sibling(a.parentNode.firstChild,a)",children:"jQuery.sibling(a.firstChild)",contents:"jQuery.nodeName(a,'iframe')?a.contentDocument||a.contentWindow.document:jQuery.makeArray(a.childNodes)"},function(i,n){
_1.fn[i]=function(a){
var ret=_1.map(this,n);
if(a&&typeof a=="string"){
ret=_1.multiFilter(a,ret);
}
return this.pushStack(_1.unique(ret));
};
});
_1.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(i,n){
_1.fn[i]=function(){
var a=arguments;
return this.each(function(){
for(var j=0,al=a.length;j<al;j++){
_1(a[j])[n](this);
}
});
};
});
_1.each({removeAttr:function(key){
_1.attr(this,key,"");
this.removeAttribute(key);
},addClass:function(c){
_1.className.add(this,c);
},removeClass:function(c){
_1.className.remove(this,c);
},toggleClass:function(c){
_1.className[_1.className.has(this,c)?"remove":"add"](this,c);
},remove:function(a){
if(!a||_1.filter(a,[this]).r.length){
_1.removeData(this);
this.parentNode.removeChild(this);
}
},empty:function(){
_1("*",this).each(function(){
_1.removeData(this);
});
while(this.firstChild){
this.removeChild(this.firstChild);
}
}},function(i,n){
_1.fn[i]=function(){
return this.each(n,arguments);
};
});
_1.each(["Height","Width"],function(i,_dc){
var n=_dc.toLowerCase();
_1.fn[n]=function(h){
return this[0]==window?_1.browser.safari&&self["inner"+_dc]||_1.boxModel&&Math.max(document.documentElement["client"+_dc],document.body["client"+_dc])||document.body["client"+_dc]:this[0]==document?Math.max(document.body["scroll"+_dc],document.body["offset"+_dc]):h==undefined?(this.length?_1.css(this[0],n):null):this.css(n,h.constructor==String?h:h+"px");
};
});
var _df=_1.browser.safari&&parseInt(_1.browser.version)<417?"(?:[\\w*_-]|\\\\.)":"(?:[\\w\u0128-\uffff*_-]|\\\\.)",_e0=new RegExp("^>\\s*("+_df+"+)"),_e1=new RegExp("^("+_df+"+)(#)("+_df+"+)"),_e2=new RegExp("^([#.]?)("+_df+"*)");
_1.extend({expr:{"":"m[2]=='*'||jQuery.nodeName(a,m[2])","#":"a.getAttribute('id')==m[2]",":":{lt:"i<m[3]-0",gt:"i>m[3]-0",nth:"m[3]-0==i",eq:"m[3]-0==i",first:"i==0",last:"i==r.length-1",even:"i%2==0",odd:"i%2","first-child":"a.parentNode.getElementsByTagName('*')[0]==a","last-child":"jQuery.nth(a.parentNode.lastChild,1,'previousSibling')==a","only-child":"!jQuery.nth(a.parentNode.lastChild,2,'previousSibling')",parent:"a.firstChild",empty:"!a.firstChild",contains:"(a.textContent||a.innerText||jQuery(a).text()||'').indexOf(m[3])>=0",visible:"\"hidden\"!=a.type&&jQuery.css(a,\"display\")!=\"none\"&&jQuery.css(a,\"visibility\")!=\"hidden\"",hidden:"\"hidden\"==a.type||jQuery.css(a,\"display\")==\"none\"||jQuery.css(a,\"visibility\")==\"hidden\"",enabled:"!a.disabled",disabled:"a.disabled",checked:"a.checked",selected:"a.selected||jQuery.attr(a,'selected')",text:"'text'==a.type",radio:"'radio'==a.type",checkbox:"'checkbox'==a.type",file:"'file'==a.type",password:"'password'==a.type",submit:"'submit'==a.type",image:"'image'==a.type",reset:"'reset'==a.type",button:"\"button\"==a.type||jQuery.nodeName(a,\"button\")",input:"/input|select|textarea|button/i.test(a.nodeName)",has:"jQuery.find(m[3],a).length",header:"/h\\d/i.test(a.nodeName)",animated:"jQuery.grep(jQuery.timers,function(fn){return a==fn.elem;}).length"}},parse:[/^(\[) *@?([\w-]+) *([!*$^~=]*) *('?"?)(.*?)\4 *\]/,/^(:)([\w-]+)\("?'?(.*?(\(.*?\))?[^(]*?)"?'?\)/,new RegExp("^([:.#]*)("+_df+"+)")],multiFilter:function(_e3,_e4,not){
var old,cur=[];
while(_e3&&_e3!=old){
old=_e3;
var f=_1.filter(_e3,_e4,not);
_e3=f.t.replace(/^\s*,\s*/,"");
cur=not?_e4=f.r:_1.merge(cur,f.r);
}
return cur;
},find:function(t,_ea){
if(typeof t!="string"){
return [t];
}
if(_ea&&!_ea.nodeType){
_ea=null;
}
_ea=_ea||document;
var ret=[_ea],_ec=[],_ed;
while(t&&_ed!=t){
var r=[];
_ed=t;
t=_1.trim(t);
var _ef=false;
var re=_e0;
var m=re.exec(t);
if(m){
var _f2=m[1].toUpperCase();
for(var i=0;ret[i];i++){
for(var c=ret[i].firstChild;c;c=c.nextSibling){
if(c.nodeType==1&&(_f2=="*"||c.nodeName.toUpperCase()==_f2.toUpperCase())){
r.push(c);
}
}
}
ret=r;
t=t.replace(re,"");
if(t.indexOf(" ")==0){
continue;
}
_ef=true;
}else{
re=/^([>+~])\s*(\w*)/i;
if((m=re.exec(t))!=null){
r=[];
var _f2=m[2],_f5={};
m=m[1];
for(var j=0,rl=ret.length;j<rl;j++){
var n=m=="~"||m=="+"?ret[j].nextSibling:ret[j].firstChild;
for(;n;n=n.nextSibling){
if(n.nodeType==1){
var id=_1.data(n);
if(m=="~"&&_f5[id]){
break;
}
if(!_f2||n.nodeName.toUpperCase()==_f2.toUpperCase()){
if(m=="~"){
_f5[id]=true;
}
r.push(n);
}
if(m=="+"){
break;
}
}
}
}
ret=r;
t=_1.trim(t.replace(re,""));
_ef=true;
}
}
if(t&&!_ef){
if(!t.indexOf(",")){
if(_ea==ret[0]){
ret.shift();
}
_ec=_1.merge(_ec,ret);
r=ret=[_ea];
t=" "+t.substr(1,t.length);
}else{
var re2=_e1;
var m=re2.exec(t);
if(m){
m=[0,m[2],m[3],m[1]];
}else{
re2=_e2;
m=re2.exec(t);
}
m[2]=m[2].replace(/\\/g,"");
var _fb=ret[ret.length-1];
if(m[1]=="#"&&_fb&&_fb.getElementById&&!_1.isXMLDoc(_fb)){
var oid=_fb.getElementById(m[2]);
if((_1.browser.msie||_1.browser.opera)&&oid&&typeof oid.id=="string"&&oid.id!=m[2]){
oid=_1("[@id=\""+m[2]+"\"]",_fb)[0];
}
ret=r=oid&&(!m[3]||_1.nodeName(oid,m[3]))?[oid]:[];
}else{
for(var i=0;ret[i];i++){
var tag=m[1]=="#"&&m[3]?m[3]:m[1]!=""||m[0]==""?"*":m[2];
if(tag=="*"&&ret[i].nodeName.toLowerCase()=="object"){
tag="param";
}
r=_1.merge(r,ret[i].getElementsByTagName(tag));
}
if(m[1]=="."){
r=_1.classFilter(r,m[2]);
}
if(m[1]=="#"){
var tmp=[];
for(var i=0;r[i];i++){
if(r[i].getAttribute("id")==m[2]){
tmp=[r[i]];
break;
}
}
r=tmp;
}
ret=r;
}
t=t.replace(re2,"");
}
}
if(t){
var val=_1.filter(t,r);
ret=r=val.r;
t=_1.trim(val.t);
}
}
if(t){
ret=[];
}
if(ret&&_ea==ret[0]){
ret.shift();
}
_ec=_1.merge(_ec,ret);
return _ec;
},classFilter:function(r,m,not){
m=" "+m+" ";
var tmp=[];
for(var i=0;r[i];i++){
var pass=(" "+r[i].className+" ").indexOf(m)>=0;
if(!not&&pass||not&&!pass){
tmp.push(r[i]);
}
}
return tmp;
},filter:function(t,r,not){
var last;
while(t&&t!=last){
last=t;
var p=_1.parse,m;
for(var i=0;p[i];i++){
m=p[i].exec(t);
if(m){
t=t.substring(m[0].length);
m[2]=m[2].replace(/\\/g,"");
break;
}
}
if(!m){
break;
}
if(m[1]==":"&&m[2]=="not"){
r=_1.filter(m[3],r,true).r;
}else{
if(m[1]=="."){
r=_1.classFilter(r,m[2],not);
}else{
if(m[1]=="["){
var tmp=[],type=m[3];
for(var i=0,rl=r.length;i<rl;i++){
var a=r[i],z=a[_1.props[m[2]]||m[2]];
if(z==null||/href|src|selected/.test(m[2])){
z=_1.attr(a,m[2])||"";
}
if((type==""&&!!z||type=="="&&z==m[5]||type=="!="&&z!=m[5]||type=="^="&&z&&!z.indexOf(m[5])||type=="$="&&z.substr(z.length-m[5].length)==m[5]||(type=="*="||type=="~=")&&z.indexOf(m[5])>=0)^not){
tmp.push(a);
}
}
r=tmp;
}else{
if(m[1]==":"&&m[2]=="nth-child"){
var _112={},tmp=[],test=/(\d*)n\+?(\d*)/.exec(m[3]=="even"&&"2n"||m[3]=="odd"&&"2n+1"||!/\D/.test(m[3])&&"n+"+m[3]||m[3]),_114=(test[1]||1)-0,last=test[2]-0;
for(var i=0,rl=r.length;i<rl;i++){
var node=r[i],_116=node.parentNode,id=_1.data(_116);
if(!_112[id]){
var c=1;
for(var n=_116.firstChild;n;n=n.nextSibling){
if(n.nodeType==1){
n.nodeIndex=c++;
}
}
_112[id]=true;
}
var add=false;
if(_114==1){
if(last==0||node.nodeIndex==last){
add=true;
}
}else{
if((node.nodeIndex+last)%_114==0){
add=true;
}
}
if(add^not){
tmp.push(node);
}
}
r=tmp;
}else{
var f=_1.expr[m[1]];
if(typeof f!="string"){
f=_1.expr[m[1]][m[2]];
}
f=eval("false||function(a,i){return "+f+"}");
r=_1.grep(r,f,not);
}
}
}
}
}
return {r:r,t:t};
},dir:function(elem,dir){
var _11e=[];
var cur=elem[dir];
while(cur&&cur!=document){
if(cur.nodeType==1){
_11e.push(cur);
}
cur=cur[dir];
}
return _11e;
},nth:function(cur,_121,dir,elem){
_121=_121||1;
var num=0;
for(;cur;cur=cur[dir]){
if(cur.nodeType==1&&++num==_121){
break;
}
}
return cur;
},sibling:function(n,elem){
var r=[];
for(;n;n=n.nextSibling){
if(n.nodeType==1&&(!elem||n!=elem)){
r.push(n);
}
}
return r;
}});
_1.event={add:function(_128,type,_12a,data){
if(_1.browser.msie&&_128.setInterval!=undefined){
_128=window;
}
if(!_12a.guid){
_12a.guid=this.guid++;
}
if(data!=undefined){
var fn=_12a;
_12a=function(){
return fn.apply(this,arguments);
};
_12a.data=data;
_12a.guid=fn.guid;
}
var _12d=type.split(".");
type=_12d[0];
_12a.type=_12d[1];
var _12e=_1.data(_128,"events")||_1.data(_128,"events",{});
var _12f=_1.data(_128,"handle",function(){
var val;
if(typeof _1=="undefined"||_1.event.triggered){
return val;
}
val=_1.event.handle.apply(_128,arguments);
return val;
});
var _131=_12e[type];
if(!_131){
_131=_12e[type]={};
if(_128.addEventListener){
_128.addEventListener(type,_12f,false);
}else{
_128.attachEvent("on"+type,_12f);
}
}
_131[_12a.guid]=_12a;
this.global[type]=true;
},guid:1,global:{},remove:function(_132,type,_134){
var _135=_1.data(_132,"events"),ret,_137;
if(typeof type=="string"){
var _138=type.split(".");
type=_138[0];
}
if(_135){
if(type&&type.type){
_134=type.handler;
type=type.type;
}
if(!type){
for(type in _135){
this.remove(_132,type);
}
}else{
if(_135[type]){
if(_134){
delete _135[type][_134.guid];
}else{
for(_134 in _135[type]){
if(!_138[1]||_135[type][_134].type==_138[1]){
delete _135[type][_134];
}
}
}
for(ret in _135[type]){
break;
}
if(!ret){
if(_132.removeEventListener){
_132.removeEventListener(type,_1.data(_132,"handle"),false);
}else{
_132.detachEvent("on"+type,_1.data(_132,"handle"));
}
ret=null;
delete _135[type];
}
}
}
for(ret in _135){
break;
}
if(!ret){
_1.removeData(_132,"events");
_1.removeData(_132,"handle");
}
}
},trigger:function(type,data,_13b,_13c,_13d){
data=_1.makeArray(data||[]);
if(!_13b){
if(this.global[type]){
_1("*").add([window,document]).trigger(type,data);
}
}else{
var val,ret,fn=_1.isFunction(_13b[type]||null),evt=!data[0]||!data[0].preventDefault;
if(evt){
data.unshift(this.fix({type:type,target:_13b}));
}
data[0].type=type;
if(_1.isFunction(_1.data(_13b,"handle"))){
val=_1.data(_13b,"handle").apply(_13b,data);
}
if(!fn&&_13b["on"+type]&&_13b["on"+type].apply(_13b,data)===false){
val=false;
}
if(evt){
data.shift();
}
if(_13d&&_13d.apply(_13b,data)===false){
val=false;
}
if(fn&&_13c!==false&&val!==false&&!(_1.nodeName(_13b,"a")&&type=="click")){
this.triggered=true;
_13b[type]();
}
this.triggered=false;
}
return val;
},handle:function(_142){
var val;
_142=_1.event.fix(_142||window.event||{});
var _144=_142.type.split(".");
_142.type=_144[0];
var c=_1.data(this,"events")&&_1.data(this,"events")[_142.type],args=Array.prototype.slice.call(arguments,1);
args.unshift(_142);
for(var j in c){
args[0].handler=c[j];
args[0].data=c[j].data;
if(!_144[1]||c[j].type==_144[1]){
var tmp=c[j].apply(this,args);
if(val!==false){
val=tmp;
}
if(tmp===false){
_142.preventDefault();
_142.stopPropagation();
}
}
}
if(_1.browser.msie){
_142.target=_142.preventDefault=_142.stopPropagation=_142.handler=_142.data=null;
}
return val;
},fix:function(_149){
var _14a=_149;
_149=_1.extend({},_14a);
_149.preventDefault=function(){
if(_14a.preventDefault){
_14a.preventDefault();
}
_14a.returnValue=false;
};
_149.stopPropagation=function(){
if(_14a.stopPropagation){
_14a.stopPropagation();
}
_14a.cancelBubble=true;
};
if(!_149.target&&_149.srcElement){
_149.target=_149.srcElement;
}
if(_1.browser.safari&&_149.target.nodeType==3){
_149.target=_14a.target.parentNode;
}
if(!_149.relatedTarget&&_149.fromElement){
_149.relatedTarget=_149.fromElement==_149.target?_149.toElement:_149.fromElement;
}
if(_149.pageX==null&&_149.clientX!=null){
var e=document.documentElement,b=document.body;
_149.pageX=_149.clientX+(e&&e.scrollLeft||b.scrollLeft||0);
_149.pageY=_149.clientY+(e&&e.scrollTop||b.scrollTop||0);
}
if(!_149.which&&(_149.charCode||_149.keyCode)){
_149.which=_149.charCode||_149.keyCode;
}
if(!_149.metaKey&&_149.ctrlKey){
_149.metaKey=_149.ctrlKey;
}
if(!_149.which&&_149.button){
_149.which=(_149.button&1?1:(_149.button&2?3:(_149.button&4?2:0)));
}
return _149;
}};
_1.fn.extend({bind:function(type,data,fn){
return type=="unload"?this.one(type,data,fn):this.each(function(){
_1.event.add(this,type,fn||data,fn&&data);
});
},one:function(type,data,fn){
return this.each(function(){
_1.event.add(this,type,function(_153){
_1(this).unbind(_153);
return (fn||data).apply(this,arguments);
},fn&&data);
});
},unbind:function(type,fn){
return this.each(function(){
_1.event.remove(this,type,fn);
});
},trigger:function(type,data,fn){
return this.each(function(){
_1.event.trigger(type,data,this,true,fn);
});
},triggerHandler:function(type,data,fn){
if(this[0]){
return _1.event.trigger(type,data,this[0],false,fn);
}
},toggle:function(){
var a=arguments;
return this.click(function(e){
this.lastToggle=0==this.lastToggle?1:0;
e.preventDefault();
return a[this.lastToggle].apply(this,[e])||false;
});
},hover:function(f,g){
function handleHover(e){
var p=e.relatedTarget;
while(p&&p!=this){
try{
p=p.parentNode;
}
catch(e){
p=this;
}
}
if(p==this){
return false;
}
return (e.type=="mouseover"?f:g).apply(this,[e]);
}
return this.mouseover(handleHover).mouseout(handleHover);
},ready:function(f){
bindReady();
if(_1.isReady){
f.apply(document,[_1]);
}else{
_1.readyList.push(function(){
return f.apply(this,[_1]);
});
}
return this;
}});
_1.extend({isReady:false,readyList:[],ready:function(){
if(!_1.isReady){
_1.isReady=true;
if(_1.readyList){
_1.each(_1.readyList,function(){
this.apply(document);
});
_1.readyList=null;
}
if(_1.browser.mozilla||_1.browser.opera){
document.removeEventListener("DOMContentLoaded",_1.ready,false);
}
if(!window.frames.length){
_1(window).load(function(){
_1("#__ie_init").remove();
});
}
}
}});
_1.each(("blur,focus,load,resize,scroll,unload,click,dblclick,"+"mousedown,mouseup,mousemove,mouseover,mouseout,change,select,"+"submit,keydown,keypress,keyup,error").split(","),function(i,o){
_1.fn[o]=function(f){
return f?this.bind(o,f):this.trigger(o);
};
});
var _166=false;
function bindReady(){
if(_166){
return;
}
_166=true;
if(_1.browser.mozilla||_1.browser.opera){
document.addEventListener("DOMContentLoaded",_1.ready,false);
}else{
if(_1.browser.msie){
document.write("<scr"+"ipt id=__ie_init defer=true "+"src=//:></script>");
var _167=document.getElementById("__ie_init");
if(_167){
_167.onreadystatechange=function(){
if(this.readyState!="complete"){
return;
}
_1.ready();
};
}
_167=null;
}else{
if(_1.browser.safari){
_1.safariTimer=setInterval(function(){
if(document.readyState=="loaded"||document.readyState=="complete"){
clearInterval(_1.safariTimer);
_1.safariTimer=null;
_1.ready();
}
},10);
}
}
}
_1.event.add(window,"load",_1.ready);
}
_1.fn.extend({load:function(url,_169,_16a){
if(_1.isFunction(url)){
return this.bind("load",url);
}
var off=url.indexOf(" ");
if(off>=0){
var _16c=url.slice(off,url.length);
url=url.slice(0,off);
}
_16a=_16a||function(){
};
var type="GET";
if(_169){
if(_1.isFunction(_169)){
_16a=_169;
_169=null;
}else{
_169=_1.param(_169);
type="POST";
}
}
var self=this;
_1.ajax({url:url,type:type,data:_169,complete:function(res,_170){
if(_170=="success"||_170=="notmodified"){
self.html(_16c?_1("<div/>").append(res.responseText.replace(/<script(.|\s)*?\/script>/g,"")).find(_16c):res.responseText);
}
setTimeout(function(){
self.each(_16a,[res.responseText,_170,res]);
},13);
}});
return this;
},serialize:function(){
return _1.param(this.serializeArray());
},serializeArray:function(){
return this.map(function(){
return _1.nodeName(this,"form")?_1.makeArray(this.elements):this;
}).filter(function(){
return this.name&&!this.disabled&&(this.checked||/select|textarea/i.test(this.nodeName)||/text|hidden|password/i.test(this.type));
}).map(function(i,elem){
var val=_1(this).val();
return val==null?null:val.constructor==Array?_1.map(val,function(val,i){
return {name:elem.name,value:val};
}):{name:elem.name,value:val};
}).get();
}});
_1.each("ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","),function(i,o){
_1.fn[o]=function(f){
return this.bind(o,f);
};
});
var jsc=(new Date).getTime();
_1.extend({get:function(url,data,_17c,type){
if(_1.isFunction(data)){
_17c=data;
data=null;
}
return _1.ajax({type:"GET",url:url,data:data,success:_17c,dataType:type});
},getScript:function(url,_17f){
return _1.get(url,null,_17f,"script");
},getJSON:function(url,data,_182){
return _1.get(url,data,_182,"json");
},post:function(url,data,_185,type){
if(_1.isFunction(data)){
_185=data;
data={};
}
return _1.ajax({type:"POST",url:url,data:data,success:_185,dataType:type});
},ajaxSetup:function(_187){
_1.extend(_1.ajaxSettings,_187);
},ajaxSettings:{global:true,type:"GET",timeout:0,contentType:"application/x-www-form-urlencoded",processData:true,async:true,data:null},lastModified:{},ajax:function(s){
var _189,jsre=/=(\?|%3F)/g,_18b,data;
s=_1.extend(true,s,_1.extend(true,{},_1.ajaxSettings,s));
if(s.data&&s.processData&&typeof s.data!="string"){
s.data=_1.param(s.data);
}
if(s.dataType=="jsonp"){
if(s.type.toLowerCase()=="get"){
if(!s.url.match(jsre)){
s.url+=(s.url.match(/\?/)?"&":"?")+(s.jsonp||"callback")+"=?";
}
}else{
if(!s.data||!s.data.match(jsre)){
s.data=(s.data?s.data+"&":"")+(s.jsonp||"callback")+"=?";
}
}
s.dataType="json";
}
if(s.dataType=="json"&&(s.data&&s.data.match(jsre)||s.url.match(jsre))){
_189="jsonp"+jsc++;
if(s.data){
s.data=s.data.replace(jsre,"="+_189);
}
s.url=s.url.replace(jsre,"="+_189);
s.dataType="script";
window[_189]=function(tmp){
data=tmp;
success();
complete();
window[_189]=undefined;
try{
delete window[_189];
}
catch(e){
}
};
}
if(s.dataType=="script"&&s.cache==null){
s.cache=false;
}
if(s.cache===false&&s.type.toLowerCase()=="get"){
s.url+=(s.url.match(/\?/)?"&":"?")+"_="+(new Date()).getTime();
}
if(s.data&&s.type.toLowerCase()=="get"){
s.url+=(s.url.match(/\?/)?"&":"?")+s.data;
s.data=null;
}
if(s.global&&!_1.active++){
_1.event.trigger("ajaxStart");
}
if(!s.url.indexOf("http")&&s.dataType=="script"){
var head=document.getElementsByTagName("head")[0];
var _18f=document.createElement("script");
_18f.src=s.url;
if(!_189&&(s.success||s.complete)){
var done=false;
_18f.onload=_18f.onreadystatechange=function(){
if(!done&&(!this.readyState||this.readyState=="loaded"||this.readyState=="complete")){
done=true;
success();
complete();
head.removeChild(_18f);
}
};
}
head.appendChild(_18f);
return;
}
var _191=false;
var xml=window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest();
xml.open(s.type,s.url,s.async);
if(s.data){
xml.setRequestHeader("Content-Type",s.contentType);
}
if(s.ifModified){
xml.setRequestHeader("If-Modified-Since",_1.lastModified[s.url]||"Thu, 01 Jan 1970 00:00:00 GMT");
}
xml.setRequestHeader("X-Requested-With","XMLHttpRequest");
if(s.beforeSend){
s.beforeSend(xml);
}
if(s.global){
_1.event.trigger("ajaxSend",[xml,s]);
}
var _193=function(_194){
if(!_191&&xml&&(xml.readyState==4||_194=="timeout")){
_191=true;
if(ival){
clearInterval(ival);
ival=null;
}
_18b=_194=="timeout"&&"timeout"||!_1.httpSuccess(xml)&&"error"||s.ifModified&&_1.httpNotModified(xml,s.url)&&"notmodified"||"success";
if(_18b=="success"){
try{
data=_1.httpData(xml,s.dataType);
}
catch(e){
_18b="parsererror";
}
}
if(_18b=="success"){
var _196;
try{
_196=xml.getResponseHeader("Last-Modified");
}
catch(e){
}
if(s.ifModified&&_196){
_1.lastModified[s.url]=_196;
}
if(!_189){
success();
}
}else{
_1.handleError(s,xml,_18b);
}
complete();
if(s.async){
xml=null;
}
}
};
if(s.async){
var ival=setInterval(_193,13);
if(s.timeout>0){
setTimeout(function(){
if(xml){
xml.abort();
if(!_191){
_193("timeout");
}
}
},s.timeout);
}
}
try{
xml.send(s.data);
}
catch(e){
_1.handleError(s,xml,null,e);
}
if(!s.async){
_193();
}
return xml;
function success(){
if(s.success){
s.success(data,_18b);
}
if(s.global){
_1.event.trigger("ajaxSuccess",[xml,s]);
}
}
function complete(){
if(s.complete){
s.complete(xml,_18b);
}
if(s.global){
_1.event.trigger("ajaxComplete",[xml,s]);
}
if(s.global&&!--_1.active){
_1.event.trigger("ajaxStop");
}
}
},handleError:function(s,xml,_199,e){
if(s.error){
s.error(xml,_199,e);
}
if(s.global){
_1.event.trigger("ajaxError",[xml,s,e]);
}
},active:0,httpSuccess:function(r){
try{
return !r.status&&location.protocol=="file:"||(r.status>=200&&r.status<300)||r.status==304||_1.browser.safari&&r.status==undefined;
}
catch(e){
}
return false;
},httpNotModified:function(xml,url){
try{
var _19e=xml.getResponseHeader("Last-Modified");
return xml.status==304||_19e==_1.lastModified[url]||_1.browser.safari&&xml.status==undefined;
}
catch(e){
}
return false;
},httpData:function(r,type){
var ct=r.getResponseHeader("content-type");
var xml=type=="xml"||!type&&ct&&ct.indexOf("xml")>=0;
var data=xml?r.responseXML:r.responseText;
if(xml&&data.documentElement.tagName=="parsererror"){
throw "parsererror";
}
if(type=="script"){
_1.globalEval(data);
}
if(type=="json"){
data=eval("("+data+")");
}
return data;
},param:function(a){
var s=[];
if(a.constructor==Array||a.jquery){
_1.each(a,function(){
s.push(encodeURIComponent(this.name)+"="+encodeURIComponent(this.value));
});
}else{
for(var j in a){
if(a[j]&&a[j].constructor==Array){
_1.each(a[j],function(){
s.push(encodeURIComponent(j)+"="+encodeURIComponent(this));
});
}else{
s.push(encodeURIComponent(j)+"="+encodeURIComponent(a[j]));
}
}
}
return s.join("&").replace(/%20/g,"+");
}});
_1.fn.extend({show:function(_1a7,_1a8){
return _1a7?this.animate({height:"show",width:"show",opacity:"show"},_1a7,_1a8):this.filter(":hidden").each(function(){
this.style.display=this.oldblock?this.oldblock:"";
if(_1.css(this,"display")=="none"){
this.style.display="block";
}
}).end();
},hide:function(_1a9,_1aa){
return _1a9?this.animate({height:"hide",width:"hide",opacity:"hide"},_1a9,_1aa):this.filter(":visible").each(function(){
this.oldblock=this.oldblock||_1.css(this,"display");
if(this.oldblock=="none"){
this.oldblock="block";
}
this.style.display="none";
}).end();
},_toggle:_1.fn.toggle,toggle:function(fn,fn2){
return _1.isFunction(fn)&&_1.isFunction(fn2)?this._toggle(fn,fn2):fn?this.animate({height:"toggle",width:"toggle",opacity:"toggle"},fn,fn2):this.each(function(){
_1(this)[_1(this).is(":hidden")?"show":"hide"]();
});
},slideDown:function(_1ad,_1ae){
return this.animate({height:"show"},_1ad,_1ae);
},slideUp:function(_1af,_1b0){
return this.animate({height:"hide"},_1af,_1b0);
},slideToggle:function(_1b1,_1b2){
return this.animate({height:"toggle"},_1b1,_1b2);
},fadeIn:function(_1b3,_1b4){
return this.animate({opacity:"show"},_1b3,_1b4);
},fadeOut:function(_1b5,_1b6){
return this.animate({opacity:"hide"},_1b5,_1b6);
},fadeTo:function(_1b7,to,_1b9){
return this.animate({opacity:to},_1b7,_1b9);
},animate:function(prop,_1bb,_1bc,_1bd){
var opt=_1.speed(_1bb,_1bc,_1bd);
return this[opt.queue===false?"each":"queue"](function(){
opt=_1.extend({},opt);
var _1bf=_1(this).is(":hidden"),self=this;
for(var p in prop){
if(prop[p]=="hide"&&_1bf||prop[p]=="show"&&!_1bf){
return _1.isFunction(opt.complete)&&opt.complete.apply(this);
}
if(p=="height"||p=="width"){
opt.display=_1.css(this,"display");
opt.overflow=this.style.overflow;
}
}
if(opt.overflow!=null){
this.style.overflow="hidden";
}
opt.curAnim=_1.extend({},prop);
_1.each(prop,function(name,val){
var e=new _1.fx(self,opt,name);
if(/toggle|show|hide/.test(val)){
e[val=="toggle"?_1bf?"show":"hide":val](prop);
}else{
var _1c5=val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),_1c6=e.cur(true)||0;
if(_1c5){
var end=parseFloat(_1c5[2]),unit=_1c5[3]||"px";
if(unit!="px"){
self.style[name]=(end||1)+unit;
_1c6=((end||1)/e.cur(true))*_1c6;
self.style[name]=_1c6+unit;
}
if(_1c5[1]){
end=((_1c5[1]=="-="?-1:1)*end)+_1c6;
}
e.custom(_1c6,end,unit);
}else{
e.custom(_1c6,val,"");
}
}
});
return true;
});
},queue:function(type,fn){
if(_1.isFunction(type)){
fn=type;
type="fx";
}
if(!type||(typeof type=="string"&&!fn)){
return queue(this[0],type);
}
return this.each(function(){
if(fn.constructor==Array){
_1cb(this,type,fn);
}else{
_1cb(this,type).push(fn);
if(_1cb(this,type).length==1){
fn.apply(this);
}
}
});
},stop:function(){
var _1cc=_1.timers;
return this.each(function(){
for(var i=0;i<_1cc.length;i++){
if(_1cc[i].elem==this){
_1cc.splice(i--,1);
}
}
}).dequeue();
}});
var _1cb=function(elem,type,_1d0){
if(!elem){
return;
}
var q=_1.data(elem,type+"queue");
if(!q||_1d0){
q=_1.data(elem,type+"queue",_1d0?_1.makeArray(_1d0):[]);
}
return q;
};
_1.fn.dequeue=function(type){
type=type||"fx";
return this.each(function(){
var q=_1cb(this,type);
q.shift();
if(q.length){
q[0].apply(this);
}
});
};
_1.extend({speed:function(_1d4,_1d5,fn){
var opt=_1d4&&_1d4.constructor==Object?_1d4:{complete:fn||!fn&&_1d5||_1.isFunction(_1d4)&&_1d4,duration:_1d4,easing:fn&&_1d5||_1d5&&_1d5.constructor!=Function&&_1d5};
opt.duration=(opt.duration&&opt.duration.constructor==Number?opt.duration:{slow:600,fast:200}[opt.duration])||400;
opt.old=opt.complete;
opt.complete=function(){
_1(this).dequeue();
if(_1.isFunction(opt.old)){
opt.old.apply(this);
}
};
return opt;
},easing:{linear:function(p,n,_1da,diff){
return _1da+diff*p;
},swing:function(p,n,_1de,diff){
return ((-Math.cos(p*Math.PI)/2)+0.5)*diff+_1de;
}},timers:[],fx:function(elem,_1e1,prop){
this.options=_1e1;
this.elem=elem;
this.prop=prop;
if(!_1e1.orig){
_1e1.orig={};
}
}});
_1.fx.prototype={update:function(){
if(this.options.step){
this.options.step.apply(this.elem,[this.now,this]);
}
(_1.fx.step[this.prop]||_1.fx.step._default)(this);
if(this.prop=="height"||this.prop=="width"){
this.elem.style.display="block";
}
},cur:function(_1e3){
if(this.elem[this.prop]!=null&&this.elem.style[this.prop]==null){
return this.elem[this.prop];
}
var r=parseFloat(_1.curCSS(this.elem,this.prop,_1e3));
return r&&r>-10000?r:parseFloat(_1.css(this.elem,this.prop))||0;
},custom:function(from,to,unit){
this.startTime=(new Date()).getTime();
this.start=from;
this.end=to;
this.unit=unit||this.unit||"px";
this.now=this.start;
this.pos=this.state=0;
this.update();
var self=this;
function t(){
return self.step();
}
t.elem=this.elem;
_1.timers.push(t);
if(_1.timers.length==1){
var _1e9=setInterval(function(){
var _1ea=_1.timers;
for(var i=0;i<_1ea.length;i++){
if(!_1ea[i]()){
_1ea.splice(i--,1);
}
}
if(!_1ea.length){
clearInterval(_1e9);
}
},13);
}
},show:function(){
this.options.orig[this.prop]=_1.attr(this.elem.style,this.prop);
this.options.show=true;
this.custom(0,this.cur());
if(this.prop=="width"||this.prop=="height"){
this.elem.style[this.prop]="1px";
}
_1(this.elem).show();
},hide:function(){
this.options.orig[this.prop]=_1.attr(this.elem.style,this.prop);
this.options.hide=true;
this.custom(this.cur(),0);
},step:function(){
var t=(new Date()).getTime();
if(t>this.options.duration+this.startTime){
this.now=this.end;
this.pos=this.state=1;
this.update();
this.options.curAnim[this.prop]=true;
var done=true;
for(var i in this.options.curAnim){
if(this.options.curAnim[i]!==true){
done=false;
}
}
if(done){
if(this.options.display!=null){
this.elem.style.overflow=this.options.overflow;
this.elem.style.display=this.options.display;
if(_1.css(this.elem,"display")=="none"){
this.elem.style.display="block";
}
}
if(this.options.hide){
this.elem.style.display="none";
}
if(this.options.hide||this.options.show){
for(var p in this.options.curAnim){
_1.attr(this.elem.style,p,this.options.orig[p]);
}
}
}
if(done&&_1.isFunction(this.options.complete)){
this.options.complete.apply(this.elem);
}
return false;
}else{
var n=t-this.startTime;
this.state=n/this.options.duration;
this.pos=_1.easing[this.options.easing||(_1.easing.swing?"swing":"linear")](this.state,n,0,1,this.options.duration);
this.now=this.start+((this.end-this.start)*this.pos);
this.update();
}
return true;
}};
_1.fx.step={scrollLeft:function(fx){
fx.elem.scrollLeft=fx.now;
},scrollTop:function(fx){
fx.elem.scrollTop=fx.now;
},opacity:function(fx){
_1.attr(fx.elem.style,"opacity",fx.now);
},_default:function(fx){
fx.elem.style[fx.prop]=fx.now+fx.unit;
}};
_1.fn.offset=function(){
var left=0,top=0,elem=this[0],_1f8;
if(elem){
with(_1.browser){
var _1f9=_1.css(elem,"position")=="absolute",_1fa=elem.parentNode,_1fb=elem.offsetParent,doc=elem.ownerDocument,_1fd=safari&&parseInt(version)<522;
if(elem.getBoundingClientRect){
box=elem.getBoundingClientRect();
add(box.left+Math.max(doc.documentElement.scrollLeft,doc.body.scrollLeft),box.top+Math.max(doc.documentElement.scrollTop,doc.body.scrollTop));
if(msie){
var _1fe=_1("html").css("borderWidth");
_1fe=(_1fe=="medium"||_1.boxModel&&parseInt(version)>=7)&&2||_1fe;
add(-_1fe,-_1fe);
}
}else{
add(elem.offsetLeft,elem.offsetTop);
while(_1fb){
add(_1fb.offsetLeft,_1fb.offsetTop);
if(mozilla&&/^t[d|h]$/i.test(_1fa.tagName)||!_1fd){
_1fe(_1fb);
}
if(_1fd&&!_1f9&&_1.css(_1fb,"position")=="absolute"){
_1f9=true;
}
_1fb=_1fb.offsetParent;
}
while(_1fa.tagName&&!/^body|html$/i.test(_1fa.tagName)){
if(!/^inline|table-row.*$/i.test(_1.css(_1fa,"display"))){
add(-_1fa.scrollLeft,-_1fa.scrollTop);
}
if(mozilla&&_1.css(_1fa,"overflow")!="visible"){
_1fe(_1fa);
}
_1fa=_1fa.parentNode;
}
if(_1fd&&_1f9){
add(-doc.body.offsetLeft,-doc.body.offsetTop);
}
}
_1f8={top:top,left:left};
}
}
return _1f8;
function _1fe(elem){
add(_1.css(elem,"borderLeftWidth"),_1.css(elem,"borderTopWidth"));
}
function add(l,t){
left+=parseInt(l)||0;
top+=parseInt(t)||0;
}
};
})();

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
var _1=window.jQuery.noConflict(true);
eidogo.util={byId:function(id){
return _1("#"+id)[0];
},byClass:function(_3){
return _1("."+_3);
},ajax:function(_4,_5,_6,_7,_8,_9,_a){
_9=_9||window;
_1.ajax({type:_4.toUpperCase(),url:_5,data:_6,success:function(_b){
_7.call(_9,{responseText:_b});
},error:_8.bind(_9),timeout:_a});
},addEvent:function(el,_d,_e,_f,_10){
if(_10){
_e=_e.bind(_f);
}else{
if(_f){
var _11=_e;
_e=function(e){
_11(e,_f);
};
}
}
_1(el).bind(_d,{},_e);
},onReady:function(fn){
_1(fn);
},onClick:function(el,_15,_16){
eidogo.util.addEvent(el,"click",_15,_16,true);
},getElClickXY:function(e,el){
if(!e.pageX){
e.pageX=e.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft);
e.pageY=e.clientY+(document.documentElement.scrollTop||document.body.scrollTop);
}
if(!el._x){
var elX=eidogo.util.getElX(el);
var elY=eidogo.util.getElY(el);
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
_1(el).addClass(cls);
},removeClass:function(el,cls){
_1(el).removeClass(cls);
},show:function(el,_23){
_23=_23||"block";
if(typeof el=="string"){
el=eidogo.util.byId(el);
}
if(!el){
return;
}
el.style.display=_23;
},hide:function(el){
if(typeof el=="string"){
el=eidogo.util.byId(el);
}
if(!el){
return;
}
el.style.display="none";
},getStyle:function(el,_26){
return _1(el).css(_26);
},getElX:function(el){
return _1(el).offset().left;
},getElY:function(el){
return _1(el).offset().top;
},addStyleSheet:function(_29){
if(document.createStyleSheet){
document.createStyleSheet(_29);
}else{
var _2a=document.createElement("link");
_2a.rel="stylesheet";
_2a.type="text/css";
_2a.href=_29;
document.getElementsByTagName("head")[0].appendChild(_2a);
}
},getPlayerPath:function(){
var _2b=document.getElementsByTagName("script");
var _2c;
[].forEach.call(_2b,function(_2d){
if(/(all\.compressed\.js|eidogo\.js)/.test(_2d.src)){
_2c=_2d.src.replace(/\/js\/[^\/]+$/,"");
}
});
return _2c;
}};
})();

eidogo=window.eidogo||{};
eidogo.i18n=eidogo.i18n||{"move":"Move","loading":"Loading","passed":"passed","resigned":"resigned","variations":"Variations","no variations":"none","tool":"Tool","play":"Play","region":"Select Region","add_b":"Black Stone","add_w":"White Stone","edit comment":"Edit Comment","done":"Done","triangle":"Triangle","square":"Square","circle":"Circle","x":"X","letter":"Letter","number":"Number","dim":"Dim","search":"Search","search corner":"Corner Search","search center":"Center Search","region info":"Click and drag to select a region.","two stones":"Please select at least two stones to search for.","two edges":"For corner searches, your selection must touch two adjacent edges of the board.","no search url":"No search URL provided.","close search":"close search","matches found":"matches found.","white":"White","white rank":"White rank","white team":"White team","black":"Black","black rank":"Black rank","black team":"Black team","captures":"captures","time left":"time left","you":"You","game":"Game","handicap":"Handicap","komi":"Komi","result":"Result","date":"Date","info":"Info","place":"Place","event":"Event","round":"Round","overtime":"Overtime","opening":"Openning","ruleset":"Ruleset","annotator":"Annotator","copyright":"Copyright","source":"Source","time limit":"Time limit","transcriber":"Transcriber","created with":"Created with","january":"January","february":"February","march":"March","april":"April","may":"May","june":"June","july":"July","august":"August","september":"September","october":"October","november":"November","december":"December","gw":"Good for White","vgw":"Very good for White","gb":"Good for Black","vgb":"Very good for Black","dm":"Even position","dmj":"Even position (joseki)","uc":"Unclear position","te":"Tesuji","bm":"Bad move","vbm":"Very bad move","do":"Doubtful move","it":"Interesting move","black to play":"Black to play","white to play":"White to play","ho":"Hotspot","dom error":"Error finding DOM container","error retrieving":"There was a problem retrieving the game data.","invalid data":"Received invalid game data","error board":"Error loading board container","unsaved changes":"There are unsaved changes in this game. You must save before you can permalink or download.","bad path":"Don't know how to get to path: ","gnugo thinking":"GNU Go is thinking..."};

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
_2a[_2c.nodes.first().getMove()]=i;
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
this.node=this.node.parent.trees[_2e].nodes.first();
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
if(eidogo.util.getStyle(this.dom.searchContainer,"display")=="none"){
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
var sgf=new eidogo.SgfParser(_2b);
this.load(sgf.tree,_25);
}else{
if(_2c=="{"){
_2b=eval("("+_2b+")");
this.load(_2b,_25);
}else{
this.croak(t["invalid data"]);
}
}
if(typeof _28=="function"){
_28();
}
};
var _2f=function(req){
this.croak(t["error retrieving"]);
};
_3("get",url,null,_29,_2f,this,30000);
},fetchOpponentMove:function(){
this.nowLoading(t["gnugo thinking"]);
var _31=function(req){
this.doneLoading();
this.createMove(req.responseText);
};
var _33=function(req){
this.croak(t["error retrieving"]);
};
var _35={sgf:this.gameTree.trees[0].toSgf(),move:this.currentColor,size:this.gameTree.trees.first().nodes.first().SZ};
_3("post",this.opponentUrl,_35,_31,_33,this,45000);
},goTo:function(_36,_37){
_37=typeof _37!="undefined"?_37:true;
var _38;
var _39;
if(_36 instanceof Array){
if(!_36.length){
return;
}
if(_37){
this.resetCursor(true);
}
while(_36.length){
_38=_36[0];
if(isNaN(parseInt(_38,10))){
_39=this.getVariations(true);
if(!_39.length||_39[0].move==null){
this.variation(null,true);
if(this.progressiveLoads){
this.loadPath.push(_38);
return;
}
}
for(var i=0;i<_39.length;i++){
if(_39[i].move==_38){
this.variation(_39[i].treeNum,true);
break;
}
}
_36.shift();
}else{
_38=parseInt(_36.shift(),10);
if(_36.length==0){
for(var i=0;i<_38;i++){
this.variation(null,true);
}
}else{
if(_36.length){
this.variation(_38,true);
if(_36.length!=1){
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
if(!isNaN(parseInt(_36,10))){
var _3b=parseInt(_36,10);
if(_37){
this.resetCursor(true);
_3b++;
}
for(var i=0;i<_3b;i++){
this.variation(null,true);
}
this.refresh();
}else{
alert(t["bad path"]+" "+_36);
}
}
},resetCursor:function(_3c,_3d){
this.board.reset();
this.currentColor="B";
this.moveNumber=0;
if(_3d){
this.cursor.node=this.gameTree.trees.first().nodes.first();
}else{
this.cursor.node=this.gameTree.nodes.first();
}
this.refresh(_3c);
},refresh:function(_3e){
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
this.execNode(_3e);
},variation:function(_40,_41){
if(this.cursor.next(_40)){
this.execNode(_41);
this.resetLastLabels();
if(this.progressiveLoads){
return false;
}
return true;
}
return false;
},execNode:function(_42,_43){
if(!_43&&this.progressiveLoads){
var me=this;
setTimeout(function(){
me.execNode.call(me,_42);
},10);
return;
}
if(!_42){
this.dom.comments.innerHTML="";
this.board.clearMarkers();
}
if(this.moveNumber<1){
this.currentColor="B";
}
var _45=this.cursor.node.getProperties();
for(var _46 in _45){
if(this.propertyHandlers[_46]){
(this.propertyHandlers[_46]).apply(this,[this.cursor.node[_46],_46,_42]);
}
}
if(_42){
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
if(!_43&&this.progressiveUrl&&!this.cursor.node.parent.cached){
this.nowLoading();
this.progressiveLoads++;
this.remoteLoad(this.progressiveUrl+"?id="+this.cursor.node.parent.id,this.cursor.node.parent);
}
},findVariations:function(){
this.variations=this.getVariations(this.prefs.markNext);
},getVariations:function(_47){
var _48=[];
if(!this.cursor.node){
return _48;
}
if(_47&&this.cursor.node.nextSibling!=null){
_48.push({move:this.cursor.node.nextSibling.getMove(),treeNum:null});
}
if(this.cursor.node.nextSibling==null&&this.cursor.node.parent&&this.cursor.node.parent.trees.length){
var _49=this.cursor.node.parent.trees;
for(var i=0;i<_49.length;i++){
_48.push({move:_49[i].nodes.first().getMove(),treeNum:i});
}
}
return _48;
},back:function(e,obj,_4d){
if(this.cursor.previous()){
this.moveNumber--;
if(this.moveNumber<0){
this.moveNumber=0;
}
this.board.revert(1);
this.refresh(_4d);
this.resetLastLabels();
}
},forward:function(e,obj,_50){
this.variation(null,_50);
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
var _53=_6(e,this.board.renderer.domNode);
var m=this.board.renderer.margin;
var pw=this.board.renderer.pointWidth;
var ph=this.board.renderer.pointHeight;
var x=Math.round((_53[0]-m-(pw/2))/pw);
var y=Math.round((_53[1]-m-(ph/2))/ph);
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
var _65=this.pointToSgfCoord({x:x,y:y});
if(this.mode=="play"){
for(var i=0;i<this.variations.length;i++){
var _67=this.sgfCoordToPoint(this.variations[i].move);
if(_67.x==x&&_67.y==y){
this.variation(this.variations[i].treeNum);
_7(e);
return;
}
}
if(!this.rules.check({x:x,y:y},this.currentColor)){
return;
}
if(_65){
var _68=this.cursor.getNextMoves();
if(_68&&_65 in _68){
this.variation(_68[_65]);
}else{
this.createMove(_65);
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
var _69;
var _6a=this.board.getStone({x:x,y:y});
if(this.mode=="add_b"||this.mode=="add_w"){
this.cursor.node.emptyPoint(this.pointToSgfCoord({x:x,y:y}));
if(_6a!=this.board.BLACK&&this.mode=="add_b"){
_69="AB";
}else{
if(_6a!=this.board.WHITE&&this.mode=="add_w"){
_69="AW";
}else{
_69="AE";
}
}
}else{
switch(this.mode){
case "tr":
_69="TR";
break;
case "sq":
_69="SQ";
break;
case "cr":
_69="CR";
break;
case "x":
_69="MA";
break;
case "dim":
_69="DD";
break;
case "number":
_69="LB";
_65=_65+":"+this.labelLastNumber;
this.labelLastNumber++;
break;
case "letter":
_69="LB";
_65=_65+":"+this.labelLastLetter;
this.labelLastLetter=String.fromCharCode(this.labelLastLetter.charCodeAt(0)+1);
}
}
this.cursor.node.pushProperty(_69,_65);
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
},boundsCheck:function(x,y,_6e){
if(_6e.length==2){
_6e[3]=_6e[2]=_6e[1];
_6e[1]=_6e[0];
}
return (x>=_6e[0]&&y>=_6e[1]&&x<=_6e[2]&&y<=_6e[3]);
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
var _73=this.getRegionBounds();
this.dom.searchRegion.style.top=(this.board.renderer.margin+this.board.renderer.pointHeight*_73[0])+"px";
this.dom.searchRegion.style.left=(this.board.renderer.margin+this.board.renderer.pointWidth*_73[1])+"px";
this.dom.searchRegion.style.width=this.board.renderer.pointWidth*_73[2]+"px";
this.dom.searchRegion.style.height=this.board.renderer.pointHeight*_73[3]+"px";
_a(this.dom.searchRegion);
},loadSearch:function(q,dim,p,a){
var _78={nodes:[],trees:[{nodes:[{SZ:this.board.boardSize}],trees:[]}]};
this.load(_78);
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
var _83=this.dom.searchAlgo.value;
var _84=this.getRegionBounds();
var _85=this.board.getRegion(_84[0],_84[1],_84[2],_84[3]);
var _86=_85.join("").replace(new RegExp(this.board.EMPTY,"g"),".").replace(new RegExp(this.board.BLACK,"g"),"x").replace(new RegExp(this.board.WHITE,"g"),"o");
var _87=/^\.*$/.test(_86);
var _88=/^\.*O\.*$/.test(_86);
var _89=/^\.*X\.*$/.test(_86);
if(_87||_88||_89){
this.searching=false;
_a(this.dom.comments);
_b(this.dom.searchContainer);
this.prependComment(t["two stones"]);
return;
}
var _8a=[];
if(_84[0]==0){
_8a.push("n");
}
if(_84[1]==0){
_8a.push("w");
}
if(_84[0]+_84[3]==this.board.boardSize){
_8a.push("s");
}
if(_84[1]+_84[2]==this.board.boardSize){
_8a.push("e");
}
if(_83=="corner"&&!(_8a.length==2&&((_8a.contains("n")&&_8a.contains("e"))||(_8a.contains("n")&&_8a.contains("w"))||(_8a.contains("s")&&_8a.contains("e"))||(_8a.contains("s")&&_8a.contains("w"))))){
this.searching=false;
_a(this.dom.comments);
_b(this.dom.searchContainer);
this.prependComment(t["two edges"]);
return;
}
var _8b=(_8a.contains("n")?"n":"s");
_8b+=(_8a.contains("w")?"w":"e");
this.showComments("");
this.gameName="search";
var _8c=function(req){
this.searching=false;
this.doneLoading();
_b(this.dom.comments);
_a(this.dom.searchContainer);
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
var _8e=eval("("+req.responseText+")");
var _8f;
var _90="";
var odd;
for(var i=0;_8f=_8e[i];i++){
odd=odd?false:true;
_90+="<a class='search-result"+(odd?" odd":"")+"' href='#'>                    <span class='id'>"+_8f.id+"</span>                    <span class='mv'>"+_8f.mv+"</span>                    <span class='pw'>"+_8f.pw+" "+_8f.wr+"</span>                    <span class='pb'>"+_8f.pb+" "+_8f.br+"</span>                    <span class='re'>"+_8f.re+"</span>                    <span class='dt'>"+_8f.dt+"</span>                    <div class='clear'>&nbsp;</div>                    </a>";
}
_a(this.dom.searchResultsContainer);
this.dom.searchResults.innerHTML=_90;
this.dom.searchCount.innerHTML=_8e.length;
};
var _93=function(req){
this.croak(t["error retrieving"]);
};
var _95={q:_8b,w:_84[2],h:_84[3],p:_86,a:_83,t:(new Date()).getTime()};
this.progressiveLoad=false;
this.progressiveUrl=null;
this.prefs.markNext=false;
this.prefs.showPlayerInfo=true;
this.hook("searchRegion",_95);
this.nowLoading();
_3("get",this.searchUrl,_95,_8c,_93,this,45000);
},loadSearchResult:function(e){
this.nowLoading();
var _97=e.target||e.srcElement;
if(_97.nodeName=="SPAN"){
_97=_97.parentNode;
}
if(_97.nodeName=="A"){
var _98;
var id;
var mv;
for(var i=0;_98=_97.childNodes[i];i++){
if(_98.className=="id"){
id=_98.innerHTML;
}
if(_98.className=="mv"){
mv=parseInt(_98.innerHTML,10);
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
_b(this.dom.searchContainer);
_a(this.dom.comments);
},compressPattern:function(_9c){
var c=null;
var pc="";
var n=1;
var ret="";
for(var i=0;i<_9c.length;i++){
c=_9c.charAt(i);
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
},uncompressPattern:function(_a2){
var c=null;
var s=null;
var n="";
var ret="";
for(var i=0;i<_a2.length;i++){
c=_a2.charAt(i);
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
},createMove:function(_a9){
var _aa={};
_aa[this.currentColor]=_a9;
_aa["MN"]=(++this.moveNumber).toString();
var _ab=new eidogo.GameNode(_aa);
this.totalMoves++;
if(this.cursor.hasNext()){
if(this.cursor.node.nextSibling){
this.cursor.node.parent.createVariationTree(this.cursor.node.getPosition());
}
this.cursor.node.parent.appendTree(new eidogo.GameTree({nodes:[_ab],trees:[]}));
this.variation(this.cursor.node.parent.trees.length-1);
}else{
this.cursor.node.parent.appendNode(_ab);
this.variation();
}
this.unsavedChanges=true;
},handleKeypress:function(e){
if(this.editingComment){
return true;
}
var _ad=e.keyCode||e.charCode;
if(!_ad||e.ctrlKey||e.altKey||e.metaKey){
return true;
}
var _ae=String.fromCharCode(_ad).toLowerCase();
for(var i=0;i<this.variations.length;i++){
var _b0=this.sgfCoordToPoint(this.variations[i].move);
var _b1=""+(i+1);
if(_b0.x!=null&&this.board.getMarker(_b0)!=this.board.EMPTY&&typeof this.board.getMarker(_b0)=="string"){
_b1=this.board.getMarker(_b0).toLowerCase();
}
_b1=_b1.replace(/^var:/,"");
if(_ae==_b1.charAt(0)){
this.variation(this.variations[i].treeNum);
_7(e);
return;
}
}
if(_ad==112||_ad==27){
this.selectTool("play");
}
var _b2=true;
switch(_ad){
case 32:
if(e.shiftKey){
this.back();
}else{
this.forward();
}
break;
case 39:
if(e.shiftKey){
var _b3=this.totalMoves-this.moveNumber;
var _b4=(_b3>9?9:_b3-1);
for(var i=0;i<_b4;i++){
this.forward(null,null,true);
}
}
this.forward();
break;
case 37:
if(e.shiftKey){
var _b4=(this.moveNumber>9?9:this.moveNumber-1);
for(var i=0;i<_b4;i++){
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
_b2=false;
break;
}
if(_b2){
_7(e);
}
},showInfo:function(){
this.dom.infoGame.innerHTML="";
this.dom.whiteName.innerHTML="";
this.dom.blackName.innerHTML="";
var _b5=this.gameTree.trees.first().nodes.first();
var dl=document.createElement("dl");
for(var _b7 in this.infoLabels){
if(_b5[_b7]){
if(_b7=="PW"){
this.dom.whiteName.innerHTML=_b5[_b7]+(_b5["WR"]?", "+_b5["WR"]:"");
continue;
}else{
if(_b7=="PB"){
this.dom.blackName.innerHTML=_b5[_b7]+(_b5["BR"]?", "+_b5["BR"]:"");
continue;
}
}
if(_b7=="WR"||_b7=="BR"){
continue;
}
if(_b7=="DT"){
var _b8=_b5[_b7].split(/[\.-]/);
if(_b8.length==3){
_b5[_b7]=_b8[2].replace(/^0+/,"")+" "+this.months[_b8[1]-1]+" "+_b8[0];
}
}
var dt=document.createElement("dt");
dt.innerHTML=this.infoLabels[_b7]+":";
var dd=document.createElement("dd");
dd.innerHTML=_b5[_b7];
dl.appendChild(dt);
dl.appendChild(dd);
}
}
this.dom.infoGame.appendChild(dl);
},selectTool:function(_bb){
var _bc;
if(_bb=="region"){
_bc="crosshair";
}else{
if(_bb=="comment"){
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
_bc="default";
this.regionBegun=false;
_b(this.dom.searchRegion);
_b(this.dom.searchButton);
_b(this.dom.searchAlgo);
}
}
this.board.renderer.domNode.style.cursor=_bc;
this.mode=_bb;
this.dom.toolsSelect.value=_bb;
},finishEditComment:function(){
var _be=this.cursor.node.C;
var _bf=this.dom.commentsEditTa.value;
if(_be!=_bf){
this.unsavedChanges=true;
this.cursor.node.C=_bf;
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
var _c1=i+1;
if(!this.variations[i].move||this.variations[i].move=="tt"){
_8(this.dom.controlPass,"pass-on");
}else{
var _c2=this.sgfCoordToPoint(this.variations[i].move);
if(this.board.getMarker(_c2)!=this.board.EMPTY){
_c1=this.board.getMarker(_c2);
}
if(this.prefs.markVariations){
this.board.addMarker(_c2,"var:"+_c1);
}
}
var _c3=document.createElement("div");
_c3.className="variation-nav";
_c3.innerHTML=_c1;
_4(_c3,"click",function(e,arg){
arg.me.variation(arg.treeNum);
},{me:this,treeNum:this.variations[i].treeNum});
this.dom.variations.appendChild(_c3);
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
var _c6="";
if(!this.prefs.showPlayerInfo){
_c6+=this.getGameDescription(true);
}
if(!this.prefs.showGameInfo){
_c6+=this.dom.infoGame.innerHTML;
}
if(_c6.length){
this.prependComment(_c6,"comment-info");
}
}
if(!this.progressiveLoad){
this.updateNavSlider();
}
},setColor:function(_c7){
this.prependComment(_c7=="B"?t["black to play"]:t["white to play"]);
this.currentColor=_c7;
},setMoveNumber:function(num){
this.moveNumber=num;
},playMove:function(_c9,_ca,_cb){
_ca=_ca||this.currentColor;
this.currentColor=(_ca=="B"?"W":"B");
_ca=_ca=="W"?this.board.WHITE:this.board.BLACK;
var pt=this.sgfCoordToPoint(_c9);
if(!this.cursor.node["MN"]){
this.moveNumber++;
}
if((!_c9||_c9=="tt"||_c9=="")&&!_cb){
this.prependComment((_ca==this.board.WHITE?t["white"]:t["black"])+" "+t["passed"],"comment-pass");
}else{
if(_c9=="resign"){
this.prependComment((_ca==this.board.WHITE?t["white"]:t["black"])+" "+t["resigned"],"comment-resign");
}else{
this.board.addStone(pt,_ca);
this.rules.apply(pt,_ca);
if(this.prefs.markCurrent&&!_cb){
this.addMarker(_c9,"current");
}
}
}
},addStone:function(_cd,_ce){
if(!(_cd instanceof Array)){
_cd=[_cd];
}
_cd=this.expandCompressedPoints(_cd);
for(var i=0;i<_cd.length;i++){
this.board.addStone(this.sgfCoordToPoint(_cd[i]),_ce=="AW"?this.board.WHITE:_ce=="AB"?this.board.BLACK:this.board.EMPTY);
}
},addMarker:function(_d0,_d1){
if(!(_d0 instanceof Array)){
_d0=[_d0];
}
_d0=this.expandCompressedPoints(_d0);
var _d2;
for(var i=0;i<_d0.length;i++){
switch(_d1){
case "TR":
_d2="triangle";
break;
case "SQ":
_d2="square";
break;
case "CR":
_d2="circle";
break;
case "MA":
_d2="ex";
break;
case "TW":
_d2="territory-white";
break;
case "TB":
_d2="territory-black";
break;
case "DD":
_d2="dim";
break;
case "LB":
_d2=(_d0[i].split(":"))[1];
_d0[i];
break;
default:
_d2=_d1;
break;
}
this.board.addMarker(this.sgfCoordToPoint((_d0[i].split(":"))[0]),_d2);
}
},showTime:function(_d4,_d5){
var tp=(_d5=="BL"||_d5=="OB"?"timeB":"timeW");
if(_d5=="BL"||_d5=="WL"){
var _d7=Math.floor(_d4/60);
var _d8=(_d4%60).toFixed(0);
_d8=(_d8<10?"0":"")+_d8;
this[tp]=_d7+":"+_d8;
}else{
this[tp]+=" ("+_d4+")";
}
},showAnnotation:function(_d9,_da){
var msg;
switch(_da){
case "N":
msg=_d9;
break;
case "GB":
msg=(_d9>1?t["vgb"]:t["gb"]);
break;
case "GW":
msg=(_d9>1?t["vgw"]:t["gw"]);
break;
case "DM":
msg=(_d9>1?t["dmj"]:t["dm"]);
break;
case "UC":
msg=t["uc"];
break;
case "TE":
msg=t["te"];
break;
case "BM":
msg=(_d9>1?t["vbm"]:t["bm"]);
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
},showComments:function(_dc,_dd,_de){
if(!_dc||_de){
return;
}
this.dom.comments.innerHTML+=_dc.replace(/\n/g,"<br />");
},prependComment:function(_df,cls){
cls=cls||"comment-status";
this.dom.comments.innerHTML="<div class='"+cls+"'>"+_df+"</div>"+this.dom.comments.innerHTML;
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
var _e3=function(req){
this.hook("saved",[req.responseText]);
};
var _e5=function(req){
this.croak(t["error retrieving"]);
};
var sgf=this.gameTree.trees.first().toSgf();
_3("POST",this.saveUrl,{sgf:sgf},_e3,_e5,this,30000);
},constructDom:function(){
this.dom.player=document.createElement("div");
this.dom.player.className="eidogo-player"+(this.theme?" theme-"+this.theme:"");
this.dom.player.id="player-"+this.uniq;
this.dom.container.innerHTML="";
eidogo.util.show(this.dom.container);
this.dom.container.appendChild(this.dom.player);
var _e8="            <div id='board-container' class='board-container with-coords'></div>            <div id='controls-container' class='controls-container'>                <ul id='controls' class='controls'>                    <li id='control-first' class='control first'>First</li>                    <li id='control-back' class='control back'>Back</li>                    <li id='control-forward' class='control forward'>Forward</li>                    <li id='control-last' class='control last'>Last</li>                    <li id='control-pass' class='control pass'>Pass</li>                </ul>                <div id='move-number' class='move-number"+(this.permalinkable?" permalink":"")+"'></div>                <div id='nav-slider' class='nav-slider'>                    <div id='nav-slider-thumb' class='nav-slider-thumb'></div>                </div>                <div id='variations-container' class='variations-container'>                    <div id='variations-label' class='variations-label'>"+t["variations"]+":</div>                    <div id='variations' class='variations'></div>                </div>                <div class='controls-stop'></div>            </div>            <div id='tools-container' class='tools-container'"+(this.prefs.showTools?"":" style='display: none'")+">                <div id='tools-label' class='tools-label'>"+t["tool"]+":</div>                <select id='tools-select' class='tools-select'>                    <option value='play'>"+t["play"]+"</option>                    <option value='add_b'>"+t["add_b"]+"</option>                    <option value='add_w'>"+t["add_w"]+"</option>                    "+(this.searchUrl?("<option value='region'>"+t["region"]+"</option>"):"")+"                    <option value='comment'>"+t["edit comment"]+"</option>                    <option value='tr'>"+t["triangle"]+"</option>                    <option value='sq'>"+t["square"]+"</option>                    <option value='cr'>"+t["circle"]+"</option>                    <option value='x'>"+t["x"]+"</option>                    <option value='letter'>"+t["letter"]+"</option>                    <option value='number'>"+t["number"]+"</option>                    <option value='dim'>"+t["dim"]+"</option>                </select>                <select id='search-algo' class='search-algo'>                    <option value='corner'>"+t["search corner"]+"</option>                    <option value='center'>"+t["search center"]+"</option>                </select>                <input type='button' id='search-button' class='search-button' value='"+t["search"]+"'>            </div>            <div id='comments' class='comments'></div>            <div id='comments-edit' class='comments-edit'>                <textarea id='comments-edit-ta' class='comments-edit-ta'></textarea>                <div id='comments-edit-done' class='comments-edit-done'>"+t["done"]+"</div>            </div>            <div id='search-container' class='search-container'>                <div id='search-close' class='search-close'>"+t["close search"]+"</div>                <p class='search-count'><span id='search-count'></span>&nbsp;"+t["matches found"]+"</p>                <div id='search-results-container' class='search-results-container'>                    <div class='search-result'>                        <span class='pw'><b>"+t["white"]+"</b></span>                        <span class='pb'><b>"+t["black"]+"</b></span>                        <span class='re'><b>"+t["result"]+"</b></span>                        <span class='dt'><b>"+t["date"]+"</b></span>                        <div class='clear'></div>                    </div>                    <div id='search-results' class='search-results'></div>                </div>            </div>            <div id='info' class='info'>                <div id='info-players' class='players'>                    <div id='white' class='player white'>                        <div id='white-name' class='name'></div>                        <div id='white-captures' class='captures'></div>                        <div id='white-time' class='time'></div>                    </div>                    <div id='black' class='player black'>                        <div id='black-name' class='name'></div>                        <div id='black-captures' class='captures'></div>                        <div id='black-time' class='time'></div>                    </div>                </div>                <div id='info-game' class='game'></div>            </div>            <div id='options' class='options'>                "+(this.saveUrl?"<a id='option-save' class='option-save' href='#' title='Save this game'>Save</a>":"")+"                "+(this.downloadUrl||_e?"<a id='option-download' class='option-download' href='#' title='Download this game as SGF'>Download SGF</a>":"")+"                <div class='options-stop'></div>            </div>            <div id='preferences' class='preferences'>                <div><input type='checkbox'> Show variations on board</div>                <div><input type='checkbox'> Mark current move</div>            </div>            <div id='footer' class='footer'></div>            <div id='shade' class='shade'></div>        ";
_e8=_e8.replace(/ id='([^']+)'/g," id='$1-"+this.uniq+"'");
this.dom.player.innerHTML=_e8;
var re=/ id='([^']+)-\d+'/g;
var _ea;
var id;
var _ec;
while(_ea=re.exec(_e8)){
id=_ea[0].replace(/'/g,"").replace(/ id=/,"");
_ec="";
_ea[1].split("-").forEach(function(_ed,i){
_ed=i?_ed.charAt(0).toUpperCase()+_ed.substring(1):_ed;
_ec+=_ed;
});
this.dom[_ec]=_2(id);
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
var _f1=false;
var _f2=null;
_4(this.dom.navSlider,"mousedown",function(e){
_f1=true;
_7(e);
},this,true);
_4(document,"mousemove",function(e){
if(!_f1){
return;
}
var xy=_6(e,this.dom.navSlider);
clearTimeout(_f2);
_f2=setTimeout(function(){
this.updateNavSlider(xy[0]);
}.bind(this),10);
_7(e);
},this,true);
_4(document,"mouseup",function(e){
if(!_f1){
return true;
}
_f1=false;
var xy=_6(e,this.dom.navSlider);
this.updateNavSlider(xy[0]);
return true;
},this,true);
},updateNavSlider:function(_f8){
var _f9=this.dom.navSlider._width-this.dom.navSliderThumb._width;
var _fa=this.totalMoves;
var _fb=!!_f8;
_f8=_f8||(this.moveNumber/_fa*_f9);
_f8=_f8>_f9?_f9:_f8;
_f8=_f8<0?0:_f8;
var _fc=parseInt(_f8/_f9*_fa,10);
if(_fb){
this.nowLoading();
var _fd=_fc-this.cursor.node.getPosition();
for(var i=0;i<Math.abs(_fd);i++){
if(_fd>0){
this.variation(null,true);
}else{
if(_fd<0){
this.cursor.previous();
this.moveNumber--;
}
}
}
if(_fd<0){
if(this.moveNumber<0){
this.moveNumber=0;
}
this.board.revert(Math.abs(_fd));
}
this.doneLoading();
this.refresh();
}
_f8=parseInt(_fc/_fa*_f9,10)||0;
this.dom.navSliderThumb.style.left=_f8+"px";
},resetLastLabels:function(){
this.labelLastNumber=1;
this.labelLastLetter="A";
},getGameDescription:function(_ff){
var root=this.gameTree.trees.first().nodes.first();
var desc=(_ff?"":root.GN||this.gameName);
if(root.PW&&root.PB){
var wr=root.WR?" "+root.WR:"";
var br=root.BR?" "+root.BR:"";
desc+=(desc.length?" - ":"")+root.PW+wr+" vs "+root.PB+br;
}
return desc;
},sgfCoordToPoint:function(_104){
if(!_104||_104=="tt"){
return {x:null,y:null};
}
var _105={a:0,b:1,c:2,d:3,e:4,f:5,g:6,h:7,i:8,j:9,k:10,l:11,m:12,n:13,o:14,p:15,q:16,r:17,s:18};
return {x:_105[_104.charAt(0)],y:_105[_104.charAt(1)]};
},pointToSgfCoord:function(pt){
if(!pt||!this.boundsCheck(pt.x,pt.y,[0,this.board.boardSize-1])){
return null;
}
var pts={0:"a",1:"b",2:"c",3:"d",4:"e",5:"f",6:"g",7:"h",8:"i",9:"j",10:"k",11:"l",12:"m",13:"n",14:"o",15:"p",16:"q",17:"r",18:"s"};
return pts[pt.x]+pts[pt.y];
},expandCompressedPoints:function(_108){
var _109;
var ul,lr;
var x,y;
var _10e=[];
var hits=[];
for(var i=0;i<_108.length;i++){
_109=_108[i].split(/:/);
if(_109.length>1){
ul=this.sgfCoordToPoint(_109[0]);
lr=this.sgfCoordToPoint(_109[1]);
for(x=ul.x;x<=lr.x;x++){
for(y=ul.y;y<=lr.y;y++){
_10e.push(this.pointToSgfCoord({x:x,y:y}));
}
}
hits.push(i);
}
}
_108=_108.concat(_10e);
return _108;
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
var _7=eidogo.util.byClass("eidogo-player-auto");
[].forEach.call(_7,function(el){
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
});
});
})();

