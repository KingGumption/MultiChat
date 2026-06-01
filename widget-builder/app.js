(function(){
  const preset = document.getElementById('animation-preset');
  const type = document.getElementById('animation-type');
  const animateMessages = document.getElementById('animate-messages');
  const animateAlerts = document.getElementById('animate-alerts');
  const animateGifts = document.getElementById('animate-gifts');
  const preview = document.getElementById('preview-area');
  const addMessage = document.getElementById('add-message');
  const addAlert = document.getElementById('add-alert');
  const addGift = document.getElementById('add-gift');
  const clearBtn = document.getElementById('clear');
  const exportBtn = document.getElementById('export');

  let idCounter = 1;

  function makeNode(kind, text){
    const el = document.createElement('div');
    el.className = 'msg ' + kind;
    el.dataset.kind = kind;
    el.innerHTML = `<strong>${kind.toUpperCase()}</strong><div class=small>${text}</div>`;
    applyAnimationClass(el);
    // remove after 12s
    setTimeout(()=>{
      el.classList.add('hidden');
      setTimeout(()=>el.remove(),300);
    },12000);
    return el;
  }

  function applyAnimationClass(el){
    const t = type.value || 'default';
    const p = preset.value || 'normal';
    const speedMap = {fast:0.12,subtle:0.16,normal:0.24,slow:0.42};
    document.documentElement.style.setProperty('--pop-duration', (speedMap[p] || 0.24)+'s');

    // decide whether to animate this kind
    const kind = el.dataset.kind;
    if(kind==='alert' && !animateAlerts.checked){ el.classList.remove('anim-pop','anim-slide','anim-dissolve','anim-bounce'); return }
    if(kind==='gift' && !animateGifts.checked){ el.classList.remove('anim-pop','anim-slide','anim-dissolve','anim-bounce'); return }
    if(kind==='msg' && !animateMessages.checked){ el.classList.remove('anim-pop','anim-slide','anim-dissolve','anim-bounce'); return }

    el.classList.remove('anim-pop','anim-slide','anim-dissolve','anim-bounce');
    const map = {default:'anim-pop',slide:'anim-slide',dissolve:'anim-dissolve',bounce:'anim-bounce'};
    el.classList.add(map[t] || 'anim-pop');
  }

  function add(kind){
    const text = kind==='msg' ? `Hello viewer ${idCounter++}` : (kind==='alert' ? `Donation! $${(Math.random()*30+1).toFixed(2)}` : `Gift x${Math.floor(Math.random()*10+1)}`);
    const node = makeNode(kind,text);
    preview.prepend(node);
  }

  addMessage.addEventListener('click', ()=>add('msg'));
  addAlert.addEventListener('click', ()=>add('alert'));
  addGift.addEventListener('click', ()=>add('gift'));
  clearBtn.addEventListener('click', ()=>preview.innerHTML='');

  // live update animations when settings change
  [preset,type,animateMessages,animateAlerts,animateGifts].forEach(el=>el.addEventListener('change',()=>{
    preview.querySelectorAll('.msg').forEach(applyAnimationClass);
  }));

  exportBtn.addEventListener('click', ()=>{
    const cfg = {
      preset: preset.value,
      type: type.value,
      messages: animateMessages.checked,
      alerts: animateAlerts.checked,
      gifts: animateGifts.checked
    };
    const content = generateWidgetHtml(cfg);
    const blob = new Blob([content], {type:'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'widget.html';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  function generateWidgetHtml(cfg){
    // minimal standalone HTML for OBS
    const css = `:root{--pop-duration:0.24s}html,body{margin:0;background:transparent}body{font-family:Inter,Arial,sans-serif;color:#fff}
.msg{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border-radius:10px;background:rgba(0,0,0,0.28);margin:8px}
.alert{background:rgba(255,255,255,0.03)}
.gift{background:rgba(255,255,255,0.02)}
@keyframes popIn{from{opacity:0;transform:translateY(12px) scale(.98}}to{opacity:1;transform:none}}
@keyframes slideIn{from{opacity:0;transform:translateX(-20px) scale(.98}}to{opacity:1;transform:none}}
@keyframes dissolveIn{from{opacity:0;transform:scale(.99)}to{opacity:1;transform:none}}
@keyframes bounceIn{0%{opacity:0;transform:translateY(22px) scale(.95)}60%{opacity:1;transform:translateY(-6px) scale(1.02)}100%{transform:none}}
.anim-pop{animation:popIn var(--pop-duration) ease-out}
.anim-slide{animation:slideIn var(--pop-duration) ease-out}
.anim-dissolve{animation:dissolveIn var(--pop-duration) ease-out}
.anim-bounce{animation:bounceIn var(--pop-duration) cubic-bezier(.17,.89,.32,1.28)}
`;
    const js = `(()=>{
      const cfg = ${JSON.stringify(cfg)};
      const speedMap = {fast:0.12,subtle:0.16,normal:0.24,slow:0.42};
      document.documentElement.style.setProperty('--pop-duration', (speedMap[cfg.preset]||0.24)+'s');
      const preview = document.getElementById('preview');
      let id=1;
      function add(kind,text){
        const el=document.createElement('div');
        el.className='msg '+(kind==='msg'? 'msg' : kind);
        el.innerHTML = `<strong>${kind.toUpperCase()}</strong><div style="font-size:13px;opacity:.9">${text}</div>`;
        if((kind==='msg' && cfg.messages) || (kind==='alert' && cfg.alerts) || (kind==='gift' && cfg.gifts)){
          const map={default:'anim-pop',slide:'anim-slide',dissolve:'anim-dissolve',bounce:'anim-bounce'};
          el.classList.add(map[cfg.type]||'anim-pop');
        }
        preview.prepend(el);
        setTimeout(()=>{el.style.opacity=0;setTimeout(()=>el.remove(),300)},12000);
      }
      // simple demo feed
      add('msg','Welcome to the widget');
      setInterval(()=>{
        const r=Math.random();
        if(r<0.6) add('msg','Hello viewer '+(id++));
        else if(r<0.85) add('alert','Donation $'+(Math.random()*30+1).toFixed(2));
        else add('gift','Gift x'+Math.floor(Math.random()*8+1));
      },2500);
    })();`;

    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Widget</title><style>${css}</style></head><body><div id="preview"></div><script>${js}</script></body></html>`;
  }

  // add a few sample messages on load
  add('msg'); add('msg');
})();
