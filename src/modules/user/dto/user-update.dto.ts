import { IsNotEmpty } from 'class-validator';
import { LolMainLane } from 'src/app/enum/lol_main_lane.enum';
import { LolChampions } from 'src/app/enum/lol_champions.enum';

export class UserProfileUpdateDto {
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsNotEmpty({ message: 'Main lane is required' })
  main_lane: LolMainLane;

  @IsNotEmpty({ message: 'Main champion is required' })
  main_champions: Array<LolChampions>;

  discord_name: string;
}
