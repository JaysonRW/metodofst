import { siteConfig, getCheckoutUrl, getVideoEmbed, getWhatsAppUrl, safeHttps } from './site-config.js';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const mobileViewport = matchMedia('(max-width: 640px)');
const email = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(siteConfig.supportEmail) ? siteConfig.supportEmail : 'fusionsystem.trading@gmail.com';
const whatsapp = getWhatsAppUrl(siteConfig.links.whatsappSuporte);
const supportUrl = whatsapp || `mailto:${email}`;
const instagram = safeHttps(siteConfig.instagramUrl) || 'https://www.instagram.com/metodofst/';

// Original logo is displayed as supplied. The header crops its emblem with CSS.
if (siteConfig.logoPath && /^\/assets\/[\w./-]+\.(png|webp|svg)$/i.test(siteConfig.logoPath) && !siteConfig.logoPath.includes('..')) {
  $$('.brand-emblem img, .mini-brand img').forEach((image) => { image.src = siteConfig.logoPath; });
}
$('#year').textContent = String(new Date().getFullYear());
$('[data-contact]').href = supportUrl;
if (whatsapp) $('[data-contact] span').textContent = 'Falar no WhatsApp';
$('#dialog-instagram').href = instagram;

const menu = $('#mobile-nav');
const menuToggle = $('.menu-toggle');
function closeMenu() {
  menu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
}
menuToggle.addEventListener('click', () => {
  const open = menu.hidden;
  menu.hidden = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
$$('#mobile-nav a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !menu.hidden) { closeMenu(); menuToggle.focus(); } });
matchMedia('(min-width: 901px)').addEventListener('change', (event) => { if (event.matches) closeMenu(); });

const dialog = $('#info-dialog');
let returnFocus;
function openDialog({ title, description, eyebrow = 'MÉTODO FST', contact = true, subject = 'Quero conhecer o Método FST', footnote = 'Garantia de 7 dias na compra. Nenhuma cobrança nesta página.' }) {
  returnFocus = document.activeElement;
  $('#dialog-title').textContent = title;
  $('#dialog-description').textContent = description;
  $('#dialog-eyebrow').textContent = eyebrow;
  $('#dialog-footnote').textContent = footnote;
  $('#dialog-actions').hidden = !contact;
  $('#dialog-contact').href = whatsapp || `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  $('#dialog-contact').textContent = whatsapp ? 'FALAR NO WHATSAPP' : 'FALAR COM A EQUIPE';
  $('#dialog-media').replaceChildren();
  dialog.classList.remove('video-dialog');
  dialog.showModal();
  document.body.classList.add('modal-open');
}
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  const box = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  $('#dialog-media').replaceChildren();
  document.body.classList.remove('modal-open');
  returnFocus?.focus({ preventScroll: true });
});

const planNames = { avulso: 'Avulso / Day Use', mensal: 'Suíte 4 Indicadores', anual: 'Acesso Anual' };
let availableCount = 0;
$$('[data-plan]').forEach((button) => {
  const id = button.dataset.plan;
  const checkout = getCheckoutUrl(siteConfig, id);
  if (checkout) {
    availableCount++;
    $(`[data-price="${id}"]`).textContent = siteConfig.plans[id].price;
    $(`[data-period="${id}"]`).textContent = siteConfig.plans[id].period;
    button.textContent = 'QUERO ACESSAR AGORA';
    $(`[data-plan-card="${id}"] .plan-checkout`).textContent = 'Checkout Seguro HeroSpark';
  }
  button.addEventListener('click', () => {
    if (checkout) location.assign(checkout);
    else openDialog({ title: planNames[id], eyebrow: 'MODALIDADE EM PREPARAÇÃO', description: 'Esta modalidade ainda está sendo preparada. Valores, condições e data de abertura serão informados no lançamento. Fale com a equipe para conhecer a proposta e acompanhar a disponibilidade.', subject: `Interesse no Método FST — ${planNames[id]}` });
  });
});
if (availableCount) {
  $('.prelaunch-label').textContent = availableCount === 3 ? 'ACESSOS DISPONÍVEIS' : 'CONSULTE OS ACESSOS DISPONÍVEIS';
  $('.plans-section .section-heading > p:not(.eyebrow)').textContent = 'Conheça as modalidades disponíveis e confira as condições de cada acesso.';
}
$$('[data-members]').forEach((button) => button.addEventListener('click', () => {
  const url = safeHttps(siteConfig.links.areaDeMembros);
  if (url) location.assign(url);
  else openDialog({ title: 'Seu espaço de aprendizado.', eyebrow: 'ÁREA DE MEMBROS', description: 'A área de membros está em preparação. Se você precisa de orientação sobre acesso, fale com a equipe FST.', subject: 'Dúvida sobre acesso à área de membros FST', footnote: 'A prévia desta página ilustra a organização planejada do treinamento.' });
}));

const video = getVideoEmbed(siteConfig.links.videoDemonstracao);
if (video) $('.player-bottom > span:last-child').textContent = 'ASSISTIR À DEMONSTRAÇÃO';
$('[data-video]').addEventListener('click', () => {
  if (!video) {
    openDialog({ title: 'A demonstração está a caminho.', eyebrow: 'CONHEÇA O MÉTODO', description: 'Estamos preparando o vídeo de apresentação. Enquanto isso, você pode explorar os candles do gráfico interativo e conhecer os quatro pilares do método nesta página.', subject: 'Quero acompanhar a demonstração do Método FST', footnote: 'As imagens desta página são conceituais e não representam resultados de operações.' });
    return;
  }
  openDialog({ title: 'Método FST em vídeo.', eyebrow: 'DEMONSTRAÇÃO', description: '', contact: false, footnote: 'Vídeo hospedado em serviço externo. O conteúdo não elimina os riscos de operar no mercado.' });
  dialog.classList.add('video-dialog');
  const iframe = document.createElement('iframe');
  iframe.src = video;
  iframe.title = 'Demonstração do Método FST';
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  $('#dialog-media').append(iframe);
});

const legal = {
  terms: { title: 'Informações de uso.', text: 'Esta página apresenta o Método FST e modalidades em preparação. As condições comerciais, duração de acesso, suporte, compatibilidade e regras de reembolso serão informadas na oferta final.\n\nA prévia da área de membros é ilustrativa. Ela não concede acesso a aulas, arquivos ou licenças. Os gráficos são demonstrações visuais com dados fictícios.\n\nPara informações sobre uma contratação, fale com a equipe antes da compra.' },
  disclaimer: { title: 'Aviso legal.', text: 'O Método FST reúne ferramentas de apoio à análise e conteúdo educacional. Não constitui recomendação individual de investimento, promessa de rentabilidade ou garantia de sucesso em operações.\n\nOperações no mercado envolvem risco de perdas. As leituras exibidas no gráfico interativo são simuladas, não executam a lógica dos indicadores e não devem orientar negociações.\n\nA garantia de 7 dias diz respeito à compra do produto, conforme a oferta, e não a perdas ou ganhos no mercado.' },
  privacy: { title: 'Sua privacidade.', text: `Esta versão não possui formulário de cadastro, cookies de publicidade ou ferramentas de análise instaladas pelo Método FST. A hospedagem pode registrar dados técnicos de acesso e as fontes são carregadas pelo Google Fonts.\n\nAo acessar Instagram, WhatsApp, e-mail ou HeroSpark, aplicam-se também as políticas desses serviços. Um vídeo externo, quando configurado, é carregado somente após clicar para assistir.\n\nMensagens enviadas à equipe serão utilizadas para responder ao seu contato. Para dúvidas ou solicitações sobre seus dados: ${email}.` },
};
$$('[data-legal]').forEach((button) => button.addEventListener('click', () => {
  const content = legal[button.dataset.legal];
  openDialog({ title: content.title, description: content.text, eyebrow: 'INFORMAÇÕES DO PROJETO', contact: false, footnote: `Contato: ${email}` });
}));

// Synthetic artwork only. No live feed, real asset, trading signal or performance claim.
const closes = [61,65,63,70,75,72,78,74,83,88,85,95,91,98,105,101,107,104,112,116,111,119,124,119,116,126,133,138,132,141,145,138,135,127,134,140,146,151,148,156,162,158,165,172];
const chartPoints = closes.map((close, i) => ({ x: 25 + i * 13.3, y: 290 - (close - 60) * 2, close, open: i ? closes[i - 1] + (i % 3 - 1) * 1.5 : 58 }));
const pathOf = (points) => points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
function makeCandles(points, monochrome = false) {
  return points.map((p, i) => {
    const openY = 290 - (p.open - 60) * 2;
    const up = p.close >= p.open;
    const color = monochrome && i % 9 < 2 ? '#bbc3c4' : up ? '#20ce8a' : '#e56870';
    return `<g fill="${color}" stroke="${color}"><path d="M${p.x} ${Math.min(openY, p.y) - 5 - i % 4}V${Math.max(openY, p.y) + 6 + i % 3}" stroke-width="1"/><rect x="${p.x - 3.7}" y="${Math.min(openY, p.y)}" width="7.4" height="${Math.max(3, Math.abs(openY - p.y))}" stroke-width=".5"/></g>`;
  }).join('');
}
function drawMainChart(host, id, interactive = false) {
  const average = chartPoints.map((point, i) => ({ x: point.x, y: chartPoints.slice(Math.max(0, i - 6), i + 1).reduce((sum, p) => sum + p.y, 0) / Math.min(i + 1, 7) + 14 }));
  const slow = average.map((p, i) => ({ x: p.x, y: p.y + 16 + Math.sin(i * .18) * 11 }));
  const histogram = chartPoints.map((p, i) => {
    const amount = Math.sin(i * .25) * 18 + Math.cos(i * .15) * 10;
    return `<rect x="${p.x - 3}" y="${amount > 0 ? 344 - amount : 344}" width="6" height="${Math.max(1, Math.abs(amount))}" fill="${amount >= 0 ? '#20ce8a' : '#e56870'}" opacity=".68"/>`;
  }).join('');
  host.innerHTML = `<svg class="market-chart" viewBox="0 0 640 390" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><pattern id="grid-${id}" width="75" height="51" patternUnits="userSpaceOnUse"><path d="M75 0H0V51" fill="none" stroke="#8aa1b9" stroke-opacity=".10" stroke-width=".7"/></pattern><linearGradient id="cloud-${id}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#209865" stop-opacity=".18"/><stop offset="1" stop-color="#209865" stop-opacity=".02"/></linearGradient></defs><rect x="12" y="12" width="600" height="356" fill="url(#grid-${id})"/><path d="${pathOf(average)} ${[...slow].reverse().map(p => `L${p.x} ${p.y}`).join(' ')}Z" fill="url(#cloud-${id})"/><path d="${pathOf(slow)}" stroke="#43856c" stroke-width="1.2" opacity=".7"/><path d="${pathOf(average)}" stroke="#d8b76d" stroke-width="1.7"/>${makeCandles(chartPoints)}<path d="M15 312H614" stroke="#7f98af" stroke-opacity=".18"/><g>${histogram}</g><path d="M20 344H605" stroke="#7f98af" stroke-opacity=".25" stroke-width=".6"/>${interactive ? '<g id="crosshair"><path class="crosshair-v" d="M437 15V310" stroke="#c8d9e8" stroke-opacity=".6" stroke-dasharray="3 4"/><path class="crosshair-h" d="M15 140H612" stroke="#c8d9e8" stroke-opacity=".5" stroke-dasharray="3 4"/><circle class="crosshair-dot" cx="437" cy="140" r="3.5" fill="#e0c17a"/></g>' : ''}<g fill="#647d95" font-family="monospace" font-size="8"><text x="24" y="383">09:00</text><text x="165" y="383">09:30</text><text x="305" y="383">10:00</text><text x="445" y="383">10:30</text><text x="560" y="383">11:00</text></g></svg>`;
}
drawMainChart($('[data-chart="hero"]'), 'hero', true);
drawMainChart($('[data-chart="video"]'), 'video');

const chart = $('#hero-chart');
const hud = $('#chart-hud');
let selectedCandle = 31;
function updateCandle(index, follow = false) {
  selectedCandle = Math.min(chartPoints.length - 1, Math.max(0, index));
  const point = chartPoints[selectedCandle];
  const prior = chartPoints[Math.max(0, selectedCandle - 4)];
  const slope = point.close - prior.close;
  const delta = point.close - point.open;
  $('.crosshair-v').setAttribute('d', `M${point.x} 15V310`);
  $('.crosshair-h').setAttribute('d', `M15 ${point.y}H612`);
  $('.crosshair-dot').setAttribute('cx', String(point.x));
  $('.crosshair-dot').setAttribute('cy', String(point.y));
  $('#hud-candle').textContent = `CANDLE ${String(selectedCandle + 1).padStart(2, '0')}`;
  $('#hud-trend').textContent = Math.abs(slope) < 3 ? 'Neutra' : slope > 0 ? 'Alta' : 'Baixa';
  $('#hud-momentum').textContent = Math.abs(delta) < 2 ? 'Neutro' : delta > 0 ? 'Positivo' : 'Negativo';
  $('#hud-convergence').textContent = slope * delta > 0 ? 'Exemplo alinhado' : 'Em análise';
  if (follow && !reducedMotion.matches) {
    // Place the HUD on the opposite side to avoid covering the selected candle.
    hud.style.right = point.x > 330 ? 'auto' : '4%';
    hud.style.left = point.x > 330 ? '4%' : 'auto';
  }
}
updateCandle(31);
let pointerFrame = 0;
let pointerX = 0;
function pointerRead(event) {
  pointerX = event.clientX;
  if (pointerFrame) return;
  pointerFrame = requestAnimationFrame(() => {
    pointerFrame = 0;
    const bounds = chart.getBoundingClientRect();
    const x = (pointerX - bounds.left) / bounds.width * 640;
    updateCandle(Math.round((x - 25) / 13.3), true);
  });
}
chart.addEventListener('pointermove', pointerRead, { passive: true });
chart.addEventListener('pointerdown', pointerRead, { passive: true });
chart.addEventListener('keydown', (event) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  updateCandle(event.key === 'Home' ? 0 : event.key === 'End' ? chartPoints.length - 1 : selectedCandle + (event.key === 'ArrowRight' ? 1 : -1), true);
});

$$('[data-mini]').forEach((host) => {
  const kind = host.dataset.mini;
  const grid = '<path d="M0 25H240M0 55H240M0 85H240M30 0V125M90 0V125M150 0V125M210 0V125" stroke="#a0b0c0" stroke-opacity=".08" stroke-width=".7"/>';
  let art;
  if (kind === 'alfred' || kind === 'joker') {
    const cloud = kind === 'alfred' ? '<path d="M0 82 25 69 50 75 75 46 100 60 125 32 150 49 175 25 200 32 240 10V35L200 48 175 39 150 65 125 49 100 80 75 60 50 92 25 86 0 99Z" fill="#2ad58b" opacity=".13"/><path d="M0 94 25 81 50 88 75 59 100 75 125 46 150 63 175 38 200 46 240 26" stroke="#d8b76d" stroke-width="1.4"/>' : '';
    art = cloud + `<g transform="translate(0,0) scale(.385,.32)">${makeCandles(chartPoints, kind === 'joker')}</g>`;
  } else if (kind === 'gordon') {
    art = '<path d="M0 30H240M0 80H240" stroke="#998353" stroke-dasharray="3 3" opacity=".5"/><path d="M0 60C14 84 27 87 40 62S65 14 80 33 106 96 125 80 145 14 165 28 190 90 209 61 230 15 240 26" stroke="#83bfc9" stroke-width="1.6"/><path d="M0 51C20 53 24 74 44 63S70 35 86 45 110 76 129 64 150 29 170 40 190 67 211 51 230 30 240 37" stroke="#d8b76d" stroke-width="1.2"/>';
  } else {
    const bars = Array.from({ length: 35 }, (_, i) => { const v = Math.sin(i * .32) * 15; return `<rect x="${i * 7}" y="${v > 0 ? 100 - v : 100}" width="4" height="${Math.max(1,Math.abs(v))}" fill="${v > 0 ? '#20ce8a' : '#e56870'}" opacity=".65"/>`; }).join('');
    art = '<path d="M0 60C30 10 40 15 65 39S95 81 120 43 150 17 175 42 210 72 240 24" stroke="#cbb36c" stroke-width="1.5"/><path d="M0 40C20 56 42 69 65 49S95 18 120 42 150 64 180 46 215 28 240 36" stroke="#789eb6" stroke-width="1.3"/>' + bars;
  }
  host.innerHTML = `<svg class="mini-chart" viewBox="0 0 240 125" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${grid}<g class="chart-emphasis">${art}</g></svg>`;
});

$$('.candle-rail').forEach((rail, railIndex) => {
  const bodies = Array.from({ length: 5 }, (_, i) => {
    const x = i * 25 + 9;
    const y = (railIndex === 1 ? i : 4 - i) * 48 + 35;
    const color = i % 3 ? '#63d6b4' : '#d38d94';
    return `<g fill="${color}" fill-opacity=".21" stroke="${color}" stroke-opacity=".8"><path d="M${x + 7} ${y - 24}V${y + 94}"/><rect x="${x}" y="${y}" width="14" height="65" rx="1"/></g>`;
  }).join('');
  rail.innerHTML = `<svg viewBox="0 0 135 420" xmlns="http://www.w3.org/2000/svg">${bodies}</svg>`;
});

let revealObserver;
function setupMotion() {
  revealObserver?.disconnect();
  document.documentElement.classList.toggle('js-motion', !reducedMotion.matches);
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: .04, rootMargin: '0px 0px -15px 0px' });
    $$('.reveal').forEach((element) => revealObserver.observe(element));
  } else $$('.reveal').forEach((element) => element.classList.add('is-visible'));
  updateScroll();
}
const rails = $$('[data-parallax]');
const progress = $('.reading-progress');
const terminal = $('#terminal');
let scrollFrame = 0;
function updateScroll() {
  scrollFrame = 0;
  const scroll = window.scrollY;
  const range = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${range > 0 ? scroll / range : 0})`;
  if (!reducedMotion.matches && !mobileViewport.matches) {
    rails.forEach((rail) => { rail.style.transform = `translate3d(0,${scroll * Number(rail.dataset.parallax)}px,0)`; });
    if (scroll < innerHeight * 1.5) terminal.style.transform = `translateY(${Math.min(scroll * .035, 20)}px) rotateY(-12deg) rotateZ(-2.5deg)`;
  } else {
    rails.forEach((rail) => { rail.style.transform = ''; });
    terminal.style.transform = '';
  }
}
function requestScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }
window.addEventListener('scroll', requestScroll, { passive: true });
window.addEventListener('resize', requestScroll, { passive: true });
reducedMotion.addEventListener('change', setupMotion);
mobileViewport.addEventListener('change', requestScroll);
setupMotion();
