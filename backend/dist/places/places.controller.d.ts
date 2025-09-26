import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { PlaceResponseDto } from './dto/place-response.dto';
import { ApiResponse as ApiResponseDto } from '../common/dto/api-response.dto';
export declare class PlacesController {
    private readonly placesService;
    constructor(placesService: PlacesService);
    create(createPlaceDto: CreatePlaceDto): Promise<ApiResponseDto<PlaceResponseDto | null>>;
    findAll(): Promise<ApiResponseDto<PlaceResponseDto[]>>;
    findByName(name: string): Promise<ApiResponseDto<PlaceResponseDto[]>>;
}
