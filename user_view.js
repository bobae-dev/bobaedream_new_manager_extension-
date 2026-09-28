//게시물 열람시 처리되는 내용들

chrome.storage.local.get("status").then((res) => {
    if (res.status === true) {

        const curruntUrl = document.location.href;
        const boardCode = curruntUrl.split("?code=")[1].split("&")[0];
        let writer = document.querySelector(".proCont");
        const writerCidValue = writer.getElementsByTagName("a")[0].getAttribute("href").split("mycommunity?cid=")[1];

        //관리자 처리용 URL
        const cidDecryptUrl = "http://xkfxksid.bobaedream.co.kr/supermanager/_menu03/member/cid_decrypt.php?cid="; //cid 변환
        const userIdUrl = "http://xkfxksid.bobaedream.co.kr/superuser/Manager/Member/MemModForm.php?user_id="; //회원정보
        const viewReportsUrl = "http://xkfxksid.bobaedream.co.kr/superuser/board/bad_board_list.php?search_name=id&search_str="; //신고내역

        //게시물 본문 작성자 회원정보 보기 버튼 추가
        let writerViewButton = document.createElement("button");
        writerViewButton.innerText = "회원정보";
        writerViewButton.className = "redButtons";
        writerViewButton.addEventListener('click', () => viewIdInfo(writerCidValue, userIdUrl));
        writer.after(writerViewButton);

        //게시물 신고내역 보기 버튼 추가
        let viewReports = document.querySelector('.dtTopBtns');
        viewReportsButton = document.createElement("button");
        viewReportsButton.innerText = "신고내역";
        viewReportsButton.className = "redButtons";
        viewReportsButton.addEventListener('click', () => viewIdInfo(writerCidValue, viewReportsUrl))
        viewReports.append(viewReportsButton);

        //키보드 단축키 (방향키로 이전글 다음글)
        document.addEventListener('keydown', (e) => {
            if (document.activeElement.tagName !== 'TEXTAREA') {
                if (e.code === "ArrowLeft") {
                    document.querySelector('.Upnav .p2 a').click()
                }
                if (e.code === "ArrowRight") {
                    document.querySelector('.Upnav .p3 a').click()
                }
            }
        })

        //댓글 페이지 넘김 변경 감지
        onCommentChanged();
        const commentObserver = new MutationObserver(() => {
            commentObserver.disconnect(); //무한루프 방지 위해 일단 변경 감지 해제
            onCommentChanged();
            commentObserver.observe(document.querySelector('#cmt_list'), { attributes: true, childList: true, subtree: true }); //변경 감지 재개
        });
        commentObserver.observe(document.querySelector('#cmt_list'), { attributes: true, childList: true, subtree: true })

        //댓글 작성자 회원정보 보기 버튼 추가
        function onCommentChanged() {
            let replyWriter = document.getElementsByClassName("name");
            for (var i = 0; i < replyWriter.length; i++) {
                if (replyWriter[i].querySelector('.redButtons') === null) {
                    const value = replyWriter[i].getElementsByTagName("span")[0].getAttribute("onClick").split("('")[1].split("','")[0];
                    let viewButton = document.createElement('button');
                    viewButton.innerText = "회원정보";
                    viewButton.className = "redButtons";
                    viewButton.addEventListener('click', () => viewIdInfo(value, userIdUrl));
                    replyWriter[i].append(viewButton);
                }
            }
        }

        //하단 리스트 페이지 넘김 변경 감지
        onlistChanged()
        const listObserver = new MutationObserver(() => {
            listObserver.disconnect(); //무한루프 방지 위해 일단 변경 감지 해제
            onlistChanged()
            listObserver.observe(document.querySelector('#cont_list'), { attributes: true, childList: true, subtree: true }); //변경 감지 재개
        });
        listObserver.observe(document.querySelector('#cont_list'), { attributes: true, childList: true, subtree: true, })

        //본문 하단 리스트에 회원정보 보기 버튼 추가
        function onlistChanged() {
            let articleWriter = document.querySelectorAll("td.author");
            for (var i = 0; i < articleWriter.length; i++) {
                if (articleWriter[i].parentElement.querySelector('.redButtons') === null) {
                    const value = articleWriter[i].getElementsByTagName("span")[0].getAttribute("onClick").split("('")[1].split("');")[0];
                    let viewButton = document.createElement('button');
                    viewButton.innerText = "회원정보";
                    viewButton.className = "writerInfoViewButton redButtons";
                    viewButton.addEventListener('click', () => viewIdInfo(value, userIdUrl));
                    articleWriter[i].parentElement.querySelectorAll("td")[1].append(viewButton);
                }
            }
        }

        //cid와 타겟url 보내면 새창 띄우기
        function viewIdInfo(cid, targetUrl) {

            chrome.runtime.sendMessage(
                {
                    type: "getCidtoID",
                    payload: cidDecryptUrl + cid,
                },
                data => {
                    const id = data.split("value = '")[1].split("';")[0];
                    window.open(targetUrl + id, "", "");
                }
            );
        }

    }
})



//게시물 신고내역 보기 http://xkfxksid.bobaedream.co.kr/superuser/board/bad_board_list.php?search_name=id&search_str=
//테스트용 블라인드된 게시물 https://www.bobaedream.co.kr/view?code=battle&No=1351298&rtn=%2Fboard%2Fbulletin%2Flist.php%3Fcode%3Dbattle

//댓글신고블라  http://xkfxksid.bobaedream.co.kr/supermanager/_menu03/board/commentnew_admin_del.php

