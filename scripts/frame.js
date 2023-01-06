const isVideoFrame1 = window.frameElement != null;
setTimeout(()=>{
  async function loadNextEpisodeElement(videoDiv) {
    let toolbar_url = chrome.runtime.getURL("next-episode.html");
    let html = await (await fetch(toolbar_url)).text();

    videoDiv.appendChild(new DOMParser().parseFromString(html, 'text/html').body.childNodes[0]);
  }

  console.log(window.frameElement);
  if(isVideoFrame1){
    const video = document.querySelector("video");
    const videoDiv = document.querySelector("#customVideoPlayer div");

    console.log(video);
    console.log(videoDiv);

    loadNextEpisodeElement(videoDiv);

    if(video){
      video.addEventListener('timeupdate', (event) => {
        console.log("timeupdate");
        if(video.duration > 100 && (video.duration - video.currentTime) <= 30){
          (async () => {      
            var port = chrome.runtime.connect({name: "player"});
            // port.postMessage({nextEpisode: true});
          })();
        }
      });
    }else{
      console.log("video element not found");
      console.log(document);
    }

  }

  addEventListener('DOMContentLoaded', (event) => { console.log(event, "domload")});


}, 5000);
