const gulp = require('gulp')
const less = require('gulp-less')
const connect = require('gulp-connect')

gulp.task('hello', function() {
	console.log('hello gulp')
})

// copy file
gulp.task('dest', function() {
	// 所有文件 */*.*
	// pipe: 文件走向下一节
	gulp.src('src/*.html').pipe(gulp.dest('dist/'))
})

// default task
gulp.task('default', function() {
	console.log('default')
	// 监视文件, 有变化执行对应任务
	gulp.watch('src/*', ['dest'])
})

// less 转换为 less
gulp.task('style', function() {
	gulp
		.src('src/**/*.less')
		.pipe(less())
		.pipe(gulp.dest('dist/'))
})

// 监听 style 任务
gulp.task('watch', function() {
	gulp.watch('src/**/*.less', ['style'])
})

// 定义 http 服务器, 默认监听 8080
gulp.task('serve', function() {
	connect.server({
		root: 'public',
		// 文件变化刷新网页
		livereload: true
	})
	gulp.watch('public/**/*.*', ['reload'])
})

gulp.task('reload', function() {
	gulp.src('./**/*.*').pipe(connect.reload())
})
