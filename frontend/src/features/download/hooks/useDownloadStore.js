import { useRef, useSyncExternalStore } from 'react';

// Lightweight in-memory store for the current download session
// (URL, metadata, selected format, job). No Redux needed for this scope.

class DownloadStore {
  constructor() {
    this.state = { url: '', jobId: null };
    this.listeners = new Set();
  }

  get() {
    return this.state;
  }

  setUrl(url) {
    this.state = { ...this.state, url };
    this.notify();
  }

  setJobId(jobId) {
    this.state = { ...this.state, jobId };
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((l) => l());
  }
}

// Singleton
export const downloadStore = new DownloadStore();

// Hook — wraps the store for React components
export function useDownloadStore() {
  const state = useSyncExternalStore(
    (cb) => downloadStore.subscribe(cb),
    () => downloadStore.get()
  );

  return {
    ...state,
    setUrl: (url) => downloadStore.setUrl(url),
    setJobId: (id) => downloadStore.setJobId(id),
  };
}
