const fs = require('fs');
const path = require('path');

// Crear una imagen PNG simple de 1x1 pixel azul
const createSimplePNG = (width, height, color = [74, 144, 226, 255]) => {
  const png = require('pngjs').PNG;
  const image = new png({ width, height });
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      image.data[idx] = color[0];     // R
      image.data[idx + 1] = color[1]; // G
      image.data[idx + 2] = color[2]; // B
      image.data[idx + 3] = color[3]; // A
    }
  }
  
  return png.sync.write(image);
};

// Instalar pngjs si no está disponible
try {
  require('pngjs');
} catch (e) {
  console.log('Instalando pngjs...');
  require('child_process').execSync('npm install pngjs', { stdio: 'inherit' });
}

const assetsDir = path.join(__dirname, 'assets');

// Crear imágenes necesarias
const assets = [
  { name: 'icon.png', width: 1024, height: 1024 },
  { name: 'adaptive-icon.png', width: 1024, height: 1024 },
  { name: 'splash.png', width: 1284, height: 2778 },
  { name: 'favicon.png', width: 48, height: 48 },
  { name: 'notification-icon.png', width: 96, height: 96 }
];

console.log('Creando assets...');
assets.forEach(asset => {
  const buffer = createSimplePNG(asset.width, asset.height);
  const filePath = path.join(assetsDir, asset.name);
  fs.writeFileSync(filePath, buffer);
  console.log(`✓ Creado: ${asset.name} (${asset.width}x${asset.height})`);
});

console.log('¡Todos los assets han sido creados!');
