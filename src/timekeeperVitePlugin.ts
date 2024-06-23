import { Plugin } from 'vite';
import { GetRemoteEntryOptions, PushRemoteEntryOptions } from './types/options';
import { getRemoteEntryVite, pushRemoteEntryVite } from './utils';

interface ExtendedPlugin extends Plugin {
  getRemoteEntry(options: GetRemoteEntryOptions): Promise<string>;
  pushRemoteEntry(options: PushRemoteEntryOptions): void;
}

export const TimekeeperVitePlugin = (): ExtendedPlugin => {
  return {
    name: 'TimekeeperWebpackPlugin',
    getRemoteEntry: getRemoteEntryVite,
    pushRemoteEntry: pushRemoteEntryVite,
  }
}
