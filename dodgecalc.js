// © 2026 TheBrain
// Dodge Calculator v5 

(function () {
    if (document.getElementById('__dodge_calc')) return;

    var s = document.createElement('style');
    s.textContent = [
        '@import url("https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap");',

        // Tooltip styles
        '.dc-tip{position:fixed;z-index:9999999;pointer-events:none;opacity:0;transition:opacity .18s ease;max-width:240px;}',
        '.dc-tip.visible{opacity:1;}',
        '.dc-tip-inner{background:#1c0608;border:1px solid #7a1520;border-radius:6px;padding:8px 12px;font-family:"Rajdhani",sans-serif;font-size:12.5px;font-weight:500;color:#e8d0d4;line-height:1.55;letter-spacing:.25px;box-shadow:0 4px 20px rgba(100,0,15,.5);}',

        // Panel
        '#__dc{position:fixed;top:20px;right:20px;width:368px;background:#110203;color:#e8d0d4;border:1px solid #4a0d14;border-radius:12px;z-index:999999;font-family:"Rajdhani",sans-serif;font-size:13px;box-shadow:0 8px 40px rgba(120,0,20,.55),0 0 0 1px rgba(180,20,40,.06);overflow:visible;}',

        // Subtle top glow line
        '#__dc::before{content:"";position:absolute;top:0;left:40px;right:40px;height:1px;background:linear-gradient(90deg,transparent,#9b2030,transparent);border-radius:0;}',

        // Header
        '#__dc .dc-header{padding:14px 16px 10px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #2a0810;cursor:grab;}',
        '#__dc .dc-header:active{cursor:grabbing;}',
        '#__dc .dc-title{font-size:15px;font-weight:700;color:#f8e8ec;letter-spacing:1.5px;text-transform:uppercase;}',
        '#__dc .dc-title span{color:#c03040;font-weight:400;}',
        '#__dc .dc-header-btns{display:flex;gap:6px;align-items:center;}',
        '#__dc .ic-btn{background:none;border:1px solid transparent;color:#d07888;cursor:pointer;font-size:12px;padding:3px 7px;border-radius:4px;transition:all .15s;}',
        '#__dc .ic-btn:hover{color:#f09090;border-color:#4a0d14;background:#1c0508;}',

        // Tabs
        '#__dc .tabs{display:flex;border-bottom:1px solid #2a0810;background:#0d0102;}',
        '#__dc .tab{flex:1;padding:9px 4px;text-align:center;font-size:11px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;color:#b07880;cursor:pointer;border:none;background:none;transition:color .15s;position:relative;}',
        '#__dc .tab:hover{color:#e09098;}',
        '#__dc .tab.active{color:#f09090;}',
        '#__dc .tab.active::after{content:"";position:absolute;bottom:0;left:20%;right:20%;height:2px;background:linear-gradient(90deg,transparent,#a02030,transparent);}',
        '#__dc .tab-body{padding:14px 16px 10px;}',
        '#__dc .tab-pane{display:none;}',
        '#__dc .tab-pane.active{display:block;}',

        // Labels
        '#__dc label{display:block;font-size:11px;font-weight:600;letter-spacing:.9px;text-transform:uppercase;color:#d09098;margin:10px 0 4px;}',

        // Inputs
        '#__dc input[type=text],#__dc input[type=number]{width:100%;background:#1e060a;color:#f8e8ec;border:1px solid #4a1020;border-radius:6px;padding:7px 10px;font-size:13px;font-family:"JetBrains Mono",monospace;box-sizing:border-box;outline:none;transition:border-color .15s,box-shadow .15s;}',
        '#__dc input[type=text]:focus,#__dc input[type=number]:focus{border-color:#9b2030;box-shadow:0 0 0 2px rgba(155,32,48,.3);}',
        '#__dc input[type=text]::placeholder,#__dc input[type=number]::placeholder{color:#8a5860;font-family:"JetBrains Mono",monospace;}',
        '#__dc input[type=range]{width:100%;accent-color:#a02030;margin:4px 0;cursor:pointer;}',

        // Grid
        '#__dc .row2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}',
        '#__dc .row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;}',

        // Buttons
        '#__dc .btn-primary{width:100%;margin-top:12px;padding:10px;background:linear-gradient(135deg,#6a1020,#a02030);color:#fce8ec;border:1px solid #9b2030;border-radius:7px;cursor:pointer;font-size:12px;font-weight:700;font-family:"Rajdhani",sans-serif;letter-spacing:1.5px;text-transform:uppercase;transition:all .2s;}',
        '#__dc .btn-primary:hover{background:linear-gradient(135deg,#7a1525,#c03040);box-shadow:0 0 18px rgba(160,32,48,.4);}',
        '#__dc .btn-stop{width:100%;margin-top:6px;padding:8px;background:#150305;color:#c06070;border:1px solid #3a0a14;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;font-family:"Rajdhani",sans-serif;letter-spacing:1px;text-transform:uppercase;display:none;transition:all .15s;}',
        '#__dc .btn-stop:hover{border-color:#5a1a20;color:#e07888;}',
        '#__dc .btn-sm{padding:5px 10px;font-size:11px;font-weight:600;letter-spacing:.5px;border:1px solid #4a1820;background:#1c0608;color:#d07888;border-radius:5px;cursor:pointer;font-family:"Rajdhani",sans-serif;transition:all .15s;}',
        '#__dc .btn-sm:hover{border-color:#9b2030;color:#f09090;}',

        // Badges
        '#__dc .badge{display:inline-block;padding:4px 10px;border-radius:4px;font-size:12px;font-weight:600;letter-spacing:.4px;margin-bottom:6px;font-family:"Rajdhani",sans-serif;}',
        '#__dc .ok{background:#0a1e0a;color:#7ad87a;border:1px solid #1e4420;}',
        '#__dc .warn{background:#221800;color:#e8b840;border:1px solid #443000;}',
        '#__dc .err{background:#220508;color:#f06060;border:1px solid #480a14;}',
        '#__dc .info{background:#060f1f;color:#60a0e0;border:1px solid #0c2844;}',

        // Hint
        '#__dc .hint{font-size:11.5px;color:#9a6870;margin-top:3px;letter-spacing:.2px;}',

        // Results
        '#__dc .res-row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #2a0810;}',
        '#__dc .res-row:last-child{border:none;}',
        '#__dc .res-lbl{color:#c09098;font-size:12.5px;font-weight:600;letter-spacing:.4px;}',
        '#__dc .res-val{font-family:"JetBrains Mono",monospace;font-weight:500;font-size:12.5px;color:#f8e8ec;}',

        // Section titles
        '#__dc .section-title{font-size:11px;color:#e05060;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;margin:14px 0 8px;border-bottom:1px solid #220810;padding-bottom:5px;}',

        // Checkboxes
        '#__dc .cb-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;}',
        '#__dc .cb-row input[type=checkbox]{width:auto;margin:0;accent-color:#a02030;cursor:pointer;}',
        '#__dc .cb-row label{margin:0;color:#d09098;font-size:13px;font-weight:600;letter-spacing:.3px;cursor:pointer;}',

        // Range rows
        '#__dc .range-row{display:flex;align-items:center;gap:8px;}',
        '#__dc .range-row span{font-size:12px;color:#e06070;min-width:52px;text-align:right;font-family:"JetBrains Mono",monospace;font-weight:500;}',

        // History
        '#__dc .hist-row{font-size:12px;padding:7px 0;border-bottom:1px solid #2a0810;color:#d0a0a8;display:flex;justify-content:space-between;align-items:center;}',
        '#__dc .hist-row:last-child{border:none;}',
        '#__dc .hist-load{font-size:11px;font-weight:700;letter-spacing:.5px;color:#d05060;cursor:pointer;text-transform:uppercase;transition:color .15s;}',
        '#__dc .hist-load:hover{color:#f07888;}',

        // Travel result
        '#__dc .travel-result{background:#0e0102;border:1px solid #3a0a14;border-radius:8px;padding:12px;margin-top:10px;font-family:"JetBrains Mono",monospace;font-size:13px;color:#a02030;text-align:center;display:none;}',

        // Countdown (orientační)
        '#__dc .cd-box{text-align:center;font-size:28px;font-family:"JetBrains Mono",monospace;font-weight:500;padding:10px 12px 4px;background:#0e0102;border:1px solid #2a0810;border-radius:8px 8px 0 0;margin-top:10px;letter-spacing:3px;color:#d05068;}',
        '#__dc .cd-lbl{font-size:10px;color:#b07880;text-align:center;letter-spacing:1px;text-transform:uppercase;font-weight:600;background:#0e0102;border:1px solid #2a0810;border-top:none;border-radius:0;padding:2px 12px 6px;}',
        '#__dc .cd-warn{font-size:10px;color:#7a4048;text-align:center;letter-spacing:.3px;background:#0e0102;border:1px solid #2a0810;border-top:none;border-radius:0 0 8px 8px;padding:4px 12px 7px;line-height:1.4;}',
        '#__dc .cd-warn b{color:#c06070;}',

        // Alert log
        '#__dc .alert-log{font-size:11px;color:#a07080;margin-top:8px;max-height:60px;overflow-y:auto;font-family:"JetBrains Mono",monospace;}',
        '#__dc .alert-log div{padding:1px 0;}',
        '#__dc .alert-log .al-warn{color:#e0b840;}',
        '#__dc .alert-log .al-send{color:#90b848;}',
        '#__dc .alert-log .al-cancel{color:#e08040;}',
        '#__dc .scrollbar::-webkit-scrollbar{width:3px;}',
        '#__dc .scrollbar::-webkit-scrollbar-thumb{background:#3a0a14;border-radius:2px;}',

        // Select
        '#__dc select{width:100%;background:#1e060a;color:#f8e8ec;border:1px solid #4a1020;border-radius:6px;padding:7px 10px;font-size:12.5px;font-family:"Rajdhani",sans-serif;font-weight:500;outline:none;cursor:pointer;transition:border-color .15s;}',
        '#__dc select:focus{border-color:#9b2030;}',
        '#__dc select option{background:#1e060a;color:#f8e8ec;}',

        // Footer
        '#__dc .dc-footer{text-align:center;padding:8px 0 10px;font-size:10px;color:#6a3840;letter-spacing:.5px;font-weight:500;border-top:1px solid #220810;margin-top:4px;}',
        '#__dc .dc-footer span{color:#8a4850;}',
    ].join('');
    document.head.appendChild(s);

    // ─── TOOLTIP ENGINE ───────────────────────────────────────────────────────
    var tipEl = document.createElement('div');
    tipEl.className = 'dc-tip';
    var tipInner = document.createElement('div');
    tipInner.className = 'dc-tip-inner';
    tipEl.appendChild(tipInner);
    document.body.appendChild(tipEl);

    var tipTimer = null;
    function showTip(e, text) {
        clearTimeout(tipTimer);
        tipInner.textContent = text;
        positionTip(e);
        tipEl.classList.add('visible');
    }
    function positionTip(e) {
        var x = e.clientX + 14, y = e.clientY - 10;
        var pw = tipEl.offsetWidth || 240, ph = tipEl.offsetHeight || 60;
        var vw = window.innerWidth, vh = window.innerHeight;
        if (x + pw > vw - 10) x = e.clientX - pw - 10;
        if (y + ph > vh - 10) y = vh - ph - 10;
        if (x < 8) x = 8;
        if (y < 8) y = 8;
        tipEl.style.left = x + 'px';
        tipEl.style.top  = y + 'px';
    }
    function hideTip() {
        clearTimeout(tipTimer);
        tipEl.classList.remove('visible');
    }
    function addTip(el, text) {
        el.addEventListener('mouseenter', function(e){ showTip(e, text); });
        el.addEventListener('mousemove',  function(e){ positionTip(e); });
        el.addEventListener('mouseleave', hideTip);
        el.addEventListener('focus',      function(e){ showTip(e, text); });
        el.addEventListener('blur',       hideTip);
    }

    // ─── BUILD PANEL ─────────────────────────────────────────────────────────
    var panel = document.createElement('div');
    panel.id = '__dc';
    var guard = document.createElement('span');
    guard.id = '__dodge_calc';
    guard.style.display = 'none';
    panel.appendChild(guard);

    // Header
    var header = document.createElement('div'); header.className = 'dc-header';
    var titleEl = document.createElement('span'); titleEl.className = 'dc-title';
    titleEl.innerHTML = 'DODGE <span>/ KALKULAČKA</span>';
    var hBtns = document.createElement('div'); hBtns.className = 'dc-header-btns';
    var minimizeBtn = document.createElement('button'); minimizeBtn.className = 'ic-btn'; minimizeBtn.textContent = '▼'; minimizeBtn.title = 'Minimalizovat';
    var closeBtn = document.createElement('button'); closeBtn.className = 'ic-btn'; closeBtn.textContent = '✕'; closeBtn.title = 'Zavřít';
    closeBtn.onclick = function () { stopAlerts(); panel.remove(); tipEl.remove(); };
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
    tabBody.appendChild(panes[0]); tabBody.appendChild(panes[1]);
    tabBody.appendChild(panes[2]); tabBody.appendChild(panes[3]);
    panel.appendChild(tabBody);

    // Footer
    var footer = document.createElement('div'); footer.className = 'dc-footer';
    footer.innerHTML = 'Powered by <span>TheBrain🧠</span>';
    panel.appendChild(footer);

    document.body.appendChild(panel);

    // ─── TAB 0: DODGE ────────────────────────────────────────────────────────
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
    var impField = field('Dopad útoku', '__dc_impact', '16:43:18:270', 'Formát HH:mm:ss:ms');
    var retField = field('Návrat vojska', '__dc_return', '16:43:18:370', 'Kdy chceš mít vojsko zpátky');
    r2.appendChild(impField);
    r2.appendChild(retField);
    t0.appendChild(r2);

    addTip(impField.querySelector('input'), 'Čas dopadu nepřátelského útoku.\nFormát: HH:mm:ss:ms (např. 16:43:18:270)\nNechej prázdné pokud neznáš.');
    addTip(retField.querySelector('input'), 'Čas, kdy chceš mít vojsko zpět v pevnosti.\nFormát: HH:mm:ss:ms\nDůležité: Musí být pozdější než dopad útoku.');

    var lc = document.createElement('label'); lc.textContent = 'Zrušit po X sekundách (max 600)';
    var ic = document.createElement('input'); ic.type = 'number'; ic.id = '__dc_cancel'; ic.value = '420'; ic.min = '1'; ic.max = '600';
    var hc = document.createElement('div'); hc.className = 'hint'; hc.textContent = 'Vojsko pryč 2× tento čas';
    t0.appendChild(lc); t0.appendChild(ic); t0.appendChild(hc);
    addTip(ic, 'Kolik sekund po odeslání dodge zrušit.\nMax 600 sekund (10 minut).\nVojsko bude pryč přibližně 2× tento čas.');

    var dTitle = document.createElement('div'); dTitle.className = 'section-title'; dTitle.textContent = 'Discord notifikace';
    t0.appendChild(dTitle);

    function cbRow(id, txt, checked) {
        var row = document.createElement('div'); row.className = 'cb-row';
        var cb = document.createElement('input'); cb.type = 'checkbox'; cb.id = id; if(checked!==false) cb.checked = true;
        var l = document.createElement('label'); l.htmlFor = id; l.textContent = txt;
        row.appendChild(cb); row.appendChild(l); return row;
    }
    var discRow = cbRow('__dc_discordon', 'Posílat Discord zprávy');
    t0.appendChild(discRow);
    addTip(discRow, 'Zapne odesílání automatických upozornění na Discord webhook.\nZprávy se posílají před odesláním a zrušením dodge.');

    var whWrap = document.createElement('div'); whWrap.id = '__dc_whwrap';
    var whLbl = document.createElement('label'); whLbl.textContent = 'Webhook URL';
    var whInp = document.createElement('input'); whInp.type = 'text'; whInp.id = '__dc_webhook'; whInp.placeholder = 'https://discord.com/api/webhooks/...';
    var whHint = document.createElement('div'); whHint.className = 'hint'; whHint.textContent = 'URL se uloží automaticky do localStorage';
    whWrap.appendChild(whLbl); whWrap.appendChild(whInp); whWrap.appendChild(whHint);
    t0.appendChild(whWrap);
    addTip(whInp, 'Discord Webhook URL pro odesílání zpráv.\nNajdeš ji v Nastavení kanálu → Integrace → Webhooky.\nUkládá se automaticky.');

    try { var sw = localStorage.getItem('__dodge_wh'); if(sw) whInp.value = sw; } catch(e){}
    document.getElementById('__dc_discordon').addEventListener('change', function(){
        whWrap.style.display = this.checked ? '' : 'none';
    });
    whWrap.style.display = document.getElementById('__dc_discordon').checked ? '' : 'none';

    var calcBtn = document.createElement('button'); calcBtn.className = 'btn-primary'; calcBtn.textContent = '▶ VYPOČÍTAT';
    calcBtn.onclick = runCalc;
    t0.appendChild(calcBtn);
    addTip(calcBtn, 'Vypočítá optimální čas odeslání dodge a zobrazí plán.\nSpustí také zvukové/Discord alerty ve správný čas.');

    var stopBtnEl = document.createElement('button'); stopBtnEl.className = 'btn-stop'; stopBtnEl.id = '__dc_stopbtn'; stopBtnEl.textContent = '⏹  ZASTAVIT ALERTY';
    stopBtnEl.onclick = function(){ stopAlerts(); resArea.innerHTML=''; stopBtnEl.style.display='none'; };
    t0.appendChild(stopBtnEl);
    addTip(stopBtnEl, 'Zastaví všechny běžící alerty.\nVojsko nebude automaticky posláno zpět.');

    var resArea = document.createElement('div'); resArea.id = '__dc_res';
    t0.appendChild(resArea);

    // ─── TAB 1: SOUND ────────────────────────────────────────────────────────
    var t1 = panes[1];
    var sndTitle = document.createElement('div'); sndTitle.className = 'section-title'; sndTitle.textContent = 'Zvukové alerty';
    t1.appendChild(sndTitle);
    var soundRow = cbRow('__dc_sound', 'Zapnout zvuk', true);
    t1.appendChild(soundRow);
    addTip(soundRow, 'Zapne/vypne zvukové upozornění při alertu.\nZvuk se přehraje před odesláním a zrušením dodge.');

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
    var a1row = sliderRow('Upozornit X minut před odesláním', '__dc_alert1', 1, 10, 3, ' min');
    var a2row = sliderRow('Upozornit X minut před zrušením', '__dc_alert2', 1, 10, 3, ' min');
    t1.appendChild(a1row);
    t1.appendChild(a2row);
    addTip(a1row, 'Kolik minut před časem odeslání dodge dostaneš první upozornění.');
    addTip(a2row, 'Kolik minut před časem zrušení dodge dostaneš upozornění ke zrušení.');

    var toneTitle = document.createElement('div'); toneTitle.className = 'section-title'; toneTitle.textContent = 'Tón alertu';
    t1.appendChild(toneTitle);
    var freqRow = sliderRow('Frekvence (Hz)', '__dc_freq', 200, 2000, 880, ' Hz', 10);
    var volRow  = sliderRow('Hlasitost', '__dc_vol', 1, 20, 8, '%');
    t1.appendChild(freqRow);
    t1.appendChild(volRow);
    addTip(freqRow, 'Výška tónu alertu v Hz.\nNižší = hlubší, vyšší = pronikavější.');
    addTip(volRow,  'Hlasitost alertu v procentech.\nDoporučeno: 5–12% pro nenápadný zvuk.');

    var waveTitle = document.createElement('div'); waveTitle.className = 'section-title'; waveTitle.textContent = 'Tvar vlny';
    t1.appendChild(waveTitle);
    var waveWrap = document.createElement('div'); waveWrap.className = 'row2'; waveWrap.style.marginBottom = '10px'; waveWrap.style.gap='8px';
    ['sine','square','sawtooth','triangle'].forEach(function(w){
        var btn = document.createElement('button'); btn.className = 'btn-sm'; btn.textContent = w; btn.id = '__dc_wave_'+w;
        btn.onclick = function(){
            document.querySelectorAll('[id^=__dc_wave_]').forEach(function(b){b.style.borderColor='';b.style.color='';});
            btn.style.borderColor='#a02030'; btn.style.color='#f09090';
            try{ localStorage.setItem('__dodge_wave', w); }catch(e){}
            testPreview();
        };
        waveWrap.appendChild(btn);
    });
    t1.appendChild(waveWrap);
    addTip(waveWrap, 'Tvar zvukové vlny.\nsine = jemný, square = ostrý, sawtooth = řezavý, triangle = střední.\nKliknutím vybereš a ihned přehraješ náhled.');

    var previewBtn = document.createElement('button'); previewBtn.className = 'btn-primary'; previewBtn.style.marginTop='6px'; previewBtn.textContent = '▶  PŘEHRÁT NÁHLED';
    previewBtn.onclick = testPreview;
    t1.appendChild(previewBtn);
    addTip(previewBtn, 'Přehraje náhled zvuku s aktuálním nastavením frekvence, hlasitosti a tvaru vlny.');

    // ─── TAB 2: TRAVEL CALC ──────────────────────────────────────────────────
    var t2 = panes[2];
    var travTitle = document.createElement('div'); travTitle.className = 'section-title'; travTitle.textContent = 'Cestovní kalkulátor';
    var travHint = document.createElement('div'); travHint.className = 'hint'; travHint.style.marginBottom='8px'; travHint.textContent = 'Spočítá čas cesty → pomoct plánovat backtime ručně';
    t2.appendChild(travTitle); t2.appendChild(travHint);

    var r3 = document.createElement('div'); r3.className = 'row2';
    var fromField = field('Koordináty od', '__dc_from', '444|465', '');
    var toField   = field('Koordináty cíl', '__dc_to', '417|577', '');
    r3.appendChild(fromField);
    r3.appendChild(toField);
    t2.appendChild(r3);
    addTip(fromField.querySelector('input'), 'Koordináty výchozí pevnosti.\nFormát: X|Y (např. 444|465)\nNajdeš je v mapě po kliknutí na pevnost.');
    addTip(toField.querySelector('input'),   'Koordináty cílové pevnosti.\nFormát: X|Y (např. 417|577)');

    var spLbl = document.createElement('label'); spLbl.textContent = 'Rychlost jednotky';
    var spWrap = document.createElement('div'); spWrap.className = 'row2';
    var unitSel = document.createElement('select'); unitSel.id = '__dc_unit';
    var units = [
        ['Útočník pěší (spear)', 18],['Meč', 22],['Sekera', 18],
        ['Průzkumník', 9],['Lehká jízda', 10],['Těžká jízda', 11],
        ['Beranidlo', 30],['Katapult', 30],['Šlechtic', 35],['Vlastní...', 0]
    ];
    units.forEach(function(u){
        var o = document.createElement('option'); o.textContent = u[0]; o.value = u[1];
        unitSel.appendChild(o);
    });
    addTip(unitSel, 'Vyber typ jednotky nebo "Vlastní..." pro manuální zadání rychlosti (min/pole).');
    var customSpeedWrap = document.createElement('div');
    var customSpeedInp = document.createElement('input'); customSpeedInp.type='number'; customSpeedInp.id='__dc_custom_speed'; customSpeedInp.placeholder='min/pole'; customSpeedInp.min='1'; customSpeedInp.style.display='none';
    addTip(customSpeedInp, 'Zadej vlastní rychlost v minutách na jedno pole.');
    unitSel.onchange = function(){ customSpeedInp.style.display = this.value === '0' ? '' : 'none'; };
    var leftCol = document.createElement('div'); leftCol.appendChild(unitSel);
    var rightCol = document.createElement('div'); rightCol.appendChild(customSpeedInp);
    spWrap.appendChild(leftCol); spWrap.appendChild(rightCol);
    t2.appendChild(spLbl); t2.appendChild(spWrap);

    var travBtn = document.createElement('button'); travBtn.className = 'btn-primary'; travBtn.textContent = '▶ SPOČÍTAT CESTU';
    travBtn.onclick = calcTravel;
    t2.appendChild(travBtn);
    addTip(travBtn, 'Vypočítá vzdálenost a čas cesty mezi zadanými koordináty pro vybranou jednotku.');

    var travResult = document.createElement('div'); travResult.className = 'travel-result'; travResult.id = '__dc_travres';
    t2.appendChild(travResult);

    // ─── TAB 3: HISTORY ──────────────────────────────────────────────────────
    var t3 = panes[3];
    var histTitle = document.createElement('div'); histTitle.className = 'section-title'; histTitle.textContent = 'Posledních 5 operací';
    t3.appendChild(histTitle);
    var histList = document.createElement('div'); histList.id = '__dc_histlist';
    t3.appendChild(histList);
    var clearHistBtn = document.createElement('button'); clearHistBtn.className = 'btn-sm'; clearHistBtn.textContent = '⌫  Smazat historii'; clearHistBtn.style.marginTop='12px';
    clearHistBtn.onclick = function(){ try{localStorage.removeItem('__dodge_hist');}catch(e){} renderHistory(); };
    t3.appendChild(clearHistBtn);
    addTip(clearHistBtn, 'Smaže všechny uložené operace z historie.\nTato akce je nevratná.');
    renderHistory();

    // ─── MINIMIZE ────────────────────────────────────────────────────────────
    var isMin = false;
    var collapseEls = [tabBar, tabBody, footer];
    minimizeBtn.onclick = function(e) {
        e.stopPropagation();
        isMin = !isMin;
        collapseEls.forEach(function(el){ el.style.display = isMin ? 'none' : ''; });
        minimizeBtn.textContent = isMin ? '▲' : '▼';
    };

    // ─── DRAG ────────────────────────────────────────────────────────────────
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

    // ─── SETTINGS ────────────────────────────────────────────────────────────
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
                if (wb) { wb.style.borderColor='#a02030'; wb.style.color='#f09090'; }
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

    // ─── LAST INPUTS ─────────────────────────────────────────────────────────
    function saveLastInputs(imp, ret, cancel) {
        try { localStorage.setItem('__dodge_last', JSON.stringify({imp:imp, ret:ret, cancel:cancel})); } catch(e){}
    }
    function loadLastInputs() {
        try {
            var d = JSON.parse(localStorage.getItem('__dodge_last')||'{}');
            if (d.imp)    document.getElementById('__dc_impact').value  = d.imp;
            if (d.ret)    document.getElementById('__dc_return').value  = d.ret;
            if (d.cancel) document.getElementById('__dc_cancel').value  = d.cancel;
        } catch(e){}
    }
    loadLastInputs();

    // ─── AUDIO ───────────────────────────────────────────────────────────────
    var actx = null;
    function getWave() {
        var active = document.querySelector('[id^=__dc_wave_][style*="#f09090"]');
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
        } else { beep(f,0.15,v); }
    }
    function testPreview() { alertSound('send'); }

    // ─── DISCORD ─────────────────────────────────────────────────────────────
    function discord(msg) {
        var url = document.getElementById('__dc_webhook').value.trim();
        if (!url||!url.startsWith('https://discord.com/api/webhooks/')) return;
        try { localStorage.setItem('__dodge_wh',url); } catch(e){}
        fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({content:msg})}).catch(function(){});
    }

    // ─── HELPERS ─────────────────────────────────────────────────────────────
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

    // ─── HISTORY ─────────────────────────────────────────────────────────────
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
            if (!h.length) {
                var e=document.createElement('div'); e.style.color='#7a4048'; e.style.fontSize='12px';
                e.style.letterSpacing='.5px'; e.textContent='Zatím žádná historie.'; list.appendChild(e); return;
            }
            h.forEach(function(entry) {
                var row=document.createElement('div'); row.className='hist-row';
                var info=document.createElement('div');
                info.innerHTML='<span style="color:#f8e8ec;font-family:\'JetBrains Mono\',monospace">'+entry.retStr+'</span> <span style="color:#9a6068;font-size:10.5px">cancel '+entry.cancelS+'s</span>';
                var load=document.createElement('a'); load.className='hist-load'; load.textContent='NAČÍST';
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
        document.querySelectorAll('#__dc .tab')[0].click();
    }

    // ─── TRAVEL CALC ─────────────────────────────────────────────────────────
    function calcTravel() {
        var fromStr = document.getElementById('__dc_from').value.trim();
        var toStr   = document.getElementById('__dc_to').value.trim();
        var speed   = parseFloat(document.getElementById('__dc_unit').value);
        if (speed===0) speed = parseFloat(document.getElementById('__dc_custom_speed').value)||0;
        var res = document.getElementById('__dc_travres');
        res.style.display='';
        if (!fromStr||!toStr) { res.innerHTML='<span style="color:#f06060">Zadej obě koordináty</span>'; return; }
        if (!speed||speed<=0) { res.innerHTML='<span style="color:#f06060">Zadej rychlost</span>'; return; }
        var fp=fromStr.split('|'), tp=toStr.split('|');
        if (fp.length<2||tp.length<2) { res.innerHTML='<span style="color:#f06060">Formát: XXX|YYY</span>'; return; }
        var dx=+fp[0]-+tp[0], dy=+fp[1]-+tp[1];
        if (isNaN(dx)||isNaN(dy)) { res.innerHTML='<span style="color:#f06060">Neplatné koordináty</span>'; return; }
        var dist = Math.sqrt(dx*dx+dy*dy);
        var travelMs = Math.round(dist * speed * 60 * 1000);
        var h=Math.floor(travelMs/3600000), m=Math.floor((travelMs%3600000)/60000), s=Math.floor((travelMs%60000)/1000);
        res.style.color='#a02030';
        res.innerHTML =
            '<span style="color:#b07880;font-size:10.5px;letter-spacing:1px;font-family:Rajdhani,sans-serif">VZDÁLENOST</span><br>' +
            '<strong style="color:#f09090;font-size:18px">' + dist.toFixed(2) + '</strong> <span style="color:#9a7080;font-size:11px">polí</span><br><br>' +
            '<span style="color:#b07880;font-size:10.5px;letter-spacing:1px;font-family:Rajdhani,sans-serif">ČAS CESTY</span><br>' +
            '<strong style="color:#f8e8ec;font-size:16px">' + h + 'h ' + m + 'm ' + s + 's</strong>';
    }

    // ─── ALERT LOOP ──────────────────────────────────────────────────────────
    // Alerty přes setTimeout. Odpočet je jen orientační — tikne každou sekundu,
    // ale uživatel se musí řídit serverovým časem ve hře.
    var alertTimers = [], cdInterval = null, calcData = null;

    function stopAlerts() {
        alertTimers.forEach(function(t){ clearTimeout(t); });
        alertTimers = [];
        if (cdInterval) { clearInterval(cdInterval); cdInterval = null; }
    }

    function scheduleAlert(delayMs, fn) {
        if (delayMs < 0) return; // minulost, přeskočit
        alertTimers.push(setTimeout(fn, delayMs));
    }

    function runCalc() {
        stopAlerts();
        var retStr  = document.getElementById('__dc_return').value;
        var impStr  = document.getElementById('__dc_impact').value;
        var cancelS = parseFloat(document.getElementById('__dc_cancel').value)||420;
        resArea.innerHTML = '';

        if (!retStr||!retStr.trim()) { resArea.appendChild(mkBadge('Zadej čas návratu vojska','warn')); return; }
        if (cancelS>600) { resArea.appendChild(mkBadge('Max 600 sekund!','err')); return; }
        var retMs = parseT(retStr);
        if (!retMs) { resArea.appendChild(mkBadge('Neplatný formát času návratu','err')); return; }

        var impMs      = parseT(impStr);
        var cancelMs   = Math.round(cancelS * 1000);
        var sendTime   = retMs - 2 * cancelMs;
        var cancelTime = sendTime + cancelMs;
        var toSend     = sendTime - Date.now();

        if (toSend < -10000) {
            resArea.appendChild(mkBadge('Příliš pozdě! Mělo se odeslat před '+Math.abs(toSend/1000).toFixed(1)+'s','err'));
            return;
        }

        calcData = {sendTime:sendTime, cancelTime:cancelTime, retMs:retMs, impMs:impMs, cancelS:cancelS};
        saveHistory({retStr:retStr, impStr:impStr, cancelS:cancelS, ts:Date.now()});
        saveLastInputs(impStr, retStr, cancelS);

        // ── Statické zobrazení výsledků ──────────────────────────────────────
        var sec = document.createElement('div');
        sec.style.cssText = 'border-top:1px solid #220810;padding-top:10px;margin-top:10px;';
        if (impMs) sec.appendChild(mkRow('Dopad útoku',                 fmtT(impMs),      ''));
        sec.appendChild(mkRow('➤  Odeslat dodge',                       fmtT(sendTime),   '#f09090'));
        sec.appendChild(mkRow('✕  Zrušit (za '+(cancelS/60).toFixed(1)+'min)', fmtT(cancelTime), '#e8c040'));
        sec.appendChild(mkRow('↩  Vojsko zpět',                        fmtT(retMs),      '#7ad87a'));
        sec.appendChild(mkRow('Vojsko pryč',                            (cancelS*2/60).toFixed(1)+' min', ''));
        resArea.appendChild(sec);

        // ── Orientační odpočet s varováním ───────────────────────────────────
        var cdBox = document.createElement('div'); cdBox.className = 'cd-box'; cdBox.id = '__dc_cdbox'; cdBox.textContent = '--:--:---';
        var cdLbl = document.createElement('div'); cdLbl.className = 'cd-lbl'; cdLbl.id = '__dc_cdlbl'; cdLbl.textContent = 'orientační odpočet do odeslání';
        var cdWarn = document.createElement('div'); cdWarn.className = 'cd-warn';
        cdWarn.innerHTML = '⚠ <b>Pouze orientační</b> — řiď se serverovým časem ve hře';
        resArea.appendChild(cdBox); resArea.appendChild(cdLbl); resArea.appendChild(cdWarn);

        // Interval tikne každou sekundu — jen aktualizuje odpočet, nespouští alerty
        cdInterval = setInterval(function(){
            var n = Date.now();
            var toS = calcData.sendTime - n;
            var toC = calcData.cancelTime - n;
            var cdEl = document.getElementById('__dc_cdbox');
            var cdLEl = document.getElementById('__dc_cdlbl');
            if (!cdEl) { clearInterval(cdInterval); cdInterval = null; return; }

            if (toS > 0) {
                cdEl.textContent = fmtCnt(toS);
                cdEl.style.color = toS < 60000 ? '#f06060' : (toS < 180000 ? '#e8c040' : '#d05068');
                cdLEl.textContent = 'orientační odpočet do odeslání';
            } else if (toC > 0) {
                cdEl.textContent = fmtCnt(toC);
                cdEl.style.color = toC < 60000 ? '#f06060' : '#d0b040';
                cdLEl.textContent = 'orientační odpočet do zrušení';
            } else {
                cdEl.textContent = 'HOTOVO ✓';
                cdEl.style.color = '#7ad87a';
                cdLEl.textContent = 'vojsko na cestě zpět';
                clearInterval(cdInterval); cdInterval = null;
            }
        }, 1000);

        // ── Log alertů ───────────────────────────────────────────────────────
        var logLbl = document.createElement('div');
        logLbl.className = 'hint'; logLbl.style.cssText = 'margin-top:8px;color:#7a4048;';
        logLbl.textContent = '— log alertů —';
        var logEl = document.createElement('div');
        logEl.className = 'alert-log scrollbar'; logEl.id = '__dc_alertlog';
        resArea.appendChild(logLbl); resArea.appendChild(logEl);

        document.getElementById('__dc_stopbtn').style.display = 'block';

        var sndOn  = document.getElementById('__dc_sound').checked;
        var discOn = document.getElementById('__dc_discordon').checked;
        var A1     = parseInt(document.getElementById('__dc_alert1').value||3) * 60000;
        var A2     = parseInt(document.getElementById('__dc_alert2').value||3) * 60000;

        // ── Naplánovat alerty pomocí setTimeout ──────────────────────────────

        // Alert X minut před odesláním
        var toSendAlert = sendTime - A1 - Date.now();
        scheduleAlert(toSendAlert, function(){
            if(sndOn) alertSound('send');
            addLog('Alert: za '+(A1/60000)+' min odesílej!', 'al-send');
            if(discOn) discord('⚔️ **Dodge** — za '+(A1/60000)+' min odešli útok!\n➤ Odeslat: `'+fmtT(sendTime)+'`\n✕ Zrušit: `'+fmtT(cancelTime)+'`\n↩ Návrat: `'+fmtT(retMs)+'`');
        });

        // Alert 1 minutu před odesláním
        scheduleAlert(sendTime - 60000 - Date.now(), function(){
            if(sndOn) alertSound('send');
            addLog('Alert: ZA 1 MINUTU odesílej!', 'al-warn');
            if(discOn) discord('🚨 **Dodge** — za 1 minutu odešli útok!\n➤ Odeslat: `'+fmtT(sendTime)+'`');
        });

        // Přesný čas odeslání
        scheduleAlert(sendTime - Date.now(), function(){
            if(sndOn) alertSound('send');
            addLog('→ ČAS ODESLÁNÍ!', 'al-send');
        });

        // Alert X minut před zrušením
        scheduleAlert(cancelTime - A2 - Date.now(), function(){
            if(sndOn) alertSound('cancel');
            addLog('Alert: za '+(A2/60000)+' min rušíš!', 'al-cancel');
            if(discOn) discord('⏱️ **Dodge** — za '+(A2/60000)+' min zruš útok!\n✕ Zrušit: `'+fmtT(cancelTime)+'`\n↩ Návrat: `'+fmtT(retMs)+'`');
        });

        // Alert 1 minutu před zrušením
        scheduleAlert(cancelTime - 60000 - Date.now(), function(){
            if(sndOn) alertSound('cancel');
            addLog('Alert: ZA 1 MINUTU ruš!', 'al-warn');
            if(discOn) discord('🚨 **Dodge** — za 1 minutu zruš útok!\n✕ Zrušit: `'+fmtT(cancelTime)+'`');
        });

        // Přesný čas zrušení
        scheduleAlert(cancelTime - Date.now(), function(){
            if(sndOn) alertSound('cancel');
            addLog('→ ČAS ZRUŠENÍ!', 'al-cancel');
        });

        // Dokončeno — vojsko na cestě zpět
        scheduleAlert(retMs - Date.now(), function(){
            addLog('✓ Sekvence dokončena', 'al-send');
            document.getElementById('__dc_stopbtn').style.display = 'none';
        });
    }

})();
