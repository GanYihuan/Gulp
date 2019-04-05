# gulp

## 依赖插件

```node
cnpm i gulp -g
cnpm i gulp -D
<!-- 运行: -->
gulp taskName
```

```js
let gulp = require('gulp') // 将 gulp 插件包含进来
let sass = require('gulp-sass') // 包含 sass 转换为 css 插件
let less = require('gulp-less') // 包含 less 转换为 css 插件
let jade = require('gulp-jade') // 包含 less 转换为 css 插件
let connect = require('gulp-connect') // 包含服务器插件, 定义 http 服务器, 默认监听 8080
let concat = require('gulp-concat') // 合并文件
let rename = require('gulp-rename') // 重命名文件
let uglify = require('gulp-uglify') // 压缩 js
let minifyCSS = require('gulp-minify-css') // 压缩 css
let cleanCSS = require('gulp-clean-css') // 压缩 css
let imagemin = require('gulp-imagemin') // 优化图片
let autoprefixer = require('gulp-autoprefixer') // 自动处理 css 前缀
let htmlmin = require('gulp-htmlmin') // 压缩 html
let htmlminify = require('gulp-html-minify') // 压缩 html
let csso = require('gulp-cssno') // 压缩优化 css
let revall = require('gul-rev-all') // 生成版本号
let del = require('del') // 使用globs删除文件和文件夹
let useref = require('gulp-useref') // 解析 html 的构建块
let filter = require('gulp-filter') // 过滤
let livereload = require('gulp-livereload') // 模块用于自动刷新浏览器
let $ = require('gulp-load-plugins')() // 提前打包所有 gulp 插件, 可以加载 package.json 文件中所有的 gulp 模块
```

## 文件匹配

```txt
js/app.js 指定确切的文件名
js/*.js 某个目录所有后缀名为 js 的文件
!js/app.js 除了 js/app.js 以外的所有文件
images/**/* images 目录下的所有子目录和所有东西(包含东西最多)
images/*/*  images 目录下的东西和子目录下的东西
images/*.{png,jpg} images目录下的所有以png和jpg为后缀名的图片
```

## 临时输出文件到本地

```js
// cwd 字段指定写入路径的基准目录，默认是当前目录；
// mode 字段指定写入文件的权限，默认是 0777 。
// dest(): 处理后文件存储路径, 临时输出文件到本地
gulp.dest('build', {
  cwd: './app',
  mode: '0644'
})
```

## 默认任务

```js
// 默认任务, 先执行 'js', 'css', 'html', 'less' 任务后执行 default 任务
// task(): 定义任务
gulp.task('default', ['js', 'css', 'html', 'less'], function() {
  console.log('default')
})
```

## 复制文件到指定文件夹

```js
// 复制文件到指定文件夹
// pipe(): 执行方法
gulp.task('copy-indent', function() {
  gulp
    .src('src/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload())
})
```

## 注册合并压缩 html 任务

```js
// 注册合并压缩 html 任务
gulp.task('html', ['less'], function() {
  return gulp
    .src('index.html')
    .pipe(htmlmin({ collapseWhitespace: true })) // 压缩 html
    .pipe(gulp.dest('dist/'))
    .pipe(livereload()) // 实时刷新
})
```

## 注册合并压缩 css 任务

```js
// 注册合并压缩 css 任务
gulp.task('css', ['less'], function() {
  return gulp
    .src('src/css/**/*.css')
    .pipe(concat('build.css')) // 合并文件
    .pipe(rename({ suffix: '.min' })) // 重命名
    .pipe(cleanCSS({ compatibility: 'ie8' })) // 压缩 js
    .pipe(gulp.dest('dist/css/')) // 输出到指定目录
    .pipe(livereload()) // 实时刷新
})
```

## 注册合并压缩 js 任务

```js
// 注册合并压缩 js 任务
gulp.task('js', function() {
  return gulp
    .src('src/js/**/*.js')
    .pipe(concat('build.js')) // 合并文件
    .pipe(gulp.dest('dist/js/')) // 输出到指定目录
    .pipe(uglify()) // 压缩 js
    .pipe(rename({ suffix: '.min' })) // 重命名
    .pipe(gulp.dest('dist/js/')) // 输出到指定目录
    .pipe(livereload()) // 实时刷新
})
```

## less 转换为 css

```js
// less 转换为 css
gulp.task('less', function() {
  return gulp
    .src('src/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload()) // 实时刷新
})
// gulp-load-plugins
gulp.task('less', function() {
  return gulp
    .src('src/**/*.less')
    .pipe($.less())
    .pipe(gulp.dest('dist/css'))
    .pipe($.livereload()) // 实时刷新
})
```

## 监听, 实时刷新

```js
// watch(): 监视文件。一旦文件变动，就运行指定任务
// watch 方法还可能触发以下事件。
// end：回调函数运行完毕时触发。
// error：发生错误时触发。
// ready：当开始监听文件时触发。
// nomatch：没有匹配的监听文件时触发。
// watcher 对象还包含其他一些方法。
// watcher.end() ：停止 watcher 对象，不会再调用任务或回调函数。
// watcher.files() ：返回 watcher 对象监视的文件。
// watcher.add(glob) ：增加所要监视的文件，它还可以附件第二个参数，表示回调函数。
// watcher.remove(filepath) ：从 watcher 对象中移走一个监视的文件。
gulp.task('watch', ['default'], function() {
  livereload.listen() // 开启监听
  gulp.watch('src/**/*.less', ['style']) // watch(): 监听 src/**/*.less 文件, 发现有变动时, 启动 style 方法
  gulp
    .watch(['src/**/*.less', 'src/**/*.css'], ['css'])
    .pipe(livereload()) // 实时刷新
    .pipe(connect.reload()) // 实时刷新
})
```

## 设置本地任务, 定义 http 服务器, 默认监听 8080

```js
// 设置本地任务, 定义 http 服务器, 默认监听 8080
gulp.task('server', function() {
  connect.server({
    // 服务器根目录
    root: 'public',
    // 实时刷新任务
    livereload: true,
    port: 5000
  })
  open('http://localhost:5000/') // 自动打开连接
  gulp.watch('public/**/*.*', ['reload'])
})
```

## 重新加载

```js
// 重新加载
gulp.task('reload', function() {
  return gulp.src('./**/*.*').pipe(connect.reload())
})
```

## css 自动添加前缀，整合，压缩

```js
// css 自动添加前缀，整合，压缩
gulp.task('concat-css', function() {
  return gulp
    .src('app/src/css/*.css')
    .pipe(concat('all.css')) // 合并 css 并命名为 all.css
    .pipe(gulp.dest('app/dist/css')) // 临时输出文件到本地
    .pipe(
      autoprefixer({
        // 自动添加前缀
        browers: ['5%', 'Android >=2.3']
      })
    )
    .pipe(rename('allAuto.css'))
    .pipe(gulp.dest('app/dist/css'))
    .pipe(minifyCSS()) // 压缩
    .pipe(rename('all.min.css')) // 重命名
    .pipe(gulp.dest('app/dist/css'))
})
```

## 构建前先删除 dist 文件里的旧版本

```js
// 构建前先删除 dist 文件里的旧版本
gulp.task('del', function() {
  del('/dist')
})
```

## 内容大纲

![内容大纲](https://i.loli.net/2019/04/05/5ca6cc0e86879.jpeg)
