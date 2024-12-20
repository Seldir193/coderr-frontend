function redirectToOffer(id){
    if(currentUser){
        window.location.href = "./offer.html?id=" + id;
    }
}

function redirectToOfferList(search){
    window.location.href = "./offer_list.html?search=" + search;
}

function redirectToOwnProfile(){
    window.location.href = "./own_profile.html";
}

function redirectToProfile(id, type) {
    if (!id || !type) {
        return;
    }

    if (type === "business") {
        window.location.href = `./business_profile.html?id=${id}`;
    } else if (type === "customer") {
        window.location.href = `./customer_profile.html?id=${id}`;
    } else {
        window.location.href = './index.html';
    }
}



function redirectToBusinessProfile(id) {
    redirectToProfile(id, "business");
}

function redirectToCustomerProfile(id) {
    redirectToProfile(id, "customer");
}
