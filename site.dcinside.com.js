//let url_parameter = new URLSearchParams(window.location.search);

chrome.storage.local.get(["status"]).then((res) => {
    if (res.status === true) {

        //보배 신유게로 버튼  

        sendToBobaeButton = document.createElement("button");
        sendToBobaeButton.innerText = "보배신유게로";
        sendToBobaeButton.className = "redButtons";
        sendToBobaeButton.addEventListener('click', () => sendToBobae());
        document.querySelector('.gallview_head').append(sendToBobaeButton);


        let imgSrc = [...document.querySelectorAll('.write_div img')].map((data) => {
            if (data.src === "https://nstatic.dcinside.com/dc/m/img/gallview_loading_ori.gif") {
                return data.getAttribute('data-original')
            } else {
                return data.src
            }
        });
        console.log(imgSrc);
        let videoSrc = [...document.querySelectorAll('write_div video')].map((data) => data.src);

        function sendToBobae() {
            //본문 내용 퍼담기 전에 이미지, 영상 태그 삭제
            [...document.querySelector('.write_div').querySelectorAll('.btn')].map((data) => data.remove());
            [...document.querySelector('.write_div').querySelectorAll('.num')].map((data) => data.remove());
            [...document.querySelector('.write_div').querySelectorAll('.imgwrap')].map((data) => {
                const newElement = document.createElement('p');
                newElement.className = "imgPosition"
                data.parentNode.append(newElement);
                data.remove();
            });
            chrome.storage.local.set({
                "writeArticleData": {
                    "title": document.querySelector('.title_subject').innerText,
                    "body": document.querySelector('.write_div').innerHTML,
                    "url": "",
                    "imgs": imgSrc
                }
            }).then(() => window.open('https://www.bobaedream.co.kr/board/bulletin/write?code=humor&from=dcinside'));

            //동영상 자동 다운로드
            if (document.querySelectorAll('.xe_content video') !== undefined) {
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

