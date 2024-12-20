let currentReviews = [];
let currentReviewOrdering = '-updated_at'

async function setReviewsForBusinessUser(userId, sortOrder = currentReviewOrdering) {
    const url = `${REVIEW_URL}?business_user_id=${userId}&ordering=${sortOrder}`;

    try {
        const response = await getData(url);

        if (response.ok) {
            currentReviews = response.data;
        } else {
            showToastMessage(true, "Fehler beim Abrufen der Bewertungen");
        }
    } catch (error) {
        showToastMessage(true, "Netzwerkfehler beim Abrufen der Bewertungen");
    }
}


async function setReviewsForCustomerUser(id) {
    let reviewsResp = await getData(REVIEW_URL + `?reviewer_id=${id}&ordering=${currentReviewOrdering}`);
    if (reviewsResp.ok) {
        currentReviews = reviewsResp.data;
    } else {
        showToastMessage(true, ['Bewertung zu diesem User konnte nicht gefunden werden'])
    }
}

async function createReview(data) {
    if (currentUser.type === 'business') {
        showToastMessage(true, ['Business-Profile dürfen keine Bewertungen schreiben']);
        return { ok: false };
    }

    if (currentReviews.some(item => item.reviewer === currentUser.user)) {
        showToastMessage(true, ['Du hast diesen User schon einmal Bewertet']);
        return { ok: false };
    }

    const reviewsResp = await postDataWJSON(REVIEW_URL, data);
    if (!reviewsResp.ok) {
        showToastMessage(true, extractErrorMessages(reviewsResp.data));
        return reviewsResp;
    }

    currentReviews.push(reviewsResp.data);
    showToastMessage(false, ['Bewertung erstellt']);
    await loadRenderSingleOfferReviews();
    return reviewsResp;
}

function countStars() {
    const reviewStarsDiv = document.getElementById('review_stars_input');
    const imgElements = reviewStarsDiv.children;

    let count = 0;

    for (let i = 0; i < imgElements.length; i++) {
        const img = imgElements[i];
        if (img.tagName === 'IMG' && img.src.endsWith('kid_star.svg')) {
            count++;
        }
    }
    return count;
}

function openReviewEditDialog(reviewId) {
    let index = currentReviews.findIndex(item => item.id === reviewId);
    if (index < 0) {
        showToastMessage(true, ['Bewertung konnte nicht gefunden werden']);
    } else {
        openDialog('rating_dialog');
        const dialogRef = document.getElementById('rating_dialog');
        if (dialogRef) {
            dialogRef.innerHTML = getReviewDialogformTemplate(currentReviews[index]);
        } else {
            showToastMessage(true, ['Dialog-Container für die Bewertung konnte nicht gefunden werden.']);
        }
    }
}

async function onReviewSubmit(event, reviewId) {
    event.preventDefault();
    const data = getFormData(event.target);
    data['rating'] = countStars();
    delete data['business_user'];
    delete data['reviewer'];

    try {
        let resp = await patchDataWoFiles(`${REVIEW_URL}${reviewId}/`, data);
        if (resp.ok) {
            let index = currentReviews.findIndex(item => item.id === reviewId);
            currentReviews[index].rating = data.rating;
            currentReviews[index].description = data.description;
            renderCustomerReviews(); 
            closeDialog('rating_dialog');
            showToastMessage(false, ['Bewertung erfolgreich aktualisiert']);
        } else {
            showToastMessage(true, extractErrorMessages(resp.data));
        }
    } catch (error) {
        showToastMessage(true, ["Netzwerkfehler beim Speichern der Bewertung."]);
    }
}

async function deleteReview(reviewId) {
    try {
        let index = currentReviews.findIndex(item => item.id === reviewId);
        if (index < 0) return showToastMessage(true, ['Bewertung konnte nicht gefunden werden']);

        let resp = await deleteData(`${REVIEW_URL}${reviewId}/`);
        if (resp.ok) {
            currentReviews.splice(index, 1);
            updateReviewListUI();
            closeDialog('rating_dialog');
            showToastMessage(false, ['Bewertung erfolgreich gelöscht']);
        } else {
            showToastMessage(false, resp.data ? extractErrorMessages(resp.data) : ['Unbekannter Fehler']);
        }
    } catch {
        showToastMessage(true, ["Netzwerkfehler beim Löschen der Bewertung."]);
    }
}

function updateReviewListUI() {
    const reviewListContainer = document.getElementById("edit_review_list");
    if (reviewListContainer) {
        reviewListContainer.innerHTML = currentReviews.length > 0
            ? getReviewWLinkEditableTemplateList(currentReviews)
            : "<p>Keine bearbeitbaren Bewertungen vorhanden.</p>";
    }
}

function meanValueReviews() {
    sum = 0;
    currentReviews.forEach(rev => {
        sum += parseFloat(rev.rating)
    });
    let result = (sum / currentReviews.length).toFixed(1)
    if (!isNaN(result)) {
        return result
    } else {
        return '-'
    }
}





