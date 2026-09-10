# TODO — Flugspiel

Offene Punkte. Erledigtes austragen, nicht abhaken lassen.
Stand: 10.09.2026, nach der dritten Runde am Meer.

---

## Offen

Nichts.

---

## Zur Kenntnis: das Nicken ist jetzt schwächer

Keine offene Aufgabe, aber es fällt beim Spielen auf und soll nicht als Fehler durchgehen.

Seit alles Schwimmende auf der **gesehenen** Wasserfläche liegt (statt auf der Wellenformel), nickt
es **rund halb so stark**: Feuerwehrboot 4,24° → **1,73°**, Schlauchboot 5,21° → **2,07°**, und der
Hub eines treibenden Boots 5,44 → **4,06 m**. Das ist rechnerisch richtig — die flachen
Gitterdreiecke *sind* weniger steil als die Welle, die sie annähern.

Wenn es zu ruhig wirkt, ist der Weg **nicht**, zur Wellenformel zurückzugehen (dann laufen die
Rettungsboote wieder voll), sondern `BOAT_BOB` und `DINGHY_BOB` anzuheben. Ausgerechnet für exakt
die alte Wirkung: `BOAT_BOB` 1 → **2,45**, `DINGHY_BOB` 1,2 → **3,01**. Nicht eingebaut, weil das
eine Geschmacksfrage ist und im Spiel entschieden werden sollte, nicht am Rechner.

---

## Was die Schiffe an Kollision noch NICHT können

Kein Fehler, aber gut zu wissen, bevor jemand darauf stößt:

- Die Hülle ist ein **Rechteck** um den Rumpf an der Wasserlinie. Ein spitzer Bug füllt dieses
  Rechteck nicht aus — an der Bugspitze sperrt es also etwas früher als der Rumpf reicht. Gemessen ist
  der Rumpf an der Wasserlinie zu 14 % (Kreuzfahrtschiff) bis 49 % (Liberty) formfüllend.
- **Überbauten** über der Wasserlinie zählen für Boote nicht: ein überhängender Kran oder eine Rah
  ragt über die Bootshülle hinaus, ohne zu blockieren. Für die **Flieger** gilt weiter die volle Höhe.
- Die Schiffe **kollidieren nicht untereinander** — sie werden nur beim Aussetzen auf Abstand gesetzt
  (`SHIP_CLEAR` = 260 m). Über drei Minuten gemessen kam das nie vor, ausgeschlossen ist es nicht.

---

## Erledigt am 10.09.2026 (dritte Runde)

5. **Barriere lag teils komplett neben dem Schiff.** Die Hülle kam aus der Gesamt-Bounding-Box (mit
   Masten, Rahen, Kränen); der Rumpf liegt darin asymmetrisch. Segler: Barriere z ±49 m, Rumpf nur
   −18,2…+34,7 → hinten 30,8 m unsichtbare Wand, vorn 14,3 m. Jetzt aus dem **Rumpfband** an der
   Wasserlinie mit Mittenversatz (`cx`/`cz`) — überall exakt 4,00 m Puffer, bei allen vier Schiffen.

6. **Von vorne fuhr man trotzdem durch — verursacht von Fix 4.** Die 8-m-Vorausschau machte das
   Ausweichen blind (12 Richtungen → nur 4 statt 8 frei), das Boot blieb stehen und wurde überfahren.
   Ausweichsuche läuft jetzt zweimal: mit Vorausschau, dann ohne (Notausgang). Aus 7 Winkeln × 4
   Schiffen: kein Durchfahren mehr, höchstens 2,53 m Kontakt am Bug.

7. **Schiffe schwebten in der Luft.** Sie wurden bis 3,5 km ausgesetzt und lebten bis 5,2 km, das
   Meeresgitter reicht aber nur 3 km (und ist quadratisch). 45,9 % aller Plätze hatten kein Wasser
   darunter. Jetzt 2,4 / 2,9 km — beides innerhalb des Gitters.

8. **Schatten für Boote und den Astronauten** (Wunsch, keine Fehlermeldung). Der alte Schatten ist ein
   Flugzeug-Umriss und war beim Boot abgeschaltet; jetzt gibt es zusätzlich einen ovalen. Beim
   Astronauten wächst er mit der Sprunghöhe — dadurch sieht man erst, wie hoch er kommt.

## Erledigt am 10.09.2026 (Runden 1 und 2)

1. **Rettungsboote liefen voll** — nicht `tOff`, sondern die Gitter-Interpolation (bis 1,005 m).
   Behoben mit `seaMeshY()`; nasse Böden 44,5 % → 0 %.
2. **Durchziehen bis zur Schiffsmitte** — Gleiten an der Zonengrenze, nicht die Sperre. 8-m-Saum.
3. **KI-Jet durch das Containerschiff** — `carrierLap` sah keine Hindernisse. Eigene Prüfung
   `aiShipAhead()`, weil der Jet sonst seinen eigenen Träger als Hindernis gesehen hätte.
4. **Feuerwehrboot drang ein statt abzuprallen** — es prüfte nur seinen Mittelpunkt (16 m langes
   Boot!). `BOAT_LOOK` = 8 m, und die Verdrängung wirft jetzt zurück statt umzulenken.

Alle Befunde stehen ausführlich im README („Schiffe auf dem Meer", „Schatten für alles, was tief
unterwegs ist", „Ins Wasser: das Schlauchboot").
