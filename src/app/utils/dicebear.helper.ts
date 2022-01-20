import { createAvatar, StyleOptions } from '@dicebear/avatars';
import * as GridyStyle from '@dicebear/avatars-gridy-sprites';
import * as BottsStyle from '@dicebear/avatars-bottts-sprites';
import { configs } from 'src/configs/config';

type DiceBearOptions = BottsStyle.Options | GridyStyle.Options;

function generateSprite(options: StyleOptions<DiceBearOptions>): string {
    const AvatarStyle = Math.round(Math.random()) % 2 === 0 ? GridyStyle : BottsStyle;
    const svg = createAvatar(AvatarStyle, options);

    // final
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function generateRandomSprite(): string {
    return generateSprite({
        seed: Math.random() + 'random sprite svg',
        size: configs.general.DICEBEAR_MAX_SIZE,
    });
}

export function generateCompressedSprite(benchmark: boolean = false): string | number {
    let sprite = generateRandomSprite();
    let buffer = Buffer.from(sprite);
    let tried = 0;
    let size = buffer.length;

    while (!(size > configs.general.DICEBEAR_MIN_SIZE && size < configs.general.DICEBEAR_MAX_SIZE)) {
        sprite = generateRandomSprite();
        buffer = Buffer.from(sprite);
        size = buffer.length;
        tried++;
    }

    if (benchmark) {
        return tried;
    }

    return sprite;
}

// if needed you can try benchmark
// function runBenchmark() {
//   for (let i = 0; i < 10000; i++) {
//     const tried = generateCompressedSprite(true);

//     if (tried > 20) {
//       console.log(`=====================`);
//       console.log(`tried more than 20 ${tried}`);
//       console.log(`=====================`);
//     }
//   }
// }
// runBenchmark();
