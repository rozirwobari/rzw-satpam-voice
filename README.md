# RZW Discord Voice BOT

Bot Discord berbasis Node.js yang memiliki fitur:

- Join voice channel menggunakan slash command
- Tracking playtime user selama bot berada di voice channel
- Rekap playtime realtime
- Embed leaderboard playtime
- Ephemeral response
- Support deploy Railway

---

# Features

✅ Slash Command<br>
✅ Voice Channel Join<br>
✅ Voice Activity Tracking<br>
✅ Playtime Leaderboard<br>
✅ Ephemeral Message<br>
✅ Railway Ready<br>
✅ Discord.js v14

---

# Commands

| Command | Description |
|---|---|
| `/rzw_join` | Suruh Satpam Jaga Voice |
| `/rzw_playtime` | Minta Rekapan User Voice |

---

# Tech Stack

- Node.js
- Discord.js v14
- @discordjs/voice

---

# Installation

## Clone Repository

```bash
git clone https://github.com/rozirwobari/rzw-satpam-voice
cd rzw-satpam-voice
```

---

## Install Dependency

```bash
npm install
```

---

# Environment Variables

Duplikat file `.env.example` dan ubah namanya menjadi `.env`

```env
TOKEN=YOUR_DISCORD_BOT_TOKEN
CLIENT_ID=YOUR_DISCORD_CLIENT_ID
```

---

# Run Bot

```bash
node src/index.js
```

---

# Discord Developer Portal Setup

Buka:

https://discord.com/developers/applications

## Aktifkan Intent

Masuk ke:

```text
Bot → Privileged Gateway Intents
```

Aktifkan:
- Message Content Intent (optional)
- Server Members Intent (optional)

---

# Invite Bot

Pada menu:

```text
OAuth2 → URL Generator
```

Checklist:
- bot
- applications.commands

Permission:
- Administrator

---

# Deploy to Railway

1. Push project ke GitHub
2. Login Railway
3. Deploy from GitHub Repo
4. Tambahkan Environment Variables:
   - TOKEN
   - CLIENT_ID

Railway akan otomatis menjalankan:

```bash
npm start
```

---

# Project Structure

```text
src/
 └── index.js
.env.example
package.json
README.md
```

---

# Example Playtime Result

```text
1. @UserA = 1 Jam 20 Menit 10 Detik
2. @UserB = 0 Jam 45 Menit 12 Detik
3. @UserC = 0 Jam 10 Menit 5 Detik
```

---

# Notes

- Playtime hanya tersimpan di RAM
- Data akan reset jika:
  - Bot Restart
  - Server Shutdown/Restart
  - Bot Leave Voice Channel