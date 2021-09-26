import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Another {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usernamexxx: string;

  @Column()
  username1: string;
  @Column()
  username2: string;
  @Column()
  username3: string;
  @Column()
  username4: string;
  @Column()
  username5: string;
  @Column()
  username6: string;
}
