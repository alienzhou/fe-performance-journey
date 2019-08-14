const BASE = '/fe-performance-journey/'

module.exports = {
    base: '/fe-performance-journey/',
    title: '🚵 前端性能优化之旅 🚀',
    description: '从用户发起访问开始到离开网站应用结束，'
        + '完整地介绍其间前端性能优化的关注点与技术手段，'
        + '帮助大家体系化得了解与学习前端性能优化相关知识',
    head: [
        [
            'link',
            {
                rel: 'icon',
                href: 'https://raw.githubusercontent.com/alienzhou/alienzhou.github.io/master/img/fe-performance-journey/favicon.png'
            }
        ]
    ],
    markdown: {
        lineNumbers: true
    },
    dest: '.vuepress/dist' + BASE,
    themeConfig: {
        repo: 'alienzhou/fe-performance-journey',
        repoLabel: 'Github, 欢迎 🌟',
        lastUpdated: '更新于',
        editLinks: true,
        editLinkText: '欢迎斧正',
        nav: [{
            text: '博客',
            link: 'https://github.com/alienzhou/blog'
        }, {
            text: '掘金',
            link: 'https://juejin.im/user/59ad5377518825244d206d2d/posts'
        }],
        sidebar: [
            ['/', '启程'],
            '/1-cache/',
            '/2-request/',
            '/3-response/',
            '/4-parse/',
            {
                title: '页面静态资源',
                path: '/5-subresources/',
                collapsable: false,
                sidebarDepth: 1,
                children: [
                    '/5-subresources/javascript.md',
                    '/5-subresources/css.md',
                    '/5-subresources/image.md',
                    '/5-subresources/font.md',
                    '/5-subresources/video.md'
                ]
            },
            '/6-runtime/',
            '/7-preload/',
            '/END.md'
        ]
    },
    plugins: [
        '@vuepress/nprogress',
        '@vuepress/last-updated',
        '@vuepress/back-to-top',
        '@vuepress/active-header-links',
        'vuepress-plugin-baidu-google-analytics',
        {
            hm: '0cbe709b2d0700e40a995aeb6f42796b',
            ga: 'UA-122643173-2',
            ignore_hash: false
        }
    ]
};