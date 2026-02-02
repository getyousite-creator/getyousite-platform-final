#!/bin/bash

# SOVEREIGN VITALITY PROTOCOL
# Keep-Alive Script for getyousite-platform on Hostinger
# -----------------------------------------------------

# 1. Define Environment
export HOME="/home/u110877386"
export NVM_DIR="$HOME/.nvm"
export PATH="$HOME/.nvm/versions/node/v20.19.6/bin:$PATH" # Hardcoded specifically for reliability

# Load NVM if possible (backup)
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

APP_DIR="$HOME/public_html"
LOG_FILE="$HOME/.pm2/vitality.log"
APP_NAME="getyousite-platform"

# 2. Check Pulse
echo "[$(date)] VITALITY_CHECK: Initiating..." >> $LOG_FILE

# Check if PM2 is running the process
TARGET_PID=$(pm2 pid $APP_NAME)

if [ "$TARGET_PID" != "0" ] && [ -n "$TARGET_PID" ]; then
    echo "[$(date)] STATUS: Online (PID: $TARGET_PID). No action required." >> $LOG_FILE
else
    echo "[$(date)] STATUS: Offline or Dead. INITIATING RESURRECTION..." >> $LOG_FILE
    
    # 3. Resurrection Sequence
    cd $APP_DIR
    
    # Ensure dependencies (Just in case, fast check)
    # npm install --production --no-audit --no-fund >> $LOG_FILE 2>&1
    
    # Start via PM2
    PORT=3000 pm2 start server.js --name "$APP_NAME" >> $LOG_FILE 2>&1
    pm2 save >> $LOG_FILE 2>&1
    
    echo "[$(date)] RESURRECTION: Complete." >> $LOG_FILE
fi
