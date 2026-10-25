<template>
  <div class="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4" data-testid="back-in-stock">
    <p v-if="sent" class="typography-text-sm font-medium text-positive-700">
      Danke! Wir schreiben dir an {{ email }}, sobald Größe {{ sizeName }} wieder da ist.
    </p>
    <form v-else novalidate @submit.prevent="submit">
      <p class="typography-text-sm font-semibold">Größe {{ sizeName }} ist gerade ausverkauft</p>
      <p class="mt-1 typography-text-sm text-neutral-600">
        Wir benachrichtigen dich per E-Mail, sobald sie wieder verfügbar ist.
      </p>
      <div class="mt-3 flex flex-col gap-2 @sm:flex-row">
        <SfInput
          v-model="email"
          type="email"
          autocomplete="email"
          placeholder="Deine E-Mail-Adresse"
          aria-label="Deine E-Mail-Adresse"
          wrapper-class="flex-1"
          :invalid="emailInvalid"
          required
        />
        <UiButton type="submit" :disabled="loading || !canSubmit" data-testid="back-in-stock-submit">
          Benachrichtigen
        </UiButton>
      </div>
      <label class="mt-3 flex items-start gap-2 typography-text-xs text-neutral-600">
        <SfCheckbox v-model="privacyAccepted" class="mt-0.5" />
        <span>
          Ich bin einverstanden, dass meine E-Mail-Adresse nur für diese Benachrichtigung genutzt wird. Mehr in der
          <NuxtLink :to="localePath(paths.privacyPolicy)" class="underline" target="_blank">Datenschutzerklärung</NuxtLink>.
        </span>
      </label>
      <NuxtTurnstile
        v-if="turnstileSiteKey"
        ref="turnstileElement"
        v-model="turnstile"
        :site-key="turnstileSiteKey"
        :options="{ theme: 'light' }"
        class="mt-3"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { SfCheckbox, SfInput } from '@storefront-ui/vue';
import type { CustomerContactEmailParams } from '@plentymarkets/shop-api';
import type { ArizonaBackInStockProps } from './types';

/**
 * Arizona: "notify me when available again" for a sold-out size. The request reaches customer service through
 * the shop's contact mail (subject "Wieder verfügbar: …") together with item, size and variation ID.
 */
const props = defineProps<ArizonaBackInStockProps>();

const localePath = useLocalizedPath();
const { loading, doCustomerContactMail } = useCustomerContact();
const { getSetting } = useSiteSettings('cloudflareTurnstileApiSiteKey');
const turnstileSiteKey = getSetting() ?? '';

const email = ref('');
const privacyAccepted = ref(false);
const turnstile = ref('');
const turnstileElement = ref();
const sent = ref(false);

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
const emailInvalid = computed(() => email.value.length > 0 && !emailValid.value);
const canSubmit = computed(
  () => emailValid.value && privacyAccepted.value && (!turnstileSiteKey || Boolean(turnstile.value)),
);

const submit = async () => {
  if (!canSubmit.value) return;
  const params: CustomerContactEmailParams = {
    subject: `Wieder verfügbar: ${props.productName} – Größe ${props.sizeName}`,
    email: email.value.trim(),
    message: [
      'Bitte benachrichtigen, sobald dieser Artikel wieder verfügbar ist.',
      `Artikel: ${props.productName}`,
      `Größe: ${props.sizeName}`,
      props.variantName ? `Variante: ${props.variantName}` : '',
      `Artikel-ID: ${props.itemId}`,
      props.variationId ? `Varianten-ID: ${props.variationId}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
  };
  if (turnstile.value) params['cf-turnstile-response'] = turnstile.value;

  sent.value = await doCustomerContactMail(params);
  turnstile.value = '';
  turnstileElement.value?.reset();
};
</script>
