let orderStatus = {
    'pending': 'Ausstehend',
    'in_progress': 'In Bearbeitung',
    'completed': 'Abgeschlossen',
    'cancelled': 'Abgebrochen'
}

async function createOrder(detailId, selectedOption) {
    if (detailId) {
        const data = {
            offer_detail_id: detailId,
            offer: 1,
            option: selectedOption
        };

        const orderResp = await postDataWJSON(ORDER_URL, data);

        if (!orderResp.ok) {
            showToastMessage(true, extractErrorMessages(orderResp.data)); 
        }
        return orderResp;
    } else {
        showToastMessage(true, ['Das Angebotsdetail konnte nicht gefunden werden']);
        return { ok: false };
    }
}

async function updateOrder(orderId, status) {
    const stati = ['in_progress', 'cancelled', 'completed'];
    if (!stati.includes(status)) {
        showToastMessage(true, ['Ungültiger Bestellstatus']);
        return { ok: false };
    }
    if (!orderId || typeof orderId !== "number") {
        showToastMessage(true, ['Ungültige Bestell-ID']);
        return { ok: false };
    }
    const data = { status: status };
    const orderResp = await patchDataWoFiles(ORDER_URL + orderId + "/", data);
    if (orderResp.ok) {
        showToastMessage(false, ['Bestellstatus erfolgreich aktualisiert']);
    } else {
        showToastMessage(true, extractErrorMessages(orderResp.data));
    }
    return orderResp;
}

async function fetchOrders() {
    const response = await getData('orders/');
    if (response.ok) {
        document.getElementById("business_order_list").innerHTML = response.data
            .map(order => getBusinessOrderTemplate(order))
            .join("");
    } else {
        showToastMessage(true, ["Fehler beim Laden der Bestellungen."]);
    }
}

async function deleteOrder(orderId) {
    const response = await deleteData(`orders/${orderId}/`);
    if (response.ok) {
        showToastMessage(false, ["Bestellung erfolgreich gelöscht."]);
        fetchOrders(); 
    } else {
        showToastMessage(true, ["Fehler beim Löschen der Bestellung."]);
    }
}

async function renderOrders() {
    const response = await fetchOrders();
    if (response.ok) {
        document.getElementById("business_order_list").innerHTML = response.data
            .map(order => getBusinessOrderTemplate(order))
            .join("");
    } else {
        showToastMessage(true, ['Fehler beim Laden der Bestellungen']);
    }
}