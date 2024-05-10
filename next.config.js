/** @type {import('next').NextConfig} */
module.exports = {
    experimental: {
        serverActions: {
            allowedOrigins: [
                "localhost:3000", 
                "reader-001.vercel.app",
                "silver-xylophone-975xqrwvp42qww-3000.app.github.dev"],
        },
    },
}
