/**
 * PWA 아이콘 자동 생성 스크립트
 *
 * 사용법:
 *   npm install -D sharp
 *   node scripts/generate-icons.mjs
 *
 * 입력: public/icon-source.png (1024x1024 권장)
 * 출력: public/icons/*.png
 */

import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE    = join(__dirname, '../public/icon-source.png');
const OUT_DIR   = join(__dirname, '../public/icons');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

async function main() {
  if (!existsSync(SOURCE)) {
    console.error('❌ public/icon-source.png 파일이 없습니다. 1024x1024 이미지를 준비하세요.');
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });

  for (const size of SIZES) {
    await sharp(SOURCE)
      .resize(size, size)
      .png()
      .toFile(join(OUT_DIR, `icon-${size}.png`));
    console.log(`✅ icon-${size}.png 생성`);
  }

  // maskable 아이콘 (배경 포함 — 안전 영역 80% 적용)
  const maskableSize = 512;
  const innerSize    = Math.round(maskableSize * 0.8);
  const padding      = Math.round((maskableSize - innerSize) / 2);

  await sharp({
    create: {
      width: maskableSize, height: maskableSize,
      channels: 4,
      background: { r: 201, g: 168, b: 76, alpha: 1 }, // beige-500
    },
  })
    .composite([{
      input: await sharp(SOURCE).resize(innerSize, innerSize).png().toBuffer(),
      top: padding, left: padding,
    }])
    .png()
    .toFile(join(OUT_DIR, 'icon-512-maskable.png'));

  console.log('✅ icon-512-maskable.png 생성 (maskable)');
  console.log('\n🎉 모든 아이콘 생성 완료!');
}

main().catch(console.error);
