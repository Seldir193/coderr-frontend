let currentOfferListFilter = {
    search: "",
    page: 1,
    ordering: "",
    max_delivery_time: "",
    min_price: "", 
    max_price: ""
}
let currentmaxDeliveryTime = "";

async function offerListInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    const minPrice = urlParams.get('min_price');

    if (minPrice) {
        currentOfferListFilter.min_price = parseFloat(minPrice);
    }

    if (search) {
        currentOfferListFilter.search = search;
        document.getElementById("offer_list_searchbar").value = search;
    }

    await setCurrentUser();
    setGreetingsSection();
    await setOffersWODetails(currentOfferListFilter);
    renderOfferList();
}

function calculateNumPages(totalItems, pageSize) {
    return Math.ceil(totalItems / pageSize);
}

function renderOfferList() {
    let listRef = document.getElementById("offer_list_content");
     listRef.innerHTML = getOfferTemplateList(currentOffers) + getOfferPagination(calculateNumPages(allOffersLength, PAGE_SIZE), currentOfferListFilter.page);
 }
 
 async function goToOfferPage(pageNum) {
     if (pageNum) {
         currentOfferListFilter.page = pageNum
     }
     updateOfferListFilter()
 }
 
async function updateOfferListFilter() {
    currentOfferListFilter.ordering = document.getElementById("offer_list_filter_ordering").value;
    await setOffersWODetails(currentOfferListFilter);
    renderOfferList()
}

async function updateOfferListFilterMaxDeliveryTime() {
    currentOfferListFilter.max_delivery_time = currentmaxDeliveryTime;
    updateOfferListFilter()
}

async function updateOfferListFilterSearch() {
    const searchValue = document.getElementById("offer_list_searchbar").value.trim();
    const price = parseFloat(searchValue);
    if (!isNaN(price) && price > 0) {
        currentOfferListFilter.min_price = price; 
        delete currentOfferListFilter.max_price; 
        currentOfferListFilter.search = ""; 
    } else {
        currentOfferListFilter.search = searchValue; 
        delete currentOfferListFilter.min_price; 
        delete currentOfferListFilter.max_price; 
    }
    await updateOfferListFilter();
}

function setGreetingsSection() {
    if (currentUser) {
        let greetingRef = document.getElementById("offer_list_greeting_section");
        greetingRef.classList.remove('d_none');
        let name = currentUser.first_name ? currentUser.first_name : "@" + currentUser.username
        greetingRef.innerHTML = getGreetingBoxTemplate(name)
    }
}

function offerListDeactivateAllRadio() {
    let element = document.getElementById('offer_list_delivery_time_box')
    const radioInputs = element.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(element => {
        if (element) {
            element.checked = false;
        }
    });
}

function offerListAbboardDeliveryTime() {
    offerListDeactivateAllRadio();
    currentmaxDeliveryTime = ''; 
    updateOfferListFilterMaxDeliveryTime();
    toggleOpenId('time_filter');
}

function offerListApplyDeliveryTimeFilter() {
    updateOfferListFilterMaxDeliveryTime();
    toggleOpenId('time_filter');
}

