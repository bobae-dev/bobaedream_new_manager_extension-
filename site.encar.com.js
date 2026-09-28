let url = new URLSearchParams(window.location.search);
chrome.storage.local.get("status").then((res) => {
    if (res.status === true) {

        //등록폼 링크
        let target_url = "";
        const target_url_managerI = "http://xkfxksid.bobaedream.co.kr/supermanager/index.php?main=menu01&menu=02&sub=mycar_regist&gubun=I"
        const target_url_managerK = "http://xkfxksid.bobaedream.co.kr/supermanager/index.php?main=menu01&menu=02&sub=mycar_regist&gubun=K"
        const target_url_userI = "https://www.bobaedream.co.kr/mycar/mycar_self_step1.php?gubun=I"
        const target_url_userK = "https://www.bobaedream.co.kr/mycar/mycar_self_step1.php?gubun=K"

        //옵션 링크
        let option_url = "https://fem.encar.com/cars/option/" + document.querySelector('[class^="DetailCarPhotoPc_info"] > li').innerText.split('등록번호 ')[1];

        //관리자 버튼
        let sendToBobaePosition = document.querySelector('[data-enlog-dt-eventname=전체메뉴]').parentNode;
        sendToBobaeButton = document.createElement("button");
        sendToBobaeButton.innerText = "보배관리자 등록";
        sendToBobaeButton.className = "redButtons";
        //url에 국산차 관련 패러미터가 있는 경우 국산차 링크로 연결
        sendToBobaeButton.addEventListener('click', () => url.get('wtClick_korList') === null ? onSendToBobae(target_url_managerI) : onSendToBobae(target_url_managerK));
        sendToBobaePosition.append(sendToBobaeButton);

        //사용자 버튼  
        sendToBobaeButton2 = document.createElement("button");
        sendToBobaeButton2.innerText = "보배사용자 등록";
        sendToBobaeButton2.className = "redButtons";
        sendToBobaeButton2.addEventListener('click', () => url.get('wtClick_korList') === null ? onSendToBobae(target_url_userI) : onSendToBobae(target_url_userK));
        sendToBobaePosition.append(sendToBobaeButton2);


        function collectInfo() {
            let dealer_name = "";
            if (document.querySelector('[class^="DetailSeller_name"]') !== null) {
                dealer_name = document.querySelector('[class^="DetailSeller_name"]').innerText;
            } else if (document.querySelector('[class^="DetailCarExplain_name"]') !== null) {
                dealer_name = document.querySelector('[class^="DetailCarExplain_name"]').innerText;
            }

            let dealer_regnumber = "";
            if (document.querySelector('[class^="DetailSeller_info_seller"] li:nth-child(4)') !== null) {
                dealer_regnumber = document.querySelector('[class^="DetailSeller_info_seller"] li:nth-child(4)').innerText.split(' ')[1].split('상사')[0]
            } else if (document.querySelector('[class^="DetailCarExplain_info_seller"] li:nth-child(4)') !== null) {
                dealer_regnumber = document.querySelector('[class^="DetailCarExplain_info_seller"] li:nth-child(4)').innerText.split(' ')[1].split('상사')[0]
            }

            let dealer_shop = "";
            if (document.querySelector('[class^="DetailSeller_company"]') !== null) {
                dealer_shop = document.querySelector('[class^="DetailSeller_company"]').innerText;
            } else if (document.querySelector('[class^="DetailCarExplain_company"]') !== null) {
                dealer_shop = document.querySelector('[class^="DetailCarExplain_company"]').innerText;
            }

            let car_regnumber = ""
            if (document.querySelector('[class^="DetailSummary_vehicle_num"]') !== null) {
                car_regnumber = document.querySelector('[class^="DetailSummary_vehicle_num"]').innerText;
            }

            let car_jesinumber = ""
            if (document.querySelector('[class^="DetailInspect_txt_record"]') !== null) {
                car_jesinumber = document.querySelector('[class^="DetailInspect_txt_record"]').innerText.split(': ')[1];
            }

            let car_model = ""
            if (document.querySelector('[class^="DetailSummary_tit_car"]') !== null) {
                car_model = document.querySelector('[class^="DetailSummary_tit_car"]').innerText;
            }

            let car_price = ""
            if (document.querySelector('[class^="DetailLeadCase_price"]') !== null) {
                car_price = document.querySelector('[class^="DetailLeadCase_price"]').innerText.replace(/[^0-9]/g, "");
            }

            let car_year = ""
            if (document.querySelector('[class^="DetailSummary_define_summary"] > dd:nth-child(2)') !== null) {
                car_year = document.querySelector('[class^="DetailSummary_define_summary"] > dd:nth-child(2)').innerText.split('/')[0];
                car_year < 30 ? car_year = '20' + car_year : car_year = '19' + car_year;
            }

            let car_month = ""
            if (document.querySelector('[class^="DetailSummary_define_summary"] dd:nth-child(2)') !== null) {
                car_month = document.querySelector('[class^="DetailSummary_define_summary"] dd:nth-child(2)').innerText.split('/')[1].split('식')[0];
            }

            let car_odometer = ""
            if (document.querySelector('[class^="DetailSummary_define_summary"] dd:nth-child(4)') !== null) {
                car_odometer = document.querySelector('[class^="DetailSummary_define_summary"] dd:nth-child(4)').innerText.replace(/[^0-9]/g, "");
            }

            let car_fuel = ""
            if (document.querySelector('[class^="DetailSummary_define_summary"] dd:nth-child(6)') !== null) {
                car_fuel = document.querySelector('[class^="DetailSummary_define_summary"] dd:nth-child(6)').innerText;
            }

            let car_sell_way_type = "A"; // 현금/리스승계
            let car_lease_price = ""; // 리스승계금액
            if (document.querySelector('[class^="DetailLeadCase_txt"]') !== null) {
                car_sell_way_type = "C"
                car_lease_price = document.querySelector('[class^="DetailSummaryLeaseRent_price"]').innerText.replace(/[^0-9]/g, "");
            }

            chrome.storage.local.set({
                "importValue": {
                    "status": true,
                    "dealer_name": dealer_name,
                    "dealer_cellphone": "",
                    "dealer_regnumber": dealer_regnumber,
                    "dealer_shop": dealer_shop,
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
                    "car_color": "",
                    "car_tranny": "", //자동, 수동
                    "car_cc": "",
                    "car_fuel": car_fuel, // 가솔린, 디젤, LPG, 가솔린/LPG겸용, 가솔린/CNG겸용, 가솔린 하이브리드, LPG 하이브리드, 디젤 하이브리드, CNG, 전기, 수소, 기타
                    "car_seizure": "", // 압류
                    "car_mortgage": "",  // 저당
                    "car_crash": "n",  // 사고여부
                    "car_sell_way_type": car_sell_way_type, // A : 일반차량, B : 할부승계차량, C : 리스승계차량
                    "car_option": [],
                    "target_url": target_url
                }
            });
        }

        function onSendToBobae(url) {
            target_url = url
            collectInfo()
            window.open(option_url);
        }
    }
})

