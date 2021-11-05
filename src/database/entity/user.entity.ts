import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';
import { GeneralEntity } from '../entity_inheritance/general';
import * as bcrypt from 'bcrypt';

@Entity('users')
export default class User extends GeneralEntity {
  @Column()
  public username: string;

  @Column()
  public email: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  public password: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  public socket_id: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  public secret?: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  public ip?: string;

  @Column({ nullable: true })
  public img_path?: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  public is_online?: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
}
