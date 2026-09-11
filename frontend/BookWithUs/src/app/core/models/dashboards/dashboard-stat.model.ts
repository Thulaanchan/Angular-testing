export interface DashboardStat {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
  };
}
