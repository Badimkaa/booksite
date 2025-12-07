#!/bin/bash

# Configuration
SERVER_USER="root"
SERVER_IP="31.129.105.50"
REMOTE_BACKUP_DIR="/root/backups/" # Note the trailing slash
LOCAL_BACKUP_DIR="./backups"

# Ensure local backup directory exists
mkdir -p "$LOCAL_BACKUP_DIR"

echo "Syncing backups from server..."

# Use rsync to download new files
# -a: archive mode (preserves permissions, times, etc.)
# -v: verbose
# -z: compress during transfer
# --ignore-existing: skip files we already have
rsync -avz --ignore-existing "$SERVER_USER@$SERVER_IP:$REMOTE_BACKUP_DIR" "$LOCAL_BACKUP_DIR"

echo "Sync completed. Local backups are in $LOCAL_BACKUP_DIR"
