let url = new URLSearchParams(window.location.search);

chrome.storage.local.get(["status", "autoRecNums", "autoRecStatus_" + url.get("No")]).then((res) => {
    if (res.status === true) {

        let form = document.querySelector('form[name="bform2"]');
        let nextRecSec = null;
        let nextRecTimes = null;
        let totalRecCount = null;
        let autoRecStatus = res["autoRecStatus_"+url.get("No")];

        if (autoRecStatus !== undefined) {
            nextRecSec =autoRecStatus.nextRecSec;
            nextRecTimes = autoRecStatus.nextRecTimes;
            totalRecCount = autoRecStatus.totalRecCount;
        }

        let secToTime = function (time = nextRecSec) {
            let Hour = Math.floor(Number(time) / 60 / 60)
            let Min = Math.floor((Number(time) / 60) % 60);
            let Sec = Number(time) % 60;
            Hour = Hour !== 0 ? Hour + "시간 " : "";
            Min = Min !== 0 ? Min + "분 " : "";
            Sec = Sec !== 0 ? Sec + "초" : "";
            return Hour + Min + Sec;
        }

        /* --------------UI 생성 -----------------*/
        let autoRecommandDiv = document.createElement("div");
        autoRecommandDiv.className = "autoRecommandDiv";
        let hrTag = document.createElement("hr");

        //추천 시작 버튼
        let startRecButton = document.createElement("span");
        startRecButton.className = "redButtons";
        startRecButton.innerText = "자동추천";

        //1회 추천 갯수
        let numRecommand = document.createElement("input");
        numRecommand.type = "number"
        numRecommand.min = 1
        numRecommand.max = 250
        numRecommand.className = "inputKeywords"
        numRecommand.value = res.autoRecNums[0]
        numRecommand.addEventListener('change', () => onChangeValue());

        //추천 간격
        let numDelay = document.createElement("input");
        numDelay.type = "number"
        numDelay.min = 1
        numDelay.max = 60
        numDelay.className = "inputKeywords"
        numDelay.value = res.autoRecNums[1]
        numDelay.addEventListener('change', () => onChangeValue());

        //추천 횟수
        let numTimes = document.createElement("input");
        numTimes.type = "number"
        numTimes.min = 2
        numTimes.max = 100
        numTimes.className = "inputKeywords"
        numTimes.value = res.autoRecNums[2]
        numTimes.addEventListener('change', () => onChangeValue());

        //총 추천 갯수
        let totalRecommand = document.createElement("span");
        totalRecommand.innerText = Number(numRecommand.value) * Number(numTimes.value);

        //총 소요시간
        let totalTime = document.createElement("span");
        totalTime.innerText = secToTime(Number(numDelay.value) * 60 * (Number(numTimes.value) - 1));

        //현재 진행 상태 및 결과 표시
        let showResult = document.createElement("p");
        let showStatus = function () {
            showResult.innerHTML =
                "총 " + Number(totalRecCount) + "개를 추천했습니다. <br/>" +
                secToTime() + " 후 " + Number(numRecommand.value) + "개를 추천합니다. <br/>" +
                Number(nextRecTimes) + "회, " + secToTime(((Number(nextRecTimes) - 1) * numDelay.value * 60) + nextRecSec) + " 남았습니다."
        }

        // 인기글등록 버튼
        let goToBestButton = document.createElement("span");
        goToBestButton.innerText = "인기글등록";
        goToBestButton.className = "redButtons floatRight";
        goToBestButton.addEventListener('click', () => goToBest(url.get("tb"), url.get("No")));

        //자동추천 진행중인 경우 UI 상태변경
        if (nextRecSec === null) {
            startRecButton.innerText = "자동추천";
            startRecButton.addEventListener('click', () => startCounting());
            showResult.innerHTML = "* 첫번째 추천은 딜레이 없이 바로 진행됩니다.<br>* 인기글 등록시 추천 20개가 추가됩니다."
        } else {
            startRecButton.innerText = "자동추천중지";
            startRecButton.addEventListener('click', () => stopCounting());
            numRecommand.disabled = true;
            numDelay.disabled = true;
            numTimes.disabled = true;
            goToBestButton.style.display = "none";
            showStatus();
        };

        // UI 조립하고 페이지에 끼워넣기
        autoRecommandDiv.append(
            startRecButton,
            numRecommand, "개씩", numDelay, "분 간격으로", numTimes, "번 추천 = ", totalTime, " 동안 ", totalRecommand, "개 추천",
            goToBestButton,
            hrTag,
            showResult
        );
        form.prepend(autoRecommandDiv);

        //추천갯수, 소요시간 갱신, 입력값 범위 초과시 범위내로 고정
        let onChangeValue = function () {
            if (Number(numRecommand.value) < numRecommand.min) { numRecommand.value = numRecommand.min }
            if (Number(numRecommand.value) > numRecommand.max) { numRecommand.value = numRecommand.max }
            if (Number(numDelay.value) < numDelay.min) { numDelay.value = numDelay.min }
            if (Number(numDelay.value) > numDelay.max) { numDelay.value = numDelay.max }
            if (Number(numTimes.value) < numTimes.min) { numTimes.value = numTimes.min }
            if (Number(numTimes.value) > numTimes.max) { numTimes.value = numTimes.max }

            totalRecommand.innerText = Number(numRecommand.value) * Number(numTimes.value);
            totalTime.innerText = secToTime(Number(numDelay.value) * 60 * (Number(numTimes.value) - 1));

            chrome.storage.local.set({ "autoRecNums": [numRecommand.value, numDelay.value, numTimes.value] });
        }

        /* -------------- 타이머 동작 -----------------*/

        //1초마다 체크
        let timer = setInterval(() => {
            if (nextRecTimes !== null) { // 반복횟수가 남아있으면 카운트 시작
                saveStatus();
                console.log( totalRecCount, "개씩", nextRecTimes, "번", nextRecSec, "초후에 추천")
                if (nextRecTimes === numTimes.value) { // 첫번째 추천은 카운트 없이 바로 실행
                    showResult.innerHTML = "자동추천을 시작합니다."
                    sendRecommend(url.get("tb"), url.get("No"), numRecommand.value, "Public");

                } else if (nextRecTimes < numTimes.value) { // 두번째 추천부터는 카운트
                    if (nextRecSec === null) return; // 카운트 없음(서버 응답 대기중)

                    else if (nextRecSec > 0) { // 카운트가 있으면 현재까지 누적 추천수/횟수/몇초가 남았는지 표시
                        nextRecSec = Number(nextRecSec) - 1
                        showStatus();
                    }

                    else { // 카운트가 0에 도달하면 추천 명령 실행.
                        nextRecSec = null; // 카운트를 일시 중지하고 추천 명령을 보냄(추천이 성공하면 카운트 재개)
                        showResult.innerHTML = "추천 명령을 보내는 중입니다."
                        sendRecommend(url.get("tb"), url.get("No"), numRecommand.value, "Public");
                    }
                }
            }
        }, 1000)

        //자동추천 시작
        let startCounting = function () {
            nextRecTimes = numTimes.value
            startRecButton.innerText = "자동추천중지";
            startRecButton.addEventListener('click', () => stopCounting());
            goToBestButton.style.display = "none"; //자동추천을 시작하면 인기글등록 버튼 숨김
        }

        //자동추천 중지
        let stopCounting = function (message = "") {
            clearInterval(timer);
            if (message !== "") message = message + "\n"
            alert(message + "총 " + Number(totalRecCount) + "개를 추천했습니다.");
            nextRecSec = null;
            nextRecTimes = null;
            totalRecCount = null;
            saveStatus();
            location.href = location.href;
        }

        let saveStatus = function () {
            chrome.storage.local.set({
                ["autoRecStatus_" + url.get("No")]: {
                    "nextRecSec": nextRecSec,
                    "nextRecTimes": nextRecTimes,
                    "totalRecCount": totalRecCount
                }
            })
        }

        // 서버에 추천 요청 보내기
        let sendRecommend = function (code, No, score = "1", Public = "Public") {
            fetch("/board/bulletin/proc/set_recommand.php", {
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    "code": code,
                    "No": No,
                    "score": score,
                    "Public": Public
                })
            })
                .then(res => { return res.text() }) //서버 응답을 텍스트로 변환
                .then((res) => {
                    let rescd = res.substring(0, 2);
                    if (rescd == '10') { stopCounting('게시판 정보가 없습니다.') }
                    else if (rescd == '12') { stopCounting('관리자 로그인이 되어있지 않습니다.') }
                    else if (rescd == '20') { stopCounting('자신의 글을 추천 할 수 없습니다.') }
                    else if (rescd == '25') { stopCounting('추천수를 250 이상 올릴 수 없습니다.') }
                    else if (rescd == '30') { stopCounting('이미 추천을 하였습니다.') }
                    else if (rescd == '66') { stopCounting('불량회원으로 지정되어서 추천하기 권한이 제한되었습니다.\n관리자에게 문의하시기 바랍니다.'); }
                    else if (rescd == '90') {
                        totalRecCount = Number(totalRecCount) + Number(numRecommand.value);
                        if (nextRecTimes > 1) {  // 남은 횟수가 1보다 많으면 횟수를 차감하고 다음 카운트 시작
                            nextRecTimes = Number(nextRecTimes) - 1
                            nextRecSec = numDelay.value * 60 - 1;
                            saveStatus();
                            location.href = location.href;
                        }
                        else { stopCounting('자동추천을 종료했습니다.') }; // 남은 횟수가 1이면 종료

                    }
                    else {
                        console.log(res);
                        stopCounting('비정상적인 서버 응답입니다.추천을 중지합니다.');
                    }
                })
                .catch((err) => {
                    stopCounting('서버와 연결에 실패했습니다. 추천을 중지합니다.');
                    console.log(err);
                })
        }

        //인기글 등록 버튼
        let goToBest = function (code, No) {
            fetch("/supermanager/_menu03/board/board_list_ok.php?main=menu03&menu=04&sub=board_list&board=" + code, {
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    "code": code,
                    "mode": "best",
                    "chk_no[]": No,
                    "sc1": "",
                    "sc2": "",
                    "target_table": "",
                    "target_info": "",
                    "Home": ""
                })
            })
                .then(() => { location.reload(true) })
                .catch((res) => {
                    console.log(res)
                    alert('네트워크 오류로 인기글 등록에 실패했습니다.')
                })
        }
    }
})
