// © 2026 TheBrain 
// Dodge Calculator — free to use, not to steal.

(function () {
    if (document.getElementById('__dodge_calc')) return;

    var s = document.createElement('style');
    s.textContent = [
        '#__dodge_calc{position:fixed;top:20px;right:20px;width:340px;background:#111;color:#eee;border:1px solid #444;border-radius:10px;padding:18px;z-index:999999;font-family:system-ui,sans-serif;font-size:13px;}',
        '#__dodge_calc h3{margin:0 0 12px;font-size:14px;font-weight:500;color:#fff;display:flex;justify-content:space-between;align-items:center;}',
        '#__dodge_calc label{display:block;font-size:11px;color:#aaa;margin:10px 0 4px;}',
        '#__dodge_calc input[type=text],#__dodge_calc input[type=number]{width:100%;background:#1e1e1e;color:#fff;border:1px solid #333;border-radius:5px;padding:6px 8px;font-size:13px;box-sizing:border-box;}',
        '#__dodge_calc .row2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}',
        '#__dodge_calc .calc-btn{width:100%;margin-top:12px;padding:9px;background:#2a4a8a;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;}',
        '#__dodge_calc .calc-btn:hover{background:#3a5aaa;}',
        '#__dodge_calc .res-section{margin-top:10px;border-top:1px solid #333;padding-top:10px;}',
        '#__dodge_calc .res-row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #222;}',
        '#__dodge_calc .res-row:last-child{border:none;}',
        '#__dodge_calc .res-lbl{color:#aaa;}',
        '#__dodge_calc .res-val{font-family:monospace;font-weight:500;}',
        '#__dodge_calc .badge{display:inline-block;padding:3px 8px;border-radius:4px;font-size:11px;margin-bottom:8px;}',
        '#__dodge_calc .ok{background:#1a3a1a;color:#4c4;}',
        '#__dodge_calc .warn{background:#3a3010;color:#ca4;}',
        '#__dodge_calc .err{background:#3a1010;color:#c44;}',
        '#__dodge_calc .close-btn{background:none;border:none;color:#888;cursor:pointer;font-size:16px;padding:0;line-height:1;}',
        '#__dodge_calc .hint{font-size:10px;color:#555;margin-top:3px;}'
    ].join('');
    document.head.appendChild(s);

    // --- Build DOM ---
    var panel = document.createElement('div');
    panel.id = '__dodge_calc';

    var closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.textContent = '\u2715';
    closeBtn.onclick = function () { panel.remove(); };

    var title = document.createElement('h3');
    title.appendChild(document.createTextNode('Dodge kalkulačka\u00a0'));
    title.appendChild(closeBtn);
    panel.appendChild(title);

    function field(lbl, id, ph, hint) {
        var w = document.createElement('div');
        var l = document.createElement('label'); l.textContent = lbl;
        var i = document.createElement('input'); i.type = 'text'; i.id = id; i.placeholder = ph;
        w.appendChild(l); w.appendChild(i);
        if (hint) { var h = document.createElement('div'); h.className = 'hint'; h.textContent = hint; w.appendChild(h); }
        return w;
    }

    var row2 = document.createElement('div'); row2.className = 'row2';
    row2.appendChild(field('Dopad útoku (HH:mm:ss:ms)', '__dc_impact', '16:43:18:270', ''));
    row2.appendChild(field('Návrat vojska (HH:mm:ss:ms)', '__dc_return', '16:43:18:370', 'Kdy chceš mít vojsko zpátky'));
    panel.appendChild(row2);

    var lbl3 = document.createElement('label'); lbl3.textContent = 'Zrušit po X sekundách (max 600)';
    var inp3 = document.createElement('input'); inp3.type = 'number'; inp3.id = '__dc_cancel'; inp3.value = '420'; inp3.min = '1'; inp3.max = '600';
    var hint3 = document.createElement('div'); hint3.className = 'hint'; hint3.textContent = 'Vojsko bude pryč celkem 2× tento čas';
    panel.appendChild(lbl3); panel.appendChild(inp3); panel.appendChild(hint3);

    var btn = document.createElement('button'); btn.className = 'calc-btn'; btn.textContent = 'Vypočítat';
    btn.onclick = runCalc;
    panel.appendChild(btn);

    var resArea = document.createElement('div'); resArea.id = '__dc_res';
    panel.appendChild(resArea);

    document.body.appendChild(panel);

    // --- Drag ---
    var dragging = false, dx, dy;
    title.style.cursor = 'grab';
    title.addEventListener('mousedown', function (e) {
        if (e.target === closeBtn) return;
        dragging = true;
        dx = e.clientX - panel.offsetLeft;
        dy = e.clientY - panel.offsetTop;
        title.style.cursor = 'grabbing';
        e.preventDefault();
    });
    document.addEventListener('mousemove', function (e) {
        if (!dragging) return;
        panel.style.left = (e.clientX - dx) + 'px';
        panel.style.top = (e.clientY - dy) + 'px';
        panel.style.right = 'auto';
    });
    document.addEventListener('mouseup', function () {
        if (dragging) { dragging = false; title.style.cursor = 'grab'; }
    });

    // --- Logic ---
    function parseT(str) {
        if (!str || !str.trim()) return null;
        var p = str.trim().split(/[:.]/);
        if (p.length < 3) return null;
        var h = +p[0], m = +p[1], s = +p[2], ms = +(p[3] || 0);
        if (isNaN(h) || isNaN(m) || isNaN(s)) return null;
        var t = new Date();
        t.setHours(h, m, s, ms);
        if (t.getTime() < Date.now() - 60000) t.setDate(t.getDate() + 1);
        return t.getTime();
    }

    function fmtT(ms) {
        if (ms == null) return '\u2014';
        var d = new Date(ms);
        var p = function (v, n) { return String(v).padStart(n || 2, '0'); };
        return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()) + ':' + p(d.getMilliseconds(), 3);
    }

    function fmtCnt(ms) {
        if (ms < 0) return 'MINULOST';
        var tot = Math.floor(ms / 1000);
        return Math.floor(tot / 60) + 'm ' + (tot % 60) + 's ' + (ms % 1000) + 'ms';
    }

    function makeRow(lbl, val, color) {
        var d = document.createElement('div'); d.className = 'res-row';
        var l = document.createElement('span'); l.className = 'res-lbl'; l.textContent = lbl;
        var v = document.createElement('span'); v.className = 'res-val'; v.textContent = val;
        if (color) v.style.color = color;
        d.appendChild(l); d.appendChild(v);
        return d;
    }

    function makeBadge(txt, cls) {
        var b = document.createElement('span'); b.className = 'badge ' + cls; b.textContent = txt;
        return b;
    }

    function runCalc() {
        var retStr = document.getElementById('__dc_return').value;
        var impStr = document.getElementById('__dc_impact').value;
        var cancelS = parseFloat(document.getElementById('__dc_cancel').value) || 420;
        var res = document.getElementById('__dc_res');
        res.innerHTML = '';

        if (!retStr || !retStr.trim()) {
            res.appendChild(makeBadge('Zadej čas návratu vojska', 'warn'));
            return;
        }
        if (cancelS > 600) { res.appendChild(makeBadge('Max 600 sekund!', 'err')); return; }

        var retMs = parseT(retStr);
        if (!retMs) { res.appendChild(makeBadge('Neplatný formát času návratu', 'err')); return; }

        var impMs = parseT(impStr);
        var cancelMs = Math.round(cancelS * 1000);
        var sendTime = retMs - 2 * cancelMs;
        var cancelTime = sendTime + cancelMs;
        var now = Date.now();
        var toSend = sendTime - now;

        if (toSend < -10000) {
            res.appendChild(makeBadge('Příliš pozdě! Mělo se odeslat před ' + Math.abs(toSend / 1000).toFixed(1) + 's', 'err'));
        } else if (toSend < 30000) {
            res.appendChild(makeBadge('Odesílej brzy — za ' + fmtCnt(Math.max(0, toSend)), 'warn'));
        } else {
            res.appendChild(makeBadge('Čas do odeslání: ' + fmtCnt(toSend), 'ok'));
        }

        var sec = document.createElement('div'); sec.className = 'res-section';
        if (impMs) sec.appendChild(makeRow('Dopad útoku', fmtT(impMs), ''));
        sec.appendChild(makeRow('➤ Odeslat dodge', fmtT(sendTime), '#6af'));
        sec.appendChild(makeRow('✕ Zrušit (za ' + (cancelS / 60).toFixed(1) + 'min)', fmtT(cancelTime), '#fa6'));
        sec.appendChild(makeRow('↩ Vojsko zpět', fmtT(retMs), '#4c4'));
        sec.appendChild(makeRow('Pryč celkem', (cancelS * 2 / 60).toFixed(1) + ' min', ''));
        res.appendChild(sec);
    }
})();
