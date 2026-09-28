let url = new URLSearchParams(window.location.search);
let collectedUrls = [];
if (window.location.host === "www.motorauthority.com") collectedUrls = [...document.querySelectorAll('.items-list a.title')];
if (window.location.host === "carview.yahoo.co.jp") {
    collectedUrls = [...document.querySelectorAll('.section.area-list li a')]
    for (let i = 0; i < collectedUrls.length; i++) {
        collectedUrls[i].href = collectedUrls[i].href.split('?')[0];
    }
};
if (window.location.host === "www.carscoops.com") collectedUrls = [...document.querySelectorAll('.card-wrapper a')]
if (window.location.host === "www.motor1.com") collectedUrls = [...document.querySelectorAll('.m1-newsfeed_grid .compact-title-medium a')]


chrome.storage.local.get(["status", "scrapUrls"]).then((res) => {
    if (res.status === true && url.get('i') === '1') {


        let scrapUrls = res.scrapUrls;

        for (let i = collectedUrls.length -1 ; i >= 0 ; i--) {
            //새로 수집한 url이 기존 수집한 url과 중복되는지 체크
            function chk_url() {
                let isAlreadyThere = false
                for (let j = 0; j < res.scrapUrls.length; j++) {
                    if (scrapUrls[j].url === collectedUrls[i].href) {
                        isAlreadyThere = true;
                    }
                }
                return isAlreadyThere;
            }
            //중복되지 않으면 해당 URL을 대기열에 추가
            if (chk_url() === false) {
                scrapUrls = [{
                    "status": false,
                    "url": collectedUrls[i].href,
                    "title": "",
                    "text": "",
                    "imgs": [],
                    "ai_title": "",
                    "ai_text": "",
                    "post_status": false,
                }, ...scrapUrls]
            }
        }
        console.log(scrapUrls)
        chrome.storage.local.set({
            "scrapUrls": scrapUrls
        });
        window.close();
    }
})

