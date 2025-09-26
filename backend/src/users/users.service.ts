import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log(`👤 [UsersService] 사용자 생성 시작: ${createUserDto.email}`);
    
    // 이메일 중복 체크
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      console.log(`❌ [UsersService] 이미 존재하는 이메일: ${createUserDto.email}`);
      throw new ConflictException('이미 존재하는 이메일입니다');
    }

    // 비밀번호 해시화 (OAuth 사용자는 빈 문자열일 수 있음)
    console.log(`🔐 [UsersService] 원본 비밀번호: ${createUserDto.password}`);
    const hashedPassword = createUserDto.password 
      ? await bcrypt.hash(createUserDto.password, 10)
      : '';
    
    console.log(`🔐 [UsersService] 해시된 비밀번호: ${hashedPassword}`);
    console.log(`🔐 [UsersService] 해시 길이: ${hashedPassword.length}`);
    
    // 해시 검증 테스트
    if (createUserDto.password && hashedPassword) {
      const testCompare = await bcrypt.compare(createUserDto.password, hashedPassword);
      console.log(`🔐 [UsersService] 해시 검증 테스트: ${testCompare ? '성공' : '실패'}`);
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);
    console.log(`✅ [UsersService] 사용자 생성 완료: ${savedUser.uuid}`);
    
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(uuid: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { uuid },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다');
    }

    return user;
  }

  async update(uuid: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(uuid);

    // 비밀번호가 변경되는 경우 해시화
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(uuid: string): Promise<void> {
    const user = await this.findOne(uuid);
    await this.usersRepository.remove(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  async isEmailExists(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    return !!user;
  }

  async resetPassword(email: string, newPassword: string): Promise<User> {
    console.log(`🔐 [UsersService] 비밀번호 재설정 시작: ${email}`);
    
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다');
    }

    console.log(`🔐 [UsersService] 새 비밀번호: ${newPassword}`);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(`🔐 [UsersService] 새 해시: ${hashedPassword}`);
    
    // 해시 검증 테스트
    const testCompare = await bcrypt.compare(newPassword, hashedPassword);
    console.log(`🔐 [UsersService] 새 해시 검증 테스트: ${testCompare ? '성공' : '실패'}`);

    user.password = hashedPassword;
    const updatedUser = await this.usersRepository.save(user);
    
    console.log(`✅ [UsersService] 비밀번호 재설정 완료: ${email}`);
    return updatedUser;
  }
}