// src/services/Redirect.Service.ts
import type { Shortlink } from 'src/schemas/Shortlink.Schemas';

class RedirectService {
  redirect(shortCode: Shortlink['shortCode']) {
    window.location.href = `/api/${shortCode}`;
  }
}

export default new RedirectService();
