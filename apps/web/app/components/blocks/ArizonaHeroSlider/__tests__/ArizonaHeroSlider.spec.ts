import { mount } from '@vue/test-utils';
import ArizonaHeroSlider from '../ArizonaHeroSlider.vue';

const image = 'https://cdn02.plentyone.com/f05ilw2rfpls/item/images/8135/middle/Grau--1-.jpg';
const slide = (title: string) => ({
  pill: 'NEU',
  eyebrow: 'ENTDECKE DIE KOLLEKTION',
  title,
  link: '/muetzen',
  image: { desktop: '/slide-1400.webp', mobile: '/slide-800.webp', alt: title },
  products: [{ image, alt: 'Mütze grau', link: '/muetze-grau' }],
});

const mountSlider = () =>
  mount(ArizonaHeroSlider, {
    props: { name: 'ArizonaHeroSlider', type: 'content', index: 0, content: { slides: [slide('A'), slide('B')] } },
    global: { stubs: { NuxtLink: { template: '<a><slot /></a>' } } },
  });

describe('<ArizonaHeroSlider />', () => {
  it('renders tap-friendly slide dots', () => {
    const wrapper = mountSlider();
    const dots = wrapper.findAll('[role="tab"]');
    expect(dots).toHaveLength(2);
    dots.forEach((dot) => expect(dot.classes()).toEqual(expect.arrayContaining(['h-6', 'min-w-6'])));
  });

  it('offers the small preview image for the product tiles', () => {
    const wrapper = mountSlider();
    const tile = wrapper.find('[data-testid="arizona-hero-products"] img');
    expect(tile.attributes('srcset')).toContain('/item/images/8135/preview/Grau--1-.jpg 138w');
  });
});
