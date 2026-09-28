let url_parameter = new URLSearchParams(window.location.search);

chrome.storage.local.get(["status", "writeArticleData"]).then((res) => {
    if (res.status === true && res.writeArticleData !== undefined && res.writeArticleData !== null) {
        window.onload = () => {
            console.log(res.writeArticleData);
            let contentBody = document.querySelector(".cheditor-editarea").contentWindow.document.querySelector('body')
            let Title = res.writeArticleData.title;
            let Body = res.writeArticleData.body;

            document.querySelector('#Subject').value = Title;
            contentBody.innerHTML = "<p>" + Body + "</p>"

            //이미지 업로드 처리
            for (let i = 0; i < res.writeArticleData.imgs.length; i++) {

                //이미지 순서 뒤집히지 않게 이미지 자리 미리 생성
                let imgPosition = document.createElement("P");
                imgPosition.className = 'imgPosition';
                contentBody.append(imgPosition);

                //이미지url을 백그라운드로 넘겨서 cors제한 우회하고 다운로드
                chrome.runtime.sendMessage(
                    {
                        type: "getUploadedImageURL",
                        payload: res.writeArticleData.imgs[i],
                    },
                    data => {
                        //base64로 받아온 파일을 JPEG로 변환
                        const convertImg = new Image();
                        convertImg.src = data;
                        console.log(convertImg.src);
                        convertImg.onload = () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = convertImg.width;
                            canvas.height = convertImg.height;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(convertImg, 0, 0);
                            const Base64 = canvas.toDataURL('image/jpeg');

                            fetch(Base64)
                                // base64 데이터를 blob으로 변환
                                .then(res => res.blob())
                                .then(res => {
                                    //blob 데이터를 보배 서버에 업로드
                                    const formData = new FormData();

                                    formData.append('origname', 'bobaemanager.jpg')
                                    formData.append('file', res, 'bobaemanager.jpg');

                                    const code = document.querySelector('[name="iframe_subfile"]').src.split('code=')[1].split('&mktime')[0]
                                    const mktime = document.querySelector('[name="iframe_subfile"]').src.split('&mktime=')[1]

                                    fetch('https://www.bobaedream.co.kr/cheditor/imageUpload/upload.php?code=' + code + '&mktime=' + mktime, {
                                        method: 'POST',
                                        body: formData
                                    }).then(res => {
                                        if (!res.ok) {
                                            throw new Error('HTTP error! status:' + res.status);
                                        }
                                        return res.json()
                                    }).then(res => {
                                        //서버에서 반환된 이미지 주소를 미리 잡은 P태그에 순서대로 삽입 
                                        let addImgs = document.createElement("img");
                                        addImgs.src = res.fileUrl
                                        addImgs.style.width = '100%'
                                        addImgs.style.height = 'auto'
                                        url_parameter.get('from') === 'aagag' ? 
                                        contentBody.querySelectorAll('div.stag')[i].append(addImgs) : 
                                        contentBody.querySelectorAll('p.imgPosition')[i].append(addImgs);
                                    })
                                });
                        };
                    }
                );
            }
            //데이터 초기화
            chrome.storage.local.set({
                "writeArticleData": null
            })
        }
    }
})