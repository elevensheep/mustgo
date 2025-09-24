import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiResponse as ApiResponseDto } from '../common/dto/api-response.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<ApiResponseDto<UserResponseDto>>;
    findAll(): Promise<ApiResponseDto<UserResponseDto[]>>;
    findOne(id: string): Promise<ApiResponseDto<UserResponseDto>>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<ApiResponseDto<UserResponseDto>>;
    remove(id: string): Promise<ApiResponseDto<null>>;
    checkEmail(email: string): Promise<ApiResponseDto<boolean>>;
}
