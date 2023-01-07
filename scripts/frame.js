const isVideoFrame1 = window.frameElement != null;
if(isVideoFrame1){
  setTimeout(()=>{
    let isGoToNextEpisode = false;
  
    async function loadNextEpisodeElement(videoDiv) {
      let toolbar_url = chrome.runtime.getURL("next-episode.html");
      let html = await (await fetch(toolbar_url)).text();
  
      videoDiv.appendChild(new DOMParser().parseFromString(html, 'text/html').body.childNodes[0]);
  
      videoDiv.querySelector("#nextEpisodeCancel").addEventListener('click', (e) => {});
      videoDiv.querySelector("#goToNextEpisode").addEventListener('click', goToNextEpisode);
  
      let seconds = 5;
      const secondsSpan = videoDiv.querySelector("#nextEpisodeSecondsSpan");
      secondsSpan.html = seconds;
      isGoToNextEpisode = true;
      countdown(secondsSpan, seconds);
    }
  
    function unloadNextEpisodeElement(videoDiv) {
      const elem = videoDiv.querySelector("#nextEpisodeContainer"); 
      if(elem){
        elem.remove();
        goToNextEpisode = false;
      }
    }
  
    function countdown(secondsSpan, seconds){
      setTimeout(() => {
        secondsSpan.innerHTML = --seconds;
        if(seconds <= 0 && isGoToNextEpisode){
          goToNextEpisode();
        }else{
          countdown(secondsSpan, seconds);
        }
      }, 1000);
    }
  
    async function goToNextEpisode(){
      var port = chrome.runtime.connect({name: "player"});
      port.postMessage({nextEpisode: true});
    }
  
    console.log(window.frameElement);
    if(isVideoFrame1){
      const video = document.querySelector("video");
      const videoDiv = document.querySelector("#customVideoPlayer div");
  
      console.log(video);
      console.log(videoDiv);
  
  
      if(video){
        let isElementLoaded = false;
        video.addEventListener('timeupdate', (event) => {
          if(video.duration > 100 && (video.duration - video.currentTime) <= 30 && !isElementLoaded){
            isElementLoaded = true;
            loadNextEpisodeElement(videoDiv);
            console.log("load ele");
          }else if(video.duration > 100 && (video.duration - video.currentTime) > 30 ){
            console.log("unload");
            isElementLoaded = false;
            unloadNextEpisodeElement(videoDiv);
          }
        });
      }else{
        console.log("video element not found");
        console.log(document);
      }
  
    }
  
    addEventListener('DOMContentLoaded', (event) => { console.log(event, "domload")});
  
  
  }, 5000);
  
}
