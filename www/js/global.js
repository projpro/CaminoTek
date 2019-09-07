//var global = "http://www.appnotification.bistroux.com/Api/App/";
var global = "http://www.consumerapp.bistroux.com/Api/App/";
//var global = "http://192.168.1.6/Api/App/";
var mediaURL = "http://appnotification.bistroux.com/Media/";

var browser = true;
var logenabled = false;
var errorClassBorder = '2px solid #ff4848';
var bottomBorder = '1px solid #ddd';
var noErrorClassBorder = 'none';
var src = mediaURL + "notification.mp3";
var myMedia = null;

function InitLogin() {
    // console.log('Init Login');
    var mydate = new Date()
    var year = mydate.getYear()
    if (year < 1000)
        year += 1900
    //console.log('year: ' + year);
    $(".login-footer #footerYear").html(year);
}
function RegisterToken(storeId, token, name, uuid, version) {

    $.ajax({
        url: global + 'StoreDeviceRegistrationTokenUpdate?storeid=' + storeId + '&registrationToken=' + token + "&deviceUUID=" + uuid + "&version=" + version + "&name=" + name,
        type: 'GET',
        datatype: 'jsonp',
        contenttype: "application/json",
        crossDomain: true,
        async: false,
        success: function (data) {
            //console.log("Saved to DB successfully");
            //alert("RegisterToken Saved to DB successfully")
            //window.location.href = "index.html";
            //window.localStorage.clear();
        },
        error: function (xhr, textStatus, errorThrown) {
            //window.location.href = "index.html";
            console.log("Saved to DB failed")
        }
    });
}
//Login
function Login() {
    //console.log("Login");
    var email = $("#email").val().trim();
    var password = $("#password").val().trim();
    //console.log("ValidateLogIn: " + ValidateLogIn());
    if (ValidateLogIn() == false) {

        $("#btnLogin").text("Logging in...")

        $.support.cors = true;
        $.ajax({
            url: global + 'Login?email=' + email + '&password=' + password,
            type: 'GET',
            datatype: 'jsonp',
            contenttype: "application/json",
            crossDomain: true,
            async: false,
            success: function (data) {
                //console.log("data: " + data);
                //console.log("Login 2" + data);
                //alert(data)
                if (data.indexOf("No Data Found") > -1) {
                    $('#lblErr').html("Invalid Login/Password");
                    $("#btnLogin").text("Log In");
                }
                else {
                    var customerId = data.split("#")[0].replace("\"", "");
                    var storeId = data.split("#")[1].replace("\"", "");
                    var apprefreshinterval = data.split("#")[2].replace("\"", "");
                    var storeName = data.split("#")[3].replace("\"", "");
                    var giftCardsEnabled = data.split("#")[4].replace("\"", "");
                    var giftCardProgramEnabled = data.split("#")[5].replace("\"", "");
                    var rewardEnabled = data.split("#")[6].replace("\"", "");
                    var carryOutEnabled = data.split("#")[7].replace("\"", "");
                    var barcodeScanEnabled = data.split("#")[8].replace("\"", "");
                    var companyAddress = data.split("#")[9].replace("\"", "");
                    var companyPhoneNumber = data.split("#")[10].replace("\"", "");
                    localStorage.setItem("CustomerId", customerId);
                    localStorage.setItem("StoreId", storeId);
                    localStorage.setItem("BistroEmail", email);
                    localStorage.setItem("BistroPassword", password);
                    localStorage.setItem("RefreshTimeInterval", password);
                    localStorage.setItem("RestaurantName", storeName);

                    localStorage.setItem("CarryOutEnabled", carryOutEnabled);
                    localStorage.setItem("GiftCardsEnabled", giftCardsEnabled);
                    localStorage.setItem("GiftCardProgramEnabled", giftCardProgramEnabled);
                    localStorage.setItem("RewardsEnabled", rewardEnabled);
                    localStorage.setItem("BarcodeScanEnabled", barcodeScanEnabled);
                    localStorage.setItem("StoreAddress", companyAddress);
                    localStorage.setItem("StorePhoneNumber", companyPhoneNumber);

                    //SetMenuNavigation();
                    if (apprefreshinterval === null || apprefreshinterval === "" || apprefreshinterval === "0") {
                        appRefreshInterval = 120;
                        localStorage.setItem("AppRefreshTimeInterval", apprefreshinterval);
                    }
                    //console.log("Login 3" + storeId);
                    if (Number(storeId) > 0) {
                        //InitPushNotification(storeId);
                        // InitPushNotification();
                        //window.location.href = "carryout.html?StoreId=" + storeId;
                        if (carryOutEnabled == "True") {
                            self.app.router.navigate('/carryout/', { reloadCurrent: true });
                            //GetStoreCarryOutTimings(storeId);
                        }
                        else {

                            if (giftCardsEnabled != "True" && giftCardProgramEnabled != "True" && rewardEnabled != "True") {
                                $('#lblErr').html();
                                $('#lblErr').html("Carryout/Gift Card/Rewards are not enabled. Please contact system administrator.");
                                // Init App
                                $("#btnLogin").text("Log In");
                                //LogOut Section
                                if (localStorage.getItem("registrationId") === null) {
                                    //window.location.href = "index.html";
                                    localStorage.clear();
                                }
                                else {
                                    var token = localStorage.getItem("registrationId").trim();
                                    //  alert(global)
                                    $.ajax({
                                        url: global + 'Logout?storeid=' + storeId + '&registrationToken=' + token,
                                        type: 'GET',
                                        datatype: 'jsonp',
                                        contenttype: "application/json",
                                        crossDomain: true,
                                        async: false,
                                        success: function (data) {
                                            //window.location.href = "index.html";
                                            localStorage.clear();
                                            app.router.clearPreviousHistory()
                                        },
                                        error: function (xhr, textStatus, errorThrown) {
                                            //window.location.href = "index.html";
                                            localStorage.clear();
                                        }
                                    });
                                }
                                //
                            }
                            else if ((giftCardsEnabled == "True" && giftCardProgramEnabled == "True") || rewardEnabled == "True") {
                                if (giftCardsEnabled == "True" && giftCardProgramEnabled == "True") {
                                    localStorage.setItem("loadgiftcardredeem", "true");
                                    //window.location.href = "giftcardsredeem.html?StoreId=" + storeId;
                                    self.app.router.navigate('/giftcard/', { reloadCurrent: true });
                                }
                                else if (rewardEnabled == "True") {
                                    // window.location.href = "rewards.html?StoreId=" + storeId;
                                    self.app.router.navigate('/new_rewards/', { reloadCurrent: true });
                                }
                            }
                        }
                    }
                    else {
                        //window.location.href = "index.html";
                        self.app.router.navigate('/', { reloadCurrent: false });
                    }


                }

            },
            error: function (xhr, textStatus, errorThrown) {

            }
        });
    }

}
function SetUpBarCodeScanButton(id)
{
    var barcodeScanEnabled = localStorage.getItem("BarcodeScanEnabled").trim();
    console.log('barcodeScanEnabled: ' + barcodeScanEnabled)
    if (barcodeScanEnabled != "" && barcodeScanEnabled.toUpperCase() == "TRUE") {
        $("#"+id).show();
    }
    else {
        $("#" + id).hide();
    }
}
function SetMenuNavigation() {
    var carryOutEnabled = localStorage.getItem("CarryOutEnabled");
    var giftCardsEnabled = localStorage.getItem("GiftCardsEnabled");
    var giftCardProgramEnabled = localStorage.getItem("GiftCardProgramEnabled");
    var rewardEnabled = localStorage.getItem("RewardsEnabled");
    //console.log("carryOutEnabled: " + carryOutEnabled)
    if (carryOutEnabled != "True") {

        //$(".menuCarryout").addClass("disabled");
        $('#manageservice .menuCarryout').each(function () {
            //$(this).addClass('disabled');
            $(this).hide();
        });
        $('#manageservice .menuStartStop').each(function () {
            // $(this).addClass('disabled');
            $(this).hide();
        });
        $('#manageservice .menuSettings').each(function () {
            // $(this).addClass('disabled');
            $(this).hide();
        });
    }
    else if (rewardEnabled != "True") {
        //$("#manageservice .menuReward").addClass("disabled");
        $("#manageservice .menuReward").hide();
    }
    else if (giftCardsEnabled != "True" && giftCardProgramEnabled != "True") {
        //$("#manageservice .menuGiftCard").addClass("disabled");
        $("#manageservice .menuGiftCard").hide();
    }
}
//Validate Login
function ValidateLogIn() {
    //console.log("ValidateLogIn");
    var email = $("#email").val();
    var password = $("#password").val();

    //var email = $(" #email").val();
    //var password = $("#password").val();
    var result = false;
    //console.log("email: " + email);
    if (email != "") {
        var Result = isValidEmailAddress(email);
        //console.log('isValidEmailAddress: ' + Result)
        if (Result.toString().toLowerCase() == "true") {
            $("#email").css('border-bottom', bottomBorder);
            if (!result) {
                result = false;
            }
        }
        else {
            $("#email").css('border-bottom', errorClassBorder);
            result = true;
        }
    }
    else {
        $("#email").css('border-bottom', errorClassBorder);
        result = true;
    }

    if (password != "") {
        $("#password").css('border-bottom', bottomBorder);
    }
    else {
        $("#password").css('border-bottom', errorClassBorder);
        result = true;
    }

    //console.log('ValidateLogIn: '+result)
    return result;

}
function isValidEmailAddress(emailAddress) {
    //console.log("isValidEmailAddress");
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return pattern.test(emailAddress);
};
function GetStoreCarryOutTimings(storeId) {

    var url = global + "/GetCarryoutOrderTimings?storeid=" + storeId;
    try {
        $.getJSON(url, function (data) {
            obj = JSON.parse(data);
            if (data.indexOf("No record(s) found.") > -1 || obj.length <= 0) {

                window.location.href = "carryout.html?StoreId=" + storeId;
            }
            else {
                if (obj != "") {
                    localStorage.setItem("storetimings", JSON.stringify(data));
                    // window.location.href = "carryout.html?StoreId=" + storeId;
                    self.app.router.navigate('/carryout/', { reloadCurrent: false });
                }
                else {
                    //window.location.href = "carryout.html?StoreId=" + storeId;
                    self.app.router.navigate('/carryout/', { reloadCurrent: false });
                }

            }
            //
        });
    }
    catch (e) {
    }
}

//Carryout Orders
function CarryoutOrdersList(status, carryoutpagesize, carryoutcurrentPage, divId) {

    //Shorting
    var sortValue = "DESC";
    var sortByValue = "";
    var filterStatus = "";
    var orderNoFrom = "";
    var orderNoTo = "";
    var phone = "";
    var orderDateFrom = "";
    var orderDateTo = "";
    //Shorting
    status = $('#hdnCurrentState').val();
    if (status == "New") {
        divId = 'dvNewList';
    }
    else if (status == "Processing") {
        divId = 'dvProcessingList';
    }
    else {
        divId = 'dvAllList';
        sortValue = $("input[name='radioCarryoutSort']:checked").val();
        sortByValue = $("input[name='radioCarryoutSortBy']:checked").val();

        filterStatus = $("#ddlFilterCarryoutStatus").val();
        orderNoFrom = $("#txtFilterOrderNumberFrom").val();
        orderNoTo = $("#txtFilterOrderNumberTo").val();
        phone = $("#txtFilterPhone").val();
        orderDateFrom = $("#txtFilterOrderDateFrom").val();
        orderDateTo = $("#txtFilterOrderDateTo").val();
        //console.log("orderDateFrom: " + orderDateFrom)
        //console.log("orderDateTo: " + orderDateTo)
        //console.log("Sort: "+ sortValue + " By: " + sortByValue + " filter: " + filterStatus + " orderNofrom: " + orderNoFrom + " orderNoTo: " + orderNoTo + " phone: " + phone + " orderDateFrom: "+ orderDateFrom + " dateTo: " + orderDateTo);
        if (sortValue == undefined) {
            sortValue = "";
        }
        if (sortByValue == undefined) {
            sortByValue = "";
        }
        if (filterStatus == undefined) {
            filterStatus = "";
        }
        if (orderNoFrom == undefined) {
            orderNoFrom = "";
        }
        if (orderNoTo == undefined) {
            orderNoTo = "";
        }
        if (phone == undefined) {
            phone = "";
        }
        if (orderDateFrom == undefined) {
            orderDateFrom = "";
        }
        if (orderDateTo == undefined) {
            orderDateTo = "";
        }
    }
    var customerId = 0;
    var storeId = 0;
    currentPage = 0;
    $("#" + divId).html("");
    storeId = SetStoreId();
    customerId = SetCustomerId();
    var firstOrderId = 0;


    if (Number(storeId) > 0) {

        carryoutcurrentPage = Number(carryoutcurrentPage) * Number(carryoutpagesize);
        url = global + "/GetAllCarryOutOrdersTemp?storeid=" + storeId + "&status=" + status + "&pagesize=" + carryoutpagesize + "&currentPage=" + carryoutcurrentPage + "&sortValue=" + sortValue + "&sortByValue=" + sortByValue +
            "&filterStatus=" + filterStatus + "&orderNoFrom=" + orderNoFrom + "&orderNoTo=" + orderNoTo + "&phone=" + phone + "&orderDateFrom=" + orderDateFrom + "&orderDateTo=" + orderDateTo;

        try {

            $.getJSON(url, function (data) {
                $('#loader_msg').html("");
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;

                if (JSON.parse(data).indexOf("No order(s) found") < 0) {
                    localStorage.setItem("OrderAvailable", "1");
                    var count = 0;
                    $.each(JSON.parse(data), function (index, value) {
                        if (index == 0) {
                            firstOrderId = value.ID;
                            OpenCarryoutDetails(firstOrderId);
                        }
                        var orderDate = "";
                        var orderTime = "";
                        var firstName = "";
                        var lastName = "";
                        var email = "";
                        var phone = "";
                        var paymentMethod = "";
                        var cardNumber = "";
                        var ordertotal = "";
                        var buttonHTML = "";
                        var subTotal = 0.00;
                        var grandTotal = 0.00;
                        var discount = 0.00;
                        var ordertype = "";
                        if (value.ORDERTYPE != "") {
                            ordertype = value.ORDERTYPE;
                        }
                        if (value.SUBTOTAL != "") {
                            subTotal = value.SUBTOTAL;
                        }
                        if (value.ORDERDISCOUNT != "") {
                            discount = value.ORDERDISCOUNT;
                        }

                        //if (value.ORDERTOTAL != "") {
                        //    grandTotal = value.ORDERTOTAL;
                        //    if(Number(grandTotal)!=Number(subTotal))
                        //    {
                        //        ordertotal = FormatDecimal(Number(subTotal) - Number(discount));
                        //    }
                        //    else {
                        //        ordertotal = FormatDecimal(grandTotal);
                        //    }
                        //}

                        //else {
                        grandTotal = value.ORDERTOTAL;

                        if (Number(grandTotal) != Number(subTotal)) {
                            ordertotal = FormatDecimal(Number(subTotal) - Number(discount));
                        }
                        else {
                            ordertotal = FormatDecimal(grandTotal);
                        }
                        //ordertotal = "$0.00";
                        //}
                        if (value.CREATEDONUTC != null && value.CREATEDONUTC != undefined) {
                            var arrDateTime = value.CREATEDONUTC.split('~');
                            var orderDate = arrDateTime[0];
                            var orderTime = arrDateTime[1];
                        }
                        if (value.FIRSTNAME != "") {
                            firstName = value.FIRSTNAME;
                        }
                        else {
                            firstName = value.BILLINGFIRSTNAME;
                        }

                        if (value.LASTNAME != "") {
                            lastName = value.LASTNAME;
                        }
                        else {
                            lastName = value.BILLINGLASTNAME;
                        }

                        if (value.EMAIL != "" && value.EMAIL != undefined) {
                            email = value.EMAIL;
                        }
                        else {
                            email = value.BILLINGEMAIL;
                        }

                        if (value.PHONE != "") {
                            phone = value.PHONE;
                        }
                        else {
                            phone = value.BILLINGPHONE;
                        }
                        if (phone.length == 10)
                            phone = FormatPhoneNumber(phone);
                        if (value.PAYMENTMETHOD != "" && value.PAYMENTMETHOD != undefined) {
                            paymentMethod = value.PAYMENTMETHOD;
                            //console.log("#: " + value.ID + " " + paymentMethod);
                        }
                        if (value.CARDNUMBER != "" && value.CARDNUMBER != undefined) {
                            cardNumber = value.CARDNUMBER;
                        }
                        /*------------------Order Area-----------------------*/

                        var html = "<div class=\"order-container\"  id='li_" + value.ID + "' style=\"height:75px;\">";


                        /*------------------Order Row-----------------------*/

                        html += "<div id=\"dvOrderInner_" + value.ID + "\" class=\"order-list-carryout\"  data-popup=\".popup-details\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\">";

                        /*------------------Column 1-----------------------*/

                        ////////html += "<div class=\"order-column-one\" >";
                        /*------------------Status Icon--------------------*/
                        ////if (status == '' || status == "All") {
                        ////    if (value.ORDERSTATUSID.toLowerCase() == "new") {
                        ////        //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></div>";
                        ////        html += "<div class=\"dropdown\" id=\"carryoutstatus_" + value.ID + "\">";
                        ////        html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></button>";
                        ////        html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('PickedUp'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        ////        html += "</div>";
                        ////        html += "</div>";
                        ////    }
                        ////    else if (value.ORDERSTATUSID.toLowerCase() == "processing") {
                        ////        // html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></div>";

                        ////        html += "<div class=\"dropdown\" id=\"carryoutstatus_" + value.ID + "\">";
                        ////        html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></button>";
                        ////        html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        ////        html += "<a class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        ////        html += "<a  onclick=\"ChangeOrderStatusDropdown('PickedUp'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        ////        html += "</div>";
                        ////        html += "</div>";
                        ////    }
                        ////    else if (value.ORDERSTATUSID.toLowerCase() == "complete") {
                        ////        // html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></div>";
                        ////        html += "<div class=\"dropdown\" id=\"carryoutstatus_" + value.ID + "\">";
                        ////        html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                        ////        html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        ////        html += "<a class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        ////        html += "<a  onclick=\"ChangeOrderStatusDropdown('PickedUp'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        ////        html += "</div>";
                        ////        html += "</div>";
                        ////    }
                        ////    else if (value.ORDERSTATUSID.toLowerCase() == "pickedup") {
                        ////        //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                        ////        html += "<div class=\"dropdown\" id=\"carryoutstatus_" + value.ID + "\">";
                        ////        html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                        ////        html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        ////        html += "<a class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        ////        html += "</div>";
                        ////        html += "</div>";
                        ////    }
                        ////    else if (value.ORDERSTATUSID.toLowerCase() == "cancelled") {
                        ////        //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                        ////        html += "<div class=\"dropdown\" id=\"carryoutstatus_" + value.ID + "\">";
                        ////        html += "<button id=\"btnStatusChange\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/cancel.png\" alt=\"\"/></button>";
                        ////        html += "</div>";
                        ////    }
                        ////}

                        /*-----------------Status Icon End----------------*/

                        //html += "<div class=\"order-number-carryout panel-open\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\">#" + value.ID + "<span></div>";
                        html += "<div class=\"order-number-carryout\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\" style=\"font-size: 18px; white-space: nowrap;\">" + firstName + " " + lastName + "</div>";

                        if (value.PICKUPTIME != undefined) {
                            var pickupdatetime = value.PICKUPTIME;

                            if (ordertype == "Carry Out") {
                                ////if (status == '' || status == "All")
                                html += "<div class=\"order-pickup-new\">" + pickupdatetime + "</div>";
                                ////else
                                ////    html += "<div class=\"order-pickup  order-pickup-margin-top\" style=\"margin-top:22px;\">" + pickupdatetime + "</div>";
                            }
                                //For Delivery Orders - Start//
                            else if (ordertype == "Delivery") { 
                                ////if (status == '' || status == "All")
                                html += "<div class=\"order-pickup-new\" style=\"color: #e95861;\">" + pickupdatetime + "</div>";
                                ////else
                                ////    html += "<div class=\"order-pickup  order-pickup-margin-top\" style=\"margin-top:22px; color: #e95861;\">" + pickupdatetime + "</div>";
                            }//For Delivery Orders - End//
                            else {
                                if (pickupdatetime.indexOf("@") > -1) {
                                    var pickupDate = pickupdatetime.split('@')[0].trim();
                                    var pickupTime = pickupdatetime.split('@')[1].trim();
                                    if (status == '' || status == "All")
                                        html += "<div class=\"order-pickup-new\"><div>" + pickupTime + "</div><div class=\"order-pickup-time\">" + pickupDate + "</div></div>";
                                    else
                                        html += "<div class=\"order-pickup-new  order-pickup-margin-top\" style=\"margin-top:4px;\"><div>" + pickupTime + "</div><div class=\"order-pickup-time\">" + pickupDate + "</div></div>";
                                }
                                else {
                                    ////if (status == '' || status == "All")
                                    html += "<div class=\"order-pickup-new\">" + pickupdatetime + "</div>";
                                    ////else
                                    ////    html += "<div class=\"order-pickup  order-pickup-margin-top\" style=\"margin-top:22px;\">" + pickupdatetime + "</div>";
                                }
                            }

                        }
                        //else {
                        //  if (status == '' || status == "All")
                        //      html += "<div class=\"order-pickup\"></div>";
                        //  else

                        //      html += "<div class=\"order-pickup order-pickup-margin-top\"></div>";
                        //  }


                        ////////html += "</div>";
                        /*------------------Column 1-----------------------*/
                        /*------------------Column 2-----------------------*/
                        ////////html += "<div class=\"order-column-two\">";
                        /*------------------1st Row-----------------------*/
                        ////////html += "<div class=\"order-row-container\">";
                        ////html += "<div class=\"order-number panel-open\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\">#" + value.ID + "<span> on </span><span>" + orderDate + " @ " + orderTime + "</span></div>";
                        ////html += "<div class=\"order-number-carryout panel-open\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\">#" + value.ID + "<span></div>";
                        /*------------------Button Row-----------------------*/
                        ////if (status == '' || status == "All") {
                        
                        ////if (value.ORDERSTATUSID != "New" && value.ORDERSTATUSID != "Cancelled" ) {
                        ////        //console.log('value.ORDERPICKUPSMSSENTON: ' + value.ORDERPICKUPSMSSENTON)
                        ////        if (value.ORDERPICKUPSMSSENTON != undefined && value.ORDERPICKUPSMSSENTON != null && value.ORDERPICKUPSMSSENTON.trim()!= "") {
                        ////           // console.log('value.ORDERPICKUPSMSSENTON: '+value.ORDERPICKUPSMSSENTON)
                        ////            buttonHTML += "<a><img src=\"./img/icons/pickup_sms_button_active.png\" class=\"grid-small-icon\"/></a>";

                        ////        }
                        ////        else {
                        ////            buttonHTML += "<a onclick=\"ConfirmationPickUpSMSSend(" + value.ID + ",'" + phone + "','Grid','" + ordertotal + "')\"  id=\"btnPickUpSMS_" + value.ID + "\"><img id=\"imgPickUpSMS_" + value.ID + "\" src=\"./img/icons/pickup_sms_button.png\" class=\"grid-small-icon\" /></a>";
                        ////        }
                        ////    } 
                        ////else if (value.ORDERSTATUSID == "New")
                        ////{
                        ////        buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnAccept\"><img src=\"./img/icons/accept_button.png\" style=\"width:41%;float: right;margin-right:23px;\" /></a>";
                        ////    }
                        ////    html += "<div class=\"order-buttons\" id=\"dvCarryOutButtons_" + value.ID + "\">";
                        ////    html += buttonHTML;
                        ////    html += "</div>";
                        ////}
                        ////else if (status=='New') {
                        ////    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnAccept\"><img src=\"./img/icons/accept_button.png\" style=\"width:41%;float: right;margin-right:23px;\" /></a>";
                        ////    buttonHTML += "<a style=\"display:none;\" onclick=\"ConfirmationPickUpSMSSend(" + value.ID + ",'" + phone + "','Grid','" + ordertotal + "')\"  id=\"btnPickUpSMS_" + value.ID + "\"><img id=\"imgPickUpSMS_" + value.ID + "\" src=\"./img/icons/pickup_sms_button.png\" class=\"grid-small-icon\" /></a>";
                        ////    html += "<div class=\"order-buttons\" id=\"dvCarryOutButtons_" + value.ID + "\">";
                        ////    html += buttonHTML;
                        ////    html += "</div>";
                        ////}
                        /*------------------Button Row-----------------------*/
                        ////////html += "</div>";
                        /*------------------1st Row-----------------------*/

                        /*------------------2nd Row-----------------------*/
                        ////////html += "<div class=\"order-row-container\" >";

                        /*------------------Customer Info-----------------------*/
                        ////html += "<div class=\"order-date order-payment-info\">";
                        ////html += "<div class=\"customer-detail-container panel-open\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\">";
                        ////html += "<div class=\"customer-name\">" + firstName + " " + lastName + "</div>";
                        ////html += "<div id=\"customerphone_" + value.ID + "\">" + phone + "</div>";
                        //////html += "<div class=\"display-label-wrap\">" + email + "</div>";
                        ////html += "</div>";
                        ////html += "</div>";
                        /*------------------Customer Info-----------------------*/
                        /*------------------Order Info-----------------------*/
                        ////html += "<div class=\"order-items-count\" style=\"width:25%;\">";

                        ////html += "<div class=\"customer-detail-container\" id=\"dvPickUpSMSGrid_" + value.ID + "\">";
               
                        ////html += "<div class=\"order-price\" id=\"orderprice_" + value.ID + "\">" + ordertotal + "</div>";
                        ////if (value.NOOFITEMS == 1) {
                        ////    html += "<div>1 item ";
                        ////}
                        ////else {
                        ////    html += "<div>" + value.NOOFITEMS + " items ";
                        ////}
                        ////if (paymentMethod == "Cash On Delivery") {
                        ////    html += "<span class=\"cc-number\">Due on Pickup</span>";
                        ////}
                        ////else {
                        ////    html += "<span class=\"cc-number\">PAID</span>";
                        ////}
                        ////html += "</div>";

                        ////html += "</div>";//end customer-detail-container div
                        ////html += "</div>";//end order-items-count div
                        /*------------------Order Info-----------------------*/


                        ////////html += "</div>";
                        /*------------------2nd Row-----------------------*/
                        html += "</div>";
                        /*------------------Column 2-----------------------*/

                        html += "</div>";
                        /*------------------Order Row-----------------------*/



                        html += "</div>";
                        /*------------------Order Area-----------------------*/

                        count++;
                        //console.log(html)
                        $("#" + divId).append(html);


                    });
                }
                else {
                    localStorage.setItem("OrderAvailable", "0");
                    var html = "<div class=\"order-list list-empty-label-text\">No Orders</div>";

                    $("#" + divId).html(html);

                }
            });


        }
        catch (e) {
        }
    }
    else {
        self.app.router.navigate('/login_new/', { reloadCurrent: false });
    }
}

//Carryout Orders
function CarryoutOrdersListPagination(status, carryoutpagesize, carryoutcurrentPage, divId) {
    //Shorting
    var sortValue = "DESC";
    var sortByValue = "";
    var filterStatus = "";
    var orderNoFrom = "";
    var orderNoTo = "";
    var phone = "";
    var orderDateFrom = "";
    var orderDateTo = "";
    //Shorting

    var customerId = 0;
    var storeId = 0;
    var status = $('#hdnCurrentState').val();
    if (status == "New") {
        divId = 'dvNewList';
    }
    else if (status == "Processing") {
        divId = 'dvProcessingList';
    }
    else {
        divId = 'dvAllList';
        sortValue = $("input[name='radioCarryoutSort']:checked").val();
        sortByValue = $("input[name='radioCarryoutSortBy']:checked").val();

        filterStatus = $("#ddlFilterCarryoutStatus").val();
        orderNoFrom = $("#txtFilterOrderNumberFrom").val();
        orderNoTo = $("#txtFilterOrderNumberTo").val();
        phone = $("#txtFilterPhone").val();
        orderDateFrom = $("#txtFilterOrderDateFrom").val();
        orderDateTo = $("#txtFilterOrderDateTo").val();

        //console.log("Sort: "+ sortValue + " By: " + sortByValue + " filter: " + filterStatus + " orderNofrom: " + orderNoFrom + " orderNoTo: " + orderNoTo + " phone: " + phone + " orderDateFrom: "+ orderDateFrom + " dateTo: " + orderDateTo);
        if (sortValue == undefined) {
            sortValue = "";
        }
        if (sortByValue == undefined) {
            sortByValue = "";
        }
        if (filterStatus == undefined) {
            filterStatus = "";
        }
        if (orderNoFrom == undefined) {
            orderNoFrom = "";
        }
        if (orderNoTo == undefined) {
            orderNoTo = "";
        }
        if (phone == undefined) {
            phone = "";
        }
        if (orderDateFrom == undefined) {
            orderDateFrom = "";
        }
        if (orderDateTo == undefined) {
            orderDateTo = "";
        }
    }

    storeId = SetStoreId();
    customerId = SetCustomerId();
    if (Number(storeId) > 0) {

        carryoutcurrentPage = Number(carryoutcurrentPage) * Number(carryoutpagesize);
        url = global + "/GetAllCarryOutOrdersTemp?storeid=" + storeId + "&status=" + status + "&pagesize=" + carryoutpagesize + "&currentPage=" + carryoutcurrentPage + "&sortValue=" + sortValue + "&sortByValue=" + sortByValue +
            "&filterStatus=" + filterStatus + "&orderNoFrom=" + orderNoFrom + "&orderNoTo=" + orderNoTo + "&phone=" + phone + "&orderDateFrom=" + orderDateFrom + "&orderDateTo=" + orderDateTo;
        if (status.toLowerCase().trim() == "new") {

            $("#dvNew").attr("class", "active");
            $("#dvPending").removeAttr("class");
            $("#dvAll").removeAttr("class");


        }
        else if (status.toLowerCase().trim() == "processing") {

            $("#dvPending").attr("class", "active");
            $("#dvNew").removeAttr("class");
            $("#dvAll").removeAttr("class");
        }
        else {

            $("#dvAll").attr("class", "active");
            $("#dvPending").removeAttr("class");
            $("#dvNew").removeAttr("class");

        }
        try {

            $.getJSON(url, function (data) {
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;


                $('#loader_msg').html("");
                if (JSON.parse(data).indexOf("No order(s) found") < 0) {
                    localStorage.setItem("OrderAvailable", "1");
                    var count = 0;
                    $.each(JSON.parse(data), function (index, value) {
                        
                        var orderDate = "";
                        var orderTime = "";
                        var firstName = "";
                        var lastName = "";
                        var email = "";
                        var phone = "";
                        var paymentMethod = "";
                        var cardNumber = "";
                        var ordertotal = "";
                        var buttonHTML = "";
                        var subTotal = 0.00;
                        var grandTotal = 0.00;
                        var discount = 0.00;
                        var ordertype = "";
                        if (value.ORDERTYPE != "") {
                            ordertype = value.ORDERTYPE;
                        }
                        if (value.SUBTOTAL != "") {
                            subTotal = value.SUBTOTAL;
                        }
                        if (value.ORDERDISCOUNT != "") {
                            discount = value.ORDERDISCOUNT;
                        }

                        grandTotal = value.ORDERTOTAL;

                        if (Number(grandTotal) != Number(subTotal)) {
                            ordertotal = FormatDecimal(Number(subTotal) - Number(discount));
                        }
                        else {
                            ordertotal = FormatDecimal(grandTotal);
                        }
                        if (value.CREATEDONUTC != null && value.CREATEDONUTC != undefined) {
                            var arrDateTime = value.CREATEDONUTC.split('~');
                            var orderDate = arrDateTime[0];
                            var orderTime = arrDateTime[1];
                        }
                        if (value.FIRSTNAME != "") {
                            firstName = value.FIRSTNAME;
                        }
                        else {
                            firstName = value.BILLINGFIRSTNAME;
                        }

                        if (value.LASTNAME != "") {
                            lastName = value.LASTNAME;
                        }
                        else {
                            lastName = value.BILLINGLASTNAME;
                        }

                        if (value.EMAIL != "" && value.EMAIL != undefined) {
                            email = value.EMAIL;
                        }
                        else {
                            email = value.BILLINGEMAIL;
                        }

                        if (value.PHONE != "") {
                            phone = value.PHONE;
                        }
                        else {
                            phone = value.BILLINGPHONE;
                        }
                        if (phone.length == 10)
                            phone = FormatPhoneNumber(phone);
                        if (value.PAYMENTMETHOD != "" && value.PAYMENTMETHOD != undefined) {
                            paymentMethod = value.PAYMENTMETHOD;
                        }
                        if (value.CardNumber != "" && value.CardNumber != undefined) {
                            cardNumber = value.CardNumber;
                        }
                        /*------------------Order Area-----------------------*/

                        var html = "<div class=\"order-container\"  id='li_" + value.ID + "' style=\"height:75px;\">";


                        /*------------------Order Row-----------------------*/

                        html += "<div id=\"dvOrderInner_" + value.ID + "\" class=\"order-list-carryout\"  data-popup=\".popup-details\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\">";

                        /*------------------Column 1-----------------------*/

                        ////////html += "<div class=\"order-column-one\" >";
                        /*------------------Status Icon--------------------*/
                        ////if (status == '' || status == "All") {
                        ////    if (value.ORDERSTATUSID.toLowerCase() == "new") {
                        ////        //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></div>";
                        ////        html += "<div class=\"dropdown\" id=\"carryoutstatus_" + value.ID + "\">";
                        ////        html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></button>";
                        ////        html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('PickedUp'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        ////        html += "</div>";
                        ////        html += "</div>";
                        ////    }
                        ////    else if (value.ORDERSTATUSID.toLowerCase() == "processing") {
                        ////        // html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></div>";

                        ////        html += "<div class=\"dropdown\" id=\"carryoutstatus_" + value.ID + "\">";
                        ////        html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></button>";
                        ////        html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        ////        html += "<a class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        ////        html += "<a  onclick=\"ChangeOrderStatusDropdown('PickedUp'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        ////        html += "</div>";
                        ////        html += "</div>";
                        ////    }
                        ////    else if (value.ORDERSTATUSID.toLowerCase() == "complete") {
                        ////        // html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></div>";
                        ////        html += "<div class=\"dropdown\" id=\"carryoutstatus_" + value.ID + "\">";
                        ////        html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                        ////        html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        ////        html += "<a class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        ////        html += "<a  onclick=\"ChangeOrderStatusDropdown('PickedUp'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        ////        html += "</div>";
                        ////        html += "</div>";
                        ////    }
                        ////    else if (value.ORDERSTATUSID.toLowerCase() == "pickedup") {
                        ////        //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                        ////        html += "<div class=\"dropdown\" id=\"carryoutstatus_" + value.ID + "\">";
                        ////        html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                        ////        html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        ////        html += "<a class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        ////        html += "</div>";
                        ////        html += "</div>";
                        ////    }
                        ////    else if (value.ORDERSTATUSID.toLowerCase() == "cancelled") {
                        ////        //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                        ////        html += "<div class=\"dropdown\" id=\"carryoutstatus_" + value.ID + "\">";
                        ////        html += "<button id=\"btnStatusChange\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/cancel.png\" alt=\"\"/></button>";
                        ////        html += "</div>";
                        ////    }
                        ////}

                        /*-----------------Status Icon End----------------*/

                        //html += "<div class=\"order-number-carryout panel-open\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\">#" + value.ID + "<span></div>";
                        html += "<div class=\"order-number-carryout\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\" style=\"font-size: 18px; white-space: nowrap;\">" + firstName + " " + lastName + "</div>";

                        if (value.PICKUPTIME != undefined) {
                            var pickupdatetime = value.PICKUPTIME;

                            if (ordertype == "Carry Out") {
                                ////if (status == '' || status == "All")
                                html += "<div class=\"order-pickup-new\">" + pickupdatetime + "</div>";
                                ////else
                                ////    html += "<div class=\"order-pickup  order-pickup-margin-top\" style=\"margin-top:22px;\">" + pickupdatetime + "</div>";
                            }
                                //For Delivery Orders - Start//
                            else if (ordertype == "Delivery") {
                                ////if (status == '' || status == "All")
                                html += "<div class=\"order-pickup-new\" style=\"color: #e95861;\">" + pickupdatetime + "</div>";
                                ////else
                                ////    html += "<div class=\"order-pickup  order-pickup-margin-top\" style=\"margin-top:22px; color: #e95861;\">" + pickupdatetime + "</div>";
                            }//For Delivery Orders - End//
                            else {
                                if (pickupdatetime.indexOf("@") > -1) {
                                    var pickupDate = pickupdatetime.split('@')[0].trim();
                                    var pickupTime = pickupdatetime.split('@')[1].trim();
                                    if (status == '' || status == "All")
                                        html += "<div class=\"order-pickup-new\"><div>" + pickupTime + "</div><div class=\"order-pickup-time\">" + pickupDate + "</div></div>";
                                    else
                                        html += "<div class=\"order-pickup-new  order-pickup-margin-top\" style=\"margin-top:4px;\"><div>" + pickupTime + "</div><div class=\"order-pickup-time\">" + pickupDate + "</div></div>";
                                }
                                else {
                                    ////if (status == '' || status == "All")
                                    html += "<div class=\"order-pickup-new\">" + pickupdatetime + "</div>";
                                    ////else
                                    ////    html += "<div class=\"order-pickup  order-pickup-margin-top\" style=\"margin-top:22px;\">" + pickupdatetime + "</div>";
                                }
                            }

                        }
                        //else {
                        //  if (status == '' || status == "All")
                        //      html += "<div class=\"order-pickup\"></div>";
                        //  else

                        //      html += "<div class=\"order-pickup order-pickup-margin-top\"></div>";
                        //  }


                        ////////html += "</div>";
                        /*------------------Column 1-----------------------*/
                        /*------------------Column 2-----------------------*/
                        ////////html += "<div class=\"order-column-two\">";
                        /*------------------1st Row-----------------------*/
                        ////////html += "<div class=\"order-row-container\">";
                        ////html += "<div class=\"order-number panel-open\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\">#" + value.ID + "<span> on </span><span>" + orderDate + " @ " + orderTime + "</span></div>";
                        ////html += "<div class=\"order-number-carryout panel-open\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\">#" + value.ID + "<span></div>";
                        /*------------------Button Row-----------------------*/
                        ////if (status == '' || status == "All") {

                        ////if (value.ORDERSTATUSID != "New" && value.ORDERSTATUSID != "Cancelled" ) {
                        ////        //console.log('value.ORDERPICKUPSMSSENTON: ' + value.ORDERPICKUPSMSSENTON)
                        ////        if (value.ORDERPICKUPSMSSENTON != undefined && value.ORDERPICKUPSMSSENTON != null && value.ORDERPICKUPSMSSENTON.trim()!= "") {
                        ////           // console.log('value.ORDERPICKUPSMSSENTON: '+value.ORDERPICKUPSMSSENTON)
                        ////            buttonHTML += "<a><img src=\"./img/icons/pickup_sms_button_active.png\" class=\"grid-small-icon\"/></a>";

                        ////        }
                        ////        else {
                        ////            buttonHTML += "<a onclick=\"ConfirmationPickUpSMSSend(" + value.ID + ",'" + phone + "','Grid','" + ordertotal + "')\"  id=\"btnPickUpSMS_" + value.ID + "\"><img id=\"imgPickUpSMS_" + value.ID + "\" src=\"./img/icons/pickup_sms_button.png\" class=\"grid-small-icon\" /></a>";
                        ////        }
                        ////    } 
                        ////else if (value.ORDERSTATUSID == "New")
                        ////{
                        ////        buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnAccept\"><img src=\"./img/icons/accept_button.png\" style=\"width:41%;float: right;margin-right:23px;\" /></a>";
                        ////    }
                        ////    html += "<div class=\"order-buttons\" id=\"dvCarryOutButtons_" + value.ID + "\">";
                        ////    html += buttonHTML;
                        ////    html += "</div>";
                        ////}
                        ////else if (status=='New') {
                        ////    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnAccept\"><img src=\"./img/icons/accept_button.png\" style=\"width:41%;float: right;margin-right:23px;\" /></a>";
                        ////    buttonHTML += "<a style=\"display:none;\" onclick=\"ConfirmationPickUpSMSSend(" + value.ID + ",'" + phone + "','Grid','" + ordertotal + "')\"  id=\"btnPickUpSMS_" + value.ID + "\"><img id=\"imgPickUpSMS_" + value.ID + "\" src=\"./img/icons/pickup_sms_button.png\" class=\"grid-small-icon\" /></a>";
                        ////    html += "<div class=\"order-buttons\" id=\"dvCarryOutButtons_" + value.ID + "\">";
                        ////    html += buttonHTML;
                        ////    html += "</div>";
                        ////}
                        /*------------------Button Row-----------------------*/
                        ////////html += "</div>";
                        /*------------------1st Row-----------------------*/

                        /*------------------2nd Row-----------------------*/
                        ////////html += "<div class=\"order-row-container\" >";

                        /*------------------Customer Info-----------------------*/
                        ////html += "<div class=\"order-date order-payment-info\">";
                        ////html += "<div class=\"customer-detail-container panel-open\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\">";
                        ////html += "<div class=\"customer-name\">" + firstName + " " + lastName + "</div>";
                        ////html += "<div id=\"customerphone_" + value.ID + "\">" + phone + "</div>";
                        //////html += "<div class=\"display-label-wrap\">" + email + "</div>";
                        ////html += "</div>";
                        ////html += "</div>";
                        /*------------------Customer Info-----------------------*/
                        /*------------------Order Info-----------------------*/
                        ////html += "<div class=\"order-items-count\" style=\"width:25%;\">";

                        ////html += "<div class=\"customer-detail-container\" id=\"dvPickUpSMSGrid_" + value.ID + "\">";

                        ////html += "<div class=\"order-price\" id=\"orderprice_" + value.ID + "\">" + ordertotal + "</div>";
                        ////if (value.NOOFITEMS == 1) {
                        ////    html += "<div>1 item ";
                        ////}
                        ////else {
                        ////    html += "<div>" + value.NOOFITEMS + " items ";
                        ////}
                        ////if (paymentMethod == "Cash On Delivery") {
                        ////    html += "<span class=\"cc-number\">Due on Pickup</span>";
                        ////}
                        ////else {
                        ////    html += "<span class=\"cc-number\">PAID</span>";
                        ////}
                        ////html += "</div>";

                        ////html += "</div>";//end customer-detail-container div
                        ////html += "</div>";//end order-items-count div
                        /*------------------Order Info-----------------------*/


                        ////////html += "</div>";
                        /*------------------2nd Row-----------------------*/
                        html += "</div>";
                        /*------------------Column 2-----------------------*/

                        html += "</div>";
                        /*------------------Order Row-----------------------*/



                        html += "</div>";
                        /*------------------Order Area-----------------------*/

                        count++;

                        $("#" + divId).append(html);


                    });


                }
                else {
                    localStorage.setItem("OrderAvailable", "0");

                }



            });

        }
        catch (e) {
        }
    }
    else {
        self.app.router.navigate('/login_new/', { reloadCurrent: false });
    }

}
//Carryout Details
function OpenCarryoutDetails(id) {
    var currentTabId = $(".tab-active").attr('id');
    $("#dvCarryOutDetailsInner #hdnSelectedOrderId").val(id);
    var storeId = SetStoreId();
    if (id > 0) {
        url = global + "/GetCarryOutOrderDetailsWithAllInfo?orderid=" + id;
        $.getJSON(url, function (data) {
            ////$('#dvDetailsPanel').html("");
            $("#dvOrderInfo").html("");
            $("#dvItem").html("");
            $("#divUpperButtonArea").html("");
            $("#divOrderDetailsPickupTime").html("");
            var html = "";
            var htmlDiscount = "";
            var htmlRewards = "";
            var htmlGiftCard = "";
            var htmlSubTotal = "";
            var htmlOrderTotal = "";
            var htmlDueAmount = "";
            var upperButtonHtml = "";
            var orderPickupTimeHtml = "";
            var subtotalvalue = "0.00";
            var ordertotalvalue = "0.00";
            var orderDiscount = 0.00;
            var grandTotal = 0.00;
            var grandTotalvalue = "0.00";
            var dueAmount = 0.00;
            var dueAmountValue = "0.00";
            var paidAmount = 0.00;
            var paidAmountValue = "0.00";
            var orderDate = "";
            var orderTime = "";
            var firstName = "";
            var lastName = "";
            var email = "";
            var phone = "";
            var address1 = "";
            var address2 = "";
            var city = "";
            var state = "";
            var zip = "";
            var paymentMethod = "";
            var cardNumber = "";
            var ordertotal = "";
            var buttonHTML = "";

            var orderId = 0;
            var orderDate = "";
            var orderTime = "";
            var pickupTime = "";
            var orderStatus = "";
            var numberOfItems = "";
            var ordertype = "";
          
            var authorizationCode = "";

            //console.log(data);
            $.each(JSON.parse(data), function (index, value) {
                //console.log(value);

                if (value.Type == "OrderInfo") {
                    if (value.ORDERTYPE != "") {
                        ordertype = value.ORDERTYPE;
                    }
                    if (ordertype != "" && ordertype == "Delivery") {
                        $('#spanOrderDetailsOrderType').html("");
                        $('#spanOrderDetailsOrderType').html(ordertype);
                        $('#spanOrderDetailsOrderType').css('color', '#e95861');
                    }
                    else {
                        $('#spanOrderDetailsOrderType').html("");
                        $('#spanOrderDetailsOrderType').html("Carry Out");
                        $('#spanOrderDetailsOrderType').css('color', '#08b3c7');
                    }
                    orderDiscount = value.ORDERDISCOUNT;
                    subtotalvalue = value.SUBTOTAL;
                    if (value.BALANCEDUE != undefined && Number(value.BALANCEDUE) > 0) {
                        dueAmount = value.BALANCEDUE;
                        dueAmountValue = FormatDecimal(dueAmount);
                        grandTotal = Number(value.SUBTOTAL) - Number(value.ORDERDISCOUNT);
                        grandTotalvalue = FormatDecimal(grandTotal);
                        paidAmount = grandTotal - Number(value.BALANCEDUE);
                        paidAmountValue = FormatDecimal(paidAmount);

                        htmlDueAmount = " <tr>";
                        htmlDueAmount += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Paid:</td>";
                        htmlDueAmount += "<td style=\"text-align:right;\">" + paidAmountValue + "</td>";
                        htmlDueAmount += "</tr>";

                        htmlDueAmount += " <tr>";
                        htmlDueAmount += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Due at Pickup:</td>";
                        htmlDueAmount += "<td style=\"text-align:right;\">" + dueAmountValue + "</td>";
                        htmlDueAmount += "</tr>";
                    }
                    else {
                        grandTotal = value.ORDERTOTAL;
                        grandTotalvalue = FormatDecimal(grandTotal);
                    }
                    console.log('value.OID: ' + value.OID)
                    orderId = value.OID;
                    $("#dvCarryOutDetailsInner #hdnSelectedOrderId").val(orderId);
                    //if (value.ORDERTOTAL != "") {
                    //    $("#hdnSelectedOrderOrderPrice").val(FormatDecimal(value.ORDERTOTAL));
                    //    ordertotalvalue = FormatDecimal(value.ORDERTOTAL);
                    //}
                    //else {
                    //    $("#hdnSelectedOrderOrderPrice").val("$0.00");
                    //}
                    if (Number(grandTotal) != Number(subtotalvalue)) {
                        ordertotalvalue = FormatDecimal(Number(subtotalvalue) - Number(orderDiscount));
                    }
                    else {
                        ordertotalvalue = FormatDecimal(grandTotal);
                    }
                    $("#hdnSelectedOrderOrderPrice").val(ordertotalvalue);
                    if (value.CREATEDONUTC != null && value.CREATEDONUTC != undefined) {
                        var arrDateTime = value.CREATEDONUTC.split('~');
                        orderDate = arrDateTime[0];
                        orderTime = arrDateTime[1];
                        $("#hdnSelectedOrderDateTime").val(orderDate + "#" + orderTime);
                    }
                    //console.log(value.PICKUPTIME)
                    if (value.PICKUPTIME != undefined) {
                        $("#hdnSelectedOrderPickUpTime").val(value.PICKUPTIME);
                        pickupTime = value.PICKUPTIME;
                    }
                    //console.log("1:"+pickupTime)
                    //console.log('value.ORDERPICKUPSMSSENTON: ' + value.ORDERPICKUPSMSSENTON)
                    if (value.ORDERPICKUPSMSSENTON != undefined && value.ORDERPICKUPSMSSENTON != null && value.ORDERPICKUPSMSSENTON != "") {

                        if (value.ORDERPICKUPSMSSENTON.indexOf("~") > -1) {
                            var arrPickUpSMSSentDateTime = value.ORDERPICKUPSMSSENTON.split('~');
                            var smsSentDate = arrPickUpSMSSentDateTime[0];
                            var smsSentTime = arrPickUpSMSSentDateTime[1];
                            $("#hdnSelectedOrderPickUpSMSSentTime").val(smsSentDate + "#" + smsSentTime);
                            $("#dvPickUpSMSSentTime").show();
                            $("#dvPickUpSMSSentTime").html("Pickup SMS sent<br/>" + smsSentDate + " @ " + smsSentTime);
                            $("#btnPickupSMS").hide();
                        }
                        else {
                            $("#dvPickUpSMSSentTime").hide();
                            $("#dvPickUpSMSSentTime").html("");
                            $("#hdnSelectedOrderPickUpSMSSentTime").val("");
                        }

                    }
                    else {
                        $("#dvPickUpSMSSentTime").hide();
                        $("#dvPickUpSMSSentTime").html("");
                        $("#btnPickupSMS").show();
                        $("#hdnSelectedOrderPickUpSMSSentTime").val("");
                    }

                    if (value.CREATEDONUTC != null && value.CREATEDONUTC != undefined) {
                        var arrDateTime = value.CREATEDONUTC.split('~');
                        orderDate = arrDateTime[0];
                        orderTime = arrDateTime[1];
                    }
                    if (value.FIRSTNAME != "") {
                        firstName = value.FIRSTNAME;
                    }
                    else {
                        firstName = value.BILLINGFIRSTNAME;
                    }

                    if (value.LASTNAME != "") {
                        lastName = value.LASTNAME;
                    }
                    else {
                        lastName = value.BILLINGLASTNAME;
                    }

                    if (value.EMAIL != "" && value.EMAIL != undefined) {
                        email = value.EMAIL;
                    }
                    else {
                        email = value.BILLINGEMAIL;
                    }

                    if (value.PHONE != "") {
                        phone = value.PHONE;
                    }
                    else {
                        phone = value.BILLINGPHONE;
                    }

                    if (phone != "" && phone != undefined && phone.length == 10)
                        phone = FormatPhoneNumber(phone);

                    if (value.BILLINGADDRESS1 != "") {
                        address1 = value.BILLINGADDRESS1;
                    }
                    if (value.BILLINGADDRESS2) {
                        address2 = value.BILLINGADDRESS2;
                    }
                    if (value.BILLINGADDRESSCITY) {
                        city = value.BILLINGADDRESSCITY;
                    }
                    if (value.BILLINGADDRESSSTATE) {
                        state = value.BILLINGADDRESSSTATE;
                    }
                    if (value.BILLINGADDRESSZIP) {
                        zip = value.BILLINGADDRESSZIP;
                    }

                    if (value.PAYMENTMETHOD != "" && value.PAYMENTMETHOD != undefined) {
                        paymentMethod = value.PAYMENTMETHOD;
                    }
                    if (value.CardNumber != "" && value.CardNumber != undefined) {
                        cardNumber = value.CardNumber;
                    }
                    if (value.ORDERSTATUSID != "" && value.ORDERSTATUSID != undefined) {
                        orderStatus = value.ORDERSTATUSID;
                    }
                    if (value.NOOFITEMS != "" && value.NOOFITEMS != undefined) {
                        numberOfItems = value.NOOFITEMS;
                    }
                    //console.log('value.AUTHORIZATIONTRANSACTIONCODE: ' + paymentMethod)
                    if(value.AUTHORIZATIONTRANSACTIONCODE!=null)
                    {
                        authorizationCode = value.AUTHORIZATIONTRANSACTIONCODE;
                    }

                }
                else if (value.Type == "DiscountInfo") {

                    htmlDiscount += " <tr>";
                    htmlDiscount += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Coupon (" + value.COUPONCODE + "):</td>";
                    htmlDiscount += "<td style=\"text-align:right;\">-" + FormatDecimal(orderDiscount) + "</td>";
                    htmlDiscount += "</tr>";

                }
                else if (value.Type == "RewardInfo") {
                    //console.log("RewardInfo: " + value.POINTS);
                    htmlRewards += " <tr>";
                    htmlRewards += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Reward Points (" + value.POINTS.toString().replace("-", "") + "):</td>";
                    htmlRewards += "<td  style=\"text-align:right;\">-" + FormatDecimal(value.USEDAMOUNT) + "</td>";
                    htmlRewards += "</tr>";
                }
                else if (value.Type == "GiftCardInfo") {
                    //console.log("GiftCardInfo: " + value.GIFTCARDCOUPONCODE);
                    htmlGiftCard += "<tr>";
                    htmlGiftCard += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Gift Card (" + value.GIFTCARDCOUPONCODE.replace("-", "") + "):</td>";
                    htmlGiftCard += "<td  style=\"text-align:right;\">-" + FormatDecimal(value.USEDVALUE) + "</td>";
                    htmlGiftCard += "</tr>";
                }
                if (orderStatus.toLowerCase() != "cancelled") {
                    $("#aCancelOrder").show();
                }
                else
                {
                    $("#aCancelOrder").hide();
                }
                /*------------------Order Area-----------------------*/
                var buttonHTML = "";
                var orderhtml = "";
                orderhtml = "<div class=\"order-container\">";
                /*------------------Order Row-----------------------*/
                orderhtml += "<div>";
                /*------------------Column 1-----------------------*/
                /*------------------Column 1 New Start-----------------------*/
                orderhtml += "<div class=\"order-row-container\">";
                /*------------------Status Icon Area Start-----------------------*/
                orderhtml += "<div class=\"order-buttons\" id=\"popUpCarryoutIcon_" + orderId + "\" style=\"width:40%;\">";
                if ((status == '' || status == "All")) {

                    if (orderStatus.toLowerCase() == "new") {
                        orderhtml += "<div class=\"dropdown\" id=\"carryoutpopstatus_" + orderId + "\">";
                        orderhtml += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></button>";
                        orderhtml += "<a class=\"popup-link\" onclick=\"OpenOrderHistoryPopup(" + orderId + ")\">History</a>";
                        orderhtml += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        orderhtml += "<a onclick=\"ChangePopupOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        orderhtml += "<a onclick=\"ChangePopupOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        orderhtml += "<a onclick=\"ChangePopupOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\">Picked Up</span></a>";
                        orderhtml += "</div>";
                        orderhtml += "</div>";

                        //Set Details Upper Button
                        upperButtonHtml = "<a class=\"custom-btn-two custom-bg custom-link item-media-section-two\" style=\"background:#5cb95a !important;\" onclick=\"ChangePopupOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\">Accept</a>";
                        $("#divUpperButtonArea").html(upperButtonHtml);
                                                
                    }
                    else if (orderStatus.toLowerCase() == "processing") {
                        orderhtml += "<div class=\"dropdown\" id=\"carryoutpopstatus_" + orderId + "\">";
                        orderhtml += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></button>";
                        orderhtml += "<a class=\"popup-link\" onclick=\"OpenOrderHistoryPopup(" + orderId + ")\">History</a>";
                        orderhtml += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        orderhtml += "<a  class=\"status-disabled\" onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        orderhtml += "<a onclick=\"ChangePopupOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        orderhtml += "<a  onclick=\"ChangePopupOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\">Picked Up</span></a>";
                        orderhtml += "</div>";
                        orderhtml += "</div>";

                        //Set Details Upper Button
                        upperButtonHtml = "<a class=\"custom-btn-two custom-bg custom-link item-media-section-two\" style=\"background:#74ddff !important;\" onclick=\"ChangePopupOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\">Complete</a>";
                        $("#divUpperButtonArea").html(upperButtonHtml);
                    }
                    else if (orderStatus.toLowerCase() == "complete") {
                        orderhtml += "<div class=\"dropdown\" id=\"carryoutpopstatus_" + orderId + "\">";
                        orderhtml += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                        orderhtml += "<a class=\"popup-link\" onclick=\"OpenOrderHistoryPopup(" + orderId + ")\">History</a>";
                        orderhtml += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        orderhtml += "<a onclick=\"ChangePopupOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        orderhtml += "<a class=\"status-disabled\" onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        orderhtml += "<a  onclick=\"ChangePopupOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\">Picked Up</span></a>";
                        orderhtml += "</div>";
                        orderhtml += "</div>";

                        //Set Details Upper Button
                        upperButtonHtml = "<a class=\"custom-btn-two custom-bg custom-link item-media-section-two\" style=\"background:#f7952c !important;\" onclick=\"ChangePopupOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\">PickedUp</a>";
                        //Send SMS Button
                        upperButtonHtml += "<a id=\"aPopupSMS_" + orderId + "\" class=\"custom-btn-three custom-bg custom-link item-media-section-two\" style=\"background:#303030 !important;\" onclick=\"ConfirmationPickUpSMSSend(" + orderId + ",'" + phone + "','Popup','$0.00')\">SMS to Customer</a>";
                        $("#divUpperButtonArea").html(upperButtonHtml);
                    }
                    else if (orderStatus.toLowerCase() == "pickedup") {
                        orderhtml += "<div class=\"dropdown\" id=\"carryoutpopstatus_" + orderId + "\">";
                        orderhtml += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                        orderhtml += "<a class=\"popup-link\" onclick=\"OpenOrderHistoryPopup(" + orderId + ")\">History</a>";
                        orderhtml += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        orderhtml += "<a onclick=\"ChangePopupOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        orderhtml += "<a onclick=\"ChangePopupOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        orderhtml += "<a class=\"status-disabled\"  onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\">Picked Up</span></a>";
                        orderhtml += "</div>";
                        orderhtml += "</div>";

                        $("#divUpperButtonArea").html("");
                    }
                    else if (orderStatus.toLowerCase() == "cancelled") {
                        //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                        orderhtml += "<div class=\"dropdown\" id=\"carryoutstatus_" + orderId + "\">";
                        orderhtml += "<button id=\"btnStatusChange\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/cancel.png\" alt=\"\"/></button>";
                        orderhtml += "<a class=\"popup-link\" onclick=\"OpenOrderHistoryPopup(" + orderId + ")\">History</a>";

                        orderhtml += "</div>";

                        $("#divUpperButtonArea").html("");
                    }
                }

                //Bind Phone for use next time complete order send sms to customer functionality
                orderhtml += "<input type=\"hidden\" id=\"hdnSelectedOrderPhone_"+orderId+"\" value=\""+phone+"\" />";

                orderhtml += "</div>";
                /*------------------Status Icon Area End-----------------------*/
                /*------------------Button Row Start-----------------------*/
                if (orderStatus != "New" && orderStatus != "Cancelled") {
                    if (value.ORDERPICKUPSMSSENTON != undefined && value.ORDERPICKUPSMSSENTON != null && value.ORDERPICKUPSMSSENTON != "") {


                        if (value.ORDERPICKUPSMSSENTON.indexOf("~") > -1) {
                            var arrPickUpSMSSentDateTime = value.ORDERPICKUPSMSSENTON.split('~');
                            var smsSentDate = arrPickUpSMSSentDateTime[0];
                            var smsSentTime = arrPickUpSMSSentDateTime[1];
                            buttonHTML += "<div class=\"popup-label-left-new\"  id=\"dvPickUpSMSSentTime\"><div>Pickup SMS sent </div><div>" + smsSentDate + " @ " + smsSentTime + "</div></div>";
                        }

                        ////buttonHTML += "<img src=\"./img/icons/pickup_sms_button_active.png\" class=\"popup-button-right\" />";

                    }
                    ////else {
                    ////    if (phone != "")
                    ////        buttonHTML += "<a id=\"aPopupSMS_" + orderId + "\"><img onclick=\"ConfirmationPickUpSMSSend(" + orderId + ",'" + phone + "','Popup','$0.00')\" id=\"imgPopupSMS_" + orderId + "\" src=\"./img/icons/pickup_sms_button.png\" style=\"width:21%;float:right;padding-right:0px;\" /></a>";

                    ////}
                }
                else {
                    //buttonHTML += "<a id=\"aPopupSMS_" + orderId + "\"><img id=\"imgPopupSMS_" + orderId + "\" src=\"./img/icons/pickup_sms_button_active.png\" style=\"width:21%;float:right;padding-right:17px;\" /></a>";
                }

                orderhtml += "<div class=\"order-buttons\" id=\"popupCarryOutDetails_" + orderId + "\" style=\"width:60%;\">";
                orderhtml += buttonHTML;
                orderhtml += "</div>";

                /*------------------Button Row End-----------------------*/
                orderhtml += "</div>";
                /*------------------Column 1 New End-----------------------*/

                /*------------------Column 2 New Start-----------------------*/
                orderhtml += "<div class=\"order-row-container\">";
                if (pickupTime != undefined) {
                    if (pickupTime.indexOf("@") > -1) {
                        var pickupDateOnly = pickupTime.split('@')[0].trim();
                        var pickupTimeOnly = pickupTime.split('@')[1].trim();
                        //console.log("pickupDateOnly:" + pickupDateOnly)
                        if (status == '' || status == "All")
                            orderPickupTimeHtml = "<div class=\"order-details-pickup\">" + pickupTimeOnly + "</br><span style=\"font-size:16px;\">" + pickupDateOnly + "</span>" + "</div>";
                        else
                            orderPickupTimeHtml = "<div class=\"order-details-pickup  order-pickup-margin-top\">" + pickupTimeOnly + "</br><span style=\"font-size:16px;\">" + pickupDateOnly + "</span>" + "</div>";
                    }
                    else {
                        if (ordertype != '' && ordertype == "Delivery") {
                            if (status == '' || status == "All")
                                orderPickupTimeHtml = "<div class=\"order-details-pickup\" style=\"color: #e95861;\">" + pickupTime + "</div>";
                            else
                                orderPickupTimeHtml = "<div class=\"order-details-pickup  order-pickup-margin-top\" style=\"color: #e95861;\">" + pickupTime + "</div>";
                        }
                        else {
                            if (status == '' || status == "All")
                                orderPickupTimeHtml = "<div class=\"order-details-pickup\">" + pickupTime + "</div>";
                            else
                                orderPickupTimeHtml = "<div class=\"order-details-pickup  order-pickup-margin-top\">" + pickupTime + "</div>";
                        }                        
                    }

                }
                else {
                    if (status == '' || status == "All")
                        orderPickupTimeHtml += "<div class=\"order-details-pickup\"></div>";
                    else

                        orderPickupTimeHtml += "<div class=\"order-details-pickup order-pickup-margin-top\"></div>";
                }
                //Bind Order Pickup Time
                $("#divOrderDetailsPickupTime").html("");
                $("#divOrderDetailsPickupTime").html(orderPickupTimeHtml);

                orderhtml += "<div class=\"carryout-order-number\"><span class=\"order-number\" style=\"font-size:30px;\"> #" + orderId + "</span><br/> " + orderDate + " @ " + orderTime + "</div>";
                orderhtml += "</div>";
                /*------------------Column 2 New End-----------------------*/


                /*------------------2nd Row-----------------------*/
                orderhtml += "<div class=\"order-row-container\" style=\"padding-bottom: 2px;\">";

                /*------------------Customer Info-----------------------*/
                orderhtml += "<div class=\"giftcard-customer-new\">";
                orderhtml += "<div class=\"giftcard-customer-detail-container\">";
                orderhtml += "<div id=\"popupCustomerName_" + orderId + "\">" + firstName + " " + lastName + "</div>";
                orderhtml += "<div>" + phone + "</div>";
                orderhtml += "<div id=\"popupCustomerEmail_" + orderId + "\" class=\"display-label-wrap\">" + email + "</div>";
                
                //////Delivery Address
                ////if (ordertype == "Delivery") {
                ////    if (address1 != "") {
                ////        orderhtml += "<div class=\"display-label-wrap\" style=\"padding-top:5px;\">" + address1 + "</div>";
                ////    }
                ////    if (address2 != "") {
                ////        orderhtml += "<div class=\"display-label-wrap\">" + address2 + "</div>";
                ////    }
                ////    //if (city != "") {
                ////    //    orderhtml += "<div class=\"display-label-wrap\">" + city + "</div>";
                ////    //}
                ////    if (state != "" && zip != "") {
                ////        if (city != "") {
                ////            orderhtml += "<div class=\"display-label-wrap\">" + city + ", " + state + " " + zip + "</div>";
                ////        }
                ////        else {
                ////            orderhtml += "<div class=\"display-label-wrap\">" + state + " " + zip + "</div>";
                ////        }                        
                ////    }
                ////    else if (state != "" && zip == "") {
                ////        if (city != "") {
                ////            orderhtml += "<div class=\"display-label-wrap\">" + city + ", " + state + "</div>";
                ////        }
                ////        else {
                ////            orderhtml += "<div class=\"display-label-wrap\">" + state + "</div>";
                ////        }
                ////    }
                ////    else if (state == "" && zip != "") {
                ////        if (city != "") {
                ////            orderhtml += "<div class=\"display-label-wrap\">" + city + ", " + zip + "</div>";
                ////        }
                ////        else {
                ////            orderhtml += "<div class=\"display-label-wrap\">" + zip + "</div>";
                ////        }
                ////    }
                ////}
                orderhtml += "</div>";
                orderhtml += "</div>";
                /*------------------Customer Info-----------------------*/
                /*------------------Order Info-----------------------*/
                orderhtml += "<div class=\"giftcard-item-count-new\">";
                orderhtml += "<div class=\"giftcard-customer-detail-container\">";
                orderhtml += "<div><div class=\"giftcard-price popup-carryout-details-long\" id=\"popupOrderPrice_" + orderId + "\">" + ordertotalvalue + "</div>";

                if (numberOfItems == 1)
                    orderhtml += "<div>1 item ";
                else
                    orderhtml += "<div>" + numberOfItems + " items ";
                if (paymentMethod == "Cash On Delivery") {
                    orderhtml += "<span class=\"cc-number\">Due on Pickup</span>";
                }
                else {
                    if (cardNumber != "") {
                        $("#lblPaymentValue").html("PAID, CC ending in " + cardNumber);
                        orderhtml += "<span class=\"cc-number\">PAID, ";
                        orderhtml += "<span class=\"cc-number\"> CC " + cardNumber + "</span></span>";
                    }
                    else {
                        orderhtml += "<span class=\"cc-number\">PAID</span>";
                    }
                }
                orderhtml += "</div>";

                orderhtml += "</div>";


                orderhtml += "</div>";
                orderhtml += "</div>";

                /*------------------Order Info-----------------------*/


                orderhtml += "</div>";


                //New Customer Address Area - Start - 08.30.2019

                orderhtml += "<div class=\"order-row-container\">";
                orderhtml += "<div class=\"giftcard-customer\" style=\"width:100%;\">";
                orderhtml += "<div class=\"giftcard-customer-detail-container\">";
                                
                //Delivery Address
                if (ordertype == "Delivery") {
                    var customerFinalAddress = "";
                    if (address1 != "") {
                        customerFinalAddress += address1;
                        ////orderhtml += "<div class=\"display-label-wrap\" style=\"padding-top:5px;\">" + address1 + "</div>";
                    }
                    if (address2 != "") {
                        if (customerFinalAddress != "") {
                            customerFinalAddress += ", " + address2;
                        }
                        else {
                            customerFinalAddress += address2;
                        }
                        ////orderhtml += "<div class=\"display-label-wrap\">" + address2 + "</div>";
                    }
                    //if (city != "") {
                    //    orderhtml += "<div class=\"display-label-wrap\">" + city + "</div>";
                    //}
                    if (state != "" && zip != "") {
                        if (city != "") {
                            if (customerFinalAddress != "") {
                                customerFinalAddress += ", " + city + ", " + state + " " + zip;
                            }
                            else {
                                customerFinalAddress += city + ", " + state + " " + zip;
                            }
                            ////orderhtml += "<div class=\"display-label-wrap\">" + city + ", " + state + " " + zip + "</div>";
                        }
                        else {
                            if (customerFinalAddress != "") {
                                customerFinalAddress += ", " + city + ", " + zip;
                            }
                            else {
                                customerFinalAddress += city + ", " + zip;
                            }
                            //orderhtml += "<div class=\"display-label-wrap\">" + state + " " + zip + "</div>";
                        }
                    }
                    else if (state != "" && zip == "") {
                        if (city != "") {
                            if (customerFinalAddress != "") {
                                customerFinalAddress += ", " + city + ", " + state;
                            }
                            else {
                                customerFinalAddress += city + ", " + state;
                            }
                            ////orderhtml += "<div class=\"display-label-wrap\">" + city + ", " + state + "</div>";
                        }
                        else {
                            if (customerFinalAddress != "") {
                                customerFinalAddress += ", " + state;
                            }
                            else {
                                customerFinalAddress +=  state;
                            }
                            ////orderhtml += "<div class=\"display-label-wrap\">" + state + "</div>";
                        }
                    }
                    else if (state == "" && zip != "") {
                        if (city != "") {
                            if (customerFinalAddress != "") {
                                customerFinalAddress += ", " + city + ", " + zip;
                            }
                            else {
                                customerFinalAddress += city + ", " + zip;
                            }
                            ////orderhtml += "<div class=\"display-label-wrap\">" + city + ", " + zip + "</div>";
                        }
                        else {
                            if (customerFinalAddress != "") {
                                customerFinalAddress += ", " + zip;
                            }
                            else {
                                customerFinalAddress += zip;
                            }
                            ////orderhtml += "<div class=\"display-label-wrap\">" + zip + "</div>";
                        }
                    }
                    orderhtml += "<div class=\"display-label-wrap\">" + customerFinalAddress + "</div>";
                }

                orderhtml += "</div>";
                orderhtml += "</div>";
                orderhtml += "</div>";

                //New Customer Address Area - End - 08.30.2019
                /*------------------2nd Row-----------------------*/
                orderhtml += "</div>";
                /*------------------Column 2-----------------------*/

                orderhtml += "</div>";
                /*------------------Order Row-----------------------*/


                orderhtml += "</div>";
                if (authorizationCode != null && authorizationCode!="")
                    orderhtml += "<input type=\"hidden\" id=\"hdnAuthorizationId_" + id + "\" value=\"" + authorizationCode + "\"/>";
                else {
                    orderhtml += "<input type=\"hidden\" id=\"hdnAuthorizationId_" + id + "\" value=\"\"/>";
                }
                if (paymentMethod != null)
                    orderhtml += "<input type=\"hidden\" id=\"hdnPaymentmethod_" + id + "\" value=\"" + paymentMethod + "\"/>";
                /*------------------Order Area-----------------------*/

                $("#dvOrderInfo").html(orderhtml);
                //console.log(orderhtml);

            });
            url = global + "/GetCarryOutOrderItemDetails?orderid=" + id;
            $.getJSON(url, function (data) {

                if (data.indexOf("No record(s) found.") > -1) {
                    $("#dvItem").html("No record(s) found.");

                }
                else {
                    html += "<table id=\"tbl_" + id + "\" class=\"table table-striped\" cellspacing=\"0\" cellpadding=\"0\"> ";
                    html += "<thead><tr>";
                    html += "<th style=\"text-align:left;\">Item</th>";
                    html += "<th style=\"text-align:center;\">Qty</th>";
                    html += "<th style=\"text-align:right;\">Price</th>";
                    html += "<th style=\"text-align:right;\">Amount</th>";
                    html += "</tr></thead>";
                    html += "<tbody>";
                    $.each(JSON.parse(data), function (index, value) {

                        if (value.NOTES != "") {
                            html += "<tr><td  style='border-bottom:none !important;font-weight:bold;'>" + value.PRODUCT + "</td>";
                            html += "<td style=\"text-align:center;border-bottom:none !important;\">" + value.QUANTITY + "</td>";
                            html += "<td style=\"text-align:right;border-bottom:none !important;\">" + FormatDecimal(value.UNITPRICE) + "</td>";
                            html += "<td style=\"text-align:right;border-bottom:none !important;\">" + FormatDecimal(value.TOTALPRICE) + "</td>";
                            html += "</tr>";
                            value.NOTES = value.NOTES.replace("Special Instructions", "Notes");

                            var arrNotes = [];
                            if (value.NOTES.indexOf("<strong>") > -1) {
                                arrNotes = value.NOTES.split('<strong>');
                            }
                            if (arrNotes.length > 1) {
                                for (var i = 1; i < arrNotes.length; i++) {
                                    var notesValue = arrNotes[i];

                                    if (i == 1) {
                                        html += "<tr><td colspan='4' style='padding:0 0 0 5px'> <i>" + notesValue.replace("</strong>", "") + "</i>  </td></tr>";
                                    }
                                    else {
                                        html += "<tr><td colspan='4' style='padding:0 0 0 5px'> <i>" + notesValue.replace("</strong>", "") + "</i> </td></tr>";
                                    }
                                }
                            }

                        }
                        else {
                            html += "<tr><td style='font-weight:bold;'>" + value.PRODUCT + "</td>";
                            html += "<td style=\"text-align:center;\">" + value.QUANTITY + "</td>";
                            html += "<td style=\"text-align:right;\">" + FormatDecimal(value.UNITPRICE) + "</td>";
                            html += "<td style=\"text-align:right;\">" + FormatDecimal(value.TOTALPRICE) + "</td>";
                            html += "</tr>";
                        }

                    });
                }
                if (htmlDiscount != "" || htmlRewards != "" || htmlGiftCard != "") {
                    htmlSubTotal = " <tr>";
                    htmlSubTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Subtotal:</td>";
                    htmlSubTotal += "<td style=\"text-align:right;\">" + FormatDecimal(subtotalvalue) + "</td>";
                    htmlSubTotal += "</tr>";

                    htmlOrderTotal = " <tr>";
                    htmlOrderTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Order Total:</td>";
                    htmlOrderTotal += "<td style=\"text-align:right;\">" + grandTotalvalue + "</td>";
                    htmlOrderTotal += "</tr>";
                }
                else {
                    htmlOrderTotal = " <tr>";
                    htmlOrderTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Order Total:</td>";
                    htmlOrderTotal += "<td style=\"text-align:right;\">" + grandTotalvalue + "</td>";
                    htmlOrderTotal += "</tr>";
                }
                if (dueAmount > 0) {
                    $("#dvItem").html(html + htmlSubTotal + htmlDiscount + htmlRewards + htmlGiftCard + htmlOrderTotal + htmlDueAmount + "</tbody>");
                }
                else {
                    $("#dvItem").html(html + htmlSubTotal + htmlDiscount + htmlRewards + htmlGiftCard + htmlOrderTotal + "</tbody>");
                }
                //console.log($("#dvItem").html());
                //alert($("#dvCarryOutDetailsInner").html());
                //alert($("#dvItem").html());
                ////$('#dvDetailsPanel').html($('#carryout #dvCarryOutDetailsInner').html());

            });
            if (currentTabId == 1) {
                var divDetails = $('#dvCarryOutDetailsInner').detach();
                divDetails.appendTo('#divTabCurrentDetails');

            } else if (currentTabId == 3) {
                //$("#divTabAllDetails").html($("#dvCarryOutDetailsInner").html());
                var divDetails = $('#dvCarryOutDetailsInner').detach();
                divDetails.appendTo('#divTabAllDetails');
            }
            $("#divLowerCancelButtonArea").show();

        });

    }

}
function CloseCarryOutDetails() {
    $('#dvCarryOutDetailsInner').hide();
    $('#dvOrderInfo').html("");
    $('#dvItem').html("");
    $("#hdnSelectedOrderId").val("0");
    //$("#dvCarryOutPanel").html("");
}
function BindcarryoutTab(status) {
    ResetFilters('carryout');
    // console.log(status)
    if (status == "All") {

        $('#linkCarryoutFilterIcon').show();

    }
    else {
        $('#linkCarryoutFilterIcon').hide();
    }
    localStorage.setItem("CurrentPage", 0);
    $('#hdnCurrentState').val(status);
    if (status == "New") {
        CarryoutOrdersListCurrent(status, 10, 0, '');
    }
    else {
        CarryoutOrdersList(status, 10, 0, '');
    }    
}

//New Carryout Orders List Binding For Current Tab - Start
//Carryout Orders - Current Tab
function CarryoutOrdersListCurrent(status, carryoutpagesize, carryoutcurrentPage, divId) {

    //Shorting
    var sortValue = "DESC";
    var sortByValue = "";
    var filterStatus = "";
    var orderNoFrom = "";
    var orderNoTo = "";
    var phone = "";
    var orderDateFrom = "";
    var orderDateTo = "";
    //Shorting
    status = $('#hdnCurrentState').val();
    if (status == "New") {
        divId = 'dvNewList';
    }
    else if (status == "Processing") {
        divId = 'dvProcessingList';
    }
    else {
        divId = 'dvAllList';
        sortValue = $("input[name='radioCarryoutSort']:checked").val();
        sortByValue = $("input[name='radioCarryoutSortBy']:checked").val();

        filterStatus = $("#ddlFilterCarryoutStatus").val();
        orderNoFrom = $("#txtFilterOrderNumberFrom").val();
        orderNoTo = $("#txtFilterOrderNumberTo").val();
        phone = $("#txtFilterPhone").val();
        orderDateFrom = $("#txtFilterOrderDateFrom").val();
        orderDateTo = $("#txtFilterOrderDateTo").val();
        //console.log("orderDateFrom: " + orderDateFrom)
        //console.log("orderDateTo: " + orderDateTo)
        //console.log("Sort: "+ sortValue + " By: " + sortByValue + " filter: " + filterStatus + " orderNofrom: " + orderNoFrom + " orderNoTo: " + orderNoTo + " phone: " + phone + " orderDateFrom: "+ orderDateFrom + " dateTo: " + orderDateTo);
        if (sortValue == undefined) {
            sortValue = "";
        }
        if (sortByValue == undefined) {
            sortByValue = "";
        }
        if (filterStatus == undefined) {
            filterStatus = "";
        }
        if (orderNoFrom == undefined) {
            orderNoFrom = "";
        }
        if (orderNoTo == undefined) {
            orderNoTo = "";
        }
        if (phone == undefined) {
            phone = "";
        }
        if (orderDateFrom == undefined) {
            orderDateFrom = "";
        }
        if (orderDateTo == undefined) {
            orderDateTo = "";
        }
    }
    var customerId = 0;
    var storeId = 0;
    currentPage = 0;
    $("#" + divId).html("");
    storeId = SetStoreId();
    customerId = SetCustomerId();
    var firstOrderId = 0;


    if (Number(storeId) > 0) {

        carryoutcurrentPage = Number(carryoutcurrentPage) * Number(carryoutpagesize);
        url = global + "/GetAllCarryOutOrdersTempCurrent?storeid=" + storeId + "&status=" + status + "&pagesize=" + carryoutpagesize + "&currentPage=" + carryoutcurrentPage + "&sortValue=" + sortValue + "&sortByValue=" + sortByValue +
            "&filterStatus=" + filterStatus + "&orderNoFrom=" + orderNoFrom + "&orderNoTo=" + orderNoTo + "&phone=" + phone + "&orderDateFrom=" + orderDateFrom + "&orderDateTo=" + orderDateTo;

        try {

            $.getJSON(url, function (data) {
                $('#loader_msg').html("");
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;

                if (JSON.parse(data).indexOf("No order(s) found") < 0) {
                    localStorage.setItem("OrderAvailable", "1");
                    var count = 0;
                    $.each(JSON.parse(data), function (index, value) {
                        if (index == 0) {
                            firstOrderId = value.ID;
                            OpenCarryoutDetails(firstOrderId);
                        }
                        var orderDate = "";
                        var orderTime = "";
                        var firstName = "";
                        var lastName = "";
                        var email = "";
                        var phone = "";
                        var paymentMethod = "";
                        var cardNumber = "";
                        var ordertotal = "";
                        var buttonHTML = "";
                        var subTotal = 0.00;
                        var grandTotal = 0.00;
                        var discount = 0.00;
                        var ordertype = "";
                        if (value.ORDERTYPE != "") {
                            ordertype = value.ORDERTYPE;
                        }
                        if (value.SUBTOTAL != "") {
                            subTotal = value.SUBTOTAL;
                        }
                        if (value.ORDERDISCOUNT != "") {
                            discount = value.ORDERDISCOUNT;
                        }

                        //if (value.ORDERTOTAL != "") {
                        //    grandTotal = value.ORDERTOTAL;
                        //    if(Number(grandTotal)!=Number(subTotal))
                        //    {
                        //        ordertotal = FormatDecimal(Number(subTotal) - Number(discount));
                        //    }
                        //    else {
                        //        ordertotal = FormatDecimal(grandTotal);
                        //    }
                        //}

                        //else {
                        grandTotal = value.ORDERTOTAL;

                        if (Number(grandTotal) != Number(subTotal)) {
                            ordertotal = FormatDecimal(Number(subTotal) - Number(discount));
                        }
                        else {
                            ordertotal = FormatDecimal(grandTotal);
                        }
                        //ordertotal = "$0.00";
                        //}
                        if (value.CREATEDONUTC != null && value.CREATEDONUTC != undefined) {
                            var arrDateTime = value.CREATEDONUTC.split('~');
                            var orderDate = arrDateTime[0];
                            var orderTime = arrDateTime[1];
                        }
                        if (value.FIRSTNAME != "") {
                            firstName = value.FIRSTNAME;
                        }
                        else {
                            firstName = value.BILLINGFIRSTNAME;
                        }

                        if (value.LASTNAME != "") {
                            lastName = value.LASTNAME;
                        }
                        else {
                            lastName = value.BILLINGLASTNAME;
                        }

                        if (value.EMAIL != "" && value.EMAIL != undefined) {
                            email = value.EMAIL;
                        }
                        else {
                            email = value.BILLINGEMAIL;
                        }

                        if (value.PHONE != "") {
                            phone = value.PHONE;
                        }
                        else {
                            phone = value.BILLINGPHONE;
                        }
                        if (phone.length == 10)
                            phone = FormatPhoneNumber(phone);
                        if (value.PAYMENTMETHOD != "" && value.PAYMENTMETHOD != undefined) {
                            paymentMethod = value.PAYMENTMETHOD;
                            //console.log("#: " + value.ID + " " + paymentMethod);
                        }
                        if (value.CARDNUMBER != "" && value.CARDNUMBER != undefined) {
                            cardNumber = value.CARDNUMBER;
                        }
                        /*------------------Order Area-----------------------*/

                        var html = "<div class=\"order-container\"  id='li_" + value.ID + "' style=\"height:75px;\">";


                        /*------------------Order Row-----------------------*/

                        html += "<div id=\"dvOrderInner_" + value.ID + "\" class=\"order-list-carryout\"  data-popup=\".popup-details\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\">";

                        /*------------------Column 1-----------------------*/

                        ////////html += "<div class=\"order-column-one\" >";
                        /*------------------Status Icon--------------------*/
                        ////if (status == '' || status == "All") {
                        ////    if (value.ORDERSTATUSID.toLowerCase() == "new") {
                        ////        //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></div>";
                        ////        html += "<div class=\"dropdown\" id=\"carryoutstatus_" + value.ID + "\">";
                        ////        html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></button>";
                        ////        html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('PickedUp'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        ////        html += "</div>";
                        ////        html += "</div>";
                        ////    }
                        ////    else if (value.ORDERSTATUSID.toLowerCase() == "processing") {
                        ////        // html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></div>";

                        ////        html += "<div class=\"dropdown\" id=\"carryoutstatus_" + value.ID + "\">";
                        ////        html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></button>";
                        ////        html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        ////        html += "<a class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        ////        html += "<a  onclick=\"ChangeOrderStatusDropdown('PickedUp'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        ////        html += "</div>";
                        ////        html += "</div>";
                        ////    }
                        ////    else if (value.ORDERSTATUSID.toLowerCase() == "complete") {
                        ////        // html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></div>";
                        ////        html += "<div class=\"dropdown\" id=\"carryoutstatus_" + value.ID + "\">";
                        ////        html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                        ////        html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        ////        html += "<a class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        ////        html += "<a  onclick=\"ChangeOrderStatusDropdown('PickedUp'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        ////        html += "</div>";
                        ////        html += "</div>";
                        ////    }
                        ////    else if (value.ORDERSTATUSID.toLowerCase() == "pickedup") {
                        ////        //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                        ////        html += "<div class=\"dropdown\" id=\"carryoutstatus_" + value.ID + "\">";
                        ////        html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                        ////        html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        ////        html += "<a class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        ////        html += "</div>";
                        ////        html += "</div>";
                        ////    }
                        ////    else if (value.ORDERSTATUSID.toLowerCase() == "cancelled") {
                        ////        //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                        ////        html += "<div class=\"dropdown\" id=\"carryoutstatus_" + value.ID + "\">";
                        ////        html += "<button id=\"btnStatusChange\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/cancel.png\" alt=\"\"/></button>";
                        ////        html += "</div>";
                        ////    }
                        ////}

                        /*-----------------Status Icon End----------------*/

                        //html += "<div class=\"order-number-carryout panel-open\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\">#" + value.ID + "<span></div>";
                        html += "<div class=\"order-number-carryout\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\" style=\"font-size: 18px; white-space: nowrap;\">" + firstName + " " + lastName + "</div>";

                        if (value.PICKUPTIME != undefined) {
                            var pickupdatetime = value.PICKUPTIME;

                            if (ordertype == "Carry Out") {
                                ////if (status == '' || status == "All")
                                html += "<div class=\"order-pickup-new\">" + pickupdatetime + "</div>";
                                ////else
                                ////    html += "<div class=\"order-pickup  order-pickup-margin-top\" style=\"margin-top:22px;\">" + pickupdatetime + "</div>";
                            }
                                //For Delivery Orders - Start//
                            else if (ordertype == "Delivery") {
                                ////if (status == '' || status == "All")
                                html += "<div class=\"order-pickup-new\" style=\"color: #e95861;\">" + pickupdatetime + "</div>";
                                ////else
                                ////    html += "<div class=\"order-pickup  order-pickup-margin-top\" style=\"margin-top:22px; color: #e95861;\">" + pickupdatetime + "</div>";
                            }//For Delivery Orders - End//
                            else {
                                if (pickupdatetime.indexOf("@") > -1) {
                                    var pickupDate = pickupdatetime.split('@')[0].trim();
                                    var pickupTime = pickupdatetime.split('@')[1].trim();
                                    if (status == '' || status == "All")
                                        html += "<div class=\"order-pickup-new\"><div>" + pickupTime + "</div><div class=\"order-pickup-time\">" + pickupDate + "</div></div>";
                                    else
                                        html += "<div class=\"order-pickup-new  order-pickup-margin-top\" style=\"margin-top:4px;\"><div>" + pickupTime + "</div><div class=\"order-pickup-time\">" + pickupDate + "</div></div>";
                                }
                                else {
                                    ////if (status == '' || status == "All")
                                    html += "<div class=\"order-pickup-new\">" + pickupdatetime + "</div>";
                                    ////else
                                    ////    html += "<div class=\"order-pickup  order-pickup-margin-top\" style=\"margin-top:22px;\">" + pickupdatetime + "</div>";
                                }
                            }

                        }
                        //else {
                        //  if (status == '' || status == "All")
                        //      html += "<div class=\"order-pickup\"></div>";
                        //  else

                        //      html += "<div class=\"order-pickup order-pickup-margin-top\"></div>";
                        //  }


                        ////////html += "</div>";
                        /*------------------Column 1-----------------------*/
                        /*------------------Column 2-----------------------*/
                        ////////html += "<div class=\"order-column-two\">";
                        /*------------------1st Row-----------------------*/
                        ////////html += "<div class=\"order-row-container\">";
                        ////html += "<div class=\"order-number panel-open\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\">#" + value.ID + "<span> on </span><span>" + orderDate + " @ " + orderTime + "</span></div>";
                        ////html += "<div class=\"order-number-carryout panel-open\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\">#" + value.ID + "<span></div>";
                        /*------------------Button Row-----------------------*/
                        ////if (status == '' || status == "All") {

                        ////if (value.ORDERSTATUSID != "New" && value.ORDERSTATUSID != "Cancelled" ) {
                        ////        //console.log('value.ORDERPICKUPSMSSENTON: ' + value.ORDERPICKUPSMSSENTON)
                        ////        if (value.ORDERPICKUPSMSSENTON != undefined && value.ORDERPICKUPSMSSENTON != null && value.ORDERPICKUPSMSSENTON.trim()!= "") {
                        ////           // console.log('value.ORDERPICKUPSMSSENTON: '+value.ORDERPICKUPSMSSENTON)
                        ////            buttonHTML += "<a><img src=\"./img/icons/pickup_sms_button_active.png\" class=\"grid-small-icon\"/></a>";

                        ////        }
                        ////        else {
                        ////            buttonHTML += "<a onclick=\"ConfirmationPickUpSMSSend(" + value.ID + ",'" + phone + "','Grid','" + ordertotal + "')\"  id=\"btnPickUpSMS_" + value.ID + "\"><img id=\"imgPickUpSMS_" + value.ID + "\" src=\"./img/icons/pickup_sms_button.png\" class=\"grid-small-icon\" /></a>";
                        ////        }
                        ////    } 
                        ////else if (value.ORDERSTATUSID == "New")
                        ////{
                        ////        buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnAccept\"><img src=\"./img/icons/accept_button.png\" style=\"width:41%;float: right;margin-right:23px;\" /></a>";
                        ////    }
                        ////    html += "<div class=\"order-buttons\" id=\"dvCarryOutButtons_" + value.ID + "\">";
                        ////    html += buttonHTML;
                        ////    html += "</div>";
                        ////}
                        ////else if (status=='New') {
                        ////    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnAccept\"><img src=\"./img/icons/accept_button.png\" style=\"width:41%;float: right;margin-right:23px;\" /></a>";
                        ////    buttonHTML += "<a style=\"display:none;\" onclick=\"ConfirmationPickUpSMSSend(" + value.ID + ",'" + phone + "','Grid','" + ordertotal + "')\"  id=\"btnPickUpSMS_" + value.ID + "\"><img id=\"imgPickUpSMS_" + value.ID + "\" src=\"./img/icons/pickup_sms_button.png\" class=\"grid-small-icon\" /></a>";
                        ////    html += "<div class=\"order-buttons\" id=\"dvCarryOutButtons_" + value.ID + "\">";
                        ////    html += buttonHTML;
                        ////    html += "</div>";
                        ////}
                        /*------------------Button Row-----------------------*/
                        ////////html += "</div>";
                        /*------------------1st Row-----------------------*/

                        /*------------------2nd Row-----------------------*/
                        ////////html += "<div class=\"order-row-container\" >";

                        /*------------------Customer Info-----------------------*/
                        ////html += "<div class=\"order-date order-payment-info\">";
                        ////html += "<div class=\"customer-detail-container panel-open\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\">";
                        ////html += "<div class=\"customer-name\">" + firstName + " " + lastName + "</div>";
                        ////html += "<div id=\"customerphone_" + value.ID + "\">" + phone + "</div>";
                        //////html += "<div class=\"display-label-wrap\">" + email + "</div>";
                        ////html += "</div>";
                        ////html += "</div>";
                        /*------------------Customer Info-----------------------*/
                        /*------------------Order Info-----------------------*/
                        ////html += "<div class=\"order-items-count\" style=\"width:25%;\">";

                        ////html += "<div class=\"customer-detail-container\" id=\"dvPickUpSMSGrid_" + value.ID + "\">";

                        ////html += "<div class=\"order-price\" id=\"orderprice_" + value.ID + "\">" + ordertotal + "</div>";
                        ////if (value.NOOFITEMS == 1) {
                        ////    html += "<div>1 item ";
                        ////}
                        ////else {
                        ////    html += "<div>" + value.NOOFITEMS + " items ";
                        ////}
                        ////if (paymentMethod == "Cash On Delivery") {
                        ////    html += "<span class=\"cc-number\">Due on Pickup</span>";
                        ////}
                        ////else {
                        ////    html += "<span class=\"cc-number\">PAID</span>";
                        ////}
                        ////html += "</div>";

                        ////html += "</div>";//end customer-detail-container div
                        ////html += "</div>";//end order-items-count div
                        /*------------------Order Info-----------------------*/


                        ////////html += "</div>";
                        /*------------------2nd Row-----------------------*/
                        html += "</div>";
                        /*------------------Column 2-----------------------*/

                        html += "</div>";
                        /*------------------Order Row-----------------------*/



                        html += "</div>";
                        /*------------------Order Area-----------------------*/

                        count++;
                        //console.log(html)
                        $("#" + divId).append(html);


                    });
                }
                else {
                    localStorage.setItem("OrderAvailable", "0");
                    var html = "<div class=\"order-list list-empty-label-text\">No Orders</div>";

                    $("#" + divId).html(html);

                }
            });


        }
        catch (e) {
        }
    }
    else {
        self.app.router.navigate('/login_new/', { reloadCurrent: false });
    }
}

//Carryout Orders Pagination - Current Tab
function CarryoutOrdersListPaginationCurrent(status, carryoutpagesize, carryoutcurrentPage, divId) {
    //Shorting
    var sortValue = "DESC";
    var sortByValue = "";
    var filterStatus = "";
    var orderNoFrom = "";
    var orderNoTo = "";
    var phone = "";
    var orderDateFrom = "";
    var orderDateTo = "";
    //Shorting

    var customerId = 0;
    var storeId = 0;
    var status = $('#hdnCurrentState').val();
    if (status == "New") {
        divId = 'dvNewList';
    }
    else if (status == "Processing") {
        divId = 'dvProcessingList';
    }
    else {
        divId = 'dvAllList';
        sortValue = $("input[name='radioCarryoutSort']:checked").val();
        sortByValue = $("input[name='radioCarryoutSortBy']:checked").val();

        filterStatus = $("#ddlFilterCarryoutStatus").val();
        orderNoFrom = $("#txtFilterOrderNumberFrom").val();
        orderNoTo = $("#txtFilterOrderNumberTo").val();
        phone = $("#txtFilterPhone").val();
        orderDateFrom = $("#txtFilterOrderDateFrom").val();
        orderDateTo = $("#txtFilterOrderDateTo").val();

        //console.log("Sort: "+ sortValue + " By: " + sortByValue + " filter: " + filterStatus + " orderNofrom: " + orderNoFrom + " orderNoTo: " + orderNoTo + " phone: " + phone + " orderDateFrom: "+ orderDateFrom + " dateTo: " + orderDateTo);
        if (sortValue == undefined) {
            sortValue = "";
        }
        if (sortByValue == undefined) {
            sortByValue = "";
        }
        if (filterStatus == undefined) {
            filterStatus = "";
        }
        if (orderNoFrom == undefined) {
            orderNoFrom = "";
        }
        if (orderNoTo == undefined) {
            orderNoTo = "";
        }
        if (phone == undefined) {
            phone = "";
        }
        if (orderDateFrom == undefined) {
            orderDateFrom = "";
        }
        if (orderDateTo == undefined) {
            orderDateTo = "";
        }
    }

    storeId = SetStoreId();
    customerId = SetCustomerId();
    if (Number(storeId) > 0) {

        carryoutcurrentPage = Number(carryoutcurrentPage) * Number(carryoutpagesize);
        url = global + "/GetAllCarryOutOrdersTempCurrent?storeid=" + storeId + "&status=" + status + "&pagesize=" + carryoutpagesize + "&currentPage=" + carryoutcurrentPage + "&sortValue=" + sortValue + "&sortByValue=" + sortByValue +
            "&filterStatus=" + filterStatus + "&orderNoFrom=" + orderNoFrom + "&orderNoTo=" + orderNoTo + "&phone=" + phone + "&orderDateFrom=" + orderDateFrom + "&orderDateTo=" + orderDateTo;
        if (status.toLowerCase().trim() == "new") {

            $("#dvNew").attr("class", "active");
            $("#dvPending").removeAttr("class");
            $("#dvAll").removeAttr("class");


        }
        else if (status.toLowerCase().trim() == "processing") {

            $("#dvPending").attr("class", "active");
            $("#dvNew").removeAttr("class");
            $("#dvAll").removeAttr("class");
        }
        else {

            $("#dvAll").attr("class", "active");
            $("#dvPending").removeAttr("class");
            $("#dvNew").removeAttr("class");

        }
        try {

            $.getJSON(url, function (data) {
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;


                $('#loader_msg').html("");
                if (JSON.parse(data).indexOf("No order(s) found") < 0) {
                    localStorage.setItem("OrderAvailable", "1");
                    var count = 0;
                    $.each(JSON.parse(data), function (index, value) {

                        var orderDate = "";
                        var orderTime = "";
                        var firstName = "";
                        var lastName = "";
                        var email = "";
                        var phone = "";
                        var paymentMethod = "";
                        var cardNumber = "";
                        var ordertotal = "";
                        var buttonHTML = "";
                        var subTotal = 0.00;
                        var grandTotal = 0.00;
                        var discount = 0.00;
                        var ordertype = "";
                        if (value.ORDERTYPE != "") {
                            ordertype = value.ORDERTYPE;
                        }
                        if (value.SUBTOTAL != "") {
                            subTotal = value.SUBTOTAL;
                        }
                        if (value.ORDERDISCOUNT != "") {
                            discount = value.ORDERDISCOUNT;
                        }

                        grandTotal = value.ORDERTOTAL;

                        if (Number(grandTotal) != Number(subTotal)) {
                            ordertotal = FormatDecimal(Number(subTotal) - Number(discount));
                        }
                        else {
                            ordertotal = FormatDecimal(grandTotal);
                        }
                        if (value.CREATEDONUTC != null && value.CREATEDONUTC != undefined) {
                            var arrDateTime = value.CREATEDONUTC.split('~');
                            var orderDate = arrDateTime[0];
                            var orderTime = arrDateTime[1];
                        }
                        if (value.FIRSTNAME != "") {
                            firstName = value.FIRSTNAME;
                        }
                        else {
                            firstName = value.BILLINGFIRSTNAME;
                        }

                        if (value.LASTNAME != "") {
                            lastName = value.LASTNAME;
                        }
                        else {
                            lastName = value.BILLINGLASTNAME;
                        }

                        if (value.EMAIL != "" && value.EMAIL != undefined) {
                            email = value.EMAIL;
                        }
                        else {
                            email = value.BILLINGEMAIL;
                        }

                        if (value.PHONE != "") {
                            phone = value.PHONE;
                        }
                        else {
                            phone = value.BILLINGPHONE;
                        }
                        if (phone.length == 10)
                            phone = FormatPhoneNumber(phone);
                        if (value.PAYMENTMETHOD != "" && value.PAYMENTMETHOD != undefined) {
                            paymentMethod = value.PAYMENTMETHOD;
                        }
                        if (value.CardNumber != "" && value.CardNumber != undefined) {
                            cardNumber = value.CardNumber;
                        }
                        /*------------------Order Area-----------------------*/

                        var html = "<div class=\"order-container\"  id='li_" + value.ID + "' style=\"height:75px;\">";


                        /*------------------Order Row-----------------------*/

                        html += "<div id=\"dvOrderInner_" + value.ID + "\" class=\"order-list-carryout\"  data-popup=\".popup-details\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\">";

                        /*------------------Column 1-----------------------*/

                        ////////html += "<div class=\"order-column-one\" >";
                        /*------------------Status Icon--------------------*/
                        ////if (status == '' || status == "All") {
                        ////    if (value.ORDERSTATUSID.toLowerCase() == "new") {
                        ////        //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></div>";
                        ////        html += "<div class=\"dropdown\" id=\"carryoutstatus_" + value.ID + "\">";
                        ////        html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></button>";
                        ////        html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('PickedUp'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        ////        html += "</div>";
                        ////        html += "</div>";
                        ////    }
                        ////    else if (value.ORDERSTATUSID.toLowerCase() == "processing") {
                        ////        // html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></div>";

                        ////        html += "<div class=\"dropdown\" id=\"carryoutstatus_" + value.ID + "\">";
                        ////        html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></button>";
                        ////        html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        ////        html += "<a class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        ////        html += "<a  onclick=\"ChangeOrderStatusDropdown('PickedUp'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        ////        html += "</div>";
                        ////        html += "</div>";
                        ////    }
                        ////    else if (value.ORDERSTATUSID.toLowerCase() == "complete") {
                        ////        // html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></div>";
                        ////        html += "<div class=\"dropdown\" id=\"carryoutstatus_" + value.ID + "\">";
                        ////        html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                        ////        html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        ////        html += "<a class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        ////        html += "<a  onclick=\"ChangeOrderStatusDropdown('PickedUp'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        ////        html += "</div>";
                        ////        html += "</div>";
                        ////    }
                        ////    else if (value.ORDERSTATUSID.toLowerCase() == "pickedup") {
                        ////        //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                        ////        html += "<div class=\"dropdown\" id=\"carryoutstatus_" + value.ID + "\">";
                        ////        html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                        ////        html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        ////        html += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + value.ID + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        ////        html += "<a class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        ////        html += "</div>";
                        ////        html += "</div>";
                        ////    }
                        ////    else if (value.ORDERSTATUSID.toLowerCase() == "cancelled") {
                        ////        //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                        ////        html += "<div class=\"dropdown\" id=\"carryoutstatus_" + value.ID + "\">";
                        ////        html += "<button id=\"btnStatusChange\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/cancel.png\" alt=\"\"/></button>";
                        ////        html += "</div>";
                        ////    }
                        ////}

                        /*-----------------Status Icon End----------------*/

                        //html += "<div class=\"order-number-carryout panel-open\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\">#" + value.ID + "<span></div>";
                        html += "<div class=\"order-number-carryout\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\" style=\"font-size: 18px; white-space: nowrap;\">" + firstName + " " + lastName + "</div>";

                        if (value.PICKUPTIME != undefined) {
                            var pickupdatetime = value.PICKUPTIME;

                            if (ordertype == "Carry Out") {
                                ////if (status == '' || status == "All")
                                html += "<div class=\"order-pickup-new\">" + pickupdatetime + "</div>";
                                ////else
                                ////    html += "<div class=\"order-pickup  order-pickup-margin-top\" style=\"margin-top:22px;\">" + pickupdatetime + "</div>";
                            }
                                //For Delivery Orders - Start//
                            else if (ordertype == "Delivery") {
                                ////if (status == '' || status == "All")
                                html += "<div class=\"order-pickup-new\" style=\"color: #e95861;\">" + pickupdatetime + "</div>";
                                ////else
                                ////    html += "<div class=\"order-pickup  order-pickup-margin-top\" style=\"margin-top:22px; color: #e95861;\">" + pickupdatetime + "</div>";
                            }//For Delivery Orders - End//
                            else {
                                if (pickupdatetime.indexOf("@") > -1) {
                                    var pickupDate = pickupdatetime.split('@')[0].trim();
                                    var pickupTime = pickupdatetime.split('@')[1].trim();
                                    if (status == '' || status == "All")
                                        html += "<div class=\"order-pickup-new\"><div>" + pickupTime + "</div><div class=\"order-pickup-time\">" + pickupDate + "</div></div>";
                                    else
                                        html += "<div class=\"order-pickup-new  order-pickup-margin-top\" style=\"margin-top:4px;\"><div>" + pickupTime + "</div><div class=\"order-pickup-time\">" + pickupDate + "</div></div>";
                                }
                                else {
                                    ////if (status == '' || status == "All")
                                    html += "<div class=\"order-pickup-new\">" + pickupdatetime + "</div>";
                                    ////else
                                    ////    html += "<div class=\"order-pickup  order-pickup-margin-top\" style=\"margin-top:22px;\">" + pickupdatetime + "</div>";
                                }
                            }

                        }
                        //else {
                        //  if (status == '' || status == "All")
                        //      html += "<div class=\"order-pickup\"></div>";
                        //  else

                        //      html += "<div class=\"order-pickup order-pickup-margin-top\"></div>";
                        //  }


                        ////////html += "</div>";
                        /*------------------Column 1-----------------------*/
                        /*------------------Column 2-----------------------*/
                        ////////html += "<div class=\"order-column-two\">";
                        /*------------------1st Row-----------------------*/
                        ////////html += "<div class=\"order-row-container\">";
                        ////html += "<div class=\"order-number panel-open\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\">#" + value.ID + "<span> on </span><span>" + orderDate + " @ " + orderTime + "</span></div>";
                        ////html += "<div class=\"order-number-carryout panel-open\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\">#" + value.ID + "<span></div>";
                        /*------------------Button Row-----------------------*/
                        ////if (status == '' || status == "All") {

                        ////if (value.ORDERSTATUSID != "New" && value.ORDERSTATUSID != "Cancelled" ) {
                        ////        //console.log('value.ORDERPICKUPSMSSENTON: ' + value.ORDERPICKUPSMSSENTON)
                        ////        if (value.ORDERPICKUPSMSSENTON != undefined && value.ORDERPICKUPSMSSENTON != null && value.ORDERPICKUPSMSSENTON.trim()!= "") {
                        ////           // console.log('value.ORDERPICKUPSMSSENTON: '+value.ORDERPICKUPSMSSENTON)
                        ////            buttonHTML += "<a><img src=\"./img/icons/pickup_sms_button_active.png\" class=\"grid-small-icon\"/></a>";

                        ////        }
                        ////        else {
                        ////            buttonHTML += "<a onclick=\"ConfirmationPickUpSMSSend(" + value.ID + ",'" + phone + "','Grid','" + ordertotal + "')\"  id=\"btnPickUpSMS_" + value.ID + "\"><img id=\"imgPickUpSMS_" + value.ID + "\" src=\"./img/icons/pickup_sms_button.png\" class=\"grid-small-icon\" /></a>";
                        ////        }
                        ////    } 
                        ////else if (value.ORDERSTATUSID == "New")
                        ////{
                        ////        buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnAccept\"><img src=\"./img/icons/accept_button.png\" style=\"width:41%;float: right;margin-right:23px;\" /></a>";
                        ////    }
                        ////    html += "<div class=\"order-buttons\" id=\"dvCarryOutButtons_" + value.ID + "\">";
                        ////    html += buttonHTML;
                        ////    html += "</div>";
                        ////}
                        ////else if (status=='New') {
                        ////    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnAccept\"><img src=\"./img/icons/accept_button.png\" style=\"width:41%;float: right;margin-right:23px;\" /></a>";
                        ////    buttonHTML += "<a style=\"display:none;\" onclick=\"ConfirmationPickUpSMSSend(" + value.ID + ",'" + phone + "','Grid','" + ordertotal + "')\"  id=\"btnPickUpSMS_" + value.ID + "\"><img id=\"imgPickUpSMS_" + value.ID + "\" src=\"./img/icons/pickup_sms_button.png\" class=\"grid-small-icon\" /></a>";
                        ////    html += "<div class=\"order-buttons\" id=\"dvCarryOutButtons_" + value.ID + "\">";
                        ////    html += buttonHTML;
                        ////    html += "</div>";
                        ////}
                        /*------------------Button Row-----------------------*/
                        ////////html += "</div>";
                        /*------------------1st Row-----------------------*/

                        /*------------------2nd Row-----------------------*/
                        ////////html += "<div class=\"order-row-container\" >";

                        /*------------------Customer Info-----------------------*/
                        ////html += "<div class=\"order-date order-payment-info\">";
                        ////html += "<div class=\"customer-detail-container panel-open\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\">";
                        ////html += "<div class=\"customer-name\">" + firstName + " " + lastName + "</div>";
                        ////html += "<div id=\"customerphone_" + value.ID + "\">" + phone + "</div>";
                        //////html += "<div class=\"display-label-wrap\">" + email + "</div>";
                        ////html += "</div>";
                        ////html += "</div>";
                        /*------------------Customer Info-----------------------*/
                        /*------------------Order Info-----------------------*/
                        ////html += "<div class=\"order-items-count\" style=\"width:25%;\">";

                        ////html += "<div class=\"customer-detail-container\" id=\"dvPickUpSMSGrid_" + value.ID + "\">";

                        ////html += "<div class=\"order-price\" id=\"orderprice_" + value.ID + "\">" + ordertotal + "</div>";
                        ////if (value.NOOFITEMS == 1) {
                        ////    html += "<div>1 item ";
                        ////}
                        ////else {
                        ////    html += "<div>" + value.NOOFITEMS + " items ";
                        ////}
                        ////if (paymentMethod == "Cash On Delivery") {
                        ////    html += "<span class=\"cc-number\">Due on Pickup</span>";
                        ////}
                        ////else {
                        ////    html += "<span class=\"cc-number\">PAID</span>";
                        ////}
                        ////html += "</div>";

                        ////html += "</div>";//end customer-detail-container div
                        ////html += "</div>";//end order-items-count div
                        /*------------------Order Info-----------------------*/


                        ////////html += "</div>";
                        /*------------------2nd Row-----------------------*/
                        html += "</div>";
                        /*------------------Column 2-----------------------*/

                        html += "</div>";
                        /*------------------Order Row-----------------------*/



                        html += "</div>";
                        /*------------------Order Area-----------------------*/

                        count++;

                        $("#" + divId).append(html);


                    });


                }
                else {
                    localStorage.setItem("OrderAvailable", "0");

                }



            });

        }
        catch (e) {
        }
    }
    else {
        self.app.router.navigate('/login_new/', { reloadCurrent: false });
    }

}

//New Carryout Orders List Binding For Current Tab - End


//Send Pick Up SMS to Customer
function ConfirmationPickUpSMSSend(orderId, customerphone, source, orderTotal) {

    var storeId = 0;
    var restaurantDisplayName = "";
    storeId = SetStoreId();
    //orderId = Number($("#hdnSelectedOrderId").val());
    if (storeId > 0 && orderId > 0) {


        swal({
            title: 'Would you like to send a Pickup SMS to the Customer?',
            //text: "You will not be able to recover this imaginary file!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3b9847',
            cancelButtonColor: '#e95861',
            confirmButtonText: 'Yes',
            cancelButtonText: "No",
            closeOnConfirm: false,
            closeOnCancel: true
        }).then(result => {
            if (result.value) {
                // handle Confirm button click
                SendPickUpSMSToCustomer(orderId, customerphone, source, orderTotal)

                // result.value will contain `true` or the input value
            } else {
                // handle dismissals
                // result.dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
            }
        });


    }
    else if (storeId == 0) {
        self.app.router.navigate('/login_new/', { reloadCurrent: false });
    }
}
function SendPickUpSMSToCustomer(orderId, customerphone, source, orderTotal) {

    var storeId = 0;
    var restaurantDisplayName = "";
    storeId = SetStoreId();
    if (storeId > 0 && orderId > 0) {
        $("#btnPickupSMS_" + orderId).attr("disabled", "disabled");
        if (window.localStorage.getItem("RestaurantName") != null)
            restaurantDisplayName = window.localStorage.getItem("RestaurantName").trim();
        if (customerphone != undefined && customerphone != null && customerphone != "") {
            customerphone = customerphone.trim().replace("(", "").replace(")", "").replace("-", "").replace(".", "").replace(" ", "");
        }
        $.ajax({
            url: global + 'SendPickUpSMSToCustomer?storeid=' + storeId + '&orderId=' + orderId + "&restaurantDisplayName=" + restaurantDisplayName + "&customerphone=" + customerphone,
            type: 'GET',
            datatype: 'jsonp',
            contenttype: "application/json",
            crossDomain: true,
            async: false,
            success: function (response) {
               
                
                var data = JSON.parse(response);
                if (data.Message.indexOf("successfully") > -1) {
                    $("#btnPickupSMS_" + orderId).removeAttr("disabled");
                    $("#btnPickupSMS_" + orderId).removeAttr("onclick");
                    $("#imgPickUpSMS_" + orderId).removeAttr("src");
                    $("#imgPickUpSMS_" + orderId).attr("src", "./img/icons/pickup_sms_button_active.png");

                    $("#aPopupSMS_" + orderId).removeAttr("disabled");
                    $("#imgPopupSMS_" + orderId).removeAttr("onclick");
                    $("#imgPopupSMS_" + orderId).removeAttr("src");
                    $("#imgPopupSMS_" + orderId).attr("src", "./img/icons/pickup_sms_button_active.png");
                    if (data.SMSSentOn != "") {
                        if (data.SMSSentOn.indexOf("@")) {
                            var arrSMSSentTime = data.SMSSentOn.split('@');
                            if (source.toLowerCase() == "popup") {

                                $("#imgPopupSMS_" + orderId).removeAttr("src");
                                $("#imgPopupSMS_" + orderId).attr("src", "./img/icons/pickup_sms_button_active.png");
                                $("#imgPopupSMS_" + orderId).removeAttr("onclick");

                                $("#hdnSelectedOrderPickUpSMSSentTime").val(arrSMSSentTime[0].trim() + "#" + arrSMSSentTime[1].trim());
                                $("#dvPickUpSMSSentTime_" + orderId).show();
                                $("#dvPickUpSMSSentTime_" + orderId).html("Pickup SMS sent<br/>" + data.SMSSentOn);
                            }
                            else {


                                $("#imgPickUpSMS_" + orderId).removeAttr("src");
                                $("#imgPickUpSMS_" + orderId).attr("src", "./img/icons/pickup_sms_button_active.png");
                                $("#btnPickUpSMS_" + orderId).removeAttr("onclick");
                               // var html = "<div><div class=\"order-price order-price-one\" style=\"width: 30%;\">" + orderTotal + "</div><div class=\"order-price-text\" style=\"width: 65%;\">Pickup SMS sent " + arrSMSSentTime[0].trim() + " @ " + arrSMSSentTime[1].trim() + " </div></div>";
                                //$("#dvPickUpSMSGrid_" + orderId).html(html);
                            }

                        }

                    }
                    callSweetAlertSuccess(data.Message);
                }
                else {
                    callSweetAlertWarning(data.Message);
                }

            },
            error: function (xhr, textStatus, errorThrown) {
                $("#btnPickupSMS_" + orderId).removeAttr("disabled");
                $("#aPopupSMS_" + orderId).removeAttr("disabled");
                //$("#btnPickupSMS").text("Pickup SMS");
             
            }
        });
    }
    else if (storeId == 0) {
        self.app.router.navigate('/login_new/', { reloadCurrent: false });
    }
}
//Refresh carryout
function RefreshCarryOut() {
    var currentstatus = $("#hdnCurrentState").val();
    pageSize = 10;
    currentPage = 0;
    CarryoutOrdersList(currentstatus, pageSize, currentPage);
}
//parameter List
function getParams() {

    var params = {},
        pairs = document.URL.split('?')
               .pop()
               .split('&');

    for (var i = 0, p; i < pairs.length; i++) {
        p = pairs[i].split('=');
        params[p[0]] = p[1];
    }

    return params;
}

//Change Order Status
function ChangeOrderStatus(orderId, status, storeId) {

    currentPage = 0;
    pageSize = 10;
    $.ajax({
        url: global + 'ChangeOrderStatus?storeid=' + storeId + '&orderId=' + orderId + "&status=" + status,
        type: 'GET',
        datatype: 'jsonp',
        contenttype: "application/json",
        crossDomain: true,
        async: false,
        success: function (data) {
            //if (status == "Processing") {
            //    CarryoutOrdersList("New", pageSize, currentPage);
            //}
            //else if (status == "Complete" || status == "New") {
            //    CarryoutOrdersList("Processing", pageSize, currentPage);
            //}
            //else {
            //    CarryoutOrdersList("", pageSize, currentPage);
            //}
            RefreshCarryOut();
        },
        error: function (xhr, textStatus, errorThrown) {
            //alert(xhr.responseText);
            //alert(textStatus);
            //alert(errorThrown);
        }
    });
}
//Change Order Status
function ChangeOrderStatusNew(status) {
    var params = getParams();
    var storeId = 0;
    var orderId = 0;
    if (typeof (params["StoreId"]) != "undefined") {
        storeId = Number(params["StoreId"]);
    }
    orderId = Number($("#hdnSelectedOrderId").val());

    if (storeId > 0 && orderId > 0) {
        currentPage = 0;
        pageSize = 10;

        $.ajax({
            url: global + 'ChangeOrderStatus?storeid=' + storeId + '&orderId=' + orderId + "&status=" + status,
            type: 'GET',
            datatype: 'jsonp',
            contenttype: "application/json",
            crossDomain: true,
            async: false,
            success: function (data) {
                //if (status == "New") {
                //    CarryoutOrdersList("New", pageSize, currentPage);
                //}
                //else if (status == "Processing") {
                //    CarryoutOrdersList("Processing", pageSize, currentPage);
                //}
                //else {
                //    CarryoutOrdersList("", pageSize, currentPage);
                //}
                var url = window.location.href;

                if (url.toLowerCase().indexOf("carryout") > -1) {
                    RefreshCarryOut();
                }
                else if (url.toLowerCase().indexOf("giftcardsorders") > -1) {
                    RefreshGiftCards();
                }

            },
            error: function (xhr, textStatus, errorThrown) {
                //alert(xhr.responseText);
                //alert(textStatus);
                //alert(errorThrown);
            }
        });
    }

}
//Change Order Status
function ChangeOrderStatusNew(status, orderId, storeId) {


    if (storeId > 0 && orderId > 0) {
        currentPage = 0;
        pageSize = 10;

        $.ajax({
            url: global + 'ChangeOrderStatus?storeid=' + storeId + '&orderId=' + orderId + "&status=" + status,
            type: 'GET',
            datatype: 'jsonp',
            contenttype: "application/json",
            crossDomain: true,
            async: false,
            success: function (data) {

                if ($('#hdnCurrentState').val() == "New") {
                    localStorage.setItem("CurrentPage", 0);
                    if (status == "Processing")
                    {
                        app.tab.show('#2');
                        BindcarryoutTab('Processing');
                        //CarryoutOrdersList('Processing', 10, 0, 'dvProcessingList');
                    }
                    else {
                        CarryoutOrdersList('New', 10, 0, 'dvNewList');
                    }
                   
                }
                else if ($('#hdnCurrentState').val() == "Processing") {

                    localStorage.setItem("CurrentPage", 0);
                    CarryoutOrdersList('Processing', 10, 0, 'dvProcessingList');
                }
                else {

                    //localStorage.setItem("CurrentPage", 0);
                    //CarryoutOrdersList('All', 10, 0, 'dvAllList');
                    var buttonHTML = "";
                    var iconHTML = "";
                    if (status == "New") {
                        iconHTML += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></button>";
                        iconHTML += "<div id=\"myDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        iconHTML += "</div>";
                    }
                    else if (status == "Processing") {
                        iconHTML += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></button>";
                        iconHTML += "<div id=\"myDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        iconHTML += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        iconHTML += "<a  onclick=\"ChangeOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        iconHTML += "</div>";
                      
                        if ($("#customerphone_" + orderId).length > 0)
                        {
                            var phone = $("#customerphone_" + orderId).html();
                            var price = $("#orderprice_" + orderId).html();
                            buttonHTML += "<a onclick=\"ConfirmationPickUpSMSSend(" + orderId + ",'" + phone + "','Grid','" + price + "')\"  id=\"btnPickUpSMS_" + orderId + "\"><img id=\"imgPickUpSMS_" + orderId + "\" src=\"./img/icons/pickup_sms_button.png\" class=\"grid-small-icon\" /></a>";
                            $("#dvCarryOutButtons_" + orderId).html(buttonHTML);
                        }

                    }
                    else if (status == "Complete") {

                        iconHTML += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                        iconHTML += "<div id=\"myDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        iconHTML += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        iconHTML += "<a  onclick=\"ChangeOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        iconHTML += "</div>";
                    }
                    else if (status == "PickedUp") {
                        iconHTML += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                        iconHTML += "<div id=\"myDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        iconHTML += "<a  class=\"status-disabled\"  onclick=\"HideStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        iconHTML += "</div>";
                    }

                    $("#carryoutstatus_" + orderId).html(iconHTML);
                    //var iconHTML = "";
                    //if (status == "New") {
                    //    iconHTML = "<img class=\"list-icon\" src=\"img/icons/new.png\" alt=\"\"/>";
                    //    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnAccept\"><img src=\"./img/icons/accept_button.png\" style=\"width:40%;margin: 0 61px;\" /></a>";
                    //    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('New'," + orderId + "," + storeId + ")\"  id=\"btnNew\" style=\"display:none;\"><img src=\"./img/icons/new_button.png\" /></a>";
                    //    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnProcessing\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\"  /></a>";

                    //    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Complete'," + orderId + "," + storeId + ")\" id=\"btnComplete\" style=\"display:none;\"><img src=\"./img/icons/complete_button.png\"  /></a>";
                    //    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('PickedUp'," + orderId + "," + storeId + ")\"  id=\"btnPickedUp\" style=\"display:none;\"><img src=\"./img/icons/picked_up_button.png\"  /></a>";
                    //}
                    //else if (status == "Processing") {
                    //    iconHTML = "<img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/>";
                    //    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnAccept\"  style=\"display:none;\"><img src=\"./img/icons/accept_button.png\"  /></a>";
                    //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeOrderStatusNew('New'," + orderId + "," + storeId + ")\"  id=\"btnNew\"><img class=\"carryout-button-set-2\" src=\"./img/icons/new_button.png\"  /></a>";
                    //    buttonHTML += "<img class=\"carryout-button-set carryout-button\" src=\"./img/icons/pending_button_active.png\" />";

                    //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeOrderStatusNew('Complete'," + orderId + "," + storeId + ")\"  id=\"btnComplete\"><img class=\"carryout-button-set-2\" src=\"./img/icons/complete_button.png\" /></a>";
                    //    //buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnProcessing\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\" /></a>";
                    //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeOrderStatusNew('PickedUp'," + orderId + "," + storeId + ")\"  id=\"btnPickedUp\"><img class=\"carryout-button-set-2\" src=\"./img/icons/picked_up_button.png\"/></a>";
                    //    //buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\"  /></a>";
                    //}
                    //else if (status == "Complete") {
                    //    iconHTML = "<img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/>";
                    //    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnAccept\"  style=\"display:none;\"><img src=\"./img/icons/accept_button.png\" /></a>";
                    //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeOrderStatusNew('New'," + orderId + "," + storeId + ")\"  id=\"btnNew\"><img class=\"carryout-button-set-2\" src=\"./img/icons/new_button.png\" /></a>";
                    //    //buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Complete'," + value.ID + "," + storeId + ")\"  id=\"btnComplete\" style=\"display:none;\"><img src=\"./img/icons/complete_button.png\"  /></a>";
                    //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnProcessing\" ><img class=\"carryout-button-set-2\" src=\"./img/icons/pending_button.png\"/></a>";
                    //    buttonHTML += "<img class=\"carryout-button-set carryout-button\" src=\"./img/icons/complete_button_active.png\"/>";
                    //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeOrderStatusNew('PickedUp'," + orderId + "," + storeId + ")\"  id=\"btnPickedUp\"><img class=\"carryout-button-set-2\" src=\"./img/icons/picked_up_button.png\"/></a>";
                    //    //if ($("#hdnSelectedOrderPickUpSMSSentTime").val().trim() == "")
                    //    //    buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\"><img src=\"./img/icons/pickup_sms_button.png\"  style=\"width:61%;margin:0 0;\"/></a>";
                    //    //else
                    //    //    buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\" style=\"width:61%;margin:0 0;\"/></a>";

                    //}
                    //else if (status == "PickedUp") {
                    //    iconHTML = "<img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/>";
                    //    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnAccept\"  style=\"display:none;\"><img src=\"./img/icons/accept_button.png\"  /></a>";
                    //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeOrderStatusNew('New'," + orderId + "," + storeId + ")\"  id=\"btnNew\"><img src=\"./img/icons/new_button.png\" class=\"carryout-button-set-2\"  /></a>";
                    //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnProcessing\"><img class=\"carryout-button-set-2\" src=\"./img/icons/pending_button.png\"  /></a>";
                    //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeOrderStatusNew('Complete'," + orderId + "," + storeId + ")\"  id=\"btnComplete\"><img class=\"carryout-button-set-2\" src=\"./img/icons/complete_button.png\" /></a>";
                    //    //buttonHTML += "<a onclick=\"ChangeOrderStatusNew('PickedUp'," + value.ID + "," + storeId + ")\"  id=\"btnPickedUp\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\"  /></a>";
                    //    buttonHTML += "<img class=\"carryout-button-set carryout-button\" src=\"./img/icons/picked_up_button_active.png\"  /></a>";

                    //    //buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\"  /></a>";
                    //}

                    //$("#dvCarryOutButtons_" + orderId).html(buttonHTML);
                    //$("#carryoutstatus_" + orderId).html(iconHTML);

                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //alert(xhr.responseText);
                //alert(textStatus);
                //alert(errorThrown);
            }
        });
    }

}
function ChangeOrderStatusDropdown(status, orderId, storeId) {


    if (storeId > 0 && orderId > 0) {
        currentPage = 0;
        pageSize = 10;

        $.ajax({
            url: global + 'ChangeOrderStatus?storeid=' + storeId + '&orderId=' + orderId + "&status=" + status,
            type: 'GET',
            datatype: 'jsonp',
            contenttype: "application/json",
            crossDomain: true,
            async: false,
            success: function (data) {

                if ($('#hdnCurrentState').val() == "New") {
                    localStorage.setItem("CurrentPage", 0);
                    CarryoutOrdersList('New', 10, 0, 'dvNewList');
                }
                else if ($('#hdnCurrentState').val() == "Processing") {

                    localStorage.setItem("CurrentPage", 0);
                    CarryoutOrdersList('Processing', 10, 0, 'dvProcessingList');
                }
                else {

                    //localStorage.setItem("CurrentPage", 0);
                    //CarryoutOrdersList('All', 10, 0, 'dvAllList');
                    var buttonHTML = "";
                    var iconHTML = "";
                    if (status == "New") {
                        iconHTML += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></button>";
                        iconHTML += "<div id=\"myDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        iconHTML += "</div>";
                    }
                    else if (status == "Processing") {
                        iconHTML += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></button>";
                        iconHTML += "<div id=\"myDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        iconHTML += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        iconHTML += "<a  onclick=\"ChangeOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        iconHTML += "</div>";
                    }
                    else if (status == "Complete") {

                        iconHTML += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                        iconHTML += "<div id=\"myDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        iconHTML += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        iconHTML += "<a  onclick=\"ChangeOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        iconHTML += "</div>";
                    }
                    else if (status == "PickedUp") {
                        iconHTML += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                        iconHTML += "<div id=\"myDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        iconHTML += "<a  class=\"status-disabled\"  onclick=\"HideStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        iconHTML += "</div>";
                    }

                    $("#carryoutstatus_" + orderId).html(iconHTML);

                }
            },
            error: function (xhr, textStatus, errorThrown) {
                //alert(xhr.responseText);
                //alert(textStatus);
                //alert(errorThrown);
            }
        });
    }

}
function HideStatusChangeDropdown(orderId) {
    $("#myDropdown_" + orderId).removeClass("show");
}

function ChangePopupOrderStatusDropdown(status, orderId, storeId) {

    //console.log("status: " + status)
    if (storeId > 0 && orderId > 0) {
        currentPage = 0;
        pageSize = 10;
        var orderPhone = $("#hdnSelectedOrderPhone_" + orderId).val();

        $.ajax({
            url: global + 'ChangeOrderStatus?storeid=' + storeId + '&orderId=' + orderId + "&status=" + status,
            type: 'GET',
            datatype: 'jsonp',
            contenttype: "application/json",
            crossDomain: true,
            async: false,
            success: function (data) {
                //console.log(data)
                //console.log("Current State: " + $('#hdnCurrentState').val())
                if ($('#hdnCurrentState').val() == "New") {
                    localStorage.setItem("CurrentPage", 0);
                    CarryoutOrdersList('New', 10, 0, 'dvNewList');
                }
                else if ($('#hdnCurrentState').val() == "Processing") {

                    localStorage.setItem("CurrentPage", 0);
                    CarryoutOrdersList('Processing', 10, 0, 'dvProcessingList');
                }
                else {

                    //localStorage.setItem("CurrentPage", 0);
                    //CarryoutOrdersList('All', 10, 0, 'dvAllList');
                }

                var buttonHTML = "";
                var iconHTML = "";
                var iconHTML1 = "";
                var upperButtonHtml = "";
                if (status == "New") {
                    iconHTML += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></button>";
                    iconHTML += "<a class=\"popup-link\" onclick=\"OpenOrderHistoryPopup(" + orderId + ")\">History</a>";

                    iconHTML += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    iconHTML += "<a onclick=\"ChangePopupOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                    iconHTML += "<a onclick=\"ChangePopupOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    iconHTML += "<a onclick=\"ChangePopupOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    iconHTML += "</div>";

                    iconHTML1 += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></button>";
                    iconHTML1 += "<div id=\"myDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    iconHTML1 += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                    iconHTML1 += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    iconHTML1 += "<a onclick=\"ChangeOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    iconHTML1 += "</div>";

                    //Set Details Upper Button
                    upperButtonHtml = "<a class=\"custom-btn-two custom-bg custom-link item-media-section-two\" style=\"background:#5cb95a !important;\" onclick=\"ChangePopupOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\">Processing</a>";
                    $("#divUpperButtonArea").html(upperButtonHtml);
                }
                else if (status == "Processing") {
                    iconHTML += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></button>";
                    iconHTML += "<a class=\"popup-link\" onclick=\"OpenOrderHistoryPopup(" + orderId + ")\">History</a>";

                    iconHTML += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    iconHTML += "<a class=\"status-disabled\" onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                    iconHTML += "<a onclick=\"ChangePopupOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    iconHTML += "<a  onclick=\"ChangePopupOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    iconHTML += "</div>";

                    iconHTML1 += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></button>";
                    iconHTML1 += "<div id=\"myDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    iconHTML1 += "<a class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                    iconHTML1 += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    iconHTML1 += "<a  onclick=\"ChangeOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    iconHTML1 += "</div>";


                    //Set Details Upper Button
                    upperButtonHtml = "<a class=\"custom-btn-two custom-bg custom-link item-media-section-two\" style=\"background:#74ddff !important;\" onclick=\"ChangePopupOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\">Complete</a>";
                    $("#divUpperButtonArea").html(upperButtonHtml);
                }
                else if (status == "Complete") {

                    iconHTML += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                    iconHTML += "<a class=\"popup-link\" onclick=\"OpenOrderHistoryPopup(" + orderId + ")\">History</a>";

                    iconHTML += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    iconHTML += "<a onclick=\"ChangePopupOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                    iconHTML += "<a class=\"status-disabled\" onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    iconHTML += "<a  onclick=\"ChangePopupOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    iconHTML += "</div>";


                    iconHTML1 += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                    iconHTML1 += "<div id=\"myDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    iconHTML1 += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                    iconHTML1 += "<a class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    iconHTML1 += "<a  onclick=\"ChangeOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    iconHTML1 += "</div>";

                    //Set Details Upper Button
                    upperButtonHtml = "<a class=\"custom-btn-two custom-bg custom-link item-media-section-two\" style=\"background:#f7952c !important;\" onclick=\"ChangePopupOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\">PickedUp</a>";
                    //Send SMS Button
                    upperButtonHtml += "<a id=\"aPopupSMS_" + orderId + "\" class=\"custom-btn-three custom-bg custom-link item-media-section-two\" style=\"background:#303030 !important;\" onclick=\"ConfirmationPickUpSMSSend(" + orderId + ",'" + orderPhone + "','Popup','$0.00')\">SMS to Customer</a>";
                    $("#divUpperButtonArea").html(upperButtonHtml);

                }
                else if (status == "PickedUp") {
                    iconHTML += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                    iconHTML += "<a class=\"popup-link\" onclick=\"OpenOrderHistoryPopup(" + orderId + ")\">History</a>";

                    iconHTML += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    iconHTML += "<a onclick=\"ChangePopupOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                    iconHTML += "<a onclick=\"ChangePopupOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    iconHTML += "<a class=\"status-disabled\"  onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    iconHTML += "</div>";


                    iconHTML1 += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                    iconHTML1 += "<div id=\"myDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    iconHTML1 += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                    iconHTML1 += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    iconHTML1 += "<a class=\"status-disabled\"  onclick=\"HideStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    iconHTML1 += "</div>";

                    $("#divUpperButtonArea").html("");
                }

                $("#carryoutpopstatus_" + orderId).html(iconHTML);
                $("#carryoutstatus_" + orderId).html(iconHTML1);
            },
            error: function (xhr, textStatus, errorThrown) {
                //alert(xhr.responseText);
                //alert(textStatus);
                //alert(errorThrown);
            }
        });
    }

}
function HidePopupStatusChangeDropdown(orderId) {
    $("#myPopupDropdown_" + orderId).removeClass("show");
}
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction(id) {
    $(".show").removeClass("show");
    $("#myDropdown_" + id).addClass("show");
}
function myPopupFunction(id) {
    $(".show").removeClass("show");
    $("#myPopupDropdown_" + id).addClass("show");
}
//Change Order Status
function PopupChangeOrderStatusNew(status, orderId, storeId) {


    if (storeId > 0 && orderId > 0) {

        $.ajax({
            url: global + 'ChangeOrderStatus?storeid=' + storeId + '&orderId=' + orderId + "&status=" + status,
            type: 'GET',
            datatype: 'jsonp',
            contenttype: "application/json",
            crossDomain: true,
            async: false,
            success: function (data) {
                var orderhtml = "";



                var buttonHTML = "";
                if (status == "New") {
                    orderhtml = "<img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/>";
                    buttonHTML += "<a onclick=\"PopupChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnAccept\"><img src=\"./img/icons/accept_button.png\" style=\"width:40%;margin: 0 61px;\" /></a>";
                    buttonHTML += "<a onclick=\"PopupChangeOrderStatusNew('New'," + orderId + "," + storeId + ")\"  id=\"btnNew\" style=\"display:none;\"><img src=\"./img/icons/new_button.png\" /></a>";
                    buttonHTML += "<a onclick=\"PopupChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnProcessing\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\"  /></a>";
                    buttonHTML += "<a onclick=\"PopupChangeOrderStatusNew('Complete'," + orderId + "," + storeId + ")\" id=\"btnComplete\" style=\"display:none;\"><img src=\"./img/icons/complete_button.png\"  /></a>";
                    buttonHTML += "<a onclick=\"PopupChangeOrderStatusNew('PickedUp'," + orderId + "," + storeId + ")\"  id=\"btnPickedUp\" style=\"display:none;\"><img src=\"./img/icons/picked_up_button.png\"  /></a>";
                    //buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\" /></a>";
                }
                else if (status == "Processing") {
                    orderhtml = "<img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/>";
                    buttonHTML += "<a onclick=\"PopupChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnAccept\"  style=\"display:none;\"><img src=\"./img/icons/accept_button.png\"  /></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"PopupChangeOrderStatusNew('New'," + orderId + "," + storeId + ")\"  id=\"btnNew\"><img class=\"carryout-button-set-2\" src=\"./img/icons/new_button.png\"  /></a>";
                    buttonHTML += "<img class=\"carryout-button-set carryout-button\" src=\"./img/icons/pending_button_active.png\" />";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"PopupChangeOrderStatusNew('Complete'," + orderId + "," + storeId + ")\"  id=\"btnComplete\"><img class=\"carryout-button-set-2\" src=\"./img/icons/complete_button.png\" /></a>";
                    //buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnProcessing\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\" /></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"PopupChangeOrderStatusNew('PickedUp'," + orderId + "," + storeId + ")\"  id=\"btnPickedUp\"><img class=\"carryout-button-set-2\" src=\"./img/icons/picked_up_button.png\"/></a>";
                    //buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\"  /></a>";
                }
                else if (status == "Complete") {
                    orderhtml = "<img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/>";

                    buttonHTML += "<a onclick=\"PopupChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnAccept\"  style=\"display:none;\"><img src=\"./img/icons/accept_button.png\" /></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"PopupChangeOrderStatusNew('New'," + orderId + "," + storeId + ")\"  id=\"btnNew\"><img class=\"carryout-button-set-2\" src=\"./img/icons/new_button.png\" /></a>";
                    //buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Complete'," + value.ID + "," + storeId + ")\"  id=\"btnComplete\" style=\"display:none;\"><img src=\"./img/icons/complete_button.png\"  /></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"PopupChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnProcessing\" ><img class=\"carryout-button-set-2\" src=\"./img/icons/pending_button.png\"/></a>";
                    buttonHTML += "<img class=\"carryout-button-set carryout-button\" src=\"./img/icons/complete_button_active.png\"/>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"PopupChangeOrderStatusNew('PickedUp'," + orderId + "," + storeId + ")\"  id=\"btnPickedUp\"><img class=\"carryout-button-set-2\" src=\"./img/icons/picked_up_button.png\"/></a>";
                    //if ($("#hdnSelectedOrderPickUpSMSSentTime").val().trim() == "")
                    //    buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\"><img src=\"./img/icons/pickup_sms_button.png\"  style=\"width:61%;margin:0 0;\"/></a>";
                    //else
                    //    buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\" style=\"width:61%;margin:0 0;\"/></a>";

                }
                else if (status == "PickedUp") {
                    orderhtml = "<img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/>";
                    buttonHTML += "<a onclick=\"PopupChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnAccept\"  style=\"display:none;\"><img src=\"./img/icons/accept_button.png\"  /></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"PopupChangeOrderStatusNew('New'," + orderId + "," + storeId + ")\"  id=\"btnNew\"><img src=\"./img/icons/new_button.png\" class=\"carryout-button-set-2\"  /></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"PopupChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnProcessing\"><img class=\"carryout-button-set-2\" src=\"./img/icons/pending_button.png\"  /></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"PopupChangeOrderStatusNew('Complete'," + orderId + "," + storeId + ")\"  id=\"btnComplete\"><img class=\"carryout-button-set-2\" src=\"./img/icons/complete_button.png\" /></a>";
                    //buttonHTML += "<a onclick=\"ChangeOrderStatusNew('PickedUp'," + value.ID + "," + storeId + ")\"  id=\"btnPickedUp\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\"  /></a>";
                    buttonHTML += "<img class=\"carryout-button-set carryout-button\" src=\"./img/icons/picked_up_button_active.png\"  /></a>";

                    //buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\"  /></a>";
                }

                $("#popUpCarryoutIcon_" + orderId).html(orderhtml);
                $("#popupCarryOutDetails_" + orderId).html(buttonHTML);


                //List Area Update
                var buttonListHTML = "";
                var iconListHTML = "";
                if (status == "New") {
                    iconListHTML = "<img class=\"list-icon\" src=\"img/icons/new.png\" alt=\"\"/>";
                    buttonListHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnAccept\"><img src=\"./img/icons/accept_button.png\" style=\"width:40%;margin: 0 61px;\" /></a>";
                    buttonListHTML += "<a onclick=\"ChangeOrderStatusNew('New'," + orderId + "," + storeId + ")\"  id=\"btnNew\" style=\"display:none;\"><img src=\"./img/icons/new_button.png\" /></a>";
                    buttonListHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnProcessing\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\"  /></a>";

                    buttonListHTML += "<a onclick=\"ChangeOrderStatusNew('Complete'," + orderId + "," + storeId + ")\" id=\"btnComplete\" style=\"display:none;\"><img src=\"./img/icons/complete_button.png\"  /></a>";
                    buttonListHTML += "<a onclick=\"ChangeOrderStatusNew('PickedUp'," + orderId + "," + storeId + ")\"  id=\"btnPickedUp\" style=\"display:none;\"><img src=\"./img/icons/picked_up_button.png\"  /></a>";
                    //buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\" /></a>";
                }
                else if (status == "Processing") {
                    iconListHTML = "<img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/>";
                    buttonListHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnAccept\"  style=\"display:none;\"><img src=\"./img/icons/accept_button.png\"  /></a>";
                    buttonListHTML += "<a class=\"carryout-button\" onclick=\"ChangeOrderStatusNew('New'," + orderId + "," + storeId + ")\"  id=\"btnNew\"><img class=\"carryout-button-set-2\" src=\"./img/icons/new_button.png\"  /></a>";
                    buttonListHTML += "<img class=\"carryout-button-set carryout-button\" src=\"./img/icons/pending_button_active.png\" />";

                    buttonListHTML += "<a class=\"carryout-button\" onclick=\"ChangeOrderStatusNew('Complete'," + orderId + "," + storeId + ")\"  id=\"btnComplete\"><img class=\"carryout-button-set-2\" src=\"./img/icons/complete_button.png\" /></a>";
                    //buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnProcessing\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\" /></a>";
                    buttonListHTML += "<a class=\"carryout-button\" onclick=\"ChangeOrderStatusNew('PickedUp'," + orderId + "," + storeId + ")\"  id=\"btnPickedUp\"><img class=\"carryout-button-set-2\" src=\"./img/icons/picked_up_button.png\"/></a>";
                    //buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\"  /></a>";
                }
                else if (status == "Complete") {
                    iconListHTML = "<img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/>";
                    buttonListHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnAccept\"  style=\"display:none;\"><img src=\"./img/icons/accept_button.png\" /></a>";
                    buttonListHTML += "<a class=\"carryout-button\" onclick=\"ChangeOrderStatusNew('New'," + orderId + "," + storeId + ")\"  id=\"btnNew\"><img class=\"carryout-button-set-2\" src=\"./img/icons/new_button.png\" /></a>";
                    //buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Complete'," + value.ID + "," + storeId + ")\"  id=\"btnComplete\" style=\"display:none;\"><img src=\"./img/icons/complete_button.png\"  /></a>";
                    buttonListHTML += "<a class=\"carryout-button\" onclick=\"ChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnProcessing\" ><img class=\"carryout-button-set-2\" src=\"./img/icons/pending_button.png\"/></a>";
                    buttonListHTML += "<img class=\"carryout-button-set carryout-button\" src=\"./img/icons/complete_button_active.png\"/>";
                    buttonListHTML += "<a class=\"carryout-button\" onclick=\"ChangeOrderStatusNew('PickedUp'," + orderId + "," + storeId + ")\"  id=\"btnPickedUp\"><img class=\"carryout-button-set-2\" src=\"./img/icons/picked_up_button.png\"/></a>";
                    //if ($("#hdnSelectedOrderPickUpSMSSentTime").val().trim() == "")
                    //    buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\"><img src=\"./img/icons/pickup_sms_button.png\"  style=\"width:61%;margin:0 0;\"/></a>";
                    //else
                    //    buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\" style=\"width:61%;margin:0 0;\"/></a>";

                }
                else if (status == "PickedUp") {
                    iconListHTML = "<img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/>";
                    buttonListHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnAccept\"  style=\"display:none;\"><img src=\"./img/icons/accept_button.png\"  /></a>";
                    buttonListHTML += "<a class=\"carryout-button\" onclick=\"ChangeOrderStatusNew('New'," + orderId + "," + storeId + ")\"  id=\"btnNew\"><img src=\"./img/icons/new_button.png\" class=\"carryout-button-set-2\"  /></a>";
                    buttonListHTML += "<a class=\"carryout-button\" onclick=\"ChangeOrderStatusNew('Processing'," + orderId + "," + storeId + ")\"  id=\"btnProcessing\"><img class=\"carryout-button-set-2\" src=\"./img/icons/pending_button.png\"  /></a>";
                    buttonListHTML += "<a class=\"carryout-button\" onclick=\"ChangeOrderStatusNew('Complete'," + orderId + "," + storeId + ")\"  id=\"btnComplete\"><img class=\"carryout-button-set-2\" src=\"./img/icons/complete_button.png\" /></a>";
                    //buttonHTML += "<a onclick=\"ChangeOrderStatusNew('PickedUp'," + value.ID + "," + storeId + ")\"  id=\"btnPickedUp\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\"  /></a>";
                    buttonListHTML += "<img class=\"carryout-button-set carryout-button\" src=\"./img/icons/picked_up_button_active.png\"  /></a>";

                    //buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\"  /></a>";
                }

                $("#dvCarryOutButtons_" + orderId).html(buttonListHTML);
                $("#carryoutstatus_" + orderId).html(iconListHTML);
            },
            error: function (xhr, textStatus, errorThrown) {
                //alert(xhr.responseText);
                //alert(textStatus);
                //alert(errorThrown);
            }
        });
    }

}
//Carryout Order Details
function GetOrderDetailsById() {
    $("#dvList").html("");
    var orderId = 0;
    var storeId = 0;
    var params = getParams();
    if (typeof (params["orderId"]) != "undefined") {
        orderId = params["orderId"];
    }
    if (typeof (params["StoreId"]) != "undefined") {
        storeId = params["StoreId"];
    }
    url = global + "/GetCarryOutOrderDetailsWithAllInfo?orderid=" + orderId;
    //SetMenuNavigation(storeId);
    try {

        var html = "";
        var htmlDiscount = "";
        var htmlRewards = "";
        var htmlGiftCard = "";
        var htmlSubTotal = "";
        var htmlOrderTotal = "";
        var subtotalvalue = "0.00";
        var ordertotalvalue = "0.00";
        var orderDiscount = 0.00;
        $.getJSON(url, function (data) {
            $.each(JSON.parse(data), function (index, value) {

                if (value.Type == "OrderInfo") {
                    var firstName = "";
                    var lastName = "";
                    var email = "";
                    var phone = "";
                    if (value.FIRSTNAME != "") {
                        firstName = value.FIRSTNAME;

                    }
                    else {

                        firstName = value.BILLINGFIRSTNAME;
                    }

                    if (value.LASTNAME != "") {
                        lastName = value.LASTNAME;

                    }
                    else {

                        lastName = value.BILLINGLASTNAME;
                    }

                    if (value.EMAIL != "") {
                        email = value.EMAIL;

                    }
                    else {

                        email = value.BILLINGEMAIL;
                    }

                    if (value.PHONE != "") {
                        phone = value.PHONE;

                    }
                    else {

                        phone = value.BILLINGPHONE;
                    }
                    $("#dvCustomerName").html(firstName + " " + lastName);
                    if (phone.length == 10)
                        $("#dvCustomerPhone").html("<a href=\"tel:+" + phone + "\"><i class=\"fa fa-phone icon-one\" aria-hidden=\"true\"></i>" + formatPhoneNumber(phone) + "</a>");
                    else
                        $("#dvCustomerPhone").html("<a href=\"tel:+" + phone + "\"><i class=\"fa fa-phone icon-one\" aria-hidden=\"true\"></i>" + phone + "</a>");
                    $("#dvCustomerEmail").html("<a href=\"mailto:" + email + "\"><i class=\"fa fa-envelope icon-one\" aria-hidden=\"true\"></i>" + email + "</a>");
                    $("#dvOrderId").html(value.ORDERID);
                    $("#dvOrderDate").html(value.CREATEDONUTC.replace("~", " @ "));
                    //alert(FormatDecimal(value.ORDERTOTAL))
                    $("#dvOrderTotal").html(FormatDecimal(value.ORDERTOTAL));
                    orderDiscount = value.ORDERDISCOUNT;
                    subtotalvalue = value.SUBTOTAL;
                    ordertotalvalue = value.ORDERTOTAL;


                }

                else if (value.Type == "DiscountInfo") {
                    // console.log("html: " + html)
                    //console.log("DiscountInfo: " + value.COUPONCODE);

                    htmlDiscount += " <tr><td width=\"70%\">&nbsp;</td>";
                    htmlDiscount += "<td colspan=\"2\" width=\"20%\"  style=\"text-align:left;\">Coupon (" + value.COUPONCODE + ") Discount:</td>";
                    htmlDiscount += "<td width=\"10%\"  style=\"text-align:right;\">(-)" + FormatDecimal(orderDiscount) + "</td>";
                    htmlDiscount += "</tr>";

                }
                else if (value.Type == "RewardInfo") {
                    console.log("RewardInfo: " + value.POINTS);
                    htmlRewards += " <tr><td width=\"70%\">&nbsp;</td>";
                    htmlRewards += "<td colspan=\"2\" width=\"20%\"  style=\"text-align:left;\">Reward Points (" + value.POINTS.toString().replace("-", "") + "):</td>";
                    htmlRewards += "<td  width=\"10%\"  style=\"text-align:right;\">(-)" + FormatDecimal(value.USEDAMOUNT) + "</td>";
                    htmlRewards += "</tr>";
                }
                else if (value.Type == "GiftCardInfo") {
                    console.log("GiftCardInfo: " + value.GIFTCARDCOUPONCODE);
                    htmlGiftCard += " <tr><td width=\"70%\">&nbsp;</td>";
                    htmlGiftCard += "<td colspan=\"2\" width=\"20%\"  style=\"text-align:left;\">Gift Card (" + value.GIFTCARDCOUPONCODE.replace("-", "") + "):</td>";
                    htmlGiftCard += "<td  width=\"10%\"  style=\"text-align:right;\">(-)" + FormatDecimal(value.USEDVALUE) + "</td>";
                    htmlGiftCard += "</tr>";
                }



            });
            url = global + "/GetCarryOutOrderItemDetails?orderid=" + orderId;
            $.getJSON(url, function (data) {
                $.each(JSON.parse(data), function (index, value) {
                    html += " <tr><td width=\"70%\">" + value.PRODUCT;
                    if (value.NOTES != "") {
                        html += " (" + value.NOTES + ") </td>";
                    }
                    else {
                        html += "</td>";

                    }
                    html += "<td width=\"10%\"  style=\"text-align:center;\">" + value.QUANTITY + "</td>";
                    html += "<td width=\"10%\"  style=\"text-align:right;\">" + FormatDecimal(value.UNITPRICE) + "</td>";
                    html += "<td width=\"10%\"  style=\"text-align:right;\">" + FormatDecimal(value.TOTALPRICE) + "</td>";
                    html += "</tr>";

                });

                if (htmlDiscount != "" || htmlRewards != "" || htmlGiftCard != "") {
                    htmlSubTotal = " <tr><td width=\"70%\">&nbsp;</td>";
                    htmlSubTotal += "<td colspan=\"2\" width=\"20%\"  style=\"text-align:left;\">Subtotal:</td>";
                    htmlSubTotal += "<td width=\"10%\"  style=\"text-align:right;\">" + FormatDecimal(subtotalvalue) + "</td>";
                    htmlSubTotal += "</tr>";

                    htmlOrderTotal = " <tr><td width=\"70%\">&nbsp;</td>";
                    htmlOrderTotal += "<td colspan=\"2\" width=\"20%\"  style=\"text-align:left;\">Order Total:</td>";
                    htmlOrderTotal += "<td width=\"10%\"  style=\"text-align:right;\">" + FormatDecimal(ordertotalvalue) + "</td>";
                    htmlOrderTotal += "</tr>";
                }

                $("#tableItems tbody").append(html + htmlSubTotal + htmlDiscount + htmlRewards + htmlGiftCard + htmlOrderTotal);
            });

        });



    }
    catch (e) {
    }
}

//Carryout Order Items
function GetOrderItemDetailsById(orderId) {
    $("#dvList").html("");

    url = global + "/GetCarryOutOrderItemDetails?orderid=" + orderId;

    try {


        $.getJSON(url, function (data) {
            $.each(JSON.parse(data), function (index, value) {
                //console.log(value.ORDERSTATUSID);

                var orderDate = "";
                var orderTime = "";
                if (value.CREATEDONUTC != null && value.CREATEDONUTC != undefined) {
                    var arrDateTime = value.CREATEDONUTC.split('~');
                    var orderDate = arrDateTime[0];
                    var orderTime = arrDateTime[1];
                }
                var html = "<div class=\"display-section-twelve\"> <div class=\"display-section-leftone\">";
                html += "<h2><a href=\"carryout-details.html\">#" + value.ID + " @ " + orderTime + " (" + orderDate + ")</a></h2>";
                html += "<h2>" + value.FIRSTNAME + " " + value.LASTNAME + " " + value.PHONE + "</h2>";
                if (value.NOOFITEMS == 1) {
                    html += "<h3><a href=\"#\">" + value.NOOFITEMS + " Item</a></h3>";
                }
                else {
                    html += "<h3><a href=\"#\">" + value.NOOFITEMS + " Items</a></h3>";
                }
                if (value.ORDERSTATUSID == "New") {
                    html += "</div> <div class=\"display-section-right\"> <div class=\"form-display-one\"><button onclick=\"ChangeOrderStatus(" + value.ID + ",'Processing'," + storeId + ")\">Accept</button></div></div>";
                    html += "</div></div>";
                }
                else if (value.ORDERSTATUSID == "Processing") {
                    html += "</div> <div class=\"display-section-right\"> <div class=\"form-display-one\"><button onclick=\"ChangeOrderStatus(" + value.ID + ",'New'," + storeId + ")\">Set New</button><button onclick=\"ChangeOrderStatus(" + value.ID + ",'Complete'," + storeId + ")\">Complete</button></div></div>";
                    html += "</div></div>";
                }
                else {
                    html += "</div></div>";
                }
                $("#dvList").append(html);
            });
        });
    }
    catch (e) {
    }
}


//Carryout Order Details
function GetCarryOutStatus() {
    $("#dvList").html("");
    var storeId = 0;

    var params = getParams();
    if (typeof (params["StoreId"]) != "undefined") {
        storeId = params["StoreId"];
    }
    url = global + "/GetCarryoutStatus?storeid=" + storeId;
    //SetMenuNavigation(storeId);
    try {


        $.getJSON(url, function (data) {
            $.each(JSON.parse(data), function (index, value) {
                var carryoutEnabled = value.CARRYOUTENABLED;
                var carryoutcurrentstatus = value.CARRYOUTSTATUS;

                //if (carryoutEnabled==true)
                $("#dvCarryoutStatus").html("CARRYOUT " + carryoutcurrentstatus);
                if (carryoutcurrentstatus.toLowerCase().trim() == "running") {
                    $("#dvCarryOutStatusChange").html("<a  class=\"start-btn-one\" onclick=\"ChangeCarryoutStatus(" + storeId + ",'STOPPED')\"><img src=\"./img/Stop.png\" style=\"display:block;\"></a>");
                }
                else {
                    $("#dvCarryOutStatusChange").html("<a class=\"stop-btn-one\" onclick=\"ChangeCarryoutStatus(" + storeId + ",'RUNNING')\"><img src=\"./img/Start.png\" style=\"display:block;\"></a>");
                }
                //alert(carryoutEnabled)
                //alert(carryoutcurrentstatus)
            });
        });
    }
    catch (e) {
    }
}


//Change Carryout Status
function ChangeCarryoutStatus(storeid, status) {

    $.ajax({
        url: global + 'ChangeCarryoutStatus?storeid=' + storeid + "&status=" + status,
        type: 'GET',
        datatype: 'jsonp',
        contenttype: "application/json",
        crossDomain: true,
        async: false,
        success: function (data) {
            if (status == "STOPPED") {
                $("#dvCarryoutStatus").html("CARRYOUT STOPPED");
                $("#dvCarryOutStatusChange").html("");
                $("#dvCarryOutStatusChange").html("<a  class=\"stop-btn-one\" onclick=\"ChangeCarryoutStatus(" + storeid + ",'RUNNING')\"><img src=\"./img/Start.png\" style=\"display:block;\"></a>");

            }
            else {
                $("#dvCarryoutStatus").html("CARRYOUT RUNNING");
                $("#dvCarryOutStatusChange").html("");
                $("#dvCarryOutStatusChange").html("<a class=\"start-btn-one\" onclick=\"ChangeCarryoutStatus(" + storeid + ",'STOPPED')\"><img src=\"./img/Stop.png\" style=\"display:block;\"></a>");

            }

        },
        error: function (xhr, textStatus, errorThrown) {
            //alert(xhr.responseText);
            //alert(textStatus);
            //alert(errorThrown);
        }
    });
}
function formatPhoneNumber(s) {
    var s2 = ("" + s).replace(/\D/g, '');
    var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
}
//function Back() {
//    console.log('Back')
//    //app.views.main.router.back();
//    history.go(-1);
//    navigator.app.backHistory();
//}

function CarryoutDetailsBack() {
    var params = getParams();
    var lastTab = "";
    var StoreId = "";
    if (typeof (params["Status"]) != "undefined") {
        lastTab = params["Status"];
    }
    if (typeof (params["StoreId"]) != "undefined") {
        StoreId = params["StoreId"];
    }
    window.location.href = "carryout.html?status=" + lastTab.toLowerCase().trim() + "&StoreId=" + StoreId;
}
function Logout() {

    //console.log("2:" + window.localStorage.getItem("DeviceRegistrationToken"))
    //console.log("1:" + window.localStorage.getItem("StoreId"))
    var storeId = localStorage.getItem("StoreId").trim();
    if (localStorage.getItem("registrationId") === null) {
        //window.location.href = "index.html";
        self.app.router.navigate('/login_new/', { reloadCurrent: false });
        localStorage.clear();

    }
    else {
        var token = localStorage.getItem("registrationId").trim();

        //  alert(global)
        $.ajax({
            url: global + 'Logout?storeid=' + storeId + '&registrationToken=' + token,
            type: 'GET',
            datatype: 'jsonp',
            contenttype: "application/json",
            crossDomain: true,
            async: false,
            success: function (data) {
                //window.location.href = "index.html";
                localStorage.clear();
                self.app.router.navigate('/login_new/', { reloadCurrent: false });
            },
            error: function (xhr, textStatus, errorThrown) {
                //window.location.href = "index.html";
                localStorage.clear();
                self.app.router.navigate('/login_new/', { reloadCurrent: false });
            }
        });
    }

}

function FormatDecimal(decimalValue) {
    var result = "";
    result = "$" + parseFloat(Math.round(decimalValue * 100) / 100).toFixed(2);
    return result;
}
function FormatDecimalWithoutDollar(decimalValue) {
    var result = "";
    result =  parseFloat(Math.round(decimalValue * 100) / 100).toFixed(2);
    return result;
}
function FormatPhoneNumber(s) {
    var s2 = ("" + s).replace(/\D/g, '');
    var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
}
const dateFromStr = str => new Date('1970/01/01 ' + str);

function playAudio() {
    console.log("Playing")

    myMedia = new Media(src, onSuccess, onError, onStatus);
    //console.log("Playing")
    myMedia.play();
}
function onSuccess() {
    //alert("Playing Audio");
}
function onError(error) {
    console.log('code: ' + error.code + '\n' +
         'message: ' + error.message + '\n');
}
// onStatus Callback
function onStatus(status) {

}
function pauseAudio() {
    myMedia.pause();
}
function stopAudio() {
    myMedia = new Media(src, onSuccess, onError, onStatus);
    // alert("Stopping");
    myMedia.stop();
}
function HideModal() {
    $(".modal").modal("hide");
    //$('#modal').modal('hide');
    if (isDevice()) {
        stopAudio();
    }
}


function decode_str(str) {
    pos = str.indexOf('&lt;');
    while (pos >= 0) {
        str = str.replace('&lt;', '<')
        pos = str.indexOf('&lt;');
    }
    pos = str.indexOf('&gt;');
    while (pos >= 0) {
        str = str.replace('&gt;', '>')
        pos = str.indexOf('&gt;');
    }
    return $.trim(str);
}

function AcceptOrdersOtherPage() {
    var orderIds = $("#hdnOrderIds").val().trim();
    var orders = [];
    var customerphone = [];
    var carryoutchanged = 0;
    var giftcardchanged = 0;
    if (window.localStorage.getItem("RestaurantName") != null)
        restaurantDisplayName = window.localStorage.getItem("RestaurantName").trim();
    $(".pickup").each(function (index, element) {
        // element == this
        var elemId = $(this).attr("id");
        var orderId = $(this).attr("id").split('_')[1];

        var pickup = $(this).val().trim();
        var oldPickUp = $("#pickuptime_" + orderId).html().trim();
        var phone = $("#phone_" + orderId).html().trim().replace("(", "").replace(")", "").replace("-", "");

        orders.push(orderId + "#" + pickup);
        if (oldPickUp != pickup) {
            customerphone.push(orderId + "#" + pickup + "#" + phone + "#changed");
        }
        else {
            customerphone.push(orderId + "#" + pickup + "#" + phone + "#notchanged");
        }
        carryoutchanged++;
    });
    var group = $('input[name="giftcardorder"]');

    if (group.length > 0) {
        group.each(function () {
            var orderId = $(this).attr("id");
            orders.push(orderId + "#NA");
        });
        giftcardchanged++;

    }
    currentPage = 0;
    pageSize = 10;
    $.ajax({
        //url: global + 'ChangeBulkOrderStatus?orderId=' + orderIds + "&status=Processing",
        url: global + 'ChangeBulkOrderStatus',
        type: 'GET',
        data: {
            orderId: JSON.stringify(orders),
            status: 'Processing',
            restaurantDisplayName: restaurantDisplayName,
            orderDetails: JSON.stringify(customerphone)
        },
        datatype: 'jsonp',
        contenttype: "application/json",
        crossDomain: true,
        async: false,
        success: function (response) {

            if (isDevice()) {
                stopAudio();
            }
            $(".modal").modal("hide");
            //CarryoutOrdersList("Processing", pageSize, currentPage);
            $("#hdnOrderIds").val("");
            var storeId = 0;
            storeId = SetStoreId();
            if (giftcardchanged > 0 && carryoutchanged > 0) {
                if (giftcardchanged > carryoutchanged) {
                    window.location.href = "giftcardsorders.html?StoreId=" + storeId;
                }
                else {
                    window.location.href = "carryout.html?StoreId=" + storeId + "&status=Processing";

                }
            }
            else if (giftcardchanged > 0 && carryoutchanged == 0) {
                window.location.href = "giftcardsorders.html?StoreId=" + storeId;
            }
            else if (carryoutchanged > 0 && giftcardchanged == 0) {
                window.location.href = "carryout.html?StoreId=" + storeId + "&status=Processing";
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            //alert(xhr.responseText);
            //alert(textStatus);
            //alert(errorThrown);
        }
    });
}

function isDevice() {
    //console.log('isDevice')
    //return true;
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
        return true;
    } else {
        return false;
    }


}


function getCurrentdayOfWeek() {
    var dayOfweek = "";
    var days = [
    'Su', //Sunday starts at 0
    'Mo',
    'Tu',
    'We',
    'Th',
    'Fr',
    'Sa'
    ];

    d = new Date(); //This returns Wed Apr 02 2014 17:28:55 GMT+0800 (Malay Peninsula Standard Time)
    x = d.getDay(); //This returns a number, starting with 0 for Sunday

    dayOfweek = days[x];
    return dayOfweek;
}


function FormatDateTime() {

    //var formattedDate = new Date(startTime);
    //var d = formattedDate.getDate();
    //var m = formattedDate.getMonth() + 1;
    //var y = formattedDate.getFullYear();
    //var h = formattedDate.getHours();
    //h = (h < 10) ? ("0" + h) : h;

    //var mi = formattedDate.getMinutes();
    //mi = (mi < 10) ? ("0" + mi) : mi;

    //var s = formattedDate.getSeconds();
    //s = (s < 10) ? ("0" + s) : s;
    ////console.log("i (" + key + "): Day:" + day + ", OpeningTime: " + startTime + ", " + "ClosingTime:" + endTime)
    //console.log("key (" + Number(key+1) + "): formattedDate:" + m + "/" + d + "/" + y + " @ " + h + ":" + mi + ":" + s);
}

function GetCurrentDateTime() {
    var currentDateTime = "";
    var formattedDate = new Date();
    var d = formattedDate.getDate();
    var m = formattedDate.getMonth() + 1;
    var y = formattedDate.getFullYear();
    var h = formattedDate.getHours();
    h = (h < 10) ? ("0" + h) : h;

    var mi = formattedDate.getMinutes();
    mi = (mi < 10) ? ("0" + mi) : mi;

    var s = formattedDate.getSeconds();
    s = (s < 10) ? ("0" + s) : s;
    //console.log("i (" + key + "): Day:" + day + ", OpeningTime: " + startTime + ", " + "ClosingTime:" + endTime)
    //console.log("key (" + Number(key + 1) + "): formattedDate:" + m + "/" + d + "/" + y + " @ " + h + ":" + mi + ":" + s);

    currentDateTime = m + "/" + d + "/" + y + " @ " + h + ":" + mi + ":" + s;
    return currentDateTime;
}

function GetCurrentDateOnly() {
    var currentDateTime = "";
    var formattedDate = new Date();
    var d = formattedDate.getDate();
    var m = formattedDate.getMonth() + 1;
    var y = formattedDate.getFullYear();
    var h = formattedDate.getHours();
    h = (h < 10) ? ("0" + h) : h;

    var mi = formattedDate.getMinutes();
    mi = (mi < 10) ? ("0" + mi) : mi;

    var s = formattedDate.getSeconds();
    s = (s < 10) ? ("0" + s) : s;
    //console.log("i (" + key + "): Day:" + day + ", OpeningTime: " + startTime + ", " + "ClosingTime:" + endTime)
    //console.log("key (" + Number(key + 1) + "): formattedDate:" + m + "/" + d + "/" + y + " @ " + h + ":" + mi + ":" + s);

    currentDateTime = m + "/" + d + "/" + y;
    return currentDateTime;
}

//Function to Check Current Store GiftCard and Reward Enabled Permission
function CheckGiftCardPermission() {
    var storeId = 0;
    storeId = SetStoreId();
    var count = 0;
    //SetMenuNavigation(storeId);
    var carryOutEnabled = localStorage.getItem("CarryOutEnabled").trim();
    var giftCardsEnabled = localStorage.getItem("GiftCardsEnabled").trim();
    var giftCardProgramEnabled = localStorage.getItem("GiftCardProgramEnabled").trim();
    var rewardEnabled = localStorage.getItem("RewardsEnabled").trim();
    //alert(rewardEnabled);
    //alert("GiftCard: " + giftCardsEnabled);
    //alert("GiftCard Program: "+giftCardProgramEnabled);

    if (carryOutEnabled != "" && carryOutEnabled == "True") {
        //$('.menuCarryout').removeClass('disabled');
        //$('.menuStartStop').removeClass('disabled');
        $('.menuCarryout').show();
        $('.menuStartStop').show();
        $('.menuSettings').show();
        count++;
    }
    else {
        //$('.menuCarryout').addClass('disabled');
        //$('.menuStartStop').addClass('disabled');

        $('.menuCarryout').hide();
        $('.menuStartStop').hide();
        $('.menuSettings').hide();
    }

    if (giftCardsEnabled != "" && giftCardsEnabled == "True") {
        //$('.menuGiftcard').removeClass('disabled');
        $('.menuGiftcard').show();
        count++;
    }
    else {
        //$('.menuGiftcard').addClass('disabled');
        $('.menuGiftcard').hide();
    }


    if (rewardEnabled != "" && rewardEnabled == "True") {
        //$('.menuReward').removeClass('disabled');
        $('.menuReward').show();
        count++;
    }
    else {
        //$('.menuReward').addClass('disabled');
        $('.menuReward').hide();
    }


    if(count==1)
    {
        if (carryOutEnabled != "" && carryOutEnabled == "True")
        {
            $(".custom-toolbar").show();
            $(".footer-icon").css('width', '24%');
        }
        else {
            $(".custom-toolbar").hide();
        }
    }
    else if(count==2)
    {
        if (carryOutEnabled != "" && carryOutEnabled == "True") {
            $(".footer-icon").css('width', '26%');
        }
        else {
            $(".footer-icon").css('width', '17%');
        }
       
    }
    else {
        $(".custom-toolbar").show();
    }
}

function GoToGiftCardRedeem() {
    var storeId = 0;
    storeId = SetStoreId();
    window.location.href = "giftcardsredeem.html?StoreId=" + storeId;
}
function GoToGiftCardLoad() {
    var storeId = 0;
    storeId = SetStoreId();
    window.location.href = "giftcardsload.html?StoreId=" + storeId;
}
function GoToGiftCardOrder() {
    var storeId = 0;
    storeId = SetStoreId();
    window.location.href = "giftcardsorders.html?StoreId=" + storeId;
}
function GoToRewardsLoadRedeem() {
    var storeId = 0;
    storeId = SetStoreId();
    window.location.href = "rewards.html?StoreId=" + storeId;
}
function GoToRewardsNew() {
    var storeId = 0;
    storeId = SetStoreId();
    window.location.href = "add-rewards.html?StoreId=" + storeId;
}


function SearchGiftCard() {

    $('#btnLoadGiftCard').addClass("disabled");
    $('#btnRedeemGiftCard').addClass("disabled");
    $('#btnRefundGiftCard').addClass("disabled");
    $("#txtRedeem").css('border-bottom', bottomBorder)
    $("#txtLoad").css('border-bottom', bottomBorder)
    $("#txtRedeem").val("");
    $("#txtLoad").val("");
    $('#btnLoadGiftCard').text("Load");
    $('#btnRedeemGiftCard').text("Redeem");
    $('#btnRefundGiftCard').text("Refund");

    var storeId = 0;
    var params = getParams();
    storeId = SetStoreId();

    if (storeId > 0) {
        var cardCode = $('#txtCardCodeSearch').val();
        var phone = $('#txtPhone').val();

        if (phone == '') {
            phone = '0';
        }
        var pin = $("#txtPINSearch").val();
        if (pin == '') {
            pin = '0';
        }
        if (cardCode != "") {

            $("#txtCardCodeSearch").css('border-bottom', bottomBorder);
            $("#txtPhoneSearch").css('border-bottom', bottomBorder);
            $("#txtRedeem").css('border-bottom', bottomBorder);
            $("#txtLoad").css('border-bottom', bottomBorder);
            $("#txtPINSearch").css('border-bottom', bottomBorder);
            $('#dvOuter').show();
            $('#dvOuterText').html("");
            $('#hdnSearchCardType').val("");
            try {
                var url = global + "/SearchGiftCard?storeid=" + storeId + "&giftCardCode=" + encodeURIComponent(cardCode) + "&pin=" + pin;
                //alert(url);
                $('#tblRedeemHistory tbody').html("");
                var totalHistoryAmount = 0;
                $.getJSON(url, function (data) {
                    $('#tblRedeemHistory tbody').html("");
                    //console.log(data);
                    //console.log(data.replace(/"/g, "").indexOf("Invalid Card Code."));
                    if (data.replace(/"/g, "").indexOf("Card is not active.") > -1) {
                        $('#dvInner').hide();
                        $('#dvOuter').hide();
                        $('#dvOuterText').html("");
                        $("#txtPINSearch").val("");
                        callSweetAlertWarning("Gift Card is NOT Active. Please call (614)356-8000 to activate the Card.");
                    }
                   else if (data.replace(/"/g, "").indexOf("PIN is required.") > -1) {
                        $('#dvInner').hide();
                        //$('#btnLoadReward').prop("disabled", true);
                        //$('#btnRedeemReward').prop("disabled", true);
                        if (pin.trim() === '' || pin === '0') {
                            // console.log("1");
                            $('#dvInner').hide();
                            $('#dvOuter').hide();
                            $('#dvOuterText').html("");
                            $("#txtPINSearch").css('border-bottom', errorClassBorder);
                        }

                    }
                    else if (data.replace(/"/g, "").indexOf("Invalid PIN.") > -1) {
                        $('#dvInner').hide();
                        $('#dvOuter').hide();
                        $('#dvOuterText').html("");
                        $("#txtPINSearch").val("");
                        callSweetAlertWarning("GiftCard Code and PIN do not match.");

                    }
                    else if (data.replace(/"/g, "").indexOf("Gift Card was never used.") > -1) {
                        $('#dvInner').hide();
                        $('#dvOuter').hide();
                        $('#dvOuterText').html("");
                        $("#txtPINSearch").val("");
                        callSweetAlertWarning("Multiline text", "Gift Card was used, \n Please use New screen to create the new Card.".replace("\n", '<br>'));
                    }
                    else if (data.replace(/"/g, "").indexOf("Invalid Card Code.") > -1) {
                        //$('#btnLoadReward').prop("disabled", true);
                        //$('#btnRedeemReward').prop("disabled", true);
                        //console.log("a");
                        $('#dvInner').hide();
                        $('#dvOuter').hide();

                        callSweetAlertWarning("Gift Card not found.");
                    }
                    else if (data.replace(/"/g, "").indexOf("No record(s) found.") > -1) {
                        //$('#btnLoadReward').prop("disabled", true);
                        //$('#btnRedeemReward').prop("disabled", true);
                        $('#dvInner').hide();
                        $('#dvOuter').show();
                        $('#dvOuterText').html("");
                        $('#dvOuterText').html("No records found.");
                    }
                    else {
                        $("#txtPhoneSearch").css('border-bottom', bottomBorder);
                        $("#txtCardCodeSearch").css('border-bottom', bottomBorder);
                        $("#txtRedeem").css('border-bottom', bottomBorder);
                        $("#txtLoad").css('border-bottom', bottomBorder);

                        $.each(JSON.parse(data), function (index, value) {
                            //console.log(value);
                            $('#btnRedeemGiftCard').removeClass("disabled");
                            $('#btnLoadGiftCard').removeClass("disabled");
                            $('#btnRefundGiftCard').removeClass("disabled");
                            if (value.Type == "GiftCardInfo") {
                                var htmlHistory = "";
                                var firstName = "";
                                var lastName = "";
                                var email = "";
                                var phoneNumber = "";
                                var pin = "";
                                var orderId = "";
                                var amount = "";
                                var balanceAmount = "";
                                var cardType = "";
                                if (value.CUSTOMERFIRSTNAME != "") {
                                    firstName = value.CUSTOMERFIRSTNAME;
                                }
                                if (value.CUSTOMERLASTNAME != "") {
                                    lastName = value.CUSTOMERLASTNAME;
                                }
                                if (value.CUSTOMEREMAIL != "") {
                                    email = value.CUSTOMEREMAIL;
                                }
                                if (value.CUSTOMERPHONE != "") {
                                    phoneNumber = value.CUSTOMERPHONE;
                                }
                                else {
                                    $("#txtPhoneSearch").val("");
                                }
                                if (value.PIN != "") {
                                    $("#txtPINSearch").val(value.PIN);

                                }
                                else {
                                    $("#txtPINSearch").val("");
                                }

                                if (value.ORDERID != "") {
                                    orderId = value.ORDERID;
                                }
                                if (value.ORIGINALAMOUNT != "") {
                                    amount = FormatDecimal(value.ORIGINALAMOUNT);
                                    //amount = value.AMOUNT;
                                }

                                if (value.BALANCEAMOUNT != "") {
                                    balanceAmount = FormatDecimal(value.BALANCEAMOUNT);
                                    //balanceAmount = value.BALANCEAMOUNT;
                                }
                                else {
                                    balanceAmount = "$0.00";
                                }

                                if (value.CARDTYPE!=null &&  value.CARDTYPE != "") {
                                    cardType = value.CARDTYPE;
                                }
                                
                                $('#hdnSearchCardType').val(cardType);
                                //console.log("Card Balance: " + balanceAmount);
                                $('#lblCutomerName').html(firstName + " " + lastName);
                                if (phoneNumber.length == 10)
                                    $("#lblCutomerPhone").html(formatPhoneNumber(phoneNumber));
                                else
                                    $("#lblCutomerPhone").html(phoneNumber);
                                if (phoneNumber == "")
                                    $('#iconPhone').hide();
                                else
                                    $('#iconPhone').show();
                                if (email == "")
                                    $('#iconEmail').hide();
                                else
                                    $('#iconEmail').show();
                                if (email.indexOf("@bistroux.com") > -1)
                                {
                                    $("#giftcard #lblEmail").html("");
                                }

                                else {
                                    $("#giftcard #lblEmail").html(email);
                                }
                                
                                $('#giftcard #hdnSelectedOrderId').val(orderId);
                                $('#giftcard #lblCurrentBalance').html(" " + balanceAmount);
                                $('#giftcard #lblOriginalValue').html(" " + amount);

                            }
                            else if (value.Type == "UsedHistory") {
                                var notes = "";
                                if (value.NOTES != null && value.NOTES != undefined && value.NOTES != "")
                                {
                                    notes = value.NOTES;
                                }
                                //console.log(value.GiftCardId);
                                var usedDate = value.USEDDATE.replace("~", " @ ");
                                
                               
                                if (notes != "")
                                {
                                    htmlHistory += "<tr onclick=\"DisplayRefundReason(" + value.ID + ",'" + notes + "','" + usedDate + "','" + FormatDecimal(value.USEDVALUE) + "','" + cardCode + "');\">";
                                    htmlHistory += "<td class=\"popup-highlighted-row\">" + usedDate + "</td>";
                                    htmlHistory += "<td class=\"popup-highlighted-row\">" + value.TRANSACTIONSTORE + "</td>";
                                    //console.log("NOTES: " + value.NOTES + " Used Value: " + value.USEDVALUE);
                                    if (value.USEDTYPE == "Load" && value.USEDVALUE != "") {
                                        htmlHistory += "<td class=\"popup-highlighted-row\" style=\"text-align:right;\"> +" + FormatDecimal(value.USEDVALUE) + "</td>";
                                        totalHistoryAmount = parseFloat(totalHistoryAmount) + parseFloat(value.USEDVALUE);
                                    }
                                    else if (value.USEDVALUE != "") {
                                        htmlHistory += "<td class=\"popup-highlighted-row\" style=\"text-align:right;\">-" + FormatDecimal(value.USEDVALUE) + "</td>";
                                        //totalHistoryAmount = parseFloat(totalHistoryAmount) + parseFloat(value.USEDVALUE);
                                    }
                                    else {
                                        htmlHistory += "<td class=\"popup-highlighted-row\" style=\"text-align:right;\"> </td>";
                                    }
                                    htmlHistory += "<td class=\"popup-highlighted-row\" style=\"text-align:center\">" + value.REGISTER + "</td>";
                                }
                                else {
                                    htmlHistory += "<tr>";
                                    htmlHistory += "<td>" + usedDate + "</td>";
                                    htmlHistory += "<td>" + value.TRANSACTIONSTORE + "</td>";
                                    //console.log("NOTES: " + value.NOTES + " Used Value: " + value.USEDVALUE);
                                    if (value.USEDTYPE == "Load" && value.USEDVALUE != "") {
                                        htmlHistory += "<td style=\"text-align:right;\"> +" + FormatDecimal(value.USEDVALUE) + "</td>";
                                        totalHistoryAmount = parseFloat(totalHistoryAmount) + parseFloat(value.USEDVALUE);
                                    }
                                    else if (value.USEDVALUE != "") {
                                        htmlHistory += "<td style=\"text-align:right;\">-" + FormatDecimal(value.USEDVALUE) + "</td>";
                                        //totalHistoryAmount = parseFloat(totalHistoryAmount) + parseFloat(value.USEDVALUE);
                                    }
                                    else {
                                        htmlHistory += "<td style=\"text-align:right;\"> </td>";
                                    }
                                    htmlHistory += "<td style=\"text-align:center\">" + value.REGISTER + "</td>";
                                }
                                
                                htmlHistory += "</tr>";
                                $('#tblRedeemHistory tbody').append(htmlHistory);
                            }
                        });
                        $('#dvInner').show();
                        $('#myModal').hide();
                        $('#dvOuter').hide();
                        $('#dvOuterText').html("");
                    }
                });
            }
            catch (e) {

            }
        }
        else {
            //$('#dvOuter').hide();
            //$('#dvOuterText').html("");
            $('#dvInner').hide();
            $("#txtCardCodeSearch").css('border-bottom', errorClassBorder);
            //$('#dvOuter').show();
            //$('#dvOuterText').html("");
            //$('#dvOuterText').html("Card Code is required.");
        }
    }
    else {
        window.location.href = "index.html";
    }

}

function LoadGiftCard() {
   
    $("#txtRedeem").css('border-bottom', bottomBorder);
    var storeId = 0;
    storeId = SetStoreId();
    var cardCode = $('#txtCardCodeSearch').val();
    var phone = $('#txtPhoneSearch').val();
    if (phone == '') {
        phone = '0';
    }
    var pin = $("#txtPINSearch").val();
    if (pin == '') {
        pin = '0';
    }
    var amount = $('#txtLoad').val();
    if (amount == '')
        amount = '0';
  
    var register = $('#ddlRegister').val();
    if (cardCode != "" && amount != "" && Number(amount)>0) {
        $('#dvOuter').hide();
        $('#dvOuterText').html("");

        var regex = /^[a-zA-Z0-9.\-_]+$/;
        var giftCardCode = "";
        if (regex.test(cardCode) == true) {
        }
        else {
            var str = cardCode.replace(/[^0-9\-]/g, '');
            cardCode = str.substring(0, 16);
        }

       
        try {
            if ($('#hdnSearchCardType').val().toUpperCase() == "BISTROUX")
            {
                OpenGiftCardPaymentPopup();
            }
            else {
                $('#btnLoadGiftCard').text("Loading...");
                url = global + "/GiftCardLoad?storeid=" + storeId + "&giftCardCode=" + encodeURIComponent(cardCode) + "&phone=" + phone + "&amount=" + amount + "&register=" + register + "&pin=" + pin;
                var totalHistoryAmount = 0;
                $.getJSON(url, function (data) {
                    $('#btnLoadGiftCard').text("Load");
                    $("#txtCardCodeSearch").css('border-bottom', bottomBorder);
                    $("#txtLoad").css('border-bottom', bottomBorder);
                    $("#txtPhoneSearch").css('border-bottom', bottomBorder);
                    if (data.replace(/"/g, "").indexOf("PIN is required.") > -1) {
                        $('#dvInner').hide();
                        //$('#btnLoadReward').prop("disabled", true);
                        //$('#btnRedeemReward').prop("disabled", true);
                        if (pin.trim() === '' || pin === '0') {
                            // console.log("1");
                            $('#dvInner').hide();
                            $('#dvOuter').hide();
                            $('#dvOuterText').html("");
                            $("#txtPINSearch").css('border-bottom', errorClassBorder);
                        }

                    }
                    else if (data.replace(/"/g, "").indexOf("Invalid PIN.") > -1) {
                        $('#dvInner').hide();
                        $('#dvOuter').hide();
                        $('#dvOuterText').html("");
                        $("#txtPINSearch").val("");
                        callSweetAlertWarning("Invalid PIN.");

                    }
                        //console.log("Load: " + data);
                    else if (data.replace(/"/g, "").indexOf("Phone is not valid.") > -1) {
                        $('#tblRedeemHistory tbody').html("");
                        $('#dvInner').hide();
                        //$('#alertHearderText').html("Message");
                        if (phone == '' || phone == '0') {
                            $('#dvInner').hide();

                            $("#txtPhoneSearch").css('border-bottom', errorClassBorder);
                        }
                        else {
                            $("#txtPhoneSearch").css('border-bottom', bottomBorder);
                            $('#dvInner').hide();
                            $('#dvOuter').hide();

                            callSweetAlertWarning("Invalid Phone Number.");
                        }
                    }
                    else if (data.replace(/"/g, "").indexOf("Invalid Card Code.") > -1) {
                        $('#tblRedeemHistory tbody').html("");
                        $('#dvInner').hide();
                        $('#dvOuter').hide();
                        callSweetAlertWarning("Invalid Gift Card Code.");
                    }
                    else if (data.replace(/"/g, "").indexOf("No record(s) found.") > -1) {
                        $('#tblRedeemHistory tbody').html("");
                        $('#dvInner').hide();
                        $('#dvOuter').show();
                        $('#dvOuterText').html("");
                        $('#dvOuterText').html("No records found.");
                    }
                    else if (data.replace(/"/g, "").indexOf("Amount is required.") > -1) {
                        //$('#dvInner').hide();
                        $('#dvOuter').hide();
                        $('#dvOuterText').html("");
                        $("#txtLoad").css('border-bottom', errorClassBorder);
                    }
                    else {
                        SearchGiftCard();
                        if (data.replace(/"/g, "").indexOf("Gift Card loaded successfully")) {
                            callSweetAlertSuccess("Gift Card loaded successfully.")
                        }
                        $('#txtLoad').val("");
                        //$('#alertHearderText').html("Message");
                        //$('#alertBodyText').html(data.replace(/"/g, ""));
                    }
                });
            }
           
        }
        catch (e) {

        }
    }
    else {
        //$('#dvInner').hide();
        if (cardCode == "") {
            $("#txtCardCodeSearch").css('border-bottom', errorClassBorder);

            $("#txtLoad").css('border-bottom', bottomBorder);
        }
        if (amount == "" || amount == "0") {
            $("#txtCardCodeSearch").css('border-bottom', bottomBorder);

            $("#txtLoad").css('border-bottom', errorClassBorder);
        }
    }
}

function LoadNewGiftCard() {

    $("#txtCardCode").css('border-bottom', bottomBorder);
    $("#txtAmount").css('border-bottom', bottomBorder);
    $("#txtEmail").css('border-bottom', bottomBorder);
    $("#txtName").css('border-bottom', bottomBorder);

    $("#txtCCNumber").css('border-bottom', bottomBorder);
    $("#txtCCName").css('border-bottom', bottomBorder);
    $("#txtCVV").css('border-bottom', bottomBorder);
    $("#ddlCCMonth").css('border-bottom', bottomBorder);
    $("#ddlCCYear").css('border-bottom', bottomBorder);

    $('#dvOuterText').removeAttr("style");
    var storeId = 0;
    storeId = SetStoreId();
    var cardCode = $('#txtCardCode').val();
    var phone = $('#txtPhone').val();
    if (phone == '') {
        phone = '0';
    }
    var amount = $('#txtAmount').val().trim();
    if (amount == '')
        amount = '0';
    if (cardCode != "" && amount != "" && amount != "0") {
        
            var url = global + "/DoesGiftCardExist?giftCardCode=" + encodeURIComponent(cardCode);
            $.getJSON(url, function (data) {
                console.log(data)

                //$("#hdnValidateCard").val(true);
                var obj = JSON.parse(data);
                localStorage.setItem('GiftCardDetails', data);
                if (obj.GiftCardExists == true) {
                    if (obj.Amount != undefined && obj.Amount != null && Number(obj.Amount) > 0) {                        
                        if (obj.IsGiftCardActivated != undefined && obj.IsGiftCardActivated == false) {
                            callSweetAlertWarning("Gift Card is NOT Active. Please call (614)356-8000 to activate the Card.");                            
                        }
                        else {
                            callSweetAlertWarning("Gift Card Balance = $" + obj.Amount + "\n Please use Load screen to load additional amounts.");
                        }
                        $("#txtCardCode").val("");
                        $("#txtCardCode").css('border-bottom', errorClassBorder);
                        $('#btnAddCard').text("Add Card");
                        $("#hdnValidateCard").val(false);
                        $("#hdnCardType").val("");                        
                    }
                    else {
                        if (obj.IsGiftCardActivated != undefined && obj.IsGiftCardActivated == true) {
                            callSweetAlertWarning("Gift Card was used before, current Balance = $0. \n Please use Load screen to load additional amounts.");
                            $("#txtCardCode").val("");
                            $("#txtCardCode").css('border-bottom', errorClassBorder);
                            $('#btnAddCard').text("Add Card");
                            $("#hdnValidateCard").val(false);
                            $("#hdnCardType").val("");
                        }
                        else {
                            if (obj.CardType.toUpperCase() != "STORE") {
                                var ccName = $("#txtCCName").val().trim();
                                var ccNumber = $("#txtCCNumber").val().trim();
                                var cvv = $("#txtCVV").val().trim();
                                var expMonth = $("#ddlCCMonth").val();
                                var expYear = $("#ddlCCYear").val();
                                var paymentType = $("#hdnSelectedPaymentType").val();

                                if (paymentType != "" && paymentType.toUpperCase() == "CASH") {
                                    var cardInfo = localStorage.getItem('GiftCardDetails');
                                    var obj = JSON.parse(cardInfo);
                                    //AddNewGiftCard(obj.GiftCardExists, obj.PIN, obj.Amount, obj.GiftCardId, obj.GiftCardStoreId,
                                    //    obj.CardType, ccName, ccNumber, cvv, expMonth, expYear, paymentType);
                                    AddUpdateGiftCardRecord(obj.GiftCardExists, obj.Amount, obj.GiftCardId, cardCode, obj.CardType, ccName, ccNumber, cvv, expMonth, expYear, paymentType);
                                }
                                else if (ccName != "" && ccNumber != "" && cvv != "" && expMonth != "" && expYear != "") {
                                    var cardInfo = localStorage.getItem('GiftCardDetails');
                                    var obj = JSON.parse(cardInfo);
                                    ////AddNewGiftCard(obj.GiftCardExists, obj.PIN, obj.Amount, obj.GiftCardId, obj.GiftCardStoreId,
                                    ////    obj.CardType, ccName, ccNumber, cvv, expMonth, expYear, paymentType);
                                    AddUpdateGiftCardRecord(obj.GiftCardExists, obj.Amount, obj.GiftCardId, cardCode, obj.CardType, ccName, ccNumber, cvv, expMonth, expYear, paymentType);
                                }
                                else {
                                    if (ccName == "") {
                                        $("#txtCCName").css('border-bottom', errorClassBorder);
                                    }
                                    if (ccNumber == "" || ccNumber == "0") {
                                        $("#txtCCNumber").css('border-bottom', errorClassBorder);
                                    }
                                    if (cvv == "" || cvv == "0") {
                                        $("#txtCVV").css('border-bottom', errorClassBorder);
                                    }
                                    if (expMonth == "") {
                                        $("#ddlCCMonth").css('border-bottom', errorClassBorder);
                                    }
                                    if (expYear == "") {
                                        $("#ddlCCYear").css('border-bottom', errorClassBorder);
                                    }
                                }
                            }
                            else {
                                var cardInfo = localStorage.getItem('GiftCardDetails');
                                var obj = JSON.parse(cardInfo);
                                AddUpdateGiftCardRecord(obj.GiftCardExists, obj.Amount, obj.GiftCardId, cardCode, obj.CardType, "", "", "", "", "", "");

                            }
                        }
                    }

                    ////if (obj.PIN != undefined && obj.PIN != null && Number(obj.PIN) > 0) {
                    ////    if (obj.Amount != undefined && obj.Amount != null && Number(obj.Amount) > 0) {
                    ////        callSweetAlertWarning("Card is already in the system.");
                    ////        $("#txtCardCode").val("");
                    ////        $("#txtCardCode").css('border-bottom', errorClassBorder);
                    ////        $('#btnAddCard').text("Add Card");
                    ////        $("#hdnValidateCard").val(false);
                    ////        $("#hdnCardType").val("");
                    ////    }
                    ////    else {
                    ////        if (obj.CardType.toString().toUpperCase() == "BISTROUX") {
                    ////            $("#hdnValidateCard").val(true);
                    ////            $("#hdnCardType").val(obj.CardType);
                    ////            //console.log('Popup Open for payment');
                    ////            $("#liPaymentType").show();
                    ////            $("#liCCName").show();
                    ////            $("#liCCNo").show();
                    ////        }
                    ////        else {
                    ////            $("#liPaymentType").hide();
                    ////            $("#liCCName").hide();
                    ////            $("#liCCNo").hide();
                    ////            //console.log(2)
                    ////            AddNewGiftCard(obj.GiftCardExists, obj.PIN, obj.Amount, obj.GiftCardId, obj.GiftCardStoreId, obj.CardType, "", "", "", "", "", "");
                    ////        }
                    ////    }
                    ////}
                    ////else {
                    ////    callSweetAlertWarning("Card is already in the system.");
                    ////    $("#txtCardCode").val("");
                    ////    $("#txtCardCode").css('border-bottom', errorClassBorder);
                    ////    $('#btnAddCard').text("Add Card");
                    ////    $("#hdnValidateCard").val(false);
                    ////    $("#hdnCardType").val("");
                    ////}

                }
                else {
                    $("#liPaymentType").hide();
                    $("#liCCName").hide();
                    $("#liCCNo").hide();
                    // console.log(3)
                    AddUpdateGiftCardRecord(obj.GiftCardExists, obj.Amount, obj.GiftCardId, cardCode, obj.CardType, "", "", "", "", "", "");
                }
            });
        


        ////var codeValidated = $("#hdnValidateCard").val();
        ////if (codeValidated.toString().toUpperCase() == "TRUE")
        ////{
        ////    if ($("#hdnCardType").val().toString().toUpperCase() == "BISTROUX")
        ////    {
        ////        var ccName = $("#txtCCName").val().trim();
        ////        var ccNumber = $("#txtCCNumber").val().trim();
        ////        var cvv = $("#txtCVV").val().trim();
        ////        var expMonth = $("#ddlCCMonth").val();
        ////        var expYear = $("#ddlCCYear").val();
        ////        var paymentType = $("#hdnSelectedPaymentType").val();

        ////        if (paymentType != "" && paymentType.toUpperCase() == "CASH")
        ////        {
        ////            var cardInfo = localStorage.getItem('GiftCardDetails');
        ////            var obj = JSON.parse(cardInfo);
        ////            AddNewGiftCard(obj.GiftCardExists, obj.PIN, obj.Amount, obj.GiftCardId, obj.GiftCardStoreId,
        ////                obj.CardType, ccName, ccNumber, cvv, expMonth, expYear, paymentType);
        ////        }
        ////        else if(ccName!="" && ccNumber!="" && cvv!="" && expMonth!="" && expYear!="" )
        ////        {
        ////            var cardInfo = localStorage.getItem('GiftCardDetails');                    
        ////            var obj = JSON.parse(cardInfo);
        ////            AddNewGiftCard(obj.GiftCardExists, obj.PIN, obj.Amount, obj.GiftCardId, obj.GiftCardStoreId,
        ////                obj.CardType, ccName, ccNumber, cvv, expMonth, expYear,paymentType);
        ////        }
        ////        else {
        ////            if (ccName == "") {
        ////                $("#txtCCName").css('border-bottom', errorClassBorder);
        ////            }
        ////            if (ccNumber == "" || ccNumber=="0") {
        ////                $("#txtCCNumber").css('border-bottom', errorClassBorder);
        ////            }
        ////            if (cvv == "" || cvv=="0") {
        ////                $("#txtCVV").css('border-bottom', errorClassBorder);
        ////            }
        ////            if (expMonth == "") {
        ////                $("#ddlCCMonth").css('border-bottom', errorClassBorder);
        ////            }
        ////            if (expYear == "") {
        ////                $("#ddlCCYear").css('border-bottom', errorClassBorder);
        ////            }
        ////        }
        ////    }
        ////    else {
        ////        var cardInfo = localStorage.getItem('GiftCardDetails');
        ////        var obj = JSON.parse(cardInfo);
        ////        AddNewGiftCard(obj.GiftCardExists, obj.PIN, obj.Amount, obj.GiftCardId, obj.GiftCardStoreId, obj.CardType, "", "", "", "", "","");

        ////    }
        ////}
        
       
    }
    else {
        $('#dvInner').hide();
        if (cardCode == "") {
            $("#txtCardCode").css('border-bottom', errorClassBorder);
            //$("#txtCardCode").css('border-width', '3px');

        }
        if (amount == "" || amount == "0") {
            $("#txtAmount").css('border-bottom', errorClassBorder);
        }
    }
   
}

function AddUpdateGiftCardRecord(exists, gcamount, giftcardId, cardcode, cardType, ccName, ccNumber, cvv, expMonth, expYear, paymentType) {
    var storeId = 0;
    storeId = SetStoreId();
    var cardCode = $('#tab-giftcard-new #txtCardCode').val();
    var phone = $('#tab-giftcard-new #txtPhone').val();
    if (phone == '') {
        phone = '0';
    }
    var amount = $('#tab-giftcard-new #txtAmount').val().trim();
    if (amount == '')
        amount = '0';
    var regex = /^[a-zA-Z0-9.\-_]+$/;
    var giftCardCode = "";
    if (regex.test(cardCode) == true) {
    }
    else {
        var str = cardCode.replace(/[^0-9\-]/g, '');
        cardCode = str.substring(0, 16);
    }
    if (isEmail("#tab-giftcard-new #txtEmail") == true) {
        var customerId = "0";
        $('#btnAddCard').text("Adding Card...");
        try {
            if (localStorage.getItem("CustomerId") != null) {
                customerId = localStorage.getItem("CustomerId").trim();
            }

            var email = encodeURIComponent($('#tab-giftcard-new #txtEmail').val());
            var name = encodeURIComponent($('#tab-giftcard-new #txtName').val());
            var url = global + "/AddUpdateGiftCardRecord?storeid=" + storeId + "&giftCardCode=" + encodeURIComponent(cardCode) + "&giftcardId=" + giftcardId + "&phone=" + phone + "&amount=" + amount
                + "&email=" + email + "&name=" + name + "&giftCardExists=" + exists + "&gcamount=" + gcamount + "&cardType=" + cardType +
                "&ccName=" + ccName + "&ccNumber=" + ccNumber + "&cvv=" + cvv + "&expMonth=" + expMonth + "&expYear=" + expYear + "&paymentType=" + paymentType;
            //console.log('name: '+name)
            var totalHistoryAmount = 0;
            $.getJSON(url, function (data) {
                $('#btnAddCard').text("Add Card");
                $("#tab-giftcard-new #txtCardCode").css('border-bottom', bottomBorder);
                $("#tab-giftcard-new #txtAmount").css('border-bottom', bottomBorder);
                $("#tab-giftcard-new #txtPhone").css('border-bottom', bottomBorder);
                $("#tab-giftcard-new #txtName").css('border-bottom', bottomBorder);
                $("#tab-giftcard-new #txtEmail").css('border-bottom', bottomBorder);



                if (data.replace(/"/g, "").indexOf("Card is already in the system.") > -1) {
                    $('#dvOuter').hide();
                    callSweetAlertWarning("Card is already in the system.");
                    $("#tab-giftcard-new #txtCardCode").val("");
                    $("#tab-giftcard-new #txtCardCode").css('border-bottom', errorClassBorder);
                    $('#btnAddCard').text("Add Card");
                    $("#hdnValidateCard").val(false);
                    $("#hdnCardType").val("");
                }
                else if (data.replace(/"/g, "").indexOf("Card loaded successfully.") > -1) {
                    $("#hdnValidateCard").val(false);
                    $("#hdnCardType").val("");
                    $('#dvOuter').hide();
                    window.localStorage.removeItem("GiftCardDetails");
                    //$('#dvOuter').show();
                    //$('#dvOuterText').html("");
                    //$('#dvOuterText').html("Card loaded successfully.");
                    //$('#dvOuterText').attr("style", "color:#3c763d !important");

                    var popuphtml = "<p><span style='color:#000;'>Card Code:  </span><span class=\"main-one\">" + decodeURIComponent($("#txtCardCode").val()) + "</span></p>";

                    if ($('#tab-giftcard-new #txtAmount').val() != "")
                        popuphtml = popuphtml + "<p><span style='color:#000;'>Amount:  </span><span class=\"main-two\">" + FormatDecimal(amount) + "</span></p>";
                    if ($('#tab-giftcard-new #txtName').val() != "")
                        popuphtml = popuphtml + "<p>" + decodeURIComponent(name) + "</p>";

                    if ($('#tab-giftcard-new #txtEmail').val() != "")
                        popuphtml = popuphtml + "<p>" + decodeURIComponent(email) + "</p>";

                    if ($('#tab-giftcard-new #txtPhone').val() != "") {
                        if ($('#tab-giftcard-new #txtPhone').val().length == 10)
                            popuphtml = popuphtml + "<p>" + FormatPhoneNumber(phone) + "</p>";
                        else
                            popuphtml = popuphtml + "<p>" + phone + "</p>";
                    }

                    swal({
                        title: "New Card loaded successfully.",
                        html: popuphtml,
                        confirmButtonText: "OK",
                        type: "success",
                        confirmButtonColor: '#3b9847',
                    });

                    $('#btnAddCard').text("Add Card");

                    $('#tab-giftcard-new #txtAmount').val("");
                    $('#tab-giftcard-new #txtPhone').val("");
                    $('#tab-giftcard-new #txtCardCode').val("");
                    $('#tab-giftcard-new #txtEmail').val("");
                    $('#tab-giftcard-new #txtName').val("");
                    $('#tab-giftcard-new #txtCCName').val("");
                    $('#tab-giftcard-new #txtCCNumber').val("");
                    $('#tab-giftcard-new #txtCVV').val("");
                    $('#tab-giftcard-new #ddlCCMonth').val("");
                    $('#tab-giftcard-new #ddlCCYear').val("");

                    $("#liPaymentType").hide();
                    $("#liCCName").hide();
                    $("#liCCNo").hide();

                }
                else if (data.replace(/"/g, "").indexOf("failed") > -1) {
                    callSweetAlertWarning(data.replace(/"/g, ""));
                }
            });
        }
        catch (e) {

        }
    }
}

function RedeemGiftCard() {
    var storeId = 0;
    var params = getParams();
    $("#txtLoad").css('border-bottom', bottomBorder);
    storeId = SetStoreId();
    var cardCode = $('#txtCardCodeSearch').val();
    var phone = $('#txtPhoneSearch').val();
    if (phone == '') {
        phone = '0';
    }
    var pin = $("#txtPINSearch").val();
    if (pin == '') {
        pin = '0';
    }
    var amount = $('#txtRedeem').val();
    if (amount == '')
        amount = '0';
    var register = $('#ddlRegister').val();
    if (storeId > 0) {
        if (cardCode != "" && amount != "" && amount != "0") {
            $('#btnRedeemGiftCard').text("Redeeming...");
            //$('#btnRedeemReward').css("font-size", "22px");
            try {
                url = global + "/GiftCardRedeem?storeid=" + storeId + "&giftCardCode=" + encodeURIComponent(cardCode) + "&phone=" + phone + "&amount=" + amount + "&register=" + register + "&pin=" + pin;
                //alert(url);
                $('#tblRedeemHistory tbody').html("");
                var totalHistoryAmount = 0;
                $.getJSON(url, function (data) {
                    $('#btnRedeemGiftCard').text("Redeem");
                    //$('#btnRedeemReward').css("font-size", "24px");
                    $("#txtCardCodeSearch").css('border-bottom', bottomBorder);
                    $("#txtRedeem").css('border-bottom', bottomBorder);
                    $("#txtPhoneSearch").css('border-bottom', bottomBorder);


                    if (data.replace(/"/g, "").indexOf("PIN is required.") > -1) {
                        $('#dvInner').hide();
                        //$('#btnLoadReward').prop("disabled", true);
                        //$('#btnRedeemReward').prop("disabled", true);
                        if (pin.trim() === '' || pin === '0') {
                            // console.log("1");
                            $('#dvInner').hide();
                            $('#dvOuter').hide();
                            $('#dvOuterText').html("");
                            $("#txtPINSearch").css('border-bottom', errorClassBorder);
                        }

                    }
                    else if (data.replace(/"/g, "").indexOf("Invalid PIN.") > -1) {
                        $('#dvInner').hide();
                        $('#dvOuter').hide();
                        $('#dvOuterText').html("");
                        $("#txtPINSearch").val("");
                        callSweetAlertWarning("Invalid PIN.");

                    }
                        //console.log("Load: " + data);
                    else if (data.replace(/"/g, "").indexOf("Phone is not valid.") > -1) {
                        $('#dvInner').hide();
                        if (phone == '' || phone == '0') {
                            $('#dvInner').hide();
                            $('#dvOuter').hide();
                            $("#txtPhoneSearch").css('border-bottom', errorClassBorder);
                        }
                        else {
                            $("#txtPhoneSearch").css('border-bottom', bottomBorder);
                            $('#dvInner').hide();
                            $('#dvOuter').hide();

                            callSweetAlertWarning("Invalid Phone Number.");
                        }
                    }
                    else if (data.replace(/"/g, "").indexOf("Invalid Card Code.") > -1) {
                        $('#dvInner').hide();
                        $('#dvOuter').hide();

                        callSweetAlertWarning("Invalid Gift Card Code.");
                    }
                    else if (data.replace(/"/g, "").indexOf("No record(s) found.") > -1) {
                        $('#dvInner').hide();
                        $('#dvOuter').show();
                        $('#dvOuterText').html("");
                        $('#dvOuterText').html("No records found.");
                    }
                    else if (data.replace(/"/g, "").indexOf("Amount exceeds available Balance.") > -1) {
                        $('#dvInner').show();
                        SearchGiftCard();

                        callSweetAlertWarning("Amount exceeds available Balance.");
                    }
                    else {

                        SearchGiftCard();
                        if (data.replace(/"/g, "").indexOf("Gift Card redeemed successfully")) {
                            callSweetAlertSuccess("Gift Card redeemed successfully.")
                        }
                        $('#txtRedeem').val("");
                        var displayMessage = data.replace(/"/g, "").split('|');
                        if (displayMessage.length > 1) {
                            $('#alertBodyText').html(displayMessage[0]);
                            $('#alertHearderText').html(displayMessage[1]);
                            $('#dvOuter').hide();
                            $('#dvOuterText').html("");
                        }
                        else {
                            $('#alertHearderText').html("");
                            $('#alertBodyText').html(data.replace(/"/g, ""));
                            $('#dvOuter').hide();
                            $('#dvOuterText').html("");
                        }
                    }
                });
            }
            catch (e) {

            }
        }
        else {
            if (cardCode == "") {
                $('#dvInner').hide();
                //$('#dvOuter').show();
                //$('#dvOuterText').html("");
                //$('#dvOuterText').html("Card Code is required.");
                $("#txtCardCode").css('border-color', '#ff4848');
                $("#txtCardCode").css('border-width', '3px');
                $("#txtRedeem").css('border-color', '#dedede');
                $("#txtRedeem").css('border-width', '1px');
            }
            else if (amount == "" || amount == "0") {
                //$('#dvOuter').show();
                //$('#dvOuterText').html("");
                //$('#dvOuterText').html("Amount is required.");
                $("#txtCardCodeSearch").css('border-bottom', bottomBorder);
                $("#txtRedeem").css('border-bottom', errorClassBorder);
            }
            $('#btnRedeemGiftCard').text("Redeem");
        }
    }
    else {
        window.location.href = "index.html";
    }

}


function AddNewGiftCard(exists,pin,gcamount,giftcardId,giftcardStoreId,cardType,ccName,ccNumber,cvv,expMonth,expYear,paymentType)
{
    var storeId = 0;
    storeId = SetStoreId();
    var cardCode = $('#tab-giftcard-new #txtCardCode').val();
    var phone = $('#tab-giftcard-new #txtPhone').val();
    if (phone == '') {
        phone = '0';
    }
    var amount = $('#tab-giftcard-new #txtAmount').val().trim();
    if (amount == '')
        amount = '0';
    var regex = /^[a-zA-Z0-9.\-_]+$/;
    var giftCardCode = "";
    if (regex.test(cardCode) == true) {
    }
    else {
        var str = cardCode.replace(/[^0-9\-]/g, '');
        cardCode = str.substring(0, 16);
    }
    if (isEmail("#tab-giftcard-new #txtEmail") == true) {
        var customerId = "0";
        $('#btnAddCard').text("Adding Card...");
        try {
            if (localStorage.getItem("CustomerId") != null) {
                customerId = localStorage.getItem("CustomerId").trim();
            }
          
            var email = encodeURIComponent($('#tab-giftcard-new #txtEmail').val());
            var name = encodeURIComponent($('#tab-giftcard-new #txtName').val());
            var url = global + "/AddNewGiftCard?storeid=" + storeId + "&giftCardCode=" + encodeURIComponent(cardCode) + "&phone=" + phone + "&amount=" + amount + "&customerId="
                + customerId + "&email=" + email + "&name=" + name + "&giftCardExists=" + exists + "&pin=" + pin + "&gcamount="
                + gcamount + "&giftcardId=" + giftcardId + "&cardType=" + cardType + "&giftCardStoreId="
                + giftcardStoreId+"&ccName="+ccName+"&ccNumber="+ccNumber+"&cvv="+cvv+"&expMonth="+expMonth+"&expYear="+expYear+"&paymentType="+paymentType;
            //console.log('name: '+name)
            var totalHistoryAmount = 0;
            $.getJSON(url, function (data) {
                $('#btnAddCard').text("Add Card");
                $("#tab-giftcard-new #txtCardCode").css('border-bottom', bottomBorder);
                $("#tab-giftcard-new #txtAmount").css('border-bottom', bottomBorder);
                $("#tab-giftcard-new #txtPhone").css('border-bottom', bottomBorder);
                $("#tab-giftcard-new #txtName").css('border-bottom', bottomBorder);
                $("#tab-giftcard-new #txtEmail").css('border-bottom', bottomBorder);
                
              
                
                if (data.replace(/"/g, "").indexOf("Card is already in the system.") > -1) {
                    $('#dvOuter').hide();
                    callSweetAlertWarning("Card is already in the system.");
                    $("#tab-giftcard-new #txtCardCode").val("");
                    $("#tab-giftcard-new #txtCardCode").css('border-bottom', errorClassBorder);
                    $('#btnAddCard').text("Add Card");
                    $("#hdnValidateCard").val(false);
                    $("#hdnCardType").val("");
                }
                else if (data.replace(/"/g, "").indexOf("Card loaded successfully.") > -1) {
                    $("#hdnValidateCard").val(false);
                    $("#hdnCardType").val("");
                    $('#dvOuter').hide();
                    window.localStorage.removeItem("GiftCardDetails");
                    //$('#dvOuter').show();
                    //$('#dvOuterText').html("");
                    //$('#dvOuterText').html("Card loaded successfully.");
                    //$('#dvOuterText').attr("style", "color:#3c763d !important");

                    var popuphtml = "<p><span style='color:#000;'>Card Code:  </span><span class=\"main-one\">" + decodeURIComponent($("#txtCardCode").val()) + "</span></p>";

                    if ($('#tab-giftcard-new #txtAmount').val() != "")
                        popuphtml = popuphtml + "<p><span style='color:#000;'>Amount:  </span><span class=\"main-two\">" + FormatDecimal(amount) + "</span></p>";
                    if ($('#tab-giftcard-new #txtName').val() != "")
                        popuphtml = popuphtml + "<p>" + decodeURIComponent(name) + "</p>";

                    if ($('#tab-giftcard-new #txtEmail').val() != "")
                        popuphtml = popuphtml + "<p>" + decodeURIComponent(email) + "</p>";

                    if ($('#tab-giftcard-new #txtPhone').val() != "") {
                        if ($('#tab-giftcard-new #txtPhone').val().length == 10)
                            popuphtml = popuphtml + "<p>" + FormatPhoneNumber(phone) + "</p>";
                        else
                            popuphtml = popuphtml + "<p>" + phone + "</p>";
                    }
                 
                    swal({
                        title: "New Card loaded successfully.",
                        html: popuphtml,
                        confirmButtonText: "OK",
                        type: "success",
                        confirmButtonColor: '#3b9847',
                    });

                    $('#btnAddCard').text("Add Card");

                    $('#tab-giftcard-new #txtAmount').val("");
                    $('#tab-giftcard-new #txtPhone').val("");
                    $('#tab-giftcard-new #txtCardCode').val("");
                    $('#tab-giftcard-new #txtEmail').val("");
                    $('#tab-giftcard-new #txtName').val("");
                    $('#tab-giftcard-new #txtCCName').val("");
                    $('#tab-giftcard-new #txtCCNumber').val("");
                    $('#tab-giftcard-new #txtCVV').val("");
                    $('#tab-giftcard-new #ddlCCMonth').val("");
                    $('#tab-giftcard-new #ddlCCYear').val("");

                    $("#liPaymentType").hide();
                    $("#liCCName").hide();
                    $("#liCCNo").hide();

                }
                else if (data.replace(/"/g, "").indexOf("failed") > -1)
                {
                    callSweetAlertWarning(data.replace(/"/g, ""));
                }
            });
        }
        catch (e) {

        }
    }
}

function ChangePaymetTypePopup(type) {
    if (type == 'CARD') {
        $$("#divPopupPaymentArea").show();
        $("#hdnPaymentType").val("Credit Card");
        //$$("#txtPopupAmount").attr("placeholder", "Amount($)");
    }
    else if (type == 'CASH') {
        $$("#divPopupPaymentArea").hide();
        $("#hdnPaymentType").val("Cash");
        //$$("#txtPopupAmount").attr("placeholder", "Cash($)");
    }
}

function OpenGiftCardPaymentPopup() {
   var storeId = SetStoreId();
   var cardCode = $("#txtCardCodeSearch").val().trim();
   var amount = Number($("#txtLoad").val().trim());
   if (cardCode != "" && amount >0)
   {
       var html = "<div class=\"popup-content-area\"><h2 class=\"popup-title\"><span style=\"font-size:18px;\">Load Gift Card - <span style=\"font-weight:600;font-size: 20px;\">" + cardCode + "</span></span></h2>";

       html += "<h4 id=\"popuperror\" style=\"font-weight:400;color:#ff4848;display:none;\"></h4>";
       
       html += "<div class=\"item-media item-media-section\">"
       html += "<div class=\"item-media payment-area-popup\"><input type=\"radio\" id=\"paymentPopupTypeCard\" name=\"paymentPopupType\" value=\"Card\" onclick=\"ChangePaymetTypePopup('CARD');\" checked /><label for=\"paymentPopupTypeCard\" onclick=\"ChangePaymetTypePopup('CARD');\" style=\"padding-right: 10px;\" >Credit Card</label>";
       html += "<input type=\"radio\" id=\"paymentPopupTypeCash\" name=\"paymentPopupType\" value=\"Cash\" onclick=\"ChangePaymetTypePopup('CASH');\" /><label for=\"paymentPopupTypeCash\" onclick=\"ChangePaymetTypePopup('CASH');\" >Cash</label></div>";
       html += "<input type=\"hidden\" id=\"hdnPaymentType\" value=\"Credit Card\"/></div>";

       html += "<div><i class=\"material-icons popup-material-icons\">attach_money</i><input value=\"" + FormatDecimalWithoutDollar(amount) + "\" type=\"number\" min=\"1\" step=\"any\" onKeyDown=\"if(this.value.length==10) this.value = this.value.slice(0, -1);\" id=\"txtPopupAmount\" class=\"swal2-text popup-input-amount mandatory\" style=\"padding: 5px 5px;\" placeholder=\"Amount($)\"></div>";

       html += "<div id=\"divPopupPaymentArea\">";
       html += "<div><i class=\"material-icons popup-material-icons\">person</i><input type=\"text\" id=\"txtPopupCCName\" class=\"swal2-text popup-input-name mandatory\" style=\"padding: 5px 5px;\" placeholder=\"Name on Card\"></div>";
       html += "<div class=\"popup-col-4\"><i class=\"material-icons popup-material-icons\">credit_card</i><input type=\"number\" min=\"1\" step=\"any\" id=\"txtPopupCCNumber\" class=\"swal2-text popup-input-ccnumber mandatory\" style=\"padding: 5px 5px;\" placeholder=\"Card Number\"  onKeyPress=\"if(this.value.length==16) return false;\"></div>";
       html += "<div class=\"popup-col-6\"><i class=\"material-icons popup-material-icons\">date_range</i><select placeholder=\"MM\" id=\"ddlPopupCCMonth\" required class=\"mandatory popup-input-month\" style=\"padding-left: 10px !important;\">";
       html += "<option value=\"\">MM</option>";
       html += "<option value=\"01\">01</option><option value=\"02\">02</option> <option value=\"03\">03</option>";
       html += "<option value=\"04\">04</option><option value=\"05\">05</option><option value=\"06\">06</option>";
       html += "<option value=\"07\">07</option><option value=\"08\">08</option><option value=\"09\">09</option>";
       html += "<option value=\"10\">10</option><option value=\"11\">11</option> <option value=\"12\">12</option></select><div class=\"popup-input-divider\">/</div>";

       html += "<select placeholder=\"YY\" id=\"ddlPopupCCYear\" required class=\"mandatory popup-input-month\"><option value=\"\">YY</option></select></div>";
       html += "<div class=\"popup-col-5\"><i class=\"material-icons popup-material-icons\">fiber_pin</i><input type=\"password\" id=\"txtPopupCCCVV\" class=\"swal2-text popup-input-cvv mandatory\" style=\"padding: 5px 5px;\" placeholder=\"CVV\" onKeyPress=\"if(this.value.length==4) return false;\"></div>";
       
       
       html += "</div>";


       html += "<div class=\"popup-button-area\"><button id=\"btnGCReLoad\" onclick=\"GiftCardPayment('" + cardCode + "'," + storeId + ");\" type=\"button\" class=\"popup-confirm-medium swal2-styled\" aria-label=\"\" ";
       html += "style=\"background-color: rgb(59, 152, 71); border-left-color: rgb(59, 152, 71); border-right-color: rgb(59, 152, 71);\">Load</button>";
       html += "<button type=\"button\" onclick=\"CloseGiftCardPaymentPopup();\" class=\"swal2-styled popup-no\" aria-label=\"\" style=\"display: inline-block; background-color: rgb(233, 88, 97);\">Cancel</button></div></div>";
       $('#giftcardPayment').html(html);
       $(".popup-overlay").show();
       $('#giftcardPayment').show();
       BindCCYear('ddlPopupCCYear');
       BindCCMonth('ddlPopupCCMonth');
   }
   

}
function GiftCardPayment(cardCode, storeId) {
    var amount = Number($("#txtPopupAmount").val().trim());
    var ccName = $("#txtPopupCCName").val().trim();
    var ccNumber = $("#txtPopupCCNumber").val().trim();
    var cvv = $("#txtPopupCCCVV").val().trim();
    var expMonth = $("#ddlPopupCCMonth").val().trim();
    var expYear = $("#ddlPopupCCYear").val().trim();
    var phone = $('#txtPhone').val();
    var register = $('#ddlRegister').val();
    var pin = $("#txtPINSearch").val();
    var paymentType = $("#hdnPaymentType").val();

    if (pin == '') {
        pin = '0';
    }
    var validated = false;
    if (paymentType != "" && paymentType != "undefined" && paymentType.toUpperCase() == "CASH") {
        if (amount == "") {
            $("#txtPopupAmount").css('border-bottom', errorClassBorder);
            validated = false;
        }
        else if (amount > 0) {
            validated = true;
        }
    }
   else if (amount > 0 && ccName != "" && ccNumber != "" && cvv != "" && expMonth != "" && expYear != "")
    {
        validated = true;
    }
    else {
        if (amount == "") {
            $("#txtPopupAmount").css('border-bottom', errorClassBorder);
        }
        if (ccName == "") {
            $("#txtPopupCCName").css('border-bottom', errorClassBorder);
        }
        if (ccNumber == "" || ccNumber == "0") {
            $("#txtPopupCCNumber").css('border-bottom', errorClassBorder);
        }
        if (cvv == "" || cvv == "0") {
            $("#txtPopupCCCVV").css('border-bottom', errorClassBorder);
        }
        if (expMonth == "") {
            $("#ddlPopupCCMonth").css('border-bottom', errorClassBorder);
        }
        if (expYear == "") {
            $("#ddlPopupCCYear").css('border-bottom', errorClassBorder);
        }
    }
   
    if (validated == true)
    {
        $('#btnGCReLoad').text("Loading...");
      var  url = global + "/GiftCardLoadWithPayment?storeid=" + storeId + "&giftCardCode=" + encodeURIComponent(cardCode) + "&phone="
            + phone + "&amount=" + amount + "&register=" + register + "&pin=" + pin + "&ccName=" + ccName + "&ccNumber=" + ccNumber + "&cvv=" + cvv + "&expMonth=" + expMonth + "&expYear=" + expYear + "&paymentType=" + paymentType;
        var totalHistoryAmount = 0;
        $.getJSON(url, function (data) {
            $('#btnGCReLoad').text("Load");
            $("#txtCardCodeSearch").css('border-bottom', bottomBorder);
            $("#txtLoad").css('border-bottom', bottomBorder);
            $("#txtPhoneSearch").css('border-bottom', bottomBorder);

            $("#txtPopupAmount").css('border-bottom', bottomBorder);
            $("#txtPopupCCName").css('border-bottom', bottomBorder);
            $("#txtPopupCCNumber").css('border-bottom', bottomBorder);
            $("#ddlPopupCCMonth").css('border-bottom', bottomBorder);
            $("#ddlPopupCCYear").css('border-bottom', bottomBorder);
            if (data.replace(/"/g, "").indexOf("PIN is required.") > -1) {
                $('#dvInner').hide();
                //$('#btnLoadReward').prop("disabled", true);
                //$('#btnRedeemReward').prop("disabled", true);
                if (pin.trim() === '' || pin === '0') {
                    // console.log("1");
                    $('#dvInner').hide();
                    $('#dvOuter').hide();
                    $('#dvOuterText').html("");
                    $("#txtPINSearch").css('border-bottom', errorClassBorder);
                }

            }
            else if (data.replace(/"/g, "").indexOf("Invalid PIN.") > -1) {
                $('#dvInner').hide();
                $('#dvOuter').hide();
                $('#dvOuterText').html("");
                $("#txtPINSearch").val("");
             
                $("#popuperror").show();
                $("#popuperror").html("Invalid PIN.");

            }
                //console.log("Load: " + data);
            else if (data.replace(/"/g, "").indexOf("Phone is not valid.") > -1) {
                $('#tblRedeemHistory tbody').html("");
                $('#dvInner').hide();
                //$('#alertHearderText').html("Message");
                if (phone == '' || phone == '0') {
                    $('#dvInner').hide();

                    $("#txtPhoneSearch").css('border-bottom', errorClassBorder);
                }
                else {
                    $("#txtPhoneSearch").css('border-bottom', bottomBorder);
                    $('#dvInner').hide();
                    $('#dvOuter').hide();
                    $("#popuperror").show();
                    $("#popuperror").html("Invalid Phone Number.");
                   
                    //callSweetAlertWarning("Invalid Phone Number.");
                }
            }
            else if (data.replace(/"/g, "").indexOf("Invalid Card Code.") > -1) {
                $('#tblRedeemHistory tbody').html("");
                $('#dvInner').hide();
                $('#dvOuter').hide();
                $("#popuperror").show();
                $("#popuperror").html("Invalid Gift Card Code.");
            }
            else if (data.replace(/"/g, "").indexOf("No record(s) found.") > -1) {
                $('#tblRedeemHistory tbody').html("");
                $('#dvInner').hide();
                $('#dvOuter').show();
                $('#dvOuterText').html("");
                $('#dvOuterText').html("No records found.");
            }
            else if (data.replace(/"/g, "").indexOf("Amount is required.") > -1) {
                //$('#dvInner').hide();
                $('#dvOuter').hide();
                $('#dvOuterText').html("");
                $("#txtLoad").css('border-bottom', errorClassBorder);
            }
            else if (data.replace(/"/g, "").toLowerCase().indexOf("failed") > -1) {
                //$('#dvInner').hide();
                $('#dvOuter').hide();
                $('#dvOuterText').html("");
                $("#popuperror").show();
                $("#popuperror").html(data);
            }
            else {
                SearchGiftCard();
                if (data.replace(/"/g, "").indexOf("Gift Card loaded successfully")) {
                    CloseGiftCardPaymentPopup();
                    callSweetAlertSuccess("Gift Card loaded successfully.")
                }
                $('#txtLoad').val("");
                
            }
        });
    }
        
      


  
}
function CloseGiftCardPaymentPopup() {
    $('#giftcardPayment').html("");
    $(".popup-overlay").hide();
    $('#giftcardPayment').hide();
}

function OpenGiftCardRefundPopup() {
    var storeId = SetStoreId();
    var cardCode = $("#txtCardCodeSearch").val().trim();
    if (cardCode != "") {
        var html = "<div class=\"popup-content-area\"><h2 class=\"popup-title\"><span style=\"font-size:18px;\">Refund Gift Card - <span style=\"font-weight:600;font-size: 20px;\">" + cardCode + "</span></span></h2>";
        html += "<h4 id=\"popuperror\" style=\"font-weight:400;color:#ff4848;display:none;\"></h4>";

        html += "<div><i class=\"material-icons popup-material-icons\">attach_money</i><input  type=\"number\" min=\"1\" step=\"any\" onKeyDown=\"if(this.value.length==10) this.value = this.value.slice(0, -1);\" id=\"txtPopupRefund\" class=\"swal2-text popup-input-amount mandatory\" style=\"padding: 5px 5px;\" placeholder=\"Amount($)\"></div>";
        html += "<div><i class=\"material-icons popup-material-icons\">description</i><textarea id=\"txtGCRefundReason\" class=\"swal2-textarea mandatory textarea\"  placeholder=\"Reason\"></textarea></div>";
       


        html += "<div class=\"popup-button-area\"><button id=\"btnGCRefund\" onclick=\"RefundGiftCard();\" type=\"button\" class=\"popup-confirm-medium swal2-styled\" aria-label=\"\" ";
        html += "style=\"background-color: rgb(59, 152, 71); border-left-color: rgb(59, 152, 71); border-right-color: rgb(59, 152, 71);\">Refund</button>";
        html += "<button type=\"button\" onclick=\"CloseRefundGiftCardPopup();\" class=\"swal2-styled popup-no\" aria-label=\"\" style=\"display: inline-block; background-color: rgb(233, 88, 97);\">Cancel</button></div></div>";
        $('#giftcardRefund').html(html);
        $(".popup-overlay").show();
        $('#giftcardRefund').show();
    }
    else {
        
         $("#txtCardCodeSearch").css('border-bottom', errorClassBorder);
    }


}
function RefundGiftCard() {

    var storeId = SetStoreId();

    var cardCode = $('#txtCardCodeSearch').val();
    var phone = $('#txtPhoneSearch').val();
    var reason = $("#txtGCRefundReason").val().trim();
    if (phone == '') {
        phone = '0';
    }
    var pin = $("#txtPINSearch").val();
    if (pin == '') {
        pin = '0';
    }
    var amount = $('#txtPopupRefund').val();
    if (amount == '')
        amount = '0';
    var register = $('#ddlRegister').val();
    if (reason != "" && amount != "" && Number(amount) > 0) {
       

        var regex = /^[a-zA-Z0-9.\-_]+$/;
        var giftCardCode = "";
        if (regex.test(cardCode) == true) {
        }
        else {
            var str = cardCode.replace(/[^0-9\-]/g, '');
            cardCode = str.substring(0, 16);
        }

        try {
            $('#btnGCRefund').text("Refunding...");
            $('#btnGCRefund').css({ "width": "167px" })
            url = global + "/GiftCardRefund?storeid=" + storeId + "&giftCardCode=" + encodeURIComponent(cardCode) + "&phone=" + phone + "&amount=" + amount + "&pin=" + pin + "&reason=" + encodeURIComponent(reason) + "&register=" + register;
            var totalHistoryAmount = 0;
            $.getJSON(url, function (data) {
                $('#btnGCRefund').css({ "width": "111px" })
                $('#btnGCRefund').text("Refund");
                $("#txtCardCodeSearch").css('border-bottom', bottomBorder);
                $("#txtPopupRefund").css('border-bottom', bottomBorder);
                $("#txtPhoneSearch").css('border-bottom', bottomBorder);
                if (data.replace(/"/g, "").indexOf("PIN is required.") > -1) {
                    $('#dvInner').hide();
                    //$('#btnLoadReward').prop("disabled", true);
                    //$('#btnRedeemReward').prop("disabled", true);
                    if (pin.trim() === '' || pin === '0') {
                        // console.log("1");
                        $('#dvInner').hide();
                        $('#dvOuter').hide();
                        $('#dvOuterText').html("");
                        $("#txtPINSearch").css('border-bottom', errorClassBorder);
                    }

                }
                else if (data.replace(/"/g, "").indexOf("Invalid PIN.") > -1) {
                    $('#dvInner').hide();
                    $('#dvOuter').hide();
                    $('#dvOuterText').html("");
                    $("#txtPINSearch").val("");
                   // callSweetAlertWarning("Invalid PIN.");
                    $("#popuperror").show();
                    $("#popuperror").html("Invalid PIN.");


                }
                    //console.log("Load: " + data);
                else if (data.replace(/"/g, "").indexOf("Phone is not valid.") > -1) {
                    $('#tblRedeemHistory tbody').html("");
                    $('#dvInner').hide();
                    //$('#alertHearderText').html("Message");
                    if (phone == '' || phone == '0') {
                        $('#dvInner').hide();

                        $("#txtPhoneSearch").css('border-bottom', errorClassBorder);
                    }
                    else {
                        $("#txtPhoneSearch").css('border-bottom', bottomBorder);
                        $('#dvInner').hide();
                        $('#dvOuter').hide();

                       // callSweetAlertWarning("Invalid Phone Number.");
                    }
                }
                else if (data.replace(/"/g, "").indexOf("Invalid Card Code.") > -1) {
                    $('#tblRedeemHistory tbody').html("");
                    $('#dvInner').hide();
                    $('#dvOuter').hide();
                    $("#popuperror").show();
                    $("#popuperror").html("Invalid Gift Card Code.");
                }
                else if (data.replace(/"/g, "").indexOf("No record(s) found.") > -1) {
                    $('#tblRedeemHistory tbody').html("");
                    $('#dvInner').hide();
                    $('#dvOuter').show();
                    $('#dvOuterText').html("");
                    $('#dvOuterText').html("No records found.");
                }
                else if (data.replace(/"/g, "").indexOf("Amount is required.") > -1) {
                    //$('#dvInner').hide();
                    $('#dvOuter').hide();
                    $('#dvOuterText').html("");
                    $("#txtLoad").css('border-bottom', errorClassBorder);
                }
                else {
                    SearchGiftCard();
                    CloseRefundGiftCardPopup();
                    if (data.replace(/"/g, "").indexOf("Gift Card refunded successfully")) {
                        callSweetAlertSuccess("Gift Card Amount refunded successfully.")
                    }
                    $('#txtLoad').val("");
                    //$('#alertHearderText').html("Message");
                    //$('#alertBodyText').html(data.replace(/"/g, ""));
                }
            });

        }
        catch (e) {

        }
    }
    else {
        if (cardCode == "") {
            $("#txtCardCodeSearch").css('border-bottom', errorClassBorder);
        }
        if (amount == "" || amount == "0") {
            $("#txtPopupRefund").css('border-bottom', errorClassBorder);
        }
        if (reason == "") {
            $("#txtGCRefundReason").css('border-bottom', errorClassBorder);
        }
    }
}
function CloseRefundGiftCardPopup() {
    $('#giftcardRefund').html("");
    $(".popup-overlay").hide();
    $('#giftcardRefund').hide();
}
function DisplayRefundReason(id, reason, datetime, amount, cardCode) {
    var html = "<div class=\"popup-content-area\"><h2 class=\"popup-title\"><span style=\"font-size:18px;\">Refund Details- <span style=\"font-weight:600;font-size: 20px;\">" + cardCode + "</span></span></h2>";

    html += "<h4><label><strong>Date: </strong>" + datetime + "</label> </h4>";
    html += "<h4><label><strong>Amount: </strong>" + amount + "</label></h4>";
    html += "<h4><label><strong>Reason: </strong>" + reason + "</label></h4>";


    html += "<div class=\"popup-button-area\"><button onclick=\"CloseRefundDetailsPopup();\" type=\"button\" class=\"popup-confirm-small swal2-styled\" aria-label=\"\" ";
    html += "style=\"background-color: rgb(59, 152, 71); border-left-color: rgb(59, 152, 71); border-right-color: rgb(59, 152, 71);\">OK</button>";
    html += "</div></div>";

    console.log(html)
    $('#giftcardRefundReason').html(html);
    $(".popup-overlay").show();
    $('#giftcardRefundReason').show();

}
function CloseRefundDetailsPopup() {
    $('#giftcardRefundReason').html("");
    $(".popup-overlay").hide();
    $('#giftcardRefundReason').hide();
}
function ClearSpecialCharacter(obj) {
    var clearoutput = $('#' + obj).val().replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '-').replace(/^(-)+|(-)+$/g, '');
    $('#' + obj).val(clearoutput);


}
//Gift Card Orders START
//Gift Card Orders
//Gift Card Orders
function GiftCardOrdersList(pagesize, currentPage) {


    var customerId = 0;
    var storeId = 0;
    currentPage = 0;
    $("#dvOuterOrder").hide();
    $("#dvOuterOrderText").html("");
    localStorage.setItem("GiftCardCurrentPage", currentPage);
    $("#dvOrderList").html("");

    var params = getParams();

    customerId = SetCustomerId();
    storeId = SetStoreId();

    var orderId = $("#txtOrderId").val();
    var giftCardCode = $("#txtGiftCardCode").val();
    var name = $("#txtName").val();
    var status = $("#ddlFilterStatus").val();

    //Sorting
    var sortValue = $("input[name='radioGiftCardSort']:checked").val();
    var sortByValue = $("input[name='radioGiftCardSortBy']:checked").val();
    //Sorting

    if (orderId == undefined) {
        orderId = "";
    }
    if (giftCardCode == undefined) {
        giftCardCode = "";
    }
    if (name == undefined) {
        name = "";
    }
    if (status == undefined) {
        status = "";
    }
    if (sortValue == undefined) {
        sortValue = "DESC";
    }
    if (sortByValue == undefined) {
        sortByValue = "";
    }

    if (Number(storeId) > 0) {
        //SetMenuNavigation(storeId);
        //$("#lblEditGiftCardCode").html("");
        //$("#aEditCode").hide();
        //$("#lblGiftCardType").html("");
        //$("#lblGiftCardValue").html("");
        $("#btnProcessing").hide();
        $("#btnPickedUp").hide();
        $("#btnShipped").hide();
        $("#btnNew").hide();
        $("#btnComplete").hide();

        currentPage = Number(currentPage) * Number(pagesize);
        url = global + "/GetStoreAllGiftCards?storeid=" + storeId + "&orderId=" + orderId + "&giftcardcode=" + giftCardCode + "&recipientname=" + name + "&status=" + status + "&pagesize=" + pagesize + "&currentPage=" + currentPage +
            "&sortValue=" + sortValue + "&sortByValue=" + sortByValue;
        //alert(url);

        try {
            $.getJSON(url, function (data) {
                //console.log(data);
                $('#loader_msg').html("");
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;
                //console.log("Length: " + length);
                if (length == 0) {
                    $('#dvOuterOrder').show();
                    $("#dvOuterOrderText").show();
                    $('#dvOuterOrderText').html("");
                    //$('#dvOuterOrderText').html("No records found.");

                    var html = "<div class=\"order-list list-empty-label-text\">No Orders</div>";
                    $('#dvOuterOrderText').html(html);
                }

                if (JSON.parse(data).indexOf("No giftcard(s) found") < 0) {
                    localStorage.setItem("GiftCardAvailable", "1");
                    var count = 0;
                    $.each(JSON.parse(data), function (index, value) {
                        //console.log(data);
                        //$("#aEditCode").show();
                        //$("#titleRedemptionHistory").show();

                        //   storeId = 8;
                        var buttonHTML = "";
                        var orderDate = "";
                        var orderTime = "";
                        var firstName = "";
                        var lastName = "";
                        var name = "";
                        var email = "";
                        var phone = "";
                        var giftcardBalance = "";
                        if (value.REMAININGAMOUNT != "") {
                            giftcardBalance = FormatDecimal(value.REMAININGAMOUNT);

                        }
                        else {

                            giftcardBalance = "$0.00";
                        }
                        if (value.CREATEDONUTC != null && value.CREATEDONUTC != undefined) {
                            var arrDateTime = value.CREATEDONUTC.split('~');
                            var orderDate = arrDateTime[0];
                            var orderTime = arrDateTime[1];
                        }
                        if (value.RECIPIENTNAME != "") {
                            name = value.RECIPIENTNAME;

                        }
                        if (value.PHONE != "") {
                            phone = value.PHONE;
                        }
                        if (value.EMAIL != "") {
                            email = value.EMAIL;

                        }


                        /*------------------Order Area-----------------------*/

                        var html = "<div class=\"order-container\"  id='li_" + value.ID + "' >";


                        /*------------------Order Row-----------------------*/

                        html += "<div class=\"order-list\"  data-popup=\".popup-details\">";

                        /*------------------Column 1-----------------------*/

                        html += "<div class=\"order-column-one\" data-panel=\"left\" onclick=\"OpenGiftCardDetails(" + value.ID + ");\">";
                        /*------------------Status Icon--------------------*/

                        //if (value.ORDERSTATUSID.toLowerCase() == "new") {
                        //    html += "<div class=\"order-status-icon\"><img id='img_" + value.ID + "' class=\"list-icon\" src=\"img/icons/new.png\" alt=\"\"/></div>";
                        //}
                        //else if (value.ORDERSTATUSID.toLowerCase() == "processing") {
                        //    html += "<div class=\"order-status-icon\"><img id='img_" + value.ID + "' class=\"list-icon\" src=\"img/icons/pending.png\" alt=\"\"/></div>";
                        //}
                        //else if (value.ORDERSTATUSID.toLowerCase() == "shipped") {
                        //    html += "<div class=\"order-status-icon\"><img id='img_" + value.ID + "' class=\"list-icon\" src=\"img/icons/shipped.png\" alt=\"\"/></div>";
                        //}
                        //else if (value.ORDERSTATUSID.toLowerCase() == "complete") {
                        //    html += "<div class=\"order-status-icon\"><img id='img_" + value.ID + "' class=\"list-icon\" src=\"img/icons/Complete-Icon.png\" alt=\"\"/></div>";
                        //}
                        //else if (value.ORDERSTATUSID.toLowerCase() == "pickedup") {
                        //    html += "<div class=\"order-status-icon\"><img id='img_" + value.ID + "' class=\"list-icon\" src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                        //}
                        if (value.ORDERSTATUSID.toLowerCase() == "new") {
                            //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></div>";
                            html += "<div class=\"dropdown\" id=\"giftcardstatus_" + value.ID + "\">";
                            html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></button>";
                            html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                            html += "<a onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + "," + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                            html += "<a  onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + "," + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                            html += "<a  onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + "," + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                            html += "</div>";
                            html += "</div>";
                        }
                       
                        else if (value.ORDERSTATUSID.toLowerCase() == "shipped") {
                            // html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></div>";
                            html += "<div class=\"dropdown\" id=\"giftcardstatus_" + value.ID + "\">";
                            html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/></button>";
                            html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                            //html += "<a onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + "," + storeId + ")\" id=\"btnNew_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">New</span></a>";
                            html += "<a  onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + "," + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\">Complete</span></a>";
                            html += "<a  onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + "," + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\">Picked Up</span></a>";
                            html += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                            html += "</div>";
                            html += "</div>";
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "pickedup") {
                            //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                            html += "<div class=\"dropdown\" id=\"giftcardstatus_" + value.ID + "\">";
                            html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                            html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                            html += "<a onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + "," + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                            html += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id=\"btnPickedUp_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                            html += "<a  onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + "," + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                            html += "</div>";
                            html += "</div>";
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "complete") {
                            //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                            html += "<div class=\"dropdown\" id=\"giftcardstatus_" + value.ID + "\">";
                            html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                            html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                            html += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id=\"btnComplete_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                            html += "<a  onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + "," + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                            html += "<a  onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + "," + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                            html += "</div>";
                            html += "</div>";
                        }
                       
                        /*-----------------Status Icon End----------------*/
                        if (value.GIFTCARDCOUPONCODE != undefined) {
                            html += "<div class=\"giftcard-order-pickup\" id=\'lbl_giftCardCode_" + value.ID + "'>" + value.GIFTCARDCOUPONCODE + "</div>";
                        }
                        else {
                            html += "<div class=\"giftcard-order-pickup\" id=\'lbl_giftCardCode_" + value.ID + "'></div>";
                        }
                        html += "</div>";
                        /*------------------Column 1-----------------------*/
                        /*------------------Column 2-----------------------*/
                        html += "<div class=\"order-column-two\">";
                        /*------------------1st Row-----------------------*/
                        html += "<div class=\"order-row-container\">";
                        //html += "<div class=\"giftcard-order-number panel-open\" data-panel=\"left\" onclick=\"OpenGiftCardDetails(" + value.ID + ");\">#" + value.ORDERID + "<span> on </span><span>" + orderDate + " @ " + orderTime + "</span></div>";
                        html += "<div class=\"giftcard-order-number panel-open\" data-panel=\"left\"  style=\"width:75%;\" onclick=\"OpenGiftCardDetails(" + value.ID + ");\">#" + value.ORDERID + "<span> on </span><span>" + orderDate + "</span></div>";
                        /*------------------Button Row-----------------------*/
                        //if (value.ORDERSTATUSID == "New") {

                        //    buttonHTML += "<img class=\"giftcard-button-set carryout-button\" src=\"./img/icons/new_button_active.png\"  />";
                        //    //buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\" class=\"carryout-button-set-2\" /></a>";
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img src=\"./img/icons/complete_button.png\" class=\"carryout-button-set-2\"/></a>";
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img src=\"./img/icons/picked_up_button.png\"  class=\"carryout-button-set-2\"/></a>";
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img src=\"./img/icons/shipped_button.png\" class=\"carryout-button-set-2\"/></a>";
                        //    //buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\" class=\"carryout-button-set-2\" /></a>";
                        //    //buttonHTML += "<img src=\"./img/icons/picked_up_button_active.png\" class=\"giftcard-button-set carryout-button\"/>";
                        //    //buttonHTML += "<img src=\"./img/icons/shipped_button_active.png\" class=\"giftcard-button-set carryout-button\"/>";
                        //    //buttonHTML += "<img src=\"./img/icons/complete_button_active.png\" class=\"giftcard-button-set carryout-button\" />";

                        //}
                        ////else if (value.ORDERSTATUSID == "Processing") {
                        ////    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnNew_" + value.ID + "\"><img src=\"./img/icons/new_button.png\" class=\"carryout-button-set-2\" /></a>";
                        ////    //buttonHTML += "<img class=\"giftcard-button-set carryout-button\" src=\"./img/icons/pending_button_active.png\" />";
                        ////    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img src=\"./img/icons/picked_up_button.png\"  class=\"carryout-button-set-2\"/></a>";
                        ////    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img src=\"./img/icons/shipped_button.png\" class=\"carryout-button-set-2\"/></a>";
                        ////    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img src=\"./img/icons/complete_button.png\" class=\"carryout-button-set-2\"/></a>";
                        ////}
                        //else if (value.ORDERSTATUSID == "Shipped") {
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnNew_" + value.ID + "\"><img src=\"./img/icons/new_button.png\" class=\"carryout-button-set-2\" /></a>";
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img src=\"./img/icons/complete_button.png\" class=\"carryout-button-set-2\"/></a>";
                        //    //buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\" class=\"carryout-button-set-2\" /></a>";
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img src=\"./img/icons/picked_up_button.png\"  class=\"carryout-button-set-2\"/></a>";
                        //    buttonHTML += "<img class=\"giftcard-button-set carryout-button\"  src=\"./img/icons/shipped_button_active.png\"/>";

                        //}
                        //else if (value.ORDERSTATUSID == "PickedUp") {
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnNew_" + value.ID + "\"><img src=\"./img/icons/new_button.png\" class=\"carryout-button-set-2\" /></a>";
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img src=\"./img/icons/complete_button.png\" class=\"carryout-button-set-2\"/></a>";
                        //    //buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\" class=\"carryout-button-set-2\" /></a>";
                        //    buttonHTML += "<img src=\"./img/icons/picked_up_button_active.png\" class=\"giftcard-button-set carryout-button\"/>";
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img src=\"./img/icons/shipped_button.png\" class=\"carryout-button-set-2\"/></a>";
                        //}
                        //else if (value.ORDERSTATUSID == "Complete") {
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnNew_" + value.ID + "\"><img src=\"./img/icons/new_button.png\" class=\"carryout-button-set-2\" /></a>";
                        //    buttonHTML += "<img class=\"giftcard-button-set carryout-button\" src=\"./img/icons/complete_button_active.png\" />";
                        //    //buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\"  class=\"carryout-button-set-2\" /></a>";
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img src=\"./img/icons/picked_up_button.png\" class=\"carryout-button-set-2\"/></a>";
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img src=\"./img/icons/shipped_button.png\" class=\"carryout-button-set-2\"/></a>";

                        //}
                        html += "<div class=\"giftcard-buttons\" id=\"btnSet_" + value.ID + "\"  style=\"width:25%;\">";
                        buttonHTML += "<div class=\"customer-detail-container\">";
                        buttonHTML += "<div class=\"order-price\">" + giftcardBalance + "</div>";
                        buttonHTML += "<div>" + value.GIFTCARDTYPEID + "</div>";
                        buttonHTML += "</div>";
                        html += buttonHTML;
                        html += "</div>";

                        /*------------------Button Row-----------------------*/
                        //html += "<div class=\"order-price\">" + ordertotal + "</div>";
                        html += "</div>";
                        /*------------------1st Row-----------------------*/

                        /*------------------2nd Row-----------------------*/
                        html += "<div class=\"order-row-container\">";

                        /*------------------Customer Info-----------------------*/
                        html += "<div class=\"giftcard-order-date panel-open\" data-panel=\"left\" onclick=\"OpenGiftCardDetails(" + value.ID + ");\">";
                        html += "<div class=\"customer-detail-container\">";
                        html += "<div class=\"giftcard-customer-name\">" + name + "</div>";
                        html += "<div>" + phone + "</div>";
                        //html += "<div class=\"display-label-wrap\">" + email + "</div>";
                        html += "</div>";
                        html += "</div>";
                        /*------------------Customer Info-----------------------*/
                        /*------------------Order Info-----------------------*/
                        html += "<div class=\"giftcard-order-items-count\" >";
                        //html += "<div class=\"customer-detail-container\">";
                        //html += "<div class=\"order-price\">" + giftcardBalance + "</div>";

                        //html += "<div>" + value.GIFTCARDTYPEID + "</div>";


                        //html += "</div>";
                        html += "</div>";
                        /*------------------Order Info-----------------------*/

                        html += "</div>";
                        /*------------------2nd Row-----------------------*/
                        html += "</div>";
                        /*------------------Column 2-----------------------*/

                        html += "</div>";
                        /*------------------Order Row-----------------------*/


                        html += "</div>";
                        /*------------------Order Area-----------------------*/

                        count++;

                        $("#dvOrderList").append(html);

                    });

                }
                else {
                    localStorage.setItem("GiftCardAvailable", "0");
                    $("#dvOrderList").html("");
                    //$("#dvItem").html("");
                    $("#dvOuterOrderText").show();
                    $("#dvOuterOrderText").html("No Gift Cards");
                    $("#lblCutomerName").text("");
                    $("#lblCutomerPhone").text("");
                    $("#lblEmail").text("");
                    $("#iconEmail").hide();
                    $("#iconPhone").hide();
                }
            });


        }
        catch (e) {
        }
    }
    else {
        //window.location.href = "index.html";
        self.app.router.navigate('/login_new/', { reloadCurrent: true });
        //window.localStorage.clear();
    }
}

//Gift Card Orders   
function GiftCardOrdersListPagination(pagesize, currentPage) {
    var customerId = 0;
    var storeId = 0;
    customerId = SetCustomerId();
    storeId = SetStoreId();
    var orderId = $("#txtOrderId").val();
    var giftCardCode = $("#txtGiftCardCode").val();
    var name = $("#txtName").val();
    var status = $("#ddlFilterStatus").val();
    //Shorting
    var sortValue = $("input[name='radioGiftCardSort']:checked").val();
    var sortByValue = $("input[name='radioGiftCardSortBy']:checked").val();
    //Shorting

    if (orderId == undefined) {
        orderId = "";
    }
    if (giftCardCode == undefined) {
        giftCardCode = "";
    }
    if (name == undefined) {
        name = "";
    }
    if (status == undefined) {
        status = "";
    }
    if (sortValue == undefined) {
        sortValue = "DESC";
    }
    if (sortByValue == undefined) {
        sortByValue = "";
    }

    if (Number(storeId) > 0) {
        //SetMenuNavigation(storeId);

        currentPage = Number(currentPage) * Number(pagesize);
        url = global + "/GetStoreAllGiftCards?storeid=" + storeId + "&orderId=" + orderId + "&giftcardcode=" + giftCardCode + "&recipientname=" + name + "&status=" + status + "&pagesize=" + pagesize + "&currentPage=" + currentPage +
            "&sortValue=" + sortValue + "&sortByValue=" + sortByValue;

        try {

            $.getJSON(url, function (data) {
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;

                // console.log("length:" + length);

                $('#loader_msg').html("");
                if (JSON.parse(data).indexOf("No order(s) found") < 0) {
                    localStorage.setItem("GiftCardAvailable", "1");
                    var count = 0;
                    $.each(JSON.parse(data), function (index, value) {
                        //console.log(data);
                        $("#aEditCode").show();
                        $("#titleRedemptionHistory").show();

                        //   storeId = 8;
                        var buttonHTML = "";
                        var orderDate = "";
                        var orderTime = "";
                        var firstName = "";
                        var lastName = "";
                        var name = "";
                        var email = "";
                        var phone = "";
                        var giftcardBalance = "";
                        if (value.REMAININGAMOUNT != "") {
                            giftcardBalance = FormatDecimal(value.REMAININGAMOUNT);

                        }
                        else {

                            giftcardBalance = "$0.00";
                        }
                        if (value.CREATEDONUTC != null && value.CREATEDONUTC != undefined) {
                            var arrDateTime = value.CREATEDONUTC.split('~');
                            var orderDate = arrDateTime[0];
                            var orderTime = arrDateTime[1];
                        } if (value.RECIPIENTNAME != "") {
                            name = value.RECIPIENTNAME;

                        }

                        if (value.PHONE != "") {
                            phone = value.PHONE;

                        }
                        if (value.EMAIL != "") {
                            email = value.EMAIL;

                        }

                        /*------------------Order Area-----------------------*/

                        var html = "<div class=\"order-container\"  id='li_" + value.ID + "' >";


                        /*------------------Order Row-----------------------*/

                        html += "<div class=\"order-list\" data-popup=\".popup-details\">";

                        /*------------------Column 1-----------------------*/

                        html += "<div class=\"order-column-one\">";
                        /*------------------Status Icon--------------------*/

                        if (value.ORDERSTATUSID.toLowerCase() == "new") {
                            //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></div>";
                            html += "<div class=\"dropdown\" id=\"giftcardstatus_" + value.ID + "\">";
                            html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></button>";
                            html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                            html += "<a onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + "," + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                            html += "<a  onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + "," + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                            html += "<a  onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + "," + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                            html += "</div>";
                            html += "</div>";
                        }

                        else if (value.ORDERSTATUSID.toLowerCase() == "shipped") {
                            // html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></div>";
                            html += "<div class=\"dropdown\" id=\"giftcardstatus_" + value.ID + "\">";
                            html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/></button>";
                            html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                            //html += "<a onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + "," + storeId + ")\" id=\"btnNew_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">New</span></a>";
                            html += "<a  onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + "," + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\">Complete</span></a>";
                            html += "<a  onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + "," + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\">Picked Up</span></a>";
                            html += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                            html += "</div>";
                            html += "</div>";
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "pickedup") {
                            //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                            html += "<div class=\"dropdown\" id=\"giftcardstatus_" + value.ID + "\">";
                            html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                            html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                            html += "<a onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + "," + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                            html += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id=\"btnPickedUp_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                            html += "<a  onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + "," + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                            html += "</div>";
                            html += "</div>";
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "complete") {
                            //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                            html += "<div class=\"dropdown\" id=\"giftcardstatus_" + value.ID + "\">";
                            html += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                            html += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                            html += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id=\"btnComplete_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                            html += "<a  onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + "," + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                            html += "<a  onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + "," + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                            html += "</div>";
                            html += "</div>";
                        }

                        /*-----------------Status Icon End----------------*/
                        if (value.GIFTCARDCOUPONCODE != undefined) {
                            html += "<div class=\"giftcard-order-pickup\" id=\'lbl_giftCardCode_" + value.ID + "'>" + value.GIFTCARDCOUPONCODE + "</div>";
                        }
                        else {
                            html += "<div class=\"giftcard-order-pickup\" id=\'lbl_giftCardCode_" + value.ID + "'></div>";
                        }
                        html += "</div>";
                        /*------------------Column 1-----------------------*/
                        /*------------------Column 2-----------------------*/
                        html += "<div class=\"order-column-two\">";
                        /*------------------1st Row-----------------------*/
                        html += "<div class=\"order-row-container\">";
                        //html += "<div class=\"giftcard-order-number panel-open\" data-panel=\"left\" onclick=\"OpenGiftCardDetails(" + value.ID + ");\">#" + value.ORDERID + "<span> on </span><span>" + orderDate + " @ " + orderTime + "</span></div>";
                        html += "<div class=\"giftcard-order-number panel-open\"  style=\"width:75%;\" data-panel=\"left\" onclick=\"OpenGiftCardDetails(" + value.ID + ");\">#" + value.ORDERID + "<span> on </span><span>" + orderDate + "</span></div>";
                        /*------------------Button Row-----------------------*/
                        //if (value.ORDERSTATUSID == "New") {

                        //    buttonHTML += "<img class=\"giftcard-button-set carryout-button\" src=\"./img/icons/new_button_active.png\"  />";
                        //    //buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\" class=\"carryout-button-set-2\" /></a>";
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img src=\"./img/icons/complete_button.png\" class=\"carryout-button-set-2\"/></a>";
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img src=\"./img/icons/picked_up_button.png\"  class=\"carryout-button-set-2\"/></a>";
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img src=\"./img/icons/shipped_button.png\" class=\"carryout-button-set-2\"/></a>";
                        //    //buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\" class=\"carryout-button-set-2\" /></a>";
                        //    //buttonHTML += "<img src=\"./img/icons/picked_up_button_active.png\" class=\"giftcard-button-set carryout-button\"/>";
                        //    //buttonHTML += "<img src=\"./img/icons/shipped_button_active.png\" class=\"giftcard-button-set carryout-button\"/>";
                        //    //buttonHTML += "<img src=\"./img/icons/complete_button_active.png\" class=\"giftcard-button-set carryout-button\" />";

                        //}
                        //    //else if (value.ORDERSTATUSID == "Processing") {
                        //    //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnNew_" + value.ID + "\"><img src=\"./img/icons/new_button.png\" class=\"carryout-button-set-2\" /></a>";
                        //    //    //buttonHTML += "<img class=\"giftcard-button-set carryout-button\" src=\"./img/icons/pending_button_active.png\" />";
                        //    //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img src=\"./img/icons/picked_up_button.png\"  class=\"carryout-button-set-2\"/></a>";
                        //    //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img src=\"./img/icons/shipped_button.png\" class=\"carryout-button-set-2\"/></a>";
                        //    //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img src=\"./img/icons/complete_button.png\" class=\"carryout-button-set-2\"/></a>";
                        //    //}
                        //else if (value.ORDERSTATUSID == "Shipped") {
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnNew_" + value.ID + "\"><img src=\"./img/icons/new_button.png\" class=\"carryout-button-set-2\" /></a>";
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img src=\"./img/icons/complete_button.png\" class=\"carryout-button-set-2\"/></a>";
                        //    //buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\" class=\"carryout-button-set-2\" /></a>";
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img src=\"./img/icons/picked_up_button.png\"  class=\"carryout-button-set-2\"/></a>";
                        //    buttonHTML += "<img class=\"giftcard-button-set carryout-button\"  src=\"./img/icons/shipped_button_active.png\"/>";

                        //}
                        //else if (value.ORDERSTATUSID == "PickedUp") {
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnNew_" + value.ID + "\"><img src=\"./img/icons/new_button.png\" class=\"carryout-button-set-2\" /></a>";
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img src=\"./img/icons/complete_button.png\" class=\"carryout-button-set-2\"/></a>";
                        //    //buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\" class=\"carryout-button-set-2\" /></a>";
                        //    buttonHTML += "<img src=\"./img/icons/picked_up_button_active.png\" class=\"giftcard-button-set carryout-button\"/>";
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img src=\"./img/icons/shipped_button.png\" class=\"carryout-button-set-2\"/></a>";
                        //}
                        //else if (value.ORDERSTATUSID == "Complete") {
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnNew_" + value.ID + "\"><img src=\"./img/icons/new_button.png\" class=\"carryout-button-set-2\" /></a>";
                        //    buttonHTML += "<img class=\"giftcard-button-set carryout-button\" src=\"./img/icons/complete_button_active.png\" />";
                        //    //buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\"  class=\"carryout-button-set-2\" /></a>";
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img src=\"./img/icons/picked_up_button.png\" class=\"carryout-button-set-2\"/></a>";
                        //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img src=\"./img/icons/shipped_button.png\" class=\"carryout-button-set-2\"/></a>";

                        //}

                        buttonHTML += "<div class=\"customer-detail-container\">";
                        buttonHTML += "<div class=\"order-price\">" + giftcardBalance + "</div>";
                        buttonHTML += "<div>" + value.GIFTCARDTYPEID + "</div>";
                        buttonHTML += "</div>";
                        html += "<div class=\"giftcard-buttons\" id=\"btnSet_" + value.ID + "\" style=\"width:25%;\">";
                        html += buttonHTML;
                        html += "</div>";

                        /*------------------Button Row-----------------------*/
                        //html += "<div class=\"order-price\">" + ordertotal + "</div>";
                        html += "</div>";
                        /*------------------1st Row-----------------------*/

                        /*------------------2nd Row-----------------------*/
                        html += "<div class=\"order-row-container\">";

                        /*------------------Customer Info-----------------------*/
                        html += "<div class=\"giftcard-order-date panel-open\" data-panel=\"left\" onclick=\"OpenGiftCardDetails(" + value.ID + ");\">";
                        html += "<div class=\"customer-detail-container\">";
                        html += "<div class=\"giftcard-customer-name\">" + name + "</div>";
                        html += "<div>" + phone + "</div>";
                        //html += "<div class=\"display-label-wrap\">" + email + "</div>";
                        html += "</div>";
                        html += "</div>";
                        /*------------------Customer Info-----------------------*/
                        /*------------------Order Info-----------------------*/
                        html += "<div class=\"giftcard-order-items-count\">";
                        //html += "<div class=\"customer-detail-container\">";
                        //html += "<div class=\"order-price\">" + giftcardBalance + "</div>";

                        //html += "<div>" + value.GIFTCARDTYPEID + "</div>";


                        html += "</div>";
                        html += "</div>";
                        /*------------------Order Info-----------------------*/

                        html += "</div>";
                        /*------------------2nd Row-----------------------*/
                        html += "</div>";
                        /*------------------Column 2-----------------------*/

                        html += "</div>";
                        /*------------------Order Row-----------------------*/


                        html += "</div>";
                        /*------------------Order Area-----------------------*/

                        count++;

                        $("#dvOrderList").append(html);

                        //if (value.ORDERSTATUSID == "New") {
                        //    $("#btnProcessing_" + value.ID).show();
                        //    $("#btnPickedUp_" + value.ID).hide();
                        //    $("#btnShipped_" + value.ID).hide();
                        //    $("#btnNew_" + value.ID).hide();
                        //    $("#btnComplete_" + value.ID).hide();

                        //}
                        //else if (value.ORDERSTATUSID == "Processing") {
                        //    $("#btnProcessing_" + value.ID).hide();
                        //    $("#btnPickedUp_" + value.ID).hide();
                        //    $("#btnShipped_" + value.ID).hide();
                        //    $("#btnNew_" + value.ID).show();
                        //    $("#btnComplete_" + value.ID).show();
                        //}
                        //else if (value.ORDERSTATUSID == "Shipped") {
                        //    $("#btnProcessing_" + value.ID).hide();
                        //    $("#btnPickedUp_" + value.ID).show();
                        //    $("#btnShipped_" + value.ID).hide();
                        //    $("#btnNew_" + value.ID).hide();
                        //    $("#btnComplete_" + value.ID).show();
                        //}
                        //else if (value.ORDERSTATUSID == "PickedUp") {
                        //    $("#btnProcessing_" + value.ID).hide();
                        //    $("#btnPickedUp_" + value.ID).hide();
                        //    $("#btnShipped_" + value.ID).show();
                        //    $("#btnNew_" + value.ID).hide();
                        //    $("#btnComplete_" + value.ID).show();
                        //}
                        //else if (value.ORDERSTATUSID == "Complete") {
                        //    $("#btnProcessing_" + value.ID).show();
                        //    $("#btnPickedUp_" + value.ID).show();
                        //    $("#btnShipped_" + value.ID).show();
                        //    $("#btnNew_" + value.ID).hide();
                        //    $("#btnComplete_" + value.ID).hide();
                        //}
                    });

                }
                else {
                    localStorage.setItem("GiftCardAvailable", "0");

                }

            });

        }
        catch (e) {
        }
    }
    else {
        // window.location.href = "index.html";
        self.app.router.navigate('/login_new/', { reloadCurrent: true });

        //window.localStorage.clear();
    }

}

//Gift Card Details
function OpenGiftCardDetails(id) {
    var customerId = 0;
    var storeId = 0;
    currentPage = 0;
    customerId = SetCustomerId();
    storeId = SetStoreId();
    var orderId = id;
    $("#dvOrderItem").html("");
    $("#lblCutomerName").text("");
    $("#lblCutomerPhone").text("");
    $("#lblEmail").text("");
    $("#iconEmail").hide();
    $("#iconPhone").hide();
    $("#btnAccept").hide();
    $("#btnNew").hide();
    $("#btnComplete").hide();
    $("#btnProcessing").hide();
    $("#btnPickedUp").hide();
    $("#lblEditGiftCardCode").text("");
    $("#hdnGiftCardId").val("0");
    $("#hdnSelectedOrderOrderPrice").val("$0.00");
    $("#hdnSelectedOrderDateTime").val("");

    $('#lblEditGiftCardCode').show();
    $('#aEditCode').show();
    $('#txtEditGiftCardCode').hide();
    $('#txtEditGiftCardCode').val("");
    $('#aSaveCode').hide();

    //var prevId = $('.nav-list li.active').attr("id");
    //$('.nav-list li.active').removeClass('active');
    //$("#li_" + id).addClass('active');
    var firstName = "";
    var lastName = "";
    var email = "";
    var phone = "";
    var html = "";
    var htmlDiscount = "";
    var htmlRewards = "";
    var htmlGiftCard = "";
    var htmlSubTotal = "";
    var htmlOrderTotal = "";
    var subtotalvalue = "0.00";
    var ordertotalvalue = "0.00";
    var orderDiscount = 0.00;
    //var orderId = id.split('_')[1];
    url = global + "/GetGiftCardHistory?storeid=" + storeId + "&giftcardId=" + id;
    $.getJSON(url, function (data) {
        // console.log(data)
        var filtered_history = filterGiftCards(JSON.parse(data.toString()), "GiftCardHistory");
        //console.log("filtered_history: " + filtered_history)
        $.each(JSON.parse(data), function (index, value) {
            var name = "";
            var lastName = "";
            var email = "";
            var phone = "";
            var orderDate = "";
            var orderTime = "";
            var orderDateTimeHtml = "";
            if (value.TABLETYPE == "GiftCardInfo") {
                if (value.CREATEDONUTC != null && value.CREATEDONUTC != undefined) {
                    var arrDateTime = value.CREATEDONUTC.split('~');
                    var orderDate = arrDateTime[0];
                    var orderTime = arrDateTime[1];
                }
                if (value.RECIPIENTNAME != "") {
                    name = value.RECIPIENTNAME;

                }

                if (value.PHONE != "") {
                    phone = value.PHONE;

                }
                if (value.EMAIL != "") {
                    email = value.EMAIL;

                }
                $("#lblCutomerEmail").text(email);
                if (phone.length == 10)
                    phone = FormatPhoneNumber(phone);
                orderDiscount = value.ORDERDISCOUNT;
                subtotalvalue = value.SUBTOTAL;
                ordertotalvalue = value.ORDERTOTAL;
                orderId = value.ID;
                orderDateTimeHtml = "<span class=\"order-number giftcard-order-time\"> #" + value.ORDERID + "</span>" + " on " + orderDate + " @ " + orderTime;
                $("#orderNumberAndDateTime").html(orderDateTimeHtml);
                //$("#iconEmail").show();
                if (phone != "")
                    $("#iconPhone").show();
                $("#lblCutomerName").text(name);

                $("#lblCutomerPhone").text(phone);
                if (value.GIFTCARDCOUPONCODE != "")
                    $("#lblEditGiftCardCode").text(value.GIFTCARDCOUPONCODE);
                else
                    $("#lblEditGiftCardCode").text("XXXXXXXXXXXXXXX");
                $("#lblGiftCardValue").text(FormatDecimal(value.REMAININGAMOUNT));
                $("#lblGiftCardType").text(value.GIFTCARDTYPEID);
                //$("#lblEmail").text(email);
                $("#hdnSelectedOrderId").val(value.ORDERID);
                $("#hdnGiftCardId").val(value.ID);

                if (value.REMAININGAMOUNT != "") {
                    $("#hdnSelectedOrderOrderPrice").val(FormatDecimal(value.REMAININGAMOUNT));
                }
                else {
                    $("#hdnSelectedOrderOrderPrice").val("$0.00");
                }
                if (value.CREATEDONUTC != null && value.CREATEDONUTC != undefined) {
                    var arrDateTime = value.CREATEDONUTC.split('~');
                    var orderDate = arrDateTime[0];
                    var orderTime = arrDateTime[1];
                    $("#hdnSelectedOrderDateTime").val(orderDate + "#" + orderTime);
                }

                var buttonHTML = "";

                if (value.ORDERSTATUSID.toLowerCase() == "new") {
                    //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></div>";
                    buttonHTML += "<div class=\"dropdown\" id=\"popupgiftcardstatus_" + value.ID + "\">";
                    buttonHTML += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></button>";
                    buttonHTML += "<div id=\"myPopupDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    buttonHTML += "<a onclick=\"ChangePopupGiftCardOrderStatusById('Complete'," + value.ID + "," + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    buttonHTML += "<a  onclick=\"ChangePopupGiftCardOrderStatusById('PickedUp'," + value.ID + "," + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    buttonHTML += "<a  onclick=\"ChangePopupGiftCardOrderStatusById('Shipped'," + value.ID + "," + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                    buttonHTML += "</div>";
                    buttonHTML += "</div>";
                }
                else if (value.ORDERSTATUSID.toLowerCase() == "shipped") {
                    // html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></div>";
                    buttonHTML += "<div class=\"dropdown\" id=\"popupgiftcardstatus_" + value.ID + "\">";
                    buttonHTML += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/></button>";
                    buttonHTML += "<div id=\"myPopupDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    //html += "<a onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + "," + storeId + ")\" id=\"btnNew_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">New</span></a>";
                    buttonHTML += "<a  onclick=\"ChangePopupGiftCardOrderStatusById('Complete'," + value.ID + "," + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\">Complete</span></a>";
                    buttonHTML += "<a  onclick=\"ChangePopupGiftCardOrderStatusById('PickedUp'," + value.ID + "," + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\">Picked Up</span></a>";
                    buttonHTML += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                    buttonHTML += "</div>";
                    buttonHTML += "</div>";
                }
                else if (value.ORDERSTATUSID.toLowerCase() == "pickedup") {
                    //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                    buttonHTML += "<div class=\"dropdown\" id=\"popupgiftcardstatus_" + value.ID + "\">";
                    buttonHTML += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                    buttonHTML += "<div id=\"myPopupDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    buttonHTML += "<a onclick=\"ChangePopupGiftCardOrderStatusById('Complete'," + value.ID + "," + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    buttonHTML += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id=\"btnPickedUp_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    buttonHTML += "<a  onclick=\"ChangePopupGiftCardOrderStatusById('Shipped'," + value.ID + "," + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                    buttonHTML += "</div>";
                    buttonHTML += "</div>";
                }
                else if (value.ORDERSTATUSID.toLowerCase() == "complete") {
                    //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                    buttonHTML += "<div class=\"dropdown\" id=\"popupgiftcardstatus_" + value.ID + "\">";
                    buttonHTML += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                    buttonHTML += "<div id=\"myPopupDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    buttonHTML += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id=\"btnComplete_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    buttonHTML += "<a  onclick=\"ChangePopupGiftCardOrderStatusById('PickedUp'," + value.ID + "," + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    buttonHTML += "<a  onclick=\"ChangePopupGiftCardOrderStatusById('Shipped'," + value.ID + "," + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                    buttonHTML += "</div>";
                    buttonHTML += "</div>";
                }

                $("#popupGiftCardButtons").html(buttonHTML);
        

            }
        });


        if (JSON.parse(JSON.stringify(filtered_history)).length < 0) {

            $("#dvOrderItem").html("No record(s) found.");

        }
        else {
            html += "<table id=\"tbl_" + orderId + "\" class=\"table table-striped\" cellspacing=\"0\" cellpadding=\"0\"> ";
            html += "<tbody>";
            html += "<tr><th style=\"text-align:left;\">Date</th>"
            html += "<th style=\"text-align:right;\">Amount</th>"
            html += "<th style=\"text-align:center;\">Register</th></tr>"
            $.each(JSON.parse(JSON.stringify(filtered_history)), function (index1, value) {
                var orderDate = "";
                var orderTime = "";
                if (value.CreatedOnUtc != null && value.CreatedOnUtc != undefined) {
                    var arrDateTime = value.CreatedOnUtc.split('~');
                    orderDate = arrDateTime[0];
                    orderTime = arrDateTime[1];
                }
                html += "<tr><td style=\"text-align:left;\">" + orderDate + " @ " + orderTime + "</td>";
                if (value.Type == "Load") {
                    html += "<td style=\"text-align:right;\">" + FormatDecimal(value.UsedValue) + "</td>";
                }
                else {
                    html += "<td style=\"text-align:right;\">-" + FormatDecimal(value.UsedValue) + "</td>";
                }

                html += "<td style=\"text-align:center;\">" + value.Register + "</td>";

                html += "</tr>";

            });
        }

        $("#dvOrderItem").html(html + "</tbody>");
        $("#titleRedemptionHistory").show();
    });



    //$('#dvGiftCardDetails').html($('#dvGiftCardDetailsInner').html());
    $('#dvDetailsPanel').html($('#giftcard #dvGiftCardDetailsInner').html());
}

function ClearGiftCardDetails() {

    $('#divGiftCardDetailsPanel #lblEditGiftCardCode').show();
    var dad = $("#divGiftCardDetailsPanel #txtEditGiftCardCode").parent();
    $("#divGiftCardDetailsPanel #txtEditGiftCardCode").hide();
    dad.find('label').show();
    $('#divGiftCardDetailsPanel #aEditCode').show()
    $('#divGiftCardDetailsPanel #aSaveCode').hide();
    $('#divGiftCardDetailsPanel #dvGiftCardDetailsInner').hide();
    $('#divGiftCardDetailsPanel #dvGiftCardDetails').html("");


}

function ChangeGiftCardOrderStatusById(status, id, orderId) {
    
    var storeId = 0;
    var giftCardId = id;
    storeId = SetStoreId();
    //orderId = orderId;
    if (storeId > 0 && orderId > 0) {
        currentPage = 0;
        pageSize = 10;
        $.ajax({
            url: global + 'ChangeOrderStatus?storeid=' + storeId + '&orderId=' + orderId + "&status=" + status,
            type: 'GET',
            datatype: 'jsonp',
            contenttype: "application/json",
            crossDomain: true,
            async: false,
            success: function (data) {
               // console.log(data);
                var buttonHTML = "";
                if (status.toLowerCase() == "new") {
                    //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></div>";
                    buttonHTML += "<div class=\"dropdown\" id=\"giftcardstatus_" + giftCardId + "\">";
                    buttonHTML += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + giftCardId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></button>";
                    buttonHTML += "<div id=\"myDropdown_" + giftCardId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + giftCardId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Complete'," + giftCardId + "," + orderId + ")\" id=\"btnComplete_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    buttonHTML += "<a  onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + giftCardId + "," + orderId + ")\" id=\"btnPickedUp_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    buttonHTML += "<a  onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + giftCardId + "," + orderId + ")\" id=\"btnShipped_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                    buttonHTML += "</div>";
                    buttonHTML += "</div>";
                }

                else if (status.toLowerCase() == "shipped") {
                    // html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></div>";
                    buttonHTML += "<div class=\"dropdown\" id=\"giftcardstatus_" + giftCardId + "\">";
                    buttonHTML += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + giftCardId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/></button>";
                    buttonHTML += "<div id=\"myDropdown_" + giftCardId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + giftCardId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    //html += "<a onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + "," + storeId + ")\" id=\"btnNew_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">New</span></a>";
                    buttonHTML += "<a  onclick=\"ChangeGiftCardOrderStatusById('Complete'," + giftCardId + "," + orderId + ")\" id=\"btnComplete_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\">Complete</span></a>";
                    buttonHTML += "<a  onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + giftCardId + "," + orderId + ")\" id=\"btnPickedUp_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\">Picked Up</span></a>";
                    buttonHTML += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + giftCardId + ");\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                    buttonHTML += "</div>";
                    buttonHTML += "</div>";
                }
                else if (status.toLowerCase() == "pickedup") {
                    //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                    buttonHTML += "<div class=\"dropdown\" id=\"giftcardstatus_" + giftCardId + "\">";
                    buttonHTML += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + giftCardId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                    buttonHTML += "<div id=\"myDropdown_" + giftCardId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + giftCardId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Complete'," + giftCardId + "," + orderId + ")\" id=\"btnComplete_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    buttonHTML += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + giftCardId + ");\" id=\"btnPickedUp_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    buttonHTML += "<a  onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + giftCardId + "," + orderId + ")\" id=\"btnShipped_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                    buttonHTML += "</div>";
                    buttonHTML += "</div>";
                }
                else if (status.toLowerCase() == "complete") {
                    //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                    buttonHTML += "<div class=\"dropdown\" id=\"giftcardstatus_" + giftCardId + "\">";
                    buttonHTML += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + giftCardId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                    buttonHTML += "<div id=\"myDropdown_" + giftCardId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + giftCardId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    buttonHTML += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + giftCardId + ");\" id=\"btnComplete_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    buttonHTML += "<a  onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + giftCardId + "," + orderId + ")\" id=\"btnPickedUp_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    buttonHTML += "<a  onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + giftCardId + "," + orderId + ")\" id=\"btnShipped_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                    buttonHTML += "</div>";
                    buttonHTML += "</div>";
                }
                //
                $("#giftcardstatus_" + giftCardId).html(buttonHTML);
            },
            error: function (xhr, textStatus, errorThrown) {
                //alert(xhr.responseText);
                //alert(textStatus);
                //alert(errorThrown);
            }
        });
    }
}
function ChangePopupGiftCardOrderStatusById(status, id, orderId) {

    var storeId = 0;
    var giftCardId = id;
    storeId = SetStoreId();
    //orderId = orderId;
    if (storeId > 0 && orderId > 0) {
        currentPage = 0;
        pageSize = 10;
        $.ajax({
            url: global + 'ChangeOrderStatus?storeid=' + storeId + '&orderId=' + orderId + "&status=" + status,
            type: 'GET',
            datatype: 'jsonp',
            contenttype: "application/json",
            crossDomain: true,
            async: false,
            success: function (data) {
                var buttonHTML = "";
                var buttonHTMLPopup = "";
                if (status.toLowerCase() == "new") {
                    //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></div>";
                    buttonHTML += "<div class=\"dropdown\" id=\"giftcardstatus_" + giftCardId + "\">";
                    buttonHTML += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + giftCardId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></button>";
                    buttonHTML += "<div id=\"myDropdown_" + giftCardId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + giftCardId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Complete'," + giftCardId + "," + orderId + ")\" id=\"btnComplete_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    buttonHTML += "<a  onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + giftCardId + "," + orderId + ")\" id=\"btnPickedUp_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    buttonHTML += "<a  onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + giftCardId + "," + orderId + ")\" id=\"btnShipped_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                    buttonHTML += "</div>";
                    buttonHTML += "</div>";


                    buttonHTMLPopup += "<div class=\"dropdown\" id=\"popupgiftcardstatus_" + giftCardId + "\">";
                    buttonHTMLPopup += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + giftCardId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></button>";
                    buttonHTMLPopup += "<div id=\"myPopupDropdown_" + giftCardId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + giftCardId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    buttonHTMLPopup += "<a onclick=\"ChangePopupGiftCardOrderStatusById('Complete'," + giftCardId + "," + orderId + ")\" id=\"btnComplete_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    buttonHTMLPopup += "<a  onclick=\"ChangePopupGiftCardOrderStatusById('PickedUp'," + giftCardId + "," + orderId + ")\" id=\"btnPickedUp_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    buttonHTMLPopup += "<a  onclick=\"ChangePopupGiftCardOrderStatusById('Shipped'," + giftCardId + "," + orderId + ")\" id=\"btnShipped_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                    buttonHTMLPopup += "</div>";
                    buttonHTMLPopup += "</div>";
                }

                else if (status.toLowerCase() == "shipped") {
                    buttonHTML += "<div class=\"dropdown\" id=\"giftcardstatus_" + giftCardId + "\">";
                    buttonHTML += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + giftCardId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/></button>";
                    buttonHTML += "<div id=\"myDropdown_" + giftCardId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + giftCardId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    buttonHTML += "<a  onclick=\"ChangeGiftCardOrderStatusById('Complete'," + giftCardId + "," + orderId + ")\" id=\"btnComplete_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\">Complete</span></a>";
                    buttonHTML += "<a  onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + giftCardId + "," + orderId + ")\" id=\"btnPickedUp_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\">Picked Up</span></a>";
                    buttonHTML += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + giftCardId + ");\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                    buttonHTML += "</div>";
                    buttonHTML += "</div>";

                    buttonHTMLPopup += "<div class=\"dropdown\" id=\"popupgiftcardstatus_" + giftCardId + "\">";
                    buttonHTMLPopup += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + giftCardId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/></button>";
                    buttonHTMLPopup += "<div id=\"myPopupDropdown_" + giftCardId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + giftCardId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    buttonHTMLPopup += "<a  onclick=\"ChangePopupGiftCardOrderStatusById('Complete'," + giftCardId + "," + orderId + ")\" id=\"btnComplete_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\">Complete</span></a>";
                    buttonHTMLPopup += "<a  onclick=\"ChangePopupGiftCardOrderStatusById('PickedUp'," + giftCardId + "," + orderId + ")\" id=\"btnPickedUp_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\">Picked Up</span></a>";
                    buttonHTMLPopup += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + giftCardId + ");\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                    buttonHTMLPopup += "</div>";
                    buttonHTMLPopup += "</div>";
                }
                else if (status.toLowerCase() == "pickedup") {
                    //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                    buttonHTML += "<div class=\"dropdown\" id=\"giftcardstatus_" + giftCardId + "\">";
                    buttonHTML += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + giftCardId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                    buttonHTML += "<div id=\"myDropdown_" + giftCardId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + giftCardId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Complete'," + giftCardId + "," + orderId + ")\" id=\"btnComplete_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    buttonHTML += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + giftCardId + ");\" id=\"btnPickedUp_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    buttonHTML += "<a  onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + giftCardId + "," + orderId + ")\" id=\"btnShipped_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                    buttonHTML += "</div>";
                    buttonHTML += "</div>";

                    buttonHTMLPopup += "<div class=\"dropdown\" id=\"popupgiftcardstatus_" + giftCardId + "\">";
                    buttonHTMLPopup += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + giftCardId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                    buttonHTMLPopup += "<div id=\"myPopupDropdown_" + giftCardId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + giftCardId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    buttonHTMLPopup += "<a onclick=\"ChangePopupGiftCardOrderStatusById('Complete'," + giftCardId + "," + orderId + ")\" id=\"btnComplete_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    buttonHTMLPopup += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + giftCardId + ");\" id=\"btnPickedUp_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    buttonHTMLPopup += "<a  onclick=\"ChangePopupGiftCardOrderStatusById('Shipped'," + giftCardId + "," + orderId + ")\" id=\"btnShipped_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                    buttonHTMLPopup += "</div>";
                    buttonHTMLPopup += "</div>";
                }
                else if (status.toLowerCase() == "complete") {
                    //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                    buttonHTML += "<div class=\"dropdown\" id=\"giftcardstatus_" + giftCardId + "\">";
                    buttonHTML += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + giftCardId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                    buttonHTML += "<div id=\"myDropdown_" + giftCardId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + giftCardId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    buttonHTML += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + giftCardId + ");\" id=\"btnComplete_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    buttonHTML += "<a  onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + giftCardId + "," + orderId + ")\" id=\"btnPickedUp_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    buttonHTML += "<a  onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + giftCardId + "," + orderId + ")\" id=\"btnShipped_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                    buttonHTML += "</div>";
                    buttonHTML += "</div>";


                    buttonHTMLPopup += "<div class=\"dropdown\" id=\"popupgiftcardstatus_" + giftCardId + "\">";
                    buttonHTMLPopup += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + giftCardId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                    buttonHTMLPopup += "<div id=\"myPopupDropdown_" + giftCardId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + giftCardId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    buttonHTMLPopup += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + giftCardId + ");\" id=\"btnComplete_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    buttonHTMLPopup += "<a  onclick=\"ChangePopupGiftCardOrderStatusById('PickedUp'," + giftCardId + "," + orderId + ")\" id=\"btnPickedUp_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    buttonHTMLPopup += "<a  onclick=\"ChangePopupGiftCardOrderStatusById('Shipped'," + giftCardId + "," + orderId + ")\" id=\"btnShipped_" + giftCardId + "\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                    buttonHTMLPopup += "</div>";
                    buttonHTMLPopup += "</div>";
                }
                //
                $("#giftcardstatus_" + giftCardId).html(buttonHTML);
                $("#popupgiftcardstatus_" + giftCardId).html(buttonHTMLPopup);
            },
            error: function (xhr, textStatus, errorThrown) {
                //alert(xhr.responseText);
                //alert(textStatus);
                //alert(errorThrown);
            }
        });
    }
}
function EditCardCode() {
    $('#divGiftCardDetailsPanel #aEditCode').hide();
    $('#divGiftCardDetailsPanel #aEditCode').prev().hide();
    $('#divGiftCardDetailsPanel #aEditCode').next().show();
    $('#divGiftCardDetailsPanel #txtEditGiftCardCode').show();
    $('#divGiftCardDetailsPanel #txtEditGiftCardCode').val("");
    $("#divGiftCardDetailsPanel #txtEditGiftCardCode").val($('#divGiftCardDetailsPanel #aEditCode').prev().text());
    $('#divGiftCardDetailsPanel #aSaveCode').show();
}
function SaveCardCode() {
    $('#divGiftCardDetailsPanel #aSaveCode').hide();
    $('#divGiftCardDetailsPanel #aSaveCode').prev().hide();
    $('#divGiftCardDetailsPanel #aSaveCode').next().show();
    var giftcardid = $("#divGiftCardDetailsPanel #hdnGiftCardId").val();
    if ($('#divGiftCardDetailsPanel #txtEditGiftCardCode').val() != "")
        UpdateGiftCardCode(giftcardid, encodeURIComponent($('#divGiftCardDetailsPanel #txtEditGiftCardCode').val()));
}

//Refresh GiftCard Detsils
function RefreshGiftCardDetails(id) {
    var customerId = 0;
    var storeId = 0;
    customerId = SetCustomerId();
    storeId = SetStoreId();
    $("#btnAccept").hide();
    $("#btnNew").hide();
    $("#btnComplete").hide();
    $("#btnProcessing").hide();
    $("#btnPickedUp").hide();

    var url = global + "/GetGiftCardHistory?storeid=" + storeId + "&giftcardId=" + id;
    $.getJSON(url, function (data) {
        $.each(JSON.parse(data), function (index, value) {
            if (value.TABLETYPE == "GiftCardInfo") {
                //if (value.ORDERSTATUSID == "New") {
                //    $("#btnProcessing").show();
                //    $("#btnPickedUp").hide();
                //    $("#btnShipped").hide();
                //    $("#btnNew").hide();
                //    $("#btnComplete").hide();

                //}
                //else if (value.ORDERSTATUSID == "Processing") {
                //    $("#btnProcessing").hide();
                //    $("#btnPickedUp").hide();
                //    $("#btnShipped").hide();
                //    $("#btnNew").show();
                //    $("#btnComplete").show();
                //}
                //else if (value.ORDERSTATUSID == "Shipped") {
                //    $("#btnProcessing").hide();
                //    $("#btnPickedUp").show();
                //    $("#btnShipped").hide();
                //    $("#btnNew").hide();
                //    $("#btnComplete").show();
                //}
                //else if (value.ORDERSTATUSID == "PickedUp") {
                //    $("#btnProcessing").hide();
                //    $("#btnPickedUp").hide();
                //    $("#btnShipped").show();
                //    $("#btnNew").hide();
                //    $("#btnComplete").show();
                //}
                //else if (value.ORDERSTATUSID == "Complete") {
                //    $("#btnProcessing").show();
                //    $("#btnPickedUp").show();
                //    $("#btnShipped").show();
                //    $("#btnNew").hide();
                //    $("#btnComplete").hide();
                //}

                var buttonHTML = "";
                if (value.ORDERSTATUSID == "New") {

                    buttonHTML += "<img class=\"giftcard-button-set carryout-button\" src=\"./img/icons/new_button_active.png\"  />";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('Complete')\" id=\"btnComplete_" + value.ID + "\"><img src=\"./img/icons/complete_button.png\" class=\"carryout-button-set-2\"/></a>";

                    //buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Processing')\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\" class=\"carryout-button-set-2\" /></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('PickedUp')\" id=\"btnPickedUp_" + value.ID + "\"><img src=\"./img/icons/picked_up_button.png\"  class=\"carryout-button-set-2\"/></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('Shipped')\" id=\"btnShipped_" + value.ID + "\"><img src=\"./img/icons/shipped_button.png\" class=\"carryout-button-set-2\"/></a>";
                    //buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\" class=\"carryout-button-set-2\" /></a>";
                    //buttonHTML += "<img src=\"./img/icons/picked_up_button_active.png\" class=\"giftcard-button-set carryout-button\"/>";
                    //buttonHTML += "<img src=\"./img/icons/shipped_button_active.png\" class=\"giftcard-button-set carryout-button\"/>";
                    //buttonHTML += "<img src=\"./img/icons/complete_button_active.png\" class=\"giftcard-button-set carryout-button\" />";

                }
                    //else if (value.ORDERSTATUSID == "Processing") {
                    //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('New')\" id=\"btnNew_" + value.ID + "\"><img src=\"./img/icons/new_button.png\" class=\"carryout-button-set-2\" /></a>";
                    //    buttonHTML += "<img class=\"giftcard-button-set carryout-button\" src=\"./img/icons/pending_button_active.png\" />";
                    //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('PickedUp')\" id=\"btnPickedUp_" + value.ID + "\"><img src=\"./img/icons/picked_up_button.png\"  class=\"carryout-button-set-2\"/></a>";
                    //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('Shipped')\" id=\"btnShipped_" + value.ID + "\"><img src=\"./img/icons/shipped_button.png\" class=\"carryout-button-set-2\"/></a>";
                    //    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('Complete')\" id=\"btnComplete_" + value.ID + "\"><img src=\"./img/icons/complete_button.png\" class=\"carryout-button-set-2\"/></a>";
                    //}
                else if (value.ORDERSTATUSID == "Shipped") {
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('New')\" id=\"btnNew_" + value.ID + "\"><img src=\"./img/icons/new_button.png\" class=\"carryout-button-set-2\" /></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('Complete')\" id=\"btnComplete_" + value.ID + "\"><img src=\"./img/icons/complete_button.png\" class=\"carryout-button-set-2\"/></a>";
                    //buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('Processing')\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\" class=\"carryout-button-set-2\" /></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('PickedUp')\" id=\"btnPickedUp_" + value.ID + "\"><img src=\"./img/icons/picked_up_button.png\"  class=\"carryout-button-set-2\"/></a>";
                    buttonHTML += "<img class=\"giftcard-button-set carryout-button\"  src=\"./img/icons/shipped_button_active.png\"/>";

                }
                else if (value.ORDERSTATUSID == "PickedUp") {
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('New')\" id=\"btnNew_" + value.ID + "\"><img src=\"./img/icons/new_button.png\" class=\"carryout-button-set-2\" /></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('Complete')\" id=\"btnComplete_" + value.ID + "\"><img src=\"./img/icons/complete_button.png\" class=\"carryout-button-set-2\"/></a>";
                    //buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('Processing')\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\" class=\"carryout-button-set-2\" /></a>";
                    buttonHTML += "<img src=\"./img/icons/picked_up_button_active.png\" class=\"giftcard-button-set carryout-button\"/>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('Shipped')\" id=\"btnShipped_" + value.ID + "\"><img src=\"./img/icons/shipped_button.png\" class=\"carryout-button-set-2\"/></a>";
                }
                else if (value.ORDERSTATUSID == "Complete") {
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('New')\" id=\"btnNew_" + value.ID + "\"><img src=\"./img/icons/new_button.png\" class=\"carryout-button-set-2\" /></a>";
                    buttonHTML += "<img class=\"giftcard-button-set carryout-button\" src=\"./img/icons/complete_button_active.png\" />";
                    //buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('Processing')\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\"  class=\"carryout-button-set-2\" /></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('PickedUp')\" id=\"btnPickedUp_" + value.ID + "\"><img src=\"./img/icons/picked_up_button.png\" class=\"carryout-button-set-2\"/></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('Shipped')\" id=\"btnShipped_" + value.ID + "\"><img src=\"./img/icons/shipped_button.png\" class=\"carryout-button-set-2\"/></a>";

                }

                $("#popupGiftCardButtons").html(buttonHTML);
            }
        });
    });
}

//Chenage GiftCard Order Status
function ChangeGiftCardOrderStatusNew(status) {
    var storeId = 0;
    var orderId = 0;
    var giftCardId = Number($("#hdnGiftCardId").val());
    storeId = SetStoreId();
    orderId = Number($("#hdnSelectedOrderId").val());
    if (storeId > 0 && orderId > 0) {
        currentPage = 0;
        pageSize = 10;

        $.ajax({
            url: global + 'ChangeOrderStatus?storeid=' + storeId + '&orderId=' + orderId + "&status=" + status,
            type: 'GET',
            datatype: 'jsonp',
            contenttype: "application/json",
            crossDomain: true,
            async: false,
            success: function (data) {

                //RefreshGiftCards();
                RefreshGiftCardDetails(giftCardId);

                var buttonHTML = "";
                if (status == "New") {
                    $("#img_" + giftCardId).attr("src", "img/icons/new.png");

                    buttonHTML += "<img class=\"giftcard-button-set carryout-button\" src=\"./img/icons/new_button_active.png\"  />";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('Complete')\" id=\"btnComplete_" + giftCardId + "\"><img src=\"./img/icons/complete_button.png\" class=\"carryout-button-set-2\"/></a>";

                    //buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusById('Processing')\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\" class=\"carryout-button-set-2\" /></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('PickedUp')\" id=\"btnPickedUp_" + giftCardId + "\"><img src=\"./img/icons/picked_up_button.png\"  class=\"carryout-button-set-2\"/></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('Shipped')\" id=\"btnShipped_" + giftCardId + "\"><img src=\"./img/icons/shipped_button.png\" class=\"carryout-button-set-2\"/></a>";

                }
                else if (status == "Shipped") {
                    $("#img_" + giftCardId).attr("src", "img/icons/shipped.png");

                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('New')\" id=\"btnNew_" + giftCardId + "\"><img src=\"./img/icons/new_button.png\" class=\"carryout-button-set-2\" /></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('Complete')\" id=\"btnComplete_" + giftCardId + "\"><img src=\"./img/icons/complete_button.png\" class=\"carryout-button-set-2\"/></a>";
                    //buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('Processing')\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\" class=\"carryout-button-set-2\" /></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('PickedUp')\" id=\"btnPickedUp_" + giftCardId + "\"><img src=\"./img/icons/picked_up_button.png\"  class=\"carryout-button-set-2\"/></a>";
                    buttonHTML += "<img class=\"giftcard-button-set carryout-button\"  src=\"./img/icons/shipped_button_active.png\"/>";

                }
                else if (status == "PickedUp") {
                    $("#img_" + giftCardId).attr("src", "img/icons/Picked-Up-Icon.png");

                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('New')\" id=\"btnNew_" + giftCardId + "\"><img src=\"./img/icons/new_button.png\" class=\"carryout-button-set-2\" /></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('Complete')\" id=\"btnComplete_" + giftCardId + "\"><img src=\"./img/icons/complete_button.png\" class=\"carryout-button-set-2\"/></a>";
                    //buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('Processing')\" id=\"btnProcessing_" + giftCardId + "\"><img src=\"./img/icons/pending_button.png\" class=\"carryout-button-set-2\" /></a>";
                    buttonHTML += "<img src=\"./img/icons/picked_up_button_active.png\" class=\"giftcard-button-set carryout-button\"/>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('Shipped')\" id=\"btnShipped_" + giftCardId + "\"><img src=\"./img/icons/shipped_button.png\" class=\"carryout-button-set-2\"/></a>";
                }
                else if (status == "Complete") {
                    $("#img_" + giftCardId).attr("src", "img/icons/Complete-Icon.png");

                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('New')\" id=\"btnNew_" + giftCardId + "\"><img src=\"./img/icons/new_button.png\" class=\"carryout-button-set-2\" /></a>";
                    buttonHTML += "<img class=\"giftcard-button-set carryout-button\" src=\"./img/icons/complete_button_active.png\" />";
                    //buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('Processing')\" id=\"btnProcessing_" + giftCardId + "\"><img src=\"./img/icons/pending_button.png\"  class=\"carryout-button-set-2\" /></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('PickedUp')\" id=\"btnPickedUp_" + giftCardId + "\"><img src=\"./img/icons/picked_up_button.png\" class=\"carryout-button-set-2\"/></a>";
                    buttonHTML += "<a class=\"carryout-button\" onclick=\"ChangeGiftCardOrderStatusNew('Shipped')\" id=\"btnShipped_" + giftCardId + "\"><img src=\"./img/icons/shipped_button.png\" class=\"carryout-button-set-2\"/></a>";

                }

                $("#btnSet_" + giftCardId).html(buttonHTML);


            },
            error: function (xhr, textStatus, errorThrown) {
                //alert(xhr.responseText);
                //alert(textStatus);
                //alert(errorThrown);
            }
        });
    }

}

//Refresh carryout
function RefreshGiftCards() {
    pageSize = 10;
    currentPage = 0;
    GiftCardOrdersList(pageSize, currentPage);
}
//Filter gift cards
function filterGiftCards(my_object, my_criteria) {

    var result = my_object.filter(function (entry) {
        return entry.TABLETYPE === my_criteria;
    });
    return result;


}
//update gift card code
function UpdateGiftCardCode(giftCardId) {
    try {
        var giftcardcode = $("#txtEditGiftCardCode").val();
        url = global + "/UpdateGiftCardCode?giftCardId=" + giftCardId + "&giftcardcode=" + giftcardcode;

        $.getJSON(url, function (data) {
            if (data.indexOf("Successful") > -1) {
                $('#txtEditGiftCardCode').trigger('focusout');
                $("#lblEditGiftCardCode").text($('#txtEditGiftCardCode').val());
                $("#lbl_giftCardCode_" + giftCardId).html(giftcardcode);
            }
            else {
                //alert("Gift card code update failed.")
                callSweetAlertWarning("Gift card code update failed.");
            }

            $('#lblEditGiftCardCode').show();
            var dad = $("#txtEditGiftCardCode").parent();
            $("#txtEditGiftCardCode").hide();
            dad.find('label').show();
            $('#aEditCode').show()
            $('#aSaveCode').hide();
            //$('#aCancelSaveCode').hide();
        });
    }
    catch (e) {

    }
}

function GiftCardBack() {
    var storeId = 0;
    var params = getParams();
    if (typeof (params["StoreId"]) != "undefined") {
        storeId = params["StoreId"];
    }
    else {
        if (localStorage.getItem("StoreId") != null)
            storeId = localStorage.getItem("StoreId").trim();
    }
    // window.location.href = "giftcard.html?StoreId=" + storeId;
}

function ShowSearch() {
    $('#linkSearchIcon').show();
    $('#ulFilterSortGiftCard').show();
    $('#ulFilterSortCarryout').hide();
    $('#ulFilterSortCoupon').hide();
    RefreshGiftCards();
}
function HideSearch(tabName) {


    //if(tabName=="New")
    //{
    //    $("#tab-giftcard-new #txtCardCode").focus();
    //}
    //else {
    //    $("#tab-giftcard-loadRedeem #txtCardCodeSearch").focus();
    //}
    $('#linkSearchIcon').hide();
    $('#ulFilterSortGiftCard').hide();
    $('#ulFilterSortItem').hide();

}
function RewardsTabChange(tabName) {
    $('#ulFilterSortItem').hide();
    if (tabName == "New") {
        $("#txtMemberId_Reward").focus();
    }
    else {
        $("#txtMemberID_LoadRedeem").focus();
    }
}
//Gift Card Orders END

//GiftCard Redeem End

//Reward Start
//Reward Start
function SearchReward() {

    //alert('SearchReward');
    //$('#btnRedeemReward').removeClass("search-button");
    //$('#btnRedeemReward').addClass("search-button-one");
    //$('#btnLoadReward').removeClass("search-button");
    //$('#btnLoadReward').addClass("search-button-one");

    $("#reward_LoadRedeem #txtLoad_LoadRedeem").css('border-bottom', bottomBorder);
    $("#reward_LoadRedeem #txtRedeem_LoadRedeem").css('border-bottom', bottomBorder);
    $('#reward_LoadRedeem #btnLoadReward').text("Load");
    $('#reward_LoadRedeem #btnRedeemReward').text("Redeem");
    $('#dvOuter').hide();


    var storeId = 0;
    storeId = SetStoreId();
    var memberId = $('#reward_LoadRedeem #txtMemberID_LoadRedeem').val().trim();

    var phone = $('#reward_LoadRedeem #txtPhone_LoadRedeem').val().trim();

    var lastName = $("#reward_LoadRedeem #txtLastName_LoadRedeem").val().trim();
   
    if (memberId != "" || (phone != "" && phone != '0' )) {
        $("#txtLastName_LoadRedeem").css('border-bottom', bottomBorder);
        $("#txtPhone_LoadRedeem").css('border-bottom', bottomBorder);
        //alert('2');
        try {
            if (memberId != "") {
                phone = "";
                lastName = "";
            }

            url = global + "/RewardSearchNew?storeid=" + storeId + "&rewardMemberId=" + memberId + "&phone=" + phone + "&lastName=" + encodeURIComponent(lastName);

            $('#tblRewardHistory tbody').html("");
            $.getJSON(url, function (data) {
                console.log('data: ' + data);
                $('#tblRewardHistory tbody').html("");
                
                if (data.replace(/"/g, "").indexOf("Invalid Member ID.") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').hide();
                   
                    callSweetAlertWarning("Invalid Member ID.");
                    $('#btnLoadReward').addClass("disabled");
                    $('#btnRedeemReward').addClass("disabled");
                }
                else if (data.replace(/"/g, "").indexOf("No record(s) found.") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').show();
                    $('#dvOuterText').html("");
                    $('#btnLoadReward').addClass("disabled");
                    $('#btnRedeemReward').addClass("disabled");
                    if (memberId != "") {
                        callSweetAlertWarning("Invalid Member ID.");
                    }
                    else {
                        //callSweetAlertWarning("No record found.");
                        swal({
                            //title: 'Are you sure?',
                            text: "MemberID not found. Would you like to add a New MemberID?",
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: 'rgb(59, 152, 71)',
                            cancelButtonColor: 'rgb(233, 88, 97)',
                            confirmButtonText: 'Yes'
                        }).then(
                        function (isConfirm) {
                            //console.log("sds:"+isConfirm)
                            if (isConfirm.value)
                            {
                                app.tab.show('#reward_new');
                                $("#txtPhone_Reward").val(phone);
                                if (lastName != "")
                                    $("#txtName_Reward").val(lastName);
                            }
                            else {
                                return false;
                            }
                            
                         
                        }
                        
                        );
                    }
                    
                }
                else {
                  
                    $('#lblMemberId').html(memberId);
                    $('#btnRedeemReward').removeClass("disabled");
                    $('#btnLoadReward').removeClass("disabled");
                    $('#btnRedeemReward').removeClass("disabled");
                    var relatedStoreName = "";
                    var type = JSON.parse(data)[0].Type;
                    //console.log('type: ' + type);
                    if (type != null && type != undefined && type == "NoReward") {

                        var historyHTML = "";
                        var count = 0;
                        historyHTML += "<div class=\"popup-header-row\">"+
                            "<div class=\"popup-col-1-header\" style=\"width:20%;\">Reward ID</div>" +
                            "<div class=\"popup-col-2-header\" style=\"width:35%;\">Name</div><div class=\"popup-col-3-header\" style=\"width:45%;\">Email</div></div>";
                        $.each(JSON.parse(data), function (index, value) {
                            var firstName = "";
                            var lastName = "";
                            var fullName = "";
                            if (value.FIRSTNAME != "") {
                                firstName = value.FIRSTNAME;
                            }
                            if (value.LASTNAME != "") {
                                lastName = value.LASTNAME;
                            }
                            fullName = firstName + " " + lastName;
                            historyHTML += "<div id=\"memberRow_" + value.ID + "\" class=\"popup-unlined-row\" style=\"\" onclick=\"SelectCustomer(" + value.ID + ");\">";
                            if (value.REWARDMEMBERID != null)
                                historyHTML += "<div id=\"memberId_" + value.ID + "\" class=\"popup-col-1\" style=\"width:20%;font-size:18px;\">" + value.REWARDMEMBERID + "</div>";
                            else
                                historyHTML += "<div id=\"memberId_" + value.ID + "\" class=\"popup-col-1\" style=\"width:20%;font-size:18px;\"></div>";

                            historyHTML += "<div id=\"fullName_" + value.ID + "\" class=\"popup-col-2\" style=\"width:35%;font-size:18px;\">" + fullName.trim() + "</div>";
                            if (value.EMAIL != null)
                                historyHTML += "<div id=\"email_" + value.ID + "\" class=\"popup-col-3\" style=\"width:45%;font-size:18px;\">" + value.EMAIL + "</div>";
                            else
                                historyHTML += "<div id=\"email_" + value.ID + "\" class=\"popup-col-3\" style=\"width:45%;font-size:18px;\"></div>";
                            historyHTML += "</div>";


                        });
                        var formattedPhoneNumber = phone;
                        if (phone.length == 10)
                            formattedPhoneNumber = formatPhoneNumber(phone);
                        var html = "<div class=\"popup-content-area\"><h2 class=\"popup-title\"><span style=\"font-size: 18px;\">Phone <span style=\"font-weight:600;font-size: 20px;\">" + formattedPhoneNumber + "</span> matches found:</span></h2>";
                        html += "<div class=\"popup-close-one\" onclick=\"CloseAddRewardMemberPopup();\">X</div>";
                       html += "<h4 id=\"popuperror\" style=\"font-weight:400;color:#ff4848;display:none;\"></h4>";
                       html += historyHTML;
                       html += "<div class=\"popup-button-area\"><button style=\"width:85px;\" id=\"btnRewardMemberClose\" onclick=\"CloseRewardMembersPopup(" + phone + ");\" type=\"button\" class=\"popup-confirm swal2-styled\" aria-label=\"\" " +
                        "style=\"background-color: rgb(59, 152, 71); border-left-color: rgb(59, 152, 71); border-right-color: rgb(59, 152, 71);\">Select</button>" +
                        "<button style=\"width:85px;background-color: rgb(233, 88, 97); border:1px solid rgb(233, 88, 97);\" id=\"btnMemberPopupCreate\" onclick=\"GoToCreateMember(" + phone + ");\" type=\"button\" class=\"popup-confirm swal2-styled\" aria-label=\"\" " +
                        ">Create</button></div></div>";
                       
                        html += "<input type=\"hidden\" id=\"selectedCustomerId\" value=\"0\" />";
                        $('#rewardMultipleCustomers').html(html);
                        $(".popup-overlay").show();
                        $('#rewardMultipleCustomers').show();

                    }
                    else {

                        $.each(JSON.parse(data), function (index, value) {
                            //console.log('Rewards: '+data);
                            if (value.Type == "RewardInfo") {
                                var htmlHistory = "";
                                var firstName = "";
                                var lastName = "";
                                var email = "";
                                var phoneNumber = "";
                                var ourLocationPoint = "0";
                                var bistroPoint = "0";
                                var relatedStorePointsBalance = "0";
                                var rewardMemberId = "";
                                if (value.FIRSTNAME != "") {
                                    firstName = value.FIRSTNAME;
                                }
                                if (value.LASTNAME != "") {
                                    lastName = value.LASTNAME;
                                }
                                if (value.EMAIL != "") {
                                    if (value.EMAIL.indexOf('@bistroux.com') < 0) {
                                        email = value.EMAIL;
                                    }
                                }
                                if (value.PHONE != "") {
                                    phoneNumber = value.PHONE;
                                }
                               // console.log('value.StoreID: ' + value.StoreID)
                                //console.log('value.STOREID: ' + value.STOREID)
                                //if (value.TransactionStoreId == storeId || value.TRANSACTIONSTOREID == storeId)
                                //{
                                    if (value.PointsBalance != "") {
                                        ourLocationPoint = value.PointsBalance;
                                    }
                                    if (value.BistroPointsBalance != "") {
                                        bistroPoint = value.BistroPointsBalance;
                                    }
                                    if (value.RelatedStorePointsBalance != "") {
                                        relatedStorePointsBalance = value.RelatedStorePointsBalance;
                                    }
                                   

                                //}

                                
                                if (value.RewardMemberID != "" && memberId == "") {
                                    rewardMemberId = value.RewardMemberID;
                                    $("#txtMemberID_LoadRedeem").val(rewardMemberId);
                                }
                                else if (phoneNumber != "") {
                                    $("#txtPhone_LoadRedeem").val(phoneNumber);
                                }
                                $("#txtLastName_LoadRedeem").val(firstName + " " + lastName);
                                
                                $('#lblName').html(firstName + " " + lastName);
                                if (phoneNumber.length == 10)
                                    $("#lblPhone").html(formatPhoneNumber(phoneNumber));
                                else
                                    $("#lblPhone").html(phoneNumber);
                                if (phoneNumber == "")
                                    $('#iconPhone').hide();
                                else
                                    $('#iconPhone').show();


                                $('#lblEmail').html(email);

                                $('#lblOurPoints').html(ourLocationPoint);
                                $('#hdnCurrentStorePoints').val(ourLocationPoint);
                                $('#lblBistroPoints').html(bistroPoint);
                                if (Number(relatedStorePointsBalance) > 0) {
                                    $("#liRelatedPoints").show();
                                    $('#lblRelatedPoints').html(relatedStorePointsBalance);
                                }
                                else {
                                    $('#lblRelatedPoints').html("0");
                                    $("#liRelatedPoints").hide();
                                   
                                }
                               

                            }
                            else if (value.Type == "RewardHistory") {
                                var rewardDate = value.CreatedOnUtc.replace("~", " <br/>@ ");
                                htmlHistory += "<tr>";
                                htmlHistory += "<td style=\"text-align:left;vertical-align:top;padding-top: 2px;\" width=\"30%\"\">" + rewardDate + "</td>";
                                htmlHistory += "<td style=\"text-align:left;vertical-align:top;padding-top: 2px;\" width=\"45%\">" + value.STORENAME + "</td>";
                                if (value.Points != "" && value.Points.toString().startsWith("-")) {
                                    htmlHistory += "<td style=\"text-align:center;vertical-align:top;padding-top: 2px;\" width=\"10%\">" + value.Points + "</td>";
                                }
                                else if (value.Points != "") {
                                    htmlHistory += "<td style=\"text-align:center;vertical-align:top;padding-top: 2px;\" width=\"10%\">+" + value.Points + "</td>";
                                }
                                else {
                                    htmlHistory += "<td style=\"text-align:center;vertical-align:top;padding-top: 2px;\" width=\"10%\"> </td>";
                                }
                                htmlHistory += "<td style=\"text-align:right;vertical-align:top;padding-top: 2px;\" width=\"15%\">" + FormatDecimal(value.OrderValue) + "</td>";
                                htmlHistory += "</tr>";
                                $('#tblRewardHistory tbody').append(htmlHistory);
                            }
                            else if (value.Type == "RelatdStoresName") {
                                if (relatedStoreName != "") {
                                    relatedStoreName = relatedStoreName + ", " + value.RestaurantDisplayName;
                                }
                                else {
                                    relatedStoreName = value.RestaurantDisplayName;
                                }
                            }
                        });
                        if (relatedStoreName != "") {
                            $('#lblRelatedStorePoint').show();
                            $('#lblRelatedPoints').show();
                            $("#liRelatedPoints").show();
                            $('#divRelatedStoreName').show();
                            $('#lblRelatedRestauransName').html("(" + relatedStoreName + ")");
                        }
                        else {
                            $('#divRelatedStoreName').hide();
                            $('#lblRelatedStorePoint').hide();
                            $('#lblRelatedPoints').hide();
                            $("#liRelatedPoints").hide();
                        }

                        $('#dvInner_Reward').show();
                        $('#myModal').hide();
                        $('#dvOuter').hide();
                        $('#dvOuterText').html("");
                    }
                   
                   
                }
            });
        }
        catch (e) {

        }
    }
    else {
    
        callSweetAlertWarning("Please enter either Member ID or Phone & Name.");
        if (memberId != "" || phone != "" && phone != '0' && lastName == "")
        {
            $('#dvInner_Reward').hide();
            $("#txtLastName_LoadRedeem").css('border-bottom', errorClassBorder);
        }
        else if (memberId != "" || lastName != "" && phone == "" || phone != '0') {
            $('#dvInner_Reward').hide();
            $("#txtPhone_LoadRedeem").css('border-bottom', errorClassBorder);
        }
        //alert('3');
        $('#dvInner_Reward').hide();
        //$("#txtMemberID_LoadRedeem").css('border-bottom', errorClassBorder);       

    }
}
function SelectCustomer(customerId)
{
    $("#popuperror").html("");
    $("#popuperror").hide();
    $(".popup-unlined-row").removeClass('poprow-selected');
    $("#memberRow_" + customerId).addClass('poprow-selected');
    $("#selectedCustomerId").val(customerId);

}
function CloseRewardMembersPopup(phone) {
    var customerId =Number($("#selectedCustomerId").val());
    var rewardMemberId = $("#memberId_" + customerId).html();
    var fullName= $("#fullName_" + customerId).html();
    var email = $("#email_" + customerId).html();
    $("#popuperror").html("");
    $("#popuperror").hide();
   
    if (customerId > 0)
    {
        if (rewardMemberId != "") {

            $("#txtMemberID_LoadRedeem").val(rewardMemberId);
            $("#txtPhone_LoadRedeem").val(phone);
            $("#txtLastName_LoadRedeem").val(fullName);
            var storeId = 0;
            storeId = SetStoreId();
            var url = global + "/RewardSearchNew?storeid=" + storeId + "&rewardMemberId=" + rewardMemberId + "&phone=" + "" + "&lastName=" + "";
            $('#tblRewardHistory tbody').html("");
            $.getJSON(url, function (data) {
                $('#tblRewardHistory tbody').html("");
               // console.log('result: ' + data)
                if (data.replace(/"/g, "").indexOf("Invalid Member ID.") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').hide();
                    //$('#dvOuter').show();
                    //$('#dvOuterText').html("");
                    //$('#dvOuterText').html("Invalid Member ID.");
                    callSweetAlertWarning("Invalid Member ID.");
                    $('#btnLoadReward').addClass("disabled");
                    $('#btnRedeemReward').addClass("disabled");
                }
                else if (data.replace(/"/g, "").indexOf("No record(s) found.") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').show();
                    $('#dvOuterText').html("");
                    $('#btnLoadReward').addClass("disabled");
                    $('#btnRedeemReward').addClass("disabled");
                    if (memberId != "") {
                        callSweetAlertWarning("Invalid Member ID.");
                    }
                    else {
                        callSweetAlertWarning("No record found.");
                    }

                }
                else {
                    //$("#txtMemberID_LoadRedeem").css('border', noErrorClassBorder);
                    //$("#txtMemberID_LoadRedeem").css('border-bottom', bottomBorder);
                    //$("#txtPhone_LoadRedeem").css('border', noErrorClassBorder);
                    //$("#txtPhone_LoadRedeem").css('border-bottom', bottomBorder);
                    $('#lblMemberId').html(rewardMemberId);
                    $('#btnRedeemReward').removeClass("disabled");
                    $('#btnLoadReward').removeClass("disabled");
                    $('#btnRedeemReward').removeClass("disabled");
                    var relatedStoreName = "";
                    $.each(JSON.parse(data), function (index, value) {

                        //console.log(data);
                        if (value.Type == "RewardInfo") {
                            var htmlHistory = "";
                            var firstName = "";
                            var lastName = "";
                            var email = "";
                            var phoneNumber = "";
                            var ourLocationPoint = "0";
                            var bistroPoint = "0";
                            var relatedStorePointsBalance = "0";

                            if (value.FIRSTNAME != "") {
                                firstName = value.FIRSTNAME;
                            }
                            if (value.LASTNAME != "") {
                                lastName = value.LASTNAME;
                            }
                            if (value.EMAIL != "") {
                                if (value.EMAIL.indexOf('@bistroux.com') < 0) {
                                    email = value.EMAIL;
                                }
                            }
                            if (value.PHONE != "") {
                                phoneNumber = value.PHONE;
                            }
                            if (value.TransactionStoreId == storeId || value.TRANSACTIONSTOREID == storeId){
                                if (value.PointsBalance != "") {
                                    ourLocationPoint = value.PointsBalance;
                                }
                                if (value.BistroPointsBalance != "") {
                                    bistroPoint = value.BistroPointsBalance;
                                }
                                if (value.RelatedStorePointsBalance != "") {
                                    relatedStorePointsBalance = value.RelatedStorePointsBalance;
                                }
                            }

                            //rewardMemberId = value.RewardMemberID;
                            $("#txtMemberID_LoadRedeem").val(rewardMemberId);

                            if (phoneNumber != "") {
                                $("#txtPhone_LoadRedeem").val(phoneNumber);
                            }
                            $("#txtLastName_LoadRedeem").val(firstName + " " + lastName);

                            $('#lblName').html(firstName + " " + lastName);
                            if (phoneNumber.length == 10)
                                $("#lblPhone").html(formatPhoneNumber(phoneNumber));
                            else
                                $("#lblPhone").html(phoneNumber);
                            if (phoneNumber == "")
                                $('#iconPhone').hide();
                            else
                                $('#iconPhone').show();


                            $('#lblEmail').html(email);

                            $('#lblOurPoints').html(ourLocationPoint);
                            $('#hdnCurrentStorePoints').val(ourLocationPoint);
                            $('#lblBistroPoints').html(bistroPoint);
                            if (Number(relatedStorePointsBalance)>0) {
                                $("#liRelatedPoints").show();
                                $('#lblRelatedPoints').html(relatedStorePointsBalance);
                            }
                            else {
                                $('#lblRelatedPoints').html("0");
                                $("#liRelatedPoints").hide();
                            }
                            

                        }
                        else if (value.Type == "RewardHistory") {
                            var rewardDate = value.CreatedOnUtc.replace("~", " <br/>@ ");
                            htmlHistory += "<tr>";
                            htmlHistory += "<td style=\"text-align:left;vertical-align:top;padding-top: 2px;\" width=\"30%\"\">" + rewardDate + "</td>";
                            htmlHistory += "<td style=\"text-align:left;vertical-align:top;padding-top: 2px;\" width=\"45%\">" + value.STORENAME + "</td>";
                            if (value.Points != "" && value.Points.toString().startsWith("-")) {
                                htmlHistory += "<td style=\"text-align:center;vertical-align:top;padding-top: 2px;\" width=\"10%\">" + value.Points + "</td>";
                            }
                            else if (value.Points != "") {
                                htmlHistory += "<td style=\"text-align:center;vertical-align:top;padding-top: 2px;\" width=\"10%\">+" + value.Points + "</td>";
                            }
                            else {
                                htmlHistory += "<td style=\"text-align:center;vertical-align:top;padding-top: 2px;\" width=\"10%\"> </td>";
                            }
                            htmlHistory += "<td style=\"text-align:right;vertical-align:top;padding-top: 2px;\" width=\"15%\">" + FormatDecimal(value.OrderValue) + "</td>";
                            htmlHistory += "</tr>";
                            $('#tblRewardHistory tbody').append(htmlHistory);
                        }
                        else if (value.Type == "RelatdStoresName") {
                            if (relatedStoreName != "") {
                                relatedStoreName = relatedStoreName + ", " + value.RestaurantDisplayName;
                            }
                            else {
                                relatedStoreName = value.RestaurantDisplayName;
                            }
                        }
                    });
                    if (relatedStoreName != "") {
                        $('#lblRelatedStorePoint').show();
                        $("#liRelatedPoints").show();
                        $('#lblRelatedPoints').show();
                        $('#divRelatedStoreName').show();
                        $('#lblRelatedRestauransName').html("(" + relatedStoreName + ")");
                    }
                    else {
                        $('#divRelatedStoreName').hide();
                        $('#lblRelatedStorePoint').hide();
                        $("#liRelatedPoints").hide();
                        $('#lblRelatedPoints').hide();
                       
                    }

                    $('#dvInner_Reward').show();
                    $('#myModal').hide();
                    $('#dvOuter').hide();
                    $('#dvOuterText').html("");

                    //$('#tdTotal').html(FormatDecimal(totalHistoryAmount));

                }
            });
        }
        else {
            //swal({
            //    //title: 'Are you sure?',
            //    text: "MemberID not found. Would you like to add a New MemberID?",
            //    type: 'warning',
            //    showCancelButton: true,
            //    confirmButtonColor: 'rgb(59, 152, 71)',
            //    cancelButtonColor: 'rgb(233, 88, 97)',
            //    confirmButtonText: 'Yes'
            //}).then(function () {
            //    app.tab.show('#reward_new');
            //    $("#txtPhone_Reward").val(phone);
            //    if (fullName != "")
            //        $("#txtName_Reward").val(fullName);
            //    if (email != "")
            //        $("#txtEmail_Reward").val(email);
               
            //});
        }

        $('#rewardMultipleCustomers').html("");
        $(".popup-overlay").hide();
        $('#rewardMultipleCustomers').hide();
    }
    else {
        $("#popuperror").show();
        $("#popuperror").html("Please select a Customer.");
    }
    //$("#selectedCustomerId").val("0");
}
function GoToCreateMember(phone) {
    app.tab.show('#reward_new');
    var customerId = Number($("#selectedCustomerId").val());
    if (customerId != undefined && customerId != null && customerId > 0)
    {
        var rewardMemberId = $("#memberId_" + customerId).html();
        var fullName = $("#fullName_" + customerId).html();
        var email = $("#email_" + customerId).html();
       
        if (fullName != "")
            $("#txtName_Reward").val(fullName);
        if (email != "")
            $("#txtEmail_Reward").val(email);
    }
    $("#txtPhone_Reward").val(phone);
   
    $('#rewardMultipleCustomers').html("");
    $(".popup-overlay").hide();
    $('#rewardMultipleCustomers').hide();
}
function LoadReward() {
    var storeId = 0;
    storeId = SetStoreId();
    var memberId = $('#txtMemberID_LoadRedeem').val();
    var phone = $('#txtPhone_LoadRedeem').val();
    if (phone == '') {
        phone = '0';
    }
    var loadPoint = $('#txtLoad_LoadRedeem').val();
    loadPoint = Math.abs(loadPoint);
    if (loadPoint == '')
        loadPoint = '0';
    if (memberId != "" && loadPoint != "" && loadPoint != "0") {
        $('#btnLoadReward').text("Loading...");
        //$("#txtMemberID_LoadRedeem").css('border-bottom', bottomBorder);
        $("#txtLoad_LoadRedeem").css('border-bottom', bottomBorder);
        $("#txtRedeem_LoadRedeem").css('border-bottom', bottomBorder);

        try {
            url = global + "/RewardLoad?storeid=" + storeId + "&rewardMemberId=" + memberId + "&phone=" + phone + "&loadPoint=" + loadPoint;
            //alert(url);
            $.getJSON(url, function (data) {
                $('#btnLoadReward').text("Load");
                //alert(data);
                if (data.replace(/"/g, "").indexOf("Phone is not valid.") > -1) {
                    $('#dvInner_Reward').hide();
                    if (phone == '' || phone == '0') {
                        $('#dvInner_Reward').hide();
                        //$('#dvOuter').show();
                        //$('#dvOuterText').html("");
                        //$('#dvOuterText').html("Phone Number is required.");
                        $("#txtPhone_LoadRedeem").css('border-bottom', bottomBorder);
                    }
                    else {
                        $("#txtPhone_LoadRedeem").css('border-bottom', bottomBorder);
                        $('#dvInner_Reward').hide();
                        $('#dvOuter').hide();
                        //$('#dvOuter').show();
                        //$('#dvOuterText').html("");
                        //$('#dvOuterText').html("Invalid Phone Number.");
                        callSweetAlertWarning("Invalid Phone Number.");
                    }
                }
                else if (data.replace(/"/g, "").indexOf("Invalid Member ID.") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').hide();
                    //$('#dvOuter').show();
                    //$('#dvOuterText').html("");
                    //$('#dvOuterText').html("Invalid Member ID.");
                    callSweetAlertWarning("Invalid Member ID.");
                }
                else if (data.replace(/"/g, "").indexOf("No record(s) found.") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').show();
                    $('#dvOuterText').html("");
                    $('#dvOuterText').html("No records found.");
                    //WriteLog(SearchGiftCard() + " - " + " No order(s) found.", browser);
                }
                else {
                    //$("#txtMemberID_LoadRedeem").css('border-bottom', bottomBorder);
                    $("#txtLoad_LoadRedeem").css('border-bottom', bottomBorder);
                    $("#txtRedeem_LoadRedeem").css('border-bottom', bottomBorder);

                    $('#dvInner_Reward').show();
                    $('#myModal').hide();
                    $('#dvOuter').hide();
                    $('#dvOuterText').html("");
                    $('#txtLoad_LoadRedeem').val("");
                    SearchReward();
                    callSweetAlertSuccess("Reward Points loaded successfully.")

                }
            });
        }
        catch (e) {

        }
    }
    else {
        //$('#dvInner_Reward').hide();
        if (memberId == "") {
            $("#txtMemberID_LoadRedeem").css('border-bottom', errorClassBorder);
            $("#txtRedeem_LoadRedeem").css('border-bottom', bottomBorder);
        }
        else if (loadPoint == "" || loadPoint == "0") {
            $("#txtLoad_LoadRedeem").css('border-bottom', errorClassBorder);
            $("#txtRedeem_LoadRedeem").css('border-bottom', bottomBorder);

        }
    }
}

function RedeemReward() {
    //$("#txtMemberID_LoadRedeem").css('border-bottom', bottomBorder);
    $("#txtLoad_LoadRedeem").css('border-bottom', bottomBorder);
    $("#txtRedeem_LoadRedeem").css('border-bottom', bottomBorder);
    var storeId = 0;
    storeId = SetStoreId();
    var memberId = $('#txtMemberID_LoadRedeem').val();
    var phone = $('#txtPhone_LoadRedeem').val();
    if (phone == '') {
        phone = '0';
    }
    var redeemPoint = $('#txtRedeem_LoadRedeem').val();
    redeemPoint = Math.abs(redeemPoint);
    if (redeemPoint == '')
        redeemPoint = '0';
    if (memberId != "" && redeemPoint != "" && redeemPoint != "0") {
        var hdnCurrentStorePoints = $('#hdnCurrentStorePoints').val();
        //alert(hdnCurrentStorePoints);
        //alert(redeemPoint);
        if (parseInt(redeemPoint) <= parseInt(hdnCurrentStorePoints)) {

            $('#btnRedeemReward').text("Redeeming...");
            //$('#btnRedeemReward').css("font-size", "22px");
            try {
                url = global + "/RewardRedeem?storeid=" + storeId + "&rewardMemberId=" + memberId + "&phone=" + phone + "&redeemPoint=" + redeemPoint;
                //alert(url);
                $.getJSON(url, function (data) {
                    $('#btnRedeemReward').text("Redeem");
                    //$('#btnRedeemReward').css("font-size", "24px");
                    //alert(data);
                    if (data.replace(/"/g, "").indexOf("Phone is not valid.") > -1) {
                        $('#dvInner_Reward').hide();
                        if (phone == '' || phone == '0') {
                            $('#dvInner_Reward').hide();
                            //$('#dvOuter').show();
                            //$('#dvOuterText').html("");
                            //$('#dvOuterText').html("Phone Number is required.");
                            $("#txtPhone_LoadRedeem").css('border-bottom', errorClassBorder);

                        }
                        else {
                            $("#txtPhone_LoadRedeem").css('border-bottom', errorClassBorder);
                            $('#dvInner_Reward').hide();
                            $('#dvOuter').hide();
                            //$('#dvOuter').show();
                            //$('#dvOuterText').html("");
                            //$('#dvOuterText').html("Invalid Phone Number.");
                            callSweetAlertWarning("Invalid Phone Number.");
                        }
                    }
                    else if (data.replace(/"/g, "").indexOf("Invalid Member ID.") > -1) {
                        $('#dvInner_Reward').hide();
                        $('#dvOuter').hide();
                        //$('#dvOuter').show();
                        //$('#dvOuterText').html("");
                        //$('#dvOuterText').html("Invalid Member ID.");
                        callSweetAlertWarning("Invalid Member ID.");
                    }
                    else if (data.replace(/"/g, "").indexOf("No record(s) found.") > -1) {
                        $('#dvInner_Reward').hide();
                        $('#dvOuter').show();
                        $('#dvOuterText').html("");
                        $('#dvOuterText').html("No records found.");
                        //WriteLog(SearchGiftCard() + " - " + " No order(s) found.", browser);
                    }
                    else {
                        //$("#txtMemberID_LoadRedeem").css('border-bottom', bottomBorder);
                        $("#txtLoad_LoadRedeem").css('border-bottom', bottomBorder);
                        $("#txtRedeem_LoadRedeem").css('border-bottom', bottomBorder);

                        $('#dvInner_Reward').show();
                        $('#myModal').hide();
                        $('#dvOuter').hide();
                        $('#dvOuterText').html("");
                        $('#txtRedeem_LoadRedeem').val("");
                        SearchReward();


                        callSweetAlertSuccess("Reward Points redeemed successfully.")
                    }
                });
            }
            catch (e) {

            }
        }
        else {
            //alert("Less");
            $("#txtMemberID_LoadRedeem").css('border-bottom', errorClassBorder);
            $("#txtLoad_LoadRedeem").css('border-bottom', errorClassBorder);
            $("#txtRedeem_LoadRedeem").css('border-bottom', errorClassBorder);


            $('#dvInner_Reward').show();
            $('#dvOuter').hide();
            //$('#dvOuter').show();
            //$('#dvOuterText').html("");
            //$('#dvOuterText').html("Your Reward Point balance is " + hdnCurrentStorePoints + " points. <br/> You cannot redeem " + redeemPoint + " points at this time.");
            callSweetAlertWarning("Your Reward Points: <strong>" + hdnCurrentStorePoints + "</strong> <br/> You cannot redeem <strong>" + redeemPoint + "</strong> points at this time.");
        }

    }
    else {
        //$('#dvInner_Reward').hide();
        if (memberId == "") {
            $("#txtMemberID_LoadRedeem").css('border-bottom', errorClassBorder);
            $("#txtLoad_LoadRedeem").css('border-bottom', bottomBorder);
        }
        else if (redeemPoint == "" || redeemPoint == "0") {
            $("#txtRedeem_LoadRedeem").css('border-bottom', errorClassBorder);
            $("#txtLoad_LoadRedeem").css('border-bottom', bottomBorder);
        }
        //$('#dvOuter').show();
        //$('#dvOuterText').html("");
    }
}

function AddNewMemberID() {
    var $$ = Dom7;
    $("#txtPhone").css('border-bottom', bottomBorder);
    $("#txtPoints").css('border-bottom', bottomBorder);

    var email = $("#txtEmail_Reward").val().trim();
    //console.log("Reward Email: " + email)
    var phone = $("input#txtPhone_Reward").val();

    var points = $("#txtPoints_Reward").val().trim();
    var name = $("#txtName_Reward").val().trim();
    var memberId = $("#txtMemberId_Reward").val().trim();

    var storeId = 0;
    storeId = SetStoreId();
    var valid = true;
    if ($("#btnCreate").text() == "Update Member")
    {
        var customerId = Number($("#hdnAddMemberPopupCustomerId").val());
        if (ValidateReward() == true) {
            $("#hdnAddMemberPopupCustomerId").val(0);
            $("#btnCreate").text("Updating Member...");
            if(customerId>0)
            {
                url = global + "/UpdateCustomerInfo?storeid=" + storeId + "&name=" + encodeURIComponent(name)
                    + "&email=" + encodeURIComponent(email) + "&phone=" + phone + "&id=" + customerId;
                $.getJSON(url, function (data1) {
                    //console.log(data1);
                    var obj = JSON.parse(data1);
                    $.each(JSON.parse(data1), function (index, value) {
                        // console.log("1: " + value.EMAIL.toLowerCase().indexOf("bistroux.com"))
                        var popuphtml = "";
                        if (value.REWARDMEMBERID != "")
                            popuphtml = popuphtml + "<p><span style='color:#000;'>Member ID:  </span><span class=\"main-one\">" + value.REWARDMEMBERID + "</span></p>";
                       
                        if (name != "") {
                            if (value.FIRSTNAME != "" && value.FIRSTNAME != "Customer")
                                popuphtml = popuphtml + "<p>" + value.FIRSTNAME;
                            if (value.LASTNAME != "" && value.LASTNAME != "Customer")
                                popuphtml = popuphtml + " " + value.LASTNAME;
                            popuphtml = popuphtml + "</p>";
                        }

                        if (value.PHONE != "") {
                            if (value.PHONE.length == 10)
                                popuphtml = popuphtml + "<p>" + FormatPhoneNumber(value.PHONE) + "</p>";
                            else
                                popuphtml = popuphtml + "<p>" + value.PHONE + "</p>";

                        }

                        if (email!="")
                            popuphtml = popuphtml + "<p>" + value.EMAIL + "</p>";
                            (function () {

                                swal({
                                    title: "Member updated successfully.",
                                    //html: "<p><strong>Member ID:</strong>1082</p><p><strong>Name:</strong>John Smith</p><p><strong>Phone:</strong>(614)805-5665</p><p><strong>Email:</strong>cyberv1@mail.com</p><p><strong>Points:</strong>100</p>",
                                    html: popuphtml,
                                    confirmButtonText: "OK",
                                    type: "success",
                                    confirmButtonClass: 'btn btn-success',
                                    buttonsStyling: false,
                                    customClass: 'swal-wide',
                                });

                                $$('input#txtEmail_Reward').val('');
                                $$('input#txtPhone_Reward').val('');
                                $$('input#txtPoints_Reward').val('');
                                $$('input#txtName_Reward').val('');
                                $$('input#txtMemberId_Reward').val('');
                                $("input#txtPhone_Reward").removeAttr("disabled");
                                $("input#txtMemberId_Reward").removeAttr("disabled");
                                $("input#txtPoints_Reward").removeAttr("disabled");
                                //html: "<p><span style='color:#000;'>Member ID:  </span><span class=\"main-one\">1082</span></p><span style='color:#000;'>Points:  </span><p><span class=\"main-two\" >100</span></p><p>John Smith</p><p>(614) 805-5665</p><p>cyberv1@mail.com</p>",

                            })();
                       
                    });
                    $("#btnCreate").text("Add Member");
                });
            }
        }
    }
    else {

        if (ValidateReward() == true) {
            var customerId = Number($("#hdnAddMemberPopupCustomerId").val());
            $("#hdnAddMemberPopupCustomerId").val(0)
            $("#btnCreate").text("Adding Member...");
            if (memberId != "") {
                var url = global + "/CheckCustomerExistsNew?storeid=" + storeId + "&email=" + encodeURIComponent(email) + "&phone=" + phone + "&memberId=" + memberId;
                $.getJSON(url, function (data) {
                    var dd = JSON.parse(data);
                    console.log(dd);
                    if (dd.Message != undefined && dd.Message != null && dd.Message.indexOf("Restaurant not found") > -1) {
                        callSweetAlertWarning("Restaurant not found. Please login again.");
                    }
                    else {
                        if (dd.CustomerExists.toString().toLowerCase() == "true") {
                            if (Number(dd.Pin) > 0) {
                                if (Number(dd.Points) > 0) {
                                    //swal({
                                    //    title: "Member is already in the system.",
                                    //    type: "warning",
                                    //    confirmButtonClass: "btn btn-danger",
                                    //    buttonsStyling: false,
                                    //    confirmButtonText: "OK",
                                    //    closeOnConfirm: false,
                                    //    customClass: 'swal-wide',
                                    //});
                                    var historyHTML = "";
                                    var count = 0;
                                    historyHTML += "<div class=\"popup-header-row\" ><div class=\"popup-col-1-header\" style=\"width:20%;\">Reward ID</div>" +
                                            "<div class=\"popup-col-2-header\" style=\"width:30%;\">Name</div><div class=\"popup-col-3-header\" style=\"width:50%;\">Email</div></div>";
                                   
                                        var firstName = "";
                                        var lastName = "";
                                        var fullName = "";
                                        if (dd.CustomerName !=undefined && dd.CustomerName != "") {
                                            fullName = dd.CustomerName;
                                        }
                                        if (dd.CustomerEmail != undefined && dd.CustomerEmail != "") {
                                            lastName = value.LASTNAME;
                                        }
                                        email = dd.CustomerEmail;
                                        phone = dd.CustomerPhone;
                                        historyHTML += "<div id=\"memberRow_" + dd.CustomerId + "\" class=\"popup-unlined-row\" style=\"\" onclick=\"SelectCustomer(" + dd.CustomerId + ");\">";
                                        if (dd.MemberId != undefined && dd.MemberId != null)
                                            historyHTML += "<div id=\"memberId_" + dd.CustomerId + "\" class=\"popup-col-1\" style=\"width:20%;font-size:18px;\">" + dd.MemberId + "</div>";
                                        else
                                            historyHTML += "<div id=\"memberId_" + dd.CustomerId + "\" class=\"popup-col-1\" style=\"width:20%;font-size:18px;\"></div>";

                                        historyHTML += "<div id=\"fullName_" + dd.CustomerId + "\" class=\"popup-col-1\" style=\"width:30%;font-size:18px;\">" + fullName.trim() + "</div>";
                                        if (email != null && email.indexOf("@bistroux.com") == -1)
                                            historyHTML += "<div id=\"email_" + dd.CustomerId + "\" class=\"popup-col-2\" style=\"width:50%;font-size:18px;\">" + email + "</div>";
                                        else
                                            historyHTML += "<div id=\"email_" + dd.CustomerId + "\" class=\"popup-col-2\" style=\"width:50%;font-size:18px;\"></div>";
                                    var formattedPhoneNumber = phone;
                                    if (phone.length == 10)
                                        formattedPhoneNumber = formatPhoneNumber(phone);
                                    var html = "<div class=\"popup-content-area\"><h2 class=\"popup-title\"><span style=\"font-size: 18px;\">Phone <span style=\"font-weight:600;font-size: 20px;\">" + formattedPhoneNumber + "</span> matches found:</span></h2>" +
                                              "<div class=\"popup-close-one\" onclick=\"CloseAddRewardMemberPopup();\">X</div>" +
                                                historyHTML +
                                "<div class=\"popup-button-area\"><button style=\"width:85px;\" id=\"btnRewardMemberClose\" onclick=\"NewCloseAndUpdateRewardMembersPopup(" + phone + ");\" type=\"button\" class=\"popup-confirm swal2-styled\" aria-label=\"\" " +
                                "style=\"background-color: rgb(59, 152, 71); border-left-color: rgb(59, 152, 71); border-right-color: rgb(59, 152, 71);\">Select</button>" +
                                "<button style=\"width:85px;background-color: rgb(233, 88, 97); border:1px solid rgb(233, 88, 97);\" id=\"btnMemberPopupCreate\" onclick=\"NewCloseAndCreateRewardMembersPopup(" + phone + ");\" type=\"button\" class=\"popup-confirm swal2-styled\" aria-label=\"\" " +
                                ">Create</button>" + "<button style=\"width:166px;background-color: #4d4d4d; border:1px solid #4d4d4d;\" id=\"btnMemberPopupLoad\" onclick=\"NewGoToLoadRedeemRewardMembersPopup(" + phone + ");\" type=\"button\" class=\"popup-confirm swal2-styled\" aria-label=\"\" " +
                                ">Load/Redeem</button>"
                                    "</div></div>";
                                    //console.log(html)
                                    html += "<input type=\"hidden\" id=\"selectedCustomerId\" value=\"0\" />";
                                    $('#rewardMultipleCustomers').html(html);
                                    $(".popup-overlay").show();
                                    $('#rewardMultipleCustomers').show();
                                    $$('input#txtMemberId_Reward').val('');
                                    $("#btnCreate").text("Add Member");
                                }
                                else {
                                    var id = dd.ID;
                                    url = global + "/UpdateMemberInfo?storeid=" + storeId + "&name=" + encodeURIComponent(name) + "&email=" + encodeURIComponent(email) + "&phone=" + phone + "&points=" + points + "&memberId=" + memberId + "&id=" + id;
                                    $.getJSON(url, function (data1) {
                                        //console.log(data1);
                                        var obj = JSON.parse(data1);
                                        $.each(JSON.parse(data1), function (index, value) {
                                            // console.log("1: " + value.EMAIL.toLowerCase().indexOf("bistroux.com"))
                                            var popuphtml = "";
                                            if (value.REWARDMEMBERID != "")
                                                popuphtml = popuphtml + "<p><span style='color:#000;'>Member ID:  </span><span class=\"main-one\">" + value.REWARDMEMBERID + "</span></p>";
                                            if (value.POINTS != "")
                                                popuphtml = popuphtml + "<p><span style='color:#000;'>Points:  </span><span class=\"main-two\">" + value.POINTS + "</span></p>";
                                            if (value.FIRSTNAME != "" || value.LASTNAME != "") {
                                                if (value.FIRSTNAME != "" && value.FIRSTNAME != "Customer")
                                                    popuphtml = popuphtml + "<p>" + value.FIRSTNAME;
                                                if (value.LASTNAME != "" && value.LASTNAME != "Customer")
                                                    popuphtml = popuphtml + " " + value.LASTNAME;
                                                popuphtml = popuphtml + "</p>";
                                            }

                                            if (value.PHONE != "") {
                                                if (value.PHONE.length == 10)
                                                    popuphtml = popuphtml + "<p>" + FormatPhoneNumber(value.PHONE) + "</p>";
                                                else
                                                    popuphtml = popuphtml + "<p>" + value.PHONE + "</p>";

                                            }

                                            if (value.EMAIL != "" && value.EMAIL.toLowerCase().indexOf("bistroux.com") == -1)
                                                popuphtml = popuphtml + "<p>" + value.EMAIL + "</p>";


                                            if (value.ACTIONTYPE = "ADD") {
                                                (function () {

                                                    swal({
                                                        title: "New Member created successfully.",
                                                        //html: "<p><strong>Member ID:</strong>1082</p><p><strong>Name:</strong>John Smith</p><p><strong>Phone:</strong>(614)805-5665</p><p><strong>Email:</strong>cyberv1@mail.com</p><p><strong>Points:</strong>100</p>",
                                                        html: popuphtml,
                                                        confirmButtonText: "OK",
                                                        type: "success",
                                                        confirmButtonClass: 'btn btn-success',
                                                        buttonsStyling: false,
                                                        customClass: 'swal-wide',
                                                    });

                                                    $$('input#txtEmail_Reward').val('');
                                                    $$('input#txtPhone_Reward').val('');
                                                    $$('input#txtPoints_Reward').val('');
                                                    $$('input#txtName_Reward').val('');
                                                    $$('input#txtMemberId_Reward').val('');
                                                    //html: "<p><span style='color:#000;'>Member ID:  </span><span class=\"main-one\">1082</span></p><span style='color:#000;'>Points:  </span><p><span class=\"main-two\" >100</span></p><p>John Smith</p><p>(614) 805-5665</p><p>cyberv1@mail.com</p>",

                                                })();
                                            }
                                        });
                                        $("#btnCreate").text("Add Member");
                                    });
                                }
                            }
                            else {
                                //swal({
                                //    title: "Member is already in the system.",
                                //    type: "warning",
                                //    confirmButtonClass: "btn btn-danger",
                                //    buttonsStyling: false,
                                //    confirmButtonText: "OK",
                                //    closeOnConfirm: false,
                                //    customClass: 'swal-wide',
                                //});
                                var historyHTML = "";
                                var count = 0;
                                historyHTML += "<div class=\"popup-header-row\" ><div class=\"popup-col-1-header\" style=\"width:20%;\">Reward ID</div>" +
                                        "<div class=\"popup-col-2-header\" style=\"width:30%;\">Name</div><div class=\"popup-col-3-header\" style=\"width:50%;\">Email</div></div>";

                                var firstName = "";
                                var lastName = "";
                                var fullName = "";
                                if (dd.CustomerName != undefined && dd.CustomerName != "") {
                                    fullName = dd.CustomerName;
                                }
                                if (dd.CustomerEmail != undefined && dd.CustomerEmail != "") {
                                    email = dd.CustomerEmail;
                                }
                                phone = dd.CustomerPhone;
                                historyHTML += "<div id=\"memberRow_" + dd.CustomerId + "\" class=\"popup-unlined-row\" style=\"\" onclick=\"SelectCustomer(" + dd.CustomerId + ");\">";
                                if (dd.MemberId != undefined && dd.MemberId != null)
                                    historyHTML += "<div id=\"memberId_" + dd.CustomerId + "\" class=\"popup-col-1\" style=\"width:20%;font-size:18px;\">" + dd.MemberId + "</div>";
                                else
                                    historyHTML += "<div id=\"memberId_" + dd.CustomerId + "\" class=\"popup-col-1\" style=\"width:20%;font-size:18px;\"></div>";

                                historyHTML += "<div id=\"fullName_" + dd.CustomerId + "\" class=\"popup-col-1\" style=\"width:30%;font-size:18px;\">" + fullName.trim() + "</div>";
                                if (email != null && email.indexOf("@bistroux.com")==-1)
                                    historyHTML += "<div id=\"email_" + dd.CustomerId + "\" class=\"popup-col-2\" style=\"width:50%;font-size:18px;\">" + email + "</div>";
                                else
                                    historyHTML += "<div id=\"email_" + dd.CustomerId + "\" class=\"popup-col-2\" style=\"width:50%;font-size:18px;\"></div>";

                                historyHTML += "</div>";
                                var formattedPhoneNumber = phone;
                                if (phone.length == 10)
                                    formattedPhoneNumber = formatPhoneNumber(phone);
                                var html = "<div class=\"popup-content-area\"><h2 class=\"popup-title\"><span style=\"font-size: 18px;\">Phone <span style=\"font-weight:600;font-size: 20px;\">" + formattedPhoneNumber + "</span> matches found:</span></h2>" +
                                    "<div class=\"popup-close-one\" onclick=\"CloseAddRewardMemberPopup();\">X</div>" +
                                    historyHTML +
                            "<div class=\"popup-button-area\"><button style=\"width:85px;\" id=\"btnRewardMemberClose\" onclick=\"NewCloseAndUpdateRewardMembersPopup(" + phone + ");\" type=\"button\" class=\"popup-confirm swal2-styled\" aria-label=\"\" " +
                            "style=\"background-color: rgb(59, 152, 71); border-left-color: rgb(59, 152, 71); border-right-color: rgb(59, 152, 71);\">Select</button>" +
                            "<button style=\"width:85px;background-color: rgb(233, 88, 97); border:1px solid rgb(233, 88, 97);\" id=\"btnMemberPopupCreate\" onclick=\"NewCloseAndCreateRewardMembersPopup(" + phone + ");\" type=\"button\" class=\"popup-confirm swal2-styled\" aria-label=\"\" " +
                            ">Create</button>" + "<button style=\"width:166px;background-color: #4d4d4d; border:1px solid #4d4d4d;\" id=\"btnMemberPopupLoad\" onclick=\"NewGoToLoadRedeemRewardMembersPopup(" + phone + ");\" type=\"button\" class=\"popup-confirm swal2-styled\" aria-label=\"\" " +
                            ">Load/Redeem</button>"
                                "</div></div>";
                                //console.log(html)
                                html += "<input type=\"hidden\" id=\"selectedCustomerId\" value=\"0\" />";
                                $('#rewardMultipleCustomers').html(html);
                                $(".popup-overlay").show();
                                $('#rewardMultipleCustomers').show();
                                $("#btnCreate").text("Add Member");
                            }
                        }
                        else {
                            var customerId = dd.CustomerId;
                            url = global + "/CreateNewMemberID?storeid=" + storeId + "&name=" + encodeURIComponent(name) + "&email=" + encodeURIComponent(email) + "&phone=" + phone + "&points=" + points + "&memberId=" + memberId + "&customerId=" + customerId;
                            $.getJSON(url, function (data1) {
                                //console.log(data1);
                                var obj = JSON.parse(data1);
                                $.each(JSON.parse(data1), function (index, value) {
                                    // console.log("1: " + value.EMAIL.toLowerCase().indexOf("bistroux.com"))
                                    var popuphtml = "";
                                    if (value.REWARDMEMBERID != "")
                                        popuphtml = popuphtml + "<p><span style='color:#000;'>Member ID:  </span><span class=\"main-one\">" + value.REWARDMEMBERID + "</span></p>";
                                    if (points != "")
                                        popuphtml = popuphtml + "<p><span style='color:#000;'>Points:  </span><span class=\"main-two\">" + points + "</span></p>";
                                    if (name != "") {
                                        popuphtml = popuphtml + "<p>" + value.FIRSTNAME + " " + value.LASTNAME + "</p>";
                                    }

                                    if (phone != "") {
                                        if (value.PHONE.length == 10)
                                            popuphtml = popuphtml + "<p>" + FormatPhoneNumber(value.PHONE) + "</p>";
                                        else
                                            popuphtml = popuphtml + "<p>" + value.PHONE + "</p>";

                                    }
                                    if (email != "")
                                        popuphtml = popuphtml + "<p>" + value.EMAIL + "</p>";


                                    if (value.ACTIONTYPE = "ADD") {
                                        (function () {

                                            swal({
                                                title: "New Member created successfully.",
                                                //html: "<p><strong>Member ID:</strong>1082</p><p><strong>Name:</strong>John Smith</p><p><strong>Phone:</strong>(614)805-5665</p><p><strong>Email:</strong>cyberv1@mail.com</p><p><strong>Points:</strong>100</p>",
                                                html: popuphtml,
                                                confirmButtonText: "OK",
                                                type: "success",
                                                confirmButtonClass: 'btn btn-success',
                                                buttonsStyling: false,
                                                customClass: 'swal-wide',
                                            });

                                            $$('input#txtEmail_Reward').val('');
                                            $$('input#txtPhone_Reward').val('');
                                            $$('input#txtPoints_Reward').val('');
                                            $$('input#txtName_Reward').val('');
                                            $$('input#txtMemberId_Reward').val('');

                                            $$(".input-clear-button").click();
                                            $$("input#txtMemberId_Reward").focus();
                                            $$("input#txtMemberId_Reward").addClass("input-focused");
                                            //html: "<p><span style='color:#000;'>Member ID:  </span><span class=\"main-one\">1082</span></p><span style='color:#000;'>Points:  </span><p><span class=\"main-two\" >100</span></p><p>John Smith</p><p>(614) 805-5665</p><p>cyberv1@mail.com</p>",

                                        })();
                                    }
                                });
                                $("#btnCreate").text("Add Member");
                            });
                        }
                    }


                });
            }
            else {
                console.log('hdnAlredyMemberChecked: ' + $("#hdnAlredyMemberChecked").val())
                if ($("#hdnAlredyMemberChecked").val() == "false") {
                    var url = global + "/CheckCustomerExistsDB?storeid=" + storeId + "&email=" + encodeURIComponent(email)
                     + "&phone=" + phone
                    + "&name=" + encodeURIComponent(name) + "&points=" + points + "&customerId=" + customerId;

                    $.getJSON(url, function (data1) {
                        var obj1 = JSON.parse(data1);
                        console.log('obj1: ' + obj1)
                        if (obj1.CustomerExistsInSameStore != undefined && obj1.CustomerExistsInSameStore != null &&
                            obj1.CustomerExistsInSameStore == true) {
                            swal({
                                title: "Member is already in the system.",
                                type: "warning",
                                confirmButtonClass: "btn btn-danger",
                                buttonsStyling: false,
                                confirmButtonText: "OK",
                                closeOnConfirm: false,
                                customClass: 'swal-wide',
                            });
                            $$('input#txtEmail_Reward').val('');
                            $$('input#txtPhone_Reward').val('');
                            $$('input#txtPoints_Reward').val('');
                            $$('input#txtName_Reward').val('');
                            $$('input#txtMemberId_Reward').val('');
                            $("input#txtEmail_Reward").css('border-bottom', bottomBorder);
                            $("input#txtPhone_Reward").css('border-bottom', bottomBorder);
                            $("input#txtPoints_Reward").css('border-bottom', bottomBorder);
                        }
                        else {
                            if (obj1.NewMemberId != "") {
                                var popuphtml = "";
                                if (obj1.NewMemberId != "")
                                    popuphtml = popuphtml + "<p><span style='color:#000;'>Member ID:  </span><span class=\"main-one\">" + obj1.NewMemberId + "</span></p>";
                                if (points != "")
                                    popuphtml = popuphtml + "<p><span style='color:#000;'>Points:  </span><span class=\"main-two\">" + points + "</span></p>";
                                if (name != "") {
                                    popuphtml = popuphtml + "<p>" + name + "</p>";
                                }
                                if (phone != "") {
                                    if (phone.length == 10)
                                        popuphtml = popuphtml + "<p>" + FormatPhoneNumber(phone) + "</p>";
                                    else
                                        popuphtml = popuphtml + "<p>" + phone + "</p>";

                                }
                                if (email != "")
                                    popuphtml = popuphtml + "<p>" + email + "</p>";
                                swal({
                                    title: "New Member created successfully.",
                                    html: popuphtml,
                                    confirmButtonText: "OK",
                                    type: "success",
                                    confirmButtonClass: 'btn btn-success',
                                    buttonsStyling: false,
                                    customClass: 'swal-wide',
                                });
                                $$('input#txtEmail_Reward').val('');
                                $$('input#txtPhone_Reward').val('');
                                $$('input#txtPoints_Reward').val('');
                                $$('input#txtName_Reward').val('');
                                $$('input#txtMemberId_Reward').val('');
                                $("input#txtEmail_Reward").css('border-bottom', bottomBorder);
                                $("input#txtPhone_Reward").css('border-bottom', bottomBorder);
                                $("input#txtPoints_Reward").css('border-bottom', bottomBorder);
                            }
                            else {

                                var historyHTML = "";
                                var count = 0;
                                var totalRecord = 0;
                                historyHTML += "<div class=\"popup-header-row\" ><div class=\"popup-col-1-header\" style=\"width:20%;\">Reward ID</div>" +
                                        "<div class=\"popup-col-2-header\" style=\"width:30%;\">Name</div><div class=\"popup-col-3-header\" style=\"width:50%;\">Email</div></div>";
                                //console.log('obj1.CustomerList: ' + obj1.CustomerList.length)

                                if (obj1.CustomerList.length > 0) {
                                    totalRecord = obj1.CustomerList.length;
                                    $.each(obj1.CustomerList, function (index, value) {
                                        var firstName = "";
                                        var lastName = "";
                                        var fullName = "";
                                        if (value.FIRSTNAME != "") {
                                            firstName = value.FIRSTNAME;
                                        }
                                        if (value.LASTNAME != "") {
                                            lastName = value.LASTNAME;
                                        }
                                        fullName = firstName + " " + lastName;
                                        historyHTML += "<div id=\"memberRow_" + value.ID + "\" class=\"popup-unlined-row\" style=\"\" onclick=\"SelectCustomer(" + value.ID + ");\">";
                                        if (value.REWARDMEMBERID != null)
                                            historyHTML += "<div id=\"memberId_" + value.ID + "\" class=\"popup-col-1\" style=\"width:20%;font-size:18px;\">" + value.REWARDMEMBERID + "</div>";
                                        else
                                            historyHTML += "<div id=\"memberId_" + value.ID + "\" class=\"popup-col-1\" style=\"width:20%;font-size:18px;\"></div>";

                                        historyHTML += "<div id=\"fullName_" + value.ID + "\" class=\"popup-col-1\" style=\"width:30%;font-size:18px;\">" + fullName.trim() + "</div>";
                                        if (value.EMAIL != null)
                                            historyHTML += "<div id=\"email_" + value.ID + "\" class=\"popup-col-2\" style=\"width:50%;font-size:18px;\">" + value.EMAIL + "</div>";
                                        else
                                            historyHTML += "<div id=\"email_" + value.ID + "\" class=\"popup-col-2\" style=\"width:50%;font-size:18px;\"></div>";

                                        historyHTML += "</div>";
                                    });
                                }
                                else {
                                    historyHTML += "<div  class=\"popup-col-2\" style=\"width:100%;font-size:18px;text-align:center;\">No record found.</div>";
                                }
                                var formattedPhoneNumber = phone;
                                if (phone.length == 10)
                                    formattedPhoneNumber = formatPhoneNumber(phone);
                                var html = "<div class=\"popup-content-area\"><h2 class=\"popup-title\"><span style=\"font-size: 18px;\">Phone <span style=\"font-weight:600;font-size: 20px;\">" + formattedPhoneNumber + "</span> matches found:</span></h2>" +
                                    "<div class=\"popup-close-one\" onclick=\"CloseAddRewardMemberPopup();\">X</div>" + historyHTML;
                                if (totalRecord > 0) {
                                    html += "<div class=\"popup-button-area\"><button style=\"width:85px;\" id=\"btnRewardMemberClose\" onclick=\"NewCloseAndUpdateRewardMembersPopup(" + phone + ");\" type=\"button\" class=\"popup-confirm swal2-styled\" aria-label=\"\" " +
                          "style=\"background-color: rgb(59, 152, 71); border-left-color: rgb(59, 152, 71); border-right-color: rgb(59, 152, 71);\">Select</button>";
                                }
                                else {
                                    html += "<div class=\"popup-button-area\"><button disabled style=\"width:85px;\" id=\"btnRewardMemberClose\"  type=\"button\" class=\"popup-confirm swal2-styled disabled\" aria-label=\"\" " +
                          "style=\"background-color: rgb(59, 152, 71); border-left-color: rgb(59, 152, 71); border-right-color: rgb(59, 152, 71);\">Select</button>";
                                }

                                html += "<button style=\"width:85px;background-color: rgb(233, 88, 97); border:1px solid rgb(233, 88, 97);\" id=\"btnMemberPopupCreate\" onclick=\"NewCloseAndCreateRewardMembersPopup(" + phone + ");\" type=\"button\" class=\"popup-confirm swal2-styled\" aria-label=\"\" " +
                            ">Create</button>";
                                html += "<button style=\"width:166px;background-color: #4d4d4d; border:1px solid #4d4d4d;\" id=\"btnMemberPopupLoad\" onclick=\"NewGoToLoadRedeemRewardMembersPopup(" + phone + ");\" type=\"button\" class=\"popup-confirm swal2-styled\" aria-label=\"\" " +
                            ">Load/Redeem</button></div></div>";

                                //console.log(html)
                                html += "<input type=\"hidden\" id=\"selectedCustomerId\" value=\"0\" />";
                                $('#rewardMultipleCustomers').html(html);
                                $(".popup-overlay").show();
                                $('#rewardMultipleCustomers').show();

                                $("#hdnAlredyMemberChecked").val("true");

                            }
                        }


                    });
                }
                else {
                    url = global + "/CreateNewMemberID?storeid=" + storeId + "&name=" + encodeURIComponent(name) + "&email=" + encodeURIComponent(email) + "&phone=" + phone + "&points=" + points + "&memberId=" + memberId + "&customerId=" + customerId;
                    $.getJSON(url, function (data1) {
                        //console.log(data1);
                        var obj = JSON.parse(data1);
                        $.each(JSON.parse(data1), function (index, value) {
                            // console.log("1: " + value.EMAIL.toLowerCase().indexOf("bistroux.com"))
                            var popuphtml = "";
                            if (value.REWARDMEMBERID != "")
                                popuphtml = popuphtml + "<p><span style='color:#000;'>Member ID:  </span><span class=\"main-one\">" + value.REWARDME
