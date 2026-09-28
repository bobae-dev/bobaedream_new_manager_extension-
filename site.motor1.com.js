let url_parameter = new URLSearchParams(window.location.search);

chrome.storage.local.get(["status", "scrapUrls"]).then((res) => {
    console.log(res.status === true && url_parameter.get('i') === '1')

    if (res.status === true && url_parameter.get('i') === '1') {

        let url = window.location.href.split('?')[0]
        let scrapUrls = res.scrapUrls;

        //수집한 URL 중 현재 URL과 같은 항목이 있는지 확인
        function chk_url() {
            return scrapUrls.findIndex((data) => {
                return data.url === url
            })
        }

        console.log(chk_url())

        //같은 항목이 있으면 해당 항목을 수정
        if (chk_url() !== -1) {
            //window.scrollTo({ top: document.querySelector(".footer").offsetTop });
            let articleTitle = document.querySelector('h1').innerText;
            //[...document.querySelectorAll('.article_cont--body--sentence--inner > p > a')].map((data) => data.remove()); //광고 링크 제거            
            let articleBody = [...document.querySelectorAll('.postBody > p')].map((data) => data.innerText).join('\n')

            setTimeout(() => { //이미지 불러오는 동안 시간 지연
                let articleImages = [document.querySelector('article img'),].map((data) => data.src) //...document.querySelectorAll('.postBody section[data-widget="image"] img')
                console.log(articleImages);

                scrapUrls[chk_url()].status = true;
                scrapUrls[chk_url()].url = url;
                scrapUrls[chk_url()].title = articleTitle;
                scrapUrls[chk_url()].text = articleBody;
                scrapUrls[chk_url()].imgs = articleImages;

                console.log(scrapUrls)
                chrome.storage.local.set({ "scrapUrls": scrapUrls });
                window.close();
            }, 1000)

        }

    }
})

