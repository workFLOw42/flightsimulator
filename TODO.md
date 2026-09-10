# TODO — Flugspiel

Offene Punkte. Erledigtes austragen, nicht abhaken lassen.
Stand: 10.09.2026, nach der vierten Runde.

---

## 1. Durchfahren durch das Containerschiff — teils behoben, Rest offen

Gemeldet am 10.09. mehrfach, mit Screenshot: das Feuerwehrboot war **mitten im Containerschiff**,
Kamera mit drin, und das Schiffsmodell ist innen hohl (deshalb sah man Wasser im Rumpf).

**Was daran behoben ist** (beides gemessen, siehe README):
- Geprüft wurde nur **ein Punkt** 8 m vor der Bootsmitte. In 5,4 % aller Lagen steckt die Bootsmitte
  im Rumpf, während dieser Punkt frei liegt — daraus fuhr das Boot ungehindert weiter. Jetzt werden
  neun Punkte geprüft (Bug/Mitte/Heck × drei Querlagen).
- Die Ausweichlogik prüfte einen Punkt 8 m voraus, verschob das Boot aber nur um einen Frameschritt.
  Die Lage, in der es wirklich landete, war ungeprüft. Jetzt wird die tatsächliche Ziellage geprüft.
- Die Grenze folgt jetzt der Rumpfform (24 Scheiben) statt einem Rechteck.

Über 1.280 simulierte Anfahrten kommt die Bootsmitte danach höchstens **3 %** in den Rumpf (vorher
28 %), und **kein** Fall erreicht die Rumpfmitte.

**Was offen ist:** genau dieser Durchbruch ließ sich in der Simulation **nie** reproduzieren — in
keiner der 1.280 Anfahrten, auch nicht mit dem alten Code. Es fehlt also noch eine Ursache, die mein
Nachbau nicht abbildet. Kandidaten, die noch nicht geprüft sind:

- **Bildrate.** Bei einem großen `dt` (Ruckler, Tab-Wechsel) legt das Boot pro Frame mehr als die
  Vorausschau zurück. `dt` ist auf 0,05 s geklemmt, das sind bei 24 m/s 1,2 m — reicht nicht für 8 m,
  aber die Klemme greift nur im Loop, nicht bei einem Sprung in `seaTime`.
- **Zwei Schiffe gleichzeitig.** Die Ausweichlogik sucht Wasser gegen *alle* Schiffe, die Verdrängung
  behandelt aber nur das **erste** getroffene (`return` in der Schleife). Zwischen zwei Rümpfen könnte
  das ein Verhalten geben, das mein Test mit einem Schiff nicht sieht.
- **Der Weg über die EVA.** Steigt man im Schlauchboot aus und wieder ins Feuerwehrboot ein, während
  ein Schiff darüber steht, wird die Position gesetzt statt gefahren — dabei greift keine Sperre.

**Zum Nachsehen ist die Taste J eingebaut** (Diagnose im HUD): sie zeigt für das nächste Schiff die
Lage quer und längs gegen die Grenze und sagt „frei" oder „IM RUMPF". Damit ist im Spiel selbst zu
unterscheiden, ob die Hülle zu klein ist (steht „frei", obwohl man im Stahl sitzt → Hüllenproblem)
oder ob die Sperre nicht greift (steht „IM RUMPF" → Fahrlogik). Das ist die Information, die noch
fehlt, um den Rest gezielt zu beheben statt weiter zu raten.

---

## 2. Kamera fährt durch alles

Die Kamera hat als einzige Kollision die Klemme „nicht unter y = 2". Sie hängt rund 30 m hinter dem
Fahrzeug und steckt beim Vorbeifahren an einem 300-m-Frachter regelmäßig im Rumpf — gemessen bei bis
zu **50 %** der Kurse, wenn das Boot längsseits fährt. Sie wird jetzt herangezogen, bis sie frei ist
(nur gegen **Schiffe**, siehe README). Inseln, Berge, Häuser und der Trägerrumpf fehlen noch: dort
schaut man weiterhin von innen durch die Wand.

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

## Erledigt am 10.09.2026

1. **Rettungsboote liefen voll** — Gitter-Interpolation (bis 1,005 m), nicht `tOff`. `seaMeshY()`.
2. **Durchziehen bis zur Schiffsmitte** — Gleiten an der Zonengrenze. 8-m-Saum (Bugwelle).
3. **KI-Jet durch das Containerschiff** — `carrierLap` sah keine Hindernisse; eigene Prüfung
   `aiShipAhead()`, weil der Jet sonst seinen eigenen Träger als Hindernis gesehen hätte.
4. **Feuerwehrboot drang ein statt abzuprallen** — es prüfte nur seinen Mittelpunkt. `BOAT_LOOK`.
5. **Barriere lag neben dem Schiff** — Hülle kam aus der Gesamtbox mit Masten. Jetzt Rumpfband + `cx`/`cz`.
6. **Von vorne durchgefahren** — meine eigene Vorausschau machte das Ausweichen blind. Zwei Durchgänge.
7. **Schiffe schwebten in der Luft** — sie fuhren jenseits des Meeresgitters. Radien 2,4 / 2,9 km.
8. **Schatten für Boote und Astronaut** (Wunsch) — ovaler Schatten, wächst mit der Sprunghöhe.
9. **Schatten wanderte** — er lag auf fester Höhe statt auf der Welle (bis 5,59 m Differenz).
10. **Falcon flog seitwärts** — `setFromUnitVectors` ließ den Roll frei (im Mittel 45,3° gekippt).
    Jetzt `lookAt` mit definiertem Oben.

Alle Befunde stehen ausführlich im README.
