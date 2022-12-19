const isVideoFrame1 = window.frameElement != null;
console.log(window.frameElement);
if(isVideoFrame1){


  const video = document.querySelector("video");
console.log(video);
  if(video){
    video.addEventListener('timeupdate', (event) => {
      console.log("timeupdate");
      if(video.duration > 100 && (video.duration - video.currentTime) <= 30){
        (async () => {      
          var port = chrome.runtime.connect({name: "player"});
          port.postMessage({nextEpisode: true});
        })();
      }
    });
  }else{
    console.log("video element not found");
    console.log(document);
  }

}

addEventListener('DOMContentLoaded', (event) => { console.log(event, "domload")});
