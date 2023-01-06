const isVideoFrame = window.frameElement != null;

if(!isVideoFrame){

    const prePlayButton = document.querySelector(".prePlayButton");
    const params = new URLSearchParams(window.location.search);

    console.log(window.location.search);
    
    if(params.get('autoplay')){
        prePlayButton.click();
    }

    var port = chrome.runtime.connect({name: "episode"});
    
    port.onMessage.addListener(() => {
        // move to next episode or season
        window.location.href = getNextEpisodeAddress(getCurrentEpisode()); 
    });

    const showNextEpisodeTooltip = () => {

    }

    const getCurrentEpisode = () => {
        const episodeNumber = document.querySelector('.poster.active').parentElement.getAttribute('data-episode-number');
        console.log(document.querySelector('.poster.active').parentElement);
        return parseInt(episodeNumber);
    };

    const getNextEpisodeAddress = (currentEpisode) => {
        const nextEpisodeDiv = document.querySelector('[data-episode-number="' + (currentEpisode + 1) + '"]');
        const isEndOfSeason = document.querySelector('.owl-stage:last-child a div').getAttribute('data-episode-number') === currentEpisode;

        const url = !isEndOfSeason ? new URL(nextEpisodeDiv.parentElement.href) : new URL(document.querySelector('.open_season').nextElementSibling.href);
        const searchParams = new URLSearchParams(url.search);

        searchParams.set("autoplay", "true");
        url.search = searchParams.toString();
        
        return url.toString();
    } 
}
