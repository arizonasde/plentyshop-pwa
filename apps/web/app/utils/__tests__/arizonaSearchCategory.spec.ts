import { describe, expect, it } from 'vitest';
import type { CategoryTreeItem, FilterGroup } from '@plentymarkets/shop-api';
import { findArizonaSearchCategory, resolveArizonaSearch } from '../arizonaSearchCategory';

const node = (id: number, name: string, children: CategoryTreeItem[] = []) =>
  ({ id, details: [{ name, nameUrl: name.toLowerCase() }], children }) as unknown as CategoryTreeItem;

const tree = [
  node(44, 'Damen', [node(102, 'Jeans'), node(46, 'Hosen'), node(106, 'Kleider & Röcke'), node(104, 'Oberteile & Shirts')]),
  node(16, 'Herren', [node(31, 'Jeans'), node(17, 'Hosen'), node(21, 'Jogginghosen')]),
  node(236, 'Kinder', [node(237, 'Mädchen', [node(300, 'Jeans'), node(301, 'Kleider')]), node(238, 'Jungen')]),
  node(642, 'Sport', [node(528, 'Damen SPORT')]),
];

const idOf = (term: string) => findArizonaSearchCategory(tree, term)?.id;

describe('findArizonaSearchCategory', () => {
  it('leads gender and category words to the category', () => {
    expect(idOf('jeans damen')).toBe(102);
    expect(idOf('Damen Jeans')).toBe(102);
    expect(idOf('herren hose')).toBe(17);
    expect(idOf('shirts frauen')).toBe(104);
    expect(idOf('mädchen jeans')).toBe(300);
  });

  it('leads a main category word to the main category', () => {
    expect(idOf('damen')).toBe(44);
    expect(idOf('Männer')).toBe(16);
  });

  it('uses a category that exists only once', () => {
    expect(idOf('kleider')).toBe(106);
  });

  it('keeps the search for ambiguous or unknown words', () => {
    expect(idOf('jeans')).toBeUndefined();
    expect(idOf('rote jeans damen')).toBeUndefined();
    expect(idOf('tom tailor')).toBeUndefined();
    expect(idOf('')).toBeUndefined();
  });
});

const facet = (id: number, name: string, type: string, values: [number, string][]) =>
  ({ id, name, type, count: 0, values: values.map(([valueId, valueName]) => ({ id: valueId, name: valueName })) }) as unknown as FilterGroup;

const facets = [
  facet(0, 'Artikelbewertung', 'feedback', [[1, 'feedback-1']]),
  facet(9, 'Kategorie', 'dynamic', [
    [106, 'Jeans'],
    [105, 'Hosen'],
    [119, 'Kleider'],
  ]),
  facet(4, 'Größe', 'dynamic', [
    [3, 'S'],
    [17, 'XL'],
    [40, '38'],
  ]),
  facet(1, 'Farbe', 'dynamic', [
    [8, 'Blau'],
    [5, 'Grau/Silber'],
    [10, 'Rot'],
  ]),
  facet(3, 'Marke', 'producer', [
    [91, 'JACK & JONES'],
    [140, 'TOM TAILOR'],
  ]),
];

describe('resolveArizonaSearch', () => {
  it('turns colour into a filter and searches the remaining word', () => {
    expect(resolveArizonaSearch('jeans blau', facets, tree)).toEqual({ facetIds: ['8'], term: 'jeans' });
    expect(resolveArizonaSearch('Skinny Jeans blau', facets, tree)).toEqual({ facetIds: ['8', '106'], term: 'Skinny' });
  });

  it('leads gender and category to the category and keeps colour and brand as filters', () => {
    const result = resolveArizonaSearch('Tom Tailor Jeans Damen blau', facets, tree);
    expect(result.category?.id).toBe(102);
    expect(result.facetIds).toEqual(['8', '140']);
  });

  it('matches sizes exactly and colours by part of their name', () => {
    expect(resolveArizonaSearch('jeans grau xl', facets, tree)).toEqual({ facetIds: ['17', '5'], term: 'jeans' });
    expect(resolveArizonaSearch('hose s', facets, tree)).toEqual({ facetIds: [], term: 'hose s' });
  });

  it('understands adjective endings', () => {
    expect(resolveArizonaSearch('rote jeans', facets, tree)).toEqual({ facetIds: ['10'], term: 'jeans' });
  });

  it('needs every word of a brand', () => {
    expect(resolveArizonaSearch('jack jeans', facets, tree)).toEqual({ facetIds: ['106'], term: 'jack' });
  });

  it('keeps unknown words as plain search', () => {
    expect(resolveArizonaSearch('sommer', facets, tree)).toEqual({ facetIds: [], term: 'sommer' });
    expect(resolveArizonaSearch('jeans', facets, tree)).toEqual({ facetIds: [], term: 'jeans' });
  });
});
