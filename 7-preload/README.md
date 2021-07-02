# 七、预加载

[🔙 上一站 - 运行时](../6-runtime/README.md)

在之前的旅途中，我们提到了很多关于资源加载的优化，包括怎么加快连接的建立、怎么减少包体大小、怎么减少请求数等。但还有一种变相加快加载速度的技术 —— 预加载。

预加载相当于是快用户一步，在空闲的时候就把用户即将用到的资源加载完，等用户实际需要使用时，资源已经存在在本地，自然就跳过了整个加载的等待时间。

在「性能优化之旅」的最后一站，我会给你介绍一些预加载技术，包括使用览器提供的能力，或者巧用 JavaScript 中的相关 API。此外，除了预加载技术，预加载的一大核心问题还在于预加载策略，即如何判断资源是否需要预加载以及合适加载，以保证最高的效率。

## 1. 预加载技术

### 1.1. Resource Hints

[Resource Hints](https://www.w3.org/TR/resource-hints/)<sup>[1]</sup> 是一种预加载相关的标准，它告诉浏览器哪些源下的资源我们的 Web 应用需要获取，哪些资源在之后的操作或浏览时需要被使用，从而让浏览器能够进行一些预先连接或预先加载操作。Resource Hints 标准包括 DNS Prefetch、Preconnect、Prefetch 与 Prerender。此外，还有一个与 Resource Hints 类似的 Preload 我们也会在这里介绍一下。

在发起请求部分我们已经介绍了[如何使用 DNS Prefetch 来预解析 DNS](../2-request/README.md#2-dns-解析)、[如何使用 Preconnect 来预先建立连接](../2-request/README.md#3-预先建立连接)。所以下面会其他三块：Prefetch、Prerender、Preload。

#### 1.1.1. Prefetch

你可以把 Prefetch 理解为资源预获取。一般来说，可以用 Prefetch 来指定在紧接着之后的操作或浏览中需要使用到的资源，让浏览器提前获取。由于仅仅是提前获取资源，因此浏览器不会对资源进行预处理，并且像 CSS 样式表、JavaScript 脚本这样的资源是不会自动执行并应用于当前文档的。与Preload 规范基本一致，[基本涵盖了所有资源类型](https://www.w3.org/TR/preload/#as-attribute)<sup>[2]</sup>。

```HTML
<link rel="prefetch" href="/prefetch.js" as="script">
```

#### 1.1.2. Prerender

Prerender 比 Prefetch 更进一步，可以粗略地理解不仅会预获取，还会预执行。

> The prerender link relation type is used to identify a resource that might be required by the next navigation, and that the user agent SHOULD fetch and execute.

如果你指定 Prerender 一个页面，那么它依赖的其他资源，像 `<script>`、`<link>` 等页面所需资源也可能会被下载与处理。但是预处理会基于当前机器、网络情况的不同而被不同程度地推迟。例如，会根据 CPU、GPU 和内存的使用情况，以及请求操作的幂等性而选择不同的策略或阻止该操作。

```HTML
<link rel="prerender" href="//sample.com/nextpage.html">
```

#### 1.1.3. Preload

在遇到需要 Preload 的资源时，浏览器会 **立刻** 进行预获取，并将结果放在内存中，资源的获取不会影响页面 parse 与 load 事件的触发。直到再次遇到该资源的使用标签时，才会执行。由于我们会将 `<script>` 标签置于 `<body>` 底部来保证性能，因此可以考虑在 `<head>` 标签中适当添加这些资源的 Preload 来加速页面的加载与渲染。

```HTML
<link rel="preload" href="./nextpage.js" as="script">
```

到这里大家肯定会好奇，Preload 与 Prefetch 有什么区别呢？它们非常容易混淆，在标准里有这么一段话解释两者区别：

> The application can use the preload keyword to initiate early, high-priority, and non-render-blocking fetch of a CSS resource that can then be applied by the application at appropriate time.

与 Prefetch 相比，Preload 会[强制浏览器立即获取资源，并且该请求具有较高的优先级](https://www.w3.org/TR/preload/#x2.link-type-preload)（mandatory and high-priority），因此建议对一些当前页面会马上用到资源使用 Preload；相对的，Prefetch 的资源获取则是可选与较低优先级的，其是否获取完全取决于浏览器的决定，适用于预获取将来可能会用到的资源。

> 如果对 Resource Hints 感兴趣，可以在我之前的文章中[进一步了解它们](https://juejin.im/post/5b4b66f0f265da0f9155feb6)<sup>[3]</sup>。

#### 1.1.4. webpack 中的使用方式

预加载可以配合 code split 来使用，可以在降低初始加载量的情况下，尽量保证按需加载时的体验。[在 webpack 中应用预加载](https://medium.com/webpack/link-rel-prefetch-preload-in-webpack-51a52358f84c)<sup>[4]</sup>非常简单，只需要在 dynamic import 中添加相应注释，webpack 就会知道你需要对这个 chunk 进行预加载。

```JavaScript
// prefetch
import(/* webpackPrefetch: true */ './sub1.js');

// preload
import(/* webpackPreload: true */ './sub2.js')
```

### 1.2. 基于 JavaScript 的预加载

上面提到了基于 Resource Hints 的预加载技术，它其实像是一种声明式技术：你提出你的预加载需求，浏览器根据自身状态，选择合适的时候预加载。

如果你在[不兼容 Resource Hints](https://caniuse.com/#search=resource%20hint) 的浏览器上进行预加载，或者希望有“更强硬的”预加载控制，你可能会希望使用一些 JavaScript 中的功能来“巧妙”地进行预加载。

例如对于图片，

```JavaScript
let img = new Image();
img.src = '/static/img/prefetch.jpg';
```

上面的方法会触发浏览器加载图片，然后等到用户需要浏览时，再将其插入到页面即可。

对于 JavaScript 和 CSS 可以动态添加 `<script>` 和 `<link>` 标签，不过要注意它们只有在添加到页面时浏览器才会加载（少数老式浏览器上这块表现会不太一样），由于添加到页面后加载完会执行该资源，所以要避免产生不需要的副作用（否则就不是预加载了）。

如果你希望通过 JavaScript 来进行预加载，可以使用 [PreloadJS](https://github.com/CreateJS/PreloadJS) 这个库，它提供了包括脚本、样式、图片、字体、SVG等[各类资源的预加载器](https://github.com/CreateJS/PreloadJS/tree/master/src/preloadjs/loaders)。

## 2. 视频预加载

视频预加载技术可以有效提高视频播放的用户体验。在 [Fast Playback with Video Preload](https://developers.google.com/web/fundamentals/media/fast-playback-with-video-preload)<sup>[5]</sup> 中提到了三种视频预加载方式。

### 2.1. 为视频添加 `preload` 属性

使用 `preload` 属性可以让浏览器预加载相应的内容。其取值与作用如下表所示：

|值|作用|
|--|--|
|none|不载入视频（即不预加载）|
|meta|载入元数据（时长、尺寸、文字轨道）|
|auto|加载整个视频|

此外，你还可以设置 `poster` 属性，它规定视频下载时或用户点击播放按钮前播放器上显示的图像。一种推荐的方式是设置 `poster` 与 `preload: meta`，为用户提供一定的播放预览信息的同时避免过多的预加载流量。

### 2.2. 使用 Preload Link

这一点已经在第一部分提到了，可以使用

```HTML
<link rel="preload" as="video" href="/static/sample.mp4">
```

进行资源的预加载。

### 2.3. 使用 JavaScript 进行自定义的 Buffer 操作

可以通过 [HTTP `Range` 请求头](https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests)来获取开始的一小段视频数据，然后使用 [`MediaSource`](https://developer.mozilla.org/en-US/docs/Web/API/MediaSource) API 来进行视频媒体数据的暂存与播放。

下面这段示例代码摘自 [Fast Playback with Video Preload - Manual buffering](https://developers.google.com/web/fundamentals/media/fast-playback-with-video-preload#manual_buffering)，它可以实现视频数据的预加载，更多相关实现可以参见其中内容。

```HTML
<video id="video" controls></video>

<script>
    const mediaSource = new MediaSource();
    video.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener('sourceopen', sourceOpen, { once: true });

    function sourceOpen() {
        URL.revokeObjectURL(video.src);
        const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp09.00.10.08"');

        // Fetch beginning of the video by setting the Range HTTP request header.
        fetch('file.webm', { headers: { range: 'bytes=0-567139' } })
            .then(response => response.arrayBuffer())
            .then(data => {
                sourceBuffer.appendBuffer(data);
                sourceBuffer.addEventListener('updateend', updateEnd, { once: true });
            });
    }

    function updateEnd() {
        // Video is now ready to play!
        var bufferedSeconds = video.buffered.end(0) - video.buffered.start(0);
        console.log(bufferedSeconds + ' seconds of video are ready to play!');

        // Fetch the next segment of video when user starts playing the video.
        video.addEventListener('playing', fetchNextSegment, { once: true });
    }

    function fetchNextSegment() {
        fetch('file.webm', { headers: { range: 'bytes=567140-1196488' } })
            .then(response => response.arrayBuffer())
            .then(data => {
                const sourceBuffer = mediaSource.sourceBuffers[0];
                sourceBuffer.appendBuffer(data);
                // TODO: Fetch further segment and append it.
            });
    }
</script>
```

## 3. 预加载的策略

预加载一般都会面临一些矛盾：

- 预加载资源过多，可能导致流量消耗过大，占用正常请求的通道；
- 预加载资源过少，可能导致覆盖率太低，对于大部分资源用户无法享受到预加载效果。

设计一个高效的预加载策略是一个很复杂的问题 ，这里只简单介绍一些工具。

### 3.1. quicklink

[quicklink](https://github.com/GoogleChromeLabs/quicklink) 是 GoogleChromeLabs 推出的轻量级库，使用 Resource Hints 进行预加载，对于不支持的浏览器会回退到 XHR 模式。它的策略其实非常直接，核心就是当链接进入到视口后，会对其进行预加载。

当然我们还可以加一些其他策略，例如设定一个 200ms 的停留阈值。总体而言，它的策略还是比较简单的，更像是为前端预加载提供一个思路。如果感兴趣，可以从这篇文章中了解 [quicklink 的实现细节](https://juejin.im/post/5c21f8435188256d12597789)<sup>[6]</sup>。

### 3.2. Guess.js

[Guess.js](https://github.com/guess-js/guess) 则是一个更为完备的工具包。它会结合前端访问与打点的数据进行统计，甚至应用一些机器学习的模型，来提供一个更精细化、更准确的预加载策略。同时，在预加载之外，它还可以帮助实现最优的打包方式、加载路径等。核心就是通过大量的实际用户数据，来帮助前端性能优化做决策与预测。

你可以查看 [Guess.js Repo](https://github.com/guess-js/guess) 来进一步了解它，或者阅读[这篇介绍文章](https://blog.mgechev.com/2018/05/09/introducing-guess-js-data-driven-user-experiences-web/)<sup>[7]</sup>。

---

关于预加载的话题就到这了，我们的「前端性能优化之旅」也接近尾声了。最后一站，让我们再回来从整体维度聊聊前端性能优化吧。

[下一站 - 聊聊前端性能优化 🔜](../END.md)

---

## 参考资料

1. [Resource Hints (W3C)](https://www.w3.org/TR/resource-hints/)
1. [Preload (W3C)](https://www.w3.org/TR/preload/)
1. [使用Resource Hint提升页面加载性能与体验](https://juejin.im/post/5b4b66f0f265da0f9155feb6)
1. [\<link rel=”prefetch/preload”\> in webpack](https://medium.com/webpack/link-rel-prefetch-preload-in-webpack-51a52358f84c)
1. [Fast Playback with Video Preload](https://developers.google.com/web/fundamentals/media/fast-playback-with-video-preload)
1. [quicklink：实现原理与给前端的启发](https://juejin.im/post/5c21f8435188256d12597789)
1. [Introducing Guess.js - a toolkit for enabling data-driven user-experiences on the Web](https://blog.mgechev.com/2018/05/09/introducing-guess-js-data-driven-user-experiences-web/)
1. [Prefetching, preloading, prebrowsing](https://css-tricks.com/prefetching-preloading-prebrowsing/)
1. [Preload: What Is It Good For?](https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/)
1. [Faster web navigation with predictive prefetching](https://web.dev/predictive-prefetching/#predictive-prefetching-with-guess.js)
