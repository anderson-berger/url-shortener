// packages/frontend/src/types/health.types.ts

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
