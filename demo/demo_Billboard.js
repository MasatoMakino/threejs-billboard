(()=>{"use strict";var e,t={2207:(e,t,i)=>{var n=i(6709);class a{constructor(e,t,i,a){this.isInitGeometry=!1,this.updateScale=()=>{const e=this._target.material.map;if(null==e||null==e.image)return;const t=e.image;this.initGeometry(t);const i=this.calculateScale(t);this._target.scale.set(i.x,i.y,1)},this._target=e,this._imageScale=i,this.initDummyPlane(e);const r=this.getMaterial(e);r.visible=!1,this._target.material=r,(new n.dpR).load(t,(e=>{e.minFilter=a.minFilter,r.map=e,r.needsUpdate=!0,r.visible=!0,this.updateScale()}))}getMaterial(e){return e instanceof n.Kj0?new n.vBJ({blending:n.bdR,depthTest:!0,transparent:!0}):e instanceof n.jyi?new n.xeV({blending:n.bdR,depthTest:!0,transparent:!0}):void 0}initDummyPlane(e){if(e instanceof n.Kj0){const t=1e-7;e.geometry=new n.BKK(t,t)}}initGeometry(e){this._target instanceof n.Kj0&&(this.isInitGeometry||(this._target.geometry=new n.BKK(e.width,e.height),this.isInitGeometry=!0))}calculateScale(e){return this._target instanceof n.jyi?{x:e.width*this._imageScale,y:e.height*this._imageScale}:this._target instanceof n.Kj0?{x:this._imageScale,y:this._imageScale}:void 0}get imageScale(){return this._imageScale}set imageScale(e){this._imageScale=e,this.updateScale()}}class r extends n.jyi{constructor(e,t,i){super(),i=class{static init(e){return null==e&&(e={}),null==e.minFilter&&(e.minFilter=n.wem),e}}.init(i),this.obj=new a(this,e,t,i)}get imageScale(){return this.obj.imageScale}set imageScale(e){this.obj.imageScale=e}}i(5554);var s=i(8012);window.onload=()=>{(e=>{const t=new r("./map01.png",.1);e.add(t);const i=new r("./map01.png",.1);t.position.set(-30,0,0),e.add(i)})(function(e,t){const i=new n.xsS;!function(e){const t=new n.Mig(16777215,1);e.add(t)}(i);const a=function(e,t,i){const a=new n.cPb(45,t/i,1,400);return a.position.set(0,0,100),a.updateMatrixWorld(!1),e.add(a),a}(i,e,t),r=function(e,t){const i={canvas:document.getElementById("webgl-canvas"),antialias:!0},a=new n.CP7(i);return a.setClearColor(new n.Ilk(0)),a.setSize(e,t),a.setPixelRatio(window.devicePixelRatio),a}(e,t),o=function(e,t){const i=new s.z(e,t.domElement);return i.update(),i}(a,r);return function(e){const t=new n.y8_(30);e.add(t)}(i),function(e,t,i,n){const a=()=>{e.update(),t.render(i,n),requestAnimationFrame(a)};a()}(o,r,i,a),i}(640,480))}}},i={};function n(e){var a=i[e];if(void 0!==a)return a.exports;var r=i[e]={id:e,loaded:!1,exports:{}};return t[e].call(r.exports,r,r.exports,n),r.loaded=!0,r.exports}n.m=t,e=[],n.O=(t,i,a,r)=>{if(!i){var s=1/0;for(d=0;d<e.length;d++){for(var[i,a,r]=e[d],o=!0,l=0;l<i.length;l++)(!1&r||s>=r)&&Object.keys(n.O).every((e=>n.O[e](i[l])))?i.splice(l--,1):(o=!1,r<s&&(s=r));if(o){e.splice(d--,1);var c=a();void 0!==c&&(t=c)}}return t}r=r||0;for(var d=e.length;d>0&&e[d-1][2]>r;d--)e[d]=e[d-1];e[d]=[i,a,r]},n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var i in t)n.o(t,i)&&!n.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),n.j=797,(()=>{var e={797:0};n.O.j=t=>0===e[t];var t=(t,i)=>{var a,r,[s,o,l]=i,c=0;if(s.some((t=>0!==e[t]))){for(a in o)n.o(o,a)&&(n.m[a]=o[a]);if(l)var d=l(n)}for(t&&t(i);c<s.length;c++)r=s[c],n.o(e,r)&&e[r]&&e[r][0](),e[s[c]]=0;return n.O(d)},i=self.webpackChunkthreejs_billboard=self.webpackChunkthreejs_billboard||[];i.forEach(t.bind(null,0)),i.push=t.bind(null,i.push.bind(i))})();var a=n.O(void 0,[736],(()=>n(2207)));a=n.O(a)})();