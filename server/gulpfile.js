"use strict";

var gulp = require('gulp'),
    clean = require('gulp-clean'),
    runSequence = require('run-sequence'),
    replace = require('gulp-token-replace'),
    jshint = require('gulp-jshint');

// Clean
gulp.task('clean', function() {
  return gulp.src(['dist'], {read: false})
    .pipe(clean());
});

// Default task
gulp.task('default', ['clean'], function() {
  var config = require('./src/config/keys.js');
  return gulp.src(['src/**/*.*', '!src/config/**'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(replace({global:config}))
    .pipe(gulp.dest('dist'));
});