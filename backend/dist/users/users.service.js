"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(createUserDto) {
        console.log(`👤 [UsersService] 사용자 생성 시작: ${createUserDto.email}`);
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            console.log(`❌ [UsersService] 이미 존재하는 이메일: ${createUserDto.email}`);
            throw new common_1.ConflictException('이미 존재하는 이메일입니다');
        }
        console.log(`🔐 [UsersService] 원본 비밀번호: ${createUserDto.password}`);
        const hashedPassword = createUserDto.password
            ? await bcrypt.hash(createUserDto.password, 10)
            : '';
        console.log(`🔐 [UsersService] 해시된 비밀번호: ${hashedPassword}`);
        console.log(`🔐 [UsersService] 해시 길이: ${hashedPassword.length}`);
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
    async findAll() {
        return this.usersRepository.find();
    }
    async findOne(uuid) {
        const user = await this.usersRepository.findOne({
            where: { uuid },
        });
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다');
        }
        return user;
    }
    async update(uuid, updateUserDto) {
        const user = await this.findOne(uuid);
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }
    async remove(uuid) {
        const user = await this.findOne(uuid);
        await this.usersRepository.remove(user);
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({
            where: { email },
        });
    }
    async isEmailExists(email) {
        const user = await this.usersRepository.findOne({
            where: { email },
        });
        return !!user;
    }
    async resetPassword(email, newPassword) {
        console.log(`🔐 [UsersService] 비밀번호 재설정 시작: ${email}`);
        const user = await this.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다');
        }
        console.log(`🔐 [UsersService] 새 비밀번호: ${newPassword}`);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log(`🔐 [UsersService] 새 해시: ${hashedPassword}`);
        const testCompare = await bcrypt.compare(newPassword, hashedPassword);
        console.log(`🔐 [UsersService] 새 해시 검증 테스트: ${testCompare ? '성공' : '실패'}`);
        user.password = hashedPassword;
        const updatedUser = await this.usersRepository.save(user);
        console.log(`✅ [UsersService] 비밀번호 재설정 완료: ${email}`);
        return updatedUser;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map