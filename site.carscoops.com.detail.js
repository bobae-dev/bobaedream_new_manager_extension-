let url = new URLSearchParams(window.location.search);

chrome.storage.local.get(["status", "scrapUrls"]).then((res) => {
    if (res.status === true && url.get('i') === '1') {


        let url = window.location.href.split('?')[0]
        let scrapUrls = res.scrapUrls;
        console.log(url)

        //수집한 URL 중 현재 URL과 같은 항목이 있는지 확인
        function chk_url() {
            return scrapUrls.findIndex((data) => {
                return data.url === url
            })
        }

        //같은 항목이 있으면 해당 항목을 수정
        if (chk_url() !== -1) {
            let articleTitle = document.querySelector('.title').innerText
            let articleBody = [...document.querySelectorAll('.article-body p:not([class]):not(:has(strong))')].map((data) => data.innerText).join('\n')

            function sleep(ms) {
                return new Promise((r) => setTimeout(r, ms));
            }
            window.scrollTo({ top: document.querySelector(".footer-wrapper").offsetTop });
            for (let i = 0; i < document.querySelector(".swiper-pagination-total").length; i++) {
                sleep(1000 * (i + 1)).then(() => {
                    document.querySelector(".swiper-button-next").click()
                    console.log((i + 1) + '번째 클릭함')
                });
            }
            /*
                        for (let i = 0; i < document.querySelectorAll(".image-gallery").length; i++) {
                            window.scrollTo({ top: document.querySelectorAll(".image-gallery")[i].offsetTop });
                        }
            */
            //document.querySelector('.highres-gallery img').click()
            setTimeout(() => { //이미지 불러오는 동안 시간 지연
                let articleImages = [...document.querySelectorAll('.swiper-container.top-gallery .swiper-slide:not(.swiper-slide-duplicate) img')].map((data) => data.src)
                console.log(articleImages);

                scrapUrls[chk_url()].status = true;
                scrapUrls[chk_url()].url = url;
                scrapUrls[chk_url()].title = articleTitle;
                scrapUrls[chk_url()].text = articleBody;
                scrapUrls[chk_url()].imgs = articleImages;

                console.log(scrapUrls[chk_url()])
                chrome.storage.local.set({ "scrapUrls": scrapUrls });
                //window.close();
            }, 1000)

        }

    }
})

