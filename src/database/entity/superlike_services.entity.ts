import { SuperLikeServiceType } from 'src/app/enum/superlike_services';
import { Column, Entity } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';

@Entity('superlike_services')
export class SuperLikeServices extends GeneralEntity {
  @Column({ nullable: false, type: 'enum', enum: SuperLikeServiceType }) type: SuperLikeServiceType;
  @Column({ nullable: false, type: 'decimal' }) full_price: number;
  @Column({ nullable: false, type: 'decimal' }) price: number;
  @Column({ nullable: true, type: 'smallint' }) percent: number | null;
  @Column({ nullable: false, type: 'int' }) amount: number;
}
