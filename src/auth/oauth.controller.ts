import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { AuthService } from './auth.service';

@ApiTags('OAuth Authentication')
@Controller('auth')
export class OAuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res) {
    const user = req.user;
    if(!user) {
      res.status(404).send('User not found');
    }
    const token = await this.authService.generateOAuthToken(user);

    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
  }

  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuth() {}

  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuthCallback(@Req() req, @Res() res) {
    const user = req.user;

    const token = await this.authService.generateOAuthToken(user);

    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  }
}
