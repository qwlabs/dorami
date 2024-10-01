import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { glob } from 'glob';
import { assign } from 'lodash-es';
import { lookupLoader } from './loaders';

export interface BuildLocaleEntry {
  locale: string;
  includes: string[];
}

interface BuildLocaleMessages {
  locale: string;
  messages: Record<string, string>;
}

const loadFile = (file: string): Promise<Record<string, string>> => {
  const loader = lookupLoader(file);
  if (!loader) {
    return Promise.resolve({});
  }
  return loader.load(file);
};

const loadLocale = async (entry: BuildLocaleEntry): Promise<BuildLocaleMessages> => {
  const files = await glob(entry.includes);
  const allMessages: Record<string, string> = await Promise.all(files.map(loadFile)).then((values) => {
    return assign({}, ...values);
  });
  return {
    locale: entry.locale,
    messages: allMessages,
  };
};

const loadLocales = (entries: BuildLocaleEntry[]): Promise<Record<string, Record<string, string>>> => {
  return new Promise((resolve) => {
    const promises = entries.map(loadLocale);
    Promise.all(promises).then((localeMessages) => {
      const result: Record<string, Record<string, string>> = {};
      localeMessages.forEach((localeMessage) => {
        result[localeMessage.locale] = localeMessage.messages;
      });
      resolve(result);
    });
  });
};

export const generateLocale = async (outputDir: string, entries: BuildLocaleEntry[]) => {
  const loadedLocales = await loadLocales(entries);
  for (const locale in loadedLocales) {
    const messages = loadedLocales[locale];
    const filePath = join(outputDir, `${locale}.json`);
    writeFileSync(filePath, JSON.stringify(messages), { encoding: 'utf-8' });
  }
};
