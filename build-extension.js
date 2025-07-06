const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building Octra Wallet Chrome Extension...\n');

// Step 1: Build the project
console.log('📦 Building project with Vite...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 2: Copy extension files
console.log('📋 Copying extension files...');
try {
  execSync('npm run copy-files', { stdio: 'inherit' });
  console.log('✅ Extension files copied\n');
} catch (error) {
  console.error('❌ Failed to copy files:', error.message);
  process.exit(1);
}

// Step 3: Verify required files
console.log('🔍 Verifying extension structure...');
const requiredFiles = [
  'dist/manifest.json',
  'dist/index.html',
  'dist/home.html',
  'dist/background.js',
  'dist/assets/main.css',
  'dist/assets/main.js',
  'dist/assets/expanded.js',
  'dist/icon16.png',
  'dist/icon32.png',
  'dist/icon48.png',
  'dist/icon128.png'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ Missing: ${file}`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.error('\n❌ Some required files are missing. Please check the build process.');
  process.exit(1);
}

console.log('\n🎉 Chrome extension build completed successfully!');
console.log('\n📁 Extension files are in the "dist" folder');
console.log('\n🔧 To install the extension:');
console.log('1. Open Chrome and go to chrome://extensions/');
console.log('2. Enable "Developer mode" (top right toggle)');
console.log('3. Click "Load unpacked" and select the "dist" folder');
console.log('\n📦 To create a .crx file:');
console.log('1. Go to chrome://extensions/');
console.log('2. Click "Pack extension"');
console.log('3. Select the "dist" folder as Extension root directory');
console.log('4. Leave Private key file empty (for first time)');
console.log('5. Click "Pack Extension"');