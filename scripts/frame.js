
const isVideoFrame1 = window.frameElement != null;
const modal = document.querySelector(".generalModal");

if(modal){
  modal.remove();
}
if(isVideoFrame1){
  setTimeout(()=>{
    let timeoutId;
  
    async function loadNextEpisodeElement(videoDiv) {
      let toolbar_url = chrome.runtime.getURL("next-episode.html");
      let html = await (await fetch(toolbar_url)).text();
  
      videoDiv.appendChild(new DOMParser().parseFromString(html, 'text/html').body.childNodes[0]);
  
      videoDiv.querySelector("#nextEpisodeCancel").addEventListener('click', cancelCountdown);
      videoDiv.querySelector("#goToNextEpisode").addEventListener('click', goToNextEpisode);
  
      let seconds = 5;
      const secondsSpan = videoDiv.querySelector("#nextEpisodeSecondsSpan");
      const animatedElement = videoDiv.querySelector("#nextEpisodeSeconds")
      secondsSpan.html = seconds;
      countdown(animatedElement, secondsSpan, seconds);
    }
  
    function unloadNextEpisodeElement(videoDiv) {
      const elem = videoDiv.querySelector("#nextEpisodeContainer"); 
      if(elem){
        elem.remove();
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }

    function cancelCountdown(){
      const videoDiv = document.querySelector("#customVideoPlayer div");
      const secondsSpan = videoDiv.querySelector("#nextEpisodeSecondsSpan");
      const secondsElement = videoDiv.querySelector("#nextEpisodeSeconds");

      videoDiv.querySelector("#nextEpisodeCancel").classList.add("hidden");
      secondsElement.classList.add("hidden");

      secondsSpan.innerHTML = "";

      clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    function countdown(animatedElement, secondsSpan, seconds){
      secondsSpan.innerHTML = seconds;

      timeoutId = setTimeout(() => {
        secondsSpan.innerHTML = --seconds;
        if(seconds <= 0 && timeoutId){
          goToNextEpisode();

          animatedElement.classList.remove("animated")
          animatedElement.classList.add("stopped")

        }else{
          countdown(animatedElement, secondsSpan, seconds);
        }
      }, 1000);
    }
   
    async function goToNextEpisode(){
      console.log(window.reCaptchaIDs);
      console.log(window.vn9u304jmi0vfernjgu9r3nmefomcreojm);
      console.log(window.fui093jnf0n34u9fnh3rqwe9i0f30i4fm3);

      port.postMessage({nextEpisode: true, videoWidth: document.querySelector("video").clientWidth});
    }
    var port = chrome.runtime.connect({name: "player"});
  
    if(isVideoFrame1){
      const video = document.querySelector("video");
      const videoDiv = document.querySelector("#customVideoPlayer div");
      
      if(video){

        port.onMessage.addListener((event) => {
          console.log(event);
          
          var url = new URL(event.link);
          var src = url.searchParams.get("link");
          video.src = src;
          video.play();

          if(event.fullScreen){
            document.body.addEventListener("click",() => video.requestFullscreen())
            document.body.click()
          }
        });

        let isElementLoaded = false;
        video.addEventListener('timeupdate', (event) => {
          if (video.duration > 100){
            if((video.duration - video.currentTime) <= 30 && !isElementLoaded){
              isElementLoaded = true;
              loadNextEpisodeElement(videoDiv);
              
            }else if((video.duration - video.currentTime) > 30 ){
              isElementLoaded = false;
              unloadNextEpisodeElement(videoDiv);
            }
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
