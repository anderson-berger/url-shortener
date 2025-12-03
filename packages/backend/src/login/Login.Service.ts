import { CredentialService } from "@/credential/Credential.Service";
import { UserService } from "@/user/User.Service";
import { Login } from "@/login/Login.Schemas";
import { comparePassword } from "@/utils/crypto/hash";
import { InvalidCredentialsError } from "@/utils/error/errors";
import { generateToken } from "@/utils/jwt/jwt";

export class LoginService {
  private userService: UserService;
  private credentialService: CredentialService;
  constructor() {
    this.userService = new UserService();
    this.credentialService = new CredentialService();
  }
  async login(input: Login) {
    const user = await this.userService.getByEmail(input.email);
    const credential = await this.credentialService.getByUserId(user.id);

    const isPasswordValid = await comparePassword(
      input.password,
      credential.passwordHash
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const token = await generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      type: "Bearer",
      token,
    };
  }
}
