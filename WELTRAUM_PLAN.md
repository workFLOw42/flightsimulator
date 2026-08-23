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
