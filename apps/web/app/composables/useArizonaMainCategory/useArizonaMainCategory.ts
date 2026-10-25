import { categoryTreeGetters, type CategoryTreeItem } from '@plentymarkets/shop-api';

/**
 * Arizona: the main category (Damen, Herren, …) the shopper is currently in, as on large fashion shops.
 * Taken from the URL; outside the category tree (home, product, cart) the last visited one stays selected,
 * falling back to the first main category.
 */
export const useArizonaMainCategory = () => {
  const { data: categories } = useCategoryTree();
  const { buildCategoryMenuLink } = useLocalization();
  const localePath = useLocalizedPath();
  const route = useRoute();
  const lastMainCategoryId = useState<number | null>('arizonaLastMainCategory', () => null);

  // getTree updates childCount in place, so it works on a copy to keep this computed free of side effects
  const tree = computed(() => categoryTreeGetters.getTree(JSON.parse(JSON.stringify(categories.value))));

  const linkOf = (node: CategoryTreeItem) => localePath(buildCategoryMenuLink(node, tree.value));

  const isInRoute = (node: CategoryTreeItem) => {
    const base = linkOf(node).replace(/\/$/, '');
    return base.length > 1 && (route.path === base || route.path.startsWith(`${base}/`));
  };

  const routeMainCategory = computed(() => tree.value.find((node) => isInRoute(node)));

  watch(
    routeMainCategory,
    (node) => {
      if (node) lastMainCategoryId.value = node.id;
    },
    { immediate: true },
  );

  const currentMainCategory = computed(
    () =>
      routeMainCategory.value ??
      tree.value.find((node) => node.id === lastMainCategoryId.value) ??
      tree.value[0],
  );

  return { tree, linkOf, isInRoute, currentMainCategory };
};
