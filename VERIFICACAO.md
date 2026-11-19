# Verificação da LP

Data: 19/11/2026. Versão conforme prompt mestre, logo e referência visual enviados pelo responsável.

## Verificado

- Build estático e sintaxe JavaScript.
- Seis testes: planos futuros sem venda, necessidade de preço/checkout, destinos HTTPS permitidos, separação entre ofertas, normalização de vídeo e validação de WhatsApp.
- Logo oficial carregada com dimensões naturais verificadas.
- Layout de desktop na largura de 1000 px, com grade de quatro indicadores em duas colunas.
- Layout móvel nas larguras de 390 e 320 px, com grades em uma coluna e parallax lateral oculto.
- Corrigidos o título e a sombra decorativa que excediam a largura mínima; comparação final entre largura do conteúdo e área útil sem transbordamento em 320 px.
- Seleção do gráfico por teclado (Home e seta direita) atualiza candle e HUD.
- Menu móvel abre, navega e fecha.
- Botão Entrar sem URL abre orientação, sem login falso.
- Plano mensal abre consulta de disponibilidade com o assunto correto, sem checkout ativo.
- Botão de vídeo sem URL abre explicação; nenhum iframe é carregado.
- Aviso de privacidade abre corretamente sem botões comerciais.
- Escape fecha diálogos e retorna o foco.
- Nenhum erro ou aviso no console na sessão verificada.

## Implementado, com verificação limitada

- Eventos de ponteiro/toque do crosshair presentes; a sessão automatizada verificou a atualização por teclado, não gestos contínuos de toque em aparelho físico.
- Preferência de movimento reduzido implementada em CSS e JavaScript, sem emulação dessa preferência na sessão.
- Links de pagamento e vídeo validados por testes, sem compra real ou reprodução de vídeo final: os links ainda não foram fornecidos.
- Cabeçalhos de segurança preparados no `vercel.json`; validar a resposta HTTP após a implantação.

## Pendências de conteúdo

- Links definitivos HeroSpark, área de membros, vídeo e WhatsApp.
- Valores, condições e aprovação de disponibilidade antes de ativar qualquer plano.
- Manuais finais para conferir as descrições de Gordon, Penguin e Joker.
- Validação da implantação na conta Vercel do responsável.
