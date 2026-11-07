# Cattedra — assistente didattico per il docente

Un workspace che mette in un posto solo ciò che un insegnante guarda ogni giorno: la classe,
i singoli studenti, le lezioni. Tre viste, un assistente contestuale in ognuna.

**Demo:** https://caprapazza.github.io/cattedra/ · **Locale:** apri `index.html` (doppio clic).

Tutti i dati sono inventati (3 classi, 30 studenti, 20 lezioni). Nessun backend, nessuna chiave API,
nessun dato reale, nessun salvataggio: ricaricando la pagina si riparte da zero.

---

## 1. Come si esegue

| Modo | Comando |
|---|---|
| Locale, zero setup | doppio clic su `index.html` (Chrome/Edge/Firefox) |
| Locale, con server | `python -m http.server 8123` → `http://127.0.0.1:8123` |
| Deploy | push su `main` → GitHub Pages serve la radice del repo |

Nessuna installazione, nessuna build: `index.html`, `app.js`, `styles.css`, `favicon.svg` sono il
prodotto. Node non serve; `python` serve solo per il server locale.

## 2. Modelli

**Nessun modello linguistico in questa versione.** L'assistente è deterministico:

- un router di intenti (`detectIntent`, `app.js:1724`) classifica il messaggio con espressioni regolari;
- un costruttore di risposta (`buildReply` → `buildClassReply` / `buildStudentReply` / `buildLessonReply`)
  compila un template con i numeri e i testi già presenti nei dati della classe, dello studente o della lezione;
- nessuna chiamata di rete (`fetch` non compare nel codice), nessuna generazione libera.

Conseguenza dichiarata: la demo non inventa, ma non risponde nemmeno a tutto. Fuori dagli intenti
previsti restituisce un fallback onesto (vedi `docs/EXAMPLES.md`, esempio 4).

Punto di innesto per un vero modello: una sola funzione, `buildReply(kind, intent, text, ctx)` —
basta sostituire il corpo con una chiamata a un endpoint OpenAI-compatibile passando `intent` e il
contesto come prompt. L'interfaccia utente non cambia.

## 3. Librerie

**Zero dipendenze.** Niente npm, niente bundler, niente TypeScript.

| Cosa | Come |
|---|---|
| UI | HTML + template literal, JavaScript ES2020 (vanilla) |
| Stato | un oggetto in memoria (`state`), nessun `localStorage` |
| Stile | CSS puro, ~4.500 righe, custom properties + griglia |
| Icone | SVG inline generati da `icon()` |
| Font | Google Fonts via `<link>`, con fallback ai font di sistema offline |
| Export | `downloadText()` (`app.js:928`) genera `.txt` con `Blob` + `URL.createObjectURL` |

Il file più grande è `app.js` (~165 KB, 3.484 righe): dati demo + rendering + motore di risposta.

## 4. Logica custom (quello che non è "framework")

1. **Router di intenti** — `detectIntent(kind, text)`, `app.js:1724`. Tre domini (classe, studente, lezione)
   con 10-14 intenti ciascuno, ordinati: le regole più specifiche vengono prima di quelle generiche
   ("domande" non intercetta "verifica" grazie a un test negativo).
2. **Risposte come dati, non HTML sparso** — ogni intento ha una funzione che produce un frammento
   costruito sui valori correnti; i pulsanti d'azione seguono lo stesso schema (`actionButton` → `registerAction`).
3. **Normalizzazione dei dati** — `prepareLesson` (`app.js:637`) e `buildStudent` (`app.js:670`) trasformano
   i record grezzi in oggetti con campi derivati (media, trend, stato lezione) e riempiono i buchi con
   contenuti generici coerenti invece di lasciare `undefined` in pagina.
4. **Statistiche** — `computeStats` (`app.js:800`): media, distribuzione, in crescita/in calo,
   errori ricorrenti aggregati per studente, "da seguire".
5. **Generazione di materiali** — `generateLessonPart` (`app.js:3090`): scaletta, slide, didascalie e
   materiali costruiti dal topic della lezione, con stato di attesa reale (`state.generating`) e
   annuncio per screen reader. È simulata nell'attesa (650 ms), non nei contenuti: quelli sono derivati
   dal topic, non casuali.

## 5. Architettura

```
input                conoscenza                 strumenti                    decisioni                 output
─────────────────────────────────────────────────────────────────────────────────────────────────────────────
messaggio in chat    CLASSES / STUDENTS /       detectIntent() → intent      quale risposta, con       frammento HTML
+ contesto attivo    LESSONS (dati demo)        buildReply() → template      quali numeri e quale      + statistiche
(classe | studente   + stato UI (state:         computeStats()               azione proporre;          + pulsanti azione
| lezione)           classe, studente,          generateLessonPart()         fuori dagli intenti →     (copia, download,
allegati .txt/.pdf   lezione, chat, filtri)     downloadText()               fallback dichiarato       apre scheda/lezione)
```

- **Input** — il testo libero nella chat di una delle tre viste, oppure i controlli della UI
  (cambio classe, ricerca studente, apri lezione, genera parte).
- **Conoscenza** — solo i dati della demo, nessun recupero esterno; il contesto è esplicito:
  la chat di classe non vede la scheda di uno studente, la chat di lezione non vede i voti.
- **Strumenti** — router, costruttori di risposta, statistiche, generatore di lezioni, export `.txt`.
- **Decisioni** — l'intento viene scelto per primo, la risposta dopo; quando l'intento è ignoto si
  sceglie di non rispondere a caso.
- **Output** — solo UI: HTML nel pannello chat, statistiche compatte, azioni cliccabili, file `.txt` scaricabili.

Dettaglio delle interazioni: [`docs/EXAMPLES.md`](docs/EXAMPLES.md).

## 6. Limiti dichiarati (da dire nel pitch)

- Nessun login e nessuna persistenza: lo stato vive nella scheda del browser.
- La chat non è un LLM: risponde solo sugli intenti previsti (≈ 35 combinazioni vista × intento).
- Un solo oggetto per volta (una classe, uno studente, una lezione): nessun confronto tra classi.
- I materiali "generati" sono derivati dal titolo/topic della lezione, non da un modello.
- Nessun audit di accessibilità completo: navigazione da tastiera e `aria-live` sì, verifica formale no.
