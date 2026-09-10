# TODO — Flugspiel

Offene Punkte. Erledigtes austragen, nicht abhaken lassen.
Stand: 10.09.2026 — die beiden Schlauchboot-Punkte vom 09.09. sind erledigt.

---

## Offen

Nichts.

---

## Zur Kenntnis: das Nicken ist jetzt schwächer

Keine offene Aufgabe, aber es fällt beim Spielen auf und soll nicht als Fehler durchgehen.

Seit alles Schwimmende auf der **gesehenen** Wasserfläche liegt (statt auf der Wellenformel), nickt
es **rund halb so stark**: Feuerwehrboot 4,24° → **1,73°**, Schlauchboot 5,21° → **2,07°**, und der
Hub eines treibenden Boots 5,44 → **4,06 m**. Das ist rechnerisch richtig — die flachen
Gitterdreiecke *sind* weniger steil als die Welle, die sie annähern. Vorher zeigte das Spiel eine
Neigung, die das sichtbare Wasser gar nicht hatte.

Wenn es zu ruhig wirkt, ist der Weg **nicht**, zur Wellenformel zurückzugehen (dann laufen die
Rettungsboote wieder voll), sondern `BOAT_BOB` und `DINGHY_BOB` anzuheben. Ausgerechnet für exakt
die alte Wirkung: `BOAT_BOB` 1 → **2,45**, `DINGHY_BOB` 1,2 → **3,01**. Nicht eingebaut, weil das
eine Geschmacksfrage ist und im Spiel entschieden werden sollte, nicht am Rechner.

Mehr Wellenhöhe wäre der falsche Hebel: kürzere Wellen fallen durchs 62,5-m-Raster (siehe `AMP` in
`Flugspiel.html`), mehr Segmente kosten zu viel (`updateSea` liegt bei 96 schon bei 8,3 ms von 16,7).

---

## Erledigt am 10.09.2026

1. **Rettungs-Schlauchboote liefen optisch voll Wasser.** Ursache war *nicht* der vermutete fehlende
   `tOff` — der war längst drin. Es war die **Gitter-Interpolation**: zwischen den Stützpunkten
   (62,5 m) ist das Wasser flach, die sichtbare Fläche steht im Wellenberg bis **1,005 m höher** als
   die Wellenformel. Das eigene Boot war deshalb trocken (es sitzt in der Gittermitte, wo ein
   Stützpunkt liegt), die treibenden nicht. Behoben mit `seaMeshY()`; nasse Böden 44,5 % → **0 %**.

2. **Frontal in ein Schiff zog es bis zur Schiffsmitte.** Auch hier lagen beide Verdachte daneben: die
   Sperre greift einwandfrei (0,0 m Eindringung aus allen Winkeln), und der „kürzeste Weg hinaus" ist
   **schlechter** (Eindringung 1,9 → 14,5 m). Der Grund war **Gleiten an der Zonengrenze**, während das
   Schiff darunter durchfährt: 115 s an der Wand, 25,5 m Wanderung. Behoben mit einem **8-m-Saum**, in
   dem der Rumpf schon neben sich wegdrückt: 13 s, 7,2 m, Ende bei 62 % statt 91 % der halben Länge.

Beide Befunde stehen ausführlich im README („Schiffe auf dem Meer", „Ins Wasser: das Schlauchboot").
