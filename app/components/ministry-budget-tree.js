/* Interactive ministry budget Sankey. 2025-P credits prorogued for 2026.
   Never treat the sum of ministerial sections as the SEC/S13 consolidated total. */
const ns="http://www.w3.org/2000/svg";
const fmt=n=>new Intl.NumberFormat("es-ES",{maximumFractionDigits:1}).format(Number(n))+" M€";
const areaNames={"0":"Deuda y operaciones financieras","1":"Servicios públicos básicos","2":"Protección y promoción social","3":"Servicios públicos preferentes","4":"Actuaciones de carácter económico","9":"Actuaciones de carácter general"};
function svg(tag,props={}){
 const e=document.createElementNS(ns,tag);
 Object.entries(props).forEach(([key,value])=>e.setAttribute(key,String(value)));
 return e;
}
function html(tag,cls="",txt=null){
 const e=document.createElement(tag);if(cls)e.className=cls;
 if(txt!==null)e.textContent=String(txt);return e;
}
function txt(parent,x,y,value,cls){
 const e=svg("text",{x,y,class:cls});e.textContent=value;parent.append(e);return e;
}
const shorten=(s,max=42)=>String(s||"").length>max?String(s).slice(0,max-1).trimEnd()+"…":String(s||"");
function groupsOf(m){
 const groups=new Map();
 for(const p of m.flows){
  const key=String(p.code).charAt(0);
  if(!groups.has(key))groups.set(key,{code:key,name:areaNames[key]||"Otras actuaciones",value_mill_eur:0,programs:[]});
  const a=groups.get(key);a.programs.push(p);a.value_mill_eur+=Number(p.value_mill_eur);
 }
 return [...groups.values()].sort((a,b)=>a.code.localeCompare(b.code,"es",{numeric:true}));
}
function positions(items,center,H,gap=54,h=43){
 const used=items.length*gap-(gap-h);
 const top=Math.max(55,Math.min(center-used/2,H-used-45));
 return items.map((item,i)=>({item,y:top+i*gap,cy:top+i*gap+h/2}));
}
export function MinistryBudgetTree(data,options={}){
 const ministries=(data?.ministries||[]).filter(m=>m.verified && Array.isArray(m.flows) &&
   Math.abs(m.flows.reduce((sum,p)=>sum+Number(p.value_mill_eur),0)-Number(m.total_mill_eur))<0.15)
   .sort((a,b)=>Number(a.id)-Number(b.id));
 const root=html("section","mbt-root");
 root.dataset.mode="ministry-budget-tree";
 const style=html("style");
 style.textContent=[
 ".mbt-root{width:100%;min-width:0;max-width:100%;font-family:system-ui,-apple-system,sans-serif;color:#0b2447}",
 ".mbt-head{display:flex;justify-content:space-between;gap:9px;flex-wrap:wrap;align-items:center;padding:7px 0;margin:2px 0 8px;border-bottom:1px solid #e3e9f0}",
 ".mbt-head strong{font-size:.82rem}.mbt-head small{font-size:.7rem;color:#6b7c90}",
 ".mbt-trail{display:flex;flex-wrap:wrap;align-items:center;gap:5px;margin:0 0 8px}",
 ".mbt-trail button{padding:4px 5px;border:0;border-radius:4px;background:transparent;color:#19527c;font:700 .73rem system-ui;cursor:pointer}",
 ".mbt-trail button:hover{background:#ecf2f7}.mbt-trail strong{font-size:.73rem}.mbt-trail span{color:#9aa8b5}",
 ".mbt-wrap{width:100%;max-width:100%;overflow-x:auto;overflow-y:hidden;scrollbar-color:#a6b9ca #ecf2f7;scrollbar-width:thin;-webkit-overflow-scrolling:touch;border:1px solid #e1e7ee;border-radius:10px}",
 ".mbt-wrap svg{display:block;max-width:none;height:auto}.mbt-heading{font-size:12.5px;font-weight:800;letter-spacing:.06em;fill:#947036}",
 ".mbt-node rect{fill:#f6f2e9;stroke:#c3d1df;stroke-width:1.3}.mbt-node{cursor:pointer;outline:none}",
 ".mbt-node:hover rect,.mbt-node:focus-visible rect{stroke:#987335;stroke-width:2}",
 ".mbt-node[aria-current=step] rect{fill:#fff1d6;stroke:#9a722d;stroke-width:2.6}",
 ".mbt-name{fill:#102e50;font-size:12.5px;font-weight:750}.mbt-value{fill:#597088;font-size:11px;font-weight:650}",
 ".mbt-center rect{fill:#0b2447;stroke:#0b2447}.mbt-center text{fill:#fff}",
 ".mbt-source rect{fill:#eff5fa;stroke:#c3d1df}.mbt-source text{fill:#12324f}",
 ".mbt-root-path{fill:none;stroke:#c2d1e0;stroke-opacity:.8;pointer-events:none}",
 ".mbt-flow{fill:none;stroke:#c5a773;stroke-opacity:.58;pointer-events:none}",
 ".mbt-branch-path{fill:none;stroke:#c0a06b;pointer-events:none}",
 ".mbt-end rect{fill:#fffaf1;stroke:#d0af78;stroke-width:1.4}",
 ".mbt-end a text{fill:#155584;text-decoration:underline}",
 ".mbt-note{font:.72rem/1.55 system-ui;color:#64768b;margin:9px 0;text-align:justify;text-align-last:left}",
 ".mbt-hint{font:.72rem/1.4 system-ui;color:#64768b;margin:0 0 6px}",
 "@media(max-width:650px){.mbt-head strong{font-size:.75rem}.mbt-note,.mbt-hint{font-size:.68rem}}"
 ].join("\n");
 root.append(style);
 if(!ministries.length){
  root.append(html("p","mbt-note","No se dispone de importes ministeriales verificados."));
  return root;
 }
 const total=ministries.reduce((sum,m)=>sum+Number(m.total_mill_eur),0);
 const head=html("div","mbt-head");
 head.append(html("strong","","Presupuestos de los "+ministries.length+" ministerios"),
   html("small","","PGE 2025-P · prorrogado para 2026"));
 root.append(head);
 const trail=html("nav","mbt-trail");trail.setAttribute("aria-label","Ruta de desglose presupuestario");
 const wrap=html("div","mbt-wrap");wrap.tabIndex=0;wrap.setAttribute("role","region");
 wrap.setAttribute("aria-label","Sankey de todos los ministerios con desplazamiento horizontal");
 const hint=html("p","mbt-hint","↔ Selecciona un ministerio, después un área y finalmente un programa");
 const note=html("p","mbt-note","La cifra central es la suma aritmética de las secciones ministeriales seleccionadas de los PGE 2025-P prorrogados para 2026. No es gasto público consolidado S.13 ni acredita pagos. Los importes de programas se concilian dentro de cada ministerio.");
 root.append(trail,hint,wrap,note);
 let chosen=ministries.find(m=>String(m.id)===String(options.selectedId))||null;
 let selectedArea=null,selectedProgram=null;
 // Deep-links usan exactamente la misma ruta jerárquica que la interacción.
 const route=new URLSearchParams(window.location.search);
 if(chosen && route.get("ambito")==="ministerio" &&
    String(chosen.id)===route.get("id")){
   const code=route.get("codigo"),level=route.get("nivel");
   if(level==="area" && groupsOf(chosen).some(a=>a.code===code))
     selectedArea=code;
   else if(level==="programa"){
     const verified=chosen.flows.find(p=>p.code===code);
     if(verified){selectedArea=String(verified.code).charAt(0);selectedProgram=verified.code;}
   }
 }
 const baseW=1320,srcX=20,srcW=340,midX=475,midW=265,rightX=875,nodeW=390;
 const areaX=1455,progX=1950,endX=2445,nodeH=40,rowGap=48;
 function draw(){
  const areas=chosen?groupsOf(chosen):[];
  const area=areas.find(a=>a.code===selectedArea);
  const programs=area?[...area.programs].sort((a,b)=>
    String(a.code).localeCompare(String(b.code),"es",{numeric:true})):[];
  const selected=programs.find(p=>p.code===selectedProgram);
  const H=Math.max(780,105+ministries.length*rowGap,programs.length*53+120);
  const W=selected?endX+nodeW+40:area?progX+nodeW+40:chosen?areaX+nodeW+40:baseW;
  root.dataset.drillLevel=selected?"programa":area?"area":chosen?"ministerio":"general";
  root.dataset.selectedMinistry=chosen?.id||"";
  root.dataset.selectedArea=area?.code||"";
  root.dataset.selectedProgram=selected?.code||"";
  trail.replaceChildren();
  function crumb(t,go,last){
    if(trail.childNodes.length)trail.append(html("span","","›"));
    if(last)trail.append(html("strong","",t));
    else{const b=html("button","",t);b.type="button";b.addEventListener("click",go);trail.append(b);}
  }
  crumb(ministries.length+" ministerios",()=>{chosen=null;selectedArea=null;selectedProgram=null;draw();},!chosen);
  if(chosen)crumb(chosen.name,()=>{selectedArea=null;selectedProgram=null;draw();},!area);
  if(area)crumb(area.code+" · "+area.name,()=>{selectedProgram=null;draw();},!selected);
  if(selected)crumb(selected.code+" · "+selected.name,()=>{},true);
  const el=svg("svg",{class:"mbt-svg",viewBox:"0 0 "+W+" "+H,
    role:"img","aria-label":"Mapa de presupuestos de ministerios, áreas y programas"});
  const scale=Math.max(1,wrap.clientWidth/baseW);
  el.style.width=Math.round(W*scale)+"px";
  el.style.minWidth=Math.round(W*scale)+"px";
  const cy=H/2,boxH=215;
  txt(el,srcX,24,"ORIGEN · PGE 2025-P","mbt-heading");
  txt(el,midX,24,"PRESUPUESTOS MINISTERIALES","mbt-heading");
  txt(el,rightX,24,"22 MINISTERIOS · PULSA PARA ABRIR","mbt-heading");
  if(chosen)txt(el,areaX,24,"ÁREAS DE GASTO · "+shorten(chosen.name.toUpperCase(),29),"mbt-heading");
  if(area)txt(el,progX,24,"PROGRAMAS · "+area.code+" · "+shorten(area.name.toUpperCase(),29),"mbt-heading");
  if(selected)txt(el,endX,24,"DOCUMENTACIÓN DEL PROGRAMA","mbt-heading");
  const indices=ministries.map((m,i)=>({m,y:54+i*rowGap,cy:54+i*rowGap+nodeH/2}));
  el.append(svg("path",{d:"M "+(srcX+srcW)+" "+cy+" C 409 "+cy+" 432 "+cy+" "+midX+" "+cy,
    class:"mbt-root-path","stroke-width":81}));
  indices.forEach((r,i)=>{
    const portY=cy-91+(i+.5)*182/indices.length;
    el.append(svg("path",{d:"M "+(midX+midW)+" "+portY+
      " C 800 "+portY+" 806 "+r.cy+" "+rightX+" "+r.cy,
      class:"mbt-flow","stroke-width":Math.max(1.2,Math.min(14,85*Number(r.m.total_mill_eur)/total))}));
  });
  function big(x,w,title,sub,klass){
    const top=cy-boxH/2,g=svg("g",{class:klass});
    g.append(svg("rect",{x,y:top,width:w,height:boxH,rx:9}));
    txt(g,x+15,top+38,title,"mbt-name");
    txt(g,x+15,top+81,fmt(total),"mbt-name");
    txt(g,x+15,top+115,sub,"mbt-value");
    txt(g,x+15,top+139,"No equivale al total S.13","mbt-value");
    el.append(g);
  }
  big(srcX,srcW,"Suma de secciones","Créditos prorrogados, no ejecución","mbt-source");
  big(midX,midW,"Ministerios","PGE 2025-P · suma de 22","mbt-center");
  function node(x,y,w,h,title,val,code,current,cb){
    const g=svg("g",{class:"mbt-node",role:"button",tabindex:"0",
      "data-code":code,"aria-label":title+" · "+val});
    if(current)g.setAttribute("aria-current","step");
    g.append(svg("rect",{x,y,width:w,height:h,rx:7}));
    txt(g,x+11,y+16,shorten(title,48),"mbt-name");
    txt(g,x+11,y+h-7,val,"mbt-value");
    const t=svg("title");t.textContent=title+" · "+val;g.append(t);
    g.addEventListener("click",cb);
    g.addEventListener("keydown",ev=>{if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();cb();}});
    el.append(g);
  }
  indices.forEach(r=>node(rightX,r.y,nodeW,nodeH,r.m.name,fmt(r.m.total_mill_eur),
    String(r.m.id),chosen?.id===r.m.id,()=>{
      chosen=r.m;selectedArea=null;selectedProgram=null;
      if(typeof options.onSelectMinistry==="function")options.onSelectMinistry(String(chosen.id));
      draw();
    }));
  if(chosen){
    const anchor=indices.find(r=>r.m.id===chosen.id).cy;
    const areaPos=positions(areas,anchor,H,53,43);
    areaPos.forEach(r=>{
      el.append(svg("path",{d:"M "+(rightX+nodeW)+" "+anchor+
        " C "+(rightX+nodeW+65)+" "+anchor+" "+(areaX-65)+" "+r.cy+" "+areaX+" "+r.cy,
        class:"mbt-branch-path", "data-ministry-id":chosen.id,
        "stroke-width":Math.max(1.3,Math.min(12,32*r.item.value_mill_eur/chosen.total_mill_eur))}));
      node(areaX,r.y,nodeW,43,r.item.code+" · "+r.item.name,fmt(r.item.value_mill_eur),
        r.item.code,selectedArea===r.item.code,()=>{
          selectedArea=r.item.code;selectedProgram=null;draw();
        });
    });
    if(area){
      const port=areaPos.find(r=>r.item.code===area.code).cy;
      const ps=positions(programs,port,H,53,44);
      ps.forEach(r=>{
        el.append(svg("path",{d:"M "+(areaX+nodeW)+" "+port+
          " C "+(areaX+nodeW+65)+" "+port+" "+(progX-65)+" "+r.cy+" "+progX+" "+r.cy,
          class:"mbt-branch-path","data-area":area.code,
          "stroke-width":Math.max(1.2,Math.min(10,24*r.item.value_mill_eur/area.value_mill_eur))}));
        node(progX,r.y,nodeW,44,r.item.code+" · "+r.item.name,fmt(r.item.value_mill_eur),
          r.item.code,selectedProgram===r.item.code,()=>{
            selectedProgram=r.item.code;draw();
          });
      });
      if(selected){
        const portY=ps.find(r=>r.item.code===selected.code).cy;
        const y=Math.max(65,Math.min(H-165,portY-70));
        el.append(svg("path",{d:"M "+(progX+nodeW)+" "+portY+
          " C "+(progX+nodeW+65)+" "+portY+" "+(endX-65)+" "+(y+71)+
          " "+endX+" "+(y+71),class:"mbt-branch-path","stroke-width":2,
          "data-program":selected.code}));
        const card=svg("g",{class:"mbt-end"});
        card.append(svg("rect",{x:endX,y,width:nodeW,height:148,rx:9}));
        txt(card,endX+12,y+25,selected.code+" · "+shorten(selected.name,38),"mbt-name");
        txt(card,endX+12,y+52,fmt(selected.value_mill_eur),"mbt-name");
        txt(card,endX+12,y+78,"PGE 2025-P · no es gasto ejecutado","mbt-value");
        txt(card,endX+12,y+99,"Sin capítulos desglosados en la tabla","mbt-value");
        try{
          const u=new URL(chosen.source_url);
          if(u.protocol==="https:"&&u.hostname==="www.sepg.pap.hacienda.gob.es"){
            const a=svg("a",{href:u.href,target:"_blank",rel:"noopener noreferrer"});
            txt(a,endX+12,y+126,"Ver fuente oficial ↗","mbt-name");card.append(a);
          }
        }catch{}
        el.append(card);
      }
    }
  }
  wrap.replaceChildren(el);
  const activeX=selected?endX:area?progX:chosen?areaX:0;
  requestAnimationFrame(()=>wrap.scrollTo({left:Math.max(0,activeX*scale-wrap.clientWidth*.50),behavior:"smooth"}));
 }
 draw();return root;
}
