function getsingleOfferHeaderTemplate() {
    if (!currentSingleOfferUser || !currentSingleOffer) {
        return `<div>Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.</div>`;
    }

    const businessProfile = currentSingleOffer.business_profile || {};
    const userFullName = `${currentSingleOfferUser.first_name} ${currentSingleOfferUser.last_name}`;
    const userProfileImg = getPersonImgPath(businessProfile || currentSingleOfferUser);
    const userReviewsCount = currentReviews?.length || 0;
    const userAvgRating = meanValueReviews() || "-"; 
    const offerTitle = currentSingleOffer.title || "Kein Titel verfügbar";
    const offerDescription = currentSingleOffer.description || "Keine Beschreibung verfügbar";
    const ordersInQueue =   businessProfile.pending_orders || "Keine";  
    
    return `
        <div class="d_flex_cc_gl f_d_r_resp_c">
            <img class="profile_img_l" src="${userProfileImg}" alt="Profilbild">
  
            <div class="d_flex_cs_gm f_d_c">
                <div class="d_flex_cs_gm f_d_r_resp_c">
                    <h3 class="link c_black" onclick="redirectToBusinessProfile(${currentSingleOfferUser.id})">${userFullName}</h3>
                    <p class="font_sec_color">@${currentSingleOfferUser.username}</p>
                </div>
                <div class="offer_detail_review">
                    <img src="./assets/icons/kid_star_green.svg" alt="Bewertungsstern">
                    <p class="font_prime_color">${userAvgRating}</p>
                    <p>(${userReviewsCount})</p>
                </div>
                <p >${ordersInQueue} Bestellung(en) in der Warteschlange</p>
            </div>
        </div>
        <h3>${offerTitle}</h3>
        <p>${offerDescription}</p>
    `;
}

function getSingleOfferDetailTemplate() {
    if (!currentOpenedDetail) {
        return `<div>Es ist ein Fehler aufgetreten</div>`;
    }
    const price = currentOpenedDetail.price ? `${currentOpenedDetail.price} €` : "Preis nicht verfügbar";
    const title = currentOpenedDetail.title || "Kein Titel verfügbar";
    const deliveryTime = currentOpenedDetail.delivery_time_in_days || "Lieferzeit nicht verfügbar";
    const revisions = currentOpenedDetail.revisions !== undefined
        ? getRevisionTemplate(currentOpenedDetail.revisions)
        : "Keine Revisionen verfügbar";
    const additionalDetails = getFeatureListTemplate();

    return `
        <h3 class="font_prime_color">${price}</h3>
        <h3>${title}</h3>
        <p class="d_flex_cc_gm">
            <img src="./assets/icons/schedule.svg" alt="Lieferzeit Icon" class="icon">
            ${deliveryTime} Tag(e) Lieferzeit
        </p>
        <p class="d_flex_cc_gm">
            <img src="./assets/icons/autorenew.svg" alt="Revisionen Icon" class="icon">
            ${revisions}
        </p>
        <ul class="feature_list">
            ${additionalDetails}
        </ul>
        <button onclick="openDialog('order_dialog')" class="std_btn btn_prime pad_s">Bestellen</button>
    `;
}

function getFeatureListTemplate(){
    if (!Array.isArray(currentOpenedDetail.features)) {
        return `<li>Es ist ein Problem aufgetreten</li>`;
    }
    if (currentOpenedDetail.features.length === 0) {
        return `<li>Keine Features verfügbar.</li>`;
    }
    let featureList = "";
    
    currentOpenedDetail.features.forEach(feature => {
        featureList += `<li>${feature}</li>`
    });
    return featureList
}

function getRevisionTemplate(revisions) {
    if (revisions === -1) {
        return 'Unbegrenzte Revisionen';
    } else if (revisions === 1) {
        return '1 Revision';
    } else {
        return `${revisions} Revisionen`;
    }
}

function getShowOrderDialogContentTemplate() {
    if (!currentOpenedDetail) {
        return `<div>Es ist ein Fehler aufgetreten</div>`;
    }

    const additionalDetails = getFeatureListTemplate();

    return `
    <h2 class="font_prime_color">Bestellung bestätigen</h2>
    <h3>${currentOpenedDetail.title}</h3>
    <div class="d_flex_cs_gm f_d_c">
        <p class="d_flex_cc_gm">
            <img src="./assets/icons/box.svg" alt="Paket Icon" class="icon">
            ${currentOpenedDetail.offer_type} Paket
        </p>
        <p class="d_flex_cc_gm">
            <img src="./assets/icons/schedule.svg" alt="Lieferzeit Icon" class="icon">
            ${currentOpenedDetail.delivery_time_in_days} Tag(e) Lieferzeit
        </p>
        <p class="d_flex_cc_gm">
            <img src="./assets/icons/autorenew.svg" alt="Revisionen Icon" class="icon">
            ${getRevisionTemplate(currentOpenedDetail.revisions)}
        </p>
         <ul class="feature_list">
            ${additionalDetails}
        </ul>
    </div>
    <p>
        <strong>Gesamtpreis:</strong>
        <strong class="font_prime_color ">${currentOpenedDetail.price} €</strong>
    </p>
    <div class="d_flex_cs_gl">
        <button onclick="singleOfferOrderCreate()" class="std_btn btn_prime pad_s">Kostenpflichtig bestellen</button>
        <button onclick="closeDialog('order_dialog')" class="std_btn btn_secondary pad_s">Abbrechen</button>
    </div>`;
}

function getSendOrderDialogContentTemplate(){
    return `<div class="d_flex_cc_gxl f_d_c w_full">
            <img src="./assets/icons/check_circle.svg" alt="" srcset="">
            <h2 class="text_a_c">Erfolgreich Bestellung aufgegeben</h2>
            <div class="d_flex_cc_gm f_d_r_resp_c w_full">
                <button onclick="redirectToOwnProfile()" class="std_btn btn_prime pad_s">Status checken</button>
                <button onclick="closeDialog('order_dialog')" class="std_btn btn_prime pad_s">Weiter shoppen</button>
            </div>
        </div>
    `
}

