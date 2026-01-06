// src/short-link/ShortLink.Service.ts
import { generateShortCode } from "@/utils/shortcode.util";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import { ShortLinkRepository } from "@/short-link/ShortLink.Repository";
import {
  NewShortLink,
  Pagination,
  ShortLink,
} from "@/short-link/ShortLink.Schemas";
import {
  ConflictError,
  NotFoundError,
  ForbiddenError,
} from "@/utils/error/errors";

export class ShortLinkService {
  private shortLinkRepository: ShortLinkRepository;

  constructor() {
    this.shortLinkRepository = new ShortLinkRepository();
  }

  async create(newShortLink: NewShortLink, userId: string): Promise<ShortLink> {
    const id = randomUUID();
    const now = dayjs().toISOString();

    const shortLink: ShortLink = {
      id,
      userId,
      version: 1,
      ...newShortLink,
      createdAt: now,
      updatedAt: now,
    };

    const isAvailable = await this.isShortCodeAvailable(shortLink.shortCode);

    if (!isAvailable) {
      throw new ConflictError("Shortcode already exists");
    }

    await this.shortLinkRepository.save(shortLink);
    return shortLink;
  }

  async update(shortLink: ShortLink, userId: string): Promise<ShortLink> {
    const original = await this.getById(shortLink.id, userId);

    if (original.version !== shortLink.version) {
      throw new ConflictError(
        "The link was modified by another process. Please refresh and try again."
      );
    }

    const updatedShortLink: ShortLink = {
      ...shortLink,
      userId, // Para garantir que o id não mude.
      version: original.version + 1,
      updatedAt: dayjs().toISOString(),
    };

    await this.shortLinkRepository.update(updatedShortLink);
    return updatedShortLink;
  }

  async getById(id: ShortLink["id"], userId: string) {
    const shortlink = await this.shortLinkRepository.getById(id);

    if (!shortlink) {
      throw new NotFoundError("Link not found");
    }

    // Verifica se o link pertence ao usuário
    if (shortlink.userId !== userId) {
      throw new ForbiddenError("You don't have permission to access this link");
    }

    return shortlink;
  }

  async isShortCodeAvailable(
    shortCode: ShortLink["shortCode"]
  ): Promise<boolean> {
    const exists =
      await this.shortLinkRepository.isShortCodeAvailable(shortCode);

    return exists;
  }

  async list(pagination: Pagination, userId: string) {
    const links = await this.shortLinkRepository.list(pagination, userId);

    return links;
  }

  async delete(shortLink: ShortLink, userId: string) {
    const original = await this.getById(shortLink.id, userId);

    if (original.version !== shortLink.version) {
      throw new ConflictError(
        "The link was modified by another process. Please refresh and try again."
      );
    }

    await this.shortLinkRepository.delete(shortLink);
  }

  async redirect(shortCode: ShortLink["shortCode"]) {
    const link = await this.shortLinkRepository.getByShortCode(shortCode);
    if (!link) {
      throw new NotFoundError("Link not found");
    }
    return link.originalUrl;
  }
}
