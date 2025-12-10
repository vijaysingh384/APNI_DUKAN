// Request cache with TTL (Time To Live)
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Active requests map to prevent duplicate requests
const activeRequests = new Map<string, Promise<any>>();

// Request queue to limit concurrent requests
const MAX_CONCURRENT_REQUESTS = 6;
let activeRequestCount = 0;
const requestQueue: Array<() => void> = [];

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Get from cache or return null
export function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > cached.ttl) {
    cache.delete(key);
    return null;
  }
  
  return cached.data as T;
}

// Set cache
export function setCache(key: string, data: any, ttl: number = 30000) {
  cache.set(key, { data, timestamp: Date.now(), ttl });
}

// Clear cache
export function clearCache(pattern?: string) {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
}

// Process request queue
function processQueue() {
  if (activeRequestCount >= MAX_CONCURRENT_REQUESTS || requestQueue.length === 0) {
    return;
  }

  const next = requestQueue.shift();
  if (next) {
    activeRequestCount++;
    next();
  }
}

// Queue a request
export function queueRequest<T>(requestFn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const execute = async () => {
      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        activeRequestCount--;
        processQueue();
      }
    };

    if (activeRequestCount < MAX_CONCURRENT_REQUESTS) {
      activeRequestCount++;
      execute();
    } else {
      requestQueue.push(execute);
    }
  });
}

// Create abortable request
export function createAbortableRequest<T>(
  requestFn: (signal: AbortSignal) => Promise<T>
): { promise: Promise<T>; abort: () => void } {
  const controller = new AbortController();
  
  const promise = queueRequest(() => requestFn(controller.signal));
  
  return {
    promise,
    abort: () => controller.abort(),
  };
}

// Deduplicate requests - if same request is already in flight, return that promise
export function deduplicateRequest<T>(
  key: string,
  requestFn: () => Promise<T>
): Promise<T> {
  // Check if request is already in flight
  if (activeRequests.has(key)) {
    return activeRequests.get(key)!;
  }

  // Create new request
  const promise = queueRequest(requestFn).finally(() => {
    activeRequests.delete(key);
  });

  activeRequests.set(key, promise);
  return promise;
}

