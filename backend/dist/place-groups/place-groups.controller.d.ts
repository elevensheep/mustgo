import { PlaceGroupsService } from './place-groups.service';
import { ApiResponse as ApiResponseDto } from '../common/dto/api-response.dto';
export declare class PlaceGroupsController {
    private readonly placeGroupsService;
    constructor(placeGroupsService: PlaceGroupsService);
    create(createPlaceGroupDto: {
        name: string;
        description?: string;
        userId: string;
    }): Promise<ApiResponseDto<any>>;
    findAll(): Promise<ApiResponseDto<any[]>>;
    findOne(id: string): Promise<ApiResponseDto<any>>;
}
