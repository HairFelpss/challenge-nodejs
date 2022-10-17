import { Test, TestingModule } from '@nestjs/testing';

import { decode } from 'jsonwebtoken';

import { AuthService } from './auth.service';
import { UsersRepository } from '../users/users.repository';
import { AuthenticateResponseDto } from './dto/authenticate-response.dto';

import { AppModule } from '../app.module';
import { UserModel } from '../users/models/users.model';

const authenticateUserMock = {
  email: 'test@test.com',
  password:
    '$argon2id$v=19$m=65536,t=3,p=4$/0jnW0mHLI5En89Q8p9ucA$vkM6SIL3zshpyK1ewgiz/rIfYlGaC+1YEkBR4pXXiAM',
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: UsersRepository;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    usersRepository = moduleRef.get(UsersRepository);
    authService = moduleRef.get(AuthService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('signup', () => {
    it('should signup', async () => {
      const tokens = await authService.login({
        email: authenticateUserMock.email,
        password: authenticateUserMock.password,
      });

      expect(tokens.access_token).toBeTruthy();
      expect(tokens.refresh_token).toBeTruthy();
    });

    it('should throw on duplicate user signup', async () => {
      let tokens: AuthenticateResponseDto | undefined;
      try {
        tokens = await authService.login({
          email: authenticateUserMock.email,
          password: authenticateUserMock.password,
        });
      } catch (error) {
        expect(error.status).toBe(403);
      }

      expect(tokens).toBeUndefined();
    });
  });

  describe('signin', () => {
    it('should throw if no existing user', async () => {
      let tokens: AuthenticateResponseDto | undefined;
      try {
        tokens = await authService.login({
          email: authenticateUserMock.email,
          password: authenticateUserMock.password,
        });
      } catch (error) {
        expect(error.status).toBe(403);
      }

      expect(tokens).toBeUndefined();
    });

    it('should login', async () => {
      await authService.login({
        email: authenticateUserMock.email,
        password: authenticateUserMock.password,
      });

      const tokens = await authService.login({
        email: authenticateUserMock.email,
        password: authenticateUserMock.password,
      });

      expect(tokens.access_token).toBeTruthy();
      expect(tokens.refresh_token).toBeTruthy();
    });

    it('should throw if password incorrect', async () => {
      let tokens: AuthenticateResponseDto | undefined;
      try {
        tokens = await authService.login({
          email: authenticateUserMock.email,
          password: authenticateUserMock.password + 'a',
        });
      } catch (error) {
        expect(error.status).toBe(403);
      }

      expect(tokens).toBeUndefined();
    });
  });

  describe('logout', () => {
    it('should pass if call to non existent user', async () => {
      const result = await authService.logout('');
      expect(result).toBeDefined();
    });

    it('should logout', async () => {
      await authService.login({
        email: authenticateUserMock.email,
        password: authenticateUserMock.password,
      });

      let userFromDb: UserModel | null;

      userFromDb = await usersRepository.getUser(
        {
          email: authenticateUserMock.email,
        },
        ['password', 'email', '_id', 'role'],
      );
      expect(userFromDb?.hashedRt).toBeTruthy();

      // logout
      await authService.logout(userFromDb!.email);

      userFromDb = await usersRepository.getUser(
        {
          email: authenticateUserMock.email,
        },
        ['password', 'email', '_id', 'role'],
      );

      expect(userFromDb?.hashedRt).toBeFalsy();
    });
  });

  describe('refresh', () => {
    it('should throw if no existing user', async () => {
      let tokens: AuthenticateResponseDto | undefined;
      try {
        tokens = await authService.refreshTokens('', '');
      } catch (error) {
        expect(error.status).toBe(403);
      }

      expect(tokens).toBeUndefined();
    });

    it('should throw if user logged out', async () => {
      // signup and save refresh token
      const _tokens = await authService.login({
        email: authenticateUserMock.email,
        password: authenticateUserMock.password,
      });

      const rt = _tokens.refresh_token;

      // get user id from refresh token
      // also possible to get using prisma like above
      // but since we have the rt already, why not just decoding it
      const decoded = decode(rt);
      const email = decoded['email'];

      // logout the user so the hashedRt is set to null
      await authService.logout(email);

      let tokens: AuthenticateResponseDto | undefined;
      try {
        tokens = await authService.refreshTokens(email, rt);
      } catch (error) {
        expect(error.status).toBe(403);
      }

      expect(tokens).toBeUndefined();
    });

    it('should throw if refresh token incorrect', async () => {
      const _tokens = await authService.login({
        email: authenticateUserMock.email,
        password: authenticateUserMock.password,
      });
      console.log({
        _tokens,
      });

      const rt = _tokens.refresh_token;

      const decoded = decode(rt);
      const email = decoded['email'];

      let tokens: AuthenticateResponseDto | undefined;
      try {
        tokens = await authService.refreshTokens(email, rt + 'a');
      } catch (error) {
        expect(error.status).toBe(403);
      }

      expect(tokens).toBeUndefined();
    });

    it('should refresh tokens', async () => {
      // log in the user again and save rt + at
      const _tokens = await authService.login({
        email: authenticateUserMock.email,
        password: authenticateUserMock.password,
      });

      const rt = _tokens.refresh_token;
      const at = _tokens.access_token;

      const decoded = decode(rt);
      const email = decoded['email'];

      // since jwt uses seconds signature we need to wait for 1 second to have new jwts
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });

      const tokens = await authService.refreshTokens(email, rt);
      expect(tokens).toBeDefined();

      // refreshed tokens should be different
      expect(tokens.access_token).not.toBe(at);
      expect(tokens.refresh_token).not.toBe(rt);
    });
  });
});
