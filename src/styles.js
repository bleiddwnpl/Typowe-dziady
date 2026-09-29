import { STADIUM_URL } from "./lib";

// Globalne style aplikacji
export const css = `
@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@500;600;700;800&display=swap');
* { box-sizing:border-box; margin:0; padding:0; -webkit-font-smoothing:antialiased; }
body { background:#060a0f; font-family:'Barlow',sans-serif; }
::-webkit-scrollbar { width:0; }
.auth-screen { min-height:100vh; position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:flex-end; }
.photo-bg { position:fixed; inset:0; background-image:url('${STADIUM_URL}'); background-size:cover; background-position:center 30%; }
.ov1 { position:fixed; inset:0; background:linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.6) 50%,rgba(4,8,15,0.97) 78%,#04080f 100%); }
.ov2 { position:fixed; bottom:0; left:0; right:0; height:60%; background:radial-gradient(ellipse at 50% 100%,rgba(0,100,255,0.07) 0%,transparent 70%); }
.auth-hero { position:relative; z-index:5; padding:0 28px; margin-bottom:24px; }
.eyebrow { display:flex; align-items:center; gap:8px; margin-bottom:12px; }
.ey-line { width:28px; height:2px; background:#007aff; border-radius:1px; }
.ey-txt { font-size:10px; font-weight:700; color:#60a5fa; letter-spacing:3px; text-transform:uppercase; }
.hero-title { font-family:'Barlow Condensed',sans-serif; font-size:62px; line-height:0.88; color:#fff; letter-spacing:2px; margin-bottom:12px; text-shadow:0 4px 40px rgba(0,0,0,0.8); }
.hero-blue { color:#60a5fa; filter:drop-shadow(0 0 20px rgba(96,165,250,0.4)); }
.hero-sub { font-size:15px; font-weight:700; color:rgba(255,255,255,0.88); line-height:1.6; text-shadow:0 2px 12px rgba(0,0,0,0.9); }
.auth-card { position:relative; z-index:5; margin:0 16px 48px; background:rgba(4,12,24,0.82); border:1px solid rgba(255,255,255,0.1); border-radius:24px; padding:22px; backdrop-filter:blur(30px); box-shadow:0 24px 60px rgba(0,0,0,0.5); }
.card-shine { position:absolute; top:0; left:50%; transform:translateX(-50%); width:60%; height:1px; background:linear-gradient(90deg,transparent,rgba(96,165,250,0.4),transparent); }
.seg { display:flex; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:3px; margin-bottom:16px; }
.seg-btn { flex:1; padding:10px; text-align:center; font-size:14px; font-weight:600; color:rgba(255,255,255,0.35); border-radius:12px; border:none; background:transparent; font-family:'Barlow',sans-serif; cursor:pointer; transition:all 0.22s; }
.seg-btn.on { background:linear-gradient(135deg,#0051cc,#007aff); color:#fff; }
.afield { position:relative; margin-bottom:10px; }
.aicon { position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:16px; opacity:0.4; pointer-events:none; }
.ainput { width:100%; padding:13px 16px 13px 42px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.09); border-radius:13px; color:#fff; font-family:'Barlow',sans-serif; font-size:15px; outline:none; }
.ainput:focus { background:rgba(255,255,255,0.09); border-color:rgba(0,122,255,0.5); }
.ainput::placeholder { color:rgba(255,255,255,0.22); }
.aerr { color:#ff453a; font-size:12px; text-align:center; margin-bottom:8px; font-weight:500; }
.acta { width:100%; padding:15px; background:linear-gradient(135deg,#0051cc,#007aff); border:none; border-radius:14px; color:#fff; font-family:'Barlow',sans-serif; font-size:16px; font-weight:700; cursor:pointer; margin-top:4px; box-shadow:0 8px 28px rgba(0,122,255,0.35); }
.acta:disabled { opacity:0.45; cursor:not-allowed; }
.forgot-btn { width:100%; padding:10px; background:transparent; border:none; color:rgba(255,255,255,0.35); font-size:13px; cursor:pointer; margin-top:4px; font-family:'Barlow',sans-serif; }
.back-btn { width:100%; padding:12px; background:transparent; border:none; color:rgba(255,255,255,0.35); font-size:13px; cursor:pointer; margin-top:8px; font-family:'Barlow',sans-serif; }
.reset-ok { background:rgba(0,122,255,0.08); border:1px solid rgba(0,122,255,0.2); border-radius:12px; padding:14px 16px; text-align:center; color:#60a5fa; font-size:14px; font-weight:600; line-height:1.5; }
.app { min-height:100vh; background:#060a0f; max-width:480px; margin:0 auto; padding-bottom:100px; font-family:'Barlow',sans-serif; }
.hdr { position:relative; overflow:hidden; padding:0 0 20px; min-height:200px; }
.hdr-photo { position:absolute; inset:0; background-image:url('${STADIUM_URL}'); background-size:cover; background-position:center 35%; filter:brightness(0.22) saturate(0.7); }
.hdr-ov { position:absolute; inset:0; background:linear-gradient(180deg,rgba(6,10,15,0.15) 0%,rgba(6,10,15,0.45) 55%,#060a0f 100%); }
.hdr-ct { position:relative; z-index:2; padding:20px 18px 0; }
.hdr-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; gap:8px; }
.logo { font-family:'Barlow Condensed',sans-serif; font-size:26px; color:#fff; letter-spacing:2px; flex-shrink:0; }
.logo span { color:#60a5fa; }
.hdr-r { display:flex; align-items:center; gap:6px; min-width:0; }
.upill { display:flex; align-items:center; gap:7px; background:rgba(0,0,0,0.45); border:1px solid rgba(0,122,255,0.2); border-radius:16px; padding:5px 10px; cursor:pointer; backdrop-filter:blur(10px); min-width:0; }
.upill:hover { border-color:rgba(0,122,255,0.5); }
.uname { font-size:11px; color:#fff; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:90px; }
.uonline { font-size:9px; color:#4ade80; font-weight:600; display:flex; align-items:center; gap:3px; }
.uonline-dot { width:4px; height:4px; border-radius:50%; background:#34c759; flex-shrink:0; }
.uout { font-size:10px; font-weight:700; color:rgba(255,255,255,0.6); background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:8px 10px; cursor:pointer; font-family:inherit; flex-shrink:0; white-space:nowrap; }
.uout:hover { color:#fff; background:rgba(255,255,255,0.1); }
.league-tabs { display:flex; gap:10px; margin-bottom:16px; }
.league-tab { width:60px; height:60px; border-radius:16px; border:2px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s; flex-shrink:0; position:relative; backdrop-filter:blur(8px); }
.league-tab:hover { border-color:rgba(0,122,255,0.35); }
.league-tab.active { border-color:#007aff; background:rgba(0,122,255,0.15); box-shadow:0 0 0 3px rgba(0,122,255,0.12); }
.league-tab img { width:40px; height:40px; object-fit:contain; }
.league-tab .ldot { position:absolute; bottom:-8px; left:50%; transform:translateX(-50%); width:4px; height:4px; background:#007aff; border-radius:50%; opacity:0; }
.league-tab.active .ldot { opacity:1; }
.stats { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; }
.sbox { background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:10px 12px; backdrop-filter:blur(10px); }
.slbl { font-size:10px; font-weight:700; color:rgba(255,255,255,0.45); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:3px; }
.sval { font-family:'Barlow Condensed',sans-serif; font-size:26px; color:#fff; letter-spacing:1px; line-height:1; }
.sval.b { color:#60a5fa; filter:drop-shadow(0 0 8px rgba(96,165,250,0.4)); }
.nav { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:480px; background:rgba(6,10,15,0.97); border-top:1px solid rgba(0,122,255,0.1); display:flex; z-index:50; backdrop-filter:blur(20px); padding:10px 0 14px; }
.ni { flex:1; padding:6px 4px 4px; background:transparent; border:none; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:4px; }
.nic { width:48px; height:34px; display:flex; align-items:center; justify-content:center; border-radius:12px; font-size:24px; transition:background 0.2s; }
.ni.on .nic { background:rgba(0,122,255,0.12); }
.nlbl { font-size:11px; font-weight:600; color:rgba(255,255,255,0.4); transition:color 0.2s; }
.ni.on .nlbl { color:#60a5fa; }
.ndot { width:4px; height:4px; background:#007aff; border-radius:50%; display:none; }
.ni.on .ndot { display:block; }
.ct { padding:14px; }
.sh { font-size:12px; font-weight:700; color:rgba(255,255,255,0.5); letter-spacing:1.5px; text-transform:uppercase; margin-bottom:10px; padding:0 2px; }
.mc { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:20px; margin-bottom:10px; overflow:hidden; transition:border-color 0.2s,transform 0.15s; }
.mc:hover { border-color:rgba(0,122,255,0.25); transform:translateY(-1px); }
.mt2 { padding:9px 14px; background:rgba(255,255,255,0.02); border-bottom:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; }
.rbadge { font-size:11px; color:#60a5fa; background:rgba(0,122,255,0.1); border:1px solid rgba(0,122,255,0.2); padding:3px 10px; border-radius:20px; font-weight:700; }
.mtime { font-size:12px; color:rgba(255,255,255,0.65); font-weight:600; }
.mb2 { padding:14px; }
.tms { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; gap:6px; }
.tm { display:flex; align-items:center; gap:7px; flex:1; min-width:0; }
.tm.r { flex-direction:row-reverse; }
.tn { font-size:13px; font-weight:700; color:#fff; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.tm.r .tn { text-align:right; }
.vs-sep { flex-shrink:0; text-align:center; }
.vs-txt { font-size:10px; color:rgba(255,255,255,0.25); font-weight:700; letter-spacing:1px; }
.vs-result { font-family:'Barlow Condensed',sans-serif; font-size:22px; color:#60a5fa; letter-spacing:1px; }
.odds { display:flex; gap:8px; }
.odd { flex:1; border-radius:12px; padding:10px 6px; text-align:center; background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,255,255,0.08); cursor:pointer; transition:all 0.18s; }
.odd:hover:not(:disabled) { background:rgba(0,122,255,0.1); border-color:rgba(0,122,255,0.4); }
.odd.sel { background:rgba(0,122,255,0.15); border-color:#007aff; }
.odd.ok { background:rgba(52,199,89,0.1); border-color:#34c759; }
.odd.no { opacity:0.3; }
.odd:disabled { cursor:default; }
.ol { font-size:11px; color:rgba(255,255,255,0.5); font-weight:600; }
.odd.sel .ol { color:rgba(96,165,250,0.8); }
.odd.ok .ol { color:#34c759; }
.ov { font-family:'Barlow Condensed',sans-serif; font-size:22px; color:#fff; letter-spacing:0.5px; margin-top:2px; }
.odd.sel .ov { color:#60a5fa; }
.odd.ok .ov { color:#34c759; }
.tipok { margin-top:10px; background:rgba(0,122,255,0.08); border:1px solid rgba(0,122,255,0.2); border-radius:10px; padding:8px 12px; font-size:13px; color:#60a5fa; font-weight:600; }
.lck { margin-top:10px; font-size:13px; color:#ff453a; text-align:center; font-weight:600; }
.res-w { background:rgba(52,199,89,0.15); color:#34c759; font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; }
.res-l { background:rgba(255,59,48,0.12); color:#ff3b30; font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; }
.res-n { background:rgba(255,255,255,0.07); color:rgba(255,255,255,0.4); font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; }
.lbc { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); border-radius:20px; overflow:hidden; }
.lbr { display:flex; align-items:center; gap:10px; padding:13px 16px; border-bottom:1px solid rgba(255,255,255,0.05); }
.lbr:last-child { border-bottom:none; }
.lbr.me { background:rgba(0,122,255,0.05); border-left:2px solid #007aff; }
.lbrank { font-size:20px; width:28px; text-align:center; flex-shrink:0; }
.lbrn { font-family:'Barlow Condensed',sans-serif; font-size:17px; color:rgba(255,255,255,0.3); }
.lbn { font-size:15px; font-weight:600; color:#fff; display:flex; align-items:center; flex-wrap:wrap; gap:4px; }
.lbme { font-size:9px; color:#60a5fa; background:rgba(0,122,255,0.12); padding:1px 6px; border-radius:6px; font-weight:700; }
.lbs { font-size:11px; color:rgba(255,255,255,0.4); margin-top:2px; }
.lbp { font-family:'Barlow Condensed',sans-serif; font-size:24px; letter-spacing:0.5px; }
.lbp.top { color:#60a5fa; filter:drop-shadow(0 0 8px rgba(96,165,250,0.3)); }
.lbp.nm { color:#fff; }
.lbpl { font-size:9px; color:rgba(255,255,255,0.3); font-weight:600; text-align:right; }
.rc { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:20px; overflow:hidden; margin-bottom:10px; }
.rrow { display:flex; gap:14px; align-items:flex-start; padding:14px 16px; border-bottom:1px solid rgba(255,255,255,0.05); }
.rrow:last-child { border-bottom:none; }
.ric { width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
.rtit { font-size:15px; font-weight:700; color:#fff; margin-bottom:5px; }
.rtxt { font-size:13px; color:rgba(255,255,255,0.65); line-height:1.65; }
.prow { display:flex; align-items:center; gap:14px; padding:14px 16px; border-bottom:1px solid rgba(255,255,255,0.05); }
.prow:last-child { border-bottom:none; }
.pic2 { width:48px; height:48px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:26px; flex-shrink:0; }
.pnm { font-size:14px; font-weight:600; color:#fff; }
.pamt { font-family:'Barlow Condensed',sans-serif; font-size:26px; letter-spacing:1px; flex-shrink:0; }
.ar { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid rgba(255,255,255,0.05); gap:8px; }
.ar:last-child { border-bottom:none; }
.an { font-size:13px; font-weight:700; color:#fff; }
.at { font-size:11px; color:rgba(255,255,255,0.45); margin-top:2px; }
.aedt { background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.1); color:rgba(255,255,255,0.75); padding:6px 12px; border-radius:10px; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; }
.ares-btn { background:rgba(0,122,255,0.1); border:1px solid rgba(0,122,255,0.25); color:#60a5fa; padding:6px 12px; border-radius:10px; font-size:12px; font-weight:600; cursor:pointer; font-family:inherit; }
.mo { position:fixed; inset:0; background:rgba(0,0,0,0.8); display:flex; align-items:flex-end; justify-content:center; z-index:100; backdrop-filter:blur(20px); }
.mbox { background:#080e1a; border:1px solid rgba(255,255,255,0.1); border-radius:24px 24px 0 0; padding:28px 22px; width:100%; max-width:480px; max-height:92vh; overflow-y:auto; }
.mh { width:36px; height:4px; background:rgba(255,255,255,0.15); border-radius:2px; margin:0 auto 20px; }
.mtt { font-size:18px; font-weight:700; color:#fff; margin-bottom:4px; }
.mst { font-size:13px; color:rgba(255,255,255,0.4); margin-bottom:20px; }
.rbtn { flex:1; padding:15px 8px; background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,255,255,0.1); border-radius:14px; color:rgba(255,255,255,0.65); cursor:pointer; font-family:inherit; font-size:20px; font-weight:700; transition:all 0.18s; }
.rbtn:hover { background:rgba(0,122,255,0.12); border-color:#007aff; color:#60a5fa; }
.mi { width:100%; padding:12px 14px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; color:#fff; font-family:inherit; font-size:14px; outline:none; margin-bottom:8px; }
.mi:focus { border-color:rgba(0,122,255,0.4); }
.mi::placeholder { color:rgba(255,255,255,0.25); }
.mprim { width:100%; padding:14px; background:linear-gradient(135deg,#0051cc,#007aff); border:none; border-radius:14px; color:#fff; font-family:inherit; font-size:15px; font-weight:700; cursor:pointer; }
.msec { width:100%; padding:12px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); border-radius:14px; color:rgba(255,255,255,0.5); font-family:inherit; font-size:14px; font-weight:500; cursor:pointer; }
.msel { width:100%; padding:12px 14px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; color:#fff; font-family:inherit; font-size:14px; outline:none; margin-bottom:8px; }
.toast { position:fixed; bottom:110px; left:50%; transform:translateX(-50%); background:rgba(6,14,28,0.96); border:1px solid rgba(0,122,255,0.25); color:#fff; padding:10px 20px; border-radius:50px; font-size:14px; font-weight:600; z-index:200; white-space:nowrap; animation:toastIn 0.25s ease; backdrop-filter:blur(20px); }
@keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
.chat-wrap { display:flex; flex-direction:column; height:calc(100vh - 200px); }
.chat-msgs { flex:1; overflow-y:auto; padding:0 0 8px; }
.cdt { text-align:center; margin:14px 0 10px; }
.cdt span { font-size:11px; color:rgba(255,255,255,0.35); background:rgba(255,255,255,0.05); padding:3px 12px; border-radius:20px; }
.cbw { display:flex; flex-direction:column; margin-bottom:2px; }
.crow { display:flex; align-items:flex-end; gap:6px; }
.crow.me { flex-direction:row-reverse; }
.cb { padding:9px 13px; border-radius:18px; max-width:76%; word-break:break-word; font-size:15px; line-height:1.4; }
.cb.mine { background:linear-gradient(135deg,#0051cc,#007aff); color:#fff; font-weight:500; border-bottom-right-radius:4px; }
.cb.theirs { background:rgba(255,255,255,0.08); color:#fff; border-bottom-left-radius:4px; }
.csnd { font-size:10px; color:rgba(255,255,255,0.35); margin-left:38px; margin-top:2px; }
.ctm { font-size:10px; color:rgba(255,255,255,0.25); margin-top:2px; text-align:right; }
.chat-bar { padding:8px 0 16px; display:flex; gap:8px; align-items:center; border-top:1px solid rgba(255,255,255,0.07); }
.cin { flex:1; padding:11px 16px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); border-radius:22px; color:#fff; font-family:inherit; font-size:15px; outline:none; }
.cin:focus { border-color:rgba(0,122,255,0.3); }
.cin::placeholder { color:rgba(255,255,255,0.25); }
.csend { width:38px; height:38px; background:linear-gradient(135deg,#0051cc,#007aff); border:none; border-radius:50%; color:#fff; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:700; flex-shrink:0; }
.csend:disabled { background:rgba(255,255,255,0.07); color:rgba(255,255,255,0.2); }
.empty { text-align:center; padding:50px 0; color:rgba(255,255,255,0.3); }
.ei { font-size:40px; margin-bottom:10px; }
.et { font-size:16px; font-weight:600; color:rgba(255,255,255,0.45); }
.es { font-size:13px; margin-top:4px; }

.league-tab .lbadge { position:absolute; top:-6px; right:-6px; min-width:20px; height:20px; padding:0 5px; border-radius:10px; background:#ff3b30; color:#fff; font-size:11px; font-weight:800; display:flex; align-items:center; justify-content:center; border:2px solid #060a0f; }
.mc.missing { border-color:rgba(255,59,48,0.65); }
.picks-hidden { margin-top:12px; padding:10px 12px; border-radius:12px; background:rgba(255,255,255,0.03); border:1px dashed rgba(255,255,255,0.12); font-size:12px; color:rgba(255,255,255,0.45); text-align:center; }
.picks { margin-top:12px; display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
.pcol { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:8px 6px; min-width:0; }
.pcol.win { border-color:rgba(52,199,89,0.5); background:rgba(52,199,89,0.07); }
.pcol.lose { opacity:0.55; }
.pcol h4 { font-size:10px; font-weight:800; text-align:center; margin:0 0 6px; letter-spacing:0.5px; }
.pwho { display:flex; align-items:center; gap:5px; padding:3px 2px; min-width:0; }
.pwho span { font-size:11px; color:rgba(255,255,255,0.8); font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.pwho.me span { color:#60a5fa; font-weight:800; }
.pnone { font-size:10px; color:rgba(255,255,255,0.25); text-align:center; padding:4px 0; }
.pmissing { margin-top:8px; font-size:11px; color:rgba(255,149,0,0.85); font-weight:600; }

.rs { border-radius:22px; overflow:hidden; border:1px solid rgba(251,191,36,0.3); background:linear-gradient(160deg, rgba(251,191,36,0.10), rgba(255,255,255,0.02) 55%); margin-bottom:14px; }
.rs-top { padding:12px 14px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.06); }
.rs-title { font-family:'Barlow Condensed',sans-serif; font-size:20px; color:#fff; letter-spacing:1px; }
.rs-sub { font-size:11px; color:rgba(255,255,255,0.45); font-weight:600; }
.rs-x { width:28px; height:28px; border-radius:50%; background:rgba(255,255,255,0.06); border:none; color:rgba(255,255,255,0.5); font-size:13px; cursor:pointer; flex-shrink:0; }
.rs-sec { font-size:10px; font-weight:700; color:rgba(255,255,255,0.45); text-transform:uppercase; letter-spacing:0.8px; padding:10px 14px 2px; }
.rs-row { display:flex; align-items:center; gap:10px; padding:8px 14px; }
.rs-pos { width:22px; text-align:center; font-family:'Barlow Condensed',sans-serif; font-size:18px; color:rgba(255,255,255,0.5); flex-shrink:0; }
.rs-name { font-size:14px; font-weight:700; color:#fff; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.rs-det { font-size:11px; color:rgba(255,255,255,0.45); margin-top:1px; }
.rs-val { margin-left:auto; font-family:'Barlow Condensed',sans-serif; font-size:22px; text-align:right; flex-shrink:0; }
.rs-hl { display:flex; align-items:center; gap:10px; padding:11px 14px; border-top:1px solid rgba(255,255,255,0.06); }
.rs-ic { width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:17px; flex-shrink:0; }

.st-chips { display:flex; gap:6px; margin-bottom:12px; overflow-x:auto; padding-bottom:2px; }
.st-chip { padding:7px 12px; border-radius:20px; font-size:12px; font-weight:700; border:1px solid rgba(255,255,255,0.1); background:transparent; color:rgba(255,255,255,0.55); white-space:nowrap; cursor:pointer; font-family:inherit; }
.st-chip.on { background:rgba(0,122,255,0.15); border-color:#007aff; color:#60a5fa; }
.st-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:14px; margin-bottom:10px; }
.st-big { display:flex; align-items:flex-end; gap:12px; margin:12px 0 4px; }
.st-pct { font-family:'Barlow Condensed',sans-serif; font-size:56px; line-height:0.85; color:#60a5fa; }
.st-pctl { font-size:12px; color:rgba(255,255,255,0.55); line-height:1.4; padding-bottom:4px; }
.st-note { font-size:11px; color:rgba(255,255,255,0.45); margin-top:6px; }
.st-bar { height:8px; border-radius:8px; background:rgba(255,255,255,0.07); overflow:hidden; }
.st-bar > div { height:100%; border-radius:8px; }
.st-split-row { display:flex; justify-content:space-between; font-size:12px; color:rgba(255,255,255,0.75); margin-bottom:5px; font-weight:600; }
.st-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:10px; }
.st-tile { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:10px 12px; min-width:0; }
.st-tile .t { font-size:10px; font-weight:700; color:rgba(255,255,255,0.45); text-transform:uppercase; letter-spacing:0.6px; }
.st-tile .v { font-family:'Barlow Condensed',sans-serif; font-size:26px; color:#fff; line-height:1.1; margin-top:2px; }
.st-tile .d { font-size:11px; color:rgba(255,255,255,0.45); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.st-rec { display:flex; align-items:center; gap:10px; padding:10px 0; border-top:1px solid rgba(255,255,255,0.05); }
.st-rec:first-child { border-top:none; padding-top:0; }
.st-rec:last-child { padding-bottom:0; }
.st-rec .n { font-size:13px; font-weight:700; color:#fff; }
.st-rec .w { font-size:11px; color:rgba(255,255,255,0.45); }
.st-rec .val { margin-left:auto; font-family:'Barlow Condensed',sans-serif; font-size:22px; color:#fbbf24; flex-shrink:0; }
.lbr.click { cursor:pointer; }
.cmp-head { display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom:10px; }
.cmp-p { display:flex; flex-direction:column; align-items:center; gap:5px; font-size:13px; font-weight:700; color:#fff; min-width:0; }
.cmp-p span { max-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.cmp { display:grid; grid-template-columns:60px 1fr 60px; align-items:center; gap:8px; padding:9px 0; border-top:1px solid rgba(255,255,255,0.05); }
.cmp .v { font-family:'Barlow Condensed',sans-serif; font-size:21px; text-align:center; color:rgba(255,255,255,0.75); }
.cmp .v.win { color:#34c759; }
.cmp .v.lose { color:rgba(255,255,255,0.4); }
.cmp .m { text-align:center; font-size:11px; color:rgba(255,255,255,0.5); font-weight:600; }

.lbrank.col { display:flex; flex-direction:column; align-items:center; gap:2px; }
.rdelta { font-size:10px; font-weight:800; line-height:1; }

.nic { color:rgba(255,255,255,0.4); transition:color 0.2s; }
.nic svg { width:22px; height:22px; }
.ni.on .nic { color:#60a5fa; }

/* ═══════════ SZATA „MURAWA NOCĄ” ═══════════ */
:root {
  --murawa:#0E1A14; --trawa:#15241C; --trawa2:#1C2F24; --modal:#122019;
  --kreda:#E9EFE6; --kreda-60:rgba(233,239,230,0.6); --kreda-35:rgba(233,239,230,0.38); --linia:rgba(233,239,230,0.12);
  --reflektor:#F2C94C; --wygrana:#3DDC84; --pudlo:#FF5A5F; --papier:#F4EFE3; --tusz:#1E2420;
}
body { background:var(--murawa); color:var(--kreda); }
.app { background:var(--murawa); background-image:radial-gradient(ellipse 120% 30% at 50% -5%, rgba(242,201,76,0.08), transparent 60%); padding-bottom:110px; }
.ct { padding:4px 16px 16px; }
button:focus-visible { outline:2px solid var(--reflektor); outline-offset:2px; }

/* nagłówek */
.rd-top { display:flex; justify-content:space-between; align-items:center; padding:16px 16px 12px; gap:10px; }
.rd-brand { display:flex; align-items:center; gap:9px; min-width:0; }
.rd-mark { width:30px; height:30px; border-radius:50%; border:2px solid var(--kreda); position:relative; flex-shrink:0; }
.rd-mark::after { content:""; position:absolute; left:50%; top:-2px; bottom:-2px; width:2px; background:var(--kreda); transform:translateX(-50%); }
.rd-mark::before { content:""; position:absolute; left:50%; top:50%; width:8px; height:8px; border-radius:50%; background:var(--kreda); transform:translate(-50%,-50%); }
.rd-name { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:22px; letter-spacing:0.3px; white-space:nowrap; }
.rd-me { display:flex; align-items:center; gap:8px; background:var(--trawa); border:none; border-radius:22px; padding:4px 12px 4px 4px; color:var(--kreda); cursor:pointer; min-width:0; }
.rd-me .n { font-weight:600; font-size:14px; max-width:100px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.rd-me .o { font-size:12px; color:var(--wygrana); white-space:nowrap; }

/* ligi */
.rd-leagues { display:flex; gap:8px; overflow-x:auto; padding:0 16px 14px; scrollbar-width:none; }
.rd-leagues::-webkit-scrollbar { display:none; }
.rd-lg { display:flex; align-items:center; gap:7px; padding:7px 13px 7px 8px; border-radius:22px; background:var(--trawa); font-family:inherit; font-weight:600; font-size:14px; color:var(--kreda-60); white-space:nowrap; border:none; cursor:pointer; }
.rd-lg img { width:22px; height:22px; object-fit:contain; }
.rd-lg.on { background:var(--kreda); color:var(--tusz); }
.rd-lg .dot { min-width:18px; height:18px; border-radius:9px; background:var(--pudlo); color:#fff; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; padding:0 5px; }

/* kupon — jedyny głośny element */
.kupon { background:var(--papier); color:var(--tusz); border-radius:14px; position:relative; margin:6px 0 22px; box-shadow:0 10px 30px rgba(0,0,0,0.35); transform:rotate(-0.6deg); }
.kupon::before, .kupon::after { content:""; position:absolute; top:60px; width:18px; height:18px; border-radius:50%; background:var(--murawa); }
.kupon::before { left:-9px; } .kupon::after { right:-9px; }
.k-head { padding:12px 16px; display:flex; justify-content:space-between; align-items:flex-end; gap:10px; }
.k-title { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:24px; line-height:1; }
.k-sub { font-size:13px; color:#5b625d; margin-top:3px; }
.k-score { text-align:right; flex-shrink:0; }
.k-score .v { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:30px; line-height:1; }
.k-score .l { font-size:12px; color:#5b625d; }
.k-perf { border-top:2px dashed rgba(30,36,32,0.25); margin:0 14px; }
.k-rows { padding:8px 16px 4px; }
.k-row { display:flex; align-items:center; gap:10px; padding:5px 0; font-size:14px; }
.k-row .m { flex:1; min-width:0; font-weight:500; }
.k-row .p { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:16px; text-align:right; white-space:nowrap; }
.k-row.none .m, .k-row.none .p { color:#a3363a; }
.k-foot { display:flex; justify-content:flex-end; padding:4px 14px 12px; }
.stamp { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:14px; color:#c0392b; border:2px solid #c0392b; border-radius:6px; padding:1px 8px; transform:rotate(-6deg); }
.stamp.ok { color:#1f7a47; border-color:#1f7a47; }

/* dzień i mecz jako wiersz */
.rd-day { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:20px; margin:10px 0 2px; }
.rd-day span { font-family:'Barlow',sans-serif; font-weight:500; font-size:14px; color:var(--kreda-35); margin-left:6px; }
.rd-match { display:grid; grid-template-columns:52px 1fr; gap:0 12px; padding:14px 0; border-top:1px solid var(--linia); position:relative; }
.rd-match.missing::before { content:""; position:absolute; left:-16px; top:14px; bottom:14px; width:3px; border-radius:0 3px 3px 0; background:var(--pudlo); }
.rd-time { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:19px; padding-top:1px; }
.rd-time small { display:block; font-family:'Barlow',sans-serif; font-weight:500; font-size:11px; color:var(--kreda-35); line-height:1.3; }
.rd-teams { display:flex; flex-direction:column; gap:7px; margin-bottom:12px; min-width:0; }
.rd-team { display:flex; align-items:center; gap:10px; font-weight:600; font-size:16px; min-width:0; }
.rd-team span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.rd-team.feat { font-size:18px; font-weight:700; }
.rd-odds { grid-column:2; display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
.rd-odd { position:relative; overflow:hidden; border:none; border-radius:10px; background:var(--trawa); color:var(--kreda); padding:8px 10px; text-align:left; cursor:pointer; font-family:inherit; }
.rd-odd::before { content:""; position:absolute; inset:0; width:var(--p); background:rgba(233,239,230,0.08); transition:width 0.5s ease; }
.rd-odd .t { position:relative; display:flex; justify-content:space-between; font-size:12px; color:var(--kreda-60); font-weight:600; }
.rd-odd .v { position:relative; display:block; font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:22px; line-height:1.1; }
.rd-odd.sel { background:var(--reflektor); color:var(--tusz); }
.rd-odd.sel::before { background:rgba(30,36,32,0.10); }
.rd-odd.sel .t { color:rgba(30,36,32,0.7); }
.rd-odd.dim { opacity:0.45; }
.rd-odd:disabled { cursor:default; }
.rd-foot { grid-column:2; }
.rd-note { font-size:13px; color:var(--kreda-35); margin-top:8px; }
.rd-feat { margin:4px -16px 0; }
.rd-photo { height:110px; background-size:cover; background-position:center; position:relative; }
.rd-photo::after { content:""; position:absolute; inset:0; background:linear-gradient(180deg, rgba(14,26,20,0.05), var(--murawa)); }
.rd-feat-body { padding:0 16px; margin-top:-42px; position:relative; }
.rd-feat-body .rd-match { border-top:none; }

/* odsłonięte typy */
.pcol { background:var(--trawa); border:none; }
.pcol.win { background:rgba(61,220,132,0.10); border:1px solid rgba(61,220,132,0.45); }
.pwho.me span { color:var(--reflektor); }
.pmissing { color:var(--pudlo); }

/* dolne menu — pływające */
.rd-nav { position:fixed; bottom:12px; left:50%; transform:translateX(-50%); width:calc(min(100%, 480px) - 24px); background:rgba(21,36,28,0.94); backdrop-filter:blur(14px); border:1px solid var(--linia); border-radius:22px; display:flex; justify-content:space-around; padding:7px 6px; z-index:50; }
.rd-ni { display:flex; align-items:center; gap:6px; padding:9px 12px; border-radius:16px; color:var(--kreda-60); background:none; border:none; font-family:inherit; font-weight:600; font-size:14px; cursor:pointer; }
.rd-ni svg { width:22px; height:22px; }
.rd-ni .l { display:none; }
.rd-ni.on { background:var(--kreda); color:var(--tusz); }
.rd-ni.on .l { display:inline; }

/* „Więcej” */
.rd-h1 { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:30px; line-height:1; margin:4px 0 6px; }
.rd-h1sub { font-size:14px; color:var(--kreda-35); margin-bottom:12px; }
.rd-menu { display:flex; flex-direction:column; }
.rd-menu button { display:flex; align-items:center; justify-content:space-between; padding:16px 2px; border:none; border-top:1px solid var(--linia); background:none; color:var(--kreda); font-family:inherit; font-size:17px; font-weight:600; cursor:pointer; text-align:left; }
.rd-menu button span { color:var(--kreda-35); font-size:14px; font-weight:500; }
.rd-menu button.danger { color:var(--pudlo); }
.rd-back { background:none; border:none; color:var(--kreda-60); font-family:inherit; font-size:14px; font-weight:600; padding:4px 0 10px; cursor:pointer; }

/* tabela jak tablica wyników */
.rd-row { display:grid; grid-template-columns:38px 32px 1fr auto; align-items:center; gap:10px; padding:12px 0; border-top:1px solid var(--linia); cursor:pointer; }
.rd-row.me { background:linear-gradient(90deg, rgba(242,201,76,0.12), transparent 70%); margin:0 -16px; padding-left:16px; padding-right:16px; }
.rd-pos { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:28px; line-height:1; text-align:center; }
.rd-pos small { display:block; font-family:'Barlow',sans-serif; font-weight:700; font-size:11px; margin-top:3px; }
.rd-pos.g1 { color:#E8C35A; } .rd-pos.g2 { color:#C9D1D3; } .rd-pos.g3 { color:#D08B5B; }
.rd-up { color:var(--wygrana); } .rd-down { color:var(--pudlo); } .rd-same { color:var(--kreda-35); }
.rd-nm { font-weight:600; font-size:16px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.rd-nm .ty { font-size:12px; color:var(--reflektor); font-weight:700; margin-left:5px; }
.rd-nm .st { color:var(--reflektor); font-size:13px; font-weight:700; margin-left:6px; }
.rd-sub { font-size:13px; color:var(--kreda-35); margin-top:1px; }
.rd-sub .plus { color:var(--wygrana); } .rd-sub .minus { color:var(--pudlo); }
.rd-pts { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:24px; text-align:right; font-variant-numeric:tabular-nums; }

/* istniejące elementy w nowej palecie */
.sh { font-family:'Barlow Condensed',sans-serif; font-size:20px; font-weight:700; letter-spacing:0; text-transform:none; color:var(--kreda); margin:12px 0 8px; padding:0; }
.mc { background:var(--trawa); border:none; border-radius:16px; }
.mc:hover { transform:none; border:none; }
.mt2 { background:transparent; border-bottom:1px solid var(--linia); }
.rbadge { color:var(--kreda-60); background:transparent; border:1px solid var(--linia); }
.mtime { color:var(--kreda-60); }
.odd { background:var(--trawa2); border:none; }
.odd.sel { background:var(--reflektor); }
.odd.sel .ov, .odd.sel .ol { color:var(--tusz); }
.odd.ok { background:rgba(61,220,132,0.14); border:1px solid rgba(61,220,132,0.5); }
.vs-result { color:var(--reflektor); }
.tipok { background:rgba(242,201,76,0.1); border-color:rgba(242,201,76,0.3); color:var(--reflektor); }
.lbme { color:var(--reflektor); background:rgba(242,201,76,0.12); }
.lbc, .rc, .st-card { background:var(--trawa); border:none; }
.st-tile { background:var(--trawa); border:none; }
.st-pct { color:var(--reflektor); }
.st-chip { border-color:var(--linia); color:var(--kreda-60); }
.st-chip.on { background:var(--kreda); border-color:var(--kreda); color:var(--tusz); }
.mo { background:rgba(5,10,7,0.75); }
.mbox { background:var(--modal); border-color:var(--linia); }
.mi, .msel { background:var(--trawa); border-color:var(--linia); color:var(--kreda); }
.mprim { background:var(--reflektor); color:var(--tusz); }
.msec { background:transparent; border-color:var(--linia); color:var(--kreda-60); }
.aedt { background:var(--trawa2); border-color:var(--linia); color:var(--kreda); }
.ares-btn { background:rgba(242,201,76,0.12); border-color:rgba(242,201,76,0.3); color:var(--reflektor); }
.toast { background:var(--trawa2); border-color:var(--linia); color:var(--kreda); bottom:96px; }
.chat-wrap { height:calc(100vh - 230px); }
.cb.mine { background:var(--kreda); color:var(--tusz); }
.cb.theirs { background:var(--trawa); }
.cin { background:var(--trawa); border-color:var(--linia); }
.csend { background:var(--kreda); color:var(--tusz); }
.cdt span { background:var(--trawa); }
.acta, .seg-btn.on { background:var(--reflektor); color:var(--tusz); box-shadow:none; }
.hero-blue { color:var(--reflektor); filter:none; }
`;
