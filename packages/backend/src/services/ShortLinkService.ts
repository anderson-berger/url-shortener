import { NewShortLink, ShortLink } from "@shortener/shared/types/link";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

export class ShortLinkService {
  constructor() {}

  async create(newShortLink: NewShortLink): Promise<ShortLink> {
    const id = randomUUID();
    const version = 1;
    const now = dayjs().toISOString();

    const shortCode = generateCode();

    const shortLink: ShortLink = {
      id,
      version,
      shortCode,
      ...newShortLink,
      createdAt: now,
      updatedAt: now,
    };

    return shortLink;
  }
}

const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CODE_LENGTH = 6;

export function generateCode(): string {
  const codeArray: string[] = [];
  for (let i = 0; i < CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * CHARS.length);
    codeArray.push(CHARS[randomIndex]);
  }

  return codeArray.join("");
}
