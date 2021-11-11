import User from 'src/database/entity/user.entity';

export interface UserResponse extends User {
  full_image_path?: string;
}
