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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Place = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const comment_entity_1 = require("../../comments/entities/comment.entity");
let Place = class Place {
};
exports.Place = Place;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Place.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'place_id', unique: true, nullable: false }),
    __metadata("design:type", String)
], Place.prototype, "placeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'place_name', nullable: false }),
    __metadata("design:type", String)
], Place.prototype, "placeName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Place.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_url', nullable: true }),
    __metadata("design:type", String)
], Place.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.places, { lazy: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id', referencedColumnName: 'uuid' }),
    __metadata("design:type", user_entity_1.User)
], Place.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Place.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Place.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Place.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Place.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, (comment) => comment.place),
    __metadata("design:type", Array)
], Place.prototype, "comments", void 0);
exports.Place = Place = __decorate([
    (0, typeorm_1.Entity)('places')
], Place);
//# sourceMappingURL=place.entity.js.map