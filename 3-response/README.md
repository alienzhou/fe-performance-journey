# 服务端响应

[🔙 上一站 - 发送请求](../2-request/README.md)

其实把这一部分放进前端性能优化并不是很严谨。

- 其一，服务端有着服务端的通用技术手段，有些思想是不分语言的，这块深入了，完全又是个新领域；
- 其二，我们既然在讨论前端性能优化，写这部分肯定指的 NodeJS，但不是所有业务都使用 NodeJS。

所以这里只会提一些实践中碰到的小点，再辅以一些拓展阅读，希望能帮助大家开拓思维。

## 1. 使用流进行响应

目前，现代浏览器都支持根据不断返回的流内容逐步进行页面的解析与处理。这就意味着，即使请求的响应没有完全结束，浏览器也可以从手里已有的响应结果中解析并渲染出页面。

例如 [css-only-chat-node](https://github.com/alienzhou/css-only-chat-node) 就利用了这个特点来实现无刷新、无 JavaScript 的页面更新。

## 2. 业务聚合

BFF 非常合适做的一件事就是服务聚合。

如果你有一个两个接口，需要先获取产品信息，再根据产品信息中的上架时间获取该时间后上架的所有产品列表。那么，放在前端（浏览器）处理将会串行发送两个请求。假设每个请求 200ms，那么就需要等待 400ms。如果引入 NodeJS，这一层可以放在 NodeJS 中实现，内部服务间的请求耗时显然更低，可能只需要 200 + 40 = 240ms。

此外，如果一个需求需要在前端并发三、四个请求来获取完整数据，那么放在 NodeJS 的 BFF 层也会很合适。

好了，你可能会问，为什么不能让那些后端工程师们帮你修改或新开一个接口呢？毕竟有时候，如果需求的产出方和实现方是一个人的话，会更顺畅，有种心手合一的感觉。

## 3. 避免代码问题

代码问题其实有点过细了。列举一些常见的问题吧。

- `async` `await` 的不当使用导致并行请求被串行化了；
- 频繁地 `JSON.parse` 和 `JSON.stringify` 大对象；
- 正则表达式的灾难性回溯；
- 闭包导致的内存泄漏；
- 未处理的异步异常导致进程退出，pm2 或 supervisor 等将进程频繁重启，例如 promise 缺少 catch
- ……

---

「前端性能优化之旅」在这一阶段只能蜻蜓点水了。因为 NodeJS 做一层薄薄的 BFF 还是比较常见的，所以简单提了一些。下面我们就要重新回到更熟悉的前端领域了，准备好了么？

[下一站 - 页面解析与处理 🔜](../4-parse/README.md)

---

## 参考资料

1. [你不知道的 Node.js 性能优化](https://www.yuque.com/office/yuque/0/2019/pdf/168578/1547529466557-357032b6-12fb-4e02-9682-076f498c1f42.pdf)
1. [Keeping Node.js Fast: Tools, Techniques, And Tips For Making High-Performance Node.js Servers](https://www.smashingmagazine.com/2018/06/nodejs-tools-techniques-performance-servers/?utm_source=mybridge&utm_medium=blog&utm_campaign=read_more)
1. [Backend-in-the-frontend: a pattern for cleaner code](https://hackernoon.com/frontend-in-the-backend-a-pattern-for-cleaner-code-b497c92d0b49)
