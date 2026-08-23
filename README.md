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
| Flugverkehr an/aus | LB | J |
| Modell wechseln | Y | M |
| Kamera wechseln | — | V |
| Ansicht von links/rechts (halten) | D-Pad ←→ | — |
| Hilfe/Anleitung ein/aus (pausiert das Spiel) | D-Pad ↑ | H |
| Ton an/aus | D-Pad ↓ | N |
| Reset | Start | R |

Oben rechts: **Radar** (zeigt die Richtung zum Ziel) und darunter ein **Gyroskop / künstlicher
Horizont** — sein Ring wird **grün**, wenn die Fluglage für eine sanfte Landung passt.

## ✈️ Flugzeuge & Aufgaben
Jedes Modell startet an einem passenden Ort (Hafen, Landebahn, Stadt oder Flugzeugträger).
**Das Spiel startet mit dem X-Wing**; mit **Y** bzw. **M** schaltet man durch die Modelle:

- **Canadair CL-215** (Löschflugboot) — 🔥 **Waldbrand löschen**: tief übers Wasser fliegen füllt den
  Tank, über dem Feuer **B** = Wasser ablassen.
- **Dornier Alpha-Jet** — Kunstflug-Jet (Looping/Rolle), **Überschall** bei Vollgas. **B = Schleudersitz**.
  Startet/landet auf Landebahn oder Flugzeugträger.
- **Airbus A380** — 🧍 **Menschen transportieren**: auf einer Landebahn stehen bleiben, Leute steigen
  um. Startet in einer Wolkenkratzer-Stadt.
- **Transall C-160** — 📦 **Fracht abwerfen**: auf der Bahn 4 Kisten laden, über der Ziel-Insel **B** =
  am Fallschirm abwerfen.
- **P-51 Mustang** — flotter Warbild (Kunstflug), **B = Schleudersitz**. Startet auf einem Flugzeugträger.
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

**Leitsystem**: eine weiche Pfeilkette führt zum Ziel — **rot** = leer/hinfliegen, **gelb** = beladen,
**grün** = jetzt! Ein **Radar** zeigt die Richtung immer an. Aufgaben lassen sich per **RB / T**
komplett abschalten (dann nur freies Fliegen).

**Absturz**: Wer zu langsam wird (Strömungsabriss), gegen Berg/Haus/Hafen/Trägerwand fliegt oder falsch
aufsetzt, stürzt ab — dann rückt die **Feuerwehr** an (Löschauto an Land, Boot auf dem Wasser).
Im Strömungsabriss kippt die Nase nach unten und der Flieger **fällt wirklich** (aus 300 m ist er in
7–10 s unten): kein Auftrieb, keine Ruderwirksamkeit, und der Leerlauf bremst den Sturz nicht ab.
Herauskommen geht nur mit Fahrt — Nase runter und Schub geben.

## 🌍 Ins Weltall und zum Mond (nur X-Wing)

Mit **80–100 % Schub steil steigen**: ab **3 km** wird der Himmel dunkler und die Sterne kommen, ab
**6 km** ist man im **Weltall**. Unter 80 % riegelt die Atmosphäre bei **3 km** ab — erst die volle Fahrt
trägt hinaus. Alle anderen Flugzeuge behalten ihren gewohnten Höhendeckel; **nur der X-Wing** kommt ins
Weltall, und ein **Modellwechsel bringt sofort zur Erde zurück**.

Im Weltall wird die Erde zur **Kugel** unter einem, es ist **schwerelos**, und es gibt keine Höhenangabe
mehr — dafür **Warp**: 100 % Schub sind **Warp 1**, und wer 100 % hält, rutscht immer weiter in den
**Hyperraum** bis **Warp 10**. Das ist kein Tor und kein Schalter: der Effekt blendet sich mit der
Geschwindigkeit ein, genau wie der Übergang vom Himmel ins Weltall — der leuchtende Ring erscheint
**ab Lichtgeschwindigkeit** (Warp 1). **Kurz vor jedem Himmelskörper bremst er von selbst aus dem
Hyperraum**, damit man ihn in Ruhe ansehen kann.

Der Schub ist im Weltall **linear**: 10 % sind Warp 0,1, 50 % sind Warp 0,5, 100 % ist Warp 1.

**Suchhilfe**: Über dem Flieger steht — genauso groß wie die Wassertropfen und Kisten — der Ort, das
**angeflogene Ziel mit Entfernung** (🌙 Mond, 🔴 Mars, ☀️ Sonne) und die Trefferzahl. Angezeigt wird
der Körper, auf den man **zufliegt**, nicht der nächstgelegene; das Radar zeigt die Richtung. Der Mond
liegt immer genau in der Richtung, in die man die Atmosphäre verlassen hat. Zurück auf die Erde geht es
erst **unter 2,5 km** — beim Suchen fällt man also nicht versehentlich heim.

Drei Ziele hängen dort draußen: der **Mond** (150 km), der **Mars** (400 km) und die **Sonne** (900 km).
Mars und Sonne kann man **umkreisen** — eine unsichtbare Grenze stoppt nur die Bewegung zu ihnen hin,
seitlich fliegt man weiter. Beim **Mond** geht es hinunter: unter dem X-Wing liegt dann eine **echte
Mondlandschaft** (der Giordano-Bruno-Krater), die sich endlos fortsetzt, mit **einem Sechstel der
Erdanziehung** — die Landung mit 10 % Schub ist ganz sanft, und am Himmel steht die Erde.

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

## ✈️ Flugverkehr in der Luft (Taste J / LB)
Der Himmel lebt: eine **Flotte von ~11 KI-Fliegern** reist mit dir durch die Welt und fliegt **dieselben
echten Missionen wie du** (keine bloße Deko) — **ohne Kollision mit dir**. Fliegt einer zu weit weg,
taucht in deiner Nähe ein neuer mit neuer Mission auf, so bleibt der Himmel immer belebt.

- **Canadair** pendelt **Wasser ↔ Feuer**: tankt tief über dem Meer, fliegt zu einer brennenden Insel
  und löscht. Dieses **KI-Feuer kannst du mit deiner eigenen Canadair auch selbst löschen** (Wasser
  drüber ablassen) — egal ob deine Aufgaben an sind.
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
**Kondensstreifen**. Mit **J** oder **LB** schaltet man den gesamten Verkehr an/aus (Standard: an).
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
