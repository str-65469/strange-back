import fs = require('fs');
import { TypeormConfig } from 'src/configs/typeorm';

fs.writeFileSync(
  'ormconfig.json',
  JSON.stringify(TypeormConfig.instance, null, 2), // last parameter can be changed based on how you want the file indented
);
