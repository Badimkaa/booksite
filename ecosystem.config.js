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
    ],
};
