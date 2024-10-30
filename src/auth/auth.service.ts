import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto, Role } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async registerAdmin({ username, email, password, age, from }: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username, email, password: hashedPassword, age, from, role: Role.ADMIN });
    await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async registerUser({ username, email, password, age, from }: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username, email, password: hashedPassword, age, from, role: Role.USER });
    await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async login(loginDto: { email: string; password: string }) {
    const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const checkPass = await bcrypt.compare(loginDto.password, user.password);
    if (!checkPass) {
      throw new NotFoundException('Password or email wrong');
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    // Refresh tokenni cookie'ga yozish uchun qaytaramiz, lekin bazaga saqlamaymiz
    return { accessToken, refreshToken };
  }

  async getMe(accessToken: string): Promise<Partial<User>> {
    try {
      const payload = this.jwtService.verify(accessToken);
      const user = await this.userRepository.findOne({ where: { id: payload.id } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      delete user.password;
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findOne({ where: { id: payload.id } });
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const accessToken = this.jwtService.sign({ id: user.id, email: user.email, role: user.role });
      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(accessToken: string): Promise<{ message: string }> {
    // Tokenni o'chirish uchun kerakli jarayonlar, agar bazaga saqlanmagan bo'lsa, faqat clientni cookie'ni tozalash kerak
    return { message: 'Logout successful' };
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users.map(({ password, ...rest }) => rest);
  }
}
