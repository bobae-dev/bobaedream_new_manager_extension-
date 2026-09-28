chrome.storage.local.get(["status"]).then((res) => {
    if (res.status === true) {
        // 추천 링크를 새탭으로 띄우는 방식으로 변경 (다른 글 클릭시 기존 자동추천창이 갱신되는것을 방지)
        let recLink = document.querySelectorAll('.board-list tr:nth-of-type(odd) td:nth-of-type(9) a');
        recLink.forEach((a) => {
            a.target = "_blank";
            a.href = a.href.split("('")[1];
            a.href = a.href.split("%27,")[0];
        })
    }
})
