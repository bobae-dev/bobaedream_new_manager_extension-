let url_parameter = new URLSearchParams(window.location.search);

chrome.storage.local.get(["status", "scrapUrls"]).then((res) => {
    console.log(res.status === true && url_parameter.get('i') === '1')

    if (res.status === true && url_parameter.get('i') === '1') {


        let url = window.location.href.split('?')[0]
        let scrapUrls = res.scrapUrls;

        console.log('dd')
        console.log(url)

        //수집한 URL 중 현재 URL과 같은 항목이 있는지 확인
        function chk_url() {
            return scrapUrls.findIndex((data) => {
                return data.url === url
            })
        }

        //같은 항목이 있으면 해당 항목을 수정
        if (chk_url() !== -1) {
            let articleTitle = document.querySelector('.article-title').innerText
            let articleBody = [...document.querySelectorAll('.article-body > p')].map((data) => data.innerText).join('\n')

            if (document.querySelector('.highres-gallery img') !== null) document.querySelector('.highres-gallery img').click()
            setTimeout(() => { //이미지 불러오는 동안 시간 지연
                let articleImages = [...document.querySelectorAll('.swiper-container.top-gallery .swiper-slide:not(.swiper-slide-duplicate) img')].map((data) => data.src)
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

