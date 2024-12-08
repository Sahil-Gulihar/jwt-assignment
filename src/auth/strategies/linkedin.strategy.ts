import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/linkedin/callback`,
      scope: ['r_emailaddress', 'r_liteprofile'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { id, emails, name } = profile;

    let user = await this.userRepository.findOne({
      where: {
        linkedInId: id,
        email: emails[0].value,
      },
    });

    if (!user) {
      user = this.userRepository.create({
        linkedInId: id,
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        isOAuthUser: true,
      });

      await this.userRepository.save(user);
    }

    const { password, ...result } = user;
    return result;
  }
}
