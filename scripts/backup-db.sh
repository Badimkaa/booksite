#!/bin/bash

# Configuration
SERVER_USER="root"
SERVER_IP="31.129.105.50"
REMOTE_DB_PATH="/root/app/prisma/dev.db" # Updated path for Git deployment
LOCAL_BACKUP_DIR="./backups"
KEEP_BACKUPS=5 # Number of recent backups to keep

# Ensure backup directory exists
mkdir -p "$LOCAL_BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
FILENAME="backup_$TIMESTAMP.db"

echo "Starting backup process..."

# 1. Create a consistent backup on the server using sqlite3
echo "Creating consistent snapshot on server..."
ssh $SERVER_USER@$SERVER_IP "sqlite3 $REMOTE_DB_PATH \".backup '/tmp/$FILENAME'\""

if [ $? -eq 0 ]; then
    echo "Snapshot created successfully."
else
    echo "Error creating snapshot. Make sure sqlite3 is installed on server (apt install sqlite3)."
    # Fallback to simple copy if sqlite3 fails
    echo "Attempting fallback copy..."
    ssh $SERVER_USER@$SERVER_IP "cp $REMOTE_DB_PATH /tmp/$FILENAME"
fi

# 2. Download the backup
echo "Downloading backup to $LOCAL_BACKUP_DIR/$FILENAME..."
scp "$SERVER_USER@$SERVER_IP:/tmp/$FILENAME" "$LOCAL_BACKUP_DIR/$FILENAME"

# 3. Clean up server
echo "Cleaning up temporary file on server..."
ssh $SERVER_USER@$SERVER_IP "rm '/tmp/$FILENAME'"

# 4. Rotate local backups (Delete old ones)
echo "Cleaning up old backups (keeping last $KEEP_BACKUPS)..."
cd "$LOCAL_BACKUP_DIR"
ls -t *.db | tail -n +$((KEEP_BACKUPS + 1)) | xargs -I {} rm -- "{}" 2>/dev/null

echo "Backup completed successfully! Saved to: $LOCAL_BACKUP_DIR/$FILENAME"
