## 必须安装好nodejs程序!

[安装地址](http://nodejs.org/)

## dist 目录使用说明

```
dist
  |- images                      # 对应 test/abc-test-src
  |    |- h-bg
  |    |- h-box
  |    |- h-ele
  |    |- v-bg
  |    |- v-box
  |    `- v-ele
  |
  |- node-ab-ccss.js              # 主程序             [3]
  |- node-ab-ccss-start-mac       # mac 的执行程序      [4]
  |- node-ab-ccss-install-mac     # mac 的安装程序      [1]
  |- node-ab-ccss-start.bat       # windows 的执行程序  [4]
  |- node-ab-ccss-install.bat     # windows 的安装程序  [1]
  `- node-ab-ccss-files.txt       # 文件列表            [2]
```

以下为建议步骤（与上方序列对应）：

* [0] 下载 demo

  > mac 用户需要对 `node-ab-ccss-install-mac` 和 `node-ab-ccss-start-mac` 进行赋权，命令可为`chmod u+x node-ab-ccss-install-mac`

* [1] 下载完之后，**点击对应系统的安装程序**进行安装（建议）

  > 也可以在 demo 目录运行 cmd 命令 `npm install node-ab-ccss`

* [2] **编辑好文件列表**所需的操作目录、生成文件、操作参数，[详情请看下方说明](#node-ab-ccss-filestxt)

* [3] 如有需要可修改主程序

  > 函数 `ccss.run(rootPath, filePath)` 的第1个参数决定根目录

* [4] **点击对应系统的执行程序**（建议）

  > 也可以在 demo 目录运行 cmd 命令 `node node-ab-ccss`


## 文件及其参数说明

### 图片命名

[ [# + ] number + [空格] + ] filename + [ + && + filename + ... ] + [ # + optFilename/key=value ] + .jpg/.png/.gif

* 当文件名以 `#` 号作为开头，则不对此文件做任何处理，即屏蔽此文件

* 文件名前的 number 和 空格 不会出现在生成的类名中（因为合法类名前不该包含；用户可通过添加数字去固定图片的排列顺序）

* 当文件名中出现 `&&` 则表示**多个类指向同一个图片文件，引用同样的 css**

* `#key=value` 为快捷操作参数，现在仅支持 `#pos=posVal` ( `posVal` 为 `middle / bottom / right`)

* `#optFilename` 为对应的操作文件名

***

### node-ab-ccss.js

```
var ccss = require("node-ab-ccss");

ccss.run(__dirname, "/node-ab-ccss-files.txt");
```

* `ccss.run` 的**第一个参数必须为网站根目录**，这里为的当前目录为 `__dirname`

***

### node-ab-ccss-files.txt

```
/images/v-ele
    /img/v-ele.png
    /css/combine.css
    {"type":"v-ele", "sep":0, "comment":"v-ele 注释||路径为/css/v-ele.css", "pre":"#hello", "css":"display:inline-block;"}
```

#### 第1行：

需要处理的图片目录，使用绝对路径（其根目录由 node-ab-ccss.js 获取的第一个参数决定）

#### 第2行：

需要生成的合成图片

#### 第3行：

需要生成的合成 css 文件

#### 第4行：

标准 JSON 格式的参数（**必须为一行**）

* **type** => 【必填】排列类型

  * **h-ele** => **水平排列的独立图片**（下方可选）

    * 图片垂直居中（文件名结尾选以下之一）

      1. "#pos=middle"

      2. "#optFilename.txt"(详情请看 [optFilename.txt](#optFilenametxt)) 

    * 图片靠下（文件名结尾选以下之一）

      1. "#pos=bottom"

      2. "#optFilename.txt"(详情请看 [optFilename.txt](#optFilenametxt)) 

  * **v-ele** => **垂直排列的独立图片**（下方可选）

    * 图片左右居中（文件名结尾选以下之一）

      1. "#pos=middle"

      2. "#optFilename.txt"(详情请看 [optFilename.txt](#optFilenametxt)) 

    * 图片靠右（文件名结尾选以下之一）

      1. "#pos=right"

      2. "#optFilename.txt"(详情请看 [optFilename.txt](#optFilenametxt)) 

  * **h-bg** => **水平平铺的背景**

    > 图片宽度会左右拉伸到最宽图片宽度

  * **v-bg** => **垂直平铺的背景**

    > 图片高度会上下拉伸到最高图片高度

  * **h-box** => **水平嵌套的背景**（下方可选）

    * 图片左右拉伸（文件名结尾选以下之一）

      1. "#pos=middle"

      2. "#optFilename.txt"(详情请看 [optFilename.txt](#optFilenametxt)) 

    * 图片靠右（文件名结尾选以下之一）

      1. "#pos=right"

      2. "#optFilename.txt"(详情请看 [optFilename.txt](#optFilenametxt)) 

  * **v-box** => **垂直嵌套的背景**（下方可选）

    * 图片上下拉伸（文件名结尾选以下之一）

      1. "#pos=middle"

      2. "#optFilename.txt"(详情请看 [optFilename.txt](#optFilenametxt)) 

    * 图片靠下（文件名结尾选以下之一）

      1. "#pos=bottom"

      2. "#optFilename.txt"(详情请看 [optFilename.txt](#optFilenametxt)) 

* **sep** => 【选填】图片相隔距离，默认为 0（在IE6使用css sprite技术，图片间不能紧贴，因为会溢出0.5px）

* **comment** => 【选填】注释，默认为""，多行注释，请用 "||" 分割

* **pre** => 【选填】父类（标签名、 ID 、 类名），默认为 ""

* **css** => 【选填】需要追加的css kv值，默认为 ""

  * 所有类型，追加`background`无效

  * `h-ele`、`v-ele`类型，追加`width`、`height`无效

  * `h-box`类型，追加`height`无效

    * 且`pos`为`right`，追加`padding-right`无效

    * 且`pos`非`right`或`middle`，追加`padding-left`无效

  * `v-box`类型，追加`width`无效

    * 且`pos`为`bottom`，追加`padding-bottom`无效

    * 且`pos`非`bottom`或`middle`，追加`padding-top`无效

  * 最终生成的 css 的顺序不一定会按输入的顺序

#### 注意：

当处理多文件时，区域与区域之间至少相隔1行

***

### optFilename.txt

#### 格式：

* **属性名**要紧贴左边；

* **属性值**需要空出至少1个空格或tab（建议4个空格或1个tab）；

* **属性与属性之间**相隔至少1行（建议1行）

#### 参数：

> 添加后，会重置`node-ab-ccss-files.txt`对应的相关参数

* **after** => 伪类、元素选择器等，如`:link / :eq(0) / [type="value"] /...`，包含自身类名则添加`$self`（因为添加 after 后，默认不会添加自身类名）

* **css** => 需要追加的css kv值

  * 所有类型，追加`background`无效

  * `h-ele`、`v-ele`类型，追加`width`、`height`无效

  * `h-box`类型，追加`height`无效

    * 且`pos`为`right`，追加`padding-right`无效

    * 且`pos`非`right`或`middle`，追加`padding-left`无效

  * `v-box`类型，追加`width`无效

    * 且`pos`为`bottom`，追加`padding-bottom`无效

    * 且`pos`非`bottom`或`middle`，追加`padding-top`无效

  * 最终生成的 css 的顺序不一定会按输入的顺序

* **pre** => 父类（标签名、 ID 、 类名）

* **pos** => 定位，取值 `middle`（居中）、`bottom`（靠底）、`right`（靠右）


## 使用建议

* 建议目录：

  ```
  project
      |- website
      |
      `- node-abc                          # 命名随意，最好是英文
           |- node-ab-ccss.js              # 主程序
           |- node-ab-ccss-start.bat       # windows 的执行程序
           |- node-ab-ccss-install.bat     # windows 的安装程序（使用完后可删除）
           `- node-ab-ccss-files.txt       # 文件列表
  ```
  
  > 对 `node-ab-ccss.js` 中的 `ccss.run(__dirname, "/node-ab-ccss-files.txt")` 改为 `ccss.run(__dirname + "/../", "/node-ab-ccss-files.txt")`

* 本程序在**多核cpu、处理小文件**上会运行得更快