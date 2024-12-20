let currentOffer = null;
let openedEditFeaturefields = [];
let errorIds = [];
let currentOfferId = null;
let currentOffers = [];
let allOffersLength=null;

async function setOffers(filterParams = {}) {
    let offerResp = await getData(OFFER_URL + getOfferFilter(filterParams));

    if (offerResp.ok) {
        allOffersLength = offerResp.data.count || offerResp.data.length || 0;
        currentOffers = offerResp.data.results || offerResp.data;
    }
    return offerResp;
}

async function setOfferDetails() {
    for (let i = 0; i < currentOffers.length; i++) {
        const offer = currentOffers[i];
        for (let j = 0; j < offer.details.length; j++) {
            const offerdetail = offer.details[j];
            const offerdetailResp = await getData(OFFER_DETAIL_URL + offerdetail.id + "/");
            offer.details[j] = offerdetailResp.data
        }
    }
}

async function deleteOffer() {
    if (currentOfferId) {
        await deleteData(OFFER_URL + currentOfferId + "/");
        let index = currentOffers.findIndex(item => item.id === currentOfferId);
        currentOffers.splice(index, 1);
        showToastMessage(false, ['Angebote gelöscht'])
    }
    closeProfileBusinessDialogRefresh()
}

async function setOffersWODetails(filterParams = {}) {    
    let offerResp = await getData(OFFER_URL + getOfferFilter(filterParams));
    
    if (offerResp.ok) {
        allOffersLength = offerResp.data.count || offerResp.data.length || 0;
        currentOffers = offerResp.data.results || offerResp.data; 
    } else {
        showToastMessage(true, ["Fehler beim Abrufen der Angebote."]);
    }
    return offerResp;
}

function getOfferFilter(params = {}) {
    return `?creator_id=${params?.creator_id ?? ""}&search=${params?.search ?? ""}&ordering=${params?.ordering ?? ""}&page=${params?.page ?? 1}&max_delivery_time=${params?.max_delivery_time ?? ""}&min_price=${params?.min_price ?? ""}&max_price=${params?.max_price ?? ""}`;
}

async function setSingleOffer(id) {
    let offerResp = await getData(OFFER_URL + id + "/");
    if (offerResp.ok) {
        currentOffer = offerResp.data; 
    } else {
        showToastMessage(true, ["Fehler beim Laden des Angebots."]);
    }
    return offerResp;
}

async function setSingleOfferDetail() {
    for (let j = 0; j < currentSingleOffer.details.length; j++) {
        const offerdetail = currentSingleOffer.details[j];
        const offerdetailResp = await getData(OFFER_DETAIL_URL + offerdetail.id + "/");
        currentSingleOffer.details[j] = offerdetailResp.data
    }
}

function openOfferDialog(id = null) {
    currentFile = null;
    if (!id) {
        createEmptyOffer();
    } else {
        let singleOffer = currentOffers.find(item => item.id === id)
        currentOfferId = singleOffer.id;
        currentOffer = {
            description: singleOffer.description,
            title: singleOffer.title,
            details: singleOffer.details
        }
    }
    openDialog('dialog_add_edit_offer');
    document.getElementById('dialog_add_edit_offer').innerHTML = getOfferDialogTemplate();
}

async function onOfferSubmit(event) {
    event.preventDefault();
    const form = event.target;

    if (currentOfferId) {
        editOfferSubmit(form);
    } else {
        addOfferSubmit(form)
    }
}

async function addOfferSubmit(form) {
    const data = getFormData(form);

    if (validateEmptyFields(form, data)) {
        let cleanData = buildJsonFromFormInput(data);
        let resp = await postDataWJSON(OFFER_URL, cleanData);

        if (resp.ok) {
            await uploadCurrentImg(resp.data.id);
            showToastMessage(false, ['Angebote erstellt'])
            closeProfileBusinessDialogRefresh()
        } else {
            showToastMessage(true, ['Fehler beim Bildupload'])
        }
    }
}

async function uploadCurrentImg(id) {
    let respPatch = {}
    if (currentFile) {
        const formData = new FormData();
        formData.append('image', currentFile);
        respPatch = await patchData(OFFER_URL + id + "/", formData)
        currentFile = null;
    }
    return respPatch;
}

async function editOfferSubmit(form) {
    const data = getFormData(form);

    if (validateEmptyFields(form, data)) {
        let cleanData = buildJsonFromFormInput(data);
        
        let respPatch = await patchDataWoFiles(OFFER_URL + currentOfferId + "/", cleanData);
        let changedOffer = currentOffers.find(item => item.id === currentOfferId)

        if (respPatch.ok) {
            changedOffer.description = respPatch.data.description;
            changedOffer.title = respPatch.data.title;
            changedOffer.details = respPatch.data.details;
            
            let respImgPatch = await uploadCurrentImg(currentOfferId);
            if (respImgPatch.data) {
                changedOffer.image = respImgPatch.data.image;
            }
            await closeProfileBusinessDialogRefresh()
            showToastMessage(false, ['Angebote editiert'])
        }
    }
}

async function closeProfileBusinessDialogRefresh() {
    await setOffers(currentBusinessOfferListFilter);
    closeDialog('dialog_add_edit_offer');
    
    document.getElementById("business_offer_list").innerHTML = `${getBusinessOfferTemplateList(currentOffers)}
    ${getOfferPagination(calculateNumPages(allOffersLength, PAGE_SIZE), currentBusinessOfferListFilter.page)}`
    currentOfferId = null;
    currentOffer = null;
}

function closeEditDialog(){
    currentOfferId = null;
    currentOffer = null;
    closeDialog('dialog_add_edit_offer');
}

function addNewFeature(inputFieldId, offer_type) {
    const inputValue = document.getElementById(inputFieldId).value;
    const detail = currentOffer.details.find(detail => detail.offer_type === offer_type);

    if (detail && !(inputValue == "")) {
        detail.features.push(inputValue);
        let ListRef = document.getElementById(`offer_feature_list_${detail.offer_type}`)
        ListRef.innerHTML = getOfferDetailFeatureTemplateList(detail);
    }
}

function validateEmptyFields(form, data) {
    errorIds = [];

    validateRequiredInputs(form);
    validateRevisions(data);
    validateFeatureFields();
    validateFeatureLists();
    showFormErrors(errorIds)
    openDetailOnError(errorIds)

    if (errorIds.length == 0) {
        return true;
    }
    return false
}

function validateRequiredInputs(form) {
    const inputs = form.querySelectorAll('[required]');
    inputs.forEach(input => {
        if (!input.value.trim()) {
            errorIds.push(input.name + "_error")
        }
    });
}

function validateFeatureLists(){
    for (let index = 0; index < currentOffer.details.length; index++) {
        let type = currentOffer.details[index].offer_type;        
        if (currentOffer.details[index].features.length <= 0) {
            errorIds.push(`offer_feature_list_${type}_error`);
        }
    }
}

function validateRevisions(data) {
    for (let index = 0; index < currentOffer.details.length; index++) {
        let type = currentOffer.details[index].offer_type;
        let inputRef = document.getElementById(`offer_revisions_${type}`);
        
        if (inputRef && !data[`offer_revisions_${type}_limitless`]) {
            let rev = Number(inputRef.value);
            if (!inputRef.value.trim() || !Number.isInteger(rev)) {
                errorIds.push(`offer_revisions_${type}_error`);
            }
        }
    }
}

function validateFeatureFields() {
    for (let index = 0; index < openedEditFeaturefields.length; index++) {
        const element = openedEditFeaturefields[index].id;
        errorIds.push(`${element}_error`);
    }
}

function changeRevisionInput(id){
    let checkboxRef = document.getElementById(id + "_limitless")
    let inputRef = document.getElementById(id)
    inputRef.disabled = checkboxRef.checked
}

function openDetailOnError(arr) {
    for (let str of arr) {
        if (str.includes("basic")) {
            let btnRef = document.getElementById(`add_offer_basic_btn`);
            if (btnRef) {
                btnRef.setAttribute('open', 'true');
            }
        }
        if (str.includes("standard")) {
            let btnRef = document.getElementById(`add_offer_standard_btn`);
            if (btnRef) {
                btnRef.setAttribute('open', 'true');
            }
        }
        if (str.includes("premium")) {
            let btnRef = document.getElementById(`add_offer_premium_btn`);
            if (btnRef) {
                btnRef.setAttribute('open', 'true');
            }
        }
    }
    return false;
}

async function setSingleOfferCompletedCount(userId) {
    try {
        const response = await getData(`${OFFER_COMPLETED_COUNT_URL}${userId}/`);

        if (response.ok && response.data) {
            const completedCount = response.data.completed_order_count || 0;
            return completedCount;
        } else {

            const errorMessages = extractErrorMessages(response.data);
            showToastMessage(true, errorMessages);
            showToastMessage(true, ["Fehler beim Laden der abgeschlossenen Projekte."]);
            return 0;
        }
    } catch (error) {
        showToastMessage(true, ["Netzwerkfehler beim Abrufen der abgeschlossenen Projekte."]);
        return 0;
    }
}


function buildJsonFromFormInput(data) {
    currentOffer.title = data.offer_title;
    currentOffer.description = data.offer_description;
    currentOffer.price = parseFloat(data.offer_price) || null;
    currentOffer.delivery_time_in_days = parseInt(data.offer_delivery_time, 10) || null;

    for (let index = 0; index < currentOffer.details.length; index++) {
        const detail = currentOffer.details[index];
        detail.title = data[`offer_title_${detail.offer_type}`];
        detail.delivery_time_in_days = parseInt(data[`offer_delivery_time_${detail.offer_type}`], 10) || null;
        detail.price = parseFloat(data[`offer_price_${detail.offer_type}`]) || null;
        detail.revisions = data[`offer_revisions_${detail.offer_type}_limitless`] ? -1 : parseInt(data[`offer_revisions_${detail.offer_type}`], 10) || null;
        detail.offer_type = detail.offer_type; 
    }
    return currentOffer;
}

function createEmptyOffer() {
    currentOffer = {

        description: "",
        title: "",
        details: [
            {
                title: "",
                revisions: null,
                delivery_time_in_days: null,
                price: null,
                features: [],
                offer_type: "basic"
            },
            {
                title: "",
                revisions: null,
                delivery_time_in_days: null,
                price: null,
                features: [],
                offer_type: "standard"
            },
            {
                title: "",
                revisions: null,
                delivery_time_in_days: null,
                price: null,
                features: [],
                offer_type: "premium"
            }
        ]
    };
}



// Feature CRUD

function isInEdit(id) {
    return openedEditFeaturefields.some(item => item.id === id);
}

function getEditFeature(id) {
    return openedEditFeaturefields.find(item => item.id === id);
}

function updateEditFeature(id) {
    let obj = getEditFeature(id);
    if (obj) {
        obj.value = document.getElementById(id).value;
    }
}

function saveEditFeature(id, indexFeature, offer_type) {
    const index = openedEditFeaturefields.findIndex(item => item.id === id);

    if (index !== -1) {
        const removedObject = openedEditFeaturefields.splice(index, 1)[0];
        const detail = currentOffer.details.find(detail => detail.offer_type === offer_type);

        detail.features[indexFeature] = removedObject.value;
        reRenderFeatureList(offer_type)
    }
}

function deleteEditFeature(id, featureIndex, offer_type) {
    const indexFeature = openedEditFeaturefields.findIndex(item => item.id === id);
    const removedObject = openedEditFeaturefields.splice(indexFeature, 1)[0];

    const detail = currentOffer.details.find(detail => detail.offer_type === offer_type);
    detail.features.splice(featureIndex, 1);
    reRenderFeatureList(offer_type)

}

function openEditFeature(id, offer_type, indexFeature) {
    const detail = currentOffer.details.find(detail => detail.offer_type === offer_type);

    openedEditFeaturefields.push(
        {
            value: detail.features[indexFeature],
            old_value: detail.features[indexFeature],
            id: id,
        }
    )
    reRenderFeatureList(offer_type)
}

function reRenderFeatureList(offer_type) {
    const detail = currentOffer.details.find(detail => detail.offer_type === offer_type);

    let ListRef = document.getElementById(`offer_feature_list_${detail.offer_type}`)
    ListRef.innerHTML = getOfferDetailFeatureTemplateList(detail);
}

function calculateNumPages(totalItems, pageSize ) {
    return Math.ceil(totalItems / pageSize);
}

