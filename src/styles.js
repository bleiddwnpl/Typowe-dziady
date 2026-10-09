import { STADIUM_URL } from "./lib";

// Globalne style aplikacji
export const css = `
:root {
  /* ── TOKENY: zmiana wyglądu całej aplikacji odbywa się tutaj ── */
  --bg:#0E1A14;            --bg-rgb:14,26,20;       /* murawa nocą */
  --bg-raised:#122019;      --surface-rgb:21,36,28;  /* okna, menu, dymki */
  --ink:#fff;              --ink-rgb:255,255,255;     /* tekst i jasne linie */
  --accent:#007aff;        --accent-rgb:0,122,255;    /* akcent: zaznaczenia, przyciski */
  --accent-light:#60a5fa;  --accent-light-rgb:96,165,250;
  --accent-deep:#0051cc;
  --win:#34c759;           --win-rgb:52,199,89;       /* trafienie, online */
  --win-light:#4ade80;
  --loss:#ff3b30;          --loss-rgb:255,59,48;      /* pudło, brak typu */
  --warn:#ff9500;          --warn-rgb:255,149,0;
  --gold:#fbbf24;          --gold-rgb:251,191,36;     /* gwiazdki */
  --poll:#a78bfa;          --poll-rgb:167,139,250;    /* ankiety */
  --medal-1:#E8C35A; --medal-2:#C9D1D3; --medal-3:#D08B5B;  /* miejsca 1–3 w tabeli */
  --r-sm:8px; --r-md:12px; --r-lg:20px; --r-pill:999px;
}

* { box-sizing:border-box; margin:0; padding:0; -webkit-font-smoothing:antialiased; }
body { background:var(--bg); font-family:'Inter',sans-serif; }
::-webkit-scrollbar { width:0; }
.auth-screen { min-height:100vh; position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:flex-end; }
.photo-bg { position:fixed; inset:0; background-image:url('${STADIUM_URL}'); background-size:cover; background-position:center 30%; }
.ov1 { position:fixed; inset:0; background:linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.6) 50%,rgba(var(--bg-rgb),0.97) 78%,var(--bg) 100%); }
.ov2 { position:fixed; bottom:0; left:0; right:0; height:60%; background:radial-gradient(ellipse at 50% 100%,rgba(0,100,255,0.07) 0%,transparent 70%); }
.auth-hero { position:relative; z-index:5; padding:0 28px; margin-bottom:24px; }
.eyebrow { display:flex; align-items:center; gap:8px; margin-bottom:12px; }
.ey-line { width:28px; height:2px; background:var(--accent); border-radius:1px; }
.ey-txt { font-size:10px; font-weight:700; color:var(--accent-light); letter-spacing:3px; text-transform:uppercase; }
.hero-title { font-family:'Bebas Neue',sans-serif; font-size:62px; line-height:0.88; color:var(--ink); letter-spacing:2px; margin-bottom:12px; text-shadow:0 4px 40px rgba(0,0,0,0.8); }
.hero-blue { color:var(--accent-light); filter:drop-shadow(0 0 20px rgba(var(--accent-light-rgb),0.4)); }
.hero-sub { font-size:15px; font-weight:700; color:rgba(var(--ink-rgb),0.88); line-height:1.6; text-shadow:0 2px 12px rgba(0,0,0,0.9); }
.auth-card { position:relative; z-index:5; margin:0 16px 48px; background:rgba(var(--bg-rgb),0.82); border:1px solid rgba(var(--ink-rgb),0.1); border-radius:24px; padding:22px; backdrop-filter:blur(30px); box-shadow:0 24px 60px rgba(0,0,0,0.5); }
.card-shine { position:absolute; top:0; left:50%; transform:translateX(-50%); width:60%; height:1px; background:linear-gradient(90deg,transparent,rgba(var(--accent-light-rgb),0.4),transparent); }
.seg { display:flex; background:rgba(var(--ink-rgb),0.05); border:1px solid rgba(var(--ink-rgb),0.07); border-radius:14px; padding:3px; margin-bottom:16px; }
.seg-btn { flex:1; padding:10px; text-align:center; font-size:14px; font-weight:600; color:rgba(var(--ink-rgb),0.35); border-radius:var(--r-md); border:none; background:transparent; font-family:'Inter',sans-serif; cursor:pointer; transition:all 0.22s; }
.seg-btn.on { background:linear-gradient(135deg,var(--accent-deep),var(--accent)); color:var(--ink); }
.afield { position:relative; margin-bottom:10px; }
.aicon { position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:16px; opacity:0.4; pointer-events:none; }
.ainput { width:100%; padding:13px 16px 13px 42px; background:rgba(var(--ink-rgb),0.06); border:1px solid rgba(var(--ink-rgb),0.09); border-radius:var(--r-md); color:var(--ink); font-family:'Inter',sans-serif; font-size:15px; outline:none; }
.ainput:focus { background:rgba(var(--ink-rgb),0.09); border-color:rgba(var(--accent-rgb),0.5); }
.ainput::placeholder { color:rgba(var(--ink-rgb),0.22); }
.aerr { color:var(--loss); font-size:12px; text-align:center; margin-bottom:8px; font-weight:500; }
.acta { width:100%; padding:15px; background:linear-gradient(135deg,var(--accent-deep),var(--accent)); border:none; border-radius:14px; color:var(--ink); font-family:'Inter',sans-serif; font-size:16px; font-weight:700; cursor:pointer; margin-top:4px; box-shadow:0 8px 28px rgba(var(--accent-rgb),0.35); }
.acta:disabled { opacity:0.45; cursor:not-allowed; }
.forgot-btn { width:100%; padding:10px; background:transparent; border:none; color:rgba(var(--ink-rgb),0.35); font-size:13px; cursor:pointer; margin-top:4px; font-family:'Inter',sans-serif; }
.back-btn { width:100%; padding:12px; background:transparent; border:none; color:rgba(var(--ink-rgb),0.35); font-size:13px; cursor:pointer; margin-top:8px; font-family:'Inter',sans-serif; }
.reset-ok { background:rgba(var(--accent-rgb),0.08); border:1px solid rgba(var(--accent-rgb),0.2); border-radius:var(--r-md); padding:14px 16px; text-align:center; color:var(--accent-light); font-size:14px; font-weight:600; line-height:1.5; }
.app { min-height:100vh; background:var(--bg); max-width:480px; margin:0 auto; padding-bottom:100px; font-family:'Inter',sans-serif; }
.hdr { position:relative; overflow:hidden; padding:0 0 20px; min-height:200px; }
.hdr-photo { position:absolute; inset:0; background-image:url('${STADIUM_URL}'); background-size:cover; background-position:center 35%; filter:brightness(0.22) saturate(0.7); }
.hdr-ov { position:absolute; inset:0; background:linear-gradient(180deg,rgba(var(--bg-rgb),0.15) 0%,rgba(var(--bg-rgb),0.45) 55%,var(--bg) 100%); }
.hdr-ct { position:relative; z-index:2; padding:20px 18px 0; }
.hdr-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; gap:8px; }
.logo { font-family:'Bebas Neue',sans-serif; font-size:26px; color:var(--ink); letter-spacing:2px; flex-shrink:0; }
.logo span { color:var(--accent-light); }
.league-tabs { display:flex; gap:10px; margin:-8px -18px 8px; padding:8px 18px; overflow-x:auto; scrollbar-width:none; }
.league-tabs::-webkit-scrollbar { display:none; }
.league-tab { width:60px; height:60px; border-radius:16px; border:2px solid rgba(var(--ink-rgb),0.1); background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s; flex-shrink:0; position:relative; backdrop-filter:blur(8px); }
.league-tab:hover { border-color:rgba(var(--accent-rgb),0.35); }
.league-tab.active { border-color:var(--accent); background:rgba(var(--accent-rgb),0.15); box-shadow:0 0 0 3px rgba(var(--accent-rgb),0.12); }
.league-tab img { width:40px; height:40px; object-fit:contain; }
.league-tab .ldot { position:absolute; bottom:-8px; left:50%; transform:translateX(-50%); width:4px; height:4px; background:var(--accent); border-radius:50%; opacity:0; }
.league-tab.active .ldot { opacity:1; }
.stats { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; }
.sbox { background:rgba(0,0,0,0.5); border:1px solid rgba(var(--ink-rgb),0.1); border-radius:14px; padding:10px 12px; backdrop-filter:blur(10px); }
.slbl { font-size:10px; font-weight:700; color:rgba(var(--ink-rgb),0.45); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:3px; }
.sval { font-family:'Bebas Neue',sans-serif; font-size:26px; color:var(--ink); letter-spacing:1px; line-height:1; }
.sval.b { color:var(--accent-light); filter:drop-shadow(0 0 8px rgba(var(--accent-light-rgb),0.4)); }
.ct { padding:14px; }
.sh { font-size:12px; font-weight:700; color:rgba(var(--ink-rgb),0.5); letter-spacing:1.5px; text-transform:uppercase; margin-bottom:10px; padding:0 2px; }
.mc { background:rgba(var(--ink-rgb),0.04); border:1px solid rgba(var(--ink-rgb),0.08); border-radius:var(--r-lg); margin-bottom:10px; overflow:hidden; transition:border-color 0.2s,transform 0.15s; }
.mc:hover { border-color:rgba(var(--accent-rgb),0.25); transform:translateY(-1px); }
.mt2 { padding:9px 14px; background:rgba(var(--ink-rgb),0.02); border-bottom:1px solid rgba(var(--ink-rgb),0.06); display:flex; justify-content:space-between; align-items:center; }
.rbadge { font-size:11px; color:var(--accent-light); background:rgba(var(--accent-rgb),0.1); border:1px solid rgba(var(--accent-rgb),0.2); padding:3px 10px; border-radius:var(--r-lg); font-weight:700; }
.mtime { font-size:12px; color:rgba(var(--ink-rgb),0.65); font-weight:600; }
.mb2 { padding:14px; }
.tms { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; gap:6px; }
.tm { display:flex; align-items:center; gap:7px; flex:1; min-width:0; }
.tm.r { flex-direction:row-reverse; }
.tn { font-size:13px; font-weight:700; color:var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.tm.r .tn { text-align:right; }
.vs-sep { flex-shrink:0; text-align:center; }
.vs-txt { font-size:10px; color:rgba(var(--ink-rgb),0.25); font-weight:700; letter-spacing:1px; }
.vs-result { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--accent-light); letter-spacing:1px; }
.odds { display:flex; gap:8px; }
.odd { flex:1; border-radius:var(--r-md); padding:10px 6px; text-align:center; background:rgba(var(--ink-rgb),0.04); border:1.5px solid rgba(var(--ink-rgb),0.08); cursor:pointer; transition:all 0.18s; }
.odd:hover:not(:disabled) { background:rgba(var(--accent-rgb),0.1); border-color:rgba(var(--accent-rgb),0.4); }
.odd.sel { background:rgba(var(--accent-rgb),0.15); border-color:var(--accent); }
.odd.ok { background:rgba(var(--win-rgb),0.1); border-color:var(--win); }
.odd.no { opacity:0.3; }
.odd:disabled { cursor:default; }
.ol { font-size:11px; color:rgba(var(--ink-rgb),0.5); font-weight:600; }
.odd.sel .ol { color:rgba(var(--accent-light-rgb),0.8); }
.odd.ok .ol { color:var(--win); }
.ov { font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--ink); letter-spacing:0.5px; margin-top:2px; }
.odd.sel .ov { color:var(--accent-light); }
.odd.ok .ov { color:var(--win); }
.tipok { margin-top:10px; background:rgba(var(--accent-rgb),0.08); border:1px solid rgba(var(--accent-rgb),0.2); border-radius:10px; padding:8px 12px; font-size:13px; color:var(--accent-light); font-weight:600; }
.lck { margin-top:10px; font-size:13px; color:var(--loss); text-align:center; font-weight:600; }
.res-w { background:rgba(var(--win-rgb),0.15); color:var(--win); font-size:11px; font-weight:700; padding:3px 10px; border-radius:var(--r-lg); }
.res-l { background:rgba(var(--loss-rgb),0.12); color:var(--loss); font-size:11px; font-weight:700; padding:3px 10px; border-radius:var(--r-lg); }
.res-n { background:rgba(var(--ink-rgb),0.07); color:rgba(var(--ink-rgb),0.4); font-size:11px; font-weight:700; padding:3px 10px; border-radius:var(--r-lg); }
.lbc { background:rgba(var(--ink-rgb),0.02); border:1px solid rgba(var(--ink-rgb),0.08); border-radius:var(--r-lg); overflow:hidden; }
.lbr { display:flex; align-items:center; gap:10px; padding:13px 16px; border-bottom:1px solid rgba(var(--ink-rgb),0.05); }
.lbr:last-child { border-bottom:none; }
.lbr.me { background:rgba(var(--accent-rgb),0.05); border-left:2px solid var(--accent); }
.lbrank { font-size:20px; width:28px; text-align:center; flex-shrink:0; }
.lbrn { font-family:'Bebas Neue',sans-serif; font-size:17px; color:rgba(var(--ink-rgb),0.3); }
.lbn { font-size:15px; font-weight:600; color:var(--ink); display:flex; align-items:center; flex-wrap:wrap; gap:4px; }
.lbme { font-size:10px; color:var(--accent-light); background:rgba(var(--accent-rgb),0.12); padding:1px 6px; border-radius:6px; font-weight:700; }
.lbs { font-size:11px; color:rgba(var(--ink-rgb),0.4); margin-top:2px; }
.lbp { font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:0.5px; }
.lbp.top { color:var(--accent-light); filter:drop-shadow(0 0 8px rgba(var(--accent-light-rgb),0.3)); }
.lbp.nm { color:var(--ink); }
.lbpl { font-size:10px; color:rgba(var(--ink-rgb),0.3); font-weight:600; text-align:right; }
.rc { background:rgba(var(--ink-rgb),0.03); border:1px solid rgba(var(--ink-rgb),0.08); border-radius:var(--r-lg); overflow:hidden; margin-bottom:10px; }
.rrow { display:flex; gap:14px; align-items:flex-start; padding:14px 16px; border-bottom:1px solid rgba(var(--ink-rgb),0.05); }
.rrow:last-child { border-bottom:none; }
.ric { width:42px; height:42px; border-radius:var(--r-md); display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
.rtit { font-size:15px; font-weight:700; color:var(--ink); margin-bottom:5px; }
.rtxt { font-size:13px; color:rgba(var(--ink-rgb),0.65); line-height:1.65; }
.prow { display:flex; align-items:center; gap:14px; padding:14px 16px; border-bottom:1px solid rgba(var(--ink-rgb),0.05); }
.prow:last-child { border-bottom:none; }
.pic2 { width:48px; height:48px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:26px; flex-shrink:0; }
.pnm { font-size:14px; font-weight:600; color:var(--ink); }
.pamt { font-family:'Bebas Neue',sans-serif; font-size:26px; letter-spacing:1px; flex-shrink:0; }
.ar { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid rgba(var(--ink-rgb),0.05); gap:8px; }
.ar:last-child { border-bottom:none; }
.an { font-size:13px; font-weight:700; color:var(--ink); }
.at { font-size:11px; color:rgba(var(--ink-rgb),0.45); margin-top:2px; }
.aedt { background:rgba(var(--ink-rgb),0.07); border:1px solid rgba(var(--ink-rgb),0.1); color:rgba(var(--ink-rgb),0.75); padding:6px 12px; border-radius:10px; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; }
.ares-btn { background:rgba(var(--accent-rgb),0.1); border:1px solid rgba(var(--accent-rgb),0.25); color:var(--accent-light); padding:6px 12px; border-radius:10px; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; }
.mo { position:fixed; inset:0; background:rgba(0,0,0,0.8); display:flex; align-items:flex-end; justify-content:center; z-index:100; backdrop-filter:blur(20px); }
.mbox { background:var(--bg-raised); border:1px solid rgba(var(--ink-rgb),0.1); border-radius:24px 24px 0 0; padding:28px 22px; width:100%; max-width:480px; max-height:92vh; overflow-y:auto; }
.mh { width:36px; height:4px; background:rgba(var(--ink-rgb),0.15); border-radius:2px; margin:0 auto 20px; }
.mtt { font-size:18px; font-weight:700; color:var(--ink); margin-bottom:4px; }
.mst { font-size:13px; color:rgba(var(--ink-rgb),0.4); margin-bottom:20px; }
.rbtn { flex:1; padding:15px 8px; background:rgba(var(--ink-rgb),0.04); border:1.5px solid rgba(var(--ink-rgb),0.1); border-radius:14px; color:rgba(var(--ink-rgb),0.65); cursor:pointer; font-family:inherit; font-size:20px; font-weight:700; transition:all 0.18s; }
.rbtn:hover { background:rgba(var(--accent-rgb),0.12); border-color:var(--accent); color:var(--accent-light); }
.mi { width:100%; padding:12px 14px; background:rgba(var(--ink-rgb),0.05); border:1px solid rgba(var(--ink-rgb),0.1); border-radius:var(--r-md); color:var(--ink); font-family:inherit; font-size:14px; outline:none; margin-bottom:8px; }
.mi:focus { border-color:rgba(var(--accent-rgb),0.4); }
.mi::placeholder { color:rgba(var(--ink-rgb),0.25); }
.mprim { width:100%; padding:14px; background:linear-gradient(135deg,var(--accent-deep),var(--accent)); border:none; border-radius:14px; color:var(--ink); font-family:inherit; font-size:15px; font-weight:700; cursor:pointer; }
.msec { width:100%; padding:12px; background:rgba(var(--ink-rgb),0.04); border:1px solid rgba(var(--ink-rgb),0.1); border-radius:14px; color:rgba(var(--ink-rgb),0.5); font-family:inherit; font-size:14px; font-weight:500; cursor:pointer; }
.msel { width:100%; padding:12px 14px; background:rgba(var(--ink-rgb),0.05); border:1px solid rgba(var(--ink-rgb),0.1); border-radius:var(--r-md); color:var(--ink); font-family:inherit; font-size:14px; outline:none; margin-bottom:8px; }
.toast { position:fixed; bottom:110px; left:50%; transform:translateX(-50%); background:rgba(var(--surface-rgb),0.96); border:1px solid rgba(var(--accent-rgb),0.25); color:var(--ink); padding:10px 20px; border-radius:var(--r-pill); font-size:14px; font-weight:600; z-index:200; white-space:nowrap; animation:toastIn 0.25s ease; backdrop-filter:blur(20px); }
@keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
.chat-wrap { display:flex; flex-direction:column; }
.chat-msgs { flex:1; min-height:0; overflow-y:auto; padding:0 0 8px; display:flex; flex-direction:column; }
.chat-msgs > :first-child { margin-top:auto; }
.cdt { text-align:center; margin:14px 0 10px; }
.cdt span { font-size:11px; color:rgba(var(--ink-rgb),0.35); background:rgba(var(--ink-rgb),0.05); padding:3px 12px; border-radius:var(--r-lg); }
.cbw { display:flex; flex-direction:column; margin-bottom:2px; }
.crow { display:flex; align-items:flex-end; gap:6px; }
.crow.me { flex-direction:row-reverse; }
.cb { padding:9px 13px; border-radius:var(--r-lg); max-width:76%; word-break:break-word; font-size:15px; line-height:1.4; }
.cb.mine { background:linear-gradient(135deg,var(--accent-deep),var(--accent)); color:var(--ink); font-weight:500; border-bottom-right-radius:4px; }
.cb.theirs { background:rgba(var(--ink-rgb),0.08); color:var(--ink); border-bottom-left-radius:4px; }
.csnd { font-size:10px; color:rgba(var(--ink-rgb),0.35); margin-left:38px; margin-top:2px; }
.ctm { font-size:10px; color:rgba(var(--ink-rgb),0.25); margin-top:2px; text-align:right; }
.chat-bar { flex-shrink:0; background:var(--bg); padding:8px 0 12px; display:flex; gap:8px; align-items:center; border-top:1px solid rgba(var(--ink-rgb),0.07); }
.cin { flex:1; padding:11px 16px; background:rgba(var(--ink-rgb),0.05); border:1px solid rgba(var(--ink-rgb),0.09); border-radius:var(--r-lg); color:var(--ink); font-family:inherit; font-size:15px; outline:none; }
.cin:focus { border-color:rgba(var(--accent-rgb),0.3); }
.cin::placeholder { color:rgba(var(--ink-rgb),0.25); }
.csend { width:38px; height:38px; background:linear-gradient(135deg,var(--accent-deep),var(--accent)); border:none; border-radius:50%; color:var(--ink); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:700; flex-shrink:0; }
.csend:disabled { background:rgba(var(--ink-rgb),0.07); color:rgba(var(--ink-rgb),0.2); }
.empty { text-align:center; padding:50px 0; color:rgba(var(--ink-rgb),0.3); }
.ei { font-size:40px; margin-bottom:10px; }
.et { font-size:16px; font-weight:600; color:rgba(var(--ink-rgb),0.45); }
.es { font-size:13px; margin-top:4px; }

.league-tab .lbadge { position:absolute; top:-6px; right:-6px; min-width:20px; height:20px; padding:0 5px; border-radius:10px; background:var(--loss); color:var(--ink); font-size:11px; font-weight:800; display:flex; align-items:center; justify-content:center; border:2px solid var(--bg); }
.mc.missing { border-color:rgba(var(--loss-rgb),0.65); }
.picks-hidden { margin-top:12px; padding:10px 12px; border-radius:var(--r-md); background:rgba(var(--ink-rgb),0.03); border:1px dashed rgba(var(--ink-rgb),0.12); font-size:12px; color:rgba(var(--ink-rgb),0.45); text-align:center; }
.picks { margin-top:12px; display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
.pcol { background:rgba(var(--ink-rgb),0.03); border:1px solid rgba(var(--ink-rgb),0.07); border-radius:var(--r-md); padding:8px 6px; min-width:0; }
.pcol.win { border-color:rgba(var(--win-rgb),0.5); background:rgba(var(--win-rgb),0.07); }
.pcol.lose { opacity:0.55; }
.pcol h4 { font-size:10px; font-weight:800; text-align:center; margin:0 0 6px; letter-spacing:0.5px; }
.pwho { display:flex; align-items:center; gap:5px; padding:3px 2px; min-width:0; }
.pwho span { font-size:11px; color:rgba(var(--ink-rgb),0.8); font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.pwho.me span { color:var(--accent-light); font-weight:800; }
.pnone { font-size:10px; color:rgba(var(--ink-rgb),0.25); text-align:center; padding:4px 0; }
.pmissing { margin-top:8px; font-size:11px; color:rgba(var(--warn-rgb),0.85); font-weight:600; }

.rs { border-radius:var(--r-lg); overflow:hidden; border:1px solid rgba(var(--gold-rgb),0.3); background:linear-gradient(160deg, rgba(var(--gold-rgb),0.10), rgba(var(--ink-rgb),0.02) 55%); margin-bottom:14px; }
.rs-top { padding:12px 14px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(var(--ink-rgb),0.06); }
.rs-title { font-size:16px; font-weight:700; color:var(--ink); }
.rs-sub { font-size:11px; color:rgba(var(--ink-rgb),0.45); font-weight:600; }
.rs-x { width:36px; height:36px; border-radius:50%; background:rgba(var(--ink-rgb),0.06); border:none; color:rgba(var(--ink-rgb),0.5); font-size:13px; cursor:pointer; flex-shrink:0; }
.rs-sec { font-size:10px; font-weight:700; color:rgba(var(--ink-rgb),0.45); text-transform:uppercase; letter-spacing:0.8px; padding:10px 14px 2px; }
.rs-row { display:flex; align-items:center; gap:10px; padding:8px 14px; }
.rs-pos { width:22px; text-align:center; font-family:'Bebas Neue',sans-serif; font-size:18px; color:rgba(var(--ink-rgb),0.5); flex-shrink:0; }
.rs-name { font-size:14px; font-weight:700; color:var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.rs-det { font-size:11px; color:rgba(var(--ink-rgb),0.45); margin-top:1px; }
.rs-val { margin-left:auto; font-family:'Bebas Neue',sans-serif; font-size:22px; text-align:right; flex-shrink:0; }
.rs-hl { display:flex; align-items:center; gap:10px; padding:11px 14px; border-top:1px solid rgba(var(--ink-rgb),0.06); }
.rs-ic { width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:17px; flex-shrink:0; }

.st-chips { display:flex; gap:6px; margin-bottom:12px; overflow-x:auto; padding-bottom:2px; }
.st-chip { padding:7px 12px; border-radius:var(--r-lg); font-size:12px; font-weight:700; border:1px solid rgba(var(--ink-rgb),0.1); background:transparent; color:rgba(var(--ink-rgb),0.55); white-space:nowrap; cursor:pointer; font-family:inherit; }
.st-chip.on { background:rgba(var(--accent-rgb),0.15); border-color:var(--accent); color:var(--accent-light); }
.st-card { background:rgba(var(--ink-rgb),0.04); border:1px solid rgba(var(--ink-rgb),0.08); border-radius:var(--r-lg); padding:14px; margin-bottom:10px; }
.st-big { display:flex; align-items:flex-end; gap:12px; margin:12px 0 4px; }
.st-pct { font-family:'Bebas Neue',sans-serif; font-size:56px; line-height:0.85; color:var(--accent-light); }
.st-pctl { font-size:12px; color:rgba(var(--ink-rgb),0.55); line-height:1.4; padding-bottom:4px; }
.st-note { font-size:11px; color:rgba(var(--ink-rgb),0.45); margin-top:6px; }
.st-bar { height:8px; border-radius:var(--r-sm); background:rgba(var(--ink-rgb),0.07); overflow:hidden; }
.st-bar > div { height:100%; border-radius:var(--r-sm); }
.st-split-row { display:flex; justify-content:space-between; font-size:12px; color:rgba(var(--ink-rgb),0.75); margin-bottom:5px; font-weight:600; }
.st-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px; }
.st-tile { background:rgba(var(--ink-rgb),0.03); border:1px solid rgba(var(--ink-rgb),0.07); border-radius:14px; padding:10px 12px; min-width:0; }
.st-tile .t { font-size:10px; font-weight:700; color:rgba(var(--ink-rgb),0.45); text-transform:uppercase; letter-spacing:0.6px; }
.st-tile .v { font-family:'Bebas Neue',sans-serif; font-size:26px; color:var(--ink); line-height:1.1; margin-top:2px; }
.st-tile .d { font-size:11px; color:rgba(var(--ink-rgb),0.45); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.st-rec { display:flex; align-items:center; gap:10px; padding:10px 0; border-top:1px solid rgba(var(--ink-rgb),0.05); }
.st-rec:first-child { border-top:none; padding-top:0; }
.st-rec:last-child { padding-bottom:0; }
.st-rec .n { font-size:13px; font-weight:700; color:var(--ink); }
.st-rec .w { font-size:11px; color:rgba(var(--ink-rgb),0.45); }
.st-rec .val { margin-left:auto; font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--gold); flex-shrink:0; }
.lbr.click { cursor:pointer; }
.cmp-head { display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom:10px; }
.cmp-p { display:flex; flex-direction:column; align-items:center; gap:5px; font-size:13px; font-weight:700; color:var(--ink); min-width:0; }
.cmp-p span { max-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.cmp { display:grid; grid-template-columns:60px 1fr 60px; align-items:center; gap:8px; padding:9px 0; border-top:1px solid rgba(var(--ink-rgb),0.05); }
.cmp .v { font-family:'Bebas Neue',sans-serif; font-size:21px; text-align:center; color:rgba(var(--ink-rgb),0.75); }
.cmp .v.win { color:var(--win); }
.cmp .v.lose { color:rgba(var(--ink-rgb),0.4); }
.cmp .m { text-align:center; font-size:11px; color:rgba(var(--ink-rgb),0.5); font-weight:600; }

.lbrank.col { display:flex; flex-direction:column; align-items:center; gap:2px; }
.rdelta { font-size:10px; font-weight:800; line-height:1; }


.app { padding-bottom:110px; }
.toast { bottom:96px; }
.fnav { position:fixed; bottom:12px; left:50%; transform:translateX(-50%); width:calc(min(100%, 480px) - 24px); background:rgba(var(--surface-rgb),0.94); backdrop-filter:blur(14px); border:1px solid rgba(var(--ink-rgb),0.08); border-radius:var(--r-lg); display:flex; justify-content:space-around; padding:7px 6px; z-index:50; box-shadow:0 10px 30px rgba(0,0,0,0.4); }
.fni { display:flex; align-items:center; gap:6px; padding:9px 12px; border-radius:16px; color:rgba(var(--ink-rgb),0.5); background:none; border:none; font-family:inherit; font-weight:600; font-size:14px; cursor:pointer; }
.fni svg { width:22px; height:22px; }
.fni .l { display:none; }
.fni.on { background:#E9EFE6; color:var(--bg); }
.fni.on .l { display:inline; }
.fni:focus-visible { outline:2px solid var(--accent-light); outline-offset:2px; }

.more-menu { display:flex; flex-direction:column; background:rgba(var(--ink-rgb),0.03); border:1px solid rgba(var(--ink-rgb),0.08); border-radius:var(--r-lg); overflow:hidden; }
.more-menu button { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:16px; border:none; border-top:1px solid rgba(var(--ink-rgb),0.06); background:none; color:var(--ink); font-family:inherit; font-size:16px; font-weight:600; cursor:pointer; text-align:left; }
.more-menu button:first-child { border-top:none; }
.more-menu button span { color:rgba(var(--ink-rgb),0.4); font-size:13px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.more-menu button.danger { color:var(--loss); }
.more-back { background:none; border:none; color:var(--accent-light); font-family:inherit; font-size:14px; font-weight:600; padding:2px 2px 12px; cursor:pointer; }

.brand { display:flex; align-items:center; gap:9px; flex-shrink:0; }
.pitch-mark { color:var(--ink); flex-shrink:0; display:block; }
.brand .logo { font-size:24px; letter-spacing:1.5px; line-height:1; }
.mepill { display:flex; align-items:center; gap:8px; background:rgba(0,0,0,0.45); border:1px solid rgba(var(--ink-rgb),0.1); border-radius:var(--r-lg); padding:4px 12px 4px 4px; backdrop-filter:blur(8px); min-width:0; cursor:pointer; font-family:inherit; color:var(--ink); }
.mepill:hover { border-color:rgba(var(--accent-rgb),0.45); }
.mepill .n { font-size:14px; font-weight:600; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.mepill .o { display:flex; align-items:center; gap:5px; font-size:12px; font-weight:600; color:var(--win-light); white-space:nowrap; flex-shrink:0; }
.mepill .o i { width:6px; height:6px; border-radius:50%; background:var(--win); display:block; }
@media (max-width: 420px) { .mepill .o .w { display:none; } }

button:focus-visible, [role="button"]:focus-visible { outline:2px solid var(--accent-light); outline-offset:2px; }
.picker-tile { font-family:inherit; color:inherit; width:100%; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation:none !important; transition:none !important; } }

/* TABELA — jak tablica wyników */
.tb-list { border-bottom:1px solid rgba(var(--ink-rgb),0.08); }
.tb-row { display:grid; grid-template-columns:38px 32px 1fr auto; align-items:center; gap:10px; padding:12px 2px; border-top:1px solid rgba(var(--ink-rgb),0.08); cursor:pointer; }
.tb-row.me { background:linear-gradient(90deg, rgba(var(--accent-rgb),0.16), transparent 75%); margin:0 -14px; padding-left:16px; padding-right:16px; border-left:2px solid var(--accent); }
.tb-pos { font-family:'Bebas Neue',sans-serif; font-size:30px; line-height:0.9; text-align:center; color:rgba(var(--ink-rgb),0.45); }
.tb-pos small { display:block; font-family:'Inter',sans-serif; font-weight:700; font-size:11px; margin-top:3px; }
.tb-pos.g1 { color:var(--medal-1); } .tb-pos.g2 { color:var(--medal-2); } .tb-pos.g3 { color:var(--medal-3); }
.tb-up { color:var(--win); } .tb-down { color:var(--loss); } .tb-same { color:rgba(var(--ink-rgb),0.3); }
.tb-nm { font-size:16px; font-weight:600; color:var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.tb-nm .ty { font-size:12px; color:var(--accent-light); font-weight:700; margin-left:5px; }
.tb-nm .st { color:var(--gold); font-size:13px; font-weight:700; margin-left:6px; }
.tb-sub { font-size:13px; color:rgba(var(--ink-rgb),0.45); margin-top:2px; }
.tb-sub .plus { color:var(--win); } .tb-sub .minus { color:var(--loss); }
.tb-pts { font-family:'Bebas Neue',sans-serif; font-size:26px; letter-spacing:0.5px; text-align:right; color:var(--ink); font-variant-numeric:tabular-nums; }
.tb-row.lead .tb-pts { color:var(--accent-light); }

/* TŁO: murawa nocą ze światłem reflektorów u góry */
.app { background-color:var(--bg); background-image:radial-gradient(ellipse 120% 35% at 50% 0%, rgba(233,239,230,0.07), transparent 60%); }

/* Zwarty nagłówek na Statystykach, Czacie i w „Więcej” — sama belka z logo */
.hdr { min-height:0; }
.app.no-leagues.no-stats .hdr { padding-bottom:14px; }
.app.no-leagues.no-stats .hdr-top { margin-bottom:0; }

/* CZAT: wypełnia dokładnie miejsce między belką a dolnym menu */
.app.chat-mode { height:100vh; height:100dvh; min-height:0; display:flex; flex-direction:column; padding-bottom:82px; overflow:hidden; }
.app.chat-mode .hdr { flex-shrink:0; }
.app.chat-mode .ct { flex:1; min-height:0; display:flex; flex-direction:column; padding-bottom:0; }
.app.chat-mode .chat-wrap { flex:1; min-height:0; }

/* CZCIONKI: przyciski i pola formularzy dziedziczą Inter (przeglądarki domyślnie dają im własną czcionkę) */
button, input, select, textarea { font-family:inherit; }

/* ── STREFA KUPONÓW ── */
.cz-card { background:rgba(var(--ink-rgb),0.04); border:1px solid rgba(var(--ink-rgb),0.08); border-radius:var(--r-lg); overflow:hidden; margin-bottom:12px; }
.cz-testbar { display:flex; gap:10px; align-items:flex-start; padding:12px 14px; border-radius:16px; margin-bottom:12px; background:rgba(var(--gold-rgb),0.10); border:1px solid rgba(var(--gold-rgb),0.35); font-size:13px; line-height:1.5; color:rgba(var(--ink-rgb),0.85); }
.cz-testbar .i { font-size:18px; line-height:1.2; }
.cz-testbar b { color:var(--gold); }
.cz-test { font-size:11px; font-weight:800; color:var(--gold); border:1px solid rgba(var(--gold-rgb),0.45); background:rgba(var(--gold-rgb),0.1); padding:2px 8px; border-radius:var(--r-pill); margin-left:8px; vertical-align:middle; }
.cz-hero { padding:16px; background:linear-gradient(160deg, rgba(var(--accent-rgb),0.16), rgba(var(--ink-rgb),0.02) 60%); }
.cz-title { font-size:17px; font-weight:800; color:var(--ink); }
.cz-sub { font-size:13px; color:rgba(var(--ink-rgb),0.6); margin-top:3px; }
.cz-countdown { display:flex; gap:8px; margin-top:12px; }
.cz-cd { flex:1; background:rgba(0,0,0,0.3); border:1px solid rgba(var(--ink-rgb),0.08); border-radius:var(--r-md); padding:8px 10px; }
.cz-cd .v { font-family:'Bebas Neue',sans-serif; font-size:26px; line-height:1; color:var(--ink); }
.cz-cd .l { font-size:10px; color:rgba(var(--ink-rgb),0.45); font-weight:700; text-transform:uppercase; letter-spacing:0.6px; margin-top:2px; }
.cz-meter { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:12px 16px; border-top:1px solid rgba(var(--ink-rgb),0.08); font-size:13px; color:rgba(var(--ink-rgb),0.6); }
.cz-meter b { color:var(--ink); }
.cz-bar { flex:1; max-width:140px; height:6px; border-radius:6px; background:rgba(var(--ink-rgb),0.1); overflow:hidden; }
.cz-bar > div { height:100%; background:var(--accent-light); border-radius:6px; transition:width 0.3s; }
.cz-people { display:flex; align-items:center; gap:8px; padding:0 16px 14px; font-size:12px; color:rgba(var(--ink-rgb),0.45); }
.cz-stack { display:flex; }
.cz-stack > * { margin-left:-7px; box-shadow:0 0 0 2px var(--bg); }
.cz-stack > *:first-child { margin-left:0; }
.cz-how { padding:4px 16px; }
.cz-how-head { width:100%; display:flex; justify-content:space-between; align-items:center; background:none; border:none; color:var(--ink); font-size:15px; font-weight:700; padding:12px 0; cursor:pointer; text-align:left; }
.cz-how-head span { color:rgba(var(--ink-rgb),0.45); font-size:13px; font-weight:500; }
.cz-how ol { list-style:none; counter-reset:k; margin:2px 0 8px; }
.cz-how li { counter-increment:k; display:grid; grid-template-columns:24px 1fr; gap:8px; font-size:13px; line-height:1.5; color:rgba(var(--ink-rgb),0.75); margin-bottom:10px; }
.cz-how li::before { content:counter(k); width:22px; height:22px; border-radius:50%; background:rgba(var(--accent-rgb),0.18); color:var(--accent-light); font-size:12px; font-weight:800; display:flex; align-items:center; justify-content:center; }
.cz-how li b { color:var(--ink); }
.cz-day { font-size:13px; font-weight:700; color:rgba(var(--ink-rgb),0.6); margin:14px 2px 6px; }
.cz-row { background:rgba(var(--ink-rgb),0.04); border:1px solid rgba(var(--ink-rgb),0.08); border-radius:16px; padding:12px; margin-bottom:8px; }
.cz-row.picked { border-color:rgba(var(--accent-light-rgb),0.6); background:rgba(var(--accent-rgb),0.07); }
.cz-rtop { display:flex; justify-content:space-between; font-size:11px; color:rgba(var(--ink-rgb),0.45); font-weight:600; margin-bottom:8px; }
.cz-rtop .mine { color:var(--accent-light); }
.cz-teams { font-size:14px; font-weight:600; color:var(--ink); margin-bottom:10px; }
.cz-teams small { color:rgba(var(--ink-rgb),0.45); font-weight:500; margin:0 6px; font-size:14px; }
.cz-picks { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
.cz-pk { border:1.5px solid rgba(var(--ink-rgb),0.08); background:rgba(var(--ink-rgb),0.04); color:var(--ink); border-radius:10px; padding:6px 8px; display:flex; justify-content:space-between; align-items:baseline; cursor:pointer; }
.cz-pk .t { font-size:11px; color:rgba(var(--ink-rgb),0.45); font-weight:700; }
.cz-pk .v { font-family:'Bebas Neue',sans-serif; font-size:19px; }
.cz-pk.sel { background:rgba(var(--accent-rgb),0.18); border-color:var(--accent); }
.cz-pk.sel .t, .cz-pk.sel .v { color:var(--accent-light); }
.cz-hint { text-align:center; font-size:12px; color:rgba(var(--ink-rgb),0.45); margin:6px 0 2px; }
.cz-slip-head { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; padding:14px 16px; border-bottom:1px solid rgba(var(--ink-rgb),0.08); }
.cz-status { font-size:12px; font-weight:700; padding:4px 10px; border-radius:var(--r-pill); white-space:nowrap; flex-shrink:0; }
.cz-status.live { color:var(--win); background:rgba(var(--win-rgb),0.12); border:1px solid rgba(var(--win-rgb),0.3); }
.cz-status.won { color:var(--win); background:rgba(var(--win-rgb),0.18); border:1px solid rgba(var(--win-rgb),0.5); }
.cz-status.dead { color:var(--loss); background:rgba(var(--loss-rgb),0.1); border:1px solid rgba(var(--loss-rgb),0.3); }
.cz-status.empty { color:rgba(var(--ink-rgb),0.5); border:1px solid rgba(var(--ink-rgb),0.15); }
.cz-ev { display:grid; grid-template-columns:22px 1fr auto; gap:10px; align-items:center; padding:11px 16px; border-bottom:1px solid rgba(var(--ink-rgb),0.05); }
.cz-ev .st { font-size:15px; text-align:center; }
.cz-ev .m { font-size:14px; font-weight:600; color:var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.cz-ev .d { font-size:12px; color:rgba(var(--ink-rgb),0.45); margin-top:1px; }
.cz-ev .o { font-family:'Bebas Neue',sans-serif; font-size:22px; text-align:right; color:var(--ink); }
.cz-ev.killer { background:rgba(var(--loss-rgb),0.07); }
.cz-totals { display:grid; grid-template-columns:1fr 1fr; gap:8px; padding:14px 16px 6px; }
.cz-tot { background:rgba(0,0,0,0.25); border:1px solid rgba(var(--ink-rgb),0.08); border-radius:14px; padding:10px 12px; }
.cz-tot .l { font-size:10px; font-weight:700; color:rgba(var(--ink-rgb),0.45); text-transform:uppercase; letter-spacing:0.6px; }
.cz-tot .v { font-family:'Bebas Neue',sans-serif; font-size:28px; line-height:1.1; color:var(--ink); }
.cz-tot .v.win { color:var(--win); } .cz-tot .v.lost { color:rgba(var(--ink-rgb),0.35); text-decoration:line-through; }
.cz-kill { margin:8px 16px 4px; padding:12px; border-radius:14px; background:rgba(var(--loss-rgb),0.08); border:1px solid rgba(var(--loss-rgb),0.25); font-size:13px; line-height:1.5; color:rgba(var(--ink-rgb),0.85); }
.cz-kill b { color:var(--loss); }
.cz-rule { font-size:12px; color:rgba(var(--ink-rgb),0.45); padding:10px 16px 14px; line-height:1.5; }
.cz-hist { display:flex; justify-content:space-between; align-items:center; gap:10px; padding:12px 16px; border-top:1px solid rgba(var(--ink-rgb),0.05); font-size:14px; color:var(--ink); }
.cz-hist:first-child { border-top:none; }
.cz-hist .d { font-size:12px; color:rgba(var(--ink-rgb),0.45); margin-top:2px; }
.cz-hist-icon { font-family:'Bebas Neue',sans-serif; font-size:22px; color:rgba(var(--ink-rgb),0.35); }
.cz-hist-icon.won { color:var(--win); } .cz-hist-icon.lost { color:var(--loss); }
.more-menu .badge { color:var(--ink); background:var(--accent); font-size:11px; font-weight:700; padding:2px 8px; border-radius:var(--r-pill); margin-left:8px; }

/* ZMIANA NICKU */
.nick-card { background:rgba(var(--ink-rgb),0.04); border:1px solid rgba(var(--ink-rgb),0.08); border-radius:var(--r-lg); padding:16px; }
.nick-card .mi { font-size:16px; margin-bottom:6px; }
.nick-card .mi:disabled { opacity:0.5; }
.nick-hint { font-size:12px; color:rgba(var(--ink-rgb),0.45); margin:0 2px 14px; line-height:1.5; }
.nick-hint.err { color:var(--loss); }
.nick-note { font-size:12px; color:rgba(var(--ink-rgb),0.45); margin-top:12px; line-height:1.5; }
.mprim:disabled { opacity:0.4; cursor:not-allowed; }

/* AUTOMATYCZNE KURSY */
.odd { position:relative; }
.otr { position:absolute; top:5px; right:7px; font-size:9px; line-height:1; font-weight:800; }
.otr.up { color:var(--win); } .otr.down { color:var(--loss); }
.sync-card { background:rgba(var(--ink-rgb),0.04); border:1px solid rgba(var(--ink-rgb),0.08); border-radius:var(--r-lg); padding:14px 16px; margin-bottom:16px; }
.sync-top { display:flex; justify-content:space-between; align-items:center; gap:10px; }
.sync-title { font-size:14px; font-weight:700; color:var(--ink); }
.sync-meta { font-size:12px; color:rgba(var(--ink-rgb),0.5); margin-top:3px; line-height:1.5; }
.sync-meta .err { color:var(--loss); }
.sync-btn { flex-shrink:0; padding:8px 12px; border-radius:var(--r-md); border:1px solid rgba(var(--accent-rgb),0.35); background:rgba(var(--accent-rgb),0.12); color:var(--accent-light); font-size:12px; font-weight:700; cursor:pointer; }
.sync-btn:disabled { opacity:0.5; cursor:wait; }
.sync-miss { margin-top:10px; padding-top:10px; border-top:1px solid rgba(var(--ink-rgb),0.06); font-size:12px; color:rgba(var(--ink-rgb),0.6); line-height:1.6; }
.sync-miss b { color:var(--warn); font-weight:700; }
.auto-toggle { display:flex; gap:10px; align-items:flex-start; padding:12px; margin:4px 0 12px; border-radius:var(--r-md); background:rgba(var(--ink-rgb),0.04); border:1px solid rgba(var(--ink-rgb),0.08); font-size:13px; color:rgba(var(--ink-rgb),0.8); line-height:1.45; cursor:pointer; }
.auto-toggle input { margin-top:2px; width:18px; height:18px; accent-color:var(--accent); flex-shrink:0; }
.auto-toggle small { display:block; color:rgba(var(--ink-rgb),0.45); font-size:12px; margin-top:2px; }

.sync-import { width:100%; margin-top:12px; padding:10px 12px; border-radius:var(--r-md); border:1px dashed rgba(var(--ink-rgb),0.18); background:rgba(var(--ink-rgb),0.03); color:var(--ink); font-size:13px; font-weight:700; cursor:pointer; text-align:left; font-family:inherit; }
.sync-import span { display:block; font-size:11px; font-weight:500; color:rgba(var(--ink-rgb),0.45); margin-top:2px; }
.sync-import:disabled { opacity:0.5; cursor:wait; }

.sync-sep { margin-top:14px; padding-top:14px; border-top:1px solid rgba(var(--ink-rgb),0.08); }
`;
