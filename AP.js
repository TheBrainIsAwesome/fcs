// Advanced Command Scheduler
// Author: TheBrain🧠

(async () => {
    'use strict';

    const _url = window.location.search;
    if (!_url.includes('screen=place') || !_url.includes('try=confirm')) {
        alert('Attack Planner: Open this on the attack confirmation page (screen=place&try=confirm).');
        return;
    }

    //****************************** Configuration ******************************//
    const defaultInternetDelay = 30;
    const worldBackwardDelay = 50;
    const loopStartTime = 1800;
    const jitterRange = 12;
    const maxHistoryEntries = 5;
    //*************************************************************************//

    const CommandSender = {
        confirmButton: null,
        duration: null,
        internetDelay: null,
        sent: false,
        initialized: false,
        countdownInterval: null,
        use12h: false,
        sendTimestamp: null,
        _selectedDate: null,
        _worker: null,
        _ghostActive: false,
        _measuredPing: null,

        // ─── Auto-Latency Calibration ─────────────────────────────────────────
        measurePing: async function (samples = 7) {
            const rtts = [];
            const baseUrl = window.location.origin + '/interface.php?func=get_config';
            for (let i = 0; i < samples; i++) {
                try {
                    const t0 = performance.now();
                    await fetch(baseUrl + '&_nocache=' + Date.now() + '_' + i, {
                        method: 'GET',
                        cache: 'no-store',
                        credentials: 'same-origin'
                    });
                    const t1 = performance.now();
                    rtts.push(t1 - t0);
                } catch (e) { }
                await new Promise(r => setTimeout(r, 150));
            }
            if (rtts.length === 0) return null;
            rtts.sort((a, b) => a - b);
            const median = rtts[Math.floor(rtts.length / 2)];
            const oneWay = Math.round(median / 2) + 45;
            this._measuredPing = oneWay;
            localStorage.setItem('ACS.measuredPing', String(oneWay));
            localStorage.setItem('ACS.measuredPingRaw', JSON.stringify(rtts.map(r => Math.round(r))));
            return oneWay;
        },

        init: function () {
            if ($('#ACSMainContainer').length > 0 || this.initialized) return;

            this.confirmButton = $('#troop_confirm_submit');
            if (this.confirmButton.length === 0) return;

            this.initialized = true;

            const formTable = $('#command-data-form').find('tbody')[0];
            if (!formTable) return;

            this.use12h = localStorage.getItem('ACS.use12h') === 'true';

            $(formTable).append(
                `<tr class="acs-row-blood">
                    <td colspan="2" style="padding: 0;">

                        <button type="button" id="ACSToggleBtn" class="btn btn-blood"
                            style="width:100%; box-sizing:border-box; display:block; margin:0;"
                            title="Open or close the Ghost Mode attack scheduler panel">
                            Open Attack Planner
                        </button>

                        <div id="ACSMainContainer" style="display:none; border-top:1px solid #4a0000; box-sizing:border-box; background:rgba(43,0,0,0.1);">
                            <div style="padding:10px 0;">
                                <table style="width:100%; border-spacing:0 5px; border-collapse:separate;">

                                    <tr>
                                        <td style="color:#ff4d4d; font-weight:bold; width:35%; padding-left:5px;"
                                            title="Switch the time display format between 24h and 12h AM/PM">
                                            Time Format:
                                        </td>
                                        <td style="padding-right:5px;">
                                            <div style="display:flex; align-items:center; gap:8px;">
                                                <span id="ACSFormat24Label" style="color:#ff4d4d; font-weight:bold; font-size:9pt;">24h</span>
                                                <label class="acs-toggle-switch">
                                                    <input type="checkbox" id="ACSFormatToggle">
                                                    <span class="acs-toggle-slider"></span>
                                                </label>
                                                <span id="ACSFormat12Label" style="color:#ff4d4d; font-weight:bold; font-size:9pt;">12h (AM/PM)</span>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="color:#ff4d4d; font-weight:bold; padding-left:5px;"
                                            title="Type directly to set arrival time. Press ENTER or click away to confirm.">
                                            Target Arrival:
                                        </td>
                                        <td style="padding-right:5px;">
                                            <div style="display:flex; gap:5px; width:100%; position:relative;">
                                                <input type="text" id="ACSTimeText" class="blood-input acs-time-editable"
                                                    placeholder="DD/MM/YYYY HH:MM:SS.mmm"
                                                    spellcheck="false" autocomplete="off"
                                                    style="flex:1; min-width:170px; width:100%; font-family:monospace; font-size:9pt; box-sizing:border-box;"
                                                    title="Type the target arrival date/time. Format: DD/MM/YYYY HH:MM:SS.mmm">
                                                <input type="datetime-local" id="ACStime" step=".001"
                                                    style="position:absolute; opacity:0; pointer-events:none; width:1px; height:1px; top:0; left:0;"
                                                    tabindex="-1">
                                                <button type="button" id="ACSSetTimeBtn" class="btn btn-blood-bright"
                                                    title="Open the browser date/time picker">
                                                    SET DAY &amp; TIME
                                                </button>
                                            </div>
                                            <div style="display:flex; gap:4px; margin-top:4px;" id="ACSQuickButtons">
                                                <button type="button" class="acs-quick-btn" data-offset="3600" title="+1 hour">+1h</button>
                                                <button type="button" class="acs-quick-btn" data-offset="21600" title="+6 hours">+6h</button>
                                                <button type="button" class="acs-quick-btn" data-offset="43200" title="+12 hours">+12h</button>
                                                <button type="button" class="acs-quick-btn" data-offset="86400" title="+1 day">+1d</button>
                                                <button type="button" class="acs-quick-btn" data-offset="-3600" title="-1 hour" style="color:#ff8080;">-1h</button>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="color:#ff4d4d; font-weight:bold; padding-left:5px;"
                                            title="Network latency compensation in ms. Higher = command sent earlier.">
                                            Network Correction:
                                        </td>
                                        <td style="padding-right:5px;">
                                            <div style="display:flex; gap:4px; align-items:center;">
                                                <input type="number" id="ACSInternetDelay" class="blood-input"
                                                    style="flex:1; box-sizing:border-box;"
                                                    title="One-way network latency in ms.">
                                                <span style="color:#ff4d4d; font-size:8pt; white-space:nowrap;">ms</span>
                                                <button type="button" id="ACSAutoDetect" class="btn-blood-bright"
                                                    style="white-space:nowrap; font-size:7.5pt; padding:3px 6px;"
                                                    title="Automatically measure network latency (7 requests, median)">
                                                    📡 Auto-Detect
                                                </button>
                                            </div>
                                            <div id="ACSPingResult" style="margin-top:3px; font-size:7.5pt; font-family:monospace; color:#888; display:none;"></div>
                                            <div style="margin-top:4px;">
                                                <label style="font-size:7.5pt; color:#fff; background:#000; padding:2px 4px; border-radius:3px; cursor:pointer;"
                                                    title="Re-measures ping 3s before send for maximum precision.">
                                                    <input type="checkbox" id="ACSAutoJit" ${localStorage.getItem('ACS.autoJit') !== 'false' ? 'checked' : ''} style="vertical-align:middle; margin:0 3px 0 0;"> Auto-Calibrate 3s before send
                                                </label>
                                            </div>
                                        </td>
                                    </tr>

                                </table>
                            </div>

                            <div id="ACSArrivalPreview" style="margin:0 5px 4px 5px; padding:5px 8px; background:#0d0000; border:1px solid #2a0000; color:#8a0303; font-size:8pt; border-radius:2px; font-family:monospace; display:flex; justify-content:space-between; align-items:center;">
                                <span style="color:#ffffff; font-weight:bold;">⚔ Arrives at:</span>
                                <span id="ACSArrivalTime" style="color:#ff4d4d; font-weight:bold; letter-spacing:0.5px;">--:--:--.--- (--/--/----)</span>
                            </div>

                            <div id="ACSWarning" style="display:none; margin:0 5px 5px 5px; padding:5px 8px; background:#3a2000; border:1px solid #ff8800; color:#ffaa00; font-size:8pt; border-radius:2px;"></div>

                            <button type="button" id="ACSbutton" class="btn btn-blood"
                                style="width:100%; box-sizing:border-box; display:block; margin:0;"
                                title="Activate Ghost Mode — auto-sends the attack at the right time">
                                Confirm Ghost Mode
                            </button>

                            <div id="ACSCountdownContainer" style="display:none; box-sizing:border-box; border-top:1px dashed #ff0000; border-bottom:1px dashed #ff0000; background:#1a0000; width:100%;">
                                <div style="padding:10px;">
                                    <div id="ACSCountdown"
                                        style="color:#ff0000; font-family:monospace; font-size:14pt; font-weight:bold; text-align:center;">
                                        00:00:00.000
                                    </div>
                                    <div id="ACSTargetDisplay"
                                        style="color:#8a0303; font-size:8pt; text-align:center; margin-top:3px;">
                                        Sending at: --:--:-- (Server Time)
                                    </div>
                                    <div id="ACSSendAccuracy" style="display:none; color:#ffcc00; font-size:8pt; text-align:center; margin-top:3px;"></div>
                                </div>
                            </div>

                            <div id="ACSHistoryContainer" style="display:none; border-top:1px dashed #4a0000; padding:5px;">
                                <div style="color:#8a0303; font-size:8pt; font-weight:bold; margin-bottom:3px;">📋 Attack History:</div>
                                <div id="ACSHistoryList" style="font-size:7.5pt; font-family:monospace; color:#cc3333; max-height:80px; overflow-y:auto; background:#0d0000; border:1px solid #2a0000; border-radius:2px; padding:2px 4px;"></div>
                            </div>

                            <div id="ACSPoweredBy"
                                style="padding:5px 5px 10px 0; font-size:9pt; color:#8a0303; text-align:right; font-weight:bold; text-shadow:1px 1px 1px #000; cursor:help;"
                                title="B4LD PH4NT0M">
                                Powered by TheBrain 🧠
                            </div>
                        </div>
                    </td>
                </tr>`
            );

            const durationRow = $('#command-data-form').find('td:contains("Trvání:"), td:contains("Doba trvání"), td:contains("Duração:"), td:contains("Duration:")').next();
            this.duration = durationRow.text().trim().split(':').map(Number);
            this.internetDelay = localStorage.getItem('ACS.internetDelay') || defaultInternetDelay;
            this._measuredPing = localStorage.getItem('ACS.measuredPing') ? parseInt(localStorage.getItem('ACS.measuredPing')) : null;

            $('#ACSInternetDelay').val(this.internetDelay);

            if (this._measuredPing !== null) {
                this._showPingResult(this._measuredPing);
            }

            // Default arrival = now + travel duration + 60s buffer
            let d = new Date(Timing.getCurrentServerTime());
            d.setHours(d.getHours() + (this.duration[0] || 0));
            d.setMinutes(d.getMinutes() + (this.duration[1] || 0));
            d.setSeconds(d.getSeconds() + (this.duration[2] || 0) + 60);
            this._setSelectedDate(d);

            $('#ACSFormatToggle').prop('checked', this.use12h);
            this.updateFormatLabels();
            this.renderTimeDisplay();

            this.preventVisibilityDetection();
            this.renderHistory();

            // ---- Event Bindings ----

            $('#ACSFormatToggle').change(() => {
                this.use12h = $('#ACSFormatToggle').is(':checked');
                localStorage.setItem('ACS.use12h', this.use12h);
                this.updateFormatLabels();
                this.renderTimeDisplay();
                this.renderHistory();
            });

            $('#ACSSetTimeBtn').click(() => {
                const tzoffset = this._selectedDate.getTimezoneOffset() * 60000;
                $('#ACStime').val((new Date(this._selectedDate - tzoffset)).toISOString().slice(0, 23));
                document.getElementById('ACStime').showPicker();
            });

            $('#ACStime').on('change', () => {
                const val = $('#ACStime').val();
                if (!val) return;
                const parsed = new Date(val.replace('T', ' '));
                if (!isNaN(parsed.getTime())) {
                    this._setSelectedDate(parsed);
                }
            });

            const liveParseInput = () => {
                const raw = $('#ACSTimeText').val();
                const parsed = this.parseManualInput(raw);
                if (parsed) {
                    this._setSelectedDate(parsed, true);
                    $('#ACSTimeText').css('border-color', '');
                } else {
                    $('#ACSTimeText').css('border-color', '#550000');
                }
            };
            $('#ACSTimeText').on('input', liveParseInput);
            $('#ACSTimeText').on('blur', () => {
                const raw = $('#ACSTimeText').val();
                const parsed = this.parseManualInput(raw);
                if (parsed) {
                    this._setSelectedDate(parsed);
                    $('#ACSTimeText').css('border-color', '');
                } else if (this._selectedDate) {
                    this.renderTimeDisplay();
                    $('#ACSTimeText').css('border-color', '');
                }
            });
            $('#ACSTimeText').on('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); $('#ACSTimeText').blur(); }
            });

            // Segment definitions: [start, end (exclusive), maxLen]
            const ACS_SEGMENTS = [
                [0,  2,  2],  // DD
                [3,  5,  2],  // MM
                [6,  10, 4],  // YYYY
                [11, 13, 2],  // HH
                [14, 16, 2],  // MM
                [17, 19, 2],  // SS
                [20, 23, 3],  // mmm
            ];

            const getSegmentAt = (pos) => {
                for (let i = 0; i < ACS_SEGMENTS.length; i++) {
                    const [s, e_] = ACS_SEGMENTS[i];
                    if (pos >= s && pos <= e_) return i;
                }
                return -1;
            };

            $('#ACSTimeText').on('dblclick', function (e) {
                e.preventDefault();
                const pos = this.selectionStart;
                const idx = getSegmentAt(pos);
                if (idx >= 0) {
                    const [s, e_] = ACS_SEGMENTS[idx];
                    this.setSelectionRange(s, e_);
                } else {
                    this.select();
                }
            });

            $('#ACSTimeText').on('input', function () {
                const input = this;
                const pos = input.selectionStart;
                const val = input.value;
                const idx = getSegmentAt(pos - 1);
                if (idx < 0) return;
                const [segStart, segEnd, maxLen] = ACS_SEGMENTS[idx];
                const segContent = val.slice(segStart, segEnd);
                const typedLen = segContent.replace(/[^\d]/g, '').length;
                if (typedLen >= maxLen && idx < ACS_SEGMENTS.length - 1) {
                    const [nextStart, nextEnd] = ACS_SEGMENTS[idx + 1];
                    setTimeout(() => { input.setSelectionRange(nextStart, nextEnd); }, 0);
                }
            });

            $('#ACSToggleBtn').click(() => {
                $('#ACSMainContainer').toggle();
                const isVisible = $('#ACSMainContainer').is(':visible');
                $('#ACSToggleBtn').text(isVisible ? 'Close Attack Planner' : 'Open Attack Planner');
            });

            $('#ACSAutoDetect').click(async () => {
                const btn = $('#ACSAutoDetect');
                btn.text('📡 Measuring...').prop('disabled', true);
                $('#ACSPingResult').text('Sending test requests...').css('color', '#ffcc00').show();
                const ping = await this.measurePing();
                btn.text('📡 Auto-Detect').prop('disabled', false);
                if (ping !== null) {
                    $('#ACSInternetDelay').val(ping);
                    this.internetDelay = ping;
                    localStorage.setItem('ACS.internetDelay', ping);
                    this._showPingResult(ping);
                } else {
                    $('#ACSPingResult').text('❌ Measurement failed — check connection').css('color', '#ff4444').show();
                }
            });

            $(document).on('change', '#ACSAutoJit', function () {
                localStorage.setItem('ACS.autoJit', $(this).is(':checked'));
            });

            $(document).on('click', '.acs-quick-btn', (e) => {
                const offset = parseInt($(e.target).data('offset'));
                if (!this._selectedDate) return;
                const newDate = new Date(this._selectedDate.getTime() + offset * 1000);
                this._setSelectedDate(newDate);
            });

            $('#ACSbutton').click((e) => {
                e.preventDefault();
                if (this._ghostActive) {
                    if (confirm('Cancel the scheduled attack?')) {
                        this.cancelGhost();
                    }
                } else {
                    this.executeLogic();
                }
            });
        },

        _setSelectedDate: function (date, skipInputUpdate) {
            this._selectedDate = date;
            if (!skipInputUpdate) this.renderTimeDisplay();
            this.validateTime();
            this.updateArrivalPreview();
        },

        renderTimeDisplay: function () {
            if (!this._selectedDate) return;
            const d = this._selectedDate;
            const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
            const timeStr = this.formatTimeOnly(d);
            const msStr = String(d.getMilliseconds()).padStart(3, '0');
            const formatted = `${dateStr} ${timeStr}.${msStr}`;
            if (document.activeElement !== document.getElementById('ACSTimeText')) {
                $('#ACSTimeText').val(formatted).css('border-color', '');
            }
            const ph = this.use12h ? 'DD/MM/YYYY HH:MM:SS.mmm AM/PM' : 'DD/MM/YYYY HH:MM:SS.mmm';
            $('#ACSTimeText').attr('placeholder', ph);
            this.updateArrivalPreview();
        },

        parseManualInput: function (raw) {
            raw = raw.trim();
            let ampm = null;
            const ampmMatch = raw.match(/\s+(AM|PM)$/i);
            if (ampmMatch) {
                ampm = ampmMatch[1].toUpperCase();
                raw = raw.replace(/\s+(AM|PM)$/i, '').trim();
            }
            const re = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/;
            const m = raw.match(re);
            if (!m) return null;
            let [, dd, mo, yyyy, hh, mm, ss = '0', ms = '0'] = m;
            let hours = parseInt(hh, 10);
            const mins = parseInt(mm, 10);
            const secs = parseInt(ss, 10);
            const msNum = parseInt(ms.padEnd(3, '0'), 10);
            if (ampm === 'AM' && hours === 12) hours = 0;
            else if (ampm === 'PM' && hours !== 12) hours += 12;
            const result = new Date(parseInt(yyyy, 10), parseInt(mo, 10) - 1, parseInt(dd, 10), hours, mins, secs, msNum);
            return isNaN(result.getTime()) ? null : result;
        },

        updateArrivalPreview: function () {
            if (!this._selectedDate) return;
            const d = this._selectedDate;
            const timeStr = this.formatServerTime(d);
            const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
            $('#ACSArrivalTime').text(`${timeStr} (${dateStr})`);
        },

        formatTimeOnly: function (date) {
            if (this.use12h) {
                let hours = date.getHours();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12 || 12;
                return `${String(hours).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')} ${ampm}`;
            } else {
                return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
            }
        },

        formatServerTime: function (date) {
            const ms = String(date.getMilliseconds()).padStart(3, '0');
            return `${this.formatTimeOnly(date)}.${ms}`;
        },

        updateFormatLabels: function () {
            if (this.use12h) {
                $('#ACSFormat24Label').css('opacity', '0.4');
                $('#ACSFormat12Label').css('opacity', '1');
            } else {
                $('#ACSFormat24Label').css('opacity', '1');
                $('#ACSFormat12Label').css('opacity', '0.4');
            }
        },

        validateTime: function () {
            if (!this._selectedDate) return;
            const sendTime = this._getAttackTimeFromSelected();
            if (!sendTime || isNaN(sendTime.getTime())) return;
            const nowMs = new Date(Timing.getCurrentServerTime()).getTime();
            const sendMs = sendTime.getTime();
            const diff = sendMs - nowMs;
            const warning = $('#ACSWarning');

            if (diff < 0) {
                const pastSec = Math.round(-diff / 1000);
                warning.text(`⚠️ Send time is ${pastSec}s in the past! Increase the target arrival time.`).show();
            } else if (diff < 5000) {
                warning.text('⚠️ Less than 5 seconds until send — too close to activate safely!').show();
            } else if (diff > 86400000 * 7) {
                warning.text('ℹ️ Target arrival is more than 7 days ahead — please verify the date.').show();
            } else {
                warning.hide();
            }
        },

        preventVisibilityDetection: function () {
            Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
            Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
            window.addEventListener('blur', (e) => e.stopImmediatePropagation(), true);
            window.addEventListener('visibilitychange', (e) => e.stopImmediatePropagation(), true);
        },

        executeLogic: function () {
            const attackTime = this._getAttackTimeFromSelected();
            if (!attackTime || isNaN(attackTime.getTime())) return;

            const nowMs = new Date(Timing.getCurrentServerTime()).getTime();
            if (attackTime.getTime() - nowMs < 5000) {
                alert('Send time is too close or already in the past!');
                return;
            }

            this.internetDelay = parseInt($('#ACSInternetDelay').val());
            localStorage.setItem('ACS.internetDelay', this.internetDelay);

            this._ghostActive = true;
            this.sent = false;
            this.confirmButton.addClass('btn-disabled');
            $('#ACSbutton')
                .text('🔴 GHOST ACTIVE — click to cancel')
                .removeClass('btn-blood')
                .addClass('btn-cancel-blood')
                .prop('disabled', false);
            $('#ACSCountdownContainer').show();
            $('#ACSSendAccuracy').hide();

            const serverDate = new Date(attackTime.getTime());
            const dateStr = `${serverDate.getFullYear()}-${String(serverDate.getMonth() + 1).padStart(2, '0')}-${String(serverDate.getDate()).padStart(2, '0')}`;
            $('#ACSTargetDisplay').text(`Sending at: ${dateStr} ${this.formatServerTime(serverDate)} (Server Time)`);

            this.sendTimestamp = attackTime.getTime();
            this.startCountdown(attackTime);

            const msUntilSend = attackTime.getTime() - Timing.getCurrentServerTime();

            // --- JIT CALIBRATION ---
            const isAutoCalibrate = $('#ACSAutoJit').is(':checked');
            if (isAutoCalibrate && msUntilSend > 5000) {
                setTimeout(async () => {
                    if (!this._ghostActive || this.sent) return;
                    $('#ACSTargetDisplay').after('<div id="ACSJitStatus" style="color:#ffcc00; font-size:8pt; text-align:center; margin-top:2px;">📡 Running Auto-Calibrate...</div>');
                    const newPing = await this.measurePing(5);
                    if (newPing !== null && this._ghostActive && !this.sent) {
                        this.internetDelay = newPing;
                        $('#ACSInternetDelay').val(newPing);
                        $('#ACSJitStatus').text(`✅ Calibrated: ${newPing}ms delay`).css('color', '#88ff88');
                    } else if (this._ghostActive && !this.sent) {
                        $('#ACSJitStatus').text('⚠️ Calibration failed, using old delay.').css('color', '#ff6666');
                    }
                    setTimeout(() => $('#ACSJitStatus').fadeOut(1000, function () { $(this).remove(); }), 5000);
                }, msUntilSend - 3500);
            }

            const timeToWait = msUntilSend - loopStartTime;

            setTimeout(() => {
                this.simulateHumanBehavior();
            }, Math.max(0, msUntilSend - 3000));

            setTimeout(() => {
                const ghostJitter = Math.floor(Math.random() * (jitterRange * 2 + 1)) - jitterRange;
                const finalDelay = this.internetDelay + ghostJitter;
                this.startLoop(attackTime, finalDelay);
            }, timeToWait);
        },

        startCountdown: function (target) {
            this.countdownInterval = setInterval(() => {
                const now = Timing.getCurrentServerTime();
                const diff = target - now;

                if (diff <= 0) {
                    if (!this.sent) $('#ACSCountdown').text("00:00:00.000");
                    clearInterval(this.countdownInterval);
                    return;
                }

                const hours = Math.floor(diff / 3600000);
                const minutes = Math.floor((diff % 3600000) / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                const ms = Math.floor(diff % 1000);

                $('#ACSCountdown').text(
                    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`
                );
            }, 50);
        },

        simulateHumanBehavior: function () {
            const btn = this.confirmButton[0];
            const rect = btn.getBoundingClientRect();
            const x = rect.left + (rect.width / 2) + (Math.random() * 10 - 5);
            const y = rect.top + (rect.height / 2) + (Math.random() * 10 - 5);
            btn.dispatchEvent(new MouseEvent('mouseover', { clientX: x, clientY: y, bubbles: true }));
        },

        startLoop: function (attackTime, delay) {
            const targetTimestamp = attackTime.getTime();

            const blob = new Blob([`setInterval(() => postMessage(''), ${0.7 + Math.random() * 0.5});`]);
            const worker = new Worker(window.URL.createObjectURL(blob));
            this._worker = worker;

            worker.onmessage = () => {
                if (this.sent || !this._ghostActive) return;
                const realOffset = delay - worldBackwardDelay;
                const nowMs = Timing.getCurrentServerTime() + realOffset;

                if (nowMs >= targetTimestamp) {
                    this.sent = true;
                    const actualSendTime = Timing.getCurrentServerTime();
                    this.executeSend();
                    worker.terminate();
                    clearInterval(this.countdownInterval);

                    const intendedClickTime = this.sendTimestamp - realOffset;
                    const loopPrecision = actualSendTime - intendedClickTime;
                    const absoluteOffset = actualSendTime - this.sendTimestamp;

                    const sign = loopPrecision >= 0 ? '+' : '';
                    const color = Math.abs(loopPrecision) <= 10 ? '#88ff88' : (Math.abs(loopPrecision) <= 30 ? '#ffcc44' : '#ff6666');

                    $('#ACSSendAccuracy').html(
                        `Click generated at: <span style="font-weight:bold">${absoluteOffset > 0 ? '+' : ''}${absoluteOffset}ms</span> (Worker precision: <span style="color:${color}">${sign}${loopPrecision}ms</span>)`
                    ).show();

                    this._ghostActive = false;
                    this._worker = null;
                    this.saveHistory(new Date(this._selectedDate.getTime()), absoluteOffset);
                }
            };
        },

        cancelGhost: function () {
            this._ghostActive = false;
            this.sent = false;
            if (this._worker) { this._worker.terminate(); this._worker = null; }
            if (this.countdownInterval) { clearInterval(this.countdownInterval); this.countdownInterval = null; }
            this.confirmButton.removeClass('btn-disabled');
            $('#ACSbutton')
                .text('Confirm Ghost Mode')
                .removeClass('btn-cancel-blood btn-active-blood')
                .addClass('btn-blood')
                .prop('disabled', false);
            $('#ACSCountdownContainer').hide();
            $('#ACSCountdown').text('00:00:00.000').removeClass('bazinga-final');
            $('#ACSSendAccuracy').hide();
        },

        executeSend: function () {
            const btn = this.confirmButton[0];
            ['mousedown', 'mouseup', 'click'].forEach(type => {
                btn.dispatchEvent(new MouseEvent(type, { view: window, bubbles: true, cancelable: true, detail: 1 }));
            });
            $('#ACSCountdown').text("!BAZINGA!").addClass('bazinga-final');
        },

        _getAttackTimeFromSelected: function () {
            if (!this._selectedDate) return null;
            const d = new Date(this._selectedDate.getTime());
            d.setHours(d.getHours() - (this.duration[0] || 0));
            d.setMinutes(d.getMinutes() - (this.duration[1] || 0));
            d.setSeconds(d.getSeconds() - (this.duration[2] || 0));
            return d;
        },

        getAttackTime: function () {
            return this._getAttackTimeFromSelected();
        },

        saveHistory: function (arrivalDate, accuracyMs) {
            let history = JSON.parse(localStorage.getItem('ACS.history') || '[]');
            const sign = accuracyMs >= 0 ? '+' : '';
            history.unshift({
                arrival: arrivalDate.toISOString(),
                accuracy: `${sign}${accuracyMs}ms`,
                ts: Date.now()
            });
            if (history.length > maxHistoryEntries) history = history.slice(0, maxHistoryEntries);
            localStorage.setItem('ACS.history', JSON.stringify(history));
            this.renderHistory();
        },

        renderHistory: function () {
            let history = JSON.parse(localStorage.getItem('ACS.history') || '[]');
            if (history.length === 0) return;

            $('#ACSHistoryContainer').show();
            const list = $('#ACSHistoryList');
            list.empty();

            history.forEach((entry, i) => {
                const d = new Date(entry.arrival);
                const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} ${this.formatServerTime(d)}`;
                const accVal = parseInt(entry.accuracy);
                const color = accVal < 0 ? '#ff8888' : accVal <= 10 ? '#88ff88' : '#ffcc44';
                list.append(`<div style="color:${color}; border-bottom:1px solid #2a0000; padding:1px 0;">
                    #${i + 1} → ${dateStr} <span style="color:${color}">(${entry.accuracy})</span>
                </div>`);
            });
        },

        _showPingResult: function (ping) {
            const rawData = JSON.parse(localStorage.getItem('ACS.measuredPingRaw') || '[]');
            const color = ping <= 25 ? '#88ff88' : (ping <= 60 ? '#ffcc44' : '#ff6666');
            const quality = ping <= 25 ? 'Excellent' : (ping <= 60 ? 'Good' : 'High latency');
            let text = `📡 Ping: <span style="color:${color}">${ping}ms (${quality})</span>`;
            if (rawData.length > 0) {
                text += ` <span style="color:#666; font-size:7pt;">RTTs: [${rawData.join(', ')}]ms</span>`;
            }
            $('#ACSPingResult').html(text).show();
        },

        addGlobalStyle: function (css) {
            const head = document.getElementsByTagName('head')[0];
            if (!head) return;
            const style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = css;
            head.appendChild(style);
        }
    };

    CommandSender.addGlobalStyle(`
        .blood-input {
            background: #2b0000 !important; color: #ff4d4d !important;
            border: 1px solid #8a0303 !important; font-family: Verdana,Arial; padding: 2px;
        }
        .acs-time-editable {
            padding: 3px 5px; font-family: monospace; font-size: 9pt;
            min-height: 22px; min-width: 170px; box-sizing: border-box;
            transition: border-color 0.2s; outline: none; overflow: visible;
        }
        .acs-time-editable:focus {
            border-color: #ff4d4d !important;
            box-shadow: 0 0 4px #ff000088;
        }
        .btn-blood {
            background: linear-gradient(to bottom, #8a0303 0%, #4a0000 100%) !important;
            color: white !important; border: 1px solid #330000 !important;
            cursor: pointer; padding: 6px 12px; font-weight: bold; border-radius: 0;
        }
        .btn-blood-bright {
            background: #ff0000 !important; color: white !important;
            border: 1px solid #ffffff !important; cursor: pointer;
            padding: 4px 8px; font-weight: bold; border-radius: 3px;
            white-space: nowrap; font-size: 8pt;
        }
        .btn-blood:hover, .btn-blood-bright:hover {
            background: #660000 !important; box-shadow: 0 0 5px #ff0000;
        }
        .btn-active-blood {
            background: #1a0000 !important; color: #8a0303 !important;
            border: 1px solid #4a0000 !important;
        }
        .btn-cancel-blood {
            background: linear-gradient(to bottom, #5a0000 0%, #2a0000 100%) !important;
            color: #ff6666 !important; border: 1px solid #ff0000 !important;
            cursor: pointer !important;
            animation: cancel-pulse 1.8s ease-in-out infinite;
        }
        .btn-cancel-blood:hover { background: #3a0000 !important; box-shadow: 0 0 8px #ff0000; }
        @keyframes cancel-pulse {
            0%, 100% { box-shadow: 0 0 3px #ff000066; }
            50%       { box-shadow: 0 0 10px #ff0000cc; }
        }
        .bazinga-final {
            color: #ccff00 !important;
            animation: bazinga-blink 0.4s infinite alternate;
            text-shadow: 0 0 10px #99ff00;
        }
        @keyframes bazinga-blink { from { color: #ccff00; } to { color: #ffff00; } }
        .acs-quick-btn {
            background: #2b0000; color: #ff4d4d; border: 1px solid #4a0000;
            padding: 2px 6px; cursor: pointer; font-size: 8pt; border-radius: 2px;
            transition: background 0.15s, box-shadow 0.15s;
        }
        .acs-quick-btn:hover { background: #4a0000; box-shadow: 0 0 4px #ff0000; }
        .acs-toggle-switch {
            position: relative; display: inline-block;
            width: 36px; height: 18px; cursor: pointer;
        }
        .acs-toggle-switch input { opacity: 0; width: 0; height: 0; }
        .acs-toggle-slider {
            position: absolute; inset: 0;
            background: #2b0000; border: 1px solid #8a0303; border-radius: 18px;
            transition: background 0.3s;
        }
        .acs-toggle-slider::before {
            content: ''; position: absolute;
            width: 12px; height: 12px; left: 2px; top: 2px;
            background: #8a0303; border-radius: 50%;
            transition: transform 0.3s, background 0.3s;
        }
        .acs-toggle-switch input:checked + .acs-toggle-slider { background: #3a0000; }
        .acs-toggle-switch input:checked + .acs-toggle-slider::before {
            transform: translateX(18px); background: #ff4d4d;
        }
        [title] { cursor: help; }
        button[title], .acs-quick-btn { cursor: pointer; }
        #ACSPoweredBy { cursor: help; }
    `);

    CommandSender.init();

})();
