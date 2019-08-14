# 三、服务端响应

[🔙 上一站 - 发送请求](../2-request/README.md)

把这一部分放进前端性能优化并不是很严谨：

- 其一，服务端有着服务端的通用技术手段，这块深入去研究，会是一个不一样的领域；
- 其二，我们既然在讨论前端性能优化，这部分主要还是指 NodeJS，但不是所有业务都使用 NodeJS。

所以这里只会提一些实践中碰到的小点，辅以一些拓展阅读，希望能帮助大家抛砖引玉，开拓思维。

## 1. 使用流进行响应

目前，现代浏览器都支持根据流的返回形式来逐步进行页面内容的解析、处理。这就意味着，即使请求的响应没有完全结束，浏览器也可以从手里已有的响应结果中进行页面的解析与渲染。

例如 [css-only-chat-node](https://github.com/alienzhou/css-only-chat-node) 就利用了这个特点来实现无刷新、无 JavaScript 的页面更新。

## 2. 业务聚合

BFF 非常合适做的一件事就是后端服务的聚合。

如果你有一个两个接口服务：第一个服务是先获取产品信息，再根据产品信息中的上架时间通过第二个服务获取该时间后的产品列表。这个业务逻辑如果放在前端（浏览器）处理将会串行发送两个请求。假设每个请求 200ms，那么就需要等待 400ms。如果引入 NodeJS，这一层可以放在 NodeJS 中实现。NodeJS 部署的位置一般离其他后端服务“更近”，例如同一个局域网。这类服务间的请求耗时显然更低，可能只需要 200(浏览器) + 30(NodeJS) * 2 = 260ms。

此外，如果一个业务需要在前端并发三、四个请求来获取完整数据，那么放在 NodeJS 的 BFF 层也是一个不错的选择。

## 3. 避免代码问题

代码问题其实就非常细节了。简单列举一些常见的问题：

- `async` `await` 的不当使用导致并行请求被串行化了；
- 频繁地 `JSON.parse` 和 `JSON.stringify` 大对象；
- 正则表达式的灾难性回溯；
- 闭包导致的内存泄漏；
- CPU 密集型任务导致事件循环 delay 严重；
- 未捕获的异常导致进程频繁退出，守护进程（pm2/supervisor）又将进程重启，这种频繁的启停也会比较消耗资源；
- ……

---

「前端性能优化之旅」在这一阶段只能蜻蜓点水了。NodeJS 作为 BFF 还是比较常见的，所以在旅途中也提了一下。下面我们就要重新回到前端领域了，准备好了么？

[下一站 - 页面解析与处理 🔜](../4-parse/README.md)

---

## 参考资料

1. [你不知道的 Node.js 性能优化](https://www.yuque.com/office/yuque/0/2019/pdf/168578/1547529466557-357032b6-12fb-4e02-9682-076f498c1f42.pdf)
1. [Keeping Node.js Fast: Tools, Techniques, And Tips For Making High-Performance Node.js Servers](https://www.smashingmagazine.com/2018/06/nodejs-tools-techniques-performance-servers/?utm_source=mybridge&utm_medium=blog&utm_campaign=read_more)
1. [Backend-in-the-frontend: a pattern for cleaner code](https://hackernoon.com/frontend-in-the-backend-a-pattern-for-cleaner-code-b497c92d0b49)
1. [Node.js 应用故障排查手册](https://github.com/aliyun-node/Node.js-Troubleshooting-Guide)
1. [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
