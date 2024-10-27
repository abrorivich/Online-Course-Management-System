import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto, Role } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async registerAdmin({ username, email, password, age, from }: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = this.userRepository.create({ username, email, password: hashedPassword, age, from, role: Role.ADMIN })
    await this.userRepository.save(user)
    delete user.password;
    delete user.refreshToken;
    return user
  }

  async registerUser({ username, email, password, age, from }: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = this.userRepository.create({ username, email, password: hashedPassword, age, from, role: Role.USER })
    await this.userRepository.save(user)
    delete user.password;
    delete user.refreshToken;
    return user
  }

  async login(loginDto: { email: string; password: string }) {
    const user = await this.userRepository.findOneBy({ email: loginDto.email })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    const checkPass = await bcrypt.compare(loginDto.password, user.password)
    if (!checkPass) {
      throw new NotFoundException('Password or email wrong')
    }
    const payload = { id: user.id, email: user.email, role: user.role }
    const accesToken = await this.jwtService.sign(payload)
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })
    user.refreshToken = refreshToken;
    user.password = undefined
    await this.userRepository.save(user)
    delete user.password;
    delete user.refreshToken;
    const { password, ...userData } = user
    return { userData, accesToken, refreshToken }
  }

  async getMe(accessToken: string): Promise<Partial<User>> {
    try {
      const payload = this.jwtService.verify(accessToken);
      const user = await this.userRepository.findOne({ where: { id: payload.id } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      delete user.password;
      delete user.refreshToken;
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({ where: { refreshToken } });
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken };
  }

  async logout(accessToken: string): Promise<{ message: string }> {
    try {
      const payload = this.jwtService.verify(accessToken);
      const user = await this.userRepository.findOne({ where: { id: payload.id } });
      if (!user) {
        throw new UnauthorizedException('Foydalanuvchi topilmadi');
      }
      await this.userRepository.delete(user.id);
      return { message: 'Foydalanuvchi muvaffaqiyatli chiqdi' };
    } catch (error) {
      throw new UnauthorizedException('Yaroqsiz access token');
    }
  }


  async findAll() {
    const user = await this.userRepository.find()
    const filteredUsers = user.map(({ password, refreshToken, role, ...rest }) => rest);
    return filteredUsers
  }
}

