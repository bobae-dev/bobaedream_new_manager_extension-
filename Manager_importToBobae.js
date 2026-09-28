chrome.storage.local.get(["status", "importValue"]).then((res) => {
    if (res.status === true && res.importValue.status === true) {

        console.log(res.importValue);


        // 이름
        document.getElementsByName('user_name')[0].value = res.importValue.dealer_name;

        // 연락처
        document.getElementById('phone_cel').value = res.importValue.dealer_cellphone;

        // 차량번호
        document.getElementById('car_number').value = res.importValue.car_regnumber;

        // 수입차 선택
        document.querySelector('#gubun').value = 'I'

        // 모델 표시
        let viewCurrentModel = document.createElement("p");
        viewCurrentModel.innerText = res.importValue.car_model;
        viewCurrentModel.style.color = 'red';
        document.querySelector("#id_cardepth_0").parentNode.prepend(viewCurrentModel);

        // 연식
        document.getElementById('buy_year1').value = res.importValue.car_year;

        // 월
        document.getElementById('buy_year2').value = res.importValue.car_month;

        // 변속기
        document.getElementById('method').value = res.importValue.car_tranny;

        // 배기량
        document.getElementsByName('cc')[0].value = res.importValue.car_cc;

        // 주행거리
        document.getElementsByName('km')[0].value = res.importValue.car_odometer;

        // 연료
        document.getElementById('fuel').value = res.importValue.car_fuel;

        // 판매가격
        document.getElementById('car_price').value = res.importValue.car_price;

        // 구입조건
        if (res.importValue.car_sell_way_type === 'A') document.getElementsByName('sell_way_type')[0].click();
        if (res.importValue.car_sell_way_type === 'B') document.getElementsByName('sell_way_type')[1].click();
        if (res.importValue.car_sell_way_type === 'C') document.getElementsByName('sell_way_type')[2].click();

        // 제시번호
        document.getElementsByName('jesi_num')[0].value = res.importValue.car_jesinumber;

        // 입력값 초기화
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
                "car_lease_price":"",
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
                "car_option": "",
                "target_url": ""
            }
        });
    }
})
