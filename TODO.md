# TODO — Flugspiel

Offene Punkte. Erledigtes austragen, nicht abhaken lassen.
Stand: 10.09.2026, nach der zweiten Runde am Meer.

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

## Erledigt am 10.09.2026 (zweite Runde)

3. **KI-Jet flog weiter durch das Containerschiff.** Die Hindernisvermeidung lief nur in 5 von 12
   fliegenden Zuständen. Vor allem fehlte die **Träger-Platzrunde**, wo ein Jet auf Deckhöhe (12 m)
   kreist und gar nichts sah. Sie durfte aber nicht einfach dazu: der Jet hätte seinen **eigenen
   Träger** als Hindernis gesehen und wäre bei jeder Landung abgestürzt (vorher nachgerechnet). Jetzt
   eigene Prüfung `aiShipAhead()`, die nur Handelsschiffe kennt und alle 30 m tastet — Erkennung ab
   300 m. Zusätzlich `toFire`, `toTarget` und `landing` ergänzt.

4. **Feuerwehrboot drang ein und wurde herausgeschoben, statt abzuprallen.** Beide Teile stimmten.
   Es prüfte nur seinen **Mittelpunkt**, obwohl es 16 m lang ist — der Bug steckte 17,9 m im Rumpf,
   bevor etwas ansprach. Jetzt 8 m Vorausschau, **auch in der Ausweichlogik** (ohne die blieben 6,7 m):
   **1,0 m**. Und die Verdrängung **lenkte** die Fahrt nur um (60 % Tempo blieb), jetzt wird der Anteil
   gegen die Wand weggenommen und zu 35 % zurückgeworfen — die Fahrt längs der Wand bleibt unberührt.

## Erledigt am 10.09.2026 (erste Runde)

1. **Rettungs-Schlauchboote liefen optisch voll Wasser.** Nicht der vermutete `tOff`, sondern die
   **Gitter-Interpolation**: die sichtbare Fläche steht im Wellenberg bis **1,005 m höher** als die
   Wellenformel. Behoben mit `seaMeshY()`; nasse Böden 44,5 % → **0 %**.

2. **Frontal in ein Schiff zog es bis zur Schiffsmitte.** Nicht die Sperre (die greift) und auch nicht
   der „kürzeste Weg hinaus" (der ist schlechter), sondern **Gleiten an der Zonengrenze**. Behoben mit
   einem **8-m-Saum**: 13 s statt 115 s an der Wand, Ende bei 62 % statt 91 % der halben Länge.

Alle Befunde stehen ausführlich im README („Schiffe auf dem Meer", „Ins Wasser: das Schlauchboot").
