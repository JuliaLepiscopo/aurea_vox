export interface Dish {
  slug: string;
  name: string;
  category: 'carnes' | 'peixes' | 'queijos' | 'massas' | 'sobremesas' | 'aperitivos';
  description: string;
  matches: string[];
}

export const dishes: Dish[] = [
  {
    slug: 'risoto-trufas',
    name: 'Risoto de Trufas Negras',
    category: 'massas',
    description: 'Risoto cremoso Arborio com trufas frescas e parmesão envelhecido.',
    matches: ['voz-dourada-branco-2021', 'aurea-chardonnay-classico'],
  },
  {
    slug: 'ostras-frescas',
    name: 'Ostras Frescas',
    category: 'peixes',
    description: 'Ostras servidas com limão siciliano e mignonette de chalota.',
    matches: ['voz-dourada-branco-2021'],
  },
  {
    slug: 'queijos-curados',
    name: 'Queijos Curados',
    category: 'queijos',
    description: 'Tábua de queijos envelhecidos: Comté, Manchego, Parmesão 36 meses.',
    matches: ['aurea-icone-2015', 'aurea-reserva-tinta-2018'],
  },
  {
    slug: 'sushi-premium',
    name: 'Sushi Premium',
    category: 'peixes',
    description: 'Omakase de peixes japoneses de alta qualidade.',
    matches: ['voz-dourada-branco-2021'],
  },
  {
    slug: 'chocolate-amargo',
    name: 'Chocolate Amargo 85%',
    category: 'sobremesas',
    description: 'Ganache intensa de chocolate de origem única.',
    matches: ['aurea-reserva-tinta-2018', 'aurea-icone-2015'],
  },
];
