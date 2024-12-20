let currentSingleOffer = null;
let currentSingleOfferUser = null;
let currentOpenedDetail;
let currentOfferCount = 0;

async function singleOfferInit() {
    const offerId = new URLSearchParams(window.location.search).get("id");
    if (!offerId) {
        showToastMessage(true, ["Keine Angebots-ID gefunden!"]);
        return;
    }
    await setCurrentUser();
    await loadRenderSingleOffer(offerId);
    if (currentSingleOffer) {
        await loadRenderSingleOfferReviews(); 
    } else {
        showToastMessage(true, ["Angebot nicht gefunden. Bewertungen und Bestellanzahl werden nicht geladen."]);
    }
    setHeader();
    document.getElementById('single_offer_header_section').innerHTML = getsingleOfferHeaderTemplate();
}

async function loadRenderSingleOffer(offerId) {
    let offerResp = await setSingleOffer(offerId);

    if (offerResp.ok) {
        currentSingleOffer = offerResp.data;

        currentSingleOfferUser = currentSingleOffer.user || null;
        if (!currentSingleOfferUser) {
            showToastMessage(true, ["Benutzerinformationen fehlen im Angebot."]);
        }

        renderSingleOffer();
    } else {
        showToastMessage(true, [`Fehler beim Laden des Angebots: ${offerResp.status}`]);
    }
}

async function renderSingleOfferDetail(type) {
    const offerSection = document.getElementById("single_offer_detail_section");
    if (!currentSingleOffer) { 
        showToastMessage(true, ["Das aktuelle Angebot ist nicht geladen."]); 
        offerSection.innerHTML = "<p>Das aktuelle Angebot ist nicht geladen.</p>"; 
        return; 
    }
    if (!Array.isArray(currentSingleOffer.details) || currentSingleOffer.details.length === 0) { 
        showToastMessage(true, ["Keine Details verfügbar."]); 
        offerSection.innerHTML = "<p>Keine Details verfügbar.</p>"; 
        return; 
    }
    currentSingleOffer.details.forEach((detail, index) => { 
        if (!detail) showToastMessage(true, [`Detail an Index ${index} ist undefined oder null.`]); 
        else if (!detail.offer_type) showToastMessage(true, [`Detail an Index ${index} hat keinen offer_type.`]); 
    });
    const foundDetail = currentSingleOffer.details.find(detail => detail?.offer_type === type);
    if (foundDetail) { 
        currentOpenedDetail = foundDetail; 
        offerSection.innerHTML = getSingleOfferDetailTemplate(); 
    } else { 
        showToastMessage(true, [`Details für '${type}' nicht gefunden.`]); 
        offerSection.innerHTML = `<p>Details für '${type}' nicht gefunden.</p>`; 
    }
}

function renderSingleOffer() {
    const headerElement = document.getElementById("single_offer_header_section");

    if (!headerElement) {
        showToastMessage(true, ['Element mit ID "single_offer_header_section" nicht gefunden.']);
        return;
    }
    headerElement.innerHTML = getsingleOfferHeaderTemplate();
}

function activatedButton(element) {
    const header = document.getElementById('offer_detail_header');
    const buttons = header.querySelectorAll('button');

    buttons.forEach(button => {
        button.classList.remove('active');
    });
    element.classList.add('active');
}

// ReviewDialog Handling



async function changeReviewFilterSingleOffer(element) {
    currentReviewOrdering = element.value;
    if (currentSingleOfferUser && currentSingleOfferUser.id) {
        await setReviewsForBusinessUser(currentSingleOfferUser.id, currentReviewOrdering);
        document.getElementById('single_offer_review_list').innerHTML = getReviewWLinkTemplateList(currentReviews);
    } 
}

async function singleOfferOrderCreate(){
    if (!currentOpenedDetail || !currentOpenedDetail.id) {
        return;
    }

    let orderResp = await createOrder(currentOpenedDetail.id);
    if (orderResp.ok) {
        document.getElementById('single_offe_order_dialog').innerHTML =  getSendOrderDialogContentTemplate(); 
    } 
}

// UI Handling

window.addEventListener("resize", moveOnResize);
window.addEventListener("load", moveOnResize);
let respView = false;
const RESPVIEWPOINT = 1024;

function moveDetailBox(source, destination) {
    let destinationRef = document.getElementById(destination);
    destinationRef.classList.remove('d_none');

    let fragment = document.createDocumentFragment();
    let sourceElement = document.getElementById(source);
    let destinationElement = document.getElementById(destination);

    while (sourceElement.firstChild) {
        fragment.appendChild(sourceElement.firstChild);
    }
    destinationElement.appendChild(fragment);

    let sourceRef = document.getElementById(source);
    sourceRef.classList.add('d_none');
}

function setRespView() {
    if (window.innerWidth < RESPVIEWPOINT) {
        moveDetailBox("detail_box", "resp_detail_box")
        respView = true;
    }
}

function moveOnResize() {
    if (window.innerWidth < RESPVIEWPOINT && !respView) {
        moveDetailBox("detail_box", "resp_detail_box")
        respView = !respView
    }
    if (window.innerWidth >= RESPVIEWPOINT && respView) {
        moveDetailBox("resp_detail_box", "detail_box")
        respView = !respView
    }
}

async function loadSingleOfferUser(profileId) {
    let resp = await getData(PROFILE_URL + profileId + "/");

    if (resp.ok && resp.data) {
        currentSingleOfferUser = resp.data;
    } else {
        currentSingleOfferUser = null; 
    }
}

async function loadRenderSingleOfferReviews() {
    if (!currentSingleOffer || !currentSingleOfferUser || !currentSingleOfferUser.id) {
        return;
    }
    try {
        await setReviewsForBusinessUser(currentSingleOfferUser.id);
        const reviewListHTML = getReviewWLinkTemplateList(currentReviews);
        document.getElementById('single_offer_review_list').innerHTML = reviewListHTML;
    } catch (error) {
        showToastMessage(true, ["Fehler beim Laden der Bewertungen."]);
    }
}


async function onSubmitReviewSingleOffer() {
    const textInputRef = document.getElementById('review_description_input'), rating = countStars();
    if (!textInputRef.value.trim()) { showFormErrors(['review_text_error']); return; }
    if (!currentSingleOfferUser || !currentSingleOfferUser.id) return;
    const data = { rating, description: textInputRef.value.trim(), business_user_id: currentSingleOfferUser.id, reviewer_id: getAuthUserId() };
    try {
        const resp = await postDataWJSON(REVIEW_URL, data);
        if (resp.ok) {
            await setReviewsForBusinessUser(currentSingleOfferUser.id);
            document.getElementById('single_offer_review_list').innerHTML = getReviewWLinkTemplateList(currentReviews);
            closeDialog('rating_dialog'); showToastMessage(false, ['Bewertung erfolgreich hinzugefügt']);
        } else { showToastMessage(true, extractErrorMessages(resp.data)); }
    } catch (error) { showToastMessage(true, ['Bewertung konnte nicht gespeichert werden.']); }
}
