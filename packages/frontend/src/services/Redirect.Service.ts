// src/services/Redirect.Service.ts
import api from './api';
import type { ShortLink } from 'src/schemas/ShortLink.Schemas';

class RedirectService {
  async redirect(shortCode: ShortLink['shortCode']) {
    const { data } = await api.get<string>(`/go/${shortCode}`, {
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
