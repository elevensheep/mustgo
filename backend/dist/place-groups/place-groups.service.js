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
exports.PlaceGroupsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const place_group_entity_1 = require("./entities/place-group.entity");
const place_group_item_entity_1 = require("./entities/place-group-item.entity");
const place_entity_1 = require("../places/entities/place.entity");
const user_entity_1 = require("../users/entities/user.entity");
const cache_manager_1 = require("@nestjs/cache-manager");
let PlaceGroupsService = class PlaceGroupsService {
    constructor(placeGroupsRepository, placeGroupItemsRepository, placesRepository, usersRepository, cacheManager) {
        this.placeGroupsRepository = placeGroupsRepository;
        this.placeGroupItemsRepository = placeGroupItemsRepository;
        this.placesRepository = placesRepository;
        this.usersRepository = usersRepository;
        this.cacheManager = cacheManager;
    }
    async create(createPlaceGroupDto) {
        const user = await this.usersRepository.findOne({ where: { uuid: createPlaceGroupDto.userId } });
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다');
        }
        const existingPlaylist = await this.placeGroupsRepository.findOne({
            where: { name: createPlaceGroupDto.name, user: { uuid: createPlaceGroupDto.userId } }
        });
        if (existingPlaylist) {
            throw new common_1.BadRequestException('같은 이름의 플레이리스트가 이미 존재합니다');
        }
        const placeGroup = this.placeGroupsRepository.create({
            name: createPlaceGroupDto.name,
            description: createPlaceGroupDto.description,
            latitude: createPlaceGroupDto.location?.latitude,
            longitude: createPlaceGroupDto.location?.longitude,
            address: createPlaceGroupDto.location?.address,
            user,
        });
        const savedPlaceGroup = await this.placeGroupsRepository.save(placeGroup);
        if (createPlaceGroupDto.places && createPlaceGroupDto.places.length > 0) {
            for (const placeInfo of createPlaceGroupDto.places) {
                await this.addPlaceToGroup(savedPlaceGroup.id, placeInfo);
            }
        }
        await this.cacheManager.del('playlists:all');
        await this.cacheManager.del(`playlist:${savedPlaceGroup.id}`);
        return this.findOne(savedPlaceGroup.id);
    }
    async addPlaceToGroup(groupId, placeInfo) {
        const placeGroup = await this.placeGroupsRepository.findOne({ where: { id: groupId } });
        if (!placeGroup) {
            throw new common_1.NotFoundException('플레이리스트를 찾을 수 없습니다');
        }
        let place;
        if (placeInfo.id) {
            place = await this.placesRepository.findOne({ where: { id: placeInfo.id } });
        }
        else if (placeInfo.placeId) {
            place = await this.placesRepository.findOne({ where: { placeId: placeInfo.placeId } });
        }
        if (!place) {
            place = this.placesRepository.create({
                placeId: placeInfo.placeId,
                name: placeInfo.name,
                address: placeInfo.address,
                roadAddress: placeInfo.roadAddress,
                category: placeInfo.category,
                phone: placeInfo.phone,
                url: placeInfo.url,
                description: placeInfo.description,
                imageUrl: placeInfo.imageUrl,
                latitude: placeInfo.latitude,
                longitude: placeInfo.longitude,
                distance: placeInfo.distance,
                isFromAPI: placeInfo.isFromAPI || false,
                user: placeGroup.user,
            });
            place = await this.placesRepository.save(place);
        }
        const placeGroupItem = this.placeGroupItemsRepository.create({
            placeGroup,
            place,
        });
        return this.placeGroupItemsRepository.save(placeGroupItem);
    }
    async findAll() {
        const cacheKey = 'playlists:all';
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        const playlists = await this.placeGroupsRepository.find({
            relations: ['user', 'items', 'items.place'],
        });
        await this.cacheManager.set(cacheKey, playlists, 300);
        return playlists;
    }
    async findOne(id) {
        const cacheKey = `playlist:${id}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }
        const placeGroup = await this.placeGroupsRepository.findOne({
            where: { id },
            relations: ['user', 'items', 'items.place'],
        });
        if (!placeGroup) {
            throw new common_1.NotFoundException('플레이리스트를 찾을 수 없습니다');
        }
        await this.cacheManager.set(cacheKey, placeGroup, 600);
        return placeGroup;
    }
};
exports.PlaceGroupsService = PlaceGroupsService;
exports.PlaceGroupsService = PlaceGroupsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(place_group_entity_1.PlaceGroup)),
    __param(1, (0, typeorm_1.InjectRepository)(place_group_item_entity_1.PlaceGroupItem)),
    __param(2, (0, typeorm_1.InjectRepository)(place_entity_1.Place)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository, Object])
], PlaceGroupsService);
//# sourceMappingURL=place-groups.service.js.map