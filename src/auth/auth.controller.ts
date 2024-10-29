import { Controller, Get, Post, Body, Res, Req, UseGuards, Headers, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register/admin')
  async registerAdmin(@Body() createAuthDto: RegisterDto) {
    return this.authService.registerAdmin(createAuthDto);
  } 

  @Post('register/user')
  async registerUser(@Body() createAuthDto: RegisterDto) {
    return this.authService.registerUser(createAuthDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: any) {
    const data = await this.authService.login(loginDto);
    res.status(200).json({ data })
  }

  @UseGuards(AuthGuard)
  @Get('getMe')
  async getMe(@Headers('authorization') authorizationHeader: string) {
    const tokens = authorizationHeader.split(' ');
    const accessToken = tokens[1];
    return this.authService.getMe(accessToken);
  }

  @UseGuards(AuthGuard)
  @Post('refreshToken')
  async refreshToken(@Headers('authorization') authorizationHeader: string) {
    const tokens = authorizationHeader.split(' ');
    const refreshToken = tokens[2];
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(AuthGuard)
  @Delete('logout')
  async logout(@Headers('authorization') authHeader: string): Promise<{ message: string }> {
    const token = authHeader.split(' ')[1];
    return this.authService.logout(token);
  }

  @Get("getAll")
  findAll() {
    return this.authService.findAll();
  }
}
