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
                            '@popover-background': '#141414',
                            //menu
                            "@menu-bg": "transparent",
                            "@menu-inline-submenu-bg": "transparent",
                            "@menu-item-color": "#7E7D88",
                            "@menu-item-color": "#fff",
                            "@menu-item-active-bg": "#313131",
                            "@menu-item-font-size": "14px",
                            "@menu-inline-toplevel-item-height": "35px",
                            "@menu-item-height": "35px",
                            "@menu-item-boundary-margin": 0,
                            //layout
                            "@layout-body-background": 'transparent',
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
