# TODO — Flugspiel

Offene Punkte. Erledigtes austragen, nicht abhaken lassen.
Stand: 10.09.2026, nach der fünften Runde.

---

## Offen

**Kamera fährt durch alles außer Schiffen.** Sie hat als einzige Kollision die Klemme „nicht unter
y = 2" und wird jetzt bei Schiffen herangezogen. Inseln, Berge, Häuser und der Trägerrumpf fehlen
noch: dort schaut man weiterhin von innen durch die Wand.

---

## Zur Kenntnis: das Nicken ist schwächer

Seit alles Schwimmende auf der **gesehenen** Wasserfläche liegt, nickt es rund halb so stark
(Feuerwehrboot 4,24° → 1,73°). Das ist rechnerisch richtig — flache Gitterdreiecke sind weniger steil
als die Welle. Wenn es zu ruhig wirkt: `BOAT_BOB` 1 → **2,45**, `DINGHY_BOB` 1,2 → **3,01**
(ausgerechnet für exakt die alte Wirkung). Nicht eingebaut, weil das eine Geschmacksfrage ist.

---

## Was die Schiffskollision bewusst nicht kann

- **Überbauten** über der Wasserlinie zählen für Boote nicht: ein überhängender Kran ragt über die
  Bootshülle hinaus, ohne zu blockieren. Für die Flieger gilt weiter die volle Höhe.
- Die Schiffe **kollidieren nicht untereinander** — sie werden nur beim Aussetzen auf Abstand gesetzt
  (`SHIP_CLEAR` = 260 m).
- Das Halbbreiten-Profil hat **24 Scheiben**; bei einem 300-m-Schiff sind das 12 m pro Scheibe. Feiner
  als jedes Boot lang ist, aber die Bugspitze ist damit gestuft, nicht stufenlos.

---

## Lehre aus der Fehlersuche (bitte beim nächsten Mal beherzigen)

Das Durchfahren durch die Schiffe hat einen ganzen Tag gekostet, und der Grund dafür ist eine
Testmethode, die nicht funktioniert hat:

- Meine Simulationen benutzten **dieselbe Formel wie das Spiel**. Sie waren dadurch in sich konsistent
  falsch und konnten den Vorzeichenfehler nicht sehen — über 1.280 Anfahrten meldeten sie „kein
  Durchfahren", während es im Spiel offensichtlich passierte.
- Alle Tests fuhren gegen ein Schiff mit `heading = 0`. Genau dort ist `sin(h) = 0`, und genau dort
  stimmten beide falschen Formeln zufällig.
- **Was hilft:** gegen eine *unabhängige* Referenz prüfen, nicht gegen die eigene Rechnung. Hier war
  das `three.js worldToLocal` — also das, was der Renderer tatsächlich zeichnet. Und Kurse durchvariieren,
  nicht bei 0 bleiben.
- **Was am Ende entschieden hat:** die Diagnose-Anzeige im Spiel (Taste J). Sie zeigte „quer −31,3 bei
  Grenze 25,2 → frei", und weil das Modell nur 21,2 m breit ist, war damit klar, dass die *Rechnung*
  falsch liegt und nicht die Hülle. Eine Messung im laufenden Spiel schlägt jede Simulation.

---

## Erledigt am 10.09.2026

1. **Rettungsboote liefen voll** — Gitter-Interpolation (bis 1,005 m), nicht `tOff`. `seaMeshY()`.
2. **Durchziehen bis zur Schiffsmitte** — Gleiten an der Zonengrenze. 8-m-Saum (Bugwelle).
3. **KI-Jet durch das Containerschiff** — `carrierLap` sah keine Hindernisse; eigene Prüfung
   `aiShipAhead()`, weil der Jet sonst seinen eigenen Träger als Hindernis gesehen hätte.
4. **Feuerwehrboot drang ein statt abzuprallen** — es prüfte nur seinen Mittelpunkt. `BOAT_LOOK`.
5. **Barriere lag neben dem Schiff** — Hülle kam aus der Gesamtbox mit Masten. Jetzt Rumpfband + `cx`/`cz`.
6. **Von vorne durchgefahren** — die eigene Vorausschau machte das Ausweichen blind. Zwei Durchgänge.
7. **Schiffe schwebten in der Luft** — sie fuhren jenseits des Meeresgitters. Radien 2,4 / 2,9 km.
8. **Schatten für Boote und Astronaut** (Wunsch) — ovaler Schatten, wächst mit der Sprunghöhe.
9. **Schatten wanderte** — er lag auf fester Höhe statt auf der Welle (bis 5,59 m Differenz).
10. **Falcon flog seitwärts** — `setFromUnitVectors` ließ den Roll frei (im Mittel 45,3° gekippt).
11. **Grenze folgt der Rumpfform** — Halbbreiten-Profil mit 24 Scheiben statt Rechteck.
12. **Ganzer Bootsumriss geprüft** statt eines Punktes — 5,4 % der Lagen waren sonst „frei", obwohl
    die Bootsmitte im Rumpf stand.
13. **DAS Durchfahren: zwei Vorzeichen in der Drehung.** Die Rückdrehung ins Schiffssystem und die
    Querachse des Schiffs drehten beide um +heading statt um −heading. Gemessen gegen three.js lag die
    Hülle bei 90° Kurs **203 m** neben dem Rumpf, bei **92 %** aller Kurse mehr als eine Schiffsbreite
    daneben — und die Verdrängung schob zusätzlich zur Mittellinie statt hinaus. Bei Kurs 0° und 180°
    stimmte es zufällig, deshalb war es so schwer zu finden. Nach der Korrektur bleiben **3.528**
    Fahrten (21 Kurse × 21 Anfahrten × 4 Schiffe × vor/rückwärts) **restlos** im freien Wasser.
14. **Schatten größer und vorne beschnitten** (Wunsch) — 15 % größer, und das vordere Stück fehlt,
    damit er nicht über dem eigenen Rumpf liegt.

Alle Befunde stehen ausführlich im README.
