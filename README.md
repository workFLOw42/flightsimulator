# Flugspiel 🛩️

Ein kindgerechtes 3D-Flugspiel zum freien Fliegen, Löschen, Retten und Abwerfen — läuft komplett
**im Browser**, auf Desktop und Android. Gedacht für kleine Kinder — daher
**keine Lesetexte im Spiel, nur Symbole und Farben**.

Offene Punkte stehen in **[TODO.md](TODO.md)**.

## ▶️ Spielen
**[→ Jetzt spielen](https://workflow42.github.io/flightsimulator/Flugspiel.html)**
(`https://workflow42.github.io/flightsimulator/Flugspiel.html`)

- Läuft in **Chrome / Edge** am besten (Firefox/Safari eingeschränkt bei Controller/Vibration).
- Am Handy: **Bluetooth-Controller** koppeln (z.B. 8BitDo), dann im Chrome-Menü
  „Zum Startbildschirm hinzufügen“ → startet im Vollbild wie eine App.
- **Ton** ist standardmäßig aus (D-Pad ↓ bzw. Taste **N** schaltet ihn an).

## 🕹️ Steuerung

| Aktion | Controller (X-Input) | Tastatur |
|---|---|---|
| Lenken | linker Stick ←→ | ← / → |
| Nase hoch/runter | linker Stick ↕ | ↑ / ↓ |
| Rollen (loslassen = richtet sich auf) | LT / RT | Q / E |
| Schub 0–100 % | rechter Stick ↕ | W / S |
| **Umsehen** (nur zu Fuß) | rechter Stick ↕←→ | I / J / K / L |
| Vollgas | — | Leertaste |
| **Boost** (halten): 100 % + extra Schub | X | Shift |
| **Bremse / Umkehrschub** (halten) | A | C |
| Aktion (modellabhängig, s.u.) · im Weltall **Laser** | B | B |
| **Aussteigen** (nach der Landung) · draußen: **hüpfen** / einsteigen | B | B |
| Im **Schlauchboot** fahren: lenken · Schub | L-Stick ←→ · R-Stick ↕ | ← → · W / S |
| Modell wechseln | Y | M |
| Kamera wechseln | — | V |
| Ansicht von links/rechts (halten) | LB / RB | — |
| Hilfe/Anleitung ein/aus (pausiert das Spiel) | D-Pad ↑ | H |
| Ton an/aus | D-Pad ↓ | N |
| Reset | Start | R |

Oben rechts: **Radar** und darunter ein **Gyroskop / künstlicher Horizont** — sein Ring wird
**grün**, wenn die Fluglage für eine sanfte Landung passt. In der Inselwelt zeigt das Radar die
**nächstgelegene brennende Stelle** (bewusst nur eine, sonst wird die Scheibe zu voll), im Weltall
die anfliegbaren Ziele: **Mond, Mars, Erde, ISS und Todesstern**, jedes in eigener Farbe.

Im Weltall ist die Radar-Skala **logarithmisch**, denn dort liegen 2 km (ISS) und 900 km (Sonne)
nebeneinander: linear gerechnet klebten ISS und Erde beide unter dem eigenen Flieger-Symbol in der
Mitte. So bekommt jede Größenordnung denselben Platz und man kann die Ziele auseinanderhalten.

### Selbst-Aufrichten der Querlage
Lässt man **LT/RT** (bzw. **Q/E**) los, dreht sich die Schräglage von allein wieder auf null — der
Flieger legt sich also waagerecht, ohne dass man gegensteuern muss. Betroffen ist **nur die
Querlage**: die Nase bleibt, wo der linke Stick sie hingestellt hat, Steigen und Sinken sind
unverändert steuerbar.

Damit **Kunstflug** möglich bleibt, wirkt die Hilfe nur bis **60° Querlage**. Wer weiter rollt
(Richtung Rückenflug), bleibt dort liegen und kann die Rolle sauber durchziehen; kleine Schräglagen
räumt der Flieger von selbst auf.

**Im Weltall gilt sie ebenso — und dort ist sie sogar wichtiger.** Die Querlage erzeugt nämlich eine
Kurve (wie bei einem echten Flugzeug), also driftete ein schräg stehender X-Wing dauernd vom Kurs ab
und flog am angepeilten Planeten vorbei. Jetzt stellt er sich beim Loslassen wieder gerade, und der
Kurs hält. Weil die Kamera im All mitrollt, dreht sich dabei die Sternenkulisse sichtbar mit zurück.

### Kein Aufgaben- und kein Verkehrsschalter mehr
Die früheren **Aufgaben** (RB / T) sind **ausgebaut**: vorgegebene Zielringe und die Erfolgsmeldung
danach haben sich als unpraktisch erwiesen. **Alle Fähigkeiten bleiben** — es brechen Brände aus,
die man löschen kann, der Airbus transportiert Leute von A nach B, die Transall wirft Fracht ab.
Man sucht sich das Wohin nur selbst aus. Der **Flugverkehr läuft immer** (kein LB / J mehr), und
das HUD zeigt entsprechend keine Schaltersymbole.

## ✈️ Flugzeuge, Boot & was man mit ihnen macht
Jedes Modell startet an einem passenden Ort (Hafen, Landebahn, Stadt oder Flugzeugträger) — der
**X-Wing im Hangar des Todessterns**. **Das Spiel startet mit ihm**; mit **Y** bzw. **M** schaltet man
durch die Modelle, und jedes andere Modell beginnt wieder in der Inselwelt:

- **Canadair CL-215** (Löschflugboot) — 🔥 **Waldbrand löschen**: tief übers Wasser fliegen füllt den
  Tank, über dem Feuer **B** = Wasser ablassen.
- **Dornier Alpha-Jet** — Kunstflug-Jet (Looping/Rolle), **Überschall** bei Vollgas. **B = Schleudersitz**.
  Startet/landet auf Landebahn oder Flugzeugträger.
- **Airbus A380** — 🧍 **Menschen transportieren**: auf einer Landebahn stehen bleiben, Leute steigen
  um — bei **jeder** Landung, auf **jeder** Bahn. Man fliegt sie also weiter von A nach B und sucht
  sich B selbst aus. Startet in einer Wolkenkratzer-Stadt.
- **Transall C-160** — 📦 **Fracht abwerfen**: auf der Bahn 4 Kisten laden, dann mit **B** am
  Fallschirm abwerfen — wo man mag, ein vorgegebenes Ziel gibt es nicht mehr.
- **P-51 Mustang** — flotter Warbild (Kunstflug), **B = Schleudersitz**. Startet auf einem Flugzeugträger.
- **Feuerwehrboot** 🚤 — **fährt** auf dem Meer statt zu fliegen und ist das siebte Fahrzeug in der
  **Y/M**-Reihe. Es startet **vor dem Hafen** einer Insel im offenen Wasser (weiter draußen als die
  Canadair, weil die Hafenmole für ein Boot eine Wand ist und es dort sonst nicht wegkäme).
  Es liegt mit **1,5 m Tiefgang im Wasser** (nicht darauf — sonst sähe man die Schrauben) und nickt
  mit der Dünung; gelenkt wird mit dem linken Stick, der Schub arbeitet wie bei den Fliegern als
  Zielgeschwindigkeit (rund 86 km/h bei Vollgas), und **A/C** fährt rückwärts. Weil eine laufende
  Schraube auch im Stand Wasser aufs Ruder drückt, dreht es sich selbst dann, wenn es steht.
  **Land und Strand sind eine Wand**: es rammt nicht und sinkt nicht, es kommt einfach nicht weiter.
  An einer Küste **gleitet es entlang** — auch dann, wenn man genau senkrecht darauf zufährt: es
  sucht sich selbst die freie Richtung und dreht die Fahrt dorthin, statt anzuhalten.
  **B = Wasserstrahl** nach vorn (2,5 s), der alles Brennende um den Zielpunkt des Strahls löscht:
  einen **Waldbrand am Ufer** genauso wie die **brennenden Wracks** abgestürzter KI-Flieger und die
  Brände der KI-Canadairs. Zusammen reicht das rund **160 m** weit — nach **hinten** löscht es nicht.
  Es klingt nach **Motorboot**: ein tiefes Bollern, das synthetisch erzeugt wird (die sechs Sounds im
  Spiel sind alle Flugzeugmotoren, und ein Bootssample hätte die Datei vergrößert). Rückwärts klingt
  es genauso — die Schraube dreht ja nur andersherum.
  Einen **Tank braucht es nicht**: das Boot schöpft aus dem Meer, unter dem es fährt. Höhenanzeige,
  Gyro und Flugschatten sind beim Boot ausgeblendet, weil sie dort nichts zu sagen haben, und die
  Kamera sitzt weiter hinten und höher (55 m / 14 m) als bei den Fliegern — aus der Flieger-Ansicht
  sah man vom Boot fast nur den Aufbau.
- **X-Wing** 🚀 — **Senkrechtstarter** und mit Abstand der schnellste: **Schallmauer schon bei 50 %**
  Schub, **Mach 2 bei Vollgas** (2470 km/h). Unter 30 % steuert der Schub nicht die Fahrt, sondern die
  Senkrechte:
  - **20 % = abheben und schweben** — er steigt auf 20 m über Grund (Landebahn, Wiese, Trägerdeck,
    Wasser oder Mondkrater) und **bleibt dort stehen**. Ist er schon höher, hält er einfach seine Höhe.
  - **ab 30 % = waagerechter Vorwärtsflug** — die Höhe bleibt, er beschleunigt geradeaus. Steigen und
    Sinken kommen dann aus der Nase, wie beim Alpha-Jet.
  - **10 % = Senkrechtlandung** mit 10 m/s, setzt immer sauber auf. **0 % = Antrieb aus** — dann fällt er.

  Er darf **überall landen**. Solange der Antrieb läuft, trägt ihn sein Repulsorlift: er sackt nie
  durch und hat keinen Strömungsabriss.

**Abstürze über dem Meer**: Fährt man das Feuerwehrboot, fällt regelmäßig einem KI-**Jet** über
offenem Wasser das Triebwerk aus — etwa alle 20 Sekunden einer, und zwar **rund zehn Sekunden
Fahrzeit voraus**, damit man ihn herunterkommen sieht. Liegt dort eine Insel, weicht der Ort seitlich
aus, bleibt aber im Blickfeld. Der Pilot kommt am Fallschirm herunter, das **Wrack brennt auf dem
Wasser** — und bleibt dort liegen, bis man es selbst gelöscht hat (die KI-Feuerwehr hält sich dann
zurück, sonst wäre der Brand aus, bevor man da ist). Das Radar zeigt, wo. Ohne Boot passiert das
nicht: dann stürzt nur ab, wer wie bisher gegen einen Berg oder ein Haus fliegt.

Das war nötig, weil Abstürze sonst **ausschließlich an Land** passieren — die Auslöser sind Berge und
Häuser — und ein Wrack dort bis zu 199 m vom Ufer liegt, also außerhalb der Reichweite eines Boots.
Es gab für das Feuerwehrboot also nie eine Absturzstelle zu löschen, nur Waldbrände.

**Brände** brechen aus, solange man ein **Löschfahrzeug** steuert — die **Canadair** oder das
**Feuerwehrboot**. Für das Boot brennt es dabei **nahe am Ufer** (auf 80–93 % des Inselradius),
weil sein Strahl nicht weit reicht und es nicht an Land kann; für die Canadair bleibt die ganze
Wiese offen (35–75 %). Das **Radar** zeigt die nächste brennende Stelle. Auch die **KI-Canadairs**
legen eigene Brände, und die kann man mit beiden Löschfahrzeugen selbst ausmachen.

**Am Fallschirm** hängt beim Schleudersitz ein **Astronaut** — dasselbe Modell, mit dem man auch
aussteigen kann, unter einem echten Fallschirm. Das gilt für den Spieler **und** für die
KI-Flieger; vorher waren das ein Zylinder mit Kugelkopf und eine Halbkugel. Denselben Schirm tragen
jetzt auch die **Transall-Kisten**, damit alles zusammenpasst. Kommt ein Springer **aufs Meer**
herunter, wird er auf einem **Schlauchboot** gerettet und der Schirm verschwindet — siehe
[Ins Wasser](#-ins-wasser-das-schlauchboot).

**Absturz**: Wer zu langsam wird (Strömungsabriss), gegen Berg/Haus/Hafen/Trägerwand fliegt oder falsch
aufsetzt, stürzt ab — dann rückt die **Feuerwehr** an (Löschauto an Land, Boot auf dem Wasser).
Im Strömungsabriss kippt die Nase nach unten und der Flieger **fällt wirklich** (aus 300 m ist er in
7–10 s unten): kein Auftrieb, keine Ruderwirksamkeit, und der Leerlauf bremst den Sturz nicht ab.
Herauskommen geht nur mit Fahrt — Nase runter und Schub geben.

## 🧑‍🚀 Aussteigen und herumlaufen

Wer **gelandet** ist, steigt mit **B** aus und läuft als Astronaut umher. Das geht auf **Insel,
Landebahn, Wolkenkratzer-Stadt, Trägerdeck, Mond und Mars** — überall dort, wo fester Boden ist.
**Aussteigen** geht **nicht** in der Luft, nicht über Wasser und nicht mit dem Feuerwehrboot. Ins
Wasser kann man aber zu Fuß hinein — dort steht man dann im **Schlauchboot** (siehe unten).

- Der **linke Stick** (bzw. die Pfeiltasten) steuert wie ein Fahrzeug: ←→ dreht, ↕ läuft vor und
  zurück. „Vorwärts" ist also immer die Blickrichtung — für Kinder einfacher als eine Steuerung, die
  sich nach der Kamera richtet.
- **B hüpft**, und zwar mit derselben Absprungkraft überall — nur die **Anziehungskraft** ist
  verschieden. Auf der Erde kommt man gut **1 m** hoch, auf dem **Mars 2,8 m** und auf dem **Mond
  6,5 m**: genau das Sechsfache, weil der Mond ein Sechstel der Erdanziehung hat. Das ist der Reiz
  daran, deshalb wird es bewusst nicht ausgeglichen.
- **Über den Strand** darf man laufen, bis ins Wasser hinein. Vorher endete der feste Grund an der
  Grasfläche, während der **Sandrand 12 % weiter** reicht — man blieb also **31 m vor der Wasserlinie**
  mitten auf dem sichtbaren Strand stehen (gemessen). Für **Flugzeuge** ist der Strand weiterhin Wasser:
  daran hängt, wo gelandet werden darf.
- Häuser und Berge sind fest; an einer Kante läuft man entlang.
- Das **Flugzeug bleibt stehen**, wo man gelandet ist, mit abgeschaltetem Motor. Kommt man ihm
  wieder näher als **8 m**, wird **B zum Einsteigen** — das HUD zeigt mit ✈️ bzw. ⤒ an, was B gerade
  tut. Der Radius ist bewusst kleiner als die Spannweite eines X-Wing (11 m), damit man direkt neben
  dem Flieger noch hüpfen kann.
  Weiter als 4 km kommt man nicht weg, sonst verlässt man die geladene Welt.
- Die Kamera folgt von **hinten**, leicht von oben. **LB/RB** gehalten zeigt von der Seite — dieselben
  Tasten wie im Flugzeug.
- Mit dem **rechten Stick** kann man sich **umsehen**: ←→ schwenkt den Blick nach links und rechts,
  ↕ hebt ihn **in den Himmel** (bis 52° hinauf) oder senkt ihn **auf den Boden** vor sich (25°
  hinunter). Der Stick ist zu Fuß komplett frei — im Fahrzeug steuert er den Schub, aber draußen ist
  der Motor aus. Entscheidend ist, dass das **Blickziel** mitwandert und nicht nur die Kamera um den
  Astronauten kreist: sonst schaut man immer nur auf ihn, und „nach oben schauen" gibt es nicht.
- Das **HUD oben links** zeigt zu Fuß **Höhe**, **Lauftempo** (rund 22 km/h) und die **Sprungweite**
  in Metern statt Schub — der Motor ist draußen ja aus. Die Weite bleibt nach der Landung stehen,
  damit man sie ablesen kann: auf der Erde etwa 6 m, auf dem Mars 14 m, auf dem **Mond 40 m** — und
  vom **Dach der Mondbasis** noch deutlich weiter.
  **Lässt man ihn los, gleitet die Kamera von allein wieder hinter den Astronauten**, damit man die
  Orientierung nicht verliert. Gelaufen wird weiter mit dem linken Stick: Blick und Laufrichtung sind
  unabhängig, das Umsehen dreht die Figur also nicht. Auf der Tastatur liegt es auf **I J K L**.
- Das **Radar** zeigt draußen genau eine Sache: **wo dein Flugzeug steht**. Der Maßstab ist dabei ein
  anderer als im Flug (500 m statt 2500 m füllen die Scheibe), denn zu Fuß sind ein paar Hundert Meter
  weit. Brände zeigt es nicht — löschen kann man zu Fuß ohnehin nicht.
- Auf dem **Mars** fährt der **Perseverance-Rover** beim Aussteigen **schräg vor dir** mit und bleibt
  dabei, während du läufst — genau seitlich stand er fast außerhalb des Bildes. Seine Leuchtsäule ist
  dann aus: es gibt nichts zu suchen. Seine Bodenhöhe wird über ein kleines Kreuz gemessen, nicht an
  einem einzelnen Punkt: das Mars-Höhenraster hat nur alle 59 m einen Stützpunkt, und dazwischen sank
  ein 10 m langes Fahrzeug sonst in den Hang ein.
- Der **Astronaut hat die Arme angelegt**. Das Originalmodell schwebt mit ausgestreckten Armen; die
  Pose wurde umgerechnet, damit er wie ein Fußgänger aussieht (Spannweite von 262 auf 76 Einheiten,
  bei unveränderter Höhe und Tiefe).
- Während man draußen ist, richtet sich die **Welt am Astronauten aus**, nicht am abgestellten
  Flugzeug: Boden-Kacheln, Bodenhöhe, Meer und Inseln werden um ihn herum nachgezogen. Ohne das
  passierte alles am Standort des Fliegers — die Kachel unter den Füßen fehlte, und die Bodenhöhe
  galt für eine Stelle Hunderte Meter entfernt. Auf dem **Mars** fiel das am stärksten auf, weil sein
  Höhenraster mit 59 m Stützpunktabstand doppelt so grob ist wie das des Mondes (24 m) — die
  Mars-Kachel ist bei gleicher Rasterzahl 2,5-mal so groß.
- Auf der **Mondbasis** zählt beim Laufen die Höhe **ihrer Fläche**, nicht der Kraterboden darunter.
  Die Basis wird über das Relief angehoben (bis über 20 m), sonst steckte sie im Hang — wer das nicht
  mitrechnet, sackt genau um diese Anhebung durch.

## 🛳️ Schiffe auf dem Meer

Auf dem offenen Meer fahren vier echte Schiffe ihre Bahnen — **langsam und gemächlich**, wie es sich
für Handelsschiffe gehört. Sie sind **keine Kulisse**, sondern feste Hindernisse: wer hineinfliegt,
stürzt ab, genau wie an einem Berg oder am Trägerrumpf. Darüber weg geht.

| Schiff | Länge | Tempo | Modell von |
|---|---|---|---|
| 🚢 Containerschiff | 300 m (Panamax) | 18 km/h | **RM02** |
| 🛳️ Kreuzfahrtschiff | 250 m | 20 km/h | **farhad.Guli** |
| 🚢 Liberty-Frachter | 135 m | 16 km/h | **AlanTinka** |
| ⛵ Großsegler | 90 m Rumpf, 60 m Masthöhe | 11 km/h | **Liaval** |

### Und die Flugzeugträger?
Nach dem Einbau der Schiffe wirkte es, als gäbe es **weniger Träger**. Nachgemessen: es waren
genauso viele wie vorher. Der Würfel im Code steht auf 10 %, gilt aber nur für **Wasserzellen** — und
53 % aller Zellen sind Inseln. Effektiv kamen so nur **3,8 %** aller Zellen auf einen Träger (24 in
625 Zellen gemessen). Die Schiffe teilen also nur die Aufmerksamkeit und verdecken Träger im
Blickfeld; die Häufigkeit war unverändert.

Trotzdem angehoben, weil man ihnen öfter begegnen soll: Schwelle 0,10 → **0,18**, damit **41 statt
24** Träger in denselben 625 Zellen (6,6 % statt 3,8 %).

Die Größen stimmen **zueinander** und zu den echten Vorbildern; der Flugzeugträger im Spiel ist
280 m lang, alles liegt also in derselben Größenordnung. Sieben Schiffe fahren gleichzeitig in einem
Ring von 1,2 bis 3,5 km um den Spieler und werden nachgezogen, wenn man weiterfliegt — genau wie der
Flugverkehr in der Luft.

- **Die Hülle ist ein Rechteck, kein Kreis.** Bei einem 300-m-Schiff wäre ein Kreis eine 300 m breite
  Sperrzone, durch die man nicht mehr seitlich vorbeifliegen könnte. Gerechnet wird deshalb im
  Koordinatensystem des Schiffs: 46 m quer daneben ist frei, 46 m in Längsrichtung ist noch Rumpf.
- **Sie meiden Land selbst.** Geprüft wird eine halbe Schiffslänge **vor dem Bug**, sonst schiebt sich
  ein 300-m-Schiff mit der Nase in den Strand, bevor sein Mittelpunkt Land erreicht. Kommt Land, dreht
  es über mehrere Sekunden sichtbar ab — ein Frachter wendet nicht ruckartig.
  Über drei Minuten Spielzeit gemessen: **0-mal** auf Land, **0-mal** ineinander, geringster Abstand
  zwischen zwei Schiffen 355 m.
- **Auch die KI-Maschinen sehen die Schiffe** — und den Flugzeugträger. Das fehlte zunächst: ihre
  Hindernisliste kannte nur Inseln, weil alles auf dem Meer nicht im Zellenraster steht. Sie flogen
  durch die Handelsschiffe *und* durch den Träger hindurch. Jetzt gilt für sie dasselbe wie an Land:
  Airliner ziehen hoch und weichen aus, Jets stürzen ab.
- **Auch das Feuerwehrboot und das Schlauchboot** kommen nicht durch ein Schiff hindurch — für sie
  gilt derselbe Rumpf wie für die Flugzeuge (25 s Vollgas frontal dagegen: 0 Bilder im Rumpf).
- **Ein Schiff verdrängt, es blockiert nicht nur.** Das musste nachgebessert werden: die Schiffe
  FAHREN, ein Rumpf kann sich also über ein stillliegendes Boot schieben. Die normale
  Küsten-Ausweichlogik hilft dort nicht, weil sie nur **nach vorne** sucht (±120° um die
  Fahrtrichtung) — mitten im Rumpf findet sie nirgends Wasser und bewegt gar nichts. Gemessen saß ein
  Boot **10 Sekunden bewegungslos** in der Schiffsmitte, während das Schiff darüber hinwegfuhr: genau
  so fährt man scheinbar *durch* ein Schiff. Jetzt drückt der Rumpf ein Boot mit 30 m/s **quer**
  heraus (der kurze Weg: 16 m Halbbreite gegen 125 m halbe Länge). Aus der Schiffsmitte ist man damit
  in 0,65 s frei.
- **Und es verdrängt auch daneben — die Bugwelle.** Nachgemeldet: „frontal in die Liberty gefahren,
  dann erst **in der Mitte des Schiffes** seitlich hinausgedrängt." Zwei naheliegende Verdächtige waren
  es *nicht*. Die Sperre greift einwandfrei: bei Anfahrt auf die Flanke kommt ein Boot aus **keinem**
  Winkel in den Rumpf (0,0 m Eindringung). Und den „kürzesten Weg hinaus" auch nach vorn zu nehmen ist
  **messbar schlechter** — nach vorn schieben heißt in Fahrtrichtung schieben, und da kommt der Rumpf
  hinterher: die Eindringung stieg bei der Liberty von 1,9 auf **14,5 m**, beim Container auf 27,2 m.
  Der wahre Grund ist **Gleiten an der Zonengrenze**: die Küstenlogik hält das Boot an der Bordwand,
  man gibt weiter Gas dagegen, und das Schiff fährt darunter durch — das Boot wandert mit. Gemessen an
  der Liberty: **115 s** an der Wand, **25,5 m** Wanderung, Ende bei **91 %** der halben Länge, also
  querab der Mitte. Die Küstenlogik kann das nicht sehen, sie sucht Wasser relativ zur *Welt* und kennt
  das Schiff nicht als **bewegtes** Hindernis. Jetzt drückt der Rumpf in einem **8-m-Saum neben sich**
  mit nach außen auslaufender Kraft: **13 s** statt 115, **7,2 m** statt 25,5, Ende bei **62 %** statt
  91 %. Ab 14 m neben der Bordwand bleibt man unbehelligt — normale Vorbeifahrt stört das nicht.

### Sie wackeln nach ihrer Größe
Wie stark ein Schiff in der Dünung arbeitet, hängt an **seiner Länge** — nicht an einem Wert pro
Schiff. Kurze Rümpfe folgen der Welle, lange überbrücken mehrere und liegen ruhig. Bezugslänge sind
120 m; darunter reagiert ein Schiff voll, darüber im Verhältnis weniger:

| | Länge | Neigung | Hebung |
|---|---|---|---|
| Schlauchboot | 4,2 m | 3,81° | reitet auf der Welle |
| Feuerwehrboot | 16 m | 3,13° | reitet auf der Welle |
| ⛵ Großsegler | 90 m | 2,09° | 1,95 m |
| 🚢 Liberty | 135 m | 1,29° | 1,73 m |
| 🛳️ Kreuzfahrtschiff | 250 m | 0,22° | 0,93 m |
| 🚢 Containerschiff | 300 m | 0,10° | 0,78 m |

Bei den langen Schiffen laufen die Wellen dadurch **sichtbar am Rumpf hoch und runter** — die
Wasserlinie wandert, statt dass das ganze Schiff mitschaukelt. Beim Containerschiff steigt das Wasser
um 2,30 m an der Bordwand, während es sich selbst nur 0,65 m hebt.

Die Neigungen in der Tabelle sind die Werte gegen die **Wellenformel**. Seit alles Schwimmende auf der
**gesehenen** Fläche liegt (siehe unten), sind sie in Wirklichkeit **rund halb so groß** — Feuerwehrboot
1,73° statt 4,24°, Schlauchboot 2,07° statt 5,21°, und der Hub eines treibenden Boots 4,06 m statt
5,44 m. Das ist die ehrliche Neigung dessen, was man sieht: flache Dreiecke sind nun einmal weniger
steil als die Welle, die sie annähern. Die **Staffelung** von klein nach groß bleibt unverändert.

Die **Wellen selbst** sind größer geworden: Hub 2,19 m → **4,10 m**. Kürzer machen ließ sie sich
nicht — das Meeresgitter hat 62,5 m Punktabstand, darstellbar sind erst Wellen ab etwa 250 m Länge,
und mehr Segmente sind nicht drin (das Gitter kostet bei 96 Segmenten schon 8,3 ms von 16,7, bei 128
wären es 14,7). Deshalb sind sie **höher** statt kürzer.

Der **Großsegler** brauchte dadurch mehr Freibord (4,13 m), weil er als kürzestes der vier Schiffe voll
mitschwingt *und* nickt — bei 1,89 m tauchte sein Deck im Zusammenspiel beider um 1,08 m ein.

Und das **Feuerwehrboot** lief danach sichtbar mit Wasser voll. Schuld war ein falscher Kommentar in
meinem eigenen Code: er verortete das Deck bei 2,70 m und die Schrauben bei 0,14–1,31. Am gebauten
Objekt nachgemessen liegt das **Deck bei 3,00** (die dichteste Punktebene, 70.401 Punkte) und der
**Antrieb reicht nur bis 0,55** hinunter. Ich hatte den Tiefgang deshalb zweimal in die falsche
Richtung korrigiert, bis auf 2,0 m — davon blieben nach Wellenreserve 0,11 m, und der Rumpf war
komplett unter Wasser. Richtig sind **1,1 m**: Antrieb 0,55 m unter Wasser, 1,90 m Freibord, davon
1,01 m Reserve.

Zu dieser Reserve gehört ein Effekt, der leicht übersehen wird: das **gerenderte Wasser liegt im
Wellental bis 0,45 m höher** als der Wert, mit dem ein Boot rechnet. Das Meeresgitter interpoliert
linear zwischen Punkten, die 62,5 m auseinander liegen, während das Boot nur 16 m lang ist und den
exakten Wellenwert an seinem Mittelpunkt benutzt. Wer nur gegen `waveY` rechnet, liegt zu hoch.

### Bug und Heck: nicht berechenbar
Zwei der vier Modelle sind **gegen** die Fahrtrichtung gebaut und fuhren rückwärts (Kreuzfahrtschiff
und Liberty-Frachter, beide jetzt um 180° gedreht). Automatisch feststellen lässt sich das nicht
zuverlässig:
- Die **Rumpfform** taugt bei Kastenrümpfen nicht — Container und Kreuzfahrtschiff sind über fast
  ihre ganze Länge gleich breit (gemessen 92 bis 100 % der Maximalbreite).
- Die **Brücke** ist auch kein sicheres Kriterium. Bei Frachtern steht sie klassisch am Heck, bei
  modernen Containerschiffen aber mittschiffs, damit vor ihr mehr Container gestapelt werden können —
  genau so ist dieses Modell gebaut. Ich habe den Container deshalb erst falsch gedreht, obwohl er
  richtig fuhr.

Wer hier etwas ändert: **im Spiel nachsehen, nicht rechnen.**

### Der Fehler, der alles Durchfahren erklärte
Trotz Kollisionshülle konnte man mit dem Boot durch die Schiffe fahren — und die Flugzeuge auch. Die
Ursache war eine falsche **Reihenfolge** beim Aufbereiten der Modelle: ich habe erst zentriert, dann
gedreht. `rotation.y` dreht aber um den *Objektursprung*, nicht um den Modellmittelpunkt, und hebt das
Zentrieren damit wieder auf.

Gemessen stand der Container-Rumpf danach bei x = −61,7 bis −19,4 — also **40 m neben seiner eigenen
Kollisionshülle** (die 21,2 m um x = 0 abdeckt). **86 % seiner Punkte lagen außerhalb**, davon 414
direkt an der Wasserlinie: genau dort, wo ein Boot vorbeifährt. Es hat also nie etwas berührt.

Jetzt wird **nach** der Drehung zentriert, und die Halbmaße kommen aus den tatsächlichen Grenzen
(`max(|min|, |max|)`) statt aus der Boxgröße — liegt ein Modell doch einmal unsymmetrisch, deckt die
größere Seite beides ab. Der breiteste Punkt liegt seither bei jedem Schiff **innerhalb** der Hülle
(Container 21,2 statt 61,7 m). Nachgemessen mit 112 Anfahrten aus je 16 Richtungen: tiefste
Eindringung 2,7 m in die 4-m-Pufferzone, in den Rumpf selbst **nie**.

### Die Wasserlinie muss man ausmessen
Jedes Modell hat seinen eigenen Maßstab (von 0,14 bis 27.000 Einheiten) und seine eigene Bauart. Wo
die Wasseroberfläche hingehört, ist deshalb pro Schiff gemessen: die Höhe, ab der der Rumpf **mittschiffs**
seine volle Breite erreicht (Bug und Heck sind immer schmal und verfälschen das). In Prozent der
Schiffslänge: Kreuzfahrtschiff **2,99 %**, Liberty **6,69 %**, Container **0,93 %**, Segler **10,27 %**.

Beim Kreuzfahrtschiff fällt der Wert aus dem Rahmen, und das hat einen Grund: sein Rumpf ist
**unter der Wasserlinie gar nicht modelliert** — gemessen zeigen nur 0,5 % seiner Fläche nach unten,
das Modell ist dort einfach abgeschnitten. Hätte man es so tief gelegt wie die anderen, würde man in
ein Loch sehen.

Die 92-%-Regel hat mich dabei zweimal in die Irre geführt, und ich habe deshalb umgestellt: **maßgeblich
ist jetzt der Tiefgang des Vorbilds**, nicht eine am Modell gemessene Breite.

| | Länge | Vorbild-Tiefgang | Wert |
|---|---|---|---|
| 🚢 Containerschiff | 300 m | 13 m (Panamax) | 2,86 % → 8,6 m |
| 🛳️ Kreuzfahrtschiff | 250 m | 8 m | 3,20 % → 8,0 m |
| 🚢 Liberty-Frachter | 135 m | 8,2 m (27 ft der Baureihe) | 6,07 % → 8,2 m |
| ⛵ Großsegler | 90 m | 5 m | 5,56 % → 5,0 m |

Beim Containerschiff geht die volle Tiefe nicht: sein Rumpf ist nur bis −4,38 modelliert (auf die
Ziellänge skaliert −8,58), tiefer würde man in ein Loch sehen. 2,86 % nutzen ihn fast vollständig aus.
Vorher lag er bei 1,46 % und **schwebte sichtbar** — der ganze rote Unterwasserrumpf war zu sehen.

## 🛟 Ins Wasser: das Schlauchboot

Früher war das Meer für den Astronauten eine unsichtbare Wand — man stand am Rand des
Flugzeugträgers und kam nicht weiter, obwohl das Wasser direkt davor lag. Jetzt gibt es dort ein
**Schlauchboot** (Modell von **Mike0916**), und zwar in drei Situationen:

- **Zu Fuß ins Wasser laufen.** Wer über den Strand hinaus oder über eine Kaikante läuft, steht im
  Schlauchboot statt an einer Wand. Es taucht genau dort auf, wo er ins Wasser geraten wäre.
- **Vom Flugzeugträger springen.** Läuft man über die Deckkante, **fällt** man die 12 m sichtbar
  hinunter (rund 1,6 s) und landet im Boot, das unter einem auftaucht.
- **Fallschirmspringer, die aufs Meer herunterkommen** — der Spieler nach dem Schleudersitz genauso
  wie die **KI-Piloten** und die Vorbeiflug-Maschine. Der **Schirm ist dann weg**: im Wasser wird er
  als erstes abgeworfen, und ein Schirm über einem Boot sah aus, als hinge der Springer noch in der
  Luft. Diese Boote **treiben** nur mit der Dünung, gefahren wird ausschließlich das eigene.

**Gefahren wird genau wie mit dem Feuerwehrboot:** linker Stick ←→ **lenkt**, rechter Stick ↕ setzt
den **Schub** in 10-%-Stufen (Tastatur W/S, Leertaste = Vollgas), **A bzw. C** fährt rückwärts. Bis
**40 km/h**, wendiger als das 16 m lange Feuerwehrboot. Der Außenborder ist derselbe synthetische
Motor-Loop — es ist ja auch einer. Zwei verschiedene Bootssteuerungen zu lernen wäre für ein Kind
eine unnötige Hürde, deshalb ist es bewusst dieselbe (das Umsehen mit dem rechten Stick gibt es
darum nur **zu Fuß**, nicht im Boot).

- **Im Boot wird nicht gehüpft.** Dort ist man ein **Fahrzeug**, kein Mensch: B tut nichts, und das
  HUD zeigt statt der Sprungweite wieder **Schub in Prozent** — genau wie beim Feuerwehrboot. Die
  Höhenzeile verschwindet, weil man immer auf der Wasserlinie fährt.
- **An Land steigt man von allein aus**, und das Boot verschwindet. Geprüft wird **3 m vor dem Bug**,
  sonst stiege man erst aus, wenn das halbe Boot im Sand steckt. Ein leeres Boot am Strand liegen zu
  lassen sähe aus wie ein Fehler — und wieder einsteigen kann man überall.
- **Land ist nicht gleich Ufer.** Vor einem Bauwerk oder der **Bordwand** des Trägers steigt man
  nicht aus, sondern **gleitet daran ab** (dieselbe Küstenlogik wie beim Feuerwehrboot, jetzt für
  beide Boote gemeinsam) — sonst stünde der Astronaut plötzlich in einer Hauswand.
- Der Astronaut **steht** im Boot. Sitzen kann er nicht: seine Pose ist beim Verkleinern des Modells
  fest in die Geometrie gebacken, es gibt keine Knochen mehr. Stehend passt es aber besser — er ist
  auf **4,2 m** Bootslänge gut zu sehen, sitzend verschwände er hinter dem Wulst.
- **Der Tiefgang ist ausgemessen, nicht geschätzt** — und musste zweimal nach: mit 0,18 m schaute der
  Außenborder heraus, mit 0,32 m schwamm das Boot sichtbar obenauf (der 1,93 m hohe Wulst ragte 1,61 m
  aus dem Wasser). Am normierten Modell reicht der Antrieb bis **0,114 m** über dem Kiel hinunter, der
  **Innenboden** liegt bei **0,462** — das brauchbare Fenster ist also nur 35 cm breit. Gewählt sind
  **0,42 m**: Antrieb 0,31 m unter Wasser, Innenboden noch 4 cm trocken, Wulst ragt 1,51 m heraus.
  Dass die Füße gelegentlich nass werden, ist bei einem Schlauchboot in Ordnung — anders als bei einem
  Feuerwehrboot, dessen ganzes Deck dann unter Wasser läge.
- **Die Rettungsboote liefen voll — und zwar nur sie.** Der Tiefgang war richtig, das eigene Boot lag
  trocken. Der Unterschied ist nicht das Treiben, sondern der **Ort**: das eigene Boot sitzt immer in
  der **Mitte des Meeresgitters** (das folgt dem Astronauten), und dort liegt ein Stützpunkt. Die
  Rettungsboote treiben irgendwo dazwischen — und zwischen den Stützpunkten ist das Wasser **flach**.
  Das Gitter kennt die Welle nur alle 62,5 m und spannt Dreiecke dazwischen; im Wellenberg schneidet
  diese Sehne den Bogen ab. Die Fläche, die man **sieht**, steht deshalb bis zu **1,005 m höher** als
  die Wellenformel am selben Punkt (gemessen gegen das echte Mesh mit 18.432 Dreiecken). Ein Boot, das
  seine Höhe aus der Formel nimmt, liegt damit bis zu einem Meter zu tief — bei **44,5 %** aller
  Stichproben stand der Innenboden unter Wasser. Jetzt rechnet alles Schwimmende die Gitterdreiecke
  nach (Abweichung zum echten Mesh: **0,000000000 m**), und der Boden bleibt in **100 %** der Fälle
  trocken. Das Meeresgitter selbst rechnet weiter mit der Formel — es *setzt* die Stützpunkte, dort ist
  sie die Wahrheit, und bei 9.409 Punkten wäre das Nachrechnen auch zu teuer.

### Zwei Fallen beim Einbau (beide ausgemessen)
- **Der Trägerrumpf ist 4 m breiter als das Deck.** Direkt neben der Deckkante ist also Bordwand,
  nicht Wasser — bis zum freien Wasser sind es von der Kante **6,75 m**. Wer nur den nächsten Schritt
  prüft, findet dort nie Wasser, und der Astronaut bleibt stehen: genau die harte Grenze, die weg
  sollte. Er sucht deshalb bis **9 m voraus** und springt über die Bordwand hinweg.
- **„Steht er fest?" braucht eine Schwelle.** Bei einem Kurs von genau -90° ist die Z-Komponente der
  Blickrichtung nicht 0, sondern -6·10⁻¹⁷ — der Astronaut rutschte pro Bild um 10⁻¹⁸ m zur Seite, und
  ein exakter Vergleich zählte das als Bewegung. Gemessen: 60 Bilder bewegungslos am Ufer. Jetzt gilt
  „fest", wenn weniger als ein Zehntel des gewollten Schritts herauskommt.

## 🌍 Ins Weltall: Mond, Mars, Todesstern und Sonne (nur X-Wing)

Mit **80–100 % Schub steil steigen**: ab **3 km** wird der Himmel dunkler und die Sterne kommen, ab
**4 km** ist man im **Weltall**. Unter 80 % riegelt die Atmosphäre bei **3 km** ab — erst die volle Fahrt
trägt hinaus. Alle anderen Flugzeuge behalten ihren gewohnten Höhendeckel; **nur der X-Wing** kommt ins
Weltall, und ein **Modellwechsel bringt sofort zur Erde zurück**.

Im Weltall **dreht sich die Kamera mit dem Flieger**: er bleibt immer richtig herum im Bild, und die
Sternenkulisse kippt stattdessen. Vorher sah man dem X-Wing kaum an, ob er aufrecht oder auf dem Kopf
flog — und ein „oben" gibt es dort ohnehin nicht. Der Übergang blendet sich weich ein; auf **Mond und
Mars** (mit Boden und Schwerkraft) bleibt die Kamera aufrecht.

Im Weltall wird die Erde zur **Kugel** unter einem, es ist **schwerelos**, und es gibt keine Höhenangabe
mehr — dafür **Warp**: 100 % Schub sind **Warp 1**, und wer 100 % hält, rutscht immer weiter in den
**Hyperraum** bis **Warp 10**. Das ist kein Tor und kein Schalter: der Effekt blendet sich mit der
Geschwindigkeit ein, genau wie der Übergang vom Himmel ins Weltall — der leuchtende Ring erscheint
**ab Lichtgeschwindigkeit** (Warp 1). **Kurz vor jedem Himmelskörper bremst er von selbst aus dem
Hyperraum** und drosselt auf **90 %** Schub — nah genug, dass der Anflug zügig bleibt: beim Mond
setzt das 18 km vor der Mitte ein, beim Mars 45 km. **Angekommen** geht es mit **30 %** weiter, und
das ist genau die Schwelle, ab der der X-Wing waagerecht vorwärts fliegt: eine Stufe weniger und er
schwebt.

Der Schub ist im Weltall **linear**: 10 % sind Warp 0,1, 50 % sind Warp 0,5, 100 % ist Warp 1.

**Suchhilfe**: Über dem Flieger blitzen — genauso groß wie die Wassertropfen und Kisten — für drei
Sekunden Symbole auf, und zwar nur bei einem **echten Wechsel**: beim Ortswechsel (🌍 🚀 🌙 🛰️), wenn man
ein neues Ziel eine Sekunde lang stabil ansteuert, und bei jedem Asteroiden-Treffer der Zähler (💥).
Dauerhaft und klein steht oben links der Ort mit der Entfernung zum **angeflogenen** Himmelskörper
(🌙 Mond, 🔴 Mars, ☀️ Sonne) — nicht zum nächstgelegenen; das Radar zeigt die Richtung. Der Mond liegt
immer genau in der Richtung, in die man die Atmosphäre verlassen hat. Zurück auf die Erde geht es erst
**unter 2,2 km** — beim Suchen fällt man also nicht versehentlich heim.

Vier Ziele hängen dort draußen: der **Mond** (150 km), der **Todesstern** (250 km), der **Mars**
(400 km) und die **Sonne** (900 km).

**Landen** kann man auf **Mond** und **Mars**: unter dem X-Wing liegt dann eine echte Landschaft, die
sich endlos fortsetzt — auf dem Mond der **Giordano-Bruno-Krater** mit einem Sechstel der Erdanziehung
und einer **552 m großen Mondbasis**, auf dem Mars die **Aram-Chaos-Region** mit gut einem Drittel
Anziehung und dem **Perseverance-Rover**. Auf dem Mond steht auf **jeder Kachel** eine Basis an einer
festen Stelle, und der Rover setzt sich beim Landeanflug (10 % Schub) direkt **neben den Aufsetzpunkt**.
Über beiden steht eine **Leuchtsäule**, damit man sie aus der Luft findet. Am Himmel steht dabei die Erde.

Man landet **auch auf der Basis selbst**: ihre Rampen und ihr Dach zählen als Boden, man setzt also
dort auf, wo man darüber schwebt. Beim Anflug auf Mond oder Mars wird der Flieger so eingesetzt, dass
Basis bzw. Rover **direkt vor ihm** liegen — man muss sie nicht erst suchen.

Beim Übergang ins Weltall geht der Schub automatisch auf **50 %**, damit man sich erst umsehen kann
und nicht sofort in den Hyperraum rutscht.

Auf dem **Todesstern** kann man **im Hangar landen**: einfach anfliegen wie einen Planeten. Drinnen
schwebt man mittig über dem Hangarboden (20 % Schub) und setzt mit 10 % auf; **Boden und Decke sind
fest**, hinaus geht es durch die Öffnung. **Dort startet der X-Wing auch** — beim Spielstart und nach jedem
Reset. Genauso funktionieren die **Star Destroyer** (fünf davon, die Flugzeugträger des Weltalls) und
die **ISS** — anfliegen, im selben Hangar landen, wieder hinausfliegen. Rundherum sieht man **andere
Schiffe einfliegen**. Nach dem Hinausfliegen bleibt das Andocken ein paar Sekunden gesperrt, sonst
würde der Gastgeber einen sofort wieder einsaugen — er zieht ja mit. Die **Sonne** kann man nur
**umkreisen** — eine unsichtbare Grenze stoppt nur die Bewegung zu ihr hin, seitlich fliegt man weiter.

Die **ISS** ist im Spiel **2400 m groß** — doppelt so groß wie ein Star Destroyer — und **leuchtet
leicht von selbst**. Im Originalmodell hat sie nur 109 m, und damit war sie im Sternenfeld praktisch
nicht zu finden: sie besteht aus dunklem Metall, und im Weltall ist das Streulicht bewusst
heruntergefahren. Jetzt sieht man sie von weitem, und im Radar hat sie zusätzlich ihren **eigenen
Blip**.

### Wie genau sind die Größen?
Die **Schiffslängen folgen den offiziellen Angaben**, damit die Verhältnisse untereinander stimmen:
Space Shuttle 37 m · Razor Crest 24,3 m · Millennium Falcon 40 m · Serenity 82,1 m · USS Voyager
344,5 m · USS Enterprise-D 642,5 m · Star Destroyer 1200 m · X-Wing 12,5 m.

Zwei Dinge sind **bewusst unmaßstäblich**, weil es sonst nicht spielbar wäre:

- Die **ISS** ist real 109 m lang. Maßstabsgetreu wäre sie ein Punkt von wenigen Pixeln — man würde
  sie nie finden.
- Der **Todesstern** hat im Kanon 160 km Durchmesser, im Spiel sind es 40 km. Bei 160 km wäre er
  größer als der halbe Anflugweg (die Himmelskörper stehen 150 bis 900 km auseinander) und würde beim
  Anflug den ganzen Himmel füllen.

Auch die **Entfernungen** sind zusammengeschoben: der Mond steht 150 km weit weg statt 384.400 km.
Sonst wäre man mit Mach 2 wochenlang unterwegs.

Im Weltall ist außerdem Verkehr: die **ISS** zieht in Erdnähe ihre Bahn, und **Space Shuttle** (9×),
**Razor Crest** (6×), **Millennium Falcon** (4×), **Serenity** (2×), **USS Voyager** (2×) und
**USS Enterprise-D** (2×) fliegen ihre eigenen Kurse durchs All — jedes fünfte Schiff steuert einen Star Destroyer an, von denen fünf
im Raum verteilt stehen. Ihr Tempo liegt nahe an
deinem — manche überholen dich langsam, andere werden überholt, mancher zieht einfach quer durchs
Bild. **Rammen kann man sie nicht**, und Waffen haben sie keine; **nur X-Wings schießen** auf
Asteroiden. Der Todesstern bleibt stumm: für ihn zeigt das HUD bewusst kein Symbol.

An **Mondbasis und Rover** ist ebenfalls Betrieb: zwei Schiffe **starten und landen** dort
fortwährend — auf dem Mond **auf der hellen Fläche neben dem Gebäude**, wo man sie gut sieht. Ihre
Aufsetzhöhe wird an der Basis selbst gemessen, denn die Fläche fällt nach außen von 25 m auf 11 m ab.

**Asteroiden abschießen**: Im Weltall treiben 20 Felsbrocken (60–200 m) auf zufälligen Kursen umher.
Sie **passen ihr Tempo dem Flieger an** und bleiben nur 2–8 % zurück — man zieht also langsam an ihnen
vorbei und hat Zeit zu zielen.
**B** feuert zwei **orangene Laserblitze** — ein Schuss pro Druck. Ein Treffer lässt den Asteroiden
zerplatzen, und das HUD zählt die Treffer mit (💥). Wer hineinfliegt, zerlegt ihn ebenfalls, ohne selbst
Schaden zu nehmen. Dazu sind **sechs fremde X-Wings** unterwegs, die eigene Brocken ins Visier nehmen und abschießen;
sie halten mit deinem Tempo mit. Alles das gibt es nur **unterhalb von Warp 1**: im Hyperraum ist der Raum leer.

**Zurück** geht es jederzeit: Auf dem Mond hochsteigen (über 4 km) → Weltall. Im Weltall absinken →
wieder in die Inselwelt. Das HUD zeigt links, wo man ist (🚀 Weltall, 🌙 Mond), auf dem Mond die Höhe
über dem Kraterboden. **Reset (R / Start)** bringt immer zur Erde zurück. Eine **Feuerwehr** gibt es
im Weltall und auf dem Mond nicht — dort endet ein Absturz einfach mit dem Neustart auf der Erde.

## ✈️ Flugverkehr in der Luft (läuft immer)
Der Himmel lebt: eine **Flotte von ~11 KI-Fliegern** reist mit dir durch die Welt und fliegt **dieselben
echten Missionen wie du** (keine bloße Deko) — **ohne Kollision mit dir**. Fliegt einer zu weit weg,
taucht in deiner Nähe ein neuer mit neuer Mission auf, so bleibt der Himmel immer belebt.

- **Canadair** pendelt **Wasser ↔ Feuer**: tankt tief über dem Meer, fliegt zu einer brennenden Insel
  und löscht. Dieses **KI-Feuer kannst du selbst löschen** — mit der eigenen Canadair (Wasser drüber
  ablassen) oder vom **Feuerwehrboot** aus (Wasserstrahl mit **B**).
- **Transall** lädt auf der **Landebahn von Insel A** Kisten, fliegt zu **Insel B** und wirft sie am
  Fallschirm ab.
- **Airbus** nimmt Passagiere auf, fliegt **weit** zu einer anderen Landebahn und lässt sie aussteigen.
  Airbus & Transall fliegen einen **echten Bahnanflug** (auf die Bahnachse einschwenken, aufsetzen,
  ausrollen) und starten wieder — sie landen nicht mehr im Gras.
- **Mustang** reist mit **Kunstflug** (Rolle/Looping); **Alpha-Jet** zieht schnelle Reisebahnen.
- Über **Flugzeugträgern** setzen **Alpha-Jet & Mustang** im **Touch-and-Go** kurz auf dem Deck auf.

**Hindernisse sind für die KI real.** Häuser, Berge und Wolkenkratzer-Städte werden nicht durchflogen:
- **Airbus/Transall** (langsam) **ziehen hoch und weichen aus**.
- **Alpha-Jet/Mustang** (schnell) entscheiden dynamisch aus Flughöhe, Steigrate und Hindernishöhe:
  weit genug weg → **rechtzeitig übersteigen**; zu nah/zu tief → **Absprung (Schleudersitz) + Absturz**,
  dann rückt (wie beim Spieler) die **Feuerwehr** aus.
- Der sporadische **Überschall-Vorbeiflug** (Alpha-Jet von hinten, Schallmauer-Knall) folgt derselben
  Regel: über einer Stadt steigt er drüber oder stürzt ab — je nach Distanz.

Nah vorbeikommende Flieger **wackeln** zum Gruß mit den Flügeln; schnelle/hohe ziehen
**Kondensstreifen**. Der Verkehr **läuft immer** — der frühere Schalter (J / LB) ist entfallen.
## 🙏 Danksagungen

Dieses Spiel wäre ohne die großartige Arbeit vieler Künstlerinnen und Künstler nicht möglich.
Ein herzliches Dankeschön an die folgenden Damen und Herren, deren 3D-Modelle über
**[Sketchfab](https://sketchfab.com)** unter Creative-Commons-Lizenzen bereitgestellt wurden
(Namensnennung gemäß Lizenz):

| Modell | Künstler/in (Sketchfab) |
|---|---|
| Canadair CL-215 | **AlessioPassera** |
| Dornier Alpha Jet A (West Germany) | **42manako** |
| Airbus A380-800 | **OUTPISTON** |
| Transall C-160 | **42manako** |
| P-51 Mustang | **UlissesVinicios** |
| Fire Rescue Boat | **gogiart** |
| Mercedes Atego Fire Engine | **Aeroux Games 3D** |
| Parachute | **stroodledoodle** |
| Gerald R. Ford Aircraft Carrier | **Usman Zia** |
| The Wharf – Fishing Harbor | **Mehdi Shahsavan** |
| X-Wing 2.0 | **GaryPhelps** |
| Earth · Moon | **Akshat** |
| Moon – Giordano Bruno Crater | **Sebastian Sosnowski** |
| Minecraft Java Edition Stars | **AjaxGb** |
| Mars | **Akshat** |
| Sun | **Sebastian Sosnowski** |
| Spacedrive | **tamminen** |
| Asteroid 01 | **exabyte** |
| Mars – Aram Chaos Region | **Sebastian Sosnowski** |
| Moonbase | **eggshell.d** |
| ISS | **colinf** |
| Space Shuttle | **Jan Tesař** |
| Razor Crest (Star Wars) | **Quiznos323** |
| Serenity | **mohamedhussien** |
| Perseverance (NASA Mars Landing 2021) | **Thomas Flynn** |
| Death Star (Star Wars) | **Sebastian Sosnowski** |
| Star Wars Hangar Interior | **Aditya Voxel** |
| Star Destroyer (Star Wars) | **rubaun** |
| USS Voyager (Star Trek) | **CGI Tutorials** |
| USS Enterprise-D (Star Trek) | **LoganRolphh** |
| Astronaut im Raumanzug | **LasquetiSpice** |
| Millennium Falcon (Star Wars) | **jay2307** |
| Parachute Simple | **TopNotch Assets** |
| Schlauchboot | **Mike0916** |
| Kreuzfahrtschiff | **farhad.Guli** |
| Liberty-Frachter | **AlanTinka** |
| Containerschiff | **RM02** |
| Großsegler | **Liaval** |

Vielen Dank für eure Kreativität und dafür, dass ihr eure Werke mit der Community teilt! ❤️

Weitere verwendete Technik:
- **[three.js](https://threejs.org)** (r128) — 3D-Rendering, inkl. GLTFLoader & DRACOLoader.
- **Motor-/Crash-Sounds** aus dem **FMS (Flug-Modell-Simulator)**, Freeware von Möller (2001).

## 🔧 Technik (kurz)
- Reines HTML + JavaScript + WebGL, keine Installation, kein Build. Alle Modelle/Sounds sind
  eingebettet (Base64) — das Spiel läuft sowohl online als auch per Doppelklick lokal.
- Die eingebetteten Modelle sind **rund 98 MB**; der Service Worker cached sie beim ersten Start
  komplett und lädt sie bei einem Update erneut. Sechs schwere Modelle (Hangar, Serenity, Voyager,
  Rover, Enterprise, Razor Crest) wurden dafür **vereinfacht** — zusammen rund 100 MB und
  1,1 Mio. Dreiecke gespart, bei gleichen Außenmaßen.
- Der **Astronaut** wurde von **19,3 MB auf 1,0 MB** gebracht (5 %). Texturen allein hätten wenig
  gebracht: sie waren nur ein Drittel der Datei, während **10,8 MB reine Vertex-Attribute** waren
  (Texturkoordinaten, Tangenten, Normalen) — und die hängen an der Dreieckszahl. Also 58.312 → 14.288
  Dreiecke (die Silhouette stimmt gemessen noch zu **99 %**), Texturen auf ein Viertel der
  Kantenlänge, und die **Animation** samt Skinning-Daten heraus, weil die Figur nicht animiert wird.
- Der **Millennium Falcon** ging von **3,78 MB auf 0,58 MB** (15 %) — hier lag es umgekehrt zum
  Astronauten: nur 3.703 Dreiecke, aber **94 % der Datei waren Texturen**. Also nur die Texturen
  halbiert (1024 → 512) und die zweiten UV-Sätze entfernt, die three.js ohnehin nicht nutzt.
- Das **Schlauchboot** ging von **1,47 MB auf 0,67 MB** (45 %) — wie beim Falcon steckte der
  Großteil in den Texturen (0,89 MB = 60 % der Binärdaten bei nur 17.233 Dreiecken). Also nur die
  eine Textur halbiert (1024 → 512); die Geometrie blieb unangetastet, weil das Boot aus der Nähe
  zu sehen ist.
- Die **vier Schiffe** gingen von zusammen **54,0 MB auf 4,7 MB** (9 %). Dabei kamen drei ganz
  verschiedene Ursachen zum Vorschein — pauschal hätte keine Maßnahme gereicht:
  - Der **Liberty-Frachter** brachte **zehn UV-Sätze** mit (TEXCOORD_0 bis _9, zusammen 5 MB), von
    denen three.js genau einen nutzt.
  - Beim **Containerschiff** war es reine Geometrie: 188.676 Dreiecke. Vertex-Clustering machte
    daraus 22.178 (12 %) bei gleicher Silhouette.
  - Beim **Großsegler** waren **78 % der Datei Texturen** (17 Bilder à 1 MB) — die auf ein Viertel
    der Kantenlänge, und aus 20,2 MB wurden 3,8.
  Der größte Einzelfehler steckte aber im Werkzeug: es übernahm ganze `bufferView`-Blöcke, und weil
  sich mehrere Attribute einen Block teilen, kamen die gerade entfernten UV-Sätze **wieder mit**.
  Beim Liberty waren das 3,8 MB Nutzdaten in einer 8,3 MB großen Datei. Erst das dichte Neupacken
  **pro Accessor** löste das.
- Alle **181 Texturen** wurden zusätzlich auf die **halbe Kantenlänge** gebracht (meist 1024 → 512).
  Entscheidend ist dabei nicht die Dateigröße, sondern der Grafikspeicher: dort liegen Texturen
  unkomprimiert, und aus **735 MB wurden 184 MB** (145 → 36 Megapixel). Auf einem Tablet passte das
  vorher nicht in den Grafikspeicher — genau das war der Grund für das lange Ruckeln nach dem Start.
- Endlose, ortsfeste Inselwelt (deterministisch je Rasterzelle), animiertes Meer, Flugzeugträger,
  Häfen, Wolkenkratzer-Städte.

## 📄 Lizenz
Der Spielcode ist frei nutzbar. Die 3D-Modelle unterliegen ihren jeweiligen Creative-Commons-Lizenzen
der oben genannten Sketchfab-Autorinnen und -Autoren — bei Weiterverwendung bitte deren Namensnennung
beibehalten.
