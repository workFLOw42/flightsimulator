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
    startet bei Annäherung unter 500 m, steigt beschleunigt (9 m/s², Deckel 900 m/s) und ist ab der
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

## Offen: Wunschliste aus der siebten Runde

Alles noch nicht angefangen, in der Reihenfolge, in der es genannt wurde:

**1. Ein- und Aussteigen, Fahrzeuge wechseln.** Auf jeder Nicht-Stadt-Insel steht ein X-Wing. Im
gelandeten normalen Flugzeug öffnet **B** die Kanzel: man läuft als Astronaut heraus, geht zum X-Wing
und steigt dort mit **B** ein — oder wieder ins Flugzeug zurück. Auf **Mond** wechselt man zwischen
**Lunar Rover** und X-Wing, auf **Mars** zwischen **Mars-Rover** und X-Wing. Das Fahrzeug **spawnt
immer 30 m rechts neben dem gelandeten X-Wing**.
  - Damit fällt der **Follow-Modus des Rovers** weg: man läuft entweder selbst oder fährt.
  - Damit fällt auch der **orange Kegel** weg, weil es egal ist, wo man landet.
  - **Beide Rover fahren maximal 100 km/h.**
  - **Radar zu Fuß:** X-Wing weiß, Mars-Rover orange, Lunar Rover blau. **Im Rover:** nur der X-Wing.
    Auf der Erde braucht es das nicht — dort steht auf jeder Insel einer, und auf dem Träger am Rand
    (außerhalb der Landebahn).

**2. Neuer Flughafen auf den Inseln.** `airport_by_nermin.glb` als Modell: dort parken alle Flugzeuge
mit genug Abstand, damit klar ist, in welches man einsteigt. Wer einsteigt, **respawnt auf der
Landebahn**.

**3. Jetpack im Weltall.** Da man im Weltall-Hangar schon aussteigen kann: auch **ins Weltall
hinauslaufen** und dort per Jetpack schweben — **Steuerung wie beim X-Wing**.

**4. Weitere Modelle liegen bereit** (noch nicht eingebaut):
  - `submarine_by_Helindu.glb` — U-Boot
  - `killer_whale_by_Trouvaille.glb` — Killerwal
  - `mondfahrzeug_lunar_rover_by_Deutsches Museum  Digital.glb` — Lunar Rover (für Punkt 1)
