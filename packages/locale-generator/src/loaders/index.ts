import type { Loader } from '../loader.ts';
import { YamlLoader } from './yaml-loader.ts';
import { PropertiesLoader } from './properties-loader.ts';

const LOADERS: Loader[] = [new YamlLoader(), new PropertiesLoader()];

export const lookupLoader = (file: string): Loader | undefined => {
  return LOADERS.find((loader) => loader.supported(file));
};
