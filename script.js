// Pacífico Colombiano — interacción educativa
(function(){
  'use strict';

  // Limpia referencias internas que solo sirven para documentación de la construcción.
  document.addEventListener('DOMContentLoaded',()=>{
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(n=>{n.nodeValue=n.nodeValue.replace(/(?:cite|filecite)[^]+/g,'')});
  });

  const progress=document.getElementById('progress');
  window.addEventListener('scroll',()=>{
    const h=document.documentElement.scrollHeight-innerHeight;
    progress.style.width=(h>0?(scrollY/h)*100:0)+'%';
  },{passive:true});

  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}
  }),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

  const menuBtn=document.getElementById('menuBtn'),nav=document.getElementById('mainNav');
  menuBtn?.addEventListener('click',()=>{nav.style.display=nav.style.display==='flex'?'none':'flex'});
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{if(innerWidth<901)nav.style.display='none'}));

  // Parallax ligero para las fotografías principales.
  const parallaxEls=document.querySelectorAll('.hero-bg,.culture-bg,.challenge-bg,.finale-bg');
  window.addEventListener('scroll',()=>{
    const y=scrollY;
    parallaxEls.forEach((el,i)=>{const factor=i===0?.055:.025;el.style.transform=`translateY(${y*factor}px) scale(1.06)`});
  },{passive:true});

  // Paisaje sonoro sintético, sin archivos externos.
  let audioCtx=null, ambience=false, master=null;
  function startAmbience(){
    if(!audioCtx){
      audioCtx=new (window.AudioContext||window.webkitAudioContext)();
      master=audioCtx.createGain();master.gain.value=.035;master.connect(audioCtx.destination);
      const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type='sine';osc.frequency.value=92;gain.gain.value=.15;osc.connect(gain).connect(master);osc.start();
      const lfo=audioCtx.createOscillator(),lg=audioCtx.createGain();lfo.frequency.value=.08;lg.gain.value=35;lfo.connect(lg);lg.connect(osc.frequency);lfo.start();
    }
    if(audioCtx.state==='suspended')audioCtx.resume();
    ambience=!ambience;master.gain.setTargetAtTime(ambience?.055:.001,audioCtx.currentTime,.25);
  }
  document.getElementById('soundBtn')?.addEventListener('click',startAmbience);
  document.getElementById('marimbaBtn')?.addEventListener('click',()=>{
    if(!audioCtx)startAmbience();
    if(!audioCtx)return;
    const notes=[261.63,329.63,392,523.25,392,329.63];
    notes.forEach((f,i)=>setTimeout(()=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.09,audioCtx.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.55);o.connect(g).connect(master);o.start();o.stop(audioCtx.currentTime+.6)},i*260));
  });

  // Retos / problemáticas.
  const modal=document.getElementById('modal'),close=document.getElementById('modalClose'),mt=document.getElementById('modalTitle'),mb=document.getElementById('modalBody');
  const modalData={
    deforestacion:{title:'Deforestación',body:'<p><b>¿Qué ocurre?</b> La pérdida de cobertura boscosa puede reducir hábitats y alterar suelos y agua.</p><p><b>Preguntas para investigar:</b></p><ul><li>¿Qué actividades generan presión sobre el bosque?</li><li>¿Cómo afecta a comunidades que dependen del territorio?</li><li>¿Qué alternativas de manejo sostenible existen?</li></ul>'},
    mineria:{title:'Minería ilegal',body:'<p><b>¿Qué ocurre?</b> La extracción no autorizada puede producir impactos sobre ecosistemas y fuentes hídricas y relacionarse con conflictos territoriales.</p><p><b>Reto:</b> compara una fuente ambiental con una fuente social y construye una propuesta de prevención.</p>'},
    desigualdad:{title:'Desigualdad y acceso',body:'<p>El proyecto pide observar pobreza, desigualdad, desplazamiento y acceso a educación y salud. En lugar de reducir el problema a una sola causa, investiga indicadores, diferencias territoriales y políticas públicas.</p><p><b>Reto:</b> diseña una solución digital que ayude a comunicar servicios y oportunidades disponibles.</p>'},
    ecosistemas:{title:'Presión sobre ecosistemas',body:'<p>Los ecosistemas marino-costeros y terrestres pueden recibir presión por contaminación, cambio climático y sobreexplotación de recursos.</p><p><b>Reto:</b> elige un ecosistema y crea una cadena “presión → efecto → respuesta”.</p>'}
  };
  document.querySelectorAll('[data-modal]').forEach(b=>b.addEventListener('click',()=>{const d=modalData[b.dataset.modal];mt.textContent=d.title;mb.innerHTML=d.body;modal.classList.add('show');modal.setAttribute('aria-hidden','false')}));
  function closeModal(){modal.classList.remove('show');modal.setAttribute('aria-hidden','true')};close?.addEventListener('click',closeModal);modal?.addEventListener('click',e=>{if(e.target===modal)closeModal()});

  // Juegos.
  document.querySelectorAll('.game-tabs button').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.game-tabs button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
    document.querySelectorAll('.game-panel').forEach(x=>x.classList.remove('active'));
    document.getElementById('game'+btn.dataset.game.charAt(0).toUpperCase()+btn.dataset.game.slice(1)).classList.add('active');
  }));

  const questions=[
    {q:'¿Qué cuatro departamentos conforman la agrupación Pacífica usada por el DANE?',o:['Cauca, Chocó, Nariño y Valle del Cauca','Antioquia, Chocó, Cauca y Huila','Nariño, Tolima, Cauca y Meta','Chocó, Valle, Risaralda y Antioquia'],a:0,e:'El DANE agrupa la Región Pacífica con Cauca, Chocó, Nariño y Valle del Cauca.'},
    {q:'¿Cuál de estos es un río destacado del Pacífico?',o:['Atrato','Bogotá','Guaviare','Cesar'],a:0,e:'El Atrato es uno de los grandes ríos de la región.'},
    {q:'¿Qué instrumento está estrechamente relacionado con las músicas tradicionales del Pacífico Sur?',o:['Marimba de chonta','Arpa llanera','Acordeón vallenato','Bandola andina'],a:0,e:'La marimba de chonta es parte central de esta manifestación cultural.'},
    {q:'¿Qué ecosistema aparece en áreas protegidas como Gorgona?',o:['Arrecifes coralinos','Desierto de dunas','Sabanas de la Orinoquía','Glaciares'],a:0,e:'Gorgona reúne, entre otros, arrecifes coralinos, selva, manglares y playas.'},
    {q:'¿Qué animal migratorio llega a aguas cálidas del Pacífico colombiano?',o:['Ballena jorobada','Oso polar','Reno','Pingüino emperador'],a:0,e:'Las yubartas realizan una larga migración hacia estas aguas para reproducirse.'},
    {q:'¿Qué parque nacional se ubica en Chocó y tiene selva, manglares y ambientes marinos?',o:['Utría','Tayrona','Sierra Nevada del Cocuy','El Tuparro'],a:0,e:'El PNN Utría está en Chocó y protege ecosistemas marino-costeros y terrestres.'},
    {q:'¿Qué actividad pertenece al sector terciario?',o:['Turismo','Minería','Pesca','Agricultura'],a:0,e:'El turismo forma parte del sector de servicios.'},
    {q:'¿Qué busca una investigación responsable según la guía del proyecto?',o:['Contrastar fuentes y verificar datos','Copiar una sola página','Evitar registrar fuentes','Usar datos sin fecha'],a:0,e:'La guía recomienda consultar, comparar y verificar fuentes.'}
  ];
  let qi=0,score=0,answered=false;const qText=document.getElementById('qText'),qOptions=document.getElementById('qOptions'),qFeedback=document.getElementById('qFeedback'),nextQ=document.getElementById('nextQ'),qCount=document.getElementById('qCount'),qScore=document.getElementById('qScore'),qBar=document.getElementById('qBar');
  function renderQ(){
    const x=questions[qi];answered=false;qCount.textContent=`Pregunta ${qi+1} / ${questions.length}`;qScore.textContent=`Puntos: ${score}`;qBar.style.width=`${((qi+1)/questions.length)*100}%`;qText.textContent=x.q;qFeedback.textContent='';nextQ.classList.add('hidden');qOptions.innerHTML='';
    x.o.forEach((opt,i)=>{const b=document.createElement('button');b.className='option';b.textContent=opt;b.onclick=()=>answerQ(i,b);qOptions.appendChild(b)});
  }
  function answerQ(i,b){if(answered)return;answered=true;const x=questions[qi];qOptions.querySelectorAll('button').forEach((el,j)=>{if(j===x.a)el.classList.add('correct');if(j===i&&i!==x.a)el.classList.add('wrong');el.disabled=true});if(i===x.a){score++;qFeedback.textContent='✓ Correcto. '+x.e}else qFeedback.textContent='✦ Casi. '+x.e;qScore.textContent=`Puntos: ${score}`;nextQ.classList.remove('hidden');}
  nextQ.onclick=()=>{if(qi<questions.length-1){qi++;renderQ()}else{qText.textContent=`Resultado: ${score} / ${questions.length}`;qOptions.innerHTML='';qFeedback.textContent=score>=6?'¡Excelente recorrido! Ya tienes una buena base para seguir investigando.':'Buen comienzo. Revisa las secciones y vuelve a intentarlo.';nextQ.textContent='Repetir';nextQ.classList.remove('hidden');nextQ.onclick=()=>{qi=0;score=0;nextQ.textContent='Siguiente →';nextQ.onclick=()=>{if(qi<questions.length-1){qi++;renderQ()}};renderQ()}}};
  renderQ();

  // Memoria.
  const memorySymbols=['🐋','🌿','🎶','🌊','🐋','🌿','🎶','🌊'];let first=null,lock=false,moves=0,found=0;const board=document.getElementById('memoryBoard'),movesEl=document.getElementById('memoryMoves');
  function shuffle(a){return a.sort(()=>Math.random()-.5)}
  function buildMemory(){board.innerHTML='';first=null;lock=false;moves=0;found=0;movesEl.textContent='Movimientos: 0';shuffle([...memorySymbols]).forEach((s,i)=>{const b=document.createElement('button');b.className='memory-card';b.textContent='?';b.dataset.symbol=s;b.onclick=()=>flip(b);board.appendChild(b)})}
  function flip(card){if(lock||card===first||card.classList.contains('flipped'))return;card.classList.add('flipped');card.textContent=card.dataset.symbol;if(!first){first=card;return}moves++;movesEl.textContent=`Movimientos: ${moves}`;if(first.dataset.symbol===card.dataset.symbol){found+=2;first=null;if(found===memorySymbols.length)setTimeout(()=>alert('¡Memoria completa! Has encontrado todos los símbolos del Pacífico.'),250)}else{lock=true;setTimeout(()=>{first.classList.remove('flipped');first.textContent='?';card.classList.remove('flipped');card.textContent='?';first=null;lock=false},650)}}
  document.getElementById('memoryReset')?.addEventListener('click',buildMemory);buildMemory();

  // Ruta del río.
  const riverSteps=[{text:'¿Dónde nace el río?',ok:'⛰️ En zonas altas o nacientes'},{text:'¿Por dónde continúa?',ok:'🌿 Por su cauce y ecosistemas ribereños'},{text:'¿Qué conecta?',ok:'🏘️ Comunidades y territorios'},{text:'¿Dónde termina el recorrido?',ok:'🌊 En su desembocadura, hacia otro cuerpo de agua'}];let rs=0;const rc=document.getElementById('riverChoices'),rr=document.getElementById('riverResult');
  function renderRiver(){rc.innerHTML='';if(rs===riverSteps.length){rr.textContent='✓ Ruta completada. Los ríos son sistemas naturales y también corredores de vida y conexión territorial.';return}rr.textContent='';riverSteps[rs].choices=[riverSteps[rs].ok,'🌵 Una zona desértica sin agua','🏜️ Un paisaje sin relación con el río'];riverSteps[rs].choices.sort(()=>Math.random()-.5).forEach(c=>{const b=document.createElement('button');b.className='river-choice';b.textContent=c;b.onclick=()=>{if(c===riverSteps[rs].ok){rs++;renderRiver()}else rr.textContent='✦ Observa la pregunta: piensa en el recorrido natural del agua.'};rc.appendChild(b)})}
  renderRiver();
})();
