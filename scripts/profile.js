let currentOrders = [];
let currentBusinessUser = null;
let currentBusinessOfferListFilter = {
    creator_id: null,
    page: 1,
}

async function init() {
    let response = await setCurrentUser(); setHeader();
    if (!response.ok) { window.location.href = "./login.html"; return; }
    if (currentUser.type === "business") {
        await initializeBusinessUser();
    } else if (currentUser.type === "customer") {
        await initializeCustomerUser();
    } else { 
        showToastMessage(true, ["Ungültiger Benutzerprofiltyp"]); 
    }
}

async function initializeBusinessUser() {
    await loadBusinessOffers(); 
    await setReviewsForBusinessUser(getAuthUserId());
    const contentRef = document.getElementById("content"); 
    if (contentRef) {
        contentRef.innerHTML = getBusinessProfilePageTemplate(currentUser, currentOrders, currentOffers, currentReviews);
    }
    await loadBusinessOrders(); 
    renderBusinessOrders(); 
    await loadBusinessProfile();
}

async function initializeCustomerUser() {
    const contentRef = document.getElementById("content"); 
    if (contentRef) {
        contentRef.innerHTML = getCustomerProfilePageTemplate();
    }
    await loadCustomerOrders(); 
    await setReviewsForCustomerUser(getAuthUserId());
    await loadCustomerProfile(); 
    renderCustomerOrders(); 
    renderCustomerProfile(); 
    renderCustomerReviews();
}

async function updateBusinessProfile(formData) {
    try {
        if (currentFile) formData.append('profile_image', currentFile);
        const resp = await patchData(`${PROFILE_URL}${currentUser.id}/`, formData);
        if (resp.ok) {
            const userResp = await getData(`${PROFILE_URL}${currentUser.id}/`);
            if (userResp.ok) {
                currentBusinessUser = userResp.data; 
                currentUser = userResp.data;
                renderBusinessProfile(); 
                renderHeader(); 
                closeDialog("business_dialog"); 
                showToastMessage(false, ["Profil erfolgreich aktualisiert!"]);
            } else {
                showToastMessage(true, ["Profil konnte nicht aktualisiert werden."]);
            }
        } else {
            showToastMessage(true, extractErrorMessages(resp.data));
        }
    } catch (error) {
        showToastMessage(true, ["Netzwerkfehler beim Aktualisieren des Profils."]);
    }
}

function renderHeader() {
    const headerContent = document.getElementById("head_content_right"); 
    if (!headerContent) {
        console.error("Header-Container nicht gefunden!");
        return;
    }
    headerContent.innerHTML = getLogedInHeaderTemplate();
}

function renderBusinessProfile() {
    const profileSection = document.getElementById("business_profile"); 
    if (!profileSection) {
        return;
    }

    if (currentBusinessUser) {
        profileSection.innerHTML = getBusinessProfileTemplate(currentBusinessUser); 
    } else {
        profileSection.innerHTML = `<div>Fehler beim Laden des Business-Profils.</div>`;
    }
}

async function updateCustomerProfile(formData) {
    if (currentFile) formData.append('file', currentFile);
    try {
        let resp = await patchData(`${PROFILE_URL}${currentUser.id}/`, formData);
        if (resp.ok) {
            let userResp = await getData(`${PROFILE_URL}${currentUser.id}/`);
            if (userResp.ok) {
                currentUser = userResp.data;
                closeDialog('customer_dialog');
                renderCustomerProfile();
                renderHeader();
                showToastMessage(false, ["Profil erfolgreich aktualisiert!"]);
            } else showToastMessage(true, ["Profil konnte nicht aktualisiert werden."]);
        } else showToastMessage(true, extractErrorMessages(resp.data));
    } catch (error) {
        showToastMessage(true, ["Netzwerkfehler beim Aktualisieren des Profils."]);
    }
}

function renderCustomerProfile() {
    const profileSection = document.getElementById("customer_profile"); 
    if (profileSection) {
        if (currentCustomerUser) {
            profileSection.innerHTML = getCustomerProfileTemplate(currentCustomerUser); 
        } else {
            profileSection.innerHTML = `<div>Fehler beim Laden des Kundenprofils.</div>`;
        }
    } 
}

async function loadBusinessProfile() {
    if (!currentUser || !currentUser.id) {
        return;
    }
    try {
        const response = await getData(`${BUSINESS_PROFILES_URL}${currentUser.id}/`);  
        if (response.ok) {
            currentBusinessUser = response.data;
            const profileElement = document.getElementById("business_profile");
            if (profileElement) {
                profileElement.innerHTML =  getBusinessProfileTemplate(currentBusinessUser);
            }
            const personalDataElement = document.getElementById("business_profile_personal_data");
            if (personalDataElement) {
                personalDataElement.innerHTML = getBusinessProfileDataTmplate(currentBusinessUser); 
            }
        } else {
            showToastMessage(true, ["Business-Profil nicht gefunden."]);
        }
    } catch (error) {
        showToastMessage(true, ["Netzwerkfehler beim Laden des Business-Profils."]);
    }
}

async function loadCustomerProfile() {
    if (!currentUser || !currentUser.id) {
        return;
    }
    try {
        const response = await getData(`${CUSTOMER_PROFILES_URL}${currentUser.id}/`);
        if (response.ok) {
            currentCustomerUser = response.data;
            renderCustomerProfile();
            const customerDetailSection = document.getElementById('customer_detail_section');
                if (customerDetailSection) {
                    customerDetailSection.innerHTML = getCustomerDetailTemplate();
                }
        } else {
            showToastMessage(true, extractErrorMessages(response.data));
        }
    } catch (error) {
        showToastMessage(true, ["Netzwerkfehler beim Laden des Kundenprofils."]);
    }
}

async function loadCustomerOrders() {
    try {
        const response = await getData(ORDER_URL);
        if (response.ok) {
            currentOrders = response.data; 
        } else {
            showToastMessage(true, extractErrorMessages(response.data));
        }
    } catch (error) {
        showToastMessage(true, ["Netzwerkfehler beim Laden der Bestellungen."]);
    }
}

function renderCustomerReviews() {
    const reviewContainer = document.getElementById("edit_review_list");
    if (!reviewContainer) {
        return;
    }

    if (currentReviews.length > 0) {
        reviewContainer.innerHTML = getReviewWLinkEditableTemplateList(currentReviews);
    } else {
        reviewContainer.innerHTML = '<p>Aktuell befinden sich noch keine Bewertungen.</p>';
    }
}

function renderProfilePage() {
    const contentRef = document.getElementById("content");

    if (currentUser.type === "customer") {
        contentRef.innerHTML = getCustomerProfilePageTemplate();
        renderCustomerOrders(); 
    }
}

function renderCustomerOrders() { 
    const orderListContainer = document.querySelector( ".order_list");
    if (orderListContainer) {
        if (currentOrders.length > 0) {
            orderListContainer.innerHTML = getCustomerOrderTemplateList();
        } else {
            orderListContainer.innerHTML = '<p>Keine Bestellungen gefunden.</p>';
        }
    } 
}

async function renderPage() {
    await getFullProfileData();

    let contentRef = document.getElementById("content");
    if (currentUser.type == "business") {
        currentBusinessOfferListFilter.creator_id = currentUser.user
        await setOffers(currentBusinessOfferListFilter)
        contentRef.innerHTML = getBusinessProfilePageTemplate(currentUser, currentOrders, currentOffers, currentReviews);
    } else if (currentUser.type == "customer") {
        contentRef.innerHTML = getCustomerProfilePageTemplate();
    } else {
        showToastMessage()
    }
}

async function goToOfferPage(pageNum) {
    if (pageNum) {
        currentBusinessOfferListFilter.page = pageNum
    }
    updateOfferListFilter();
}

async function updateOfferListFilter() {
    await setOffers(currentBusinessOfferListFilter);    
    document.getElementById("business_offer_list").innerHTML = `${getBusinessOfferTemplateList(currentOffers)}
    ${getOfferPagination(calculateNumPages(allOffersLength, PAGE_SIZE), currentBusinessOfferListFilter.page)}`
}

async function getFullProfileData() {
    if (currentUser.type == "business") {
        await setReviewsForBusinessUser(currentUser.user)
    } else if (currentUser.type == "customer") {
        await setReviewsForCustomerUser(currentUser.user)
    }
    let orderResp = await getData(ORDER_URL);
    if (orderResp.ok) {
        currentOrders = orderResp.data;
    }

    await setUsers();
}

async function changeReviewFilterProfile(selectElement) {
    const sortOrder = selectElement.value;
    currentReviewOrdering = sortOrder;
    if (currentUser.type === "business") {
        await setReviewsForBusinessUser(currentUser.id, sortOrder);
        const reviewContainer = document.getElementById("business_review_list");
        if (reviewContainer) {
            reviewContainer.innerHTML = getReviewWLinkTemplateList(currentReviews);
        }
    } else if (currentUser.type === "customer") {
        await setReviewsForCustomerUser(currentUser.id, sortOrder);
        const reviewContainer = document.getElementById("edit_review_list");
        if (reviewContainer) {
            reviewContainer.innerHTML = getReviewWLinkEditableTemplateList(currentReviews);
        }
    }
}

async function changeOrderStatus(status, orderId) {
    let singleOrderIndex = currentOrders.findIndex(item => item.id === orderId)
    if (singleOrderIndex >=0 && currentOrders[singleOrderIndex].status != status) {
        let resp = await updateOrder(orderId, status);
        console.log(resp);
        if (resp.ok) {
            currentOrders[singleOrderIndex].status = status;
            document.getElementById("business_order_list").innerHTML = getBusinessOrderTemplateList();
        }
    }
}

async function businessEditOnsubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target); 
    if (currentFile) {
        data.append("profile_image", currentFile);
    }
    updateBusinessProfile(data);
}

// Customer sepcific

function abboardCustomerEdit() {
    document.getElementById('customer_dialog').innerHTML = getCustomerDialogFormTemplate();
    closeDialog('customer_dialog');
}

async function customerEditOnsubmit(event) {
    event.preventDefault();
    const data = getFormData(event.target);

    if (!data.first_name || !data.last_name || !data.email) {
        showToastMessage(true, ["Alle Felder müssen ausgefüllt werden!"]);
        return;
    }
    let formData = jsonToFormData(data);
    updateCustomerProfile(formData);
}

function abboardBusinessEdit() {
    closeDialog('business_dialog');
    document.getElementById('business_dialog').innerHTML = getBusinessDialogFormTemplate();
}


async function loadBusinessOffers() {
    try {
        const response = await getData(OFFER_URL);
        if (response.ok) {
            currentOffers = response.data.results || response.data; 
            allOffersLength = response.data.count; 
        } else {
            showToastMessage(true, extractErrorMessages(response.data));
        }
    } catch (error) {
        showToastMessage(true, ["Netzwerkfehler beim Laden der Angebote."]);
    }
}

function renderBusinessOrders() {
    const orderListContainer = document.getElementById("business_order_list");
    if (orderListContainer) {
        if (currentOrders.length > 0) {
            orderListContainer.innerHTML = getBusinessOrderTemplateList();
        } else {
            orderListContainer.innerHTML = '<p>Keine Bestellungen gefunden.</p>';
        }
    } 
}

async function loadBusinessOrders() {
    try {
        const response = await getData(ORDER_URL); 
        if (response.ok) {
            currentOrders = response.data; 
        } else {
            showToastMessage(true, extractErrorMessages(response.data));
        }
    } catch (error) {
        showToastMessage(true, ["Netzwerkfehler beim Laden der Bestellungen."]);
    }
}
