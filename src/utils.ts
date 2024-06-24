import { GetRemoteEntryOptions, PushRemoteEntryOptions } from "./types/options";

export const getRemoteEntryVite = async (options: GetRemoteEntryOptions): Promise<string> => {
  const { remoteName, version, apiUrl, baseUrl, fallbackUrl, timeout = 3000 } = options

  try {
    const result = await Promise.race([
      fetch(`${apiUrl}/get-remote?remoteName=${remoteName}&version=${version}`)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok.');
          return response.json();
        })
        .then(data => `${baseUrl}${data.version}.remoteEntry.js`),
      new Promise<string>((resolve) =>
        setTimeout(() => resolve(`${fallbackUrl}?t=${new Date().getTime()}`), timeout)
      )
    ]);

    return result;
  } catch (error) {
    return `${fallbackUrl}?t=${new Date().getTime()}`;
  }
}

export const pushRemoteEntryVite = async (options: PushRemoteEntryOptions): Promise<void> => {
  const { remoteName, version, apiUrl, baseUrl, environment } = options

  // If development mode is enabled, do not push
  if (environment === 'development') return

  try {
    const response = await fetch(`${apiUrl}/push-remote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        baseUrl,
        remoteName,
        version
      })
    });

    if (!response.ok) {
      throw new Error('Failed to push remote entry');
    }

    console.log('Remote entry pushed successfully');
  } catch (error) {
    console.error('Error pushing remote entry:', error);
  }
}

export const getRemoteEntryWebpack = async (options: GetRemoteEntryOptions): Promise<string> => {
  const { remoteName, version, apiUrl, baseUrl, fallbackUrl, timeout = 3000 } = options;

  try {
    const result = await Promise.race([
      fetch(`${apiUrl}/get-remote?remoteName=${remoteName}&version=${version}`)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok.');
          return response.json();
        })
        .then(async data => {
          const version = data.version;
          const fileName = `${baseUrl}${version}.remoteEntry.js`;

          const fileResponse = await fetch(fileName);
          if (!fileResponse.ok) throw new Error('Failed to fetch remote entry file.');

          const fileContent = await fileResponse.text();

          const variableNameMatch = fileContent.match(/var\s+(\w+)\s*;/);
          if (variableNameMatch) {
            const variableName = variableNameMatch[1];
            return `${variableName}@${baseUrl}${version}.remoteEntry.js`;
          } else {
            return `${remoteName}@${baseUrl}${version}.remoteEntry.js`;
          }
        }),
      new Promise<string>((resolve) =>
        setTimeout(() => resolve(`${remoteName}@${fallbackUrl}?t=${new Date().getTime()}`), timeout)
      )
    ]);

    return result;
  } catch (error) {
    console.error('Error in getRemoteEntry:', error);
    return `${remoteName}@${fallbackUrl}?t=${new Date().getTime()}`;
  }
}

export const pushRemoteEntryWebpack = async (options: PushRemoteEntryOptions): Promise<void> => {
  const { remoteName, version, apiUrl, baseUrl, environment } = options;

  // If development mode is enabled, do not push
  if (environment === 'development') return;

  try {
    const response = await fetch(`${apiUrl}/push-remote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        baseUrl,
        remoteName,
        version
      })
    });

    if (!response.ok) {
      throw new Error('Failed to push remote entry');
    }

    console.log('Remote entry pushed successfully');
  } catch (error) {
    console.error('Error pushing remote entry:', error);
  }
}