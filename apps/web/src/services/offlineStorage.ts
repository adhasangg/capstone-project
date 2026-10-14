import type { Dass21Result, VakModality, VakResult } from '@safespace/shared';
import { calculateDass21Score, calculateVakScore } from '@safespace/shared';
import { api } from './api';

export interface CachedAssessment<T> {
  id: string;
  type: 'dass21' | 'vak';
  result: T;
  answers: number[] | VakModality[];
  timestamp: number;
  is_synced: boolean;
}

const STORAGE_KEYS = {
  DASS21_LATEST: 'safespace_dass21_latest',
  VAK_LATEST: 'safespace_vak_latest',
  OFFLINE_QUEUE: 'safespace_offline_queue',
};

export const offlineStorage = {
  /**
   * Calculates DASS-21 locally and stores it into localStorage with offline metadata
   */
  processDass21Offline(answers: number[]): Dass21Result {
    const result = calculateDass21Score(answers);
    const cached: CachedAssessment<Dass21Result> = {
      id: `dass21_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type: 'dass21',
      result,
      answers,
      timestamp: Date.now(),
      is_synced: false,
    };

    try {
      localStorage.setItem(STORAGE_KEYS.DASS21_LATEST, JSON.stringify(cached));
      this.enqueuePending(cached);
    } catch (e) {
      console.warn('Gagal menyimpan hasil DASS-21 ke localStorage:', e);
    }

    return result;
  },

  /**
   * Saves online DASS-21 result into localStorage as synced
   */
  saveDass21Online(answers: number[], result: Dass21Result): void {
    const cached: CachedAssessment<Dass21Result> = {
      id: `dass21_${Date.now()}`,
      type: 'dass21',
      result,
      answers,
      timestamp: Date.now(),
      is_synced: true,
    };
    try {
      localStorage.setItem(STORAGE_KEYS.DASS21_LATEST, JSON.stringify(cached));
    } catch (e) {
      console.warn('Gagal menyimpan cache DASS-21:', e);
    }
  },

  /**
   * Gets latest cached DASS-21 result
   */
  getLatestDass21(): CachedAssessment<Dass21Result> | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DASS21_LATEST);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Calculates VAK locally and stores it into localStorage with offline metadata
   */
  processVakOffline(answers: VakModality[]): VakResult {
    const result = calculateVakScore(answers);
    const cached: CachedAssessment<VakResult> = {
      id: `vak_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type: 'vak',
      result,
      answers,
      timestamp: Date.now(),
      is_synced: false,
    };

    try {
      localStorage.setItem(STORAGE_KEYS.VAK_LATEST, JSON.stringify(cached));
      this.enqueuePending(cached);
    } catch (e) {
      console.warn('Gagal menyimpan hasil VAK ke localStorage:', e);
    }

    return result;
  },

  /**
   * Saves online VAK result into localStorage as synced
   */
  saveVakOnline(answers: VakModality[], result: VakResult): void {
    const cached: CachedAssessment<VakResult> = {
      id: `vak_${Date.now()}`,
      type: 'vak',
      result,
      answers,
      timestamp: Date.now(),
      is_synced: true,
    };
    try {
      localStorage.setItem(STORAGE_KEYS.VAK_LATEST, JSON.stringify(cached));
    } catch (e) {
      console.warn('Gagal menyimpan cache VAK:', e);
    }
  },

  /**
   * Gets latest cached VAK result
   */
  getLatestVak(): CachedAssessment<VakResult> | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.VAK_LATEST);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Enqueues pending assessment item
   */
  enqueuePending(item: CachedAssessment<unknown>): void {
    try {
      const queue = this.getOfflineQueue();
      queue.push(item);
      localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
    } catch (e) {
      console.warn('Gagal menambahkan ke antrean offline:', e);
    }
  },

  /**
   * Gets offline queue
   */
  getOfflineQueue(): CachedAssessment<unknown>[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  /**
   * Synchronizes all offline assessments with backend if online and token available
   */
  async syncPendingQueue(token?: string): Promise<{ synced: number; remaining: number }> {
    if (!navigator.onLine) {
      return { synced: 0, remaining: this.getOfflineQueue().length };
    }

    const queue = this.getOfflineQueue();
    if (queue.length === 0) {
      return { synced: 0, remaining: 0 };
    }

    let syncedCount = 0;
    const remainingQueue: CachedAssessment<unknown>[] = [];

    for (const item of queue) {
      try {
        if (item.type === 'dass21') {
          await api.submitDass21(item.answers as number[], token);
        } else if (item.type === 'vak') {
          await api.submitVak(item.answers as VakModality[], token);
        }
        syncedCount++;
      } catch (err) {
        console.warn(`Gagal menyinkronkan item ${item.id}:`, err);
        remainingQueue.push(item);
      }
    }

    try {
      localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(remainingQueue));
      // Update latest flags if everything synced
      if (remainingQueue.length === 0) {
        const d = this.getLatestDass21();
        if (d) {
          d.is_synced = true;
          localStorage.setItem(STORAGE_KEYS.DASS21_LATEST, JSON.stringify(d));
        }
        const v = this.getLatestVak();
        if (v) {
          v.is_synced = true;
          localStorage.setItem(STORAGE_KEYS.VAK_LATEST, JSON.stringify(v));
        }
      }
    } catch (e) {
      console.warn('Gagal memperbarui status sinkronisasi:', e);
    }

    return { synced: syncedCount, remaining: remainingQueue.length };
  },
};
