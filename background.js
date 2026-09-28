
//스토리지 초기 항목 생성
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        //처음 인스톨시 동작

        //익스텐션 활성화/비활성화
        chrome.storage.local.set({ "status": true });

        //자동삭제 상태
        chrome.storage.local.set({ "autoDelete": false });

        //자동삭제 키워드 기본값
        chrome.storage.local.set({
            "autoDeleteKeyword": [
                "병신", "븅신", "빙신", "등신", "융신", "웅신", "씨발", "씨벌", "시발", "시벌", 
                "썅", "개새", "씹새", "십새", "친새", "친년", "친놈", "개년", "개놈", 
                "벌레", "베충", "대깨", "깨문", "개쌍", "쌍도", "절라도", "즌라도", "즐라도", "라디언", "상디언", 
                "굥상도", "갱상도", "견상도", "고담", "대구%찍", "전라%찍", "라도%찍", "라도%새끼", "전라%새끼", 
                "대구%새끼", "경북%찍", "경북%새끼", "경상%새끼", "애미", "애비", "버러지", "ㅄ", "ㅂ ㅅ", "ㅂㅅ", 
                "ㅅㅂ", "ㅆㅂ", "ㅅㄲ", "ㄷㅅ", "ㅆㄴ", "ㅊㄴ", "ㅂㄹ", "쌍디언", "상디언", "머구", "경상%찍", 
                "흉노", "좃만", "좃같", "C발", "빡대가리", "빡대갈", "정신병자", "벌거지"
            ]
        });

        //자동삭제 카운트
        chrome.storage.local.set({ "keyCount": null });

        //자동추천 [추천갯수, 추천간격, 추천횟수]
        chrome.storage.local.set({ "autoRecNums": [10, 5, 10] });

        //매물이동 기능용 데이터
        chrome.storage.local.set({
            "importValue": {
                "status": false,
                "dealer_name": "",
                "dealer_cellphone": "",
                "dealer_regnumber": "",
                "dealer_shop": "",
                "dealer_union": "",

                "car_regnumber": "",
                "car_jesinumber": "",
                "car_model": "",
                "car_price": "",
                "car_lease_price": "",
                "car_year": "",
                "car_month": "",
                "car_odometer": "",
                "car_type": "",
                "car_color": "",
                "car_tranny": "", //자동, 수동
                "car_cc": "",
                "car_fuel": "", // 가솔린, 디젤, LPG, 가솔린/LPG겸용, 가솔린/CNG겸용, 가솔린 하이브리드, LPG 하이브리드, 디젤 하이브리드, CNG, 전기, 수소, 기타
                "car_seizure": "0", // 압류
                "car_mortgage": "0",  // 저당
                "car_crash": "n",  // 사고여부
                "car_sell_way_type": "A", // A : 일반차량, B : 할부승계차량, C : 리스승계차량
                "car_option": [],
                "target_url": ""
            }
        });

        //스크랩 URL용 데이터
        chrome.storage.local.set({ "scrapUrls": [] })

    } else if (details.reason == "update") {
        //업데이트시 동작
    }
});


/*
//컨텍스트 메뉴 생성
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "bobaeExtention1",
        title: "보배 어쩌구...",
        contexts: ["all"]
    });
    chrome.contextMenus.create({
        id: "bobaeExtention2",
        title: "보배 어쩌구2...",
        contexts: ["all"]
    });
});

//컨텍스트 메뉴 리스너
chrome.contextMenus.onClicked.addListener(function (clickData) {
    if (clickData.menuItemId == "bobaeExtention1") {
        console.log(1);
    }
    if (clickData.menuItemId == "bobaeExtention2") {
        console.log(2);
    }
})
    */

//런타임 메시지 처리
chrome.runtime.onMessage.addListener(
    function (message, sender, onSuccess) {

        //CID 받아서 ID로 반환
        if (message.type === 'getCidtoID') {
            fetch(message.payload)
                .then(response => response.text())
                .then(responseText => onSuccess(responseText))
            return true;  // 데이터 수신 성공시 텍스트로 반환
        }

        //URL 대상 이미지를 다운로드받아 base64로 반환
        if (message.type === 'getUploadedImageURL') {
            fetch(message.payload)
                .then(res => res.blob())
                .then(res => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64data = reader.result;
                        onSuccess(base64data)
                    }
                    reader.readAsDataURL(res)
                })
            return true;
        }

        if (message.type === 'getGeminiAiResult') {
            // Gemini API 키
            const API_KEY = "AIzaSyCmhM9sm9medoTUIITBjpIylpB5OG0rjnQ";
            console.log(message.payload);

            fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY, {
                method: "POST",
                body: JSON.stringify({
                    "contents": [{ "parts": [{ "text": message.payload }] }],
                    "generationConfig": { "thinkingConfig": { "thinkingBudget": 0 } }
                })
            })
                .then(response => response.text())
                .then(responseText => onSuccess(responseText))
            return true;  // 데이터 수신 성공시 텍스트로 반환
        }

        if (message.type === 'getVideo') {
            console.log(message.payload)
            chrome.downloads.download({
                url: message.payload,
                filename: message.payload.split('/').reverse()[0],
                saveAs: false
            })

            console.log(message.payload);
            onSuccess('다운로드 성공')
            return true;  // 데이터 수신 성공시 텍스트로 반환
        }

    }
);


