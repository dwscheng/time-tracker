// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
//open popup table
//window.open(chrome.extension.getURL("popup.html"),"gc-popout-window","width=600,height=300")

var data = [];
var reftime, current
initialize();

function initialize(){
  //set reftime to current time
  reftime = new Date()
  //get currently active tab in window
  chrome.tabs.query({active:true,lastFocusedWindow: true},function(result){
    current = result[0];
  })
}

//on tabs update
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
  if(changeInfo.status === "complete"){
    console.log('tab updated')
    //console.log(changeInfo)
    //start timer for completed tabs
    KeepTime(tab,'tab','tab update')
  }
});
//on tabs change
chrome.tabs.onActivated.addListener(function(activeInfo){
  console.log('tab changed')
  //console.log(activeInfo)
  chrome.tabs.get(activeInfo.tabId,function(tab){
    //start timer for changed tabs
    //startTimer(tab,'tab');
    if(tab.status === "complete"){
      console.log(tab)
      KeepTime(tab,'tab','tab switch')
    };
  });
});
//on windows change
chrome.windows.onFocusChanged.addListener(function(windowId){
  if(windowId!==-1){
    //look for window and tab
    chrome.tabs.query({
      active:true,
      windowId:windowId,
    },function(tab){
      console.log('focused on a chrome window')
      //start timer for active tab in window
      KeepTime(tab[0],'tab','window change')
    });
  } else {
    console.log('focused on a non-chrome window')
    //start timer for other window
    KeepTime({title:"Non-chrome",url:null,id:-1},'tab','window change')
  };
});
//on idle
chrome.idle.onStateChanged.addListener(function(newState){
  //start timer for state change
  //startTimer(newState,'state');
  console.log('state change:'+newState)
});

function KeepTime(source,type,trigger){
  //get data from storage?

  //get time for now, duration and reset ref time
  var now = new Date();
  var duration = now - reftime;
  reftime = now;

  //get date string for indexing
  var datestring =new Date(now.getTime()-(now.getTimezoneOffset()*60000)).toISOString().split("T")[0];

  //store time in object
  if (type ==="tab"){
    //create object to be pushed
    data.push({
      type:"active",
      source: current,
      title: current.title,
      datestring: datestring,
      duration: duration,
      trigger: trigger
    });
    //set new current source of duration
    current = source;
    console.log(data)
  } else {
    console.log("non tab action")
  }
};


// function startTimer(tid,url){
//   var now = Date.now();
//   //create object if not exist
//   if (data[tid]===undefined){
//     data[tid]={};
//     // data[tid].duration = [0];
//     data[tid].duration=0;
//     data[tid].favicon = url;
//     console.log('created new obejct: '+tid)
//   };
//
//   //stop all previous timers
//   stopTimer();
//   //start timer for tid
//   data[tid].stime = now;
//   data[tid].running = true;
//   console.log(data);
// };
//
// function stopTimer(){
//   var now = Date.now();
//   //loop through each id in the data object
//   for (var id in data){
//     if (data[id].running===true && data[id].stime!==undefined){
//       //calculate duration
//       var duration = now - data[id].stime;
//       console.log('duration: '+duration)
//       data[id].running = false;
//       //data[id].duration.push(duration);
//       data[id].duration += duration;
//       data[id].stime = null;
//       data[id].formatted = (data[id].duration).toTime();
//     };
//   };
// };

Number.prototype.toTime = function(isSec) {
    var ms = isSec ? this * 1e3 : this,
        lm = ~(4 * !!isSec),  /* limit fraction */
        fmt = new Date(ms).toISOString().slice(11, lm);

    if (ms >= 8.64e7) {  /* >= 24 hours */
        var parts = fmt.split(/:(?=\d{2}:)/);
        parts[0] -= -24 * (ms / 8.64e7 | 0);
        return parts.join(':');
    }

    return fmt;
};
