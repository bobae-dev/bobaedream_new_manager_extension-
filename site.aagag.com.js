//let url_parameter = new URLSearchParams(window.location.search);

chrome.storage.local.get(["status"]).then((res) => {
    if (res.status === true) {

        //보배 신유게로 버튼  
        sendToBobaeButton = document.createElement("button");
        sendToBobaeButton.innerText = "보배신유게로";
        sendToBobaeButton.className = "redButtons";
        sendToBobaeButton.addEventListener('click', () => sendToBobae());
        document.querySelector('#content').prepend(sendToBobaeButton);

        sendToBobaeButton2 = document.createElement("button");
        sendToBobaeButton2.innerText = "보배신유게로";
        sendToBobaeButton2.className = "redButtons";
        sendToBobaeButton2.addEventListener('click', () => sendToBobae());
        document.querySelector('#ioptbar').prepend(sendToBobaeButton2);

        document.querySelector('.download_icon').click()
        setTimeout(() => {
        }, 100); //ui가 반응할 시간 대기

        let imgSrc = [...document.querySelectorAll('#vContent img')].map((data) => data.src);
        let videoSrc = [...document.querySelectorAll('#vContent video')].map((data) => data.src);

        function sendToBobae() {
            //본문 내용 퍼담기 전에 이미지, 영상 태그 삭제
            [...document.querySelector('#vContent').querySelectorAll('img, video, .s_opt')].map((data) => data.remove());
            chrome.storage.local.set({
                "writeArticleData": {
                    "title": document.querySelector('.title').innerText,
                    "body": document.querySelector('#vContent').innerHTML,
                    "url": "",
                    "imgs": imgSrc
                }
            }).then(() => window.open('https://www.bobaedream.co.kr/board/bulletin/write?code=humor&from=aagag'));

            //동영상 자동 다운로드
            if (document.querySelectorAll('#vContent video') !== undefined) {
                videoSrc.map((data) => {
                    chrome.runtime.sendMessage(
                        {
                            type: "getVideo",
                            payload: data
                        },
                        (result) => { console.log(result) }
                    )
                })
            }
        }
    }
})

