## 项目介绍

**项目中整合 vue + nuxt + axios + vuex + vue-router (nuxt 自带 vuex 和 vue-router)，一个基于 Nuxt 的服务器端渲染**

## 项目构建步骤

``` bash
# 安装依赖
$ npm install # Or yarn install

# 启动服务，访问 localhost:3000
$ npm run dev

# 生成环境打包
$ npm run build
$ npm start

# 打包需要部署的静态页面
$ npm run generate


访问 http://localhost:3000 ，现在我们来看下初始化好的项目目录

```shell
├── assets						css，图片等资源都在这
├── components                  组件相关
├── layouts                     路由布局
├── middleware                  中间件
├── pages                  		路由页面
├── static                  	静态资源
├── pages                  		路由页面
├── store              	      	vuex 相关
├── nuxt.config.js              nuxt 相关配置
├── package.json              	依赖相关
├── README.md              	    项目介绍
```

接触过 `vue` 的小伙伴，看着这个目前可能会有点小疑问，为什么没有 router 路由相关的文件？莫慌，`Nuxt` 会帮你将 pages 下面的文件自动解析成路由。所以在接下来的开发中，记得别瞎在 pages 下面新增文件，pages 下面的每一个 vue 文件就是一个路由。


## 项目部署

到这一步的同学，你得先确保你拥有一个自己的服务器。如果没有的话，感觉去买一个。

在进行部署讲解前，我们先看一下 `Nuxt` 提供的几个命令

| 命令            | 描述                                       |
| ------------- | ---------------------------------------- |
| nuxt          | 启动一个热加载的 Web 服务器（开发模式） [localhost:3000](http://localhost:3000/) |
| nuxt build    | 利用 webpack 编译应用，压缩 JS 和 CSS 资源（发布用）      |
| nuxt start    | 以生成模式启动一个 Web 服务器 (`nuxt build` 会先被执行)   |
| nuxt generate | 编译应用，并依据路由配置生成对应的 HTML 文件 (用于静态站点的部署)    |

### 1、静态化页面部署

我们从官网给出的文档可以看出，部署静态化页面需要用到的命令是 `nuxt generate` ，执行的时候会在根目录下面生成 dist 目录，里面的文件都是静态化页面需要的打包好的文件。

**这里需要特别注意的一点是，如果你的项目中存在 axios 请求的话，记得在你本地开启一个本地服务哦 ~ 不然打包的时候执行到 axios 请求的时候会报错。因为前面我们通过使用 node 的 process 对运行环境进行了是跳转还是请求的判定，而打包进行请求的时候是不依赖 node 环境的**

#### i. 使用 gh-pages

这里，我先假设小伙伴们都可以正常执行 `nuxt generate` 并生成对应的 dist 目录。

为了项目的并行开发，我们一般会在 `.gitignore` 文件里面将打包文件给忽略掉，但我们静态化页面的部署有需要用到 dist 目录下的所有打包文件。所以这里我们将使用 [gh-pages](https://www.npmjs.com/package/gh-pages) 将打包文件发布到我们的 git 仓库

```shell
# 安装 gh-pages
npm i gh-pages -D
```

然后在 `package.json` 写入配置（当然你也可以新建文件执行发布）

```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

执行 `npm run deploy` ，然后你的 dist 目录就会发到你们仓库的 gh-pages 分支了

#### ii. 开始部署

打包文件上传好之后，你需要做的第一件事就是连接好你的服务器。然后在 cd 到服务器根目录下面，在 `data/www` 目录下面将你的项目 `git clone` 下来。然后切换到 `gh-pages` 分支

接下来，开始配置你的 nginx （还没下载 nginx 的同学请自行解决）

```nginx
 server {
  # 端口，默认是 80
  listen 81;
  # 服务名(写域名或者 ip 地址都可以)
  server_name 123.12.123.12;
  # server 根目录
  root  /data/www/nuxt-ssr-demo;
  # 主入口文件
  index  index.html;
  # 反向代理
  location /api/ {
    proxy_pass https://xxx.target.com/;
  }
}
```

然后重启 nginx

```shell
sudo service nginx restart
```


### 2、服务器端渲染部署

看到上面静态化页面部署，详细有同学会问。进行静态化页面部署，岂不是没有了服务器端渲染的优势了。

对的，如果你的项目只是静态页面的话，做静态化部署是完全 OJBK 的。但如果牵扯到请求，还是乖乖的进行服务器端的部署吧 ~ 

开始前，请确保你的服务器上已经搭建好了 node 环境。没有的同学，我建议使用 [nvm](https://github.com/creationix/nvm/blob/master/README.md) 安装 node 。接下来，开始部署

#### i. 进行服务代理

第一步，将之前 clone 下面的 git 项目切换到主开发分支，然后为了之后的方便修改一下你的 ` package.json` 

```json
"scripts": {
  "build": "npm run lint && nuxt build && npm start",
  "start": "nuxt start"
}
```

第二步，启动服务

```shell
npm run build
```

第三步，配置你的 nginx 文件

```nginx
# 通过 upstream nodejs 可以配置多台 nodejs 节点，做负载均衡
# keepalive 设置存活时间。如果不设置可能会产生大量的 timewait
# proxy_pass 反向代理转发 http://nodejs

upstream nodenuxt {
    server 127.0.0.1:3000; # nuxt 项目监听端口
    keepalive 64;
}
server {
  listen 80;
  server_name www.qiangdada.cn;
  
  location / {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Nginx-Proxy true;
    proxy_cache_bypass $http_upgrade;
    proxy_pass http://nodenuxt; # 反向代理
  }
}
```

最后，重新启动 nginx 服务

```shell
sudo service nginx restart
```

#### ii. 使用 pm2 做进程守护

如果我们按照上面的步骤进行部署的话，服务器会经常断掉连接，那我们的服务也就断了。所以为了守护好我们的 nodejs 进程，这里我将使用 pm2 对进程进行守护

首先全局安装 pm2

```shell
npm i pm2 -g
```

然后进入到项目目录，执行

```shell
pm2 start npm --name "nuxt-ssr-demo" -- run build
```
然后，再也不用担心我的 nodejs 进程说断就断

对于 pm2 用法，请输入 `pm2 --help` 然后自行查阅

pm2 start npm --name "nuxt-ssr-dealers" -- run build
cd ../www/wwwroot/admin.mythinkcar.cn

pm2 start npm --name "nuxt-ssr-op" -- run build
cd ../www/wwwroot/op.mythinkcar.cn
pm2 list
pm2 stop 1
pm2 restart 1

## 最后

对于 `Nuxt`，在使用层面，是比较简单、好上手的。相对 vue-ssr 来说，它大大的简化了开发的配置，让开发人员可以只需思考业务的开发，而不用太去担心文件的配置。其中 `Nuxt` 通过监听 pages 目录文件变更并自动生成路由更是直接省去了我们平常对于路由的配置。

但是，目前 `Nuxt` 整体还是有待提高的，目前社区相关的三方插件比较有限，市面上相关的参考资料也相对比较少。


