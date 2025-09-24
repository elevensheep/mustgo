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
exports.PlaceGroupItem = void 0;
const typeorm_1 = require("typeorm");
const place_group_entity_1 = require("./place-group.entity");
const place_entity_1 = require("../../places/entities/place.entity");
let PlaceGroupItem = class PlaceGroupItem {
};
exports.PlaceGroupItem = PlaceGroupItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PlaceGroupItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => place_group_entity_1.PlaceGroup, (placeGroup) => placeGroup.items, { lazy: true }),
    (0, typeorm_1.JoinColumn)({ name: 'place_group_id', referencedColumnName: 'id' }),
    __metadata("design:type", place_group_entity_1.PlaceGroup)
], PlaceGroupItem.prototype, "placeGroup", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => place_entity_1.Place, { lazy: true }),
    (0, typeorm_1.JoinColumn)({ name: 'place_id', referencedColumnName: 'id' }),
    __metadata("design:type", place_entity_1.Place)
], PlaceGroupItem.prototype, "place", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PlaceGroupItem.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PlaceGroupItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PlaceGroupItem.prototype, "updatedAt", void 0);
exports.PlaceGroupItem = PlaceGroupItem = __decorate([
    (0, typeorm_1.Entity)('place_group_items')
], PlaceGroupItem);
//# sourceMappingURL=place-group-item.entity.js.map