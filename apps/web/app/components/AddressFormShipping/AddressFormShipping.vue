<template>
  <form
    ref="formRef"
    novalidate
    class="grid grid-cols-1 @md:grid-cols-[50%_1fr_120px] gap-4"
    data-testid="shipping-address-form"
    @submit.prevent="validateAndSubmitForm"
    @focusout="autoSaveOnLeave"
  >
    <label>
      <UiFormLabel class="flex">
        <span class="mr-1">
          {{ firstNameLabelText }}
        </span>
        <UiFormHelperText v-if="firstNameHelperText">({{ firstNameHelperText }})</UiFormHelperText>
      </UiFormLabel>
      <SfInput
        v-model="firstName"
        name="firstName"
        autocomplete="given-name"
        v-bind="firstNameAttributes"
        :invalid="!!errors['firstName']"
      />
      <ErrorMessage as="span" name="firstName" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label class="@md:col-span-2">
      <UiFormLabel class="flex">
        <span class="mr-1">
          {{ lastNameLabel }}
        </span>
        <UiFormHelperText v-if="lastNameHelperText">({{ lastNameHelperText }})</UiFormHelperText>
      </UiFormLabel>
      <SfInput
        v-model="lastName"
        name="lastName"
        autocomplete="family-name"
        v-bind="lastNameAttributes"
        :invalid="!!errors['lastName']"
      />
      <ErrorMessage as="span" name="lastName" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <div class="@md:col-span-3">
      <UiLink
        class="select-none hover:cursor-pointer"
        role="button"
        tabindex="0"
        :aria-pressed="hasShippingCompany"
        :aria-label="!hasShippingCompany ? t('form.addCompany') : t('form.removeCompany')"
        @click="hasShippingCompany = !hasShippingCompany"
        @keydown.enter.space="hasShippingCompany = !hasShippingCompany"
      >
        {{ !hasShippingCompany ? t('form.addCompany') : t('form.removeCompany') }}
      </UiLink>
    </div>

    <label v-if="hasShippingCompany" for="shippingCompanyName">
      <UiFormLabel for="shippingCompanyName">{{ t('form.companyLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        id="shippingCompanyName"
        v-model="companyName"
        name="companyName"
        autocomplete="organization"
        v-bind="companyNameAttributes"
        :invalid="!!errors['companyName']"
        :aria-invalid="!!errors['companyName']"
      />
      <ErrorMessage as="span" name="companyName" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label v-if="hasShippingCompany" class="@md:col-span-2" for="shippingVatNumber">
      <UiFormLabel class="flex">
        <span class="mr-1">
          {{ t('form.vatIdLabel') }}
        </span>
        <UiFormHelperText>({{ t('form.optional') }})</UiFormHelperText>
      </UiFormLabel>
      <SfInput
        id="shippingVatNumber"
        v-model="vatNumber"
        name="vatNumber"
        autocomplete="vat-number"
        v-bind="vatNumberAttributes"
        :invalid="invalidVAT"
        :aria-invalid="invalidVAT"
        @input="clearInvalidVAT"
      />
      <span v-if="invalidVAT" class="flex text-negative-700 text-sm mt-2">
        {{ t('storefrontError.address.vatInvalid') }}
      </span>
    </label>

    <label class="@md:col-span-2">
      <UiFormLabel>{{ t('form.streetNameLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        v-model="streetName"
        name="streetName"
        autocomplete="address-line1"
        v-bind="streetNameAttributes"
        :invalid="!!errors['streetName']"
      />
      <ErrorMessage as="span" name="streetName" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label>
      <UiFormLabel>{{ t('form.streetNumberLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        v-model="apartment"
        name="streetNumber"
        autocomplete="address-line2"
        v-bind="apartmentAttributes"
        :invalid="!!errors['apartment']"
      />
      <ErrorMessage as="span" name="apartment" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label>
      <UiFormLabel>{{ t('form.postalCodeLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        v-model="zipCode"
        name="zipCode"
        autocomplete="postal-code"
        v-bind="zipCodeAttributes"
        :invalid="!!errors['zipCode']"
      />
      <ErrorMessage as="span" name="zipCode" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <label class="@md:col-span-2">
      <UiFormLabel>{{ t('form.cityLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfInput
        v-model="city"
        name="city"
        autocomplete="address-level2"
        list="shipping-city-options"
        v-bind="cityAttributes"
        :invalid="!!errors['city']"
        @input="cityAutofilled = false"
      />
      <datalist id="shipping-city-options">
        <option v-for="option in cityOptions" :key="option" :value="option" />
      </datalist>
      <ErrorMessage as="span" name="city" class="flex text-negative-700 text-sm mt-2" />
      <span v-if="cityAutofilled" class="flex text-neutral-500 text-xs mt-1" data-testid="city-autofilled">
        Ort aus der Postleitzahl ergänzt (Daten:&nbsp;
        <a href="https://www.geonames.org" target="_blank" rel="noopener" class="underline">GeoNames</a>)
      </span>
    </label>

    <label class="@md:col-span-3">
      <UiFormLabel>{{ t('form.countryLabel') }} {{ t('form.required') }}</UiFormLabel>
      <SfSelect
        v-model="country"
        name="country"
        v-bind="countryAttributes"
        :placeholder="t('form.selectPlaceholder')"
        :invalid="!!errors['country']"
        wrapper-class-name="bg-white"
        class="!ring-1 !ring-neutral-200"
        autocomplete="country-name"
      >
        <option
          v-for="(shippingCountry, index) in shippingCountries"
          :key="`shipping-country-${index}`"
          :value="shippingCountry.id.toString()"
        >
          {{ shippingCountry.currLangName }}
        </option>
      </SfSelect>
      <ErrorMessage as="span" name="country" class="flex text-negative-700 text-sm mt-2" />
    </label>

    <div
      v-if="!restrictedAddresses || showAddressSaveButton"
      class="@md:col-span-3 flex flex-col @sm:flex-row @sm:justify-between @sm:items-center"
    >
      <label v-if="!restrictedAddresses" class="flex items-center gap-2">
        <SfCheckbox v-model="shippingAsBilling" data-testid="use-shipping-as-billing" />
        <span class="cursor-pointer select-none">{{ t('form.useAsBillingLabel') }}</span>
      </label>

      <div v-if="showAddressSaveButton" :class="{ 'mt-3 @sm:mt-0': !restrictedAddresses }" class="flex items-center">
        <UiButton
          :data-testid="`save-address-${AddressType.Shipping}`"
          :disabled="formIsLoading"
          variant="secondary"
          type="submit"
        >
          {{ t('common.actions.saveAddress') }}
        </UiButton>

        <UiButton
          v-if="hasShippingAddress"
          :disabled="formIsLoading || disabled"
          variant="secondary"
          class="ml-2"
          :data-testid="`close-address-${AddressType.Shipping}`"
          :aria-label="t('common.navigation.closeAddressForm')"
          @click="edit"
        >
          <SfIconClose />
        </UiButton>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { type Address, AddressType, ApiError, cartGetters, userAddressGetters } from '@plentymarkets/shop-api';
import { SfCheckbox, SfIconClose, SfInput, SfSelect } from '@storefront-ui/vue';
import { ErrorMessage, useForm } from 'vee-validate';
import type { AddressFormShippingProps } from './types';
import { loadArizonaPostalCodeCities } from '~/utils/arizonaPostalCode';

const { disabled, address, addAddress = false } = defineProps<AddressFormShippingProps>();

const { isGuest, missingGuestCheckoutEmail, backToContactInformation } = useCustomer();
const { fetchSession } = useFetchSession();
const { default: shippingCountries } = useAggregatedCountries();
const { shippingAsBilling } = useShippingAsBilling();
const { handleCartTotalChanges } = useCartTotalChange();
const { addresses: shippingAddresses } = useAddressStore(AddressType.Shipping);
const { addresses: billingAddresses } = useAddressStore(AddressType.Billing);
const { set: setShippingAddress, hasCheckoutAddress: hasShippingAddress } = useCheckoutAddress(AddressType.Shipping);
const { set: setBillingAddress } = useCheckoutAddress(AddressType.Billing);
const { hasCheckoutAddress: hasBillingAddress } = useCheckoutAddress(AddressType.Billing);
const { addressToSave: billingAddressToSave, save: saveBillingAddress } = useAddressForm(AddressType.Billing);
const { restrictedAddresses } = useRestrictedAddress();
const { setShippingSkeleton, showBillingAddressSection } = useCheckout();
const {
  isLoading: formIsLoading,
  add: showNewForm,
  open: editing,
  addressToEdit,
  defaultFormValues,
  hasCompany: hasShippingCompany,
  addressToSave: shippingAddressToSave,
  save: saveShippingAddress,
  validationSchema: shippingSchema,
  refreshAddressDependencies,
} = useAddressForm(AddressType.Shipping);
const { invalidVAT, clearInvalidVAT, vatServerError } = useCreateAddress(AddressType.Shipping);
const { defineField, errors, setValues, validate, handleSubmit } = useForm({ validationSchema: shippingSchema });

const { labelText: firstNameLabelText, helperText: firstNameHelperText } = useFormLabel(
  t('form.firstNameLabel'),
  hasShippingCompany,
);
const { labelText: lastNameLabel, helperText: lastNameHelperText } = useFormLabel(
  t('form.lastNameLabel'),
  hasShippingCompany,
);

const [firstName, firstNameAttributes] = defineField('firstName');
const [lastName, lastNameAttributes] = defineField('lastName');
const [country, countryAttributes] = defineField('country');
const [streetName, streetNameAttributes] = defineField('streetName');
const [apartment, apartmentAttributes] = defineField('apartment');
const [city, cityAttributes] = defineField('city');
const [zipCode, zipCodeAttributes] = defineField('zipCode');
const [companyName, companyNameAttributes] = defineField('companyName');
const [vatNumber, vatNumberAttributes] = defineField('vatNumber');

const showAddressSaveButton = computed(() => editing.value || showNewForm.value);

if (!addAddress && address) {
  hasShippingCompany.value = shippingAddressToSave.value?.companyName
    ? true
    : !!userAddressGetters.getCompanyName(address as Address);

  const addressSource = invalidVAT.value || vatServerError.value ? shippingAddressToSave.value : address;

  setValues({
    ...address,
    firstName: addressSource?.firstName || '',
    lastName: addressSource?.lastName || '',
    country: addressSource?.country || '',
    streetName: addressSource?.streetName || '',
    apartment: addressSource?.apartment || '',
    city: addressSource?.city || '',
    zipCode: addressSource?.zipCode || '',
    companyName: addressSource.companyName || '',
    vatNumber: addressSource.vatNumber || '',
  } as unknown as Record<string, string>);

  if (!hasShippingCompany.value) {
    companyName.value = '';
    vatNumber.value = '';
  }
}

// Arizona: preselect the delivery country (cart country, otherwise Germany), so nobody has to pick it
if (!country.value) {
  const { data: cartData } = useCart();
  country.value = String(cartGetters.getShippingCountryId(cartData.value) || 1);
}

// Arizona: fill in the city from the postal code (own data files, see utils/arizonaPostalCode.ts)
const cityOptions = ref<string[]>([]);
const cityAutofilled = ref(false);
watch([zipCode, country], async ([zip, countryId]) => {
  const isoCode = shippingCountries.value?.find((entry) => String(entry.id) === String(countryId))?.isoCode2 ?? '';
  const cities = await loadArizonaPostalCodeCities(isoCode, String(zip ?? ''));
  if (zip !== zipCode.value || countryId !== country.value) return;
  cityOptions.value = cities;
  if (cities.length > 0 && (!String(city.value ?? '').trim() || cityAutofilled.value)) {
    city.value = cities[0];
    cityAutofilled.value = true;
  }
});

const setDefaultFormValues = () => {
  defaultFormValues.value = {
    firstName: firstName.value,
    lastName: lastName.value,
    country: country.value,
    streetName: streetName.value,
    apartment: apartment.value,
    city: city.value,
    zipCode: zipCode.value,
    companyName: companyName.value,
    vatNumber: vatNumber.value,
  };
};

const handleSaveShippingAsBilling = async (shippingAddressForm: Address) => {
  if (!restrictedAddresses.value && shippingAsBilling.value) {
    billingAddressToSave.value = isGuest.value
      ? (shippingAddresses.value[0] as Address)
      : (shippingAddressForm as Address);

    if (addAddress) billingAddressToSave.value.primary = true;
    if (!hasShippingCompany.value) {
      billingAddressToSave.value.companyName = '';
      billingAddressToSave.value.vatNumber = '';
    }

    await saveBillingAddress();
  }
};

const handleShippingPrimaryAddress = async () => {
  if (shippingAddresses.value.length > 0) {
    await setShippingAddress(
      addAddress || isGuest.value
        ? (shippingAddresses.value[0] as Address)
        : (userAddressGetters.getDefault(shippingAddresses.value) as Address),
      !addAddress,
    );

    usePrimaryAddress(AddressType.Shipping).primaryAddressId.value =
      shippingAddresses.value?.find((item) => item.primary === true)?.id || -1;
  }
};

const handleBillingPrimaryAddress = async () => {
  if (!restrictedAddresses.value && shippingAsBilling.value && billingAddresses.value.length > 0) {
    await setBillingAddress(
      addAddress || isGuest.value
        ? (billingAddresses.value[0] as Address)
        : (userAddressGetters.getDefault(billingAddresses.value) as Address),
      false,
    );

    usePrimaryAddress(AddressType.Billing).primaryAddressId.value =
      billingAddresses.value?.find((item) => item.primary === true)?.id || -1;
  }
};

const validateAndSubmitForm = async () => {
  const formData = await validate();

  if (formIsLoading.value) return;
  if (missingGuestCheckoutEmail.value) return backToContactInformation();

  if (formData.valid) {
    if (hasShippingCompany.value) setDefaultFormValues();

    // Arizona: the form only closes when the address was really saved, so a failed save can be retried
    let saved = false;
    try {
      setShippingSkeleton(true);
      await submitForm();
      saved = true;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === getErrorCode('1400')) {
          await fetchSession();
          await submitForm();
          saved = true;
        }
      } else if (error instanceof ApiError) {
        useHandleError(error);
      }
    } finally {
      setShippingSkeleton(false);
      formIsLoading.value = false;
    }

    if (saved && showNewForm.value && !invalidVAT.value && !vatServerError.value) showNewForm.value = false;
  }
};

// Arizona: save the address by itself once it is complete and the customer has left the form,
// the "save address" button stays as a fallback. Also retried when the guest e-mail is saved later.
const formRef = ref<HTMLFormElement>();
const autoSave = async () => {
  if (!showAddressSaveButton.value || formIsLoading.value || missingGuestCheckoutEmail.value) return;
  if (formRef.value?.contains(document.activeElement)) return;
  const required = hasShippingCompany.value
    ? [companyName, streetName, apartment, zipCode, city, country]
    : [firstName, lastName, streetName, apartment, zipCode, city, country];
  if (required.some((field) => !String(field.value ?? '').trim())) return;
  const { valid } = await validate({ mode: 'silent' });
  if (valid) await validateAndSubmitForm();
};
// focus has moved on only after the focusout event
const autoSaveOnLeave = () => setTimeout(autoSave, 0);
watch(missingGuestCheckoutEmail, (missing) => {
  if (!missing) autoSave();
});

const submitForm = handleSubmit((shippingAddressForm) => {
  shippingAddressToSave.value = shippingAddressForm as Address;

  if (addAddress) shippingAddressToSave.value.primary = true;
  if (!hasShippingCompany.value) {
    shippingAddressToSave.value.companyName = '';
    shippingAddressToSave.value.vatNumber = '';
  }
  return saveShippingAddress()
    .then(() => handleSaveShippingAsBilling(shippingAddressForm as Address))
    .then(() => handleShippingPrimaryAddress())
    .then(() => handleBillingPrimaryAddress())
    .then(() => refreshAddressDependencies())
    .then(() => handleCartTotalChanges());
});

const edit = (address: Address) => {
  if (disabled) return;
  addressToEdit.value = editing.value || showNewForm.value ? ({} as Address) : address;
  editing.value = !(editing.value || showNewForm.value);
  showNewForm.value = false;
};

watch(shippingAsBilling, () => {
  showBillingAddressSection.value = !shippingAsBilling.value || hasBillingAddress.value;
});
</script>
