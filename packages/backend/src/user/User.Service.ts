import { UserRepository } from "@/user/User.repository";
import { $user, NewUser, User } from "@/user/User.Schemas";
import { ConflictError, NotFoundError } from "@/utils/error/errors";
import { randomUUID } from "crypto";
import dayjs from "dayjs";

export class UserService {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  async create(newUser: NewUser): Promise<User> {
    const existing = await this.userRepository.getByEmail(newUser.email);
    console.log("existing", existing);

    if (existing) {
      throw new ConflictError("Email already registered");
    }

    const now = dayjs().toISOString();
    const id = randomUUID();

    const user: User = {
      id,
      email: newUser.email,
      createdAt: now,
      updatedAt: now,
    };
    console.log("user", user);

    await this.userRepository.save(user);

    return user;
  }

  async getById(userId: User["id"]) {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async getByEmail(email: User["email"]) {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }
}
