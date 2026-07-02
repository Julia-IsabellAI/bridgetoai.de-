/* bridge to ai — Zwei-Klick-Consent für den ElevenLabs-KI-Chat (DSGVO)
   Einbindung:  <script src="/consent.js" data-agent-id="agent_…" defer></script>
   Optional:    data-chat-label="Chat starten"  (Standard: „Chat mit Bridge“)
   Das Widget lädt erst, nachdem die Besucherin ausdrücklich zugestimmt hat.
   Die Zustimmung wird lokal gespeichert (localStorage, kein Cookie, kein Tracking). */
(function () {
  var sc = document.currentScript;
  if (!sc) return;
  var AGENT = sc.getAttribute('data-agent-id');
  if (!AGENT) return;
  var LABEL = sc.getAttribute('data-chat-label') || 'Chat mit Bridge';
  var KEY = 'btai-consent-elevenlabs';

  function hasConsent() {
    try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }
  function remember() {
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
  }
  function loadWidget() {
    if (document.querySelector('elevenlabs-convai')) return;
    var el = document.createElement('elevenlabs-convai');
    el.setAttribute('agent-id', AGENT);
    document.body.appendChild(el);
    var s = document.createElement('script');
    s.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    s.async = true; s.type = 'text/javascript';
    document.body.appendChild(s);
  }

  function injectStyles() {
    if (document.getElementById('btai-consent-css')) return;
    var css = [
      '.btai-chat{position:fixed;right:18px;bottom:18px;z-index:9998;display:flex;flex-direction:column;align-items:flex-end;gap:10px;font-family:"Outfit",Arial,sans-serif;}',
      '.btai-chat-pill{display:inline-flex;align-items:center;gap:.45rem;background:#00D9C0;color:#0A2540;border:0;border-radius:100px;padding:.7rem 1.3rem;font-family:inherit;font-size:.9rem;font-weight:700;cursor:pointer;box-shadow:0 8px 28px rgba(0,217,192,.35);transition:transform .25s,box-shadow .25s;}',
      '.btai-chat-pill:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(0,217,192,.5);}',
      '.btai-chat-note{width:min(320px,calc(100vw - 36px));background:#061523;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:1rem 1.1rem;box-shadow:0 24px 60px rgba(0,0,0,.45);}',
      '.btai-chat-note p{margin:0 0 .8rem;color:rgba(255,255,255,.72);font-size:.8rem;line-height:1.6;font-weight:300;}',
      '.btai-chat-note strong{color:#fff;font-weight:600;}',
      '.btai-chat-note a{color:#00D9C0;text-decoration:none;}',
      '.btai-chat-note a:hover{text-decoration:underline;}',
      '.btai-chat-actions{display:flex;gap:.6rem;flex-wrap:wrap;}',
      '.btai-chat-ok{background:#00D9C0;color:#0A2540;border:0;border-radius:100px;padding:.5rem 1rem;font-family:inherit;font-size:.8rem;font-weight:700;cursor:pointer;}',
      '.btai-chat-no{background:transparent;color:rgba(255,255,255,.55);border:1.5px solid rgba(255,255,255,.2);border-radius:100px;padding:.5rem 1rem;font-family:inherit;font-size:.8rem;font-weight:600;cursor:pointer;}',
      '@media(max-width:600px){.btai-chat{right:14px;bottom:14px;}.btai-chat-pill{font-size:.85rem;padding:.6rem 1.1rem;}}'
    ].join('');
    var st = document.createElement('style');
    st.id = 'btai-consent-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function buildUI() {
    injectStyles();
    var box = document.createElement('div');
    box.className = 'btai-chat';
    box.innerHTML =
      '<div class="btai-chat-note" hidden>' +
        '<p><strong>KI-Chat aktivieren?</strong><br>' +
        'Der Chat wird von ElevenLabs Inc. (USA) bereitgestellt. Beim Start werden Verbindungsdaten ' +
        'und Ihre Chat-Eingaben dorthin übertragen (Art. 6 Abs. 1 lit. a DSGVO, § 25 TDDDG). ' +
        'Bitte keine sensiblen Daten eingeben. <a href="/datenschutz.html">Datenschutzerklärung</a></p>' +
        '<div class="btai-chat-actions">' +
          '<button type="button" class="btai-chat-ok">Einverstanden – Chat starten</button>' +
          '<button type="button" class="btai-chat-no">Lieber nicht</button>' +
        '</div>' +
      '</div>' +
      '<button type="button" class="btai-chat-pill" aria-expanded="false">💬 ' + LABEL + '</button>';
    document.body.appendChild(box);

    var note = box.querySelector('.btai-chat-note');
    var pill = box.querySelector('.btai-chat-pill');
    pill.addEventListener('click', function () {
      note.hidden = !note.hidden;
      pill.setAttribute('aria-expanded', String(!note.hidden));
    });
    box.querySelector('.btai-chat-ok').addEventListener('click', function () {
      remember();
      box.remove();
      loadWidget();
      if (window.goatcounter && window.goatcounter.count) {
        window.goatcounter.count({ path: 'chat-aktiviert', title: 'KI-Chat aktiviert', event: true });
      }
    });
    box.querySelector('.btai-chat-no').addEventListener('click', function () {
      note.hidden = true;
      pill.setAttribute('aria-expanded', 'false');
    });
  }

  if (hasConsent()) {
    loadWidget();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
})();
