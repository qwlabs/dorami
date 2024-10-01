export interface Loader {
  load: (file: string) => Promise<Record<string, string>>;
  supported: (file: string) => boolean;
}
