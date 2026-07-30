# ✅ Installation Verification Checklist

Gunakan checklist ini untuk memastikan bot terinstall dengan benar.

## 🔍 Pre-Installation

- [ ] Node.js v18+ installed
  ```bash
  node --version  # Should show v18.x.x or higher
  ```

- [ ] npm is working
  ```bash
  npm --version  # Should show version number
  ```

## 📦 Installation Steps

- [ ] Project directory downloaded/cloned
  ```bash
  cd digiflazz-bot
  pwd  # Should show correct path
  ```

- [ ] Dependencies installed
  ```bash
  npm install
  # Should complete without errors
  ```

- [ ] All packages present
  ```bash
  npm list --depth=0
  # Should show: discord.js, axios, dotenv, nodemon
  ```

## 📁 File Structure Verification

### Source Code Files ✅

- [ ] `/src/index.js` exists (size: 5-6KB)
  ```bash
  ls -lh src/index.js
  ```

- [ ] `/src/config.js` exists (size: 1-2KB)
  ```bash
  ls -lh src/config.js
  ```

- [ ] `/src/utils/parser.js` exists (size: 4-5KB)
  ```bash
  ls -lh src/utils/parser.js
  ```

- [ ] `/src/utils/digiflazz-api.js` exists (size: 6-7KB)
  ```bash
  ls -lh src/utils/digiflazz-api.js
  ```

- [ ] `/src/utils/embed-builder.js` exists (size: 6-7KB)
  ```bash
  ls -lh src/utils/embed-builder.js
  ```

- [ ] `/src/handlers/message-handler.js` exists (size: 8-9KB)
  ```bash
  ls -lh src/handlers/message-handler.js
  ```

- [ ] `/src/handlers/command-handler.js` exists (size: 7-8KB)
  ```bash
  ls -lh src/handlers/command-handler.js
  ```

### Configuration Files ✅

- [ ] `.env.example` exists
  ```bash
  cat .env.example | head -5
  # Should show DISCORD_TOKEN, DIGIFLAZZ_USERNAME, etc
  ```

- [ ] `.gitignore` exists
  ```bash
  grep ".env" .gitignore
  # Should show .env is ignored
  ```

- [ ] `package.json` exists and valid
  ```bash
  cat package.json | grep "digiflazz"
  ```

### Documentation Files ✅

- [ ] README.md exists (size: 7+KB)
- [ ] SETUP_GUIDE.md exists (size: 9+KB)
- [ ] TECHNICAL_DOCS.md exists (size: 17+KB)
- [ ] QUICK_START.md exists (size: 2+KB)
- [ ] TESTING.md exists (size: 13+KB)
- [ ] INDEX.md exists
- [ ] PROJECT_SUMMARY.txt exists
- [ ] INSTALLATION_VERIFICATION.md exists (this file)

## ⚙️ Configuration Verification

### .env Setup ✅

- [ ] .env file exists (should be copied from .env.example)
  ```bash
  ls -l .env
  ```

- [ ] .env has DISCORD_TOKEN
  ```bash
  grep "DISCORD_TOKEN=" .env
  # Should show a value (not placeholder)
  ```

- [ ] .env has DIGIFLAZZ_USERNAME
  ```bash
  grep "DIGIFLAZZ_USERNAME=" .env
  ```

- [ ] .env has DIGIFLAZZ_API_KEY
  ```bash
  grep "DIGIFLAZZ_API_KEY=" .env
  ```

- [ ] .env is in .gitignore (safety check)
  ```bash
  git check-ignore .env
  # Should return .env (meaning it's ignored)
  ```

## 🔧 Code Quality Verification

### Syntax Check ✅

- [ ] All JavaScript files have valid syntax
  ```bash
  node -c src/index.js &&
  node -c src/config.js &&
  node -c src/utils/parser.js &&
  echo "✅ All files valid"
  ```

### No Missing Imports ✅

- [ ] discord.js can be imported
  ```bash
  node -e "require('discord.js'); console.log('✅ discord.js OK')"
  ```

- [ ] axios can be imported
  ```bash
  node -e "require('axios'); console.log('✅ axios OK')"
  ```

- [ ] dotenv can be imported
  ```bash
  node -e "require('dotenv'); console.log('✅ dotenv OK')"
  ```

## 🚀 Pre-Startup Verification

### Environment Check ✅

- [ ] .env file readable
  ```bash
  [ -r .env ] && echo "✅ .env readable" || echo "❌ .env not readable"
  ```

- [ ] All required env vars set
  ```bash
  grep -c "^[A-Z_]*=" .env
  # Should show: 2 or more (minimum: DISCORD_TOKEN, DIGIFLAZZ_USERNAME, DIGIFLAZZ_API_KEY)
  ```

- [ ] No placeholder values
  ```bash
  grep "_here\|_placeholder\|CHANGE_ME" .env
  # Should return nothing (empty)
  ```

### Directory Permissions ✅

- [ ] src/ is readable
  ```bash
  [ -r src ] && echo "✅ src readable" || echo "❌ src not readable"
  ```

- [ ] Can write to current directory (for logs)
  ```bash
  [ -w . ] && echo "✅ Current dir writable" || echo "❌ Not writable"
  ```

## 🧪 Startup Test

### Test 1: Bot Can Start

```bash
timeout 10 npm start 2>&1 | head -20
```

Expected output contains:
```
✅ Konfigurasi valid
🚀 Starting Digiflazz Discord Bot
```

✅ Passes: Bot starts without errors
❌ Fails: Check error message and fix

### Test 2: Check for Required Messages

Bot startup should show:
- [ ] Konfigurasi valid ✅
- [ ] Bot logged in successfully
- [ ] Ready message (READY)

## 🧬 Dependency Verification

- [ ] discord.js v14+
  ```bash
  npm list discord.js | grep "discord.js"
  ```

- [ ] axios installed
  ```bash
  npm list axios | grep "axios"
  ```

- [ ] dotenv installed
  ```bash
  npm list dotenv | grep "dotenv"
  ```

- [ ] nodemon installed (dev)
  ```bash
  npm list nodemon | grep "nodemon"
  ```

## 📋 Final Checklist

All items must be checked ✅ before proceeding to setup:

### Critical Requirements ⚠️

- [ ] Node.js v18+
- [ ] Dependencies installed
- [ ] All source files present
- [ ] .env file configured
- [ ] No syntax errors
- [ ] All required env vars set

### Important Requirements ✅

- [ ] Documentation files present
- [ ] .gitignore configured
- [ ] package.json valid
- [ ] Bot can start

### Nice to Have ✅

- [ ] Permissions correct
- [ ] All tests pass
- [ ] No warnings in startup

## 🎯 Summary

**Installation Status:**

If all critical items ✅:
```
✅ INSTALLATION SUCCESSFUL - Ready for setup!
```

If some critical items ❌:
```
⚠️  INSTALLATION INCOMPLETE - Fix errors before proceeding
```

## 📞 Troubleshooting Installation

### Issue: "npm: command not found"
- Solution: Install Node.js from https://nodejs.org/
- Verify: `npm --version`

### Issue: "Cannot find module 'discord.js'"
- Solution: Run `npm install`
- Verify: `npm list discord.js`

### Issue: ".env not found"
- Solution: Copy .env.example to .env
  ```bash
  cp .env.example .env
  ```

### Issue: "Syntax error in file"
- Solution: Check syntax with `node -c filename.js`
- Fix syntax errors in the file

### Issue: Bot won't start
- Solution: Check console output for error
- Verify all .env variables are set
- Check file permissions

## ✨ Next Steps

After installation verification:

1. ✅ Verify all items above are checked
2. 📖 Read QUICK_START.md
3. 🚀 Proceed to SETUP_GUIDE.md
4. 🤖 Setup Discord bot token
5. 🔑 Add Digiflazz credentials
6. 💻 Run `npm start`
7. ✅ Test bot in Discord

---

**Good luck! If all checks pass, you're ready to go! 🚀**
