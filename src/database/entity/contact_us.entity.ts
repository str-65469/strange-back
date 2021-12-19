import { ContactUseMessageTypes } from '../../app/common/enum/contact_us_message_type.enum';
import { Column, Entity } from 'typeorm';
import { GeneralEntity } from '../entity_inheritance/general';

@Entity('contact_us')
export class ContactUs extends GeneralEntity {
  @Column() name: string;
  @Column() email: string;
  @Column({ type: 'text', nullable: true }) message?: string;
  @Column({ type: 'enum', enum: ContactUseMessageTypes }) message_type: ContactUseMessageTypes;
}
