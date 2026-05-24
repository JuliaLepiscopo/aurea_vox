# Aurea Vox

> _A Voz Dourada — vinhos artesanais nascidos de vinhedos milenares._

Site institucional da vinícola **Aurea Vox**, construído em [Astro](https://astro.build) com ilhas de interatividade em TypeScript. Apresenta a coleção de vinhos, o terroir, o clube privado e ferramentas interativas de harmonização e perfil sensorial.

## Stack

- **[Astro 4](https://astro.build)** — SSG com componentes `.astro`, MPA nativa, View Transitions
- **[Tailwind CSS](https://tailwindcss.com)** via `@astrojs/tailwind`
- **TypeScript** para scripts interativos
- **[Motion One](https://motion.dev)** (~4 kb) para scroll animations
- **React 19** + **Remotion** (disponíveis para componentes/vídeo)
- Fontes self-hosted via `@fontsource`: Cormorant Garamond, Great Vibes, Manrope

## Estrutura

```
aurea_vox/
├── astro.config.mjs
├── tailwind.config.mjs
├── public/                       # imagens, SVGs, fontes
└── src/
    ├── layouts/
    │   └── BaseLayout.astro      # <head>, Navbar, Footer, View Transitions
    ├── components/
    │   ├── Navbar.astro · Footer.astro · MobileNav.astro
    │   ├── Hero.astro · SectionHeader.astro · Button.astro
    │   ├── WineCard.astro · FeatureCard.astro · Reveal.astro
    │   └── islands/              # componentes interativos
    │       ├── TerroirMap.astro
    │       ├── WineCatalog.astro
    │       ├── WineCarousel.astro
    │       ├── WineWheel.astro
    │       ├── PairingTool.astro
    │       └── SensoryRadar.astro
    ├── pages/
    │   ├── index.astro           # Home
    │   ├── terroir.astro         # História + geologia + mapa interativo
    │   ├── vinhos.astro          # Catálogo com filtros e busca
    │   ├── vinhos/[slug].astro   # Ficha individual do vinho
    │   └── clube.astro           # Clube privado + experiências
    ├── data/
    │   ├── wines.ts              # catálogo tipado
    │   ├── vineyards.ts          # vinhedos e parcelas
    │   └── pairings.ts           # regras de harmonização
    ├── scripts/
    │   ├── reveal.ts             # IntersectionObserver helper
    │   └── filters.ts            # lógica de filtros e busca
    └── styles/
        ├── tokens.css            # variáveis CSS da paleta + tipografia
        └── global.css            # base, reset, utilities
```

## Páginas

| Rota              | Conteúdo                                                              |
| ----------------- | --------------------------------------------------------------------- |
| `/`               | Manifesto da marca, pilares, vinhos em destaque, CTA para o clube     |
| `/terroir`        | História da vinícola, geologia, mapa interativo de parcelas, timeline |
| `/vinhos`         | Coleção completa com filtros (tipo, safra, score) e busca             |
| `/vinhos/[slug]`  | Ficha sensorial, harmonização e dados técnicos de cada vinho          |
| `/clube`          | Clube privado, experiências exclusivas e formulário de interesse      |

## Features

- **Scroll reveals** via `IntersectionObserver` (componente `Reveal.astro`)
- **Mapa de terroir** interativo com hotspots e tooltips das parcelas
- **Catálogo reativo** com filtros combináveis e busca textual
- **Ferramenta de harmonização** que cruza perfil do vinho com pratos
- **Radar sensorial** em SVG inline (sem bibliotecas de gráficos)
- **Roda de vinhos** e **carrossel** para navegação visual da coleção

## Como rodar

```bash
npm install
npm run dev        # http://localhost:4321
```

Outros comandos:

```bash
npm run build      # build de produção em dist/
npm run preview    # serve o build localmente
```

## Convenções

- **Design tokens** centralizados em [src/styles/tokens.css](src/styles/tokens.css) (paleta, tipografia, espaçamentos)
- **Componentes duplicados antigos** (navbar, footer, hero) foram consolidados — não duplicar HTML entre páginas
- **Ilhas de interatividade** ficam em [src/components/islands/](src/components/islands/) e devem ser hidratadas com `client:*` apenas quando necessário
- **Dados** tipados em [src/data/](src/data/) — não hardcodar listas de vinhos nas páginas

## Histórico

O projeto começou como um único arquivo HTML monolítico (`teste.html`, ~2000 linhas, 7 páginas concatenadas, Tailwind via CDN, zero JS funcional) e foi reestruturado em Astro conforme o plano descrito em [PLANO-REESTRUTURACAO.md](PLANO-REESTRUTURACAO.md).
