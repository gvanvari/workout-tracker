import * as API from './api';

export async function handleExport(token: string) {
  try {
    const blob = await API.exportData(token);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  } catch (error: any) {
    console.error('Export failed:', error);
  }
}
