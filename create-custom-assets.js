const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

// Colores para la app de fitness
const COLORS = {
  primary: [74, 144, 226, 255],      // Azul vibrante
  secondary: [45, 185, 140, 255],    // Verde fitness
  dark: [30, 40, 60, 255],           // Azul oscuro
  white: [255, 255, 255, 255],
  transparent: [0, 0, 0, 0]
};

// Función para crear PNG
const createPNG = (width, height) => {
  return new PNG({ width, height });
};

// Función para establecer pixel
const setPixel = (png, x, y, color) => {
  if (x < 0 || x >= png.width || y < 0 || y >= png.height) return;
  const idx = (png.width * y + x) << 2;
  png.data[idx] = color[0];
  png.data[idx + 1] = color[1];
  png.data[idx + 2] = color[2];
  png.data[idx + 3] = color[3];
};

// Función para llenar un círculo
const fillCircle = (png, cx, cy, radius, color) => {
  for (let y = Math.max(0, cy - radius); y < Math.min(png.height, cy + radius); y++) {
    for (let x = Math.max(0, cx - radius); x < Math.min(png.width, cx + radius); x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= radius * radius) {
        setPixel(png, x, y, color);
      }
    }
  }
};

// Función para llenar un rectángulo
const fillRect = (png, x1, y1, x2, y2, color) => {
  for (let y = Math.max(0, y1); y < Math.min(png.height, y2); y++) {
    for (let x = Math.max(0, x1); x < Math.min(png.width, x2); x++) {
      setPixel(png, x, y, color);
    }
  }
};

// Función para crear un rectángulo redondeado
const fillRoundedRect = (png, x1, y1, x2, y2, radius, color) => {
  // Rectángulo central
  fillRect(png, x1 + radius, y1, x2 - radius, y2, color);
  fillRect(png, x1, y1 + radius, x1 + radius, y2 - radius, color);
  fillRect(png, x2 - radius, y1 + radius, x2, y2 - radius, color);
  
  // Esquinas redondeadas
  fillCircle(png, x1 + radius, y1 + radius, radius, color);
  fillCircle(png, x2 - radius, y1 + radius, radius, color);
  fillCircle(png, x1 + radius, y2 - radius, radius, color);
  fillCircle(png, x2 - radius, y2 - radius, radius, color);
};

// Dibujar icono de pesas (dumbbell)
const drawDumbbell = (png, centerX, centerY, size, color) => {
  const barWidth = size * 0.5;
  const barHeight = size * 0.12;
  const weightSize = size * 0.25;
  
  // Barra central
  fillRect(
    png,
    Math.round(centerX - barWidth / 2),
    Math.round(centerY - barHeight / 2),
    Math.round(centerX + barWidth / 2),
    Math.round(centerY + barHeight / 2),
    color
  );
  
  // Pesas izquierda
  fillRoundedRect(
    png,
    Math.round(centerX - barWidth / 2 - weightSize),
    Math.round(centerY - weightSize),
    Math.round(centerX - barWidth / 2 + weightSize * 0.3),
    Math.round(centerY + weightSize),
    Math.round(weightSize * 0.3),
    color
  );
  
  // Pesas derecha
  fillRoundedRect(
    png,
    Math.round(centerX + barWidth / 2 - weightSize * 0.3),
    Math.round(centerY - weightSize),
    Math.round(centerX + barWidth / 2 + weightSize),
    Math.round(centerY + weightSize),
    Math.round(weightSize * 0.3),
    color
  );
};

// Crear icono principal (1024x1024)
const createIcon = () => {
  const png = createPNG(1024, 1024);
  const centerX = 512;
  const centerY = 512;
  
  // Fondo con gradiente (aproximado con círculos)
  for (let i = 0; i < 512; i += 20) {
    const progress = i / 512;
    const color = [
      Math.round(COLORS.primary[0] * (1 - progress) + COLORS.secondary[0] * progress),
      Math.round(COLORS.primary[1] * (1 - progress) + COLORS.secondary[1] * progress),
      Math.round(COLORS.primary[2] * (1 - progress) + COLORS.secondary[2] * progress),
      255
    ];
    fillCircle(png, centerX, centerY, 512 - i, color);
  }
  
  // Dibujar pesas
  drawDumbbell(png, centerX, centerY, 400, COLORS.white);
  
  return PNG.sync.write(png);
};

// Crear adaptive icon (1024x1024)
const createAdaptiveIcon = () => {
  const png = createPNG(1024, 1024);
  const centerX = 512;
  const centerY = 512;
  
  // Fondo circular con gradiente
  for (let i = 0; i < 512; i += 20) {
    const progress = i / 512;
    const color = [
      Math.round(COLORS.primary[0] * (1 - progress) + COLORS.secondary[0] * progress),
      Math.round(COLORS.primary[1] * (1 - progress) + COLORS.secondary[1] * progress),
      Math.round(COLORS.primary[2] * (1 - progress) + COLORS.secondary[2] * progress),
      255
    ];
    fillCircle(png, centerX, centerY, 512 - i, color);
  }
  
  // Dibujar pesas más grande para adaptive icon
  drawDumbbell(png, centerX, centerY, 450, COLORS.white);
  
  return PNG.sync.write(png);
};

// Crear splash screen (1284x2778)
const createSplash = () => {
  const png = createPNG(1284, 2778);
  const centerX = 642;
  const centerY = 1389;
  
  // Fondo degradado vertical
  for (let y = 0; y < png.height; y++) {
    const progress = y / png.height;
    const color = [
      Math.round(COLORS.dark[0] * (1 - progress) + COLORS.primary[0] * progress),
      Math.round(COLORS.dark[1] * (1 - progress) + COLORS.primary[1] * progress),
      Math.round(COLORS.dark[2] * (1 - progress) + COLORS.primary[2] * progress),
      255
    ];
    fillRect(png, 0, y, png.width, y + 1, color);
  }
  
  // Círculo de fondo para el icono
  fillCircle(png, centerX, centerY - 200, 280, [...COLORS.white.slice(0, 3), 30]);
  
  // Dibujar pesas en el centro
  drawDumbbell(png, centerX, centerY - 200, 350, COLORS.white);
  
  // Texto "SPLITS" (aproximado con rectángulos)
  const textY = centerY + 250;
  const letterSpacing = 80;
  const letterWidth = 50;
  const letterHeight = 120;
  
  // S
  fillRoundedRect(png, centerX - 250, textY, centerX - 200, textY + letterHeight / 3, 10, COLORS.white);
  fillRoundedRect(png, centerX - 250, textY + letterHeight / 3, centerX - 200, textY + 2 * letterHeight / 3, 10, COLORS.white);
  fillRoundedRect(png, centerX - 250, textY + 2 * letterHeight / 3, centerX - 200, textY + letterHeight, 10, COLORS.white);
  
  return PNG.sync.write(png);
};

// Crear favicon (48x48)
const createFavicon = () => {
  const png = createPNG(48, 48);
  
  // Fondo
  fillCircle(png, 24, 24, 24, COLORS.primary);
  
  // Pesas pequeñas
  drawDumbbell(png, 24, 24, 28, COLORS.white);
  
  return PNG.sync.write(png);
};

// Crear notification icon (96x96)
const createNotificationIcon = () => {
  const png = createPNG(96, 96);
  
  // Fondo transparente
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      setPixel(png, x, y, COLORS.transparent);
    }
  }
  
  // Pesas blancas sobre transparente (para notificaciones)
  drawDumbbell(png, 48, 48, 60, COLORS.white);
  
  return PNG.sync.write(png);
};

// Crear todos los assets
const assetsDir = path.join(__dirname, 'assets');

console.log('🎨 Creando assets personalizados para Splits Fitness & Nutrition...\n');

const assets = [
  { name: 'icon.png', creator: createIcon },
  { name: 'adaptive-icon.png', creator: createAdaptiveIcon },
  { name: 'splash.png', creator: createSplash },
  { name: 'favicon.png', creator: createFavicon },
  { name: 'notification-icon.png', creator: createNotificationIcon }
];

assets.forEach(asset => {
  console.log(`⚙️  Generando ${asset.name}...`);
  const buffer = asset.creator();
  const filePath = path.join(assetsDir, asset.name);
  fs.writeFileSync(filePath, buffer);
  const sizeKB = (buffer.length / 1024).toFixed(2);
  console.log(`✅ Creado: ${asset.name} (${sizeKB} KB)\n`);
});

console.log('🎉 ¡Todos los assets personalizados han sido creados exitosamente!');
console.log('💪 Los iconos incluyen un diseño de pesas para tu app de fitness.');
