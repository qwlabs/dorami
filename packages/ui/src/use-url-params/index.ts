import type { Ref } from 'vue';
import { createSharedComposable, tryOnBeforeMount, useUrlSearchParams, watchDebounced } from '@vueuse/core';
import { get } from 'es-toolkit/compat';
import { shallowRef } from 'vue';

const useAllUrlSearchParams = createSharedComposable(() => {
  const urlParams = useUrlSearchParams<Record<string, any>>('history', {
    initialValue: {},
    removeNullishValues: true,
    removeFalsyValues: true,
  });
  const fromUrl = <T = any>(name: string, defaultValue?: T | undefined): T | undefined => {
    return get(urlParams, name, defaultValue);
  };
  const effectToUrl = <T = any>(name: string, value: T | undefined): void => {
    urlParams[name] = value;
  };
  return {
    urlParams,
    fromUrl,
    effectToUrl,
  };
});

export const useUrlParam = <T = any>(name: string, defaultValue?: T): Ref<T> => {
  const { fromUrl, effectToUrl } = useAllUrlSearchParams();
  const value: Ref<T> = shallowRef<T>(fromUrl(name, defaultValue));
  tryOnBeforeMount(() => {
    effectToUrl(name, value.value);
  });
  watchDebounced(
    () => value,
    (newValue, oldValue) => {
      effectToUrl(name, value.value);
    },
    {
      debounce: 500,
      maxWait: 1000,
      rejectOnCancel: true,
    }
  );
  return value;
};
