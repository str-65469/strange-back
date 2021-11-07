import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';
import * as bcrypt from 'bcrypt';

@Entity('users')
export default class User extends GeneralEntity {
  @Column() username: string;
  @Column() email: string;
  @Column() password: string;
  @Column() socket_id: string;
  @Column({ nullable: true }) secret?: string;
  @Column({ nullable: true }) ip?: string;
  @Column({ nullable: true }) img_path?: string;
  @Column({ nullable: true }) is_online?: boolean;

  //! relations

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
}
