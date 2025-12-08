import type { NewShortLink, ShortLink } from 'src/schemas/ShortLink.Schemas';
import api from 'src/services/api';

class ShortLinkService {
  async create(newShortLink: NewShortLink): Promise<ShortLink> {
    const { data } = await api.post<ShortLink>('/api/links', newShortLink);
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

  async getById(id: string): Promise<ShortLink> {
    const { data } = await api.get<ShortLink>(`/api/links/${id}`);
    return data;
  }

  async update(shortLink: ShortLink): Promise<ShortLink> {
    const { data } = await api.put<ShortLink>(`/api/links`, shortLink);
    return data;
  }

  async delete(shortLink: ShortLink): Promise<void> {
    await api.delete(`/api/links`, {
      data: shortLink,
    });
  }
}

export default new ShortLinkService();
