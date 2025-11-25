import type { NewShortLink, ShortLink } from 'src/schemas/ShortLink.Schemas';
import api from './api';

class ShortLinkService {
  async create(newShortLink: NewShortLink): Promise<ShortLink> {
    const { data } = await api.post<ShortLink>('/links', newShortLink);
    return data;
  }

  async getAll(): Promise<ShortLink[]> {
    const allLinks: ShortLink[] = [];
    let nextToken: string | undefined;
    const maxIterations = 100;
    let iterations = 0;

    do {
      if (iterations++ >= maxIterations) {
        throw new Error('Máximo de iterações atingido ao buscar links');
      }

      const { data } = await api.get<{
        items: ShortLink[];
        nextToken?: string;
      }>('/links', {
        params: {
          limit: 100,
          nextToken,
        },
      });

      allLinks.push(...data.items);
      nextToken = data.nextToken;
    } while (nextToken);

    return allLinks;
  }

  async getById(id: string): Promise<ShortLink> {
    const { data } = await api.get<ShortLink>(`/links/${id}`);
    return data;
  }

  async update(id: string, updates: Partial<ShortLink>): Promise<ShortLink> {
    const { data } = await api.put<ShortLink>(`/links/${id}`, updates);
    return data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/links/${id}`);
  }
}

export default new ShortLinkService();
