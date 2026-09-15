(()=>{'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

/* ===== Animaciones generales ===== */
const progress=$('#progress');
addEventListener('scroll',()=>{if(progress){const h=document.documentElement.scrollHeight-innerHeight;progress.style.width=(h?scrollY/h*100:0)+'%'}},{passive:true});
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.1});
$$('.reveal').forEach(x=>observer.observe(x));
const menu=$('#menuBtn'),nav=$('#mainNav');
menu?.addEventListener('click',()=>nav.style.display=nav.style.display==='flex'?'none':'flex');
nav?.querySelectorAll('a').forEach(a=>a.onclick=()=>{if(innerWidth<901)nav.style.display='none'});
const parallax=$$('.hero-bg,.culture-bg,.challenge-bg,.finale-bg');
addEventListener('scroll',()=>parallax.forEach((x,i)=>x.style.transform=`translateY(${scrollY*(i?-.018:-.035)}px) scale(1.05)`),{passive:true});

/* ===== Selector visual de departamentos ===== */
const locationData={
  choco:{name:'Chocó',image:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Nuqui,%20Choc%C3%B3,%20Colombia.jpg',credit:'Foto: Dwayne Reilander · Wikimedia Commons · CC BY-SA 4.0'},
  valle:{name:'Valle del Cauca',image:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Buenaventura,%20Colombia.jpg',credit:'Foto: Roboting · Wikimedia Commons · CC BY-SA 4.0'},
  cauca:{name:'Cauca',image:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Guapi,%20Cauca,%20un%20destino%20en%20busca%20de%20un%20puerto.jpg',credit:'Foto: Angeles2023 · Wikimedia Commons · CC BY-SA 4.0'},
  narino:{name:'Nariño',image:'https://commons.wikimedia.org/wiki/Special:Redirect/file/TumacoBeach.jpg',credit:'Foto: Daniel Rosasssss · Wikimedia Commons · CC BY-SA 4.0'}
};
const photo=$('.schematic-photo');
const caption=photo?.parentElement?.querySelector('.schematic-caption span');
const locationLabels={choco:'.schematic-label.l1',valle:'.schematic-label.l2',cauca:'.schematic-label.l3',narino:'.schematic-label.l4'};
function selectLocation(key){
  const item=locationData[key];
  if(!item||!photo)return;
  photo.classList.remove('location-change');
  void photo.offsetWidth;
  photo.style.backgroundImage=`linear-gradient(180deg,rgba(3,18,23,.02) 20%,rgba(3,18,23,.72) 100%),url("${item.image}")`;
  photo.classList.add('location-change');
  photo.dataset.location=key;
  if(caption)caption.textContent=`${item.name} · ${item.credit}`;
  Object.entries(locationLabels).forEach(([k,selector])=>$(selector)?.classList.toggle('active',k===key));
}
const locationStyle=document.createElement('style');
locationStyle.textContent=`
.schematic-photo{background-size:cover;background-position:center;transition:background-image .25s ease,transform .35s ease,filter .35s ease;overflow:hidden}
.schematic-photo.location-change{animation:locationPulse .45s ease}
@keyframes locationPulse{0%{opacity:.65;transform:scale(1.025)}100%{opacity:1;transform:scale(1)}}
.schematic-label{cursor:pointer;transition:transform .2s ease,background .2s ease,border-color .2s ease;z-index:4}
.schematic-label:hover,.schematic-label.active{transform:translateY(-2px) scale(1.05);background:rgba(91,230,190,.24);border-color:rgba(139,255,218,.7);box-shadow:0 8px 22px rgba(0,0,0,.22)}
.schematic-caption span{display:block;max-width:90%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
`;
document.head.appendChild(locationStyle);
Object.entries(locationLabels).forEach(([key,selector])=>{const el=$(selector);if(!el)return;el.setAttribute('role','button');el.setAttribute('tabindex','0');el.setAttribute('aria-label',`Mostrar imagen real de ${locationData[key].name}`);el.addEventListener('click',()=>selectLocation(key));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectLocation(key)}})});

/* ===== Información ===== */
const data={
choco:['Chocó','El litoral chocoano combina selvas húmedas, ríos, costa y serranías. Es una pieza importante para comprender la diversidad física y cultural del Pacífico.'],
valle:['Valle del Cauca','El litoral del Valle tiene como referente a Buenaventura y conecta el Pacífico con importantes rutas marítimas y actividades portuarias.'],
cauca:['Cauca','El litoral caucano incluye territorios como Guapi, Timbiquí y López de Micay, con una fuerte relación entre ríos, costa y comunidades.'],
narino:['Nariño','El Pacífico nariñense incluye Tumaco y sectores costeros como Cabo Manglares, con manglares, estuarios y ambientes marinos.'],
relieve:['Serranía del Baudó','El relieve del Pacífico incluye llanuras costeras y elevaciones. La serranía del Baudó es una forma destacada del Pacífico norte.'],
rios:['Ríos que conectan','Atrato, San Juan, Baudó, Mira y Patía aparecen entre los ríos destacados. Los ríos son parte del paisaje y también corredores de movilidad y vida.'],
clima:['Un mundo húmedo','El Pacífico colombiano se caracteriza por precipitaciones abundantes y alta humedad. El clima ayuda a explicar la presencia de bosques y otros ecosistemas húmedos.'],
selva:['Selva húmeda','Los bosques tropicales forman hábitats para numerosas especies y están conectados con ríos y otros ecosistemas.'],
manglar:['Manglares','Los manglares se encuentran en la transición entre tierra y mar y cumplen funciones ecológicas importantes en las zonas costeras.'],
estuario:['Estuarios','Son espacios donde se relacionan aguas continentales y marinas. En ellos confluyen procesos ecológicos y dinámicas humanas.'],
arrecife:['Arrecifes','Los arrecifes coralinos presentes en sectores del Pacífico insular ofrecen refugio y zonas de alimentación para organismos marinos.'],
playa:['Playas','Las playas hacen parte del paisaje costero y pueden ser utilizadas por especies para reproducción o alimentación.'],
yubarta:['Yubarta','Las ballenas jorobadas llegan a aguas del Pacífico colombiano durante su migración reproductiva. Son uno de los grandes espectáculos naturales de la costa.'],
tortugas:['Tortugas marinas','Distintas especies utilizan las aguas y playas del Pacífico para alimentación, refugio o reproducción.'],
aves:['Aves','La combinación de selva, manglares, ríos y costa genera una gran variedad de hábitats para aves.'],
corales:['Arrecifes coralinos','En lugares como Gorgona existen arrecifes y ambientes marinos asociados a una alta diversidad de organismos.'],
territorio:['Comunidades y territorio','Los ríos y el litoral influyen en movilidad, alimentación, trabajo y organización comunitaria. El territorio no es solo paisaje: también es espacio de vida.'],
oralidad:['Tradición oral','Historias, cantos y saberes se transmiten entre generaciones. La oralidad ayuda a conservar memoria e identidad colectiva.'],
diversidad:['Diversidad cultural','El Pacífico reúne una fuerte presencia afrocolombiana y pueblos indígenas, junto con conocimientos y expresiones culturales propias.'],
currulao:['Currulao','El currulao es una de las expresiones musicales asociadas al Pacífico Sur y a la tradición de la marimba de chonta.'],
arrullo:['Arrullo','El arrullo forma parte de las prácticas musicales y comunitarias tradicionales del Pacífico Sur.'],
alabao:['Alabao','El alabao es una expresión vocal tradicional vinculada a la memoria y a prácticas comunitarias.'],
juga:['Juga','La juga hace parte del repertorio tradicional de músicas y cantos del Pacífico Sur.'],
agricultura:['Agricultura','La agricultura hace parte de las actividades económicas regionales y se relaciona con producción local y medios de vida.'],
pesca:['Pesca','La pesca puede desarrollarse de manera artesanal y comercial y está directamente vinculada con el ambiente marino y los ríos.'],
'mineria-economia':['Minería','La minería es una actividad económica presente en territorios del Pacífico y también aparece como tema de análisis por sus impactos ambientales cuando se realiza sin control.'],
puertos:['Puertos','La actividad portuaria conecta el litoral con redes comerciales y de transporte. Buenaventura es un referente fundamental.'],
turismo:['Turismo','El turismo de naturaleza y cultura puede aprovechar paisajes, áreas protegidas y patrimonio, siempre considerando la conservación y las comunidades.'],
forestal:['Actividad forestal','Los recursos forestales tienen importancia económica y ambiental. Su aprovechamiento plantea la necesidad de considerar manejo y sostenibilidad.'],
utria:['Parque Nacional Natural Utría','Utría protege selva, manglares, playas y ambientes marino-costeros en Chocó. Es además un lugar relacionado con el paso de especies migratorias.'],
gorgona:['Parque Nacional Natural Gorgona','Gorgona reúne selva húmeda tropical, manglares, playas, litoral rocoso y arrecifes coralinos, con una importante diversidad terrestre y marina.'],
malaga:['Uramba Bahía Málaga','Es un área protegida del Pacífico vinculada a ecosistemas marino-costeros y a comunidades locales.'],
'manglares-sur':['Cabo Manglares','Zona costera del extremo sur del Pacífico colombiano asociada a manglares, estuarios y biodiversidad.'],
deforestacion:['Deforestación','La pérdida de cobertura vegetal puede afectar biodiversidad, suelos, agua y formas de vida relacionadas con el bosque.'],
'mineria':['Minería ilegal','La extracción no autorizada puede generar impactos sobre ecosistemas y fuentes hídricas y relacionarse con conflictos territoriales.'],
desigualdad:['Desigualdad y acceso','El desafío incluye acceso a servicios, conectividad y oportunidades. Conviene observar diferencias territoriales y consultar indicadores antes de sacar conclusiones.'],
presion:['Presión sobre ecosistemas','Contaminación, sobreexplotación y cambio climático pueden aumentar la presión sobre ecosistemas costeros y terrestres.']
};
const modal=$('#modal'),title=$('#modalTitle'),body=$('#modalBody');
function openInfo(k){const d=data[k];if(!d)return;if(title)title.textContent=d[0];if(body)body.innerHTML=`<p>${d[1]}</p><p><b>Para investigar:</b> compara fuentes, identifica un dato verificable y relaciónalo con el territorio.</p>`;modal?.classList.add('show');modal?.setAttribute('aria-hidden','false')}
$$('[data-info]').forEach(x=>x.addEventListener('click',()=>{if(locationData[x.dataset.info])selectLocation(x.dataset.info);openInfo(x.dataset.info)}));
$('#modalClose')?.addEventListener('click',()=>{modal.classList.remove('show');modal.setAttribute('aria-hidden','true')});
modal?.addEventListener('click',e=>{if(e.target===modal){modal.classList.remove('show');modal.setAttribute('aria-hidden','true')}});
addEventListener('keydown',e=>{if(e.key==='Escape'){modal?.classList.remove('show');modal?.setAttribute('aria-hidden','true')}});
selectLocation('choco');

/* ===== Ambiente sonoro ===== */
let audio=null,master=null,amb=false;
function audioStart(){
  if(!audio){audio=new (window.AudioContext||window.webkitAudioContext)();master=audio.createGain();master.gain.value=.001;master.connect(audio.destination);const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=82;g.gain.value=.11;o.connect(g).connect(master);o.start();const l=audio.createOscillator(),lg=audio.createGain();l.frequency.value=.08;lg.gain.value=25;l.connect(lg).connect(o.frequency);l.start()}
  if(audio.state==='suspended')audio.resume();amb=!amb;master.gain.setTargetAtTime(amb?.05:.001,audio.currentTime,.25);if($('#soundBtn'))$('#soundBtn').textContent=amb?'◉ Ambiente activo':'◉ Activar ambiente'
}
$('#soundBtn')?.addEventListener('click',audioStart);
$('#marimbaBtn')?.addEventListener('click',()=>{if(!audio)audioStart();const notes=[261.63,329.63,392,523.25,392,329.63,293.66,349.23];notes.forEach((f,i)=>setTimeout(()=>{const o=audio.createOscillator(),g=audio.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.0001,audio.currentTime);g.gain.exponentialRampToValueAtTime(.09,audio.currentTime+.025);g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+.5);o.connect(g).connect(master);o.start();o.stop(audio.currentTime+.55)},i*230))});

/* ===== Pestañas de juegos ===== */
$$('.game-tabs button').forEach(b=>b.onclick=()=>{$$('.game-tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');$$('.game-panel').forEach(x=>x.classList.remove('active'));$('#game'+b.dataset.game[0].toUpperCase()+b.dataset.game.slice(1))?.classList.add('active')});

/* ===== Quiz ===== */
const qs=[
['¿Qué cuatro departamentos forman la agrupación Pacífica usada por el DANE?',['Cauca, Chocó, Nariño y Valle del Cauca','Antioquia, Chocó, Cauca y Huila','Nariño, Tolima, Cauca y Meta','Chocó, Valle, Risaralda y Antioquia'],0],
['¿Cuál es un río destacado del Pacífico?',['Atrato','Bogotá','Guaviare','Cesar'],0],
['¿Qué instrumento está relacionado con las músicas tradicionales del Pacífico Sur?',['Marimba de chonta','Arpa llanera','Acordeón vallenato','Bandola andina'],0],
['¿Qué ecosistema aparece en Gorgona?',['Arrecifes coralinos','Desierto de dunas','Sabanas de la Orinoquía','Glaciares'],0],
['¿Qué gran mamífero migratorio llega al Pacífico colombiano?',['Ballena jorobada','Oso polar','Reno','Pingüino emperador'],0],
['¿Qué parque nacional está en Chocó?',['Utría','Tayrona','El Cocuy','El Tuparro'],0],
['¿Qué actividad pertenece al sector de servicios?',['Turismo','Minería','Pesca','Agricultura'],0],
['¿Qué debe hacer una investigación responsable?',['Contrastar y verificar fuentes','Copiar una sola página','Evitar registrar fuentes','Usar datos sin fecha'],0]
];
let qi=0,score=0,answered=false;const qText=$('#qText'),qOptions=$('#qOptions'),qFeedback=$('#qFeedback'),next=$('#nextQ');
function resetQuiz(){qi=0;score=0;if(next){next.textContent='Siguiente →';next.classList.add('hidden')}renderQ()}
function renderQ(){const q=qs[qi];answered=false;if($('#qCount'))$('#qCount').textContent=`Pregunta ${qi+1} / ${qs.length}`;if($('#qScore'))$('#qScore').textContent=`Puntos: ${score}`;if($('#qBar'))$('#qBar').style.width=`${(qi+1)/qs.length*100}%`;if(qText)qText.textContent=q[0];if(qOptions)qOptions.innerHTML='';if(qFeedback)qFeedback.textContent='';next?.classList.add('hidden');q[1].forEach((o,i)=>{const b=document.createElement('button');b.className='option';b.textContent=o;b.onclick=()=>{if(answered)return;answered=true;qOptions.querySelectorAll('button').forEach((x,j)=>{x.disabled=true;if(j===q[2])x.classList.add('correct');if(j===i&&i!==q[2])x.classList.add('wrong')});if(i===q[2]){score++;qFeedback.textContent='✓ Correcto. Sigue explorando para conectar este dato con el territorio.'}else qFeedback.textContent='✦ Revisa la respuesta correcta y vuelve a intentarlo.';if($('#qScore'))$('#qScore').textContent=`Puntos: ${score}`;next?.classList.remove('hidden')};qOptions?.appendChild(b)})}
next?.addEventListener('click',()=>{if(qi<qs.length-1){qi++;renderQ()}else{if(qText)qText.textContent=`Resultado: ${score} / ${qs.length}`;if(qOptions)qOptions.innerHTML='';if(qFeedback)qFeedback.textContent=score>=6?'¡Recorrido completado!':'Buen comienzo: vuelve a explorar las secciones y prueba otra vez.';next.textContent='Repetir';next.classList.remove('hidden');next.onclick=resetQuiz}});
renderQ();

/* ===== Memoria ===== */
const symbols=['🐋','🌿','🎶','🌊','🐋','🌿','🎶','🌊'];let first=null,lock=false,found=0,moves=0;
function memory(){const board=$('#memoryBoard');if(!board)return;board.innerHTML='';first=null;lock=false;found=0;moves=0;if($('#memoryMoves'))$('#memoryMoves').textContent='Movimientos: 0';symbols.slice().sort(()=>Math.random()-.5).forEach(s=>{const b=document.createElement('button');b.className='memory-card';b.textContent='?';b.dataset.symbol=s;b.onclick=()=>{if(lock||b===first||b.classList.contains('flipped'))return;b.classList.add('flipped');b.textContent=s;if(!first){first=b;return}moves++;if($('#memoryMoves'))$('#memoryMoves').textContent=`Movimientos: ${moves}`;if(first.dataset.symbol===b.dataset.symbol){found+=2;first=null;if(found===symbols.length&&$('#memoryMoves'))$('#memoryMoves').textContent=`¡Completado en ${moves} movimientos!`}else{lock=true;setTimeout(()=>{first?.classList.remove('flipped');if(first)first.textContent='?';b.classList.remove('flipped');b.textContent='?';first=null;lock=false},650)}};board.appendChild(b)})}
$('#memoryReset')?.addEventListener('click',memory);memory();

/* ===== Ruta del río ===== */
let rs=0;const steps=[['¿Dónde nace el río?','⛰️ En zonas altas o nacientes'],['¿Por dónde continúa?','🌿 Por su cauce y ecosistemas ribereños'],['¿Qué conecta?','🏘️ Comunidades y territorios'],['¿Dónde termina?','🌊 En su desembocadura']];
function river(){const box=$('#riverChoices');if(!box)return;box.innerHTML='';if(rs===steps.length){if($('#riverResult'))$('#riverResult').textContent='✓ Ruta completada. Has seguido el agua desde su nacimiento hasta el mar.';return}if($('#riverResult'))$('#riverResult').textContent=steps[rs][0];const opts=[steps[rs][1],'🌵 Una zona sin relación con el río','🏜️ Un paisaje completamente seco'];opts.sort(()=>Math.random()-.5).forEach(o=>{const b=document.createElement('button');b.className='river-choice';b.textContent=o;b.onclick=()=>{if(o===steps[rs][1]){rs++;river()}else if($('#riverResult'))$('#riverResult').textContent='✦ Piensa en el recorrido natural del agua y vuelve a elegir.'};box.appendChild(b)})}
river();
})();