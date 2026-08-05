# Flugspiel im Web veröffentlichen (Android & Desktop)

Das Spiel ist reines HTML/WebGL und läuft in **jedem modernen Browser** — auch auf Android.
Zum Teilen mit Freunden brauchst du nur einen Web-Hoster und einen Link.

- **Steuerung auf dem Handy:** per **Bluetooth-Controller** (z.B. 8BitDo mit dem Handy koppeln).
  Eine Touch-Steuerung gibt es (noch) nicht.
- **Der Ordner `web/` enthält die vollständige Base64-Version** (~82 MB, alle Modelle eingebettet).
  Sie ist identisch zur Doppelklick-Version und **läuft sowohl per `file://` (Doppelklick) als auch
  online über `http(s)://`** — kein Server-Setup, keine Kompression, kein DRACO nötig.
  **Hochgeladen wird der Inhalt von `web/`.** (82 MB sind für GitHub Pages, das 1 GB erlaubt, problemlos.)

> Hinweis: Es gab kurzzeitig eine schlanke DRACO-Variante. Die lädt Modelle per Netzwerk und
> funktioniert NICHT per Doppelklick (file:// blockiert die Requests). Deshalb wird bewusst die
> einfache Base64-Version verwendet — die läuft überall.

---

## Weg A — GitHub Pages (empfohlen, kostenlos, 1 GB)

**✅ Bereits eingerichtet & live:** Der `web/`-Inhalt wurde nach
**https://github.com/workFLOw42/flightsimulator** gepusht und GitHub Pages ist aktiviert.
→ Spiel-Link zum Teilen: **https://workflow42.github.io/flightsimulator/Flugspiel.html**

Die folgenden Schritte sind nur die Referenz, falls du es erneut/woanders einrichten willst.

1. **Inhalt von `web/` hochladen** (NICHT den Ordner `web` selbst, sondern seinen *Inhalt*):
   - Bequem im Browser: Repo öffnen → „Add file“ → „Upload files“ → alle Dateien + Ordner
     aus `web/` (`Flugspiel.html`, `three.min.js`, `GLTFLoader.js`, `DRACOLoader.js`, `sounds.js`,
     sowie die Ordner `models/` und `draco/`) reinziehen → „Commit changes“.
   - Oder per Git (aus dem `web/`-Ordner heraus ausführen):
     ```
     git init
     git add .
     git commit -m "Flugspiel Web"
     git branch -M main
     git remote add origin https://github.com/workFLOw42/flightsimulator.git
     git push -u origin main
     ```
2. **Pages aktivieren**: Repo → Settings → Pages → Source: „Deploy from a branch“ → Branch `main`,
   Ordner `/ (root)` → Save.
3. Nach 1–2 Minuten ist es live unter:
   **`https://workflow42.github.io/flightsimulator/Flugspiel.html`**
   → Diesen Link kannst du sofort teilen. (GitHub schreibt den Namen in der URL klein.)

### Eigene Domain greiffert.net anbinden (optional)
GitHub Pages erlaubt eine eigene Domain. Beispiel für die Subdomain `spiel.greiffert.net`:

1. **Bei GitHub**: Repo → Settings → Pages → „Custom domain“ → `spiel.greiffert.net` eintragen → Save.
   (Legt automatisch eine Datei `CNAME` im Repo an.)
2. **Bei Strato** (DNS-Einstellungen deiner Domain): einen **CNAME-Record** anlegen:
   - Name/Host: `spiel`
   - Ziel/Wert: `workflow42.github.io`
3. 10–60 Min warten (DNS-Verbreitung). Danach in GitHub Pages „Enforce HTTPS“ aktivieren.
   → Spiel läuft unter `https://spiel.greiffert.net/Flugspiel.html`.

Für die **nackte** Domain `greiffert.net` (ohne `spiel.`) statt CNAME vier **A-Records** auf GitHubs
IPs setzen: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
(Subdomain per CNAME ist einfacher — Empfehlung.)

---

## Weg B — Netlify (noch einfacher, ohne Git)

1. Auf netlify.com mit GitHub-Account anmelden.
2. „Add new site“ → „Deploy manually“ → den **Inhalt von `web/`** ins Fenster ziehen (Drag & Drop).
3. Sofort live unter `https://zufallsname.netlify.app`. Umbenennen unter Site settings → „Change site name“.
4. Eigene Domain: Site settings → Domain management → `spiel.greiffert.net` → bei Strato den von
   Netlify angezeigten CNAME setzen. Updates = einfach neuen `web/`-Inhalt erneut reinziehen.

---

## Weg C — Strato-Webspace (nur wenn genug Platz)

Dein aktueller Strato-Tarif (0,99 €/Monat Domain) hat **nur 5 MB Webspace** — das reicht **nicht**
(die Modelle allein sind ~5,7 MB). Erst nutzbar, wenn du ein Hosting-Paket mit mehr Platz dazubuchst.
Dann per FTP (z.B. FileZilla) den **Inhalt von `web/`** in den Webspace laden. Weg A oder B sind
für dich die bessere, kostenlose Wahl.

---

## Nach dem Hochladen testen (Handy)
1. Link im Handy-Browser (Chrome) öffnen — Ladebalken erscheint, dann startet das Spiel.
2. Bluetooth-Controller mit dem Handy koppeln (Android-Einstellungen → Bluetooth), eine Taste drücken
   → Ton + Steuerung aktiv.
3. **„Zum Startbildschirm hinzufügen“** (Chrome-Menü) → startet danach im Vollbild wie eine App.

## Updates einspielen
Spiel geändert (im Hauptordner) → die betroffene Datei in `web/` aktualisieren, dann aus dem
`web/`-Ordner: `git add -A && git commit -m "update" && git push`. GitHub Pages baut automatisch neu
(1–2 Min). Meist genügt `web/Flugspiel.html`; nur wenn sich Modelle/Sounds ändern, auch `web/models/`
bzw. `web/sounds.js` neu erzeugen.

## Technisches (wie die Web-Version entstand)
- Modelle aus `_quellen/*.glb` mit **`gltf-transform optimize --compress draco --texture-compress webp`**
  komprimiert (74 MB → 5,7 MB, ~13×) → `web/models/*.glb`.
- `web/Flugspiel.html` lädt sie per `GLTFLoader.load(URL)` + **DRACOLoader** (Decoder lokal in `web/draco/`).
- three.js r128 unterstützt Draco + WebP-Texturen; `KHR_materials_specular` (nur Träger) wird ignoriert (unkritisch).

---

## PWA — als App installieren (offline-fähig)

Das Spiel ist eine **PWA**: über den GitHub-Pages-Link lässt es sich wie eine App
installieren (eigenes Icon, Vollbild) und läuft nach dem ersten Spielen **offline**.
Dateien im `web/`-Ordner: `manifest.json`, `sw.js` (Service Worker),
`icon-192.png`, `icon-512.png`, `icon-maskable-512.png` sowie die Einbindung im
`<head>` von `Flugspiel.html` + Service-Worker-Registrierung.

- **Braucht HTTPS:** funktioniert nur über `https://...` (GitHub Pages), **nicht** per
  Doppelklick (`file://`). Bei `file://` wird der Service Worker still übersprungen —
  das Spiel läuft dort aber normal weiter.
- **Cache-Strategie:** Beim Installieren werden nur die kleinen Kern-Dateien sofort gecacht.
  Die großen `*_glb.js`-Modelle (~80 MB) werden **beim ersten Spielen** nachgeladen und
  gecacht — so kann die Installation nicht an der Datenmenge scheitern.

### Installieren (Handy, Chrome)
1. Link öffnen: `https://workflow42.github.io/flightsimulator/Flugspiel.html`
2. Chrome-Menü → **„App installieren"** → startet danach mit Icon im Vollbild.
3. Einmal spielen (lädt Modelle in den Cache) → danach offline spielbar.

### WICHTIG bei Updates
Wenn du Spiel-Dateien aktualisierst, in `web/sw.js` die Zeile
`const CACHE = 'flugspiel-v1';` **hochzählen** (`v2`, `v3`, ...). Sonst zeigen bereits
installierte Geräte weiter die alte, gecachte Version.
