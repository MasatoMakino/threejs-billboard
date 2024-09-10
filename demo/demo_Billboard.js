(()=>{"use strict";var e,t,r,i={4397:(e,t,r)=>{var i=r(6753);class a{constructor(e,t,r,a){this.isInitGeometry=!1,this.updateScale=()=>{const e=this._target.material.map;if(null==e||null==e.image)return;const t=e.image;this.initGeometry(t);const r=this.calculateScale(t);this._target.scale.set(r.x,r.y,1)},this._target=e,this._imageScale=r,this.initDummyPlane(e);const n=this.getMaterial(e);n.visible=!1,this._target.material=n,this.textureLoaderPromise=new Promise(((e,r)=>{(new i.Tap).load(t,(t=>{t.minFilter=a.minFilter,t.colorSpace="srgb",n.map=t,n.needsUpdate=!0,n.visible=!0,this.updateScale(),e()}),void 0,(e=>{r(e)}))}))}getMaterial(e){const t={blending:i.NTi,depthTest:!0,transparent:!0};return e instanceof i.eaF?new i.V9B(t):new i.RoJ(t)}initDummyPlane(e){if(e instanceof i.eaF){const t=1e-7;e.geometry=new i.bdM(t,t)}}initGeometry(e){this._target instanceof i.eaF&&(this.isInitGeometry||(this._target.geometry=new i.bdM(e.width,e.height),this.isInitGeometry=!0))}calculateScale(e){return this._target instanceof i.kxk?{x:e.width*this._imageScale,y:e.height*this._imageScale}:{x:this._imageScale,y:this._imageScale}}get imageScale(){return this._imageScale}set imageScale(e){this._imageScale=e,this.updateScale()}}class n{static init(e){var t;return null!=e||(e={}),null!==(t=e.minFilter)&&void 0!==t||(e.minFilter=i.k6q),e}}class o extends i.kxk{constructor(e,t,r){super();const i=n.init(r);this.obj=new a(this,e,t,i)}get imageScale(){return this.obj.imageScale}set imageScale(e){this.obj.imageScale=e}}i.eaF,r(9027),i.gPd,new WeakMap,i.kxk,i.eaF;var s=r(3580);window.onload=()=>{(e=>{const t=new o("./map01.png",.1);e.add(t);const r=new o("./map01.png",.1);t.position.set(-30,0,0),e.add(r)})(function(e,t){const r=new i.Z58;!function(e){const t=new i.$p8(16777215,1);e.add(t)}(r);const a=function(e,t,r){const a=new i.ubm(45,t/r,1,400);return a.position.set(0,0,100),a.updateMatrixWorld(!1),e.add(a),a}(r,e,t),n=function(e,t){const r={canvas:document.getElementById("webgl-canvas"),antialias:!0},a=new i.JeP(r);return console.log("Three.js rev :",i.sPf),a.setClearColor(new i.Q1f(0)),a.setSize(e,t),a.setPixelRatio(window.devicePixelRatio),a}(e,t),o=function(e,t){const r=new s.N(e,t.domElement);return r.update(),r}(a,n);return function(e){const t=new i.IzY(30);e.add(t)}(r),function(e,t,r,i){const a=()=>{e.update(),t.render(r,i),requestAnimationFrame(a)};a()}(o,n,r,a),r}(640,480))}}},a={};function n(e){var t=a[e];if(void 0!==t)return t.exports;var r=a[e]={exports:{}};return i[e](r,r.exports,n),r.exports}n.m=i,e=[],n.O=(t,r,i,a)=>{if(!r){var o=1/0;for(u=0;u<e.length;u++){for(var[r,i,a]=e[u],s=!0,l=0;l<r.length;l++)(!1&a||o>=a)&&Object.keys(n.O).every((e=>n.O[e](r[l])))?r.splice(l--,1):(s=!1,a<o&&(o=a));if(s){e.splice(u--,1);var c=i();void 0!==c&&(t=c)}}return t}a=a||0;for(var u=e.length;u>0&&e[u-1][2]>a;u--)e[u]=e[u-1];e[u]=[r,i,a]},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.f={},n.e=e=>Promise.all(Object.keys(n.f).reduce(((t,r)=>(n.f[r](e,t),t)),[])),n.u=e=>e+".js",n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),t={},r="@masatomakino/threejs-billboard:",n.l=(e,i,a,o)=>{if(t[e])t[e].push(i);else{var s,l;if(void 0!==a)for(var c=document.getElementsByTagName("script"),u=0;u<c.length;u++){var d=c[u];if(d.getAttribute("src")==e||d.getAttribute("data-webpack")==r+a){s=d;break}}s||(l=!0,(s=document.createElement("script")).charset="utf-8",s.timeout=120,n.nc&&s.setAttribute("nonce",n.nc),s.setAttribute("data-webpack",r+a),s.src=e),t[e]=[i];var m=(r,i)=>{s.onerror=s.onload=null,clearTimeout(h);var a=t[e];if(delete t[e],s.parentNode&&s.parentNode.removeChild(s),a&&a.forEach((e=>e(i))),r)return r(i)},h=setTimeout(m.bind(null,void 0,{type:"timeout",target:s}),12e4);s.onerror=m.bind(null,s.onerror),s.onload=m.bind(null,s.onload),l&&document.head.appendChild(s)}},n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.j=450,(()=>{var e;n.g.importScripts&&(e=n.g.location+"");var t=n.g.document;if(!e&&t&&(t.currentScript&&"SCRIPT"===t.currentScript.tagName.toUpperCase()&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");if(r.length)for(var i=r.length-1;i>-1&&(!e||!/^http(s?):/.test(e));)e=r[i--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),n.p=e})(),(()=>{var e={450:0};n.f.j=(t,r)=>{var i=n.o(e,t)?e[t]:void 0;if(0!==i)if(i)r.push(i[2]);else{var a=new Promise(((r,a)=>i=e[t]=[r,a]));r.push(i[2]=a);var o=n.p+n.u(t),s=new Error;n.l(o,(r=>{if(n.o(e,t)&&(0!==(i=e[t])&&(e[t]=void 0),i)){var a=r&&("load"===r.type?"missing":r.type),o=r&&r.target&&r.target.src;s.message="Loading chunk "+t+" failed.\n("+a+": "+o+")",s.name="ChunkLoadError",s.type=a,s.request=o,i[1](s)}}),"chunk-"+t,t)}},n.O.j=t=>0===e[t];var t=(t,r)=>{var i,a,[o,s,l]=r,c=0;if(o.some((t=>0!==e[t]))){for(i in s)n.o(s,i)&&(n.m[i]=s[i]);if(l)var u=l(n)}for(t&&t(r);c<o.length;c++)a=o[c],n.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return n.O(u)},r=self.webpackChunk_masatomakino_threejs_billboard=self.webpackChunk_masatomakino_threejs_billboard||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var o=n.O(void 0,[121],(()=>n(4397)));o=n.O(o)})();