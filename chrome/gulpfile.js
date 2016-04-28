"use strict";

var gulp = require('gulp'),
    cleancss = require('gulp-clean-css'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    runSequence = require('run-sequence'),
    replace = require('gulp-token-replace'),
    jshint = require('gulp-jshint');

// Styles
gulp.task('styles', function() {
  return gulp.src('src/styles/**')
    .pipe(gulp.dest('dist/styles'))
    .pipe(cleancss())
    .pipe(gulp.dest('dist/styles'));
});

// Scripts
gulp.task('scripts', function() {
  var config = require('./src/config/keys.js');
  return gulp.src(['src/scripts/**/*.js', 'src/scripts/lib/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(replace({global:config}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
});

// HTML
gulp.task('html', function() {
  return gulp.src(['src/*.html'])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

// Other files
gulp.task('other', function() {
  return gulp.src([
    'src/*.*',
    'src/images/**',
    '!src/*.html',
    '!src/config/*'
  ], {
    base: 'src',
    dot: true
  }).pipe(gulp.dest('dist'));
});

// Clean
gulp.task('clean', function() {
  return gulp.src(['dist'], {read: false})
    .pipe(clean());
});

// Default task
gulp.task('default', ['clean'], function() {
    runSequence('styles', 'scripts', 'html', 'other');
});