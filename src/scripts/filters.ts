import type { Wine, WineType, WineCollection } from '~/data/wines';

export interface FilterCriteria {
  types: WineType[];
  collections: WineCollection[];
  vintageMin?: number;
  vintageMax?: number;
  priceMin?: number;
  priceMax?: number;
  regions: string[];
  notes: string[];
  query: string;
  sort: 'price-asc' | 'price-desc' | 'vintage-desc' | 'vintage-asc' | 'name' | 'score';
}

export const defaultCriteria: FilterCriteria = {
  types: [],
  collections: [],
  regions: [],
  notes: [],
  query: '',
  sort: 'score',
};

export function filterWines(wines: Wine[], c: FilterCriteria): Wine[] {
  const q = c.query.trim().toLowerCase();

  let out = wines.filter((w) => {
    if (c.types.length && !c.types.includes(w.type)) return false;
    if (c.collections.length && !c.collections.includes(w.collection)) return false;
    if (c.regions.length && !c.regions.some((r) => w.region.toLowerCase().includes(r.toLowerCase()))) return false;
    if (c.vintageMin && w.vintage < c.vintageMin) return false;
    if (c.vintageMax && w.vintage > c.vintageMax) return false;
    if (c.priceMin && w.price < c.priceMin) return false;
    if (c.priceMax && w.price > c.priceMax) return false;
    if (c.notes.length && !c.notes.some((n) => w.tasting.nose.includes(n))) return false;
    if (q) {
      const hay = `${w.name} ${w.region} ${w.grapes.join(' ')} ${w.tasting.nose.join(' ')} ${w.tasting.palate}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  switch (c.sort) {
    case 'price-asc':
      out = out.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      out = out.sort((a, b) => b.price - a.price);
      break;
    case 'vintage-desc':
      out = out.sort((a, b) => b.vintage - a.vintage);
      break;
    case 'vintage-asc':
      out = out.sort((a, b) => a.vintage - b.vintage);
      break;
    case 'name':
      out = out.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'score':
      out = out.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
      break;
  }

  return out;
}

export function criteriaToURL(c: FilterCriteria): string {
  const p = new URLSearchParams();
  if (c.types.length) p.set('type', c.types.join(','));
  if (c.collections.length) p.set('collection', c.collections.join(','));
  if (c.regions.length) p.set('region', c.regions.join(','));
  if (c.notes.length) p.set('notes', c.notes.join(','));
  if (c.query) p.set('q', c.query);
  if (c.vintageMin) p.set('vmin', String(c.vintageMin));
  if (c.vintageMax) p.set('vmax', String(c.vintageMax));
  if (c.priceMin) p.set('pmin', String(c.priceMin));
  if (c.priceMax) p.set('pmax', String(c.priceMax));
  if (c.sort !== 'score') p.set('sort', c.sort);
  return p.toString();
}

export function criteriaFromURL(search: string): FilterCriteria {
  const p = new URLSearchParams(search);
  return {
    types: (p.get('type')?.split(',') ?? []) as WineType[],
    collections: (p.get('collection')?.split(',') ?? []) as WineCollection[],
    regions: p.get('region')?.split(',') ?? [],
    notes: p.get('notes')?.split(',') ?? [],
    query: p.get('q') ?? '',
    vintageMin: p.get('vmin') ? Number(p.get('vmin')) : undefined,
    vintageMax: p.get('vmax') ? Number(p.get('vmax')) : undefined,
    priceMin: p.get('pmin') ? Number(p.get('pmin')) : undefined,
    priceMax: p.get('pmax') ? Number(p.get('pmax')) : undefined,
    sort: (p.get('sort') as FilterCriteria['sort']) ?? 'score',
  };
}
