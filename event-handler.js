let playerPort;
let episodePort;

chrome.runtime.onConnect.addListener(function(port) {
   if(port.name === "player"){
    playerPort = port;
    port.onMessage.addListener(function(msg) {
        if (msg.nextEpisode){
          episodePort.postMessage({nextEpisode: true});
        }
    });
   }

   if(port.name == "episode"){
    episodePort = port;
   }
   
});