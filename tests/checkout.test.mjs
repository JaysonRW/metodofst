import { test } from 'node:test';
import assert from 'node:assert/strict';
import { siteConfig, getCheckoutUrl, getVideoEmbed, getWhatsAppUrl, safeHttps } from '../public/site-config.js';

const configuration = (url, available = true, price = 'Preço definido pelo responsável') => ({
  links: { checkoutSuiteMensal: url },
  plans: { mensal: { available, price, checkoutKey: 'checkoutSuiteMensal' } },
});

test('current launch configuration never enables sales of future plans', () => {
  for (const id of Object.keys(siteConfig.plans)) assert.equal(getCheckoutUrl(siteConfig, id), null);
});
test('future plans cannot redirect even if someone prepares a checkout URL', () => {
  assert.equal(getCheckoutUrl(configuration('https://pay.herospark.com/fst', false), 'mensal'), null);
  assert.equal(getCheckoutUrl(configuration('https://pay.herospark.com/fst', true, ''), 'mensal'), null);
});
test('checkout rejects insecure, lookalike and credential-bearing URLs', () => {
  for (const url of ['javascript:alert(1)', 'http://pay.herospark.com/fst', 'https://herospark.com.evil.test/fst', 'https://evilherospark.com', 'https://user:pass@pay.herospark.com/fst', 'invalid']) assert.equal(getCheckoutUrl(configuration(url), 'mensal'), null);
  assert.equal(getCheckoutUrl(configuration('https://pay.herospark.com/fst?offer=1'), 'mensal'), 'https://pay.herospark.com/fst?offer=1');
});
test('one plan never falls back to another plan checkout', () => {
  assert.equal(getCheckoutUrl(configuration('https://pay.herospark.com/monthly'), 'anual'), null);
});
test('video accepts supported providers and constructs isolated embed URLs', () => {
  assert.equal(getVideoEmbed('https://youtu.be/abcdefghijk'), 'https://www.youtube-nocookie.com/embed/abcdefghijk?autoplay=1&rel=0');
  assert.equal(getVideoEmbed('https://www.youtube.com/watch?v=abcdefghijk&untrusted=value'), 'https://www.youtube-nocookie.com/embed/abcdefghijk?autoplay=1&rel=0');
  assert.equal(getVideoEmbed('https://vimeo.com/123456789'), 'https://player.vimeo.com/video/123456789?autoplay=1');
  for (const url of ['https://youtube.com.evil.test/watch?v=abcdefghijk', 'javascript:alert(1)', 'https://youtu.be/bad', 'https://example.com/embed/video']) assert.equal(getVideoEmbed(url), null);
});
test('support destination rejects invented or invalid WhatsApp targets', () => {
  assert.equal(getWhatsAppUrl(''), null);
  assert.equal(getWhatsAppUrl('https://wa.me/5511999999999'), 'https://wa.me/5511999999999');
  assert.equal(getWhatsAppUrl('https://wa.me/PHONE'), null);
  assert.equal(getWhatsAppUrl('https://evil.test/5511999999999'), null);
  assert.equal(safeHttps('http://example.com'), null);
});
