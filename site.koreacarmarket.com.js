chrome.storage.local.get("status").then((res) => {
    if (res.status === true) {

        //보배로 버튼 추가
        let sendToBobaePosition = document.querySelector('.btn_sns');
        sendToBobaeButton = document.createElement("button");
        sendToBobaeButton.innerText = "보배관리자 등록";
        sendToBobaeButton.className = "redButtons";
        sendToBobaeButton.addEventListener('click', () => onSendToBobae());
        sendToBobaePosition.append(sendToBobaeButton);

        sendToBobaeButton2 = document.createElement("button");
        sendToBobaeButton2.innerText = "보배사용자 등록";
        sendToBobaeButton2.className = "redButtons";
        sendToBobaeButton2.addEventListener('click', () => onSendToBobae2());
        sendToBobaePosition.append(sendToBobaeButton2);



        function onSendToBobae() {
            window.open("http://xkfxksid.bobaedream.co.kr/supermanager/index.php?main=menu01&menu=02&sub=mycar_regist&gubun=I");
        }

        function onSendToBobae2() {
            window.open("https://www.bobaedream.co.kr/mycar/mycar_self_step1.php?gubun=I");
        }

    }
})

