import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import { getRemoteEntryWebpack, pushRemoteEntryWebpack, getRemoteEntryVite, pushRemoteEntryVite } from './utils';
import { GetRemoteEntryOptions, PushRemoteEntryOptions } from './types/options';

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

describe('Utility Functions', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe('getRemoteEntryWebpack', () => {
    it('should return the correct remote entry URL', async () => {
      const options: GetRemoteEntryOptions = {
        remoteName: 'testRemote',
        version: '1.0.0',
        apiUrl: 'https://api.example.com',
        baseUrl: 'https://cdn.example.com',
        fallbackUrl: 'https://fallback.example.com',
        timeout: 3000
      };

      fetchMock.mockResponseOnce(JSON.stringify({ version: '1.0.0' }));
      fetchMock.mockResponseOnce('var testRemote;');

      const result = await getRemoteEntryWebpack(options);
      expect(result).toBe('testRemote@https://cdn.example.com/1.0.0.remoteEntry.js');
    });

    it('should return the fallback URL on slow api fetch', async () => {
      const options: GetRemoteEntryOptions = {
        remoteName: 'testRemote',
        version: '1.0.0',
        apiUrl: 'https://api.example.com',
        baseUrl: 'https://cdn.example.com',
        fallbackUrl: 'https://fallback.example.com',
        timeout: 3000
      };

      // Simulate a slow response for the first fetch
      fetchMock.mockResponseOnce(() => new Promise(resolve => setTimeout(() => resolve(JSON.stringify({ version: '1.0.0' })), 10000)));

      const result = await getRemoteEntryWebpack(options);
      expect(result).toContain('testRemote@https://fallback.example.com?t=');
    });

    it('should return the fallback URL on error', async () => {
      const options: GetRemoteEntryOptions = {
        remoteName: 'testRemote',
        version: '1.0.0',
        apiUrl: 'https://api.example.com',
        baseUrl: 'https://cdn.example.com',
        fallbackUrl: 'https://fallback.example.com',
        timeout: 3000
      };

      fetchMock.mockRejectOnce(new Error('Network error'));

      const result = await getRemoteEntryWebpack(options);
      expect(result).toContain('testRemote@https://fallback.example.com?t=');
    });
  });

  describe('pushRemoteEntryWebpack', () => {
    it('should push the remote entry successfully', async () => {
      const options: PushRemoteEntryOptions = {
        remoteName: 'testRemote',
        version: '1.0.0',
        apiUrl: 'https://api.example.com',
        baseUrl: 'https://cdn.example.com',
        environment: 'production'
      };

      fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

      await pushRemoteEntryWebpack(options);
      expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/push-remote', expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          baseUrl: 'https://cdn.example.com',
          remoteName: 'testRemote',
          version: '1.0.0'
        })
      }));
    });

    it('should log an error when push fails', async () => {
      const options: PushRemoteEntryOptions = {
        remoteName: 'testRemote',
        version: '1.0.0',
        apiUrl: 'https://api.example.com',
        baseUrl: 'https://cdn.example.com',
        environment: 'production'
      };

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      fetchMock.mockRejectOnce(new Error('Network error'));

      await pushRemoteEntryWebpack(options);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error pushing remote entry:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });

    it('should not push in development environment', async () => {
      const options: PushRemoteEntryOptions = {
        remoteName: 'testRemote',
        version: '1.0.0',
        apiUrl: 'https://api.example.com',
        baseUrl: 'https://cdn.example.com',
        environment: 'development'
      };

      await pushRemoteEntryWebpack(options);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('getRemoteEntryVite', () => {
    it('should return the correct remote entry URL', async () => {
      const options: GetRemoteEntryOptions = {
        remoteName: 'testRemote',
        version: '1.0.0',
        apiUrl: 'https://api.example.com',
        baseUrl: 'https://cdn.example.com',
        fallbackUrl: 'https://fallback.example.com',
        timeout: 3000
      };

      fetchMock.mockResponseOnce(JSON.stringify({ version: '1.0.0' }));

      const result = await getRemoteEntryVite(options);
      expect(result).toBe('https://cdn.example.com1.0.0.remoteEntry.js');
    });

    it('should return the fallback URL on slow api fetch', async () => {
      const options: GetRemoteEntryOptions = {
        remoteName: 'testRemote',
        version: '1.0.0',
        apiUrl: 'https://api.example.com',
        baseUrl: 'https://cdn.example.com',
        fallbackUrl: 'https://fallback.example.com',
        timeout: 3000
      };

      // Simulate a slow response for the first fetch
      fetchMock.mockResponseOnce(() => new Promise(resolve => setTimeout(() => resolve(JSON.stringify({ version: '1.0.0' })), 10000)));

      const result = await getRemoteEntryVite(options);
      expect(result).toContain('https://fallback.example.com?t=');
    });

    it('should return the fallback URL on error', async () => {
      const options: GetRemoteEntryOptions = {
        remoteName: 'testRemote',
        version: '1.0.0',
        apiUrl: 'https://api.example.com',
        baseUrl: 'https://cdn.example.com',
        fallbackUrl: 'https://fallback.example.com',
        timeout: 3000
      };

      fetchMock.mockRejectOnce(new Error('Network error'));

      const result = await getRemoteEntryVite(options);
      expect(result).toContain('https://fallback.example.com?t=');
    });
  });

  describe('pushRemoteEntryVite', () => {
    it('should push the remote entry successfully', async () => {
      const options: PushRemoteEntryOptions = {
        remoteName: 'testRemote',
        version: '1.0.0',
        apiUrl: 'https://api.example.com',
        baseUrl: 'https://cdn.example.com',
        environment: 'production'
      };

      fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

      await pushRemoteEntryVite(options);
      expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/push-remote', expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          baseUrl: 'https://cdn.example.com',
          remoteName: 'testRemote',
          version: '1.0.0'
        })
      }));
    });

    it('should log an error when push fails', async () => {
      const options: PushRemoteEntryOptions = {
        remoteName: 'testRemote',
        version: '1.0.0',
        apiUrl: 'https://api.example.com',
        baseUrl: 'https://cdn.example.com',
        environment: 'production'
      };

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      fetchMock.mockRejectOnce(new Error('Network error'));

      await pushRemoteEntryVite(options);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error pushing remote entry:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });

    it('should not push in development environment', async () => {
      const options: PushRemoteEntryOptions = {
        remoteName: 'testRemote',
        version: '1.0.0',
        apiUrl: 'https://api.example.com',
        baseUrl: 'https://cdn.example.com',
        environment: 'development'
      };

      await pushRemoteEntryVite(options);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
