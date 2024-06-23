// export type TimekeeperVitePluginOptions {

// }

// export type GetRemoteEntryOptions {

// }

/**
* Options for getting the remote entry URL.
*/
export type GetRemoteEntryOptions = {
  /** The name of the remote module. */
  remoteName: string
  /** The version of the remote module. */
  version: string
  /** The API URL to fetch the version information. */
  apiUrl: string
  /** The base URL for the remote entry. */
  baseUrl: string
  /** The fallback URL to use in case of an error. */
  fallbackUrl: string
  /** The timeout duration in milliseconds. Optional, defaults to 3000. */
  timeout: number
}

/**
* Options for pushing the remote entry URL to api.
*/
export type PushRemoteEntryOptions = {
  /** The name of the remote module. */
  remoteName: string
  /** The version of the remote module. */
  version: string
  /** The API URL to push the version information. */
  apiUrl: string
  /** The base URL for the remote entry. */
  baseUrl: string
  /** The environment of current command. */
  environment: "development" | "production"
}