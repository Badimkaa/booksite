#!/bin/bash

# Configuration
DB_PATH="/root/app/prisma/dev.db"
BACKUP_DIR="/root/backups"
KEEP_BACKUPS=14 # Keep 2 weeks of backups on server

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
FILENAME="backup_$TIMESTAMP.db"

# Create backup
sqlite3 "$DB_PATH" ".backup '$BACKUP_DIR/$FILENAME'"

# Rotate backups (delete old ones)
cd "$BACKUP_DIR"
ls -t *.db | tail -n +$((KEEP_BACKUPS + 1)) | xargs -I {} rm -- "{}" 2>/dev/null
