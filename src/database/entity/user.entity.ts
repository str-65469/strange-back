import { SuperLikePayment } from './superlike_payment.entity';
import { MatchingSpams } from 'src/database/entity/matching_spams.entity';
import { MatchingLobby } from 'src/database/entity/matching_lobby.entity';
import { MatchedDuos } from 'src/database/entity/matched_duos.entity';
import { MatchedDuosNotifications } from 'src/database/entity/matched_duos_notifications.entity';
import { AfterLoad, Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';
import { UserBelongings } from './user_belongings.entity';
import { UserDetails } from './user_details.entity';
import { Exclude } from 'class-transformer';
import { FileHelper } from 'src/app/utils/file_helper';

@Entity('users')
export default class User extends GeneralEntity {
  public static TABLE_NAME = 'users';
  public static IMAGE_COLUMN_NAME = 'img_path';

  @Column({ unique: true }) username: string;
  @Column() email: string;
  @Column({ nullable: true, type: 'text' }) img_path?: string;

  @Column({ select: false })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  socket_id: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  secret?: string;

  @Column({ nullable: true, select: false })
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

  @OneToMany(() => SuperLikePayment, (likes) => likes.user)
  superLikePayments: SuperLikePayment[];

  @OneToOne(() => UserBelongings, (belongings) => belongings.user)
  belongings: UserBelongings;

  @OneToOne(() => MatchingSpams, (spams) => spams.user)
  spams: MatchingSpams;

  @OneToOne(() => UserDetails, (details) => details.user)
  details: UserDetails;

  full_image_path?: string;

  @AfterLoad()
  setFullImagePath() {
    this.full_image_path = FileHelper.imagePath(this.img_path);
  }
}
