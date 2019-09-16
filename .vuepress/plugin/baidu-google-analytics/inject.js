/* global HM_ID, GA_ID, IGNORE_HASH */

export default ({router}) => {
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
        const cb = [];
        let last_url = '';
        if (HM_ID) {
            window._hmt = window._hmt || [];
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?" + HM_ID;
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
            cb.push(to => {
                _hmt.push(['_trackPageview', to])
            });
        }
        if (GA_ID) {
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r
                i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }
                i[r].l = 1 * new Date()
                a = s.createElement(o)
                m = s.getElementsByTagName(o)[0]
                a.async = 1
                a.src = g
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga')

            ga('create', GA_ID, 'auto')
            ga('set', 'anonymizeIp', true)
            ga('send', 'pageview')
            cb.push(to => {
                ga('set', 'page', to)
                ga('send', 'pageview')
            });
        }

        if (!cb.length) {
            return;
        }

        router.afterEach(function (to) {
            let current = to.fullPath;
            if (IGNORE_HASH) {
                current = to.path;
                if (last_url === current) {
                    return;
                }
                last_url = current;
            }
            cb.forEach(function (it) {
                it.call(this, current)
            });
        });
    }
}