function checkAuth(){
    if(getAuthToken()){
        window.location.href = "./index.html";
    }
}

function registerSubmit(event) {
    event.preventDefault();
    const data = getFormData(event.target);
    const profileType = document.querySelector('input[name="type"]:checked').value;
    data.profile_type = profileType;
    registration(data);
}