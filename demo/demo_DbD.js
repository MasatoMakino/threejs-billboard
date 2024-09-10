(()=>{"use strict";var e,t,a,i={945:(e,t,a)=>{var i=a(6753);class r{constructor(e,t,a,r){this.isInitGeometry=!1,this.updateScale=()=>{const e=this._target.material.map;if(null==e||null==e.image)return;const t=e.image;this.initGeometry(t);const a=this.calculateScale(t);this._target.scale.set(a.x,a.y,1)},this._target=e,this._imageScale=a,this.initDummyPlane(e);const n=this.getMaterial(e);n.visible=!1,this._target.material=n,this.textureLoaderPromise=new Promise(((e,a)=>{(new i.Tap).load(t,(t=>{t.minFilter=r.minFilter,t.colorSpace="srgb",n.map=t,n.needsUpdate=!0,n.visible=!0,this.updateScale(),e()}),void 0,(e=>{a(e)}))}))}getMaterial(e){const t={blending:i.NTi,depthTest:!0,transparent:!0};return e instanceof i.eaF?new i.V9B(t):new i.RoJ(t)}initDummyPlane(e){if(e instanceof i.eaF){const t=1e-7;e.geometry=new i.bdM(t,t)}}initGeometry(e){this._target instanceof i.eaF&&(this.isInitGeometry||(this._target.geometry=new i.bdM(e.width,e.height),this.isInitGeometry=!0))}calculateScale(e){return this._target instanceof i.kxk?{x:e.width*this._imageScale,y:e.height*this._imageScale}:{x:this._imageScale,y:this._imageScale}}get imageScale(){return this._imageScale}set imageScale(e){this._imageScale=e,this.updateScale()}}class n{static init(e){var t;return null!=e||(e={}),null!==(t=e.minFilter)&&void 0!==t||(e.minFilter=i.k6q),e}}class o extends i.kxk{constructor(e,t,a){super();const i=n.init(a);this.obj=new r(this,e,t,i)}get imageScale(){return this.obj.imageScale}set imageScale(e){this.obj.imageScale=e}}i.eaF;class s{static getNonAttenuateScale(e,t){return s.getFovHeight(1,t)/e}static getFovHeight(e,t){const a=i.cj9.degToRad(t.fov/2);return Math.tan(a)*e*2}}a(9027),i.gPd,new WeakMap,i.kxk,i.eaF;var l=a(3580);let c,u;window.onload=()=>{const e=new i.Z58;!function(e){const t=new i.$p8(16777215,1);e.add(t)}(e);const t=function(e,t,a){const r=new i.ubm(45,t/a,1,400);return r.position.set(0,0,100),r.updateMatrixWorld(!1),e.add(r),r}(e,640,480),a=function(e,t){const a={canvas:document.getElementById("webgl-canvas"),antialias:!0},r=new i.JeP(a);return console.log("Three.js rev :",i.sPf),r.setClearColor(new i.Q1f(0)),r.setSize(e,t),r.setPixelRatio(window.devicePixelRatio),r}(640,480),r=function(e,t){const a=new l.N(e,t.domElement);return a.update(),a}(t,a);(function(e){const t=new i.IzY(30);e.add(t)})(e),((e,t,a)=>{const r=s.getNonAttenuateScale(t.getSize(new i.I9Y).height,a);c=new o("./map01.png",r),c.position.set(-40,0,0),e.add(c),c.material.sizeAttenuation=!1,u=new o("./map01.png",r),e.add(u),u.material.sizeAttenuation=!1})(e,a,t),function(e,t,a,i){const r=()=>{e.update(),t.render(a,i),requestAnimationFrame(r)};r()}(r,a,e,t)}}},r={};function n(e){var t=r[e];if(void 0!==t)return t.exports;var a=r[e]={exports:{}};return i[e](a,a.exports,n),a.exports}n.m=i,e=[],n.O=(t,a,i,r)=>{if(!a){var o=1/0;for(u=0;u<e.length;u++){for(var[a,i,r]=e[u],s=!0,l=0;l<a.length;l++)(!1&r||o>=r)&&Object.keys(n.O).every((e=>n.O[e](a[l])))?a.splice(l--,1):(s=!1,r<o&&(o=r));if(s){e.splice(u--,1);var c=i();void 0!==c&&(t=c)}}return t}r=r||0;for(var u=e.length;u>0&&e[u-1][2]>r;u--)e[u]=e[u-1];e[u]=[a,i,r]},n.d=(e,t)=>{for(var a in t)n.o(t,a)&&!n.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},n.f={},n.e=e=>Promise.all(Object.keys(n.f).reduce(((t,a)=>(n.f[a](e,t),t)),[])),n.u=e=>e+".js",n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),t={},a="@masatomakino/threejs-billboard:",n.l=(e,i,r,o)=>{if(t[e])t[e].push(i);else{var s,l;if(void 0!==r)for(var c=document.getElementsByTagName("script"),u=0;u<c.length;u++){var d=c[u];if(d.getAttribute("src")==e||d.getAttribute("data-webpack")==a+r){s=d;break}}s||(l=!0,(s=document.createElement("script")).charset="utf-8",s.timeout=120,n.nc&&s.setAttribute("nonce",n.nc),s.setAttribute("data-webpack",a+r),s.src=e),t[e]=[i];var m=(a,i)=>{s.onerror=s.onload=null,clearTimeout(g);var r=t[e];if(delete t[e],s.parentNode&&s.parentNode.removeChild(s),r&&r.forEach((e=>e(i))),a)return a(i)},g=setTimeout(m.bind(null,void 0,{type:"timeout",target:s}),12e4);s.onerror=m.bind(null,s.onerror),s.onload=m.bind(null,s.onload),l&&document.head.appendChild(s)}},n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.j=929,(()=>{var e;n.g.importScripts&&(e=n.g.location+"");var t=n.g.document;if(!e&&t&&(t.currentScript&&"SCRIPT"===t.currentScript.tagName.toUpperCase()&&(e=t.currentScript.src),!e)){var a=t.getElementsByTagName("script");if(a.length)for(var i=a.length-1;i>-1&&(!e||!/^http(s?):/.test(e));)e=a[i--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),n.p=e})(),(()=>{var e={929:0};n.f.j=(t,a)=>{var i=n.o(e,t)?e[t]:void 0;if(0!==i)if(i)a.push(i[2]);else{var r=new Promise(((a,r)=>i=e[t]=[a,r]));a.push(i[2]=r);var o=n.p+n.u(t),s=new Error;n.l(o,(a=>{if(n.o(e,t)&&(0!==(i=e[t])&&(e[t]=void 0),i)){var r=a&&("load"===a.type?"missing":a.type),o=a&&a.target&&a.target.src;s.message="Loading chunk "+t+" failed.\n("+r+": "+o+")",s.name="ChunkLoadError",s.type=r,s.request=o,i[1](s)}}),"chunk-"+t,t)}},n.O.j=t=>0===e[t];var t=(t,a)=>{var i,r,[o,s,l]=a,c=0;if(o.some((t=>0!==e[t]))){for(i in s)n.o(s,i)&&(n.m[i]=s[i]);if(l)var u=l(n)}for(t&&t(a);c<o.length;c++)r=o[c],n.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return n.O(u)},a=self.webpackChunk_masatomakino_threejs_billboard=self.webpackChunk_masatomakino_threejs_billboard||[];a.forEach(t.bind(null,0)),a.push=t.bind(null,a.push.bind(a))})();var o=n.O(void 0,[121],(()=>n(945)));o=n.O(o)})();