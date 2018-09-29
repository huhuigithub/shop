'use strict'

var gulp = require('gulp');
var less = require('gulp-less');//引入gulp-less
var connect = require('gulp-connect');
gulp.task('letusless',function(){//将less转成css
  gulp.src('src/app/**/*.less')
  .pipe(less())
  .pipe(gulp.dest('src/app/css'))
})

//通过gulp启动http服务
gulp.task('connect',function(){
  connect.server({
    name:'devServer',
    root:'src',
    port:'3101'
  });
})

gulp.task('watch-less',function(){
  gulp.watch('src/app/**/*.less',['letusless'])
})

gulp.task('go',['letusless','connect','watch-less'],function(){
  console.log('服务启动成功');
})
