# 视频

视频作为一种重要的媒体形态，在网站中使用可以提高网站内容的丰富性，但同时对网络加载来说也是一个负担。所以会出现一些针对 Web 上视频大小的优化。

1. 使用合适的视频格式

与图片类似，不同的视频编码格式，其数据大小也大都不相同。目前在 HTML5 Video 中常用的数据格式为 MPEG-4。除了 MPEG-4 之外，还支持一种叫 WebM (VP9) 的新的视频格式。

WebM(VP9) 相较于 MPEG-4(x264) 来说会更小，不过[兼容性较差](https://caniuse.com/#feat=webm)。因此可以考虑在 `video` 中指定多个 `source`。

```HTML
<video>
    <source src="/static/video/me.webm" type="video/webm">
    <source src="/static/video/me.mp4" type="video/mp4">
</video>
```

此外，使用 [AV1 编码](https://www.youtube.com/watch?v=04lXWMcwdXA)<sup>[1]</sup>比 [VP9(WebM) 小约30%，比 x264(MPEG-4) 小约45-50%](https://youtu.be/reztLS3vomE?t=356)。

## 2. 视频压缩

对于视频，我们也可以进行有损与无损压缩。常用的一些工具包括：

- [HandBrake](https://handbrake.fr/)
- [Freemake](https://www.freemake.com/free_video_converter/)
- [Hybrid](http://www.selur.de/)
- [MeGUI](https://sourceforge.net/projects/megui/)

## 3. 移除不必要的音轨信息

在上一节中我们提到，可以通过使用 video 代替 GIF 来减少动画的数据量。由于在这种场景下本身就是不需要声音的，所以我们会将 video 设置为 `muted`。

更进一步，既然我们不需要声音，那么我们可以直接移除掉音轨的数据。这样会帮助进一步缩减视频的体积。

## 4. 使用“流”

尝试让浏览器使用“流”或者小分片的方式来播放你的视频，例如常用的 HLS (HTTP Live Streaming) 技术。简单来说，使用 HLS 技术，你的视频会包含一个 .m3u8 的索引文件和一系列包含播放内容的 .ts 分片。浏览器通过不断下载一小段的分片来进行视频播放。

你也可以尝试使用 [MPEG-DASH](https://en.wikipedia.org/wiki/Dynamic_Adaptive_Streaming_over_HTTP) 这个技术，目前开源社区也有一个配套的[客户端实现](https://github.com/Dash-Industry-Forum/dash.js)。

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

关于视频的优化这里只介绍了一些基本的手段，但其实对于一个重度的视频网站来说，会包含更多像是播放器 SDK 的优化、首帧优化、码率自适应等更多的优化内容，例如在 [2019 GMTC 上B站分享了他们的优化手段](https://static001.geekbang.org/con/42/pdf/3841774823/file/%E8%B0%AD%E5%85%86%E6%AD%86&mdash;GMTC%20B%E7%AB%99%E7%9A%84%E8%A7%86%E9%A2%91%E4%BD%93%E9%AA%8C%E8%BF%9B%E5%8C%96%E4%B9%8B%E8%B7%AF%20-%20bilibili%20.pdf)<sup>[2]</sup>。所以这里算是一个抛砖引玉。

此外，虽然上面介绍了一些视频处理的软件工具，但是如果有更高的定制化或集成需求，建议使用 [FFmpeg](https://www.ffmpeg.org/) 或其[背后的这些包](https://github.com/FFmpeg/FFmpeg#libraries)。

[🔝 页面静态资源](./README.md#本节告一段落)

---

## 参考资料

1. [a technial overview of the AV1](https://www.youtube.com/watch?v=04lXWMcwdXA)
1. [B 站的视频体验进化之路](https://static001.geekbang.org/con/42/pdf/3841774823/file/%E8%B0%AD%E5%85%86%E6%AD%86&mdash;GMTC%20B%E7%AB%99%E7%9A%84%E8%A7%86%E9%A2%91%E4%BD%93%E9%AA%8C%E8%BF%9B%E5%8C%96%E4%B9%8B%E8%B7%AF%20-%20bilibili%20.pdf)
1. [FFmepg](https://www.ffmpeg.org/)
1. [8 Video Optimization Tips for Faster Loading Times](https://www.keycdn.com/blog/video-optimization)
1. [Optimizing MP4 Video for Fast Streaming](https://rigor.com/blog/optimizing-mp4-video-for-fast-streaming)
1. [Web Performance 101: Video Optimization](https://blog.catchpoint.com/2017/06/16/web-performance-101-video-optimization/)
