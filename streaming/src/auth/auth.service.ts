import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) {}

  // REGISTER
  async register(body: any) {
    return {
      message:
        'User registered successfully',
      user: body,
    };
  }

  // LOGIN
  async login(loginDto: any) {
    const { email, password } =
      loginDto;

    // STREAMER LOGIN
    if (
      email ===
        'spsuraj2004@gmail.com' &&
      password === '123456'
    ) {
      const payload = {
        email,
        role: 'streamer',
      };

      return {
        access_token:
          this.jwtService.sign(payload),

        role: 'streamer',
      };
    }

    // VIEWER LOGIN
    if (
      email === 'viewer@gmail.com' &&
      password === 'viewer123'
    ) {
      const payload = {
        email,
        role: 'viewer',
      };

      return {
        access_token:
          this.jwtService.sign(payload),

        role: 'viewer',
      };
    }

    return {
      message: 'Invalid credentials',
    };
  }
}