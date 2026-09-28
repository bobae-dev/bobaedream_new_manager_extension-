let showCurrntStatus = () => {
    //그동안 스크랩된 내용 표시
    chrome.storage.local.get("scrapUrls").then((result) => {


        let scrapUrlsView = [...result.scrapUrls.slice(0, 100)]

        let targetUrls = document.createElement("div");
        for (let i = 0; i < scrapUrlsView.length; i++) {

            // 기사 개별 래퍼
            let contentWrapper = document.createElement("div");
            contentWrapper.className = 'contentWrapper';

            // 버튼류
            let scrapThisArticle = document.createElement("button");
            scrapThisArticle.innerText = '스크랩'
            scrapUrlsView[i].title === "" ? scrapThisArticle.className = 'scrapThisArticle' : scrapThisArticle.className = 'scrapThisArticle compleate';

            let translateThisArticle = document.createElement("button");
            translateThisArticle.innerText = 'AI번역'
            scrapUrlsView[i].ai_title === "" ? translateThisArticle.className = 'translateThisArticle' : translateThisArticle.className = 'translateThisArticle compleate';

            let gotoBobae = document.createElement("button");
            gotoBobae.innerText = '보배로'
            !scrapUrlsView[i].post_status ? gotoBobae.className = 'gotoBobae' : gotoBobae.className = 'gotoBobae compleate';

            //기사 URL
            let url = document.createElement("p");
            url.innerText = scrapUrlsView[i].url;
            url.setAttribute("key", i);
            url.className = 'contentUrl'

            // 상세정보
            let detailWrapper = document.createElement("div");
            detailWrapper.className = 'detailWrapper';
            detailWrapper.style.display = "block";

            // AI 번역 제목
            let aiTitle = document.createElement("p")
            aiTitle.innerText = scrapUrlsView[i].ai_title;
            aiTitle.className = 'aiTitle';

            // AI 번역 본문
            let aiBody = document.createElement("p")
            aiBody.innerText = scrapUrlsView[i].ai_text;
            aiBody.className = 'aiBody';

            // 제목
            let title = document.createElement("p")
            title.innerText = scrapUrlsView[i].title;
            title.className = 'contentTitle';

            // 본문
            let body = document.createElement("p")
            body.innerText = scrapUrlsView[i].text;
            body.className = 'contentBody';

            // 이미지
            let imgs = document.createElement("p")
            for (let j = 0; j < scrapUrlsView[i].imgs.length; j++) {
                let img = document.createElement("p")
                img.innerText = scrapUrlsView[i].imgs[j];
                img.className = 'contentImgs notranslate';
                imgs.append(img);
            }

            // 구분선
            let hr = document.createElement("hr")

            detailWrapper.append(aiTitle, aiBody, title, body, imgs);
            contentWrapper.append(scrapThisArticle, translateThisArticle, gotoBobae, url, detailWrapper);
            targetUrls.append(contentWrapper, hr);
        }
        document.querySelector('.pendinglist').innerHTML = targetUrls.innerHTML;
    })
}



//수집한 URL 중 현재 URL과 같은 항목이 있는지 확인


//동적 바인딩
document.querySelector('.pendinglist').addEventListener('click', (e) => {
    if (e.target.classList.contains('contentUrl')) {
        let detail = e.target.parentNode.querySelector('.detailWrapper')
        detail.style.display === "block" ? detail.style.display = "none" : detail.style.display = "block";
    }
    if (e.target.classList.contains('scrapThisArticle')) {
        let targetUrl = e.target.parentNode.querySelector('.contentUrl').innerText
        window.open(targetUrl + '?i=1'); //익스텐션이 연 창인지 구별하기 위해 url에 패러미터 추가
        chrome.storage.local.get("scrapUrls").then((result) => {
            let scrapUrls = result.scrapUrls;
            function chk_url(url) {
                return scrapUrls.findIndex((data) => {
                    return data.url === url
                })
            }
            scrapUrls[chk_url(e.target.parentNode.querySelector('.contentUrl').innerText)].status = true;
            scrapUrls[chk_url(e.target.parentNode.querySelector('.contentUrl').innerText)].title = "수집중...";
            chrome.storage.local.set({ "scrapUrls": scrapUrls }).then(showCurrntStatus());
        })
        setTimeout(() => { showCurrntStatus() }, 2000);
    }
    if (e.target.classList.contains('translateThisArticle')) {
        if (e.target.parentNode.querySelector('.contentTitle').innerText === "") {
            alert('번역할 기사 내용이 없습니다.')
        } else {
            //백그라운드에서 gemini 요청 받아오기
            e.target.parentNode.querySelector('.aiTitle').innerText = "Gemini에 기사 생성을 요청중입니다..."
            e.target.parentNode.querySelector('.aiBody').innerText = ""
            chrome.runtime.sendMessage(
                {
                    type: "getGeminiAiResult",
                    payload: "이 기사를 한국어 기사로 요약해서 작성해 줘. [] 안의 문장은 기사 제목이고 나머지는 기사 본문이야. 기사는 존대말 없이 사실만 전하는 느낌이야. 기사 제목은 'title', 기사 본문은 'body' 라는 키값을 가지는 JSON 형식으로 답변해 줘. \', \", \\앞에는 이스케이프 문자 \\를 넣어줘. 응답 내용이 JSON형식에 어긋나지 않는지 다시 한번 점검해줘.: " +
                        "[" + e.target.parentNode.querySelector('.contentTitle').innerText + "]" +
                        e.target.parentNode.querySelector('.contentBody').innerHTML
                },
                data => {
                    console.log(data);
                    if (JSON.parse(data).error !== undefined) {
                        e.target.parentNode.querySelector('.aiTitle').innerText = "AI 응답중 오류가 발생했습니다. 에러코드 :" + JSON.parse(data).error.code + "  " + JSON.parse(data).error.message;
                    } else {
                        let resultText = JSON.parse(data).candidates[0].content.parts[0].text;
                        resultText = resultText.split('{')[1].split('}')[0]
                        console.log(resultText);
                        let aiResult = JSON.parse("{" + resultText + "}");

                        chrome.storage.local.get("scrapUrls").then((result) => {
                            let scrapUrls = result.scrapUrls;
                            function chk_url(url) {
                                return scrapUrls.findIndex((data) => {
                                    return data.url === url
                                })
                            }
                            scrapUrls[chk_url(e.target.parentNode.querySelector('.contentUrl').innerText)].ai_title = aiResult.title;
                            scrapUrls[chk_url(e.target.parentNode.querySelector('.contentUrl').innerText)].ai_text = aiResult.body;
                            chrome.storage.local.set({ "scrapUrls": scrapUrls }).then(showCurrntStatus());
                        })
                    }
                }
            )
        }
    }
    if (e.target.classList.contains('gotoBobae')) {

        if (e.target.parentNode.querySelector('.aiTitle').innerText === "") {
            alert('AI 번역된 기사 내용이 없습니다.')
        } else {
            // 보배로 버튼 클릭시 버튼 초록색으로 변경
            chrome.storage.local.get("scrapUrls").then((result) => {
                let scrapUrls = result.scrapUrls;
                function chk_url(url) {
                    return scrapUrls.findIndex((data) => {
                        return data.url === url
                    })
                }
                scrapUrls[chk_url(e.target.parentNode.querySelector('.contentUrl').innerText)].post_status = true;
                chrome.storage.local.set({ "scrapUrls": scrapUrls }).then(showCurrntStatus());
            })

            chrome.storage.local.set({
                "writeArticleData": {
                    "title": e.target.parentNode.querySelector('.aiTitle').innerText,
                    "body": e.target.parentNode.querySelector('.aiBody').innerHTML + "<br/><br/>" + e.target.parentNode.querySelector('.contentUrl').innerHTML + "<br/><br/>",
                    "url": "",
                    "imgs": [...e.target.parentNode.querySelectorAll('.contentImgs')].map(data => data.innerText)
                }
            }).then(() => window.open('https://www.bobaedream.co.kr/board/bulletin/write.php?code=cnews'));
        }
    }
})

showCurrntStatus()

//자동 스크랩
const scrapSiteList = ['https://www.motorauthority.com/news', 'https://carview.yahoo.co.jp/news/', 'https://www.motor1.com/news/'] //,'https://www.carscoops.com/tag/scoops/', 'https://www.carscoops.com/tag/new-cars/'
let autoScrapStatus = false;
let autoScrapButton = document.querySelector('.enableAutoScrap')
let autoGetUrls
let autoUpdate
let autoScrap

autoScrapButton.addEventListener("click", () => {
    if (autoScrapStatus) {
        autoScrapStatus = false;
        autoScrapButton.innerText = "자동스크랩 켜기"
        autoScrapButton.className = ""
        clearInterval(autoGetUrls)
        clearInterval(autoScrap);
        clearInterval(autoUpdate);
    } else {
        autoScrapStatus = true;
        autoScrapButton.innerText = "자동스크랩 끄기"
        autoScrapButton.className = "compleate"
        // 10분마다 대상 사이트 리스트 띄워서 새로운 기사 있는지 확인
        function getUrls() {
            for (let i = 0; i < scrapSiteList.length; i++) {
                window.open(scrapSiteList[i] + '?i=1', "_blank"); //익스텐션이 연 창인지 구별하기 위해 url에 패러미터 추가
            }
        }
        getUrls()
        autoGetUrls = setInterval(() => { getUrls() }, 1000 * 60 * 10)
        showCurrntStatus()
        autoUpdate = setInterval(() => { showCurrntStatus() }, 1000)
        autoScrap = setInterval(() => {
            chrome.storage.local.get("scrapUrls").then((result) => {
                if (result.scrapUrls.length !== '0') {
                    let index = result.scrapUrls.findLastIndex((data) => data.status === false)
                    if (index !== -1) {
                        let scrapUrls = result.scrapUrls;
                        scrapUrls[index].status = true;
                        scrapUrls[index].title = "수집중...";
                        chrome.storage.local.set({ "scrapUrls": scrapUrls }).then(showCurrntStatus());
                        let target = result.scrapUrls[index]
                        chrome.storage.local.set({ "scrapUrls": result.scrapUrls.with(index, target) }).then(showCurrntStatus());
                        window.open(target.url + '?i=1'); //익스텐션이 연 창인지 구별하기 위해 url에 패러미터 추가
                    }
                    else {
                        console.log('스크랩 하지 않은 URL 없음')
                    }
                }
                else {
                    console.log('데이터 없음')
                }
            })
        }, 5000)
    }
})