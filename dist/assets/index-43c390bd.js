(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))x(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const w of o.addedNodes)w.tagName==="LINK"&&w.rel==="modulepreload"&&x(w)}).observe(document,{childList:!0,subtree:!0});function h(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function x(i){if(i.ep)return;i.ep=!0;const o=h(i);fetch(i.href,o)}})();const f=document.getElementById("canvas"),e=f.getContext("2d");let s,n,l,a,c,u,b;const g=3.141592653589793;let d,v,L,y,M,E,m;function A(){m=0,n={x:window.innerWidth/2,y:window.innerHeight/2},b=1/60,l=0,a=0,c=g/4,y=.6,v=9.81,d=250,M=1/2*d,L=1/3*y*Math.pow(d,2),E=2*g*Math.sqrt(L/(y*v*M)),s={x:0,y:d},O(),P()}function P(t){e.clearRect(0,0,f.width,f.height),e.beginPath(),e.moveTo(n.x,n.y),e.lineTo(s.x,s.y),e.strokeStyle="blue",e.stroke(),e.beginPath(),e.moveTo(90,n.y),e.lineTo(e.canvas.width-75,n.y),e.strokeStyle="black",e.stroke(),e.beginPath(),e.arc(s.x,s.y,20,0,2*Math.PI),e.fillStyle="red",e.fill(),e.stroke(),u||(u=t);let r=t-u;r>b&&(n.x-100>0&&(n.x+=l*r),n.x+90<e.canvas.width&&(n.x+=a*r),m+=1,c=Math.cos(2*g/E*m+.1),e.font="30px Arial",e.fillText(JSON.stringify(Math.floor(c*(180/Math.PI)))+"°",window.innerWidth/2,50),s.x=d*Math.sin(c)+n.x,s.y=d*Math.cos(c)+n.y,u=t),requestAnimationFrame(P)}let p=0;window.addEventListener("touchstart",t=>{p=t.touches[0].clientX});window.addEventListener("touchmove",t=>{const r=t.touches[0].clientX,h=r-p;h>0?a=1:h<0&&(l=-1),p=r});window.addEventListener("touchend",t=>{a=0,l=0});window.addEventListener("keydown",t=>{t.code==="ArrowLeft"?l=-1:t.code==="ArrowRight"&&(a=1)});window.addEventListener("keyup",t=>{t.code==="ArrowLeft"?l=0:t.code==="ArrowRight"&&(a=0)});function O(){e.canvas.width=window.innerWidth,e.canvas.height=window.innerHeight,n.x=f.width/2,n.y=f.height/2,s.x=d*Math.sin(c)+n.x,s.y=d*Math.cos(c)+n.y}window.addEventListener("resize",O);document.addEventListener("DOMContentLoaded",A);
