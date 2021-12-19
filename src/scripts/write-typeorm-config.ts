import fs = require('fs');
import { ConfigService } from 'src/config.service';

fs.writeFileSync(
  'ormconfig.json',
  JSON.stringify(ConfigService.instance, null, 2), // last parameter can be changed based on how you want the file indented
);
