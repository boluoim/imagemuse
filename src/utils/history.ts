import { LocalStorage } from "@raycast/api";

export interface UploadRecord {
  fileName: string;
  url: string;
  timestamp: number;
  fileSize?: number;
}

const HISTORY_KEY = "upload_history";
const MAX_HISTORY_ITEMS = 100;
const STORAGE_KEY = "upload_records";

export async function saveUploadHistory(record: UploadRecord) {
  const history = await getUploadHistory();
  history.unshift(record);
  
  // limit history items
  if (history.length > MAX_HISTORY_ITEMS) {
    history.pop();
  }
  
  await LocalStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export async function getUploadHistory(): Promise<UploadRecord[]> {
  const data = await LocalStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data as string) : [];
}

export async function clearUploadHistory() {
  await LocalStorage.removeItem(HISTORY_KEY);
}

export async function saveToLocalStorage(records: UploadRecord[]) {
  await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export async function getFromLocalStorage(): Promise<UploadRecord[]> {
  const data = await LocalStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data as string) : [];
}

export async function addRecord(record: UploadRecord) {
  const records = await getFromLocalStorage();
  records.unshift(record); // 添加到开头
  await saveToLocalStorage(records);
} 