(()=>{"use strict";var t,e={9448:(t,e,s)=>{var i=s(6709),a=s(5554);class n extends i.xEZ{constructor(t,e){super(),this.onRequestFrame=t=>{this._needUpdateCanvas&&(this.update(),this._needUpdateCanvas=!1)},this.init(t,e)}init(t,e){this._app=new a.MxU({autoStart:!1,backgroundAlpha:0,forceCanvas:!0,width:t,height:e}),this.image=this._app.view,this.minFilter=i.wem,this._stage=this._app.stage,this.isStart=!1,this.start()}start(){this.isStart||(this.isStart=!0,a.vB5.shared.add(this.onRequestFrame))}stop(){this.isStart||(this.isStart=!1,a.vB5.shared.remove(this.onRequestFrame))}update(){this._app.render(),this.needsUpdate=!0}setNeedUpdate(){this._needUpdateCanvas=!0}get stage(){return this._stage}get domElement(){return this._app.view}}class r{constructor(t){this.isLookingCameraHorizontal=!1,this.cameraPos=new i.Pa4,this.worldPos=new i.Pa4,this.needUpdateWorldPosition=!1,this.lookCamera=(t,e,s,i,a,n)=>{this.isLookingCameraHorizontal&&(this.needUpdateWorldPosition&&(this.target.getWorldPosition(this.worldPos),this.needUpdateWorldPosition=!1),this.cameraPos.set(s.position.x,this.worldPos.y,s.position.z),this.target.lookAt(this.cameraPos))},this.target=t,this.target.getWorldPosition(this.worldPos),this.target.onBeforeRender=this.lookCamera}}class o extends i.Kj0{constructor(t,e,s){super(),this.initCanvas(t,e,s),this.geometry=new i.BKK(t,e),this.cameraChaser=new r(this)}initCanvas(t,e,s){const a=new n(t,e);this.material=new i.vBJ({map:a,blending:i.bdR,transparent:!0,depthTest:!0})}setVisible(t){(class{static setVisible(t,e){if(t.visible===e)return;t.visible=e;const s=t.material.map;null!=s&&(t.visible?s.start():s.stop())}}).setVisible(this,t)}getMap(){return this.material.map}get stage(){return this.getMap().stage}setNeedUpdate(){this.getMap().setNeedUpdate()}}var d=s(8012);var l=s(8936);const h=t=>{const e=new l.TCu;e.beginFill(16711680).drawRect(0,0,320,320).endFill(),t.stage.addChild(e);const s=new l.xvT("Hello World",{fontSize:48,fontFamily:"Arial",fill:"#ff7700"});t.stage.addChild(s),s.x=20,s.y=160,t.setNeedUpdate()};window.onload=()=>{(t=>{const e=(e,s,i)=>{const a=new o(320,320);return a.position.set(e,s,i),t.add(a),a.scale.set(.05,.05,1),h(a),a};e(-20,0,0),e(20,0,0).cameraChaser.isLookingCameraHorizontal=!0})(function(t,e){const s=new i.xsS;!function(t){const e=new i.Mig(16777215,1);t.add(e)}(s);const a=function(t,e,s){const a=new i.cPb(45,e/s,1,400);return a.position.set(0,0,100),a.updateMatrixWorld(!1),t.add(a),a}(s,t,e),n=function(t,e){const s={canvas:document.getElementById("webgl-canvas"),antialias:!0},a=new i.CP7(s);return a.setClearColor(new i.Ilk(0)),a.setSize(t,e),a.setPixelRatio(window.devicePixelRatio),a}(t,e),r=function(t,e){const s=new d.z(t,e.domElement);return s.update(),s}(a,n);return function(t){const e=new i.y8_(30);t.add(e)}(s),function(t,e,s,i){const a=()=>{t.update(),e.render(s,i),requestAnimationFrame(a)};a()}(r,n,s,a),s}(640,480))}}},s={};function i(t){var a=s[t];if(void 0!==a)return a.exports;var n=s[t]={id:t,loaded:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.loaded=!0,n.exports}i.m=e,t=[],i.O=(e,s,a,n)=>{if(!s){var r=1/0;for(h=0;h<t.length;h++){for(var[s,a,n]=t[h],o=!0,d=0;d<s.length;d++)(!1&n||r>=n)&&Object.keys(i.O).every((t=>i.O[t](s[d])))?s.splice(d--,1):(o=!1,n<r&&(r=n));if(o){t.splice(h--,1);var l=a();void 0!==l&&(e=l)}}return e}n=n||0;for(var h=t.length;h>0&&t[h-1][2]>n;h--)t[h]=t[h-1];t[h]=[s,a,n]},i.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return i.d(e,{a:e}),e},i.d=(t,e)=>{for(var s in e)i.o(e,s)&&!i.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})},i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),i.nmd=t=>(t.paths=[],t.children||(t.children=[]),t),i.j=957,(()=>{var t={957:0};i.O.j=e=>0===t[e];var e=(e,s)=>{var a,n,[r,o,d]=s,l=0;if(r.some((e=>0!==t[e]))){for(a in o)i.o(o,a)&&(i.m[a]=o[a]);if(d)var h=d(i)}for(e&&e(s);l<r.length;l++)n=r[l],i.o(t,n)&&t[n]&&t[n][0](),t[r[l]]=0;return i.O(h)},s=self.webpackChunkthreejs_billboard=self.webpackChunkthreejs_billboard||[];s.forEach(e.bind(null,0)),s.push=e.bind(null,s.push.bind(s))})();var a=i.O(void 0,[736],(()=>i(9448)));a=i.O(a)})();