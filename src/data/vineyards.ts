export interface Vineyard {
  id: string;
  name: string;
  altitude: string;
  area: string;
  soil: string[];
  climate: string;
  grapes: string[];
  description: string;
  coords: { x: number; y: number };
  geology: {
    layer: string;
    depth: string;
    composition: string;
  }[];
}

export const vineyards: Vineyard[] = [
  {
    id: 'pedra',
    name: 'Vinhedo da Pedra',
    altitude: '620m',
    area: '8 hectares',
    soil: ['Xisto decomposto', 'Calcário fragmentado', 'Argila férrica'],
    climate: 'Atlântico moderado · Amplitude térmica de 18°C',
    grapes: ['Cabernet Sauvignon', 'Petit Verdot', 'Touriga Nacional'],
    description: 'O coração da casa. Vinhedos plantados em encostas de xisto puro, cujas raízes mergulham até 12 metros em busca de água. Cada garrafa carrega o silêncio mineral da rocha.',
    coords: { x: 32, y: 28 },
    geology: [
      { layer: 'Solo ativo', depth: '0–0.8m', composition: 'Xisto decomposto + matéria orgânica' },
      { layer: 'Camada intermédia', depth: '0.8–4m', composition: 'Xisto fragmentado compacto' },
      { layer: 'Rocha mãe', depth: '4m+', composition: 'Xisto azul paleozoico' },
    ],
  },
  {
    id: 'alto',
    name: 'Vinhedo Alto',
    altitude: '780m',
    area: '12 hectares',
    soil: ['Granito decomposto', 'Cascalho de quartzo'],
    climate: 'Continental de altitude · Noites frias',
    grapes: ['Syrah', 'Chardonnay', 'Pinot Noir'],
    description: 'A parcela mais elevada, onde o ar rarefeito e as noites geladas preservam a acidez natural. Aqui nascem os vinhos de maior verticalidade e frescor.',
    coords: { x: 68, y: 18 },
    geology: [
      { layer: 'Solo arenoso', depth: '0–0.6m', composition: 'Granito decomposto + areia grossa' },
      { layer: 'Drenagem', depth: '0.6–3m', composition: 'Cascalho de quartzo bem drenado' },
      { layer: 'Rocha mãe', depth: '3m+', composition: 'Granito porfirítico' },
    ],
  },
  {
    id: 'vale',
    name: 'Vinhedo do Vale',
    altitude: '340m',
    area: '14 hectares',
    soil: ['Aluvial', 'Areia fina', 'Calcário ativo'],
    climate: 'Temperado úmido · Brisa do rio',
    grapes: ['Chardonnay', 'Chenin Blanc', 'Cinsault'],
    description: 'Solos aluviais nutridos pelo rio adjacente. A umidade do vale confere frescor aromático e texturas cremosas, ideais para brancos aromáticos e rosés de precisão.',
    coords: { x: 48, y: 68 },
    geology: [
      { layer: 'Aluvial recente', depth: '0–1.5m', composition: 'Silte fértil + areia fina' },
      { layer: 'Calcário ativo', depth: '1.5–5m', composition: 'Calcário fragmentado com fósseis' },
      { layer: 'Rocha mãe', depth: '5m+', composition: 'Calcário jurássico' },
    ],
  },
];
