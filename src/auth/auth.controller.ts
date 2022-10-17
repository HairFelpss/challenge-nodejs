import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

import { AuthService } from './auth.service';
import { AuthenticateDto } from './dto/authenticate.dto';
import { RecoverPassworDto } from './dto/recoverPassword.dto';

import { UserNotAuthorizedException } from './exceptions/unauthorized-exceptions';

import { Tokens } from './types/tokens.type';

import { Public } from 'src/common/decorators/public.decorator';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { UserDontExistException } from 'src/users/exceptions/user-dont-exist-exceptions';
import { PasswordInvalidException } from 'src/users/exceptions/password-invalid-exception';

@ApiTags('Authenticate')
@Controller('auth')
@ApiException(() => UserNotAuthorizedException, {
  description: 'User is not authorized',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Authenticate a user locally.' })
  @ApiException(() => [UserDontExistException, PasswordInvalidException])
  @ApiCreatedResponse({
    description: 'The user has logged successfully.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('local/signin')
  signinLocal(@Body() user: AuthenticateDto): Promise<Tokens> {
    return this.authService.signinLocal(user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @ApiOperation({ summary: 'Recover password.' })
  @ApiException(() => [UserDontExistException])
  @ApiCreatedResponse({
    description: 'Recovery password email sent.',
  })
  @Post('recover-password')
  async recoverPassword(@Body() user: RecoverPassworDto) {
    console.log('teste ===> ', user);
  }
}
