from pathlib import Path

index = Path('index.html')
s = index.read_text(encoding='utf-8')
s = s.replace('<button class="sound-card" id="marimbaBtn">▶ Escuchar paisaje sonoro</button>', '')
old = '<iframe src="The_Pacific_Paradox.pdf" title="Presentación del proyecto en PDF"></iframe><a class="file-link" href="The_Pacific_Paradox.pdf" target="_blank" rel="noopener">Abrir presentación completa ↗</a>'
new = '''<div class="pdf-slideshow" id="pdfSlideshow" aria-label="Presentación The Pacific Paradox">
<div class="pdf-stage"><canvas id="pdfCanvas"></canvas><div class="pdf-loading" id="pdfLoading">Cargando presentación…</div></div>
<div class="pdf-controls">
<button type="button" id="pdfPrev" class="pdf-control">← Anterior</button>
<span id="pdfPageInfo">Diapositiva — / —</span>
<button type="button" id="pdfNext" class="pdf-control">Siguiente →</button>
</div>
<div class="pdf-actions"><a class="file-link" href="The_Pacific_Paradox.pdf" download="The_Pacific_Paradox.pdf">⬇ Descargar PDF</a><a class="file-link" href="The_Pacific_Paradox.pdf" target="_blank" rel="noopener">Abrir PDF ↗</a></div>
</div>'''
if old not in s:
    raise SystemExit('No se encontró el visor PDF actual en index.html')
s = s.replace(old, new, 1)
css = '''
.pdf-slideshow{margin-top:12px;border:1px solid rgba(255,255,255,.12);border-radius:18px;overflow:hidden;background:rgba(3,15,20,.9)}.pdf-stage{min-height:390px;display:flex;align-items:center;justify-content:center;padding:18px;background:linear-gradient(180deg,rgba(255,255,255,.035),rgba(0,0,0,.12));position:relative}.pdf-stage canvas{display:block;max-width:100%;height:auto;border-radius:10px;box-shadow:0 20px 55px rgba(0,0,0,.35);background:#fff}.pdf-loading{position:absolute;color:rgba(255,255,255,.72);font-weight:600}.pdf-controls{display:flex;align-items:center;justify-content:center;gap:14px;padding:14px 16px;border-top:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035)}.pdf-control{border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#fff;border-radius:999px;padding:9px 14px;cursor:pointer;font-weight:700}.pdf-control:disabled{opacity:.4;cursor:not-allowed}.pdf-actions{display:flex;flex-wrap:wrap;gap:10px;padding:0 16px 16px;justify-content:center}.pdf-actions .file-link{margin-top:0}@media(max-width:760px){.pdf-stage{min-height:260px;padding:10px}.pdf-controls{gap:8px;flex-wrap:wrap}.pdf-actions .file-link{flex:1;justify-content:center}}
'''
if '.pdf-slideshow{' not in s:
    s = s.replace('</style>', css + '</style>', 1)
index.write_text(s, encoding='utf-8')

script = Path('script.js')
js = script.read_text(encoding='utf-8')
if 'initPdfSlideshow' not in js:
    patch = '''

async function initPdfSlideshow(){
  const viewer=document.querySelector('#pdfSlideshow');
  if(!viewer)return;
  const canvas=document.querySelector('#pdfCanvas');
  const ctx=canvas?.getContext('2d');
  const loading=document.querySelector('#pdfLoading');
  const info=document.querySelector('#pdfPageInfo');
  const prev=document.querySelector('#pdfPrev');
  const next=document.querySelector('#pdfNext');
  if(!canvas||!ctx)return;
  try{
    const pdfjs=await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.min.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.worker.min.mjs';
    const pdf=await pdfjs.getDocument('The_Pacific_Paradox.pdf').promise;
    let pageNumber=1;
    async function renderPage(){
      if(loading)loading.hidden=false;
      const page=await pdf.getPage(pageNumber);
      const base=page.getViewport({scale:1});
      const maxWidth=Math.min(viewer.clientWidth-36,1100);
      const scale=Math.max(.5,Math.min(1.8,maxWidth/base.width));
      const viewport=page.getViewport({scale});
      canvas.width=Math.floor(viewport.width);
      canvas.height=Math.floor(viewport.height);
      await page.render({canvasContext:ctx,viewport}).promise;
      if(info)info.textContent=`Diapositiva ${pageNumber} / ${pdf.numPages}`;
      if(prev)prev.disabled=pageNumber<=1;
      if(next)next.disabled=pageNumber>=pdf.numPages;
      if(loading)loading.hidden=true;
    }
    prev?.addEventListener('click',()=>{if(pageNumber>1){pageNumber--;renderPage()}});
    next?.addEventListener('click',()=>{if(pageNumber<pdf.numPages){pageNumber++;renderPage()}});
    addEventListener('resize',()=>renderPage(),{passive:true});
    addEventListener('keydown',e=>{if(e.key==='ArrowLeft'&&pageNumber>1){pageNumber--;renderPage()}if(e.key==='ArrowRight'&&pageNumber<pdf.numPages){pageNumber++;renderPage()}});
    renderPage();
  }catch(error){
    if(loading){loading.hidden=false;loading.textContent='No se pudo cargar la presentación. Puedes descargar el PDF debajo.'}
    console.error('PDF slideshow:',error);
  }
}
initPdfSlideshow();'''
    if '\n})();' not in js:
        raise SystemExit('No se encontró el cierre de script.js')
    js = js.replace('\n})();', patch + '\n})();', 1)
    script.write_text(js, encoding='utf-8')
