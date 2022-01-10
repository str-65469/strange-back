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
exports.UsersService = void 0;
const bcrypt = require("bcrypt");
const user_entity_1 = require("../../../../database/entity/user.entity");
const matching_spams_entity_1 = require("../../../../database/entity/matching_spams.entity");
const common_1 = require("@nestjs/common");
const user_register_cache_entity_1 = require("../../../../database/entity/user_register_cache.entity");
const random_generator_1 = require("../../../utils/random_generator");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("../../../../configs/config");
const typeorm_2 = require("typeorm");
const user_details_entity_1 = require("../../../../database/entity/user_details.entity");
const lol_league_enum_1 = require("../../../common/enum/lol_league.enum");
const jwt_access_service_1 = require("../../common/jwt_access.service");
const user_register_dto_1 = require("../../../common/request/user/user_register.dto");
const user_update_dto_1 = require("../../../common/request/user/user_update.dto");
const user_update_password_dto_1 = require("../../../common/request/user/user_update_password.dto");
const tokens_1 = require("../../../../configs/addons/tokens");
const dicebear_1 = require("../../../utils/dicebear");
const general_exception_1 = require("../../../common/exceptions/general.exception");
const exception_message_code_enum_1 = require("../../../common/enum/message_codes/exception_message_code.enum");
let UsersService = class UsersService {
    constructor(httpService, jwtService, userRepo, userDetailsRepo, registerCacheRepo) {
        this.httpService = httpService;
        this.jwtService = jwtService;
        this.userRepo = userRepo;
        this.userDetailsRepo = userDetailsRepo;
        this.registerCacheRepo = registerCacheRepo;
    }
    userID(request) {
        var _a;
        const accessToken = (_a = request.cookies) === null || _a === void 0 ? void 0 : _a.access_token;
        if (!accessToken) {
            throw new general_exception_1.GenericException(common_1.HttpStatus.UNAUTHORIZED, exception_message_code_enum_1.ExceptionMessageCode.ACCESS_TOKEN_MISSING, config_1.configs.messages.exceptions.accessTokenMissing);
        }
        const accessTokenDecoded = this.jwtService.decode(accessToken);
        return accessTokenDecoded.id;
    }
    async user(id) {
        return await this.userRepo.findOne(id);
    }
    async getUserDetails(id) {
        return await this.userRepo.findOne(id, {
            relations: ['details', 'belongings'],
        });
    }
    userSocketPayload(socket) {
        var _a, _b;
        const token = (_b = (_a = socket.handshake) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0 ? void 0 : _b.token;
        const accessTokenDecoded = this.jwtService.decode(token);
        return accessTokenDecoded;
    }
    async userSpamAndDetails(id) {
        return await this.userRepo.findOne(id, { relations: ['spams', 'details'] });
    }
    async findOne(id) {
        return await this.userRepo.findOne(id);
    }
    findOneForced(id) {
        return this.userRepo.createQueryBuilder().where('id = :id', { id }).select('*').getRawOne();
    }
    async findOneByEmail(email, opts) {
        if (opts === null || opts === void 0 ? void 0 : opts.fetchPassword) {
            return this.userRepo
                .createQueryBuilder('users')
                .where('users.email = :email', { email })
                .addSelect('users.password')
                .getOne();
        }
        if (opts === null || opts === void 0 ? void 0 : opts.fetchDetails) {
            return this.userRepo.findOne({ where: { email }, relations: ['details'] });
        }
        return this.userRepo.findOne({ where: { email } });
    }
    findByEmailOrUsername(email, username) {
        return this.userRepo.findOne({ where: [{ email }, { username }] });
    }
    async updateImagePath(id, path) {
        const user = await this.userRepo.findOne(id);
        user.img_path = '/user/profiles/' + path;
        return await this.userRepo.save(user);
    }
    async checkLolCredentialsValid(server, summoner_name) {
        return this.httpService.axiosRef
            .get('/api/summoner_profile', {
            params: {
                server,
                summonerName: summoner_name,
            },
        })
            .then((res) => {
            const { level, profileImageId } = res.data;
            return {
                level,
                profileImageId,
                league: res.data.division,
                league_number: res.data.divisionNumber,
                league_points: res.data.leaguePoints,
                win_rate: res.data.winRatio,
            };
        })
            .catch(() => {
            throw new general_exception_1.GenericException(common_1.HttpStatus.BAD_REQUEST, exception_message_code_enum_1.ExceptionMessageCode.DIVISION_SUMMONER_ERROR, config_1.configs.messages.exceptions.summonerDivisionCheck);
        });
    }
    async cacheUserRegister(body, details) {
        const { email, password, server, summoner_name, username } = body;
        const { league, league_number, league_points, level, win_rate } = details;
        const secret = this.jwtService.sign({ email, summoner_name, username }, { expiresIn: tokens_1.default.user_register_token });
        const d1 = new Date();
        const d2 = new Date(d1);
        d2.setMinutes(d1.getMinutes() + 30);
        const pass = bcrypt.hashSync(password, bcrypt.genSaltSync(12));
        return await this.registerCacheRepo.save({
            email,
            server,
            summoner_name,
            username,
            league,
            league_number,
            league_points,
            level,
            win_rate,
            password: pass,
            secret_token: secret,
            expiry_date: d2,
        });
    }
    async saveUserByCachedData(userCached, secret, ip) {
        const { email, password, username } = userCached;
        const user = this.userRepo.create({
            ip,
            email,
            password,
            username,
            secret,
            img_path: (0, dicebear_1.generateCompressedSprite)(),
            socket_id: random_generator_1.RandomGenerator.randomString(),
        });
        return await this.userRepo.save(user);
    }
    async saveUser(user, secret) {
        user.secret = secret;
        return await this.userRepo.save(user);
    }
    async updateUserProfile(id, data) {
        const { username, discord_name, main_champions, main_lane } = data;
        await this.userRepo.save({ id, username });
        const userDetails = await this.userDetailsRepo.findOne({ where: { user: id } });
        userDetails.discord_name = discord_name;
        userDetails.main_champions = main_champions;
        userDetails.main_lane = main_lane;
        await this.userDetailsRepo.save(userDetails);
        return await this.getUserDetails(id);
    }
    async updateUserCredentials(id, data) {
        const password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(12));
        const user = await this.findOneForced(id);
        user.password = password;
        await this.userRepo.save(user);
        return await this.getUserDetails(id);
    }
    async updatePassword(id, newPassword) {
        const password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(12));
        return this.userRepo.update(id, {
            password,
        });
    }
    async updateOnlineStatus(userId, status) {
        await this.userRepo.update(userId, {
            is_online: status,
        });
    }
    async findNewDuoDetails(user, prevId) {
        const { accept_list, remove_list, decline_list, matched_list } = user.spams;
        const al = accept_list !== null && accept_list !== void 0 ? accept_list : [];
        const rl = remove_list !== null && remove_list !== void 0 ? remove_list : [];
        const dl = decline_list !== null && decline_list !== void 0 ? decline_list : [];
        const ml = matched_list !== null && matched_list !== void 0 ? matched_list : [];
        let filterList = [...new Set([...al, ...rl, ...dl, ...ml, user.id])];
        const leagues = Object.values(lol_league_enum_1.LolLeague);
        const currEnumIndex = leagues.indexOf(user.details.league);
        let filteredLeagues = [];
        if (currEnumIndex === 0) {
            filteredLeagues = leagues.filter((_, i) => i <= currEnumIndex + 1);
        }
        else if (currEnumIndex === leagues.length - 1) {
            filteredLeagues = leagues.filter((_, i) => i >= currEnumIndex - 1);
        }
        else {
            filteredLeagues = leagues.filter((_, i) => i >= currEnumIndex - 1 && i <= currEnumIndex + 1);
        }
        return this.userDetailsRepo.findOne({
            where: {
                user: (0, typeorm_2.Not)((0, typeorm_2.In)(prevId ? [...filterList, prevId] : filterList)),
                league: (0, typeorm_2.In)(filteredLeagues),
                server: user.details.server,
            },
            order: { created_at: 'DESC' },
            relations: ['user'],
        });
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.default)),
    __param(3, (0, typeorm_1.InjectRepository)(user_details_entity_1.UserDetails)),
    __param(4, (0, typeorm_1.InjectRepository)(user_register_cache_entity_1.UserRegisterCache)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        jwt_1.JwtService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map