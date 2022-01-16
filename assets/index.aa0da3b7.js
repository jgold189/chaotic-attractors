import{S as L,P as C,W as A,G as S,O as M,a as P,b as v,M as E,c as B,d as F,B as R,e as O,L as W,f as G,g as N}from"./vendor.542ab1af.js";const H=function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function r(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerpolicy&&(n.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?n.credentials="include":t.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(t){if(t.ep)return;t.ep=!0;const n=r(t);fetch(t.href,n)}};H();const b={Lorenz:I,Chen:T,"Lu Chen":U,Rossler:q};function I(e,o){const r=28,s=10,t=8/3,n=e.position.x,i=e.position.y,a=e.position.z;e.position.x+=s*(i-n)*o,e.position.y+=(n*(r-a)-i)*o,e.position.z+=(n*i-t*a)*o}function T(e,o){const r=40,s=3,t=28,n=e.position.x,i=e.position.y,a=e.position.z;e.position.x+=r*(i-n)*o,e.position.y+=((t-r)*n-n*a+t*i)*o,e.position.z+=(n*i-s*a)*o}function U(e,o){const r=36,s=3,t=20,n=-15.15,i=e.position.x,a=e.position.y,y=e.position.z;e.position.x+=r*(a-i)*o,e.position.y+=(i-i*y+t*a+n)*o,e.position.z+=(i*a-s*y)*o}function q(e,o){const r=.2,s=.2,t=5.7,n=e.position.x,i=e.position.y,a=e.position.z;e.position.x+=(i*-1-a)*o,e.position.y+=(n+r*i)*o,e.position.z+=(s+a*(n-t))*o}const c={numPoints:100,attractor:b.Lorenz,enableTrails:!0,uniformColors:!0,dt:.006,restart:p},w=2500;let h=[],f=[],d,l,m,g,u;function j(){const e=new N({name:"Settings"});e.add(c,"enableTrails").name("Enable Trails?").onChange(z),e.add(c,"uniformColors").name("Uniform Colors?").onChange(p),e.add(c,"dt",.003,.02).name("Speed"),e.add(c,"numPoints",1,250).step(1).name("Points").onChange(p),e.add(c,"attractor",b).name("Attractor").onChange(p),e.add(c,"restart").name("Restart")}function D(){l.aspect=window.innerWidth/window.innerHeight,l.updateProjectionMatrix(),m.setSize(window.innerWidth,window.innerHeight)}function _(){d=new L,l=new C(75,window.innerWidth/window.innerHeight,.1,1e3),m=new A({canvas:document.querySelector("#can")}),m.setPixelRatio(window.devicePixelRatio),m.setSize(window.innerWidth,window.innerHeight),l.position.setZ(30),l.position.setY(15),m.render(d,l);const e=new S(200,50);d.add(e);const o=new M(l,m.domElement);g=new P,document.body.appendChild(g.dom),window.addEventListener("resize",D),j(),p(),o.update()}function p(){h.forEach(e=>{e.geometry.dispose(),e.material.dispose(),d.remove(e)}),f.forEach(e=>{e.geometry.dispose(),e.material.dispose(),d.remove(e)}),h=Array(c.numPoints).fill().map(()=>K()),f=Array(c.numPoints).fill().map((e,o)=>X(h[o])),u=1,z()}function K(e=.001,o=.9){const r=new v(.24,20,10);let s;c.uniformColors?s=16776960:s=parseInt(Math.floor(Math.random()*16777215).toString(16),16);const t=new E({color:s}),n=new B(r,t),[i,a,y]=Array(3).fill().map(()=>F.randFloat(e,o));return n.position.set(i,a,y),d.add(n),n}function X(e){const o=new Float32Array(w*3);o[0]=e.position.x,o[1]=e.position.y,o[2]=e.position.z;const r=new R;r.setAttribute("position",new O(o,3)),r.setDrawRange(0,1);const s=new W({color:e.material.color}),t=new G(r,s);return d.add(t),t}function Y(e,o){u<=w&&(e.geometry.attributes.position.array[u*3]=o.position.x,e.geometry.attributes.position.array[u*3+1]=o.position.y,e.geometry.attributes.position.array[u*3+2]=o.position.z,e.geometry.setDrawRange(0,Math.min(u,w)),e.geometry.attributes.position.needsUpdate=!0,e.geometry.computeBoundingBox(),e.geometry.computeBoundingSphere())}function z(){c.enableTrails?f.forEach(e=>d.add(e)):f.forEach(e=>d.remove(e))}function x(){requestAnimationFrame(x),u<=w&&u++,h.forEach((e,o)=>{c.attractor(e,c.dt),Y(f[o],e)}),m.render(d,l),g.update()}_();x();
