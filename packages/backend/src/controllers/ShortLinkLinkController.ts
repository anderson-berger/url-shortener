import { ShortLinkService } from "@/services/ShortLinkService";
import { NewShortLink } from "@shortener/shared/types/link";

export class ShortLinkLinkController {
  shortLinkService: ShortLinkService;
  constructor() {
    this.shortLinkService = new ShortLinkService();
  }

  async create(newShortLink: NewShortLink) {
    const shortLink = await this.shortLinkService.create(newShortLink);

    return shortLink;
  }
}
