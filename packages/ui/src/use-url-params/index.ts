import { createSharedComposable, useUrlSearchParams } from '@vueuse/core';
import { get } from 'es-toolkit/compat';
import { ref, type Ref } from 'vue';

const useUrlParams = createSharedComposable(() => {
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

// export const useTypedUrlParam = <T = any>(name: string, defaultValue: T | undefined): Ref<T | undefined> => {
//   const value: Ref<T> = ref(defaultValue);
//   return value;
// };

export const useTypedUrlParam = <T = any>(name: string, defaultValue: T | undefined): Ref<T> => {
  const a: string ="1";
  const value = ref<T>(a);
  return value;
};

// export const useUrlStringParam = <T = string>(name: string, defaultValue: T | undefined): Ref<T | undefined> => {
//   const { urlParams } = useUrlParams();
//
//   // watchWithFilter(
//   //   urlParams,
//   //   () => { console.log('changed!') }, // callback will be called in 500ms debounced manner
//   //   {
//   //     eventFilter: debounceFilter(500), // throttledFilter, pausableFilter or custom filters
//   //   },
//   // )
//
//   const value = ref(defaultValue);
// };

// export const useUrlStringParam = computedWithControl(
//   () => source.value, // watch source, same as `watch`
//   () => counter.value, // computed getter, same as `computed`
// )

// export const useUrlParam = <T = string>(name: string, defaultValue: T): Ref<T> => {
//   const { fromUrl } = useUrlParams();
//   const value = ref<boolean>(fromUrlBoolean(name, defaultValue));
//   watchChanged(value, name, onChanged);
//   return value;
// };
