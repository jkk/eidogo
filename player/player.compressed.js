if(typeof window.jQuery=="undefined"){
window.undefined=window.undefined;
var jQuery=function(a,c){
if(window==this||!this.init){
return new jQuery(a,c);
}
return this.init(a,c);
};
if(typeof $!="undefined"){
jQuery._$=$;
}
var $=jQuery;
jQuery.fn=jQuery.prototype={init:function(a,c){
a=a||document;
if(jQuery.isFunction(a)){
return new jQuery(document)[jQuery.fn.ready?"ready":"load"](a);
}
if(typeof a=="string"){
var m=/^[^<]*(<(.|\s)+>)[^>]*$/.exec(a);
if(m){
a=jQuery.clean([m[1]]);
}else{
return new jQuery(c).find(a);
}
}
return this.setArray(a.constructor==Array&&a||(a.jquery||a.length&&a!=window&&!a.nodeType&&a[0]!=undefined&&a[0].nodeType)&&jQuery.makeArray(a)||[a]);
},jquery:"1.1.3.1",size:function(){
return this.length;
},length:0,get:function(_6){
return _6==undefined?jQuery.makeArray(this):this[_6];
},pushStack:function(a){
var _8=jQuery(a);
_8.prevObject=this;
return _8;
},setArray:function(a){
this.length=0;
[].push.apply(this,a);
return this;
},each:function(fn,_b){
return jQuery.each(this,fn,_b);
},index:function(_c){
var _d=-1;
this.each(function(i){
if(this==_c){
_d=i;
}
});
return _d;
},attr:function(_f,_10,_11){
var obj=_f;
if(_f.constructor==String){
if(_10==undefined){
return this.length&&jQuery[_11||"attr"](this[0],_f)||undefined;
}else{
obj={};
obj[_f]=_10;
}
}
return this.each(function(_13){
for(var _14 in obj){
jQuery.attr(_11?this.style:this,_14,jQuery.prop(this,obj[_14],_11,_13,_14));
}
});
},css:function(key,_16){
return this.attr(key,_16,"curCSS");
},text:function(e){
if(typeof e=="string"){
return this.empty().append(document.createTextNode(e));
}
var t="";
jQuery.each(e||this,function(){
jQuery.each(this.childNodes,function(){
if(this.nodeType!=8){
t+=this.nodeType!=1?this.nodeValue:jQuery.fn.text([this]);
}
});
});
return t;
},wrap:function(){
var a,_1a=arguments;
return this.each(function(){
if(!a){
a=jQuery.clean(_1a,this.ownerDocument);
}
var b=a[0].cloneNode(true);
this.parentNode.insertBefore(b,this);
while(b.firstChild){
b=b.firstChild;
}
b.appendChild(this);
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
return this.prevObject||jQuery([]);
},find:function(t){
var _21=jQuery.map(this,function(a){
return jQuery.find(t,a);
});
return this.pushStack(/[^+>] [^+>]/.test(t)||t.indexOf("..")>-1?jQuery.unique(_21):_21);
},clone:function(_23){
var _24=this.add(this.find("*"));
_24.each(function(){
this._$events={};
for(var _25 in this.$events){
this._$events[_25]=jQuery.extend({},this.$events[_25]);
}
}).unbind();
var r=this.pushStack(jQuery.map(this,function(a){
return a.cloneNode(_23!=undefined?_23:true);
}));
_24.each(function(){
var _28=this._$events;
for(var _29 in _28){
for(var _2a in _28[_29]){
jQuery.event.add(this,_29,_28[_29][_2a],_28[_29][_2a].data);
}
}
this._$events=null;
});
return r;
},filter:function(t){
return this.pushStack(jQuery.isFunction(t)&&jQuery.grep(this,function(el,_2d){
return t.apply(el,[_2d]);
})||jQuery.multiFilter(t,this));
},not:function(t){
return this.pushStack(t.constructor==String&&jQuery.multiFilter(t,this,true)||jQuery.grep(this,function(a){
return (t.constructor==Array||t.jquery)?jQuery.inArray(a,t)<0:a!=t;
}));
},add:function(t){
return this.pushStack(jQuery.merge(this.get(),t.constructor==String?jQuery(t).get():t.length!=undefined&&(!t.nodeName||t.nodeName=="FORM")?t:[t]));
},is:function(_31){
return _31?jQuery.multiFilter(_31,this).length>0:false;
},val:function(val){
return val==undefined?(this.length?this[0].value:null):this.attr("value",val);
},html:function(val){
return val==undefined?(this.length?this[0].innerHTML:null):this.empty().append(val);
},domManip:function(_34,_35,dir,fn){
var _38=this.length>1,a;
return this.each(function(){
if(!a){
a=jQuery.clean(_34,this.ownerDocument);
if(dir<0){
a.reverse();
}
}
var obj=this;
if(_35&&jQuery.nodeName(this,"table")&&jQuery.nodeName(a[0],"tr")){
obj=this.getElementsByTagName("tbody")[0]||this.appendChild(document.createElement("tbody"));
}
jQuery.each(a,function(){
fn.apply(obj,[_38?this.cloneNode(true):this]);
});
});
}};
jQuery.extend=jQuery.fn.extend=function(){
var _3b=arguments[0],a=1;
if(arguments.length==1){
_3b=this;
a=0;
}
var _3d;
while((_3d=arguments[a++])!=null){
for(var i in _3d){
_3b[i]=_3d[i];
}
}
return _3b;
};
jQuery.extend({noConflict:function(){
if(jQuery._$){
$=jQuery._$;
}
return jQuery;
},isFunction:function(fn){
return !!fn&&typeof fn!="string"&&!fn.nodeName&&fn.constructor!=Array&&/function/i.test(fn+"");
},isXMLDoc:function(_40){
return _40.tagName&&_40.ownerDocument&&!_40.ownerDocument.body;
},nodeName:function(_41,_42){
return _41.nodeName&&_41.nodeName.toUpperCase()==_42.toUpperCase();
},each:function(obj,fn,_45){
if(obj.length==undefined){
for(var i in obj){
fn.apply(obj[i],_45||[i,obj[i]]);
}
}else{
for(var i=0,ol=obj.length;i<ol;i++){
if(fn.apply(obj[i],_45||[i,obj[i]])===false){
break;
}
}
}
return obj;
},prop:function(_48,_49,_4a,_4b,_4c){
if(jQuery.isFunction(_49)){
_49=_49.call(_48,[_4b]);
}
var _4d=/z-?index|font-?weight|opacity|zoom|line-?height/i;
return _49&&_49.constructor==Number&&_4a=="curCSS"&&!_4d.test(_4c)?_49+"px":_49;
},className:{add:function(_4e,c){
jQuery.each(c.split(/\s+/),function(i,cur){
if(!jQuery.className.has(_4e.className,cur)){
_4e.className+=(_4e.className?" ":"")+cur;
}
});
},remove:function(_52,c){
_52.className=c!=undefined?jQuery.grep(_52.className.split(/\s+/),function(cur){
return !jQuery.className.has(c,cur);
}).join(" "):"";
},has:function(t,c){
return jQuery.inArray(c,(t.className||t).toString().split(/\s+/))>-1;
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
var old={},_5e,_5f,d=["Top","Bottom","Right","Left"];
jQuery.each(d,function(){
old["padding"+this]=0;
old["border"+this+"Width"]=0;
});
jQuery.swap(e,old,function(){
if(jQuery(e).is(":visible")){
_5e=e.offsetHeight;
_5f=e.offsetWidth;
}else{
e=jQuery(e.cloneNode(true)).find(":radio").removeAttr("checked").end().css({visibility:"hidden",position:"absolute",display:"block",right:"0",left:"0"}).appendTo(e.parentNode)[0];
var _61=jQuery.css(e.parentNode,"position")||"static";
if(_61=="static"){
e.parentNode.style.position="relative";
}
_5e=e.clientHeight;
_5f=e.clientWidth;
if(_61=="static"){
e.parentNode.style.position="static";
}
e.parentNode.removeChild(e);
}
});
return p=="height"?_5e:_5f;
}
return jQuery.curCSS(e,p);
},curCSS:function(_62,_63,_64){
var ret;
if(_63=="opacity"&&jQuery.browser.msie){
ret=jQuery.attr(_62.style,"opacity");
return ret==""?"1":ret;
}
if(_63.match(/float/i)){
_63=jQuery.styleFloat;
}
if(!_64&&_62.style[_63]){
ret=_62.style[_63];
}else{
if(document.defaultView&&document.defaultView.getComputedStyle){
if(_63.match(/float/i)){
_63="float";
}
_63=_63.replace(/([A-Z])/g,"-$1").toLowerCase();
var cur=document.defaultView.getComputedStyle(_62,null);
if(cur){
ret=cur.getPropertyValue(_63);
}else{
if(_63=="display"){
ret="none";
}else{
jQuery.swap(_62,{display:"block"},function(){
var c=document.defaultView.getComputedStyle(this,"");
ret=c&&c.getPropertyValue(_63)||"";
});
}
}
}else{
if(_62.currentStyle){
var _68=_63.replace(/\-(\w)/g,function(m,c){
return c.toUpperCase();
});
ret=_62.currentStyle[_63]||_62.currentStyle[_68];
}
}
}
return ret;
},clean:function(a,doc){
var r=[];
doc=doc||document;
jQuery.each(a,function(i,arg){
if(!arg){
return;
}
if(arg.constructor==Number){
arg=arg.toString();
}
if(typeof arg=="string"){
var s=jQuery.trim(arg).toLowerCase(),div=doc.createElement("div"),tb=[];
var _73=!s.indexOf("<opt")&&[1,"<select>","</select>"]||!s.indexOf("<leg")&&[1,"<fieldset>","</fieldset>"]||(!s.indexOf("<thead")||!s.indexOf("<tbody")||!s.indexOf("<tfoot")||!s.indexOf("<colg"))&&[1,"<table>","</table>"]||!s.indexOf("<tr")&&[2,"<table><tbody>","</tbody></table>"]||(!s.indexOf("<td")||!s.indexOf("<th"))&&[3,"<table><tbody><tr>","</tr></tbody></table>"]||!s.indexOf("<col")&&[2,"<table><colgroup>","</colgroup></table>"]||[0,"",""];
div.innerHTML=_73[1]+arg+_73[2];
while(_73[0]--){
div=div.firstChild;
}
if(jQuery.browser.msie){
if(!s.indexOf("<table")&&s.indexOf("<tbody")<0){
tb=div.firstChild&&div.firstChild.childNodes;
}else{
if(_73[1]=="<table>"&&s.indexOf("<tbody")<0){
tb=div.childNodes;
}
}
for(var n=tb.length-1;n>=0;--n){
if(jQuery.nodeName(tb[n],"tbody")&&!tb[n].childNodes.length){
tb[n].parentNode.removeChild(tb[n]);
}
}
}
arg=jQuery.makeArray(div.childNodes);
}
if(0===arg.length&&(!jQuery.nodeName(arg,"form")&&!jQuery.nodeName(arg,"select"))){
return;
}
if(arg[0]==undefined||jQuery.nodeName(arg,"form")||arg.options){
r.push(arg);
}else{
r=jQuery.merge(r,arg);
}
});
return r;
},attr:function(_75,_76,_77){
var fix=jQuery.isXMLDoc(_75)?{}:jQuery.props;
if(fix[_76]){
if(_77!=undefined){
_75[fix[_76]]=_77;
}
return _75[fix[_76]];
}else{
if(_77==undefined&&jQuery.browser.msie&&jQuery.nodeName(_75,"form")&&(_76=="action"||_76=="method")){
return _75.getAttributeNode(_76).nodeValue;
}else{
if(_75.tagName){
if(_77!=undefined){
_75.setAttribute(_76,_77);
}
if(jQuery.browser.msie&&/href|src/.test(_76)&&!jQuery.isXMLDoc(_75)){
return _75.getAttribute(_76,2);
}
return _75.getAttribute(_76);
}else{
if(_76=="opacity"&&jQuery.browser.msie){
if(_77!=undefined){
_75.zoom=1;
_75.filter=(_75.filter||"").replace(/alpha\([^)]*\)/,"")+(parseFloat(_77).toString()=="NaN"?"":"alpha(opacity="+_77*100+")");
}
return _75.filter?(parseFloat(_75.filter.match(/opacity=([^)]*)/)[1])/100).toString():"";
}
_76=_76.replace(/-([a-z])/ig,function(z,b){
return b.toUpperCase();
});
if(_77!=undefined){
_75[_76]=_77;
}
return _75[_76];
}
}
}
},trim:function(t){
return t.replace(/^\s+|\s+$/g,"");
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
},merge:function(_84,_85){
for(var i=0;_85[i];i++){
_84.push(_85[i]);
}
return _84;
},unique:function(_87){
var r=[],num=jQuery.mergeNum++;
for(var i=0,fl=_87.length;i<fl;i++){
if(num!=_87[i].mergeNum){
_87[i].mergeNum=num;
r.push(_87[i]);
}
}
return r;
},mergeNum:0,grep:function(_8c,fn,inv){
if(typeof fn=="string"){
fn=new Function("a","i","return "+fn);
}
var _8f=[];
for(var i=0,el=_8c.length;i<el;i++){
if(!inv&&fn(_8c[i],i)||inv&&!fn(_8c[i],i)){
_8f.push(_8c[i]);
}
}
return _8f;
},map:function(_92,fn){
if(typeof fn=="string"){
fn=new Function("a","return "+fn);
}
var _94=[];
for(var i=0,el=_92.length;i<el;i++){
var val=fn(_92[i],i);
if(val!==null&&val!=undefined){
if(val.constructor!=Array){
val=[val];
}
_94=_94.concat(val);
}
}
return _94;
}});
new function(){
var b=navigator.userAgent.toLowerCase();
jQuery.browser={version:(b.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[])[1],safari:/webkit/.test(b),opera:/opera/.test(b),msie:/msie/.test(b)&&!/opera/.test(b),mozilla:/mozilla/.test(b)&&!/(compatible|webkit)/.test(b)};
jQuery.boxModel=!jQuery.browser.msie||document.compatMode=="CSS1Compat";
jQuery.styleFloat=jQuery.browser.msie?"styleFloat":"cssFloat",jQuery.props={"for":"htmlFor","class":"className","float":jQuery.styleFloat,cssFloat:jQuery.styleFloat,styleFloat:jQuery.styleFloat,innerHTML:"innerHTML",className:"className",value:"value",disabled:"disabled",checked:"checked",readonly:"readOnly",selected:"selected",maxlength:"maxLength"};
};
jQuery.each({parent:"a.parentNode",parents:"jQuery.parents(a)",next:"jQuery.nth(a,2,'nextSibling')",prev:"jQuery.nth(a,2,'previousSibling')",siblings:"jQuery.sibling(a.parentNode.firstChild,a)",children:"jQuery.sibling(a.firstChild)"},function(i,n){
jQuery.fn[i]=function(a){
var ret=jQuery.map(this,n);
if(a&&typeof a=="string"){
ret=jQuery.multiFilter(a,ret);
}
return this.pushStack(ret);
};
});
jQuery.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after"},function(i,n){
jQuery.fn[i]=function(){
var a=arguments;
return this.each(function(){
for(var j=0,al=a.length;j<al;j++){
jQuery(a[j])[n](this);
}
});
};
});
jQuery.each({removeAttr:function(key){
jQuery.attr(this,key,"");
this.removeAttribute(key);
},addClass:function(c){
jQuery.className.add(this,c);
},removeClass:function(c){
jQuery.className.remove(this,c);
},toggleClass:function(c){
jQuery.className[jQuery.className.has(this,c)?"remove":"add"](this,c);
},remove:function(a){
if(!a||jQuery.filter(a,[this]).r.length){
this.parentNode.removeChild(this);
}
},empty:function(){
while(this.firstChild){
this.removeChild(this.firstChild);
}
}},function(i,n){
jQuery.fn[i]=function(){
return this.each(n,arguments);
};
});
jQuery.each(["eq","lt","gt","contains"],function(i,n){
jQuery.fn[n]=function(num,fn){
return this.filter(":"+n+"("+num+")",fn);
};
});
jQuery.each(["height","width"],function(i,n){
jQuery.fn[n]=function(h){
return h==undefined?(this.length?jQuery.css(this[0],n):null):this.css(n,h.constructor==String?h:h+"px");
};
});
jQuery.extend({expr:{"":"m[2]=='*'||jQuery.nodeName(a,m[2])","#":"a.getAttribute('id')==m[2]",":":{lt:"i<m[3]-0",gt:"i>m[3]-0",nth:"m[3]-0==i",eq:"m[3]-0==i",first:"i==0",last:"i==r.length-1",even:"i%2==0",odd:"i%2","first-child":"a.parentNode.getElementsByTagName('*')[0]==a","last-child":"jQuery.nth(a.parentNode.lastChild,1,'previousSibling')==a","only-child":"!jQuery.nth(a.parentNode.lastChild,2,'previousSibling')",parent:"a.firstChild",empty:"!a.firstChild",contains:"(a.textContent||a.innerText||'').indexOf(m[3])>=0",visible:"\"hidden\"!=a.type&&jQuery.css(a,\"display\")!=\"none\"&&jQuery.css(a,\"visibility\")!=\"hidden\"",hidden:"\"hidden\"==a.type||jQuery.css(a,\"display\")==\"none\"||jQuery.css(a,\"visibility\")==\"hidden\"",enabled:"!a.disabled",disabled:"a.disabled",checked:"a.checked",selected:"a.selected||jQuery.attr(a,'selected')",text:"'text'==a.type",radio:"'radio'==a.type",checkbox:"'checkbox'==a.type",file:"'file'==a.type",password:"'password'==a.type",submit:"'submit'==a.type",image:"'image'==a.type",reset:"'reset'==a.type",button:"\"button\"==a.type||jQuery.nodeName(a,\"button\")",input:"/input|select|textarea|button/i.test(a.nodeName)"},"[":"jQuery.find(m[2],a).length"},parse:[/^\[ *(@)([\w-]+) *([!*$^~=]*) *('?"?)(.*?)\4 *\]/,/^(\[)\s*(.*?(\[.*?\])?[^[]*?)\s*\]/,/^(:)([\w-]+)\("?'?(.*?(\(.*?\))?[^(]*?)"?'?\)/,new RegExp("^([:.#]*)("+(jQuery.chars=jQuery.browser.safari&&jQuery.browser.version<"3.0.0"?"\\w":"(?:[\\w\u0128-\uffff*_-]|\\\\.)")+"+)")],multiFilter:function(_b0,_b1,not){
var old,cur=[];
while(_b0&&_b0!=old){
old=_b0;
var f=jQuery.filter(_b0,_b1,not);
_b0=f.t.replace(/^\s*,\s*/,"");
cur=not?_b1=f.r:jQuery.merge(cur,f.r);
}
return cur;
},find:function(t,_b7){
if(typeof t!="string"){
return [t];
}
if(_b7&&!_b7.nodeType){
_b7=null;
}
_b7=_b7||document;
if(!t.indexOf("//")){
_b7=_b7.documentElement;
t=t.substr(2,t.length);
}else{
if(!t.indexOf("/")&&!_b7.ownerDocument){
_b7=_b7.documentElement;
t=t.substr(1,t.length);
if(t.indexOf("/")>=1){
t=t.substr(t.indexOf("/"),t.length);
}
}
}
var ret=[_b7],_b9=[],_ba;
while(t&&_ba!=t){
var r=[];
_ba=t;
t=jQuery.trim(t).replace(/^\/\//,"");
var _bc=false;
var re=new RegExp("^[/>]\\s*("+jQuery.chars+"+)");
var m=re.exec(t);
if(m){
var _bf=m[1].toUpperCase();
for(var i=0;ret[i];i++){
for(var c=ret[i].firstChild;c;c=c.nextSibling){
if(c.nodeType==1&&(_bf=="*"||c.nodeName.toUpperCase()==_bf.toUpperCase())){
r.push(c);
}
}
}
ret=r;
t=t.replace(re,"");
if(t.indexOf(" ")==0){
continue;
}
_bc=true;
}else{
re=/^((\/?\.\.)|([>\/+~]))\s*([a-z]*)/i;
if((m=re.exec(t))!=null){
r=[];
var _bf=m[4],_c2=jQuery.mergeNum++;
m=m[1];
for(var j=0,rl=ret.length;j<rl;j++){
if(m.indexOf("..")<0){
var n=m=="~"||m=="+"?ret[j].nextSibling:ret[j].firstChild;
for(;n;n=n.nextSibling){
if(n.nodeType==1){
if(m=="~"&&n.mergeNum==_c2){
break;
}
if(!_bf||n.nodeName.toUpperCase()==_bf.toUpperCase()){
if(m=="~"){
n.mergeNum=_c2;
}
r.push(n);
}
if(m=="+"){
break;
}
}
}
}else{
r.push(ret[j].parentNode);
}
}
ret=r;
t=jQuery.trim(t.replace(re,""));
_bc=true;
}
}
if(t&&!_bc){
if(!t.indexOf(",")){
if(_b7==ret[0]){
ret.shift();
}
_b9=jQuery.merge(_b9,ret);
r=ret=[_b7];
t=" "+t.substr(1,t.length);
}else{
var re2=new RegExp("^("+jQuery.chars+"+)(#)("+jQuery.chars+"+)");
var m=re2.exec(t);
if(m){
m=[0,m[2],m[3],m[1]];
}else{
re2=new RegExp("^([#.]?)("+jQuery.chars+"*)");
m=re2.exec(t);
}
m[2]=m[2].replace(/\\/g,"");
var _c7=ret[ret.length-1];
if(m[1]=="#"&&_c7&&_c7.getElementById){
var oid=_c7.getElementById(m[2]);
if((jQuery.browser.msie||jQuery.browser.opera)&&oid&&typeof oid.id=="string"&&oid.id!=m[2]){
oid=jQuery("[@id=\""+m[2]+"\"]",_c7)[0];
}
ret=r=oid&&(!m[3]||jQuery.nodeName(oid,m[3]))?[oid]:[];
}else{
for(var i=0;ret[i];i++){
var tag=m[1]!=""||m[0]==""?"*":m[2];
if(tag=="*"&&ret[i].nodeName.toLowerCase()=="object"){
tag="param";
}
r=jQuery.merge(r,ret[i].getElementsByTagName(tag));
}
if(m[1]=="."){
r=jQuery.classFilter(r,m[2]);
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
var val=jQuery.filter(t,r);
ret=r=val.r;
t=jQuery.trim(val.t);
}
}
if(t){
ret=[];
}
if(ret&&_b7==ret[0]){
ret.shift();
}
_b9=jQuery.merge(_b9,ret);
return _b9;
},classFilter:function(r,m,not){
m=" "+m+" ";
var tmp=[];
for(var i=0;r[i];i++){
var _d1=(" "+r[i].className+" ").indexOf(m)>=0;
if(!not&&_d1||not&&!_d1){
tmp.push(r[i]);
}
}
return tmp;
},filter:function(t,r,not){
var _d5;
while(t&&t!=_d5){
_d5=t;
var p=jQuery.parse,m;
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
r=jQuery.filter(m[3],r,true).r;
}else{
if(m[1]=="."){
r=jQuery.classFilter(r,m[2],not);
}else{
if(m[1]=="@"){
var tmp=[],_da=m[3];
for(var i=0,rl=r.length;i<rl;i++){
var a=r[i],z=a[jQuery.props[m[2]]||m[2]];
if(z==null||/href|src/.test(m[2])){
z=jQuery.attr(a,m[2])||"";
}
if((_da==""&&!!z||_da=="="&&z==m[5]||_da=="!="&&z!=m[5]||_da=="^="&&z&&!z.indexOf(m[5])||_da=="$="&&z.substr(z.length-m[5].length)==m[5]||(_da=="*="||_da=="~=")&&z.indexOf(m[5])>=0)^not){
tmp.push(a);
}
}
r=tmp;
}else{
if(m[1]==":"&&m[2]=="nth-child"){
var num=jQuery.mergeNum++,tmp=[],_df=/(\d*)n\+?(\d*)/.exec(m[3]=="even"&&"2n"||m[3]=="odd"&&"2n+1"||!/\D/.test(m[3])&&"n+"+m[3]||m[3]),_e0=(_df[1]||1)-0,_d5=_df[2]-0;
for(var i=0,rl=r.length;i<rl;i++){
var _e1=r[i],_e2=_e1.parentNode;
if(num!=_e2.mergeNum){
var c=1;
for(var n=_e2.firstChild;n;n=n.nextSibling){
if(n.nodeType==1){
n.nodeIndex=c++;
}
}
_e2.mergeNum=num;
}
var add=false;
if(_e0==1){
if(_d5==0||_e1.nodeIndex==_d5){
add=true;
}
}else{
if((_e1.nodeIndex+_d5)%_e0==0){
add=true;
}
}
if(add^not){
tmp.push(_e1);
}
}
r=tmp;
}else{
var f=jQuery.expr[m[1]];
if(typeof f!="string"){
f=jQuery.expr[m[1]][m[2]];
}
eval("f = function(a,i){return "+f+"}");
r=jQuery.grep(r,f,not);
}
}
}
}
}
return {r:r,t:t};
},parents:function(_e7){
var _e8=[];
var cur=_e7.parentNode;
while(cur&&cur!=document){
_e8.push(cur);
cur=cur.parentNode;
}
return _e8;
},nth:function(cur,_eb,dir,_ed){
_eb=_eb||1;
var num=0;
for(;cur;cur=cur[dir]){
if(cur.nodeType==1&&++num==_eb){
break;
}
}
return cur;
},sibling:function(n,_f0){
var r=[];
for(;n;n=n.nextSibling){
if(n.nodeType==1&&(!_f0||n!=_f0)){
r.push(n);
}
}
return r;
}});
jQuery.event={add:function(_f2,_f3,_f4,_f5){
if(jQuery.browser.msie&&_f2.setInterval!=undefined){
_f2=window;
}
if(!_f4.guid){
_f4.guid=this.guid++;
}
if(_f5!=undefined){
var fn=_f4;
_f4=function(){
return fn.apply(this,arguments);
};
_f4.data=_f5;
_f4.guid=fn.guid;
}
if(!_f2.$events){
_f2.$events={};
}
if(!_f2.$handle){
_f2.$handle=function(){
var val;
if(typeof jQuery=="undefined"||jQuery.event.triggered){
return val;
}
val=jQuery.event.handle.apply(_f2,arguments);
return val;
};
}
var _f8=_f2.$events[_f3];
if(!_f8){
_f8=_f2.$events[_f3]={};
if(_f2.addEventListener){
_f2.addEventListener(_f3,_f2.$handle,false);
}else{
_f2.attachEvent("on"+_f3,_f2.$handle);
}
}
_f8[_f4.guid]=_f4;
if(!this.global[_f3]){
this.global[_f3]=[];
}
if(jQuery.inArray(_f2,this.global[_f3])==-1){
this.global[_f3].push(_f2);
}
},guid:1,global:{},remove:function(_f9,_fa,_fb){
var _fc=_f9.$events,ret,_fe;
if(_fc){
if(_fa&&_fa.type){
_fb=_fa.handler;
_fa=_fa.type;
}
if(!_fa){
for(_fa in _fc){
this.remove(_f9,_fa);
}
}else{
if(_fc[_fa]){
if(_fb){
delete _fc[_fa][_fb.guid];
}else{
for(_fb in _f9.$events[_fa]){
delete _fc[_fa][_fb];
}
}
for(ret in _fc[_fa]){
break;
}
if(!ret){
if(_f9.removeEventListener){
_f9.removeEventListener(_fa,_f9.$handle,false);
}else{
_f9.detachEvent("on"+_fa,_f9.$handle);
}
ret=null;
delete _fc[_fa];
while(this.global[_fa]&&((_fe=jQuery.inArray(_f9,this.global[_fa]))>=0)){
delete this.global[_fa][_fe];
}
}
}
}
for(ret in _fc){
break;
}
if(!ret){
_f9.$handle=_f9.$events=null;
}
}
},trigger:function(_ff,data,_101){
data=jQuery.makeArray(data||[]);
if(!_101){
jQuery.each(this.global[_ff]||[],function(){
jQuery.event.trigger(_ff,data,this);
});
}else{
var val,ret,fn=jQuery.isFunction(_101[_ff]||null);
data.unshift(this.fix({type:_ff,target:_101}));
if(jQuery.isFunction(_101.$handle)&&(val=_101.$handle.apply(_101,data))!==false){
this.triggered=true;
}
if(fn&&val!==false&&!jQuery.nodeName(_101,"a")){
_101[_ff]();
}
this.triggered=false;
}
},handle:function(_105){
var val;
_105=jQuery.event.fix(_105||window.event||{});
var c=this.$events&&this.$events[_105.type],args=[].slice.call(arguments,1);
args.unshift(_105);
for(var j in c){
args[0].handler=c[j];
args[0].data=c[j].data;
if(c[j].apply(this,args)===false){
_105.preventDefault();
_105.stopPropagation();
val=false;
}
}
if(jQuery.browser.msie){
_105.target=_105.preventDefault=_105.stopPropagation=_105.handler=_105.data=null;
}
return val;
},fix:function(_10a){
var _10b=_10a;
_10a=jQuery.extend({},_10b);
_10a.preventDefault=function(){
if(_10b.preventDefault){
return _10b.preventDefault();
}
_10b.returnValue=false;
};
_10a.stopPropagation=function(){
if(_10b.stopPropagation){
return _10b.stopPropagation();
}
_10b.cancelBubble=true;
};
if(!_10a.target&&_10a.srcElement){
_10a.target=_10a.srcElement;
}
if(jQuery.browser.safari&&_10a.target.nodeType==3){
_10a.target=_10b.target.parentNode;
}
if(!_10a.relatedTarget&&_10a.fromElement){
_10a.relatedTarget=_10a.fromElement==_10a.target?_10a.toElement:_10a.fromElement;
}
if(_10a.pageX==null&&_10a.clientX!=null){
var e=document.documentElement,b=document.body;
_10a.pageX=_10a.clientX+(e&&e.scrollLeft||b.scrollLeft);
_10a.pageY=_10a.clientY+(e&&e.scrollTop||b.scrollTop);
}
if(!_10a.which&&(_10a.charCode||_10a.keyCode)){
_10a.which=_10a.charCode||_10a.keyCode;
}
if(!_10a.metaKey&&_10a.ctrlKey){
_10a.metaKey=_10a.ctrlKey;
}
if(!_10a.which&&_10a.button){
_10a.which=(_10a.button&1?1:(_10a.button&2?3:(_10a.button&4?2:0)));
}
return _10a;
}};
jQuery.fn.extend({bind:function(type,data,fn){
return type=="unload"?this.one(type,data,fn):this.each(function(){
jQuery.event.add(this,type,fn||data,fn&&data);
});
},one:function(type,data,fn){
return this.each(function(){
jQuery.event.add(this,type,function(_114){
jQuery(this).unbind(_114);
return (fn||data).apply(this,arguments);
},fn&&data);
});
},unbind:function(type,fn){
return this.each(function(){
jQuery.event.remove(this,type,fn);
});
},trigger:function(type,data){
return this.each(function(){
jQuery.event.trigger(type,data,this);
});
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
if(jQuery.isReady){
f.apply(document,[jQuery]);
}else{
jQuery.readyList.push(function(){
return f.apply(this,[jQuery]);
});
}
return this;
}});
jQuery.extend({isReady:false,readyList:[],ready:function(){
if(!jQuery.isReady){
jQuery.isReady=true;
if(jQuery.readyList){
jQuery.each(jQuery.readyList,function(){
this.apply(document);
});
jQuery.readyList=null;
}
if(jQuery.browser.mozilla||jQuery.browser.opera){
document.removeEventListener("DOMContentLoaded",jQuery.ready,false);
}
if(!window.frames.length){
jQuery(window).load(function(){
jQuery("#__ie_init").remove();
});
}
}
}});
new function(){
jQuery.each(("blur,focus,load,resize,scroll,unload,click,dblclick,"+"mousedown,mouseup,mousemove,mouseover,mouseout,change,select,"+"submit,keydown,keypress,keyup,error").split(","),function(i,o){
jQuery.fn[o]=function(f){
return f?this.bind(o,f):this.trigger(o);
};
});
if(jQuery.browser.mozilla||jQuery.browser.opera){
document.addEventListener("DOMContentLoaded",jQuery.ready,false);
}else{
if(jQuery.browser.msie){
document.write("<scr"+"ipt id=__ie_init defer=true "+"src=//:></script>");
var _123=document.getElementById("__ie_init");
if(_123){
_123.onreadystatechange=function(){
if(this.readyState!="complete"){
return;
}
jQuery.ready();
};
}
_123=null;
}else{
if(jQuery.browser.safari){
jQuery.safariTimer=setInterval(function(){
if(document.readyState=="loaded"||document.readyState=="complete"){
clearInterval(jQuery.safariTimer);
jQuery.safariTimer=null;
jQuery.ready();
}
},10);
}
}
}
jQuery.event.add(window,"load",jQuery.ready);
};
if(jQuery.browser.msie){
jQuery(window).one("unload",function(){
var _124=jQuery.event.global;
for(var type in _124){
var els=_124[type],i=els.length;
if(i&&type!="unload"){
do{
els[i-1]&&jQuery.event.remove(els[i-1],type);
}while(--i);
}
}
});
}
jQuery.fn.extend({loadIfModified:function(url,_129,_12a){
this.load(url,_129,_12a,1);
},load:function(url,_12c,_12d,_12e){
if(jQuery.isFunction(url)){
return this.bind("load",url);
}
_12d=_12d||function(){
};
var type="GET";
if(_12c){
if(jQuery.isFunction(_12c)){
_12d=_12c;
_12c=null;
}else{
_12c=jQuery.param(_12c);
type="POST";
}
}
var self=this;
jQuery.ajax({url:url,type:type,data:_12c,ifModified:_12e,complete:function(res,_132){
if(_132=="success"||!_12e&&_132=="notmodified"){
self.attr("innerHTML",res.responseText).evalScripts().each(_12d,[res.responseText,_132,res]);
}else{
_12d.apply(self,[res.responseText,_132,res]);
}
}});
return this;
},serialize:function(){
return jQuery.param(this);
},evalScripts:function(){
return this.find("script").each(function(){
if(this.src){
jQuery.getScript(this.src);
}else{
jQuery.globalEval(this.text||this.textContent||this.innerHTML||"");
}
}).end();
}});
jQuery.each("ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","),function(i,o){
jQuery.fn[o]=function(f){
return this.bind(o,f);
};
});
jQuery.extend({get:function(url,data,_138,type,_13a){
if(jQuery.isFunction(data)){
_138=data;
data=null;
}
return jQuery.ajax({type:"GET",url:url,data:data,success:_138,dataType:type,ifModified:_13a});
},getIfModified:function(url,data,_13d,type){
return jQuery.get(url,data,_13d,type,1);
},getScript:function(url,_140){
return jQuery.get(url,null,_140,"script");
},getJSON:function(url,data,_143){
return jQuery.get(url,data,_143,"json");
},post:function(url,data,_146,type){
if(jQuery.isFunction(data)){
_146=data;
data={};
}
return jQuery.ajax({type:"POST",url:url,data:data,success:_146,dataType:type});
},ajaxTimeout:function(_148){
jQuery.ajaxSettings.timeout=_148;
},ajaxSetup:function(_149){
jQuery.extend(jQuery.ajaxSettings,_149);
},ajaxSettings:{global:true,type:"GET",timeout:0,contentType:"application/x-www-form-urlencoded",processData:true,async:true,data:null},lastModified:{},ajax:function(s){
s=jQuery.extend({},jQuery.ajaxSettings,s);
if(s.data){
if(s.processData&&typeof s.data!="string"){
s.data=jQuery.param(s.data);
}
if(s.type.toLowerCase()=="get"){
s.url+=((s.url.indexOf("?")>-1)?"&":"?")+s.data;
s.data=null;
}
}
if(s.global&&!jQuery.active++){
jQuery.event.trigger("ajaxStart");
}
var _14b=false;
var xml=window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest();
xml.open(s.type,s.url,s.async);
if(s.data){
xml.setRequestHeader("Content-Type",s.contentType);
}
if(s.ifModified){
xml.setRequestHeader("If-Modified-Since",jQuery.lastModified[s.url]||"Thu, 01 Jan 1970 00:00:00 GMT");
}
xml.setRequestHeader("X-Requested-With","XMLHttpRequest");
if(s.beforeSend){
s.beforeSend(xml);
}
if(s.global){
jQuery.event.trigger("ajaxSend",[xml,s]);
}
var _14d=function(_14e){
if(xml&&(xml.readyState==4||_14e=="timeout")){
_14b=true;
if(ival){
clearInterval(ival);
ival=null;
}
var _150;
try{
_150=jQuery.httpSuccess(xml)&&_14e!="timeout"?s.ifModified&&jQuery.httpNotModified(xml,s.url)?"notmodified":"success":"error";
if(_150!="error"){
var _151;
try{
_151=xml.getResponseHeader("Last-Modified");
}
catch(e){
}
if(s.ifModified&&_151){
jQuery.lastModified[s.url]=_151;
}
var data=jQuery.httpData(xml,s.dataType);
if(s.success){
s.success(data,_150);
}
if(s.global){
jQuery.event.trigger("ajaxSuccess",[xml,s]);
}
}else{
jQuery.handleError(s,xml,_150);
}
}
catch(e){
_150="error";
jQuery.handleError(s,xml,_150,e);
}
if(s.global){
jQuery.event.trigger("ajaxComplete",[xml,s]);
}
if(s.global&&!--jQuery.active){
jQuery.event.trigger("ajaxStop");
}
if(s.complete){
s.complete(xml,_150);
}
if(s.async){
xml=null;
}
}
};
var ival=setInterval(_14d,13);
if(s.timeout>0){
setTimeout(function(){
if(xml){
xml.abort();
if(!_14b){
_14d("timeout");
}
}
},s.timeout);
}
try{
xml.send(s.data);
}
catch(e){
jQuery.handleError(s,xml,null,e);
}
if(!s.async){
_14d();
}
return xml;
},handleError:function(s,xml,_155,e){
if(s.error){
s.error(xml,_155,e);
}
if(s.global){
jQuery.event.trigger("ajaxError",[xml,s,e]);
}
},active:0,httpSuccess:function(r){
try{
return !r.status&&location.protocol=="file:"||(r.status>=200&&r.status<300)||r.status==304||jQuery.browser.safari&&r.status==undefined;
}
catch(e){
}
return false;
},httpNotModified:function(xml,url){
try{
var _15a=xml.getResponseHeader("Last-Modified");
return xml.status==304||_15a==jQuery.lastModified[url]||jQuery.browser.safari&&xml.status==undefined;
}
catch(e){
}
return false;
},httpData:function(r,type){
var ct=r.getResponseHeader("content-type");
var data=!type&&ct&&ct.indexOf("xml")>=0;
data=type=="xml"||data?r.responseXML:r.responseText;
if(type=="script"){
jQuery.globalEval(data);
}
if(type=="json"){
data=eval("("+data+")");
}
if(type=="html"){
jQuery("<div>").html(data).evalScripts();
}
return data;
},param:function(a){
var s=[];
if(a.constructor==Array||a.jquery){
jQuery.each(a,function(){
s.push(encodeURIComponent(this.name)+"="+encodeURIComponent(this.value));
});
}else{
for(var j in a){
if(a[j]&&a[j].constructor==Array){
jQuery.each(a[j],function(){
s.push(encodeURIComponent(j)+"="+encodeURIComponent(this));
});
}else{
s.push(encodeURIComponent(j)+"="+encodeURIComponent(a[j]));
}
}
}
return s.join("&");
},globalEval:function(data){
if(window.execScript){
window.execScript(data);
}else{
if(jQuery.browser.safari){
window.setTimeout(data,0);
}else{
eval.call(window,data);
}
}
}});
jQuery.fn.extend({show:function(_163,_164){
return _163?this.animate({height:"show",width:"show",opacity:"show"},_163,_164):this.filter(":hidden").each(function(){
this.style.display=this.oldblock?this.oldblock:"";
if(jQuery.css(this,"display")=="none"){
this.style.display="block";
}
}).end();
},hide:function(_165,_166){
return _165?this.animate({height:"hide",width:"hide",opacity:"hide"},_165,_166):this.filter(":visible").each(function(){
this.oldblock=this.oldblock||jQuery.css(this,"display");
if(this.oldblock=="none"){
this.oldblock="block";
}
this.style.display="none";
}).end();
},_toggle:jQuery.fn.toggle,toggle:function(fn,fn2){
return jQuery.isFunction(fn)&&jQuery.isFunction(fn2)?this._toggle(fn,fn2):fn?this.animate({height:"toggle",width:"toggle",opacity:"toggle"},fn,fn2):this.each(function(){
jQuery(this)[jQuery(this).is(":hidden")?"show":"hide"]();
});
},slideDown:function(_169,_16a){
return this.animate({height:"show"},_169,_16a);
},slideUp:function(_16b,_16c){
return this.animate({height:"hide"},_16b,_16c);
},slideToggle:function(_16d,_16e){
return this.animate({height:"toggle"},_16d,_16e);
},fadeIn:function(_16f,_170){
return this.animate({opacity:"show"},_16f,_170);
},fadeOut:function(_171,_172){
return this.animate({opacity:"hide"},_171,_172);
},fadeTo:function(_173,to,_175){
return this.animate({opacity:to},_173,_175);
},animate:function(prop,_177,_178,_179){
return this.queue(function(){
var _17a=jQuery(this).is(":hidden"),opt=jQuery.speed(_177,_178,_179),self=this;
for(var p in prop){
if(prop[p]=="hide"&&_17a||prop[p]=="show"&&!_17a){
return jQuery.isFunction(opt.complete)&&opt.complete.apply(this);
}
if(p=="height"||p=="width"){
opt.display=jQuery.css(this,"display");
opt.overflow=this.style.overflow;
}
}
if(opt.overflow!=null){
this.style.overflow="hidden";
}
this.curAnim=jQuery.extend({},prop);
jQuery.each(prop,function(name,val){
var e=new jQuery.fx(self,opt,name);
if(val.constructor==Number){
e.custom(e.cur(),val);
}else{
e[val=="toggle"?_17a?"show":"hide":val](prop);
}
});
});
},queue:function(type,fn){
if(!fn){
fn=type;
type="fx";
}
return this.each(function(){
if(!this.queue){
this.queue={};
}
if(!this.queue[type]){
this.queue[type]=[];
}
this.queue[type].push(fn);
if(this.queue[type].length==1){
fn.apply(this);
}
});
}});
jQuery.extend({speed:function(_183,_184,fn){
var opt=_183&&_183.constructor==Object?_183:{complete:fn||!fn&&_184||jQuery.isFunction(_183)&&_183,duration:_183,easing:fn&&_184||_184&&_184.constructor!=Function&&_184||(jQuery.easing.swing?"swing":"linear")};
opt.duration=(opt.duration&&opt.duration.constructor==Number?opt.duration:{slow:600,fast:200}[opt.duration])||400;
opt.old=opt.complete;
opt.complete=function(){
jQuery.dequeue(this,"fx");
if(jQuery.isFunction(opt.old)){
opt.old.apply(this);
}
};
return opt;
},easing:{linear:function(p,n,_189,diff){
return _189+diff*p;
},swing:function(p,n,_18d,diff){
return ((-Math.cos(p*Math.PI)/2)+0.5)*diff+_18d;
}},queue:{},dequeue:function(elem,type){
type=type||"fx";
if(elem.queue&&elem.queue[type]){
elem.queue[type].shift();
var f=elem.queue[type][0];
if(f){
f.apply(elem);
}
}
},timers:[],fx:function(elem,_193,prop){
var z=this;
var y=elem.style;
z.a=function(){
if(_193.step){
_193.step.apply(elem,[z.now]);
}
if(prop=="opacity"){
jQuery.attr(y,"opacity",z.now);
}else{
y[prop]=parseInt(z.now)+"px";
y.display="block";
}
};
z.max=function(){
return parseFloat(jQuery.css(elem,prop));
};
z.cur=function(){
var r=parseFloat(jQuery.curCSS(elem,prop));
return r&&r>-10000?r:z.max();
};
z.custom=function(from,to){
z.startTime=(new Date()).getTime();
z.now=from;
z.a();
jQuery.timers.push(function(){
return z.step(from,to);
});
if(jQuery.timers.length==1){
var _19a=setInterval(function(){
var _19b=jQuery.timers;
for(var i=0;i<_19b.length;i++){
if(!_19b[i]()){
_19b.splice(i--,1);
}
}
if(!_19b.length){
clearInterval(_19a);
}
},13);
}
};
z.show=function(){
if(!elem.orig){
elem.orig={};
}
elem.orig[prop]=jQuery.attr(elem.style,prop);
_193.show=true;
z.custom(0,this.cur());
if(prop!="opacity"){
y[prop]="1px";
}
jQuery(elem).show();
};
z.hide=function(){
if(!elem.orig){
elem.orig={};
}
elem.orig[prop]=jQuery.attr(elem.style,prop);
_193.hide=true;
z.custom(this.cur(),0);
};
z.step=function(_19d,_19e){
var t=(new Date()).getTime();
if(t>_193.duration+z.startTime){
z.now=_19e;
z.a();
if(elem.curAnim){
elem.curAnim[prop]=true;
}
var done=true;
for(var i in elem.curAnim){
if(elem.curAnim[i]!==true){
done=false;
}
}
if(done){
if(_193.display!=null){
y.overflow=_193.overflow;
y.display=_193.display;
if(jQuery.css(elem,"display")=="none"){
y.display="block";
}
}
if(_193.hide){
y.display="none";
}
if(_193.hide||_193.show){
for(var p in elem.curAnim){
jQuery.attr(y,p,elem.orig[p]);
}
}
}
if(done&&jQuery.isFunction(_193.complete)){
_193.complete.apply(elem);
}
return false;
}else{
var n=t-this.startTime;
var p=n/_193.duration;
z.now=jQuery.easing[_193.easing](p,n,_19d,(_19e-_19d),_193.duration);
z.a();
}
return true;
};
}});
}

(function($){
var _2=$.fn.height,_3=$.fn.width;
$.fn.extend({height:function(){
if(this[0]==window){
return self.innerHeight||$.boxModel&&document.documentElement.clientHeight||document.body.clientHeight;
}
if(this[0]==document){
return Math.max(document.body.scrollHeight,document.body.offsetHeight);
}
return _2.apply(this,arguments);
},width:function(){
if(this[0]==window){
return self.innerWidth||$.boxModel&&document.documentElement.clientWidth||document.body.clientWidth;
}
if(this[0]==document){
return Math.max(document.body.scrollWidth,document.body.offsetWidth);
}
return _3.apply(this,arguments);
},innerHeight:function(){
return this[0]==window||this[0]==document?this.height():this.is(":visible")?this[0].offsetHeight-_4(this,"borderTopWidth")-_4(this,"borderBottomWidth"):this.height()+_4(this,"paddingTop")+_4(this,"paddingBottom");
},innerWidth:function(){
return this[0]==window||this[0]==document?this.width():this.is(":visible")?this[0].offsetWidth-_4(this,"borderLeftWidth")-_4(this,"borderRightWidth"):this.width()+_4(this,"paddingLeft")+_4(this,"paddingRight");
},outerHeight:function(){
return this[0]==window||this[0]==document?this.height():this.is(":visible")?this[0].offsetHeight:this.height()+_4(this,"borderTopWidth")+_4(this,"borderBottomWidth")+_4(this,"paddingTop")+_4(this,"paddingBottom");
},outerWidth:function(){
return this[0]==window||this[0]==document?this.width():this.is(":visible")?this[0].offsetWidth:this.width()+_4(this,"borderLeftWidth")+_4(this,"borderRightWidth")+_4(this,"paddingLeft")+_4(this,"paddingRight");
},scrollLeft:function(_5){
if(_5!=undefined){
return this.each(function(){
if(this==window||this==document){
window.scrollTo(_5,$(window).scrollTop());
}else{
this.scrollLeft=_5;
}
});
}
if(this[0]==window||this[0]==document){
return self.pageXOffset||$.boxModel&&document.documentElement.scrollLeft||document.body.scrollLeft;
}
return this[0].scrollLeft;
},scrollTop:function(_6){
if(_6!=undefined){
return this.each(function(){
if(this==window||this==document){
window.scrollTo($(window).scrollLeft(),_6);
}else{
this.scrollTop=_6;
}
});
}
if(this[0]==window||this[0]==document){
return self.pageYOffset||$.boxModel&&document.documentElement.scrollTop||document.body.scrollTop;
}
return this[0].scrollTop;
},position:function(_7,_8){
var _9=this[0],_a=_9.parentNode,op=_9.offsetParent,_7=$.extend({margin:false,border:false,padding:false,scroll:false},_7||{}),x=_9.offsetLeft,y=_9.offsetTop,sl=_9.scrollLeft,st=_9.scrollTop;
if($.browser.mozilla||$.browser.msie){
x+=_4(_9,"borderLeftWidth");
y+=_4(_9,"borderTopWidth");
}
if(($.browser.safari||$.browser.opera)&&$.css(op,"position")!="static"){
x-=_4(op,"borderLeftWidth");
y-=_4(op,"borderTopWidth");
}
if($.browser.mozilla){
do{
if(_a!=_9&&$.css(_a,"overflow")!="visible"){
x+=_4(_a,"borderLeftWidth");
y+=_4(_a,"borderTopWidth");
}
if(_a==op){
break;
}
}while((_a=_a.parentNode)&&_a.tagName!="BODY");
}
if($.browser.msie&&(op.tagName!="BODY"&&$.css(op,"position")=="static")){
do{
x+=op.offsetLeft;
y+=op.offsetTop;
x+=_4(op,"borderLeftWidth");
y+=_4(op,"borderTopWidth");
}while((op=op.offsetParent)&&(op.tagName!="BODY"&&$.css(op,"position")=="static"));
}
var _10=_11(_9,_7,x,y,sl,st);
if(_8){
$.extend(_8,_10);
return this;
}else{
return _10;
}
},offset:function(_12,_13){
var x=0,y=0,sl=0,st=0,_18=this[0],_19=this[0],op,_1b,_1c=$.css(_18,"position"),mo=$.browser.mozilla,ie=$.browser.msie,sf=$.browser.safari,oa=$.browser.opera,_21=false,_22=false,_12=$.extend({margin:true,border:false,padding:false,scroll:true,lite:false},_12||{});
if(_12.lite){
return this.offsetLite(_12,_13);
}
if(_18.tagName=="BODY"){
x=_18.offsetLeft;
y=_18.offsetTop;
if(mo){
x+=_4(_18,"marginLeft")+(_4(_18,"borderLeftWidth")*2);
y+=_4(_18,"marginTop")+(_4(_18,"borderTopWidth")*2);
}else{
if(oa){
x+=_4(_18,"marginLeft");
y+=_4(_18,"marginTop");
}else{
if(ie&&jQuery.boxModel){
x+=_4(_18,"borderLeftWidth");
y+=_4(_18,"borderTopWidth");
}
}
}
}else{
do{
_1b=$.css(_19,"position");
x+=_19.offsetLeft;
y+=_19.offsetTop;
if(mo||ie){
x+=_4(_19,"borderLeftWidth");
y+=_4(_19,"borderTopWidth");
if(mo&&_1b=="absolute"){
_21=true;
}
if(ie&&_1b=="relative"){
_22=true;
}
}
op=_19.offsetParent;
if(_12.scroll||mo){
do{
if(_12.scroll){
sl+=_19.scrollLeft;
st+=_19.scrollTop;
}
if(mo&&_19!=_18&&$.css(_19,"overflow")!="visible"){
x+=_4(_19,"borderLeftWidth");
y+=_4(_19,"borderTopWidth");
}
_19=_19.parentNode;
}while(_19!=op);
}
_19=op;
if(_19.tagName=="BODY"||_19.tagName=="HTML"){
if((sf||(ie&&$.boxModel))&&_1c!="absolute"&&_1c!="fixed"){
x+=_4(_19,"marginLeft");
y+=_4(_19,"marginTop");
}
if((mo&&!_21&&_1c!="fixed")||(ie&&_1c=="static"&&!_22)){
x+=_4(_19,"borderLeftWidth");
y+=_4(_19,"borderTopWidth");
}
break;
}
}while(_19);
}
var _23=_11(_18,_12,x,y,sl,st);
if(_13){
$.extend(_13,_23);
return this;
}else{
return _23;
}
},offsetLite:function(_24,_25){
var x=0,y=0,sl=0,st=0,_2a=this[0],op,_24=$.extend({margin:true,border:false,padding:false,scroll:true},_24||{});
do{
x+=_2a.offsetLeft;
y+=_2a.offsetTop;
op=_2a.offsetParent;
if(_24.scroll){
do{
sl+=_2a.scrollLeft;
st+=_2a.scrollTop;
_2a=_2a.parentNode;
}while(_2a!=op);
}
_2a=op;
}while(_2a&&_2a.tagName!="BODY"&&_2a.tagName!="HTML");
var _2c=_11(this[0],_24,x,y,sl,st);
if(_25){
$.extend(_25,_2c);
return this;
}else{
return _2c;
}
}});
var _4=function(el,_2e){
return parseInt($.css(el.jquery?el[0]:el,_2e))||0;
};
var _11=function(_2f,_30,x,y,sl,st){
if(!_30.margin){
x-=_4(_2f,"marginLeft");
y-=_4(_2f,"marginTop");
}
if(_30.border&&($.browser.safari||$.browser.opera)){
x+=_4(_2f,"borderLeftWidth");
y+=_4(_2f,"borderTopWidth");
}else{
if(!_30.border&&!($.browser.safari||$.browser.opera)){
x-=_4(_2f,"borderLeftWidth");
y-=_4(_2f,"borderTopWidth");
}
}
if(_30.padding){
x+=_4(_2f,"paddingLeft");
y+=_4(_2f,"paddingTop");
}
if(_30.scroll){
sl-=_2f.scrollLeft;
st-=_2f.scrollTop;
}
return _30.scroll?{top:y-st,left:x-sl,scrollTop:st,scrollLeft:sl}:{top:y,left:x};
};
})(jQuery);

jQuery.extend({historyCurrentHash:undefined,historyCallback:undefined,historyInit:function(_1){
jQuery.historyCallback=_1;
var _2=location.hash;
jQuery.historyCurrentHash=_2;
if(jQuery.browser.msie){
if(jQuery.historyCurrentHash==""){
jQuery.historyCurrentHash="#";
}
jQuery("body").prepend("<iframe id=\"jQuery_history\" style=\"display: none;\"></iframe>");
var _3=jQuery("#jQuery_history")[0];
var _4=_3.contentWindow.document;
_4.open();
_4.close();
_4.location.hash=_2;
}else{
if(jQuery.browser.safari&&parseInt(jQuery.browser.version,10)<420){
jQuery.historyBackStack=[];
jQuery.historyBackStack.length=history.length;
jQuery.historyForwardStack=[];
jQuery.isFirst=true;
}
}
jQuery.historyCallback(_2.replace(/^#/,""));
setInterval(jQuery.historyCheck,100);
},historyAddHistory:function(_5){
jQuery.historyBackStack.push(_5);
jQuery.historyForwardStack.length=0;
jQuery.isFirst=true;
},historyCheck:function(){
if(jQuery.browser.msie){
var _6=jQuery("#jQuery_history")[0];
var _7=_6.contentDocument||_6.contentWindow.document;
var _8=_7.location.hash;
if(_8!=jQuery.historyCurrentHash){
location.hash=_8;
jQuery.historyCurrentHash=_8;
jQuery.historyCallback(_8.replace(/^#/,""));
}
}else{
if(jQuery.browser.safari&&parseInt(jQuery.browser.version,10)<420){
if(!jQuery.dontCheck){
var _9=history.length-jQuery.historyBackStack.length;
if(_9){
jQuery.isFirst=false;
if(_9<0){
for(var i=0;i<Math.abs(_9);i++){
jQuery.historyForwardStack.unshift(jQuery.historyBackStack.pop());
}
}else{
for(var i=0;i<_9;i++){
jQuery.historyBackStack.push(jQuery.historyForwardStack.shift());
}
}
var _b=jQuery.historyBackStack[jQuery.historyBackStack.length-1];
if(_b!=undefined){
jQuery.historyCurrentHash=location.hash;
jQuery.historyCallback(_b);
}
}else{
if(jQuery.historyBackStack[jQuery.historyBackStack.length-1]==undefined&&!jQuery.isFirst){
if(document.URL.indexOf("#")>=0){
jQuery.historyCallback(document.URL.split("#")[1]);
}else{
var _8=location.hash;
jQuery.historyCallback("");
}
jQuery.isFirst=true;
}
}
}
}else{
var _8=location.hash;
if(_8!=jQuery.historyCurrentHash){
jQuery.historyCurrentHash=_8;
jQuery.historyCallback(_8.replace(/^#/,""));
}
}
}
},historyLoad:function(_c){
var _d;
if(jQuery.browser.safari){
_d=_c;
if(parseInt(jQuery.browser.version,10)>=420){
location.hash=_d;
}
}else{
_d="#"+_c;
location.hash=_d;
}
jQuery.historyCurrentHash=_d;
if(jQuery.browser.msie){
var _e=jQuery("#jQuery_history")[0];
var _f=_e.contentWindow.document;
_f.open();
_f.close();
_f.location.hash=_d;
jQuery.historyCallback(_c);
}else{
if(jQuery.browser.safari&&parseInt(jQuery.browser.version,10)<420){
jQuery.dontCheck=true;
jQuery.historyAddHistory(_c);
var fn=function(){
jQuery.dontCheck=false;
};
window.setTimeout(fn,200);
jQuery.historyCallback(_c);
location.hash=_d;
}else{
jQuery.historyCallback(_c);
}
}
}});

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

jQuery.noConflict();
eidogo.util={byId:function(id){
return jQuery("#"+id)[0];
},ajax:function(_2,_3,_4,_5,_6,_7,_8){
_7=_7||window;
jQuery.ajax({type:_2.toUpperCase(),url:_3,data:_4,success:function(_9){
_5.call(_7,{responseText:_9});
},error:_6.bind(_7),timeout:_8});
},addEvent:function(el,_b,_c,_d,_e){
if(_e){
_c=_c.bind(_d);
}else{
if(_d){
var _f=_c;
_c=function(e){
_f(e,_d);
};
}
}
jQuery(el).bind(_b,{},_c);
},onClick:function(el,_12,_13){
eidogo.util.addEvent(el,"click",_12,_13,true);
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
jQuery(el).addClass(cls);
},removeClass:function(el,cls){
jQuery(el).removeClass(cls);
},show:function(el,_20){
_20=_20||"block";
if(typeof el=="string"){
el=eidogo.util.byId(el);
}
el.style.display=_20;
},hide:function(el){
if(typeof el=="string"){
el=eidogo.util.byId(el);
}
el.style.display="none";
},getElX:function(el){
return jQuery(el).offsetLite({scroll:false}).left;
},getElY:function(el){
return jQuery(el).offsetLite({scroll:false}).top;
}};

if(typeof eidogo.i18n=="undefined"){
eidogo.i18n={"move":"Move","loading":"Loading","passed":"passed","variations":"Variations","no variations":"none","tool":"Tool","play":"Play","region":"Select Region","add_b":"Black Stone","add_w":"White Stone","triangle":"Triangle","square":"Square","circle":"Circle","x":"X","letter":"Letter","number":"Number","search":"Search","search corner":"Corner Search","search center":"Center Search","region info":"Click and drag to select a region. If your browser            does not support dragging (e.g., iPhone), click once to begin the selection            and click once to end it.","two stones":"Please select at least two stones to search for.","two edges":"For corner searches, your selection must             touch two adjacent edges of the board.","no search url":"No search URL provided.","white":"White","white rank":"White rank","white team":"White team","black":"Black","black rank":"Black rank","black team":"Black team","captures":"captures","time left":"time left","you":"You","game":"Game","handicap":"Handicap","komi":"Komi","result":"Result","date":"Date","info":"Info","place":"Place","event":"Event","round":"Round","overtime":"Overtime","opening":"Openning","ruleset":"Ruleset","annotator":"Annotator","copyright":"Copyright","source":"Source","time limit":"Time limit","transcriber":"Transcriber","created with":"Created with","january":"January","february":"February","march":"March","april":"April","may":"May","june":"June","july":"July","august":"August","september":"September","october":"October","november":"November","december":"December","gw":"Good for White","vgw":"Very good for White","gb":"Good for Black","vgb":"Very good for Black","dm":"Even position","dmj":"Even position (joseki)","uc":"Unclear position","te":"Tesuji","bm":"Bad move","vbm":"Very bad move","do":"Doubtful move","it":"Interesting move","black to play":"Black to play","white to play":"White to play","ho":"Hotspot","dom error":"Error finding DOM container","error retrieving":"There was a problem retrieving the game data.","invalid data":"Received invalid game data","error board":"Error loading board container","gnugo thinking":"GNU Go is thinking..."};
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
var _30=new eidogo.GameCursor(this.node);
var _31=prevId=_30.node.parent.id;
_2f.push(_30.node.getPosition());
_2f.push(_30.node.parent.getPosition());
while(_30.previous()){
_31=_30.node.parent.id;
if(prevId!=_31){
_2f.push(_30.node.parent.getPosition());
prevId=_31;
}
}
return _2f.reverse();
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
return null;
},renderMarker:function(pt,_2c){
if(this.renderCache.markers[pt.x][pt.y]){
var _2d=document.getElementById("marker-"+pt.x+"-"+pt.y);
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
var t=eidogo.i18n;
var _2=eidogo.util.byId;
var _3=eidogo.util.ajax;
var _4=eidogo.util.addEvent;
var _5=eidogo.util.onClick;
var _6=eidogo.util.getElClickXY;
var _7=eidogo.util.stopEvent;
var _8=eidogo.util.addClass;
var _9=eidogo.util.removeClass;
var _a=eidogo.util.show;
var _b=eidogo.util.hide;
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
this.sgfPath=_d.sgfPath;
this.searchUrl=_d.searchUrl;
this.saveUrl=_d.saveUrl;
this.downloadUrl=_d.downloadUrl;
this.hooks=_d.hooks||{};
this.propertyHandlers={W:this.playMove,B:this.playMove,KO:this.playMove,MN:this.setMoveNumber,AW:this.addStone,AB:this.addStone,AE:this.addStone,CR:this.addMarker,LB:this.addMarker,TR:this.addMarker,MA:this.addMarker,SQ:this.addMarker,TW:this.addMarker,TB:this.addMarker,PL:this.setColor,C:this.showComments,N:this.showAnnotation,GB:this.showAnnotation,GW:this.showAnnotation,DM:this.showAnnotation,HO:this.showAnnotation,UC:this.showAnnotation,V:this.showAnnotation,BM:this.showAnnotation,DO:this.showAnnotation,IT:this.showAnnotation,TE:this.showAnnotation,BL:this.showTime,OB:this.showTime,WL:this.showTime,OW:this.showTime};
this.constructDom();
_4(document,"keydown",this.handleKeypress,this,true);
_4(document,"mouseup",this.handleDocMouseUp,this,true);
this.hook("initDone");
},hook:function(_e,_f){
if(_e in this.hooks){
this.hooks[_e].bind(this)(_f);
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
this.prefs={};
this.prefs.markCurrent=!!cfg.markCurrent;
this.prefs.markNext=typeof cfg.markNext!="undefined"?cfg.markNext:false;
this.prefs.markVariations=!!cfg.markVariations;
this.prefs.showGameInfo=!!cfg.showGameInfo;
this.prefs.showPlayerInfo=!!cfg.showPlayerInfo;
},loadSgf:function(cfg,_12){
this.nowLoading();
this.reset(cfg);
this.sgfPath=cfg.sgfPath||this.sgfPath;
this.loadPath=cfg.loadPath&&cfg.loadPath.length>1?cfg.loadPath:[0,0];
this.gameName=cfg.gameName;
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
this.remoteLoad(cfg.sgfUrl,null,false,null,_12);
var _14=true;
if(cfg.progressiveLoad){
this.progressiveLoads=0;
this.progressiveUrl=cfg.progressiveUrl||cfg.sgfUrl.replace(/\?.+$/,"");
}
}else{
var _15=cfg.boardSize||"19";
var _16={nodes:[],trees:[{nodes:[{SZ:_15}],trees:[]}]};
if(cfg.opponentUrl){
this.opponentUrl=cfg.opponentUrl;
this.opponentColor=cfg.opponentColor=="B"?cfg.opponentColor:"W";
var _17=_16.trees.first().nodes.first();
_17.PW=t["you"];
_17.PB="GNU Go";
this.gameName="gnugo";
}
this.load(_16);
}
}
}
if(!_14&&typeof _12=="function"){
_12();
}
},initGame:function(_18){
var _19=_18.trees.first().nodes.first();
var _1a=_19.SZ;
if(!this.board){
this.createBoard(_1a||19);
}
this.resetCursor(true);
this.totalMoves=0;
var _1b=new eidogo.GameCursor(this.cursor.node);
while(_1b.next()){
this.totalMoves++;
}
this.totalMoves--;
this.showInfo();
if(this.prefs.showPlayerInfo){
_a(this.dom.infoPlayers);
}else{
_b(this.dom.infoPlayers);
}
this.enableNavSlider();
this.selectTool("play");
this.hook("initGame");
},createBoard:function(_1c){
_1c=_1c||19;
try{
this.dom.boardContainer.innerHTML="";
var _1d=new eidogo.BoardRendererHtml(this.dom.boardContainer,_1c);
this.board=new eidogo.Board(_1d,_1c);
}
catch(e){
if(e=="No DOM container"){
this.croak(t["error board"]);
return;
}
}
if(_1c!=19){
_9(this.dom.boardContainer,"with-coords");
}else{
_8(this.dom.boardContainer,"with-coords");
}
this.board.renderer.domNode.appendChild(this.dom.searchRegion);
this.rules=new eidogo.Rules(this.board);
var _1e=this.board.renderer.domNode;
_4(_1e,"mousemove",this.handleBoardHover,this,true);
_4(_1e,"mousedown",this.handleBoardMouseDown,this,true);
_4(_1e,"mouseup",this.handleBoardMouseUp,this,true);
},load:function(_1f,_20){
if(!_20){
_20=new eidogo.GameTree();
this.gameTree=_20;
}
_20.loadJson(_1f);
_20.cached=true;
this.doneLoading();
if(!_20.parent){
this.initGame(_20);
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
},remoteLoad:function(url,_22,_23,_24,_25){
_23=_23=="undefined"?true:_23;
if(_23){
if(!_22){
this.gameName=url;
}
url=this.sgfPath+url+".sgf";
}
if(_24){
this.loadPath=_24;
}
var _26=function(req){
var _28=req.responseText;
var _29=_28.charAt(0);
var i=1;
while(i<_28.length&&(_29==" "||_29=="\r"||_29=="\n")){
_29=_28.charAt(i++);
}
if(_29=="("){
var sgf=new eidogo.SgfParser(_28);
this.load(sgf.tree,_22);
}else{
if(_29=="{"){
_28=eval("("+_28+")");
this.load(_28,_22);
}else{
this.croak(t["invalid data"]);
}
}
if(typeof _25=="function"){
_25();
}
};
var _2c=function(req){
this.croak(t["error retrieving"]);
};
_3("get",url,null,_26,_2c,this,30000);
},fetchOpponentMove:function(){
this.nowLoading(t["gnugo thinking"]);
var _2e=function(req){
this.doneLoading();
this.createMove(req.responseText);
};
var _30=function(req){
this.croak(t["error retrieving"]);
};
var _32={sgf:this.gameTree.trees[0].toSgf(),move:this.currentColor,size:this.gameTree.trees.first().nodes.first().SZ};
_3("post",this.opponentUrl,_32,_2e,_30,this,45000);
},goTo:function(_33,_34){
_34=typeof _34!="undefined"?_34:true;
if(_33 instanceof Array){
if(!_33.length){
return;
}
if(_34){
this.resetCursor(true);
}
while(_33.length){
var _35=parseInt(_33.shift(),10);
if(_33.length==0){
for(var i=0;i<_35;i++){
this.variation(null,true);
}
}else{
if(_33.length){
this.variation(_35,true);
if(_33.length!=1){
while(this.cursor.nextNode()){
this.execNode(true);
}
}
if(_33.length>1&&this.progressiveLoads){
return;
}
}
}
}
this.refresh();
}else{
if(!isNaN(parseInt(_33,10))){
var _37=parseInt(_33,10);
if(_34){
this.resetCursor(true);
_37++;
}
for(var i=0;i<_37;i++){
this.variation(null,true);
}
this.refresh();
}else{
alert("Don't know how to get to '"+_33+"'!");
}
}
},resetCursor:function(_38,_39){
this.board.reset();
this.currentColor="B";
this.moveNumber=0;
if(_39){
this.cursor.node=this.gameTree.trees.first().nodes.first();
}else{
this.cursor.node=this.gameTree.nodes.first();
}
this.refresh(_38);
},refresh:function(_3a){
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
this.execNode(_3a);
},variation:function(_3c,_3d){
if(this.cursor.next(_3c)){
this.execNode(_3d);
this.resetLastLabels();
if(this.progressiveLoads){
return false;
}
return true;
}
return false;
},execNode:function(_3e){
if(this.progressiveLoads){
var me=this;
setTimeout(function(){
me.execNode.call(me,_3e);
},10);
return;
}
if(!_3e){
this.dom.comments.innerHTML="";
this.timeB="";
this.timeW="";
this.board.clearMarkers();
}
if(this.moveNumber<1){
this.currentColor="B";
}
var _40=this.cursor.node.getProperties();
for(var _41 in _40){
if(this.propertyHandlers[_41]){
(this.propertyHandlers[_41]).apply(this,[this.cursor.node[_41],_41,_3e]);
}
}
if(_3e){
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
var _42=this.cursor.node.parent.trees;
for(var i=0;i<_42.length;i++){
this.variations.push({move:_42[i].nodes.first().getMove(),treeNum:i});
}
}
},back:function(e,obj,_46){
if(this.cursor.previous()){
this.moveNumber--;
if(this.moveNumber<0){
this.moveNumber=0;
}
this.board.revert(1);
this.refresh(_46);
this.resetLastLabels();
}
},forward:function(e,obj,_49){
this.variation(null,_49);
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
var _4c=_6(e,this.board.renderer.domNode);
var m=this.board.renderer.margin;
var pw=this.board.renderer.pointWidth;
var ph=this.board.renderer.pointHeight;
var x=Math.round((_4c[0]-m-(pw/2))/pw);
var y=Math.round((_4c[1]-m-(ph/2))/ph);
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
var _5e=this.pointToSgfCoord({x:x,y:y});
if(this.mode=="play"){
for(var i=0;i<this.variations.length;i++){
var _60=this.sgfCoordToPoint(this.variations[i].move);
if(_60.x==x&&_60.y==y){
this.variation(this.variations[i].treeNum);
_7(e);
return;
}
}
if(!this.rules.check({x:x,y:y},this.currentColor)){
return;
}
if(_5e){
var _61=this.cursor.getNextMoves();
if(_61&&_5e in _61){
this.variation(_61[_5e]);
}else{
this.createMove(_5e);
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
var _62;
var _63=this.board.getStone({x:x,y:y});
if(this.mode=="add_b"||this.mode=="add_w"){
this.cursor.node.emptyPoint(this.pointToSgfCoord({x:x,y:y}));
if(_63!=this.board.BLACK&&this.mode=="add_b"){
_62="AB";
}else{
if(_63!=this.board.WHITE&&this.mode=="add_w"){
_62="AW";
}else{
_62="AE";
}
}
}else{
switch(this.mode){
case "tr":
_62="TR";
break;
case "sq":
_62="SQ";
break;
case "cr":
_62="CR";
break;
case "x":
_62="MA";
break;
case "number":
_62="LB";
_5e=_5e+":"+this.labelLastNumber;
this.labelLastNumber++;
break;
case "letter":
_62="LB";
_5e=_5e+":"+this.labelLastLetter;
this.labelLastLetter=String.fromCharCode(this.labelLastLetter.charCodeAt(0)+1);
}
}
this.cursor.node.pushProperty(_62,_5e);
this.refresh();
}
}
},handleDocMouseUp:function(evt){
if(this.domLoading){
return;
}
if(this.mode=="region"&&this.regionBegun&&!this.regionClickSelect){
this.mouseDown=false;
this.regionBegun=false;
_a(this.dom.searchAlgo,"inline");
_a(this.dom.searchButton,"inline");
}
},boundsCheck:function(x,y,_67){
if(_67.length==2){
_67[3]=_67[2]=_67[1];
_67[1]=_67[0];
}
return (x>=_67[0]&&y>=_67[1]&&x<=_67[2]&&y<=_67[3]);
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
var _6c=this.getRegionBounds();
this.dom.searchRegion.style.top=(this.board.renderer.margin+this.board.renderer.pointHeight*_6c[0])+"px";
this.dom.searchRegion.style.left=(this.board.renderer.margin+this.board.renderer.pointWidth*_6c[1])+"px";
this.dom.searchRegion.style.width=this.board.renderer.pointWidth*_6c[2]+"px";
this.dom.searchRegion.style.height=this.board.renderer.pointHeight*_6c[3]+"px";
_a(this.dom.searchRegion);
},loadSearch:function(q,dim,p,a){
var _71={nodes:[],trees:[{nodes:[{SZ:this.board.boardSize}],trees:[]}]};
this.load(_71);
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
if(c=="O"){
c="AW";
}else{
if(c=="X"){
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
this.dom.searchAlgo.value=a;
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
var _7a=this.dom.searchAlgo.value;
var _7b=this.getRegionBounds();
var _7c=this.board.getRegion(_7b[0],_7b[1],_7b[2],_7b[3]);
var _7d=_7c.join("").replace(new RegExp(this.board.EMPTY,"g"),".").replace(new RegExp(this.board.BLACK,"g"),"X").replace(new RegExp(this.board.WHITE,"g"),"O");
var _7e=/^\.*$/.test(_7d);
var _7f=/^\.*O\.*$/.test(_7d);
var _80=/^\.*X\.*$/.test(_7d);
if(_7e||_7f||_80){
this.searching=false;
_a(this.dom.comments);
_b(this.dom.searchContainer);
this.prependComment(t["two stones"]);
return;
}
var _81=[];
if(_7b[0]==0){
_81.push("n");
}
if(_7b[1]==0){
_81.push("w");
}
if(_7b[0]+_7b[3]==this.board.boardSize){
_81.push("s");
}
if(_7b[1]+_7b[2]==this.board.boardSize){
_81.push("e");
}
if(_7a=="corner"&&!(_81.length==2&&((_81.contains("n")&&_81.contains("e"))||(_81.contains("n")&&_81.contains("w"))||(_81.contains("s")&&_81.contains("e"))||(_81.contains("s")&&_81.contains("w"))))){
this.searching=false;
_a(this.dom.comments);
_b(this.dom.searchContainer);
this.prependComment(t["two edges"]);
return;
}
var _82=(_81.contains("n")?"n":"s");
_82+=(_81.contains("w")?"w":"e");
this.showComments("");
this.nowLoading();
this.gameName="search";
var _83=function(req){
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
var _85=eval("("+req.responseText+")");
var _86;
var _87="";
var odd;
for(var i=0;_86=_85[i];i++){
odd=odd?false:true;
_87+="<a class='search-result"+(odd?" odd":"")+"' href='#'>                        <span class='id'>"+_86.id+"</span>                        <span class='mv'>"+_86.mv+"</span>                        <span class='pw'>"+_86.pw+" "+_86.wr+"</span>                        <span class='pb'>"+_86.pb+" "+_86.br+"</span>                        <span class='re'>"+_86.re+"</span>                        <span class='dt'>"+_86.dt+"</span>                        <div class='clear'>&nbsp;</div>                        </a>";
}
_a(this.dom.searchResultsContainer);
this.dom.searchResults.innerHTML=_87;
this.dom.searchCount.innerHTML=_85.length;
};
var _8a=function(req){
this.croak(t["error retrieving"]);
};
var _8c={q:_82,w:_7b[2],h:_7b[3],p:_7d,a:_7a,t:(new Date()).getTime()};
this.progressiveLoad=false;
this.progressiveUrl=null;
this.prefs.markNext=false;
this.prefs.showPlayerInfo=true;
this.hook("searchRegion",_8c);
_3("get",this.searchUrl,_8c,_83,_8a,this,45000);
},loadSearchResult:function(e){
this.nowLoading();
var _8e=e.target||e.srcElement;
if(_8e.nodeName=="SPAN"){
_8e=_8e.parentNode;
}
if(_8e.nodeName=="A"){
var _8f;
var id;
var mv;
for(var i=0;_8f=_8e.childNodes[i];i++){
if(_8f.className=="id"){
id=_8f.innerHTML;
}
if(_8f.className=="mv"){
mv=parseInt(_8f.innerHTML,10);
}
}
}
this.remoteLoad(id,null,true,[0,mv],function(){
this.doneLoading();
this.setPermalink();
}.bind(this));
_7(e);
},closeSearch:function(){
_b(this.dom.searchContainer);
_a(this.dom.comments);
},compressPattern:function(_93){
var c=null;
var pc="";
var n=1;
var ret="";
for(var i=0;i<_93.length;i++){
c=_93.charAt(i);
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
},uncompressPattern:function(_99){
var c=null;
var s=null;
var n="";
var ret="";
for(var i=0;i<_99.length;i++){
c=_99.charAt(i);
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
},createMove:function(_a0){
var _a1={};
_a1[this.currentColor]=_a0;
_a1["MN"]=(++this.moveNumber).toString();
var _a2=new eidogo.GameNode(_a1);
this.totalMoves++;
if(this.cursor.hasNext()){
if(this.cursor.node.nextSibling){
this.cursor.node.parent.createVariationTree(this.cursor.node.getPosition());
}
this.cursor.node.parent.appendTree(new eidogo.GameTree({nodes:[_a2],trees:[]}));
this.variation(this.cursor.node.parent.trees.length-1);
}else{
this.cursor.node.parent.appendNode(_a2);
this.variation();
}
},handleKeypress:function(e){
var _a4=e.keyCode||e.charCode;
if(!_a4||e.ctrlKey||e.altKey||e.metaKey){
return true;
}
var _a5=String.fromCharCode(_a4).toLowerCase();
for(var i=0;i<this.variations.length;i++){
var _a7=this.sgfCoordToPoint(this.variations[i].move);
var _a8=""+(i+1);
if(_a7.x!=null&&this.board.getMarker(_a7)!=this.board.EMPTY&&typeof this.board.getMarker(_a7)=="string"){
_a8=this.board.getMarker(_a7).toLowerCase();
}
_a8=_a8.replace(/^var:/,"");
if(_a5==_a8.charAt(0)){
this.variation(this.variations[i].treeNum);
_7(e);
return;
}
}
if(_a4==112||_a4==27){
this.selectTool("play");
}
var _a9=true;
switch(_a4){
case 32:
if(e.shiftKey){
this.back();
}else{
this.forward();
}
break;
case 39:
if(e.shiftKey){
var _aa=this.totalMoves-this.moveNumber;
var _ab=(_aa>9?9:_aa-1);
for(var i=0;i<_ab;i++){
this.forward(null,null,true);
}
}
this.forward();
break;
case 37:
if(e.shiftKey){
var _ab=(this.moveNumber>9?9:this.moveNumber-1);
for(var i=0;i<_ab;i++){
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
_a9=false;
break;
}
if(_a9){
_7(e);
}
},showInfo:function(){
this.dom.infoGame.innerHTML="";
this.dom.whiteName.innerHTML="";
this.dom.blackName.innerHTML="";
var _ac=this.gameTree.trees.first().nodes.first();
var dl=document.createElement("dl");
for(var _ae in this.infoLabels){
if(_ac[_ae]){
if(_ae=="PW"){
this.dom.whiteName.innerHTML=_ac[_ae]+(_ac["WR"]?", "+_ac["WR"]:"");
continue;
}else{
if(_ae=="PB"){
this.dom.blackName.innerHTML=_ac[_ae]+(_ac["BR"]?", "+_ac["BR"]:"");
continue;
}
}
if(_ae=="WR"||_ae=="BR"){
continue;
}
if(_ae=="DT"){
var _af=_ac[_ae].split(/[\.-]/);
if(_af.length==3){
_ac[_ae]=_af[2].replace(/^0+/,"")+" "+this.months[_af[1]-1]+" "+_af[0];
}
}
var dt=document.createElement("dt");
dt.innerHTML=this.infoLabels[_ae]+":";
var dd=document.createElement("dd");
dd.innerHTML=_ac[_ae];
dl.appendChild(dt);
dl.appendChild(dd);
}
}
if(this.prefs.showGameInfo){
this.dom.infoGame.appendChild(dl);
}
},selectTool:function(_b2){
var _b3;
if(_b2=="region"){
_b3="crosshair";
}else{
_b3="default";
this.regionBegun=false;
_b(this.dom.searchRegion);
_b(this.dom.searchButton);
_b(this.dom.searchAlgo);
}
this.board.renderer.domNode.style.cursor=_b3;
this.mode=_b2;
this.dom.toolsSelect.value=_b2;
},updateControls:function(){
this.dom.moveNumber.innerHTML=(this.moveNumber?t["move"]+" "+this.moveNumber:"permalink");
this.dom.whiteCaptures.innerHTML=t["captures"]+": <span>"+this.board.captures.W+"</span>";
this.dom.blackCaptures.innerHTML=t["captures"]+": <span>"+this.board.captures.B+"</span>";
this.dom.whiteTime.innerHTML=t["time left"]+": <span>"+(this.timeW?this.timeW:"--")+"</span>";
this.dom.blackTime.innerHTML=t["time left"]+": <span>"+(this.timeB?this.timeB:"--")+"</span>";
_9(this.dom.controlPass,"pass-on");
this.dom.variations.innerHTML="";
for(var i=0;i<this.variations.length;i++){
var _b5=i+1;
if(!this.variations[i].move||this.variations[i].move=="tt"){
_8(this.dom.controlPass,"pass-on");
}else{
var _b6=this.sgfCoordToPoint(this.variations[i].move);
if(this.board.getMarker(_b6)!=this.board.EMPTY){
_b5=this.board.getMarker(_b6);
}
if(this.prefs.markVariations){
this.board.addMarker(_b6,"var:"+_b5);
}
}
var _b7=document.createElement("div");
_b7.className="variation-nav";
_b7.innerHTML=_b5;
_4(_b7,"click",function(e,arg){
arg.me.variation(arg.treeNum);
},{me:this,treeNum:this.variations[i].treeNum});
this.dom.variations.appendChild(_b7);
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
},setColor:function(_ba){
this.prependComment(_ba=="B"?t["black to play"]:t["white to play"]);
this.currentColor=_ba;
},setMoveNumber:function(num){
this.moveNumber=num;
},playMove:function(_bc,_bd,_be){
_bd=_bd||this.currentColor;
this.currentColor=(_bd=="B"?"W":"B");
_bd=_bd=="W"?this.board.WHITE:this.board.BLACK;
var pt=this.sgfCoordToPoint(_bc);
if(!this.cursor.node["MN"]){
this.moveNumber++;
}
if(_bc&&_bc!="tt"){
this.board.addStone(pt,_bd);
this.rules.apply(pt,_bd);
if(this.prefs.markCurrent&&!_be){
this.addMarker(_bc,"current");
}
}else{
if(!_be){
this.prependComment((_bd==this.board.WHITE?t["white"]:t["black"])+" "+t["passed"],"comment-pass");
}
}
},addStone:function(_c0,_c1){
if(!(_c0 instanceof Array)){
_c0=[_c0];
}
_c0=this.expandCompressedPoints(_c0);
for(var i=0;i<_c0.length;i++){
this.board.addStone(this.sgfCoordToPoint(_c0[i]),_c1=="AW"?this.board.WHITE:_c1=="AB"?this.board.BLACK:this.board.EMPTY);
}
},addMarker:function(_c3,_c4){
if(!(_c3 instanceof Array)){
_c3=[_c3];
}
_c3=this.expandCompressedPoints(_c3);
var _c5;
for(var i=0;i<_c3.length;i++){
switch(_c4){
case "TR":
_c5="triangle";
break;
case "SQ":
_c5="square";
break;
case "CR":
_c5="circle";
break;
case "MA":
_c5="ex";
break;
case "TW":
_c5="territory-white";
break;
case "TB":
_c5="territory-black";
break;
case "LB":
_c5=(_c3[i].split(":"))[1];
_c3[i];
break;
default:
_c5=_c4;
break;
}
this.board.addMarker(this.sgfCoordToPoint((_c3[i].split(":"))[0]),_c5);
}
},showTime:function(_c7,_c8){
var tp=(_c8=="BL"||_c8=="OB"?"timeB":"timeW");
if(_c8=="BL"||_c8=="WL"){
var _ca=Math.floor(_c7/60);
var _cb=(_c7%60).toFixed(0);
_cb=(_cb<10?"0":"")+_cb;
this[tp]=_ca+":"+_cb+this[tp];
}else{
this[tp]+=" ("+_c7+")";
}
},showAnnotation:function(_cc,_cd){
var msg;
switch(_cd){
case "N":
msg=_cc;
break;
case "GB":
msg=(_cc>1?t["vgb"]:t["gb"]);
break;
case "GW":
msg=(_cc>1?t["vgw"]:t["gw"]);
break;
case "DM":
msg=(_cc>1?t["dmj"]:t["dm"]);
break;
case "UC":
msg=t["uc"];
break;
case "TE":
msg=t["te"];
break;
case "BM":
msg=(_cc>1?t["vbm"]:t["bm"]);
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
},showComments:function(_cf,_d0,_d1){
if(!_cf||_d1){
return;
}
this.dom.comments.innerHTML+=_cf.replace(/\n/g,"<br />");
},prependComment:function(_d2,cls){
cls=cls||"comment-status";
this.dom.comments.innerHTML="<div class='"+cls+"'>"+_d2+"</div>"+this.dom.comments.innerHTML;
},downloadSgf:function(evt){
_7(evt);
location.href=this.downloadUrl+this.gameName;
},save:function(evt){
_7(evt);
var _d6=function(req){
this.hook("saved",[req.responseText]);
};
var _d8=function(req){
this.croak(t["error retrieving"]);
};
var sgf=this.gameTree.trees.first().toSgf();
_3("POST",this.saveUrl,{sgf:sgf},_d6,_d8,this,30000);
},constructDom:function(){
this.dom.player=document.createElement("div");
this.dom.player.className="eidogo-player";
this.dom.player.id="player-"+this.uniq;
this.dom.container.appendChild(this.dom.player);
var _db="    \t        <div id='board-container' class='board-container with-coords'></div>    \t        <div id='controls-container' class='controls-container'>    \t            <ul id='controls' class='controls'>    \t                <li id='control-first' class='control first'>First</li>    \t                <li id='control-back' class='control back'>Back</li>    \t                <li id='control-forward' class='control forward'>Forward</li>    \t                <li id='control-last' class='control last'>Last</li>    \t                <li id='control-pass' class='control pass'>Pass</li>    \t            </ul>    \t            <div id='move-number' class='move-number'></div>    \t            <div id='nav-slider' class='nav-slider'>    \t                <div id='nav-slider-thumb' class='nav-slider-thumb'></div>    \t            </div>    \t            <div id='variations-container' class='variations-container'>    \t                <div id='variations-label' class='variations-label'>"+t["variations"]+":</div>    \t                <div id='variations' class='variations'></div>    \t            </div>    \t        </div>    \t        <div id='tools-container' class='tools-container'>                    <div id='tools-label' class='tools-label'>"+t["tool"]+":</div>                    <select id='tools-select' class='tools-select'>                        <option value='play'>"+t["play"]+"</option>                        <option value='add_b'>"+t["add_b"]+"</option>                        <option value='add_w'>"+t["add_w"]+"</option>                        "+(this.searchUrl?("<option value='region'>"+t["region"]+"</option>"):"")+"                        <option value='tr'>"+t["triangle"]+"</option>                        <option value='sq'>"+t["square"]+"</option>                        <option value='cr'>"+t["circle"]+"</option>                        <option value='x'>"+t["x"]+"</option>                        <option value='letter'>"+t["letter"]+"</option>                        <option value='number'>"+t["number"]+"</option>                    </select>                    <select id='search-algo' class='search-algo'>                        <option value='corner'>"+t["search corner"]+"</option>                        <option value='center'>"+t["search center"]+"</option>                    </select>                    <input type='button' id='search-button' class='search-button' value='"+t["search"]+"'>                </div>    \t        <div id='comments' class='comments'></div>    \t        <div id='search-container' class='search-container'>    \t            <div id='search-close' class='search-close'>close search</div>        \t        <p class='search-count'><span id='search-count'></span>&nbsp;matches found.</p>                    <div id='search-results-container' class='search-results-container'>                        <div class='search-result'>                            <span class='pw'><b>White</b></span>                            <span class='pb'><b>Black</b></span>                            <span class='re'><b>Result</b></span>                            <span class='dt'><b>Date</b></span>                            <div class='clear'></div>                        </div>                        <div id='search-results' class='search-results'></div>                    </div>    \t        </div>    \t        <div id='info' class='info'>    \t            <div id='info-players' class='players'>        \t            <div id='white' class='player white'>        \t                <div id='white-name' class='name'></div>        \t                <div id='white-captures' class='captures'></div>        \t                <div id='white-time' class='time'></div>        \t            </div>        \t            <div id='black' class='player black'>        \t                <div id='black-name' class='name'></div>        \t                <div id='black-captures' class='captures'></div>        \t                <div id='black-time' class='time'></div>        \t            </div>        \t        </div>    \t            <div id='info-game' class='game'></div>    \t        </div>    \t        <div id='options' class='options'>    \t            <a id='option-save' class='option-save' href='#' title='Save this game'>Save</a>    \t            <a id='option-download' class='option-download' href='#' title='Download this game as SGF'>Download SGF</a>    \t        </div>    \t        <div id='preferences' class='preferences'>    \t            <div><input type='checkbox'> Show variations on board</div>    \t            <div><input type='checkbox'> Mark current move</div>    \t        </div>    \t        <div id='footer' class='footer'></div>    \t    ";
_db=_db.replace(/ id='([^']+)'/g," id='$1-"+this.uniq+"'");
this.dom.player.innerHTML=_db;
var re=/ id='([^']+)-\d+'/g;
var _dd;
var id;
var _df;
while(_dd=re.exec(_db)){
id=_dd[0].replace(/'/g,"").replace(/ id=/,"");
_df="";
_dd[1].split("-").forEach(function(_e0,i){
_e0=i?_e0.charAt(0).toUpperCase()+_e0.substring(1):_e0;
_df+=_e0;
});
this.dom[_df]=_2(id);
}
this.dom.searchRegion=document.createElement("div");
this.dom.searchRegion.id="search-region-"+this.uniq;
this.dom.searchRegion.className="search-region";
this.dom.navSlider._width=this.dom.navSlider.offsetWidth;
this.dom.navSliderThumb._width=this.dom.navSliderThumb.offsetWidth;
[["moveNumber","setPermalink"],["controlFirst","first"],["controlBack","back"],["controlForward","forward"],["controlLast","last"],["controlPass","pass"],["searchButton","searchRegion"],["searchResults","loadSearchResult"],["searchClose","closeSearch"],["optionDownload","downloadSgf"],["optionSave","save"]].forEach(function(eh){
_5(this.dom[eh[0]],this[eh[1]],this);
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
var _e4=false;
var _e5=null;
_4(this.dom.navSlider,"mousedown",function(e){
_e4=true;
_7(e);
},this,true);
_4(document,"mousemove",function(e){
if(!_e4){
return;
}
var xy=_6(e,this.dom.navSlider);
clearTimeout(_e5);
_e5=setTimeout(function(){
this.updateNavSlider(xy[0]);
}.bind(this),10);
_7(e);
},this,true);
_4(document,"mouseup",function(e){
if(!_e4){
return;
}
_e4=false;
var xy=_6(e,this.dom.navSlider);
this.updateNavSlider(xy[0]);
},this,true);
},updateNavSlider:function(_eb){
var _ec=this.dom.navSlider._width-this.dom.navSliderThumb._width;
var _ed=this.totalMoves;
var _ee=!!_eb;
_eb=_eb||(this.moveNumber/_ed*_ec);
_eb=_eb>_ec?_ec:_eb;
_eb=_eb<0?0:_eb;
var _ef=parseInt(_eb/_ec*_ed,10);
if(_ee){
this.nowLoading();
var _f0=_ef-this.cursor.node.getPosition();
for(var i=0;i<Math.abs(_f0);i++){
if(_f0>0){
this.variation(null,true);
}else{
if(_f0<0){
this.cursor.previous();
this.moveNumber--;
}
}
}
if(_f0<0){
if(this.moveNumber<0){
this.moveNumber=0;
}
this.board.revert(Math.abs(_f0));
}
this.doneLoading();
this.refresh();
}
_eb=parseInt(_ef/_ed*_ec,10)||0;
this.dom.navSliderThumb.style.left=_eb+"px";
},resetLastLabels:function(){
this.labelLastNumber=1;
this.labelLastLetter="A";
},sgfCoordToPoint:function(_f2){
if(!_f2||_f2=="tt"){
return {x:null,y:null};
}
var _f3={a:0,b:1,c:2,d:3,e:4,f:5,g:6,h:7,i:8,j:9,k:10,l:11,m:12,n:13,o:14,p:15,q:16,r:17,s:18};
return {x:_f3[_f2.charAt(0)],y:_f3[_f2.charAt(1)]};
},pointToSgfCoord:function(pt){
if(!pt||!this.boundsCheck(pt.x,pt.y,[0,this.board.boardSize-1])){
return null;
}
var pts={0:"a",1:"b",2:"c",3:"d",4:"e",5:"f",6:"g",7:"h",8:"i",9:"j",10:"k",11:"l",12:"m",13:"n",14:"o",15:"p",16:"q",17:"r",18:"s"};
return pts[pt.x]+pts[pt.y];
},expandCompressedPoints:function(_f6){
var _f7;
var ul,lr;
var x,y;
var _fc=[];
var _fd=[];
for(var i=0;i<_f6.length;i++){
_f7=_f6[i].split(/:/);
if(_f7.length>1){
ul=this.sgfCoordToPoint(_f7[0]);
lr=this.sgfCoordToPoint(_f7[1]);
for(x=ul.x;x<=lr.x;x++){
for(y=ul.y;y<=lr.y;y++){
_fc.push(this.pointToSgfCoord({x:x,y:y}));
}
}
_fd.push(i);
}
}
_f6=_f6.concat(_fc);
return _f6;
},setPermalink:function(){
if(!this.gameName||this.gameName=="search"||this.gameName=="gnugo"||this.gameName=="url"){
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

