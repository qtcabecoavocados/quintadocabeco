// Sincronização de calendários da Quinta do Cabeço
//
// Importa: lê os calendários iCal do Booking e do Airbnb e grava os dias
//          ocupados em data/availability.json (lido pelo site).
// Exporta: gera calendar.ics com as reservas diretas (data/direct-bookings.json),
//          para o Booking e o Airbnb bloquearem essas datas.
//
// Variáveis de ambiente (segredos do repositório no GitHub):
//   BOOKING_ICAL_URL  ligação "exportar calendário" do Booking (extranet)
//   AIRBNB_ICAL_URL   ligação "exportar calendário" do Airbnb
// Para testes locais, o valor pode ser um caminho para um ficheiro .ics.
//
// Uso: node scripts/sync-calendars.mjs

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AVAIL = path.join(ROOT, 'data', 'availability.json');
const DIRECT = path.join(ROOT, 'data', 'direct-bookings.json');
const ICS_OUT = path.join(ROOT, 'calendar.ics');

const SOURCES = {
  booking: process.env.BOOKING_ICAL_URL,
  airbnb: process.env.AIRBNB_ICAL_URL,
};

/* ---------- iCal: leitura ---------- */
export function parseICS(text) {
  // "Unfold": linhas que começam com espaço ou tab continuam a anterior
  const lines = text.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '').split('\n');
  const events = [];
  let ev = null;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') ev = {};
    else if (line === 'END:VEVENT') { if (ev?.start) events.push(ev); ev = null; }
    else if (ev) {
      const m = line.match(/^(DTSTART|DTEND)(;[^:]*)?:(\d{8})/);
      if (m) ev[m[1] === 'DTSTART' ? 'start' : 'end'] = `${m[3].slice(0, 4)}-${m[3].slice(4, 6)}-${m[3].slice(6, 8)}`;
    }
  }
  // Sem DTEND: um evento de um dia ocupa uma noite
  return events.map(e => ({ start: e.start, end: e.end && e.end > e.start ? e.end : addDays(e.start, 1) }));
}

function addDays(isoDate, n) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// Junta intervalos sobrepostos ou contíguos e descarta os que já passaram
export function normalise(ranges, today) {
  const sorted = ranges.filter(r => r.end > today).sort((a, b) => a.start.localeCompare(b.start));
  const out = [];
  for (const r of sorted) {
    const last = out[out.length - 1];
    if (last && r.start <= last.end) { if (r.end > last.end) last.end = r.end; }
    else out.push({ start: r.start, end: r.end });
  }
  return out;
}

async function load(src) {
  if (/^https?:\/\//.test(src)) {
    const res = await fetch(src, { headers: { 'User-Agent': 'calendar-sync/1.0' }, signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  }
  return readFile(src, 'utf8');
}

async function readJSON(file, fallback) {
  try { return JSON.parse(await readFile(file, 'utf8')); } catch { return fallback; }
}

/* ---------- iCal: escrita ---------- */
function icsDate(isoDate) { return isoDate.replaceAll('-', ''); }
function buildICS(bookings, stamp) {
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Quinta do Cabeco//Reservas diretas//PT',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Quinta do Cabeço · reservas diretas',
  ];
  for (const b of bookings) {
    lines.push('BEGIN:VEVENT',
      `UID:${icsDate(b.start)}-${icsDate(b.end)}@quintadocabeco`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(b.start)}`,
      `DTEND;VALUE=DATE:${icsDate(b.end)}`,
      'SUMMARY:Reservado',
      'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}

/* ---------- Principal ---------- */
async function main() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const prev = await readJSON(AVAIL, { sources: {} });
  const sources = {};
  let failures = 0;

  for (const [name, src] of Object.entries(SOURCES)) {
    if (!src) { console.log(`${name}: sem ligação configurada, ignorado`); continue; }
    try {
      const ranges = normalise(parseICS(await load(src)), today);
      sources[name] = { updated: now.toISOString(), ranges };
      console.log(`${name}: ${ranges.length} períodos ocupados`);
    } catch (err) {
      failures++;
      // Mantém os últimos dados conhecidos, para o site nunca mostrar dias livres por engano
      if (prev.sources?.[name]) sources[name] = prev.sources[name];
      console.error(`${name}: erro ao ler o calendário (${err.message}); mantidos os dados anteriores`);
    }
  }

  // Reservas diretas, mantidas à mão em data/direct-bookings.json
  const direct = await readJSON(DIRECT, []);
  const valid = direct.filter(b => /^\d{4}-\d{2}-\d{2}$/.test(b.start) && /^\d{4}-\d{2}-\d{2}$/.test(b.end) && b.end > b.start);
  if (valid.length !== direct.length) console.warn(`direct: ${direct.length - valid.length} entradas inválidas ignoradas`);
  sources.direct = { updated: now.toISOString(), ranges: normalise(valid, today) };

  const out = {
    // "updated" só muda quando os dados mudam, para não gerar commits inúteis
    updated: prev.updated,
    sources,
  };
  const changed = JSON.stringify(stripTimes(out.sources)) !== JSON.stringify(stripTimes(prev.sources || {}));
  if (changed || !prev.updated) out.updated = now.toISOString();
  else for (const k of Object.keys(out.sources)) if (prev.sources[k]) out.sources[k].updated = prev.sources[k].updated;

  if (!existsSync(path.dirname(AVAIL))) await mkdir(path.dirname(AVAIL), { recursive: true });
  await writeFile(AVAIL, JSON.stringify(out, null, 2) + '\n');

  // A exportação só leva as reservas diretas: reenviar as do Booking/Airbnb criaria ciclos
  const stamp = (out.updated || now.toISOString()).replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  await writeFile(ICS_OUT, buildICS(sources.direct.ranges, stamp));

  console.log(changed ? 'Disponibilidade atualizada.' : 'Sem alterações.');
  if (failures && failures === Object.values(SOURCES).filter(Boolean).length) process.exitCode = 1;
}

function stripTimes(sources) {
  return Object.fromEntries(Object.entries(sources).map(([k, v]) => [k, v.ranges]));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
