import { ShortLinkService } from "@/services/ShortLink_Service";
import { NewShortLink, ShortLink } from "@shortener/shared/types/link";

export class ShortLinkController {
  private shortLinkService: ShortLinkService;

  constructor() {
    this.shortLinkService = new ShortLinkService();
  }

  async create(newShortLink: NewShortLink): Promise<ShortLink> {
    return await this.shortLinkService.create(newShortLink);
  }

  async redirect(shortCode: string): Promise<string> {
    const originalUrl = await this.shortLinkService.redirect(shortCode);

    return originalUrl;
  }
}
