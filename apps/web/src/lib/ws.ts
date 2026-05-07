import type { WSEvent } from "../types/ws";

type Handler<T> = (data: T) => void;

class AlphaDockWS {
  private handlers = new Map<string, Set<Handler<unknown>>>();

  on<T>(event: WSEvent["event"], handler: Handler<T>) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)?.add(handler as Handler<unknown>);
    return () => this.handlers.get(event)?.delete(handler as Handler<unknown>);
  }

  emit<T>(event: WSEvent["event"], data: T) {
    this.handlers.get(event)?.forEach((handler) => handler(data));
  }

  disconnect() {
    this.handlers.clear();
  }
}

export const wsClient = new AlphaDockWS();

export function connectJobSocket(jobId: string) {
  return {
    jobId,
    close() {
      return undefined;
    },
  };
}
