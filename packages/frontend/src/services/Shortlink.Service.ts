import axios from 'axios';
import type { NewShortlink, Shortlink } from 'src/schemas/Shortlink.Schemas';
import api from 'src/services/api';

class ShortlinkService {
  async create(newShortlink: NewShortlink): Promise<Shortlink> {
    const { data } = await api.post<Shortlink>('/links', newShortlink);
    return data;
  }

  async getAll(): Promise<Shortlink[]> {
    const allLinks: Shortlink[] = [];
    let nextToken: string | undefined;
    const maxIterations = 100;
    let iterations = 0;

    do {
      if (iterations++ >= maxIterations) {
        throw new Error('Máximo de iterações atingido ao buscar links');
      }

      const { data } = await api.get<{
        items: Shortlink[];
        nextToken?: string;
      }>('/links', {
        params: {
          limit: 100,
          nextToken,
        },
      });
      console.log('data', data);
      allLinks.push(...data.items);
      nextToken = data.nextToken;
    } while (nextToken);

    return allLinks;
  }

  async getById(id: string): Promise<Shortlink> {
    const { data } = await api.get<Shortlink>(`/links/${id}`);
    return data;
  }

  async update(shortLink: Shortlink): Promise<Shortlink> {
    const { data } = await api.put<Shortlink>(`/links`, shortLink);
    return data;
  }

  async delete(shortLink: Shortlink): Promise<void> {
    await api.delete(`/links`, {
      data: shortLink,
    });
  }

  async getByShortcode(shortCode: string): Promise<Shortlink | undefined> {
    try {
      const { data } = await api.get<Shortlink>(`/links/code/${shortCode}`);
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          return undefined;
        }
        throw new Error(`Falha ao verificar shortcode: ${err.message}`);
      }

      throw err;
    }
  }
}

export default new ShortlinkService();
