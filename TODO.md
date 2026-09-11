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

## Noch offen: der Mars-Rover

Gemeldet: er lässt sich nicht steuern, und die Kamera geht unter ihn. Die Ursache ist **gemessen und
belegt**, aber noch nicht behoben:

`stepGroundExact` nimmt auf dem Mars `roverObj` als zusätzliche Bodengeometrie in den Raycast — das
**Fahrzeug selbst**. Der Rover raycastet also gegen sein eigenes Dach und klettert darauf. Gemessen an
einer Stelle, deren echter Grund bei −71,84 m liegt: mit sichtbarem Rover liefert `groundHitY`
**+2,82 m**, ohne ihn **−71,84 m**.

Auf dem Mond geht das gut, weil `extra` dort `moonBaseObj` ist — ein **Gebäude**, auf dessen Plattform
man wirklich stehen soll. Der Lunar Rover bleibt außen vor. Der Mars-Zweig ist eine **Altlast** aus der
Zeit, als der Perseverance nur Kulisse war und man nicht einsteigen konnte.

## Salt-Bereiche (unverändert)

Der nächste freie Salt ist weiterhin **906**.
