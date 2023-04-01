const isVideoFrame = window.frameElement != null;

if(!isVideoFrame){
    function injectScript(file_path, tag) {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', file_path);
        document.documentElement.appendChild(script);
    }
    injectScript(chrome.runtime.getURL('scripts/script.js'), 'body');

    const generalModal = document.querySelector(".generalModal")
    
    if(generalModal){
        generalModal.remove();
    }

    var port = chrome.runtime.connect({name: "episode"});
    
    port.onMessage.addListener((event) => {
        // move to next episode or season
        var src = getNextEpisodeAddress();
 
        fetch("https://www4.pobre.wtf/player/0000/1/"+src+"/1")
        .then(r => r.json())
        .then(d => { 
            fetch(d.players[0].iframe)
            .then(r => r.text())
            .then(async(body) => {
                const lines =  body.split(/\r?\n/);
                
                let encrypedStreamingLink, iv ='';

                lines.forEach((l) =>{
                    if(l.includes('fui093jnf0n34u9fnh3rqwe9i0f30i4fm3')){
                        encrypedStreamingLink = l.match(/'([^']*)'/)[1];
                    }
                    if(l.includes('vn9u304jmi0vfernjgu9r3nmefomcreojm')){
                        iv = l.match(/'([^']*)'/)[1];
                    }

                    if(encrypedStreamingLink && iv){
                        return;
                    }
                })

                var STREAMING_LINK_SETTINGS = {
                                    key: "b75524255a7f54d272j47d1bb39204df",
                                    iv: iv.replace("AajuOvh1tN5lAexLtfJrp", ""),
                                    encrypedStreamingLink: encrypedStreamingLink.replace("KqBBeU93YLao9pOCAqKLb", "")
                                };
                        
                function getStreamingLink() {
                                    var key = CryptoJS.enc.Utf8.parse(STREAMING_LINK_SETTINGS.key);
                                    var iv = CryptoJS.enc.Utf8.parse(STREAMING_LINK_SETTINGS.iv);
                                    var decrypted = CryptoJS.AES.decrypt(STREAMING_LINK_SETTINGS.encrypedStreamingLink, key, {
                                        iv: iv
                                    });
                                    return decrypted.toString(CryptoJS.enc.Utf8);
                                }
                                port.postMessage({link: getStreamingLink()})}, 12000);
                    }
            )
        });

    const getCurrentEpisode = () => {
        const episodeNumber = document.querySelector('.poster.active').parentElement.getAttribute('data-episode-number');
        return parseInt(episodeNumber);
    };
    const getNextEpisodeAddress = () => {
        const nextEpisodeDiv = document.querySelector('[data-episode-number="' + (++currentEpisode) + '"]');
        return nextEpisodeDiv.dataset.episodeId;
    } 
    let currentEpisode = getCurrentEpisode();
}
