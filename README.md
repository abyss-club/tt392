# TT392

一个新的讨论版程序。此为前端项目。

## 功能设计

参见 Abyss 的 [开发需求](https://gitlab.com/abyss.club/uexky).

## 简述

* 使用 react 16, react-router-4 制作的单页面 web 应用
* API 使用 [graphql](https://graphql.org/)，API schema [见此](https://gitlab.com/abyss.club/abyss/blob/master/api.gql)，在前端使用 
[react-apollo](https://github.com/apollographql/react-apollo) 作为客户端。

## GraphQL 相关工具 

url: `/graphiql/`

* GraphiQL，API 调试工具

url: `/voyager/`

* voyager，API 展示

## 串/Thread

### Thread 列表

url: `/`

* 展示 Thread 列表，如果用户没有登录，显示默认 tags 的 Thread 首页
* 如果用户登录，显示根据用户已订阅 tag 生成的首页
* 可以在此页面按 tag 过滤
* 不显示分页，而是连续加载
* 显示发布 Thread 的输入框
* Thread 可以展开，收起

url 参数：

|name|required|description|
|----|----|----|
|tags|no|tag列表，默认为推荐tag列表（后台配置）|

### Thread 详情

url: `/th/<th:id>/`
* 展示一个 Thread 的所有 posts，连续加载
* 从 `/` 到 `/th/<th:id>/` 不跳转而只是 url 变化，用以复制链接分享
* 可以回帖和引用他人回复，可以引用多人
* 点击引用内容和向下的按钮，可以在引用的帖子和被引用的帖子之间滚动
* 作者可以修改子 tag

### POST 详情

url: `/th/<th:id>/p/<p:id>`
* 单独展示一个 post
* 从 `/th/<th:id>/` 到 `/th/<th:id>/p/<p:id>`, 不跳转而只是 url 变化，用以复制链接分享

## 账户

url: `/profile/`
* 展示用户 token 提醒用户注意保护和保存
* 展示当前账户下的用户

### 发布的帖子列表

* url: `/profile/thread/` 讨论串列表
* url: `/profile/post/` 回复列表

### 通知

* url: `/profile/notice/thread/` 讨论串被回复的通知
* url: `/profile/notice/post/` 帖子被回复的通知
* url: `/profile/notice/system/` 系统通知（通知各种管理事件）

## 用户

* 用户指一个发言昵称或者一个匿名ID，此昵称全局唯一

* url: `/user/<name>/` 具名用户页
* url: `/user/a/<anonymous-id>/` 匿名用户页

### 发布的帖子列表

* url: `/user/<name>/thread/` 讨论串列表
* url: `/user/<name>/post/` 回复列表
* url: `/user/a/<anonymous-id>/post/` 匿名用户回复列表（只可能在一个帖子内）

## 标签

url: `/tag/`
* 展示所有主 tag 及下属热门子 tag

### 标签详情

url: `/tag/<tag-name>/`
* 展示 tag 的名称，帖子列表
* 显示 tag 简介，说明

## 管理员

### Thread 列表，详情

在同样的页面下，多出了以下功能：

* 修改 tag
* 下沉、删除、锁定 thread，删除 post
* 禁止某条post的发言人/IP的发言功能

### 管理页面

url: `/admin/`
* 下沉、删除、锁定 thread，删除 post 的列表
* 被禁言的用户/IP 列表
* 上述两个列表均有 撤销按钮
