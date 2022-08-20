/* craco.config.js */
const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@btn-font-weight': 600,
              '@border-radius-base': '5px',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
