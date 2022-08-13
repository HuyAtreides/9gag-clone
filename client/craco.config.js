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
                            "@primary-color": "#FFB800",
                            //menu
                            "@menu-item-color": "#7E7D88",
                            "@menu-item-active-bg": "#FFB800",
                            "@menu-item-font-size": "18px",
                            "@menu-item-height": "56px",
                            "@menu-item-boundary-margin": 0,
                            "@menu-bg": "#F9F6F4",


                            "@text-color": "#1E0D03",
                            "@control-border-radius": "8px",

                            "@primary-color": "#FFB800",
                            "@layout-sider-background": "#FFB800",
                            "@menu-item-active-bg": "#FFB800",

                            "@menu-item-font-size": "18px",

                            "@input-border-color": "#A5A8B1",
                            "@picker-border-color": "#A5A8B1",
                            "@select-border-color": "#A5A8B1",

                            //btn
                            "@btn-default-border": "#ff993c",
                            "@btn-padding-horizontal-base": "24px",
                            "@btn-border-radius-base": "8px",
                            "@btn-border-width": "1px",
                            "@btn-font-weight": 700,
                            "@btn-height-base": "36px",
                            "@btn-height-lg": "48px",
                            "@btn-font-size-lg": "18px",
                            "@btn-font-size-sm": "14px",
                            "@btn-default-ghost-color": "#ff993c",
                            "@btn-default-ghost-border": "#ff993c",

                            //radio
                            "@radio-button-bg": "#fff",
                            "@radio-size": "24px",
                            "@radio-border-width": "2px",
                            "@radio-dot-size": "16px",
                            "@radio-button-color": "#27AEF9",
                            "@radio-dot-color": "#27AEF9",
                            "@radio-solid-color": "#27AEF9",
                            "@radio-button-active-color": "#27AEF9",
                            //form
                            "@form-item-label-font-size": "16px",
                            "@form-item-label-font-weight": 600,

                            //checkbox
                            "@checkbox-size": "24px",
                            "@checkbox-color": "#27AEF9",
                            "@checkbox-border-radius": "4px",
                            "@checkbox-border-width": "2px",

                            //modal
                            "@modal-body-padding": "0 32px",
                            "@modal-footer-padding-vertical": "24px",
                            "@modal-header-padding-vertical": "24px",

                            //table
                            "@table-header-bg": '#F1F4F8',
                            //popover
                            "@popover-background": '#FFD2A8',
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};