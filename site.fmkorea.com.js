//let url_parameter = new URLSearchParams(window.location.search);

chrome.storage.local.get(["status"]).then((res) => {
    if (res.status === true) {

        //보배 신유게로 버튼  

        sendToBobaeButton2 = document.createElement("button");
        sendToBobaeButton2.innerText = "보배신유게로";
        sendToBobaeButton2.className = "redButtons";
        sendToBobaeButton2.addEventListener('click', () => sendToBobae());
        document.querySelector('.fm_vote').prepend(sendToBobaeButton2);


        let imgSrc = [...document.querySelectorAll('article img')].map((data) => decodeURIComponent(data.src));
        console.log(imgSrc);
        let videoSrc = [...document.querySelectorAll('article video')].map((data) => data.src);

        function sendToBobae() {
            //본문 내용 퍼담기 전에 이미지, 영상 태그 삭제
            [...document.querySelector('article div').querySelectorAll('a')].map((data) => data.remove());
            [...document.querySelector('article div').querySelectorAll('img')].map((data) => {
                const newElement = document.createElement('p');
                newElement.className = "imgPosition"
                data.parentNode.append(newElement);
                data.remove();
            });
            chrome.storage.local.set({
                "writeArticleData": {
                    "title": document.querySelector('h1.np_18px').innerText,
                    "body": document.querySelector('article').innerHTML,
                    "url": "",
                    "imgs": imgSrc
                }
            }).then(() => window.open('https://www.bobaedream.co.kr/board/bulletin/write?code=humor&from=fmkor'));

            //동영상 자동 다운로드
            if (document.querySelectorAll('article video') !== undefined) {
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

