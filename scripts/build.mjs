import { cp, mkdir, readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { siteConfig, getCheckoutUrl, safeHttps, getVideoEmbed, getWhatsAppUrl } from '../public/site-config.js';

const root = fileURLToPath(new URL('../', import.meta.url));
for (const [id, plan] of Object.entries(siteConfig.plans)) {
  const raw = siteConfig.links[plan.checkoutKey];
  if (raw) {
    const safe = safeHttps(raw);
    const host = safe ? new URL(safe).hostname : '';
    if (host !== 'herospark.com' && !host.endsWith('.herospark.com')) throw new Error(`Checkout inválido para ${id}. Use uma URL HTTPS oficial da HeroSpark.`);
  }
  if (plan.available && !getCheckoutUrl(siteConfig, id)) throw new Error(`Plano ${id} ativo exige preço e checkout válidos.`);
}
if (siteConfig.links.areaDeMembros && !safeHttps(siteConfig.links.areaDeMembros)) throw new Error('Área de membros exige URL HTTPS válida.');
if (siteConfig.links.videoDemonstracao && !getVideoEmbed(siteConfig.links.videoDemonstracao)) throw new Error('Vídeo deve ser um link válido de YouTube ou Vimeo.');
if (siteConfig.links.whatsappSuporte && !getWhatsAppUrl(siteConfig.links.whatsappSuporte)) throw new Error('WhatsApp deve usar https://wa.me/ seguido do número completo.');
if (siteConfig.logoPath) {
  if (!/^\/assets\/[a-zA-Z0-9_./-]+\.(svg|png|webp)$/i.test(siteConfig.logoPath) || siteConfig.logoPath.includes('..')) throw new Error('Logo deve apontar para um arquivo dentro de /assets.');
  await access(path.join(root, 'public', siteConfig.logoPath));
}
const html = await readFile(path.join(root, 'public/index.html'), 'utf8');
if (html.includes('<span>®</span>')) throw new Error('Não publicar marca registrada sem confirmação.');
await mkdir(path.join(root, 'dist'), { recursive: true });
await cp(path.join(root, 'public'), path.join(root, 'dist'), { recursive: true });
console.log('Build concluído: dist/ — site estático pronto para Vercel.');
console.log(Object.keys(siteConfig.plans).some(id => getCheckoutUrl(siteConfig, id)) ? 'Há planos disponíveis com checkout configurado.' : 'Modo pré-lançamento: planos em preparação, sem cobrança.');
