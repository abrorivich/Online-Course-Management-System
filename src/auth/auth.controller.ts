import { Controller, Get, Post, Body, Res, Req, UseGuards, Headers, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RolesAdminGuard } from './rolesAdmin.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register admin uchun
  @Post('register/admin')
  async registerAdmin(@Body() createAuthDto: RegisterDto, @Res() res) {
    try {
      const user = await this.authService.registerAdmin(createAuthDto);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  }

  // Register user uchun
  @Post('register/user')
  async registerUser(@Body() createAuthDto: RegisterDto, @Res() res) {
    try {
      const user = await this.authService.registerUser(createAuthDto);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  }

  // Login
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res) {
    try {
      const { accessToken, refreshToken } = await this.authService.login(loginDto);
      // Cookiega refresh token qo'yish
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      return res.status(200).json({ accessToken });
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  }

  // Token beradi va o'zining ma'lumotlarini oladi
  @UseGuards(AuthGuard)
  @Get('getMe')
  async getMe(@Headers('authorization') authorizationHeader: string, @Res() res) {
    const tokens = authorizationHeader.split(' ');
    const accessToken = tokens[1];
    try {
      const user = await this.authService.getMe(accessToken);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  }

  // RefreshToken beradi va accessToken oladi
  @UseGuards(AuthGuard)
  @Post('refreshToken')
  async refreshToken(@Headers('authorization') authorizationHeader: string, @Res() res) {
    const tokens = authorizationHeader.split(' ');
    const refreshToken = tokens[2];
    try {
      const { accessToken } = await this.authService.refreshToken(refreshToken);
      return res.status(200).json({ accessToken });
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  }

  // Databasedan chiqib ketadi
  @UseGuards(AuthGuard)
  @Delete('logout')
  async logout(@Headers('authorization') authHeader: string, @Res() res) {
    const token = authHeader.split(' ')[1];
    try {
      await this.authService.logout(token);
      res.clearCookie('refreshToken'); // Cookie'ni tozalash
      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  }

  // Barcha userslarni ko'radi
  @UseGuards(AuthGuard, RolesAdminGuard)
  @Get("getAll")
  async findAll(@Res() res) {
    try {
      const users = await this.authService.findAll();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  }
}
