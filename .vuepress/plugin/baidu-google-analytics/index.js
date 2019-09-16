const path = require('path')

module.exports = (options = {}, context) => ({
    define() {
        const {
            siteConfig = {}
        } = context;
        const HM_ID = (options.hm || siteConfig.hm) || false;
        const GA_ID = (options.ga || siteConfig.ga) || false;
        const IGNORE_HASH = (options.ignore_hash || siteConfig.ignore_hash) || false;
        return {
            HM_ID,
            GA_ID,
            IGNORE_HASH
        };
    },

    enhanceAppFiles: [
        path.resolve(__dirname, 'inject.js')
    ]
});
