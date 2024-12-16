"use strict";(self.webpackChunk_masatomakino_threejs_billboard=self.webpackChunk_masatomakino_threejs_billboard||[]).push([[647],{6563:(t,e,n)=>{n.d(e,{a:()=>a});var r=n(3804);const i=["precision mediump float;","void main(void){","float test = 0.1;","%forloop%","gl_FragColor = vec4(0.0);","}"].join("\n");function s(t){let e="";for(let n=0;n<t;++n)n>0&&(e+="\nelse "),n<t-1&&(e+=`if(test == ${n}.0){}`);return e}let o=null;function a(){if(o)return o;const t=(0,r.W)();return o=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),o=function(t,e){if(0===t)throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");const n=e.createShader(e.FRAGMENT_SHADER);try{for(;;){const r=i.replace(/%forloop%/gi,s(t));if(e.shaderSource(n,r),e.compileShader(n),e.getShaderParameter(n,e.COMPILE_STATUS))break;t=t/2|0}}finally{e.deleteShader(n)}return t}(o,t),t.getExtension("WEBGL_lose_context")?.loseContext(),o}},1159:(t,e,n)=>{n.d(e,{J:()=>C});var r=n(8507),i=n(133),s=n(1460),o=n(6736),a=n(8639),u=n(6563);class l{constructor(){this.ids=Object.create(null),this.textures=[],this.count=0}clear(){for(let t=0;t<this.count;t++){const e=this.textures[t];this.textures[t]=null,this.ids[e.uid]=null}this.count=0}}class c{constructor(){this.renderPipeId="batch",this.action="startBatch",this.start=0,this.size=0,this.textures=new l,this.blendMode="normal",this.topology="triangle-strip",this.canBundle=!0}destroy(){this.textures=null,this.gpuBindGroup=null,this.bindGroup=null,this.batcher=null}}const d=[];let h=0;function f(){return h>0?d[--h]:new c}function m(t){d[h++]=t}let p=0;const x=class t{constructor(e={}){this.uid=(0,i.L)("batcher"),this.dirty=!0,this.batchIndex=0,this.batches=[],this._elements=[],t.defaultOptions.maxTextures=t.defaultOptions.maxTextures??(0,u.a)(),e={...t.defaultOptions,...e};const{maxTextures:n,attributesInitialSize:r,indicesInitialSize:o}=e;this.attributeBuffer=new s.u(4*r),this.indexBuffer=new Uint16Array(o),this.maxTextures=n}begin(){this.elementSize=0,this.elementStart=0,this.indexSize=0,this.attributeSize=0;for(let t=0;t<this.batchIndex;t++)m(this.batches[t]);this.batchIndex=0,this._batchIndexStart=0,this._batchIndexSize=0,this.dirty=!0}add(t){this._elements[this.elementSize++]=t,t._indexStart=this.indexSize,t._attributeStart=this.attributeSize,t._batcher=this,this.indexSize+=t.indexSize,this.attributeSize+=t.attributeSize*this.vertexSize}checkAndUpdateTexture(t,e){const n=t._batch.textures.ids[e._source.uid];return!(!n&&0!==n||(t._textureId=n,t.texture=e,0))}updateElement(t){this.dirty=!0;const e=this.attributeBuffer;t.packAsQuad?this.packQuadAttributes(t,e.float32View,e.uint32View,t._attributeStart,t._textureId):this.packAttributes(t,e.float32View,e.uint32View,t._attributeStart,t._textureId)}break(t){const e=this._elements;if(!e[this.elementStart])return;let n=f(),r=n.textures;r.clear();const i=e[this.elementStart];let s=(0,a.i)(i.blendMode,i.texture._source),o=i.topology;4*this.attributeSize>this.attributeBuffer.size&&this._resizeAttributeBuffer(4*this.attributeSize),this.indexSize>this.indexBuffer.length&&this._resizeIndexBuffer(this.indexSize);const u=this.attributeBuffer.float32View,l=this.attributeBuffer.uint32View,c=this.indexBuffer;let d=this._batchIndexSize,h=this._batchIndexStart,m="startBatch";const x=this.maxTextures;for(let i=this.elementStart;i<this.elementSize;++i){const g=e[i];e[i]=null;const b=g.texture._source,v=(0,a.i)(g.blendMode,b),_=s!==v||o!==g.topology;b._batchTick!==p||_?(b._batchTick=p,(r.count>=x||_)&&(this._finishBatch(n,h,d-h,r,s,o,t,m),m="renderBatch",h=d,s=v,o=g.topology,n=f(),r=n.textures,r.clear(),++p),g._textureId=b._textureBindLocation=r.count,r.ids[b.uid]=r.count,r.textures[r.count++]=b,g._batch=n,d+=g.indexSize,g.packAsQuad?(this.packQuadAttributes(g,u,l,g._attributeStart,g._textureId),this.packQuadIndex(c,g._indexStart,g._attributeStart/this.vertexSize)):(this.packAttributes(g,u,l,g._attributeStart,g._textureId),this.packIndex(g,c,g._indexStart,g._attributeStart/this.vertexSize))):(g._textureId=b._textureBindLocation,d+=g.indexSize,g.packAsQuad?(this.packQuadAttributes(g,u,l,g._attributeStart,g._textureId),this.packQuadIndex(c,g._indexStart,g._attributeStart/this.vertexSize)):(this.packAttributes(g,u,l,g._attributeStart,g._textureId),this.packIndex(g,c,g._indexStart,g._attributeStart/this.vertexSize)),g._batch=n)}r.count>0&&(this._finishBatch(n,h,d-h,r,s,o,t,m),h=d,++p),this.elementStart=this.elementSize,this._batchIndexStart=h,this._batchIndexSize=d}_finishBatch(t,e,n,r,i,s,o,a){t.gpuBindGroup=null,t.bindGroup=null,t.action=a,t.batcher=this,t.textures=r,t.blendMode=i,t.topology=s,t.start=e,t.size=n,++p,this.batches[this.batchIndex++]=t,o.add(t)}finish(t){this.break(t)}ensureAttributeBuffer(t){4*t<=this.attributeBuffer.size||this._resizeAttributeBuffer(4*t)}ensureIndexBuffer(t){t<=this.indexBuffer.length||this._resizeIndexBuffer(t)}_resizeAttributeBuffer(t){const e=Math.max(t,2*this.attributeBuffer.size),n=new s.u(e);(0,o.W)(this.attributeBuffer.rawBinaryData,n.rawBinaryData),this.attributeBuffer=n}_resizeIndexBuffer(t){const e=this.indexBuffer;let n=Math.max(t,1.5*e.length);n+=n%2;const r=n>65535?new Uint32Array(n):new Uint16Array(n);if(r.BYTES_PER_ELEMENT!==e.BYTES_PER_ELEMENT)for(let t=0;t<e.length;t++)r[t]=e[t];else(0,o.W)(e.buffer,r.buffer);this.indexBuffer=r}packQuadIndex(t,e,n){t[e]=n+0,t[e+1]=n+1,t[e+2]=n+2,t[e+3]=n+0,t[e+4]=n+2,t[e+5]=n+3}packIndex(t,e,n,r){const i=t.indices,s=t.indexSize,o=t.indexOffset,a=t.attributeOffset;for(let t=0;t<s;t++)e[n++]=r+i[t+o]-a}destroy(){for(let t=0;t<this.batches.length;t++)m(this.batches[t]);this.batches=null;for(let t=0;t<this._elements.length;t++)this._elements[t]._batch=null;this._elements=null,this.indexBuffer=null,this.attributeBuffer.destroy(),this.attributeBuffer=null}};x.defaultOptions={maxTextures:null,attributesInitialSize:4,indicesInitialSize:6};let g=x;var b=n(949),v=n(1132),_=n(6011);const y=new Float32Array(1),S=new Uint32Array(1);class w extends _.V{constructor(){const t=new b.h({data:y,label:"attribute-batch-buffer",usage:v.S.VERTEX|v.S.COPY_DST,shrinkToFit:!1});super({attributes:{aPosition:{buffer:t,format:"float32x2",stride:24,offset:0},aUV:{buffer:t,format:"float32x2",stride:24,offset:8},aColor:{buffer:t,format:"unorm8x4",stride:24,offset:16},aTextureIdAndRound:{buffer:t,format:"uint16x2",stride:24,offset:20}},indexBuffer:new b.h({data:S,label:"index-batch-buffer",usage:v.S.INDEX|v.S.COPY_DST,shrinkToFit:!1})})}}var A=n(5611),E=n(4459),T=n(4e3),I=n(6665),P=n(6040),z=n(8475);class M extends z.M{constructor(t){super({glProgram:(0,A.I)({name:"batch",bits:[E.a,(0,T.P)(t),I.m]}),gpuProgram:(0,A.v)({name:"batch",bits:[E.F,(0,T._)(t),I.b]}),resources:{batchSamplers:(0,P.n)(t)}})}}let B=null;const V=class t extends g{constructor(){super(...arguments),this.geometry=new w,this.shader=B||(B=new M(this.maxTextures)),this.name=t.extension.name,this.vertexSize=6}packAttributes(t,e,n,r,i){const s=i<<16|65535&t.roundPixels,o=t.transform,a=o.a,u=o.b,l=o.c,c=o.d,d=o.tx,h=o.ty,{positions:f,uvs:m}=t,p=t.color,x=t.attributeOffset,g=x+t.attributeSize;for(let t=x;t<g;t++){const i=2*t,o=f[i],x=f[i+1];e[r++]=a*o+l*x+d,e[r++]=c*x+u*o+h,e[r++]=m[i],e[r++]=m[i+1],n[r++]=p,n[r++]=s}}packQuadAttributes(t,e,n,r,i){const s=t.texture,o=t.transform,a=o.a,u=o.b,l=o.c,c=o.d,d=o.tx,h=o.ty,f=t.bounds,m=f.maxX,p=f.minX,x=f.maxY,g=f.minY,b=s.uvs,v=t.color,_=i<<16|65535&t.roundPixels;e[r+0]=a*p+l*g+d,e[r+1]=c*g+u*p+h,e[r+2]=b.x0,e[r+3]=b.y0,n[r+4]=v,n[r+5]=_,e[r+6]=a*m+l*g+d,e[r+7]=c*g+u*m+h,e[r+8]=b.x1,e[r+9]=b.y1,n[r+10]=v,n[r+11]=_,e[r+12]=a*m+l*x+d,e[r+13]=c*x+u*m+h,e[r+14]=b.x2,e[r+15]=b.y2,n[r+16]=v,n[r+17]=_,e[r+18]=a*p+l*x+d,e[r+19]=c*x+u*p+h,e[r+20]=b.x3,e[r+21]=b.y3,n[r+22]=v,n[r+23]=_}};V.extension={type:[r.Ag.Batcher],name:"default"};let C=V},5611:(t,e,n)=>{n.d(e,{I:()=>T,v:()=>E});var r=n(9113),i=n(3012),s=n(268);function o(t,e,n){if(t)for(const r in t){const i=e[r.toLocaleLowerCase()];if(i){let e=t[r];"header"===r&&(e=e.replace(/@in\s+[^;]+;\s*/g,"").replace(/@out\s+[^;]+;\s*/g,"")),n&&i.push(`//----${n}----//`),i.push(e)}else(0,s.R)(`${r} placement hook does not exist in shader`)}}const a=/\{\{(.*?)\}\}/g;function u(t){const e={};return(t.match(a)?.map((t=>t.replace(/[{()}]/g,"")))??[]).forEach((t=>{e[t]=[]})),e}function l(t,e){let n;const r=/@in\s+([^;]+);/g;for(;null!==(n=r.exec(t));)e.push(n[1])}function c(t,e,n=!1){const r=[];l(e,r),t.forEach((t=>{t.header&&l(t.header,r)}));const i=r;n&&i.sort();const s=i.map(((t,e)=>`       @location(${e}) ${t},`)).join("\n");let o=e.replace(/@in\s+[^;]+;\s*/g,"");return o=o.replace("{{in}}",`\n${s}\n`),o}function d(t,e){let n;const r=/@out\s+([^;]+);/g;for(;null!==(n=r.exec(t));)e.push(n[1])}function h(t,e){let n=t;for(const t in e){const r=e[t];n=r.join("\n").length?n.replace(`{{${t}}}`,`//-----${t} START-----//\n${r.join("\n")}\n//----${t} FINISH----//`):n.replace(`{{${t}}}`,"")}return n}const f=Object.create(null),m=new Map;let p=0;function x({template:t,bits:e}){const n=g(t,e);return f[n]||(f[n]=b(t.vertex,t.fragment,e)),f[n]}function g(t,e){return e.map((t=>(m.has(t)||m.set(t,p++),m.get(t)))).sort(((t,e)=>t-e)).join("-")+t.vertex+t.fragment}function b(t,e,n){const r=u(t),i=u(e);return n.forEach((t=>{o(t.vertex,r,t.name),o(t.fragment,i,t.name)})),{vertex:h(t,r),fragment:h(e,i)}}const v="\n    @in aPosition: vec2<f32>;\n    @in aUV: vec2<f32>;\n\n    @out @builtin(position) vPosition: vec4<f32>;\n    @out vUV : vec2<f32>;\n    @out vColor : vec4<f32>;\n\n    {{header}}\n\n    struct VSOutput {\n        {{struct}}\n    };\n\n    @vertex\n    fn main( {{in}} ) -> VSOutput {\n\n        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;\n        var modelMatrix = mat3x3<f32>(\n            1.0, 0.0, 0.0,\n            0.0, 1.0, 0.0,\n            0.0, 0.0, 1.0\n          );\n        var position = aPosition;\n        var uv = aUV;\n\n        {{start}}\n        \n        vColor = vec4<f32>(1., 1., 1., 1.);\n\n        {{main}}\n\n        vUV = uv;\n\n        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;\n\n        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);\n       \n        vColor *= globalUniforms.uWorldColorAlpha;\n\n        {{end}}\n\n        {{return}}\n    };\n",_="\n    @in vUV : vec2<f32>;\n    @in vColor : vec4<f32>;\n   \n    {{header}}\n\n    @fragment\n    fn main(\n        {{in}}\n      ) -> @location(0) vec4<f32> {\n        \n        {{start}}\n\n        var outColor:vec4<f32>;\n      \n        {{main}}\n        \n        var finalColor:vec4<f32> = outColor * vColor;\n\n        {{end}}\n\n        return finalColor;\n      };\n",y="\n    in vec2 aPosition;\n    in vec2 aUV;\n\n    out vec4 vColor;\n    out vec2 vUV;\n\n    {{header}}\n\n    void main(void){\n\n        mat3 worldTransformMatrix = uWorldTransformMatrix;\n        mat3 modelMatrix = mat3(\n            1.0, 0.0, 0.0,\n            0.0, 1.0, 0.0,\n            0.0, 0.0, 1.0\n          );\n        vec2 position = aPosition;\n        vec2 uv = aUV;\n        \n        {{start}}\n        \n        vColor = vec4(1.);\n        \n        {{main}}\n        \n        vUV = uv;\n        \n        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;\n\n        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n\n        vColor *= uWorldColorAlpha;\n\n        {{end}}\n    }\n",S="\n   \n    in vec4 vColor;\n    in vec2 vUV;\n\n    out vec4 finalColor;\n\n    {{header}}\n\n    void main(void) {\n        \n        {{start}}\n\n        vec4 outColor;\n      \n        {{main}}\n        \n        finalColor = outColor * vColor;\n        \n        {{end}}\n    }\n",w={name:"global-uniforms-bit",vertex:{header:"\n        struct GlobalUniforms {\n            uProjectionMatrix:mat3x3<f32>,\n            uWorldTransformMatrix:mat3x3<f32>,\n            uWorldColorAlpha: vec4<f32>,\n            uResolution: vec2<f32>,\n        }\n\n        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;\n        "}},A={name:"global-uniforms-bit",vertex:{header:"\n          uniform mat3 uProjectionMatrix;\n          uniform mat3 uWorldTransformMatrix;\n          uniform vec4 uWorldColorAlpha;\n          uniform vec2 uResolution;\n        "}};function E({bits:t,name:e}){const n=function({template:t,bits:e}){const n=g(t,e);if(f[n])return f[n];const{vertex:r,fragment:i}=function(t,e){const n=e.map((t=>t.vertex)).filter((t=>!!t)),r=e.map((t=>t.fragment)).filter((t=>!!t));let i=c(n,t.vertex,!0);return i=function(t,e){const n=[];d(e,n),t.forEach((t=>{t.header&&d(t.header,n)}));let r=0;const i=n.sort().map((t=>t.indexOf("builtin")>-1?t:`@location(${r++}) ${t}`)).join(",\n"),s=n.sort().map((t=>{return`       var ${e=t,e.replace(/@.*?\s+/g,"")};`;var e})).join("\n"),o=`return VSOutput(\n            ${n.sort().map((t=>` ${function(t){const e=/\b(\w+)\s*:/g.exec(t);return e?e[1]:""}(t)}`)).join(",\n")});`;let a=e.replace(/@out\s+[^;]+;\s*/g,"");return a=a.replace("{{struct}}",`\n${i}\n`),a=a.replace("{{start}}",`\n${s}\n`),a=a.replace("{{return}}",`\n${o}\n`),a}(n,i),{vertex:i,fragment:c(r,t.fragment,!0)}}(t,e);return f[n]=b(r,i,e),f[n]}({template:{fragment:_,vertex:v},bits:[w,...t]});return i.B.from({name:e,vertex:{source:n.vertex,entryPoint:"main"},fragment:{source:n.fragment,entryPoint:"main"}})}function T({bits:t,name:e}){return new r.M({name:e,...x({template:{vertex:y,fragment:S},bits:[A,...t]})})}},4459:(t,e,n)=>{n.d(e,{F:()=>r,a:()=>i});const r={name:"color-bit",vertex:{header:"\n            @in aColor: vec4<f32>;\n        ",main:"\n            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);\n        "}},i={name:"color-bit",vertex:{header:"\n            in vec4 aColor;\n        ",main:"\n            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);\n        "}}},4e3:(t,e,n)=>{n.d(e,{P:()=>l,_:()=>o});const r={};function i(t){const e=[];if(1===t)e.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"),e.push("@group(1) @binding(1) var textureSampler1: sampler;");else{let n=0;for(let r=0;r<t;r++)e.push(`@group(1) @binding(${n++}) var textureSource${r+1}: texture_2d<f32>;`),e.push(`@group(1) @binding(${n++}) var textureSampler${r+1}: sampler;`)}return e.join("\n")}function s(t){const e=[];if(1===t)e.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");else{e.push("switch vTextureId {");for(let n=0;n<t;n++)n===t-1?e.push("  default:{"):e.push(`  case ${n}:{`),e.push(`      outColor = textureSampleGrad(textureSource${n+1}, textureSampler${n+1}, vUV, uvDx, uvDy);`),e.push("      break;}");e.push("}")}return e.join("\n")}function o(t){return r[t]||(r[t]={name:"texture-batch-bit",vertex:{header:"\n                @in aTextureIdAndRound: vec2<u32>;\n                @out @interpolate(flat) vTextureId : u32;\n            ",main:"\n                vTextureId = aTextureIdAndRound.y;\n            ",end:"\n                if(aTextureIdAndRound.x == 1)\n                {\n                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);\n                }\n            "},fragment:{header:`\n                @in @interpolate(flat) vTextureId: u32;\n\n                ${i(t)}\n            `,main:`\n                var uvDx = dpdx(vUV);\n                var uvDy = dpdy(vUV);\n\n                ${s(t)}\n            `}}),r[t]}const a={};function u(t){const e=[];for(let n=0;n<t;n++)n>0&&e.push("else"),n<t-1&&e.push(`if(vTextureId < ${n}.5)`),e.push("{"),e.push(`\toutColor = texture(uTextures[${n}], vUV);`),e.push("}");return e.join("\n")}function l(t){return a[t]||(a[t]={name:"texture-batch-bit",vertex:{header:"\n                in vec2 aTextureIdAndRound;\n                out float vTextureId;\n\n            ",main:"\n                vTextureId = aTextureIdAndRound.y;\n            ",end:"\n                if(aTextureIdAndRound.x == 1.)\n                {\n                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);\n                }\n            "},fragment:{header:`\n                in float vTextureId;\n\n                uniform sampler2D uTextures[${t}];\n\n            `,main:`\n\n                ${u(t)}\n            `}}),a[t]}},2067:(t,e,n)=>{n.d(e,{Ls:()=>r,_Q:()=>i,mA:()=>s});const r={name:"local-uniform-bit",vertex:{header:"\n\n            struct LocalUniforms {\n                uTransformMatrix:mat3x3<f32>,\n                uColor:vec4<f32>,\n                uRound:f32,\n            }\n\n            @group(1) @binding(0) var<uniform> localUniforms : LocalUniforms;\n        ",main:"\n            vColor *= localUniforms.uColor;\n            modelMatrix *= localUniforms.uTransformMatrix;\n        ",end:"\n            if(localUniforms.uRound == 1)\n            {\n                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);\n            }\n        "}},i={...r,vertex:{...r.vertex,header:r.vertex.header.replace("group(1)","group(2)")}},s={name:"local-uniform-bit",vertex:{header:"\n\n            uniform mat3 uTransformMatrix;\n            uniform vec4 uColor;\n            uniform float uRound;\n        ",main:"\n            vColor *= uColor;\n            modelMatrix = uTransformMatrix;\n        ",end:"\n            if(uRound == 1.)\n            {\n                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);\n            }\n        "}}},6665:(t,e,n)=>{n.d(e,{b:()=>r,m:()=>i});const r={name:"round-pixels-bit",vertex:{header:"\n            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32> \n            {\n                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;\n            }\n        "}},i={name:"round-pixels-bit",vertex:{header:"   \n            vec2 roundPixels(vec2 position, vec2 targetSize)\n            {       \n                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;\n            }\n        "}}},9113:(t,e,n)=>{n.d(e,{M:()=>h});var r=n(7952),i=n(3804);let s;function o(){if(!s){s="mediump";const t=(0,i.W)();if(t&&t.getShaderPrecisionFormat){const e=t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT);s=e.precision?"highp":"mediump"}}return s}const a={},u={},l={stripVersion:function(t,e){return e?t.replace("#version 300 es",""):t},ensurePrecision:function(t,e,n){const r=n?e.maxSupportedFragmentPrecision:e.maxSupportedVertexPrecision;if("precision"!==t.substring(0,9)){let i=n?e.requestedFragmentPrecision:e.requestedVertexPrecision;return"highp"===i&&"highp"!==r&&(i="mediump"),`precision ${i} float;\n${t}`}return"highp"!==r&&"precision highp"===t.substring(0,15)?t.replace("precision highp","precision mediump"):t},addProgramDefines:function(t,e,n){return e?t:n?`\n        \n        #ifdef GL_ES // This checks if it is WebGL1\n        #define in varying\n        #define finalColor gl_FragColor\n        #define texture texture2D\n        #endif\n        ${t=t.replace("out vec4 finalColor;","")}\n        `:`\n        \n        #ifdef GL_ES // This checks if it is WebGL1\n        #define in attribute\n        #define out varying\n        #endif\n        ${t}\n        `},setProgramName:function(t,{name:e="pixi-program"},n=!0){e=e.replace(/\s+/g,"-");const r=n?a:u;return r[e+=n?"-fragment":"-vertex"]?(r[e]++,e+=`-${r[e]}`):r[e]=1,-1!==t.indexOf("#define SHADER_NAME")?t:`#define SHADER_NAME ${e}\n${t}`},insertVersion:function(t,e){return e?`#version 300 es\n${t}`:t}},c=Object.create(null),d=class t{constructor(e){const n=-1!==(e={...t.defaultOptions,...e}).fragment.indexOf("#version 300 es"),i={stripVersion:n,ensurePrecision:{requestedFragmentPrecision:e.preferredFragmentPrecision,requestedVertexPrecision:e.preferredVertexPrecision,maxSupportedVertexPrecision:"highp",maxSupportedFragmentPrecision:o()},setProgramName:{name:e.name},addProgramDefines:n,insertVersion:n};let s=e.fragment,a=e.vertex;Object.keys(l).forEach((t=>{const e=i[t];s=l[t](s,e,!0),a=l[t](a,e,!1)})),this.fragment=s,this.vertex=a,this.transformFeedbackVaryings=e.transformFeedbackVaryings,this._key=(0,r.X)(`${this.vertex}:${this.fragment}`,"gl-program")}destroy(){this.fragment=null,this.vertex=null,this._attributeData=null,this._uniformData=null,this._uniformBlockData=null,this.transformFeedbackVaryings=null}static from(e){const n=`${e.vertex}:${e.fragment}`;return c[n]||(c[n]=new t(e)),c[n]}};d.defaultOptions={preferredVertexPrecision:"highp",preferredFragmentPrecision:"mediump"};let h=d},6040:(t,e,n)=>{n.d(e,{n:()=>s});var r=n(5811);const i={};function s(t){let e=i[t];if(e)return e;const n=new Int32Array(t);for(let e=0;e<t;e++)n[e]=e;return e=i[t]=new r.k({uTextures:{value:n,type:"i32",size:t}},{isStatic:!0}),e}},3804:(t,e,n)=>{n.d(e,{W:()=>s});var r=n(1761);let i;function s(){if(!i||i?.isContextLost()){const t=r.e.get().createCanvas();i=t.getContext("webgl",{})}return i}},3513:(t,e,n)=>{n.d(e,{T:()=>r});class r{constructor(t){this.resources=Object.create(null),this._dirty=!0;let e=0;for(const n in t){const r=t[n];this.setResource(r,e++)}this._updateKey()}_updateKey(){if(!this._dirty)return;this._dirty=!1;const t=[];let e=0;for(const n in this.resources)t[e++]=this.resources[n]._resourceId;this._key=t.join("|")}setResource(t,e){const n=this.resources[e];t!==n&&(n&&t.off?.("change",this.onResourceChange,this),t.on?.("change",this.onResourceChange,this),this.resources[e]=t,this._dirty=!0)}getResource(t){return this.resources[t]}_touch(t){const e=this.resources;for(const n in e)e[n]._touched=t}destroy(){const t=this.resources;for(const e in t){const n=t[e];n.off?.("change",this.onResourceChange,this)}this.resources=null}onResourceChange(t){if(this._dirty=!0,t.destroyed){const e=this.resources;for(const n in e)e[n]===t&&(e[n]=null)}else this._updateKey()}}},3012:(t,e,n)=>{n.d(e,{B:()=>l});var r=n(7952),i=n(8306);const s={f32:"float32","vec2<f32>":"float32x2","vec3<f32>":"float32x3","vec4<f32>":"float32x4",vec2f:"float32x2",vec3f:"float32x3",vec4f:"float32x4",i32:"sint32","vec2<i32>":"sint32x2","vec3<i32>":"sint32x3","vec4<i32>":"sint32x4",u32:"uint32","vec2<u32>":"uint32x2","vec3<u32>":"uint32x3","vec4<u32>":"uint32x4",bool:"uint32","vec2<bool>":"uint32x2","vec3<bool>":"uint32x3","vec4<bool>":"uint32x4"};function o(t){const e=/@group\((\d+)\)/,n=/@binding\((\d+)\)/,r=/var(<[^>]+>)? (\w+)/,i=/:\s*(\w+)/,s=/(\w+)\s*:\s*([\w\<\>]+)/g,o=/struct\s+(\w+)/,a=t.match(/(^|[^/])@(group|binding)\(\d+\)[^;]+;/g)?.map((t=>({group:parseInt(t.match(e)[1],10),binding:parseInt(t.match(n)[1],10),name:t.match(r)[2],isUniform:"<uniform>"===t.match(r)[1],type:t.match(i)[1]})));if(!a)return{groups:[],structs:[]};const u=t.match(/struct\s+(\w+)\s*{([^}]+)}/g)?.map((t=>{const e=t.match(o)[1],n=t.match(s).reduce(((t,e)=>{const[n,r]=e.split(":");return t[n.trim()]=r.trim(),t}),{});return n?{name:e,members:n}:null})).filter((({name:t})=>a.some((e=>e.type===t))))??[];return{groups:a,structs:u}}var a=(t=>(t[t.VERTEX=1]="VERTEX",t[t.FRAGMENT=2]="FRAGMENT",t[t.COMPUTE=4]="COMPUTE",t))(a||{});const u=Object.create(null);class l{constructor(t){this._layoutKey=0,this._attributeLocationsKey=0;const{fragment:e,vertex:n,layout:r,gpuLayout:i,name:s}=t;if(this.name=s,this.fragment=e,this.vertex=n,e.source===n.source){const t=o(e.source);this.structsAndGroups=t}else{const t=o(n.source),r=o(e.source);this.structsAndGroups=function(t,e){const n=new Set,r=new Set;return{structs:[...t.structs,...e.structs].filter((t=>!n.has(t.name)&&(n.add(t.name),!0))),groups:[...t.groups,...e.groups].filter((t=>{const e=`${t.name}-${t.binding}`;return!r.has(e)&&(r.add(e),!0)}))}}(t,r)}this.layout=r??function({groups:t}){const e=[];for(let n=0;n<t.length;n++){const r=t[n];e[r.group]||(e[r.group]={}),e[r.group][r.name]=r.binding}return e}(this.structsAndGroups),this.gpuLayout=i??function({groups:t}){const e=[];for(let n=0;n<t.length;n++){const r=t[n];e[r.group]||(e[r.group]=[]),r.isUniform?e[r.group].push({binding:r.binding,visibility:a.VERTEX|a.FRAGMENT,buffer:{type:"uniform"}}):"sampler"===r.type?e[r.group].push({binding:r.binding,visibility:a.FRAGMENT,sampler:{type:"filtering"}}):"texture_2d"===r.type&&e[r.group].push({binding:r.binding,visibility:a.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d",multisampled:!1}})}return e}(this.structsAndGroups),this.autoAssignGlobalUniforms=!(void 0===this.layout[0]?.globalUniforms),this.autoAssignLocalUniforms=!(void 0===this.layout[1]?.localUniforms),this._generateProgramKey()}_generateProgramKey(){const{vertex:t,fragment:e}=this,n=t.source+e.source+t.entryPoint+e.entryPoint;this._layoutKey=(0,r.X)(n,"program")}get attributeData(){return this._attributeData??(this._attributeData=function({source:t,entryPoint:e}){const n={},r=t.indexOf(`fn ${e}`);if(-1!==r){const e=t.indexOf("->",r);if(-1!==e){const o=t.substring(r,e),a=/@location\((\d+)\)\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)(?:,|\s|$)/g;let u;for(;null!==(u=a.exec(o));){const t=s[u[3]]??"float32";n[u[2]]={location:parseInt(u[1],10),format:t,stride:(0,i.m)(t).stride,offset:0,instance:!1,start:0}}}}return n}(this.vertex)),this._attributeData}destroy(){this.gpuLayout=null,this.layout=null,this.structsAndGroups=null,this.fragment=null,this.vertex=null}static from(t){const e=`${t.vertex.source}:${t.fragment.source}:${t.fragment.entryPoint}:${t.vertex.entryPoint}`;return u[e]||(u[e]=new l(t)),u[e]}}},949:(t,e,n)=>{n.d(e,{h:()=>o});var r=n(8875),i=n(133),s=n(1132);class o extends r.A{constructor(t){let{data:e,size:n}=t;const{usage:r,label:s,shrinkToFit:o}=t;super(),this.uid=(0,i.L)("buffer"),this._resourceType="buffer",this._resourceId=(0,i.L)("resource"),this._touched=0,this._updateID=1,this._dataInt32=null,this.shrinkToFit=!0,this.destroyed=!1,e instanceof Array&&(e=new Float32Array(e)),this._data=e,n??(n=e?.byteLength);const a=!!e;this.descriptor={size:n,usage:r,mappedAtCreation:a,label:s},this.shrinkToFit=o??!0}get data(){return this._data}set data(t){this.setDataWithSize(t,t.length,!0)}get dataInt32(){return this._dataInt32||(this._dataInt32=new Int32Array(this.data.buffer)),this._dataInt32}get static(){return!!(this.descriptor.usage&s.S.STATIC)}set static(t){t?this.descriptor.usage|=s.S.STATIC:this.descriptor.usage&=~s.S.STATIC}setDataWithSize(t,e,n){if(this._updateID++,this._updateSize=e*t.BYTES_PER_ELEMENT,this._data===t)return void(n&&this.emit("update",this));const r=this._data;this._data=t,this._dataInt32=null,r&&r.length===t.length||!this.shrinkToFit&&r&&t.byteLength<r.byteLength?n&&this.emit("update",this):(this.descriptor.size=t.byteLength,this._resourceId=(0,i.L)("resource"),this.emit("change",this))}update(t){this._updateSize=t??this._updateSize,this._updateID++,this.emit("update",this)}destroy(){this.destroyed=!0,this.emit("destroy",this),this.emit("change",this),this._data=null,this.descriptor=null,this.removeAllListeners()}}},1132:(t,e,n)=>{n.d(e,{S:()=>r});var r=(t=>(t[t.MAP_READ=1]="MAP_READ",t[t.MAP_WRITE=2]="MAP_WRITE",t[t.COPY_SRC=4]="COPY_SRC",t[t.COPY_DST=8]="COPY_DST",t[t.INDEX=16]="INDEX",t[t.VERTEX=32]="VERTEX",t[t.UNIFORM=64]="UNIFORM",t[t.STORAGE=128]="STORAGE",t[t.INDIRECT=256]="INDIRECT",t[t.QUERY_RESOLVE=512]="QUERY_RESOLVE",t[t.STATIC=1024]="STATIC",t))(r||{})},6736:(t,e,n)=>{function r(t,e){const n=t.byteLength/8|0,r=new Float64Array(t,0,n);new Float64Array(e,0,n).set(r);const i=t.byteLength-8*n;if(i>0){const r=new Uint8Array(t,8*n,i);new Uint8Array(e,8*n,i).set(r)}}n.d(e,{W:()=>r})},6011:(t,e,n)=>{n.d(e,{V:()=>l});var r=n(8875),i=n(9636),s=n(133),o=n(949),a=n(1132);function u(t,e){if(!(t instanceof o.h)){let n=e?a.S.INDEX:a.S.VERTEX;t instanceof Array&&(e?(t=new Uint32Array(t),n=a.S.INDEX|a.S.COPY_DST):(t=new Float32Array(t),n=a.S.VERTEX|a.S.COPY_DST)),t=new o.h({data:t,label:e?"index-mesh-buffer":"vertex-mesh-buffer",usage:n})}return t}class l extends r.A{constructor(t={}){super(),this.uid=(0,s.L)("geometry"),this._layoutKey=0,this.instanceCount=1,this._bounds=new i.c,this._boundsDirty=!0;const{attributes:e,indexBuffer:n,topology:r}=t;if(this.buffers=[],this.attributes={},e)for(const t in e)this.addAttribute(t,e[t]);this.instanceCount=t.instanceCount??1,n&&this.addIndex(n),this.topology=r||"triangle-list"}onBufferUpdate(){this._boundsDirty=!0,this.emit("update",this)}getAttribute(t){return this.attributes[t]}getIndex(){return this.indexBuffer}getBuffer(t){return this.getAttribute(t).buffer}getSize(){for(const t in this.attributes){const e=this.attributes[t];return e.buffer.data.length/(e.stride/4||e.size)}return 0}addAttribute(t,e){const n=function(t){return(t instanceof o.h||Array.isArray(t)||t.BYTES_PER_ELEMENT)&&(t={buffer:t}),t.buffer=u(t.buffer,!1),t}(e);-1===this.buffers.indexOf(n.buffer)&&(this.buffers.push(n.buffer),n.buffer.on("update",this.onBufferUpdate,this),n.buffer.on("change",this.onBufferUpdate,this)),this.attributes[t]=n}addIndex(t){this.indexBuffer=u(t,!0),this.buffers.push(this.indexBuffer)}get bounds(){return this._boundsDirty?(this._boundsDirty=!1,function(t,e,n){const r=t.getAttribute("aPosition");if(!r)return n.minX=0,n.minY=0,n.maxX=0,n.maxY=0,n;const i=r.buffer.data;let s=1/0,o=1/0,a=-1/0,u=-1/0;const l=i.BYTES_PER_ELEMENT,c=(r.offset||0)/l,d=(r.stride||8)/l;for(let t=c;t<i.length;t+=d){const e=i[t],n=i[t+1];e>a&&(a=e),n>u&&(u=n),e<s&&(s=e),n<o&&(o=n)}return n.minX=s,n.minY=o,n.maxX=a,n.maxY=u,n}(this,0,this._bounds)):this._bounds}destroy(t=!1){this.emit("destroy",this),this.removeAllListeners(),t&&this.buffers.forEach((t=>t.destroy())),this.attributes=null,this.buffers=null,this.indexBuffer=null,this._bounds=null}}},8306:(t,e,n)=>{n.d(e,{m:()=>i});const r={uint8x2:{size:2,stride:2,normalised:!1},uint8x4:{size:4,stride:4,normalised:!1},sint8x2:{size:2,stride:2,normalised:!1},sint8x4:{size:4,stride:4,normalised:!1},unorm8x2:{size:2,stride:2,normalised:!0},unorm8x4:{size:4,stride:4,normalised:!0},snorm8x2:{size:2,stride:2,normalised:!0},snorm8x4:{size:4,stride:4,normalised:!0},uint16x2:{size:2,stride:4,normalised:!1},uint16x4:{size:4,stride:8,normalised:!1},sint16x2:{size:2,stride:4,normalised:!1},sint16x4:{size:4,stride:8,normalised:!1},unorm16x2:{size:2,stride:4,normalised:!0},unorm16x4:{size:4,stride:8,normalised:!0},snorm16x2:{size:2,stride:4,normalised:!0},snorm16x4:{size:4,stride:8,normalised:!0},float16x2:{size:2,stride:4,normalised:!1},float16x4:{size:4,stride:8,normalised:!1},float32:{size:1,stride:4,normalised:!1},float32x2:{size:2,stride:8,normalised:!1},float32x3:{size:3,stride:12,normalised:!1},float32x4:{size:4,stride:16,normalised:!1},uint32:{size:1,stride:4,normalised:!1},uint32x2:{size:2,stride:8,normalised:!1},uint32x3:{size:3,stride:12,normalised:!1},uint32x4:{size:4,stride:16,normalised:!1},sint32:{size:1,stride:4,normalised:!1},sint32x2:{size:2,stride:8,normalised:!1},sint32x3:{size:3,stride:12,normalised:!1},sint32x4:{size:4,stride:16,normalised:!1}};function i(t){return r[t]??r.float32}},8475:(t,e,n)=>{n.d(e,{M:()=>l});var r=n(8875),i=n(9113),s=n(3513),o=n(3012),a=n(5099),u=n(5811);class l extends r.A{constructor(t){super(),this._uniformBindMap=Object.create(null),this._ownedBindGroups=[];let{gpuProgram:e,glProgram:n,groups:r,resources:i,compatibleRenderers:o,groupMap:l}=t;this.gpuProgram=e,this.glProgram=n,void 0===o&&(o=0,e&&(o|=a.W.WEBGPU),n&&(o|=a.W.WEBGL)),this.compatibleRenderers=o;const c={};if(i||r||(i={}),i&&r)throw new Error("[Shader] Cannot have both resources and groups");if(!e&&r&&!l)throw new Error("[Shader] No group map or WebGPU shader provided - consider using resources instead.");if(!e&&r&&l)for(const t in l)for(const e in l[t]){const n=l[t][e];c[n]={group:t,binding:e,name:n}}else if(e&&r&&!l){const t=e.structsAndGroups.groups;l={},t.forEach((t=>{l[t.group]=l[t.group]||{},l[t.group][t.binding]=t.name,c[t.name]=t}))}else if(i){r={},l={},e&&e.structsAndGroups.groups.forEach((t=>{l[t.group]=l[t.group]||{},l[t.group][t.binding]=t.name,c[t.name]=t}));let t=0;for(const e in i)c[e]||(r[99]||(r[99]=new s.T,this._ownedBindGroups.push(r[99])),c[e]={group:99,binding:t,name:e},l[99]=l[99]||{},l[99][t]=e,t++);for(const t in i){const e=t;let n=i[t];n.source||n._resourceType||(n=new u.k(n));const o=c[e];o&&(r[o.group]||(r[o.group]=new s.T,this._ownedBindGroups.push(r[o.group])),r[o.group].setResource(n,o.binding))}}this.groups=r,this._uniformBindMap=l,this.resources=this._buildResourceAccessor(r,c)}addResource(t,e,n){var r,i;(r=this._uniformBindMap)[e]||(r[e]={}),(i=this._uniformBindMap[e])[n]||(i[n]=t),this.groups[e]||(this.groups[e]=new s.T,this._ownedBindGroups.push(this.groups[e]))}_buildResourceAccessor(t,e){const n={};for(const r in e){const i=e[r];Object.defineProperty(n,i.name,{get:()=>t[i.group].getResource(i.binding),set(e){t[i.group].setResource(e,i.binding)}})}return n}destroy(t=!1){this.emit("destroy",this),t&&(this.gpuProgram?.destroy(),this.glProgram?.destroy()),this.gpuProgram=null,this.glProgram=null,this.removeAllListeners(),this._uniformBindMap=null,this._ownedBindGroups.forEach((t=>{t.destroy()})),this._ownedBindGroups=null,this.resources=null,this.groups=null}static from(t){const{gpu:e,gl:n,...r}=t;let s,a;return e&&(s=o.B.from(e)),n&&(a=i.M.from(n)),new l({gpuProgram:s,glProgram:a,...r})}}},5811:(t,e,n)=>{n.d(e,{k:()=>l});var r=n(133),i=n(7952);const s=["f32","i32","vec2<f32>","vec3<f32>","vec4<f32>","mat2x2<f32>","mat3x3<f32>","mat4x4<f32>","mat3x2<f32>","mat4x2<f32>","mat2x3<f32>","mat4x3<f32>","mat2x4<f32>","mat3x4<f32>","vec2<i32>","vec3<i32>","vec4<i32>"],o=s.reduce(((t,e)=>(t[e]=!0,t)),{});function a(t,e){switch(t){case"f32":return 0;case"vec2<f32>":return new Float32Array(2*e);case"vec3<f32>":return new Float32Array(3*e);case"vec4<f32>":return new Float32Array(4*e);case"mat2x2<f32>":return new Float32Array([1,0,0,1]);case"mat3x3<f32>":return new Float32Array([1,0,0,0,1,0,0,0,1]);case"mat4x4<f32>":return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}return null}const u=class t{constructor(e,n){this._touched=0,this.uid=(0,r.L)("uniform"),this._resourceType="uniformGroup",this._resourceId=(0,r.L)("resource"),this.isUniformGroup=!0,this._dirtyId=0,this.destroyed=!1,n={...t.defaultOptions,...n},this.uniformStructures=e;const u={};for(const t in e){const n=e[t];if(n.name=t,n.size=n.size??1,!o[n.type])throw new Error(`Uniform type ${n.type} is not supported. Supported uniform types are: ${s.join(", ")}`);n.value??(n.value=a(n.type,n.size)),u[t]=n.value}this.uniforms=u,this._dirtyId=1,this.ubo=n.ubo,this.isStatic=n.isStatic,this._signature=(0,i.X)(Object.keys(u).map((t=>`${t}-${e[t].type}`)).join("-"),"uniform-group")}update(){this._dirtyId++}};u.defaultOptions={ubo:!1,isStatic:!1};let l=u},7547:(t,e,n)=>{n.d(e,{U:()=>s});const r={normal:0,add:1,multiply:2,screen:3,overlay:4,erase:5,"normal-npm":6,"add-npm":7,"screen-npm":8,min:9,max:10},i=class t{constructor(){this.data=0,this.blendMode="normal",this.polygonOffset=0,this.blend=!0,this.depthMask=!0}get blend(){return!!(1&this.data)}set blend(t){!!(1&this.data)!==t&&(this.data^=1)}get offsets(){return!!(2&this.data)}set offsets(t){!!(2&this.data)!==t&&(this.data^=2)}set cullMode(t){"none"!==t?(this.culling=!0,this.clockwiseFrontFace="front"===t):this.culling=!1}get cullMode(){return this.culling?this.clockwiseFrontFace?"front":"back":"none"}get culling(){return!!(4&this.data)}set culling(t){!!(4&this.data)!==t&&(this.data^=4)}get depthTest(){return!!(8&this.data)}set depthTest(t){!!(8&this.data)!==t&&(this.data^=8)}get depthMask(){return!!(32&this.data)}set depthMask(t){!!(32&this.data)!==t&&(this.data^=32)}get clockwiseFrontFace(){return!!(16&this.data)}set clockwiseFrontFace(t){!!(16&this.data)!==t&&(this.data^=16)}get blendMode(){return this._blendMode}set blendMode(t){this.blend="none"!==t,this._blendMode=t,this._blendModeId=r[t]||0}get polygonOffset(){return this._polygonOffset}set polygonOffset(t){this.offsets=!!t,this._polygonOffset=t}toString(){return`[pixi.js/core:State blendMode=${this.blendMode} clockwiseFrontFace=${this.clockwiseFrontFace} culling=${this.culling} depthMask=${this.depthMask} polygonOffset=${this.polygonOffset}]`}static for2d(){const e=new t;return e.depthTest=!1,e.blend=!0,e}};i.default2d=i.for2d();let s=i},1957:(t,e,n)=>{n.d(e,{K:()=>i,Q:()=>r});const r={normal:"normal-npm",add:"add-npm",screen:"screen-npm"};var i=(t=>(t[t.DISABLED=0]="DISABLED",t[t.RENDERING_MASK_ADD=1]="RENDERING_MASK_ADD",t[t.MASK_ACTIVE=2]="MASK_ACTIVE",t[t.INVERSE_MASK_ACTIVE=3]="INVERSE_MASK_ACTIVE",t[t.RENDERING_MASK_REMOVE=4]="RENDERING_MASK_REMOVE",t[t.NONE=5]="NONE",t))(i||{})},8639:(t,e,n)=>{n.d(e,{i:()=>i});var r=n(1957);function i(t,e){return"no-premultiply-alpha"===e.alphaMode&&r.Q[t]||t}},7952:(t,e,n)=>{n.d(e,{X:()=>s});const r=Object.create(null),i=Object.create(null);function s(t,e){let n=i[t];return void 0===n&&(void 0===r[e]&&(r[e]=1),i[t]=n=r[e]++),n}},5099:(t,e,n)=>{n.d(e,{W:()=>r});var r=(t=>(t[t.WEBGL=1]="WEBGL",t[t.WEBGPU=2]="WEBGPU",t[t.BOTH=3]="BOTH",t))(r||{})},2760:(t,e,n)=>{function r(t,e,n){const r=(t>>24&255)/255;e[n++]=(255&t)/255*r,e[n++]=(t>>8&255)/255*r,e[n++]=(t>>16&255)/255*r,e[n++]=r}n.d(e,{V:()=>r})},8422:(t,e,n)=>{n.d(e,{K:()=>r});class r{constructor(){this.batcherName="default",this.topology="triangle-list",this.attributeSize=4,this.indexSize=6,this.packAsQuad=!0,this.roundPixels=0,this._attributeStart=0,this._batcher=null,this._batch=null}get blendMode(){return this.renderable.groupBlendMode}get color(){return this.renderable.groupColorAlpha}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.bounds=null}}},1460:(t,e,n)=>{n.d(e,{u:()=>r});class r{constructor(t){"number"==typeof t?this.rawBinaryData=new ArrayBuffer(t):t instanceof Uint8Array?this.rawBinaryData=t.buffer:this.rawBinaryData=t,this.uint32View=new Uint32Array(this.rawBinaryData),this.float32View=new Float32Array(this.rawBinaryData),this.size=this.rawBinaryData.byteLength}get int8View(){return this._int8View||(this._int8View=new Int8Array(this.rawBinaryData)),this._int8View}get uint8View(){return this._uint8View||(this._uint8View=new Uint8Array(this.rawBinaryData)),this._uint8View}get int16View(){return this._int16View||(this._int16View=new Int16Array(this.rawBinaryData)),this._int16View}get int32View(){return this._int32View||(this._int32View=new Int32Array(this.rawBinaryData)),this._int32View}get float64View(){return this._float64Array||(this._float64Array=new Float64Array(this.rawBinaryData)),this._float64Array}get bigUint64View(){return this._bigUint64Array||(this._bigUint64Array=new BigUint64Array(this.rawBinaryData)),this._bigUint64Array}view(t){return this[`${t}View`]}destroy(){this.rawBinaryData=null,this._int8View=null,this._uint8View=null,this._int16View=null,this.uint16View=null,this._int32View=null,this.uint32View=null,this.float32View=null}static sizeOf(t){switch(t){case"int8":case"uint8":return 1;case"int16":case"uint16":return 2;case"int32":case"uint32":case"float32":return 4;default:throw new Error(`${t} isn't a valid view type`)}}}}}]);