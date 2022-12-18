const isVideoFrame = window.frameElement != null;

if(isVideoFrame){
  const video = document.querySelector("video");

  if(video){
    video.addEventListener('timeupdate', (event) => {
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
  const params = new URLSearchParams(window.location.search);

  console.log(window.location.search);
  if(params.get('autoplay')){
    prePlayButton.click();
  }

  var port = chrome.runtime.connect({name: "episode"});
    
  port.onMessage.addListener(function(msg) {
    const pathParameters = location.pathname.split("/");
    const episodeNumber = parseInt(pathParameters[pathParameters.lastIndexOf("episode") + 1]);
    const episodeDiv = document.querySelector('[data-episode-number="' + (episodeNumber+1) + '"]');
    const url = new URL(episodeDiv.parentElement.href);
    const searchParams = new URLSearchParams(url.search);
    
    searchParams.set("autoplay", "true");
    url.search =searchParams.toString();
    
    window.location.href = url.toString() 
  });
}
