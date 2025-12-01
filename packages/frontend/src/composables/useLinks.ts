import type { ShortLink, NewShortLink } from 'src/schemas/ShortLink.Schemas';
import { ref, readonly } from 'vue';
import shortLinkService from 'src/services/ShortLink.Service';
import { loadingManager } from 'src/plugins/loading';

const _links = ref<ShortLink[]>([]);

export function useLinks() {
  const links = readonly(_links);

  async function createShortLink(newShortLink: NewShortLink) {
    return loadingManager.execute('create-link', async () => {
      const link = await shortLinkService.create(newShortLink);
      _links.value.push(link);
      return link;
    });
  }

  async function fetchLinks() {
    return loadingManager.execute('fetch-links', async () => {
      const fetchedLinks = await shortLinkService.getAll();
      _links.value = fetchedLinks;
      return fetchedLinks;
    });
  }

  async function deleteLink(shortLink: ShortLink) {
    return loadingManager.execute(`delete-link-${shortLink.id}`, async () => {
      await shortLinkService.delete(shortLink);
      _links.value = _links.value.filter((link) => link.id !== shortLink.id);
    });
  }

  async function updateShortLink(shortLink: ShortLink) {
    return loadingManager.execute(`update-link`, async () => {
      const updated = await shortLinkService.update(shortLink);
      const index = _links.value.findIndex((link) => link.id === shortLink.id);
      if (index !== -1) {
        _links.value[index] = updated;
      }
      return updated;
    });
  }

  function clearLinks() {
    _links.value = [];
  }

  function getLinkById(linkId: string) {
    return _links.value.find((link) => link.id === linkId);
  }

  return {
    // Estado
    links,

    // Métodos
    createShortLink,
    fetchLinks,
    deleteLink,
    updateShortLink,
    clearLinks,
    getLinkById,
  };
}
