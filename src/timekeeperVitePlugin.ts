import { Plugin } from 'vite'
import { GetRemoteEntryOptions, PushRemoteEntryOptions } from './types/options'
import { getRemoteEntryVite, pushRemoteEntryVite } from './utils'

interface ExtendedPlugin extends Plugin {
  getRemoteEntry(options: GetRemoteEntryOptions): Promise<string>
}

export const timekeeperVitePlugin = (options?: PushRemoteEntryOptions): ExtendedPlugin => {
  const plugin: ExtendedPlugin = {
    name: 'TimekeeperWebpackPlugin',
    getRemoteEntry: getRemoteEntryVite
  };

  if (options != null) {
    pushRemoteEntryVite(options)
  }

  return plugin
}
