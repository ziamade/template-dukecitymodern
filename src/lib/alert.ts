export interface AlertData {
  enabled: boolean;
  text: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

/** Check if an alert should be visible based on enabled state and date window. */
export function isAlertVisible(alert: AlertData, now?: Date): boolean {
  if (!alert?.enabled || !alert?.text) return false;
  const today = (now ?? new Date()).toISOString().slice(0, 10);
  if (alert.startDate && today < alert.startDate) return false;
  if (alert.endDate && today > alert.endDate) return false;
  return true;
}
