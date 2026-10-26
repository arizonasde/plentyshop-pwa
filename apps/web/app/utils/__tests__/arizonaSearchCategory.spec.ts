import { describe, expect, it } from 'vitest';
import type { CategoryTreeItem } from '@plentymarkets/shop-api';
import { findArizonaSearchCategory } from '../arizonaSearchCategory';

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
