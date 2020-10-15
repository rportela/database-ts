import { DbKey } from "./DatabaseDefinition";

export enum DatabaseEvent {
  DB_RECORD_ADD = "DB_RECORD_ADD",
  DB_RECORD_PUT = "DB_RECORD_PUT",
  DB_RECORD_DEL = "DB_RECORD_DEL",
}

export interface DatabaseSaveInfo {
  db: string;
  collection: string;
  key: DbKey;
  record: any;
}

export interface DatabaseDeleteInfo {
  db: string;
  collection: string;
  key: DbKey;
}

export type DatabaseEventInfo = DatabaseSaveInfo | DatabaseDeleteInfo;

export interface DatabaseEventListener {
  (info: DatabaseEventInfo): void;
}

export class DatabaseListeners {
  private listeners: any = {};

  onError = (err: any): void => {
    console.error(err);
  };

  addListener(event: DatabaseEvent, listener: DatabaseEventListener) {
    let eventListeners: DatabaseEventListener[] = this.listeners[event];
    if (!eventListeners) {
      eventListeners = [listener];
      this.listeners[event] = eventListeners;
    } else {
      const idx = eventListeners.indexOf(listener);
      if (idx < 0) eventListeners.push(listener);
    }
  }

  removeListener(event: DatabaseEvent, listener: DatabaseEventListener) {
    const eventListeners: DatabaseEventListener[] = this.listeners[event];
    if (eventListeners) {
      const idx = eventListeners.indexOf(listener);
      if (idx >= 0) eventListeners.splice(idx, 1);
    }
  }

  notify(event: DatabaseEvent, info: DatabaseEventInfo) {
    const eventListeners: DatabaseEventListener[] = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach((el) => {
        try {
          el(info);
        } catch (err) {
          this.onError(err);
        }
      });
    }
  }
}
