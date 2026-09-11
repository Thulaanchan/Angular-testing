import { environment } from '../../../environments/environment';

export const API_CONFIG = {
  baseUrl: environment.apiUrl,
  useMockData: environment.useMockData ?? false,
  holdDurationMinutes: environment.holdDurationMinutes ?? 15,
  appName: environment.appName || 'BookWithUs'
};
