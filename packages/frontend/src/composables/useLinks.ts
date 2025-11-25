import type { ShortLink, NewShortLink } from 'src/schemas/ShortLink.Schemas';
import { ref, readonly } from 'vue';
import shortLinkService from 'src/services/ShortLink.Service';
import { loadingManager } from 'src/boot/loading';

export function useLinks() {
  // Estado privado (interno)
  const _links = ref<ShortLink[]>([]);

  const links = readonly(_links);

  async function createLink(newShortLink: NewShortLink) {
    return loadingManager.execute('create-link', async () => {
      const link = await shortLinkService.create(newShortLink);
      _links.value.push(link);
      return link;
    });
  }

  async function fetchLinks() {
    return loadingManager.execute('list-link', async () => {
      const fetchedLinks = await shortLinkService.getAll();
      _links.value = fetchedLinks;
      return fetchedLinks;
    });
  }

  // async function deleteLink(linkId: string) {
  //   return loadingManager.execute('links.deleteLink', async () => {
  //     await shortLinkService.delete(linkId);
  //     _links.value = _links.value.filter(link => link.id !== linkId);
  //   });
  // }

  // async function updateLink(linkId: string, updates: Partial<ShortLink>) {
  //   return loadingManager.execute('links.updateLink', async () => {
  //     const updated = await shortLinkService.update(linkId, updates);
  //     const index = _links.value.findIndex(link => link.id === linkId);
  //     if (index !== -1) {
  //       _links.value[index] = updated;
  //     }
  //     return updated;
  //   });
  // }

  function clearLinks() {
    _links.value = [];
  }

  return {
    // Estado
    links,

    // Métodos
    createLink,
    fetchLinks,
    // deleteLink,
    // updateLink,
    clearLinks,
  };
}
