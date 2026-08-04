# Flugspiel 🛩️

Ein kindgerechtes 3D-Flugspiel zum freien Fliegen, Löschen, Retten und Abwerfen — läuft komplett
**im Browser**, auf Desktop und Android. Gedacht für kleine Kinder — daher
**keine Lesetexte im Spiel, nur Symbole und Farben**.

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
| Rollen | LT / RT | Q / E |
| Schub 0–100 % | rechter Stick ↕ | W / S |
| Vollgas | — | Leertaste |
| **Boost** (halten): 100 % + extra Schub | X | Shift |
| **Bremse / Umkehrschub** (halten) | A | C |
| Aktion (modellabhängig, s.u.) | B | B |
| Aufgaben an/aus | RB | T |
| Leitfaden an/aus | LB | G |
| Modell wechseln | Y | M |
| Kamera wechseln | — | V |
| Ansicht von links/rechts (halten) | D-Pad ←→ | — |
| Hilfe/Anleitung ein/aus (pausiert das Spiel) | D-Pad ↑ | H |
| Ton an/aus | D-Pad ↓ | N |
| Reset | Start | R |

Oben rechts: **Radar** (zeigt die Richtung zum Ziel) und darunter ein **Gyroskop / künstlicher
Horizont** — sein Ring wird **grün**, wenn die Fluglage für eine sanfte Landung passt.

## ✈️ Flugzeuge & Aufgaben
Jedes Modell startet an einem passenden Ort (Hafen, Landebahn, Stadt oder Flugzeugträger):

- **Canadair CL-215** (Löschflugboot) — 🔥 **Waldbrand löschen**: tief übers Wasser fliegen füllt den
  Tank, über dem Feuer **B** = Wasser ablassen.
- **Dornier Alpha-Jet** — Kunstflug-Jet (Looping/Rolle), **Überschall** bei Vollgas. **B = Schleudersitz**.
  Startet/landet auf Landebahn oder Flugzeugträger.
- **Airbus A380** — 🧍 **Menschen transportieren**: auf einer Landebahn stehen bleiben, Leute steigen
  um. Startet in einer Wolkenkratzer-Stadt.
- **Transall C-160** — 📦 **Fracht abwerfen**: auf der Bahn 4 Kisten laden, über der Ziel-Insel **B** =
  am Fallschirm abwerfen.
- **P-51 Mustang** — flotter Warbild (Kunstflug), **B = Schleudersitz**. Startet auf einem Flugzeugträger.

**Leitsystem**: eine weiche Pfeilkette führt zum Ziel — **rot** = leer/hinfliegen, **gelb** = beladen,
**grün** = jetzt! Ein **Radar** zeigt die Richtung immer an. Aufgaben lassen sich per **RB / T**
komplett abschalten (dann nur freies Fliegen).

**Absturz**: Wer zu langsam wird (Strömungsabriss), gegen Berg/Haus/Hafen/Trägerwand fliegt oder falsch
aufsetzt, stürzt ab — dann rückt die **Feuerwehr** an (Löschauto an Land, Boot auf dem Wasser).

## ✈️ Flugverkehr in der Luft (Taste J)
Der Himmel lebt: **KI-Flieger** ziehen ortsfest ihre Bahnen (alle 5 Modelle) — **ohne Kollision**.
Airbus/Transall **landen** und laden Passagiere/Kisten, der Canadair **fischt Wasser** und **löscht**
ein Feuer, der Mustang macht **Kunstflug**. Kommt ein Flieger nah vorbei, **wackelt** er zum Gruß mit
den Flügeln. Sporadisch rauscht ein **Alpha-Jet von hinten** vorbei und durchbricht die Schallmauer.
Hohe/schnelle Flieger ziehen **Kondensstreifen**. Mit **J** schaltet man den Verkehr an/aus (Standard: an).
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

Vielen Dank für eure Kreativität und dafür, dass ihr eure Werke mit der Community teilt! ❤️

Weitere verwendete Technik:
- **[three.js](https://threejs.org)** (r128) — 3D-Rendering, inkl. GLTFLoader & DRACOLoader.
- **Motor-/Crash-Sounds** aus dem **FMS (Flug-Modell-Simulator)**, Freeware von Möller (2001).

## 🔧 Technik (kurz)
- Reines HTML + JavaScript + WebGL, keine Installation, kein Build. Alle Modelle/Sounds sind
  eingebettet (Base64) — das Spiel läuft sowohl online als auch per Doppelklick lokal.
- Endlose, ortsfeste Inselwelt (deterministisch je Rasterzelle), animiertes Meer, Flugzeugträger,
  Häfen, Wolkenkratzer-Städte.

## 📄 Lizenz
Der Spielcode ist frei nutzbar. Die 3D-Modelle unterliegen ihren jeweiligen Creative-Commons-Lizenzen
der oben genannten Sketchfab-Autorinnen und -Autoren — bei Weiterverwendung bitte deren Namensnennung
beibehalten.
