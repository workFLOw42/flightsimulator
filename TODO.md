# TODO — Flugspiel

Offene Punkte. Erledigtes austragen, nicht abhaken lassen.
Stand: 09.09.2026, Commit `e5d04cd` (PWA-Cache v71).

---

## 1. Rettungs-Schlauchboot läuft optisch voll Wasser

Gemeldet 09.09.2026 abends. Betrifft **nur** die Boote, auf denen Fallschirmspringer gerettet
werden — das eigene (beim Aussteigen zu Fuß) liegt seit `DINGHY_DRAFT = 0.42` richtig.

**Wo nachsehen:** `chuteSeaRescue()`. Es setzt das Boot einmal auf `seaYAt(...) - DINGHY_DRAFT` und
zieht die Höhe danach nur noch im `if(ch.boat)`-Zweig nach. Diese Boote **treiben** nur, es läuft kein
`updateDinghy` — sie übernehmen also weder das Nicken noch einen Zeit-Offset.

**Verdacht:** der fehlende `tOff`. Alles, was auf dem sichtbaren Wasser liegen soll, muss mit
demselben Wellenstand rechnen, den `updateSea` im gleichen Bild ins Gitter schreibt (siehe `waveY`
und den `dt`-Parameter, den `stepBoat` übergibt).

**Nicht vergessen:** das *gerenderte* Wasser liegt im Wellental **bis 0,45 m höher** als `waveY` —
das Meeresgitter interpoliert linear zwischen Punkten im Abstand 62,5 m (`SEA_SIZE/SEA_SEG`), während
ein Boot den exakten Wert an seinem Mittelpunkt nimmt. Wer nur gegen `waveY` prüft, liegt zu hoch.

---

## 2. Frontal in ein Schiff gefahren zieht es bis zur Schiffsmitte

Gemeldet 09.09.2026 abends: mit dem Schlauchboot frontal in die Liberty, dann erst **in der Mitte des
Schiffes** seitlich hinausgedrängt.

Zwei Dinge stimmen nicht:

- Die **Sperre** hätte schon am Bug greifen müssen. `updateDinghy` prüft `isOpenWater(nx,nz)`, und
  `hitsSeaShip` hat 4 m Puffer — bei frontaler Anfahrt offenbar nicht wirksam.
- `pushOutOfSeaShip` schiebt **immer quer**. Bei frontalem Eintritt trägt die Fahrt weiter nach innen,
  während die Verdrängung zur Seite drückt: das Boot wandert also mit, bis es querab der Mitte ist.
  Vermutlich braucht es die Richtung mit dem *kürzesten* Weg hinaus — auch nach vorn oder hinten,
  nicht nur quer.

**Warum meine Tests das nicht fanden:** sie fuhren aus 16 Richtungen auf die Schiffs**mitte** zu und
haben genau diesen Verlauf gemessen (tiefste Eindringung 2,7 m). Ein Test, der die *Bahn* über die Zeit
prüft — wie weit kommt das Boot vom ersten Kontakt bis zur Verdrängung? — hätte es gesehen.

---

## Sonst keine Auffälligkeiten
Stand 09.09.2026 nach der Sitzung mit Schiffen, Wellen und Tiefgängen. Was in dieser Runde behoben
wurde, steht im README (Abschnitte „Schiffe auf dem Meer" und „Ins Wasser: das Schlauchboot").
