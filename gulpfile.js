var gulp = require('gulp') // 将 gulp 插件包含进来
var sass = require('gulp-sass') // 包含 sass 转换为 css 插件
var less = require('gulp-less') // 包含 less 转换为 css 插件
var connect = require('gulp-connect') // 包含服务器插件, 定义 http 服务器, 默认监听 8080
var concat = require('gulp-concat') // 合并文件
var rename = require('gulp-rename') // 重命名文件
var uglify = require('gulp-uglify') // 压缩 js
var minifyCSS = require('gulp-minify-css') // 压缩 css
var imagemin = require('gulp-imagemin') // 优化图片
var autoprefixer = require('gulp-autoprefixer') // 自动处理 css 前缀
var htmlminify = require('gulp-html-minify') // 压缩 html
var csso = require('gulp-cssno') // 压缩优化 css
var revall = require('gul-rev-all') // 生成版本号
var del = require('del') //
var useref = require('gulp-useref') // 解析 html 的构建块
var filter = require('gulp-filter') // 过滤

gulp.task('hello', function() {
	console.log('hello gulp')
})

// 复制文件到指定文件夹
gulp.task('copy-indent', function() {
	// gulp.src(): 需要改变文件的路径
	// 所有文件 */*.*
	// pipe(): 执行方法
	gulp
	gulp
		// .src(['xml/*.xml', 'json/*.json', '!json/secre-*.json'])
		.src('src/*.html')
		.pipe(gulp.dest('dist'))
		.pipe(connect.reload())
	// images/**/* images目录下的所有子目录和所有东西(包含东西最多)
	// images/*/*  images目录下的东西和子目录下的东西
	// images/*.{png,jpg} images目录下的所有以png和jpg为后缀名的图片
})

// 默认任务
gulp.task('default', function() {
	console.log('default')
})

// less 转换为 css
gulp.task('less', function() {
	gulp
		.src('src/**/*.less')
		.pipe(less())
		// gulp.dest(): 目标路径, 处理后文件存储路径
		.pipe(gulp.dest('dist/css'))
})

// 监听 XX 文件, 发现有变动时, 启动 style 方法
gulp.task('watch', function() {
	gulp.watch('src/**/*.less', ['style'])
})

// 设置本地任务, 定义 http 服务器, 默认监听 8080
gulp.task('serve', function() {
	connect.server({
		// 服务器根目录
		root: 'public',
		// 实时刷新任务
		livereload: true
	})
	gulp.watch('public/**/*.*', ['reload'])
})

gulp.task('reload', function() {
	gulp.src('./**/*.*').pipe(connect.reload())
})

// css 自动添加前缀，整合，压缩
gulp.task('concat-css', function() {
	gulp
		.src('app/src/css/*.css')
		.pipe(concat('all.css')) // 合并 css 并命名为 all.css, pipe() 执行方法
		.pipe(gulp.dest('app/dist/css')) // 目标路径, 处理后文件存储路径
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
    
gulp.task('default', ['del'], function() {
	var jsFilter = filter('**/*.js', { restore: true })
	var cssFilter = filter('**/*.css', { restore: true })
	var htmlFilter = filter(['**/*.html'], { restore: true })
	gulp
		.src('/*.html')
		.pipe(useref()) // 解析html中的构建块
		.pipe(jsFilter) // 过滤所有js
		.pipe(uglify()) // 压缩js
		.pipe(jsFilter.restore)
		.pipe(cssFilter) // 过滤所有css
		.pipe(csso()) // 压缩优化css
		.pipe(cssFilter.restore)
		.pipe(
			RevAll.revision({
				// 生成版本号
				dontRenameFile: ['.html'], // 不给 html 文件添加版本号
				dontUpdateReference: ['.html'] // 不给文件里链接的html加版本号
			})
		)
		.pipe(htmlFilter) // 过滤所有html
		.pipe(htmlmini()) // 压缩html
		.pipe(htmlFilter.restore)
		.pipe(gulp.dest('/dist'))
})

gulp.task('del', function() {
	del('/dist') // 构建前先删除dist文件里的旧版本
})
