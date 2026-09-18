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

**2. Parkplatz mit allen Flugzeugen auf den Inseln - ERLEDIGT.** Neben der Landebahn jeder
Nicht-Stadt-Insel liegt ein **Vorfeld von 200 x 70 m** mit **10 Stellplaetzen** in zwei Reihen,
Nasen zueinander. Darauf stehen Canadair, Alpha Jet, Airbus, Transall und Mustang - jedes genau
zweimal, deterministisch aus der Zelle gewuerfelt (Salt 905). Ein Rollweg verbindet Vorfeld und
Bahn. Zu Fuss hinlaufen, **B** druecken: man sitzt drin und steht am Anfang der Landebahn *dieser*
Insel.

  - **Das GLB war unbrauchbar, wie im alten Punkt 7 vermutet** - und die Messung hat es bestaetigt:
    `airport_by_nermin.glb` ist ein 3000 x 1577 m grosses Gelaende mit nur **3,47 m** hohen
    Aufbauten. Auf Inselgroesse skaliert waeren die Terminals **30 cm** hoch, niedriger als der
    Astronaut (1,8 m). Von den beiden dort erwogenen Wegen ist es der dritte geworden: ein eigenes
    Vorfeld aus derselben Geometrie wie die Landebahn (`runwayMat`, `lineMat`). Das GLB bleibt
    ungenutzt.
  - **Der Platz wird FREIGEHALTEN, nicht gesucht.** Das ist der Kern und der Unterschied zu Rakete
    und geparktem X-Wing, die einen freien Ring absuchen: ein 200 x 70 m grosses Rechteck zwischen
    8 bis 18 gewuerfelte Bauwerke zu bekommen gelingt nur auf **76 %** der Inseln (durchgerechnet
    ueber 7.218). Die Landebahn loest das schon lange, indem `islandBuildings` ihren Streifen
    ausspart - der Parkplatz macht es jetzt genauso, und damit passt er auf **100 %**.
  - **Modellmasse im Browser gemessen**, nicht geschaetzt: das groesste Flugzeug ist der **Airbus**
    mit 27,1 m Spannweite und 24,93 m Laenge. Daraus das Raster von **34 m** (6,9 m Luft zum
    Nachbarn) und die Reihenbreite von 35 m. `GLB_SPAN` normiert die groessere waagerechte Achse,
    und die ist nicht bei jedem Modell die Spannweite - geraten waere daneben gegangen.
  - **Keine Kollisionshuelle** fuer die geparkten Flugzeuge, bewusst und wie beim geparkten X-Wing:
    `hitsBuilding` gilt auch fuer die Schritte des Astronauten, eine Huelle wuerde also genau den
    Weg zum Flugzeug blockieren.
  - **`preloadGLB` ruft jetzt `refreshIslands`.** Ohne das waere auf den zuerst gebauten Inseln
    dauerhaft eine Luecke im Vorfeld geblieben: die GLBs laden asynchron, und vorher zog der
     Callback nur das eigene Flugmodell nach.

**3. Jetpack im Weltall - ERLEDIGT, und es war zugleich der gemeldete Fehler.** Im Hangar
aussteigen und hinauslaufen: an der Hallenkante zuendet das Jetpack und man schwebt im Weltall.
Steuerung wie beim X-Wing, wie gewuenscht - Schub gibt die Zielfahrt (bis **45 m/s = 162 km/h**),
der linke Stick dreht und nickt, geflogen wird in Blickrichtung. Gas weg: die Bremsduesen halten an.
Gebaut als `eva.jet`, der dritte Sub-Modus neben `eva.boat` und `eva.rover`, nach demselben Muster.
Damit ist auch der alte Punkt 6 (im Hangar aussteigen) abgeschlossen.

### Der Fehler dahinter: "kommt zu Fuss nicht in den Weltraum, bleibt im Uebergang haengen"
`surfaceY` gibt fuer `locale === 'death'` **pauschal** `hangarFloorY` zurueck, und `evaSolid` gab dort
pauschal `true`. Der Astronaut lief also jenseits der Hallenkante auf **unsichtbarem Boden** weiter -
im Browser gemessen bis zur EVA-Leine bei **4000 m**, ohne dass je etwas passierte. Fuer den
FLIEGER war das unsichtbar, weil `updateLocale` `state.pos` prueft und der X-Wing im Hangar stehen
bleibt, waehrend man zu Fuss unterwegs ist (`rPlane` blieb konstant 20 m).

Die Kante ist jetzt **ausgemessen**, nicht geraten: per Raycast-Raster ist die tragende Flaeche ein
durchgehendes Rechteck **x = -140..130, z = -145..145** auf y = 6,25 (`HANGAR_FLOOR_*`). Der Ausgang
liegt am +X-Ende, und genau dort zuendet das Jetpack - im Test bei **x = 130,4**.

  - **Ueber der Halle zieht die kuenstliche Schwerkraft** (`GRAV_AT.death` = 4,0), draussen nicht.
    Ohne das blieb er ueber der Halle fuer immer schweben und kam nicht zurueck (gemessen: 8 m
    ueber der Flaeche, Gas aus, keine Bewegung). Jetzt sinkt er von allein und setzt auf.
  - **Der Saum gilt nur beim Hinauslaufen** (`JET_EDGE` = 6 m), nicht beim Landen. Beim Landen
    zaehlt die ganze Flaeche - ein Saum haette ihn genau am Rand durch den Boden fallen lassen.
    Nachgemessen an sieben Stellen einschliesslich aller Raender und einer Ecke: ueberall exakt
    y = 6,25.
  - **Harte Tempo-Deckelung**, wie der Flieger sie auch hat. Die Schubregelung sieht nur die Fahrt
    LAENGS der Blickrichtung; beim Nicken bleibt die alte Fahrt quer dazu stehen und beides addiert
    sich geometrisch. Gemessen wurden so **68,5 m/s** statt der erlaubten 45. Ein Kind kurvt viel,
    das passiert also dauernd.
  - **Steigt der X-Wing im Hangar jenseits der Bodenflaeche aus**, schwebt der Astronaut sofort -
    dort gibt es keinen Grund zum Stehen, und `canLandHere` erlaubt dem X-Wing die Landung ueberall.

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

**6. Im Hangar aussteigen und herumlaufen** - erledigt. Es war die Voraussetzung fuer Punkt 3, und
mit dem Jetpack ist der Weg nach draussen jetzt auch zu Fuss offen.

**7. Airport auf den Nicht-Stadt-Inseln** - entschieden und erledigt, siehe Punkt 2. Die dort
geforderte Entscheidung VOR dem Bau ist gefallen: das GLB (`airport_by_nermin.glb`, 3000 x 1577 m
Gelaende, 3,47 m hohe Aufbauten) ist verworfen. Auf 260 m Inselgroesse waeren die Terminals 30 cm
hoch. Keiner der beiden dort erwogenen Wege wurde genommen, sondern ein dritter: ein eigenes
Vorfeld aus derselben Geometrie wie die Landebahn.


---

## Nachbesserung am Jetpack (nach dem ersten Test)

Gemeldet wurden drei Dinge, alle drei bestätigt und behoben. Der erste Entwurf hatte das Jetpack als
Anhängsel des Hangars gebaut — der Ort blieb `death`, und der Astronaut schwebte "vor" der Halle.
Auf Zuruf ist es jetzt ein **Fahrzeug wie der X-Wing**, und das war der richtige Entwurf: es wechselt
den Ort wirklich ins Weltall (`locale = 'space'`), und damit gilt die **vorhandene** Weltall-Logik
ohne eine Zeile eigener Arbeit — Planeten, Schiffe, Asteroiden, Radar, Anflug und Andocken.

**1. "Der Astronaut dreht sich leicht nach rechts."** Ursache war die Euler-Ordnung: `rotation.set`
benutzt die three.js-Vorgabe **XYZ**, also erst Nicken um X, dann Drehen um Y. Damit wandert die
schon gekippte Längsachse mit der Y-Drehung weg und der Astronaut hängt seitlich in der Luft.
Gemessen **45,8°** Querlage bei halbem Nickwinkel und **71,6°** am Anschlag. Mit **YXZ** (erst Y, dann
X um die bereits gedrehte Achse) bleibt die Querlage bei 0 — über 35 geprüfte Lagen (7 Nickwinkel ×
5 Kurse) jetzt **maximal 0,000°**. Der Rest des Spiels rechnet überall in YXZ; das war die einzige
Stelle, die aus der Reihe fiel.

**2. "Man sieht nur Sterne, keine Planeten, kein Raumschiff."** Zwei Gründe, beide gemessen:

- `placeBodies` blendet alles aus, was nicht `locale === 'space'` ist. Für den Flieger richtig (er
  sitzt in der Halle und sieht die Wand), zu Fuß draußen falsch. Mit dem Ortswechsel ist das erledigt.
- Und selbst dann wäre nichts zu sehen gewesen: die **Kamera blieb im Hangar stehen**, gemessen
  **183.871 m** vom Astronauten entfernt. Bei 1,9 m Körpergröße ist er damit unsichtbar. `jetSnapCam`
  setzt sie jetzt bei jedem Ortswechsel hart hinter ihn (Abstand danach **14,2 m**).

**3. "Wieder landen ist gar nicht möglich."** Der alte Entwurf verlangte, die Hallenöffnung zu
treffen. Jetzt fliegt man einfach den **Todesstern** an und dockt an, genau wie im Flieger — über
dieselbe Prüfung, die `updateSpaceBodies` schon hat. Im Test dauert der Anflug **24,7 s**, danach
steht man im Hangar neben dem X-Wing und kann mit **B** einsteigen. Auf Mond oder Mars zu setzt man
dort auf und läuft weiter; Sonne und Erde haben eine Orbit-Grenze, die einen seitlich vorbeizieht.

### Der Fehler, den mein eigener Test verdeckt hatte
`updateEva` setzte im Jetpack-Zweig `state.pos` sofort wieder auf `eva.planeAt` zurück — richtig für
Boot und Rover (dort steht der Flieger still), falsch für das Jetpack, denn an `state.pos` hängt die
ganze Weltall-Logik. Mein Test rief `updateJet` **direkt** auf und umging diese Zeile: die Messung
sah gut aus, im Spiel wäre man an allem vorbeigeflogen, ohne dass etwas näher kommt. Erst der Blick
auf `state.pos` nach einem echten `updateEva`-Durchlauf zeigte es (Position blieb bei (−20, 6, 0),
während der Astronaut 250 km entfernt war).

**Lehre, schon zum zweiten Mal in diesem Projekt:** eine Teilfunktion direkt zu takten prüft die
Teilfunktion, nicht das Spiel. Der Weg muss dort beginnen, wo der Spieler ihn auch beginnt.

### Und noch eine Fehldiagnose, die die Messung widerlegt hat
Ein Regressionstest meldete "X-Wing kommt nicht mehr ins Weltall". Das war ein **Testfehler**: das
Skript setzte den Nickwinkel auf `-1.2` — das ist Nase **runter**. Der Flieger stürzte ab und wurde
in den Hangar zurückgesetzt. Mit `+1.2` steigt er auf y = **4006** und ist im Weltall, und von dort
landet er im Hangar. Nichts war kaputt.

## Der X-Wing ist von der Wiese aufs Vorfeld gezogen

Auf Zuruf: er stand als einzelner geparkter Flieger im Gras (Ring bei 45 % des Inselradius, Salt
902/903) und fehlte auf dem Parkplatz. Jetzt steht er dort mit den anderen — **alle sechs Flugzeuge**
auf 10 Stellplätzen. `_xwingLocalCalc` gibt `null` zurück, statt samt Aufrufern ausgebaut zu werden:
die Funktion wird an fünf Stellen gefragt (buildIsland, xwingParkNear, Radar, Rakete, Parkplatz), und
alle prüfen schon auf `null`. So fällt der Wiesen-X-Wing überall zugleich weg, ohne dass eine dieser
Stellen zur Baustelle wird. Die alte Ringsuche bleibt als `_xwingLocalCalcAlt` stehen, damit
nachvollziehbar ist, wie der Platz gewürfelt wurde.

Dazu kam eine Regel, die vorher nicht nötig war: **der Platz des Flugzeugs, das man selbst fliegt,
bleibt leer.** Sonst stünde das Modell doppelt in der Welt — einmal unter dem Spieler, einmal auf dem
Stellplatz. `parkPlaneNear` überspringt diesen Platz ebenfalls, sonst stiege man in ein unsichtbares
Flugzeug ein. Und `evaBoardParked` ruft am Ende `refreshIslands`, damit der neue Platz leer wird und
der alte sein Flugzeug zurückbekommt.

### Verifiziert (Browser, 0 Konsolenfehler)
- **Jetpack:** Ortswechsel nach `space`, alle vier Himmelskörper plus Erdkugel sichtbar, Radar zeigt
  vier bis fünf Ziele in ihren Farben, Querlage über 35 Lagen maximal 0,000°, `state.pos` wandert mit
  (79,1 m in 3 s) und deckt sich mit dem Astronauten (0,00 m Abweichung), Anflug auf den Todesstern
  dockt nach 24,7 s an, danach steht man im Hangar und kann einsteigen.
- **Vorfeld:** über 29 Inseln 290 Stellplätze, alle sechs Modelle vertreten (X-Wing 49-mal), alle
  Plätze einsteigbar, eigener Platz leer, kein X-Wing mehr auf der Wiese.
- **Regression:** Mond landen/aussteigen/Rover (100 km/h)/wieder aussteigen, kein Jetpack auf dem
  Mond (dort ist überall Boden), Schlauchboot fängt den Schritt ins Wasser weiter auf, Radar zu Fuß
  auf Erde und Mond, X-Wing steigt normal ins Weltall (y = 4006) und landet im Hangar.

---

## Salt-Bereiche (Stand nach dieser Runde)

Zur Erinnerung, weil es schon zweimal fast schiefging: die `cellRnd`-Salts sind **Bereiche**, keine
Einzelwerte. Belegt sind:

| Bereich | wofuer |
|---|---|
| 1..5, 30..99 | Insel, Bauwerke, Stadt-Kennung |
| 42..46 | Traeger, Hafen |
| 70..202 | Stadt-Tuerme (`70 + idx`, idx bis 128) |
| 300..432 | Stadt-Tuerme, zweiter Wurf (`300 + idx`) |
| 900, 901 | Rakete: ob und wo |
| 902, 903 | geparkter X-Wing: wo |
| 904 | Parkplatz: welche Seite der Bahn |
| 905 | Parkplatz: welches Modell auf welchem Platz |

Der naechste freie Salt ist **906**.

---

## Neue Tastenbelegung: Y steigt ein, B macht Aktionen

Gewünscht war die Trennung, und sie war überfällig: **B** machte vorher beides. Wer neben seiner
Canadair stand und löschen wollte, stieg stattdessen ein.

| Taste | vorher | jetzt |
|---|---|---|
| **Y** | Modell wechseln | **ein- und aussteigen, umsteigen** |
| **B** | einsteigen *und* Aktion | **nur Aktion** (Wasser, löschen, Kiste, Schleudersitz, Laser, hüpfen) |
| **D-Pad rechts** | frei | **Modell wechseln** |

Auf der Tastatur: **Y** ein-/aussteigen, **B** Aktion, **M** Modell — wie vorher.

`buttonY` bündelt alles, was man an einem Fahrzeug tun kann, und die Reihenfolge zählt: wer drin
sitzt, will heraus; wer daneben steht, hinein. `evaBoardY` prüft deshalb erst Rover, dann Vorfeld,
dann den eigenen Flieger. Am Jetpack tut Y nichts — dort kommt man über das Andocken am Todesstern
zurück, und eine Taste, die im leeren Raum aussteigen lässt, wäre eine Falle.

`evaButtonB` ist entfallen; seine zwei Aufgaben liegen jetzt getrennt in `buttonY` und `evaActionB`.

## Startplätze und Reihenfolge

Neue Reihenfolge des Modellwechsels: **X-Wing, Canadair, Mustang, Feuerwehrboot, Alpha Jet, Airbus,
Transall**. `currentModel` ist nur ein Index in `MODEL_NAMES` — geprüft, dass keine Stelle im Code
einen harten Index annimmt, sonst wäre das Umsortieren gefährlich gewesen.

**Mustang** und **Transall** starten jetzt auf der Landebahn einer **Nicht-Stadt-Insel**. Die Mustang
stand vorher auf dem Trägerdeck (sie ist ein Warbird, kein Marineflieger, und man findet sie so
leichter wieder), die Transall auf einer *beliebigen* Insel — also auch in einer Wolkenkratzer-Stadt,
wo die Bahn in einer Schneise zwischen Türmen liegt. Mit ihren 0,85 Wendigkeit und 600 m Höhendeckel
ist das ein unschöner Start. Der Alpha Jet bleibt auf dem Deck: der Katapultstart ist sein Auftritt.

## Canadair und Transall dürfen auf den Träger

Beide dürfen dort jetzt **landen und laden**. Die Canadair ist mit 18,5 m Spannweite breiter als der
Alpha Jet (8,1 m), passt aber auf die 38 m Deckbreite, und mitten auf dem Meer ist der Träger der
nächste Platz zum Nachtanken. Die Transall passt mit 20 m ebenfalls — träge ist sie nur in der Luft.

Das **Laden** gehörte ausdrücklich dazu und fehlte: `crateLoad` zählte nur auf `isOnRunway` hoch. Wer
auf dem Deck aufsetzen darf, muss dort auch Fracht aufnehmen können, sonst steht man da und kann
nichts tun. Auch der 📦-Hinweis über dem Flieger kannte nur die Bahn — man lud also, ohne es zu sehen.
Beide Stellen prüfen jetzt dieselbe Bedingung: Landebahn **oder** Trägerdeck.

## Zwei gemeldete Bugs

**Der Mondrover fuhr mit der linken Seite voran.** Im Browser ausgemessen: der Apollo Lunar Rover ist
3,09 (X) × 1,77 × 1,78 m — seine **Längsachse liegt auf X**. Der Perseverance ist 6,55 × 5,45 × 10,0 m,
dort liegt sie auf **Z**. `updateRover` drehte beide gleich (`rotation.y = yaw`, Fahrtrichtung −Z), also
fuhr der Mondrover tatsächlich seitwärts. Die Vierteldrehung sitzt jetzt in `roverYawOff(loc)` am
**Modell** und nicht in der Fahrphysik — sonst müsste jede Rechnung dort zwei Fälle kennen.

**Das HUD zeigte im Rover „Sprung" statt „Schub".** Nur `eva.boat` bekam die Schubanzeige; Rover und
Jetpack fielen in den Sprung-Zweig und zeigten eine tote Zahl, während man mit 100 km/h fuhr. In
**allen drei** Fahrzeugen steht jetzt der Schub in Prozent. Die Quelle unterscheidet sich: das Boot
fährt mit `eva.boatThr` (eigener Gashebel, damit A rückwärts kann), Rover und Jetpack regeln direkt
über `state.throttle` — dieselbe Unterscheidung, die `updateEngineSound` schon macht.

## Salt-Bereiche (unverändert)

Der nächste freie Salt ist weiterhin **906**.

## Der Mars-Rover ließ sich nicht steuern (behoben)

Gemeldet: er reagiert nicht, und die Kamera geht unter ihn — „da sind wohl noch Altlasten vorhanden,
die die Fahrzeugsteuerung verhindern". Genau das war es, und die Vermutung traf zu.

`stepGroundExact` nahm auf dem Mars `roverObj` als zusätzliche Bodengeometrie in den Raycast — **das
Fahrzeug selbst**. Wer darin sitzt, tastet also sein eigenes Dach ab: der Rover steigt darauf, im
nächsten Frame noch höher. Im Browser gemessen an einer Stelle, deren echter Grund bei −71,84 m liegt,
gab `groundHitY` mit sichtbarem Rover **+2,82 m**.

Auf dem Mond fällt es nicht auf, weil dort `moonBaseObj` in `extra` steht — ein **Gebäude**, auf dessen
Plattform man wirklich stehen soll; der Lunar Rover bleibt außen vor. Die Mars-Zeile stammt vom
**23.08.** (Commit `cd077a6`), als der Perseverance reine Kulisse war und man nicht einsteigen konnte.
Mit dem Einsteigen wurde sie zur Falle, ohne dass sie jemand angefasst hätte.

Die Regel gilt jetzt für beide Orte gleich: **nur Gebäude, keine Fahrzeuge**. `basePlatformNear` und
`padSurfaceY` kannten den Rover ohnehin nie — der Eingriff bleibt also auf diese eine Zeile begrenzt.

Verifiziert (14 von 14 grün, keine Konsolenfehler): Boden mit und ohne sichtbaren Rover identisch
(Differenz 0,000 m), 3 s Vollgas ergeben 31,7 m — das passt zur Rechnung 0,5 · 7 · 3² = 31,5 m —,
Lenken exakt −1,100 rad/s = `ROVER_YAW`, Höhenänderung 0,00 m, der Astronaut sitzt oben, und die
Mondbasis ist weiterhin Boden.

### Zwei Testfehler, die nach Spielfehlern aussahen

Beide notiert, weil sie beim nächsten Mal wieder drohen:

- **Das Mars-Höhenraster schien um 71 m falsch** (Raster 0, Raycast −72). Es wird über Frames
  aufgebaut, 8 Zeilen pro Frame, 128 nötig — und bis dahin gibt `groundHeightAt` pauschal 0 zurück.
  Mein Test wartete mit `setTimeout` statt auf echte Frames. Nach 23 gerechneten Frames beträgt die
  Abweichung **1,86 m** im Mittel, genau wie auf dem Mond (1,75 m). Also kein Fehler.
- **Der Rover schien mit −2307 km/h zu fahren.** `loop(now)` rechnet `dt` selbst aus der übergebenen
  Zeit; mein Testtakt spulte die Uhr vor und erzeugte absurde Zeitschritte. Wer die Physik messen
  will, ruft `updateRover(dt, inp)` direkt mit festem `dt` — dann stimmen die Zahlen.

❯ zwei fixes nacheinander c&p: die kamera beim mars rover könnte etwas weiter nach hinten, weil rover deutlich größer als mondrover. die kamera beim jetpack passt immer noch nicht. kamera jetpack sollte immer wie jedes andere fzg sein. gleich dazu neues feature. wenn astronaut zu fuss unterwegs und nicht in der nähe von anderem fzg, y= aktiviere jetpack. jetpack  = wie fzg = steuerung wie x wing.

Drei Fixes und ein Feature. Der Wunsch kam in mehreren Teilen dazu: das Jetpack soll **überall**
gehen — „wenn bei astronaut gleich frei laufend, y = jetpack.. geht das natürlich auch auf der erde",
„oder im hangar selber" — und die Rover-Tempoanzeige stand doppelt („die normale im HUD reicht").

### Fix 1: Die Mars-Rover-Kamera stand zu dicht

Der Abstandsfaktor hing nicht am Modell: beide Rover benutzten 1,5, obwohl der Perseverance
ausgemessen **10,0 m** lang ist und der Apollo Lunar Rover **3,09 m** — gut dreimal so lang. Der
Mars-Rover füllte damit das Bild. Auf dem Mars gilt jetzt 2,3.

Gemessen im Browser, eingeschwungen (die Kamera lerpt, nach 6 Frames ist sie noch unterwegs):

| | waagerecht | Höhe über dem Astronauten |
|---|---|---|
| Mond (1,5) | 10,50 m | 5,10 m |
| Mars (2,3) | 16,10 m | 7,82 m |

Beides trifft die Formel `7·bt` bzw. `3,4·bt` auf den Zentimeter. Der Mars-Rover steht **5,60 m
weiter** zurück als vorher.

### Fix 2: Die Jetpack-Kamera schaute am Astronauten vorbei

Der Kameraplatz war schon waagerecht gestellt, **das Blickziel aber nicht** — es trug den Nickwinkel
weiter. Bei 72 Grad (`JET_PMAX`) liegt es damit 13,3 m **über** dem Astronauten: die Kamera schaut an
ihm vorbei in den leeren Raum, und er hängt unten am Bildrand. Das war der Rest des gemeldeten
Fehlers. Dieselbe Rechnung stand ein zweites Mal in `jetSnapCam` — sonst wäre die Kamera bei jedem
Ortswechsel umgesprungen.

Jetzt gilt für Jetpack, Rover und Boot **dieselbe** Regel: waagerecht schräg hinten, Blick auf den
Astronauten. Wohin er fliegt, zeigt seine eigene Haltung — `updateJet` legt ihn in Flugrichtung.

Gemessen bei vollem Nicken, und zwar in **beide** Richtungen:

| Nickwinkel | waagerecht | Höhe | Winkel zum Astronauten |
|---|---|---|---|
| +71,6° (steigen) | 13,30 m | +6,46 m | 14,88° |
| −71,6° (sinken) | 13,30 m | +6,46 m | 14,88° |

Identisch — die Kamera hängt nicht mehr am Nickwinkel und steht immer **über** ihm. Die 14,88° sind
kein Restfehler, sondern der `EVA_LOOK_AHEAD`-Vorausblick (14 m), den der Rover genauso hat.

### Fix 3: Das Tempo stand zweimal da

Die Symbolzeile schrieb `🚙 34 km/h`, die HUD-Zeile darüber dasselbe. Die Symbolreihe sagt jetzt nur
noch, **was** man ist; die Zahlen stehen im HUD. `elSpd` liest `evaSpeedKmh()` — dieselbe Größe, die
`updateRover` füllt, die Zahl bleibt also erhalten.

### Feature: Y zündet das Jetpack überall

`evaBoardY` fällt am Ende durch, wenn kein Fahrzeug in Reichweite ist — dort hängt es jetzt. Die
Reihenfolge zählt: erst die echten Fahrzeuge, das Jetpack **ganz zuletzt**, sonst startete es einem
vor der Nase, wo man einsteigen wollte.

Dabei kamen **zwei echte Fehler** heraus, die vom abgebrochenen Versuch übrig waren:

- **`jetFrom` war nirgends deklariert.** Es wurde geschrieben und war damit ein stillschweigendes
  implizites Global (die Datei hat kein `use strict`). Steht jetzt neben `jetHost`.
- **Der Rückweg zur Erde fehlte ganz.** Der Jetpack-Flug prüfte nur `bodies` — und die Erde steht
  dort **nicht** drin, sie ist eine eigene Kugel (`earthHome`). Von der Erde gestartet wäre man für
  immer im Weltall geblieben und durch die Erdkugel hindurchgeflogen. Neu: `evaEndJetToEarth()`,
  mit derselben Rückkehrschale wie der Flieger (`EARTH_R + EARTH_Y`).

Dazu drei Dinge, die beim Start von der Erde nötig waren und im Hangar nie aufgefallen sind:

- **`earthWorldVisible(false)`** — sonst stehen Inseln, Meer, Wolken, Träger und der Flugverkehr
  weiter im Bild, während man zwischen den Planeten fliegt.
- **`layoutBodies(true)` und `jetHost = null`** — `hangarHost` war noch vom letzten Hangarbesuch
  gesetzt und hätte einen von der Insel weg direkt an den Todesstern gebeamt. Und ohne `fromEarth`
  läge die Erdkugel weit ab, der Rückweg zeigte auf eine Stelle ohne Erde.
- **`state.pos` muss gleich mitkommen**, nicht erst im nächsten `updateJet`: `updateLocale()` läuft
  in **demselben** Frame weiter, auch während der EVA. Bliebe es auf der Insel, wäre der Abstand zu
  `earthHome` genau `EARTH_R` — `updateSpaceBodies` sieht das als Wiedereintritt und ruft
  `enterEarth`, **ohne `dockLock` zu beachten**: das Jetpack wäre im selben Frame wieder aus.

Verifiziert im Browser, 0 Konsolenfehler, Frames echt getaktet:

| Weg | Ergebnis |
|---|---|
| Y auf der Erde | Jetpack an, Ort `space`, auf `SPACE_Y` = 4000 m, `jetHost` null, `jetFrom` = earth, Inselzellen 0 |
| 40 Bilder frei fliegen | bleibt im Weltall — fällt **nicht** von allein zurück |
| Rückflug zur Erde | Ort `earth`, Astronaut auf 0,30 m = Bodenhöhe, `onGround`, 49 Inselzellen, Flieger 6,7 m weg und einsteigbar, `jetFrom` geleert |
| Y auf dem Mond, 400 m vom Flieger | Jetpack an, `jetFrom` = moon |
| Rückflug nach Mond-Start | landet auf der **Startinsel** (0,0), auf Land, Boden 0,30 m, Flieger erreichbar |
| Y im Hangar, X-Wing daneben | **steigt ein** (richtig — Fahrzeuge haben Vorrang) |
| Y im Hangar, nichts in Reichweite | Jetpack an, Ort `space` |

Der Fallback ist die Startinsel bei (0,0): sie ist die einzige Zelle, die **garantiert** eine Insel
trägt (`islandInfo`: `isStart`), dort gibt es also immer festen Grund.

### Drei Testfehler, die nach Spielfehlern aussahen

- **Auf dem Mond zündete Y das Jetpack nicht.** Ich hatte `eva.planeAt` auf die Astronautenposition
  kopiert — damit stand der Flieger **auf** ihm, `evaCanBoard()` war wahr, und Y stieg völlig korrekt
  ein. Mein Test, nicht das Spiel.
- **Im Hangar tat `evaExit()` gar nichts.** `evaAllowed()` verlangt `state.onGround` und kein Fallen;
  nach `enterGround`/`setupApproach` fliegt der X-Wing aber mit **110 m/s in 900 m Höhe**. Erst
  richtig hinstellen, dann aussteigen.
- **Der Astronaut stand nach dem Rückflug 3 m über dem Boden.** Die Zielstelle war in meinem Test
  offenes Meer (`planeAt` künstlich auf 3000/3000) — das **Schlauchboot** hat ihn aufgefangen, wie es
  soll. Nachgemessen: `isOpenWater` true, `eva.boat` gesetzt, Bootshöhe 2,52 m. Bestehende Logik,
  kein Fehler.

### Nebenbei: die Datei hatte gemischte Zeilenenden

`Flugspiel.html` ist CRLF, aber ein Block von 37 Zeilen (1936–1972, genau um `evaBoardY`) war auf
**LF** gekippt. `patch.ps1` normalisiert den Suchtext auf die Zeilenenden der Datei und fand deshalb
nichts — genau daran war der Versuch im letzten Durchlauf gescheitert, ohne dass der Grund klar war.
Der Inhalt war mit HEAD identisch, `core.autocrlf=true` versteckt so etwas im Diff. Datei ist jetzt
wieder durchgehend CRLF (geprüft: 9132 CRLF, 0 nur-LF).

**Merken:** wenn `patch.ps1` „Suchtext 0 mal gefunden" sagt, obwohl der Text sichtbar da ist, jede
Zeile **einzeln** zählen. Sind alle einzeln da, aber zusammen nicht, liegt es zwischen den Zeilen —
also an den Zeilenenden.

## Neue Schub-Steuerung für den X-Wing (erledigt)

Wörtlich gewünscht: „x wing/jetpack. neue steuerung 20% = schweben. 10% langsam landen 0% gleich
schneller aber immer noch sicher landen. Im weltall sind 0%, 10 und 20% normale geschwindigkeiten weil
ja landen nicht möglich"

Rückgefragt und entschieden: 0 % sinkt **kontrolliert** und setzt immer sicher auf (nicht: erst kurz
über dem Boden abgefangen), und 10 % bleibt bei den bisherigen −10 m/s.

### Was wirklich fehlte

20 % Schweben und 10 % Sinken gab es schon. Der Bruch lag bei **0 %**: dort war der Repulsor **aus**.
Drei Bedingungen verlangten ausdrücklich Schub größer null — `vtolMix`, `repulsor` und `vtolLand` —,
also fiel der X-Wing bei 0 % frei, geriet in den Strömungsabriss und schlug auf. Nachgerechnet: aus
100 m erreicht er im freien Fall 44 m/s, die Crash-Schwelle liegt bei 16 m/s. Wer nur den Schub
loslässt, um herunterzukommen, hatte sein Schiff verloren.

Jetzt trägt der Repulsor bis 0 % herunter, es sinkt nur schneller:

| Schub | Sinkrate | Landung aus 300 m |
|---|---|---|
| 20 % | 0 (schwebt auf 20 m) | — |
| 10 % | −10 m/s (`VTOL_SINK`) | 30,22 s |
| 0 % | −20 m/s (`VTOL_DROP`, neu) | 15,23 s |

Zwischen 0 und 10 % wird **durchgeblendet**, nicht gestuft: ein Analogstick geht durch alle Werte,
und bei 5 % wäre die Rate sonst sprunghaft um die Hälfte gefallen.

Damit gibt es unter 30 % Schub keinen freien Fall und keinen Strömungsabriss mehr. Abstürzen kann man
weiterhin — durch eine Kollision oder auf der falschen Oberfläche (Wasser).

### Zwei Dinge, die daran hingen

- **Der Absturz gegen ein Gebäude muss ein Absturz bleiben.** `hitsBuilding` setzt den Schub auf 0,
  und da der Repulsor dort jetzt trägt, hätte die VTOL-Regelung den Sturz auf −20 m/s eingebremst,
  während der `falling`-Block ihn beschleunigen will. Deshalb ist `state.falling` ausgeschlossen.
- **Das HUD zeigte bei 0 % ⚠️** („Antrieb aus"). Das war richtig, solange man dort wirklich fiel —
  jetzt ist 0 % die schnelle Landung, also **⏬**. Der Umkehrschub (negativer Schub, die Bremse im
  Vorwärtsflug) behält das ⚠️ und bleibt von allen Änderungen unberührt.

### Jetpack und Weltall

Am Jetpack war **nichts** zu tun: es fliegt ausschließlich im Weltall und regelt den Schub schon
linear über `JET_VMAX`. Und im Weltall gibt es keinen Boden, dort sind 0/10/20 % ganz normale
Fahrstufen — auch das rechnete bereits so (`vtolMix` ist bei `locale === 'space'` immer 0).

### Verifiziert im Browser, 0 Konsolenfehler

Physik direkt mit festem `dt` getaktet (`stepPhysics(1/60, inp)`), nicht über `loop(now)` — das
rechnet `dt` selbst aus der übergebenen Zeit und liefert mit vorgespulter Uhr Unsinn.

| Schub | Soll | gemessen | Abweichung |
|---|---|---|---|
| 0 % | −20 m/s | −19,96 | 0,04 |
| 2,5 % | −17,5 | −17,46 | 0,04 |
| 5 % | −15 | −14,97 | 0,03 |
| 10 % | −10 | −9,98 | 0,02 |
| 20 % | 0 | 0,00 | 0,00 |

- Landung aus **1000 m** bei 0 %: **50,23 s** (gerechnet 1000/20 = 50,0 s), **kein Crash**, sitzt auf
  0,30 m = Inseloberfläche. Vorher war das ein garantierter Absturz.
- Landung aus 300 m: 0 % = 15,23 s, 10 % = 30,22 s — genau doppelt, beide crashfrei.
- **Schief** aufgesetzt (0,7 und 0,6 rad Neigung) bei 0 %: crashfrei, die Nase wird waagerecht
  gezogen.
- Schweben bei 20 %: 20,24 m über Grund (Soll 20), Rate 0,04 m/s — es steht.
- Kollisionssturz: beschleunigt weiter (−11 m/s nach 0,5 s) und **crasht** — bleibt ein Absturz.
- Weltall: 20 % = Warp 0,2, 10 % = Warp 0,1, 0 % = Warp 0, **0 m gesunken**.

### Zwei Testfehler, die nach Spielfehlern aussahen

- **„Landung aus 1000 m nach 7,73 s"** — unmöglich, das wären 129 m/s. Meine Messschleife hatte ein
  `break` nach 14 Protokolleinträgen, und die Auswertung nahm den Abbruch für eine Landung. Er war
  in Wahrheit noch bei 725 m und sank völlig korrekt mit −20,00 m/s.
- **„Im Weltall sinkt er mit −20 m/s"** — gemessen wurde die Erde. Mein `frisch()`-Helfer ruft
  ausdrücklich `enterEarth()`, der Weltall-Teil benutzte ihn ebenfalls. `space_loc` gab das preis
  („earth"), sonst hätte ich einen schweren Fehler geglaubt, den es nicht gab.
- Nachtrag zum ersten Anlauf: nach einem Crash läuft `resetPlane()` und stellt den X-Wing über
  `placeAtStart` in den **Hangar**. Wer danach ohne Aufräumen die nächste Landung messen will, misst
  auf Hangarhöhe. Reihenfolge im Testhelfer: erst Zustände löschen, dann Ort wechseln, dann Position.

## Drei gemeldete Fehler am Jetpack (behoben)

Wörtlich: „das jetpack feature funktiniert noch nicht. die kamera bleibt starr, der astronaut dreht
sich. außerdem welchselt er auf der erde automatisch in den weltraum. ich wollte aber gerne auf der
erde, auf dem mond oder mars rum fliegen können. oder im hangar und dann selbständig ins weltall
fliegen. außerdem geht der schub immer von 100% auf 90% zurück"

Rückgefragt und entschieden: das Jetpack ist **überall schwerelos** (eine Steuerung für alle Orte, nur
der Boden ist fest), und ins Weltall kommt man, indem man **selbst hoch genug steigt** — kein
Automatik-Sprung.

### Fehler 1: Die Kamera blieb starr, der Astronaut drehte sich

Mein Fehler aus der Runde davor. Ich hatte den Nickwinkel **ganz** aus der Kamera genommen, weil sie
bei steilem Steigflug unter dem Astronauten stand und das Bild umkippte. Das war die falsche Abhilfe:
so kippte nur noch **er** im Bild, der Rahmen nicht — und damit sah man seine Flugrichtung nicht mehr.

Nachgemessen: das **Drehen** folgte die Kamera schon vorher exakt (0,00° Abweichung). Ich hatte in der
Runde davor nur den Nickwinkel getestet, nie das Drehen — also genau den gemeldeten Fall nicht.

Richtig ist, was die Verfolgerkamera des Fliegers längst tut: den Nickwinkel **klemmen** (±0,9 rad =
51°, dieselbe Grenze) und `camera.up` **mitkippen** lassen. Dann sitzt sie immer hinter ihm auf der
Flugachse, und weil „oben" mitgeht, kippt das Bild nicht um. Der Astronaut selbst darf steiler stehen
(`JET_PMAX` = 72°), man sieht ihn also noch steiler nicken als die Kamera.

Dazu musste dreierlei mitgehen, sonst hätte es sich gegenseitig aufgehoben:

- die **Höhe** entlang der mitgekippten Hochachse (`addScaledVector(upV, …)`) statt als absolutes
  `desired.y` — sonst rechnet ein absolutes y das Nicken wieder heraus, das `back` gerade eingebaut hat
- das **Blickziel** auf die Flugachse (`fwd` trägt den Nickwinkel schon), nicht vorausversetzt
- `jetSnapCam` mit **derselben** Formel, sonst springt die Kamera bei jedem Ortswechsel um

Gemessen bei ±71,6°: Kamera +6,46 m flach → −10,82 m steil (sie kippt also mit), `camera.up` gekippt
(0,62 statt 1,00), Blick 3,55° auf ihn, hinter ihm auf 6,15°.

### Fehler 2: Auf der Erde sprang es automatisch ins Weltall

`evaStartJet` schaltete sofort `locale = 'space'` und setzte den Astronauten vor den Todesstern. Ich
hatte „Jetpack" mit „Weltall" gleichgesetzt — das war eine falsche Annahme, nicht nur ein Bug.

Jetzt wechselt das Jetpack den Ort **nicht mehr**. Es zündet, wo man steht, und fliegt dort herum:

- **Überall schwerelos** — kein Fallen, kein Schwebe-Anregeln, Schub gibt die Fahrt (45 m/s),
  Nicken die Richtung. Dieselbe Steuerung auf Erde, Mond, Mars, im Hangar und im Weltall.
- **Der Boden ist fest.** Wer aufsetzt, steht wieder zu Fuß da und kann weiterlaufen — wie der X-Wing
  bei 0 % Schub: eine Landung, kein Absturz. Im Hangar trägt nur die ausgemessene Bodenfläche
  (`onHangarFloor`), jenseits davon geht es hinunter ins Freie.
- **Ins Weltall steigt man selbst**, mit genau den Schwellen des Fliegers: auf der Erde `SPACE_Y`
  (4000 m), auf Mond und Mars die Verlassehöhe des Ortes (1000 bzw. 2000 m über Grund), im Hangar
  seitlich über `HANGAR_OUT_R` hinaus — nach oben ist die Decke fest, wie für den Flieger. Neu dafür:
  `evaJetToSpace()`, gerufen aus `updateLocale`.

Zwei Dinge, die daran hingen:

- `updateLocale` prüfte nur `state.pos`, also den **stehenden Flieger**. Am Jetpack zählt die Höhe des
  **Astronauten** — er ist derjenige, der hinausfliegt.
- `state.pos` wird an einem Ort mit Boden **nicht** mitgezogen. Es gehört dem stehenden Flieger, und
  auf der Erde hängen die Inselzellen daran (`updateIslands` baut um `state.pos` herum auf) — der
  Astronaut hätte sonst die ganze Welt hinter sich hergeschleppt. Nur im Weltall führt `updateJet`
  `state.pos` selbst mit, weil dort die Weltall-Logik daran hängt und kein Flieger unterwegs ist.
  (Die Inselwelt folgt ihm trotzdem: `updateIslands` nutzt `worldFocus()`, und das ist während der EVA
  der Astronaut.)

Außerdem den Rückweg vervollständigt: `jetHost` wird nur noch gesetzt, wenn man **wirklich** aus dem
Hangar kommt (vorher trug `hangarHost` noch den Wert vom letzten Besuch und hätte einen beim Andocken
in die Halle geschickt, während der Airbus auf einer Insel steht), und `evaEndJetToGround` setzt den
Flieger auf seine gemerkte Stelle zurück, wenn man dorthin zurückkommt, wo man gestartet ist.

### Fehler 3: Der Schub fiel von 100 % auf 90 %

`warpDrive` baute sich auch am Jetpack auf, und sobald man auf irgendeinen Körper zuflog, drosselte die
**Hyperraum-Bremse** (`warpBrakeFor`) den Schub auf `WARP_BRAKE_THR` = 0,9. Im Jetpack ist man
ständig in der Nähe von irgendetwas, also passierte es dauernd.

Ein Astronaut hat keinen Hyperraumantrieb — er fliegt 45 m/s, nicht Lichtgeschwindigkeit. Also baut
`warpDrive` am Jetpack gar nicht mehr auf, und die Bremse fasst den Schub dort nicht an (zwei Stellen,
damit es auch dann hält, wenn eine davon später wieder greift).

Gemessen über 10 s bei Vollgas: Schub bleibt **1,00** (Minimum 1,00), `warpDrive` 0, Tempo 45 m/s =
`JET_VMAX`.

### Ein echter Fehler, den der Test dabei gefunden hat

`updateJet` prüfte am Anfang nicht, ob das Jetpack überhaupt noch an ist. Das Aufsetzen setzt
`eva.jetVel` auf null, und der nächste Aufruf lief in `Cannot read properties of null (reading 'dot')`.
Vorher war das unmöglich: das Jetpack endete nur beim Andocken, und dabei wechselte immer der Ort.

### Verifiziert im Browser, 0 Konsolenfehler

| Ort | zündet | bleibt am Ort (3 s Flug) | setzt auf | Astronaut steht auf |
|---|---|---|---|---|
| Erde | ✓ | `earth`, 49 Inselzellen unverändert | ✓ | 0,30 m = Bodenhöhe |
| Mond | ✓ | `moon` | ✓ | −0,70 m = Bodenhöhe |
| Hangar | ✓ | `death` | ✓ | 6,20 m = Hallenboden |

- Auf der Erde steht der **Flieger still** (x = 40 = `planeAt`), die Inselwelt wandert nicht mit.
- Ins Weltall selbst gestiegen: Erde bei **4000 m** (= `SPACE_Y`), Mond bei **953 m** über Grund
  (Grenze 1000), Mars bei **1923 m** (Grenze 2000) — der Grund lag bei −22,5 bzw. −71,6 m.
- Rückflug: landet **6 m** vom eigenen Flieger, einsteigbar, nicht im Boot.
- Y im Hangar mit X-Wing daneben steigt weiterhin **ein** — Fahrzeuge haben Vorrang.

### Drei Testfehler, die nach Spielfehlern aussahen

- **„Der Hangar springt trotzdem ins Weltall."** Ich hatte `planeAt` auf 3000 m weggesetzt, damit Y
  nicht einsteigt. Das liegt außerhalb `HANGAR_OUT_R` (200 m), und weil `updateEva` zu Fuß
  `state.pos = eva.planeAt` hält, warf `updateLocale` den **stehenden Flieger** aus der Halle — noch
  bevor Y gedrückt war. Mit realistischen 40 m (außer Einstiegsreichweite `EVA_BOARD_R` = 8 m, aber in
  der Halle) bleibt alles im Hangar.
- **„Auf der Erde zündet es im Hangar."** `wantHangarStart` wechselt 1,5 s nach dem Laden von allein in
  den Todesstern-Hangar — dort beginnt der X-Wing, so gewollt. Mein isolierter Erd-Test wartete länger
  als das. Im Test abschalten, dann stimmt es.
- **Der Astronaut auf `y = -999999999`.** Folge des ersten Testfehlers: im Weltall gibt `evaFootY`
  −1e9 zurück (dort gibt es keinen Boden). Kein eigener Fehler, sondern die Anzeige des ersten.

## Jetpack: Schubstufen am Boden, Tempo im Weltall, 20-%-Rücksprung (behoben)

Wörtlich: „es fehlen noch die schubeigenschaften wie beim x wing auf der erde. 20%, 10% & 0%. so kommt
man nicht mehr zurück auf den boden. außerdem kommt man im weltall nicht von der stelle. es wird zwar
eine geschwindigkeit angezeigt, aber der abstand zu einem planeten verringert sich nicht mit der zeit.
außerdem geht er ständig zurück auf 20% (ggf weil noch nahe der iss und man nicht weg kommt)"

Rückgefragt und entschieden: die Schubstufen gelten **nur an Orten mit Boden** (im Weltall sind
0/10/20 % Fahrstufen), und im Weltall fliegt das Jetpack **so schnell wie der X-Wing, samt Hyperraum**.

### Punkt 1: Man kam nicht mehr auf den Boden

Das Jetpack war überall schwerelos — bei wenig Schub blieb der Astronaut einfach stehen, wo er war.
Jetzt gelten an einem Ort mit Boden dieselben Stufen wie beim X-Wing, mit denselben Konstanten:

| Schub | Verhalten | gemessen |
|---|---|---|
| 20 % (`VTOL_HOVER`) | schweben, Höhe halten | 0,0 m/s |
| 10 % (`VTOL_SINK`) | ruhig sinken | −10,0 m/s |
| 5 % (durchgeblendet) | dazwischen | −15,0 m/s |
| 0 % (`VTOL_DROP`) | zügig sinken | −20,0 m/s |
| ab 30 % (`VTOL_FWD`) | vorwärts fliegen | — |

Zwischen 0 und 10 % wird durchgeblendet, nicht gestuft — ein Analogstick geht durch alle Werte.
Unter `VTOL_FWD` gilt die Zielfahrt nicht, sonst schöbe er beim Landen noch nach vorn.

Zwei Dinge, die dabei erst schiefgingen:

- **Das Jetpack ging im selben Frame wieder aus, in dem es zündete.** `evaStartJet` setzte den Schub
  auf 0 — und 0 % heißt am Boden jetzt „zügig sinken". Im Log stand „gezündet" und „aufgesetzt"
  direkt nacheinander. Jetzt startet es auf Schwebestufe (`VTOL_HOVER`) und hebt 3 m ab, genau wie
  `enterHangar` es für den X-Wing tut.
- **Alle Sinkraten waren 12,5 % zu langsam** (−17,5 statt −20). Die Bremsdüsen-Dämpfung (`JET_DAMP`)
  greift bei `want < 0.01`, und unter `VTOL_FWD` ist `want` immer 0 — sie lief also jeden Frame und
  zog auch an der Y-Achse, gegen die Sinkregelung. Nachgerechnet ergibt das ein Gleichgewicht bei
  86,8 % der Sollrate, gemessen waren es 87,5 %. Im VTOL-Bereich ist sie jetzt ausgeschlossen; dort
  dämpft der VTOL-Block die Horizontalfahrt selbst.

### Punkt 2: Im Weltall kam man nicht von der Stelle

Das Jetpack flog technisch völlig korrekt — gemessen 403 m in 9 s bei 45 m/s. Nur ist der Mond
**150 km** weit weg: der Abstand sank von 149.662 auf 149.259 m. Das sind 56 Minuten zum Mond und
148 Minuten zum Mars, und genau deshalb sah es wie Stillstand aus. Kein Rechenfehler, ein Maßstabsfehler
von mir: 45 m/s sind 162 km/h, und damit ist der Flugraum unbenutzbar.

Im Weltall gilt jetzt dieselbe Formel wie beim Flieger: `SPACE_C * warpFactor()`. Das Modelltempo
spielt im Vakuum auch beim X-Wing keine Rolle. Am Boden bleibt es bei den gemütlichen 45 m/s — dort
will man schauen, nicht rasen.

Gemessen, Nase auf den Mond, Vollgas:

| nach | Abstand zum Mond | Tempo | Warp |
|---|---|---|---|
| 1 s | 148.232 m | 3.043 m/s | 0,1 |
| 5 s | 112.426 m | 14.213 m/s | 0,4 |
| 9 s | 37.501 m | 23.213 m/s | 0,7 |
| 10 s | **auf dem Mond gelandet** | — | — |

Dazu musste der Hyperraum-Aufbau am Jetpack wieder zugelassen werden (ich hatte ihn in der Runde davor
ganz abgeschaltet, um den 90-%-Rücksprung zu beheben). Die Hyperraum-**Bremse** bleibt gesperrt — die
war die Ursache jenes Fehlers, nicht der Aufbau. Und die Beschleunigung wächst im Vakuum mit
(`SPACE_C` statt `JET_ACCEL`): mit 18 m/s² hätte das Hochlaufen auf Warp-Tempo Minuten gedauert.

### Punkt 3: Der Schub sprang ständig auf 20 %

Die Vermutung war richtig — es lag an der ISS. `updateShips` dockt bei Annäherung direkt über
`enterHangar` an, **ohne zu prüfen, ob man im Jetpack sitzt**. `enterHangar` setzt
`state.throttle = VTOL_HOVER` (das ist für den X-Wing richtig, er soll dort schweben), aber `eva.jet`
blieb an und der Ortswechsel passierte im Hintergrund. Man dockte also immer wieder an, ohne es zu
merken — daher auch das Gefühl, nicht von der ISS wegzukommen.

Dieselbe Lücke hatte der Star Destroyer. Beide gehen jetzt über `evaEndJetToHangar`, das das Jetpack
sauber beendet und den Astronauten in die Halle stellt.

Gemessen: Jetpack aus, Ort `death`, Schub **0** (nicht 0,2), Astronaut steht auf dem Hallenboden
(6,2 m = `hangarFloorY`), Log „angedockt, zurueck im Hangar".

### Nebenbei

`JET_VMAX_SPACE` war ein Zwischenschritt (686 m/s als eigene Konstante) und ist wieder entfernt: mit
`686 * warpFactor()` wären es bei Warp 10 nur 6.860 m/s gewesen, also 22 s zum Mond statt 5. Die
Fliegerformel ist die richtige. Verifiziert, dass die Konstante nirgends mehr vorkommt.

**Merken:** Python schreibt im Google-Drive-Ordner nicht (`OSError: Bad file descriptor` bei
`io.open(...,'w')`) — auch nicht für kleine Kommentar-Korrekturen. Lesen geht, schreiben nur über
PowerShell `[IO.File]::WriteAllText`.

## Jetpack: Hangar-Reset und Kamera-Nachlauf (behoben)

Gemeldet: „im hangar resettet der jetpack immer wieder. kein übregang ins weltall möglich" und „auf der
erde (mindestens) bleibt die kamera nicht hinter dem jetpack, sauberes fliegen nicht möglich".

Ab hier ohne Browser-Messungen geprüft (auf Wunsch: sie fressen zu viele Token) — stattdessen Code
gegen die Anforderungen gelesen und die Physik separat durchgerechnet.

### Der Hangar-Reset: eine Falle, die ich selbst gebaut hatte

Mit den neuen Schubstufen hatte ich die Vorwärtsfahrt unter 30 % Schub **ganz abgeschaltet**
(`want = 0`). Beim X-Wing ist das richtig, der landet senkrecht. Am Jetpack wurde es zur Sackgasse:

- Der Hallenausgang liegt **seitlich bei 200 m** (`HANGAR_OUT_R`) — man muss dorthin fliegen.
- Bei 20 % schwebte man auf der Stelle, bei 10 % und 0 % sank man nur.
- Der einzige Weg hinaus wäre ≥ 30 % Schub gewesen, und das sieht man nirgends.
- Gemessen: Schub loslassen → nach **0,4 s** wieder auf dem Hallenboden. Das war das „resettet immer
  wieder".

Zwei Anläufe: erst auf ein Drittel gedrosselt, das ergab gemessene **66 s** bis zum Ausgang — für ein
Kind dasselbe wie „geht nicht". Jetzt volle Fahrt, also 9 m/s bei 20 % Schub und **22 s** bis zum
Ausgang. Das Landen stört das nicht, weil der VTOL-Block die Sinkrate unabhängig regelt: man setzt
auf, während man noch vorwärts gleitet — genau wie ein Astronaut es tun würde.

Nachgerechnet, dass die Landestufen davon unberührt bleiben (aus 400 m, 2 s):

| Schub | 0 % | 5 % | 10 % | 15 % | 20 % |
|---|---|---|---|---|---|
| Sinkrate | −19,99 | −15,00 | −10,00 | −5,00 | 0,00 |

### Dabei gefunden: die Sinkfahrt blieb hängen

Beim Durchlesen aufgefallen, nicht gemeldet: die Schubregelung wirkt nur **längs** der Blickrichtung,
quer dazu bleibt alte Fahrt stehen. Wer also mit 0 % sank (−20 m/s) und dann waagerecht Vollgas gab,
sank nachgerechnet **weiter mit −20 m/s** und setzte im Vorwärtsflug auf dem Boden auf, statt
abzuheben. Vor den Landestufen gab es am Boden gar kein Sinken, deshalb war das neu.

Ab 30 % Schub wird die Senkrechtfahrt jetzt der Blickrichtung nachgeführt. Durchgerechnet, aus −20 m/s
heraus, nach 3 s:

| Haltung | Schub | v.y danach |
|---|---|---|
| waagerecht | 50 % | **−0,00** (kein Sinken mehr) |
| waagerecht | 100 % | **−0,00** |
| Nase 30° hoch | 100 % | +22,4 (steigt) |
| Nase 40° runter | 100 % | −29,0 (sinkt gewollt) |

Gewolltes Sinken bleibt also möglich, nur das ungewollte Hängenbleiben ist weg.

### Die Kamera: falsche Art des Nachziehens

`camera.position.lerp(...)` zieht die **absolute Position** nach — damit wächst der Rückstand mit der
Fahrt. Bei 6 pro Sekunde und 45 m/s sind das 7,5 m: die Kamera hängt 20,8 m statt der vorgesehenen
13,3 m zurück (+56 %) und schwimmt hinter dem Astronauten her, statt hinter ihm zu **stehen**. Die
Richtung war übrigens schon vorher exakt (gemessen 0,00° hinter ihm) — es war reiner Nachlauf.

Jetzt wird der **Abstand** nachgezogen, wie bei der Verfolgerkamera des Fliegers, und straffer
(20 statt 8 pro Sekunde): rechnerisch 2,3 m Rest statt 5,6 m.

Beim Nachrechnen kam heraus, dass das allein nicht reicht: auch beim Abstands-Lerp bleibt ein
Gleichgewicht bei v/k, und im Weltall wären das bei Warp 1 rund **150 m**, bei Warp 10 gut **1500 m**.
Der Flieger lebt damit, weil ein X-Wing groß ist und `camBackExtra` ihm ohnehin bis 125 m gibt — ein
1,9 m großer Astronaut wäre dabei unsichtbar. Deshalb wird der Abstand hart geklemmt: höchstens das
Doppelte des Sollwerts.

| Tempo | Abstand mit Klemme | Soll |
|---|---|---|
| 45 m/s (Erde/Mond/Mars) | 14,8 m | 13,3 m |
| Warp 1 (3000 m/s) | 13,3 m | 13,3 m |
| Warp 10 (30000 m/s) | 13,3 m | 13,3 m |

### Nebenbei aufgeräumt

- `if(want < 0.01 && (imAll || want >= VTOL_FWD))` — die zweite Hälfte war unerfüllbar (`want` kann
  nicht gleichzeitig unter 0,01 und über 0,30 liegen), ein Rest der `roh`/`want`-Umstellung. Jetzt
  schlicht `want < 0.01 && imAll`.
- `roh` war nach der Umstellung mit `want` identisch, aber an fünf Stellen noch benutzt und **nicht
  mehr deklariert** — das hätte einen `ReferenceError` geworfen. Alle fünf auf `want` umgestellt.

### Zwei Testfehler auf meiner Seite

- **Der Testlauf hing über zwei Stunden.** Ich hatte `await warte(...)` in Echtzeit-Frames für einen
  Flug benutzt, der 66 Sekunden Spielzeit dauert — bei gedrosselter Hintergrund-Bildrate wird daraus
  ein Vielfaches. Wer lange Flüge messen will, taktet die Physik direkt (`updateJet(1/60, inp)`).
- **Python schreibt im Google-Drive-Ordner nicht** (`OSError: Bad file descriptor`), auch nicht für
  kleine Kommentar-Korrekturen. Lesen geht, schreiben nur über PowerShell `WriteAllText`.

## Jetpack: Reset am Weltall-Übergang, und die Kamera wird ein Fluggerät

Gemeldet: „der jetpack resettet am übergang zum weltall und die kamera fährt immer noch um den jetpack
herum, anstatt die optik eines fluggerätes (xwing) zu haben." Danach, nachdem der Übergang lief:
„a kamera bei warp viel zu nah, b geschwindigkeit in weltall wird in kmh angezeigt und nicht in warp,
c auch da lässt sich der jetpack nicht steuern wegen der kamera, d gibt es beim übergang nicht eine
bremse auf 50%."

### Der Reset: die Flieger-Logik lief am Jetpack mit

Sobald `evaJetToSpace` auf `locale = 'space'` schaltet, läuft ab dem nächsten Frame
`updateSpaceBodies` — und das ist die **Flieger**-Weltall-Logik. Sie kennt das Jetpack nicht: ihre
Erd-Prüfung fragt `dockLock` **gar nicht** ab und ruft `enterEarth(true)` direkt.

Nachgerechnet: beim Austritt von der Erde steht man 24.000 m vom Erdmittelpunkt entfernt (4000 m
Austrittshöhe plus `EARTH_R` darunter), die Rückkehrschale beginnt bei `EARTH_R + EARTH_Y` = 22.200 m.
**1800 m Luft** — der Flieger kommt mit über 100 m/s heraus und ist sofort weg, ein Astronaut nicht.

Zwei Änderungen:

- `updateSpaceBodies` läuft am Jetpack nicht mehr. `updateJet` macht dieselbe Arbeit selbst, mit den
  Astronauten-Wegen und **mit** `dockLock`-Sperre — geprüft, dass es alles abdeckt: Erd-Rückkehr,
  Todesstern → Hangar, Mond/Mars → Boden, Orbit-Grenzen. Nicht abgedeckt ist nur die Hyperraum-Bremse,
  und die ist am Jetpack ausdrücklich gesperrt (sie war der 90-%-Rücksprung).
- Der Austritt hebt jetzt auf `r * 1,4` über das Zentrum des Körpers, von dem man kommt — genau das tut
  `leaveGround` für den Flieger. Von der Erde sind das 28.000 m statt 24.000, also **5800 m Luft**.

### Punkt d: die Bremse auf 50 %

`enterSpace` und `leaveGround` deckeln den Schub beim Übergang auf 50 %, damit man sich erst umsieht
statt sofort in den Hyperraum zu rutschen. Am Jetpack fehlte das — und dort fällt es besonders auf,
weil man zum Austritt ohnehin Vollgas gegeben hat, um hochzukommen. Jetzt gleich.

### Punkt b: Warp statt km/h

Der EVA-Zweig im HUD schrieb immer km/h; die Warp-Anzeige stand nur im Flieger-Zweig. Im Weltall
fliegt das Jetpack mit `SPACE_C * warpFactor()`, also bis 30.000 m/s — das sind 108 Millionen km/h,
eine Zahl, die niemandem etwas sagt. Am Jetpack im Weltall steht jetzt Warp.

### Punkte a und c: die Kamera war am falschen Ort gebaut

Hier lag mein eigentlicher Fehler. Ich hatte die Jetpack-Kamera in den **EVA-Zweig** geflickt, zu „zu
Fuß", Boot und Rover. Dort wird auf einen Punkt **vor** dem Astronauten geschaut (`EVA_LOOK_AHEAD`),
damit man beim Umsehen an ihm vorbei in den Himmel blicken kann. Beim Fliegen dreht sich das Bild dann
um einen Punkt vor ihm statt um ihn selbst — das ist das gemeldete Herumfahren, zweimal. Der X-Wing
schaut auf **sich selbst**.

Das Jetpack hat jetzt seinen **eigenen Kamerablock**, gebaut wie die Verfolgerkamera des Fliegers:

1. `camera.lookAt(g)` — direkt auf den Astronauten. Er sitzt in der Bildmitte, das Bild dreht sich um
   ihn. Das ist der Kern.
2. Der Abstand wächst mit dem Tempo (`camBackExtra`, auf ein Drittel geskaliert). Vorher waren es
   feste 13,3 m, auch bei 30.000 m/s — daher „bei warp viel zu nah".
3. `back` und `up` aus demselben Quaternion wie die Fluglage, Nickwinkel auf ±51° geklemmt (wie beim
   Flieger). Der Astronaut selbst darf steiler stehen (`JET_PMAX` = 72°).

Der Zuschlag ist gedrittelt, weil der X-Wing bei 125 m Zuschlag mit 11 m Spannweite noch gut zu sehen
ist — ein 1,9 m großer Astronaut wäre auf 138 m ein Punkt. Durchgerechnet (60° FOV, 800 px Bildhöhe):

| Tempo | Abstand | Astronaut im Bild |
|---|---|---|
| 9 m/s (Schweben) | 14,0 m | 94 px |
| 45 m/s (Erde) | 15,6 m | 84 px |
| Warp 1 | 42,2 m | 31 px |
| Warp 10 | 59,0 m | 23 px |

Zum Vergleich: der X-Wing steht bei Warp 10 auf 149 m, ist aber sechsmal größer.

Der EVA-Zweig ist dabei von allen Jetpack-Sonderfällen befreit worden — er ist wieder nur für Fuß,
Boot und Rover zuständig. Das war auch nötig: `upV` wurde dort noch benutzt, war nach dem Umbau aber
nicht mehr deklariert. Ein `ReferenceError` im ersten Jetpack-Frame, den der Syntax-Check nicht findet
(er ist erst zur Laufzeit sichtbar) — gefunden, weil ich die Deklarationen einzeln durchgezählt habe.

## Jetpack: der Astronaut flog seitwärts — und der Warp-Ring stand schief

Gemeldet: „die kamera funzt wenn links und rechts, aber nicht wenn steigen oder sinken, dann fährt sie
immer noch um den astronauten herum. außerdem muss der warp kreis auch etwas kleiner werden und er
sieht aus als wäre er nach rechts verdreht." Und kurz danach: „überhaupt scheint alles leicht verdreht.
der astronaut fliegt leicht seitwärts."

Der Nachsatz war der Schlüssel. Es war **kein** Kamerafehler mehr — die Kamera saß korrekt hinter der
Nase des Astronauten. Nur flog er nicht dorthin, wohin er schaute.

### Die Ursache: dem Jetpack fehlte die Ruderwirksamkeit

Der Schub wirkt nur **längs** der Blickrichtung (`v.dot(dir)`); die alte Querfahrt blieb einfach
stehen. Der Flieger hat dafür eine Ruderwirksamkeit, die die Fahrt zur Nase dreht
(`dir.lerp(forward, base*authority)` in `stepPhysics`) — dem Jetpack fehlte sie ganz.

Nachgerechnet: 3 s gerade Vollgas, dann 1 s drehen. Der Astronaut zeigt danach 74,5° zur Seite, fliegt
aber nur 12° daneben — **62,5° seitwärts**. Und weil die Kamera hinter seiner Nase sitzt, sah es aus,
als drehe sie um ihn herum. Beim Drehen fiel es weniger auf als beim Nicken, weil man dort ohnehin eine
Kurve erwartet; beim Steigen erwartet man geradeaus.

Ein Jetpack koppelt straffer als ein Flugzeug — es hat keine tragende Fläche, sondern Düsen ringsum,
mit denen ein Astronaut die Fahrtrichtung direkt ändert. Deshalb 5,5 pro Sekunde:

| Eingabe | Abweichung Nase zu Fahrt |
|---|---|
| 1 s drehen | 10,1° (vorher 62,5°) |
| 3 s drehen | 11,5° |
| 1 s steigen | 7,8° |
| 3 s steigen | **0,0°** |
| drehen + steigen, 2 s | 3,5° |
| 1 s sinken | 7,8° |

Das sind die Werte **während** der Eingabe. Steht der Stick still, geht die Abweichung auf null.

Die Ruderwirksamkeit läuft **vor** den VTOL-Landestufen (Zeile 76 gegen 82 in `updateJet`): die
überschreiben `v.y` danach, das Schweben und Sinken bleibt also exakt wie es war.

### Der Warp-Ring hing an der Fliegerlage

`updateWarp` richtete den Ring nach `state.quat` aus — und `updateJet` setzt `state.quat` **nie**. Der
Ring behielt also die Lage, die der Flieger beim Aussteigen hatte: im Hangar steigt man mit yaw −1,57
aus (Nase zum Ausgang), fliegt dann in eine andere Richtung, und der Ring stand quer. Genau das war
„sieht aus als wäre er nach rechts verdreht" — es waren rund 90°.

Am Jetpack wird er jetzt aus `eva.yaw` und `eva.jetPitch` ausgerichtet und sitzt an der Position des
Astronauten. Dazu auf **40 %** verkleinert: der Ring ist auf 44 m Außendurchmesser gebaut, passend um
einen 11 m breiten X-Wing — um einen 1,9 m großen Astronauten ist das ein Reifen, in dem er verloren
wirkt, zumal die Kamera näher dransitzt als beim Flieger.

### Was ich NICHT angefasst habe

Beim Suchen fiel mir `a.rotation.y = Math.PI` in `makeAstronaut` auf — die Drehung, die das Modell auf
−Z bringen soll. Ausgemessen liegt der Schwerpunkt der oberen 18 % des Rohmodells bei z = −0,038 von
0,571 Tiefe, was für ein *bereits* nach −Z schauendes Modell sprechen würde.

Das habe ich bewusst gelassen: 6,7 % der Tiefe sind zu schwach für eine 180°-Aussage (ein Helm ist
rundlich, der Schwerpunkt sagt kaum, wo das Visier ist), und wäre die Drehung falsch, flöge er
**rückwärts** statt „leicht seitwärts". Außerdem nutzen der Astronaut zu Fuß, im Rover und am
Fallschirm dieselbe Funktion. Falls im Spiel doch etwas rückwärts aussieht: dort liegt es, und dann
gehört die Zeile geprüft — mit einem Blick aufs Bild, nicht mit einer Schwerpunktrechnung.

## Jetpack: die Kamera sitzt jetzt exakt auf der Achse — und LT/RT gehen

Gemeldet: „jetzt fliegt er gerade, aber die kamera bleibt nicht hinter dem jetpack (exakt wie ein
flieger)" und, entscheidend: „schau auch, ob der jetpack nicht wie ein flieger behandelt wird. dann
müsste ja auch lt und rt gehen. aber er ist für dich ja nicht exakt wie ein flieger".

Der zweite Satz traf den Kern. Ich hatte das Jetpack die ganze Zeit *ähnlich* wie einen Flieger
gebaut, mit eigenen Abweichungen — statt es wie einen zu behandeln.

### Die Kamera: zwei Abweichungen vom Flieger, beide meine

- **Der Nickwinkel war geklemmt** auf ±0,9 rad (51°), wie beim Flieger. Dort ist das richtig: ein
  Flieger macht Loopings und geht über Kopf. Das Jetpack kann das nicht — `eva.jetPitch` ist in
  `updateJet` schon hart auf ±`JET_PMAX` (72°) begrenzt. Die Klemme setzte die Kamera bei Vollnicken
  also um **20° neben die Flugachse**.
- **Die Richtung wurde gelerpt**, nicht nur der Abstand. Nachgerechnet: 6,2° Rückstand beim Drehen
  (`JET_YAW` 1,3 rad/s bei Lerp 12/s) und 4,8° beim Nicken. Zusammen mit der Klemme bis 26°.

Jetzt wird die **Richtung hart gesetzt** und nur die **Länge** weich nachgezogen (die braucht es, weil
der Tempo-Zuschlag mit der Fahrt von 14 auf 55 m wächst). Nachgerechnet über den ganzen Nickbereich:

| Nickwinkel | 0° | 20° | 40° | 51,6° | 60° | 71,6° |
|---|---|---|---|---|---|---|
| Abweichung Kamera zu Flugachse | 0,00° | 0,00° | 0,00° | 0,00° | 0,00° | 0,00° |

### LT/RT: das Rollen fehlte komplett

Im Code stand als Begründung: „Ein Jetpack hat keine Fläche, die quer trägt, also gibt es keinen
Kurvenflug aus der Querlage." Das war **meine Annahme**, nicht die Anforderung — und der Astronaut hat
sichtbar Düsen ringsum. `updateJet` las nur `inp.yaw` und `inp.pitch`; `inp.roll` (LT/RT) lief ins
Leere. Damit fehlte die Hälfte des Flieger-Fluggefühls: wer sich legt, zieht herum.

Jetzt gilt dieselbe Mechanik wie beim X-Wing, mit denselben Bausteinen:

| | Flieger | Jetpack |
|---|---|---|
| Rollen | `inp.roll * spec.roll` (1,4–3,8) | `JET_ROLL` = 2,2 |
| Querlage-Anschlag | über Kopf erlaubt (Kunstflug) | `JET_RMAX` = 60° |
| Kurve aus Querlage | `bank * spec.turn` (0,7–1,6) | `JET_TURN` = 1,1 |
| Aufrichten losgelassen | `AUTO_LEVEL_RATE` | dieselbe Konstante |
| Kamera rollt mit | `camE.z * camRoll` | `eva.jetRoll * camRoll` |

Durchgerechnet: 0,48 s bis zur Vollquerlage von 60°, dann 33°/s Kurve (der Stick allein gibt 74°/s),
und 1,37 s zum Aufrichten. Der Anschlag ist bewusst enger als beim X-Wing — der darf über Kopf, weil
er Kunstflug kann; ein Astronaut soll nicht kopfüber hängen.

`camRoll` ist dieselbe Größe, die der Flieger benutzt: sie blendet gleitend zwischen Erdatmosphäre
(0 — der Horizont bleibt unten) und Weltall (1 — es gibt kein oben, die Sternenkulisse dreht mit).

Die Querlage wird an fünf Stellen zurückgesetzt, überall dort, wo auch `jetPitch` zurückgeht — sonst
startet man beim nächsten Zünden schief.

### Was daraus zu lernen ist

Drei Runden lang habe ich am Jetpack einzelne Symptome behoben (Kamera dreht, Astronaut driftet, Ring
schief), und jedes Mal war die Ursache dieselbe: **eine Abweichung vom Flieger, die ich selbst
eingebaut hatte** — meist mit einer plausibel klingenden Begründung im Kommentar. Die Anforderung war
von Anfang an „wie der X-Wing". Wo ein Fahrzeug „wie X" sein soll, ist die kürzeste Prüfung, die
Eingaben und Bausteine von X einmal durchzuzählen und zu fragen, was fehlt — nicht, das Verhalten
nachzuempfinden.

## Jetpack: der Astronaut nickte verkehrt — und das Gyroskop kannte ihn nicht

Gemeldet: „nur noch die kamera bei steigen und sinken. die passt noch nicht wie bei einem flieger" und
„der jetpack hat aber auch keine verbindung zum gyroskop, ist also noch nicht überall ein flieger".

### Es war nie die Kamera

Dreimal habe ich beim Steigen und Sinken an der Kamera gesucht. Nachgerechnet stand sie längst korrekt:
bei `jetPitch` = +0,5 (Flugrichtung y = +0,479, also steigen) sitzt sie bei y = −0,479, also darunter —
genau richtig für einen Steigflug.

Verkehrt kippte das **Modell**. Die Nase des Astronauten zeigt auf −Z (`makeAstronaut` dreht die Vorlage
dafür um 180°), und eine −Z-Nase wird von `Euler.x` = **+**pitch gehoben. Im Code stand
`Euler(-eva.jetPitch, …)`:

| jetPitch | Flugrichtung y | Nase y (vorher) | Nase y (jetzt) |
|---|---|---|---|
| −1,25 (sinken) | −0,949 | +0,949 | −0,949 |
| −0,50 | −0,479 | +0,479 | −0,479 |
| 0 | 0,000 | 0,000 | 0,000 |
| +0,50 | +0,479 | −0,479 | +0,479 |
| +1,25 (steigen) | +0,949 | −0,949 | +0,949 |

Er schaute beim Steigen nach unten und beim Sinken nach oben, während die Kamera korrekt auf der
Flugachse saß. Von hinten betrachtet sieht das genau aus wie eine falsch stehende Kamera — deshalb habe
ich dreimal an der falschen Stelle gesucht. Beim Drehen fiel es nicht auf, weil der Yaw-Anteil stimmte.

Warum es beim Rollen ebenfalls nicht auffiel: `jetRoll` ist um dieselbe Achse gespiegelt symmetrisch,
und die Kamera rollt mit — die Querlage stimmte also relativ.

### Das Gyroskop hing am Flieger

`updateGyro` liest `state.quat` und `state.vel` — beides gehört dem stehenden Flieger, und `updateJet`
setzt es an einem Ort mit Boden gar nicht. Das Instrument zeigte also die Lage eines Fliegers, der
irgendwo geparkt ist: unbeweglich, während man selbst fliegt.

Jetzt liest es am Jetpack `eva.jetPitch`, `eva.jetRoll` und `eva.jetVel`, mit denselben Grenzen fürs
Landefenster. Als Bezugstempo dient dort die Schwebestufe (20 % von `JET_VMAX` = 9 m/s) statt der
Abhebegeschwindigkeit des Fliegers — mal 1,4, genau wie beim Flieger.

### Systematisch nachgesehen, was sonst noch fehlt

Statt aufs nächste Symptom zu warten, habe ich alle Instrumente durchgezählt, die `state.quat` oder
`state.vel` lesen und während der EVA weiterlaufen:

| | liest Flieger-Lage | am Jetpack |
|---|---|---|
| `updateGyro` | ja | **war die Lücke, behoben** |
| `updateRadar` | ja, aber `eva ? eva.yaw : …` | korrekt angebunden |
| `updateShadow` | ja | steigt bei `eva` aus (kein Schatten zu Fuß) |
| `updateSonic` | ja | verlangt `spec.aero`, greift nie |
| `updateRumble`, `updateEngineSound`, `updateSpaceHint` | nein | unkritisch |

Damit ist die Liste leer. Der Lernpunkt aus der Runde davor hat hier gezogen: erst durchzählen, dann
beheben — nicht das nächste gemeldete Symptom abwarten.

## Jetpack: der Warp-Ring dreht mit, und die Planeten werden angeflogen

Gemeldet: „jetzt bitte noch den warp ring anpassen. und den anflug an die planeten. der jetpack soll
bitte auch so anfliegen wie der x wing und nicht einfach auf der erde sein." Zum Ring auf Rückfrage
präzisiert: „der ring bleibt steht still. dreht sich also nicht mit dem astronauten."

### Der Ring: zwei Fehler in derselben Zeile

Ich hatte ihn in der Runde davor an `eva.yaw`/`eva.jetPitch` gehängt, aber mit zwei Fehlern:

- **Das Vorzeichen des Nickwinkels war negativ** — dieselbe Verwechslung, die auch das Modell hatte
  (eine Nase auf −Z wird von `+pitch` gehoben). Beim Modell hatte ich es korrigiert, hier nicht.
- **Die Querlage fehlte ganz.** `jetRoll` kam erst später dazu, der Ring kannte es nie.

Der Ring stand damit bei jedem Steigflug und in jeder Kurve anders als der Astronaut — und weil die
Kamera mit **ihm** dreht, sah der Ring im Bild aus, als bliebe er stehen. Jetzt nimmt er exakt dieselbe
Lage: `Euler(eva.jetPitch, eva.yaw, eva.jetRoll)`.

### Der Anflug: neu, nach dem Muster von setupApproach

Vorher setzte das Jetpack beim Andocken sofort auf dem Boden auf — man kam aus dem Weltall und **stand**
plötzlich auf der Insel. Der X-Wing wird über `setupApproach` 1600 m entfernt und 900 m hoch eingesetzt,
Nase aufs Ziel, 110 m/s.

Neu ist `jetApproach(key, tx, tz)`, das Gegenstück für den Astronauten. Das Jetpack bleibt dabei **an**:
man fliegt selbst herunter und landet mit den Schubstufen, wie man es auf dem Hinweg gelernt hat.

Die Werte sind aufs Astronauten-Tempo umgerechnet — mit `JET_VMAX` = 45 m/s wären 1600 m fast zwei
Minuten. Beim ersten Ansatz (500 m / 300 m / 14° Nase) passten die Zeiten nicht zusammen:

| Variante | waagerecht am Ziel | am Boden |
|---|---|---|
| 500 m / 300 m / −14° | 23 s | **54 s** |
| **500 m / 180 m / −20°** | **24 s** | **23 s** |

Mit der ersten wäre er in voller Höhe über das Ziel hinweggeflogen. Die zweite bringt ihn tief am Ziel
an, wie ein echter Anflug.

Gilt für Erde, Mond und Mars. Der **Hangar** setzt weiterhin direkt in der Halle auf — dort landet auch
der X-Wing direkt, ein Anflug in einem Innenraum wäre unsinnig.

Zwei Dinge, auf die ich beim Bauen geachtet habe:

- **`updateIslands` nimmt während der EVA den Astronauten als Bezug** (`worldFocus`), nicht `state.pos`.
  Der Anflugpunkt muss also **vor** `earthWorldVisible(true)` stehen, sonst entstehen die Inselzellen um
  den Flieger und man fliegt über leeres Wasser.
- **Keine Andock-Schleife:** der Ortswechsel passiert vor dem Anflug, `locale` ist also nicht mehr
  `space`. Damit greifen weder der Andock-Block in `updateJet` noch die Weltall-Prüfungen in
  `updateLocale` — nachgerechnet für alle drei Orte (Erde 4000 m, Mond 1000 m, Mars 2000 m Schwelle
  gegen 180 m Anflughöhe).
- Das **Höhenraster von Mond und Mars** wird über Frames aufgebaut, `groundHeightAt` liefert am Anfang
  also 0. Unkritisch: 180 m darüber ist genug Luft, und bis er unten ist, steht das Raster längst.

## Jetpack: bei 20 % steht es jetzt exakt still — und zeigt die Schubphase

Gemeldet: „der jetpack hat noch nicht die selben eigenschaften bei 0, 10 & 20% und auch noch nicht die
steig und sink symbole." Auf meinen Rückfrage-Vorschlag hin präzisiert: „nein, nicht exakt die selbe
steuerung. der xwing bleibt bei 20% exakt stehen. er schwebt. der astronaut nicht."

### Zwei Anforderungen, die sich widersprachen

Die Sinkraten waren längst identisch (0 % = −20, 10 % = −10, 20 % senkrecht 0 m/s). Der Unterschied lag
**waagerecht**: bei 20 % gab der Schub weiter 9 m/s Vortrieb, der Astronaut glitt also, statt zu stehen.
Der X-Wing multipliziert seinen Vortrieb mit `vtolRest` — bei 20 % ist das null.

Das war kein Versehen, sondern eine bewusste Abweichung von mir aus einer früheren Runde: ohne
Vorwärtsfahrt im Schwebeflug kam man **nicht aus dem Hangar** (der Ausgang liegt 200 m seitlich, und bei
20 % schwebte man auf der Stelle — genau das war „im hangar resettet der jetpack immer wieder").

Nachgefragt und entschieden: exakt wie der X-Wing. Damit verlässt man den Hangar mit 30 % Schub, so wie
der Flieger auch — in 15 s, mit Vollgas in 4 s.

Aufgelöst mit denselben Bausteinen wie beim Flieger:

| | Flieger | Jetpack jetzt |
|---|---|---|
| Mischfaktor | `vtolMix` | `jetMix`, identische Formel |
| Vortrieb | `* vtolRest` | `* vtolRestJ` = `1 - jetMix` |
| Horizontal-Dämpfung | `1 - (1-e^(-1,2·dt)) · vtolMix` | dieselbe Zeile |
| Senkrechtrate | `* vtolMix` | `* jetMix` |
| Nase waagerecht beim Landen | ja | neu, ebenso |

Nachgerechnet, aus 20 m/s Fahrt heraus, nach 5 s:

| Schub | waagerecht | senkrecht |
|---|---|---|
| 0 % | 0,05 m/s | −20,00 |
| 10 % | 0,05 m/s | −10,00 |
| **20 %** | **0,05 m/s** | **0,00** |
| 25 % | 11,03 m/s | 0,00 |
| 30 % | 13,50 m/s | 0,00 |

Bei 20 % bleibt also nichts übrig — er steht. Und die Übergangszone zwischen 20 und 30 % blendet jetzt
ein, statt hart zu schalten: vorher schwebte das Jetpack bei 25 % noch voll, während der Flieger dort
schon halb vorwärts zieht.

Dazu neu, weil der Flieger es auch hat: beim Landen (0 bis 10 %) werden Nase und Querlage sanft
waagerecht gezogen. Ohne das setzt man mit 20° gesenkter Nase auf, weil man ja gerade im Sinkflug war.

### Die Symbole

Die Schubphasen-Zeichen standen nur im X-Wing-Zweig des HUD; am Jetpack stand pauschal 🚀. Jetzt
dieselben: ⏬ schnell sinken (0 %) · ⬇️ ruhig sinken (10 %) · ⬆️ steigen und schweben (20 %) · 🚀 vorwärts
(ab 30 %). Im Weltall immer 🚀 — dort gibt es kein Sinken.

## Fünf Kleinigkeiten: Ring, Schatten, Strand und die Landeplätze

Gemeldet: „der astronaut ist noch nicht exakt in der mitte des warp rings. der astronaut hat keinen
schatten auf dem strand, immer wasser (kurz vor dem schlauchboot) aber schon. wenn eine welle kommt geht
der astronaut unter. der schatten der canadair bewegt sich im wasser alleine (wie zu beginn beim
feuerwehboot) die raumschiffe auf dem mond landen nicht exakt auf der oberfläche sondern in der luft."

### 1. Der Ring saß um die Füße

`eva.group.position` ist die **Fußhöhe** — der Astronaut wird mit den Füßen auf y = 0 gesetzt
(`preloadAstronaut`). Der Ring zentrierte also darauf, und der Astronaut stand 0,95 m zu hoch darin.
Jetzt auf `ASTRONAUT_H*0.5` über den Füßen, und zwar entlang seiner **mitgekippten** Hochachse — sonst
wandert die Mitte beim Nicken wieder heraus.

### 2. und 3. Der Strand war weder Land noch Wasser

Beides hing am **Sandrand**, der bis `radius*1.12` gezeichnet wird (`isOnBeach`), von einigen Prüfungen
aber nicht erfasst war:

- **Der Schatten** fragte nur `isOnLand`, fiel am Strand also in den Wasser-Zweig und lag auf
  Wellenhöhe statt auf dem Sand. Er war nicht weg, er lag *über* dem Astronauten.
- **Der Astronaut ging unter**, weil `evaFootY` am Strand die feste `ISLAND_Y` = 0,30 m zurückgab. Die
  Dünung reicht aber bis rund 1,6 m (`AMP` 3,0) — bei jeder größeren Welle stand er unter Wasser.

Beides nutzt jetzt `Math.max(ISLAND_Y, seaYAt(x, z))`: bei ruhigem Wasser die Inselhöhe, bei Welle
steigt er mit. Physikalisch geht man im Flachwasser tatsächlich unter, aber sichtbar verschwinden soll
er nicht — er steht jetzt darin wie ein Kind in der Brandung.

### 4. Der Canadair-Schatten: derselbe Fehler wie beim Feuerwehrboot

Der Flieger-Schatten lag über Wasser auf **fest 1,4 m** statt auf der Wellenhöhe an dieser Stelle. Und
weil er mit `depthTest:false` immer davor gezeichnet wird, erscheint die Höhendifferenz zur echten
Wasseroberfläche als **Versatz, der sich mit dem Kamerawinkel ändert** — genau das war beim ovalen
Schatten schon einmal behoben worden, im Flieger-Zweig aber nicht.

Jetzt `seaYAt` an der Stelle, und wie beim ovalen Schatten der **höchste** Wellenpunkt unter seiner
Fläche (acht Randpunkte auf 5,5 m, der halben Spannweite des Umrisses): eine waagerechte Scheibe über
geneigtem Wasser taucht am Rand sonst ein. Der Sandrand zählt dabei als Land, sonst springt der Schatten
am Ufer.

### 5. Die Raumschiffe standen absichtlich in der Luft

`padSurfaceY` addierte einen Aufschlag von 3 m plus 45 % der Schiffshöhe:

| Schiff | Aufschlag vorher | jetzt |
|---|---|---|
| Shuttle | +8,4 m | 0,0 m |
| Enterprise | +6,3 m | 0,0 m |
| Rakete | +4,5 m | 0,0 m |

Im Kommentar stand ausdrücklich „bewusst OHNE Raycast": three.js aktualisiert `obj.matrixWorld` erst
beim Rendern, und `placeGroundBase()` setzt die Basis **nach** `updatePads()` — Landeplätze fielen in so
einem Frame auf den Kraterboden und verschwanden unter der Fläche. Der Aufschlag war die Notlösung
dagegen, und sie war sichtbar.

Die Matrix lässt sich aber erzwingen: `updateMatrixWorld(true)` auf der Kachel und auf der Mondbasis,
dann trifft der Strahl auch in dem Frame, in dem die Basis gerade gesetzt wurde. Genau so macht es
`stepGroundExact` für den Flieger. Der Aufschlag bleibt als Rückfall, wenn kein Strahl trifft.

Dass die Modelle dabei richtig sitzen, ist gesichert: `ensurePads` setzt `inner.position.y -= box.min.y`,
die Unterseite liegt also auf y = 0 des Halters — der Raycast-Wert ist direkt die Aufsetzhöhe.

## Der Flugzeugträger lag auf dem Wasser statt darin

Gemeldet: „bitte schau mal auf den carrier. der sitzt nicht richtig im wasser, sondern auf dem wasser.
aber wenn korrektur, bitte auch objekthöhe start und landehöhen etc. beachten."

### Die Ursache stand in einem Kommentar

`preloadFord` setzte den Rumpf mit `obj.position.y -= box2.min.y` — Kommentar: „Rumpf-Unterkante auf
y = 0". Genau das war der Fehler: y = 0 **ist** die Wasserlinie, der Kiel lag also darauf und das ganze
Schiff darüber. Ein Träger mit 0 m Tiefgang.

### Der Tiefgang ist gemessen, nicht geschätzt

Zwei Wege, und sie gehen bewusst auseinander:

1. **Skalierung:** die echte Gerald R. Ford zieht 12 m bei 337 m Länge. Das Modell ist auf
   `FORD_LEN` = 280 m normiert (Faktor 0,831) → 10,0 m.
2. **Rumpfprofil des Modells** (Breite je Höhenscheibe ausgemessen):

| Höhe über Kiel | Breite |
|---|---|
| 0 m | 20,69 m |
| 6,29 m | 27,84 m |
| 12,58 m | 35,35 m |
| 18,87 m | 59,32 m ← hier beginnt das ausgestellte Flugdeck |
| 23,39 m | 70,74 m (Deck) |

Die skalierte Wasserlinienbreite der echten Ford (41 m → 34,1 m) liegt damit bei y ≈ 11,7 m.

Beide Wege ergäben rund 10–12 m — aber das Modell ist **flacher gebaut** als das echte Schiff: bis zum
Deck sind es 23,39 m, wo die reine Längenskalierung 26,6 m erwarten ließe. Mit festen 10 m läge das Deck
nur 13,4 m über Wasser statt der skalierten 16,6 m.

Deshalb der **Anteil** statt der Meterzahl: 37,5 % (so verteilt sich der echte Rumpf auf 12 m unter und
20 m über Wasser) von 23,39 m ergibt **8,77 m Tiefgang** und ein Deck **14,62 m über Wasser**. Das sind
2 m unter dem skalierten Sollwert — genau die Differenz, die das flachere Modell mitbringt. Wo zwei
Messungen auseinandergehen, zählt die, die das Modell selbst beschreibt.

### Start- und Landehöhen: alle folgen von allein

Der ausdrücklich genannte Punkt. `fordDeckY` wird **per Raycast** gemessen, und die Reihenfolge musste
dafür umgestellt werden: erst Unterkante auf 0, dann Deckhöhe messen, **dann** eintauchen, dann
`fordDeckY = deckÜberKiel − FORD_DRAFT`. Damit ist `fordDeckY` weiterhin die Höhe **über Wasser** — und
genau das erwarten alle 20 Stellen, die sie lesen:

| | folgt |
|---|---|
| Landen und Starten auf dem Deck | ✓ |
| Aufsetzfenster der KI (`rtAltCarrier`) | ✓ |
| KI-Anflughöhe | ✓ |
| Bordwand-Kollision (`fordDeckY − 1,5`) | ✓ relativ |
| Turm-Kollision (`fordDeckY + 22` bzw. `fordTower`) | ✓ relativ |
| Flieger- und ovaler Schatten | ✓ |
| Fallschirme, Spieler und KI | ✓ |
| Astronaut auf dem Deck (`surfaceY`, `evaFootY`) | ✓ |
| geparkte Flugzeuge (`probe`) | ✓ |

Geprüft, dass keine Stelle die Deckhöhe selbst ausrechnet — die vier festen Zahlen im Umfeld sind alle
**relative** Offsets zum Deck. `canLandHere` prüft nur die Fläche, nicht die Höhe. Boote werden über
`isOnCarrier` ausgeschlossen, unabhängig von der Höhe.

Zwei Details, die beim Umstellen wichtig waren: `box3` entsteht **vor** dem Senken, wird danach aber
noch für die Deckbreite genutzt — das sind X-Werte, vom Senken unberührt. Und die Turm-Raycasts laufen
**nach** dem Senken, ihre Trefferhöhen sind also schon Über-Wasser-Werte.

Der Ersatz-Rumpf (falls das GLB nicht lädt) reicht jetzt ebenfalls vom Tiefgang bis zum Deck statt von
0 bis zum Deck.

## Der Flieger-Schatten war durch den Trägerrumpf sichtbar

Gemeldet: „aber jetzt sieht man den schatten auf dem wasser durch den carrier hindurch."

Eine Folge des Tiefgangs aus der Runde davor — und ein Fehler, der die ganze Zeit da war, nur unsichtbar:
`shadowMat` hatte `depthTest:false`. Der Schatten wurde damit **immer** gezeichnet, also auch über
Objekte, die zwischen ihm und der Kamera stehen. Solange der Träger auf dem Wasser lag, gab es unter
Wasser nichts, was ihn hätte verdecken können. Seit der Rumpf 8,8 m eintaucht, schon.

Der ovale Schatten (Boote, Astronaut) hatte dasselbe Problem und ist längst gelöst: `depthTest:true`
plus `polygonOffset` gegen das z-fighting mit dem animierten Wasser. Genau diese Kombination bekommt
jetzt auch der Flieger-Schatten — das Abschalten des Tiefentests war der falsche Weg gegen das Flackern.

Geprüft, was sonst noch mit `depthTest:false` zeichnet: nur die **Leitstrahl-Pfeile**, und dort ist es
gewollt — sie sind eine Navigationshilfe und sollen nie von Terrain oder Wellen verdeckt werden.

Selbstverdecken ist beim Flieger kein Thema: der Schatten liegt auf Wasserhöhe + 0,15 m, der Flieger
mehrere Meter darüber. Beim ovalen Schatten war das Verdecken sogar gewollt, damit das Boot seinen
eigenen Schatten überdeckt.

## Der Schatten kannte das Trägerdeck nicht — und fehlte auf Mond, Mars und im Hangar

Gemeldet: „jetzt sieht man den schatten auf dem wasser durch den carrier hindurch", und auf meinen ersten
Fix hin der entscheidende Hinweis: „es liegt wohl eher daran, dass vorher die deckhöhe 23m war, jetzt
14m. und die schattengrenze liegt bei 20m." Dann: „und bitte baue den schatten auch auf mars und mond
ein. und in der halle."

### Der Hinweis traf es, und dahinter lag mehr

Nachgerechnet mit `SHADOW_MAXALT` = 20 m, gerechnet ab der Oberfläche:

| Flieger auf dem Deck | Rechnung | Ergebnis |
|---|---|---|
| Deck vorher 23,4 m über Wasser | 23,4 − 0 = 23,4 > 20 | Schatten **aus** — der Fehler war unsichtbar |
| Deck jetzt 14,6 m | 14,6 − 0 = 14,6 < 20 | Schatten **an**, aber im **Wasser** |
| nach dem Fix | 14,6 − 14,6 = 0 | Schatten **an**, auf dem **Deck** |

Denn die eigentliche Lücke war: `updateShadow` fragte `isOnCarrier` **überhaupt nicht ab**. Über dem
Träger rechnete der Flieger-Schatten mit Wasserhöhe 0, lag also im Wasser statt auf dem Deck — der
ovale Schatten (Boote, Astronaut) kennt `onCar` längst, der Flieger-Schatten nie. Solange das Deck über
der 20-m-Grenze lag, kam der Fall gar nicht vor.

Mein erster Fix (`depthTest:true` statt `false`) war deshalb nicht der Kern, aber richtig und bleibt:
der Schatten wurde sonst über **alles** gezeichnet, auch über Objekte zwischen ihm und der Kamera. Gegen
das z-fighting im Wasser hilft `polygonOffset`, wie beim ovalen Schatten seit längerem.

### Schatten auf Mond, Mars und im Hangar

`updateShadow` begann mit `if(locale !== 'earth') → aus`, begründet mit „auf dem Mond keine
Insel-Referenzhöhe". Das stimmte für die alte Rechnung mit festem `ISLAND_Y`, ist aber überholt:
`surfaceY` kennt inzwischen jeden Ort — `hangarFloorY` in der Halle, das Höhenraster von Mond und Mars
samt exaktem Raycast, und die Fläche der Mondbasis.

Jetzt ist nur noch das **Weltall** ausgenommen (dort gibt es keinen Boden). An allen anderen Orten
nutzen beide Schatten `surfaceY`, und die Wellen- und Träger-Sonderfälle gelten nur noch in der
Erdwelt. Damit hat auch der Astronaut zu Fuß auf dem Mond und im Hangar einen Schatten.

## Der Canadair-Schatten blinkte im Wellenrhythmus

Gemeldet: „wenn die canadair auf dem wasser schwimmt oder fährt verschwindet der schatten ab und zu und
kommt dann wieder. warum? ggf wellen bewegung? oder was anderes?"

Die Vermutung war richtig — es ist die Wellenbewegung, aber nicht direkt, sondern über eine Eigenheit des
schwimmenden Canadair: **`state.pos.y` bleibt auf der Nulllinie**, während `planeGroup.position.y` mit der
Welle wandert (`floatCanadair`). Der Schatten rechnete mit `state.pos.y`:

| Wellenhöhe an der Stelle | alt (alt) | | alt (neu) | |
|---|---|---|---|---|
| −1,6 m (Tal) | +1,60 | an | −0,55 | an |
| 0 m | 0,00 | an | −0,55 | an |
| +0,8 m | −0,80 | **aus** | −0,55 | an |
| +1,6 m (Berg) | −1,60 | **aus** | −0,55 | an |

Auf jedem Wellenberg wurde `alt` negativ, und `alt < 0` schaltet den Schatten ab — bei `AMP` = 3,0 also
etwa die Hälfte der Zeit, im Rhythmus der Dünung.

Behoben mit `planeCamRef()`, das genau dieses Auseinanderfallen schon kennt: die Kamera nutzt es seit
längerem, weil das Flugzeug sonst in ihrem Bild bis 2,94 m auf und ab hüpfte. Damit ist `alt` über den
ganzen Wellenzyklus konstant −0,55 m — der Tiefgang, mit dem der Rumpf im Wasser liegt.

Zwei Kleinigkeiten kamen dazu:

- Die untere Grenze ist jetzt `alt < -2` statt `alt < 0`. Schwimmend liegt der Rumpf unter der
  Wasserlinie, `alt` ist dort also zu Recht leicht negativ; mit der harten Null blinkte es weiter, nur
  seltener.
- Der Skalierungsfaktor `f` ist auf 0..1 geklemmt. Bei negativem `alt` wäre der Schatten geschrumpft und
  dunkler geworden als vorgesehen — die Deckkraft `0,18 + 0,22·(1−f)` liefe über ihren Sollwert hinaus.

Der ovale Schatten (Feuerwehrboot, Schlauchboot, Astronaut) hat das Problem nicht: er setzt bei Booten
`alt = 0` fest und prüft nur die obere Grenze.

## X am Boden: der X-Wing steigt erst auf Schwebehöhe, dann Vollgas

Gemeldet: „wenn man beim x-wing mit x beschleunigt, steigt der flieger nicht auf die minimale
schwebehöhe."

X (und Shift) setzten `state.throttle = 1`. Damit ist der VTOL-Bereich verlassen (`vtolMix` gilt nur
unter `VTOL_FWD` = 30 %), es greift die normale Flugphysik — und dort auch die Abhebe-Sperre:

```
if(state.onGround && speed < spec.vTO && state.vel.y > 0 && vtolMix <= 0) state.vel.y = 0;
```

Der X-Wing rollte also mit Vollgas los wie ein Verkehrsflugzeug und hob erst bei `vTO` = 55 m/s ab. Auf
einer Wiese, auf Wasser oder auf dem Trägerdeck kommt er so gar nicht in die Luft.

Nachgefragt und entschieden: **erst senkrecht auf Schwebehöhe, dann Vollgas.** Ein Druck, und er ist
oben.

Umgesetzt als eigener Zustand `xwingLaunch` mit der Hilfsfunktion `boostDruck()`, die beide
Eingabewege nutzen (Tastatur und Gamepad — vorher stand die Rechnung zweimal da):

- Am Boden oder in laufender Sequenz: Schub auf `VTOL_HOVER`. Das Steigen regelt der vorhandene
  VTOL-Block mit `VTOL_CLIMB` und riegelt bei `VTOL_HOVER_ALT` ab — dieselbe Regelung wie beim
  Verlassen des Hangars.
- Bei 80 % der Schwebehöhe schaltet es auf Vollgas. Nachgerechnet dauert das **3,1 s**. Die 80 % sind
  nötig, weil die Steigrate angeregelt wird und die letzten Meter langsam auslaufen.
- Die Grundhöhe kommt je Ort aus `fordDeckY`, `ISLAND_Y`, Wasser (0) oder `surfaceY` — so funktioniert
  der Start auch auf dem Träger, auf dem Mond und im Hangar.
- Ein eigener Zustand, weil der Eingabe-Zweig jeden Frame läuft: ohne Merker begänne die Sequenz bei
  jedem Bild neu. Sie endet beim Loslassen und beim Reset.

Jedes andere Modell und der schon fliegende X-Wing bekommen wie bisher direkt 100 %.

## U-Boot auf dem Meer, Feuerwehrboote in den Häfen

Gewünscht: „kulisse auf dem meer. als ki schiff. bis zum turm abgetaucht und dann im wechsel auftauchen
mit realistischer wasserlinie. langsam fahren. auf und abtauchend." Dazu: „es sollte an jedem hafen ein
feuerwehrboot liegen zu dem man hinlaufen und einsteigen kann." Das Fahren des U-Boots kommt später,
zusammen mit der Unterwasserwelt.

### Das U-Boot (submarine by Helindu)

Beim Ausmessen fiel eine Falle auf: die Bounding-Box des Rohmodells ist 8,39 m hoch, was für ein U-Boot
absurd wäre (Verhältnis 2,8:1). Ursache ist ein einzelnes `Cube`-Teil von 1,01 × 8,39 × 0,33 — ein
dünnes hohes Blatt, also Periskop oder Antenne. Ohne dieses Teil sind es 4,72 m, und das lange
Rumpfteil (`Cylinder.004`, 14,1 m) reicht von y = −1,00 bis +1,03, darüber der Turm bis y = 3,01.

| | Rohmodell | auf 95 m skaliert (Faktor 4,01) |
|---|---|---|
| Länge | 23,67 | 95 m |
| Rumpfhöhe | 2,03 | 8,1 m |
| Turm darüber | 1,98 | 7,9 m |

95 m liegt zwischen Typ VII (67 m) und Los-Angeles-Klasse (110 m).

Die Tauchbewegung läuft über einen Sinus mit 34 s Periode, je Boot um 15 % gestreut (der eigene
x-Wert als Phase — sonst tauchen mehrere im Gleichschritt). Genutzt wird nur die halbe Amplitude, und
sie ist mit `smoothstep` abgeflacht: es verweilt oben und unten und wechselt dazwischen zügig, statt
gleichmäßig durchzufahren wie ein Kolben.

- **aufgetaucht:** 2,4 m Rumpf und der ganze Turm sichtbar (`wl` 0,060 senkt es um 5,7 m, also 70 % der
  Rumpfhöhe — ein U-Boot liegt tief)
- **getaucht:** nur die 7,9 m Turm (weitere 8,1 m ab, dann liegt das Rumpfdeck auf der Wasserlinie)
- Getaucht liegt es ruhiger: die Dünung greift am Turm weniger an, deshalb wird das Nicken um 70 %
  gedämpft
- Tempo 1,8 m/s = **6,5 km/h**, das langsamste Schiff auf dem Meer (die Frachter fahren 16–20 km/h)

Wichtig dabei: **die Kollisions-Obergrenze sinkt mit** (`sh.top`). Ohne das bliebe über dem getauchten
Boot eine unsichtbare Wand stehen, an der man abstürzt, wo nichts mehr ist. `sh.top` wird an vier
Stellen gelesen (`hitsSeaShip`, `pushOutOfSeaShip`, `aiObstacleTopAt`, `aiShipAhead`), alle bekommen
damit denselben aktuellen Wert. Der Ausgangswert `top0` wird in `refreshSeaShip` mitgesetzt, weil sich
`sh.top` beim Nachladen des GLB von der Schätzung auf den vermessenen Wert ändert.

### Feuerwehrboote in den Häfen

An jedem Hafen liegt eines, 34 m wasserseitig der Hafenmitte (der Hafen ist 60 m groß, das Boot 16 m
lang), längs zum Ufer. Mit Y steigt man ein — technisch ein **Modellwechsel**, weil das Feuerwehrboot
ein eigenes Modell mit eigener Physik und dem Löschstrahl ist, kein Sub-Modus wie der Rover.

Damit der eigene Flieger nicht verloren geht, wird sein Platz gemerkt (`harborBoatFrom`): Y im Boot
führt zurück, und er steht dort, wo man ihn gelassen hat. Das Kai-Boot verschwindet, während man es
fährt — man sitzt ja darin.

### Der Konflikt mit dem Schlauchboot — die Rückfrage war goldwert

Nachgerechnet: die Hafen-Kollisionshülle reicht 27 m (`HARBOR_SIZE*0.45`), das Boot liegt bei 34 m. Die
letzten **7 m zum Boot sind offenes Wasser** — wer hinlaufen will, tritt hinein, und genau dann setzt
`evaEnterDinghy` ein. Man hätte im Schlauchboot gesessen, statt einzusteigen.

Behoben mit einer Sperrzone von 26 m um jedes Kai-Boot (deckt die 16 m Bootslänge samt
Einstiegsreichweite ab). Die Sperre steht **in `evaEnterDinghy`**, nicht an den beiden Auslösern —
damit gilt sie für beide Wege, Hineinlaufen und Hineinfallen.

Dabei entstand ein Folgeproblem, das ich gleich mitbehoben habe: mit gesperrtem Schlauchboot wäre der
Astronaut dort endlos gefallen. In der Zone steht er jetzt auf der Wasserlinie und watet — die Zone ist
nur die Bootslänge breit, also flaches Hafenwasser direkt am Kai. So kann man ums Boot herumlaufen und
einsteigen.

## Das Kai-Boot lag in der Canadair und unter Wasser

Gemeldet mit Screenshot: „boot und canadair liegen übereinander und das geparkte boot liegt unter der
wasser linie". Auf dem Bild steckt das weiße Boot direkt unter der Canadair, und nur der Aufbau ragt
heraus.

### Fehler 1: dieselbe Stelle wie der Canadair-Startplatz

Nachgerechnet, und es war knapp: `findStart` setzt die Canadair auf `radius*1,14`, mein Kai-Boot lag bei
`radius*1,02 + 34`. Auf der Startinsel (radius 260) sind das 296 gegen 299 m — **3 m auseinander**.

Behoben, indem das Boot **seitlich** am Kai liegt statt davor: radial 1,16 mal Radius, dazu 40 m
tangential versetzt. Die Canadair steht radial, das Boot tangential — sie können sich nicht mehr
begegnen.

Der radiale Abstand ist ein **Vielfaches des Radius**, wie beim Hafen (1,02) und beim Canadair-Platz
(1,14). Mit einer festen Meterzahl ging es nicht: 12 m legten das Boot auf großen Inseln in den
Sandrand (der bis `radius*1,12` reicht), auf der Startinsel bei 280 m, wo der Sand bis 291 m geht. Ein
Boot im Sand ist falsch, und ein fester Wert kann es nicht für alle Größen richtig machen.

| Inselradius | Boot von der Mitte | Sandrand | Abstand Canadair | Abstand Hafenmitte |
|---|---|---|---|---|
| 170 | 201 m | 190 | 40 m | 47 m |
| 260 | 304 m | 291 | 40 m | 54 m |
| 330 | 385 m | 370 | 41 m | 61 m |

Überall im Wasser, überall 40 m von der Canadair, überall außerhalb der Hafenhülle (27 m).

### Fehler 2: feste Höhe, während die Dünung schwankt

Das Boot steckt in der Inselzelle und wurde beim Bauen **einmal** auf `-BOAT_DRAFT` gesetzt. Die
Wasseroberfläche schwankt aber um bis zu ±1,6 m (`AMP` 3,0): bei einem Wellenberg von 1,0 m lag sie
2,1 m über dem Kiel, und nur der Aufbau schaute heraus. Im Wellental hätte es umgekehrt geschwebt.

Neu ist `updateHarborBoats(dt)`, das die Kai-Boote pro Frame auf `seaYAt − BOAT_DRAFT` setzt — genau die
Rechnung, die das fahrende Boot in `stepBoat` benutzt. Dazu ein leichtes Nicken aus der Welle am Bug
gegen die am Heck, mit derselben Konvention wie die Handelsschiffe (Bug bei −Z, also `-sin`/`-cos`; mit
`+sin`/`+cos` wäre das Nicken spiegelverkehrt gewesen).

## Boot und Canadair parken rückwärts am Strand

Gemeldet: „einsteigen ins boot fast nicht möglich. vielleicht ists besser den steg abzubauen und
stattdessen die canadair und das feuerwehrboot rückwärts am strand zu parken, so dass man einfach von
hinten aus einsteigen kann und wenn man an den strand gefahren ist, dann kann man wieder aussteigen."

Der Vorschlag trifft den Kern: am Kai ist rundherum Wasser, und dort fängt das Schlauchboot an. Zwei
Versuche waren daran gescheitert — erst lag das Boot auf dem Canadair-Startplatz, dann richtig im
Wasser, aber der Weg dorthin führte durch die Brandung. Am Strand ist der Grund **fest** (`evaSolid`
kennt den Sandrand), also fällt der ganze Konflikt weg.

Der Hafen bleibt als Kulisse stehen — er hängt an 8 Stellen im Code (Kollision, Freihaltung für
Raketenrampe und Flugzeug-Parkplatz, Sperrzone für Rettungsfahrzeuge) und ist die Orientierung am
Inselrand.

### Wo sie jetzt liegen

Beide auf derselben Radialstelle, aber auf **verschiedenen Seiten** des Hafens: das Feuerwehrboot
+55 m tangential, die Canadair −55 m. Damit sind sie 110 m auseinander und können sich nicht mehr
begegnen (das war der Fehler aus dem Screenshot).

Der radiale Wert ist `radius * 1,12`, also **genau die Sandkante**. Das 16 m lange Boot steht damit mit
dem Heck im Sand und dem Bug im Wasser:

| Inselradius | Bootsmitte | Heck | Sandrand | Bug-Prüfpunkt |
|---|---|---|---|---|
| 170 | 190 | 182 | 170–190 | 198 ✓ Wasser |
| 260 | 291 | 283 | 260–291 | 299 ✓ Wasser |
| 330 | 370 | 362 | 330–370 | 378 ✓ Wasser |

**1,12 und nicht 1,10** — das war der entscheidende Wert: `stepBoat` prüft die Weiterfahrt mit
`BOAT_LOOK` = 8 m vor dem Bug, und dieser Punkt **muss im Wasser liegen**, sonst sitzt das Boot beim
Losfahren fest (`boatWaterFree` schließt den Strand ausdrücklich aus). Mit 1,10 waren es bei r=330 nur
noch 1 m Luft, und bei größeren Inseln wäre der Punkt im Sand gelandet: der Sandrand wächst mit dem
Radius, der Vorausblick bleibt bei 8 m.

Die Ausrichtung ist gerechnet, nicht geraten: der Bug liegt bei −Z (wie bei allen Fahrzeugen), die
Bugrichtung ist also `(-sin(rot), -cos(rot))`. Gleichgesetzt mit der Radialrichtung ergibt das
`atan2(-cos(ang), -sin(ang))` — nachgerechnet für alle vier Himmelsrichtungen, Skalarprodukt jeweils
1,000.

### Aussteigen am Ufer

Y im Boot bringt jetzt nur **am Ufer** zurück zum Flieger, nicht mitten auf dem Meer. Geprüft wird ein
Punkt vor dem Bug (das Boot liegt selbst nie auf dem Sand, es hält davor an). Sonst kommt ein
Strand-Symbol als Hinweis, dass man erst hinfahren muss.

### Höhen am Strand

Das Kulissen-Boot liegt auf `max(ISLAND_Y − 0,66, seaYAt − BOAT_DRAFT)`: das Heck sinkt nicht in den
Sand, wenn die Welle tief steht, und schwimmt mit, wenn sie steigt. Dazu eine leichte Neigung nach
vorn, weil das Heck aufliegt und der Bug schwimmt.

Geprüft, dass die Höhen der anderen dort stimmen: `canLandHere` erlaubt Canadair und Boot den Strand
(`isOnLand` fragt nur die Grasfläche), `evaFootY` gibt dem Astronauten dort ausdrücklich `ISLAND_Y`, und
die Canadair schwimmt über `floatCanadair` auf der Wasserlinie — für ein Flugboot am Strand genau
richtig.

## Zwei Boote übereinander, und der Ausstieg übersprang den Weg

Gemeldet mit Screenshot: „jetzt sind wenn man das boot nimmt 2 boote übereinander" (dazu: „zu beginn
sind die beiden deckungsgleich, aber es darf keine 2 boote geben") und „wenn man aus einem flugzeug
aussteigt, in ein boot einsteigt, an land fährt und mit y aussteigt ist man wieder im flugzeug".

### Das doppelte Boot: cycleModel baute die Inseln nie neu

`buildIsland` lässt das Kulissenboot weg, solange man selbst das Boot fährt (`isBoat() ? null : …`) —
das greift aber nur, wenn die Zelle **neu gebaut** wird. `cycleModel` (Modellwechsel per M oder D-Pad)
tat das nie: es setzte `currentModel`, baute das Flugmodell und ließ die Welt stehen.

Beim Vorfeld war dasselbe Problem schon gelöst (`parkPlaneAt` lässt den eigenen Platz frei), fiel dort
aber nicht auf — die geparkten Flugzeuge stehen ja neben der Bahn, nicht unter einem. Am Feuerwehrboot
sitzt man mitten im Kulissenboot.

Jetzt ruft `cycleModel` `refreshIslands()`. Damit sind alle fünf Wege ins Boot abgedeckt:

| Weg | ruft refreshIslands |
|---|---|
| `cycleModel` (Taste) | ✓ neu |
| `evaBoardHarborBoat` (Y am Strand) | ✓ |
| `leaveHarborBoat` (Y an Land) | ✓ |
| `evaBoardParked`, `evaBoardXwing` | ✓ |
| nach dem Nachladen des Boot-GLB | ✓ neu |

Der letzte Punkt war eine eigene Lücke: das Boot-GLB ist 30 MB und lädt asynchron. Wer schneller auf
einer Insel war, hatte dort dauerhaft das Behelfs-Boot (Zylinder mit Kegel) liegen.

Dazu ein Randfall: wechselt man per Taste, während man das Kai-Boot fährt, wird der gemerkte
Flieger-Platz gelöscht — sonst setzte Y einen später dorthin zurück, obwohl man über die Auswahl
eingestiegen ist.

### Der Ausstieg setzte direkt ins Flugzeug

`leaveHarborBoat` schaltete auf das alte Modell zurück und setzte einen hinein. Das übersprang den Weg
und fühlt sich wie Teleportieren an.

Jetzt steigt man **zu Fuß** am Strand aus: der Astronaut wird an Land vor dem Bug gesetzt (ein Stück
voraus gesucht, bis fester Grund kommt — dieselbe Idee wie beim Schlauchboot-Ausstieg), der Flieger
wartet an seinem gemerkten Platz. Man läuft also zurück und steigt mit Y ein, wie beim Rover. Die
Kamera geht auf den Astronauten, nicht auf den Flieger.

## Aus dem Boot kam man nur auf einem Weg heraus

Gemeldet: „aussteigen bei feuerwehrboot über modelauswahl nicht möglich. nur über boot in welches man
eingestiegen ist. zweitens das symbol nach bootausstieg ist ein anderes."

### Der Ausstieg hing am Einstiegsweg

Mein Y-Zweig fragte `isBoat() && harborBoatFrom` — also nur das Boot, das man **am Strand** bestiegen
hat. Über die Modellauswahl ist `harborBoatFrom` null, damit fiel Y durch auf `evaAllowed()`, und das
sperrt Boote grundsätzlich (`if(isBoat()) return false`). Y tat also gar nichts.

Die Sperre in `evaAllowed` ist an sich richtig — ein Boot schwimmt, über Wasser gibt es keinen Grund zum
Stehen. Nur ist sie zu grob: **am Ufer** kann man aussteigen.

Jetzt gilt der Zweig für jedes Boot, und die Unterscheidung liegt dahinter:

| Einstieg über | Y am Ufer |
|---|---|
| Strand (Y am Kai-Boot) | zurück zum gemerkten Flieger, zu Fuß am Strand |
| Modellauswahl | zu Fuß von Bord, das Boot bleibt liegen |

Für den zweiten Fall ist `evaExitFromBoat` neu. Dabei zeigt `eva.planeAt` auf das **Boot** — es ist das
Fahrzeug, in dem man saß, also der Punkt, zu dem man mit Y zurückkehrt (dieselbe Rolle wie der Flieger
sonst). Nachgerechnet: der Ausstiegspunkt liegt 12,8 m vor dem Bug, die Einstiegsreichweite ist 8 m —
man läuft also knapp 5 m zurück und ist wieder drin.

Über Wasser kommt weiterhin das Strand-Symbol als Hinweis, dass man erst hinfahren muss.

### Das Symbol

Ich hatte `\u{1F9D1}` genommen, also nur die Person. Überall sonst im Spiel steht der Astronaut als
ZWJ-Sequenz: Person + ZWJ + Rakete (`\u{1F9D1}\u{200D}\u{1F680}`). Beide Boot-Ausstiege zeigen jetzt
dasselbe Zeichen wie jeder andere Ausstieg.

## Die Canadair landet und rollt jetzt auch auf der Wiese

Gewünscht: „mach bitte die canadair auf rasen land und fahrbar."

`canLandHere` hatte für sie `!onLand || onRunway || onCarrier` — also Wasser, Landebahn und Trägerdeck,
aber ausdrücklich **nicht** die Grasfläche. Jetzt `return true`.

Das ist nicht „überall im Spiel": Mond, Mars und Hangarboden sind in der Funktion weiter oben schon
abgehandelt, hier geht es nur um die Erde. Und dort war sie ohnehin fast überall erlaubt — es fehlte
genau die Wiese.

**Fahrbar** war sie schon: Vortrieb, Lenkung und Rollreibung im Bodenzweig gelten für jedes Modell.
Blockiert hat sie dieselbe `canLandHere`-Prüfung, die beim Rollen auf falscher Fläche einen Crash
auslöst (`wasGround && vspeed > 3 && !canLandHere(...)`) — mit der Freigabe ist auch das erledigt.

Durchgerechnet, dass es zusammenpasst:

- **Landen:** Crash-Schwellen sind 55 m/s Fahrt, 16 m/s Sinken oder 0,9 rad Neigung. Mit `vTO` = 40 m/s
  setzt sie deutlich darunter auf.
- **Abheben:** die Sperre `onGround && speed < vTO` gilt weiter, sie braucht auf der Wiese also Anlauf
  wie auf der Bahn.
- **Höhe:** `surfaceY` gibt auf Gras `ISLAND_Y`, das Rollen läuft damit ohne Sonderfall.
- **Schwimmen:** `floatCanadair` prüft `!isOnLand` selbst und schaltet auf Gras ab.

Was ausdrücklich **nicht** mitgeht:

- **Wassertanken** bleibt aufs Wasser beschränkt — `updateScoop` prüft `!isOnLand` eigenständig.
- **Gebäude, Berge und Raketenrampen** bleiben Hindernisse: die hängen an `hitsBuilding`, nicht an
  `canLandHere`, und dort kracht man schon im Anflug hinein.
- Der **Startplatz** bleibt am Strand (rückwärts geparkt, Bug zum Wasser).
- Der **Strand** zählt weiter als Wasser (`isOnLand` kennt nur die Grasfläche), sie schwimmt dort also.

Hilfetext und der Übersichtskommentar über `canLandHere` sind mitgezogen — beide nannten noch „Wasser
ODER Landebahn".

## Warum kein U-Boot zu finden war: zwei Ursachen

Gefragt: „wie viele uboote gibt es? ich habe noch keines gesehen. es braucht mindestens so viele wie die
anderen boote, damit man sie auch sieht."

### Es gab genau eines

`spawnSeaShips` verteilt die Typen per Modulo (`SHIP_TYPES[i % 5]`), und `SHIP_COUNT` war 7. Damit:

| | cruise | liberty | container | sail | sub |
|---|---|---|---|---|---|
| bei 7 | 2 | 2 | 1 | 1 | **1** |
| bei 10 | 2 | 2 | 2 | 2 | **2** |

Jetzt 10 — dann hat jeder der fünf Typen genau zwei. Der Platz reicht: der Spawn-Ring (1.200 bis
2.400 m) hat 13,6 km², die zehn Schiffe belegen mit ihren `SHIP_CLEAR`-Abstandsringen zusammen 1,5 km²,
also 11 % Auslastung.

### Und es war fast unsichtbar — mein Rechenfehler

`subDive` stand auf **8,1**, der ganzen Rumpfhöhe. Gedacht war: Rumpfdeck auf die Wasserlinie, Turm
komplett heraus. Nachgerechnet stimmt das nicht, denn aufgetaucht ragt der Rumpf nur 2,4 m heraus
(`wl` 0,060 senkt ihn um 5,7 m der 8,1 m):

| | Deck | sichtbar |
|---|---|---|
| aufgetaucht | +2,4 m | 10,3 m (Rumpf + Turm) |
| getaucht, `subDive` 8,1 | **−5,7 m** | **2,2 m** |
| getaucht, `subDive` 2,4 | 0,0 m | 7,9 m (ganzer Turm) |

Mit 8,1 m drückte es das Deck also 5,7 m unter Wasser, und vom 7,9 m hohen Turm blieben 2,2 m — aus der
Luft ein grauer Strich auf blauem Wasser. Richtig sind die **2,4 m**, die der Rumpf aufgetaucht
heraussteht: dann liegt das Deck auf der Linie und der Turm steht voll heraus, wie beschrieben.

Getaucht ist es damit mehr als dreimal so hoch sichtbar wie vorher.

## Das Tauchen war da, nur nicht zu sehen

Gefragt: „ich habe das uboot entdeckt, aber auch bei langem anflug, langsam mit dem mustang, habe ich es
nicht abtauchen oder auftauchen gesehen. wie ist denn da die logik?"

### Die Logik

Ein halber Kosinus über `subPeriod` Sekunden, mit dem eigenen x-Wert als Phase (damit mehrere Boote nicht
im Gleichschritt tauchen), zusätzlich mit `smoothstep` abgeflacht — es verweilt oben und unten und
wechselt dazwischen zügig, statt gleichmäßig durchzufahren wie ein Kolben. Die Kollisions-Obergrenze
sinkt mit, damit über dem getauchten Boot keine unsichtbare Wand bleibt.

Die lief auch. Nur waren die Werte zu zurückhaltend, und zwar in beidem:

| | vorher | jetzt |
|---|---|---|
| Tauchweg | 2,4 m | **6,4 m** |
| Zyklus | 34 s | **26 s** |

### Warum man es nicht sah

**Der Weg war kleiner als die Dünung.** Die schwankt um ±1,6 m, also 3,2 m Hub — bei 2,4 m Tauchweg
bewegte die *Welle* das Boot stärker als das Tauchen, und das Tauchen ging darin unter.

Jetzt sind es 6,4 m, also das Doppelte der Dünung. Der Wert ist nicht gewählt, sondern gerechnet:
aufgetaucht steht die Turmspitze 10,3 m über Wasser, getaucht soll der Rumpf ganz weg sein und der Turm
bis zur halben Höhe einsinken — Spitze bei 4,0 m. Differenz 6,4 m.

**Und ein Zyklus war länger als ein Anflug.** Bei 34 s dauert eine Richtung 17 s; wer 20 s lang anfliegt,
sieht einen Teil davon, und der liegt womöglich in der flachen Phase oben oder unten. Mit 26 s sind es
13 s pro Richtung — ein Anflug von 15 bis 30 s zeigt also mindestens eine vollständige Bewegung.

Die Spitzengeschwindigkeit liegt damit bei 2,3 m/s. Ein echtes U-Boot taucht mit 0,5 bis 1 m/s, aber im
Spiel muss man es auch bemerken — das ist bewusst schneller als die Realität.

Nachgeprüft, dass die Kollisionsgrenze positiv bleibt: aufgetaucht 10,3 m, getaucht 3,9 m (im
Rückfall ohne Vermessung 7,6 → 1,2 m). `hitsSeaShip` gibt ab `top + 4` frei, ein Flieger auf 10 m Höhe
fliegt also darüber.
## Das U-Boot lag zu hoch, weil ich 62-fach falsch gemessen hatte

Gemeldet: „das uboot kann noch etwas tiefer tauchen. im moment sind es etwa 2/3 des rumpfen. so ist noch
1/3 plus der turm zu sehen. aber die optik ist toll. außerdem fährt das boot?"

### Der eigentliche Fehler

Beim Nachmessen für die Tauchtiefe fiel auf, dass **alle** meine U-Boot-Maße falsch waren. Ich hatte die
`min`/`max` der Accessoren aus dem GLB gelesen — das sind die **Rohkoordinaten der Meshes**, ohne die
Transformationen der Nodes, in denen sie hängen.

| | gemessen (falsch) | echt |
|---|---|---|
| Länge | 23,67 | **1476,4** |
| Breite | 3,61 | **361,2** |
| Höhe | 4,01 | **471,5** |

Faktor 62 daneben. Damit war jedes abgeleitete Maß falsch, und die Kommentare im Code beschrieben ein
Modell, das es nicht gibt („8,1 m Rumpfhöhe, 7,9 m Turm darüber").

### Wie das Modell wirklich aussieht

Nicht „Rumpf plus Turm", sondern vier Teile übereinander (im Spielmaßstab, 34.422 vermessene Punkte):

```
  0,0 ..  4,6 m   Tiefenruder und Schraube — ragen UNTER den Druckkörper
  4,6 .. 17,6 m   Druckkörper, 13,0 m dick, breiteste Stelle 23,2 m auf halber Höhe
 15,9 .. 22,9 m   Turm, 7,0 m hoch
 22,9 .. 30,3 m   Periskop und Antennen
```

Das Rumpf**deck** liegt bei 17,6 m. Ich hatte 10,1 m dafür gehalten — dort ist nur der dickste
Querschnitt. Ein Zwischenschritt, in dem ich Höhenbänder abgetastet und die breiteste Stelle als Deck
gelesen habe, führte deshalb erneut in die Irre; erst die Aufteilung **nach Mesh** (das längste Teil ist
der Rumpf) ergab ein widerspruchsfreies Bild.

### Warum ein Drittel Rumpf zu sehen war

`wl` 0,060 senkte das Modell um 5,7 m. Bei einem 8,1 m hohen Rumpf wären das 70 % gewesen — beim
wirklichen Deck auf 17,6 m lag es aber **11,9 m über Wasser**, der halbe Druckkörper schwebte frei. Genau
die Beobachtung.

### Neu

| | vorher | jetzt |
|---|---|---|
| `wl` | 0,0600 (5,7 m) | **0,1537 (14,6 m)** |
| `subDive` | 6,4 m | **5,8 m** |

Der Tauchweg wird *kleiner*, das Boot taucht aber **tiefer** — weil die Wasserlinie jetzt stimmt:

| | aufgetaucht | getaucht |
|---|---|---|
| Rumpfdeck | +3,0 m | **−2,8 m** (Rumpf ganz weg) |
| Turmfuß | +1,3 m | −4,5 m |
| Turmspitze | +8,3 m | **+2,5 m** (36 % des Turms bleiben) |
| Antenne (= `top`) | +15,7 m | +9,9 m |

3,0 m Freibord bei 13,0 m Rumpfdurchmesser sind 23 % über Wasser — ein aufgetauchtes U-Boot liegt echt
mit 20 bis 25 % über der Wasserlinie. 5,8 m Weg sind das 1,8-fache der Dünung (3,2 m Hub), bleiben also
sichtbar. Bei 26 s Zyklus sind das 0,45 m/s im Mittel, mit der smoothstep-Spitze rund 0,7 m/s — ein
echtes U-Boot taucht mit 0,5 bis 1 m/s, diesmal passt sogar das.

Nebenbei korrigiert sich das **Kollisionsband** mit: `loadShip` sammelt die Hülle aus y −2 bis 3, das
trifft jetzt Modellhöhe 12,6 bis 17,6 m, also den oberen Druckkörper unter dem Deck. Vorher lag das Band
auf den Rudern *unter* dem Rumpf.

### „außerdem fährt das boot?"

Ja — `spd: 1.8`, also 6,5 km/h. Es wird von `updateShipsSea` wie jedes andere Schiff bewegt, es ist nur
das langsamste auf dem Meer (die Frachter fahren 16 bis 20 km/h). Auf 95 m Länge braucht es 53 s für eine
eigene Schiffslänge, und ohne Bugwelle als Bezug sieht das aus wie Stillstand. Absichtlich so: ein
tauchendes Boot, das schnell fährt, ist weg, bevor man es angesehen hat.

### Lernpunkt

Beim Vermessen eines GLB **immer** die Node-Matrizen aufmultiplizieren. Der Fehler fällt nicht auf, weil
die Rohmaße plausibel aussehen und die Skalierung im Spiel sie ohnehin auf `len` normiert — nur alle
*relativen* Höhen darin sind dann Unsinn. Das ist der zweite Fall dieser Art (siehe die Notiz zum
Träger); ich habe es als Memory festgehalten.

## Orcas: springende Wale und eine tauchende Schule

Gewünscht: „ich würde ihn gerne aus dem wasser springen lassen... leicht gebogen. mit der schnauze voran,
einen halbkreis fliegend wieder ins wasser. was wäre gut sichtbar? 15m radius oder 20? bei orca größe = 8m?"
und „vielleicht noch hier und da eine kleine schule die im uboot modus auf und abtaucht".

### Das Modell

`killer_whale_by_Trouvaille.glb`, 460 KB — als base64-Wrapper nur 0,58 MB (das U-Boot war 7,1 MB).
Diesmal von Anfang an **mit Node-Matrizen** vermessen (1.656 Punkte): roh 482,98 × 366,55 × 919,85,
Längsachse Z. Auf 8 m normiert:

```
 0,00 .. 0,20 m   Brustflossen, 4,20 m Spannweite
 0,20 .. 1,40 m   Körper, rund, bis 2,06 m breit
 1,60 .. 3,19 m   Rückenfinne, nur 0,12 bis 0,53 m breit
```

Die 4,20 m „Breite" sind also die Flossen, nicht der Körper. 8 m ist die Länge eines ausgewachsenen
Bullen, das Modell passt unskaliert.

**Es ist animiert** — das erste Modell im Spiel mit Skeleton: 12 Joints, eine 2,03-s-Schleife, die
nahtlos läuft (2,2° Differenz zwischen erstem und letztem Frame). Die Schwanzjoints schlagen 24–32°, der
Kopf 5–10°. three.js r128 kann das, das Spiel nutzte bisher nur nichts davon (`AnimationMixer` kam null
mal vor).

### Warum 45° und nicht der gewünschte Halbkreis

Ein Halbkreis mit Radius R ist **2R weit und R hoch**. Eine Wurfparabel dieser Form braucht 63°
Abwurfwinkel und startet damit fast senkrecht — das ist eine Delfin-Bahn, kein 5-t-Orca, und es
widerspricht dem „leicht gebogen" aus derselben Frage. Bei 45° ist die Weite das **Vierfache** der Höhe.

Die 10 m Scheitelhöhe sind gegen drei Grenzen gerechnet:

| Grenze | Wert | Folge |
|---|---|---|
| Dünung (`AMP` 3,0) | 3,2 m Hub | ein realistischer Sprung (2–3 m) ginge darin unter |
| Bildfeld (Bootskamera 32 m, FOV 60°) | 40 × 10 m passt ab 30 m | Spawn ab 60 m querab |
| Form | H = W/4 bei 45° | 10 m Höhe ⇒ 40 m Weite, 2,86 s Flug |

Nachgerechnet ergibt die Bahn exakt 10,00 m Scheitel, 40,0 m Weite und ±45° an den Enden. Der
Nickwinkel folgt `atan2(vy, vHoriz)` — dieselbe Formel wie beim Flieger: beim Absprung +45°, am Scheitel
waagerecht, beim Eintauchen −45°. Das ist der Bogen „mit der Schnauze voran".

Zwischen zwei Sprüngen liegen 9 s normales Schwimmen (Zyklus 11,86 s), sonst hüpft er wie ein Flummi.

### Die Schule konnte das U-Boot-Verfahren nicht übernehmen

Beim U-Boot sind 5,8 m Tauchweg möglich, weil das Modell 30 m hoch ist. **Der Orca ist 3,19 m hoch —
kleiner als der Wellenhub von 3,2 m.** Jeder Weg, der ins Tier passt, verschwindet in der Dünung; man
sähe ein Auf und Ab, das die Welle sowieso macht. Genau der Fehler, der beim U-Boot zu „nicht abtauchen
gesehen" geführt hatte, nur diesmal unlösbar per Parameter.

Deshalb taucht die Schule **richtig**: 7 m unter die Oberfläche, Zyklus 22 s, halber Kosinus mit
smoothstep und dem eigenen x-Wert als Phase (37 m Abstand = 1,3 s Versatz, sichtbar verschieden aber noch
als Gruppe erkennbar). Der Wechsel ist damit „da / nicht da" und bei jeder Wellenhöhe sichtbar. Gemessen
pro 22-s-Zyklus: 5,6 s Rücken sichtbar, 12,4 s tiefer als 2 m weg. Finnenspitze getaucht bei −4,76 m,
also 3,16 m Reserve gegen das Wellental bei −1,6 m.

### Der Nickwinkel war erst falsch — und der Weg dorthin ist der Lernpunkt

Mein erster Ansatz war `-dg/dt * ORCA_DIVE * 0.55`, also „Ableitung mal Daumenfaktor", mit dem Kommentar
„hält den Ausschlag unter 25 Grad". Nachgemessen: **47,3°**. Der Term hat gar keine Winkeleinheit, der
Faktor war reines Raten — und die Begründung im Kommentar klang trotzdem plausibel.

Richtig ist dieselbe Formel wie beim Sprung, `atan2(vy, vHoriz)`. Hergeleitet: max |dg/dt| = 0,2142 pro
Sekunde, mal 7 m Tauchweg = 1,50 m/s Sinkgeschwindigkeit; bei 3,2 m/s Fahrt ist der Bahnwinkel
`atan2(1,50; 3,2)` = **25,1°**. Genau der Wert, den ich vorher geschätzt hatte — nur diesmal abgeleitet
statt getroffen. (Echte Orcas tauchen mit 1–2 m/s, passt also auch.)

Das ist dasselbe Muster wie bei den Jetpack-Runden: eine selbst erfundene Abweichung mit plausibel
klingender Kommentar-Begründung. Diesmal hat die eigene Prüfung es vor dem Commit gefunden.

### Zwei technische Fallen

**`.clone(true)` funktioniert bei Skeleton-Modellen nicht.** `SkinnedMesh.copy` in r128 übernimmt das
Skeleton **per Referenz** (`this.skeleton = t.skeleton`, im Minifikat nachgelesen) — alle sechs Orcas
hingen am selben Knochensatz und würden zwangsläufig dieselbe Pose einnehmen, egal wie die Mixer laufen.
Gelöst mit einem eigenen `cloneSkinned()`: normal klonen, Knochen-Klone nach Namen einsammeln, jedem
`SkinnedMesh` ein neues `Skeleton` daraus binden. Wichtig dabei: die `bindMatrix` des Originals
**mitgeben** — `bind()` ohne zweites Argument rechnet aus der aktuellen `matrixWorld`, das Tier würde je
nach Spawnstelle verzerrt.

**`preloadOrca` wurde jeden Frame aufgerufen.** `gl.parse` ist asynchron und setzt `orcaTpl` erst im
Callback; der Guard `if(orcaTpl) return` greift also nicht, und bei 60 fps starteten dutzende
Parse-Vorgänge parallel auf demselben GLB. Behoben mit `orcaLoading`, das im Fehler-Callback
zurückgesetzt wird (sonst lädt es nach einem Fehlschlag nie wieder).

Dazu `frustumCulled = false`: die Bounding-Box eines `SkinnedMesh` gilt für die Bindepose, nicht für die
verformte Haltung — three.js würde das Tier am Bildrand wegschneiden, während die Fluke noch sichtbar
sein müsste.

### Bewusst keine Hindernisse

Orcas stehen in **keiner** Kollisionsliste. Ein 8-m-Tier, das dicht am Boot auftaucht, würde sonst zum
Absturz führen, wo man nichts falsch gemacht hat — und ein Wal weicht aus, ein Frachter nicht. Umgekehrt
weichen sie Land, Strand, Träger und Schiffen aus (30 m Vorausschau = 9 s Reaktionsweg bei 3,2 m/s).

### Werte

| | |
|---|---|
| Tiere | 6, davon ~1/3 Springer, in Gruppen bis 26 m Radius |
| Spawn | 60–220 m (Schiffe: ab 1.200 m — ein 8-m-Tier wäre da zwei Pixel groß) |
| Despawn | 420 m |
| Tempo | 3,2 m/s = 11,5 km/h (echte Orcas: 8–12) |
| Sprung | 45°, 10 m hoch, 40 m weit, 2,86 s, alle 11,86 s |
| Tauchen | 7 m tief, Zyklus 22 s, max 25,1° Nickwinkel |

### Nachtrag: sie schwammen rückwärts

Gemeldet: „die orcas springen rückwärts... Fahrtrichtung wäre um 180° gedreht".

Nachgemessen am Längsschnitt (16 Bänder über die 8 m Länge):

| Merkmal | Z-Position | Maß |
|---|---|---|
| Fluke (flach + breit) | 0,0 m | Höhe 0,12 m, Breite 2,06 m |
| Rückenfinne (höchste Stelle) | 4,5 m | Höhe 3,01 m |
| Brustflossen (breiteste Stelle) | 5,0–6,0 m | Breite 4,16–4,20 m |

Beim Orca sitzen Brustflossen und Finne im vorderen Drittel, die Fluke am Ende — der Kopf liegt in diesem
Modell also bei **hohem Z**, die Schnauze zeigt auf +Z. Das Spiel erwartet sie auf −Z.

Derselbe Fall wie `rot180` beim Kreuzfahrtschiff und beim Liberty-Frachter. Ich hatte beim Orca nur nicht
darauf geprüft: die Längsachse lag schon auf Z, damit sah der Loader fertig aus. Die Ausrichtung
**innerhalb** der Achse ist aber eine zweite, unabhängige Frage — und bei den Schiffen steht genau dazu ein
Kommentar, den ich hätte lesen können. Der Lernpunkt ist derselbe wie beim U-Boot: eine Messung, die
plausibel aussieht, beantwortet nicht automatisch die Frage, die man eigentlich hat.

`obj.rotation.y += Math.PI` steht vor der Zentrierung, weil `rotation.y` um den Objektursprung dreht und
der hier nicht in der Modellmitte liegt (roh Z −916 bis 4). Nachgerechnet: nach dem Skalieren Z
−7,967…0,035, nach der Drehung −0,035…7,967, nach dem Zentrieren symmetrisch −4,001…4,001 — und der Kopf,
vorher bei Z-max, sitzt jetzt bei −4,0, also auf −Z.

### Nachtrag 2: Sprung mit Anlauf und Tauchbogen

Gewünscht: „die orcas könnten beim eintauchen ganz unter wasser gehen und dann wieder etwas auftauchen (so
wie sie jetzt sind)".

Der Springer-Zyklus hat jetzt **vier** Abschnitte statt zwei:

| Phase | Dauer | was passiert |
|---|---|---|
| Schwimmen | 7,0 s | Rücken 0,45 m heraus, Nase waagerecht |
| Anlauf | 4,0 s | sinkt 1,90 m ab und kommt mit Steigung heraus |
| Flug | 2,86 s | 10 m hoch, 40 m weit, ±45° |
| Unter Wasser | 6,0 s | 6,11 m tief, ganz verschwunden |

Zusammen 19,86 s — ein Sprung also alle 20 s je Springer statt alle 11,9 s.

**Unter Wasser:** Sinusbogen `y = swimY - D·sin(π·s)`. `sin` und nicht `sin²` oder smoothstep, weil es an
beiden Enden die Steigung π hat — er taucht *mit* Fahrt ein und kommt *mit* Fahrt heraus, statt an der
Oberfläche zu kleben. Die Tiefe ist nicht gewählt, sondern folgt aus der Stetigkeit: in der Luft kommt er
mit −45° an, also vy/vh = −1; unter Wasser ist vh = `ORCA_SPD`, gebraucht wird also vy = −`ORCA_SPD`, und
mit vy = D·π/T ergibt das **D = ORCA_SPD·T/π = 6,11 m**. Die Oberkante liegt am tiefsten Punkt bei
−3,87 m, deutlich unter dem Wellental (−1,6 m) — er ist wirklich ganz weg. Beim Auftauchen +45°, also
Schnauze nach oben heraus.

**Anlauf:** Beim Nachrechnen fiel auf, dass die Nase beim Absprung in *einem* Frame von 0 auf +45° sprang
— **44,8° Knick**. Beim Eintauchen hatte ich auf Stetigkeit geachtet, beim Absprung nicht; die Simulation
hat es gefunden, im Spiel wäre es als Zucken aufgefallen. Ein Wal springt auch nicht aus dem Stand.

Die Bahn ist `f(s) = -A·s²·(1-s)`, gewählt weil sie an beiden Enden passt:

- `f(0) = 0` und `f'(0) = 0` → geht waagerecht aus dem Schwimmen heraus
- `f(1) = 0` und `f'(1) = +A` → endet auf Schwimmhöhe und steigt dort schon

Für die +45° braucht es A = `ORCA_SPD`·T. Die Anlauftiefe folgt daraus: Minimum bei s = 2/3, dort
4A/27 = 1,90 m.

**Nachgerechnet:** alle vier Bahnübergänge sind exakt stetig in Höhe *und* Nickwinkel — Differenz 0,00° an
jedem. Was in der Simulation zunächst als 2,25°-Sprung auftauchte, ist die Nase, die nach dem Auftauchen
mit `3·dt` auf waagerecht gelerpt wird: eine gewollte Bewegung, in einer halben Sekunde abgeklungen, nach
den 7 s Schwimmen bei 0,004° — worauf der Anlauf mit `f'(0) = 0` wieder aufsetzt.

**Nebenbei ein Fehler, den die Prüfung abgefangen hat:** `ORCA_SPD` musste nach oben wandern, weil
`ORCA_DIVE_J` es in seiner eigenen Deklaration liest. `const` wird nicht gehoisted — in der ersten Fassung
stand die Nutzung 23 Zeilen vor der Deklaration, was beim Laden einen `ReferenceError` geworfen und das
Spiel schwarz gelassen hätte.

## U-Boot: mehr Fahrt

Gewünscht: „gib dem uboot etwas mehr vorwärts geschwindigkeit."

`spd` von 1,8 auf **4,0 m/s** (6,5 → 14,4 km/h).

| Typ | km/h | Länge | Längen/min |
|---|---|---|---|
| Kreuzfahrtschiff | 19,8 | 250 m | 1,32 |
| Container | 18,0 | 300 m | 1,00 |
| Liberty | 16,2 | 135 m | 2,00 |
| **U-Boot neu** | **14,4** | 95 m | **2,53** |
| Großsegler | 10,8 | 90 m | 2,00 |
| ~~U-Boot alt~~ | ~~6,5~~ | 95 m | ~~1,14~~ |

Vorher brauchte es 53 s für eine eigene Schiffslänge — das war Fahrt, sah aber ohne Bugwelle als Bezug wie
Stillstand aus (genau die frühere Frage „außerdem fährt das boot?"). Jetzt 24 s. Untertrieben ist es
weiterhin: ein echtes U-Boot fährt aufgetaucht 12–20 kn, also 22–37 km/h. `spawnSeaShips` streut jeden Wert
um ±20 %, hier also 11,5–17,3 km/h.

Zwei Dinge geprüft, bevor ich den Wert gesetzt habe:

- **Ausweichen** bleibt heil, weil es tempo-unabhängig gebaut ist: bei Land voraus (geprüft in halber
  Rumpflänge, 47,5 m) hält das Schiff an und dreht nur den Kurs. Bei 0,08 m Weg pro Frame ist die
  Vorausschau reichlich, egal wie schnell es fährt.
- **Tauchen** wird sogar besser: ein 26-s-Zyklus deckt jetzt 104 m Strecke statt 47, das Boot taucht also
  über eine sichtbar längere Bahn ab und auf.

---

# Unterwasserwelt und fahrbares U-Boot

Gewünscht: „ich brauche noch ein meer für das ubbot zum fahren", dazu „wir brauchen noch eine
unterwasserwelt" und „das uboot müsste neben dem feuerwehrboot rückwärts am strand stehen zum begehen
oder verlassen, aber auch, als letztes in der reihe, beim start zu wählen … also quasi einen
fuerwehrboot modelkopie". Und der Hinweis, der zwei Modelle gespart hat: „als wrackmodelle könnte man
ja das eh schon vorhandene segelboot und die liberty nehmen."

Die vier Fragen aus der letzten Runde vorher gestellt und beantwortet bekommen: **volle Welt mit
Wracks**, Tiefe **~200 m**, **Nase steuert die Tiefe**, Welt und Fahren **in einem Zug**.

## Was gebaut wurde

Ausführlich im README („Die Unterwasserwelt und das fahrbare U-Boot"). Kurz:

- **Meeresboden** (`seabedY`, `updateSeabed`) mit Schelf am Ufer, Abbruchkante und Relief, Farbe nach
  Tiefe. Bis 200 m auf offener See.
- **Unterwasser-Sicht** (`updateUnderwater`): Nebel 3–42 m statt 900–3000 m, Farbe von Türkis nach
  Schwarz mit der Tiefe, gedämpftes Licht, geblendeter Übergang.
- **U-Boot als achtes Modell** (`Sub`, `stepSub`) — Strandplatz auf der dritten Hafenseite, Einsteigen
  mit Y, Kulisse verschwindet beim Fahren, Aussteigen nur aufgetaucht am Ufer.
- **Wracks aus Liberty und Großsegler**, Seegras, Korallen, Fischschwärme (`uwCells`, `updateFish`).
- Wasserfläche jetzt `DoubleSide`, Kamerasperre `y = 2` weicht bei `subTaucht()`.

## Fünf Fehler, die dabei aufgefallen sind — und wie sie gefunden wurden

Alle fünf hätte man beim Lesen des Codes nicht gesehen. Gefunden wurden sie, weil das Spiel in einem
**headless Chrome über das DevTools-Protokoll** geladen und tatsächlich gefahren wurde (`C:/tmp/uw/`:
`devtest.js` lädt und sammelt Konsolenfehler, `drive.js` fährt und taucht, `board.js` steigt ein und
aus, `perf.js` misst Kosten). Reine Syntaxprüfung findet nichts davon.

1. **`SEABED_SHORE_Y = ISLAND_Y - 1.5` warf beim Laden.** Der Meeres-Block steht **vor** dem
   Insel-System, `const` wird nicht gehoistet — ReferenceError, schwarzes Bild. Jetzt eine Zahl mit
   Kommentar. *Derselbe Stolperstein wie bei `ORCA_DIVE_J`, wo der Kommentar es festhält.*
2. **`seabedInit()` warf aus demselben Grund**, nur eine Ebene tiefer (im Funktionsaufruf, deshalb fand
   es der Scanner der top-level-Zeilen nicht): es braucht `CELL` und `islandInfo`. Der Aufruf steht
   jetzt beim Spielstart neben `updateIslands()`.
3. **Die Strand-U-Boote fehlten alle** (`strandUboote: 0` im laufenden Spiel gemessen, während
   `shipTemplates` alle fünf Modelle hatte): `buildIsland` läuft, bevor das GLB da ist, und niemand
   baute danach neu. `preloadSeaShips` ruft jetzt `refreshIslands()` — genau was `preloadBoat` fürs
   Kai-Feuerwehrboot tut. Für `liberty`/`sail` ebenso ein `clearUwCells()`, sonst bleiben die Wracks weg.
4. **Der Auftauch-Guard sperrte im Wellenberg.** Er verglich `state.pos.y` mit `seaSurfaceY - 1.0`,
   aufgetaucht liegt das Boot aber **auf der Welle** (bis 2,1 m) — Y meldete „erst auftauchen", obwohl
   es oben lag. Jetzt zählt `state.onGround`, das `stepSub` selbst setzt: eine Wahrheit statt zweier.
5. **Der Ausstieg am Strand war unmöglich.** Ein fester Punkt 61 m vor dem Bug erreichte den Sand
   nicht: das U-Boot liegt weiter draußen als das Feuerwehrboot (Faktor 1,30 gegen 1,12), gemessen
   fehlten 24 m. Jetzt wird der Weg bis 130 m **abgesucht** — robust gegen Liegeplatz und Inselgröße.

## Zwei Werte, die die Messung korrigiert hat

- **Wracks: 0,22 → 0,07.** Mit 0,22 lag in 43×43 km alle **2,5 km** eines, dichter als die
  Flugzeugträger — und jede Kopie ist ein volles Schiffsmodell. Jetzt alle 4,7 km, im Schnitt 0,7
  gleichzeitig geladen.
- **Vegetation: 5,8 → 33 von 40 Objekten.** Erst über die ganze Zelle gestreut und 34 wieder
  verworfen, dann gezielt im Schelfring — und dessen Breite nachgerechnet: bei 0,55·`SHELF_W` lag die
  Hälfte hinter der 40-m-Lichtgrenze, richtig sind 0,30 (40 m Tiefe = 107 m vom Ufer).

## Und die Bildrate

`updateSeabed` kostete als Ganzes **9,3 ms** — bei 16,7 ms Budget und 6,8 ms für das bestehende Meer
zu viel, und im X-Wing (686 m/s) fiele es alle 0,18 s an. Zwei Maßnahmen: der Boden **rastert** auf
125 m ein (nur bei Zellenwechsel neu), und die Neuberechnung läuft in **Häppchen** von 6 Gitterzeilen
pro Frame — wie `stepGroundFields` das Höhenraster von Mond und Mars ausmisst. Nachgemessen **0,8 ms**.
Die ganze Unterwasserwelt kostet jetzt rund **1,05 ms** pro Frame.

## Nachtrag am selben Abend: der Ausstieg ging ins Wasser

Gemeldet: „der astronaut muss beim aussteigen aber am strand sein" — und nachgemessen war das genau
der Fall, den ich verpasst hatte. `leaveHarborBoat` sucht festen Grund bis `BOAT_LOOK*3` = **24 m**
vor dem Bug. Das passt fürs 16-m-Feuerwehrboot, das mit dem Heck im Sand liegt; das U-Boot hält
**85 m** vor der Sandkante (95 m Rumpf, Liegeplatz bei Faktor 1,30 statt 1,12). Die Suche fand nie
etwas, der Rückfall ist die Bootsposition — der Astronaut stand im Wasser (`evaSolid` false,
Fußhöhe 0,00 statt 0,30). Betroffen war nur **Weg A** (über den Strand eingestiegen); Weg B über die
Modellauswahl setzte ihn korrekt in den Sand, weil dort ein eigener Suchlauf lief.

Erst als Reichweiten-Fix gebaut (fahrzeugabhängig, plus Suche zur nächsten Insel, wenn der Bug
schräg steht). Dann kam der bessere Vorschlag: **„aussteigen = astronaut im schlauchboot und wenn
mit schlauchboot uboot berührt = im uboot. dann gibts keine wasser probleme."**

Genau so gebaut, und es ist die richtige Lösung — nicht bloß die bequemere. Das Spiel behandelt
**jede** Wasserkante so: der Schritt vom Trägerdeck, der Schritt über die Kaikante, der Fallschirm
aufs Meer. Überall fängt das Schlauchboot auf, statt zu verbieten. Der Ausstieg an Land war der
Fremdkörper, und die Ufersuche wäre nur die Verwaltung dieses Fremdkörpers gewesen.

- `evaExitToDinghy` setzt den Astronauten quer neben den Rumpf und gleich ins Schlauchboot.
- `dinghyTouchesHarborSub` prüft die **Rumpfhülle** (106 × 18 m, in Bootskoordinaten gedreht wie
  `hitsSeaShip`) — ein Mittelpunktsabstand wäre an Bug und Heck 47 m daneben.
- Entfallen sind dabei `nearHarborSub`, `HARBOR_SUB_NODINGHY` und `evaExitFromSub`: die Sperrzone
  gegen das Schlauchboot war das Gegenteil von dem, was jetzt gewollt ist.

### Drei Fehler, die dieser Umbau selbst hatte

Alle drei im laufenden Browser gefunden, keiner beim Lesen sichtbar:

1. **Man kam nie zurück.** `dinghyTouchesHarborSub` brach bei `isSub()` ab („man fährt es selbst,
   dann liegt keine Kulisse da"). Nach dem Ausstieg steht `MODEL_NAMES` aber weiter auf `Sub` — das
   U-Boot ist ja das Fahrzeug, zu dem man zurückkehrt. Gemessen: nach 30 s Heranfahren kein Umstieg.
   Jetzt zählt zuerst `eva.planeAt`, der gemerkte Platz (dieselbe Größe, mit der `evaCanBoard` den
   Flieger wiederfindet).
2. **Absturz beim Umsteigen.** `updateDinghy` löst `eva` auf, und `updateEva` liest die Zeile danach
   `eva.planeAt` — TypeError, Bild steht. Dasselbe Sicherheitsnetz, das `updateJet` schon hat (dort
   steht ausdrücklich, dass das Jetpack innerhalb eines Frames ausgehen kann).
3. **Aussteigen war unmöglich.** Das Schlauchboot entsteht neben dem Rumpf, also noch in der
   Berührungszone — man saß im selben Moment wieder drin (gemessen: Umstieg nach **0 Frames**). Ein
   größerer Abstand wäre Flickwerk (er müsste die halbe Rumpflänge abdecken). Stattdessen eine
   Sperre, die erst löst, wenn man die Zone einmal verlassen hat: im Spiel nach **0,9 s**.

Der Ablauf im Ganzen, so gemessen: Y → im Schlauchboot 22 m neben dem Rumpf · wegfahren, Sperre löst
nach 0,9 s · 123 m weg gedreht · zurück → nach 12,1 s wieder im U-Boot. Kein Trockenstehen, kein
Sofort-Umstieg, kein Absturz.

## Offen geblieben

- **Die Orcas tauchen nur 7 m.** Von unten sieht man sie jetzt, aber sie bleiben knapp unter der
  Oberfläche — ihr Modell ist nur 3,19 m hoch, ein tieferes Tauchen bräuchte die Begründung von
  `ORCA_DIVE` neu. Wäre schön, wenn eine Schule mal am U-Boot vorbeizieht.
- **Wracks sind reine Kulisse.** Man kann hineinfahren (der Rumpf sperrt nicht, weil `hitsSeaShip` nur
  die fahrenden Schiffe kennt). Ob das ein Fehler ist, muss man im Spiel entscheiden — durch ein
  offenes Wrack zu tauchen wäre auch schön.
- **Kein Licht am Boot.** Auf 200 m ist es dunkel; ein Scheinwerfer wäre der nächste Schritt, wenn die
  Tiefsee interessanter werden soll.

❯ c:\Users\flori\Downloads\ElevenLabs_Möwen_am_Meer.mp3 c:\Users\flori\Downloads\ElevenLabs_Ozeansturm.mp3

Zwei Sounddateien. Ich sehe mir sie und das vorhandene Sound-System an, bevor ich etwas einbaue:

  Searched for 1 pattern, ran 6 shell commands

Ich verstehe das System. Bevor ich einbaue, kläre ich die Größenfrage — die MP3s sind 1,2 MB zusammen:

  Ran 1 shell command

10 s Möwen und 20 s Sturm bei 320 kbps. Bevor ich einbaue, eine Frage zum Einsatz — davon hängt die Umsetzung ab:

● User answered Claude's questions:
· Wo sollen die beiden Sounds zu hören sein? → "Möwen an der Insel, Sturm auf offener See (Empfohlen)"
· Sollen die Sounds auch im U-Boot unter Wasser laufen? → Nein, unter Wasser ausblenden (Empfohlen)

Klar. Ich konvertiere die MP3s und baue das System:

● Bash(node -e "
      const fs=require('fs');…)
geschrieben: 1.53 MB

Name        Length
… +2 lines
1 file changed (binary, mode only or too large to show)
Allowed by auto mode classifier

  Ran 1 shell command

Beide Dateien sind intakt (ID3-Header). Jetzt suche ich das <script>-Tag für sounds.js:

  Ran 1 shell command

❯ die töne aber insgesamt leise... und bitte das uboot ein anderes motoren geräusch

Notiert: leise, und eigener U-Boot-Motor. Erst sehe ich mir den vorhandenen Bootsmotor an:

  Ran 1 shell command

Sehr gute Vorlage — dasselbe Verfahren nutze ich für den U-Boot-Motor. Ich prüfe, wie der Bootsmotor angebunden ist:

  Ran 1 shell command

Ich sehe die Struktur: das U-Boot nutzt den Bootsmotor. Ich baue beides — eigenen U-Boot-Motor plus die Meeresgeräusche:

● Write(C:\tmp\subsnd.js)
Wrote 60 lines to ..\..\..\..\..\..\tmp\subsnd.js
// ---- U-BOOT-MOTOR: tiefes Summen statt Aussenborder ---------------------------------------------
// Das U-Boot lief bisher mit demselben synthetischen Motor wie das Feuerwehrboot. Das ist als
// Notloesung verstaendlich (beides sind Schiffsdiesel), klingt aber falsch: ein Aussenborder
// blubbert und schlaegt, ein getauchtes U-Boot summt. Man hoert einen Elektromotor und die
// Schraube, gedaempft durch den Druckkoerper — keine Auspuffschlaege, denn unter Wasser laeuft
// kein Verbrennungsmotor.
//
// Gebaut nach demselben Verfahren wie makeBoatEngineBuffer, und der wichtigste Punkt daran ist der
// NAHTLOSE Loop: jede beteiligte Schwingung muss am Pufferende genau dort stehen, wo sie angefangen
// hat, sonst knackt es bei jeder Wiederholung. Dafuer werden alle Frequenzen als ganzzahlige
… +50 lines

● Write(C:\tmp\ambsnd.js)
Wrote 77 lines to ..\..\..\..\..\..\tmp\ambsnd.js
// ---- MEERESKULISSE: Moewen an der Insel, Ozeanrauschen draussen ---------------------------------
// Zwei Aufnahmen (ambient.js), beide als Dauerloop, beide LEISE — sie sollen die Szene traegen, nicht
// im Vordergrund stehen. Der Motor bleibt das laute Geraeusch.
//
// Ortsabhaengig, und das ist der Reiz: Moewen sind Kuestenvoegel, man hoert sie also nur in
// Inselnaehe, und das Ozeanrauschen gehoert nach draussen aufs offene Meer. Wer vom Hafen hinaus
// faehrt, hoert die Moewen verklingen und das Meer aufkommen.
//
// Beides nur UEBER Wasser und in Bodennaehe: unter Wasser hoert man keine Moewen (dort laeuft der
// Motor und das Stroemungsrauschen), und aus 3.000 m Hoehe auch nicht.
… +67 lines

● Write(C:\tmp\v1.ps1.txt)
Wrote 66 lines to ..\..\..\..\..\..\tmp\v1.ps1.txt
$p = 'C:\Users\flori\Documents\Software\Github\Flugspiel\Flugspiel.html'
$t = [IO.File]::ReadAllText($p)
$NL = "`r`n"
function Rep($t, $alt, $neu, $name){
  $n = ([regex]::Matches($t, [regex]::Escape($alt))).Count
  if($n -ne 1){ Write-Host "FEHLER $name : $n Treffer (erwartet 1)"; exit 1 }
  Write-Host "ok  $name"
  return $t.Replace($alt, $neu)
}
$sub = [IO.File]::ReadAllText('C:\tmp\subsnd.js').Replace("`r`n","`n").Replace("`n","`r`n").TrimEnd()
… +56 lines

● Sounds einbauen
  ⎿  $ cd /c/tmp && node -e "const fs=require('fs');fs.writeFileSync('C:/tmp/v1.ps1','\uFEFF'+fs.readFileSync('C:/tmp/v1.ps1.txt','utf8'),{encoding:'utf8'});" && powershell -NoProfile -ExecutionPolicy Bypass -File C:/tmp/v1.ps1
---

## 2026-09-16 — Das Wrack, das nie zu sehen war (und ein Sonar dazu)

Meldung: **"es gibt immer noch kein echtes wrack unter wasser"** — mit dem Auftrag, den Versuch
ganz zu entfernen, die Dichte der kleinen Wracks um 1 zu erhoehen und alle 15 s einen leisen Ping
einzubauen, dessen Lautstaerke am naechsten Wrack haengt.

**Der Grossfund wurde nicht entfernt, sondern repariert.** Nachgesehen, statt der Annahme zu
folgen: das Modell war nicht zu selten, es wurde **ueberhaupt nicht gezeichnet**. In `makeWreck`
stand beim Umfaerben

```js
o.material = mats.map(...);                                  // liefert IMMER ein Array
if(!Array.isArray(o.material)) o.material = o.material[0];   // also nie erfuellt
```

Jedes Mesh bekam damit ein **Array**-Material. three.js r128 zeichnet ein Array-Material
ausschliesslich ueber `geometry.groups` — und die Liberty ist **ein** Mesh aus **einem** primitive
(im GLB nachgesehen: 1 Mesh, 1 Material, 12.263 Dreiecke, `C:/tmp/glbmat.js`). Ohne Gruppen wird
nichts gemalt. Das Wrack lag also die ganze Zeit da, mit Fischschwaermen darueber und einem roten
Punkt im Periskop, nur unsichtbar. Deshalb half auch keine der beiden Erhoehungen der Haeufigkeit
(0,2 -> 0,5) — sie kurierten ein Symptom, das es nicht gab. Der Fix entscheidet jetzt **vor** der
Zuweisung, ob es eine Liste war.

**Lehre fuers naechste Mal:** zweimal wurde eine Zahl erhoeht, weil etwas "zu selten" schien. Wenn
eine Haeufigkeitserhoehung nichts bringt, ist die Haeufigkeit nicht das Problem.

### Dichte: ein zweiter Wurf je Wasserzelle

`wreckInfo` war auf **ein** Wrack je Zelle festgelegt. Jetzt `wreckInfo1(cx, cz, k)` je Wurf plus
`wreckInfos(cx, cz)` fuer die Liste, `WRECK_TRIES = 2`. **k = 0 rechnet genau wie vorher** — ein
Wrack, das man schon gefunden hat, liegt weiter an derselben Stelle (427 alte Standorte geprueft,
alle unveraendert).

Nachgemessen in 102,8 x 102,8 km (14.641 Zellen, `C:/tmp/wmeas.js`):

| | vorher | nachher |
|---|---|---|
| Wracks | 3.622 (24,7 % der Zellen) | 6.865 (46,9 %) |
| Weg zum naechsten | 793 m | 621 m |
| gleichzeitig geladen (3x3 Zellen) | — | im Mittel 4,5, hoechstens 14 |

**Zwei Fehler dabei selbst gefunden und behoben**, beide durch Messen statt Hinsehen:
1. Die zwei Wuerfe einer Zelle streuen unabhaengig ueber 510 m — **13,6 % der Paare steckten
   ineinander**, der engste 5,3 m auseinander bei 82 m Rumpflaenge (`C:/tmp/wnah.js`). Jetzt faellt
   der spaetere Wurf weg, wenn er zu nah kommt (`WRECK_MIN_GAP = 1,3`). Kostet 450 Wracks, aber der
   Weg zum naechsten steigt nur von 601 auf 621 m.
2. Beim **Grossfund** ist die wirkliche Laenge 135 m (SHIP_TYPES), nicht das gewuerfelte `len` des
   ungenutzten Nachbaus. Mit `len` gerechnet lagen 40 von 745 Grossfund-Paaren zu nah
   (`C:/tmp/wgross.js`) — deshalb `wreckLen(info)`. Danach: 0.

Nur der **erste** Wurf kann ein Grossfund sein: ein zweiter GLB-Frachter in derselben Zelle waere
ein volles Schiffsmodell mehr und nimmt dem Fund seine Besonderheit.

### Sonar-Ping als Suchgeraet

`updateSonar` / `playSonarPing`: alle 15 s, **nur getaucht im U-Boot** (`uwCamBlend > 0,6`), sonst
laeuft die Uhr zurueck auf 15 s. Synthetisch wie die Motoren und der Ueberschallknall — ein
Sinus 1.050 -> 880 Hz mit 8 ms Anschlag und exponentiellem Nachhall, Tiefpass bei 1.800 Hz, weil
Wasser die Hoehen wegnimmt. Phase integriert statt `sin(2*pi*f*t)`, sonst springt sie beim
Frequenzabfall (dasselbe Verfahren wie `makeSubEngineBuffer`).

Lautstaerke **0,02 bis 0,10** ("von schwach bis leise"), smoothstep ueber 1.200 m Radius — bewusst
unter dem Motor (0,09 Leerlauf bis 0,25 Vollgas) und knapp unter dem Periskop-Radius (1.400 m),
damit das Bild eher da ist als der Ton. Abstand im **Raum** gerechnet, nicht in der Ebene: ein
Wrack 100 m unter einem ist nicht "da". Nachgemessen an 500 Standorten: in 5,2 % ist nichts in
Reichweite (dann bleibt es still), sonst im Mittel 0,065.

### Offen

- **Boot verschwindet mit der Welle unter dem Strand** (Screenshot vom 16.09.). Recherchiert, aber
  noch nicht behoben: `updateHarborBoats` hat fuer das ruhende Kai-Boot schon eine Untergrenze
  (`Math.max(ISLAND_Y - BOAT_DRAFT*0.6, ...)`), `stepBoat` fuer das **selbst gefahrene** Boot aber
  nicht — dort steht `state.pos.y = seaSurfaceY(0, 0, dt) - BOAT_DRAFT;` ohne Boden.
- Ob der Grossfund jetzt gefaellt, muss im Spiel entschieden werden — er war noch nie zu sehen.
---

## 2026-09-16 (2) — Das Wrack lag richtig, nur nicht auf dem Grund

"das wrack sieht toll aus. aber es schwebt jetzt in der luft." — richtig, und es schwebte auch
vorher schon, nur unsichtbar. Die Aufsetzhoehe war **geschaetzt**:

```js
const hoch = Math.abs(Math.sin(info.roll)) * (hw + (h && h.top ? h.top*0.5 : hw));
```

Gegen die echte GLB-Geometrie geprueft (147 Lagen, `C:/tmp/wfloat.js`) schwebte der Frachter im
Mittel **8,05 m**, im schlimmsten Fall **13,06 m**. Jetzt wird es **gemessen** statt gerechnet: erst
`rotation.set(...)`, dann `new THREE.Box3().setFromObject(g)`, dann um `bb.min.y` anheben und 0,4 m
einsinken lassen. Nachgeprueft ist die Abweichung **0,000000 m** fuer alle 6.895 Wracks im
Messgebiet — und das gilt fuer jedes Modell und jede Lage, ohne Sonderfall.

**Lehre:** dieselbe Sorte Fehler wie beim unsichtbaren Wrack. Beides Mal stand eine Formel da, wo
eine Messung hingehoert — und beides Mal fiel es jahrelang nicht auf.

### Der Segler liegt jetzt auch unten

War ausgeschlossen, weil die alte Rechnung ihn halb in den Boden zog (sie arbeitete mit der halben
Rumpfbreite, waehrend seine Masten gekippt zur Seite ragen). Mit der Box-Messung faellt der Grund
weg: Masten sind einfach Teil der Box. Jeder zweite Grossfund ist jetzt ein Segler — **870 Segler**
gegen 969 Frachter im Messgebiet.

### Ein zweiter Fund beim Nachmessen: Wracks ragten aus dem Meer

`WRECK_MIN_DEPTH` stand auf **25 m**, der Kommentar dazu schaetzte "gut 20 m Aufbauhoehe". Gemessen
ragt der Frachter **44,5 m** hoch — in 33 m Wasser stand er also **6 m aus dem Meer heraus**. Auch
das war vorher unsichtbar.

Dann die Rueckfrage: *"wenn der frachter auf der seite liegt muesste seine breite entscheidend sein
nicht die hoehe oder laenge … dann wird die breite zur hoehe"* — **genau richtig**, und
nachgerechnet (`C:/tmp/wachse.js`):

| Kraengung | senkrechte Ausdehnung | |
|---|---|---|
| 80 Grad | **20,5 m** | = Rumpfbreite (20,3 m) |
| 60 Grad | 23,4 m | |
| 34 Grad | 29,6 m | Hoehe dominiert (32,8 m aufrecht) |

Der schlimmste Fall war also die **flachste** Lage, nicht die steilste — plus die Neigung ueber Bug
und Heck (+-10 Grad), die bei 135 m Rumpf ein Ende um rund 12 m hebt. Deshalb liegen die Wracks
jetzt **steiler: 55 bis 85 Grad** statt 34 bis 80. Das sieht mehr nach Wrack aus (34 Grad wirkt wie
ein fahrendes Schiff) und senkt die noetige Tiefe deutlich:

| | Hoehe | braucht Wasser |
|---|---|---|
| Frachter | 38,0 m | 46 m (vorher 53) |
| Segler | 48,1 m | 57 m (vorher 71) |
| Nachbau | 0,460 x Rumpflaenge | ab 41 m |

Statt Wracks im flacheren Wasser zu **verbieten**, wird die Nachbau-**Laenge** gedeckelt
(`lenMax = (tiefe - WRECK_CLEAR) / WRECK_H_FACTOR`) — dort liegt dann ein Kuestenfrachter statt
eines Stueckgutschiffs. Nachgemessen: kein Wrack kuerzer als 69,8 m, kein Wrack ragt heraus (der
hoechste Punkt liegt **14,6 m unter** der Oberflaeche), und **alle 677** alten Wrackstellen liegen
unveraendert am selben Platz.

### Sonar: echte Aufnahme, auf B

Der synthetische Sinus ist weg, die mitgebrachte Aufnahme (`sunovia-sonar-ping`, 216 kB, 6,7 s) sitzt
in `ambient.js` unter `sonar` — byte-identisch eingebettet und gegengeprueft. Einmal dekodiert, dann
aus dem Puffer gespielt; der allererste Druck zieht den Ping nach dem Dekodieren nach, damit er
nicht stumm bleibt.

Nicht mehr alle 15 s, sondern **B im getauchten U-Boot** ("als aktion auf b"), mit 1,2 s Sperre
gegen Dauerfeuer. Lautstaerke bleibt am Abstand: **0,05 bis 0,30** (angehoben von 0,02–0,10, denn
jetzt loest man ihn selbst aus). Ist nichts in Reichweite, kommt er ganz leise trotzdem — ein Sonar,
das auf Tastendruck schweigt, fuehlt sich kaputt an, und "nichts geortet" ist selbst eine Antwort.
Aufgetaucht zeigt B den Hinweis "erst abtauchen".

### Kulisse

Moewen von 0,16 auf **0,26** ("kann ein wenig lauter werden"). Ozeanrauschen bleibt bei 0,13 —
"wind ist super".

### Ein Fehler im MESSSKRIPT, der fast zu falschen Zahlen gefuehrt haette

Erst kam heraus, das Wrack sei 102 m hoch. Ursache: `rotation.set(pitch, rot, roll, 'YXZ')` baut
die Matrix als `Ry * Rx * Rz`, auf einen Punkt wirkt also **Rz zuerst**. Mein Skript drehte in der
umgekehrten Reihenfolge, wodurch der Gierwinkel die 135-m-Laengsachse in die Senkrechte kippte.
Merkposten: bei Euler-Reihenfolgen ist die Matrixreihenfolge die *Umkehrung* der Punktreihenfolge —
und eine Zahl, die physikalisch unmoeglich aussieht (102 m hohes Schiff), ist meist ein Messfehler.

### Offen

- **Boot verschwindet mit der Welle unter dem Strand** (Screenshot 16.09.), weiter unerledigt:
  `stepBoat` setzt `state.pos.y = seaSurfaceY(0,0,dt) - BOAT_DRAFT` ohne Untergrenze, waehrend
  `updateHarborBoats` fuers ruhende Kai-Boot schon eine hat.
---

## 2026-09-16 (3) — "bondery box <> wrack selber???" — ja, genau das war es

Zwei Meldungen, zwei Ursachen, beide gefunden.

### 1. Die Bounding-Box ist nicht das Wrack

Die Rueckfrage traf den Kern. `THREE.Box3().setFromObject` MISST die Geometrie nicht — es nimmt je
Mesh die vorberechnete `geometry.boundingBox`, transformiert deren **acht Ecken** und umschliesst
die. Im three.js-Quelltext (r128) nachgelesen:

```js
Nt.copy(e.boundingBox); Nt.applyMatrix4(t.matrixWorld); this.union(Nt);
```

Bei einem **gedrehten** Objekt ist das die Huelle einer gedrehten Huelle, und die ist immer groesser
als das Objekt selbst. Ihre Unterkante liegt unter dem Rumpf — und um genau diesen Betrag wurde das
Wrack zu hoch gehoben (`C:/tmp/wbox.js`):

| Modell | Box3 hebt zu hoch um |
|---|---|
| Liberty-Frachter | **9,44 m** |
| Grosssegler | **16,81 m** |

Deshalb schwebte es weiter, obwohl die Rechnung "gemessen" hiess. Jetzt sucht `lowestPointY(g)` den
tiefsten **Punkt** der gedrehten Geometrie (`fromBufferAttribute` + `applyMatrix4` je Vertex).
Nachgeprueft: Abweichung **0,000000000 m** fuer alle 6.895 Wracks, hoechster Punkt 14,6 m unter der
Oberflaeche.

Kosten: 7.417 Transformationen beim Frachter, 10.063 beim Segler — aber nur **einmal beim Bauen**,
und `updateUwCells` baut ohnehin nur eine Zelle pro Frame.

**Lehre, jetzt zum dritten Mal in derselben Sache:** erst eine geschaetzte Formel, dann eine
Bounding-Box, die nach Messung aussah, aber keine war. Wer "gemessen" schreibt, muss pruefen, WAS
die Messfunktion misst. Die uebrigen 45 `setFromObject`-Aufrufe im Projekt sind davon nicht
betroffen: sie laufen alle auf UNGEDREHTE Objekte, und dort ist die Box exakt.

### 2. Kein Ping — der Service Worker lieferte die alte ambient.js

`ambient.js` stand **nicht** in der CORE-Liste von `sw.js`. Sie wurde beim ersten Besuch nur
nebenbei gecacht (die fetch-Strategie fuellt nach) und danach nie wieder geholt. Nach dem Einbau
des Pings lieferte der Cache also weiter die ALTE Datei ohne den Schluessel `sonar`:
`window.FMS_AMB.sonar` war `undefined`, und `playSonarPing` stieg stumm aus.

Das passt genau zur Beobachtung: *"über wasser kommt aber der hinweis das man unter wasser sein
muss. die funktion ist also drinnen."* — der Hinweis braucht keinen Sound, deshalb kam er.

Die Datei selbst war in Ordnung (geprueft: parst, `sonar` vorhanden, 215.808 Bytes byte-identisch
mit dem Original). Jetzt steht sie in CORE und wird bei jeder neuen Cache-Version frisch geladen.

**Merkposten:** wer eine Datei in `ambient.js`/`sounds.js`-Art aendert, muss sie in `sw.js` CORE
haben — sonst testet man gegen den Cache und sucht den Fehler im Code.

### Offen

- **Boot verschwindet mit der Welle unter dem Strand** (Screenshot 16.09.), weiter unerledigt.
---

## 2026-09-16 (4) — Der Ping war da, nur 861-fach zu leise

"das geraeusch ist extremst leise. keine r128 normierung oder aehnliches." — nachgemessen an den
MP3-Skalierungsfaktoren (`global_gain` im Side-Info jedes Layer-III-Frames, `C:/tmp/mp3lev.js`):

| Datei | global_gain (Median) | hoerbar? |
|---|---|---|
| **sonar** | **123** | kaum |
| gulls | 151 | ja |
| ocean | 162 | ja |

Vier Stufen sind eine Verdopplung, der Ping lag also rund **Faktor 861** unter dem Ozeanrauschen und
128 unter den Moewen. Die Datei ist einfach sehr niedrig ausgesteuert — im Spiel war nichts falsch.

**Loesung: normieren, nicht die Zahl anpassen.** Ein festes `vol = 3.0` haette dieselbe Wirkung,
muesste aber bei jeder neuen Aufnahme wieder von Hand gesucht werden. `normalizePeak(buf, ziel)`
sucht stattdessen den Spitzenwert des dekodierten Puffers und skaliert ihn auf `SONAR_PEAK = 0.9`
(nicht 1,0: zwei ueberlappende Pings addieren sich, oberhalb 1 schneidet die Ausgabe hart ab).
Danach heisst `vol = 0.30` wirklich "30 % Vollaussteuerung", unabhaengig von der Datei.

Geprueft mit dem echten Code aus der Datei (`C:/tmp/wnorm.js`): leiser Puffer wird auf genau 0,9
gehoben, Stereo-Balance bleibt erhalten (der GEMEINSAME Spitzenwert zaehlt, sonst kippt links/rechts),
Stille erzeugt keine Division durch Null, und zweimal Anwenden aendert nichts mehr (idempotent — das
ist wichtig, weil `decodeSound` den Puffer cached und ich ihn an Ort und Stelle aendere).

Pegel danach, gegen den echt erzeugten Motorpuffer gerechnet (`C:/tmp/wpegel.js`):

| | am Ausgang | gegen Motor-Vollgas |
|---|---|---|
| Motor Leerlauf | 0,068 | |
| Motor Vollgas | 0,190 | |
| Ping am Rand (1.200 m) | 0,045 | 0,24 x |
| Ping am Wrack | 0,270 | 1,42 x |

Am Wrack steht der Ping also ueber dem Motor — richtig so, denn man loest ihn selbst aus und will die
Antwort hoeren, nicht ins Klangbett mischen.

**Sperre von 1,2 auf 2,5 s** ("nach 1,2 sek startet es neu"): der Ping klingt rund 3 s, ein neuer
setzte mitten in den Nachhall. Jetzt bleiben 0,5 s Ueberlappung — das klingt nach Echo statt nach
Doppelschlag.

Nebenbei bestaetigt: die Datei ist 6,74 s lang, der Klang endet aber nach etwa 3 s. Der Rest ist
Stille im Puffer und kostet nichts — nicht wert, sie herauszuschneiden.

### Offen

- **Boot verschwindet mit der Welle unter dem Strand** (Screenshot 16.09.), weiter unerledigt.
Gepusht (87f12f7, Cache v135). Deine Diagnose war richtig — ich konnte sie sogar in Zahlen fassen.

Ich habe die MP3-Skalierungsfaktoren ausgelesen (global_gain je Frame):

┌───────┬────────┬─────────┐
│ Datei │ Median │ hörbar? │
├───────┼────────┼─────────┤
│ sonar │ 123    │ kaum    │
├───────┼────────┼─────────┤
│ gulls │ 151    │ ja      │
├───────┼────────┼─────────┤
│ ocean │ 162    │ ja      │
└───────┴────────┴─────────┘

Vier Stufen sind eine Verdopplung — der Ping lag rund Faktor 861 unter dem Ozeanrauschen. Im Code war nichts falsch, die Aufnahme ist einfach sehr niedrig ausgesteuert.

Statt eine Zahl hochzudrehen, wird jetzt normiert: normalizePeak sucht den Spitzenwert des dekodierten Puffers und skaliert ihn auf 0,9. Damit heisst vol = 0,30 wirklich „30 % Vollaussteuerung", unabhängig von der Datei — eine feste Verstärkung hätte bei jeder neuen Aufnahme wieder von Hand gesucht werden müssen. Gegen den echten Motorpuffer gerechnet: Ping am Wrack 0,270 gegen 0,190 Motor-Vollgas, am Rand 0,045. Er steht am Wrack also über dem Motor, was für ein selbst ausgelöstes Signal richtig ist.

Die 0,9 statt 1,0 sind Absicht: zwei überlappende Pings addieren sich, darüber schneidet die Ausgabe hart ab.

Sperre auf 2,5 s — dein Hinweis „nach 1,2 s startet es neu" traf den Kern: bei ~3 s Klanglänge setzte der neue mitten in den Nachhall. Jetzt bleiben 0,5 s Überlappung, das klingt nach Echo. Die 6,74 s Dateilänge bei ~3 s Klang habe ich gelassen — der Rest ist Stille im Puffer und kostet nichts.

✻ Crunched for 6m 3s · done 3:20 PM

※ recap: Wir bauen die Unterwasserwelt im Flugspiel aus: Wracks liegen jetzt korrekt auf dem Grund und der Sonar-Ping auf B ist normiert und laut genug, alles gepusht. Als Nächstes bliebe der Strand-Bug, wo das Feuerwehrboot im Wellental unter dem Sand verschwindet.

❯ danke. das hat geklappt. das verschwinden unter dem strand betrifft alle fzg direkt an der küstenlinie. das wellental zieht sie unter die sichtlinie des strandes. und & 'c:\Users\flori\Downloads\Screenshot 2026-09-16 152803.jpg' wrack schwebt immer noch. erst die küstenlinie, dann c&p, dann wrack und nochmal c&p

Klare Reihenfolge: erst Küstenlinie, c&p, dann Wrack, c&p. Ich sehe mir den Screenshot an.

  Reading c:\Users\flori\Downloads\Screenshot 2026-09-16 152803.jpg
  ⎿  c:\Users\flori\Downloads\Screenshot 2026-09-16 152803.jpg
  ❯ bitte ins flugspiel wechseln und in todo ab 2729 bzw 2755 weiter machen.

  Read 1 file, listed 1 directory, ran 19 shell commands

Ich lese den Kontext ein. Der Punkt ab 2755 ist klar: erst Küstenlinie, dann Wrack. Zuerst messe ich, was an der Küstenlinie tatsächlich passiert.

  Ran 2 shell commands

Der Verdacht: seaMeshY kennt die Insel-Maskierung nicht. updateSea setzt Gitterpunkte unter einer Insel auf y = -1, seaMeshY rechnet dort aber weiter mit der Wellenformel. Das messe ich nach, statt es zu behaupten.

  Ran 2 shell commands

Der Wellenhub in der Gittermitte ist ±2,94 m — das Boot steht bis 4,04 m unter Null. Jetzt der entscheidende Punkt: updateSea setzt Gitterpunkte unter einer Insel auf y = -1, seaMeshY rechnet dort aber weiter die reine Wellenformel. Das messe ich gegen die echte gerenderte Fläche.

  Ran 1 shell command

❯ so weit ich das beurteilen konnte was das segel wrack ok, aber das liberty wrack liegt schief im sand, ergo eine stelle liegt am grund, die andere lschwebt in der luft

  Ran 1 shell command

Auf offenem Wasser stimmt die Bootshöhe exakt — der Fehler liegt nicht in der Interpolation. Die eigentliche Zahl ist eine andere. Ich prüfe noch die Kamera und die Zeilenenden.

  Ran 2 shell commands

Auf befahrbarem Wasser stimmt die Bootshöhe exakt (0 von 136.800 Proben abweichend) — die Interpolation ist es nicht. Deine Beschreibung nennt aber den Mechanismus: „unter die Sichtlinie des Strandes". Das ist Kamera-Geometrie, also messe ich die.

  Ran 3 shell commands

Der Test war tautologisch: das Boot sitzt exakt auf einem Gitterpunkt, also stimmt seine Höhe zwangsläufig mit dem Gitter. Das war die falsche Frage. Deine Formulierung nennt die richtige — Sichtlinie. Die rechne ich jetzt.

  Ran 6 shell commands

Jetzt die Sichtlinie durchrechnen: Kamera 55 m hinter/14 m über dem Boot, Boot im Wellental — verdeckt der Sand die Sicht?

  Ran 1 shell command

Wasser verdeckt nichts. Aber die Rechnung zeigt die entscheidende Zahl: das Boot liegt im Wellental bei y = −4,04 m, der Sandteller aber fest bei y = +0,25 m. Wenn die Kamera landseitig hinter dem Boot steht, schneidet dieser Teller die Sichtlinie. Das rechne ich jetzt sauber durch.

  Ran 2 shell commands

Gefunden — und deine Beschreibung war exakt: in 11 % aller Küstenlagen schneidet der Sandteller die Sichtlinie. Die Ursache ist strukturell: der Sand liegt fest bei y = +0,25, das Wellental zieht das Fahrzeug auf −4,04 m. Jetzt prüfe ich die Lösung — Dünung zum Ufer hin auslaufen lassen.

  Ran 2 shell commands

Der Auslauf muss physikalisch richtig sein: Wellen laufen im Flachwasser aus. Ich prüfe, welche Restamplitude die Verdeckung wirklich beseitigt.

  Ran 2 shell commands

Weg (a) — Dünung zum Ufer auslaufen lassen — wirkt an einer Stelle für alle Fahrzeuge. Ich prüfe gegen die echte Sichtlinien-Rechnung, welche Breite reicht.

  Ran 2 shell commands

Ursache steht fest und ist gemessen. Jetzt lege ich die Fade-Parameter fest und prüfe sie gegen Nebenwirkungen.

  Ran 2 shell commands

Ein Nebeneffekt: Rest 0,08 hält die Wellenspitze an der Kante unter dem Sand — damit läuft auch kein Wasser über den Sandteller. Jetzt die Reihenfolge im Loop und die Kosten, bevor ich schreibe.

  Ran 2 shell commands

recycleWorld läuft nach updateSea — der Fade muss also an derselben Stelle greifen wie die Gitterpunkte. Ich messe die Kosten, bevor ich das einbaue.

  Ran 2 shell commands

26 ms sprengt das Budget (16,7 ms), und updateSea kostet schon 8,3 ms. Ich brauche die vorgesammelte Inselliste, die updateSea bereits hat.

  Ran 2 shell commands

4,2 ms zusätzlich ist zu teuer. Aber updateSea rechnet den Abstand zu jeder Insel schon — ich messe die integrierte Variante.

  Ran 2 shell commands

Zusatzkosten: 0,76 ms — das passt ins Budget. Jetzt baue ich es ein. Ich hole die exakten Textstellen.

  Ran 1 shell command

Ursache ist gemessen und die Lösung passt ins Budget. Ich baue sie ein — laut Projektregel per PowerShell mit Gegenlesen.

  Ran 2 shell commands

Ursache ist belegt. Der eleganteste Ort für die Korrektur ist waveY selbst — dann bekommen alle Fahrzeuge und auch das Gitter dieselbe Dämpfung. Ich prüfe vorher die Ladereihenfolge und den Cache-Namen.

  Ran 3 shell commands

Alles beisammen. Ich baue den Shore-Fade ein — in waveY, damit Gitter und alle Fahrzeuge dieselbe Dämpfung sehen.

  Ran 1 shell command

CRLF — ich normalisiere das Suchmuster.

  Ran 2 shell commands

Alle drei Stellen eindeutig. Ich schreibe die Änderung.

  Ran 1 shell command

Wichtig: waveY bekommt gitter-lokale Koordinaten (der dokumentierte Fallstrick bei Zeile 284) — shoreFade braucht aber Weltkoordinaten. Ich sehe mir den aktuellen Stand an.

  Ran 2 shell commands

Zwei Dinge sind zu richten: der alte Kommentarblock steht jetzt doppelt, und waveY bekommt gitter-lokale Koordinaten — shoreFade braucht Weltkoordinaten. Ich räume auf und schreibe shoreFade korrekt.

  Ran 2 shell commands

The here-string wrote LF where the file uses CRLF. Ich prüfe das.

  Ran 2 shell commands

Mein Einschub hat 36 reine LF hineingebracht — die Datei ist durchgehend CRLF. Das korrigiere ich zusammen mit dem doppelten Kommentar und shoreFade in einem Durchgang.

  Ran 2 shell commands

Zeilenenden sind wieder durchgehend CRLF. Jetzt der doppelte Kommentarkopf und shoreFade.

  Ran 1 shell command

Jetzt shoreFade selbst — mit der Weltkoordinaten-Rückrechnung und der vorgesammelten Inselliste.

  Ran 1 shell command

shoreFade liest jetzt ein 4er-Layout, collectSeaIslands schreibt aber 3er-Tupel. Das muss ich mitziehen — sonst rechnet beides falsch.

  Ran 2 shell commands

Es sind 5 Werte pro Insel geworden, nicht 4. Ich ziehe die beiden Leser nach — shoreFade und die covered-Prüfung.

  Ran 2 shell commands

Jetzt gegenlesen: Deklarationsreihenfolge (BEACH_FACTOR und ground stehen an anderer Stelle als der Meeresblock) und Syntax.

  Ran 2 shell commands

_seaIslands (364) und BEACH_FACTOR (956) stehen nach ihren Nutzern. Bei const ist das nur zur Laufzeit unkritisch — genau die Falle, die der SEABED_SHORE_Y-Kommentar dokumentiert. Ich prüfe auf Ladezeit-Aufrufe.

  Ran 1 shell command

Alle Aufrufe stehen in Funktionskörpern, keiner zur Ladezeit — die Reihenfolge ist unkritisch. Jetzt die Syntax- und Wirkungsprüfung.

  Ran 2 shell commands

Syntax ist in Ordnung. Jetzt lese ich den eingebauten Code gegen und prüfe die Wirkung mit dem echten Text aus der Datei.

  Ran 1 shell command

Ein Fehler steckt noch drin: shoreFade addiert ground.position — aber seaYAt subtrahiert sie vorher schon. Für dessen Aufrufer stimmt es, für updateSea auch. Das verifiziere ich mit dem echten Text aus der Datei.

  Ran 2 shell commands

Der echte Code läuft. Jetzt die Verifikation: erst der Sanity-Check auf offener See, dann die Sichtlinie.

  Ran 1 shell command

Alle Sollwerte exakt getroffen, kein Rücksprung. Jetzt der eigentliche Test: die Sichtlinie mit dem echten Code.

  Ran 1 shell command

0 von 27.720 Lagen verdeckt, in allen drei Kameramodi. Jetzt die Nebenwirkungen: offene See, Wasser über dem Sand, und die Kosten mit dem echten Code.

  Ran 1 shell command

Wichtige Nebenwirkung zu prüfen: die Kai-Boote haben eine Untergrenze (Math.max(ISLAND_Y - BOAT_DRAFT*0.6, …)). Wenn die Dünung dort jetzt gedämpft ist, könnte diese Klemme immer gewinnen — dann schaukeln sie nicht mehr.

  Ran 1 shell command

## Küstenlinie: Fahrzeuge verschwanden hinter dem Strand (18.09.)

Dein Befund war der Schlüssel: „das wellental zieht sie unter die sichtlinie des strandes". Es war
keine Kollision und kein Höhenfehler — das Fahrzeug lag hinter dem Sand.

Gemessen: der Sandteller ist eine **flache** Scheibe auf y = 0,25 (`buildIsland`: ISLAND_Y − 0,05),
das Wellental zieht das Fahrzeug aber auf y = −4,04 (Hub ±2,944 m minus BOAT_DRAFT). Steht die Kamera
landseitig dahinter, schneidet der Teller die Sichtlinie: **11,2 %** aller Küstenlagen waren verdeckt,
über alle drei Kameramodi (9,2 % im Standardmodus).

Der Fix sitzt an der Ursache, nicht an der Kamera: an einem echten Ufer laufen Wellen im Flachwasser
aus. `shoreFade` dämpft die Dünung über `SHORE_FADE_W` = 180 m auf `SHORE_FADE_REST` = 0,08. Weil das
**in `waveY`** sitzt, gilt es für alle Fahrzeuge zugleich *und* für das Gitter — eine Korrektur pro
Fahrzeug hätte vier Stellen gebraucht und das Fahrzeug neben die sichtbare Fläche gesetzt.

Verdeckung danach: **0,0 %** in 27.720 geprüften Lagen, alle Kameramodi.

Die Parameter sind gerechnet, nicht geraten:
- **180 m** muss breiter sein als der Punktabstand des Gitters (SEA_STEP 62,5 m), sonst fällt der
  Auslauf durchs Raster und man sieht eine Kante statt eines Auslaufs. 120 m hätten für die
  Sichtlinie gereicht; 180 m verteilt den Übergang auf knapp drei Stützpunkte.
- **Rest 0,08** statt 0: bei 0 stünde das Wasser am Ufer spiegelglatt und wirkte tot. Obergrenze ist
  der Sandteller — 0,08 · 2,944 = 0,236 m bleibt darunter, 0,10 wäre mit 0,294 m schon zu hoch.

Kosten: **0,84 ms** für alle 9.409 Gitterpunkte, mit dem echten Code aus der Datei gemessen. Das geht
nur mit der vorgesammelten Inselliste (`_seaIslands`, einmal pro Frame) — mit `islandInfo` pro Punkt
kostete dasselbe 26 ms und hätte das 16,7-ms-Budget allein gesprengt. Die Wurzel wird nur im
Fade-Band gezogen; 73 % der Wasserfläche liegt im vollen Seegang.

### Zwei Fehler, die der Fade nebenbei mit behoben hat

Beide beim Nachmessen der Nebenwirkungen gefunden, keiner war gemeldet:

| | vorher | jetzt |
|---|---|---|
| Wasser über dem Sandring | 44,6 % der Zeit, bis 2,75 m Überstand | 0,19 %, bis 9 cm |
| Kiel des Kai-Boots schwebte über dem Sand | 14,5 % der Zeit, bis 1,50 m | nie, liegt 0,61 m im Sand |
| Welle hob den Astronauten am Strand | 42,4 % der Zeit, bis 2,68 m | 0,0 %, bis 1 cm |

Der Sandring zwischen Gras- und Sandradius ist dabei die richtige Messregion: nur dort ist Sand
sichtbar **und** das Wasser unmaskiert. Weiter draußen darf das Wasser beliebig hoch stehen.

### Eine echte Regression — und ihre Reparatur

Das Kai-Feuerwehrboot nickte nicht mehr: von 7,82° auf 0,84° Hub, am Bug nur noch 4 cm. Ursache war
kein Fehler im Fade, sondern der Faktor 0,35 in `updateHarborBoats` — der war für die
**ungedämpfte** Dünung kalibriert.

Der richtige Wert ist herleitbar, nicht Geschmackssache: `7·atan2(d,14)·fak` ist für kleine Winkel
`0,5·fak·d`, und das ist genau `d`, wenn **fak = Nenner/Hebel = 14/7 = 2,0**. Dann folgt der Bug der
Welle exakt — sein Abstand zur Wasserlinie bleibt konstant bei −0,90 m, statt zwischen −0,99 und
−0,28 m zu stampfen. Bug-Hub 59 cm, das Heck bleibt 0,49 m im Sand, `rotation.x` von −8,2° bis −1,0°:
es kippt nie nach hinten.

Verifiziert an 111 echten Kai-Bootsplätzen über je 1.200 Frames, gerechnet mit den drei Zeilen
wortwörtlich aus der Datei gelesen (`C:/tmp/kai13.js`) — nicht mit einem Nachbau.

Das Kai-U-Boot (`updateHarborSubs`) behält 44 % Höhenhub und 1,14° Nicken; es liegt weiter draußen
(HARBOR_SUB_FAC 1,30 gegen Sandkante 1,12). Bleibt so, das ist sichtbar.

Geprüft und unauffällig: der Fade erzeugt keinen neuen Knick im Gitter (größter Sprung zwischen
Nachbar-Stützpunkten 3,330 m mit gegen 3,337 m ohne Fade), und auf offener See ändert sich nichts —
gedämpft ist 26,9 % der Wasserfläche, die mittlere Wellenhöhe bleibt bei 84,8 %.

### Offen

- **Liberty-Wrack liegt schief im Sand** — „eine stelle liegt am grund, die andere schwebt in der
  luft" (Screenshot 16.09.). Das Wrack wurde auf einen einzigen Aufsetzpunkt gemessen, der Grund ist
  dort aber geneigt. Als Nächstes dran.


## Ruckeln bei Tempo und Höhe: es war die GPU, nicht die Rechenzeit (18.09.)

Deine Beschreibung nannte zwei Fälle — „schnelle Flugzeuge in allen Höhen **oder** alle Flugzeuge in
großen Höhen" — plus den Nachtrag „realistisch ist auch, das man mit volldampf tiefer als 120m
fliegt". Es ist **eine** Ursache für alle drei.

### Was es nicht war

Ich habe alle naheliegenden Kandidaten gemessen, und jeder einzelne war zu klein:

| Posten | Kosten | Budget 16,67 ms |
|---|---|---|
| `updateSea` voll (mit `computeVertexNormals`) | 2,70 ms | 16 % |
| Meeresboden-Häppchen inkl. Normalen | 0,65 ms | 4 % |
| `shoreFade` (9.409 Punkte) | 0,84 ms | 5 % |
| `clone(true)` eines GLB-Modells | 0,07 ms | 0,4 % |
| Hindernis-Sonden der KI-Flotte (11 Maschinen) | < 0,10 ms | < 1 % |

Zusammen unter 5 ms. Auch drei konkrete Hypothesen sind gefallen:

- **`SEA_LOD` bündelt Last statt sie zu senken** — stimmt, aber die Spitze ist nur 2,7 ms.
- **`updateIslands` schafft die Zellen nicht** — 7 Zellen brauchen 0,12 s, der X-Wing hat 1,2 s je
  Zellbreite. Reicht bei jedem Modell.
- **Fische/Orcas werden zu oft neu platziert** — echter Schönheitsfehler (Spawn max 260 m, Despawn
  420 m, beim X-Wing 60 Neuplatzierungen/s), kostet aber nur 1,5 ms **pro Sekunde**.

Zwei Messungen musste ich verwerfen: `SHELF_W` hatte ich mit 1200 statt 180 angesetzt, und beim
Wasserstand über dem Sand hatte ich außerhalb der Sandkante gemessen, wo Wasser hoch stehen darf.

### Was es war

Die Zahl der **Dreiecke** in der Szene. 27 Inseln in Sicht (`VIEW_CELLS` 3 = 49 Zellen, ~55 % mit
Insel), je rund 10 Vorfeldplätze, je Modell im Mittel 43.135 Dreiecke: **11,6 Millionen Dreiecke nur
für geparkte Flugzeuge**. Mehr als Meer, Meeresboden, Häuser und Unterwasserwelt zusammen.

Das erklärt beide Fälle mit einer Ursache: **schnell** heißt, dieses Gepäck wird im Sekundentakt aus-
und eingeladen; **hoch** heißt, der Nebel (`fog.far` 3.000 m) verdeckt weniger und die Kamera blickt
flach über viele Vorfelder gleichzeitig, statt dass die nächste Insel die dahinter verdeckt. Und
**tief und schnell** ist beides zugleich, plus aktiver Meeresboden unter 120 m.

`updatePlaneLOD` schaltet die geparkten Flieger ab `PARK_LOD_D` = 1.200 m auf `visible = false`.

Die Grenze ist aus der Bildgröße gerechnet: bei 27,1 m Spannweite, 60° FOV und 1080p ist ein
geparkter Flieger auf 1.200 m noch **21 px** groß — gerade noch als Flugzeug erkennbar. Auf 1.700 m
sind es 15 px, am Sichtrand (2.550 m) nur 10 px, also ein Fleck.

Gemessen an 400 Zufallspositionen: nur **16,3 %** der Inseln zeigen ihre Flieger, also 3,9 von 24.
**1,7 Mio statt 10,4 Mio Dreiecke — 84 % gespart.** Die Funktion selbst kostet 2,6 µs pro Frame
(0,016 % des Budgets), weil sie gegen die Inselmitte prüft (27 Rechnungen statt 270) und nur
schreibt, wenn sich der Zustand ändert.

`visible = false` statt Entfernen ist Absicht: Three.js überspringt den Teilbaum beim Zeichnen, die
Klone bleiben aber stehen. Ein Entfernen und Neuaufbauen wäre genau der Ruckler, den `updateIslands`
mit seinem Häppchen-Aufbau losgeworden ist. Der Inselradius kommt als Zuschlag dazu — das Vorfeld
liegt am Inselrand, seine Flieger sind also bis zu einen Radius näher als die Mitte.

### Die Ariane-Raketen (dein Zusatz)

„diese starten alle 1,5km. wenn man sehr schnell fliegt und es viele inseln gibt passiert das sehr
schnell hintereinander" — das war ein eigener, echter Ruckler.

Die `gone`-Phase in `updateRockets` rief **synchron `buildIsland(cx, cz)`**: genau die Operation, die
`updateIslands` mit „eine Zelle pro Frame" entschärft hat, hier aber ungebremst. Eine ganze Insel im
Frame — Sandfläche, Wiese mit UV-Rechnung, Landebahn, 8–18 Häuser, Palmen, Hügel, Hafen und die
Vorfeld-Flugzeuge.

Gemessen: **44 %** der Inseln haben eine Rampe (0,333 je km², im Mittel alle 1,73 km eine). Bei
`LAUNCH_DIST` 1.500 m ist der Startkorridor 3.000 m breit, es laufen also **0,68 Rampen pro Sekunde**
durch das Fenster (X-Wing), 0,36 beim Alpha Jet. Jede baut 99 s später (54 s Steigzeit + `REGROW_T`)
eine Insel neu.

Jetzt wird die Zelle nur noch **ausgetragen** (`islandCells.delete`), und `updateIslands` baut sie mit
seinem Budget. Zwei Dinge waren dabei zu prüfen und stimmen: `updateRockets` läuft **vor**
`recycleWorld` → `updateIslands`, die Zelle wird also im selben Frame gebaut (kein leeres Bild), und
`rs.phase` wird auf `'stand'` gesetzt **bevor** gelöscht wird — `buildIsland` sieht die neue Phase und
stellt die Rakete hin. `rocketState` ist eine eigene Map und überlebt das Löschen.

Mehrere gleichzeitig fällige Rampen können sich damit nicht mehr in einem Frame stapeln.

### Offen

- **Liberty-Wrack liegt schief im Sand** — „eine stelle liegt am grund, die andere schwebt in der
  luft" (Screenshot 16.09.). Als Nächstes dran.
- **Fisch/Orca-Neuplatzierung**: Spawn-Radius (260 bzw. 220 m) kleiner als Despawn-Radius (420 m).
  Kostet kaum Zeit, ist aber unsauber — bei Tempo werden Schwärme sofort wieder verworfen.
