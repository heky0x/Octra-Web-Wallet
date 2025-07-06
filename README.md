# Octra Web Wallet

This is UnOfficial Octra Web Wallet.
Octra Web Wallet is an open-source web interface that allows users to easily and securely interact with the **Octra blockchain** directly from their browser.

---

## 🚀 Key Features

- 🔐 Import wallet using **Private Key** or **Mnemonic Phrase**
- 💰 View real-time balance from any Octra address
- 📤 Send native Octra coin transactions with optional messages (up to 1KB)
- 📄 Transaction history display with message support
- ⚙️ Direct connection to Octra RPC (`https://octra.network`)
- 🖥️ Fully client-side — no backend required
- 🌐 Available as both web app and Chrome extension

---

## 🛠️ Tech Stack

- ⚡ [Vite](https://vitejs.dev/) for blazing-fast bundling
- 💻 Frontend: [React.js](https://reactjs.org/)
- 🔗 Blockchain interaction via JSON-RPC & `fetch`
- 🔒 Secure client-side key management — no keys are stored or transmitted
- 🎨 [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) for modern UI
- 🔐 [TweetNaCl](https://tweetnacl.js.org/) for cryptographic operations

---

## 🧪 Installation & Running Locally

### Web Application

```bash
# Clone the repository
git clone https://github.com/m-tq/Octra-Web-Wallet.git
cd octra-web-wallet

# Install dependencies
npm install

# Start development server
npm run dev
```

### Chrome Extension

```bash
# Install dependencies
npm install

# Build the extension
npm run build:extension

# Or use the automated build script
npm run pack
```

---

## 📦 Building Chrome Extension

### Method 1: Automated Build

```bash
npm run pack
```

This will:
1. Build the project with Vite
2. Copy all necessary extension files
3. Verify the extension structure
4. Provide installation instructions

### Method 2: Manual Build

```bash
# 1. Build the project
npm run build

# 2. Copy extension files
npm run copy-files

# 3. Verify dist folder contains:
# - manifest.json
# - index.html (popup)
# - home.html (expanded view)
# - background.js
# - assets/ folder with CSS and JS
# - icon files (16, 32, 48, 128px)
```

---

## 🔧 Installing the Extension

### Load Unpacked Extension (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **"Load unpacked"**
4. Select the `dist` folder from your project
5. The extension should now appear in your extensions list

### Create .crx File (Distribution)

1. Go to `chrome://extensions/`
2. Click **"Pack extension"**
3. **Extension root directory**: Select the `dist` folder
4. **Private key file**: Leave empty for first time (Chrome will generate one)
5. Click **"Pack Extension"**
6. Chrome will create a `.crx` file and a `.pem` key file

### Install .crx File

1. Drag and drop the `.crx` file into `chrome://extensions/`
2. Click **"Add extension"** when prompted

---

## 📁 Extension Structure

```
dist/
├── manifest.json          # Extension manifest
├── index.html             # Popup interface (400x600px)
├── home.html              # Expanded view (full screen)
├── background.js          # Service worker
├── assets/
│   ├── main.css          # Compiled styles
│   ├── main.js           # Popup app bundle
│   └── expanded.js       # Expanded view bundle
└── icon*.png             # Extension icons (16, 32, 48, 128px)
```

---

## 🔒 Security Features

- **Client-side only**: No data is sent to external servers
- **Secure key storage**: Uses Chrome's storage API with encryption
- **Message validation**: 1KB limit enforced for blockchain messages
- **Transaction signing**: Uses TweetNaCl for secure cryptographic operations
- **Address validation**: Validates Octra addresses before transactions

---

## 🌟 Features

### Wallet Management
- Generate new wallets with 12/24 word mnemonic phrases
- Import existing wallets via private key or mnemonic
- Secure key storage using Chrome extension storage
- Real-time balance updates

### Transaction Features
- Send OCT to single or multiple recipients
- Add optional messages to transactions (up to 1KB)
- Real-time transaction status tracking
- Transaction history with message display
- Multi-send functionality with sequential nonce handling

### User Interface
- Popup interface (400x600px) for quick access
- Expanded view for full functionality
- Dark/light theme support
- Responsive design for all screen sizes
- Toast notifications for user feedback

---

## 🔗 API Integration

The wallet connects directly to the Octra network:
- **RPC Endpoint**: `https://octra.network`
- **Balance API**: `/address/{address}`
- **Transaction API**: `/send-tx`
- **History API**: `/tx/{hash}`
- **Explorer**: `https://octrascan.io`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## ⚠️ Disclaimer

This is an **unofficial** wallet for the Octra blockchain. Always:
- Keep your private keys and mnemonic phrases secure
- Never share your private keys with anyone
- Test with small amounts first
- Backup your wallet information securely

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🔗 Links

- [Octra Network](https://octra.network)
- [Octra Explorer](https://octrascan.io)
- [GitHub Repository](https://github.com/m-tq/Octra-Web-Wallet)