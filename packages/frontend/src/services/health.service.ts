import { $healthCheckResponse, type HealthCheckResponse } from 'src/schemas/heartCheck.Schemas';
import api from './api';

class HealthService {
  async check(): Promise<HealthCheckResponse> {
    const response = await api.get<HealthCheckResponse>('/health');

    const validated = $healthCheckResponse.parse(response.data);

    return validated;
  }
}

export default new HealthService();
