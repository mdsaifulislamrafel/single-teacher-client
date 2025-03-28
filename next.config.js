// next.config.js
module.exports = {
    api: {
      bodyParser: false,
      responseLimit: '50mb',
    },
    experimental: {
      serverActions: {
        bodySizeLimit: '50mb',
      },
    }
  }