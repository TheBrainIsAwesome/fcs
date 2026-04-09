// © 2026 TheBrain 
// Dodge Calculator v3 — Alert System + Sound Settings + Travel Calc + History

(function () {
    if (document.getElementById('__dodge_calc')) return;

    // ─── STYLES ──────────────────────────────────────────────────────────────────
    var s = document.createElement('style');
    s.textContent = [
        '#__dc{position:fixed;top:20px;right:20px;width:360px;background:#111;color:#eee;border:1px solid #3a3a3a;border-radius:10px;z-index:999999;font-family:system-ui,sans-serif;font-size:13px;box-shadow:0 4px 24px rgba(0,0,0,.7);}',
        '#__dc .dc-header{padding:14px 16px 10px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #2a2a2a;cursor:grab;}',
        '#__dc .dc-header:active{cursor:grabbing;}',
        '#__dc .dc-title{font-size:14px;font-weight:600;color:#fff;letter-spacing:.5px;}',
        '#__dc .dc-header-btns{display:flex;gap:6px;align-items:center;}',
        '#__dc .ic-btn{background:none;border:none;color:#666;cursor:pointer;font-size:13px;padding:2px 5px;border-radius:4px;}',
        '#__dc .ic-btn:hover{color:#ccc;background:#222;}',
        '#__dc .tabs{display:flex;border-bottom:1px solid #2a2a2a;}',
        '#__dc .tab{flex:1;padding:8px 4px;text-align:center;font-size:11px;color:#666;cursor:pointer;border:none;background:none;transition:color .15s;}',
        '#__dc .tab:hover{color:#aaa;}',
        '#__dc .tab.active{color:#6af;border-bottom:2px solid #6af;}',
        '#__dc .tab-body{padding:14px 16px;}',
        '#__dc .tab-pane{display:none;}',
        '#__dc .tab-pane.active{display:block;}',
        '#__dc label{display:block;font-size:11px;color:#888;margin:10px 0 4px;}',
        '#__dc input[type=text],#__dc input[type=number]{width:100%;background:#1a1a1a;color:#fff;border:1px solid #2e2e2e;border-radius:5px;padding:6px 8px;font-size:13px;box-sizing:border-box;outline:none;}',
        '#__dc input[type=text]:focus,#__dc input[type=number]:focus{border-color:#3a5a8a;}',
        '#__dc input[type=range]{width:100%;accent-color:#6af;margin:4px 0;}',
        '#__dc .row2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}',
        '#__dc .row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;}',
        '#__dc .btn-primary{width:100%;margin-top:10px;padding:9px;background:#2a4a8a;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;font-weight:500;}',
        '#__dc .btn-primary:hover{background:#3a5aaa;}',
        '#__dc .btn-stop{width:100%;margin-top:6px;padding:7px;background:#2a1010;color:#f88;border:1px solid #4a2020;border-radius:6px;cursor:pointer;font-size:12px;display:none;}',
        '#__dc .btn-stop:hover{background:#3a1818;}',
        '#__dc .btn-sm{padding:5px 10px;font-size:11px;border:1px solid #333;background:#1a1a1a;color:#aaa;border-radius:5px;cursor:pointer;}',
        '#__dc .btn-sm:hover{border-color:#6af;color:#6af;}',
        '#__dc .badge{display:inline-block;padding:3px 8px;border-radius:4px;font-size:11px;margin-bottom:6px;}',
        '#__dc .ok{background:#152515;color:#5d5;}',
        '#__dc .warn{background:#2a2000;color:#ca4;}',
        '#__dc .err{background:#2a0f0f;color:#d66;}',
        '#__dc .info{background:#0f1e30;color:#6af;}',
        '#__dc .hint{font-size:10px;color:#444;margin-top:3px;}',
        '#__dc .res-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #1e1e1e;}',
        '#__dc .res-row:last-child{border:none;}',
        '#__dc .res-lbl{color:#777;font-size:12px;}',
        '#__dc .res-val{font-family:monospace;font-weight:500;font-size:12px;}',
        '#__dc .cd-box{text-align:center;font-size:28px;font-family:monospace;font-weight:700;padding:10px;background:#0a0a0a;border:1px solid #222;border-radius:6px;margin:10px 0 2px;letter-spacing:2px;transition:color .3s;}',
        '#__dc .cd-lbl{font-size:10px;color:#444;text-align:center;margin-bottom:8px;}',
        '#__dc .section-title{font-size:11px;color:#555;text-transform:uppercase;letter-spacing:.8px;margin:12px 0 8px;border-bottom:1px solid #1e1e1e;padding-bottom:4px;}',
        '#__dc .cb-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;}',
        '#__dc .cb-row input[type=checkbox]{width:auto;margin:0;accent-color:#6af;cursor:pointer;}',
        '#__dc .cb-row label{margin:0;color:#bbb;font-size:12px;cursor:pointer;}',
        '#__dc .range-row{display:flex;align-items:center;gap:8px;}',
        '#__dc .range-row span{font-size:11px;color:#6af;min-width:36px;text-align:right;font-family:monospace;}',
        '#__dc .hist-row{font-size:11px;padding:6px 0;border-bottom:1px solid #1a1a1a;color:#888;display:flex;justify-content:space-between;align-items:center;}',
        '#__dc .hist-row:last-child{border:none;}',
        '#__dc .hist-load{font-size:10px;color:#6af;cursor:pointer;text-decoration:none;}',
        '#__dc .hist-load:hover{color:#8cf;}',
        '#__dc .travel-result{background:#0d1a0d;border:1px solid #1a3a1a;border-radius:6px;padding:10px;margin-top:10px;font-family:monospace;font-size:13px;color:#4c4;text-align:center;display:none;}',
        '#__dc .alert-log{font-size:10px;color:#555;margin-top:8px;max-height:60px;overflow-y:auto;font-family:monospace;}',
        '#__dc .alert-log div{padding:1px 0;}',
        '#__dc .alert-log .al-warn{color:#ca4;}',
        '#__dc .alert-log .al-send{color:#6af;}',
        '#__dc .alert-log .al-cancel{color:#fa6;}',
        '#__dc .scrollbar::-webkit-scrollbar{width:4px;}',
        '#__dc .scrollbar::-webkit-scrollbar-thumb{background:#333;border-radius:2px;}'
    ].join('');
    document.head.appendChild(s);

    // ─── BUILD PANEL ─────────────────────────────────────────────────────────────
    var panel = document.createElement('div');
    panel.id = '__dc';

    // Header
    var header = document.createElement('div'); header.className = 'dc-header';
    var titleEl = document.createElement('span'); titleEl.className = 'dc-title'; titleEl.textContent = 'Dodge kalkulačka';
    var hBtns = document.createElement('div'); hBtns.className = 'dc-header-btns';
    var minimizeBtn = document.createElement('button'); minimizeBtn.className = 'ic-btn'; minimizeBtn.textContent = '▼'; minimizeBtn.title = 'Minimalizovat';
    var closeBtn = document.createElement('button'); closeBtn.className = 'ic-btn'; closeBtn.textContent = '✕'; closeBtn.title = 'Zavřít';
    closeBtn.onclick = function () { stopAlerts(); panel.remove(); };
    hBtns.appendChild(minimizeBtn); hBtns.appendChild(closeBtn);
    header.appendChild(titleEl); header.appendChild(hBtns);
    panel.appendChild(header);

    // Tabs
    var tabBar = document.createElement('div'); tabBar.className = 'tabs';
    var tabBody = document.createElement('div'); tabBody.className = 'tab-body';
    var tabs = ['Dodge', 'Zvuk', 'Cestovní', 'Historie'];
    var panes = [];
    tabs.forEach(function(t, i) {
        var tb = document.createElement('button'); tb.className = 'tab' + (i===0?' active':''); tb.textContent = t;
        tb.onclick = function() {
            document.querySelectorAll('#__dc .tab').forEach(function(x){x.classList.remove('active');});
            document.querySelectorAll('#__dc .tab-pane').forEach(function(x){x.classList.remove('active');});
            tb.classList.add('active'); panes[i].classList.add('active');
        };
        tabBar.appendChild(tb);
        var p = document.createElement('div'); p.className = 'tab-pane' + (i===0?' active':'');
        panes.push(p);
    });
    panel.appendChild(tabBar);
    tabBody.appendChild(panes[0]); tabBody.appendChild(panes[1]); tabBody.appendChild(panes[2]); tabBody.appendChild(panes[3]);
    panel.appendChild(tabBody);

    document.body.appendChild(panel);

    // ─── TAB 0: DODGE ────────────────────────────────────────────────────────────
    var t0 = panes[0];

    function field(lbl, id, ph, hint) {
        var w = document.createElement('div');
        var l = document.createElement('label'); l.textContent = lbl;
        var i = document.createElement('input'); i.type = 'text'; i.id = id; i.placeholder = ph;
        w.appendChild(l); w.appendChild(i);
        if (hint) { var h = document.createElement('div'); h.className = 'hint'; h.textContent = hint; w.appendChild(h); }
        return w;
    }

    var r2 = document.createElement('div'); r2.className = 'row2';
    r2.appendChild(field('Dopad útoku (HH:mm:ss:ms)', '__dc_impact', '16:43:18:270', ''));
    r2.appendChild(field('Návrat vojska (HH:mm:ss:ms)', '__dc_return', '16:43:18:370', 'Kdy chceš mít vojsko zpátky'));
    t0.appendChild(r2);

    var lc = document.createElement('label'); lc.textContent = 'Zrušit po X sekundách (max 600)';
    var ic = document.createElement('input'); ic.type = 'number'; ic.id = '__dc_cancel'; ic.value = '420'; ic.min = '1'; ic.max = '600';
    var hc = document.createElement('div'); hc.className = 'hint'; hc.textContent = 'Vojsko pryč 2× tento čas';
    t0.appendChild(lc); t0.appendChild(ic); t0.appendChild(hc);

    // Discord
    var dTitle = document.createElement('div'); dTitle.className = 'section-title'; dTitle.textContent = 'Discord';
    t0.appendChild(dTitle);

    function cbRow(id, txt, checked) {
        var row = document.createElement('div'); row.className = 'cb-row';
        var cb = document.createElement('input'); cb.type = 'checkbox'; cb.id = id; if(checked!==false) cb.checked = true;
        var l = document.createElement('label'); l.htmlFor = id; l.textContent = txt;
        row.appendChild(cb); row.appendChild(l); return row;
    }
    t0.appendChild(cbRow('__dc_discordon', 'Posílat Discord zprávy'));
    var whWrap = document.createElement('div'); whWrap.id = '__dc_whwrap';
    var whLbl = document.createElement('label'); whLbl.textContent = 'Webhook URL';
    var whInp = document.createElement('input'); whInp.type = 'text'; whInp.id = '__dc_webhook'; whInp.placeholder = 'https://discord.com/api/webhooks/...';
    var whHint = document.createElement('div'); whHint.className = 'hint'; whHint.textContent = 'URL se uloží automaticky';
    whWrap.appendChild(whLbl); whWrap.appendChild(whInp); whWrap.appendChild(whHint);
    t0.appendChild(whWrap);
    try { var sw = localStorage.getItem('__dodge_wh'); if(sw) whInp.value = sw; } catch(e){}
    document.getElementById('__dc_discordon').addEventListener('change', function(){
        whWrap.style.display = this.checked ? '' : 'none';
    });
    whWrap.style.display = document.getElementById('__dc_discordon').checked ? '' : 'none';

    // Calc button
    var calcBtn = document.createElement('button'); calcBtn.className = 'btn-primary'; calcBtn.textContent = 'Vypočítat a spustit alerty';
    calcBtn.onclick = runCalc;
    t0.appendChild(calcBtn);

    var stopBtnEl = document.createElement('button'); stopBtnEl.className = 'btn-stop'; stopBtnEl.id = '__dc_stopbtn'; stopBtnEl.textContent = '⏹ Zastavit alerty';
    stopBtnEl.onclick = function(){ stopAlerts(); resArea.innerHTML=''; stopBtnEl.style.display='none'; };
    t0.appendChild(stopBtnEl);

    var resArea = document.createElement('div'); resArea.id = '__dc_res';
    t0.appendChild(resArea);

    // ─── TAB 1: SOUND SETTINGS ───────────────────────────────────────────────────
    var t1 = panes[1];
    var sndTitle = document.createElement('div'); sndTitle.className = 'section-title'; sndTitle.textContent = 'Zvukové alerty';
    t1.appendChild(sndTitle);
    t1.appendChild(cbRow('__dc_sound', 'Zapnout zvuk', true));

    function sliderRow(lbl, id, min, max, val, unit, step) {
        var wrap = document.createElement('div');
        var l = document.createElement('label'); l.textContent = lbl;
        var rrow = document.createElement('div'); rrow.className = 'range-row';
        var inp = document.createElement('input'); inp.type = 'range'; inp.id = id; inp.min = min; inp.max = max; inp.value = val; inp.step = step||1;
        var sp = document.createElement('span'); sp.id = id+'_val'; sp.textContent = val + (unit||'');
        inp.oninput = function(){ sp.textContent = this.value + (unit||''); saveSettings(); };
        rrow.appendChild(inp); rrow.appendChild(sp);
        wrap.appendChild(l); wrap.appendChild(rrow);
        return wrap;
    }

    var alertsTitle = document.createElement('div'); alertsTitle.className = 'section-title'; alertsTitle.textContent = 'Časy upozornění';
    t1.appendChild(alertsTitle);
    t1.appendChild(sliderRow('Upozornit X minut před odesláním', '__dc_alert1', 1, 10, 3, ' min'));
    t1.appendChild(sliderRow('Upozornit X minut před zrušením', '__dc_alert2', 1, 10, 3, ' min'));

    var toneTitle = document.createElement('div'); toneTitle.className = 'section-title'; toneTitle.textContent = 'Tón alertu';
    t1.appendChild(toneTitle);
    t1.appendChild(sliderRow('Frekvence (Hz)', '__dc_freq', 200, 2000, 880, ' Hz', 10));
    t1.appendChild(sliderRow('Hlasitost', '__dc_vol', 1, 20, 8, '%'));

    var waveTitle = document.createElement('div'); waveTitle.className = 'section-title'; waveTitle.textContent = 'Tvar vlny';
    t1.appendChild(waveTitle);
    var waveWrap = document.createElement('div'); waveWrap.className = 'row2'; waveWrap.style.marginBottom = '10px';
    ['sine','square','sawtooth','triangle'].forEach(function(w){
        var btn = document.createElement('button'); btn.className = 'btn-sm'; btn.textContent = w; btn.id = '__dc_wave_'+w;
        btn.onclick = function(){
            document.querySelectorAll('[id^=__dc_wave_]').forEach(function(b){b.style.borderColor='';b.style.color='';});
            btn.style.borderColor='#6af'; btn.style.color='#6af';
            try{ localStorage.setItem('__dodge_wave', w); }catch(e){}
            testPreview();
        };
        waveWrap.appendChild(btn);
    });
    t1.appendChild(waveWrap);

    var previewBtn = document.createElement('button'); previewBtn.className = 'btn-sm'; previewBtn.textContent = '▶ Přehrát náhled'; previewBtn.style.width='100%'; previewBtn.style.marginTop='4px';
    previewBtn.onclick = testPreview;
    t1.appendChild(previewBtn);

    // ─── TAB 2: TRAVEL CALC ─────────────────────────────────────────────────────
    var t2 = panes[2];
    var travTitle = document.createElement('div'); travTitle.className = 'section-title'; travTitle.textContent = 'Cestovní kalkulátor';
    var travHint = document.createElement('div'); travHint.className = 'hint'; travHint.style.marginBottom='8px'; travHint.textContent = 'Spočítá čas cesty = pomůže ti naplánovat backtime ručně';
    t2.appendChild(travTitle); t2.appendChild(travHint);

    var r3 = document.createElement('div'); r3.className = 'row2';
    r3.appendChild(field('Koordináty od', '__dc_from', '444|465', ''));
    r3.appendChild(field('Koordináty cíl', '__dc_to', '417|577', ''));
    t2.appendChild(r3);

    var spLbl = document.createElement('label'); spLbl.textContent = 'Rychlost jednotky (min/pole)';
    var spWrap = document.createElement('div'); spWrap.className = 'row2';

    var unitSel = document.createElement('select'); unitSel.id = '__dc_unit';
    unitSel.style.cssText = 'width:100%;background:#1a1a1a;color:#fff;border:1px solid #2e2e2e;border-radius:5px;padding:6px 8px;font-size:12px;';
    var units = [
        ['Útočník pěší (spear)', 18],
        ['Meč', 22],
        ['Sekera', 18],
        ['Průzkumník', 9],
        ['Lehká jízda', 10],
        ['Těžká jízda', 11],
        ['Beranidlo', 30],
        ['Katapult', 30],
        ['Šlechtic', 35],
        ['Vlastní...', 0]
    ];
    units.forEach(function(u){
        var o = document.createElement('option'); o.textContent = u[0]; o.value = u[1];
        unitSel.appendChild(o);
    });
    var customSpeedWrap = document.createElement('div');
    var customSpeedInp = document.createElement('input'); customSpeedInp.type='number'; customSpeedInp.id='__dc_custom_speed'; customSpeedInp.placeholder='min/pole'; customSpeedInp.min='1'; customSpeedInp.style.display='none';
    unitSel.onchange = function(){ customSpeedInp.style.display = this.value === '0' ? '' : 'none'; };
    var leftCol = document.createElement('div'); leftCol.appendChild(unitSel);
    var rightCol = document.createElement('div'); rightCol.appendChild(customSpeedInp);
    spWrap.appendChild(leftCol); spWrap.appendChild(rightCol);
    t2.appendChild(spLbl); t2.appendChild(spWrap);

    var travBtn = document.createElement('button'); travBtn.className = 'btn-primary'; travBtn.textContent = 'Spočítat cestu';
    travBtn.onclick = calcTravel;
    t2.appendChild(travBtn);

    var travResult = document.createElement('div'); travResult.className = 'travel-result'; travResult.id = '__dc_travres';
    t2.appendChild(travResult);

    // ─── TAB 3: HISTORY ─────────────────────────────────────────────────────────
    var t3 = panes[3];
    var histTitle = document.createElement('div'); histTitle.className = 'section-title'; histTitle.textContent = 'Posledních 5 operací';
    t3.appendChild(histTitle);
    var histList = document.createElement('div'); histList.id = '__dc_histlist';
    t3.appendChild(histList);
    var clearHistBtn = document.createElement('button'); clearHistBtn.className = 'btn-sm'; clearHistBtn.textContent = '🗑 Smazat historii'; clearHistBtn.style.marginTop='10px';
    clearHistBtn.onclick = function(){ try{localStorage.removeItem('__dodge_hist');}catch(e){} renderHistory(); };
    t3.appendChild(clearHistBtn);
    renderHistory();

    // ─── MINIMIZE ───────────────────────────────────────────────────────────────
    var isMin = false;
    var collapseEls = [tabBar, tabBody];
    minimizeBtn.onclick = function(e) {
        e.stopPropagation();
        isMin = !isMin;
        collapseEls.forEach(function(el){ el.style.display = isMin ? 'none' : ''; });
        minimizeBtn.textContent = isMin ? '▲' : '▼';
    };

    // ─── DRAG ────────────────────────────────────────────────────────────────────
    var dragging=false, ddx, ddy;
    header.addEventListener('mousedown', function(e){
        if (e.target===closeBtn||e.target===minimizeBtn) return;
        dragging=true; ddx=e.clientX-panel.offsetLeft; ddy=e.clientY-panel.offsetTop; e.preventDefault();
    });
    document.addEventListener('mousemove', function(e){
        if(!dragging) return;
        panel.style.left=(e.clientX-ddx)+'px'; panel.style.top=(e.clientY-ddy)+'px'; panel.style.right='auto';
    });
    document.addEventListener('mouseup', function(){ dragging=false; });

    // ─── LOAD/SAVE SETTINGS ──────────────────────────────────────────────────────
    function loadSettings() {
        try {
            var cfg = JSON.parse(localStorage.getItem('__dodge_cfg')||'{}');
            if (cfg.freq) { document.getElementById('__dc_freq').value=cfg.freq; document.getElementById('__dc_freq_val').textContent=cfg.freq+' Hz'; }
            if (cfg.vol)  { document.getElementById('__dc_vol').value=cfg.vol;  document.getElementById('__dc_vol_val').textContent=cfg.vol+'%'; }
            if (cfg.alert1) { document.getElementById('__dc_alert1').value=cfg.alert1; document.getElementById('__dc_alert1_val').textContent=cfg.alert1+' min'; }
            if (cfg.alert2) { document.getElementById('__dc_alert2').value=cfg.alert2; document.getElementById('__dc_alert2_val').textContent=cfg.alert2+' min'; }
            if (cfg.wave) {
                document.querySelectorAll('[id^=__dc_wave_]').forEach(function(b){b.style.borderColor='';b.style.color='';});
                var wb = document.getElementById('__dc_wave_'+cfg.wave);
                if (wb) { wb.style.borderColor='#6af'; wb.style.color='#6af'; }
            }
            if (cfg.sound===false) document.getElementById('__dc_sound').checked=false;
            if (cfg.discord===false) document.getElementById('__dc_discordon').checked=false;
        } catch(e){}
    }
    function saveSettings() {
        try {
            localStorage.setItem('__dodge_cfg', JSON.stringify({
                freq: document.getElementById('__dc_freq').value,
                vol:  document.getElementById('__dc_vol').value,
                alert1: document.getElementById('__dc_alert1').value,
                alert2: document.getElementById('__dc_alert2').value,
                wave: getWave(),
                sound: document.getElementById('__dc_sound').checked,
                discord: document.getElementById('__dc_discordon').checked
            }));
        } catch(e){}
    }
    document.getElementById('__dc_sound').addEventListener('change', saveSettings);
    document.getElementById('__dc_discordon').addEventListener('change', saveSettings);
    loadSettings();

    // ─── AUDIO ───────────────────────────────────────────────────────────────────
    var actx = null;
    function getWave() {
        var active = document.querySelector('[id^=__dc_wave_][style*="#6af"]');
        if (active) return active.id.replace('__dc_wave_','');
        try { return localStorage.getItem('__dodge_wave')||'sine'; } catch(e){ return 'sine'; }
    }
    function beep(freq, dur, vol, wave) {
        try {
            if (!actx) actx = new (window.AudioContext||window.webkitAudioContext)();
            var o=actx.createOscillator(), g=actx.createGain();
            o.type = wave || getWave() || 'sine';
            o.connect(g); g.connect(actx.destination);
            o.frequency.value = freq;
            var v = (vol||8)/100;
            g.gain.setValueAtTime(v, actx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime+(dur||0.3));
            o.start(); o.stop(actx.currentTime+(dur||0.3));
        } catch(e){}
    }
    function getFreq(){ return parseInt(document.getElementById('__dc_freq').value)||880; }
    function getVol(){  return parseInt(document.getElementById('__dc_vol').value)||8; }

    function alertSound(type) {
        var f = getFreq(), v = getVol();
        if (type==='send') {
            beep(f,0.18,v); setTimeout(function(){beep(f,0.18,v);},230); setTimeout(function(){beep(f*1.25,0.32,v);},460);
        } else if (type==='cancel') {
            beep(f*0.75,0.18,v); setTimeout(function(){beep(f,0.25,v);},260);
        } else {
            beep(f,0.15,v);
        }
    }
    function testPreview() {
        alertSound('send');
    }

    // ─── DISCORD ─────────────────────────────────────────────────────────────────
    function discord(msg) {
        var url = document.getElementById('__dc_webhook').value.trim();
        if (!url||!url.startsWith('https://discord.com/api/webhooks/')) return;
        try { localStorage.setItem('__dodge_wh',url); } catch(e){}
        fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({content:msg})}).catch(function(){});
    }

    // ─── HELPERS ─────────────────────────────────────────────────────────────────
    function parseT(str) {
        if (!str||!str.trim()) return null;
        var p=str.trim().split(/[:.]/);
        if (p.length<3) return null;
        var h=+p[0],m=+p[1],s=+p[2],ms=+(p[3]||0);
        if (isNaN(h)||isNaN(m)||isNaN(s)) return null;
        var t=new Date(); t.setHours(h,m,s,ms);
        if (t.getTime()<Date.now()-60000) t.setDate(t.getDate()+1);
        return t.getTime();
    }
    function fmtT(ms) {
        if (ms==null) return '—';
        var d=new Date(ms), p=function(v,n){return String(v).padStart(n||2,'0');};
        return p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds())+':'+p(d.getMilliseconds(),3);
    }
    function fmtCnt(ms) {
        if (ms<=0) return '00:00:000';
        var tot=Math.floor(ms/1000),m=Math.floor(tot/60),s=tot%60,mil=ms%1000;
        return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')+':'+String(mil).padStart(3,'0');
    }
    function mkRow(lbl,val,color) {
        var d=document.createElement('div'); d.className='res-row';
        var l=document.createElement('span'); l.className='res-lbl'; l.textContent=lbl;
        var v=document.createElement('span'); v.className='res-val'; v.textContent=val;
        if(color) v.style.color=color; d.appendChild(l); d.appendChild(v); return d;
    }
    function mkBadge(txt,cls) {
        var b=document.createElement('span'); b.className='badge '+cls; b.textContent=txt; return b;
    }
    function addLog(msg, cls) {
        var log=document.getElementById('__dc_alertlog');
        if (!log) return;
        var d=document.createElement('div'); d.className=cls||''; d.textContent=nowStr()+' '+msg;
        log.appendChild(d); log.scrollTop=log.scrollHeight;
    }
    function nowStr() {
        var d=new Date(), p=function(v){return String(v).padStart(2,'0');};
        return p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds());
    }

    // ─── HISTORY ─────────────────────────────────────────────────────────────────
    function saveHistory(entry) {
        try {
            var h=JSON.parse(localStorage.getItem('__dodge_hist')||'[]');
            h.unshift(entry); if(h.length>5) h=h.slice(0,5);
            localStorage.setItem('__dodge_hist',JSON.stringify(h));
        } catch(e){}
        renderHistory();
    }
    function renderHistory() {
        var list=document.getElementById('__dc_histlist');
        if (!list) return;
        list.innerHTML='';
        try {
            var h=JSON.parse(localStorage.getItem('__dodge_hist')||'[]');
            if (!h.length) { var e=document.createElement('div'); e.style.color='#444'; e.style.fontSize='11px'; e.textContent='Zatím žádná historie.'; list.appendChild(e); return; }
            h.forEach(function(entry) {
                var row=document.createElement('div'); row.className='hist-row';
                var info=document.createElement('div');
                info.innerHTML='<span style="color:#eee">'+entry.retStr+'</span> <span style="color:#555">cancel '+entry.cancelS+'s</span>';
                var load=document.createElement('a'); load.className='hist-load'; load.textContent='Načíst';
                load.onclick=function(){ loadFromHistory(entry); };
                row.appendChild(info); row.appendChild(load);
                list.appendChild(row);
            });
        } catch(e){}
    }
    function loadFromHistory(entry) {
        document.getElementById('__dc_return').value = entry.retStr||'';
        document.getElementById('__dc_impact').value = entry.impStr||'';
        document.getElementById('__dc_cancel').value = entry.cancelS||420;
        // Switch to Dodge tab
        document.querySelectorAll('#__dc .tab')[0].click();
    }

    // ─── TRAVEL CALC ─────────────────────────────────────────────────────────────
    function calcTravel() {
        var fromStr = document.getElementById('__dc_from').value.trim();
        var toStr   = document.getElementById('__dc_to').value.trim();
        var speed   = parseFloat(document.getElementById('__dc_unit').value);
        if (speed===0) speed = parseFloat(document.getElementById('__dc_custom_speed').value)||0;

        var res = document.getElementById('__dc_travres');
        res.style.display='';

        if (!fromStr||!toStr) { res.textContent='Zadej obě koordináty'; res.style.color='#d66'; return; }
        if (!speed||speed<=0) { res.textContent='Zadej rychlost'; res.style.color='#d66'; return; }

        var fp=fromStr.split('|'), tp=toStr.split('|');
        if (fp.length<2||tp.length<2) { res.textContent='Formát: XXX|YYY'; res.style.color='#d66'; return; }
        var dx=+fp[0]-+tp[0], dy=+fp[1]-+tp[1];
        if (isNaN(dx)||isNaN(dy)) { res.textContent='Neplatné koordináty'; res.style.color='#d66'; return; }

        var dist = Math.sqrt(dx*dx+dy*dy);
        var travelMs = Math.round(dist * speed * 60 * 1000);
        var totalMs = travelMs;
        var h=Math.floor(totalMs/3600000), m=Math.floor((totalMs%3600000)/60000), s=Math.floor((totalMs%60000)/1000);

        res.style.color='#4c4';
        res.innerHTML =
            'Vzdálenost: <strong>'+dist.toFixed(2)+'</strong> polí<br>' +
            'Čas cesty: <strong>'+h+'h '+m+'m '+s+'s</strong><br>' +
            '<span style="color:#888;font-size:10px;">('+travelMs+'ms)</span>';
    }

    // ─── ALERT LOOP ──────────────────────────────────────────────────────────────
    var alertInterval=null, fired={}, calcData=null;

    function stopAlerts() {
        if(alertInterval){clearInterval(alertInterval);alertInterval=null;}
        fired={};
    }

    function runCalc() {
        stopAlerts();
        var retStr  = document.getElementById('__dc_return').value;
        var impStr  = document.getElementById('__dc_impact').value;
        var cancelS = parseFloat(document.getElementById('__dc_cancel').value)||420;
        resArea.innerHTML='';

        if (!retStr||!retStr.trim()) { resArea.appendChild(mkBadge('Zadej čas návratu vojska','warn')); return; }
        if (cancelS>600) { resArea.appendChild(mkBadge('Max 600 sekund!','err')); return; }
        var retMs=parseT(retStr);
        if (!retMs) { resArea.appendChild(mkBadge('Neplatný formát času návratu','err')); return; }

        var impMs=parseT(impStr);
        var cancelMs=Math.round(cancelS*1000);
        var sendTime=retMs-2*cancelMs;
        var cancelTime=sendTime+cancelMs;
        var toSend=sendTime-Date.now();

        if (toSend<-10000) {
            resArea.appendChild(mkBadge('Příliš pozdě! Mělo se odeslat před '+Math.abs(toSend/1000).toFixed(1)+'s','err'));
            return;
        }

        calcData={sendTime:sendTime,cancelTime:cancelTime,retMs:retMs,impMs:impMs,cancelS:cancelS};
        fired={};

        // Save to history
        saveHistory({retStr:retStr,impStr:impStr,cancelS:cancelS,ts:Date.now()});

        // Static rows
        var sec=document.createElement('div'); sec.style.borderTop='1px solid #1e1e1e'; sec.style.paddingTop='10px'; sec.style.marginTop='10px';
        if (impMs) sec.appendChild(mkRow('Dopad útoku', fmtT(impMs),''));
        sec.appendChild(mkRow('➤ Odeslat dodge', fmtT(sendTime),'#6af'));
        sec.appendChild(mkRow('✕ Zrušit (za '+(cancelS/60).toFixed(1)+'min)', fmtT(cancelTime),'#fa6'));
        sec.appendChild(mkRow('↩ Vojsko zpět', fmtT(retMs),'#4c4'));
        sec.appendChild(mkRow('Vojsko pryč', (cancelS*2/60).toFixed(1)+' min',''));
        resArea.appendChild(sec);

        // Countdown
        var cdBox=document.createElement('div'); cdBox.className='cd-box'; cdBox.id='__dc_cdbox'; cdBox.textContent='--:--:---';
        var cdLbl=document.createElement('div'); cdLbl.className='cd-lbl'; cdLbl.id='__dc_cdlbl'; cdLbl.textContent='čas do odeslání';
        resArea.appendChild(cdBox); resArea.appendChild(cdLbl);

        // Alert log
        var logLbl=document.createElement('div'); logLbl.className='hint'; logLbl.textContent='Log alertů:';
        var logEl=document.createElement('div'); logEl.className='alert-log scrollbar'; logEl.id='__dc_alertlog';
        resArea.appendChild(logLbl); resArea.appendChild(logEl);

        document.getElementById('__dc_stopbtn').style.display='block';

        var A1=parseInt(document.getElementById('__dc_alert1').value||3)*60000;
        var A2=parseInt(document.getElementById('__dc_alert2').value||3)*60000;

        alertInterval=setInterval(function(){
            var n=Date.now(), toS=calcData.sendTime-n, toC=calcData.cancelTime-n;
            var cdEl=document.getElementById('__dc_cdbox'), cdLEl=document.getElementById('__dc_cdlbl');
            if (!cdEl){stopAlerts();return;}

            var sndOn=document.getElementById('__dc_sound').checked;
            var discOn=document.getElementById('__dc_discordon').checked;

            if (toS>0) {
                cdEl.textContent=fmtCnt(toS);
                cdEl.style.color=toS<60000?'#fa6':(toS<=A1?'#ff4':'#6af');
                cdLEl.textContent='do odeslání dodge';
            } else if (toC>0) {
                cdEl.textContent=fmtCnt(toC);
                cdEl.style.color=toC<60000?'#f66':'#fa6';
                cdLEl.textContent='do zrušení dodge';
            } else {
                cdEl.textContent='HOTOVO ✓';
                cdEl.style.color='#4c4';
                cdLEl.textContent='vojsko na cestě zpět';
                if(sndOn) alertSound('send');
                addLog('Sekvence dokončena','al-send');
                stopAlerts();
                document.getElementById('__dc_stopbtn').style.display='none';
                return;
            }

            // Alert before SEND
            if (!fired.sA && toS>0 && toS<=A1) {
                fired.sA=true;
                if(sndOn) alertSound('send');
                addLog('Alert: za '+(A1/60000)+' min odesílej!','al-send');
                if(discOn) discord('⚔️ **Dodge** — za '+(A1/60000)+' min odešli útok!\n➤ Odeslat: `'+fmtT(calcData.sendTime)+'`\n✕ Zrušit: `'+fmtT(calcData.cancelTime)+'`\n↩ Návrat: `'+fmtT(calcData.retMs)+'`');
            }
            if (!fired.s1m && toS>0 && toS<=60000) {
                fired.s1m=true;
                if(sndOn) alertSound('send');
                addLog('Alert: ZA 1 MINUTU odesílej!','al-warn');
                if(discOn) discord('🚨 **Dodge** — za 1 minutu odešli útok!\n➤ Odeslat: `'+fmtT(calcData.sendTime)+'`');
            }
            // Alert before CANCEL
            if (!fired.cA && toS<=0 && toC>0 && toC<=A2) {
                fired.cA=true;
                if(sndOn) alertSound('cancel');
                addLog('Alert: za '+(A2/60000)+' min rušíš!','al-cancel');
                if(discOn) discord('⏱️ **Dodge** — za '+(A2/60000)+' min zruš útok!\n✕ Zrušit: `'+fmtT(calcData.cancelTime)+'`\n↩ Návrat: `'+fmtT(calcData.retMs)+'`');
            }
            if (!fired.c1m && toS<=0 && toC>0 && toC<=60000) {
                fired.c1m=true;
                if(sndOn) alertSound('cancel');
                addLog('Alert: ZA 1 MINUTU ruš!','al-warn');
                if(discOn) discord('🚨 **Dodge** — za 1 minutu zruš útok!\n✕ Zrušit: `'+fmtT(calcData.cancelTime)+'`');
            }
        }, 250);
    }

})();
