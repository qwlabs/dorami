import type { Loader } from '../loader.ts';
import { readFileSync } from 'node:fs';
import { getProperties } from 'properties-file';

export class PropertiesLoader implements Loader {
  async load(file: string): Promise<Record<string, string>> {
    return getProperties(readFileSync(file, { encoding: 'utf-8' })) as unknown as Record<string, string>;
  }

  supported(file: string): boolean {
    return file.endsWith('.properties');
  }
}
