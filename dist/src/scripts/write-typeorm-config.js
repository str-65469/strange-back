"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const typeorm_1 = require("../configs/typeorm");
fs.writeFileSync('ormconfig.json', JSON.stringify(typeorm_1.TypeormConfig.instance, null, 2));
//# sourceMappingURL=write-typeorm-config.js.map