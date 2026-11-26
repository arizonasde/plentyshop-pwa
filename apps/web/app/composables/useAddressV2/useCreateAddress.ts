import type { ApiError, AddressType, Address } from '@plentymarkets/shop-api';

export const useCreateAddress = (type: AddressType) => {
  const state = useState('useCreateAddress' + type, () => ({
    loading: false,
    invalidVAT: false,
    vatServerError: false,
    vatServerErrors: ['address.vatServerBusy', 'address.vatServerFallback'],
  }));

  const create = async (address: Address, retried = false): Promise<boolean> => {
    try {
      state.value.loading = true;
      state.value.invalidVAT = false;
      const data = await useSdk().plentysystems.doSaveAddress({ typeId: type, addressData: address });
      useAddressStore(type).set(data.data ?? []);
      state.value.loading = false;
      return Promise.resolve(true);
    } catch (error: unknown) {
      // Arizona: an expired guest session answers "login.loginFailed" – sign in as guest again with the known
      // e-mail address and try once more, instead of showing "Zugangsdaten ungültig" to the customer
      if (!retried && errorHasKeyValue(error, 'key', 'login.loginFailed')) {
        const { user, isAuthorized, loginAsGuest } = useCustomer();
        const guestMail = user.value?.guestMail;
        if (guestMail && !isAuthorized.value) {
          await loginAsGuest(guestMail);
          await useFetchSession().fetchSession();
          return create(address, true);
        }
      }
      state.value.invalidVAT = errorHasKeyValue(error, 'key', 'address.vatInvalid');
      if (!state.value.invalidVAT) {
        state.value.vatServerError = errorHasKeyAnyValue(error, 'key', state.value.vatServerErrors);
        useHandleError(error as ApiError);
      }

      return Promise.reject();
    } finally {
      state.value.loading = false;
    }
  };

  const clearInvalidVAT = () => (state.value.invalidVAT = false);

  return {
    create,
    clearInvalidVAT,
    ...toRefs(state.value),
  };
};
