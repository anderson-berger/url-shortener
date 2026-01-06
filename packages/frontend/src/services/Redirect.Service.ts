// src/services/Redirect.Service.ts
import api from './api';
import type { Shortlink } from 'src/schemas/Shortlink.Schemas';

class RedirectService {
  async redirect(shortCode: Shortlink['shortCode']) {
    const { data } = await api.get<string>(`/${shortCode}`, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
      params: {
        t: Date.now(),
      },
    });

    return data;
  }
}

export default new RedirectService();
