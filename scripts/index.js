async function indexInit() {
    let response = await getBaseInfo();
    if (response.ok) {
        renderBaseInfo(response.data)
    }
}

async function getBaseInfo() {
    let response = await getData(BASE_INFO_URL);
    if (response.ok) {
        currentUser = response.data;
    } else {
        showToastMessage(true, ['Einige Daten konnten nicht geladen werden'])
    }
    return response;
}

function renderBaseInfo(baseInfo){
    for (let key in baseInfo) {
        if (baseInfo.hasOwnProperty(key)) {
            let element = document.getElementById(`base_info_`+key);
            if (element) {
                element.innerText = baseInfo[key];
            }
        }
    }
}

function redirectToOfferListWSearch() {
    const searchValue = document.getElementById("index_search_field").value;
    const urlParams = new URLSearchParams();
    const price = parseFloat(searchValue);
    if (!isNaN(price)) {
        urlParams.append("min_price", price);
    } else {
        urlParams.append("search", searchValue);
    }
    window.location.href = `offer_list.html?${urlParams.toString()}`;
}
