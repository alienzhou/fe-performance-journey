# 字体

[🔝 页面静态资源](./README.md) | [🔙 上一站 - 图片](../5-subresources/image.md)

有些时候，内置的字体并不能满足我们的需求，如果我们希望使用一些更有设计性的字体，我们一般会使用 `@font-face` 来加载字体文件：

```CSS
@font-face {
    font-family: 'Samplefont';
    src: url(/static/samplefont.woff2) format('woff2'),
         url(/static/samplefont.woff) format('woff');
}
```

然而这种方式的一大问题在于，在字体加载的期间，浏览器页面是默认不展示文本内容的。即我们常说的 FOIT (Flash of Invisible Text)。在现代浏览器中，FOIT 持续至多 3 秒，会带来糟糕的用户体验。所以在字体这部分的性能优化中，主要关注点在于如何平滑的加载字体。下面有一些解决方案。

## 1. 字体裁剪

关于字体的性能问题，很多时候来源于字体文件太大，加载耗时较长。因此，一种处理该问题的方式就是进行字体裁剪，从而为要加载的字体文件进行“瘦身”。由于一个字体库中可能会包含很多字（尤其是在中文的场景下），但是并非每个字都会使用到，因此可以将不需要使用到的字体剔除。

例如，对于只需要使用数字的场景，就可以将其他无用的字都剔除，只留下数字和一些必要的标点。关于字体裁剪的工具，网上有很多，大家可以自行选择。

## 2. font-display

你可以在 `@font-face` 中设置 `font-display: swap`，他可以让 FOIT 的默认行为变为 FOUT (Flash of Unstyled Text)，即先会使用默认字体样式展示文本，字体加载完毕后再将文本的字体样式进行替换。

```CSS
@font-face {
    font-family: 'Samplefont';
    src: url(/static/samplefont.woff2) format('woff2'),
         url(/static/samplefont.woff) format('woff');
    font-display: swap;
}
```

font-display 的取值包括 `auto|block|swap|fallback|optional`，这里详细介绍了[各种值的使用场景](https://developers.google.com/web/updates/2016/02/font-display)<sup>[1]</sup>。不过目前该属性的[兼容性一般](https://caniuse.com/#feat=css-font-rendering-controls)。

## 3. 内联字体

我们在上一节介绍过，可以使用 base64 将图片“内联”到页面中。同样的，字体也可以使用这种方式，这样就避免异步加载字体时的 FOIT 或 FOUT。我们可以将字体文件转为 base64 的字符串，设置到 `@font-face` 里的 `src` 属性上：

```CSS
@font-face {
    font-family: 'Samplefont';
    src: url('data:application/x-font-woff;charset=utf-8;base64,d09GRgABAAAAAHyoABMAAAAA4XQAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABG…') format('woff2');
}
```

但这种方式的局限性在于，在一个 `@font-face` 中只能加载加载一种字体类型。同时，与使用内联图片一样，这也会将本可以并行请求的数据量变为串行。

## 4. 使用 CSS Font Loading API

[CSS Font Loading API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API) 是浏览器提供的，可以用来自定义控制字体加载的 API。这样你就可以在 JavaScript 中进行字体的加载，等加载完成后，再将需要应用新字体的元素设置为对应的样式，例如添加一个对应的 className。这里介绍了[如何使用 CSS Font Loading API](https://medium.com/@matuzo/getting-started-with-css-font-loading-e24e7ffaa791)<sup>[2]</sup>。

不过目前 [CSS Font Loading API 的兼容性](https://caniuse.com/#feat=font-loading)也不乐观。同时，由于一些困难也[无法实现一个完美的 polyfill](https://github.com/bramstein/fontloader#deprecated)。因此如果想要使用类似的能力，可以考虑 [Font Face Observer](https://github.com/bramstein/fontfaceobserver)这个库。基本的使用方式如下：

```JavaScript
const font = new FontFaceObserver('Samplefont');

font.load(null, 5000).then(
    () => document.documentElement.classList.add('loaded'),
    () => console.log('Font is not available')
);
```

```CSS
@font-face {
    font-family: 'Samplefont';
    src: url(/static/samplefont.woff2) format('woff2'),
         url(/static/samplefont.woff) format('woff');
}

body {
    font-family: sans-serif;
}

.loaded h1 {
    font-family: Samplefont, sans-serif;
    font-weight: 700;
}
```

## 5. FOFT

在需要加载同一字体的粗体、斜体时，FOFT (Flash of Faux Text) 方法会非常有效。

首先你需要了解的是，对于一种字体，它的斜体与粗体是有专门的字符集的；与此同时，如果你指定了某种字体的粗体，但浏览器没有加载，那么你可以使用 [`font-synthesis`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-synthesis) 属性来让浏览器帮你模拟。而当实际的粗体或斜体加载完毕后，再使用实际的字体集。

具体实践起会借助上面提到的 CSS Font Loading API 或者 Font Face Observer，实现当字体加载完毕后的样式修改。

---

了解完字体的优化措施你会发现，它们主要集中于 **如何通过加载策略来降低甚至消除 FOIT**。当然上面提到的这些策略与技术你可以组合使用，以达到所需的优化效果。

如果还想了解更多关于字体加载的问题，可以看看这篇文章里总结的[各类加载策略](https://www.zachleat.com/web/comprehensive-webfonts/)<sup>[3]</sup>，它还随文提供了相应的代码示例。

![font strategy](./img/font-strategies.svg)

关于字体的性能优化就到这了，下面我们会进入到页面静态资源优化的最后一站 —— 视频。

[下一站 - 视频 🔜](./video.md)

---

## 参考资料

1. [Controlling Font Performance with font-display](https://developers.google.com/web/updates/2016/02/font-display)
1. [Getting started with CSS Font Loading](https://medium.com/@matuzo/getting-started-with-css-font-loading-e24e7ffaa791)
1. [A COMPREHENSIVE GUIDE TO FONT LOADING STRATEGIES](https://www.zachleat.com/web/comprehensive-webfonts/)
