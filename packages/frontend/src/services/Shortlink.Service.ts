import type { NewShortlink, Shortlink } from 'src/schemas/Shortlink.Schemas';
import api from 'src/services/api';

class ShortlinkService {
  async create(newShortlink: NewShortlink): Promise<Shortlink> {
    const { data } = await api.post<Shortlink>('/api/links', newShortlink);
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
      }>('/api/links', {
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
    const { data } = await api.get<Shortlink>(`/api/links/${id}`);
    return data;
  }

  async update(shortLink: Shortlink): Promise<Shortlink> {
    const { data } = await api.put<Shortlink>(`/api/links`, shortLink);
    return data;
  }

  async delete(shortLink: Shortlink): Promise<void> {
    await api.delete(`/api/links`, {
      data: shortLink,
    });
  }

  async isShortCodeAvailable(shortCode: Shortlink['shortCode']) {
    const { data } = await api.get(`/api/links/code/${shortCode}`);
    return data;
  }
}

export default new ShortlinkService();
