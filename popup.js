// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var app = angular.module('App',[]);
app.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data|chrome-extension):/);
}]);

app.controller('AppControl',function($scope){
  var vm = this;
  var bg = chrome.extension.getBackgroundPage();
  console.log(bg)
  this.data = bg.data;

  var label = [];
  var dataset = [];
  var colors = [];
  var id = [];
  for (var item in bg.data){
    label.push(item)
    dataset.push(bg.data[item].duration)
    colors.push(dynamicColors())
    id.push('1')
  }
  console.log(label)
  console.log(dataset)

  var ctx = document.getElementById("myChart").getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        datasets:[{
          data:dataset,
          stack: id,
          backgroundColor:colors
        }],
        labels:label
      },
      options:{
        legend:{
          display: false
        }
      }
  });


});

var dynamicColors = function() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            return "rgb(" + r + "," + g + "," + b + ")";
         };
