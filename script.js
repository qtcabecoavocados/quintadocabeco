/* =========================================================
   Quinta do Cabeço · comportamento da página
   ========================================================= */

/* ---------- Dados do alojamento (preencher aqui) ----------
   Tudo o que estiver vazio fica escondido no site e aparece sozinho
   quando for preenchido. */
const SITE = {
  rnal: '',          // n.º de registo, ex.: '123456/AL'
  email: '',         // ex.: 'reservas@quintadocabeco.pt' (ativa o formulário de pedido)
  whatsapp: '',      // só algarismos com indicativo, ex.: '351912345678'
  bookingUrl: '',    // página do alojamento no Booking.com
  airbnbUrl: '',     // página do anúncio no Airbnb
  payments: false,   // true quando o pagamento online estiver ligado
};

/* ---------- Configuração (editar aqui) ---------- */
const CONFIG = {
  maxGuests: 8,
  minNights: 3,
  cleaningFee: 90,          // € por estadia
  depositRate: 0.30,        // sinal de 30%
  // Preço por noite (€) por mês: índice 0 = janeiro
  nightly: [150, 150, 160, 190, 200, 240, 280, 280, 240, 190, 150, 170],
  monthsAhead: 18,
  // Datas ocupadas: geradas pela sincronização com o Booking e o Airbnb
  // (scripts/sync-calendars.mjs). Lê-se primeiro a versão mais recente no GitHub
  // e, se falhar, a cópia publicada com o site.
  availability: [
    'https://raw.githubusercontent.com/qtcabecoavocados/quintadocabeco/main/data/availability.json',
    'data/availability.json',
  ],
};

const T = {
  pt: {
    months: ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],
    dows: ['seg','ter','qua','qui','sex','sáb','dom'],
    nights: n => `${n} ${n === 1 ? 'noite' : 'noites'}`,
    avg: 'preço médio',
    cleaning: 'Limpeza final',
    total: 'Total',
    deposit: 'Sinal a pagar agora (30%)',
    depositLater: 'Sinal para confirmar a reserva (30%)',
    errDates: 'Escolha as datas de chegada e de saída.',
    errMin: n => `A estadia mínima é de ${n} noites.`,
    errBusy: 'Algumas das datas escolhidas já estão ocupadas.',
    errName: 'Indique o seu nome.',
    errEmail: 'Indique um email válido.',
    errTerms: 'É necessário aceitar os termos de reserva.',
    errGuests: n => `A casa recebe no máximo ${n} hóspedes.`,
    done: (d) => `${d.name}, recebemos o seu pedido de ${d.nights} de ${d.in} a ${d.out}, para ${d.guests}. Valor total: ${d.total}; sinal de ${d.deposit} por ${d.pay}.`,
    guests: n => `${n} ${n === 1 ? 'hóspede' : 'hóspedes'}`,
    card: 'cartão',
    availOk: d => `Disponibilidade sincronizada com o Booking e o Airbnb · atualizada a ${d}.`,
    availErr: 'Não foi possível carregar a disponibilidade. Confirmaremos as datas consigo antes de qualquer pagamento.',
    availPending: 'Disponibilidade indicativa: as datas são sempre confirmadas antes da reserva.',
    mailSubject: (a, b) => `Pedido de reserva · ${a} a ${b}`,
    mailBody: d => `Olá,\n\nGostaria de pedir uma reserva na Quinta do Cabeço.\n\nChegada: ${d.in}\nSaída: ${d.out}\nEstadia: ${d.nights}\nHóspedes: ${d.adults} adultos, ${d.children} crianças\nValor estimado: ${d.total} (sinal de 30%: ${d.deposit})\n\nNome: ${d.name}\nEmail: ${d.email}\nTelemóvel: ${d.phone || '-'}\n\n${d.message ? `Mensagem:\n${d.message}\n\n` : ''}Li e aceito os termos de reserva e cancelamento.\n\nObrigado,\n${d.name}`,
    doneMail: d => `${d.name}, o pedido para ${d.nights} de ${d.in} a ${d.out} (${d.guests}, ${d.total}) está pronto a enviar.`,
    cats: { facade: 'Fachada', 'common-area': 'Sala', kitchen: 'Cozinha', 'pool-area': 'Exterior', 'room-1': 'Quarto 1', 'room-2': 'Quarto 2', 'room-3': 'Quarto 3', 'room-4': 'Quarto 4', bathrooms: 'Casas de banho', 'laundry-room': 'Lavandaria' },
    all: 'Todas',
    photo: 'Fotografia',
  },
  en: {
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    dows: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    nights: n => `${n} ${n === 1 ? 'night' : 'nights'}`,
    avg: 'average rate',
    cleaning: 'Final cleaning',
    total: 'Total',
    deposit: 'Deposit due now (30%)',
    depositLater: 'Deposit to confirm the booking (30%)',
    errDates: 'Please choose your arrival and departure dates.',
    errMin: n => `The minimum stay is ${n} nights.`,
    errBusy: 'Some of the chosen dates are already booked.',
    errName: 'Please enter your name.',
    errEmail: 'Please enter a valid email.',
    errTerms: 'Please accept the booking terms.',
    errGuests: n => `The house sleeps up to ${n} guests.`,
    done: (d) => `${d.name}, we have received your request for ${d.nights} from ${d.in} to ${d.out}, for ${d.guests}. Total: ${d.total}; deposit of ${d.deposit} by ${d.pay}.`,
    guests: n => `${n} ${n === 1 ? 'guest' : 'guests'}`,
    card: 'card',
    availOk: d => `Availability synced with Booking.com and Airbnb · updated ${d}.`,
    availErr: 'We could not load availability. We will confirm your dates with you before any payment.',
    availPending: 'Availability is indicative: dates are always confirmed before booking.',
    mailSubject: (a, b) => `Booking request · ${a} to ${b}`,
    mailBody: d => `Hello,\n\nI would like to request a booking at Quinta do Cabeço.\n\nArrival: ${d.in}\nDeparture: ${d.out}\nStay: ${d.nights}\nGuests: ${d.adults} adults, ${d.children} children\nEstimated price: ${d.total} (30% deposit: ${d.deposit})\n\nName: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone || '-'}\n\n${d.message ? `Message:\n${d.message}\n\n` : ''}I have read and accept the booking and cancellation terms.\n\nThank you,\n${d.name}`,
    doneMail: d => `${d.name}, your request for ${d.nights} from ${d.in} to ${d.out} (${d.guests}, ${d.total}) is ready to send.`,
    cats: { facade: 'Façade', 'common-area': 'Living room', kitchen: 'Kitchen', 'pool-area': 'Outdoors', 'room-1': 'Bedroom 1', 'room-2': 'Bedroom 2', 'room-3': 'Bedroom 3', 'room-4': 'Bedroom 4', bathrooms: 'Bathrooms', 'laundry-room': 'Laundry' },
    all: 'All',
    photo: 'Photo',
  },
};

const GALLERY = [
  ['pool-area', 7], ['facade', 2], ['common-area', 13], ['kitchen', 12],
  ['room-1', 4], ['room-2', 3], ['room-3', 1], ['room-4', 4],
  ['bathrooms', 7], ['laundry-room', 2],
];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
let lang = 'pt';
const t = () => T[lang];

let lastDone = null; // último pedido de reserva feito nesta visita

/* ---------- Mostrar só o que tem dados ---------- */
const clean = v => String(v || '').trim();
const FLAGS = {
  rnal: !!clean(SITE.rnal),
  email: /^\S+@\S+\.\S+$/.test(clean(SITE.email)),
  whatsapp: /^\d{9,15}$/.test(clean(SITE.whatsapp)),
  booking: /^https?:\/\//.test(clean(SITE.bookingUrl)),
  airbnb: /^https?:\/\//.test(clean(SITE.airbnbUrl)),
  payments: !!SITE.payments,
  sync: false, // passa a true quando há calendários do Booking/Airbnb ligados
};
const LINKS = {
  email: () => `mailto:${clean(SITE.email)}`,
  whatsapp: () => `https://wa.me/${clean(SITE.whatsapp)}`,
  booking: () => clean(SITE.bookingUrl),
  airbnb: () => clean(SITE.airbnbUrl),
};
function applyNeeds() {
  $$('[data-needs], [data-needs-any], [data-needs-none]').forEach(el => {
    const all = (el.dataset.needs || '').split(/\s+/).filter(Boolean);
    const any = (el.dataset.needsAny || '').split(/\s+/).filter(Boolean);
    const none = (el.dataset.needsNone || '').split(/\s+/).filter(Boolean);
    el.hidden = !(all.every(k => FLAGS[k]) && (!any.length || any.some(k => FLAGS[k])) && none.every(k => !FLAGS[k]));
  });
  $$('[data-link]').forEach(el => { if (FLAGS[el.dataset.link]) el.href = LINKS[el.dataset.link](); });
  $$('[data-text]').forEach(el => { el.textContent = clean(SITE[el.dataset.text]); });
  // Depois de enviado um pedido, o formulário fica escondido até se pedir outro
  if (lastDone) $('#bookForm').hidden = true;
}
applyNeeds();

/* ---------- Idioma ---------- */
function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  document.documentElement.dataset.lang = l;
  $$('[data-set-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.setLang === l)));
  try { localStorage.setItem('qdc-lang', l); } catch (e) {}
  renderTabs(); renderGrid(); renderCalendar(); updateQuote(); renderAvailNote();
  renderDone();
}
$$('[data-set-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.setLang)));

/* ---------- Cabeçalho e menu ---------- */
const header = $('.site-header');
const onScroll = () => header.classList.toggle('solid', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

const toggle = $('.menu-toggle'), nav = $('#nav');
toggle.addEventListener('click', () => {
  const open = !nav.classList.contains('open');
  nav.classList.toggle('open', open);
  header.classList.toggle('menu-open', open);
  toggle.setAttribute('aria-expanded', String(open));
});
$$('#nav a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open'); header.classList.remove('menu-open'); toggle.setAttribute('aria-expanded', 'false');
}));

/* ---------- Galeria ---------- */
const allPhotos = GALLERY.flatMap(([cat, n]) =>
  Array.from({ length: n }, (_, i) => ({ cat, src: `images/gallery/${cat}/${cat}-${String(i + 1).padStart(2, '0')}.jpg` })));
// "Todas": uma seleção equilibrada, com as melhores primeiro
const featured = ['pool-area-04', 'common-area-06', 'kitchen-02', 'room-2-01', 'facade-02', 'pool-area-05', 'kitchen-09', 'room-4-02', 'bathrooms-04', 'pool-area-01', 'common-area-08', 'room-1-03', 'kitchen-05', 'pool-area-07', 'common-area-01', 'bathrooms-06', 'room-3-01', 'pool-area-06']
  .map(id => allPhotos.find(p => p.src.endsWith(`/${id}.jpg`)));
let currentCat = 'all';
let currentList = featured;

function renderTabs() {
  const tabs = $('#gtabs');
  const cats = ['all', ...GALLERY.map(g => g[0])];
  tabs.innerHTML = cats.map(c =>
    `<button class="gtab" role="tab" data-cat="${c}" aria-selected="${c === currentCat}">${c === 'all' ? t().all : t().cats[c]}</button>`).join('');
  $$('.gtab', tabs).forEach(b => b.addEventListener('click', () => { currentCat = b.dataset.cat; renderTabs(); renderGrid(); }));
}
function renderGrid() {
  currentList = currentCat === 'all' ? featured : allPhotos.filter(p => p.cat === currentCat);
  $('#ggrid').innerHTML = currentList.map((p, i) =>
    `<button type="button" data-i="${i}" aria-label="${t().photo} ${i + 1}"><img src="${p.src}" alt="${t().cats[p.cat]}" loading="lazy"></button>`).join('');
  $$('#ggrid button').forEach(b => b.addEventListener('click', () => openLb(+b.dataset.i)));
}

/* ---------- Ampliação ---------- */
const lb = $('#lightbox'); let lbIdx = 0;
function openLb(i) { lbIdx = i; showLb(); lb.hidden = false; document.body.style.overflow = 'hidden'; $('.lb-close', lb).focus(); }
function closeLb() { lb.hidden = true; document.body.style.overflow = ''; }
function showLb() {
  const p = currentList[lbIdx];
  $('img', lb).src = p.src; $('img', lb).alt = t().cats[p.cat];
  $('.lb-count', lb).textContent = `${lbIdx + 1} / ${currentList.length}`;
}
const stepLb = d => { lbIdx = (lbIdx + d + currentList.length) % currentList.length; showLb(); };
$('.lb-close', lb).addEventListener('click', closeLb);
$('.lb-prev', lb).addEventListener('click', () => stepLb(-1));
$('.lb-next', lb).addEventListener('click', () => stepLb(1));
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') stepLb(-1);
  if (e.key === 'ArrowRight') stepLb(1);
});
let touchX = null;
lb.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', e => { if (touchX === null) return; const dx = e.changedTouches[0].clientX - touchX; if (Math.abs(dx) > 40) stepLb(dx < 0 ? 1 : -1); touchX = null; });

/* ---------- Datas ---------- */
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const today = new Date(); today.setHours(0, 0, 0, 0);
// Cada dia guardado representa uma noite ocupada (o dia de saída fica livre para nova entrada)
const busy = new Set();
let availUpdated = null, availState = 'loading';
async function loadAvailability() {
  for (const url of CONFIG.availability) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) continue;
      const data = await res.json();
      busy.clear();
      Object.values(data.sources || {}).forEach(s => (s.ranges || []).forEach(r => {
        for (let d = parse(r.start), end = parse(r.end); d < end; d = addDays(d, 1)) busy.add(iso(d));
      }));
      availUpdated = data.updated ? new Date(data.updated) : null;
      availState = 'ok';
      FLAGS.sync = ['booking', 'airbnb'].some(k => data.sources?.[k]);
      applyNeeds();
      // Se a estadia escolhida deixou de estar livre, limpa a escolha
      if (checkin && checkout && rangeHasBusy(checkin, checkout)) { checkin = checkout = null; syncInputs(); }
      renderCalendar(); updateQuote(); renderAvailNote();
      return;
    } catch (e) { /* tenta a seguinte */ }
  }
  availState = 'error'; renderAvailNote();
}
function renderAvailNote() {
  const el = $('#availNote'); if (!el) return;
  if (availState === 'ok' && !FLAGS.sync) el.textContent = t().availPending;
  else if (availState === 'ok' && availUpdated) el.textContent = t().availOk(availUpdated.toLocaleString(lang === 'pt' ? 'pt-PT' : 'en-GB', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }));
  else if (availState === 'error') el.textContent = t().availErr;
  else el.textContent = '';
}

let checkin = null, checkout = null;
let viewStart = new Date(today.getFullYear(), today.getMonth(), 1);
const maxMonth = new Date(today.getFullYear(), today.getMonth() + CONFIG.monthsAhead - 1, 1);

function nightsBetween(a, b) { return Math.round((b - a) / 86400000); }
function rangeHasBusy(a, b) { for (let d = a; d < b; d = addDays(d, 1)) if (busy.has(iso(d))) return true; return false; }

/* ---------- Calendário ---------- */
function monthHTML(first) {
  const y = first.getFullYear(), m = first.getMonth();
  const days = new Date(y, m + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7; // segunda-feira primeiro
  let html = `<div><h4 class="month-title">${t().months[m]} ${y}</h4><div class="month">`;
  html += t().dows.map(d => `<span class="dow">${d}</span>`).join('');
  html += '<span></span>'.repeat(lead);
  for (let d = 1; d <= days; d++) {
    const date = new Date(y, m, d), k = iso(date);
    const cls = ['day'];
    const past = date < today, isBusy = busy.has(k);
    if (past) cls.push('past');
    if (isBusy) cls.push('busy');
    if (+date === +today) cls.push('today');
    if (checkin && +date === +checkin) cls.push('sel');
    if (checkout && +date === +checkout) cls.push('sel');
    if (checkin && checkout && date > checkin && date < checkout) cls.push('in-range');
    // Um dia ocupado pode ser escolhido como dia de saída (o hóspede sai de manhã)
    const canCheckout = checkin && !checkout && date > checkin && !rangeHasBusy(checkin, date);
    const disabled = past || (isBusy && !canCheckout);
    html += `<button type="button" class="${cls.join(' ')}" data-date="${k}" ${disabled ? 'disabled' : ''}>${d}</button>`;
  }
  return html + '</div></div>';
}
function renderCalendar() {
  const second = new Date(viewStart.getFullYear(), viewStart.getMonth() + 1, 1);
  $('#cal').innerHTML = monthHTML(viewStart) + monthHTML(second);
  $('#calPrev').disabled = viewStart <= new Date(today.getFullYear(), today.getMonth(), 1);
  $('#calNext').disabled = second >= maxMonth;
  $$('#cal .day:not(:disabled)').forEach(b => b.addEventListener('click', () => pickDate(parse(b.dataset.date))));
}
function pickDate(d) {
  if (!checkin || checkout || d <= checkin) { checkin = d; checkout = null; }
  else if (rangeHasBusy(checkin, d)) { checkin = d; checkout = null; }
  else checkout = d;
  syncInputs(); renderCalendar(); updateQuote();
}
$('#calPrev').addEventListener('click', () => { viewStart = new Date(viewStart.getFullYear(), viewStart.getMonth() - 1, 1); renderCalendar(); });
$('#calNext').addEventListener('click', () => { viewStart = new Date(viewStart.getFullYear(), viewStart.getMonth() + 1, 1); renderCalendar(); });

/* ---------- Formulário ---------- */
const inIn = $('#checkin'), inOut = $('#checkout');
inIn.min = iso(today); inOut.min = iso(addDays(today, 1));
function syncInputs() {
  inIn.value = checkin ? iso(checkin) : '';
  inOut.value = checkout ? iso(checkout) : '';
  inOut.min = iso(checkin ? addDays(checkin, 1) : addDays(today, 1));
}
inIn.addEventListener('change', () => {
  checkin = inIn.value ? parse(inIn.value) : null;
  if (checkout && checkin && checkout <= checkin) checkout = null;
  if (checkin) viewStart = new Date(checkin.getFullYear(), checkin.getMonth(), 1);
  syncInputs(); renderCalendar(); updateQuote();
});
inOut.addEventListener('change', () => {
  checkout = inOut.value ? parse(inOut.value) : null;
  syncInputs(); renderCalendar(); updateQuote();
});

const adults = $('#adults'), children = $('#children');
adults.innerHTML = Array.from({ length: CONFIG.maxGuests }, (_, i) => `<option ${i === 1 ? 'selected' : ''}>${i + 1}</option>`).join('');
children.innerHTML = Array.from({ length: CONFIG.maxGuests }, (_, i) => `<option>${i}</option>`).join('');
[adults, children].forEach(s => s.addEventListener('change', updateQuote));

const eur = n => new Intl.NumberFormat(lang === 'pt' ? 'pt-PT' : 'en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
function priceFor(a, b) {
  let sum = 0; for (let d = a; d < b; d = addDays(d, 1)) sum += CONFIG.nightly[d.getMonth()];
  return sum;
}
function quoteData() {
  if (!checkin || !checkout) return null;
  const n = nightsBetween(checkin, checkout);
  const stay = priceFor(checkin, checkout);
  const total = stay + CONFIG.cleaningFee;
  return { n, stay, total, deposit: Math.round(total * CONFIG.depositRate) };
}
function updateQuote() {
  const q = quoteData();
  const html = !q ? '' : `
    <div class="qrow"><span>${t().nights(q.n)} · ${t().avg} ${eur(q.stay / q.n)}</span><span>${eur(q.stay)}</span></div>
    <div class="qrow"><span>${t().cleaning}</span><span>${eur(CONFIG.cleaningFee)}</span></div>
    <div class="qrow qtotal"><span>${t().total}</span><span>${eur(q.total)}</span></div>
    <div class="qrow qdep"><span>${FLAGS.payments ? t().deposit : t().depositLater}</span><span>${eur(q.deposit)}</span></div>`;
  $('#quote').innerHTML = html;
  $('#quoteSoon').innerHTML = html;
}

const fmtDate = d => d.toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
function formatDone(d) {
  return {
    name: d.name, nights: t().nights(d.q.n), in: fmtDate(d.checkin), out: fmtDate(d.checkout),
    guests: t().guests(d.guests), total: eur(d.q.total), deposit: eur(d.q.deposit),
    pay: d.pay === 'card' ? t().card : d.pay,
  };
}

$('#bookForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, err = $('#formError');
  const guests = +adults.value + +children.value;
  let msg = '';
  if (!checkin || !checkout) msg = t().errDates;
  else if (nightsBetween(checkin, checkout) < CONFIG.minNights) msg = t().errMin(CONFIG.minNights);
  else if (rangeHasBusy(checkin, checkout)) msg = t().errBusy;
  else if (guests > CONFIG.maxGuests) msg = t().errGuests(CONFIG.maxGuests);
  else if (!f.name.value.trim()) msg = t().errName;
  else if (!/^\S+@\S+\.\S+$/.test(f.email.value)) msg = t().errEmail;
  else if (!f.terms.checked) msg = t().errTerms;
  err.textContent = msg;
  if (msg) return;

  lastDone = {
    name: f.name.value.trim(), email: f.email.value.trim(), phone: f.phone.value.trim(), message: f.message.value.trim(),
    checkin, checkout, guests, adults: +adults.value, children: +children.value, q: quoteData(), pay: f.pay.value,
  };
  if (FLAGS.payments) {
    // Ponto de ligação ao serviço de pagamentos (criar a referência MB WAY / Multibanco
    // ou a sessão de cartão no servidor e enviar o email de confirmação automático).
  } else {
    // Sem pagamento online: o pedido segue por email, escrito pelo próprio hóspede
    location.href = mailtoFor(lastDone);
  }
  renderDone();
  f.hidden = true; $('#bookDone').hidden = false;
  $('#bookDone').scrollIntoView({ behavior: 'smooth', block: 'center' });
});
function mailtoFor(d) {
  const x = { ...formatDone(d), email: d.email, phone: d.phone, message: d.message, adults: d.adults, children: d.children };
  return `mailto:${clean(SITE.email)}?subject=${encodeURIComponent(t().mailSubject(x.in, x.out))}&body=${encodeURIComponent(t().mailBody(x))}`;
}
function renderDone() {
  if (!lastDone) return;
  $('#doneSummary').textContent = FLAGS.payments ? t().done(formatDone(lastDone)) : t().doneMail(formatDone(lastDone));
  $('#mailAgain').href = mailtoFor(lastDone);
}
$('#bookAgain').addEventListener('click', () => {
  const f = $('#bookForm'); f.reset(); checkin = checkout = null; lastDone = null;
  syncInputs(); renderCalendar(); updateQuote(); adults.value = '2';
  $('#bookDone').hidden = true; f.hidden = false;
});

/* ---------- Entrada suave das secções ---------- */
const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: .12 }) : null;
$$('.section-head, .split-text, .split-media, .amenities, .rooms, .accordion').forEach(el => {
  if (io) { el.classList.add('reveal'); io.observe(el); }
});

/* ---------- Arranque ---------- */
let saved = null;
try { saved = localStorage.getItem('qdc-lang'); } catch (e) {}
const initial = saved || (navigator.language && !navigator.language.toLowerCase().startsWith('pt') ? 'en' : 'pt');
renderGrid();
setLang(initial);
loadAvailability();
