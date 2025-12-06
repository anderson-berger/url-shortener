import { z } from 'zod';

export const $healthStatus = z.enum(['healthy', 'degraded', 'unhealthy']);

export const $healthCheckResponse = z.object({
  status: $healthStatus,
  service: z.string(),
  version: z.string(),
  timestamp: z.iso.datetime(),
});

export type HealthStatus = z.infer<typeof $healthStatus>;
export type HealthCheckResponse = z.infer<typeof $healthCheckResponse>;
