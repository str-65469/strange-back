import User from 'src/database/entity/user.entity';

export interface UserTemp extends User {
  full_image_path?: string;
}
