import { Compiler } from 'webpack';
import { GetRemoteEntryOptions, PushRemoteEntryOptions } from './types/options';
import { getRemoteEntryWebpack, pushRemoteEntryWebpack } from './utils';

class TimekeeperWebpackPlugin {
  private options: PushRemoteEntryOptions;

  constructor(options: PushRemoteEntryOptions) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tapPromise('TimekeeperWebpackPlugin', async (compilation) => {
      console.log('TimekeeperWebpackPlugin applied');
      await TimekeeperWebpackPlugin.pushRemoteEntry(this.options);
    });
  }

  static async getRemoteEntry(options: GetRemoteEntryOptions): Promise<string> {
    return getRemoteEntryWebpack(options);
  }

  static async pushRemoteEntry(options: PushRemoteEntryOptions): Promise<void> {
    return pushRemoteEntryWebpack(options);
  }
}

export default TimekeeperWebpackPlugin;