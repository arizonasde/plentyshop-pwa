import { describe, expect, it } from 'vitest';
import { getArizonaItemImageSrcset } from '../arizonaImage';

describe('getArizonaItemImageSrcset', () => {
  it('adds the preview size to a middle item image', () => {
    expect(
      getArizonaItemImageSrcset('https://cdn02.plentyone.com/f05ilw2rfpls/item/images/8135/middle/Grau--1-.jpg'),
    ).toBe(
      'https://cdn02.plentyone.com/f05ilw2rfpls/item/images/8135/preview/Grau--1-.jpg 138w, ' +
        'https://cdn02.plentyone.com/f05ilw2rfpls/item/images/8135/middle/Grau--1-.jpg 485w',
    );
  });

  it('ignores other image sizes and other URLs', () => {
    expect(
      getArizonaItemImageSrcset('https://cdn02.plentyone.com/f05ilw2rfpls/item/images/8135/full/Grau--1-.jpg'),
    ).toBeUndefined();
    expect(
      getArizonaItemImageSrcset('https://cdn02.plentyone.com/f05ilw2rfpls/frontend/arizona-startseite/middle/a.webp'),
    ).toBeUndefined();
    expect(getArizonaItemImageSrcset('')).toBeUndefined();
  });
});
