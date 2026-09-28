chrome.storage.local.get(["status", "importValue"]).then((res) => {
    if (res.status === true && res.importValue.status === true) {
        window.onload = () => {
            setTimeout(() => {
                document.querySelector("[class^='PeerIntoCarOptions_btn_option']").click();
                chrome.storage.local.set({
                    "importValue": {
                        ...res.importValue,
                        "car_option": [...document.querySelectorAll("[class^='PeerIntoCarOptions_on']")].map((data) => data.innerText)
                    }
                }).then(() => {
                    window.open(res.importValue.target_url);
                    window.close();
                });
            }, 500);
        }
    }
})

