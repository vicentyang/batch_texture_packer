#batch_texture_packer

—— By Vicent

-----------------------------------
![](https://github.com/vicentyang/batch_texture_packer/blob/master/img1.png)

### Environment

* Texuture Command Line
* Node.js
* Electron(没有electron 可以在代码中配置好路径在终端执行)

### Publish

**Install Dependence**

  * [Texuture Command Line](打开TexuturePacker， 左上角点击TexuturePacker，找到commontools,根据提示安装)
  * [Electron](https://nodejs.org/) `sudo npm install -g electron-prebuilt`

**注意**
  * 目前支持三种格式的输出

  * 还没有兼容多层目录的情况

  * 使用的是TexturePacker的命令行，有新的想法就是直接使用[gka](https://github.com/gkajs/gka) 有时间再折腾

## 发布桌面 app
  ```
  electron-packager /Users/vicent/Sites/vicent_beta/batch_texture_packer batch_texture_packer --overwrite to force
  ```
