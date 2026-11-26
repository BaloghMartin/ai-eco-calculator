# AI Eco Calculator (AI Környezeti Hatás Kalkulátor)

🌍 *[🇭🇺 Kattints ide a magyar verzióért! (Click here for the Hungarian version)](#-magyar-verzió)*

This repository contains the source code for a self-contained interactive web widget (HTML/CSS/Vanilla JS) that estimates the ecological footprint (energy and water consumption) of Large Language Model (LLM) prompts, attachments, and multimodal outputs.

The project was created for data journalism and educational demonstration purposes to illustrate the real-world physical cost of artificial intelligence queries—running 100% client-side with zero API calls or external dependencies.

---

## ✨ Key Features

* **Deterministic Heuristic Engine:** Identical inputs always yield identical outputs using linguistic intent prediction and an **FNV-1a** 32-bit hash for reproducible variance—no random numbers and no live LLM API calls.
* **Three Model Tiers:** Compare **Light** (Dense, e.g. 8B-class), **Medium** (MoE), and **Thinking** (MoE + hidden Chain-of-Thought test-time compute) models.
* **Attachment (RAG) & Multimodal Simulation:** Account for attached context sizes (*Article*, *Small PDF*, *Large PDF*, *Book*) with prompt-caching discounts, plus multimodal generation (*Image*, *Podcast*, *HD Video*).
* **6 Physical Equivalents:** Translates Watt-hours and milliliters into everyday comparisons (datacenter cooling water, smartphone charge %, 10W LED bulb minutes, municipal tap water liters, HD video streaming minutes, and boiled tea cups).
* **Client-Side PNG & Animated GIF Export:** Generates shareable `1080px` infographics as static PNGs or 25 fps animated GIFs using an inlined `gif.js` + isolated Blob Web Worker (`<script type="javascript/worker">`), with Web Share API, Async Clipboard API, and automatic download fallbacks.
* **Standalone & Responsive `<iframe>` Embed Mode:** Works out-of-the-box as a standalone page (with dark/light theme support) or embedded cleanly inside any article/CMS via automatic iframe detection or `?embed=1`.

---

## ⚙️ Methodology & Scientific Constants

All constants are centralized in `ECO_CONSTANTS` and `MEDIA_ENERGY_TAX_WH` inside [`index.html`](index.html):

* **Token Estimation (BPE Approximation):** Optimized for Hungarian morphology (`max(ceil(chars / 2.2), ceil(words * 2.7))`), combined with Unicode-aware intent regexes (`\p{L}`) and FNV-1a deterministic variance (`-25` to `+25` tokens).
* **Prefill & Decode Energy:**
  * Prefill: `6.05e-5 Wh/token` scaled by active parameter ratio (`1.0` Dense for Light; `0.5` MoE for Medium/Thinking), with a `0.3x` Prompt Caching discount (`70%` savings) when context attachments are enabled.
  * Decode: `0.04` (Light), `0.16` (Medium), and `0.25` (Thinking) `Wh / 1,000 tokens`, scaled by active parameter ratio. Thinking models apply a hidden Chain-of-Thought multiplier (`10x` base, `30x` medium reasoning, `80x` high reasoning).
  * Hardware efficiency: raw compute energy is divided by `MFU = 0.45` (Model FLOPs Utilization).
* **Multimodal Energy Tax:** Image (`+2.9 Wh`), Podcast/TTS (`+2.0 Wh`), HD Video (`+25.0 Wh`).
* **Datacenter PUE & Bifurcated WUE:**
  * `PUE_EU = 1.15` applied to total server energy (`totalEnergyWh = serverEnergyWh * 1.15`).
  * Water footprint combines a quadratic European wet-bulb on-site evaporative cooling model (`T_w = 15.0 °C` → `~0.866 mL/Wh`) plus off-site grid water intensity (`WUE_OFFSITE_EU = 0.5 mL/Wh`), totaling `~1.37 mL/Wh` of server energy.
* **Physical Equivalents:** Smartphone charge (`22.5 Wh`), 10W LED (`10 Wh/h`), Tap water treatment (`1.0 Wh/L`), HD Stream (`1.25 Wh/min`), Tea (`25 Wh` per 250 mL cup).

---

## 🛡️ Architecture, Privacy & Security

* **Single Self-Contained File:** No build step, no external CDNs, no cookies, no analytics, and zero backend communication.
* **DOM & XSS Hygiene:** Zero `innerHTML` or `eval` usage; all dynamic text uses `.textContent` or Canvas `fillText`.
* **Cross-Origin Iframe Safe:** `localStorage` access is guarded in `try/catch`, native `window.alert()` dialogs are replaced with an inline ARIA status banner (`#statusNotice`), and the GIF worker uses `type="javascript/worker"` so it never interferes with `window.onmessage`.
* **DoS & Render Safeguards:** `5,000`-character prompt limit (with paste truncation detection), auto-resizing prompt input (`90px–360px`), emoji-safe binary-search Canvas wrapping (`Array.from`) capped at `10` infographic lines (`<= 1700px`), automatic font-size fitting, 45s GIF worker timeout, and tracked Blob URL cleanup.

---

## 🖼️ Embedding in an `<iframe>` (CMS / Article Integration)

The widget automatically activates embedded mode (`html.is-embedded`) when loaded inside an `<iframe>` or via `?embed=1`: it removes outer margins/shadows, locks to a clean light background (`#ffffff`), hides the standalone theme toggle, and communicates height changes over `postMessage` (`eco-calc-resize`, `eco-calc-ping`, and one-shot `eco-calc-scroll-to`).

```html
<iframe
  data-eco-calc-embed
  src="https://YOUR-HOSTED-URL/"
  title="AI Környezeti Hatás Kalkulátor"
  allow="clipboard-write; web-share"
  loading="lazy"
  scrolling="no"
  frameborder="0"
  style="width: 100%; height: 680px; border: 0; display: block; margin-bottom: 0; overflow: hidden;"
></iframe>
<script type="text/javascript">
(function () {
  if (!window.__ecoCalcEmbedInit) {
    window.__ecoCalcEmbedInit = true;
    window.addEventListener("message", function (e) {
      if (!e.data || !e.data.type) return;
      if (e.data.type !== "eco-calc-resize" && e.data.type !== "eco-calc-scroll-to") return;
      var frames = document.querySelectorAll("iframe[data-eco-calc-embed]");
      var targetFrame = null;
      for (var i = 0; i < frames.length; i++) {
        if (frames[i].contentWindow === e.source) {
          targetFrame = frames[i];
          break;
        }
      }
      if (!targetFrame) return;

      if (e.data.type === "eco-calc-resize") {
        var h = Number(e.data.height);
        if (!h || h < 200 || h > 4000) return;
        targetFrame.style.height = Math.ceil(h) + "px";
      } else if (e.data.type === "eco-calc-scroll-to") {
        var offset = Number(e.data.offsetTop);
        if (isNaN(offset) || offset < 0 || offset > 4000) return;
        var rect = targetFrame.getBoundingClientRect();
        var targetInViewport = rect.top + offset;
        if (targetInViewport > window.innerHeight - 160) {
          window.scrollTo({ top: Math.max(0, window.scrollY + targetInViewport - 80), behavior: "smooth" });
        }
      }
    });
  }
  var all = document.querySelectorAll("iframe[data-eco-calc-embed]");
  for (var j = 0; j < all.length; j++) {
    try { all[j].contentWindow.postMessage({ type: "eco-calc-ping" }, "*"); } catch (err) {}
  }
})();
</script>
```

---

## 🚀 Local Development

Serve the repository directory over any static HTTP server (required so Blob Web Workers and Clipboard/Share APIs run on a valid origin):

```bash
python3 -m http.server 8080
```

Then open `http://127.0.0.1:8080/` (standalone) or `http://127.0.0.1:8080/?embed=1` (embedded preview).

---

## ⚠️ Legal Disclaimer 

**ATTENTION:** The code and calculation models in this repository are for informational and demonstration purposes only.

1. **Accuracy of Calculations:** The generated values are based on publicly available research data and industry estimates. Actual datacenter consumption may vary significantly depending on hardware architecture, cooling solutions, and geographic location. The author assumes no responsibility for the absolute accuracy of the calculations.
2. **"AS IS" Clause:** The software is provided "AS IS", without warranty of any kind, express or implied.
3. **Limitation of Liability:** In no event shall the author be liable for any direct, indirect, incidental, or consequential damages arising from the use, interpretation, or inability to use the software.

## ⚖️ Copyright, License, and Bot Protection

**Copyright (c) 2026 Martin Balogh. All rights reserved.**

By default, this repository is **strictly protected** (*All Rights Reserved / Proprietary*).

### 🛡️ Why this strict legal framework?
The primary goal of this restrictive license is the **protection of the project from automated data harvesting bots, web scrapers, and AI-training algorithms**. Unauthorized mass mirroring, scraping, or utilizing the code to train machine learning models is strictly prohibited.

### 🤝 Personal Inquiries (Human Openness)
**For genuine, personal inquiries, I am very happy to open everything up!** If you are a human interested in the code—whether for journalism, academic research, educational purposes, or collaboration—please reach out directly. I will gladly provide full access and usage permissions.

* **ALLOWED:** Human reading and studying of the code on the GitHub interface.
* **PROHIBITED (without prior agreement):** Copying, modifying, republishing, or integrating the code into news portals or external software without explicit permission.

**Contact:** [Martin Balogh on LinkedIn](https://www.linkedin.com/in/martin-balogh-068176300/)

---

# 🇭🇺 Magyar verzió

Ez a repozitórium egy önálló, interaktív webes widget (`HTML/CSS/Vanilla JS`) forráskódját tartalmazza, amely a Nagy Nyelvi Modellek (LLM) promptjainak, csatolmányainak és multimodális kimeneteinek becsült ökológiai lábnyomát (energia- és vízfogyasztását) számítja ki.

A projekt adatújságírási és edukációs demonstrációs célokra készült, hogy kézzelfoghatóvá tegye a mesterséges intelligencia valós fizikai terhelését – 100%-ban kliensoldalon futva, valós API-hívások és külső függőségek nélkül.

---

## ✨ Főbb funkciók

* **Determinisztikus heurisztikai motor:** Ugyanarra a bemenetre mindig pontosan ugyanazt az eredményt adja nyelvészeti szándékpredikcióval és 32 bites **FNV-1a** hash-sel – véletlenszerű találgatás és élő LLM API-hívások nélkül.
* **Három modellszint:** Összehasonlítható a **Könnyű** (Dense), a **Közepes** (MoE) és a **Gondolkodó** (MoE + rejtett Chain-of-Thought érvelési lánc) kategóriák fogyasztása.
* **Csatolmány (RAG) és multimédia szimuláció:** Kezeli a csatolt kontextus méretét (*Cikk*, *Kis PDF*, *Nagy PDF*, *Könyv*) prompt-caching kedvezménnyel, valamint a multimodális kimeneteket (*Kép*, *Podcast*, *HD Videó*).
* **6 fizikai egyenérték:** A Watt-órában és milliliterben kapott értéket hétköznapi példákra fordítja le (adatközponti hűtővíz, telefontöltés %, 10W-os LED izzó, víztisztítás, HD streamelés, vízforralás).
* **Kliensoldali PNG és animált GIF export:** `1080px` széles infografikát készít statikus PNG vagy 25 fps-es animált GIF formátumban a beágyazott `gif.js` + izolált Web Worker (`<script type="javascript/worker">`) segítségével, Web Share API, vágólap-másolás és automatikus letöltés támogatással.
* **Önálló és reszponzív `<iframe>` beágyazható mód:** Használható önálló oldalként (sötét/világos témaváltóval) vagy cikkekbe ágyazva automatikus `<iframe>`-detektálással, illetve `?embed=1` paraméterrel.

---

## ⚙️ Működési elv és Tudományos Konstansok

Minden számítási állandó központosítva található az [`index.html`](index.html) `ECO_CONSTANTS` és `MEDIA_ENERGY_TAX_WH` objektumaiban:

* **Tokenszámítás (BPE közelítés):** Magyar nyelvtanra optimalizált becslés (`max(ceil(karakter / 2.2), ceil(szó * 2.7))`), Unicode-biztos szándékpredikciós regexekkel (`\p{L}`) és determinisztikus FNV-1a szórással (`-25`..`+25` token).
* **Prefill és Decode energia:**
  * Prefill: `6.05e-5 Wh/token`, szorozva az aktív paraméteraránnyal (`1.0` Dense Könnyűnél; `0.5` MoE Közepes/Gondolkodónál), csatolt dokumentumoknál `0.3x` Prompt Caching kedvezménnyel (`70%` megtakarítás).
  * Decode: `0.04` (Könnyű), `0.16` (Közepes) és `0.25` (Gondolkodó) `Wh / 1000 token`, aktív paraméteraránnyal súlyozva. A Gondolkodó mód rejtett érvelési szorzókat alkalmaz (`10x` alap, `30x` közepes, `80x` komplex logikai/kódolós kérésnél).
  * Hardveres hatásfok: a nyers számítási igényt osztjuk az `MFU = 0.45` (Model FLOPs Utilization) értékkel.
* **Multimodális médiaadó:** Kép (`+2.9 Wh`), Podcast/TTS (`+2.0 Wh`), HD Videó (`+25.0 Wh`).
* **Adatközponti PUE és bifurkált WUE:**
  * `PUE_EU = 1.15` szorzó a teljes szerverenergiára (`totalEnergyWh = serverEnergyWh * 1.15`).
  * A vízlábnyom az európai átlagos nedves hőmérsékleten (`T_w = 15.0 °C`) alapuló négyzetes helyszíni párologtatásból (`~0.866 mL/Wh`) és a közvetett hálózati vízterhelésből (`WUE_OFFSITE_EU = 0.5 mL/Wh`) áll össze, összesen `~1.37 mL/Wh` szerverenergia-arányos vízfelhasználással.
* **Fizikai egyenértékek:** Okostelefon-töltés (`22.5 Wh`), 10W LED (`10 Wh/óra`), Vezetékes víztisztítás (`1.0 Wh/liter`), HD Stream (`1.25 Wh/perc`), Teaforralás (`25 Wh` / 250 ml).

---

## 🛡️ Architektúra, Adatvédelem és Biztonság

* **Egyetlen önálló HTML fájl:** Nincs build lépés, nincs külső CDN, nincsenek sütik, analitikák vagy szerveroldali hívások.
* **DOM és XSS higiénia:** 0 `innerHTML` és 0 `eval` hívás; minden dinamikus érték `.textContent`-en vagy Canvas `fillText`-en keresztül jelenik meg.
* **Cross-origin `<iframe>` védelem:** `try/catch`-be csomagolt `localStorage`, tiltott `window.alert()` helyett beépített ARIA értesítősáv (`#statusNotice`), valamint `type="javascript/worker"` alá izolált GIF worker.
* **DoS és renderelési korlátok:** `5000` karakteres limit beillesztés-figyeléssel, automatikusan méreteződő prompt mező (`90px–360px`), emoji-biztos bináris kereséses Canvas sortördelés (`Array.from`) max. `10` sorra korlátozva (`<= 1700px`), automatikus betűméretezés (`fitFontSize`), 45 mp-es GIF worker időkorlát és Blob URL takarítás.

---

## 🖼️ Beágyazás `<iframe>`-be (CMS / Cikk integráció)

A widget `<iframe>`-ben vagy `?embed=1` paraméterrel automatikusan aktiválja a beágyazott módot (`html.is-embedded`): eltávolítja a külső margót/árnyékot, fix világos (`#ffffff`) felületre vált, elrejti az önálló témaváltó gombot, és `postMessage`-en kommunikálja a méretváltozásokat (`eco-calc-resize`, `eco-calc-ping`, valamint egyszeri `eco-calc-scroll-to`).

*(A beágyazó HTML + `<script>` kódrészlet a fenti angol szekcióban található, `data-eco-calc-embed` attribútummal és dinamikus script-injektálás-kompatibilis `ping` válasszal.)*

---

## 🚀 Helyi futtatás

Indíts egy egyszerű statikus szervert a projekt mappájában (a Blob Web Worker és a vágólap/megosztás API-k miatt HTTP(S) origin szükséges):

```bash
python3 -m http.server 8080
```

Ezután nyisd meg a `http://127.0.0.1:8080/` (önálló) vagy `http://127.0.0.1:8080/?embed=1` (beágyazott előnézet) címet.

---

## ⚠️ Jogi Nyilatkozat és Felelősségkizárás (Disclaimer)

**FIGYELEM:** A repozitóriumban található számítási modellek és kódok kizárólag tájékoztató jellegűek.

1. **Számítások pontossága:** A generált értékek publikus kutatási adatokra és iparági becslésekre épülnek. A tényleges adatközponti fogyasztás a hardverarchitektúrától, a hűtési megoldásoktól és a földrajzi lokációtól függően eltérhet. A szerző nem vállal felelősséget a kalkulációk abszolút pontosságáért.
2. **"AS IS" (Ahogy van) záradék:** A szoftvert "AHOGY VAN" állapotban biztosítjuk, mindennemű kifejezett vagy hallgatólagos garancia nélkül.
3. **Kártérítés kizárása:** A szerző semmilyen körülmények között nem tehető felelőssé a szoftver használatából, félreértelmezéséből vagy működésképtelenségéből eredő közvetlen, közvetett vagy következményes károkért.

## ⚖️ Szerzői jog, Licenc és Botvédelem

**Copyright (c) 2026 Balogh Martin. Minden jog fenntartva.**

Ez a repozitórium alapértelmezetten **szigorúan jogvédett** (*All Rights Reserved / Proprietary*).

### 🛡️ Miért ez a szigorú jogi keret?
A korlátozó licencelési forma elsődleges célja a projekt **védelme az automatizált adatgyűjtő botoktól, webes kaparóktól (scrapers) és MI-betanító algoritmusoktól**. Szigorúan tilos a kód engedély nélküli tömeges tükrözése, scrapingje vagy gépi tanulási modellek tanítására való felhasználása.

### 🤝 Személyes megkeresések (Emberi nyitottság)
**Valódi, személyes megkeresés esetén nagyon szívesen megnyitok mindent!** Amennyiben emberként érdeklődsz a kód iránt – legyen szó újságírásról, egyetemi kutatásról, oktatási felhasználásról vagy közös továbbfejlesztésről –, keress meg közvetlenül, és örömmel biztosítok teljes körű hozzáférést, illetve felhasználási engedélyt.

* **ENGEDÉLYEZETT:** A kód emberi olvasása és tanulmányozása a GitHub felületén.
* **TILOS (előzetes egyeztetés nélkül):** A kód másolása, módosítása, újra-publikálása, hírportálokon vagy külső szoftverekben való engedély nélküli integrálása.

**Kapcsolat:** [Balogh Martin a LinkedIn-en](https://www.linkedin.com/in/martin-balogh-068176300/)
