import { NewCredential } from "@/credential/Credential.Schemas";
import { CredentialService } from "@/credential/Credential.Service";
import { Register } from "@/register/Register.Schemas";
import { NewUser } from "@/user/User.Schemas";
import { UserService } from "@/user/User.Service";

export class AuthService {
  private userService: UserService;
  private credentialService: CredentialService;
  constructor() {
    this.userService = new UserService();
    this.credentialService = new CredentialService();
  }
  async register(input: Register) {
    const newUser: NewUser = {
      email: input.email,
    };
    const user = await this.userService.create(newUser);

    const newCredential: NewCredential = {
      userId: user.id,
      password: input.password,
    };

    await this.credentialService.create(newCredential);

    return user;
  }
}
