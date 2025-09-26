import { PlaceGroupsService } from './place-groups.service';
import { ApiResponse as ApiResponseDto } from '../common/dto/api-response.dto';
import { CreatePlaceGroupDto } from './dto/create-place-group.dto';
import { PlaylistResponseDto } from './dto/playlist-response.dto';
export declare class PlaceGroupsController {
    private readonly placeGroupsService;
    constructor(placeGroupsService: PlaceGroupsService);
    create(createPlaceGroupDto: CreatePlaceGroupDto): Promise<ApiResponseDto<PlaylistResponseDto>>;
    findAll(): Promise<ApiResponseDto<PlaylistResponseDto[]>>;
    findOne(id: string): Promise<ApiResponseDto<PlaylistResponseDto>>;
}
