/** PM2 ecosystem file to run the Hostinger start script reliably
  Usage:
    npm install -g pm2
    pm2 start ecosystem.config.js
    pm2 save
    pm2 status
  This will run `node hostinger-start.js` and pick up env vars from the environment or a .env file
*/

module.exports = {
  apps: [
    {
      name: 'vehiclehealthanalysis',
      script: 'hostinger-start.js',
      args: [],
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
      },
      // Uncomment and configure if you want PM2 to set a specific PORT
      // env_production: {
      //   PORT: 3000
      // }
    }
  ]
}
