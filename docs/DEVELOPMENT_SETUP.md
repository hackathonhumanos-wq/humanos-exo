# FOCUSFLOW — Local Development Setup (Windows 11 & PowerShell)

This guide provides step-by-step instructions for developers running Windows 11, Cursor AI, and PowerShell.

---

## 1. Prerequisites

- **Node.js**: v20 or v22 LTS
- **npm**: v10+ (npm workspaces enabled)
- **Git**: Installed and configured in PowerShell
- **Google Chrome**: For running the web application and testing the Manifest V3 extension

---

## 2. Installation & Workspace Setup

Open PowerShell in the project root:

```powershell
# 1. Clone repository (if not already cloned)
git clone https://github.com/your-org/focusflow.git
cd focusflow

# 2. Install monorepo dependencies
npm install

# 3. Copy environment files
Copy-Item .env.example .env
Copy-Item apps/api/.env.example apps/api/.env
```

---

## 3. Running Applications

```powershell
# Start unified full-stack development server (Port 3000)
npm run dev

# Start frontend web app independently
npm run dev:web

# Start backend Express API independently (Port 4000)
npm run dev:api

# Compile Chrome Extension
npm run build:extension
```

---

## 4. Loading the Chrome Extension in Google Chrome

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** toggle in the top-right corner.
3. Click **Load unpacked**.
4. Select the `apps/extension` directory.
5. The **FOCUSFLOW** icon will appear in your Chrome toolbar.
