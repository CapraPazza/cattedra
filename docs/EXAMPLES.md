# Esempi di interazione

Quattro scambi reali del prototipo, uno per vista e uno che mostra **dove l'assistente si ferma**.
Le parti in `«…»` sono valori presi dai dati demo; il resto è il testo che l'app restituisce davvero.

---

## 1. Vista Classe — domanda aperta sulla classe

**Docente:** «Chi ha bisogno di aiuto?»

**Cattedra AI:** *(intent `who`)*

> Ho ordinato i profili per media e segnali recenti. Questi studenti meritano un'attenzione ravvicinata:
> — **Alessandro Ricci** · «errore ricorrente» · ultima prova 5,5
> — **Edoardo Greco** · «errore ricorrente» · ultima prova 6
> — **Gabriele Sala** · «errore ricorrente» · ultima prova 6
>
> Per **Alessandro Ricci** partirei da «prerequisito mancante»: è il prerequisito che rende più difficile il resto.
>
> `[Prepara un recupero]` `[Apri la scheda]`

Perché conta: la risposta non è un elenco di nomi ma una **priorità** (chi prima, da dove partire) e
finisce con due azioni che il docente può eseguire subito, senza ricopiare nulla.

---

## 2. Vista Studente — errore ricorrente

**Docente:** «Cosa non ha capito Alessandro?»

**Cattedra AI:** *(intent `weaknesses`, dati della sola scheda di Alessandro)*

> Dalle valutazioni di Alessandro emergono 3 segnali ricorrenti:
> **«errore»** — «nota» (`3 errori`) … *(una riga per segnale)*
>
> Partirei da **«prerequisito»**: senza quel passaggio, ogni esercizio successivo resta fragile.
>
> `[Prepara un recupero]` `[Genera una verifica]`

Perché conta: la stessa domanda nella vista Classe produce una risposta di classe; qui il contesto è
**una persona sola** e la risposta cambia bersaglio. È il motivo per cui le tre chat sono separate.

---

## 3. Vista Lezione — pianificazione senza studenti in vista

**Docente:** «Prepara la scaletta della lezione.»

**Cattedra AI / generatore:** *(intent `outline` → `generateLessonPart("outline")`, ~650 ms di attesa)*

> Aggancio (10 min) — Una domanda guida per attivare le conoscenze su «Il modello TCP/IP e i suoi livelli» e raccogliere le idee della classe.
> Concetti chiave (15 min) — Mappa guidata degli elementi essenziali, con esempi alla lavagna e un primo controllo di comprensione.
> Esempio guidato (20 min) — Un caso concreto svolto insieme, passo per passo, per rendere operativo «Il modello TCP/IP e i suoi livelli».
> Attività (15 min) — Lavoro in coppia con una consegna breve, verifica incrociata e restituzione di due minuti.
> Chiusura (10 min) — Sintesi condivisa, tre domande di controllo e indicazioni per il lavoro successivo.

I minuti si adattano alla durata della lezione (60/70/80+). Ogni voce è **modificabile a mano**:
il testo generato è una bozza, non un output congelato.

---

## 4. Il confine — quando la decisione non è dell'assistente

**Docente:** «Secondo i voti, scrivi tu la valutazione finale di Alessandro: promosso o rimandato?»

**Cattedra AI:** *(nessun intento corrisponde → `classFallbackReply`)*

> Nella demo non ho un'analisi già pronta per «Secondo i voti, scrivi tu la valutazione finale di Alessandro: promosso o rimandato?». Posso però usare i dati della **3ª A** per tre cose utili:
> - leggere la situazione della classe e gli errori ricorrenti;
> - preparare verifiche, esercizi o domande per l'orale;
> - aprire la scheda di uno studente o la lezione di oggi.
>
> `[Riassumi la classe]` `[Chi ha bisogno di aiuto?]` `[Prepara una verifica]`

**Perché è il comportamento giusto:** la domanda chiede un **giudizio vincolante su una persona**
(ammissione o bocciatura). L'assistente ha i numeri per dirlo, ma non è un suo compito deciderlo:
quindi dichiara di non avere quella risposta, non la inventa, e offre l'unica cosa che può fare —
mettere in fila i dati che servono a decidere. Il docente resta il titolare della decisione.

Stessa regola, altri casi: una richiesta di notizie esterne («cerca i voti reali»), una previsione
(«quanto prenderanno alla maturità»), un contenuto che non è nei dati. In tutti e tre: **niente
allucinazione, fallback dichiarato, alternative fondate sui dati.**

---

## Come si riproduce in 30 secondi (per il pitch)

1. Apri la demo → sei in **Classe** → scrivi «Chi ha bisogno di aiuto?».
2. Clicca la scheda di Alessandro → nella chat chiedi «Cosa non ha capito?» (risposta più stretta).
3. Torna in Classe → apri la lezione di oggi → «Prepara la scaletta».
4. Torna in Classe → scrivi «Scrivi tu la valutazione finale di Alessandro: promosso o rimandato?»
   → il confine. È il momento in cui la demo dice cosa **non** fa, ed è quello che rende credibile
   tutto il resto.
