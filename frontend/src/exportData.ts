import * as API from './api';

export async function handleExport(token: string): Promise<void> {
  try {
    const blob = await API.exportData(token);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  } catch (error: unknown) {
    console.error('Export failed:', error);
  }
}
