import { Compiler } from 'webpack';
import { GetRemoteEntryOptions, PushRemoteEntryOptions } from './types/options';
import { getRemoteEntryWebpack, pushRemoteEntryWebpack } from './utils';

class TimekeeperWebpackPlugin {
  constructor() { }

  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tapPromise('TimekeeperWebpackPlugin', async (compilation) => {
      console.log('TimekeeperWebpackPlugin applied');
    });
  }

  async getRemoteEntry(options: GetRemoteEntryOptions): Promise<string> {
    return getRemoteEntryWebpack(options);
  }

  async pushRemoteEntry(options: PushRemoteEntryOptions): Promise<void> {
    return pushRemoteEntryWebpack(options);
  }
}

export default TimekeeperWebpackPlugin;