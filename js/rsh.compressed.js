/*
Copyright (c) 2007 Brian Dillard and Brad Neuberg:
Brian Dillard | Project Lead | bdillard@pathf.com | http://blogs.pathf.com/agileajax/
Brad Neuberg | Original Project Creator | http://codinginparadise.org
   
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
(the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
window.dhtmlHistory={isIE:false,isOpera:false,isSafari:false,isSafari3:false,isKonquerer:false,isGecko:false,isSupported:false,create:function(_1){
var _2=this;
var UA=navigator.userAgent.toLowerCase();
var _4=navigator.platform.toLowerCase();
var _5=navigator.vendor||"";
var _6=(UA.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[])[1];
if(_5==="KDE"){
this.isKonqueror=true;
this.isSupported=false;
}else{
if(typeof window.opera!=="undefined"){
this.isOpera=true;
this.isSupported=true;
}else{
if(typeof document.all!=="undefined"){
this.isIE=true;
this.isSupported=true;
}else{
if(_5.indexOf("Apple Computer, Inc.")>-1){
if(parseInt(_6,10)<420){
this.isSafari=true;
}else{
this.isSafari3=true;
}
this.isSupported=(_4.indexOf("mac")>-1);
}else{
if(UA.indexOf("gecko")!=-1){
this.isGecko=true;
this.isSupported=true;
}
}
}
}
}
window.historyStorage.setup(_1);
if(this.isSafari){
this.createSafari();
}else{
if(this.isOpera){
this.createOpera();
}
}
var _7=this.getCurrentLocation();
this.currentLocation=_7;
if(this.isIE){
this.createIE(_7);
}
var _8=function(){
_2.firstLoad=null;
};
this.addEventListener(window,"unload",_8);
if(this.isIE){
this.ignoreLocationChange=true;
}else{
if(!historyStorage.hasKey(this.PAGELOADEDSTRING)){
this.ignoreLocationChange=true;
this.firstLoad=true;
historyStorage.put(this.PAGELOADEDSTRING,true);
}else{
this.ignoreLocationChange=false;
this.fireOnNewListener=true;
}
}
var _9=function(){
_2.checkLocation();
};
setInterval(_9,100);
},initialize:function(){
if(this.isIE){
if(!historyStorage.hasKey(this.PAGELOADEDSTRING)){
this.fireOnNewListener=false;
this.firstLoad=true;
historyStorage.put(this.PAGELOADEDSTRING,true);
}else{
this.fireOnNewListener=true;
this.firstLoad=false;
}
}
},addListener:function(_a){
this.listener=_a;
if(this.fireOnNewListener){
this.fireHistoryEvent(this.currentLocation);
this.fireOnNewListener=false;
}
},addEventListener:function(o,e,l){
if(o.addEventListener){
o.addEventListener(e,l,false);
}else{
if(o.attachEvent){
o.attachEvent("on"+e,function(){
l(window.event);
});
}
}
},add:function(_e,_f){
if(this.isSafari){
_e=this.removeHash(_e);
historyStorage.put(_e,_f);
this.currentLocation=_e;
window.location.hash=_e;
this.putSafariState(_e);
}else{
var _10=this;
var _11=function(){
if(_10.currentWaitTime>0){
_10.currentWaitTime=_10.currentWaitTime-_10.waitTime;
}
_e=_10.removeHash(_e);
if(document.getElementById(_e)&&_10.debugMode){
var e="Exception: History locations can not have the same value as _any_ IDs that might be in the document,"+" due to a bug in IE; please ask the developer to choose a history location that does not match any HTML"+" IDs in this document. The following ID is already taken and cannot be a location: "+_e;
throw new Error(e);
}
historyStorage.put(_e,_f);
_10.ignoreLocationChange=true;
_10.ieAtomicLocationChange=true;
_10.currentLocation=_e;
window.location.hash=_e;
if(_10.isIE){
_10.iframe.src="blank.html?"+_e;
}
_10.ieAtomicLocationChange=false;
};
window.setTimeout(_11,this.currentWaitTime);
this.currentWaitTime=this.currentWaitTime+this.waitTime;
}
},isFirstLoad:function(){
return this.firstLoad;
},getVersion:function(){
return "0.6";
},getCurrentLocation:function(){
var r=(this.isSafari?this.getSafariState():this.getCurrentHash());
return r;
},getCurrentHash:function(){
var r=window.location.href;
var i=r.indexOf("#");
return (i>=0?r.substr(i+1):"");
},PAGELOADEDSTRING:"DhtmlHistory_pageLoaded",listener:null,waitTime:200,currentWaitTime:0,currentLocation:null,iframe:null,safariHistoryStartPoint:null,safariStack:null,safariLength:null,ignoreLocationChange:null,fireOnNewListener:null,firstLoad:null,ieAtomicLocationChange:null,createIE:function(_16){
this.waitTime=400;
var _17=(historyStorage.debugMode?"width: 800px;height:80px;border:1px solid black;":historyStorage.hideStyles);
var _18="rshHistoryFrame";
var _19="<iframe frameborder=\"0\" id=\""+_18+"\" style=\""+_17+"\" src=\"blank.html?"+_16+"\"></iframe>";
document.write(_19);
this.iframe=document.getElementById(_18);
},createOpera:function(){
this.waitTime=400;
var _1a="<img src=\"javascript:location.href='javascript:dhtmlHistory.checkLocation();';\" style=\""+historyStorage.hideStyles+"\" />";
document.write(_1a);
},createSafari:function(){
var _1b="rshSafariForm";
var _1c="rshSafariStack";
var _1d="rshSafariLength";
var _1e=historyStorage.debugMode?historyStorage.showStyles:historyStorage.hideStyles;
var _1f=(historyStorage.debugMode?"width:800px;height:20px;border:1px solid black;margin:0;padding:0;":historyStorage.hideStyles);
var _20="<form id=\""+_1b+"\" style=\""+_1e+"\">"+"<input type=\"text\" style=\""+_1f+"\" id=\""+_1c+"\" value=\"[]\"/>"+"<input type=\"text\" style=\""+_1f+"\" id=\""+_1d+"\" value=\"\"/>"+"</form>";
document.write(_20);
this.safariStack=document.getElementById(_1c);
this.safariLength=document.getElementById(_1d);
if(!historyStorage.hasKey(this.PAGELOADEDSTRING)){
this.safariHistoryStartPoint=history.length;
this.safariLength.value=this.safariHistoryStartPoint;
}else{
this.safariHistoryStartPoint=this.safariLength.value;
}
},getSafariStack:function(){
var r=this.safariStack.value;
return historyStorage.fromJSON(r);
},getSafariState:function(){
var _22=this.getSafariStack();
var _23=_22[history.length-this.safariHistoryStartPoint-1];
return _23;
},putSafariState:function(_24){
var _25=this.getSafariStack();
_25[history.length-this.safariHistoryStartPoint]=_24;
this.safariStack.value=historyStorage.toJSON(_25);
},fireHistoryEvent:function(_26){
var _27=historyStorage.get(_26);
this.listener.call(null,_26,_27);
},checkLocation:function(){
if(!this.isIE&&this.ignoreLocationChange){
this.ignoreLocationChange=false;
return;
}
if(!this.isIE&&this.ieAtomicLocationChange){
return;
}
var _28=this.getCurrentLocation();
if(_28==this.currentLocation){
return;
}
this.ieAtomicLocationChange=true;
if(this.isIE&&this.getIframeHash()!=_28){
this.iframe.src="blank.html?"+_28;
}else{
if(this.isIE){
return;
}
}
this.currentLocation=_28;
this.ieAtomicLocationChange=false;
this.fireHistoryEvent(_28);
},getIframeHash:function(){
var doc=this.iframe.contentWindow.document;
var _2a=String(doc.location.search);
if(_2a.length==1&&_2a.charAt(0)=="?"){
_2a="";
}else{
if(_2a.length>=2&&_2a.charAt(0)=="?"){
_2a=_2a.substring(1);
}
}
return _2a;
},removeHash:function(_2b){
var r;
if(_2b===null||_2b===undefined){
r=null;
}else{
if(_2b===""){
r="";
}else{
if(_2b.length==1&&_2b.charAt(0)=="#"){
r="";
}else{
if(_2b.length>1&&_2b.charAt(0)=="#"){
r=_2b.substring(1);
}else{
r=_2b;
}
}
}
}
return r;
},iframeLoaded:function(_2d){
if(this.ignoreLocationChange){
this.ignoreLocationChange=false;
return;
}
var _2e=String(_2d.search);
if(_2e.length==1&&_2e.charAt(0)=="?"){
_2e="";
}else{
if(_2e.length>=2&&_2e.charAt(0)=="?"){
_2e=_2e.substring(1);
}
}
window.location.hash=_2e;
this.fireHistoryEvent(_2e);
}};
window.historyStorage={setup:function(_2f){
if(typeof _2f!=="undefined"){
if(_2f.debugMode){
this.debugMode=_2f.debugMode;
}
if(_2f.toJSON){
this.toJSON=_2f.toJSON;
}
if(_2f.fromJSON){
this.fromJSON=_2f.fromJSON;
}
}
var _30="rshStorageForm";
var _31="rshStorageField";
var _32=this.debugMode?historyStorage.showStyles:historyStorage.hideStyles;
var _33=(historyStorage.debugMode?"width: 800px;height:80px;border:1px solid black;":historyStorage.hideStyles);
var _34="<form id=\""+_30+"\" style=\""+_32+"\">"+"<textarea id=\""+_31+"\" style=\""+_33+"\"></textarea>"+"</form>";
document.write(_34);
this.storageField=document.getElementById(_31);
if(typeof window.opera!=="undefined"){
this.storageField.focus();
}
},put:function(key,_36){
this.assertValidKey(key);
if(this.hasKey(key)){
this.remove(key);
}
this.storageHash[key]=_36;
this.saveHashTable();
},get:function(key){
this.assertValidKey(key);
this.loadHashTable();
var _38=this.storageHash[key];
if(_38===undefined){
_38=null;
}
return _38;
},remove:function(key){
this.assertValidKey(key);
this.loadHashTable();
delete this.storageHash[key];
this.saveHashTable();
},reset:function(){
this.storageField.value="";
this.storageHash={};
},hasKey:function(key){
this.assertValidKey(key);
this.loadHashTable();
return (typeof this.storageHash[key]!=="undefined");
},isValidKey:function(key){
return (typeof key==="string");
},showStyles:"border:0;margin:0;padding:0;",hideStyles:"left:-1000px;top:-1000px;width:1px;height:1px;border:0;position:absolute;",debugMode:false,storageHash:{},hashLoaded:false,storageField:null,assertValidKey:function(key){
var _3d=this.isValidKey(key);
if(!_3d&&this.debugMode){
throw new Error("Please provide a valid key for window.historyStorage. Invalid key = "+key+".");
}
},loadHashTable:function(){
if(!this.hashLoaded){
var _3e=this.storageField.value;
if(_3e!==""&&_3e!==null){
this.storageHash=this.fromJSON(_3e);
this.hashLoaded=true;
}
}
},saveHashTable:function(){
this.loadHashTable();
var _3f=this.toJSON(this.storageHash);
this.storageField.value=_3f;
},toJSON:function(o){
return o.toJSONString();
},fromJSON:function(s){
return s.parseJSON();
}};

