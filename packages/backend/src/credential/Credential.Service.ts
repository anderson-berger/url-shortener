import { CredentialRepository } from "@/credential/Credential.Repository";
import { Credential, NewCredential } from "@/credential/Credential.Schemas";
import { User } from "@/user/User.Schemas";
import { hashPassword } from "@/utils/crypto/hash";
import { ConflictError, NotFoundError } from "@/utils/error/errors";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

export class CredentialService {
  private credentialRepository: CredentialRepository;

  constructor() {
    this.credentialRepository = new CredentialRepository();
  }

  async create(newCredential: NewCredential) {
    const existing = await this.credentialRepository.getByUserId(
      newCredential.userId
    );

    if (existing) {
      throw new ConflictError("Credential already exists for this user");
    }

    const now = dayjs().toISOString();
    const id = randomUUID();
    const passwordHash = await hashPassword(newCredential.password);

    const credential: Credential = {
      id,
      userId: newCredential.userId,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    await this.credentialRepository.save(credential);
  }

  async getByUserId(userId: User["id"]) {
    const credential = await this.credentialRepository.getByUserId(userId);

    if (!credential) {
      throw new NotFoundError("Credential not found for this user");
    }

    return credential;
  }
}
