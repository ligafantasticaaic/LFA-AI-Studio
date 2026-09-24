import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SVG_CONTENT = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <!-- Gradiente General de Vino a Naranja Cálido -->
    <linearGradient id="lfaMainGrad" x1="0.85" y1="0.15" x2="0.15" y2="0.85">
      <stop offset="0%" stop-color="#5B1535" />
      <stop offset="25%" stop-color="#8C1F4D" />
      <stop offset="50%" stop-color="#BA2960" />
      <stop offset="72%" stop-color="#D74052" />
      <stop offset="88%" stop-color="#E56944" />
      <stop offset="100%" stop-color="#EA8044" />
    </linearGradient>

    <!-- Gradiente para el brazo / espalda superior -->
    <linearGradient id="armSwoopGrad" x1="0.1" y1="0.4" x2="0.9" y2="0.4">
      <stop offset="0%" stop-color="#D74052" />
      <stop offset="35%" stop-color="#B2285D" />
      <stop offset="70%" stop-color="#7B1B44" />
      <stop offset="100%" stop-color="#551331" />
    </linearGradient>

    <!-- Gradiente para pierna de chut -->
    <linearGradient id="kickLegGrad" x1="0.9" y1="0.2" x2="0.1" y2="0.8">
      <stop offset="0%" stop-color="#C42E57" />
      <stop offset="30%" stop-color="#D84252" />
      <stop offset="70%" stop-color="#E56A44" />
      <stop offset="100%" stop-color="#EA8044" />
    </linearGradient>

    <!-- Gradiente para cabeza y velocidad -->
    <linearGradient id="headSwoopGrad" x1="0.2" y1="0.2" x2="0.9" y2="0.5">
      <stop offset="0%" stop-color="#E2594B" />
      <stop offset="50%" stop-color="#CF3A53" />
      <stop offset="100%" stop-color="#9C2253" />
    </linearGradient>

    <!-- Gradiente para espiral de apoyo inferior -->
    <linearGradient id="supportCurlGrad" x1="0.2" y1="0.2" x2="0.8" y2="0.8">
      <stop offset="0%" stop-color="#C22C58" />
      <stop offset="40%" stop-color="#B4275E" />
      <stop offset="80%" stop-color="#841D49" />
      <stop offset="100%" stop-color="#581434" />
    </linearGradient>
  </defs>

  <!-- 1. TEXTO SUPERIOR: L F A -->
  <g font-family="Plus Jakarta Sans, Cabinet Grotesk, -apple-system, sans-serif" font-weight="900" font-size="124" text-anchor="middle">
    <!-- L -->
    <text transform="translate(355, 162) rotate(-28)" fill="#A8235F">L</text>
    <!-- F -->
    <text transform="translate(528, 126) rotate(-2)" fill="#D24756">F</text>
    <!-- A -->
    <text transform="translate(684, 156) rotate(26)" fill="#E98048">A</text>
  </g>

  <!-- 2. BALÓN DE FÚTBOL -->
  <!-- Balón naranja a la izquierda -->
  <circle cx="242" cy="458" r="54" fill="#EA8044" />

  <!-- 3. JUGADOR DE FÚTBOL (TRAZOS ESTILIZADOS) -->
  <!-- Cabeza dinámica en pincelada ovalada inclinada -->
  <path d="M 470,224 C 440,242 422,285 464,306 C 506,316 542,292 562,252 C 572,228 540,208 470,224 Z" fill="url(#headSwoopGrad)" />
  
  <!-- Trazos de velocidad de la cabeza hacia la derecha -->
  <path d="M 498,214 C 535,211 578,214 606,218 C 585,227 552,231 506,229 Z" fill="url(#headSwoopGrad)" />
  <path d="M 512,246 C 555,248 592,258 622,272 C 596,280 562,277 520,267 Z" fill="url(#headSwoopGrad)" />

  <!-- Brazo / Espalda superior que se extiende hacia la derecha en punta afilada -->
  <path d="M 410,360 C 470,320 565,305 675,335 C 758,360 815,410 832,476 C 800,432 732,376 642,366 C 562,356 480,392 410,432 C 375,452 350,456 330,446 C 330,425 365,390 410,360 Z" fill="url(#armSwoopGrad)" />

  <!-- Pierna de chut extendida hacia adelante/abajo buscando el balón -->
  <path d="M 425,446 C 380,442 335,466 295,506 C 242,556 210,616 202,624 C 206,625 220,618 242,610 C 278,595 338,600 382,630 C 412,650 436,630 446,605 C 442,560 416,500 425,446 Z" fill="url(#kickLegGrad)" />

  <!-- Acento inferior de velocidad de la bota de chut -->
  <path d="M 212,604 C 266,540 338,490 418,465 C 372,490 322,536 272,596 C 246,622 220,626 200,622 C 204,614 207,609 212,604 Z" fill="#EE8848" />

  <!-- Conexión central del torso / cadera -->
  <path d="M 452,420 C 512,410 542,460 542,520 C 532,580 482,620 442,600 C 432,550 436,470 452,420 Z" fill="url(#lfaMainGrad)" />

  <!-- Pierna de apoyo curvada en espiral dinámica (bucle inferior) -->
  <path d="M 545,520 C 560,600 550,670 515,725 C 480,775 515,795 560,785 C 625,765 675,705 695,640 C 700,620 670,640 650,670 C 620,710 580,740 545,730 C 520,720 535,660 550,600 C 560,560 555,535 545,520 Z" fill="url(#supportCurlGrad)" />

  <!-- Doble aleta de velocidad tras el bucle inferior -->
  <path d="M 646,670 C 692,625 738,620 762,625 C 732,645 682,680 646,715 Z" fill="#95204F" />
  <path d="M 592,740 C 652,735 712,710 760,688 C 722,725 662,765 592,770 Z" fill="#66173B" />

  <!-- 4. TEXTO INFERIOR: DESDE 2010 -->
  <g font-family="Plus Jakarta Sans, Cabinet Grotesk, -apple-system, sans-serif" font-weight="900" font-size="108" text-anchor="middle">
    <!-- D -->
    <text transform="translate(98, 622) rotate(58)" fill="#8E1F55">D</text>
    <!-- E -->
    <text transform="translate(154, 716) rotate(44)" fill="#A3265D">E</text>
    <!-- S -->
    <text transform="translate(230, 806) rotate(30)" fill="#B82B61">S</text>
    <!-- D -->
    <text transform="translate(332, 876) rotate(14)" fill="#C63558">D</text>
    <!-- E -->
    <text transform="translate(452, 916) rotate(0)" fill="#D44455">E</text>

    <!-- 2 -->
    <text transform="translate(686, 886) rotate(-24)" fill="#DD5E49">2</text>
    <!-- 0 -->
    <text transform="translate(792, 816) rotate(-38)" fill="#E47043">0</text>
    <!-- 1 -->
    <text transform="translate(866, 726) rotate(-52)" fill="#E98044">1</text>
    <!-- 0 -->
    <text transform="translate(926, 626) rotate(-66)" fill="#EE8E47">0</text>
  </g>
</svg>
`;

async function main() {
  const root = process.cwd();
  const svgBuffer = Buffer.from(SVG_CONTENT.trim());

  // 1. Guardar SVG en public/logo.svg
  fs.writeFileSync(path.join(root, 'public/logo.svg'), svgBuffer);

  // 2. Renderizar a resoluciones estándar con fondo transparente
  const pwa192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
  const pwa512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();
  const logo1024 = await sharp(svgBuffer).resize(1024, 1024).png().toBuffer();

  // Escribir en public
  fs.writeFileSync(path.join(root, 'public/logo.png'), pwa512);
  fs.writeFileSync(path.join(root, 'public/icon.png'), pwa512);
  fs.writeFileSync(path.join(root, 'public/pwa-192.png'), pwa192);
  fs.writeFileSync(path.join(root, 'public/pwa-512.png'), pwa512);
  fs.writeFileSync(path.join(root, 'public/test_trans.png'), logo1024);

  // Escribir en src/assets/images
  fs.writeFileSync(path.join(root, 'src/assets/images/LOGO_Nuevo_LFA.png'), pwa512);

  // Si existe dist, escribir en dist también
  const distDir = path.join(root, 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'logo.png'), pwa512);
    fs.writeFileSync(path.join(distDir, 'icon.png'), pwa512);
    fs.writeFileSync(path.join(distDir, 'pwa-192.png'), pwa192);
    fs.writeFileSync(path.join(distDir, 'pwa-512.png'), pwa512);
    fs.writeFileSync(path.join(distDir, 'test_trans.png'), logo1024);
  }

  console.log('✅ Todos los logos e iconos generados y actualizados con éxito.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
