import { readFileSync } from 'node:fs';
import { getProperties } from 'properties-file';
import type { Loader } from '../loader.ts';

export class PropertiesLoader implements Loader {
  async load(file: string): Promise<Record<string, string>> {
    return getProperties(readFileSync(file, { encoding: 'utf-8' })) as unknown as Record<string, string>;
  }

  supported(file: string): boolean {
    return file.endsWith('.properties');
  }
}
