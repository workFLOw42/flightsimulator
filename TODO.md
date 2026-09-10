# TODO — Flugspiel

Offene Punkte. Erledigtes austragen, nicht abhaken lassen.
Stand: 10.09.2026, nach der siebten Runde (Raketen).

---

## Offen

**Kamera fährt durch alles außer Schiffen.** Sie hat als einzige Kollision die Klemme „nicht unter
y = 2" und wird bei Schiffen herangezogen. Inseln, Berge, Häuser und der Trägerrumpf fehlen noch:
dort schaut man weiterhin von innen durch die Wand.

**Der Schatten verschwindet über 20 m.** Das ist Absicht (`SHADOW_MAXALT`), aber der Astronaut auf dem
Mond kommt beim Hüpfen höher — dort ist der Schatten mitten im Sprung weg, genau wenn er am
interessantesten wäre. Nicht gemessen, beim Lesen aufgefallen.

---

## Zur Kenntnis: das Nicken ist schwächer

Seit alles Schwimmende auf der **gesehenen** Wasserfläche liegt, nickt es rund halb so stark
(Feuerwehrboot 4,24° → 1,73°). Rechnerisch richtig — flache Gitterdreiecke sind weniger steil als die
Welle. Wenn es zu ruhig wirkt: `BOAT_BOB` 1 → **2,45**, `DINGHY_BOB` 1,2 → **3,01** (ausgerechnet für
exakt die alte Wirkung). Nicht eingebaut, weil das eine Geschmacksfrage ist.

---

## Was die Schiffskollision bewusst nicht kann

- **Überbauten** über der Wasserlinie zählen für Boote nicht: ein überhängender Kran ragt über die
  Bootshülle hinaus, ohne zu blockieren. Für die Flieger gilt weiter die volle Höhe.
- Die Schiffe **kollidieren nicht untereinander** — nur beim Aussetzen auf Abstand gesetzt
  (`SHIP_CLEAR` = 260 m).
- Das Halbbreiten-Profil hat **24 Scheiben**; bei einem 300-m-Schiff sind das 12 m pro Scheibe. Feiner
  als jedes Boot lang ist, aber die Bugspitze ist damit gestuft, nicht stufenlos.
- **Am Strand wird nur der Bug geprüft**, bei Schiffen der ganze Umriss (siehe README). Das ist so
  gewollt — sonst kommt man vom Ufer nicht mehr los. Es heißt aber, dass das Heck am Strand im Sand
  liegen darf; sichtbar, wenn man rückwärts auf den Strand fährt.

---

## Lehre aus der Fehlersuche (bitte beim nächsten Mal beherzigen)

Das Durchfahren durch die Schiffe hat einen ganzen Tag gekostet, und der Grund war eine Testmethode,
die nicht funktioniert hat:

- Meine Simulationen benutzten **dieselbe Formel wie das Spiel**. Sie waren dadurch in sich konsistent
  falsch und konnten den Vorzeichenfehler nicht sehen — über 1.280 Anfahrten meldeten sie „kein
  Durchfahren", während es im Spiel offensichtlich passierte.
- Alle Tests fuhren gegen ein Schiff mit `heading = 0`. Genau dort ist `sin(h) = 0`, und genau dort
  stimmten beide falschen Formeln zufällig.
- **Was hilft:** gegen eine *unabhängige* Referenz prüfen, nicht gegen die eigene Rechnung. Hier war
  das `three.js worldToLocal` — also das, was der Renderer tatsächlich zeichnet. Und Kurse
  durchvariieren, nicht bei 0 bleiben.
- **Was am Ende entschieden hat:** die Diagnose-Anzeige im Spiel (Taste J). Sie zeigte „quer −31,3 bei
  Grenze 25,2 → frei", und weil das Modell nur 21,2 m breit ist, war damit klar, dass die *Rechnung*
  falsch liegt und nicht die Hülle. Eine Messung im laufenden Spiel schlägt jede Simulation.
- Auch die **Metrik** muss stimmen: zwischenzeitlich meldete mein Test 252 Durchbrüche, die es nicht
  gab — er zählte den Abstand zur Längskante mit, und ein Boot längsseits mittschiffs ist quer weit
  draußen, aber längs weit von Bug und Heck. Erst die reine Quer-Eindringung war richtig.

---

## Erledigt am 10.09.2026

1. **Rettungsboote liefen voll** — Gitter-Interpolation (bis 1,005 m), nicht `tOff`. `seaMeshY()`.
2. **Durchziehen bis zur Schiffsmitte** — Gleiten an der Zonengrenze. 8-m-Saum (Bugwelle).
3. **KI-Jet durch das Containerschiff** — `carrierLap` sah keine Hindernisse; eigene Prüfung
   `aiShipAhead()`, weil der Jet sonst seinen eigenen Träger als Hindernis gesehen hätte.
4. **Feuerwehrboot drang ein statt abzuprallen** — es prüfte nur seinen Mittelpunkt. `BOAT_LOOK`.
5. **Barriere lag neben dem Schiff** — Hülle kam aus der Gesamtbox mit Masten. Jetzt Rumpfband +
   `cx`/`cz`.
6. **Von vorne durchgefahren** — die eigene Vorausschau machte das Ausweichen blind. Zwei Durchgänge.
7. **Schiffe schwebten in der Luft** — sie fuhren jenseits des Meeresgitters. Radien 2,4 / 2,9 km.
8. **Schatten für Boote und Astronaut** (Wunsch) — ovaler Schatten, wächst mit der Sprunghöhe.
9. **Schatten wanderte** — er lag auf fester Höhe statt auf der Welle (bis 5,59 m Differenz).
10. **Falcon flog seitwärts** — `setFromUnitVectors` ließ den Roll frei (im Mittel 45,3° gekippt).
11. **Grenze folgt der Rumpfform** — Halbbreiten-Profil mit 24 Scheiben statt Rechteck.
12. **Ganzer Bootsumriss geprüft** statt eines Punktes — 5,4 % der Lagen waren sonst „frei", obwohl
    die Bootsmitte im Rumpf stand.
13. **DAS Durchfahren: zwei Vorzeichen in der Drehung.** Rückdrehung und Querachse drehten um
    +heading statt −heading. Bei 90° Kurs lag die Hülle **203 m** neben dem Rumpf, bei **92 %** aller
    Kurse mehr als eine Schiffsbreite daneben, und die Verdrängung schob zur Mittellinie statt hinaus.
    Nach der Korrektur bleiben **3.528** Fahrten restlos im freien Wasser.
14. **Schatten lag über dem Objekt** — `depthTest:false` plus `renderOrder 999` zeichnete ihn über
    allem. Jetzt `depthTest` an: das Objekt verdeckt seinen Schatten selbst, sichtbar bleibt er
    seitlich und hinten. Höhe = höchster Wellenpunkt unter der Fläche (0 von 200.430 Randpunkten unter
    Wasser). Eine geneigte Scheibe war messbar schlechter und ist verworfen.
15. **Am Strand hing man fest** — die Umriss-Prüfung verlangte alle neun Punkte im Wasser, am Ufer nie
    erfüllt (bis 8 m vom Rand keine von 24 Richtungen frei). Jetzt getrennt: Schiffe ganzer Umriss,
    Land/Strand nur der Bug. Kommt aus jeder Lage frei, auch von 8 m im Sand.
16. **Wasserstrahl kam aus der Luft** — er begann 7,1 m über dem Kiel, das Boot ist 6,4 m hoch. Jetzt
    aus der Bugkanone, am Modell ausgemessen (6,4 m vor der Mitte, 4,12 m über dem Kiel).

Alle Befunde stehen ausführlich im README.

## Erledigt am 10.09.2026 (siebte Runde: Raketen)

17. **Ariane 6 auf jeder zweiten Nicht-Stadt-Insel** (Wunsch) — sie steht auf ihrer Startrampe,
    startet bei Annäherung unter 1,5 km, steigt beschleunigt (9 m/s², Deckel 900 m/s) und ist ab der
    Weltraumgrenze weg. Nach 45 s wächst die nächste nach. Städte bleiben frei.
18. **Im Weltall fliegt sie mit** — als ganz normaler `SHIP_DEFS`-Eintrag, damit die vorhandene
    Bahnlogik (`updateShips`/`placeShip`) sie ohne eine Zeile eigener Steuerung herumziehen lässt.
    Nase in Flugrichtung geprüft: 0° Abweichung in vier Richtungen.
19. **Modell spielbar gemacht** — 133.750 → **19.378 Dreiecke** per Vertex-Clustering (0,3-m-Raster),
    53 cm Silhouettenfehler an einer 62-m-Rakete. Die **Ariane 5** (355.212 Dreiecke, 15,4 MB) war
    dafür zu schwer und ist verworfen.
20. **Startturm von der Rakete getrennt** — er war im GLB mit modelliert (Silhouette 10 m breit bei
    5,4 m echtem Durchmesser). Trennung über die Geometrie: Rakete innerhalb 3,2 m Radius über die
    volle Höhe, Turm außen und nur bis 23 m. Zwei Modelle: `rocket_glb.js`, `pad_glb.js`.
21. **Kollisionshüllen für beide** (Wunsch) — in derselben Prüfung wie Häuser und Hafen, damit sie in
    einem Zug für Flieger-Absturz, Bootsfahrt, Astronaut UND KI-Ausweichen gelten. Beim Steigen
    wandert die Hülle mit. Zehn Fälle durchgerechnet, alle richtig.
22. **Taste J (Schiffs-Diagnose) ausgebaut** (Wunsch) — sie hatte ihren Zweck erfüllt (sie fand die
    zwei Vorzeichen, siehe Punkt 13). Mit der Taste ist auch `shipDiagText` heraus, sonst wäre toter
    Code stehen geblieben, der sich nie mehr einschalten lässt. **J dient jetzt nur noch dem
    Umsehen nach links** — das war schon vorher so und bleibt.

### Die Falle bei den Salts (fast zugeschnappt)
Für „welche Insel bekommt eine Rakete" brauchte es einen freien `cellRnd`-Salt. 77 sah frei aus und
wäre **falsch** gewesen: die Salts im Code sind **Bereiche**, keine Einzelwerte. Die Stadt-Türme
zählen `70 + idx` bis **idx = 128** hoch und belegen real 70..198, `300 + idx` bis 428. Ein 77 hätte
mitten darin gelegen und den Zufall der Türme mit dem der Rakete verkoppelt. Jetzt **900 und 901**.

**Lehre:** bei `cellRnd`-Salts nicht nach der nackten Zahl greifen, sondern ausrechnen, wie weit die
`+ i`-Bereiche wirklich laufen.

---

## Wunschliste aus der siebten Runde

**1. Ein- und Aussteigen, Fahrzeuge wechseln — ERLEDIGT.** Auf jeder Nicht-Stadt-Insel steht ein
geparkter X-Wing (Ring bei 45 % des Inselradius, 16 Richtungen, Salt 902/903), auf dem Träger einer
am Deckrand. Zu Fuß hin, **B** — man sitzt drin und steht startklar auf der Landebahn. Auf Mond und
Mars steht 30 m rechts neben dem gelandeten X-Wing ein Fahrzeug (Mars: Perseverance, Mond: Apollo
Lunar Rover), **B** steigt ein und aus. Gefahren wird wie im Flugzeug: rechter Stick gibt Schub in
**10-%-Stufen** (`thrStep`), linker Stick lenkt nur, A fährt rückwärts. Follow-Modus und orange
Leuchtsäule sind entfallen.

Gebaut als `eva.rover` — ein Sub-Modus **innerhalb** von `eva`, nach dem Vorbild von `eva.boat`
(Schlauchboot): eigene Physik (`updateRover`), eigener Kamerafaktor, eigene HUD-Anzeige, eigener
Eingabezweig. Der Alternativweg über `MODEL_NAMES`/`PLANE_SPECS` wäre mit `cycleModel` kollidiert
(der Rover stände in der M-Reihenfolge) und mit `evaAllowed`s `if(isBoat()) return false`.

  - **Lunar Rover gebaut:** 30,1 MB / 464.116 Dreiecke → **34.440 Dreiecke / 2,37 MB** per
    Vertex-Clustering (3 cm Raster), 3,7 cm Silhouettenfehler. Im Browser nachgemessen
    3,09 × 1,77 × 1,78 m — der echte Apollo-LRV ist 3,10 m lang. Bewusst feiner gerastert als bei
    der Rakete (0,3 m): den Rover sieht man von einem Meter Entfernung, die Rakete war 62 m hoch.
  - **Sieben der neun Materialien hatten keinen `baseColorFactor`** — die Farbe steckte allein in
    8 MB PNG-Texturen, die beim Clustern verlorengehen. Die PNGs wurden dekodiert
    (Filter-Rückrechnung nach RFC 2083 + sRGB→linear); jedes Material hat jetzt seine echte
    Mittelfarbe: Chassis #8b8b88, Räder #6a4b33 (Mondstaub), FrontParts #393424, Antenne #b7b7b7.
  - **Radar zu Fuß** über `footTargets()`: X-Wing weiß, Mars-Rover orange, Lunar Rover blau. Im
    Rover nur der weiße X-Wing. `updateRadar` verarbeitete schon Arrays (`spaceTargets`), es war
    also nur die Quelle zu erweitern.
  - **Mondbasis-Boden:** der Rover kennt ihn, ohne dass dafür etwas zu tun war. `updateRover` setzt
    seine Höhe über `vehicleGroundY` → `surfaceY`, und `surfaceY` fragt `basePlatformNear` **vor**
    allem anderen ab. Er fährt also auf der Fläche statt im Krater darunter.

### Zwei Fehler, die erst der Browsertest zeigte

1. **Auf dem Mond stand kein Fahrzeug.** `placeGroundBase` hatte `if(locale === "moon") { Basis }
   else if(locale === "mars" || locale === "moon") { Fahrzeug }` — der zweite Zweig ist für `moon`
   **unerreichbar**. `roverSpot.moon` blieb null, das Radar zeigte einen Blip statt zwei. Jetzt ein
   eigenes `if`: Basis und Fahrzeug sind zwei unabhängige Dinge.
2. **Das Fahrzeug stand 47–105 m entfernt statt 30 m,** und der Abstand wuchs jeden Frame.
   `placeGroundBase` läuft in **jedem** Frame, also auch im Anflug — der Spot wurde gesetzt,
   während der X-Wing noch mit über 6 m pro Frame weiterflog, und blieb dann liegen (Neusetzen erst
   ab 400 m). Jetzt wird er erst gesetzt, wenn der X-Wing wirklich **steht**.

### Eine Fehldiagnose, die die Messung widerlegt hat
Ein Testskript meldete, der fahrende Rover stehe 3 m unter der Marsfläche. Als Ursache hatte ich die
Toleranz in `surfaceY` vermutet (`tol = eva ? 1.5 : 5`, während der Rover 1,39 m pro Frame fährt) und
sie für den Rover auf 5 m gesetzt, dazu `stepGroundExact` auf das volle Tastkreuz umgestellt.
**Beides war falsch und ist zurückgenommen:** nachgemessen lag die Messstelle maximal 1,39 m
entfernt (im Mittel 0,14 m), also durchgehend innerhalb der Toleranz — die Änderung bewirkte nichts.
Und der Versatz existierte nicht: an der Stelle des Rovers gilt `surfaceY` = `groundHitY` =
`vehicleGroundY` = −27,07 m, und `updateRover` setzt ihn auf genau diesen Wert. Das Testskript hatte
die Höhe vor dem Physikschritt abgelesen, also einen Frame zu früh.

**Lehre:** ein `if(eva)` bedeutet nicht mehr „zu Fuß“ — seit es Sub-Modi gibt (`eva.boat`,
`eva.rover`), muss jede solche Stelle prüfen, **welches** davon gilt. Fehler 1 saß genau darin.
Aber: erst messen, dann ändern. Zwei dieser Stellen waren richtig, wie sie waren.

### Verifiziert
- **8.065 Inseln** über 14.641 Zellen simuliert: 7.218 bekommen einen X-Wing, 39 finden keinen Platz
  (0,54 %), **null** Kollisionen mit Landebahn, Hafen, Häusern oder Raketenrampe; engster Abstand zu
  einem Bauwerk genau die geforderten 26,0 m; Platzierung deterministisch.
- **Browser (Playwright), 0 Konsolenfehler:** Lunar Rover lädt mit 3,09 × 1,77 × 1,78 m; auf einer
  Insel aussteigen → zum X-Wing → **B** → steht auf der Landebahn; auf Mond und Mars Abstand **genau
  30,00 m**, Blips korrekt (weiß+orange bzw. weiß+blau, im Rover nur weiß); Vollgas erreicht
  **100,0 km/h nach 3,90 s** (gerechnet 3,97 s) und deckelt dort sauber; aussteigen und am X-Wing
  wieder einsteigen geht auf beiden Himmelskörpern.
- **Ausrollen:** Gas weg = Halt nach 1,79 s. Nicht der Rollwiderstand bremst, sondern die
  Schubregelung (Zielgeschwindigkeit 0 mit den vollen 7 m/s²) — wie beim Feuerwehrboot.

### Drei Zusatzwünsche derselben Runde
- **Kollision → sofort trudeln statt Stall.** `state.falling` **war** schon das senkrechte Trudeln,
  aber die Stall-Logik stand davor und griff im Frame nach dem Treffer trotzdem: der Treffer setzt
  `vel` auf 0, damit ist die Fahrt unter `vStall`. Man sah einen Strömungsabriss (Nase auf −75°,
  Dauer-Zittern am Controller) und **dann** den Sturz. Jetzt schließt `!state.falling` das aus — im
  Sturz gibt es auch sachlich keinen Auftrieb, der abreißen könnte.
- **Ariane landet und startet senkrecht.** Im GLB steht sie aufrecht (Längsachse Y, 62 m),
  `SHIP_DEFS` legt sie mit `rot [-PI/2,0,0]` auf die Seite — richtig fürs **Weltall**, wo jedes
  Schiff mit der Nase auf −Z zieht. Die Landeplätze klonen aber genau diese vorgedrehte Vorlage,
  also **lag** sie mit 34,00 m Länge auf dem Boden. Die Drehung wird jetzt nur für den Landeplatz
  zurückgenommen (im Browser geprüft: 3,27 × **34,00** × 3,29 m, aufrecht). Ihr Aufsetz-Aufschlag
  kommt dabei aus dem **Grundriss**, nicht aus der Höhe — 34 m × 0,45 wären 15,3 m gewesen, sie
  hätte sichtbar geschwebt.
- **Canadair versinkt nicht mehr in den Wellen.** Gemessen: das Modell steht mit der Unterkante auf
  y = 0, sein Rumpf ist rund 3,3 m hoch — und die sichtbare Wasserfläche an seiner Stelle steigt bis
  **+2,94 m**. Die Welle deckte ihn zu **89 %** zu. Mit einem festen `yOff` ist das nicht zu heilen:
  im Wellenberg schlägt sie genauso darüber, im Tal schwebte es. Es muss **mitschwimmen**.
  `CANADAIR_DRAFT = 0,55 m` (echter CL-215: 0,9 m bei 28,60 m Spannweite → 0,58 m im Modellmaßstab),
  dazu Nicken aus der Dünung wie beim Feuerwehrboot (0,9° Spitze — das Boot hat 1,3°, gleiche
  Größenordnung). Im Browser: **4,71 m Hub** auf dem Wasser, 0,30 m fest auf der Landebahn.

  **Der Weg über `surfaceY` war falsch** (gebaut, gemessen, verworfen): `surfaceY` ist zugleich die
  **Kontaktschwelle** der Landelogik. Schwingt sie mit der Welle, gilt der Flieger im Wellental als
  abgehoben, fällt einen Frame und wird beim Wiederaufsetzen erneut auf harte Landung geprüft
  (`vspeed > 55` — das Canadair fliegt bis 63). `state.pos` bleibt deshalb auf der Nulllinie, nur
  die **Darstellung** wandert, und die Kamera folgt ihr über `planeCamRef()`. Der Nickwinkel
  braucht dabei eine eigene Variable (`canaPitch`): rechnet man ihn jeden Frame frisch aus
  `state.quat`, ist der Glättungsfaktor bei 60 fps nur 0,042 — angezeigt würden 4 % der
  Wellenneigung, das Nicken wäre unsichtbar.

**2. Neuer Flughafen auf den Inseln.** `airport_by_nermin.glb` als Modell: dort parken alle Flugzeuge
mit genug Abstand, damit klar ist, in welches man einsteigt. Wer einsteigt, **respawnt auf der
Landebahn**.

**3. Jetpack im Weltall.** Da man im Weltall-Hangar schon aussteigen kann: auch **ins Weltall
hinauslaufen** und dort per Jetpack schweben — **Steuerung wie beim X-Wing**.

**4. Weitere Modelle liegen bereit** (noch nicht eingebaut):
  - `submarine_by_Helindu.glb` — U-Boot
  - `killer_whale_by_Trouvaille.glb` — Killerwal
  - `mondfahrzeug_lunar_rover_by_Deutsches Museum  Digital.glb` — Lunar Rover (für Punkt 1)

### Neu gemeldet

**5. Landebahnen der Städte lagen nicht mittig — ERLEDIGT.** Das Turm-Raster lief
`for(gx = -radius; gx <= radius; gx += 46)`. Der Startwert hängt am Inselradius, und der ist bei
jeder Insel anders — die Landebahn bei x = 0 lag deshalb an einer beliebigen Stelle im Raster. Die
Schneise wurde symmetrisch ausgeschnitten, aber die erste Turmreihe stand links und rechts
unterschiedlich weit weg: über 360 Städte gemessen **290 schief (80,6 %)**, im schlimmsten Fall
**40 m** Unterschied — beim Anflug sah die Bahn aus, als läge sie am Stadtrand. Jetzt wird das
Raster von x = 0 aus nach beiden Seiten aufgebaut (`N = floor(radius/STEP)`), damit immer eine
Rasterlinie genau auf 0 liegt: **0 von 360 schief**, Gasse 92 m breit bei 24 m Bahn. Die
Salt-Bereiche bleiben frei (Türme 70..202 und 300..432, Rakete und X-Wing bei 900..903).

**6. Im Hangar aussteigen und herumlaufen** — geht bereits (`evaAllowed` erlaubt
`locale === "death"`). Das ist die Voraussetzung für Punkt 3, das Jetpack im Weltall.

**7. Airport auf den Nicht-Stadt-Inseln** (`airport_by_nermin.glb`, 0,65 MB, 1.300 Dreiecke —
winzig, keine Reduktion nötig). **Aber vermessen, und da liegt ein Problem:** er ist ein flaches
Gelände von **3000 × 1577 m** mit nur **3,47 m hohen** Aufbauten. Die Inseln haben 150–330 m
Radius. Skaliert man ihn auf 260 m Länge, sind die Terminals **0,30 m** hoch — niedriger als der
Astronaut (1,8 m). Er lässt sich also nicht einfach hinstellen. Zwei Wege: nur das **Vorfeld**
verwenden (die flache Fläche ist das Brauchbare, Parkplatz genug für alle Flugzeuge), oder
**Aufbauten und Fläche getrennt skalieren** — dasselbe Verfahren wie bei Rakete und Startturm, die
auch getrennt wurden. **Vor dem Bau zu entscheiden.**
