chrome.storage.local.get(["status", "autoDelete", "keyCount", "autoDeleteKeyword"]).then((res) => {
    if (res.status === true) {

        let form = document.querySelector('form[name="bform2"]');
        let form_search = document.querySelector('form[name="frm_search"]')

        let curruntKeywords = res.autoDeleteKeyword
        let keyCount = res.keyCount

        let nextListSelected = document.querySelector('select[name="seltb"]'); //년월 선택 셀렉터

        /* --------------UI 생성 -----------------*/

        let autoDeleteDiv = document.createElement("div");
        autoDeleteDiv.className = "autoDeleteDiv";

        let hrTag = document.createElement("hr");

        // 달 이동 버튼

        let selectMontBeforeButton = document.createElement("span");
        if (nextListSelected[nextListSelected.options.selectedIndex -1] !== undefined) {
            selectMontBeforeButton.innerText = nextListSelected[nextListSelected.options.selectedIndex -1].innerText;
            selectMontBeforeButton.className = "redButtons";
            selectMontBeforeButton.title = "시프트 + 오른쪽 방향키"
            selectMontBeforeButton.addEventListener('click', () => selectMonth());
        } else {
            selectMontBeforeButton.style.display = 'none';  //해당 달이 없으면 버튼 표시 안함
        }

        let selectMonthAfterButton = document.createElement("span");
        if (nextListSelected[nextListSelected.options.selectedIndex +1] !== undefined) {
            selectMonthAfterButton.innerText = nextListSelected[nextListSelected.options.selectedIndex +1].innerText;
            selectMonthAfterButton.className = "redButtons";
            selectMonthAfterButton.title = "시프트 + 왼쪽 방향키"
            selectMonthAfterButton.addEventListener('click', () => selectMonth(1));
        } else {
            selectMonthAfterButton.style.display = 'none';  //해당 달이 없으면 버튼 표시 안함
        }

        //자동삭제 on/off 버튼
        let autoDeleteButton = document.createElement("span");
        autoDeleteButton.innerText = "기간자동삭제";
        autoDeleteButton.className = "redButtons";

        //키워드 자동삭제 on/off 버튼
        let autoKeywordDeleteButton = document.createElement("span");
        autoKeywordDeleteButton.innerText = "키워드자동삭제";
        autoKeywordDeleteButton.className = "redButtons";

        let addAutoKeywordButton = document.createElement("span");
        addAutoKeywordButton.innerText = "키워드 추가";
        addAutoKeywordButton.className = "redButtons floatRight";
        addAutoKeywordButton.addEventListener('click', () => {
            addKeyword(document.querySelector("#inputKeywords").value)
        });

        //키워드 추가용 입력상자 (입력하고 엔터키 누르면 추가)
        let addAutoKeywordInput = document.createElement("input");
        addAutoKeywordInput.type = "text"
        addAutoKeywordInput.id = "inputKeywords"
        addAutoKeywordInput.className = "inputKeywords floatRight"
        addAutoKeywordInput.placeholder = "쉼표(,) 구분자를 사용해 여러개 입력할 수 있습니다."
        addAutoKeywordInput.addEventListener('keydown', (e) => { if (e.code === "Enter") addKeyword(e.target.value) });

        //버튼 배치
        autoDeleteDiv.append(autoDeleteButton, autoKeywordDeleteButton, addAutoKeywordButton, addAutoKeywordInput, hrTag);
        form.prepend(autoDeleteDiv);
        form_search.querySelectorAll('td')[3].append(selectMonthAfterButton, selectMontBeforeButton);


        /* -------------- 달 넘기기 -----------------*/

        //키보드 단축키 (시프트+방향키)
        document.addEventListener('keydown', (e) => {
            if (e.code === "ArrowLeft" && e.shiftKey) {
                console.log('다음달');
                selectMonth(1)
            }
            if (e.code === "ArrowRight" && e.shiftKey) {
                console.log('이전달');
                selectMonth(-1)
            }
        })

        //달 넘기기 호출시 동작
        let selectMonth = function (target = -1) {
            if (nextListSelected.options.selectedIndex + target < 0) {
                alert("마지막 달입니다.");
                setAutoDeleteState(false);
            } else if (nextListSelected.options.selectedIndex + target > nextListSelected.options.length - 1) {
                alert("최근 달입니다.");
            } else {
                nextListSelected.options[nextListSelected.options.selectedIndex + target].selected = true
                form_search.submit();
            }
        }

        /* --------------전체기간 자동삭제 -----------------*/

        // 자동삭제 상태 변경
        let setAutoDeleteState = function (boolean) {
            if (boolean === true) {
                document.querySelector('input[name="nodel"]').checked = true;
                setAutoKeywordDeleteState(false);
            }
            chrome.storage.local.set({ "autoDelete": boolean });
            form_search.submit();
        }

        //입력된 내용이 있는지 체크(키워드 없이 전체검색시 자동삭제 기능 차단)
        function isValueEmpty() {
            if (document.querySelector('input[name="s_comment"]').value == ""
                && document.querySelector('input[name="s_mem_id"]').value == ""
                && document.querySelector('input[name="s_name"]').value == ""
                && document.querySelector('input[name="s_ip"]').value == ""
                && document.querySelector('input[name="subject"]').value == "") {
                return true;
            }
            else return false;
        }

        //자동삭제 켜져있을시 동작
        if (res.autoDelete === true) {
            if (isValueEmpty() === false) {
                autoDeleteButton.innerText = "기간자동삭제중";
                autoDeleteButton.classList.add("delkeyword")
                autoDeleteButton.addEventListener('click', () => setAutoDeleteState(false));
                checkAll(true);
                setTimeout(() => c_delete(selectMonth, setAutoDeleteState), 1); // UI표시를 위해 약간 딜레이 줌
            }
            else {
                alert("전체검색시에는 자동삭제를 할 수 없습니다");
                setAutoDeleteState(false);
            }
        }
        else {
            autoDeleteButton.addEventListener('click', () =>
                isValueEmpty() ? alert("자동삭제할 키워드를 최소 1개 이상 입력하세요") : setAutoDeleteState(true)
            );
        }

        /* --------------키워드 자동삭제 -----------------*/



        //자동삭제 키워드 표시
        for (var i = 0; i < curruntKeywords.length; i++) {
            let keyword = document.createElement("span");
            keyword.innerText = curruntKeywords[i];
            keyword.title = "클릭하면 삭제됩니다."
            keyCount === i ? keyword.className = "redButtons delkeyword" : keyword.className = "keywords";
            keyword.setAttribute("key", i);
            keyword.addEventListener('click', (e) => {
                curruntKeywords.splice(e.target.attributes.key.value, 1);
                chrome.storage.local.set({ "autoDeleteKeyword": curruntKeywords });
                form.submit();
            })
            autoDeleteDiv.append(keyword);
        }

        //자동삭제 키워드 추가
        let addKeyword = function (added = "") {
            if (added.replaceAll(" ", "") === "") {
                alert("추가할 키워드를 입력해주세요");
            }
            else {
                let data = new Set([...curruntKeywords, ...added.split(',').filter((e) => e.replaceAll(" ", "") !== "").map((e) => { return e.trim() })]);
                chrome.storage.local.set({ "autoDeleteKeyword": [...data] })
                location.reload(true);
            }
        }


        //다음키워드로 넘기기 함수
        let nextKeyword = function () {
            if (keyCount === curruntKeywords.length - 1) {
                alert('모든 키워드를 삭제하였습니다.');
                chrome.storage.local.set({ "keyCount": null });
                document.querySelector('input[name="s_comment"]').value = "";
                document.querySelector('input[name="nodel"]').checked = false;
                form_search.submit();
            }
            else {
                chrome.storage.local.set({ "keyCount": keyCount + 1 });
                document.querySelector('input[name="s_comment"]').value = curruntKeywords[keyCount + 1];
                form_search.submit();
            }
        }

        let setAutoKeywordDeleteState = function (state) {
            if (state) {
                chrome.storage.local.set({ "keyCount": 0 });
                setAutoDeleteState(false)
                document.querySelector('input[name="s_comment"]').value = curruntKeywords[0];
                document.querySelector('input[name="nodel"]').checked = true;
                form_search.submit();
            } else {
                chrome.storage.local.set({ "keyCount": null });
                form_search.submit();
            }
        }

        //키워드 자동삭제 동작
        if (keyCount === null) {
            autoKeywordDeleteButton.addEventListener('click', () => {
                setAutoKeywordDeleteState(true);
            })
        }
        else if (keyCount >= 0) {
            autoKeywordDeleteButton.innerText = "키워드자동삭제중";
            autoKeywordDeleteButton.classList.add("delkeyword")
            autoKeywordDeleteButton.addEventListener('click', () => { setAutoKeywordDeleteState(false) })
            checkAll(true);
            setTimeout(() => c_delete(nextKeyword, setAutoKeywordDeleteState), 1); // UI표시를 위해 약간 딜레이 줌
        }


        /* -------------- 댓글삭제 -----------------*/

        //댓글 전체선택
        function checkAll(targetStatus) {
            for (var i = 0; i < form.elements.length; i++) {
                if (form.elements[i].name == "sno[]") {
                    if (form.elements[i].checked == !targetStatus) form.elements[i].checked = targetStatus;
                }
            }
        }

        //선택된 댓글 전체 삭제
        function c_delete(callback, halt) {
            let cnum = 0;
            for (var i = 0; i < form.elements.length; i++) {
                if (form.elements[i].name == "sno[]") {
                    if (form.elements[i].checked == true) cnum = cnum + 1;
                }
            }
            if (cnum < 1) {
                callback();
                return;
            }
            let result = confirm(cnum + '개의 댓글이 검색되었습니다\n확인을 클릭 하시면 선택하신 댓글을 완전히 삭제, 마력 차감 합니다.');
            if (result == true) {
                form.action = "/supermanager/_menu03/board/commentnew_delete.php";
                form.target = "myhole";
                form.submit();
            } else {
                let result = confirm('해당월/키워드를 제외하고 자동삭제를 계속 진행하시겠습니까?');
                if (result) callback();
                else halt(false);
            }
        }

    }
})
