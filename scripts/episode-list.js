const isVideoFrame = window.frameElement != null;
console.log(window.ads)

if(!isVideoFrame){
    const generalModal = document.querySelector(".generalModal")

    if(generalModal){
        generalModal.remove();
    }
    
    const prePlayButton = document.querySelector(".play-button");
    const params = new URLSearchParams(window.location.search);
    var port = chrome.runtime.connect({name: "episode"});
    
    if(params.get('isFullScreen') === 'true'){
        setTimeout(()=>{
        console.log("massage")
        console.log(port)
 console.log(window.ads)
            
            port.postMessage({fullScreen: true})}, 12000);
        
    }

    if(params.get('autoplay') === 'true'){
        prePlayButton.click();
    }
    
    port.onMessage.addListener((event) => {
        // move to next episode or season
        window.location.href = getNextEpisodeAddress(getCurrentEpisode(), event.videoWidth); 
    });

    const getCurrentEpisode = () => {
        const episodeNumber = document.querySelector('.poster.active').parentElement.getAttribute('data-episode-number');
        return parseInt(episodeNumber);
    };

    const getNextEpisodeAddress = (currentEpisode, videoWidth) => {
        const nextEpisodeDiv = document.querySelector('[data-episode-number="' + (currentEpisode + 1) + '"]');
        const isEndOfSeason = document.querySelector(".content-episodes").lastChild.previousElementSibling.childNodes[1].getAttribute('data-episode-number') == currentEpisode;

        const url = !isEndOfSeason ? new URL(nextEpisodeDiv.parentElement.href) : new URL(document.querySelector('.open-season').nextElementSibling.href);
        const searchParams = new URLSearchParams(url.search);

        searchParams.set("autoplay", "true");
        searchParams.set("isFullScreen", videoWidth >= document.body.clientWidth);
        url.search = searchParams.toString();
        
        return url.toString();
    } 
}
