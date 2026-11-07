"use strict";

/* =========================================================
   Cattedra — prototipo con dati simulati
   Vanilla JS, nessuna dipendenza oltre ai font.
   ========================================================= */

/* ---------- Utility ---------- */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const icon = (name, extraClass = "") =>
  `<svg class="icon ${extraClass}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;

const esc = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));

const fmt = (value) => Number(value).toFixed(1).replace(".", ",");
const fmtHalf = (value) => Number(value).toFixed(1).replace(".0", "").replace(".", ",");
const signed = (value) => {
  if (Math.abs(value) < 0.05) return "±0,0";
  return `${value > 0 ? "+" : "−"}${Math.abs(value).toFixed(1).replace(".", ",")}`;
};
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const roundHalf = (value) => Math.round(value * 2) / 2;
const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalize = (text = "") =>
  String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const truncate = (text, length = 70) =>
  text.length > length ? `${text.slice(0, length).trim()}…` : text;

const slugify = (text) =>
  String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "cattedra";

const initialsFor = (name) => {
  const parts = name.trim().split(/\s+/);
  return `${parts[0]?.[0] || ""}${parts[parts.length - 1]?.[0] || ""}`.toUpperCase();
};

const firstNameOf = (name) => name.split(/\s+/)[0];

const formatSize = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
};

const scoreBand = (score) => (score < 6.5 ? "low" : score < 7.5 ? "mid" : "high");
const ringClass = (score) => `score-ring is-${scoreBand(score)}`;
const trendSentence = (trend) => {
  if (trend > 0.05) return `in crescita di ${fmt(Math.abs(trend))}`;
  if (trend < -0.05) return `in calo di ${fmt(Math.abs(trend))}`;
  return "stabile nell'ultimo mese";
};

/* ---------- Dati simulati ---------- */

const CLASS_DATA = [
  {
    id: "3a",
    short: "3ª A",
    name: "3ª A · Informatica",
    subject: "Informatica",
    curriculum: "Reti e protocolli",
    room: "Lab. 2",
    year: "2026/27",
    students: [
      { name: "Alessandro Ricci", avg: 5.6, trend: -0.3 },
      { name: "Beatrice Conti", avg: 8.4, trend: 0.2 },
      { name: "Carlo Moretti", avg: 6.7, trend: 0.0 },
      { name: "Diana Ferri", avg: 9.1, trend: 0.4 },
      { name: "Edoardo Greco", avg: 5.9, trend: -0.1 },
      { name: "Francesca Lombardi", avg: 7.8, trend: 0.5 },
      { name: "Gabriele Sala", avg: 6.3, trend: -0.4 },
      { name: "Ilaria Fontana", avg: 8.0, trend: 0.1 },
      { name: "Karim El Amrani", avg: 7.2, trend: 0.3 },
      { name: "Lorenzo Bassi", avg: 6.9, trend: 0.2 },
    ],
    errorPool: [
      { label: "Subnet mask e CIDR", note: "Confonde il numero di bit di rete con il numero di host disponibili.", prereq: "conversione binaria e struttura dell'indirizzo IPv4" },
      { label: "Conversione binaria", note: "Errori nel passaggio tra notazione decimale e binaria degli ottetti.", prereq: "valori posizionali degli ottetti" },
      { label: "Indirizzi pubblici e privati", note: "Non riconosce a memoria i range riservati alle reti locali.", prereq: "classi e range IPv4" },
      { label: "Livelli TCP/IP", note: "Sovrappone i ruoli del livello trasporto e del livello rete.", prereq: "incapsulamento e unità dati" },
      { label: "Risoluzione DNS", note: "Non ricostruisce il percorso completo tra nome, resolver e indirizzo IP.", prereq: "gerarchia dei server DNS" },
      { label: "Incapsulamento", note: "Collega con difficoltà header e unità dati al livello corretto.", prereq: "modello a livelli" },
      { label: "Calcolo degli host", note: "Dimentica di sottrarre indirizzo di rete e broadcast.", prereq: "formula 2^n − 2" },
      { label: "Gateway predefinito", note: "Non distingue il ruolo del gateway da quello del DNS.", prereq: "funzioni dei dispositivi di rete" },
    ],
    errorPatterns: [
      [0, 1, 6],
      [0, 7],
      [2, 3],
      [5, 6],
      [3, 5, 4],
      [4, 3],
      [0, 2, 6],
      [1, 2],
      [4, 7],
      [0, 5],
    ],
    strengths: [
      "Buona partecipazione",
      "Ragiona per schemi",
      "Aiuta i compagni",
      "Curiosità tecnica",
      "Precisione in laboratorio",
      "Esposizione chiara",
      "Collega teoria e pratica",
      "Autonomia nel problem solving",
    ],
    assessments: [
      { title: "Verifica · Indirizzamento IP", type: "Verifica scritta", kind: "verifica", date: "4 nov", short: "indirizzamento IP" },
      { title: "Google Moduli · Ripasso reti", type: "Google Moduli", kind: "moduli", date: "29 ott", short: "ripasso reti" },
      { title: "Test · Modello TCP/IP", type: "Test", kind: "test", date: "22 ott", short: "modello TCP/IP" },
      { title: "Esame pratico · Packet Tracer", type: "Esame pratico", kind: "pratico", date: "15 ott", short: "Packet Tracer" },
      { title: "Esame teorico · Modulo reti", type: "Esame teorico", kind: "teorico", date: "8 ott", short: "modulo reti" },
    ],
    pdfs: [
      { title: "Appunti · Subnetting", kind: "pdf", date: "31 ott", meta: "PDF · 6 pagine · caricato dallo studente", detail: "Appunti manoscritti con esempi di conversione binaria e tre esercizi di subnetting svolti. Presenti due passaggi sottolineati con un punto interrogativo." },
      { title: "Mappa · Reti e livelli", kind: "pdf", date: "18 ott", meta: "PDF · 1 pagina · caricato dallo studente", detail: "Mappa concettuale del modello TCP/IP con parole chiave e collegamenti. La voce «incapsulamento» è collegata solo parzialmente." },
    ],
    content: {
      likely: [
        { q: "Che differenza c'è tra un indirizzo IP pubblico e uno privato?", level: "Comprensione", why: "Verifica se lo studente sa collocare gli indirizzi nella rete reale." },
        { q: "Perché una rete /24 può ospitare 254 host e non 256?", level: "Applicazione", why: "Fa emergere il ruolo dell'indirizzo di rete e del broadcast." },
        { q: "Cosa succede, passo per passo, quando digiti un URL e premi Invio?", level: "Collegamento", why: "Collega DNS, HTTP e incapsulamento in un unico racconto." },
        { q: "A cosa serve la subnet mask? Fai un esempio concreto.", level: "Applicazione", why: "Verifica il calcolo e la rappresentazione della maschera." },
        { q: "Perché il modello a livelli rende più semplice progettare una rete?", level: "Ragionamento", why: "Porta lo studente a motivare l'astrazione, non solo a ripeterla." },
      ],
      quiz: [
        { q: "Converti 192.168.1.10/24 in binario e indica la subnet mask.", hint: "Ricorda: 24 bit di rete, 8 bit di host." },
        { q: "Data la rete 172.16.0.0/22, quanti host utilizzabili sono disponibili?", hint: "Servono 10 bit per gli host: 2^10 − 2." },
        { q: "Descrivi il percorso di risoluzione di www.scuola.it da parte di un client.", hint: "Client → resolver → root → TLD → server autoritativo." },
        { q: "Spiega la differenza tra TCP e UDP con un esempio d'uso.", hint: "Affidabilità e controllo di flusso contro velocità." },
        { q: "Un PC ha IP 192.168.1.50/24 e gateway 192.168.2.1. Funziona? Motiva la risposta.", hint: "Il gateway deve appartenere alla stessa sottorete dell'host." },
      ],
      exercises: [
        { level: "Base", title: "Riconosci la rete", task: "Classifica questi indirizzi in pubblici e privati e indica la rete di appartenenza: 10.0.4.7, 172.20.1.9, 8.8.8.8, 192.168.1.24, 172.32.0.5.", solution: "Privati: 10.0.0.0/8, 172.16.0.0/12. 172.32.0.5 è pubblico perché fuori dal range 172.16–172.31. 8.8.8.8 è pubblico." },
        { level: "Intermedio", title: "Dividi in quattro", task: "Dividi 192.168.10.0/24 in quattro sottoreti uguali. Indica range, broadcast e numero di host utilizzabili.", solution: "Servono 2 bit: /26. Ogni sottorete ha 64 indirizzi e 62 host. I range partono da .0, .64, .128, .192." },
        { level: "Avanzato", title: "La rete della scuola", task: "Progetta l'indirizzamento per 3 laboratori e una Wi-Fi ospiti, partendo da 10.20.0.0/22. Motiva le scelte e indica i gateway.", solution: "Separare la Wi-Fi ospiti in una sottorete dedicata, documentare gateway e VLAN, lasciare spazio di crescita per ogni laboratorio." },
      ],
      map: {
        title: "Subnetting",
        nodes: [
          { title: "IPv4", note: "32 bit in quattro ottetti" },
          { title: "Maschera", note: "Separa rete e host" },
          { title: "CIDR", note: "Scorciatoia /n" },
          { title: "Host", note: "2^n − 2 disponibili" },
        ],
      },
      skills: [
        { label: "Rappresentare un indirizzo IP", value: 78 },
        { label: "Calcolare una subnet mask", value: 54 },
        { label: "Descrivere il modello TCP/IP", value: 81 },
        { label: "Diagnosticare un problema di rete", value: 63 },
        { label: "Documentare una configurazione", value: 70 },
      ],
      explain: [
        { title: "L'indirizzo è il civico", text: "Un indirizzo IP identifica un dispositivo; la rete è la via in cui si trova." },
        { title: "La maschera è il confine", text: "La subnet mask dice quali cifre dell'indirizzo appartengono al quartiere e quali al civico." },
        { title: "Il CIDR è una scorciatoia", text: "/24 significa che i primi 24 bit identificano la rete. Non è il numero di host." },
      ],
      example: {
        title: "La rete del laboratorio",
        intro: "Il laboratorio 2 ha 24 PC e deve ospitare anche le stampanti. Partiamo da 192.168.20.0/24.",
        steps: [
          "La rete usa i primi 24 bit; restano 8 bit per gli host.",
          "Possiamo indirizzare 254 dispositivi: 256 meno rete e broadcast.",
          "Se aggiungiamo un laboratorio ospiti, conviene separarlo in una sottorete dedicata.",
          "Il gateway della sottorete deve stare nello stesso range degli host.",
        ],
        close: "La scelta della maschera non è tecnica fine a sé stessa: dipende da quanti dispositivi e da come vogliamo isolarli.",
      },
    },
    lessons: [
      {
        id: "3a-l01", number: "01", title: "Cos'è una rete: nodi, collegamenti, protocolli", dateLabel: "mar 20 ott", duration: 60, status: "done", room: "Lab. 2",
        topic: "Che cos'è una rete, perché servono i protocolli e come riconoscere i componenti di una rete locale.",
      },
      {
        id: "3a-l02", number: "02", title: "Il modello TCP/IP e i suoi livelli", dateLabel: "gio 22 ott", duration: 60, status: "done", room: "Lab. 2",
        topic: "Il modello a livelli, il ruolo di ogni livello e il concetto di incapsulamento.",
      },
      {
        id: "3a-l03", number: "03", title: "Indirizzi IP e subnet mask", dateLabel: "oggi", duration: 70, status: "today", room: "Lab. 2", focus: true,
        topic: "Ripartiamo dalla rete del laboratorio per capire come un indirizzo IP identifica un dispositivo. Voglio che gli studenti sappiano leggere la notazione CIDR, calcolare il numero di host di una sottorete e scegliere una maschera adeguata.",
        outline: [
          { title: "Riprendiamo la rete del laboratorio", detail: "Una domanda alla classe: perché il PC 12 non vede la stampante? Usiamo il caso per riattivare il concetto di indirizzo.", minutes: 10 },
          { title: "IPv4: leggere quattro numeri", detail: "Struttura a 32 bit, notazione decimale, differenza tra parte di rete e parte host.", minutes: 15 },
          { title: "La subnet mask e il CIDR", detail: "Dalla maschera /24 al calcolo degli host. Due esempi alla lavagna, uno guidato e uno in coppia.", minutes: 20 },
          { title: "Attività: dividere la rete della scuola", detail: "Tre laboratori e una Wi-Fi ospiti: ogni coppia propone una suddivisione e la motiva.", minutes: 15 },
          { title: "Restituzione e domanda di uscita", detail: "Confronto delle proposte e tre domande rapide per verificare la comprensione.", minutes: 10 },
        ],
        slides: [
          { layout: "title", title: "Chi è chi sulla rete?", bullets: ["Ogni dispositivo ha un indirizzo", "Un indirizzo da solo non basta", "Oggi impariamo a leggere i numeri"], captionDraft: "Apertura: partiamo dalla rete del laboratorio e dalla domanda «perché il PC 12 non vede la stampante?»." },
          { layout: "concept", title: "IPv4 in quattro numeri", bullets: ["32 bit, quattro ottetti", "192.168.1.24", "Pubblico o privato?"], captionDraft: "Schema alla lavagna: scomponiamo un indirizzo IPv4 e separiamo parte di rete e parte host." },
          { layout: "example", title: "La subnet mask", bullets: ["Dice quali bit identificano la rete", "/24 = 255.255.255.0", "Il resto identifica gli host"], captionDraft: "Dalla notazione CIDR alla maschera decimale, con un esempio guidato." },
          { layout: "example", title: "Il trucco del 2^n", bullets: ["n = bit riservati agli host", "2^n − 2 host", "Esempio: /26 → 62 host"], captionDraft: "Formula e esempio passo per passo: perché si sottraggono rete e broadcast." },
          { layout: "activity", title: "Attività: la rete della scuola", bullets: ["3 laboratori, 1 Wi-Fi ospiti", "Dividi lo spazio /22", "Motiva le tue scelte"], captionDraft: "Consegna per il lavoro in coppia: ogni gruppo propone una suddivisione e la motiva." },
        ],
        materialDrafts: [
          { name: "Scheda · Subnetting guidato", type: "scheda", desc: "6 esercizi graduati con soluzioni." },
          { name: "Quiz di ingresso", type: "quiz", desc: "5 domande rapide sui prerequisiti." },
          { name: "Attività · La rete della scuola", type: "attivita", desc: "Consegna e griglia di valutazione." },
        ],
      },
      {
        id: "3a-l04", number: "04", title: "HTTP, DNS e i protocolli applicativi", dateLabel: "lun 9 nov", duration: 60, status: "planned", room: "Lab. 2",
        topic: "Come viaggia una richiesta HTTP, a cosa serve il DNS e quali protocolli usiamo ogni giorno senza accorgercene.",
      },
      {
        id: "3a-l05", number: "05", title: "Laboratorio: la rete della scuola in Packet Tracer", dateLabel: "mer 11 nov", duration: 90, status: "draft", room: "Lab. 2",
        topic: "Configurare la rete della scuola in Packet Tracer: indirizzamento, gateway, test di connettività e documentazione.",
      },
      {
        id: "3a-l06", number: "06", title: "Verifica di fine modulo: reti e protocolli", dateLabel: "ven 13 nov", duration: 60, status: "draft", room: "Aula 4",
        topic: "Verifica sommativa su indirizzamento, subnetting, modello TCP/IP e protocolli applicativi.",
      },
    ],
  },
  {
    id: "4b",
    short: "4ª B",
    name: "4ª B · Informatica",
    subject: "Informatica",
    curriculum: "Basi di dati",
    room: "Lab. 1",
    year: "2026/27",
    students: [
      { name: "Alice Marchetti", avg: 8.7, trend: 0.3 },
      { name: "Davide Colombo", avg: 6.2, trend: -0.5 },
      { name: "Elena Rizzo", avg: 7.4, trend: 0.1 },
      { name: "Filippo Costa", avg: 5.8, trend: -0.2 },
      { name: "Giulia Pellegrini", avg: 8.1, trend: 0.4 },
      { name: "Luca Barbieri", avg: 6.8, trend: 0.2 },
      { name: "Marta De Angelis", avg: 7.9, trend: 0.6 },
      { name: "Noemi Galli", avg: 7.1, trend: -0.1 },
      { name: "Pietro Villa", avg: 6.4, trend: 0.0 },
      { name: "Sara Testa", avg: 9.0, trend: 0.5 },
    ],
    errorPool: [
      { label: "JOIN e chiavi", note: "Perde il collegamento tra chiave primaria e chiave esterna nella query.", prereq: "ruolo delle chiavi nelle relazioni" },
      { label: "Normalizzazione", note: "Fatica a individuare le dipendenze funzionali e le forme normali.", prereq: "dipendenze funzionali e ridondanza" },
      { label: "Chiavi esterne", note: "Non verifica l'integrità referenziale prima di inserire i dati.", prereq: "vincoli del modello relazionale" },
      { label: "GROUP BY", note: "Usa HAVING al posto di WHERE e viceversa.", prereq: "aggregazione e filtri" },
      { label: "Query annidate", note: "Non isola correttamente la sottoquery dal contesto esterno.", prereq: "ordine di esecuzione di una query" },
      { label: "Modello ER", note: "Confonde associazioni uno-a-molti e molti-a-molti.", prereq: "lettura delle cardinalità" },
      { label: "Ridondanza", note: "Non riconosce le anomalie di aggiornamento dovute alla duplicazione.", prereq: "progettazione senza ridondanze" },
      { label: "Alias e leggibilità", note: "Scrive query corrette ma difficili da rileggere, con ambiguità nelle colonne.", prereq: "alias e qualificazione delle colonne" },
    ],
    errorPatterns: [
      [0, 1, 2],
      [0, 6],
      [1, 4],
      [2, 3, 0],
      [0, 3],
      [1, 5],
      [0, 6],
      [3, 4],
      [0, 1, 2],
      [0, 1],
    ],
    strengths: [
      "Lettura dello schema ER",
      "Precisione sintattica SQL",
      "Pensiero analitico",
      "Collaborazione",
      "Autonomia",
      "Attenzione ai dettagli",
      "Buona memoria visiva",
      "Aiuta i compagni",
    ],
    assessments: [
      { title: "Verifica · JOIN e relazioni", type: "Verifica scritta", kind: "verifica", date: "5 nov", short: "JOIN e relazioni" },
      { title: "Google Moduli · SQL di base", type: "Google Moduli", kind: "moduli", date: "30 ott", short: "SQL di base" },
      { title: "Test · Normalizzazione", type: "Test", kind: "test", date: "23 ott", short: "normalizzazione" },
      { title: "Esame pratico · Progettazione DB", type: "Esame pratico", kind: "pratico", date: "16 ott", short: "progettazione DB" },
      { title: "Esame teorico · Modello relazionale", type: "Esame teorico", kind: "teorico", date: "9 ott", short: "modello relazionale" },
    ],
    pdfs: [
      { title: "Schema · Database biblioteca", kind: "pdf", date: "2 nov", meta: "PDF · 2 pagine · caricato dallo studente", detail: "Schema ER della biblioteca con tabelle Libri, Utenti e Prestiti. La relazione molti-a-molti è rappresentata in modo incompleto." },
      { title: "Appunti · JOIN", kind: "pdf", date: "24 ott", meta: "PDF · 4 pagine · caricato dallo studente", detail: "Appunti con due query di esempio, INNER JOIN e LEFT JOIN. Il passaggio sulla clausola ON è cerchiato in rosso." },
    ],
    content: {
      likely: [
        { q: "Perché una chiave esterna deve rispettare l'integrità referenziale?", level: "Comprensione", why: "Verifica se lo studente comprende il vincolo, non solo la sintassi." },
        { q: "Quando una tabella è in terza forma normale? Fai un esempio.", level: "Applicazione", why: "Fa emergere il ragionamento sulle dipendenze funzionali." },
        { q: "Che differenza c'è tra INNER JOIN e LEFT JOIN?", level: "Comprensione", why: "Chiarisce cosa accade alle righe senza corrispondenza." },
        { q: "A cosa serve GROUP BY e quando usi HAVING?", level: "Applicazione", why: "Distingue il filtro sulle righe dal filtro sui gruppi." },
        { q: "Come traduci un'associazione molti-a-molti in tabelle?", level: "Progettazione", why: "Collega il modello ER alla progettazione fisica." },
      ],
      quiz: [
        { q: "Scrivi una query che elenchi gli studenti e i corsi a cui sono iscritti.", hint: "Usa la tabella ponte Iscrizioni e due JOIN." },
        { q: "Normalizza una tabella con nome studente, corso e docente fino alla 3FN.", hint: "Separa le entità e rimuovi le dipendenze transitive." },
        { q: "Spiega perché la ridondanza può causare anomalie di aggiornamento.", hint: "Pensa a cosa succede se un dato duplicato cambia in un solo punto." },
        { q: "Usa LEFT JOIN per trovare i corsi senza iscritti.", hint: "Filtra le righe in cui la chiave della tabella di destra è NULL." },
        { q: "Progetta le tabelle per i prestiti di una biblioteca, con chiavi e vincoli.", hint: "Utenti, Libri, Prestiti; una riga per prestito." },
      ],
      exercises: [
        { level: "Base", title: "Chi è la chiave?", task: "Data una tabella Iscrizioni(student_id, corso_id, data), individua la chiave primaria e le chiavi esterne.", solution: "Chiave primaria composta da student_id + corso_id; entrambe le colonne sono chiavi esterne verso Studenti e Corsi." },
        { level: "Intermedio", title: "La query del corso B", task: "Scrivi una query che mostri nome e cognome degli studenti iscritti al corso «Basi di dati».", solution: "SELECT s.nome, s.cognome FROM Studenti s JOIN Iscrizioni i ON s.id = i.student_id JOIN Corsi c ON c.id = i.corso_id WHERE c.nome = 'Basi di dati';" },
        { level: "Avanzato", title: "Corsi silenziosi", task: "Trova i corsi senza iscritti usando un LEFT JOIN e spiega perché non basta un INNER JOIN.", solution: "LEFT JOIN mantiene i corsi senza corrispondenze; WHERE i.student_id IS NULL seleziona quelli vuoti. Con INNER JOIN sparirebbero." },
      ],
      map: {
        title: "JOIN",
        nodes: [
          { title: "Tabelle", note: "Dati separati per entità" },
          { title: "Chiavi", note: "PK e FK creano il legame" },
          { title: "INNER", note: "Solo le corrispondenze" },
          { title: "LEFT", note: "Anche le righe senza match" },
        ],
      },
      skills: [
        { label: "Leggere uno schema ER", value: 82 },
        { label: "Scrivere una JOIN", value: 58 },
        { label: "Normalizzare una tabella", value: 66 },
        { label: "Interrogare con SQL", value: 74 },
        { label: "Documentare un progetto dati", value: 69 },
      ],
      explain: [
        { title: "JOIN è un incrocio", text: "Due elenchi si incontrano su un codice comune: la chiave." },
        { title: "INNER è il risultato pieno", text: "Mostra solo le righe che trovano una corrispondenza in entrambe le tabelle." },
        { title: "LEFT tiene anche i vuoti", text: "Mantiene tutte le righe di sinistra, anche quando a destra non c'è nulla." },
      ],
      example: {
        title: "Chi frequenta il corso B?",
        intro: "Abbiamo tre tabelle: Studenti, Corsi e Iscrizioni. La risposta non è in una sola tabella.",
        steps: [
          "La tabella Iscrizioni contiene le coppie studente-corso.",
          "Un JOIN con Studenti recupera nome e cognome.",
          "Un secondo JOIN con Corsi filtra per nome del corso.",
          "Il risultato va letto riga per riga: ogni riga è un'iscrizione, non uno studente.",
        ],
        close: "La query non inventa dati: ricompone una relazione che il modello aveva già descritto.",
      },
    },
    lessons: [
      {
        id: "4b-l01", number: "01", title: "Dal modello ER alle tabelle", dateLabel: "mar 20 ott", duration: 60, status: "done", room: "Lab. 1",
        topic: "Come tradurre entità, attributi e associazioni del modello ER in tabelle con chiavi.",
      },
      {
        id: "4b-l02", number: "02", title: "Chiavi primarie e integrità referenziale", dateLabel: "gio 22 ott", duration: 60, status: "done", room: "Lab. 1",
        topic: "Il ruolo delle chiavi primarie ed esterne, i vincoli e gli errori da evitare negli inserimenti.",
      },
      {
        id: "4b-l03", number: "03", title: "Normalizzazione: 1FN, 2FN, 3FN", dateLabel: "mar 27 ott", duration: 60, status: "done", room: "Aula 3",
        topic: "Riconoscere ridondanze e dipendenze funzionali, applicando le prime tre forme normali a un caso guidato.",
      },
      {
        id: "4b-l04", number: "04", title: "JOIN e relazioni tra tabelle", dateLabel: "oggi", duration: 70, status: "today", room: "Lab. 1", focus: true,
        topic: "Voglio far vedere come due tabelle diventano una risposta: partiamo dalla domanda «chi frequenta il corso B?», ripassiamo chiavi e relazioni, poi costruiamo INNER JOIN e LEFT JOIN. Chiudo con due query in coppia.",
        outline: [
          { title: "La domanda di partenza", detail: "Chi frequenta il corso B? I dati sono in tabelle diverse: come li mettiamo insieme?", minutes: 10 },
          { title: "La chiave che unisce", detail: "Ripasso di chiave primaria e chiave esterna, con lo schema alla lavagna e un errore da correggere.", minutes: 15 },
          { title: "INNER JOIN: solo ciò che corrisponde", detail: "Costruiamo insieme la query studenti-corsi e leggiamo il risultato riga per riga.", minutes: 20 },
          { title: "LEFT JOIN: anche ciò che manca", detail: "Confronto sullo stesso dataset e uso di NULL per trovare i corsi senza iscritti.", minutes: 15 },
          { title: "Query in coppia e chiusura", detail: "Due query da completare in coppia, restituzione rapida e tre domande di controllo.", minutes: 10 },
        ],
        slides: [
          { layout: "title", title: "Due tabelle, una domanda", bullets: ["Studenti e corsi", "I dati vivono in tabelle diverse", "Come li mettiamo insieme?"], captionDraft: "Apriamo con una domanda concreta: chi frequenta il corso B?" },
          { layout: "concept", title: "La chiave che unisce", bullets: ["PK identifica una riga", "FK punta a un'altra tabella", "JOIN usa questa relazione"], captionDraft: "Ripasso rapido di chiave primaria e chiave esterna, con lo schema alla lavagna." },
          { layout: "example", title: "INNER JOIN", bullets: ["Solo le righe che corrispondono", "ON collega le chiavi", "Risultato: righe complete"], captionDraft: "Scriviamo insieme la query e leggiamo il risultato riga per riga." },
          { layout: "example", title: "LEFT JOIN", bullets: ["Tutte le righe di sinistra", "NULL se manca la corrispondenza", "Utile per trovare i corsi vuoti"], captionDraft: "Confronto tra INNER e LEFT JOIN sullo stesso dataset." },
          { layout: "activity", title: "Query in coppia", bullets: ["Trovare gli iscritti al corso B", "Trovare i corsi senza iscritti", "Confrontare gli approcci"], captionDraft: "Attività in coppia con due query e restituzione finale." },
        ],
        materialDrafts: [
          { name: "Query guidate · JOIN", type: "scheda", desc: "Tre query commentate, dalla più semplice alla più articolata." },
          { name: "Dataset · Iscrizioni", type: "attivita", desc: "Tabelle pronte da caricare nel DBMS." },
          { name: "Checklist · Lettura del risultato", type: "scheda", desc: "Come verificare righe, NULL e duplicati." },
        ],
      },
      {
        id: "4b-l05", number: "05", title: "Query annidate e viste", dateLabel: "lun 9 nov", duration: 60, status: "planned", room: "Lab. 1",
        topic: "Quando una query diventa troppo complessa: sottoquery, viste e criteri per scegliere la soluzione più leggibile.",
      },
      {
        id: "4b-l06", number: "06", title: "Laboratorio: il database di una biblioteca", dateLabel: "mer 11 nov", duration: 90, status: "draft", room: "Lab. 1",
        topic: "Progettare e implementare il database di una biblioteca: modello ER, tabelle, query di prestito e documentazione finale.",
      },
    ],
  },
  {
    id: "5a",
    short: "5ª A",
    name: "5ª A · Informatica",
    subject: "Informatica",
    curriculum: "Intelligenza artificiale",
    room: "Aula 5",
    year: "2026/27",
    students: [
      { name: "Andrea Fabbri", avg: 7.6, trend: 0.2 },
      { name: "Chiara Neri", avg: 8.9, trend: 0.4 },
      { name: "Diego Santoro", avg: 6.0, trend: -0.3 },
      { name: "Emma Russo", avg: 7.8, trend: 0.5 },
      { name: "Lorenzo Parisi", avg: 6.7, trend: 0.1 },
      { name: "Matilde Bruno", avg: 8.3, trend: 0.2 },
      { name: "Riccardo Serra", avg: 5.7, trend: -0.6 },
      { name: "Sofia Mancini", avg: 7.3, trend: 0.0 },
      { name: "Tommaso Caruso", avg: 6.5, trend: -0.1 },
      { name: "Valeria Fiore", avg: 8.0, trend: 0.3 },
    ],
    errorPool: [
      { label: "Allucinazioni", note: "Non distingue una risposta plausibile da una risposta verificata.", prereq: "natura probabilistica dei modelli linguistici" },
      { label: "Bias nei dataset", note: "Riconosce il bias solo quando è esplicito, non nei dati sbilanciati.", prereq: "rappresentatività dei dati" },
      { label: "Overfitting", note: "Confonde una buona prestazione sul training set con una buona generalizzazione.", prereq: "separazione tra training e test set" },
      { label: "Metriche di valutazione", note: "Sovrappone precisione, richiamo e accuratezza.", prereq: "matrice di confusione e metriche" },
      { label: "Training e test set", note: "Non comprende perché il test set deve restare separato.", prereq: "valutazione onesta di un modello" },
      { label: "Privacy e dati", note: "Sottovaluta i rischi dei dati personali usati per addestrare i modelli.", prereq: "consenso e minimizzazione dei dati" },
      { label: "Verifica delle fonti", note: "Accetta la prima fonte trovata senza controllarne autorevolezza.", prereq: "ricerca e valutazione delle fonti" },
      { label: "Responsabilità", note: "Fa fatica ad attribuire responsabilità tra progettista, utente e organizzazione.", prereq: "governance degli strumenti AI" },
    ],
    errorPatterns: [
      [0, 1],
      [0, 4],
      [0, 3, 6],
      [2, 4],
      [1, 2],
      [0, 6],
      [0, 1, 3],
      [0, 2],
      [1, 6],
      [0, 5],
    ],
    strengths: [
      "Pensiero critico",
      "Buona esposizione",
      "Sensibilità etica",
      "Collega casi reali",
      "Curiosità",
      "Lavoro di gruppo",
      "Capacità di argomentare",
      "Attenzione alle fonti",
    ],
    assessments: [
      { title: "Verifica · Bias e dataset", type: "Verifica scritta", kind: "verifica", date: "6 nov", short: "bias e dataset" },
      { title: "Google Moduli · Metriche AI", type: "Google Moduli", kind: "moduli", date: "31 ott", short: "metriche AI" },
      { title: "Test · Reti neurali", type: "Test", kind: "test", date: "24 ott", short: "reti neurali" },
      { title: "Esame pratico · Valutazione chatbot", type: "Esame pratico", kind: "pratico", date: "17 ott", short: "valutazione chatbot" },
      { title: "Esame teorico · Etica dell'AI", type: "Esame teorico", kind: "teorico", date: "10 ott", short: "etica dell'AI" },
    ],
    pdfs: [
      { title: "Dossier · Casi di bias", kind: "pdf", date: "3 nov", meta: "PDF · 5 pagine · caricato dallo studente", detail: "Raccolta di tre casi di bias nei dataset, con sintesi personale. Il secondo caso confonde bias dei dati e bias delle metriche." },
      { title: "Appunti · Valutare un modello", kind: "pdf", date: "25 ott", meta: "PDF · 3 pagine · caricato dallo studente", detail: "Appunti su precisione, richiamo e accuratezza con due esempi. La definizione di richiamo è incompleta." },
    ],
    content: {
      likely: [
        { q: "Che cos'è un'allucinazione di un modello linguistico?", level: "Comprensione", why: "Distingue un errore plausibile da una risposta verificata." },
        { q: "Da dove nasce un bias in un dataset?", level: "Ragionamento", why: "Porta a ragionare su rappresentatività e scelte di raccolta dati." },
        { q: "Perché separiamo training set e test set?", level: "Comprensione", why: "Verifica la logica della valutazione onesta." },
        { q: "Cosa misura la precisione e cosa il richiamo?", level: "Applicazione", why: "Fa emergere la differenza tra falsi positivi e falsi negativi." },
        { q: "Chi è responsabile quando un'AI prende una decisione sbagliata?", level: "Ragionamento", why: "Collega competenza tecnica, uso e governance." },
      ],
      quiz: [
        { q: "Distingui bias nei dati e bias nelle metriche con un esempio.", hint: "Pensa a un dataset non rappresentativo e a una metrica scelta male." },
        { q: "Un chatbot inventa una fonte: descrivi tre passi per verificarla.", hint: "Ferma la risposta, cerca la fonte primaria, confronta più fonti." },
        { q: "Spiega l'overfitting e come lo riconosci.", hint: "Ottimi risultati sul training, scarsi sul test." },
        { q: "Progetta un test per valutare un chatbot di supporto scolastico.", hint: "Definisci casi, criteri, campione e revisione umana." },
        { q: "Discuti un caso etico di uso dell'AI nella valutazione.", hint: "Considera trasparenza, appello e responsabilità." },
      ],
      exercises: [
        { level: "Base", title: "Classifica il rischio", task: "Per ciascun caso indica se parliamo di bias, allucinazione o overfitting: un chatbot cita un libro inesistente; un modello è ottimo solo sui dati di training; un dataset contiene solo volti maschili.", solution: "Allucinazione, overfitting, bias nei dati." },
        { level: "Intermedio", title: "Protocollo di verifica", task: "Scrivi un protocollo in 4 passi per verificare una risposta AI che contiene dati e citazioni.", solution: "Fermare la risposta, cercare la fonte primaria, confrontare almeno due fonti, annotare cosa non è verificabile." },
        { level: "Avanzato", title: "Valutare un chatbot", task: "Progetta una griglia di valutazione con 4 criteri e un test set di 10 casi per un chatbot scolastico.", solution: "Criteri: correttezza, pertinenza, trasparenza, sicurezza. Test set con casi tipici, limite e ambigui; revisione umana." },
      ],
      map: {
        title: "AI responsabile",
        nodes: [
          { title: "Dataset", note: "Rappresentativo e consapevole" },
          { title: "Modello", note: "Probabilistico, non infallibile" },
          { title: "Verifica", note: "Fonti e revisione umana" },
          { title: "Responsabilità", note: "Chi decide e chi usa" },
        ],
      },
      skills: [
        { label: "Riconoscere un bias", value: 69 },
        { label: "Verificare una fonte", value: 61 },
        { label: "Valutare un modello", value: 52 },
        { label: "Ragionare sull'etica", value: 76 },
        { label: "Progettare un test", value: 57 },
      ],
      explain: [
        { title: "Il modello prevede, non consulta", text: "Un modello linguistico genera la parola più probabile: non apre una fonte e non controlla se esiste." },
        { title: "Il bias è una scelta nei dati", text: "Se il dataset racconta solo una parte del mondo, il modello imparerà quella parte come se fosse tutto." },
        { title: "La verifica è un passaggio umano", text: "Fermare, cercare la fonte primaria e confrontare: sono azioni di chi usa l'AI, non del modello." },
      ],
      example: {
        title: "La citazione che non esiste",
        intro: "Un chatbot risponde con una frase attribuita a una ricercatrice, completa di titolo e anno. La classe deve decidere se fidarsi.",
        steps: [
          "Cerchiamo il titolo nel catalogo della biblioteca e nel motore di ricerca: non esiste.",
          "Controlliamo il sito dell'autrice: nessuna pubblicazione con quel titolo.",
          "Proviamo a risalire alla fonte della citazione: nessun documento primario.",
          "Conclusione: la risposta è plausibile ma non verificata; va segnalata, non usata.",
        ],
        close: "La plausibilità non è una prova. Il protocollo di verifica vale soprattutto quando la risposta sembra perfetta.",
      },
    },
    lessons: [
      {
        id: "5a-l01", number: "01", title: "Che cos'è l'intelligenza artificiale", dateLabel: "mer 21 ott", duration: 60, status: "done", room: "Aula 5",
        topic: "Dalle definizioni alla pratica: che cosa fa un sistema AI, cosa non fa e perché ci riguarda.",
      },
      {
        id: "5a-l02", number: "02", title: "Dati, training e modelli", dateLabel: "ven 23 ott", duration: 60, status: "done", room: "Aula 5",
        topic: "Come un modello impara dai dati, cosa significa addestrare e perché la qualità del dataset conta.",
      },
      {
        id: "5a-l03", number: "03", title: "Reti neurali in parole semplici", dateLabel: "mer 28 ott", duration: 60, status: "done", room: "Aula 5",
        topic: "Una spiegazione intuitiva di neuroni artificiali, strati e apprendimento, senza formule.",
      },
      {
        id: "5a-l04", number: "04", title: "Metriche: precisione, richiamo, accuratezza", dateLabel: "ven 30 ott", duration: 60, status: "done", room: "Aula 5",
        topic: "Differenza tra le metriche, falsi positivi e falsi negativi, e scelta della metrica giusta.",
      },
      {
        id: "5a-l05", number: "05", title: "Etica e bias nei dataset", dateLabel: "mar 3 nov", duration: 60, status: "done", room: "Aula 5",
        topic: "Riconoscere i bias nei dati e nelle decisioni, con casi reali e domande di responsabilità.",
      },
      {
        id: "5a-l06", number: "06", title: "Allucinazioni e verifica delle fonti", dateLabel: "oggi", duration: 70, status: "today", room: "Aula 5", focus: true,
        topic: "Affrontiamo le allucinazioni dei modelli AI partendo da un caso concreto. Obiettivo: riconoscere una risposta non verificata, applicare un protocollo di fact-checking e discutere la responsabilità di chi usa l'AI.",
        outline: [
          { title: "Un caso che sembra vero", detail: "Leggiamo una risposta con una citazione inventata. Cosa ci insospettisce? Cosa accettiamo troppo in fretta?", minutes: 10 },
          { title: "Perché l'AI inventa", detail: "Il modello prevede parole probabili, non consulta fatti. Dati mancanti e ambiguità aumentano il rischio.", minutes: 15 },
          { title: "Bias nei dati, bias nelle risposte", detail: "Colleghiamo il caso alla lezione precedente: un dataset sbilanciato produce risposte sbilanciate.", minutes: 15 },
          { title: "Il protocollo di verifica", detail: "Tre passi operativi: ferma la risposta, cerca la fonte primaria, confronta almeno due fonti.", minutes: 15 },
          { title: "Fact-checking in coppia e chiusura", detail: "Ogni coppia verifica una risposta sospetta e presenta l'esito in un minuto. Chiusura sulle responsabilità.", minutes: 15 },
        ],
        slides: [
          { layout: "title", title: "Quando l'AI inventa", bullets: ["Sembra sicura, ma sbaglia", "Cita fonti che non esistono", "Il problema non è l'errore: è la fiducia"], captionDraft: "Apriamo con un esempio di risposta inventata e chiediamo alla classe cosa insospettisce." },
          { layout: "concept", title: "Perché succede", bullets: ["Il modello prevede parole, non verifica fatti", "Dati mancanti o ambigui", "Nessuna coscienza dell'errore"], captionDraft: "Spiegazione del meccanismo: probabilità linguistica, non consultazione di una fonte." },
          { layout: "example", title: "Un caso reale", bullets: ["Citazione inventata", "Verifica della fonte", "Cosa avremmo dovuto fare"], captionDraft: "Analisi guidata di un caso: dalla risposta alla fonte primaria." },
          { layout: "concept", title: "Il protocollo di verifica", bullets: ["Ferma la risposta", "Cerca la fonte primaria", "Confronta almeno due fonti"], captionDraft: "Tre passi operativi da applicare a ogni risposta che contiene dati o citazioni." },
          { layout: "activity", title: "Fact-checking in coppia", bullets: ["Scegli una risposta sospetta", "Verifica in 10 minuti", "Presenta l'esito"], captionDraft: "Consegna dell'attività e criteri per la restituzione." },
        ],
        materialDrafts: [
          { name: "Caso di studio · La fonte inventata", type: "attivita", desc: "Testo della risposta, fonti da verificare e griglia di analisi." },
          { name: "Checklist · Verifica in 3 passi", type: "scheda", desc: "Un promemoria operativo per ogni risposta AI." },
          { name: "Griglia · Dibattito etico", type: "scheda", desc: "Domande guida e criteri per la discussione." },
        ],
      },
      {
        id: "5a-l07", number: "07", title: "Laboratorio: valutare un chatbot", dateLabel: "lun 9 nov", duration: 90, status: "planned", room: "Lab. 1",
        topic: "Costruire un test set e valutare un chatbot con criteri espliciti, distinguendo correttezza, pertinenza e sicurezza.",
      },
      {
        id: "5a-l08", number: "08", title: "Dibattito: regole per un'AI responsabile", dateLabel: "mer 11 nov", duration: 60, status: "draft", room: "Aula 5",
        topic: "Un dibattito strutturato sulle regole d'uso dell'AI a scuola: trasparenza, responsabilità e diritto alla spiegazione.",
      },
    ],
  },
];

/* ---------- Generatori di contenuto ---------- */

function isPlaceholderTitle(title) {
  const normalized = normalize(title || "");
  return !normalized || normalized === "nuova lezione" || normalized === "senza titolo";
}

function genericOutline(title, duration = 60) {
  const plan = duration >= 80 ? [15, 20, 25, 15, 10] : duration >= 70 ? [10, 15, 20, 15, 10] : [10, 15, 15, 10, 10];
  const titleRef = isPlaceholderTitle(title) ? "il concetto centrale" : `«${title}»`;
  const openingRef = isPlaceholderTitle(title) ? "e raccogliere le idee della classe" : `su «${title}» e raccogliere le idee della classe`;
  return [
    { title: "Aggancio", detail: `Una domanda guida per attivare le conoscenze ${openingRef}.`, minutes: plan[0] },
    { title: "Concetti chiave", detail: "Mappa guidata degli elementi essenziali, con esempi alla lavagna e un primo controllo di comprensione.", minutes: plan[1] },
    { title: "Esempio guidato", detail: `Un caso concreto svolto insieme, passo per passo, per rendere operativo ${titleRef}.`, minutes: plan[2] },
    { title: "Attività", detail: "Lavoro in coppia con una consegna breve, verifica incrociata e restituzione di due minuti.", minutes: plan[3] },
    { title: "Chiusura", detail: "Sintesi condivisa, tre domande di controllo e indicazioni per il lavoro successivo.", minutes: plan[4] },
  ];
}

function genericSlides(title) {
  const displayTitle = isPlaceholderTitle(title) ? "La lezione di oggi" : title;
  return [
    {
      layout: "title",
      title: displayTitle,
      bullets: ["La domanda di partenza", "Perché ci riguarda", "Dove vogliamo arrivare"],
      captionDraft: `Apertura della lezione: una domanda concreta per attivare la classe.`,
    },
    {
      layout: "concept",
      title: "I concetti essenziali",
      bullets: ["Definizione", "Elementi principali", "Un esempio vicino"],
      captionDraft: "Mappa dei concetti da tenere a mente, con un esempio del contesto quotidiano.",
    },
    {
      layout: "example",
      title: "Un caso concreto",
      bullets: ["La situazione", "Cosa osserviamo", "Cosa concludiamo"],
      captionDraft: "Esempio guidato per collegare la teoria alla pratica, passo per passo.",
    },
    {
      layout: "activity",
      title: "Attività in coppia",
      bullets: ["Consegna", "Dieci minuti", "Restituzione"],
      captionDraft: "Consegna dell'attività e criteri per la restituzione finale.",
    },
  ];
}

function genericMaterials(title) {
  return [
    { name: isPlaceholderTitle(title) ? "Scheda di lavoro" : `Scheda · ${truncate(title, 38)}`, type: "scheda", desc: "Esercizi graduati e punti di attenzione." },
    { name: "Quiz di verifica", type: "quiz", desc: "Cinque domande rapide con soluzioni." },
  ];
}

function genericCaption(slide) {
  return `Didascalia della slide «${slide.title}»: accompagna il contenuto con una frase chiave e un esempio.`;
}

function prepareLesson(raw, cls) {
  const lesson = {
    ...raw,
    classId: cls.id,
    outline: raw.outline ? raw.outline.map((step) => ({ ...step })) : [],
    slides: raw.slides ? raw.slides.map((slide) => ({ ...slide, bullets: slide.bullets ? [...slide.bullets] : [] })) : [],
    materials: raw.materials ? raw.materials.map((material) => ({ ...material })) : [],
    objectives: raw.objectives ? [...raw.objectives] : [],
  };

  if (lesson.status === "done") {
    if (!lesson.outline.length) lesson.outline = genericOutline(lesson.title, lesson.duration);
    if (!lesson.slides.length) lesson.slides = genericSlides(lesson.title);
    lesson.slides.forEach((slide) => {
      if (!slide.caption) slide.caption = slide.captionDraft || genericCaption(slide);
    });
    if (!lesson.materials.length) lesson.materials = genericMaterials(lesson.title);
  } else if (lesson.status === "planned") {
    if (!lesson.outline.length) lesson.outline = genericOutline(lesson.title, lesson.duration);
    lesson.slides = lesson.slides || [];
    lesson.materials = lesson.materials || [];
  } else if (lesson.status === "today") {
    lesson.materials = [];
    lesson.slides = lesson.slides.map((slide) => ({ ...slide, caption: "" }));
  } else {
    lesson.outline = lesson.outline || [];
    lesson.slides = lesson.slides || [];
    lesson.materials = lesson.materials || [];
  }

  return lesson;
}

function buildStudent(cls, raw, index) {
  const avg = raw.avg;
  const trend = raw.trend;
  const firstName = firstNameOf(raw.name);
  const patterns = cls.errorPatterns[index] || [0, 1];
  const errorBase = avg < 6.5 ? 3 : 2;
  const errors = patterns.map((errorIndex, position) => {
    const error = cls.errorPool[errorIndex % cls.errorPool.length];
    const occurrences = Math.max(1, errorBase - position);
    return {
      ...error,
      count: occurrences,
      source: `${occurrences} ${occurrences === 1 ? "errore" : "errori"} in ${occurrences >= 3 ? "2 verifiche" : "1 verifica"}`,
    };
  });

  const scores = [
    roundHalf(avg + ((index % 3) - 1) * 0.2),
    roundHalf(avg - 0.3 + (index % 2) * 0.5),
    roundHalf(avg + 0.4 - (index % 3) * 0.3),
    roundHalf(avg - 0.6 + (index % 4) * 0.2),
    roundHalf(avg + 0.1 - (index % 2) * 0.4),
  ].map((score) => clamp(score, 3, 10));

  const gradeDocs = cls.assessments.map((assessment, gradeIndex) => {
    const score = scores[gradeIndex];
    const isWritten = assessment.kind === "verifica" || assessment.kind === "test";
    const correct = clamp(Math.round((score / 10) * (isWritten ? 10 : 16)), 2, isWritten ? 10 : 16);
    const total = isWritten ? 10 : 16;
    let detail = "";
    if (assessment.kind === "verifica") {
      detail = `Prova scritta di 10 domande. ${correct} risposte corrette su ${total}. La parte più critica è stata ${errors[0].label.toLowerCase()}.`;
    } else if (assessment.kind === "moduli") {
      detail = `Modulo completato in ${14 + (index % 8)} minuti. ${correct} risposte corrette su ${total}. Le domande segnalate riguardano ${errors[0].label.toLowerCase()}.`;
    } else if (assessment.kind === "test") {
      detail = `Test a risposta multipla con ${total} domande. Risposte corrette: ${correct}/${total}.`;
    } else if (assessment.kind === "pratico") {
      detail = `Prova di laboratorio valutata su indirizzamento, test di connettività e documentazione. Punteggio complessivo: ${fmtHalf(score)}/10.`;
    } else {
      detail = `Colloquio strutturato in tre domande. Punteggio complessivo: ${fmtHalf(score)}/10. La discussione ha toccato ${errors[0].label.toLowerCase()}.`;
    }
    const comment = score >= 8
      ? "Padronanza solida. Può essere coinvolto come tutor in un lavoro di coppia."
      : score >= 6
        ? "Base corretta. Serve ancora pratica guidata per rendere il passaggio più sicuro."
        : "Concetto da riprendere con un esempio guidato prima della prossima verifica.";
    return {
      id: `${cls.id}-s${index + 1}-g${gradeIndex}`,
      title: assessment.title,
      kind: assessment.kind,
      typeLabel: assessment.type,
      date: assessment.date,
      meta: `${assessment.type} · ${assessment.date}`,
      score,
      detail,
      comment,
    };
  });

  const pdfDocs = cls.pdfs.map((pdf, pdfIndex) => ({
    id: `${cls.id}-s${index + 1}-pdf${pdfIndex}`,
    title: pdf.title,
    kind: "pdf",
    typeLabel: "PDF",
    date: pdf.date,
    meta: pdf.meta,
    score: null,
    detail: pdf.detail,
    comment: null,
  }));

  const docs = [
    gradeDocs[0],
    pdfDocs[0],
    gradeDocs[1],
    gradeDocs[2],
    pdfDocs[1],
    gradeDocs[3],
    gradeDocs[4],
  ];

  const strengthStart = index % cls.strengths.length;
  const strengths = [
    cls.strengths[strengthStart],
    cls.strengths[(strengthStart + 3) % cls.strengths.length],
  ];

  const status = avg < 6.5
    ? { label: "Da seguire", tone: "low" }
    : trend >= 0.25
      ? { label: "In crescita", tone: "grow" }
      : { label: "Stabile", tone: "steady" };

  const topError = errors[0];
  const insight = avg < 6.5
    ? `${firstName} ha una media di ${fmt(avg)}, ${trendSentence(trend)}. Le ultime prove mostrano una difficoltà ricorrente su «${topError.label}». Il punto di partenza più utile è ${topError.prereq}.`
    : avg >= 8
      ? `${firstName} ha una media solida (${fmt(avg)}) e mostra ${strengths[0].toLowerCase()}. Può consolidare «${topError.label}» con un'attività di peer tutoring.`
      : `${firstName} è a ${fmt(avg)}, con un profilo ${trend >= 0.25 ? "in crescita" : "regolare"}. ${strengths[0]} è un punto forte; conviene consolidare «${topError.label}».`;

  const note = avg < 6.5
    ? `Ha seguito il recupero del 28 ottobre. Serve ancora pratica guidata su ${topError.label.toLowerCase()}; meglio lavorare in coppia e con esempi brevi.`
    : status.tone === "grow"
      ? `Partecipa con continuità e sta crescendo. Può guidare il lavoro di coppia valorizzando ${strengths[0].toLowerCase()}.`
      : `Profilo regolare. Utile un'attività di consolidamento su ${topError.label.toLowerCase()}, senza aumentare il carico.`;

  return {
    ...raw,
    id: `${cls.id}-s${index + 1}`,
    index,
    classId: cls.id,
    classShort: cls.short,
    firstName,
    initials: initialsFor(raw.name),
    avatarTone: index % 4,
    scores,
    lastScore: scores[0],
    lastAssessment: cls.assessments[0],
    errors,
    strengths,
    docs,
    assessmentsCount: cls.assessments.length,
    pdfCount: cls.pdfs.length,
    status,
    insight,
    note,
    lastActivity: docs[0].date,
  };
}

function computeStats(students) {
  const avg = mean(students.map((student) => student.avg));
  const follow = [...students].filter((student) => student.avg < 6.5).sort((a, b) => a.avg - b.avg);
  const growing = students.filter((student) => student.trend >= 0.25);
  const declining = students.filter((student) => student.trend <= -0.2);
  const errorMap = new Map();

  students.forEach((student) => {
    student.errors.forEach((error) => {
      if (!errorMap.has(error.label)) {
        errorMap.set(error.label, {
          label: error.label,
          note: error.note,
          prereq: error.prereq,
          students: [],
        });
      }
      const entry = errorMap.get(error.label);
      if (!entry.students.includes(student.name)) entry.students.push(student.name);
    });
  });

  const topErrors = Array.from(errorMap.values()).sort((a, b) => b.students.length - a.students.length);
  const distribution = [...students]
    .sort((a, b) => a.avg - b.avg)
    .map((student) => ({ name: student.name, avg: student.avg, band: scoreBand(student.avg) }));

  return {
    avg,
    follow,
    growing,
    declining,
    topErrors,
    distribution,
    bands: {
      high: students.filter((student) => student.avg >= 7.5).length,
      mid: students.filter((student) => student.avg >= 6.5 && student.avg < 7.5).length,
      low: students.filter((student) => student.avg < 6.5).length,
    },
  };
}

const CLASSES = CLASS_DATA.map((raw) => {
  const students = raw.students.map((student, index) => buildStudent(raw, student, index));
  const stats = computeStats(students);
  const lessons = raw.lessons.map((lesson) => prepareLesson(lesson, raw));
  return { ...raw, students, stats, lessons };
});

/* ---------- Stato ---------- */

const state = {
  tab: "classe",
  classId: CLASSES[0].id,
  studentId: null,
  lessonId: null,
  search: "",
  chats: new Map(),
  busy: new Set(),
  attachments: new Map(),
  generating: null,
  slideDialog: null,
};

const chatEls = {};
const actionRegistry = new Map();
let actionCounter = 0;
let saveNoteTimer = null;

const currentClass = () => CLASSES.find((cls) => cls.id === state.classId) || CLASSES[0];
const currentStudent = () => {
  const cls = currentClass();
  return cls.students.find((student) => student.id === state.studentId) || cls.students[0];
};
const currentLesson = () => {
  const cls = currentClass();
  return cls.lessons.find((lesson) => lesson.id === state.lessonId) || cls.lessons[0];
};

const defaultStudentId = (cls) => {
  const sorted = [...cls.students].sort((a, b) => a.avg - b.avg);
  return sorted[0]?.id || null;
};

const defaultLessonId = (cls) => {
  const today = cls.lessons.find((lesson) => lesson.status === "today");
  if (today) return today.id;
  const next = cls.lessons.find((lesson) => lesson.status === "planned" || lesson.status === "draft");
  return (next || cls.lessons[0])?.id || null;
};

state.studentId = defaultStudentId(currentClass());
state.lessonId = defaultLessonId(currentClass());

/* ---------- Registry azioni chat ---------- */

function registerAction(payload) {
  const id = `act-${++actionCounter}`;
  actionRegistry.set(id, payload);
  return id;
}

function actionButton(label, iconName, payload) {
  const id = registerAction(payload);
  return `<button type="button" class="chat-action" data-action-id="${id}">${icon(iconName)}<span>${esc(label)}</span></button>`;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copiato negli appunti");
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
      showToast("Copiato negli appunti");
    } catch {
      showToast("Non riesco a copiare: seleziona il testo manualmente.");
    }
    area.remove();
  }
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function showToast(message) {
  const region = $("#toast-region");
  if (!region) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `${icon("check")}<span>${esc(message)}</span>`;
  region.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("is-leaving");
    setTimeout(() => toast.remove(), 220);
  }, 3200);
}

function announce(message) {
  const region = $("#sr-status");
  if (!region) return;
  region.textContent = "";
  setTimeout(() => {
    region.textContent = message;
  }, 60);
}

/* ---------- Testi scaricabili ---------- */

function conceptMapText(map) {
  return `${map.title}\n${map.nodes.map((node) => `- ${node.title}: ${node.note}`).join("\n")}`;
}

function classQuizText(cls) {
  return [
    `VERIFICA · ${cls.name}`,
    `Argomento: ${cls.curriculum}`,
    "",
    ...cls.content.quiz.map((question, index) => `${index + 1}. ${question.q}\n   Suggerimento: ${question.hint}`),
  ].join("\n");
}

function classQuestionsText(cls) {
  return [
    `DOMANDE PROBABILI · ${cls.name}`,
    `Argomento: ${cls.curriculum}`,
    "",
    ...cls.content.likely.map((question, index) => `${index + 1}. ${question.q}\n   ${question.level} · ${question.why}`),
  ].join("\n");
}

function classExercisesText(cls) {
  return [
    `ESERCIZI · ${cls.name}`,
    `Argomento: ${cls.curriculum}`,
    "",
    ...cls.content.exercises.map((exercise, index) => `${index + 1}. [${exercise.level}] ${exercise.title}\n   ${exercise.task}\n   Soluzione: ${exercise.solution}`),
  ].join("\n");
}

function classSummaryText(cls) {
  const stats = cls.stats;
  const top = stats.topErrors[0];
  return [
    `SINTESI · ${cls.name}`,
    `Media: ${fmt(stats.avg)}/10`,
    `Studenti da seguire: ${stats.follow.length}`,
    `In crescita: ${stats.growing.length}`,
    `In calo: ${stats.declining.length}`,
    "",
    `Errore più frequente: ${top.label} (${top.students.length} studenti)`,
    top.note,
  ].join("\n");
}

function studentSheetText(student, cls) {
  return [
    `SCHEDA STUDENTE · ${student.name}`,
    `${cls.name} · ${cls.subject}`,
    `Media: ${fmt(student.avg)}/10 (${signed(student.trend)} nell'ultimo mese)`,
    `Stato: ${student.status.label}`,
    `Ultima attività: ${student.lastActivity}`,
    "",
    "LETTURA DELL'AI",
    student.insight,
    "",
    "ERRORI RICORRENTI",
    ...student.errors.map((error) => `- ${error.label}: ${error.note} (${error.source})`),
    "",
    "PUNTI DI FORZA",
    ...student.strengths.map((strength) => `- ${strength}`),
    "",
    "VALUTAZIONI E MATERIALI",
    ...student.docs.map((doc) => `- ${doc.title} · ${doc.date}${doc.score !== null ? ` · ${fmtHalf(doc.score)}/10` : ""}`),
    "",
    "NOTA DEL DOCENTE",
    student.note,
  ].join("\n");
}

function studentPlanText(student, cls) {
  const plan = recoverySteps(student);
  return [
    `${student.avg < 6.5 ? "PIANO DI RECUPERO" : student.avg >= 8 ? "APPROFONDIMENTO" : "PIANO DI CONSOLIDAMENTO"} · ${student.name}`,
    `${cls.name} · ${cls.subject}`,
    "",
    `Media attuale: ${fmt(student.avg)}/10`,
    `Focus: ${student.errors[0].label}`,
    "",
    ...plan.map((step, index) => `${index + 1}. ${step.title} (${step.minutes} min)\n   ${step.detail}`),
    "",
    "Materiali consigliati",
    "- Scheda guidata con esempi svolti",
    "- Due esercizi di pratica autonoma",
    "- Una verifica formativa breve",
  ].join("\n");
}

function recoverySteps(student) {
  if (student.avg >= 8) {
    return [
      { title: "Un caso più complesso", minutes: 15, detail: `Proponi un problema aperto su ${student.errors[0].label.toLowerCase()} e chiedi di motivare le scelte.` },
      { title: "Peer tutoring", minutes: 20, detail: `Chiedi a ${student.firstName} di spiegare il passaggio a un compagno, preparando un esempio in tre minuti.` },
      { title: "Restituzione", minutes: 10, detail: "Raccogli l'esempio e usalo come modello per il gruppo, con una nota di miglioramento." },
    ];
  }
  return [
    { title: "Riparto dai prerequisiti", minutes: 15, detail: `Riprendi ${student.errors[0].prereq} con un esempio breve e una domanda di controllo.` },
    { title: "Pratica guidata", minutes: 25, detail: `Due esercizi su ${student.errors[0].label.toLowerCase()}, il primo svolto insieme e il secondo in autonomia.` },
    { title: "Verifica formativa", minutes: 10, detail: "Un esercizio nuovo, corretto insieme, con una scala di autovalutazione in tre punti." },
  ];
}

function lessonMarkdown(lesson, cls) {
  const outline = lesson.outline.length
    ? lesson.outline.map((step, index) => `${index + 1}. ${step.title} (${step.minutes} min)\n   ${step.detail}`).join("\n\n")
    : "Scaletta non ancora generata.";
  const slides = lesson.slides.length
    ? lesson.slides.map((slide, index) => `Slide ${index + 1} · ${slide.title}\n${slide.bullets.map((bullet) => `- ${bullet}`).join("\n")}\nDidascalia: ${slide.caption || "da scrivere"}`).join("\n\n")
    : "Slide non ancora generate.";
  const materials = lesson.materials.length
    ? lesson.materials.map((material) => `- ${material.name} (${material.type}) · ${material.desc}`).join("\n")
    : "Materiali non ancora generati.";
  return [
    `LEZIONE ${lesson.number} · ${lesson.title}`,
    `${cls.name} · ${cls.curriculum}`,
    `${lesson.dateLabel} · ${lesson.duration} minuti · ${lesson.room}`,
    "",
    "COSA VUOGLIO SPIEGARE",
    lesson.topic || "—",
    "",
    "SCALETTA",
    outline,
    "",
    "SLIDE",
    slides,
    "",
    "MATERIALI",
    materials,
    "",
    "Generato con Cattedra (demo).",
  ].join("\n");
}

function materialText(lesson, material, cls) {
  const questions = cls.content.quiz;
  const exercises = cls.content.exercises;
  const title = lesson.title;
  let body = "";
  if (material.type === "quiz") {
    body = questions.map((question, index) => `${index + 1}. ${question.q}\n   Suggerimento: ${question.hint}`).join("\n\n");
  } else if (material.type === "attivita") {
    body = [
      `Attività collegata alla lezione «${title}».`,
      "",
      "Consegna",
      "Lavorando in coppia, risolvete il caso proposto e preparate una restituzione di due minuti.",
      "",
      "Criteri di osservazione",
      "- Comprensione del problema",
      "- Correttezza del procedimento",
      "- Chiarezza della spiegazione",
      "",
      "Esercizio di riferimento",
      `${exercises[1].title}: ${exercises[1].task}`,
    ].join("\n");
  } else {
    body = [
      `Scheda di lavoro su «${title}».`,
      "",
      "Esercizi",
      ...exercises.map((exercise, index) => `${index + 1}. [${exercise.level}] ${exercise.title}\n   ${exercise.task}`),
      "",
      "Soluzioni",
      ...exercises.map((exercise, index) => `${index + 1}. ${exercise.solution}`),
    ].join("\n");
  }
  return [
    "CATTEDRA · MATERIALE DIDATTICO",
    `Classe: ${cls.name}`,
    `Lezione: ${lesson.title}`,
    `Materiale: ${material.name}`,
    `Descrizione: ${material.desc}`,
    "",
    "—",
    "",
    body,
    "",
    "—",
    "Materiale demo generato da Cattedra.",
  ].join("\n");
}

function studentDocText(student, doc, cls) {
  return [
    `MATERIALE · ${student.name}`,
    `${cls.name} · ${cls.subject}`,
    "",
    doc.title,
    `${doc.typeLabel} · ${doc.date}`,
    doc.score !== null ? `Valutazione: ${fmtHalf(doc.score)}/10` : "",
    "",
    doc.detail,
    doc.comment ? `\nCommento: ${doc.comment}` : "",
    "",
    "Copia demo generata da Cattedra.",
  ].filter(Boolean).join("\n");
}

/* ---------- Componenti condivisi ---------- */

function scoreRingHTML(score, large = false) {
  const pct = Math.round(clamp(score, 0, 10) * 10);
  return `<span class="${ringClass(score)}${large ? " score-ring--lg" : ""}" style="--pct:${pct}" aria-label="Media ${fmt(score)} su 10"><span>${fmtHalf(score)}</span></span>`;
}

function statusDot(status) {
  return `<span class="status-dot status-dot--${status}" aria-hidden="true"></span>`;
}

function studentMetaText(student) {
  if (student.status.tone === "low") return `Da seguire · ultima ${fmtHalf(student.lastScore)}`;
  if (student.status.tone === "grow") return `In crescita · ${signed(student.trend)}`;
  return `Stabile · ultima ${fmtHalf(student.lastScore)}`;
}

function studentRowHTML(student) {
  const metaClass = student.status.tone === "low" ? " is-low" : student.status.tone === "grow" ? " is-growing" : "";
  const current = student.id === state.studentId ? ' aria-current="true"' : "";
  return `<li>
    <button type="button" class="student-row" data-open-student="${student.id}"${current} aria-label="${esc(student.name)}, media ${fmt(student.avg)} su 10, ${esc(studentMetaText(student))}">
      <span class="avatar avatar--tone-${student.avatarTone}" aria-hidden="true">${esc(student.initials)}</span>
      <span class="student-row-main">
        <span class="student-row-name">${esc(student.name)}</span>
        <span class="student-row-meta${metaClass}">${esc(studentMetaText(student))}</span>
      </span>
      ${scoreRingHTML(student.avg)}
    </button>
  </li>`;
}

function lessonStatusLabel(status) {
  return { today: "Oggi", planned: "In programma", done: "Completata", draft: "Bozza" }[status] || "Bozza";
}

function lessonRowHTML(lesson) {
  const current = lesson.id === state.lessonId ? " is-current" : "";
  const meta = `${lesson.dateLabel} · ${lesson.duration} min`;
  return `<button type="button" class="lesson-row${current}" data-open-lesson="${lesson.id}" aria-label="${esc(lesson.title)}, ${esc(meta)}, ${esc(lessonStatusLabel(lesson.status))}">
    <span class="lesson-index">${esc(lesson.number)}</span>
    <span class="lesson-row-main">
      <span class="lesson-row-title">${esc(lesson.title)}</span>
      <span class="lesson-row-meta">${statusDot(lesson.status)}${esc(meta)}</span>
    </span>
  </button>`;
}

function lessonListHTML(cls) {
  const today = cls.lessons.filter((lesson) => lesson.status === "today");
  const upcoming = cls.lessons.filter((lesson) => lesson.status === "planned" || lesson.status === "draft");
  const done = cls.lessons.filter((lesson) => lesson.status === "done");
  const groups = [
    { label: "Oggi", items: today },
    { label: "In programma", items: upcoming },
    { label: "Completate", items: done },
  ];
  return groups
    .filter((group) => group.items.length)
    .map((group) => `<p class="lesson-group-label">${group.label}</p>${group.items.map(lessonRowHTML).join("")}`)
    .join("");
}

function suggestionChipHTML(item) {
  return `<button type="button" class="suggestion" data-suggest="${esc(item.text)}">${icon("sparkles")}<span>${esc(item.label)}</span></button>`;
}

function suggestionsHTML(items) {
  return `<div class="suggestions">${items.map(suggestionChipHTML).join("")}</div>`;
}

function chatStatsHTML(items) {
  return `<div class="chat-stats">${items.map((item) => `<div class="chat-stat"><span>${esc(item.label)}</span><strong class="${item.low ? "is-low" : ""}">${esc(item.value)}</strong></div>`).join("")}</div>`;
}

function chatStudentRowHTML(student, reason) {
  return `<button type="button" class="chat-student" data-open-student="${student.id}" aria-label="Apri la scheda di ${esc(student.name)}">
    <span class="avatar avatar--tone-${student.avatarTone}" aria-hidden="true">${esc(student.initials)}</span>
    <span class="chat-student-main">
      <span class="chat-student-name">${esc(student.name)}</span>
      <span class="chat-student-why">${esc(reason)}</span>
    </span>
    <span class="chat-score${student.avg >= 6.5 ? " is-good" : ""}">${fmtHalf(student.avg)}</span>
  </button>`;
}

function errorBlockHTML(error) {
  return `<div class="chat-error">
    <div class="chat-error-head"><strong>${esc(error.label)}</strong><span class="chat-error-meta">${error.students.length} studenti</span></div>
    <p>${esc(error.note)}</p>
  </div>`;
}

function conceptMapHTML(map) {
  return `<div class="concept-map" role="group" aria-label="Mappa concettuale: ${esc(map.title)}">
    <div class="map-core">${esc(map.title)}</div>
    <div class="map-branches">${map.nodes.map((node) => `<div class="map-node"><strong>${esc(node.title)}</strong><span>${esc(node.note)}</span></div>`).join("")}</div>
  </div>`;
}

function skillsHTML(skills) {
  return `<div class="skill-list">${skills.map((skill) => `<div class="skill-item"><span>${esc(skill.label)}</span><strong>${skill.value}%</strong><div class="skill-meter"><i style="width:${skill.value}%"></i></div></div>`).join("")}</div>`;
}

function exercisesHTML(exercises) {
  return exercises.map((exercise) => {
    const levelClass = exercise.level === "Intermedio" ? " is-mid" : exercise.level === "Avanzato" ? " is-high" : "";
    return `<div class="exercise">
      <div class="exercise-head"><span class="level-tag${levelClass}">${esc(exercise.level)}</span><strong>${esc(exercise.title)}</strong></div>
      <p>${esc(exercise.task)}</p>
      <details class="solution"><summary>Soluzione</summary><p>${esc(exercise.solution)}</p></details>
    </div>`;
  }).join("");
}

function questionCardsHTML(questions) {
  return questions.map((question) => {
    const levelClass = question.level === "Applicazione" ? " is-mid" : ["Ragionamento", "Collegamento", "Progettazione"].includes(question.level) ? " is-high" : "";
    return `<div class="exercise">
      <div class="exercise-head"><span class="level-tag${levelClass}">${esc(question.level)}</span><strong>${esc(question.q)}</strong></div>
      <p>${esc(question.why)}</p>
    </div>`;
  }).join("");
}

function chatActionsHTML(buttons) {
  return `<div class="chat-actions">${buttons.join("")}</div>`;
}

/* ---------- Chat ---------- */

function chatKey(kind) {
  if (kind === "class") return `class:${state.classId}`;
  if (kind === "student") return `student:${state.classId}:${state.studentId}`;
  return `lesson:${state.classId}:${state.lessonId}`;
}

function greetingFor(kind) {
  const cls = currentClass();
  if (kind === "class") {
    const stats = cls.stats;
    const top = stats.topErrors[0];
    const focusStudent = stats.follow[0] || cls.students[0];
    return {
      role: "ai",
      html: `<p>Ciao <strong>prof.ssa Ferrari</strong>. Nella <strong>${esc(cls.short)}</strong> la media è <strong>${fmt(stats.avg)}</strong> e <strong>${stats.follow.length} studenti</strong> meritano attenzione.</p>
        <p>L'argomento più fragile è <strong>${esc(top.label)}</strong>: compare nelle valutazioni di ${top.students.length} studenti su ${cls.students.length}. Da dove vuoi partire?</p>
        <div class="starter-panel">
          <p class="starter-label">Inizia da qui</p>
          <div class="starter-grid">
            <button type="button" class="starter-card" data-suggest="Riassumi la situazione della classe.">
              <span class="starter-icon starter-icon--sage">${icon("users")}</span>
              <span class="starter-title">Analizza la classe</span>
              <span class="starter-sub">Trend, media e segnali recenti</span>
              ${icon("arrow-right", "starter-arrow")}
            </button>
            <button type="button" class="starter-card" data-suggest="Prepara una verifica sulla lezione di oggi.">
              <span class="starter-icon starter-icon--amber">${icon("clipboard")}</span>
              <span class="starter-title">Prepara una verifica</span>
              <span class="starter-sub">Cinque domande sugli errori emersi</span>
              ${icon("arrow-right", "starter-arrow")}
            </button>
            <button type="button" class="starter-card" data-open-student="${focusStudent.id}">
              <span class="starter-icon starter-icon--clay">${icon("user")}</span>
              <span class="starter-title">Scheda di ${esc(focusStudent.firstName)}</span>
              <span class="starter-sub">Media ${fmt(focusStudent.avg)} · ${esc(focusStudent.status.label.toLowerCase())}</span>
              ${icon("arrow-right", "starter-arrow")}
            </button>
          </div>
        </div>`,
    };
  }

  if (kind === "student") {
    const student = currentStudent();
    if (!student) {
      return { role: "ai", html: `<p>Seleziona uno studente per iniziare.</p>` };
    }
    const firstError = student.errors[0];
    const planLabel = student.avg >= 8 ? "Crea un approfondimento" : student.avg < 6.5 ? "Prepara un recupero" : "Prepara un consolidamento";
    const planPrompt = student.avg >= 8 ? "Prepara un approfondimento." : student.avg < 6.5 ? "Prepara un recupero." : "Prepara un consolidamento.";
    const focus = student.avg < 6.5
      ? `Il segnale più chiaro è una difficoltà su <strong>${esc(firstError.label)}</strong>: ${esc(firstError.note.toLowerCase())}`
      : `Il punto da consolidare è <strong>${esc(firstError.label)}</strong>, mentre ${esc(student.strengths[0].toLowerCase())} è un punto forte.`;
    return {
      role: "ai",
      html: `<p>Sto leggendo la scheda di <strong>${esc(student.name)}</strong>: media <strong>${fmt(student.avg)}</strong>, ${trendSentence(student.trend)}. L'ultima prova è <strong>${fmtHalf(student.lastScore)}/10</strong>.</p>
        <p>${focus}</p>
        ${suggestionsHTML([
          { label: "Cosa non ha capito?", text: "Cosa non ha capito?" },
          { label: planLabel, text: planPrompt },
          { label: "Verifica su misura", text: "Genera una verifica su misura." },
          { label: "Come sta andando?", text: "Come sta andando?" },
        ])}`,
    };
  }

  const lesson = currentLesson();
  if (!lesson) return { role: "ai", html: `<p>Seleziona una lezione per iniziare.</p>` };
  const missingCaptions = lesson.slides.filter((slide) => !slide.caption).length;
  let statusLine = "";
  if (!lesson.outline.length && !lesson.slides.length) {
    statusLine = "La lezione è ancora una bozza: scrivi cosa vuoi spiegare o chiedimi una prima scaletta.";
  } else if (!missingCaptions && lesson.materials.length) {
    statusLine = "I contenuti sono pronti: posso aiutarti a rifinire un passaggio o preparare una verifica.";
  } else if (lesson.outline.length && lesson.slides.length) {
    statusLine = `La scaletta e le ${lesson.slides.length} slide ci sono${missingCaptions ? `; mancano ${missingCaptions} didascalie` : ""}${lesson.materials.length ? "" : " e i materiali"}.`;
  } else {
    statusLine = "La scaletta c'è, ma slide e materiali sono ancora da preparare.";
  }
  return {
    role: "ai",
    html: `<p>Stai pianificando <strong>${esc(lesson.title)}</strong> per la <strong>${esc(cls.short)}</strong> · ${lesson.duration} minuti.</p>
      <p>${statusLine}</p>
      ${suggestionsHTML([
        { label: "Semplifica i concetti", text: "Semplifica i concetti della lezione." },
        { label: "Un esempio pratico", text: "Costruisci un esempio pratico." },
        { label: "3 domande di verifica", text: "Prepara domande di verifica." },
        { label: "Idee per i materiali", text: "Che materiali posso preparare?" },
      ])}`,
  };
}

function getChatMessages(kind) {
  const key = chatKey(kind);
  if (!state.chats.has(key)) {
    state.chats.set(key, [greetingFor(kind)]);
  }
  return state.chats.get(key);
}

function refreshChatGreetingIfPristine(kind) {
  const key = chatKey(kind);
  const messages = state.chats.get(key);
  if (!messages || messages.length !== 1 || messages[0].role !== "ai") return;
  messages[0] = greetingFor(kind);
  if (chatKey(kind) === key) {
    renderChat(kind, { scroll: false });
  }
}

function messageHTML(message) {
  if (message.role === "ai") {
    return `<article class="msg msg-ai">
      <span class="msg-avatar" aria-hidden="true">${icon("sparkles")}</span>
      <div class="msg-main">
        <div class="msg-author">Cattedra AI <span>· assistente didattico</span></div>
        <div class="msg-content">${message.html}</div>
      </div>
    </article>`;
  }
  return `<article class="msg msg-user"><div class="msg-content">${message.html}</div></article>`;
}

function typingHTML() {
  return `<article class="msg msg-ai typing-msg">
    <span class="msg-avatar" aria-hidden="true">${icon("sparkles")}</span>
    <div class="msg-main">
      <div class="msg-author">Cattedra AI <span>· sta scrivendo</span></div>
      <div class="msg-content" aria-label="Sto preparando la risposta">
        <div class="typing"><span></span><span></span><span></span><span class="typing-text">sto preparando la risposta…</span></div>
      </div>
    </div>
  </article>`;
}

function chatConfig(kind) {
  const cls = currentClass();
  if (kind === "class") {
    return {
      title: "Assistente di classe",
      subtitle: `Conosce voti, materiali e lezioni di ${cls.short}`,
      placeholder: "Chiedi qualcosa sulla classe o allega un materiale…",
      label: "Scrivi un messaggio per l'assistente di classe",
    };
  }
  if (kind === "student") {
    const student = currentStudent();
    return {
      title: "Assistente studente",
      subtitle: student ? `Scheda di ${student.name} · focus personale` : "Scegli uno studente",
      placeholder: student ? `Chiedi di ${student.firstName} o allega un documento…` : "Scegli uno studente…",
      label: "Scrivi un messaggio per l'assistente studente",
    };
  }
  const lesson = currentLesson();
  return {
    title: "Assistente lezione",
    subtitle: lesson ? `Pianificazione · ${cls.short} — nessuno studente in vista` : "Scegli una lezione",
    placeholder: "Chiedi aiuto per la lezione o allega un file…",
    label: "Scrivi un messaggio per l'assistente lezione",
  };
}

function mountChat(kind) {
  const panel = $(`#${kind}-chat-panel`);
  if (!panel) return;
  panel.dataset.chatKind = kind;
  panel.innerHTML = `
    <header class="chat-head">
      <span class="ai-mark" aria-hidden="true">${icon("sparkles")}</span>
      <div class="chat-head-text">
        <h2 id="${kind}-chat-title">Assistente</h2>
        <p id="${kind}-chat-subtitle">Contesto</p>
      </div>
      <button type="button" class="icon-btn" data-chat-reset="${kind}" aria-label="Azzera la conversazione" title="Nuova conversazione">${icon("refresh")}</button>
    </header>
    <div class="chat-log" id="${kind}-chat-log" role="log" aria-live="polite" aria-label="Conversazione con l'assistente"></div>
    <div class="composer-wrap">
      <form class="composer" id="${kind}-chat-form" novalidate>
        <input type="file" hidden multiple data-file-input="${kind}" aria-hidden="true" tabindex="-1" />
        <button type="button" class="icon-btn" data-attach="${kind}" aria-label="Allega un file" title="Allega un file">${icon("paperclip")}</button>
        <div class="composer-field">
          <div class="attachments" data-attachments="${kind}" hidden></div>
          <label class="sr-only" for="${kind}-chat-input">Messaggio per l'assistente</label>
          <textarea id="${kind}-chat-input" rows="1" placeholder="Scrivi un messaggio…" aria-label="Messaggio per l'assistente"></textarea>
        </div>
        <button type="submit" class="send-btn" aria-label="Invia messaggio" title="Invia">${icon("arrow-up")}</button>
      </form>
      <p class="composer-note">L'AI può sbagliare: verifica sempre i contenuti.</p>
    </div>`;

  const log = $(`#${kind}-chat-log`, panel);
  const form = $(`#${kind}-chat-form`, panel);
  const input = $(`#${kind}-chat-input`, panel);
  const fileInput = $(`[data-file-input="${kind}"]`, panel);
  const attachButton = $(`[data-attach="${kind}"]`, panel);
  const resetButton = $(`[data-chat-reset="${kind}"]`, panel);

  chatEls[kind] = { panel, log, form, input, fileInput, attachButton, resetButton };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    const attachments = attachmentsFor(kind);
    if (!text && !attachments.length) {
      input.focus();
      return;
    }
    sendChat(kind, text);
  });

  input.addEventListener("input", () => autoGrowTextarea(input));
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  attachButton.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => {
    addAttachments(kind, Array.from(fileInput.files || []));
    fileInput.value = "";
  });

  resetButton.addEventListener("click", () => resetChat(kind));

  form.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-attachment]");
    if (!removeButton) return;
    removeAttachment(kind, Number(removeButton.dataset.removeAttachment));
  });

  renderChat(kind);
}

function autoGrowTextarea(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = `${Math.min(textarea.scrollHeight, 112)}px`;
}

function isChatBusy(kind) {
  return state.busy.has(chatKey(kind));
}

function attachmentsFor(kind) {
  return state.attachments.get(chatKey(kind)) || [];
}

function addAttachments(kind, files) {
  if (!files.length) return;
  const key = chatKey(kind);
  const current = state.attachments.get(key) || [];
  const next = [...current];
  files.forEach((file) => {
    if (!next.some((item) => item.name === file.name && item.size === file.size)) {
      next.push({ name: file.name, size: file.size });
    }
  });
  state.attachments.set(key, next);
  renderAttachments(kind);
  showToast(files.length === 1 ? "File allegato alla conversazione." : `${files.length} file allegati alla conversazione.`);
}

function removeAttachment(kind, index) {
  const key = chatKey(kind);
  const current = state.attachments.get(key) || [];
  current.splice(index, 1);
  state.attachments.set(key, current);
  renderAttachments(kind);
}

function renderAttachments(kind) {
  const { panel } = chatEls[kind] || {};
  if (!panel) return;
  const container = $(`[data-attachments="${kind}"]`, panel);
  if (!container) return;
  const attachments = attachmentsFor(kind);
  container.hidden = !attachments.length;
  container.innerHTML = attachments.map((attachment, index) => `<span class="attachment">
    ${icon("paperclip")}<span>${esc(attachment.name)}${attachment.size ? ` · ${formatSize(attachment.size)}` : ""}</span>
    <button type="button" data-remove-attachment="${index}" aria-label="Rimuovi ${esc(attachment.name)}">${icon("x")}</button>
  </span>`).join("");
}

function renderChatHeader(kind) {
  const config = chatConfig(kind);
  const title = $(`#${kind}-chat-title`);
  const subtitle = $(`#${kind}-chat-subtitle`);
  const { panel } = chatEls[kind] || {};
  if (!panel) return;
  if (title) title.textContent = config.title;
  if (subtitle) subtitle.textContent = config.subtitle;
  const input = $(`#${kind}-chat-input`, panel);
  if (input) {
    input.placeholder = config.placeholder;
    input.setAttribute("aria-label", config.label);
  }
}

function renderChat(kind, { scroll = true, smooth = false } = {}) {
  if (!chatEls[kind]) mountChat(kind);
  const { panel, log } = chatEls[kind];
  renderChatHeader(kind);
  const messages = getChatMessages(kind);
  const busy = isChatBusy(kind);
  log.innerHTML = messages.map(messageHTML).join("") + (busy ? typingHTML() : "");
  log.setAttribute("aria-busy", String(busy));
  log.querySelectorAll("[data-suggest]").forEach((button) => { button.disabled = busy; });
  renderAttachments(kind);
  updateChatControls(kind);
  if (scroll) scrollChat(kind, smooth);
}

function updateChatControls(kind) {
  const { panel, log } = chatEls[kind] || {};
  if (!panel || !log) return;
  const busy = isChatBusy(kind);
  const send = $(".send-btn", panel);
  if (send) send.disabled = busy;
  log.querySelectorAll("[data-suggest]").forEach((button) => { button.disabled = busy; });
  if (kind === "class") {
    $$("[data-quick]").forEach((button) => { button.disabled = busy; });
  }
}

function scrollChat(kind, smooth = true) {
  const log = chatEls[kind]?.log;
  if (!log) return;
  requestAnimationFrame(() => {
    log.scrollTo({ top: log.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  });
}

function appendChatNode(kind, message, key) {
  if (chatKey(kind) !== key) return;
  const log = chatEls[kind]?.log;
  if (!log) return;
  const stick = log.scrollHeight - log.scrollTop - log.clientHeight < 140;
  log.querySelector(".typing-msg")?.remove();
  log.insertAdjacentHTML("beforeend", messageHTML(message));
  if (stick) scrollChat(kind, true);
  log.querySelectorAll("[data-suggest]").forEach((button) => { button.disabled = isChatBusy(kind); });
}

function appendTyping(kind, key) {
  if (chatKey(kind) !== key) return;
  const log = chatEls[kind]?.log;
  if (!log || log.querySelector(".typing-msg")) return;
  log.insertAdjacentHTML("beforeend", typingHTML());
  scrollChat(kind, true);
}

function sendChat(kind, text, forcedIntent = null) {
  const value = String(text || "").trim();
  const key = chatKey(kind);
  if (state.busy.has(key)) {
    showToast("Attendi la risposta dell'assistente.");
    return;
  }
  const attachments = [...attachmentsFor(kind)];
  if (!value && !attachments.length) return;

  const cls = currentClass();
  const student = kind === "student" ? currentStudent() : null;
  const lesson = kind === "lesson" ? currentLesson() : null;
  if (kind === "student" && !student) {
    showToast("Seleziona prima uno studente.");
    return;
  }
  if (kind === "lesson" && !lesson) {
    showToast("Seleziona prima una lezione.");
    return;
  }

  const messages = getChatMessages(kind);
  const attachmentHTML = attachments.length
    ? `<div class="msg-attachments">${attachments.map((attachment) => `<span class="attachment">${icon("paperclip")}<span>${esc(attachment.name)}</span></span>`).join("")}</div>`
    : "";
  const userMessage = {
    role: "user",
    html: `<p>${esc(value).replace(/\n/g, "<br>")}</p>${attachmentHTML}`,
  };
  messages.push(userMessage);

  const { panel, input } = chatEls[kind];
  appendChatNode(kind, userMessage, key);
  input.value = "";
  autoGrowTextarea(input);
  state.attachments.delete(key);
  renderAttachments(kind);
  state.busy.add(key);
  appendTyping(kind, key);
  updateChatControls(kind);
  scrollChat(kind, true);

  const intent = forcedIntent || detectIntent(kind, value);

  setTimeout(() => {
    const replyHtml = buildReply(kind, intent, value, { cls, student, lesson });
    const aiMessage = { role: "ai", html: replyHtml };
    messages.push(aiMessage);
    state.busy.delete(key);
    if (chatKey(kind) === key) {
      const log = chatEls[kind]?.log;
      log?.querySelector(".typing-msg")?.remove();
      appendChatNode(kind, aiMessage, key);
      updateChatControls(kind);
      scrollChat(kind, true);
      announce("Risposta dell'assistente pronta.");
    }
  }, 900 + Math.round(Math.random() * 650));
}

function resetChat(kind) {
  const key = chatKey(kind);
  if (state.busy.has(key)) {
    showToast("Attendi la risposta prima di azzerare la conversazione.");
    return;
  }
  state.chats.delete(key);
  state.attachments.delete(key);
  getChatMessages(kind);
  renderChat(kind);
  chatEls[kind]?.input?.focus();
  announce("Conversazione azzerata.");
  showToast("Conversazione azzerata.");
}

function detectIntent(kind, text) {
  const t = normalize(text);
  if (kind === "class") {
    if (/(domand|orale|interrog)/.test(t) && !/(verifica|quiz|test)/.test(t)) return "questions";
    if (/(esercizi|esercizio|attivita|compito)/.test(t)) return "exercises";
    if (/(mappa|schema|concett)/.test(t)) return "concept";
    if (/(skill|competen)/.test(t)) return "skills";
    if (/(verifica|quiz|test)/.test(t)) return "quiz";
    if (/recuper/.test(t)) return "recovery";
    if (/(chi|aiuto|difficolt|seguire|debole)/.test(t)) return "who";
    if (/(error|sbagl)/.test(t)) return "errors";
    if (/(media|voti|riassum|situazione|andando|classe)/.test(t)) return "summary";
    if (/(lezione|programm|pianific)/.test(t)) return "lesson";
    return "fallback";
  }
  if (kind === "student") {
    if (/(recuper|piano|intervent|aiut|approfond)/.test(t)) return "recovery";
    if (/(cosa non ha capito|non ha capito|debolezz|error|difficolt|capito)/.test(t)) return "weaknesses";
    if (/(verifica|quiz|test|domande|esercizi)/.test(t)) return "quiz";
    if (/(media|voti|andando|progress|trend|cresciut|migliorat)/.test(t)) return "progress";
    if (/(material|document|pdf|compiti)/.test(t)) return "materials";
    return "overview";
  }
  if (/(esempio|pratic|caso)/.test(t)) return "example";
  if (/(semplific|spiega|analog|parole semplici)/.test(t)) return "simplify";
  if (/(domande|verifica|quiz|interrog)/.test(t)) return "questions";
  if (/(scaletta|struttura|outline|passaggi)/.test(t)) return "outline";
  if (/(slide|presentazione)/.test(t)) return "slides";
  if (/(material|scheda|attivita)/.test(t)) return "materials";
  return "fallback";
}

function buildReply(kind, intent, text, ctx) {
  if (kind === "class") return buildClassReply(intent, text, ctx.cls);
  if (kind === "student") return buildStudentReply(intent, text, ctx.student, ctx.cls);
  return buildLessonReply(intent, text, ctx.lesson, ctx.cls);
}

/* ---------- Risposte AI: classe ---------- */

function buildClassReply(intent, text, cls) {
  switch (intent) {
    case "summary": return classSummaryReply(cls);
    case "who": return classWhoReply(cls);
    case "errors": return classErrorsReply(cls);
    case "quiz": return classQuizReply(cls);
    case "questions": return classQuestionsReply(cls);
    case "exercises": return classExercisesReply(cls);
    case "concept": return classConceptReply(cls);
    case "skills": return classSkillsReply(cls);
    case "recovery": return classRecoveryReply(cls);
    case "lesson": return classLessonReply(cls);
    default: return classFallbackReply(cls, text);
  }
}

function classSummaryReply(cls) {
  const stats = cls.stats;
  const top = stats.topErrors[0];
  const summaryText = classSummaryText(cls);
  return `<p>La <strong>${esc(cls.short)}</strong> ha una media di <strong>${fmt(stats.avg)}/10</strong>. Nell'ultimo mese ${stats.growing.length} studenti sono in crescita e ${stats.declining.length} in calo netto.</p>
    ${chatStatsHTML([
      { label: "Media", value: fmt(stats.avg) },
      { label: "Da seguire", value: String(stats.follow.length), low: true },
      { label: "In crescita", value: String(stats.growing.length) },
    ])}
    <p>Il punto più fragile è <strong>${esc(top.label)}</strong>: riguarda ${top.students.length} studenti su ${cls.students.length}. ${esc(top.note)}</p>
    ${chatActionsHTML([
      actionButton("Copia sintesi", "copy", { type: "copy", text: summaryText }),
      actionButton("Apri la lezione di oggi", "arrow-right", { type: "open-lesson", lessonId: defaultLessonId(cls) }),
    ])}`;
}

function classWhoReply(cls) {
  const follow = cls.stats.follow;
  if (!follow.length) {
    const top = [...cls.students].sort((a, b) => b.avg - a.avg).slice(0, 3);
    return `<p>Buona notizia: nessuno studente è sotto il 6,5. I profili più solidi sono:</p>
      ${top.map((student) => chatStudentRowHTML(student, `Media ${fmt(student.avg)} · ${student.strengths[0].toLowerCase()}`)).join("")}
      <p>Per chi è già solido, punterei su un'attività di peer tutoring o su un esercizio di livello avanzato.</p>`;
  }
  const first = follow[0];
  return `<p>Ho ordinato i profili per media e segnali recenti. Questi studenti meritano un'attenzione ravvicinata:</p>
    ${follow.slice(0, 3).map((student) => chatStudentRowHTML(student, `${student.errors[0].label} · ultima prova ${fmtHalf(student.lastScore)}`)).join("")}
    <p>Per <strong>${esc(first.name)}</strong> partirei da ${esc(first.errors[0].prereq)}: è il prerequisito che rende più difficile il resto.</p>
    ${chatActionsHTML([
      actionButton("Prepara un recupero", "sparkles", { type: "prompt", kind: "class", text: "Prepara un piano di recupero per gli studenti da seguire.", intent: "recovery" }),
      actionButton("Apri la scheda", "arrow-right", { type: "open-student", studentId: first.id }),
    ])}`;
}

function classErrorsReply(cls) {
  const top = cls.stats.topErrors.slice(0, 3);
  const copy = top.map((error) => `${error.label}: ${error.note} (${error.students.length} studenti)`).join("\n");
  return `<p>Ho incrociato le ultime cinque valutazioni di ogni studente. Gli errori che ricorrono di più sono questi:</p>
    ${top.map(errorBlockHTML).join("")}
    <p>Non li tratterei come tre problemi separati: il primo è un prerequisito del terzo. Conviene ripartire da lì con un esempio guidato.</p>
    ${chatActionsHTML([
      actionButton("Copia elenco", "copy", { type: "copy", text: copy }),
      actionButton("Crea esercizi mirati", "sparkles", { type: "prompt", kind: "class", text: "Crea esercizi sui tre errori più frequenti.", intent: "exercises" }),
    ])}`;
}

function classQuizReply(cls) {
  const copy = classQuizText(cls);
  return `<p>Ecco una verifica pronta da adattare, costruita sul programma e sugli errori emersi nella classe:</p>
    <ol>${cls.content.quiz.map((question) => `<li><strong>${esc(question.q)}</strong><br><span style="color:var(--muted);font-size:9px">${esc(question.hint)}</span></li>`).join("")}</ol>
    <p>Se vuoi, posso ridurla a tre domande per una verifica formativa o trasformarla in un Google Moduli.</p>
    ${chatActionsHTML([
      actionButton("Copia verifica", "copy", { type: "copy", text: copy }),
      actionButton("Scarica .txt", "download", { type: "download", filename: `verifica-${slugify(cls.short)}.txt`, text: copy }),
      actionButton("Apri la lezione", "arrow-right", { type: "open-lesson", lessonId: defaultLessonId(cls) }),
    ])}`;
}

function classQuestionsReply(cls) {
  const copy = classQuestionsText(cls);
  return `<p>Partirei da queste domande. Sono cinque, ma ne userei tre per un orale di dieci minuti:</p>
    ${questionCardsHTML(cls.content.likely)}
    ${chatActionsHTML([
      actionButton("Copia domande", "copy", { type: "copy", text: copy }),
      actionButton("Trasforma in verifica", "sparkles", { type: "prompt", kind: "class", text: "Trasforma le domande orali in una verifica scritta.", intent: "quiz" }),
    ])}`;
}

function classExercisesReply(cls) {
  const copy = classExercisesText(cls);
  return `<p>Tre esercizi differenziati, sullo stesso concetto. Il primo è accessibile a tutti, il terzo richiede autonomia:</p>
    ${exercisesHTML(cls.content.exercises)}
    ${chatActionsHTML([
      actionButton("Copia esercizi", "copy", { type: "copy", text: copy }),
      actionButton("Scarica .txt", "download", { type: "download", filename: `esercizi-${slugify(cls.short)}.txt`, text: copy }),
    ])}`;
}

function classConceptReply(cls) {
  const map = cls.content.map;
  const copy = conceptMapText(map);
  return `<p>Una mappa per riordinare i concetti chiave e vedere le connessioni:</p>
    ${conceptMapHTML(map)}
    <p>La userei come apertura: prima la classe prova a ricostruirla, poi confrontiamo. Le connessioni mancanti sono le domande da fare.</p>
    ${chatActionsHTML([
      actionButton("Copia mappa", "copy", { type: "copy", text: copy }),
      actionButton("Apri la lezione", "arrow-right", { type: "open-lesson", lessonId: defaultLessonId(cls) }),
    ])}`;
}

function classSkillsReply(cls) {
  const skills = cls.content.skills;
  const fragile = [...skills].sort((a, b) => a.value - b.value)[0];
  return `<p>Questa è la copertura stimata delle competenze, incrociando valutazioni e materiali della classe:</p>
    ${skillsHTML(skills)}
    <p>La competenza più fragile è <strong>${esc(fragile.label)}</strong> (${fragile.value}%). La affronterei con un'attività breve e una verifica formativa, non con una nuova lezione frontale.</p>
    ${chatActionsHTML([
      actionButton("Prepara un'attività", "sparkles", { type: "prompt", kind: "class", text: `Prepara un'attività per consolidare ${fragile.label}.`, intent: "exercises" }),
    ])}`;
}

function classRecoveryReply(cls) {
  const follow = cls.stats.follow;
  if (!follow.length) {
    return `<p>Non ci sono studenti sotto il 6,5: il lavoro è di consolidamento, non di recupero. Userei un'attività a coppie con ruoli alternati.</p>`;
  }
  const groups = [];
  follow.forEach((student) => {
    const label = student.errors[0].label;
    let group = groups.find((entry) => entry.label === label);
    if (!group) {
      group = { label, students: [] };
      groups.push(group);
    }
    group.students.push(student);
  });
  const planText = [
    `PIANO DI RECUPERO · ${cls.name}`,
    ...groups.map((group) => `${group.label}: ${group.students.map((student) => student.name).join(", ")}`),
    "",
    "Due incontri da 30 minuti: prerequisito, pratica guidata, verifica formativa.",
  ].join("\n");
  return `<p>Raggrupperei gli interventi per errore, così non moltiplichiamo gli sportelli:</p>
    <ol>${groups.map((group) => `<li><strong>${esc(group.label)}</strong> — ${group.students.map((student) => esc(student.firstName)).join(", ")}. Un incontro da 30 minuti sul prerequisito, poi due esercizi guidati.</li>`).join("")}</ol>
    <p>In classe, dedicherei i primi dieci minuti della prossima lezione a un richiamo comune: conviene a tutto il gruppo, non solo a chi è da seguire.</p>
    ${chatActionsHTML([
      actionButton("Copia piano", "copy", { type: "copy", text: planText }),
      actionButton("Scarica piano", "download", { type: "download", filename: `recupero-${slugify(cls.short)}.txt`, text: planText }),
    ])}`;
}

function classLessonReply(cls) {
  const lesson = cls.lessons.find((item) => item.status === "today") || cls.lessons[0];
  if (!lesson) return `<p>Non ci sono lezioni in programma per questa classe.</p>`;
  return `<p>La lezione di oggi è <strong>${esc(lesson.title)}</strong> (${lesson.duration} min).</p>
    <p>La scaletta è pronta${lesson.slides.length ? `, con ${lesson.slides.length} slide` : ""}${lesson.materials.length ? " e materiali" : ""}. ${lesson.slides.some((slide) => !slide.caption) ? "Mancano ancora alcune didascalie." : ""}</p>
    ${chatActionsHTML([
      actionButton("Apri la lezione", "arrow-right", { type: "open-lesson", lessonId: lesson.id }),
      actionButton("Prepara domande", "sparkles", { type: "prompt", kind: "class", text: "Prepara le domande probabili per l'orale.", intent: "questions" }),
    ])}`;
}

function classFallbackReply(cls, text) {
  return `<p>Nella demo non ho un'analisi già pronta per «${esc(truncate(text || "questa richiesta", 80))}». Posso però usare i dati della <strong>${esc(cls.short)}</strong> per tre cose utili:</p>
    <ul>
      <li>leggere la situazione della classe e gli errori ricorrenti;</li>
      <li>preparare verifiche, esercizi o domande per l'orale;</li>
      <li>aprire la scheda di uno studente o la lezione di oggi.</li>
    </ul>
    ${suggestionsHTML([
      { label: "Riassumi la classe", text: "Riassumi la situazione della classe." },
      { label: "Chi ha bisogno di aiuto?", text: "Chi ha bisogno di aiuto?" },
      { label: "Prepara una verifica", text: "Prepara una verifica sulla lezione di oggi." },
    ])}`;
}

/* ---------- Risposte AI: studente ---------- */

function buildStudentReply(intent, text, student, cls) {
  switch (intent) {
    case "overview": return studentOverviewReply(student, cls);
    case "weaknesses": return studentWeaknessesReply(student, cls);
    case "recovery": return studentRecoveryReply(student, cls);
    case "progress": return studentProgressReply(student, cls);
    case "quiz": return studentQuizReply(student, cls);
    case "materials": return studentMaterialsReply(student, cls);
    default: return studentFallbackReply(student, cls, text);
  }
}

function studentOverviewReply(student, cls) {
  const error = student.errors[0];
  const copy = studentSheetText(student, cls);
  return `<p><strong>${esc(student.name)}</strong> ha una media di <strong>${fmt(student.avg)}/10</strong>, ${trendSentence(student.trend)}. L'ultima prova (${esc(student.lastAssessment.short)}) è <strong>${fmtHalf(student.lastScore)}/10</strong>.</p>
    ${chatStatsHTML([
      { label: "Media", value: fmt(student.avg), low: student.avg < 6.5 },
      { label: "Trend", value: signed(student.trend) },
      { label: "Materiali", value: String(student.docs.length) },
    ])}
    <p>Il segnale più chiaro è <strong>${esc(error.label)}</strong>: ${esc(error.note.toLowerCase())} Il punto di partenza più utile è ${esc(error.prereq)}.</p>
    ${chatActionsHTML([
      actionButton("Copia scheda", "copy", { type: "copy", text: copy }),
      actionButton("Prepara un piano", "sparkles", { type: "prompt", kind: "student", text: "Prepara un piano personalizzato.", intent: "recovery" }),
    ])}`;
}

function studentWeaknessesReply(student, cls) {
  const errors = student.errors;
  return `<p>Dalle valutazioni di ${esc(student.firstName)} emergono ${errors.length} segnali ricorrenti:</p>
    ${errors.map((error) => `<div class="chat-error"><div class="chat-error-head"><strong>${esc(error.label)}</strong><span class="chat-error-meta">${error.count} errori</span></div><p>${esc(error.note)}</p></div>`).join("")}
    <p>Partirei da <strong>${esc(errors[0].prereq)}</strong>: senza quel passaggio, ogni esercizio successivo resta fragile.</p>
    ${chatActionsHTML([
      actionButton("Prepara un recupero", "sparkles", { type: "prompt", kind: "student", text: "Prepara un recupero.", intent: "recovery" }),
      actionButton("Genera una verifica", "edit", { type: "prompt", kind: "student", text: "Genera una verifica su misura.", intent: "quiz" }),
    ])}`;
}

function studentRecoveryReply(student, cls) {
  const plan = recoverySteps(student);
  const planText = studentPlanText(student, cls);
  const label = student.avg >= 8 ? "approfondimento" : student.avg < 6.5 ? "recupero" : "consolidamento";
  return `<p>Ecco un piano di ${label} per <strong>${esc(student.firstName)}</strong>, in tre tappe brevi:</p>
    <ol>${plan.map((step) => `<li><strong>${esc(step.title)}</strong> · ${step.minutes} min<br><span style="color:var(--muted);font-size:9.5px">${esc(step.detail)}</span></li>`).join("")}</ol>
    <p>Materiali: una scheda guidata, due esercizi di pratica e una verifica formativa. Il focus resta <strong>${esc(student.errors[0].label)}</strong>.</p>
    ${chatActionsHTML([
      actionButton("Copia piano", "copy", { type: "copy", text: planText }),
      actionButton("Scarica piano", "download", { type: "download", filename: `piano-${slugify(student.name)}.txt`, text: planText }),
    ])}`;
}

function studentProgressReply(student, cls) {
  const classAvg = cls.stats.avg;
  const diff = student.avg - classAvg;
  const scores = student.scores;
  return `<p><strong>${esc(student.firstName)}</strong> è a <strong>${fmt(student.avg)}</strong>, ${diff >= 0 ? `sopra` : `sotto`} la media di classe di ${fmt(Math.abs(diff))}. Il trend è ${trendSentence(student.trend)}.</p>
    ${chatStatsHTML([
      { label: "Ultima prova", value: fmtHalf(scores[0]) },
      { label: "Migliore", value: fmtHalf(Math.max(...scores)) },
      { label: "Minima", value: fmtHalf(Math.min(...scores)) },
    ])}
    <p>Le ultime valutazioni, dalla più recente: ${student.docs.filter((doc) => doc.score !== null).slice(0, 5).map((doc) => `<strong>${fmtHalf(doc.score)}</strong>`).join(" · ")}.</p>
    <p>${student.avg < 6.5 ? "Il calo non è uniforme: le prove pratiche tengono, mentre la verifica scritta è più fragile." : "Il profilo è equilibrato. Il prossimo passo è rendere più sicuro il passaggio su " + esc(student.errors[0].label.toLowerCase()) + "."}</p>
    ${chatActionsHTML([
      actionButton("Cosa non ha capito?", "search", { type: "prompt", kind: "student", text: "Cosa non ha capito?", intent: "weaknesses" }),
    ])}`;
}

function studentQuizReply(student, cls) {
  const error = student.errors[0];
  const questions = [
    { q: `Spiega con parole tue che cosa significa «${error.label}» e fai un esempio.`, hint: `Riprendi ${error.prereq}.` },
    { q: `Trova l'errore in questa affermazione: «${error.note}»`, hint: "Riscrivi l'affermazione in modo corretto." },
    { q: cls.content.quiz[0].q, hint: cls.content.quiz[0].hint },
    { q: `Applica il concetto a un caso nuovo: ${cls.content.exercises[1].task}`, hint: cls.content.exercises[1].solution },
  ];
  const text = [`VERIFICA SU MISURA · ${student.name}`, `${cls.name} · focus: ${error.label}`, "", ...questions.map((q, index) => `${index + 1}. ${q.q}\n   Suggerimento: ${q.hint}`)].join("\n");
  return `<p>Ho costruito quattro domande a partire dagli errori di ${esc(student.firstName)}, non dal programma in generale:</p>
    <ol>${questions.map((question) => `<li><strong>${esc(question.q)}</strong><br><span style="color:var(--muted);font-size:9px">${esc(question.hint)}</span></li>`).join("")}</ol>
    ${chatActionsHTML([
      actionButton("Copia verifica", "copy", { type: "copy", text }),
      actionButton("Scarica .txt", "download", { type: "download", filename: `verifica-${slugify(student.name)}.txt`, text }),
    ])}`;
}

function studentMaterialsReply(student, cls) {
  return `<p>Nella scheda di ${esc(student.firstName)} ci sono ${student.docs.length} elementi tra valutazioni e materiali caricati:</p>
    <ul>${student.docs.map((doc) => `<li><strong>${esc(doc.title)}</strong> · ${esc(doc.date)}${doc.score !== null ? ` · ${fmtHalf(doc.score)}/10` : ""}</li>`).join("")}</ul>
    <p>Il PDF su cui tornerei è <strong>${esc(student.docs.find((doc) => doc.kind === "pdf")?.title || "gli appunti")}</strong>: contiene il passaggio che genera più errori.</p>
    ${chatActionsHTML([
      actionButton("Cosa non ha capito?", "search", { type: "prompt", kind: "student", text: "Cosa non ha capito?", intent: "weaknesses" }),
    ])}`;
}

function studentFallbackReply(student, cls, text) {
  return `<p>Su «${esc(truncate(text || "questa richiesta", 70))}» non ho un'analisi già pronta nella demo. Posso però partire dalla scheda di <strong>${esc(student.name)}</strong>:</p>
    <ul>
      <li>riassumere punti deboli e punti di forza;</li>
      <li>preparare un piano di recupero o un approfondimento;</li>
      <li>generare una verifica costruita sui suoi errori.</li>
    </ul>
    ${suggestionsHTML([
      { label: "Cosa non ha capito?", text: "Cosa non ha capito?" },
      { label: "Prepara un recupero", text: "Prepara un recupero." },
      { label: "Verifica su misura", text: "Genera una verifica su misura." },
    ])}`;
}

/* ---------- Risposte AI: lezione ---------- */

function buildLessonReply(intent, text, lesson, cls) {
  switch (intent) {
    case "simplify": return lessonSimplifyReply(lesson, cls);
    case "example": return lessonExampleReply(lesson, cls);
    case "questions": return lessonQuestionsReply(lesson, cls);
    case "outline": return lessonOutlineReply(lesson, cls);
    case "slides": return lessonSlidesReply(lesson, cls);
    case "materials": return lessonMaterialsReply(lesson, cls);
    default: return lessonFallbackReply(lesson, cls, text);
  }
}

function lessonSimplifyReply(lesson, cls) {
  const analogies = lesson.focus ? cls.content.explain : [
    { title: "Parti da un'immagine concreta", text: `Collega «${lesson.title}» a una situazione che la classe conosce già.` },
    { title: "Una frase, un concetto", text: "Riduci ogni passaggio a una frase: soggetto, azione, conseguenza." },
    { title: "L'esempio prima della regola", text: "Mostra un caso risolto, poi fai emergere la regola insieme alla classe." },
  ];
  const text = analogies.map((item) => `${item.title}: ${item.text}`).join("\n");
  return `<p>Provo a spiegare <strong>${esc(lesson.title)}</strong> con tre immagini semplici:</p>
    <div class="analogy-list">${analogies.map((item) => `<div class="analogy"><strong>${esc(item.title)}</strong><p>${esc(item.text)}</p></div>`).join("")}</div>
    <p>Usale una alla volta, con una domanda di controllo dopo ciascuna. Non tutte nello stesso momento.</p>
    ${chatActionsHTML([
      actionButton("Copia spiegazione", "copy", { type: "copy", text }),
      actionButton("Apri la scaletta", "list", { type: "scroll", section: "outline" }),
    ])}`;
}

function lessonExampleReply(lesson, cls) {
  const example = lesson.focus ? cls.content.example : {
    title: `Un caso per «${lesson.title}»`,
    intro: "Parti da una situazione reale del laboratorio o della vita scolastica.",
    steps: ["Descrivi il caso in una frase.", "Chiedi alla classe cosa osservare.", "Risolvi il primo passaggio insieme.", "Lascia il secondo passaggio alle coppie."],
    close: "Chiudi confrontando le soluzioni, non solo il risultato.",
  };
  return `<p><strong>${esc(example.title)}</strong></p>
    <p>${esc(example.intro)}</p>
    <ol>${example.steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>
    <p>${esc(example.close)}</p>
    ${chatActionsHTML([
      actionButton("Aggiungi alla scaletta", "sparkles", {
        type: "add-step",
        lessonId: lesson.id,
        step: {
          title: `Esempio guidato · ${example.title}`,
          detail: `${example.intro} ${example.steps.join(" ")}`,
          minutes: 15,
        },
      }),
      actionButton("Apri le slide", "presentation", { type: "present" }),
    ])}`;
}

function genericLessonQuestions(title) {
  const subject = isPlaceholderTitle(title) ? "l'argomento di oggi" : `«${title}»`;
  return [
    { q: `Spiega con parole tue ${subject} e fai un esempio concreto.`, level: "Comprensione", why: "Verifica se il concetto è stato interiorizzato, non solo riconosciuto." },
    { q: "Quali passaggi useresti per risolvere un caso pratico? Elencali in ordine.", level: "Applicazione", why: "Fa emergere il procedimento e i punti fragili." },
    { q: "Qual è l'errore più facile da fare? Perché?", level: "Ragionamento", why: "Porta lo studente a riconoscere il proprio punto cieco." },
    { q: "Collega l'argomento a un concetto della lezione precedente.", level: "Collegamento", why: "Verifica la rete di conoscenze, non il singolo dettaglio." },
  ];
}

function lessonQuestionsReply(lesson, cls) {
  const questions = lesson.focus ? cls.content.likely.slice(0, 4) : genericLessonQuestions(lesson.title);
  const text = questions.map((question, index) => `${index + 1}. ${question.q} (${question.level})`).join("\n");
  return `<p>Quattro domande per verificare se il concetto è passato davvero:</p>
    ${questionCardsHTML(questions)}
    <p>Userei le prime due come controllo in itinere e le ultime due come uscita rapida.</p>
    ${chatActionsHTML([
      actionButton("Copia domande", "copy", { type: "copy", text }),
      actionButton("Apri la lezione", "arrow-right", { type: "open-lesson", lessonId: lesson.id }),
    ])}`;
}

function lessonOutlineReply(lesson, cls) {
  if (!lesson.outline.length) {
    return `<p>La scaletta di <strong>${esc(lesson.title)}</strong> non è ancora stata generata.</p>
      <p>Posso costruirla a partire da ciò che hai scritto nell'argomento, con tempi e passaggi.</p>
      ${chatActionsHTML([
        actionButton("Genera la scaletta", "sparkles", { type: "generate", part: "outline" }),
      ])}`;
  }
  const total = lesson.outline.reduce((sum, step) => sum + step.minutes, 0);
  return `<p>La scaletta attuale copre <strong>${total} minuti</strong> su ${lesson.duration}:</p>
    <ol>${lesson.outline.map((step) => `<li><strong>${esc(step.title)}</strong> · ${step.minutes} min<br><span style="color:var(--muted);font-size:9.5px">${esc(step.detail)}</span></li>`).join("")}</ol>
    ${chatActionsHTML([
      actionButton("Apri la scaletta", "arrow-right", { type: "scroll", section: "outline" }),
    ])}`;
}

function lessonSlidesReply(lesson, cls) {
  if (!lesson.slides.length) {
    return `<p>Non ci sono ancora slide per <strong>${esc(lesson.title)}</strong>.</p>
      <p>Le costruirei in quattro momenti: apertura, concetto, esempio, attività. Poi aggiungerei le didascalie per l'accessibilità.</p>
      ${chatActionsHTML([
        actionButton("Crea le slide", "sparkles", { type: "generate", part: "slides" }),
      ])}`;
  }
  const missing = lesson.slides.filter((slide) => !slide.caption).length;
  return `<p>Ci sono <strong>${lesson.slides.length} slide</strong>${missing ? `, di cui ${missing} senza didascalia` : " con tutte le didascalie"}:</p>
    <ul>${lesson.slides.map((slide) => `<li><strong>${esc(slide.title)}</strong>${slide.caption ? "" : " · <span style='color:var(--amber)'>didascalia mancante</span>"}</li>`).join("")}</ul>
    ${chatActionsHTML([
      actionButton("Presenta le slide", "presentation", { type: "present" }),
      missing ? actionButton("Scrivi le didascalie", "subtitles", { type: "generate", part: "captions" }) : actionButton("Apri le slide", "arrow-right", { type: "scroll", section: "slides" }),
    ])}`;
}

function lessonMaterialsReply(lesson, cls) {
  if (!lesson.materials.length) {
    return `<p>Per <strong>${esc(lesson.title)}</strong> non ci sono ancora materiali.</p>
      <p>Preparerei tre elementi: una scheda con esercizi graduati, un quiz breve e un'attività di coppia con griglia di osservazione.</p>
      ${chatActionsHTML([
        actionButton("Genera i materiali", "sparkles", { type: "generate", part: "materials" }),
      ])}`;
  }
  return `<p>I materiali della lezione sono pronti:</p>
    <ul>${lesson.materials.map((material) => `<li><strong>${esc(material.name)}</strong> · ${esc(material.desc)}</li>`).join("")}</ul>
    <p>Se vuoi, posso prepararne uno nuovo a partire dalle domande di verifica.</p>
    ${chatActionsHTML([
      actionButton("Apri i materiali", "folder", { type: "scroll", section: "materials" }),
    ])}`;
}

function lessonFallbackReply(lesson, cls, text) {
  return `<p>Su «${esc(truncate(text || "questa richiesta", 70))}» non ho contenuti specifici nella demo. Posso lavorare sulla lezione <strong>${esc(lesson.title)}</strong> in tre modi:</p>
    <ul>
      <li>semplificare i concetti con analogie e un esempio;</li>
      <li>costruire domande di verifica o un esempio pratico;</li>
      <li>generare scaletta, slide, didascalie e materiali.</li>
    </ul>
    ${suggestionsHTML([
      { label: "Semplifica i concetti", text: "Semplifica i concetti della lezione." },
      { label: "Un esempio pratico", text: "Costruisci un esempio pratico." },
      { label: "3 domande di verifica", text: "Prepara domande di verifica." },
    ])}`;
}

/* ---------- Handler azioni chat ---------- */

function handleAction(id, options = {}) {
  const action = actionRegistry.get(id);
  if (!action) return;
  switch (action.type) {
    case "copy":
      copyText(action.text);
      break;
    case "download":
      downloadText(action.filename, action.text);
      showToast("File pronto: download avviato.");
      break;
    case "prompt": {
      const kind = action.kind || "class";
      if (kind === "student" && !currentStudent()) {
        showToast("Seleziona prima uno studente.");
        return;
      }
      if (kind === "lesson" && !currentLesson()) {
        showToast("Seleziona prima una lezione.");
        return;
      }
      sendChat(kind, action.text, action.intent || null);
      if (!options.fromChat) flashChat(kind);
      break;
    }
    case "open-student":
      openStudent(action.studentId);
      break;
    case "open-lesson":
      openLesson(action.lessonId);
      break;
    case "generate":
      generateLessonPart(action.part);
      break;
    case "add-step": {
      const cls = currentClass();
      const lesson = cls.lessons.find((item) => item.id === action.lessonId) || currentLesson();
      if (!lesson) return;
      if (lesson.outline.some((step) => step.title === action.step.title)) {
        showToast("Questo esempio è già nella scaletta.");
        return;
      }
      lesson.outline.push({ ...action.step });
      markSaved();
      renderLessonRail();
      if (state.lessonId === lesson.id) {
        renderLessonSections();
        scrollToLessonSection("outline");
      }
      refreshChatGreetingIfPristine("lesson");
      showToast("Esempio aggiunto alla scaletta.");
      break;
    }
    case "scroll":
      scrollToLessonSection(action.section);
      break;
    case "present":
      openSlideDialog(currentLesson(), 0);
      break;
    case "toast":
      showToast(action.text);
      break;
    default:
      break;
  }
}

/* ---------- Rendering: chrome, studenti, lezioni ---------- */

function renderChrome() {
  const cls = currentClass();
  const select = $("#class-select");
  if (select) select.value = cls.id;
  $$("[data-current-class]").forEach((element) => { element.textContent = cls.short; });
  document.title = `Cattedra — ${cls.short} · ${cls.subject}`;
  const classCount = $("#class-students-count");
  const studentCount = $("#student-students-count");
  if (classCount) classCount.textContent = String(cls.students.length);
  if (studentCount) studentCount.textContent = String(cls.students.length);
  const classLessonsCount = $("#class-lessons-count");
  const lessonCount = $("#lesson-count");
  if (classLessonsCount) classLessonsCount.textContent = String(cls.lessons.length);
  if (lessonCount) lessonCount.textContent = String(cls.lessons.length);

  const studentRailContext = $("#student-rail-context");
  if (studentRailContext) {
    studentRailContext.innerHTML = `<strong>Media ${fmt(cls.stats.avg)}</strong> · ${cls.stats.follow.length} da seguire · ${cls.students.length} studenti`;
  }
  const lessonRailContext = $("#lesson-rail-context");
  if (lessonRailContext) {
    lessonRailContext.innerHTML = `<strong>${esc(cls.short)}</strong> · ${esc(cls.curriculum)}`;
  }
}

function renderStudentLists() {
  const cls = currentClass();
  const query = normalize(state.search.trim());
  const filtered = cls.students.filter((student) => normalize(student.name).includes(query));
  const html = filtered.length
    ? filtered.map(studentRowHTML).join("")
    : `<li class="list-empty">Nessuno studente trovato.<br>Prova con un altro nome.</li>`;
  const classList = $("#class-student-list");
  const studentList = $("#student-student-list");
  if (classList) classList.innerHTML = html;
  if (studentList) studentList.innerHTML = html;
}

function renderPulse() {
  const cls = currentClass();
  const stats = cls.stats;
  const pulse = $("#class-pulse");
  if (!pulse) return;
  const legendLabel = `${stats.bands.high} solidi · ${stats.bands.mid} in consolidamento · ${stats.bands.low} da seguire`;
  pulse.innerHTML = `
    <div class="pulse-metrics">
      <div class="pulse-metric"><span>Media classe</span><strong>${fmt(stats.avg)}</strong></div>
      <div class="pulse-metric"><span>Da seguire</span><strong class="is-low">${stats.follow.length}</strong></div>
    </div>
    <div class="pulse-bar" role="img" aria-label="Distribuzione delle medie. ${legendLabel}">
      ${stats.distribution.map((student) => `<span class="pulse-seg${student.band === "mid" ? " is-mid" : student.band === "low" ? " is-low" : ""}" title="${esc(student.name)}: ${fmt(student.avg)}" aria-hidden="true"></span>`).join("")}
    </div>
    <div class="pulse-legend" aria-hidden="true">
      <span><i></i>${stats.bands.high} solidi</span>
      <span><i class="is-mid"></i>${stats.bands.mid} in consolidamento</span>
      <span><i class="is-low"></i>${stats.bands.low} da seguire</span>
    </div>`;
}

function renderClassLessons() {
  const cls = currentClass();
  const container = $("#class-lessons-list");
  if (container) container.innerHTML = lessonListHTML(cls);
}

function renderLessonRail() {
  const cls = currentClass();
  const container = $("#lesson-list");
  if (container) container.innerHTML = lessonListHTML(cls);
}

function renderAll() {
  renderChrome();
  renderStudentLists();
  renderPulse();
  renderClassLessons();
  renderLessonRail();
  renderStudentDossier();
  renderLessonWorkspace();
  renderChat("class");
  renderChat("student");
  renderChat("lesson");
  updateTabUI();
}

/* ---------- Navigazione ---------- */

function setInputsForContext(kind) {
  const input = chatEls[kind]?.input;
  if (input) {
    input.value = "";
    autoGrowTextarea(input);
  }
  renderAttachments(kind);
}

function openStudent(studentId) {
  state.studentId = studentId;
  state.tab = "studente";
  setInputsForContext("student");
  renderAll();
  updateTabUI();
  announce(`Scheda di ${currentStudent().name} aperta.`);
  requestAnimationFrame(() => $("#student-name")?.focus({ preventScroll: true }));
  if (window.innerWidth < 1180) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function openLesson(lessonId) {
  state.lessonId = lessonId;
  state.tab = "lezione";
  setInputsForContext("lesson");
  renderAll();
  updateTabUI();
  announce(`Lezione ${currentLesson().title} aperta.`);
  requestAnimationFrame(() => $("#panel-lezione")?.focus({ preventScroll: true }));
  if (window.innerWidth < 1180) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function switchTab(tab, { focusTab = false } = {}) {
  state.tab = tab;
  updateTabUI();
  if (focusTab) {
    const button = $(`#tab-${tab}`);
    button?.focus();
  }
  const labels = { classe: "Classe", studente: "Studente", lezione: "Lezione" };
  announce(`Vista ${labels[tab]} aperta.`);
  if (window.innerWidth < 960) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function updateTabUI() {
  const tabs = ["classe", "studente", "lezione"];
  tabs.forEach((tab) => {
    const button = $(`#tab-${tab}`);
    const panel = $(`#panel-${tab}`);
    const active = state.tab === tab;
    if (button) {
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    }
    if (panel) panel.hidden = !active;
  });
}

function changeClass(classId) {
  const cls = CLASSES.find((item) => item.id === classId);
  if (!cls) return;
  state.classId = classId;
  state.studentId = defaultStudentId(cls);
  state.lessonId = defaultLessonId(cls);
  state.search = "";
  $$(".search-box input").forEach((input) => { input.value = ""; });
  setInputsForContext("class");
  setInputsForContext("student");
  setInputsForContext("lesson");
  renderAll();
  announce(`Classe ${cls.short} caricata.`);
  showToast(`Classe ${cls.short} caricata.`);
}

/* ---------- Dossier studente ---------- */

function renderStudentDossier() {
  const container = $("#student-dossier");
  if (!container) return;
  const student = currentStudent();
  const cls = currentClass();
  if (!student) {
    container.innerHTML = `<div class="panel"><div class="empty-state"><div class="empty-icon">${icon("user")}</div><h3>Nessuno studente selezionato</h3><p>Scegli uno studente dalla colonna a sinistra per aprire la scheda.</p></div></div>`;
    return;
  }
  const actionLabel = student.avg >= 8 ? "Crea un approfondimento" : student.avg < 6.5 ? "Prepara un recupero" : "Prepara un consolidamento";
  const errorList = student.errors.map((error) => `<div class="error-item">
      <span class="error-mark" aria-hidden="true"></span>
      <div class="error-main">
        <div class="error-title"><span>${esc(error.label)}</span><span class="error-count">${error.count}</span></div>
        <p class="error-note">${esc(error.note)}</p>
        <p class="error-source">${esc(error.source)}</p>
      </div>
    </div>`).join("");
  const docRows = student.docs.map((doc, index) => {
    const iconName = doc.kind === "pdf" ? "file" : doc.kind === "moduli" ? "clipboard" : doc.kind === "pratico" || doc.kind === "teorico" ? "cap" : "file";
    return `<li>
      <button type="button" class="doc-row" data-open-doc="${index}" aria-label="Apri ${esc(doc.title)}, ${esc(doc.typeLabel)}, ${esc(doc.date)}">
        <span class="doc-icon doc-icon--${doc.kind}" aria-hidden="true">${icon(iconName)}</span>
        <span class="doc-main">
          <span class="doc-title">${esc(doc.title)}</span>
          <span class="doc-meta">${esc(doc.typeLabel)} · ${esc(doc.date)}${doc.kind === "pdf" ? " · caricato dallo studente" : ""}</span>
        </span>
        ${doc.score !== null ? `<span class="doc-score${doc.score < 6 ? " is-low" : doc.score >= 8 ? " is-high" : ""}">${fmtHalf(doc.score)}</span>` : ""}
        ${icon("chevron-right", "doc-chevron")}
      </button>
    </li>`;
  }).join("");
  container.innerHTML = `
    <section class="panel student-card" aria-label="Riepilogo di ${esc(student.name)}">
      <div class="student-top">
        <span class="avatar avatar--xl avatar--tone-${student.avatarTone}" aria-hidden="true">${esc(student.initials)}</span>
        <div class="student-id">
          <div class="student-tags">
            <span class="pill">${esc(cls.short)} · ${esc(cls.subject)}</span>
            <span class="status-tag status-tag--${student.status.tone}">${esc(student.status.label)}</span>
          </div>
          <h1 id="student-name" tabindex="-1">${esc(student.name)}</h1>
          <p>Ultima attività · ${esc(student.lastActivity)} · ${student.assessmentsCount} valutazioni</p>
        </div>
        <div class="student-actions">
          <button type="button" class="btn btn-secondary" data-download-student>${icon("download")} Scarica scheda</button>
          <button type="button" class="btn btn-primary" data-student-recovery>${icon("sparkles")} ${actionLabel}</button>
        </div>
      </div>
      <div class="student-figures">
        <div class="figure-main">
          ${scoreRingHTML(student.avg, true)}
          <div class="meta-stack">
            <span class="figure-label">Media attuale</span>
            <strong class="${student.trend < -0.05 ? "is-down" : student.trend > 0.05 ? "is-up" : ""}">${signed(student.trend)}</strong>
            <small>vs mese scorso</small>
          </div>
        </div>
        <div class="figure"><span>Valutazioni</span><strong>${student.assessmentsCount}</strong><small>ultima ${fmtHalf(student.lastScore)}</small></div>
        <div class="figure"><span>Materiali</span><strong>${student.pdfCount}</strong><small>PDF caricati</small></div>
        <div class="figure"><span>Da consolidare</span><strong>${student.errors.length}</strong><small>argomenti</small></div>
      </div>
    </section>

    <section class="insight-card" aria-label="Lettura dell'AI">
      <span class="insight-icon" aria-hidden="true">${icon("sparkles")}</span>
      <div class="insight-body">
        <p class="eyebrow">Lettura dell'AI</p>
        <p>${esc(student.insight)}</p>
      </div>
      <button type="button" class="btn btn-soft" data-student-deepen>Approfondisci</button>
    </section>

    <section class="panel" aria-label="Errori ricorrenti e note">
      <div class="card-head">
        <div>
          <p class="eyebrow">Da consolidare</p>
          <h2>Errori ricorrenti</h2>
          <p class="card-head-meta">Ordinati per frequenza nelle valutazioni</p>
        </div>
        <span class="count-badge">${student.errors.length}</span>
      </div>
      <div class="errors-body">
        <div class="strengths" aria-label="Punti di forza">
          ${student.strengths.map((strength) => `<span class="strength">${icon("check")}${esc(strength)}</span>`).join("")}
        </div>
        ${errorList}
        <div class="chat-actions">
          ${actionButton("Chiedi un piano", "sparkles", { type: "prompt", kind: "student", text: "Prepara un piano personalizzato.", intent: "recovery" })}
          ${actionButton("Genera una verifica", "edit", { type: "prompt", kind: "student", text: "Genera una verifica su misura.", intent: "quiz" })}
        </div>
      </div>
      <div class="teacher-note">
        ${icon("quote")}
        <div><strong>Nota del docente · 28 ott</strong>${esc(student.note)}</div>
      </div>
    </section>

    <section class="panel" aria-label="Materiali e valutazioni">
      <div class="card-head">
        <div>
          <p class="eyebrow">Storico</p>
          <h2>Materiali e valutazioni</h2>
          <p class="card-head-meta">${student.docs.length} elementi · PDF, moduli, test ed esami</p>
        </div>
        <span class="count-badge">${student.docs.length}</span>
      </div>
      <ul class="doc-list">${docRows}</ul>
    </section>`;
}

function openStudentDoc(index) {
  const student = currentStudent();
  const cls = currentClass();
  const doc = student?.docs[index];
  if (!doc) return;
  const copy = studentDocText(student, doc, cls);
  const iconName = doc.kind === "pdf" ? "file" : doc.kind === "moduli" ? "clipboard" : doc.kind === "pratico" || doc.kind === "teorico" ? "cap" : "file";
  openDialog(`
    <div class="dialog-inner">
      <div class="dialog-head">
        <div>
          <p class="eyebrow">${esc(student.name)} · ${esc(doc.typeLabel)}</p>
          <h2>${esc(doc.title)}</h2>
        </div>
        <button type="button" class="dialog-close" data-close-dialog aria-label="Chiudi">${icon("x")}</button>
      </div>
      <div class="material-detail-meta">
        <span class="pill">${icon(iconName)} ${esc(doc.typeLabel)}</span>
        <span class="pill">${esc(doc.date)}</span>
        ${doc.score !== null ? `<span class="pill">Valutazione ${fmtHalf(doc.score)}/10</span>` : `<span class="pill">Materiale caricato</span>`}
      </div>
      <div class="material-detail">
        ${doc.score !== null ? `<span class="detail-score">${fmtHalf(doc.score)}<small>/10</small></span>` : ""}
        <p>${esc(doc.detail)}</p>
        ${doc.comment ? `<p class="detail-comment">${esc(doc.comment)}</p>` : ""}
      </div>
      <div class="dialog-actions">
        ${actionButton("Scarica copia demo", "download", { type: "download", filename: `${slugify(doc.title)}-${slugify(student.name)}.txt`, text: copy })}
        <button type="button" class="btn btn-secondary" data-close-dialog>Chiudi</button>
      </div>
    </div>`);
}

/* ---------- Pianificatore lezione ---------- */

function mountLessonWorkspace() {
  const container = $("#lesson-workspace");
  if (!container) return;
  container.innerHTML = `
    <section class="panel lesson-editor-head" aria-label="Intestazione della lezione">
      <div class="lesson-kicker">
        <span class="kicker-pill">Lezione <span data-lesson-number>—</span></span>
        <span data-lesson-when>—</span>
        <span class="save-note" data-save-note>${icon("check")} Salvataggio automatico</span>
      </div>
      <label class="sr-only" for="lesson-title-input">Titolo della lezione</label>
      <input id="lesson-title-input" class="lesson-title-input" data-lesson-title value="" placeholder="Titolo della lezione" />
      <div class="lesson-meta-row">
        <span class="meta-chip">${icon("book")}<span data-lesson-class>—</span></span>
        <span class="meta-chip">${icon("clock")}<span data-lesson-duration>—</span></span>
        <span class="meta-chip">${icon("target")}<span data-lesson-room>—</span></span>
        <span class="status-select-wrap">
          <label class="sr-only" for="lesson-status">Stato della lezione</label>
          <select id="lesson-status" data-lesson-status>
            <option value="draft">Bozza</option>
            <option value="planned">In programma</option>
            <option value="today">Oggi</option>
            <option value="done">Completata</option>
          </select>
          ${icon("chevron-down")}
        </span>
        <button type="button" class="btn btn-secondary btn-compact" data-download-lesson>${icon("download")} Scarica</button>
      </div>
    </section>

    <section class="panel lesson-brief" aria-labelledby="lesson-brief-title">
      <div class="brief-head">
        <div>
          <p class="eyebrow">Prepara</p>
          <h2 id="lesson-brief-title">Cosa vuoi spiegare?</h2>
        </div>
        <span class="brief-ai">${icon("sparkles")} AI didattica</span>
      </div>
      <label class="sr-only" for="lesson-topic-input">Argomento e obiettivi della lezione</label>
      <textarea id="lesson-topic-input" class="lesson-topic-input" data-lesson-topic rows="3" placeholder="Descrivi in poche righe obiettivi, dubbi e collegamenti con le lezioni precedenti."></textarea>
      <div class="brief-actions">
        <div class="gen-toolbar" aria-label="Genera singoli elementi">
          <span class="toolbar-label">Genera</span>
          <button type="button" class="gen-chip" data-gen-part="outline">${icon("list")} Scaletta</button>
          <button type="button" class="gen-chip" data-gen-part="slides">${icon("presentation")} Slide</button>
          <button type="button" class="gen-chip" data-gen-part="captions">${icon("subtitles")} Didascalie</button>
          <button type="button" class="gen-chip" data-gen-part="materials">${icon("folder")} Materiali</button>
        </div>
        <button type="button" class="btn btn-primary" data-generate-all>${icon("sparkles")} Completa con AI</button>
      </div>
    </section>

    <section class="panel plan-card" data-section="outline" aria-labelledby="outline-title">
      <div class="plan-head">
        <div>
          <p class="eyebrow">Struttura</p>
          <h2 id="outline-title">Scaletta</h2>
          <p class="plan-hint">I titoli e le descrizioni sono modificabili: clicca e scrivi.</p>
        </div>
        <div class="plan-head-actions">
          <span class="plan-badge" data-outline-total>—</span>
          <button type="button" class="icon-btn" data-copy-outline aria-label="Copia la scaletta" title="Copia la scaletta">${icon("copy")}</button>
        </div>
      </div>
      <div class="plan-body" data-outline-body></div>
    </section>

    <section class="panel plan-card" data-section="slides" aria-labelledby="slides-title">
      <div class="plan-head">
        <div>
          <p class="eyebrow">Materiale visivo</p>
          <h2 id="slides-title">Slide</h2>
          <p class="plan-hint">Clicca una slide per aprirne l'anteprima.</p>
        </div>
        <div class="plan-head-actions">
          <span class="plan-badge" data-slide-count>—</span>
          <button type="button" class="btn btn-secondary btn-compact" data-present-slides>${icon("play")} Presenta</button>
        </div>
      </div>
      <div class="plan-body" data-slides-body></div>
    </section>

    <section class="panel plan-card" data-section="materials" aria-labelledby="materials-title">
      <div class="plan-head">
        <div>
          <p class="eyebrow">Da portare in classe</p>
          <h2 id="materials-title">Materiali</h2>
          <p class="plan-hint">Schede, quiz e attività scaricabili in formato testo.</p>
        </div>
        <span class="plan-badge" data-material-count>—</span>
      </div>
      <div class="plan-body" data-materials-body></div>
    </section>`;

  const workspace = container;
  const titleInput = $("[data-lesson-title]", workspace);
  const topicInput = $("[data-lesson-topic]", workspace);
  const statusSelect = $("[data-lesson-status]", workspace);

  titleInput.addEventListener("input", () => {
    const lesson = currentLesson();
    if (!lesson) return;
    lesson.title = titleInput.value || "Senza titolo";
    renderLessonRail();
    renderClassLessons();
    refreshChatGreetingIfPristine("lesson");
    markSaved();
  });

  titleInput.addEventListener("blur", () => {
    const lesson = currentLesson();
    if (!lesson) return;
    if (!titleInput.value.trim()) {
      lesson.title = "Nuova lezione";
      titleInput.value = lesson.title;
      renderLessonRail();
      renderClassLessons();
    }
  });

  topicInput.addEventListener("input", () => {
    const lesson = currentLesson();
    if (!lesson) return;
    lesson.topic = topicInput.value;
    markSaved();
  });

  statusSelect.addEventListener("change", () => {
    const lesson = currentLesson();
    if (!lesson) return;
    lesson.status = statusSelect.value;
    renderLessonRail();
    renderClassLessons();
    renderLessonShell();
    markSaved();
    showToast(`Stato aggiornato: ${lessonStatusLabel(lesson.status)}.`);
  });

  workspace.addEventListener("click", (event) => {
    const genPart = event.target.closest("[data-gen-part]");
    if (genPart) {
      handleGeneratePartClick(genPart.dataset.genPart);
      return;
    }
    if (event.target.closest("[data-generate-all]")) {
      generateMissingParts();
      return;
    }
    if (event.target.closest("[data-present-slides]")) {
      openSlideDialog(currentLesson(), 0);
      return;
    }
    if (event.target.closest("[data-copy-outline]")) {
      const lesson = currentLesson();
      if (!lesson?.outline.length) {
        showToast("La scaletta non è ancora stata generata.");
        return;
      }
      copyText(lesson.outline.map((step, index) => `${index + 1}. ${step.title} (${step.minutes} min)\n${step.detail}`).join("\n\n"));
      return;
    }
    if (event.target.closest("[data-download-lesson]")) {
      const lesson = currentLesson();
      if (!lesson) return;
      downloadText(`${slugify(lesson.title)}.txt`, lessonMarkdown(lesson, currentClass()));
      showToast("Lezione scaricata in formato testo.");
      return;
    }
    const downloadMaterial = event.target.closest("[data-download-material]");
    if (downloadMaterial) {
      const lesson = currentLesson();
      const index = Number(downloadMaterial.dataset.downloadMaterial);
      const material = lesson?.materials[index];
      if (!material) return;
      downloadText(`${slugify(material.name)}.txt`, materialText(lesson, material, currentClass()));
      showToast(`Materiale pronto: ${material.name}.`);
      return;
    }
    const slideButton = event.target.closest("[data-slide-open]");
    if (slideButton) {
      openSlideDialog(currentLesson(), Number(slideButton.dataset.slideOpen));
    }
  });

  workspace.addEventListener("input", (event) => {
    const field = event.target.closest("[data-step-field]");
    if (!field) return;
    const stepElement = field.closest(".outline-step");
    const lesson = currentLesson();
    if (!stepElement || !lesson) return;
    const index = Number(stepElement.dataset.stepIndex);
    const step = lesson.outline[index];
    if (!step) return;
    const fieldName = field.dataset.stepField;
    if (fieldName === "minutes") {
      step.minutes = clamp(Number(field.value) || 0, 0, 180);
      updateOutlineTotal(lesson);
    } else {
      step[fieldName] = field.textContent.trim();
    }
    markSaved();
  });
}

function markSaved() {
  const note = $("[data-save-note]");
  if (!note) return;
  note.innerHTML = `${icon("check")} Salvato ora`;
  clearTimeout(saveNoteTimer);
  saveNoteTimer = setTimeout(() => {
    note.innerHTML = `${icon("check")} Salvataggio automatico`;
  }, 1500);
}

function renderLessonWorkspace() {
  const container = $("#lesson-workspace");
  if (!container) return;
  if (!container.dataset.mounted) {
    mountLessonWorkspace();
    container.dataset.mounted = "true";
  }
  renderLessonShell();
  renderLessonSections();
}

function renderLessonShell() {
  const lesson = currentLesson();
  const cls = currentClass();
  const container = $("#lesson-workspace");
  if (!lesson || !container) return;
  const active = document.activeElement;
  const titleInput = $("[data-lesson-title]", container);
  const topicInput = $("[data-lesson-topic]", container);
  const statusSelect = $("[data-lesson-status]", container);
  if (titleInput && active !== titleInput) titleInput.value = lesson.title;
  if (topicInput && active !== topicInput) topicInput.value = lesson.topic || "";
  if (statusSelect) statusSelect.value = lesson.status;
  const number = $("[data-lesson-number]", container);
  const when = $("[data-lesson-when]", container);
  const classLabel = $("[data-lesson-class]", container);
  const duration = $("[data-lesson-duration]", container);
  const room = $("[data-lesson-room]", container);
  if (number) number.textContent = lesson.number;
  if (when) when.textContent = lesson.dateLabel.toLowerCase() === "oggi" ? "Oggi" : `${lesson.dateLabel} · ${lessonStatusLabel(lesson.status)}`;
  if (classLabel) classLabel.textContent = `${cls.short} · ${cls.subject}`;
  if (duration) duration.textContent = `${lesson.duration} min`;
  if (room) room.textContent = lesson.room || cls.room;
}

function hasLessonPart(lesson, part) {
  if (part === "outline") return lesson.outline.length > 0;
  if (part === "slides") return lesson.slides.length > 0;
  if (part === "captions") return lesson.slides.length > 0 && lesson.slides.every((slide) => slide.caption);
  if (part === "materials") return lesson.materials.length > 0;
  return false;
}

function missingParts(lesson) {
  const parts = [];
  if (!lesson.outline.length) parts.push("outline");
  if (!lesson.slides.length) parts.push("slides");
  if (!lesson.slides.length || lesson.slides.some((slide) => !slide.caption)) parts.push("captions");
  if (!lesson.materials.length) parts.push("materials");
  return parts;
}

function renderLessonSections() {
  const lesson = currentLesson();
  const cls = currentClass();
  const container = $("#lesson-workspace");
  if (!lesson || !container) return;
  const generating = state.generating && state.generating.lessonId === lesson.id ? state.generating.part : null;
  const genAll = Boolean(generating);
  const outlineBody = $("[data-outline-body]", container);
  const slidesBody = $("[data-slides-body]", container);
  const materialsBody = $("[data-materials-body]", container);
  const outlineTotal = $("[data-outline-total]", container);
  const slideCount = $("[data-slide-count]", container);
  const materialCount = $("[data-material-count]", container);

  container.setAttribute("aria-busy", String(genAll));

  if (outlineBody) {
    if (generating === "outline") {
      outlineBody.innerHTML = skeletonHTML(3);
    } else if (!lesson.outline.length) {
      outlineBody.innerHTML = emptyStateHTML({
        iconName: "list",
        title: "La scaletta non è ancora pronta",
        text: "Descrivi l'argomento e genera una struttura con tempi, oppure costruiscila passo per passo.",
        button: { label: "Genera scaletta", action: "gen", part: "outline" },
      });
    } else {
      outlineBody.innerHTML = outlineHTML(lesson);
    }
  }

  if (slidesBody) {
    if (generating === "slides" || generating === "captions") {
      slidesBody.innerHTML = skeletonHTML(3);
    } else if (!lesson.slides.length) {
      slidesBody.innerHTML = emptyStateHTML({
        iconName: "presentation",
        title: "Nessuna slide ancora",
        text: "Le slide seguono la scaletta: apertura, concetto, esempio e attività. Puoi aggiungere le didascalie dopo.",
        button: { label: "Crea slide", action: "gen", part: "slides" },
      });
    } else {
      slidesBody.innerHTML = slidesHTML(lesson);
    }
  }

  if (materialsBody) {
    if (generating === "materials") {
      materialsBody.innerHTML = skeletonHTML(2);
    } else if (!lesson.materials.length) {
      materialsBody.innerHTML = emptyStateHTML({
        iconName: "folder",
        title: "I materiali non sono ancora pronti",
        text: "Genera una scheda, un quiz e un'attività di coppia a partire dalla lezione.",
        button: { label: "Genera materiali", action: "gen", part: "materials" },
      });
    } else {
      materialsBody.innerHTML = materialsHTML(lesson);
    }
  }

  if (outlineTotal) {
    if (lesson.outline.length) {
      const total = lesson.outline.reduce((sum, step) => sum + Number(step.minutes || 0), 0);
      outlineTotal.textContent = `${total} / ${lesson.duration} min`;
      outlineTotal.classList.toggle("is-over", total > lesson.duration);
    } else {
      outlineTotal.textContent = "Da generare";
      outlineTotal.classList.remove("is-over");
    }
  }
  if (slideCount) slideCount.textContent = lesson.slides.length ? `${lesson.slides.length} slide` : "Nessuna";
  if (materialCount) materialCount.textContent = lesson.materials.length ? `${lesson.materials.length} materiali` : "Nessuno";

  const captionBar = $("[data-caption-status]", container);
  if (captionBar) {
    if (!lesson.slides.length) {
      captionBar.innerHTML = `<span>Le didascalie serviranno dopo aver creato le slide.</span>`;
      captionBar.classList.remove("is-complete");
    } else {
      const missing = lesson.slides.filter((slide) => !slide.caption).length;
      if (missing) {
        captionBar.classList.remove("is-complete");
        captionBar.innerHTML = `${icon("alert")}<span>${missing} ${missing === 1 ? "slide senza didascalia" : "slide senza didascalie"}. Le didascalie rendono la lezione accessibile e più chiara.</span><button type="button" class="link-btn" data-gen-part="captions">Scrivi didascalie</button>`;
      } else {
        captionBar.classList.add("is-complete");
        captionBar.innerHTML = `${icon("check")}<span>Didascalie presenti per tutte le slide.</span>`;
      }
    }
  }

  const presentButton = $("[data-present-slides]", container);
  if (presentButton) {
    presentButton.disabled = !lesson.slides.length || Boolean(generating);
    presentButton.title = lesson.slides.length ? "Apri l'anteprima delle slide" : "Crea prima le slide";
  }

  updateGenToolbar(container, lesson, generating);
  genAllSectionsBusy(container, genAll, generating);
}

function genAllSectionsBusy(container, genAll, generating) {
  $$("[data-gen-part]", container).forEach((button) => {
    const part = button.dataset.genPart;
    button.disabled = Boolean(generating) || (part === "captions" && !currentLesson()?.slides.length);
    if (part === "captions" && !currentLesson()?.slides.length) {
      button.title = "Crea prima le slide";
    } else {
      button.title = "";
    }
  });
  $$(".plan-body", container).forEach((body) => body.setAttribute("aria-busy", String(genAll)));
}

function updateGenToolbar(container, lesson, generating) {
  $$(".gen-chip[data-gen-part]", container).forEach((button) => {
    const part = button.dataset.genPart;
    const done = hasLessonPart(lesson, part);
    button.classList.toggle("is-done", done);
    button.classList.toggle("is-missing", !done);
    const spinner = generating === part || (generating === "captions" && part === "captions");
    if (spinner && !button.querySelector(".spinner")) {
      button.innerHTML = `<span class="spinner" aria-hidden="true"></span> ${button.textContent.trim()}`;
    }
    if (!spinner && button.querySelector(".spinner")) {
      const labels = { outline: "Scaletta", slides: "Slide", captions: "Didascalie", materials: "Materiali" };
      const iconNames = { outline: "list", slides: "presentation", captions: "subtitles", materials: "folder" };
      button.innerHTML = `${icon(iconNames[part])} ${labels[part]}`;
    }
  });
  const allButton = $("[data-generate-all]", container);
  if (!allButton) return;
  const missing = missingParts(lesson);
  allButton.disabled = Boolean(generating) || missing.length === 0;
  if (generating) {
    allButton.innerHTML = `<span class="spinner" aria-hidden="true"></span> Sto preparando…`;
  } else if (!missing.length) {
    allButton.innerHTML = `${icon("check")} Contenuti pronti`;
  } else {
    allButton.innerHTML = `${icon("sparkles")} Completa con AI`;
  }
}

function skeletonHTML(rows = 3) {
  return `<div class="skeleton-stack" aria-label="Sto generando i contenuti" role="status">${Array.from({ length: rows }).map(() => `<span class="skeleton"></span>`).join("")}</div>`;
}

function emptyStateHTML({ iconName, title, text, button }) {
  return `<div class="empty-state">
    <span class="empty-icon" aria-hidden="true">${icon(iconName)}</span>
    <h3>${esc(title)}</h3>
    <p>${esc(text)}</p>
    ${button ? `<button type="button" class="btn btn-soft btn-compact" data-gen-part="${button.part}">${icon("sparkles")} ${esc(button.label)}</button>` : ""}
  </div>`;
}

function outlineHTML(lesson) {
  const steps = lesson.outline.map((step, index) => `<li class="outline-step" data-step-index="${index}">
    <span class="step-number" aria-hidden="true">${index + 1}</span>
    <div>
      <div class="step-title" contenteditable="true" role="textbox" spellcheck="true" data-step-field="title" aria-label="Titolo del passaggio ${index + 1}">${esc(step.title)}</div>
      <div class="step-detail" contenteditable="true" role="textbox" spellcheck="true" data-step-field="detail" aria-label="Descrizione del passaggio ${index + 1}">${esc(step.detail)}</div>
    </div>
    <label class="step-duration"><input type="number" min="0" max="180" step="5" value="${Number(step.minutes || 0)}" data-step-field="minutes" aria-label="Minuti del passaggio ${index + 1}"><span>min</span></label>
  </li>`).join("");
  const total = lesson.outline.reduce((sum, step) => sum + Number(step.minutes || 0), 0);
  return `<ol class="outline-list">${steps}</ol>
    <div class="outline-total${total > lesson.duration ? " is-over" : ""}">
      <span>${total > lesson.duration ? "La scaletta supera la durata della lezione." : "Tempo pianificato"}</span>
      <strong>${total} / ${lesson.duration} min</strong>
    </div>`;
}

function updateOutlineTotal(lesson) {
  const totalElement = $("[data-outline-total]");
  const total = lesson.outline.reduce((sum, step) => sum + Number(step.minutes || 0), 0);
  if (totalElement) {
    totalElement.textContent = `${total} / ${lesson.duration} min`;
    totalElement.classList.toggle("is-over", total > lesson.duration);
  }
  const footer = $(".outline-total");
  if (footer) {
    footer.classList.toggle("is-over", total > lesson.duration);
    const label = footer.querySelector("span");
    if (label) label.textContent = total > lesson.duration ? "La scaletta supera la durata della lezione." : "Tempo pianificato";
    const strong = footer.querySelector("strong");
    if (strong) strong.textContent = `${total} / ${lesson.duration} min`;
  }
}

function slidesHTML(lesson) {
  return `<div class="slides-strip">${lesson.slides.map((slide, index) => {
    const captionState = slide.caption
      ? `<span class="slide-thumb-foot">${icon("subtitles")} Didascalia pronta</span>`
      : `<span class="slide-thumb-foot is-missing">${icon("alert")} Didascalia mancante</span>`;
    return `<button type="button" class="slide-thumb" data-slide-open="${index}" aria-label="Apri l'anteprima della slide ${index + 1}: ${esc(slide.title)}">
      <span class="slide-thumb-canvas slide-layout--${slide.layout}">
        <span class="slide-thumb-kicker">${esc(slideKicker(slide.layout))}</span>
        <span class="slide-thumb-title">${esc(slide.title)}</span>
        <span class="slide-thumb-dots" aria-hidden="true">${slide.bullets.slice(0, 5).map(() => "<i></i>").join("")}</span>
        <span class="slide-thumb-ord" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
      </span>
      ${captionState}
    </button>`;
  }).join("")}</div>
  <div class="caption-bar" data-caption-status></div>`;
}

function slideKicker(layout) {
  return { title: "Apertura", concept: "Concetto", example: "Esempio", activity: "Attività", recap: "Sintesi" }[layout] || "Slide";
}

function materialsHTML(lesson) {
  return `<div class="material-grid">${lesson.materials.map((material, index) => `<div class="material-card">
    <span class="material-icon material-icon--${material.type}" aria-hidden="true">${icon(material.type === "quiz" ? "clipboard" : material.type === "attivita" ? "users" : "file")}</span>
    <span class="material-main"><span class="material-name">${esc(material.name)}</span><span class="material-desc">${esc(material.desc)}</span></span>
    <button type="button" class="material-dl" data-download-material="${index}" aria-label="Scarica ${esc(material.name)}" title="Scarica (demo .txt)">${icon("download")}</button>
  </div>`).join("")}</div>`;
}

function hasContentForPart(part) {
  const lesson = currentLesson();
  if (!lesson) return false;
  return hasLessonPart(lesson, part);
}

function handleGeneratePartClick(part) {
  const lesson = currentLesson();
  if (!lesson) return;
  if (state.generating) {
    showToast("Sto ancora preparando la lezione.");
    return;
  }
  if (part === "captions" && !lesson.slides.length) {
    showToast("Prima servono le slide.");
    return;
  }
  if (hasLessonPart(lesson, part)) {
    const section = part === "captions" ? "slides" : part;
    scrollToLessonSection(section);
    showToast(
      part === "outline" ? "La scaletta è pronta: puoi modificarla qui."
        : part === "slides" ? "Le slide sono pronte: aprine una per l'anteprima."
          : part === "captions" ? "Le didascalie sono già presenti."
            : "I materiali sono pronti: puoi scaricarli."
    );
    return;
  }
  generateLessonPart(part);
}

async function generateLessonPart(part) {
  const lesson = currentLesson();
  if (!lesson) return;
  if (state.generating) {
    showToast("Sto ancora preparando la lezione.");
    return;
  }
  if (!ensureTopic(lesson)) return;
  state.generating = { lessonId: lesson.id, part };
  renderLessonSections();
  await wait(650);
  applyGeneration(lesson, part);
  state.generating = null;
  if (state.lessonId === lesson.id) {
    renderLessonSections();
    renderLessonShell();
  }
  refreshChatGreetingIfPristine("lesson");
  const labels = { outline: "Scaletta pronta", slides: "Slide create", captions: "Didascalie scritte", materials: "Materiali generati" };
  showToast(`${labels[part] || "Contenuto generato"}.`);
  announce(`${labels[part] || "Contenuto generato"}.`);
}

async function generateMissingParts() {
  const lesson = currentLesson();
  if (!lesson) return;
  if (state.generating) {
    showToast("Sto ancora preparando la lezione.");
    return;
  }
  const missing = missingParts(lesson);
  if (!missing.length) {
    showToast("La lezione è già completa. Puoi modificare i contenuti o generare una singola parte.");
    return;
  }
  if (!ensureTopic(lesson)) return;
  for (const part of missing) {
    state.generating = { lessonId: lesson.id, part };
    renderLessonSections();
    await wait(700);
    applyGeneration(lesson, part);
  }
  state.generating = null;
  if (state.lessonId === lesson.id) {
    renderLessonSections();
    renderLessonShell();
  }
  refreshChatGreetingIfPristine("lesson");
  showToast("Lezione preparata: contenuti e materiali sono pronti.");
  announce("Lezione preparata con l'AI.");
}

function ensureTopic(lesson) {
  if (lesson.topic && lesson.topic.trim().length >= 8) return true;
  showToast("Scrivi prima cosa vuoi spiegare: basta una frase.");
  const input = $("[data-lesson-topic]");
  input?.focus();
  return false;
}

function applyGeneration(lesson, part) {
  if (part === "outline" && !lesson.outline.length) {
    lesson.outline = genericOutline(lesson.title, lesson.duration);
    return;
  }
  if (part === "slides" && !lesson.slides.length) {
    lesson.slides = genericSlides(lesson.title);
    return;
  }
  if (part === "captions") {
    lesson.slides.forEach((slide) => {
      slide.caption = slide.captionDraft || genericCaption(slide);
    });
    return;
  }
  if (part === "materials" && !lesson.materials.length) {
    lesson.materials = lesson.materialDrafts && lesson.materialDrafts.length
      ? lesson.materialDrafts.map((material) => ({ ...material }))
      : genericMaterials(lesson.title);
  }
}

function scrollToLessonSection(section) {
  const container = $(`.plan-card[data-section="${section}"]`);
  if (!container) return;
  container.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- Dialoghi ---------- */

const dialog = $("#app-dialog");

function openDialog(html) {
  if (!dialog) return;
  dialog.innerHTML = html;
  if (!dialog.open) dialog.showModal();
}

function openSlideDialog(lesson, index = 0) {
  if (!lesson || !lesson.slides.length) {
    showToast("Crea prima le slide della lezione.");
    return;
  }
  state.slideDialog = { type: "slides", lesson, index: clamp(index, 0, lesson.slides.length - 1) };
  renderSlideDialog();
  if (!dialog.open) dialog.showModal();
  dialog.querySelector(".slide-stage")?.focus({ preventScroll: true });
}

function renderSlideDialog() {
  const context = state.slideDialog;
  if (!context) return;
  const { lesson, index } = context;
  const cls = currentClass();
  const slide = lesson.slides[index];
  if (!slide) return;
  const dots = lesson.slides.map((item, dotIndex) => `<button type="button" data-slide-goto="${dotIndex}" aria-label="Vai alla slide ${dotIndex + 1}" aria-current="${dotIndex === index}"></button>`).join("");
  const copy = `${slide.title}\n${slide.bullets.map((bullet) => `- ${bullet}`).join("\n")}\n\nDidascalia: ${slide.caption || "da scrivere"}`;
  openDialog(`
    <div class="dialog-inner">
      <div class="dialog-head">
        <div>
          <p class="eyebrow">Lezione ${esc(lesson.number)} · Slide ${index + 1} di ${lesson.slides.length}</p>
          <h2>${esc(lesson.title)}</h2>
        </div>
        <button type="button" class="dialog-close" data-close-dialog aria-label="Chiudi anteprima">${icon("x")}</button>
      </div>
      <div class="slide-stage slide-layout--${slide.layout}" tabindex="-1" aria-label="Anteprima della slide ${index + 1}: ${esc(slide.title)}">
        <span class="slide-brandline">${esc(cls.short)} · ${esc(lesson.title)}</span>
        <h3>${esc(slide.title)}</h3>
        <ul>${slide.bullets.map((bullet) => `<li>${esc(bullet)}</li>`).join("")}</ul>
        <span class="slide-ord-big" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
      </div>
      <div class="slide-caption">
        <strong>Didascalia</strong>
        <p class="${slide.caption ? "" : "is-missing"}">${esc(slide.caption || "Non ancora generata. Puoi scriverla dal pianificatore, nella sezione Slide.")}</p>
      </div>
      <div class="slide-footer">
        <div class="slide-nav-buttons">
          <button type="button" class="icon-btn" data-slide-prev aria-label="Slide precedente" ${index === 0 ? "disabled" : ""}>${icon("arrow-left")}</button>
          <button type="button" class="icon-btn" data-slide-next aria-label="Slide successiva" ${index === lesson.slides.length - 1 ? "disabled" : ""}>${icon("arrow-right")}</button>
        </div>
        <div class="slide-dots" aria-label="Vai a una slide">${dots}</div>
      </div>
      <div class="dialog-actions">
        ${actionButton("Copia slide", "copy", { type: "copy", text: copy })}
        <button type="button" class="btn btn-secondary" data-close-dialog>Chiudi</button>
      </div>
    </div>`);
}

function navigateSlide(offset) {
  const context = state.slideDialog;
  if (!context) return;
  const nextIndex = clamp(context.index + offset, 0, context.lesson.slides.length - 1);
  if (nextIndex === context.index) return;
  context.index = nextIndex;
  renderSlideDialog();
  dialog.querySelector(".slide-stage")?.focus({ preventScroll: true });
}

function closeDialog() {
  if (dialog?.open) dialog.close();
}

/* ---------- Eventi globali ---------- */

function bindEvents() {
  $("#class-select").addEventListener("change", (event) => changeClass(event.target.value));

  $$(".tab-btn").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });

  $(".main-tabs").addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const tabs = ["classe", "studente", "lezione"];
    const currentIndex = tabs.indexOf(state.tab);
    let nextIndex = currentIndex;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    switchTab(tabs[nextIndex], { focusTab: true });
  });

  $$(".search-box input").forEach((input) => {
    input.addEventListener("input", (event) => {
      state.search = event.target.value;
      $$(".search-box input").forEach((other) => {
        if (other !== event.target) other.value = event.target.value;
      });
      renderStudentLists();
    });
  });

  document.addEventListener("click", (event) => {
    const suggest = event.target.closest("[data-suggest]");
    if (suggest) {
      const panel = suggest.closest("[data-chat-kind]");
      const kind = panel?.dataset.chatKind;
      if (!kind) return;
      if (isChatBusy(kind)) {
        showToast("Attendi la risposta dell'assistente.");
        return;
      }
      sendChat(kind, suggest.dataset.suggest);
      return;
    }

    const studentButton = event.target.closest("[data-open-student]");
    if (studentButton) {
      openStudent(studentButton.dataset.openStudent);
      return;
    }
    const lessonButton = event.target.closest("[data-open-lesson]");
    if (lessonButton) {
      openLesson(lessonButton.dataset.openLesson);
      return;
    }
    const goTab = event.target.closest("[data-go-tab]");
    if (goTab) {
      switchTab(goTab.dataset.goTab);
      return;
    }
    const quick = event.target.closest("[data-quick]");
    if (quick) {
      if (isChatBusy("class")) {
        showToast("Attendi la risposta dell'assistente.");
        return;
      }
      const prompts = {
        questions: { text: "Quali domande probabili posso fare all'orale?", intent: "questions" },
        exercises: { text: "Crea esercizi su misura per la classe.", intent: "exercises" },
        concept: { text: "Prepara uno schema concettuale sui concetti chiave.", intent: "concept" },
        skills: { text: "Mostrami lo stato delle competenze della classe.", intent: "skills" },
      };
      const prompt = prompts[quick.dataset.quick];
      if (!prompt) return;
      sendChat("class", prompt.text, prompt.intent);
      return;
    }
    const action = event.target.closest("[data-action-id]");
    if (action) {
      const chatPanel = action.closest("[data-chat-kind]");
      if (chatPanel && isChatBusy(chatPanel.dataset.chatKind)) {
        showToast("Attendi la risposta dell'assistente.");
        return;
      }
      handleAction(action.dataset.actionId, { fromChat: Boolean(chatPanel) });
      return;
    }
    if (event.target.closest("[data-student-recovery]")) {
      const student = currentStudent();
      if (!student) return;
      sendChat(
        "student",
        student.avg >= 8 ? "Prepara un approfondimento." : student.avg < 6.5 ? "Prepara un recupero." : "Prepara un consolidamento.",
        "recovery"
      );
      flashChat("student");
      return;
    }
    if (event.target.closest("[data-student-deepen]")) {
      sendChat("student", "Cosa non ha capito?", "weaknesses");
      flashChat("student");
      return;
    }
    if (event.target.closest("[data-download-student]")) {
      const student = currentStudent();
      if (!student) return;
      downloadText(`scheda-${slugify(student.name)}.txt`, studentSheetText(student, currentClass()));
      showToast("Scheda studente scaricata.");
      return;
    }
    const docButton = event.target.closest("[data-open-doc]");
    if (docButton) {
      openStudentDoc(Number(docButton.dataset.openDoc));
      return;
    }
    const close = event.target.closest("[data-close-dialog]");
    if (close) {
      closeDialog();
      return;
    }
    if (event.target.closest("[data-slide-prev]")) {
      navigateSlide(-1);
      return;
    }
    if (event.target.closest("[data-slide-next]")) {
      navigateSlide(1);
      return;
    }
    const slideDot = event.target.closest("[data-slide-goto]");
    if (slideDot) {
      const context = state.slideDialog;
      if (!context) return;
      context.index = Number(slideDot.dataset.slideGoto);
      renderSlideDialog();
      dialog.querySelector(".slide-stage")?.focus({ preventScroll: true });
    }
  });

  $("#new-lesson-btn").addEventListener("click", createLesson);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });

  dialog.addEventListener("keydown", (event) => {
    if (!state.slideDialog) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigateSlide(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      navigateSlide(1);
    }
  });

  dialog.addEventListener("close", () => {
    state.slideDialog = null;
  });
}

function flashChat(kind) {
  const panel = chatEls[kind]?.panel;
  if (!panel) return;
  panel.classList.remove("is-flashing");
  void panel.offsetWidth;
  panel.classList.add("is-flashing");
  setTimeout(() => panel.classList.remove("is-flashing"), 950);
  if (window.innerWidth < 1180) {
    panel.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function createLesson() {
  const cls = currentClass();
  const highest = cls.lessons.reduce((max, lesson) => Math.max(max, Number(lesson.number) || 0), 0);
  const lesson = {
    id: `${cls.id}-custom-${Date.now()}`,
    classId: cls.id,
    number: String(highest + 1).padStart(2, "0"),
    title: "Nuova lezione",
    dateLabel: "Da programmare",
    duration: 60,
    status: "draft",
    room: cls.room,
    topic: "",
    outline: [],
    slides: [],
    materials: [],
    objectives: [],
    isNew: true,
  };
  cls.lessons.push(lesson);
  state.lessonId = lesson.id;
  state.tab = "lezione";
  state.generating = null;
  renderAll();
  updateTabUI();
  const titleInput = $("[data-lesson-title]");
  setTimeout(() => {
    titleInput?.focus();
    titleInput?.select();
  }, 80);
  announce("Nuova lezione creata.");
  showToast("Nuova lezione creata. Scrivi cosa vuoi spiegare.");
}

/* ---------- Init ---------- */

function populateClassSelect() {
  const select = $("#class-select");
  if (!select) return;
  select.innerHTML = CLASSES.map((cls) => `<option value="${cls.id}">${esc(cls.name)}</option>`).join("");
  select.value = state.classId;
}

function init() {
  populateClassSelect();
  ["class", "student", "lesson"].forEach(mountChat);
  const workspace = $("#lesson-workspace");
  if (workspace && !workspace.dataset.mounted) {
    mountLessonWorkspace();
    workspace.dataset.mounted = "true";
  }
  bindEvents();
  renderAll();
  updateTabUI();
}

init();
