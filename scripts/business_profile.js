let currentBusinessUser;
let currentOfferBusinessProfileFilter = {
    page: 1,
    creator_id: null,
};

async function initBProfile() {
    try {
        let response = await setCurrentUser(); setHeader();
        if (!response.ok) return window.location.href = "./login.html";
        await loadBusinessUser();
        if (!currentBusinessUser) return window.location.href = "./index.html";
        currentOfferBusinessProfileFilter.creator_id = currentBusinessUser.user;
        document.getElementById('business_profile_personal_data').innerHTML = getBusinessProfileDataTmplate();
        await Promise.all([
            loadRenderBusinessReviews(),
            loadRenderOffers(),
            loadRenderBusinessBaseInfo(),
        ]);
        toggleReviewAddBtn();
    } catch (error) {
        showToastMessage(true, "Ein unerwarteter Fehler ist aufgetreten.");
        window.location.href = "./index.html";
    }
}

async function loadBusinessUser() {
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('id');

    if (!profileId) {
        window.location.href = "./index.html";
        return;
    }
    try {
        let resp =  await getData(`${PROFILE_URL}${profileId}/`);
        if (resp.ok) {
            if (resp.data.type === "business") {
                currentBusinessUser = resp.data;
                document.getElementById('business_profile_personal_data').innerHTML =
                    getBusinessProfileDataTmplate();
            } else {
                window.location.href = "./index.html";
            }
        } else {
            showToastMessage(true, "Profil konnte nicht geladen werden.");
            window.location.href = "./index.html";
        }
    } catch (error) {
        showToastMessage(true, "Ein Fehler ist aufgetreten.");
        window.location.href = "./index.html";
    }
}

async function loadRenderBusinessBaseInfo() {
    if (!currentBusinessUser?.id) return;

    try {
        const userId = currentBusinessUser.id;
        await updateCompletedCount(userId);
        const [reviewsResp, offersResp] = await fetchBusinessData(userId);
        const { reviewCount, offerCount } = processResponses(reviewsResp, offersResp);
        const avgRating = reviewCount > 0 ? meanValueReviews() : 0;
        const starCount = reviewCount > 0 ? countStars('review_stars_input') : 0;

        updateProfileStats({
            reviewCount,
            avgRating,
            starCount,
            offerCount,
        });
    } catch {
        showToastMessage(true, "Fehler beim Laden der Basisinformationen.");
    }
}

async function updateCompletedCount(userId) {
    const completedCount = await setSingleOfferCompletedCount(userId);
    const completedCountElement = document.getElementById("business_profile_project_count");
    if (completedCountElement) completedCountElement.innerText = String(completedCount);
}

async function fetchBusinessData(userId) {
    return await Promise.all([
        getData(`${REVIEW_URL}?business_user_id=${userId}`),
        getData(`${OFFER_URL}?creator_id=${userId}&page_size=1`),
    ]);
}

function processResponses(reviewsResp, offersResp) {
    let reviewCount = reviewsResp.ok ? reviewsResp.data.length : 0;
    let offerCount = offersResp.ok ? (offersResp.data.count || 0) : 0;

    if (reviewsResp.ok) currentReviews = reviewsResp.data;
    if (offersResp.ok) currentOffers = offersResp.data.results || [];

    return { reviewCount, offerCount };
}

function updateProfileStats({ reviewCount, avgRating, starCount, offerCount }) {
    const updateInnerText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.innerText = value;
    };

    const updateInnerHTML = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.innerHTML = value;
    };

    updateInnerText("business_profile_review_count", reviewCount);
    updateInnerHTML("business_profile_avg_rating", `${avgRating}<img src="./assets/icons/kid_star.svg" alt="">`);
    updateInnerText("business_profile_star_count", starCount);
    updateInnerText("business_profile_offer_count", offerCount);
}

async function updateCompletedOrderUI(userId) {
    const completedCount = await setSingleOfferCompletedCount(userId);
    const element = document.getElementById("business_profile_project_count");
    if (element) {
        element.innerText = completedCount;
    } 
}

async function loadRenderBusinessReviews() {
    if (!currentBusinessUser || !currentBusinessUser.id) {
        return;
    }
    try {
        const reviewsResp = await getData(
            `${REVIEW_URL}?business_user_id=${currentBusinessUser.id}&ordering=-updated_at`
        );
        if (reviewsResp.ok) {
            currentReviews = reviewsResp.data;
            document.getElementById('business_profile_review_list').innerHTML =
                getReviewWLinkTemplateList(currentReviews);
        }
    } catch (error) {
        showToastMessage(true,"Fehler beim Laden der Bewertungen:");
    }
}

async function loadRenderOffers() {
    if (!currentBusinessUser || !currentBusinessUser.id) {
        return;
    }
    try {
        currentOfferBusinessProfileFilter.creator_id = currentBusinessUser.id;
        await setOffersWODetails(currentOfferBusinessProfileFilter);
        document.getElementById('business_profile_offer_list').innerHTML =
            getOfferTemplateList(currentOffers) +
            getOfferPagination(
                calculateNumPages(allOffersLength, PAGE_SIZE),
                currentOfferBusinessProfileFilter.page
            );
    } catch (error) {
        showToastMessage(true,"Fehler beim Laden der Angebote:");
    }
}

async function onSubmitReviewBusinessProfile() {
    const textInputRef = document.getElementById("review_description_input");

    if (!validateReviewInput(textInputRef)) return;

    const data = buildReviewData(textInputRef);

    try {
        const resp = await postDataWJSON(REVIEW_URL, data);
        handleReviewResponse(resp);
    } catch (error) {
        showToastMessage(true, ["Bewertung konnte nicht gespeichert werden."]);
    }
}

function validateReviewInput(textInputRef) {
    if (!textInputRef.value.trim()) {
        showFormErrors(["review_text_error"]);
        return false;
    }
    return true;
}

function buildReviewData(textInputRef) {
    return {
        rating: countStars(),
        description: textInputRef.value.trim(),
        business_user_id: currentBusinessUser.id,
        reviewer_id: getAuthUserId(),
    };
}

function handleReviewResponse(resp) {
    if (resp.ok) {
        currentReviews.unshift(resp.data);
        document.getElementById('business_profile_review_list').innerHTML =
            getReviewWLinkTemplateList(currentReviews);
        closeDialog("rating_dialog");
        showToastMessage(false, ["Bewertung erfolgreich hinzugefügt"]);
    } else {
        showToastMessage(true, extractErrorMessages(resp.data));
    }
}

function goToOfferPage(pageNum) {
    if (pageNum) {
        currentOfferBusinessProfileFilter.page = pageNum;
    }
    loadRenderOffers();
}

async function changeReviewFilterBusinessProfile(element) {
    const sortOrder = element.value;
    if (!currentBusinessUser || !currentBusinessUser.id) {
        return;
    }
    try {
        await setReviewsForBusinessUser(currentBusinessUser.id, sortOrder);
        if (currentReviews && Array.isArray(currentReviews)) {
            const reviewListContainer = document.getElementById("business_profile_review_list");
            if (reviewListContainer) {
                reviewListContainer.innerHTML = getReviewWLinkTemplateList(currentReviews);
            } else {
                showToastMessage(true, ["Element mit ID 'business_profile_review_list' nicht gefunden."]);
            }
        } else {
            showToastMessage(true, ["Keine Bewertungen verfügbar."]);
        }
    } catch (error) {
        showToastMessage(true, ["Fehler beim Laden der Bewertungen:"]);
    }
}






