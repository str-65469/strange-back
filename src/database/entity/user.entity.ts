import { SuperLikePayment } from './superlike_payment.entity';
import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { MatchingLobby } from 'src/database/entity/matching_lobby.entity';
import { MatchedDuos } from 'src/database/entity/matched_duos.entity';
import { MatchedDuosNotifications } from 'src/database/entity/matched_duos_notifications.entity';
import { BeforeInsert, Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';
import UserBelongings from './user_belongings.entity';
import { UserDetails } from './user_details.entity';
import { genSalt, hash } from 'bcrypt';
import { Exclude } from 'class-transformer';

@Entity('users')
export default class User extends GeneralEntity {
  @Column() username: string;
  @Column() email: string;
  @Column({ nullable: true }) img_path?: string;
  @Column({ select: false }) password: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  socket_id: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  secret?: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  ip?: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  is_online?: boolean;

  @OneToMany(() => MatchedDuosNotifications, (notifications) => notifications.user)
  notificationUsers: MatchedDuosNotifications[];

  @OneToMany(() => MatchedDuosNotifications, (notifications) => notifications.matchedUser)
  notificationMatchedUsers: MatchedDuosNotifications[];

  @OneToMany(() => MatchedDuos, (matched) => matched.user)
  matchedDuoUsers: MatchedDuos[];

  @OneToMany(() => MatchedDuos, (matched) => matched.matchedUser)
  matchedDuoMatchedUsers: MatchedDuos[];

  @OneToMany(() => MatchingLobby, (lobby) => lobby.user)
  lobbyUsers: MatchingLobby[];

  @OneToMany(() => MatchingLobby, (lobby) => lobby.likedUser)
  lobbyLikedUsers: MatchingLobby[];

  @OneToMany(() => MatchingSpams, (spams) => spams.user)
  spams: MatchingSpams[];

  @OneToMany(() => SuperLikePayment, (likes) => likes.user)
  superLikePayments: SuperLikePayment[];

  @OneToMany(() => UserBelongings, (belongings) => belongings.user)
  belongings: UserBelongings[];

  @OneToOne(() => UserDetails, (details) => details.user)
  details: UserDetails;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const salt = await genSalt(12);
    this.password = await hash(this.password, salt);
  }
}
