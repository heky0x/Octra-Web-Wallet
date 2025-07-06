import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

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

// Step 4: Verify manifest.json content
console.log('\n🔍 Verifying manifest.json...');
try {
  const manifestPath = 'dist/manifest.json';
  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestContent);
  
  console.log(`✅ Extension name: ${manifest.name}`);
  console.log(`✅ Version: ${manifest.version}`);
  console.log(`✅ Manifest version: ${manifest.manifest_version}`);
  
  // Check required permissions
  const requiredPermissions = ['storage', 'activeTab', 'tabs'];
  const hasAllPermissions = requiredPermissions.every(perm => 
    manifest.permissions && manifest.permissions.includes(perm)
  );
  
  if (hasAllPermissions) {
    console.log('✅ All required permissions present');
  } else {
    console.log('⚠️  Some permissions may be missing');
  }
  
} catch (error) {
  console.error('❌ Failed to verify manifest.json:', error.message);
}

// Step 5: Calculate extension size
console.log('\n📊 Extension size analysis...');
try {
  const getDirectorySize = (dirPath) => {
    let totalSize = 0;
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        totalSize += getDirectorySize(filePath);
      } else {
        totalSize += fs.statSync(filePath).size;
      }
    }
    return totalSize;
  };
  
  const totalSize = getDirectorySize('dist');
  const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  
  console.log(`📦 Total extension size: ${sizeMB} MB`);
  
  if (totalSize > 10 * 1024 * 1024) { // 10MB limit for Chrome extensions
    console.log('⚠️  Warning: Extension size exceeds 10MB limit');
  } else {
    console.log('✅ Extension size is within Chrome limits');
  }
  
} catch (error) {
  console.error('❌ Failed to calculate extension size:', error.message);
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

console.log('\n🌟 Features included:');
console.log('• Popup interface (400x600px)');
console.log('• Expanded view (full screen)');
console.log('• Multi-send with message support');
console.log('• Transaction history with messages');
console.log('• Dark/light theme toggle');
console.log('• Secure key storage');
console.log('• Message validation (1KB limit)');