var gulp = require("gulp"); // 将 gulp 插件包含进来
var sass = require("gulp-sass"); // 包含 sass 转换为 css 插件
var less = require("gulp-less"); // 包含 less 转换为 css 插件
var connect = require("gulp-connect"); // 包含服务器插件, 定义 http 服务器, 默认监听 8080
var concat = require("gulp-concat"); // 合并文件
var rename = require("gulp-rename"); // 重命名文件
var uglify = require("gulp-uglify"); // 压缩 js
var minifyCSS = require("gulp-minify-css"); // 压缩 css
var cleanCSS = require('gulp-clean-css'); // 压缩 css
var imagemin = require("gulp-imagemin"); // 优化图片
var autoprefixer = require("gulp-autoprefixer"); // 自动处理 css 前缀
var htmlmin = require("gulp-htmlmin") // 压缩 html
var htmlminify = require("gulp-html-minify"); // 压缩 html
var csso = require("gulp-cssno"); // 压缩优化 css
var revall = require("gul-rev-all"); // 生成版本号
var del = require("del"); // 使用globs删除文件和文件夹
var useref = require("gulp-useref"); // 解析 html 的构建块
var filter = require("gulp-filter"); // 过滤
var livereload = require('gulp-livereload'); // 模块用于自动刷新浏览器
var $ = require('gulp-load-plugins')() // 提前打包所有 gulp 插件, 可以加载 package.json 文件中所有的 gulp 模块

// js/app.js 指定确切的文件名
// js/*.js 某个目录所有后缀名为 js 的文件
// src(!js/app.js) 除了 js/app.js 以外的所有文件
// images/**/* images 目录下的所有子目录和所有东西(包含东西最多)
// images/*/*  images 目录下的东西和子目录下的东西
// images/*.{png,jpg} images目录下的所有以png和jpg为后缀名的图片
// gulp.src(['js/ **/*.js', '!js/**/*.min.js'])

/**
 * task(): 定义任务
 * src(): 指定处理文件, 数据读取到 gulp 内存中
 * dest(): 处理后文件存储路径, 临时输出文件到本地
 * pipe(): 执行方法
 * watch(): 监视文件。一旦文件变动，就运行指定任务。
 */
// cwd 字段指定写入路径的基准目录，默认是当前目录； mode 字段指定写入文件的权限，默认是 0777 。
gulp.dest('build', {
  cwd:'./app',
  mode:'0644'
})

/* 复制文件到指定文件夹 */
gulp.task("copy-indent", function() {
  gulp
    .src("src/*.html")
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload());
});

// 默认任务, 先执行 'js', 'css', 'html', 'less' 任务后执行 default 任务
gulp.task("default", ['js', 'css', 'html', 'less'], function() {
  console.log("default");
});

// 注册合并压缩 html 任务
gulp.task('html',['less'], function () {
  return gulp.src('index.html')
    .pipe(htmlmin({collapseWhitespace: true})) // 压缩 html
    .pipe(gulp.dest('dist/'))
    .pipe(livereload()) // 实时刷新
})

// 注册合并压缩 css 任务
gulp.task('css',['less'], function () {
  return gulp.src('src/css/**/*.css')
    .pipe(concat('build.css')) // 合并文件
    .pipe(rename({suffix: '.min'})) // 重命名
    .pipe(cleanCSS({compatibility: 'ie8'})) // 压缩 js
    .pipe(gulp.dest('dist/css/'))
    .pipe(livereload()) // 实时刷新
})

// 注册合并压缩 js 任务
gulp.task('js', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(concat('build.js')) // 合并文件
    .pipe(gulp.dest('dist/js/'))
    .pipe(uglify()) // 压缩 js
    .pipe(rename({suffix: '.min'})) // 重命名
    .pipe(gulp.dest('dist/js/'))
    .pipe(livereload()); // 实时刷新
})

// less 转换为 css
gulp.task("less", function() {
  return gulp
    .src("src/**/*.less")
    .pipe(less())
    .pipe(gulp.dest("dist/css"))
    .pipe(livereload()) // 实时刷新
});
// gulp-load-plugins
gulp.task("less", function() {
  return gulp
    .src("src/**/*.less")
    .pipe($.less())
    .pipe(gulp.dest("dist/css"))
    .pipe($.livereload()) // 实时刷新
});

// 监听, 实时刷新
gulp.task("watch", ['default'], function() {
  // 开启监听
  livereload.listen();
  // watch(): 监听 src/**/*.less 文件, 发现有变动时, 启动 style 方法
  gulp.watch("src/**/*.less", ["style"]);
  gulp.watch(["src/**/*.less", 'src/**/*.css'], ["css"])
    .pipe(livereload()) // 实时刷新
    .pipe(connect.reload()); // 实时刷新
});
// watch 方法所监控的文件发生变化时（修改、增加、删除文件），会触发 change 事件。可以对 change 事件指定回调函数。
// var watcher = gulp.watch('templates/*.tmpl.html', [ 'build' ] );
// watcher.on('change', function(event) {
//    console.log('Event type:' + event.type);
//    console.log('Event path:' + event.path);
// });
// watch 方法还可能触发以下事件。
// end ：回调函数运行完毕时触发。
// error ：发生错误时触发。
// ready ：当开始监听文件时触发。
// nomatch ：没有匹配的监听文件时触发。
// watcher 对象还包含其他一些方法。
// watcher.end() ：停止 watcher 对象，不会再调用任务或回调函数。
// watcher.files() ：返回 watcher 对象监视的文件。
// watcher.add(glob) ：增加所要监视的文件，它还可以附件第二个参数，表示回调函数。
// watcher.remove(filepath) ：从 watcher 对象中移走一个监视的文件。

// 设置本地任务, 定义 http 服务器, 默认监听 8080
gulp.task("server", function() {
  connect.server({
    // 服务器根目录
    root: "public",
    // 实时刷新任务
    livereload: true,
    port: 5000
  });
  open('http://localhost:5000/') // 自动打开连接
  gulp.watch("public/**/*.*", ["reload"]);
});

// 重新加载
gulp.task("reload", function() {
  return gulp
    .src("./**/*.*")
    .pipe(connect.reload());
});

// css 自动添加前缀，整合，压缩
gulp.task("concat-css", function() {
  return gulp
    .src("app/src/css/*.css")
    .pipe(concat("all.css")) // 合并 css 并命名为 all.css
    .pipe(gulp.dest("app/dist/css")) // 临时输出文件到本地
    .pipe(
      autoprefixer({
        // 自动添加前缀
        browers: ["5%", "Android >=2.3"]
      })
    )
    .pipe(rename("allAuto.css"))
    .pipe(gulp.dest("app/dist/css"))
    .pipe(minifyCSS()) // 压缩
    .pipe(rename("all.min.css")) // 重命名
    .pipe(gulp.dest("app/dist/css"));
});

gulp.task("default", ["del"], function() {
  var jsFilter = filter("**/*.js", { restore: true });
  var cssFilter = filter("**/*.css", { restore: true });
  var htmlFilter = filter(["**/*.html"], { restore: true });
  return gulp
    .src("/*.html")
    .pipe(useref()) // 解析 html 中的构建块
    .pipe(jsFilter) // 过滤所有 js
    .pipe(uglify()) // 压缩 js
    .pipe(jsFilter.restore)
    .pipe(cssFilter) // 过滤所有 css
    .pipe(csso()) // 压缩优化 css
    .pipe(cssFilter.restore)
    .pipe(
      RevAll.revision({
        // 生成版本号
        dontRenameFile: [".html"], // 不给 html 文件添加版本号
        dontUpdateReference: [".html"] // 不给文件里链接的 html 加版本号
      })
    )
    .pipe(htmlFilter) // 过滤所有 html
    .pipe(htmlmini()) // 压缩 html
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest("/dist"));
});

gulp.task("del", function() {
  del("/dist"); // 构建前先删除 dist 文件里的旧版本
});
