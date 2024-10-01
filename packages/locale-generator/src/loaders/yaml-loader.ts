import type { Loader } from '../loader.ts';

export class YamlLoader implements Loader {
  load(file: string): Promise<Record<string, string>> {
    // TODO
    return Promise.resolve({});
    //   parse(readFileSync(file, 'utf-8'))
    // return Promise.resolve(undefined);
  }

  supported(file: string): boolean {
    return file.endsWith('.yaml');
  }
}
