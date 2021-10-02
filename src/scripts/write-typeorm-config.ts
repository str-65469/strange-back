import fs = require('fs');
import { configService } from '../config.service';

fs.writeFileSync(
  'ormconfig.json',
  JSON.stringify(configService.getTypeOrmConfig(), null, 2), // last parameter can be changed based on how you want the file indented
);
