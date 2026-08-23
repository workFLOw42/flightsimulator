# X-Wing & Weltraum-Modus — Umsetzungsplan

Arbeitsdokument für das Weltraum-Feature. **Quelle der Wahrheit für den Stand** — nach jeder
Etappe wird die Checkliste hier nachgezogen und mitcommittet.

## Ziel

Ein spielbarer X-Wing, der senkrecht startet, die Erde verlassen kann, im Hyperraum zum Mond
fliegt und dort landet. Mars und Sonne kann er umkreisen.

### Festgelegte Entscheidungen

- Umsetzung in **3 Etappen**, jeder Stand einzeln getestet und committet.
- Erde verlassen: **kein Portal-Ereignis**, sondern ein sanfter Übergang Himmel → Weltall.
- **0 % Schub = Antrieb aus** → der X-Wing fällt und kann abstürzen.
- Mars/Sonne: **nur umkreisen** (Orbit), Landung dort später. Berührung wird sanft abgefangen.
- Der Spacedrive-Torus wird **nicht** Durchflug-Tor, sondern Hyperraum-Visual (Röhre um den Flieger).

## Status

- [x] **Etappe 1** — X-Wing als spielbares Modell mit VTOL (Erde) — *fertig 23.08.2026*
- [x] **Etappe 2** — Weltall-Übergang, Erdkugel, Mondlandung — *fertig 23.08.2026*
- [x] **Etappe 3** — Hyperraum, Mars, Sonne — *fertig 23.08.2026*
- [x] **Phase 4** — Asteroiden und Laser im Weltall — *fertig 23.08.2026*

---

## Vermessene GLB-Quellen (`_quellen/`, Stand 23.08.2026)

Gemessen mit `glbinfo.js`/`glbdeep.js` (Struktur, Weltkoordinaten-BBox, Achsprofil, Radiusschale).
Alle sind Sketchfab-Exporte ohne Draco. Der mitgelieferte `GLTFLoader.js` kann alle benötigten
Extensions (`KHR_materials_pbrSpecularGlossiness`, `_unlit`, `_transmission`, `_clearcoat`).

| Datei | MB | Tris | Größe / Form | Texturen | Wichtig |
|---|---|---|---|---|---|
| `xwing_2.0_by_GaryPhelps` | 2,52 | 37.889 | 4,79 × 1,59 × 5,98 | 7× 1024² (982 KB) | **Nase auf +Z**, Spannweite auf X (wie Mustang) → `GLB_ROT = Math.PI`. `Object_5`/`blinn5SG` = 4 emissive Düsen bei z ≈ −4,7 |
| `earth_by_Akshat` | 0,73 | 5.888 | Kugel r = 100 | 1024×512 JPEG | specGloss **required** |
| `moon_by_Akshat` | 0,56 | 5.888 | Kugel r = 100 | 1024×512 JPEG | geometrisch identisch zu earth/mars |
| `mars_by_Akshat` | 0,58 | 5.888 | Kugel r = 100 | 1024×512 JPEG | geometrisch identisch zu earth/moon |
| `sun_by_SebastianSosnowski` | 2,02 | 7.936 | 2 Schalen r = 10,0 / 10,1 | 3× (1,8 MB) | Rotations-Animation 33,3 s, emissive, transmission |
| `…stars_by_AjaxGb` | 0,09 | 1.560 | **exakte Kugelschale r = 100,00** | keine | unlit + doubleSided → idealer Sternen-Dome |
| `moon_-_giordano_bruno_crater` | 3,47 | 2.971 | **2999 × 295 × 2999** | 3× 1024² (3,4 MB) | Terrain-Patch, ±60 m Relief. Ränder **nicht** kachelbar → Mirror-Tiling nötig. Mesh `Bruno_LP_2_0` = schwarzer Sockel bis y = −245, verwerfen |
| `spacedrive_by_tamminen` | 2,19 | 44.506 | liegender Torus Ø 76, Röhre Ø 16 | 256² PNG | freie Öffnung ~60 m, blau-violett emissive, Animation 20,8 s |

Kachel-Messung des Kraters (Randhöhen): x=min ⌀ −13,2 · x=max ⌀ −31,8 · z=min ⌀ −8,6 ·
z=max ⌀ −14,6 — gegenüberliegende Ränder passen nicht zusammen (bis ~60 m Sprung).
Bei Spiegelung jeder zweiten Kachel trifft jeder Rand auf sich selbst → nahtlos.

---

## Arbeitsweise (gilt für alle Etappen)

- Änderungen an Dateien in diesem Repo **per PowerShell**: lesen → `.Replace` mit
  `count == 1`-Eindeutigkeitsprüfung → `[IO.File]::WriteAllText` → gegenlesen. Die Write/Edit-Tools
  fallen im Google-Drive-Ordner aus. Zeilenenden (CRLF) vorher prüfen.
- Neue `*_glb.js` in `C:\tmp` bauen (GLB → base64 → `window.XXX_GLB = "data:model/gltf-binary;base64,…"`,
  Format wie `alphajet_glb.js`), dann `Copy-Item -Force` ins Repo.
- `sw.js` **nicht anfassen** — die Cache-Version zählt der pre-commit-Hook hoch. Die Strategie ist
  cache-first mit Nachfüllen, neue GLB brauchen dort keinen Eintrag. Nötig ist nur ein
  `<script src="…_glb.js">` in `Flugspiel.html`.
- Nach jeder Etappe: Hilfe-Overlay (`#hint`) und `README.md` nachziehen, Status hier abhaken, committen.

---

## Etappe 1 — X-Wing als spielbares Modell mit VTOL

Alles in `Flugspiel.html` + neue `xwing_glb.js`. Nutzt die bestehende GLB-Pipeline
(`preloadGLB`) unverändert.

**Einbinden**
- `MODEL_NAMES` += `'XWing'`.
- `GLB_CONFIG.XWing = { data: () => window.XWING_GLB, span: 12.5, yOff: 0 }` — normiert wird auf
  `max(size.x, size.z)`, beim X-Wing ist das die **Länge** (5,98); 12,5 ergibt ~10 m Spannweite.
- `GLB_ROT.XWing = Math.PI` (Nase +Z → Spielkonvention −Z). `TRAFFIC_ROT`/`FLEET_MODELS` bleiben
  unberührt — kein KI-X-Wing.
- `CAM_CFG.XWing = { dist: 1.1, hgt: 1.0 }`.
- `soundUrlFor`: X-Wing auf den Turbinen-Sound (`FMS_SND['Airbus']`, wie AlphaJet).
- `findStart`: X-Wing in den Default-Zweig (Landebahn). Senkrechtstart klappt von Bahn **und**
  Deck, weil die VTOL-Logik ortsunabhängig ist.

**Flugeigenschaften** (`PLANE_SPECS`) — Flugverhalten wie AlphaJet/Mustang, plus VTOL-Flag:

```js
XWing: { vTO: 55, vMax: 361, accel: 28, pitch: 1.9, roll: 3.8, turn: 1.6,
         aero: true, maxAlt: 3000, vtol: true },
```

**VTOL-Schubstufen** — neuer Block in `stepPhysics`, greift nur bei `spec.vtol`:

| Schub | Verhalten |
|---|---|
| 0 % | Antrieb aus: freier Fall, Gravitation, Crash-Gefahr (kein VTOL-Eingriff) |
| 10 % | saubere Senkrechtlandung: Sinkrate auf −4 m/s geregelt, Nase/Querlage sanft auf 0 |
| 20 % | senkrecht steigen: +6 m/s, Horizontalfahrt auf ~0 gedämpft |
| 25 % | Übergangszone (Steigen klingt aus, Vorwärtsschub setzt ein) |
| ≥ 30 % | normaler Vorwärtsflug wie AlphaJet (unveränderter Code) |

Im VTOL-Bereich (`0 < throttle < 0.30`) wird `state.vel.y` direkt auf die Zielrate geregelt
statt Gravitation zu integrieren; Stall-Block und Abhebe-Sperre werden übersprungen.

**Landen überall** — `canLandHere` gibt für `'XWing'` immer `true` (Bahn, Gras, Deck, Wasser).
Gebäude/Hügel bleiben über `hitsBuilding` tödlich (gewollt). Im Aufsetz-Check wird der
`hardLand`-Test bei VTOL-Landung (`throttle ≤ 0.1`) übersprungen.

**HUD/Hilfe** — im `#status`-Feld die VTOL-Phase als Symbol (⬆️ steigen · ⬇️ sinken · 🛬 Landung ·
🚀 Vorwärtsflug); im Hilfe-Overlay eine X-Wing-Zeile mit der Schubstufen-Tabelle.

**Test** — `M`/`Y` bis XWing → 20 %: steigt senkrecht von der Bahn · 30 %: fliegt vorwärts ·
10 %: setzt sauber auf (Wiese, Wasser, Trägerdeck) · 0 % in der Luft: fällt und crasht.

### Stand: erledigt (23.08.2026)

Umgesetzt wie geplant, plus zwei Korrekturen, die beim Nachrechnen der Physik nötig wurden:

1. **Vortrieb, Schwerkraft und Auftrieb werden im VTOL-Anteil ausgeblendet** (`vtolRest`-Faktor auf
   `push`, `GRAV` und Auftrieb). Ohne das hätte der Schub bei 20 % weiter auf 72 m/s Zielfahrt
   beschleunigt — der „Senkrechtstart" wäre nach vorne weggeflogen, und die Schwerkraft hätte die
   Steigrate auf ~3,6 m/s verfälscht.
2. **Die Ruderwirksamkeit (Geschwindigkeit folgt der Nase) ist im VTOL-Anteil ebenfalls aus.** Sie
   hatte die senkrechte Fahrt in die waagerechte Nasenrichtung gezogen: 12,9 km/h Drift und
   5,31 statt 6,00 m/s Steigrate.

Verifiziert mit einer numerischen Nachrechnung der kompletten Frame-Kette (`C:\tmp\vtolsim.js`,
Schubmodell → vCap → Höhendeckel → Ruderwirksamkeit → VTOL-Regelung → Integration):

| Fall | Ergebnis |
|---|---|
| 20 % vom Boden, 10 s | +58,9 m Höhe, vy = **6,00 m/s**, Drift **0,0 m** |
| 10 % aus 200 m | vy = **−4,00 m/s**, driftfrei, setzt nach ~50 s sauber auf |
| 10 % aus 400 km/h Vorwärtsflug | nach 5 s nur noch 0,28 m/s Restfahrt, sinkt mit 4,00 m/s |
| 25 % (Übergang) | +2,2 m/s steigen bei 24 m/s Fahrt |
| 30 % | 108 m/s vorwärts (= 30 % von vMax), Höhe hält |
| 0 % aus 500 m | fällt, Stall-Flag gesetzt → Bodenkontakt ergibt Absturz |
| Höhendeckel 3000 m | riegelt sanft bei 2987 m ab |

### Nachjustierung nach dem ersten Testflug (23.08.2026)

Rückmeldung: Landung darf schneller gehen, der X-Wing soll schneller sein, und im Strömungsabriss
soll er richtig sinken — „nur weil er 0 km/h vorwärts hat, sinkt er doch nicht nur mit ein paar
Metern die Sekunde" (gilt für **alle** Flugzeuge).

**Geändert**

| Was | Wert |
|---|---|
| Senkrecht steigen / sinken | 10 m/s statt 6 / 4 (`VTOL_CLIMB`, `VTOL_SINK`) |
| X-Wing `vMax` | 686 m/s → Schallmauer genau bei 50 % Schub, Mach 2 bei 100 %, 80 % = Mach 1,6 |
| X-Wing `accel` | 60 m/s² (war 28), sonst dauert Vollgas zu lange |
| Kamera | zieht bei hoher Fahrt straffer nach (sonst 190 m Rückstand bei Mach 2) — betrifft alle Modelle |
| Strömungsabriss | fällt jetzt wirklich (siehe unten) |

**Warum der Sturz so hartnäckig war** — drei Ursachen, alle erst durch die Nachrechnung sichtbar:

1. Der Zielgeschwindigkeits-Regler bremste bei 0 % Schub mit bis zu `accel` (60 m/s²!) **entgegen der
   Nase**. Zeigte die Nase nach unten, wirkte diese „Bremse" nach oben und fing den Sturz auf.
   → Bremsen wirkt jetzt wie Luftwiderstand: entgegen der **Fahrt** und nur **waagerecht**.
2. Selbst dann blieb der Sturz bei ~25 m/s stehen: die Ruderwirksamkeit lenkte die Sinkfahrt in die
   Waagerechte, wo die Bremse sie sofort vernichtete — ein Kreisprozess.
   → Die Bremse blendet mit steigender Sinkrate aus (voll bis −4 m/s, ab −12 m/s gar nicht mehr).
   Der Umkehrschub (A/C) bremst weiterhin immer.
3. Der Abriss flackerte: die wachsende Sinkfahrt zählt als „Fahrt", also endete er sofort wieder.
   → Hysterese: Einstieg bei 20 % der Abhebegeschwindigkeit, Ausstieg erst bei 50 %. Dazu im Abriss
   kein Auftrieb mehr (physikalisch korrekt).

**Nachgerechnet** (`C:\tmp\vtolsim5.js`) — Motor aus in 1000 m, Sinkrate nach 5 / 10 s:

| Modell | Sinkrate | Aus 300 m am Boden |
|---|---|---|
| X-Wing | 60 → 103 m/s | 7,0 s |
| Alpha-Jet | 56 → 99 m/s | 7,5 s |
| Airbus | 58 → 101 m/s | 7,4 s |
| Mustang | 44 → 82 m/s | 8,6 s |
| Canadair / Transall | 38 → 66 m/s | 9,6 s |

Vorher: 8–25 m/s, dauerhaft konstant (Schweben statt Absturz).

Gegenproben, die unverändert bleiben mussten und es tun: Reiseflug hält Höhe und Zielgeschwindigkeit
exakt (alle sechs Modelle), Abbremsen im Waagerechtflug greift wie vorher, der Landeanflug mit 30 %
Schub bremst weiter sauber ein, und der X-Wing-VTOL ist unberührt.

---

## Etappe 2 — Weltall-Übergang, Erdkugel und Mondlandung

**Ortszustand** `let locale = 'earth' | 'space' | 'moon'` als einzige neue globale Weiche.
Erdwelt-Funktionen (`isOnLand`, `isOnRunway`, `carrierAt`, `updateIslands`, `updateSea`) laufen
nur bei `locale === 'earth'`; die Boden-/Landelogik in `stepPhysics` verzweigt pro Ort.
Wolken/Verkehr/Meer werden beim Verlassen ausgeblendet.

**Höhengrenzen** `ATMO_TOP = 3000` (Verdunkeln beginnt), `SPACE_Y = 9000` (Weltall erreicht).
Der Deckel `spec.maxAlt` greift beim X-Wing nur bei `throttle < 0.8` → „Erde verlassen ab 80 %".

**Sanfter Übergang** (`updateSpaceBlend()`, aus `loop` aufgerufen): über
`f = clamp((y − ATMO_TOP) / (SPACE_Y − ATMO_TOP), 0, 1)` werden `scene.background` und
`scene.fog.color` von Himmelblau nach Schwarz interpoliert, die Fog-Reichweite aufgezogen,
Hemisphere- und Sonnenlicht heruntergefahren, Sterne-Dome eingeblendet, Erdkugel eingeblendet.

**Kamera** `far` 8000 → 120000 und Renderer mit `logarithmicDepthBuffer: true` — sonst
Z-Fighting bei diesem Distanzverhältnis.

**Himmelskörper** (neue `earth_glb.js`, `moon_glb.js`, `stars_glb.js`; Preload analog `preloadFord`)
- **Sterne-Dome**: Kugelschale r=100 → r=40000, unlit/doubleSided, `depthWrite:false`, folgt
  `state.pos`, Opacity aus `f`.
- **Erdkugel**: r=100 → `EARTH_R = 6000`, Zentrum `(exitX, −EARTH_R, exitZ)` mit dem gemerkten
  Austrittspunkt. Wiedereintritt beim Sinken unter `SPACE_Y` setzt den Flieger an dieses x/z zurück.
- **Mondkugel**: `MOON_R = 2500`, Zentrum `(exitX + 25000, 30000, exitZ)`. Unter
  `MOON_R + 1500` Abstand wechselt `locale` auf `'moon'`.

**Mondoberfläche** (Kern der Etappe)
- **Mirror-Tiling**: `scale.x/z = ±1` je Kachelparität → jeder Rand trifft auf sich selbst, nahtlos.
  Material dafür auf `THREE.DoubleSide` (negative Skalierung dreht das Winding).
- Mesh `Bruno_LP_2_0` (schwarzer Sockel) beim Aufbau verwerfen.
- 3×3 Kacheln um den Spieler, recycelt nach dem Muster von `updateIslands`.
- **Höhenfeld**: beim Preload einmal 96×96 Punkte per `THREE.Raycaster` von oben auf eine Kachel
  → `Float32Array`. `moonHeightAt(x,z)` mit Mirror-Mapping und bilinearer Interpolation ersetzt
  `GROUND_Y`, wenn `locale === 'moon'`.
- Mond-Himmel: schwarz, Sterne an, Erdkugel klein am Himmel, kein Meer/keine Inseln.
- Rückflug: über 4000 m Terrainhöhe → zurück nach `'space'` an der Mondkugel-Oberfläche.

**Test** — mit 100 % steil steigen → Himmel dunkelt, Sterne kommen, Erde wird Kugel · Richtung
Mond → Mondmodus, Landung im Krater · hochsteigen → zurück in den Weltraum · absinken → flache
Erdwelt am Austrittspunkt.

### Stand: erledigt (23.08.2026)

Umgesetzt wie geplant. Abweichungen und Ergänzungen:

- **Kein Rückrechnen auf den Austrittspunkt nötig.** Die x/z-Koordinaten laufen durch alle Orte
  durch — die Inselwelt ist unendlich, also taucht man einfach dort wieder ein, wo man absinkt.
  Der Plan sah ein Zurücksetzen auf den Austrittspunkt vor; das wäre überflüssige Mechanik.
- **Schwerkraft pro Ort** (`GRAV_AT`): Erde 9,81 · Mond 1,62 (ein Sechstel) · Weltall 0. Weil der
  gedeckelte Auftrieb im Spielmodell mit der Schwerkraft skaliert, bleibt das Flugverhalten stimmig —
  auf dem Mond fühlt sich alles nur leichter an.
- **Eine gemeinsame Bodenfunktion** `surfaceY(x,z)` ersetzt die drei Stellen, an denen die
  Oberflächenhöhe getrennt berechnet wurde (Meer / Insel / Trägerdeck), und liefert jetzt auch den
  Mondboden bzw. „kein Boden" im Weltall.
- **Strömungsabriss, Gebäudekollision, Meer, Inseln, KI-Verkehr, Wolken und Bodenschatten** laufen
  nur noch in der Erdwelt. Beim Verlassen werden Inselzellen, Träger und Flotte abgeräumt, beim
  Zurückkommen neu aufgebaut (die Flotte spawnt von selbst nach).
- **Renderer** mit `logarithmicDepthBuffer`, Kamera-`far` 120000 — nötig, weil Mond (26 km) und
  Sternenkuppel (40 km) gleichzeitig mit nahen Flächen im Bild sind.

**Mondoberfläche — nachgemessen** (`C:\tmp\moonfield_check.js`, direkt aus der GLB-Geometrie):

| Prüfung | Ergebnis |
|---|---|
| Sockel-Mesh erkannt und verworfen | 304 Dreiecke raus, 2667 Terrain-Dreiecke bleiben |
| Höhenraster 96×96 (Raycast von oben) | alle 9216 Punkte treffen Geometrie, keine Löcher |
| Höhen | −72,4 m bis +49,1 m |
| **Naht bei Mirror-Tiling** | **0,000 m Höhensprung** an beiden Kachelgrenzen |
| Naht ohne Spiegelung (Gegenprobe) | 78,3 m Sprung — deshalb ist die Spiegelung zwingend |
| Rasterfehler gegen echte Geometrie | im Mittel 0,28 m, maximal 3,25 m (Rasterweite 31,6 m) |

Das Höhenraster wird beim Laden **eine Zeile pro Frame** ausgemessen (96 Frames ≈ 1,6 s), damit der
Spielstart nicht blockiert.

### Nachtrag: Schweben statt Dauersteigen (Rückmeldung aus dem Testflug)

Gemeldet: „Wenn man von 20 auf 30 % geht und er schon schwebt, senkt sich sofort die Nase und man
kracht in den Boden." Ursache: Beim Schweben hat er fast keine Fahrt — beim Umschalten auf 30 %
griffen deshalb sofort **Strömungsabriss** (Nase kippt auf −75°) und **fehlender Auftrieb**
(der hängt am Quadrat der Fahrt). Behoben:

1. **Repulsorlift**: solange der Antrieb läuft (> 0 %), trägt sich der X-Wing unabhängig von der
   Fahrt und hat **keinen Strömungsabriss**. Bei 0 % ist der Repulsor aus — dann fällt er wie jeder
   andere (so gewollt).
2. **20 % ist jetzt Schweben, nicht Dauersteigen**: er steigt auf **20 m über Grund** (Boden,
   Trägerdeck, Wasser, Mondkrater — über die gemeinsame Bodenfunktion) und bleibt dort stehen; ist er
   schon höher, hält er seine Höhe. Von selbst sinken tut er nie.

Nachgerechnet (`C:\tmp\vtolsim6.js`):

| Fall | Ergebnis |
|---|---|
| 20 % vom Boden | steigt auf exakt 20,0 m und bleibt dort |
| 20 % in 300 m Höhe | bleibt bei 299,7 m stehen (weder steigen noch sinken) |
| **schweben → 30 %** | **Höhe bleibt (119,7 m), Nase 0°**, beschleunigt waagerecht auf 741 km/h |
| schweben in 20 m → 30 % | Höhe bleibt 20,0 m, waagerecht auf 741 km/h |
| schweben → 50 % | Höhe bleibt, Fahrt geht auf 1235 km/h = Mach 1 |
| schweben → 10 % | sinkt mit 10 m/s und setzt sauber auf |
| schweben → 0 % | Repulsor aus, fällt mit 45 m/s, Nase −70°, Aufschlag |

---

## Etappe 3 — Hyperraum, Mars und Sonne

- **Hyperraum**: bei `throttle === 1` und `locale === 'space'` nach ~1,5 s Aufladung `vMax × 25`
  (≈ 9000 m/s). Visual: Spacedrive-Torus als Röhre um den Flieger mit Eigenrotation, plus
  Stern-Streifen. Neue `mars_glb.js`, `sun_glb.js`, `spacedrive_glb.js`.
- **Automatischer Austritt**: Abstand zum nächsten Himmelskörper < `R × 2.5` → Hyperraum aus,
  Schub automatisch auf 40 % → man sieht den Himmelskörper in Ruhe.
- **Mars** `MARS_R = 2000` bei ~60000. **Sonne** `SUN_R = 9000` bei ~100000, mit eigenem
  `PointLight` und emissivem Material; die GLB-Rotationsanimation wird durch `rotation.y += dt`
  ersetzt (billiger als ein `AnimationMixer`).
- **Orbit-Barriere**: Abstand < `R + 200` → radiale Geschwindigkeitskomponente auf 0, tangentiale
  erhalten → man gleitet sauber ab, kein Absturz.
- **Radar**: im Weltall Richtung zum nächsten Himmelskörper.

**Test** — im Weltall 100 % → Hyperraum mit Tunnel-Effekt · Anflug auf Mars/Sonne bremst
automatisch aus dem Hyperraum · einmal um beide herumfliegen, ohne hineinzufliegen.

### Stand: erledigt (23.08.2026)

Zusammen mit Etappe 3 sind die Rückmeldungen aus dem Weltall-Testflug eingeflossen.

**Korrekturen**

| Punkt | Umsetzung |
|---|---|
| Weltall soll früher beginnen | Übergang 3001–6000 m, Weltall ab **6000 m** (war 9000). Unter 80 % Schub riegelt der Höhendeckel des Modells weiter bei 3000 m ab — das ist die Grenze, nach der gefragt wurde |
| Nur der X-Wing gehört ins Weltall | **Modellwechsel** kehrt sofort zur Erde zurück |
| Reset startet immer auf der Erde | war schon so, bleibt |
| Keine Feuerwehr im Weltall | alle Feuerwehr-Aufrufe des Spielers laufen über `crashRescue()`, das nur in der Erdwelt ausrückt. Ohne sie läuft nur der Crash-Timer ab, dann Neustart auf der Erde |
| Keine Höhe im Weltall | HUD-Zeile wird dort ausgeblendet; auf dem Mond bleibt die Höhe über dem Kraterboden |
| Symbole größer | `#status` (dieselbe Zeile wie Wasser, Pakete, Menschen) auf 30 px — dort stehen jetzt auch Ort und X-Wing-Schubphase |
| Überschallknall im Vakuum | nur noch in der Erdwelt |

**Tempo im Weltall (Warp)**

- 100 % Schub = **Warp 1** (`SPACE_C` = 3000 m/s im Spielmaßstab). Wer 100 % hält, baut den Antrieb
  über 12 s bis **Warp 10** auf (30000 m/s); geht er vom Gas, fällt der Aufbau zurück.
- Der **sichtbare Hyperraum** hängt allein an der Geschwindigkeit und blendet gleitend ein (ab
  Warp 0,8 bis Warp 10) — kein Tor, kein Schalter, dieselbe Logik wie der Übergang Himmel → Weltall.
  Als Effekt sitzt der Spacedrive-Torus als leuchtende Röhre um den Flieger und dreht sich mit.
- Im Vakuum zieht der Antrieb mit voller Kraft durch, und die Bremse regelt wieder auf jeder Achse —
  die Sturz-Ausblendung gilt nur in der Atmosphäre.
- Das HUD zeigt im Weltall **Warp x,x** statt km/h.

**Himmelskörper** (Tabelle `BODY_DEFS`, vom Austrittspunkt aus in ihre Richtungen gesetzt)

| Körper | Radius | Entfernung | Scheinbare Größe | Verhalten |
|---|---|---|---|---|
| Mond | 12 km | 150 km | ~9° | landbar → Kraterlandschaft |
| Mars | 30 km | 400 km | ~8,6° | Orbit-Grenze bei Radius + 300 m |
| Sonne | 120 km | 900 km | ~15° | Orbit-Grenze, leuchtet selbst (emissiv) |

Die Orbit-Grenze nimmt nur die **radiale** Geschwindigkeit heraus und lässt die tangentiale stehen —
man gleitet also sauber am Körper vorbei und kann ihn umkreisen. Landungen auf Mars und Sonne sind
bewusst noch nicht dabei.

Dazu: Erdkugel auf 20 km Radius vergrößert (füllt beim Austritt den Blick nach unten), Sternenkuppel
auf 1200 km, Kamera-`far` auf 1600000. Das Radar zeigt im Weltall auf den nächstgelegenen
Himmelskörper.

---

## Phase 4 — Asteroiden und Laser im Weltall

Nachträglich gewünscht: „im weltall sollte der x wing orange laser abfeuern, die dann umherfliegende
asteroiden zerstören. laser feuer, nur einzelfeuer auf b und nur im wellall."

**Quelle**: `asteroid_01_by_exabyte.glb` — 600 Dreiecke, Ø ~230 m, 4,3 MB (davon fast alles Textur),
als `asteroid_glb.js` 5,7 MB base64. Beim Laden wird das Modell auf Durchmesser 2 normiert und
zentriert; die Skalierung einer Kopie **ist** damit ihr Radius, was die Trefferprüfung trivial macht.

**Umsetzung**

- **10 Asteroiden** gleichzeitig, Radius 60–200 m, Spawn 1,5–6 km vom Flieger mit Übergewicht nach
  vorne (damit man sie kommen sieht), Drift bis 80 m/s und Eigenrotation. Über 14 km Entfernung
  werden sie eingesammelt und neu gesetzt.
- **Nur im Weltall und nur unterhalb von Warp 1.** Im Hyperraum werden sie abgeräumt — bei 3000 m/s
  und mehr wäre Zielen Glückssache, und man würde sie nicht einmal sehen.
- **Laser auf B** (Tastatur `B` und Gamepad-B sind beide flankengesteuert, also von sich aus
  Einzelfeuer): zwei orangene Blitze von den Flügelspitzen, 2500 m/s **über** der Eigenfahrt,
  Lebensdauer 2,5 s, additiv gemischt und damit lichtunabhängig sichtbar.
- **Treffer**: Blitz gegen Asteroid als Kugelprüfung; der Brocken zerplatzt mit einer aufblühenden
  Leuchtkugel, das HUD zählt 💥 mit, der Controller vibriert kurz.
- **Rammen** zerstört den Asteroiden ebenfalls, **ohne** den Flieger zu beschädigen. Das war nicht
  ausdrücklich gefordert — ein Absturz wäre die Alternative, aber bei driftenden Brocken und hohem
  Tempo schnell frustrierend. Umzustellen ist es mit wenigen Zeilen.
- Im Weltall belegt B nur den Laser; die Erd-Aktionen (Wasser, Kisten, Schleudersitz) bleiben unberührt.

### Nachjustierung nach dem Weltall-Testflug (23.08.2026)

| Rückmeldung | Umsetzung |
|---|---|
| Hyperraum-Ring erst ab c | Sicht-Anteil beginnt jetzt bei **Warp 1** statt 0,8 |
| „Ich finde den Mond nicht mehr" | **Fehler gefunden**: die Himmelskörper wurden nur in `enterSpace()` sichtbar geschaltet. Wer schneller oben war, als die GLB-Modelle geladen hatten, sah sie **nie**. Jetzt zieht `placeBodies()` Position und Sichtbarkeit **jeden Frame** nach |
| dito | Der Mond liegt jetzt genau in **Ausflugrichtung** (Mars/Sonne um ±120° gedreht), und das HUD zeigt den nächsten Körper mit Symbol und Entfernung |
| Wiedereintritt zu leicht | **Hysterese**: raus ab 6000 m, zurück erst **unter 2500 m** — beim Suchen fällt man nicht mehr versehentlich zur Erde |
| Asteroiden sollen zufällig fliegen | Spawn ohne Vorzugsrichtung rundum (2–9 km), Drift 20–120 m/s in beliebige Richtung, 14 statt 10 Stück |
| Keine Asteroiden im Hyperraum | Grenze exakt bei Warp 1 (vorher 1,05) — im Hyperraum wird alles abgeräumt |
| Fremde X-Wings, die mitschießen | 3 KI-X-Wings fliegen den nächsten Brocken an, feuern ab 3 km (wenn er vor ihnen liegt) mit 0,8–1,6 s Pause. Ihre Treffer zählen **nicht** auf den eigenen Zähler; Laser und Trefferlogik teilen sie mit dem Spieler (`fireBolt(..., mine)`) |

### Feinschliff Weltall (23.08.2026)

| Rückmeldung | Umsetzung |
|---|---|
| „im weltall 10 % = 0,1 warp" | **Fehler gefunden**: im Weltall griff noch die VTOL-Schwebelogik (unter 30 % Schub), die die Fahrt wegdämpfte und auf Sinkrate regelte. VTOL gilt jetzt nur über Erde und Mond — im Weltall ist der Schub linear, also 10 % = Warp 0,1 … 100 % = Warp 1 |
| Asteroiden sollen mithalten | Ihr Kurs wird jeden Frame an die Fliegergeschwindigkeit angeglichen, minus 2–8 % Rückstand, plus eigene Drift (15–50 m/s). Man überholt sie also nur langsam — bei Warp 0,1 genauso wie knapp unter Warp 1 |
| mehr Brocken und Jäger | 20 Asteroiden (war 14), 6 fremde X-Wings (war 3). Die Jäger halten mit 92 % der Spielergeschwindigkeit mit, sonst sind sie sofort außer Sicht |
| Entfernung zum **angeflogenen** Körper | `aimedBody()` wählt nach Richtung (bester Winkel zur Flugrichtung), nicht nach Entfernung; fliegt man auf keinen zu, erscheint der nächste |
| Symbol wie Tropfen/Kisten über dem Flieger | Neue Anzeige `updateSpaceHint()` in derselben Machart wie `updateScoopHint`: 60-px-Symbol, an die projizierte Position über dem Flugzeug gesetzt |
| Große Symbole sollen wieder verschwinden | Sie stehen nur noch **3 s** und sind ereignisgesteuert: Ortswechsel, Wechsel des angeflogenen Ziels (mit Entfernung) und Asteroiden-Treffer (dann **nur** der Zähler). Bei Trefferserien setzt jeder Treffer den Timer neu. Der Ortswechsel läuft nicht mehr über `showBig()` in der Bildmitte, sondern über dieselbe Anzeige. Damit die Suchhilfe nicht verloren geht, stehen Ort und Zielentfernung dauerhaft klein in der HUD-Statuszeile |
| X-Wing als erstes Modell | `MODEL_NAMES` beginnt mit `'XWing'` — das Spiel startet damit auf der Landebahn. Das alte „SuperCup" in der Modellanzeige (Überbleibsel im HTML) ist ersetzt |

## Phase 5 und 6 — Mars landbar, Stationen, Raumschiffe, Todesstern (23.08.2026)

**Korrekturen zuvor**

| Rückmeldung | Umsetzung |
|---|---|
| Symbol blieb dauerhaft stehen | Es wird nur noch bei einem **echten** Statuswechsel gezeigt: Ortswechsel oder ein neu angeflogener Körper, wobei der Anflug eng (Winkel > ~25°) und **mindestens eine Sekunde stabil** sein muss. Vorher triggerte jeder Schwenk neu. Gezeigt wird jetzt nur das Symbol, ohne Entfernung |
| Übergänge dauern zu lang | Erde: Übergang 3000–4000 m (Weltall ab 4000 statt 6000), Rückkehr unter 2200 m. Mond: zurück ins All ab **1000 m**, Mars ab **2000 m** |
| X-Wing versinkt beim Landen | Höhenraster auf 128×128 verfeinert, dazu in Bodennähe **ein echter Raycast pro Frame** gegen die Kachel unter dem Flieger. Nötig, weil das Raster auf dem zerklüfteten Mars bis zu **65 m** abweicht — damit wäre der Flieger im Boden gelandet. Weiter oben genügt das Raster (billiger) |

**Mars ist landbar** — die Oberflächenlogik ist jetzt generisch (Tabelle `GROUNDS` für `moon` und
`mars`): gleiche Spiegel-Kachelung, gleiches Höhenraster, gleicher Raycast. Vermessen:

| | Mond (Giordano Bruno) | Mars (Aram Chaos) |
|---|---|---|
| Kachel | 2999 m | **7494 m** (nicht 7497: die z-Ausdehnung ist 3 m kleiner, sonst fielen 256 Rasterpunkte aus der Geometrie) |
| Terrain-Dreiecke | 2.667 | 37.314 |
| verworfen | 304 (Sockel) | 648 (Sockel + Maßstabs-Platte) |
| Höhen | −72,9 … 48,7 m | −133,3 … 0 m |
| Naht (Mirror-Tiling) | 0,000 m | 0,000 m |
| Rasterfehler | 0,18 m ⌀ / 3,97 m max | 2,18 m ⌀ / 64,96 m max → deshalb der Raycast |
| Schwerkraft | 1,62 m/s² | 3,71 m/s² |

**Neue Modelle**

- **Mondbasis** (eggshell.d) neben dem Aufsetzpunkt auf dem Mond, **Perseverance-Rover**
  (Thomas Flynn, auf 10 m gestreckt — im Original nur 4 m und aus der Luft unsichtbar) auf dem Mars.
- **ISS** (colinf) hängt in Erdnähe, gleich beim Austritt in Sichtweite, und dreht sich langsam.
- **Drei Raumschiffe** fliegen geradeaus ihre Bahnen durchs All und werden neu eingesetzt, wenn sie
  weiter als 26 km weg sind: **Space Shuttle** (37 m), **Razor Crest** (30 m), **Serenity** (60 m).
  Ihre Modelle liegen unterschiedlich in ihren Dateien — Shuttle Nase +Z, Razor Crest senkrecht
  (Nase −Y), Serenity längs (Nase −X); jedes wird im Wrapper so vorgedreht, dass außen einheitlich
  „Nase = −Z" gilt.
- **Todesstern** (Sebastian Sosnowski) als vierter Himmelskörper: 20 km Radius in 250 km Entfernung,
  nur umkreisbar.

**Größe und Last** — das GLB-Bundle liegt jetzt bei **183,5 MB** (Serenity allein 31 MB base64,
Rover 19 MB). Auch die Dreiecksbilanz ist gewachsen: im Weltall grob 675.000 Dreiecke (Serenity
289.000, sechs KI-X-Wings 228.000), auf dem Mars rund 535.000 (Kacheln 336.000, Rover 199.000).
Falls es auf dem Tablet ruckelt, sind die Stellschrauben in dieser Reihenfolge: `AI_XW_COUNT`
(6 → 3 spart 114.000 Dreiecke), `AST_COUNT`, und das Kachelraster der Marsfläche (3×3 → 2×2).

### Nachtrag (23.08.2026)

| Rückmeldung | Umsetzung |
|---|---|
| Todesstern ohne Totenkopf | Sein Symbol ist leer; Körper ohne Symbol melden sich weder über dem Flieger noch in der HUD-Zeile |
| ISS, Mondbasis und Rover unsichtbar | **Derselbe Fehler wie zuvor bei den Himmelskörpern**: sie wurden nur beim Ankommen einmal platziert. Lädt das Modell erst danach fertig (Rover 19 MB, Basis 7,5 MB), stand es nie am richtigen Ort — die ISS bei (0,0,0), Basis und Rover auf Höhe 0 statt auf dem Boden, weil auch das Höhenraster noch nicht fertig war. Jetzt zieht `placeBodies()` bzw. `placeGroundBase()` beides **jeden Frame** nach |
| Mehr Raumschiffe | Shuttle 3×, Razor Crest 3×, Serenity 1× (ihr Modell hat 289.000 Dreiecke, 22-mal so viel wie das Shuttle — mehrere Exemplare würden das Bild ausbremsen). Klone teilen Geometrie und Texturen |
| Tempo wie bei den Asteroiden | Ihr Kurs wird an die Fliegergeschwindigkeit angeglichen, minus 4–14 % Rückstand, plus eigener Drift (80–250 m/s). Sie ziehen also „hin und her", bleiben aber im Blick statt nach hinten zu verschwinden |

### Nachtrag 2 (23.08.2026)

| Rückmeldung | Umsetzung |
|---|---|
| ISS zu schnell aus dem Bild | Sie zieht jetzt mit 92 % des Fliegertempos mit, plus 40 m/s eigenem Kurs; ab 12 km Abstand kommt die nächste Station in 2,5–5,5 km Sichtweite vorbei |
| Rover soll beim Landen da sein | Basis und Rover haben einen Standort, der neu gewürfelt wird, sobald man mehr als 2 km entfernt ist — bei jeder Landung stehen sie also in der Nähe (Basis 380–600 m, Rover 90–160 m) |
| Warp fällt beim Wegfliegen aus | **Denkfehler behoben**: die Hyperraum-Bremse prüfte nur die Entfernung zum Körper, nicht die Richtung. Jetzt greift sie nur, wenn er sich dem Körper wirklich **nähert** (Geschwindigkeit zeigt hin) |
| Übergang ins Weltall zu hektisch | Sowohl beim Verlassen der Erde als auch beim Start von Mond oder Mars geht der Schub auf **50 %** und der Warp-Aufbau auf null — erst umschauen, dann beschleunigen |

### Nachtrag 3 (23.08.2026)

| Rückmeldung | Umsetzung |
|---|---|
| Auf dem Mars liegt die Erde als „Unterbau" | **Fehler gefunden**: die Erdkugel wurde nur beim Ort `moon` an den Himmel versetzt. Auf dem Mars blieb sie dort, wo sie beim Verlassen der Atmosphäre lag — Mittelpunkt 20 km unter dem Startpunkt, Radius 20 km, also genau unter der Landschaft. Jetzt gilt das Umsetzen für **alle** Oberflächen |
| Basis/Rover nicht zu finden | Mondbasis steht jetzt auf **jeder Kachel** an einer aus der Kachelnummer abgeleiteten (also immer gleichen) Stelle; gerendert wird nur die der aktuellen Kachel, weil das Modell 37.758 Dreiecke hat. Der Rover setzt sich beim Sinkflug mit 10 % Schub **45–80 m neben den Aufsetzpunkt** |
| dito | Über beiden steht eine **Leuchtsäule** (260 m, additiv) — sie erscheint auch, wenn das Modell noch nicht geladen ist. Damit ist immer sichtbar, wo Basis bzw. Rover stehen |
| Warp bricht beim Wegfliegen ab | Die Richtungsprüfung war zu empfindlich: sie akzeptierte jede positive Komponente, also schon ein leichtes Schwenken. Jetzt muss die Fahrt zu **mindestens 30 %** auf den Körper zeigen. Dazu ruht die Bremse **6 s nach jedem Ortswechsel**, weil man direkt nach dem Start von Mond oder Mars noch dicht am Körper ist |

### Nachtrag 4 — Screenshot-Feinschliff (23.08.2026)

| Rückmeldung | Umsetzung |
|---|---|
| X-Wing versinkt beim Landen | Der Boden-Raycast prüfte nur **einen** Punkt unter der Rumpfmitte. Auf zerklüftetem Grund stecken dann Flügelspitzen oder Nase im Hang. Jetzt werden **fünf Punkte** abgetastet (Mitte, ±6 m quer, ±7 m längs) und der höchste genommen — er setzt auf der höchsten Stelle auf |
| Mondbasis zu klein | Auf das **Dreifache** vergrößert (Original 100 m) |
| Leuchtsäule verdeckte die Basis | Von 6 m auf **1,6 m** Radius und von 35 % auf **12 %** Deckkraft, dafür höher — sie zeigt die Stelle, ohne im Weg zu stehen |
| Verkehr an Basis und Rover | Zwei Schiffe pendeln dauerhaft: absteigen, kurz stehen, aufsteigen, an anderer Stelle wieder herunterkommen. Sie sind Klone der Weltraum-Modelle (kein zusätzlicher Speicher) und reine Kulisse |
| Mehr Raumschiffe, gut beobachtbar | Shuttle 5×, Razor Crest 4×, Serenity 1×. Der Rückstand reicht jetzt von **−6 % bis +14 %**: manche überholen langsam, andere werden überholt, mancher zieht mit seinem eigenen Kurs quer. Kollision gibt es bei ihnen nicht |

### Phase 7 — Landung im Todesstern-Hangar (23.08.2026)

- Der Todesstern ist jetzt anfliegbar wie ein Planet; die Landung führt in den **Hangar** — einen
  Innenraum statt einer Landschaft. Eigener Ort `death` mit künstlicher Schwerkraft (4,0 m/s²).
- **Boden**: eben, wird beim Laden **einmal** per Raycast ausgemessen (der tiefste Punkt des Modells
  ist irgendein Detail, nicht der Boden). Deshalb kein Höhenraster und kein Raycast pro Frame.
- **Eintritt**: mittig, schwebend 45 m über dem Boden, Schub auf Schwebestufe (20 %) — von dort mit
  10 % aufsetzen. **Austritt**: 200 m vom Zentrum oder 130 m über dem Boden.
- **Startort**: der X-Wing beginnt dort — beim Spielstart, sobald das Modell geladen ist, und bei
  jedem Reset. Andere Modelle starten weiter in der Inselwelt; ein Modellwechsel führt zur Erde.
- Wände haben keine Kollision: wer hindurchfliegt, landet über die Austrittsgrenze wieder im All.

**Größe**: Das Hangar-Modell ist ein Voxel-Bau mit **613.824 Dreiecken** und 36,5 MB (48,6 MB
base64). Das Bundle liegt damit bei **232 MB**. Im Hangar stehen rund 650.000 Dreiecke im Bild —
vergleichbar mit dem Weltall, aber der erste Download wächst deutlich. Wenn das zu viel wird, wäre
dieses Modell der erste Kandidat für einen kleineren Ersatz.

### Phase 8 — Star Destroyer als Träger (23.08.2026)

- **Drei Star Destroyer** (1200 m lang, nur 10.964 Dreiecke — angenehm billig) stehen 6–18 km
  entfernt im Raum und treiben mit 90 % der eigenen Fahrt mit, damit sie nicht sofort außer Sicht
  sind. Näher als **700 m** führt die Landung in **denselben Hangar** wie beim Todesstern.
- Der Hangar merkt sich seinen **Gastgeber** (`hangarHost`): beim Verlassen kommt man knapp über dem
  angeflogenen Objekt heraus, nicht mehr pauschal über dem Todesstern.
- **Etwa jedes dritte fremde Schiff** steuert einen Destroyer an und wird bei knapp der halben
  Schiffslänge Abstand neu eingesetzt — es sieht also aus, als würde es einfliegen.
- Zwei neue Verkehrsschiffe: **USS Voyager** (340 m, 147.206 Dreiecke) und **USS Enterprise-D**
  (640 m, 49.588). Nase-Richtungen vermessen: Destroyer und Voyager liegen schon auf −Z, die
  Enterprise braucht 180°.

**Bundle-Größe: 271,5 MB.** Die vier größten Posten sind Hangar (48,6 MB / 613.000 Dreiecke),
Serenity (31 MB / 289.000), Voyager (22,4 MB / 147.000, 4K-Texturen) und Rover (19 MB / 199.000) —
zusammen rund 120 MB. Das sind die Kandidaten, falls der erste Download zu lange dauert.

### Nachtrag 5 — vier Hangar-Fehler (23.08.2026)

| Fehler | Ursache und Behebung |
|---|---|
| Man schwebte **über** dem Hangar | Der Boden-Raycast kam von oben und traf zuerst das **Dach** — der Hangar ist ein Innenraum. Jetzt pro Messpunkt der **tiefste** Treffer (Innenboden) und über sieben Messpunkte der höchste davon, damit ein Strahl durch eine Bodenöffnung den Boden nicht nach unten zieht |
| Modellwechsel startete auf der Erde | Die Wahl des X-Wing führt jetzt immer in den Hangar — der Start ist durchgehend der Todesstern |
| Enterprise stand senkrecht, riesig, halb im Boden | Der Start-/Landeverkehr nutzte die **Weltraum-Größe** (Enterprise 640 m), drehte per `lookAt` in die Bewegungsrichtung (Nase nach unten) und hatte den Ursprung im Schwerpunkt. Jetzt: alle Landeplatz-Schiffe auf **34 m** normiert, **Unterseite** auf dem Boden, **waagerecht** bleibend und senkrecht auf-/absteigend wie der X-Wing |
| Nach dem Start aus dem Todesstern sofort auf dem Mars | Ohne vorherigen Weltraum-Besuch waren die Körper-Zentren nicht gesetzt, lagen also **alle bei (0,0,0)**. Beim Verlassen stand man 28 km über dem Ursprung — wo auch der Mars (30 km Radius) lag, dessen Landung damit sofort griff. Das Setzen steckt jetzt in `layoutBodies()` und läuft auch beim Hangar-Eintritt; `updateSpaceBodies()` prüft nichts, solange nicht platziert ist |

### Nachtrag 6 — Hangar vermessen statt geraten (23.08.2026)

Gemeldet: „beim Start im Hangar hängt man in einer Ecke", und die Nase soll zum Ausgang zeigen.
Statt zu schätzen habe ich den Innenraum aus der GLB-Geometrie ausgemessen
(`C:\tmp\hangarmap2.js`: Raster über die Grundfläche, Hindernisse im Höhenband Boden+4 … Boden+30,
größtes freies Rechteck, freie Randzellen je Kante):

**Erster Versuch, und was daran falsch war** (Screenshots des Nutzers haben es gezeigt): Als „Boden"
hatte die Messung eine **Plattform im Aufbaubereich** genommen (43 m statt 7 m) — daraus folgte eine
Hallenhöhe von 37 m statt 70 m, und die Schwebehöhe lag über dem Dach. Als „Öffnung" hatte sie den
freien Raum **außerhalb** des Gebäudes an der x-min-Kante genommen; die echte Öffnung liegt bei x-max.

**Zweite Messung** (`C:\tmp\hangarmap3.js`) mit der **Halle** als Kriterium — überdachte Zellen, die
innen frei durchfliegbar sind (unterstes und oberstes belegtes Höhenband je Zelle, dazwischen
mindestens vier freie Bänder):

| Messung | Ergebnis |
|---|---|
| Halle | **235 × 200 m**, Mitte (14, 0) |
| Boden / Decke | **7 m / 77 m** → 70 m Hallenhöhe (deckt sich mit den 45 m, die das HUD im Screenshot innen zeigte) |
| Freie Sichtlinien nach außen | x-max **2179**, x-min 3, z-min 0, z-max 0 → **Öffnung bei x-max** |
| Startplatz | (110, Boden+25, 0) — in der Öffnung mit Blick nach draußen, Nase auf +X (`rotation.y = −π/2`) |

Der Boden wird jetzt in der **Hallenmitte** gemessen: je Strahl der tiefste Treffer (das Dach liegt
darüber), über neun Messpunkte der Median — robust gegen Strahlen, die durch eine Öffnung fallen oder
auf einem Aufbau landen.

Die Ausrichtung gilt bei **jedem** Eintritt, egal aus welcher Richtung man anfliegt. Austrittsgrenzen
angepasst: 260 m vom Zentrum (200 lag zu dicht an der Öffnung), 50 m über dem Boden, und neu auch
nach unten.

### Nachtrag 7 — Raumschiffe sichtbar machen (23.08.2026)

Gemeldet: „keine Raumschiffe außer der Enterprise", „keine X-Wings bemerkt", und der Bodenverkehr
versank auf dem Mond.

**Die Ursache war die Entfernung, nicht die Anzahl.** Alle Schiffe erschienen 2,5–9,5 km entfernt,
unabhängig von ihrer Größe. Bei dieser Distanz ist ein 37 m langes Shuttle **0,4°** groß, die 640 m
lange Enterprise dagegen **7°** — deshalb war nur sie zu sehen. Die Spawn-Entfernung hängt jetzt an
der Schiffslänge (Länge × 25, gestreut), sodass alle etwa **2–3°** im Bild stehen; das Aufräumen ist
ebenfalls größenabhängig.

| Änderung | Wert |
|---|---|
| Shuttle | 7 Stück (war 5) |
| Razor Crest | 5 (war 4) |
| Serenity, Voyager, Enterprise | je 1 — 288.678 / 147.206 / 49.588 Dreiecke |
| Andock-Quote | 20 % (war 35 %), damit mehr im Bild bleiben |
| KI-X-Wings | 4 Stück (war 6), aber **sechsfach vergrößert** (~70 m) und nur 600–2200 m entfernt — mit 36 m auf 3,5 km waren sie nicht zu erkennen |
| Bodenverkehr | 3 m Aufschlag gegen das Einsinken (das Höhenraster schneidet Kuppen ab) und Neuplatzierung, sobald die Basis über 600 m entfernt ist |

**Dreiecksbilanz im Weltall: rund 1,0 Mio.** (Serenity 289k, Razor 191k, Voyager 147k, KI-X-Wings
152k, Shuttle 88k, Enterprise 50k, ISS 38k, Destroyer 33k, Asteroiden 12k). Falls es ruckelt, sind
Serenity und Voyager die größten Einzelposten.

**Hangar-Ausrichtung, gegengeprüft**: Bild 2 des Nutzers entstand mit `yaw = 0`, also Nase auf −Z.
90° im Uhrzeigersinn heißt −Z → +X, also `rotation.y = −π/2` — genau der Wert aus der Messung
(Öffnung bei x-max). Die Startposition (110, Boden+25, 0) liegt im Hallenrechteck (x −103 … +131)
und mittig in der 70 m hohen Halle.

### Nachtrag 8 — schwere Modelle vereinfacht (23.08.2026)

Serenity und Voyager sollten leichter werden; da es „nicht auf den exakten Look ankommt", wurden sie
nicht entfernt, sondern **vereinfacht**. Dafür gibt es jetzt `C:\tmp\decimate.js`: Vertex-Clustering
auf ein Raster, entartete Dreiecke fallen weg, Normalen werden neu gemittelt, UVs vom ersten Vertex
der Zelle übernommen. Texturen, Materialien und Sampler bleiben; die Node-Hierarchie wird eingebacken,
Animationen fallen weg. Die Außenmaße bleiben auf Zentimeter gleich.

| Modell | Dreiecke | Datei |
|---|---|---|
| Serenity | 288.678 → **32.930** | 23,4 → 5,6 MB |
| Voyager | 147.206 → **14.526** | 16,8 → 7,9 MB |
| Perseverance-Rover | 199.304 → **30.132** | 14,2 → 5,5 MB |
| Enterprise-D | 49.588 → **19.388** | 6,8 → 3,5 MB |
| Razor Crest | 38.112 → **9.843** | 5,1 → 1,8 MB |

Bei diesen Modellen bestimmen jetzt allein die Texturen die Dateigröße — die Geometrie schrumpfte
z. B. bei der Serenity von 18 MB auf 0,35 MB. **Bundle: 271,5 → 215,4 MB.**

Weil alles günstiger ist, fliegen jetzt **mehr** Schiffe: Shuttle 9, Razor Crest 6, Serenity 2,
Voyager 2, Enterprise 2, Star Destroyer 5, KI-X-Wings 5. Die Szene im Weltall liegt damit bei rund
**600.000 Dreiecken** — vorher 999.000 mit weniger Schiffen.

**Der Hangar kam später dazu** und war der lohnendste Fall: Er hat **keine Texturen** (alles
einfarbig grau, `baseColor 0.5`), trägt aber **fünf ungenutzte UV-Sätze** pro Vertex mit sich — die
36,5 MB waren praktisch reine Geometrie, und ohne Texturen kann das Verfahren auch keine
UV-Verzerrung verursachen.

  613.824 → **90.676** Dreiecke (14,8 %), 36,47 → **2,35 MB** (base64 48,6 → 3,13 MB).

Gegengeprüft mit 30 Sondierungen (`C:\tmp\hangarprobe2.js`), Original gegen vereinfacht:

| | Original | vereinfacht |
|---|---|---|
| Außenmaße | 282 × 80 × 300 m | 283 × 81 × 300 m |
| Boden | 5,9 m | 6,2 m |
| freie Höhe (Mittel) | 68,6 m | 68,3 m |
| Löcher im Boden | 0 von 30 | 0 von 30 |
| Hindernisse auf dem Weg hinaus | 3 von 135 | 0 von 135 |

Die Bodenhöhe wird im Spiel ohnehin zur Laufzeit per Raycast gemessen, passt sich also automatisch an.

**Bundle: 215,4 → 169,9 MB.** Bewusst nicht vereinfacht bleiben das X-Wing-Modell (man sieht es aus
wenigen Metern) und die Terrains von Mond und Mars, weil die Bodenhöhe beim Landen an ihrer
Geometrie hängt.

---

### Nachtrag 9 — eigene Flächen, Erdkugel als echtes Ziel, ISS landbar (23.08.2026)

**Der X-Wing landete unter der Mondbasis.** Die Basis bringt eine eigene Fläche mit, die der
Boden-Raycast nicht kannte: er prüft nur die Terrain-Kachel. Vermessen mit `C:\tmp\baseprobe.js`
(Modell 100 × 9,5 × 100, im Spiel Faktor 4,8):

| Radius um die Basismitte | Oberseite über dem Kraterboden |
|---|---|
| 0 m | 46,5 m (Kuppel) |
| 80 m | 22,3 m |
| 160 m | 16,1 m |
| 240 m | 8,4 m |
| 280 m | 4,8 m (nur noch 8 von 36 Punkten) |
| 320 m | kein Treffer — freier Krater |

Genau um diese 5 bis 46 m sass der Flieger zu tief. `stepGroundExact()` prüft jetzt zusätzlich
`moonBaseObj` bzw. `roverObj` und nimmt den **höchsten** Treffer unter dem Flieger — wer über der
Plattform schwebt, setzt darauf auf, wer über der Kuppel schwebt, auf der Kuppel. Der Landeverkehr
holt seine Höhe dagegen aus dem Kraterraster, deshalb stehen seine Plätze jetzt bei **340–520 m**,
also ausserhalb der vermessenen 290 m. Die Basis ist zugleich 60 % gewachsen (Faktor 3 → 4,8,
also 300 → 480 m).

**„Ich bin zweimal durch die Erde durchgeflogen."** Zwei Fehler, die sich überlagert haben:

1. Auf Mond und Mars hängt die Erdkugel als Kulisse am Himmel und wird jeden Frame neben den
   Spieler gesetzt (`pos.x + 90000, y = 45000`). Beim Aufstieg zurück ins Weltall wurde sie **nie
   zurückgesetzt** — sie stand danach als 40 km grosse Kugel mitten im Flugraum. Sie hat jetzt einen
   gemerkten Heimatplatz (`earthHome`, gesetzt in `layoutBodies()`), der beim Verlassen von
   Himmelskörper und Hangar wiederhergestellt wird. Beim Aufstieg von der Erde liegt ihr Mittelpunkt
   `EARTH_R` unter dem Austrittspunkt; startet man im Hangar des Todessterns, muss sie in die Ferne,
   weil man 20 km unter dem Flieger sofort wieder in ihr drin wäre.
2. Die Erde war überhaupt kein Ziel wie die anderen Himmelskörper, sondern ein reiner **Höhentest**
   (`y < EARTH_Y`). In der versetzten Kulissenkugel konnte der nie ansprechen, und die
   Hyperraum-Bremse kannte die Erde gar nicht — daher auch „kein Warp-Abbruch beim Anflug auf die
   Erde". Jetzt gilt für sie dieselbe Logik wie für Mond, Mars und Sonne: Bremse beim Anflug
   (`warpBrakeFor`) und Wiedereintritt an ihrer Oberfläche. Der Berührpunkt wird auf die flache Welt
   abgebildet (x/z vom Punkt, Höhe `EARTH_Y - 100`), die Fahrt auf 260 m/s gedrosselt.

Geprüft wird dabei nicht die aktuelle Position, sondern das im letzten Frame geflogene **Wegstück**
(`pathDist`): bei Warp 10 sind das mehrere hundert Meter pro Frame, und ein Punkttest übersieht eine
Kugel, durch die man mitten hindurchgesprungen ist. Sprünge über 6 km sind keine Flugstrecke, sondern
Ortswechsel — dann gilt wieder der Punkt. `C:\tmp\reentrysim.js` simuliert **4320 Anflüge**
(Warp 1–10, 60/30/20/12 Hz, 9 Breiten × 8 Längen × 3 Kurse): jeder Kurs, der die Erdkugel trifft,
löst den Wiedereintritt aus.

**Anflug auf Mond und Mars.** Der Flieger wird jetzt so eingesetzt, dass Basis bzw. Rover direkt vor
ihm liegen (Mond 1400 m Abstand in 520 m Höhe, Mars 900/400) — vorher musste man erst um 180° drehen.
Der „Kameraschwenk um den Flieger" war kein Effekt, sondern die Kamera, die von ihrer alten Position
nachzog; `snapCamera()` setzt sie hart mit. Eine **Animation gibt es nicht**: der Wechsel ist ein
harter Positionssprung, weil die Landschaft eine flache Kachelwelt ist und der Himmelskörper eine
Kugel. Ein wirklich fliessender Übergang hiesse, das Terrain auf eine Kugel zu legen — ein grosser
Umbau, der Kollision und Landung berührt. Stattdessen kaschiert ein 0,4 s langes Aufblenden aus
Schwarz (`flashFade`) den Schnitt.

**Nachschlag: der Wiedereintritt fühlte sich anders an als eine Mondlandung** („ich bremse, blicke
plötzlich von der Erde weg und sehe den X-Wing nicht mehr"). Zwei Ursachen, die zusammen genau dieses
Bild ergeben:

1. Die **Fluglage aus dem Weltall** wurde übernommen. Wer von oben anfliegt, hat die Nase steil nach
   unten — der Flieger kam also im Sturzflug mit 260 m/s aus 2100 m in die Inselwelt und schlug binnen
   Sekunden im Meer auf, daher „nicht mehr steuerbar" (das war die Feuerwehr-Kamera). Beim Mond
   passiert das nicht, weil `setupApproach()` dort waagerecht einsetzt. Jetzt wird auch bei der Erde
   nur der **Kurs** übernommen, Nicken und Rollen fallen weg, die Fahrt liegt bei 160–260 m/s und der
   Schub bei 40–50 %.
2. `snapCamera()` rechnete mit der **vollen Nasenrichtung**. Bei senkrechter Nase bleibt kein
   waagerechter Abstand übrig (`back.x/z ≈ 0`) — die Kamera stand 14 m **über** dem Flieger und blickte
   senkrecht nach unten. Sie rechnet jetzt nur mit dem Gieren, genau wie die Verfolgerkamera im Spiel.

**Zweiter Nachschlag: „ist null wie beim Mond und dem Mars".** Der Wiedereintritt hatte weiterhin
seinen **eigenen Code**, und der wich in drei Punkten von `setupApproach()` ab — deshalb fühlte er sich
anders an, obwohl die Symptome nach dem ersten Anlauf schon kleiner waren:

1. **Kamera zieht nach.** `snapCamera()` setzte 40 m Abstand und +14 m Höhe, die Verfolgerkamera
   strebt aber `cfg.dist * cc.dist` an — beim X-Wing **26,4 m** und **8 m**. Mit `lerp 0,06` kroch die
   Kamera danach rund eine halbe Sekunde auf ihre Sollposition, und genau das sah man. `snapCamera()`
   nimmt jetzt **exakt** die Stelle ein, die `updateCamera()` anstrebt (dieselbe Formel, gerechnet über
   die waagerechte Nasenrichtung statt über eine Euler-Zerlegung, die bei senkrechter Nase singulär
   ist). Das gilt für alle Ortswechsel, also auch Mond, Mars und Hangar.
2. **Fluglage „manchmal" falsch.** Der Kurs wurde per `Euler.setFromQuaternion(quat, 'YXZ')` aus der
   Weltraumlage gezogen. Diese Zerlegung ist bei senkrechter Nase **singulär** (Gimbal Lock) und bei
   kopfüber-Lage um 180° verdreht — beides kommt beim Anflug aus dem All ständig vor. `atan2` auf eine
   echte Richtung, wie es `setupApproach()` macht, ist immer eindeutig.
3. **Kein Ziel, andere Fahrt.** 160–260 m/s ohne Ausrichtung statt der ruhigen 110 m/s auf einen Punkt.

Die Erde läuft jetzt durch **denselben `setupApproach()`** wie Mond und Mars: Ziel ist der Punkt, an dem
man die Kugel berührt, 1600 m Abstand, 900 m Höhe (Wolkenkratzer reichen bis 160 m, Berge bis 60 m —
die Höhe ist also sicher). Dafür kennt `setupApproach()` jetzt auch Orte ohne Höhenraster; bei der Erde
zählt die Meereshöhe.

**Notausgang:** Weil der Wiedereintritt nur noch an der Erdkugel hängt, bleibt der alte Höhentest als
Rückfallebene stehen — lädt `earth_glb.js` nicht, gäbe es sonst keinen Weg mehr zurück in die Inselwelt.

**Die ISS ist landbar** — dasselbe Hangar-Szenario wie Todesstern und Star Destroyer, Andockradius
`ISS_DOCK = 170` (die Station ist 120 m gross, etwas mehr als ihre Länge, sonst trifft man sie im
Flug kaum). Dazu neu: eine Andock-Sperre `dockLock` von 6 s nach dem Verlassen eines Hangars. ISS und
Star Destroyer ziehen mit dem Flieger mit — ohne die Sperre hätte der Gastgeber einen direkt nach dem
Hinausfliegen wieder eingesaugt. `enterHangar()` lehnt in dieser Zeit ab, und beide Aufrufstellen
werten den Rückgabewert aus.

---

## Verifikation (alle Etappen)

Das Spiel ist eine statische Seite ohne Testsuite. Nach jeder Etappe:

1. `Flugspiel.html` im Browser öffnen, Konsole prüfen (GLB-Ladefehler kommen als `console.warn`
   aus `preloadGLB`).
2. Die Etappen-Tests durchspielen (Tastatur: `W`/`S` Schub in 10-%-Stufen, `M` Modellwechsel,
   `R` Reset, `H` Hilfe).
3. Jede per PowerShell geänderte Stelle **gegenlesen**.
4. Größe im Blick behalten: Etappe 2 bringt ~6,6 MB, Etappe 3 ~6,5 MB base64 zusätzlich zu den
   bereits ~90 MB, die der Service Worker cached.
5. Status oben abhaken, `README.md` ergänzen, committen.
