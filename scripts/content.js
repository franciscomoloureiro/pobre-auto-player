const isVideoFrame = window.frameElement != null;

if(isVideoFrame){
  const video = document.querySelector("video");

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
}else{
  const prePlayButton = document.querySelector(".prePlayButton");

  if(prePlayButton){
    prePlayButton.click();
  }

  var port = chrome.runtime.connect({name: "episode"});
    
  port.onMessage.addListener(function(msg) {
    document.querySelector(".nextEp").click()
  });
}
