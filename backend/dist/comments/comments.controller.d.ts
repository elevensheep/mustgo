import { CommentsService } from './comments.service';
import { ApiResponse as ApiResponseDto } from '../common/dto/api-response.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    findByPlaceId(placeId: string): Promise<ApiResponseDto<any[]>>;
}
