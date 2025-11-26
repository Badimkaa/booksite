module.exports = {
    apps: [
        {
            name: 'book-site',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
        },
        {
            name: 'cleanup-pending-orders',
            script: 'npx',
            args: 'tsx scripts/cleanup-pending-orders.ts',
            cron_restart: '0 * * * *', // Every hour at minute 0
            autorestart: false,
            watch: false,
        },
    ],
};
