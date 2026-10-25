<template>
  <div ref="referenceRef" :style="navigationRootStyle" class="relative w-full">
    <nav
      v-if="viewport.isGreaterOrEquals('lg')"
      ref="floatingRef"
      class="flex items-center gap-4 border-b nav-border border-b-solid"
      :style="navigationContainerStyle"
      @mouseleave="onMouseLeave"
    >
      <ul
        ref="rowListRef"
        :class="[navigationContainerClasses, { 'overflow-hidden': !rowMeasured }]"
        class="flex-1 min-w-0"
        @focusout="onNavBlur"
      >
        <li v-if="rowItems.length === 0" class="h-10" />

        <li
          v-for="(menuNode, index) in rowItems"
          v-else
          v-show="index < visibleRowCount"
          :key="menuNode.id"
          class="shrink-0"
          data-nav-row-item
          @mouseenter="onCategoryMouseEnter(menuNode)"
        >
          <NuxtLink
            v-if="menuNode.childCount > 0"
            ref="triggerReference"
            :to="localePath(generateCategoryLink(menuNode))"
            data-testid="category-button"
            :class="[categoryButtonClasses, isActiveMainCategory(menuNode) && activeButtonClasses]"
            :style="categoryButtonStyle"
            tabindex="0"
            aria-haspopup="true"
            :aria-expanded="isOpen && activeNode[0] === menuNode.id ? 'true' : 'false'"
            @touchstart="onTouchStart"
            @mousedown="onMouseDown"
            @click.capture="onCategoryClickCapture($event, menuNode)"
            @keydown.enter="onEnterKey"
            @keydown.space.prevent="openMenuAndFocusFirst(menuNode)"
            @keydown.down.prevent="openMenuAndFocusFirst(menuNode)"
            @keydown.left="focusPreviousCategory(index)"
            @keydown.right="focusNextCategory(index)"
          >
            <span>{{ categoryTreeGetters.getName(menuNode) }}</span>
          </NuxtLink>

          <NuxtLink
            v-else
            ref="triggerReference"
            :to="localePath(generateCategoryLink(menuNode))"
            data-testid="category-button"
            :class="[categoryButtonClasses, isActiveMainCategory(menuNode) && activeButtonClasses]"
            :style="categoryButtonStyle"
            tabindex="0"
            @keydown.left="focusPreviousCategory(index)"
            @keydown.right="focusNextCategory(index)"
          >
            <span>{{ categoryTreeGetters.getName(menuNode) }}</span>
          </NuxtLink>

          <div
            v-if="
              isOpen &&
              activeMenu &&
              activeNode.length === 1 &&
              activeNode[0] === menuNode.id &&
              menuNode.childCount > 0
            "
            :key="activeMenu.id"
            ref="megaMenuReference"
            :style="{ ...style, backgroundColor: resolvedContent.color.backgroundColor || 'white' }"
            :class="[
              'hidden @md:grid gap-x-6 grid-cols-4 shadow-lg p-6 pt-5 left-0 right-0 outline-none z-sticky max-h-[calc(100vh-300px)] overflow-y-auto',
              submenuGridAlignmentClass,
            ]"
            @keydown.esc="focusTrigger(index)"
            @keydown.up="navigateDropdownItems($event, 'up')"
            @keydown.down="navigateDropdownItems($event, 'down')"
            @keydown.tab="handleTabInDropdown($event)"
          >
            <template v-for="node in activeMenu.children" :key="node.id">
              <template v-if="node.childCount === 0">
                <ul>
                  <li>
                    <SfListItem
                      :tag="NuxtLink"
                      size="sm"
                      :href="localePath(generateCategoryLink(node))"
                      :class="['mb-2 nav-hover-bg rounded font-medium typography-text-base', submenuTextAlignmentClass]"
                    >
                      {{ categoryTreeGetters.getName(node) }}
                    </SfListItem>
                  </li>
                </ul>
              </template>
              <div v-else>
                <SfListItem
                  :tag="NuxtLink"
                  size="sm"
                  :href="localePath(generateCategoryLink(node))"
                  :class="[
                    'typography-text-base font-medium text-neutral-900 px-4 py-1.5 nav-hover-bg rounded whitespace-normal break-words',
                    submenuTextAlignmentClass,
                  ]"
                >
                  {{ categoryTreeGetters.getName(node) }}
                </SfListItem>
                <ul class="mt-2 mb-3">
                  <li v-for="child in node.children" :key="child.id">
                    <SfListItem
                      v-if="categoryTreeGetters.getName(child)"
                      :tag="NuxtLink"
                      size="sm"
                      :href="localePath(generateCategoryLink(child))"
                      :class="['typography-text-sm py-1.5 nav-hover-bg rounded', submenuTextAlignmentClass]"
                    >
                      {{ categoryTreeGetters.getName(child) }}
                    </SfListItem>
                  </li>
                </ul>
              </div>
            </template>
          </div>
        </li>

        <!-- Arizona: subcategories that do not fit into the row are collected under "Mehr" -->
        <li
          v-if="hiddenRowItems.length"
          class="relative"
          data-testid="navigation-more"
          @mouseenter="openMoreMenu"
          @mouseleave="isMoreOpen = false"
        >
          <button
            type="button"
            :class="categoryButtonClasses"
            :style="categoryButtonStyle"
            :aria-expanded="isMoreOpen ? 'true' : 'false'"
            aria-haspopup="true"
            @click="isMoreOpen ? (isMoreOpen = false) : openMoreMenu()"
          >
            Mehr
            <SfIconChevronRight aria-hidden="true" size="sm" class="rotate-90 text-neutral-500" />
          </button>
          <ul
            v-if="isMoreOpen"
            class="absolute right-0 top-full z-dropdown min-w-56 rounded-lg bg-white p-2 shadow-lg ring-1 ring-neutral-200"
          >
            <li v-for="node in hiddenRowItems" :key="node.id">
              <NuxtLink
                :to="localePath(generateCategoryLink(node))"
                class="block rounded-md px-3 py-2 text-sm nav-hover-bg"
                :class="{ 'font-semibold': isActiveMainCategory(node) }"
                @click="isMoreOpen = false"
              >
                {{ categoryTreeGetters.getName(node) }}
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
      <UiSearch class="w-64 @xl:w-80 shrink-0" />
    </nav>

    <template v-else>
      <div v-if="isOpen" class="fixed z-drawer-backdrop inset-0 bg-neutral-500 bg-opacity-50" />
      <SfDrawer
        ref="drawerReference"
        v-model="isOpen"
        placement="left"
        class="right-12 max-w-96 bg-white overflow-y-auto z-drawer"
      >
        <nav>
          <div class="flex items-center justify-between p-4">
            <p class="typography-text-base font-medium">{{ t('common.actions.browseProducts') }}</p>
            <UiButton
              variant="tertiary"
              square
              :aria-label="t('common.navigation.closeMenu')"
              class="ml-2"
              @click="close()"
            >
              <SfIconClose aria-hidden="true" class="text-neutral-500" />
            </UiButton>
          </div>
          <ul v-if="activeMenu" class="mt-2 mb-6">
            <li v-if="activeMenu.id !== 0">
              <SfListItem
                size="lg"
                tag="button"
                type="button"
                class="nav-hover-bg"
                :aria-label="t('common.actions.back') + ' - ' + categoryTreeGetters.getName(activeMenu)"
                @click="goBack()"
              >
                <div class="flex items-center">
                  <SfIconArrowBack aria-hidden="true" class="text-neutral-500" />
                  <p class="ml-5 font-medium">{{ categoryTreeGetters.getName(activeMenu) }}</p>
                </div>
              </SfListItem>
            </li>
            <template v-for="node in activeMenu.children" :key="node.id">
              <li v-if="node.childCount === 0">
                <SfListItem
                  size="lg"
                  :tag="NuxtLink"
                  :href="localePath(generateCategoryLink(node))"
                  class="nav-hover-bg"
                  @click="close()"
                >
                  <div class="flex items-center">
                    <p class="text-left">{{ categoryTreeGetters.getName(node) }}</p>
                    <SfCounter class="ml-2">{{ categoryTreeGetters.getCount(node) }}</SfCounter>
                  </div>
                </SfListItem>
              </li>
              <li v-else>
                <div class="flex items-center nav-hover-bg">
                  <NuxtLink
                    class="flex-1 m-0 px-4 py-3 text-left"
                    :to="localePath(generateCategoryLink(node))"
                    @click="close()"
                  >
                    <div class="flex items-center">
                      <p class="text-left typography-text-lg">{{ categoryTreeGetters.getName(node) }}</p>
                      <SfCounter class="ml-2">{{ categoryTreeGetters.getCount(node) }}</SfCounter>
                    </div>
                  </NuxtLink>
                  <button
                    type="button"
                    class="flex justify-center items-center h-full w-16 px-4"
                    :aria-label="t('common.navigation.showSubcategories') + ' - ' + categoryTreeGetters.getName(node)"
                    @click="goNext(node.id)"
                  >
                    <SfIconChevronRight aria-hidden="true" class="text-neutral-500" />
                  </button>
                </div>
              </li>
            </template>
          </ul>
        </nav>
      </SfDrawer>
    </template>
  </div>
</template>

<script lang="ts" setup>
import {
  SfIconClose,
  SfDrawer,
  SfListItem,
  SfIconChevronRight,
  SfCounter,
  SfIconArrowBack,
  useTrapFocus,
  useDropdown,
} from '@storefront-ui/vue';
import { unrefElement } from '@vueuse/core';
import { type CategoryTreeItem, categoryTreeGetters } from '@plentymarkets/shop-api';
import type { NavigationBlockProps } from './types';

const props = withDefaults(defineProps<NavigationBlockProps>(), {
  categories: () => [],
  content: () => ({
    layout: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
    text: {
      textAlignment: 'left',
    },
    color: {
      backgroundColor: '',
      textColor: '',
      hoverBackgroundColor: '',
    },
  }),
});
const NuxtLink = resolveComponent('NuxtLink');

const viewport = useViewport();
const localePath = useLocalizedPath();
const { buildCategoryMenuLink } = useLocalization();
const router = useRouter();
const { close, open, isOpen, activeNode, category, setCategory } = useMegaMenu();
const { data: fetchedCategoryTree, getCategoryTree } = useCategoryTree();

const { referenceRef, floatingRef, style } = useDropdown({
  isOpen,
  onClose: close,
  placement: 'bottom-start',
  middleware: [],
});

const isUsingTouch = ref(false);
const lastTouchTime = ref(0);
const categoryTree = ref(categoryTreeGetters.getTree(props.categories));
const drawerReference = ref();
const megaMenuReference = ref();
const triggerReference = ref();
const tappedCategoryId = ref<number | null>(null);
const TOUCH_DETECTION_THRESHOLD = 500;
const categoryButtonClasses =
  'inline-flex items-center justify-center text-sm rounded-full py-2 px-2.5 group nav-hover-bg active:!bg-neutral-300 whitespace-nowrap';
// Arizona: this row lists the subcategories of the current main category (the main categories sit as pills in the
// header row); the subcategory the shopper is in is underlined.
const route = useRoute();
const { currentMainCategory } = useArizonaMainCategory();
const rowItems = computed(
  () => categoryTree.value.find((node) => node.id === currentMainCategory.value?.id)?.children ?? categoryTree.value,
);
// Arizona: keep the subcategory row on one line – measure the items once and show as many as fit
const MORE_BUTTON_WIDTH = 96;
const rowListRef = ref<HTMLElement | null>(null);
const rowItemWidths = ref<number[]>([]);
const rowWidth = ref(0);
const rowMeasured = ref(false);
const isMoreOpen = ref(false);
const visibleRowCount = computed(() => {
  if (!rowMeasured.value) return rowItems.value.length;
  const total = rowItemWidths.value.reduce((sum, width) => sum + width, 0);
  if (total <= rowWidth.value) return rowItems.value.length;
  let used = 0;
  let count = 0;
  for (const width of rowItemWidths.value) {
    if (used + width > rowWidth.value - MORE_BUTTON_WIDTH) break;
    used += width;
    count++;
  }
  return count;
});
const hiddenRowItems = computed(() => (rowMeasured.value ? rowItems.value.slice(visibleRowCount.value) : []));
const measureRow = async () => {
  rowMeasured.value = false;
  await nextTick();
  const list = rowListRef.value;
  if (!list) return;
  rowItemWidths.value = [...list.querySelectorAll<HTMLElement>('[data-nav-row-item]')].map(
    (item) => item.getBoundingClientRect().width,
  );
  rowWidth.value = list.clientWidth;
  rowMeasured.value = true;
};
const openMoreMenu = () => {
  close();
  isMoreOpen.value = true;
};
const isActiveMainCategory = (node: CategoryTreeItem) => {
  const base = localePath(generateCategoryLink(node)).replace(/\/$/, '');
  return base.length > 1 && (route.path === base || route.path.startsWith(`${base}/`));
};
const activeButtonClasses = 'font-semibold underline underline-offset-8 decoration-2';
let removeHook: () => void;

const trapFocusOptions = {
  activeState: isOpen,
  arrowKeysUpDown: false,
  initialFocus: false,
} as const;

const resolvedContent = computed(() => ({
  layout: {
    paddingTop: props.content?.layout?.paddingTop ?? 0,
    paddingBottom: props.content?.layout?.paddingBottom ?? 0,
    paddingLeft: props.content?.layout?.paddingLeft ?? 0,
    paddingRight: props.content?.layout?.paddingRight ?? 0,
  },
  text: {
    textAlignment: props.content?.text?.textAlignment ?? 'left',
  },
  color: {
    backgroundColor: props.content?.color?.backgroundColor ?? '',
    textColor: props.content?.color?.textColor ?? '',
    hoverBackgroundColor: props.content?.color?.hoverBackgroundColor ?? '',
  },
}));

const navigationRootStyle = computed(() => ({
  '--nav-hover-bg': resolvedContent.value.color.hoverBackgroundColor || undefined,
  '--nav-border-color': resolvedContent.value.color.textColor
    ? `color-mix(in srgb, ${resolvedContent.value.color.textColor} 15%, transparent)`
    : undefined,
}));

const navigationContainerClasses = computed(() => {
  switch (resolvedContent.value.text.textAlignment) {
    case 'center':
      return 'flex flex-nowrap justify-center';
    case 'right':
      return 'flex flex-nowrap justify-end';
    default:
      return 'flex flex-nowrap justify-start';
  }
});

const navigationContainerStyle = computed(() => ({
  backgroundColor: resolvedContent.value.color.backgroundColor || 'transparent',
  color: resolvedContent.value.color.textColor || undefined,
  paddingTop: `${resolvedContent.value.layout.paddingTop}px`,
  paddingBottom: `${resolvedContent.value.layout.paddingBottom}px`,
  paddingLeft: `${resolvedContent.value.layout.paddingLeft}px`,
  paddingRight: `${resolvedContent.value.layout.paddingRight}px`,
}));

const categoryButtonStyle = computed(() => ({
  color: resolvedContent.value.color.textColor || undefined,
}));

const submenuTextAlignmentClass = computed(() => {
  switch (resolvedContent.value.text.textAlignment) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
});

const submenuGridAlignmentClass = computed(() => {
  switch (resolvedContent.value.text.textAlignment) {
    case 'center':
      return 'justify-items-center';
    case 'right':
      return 'justify-items-end';
    default:
      return 'justify-items-start';
  }
});

const activeMenu = computed(() => (category.value ? findNode(activeNode.value, category.value) : null));

const findNode = (keys: number[], node: CategoryTreeItem): CategoryTreeItem => {
  if (keys.length > 1) {
    const [currentKey, ...restKeys] = keys;
    return findNode(restKeys, node.children?.find((child) => child.id === currentKey) || node);
  } else {
    return node.children?.find((child) => child.id === keys[0]) || node;
  }
};

const generateCategoryLink = (category: CategoryTreeItem) => {
  return buildCategoryMenuLink(category, categoryTree.value);
};

const goBack = () => {
  activeNode.value = activeNode.value.slice(0, -1);
};

const goNext = (key: number) => {
  activeNode.value = [...activeNode.value, key];
};

const focusTrigger = (index: number) => {
  unrefElement(triggerReference.value[index])?.focus();
};

const focusNextCategory = (currentIndex: number) => {
  const nextIndex = (currentIndex + 1) % rowItems.value.length;
  focusTrigger(nextIndex);
};

const focusPreviousCategory = (currentIndex: number) => {
  const prevIndex = currentIndex === 0 ? rowItems.value.length - 1 : currentIndex - 1;
  focusTrigger(prevIndex);
};

const openMenuAndFocusFirst = (menuNode: CategoryTreeItem) => {
  if (menuNode.childCount > 0) {
    onCategoryMouseEnter(menuNode);
    nextTick(() => {
      const firstLink = megaMenuReference.value?.[0]?.querySelector('a');
      firstLink?.focus();
    });
  }
};

const onEnterKey = () => {
  close();
  tappedCategoryId.value = null;
};

const navigateDropdownItems = (event: KeyboardEvent, direction: 'up' | 'down') => {
  event.preventDefault();
  const dropdown = megaMenuReference.value?.[0];
  if (!dropdown) return;

  const focusableItems = Array.from(dropdown.querySelectorAll('a')) as HTMLElement[];
  const currentIndex = focusableItems.indexOf(document.activeElement as HTMLElement);

  const downIndex = currentIndex < focusableItems.length - 1 ? currentIndex + 1 : 0;
  const upIndex = currentIndex > 0 ? currentIndex - 1 : focusableItems.length - 1;
  const nextIndex = direction === 'down' ? downIndex : upIndex;

  focusableItems[nextIndex]?.focus();
};

const handleTabInDropdown = (event: KeyboardEvent) => {
  const dropdown = megaMenuReference.value?.[0];
  if (!dropdown) return;

  const focusableItems = Array.from(dropdown.querySelectorAll('a')) as HTMLElement[];
  const currentIndex = focusableItems.indexOf(document.activeElement as HTMLElement);

  event.preventDefault();

  const prevIndex = currentIndex > 0 ? currentIndex - 1 : focusableItems.length - 1;
  const nextFwdIndex = currentIndex < focusableItems.length - 1 ? currentIndex + 1 : 0;
  const nextIndex = event.shiftKey ? prevIndex : nextFwdIndex;

  focusableItems[nextIndex]?.focus();
};

const onNavBlur = (event: FocusEvent) => {
  if (!(event.currentTarget as Element).contains(event.relatedTarget as Element)) {
    close();
    tappedCategoryId.value = null;
  }
};

const onMouseLeave = () => {
  close();
  tappedCategoryId.value = null;
};

const onCategoryMouseEnter = (menuNode: CategoryTreeItem) => {
  if (!viewport.isGreaterOrEquals('lg')) return;

  if (menuNode.childCount > 0) {
    activeNode.value = [menuNode.id];
    open();
    setCategory([menuNode]);
    return;
  }

  if (category.value !== null) category.value = null;
};

const onTouchStart = () => {
  isUsingTouch.value = true;
  lastTouchTime.value = Date.now();
};

const onMouseDown = () => {
  const timeDiff = Date.now() - lastTouchTime.value;
  if (timeDiff > TOUCH_DETECTION_THRESHOLD) {
    isUsingTouch.value = false;
  }
};

const handleFirstTouch = (menuNode: CategoryTreeItem) => {
  tappedCategoryId.value = menuNode.id;
  onCategoryMouseEnter(menuNode);
};

const onCategoryClickCapture = (event: MouseEvent, menuNode: CategoryTreeItem) => {
  if (isUsingTouch.value && menuNode.childCount > 0 && tappedCategoryId.value !== menuNode.id) {
    event.stopPropagation();
    event.preventDefault();
    handleFirstTouch(menuNode);
    return;
  }

  close();
  tappedCategoryId.value = null;
};

// the row only exists on large screens, so measuring and watching its width starts whenever it appears
let rowResizeObserver: ResizeObserver | undefined;
watch(rowListRef, (list) => {
  rowResizeObserver?.disconnect();
  if (!list || !import.meta.client) return;
  measureRow();
  if (!('ResizeObserver' in window)) return;
  rowResizeObserver = new ResizeObserver(() => updateRowWidth());
  rowResizeObserver.observe(list);
});
const updateRowWidth = () => {
  if (rowMeasured.value && rowListRef.value) rowWidth.value = rowListRef.value.clientWidth;
};
onMounted(() => {
  window.addEventListener('resize', updateRowWidth);
  removeHook = router.afterEach(() => {
    close();
    tappedCategoryId.value = null;
  });
});

onBeforeUnmount(() => {
  removeHook?.();
  rowResizeObserver?.disconnect();
  window.removeEventListener('resize', updateRowWidth);
});

watch(rowItems, () => {
  isMoreOpen.value = false;
  measureRow();
});

onNuxtReady(async () => {
  if (props.categories.length > 0) return;
  if (fetchedCategoryTree.value.length === 0) await getCategoryTree();
});

const resolvedCategories = computed(() => (props.categories.length > 0 ? props.categories : fetchedCategoryTree.value));

watch(
  resolvedCategories,
  (categories: CategoryTreeItem[]) => {
    categoryTree.value = categoryTreeGetters.getTree(categories);
    setCategory(categoryTree.value);
  },
  { immediate: true },
);

watch(isOpen, (isDrawerOpen) => {
  if (isDrawerOpen && !category.value && categoryTree.value.length > 0) {
    setCategory(categoryTree.value);
  }
});

useTrapFocus(drawerReference, trapFocusOptions);
</script>

<style scoped>
.nav-hover-bg:hover {
  background-color: var(--nav-hover-bg);
}
.nav-border {
  border-bottom-color: var(--nav-border-color, rgb(229, 231, 235));
}
</style>
