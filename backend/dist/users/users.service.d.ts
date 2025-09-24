import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(uuid: string): Promise<User>;
    update(uuid: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(uuid: string): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
    isEmailExists(email: string): Promise<boolean>;
}
