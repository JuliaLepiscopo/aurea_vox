# Reformulação do site Aurea Vox em Astro

## Context

Hoje o projeto é um único arquivo [teste.html](teste.html) com **2031 linhas** contendo **7 páginas HTML concatenadas** (2 delas duplicatas do design system). Usa Tailwind via CDN, repete manualmente navbar/footer em cada página, tem paleta e tipografia inconsistentes entre páginas, e **zero JavaScript funcional** — botões, filtros e formulários são puramente decorativos.

A proposta de marca (AUREA VOX) é rica em direção criativa — paleta detalhada de 12 cores, sistema tipográfico de 3 camadas, visão de exclusividade, harmonização, clube do vinho, fichas sensoriais — mas nada disso está implementado. O site parece genérico porque é: hero + grid + footer, repetidos em cada página.

**Objetivo**: reestruturar em Astro (SSG com ilhas de interatividade), componentizar tudo que hoje é duplicado, consolidar design tokens em variáveis CSS, e implementar as 4 features criativas que dão identidade à marca: scroll animations, mapa de terroir interativo, filtros de vinho funcionais + busca, e ferramenta de harmonização com perfil sensorial.

---

## 1. Stack e esqueleto do projeto

**Ferramentas**
- **Astro 4.x** — SSG com componentes `.astro`, MPA nativa com View Transitions, ilhas de JS sob demanda
- **Tailwind CSS** via `@astrojs/tailwind` (local, não mais CDN)
- **TypeScript** para os scripts interativos
- **Motion One** (`motion`, ~4kb) para scroll animations — leve, performant, API moderna
- **Sem dependências pesadas**: sem React/Vue, sem Chart.js (radar feito em SVG inline)

**Estrutura de diretórios**

```
aurea_vox/
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
├── tsconfig.json
├── public/
│   └── fonts/                    # self-hosted opcional
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro      # <head>, fonts, meta, Navbar, Footer, View Transitions
│   ├── components/
│   │   ├── Navbar.astro
│   │   ├── Footer.astro
│   │   ├── MobileNav.astro
│   │   ├── Hero.astro            # props: title, subtitle, image, variant
│   │   ├── SectionHeader.astro   # label + H2 + divisor dourado
│   │   ├── WineCard.astro        # props: wine (tipo de src/data/wines.ts)
│   │   ├── FeatureCard.astro
│   │   ├── BentoGrid.astro
│   │   ├── Button.astro          # variants: primary (gold), ghost, link
│   │   ├── Divider.astro
│   │   ├── Reveal.astro          # wrapper que anima via IntersectionObserver
│   │   ├── Parallax.astro        # camadas com translate no scroll
│   │   └── islands/              # componentes interativos (client:*)
│   │       ├── TerroirMap.astro
│   │       ├── WineCatalog.astro # filtros + busca + grid reativo
│   │       ├── PairingTool.astro
│   │       └── SensoryRadar.astro
│   ├── pages/
│   │   ├── index.astro           # Home: hero + história + bento vinhos + clube CTA
│   │   ├── terroir.astro         # História + geologia + mapa interativo + timeline
│   │   ├── vinhos.astro          # Coleção completa com filtros/busca + archive
│   │   ├── clube.astro           # Private Club + experiências + formulário de interesse
│   │   └── shop.astro            # Curated Vault + edições limitadas
│   ├── data/
│   │   └── wines.ts              # catálogo tipado (Wine[])
│   ├── styles/
│   │   ├── tokens.css            # variáveis CSS da paleta + tipografia
│   │   └── global.css            # base, reset, utilities custom
│   └── scripts/
│       ├── reveal.ts             # IntersectionObserver helper
│       ├── filters.ts            # lógica de filtros + busca (pure functions)
│       ├── terroir-map.ts        # hotspots, tooltips, transições
│       ├── pairing.ts            # motor de sugestão de harmonização
│       └── radar.ts              # renderização SVG do radar sensorial
└── teste.html                    # mantido como referência visual durante a migração
```

---

## 2. Design tokens (consolidação da paleta)

Arquivo [src/styles/tokens.css](src/styles/tokens.css) com a paleta completa do brief:

```css
:root {
  /* Núcleo — base escura e dramática */
  --nero-profundo: #0a0a0a;
  --gunmetal: #1f2226;
  --antracite: #2a2a2a;

  /* Acentos metálicos e quentes */
  --dourado-rico: #d4af37;
  --dourado-quente: #e9c176;
  --bronze-escovado: #8c6a3b;
  --cobre-oxidado: #b87333;
  --ambar-caramelo: #c98b4b;

  /* Secundário — textura e vida */
  --borgonha: #722f37;
  --rubi-profundo: #5a1a1f;
  --creme-texturizado: #e8dcc4;
  --nogueira: #3d2817;
  --cinza-rochoso: #4a4643;
  --verde-tropical: #1a3a2a;

  /* Tipografia */
  --font-display: 'Cormorant Garamond', 'Playfair Display', serif;
  --font-body: 'Manrope', 'Montserrat', sans-serif;
  --font-script: 'Great Vibes', cursive;

  /* Tracking luxuoso */
  --tracking-luxury: 0.3em;
  --tracking-label: 0.4em;
}
```

**Justificativa das escolhas tipográficas** (baseadas no brief do usuário):
- **Cormorant Garamond** para display — o brief lista como primeira opção clássica/atemporal
- **Manrope** para corpo — já usado em [teste.html](teste.html) e funciona bem; alinha com a recomendação de sans-serif humanista
- **Great Vibes** para acentos (ex.: "Reserva", "Edição Limitada") — uso moderado como o brief recomenda

Fontes carregadas via `@fontsource` (self-hosted) em vez de Google Fonts CDN, para performance e offline-first.

---

## 3. Páginas (estrutura final)

A partir da auditoria do [teste.html](teste.html), consolido 7 páginas → **5 páginas reais**, eliminando as duplicatas do design system e fundindo conteúdos redundantes:

| Página | Arquivo | Conteúdo | Origem no teste.html |
|---|---|---|---|
| **Home** | [src/pages/index.astro](src/pages/index.astro) | Hero cinemático + manifesto "Voz Dourada" + bento de vinhos destaques + citação + CTA clube | Lines 1–279 |
| **Terroir** | [src/pages/terroir.astro](src/pages/terroir.astro) | Hero atmosférico + narrativa + **mapa interativo** + timeline geológica + processo artesanal | Lines 280–876 (consolidado) |
| **Vinhos** | [src/pages/vinhos.astro](src/pages/vinhos.astro) | **Catálogo completo com filtros funcionais + busca** + cada card abre detalhe com radar sensorial + harmonização | Lines 877–1156 + 1582–2031 |
| **Clube** | [src/pages/clube.astro](src/pages/clube.astro) | Private Club + experiências + niveis de membership + formulário de interesse funcional | Lines 1157–1492 |
| **Shop** | [src/pages/shop.astro](src/pages/shop.astro) | Vault curado + edições limitadas + safras raras | Lines 1868–2012 |

---

## 4. Componentes compartilhados

Todos os componentes que hoje estão duplicados 6–7 vezes viram `.astro` com props tipadas:

- **[Navbar.astro](src/components/Navbar.astro)** — props: `current` (destaca item ativo). Hoje duplicado em lines 101, 371, 667, 970, 1264, 1585, 1853
- **[Footer.astro](src/components/Footer.astro)** — hoje duplicado 6×
- **[Hero.astro](src/components/Hero.astro)** — props: `variant: 'fullscreen' | 'half' | 'asymmetric'`, `image`, `eyebrow`, `title`, `subtitle`, `cta`. Hoje duplicado 4× com padrão praticamente igual
- **[SectionHeader.astro](src/components/SectionHeader.astro)** — label + H2 + divisor dourado. Hoje repetido ~15× inline
- **[WineCard.astro](src/components/WineCard.astro)** — props: `wine: Wine`, `size: 'sm' | 'md' | 'lg'`
- **[Button.astro](src/components/Button.astro)** — primary (gradient dourado), ghost, link
- **[BentoGrid.astro](src/components/BentoGrid.astro)** — layout genérico com slots

---

## 5. Features criativas (ilhas de interatividade)

### 5.1 Scroll animations — [src/components/Reveal.astro](src/components/Reveal.astro) + [Parallax.astro](src/components/Parallax.astro)

Wrapper components que aplicam IntersectionObserver (custom, ~40 linhas, sem dependência) ou Motion One para animações mais ricas:

- **Reveal** — fade + translate-y quando o elemento entra na viewport. Variantes: `up`, `left`, `right`, `stagger` (filhos em cascata)
- **Parallax** — camadas de hero com `translateY` baseado em `scrollY`, usando `requestAnimationFrame`
- Respeita `prefers-reduced-motion`

Uso: envolver seções em `<Reveal direction="up">...</Reveal>`. Aplicado em todas as páginas.

### 5.2 Mapa de Terroir interativo — [src/components/islands/TerroirMap.astro](src/components/islands/TerroirMap.astro)

SVG inline com regiões dos vinhedos como `<path>` clicáveis. Script `client:visible`:

- **Hotspots**: 4–6 regiões (ex.: Vinhedo Alto, Vinhedo da Pedra, Vinhedo do Vale)
- **Ao hover**: região ganha brilho dourado + tooltip com nome
- **Ao clicar**: painel lateral desliza mostrando altitude, composição do solo (schist, calcário), microclima, castas plantadas, safra típica
- **Camada geológica opcional**: toggle para ver seção transversal do subsolo (as 3 camadas de schist do brief)

Dados em [src/data/wines.ts](src/data/wines.ts) (campo `vineyard`) + [src/data/vineyards.ts](src/data/vineyards.ts).

### 5.3 Catálogo com filtros + busca — [src/components/islands/WineCatalog.astro](src/components/islands/WineCatalog.astro)

Island `client:load` na página [vinhos.astro](src/pages/vinhos.astro):

- **Filtros**: tipo (tinto/branco/rosé/espumante), safra (range de anos), região (multi-select), faixa de preço (slider), notas sensoriais (chips: frutado, especiado, mineral, amadeirado)
- **Busca**: campo de texto que filtra nome + notas de prova (debounced 200ms)
- **Ordenação**: preço, safra, nome, pontuação
- **URL state**: filtros refletidos em query params para compartilhamento (`?tipo=tinto&safra=2015-2020`)
- **Grid reativo**: animação suave ao filtrar (FLIP technique)
- **Estado vazio**: ilustração + sugestão de limpar filtros

Lógica pura em [src/scripts/filters.ts](src/scripts/filters.ts) (funções `filterWines(wines, criteria)`, `searchWines(wines, query)`), testável isoladamente.

### 5.4 Ficha sensorial (radar SVG) + Harmonização — [SensoryRadar.astro](src/components/islands/SensoryRadar.astro) + [PairingTool.astro](src/components/islands/PairingTool.astro)

Ao clicar em um vinho do catálogo, abre detalhe lateral (ou `/vinhos/[slug]`):

- **Radar sensorial SVG** (5 eixos: corpo, taninos, acidez, doçura, final). Animação de desenho do polígono ao entrar na viewport. Sem Chart.js — SVG puro (~80 linhas TS)
- **Harmoniza com**: cards horizontais de pratos recomendados (carne vermelha, queijos azuis, chocolate amargo, etc.) com imagem e descrição curta
- **Ferramenta de sugestão inversa**: dropdown "Estou servindo [prato]" → retorna vinhos recomendados. Mapeamento declarativo em [src/scripts/pairing.ts](src/scripts/pairing.ts)

---

## 6. Modelagem de dados — [src/data/wines.ts](src/data/wines.ts)

Tipagem rica para alimentar catálogo, filtros, radar, harmonização:

```ts
export interface Wine {
  slug: string;
  name: string;
  collection: 'Reserva' | 'Edição Limitada' | 'Ícone' | 'Clássico';
  type: 'tinto' | 'branco' | 'rose' | 'espumante';
  vintage: number;
  region: string;
  vineyardId: string;           // FK para vineyards.ts (mapa interativo)
  grapes: string[];
  alcohol: number;
  aging: string;                // "18 meses em carvalho francês"
  price: number;
  image: string;
  tasting: {
    nose: string[];             // ["frutas vermelhas", "especiarias"]
    palate: string;
  };
  sensory: {
    body: number;               // 0–5
    tannins: number;
    acidity: number;
    sweetness: number;
    finish: number;
  };
  pairings: string[];           // ["carne vermelha", "queijos curados"]
  limitedEdition?: boolean;
  score?: number;               // Parker/Suckling
}
```

Catálogo inicial com ~8–12 vinhos fictícios cobrindo todas as coleções para exercitar filtros.

---

## 7. Microinterações e detalhes criativos

Para endereçar o "falta criatividade":

- **View Transitions nativas do Astro** entre páginas (fade + slide sutil)
- **Cursor customizado** em áreas interativas: pequeno círculo dourado que cresce sobre elementos clicáveis (desktop apenas, desativado em mobile)
- **Hover no WineCard**: imagem da garrafa flutua levemente, rótulo revela notas de prova em overlay gradiente
- **Números animados**: contadores (safras, hectares, anos de tradição) animam ao entrar na viewport
- **Texto com gradiente dourado** em headlines estratégicas
- **Paralaxe de 3 camadas** no hero da Home (fundo cênico + garrafa + partículas)
- **Som opcional** (muted por padrão, toggle no footer): ambiente de adega sutil, com respeito absoluto a `prefers-reduced-motion` e a11y
- **Scroll-linked progress bar** dourada no topo
- **Easter egg**: no Private Club, Konami-code-like reveal de safra oculta

---

## 8. Estratégia de migração

1. Criar estrutura Astro do zero em paralelo — **não apagar [teste.html](teste.html) ainda**, ele fica como referência visual durante toda a migração
2. Extrair paleta e tipografia para [tokens.css](src/styles/tokens.css)
3. Construir componentes base (Navbar, Footer, Hero, SectionHeader, WineCard, Button) copiando markup do teste.html e parametrizando
4. Montar as 5 páginas usando os componentes
5. Construir as 4 ilhas interativas, cada uma com dados reais em [wines.ts](src/data/wines.ts) / [vineyards.ts](src/data/vineyards.ts)
6. Adicionar Reveal/Parallax em todas as seções principais
7. Aplicar microinterações e View Transitions
8. Revisar responsividade (mobile-first check em todas as páginas)
9. Apenas no final, mover [teste.html](teste.html) para `/reference/teste.html` ou remover

---

## 9. Arquivos críticos a criar/modificar

**Criar**:
- [package.json](package.json), [astro.config.mjs](astro.config.mjs), [tailwind.config.mjs](tailwind.config.mjs), [tsconfig.json](tsconfig.json)
- [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro)
- Todos os componentes em [src/components/](src/components/)
- Todas as 5 páginas em [src/pages/](src/pages/)
- [src/data/wines.ts](src/data/wines.ts), [src/data/vineyards.ts](src/data/vineyards.ts)
- [src/styles/tokens.css](src/styles/tokens.css), [src/styles/global.css](src/styles/global.css)
- [src/scripts/](src/scripts/) (reveal, filters, terroir-map, pairing, radar)

**Manter como referência** (não modificar):
- [teste.html](teste.html) — usado como guia visual até a migração terminar

---

## 10. Verificação

- `npm run dev` — abrir em `http://localhost:4321`, navegar por todas as 5 páginas, verificar View Transitions
- **Home**: scroll da hero aciona parallax, bento de vinhos tem reveal em cascata
- **Terroir**: clicar em cada hotspot do mapa abre painel com dados corretos; toggle de camadas geológicas funciona
- **Vinhos**: aplicar combinações de filtros + busca; URL atualiza; limpar filtros restaura grid; clicar em um vinho abre detalhe com radar animando
- **Vinhos → detalhe**: radar SVG desenha no scroll; ferramenta inversa de harmonização retorna vinhos ao selecionar prato
- **Clube**: formulário de interesse valida campos e mostra estado de sucesso (mockado, sem backend)
- **Shop**: cards de edição limitada têm selo "Reserva" em Great Vibes
- **Acessibilidade**: navegar por teclado; testar com `prefers-reduced-motion: reduce` (animações desligam); contraste AA nos pares texto/fundo da paleta
- **Mobile** (DevTools iPhone 14): navbar vira drawer, mapa de terroir recebe versão simplificada (lista com accordion), filtros viram bottom sheet
- `npm run build` — SSG gera 5 páginas estáticas sem erros; `npm run preview` serve o build
- Lighthouse: alvo Performance ≥ 90, Accessibility ≥ 95
