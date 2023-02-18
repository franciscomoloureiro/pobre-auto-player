let playerPort;
let episodePort;

chrome.runtime.onConnect.addListener(function(port) {
   if(port.name === "player"){
    playerPort = port;
    console.log("as")

    playerPort.onMessage.addListener(function(msg) {
        if (msg.nextEpisode){
          episodePort.postMessage(msg);
        }
    });
   }

   if(port.name == "episode"){
    episodePort = port;
    console.log("as")
    episodePort.onMessage.addListener(function(msg) {
        playerPort.postMessage(msg);
    });
   }
   
});