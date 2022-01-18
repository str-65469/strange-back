import { LolLeague } from 'src/app/common/enum/lol_league.enum';
import { Column, Entity, Generated } from 'typeorm';
import { LolServer } from '../../app/common/enum/lol_server.enum';
import { GeneralEntity } from '../entity_inheritance/general';

@Entity('user_register_cache')
export class UserRegisterCache extends GeneralEntity {
    @Column({ unique: true, nullable: true }) username: string;
    @Column({ unique: true, nullable: true }) email: string;

    @Column({ nullable: true }) password: string;
    @Column({ nullable: true }) secret_token?: string;
    @Column({ nullable: true, type: 'enum', enum: LolServer }) server?: LolServer;
    @Column({ nullable: true, type: 'timestamptz' }) expiry_date?: Date;

    // for more validation
    @Column({ nullable: false, type: 'int' }) profile_icon_id: number;
    @Column({ nullable: false, type: 'timestamptz' }) timestamp_now: Date;
    @Column({ nullable: false, type: 'timestamptz' }) timestamp_end: Date;
    @Column({ nullable: false }) is_valid: boolean;
    @Column({ nullable: false }) @Generated('uuid') uuid: string;

    @Column({ nullable: true }) level?: number;
    @Column({ nullable: true }) league_number?: number;
    @Column({ nullable: true }) league_points?: number;
    @Column({ nullable: true }) summoner_name?: string;
    @Column({ nullable: true, type: 'float8' }) win_rate?: number;
    @Column({ nullable: true, type: 'enum', enum: LolLeague }) league?: LolLeague;
}
