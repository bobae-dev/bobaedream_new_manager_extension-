chrome.storage.local.get("status").then((res) => {
    if (res.status === true) {

        const url = new URLSearchParams(window.location.search);
        const boardCode = url.get("code");
        const excludes = ["bb_talk", "event_notice", "bbstory"].includes(boardCode);

        let articles = document.querySelector("#boardlist").querySelectorAll("tr:not(:has(.admin02))");

        for (var i = 1; i < articles.length; i++) {

            //작성자 회원정보 보기 버튼 추가
            let writerCid = articles[i].querySelector(".author02>span").getAttribute("onClick").split("('")[1].split("');")[0];
            let viewInfoButton = document.createElement("button");
            viewInfoButton.innerText = "회원정보";
            viewInfoButton.className = "writerInfoViewButton redButtons";
            viewInfoButton.addEventListener('click', () => viewIdInfo(writerCid));
            articles[i].querySelector("a").before(viewInfoButton);

            if (!excludes) {
                const articleNumber = articles[i].querySelector("a").getAttribute("href").split("&No=")[1].split("&")[0];

                /*게시물 리스트에 체크박스 추가
                let articleCheckbox = document.createElement('input');
                articleCheckbox.type = "checkbox";
                articleCheckbox.value = articleNumber;
                articles[i].querySelector("td:has(a)").prepend(articleCheckbox)
                */

                //추천수 클릭시 내역 보기 추가
                let recommendListView = articles[i].querySelector(".recomm");
                recommendListView.style.cssText = "cursor : pointer;";
                recommendListView.addEventListener("click", () => {
                    if (boardCode === "best") {
                        alert("베스트 게시판은 추천내역을 볼 수 없습니다.");
                    } else {
                        window.open("http://xkfxksid.bobaedream.co.kr/supermanager/_menu03/board/recommand_list.php?tb=" + boardCode + "&No=" + articleNumber);
                    }
                });
            }
        }

        /* 관리자 기능 버튼 추가
        let addButtons = document.getElementsByClassName("clistSearch03")[0]
        addButtons.innerHTML = addButtons.innerHTML + "<button>삭제</button><button>블라인드</button>";
        */

        //회원정보 보기 버튼 클릭시 cid 변환하고 관리자 URL 띄움
        function viewIdInfo(cid) {
            let cidUrl = "http://xkfxksid.bobaedream.co.kr/supermanager/_menu03/member/cid_decrypt.php?cid=" + cid;
            //타 도메인과 통신이 필요한 부분은 백그라운드로 URL과 콜백함수 넘겨서 처리
            chrome.runtime.sendMessage(
                {
                    type: "getCidtoID",
                    payload: cidUrl,
                },
                data => {
                    const userIdUrl = "http://xkfxksid.bobaedream.co.kr/superuser/Manager/Member/MemModForm.php?user_id=" + data.split("value = '")[1].split("';")[0];
                    window.open(userIdUrl, "", "");
                }
            );
        }
    }
})


//CID 복호화 해제 http://xkfxksid.bobaedream.co.kr/supermanager/_menu03/member/cid_decrypt.php?cid=
//관리자 닉네임검색 http://xkfxksid.bobaedream.co.kr/supermanager/index.php?main=menu03&menu=04&sub=board_list&board=data&code=strange&default_search=2&search_str=%C5%B8%C6%C4%C0%CC%B1%E2%C1%D6%C0%C7