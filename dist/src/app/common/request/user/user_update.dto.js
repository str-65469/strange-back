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
exports.UserProfileUpdateDto = void 0;
const class_validator_1 = require("class-validator");
const lol_main_lane_enum_1 = require("../../enum/lol_main_lane.enum");
const lol_champions_enum_1 = require("../../enum/lol_champions.enum");
class UserProfileUpdateDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Username is required' }),
    __metadata("design:type", String)
], UserProfileUpdateDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Main lane is required' }),
    __metadata("design:type", String)
], UserProfileUpdateDto.prototype, "main_lane", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Main champion is required' }),
    __metadata("design:type", Array)
], UserProfileUpdateDto.prototype, "main_champions", void 0);
exports.UserProfileUpdateDto = UserProfileUpdateDto;
//# sourceMappingURL=user_update.dto.js.map