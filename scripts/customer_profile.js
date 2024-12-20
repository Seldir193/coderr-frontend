let currentCustomerUser;

async function initCProfile() {
    let response = await setCurrentUser();
    setHeader();
    if (!response.ok) {
        window.location.href = "./login.html";
    } else {
        await loadCustomerUser();
        const customerDetailSection = document.getElementById('customer_detail_section');
        if (customerDetailSection) {
            customerDetailSection.innerHTML = getCustomerDetailTemplate();
        } 
        await setUsers();
        await loadRenderCustomerReviews();  
    }
}

async function loadRenderCustomerReviews() {
    if (!currentCustomerUser || !currentCustomerUser.id) {
        return;
    }
    const response = await getData(`${REVIEW_URL}?reviewer_id=${currentCustomerUser.id}&ordering=${currentReviewOrdering}`);
    if (response.ok) {
        currentReviews = response.data;
        const reviewList = document.getElementById('customer_profile_review_list');
        if (reviewList) {
            reviewList.innerHTML = getReviewWLinkTemplateList(currentReviews);
        }
    } else {
        const errors = extractErrorMessages(response.data);
        showToastMessage(true, errors);
    }
}

async function changeReviewFilterCustomerProfile(element){
    currentReviewOrdering = element.value;
    loadRenderCustomerReviews()
}

async function loadCustomerUser() {
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('id');

    if (!profileId) {
        window.location.href = 'index.html';
    } else {
        let resp = await getData(PROFILE_URL + profileId + "/");
        if (resp.ok) {
            if (resp.data.type === "customer") {
                currentCustomerUser = resp.data;
                const customerDetailSection = document.getElementById('customer_detail_section');
                if (customerDetailSection) {
                    customerDetailSection.innerHTML = getCustomerDetailTemplate();
                }
            } else {
                window.location.href = `business_profile.html?id=${resp.data.user}`;
            }
        } else {
            showToastMessage(true, extractErrorMessages(resp.data));
        }
    }
}


