# Método FST

Landing page do Método FST, baseada na referência e no prompt mestre fornecidos pelo responsável: preto obsidiana, dourado metálico, terminal interativo, quatro pilares em grade 2×2, prévia de treinamento e modalidades de acesso.

Site estático responsivo, sem dependências de produção, pronto para a Vercel. Node.js 22 ou superior.

## Executar

```sh
npm run dev
npm test
npm run build
npm run preview
```

Prévia local: http://127.0.0.1:4173. O build produz `dist/`. Não é necessário instalar bibliotecas de produção.

## Publicar na Vercel

Importar `JaysonRW/metodofst`, branch `main`, usando a raiz do repositório. Framework: **Other**. O `vercel.json` configura `npm run build` e a saída `dist`. Não há variáveis de ambiente obrigatórias.

O envio ao GitHub não significa que o projeto já tenha sido implantado na Vercel. A conexão com a hospedagem deve ser feita na conta do responsável.

## Decisão comercial vigente

Em 19/11/2026, o responsável confirmou que Day Use, mensalidade e anualidade são **propostas futuras**. A página deve mostrar os planos em preparação, sem preços fictícios ou promessa dos extras do conceito.

- Sem Wayne, suporte VIP, desconto percentual, certificação, licença institucional ou vínculo ao CPF como benefícios vendidos.
- Sem selo “mais popular” ou comparação “mais vantajoso” não comprovados. O destaque central identifica apenas a suíte completa.
- A área de membros é uma prévia conceitual de organização, não uma plataforma já entregue.
- Não há vídeo real fornecido ainda. O botão informa essa condição; não reproduz um vídeo inventado.
- Sem telefone de WhatsApp fornecido, o contato usa o e-mail oficial.
- Garantia de 7 dias apresentada por solicitação do responsável, referente à compra, não aos resultados de operações. Alinhar os termos na oferta antes da abertura.

## Configuração centralizada

Editar `public/site-config.js`. Todos os valores são públicos; nunca inserir senhas ou tokens.

| Campo em `CONFIG_LINKS` | Uso |
|---|---|
| `checkoutAvulso` | Checkout HeroSpark da modalidade avulsa |
| `checkoutSuiteMensal` | Checkout HeroSpark da suíte mensal |
| `checkoutAnualVip` | Checkout HeroSpark do acesso anual; a chave segue o prompt, sem prometer VIP |
| `areaDeMembros` | Destino HTTPS do botão Entrar |
| `videoDemonstracao` | YouTube ou Vimeo; carregado apenas após o clique |
| `whatsappSuporte` | URL `https://wa.me/` com DDI, DDD e número, quando fornecido |

Em `siteConfig`, também podem ser ajustados `logoPath`, `supportEmail` e `instagramUrl`.

Para ativar uma modalidade: revisar o conteúdo e as condições da oferta, preencher seu checkout, informar `price` e `period`, e definir `available: true` no plano correspondente. Sem essas três condições, a página mantém a consulta de disponibilidade e não redireciona à compra. O build rejeita planos ativos sem preço ou checkout válido.

Os links de checkout aceitam HTTPS em `herospark.com` ou seus subdomínios. Links de vídeo são normalizados para os players YouTube com privacidade aprimorada ou Vimeo. Outros fornecedores devem ser implementados e validados antes de uso.

## Logo

`public/assets/logo-fst-original.png` contém a imagem oficial fornecida, preservada sem redesenho. O cabeçalho e o rodapé enquadram seu emblema com CSS, junto à assinatura horizontal. A prévia da área de membros também utiliza a imagem.

## Interações

- Candles laterais com velocidades distintas de parallax, ocultos em telas pequenas.
- Terminal em perspectiva com candles, médias ilustrativas e histograma.
- Mira que acompanha a seleção e HUD com leitura fictícia. Funciona com cursor, toque e setas do teclado; Home e End selecionam as extremidades.
- Micrográficos com reação ao hover e ao foco.
- Revelação suave de seções, menu móvel, diálogo nativo com retorno de foco e FAQ semântico.
- Preferência `prefers-reduced-motion` respeitada, sem loops contínuos de animação JavaScript.

As séries do gráfico são determinísticas e fictícias. Não há conexão a corretoras, cotações ou execução da lógica dos indicadores. As descrições comerciais seguem o briefing recebido e deverão ser confrontadas com os manuais finais.

## Captação e privacidade

A versão atual encaminha interessados ao contato direto. Não possui formulário com armazenamento, cadastro de lista ou pixels publicitários. Nenhum botão simula coleta de dados. As fontes são servidas pelo Google Fonts. Ao adicionar formulário, métricas, pixels ou novos serviços, atualizar o tratamento de dados e o aviso de privacidade.

## Arquivos

- `public/index.html`: estrutura e conteúdo.
- `public/styles.css`: identidade visual e responsividade.
- `public/app.js`: gráficos e interações.
- `public/site-config.js`: destinos, planos e validação de URLs.
- `scripts/build.mjs`: validação e distribuição.
- `scripts/serve.mjs`: servidor para desenvolvimento local.
- `tests/checkout.test.mjs`: proteção de checkout, estados futuros e provedores de vídeo/contato.
- `VERIFICACAO.md`: verificações realizadas e limites.
