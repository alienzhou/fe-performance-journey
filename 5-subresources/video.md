# 视频

[🔝 页面静态资源](./README.md) | [🔙 上一站 - 字体](../5-subresources/font.md)

视频作为一种重要的媒体形态，在网站中使用可以提高网站内容的丰富性，但同时对网络加载来说也是一个负担。所以会出现一些如下针对 Web 上视频的优化。

## 1. 使用合适的视频格式

与图片类似，不同的视频编码格式，其数据大小也大都不同。目前在 HTML5 Video 中常用的格式为 MPEG-4。除了 MPEG-4 之外，还支持一种叫 WebM 的新的视频格式。

WebM(VP9) 相较于 MPEG-4(x264) 来说会更小，不过[兼容性相对来说也较差](https://caniuse.com/#feat=webm)。因此可以考虑在 `<video>` 中指定多个 `<source>`。

```HTML
<video>
    <source src="/static/video/me.webm" type="video/webm">
    <source src="/static/video/me.mp4" type="video/mp4">
</video>
```

此外，使用 [AV1 编码](https://www.youtube.com/watch?v=04lXWMcwdXA)<sup>[1]</sup>会比 [VP9(WebM) 小约30%，比 x264(MPEG-4) 小约45-50%](https://youtu.be/reztLS3vomE?t=356)<sup>[2]</sup>。

## 2. 视频压缩

对于视频，我们也可以进行有损与无损压缩，同样可以有效减少视频大小。下面列举了一些常用的工具：

- [HandBrake](https://handbrake.fr/)
- [Freemake](https://www.freemake.com/free_video_converter/)
- [Hybrid](http://www.selur.de/)
- [MeGUI](https://sourceforge.net/projects/megui/)

## 3. 移除不必要的音轨信息

在上一节中我们提到，可以使用 `<video>` 代替 GIF 来实现动画，同时体积也会更小。由于在这种场景下本身就是不需要声音的，所以我们会将 `<video>` 设置为 `muted`。

那么，既然不需要声音，我们是不是可以直接移除掉音轨的数据？是的，这样做也会帮助进一步缩减视频的体积。

## 4. 使用“流”

尝试让浏览器使用“流”或者小分片的方式来播放你的视频，例如常用的 HLS (HTTP Live Streaming) 技术。简单来说，使用 HLS 技术，你的视频会包含一个 `.m3u8` 的索引文件和一系列包含播放内容的 `.ts` 分片。浏览器通过不断下载一小段的分片来进行视频播放，避免了完整视频下载的流量消耗。

你也可以尝试使用 [MPEG-DASH](https://en.wikipedia.org/wiki/Dynamic_Adaptive_Streaming_over_HTTP)<sup>[3]</sup> 这个技术，目前开源社区也有一个配套的[客户端实现](https://github.com/Dash-Industry-Forum/dash.js)。

## 5. 移除不必要的视频

对于不需要使用视频的场景，最好的优化方法就是去掉视频。例如在小屏幕上，你可以通过媒体查询来避免下载视频：

```CSS
@media screen and (max-width: 650px) {
    #hero-video {
        display: none;
    }
}
```

---

关于视频的优化这里只介绍了一些基本的手段，但对于一个重度的视频网站来说，会包含例如播放器 SDK 的优化、数据预取、码率自适应等更多的优化内容，在 2019 GMTC 上，[B站分享了他们的缩减首帧耗时的一系列优化措施](https://github.com/alienzhou/fe-performance-journey/raw/master/assets/2019GMTC_B%E7%AB%99%E7%9A%84%E8%A7%86%E9%A2%91%E4%BD%93%E9%AA%8C%E8%BF%9B%E5%8C%96%E4%B9%8B%E8%B7%AF.pdf)<sup>[4]</sup>。

此外，虽然上面介绍了一些视频处理的软件工具，但是如果有更高的定制化或集成需求，建议使用 [FFmpeg](https://www.ffmpeg.org/)<sup>[5]</sup> 或[相关的库](https://github.com/FFmpeg/FFmpeg#libraries)来处理。

[🔝 页面静态资源](./README.md#本节告一段落)

---

## 参考资料

1. [a technial overview of the AV1](https://www.youtube.com/watch?v=04lXWMcwdXA)
1. [Speed Essentials: Key Techniques for Fast Websites (Chrome Dev Summit 2018)](https://youtu.be/reztLS3vomE?t=356)
1. [Dynamic Adaptive Streaming over HTTP (Wikipedia)](https://en.wikipedia.org/wiki/Dynamic_Adaptive_Streaming_over_HTTP)
1. [B 站的视频体验进化之路](https://github.com/alienzhou/fe-performance-journey/raw/master/assets/2019GMTC_B%E7%AB%99%E7%9A%84%E8%A7%86%E9%A2%91%E4%BD%93%E9%AA%8C%E8%BF%9B%E5%8C%96%E4%B9%8B%E8%B7%AF.pdf)
1. [FFmepg](https://www.ffmpeg.org/)
1. [8 Video Optimization Tips for Faster Loading Times](https://www.keycdn.com/blog/video-optimization)
1. [Optimizing MP4 Video for Fast Streaming](https://rigor.com/blog/optimizing-mp4-video-for-fast-streaming)
1. [Web Performance 101: Video Optimization](https://blog.catchpoint.com/2017/06/16/web-performance-101-video-optimization/)
