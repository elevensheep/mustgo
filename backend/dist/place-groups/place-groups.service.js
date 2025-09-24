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
let PlaceGroupsService = class PlaceGroupsService {
    constructor(placeGroupsRepository, placeGroupItemsRepository, placesRepository, usersRepository) {
        this.placeGroupsRepository = placeGroupsRepository;
        this.placeGroupItemsRepository = placeGroupItemsRepository;
        this.placesRepository = placesRepository;
        this.usersRepository = usersRepository;
    }
    async create(name, description, userId) {
        const user = await this.usersRepository.findOne({ where: { uuid: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        const placeGroup = this.placeGroupsRepository.create({
            name,
            description,
            user,
        });
        return this.placeGroupsRepository.save(placeGroup);
    }
    async findAll() {
        return this.placeGroupsRepository.find({
            relations: ['user', 'items'],
        });
    }
    async findOne(id) {
        return this.placeGroupsRepository.findOne({
            where: { id },
            relations: ['user', 'items'],
        });
    }
    async addPlaceToGroup(groupId, placeId, note) {
        const placeGroup = await this.placeGroupsRepository.findOne({ where: { id: groupId } });
        const place = await this.placesRepository.findOne({ where: { id: placeId } });
        if (!placeGroup || !place) {
            throw new Error('PlaceGroup or Place not found');
        }
        const placeGroupItem = this.placeGroupItemsRepository.create({
            placeGroup,
            place,
            note,
        });
        return this.placeGroupItemsRepository.save(placeGroupItem);
    }
};
exports.PlaceGroupsService = PlaceGroupsService;
exports.PlaceGroupsService = PlaceGroupsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(place_group_entity_1.PlaceGroup)),
    __param(1, (0, typeorm_1.InjectRepository)(place_group_item_entity_1.PlaceGroupItem)),
    __param(2, (0, typeorm_1.InjectRepository)(place_entity_1.Place)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PlaceGroupsService);
//# sourceMappingURL=place-groups.service.js.map