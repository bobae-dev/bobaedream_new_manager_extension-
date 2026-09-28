//let url = new URLSearchParams(window.location.search);
chrome.storage.local.get("status").then((res) => {
    if (res.status === true) {

        console.log('test');

        //등록폼 링크
        let target_url = "";
        const target_url_managerI = "http://xkfxksid.bobaedream.co.kr/supermanager/index.php?main=menu01&menu=02&sub=mycar_regist&gubun=I"
        const target_url_managerK = "http://xkfxksid.bobaedream.co.kr/supermanager/index.php?main=menu01&menu=02&sub=mycar_regist&gubun=K"
        const target_url_userI = "https://www.bobaedream.co.kr/mycar/mycar_self_step1.php?gubun=I"
        const target_url_userK = "https://www.bobaedream.co.kr/mycar/mycar_self_step1.php?gubun=K"

        //광고 배너 제거하고 버튼 배치
        let sendToBobaePosition = document.querySelector('.ad_area');
        sendToBobaePosition.querySelector('img').style.display = "none";

        let sendToBobaeButton = document.createElement("button");
        sendToBobaeButton.innerText = "관리자 국산";
        sendToBobaeButton.className = "redButtons";
        sendToBobaeButton.addEventListener('click', () => onSendToBobae(target_url_managerK));
        sendToBobaePosition.append(sendToBobaeButton);

        let sendToBobaeButton2 = document.createElement("button");
        sendToBobaeButton2.innerText = "관리자 수입";
        sendToBobaeButton2.className = "redButtons";
        sendToBobaeButton2.addEventListener('click', () => onSendToBobae(target_url_managerI));
        sendToBobaePosition.append(sendToBobaeButton2);

        const br = document.createElement("br");
        sendToBobaePosition.append(br);

        let sendToBobaeButton3 = document.createElement("button");
        sendToBobaeButton3.innerText = "사용자 국산";
        sendToBobaeButton3.className = "redButtons";
        sendToBobaeButton3.addEventListener('click', () => onSendToBobae(target_url_userK));
        sendToBobaePosition.append(sendToBobaeButton3);

        let sendToBobaeButton4 = document.createElement("button");
        sendToBobaeButton4.innerText = "사용자 수입";
        sendToBobaeButton4.className = "redButtons";
        sendToBobaeButton4.addEventListener('click', () => onSendToBobae(target_url_userI));
        sendToBobaePosition.append(sendToBobaeButton4);




        function collectInfo() {
            let dealer_name = "";
            if (document.querySelector('.car_info_201210 tr:nth-of-type(4) td > span:nth-of-type(2)') !== null) {
                dealer_name = document.querySelector('.car_info_201210 tr:nth-of-type(4) td > span:nth-of-type(2)').innerText;
            }

            let dealer_cellphone = "";
            if (document.querySelector('.car_info_201210 tr:nth-of-type(4) td > span:nth-of-type(3)') !== null) {
                dealer_name = document.querySelector('.car_info_201210 tr:nth-of-type(4) td > span:nth-of-type(3)').innerText
            }

            let dealer_regnumber = "";
            if (dealer_name = document.querySelector('.car_info_201210 tr:nth-of-type(4) td > span:nth-of-type(4)') !== null) {
                dealer_regnumber = dealer_name = document.querySelector('.car_info_201210 tr:nth-of-type(4) td > span:nth-of-type(4)').innerText.replace(/[^0-9^a-z^A-Z^-]/g, "");
            }

            let car_regnumber = "";
            if (document.querySelector('#carplatenoCopy') !== null) {
                car_regnumber = document.querySelector('#carplatenoCopy').value;
            }

            let car_jesinumber = "";
            if (document.querySelector('#td_CarParkingPosition + th + td') !== null) {
                car_jesinumber = document.querySelector('#td_CarParkingPosition + th + td').innerText.split(' ')[0];
            }

            let car_model = "";
            if (document.querySelector('.car_info_201210 .drm_c') !== null) {
                car_model = document.querySelector('.car_info_201210 .drm_c').innerText;
            }

            let car_price = "";
            if (document.querySelector('.r_price') !== null) {
                car_price = document.querySelector('.r_price').innerText.replace(/[^0-9]/g, "");
            }

            let car_year = "";
            if (document.querySelector('.car_info_201210 .cl_blue.drm_n') !== null) {
                car_year = document.querySelector('.car_info_201210 .cl_blue.drm_n').innerText.replace(/[^0-9]/g, "");
            }

            let car_month = "";
            if (document.querySelector('.car_info_201210 .cl_blue.drm_n') !== null) {
                car_month = document.querySelector('.car_info_201210 .cl_blue.drm_n').parentNode.innerText.split('(')[1].split('-')[1]
            }

            let car_odometer = "";
            if (document.querySelector('#carusekm') !== null) {
                car_odometer = document.querySelector('#carusekm').innerText.replace(/[^0-9]/g, "");
            }

            let car_fuel = "";
            if (document.querySelector('.car_info_201210 tr:nth-of-type(3) .row') !== null) {
                car_fuel = document.querySelector('.car_info_201210 tr:nth-of-type(3) .row').innerText;
            }

            let car_color = "";
            if (document.querySelector('.car_info_201210 tr:nth-of-type(3) td:nth-of-type(2)') !== null) {
                car_color = document.querySelector('.car_info_201210 tr:nth-of-type(3) td:nth-of-type(2)').innerText;
            }

            let car_tranny = "";
            if (document.querySelector('#carusekm + th + td') !== null) {
                car_tranny = document.querySelector('#carusekm + th + td').innerText;
            }

            let car_option = [];
            if (document.querySelector('#ui_popup_cardetail') !== null) {
                car_option = [
                    ...[...document.querySelector('#ui_popup_cardetail .info_left').querySelectorAll('.checked')].map((data) => data.textContent.trim()),
                    "-----------------------------------------------------",
                    ...[...document.querySelector('#ui_popup_cardetail .info_right').querySelectorAll('dt, dd')].map((data) => data.textContent.trim())
                ];
            }


            let car_sell_way_type = "A"; // 현금/리스승계
            let car_lease_price = ""; // 리스승계금액

            chrome.storage.local.set({
                "importValue": {
                    "status": true,
                    "dealer_name": dealer_name,
                    "dealer_cellphone": dealer_cellphone,
                    "dealer_regnumber": dealer_regnumber,
                    "dealer_shop": "",
                    "dealer_union": "",

                    "car_regnumber": car_regnumber,
                    "car_jesinumber": car_jesinumber,
                    "car_model": car_model,
                    "car_price": car_price,
                    "car_lease_price": car_lease_price,
                    "car_year": car_year,
                    "car_month": car_month,
                    "car_odometer": car_odometer,
                    "car_type": "",
                    "car_color": car_color,
                    "car_tranny": car_tranny, //자동, 수동
                    "car_cc": "",
                    "car_fuel": car_fuel, // 가솔린, 디젤, LPG, 가솔린/LPG겸용, 가솔린/CNG겸용, 가솔린 하이브리드, LPG 하이브리드, 디젤 하이브리드, CNG, 전기, 수소, 기타
                    "car_seizure": "", // 압류
                    "car_mortgage": "",  // 저당
                    "car_crash": "n",  // 사고여부
                    "car_sell_way_type": car_sell_way_type, // A : 일반차량, B : 할부승계차량, C : 리스승계차량
                    "car_option": car_option,
                    "target_url": target_url
                }
            });
        }

        function onSendToBobae(url) {
            collectInfo()
            window.open(url);
        }
    }
})

