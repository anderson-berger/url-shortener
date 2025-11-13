import { ShortLinkRepository } from "@/repositories/ShortLink_Repository";
import { generateShortCode } from "@/utils/shortcode.util";
import { NewShortLink, ShortLink } from "@shortener/shared/types/link";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

export class ShortLinkService {
  private shortLinkRepository: ShortLinkRepository;
  constructor() {
    this.shortLinkRepository = new ShortLinkRepository();
  }

  async create(newShortLink: NewShortLink): Promise<ShortLink> {
    const id = randomUUID();
    const now = dayjs().toISOString();

    const shortCode = generateShortCode();
    const shortLink: ShortLink = {
      id,
      version: 1,
      shortCode,
      ...newShortLink,
      createdAt: now,
      updatedAt: now,
    };

    await this.shortLinkRepository.save(shortLink);
    return shortLink;
  }

  async redirect(shortCode: ShortLink["shortCode"]) {
    const link = await this.shortLinkRepository.getByShortCode(shortCode);
    if (!link) {
      throw new Error("Link not found");
    }
    return link.originalUrl;
  }
}
