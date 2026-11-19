/** Configuração pública. Não inserir senhas ou tokens. */
export const CONFIG_LINKS = Object.freeze({
  checkoutAvulso: '',
  checkoutSuiteMensal: '',
  checkoutAnualVip: '',
  areaDeMembros: '',
  videoDemonstracao: '', // Link YouTube ou Vimeo; o embed é normalizado com segurança.
  whatsappSuporte: '', // https://wa.me/55DDDNUMERO
});

export const siteConfig = Object.freeze({
  links: CONFIG_LINKS,
  logoPath: '/assets/logo-fst-original.png',
  supportEmail: 'fusionsystem.trading@gmail.com',
  instagramUrl: 'https://www.instagram.com/metodofst/',
  // Modalidades futuras, conforme decisão do responsável. Só ativar após aprovar oferta e checkout.
  plans: {
    avulso: { available: false, price: '', period: '', checkoutKey: 'checkoutAvulso' },
    mensal: { available: false, price: '', period: '/mês', checkoutKey: 'checkoutSuiteMensal' },
    anual: { available: false, price: '', period: '/ano', checkoutKey: 'checkoutAnualVip' },
  },
});

export function safeHttps(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export function getCheckoutUrl(config, planId) {
  const plan = config.plans?.[planId];
  if (!plan?.available || !plan.price?.trim()) return null;
  const value = safeHttps(config.links?.[plan.checkoutKey]);
  if (!value) return null;
  const url = new URL(value);
  return url.hostname === 'herospark.com' || url.hostname.endsWith('.herospark.com') ? url.href : null;
}

export function getVideoEmbed(value) {
  const safe = safeHttps(value);
  if (!safe) return null;
  const url = new URL(safe);
  const host = url.hostname;
  if (['youtube.com', 'www.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com', 'youtu.be'].includes(host)) {
    const id = host === 'youtu.be' ? url.pathname.slice(1) : url.pathname.startsWith('/embed/') ? url.pathname.split('/')[2] : url.searchParams.get('v');
    return /^[\w-]{11}$/.test(id || '') ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` : null;
  }
  if (['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'].includes(host)) {
    const id = url.pathname.split('/').filter(Boolean).at(-1);
    return /^\d+$/.test(id || '') ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
  }
  return null;
}

export function getWhatsAppUrl(value) {
  const safe = safeHttps(value);
  if (!safe) return null;
  const url = new URL(safe);
  return url.hostname === 'wa.me' && /^\/\d{10,15}$/.test(url.pathname) ? url.href : null;
}
