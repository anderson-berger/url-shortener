import api from './api';

class HealthService {
  async check(): Promise<HealthCheckResponse> {
    const response = await api.get<HealthCheckResponse>('/health');
    return response.data;
  }
}

export default new HealthService();

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface CheckDetail {
  status: HealthStatus;
  latency?: number;
  error?: string;
  message?: string;
}

export interface HealthCheckResponse {
  status: HealthStatus;
  service: string;
  version: string;
  timestamp: string;
  checks: {
    dynamodb?: CheckDetail;
  };
}
