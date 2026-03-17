/* ============================================
   NextLayer — "Live Build → Expand"
   Intro expands into site. Everything breathes.
   ============================================ */
(function(){
"use strict";

/* ═══════ INTRO — build → expand → reveal ═══════ */
const intro = document.querySelector(".intro");
const BUILD_DUR = 3600;
const EXPAND_DUR = 1200;

document.body.classList.add("locked");

// Phase 1: build completes → Phase 2: expand
setTimeout(() => {
  intro.classList.add("expand");
}, BUILD_DUR);

// Phase 3: remove intro
setTimeout(() => {
  intro.classList.add("done");
  document.body.classList.remove("locked");
}, BUILD_DUR + EXPAND_DUR);

// Skip on click
intro.addEventListener("click", () => {
  intro.classList.add("expand");
  setTimeout(() => {
    intro.classList.add("done");
    document.body.classList.remove("locked");
  }, 400);
});


/* ═══════ CANVAS — fluid ambient with more life ═══════ */
const cv = document.getElementById("hc");
if(cv){
  const c = cv.getContext("2d");
  let W,H, fr=0;

  // Target and smoothed mouse positions (normalized 0-1)
  let targetMx=.5, targetMy=.5;
  let mx=.5, my=.5;

  function rsz(){ W=cv.width=cv.offsetWidth; H=cv.height=cv.offsetHeight; }
  rsz(); window.addEventListener("resize",rsz);

  // Listen on document so it works even when intro overlay is on top
  document.addEventListener("mousemove",(e)=>{
    const r=cv.getBoundingClientRect();
    // Compute normalized position relative to canvas, but don't clamp —
    // allow smooth values even when mouse is outside canvas bounds
    targetMx = (e.clientX - r.left) / (r.width || 1);
    targetMy = (e.clientY - r.top) / (r.height || 1);
    // Soft clamp to 0-1 range to avoid extreme values
    targetMx = Math.max(-0.2, Math.min(1.2, targetMx));
    targetMy = Math.max(-0.2, Math.min(1.2, targetMy));
  });

  const bs=[
    {x:.3,y:.35,r:220,vx:.0003,vy:.0004,ph:0},
    {x:.65,y:.6,r:170,vx:-.0004,vy:.0003,ph:2},
    {x:.5,y:.25,r:140,vx:.0002,vy:-.0005,ph:4},
    {x:.75,y:.7,r:110,vx:-.0003,vy:-.0002,ph:1},
  ];

  function draw(){
    c.clearRect(0,0,W,H); fr++;

    // Smooth lerp mouse — prevents snapping and glitching
    mx += (targetMx - mx) * 0.06;
    my += (targetMy - my) * 0.06;

    const px=mx*W, py=my*H;

    for(let i=0;i<bs.length;i++){
      const b=bs[i], t=fr*.008+b.ph;
      b.x+=b.vx+Math.sin(t*1.3)*.0002;
      b.y+=b.vy+Math.cos(t*.9)*.0002;
      if(b.x<.08||b.x>.92)b.vx*=-1;
      if(b.y<.08||b.y>.92)b.vy*=-1;
      b.x+=(mx-b.x)*.003; b.y+=(my-b.y)*.003;

      const bx=b.x*W,by=b.y*H,rad=b.r+Math.sin(t*2)*25;
      const g=c.createRadialGradient(bx,by,0,bx,by,rad);
      g.addColorStop(0,"rgba(99,102,241,0.12)");
      g.addColorStop(.5,"rgba(99,102,241,0.03)");
      g.addColorStop(1,"rgba(99,102,241,0)");
      c.beginPath();c.arc(bx,by,rad,0,Math.PI*2);c.fillStyle=g;c.fill();
    }

    // Mouse glow
    const mg=c.createRadialGradient(px,py,0,px,py,320);
    mg.addColorStop(0,"rgba(129,140,248,0.09)");
    mg.addColorStop(1,"rgba(129,140,248,0)");
    c.beginPath();c.arc(px,py,320,0,Math.PI*2);c.fillStyle=mg;c.fill();

    // Grid
    c.strokeStyle="rgba(255,255,255,0.012)";c.lineWidth=.5;
    const gs=60,cxW=W/2,cyH=H/2;
    for(let x=0;x<W;x+=gs){
      const d=Math.abs(x-cxW)/W;
      if(d<.35){c.globalAlpha=1-d/.35;c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke();}
    }
    for(let y=0;y<H;y+=gs){
      const d=Math.abs(y-cyH)/H;
      if(d<.4){c.globalAlpha=1-d/.4;c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
    }
    c.globalAlpha=1;

    // Floating small dots
    const time = fr * 0.01;
    for(let i=0;i<8;i++){
      const dx = (Math.sin(time + i * 1.7) * .3 + .5) * W;
      const dy = (Math.cos(time * .7 + i * 2.1) * .3 + .5) * H;
      const alpha = .02 + Math.sin(time + i) * .015;
      c.beginPath();
      c.arc(dx, dy, 1.5, 0, Math.PI*2);
      c.fillStyle = `rgba(255,255,255,${alpha})`;
      c.fill();
    }

    requestAnimationFrame(draw);
  }
  draw();
}


/* ═══════ CURSOR ═══════ */
const dot=document.querySelector(".cur");
const ring=document.querySelector(".cur-o");
if(dot&&ring&&window.innerWidth>768){
  let mx2=0,my2=0,dx=0,dy=0,ox=0,oy=0;
  document.addEventListener("mousemove",(e)=>{mx2=e.clientX;my2=e.clientY});
  function cl(){
    dx+=(mx2-dx)*.25;dy+=(my2-dy)*.25;
    ox+=(mx2-ox)*.1;oy+=(my2-oy)*.1;
    dot.style.left=dx+"px";dot.style.top=dy+"px";
    ring.style.left=ox+"px";ring.style.top=oy+"px";
    requestAnimationFrame(cl);
  }
  cl();
  document.querySelectorAll("a,button,.svc-row,.pf-card,.tst-c,.why-c,.num").forEach(el=>{
    el.addEventListener("mouseenter",()=>{dot.classList.add("a");ring.classList.add("a")});
    el.addEventListener("mouseleave",()=>{dot.classList.remove("a");ring.classList.remove("a")});
  });
}


/* ═══════ NAV ═══════ */
const nav=document.querySelector(".nav");
window.addEventListener("scroll",()=>{nav.classList.toggle("solid",window.scrollY>100)},{passive:true});

const burger=document.querySelector(".burger");
const navM=document.querySelector(".nav-m");
const mobOv=document.querySelector(".mob-ov");
function closeM(){burger.classList.remove("on");navM.classList.remove("on");mobOv.classList.remove("vis");document.body.style.overflow=""}
burger.addEventListener("click",()=>{
  if(navM.classList.contains("on"))closeM();
  else{burger.classList.add("on");navM.classList.add("on");mobOv.classList.add("vis");document.body.style.overflow="hidden"}
});
mobOv.addEventListener("click",closeM);
navM.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeM));

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",(e)=>{
    e.preventDefault();
    const t=document.querySelector(a.getAttribute("href"));
    if(t)window.scrollTo({top:t.getBoundingClientRect().top+window.pageYOffset-80,behavior:"smooth"});
  });
});


/* ═══════ SCROLL REVEAL ═══════ */
const srs=document.querySelectorAll(".sr");
const sObs=new IntersectionObserver((es)=>{
  es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("v");sObs.unobserve(e.target)}});
},{threshold:.08,rootMargin:"0px 0px -50px 0px"});
srs.forEach(el=>sObs.observe(el));


/* ═══════ COUNTERS ═══════ */
const ctrs=document.querySelectorAll("[data-count]");
const cObs=new IntersectionObserver((es)=>{
  es.forEach(e=>{
    if(e.isIntersecting){
      const el=e.target,tgt=+el.dataset.count,sfx=el.dataset.suffix||"",dur=2200,st=performance.now();
      (function step(now){
        const p=Math.min((now-st)/dur,1);
        el.textContent=Math.floor((1-Math.pow(1-p,4))*tgt)+sfx;
        if(p<1)requestAnimationFrame(step);
      })(st);
      cObs.unobserve(el);
    }
  });
},{threshold:.5});
ctrs.forEach(el=>cObs.observe(el));


/* ═══════ MAGNETIC BUTTONS ═══════ */
if(window.innerWidth>768){
  document.querySelectorAll(".btn-w,.btn-g,.pf-lk,.nav-btn").forEach(b=>{
    b.addEventListener("mousemove",(e)=>{
      const r=b.getBoundingClientRect();
      b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.2}px,${(e.clientY-r.top-r.height/2)*.2}px)`;
    });
    b.addEventListener("mouseleave",()=>{
      b.style.transition="transform .5s cubic-bezier(.16,1,.3,1)";
      b.style.transform="translate(0,0)";
      setTimeout(()=>{b.style.transition=""},500);
    });
  });
}


/* ═══════ PORTFOLIO TILT ═══════ */
if(window.innerWidth>768){
  document.querySelectorAll(".pf-card").forEach(card=>{
    card.addEventListener("mousemove",(e)=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(1000px) rotateY(${x*5}deg) rotateX(${-y*5}deg)`;
    });
    card.addEventListener("mouseleave",()=>{
      card.style.transition="transform .7s cubic-bezier(.16,1,.3,1)";
      card.style.transform="perspective(1000px) rotateY(0) rotateX(0)";
      setTimeout(()=>{card.style.transition=""},700);
    });
  });
}


/* ═══════ PARALLAX on scroll — hero elements ═══════ */
const heroH = document.querySelector(".hero-h");
const heroP = document.querySelector(".hero-p");
const heroSection = document.querySelector(".hero");

if(heroH && window.innerWidth > 768){
  // Scroll parallax
  window.addEventListener("scroll", () => {
    const s = window.scrollY;
    if(s < window.innerHeight){
      heroP.style.opacity = Math.max(0, 1 - s / (window.innerHeight * 0.6));
    }
  }, {passive:true});

  // Mouse-reactive text movement — each line moves at different speed
  const lines = heroH.querySelectorAll(".ln");
  const heroCta = document.querySelector(".hero-cta");

  heroSection.addEventListener("mousemove", (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Each line shifts differently — creates depth
    lines.forEach((ln, i) => {
      const speed = (i + 1) * 6;
      const rotateAmount = x * (i + 1) * 0.3;
      ln.style.transform = `translateX(${x * speed}px) translateY(${y * speed * 0.5}px)`;
      ln.style.transition = "transform 0.3s cubic-bezier(.16,1,.3,1)";
    });

    // Description drifts subtly opposite
    if(heroP){
      heroP.style.transform = `translate(${x * -8}px, ${y * -5}px)`;
      heroP.style.transition = "transform 0.4s cubic-bezier(.16,1,.3,1), opacity 0.3s";
    }

    // CTA floats gently
    if(heroCta){
      heroCta.style.transform = `translate(${x * -5}px, ${y * -3}px)`;
      heroCta.style.transition = "transform 0.45s cubic-bezier(.16,1,.3,1)";
    }
  });

  // Reset on mouse leave
  heroSection.addEventListener("mouseleave", () => {
    lines.forEach((ln) => {
      ln.style.transform = "translateX(0) translateY(0)";
    });
    if(heroP) heroP.style.transform = "translate(0,0)";
    if(heroCta) heroCta.style.transform = "translate(0,0)";
  });
}


/* ═══════ SECTION HEADINGS — subtle mouse drift ═══════ */
if(window.innerWidth > 768){
  document.querySelectorAll(".svc-h, .cta-h").forEach(heading => {
    const parent = heading.closest("section") || heading.parentElement;
    parent.addEventListener("mousemove", (e) => {
      const rect = parent.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heading.style.transform = `translate(${x * 10}px, ${y * 6}px)`;
      heading.style.transition = "transform 0.4s cubic-bezier(.16,1,.3,1)";
    });
    parent.addEventListener("mouseleave", () => {
      heading.style.transform = "translate(0,0)";
    });
  });
}

})();
