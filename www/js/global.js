var global = "http://www.appnotification.bistroux.com/Api/App/";
//var global = "http://appnotification.bistroux.test-my-project.com/Api/App/";
//var global = "http://www.consumerapp.bistroux.com/Api/App/";
//var global = "http://192.168.0.104/Api/App/";
var mediaURL = "http://appnotification.bistroux.com/Media/";

var browser = true;
var logenabled = false;
var errorClassBorder = '2px solid #ff4848';
var bottomBorder = '1px solid #ddd';
var noErrorClassBorder = 'none';
var src = mediaURL + "notification.mp3";
var myMedia = null;
var appVersion = 4;

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
        url: global + 'StoreDeviceRegistrationTokenUpdate?storeid=' + storeId + '&registrationToken=' + token + "&deviceUUID=" + uuid + "&version=" + version + "&name=" + name + "&appVersion=" + appVersion,
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
                    var printerName = data.split("#")[11].replace("\"", "");
                    var hidePriceInPrint = data.split("#")[12].replace("\"", "");
                    var isAdminUser = data.split("#")[13].replace("\"", "");
                    var employeePIN = data.split("#")[14].replace("\"", "");
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
                    localStorage.setItem("PrinterName", printerName);
                    localStorage.setItem("HidePriceInPrint", hidePriceInPrint);
                    localStorage.setItem("IsAdminUser", isAdminUser);
                    localStorage.setItem("EmployeePIN", employeePIN);

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
                            //giftCardsEnabled != "True" && 
                            if (giftCardProgramEnabled != "True" && rewardEnabled != "True") {
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
                            //(giftCardsEnabled == "True" && giftCardProgramEnabled == "True")
                            else if (giftCardProgramEnabled == "True" || rewardEnabled == "True") {
                                //giftCardsEnabled == "True" && 
                                if (giftCardProgramEnabled == "True") {
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
        //giftCardsEnabled != "True" && 
    else if (giftCardProgramEnabled != "True") {
        //$("#manageservice .menuGiftCard").addClass("disabled");
        $("#manageservice .menuGiftCard").hide();
    }
}
//Validate Login
function ValidateLogIn() {
    //console.log("ValidateLogIn");
    var email = $("#email").val().trim();
    var password = $("#password").val().trim();

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
    status = $('#carryout #hdnCurrentState').val();
    if (status == "New") {
        divId = 'dvNewList';
    }
    else if (status == "Processing") {
        divId = 'dvNewList';
    }
    else {
        divId = 'dvAllList';
        sortValue = $("input[name='radioCarryoutSort']:checked").val();
        sortByValue = $("input[name='radioCarryoutSortBy']:checked").val();

        //#carryout 
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
    $("#carryout #" + divId).html("");
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
                console.log(JSON.parse(data));
                if (JSON.parse(data).indexOf("No order(s) found") < 0) {
                    localStorage.setItem("OrderAvailable", "1");
                    var count = 0;
                    $.each(JSON.parse(data), function (index, value) {
                        if (index == 0) {
                            firstOrderId = value.ID;
                            OpenCarryoutDetails(firstOrderId);
                            $('.order-container').removeClass("selected-order-background");
                            $('#li_' + firstOrderId).addClass("selected-order-background");
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
                        html += "<div class=\"order-number-carryout\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\" style=\"white-space: wrap;\">" + firstName + " " + lastName + "</div>";

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
                        $("#carryout #" + divId).append(html);
                        ////alert(divId);//////////
                        ////alert($("#carryout #" + divId).html());
                        
                        if (value.ORDERSTATUSID.toLowerCase() == "new") {
                            //$("#li_" + value.ID).css("background-color", "#ffecf2");
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "processing") {
                            if (status == "New" || status == "Processing") {
                                $("#dvNewList #li_" + value.ID).css("border-left", "#2cbcf2 10px solid");
                            }
                            else {
                                $("#dvAllList #li_" + value.ID).css("border-left", "#2cbcf2 10px solid");
                            }
                            
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "complete") {
                            if (status == "New" || status == "Processing") {
                                $("#dvNewList #li_" + value.ID).css("border-left", "#5cb95a 10px solid");
                            }
                            else {
                                $("#dvAllList #li_" + value.ID).css("border-left", "#5cb95a 10px solid");
                            }
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "pickedup") {
                            if (status == "New" || status == "Processing") {
                                $("#dvNewList #li_" + value.ID).css("border-left", "#f7952c 10px solid");
                            }
                            else {
                                $("#dvAllList #li_" + value.ID).css("border-left", "#f7952c 10px solid");
                            }
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "cancelled") {
                            if (status == "New" || status == "Processing") {
                                $("#dvNewList #li_" + value.ID).css("border-left", "#e95861 10px solid");
                            }
                            else {
                                $("#dvAllList #li_" + value.ID).css("border-left", "#e95861 10px solid");
                            }
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "refunded") {
                            if (status == "New" || status == "Processing") {
                                $("#dvNewList #li_" + value.ID).css("border-left", "#9C1B8C 10px solid");
                            }
                            else {
                                $("#dvAllList #li_" + value.ID).css("border-left", "#9C1B8C 10px solid");
                            }
                        }

                    });
                    //if (index == 0) {
                    //    firstOrderId = value.ID;
                    //    OpenCarryoutDetails(firstOrderId);
                    $('.order-container').removeClass("selected-order-background");
                    if (status == "New" || status == "Processing") {
                        $("#dvNewList #li_" + firstOrderId).addClass("selected-order-background");
                    }
                    else {
                        $("#dvAllList #li_" + firstOrderId).addClass("selected-order-background");
                    }
                        //$('#li_' + firstOrderId).addClass("selected-order-background");
                    //}
                }
                else {
                    localStorage.setItem("OrderAvailable", "0");
                    var html = "<div class=\"order-list list-empty-label-text\" style=\"font-size: 30px; z-index: 999999; left: 38%; position: fixed;\">No Orders</div>";

                    $("#carryout #" + divId).html(html);

                    if (divId == "dvNewList") {
                        var divDetails = $('#carryout #dvCarryOutDetailsInner').detach();
                        divDetails.appendTo('#carryout #divTabAllDetails');
                    }
                    else {
                        var divDetails = $('#carryout #dvCarryOutDetailsInner').detach();
                        divDetails.appendTo('#carryout #divTabCurrentDetails');
                    }

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
//Carryout Orders End

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
        divId = 'dvNewList';
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

            $("#carryout #dvNewList").attr("class", "active");
            //$("#dvPending").removeAttr("class");
            $("#carryout #dvAllList").removeAttr("class");


        }
        else if (status.toLowerCase().trim() == "processing") {

            //$("#dvPending").attr("class", "active");
            $("#carryout #dvNewList").attr("class", "active");
            $("#carryout #dvAllList").removeAttr("class");
        }
        else {

            $("#carryout #dvAllList").attr("class", "active");
            //$("#dvPending").removeAttr("class");
            $("#carryout #dvNewList").removeAttr("class");

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
                        html += "<div class=\"order-number-carryout\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\" style=\"white-space: wrap;\">" + firstName + " " + lastName + "</div>";

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

                        $("#carryout #" + divId).append(html);
                        
                        if (value.ORDERSTATUSID.toLowerCase() == "new") {
                            //$("#li_" + value.ID).css("background-color", "#ffecf2");
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "processing") {
                            if (status == "New" || status == "Processing") {
                                $("#dvNewList #li_" + value.ID).css("border-left", "#2cbcf2 10px solid");
                            }
                            else {
                                $("#dvAllList #li_" + value.ID).css("border-left", "#2cbcf2 10px solid");
                            }

                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "complete") {
                            if (status == "New" || status == "Processing") {
                                $("#dvNewList #li_" + value.ID).css("border-left", "#5cb95a 10px solid");
                            }
                            else {
                                $("#dvAllList #li_" + value.ID).css("border-left", "#5cb95a 10px solid");
                            }
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "pickedup") {
                            if (status == "New" || status == "Processing") {
                                $("#dvNewList #li_" + value.ID).css("border-left", "#f7952c 10px solid");
                            }
                            else {
                                $("#dvAllList #li_" + value.ID).css("border-left", "#f7952c 10px solid");
                            }
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "cancelled") {
                            if (status == "New" || status == "Processing") {
                                $("#dvNewList #li_" + value.ID).css("border-left", "#e95861 10px solid");
                            }
                            else {
                                $("#dvAllList #li_" + value.ID).css("border-left", "#e95861 10px solid");
                            }
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "refunded") {
                            if (status == "New" || status == "Processing") {
                                $("#dvNewList #li_" + value.ID).css("border-left", "#9C1B8C 10px solid");
                            }
                            else {
                                $("#dvAllList #li_" + value.ID).css("border-left", "#9C1B8C 10px solid");
                            }
                        }

                    });


                }
                else {
                    localStorage.setItem("OrderAvailable", "0");
                    //var html = "<div class=\"order-list list-empty-label-text\" style=\"font-size: 30px; z-index: 999999; left: 38%; position: fixed;\">No Orders</div>";

                    //$("#" + divId).html(html);
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
//Carryout Orders End

//Carryout Details
function OpenCarryoutDetails(id) {
    $('.order-container').removeClass("selected-order-background");
    $('#1 #li_' + id).addClass("selected-order-background");
    $('#3 #li_' + id).addClass("selected-order-background");
    var currentTabId = $(".tab-active").attr('id');
    $("#carryout #dvCarryOutDetailsInner #hdnSelectedOrderId").val(id);
    var storeId = SetStoreId();
    if (id > 0) {
        url = global + "/GetCarryOutOrderDetailsWithAllInfo?orderid=" + id;
        $.getJSON(url, function (data) {
            ////$('#dvDetailsPanel').html("");
            $("#carryout #dvOrderInfo").html("");
            $("#carryout #dvItem").html("");
            $("#carryout #divUpperButtonArea").html("");
            $("#carryout #divOrderDetailsPickupTime").html("");
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

            var taxValue = "0.00";
            var shippingValue = "0.00";
            var subTotalWithoutTax = "0.00";
            var curbsidePickup = false;
            var curbsidePickupMessage = "";
            var curbsidePickupDate = "";
            var curbsidePickupTime = "";
            var refundValue = "0.00";

            var tipValue = "0.00";
            var finalOrderTotal = "0.00";
            var serviceFeeValue = "0.00";

            //console.log(data);
            $.each(JSON.parse(data), function (index, value) {
                //console.log(value);

                //CurbsidePickup Seciton
                if (value.CurbsidePickup) {
                    curbsidePickup = true;
                    if (value.CurbsidePickupMessage != null && value.CurbsidePickupMessage != "") {
                        curbsidePickupMessage = value.CurbsidePickupMessage;
                    }
                    if (value.CurbsidePickupTime != null && value.CurbsidePickupTime != undefined) {
                        var arrCurbsidePickupDateTime = value.CurbsidePickupTime.split('~');
                        curbsidePickupDate = arrCurbsidePickupDateTime[0];
                        curbsidePickupTime = arrCurbsidePickupDateTime[1];
                    }
                }
                else {
                    curbsidePickup = false;
                    curbsidePickupMessage = "";
                }

                if (value.Type == "OrderInfo") {
                    if (value.ORDERTYPE != "") {
                        ordertype = value.ORDERTYPE;
                    }
                    if (ordertype != "" && ordertype == "Delivery") {
                        $('#carryout #spanOrderDetailsOrderType').html("");
                        $('#carryout #spanOrderDetailsOrderType').html(ordertype);
                        $('#carryout #spanOrderDetailsOrderType').css('color', '#e95861');
                    }
                    else if (curbsidePickup) {
                        $('#carryout #spanOrderDetailsOrderType').html("");
                        $('#carryout #spanOrderDetailsOrderType').html("Curbside");
                        $('#carryout #spanOrderDetailsOrderType').css('color', '#3b9847');
                    }
                    else {
                        $('#carryout #spanOrderDetailsOrderType').html("");
                        $('#carryout #spanOrderDetailsOrderType').html("Carry Out");
                        $('#carryout #spanOrderDetailsOrderType').css('color', '#08b3c7');
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
                    $("#carryout #dvCarryOutDetailsInner #hdnSelectedOrderId").val(orderId);
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

                    //Tax Section
                    if (value.SUBTOTALWITHOUTTAX != undefined && Number(value.SUBTOTALWITHOUTTAX) > 0) {
                        subTotalWithoutTax = FormatDecimal(value.SUBTOTALWITHOUTTAX);
                    }
                    if (value.TAX != undefined && Number(value.TAX) > 0)
                    {
                        taxValue = FormatDecimal(value.TAX);
                    }
                    if (value.SHIPPING != undefined && Number(value.SHIPPING) > 0) {
                        shippingValue = FormatDecimal(value.SHIPPING);
                    }
                    if (value.REFUNDEDAMOUNT != undefined && Number(value.REFUNDEDAMOUNT)) {
                        refundValue = FormatDecimal(value.REFUNDEDAMOUNT);
                    }

                    if (value.Tip != undefined && Number(value.Tip) > 0) {
                        tipValue = FormatDecimal(value.Tip);
                    }

                    if (value.FINALORDERTOTAL != undefined && Number(value.FINALORDERTOTAL)) {
                        finalOrderTotal = FormatDecimal(value.FINALORDERTOTAL);
                    }

                    if (value.ServiceFee != undefined && Number(value.ServiceFee)) {
                        serviceFeeValue = FormatDecimal(value.ServiceFee);
                    }


                    $("#carryout #hdnSelectedOrderOrderPrice").val(ordertotalvalue);
                    if (value.CREATEDONUTC != null && value.CREATEDONUTC != undefined) {
                        var arrDateTime = value.CREATEDONUTC.split('~');
                        orderDate = arrDateTime[0];
                        orderTime = arrDateTime[1];
                        $("#carryout #hdnSelectedOrderDateTime").val(orderDate + "#" + orderTime);
                    }
                    //console.log(value.PICKUPTIME)
                    if (value.PICKUPTIME != undefined) {
                        $("#carryout #hdnSelectedOrderPickUpTime").val(value.PICKUPTIME);
                        pickupTime = value.PICKUPTIME;
                        if (pickupTime.charAt(0) === '0')
                        {
                            pickupTime = pickupTime.substr(1);
                        }
                    }
                    //console.log("1:"+pickupTime)
                    //console.log('value.ORDERPICKUPSMSSENTON: ' + value.ORDERPICKUPSMSSENTON)
                    if (value.ORDERPICKUPSMSSENTON != undefined && value.ORDERPICKUPSMSSENTON != null && value.ORDERPICKUPSMSSENTON != "") {

                        if (value.ORDERPICKUPSMSSENTON.indexOf("~") > -1) {
                            var arrPickUpSMSSentDateTime = value.ORDERPICKUPSMSSENTON.split('~');
                            var smsSentDate = arrPickUpSMSSentDateTime[0];
                            var smsSentTime = arrPickUpSMSSentDateTime[1];
                            $("#carryout #hdnSelectedOrderPickUpSMSSentTime").val(smsSentDate + "#" + smsSentTime);
                            $("#carryout #dvPickUpSMSSentTime").show();
                            $("#carryout #dvPickUpSMSSentTime").html("Pickup SMS sent<br/>" + smsSentDate + " @ " + smsSentTime);
                            $("#carryout #btnPickupSMS").hide();
                        }
                        else {
                            $("#carryout #dvPickUpSMSSentTime").hide();
                            $("#carryout #dvPickUpSMSSentTime").html("");
                            $("#carryout #hdnSelectedOrderPickUpSMSSentTime").val("");
                        }

                    }
                    else {
                        $("#carryout #dvPickUpSMSSentTime").hide();
                        $("#carryout #dvPickUpSMSSentTime").html("");
                        $("#carryout #btnPickupSMS").show();
                        $("#carryout #hdnSelectedOrderPickUpSMSSentTime").val("");
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
                    $("#carryout #divLowerCancelButtonArea").show();
                    $("#carryout #divLowerPrintButtonArea").hide();
                    if (orderStatus.toLowerCase() == "pickedup") {
                        $("#btnChangePickupTime").prop("onclick", null).off("click");
                        $("#btnChangePickupTime").css('opacity', '0.5');
                    }
                    else {
                        $("#btnChangePickupTime").click(function () {
                            OpenPickupTimePopup();
                        });
                        $("#btnChangePickupTime").css('opacity', '1');
                    }
                }
                else
                {
                    $("#carryout #divLowerCancelButtonArea").hide();
                    $("#carryout #divLowerPrintButtonArea").show();
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
                        orderhtml += "<a onclick=\"ChangePopupOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\">Pick Up</span></a>";
                        orderhtml += "</div>";
                        orderhtml += "</div>";

                        upperButtonHtml = "<div class=\"flex\">";
                        upperButtonHtml += "<div style=\"width:48%;\">";
                        //Set Details Upper Button
                        upperButtonHtml += "<a class=\"custom-btn-two custom-bg custom-link item-media-section-two\" style=\"background:#5cb95a !important;\" onclick=\"ChangePopupOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\">Accept</a>";                        
                        upperButtonHtml += "</div>";
                        upperButtonHtml += "<div style=\"width:4%;\">";

                        upperButtonHtml += "</div>";
                        upperButtonHtml += "<div style=\"width:48%;\">";
                        //Send SMS Button
                        upperButtonHtml += "<a id=\"aPopupSMS_" + orderId + "\" class=\"custom-btn-two custom-bg custom-link item-media-section-two\" style=\"background:#303030 !important;\" onclick=\"ConfirmationPickUpSMSSend(" + orderId + ",'" + phone + "','Popup','$0.00')\">Send SMS</a>";
                        upperButtonHtml += "</div>";

                        upperButtonHtml += "</div>"
                        $("#carryout #divUpperButtonArea").html(upperButtonHtml);
                                                                        
                    }
                    else if (orderStatus.toLowerCase() == "processing") {
                        orderhtml += "<div class=\"dropdown\" id=\"carryoutpopstatus_" + orderId + "\">";
                        orderhtml += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></button>";
                        orderhtml += "<a class=\"popup-link\" onclick=\"OpenOrderHistoryPopup(" + orderId + ")\">History</a>";
                        orderhtml += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        orderhtml += "<a  class=\"status-disabled\" onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        orderhtml += "<a onclick=\"ChangePopupOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        orderhtml += "<a  onclick=\"ChangePopupOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\">Pick Up</span></a>";
                        orderhtml += "</div>";
                        orderhtml += "</div>";

                        upperButtonHtml = "<div class=\"flex\">";
                        upperButtonHtml += "<div style=\"width:48%;\">";
                        //Set Details Upper Button
                        upperButtonHtml += "<a class=\"custom-btn-two custom-bg custom-link item-media-section-two\" style=\"background:#3b9847 !important;\" onclick=\"ChangePopupOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\">Complete</a>";
                        upperButtonHtml += "</div>";
                        upperButtonHtml += "<div style=\"width:4%;\">";

                        upperButtonHtml += "</div>";
                        upperButtonHtml += "<div style=\"width:48%;\">";
                        //Send SMS Button
                        upperButtonHtml += "<a id=\"aPopupSMS_" + orderId + "\" class=\"custom-btn-two custom-bg custom-link item-media-section-two\" style=\"background:#303030 !important;\" onclick=\"ConfirmationPickUpSMSSend(" + orderId + ",'" + phone + "','Popup','$0.00')\">Send SMS</a>";
                        upperButtonHtml += "</div>";

                        upperButtonHtml += "</div>"



                        if (value.ORDERPICKUPSMSSENTON != undefined && value.ORDERPICKUPSMSSENTON != null && value.ORDERPICKUPSMSSENTON != "") {

                            if (value.ORDERPICKUPSMSSENTON.indexOf("~") > -1) {
                                var arrPickUpSMSSentDateTime = value.ORDERPICKUPSMSSENTON.split('~');
                                var smsSentDate = arrPickUpSMSSentDateTime[0];
                                var smsSentTime = arrPickUpSMSSentDateTime[1];
                                upperButtonHtml += "<div class=\"popup-label-left-new\"  id=\"dvPickUpSMSSentTime\"><div>Pickup SMS sent " + smsSentDate + " @ " + smsSentTime + "</div></div>";
                            }
                        }

                        $("#carryout #divUpperButtonArea").html(upperButtonHtml);
                    }
                    else if (orderStatus.toLowerCase() == "complete") {
                        orderhtml += "<div class=\"dropdown\" id=\"carryoutpopstatus_" + orderId + "\">";
                        orderhtml += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                        orderhtml += "<a class=\"popup-link\" onclick=\"OpenOrderHistoryPopup(" + orderId + ")\">History</a>";
                        orderhtml += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        orderhtml += "<a onclick=\"ChangePopupOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        orderhtml += "<a class=\"status-disabled\" onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        orderhtml += "<a  onclick=\"ChangePopupOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\">Pick Up</span></a>";
                        orderhtml += "</div>";
                        orderhtml += "</div>";

                        upperButtonHtml = "<div class=\"flex\">";
                        upperButtonHtml += "<div style=\"width:48%;\">";
                        //Set Details Upper Button
                        upperButtonHtml += "<a class=\"custom-btn-two custom-bg custom-link item-media-section-two\" style=\"background:#f7952c !important;\" onclick=\"ChangePopupOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\">Pick Up</a>";
                        upperButtonHtml += "</div>";
                        upperButtonHtml += "<div style=\"width:4%;\">";

                        upperButtonHtml += "</div>";
                        upperButtonHtml += "<div style=\"width:48%;\">";
                        //Send SMS Button
                        upperButtonHtml += "<a id=\"aPopupSMS_" + orderId + "\" class=\"custom-btn-two custom-bg custom-link item-media-section-two\" style=\"background:#303030 !important;\" onclick=\"ConfirmationPickUpSMSSend(" + orderId + ",'" + phone + "','Popup','$0.00')\">Send SMS</a>";
                        upperButtonHtml += "</div>";

                        upperButtonHtml += "</div>"
                        

                        if (value.ORDERPICKUPSMSSENTON != undefined && value.ORDERPICKUPSMSSENTON != null && value.ORDERPICKUPSMSSENTON != "") {

                            if (value.ORDERPICKUPSMSSENTON.indexOf("~") > -1) {
                                var arrPickUpSMSSentDateTime = value.ORDERPICKUPSMSSENTON.split('~');
                                var smsSentDate = arrPickUpSMSSentDateTime[0];
                                var smsSentTime = arrPickUpSMSSentDateTime[1];
                                upperButtonHtml += "<div class=\"popup-label-left-new\"  id=\"dvPickUpSMSSentTime\"><div>Pickup SMS sent " + smsSentDate + " @ " + smsSentTime + "</div></div>";
                            }
                        }

                        $("#carryout #divUpperButtonArea").html(upperButtonHtml);
                    }
                    else if (orderStatus.toLowerCase() == "pickedup") {
                        orderhtml += "<div class=\"dropdown\" id=\"carryoutpopstatus_" + orderId + "\">";
                        orderhtml += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                        orderhtml += "<a class=\"popup-link\" onclick=\"OpenOrderHistoryPopup(" + orderId + ")\">History</a>";
                        orderhtml += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        orderhtml += "<a onclick=\"ChangePopupOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        orderhtml += "<a onclick=\"ChangePopupOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        orderhtml += "<a class=\"status-disabled\"  onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\">Pick Up</span></a>";
                        orderhtml += "</div>";
                        orderhtml += "</div>";

                        $("#carryout #divUpperButtonArea").html("");
                    }
                    else if (orderStatus.toLowerCase() == "cancelled") {
                        //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                        orderhtml += "<div class=\"dropdown\" id=\"carryoutstatus_" + orderId + "\">";
                        orderhtml += "<button id=\"btnStatusChange\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/cancel.png\" alt=\"\"/></button>";
                        orderhtml += "<a class=\"popup-link\" onclick=\"OpenOrderHistoryPopup(" + orderId + ")\">History</a>";

                        orderhtml += "</div>";

                        $("#carryout #divUpperButtonArea").html("");
                    }
                    else if (orderStatus.toLowerCase() == "refunded") {
                        //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                        orderhtml += "<div class=\"dropdown\" id=\"carryoutstatus_" + orderId + "\">";
                        orderhtml += "<button id=\"btnStatusChange\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/refund.png\" alt=\"\"/></button>";
                        orderhtml += "<a class=\"popup-link\" onclick=\"OpenOrderHistoryPopup(" + orderId + ")\">History</a>";
                        orderhtml += "</div>";

                        $("#carryout #divUpperButtonArea").html("");
                    }
                }

                //Bind Phone for use next time complete order send sms to customer functionality
                orderhtml += "<input type=\"hidden\" id=\"hdnSelectedOrderPhone_"+orderId+"\" value=\""+phone+"\" />";

                orderhtml += "</div>";
                /*------------------Status Icon Area End-----------------------*/
                /*------------------Button Row Start-----------------------*/
                
                orderhtml += "<div class=\"order-buttons\" id=\"popupCarryOutDetails_" + orderId + "\" style=\"width:60%;\">";
                ////orderhtml += buttonHTML;
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
                $("#carryout #divOrderDetailsPickupTime").html("");
                $("#carryout #divOrderDetailsPickupTime").html(orderPickupTimeHtml);

                orderhtml += "<div class=\"carryout-order-number\"><span class=\"order-number\"> #" + orderId + "</span><br/> " + orderDate + " @ " + orderTime + "</div>";
                orderhtml += "</div>";
                /*------------------Column 2 New End-----------------------*/


                /*------------------2nd Row-----------------------*/
                orderhtml += "<div class=\"order-row-container\" style=\"padding-bottom: 2px;\">";

                /*------------------Customer Info-----------------------*/
                orderhtml += "<div class=\"giftcard-customer-new\">";
                orderhtml += "<div class=\"giftcard-customer-detail-container\">";
                orderhtml += "<div id=\"popupCustomerName_" + orderId + "\">" + firstName + " " + lastName + "</div>";
                orderhtml += "<div>" + phone + "</div>";
                //orderhtml += "<div id=\"popupCustomerEmail_" + orderId + "\" class=\"display-label-wrap\">" + email + "</div>";
                
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
                //orderhtml += "<div><div class=\"giftcard-price popup-carryout-details-long\" id=\"popupOrderPrice_" + orderId + "\">" + ordertotalvalue + "</div>";
                orderhtml += "<div><div class=\"giftcard-price popup-carryout-details-long\" id=\"popupOrderPrice_" + orderId + "\">" + finalOrderTotal + "</div>";

                if (numberOfItems == 1)
                    orderhtml += "<div>1 item ";
                else
                    orderhtml += "<div>" + numberOfItems + " items ";
                if (paymentMethod == "Cash On Delivery") {
                    orderhtml += "<span class=\"cc-number\">Due on Pickup</span>";
                }
                else {
                    if (cardNumber != "") {
                        $("#carryout #lblPaymentValue").html("PAID, CC ending in " + cardNumber);
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
                orderhtml += "<div id=\"popupCustomerEmail_" + orderId + "\" class=\"display-label-wrap\">" + email + "</div>";
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
                    if (customerFinalAddress != "" && customerFinalAddress != "undefined") {
                        orderhtml += "<div class=\"display-label-wrap\">" + customerFinalAddress + "</div>";
                    }
                    else {
                        orderhtml += "<div class=\"display-label-wrap\"></div>";
                    }
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

                $("#carryout #dvOrderInfo").html(orderhtml);
                //console.log(orderhtml);

            });

            url = global + "/GetCarryOutOrderItemDetails?orderid=" + id;
            $.getJSON(url, function (data) {
                //console.log("Histor: " + data);
                if (data.indexOf("No record(s) found.") > -1) {
                    $("#carryout #dvItem").html("No record(s) found.");

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
                                        notesValue = notesValue.replace(/<i>[\s\S]*?<\/i>/, ' ');
                                        notesValue = notesValue.replace("</strong>:", "- ");
                                        html += "<tr><td colspan='4' style='padding:0 0 0 5px'>" + notesValue.replace("</strong>", "") + "  </td></tr>";
                                    }
                                    else {
                                        notesValue = notesValue.replace(/<i>[\s\S]*?<\/i>/, ' ');
                                        notesValue = notesValue.replace("</strong>:", "- ");
                                        html += "<tr><td colspan='4' style='padding:0 0 0 5px'>" + notesValue.replace("</strong>", "") + " </td></tr>";
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
                //alert(taxValue);
                if (htmlDiscount != "" || htmlRewards != "" || htmlGiftCard != "") {
                    //alert("Html");
                    htmlSubTotal = " <tr>";
                    htmlSubTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Subtotal:</td>";
                    if (taxValue != "" && taxValue != "0.00") {
                        htmlSubTotal += "<td style=\"text-align:right;\">" + subTotalWithoutTax + "</td>";
                    }
                    else {
                        htmlSubTotal += "<td style=\"text-align:right;\">" + FormatDecimal(subtotalvalue) + "</td>";
                    }
                    htmlSubTotal += "</tr>";


                    if (shippingValue != "" && shippingValue != "0.00") {
                        htmlOrderTotal += " <tr>";
                        htmlOrderTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Delivery:</td>";
                        htmlOrderTotal += "<td style=\"text-align:right;\">" + shippingValue + "</td>";
                        htmlOrderTotal += "</tr>";
                    }

                    if (tipValue != "" && tipValue != "0.00") {
                        htmlOrderTotal += " <tr>";
                        htmlOrderTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Tip:</td>";
                        htmlOrderTotal += "<td style=\"text-align:right;\">" + tipValue + "</td>";
                        htmlOrderTotal += "</tr>";
                    }

                    if (taxValue != "" && taxValue != "0.00") {
                        htmlOrderTotal += " <tr>";
                        htmlOrderTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Tax:</td>";
                        htmlOrderTotal += "<td style=\"text-align:right;\">" + taxValue + "</td>";
                        htmlOrderTotal += "</tr>";
                    }  

                    if (serviceFeeValue != "" && serviceFeeValue != "0.00") {
                        htmlOrderTotal += " <tr>";
                        htmlOrderTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Convenience Fee:</td>";
                        htmlOrderTotal += "<td style=\"text-align:right;\">" + serviceFeeValue + "</td>";
                        htmlOrderTotal += "</tr>";
                    } 


                    htmlOrderTotal += " <tr>";
                    htmlOrderTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Order Total:</td>";
                    htmlOrderTotal += "<td style=\"text-align:right;\">" + grandTotalvalue + "</td>";
                    htmlOrderTotal += "</tr>";

                    //if (refundValue != "" && refundValue != "0.00") {
                    //    htmlOrderTotal += " <tr>";
                    //    htmlOrderTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Refund:</td>";
                    //    htmlOrderTotal += "<td style=\"text-align:right;\">" + refundValue + "</td>";
                    //    htmlOrderTotal += "</tr>";
                    //}
                    
                }
                else {
                    //alert("Else");
                    htmlSubTotal = " <tr>";
                    htmlSubTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Subtotal:</td>";
                    if (taxValue != "" && taxValue != "0.00")
                    {
                        htmlSubTotal += "<td style=\"text-align:right;\">" + subTotalWithoutTax + "</td>";
                    }
                    else {
                        htmlSubTotal += "<td style=\"text-align:right;\">" + FormatDecimal(subtotalvalue) + "</td>";
                    }
                    htmlSubTotal += "</tr>";

                    if (shippingValue != "" && shippingValue != "0.00") {
                        htmlOrderTotal += " <tr>";
                        htmlOrderTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Delivery:</td>";
                        htmlOrderTotal += "<td style=\"text-align:right;\">" + shippingValue + "</td>";
                        htmlOrderTotal += "</tr>";
                    }

                    if (tipValue != "" && tipValue != "0.00") {
                        htmlOrderTotal += " <tr>";
                        htmlOrderTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Tip:</td>";
                        htmlOrderTotal += "<td style=\"text-align:right;\">" + tipValue + "</td>";
                        htmlOrderTotal += "</tr>";
                    }

                    if (taxValue != "" && taxValue != "0.00") {
                        //alert("Tax");
                        htmlOrderTotal += " <tr>";
                        htmlOrderTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Tax:</td>";
                        htmlOrderTotal += "<td style=\"text-align:right;\">" + taxValue + "</td>";
                        htmlOrderTotal += "</tr>";
                    }

                    if (serviceFeeValue != "" && serviceFeeValue != "0.00") {
                        htmlOrderTotal += " <tr>";
                        htmlOrderTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Convenience Fee:</td>";
                        htmlOrderTotal += "<td style=\"text-align:right;\">" + serviceFeeValue + "</td>";
                        htmlOrderTotal += "</tr>";
                    }

                    
                    htmlOrderTotal += " <tr>";
                    htmlOrderTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Order Total:</td>";
                    htmlOrderTotal += "<td style=\"text-align:right;\">" + grandTotalvalue + "</td>";
                    htmlOrderTotal += "</tr>";

                    //if (refundValue != "" && refundValue != "0.00") {
                    //    htmlOrderTotal += " <tr>";
                    //    htmlOrderTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Refund:</td>";
                    //    htmlOrderTotal += "<td style=\"text-align:right;\">" + refundValue + "</td>";
                    //    htmlOrderTotal += "</tr>";
                    //}                    
                }

                
                //Order Refund and Add Charged Section Start
                url = global + "/GetCarryoutOrderAdjustments?orderid=" + id;
                $.getJSON(url, function (data) {
                    if (data.indexOf("No record(s) found.") > -1) {
                        if (curbsidePickup) {
                            if (curbsidePickupMessage != "" && curbsidePickupMessage != undefined) {
                                htmlOrderTotal += "<table class=\"table table-striped\" cellspacing=\"0\" cellpadding=\"0\"><thead>"
                                htmlOrderTotal += "<tr>";
                                htmlOrderTotal += "<td valign=\"top\" style=\"text-align:left; font-weight: bold;\">Curbside:</td>&nbsp;&nbsp;";
                                htmlOrderTotal += "<td style=\"text-align:left;\">" + curbsidePickupMessage + " (" + curbsidePickupTime + ")" + "</td>";
                                htmlOrderTotal += "</tr>";
                                htmlOrderTotal += "</thead></table>";
                            }
                        }
                        if (dueAmount > 0) {
                            $("#carryout #dvItem").html(html + htmlSubTotal + htmlDiscount + htmlRewards + htmlGiftCard + htmlOrderTotal + htmlDueAmount + "</tbody>");
                        }
                        else {
                            $("#carryout #dvItem").html(html + htmlSubTotal + htmlDiscount + htmlRewards + htmlGiftCard + htmlOrderTotal + "</tbody>");
                        }
                    }
                    else {
                        $.each(JSON.parse(data), function (index, value) {
                            var adjustmentType = "";
                            var adjustmentNotes = "";
                            var adjustmentAmont = "";
                            if(value.Type != "")
                            {
                                adjustmentType = value.Type;
                                
                                if (adjustmentType != "Charge")
                                    adjustmentType = "Refund";
                            }
                            if (value.Notes != "") {
                                adjustmentNotes = value.Notes;
                            }
                            if (value.Amount != "") {
                                adjustmentAmont = FormatDecimal(value.Amount);
                            }

                            htmlOrderTotal += "<tr>";
                            htmlOrderTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">" + adjustmentType + ":<br/><span style=\"text-align:right; font-weight: normal;\">(" + adjustmentNotes + ")</span></td>";
                            htmlOrderTotal += "<td style=\"text-align:right;vertical-align: top;\">" + adjustmentAmont + "</td>";
                            htmlOrderTotal += "</tr>";
                        });


                        htmlOrderTotal += "<tr>";
                        htmlOrderTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Final Amount:</td>";
                        htmlOrderTotal += "<td style=\"text-align:right;\" id=\"popupOrderFinalAmount_" + orderId + "\">" + finalOrderTotal + "</td>";
                        htmlOrderTotal += "</tr>";

                        if (curbsidePickup) {
                            if (curbsidePickupMessage != "" && curbsidePickupMessage != undefined) {
                                htmlOrderTotal += "<table class=\"table table-striped\" cellspacing=\"0\" cellpadding=\"0\"><thead>"
                                htmlOrderTotal += "<tr>";
                                htmlOrderTotal += "<td valign=\"top\" style=\"text-align:left; font-weight: bold;\">Curbside:</td>&nbsp;&nbsp;";
                                htmlOrderTotal += "<td style=\"text-align:left;\">" + curbsidePickupMessage + " (" + curbsidePickupTime + ")" + "</td>";
                                htmlOrderTotal += "</tr>";
                                htmlOrderTotal += "</thead></table>";
                            }
                        }

                        if (dueAmount > 0) {
                            $("#carryout #dvItem").html(html + htmlSubTotal + htmlDiscount + htmlRewards + htmlGiftCard + htmlOrderTotal + htmlDueAmount + "</tbody>");
                        }
                        else {
                            $("#carryout #dvItem").html(html + htmlSubTotal + htmlDiscount + htmlRewards + htmlGiftCard + htmlOrderTotal + "</tbody>");
                        }
                    }
                });

                //Order Refund and Add Charged Section End


                
                //console.log($("#dvItem").html());
                //alert($("#dvCarryOutDetailsInner").html());
                //alert($("#dvItem").html());
                ////$('#dvDetailsPanel').html($('#carryout #dvCarryOutDetailsInner').html());

            });
            var currentOpenTabId = $("#carryout .tab-active").attr('id');
            if (currentOpenTabId == 1) {
                var divDetails = $('#carryout #dvCarryOutDetailsInner').detach();
                divDetails.appendTo('#carryout #divTabCurrentDetails');

            } else if (currentOpenTabId == 3) {
                //$("#divTabAllDetails").html($("#dvCarryOutDetailsInner").html());
                var divDetails = $('#carryout #dvCarryOutDetailsInner').detach();
                divDetails.appendTo('#carryout #divTabAllDetails');
            }
            //$("#divLowerCancelButtonArea").show();

        });
    }
}
//Carryout Details End

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
    $('#carryout #hdnCurrentState').val(status);
    if (status == "New") {
        //$('#divTabCurrentDetails').html("");
        CarryoutOrdersList(status, 10, 0, '');
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
        divId = 'dvNewList';
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
                        html += "<div class=\"order-number-carryout\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\" style=\"white-space: nowrap;\">" + firstName + " " + lastName + "</div>";

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
                        $("#carryout #" + divId).append(html);


                    });
                }
                else {
                    localStorage.setItem("OrderAvailable", "0");
                    var html = "<div class=\"order-list list-empty-label-text\" style=\"font-size: 30px; z-index: 999999; left: 38%; position: fixed;\">No Orders</div>";

                    $("#" + divId).html(html);

                    if (divId == "dvNewList") {
                        var divDetails = $('#dvCarryOutDetailsInner').detach();
                        divDetails.appendTo('#divTabAllDetails');
                    }
                    else {
                        var divDetails = $('#dvCarryOutDetailsInner').detach();
                        divDetails.appendTo('#divTabCurrentDetails');
                    }
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
        divId = 'dvNewList';
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

            $("#dvNewList").attr("class", "active");
            //$("#dvPending").removeAttr("class");
            $("#dvAllList").removeAttr("class");


        }
        else if (status.toLowerCase().trim() == "processing") {

            //$("#dvPending").attr("class", "active");
            $("#dvNewList").attr("class", "active");
            $("#dvAllList").removeAttr("class");
        }
        else {

            $("#dvAllList").attr("class", "active");
            //$("#dvPending").removeAttr("class");
            $("#dvNewList").removeAttr("class");

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
                        html += "<div class=\"order-number-carryout\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\" style=\"white-space: nowrap;\">" + firstName + " " + lastName + "</div>";

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

                        $("#carryout #" + divId).append(html);


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
    if (storeId > 0 && orderId > 0) {

        var html = "<div class=\"popup-content-area\"><h2 class=\"popup-title\"><span style=\"font-size:18px;\">SMS to Customer - <span style=\"font-weight:600;font-size: 20px;\">#" + orderId + "</span></span></h2>";
        
        html += "<div class=\"popup-button-area\">";
        html += "<button type=\"button\" onclick=\"ShowPickupMessage(" + orderId + ");\" class=\"swal2-styled popup-no\" style=\"display: inline-block; background-color: #3b9847;border: none;margin: 5px 40px 30px 0px;padding: 10px 5px;width: 160px;\">Pickup SMS</button>";
        html += "<button type=\"button\" onclick=\"ClearField(" + orderId + ");\" class=\"swal2-styled popup-no\" style=\"display: inline-block; background-color: #08b3c7;border: none;margin: 5px 10px 30px 20px;padding: 10px 5px;width: 160px;width: 160px;\">Clear</button>";
        html += "</div>";
        
        html += "<textarea id=\"txtSMSMessage_" + orderId + "\" class=\"swal2-textarea\" style=\"border:1px solid #ddd;height:160px;padding: 5px 5px;\" maxlength=\"200\" placeholder=\"Message\">";
        html += "</textarea><div class=\"popup-button-area\"><button id=\"btnSMSSendSubmit\" onclick=\"SendPickUpSMSToCustomer("+orderId+");\" type=\"button\" class=\"popup-confirm swal2-styled\" aria-label=\"\" ";
        html += "style=\"background-color: rgb(59, 152, 71); border-left-color: rgb(59, 152, 71); border-right-color: rgb(59, 152, 71);\">Submit</button>";
        html += "<button type=\"button\" onclick=\"CloseSMSToCustomerPopup();\" class=\"swal2-styled popup-no\" aria-label=\"\" style=\"display: inline-block; background-color: rgb(233, 88, 97);\">Close</button></div></div>";

        html += "<input id=\"hdnSmsSendOrderId\" type=\"hidden\" value=\"" + orderId + "\"/>";
        html += "<input id=\"hdnSmsCustomerPhone_"+orderId+"\" type=\"hidden\" value=\"" + customerphone + "\"/>";
        html += "<input id=\"hdnSmsSource\" type=\"hidden\" value=\"" + source + "\"/>";
        html += "<input id=\"hdnSmsOrderTotal\" type=\"hidden\" value=\"" + orderTotal + "\"/>";

        $('#sendSmsPopup').html(html);
        $(".popup-overlay").show();
        $('#sendSmsPopup').show();


        //swal({
        //    title: 'Would you like to send a Pickup SMS to the Customer?',
        //    //text: "You will not be able to recover this imaginary file!",
        //    type: "warning",
        //    showCancelButton: true,
        //    confirmButtonColor: '#3b9847',
        //    cancelButtonColor: '#e95861',
        //    confirmButtonText: 'Yes',
        //    cancelButtonText: "No",
        //    closeOnConfirm: false,
        //    closeOnCancel: true
        //}).then(result => {
        //    if (result.value) {
        //        // handle Confirm button click
        //        SendPickUpSMSToCustomer(orderId, customerphone, source, orderTotal)

        //        // result.value will contain `true` or the input value
        //    } else {
        //        // handle dismissals
        //        // result.dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
        //    }
        //});


    }
    else if (storeId == 0) {
        self.app.router.navigate('/login_new/', { reloadCurrent: false });
    }
}

function ClearField(orderId) {
    $('#txtSMSMessage_' + orderId).val("");
}
function ShowPickupMessage(orderId) {
    var restaurantDisplayName = "";
    var smsText = "";
    if (window.localStorage.getItem("RestaurantName") != null)
        restaurantDisplayName = window.localStorage.getItem("RestaurantName").trim();
    if (orderId > 0) {
        smsText = "Your "+restaurantDisplayName+" Order "+orderId+" is ready.";
    }
    else {
        smsText = "Your " + restaurantDisplayName + " Order is ready.";;
    }
    $('#txtSMSMessage_' + orderId).val(smsText);
}

function SendPickUpSMSToCustomer(orderId) {

    var storeId = 0;
    var restaurantDisplayName = "";
    var customerphone = $('#hdnSmsCustomerPhone_' + orderId).val();
    var smsText = $('#txtSMSMessage_' + orderId).val();
    if (smsText != "")
        smsText = smsText.replace("&", " and ");
    //alert(smsText);
    storeId = SetStoreId();
    if (storeId > 0 && orderId > 0) {
        $("#btnPickupSMS_" + orderId).attr("disabled", "disabled");
        if (window.localStorage.getItem("RestaurantName") != null)
            restaurantDisplayName = window.localStorage.getItem("RestaurantName").trim();
        if (customerphone != undefined && customerphone != null && customerphone != "") {
            customerphone = customerphone.trim().replace("(", "").replace(")", "").replace("-", "").replace(".", "").replace(" ", "");
        }
        $.ajax({
            url: global + 'SendSMSToCustomerNew?storeid=' + storeId + '&orderId=' + orderId + "&restaurantDisplayName=" + restaurantDisplayName + "&customerphone=" + customerphone + "&smsText=" + smsText,
            type: 'GET',
            datatype: 'jsonp',
            contenttype: "application/json",
            crossDomain: true,
            async: false,
            success: function (response) {               
                CloseSMSToCustomerPopup();
                var data = JSON.parse(response);
                if (data.Message.indexOf("successfully") > -1) {
                    callSweetAlertSuccess(data.Message);
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

function CloseSMSToCustomerPopup() {
    $('#sendSmsPopup').html("");
    $(".popup-overlay").hide();
    $('#sendSmsPopup').hide();
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
                        app.tab.show('#1');
                        BindcarryoutTab('New');
                        //CarryoutOrdersList('Processing', 10, 0, 'dvProcessingList');
                    }
                    else {
                        CarryoutOrdersList('New', 10, 0, 'dvNewList');
                    }
                   
                }
                else if ($('#hdnCurrentState').val() == "Processing") {

                    localStorage.setItem("CurrentPage", 0);
                    CarryoutOrdersList('New', 10, 0, 'dvNewList');
                }
                else {

                    //localStorage.setItem("CurrentPage", 0);
                    //CarryoutOrdersList('All', 10, 0, 'dvAllList');
                    var buttonHTML = "";
                    var iconHTML = "";
                    if (status == "New") {
                        iconHTML += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></button>";
                        //
                        iconHTML += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        iconHTML += "</div>";
                    }
                    else if (status == "Processing") {
                        iconHTML += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></button>";
                        //
                        iconHTML += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
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

                        iconHTML += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                        //
                        iconHTML += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        iconHTML += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        iconHTML += "<a  onclick=\"ChangeOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        iconHTML += "</div>";
                    }
                    else if (status == "PickedUp") {
                        iconHTML += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                        //
                        iconHTML += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        iconHTML += "<a  class=\"status-disabled\"  onclick=\"HideStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        iconHTML += "</div>";
                    }

                    $("#carryout #carryoutstatus_" + orderId).html(iconHTML);
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
                    CarryoutOrdersList('New', 10, 0, 'dvNewList');
                }
                else {

                    //localStorage.setItem("CurrentPage", 0);
                    //CarryoutOrdersList('All', 10, 0, 'dvAllList');
                    var buttonHTML = "";
                    var iconHTML = "";
                    if (status == "New") {
                        iconHTML += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></button>";
                        //
                        iconHTML += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        iconHTML += "</div>";
                    }
                    else if (status == "Processing") {
                        iconHTML += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></button>";
                        //
                        iconHTML += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        iconHTML += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        iconHTML += "<a  onclick=\"ChangeOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        iconHTML += "</div>";
                    }
                    else if (status == "Complete") {

                        iconHTML += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                        //
                        iconHTML += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                        iconHTML += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                        iconHTML += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                        iconHTML += "<a  onclick=\"ChangeOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                        iconHTML += "</div>";
                    }
                    else if (status == "PickedUp") {
                        iconHTML += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                        //
                        iconHTML += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
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
                    CarryoutOrdersList('New', 10, 0, 'dvNewList');
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
                    iconHTML += "<a onclick=\"ChangePopupOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Pick Up</span></a>";
                    iconHTML += "</div>";

                    iconHTML1 += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></button>";
                    //
                    iconHTML1 += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    iconHTML1 += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                    iconHTML1 += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    iconHTML1 += "<a onclick=\"ChangeOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Pick Up</span></a>";
                    iconHTML1 += "</div>";

                    upperButtonHtml = "<div class=\"flex\">";
                    upperButtonHtml += "<div style=\"width:48%;\">";
                    ///Set Details Upper Button
                    upperButtonHtml += "<a class=\"custom-btn-two custom-bg custom-link item-media-section-two\" style=\"background:#5cb95a !important;\" onclick=\"ChangePopupOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\">Processing</a>";
                    upperButtonHtml += "</div>";
                    upperButtonHtml += "<div style=\"width:4%;\">";

                    upperButtonHtml += "</div>";
                    upperButtonHtml += "<div style=\"width:48%;\">";
                    //Send SMS Button
                    upperButtonHtml += "<a id=\"aPopupSMS_" + orderId + "\" class=\"custom-btn-two custom-bg custom-link item-media-section-two\" style=\"background:#303030 !important;\" onclick=\"ConfirmationPickUpSMSSend(" + orderId + ",'" + orderPhone + "','Popup','$0.00')\">Send SMS</a>";
                    upperButtonHtml += "</div>";

                    upperButtonHtml += "</div>"
                                        
                    $("#divUpperButtonArea").html(upperButtonHtml);
                    //$("#li_" + orderId).css("border-left", "#2cbcf2 10px solid");
                }
                else if (status == "Processing") {
                    iconHTML += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></button>";
                    iconHTML += "<a class=\"popup-link\" onclick=\"OpenOrderHistoryPopup(" + orderId + ")\">History</a>";

                    iconHTML += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    iconHTML += "<a class=\"status-disabled\" onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                    iconHTML += "<a onclick=\"ChangePopupOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    iconHTML += "<a  onclick=\"ChangePopupOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Pick Up</span></a>";
                    iconHTML += "</div>";

                    iconHTML1 += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></button>";
                    //
                    iconHTML1 += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    iconHTML1 += "<a class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                    iconHTML1 += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    iconHTML1 += "<a  onclick=\"ChangeOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Pick Up</span></a>";
                    iconHTML1 += "</div>";

                    upperButtonHtml = "<div class=\"flex\">";
                    upperButtonHtml += "<div style=\"width:48%;\">";
                    //Set Details Upper Button
                    upperButtonHtml += "<a class=\"custom-btn-two custom-bg custom-link item-media-section-two\" style=\"background:#3b9847 !important;\" onclick=\"ChangePopupOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\">Complete</a>";
                    upperButtonHtml += "</div>";
                    upperButtonHtml += "<div style=\"width:4%;\">";

                    upperButtonHtml += "</div>";
                    upperButtonHtml += "<div style=\"width:48%;\">";
                    //Send SMS Button
                    upperButtonHtml += "<a id=\"aPopupSMS_" + orderId + "\" class=\"custom-btn-two custom-bg custom-link item-media-section-two\" style=\"background:#303030 !important;\" onclick=\"ConfirmationPickUpSMSSend(" + orderId + ",'" + orderPhone + "','Popup','$0.00')\">Send SMS</a>";
                    upperButtonHtml += "</div>";

                    upperButtonHtml += "</div>"
                                        
                    $("#divUpperButtonArea").html(upperButtonHtml);
                    $("#li_" + orderId).css("border-left", "#2cbcf2 10px solid");
                }
                else if (status == "Complete") {

                    iconHTML += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                    iconHTML += "<a class=\"popup-link\" onclick=\"OpenOrderHistoryPopup(" + orderId + ")\">History</a>";

                    iconHTML += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    iconHTML += "<a onclick=\"ChangePopupOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                    iconHTML += "<a class=\"status-disabled\" onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    iconHTML += "<a  onclick=\"ChangePopupOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Pick Up</span></a>";
                    iconHTML += "</div>";


                    iconHTML1 += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                    //
                    iconHTML1 += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    iconHTML1 += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                    iconHTML1 += "<a class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    iconHTML1 += "<a  onclick=\"ChangeOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Pick Up</span></a>";
                    iconHTML1 += "</div>";

                    upperButtonHtml = "<div class=\"flex\">";
                    upperButtonHtml += "<div style=\"width:48%;\">";
                    //Set Details Upper Button
                    upperButtonHtml += "<a class=\"custom-btn-two custom-bg custom-link item-media-section-two\" style=\"background:#f7952c !important;\" onclick=\"ChangePopupOrderStatusDropdown('PickedUp'," + orderId + "," + storeId + ")\">Pick Up</a>";
                    upperButtonHtml += "</div>";
                    upperButtonHtml += "<div style=\"width:4%;\">";

                    upperButtonHtml += "</div>";
                    upperButtonHtml += "<div style=\"width:48%;\">";
                    //Send SMS Button
                    upperButtonHtml += "<a id=\"aPopupSMS_" + orderId + "\" class=\"custom-btn-two custom-bg custom-link item-media-section-two\" style=\"background:#303030 !important;\" onclick=\"ConfirmationPickUpSMSSend(" + orderId + ",'" + orderPhone + "','Popup','$0.00')\">Send SMS</a>";
                    upperButtonHtml += "</div>";

                    upperButtonHtml += "</div>"

                    $("#divUpperButtonArea").html(upperButtonHtml);
                    $("#li_" + orderId).css("border-left", "#5cb95a 10px solid");

                }
                else if (status == "PickedUp") {
                    iconHTML += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                    iconHTML += "<a class=\"popup-link\" onclick=\"OpenOrderHistoryPopup(" + orderId + ")\">History</a>";

                    iconHTML += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    iconHTML += "<a onclick=\"ChangePopupOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                    iconHTML += "<a onclick=\"ChangePopupOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    iconHTML += "<a class=\"status-disabled\"  onclick=\"HidePopupStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Pick Up</span></a>";
                    iconHTML += "</div>";


                    iconHTML1 += "<button id=\"btnStatusChange\" onclick=\"myPopupFunction(" + orderId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                    //
                    iconHTML1 += "<div id=\"myPopupDropdown_" + orderId + "\" class=\"dropdown-content\"><div onclick=\"HideStatusChangeDropdown(" + orderId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    iconHTML1 += "<a onclick=\"ChangeOrderStatusDropdown('Processing'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Processing</span></a>";
                    iconHTML1 += "<a onclick=\"ChangeOrderStatusDropdown('Complete'," + orderId + "," + storeId + ")\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    iconHTML1 += "<a class=\"status-disabled\"  onclick=\"HideStatusChangeDropdown(" + orderId + ");\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Pick Up</span></a>";
                    iconHTML1 += "</div>";

                    $("#divUpperButtonArea").html("");
                    $("#li_" + orderId).css("border-left", "#f7952c 10px solid");
                }

                $("#carryout #carryoutpopstatus_" + orderId).html(iconHTML);
                $("#carryout #carryoutstatus_" + orderId).html(iconHTML1);
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
    $("#carryout #myPopupDropdown_" + id).addClass("show");
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
                var deliveryEnabled = value.DELIVERYENABLED;
                var deliveryCurrentStatus = value.DELIVERYSTATUS;

                if (deliveryEnabled) {
                    $('#divDeliverySection').show();
                    $('#dvManageServiceParent').css("margin-top", "45px");
                }
                else {
                    $('#divDeliverySection').hide();
                    $('#dvManageServiceParent').css("margin-top", "120px");
                }

                //if (carryoutEnabled==true)
                $("#dvCarryoutStatus").html("CARRYOUT " + carryoutcurrentstatus);
                if (carryoutcurrentstatus.toLowerCase().trim() == "running") {
                    $("#dvCarryOutStatusChange").html("<a  class=\"start-btn-one\" onclick=\"ChangeCarryoutStatus(" + storeId + ",'STOPPED')\"><img src=\"./img/Stop.png\" style=\"display:block;\"></a>");
                }
                else {
                    $("#dvCarryOutStatusChange").html("<a class=\"stop-btn-one\" onclick=\"ChangeCarryoutStatus(" + storeId + ",'RUNNING')\"><img src=\"./img/Start.png\" style=\"display:block;\"></a>");
                }

                $("#dvDeliveryStatus").html("DELIVERY " + deliveryCurrentStatus);
                if (deliveryCurrentStatus.toLowerCase().trim() == "running") {
                    $("#dvDeliveryStatusChange").html("<a class=\"start-btn-one\" onclick=\"ChangeDeliveryStatus(" + storeId + ",'STOPPED')\"><img src=\"./img/Stop.png\" style=\"display:block;\"></a>");
                }
                else {
                    $("#dvDeliveryStatusChange").html("<a class=\"stop-btn-one\" onclick=\"ChangeDeliveryStatus(" + storeId + ",'RUNNING')\"><img src=\"./img/Start.png\" style=\"display:block;\"></a>");
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

//Change Delivery Status
function ChangeDeliveryStatus(storeid, status) {

    $.ajax({
        url: global + 'ChangeDeliveryStatus?storeid=' + storeid + "&status=" + status,
        type: 'GET',
        datatype: 'jsonp',
        contenttype: "application/json",
        crossDomain: true,
        async: false,
        success: function (data) {
            if (status == "STOPPED") {
                $("#dvDeliveryStatus").html("DELIVERY STOPPED");
                $("#dvDeliveryStatusChange").html("");
                $("#dvDeliveryStatusChange").html("<a  class=\"stop-btn-one\" onclick=\"ChangeDeliveryStatus(" + storeid + ",'RUNNING')\"><img src=\"./img/Start.png\" style=\"display:block;\"></a>");

            }
            else {
                $("#dvDeliveryStatus").html("DELIVERY RUNNING");
                $("#dvDeliveryStatusChange").html("");
                $("#dvDeliveryStatusChange").html("<a class=\"start-btn-one\" onclick=\"ChangeDeliveryStatus(" + storeid + ",'STOPPED')\"><img src=\"./img/Stop.png\" style=\"display:block;\"></a>");

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
                    window.location.href = "carryout.html?StoreId=" + storeId + "&status=New";

                }
            }
            else if (giftcardchanged > 0 && carryoutchanged == 0) {
                window.location.href = "giftcardsorders.html?StoreId=" + storeId;
            }
            else if (carryoutchanged > 0 && giftcardchanged == 0) {
                window.location.href = "carryout.html?StoreId=" + storeId + "&status=New";
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

    //if (giftCardsEnabled != "" && giftCardsEnabled == "True") {
    if (giftCardProgramEnabled != "" && giftCardProgramEnabled == "True") {
        //$('.menuGiftcard').removeClass('disabled');
        $('.menuGiftcard').show();
        var isAdminUser = localStorage.getItem("IsAdminUser").trim();
        if (isAdminUser != "" && isAdminUser == "True") {
            //$('#liShowAdvanced').show();
            ShowGiftCardAdvancedSection();
        }
        else {
            //$('#liShowAdvanced').hide();
            HideGiftCardAdvancedSection();
        }

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

    //$('#btnLoadGiftCard').addClass("disabled");
    //$('#btnRedeemGiftCard').addClass("disabled");
    //$('#btnRefundGiftCard').addClass("disabled");
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
                    console.log(data);
                    $('#tblRedeemHistory tbody').html("");
                    //console.log(data);
                    //console.log(data.replace(/"/g, "").indexOf("Invalid Card Code."));
                    if (data.replace(/"/g, "").indexOf("Message:") > -1) {
                        $('#dvInner').hide();
                        $('#dvOuter').hide();
                        $('#dvOuterText').html("");
                        $("#txtPINSearch").val("");
                        var message = (data.replace(/"/g, "").replace("Message: ",""));
                        callSweetAlertWarning(message);
                        //callSweetAlertWarning("Gift Card is NOT Active. Please call (614)356-8000 to activate the Card.");
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
                        callSweetAlertWarning("Gift Card Code and PIN do not match.");

                    }
                    //else if (data.replace(/"/g, "").indexOf("Gift Card was never used.") > -1) {
                    //    $('#dvInner').hide();
                    //    $('#dvOuter').hide();
                    //    $('#dvOuterText').html("");
                    //    $("#txtPINSearch").val("");
                    //    callSweetAlertWarning("Gift Card was never used, Please use New screen to create the new Card.");
                    //}
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
                            //$('#btnRedeemGiftCard').removeClass("disabled");
                            //$('#btnLoadGiftCard').removeClass("disabled");
                            //$('#btnRefundGiftCard').removeClass("disabled");
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
                                    
                                    $('#giftcard #hdnSearchCardType').val(cardType);
                                }
                                
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
                                    else if (value.USEDTYPE == "Refund" && value.USEDVALUE != "") {
                                        htmlHistory += "<td class=\"popup-highlighted-row\" style=\"text-align:right;\"> (+)" + FormatDecimal(value.USEDVALUE) + "</td>";
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
                                    else if (value.USEDTYPE == "Refund" && value.USEDVALUE != "") {
                                        htmlHistory += "<td style=\"text-align:right;\"> (+)" + FormatDecimal(value.USEDVALUE) + "</td>";
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
    var isEmployeePinCorrect = false;
    var isEmployeePinRequired = false;
    var employeePINS = localStorage.getItem("EmployeePIN");
    if (employeePINS != null && employeePINS != "") {
        var currentEmployeePIN = $("#txtCurrentUserPIN").val();
        var arrayEmployeePIN = employeePINS.split(',');
        if (arrayEmployeePIN.length > 0) {
            isEmployeePinRequired = true;
            for (var i = 0; i < arrayEmployeePIN.length; ++i) {
                if (arrayEmployeePIN[i] == currentEmployeePIN) {
                    isEmployeePinCorrect = true;
                }
            }
        }
        else {
            isEmployeePinCorrect = false;
        }
    }
    else {
        isEmployeePinCorrect = true;
    }
       

    $("#txtRedeem").css('border-bottom', bottomBorder);
    $("#txtCardCodeSearch").css('border-bottom', bottomBorder);
    $("#txtPINSearch").css('border-bottom', bottomBorder);
    $("#txtLoad").css('border-bottom', bottomBorder);
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

    var employeePin = $('#txtCurrentUserPIN').val();
  
    var register = $('#ddlRegister').val();
    if (cardCode != "" && amount != "" && Number(amount) > 0 && pin != "" && pin != "0") {
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

        if (isEmployeePinCorrect == true) {
            HideEmployeePINPopup();
            try {
                var url = global + "/CheckGiftCardForAddEmployeePinLoad?giftCardCode=" + encodeURIComponent(cardCode);
                $.getJSON(url, function (data) {
                    if (data.replace(/"/g, "").toLowerCase().indexOf("failed") > -1) {
                        $("#hdnValidateCard").val(false);
                        $("#hdnCardType").val("");

                        var displayMessage = data.replace(/"/g, "").split('|');
                        callSweetAlertWarning(displayMessage[1]);
                    }
                    else if (data.replace(/"/g, "").toLowerCase().indexOf("successfull") > -1) {

                        if ($('#giftcard #hdnSearchCardType').val().toUpperCase() != "")//STORE
                        {
                            var url = global + "/CheckGiftCardAndPin?giftCardCode=" + encodeURIComponent(cardCode) + "&pin=" + encodeURIComponent(pin);
                            $.getJSON(url, function (data) {
                                //console.log(data)
                                if (data.replace(/"/g, "").toLowerCase().indexOf("failed") > -1) {
                                    var displayMessage = data.replace(/"/g, "").split('|');
                                    callSweetAlertWarning(displayMessage[1]);
                                }
                                else if (data.replace(/"/g, "").toLowerCase().indexOf("successfull") > -1) {
                                    OpenGiftCardPaymentPopup();
                                }
                            });
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
                                    callSweetAlertWarning("Gift Card Code and PIN do not match.");

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
                });
                
            }
            catch (e) {

            }
        }
        else {
            var currentEmployeePIN = $("#txtCurrentUserPIN").val();
            if (currentEmployeePIN == "") {
                $('#hdnIsValidEmployeePIN').val("");
                $("#txtCurrentUserPIN").css('border-bottom', errorClassBorder);
            }
            else {
                $("#txtCurrentUserPIN").css('border-bottom', bottomBorder);
                HideEmployeePINPopup();
                callSweetAlertWarning("Invalid Employee PIN!");
            }
        }
    }
    else {
        //$('#dvInner').hide();
        if (amount == "" || amount == "0") {
            $("#txtLoad").css('border-bottom', errorClassBorder);
        }
        if (pin == "" || pin == "0") {
            $("#txtPINSearch").css('border-bottom', errorClassBorder);
        }
        if (cardCode == "") {
            $("#txtCardCodeSearch").css('border-bottom', errorClassBorder);
        }
    }
}

function ShowEmployeePINPopup() {
    $('#giftcardEmployeePIN').html("");
    var html = "<div class=\"popup-content-area\"><h2 class=\"popup-title\" style=\"text-align: center;\"><span style=\"font-size:22px;\">Employee PIN</span></span></h2>";
    html += "<h4 id=\"employeePinPopuperror\" style=\"font-weight:400;color:#ff4848;display:none;\"></h4>";

    html += "<div><input type=\"text\" placeholder=\"PIN\" id=\"txtCurrentUserPIN\" class=\"mandatory\" style=\"text-align: center;font-size: 50px;\" onKeyDown=\"if(this.value.length==6) this.value = this.value.slice(0, -1);\"></div>";

    html += "<div class=\"popup-button-area\"><button id=\"btnSubmitLoadNewCard\" onclick=\"LoadNewGiftCard();\" type=\"button\" class=\"popup-confirm-medium swal2-styled\" aria-label=\"\" ";
    html += "style=\"background-color: rgb(59, 152, 71); border-left-color: rgb(59, 152, 71); border-right-color: rgb(59, 152, 71);\">Submit</button>";
    html += "<button type=\"button\" onclick=\"HideEmployeePINPopup();\" class=\"swal2-styled popup-no\" aria-label=\"\" style=\"display: inline-block; background-color: rgb(233, 88, 97);\">Cancel</button></div></div>";
    $('#giftcardEmployeePIN').html(html);
    $(".popup-overlay").show();
    $('#giftcardEmployeePIN').show();
}

function ShowEmployeePINPopupLoad() {
    $('#giftcardEmployeePIN').html("");
    var html = "<div class=\"popup-content-area\"><h2 class=\"popup-title\" style=\"text-align: center;\"><span style=\"font-size:22px;\">Employee PIN</span></span></h2>";
    html += "<h4 id=\"employeePinPopuperror\" style=\"font-weight:400;color:#ff4848;display:none;\"></h4>";

    html += "<div><input type=\"text\" placeholder=\"PIN\" id=\"txtCurrentUserPIN\" class=\"mandatory\" style=\"text-align: center;font-size: 50px;\" onKeyDown=\"if(this.value.length==6) this.value = this.value.slice(0, -1);\"></div>";

    html += "<div class=\"popup-button-area\"><button id=\"btnSubmitLoadNewCard\" onclick=\"LoadGiftCard();\" type=\"button\" class=\"popup-confirm-medium swal2-styled\" aria-label=\"\" ";
    html += "style=\"background-color: rgb(59, 152, 71); border-left-color: rgb(59, 152, 71); border-right-color: rgb(59, 152, 71);\">Submit</button>";
    html += "<button type=\"button\" onclick=\"HideEmployeePINPopup();\" class=\"swal2-styled popup-no\" aria-label=\"\" style=\"display: inline-block; background-color: rgb(233, 88, 97);\">Cancel</button></div></div>";
    $('#giftcardEmployeePIN').html(html);
    $(".popup-overlay").show();
    $('#giftcardEmployeePIN').show();
}

function HideEmployeePINPopup() {
    $('#hdnIsValidEmployeePIN').val("false");    
    $(".popup-overlay").hide();
    $('#giftcardEmployeePIN').hide();
}

function LoadNewGiftCard() {
    var isEmployeePinCorrect = false;
    var isEmployeePinRequired = false;
    var employeePINS = localStorage.getItem("EmployeePIN");
    if (employeePINS != null && employeePINS != "")
    {
        var currentEmployeePIN = $("#txtCurrentUserPIN").val();        
        var arrayEmployeePIN = employeePINS.split(',');
        if(arrayEmployeePIN.length > 0)
        {
            isEmployeePinRequired = true;
            for (var i = 0; i < arrayEmployeePIN.length; ++i) {
                if(arrayEmployeePIN[i] == currentEmployeePIN)
                {
                    isEmployeePinCorrect = true;
                }
            }
        }
        else {
            isEmployeePinCorrect = false;
        }
    }
    else {
        isEmployeePinCorrect = true;
    }

    if (isEmployeePinCorrect == true)
    {
        HideEmployeePINPopup();
        $("#txtCardCode").css('border-bottom', bottomBorder);
        $("#txtAmount").css('border-bottom', bottomBorder);
        //$("#txtEmail").css('border-bottom', bottomBorder);
        //$("#txtName").css('border-bottom', bottomBorder);
        //$("#txtGiftCardAddPin").css('border-bottom', bottomBorder);
        $('#tab-giftcard-new #txtPhone').css('border-bottom', bottomBorder);
        $('#tab-giftcard-new #txtName').css('border-bottom', bottomBorder);
        $('#tab-giftcard-new #txtEmail').css('border-bottom', bottomBorder);

        $("#txtCCNumber").css('border-bottom', bottomBorder);
        $("#txtCCName").css('border-bottom', bottomBorder);
        $("#txtCVV").css('border-bottom', bottomBorder);
        $("#ddlCCMonth").css('border-bottom', bottomBorder);
        $("#ddlCCYear").css('border-bottom', bottomBorder);

        $('#dvOuterText').removeAttr("style");
        var storeId = 0;
        storeId = SetStoreId();
        //var pin = $('#txtGiftCardAddPin').val();
        var cardCode = $('#txtCardCode').val();
        var phone = $('#txtPhone').val();
        if (phone == '') {
            phone = '0';
        }
        var email = encodeURIComponent($('#tab-giftcard-new #txtEmail').val());
        var name = encodeURIComponent($('#tab-giftcard-new #txtName').val());
        var amount = $('#txtAmount').val().trim();
        if (amount == '')
            amount = '0';
        var employeePin = $('#txtCurrentUserPIN').val();
        if (cardCode != "" && amount != "" && amount != "0" && phone != "" && phone != "0" && name != "" && email != "" && isEmail("#tab-giftcard-new #txtEmail") == true) {

            var url = global + "/CheckGiftCardForAddEmployeePin?giftCardCode=" + encodeURIComponent(cardCode);
            $.getJSON(url, function (data) {
                //console.log(data)

                //$("#hdnValidateCard").val(true);
                if (data.replace(/"/g, "").toLowerCase().indexOf("failed") > -1) {
                    $('#btnAddCard').text("Add Card");
                    $("#hdnValidateCard").val(false);
                    $("#hdnCardType").val("");

                    var displayMessage = data.replace(/"/g, "").split('|');
                    callSweetAlertWarning(displayMessage[1]);
                }
                else if (data.replace(/"/g, "").toLowerCase().indexOf("successfull") > -1) {
                    ///var obj = JSON.parse(data);
                    var displayMessage = data.replace(/"/g, "").split('|');

                    localStorage.setItem('GiftCardDetails', data);
                    if (displayMessage[1].toLowerCase().indexOf("not exist") > -1) {

                        $("#liPaymentType").hide();
                        $("#liCCName").hide();
                        $("#liCCNo").hide();
                        // console.log(3)

                        var url = global + "/DoesGiftCardExist?giftCardCode=" + encodeURIComponent(cardCode);
                        $.getJSON(url, function (data) {
                            //console.log(data)

                            //$("#hdnValidateCard").val(true);
                            if (data.replace(/"/g, "").indexOf("Message:") > -1) {
                                $('#hdnIsValidEmployeePIN').val("false");
                                $("#txtCardCode").val("");
                                $("#txtCardCode").css('border-bottom', errorClassBorder);
                                $('#btnAddCard').text("Add Card");
                                $("#hdnValidateCard").val(false);
                                $("#hdnCardType").val("");

                                var message = (data.replace(/"/g, "").replace("Message: ", ""));
                                callSweetAlertWarning(message);
                            }
                            else {
                                $('#hdnIsValidEmployeePIN').val("true");
                                var obj = JSON.parse(data);
                                localStorage.setItem('GiftCardDetails', data);
                                if (obj.GiftCardExists == true) {
                                    if (obj.CardType.toUpperCase() != "STORE") {
                                        //console.log(1);
                                        $("#liPaymentType").show();
                                        var checkedPaymentType = $("input[name='paymentType']:checked").val();
                                        if (checkedPaymentType.toUpperCase() == 'CARD') {
                                            //$("#paymentTypeCard").prop("checked", true);
                                            ////$$("#liCCName").show();
                                            $$("#liCCName").hide();
                                            $$("#liCCNo").show();
                                            $$("#hdnSelectedPaymentType").val("Credit Card");
                                        }
                                        else if (checkedPaymentType.toUpperCase() == 'CASH') {
                                            $$("#liCCName").hide();
                                            $$("#liCCNo").hide();
                                            $$("#hdnSelectedPaymentType").val("Cash");
                                        }

                                        var ccName = $("#txtCCName").val().trim();
                                        var ccNumber = $("#txtCCNumber").val().trim();
                                        var cvv = $("#txtCVV").val().trim();
                                        var expMonth = $("#ddlCCMonth").val();
                                        var expYear = $("#ddlCCYear").val();
                                        var paymentType = $("#hdnSelectedPaymentType").val();

                                        if (paymentType != "" && paymentType.toUpperCase() == "CASH") {
                                            var cardInfo = localStorage.getItem('GiftCardDetails');
                                            var obj = JSON.parse(cardInfo);
                                            if (isEmployeePinRequired == true)
                                                AddUpdateGiftCardRecordPIN(obj.GiftCardExists, obj.Amount, obj.GiftCardId, cardCode, obj.CardType, ccName, ccNumber, cvv, expMonth, expYear, paymentType, employeePin);
                                            else
                                                AddUpdateGiftCardRecord(obj.GiftCardExists, obj.Amount, obj.GiftCardId, cardCode, obj.CardType, ccName, ccNumber, cvv, expMonth, expYear, paymentType);
                                        }
                                            //ccName != "" && 
                                        else if (ccNumber != "" && cvv != "" && expMonth != "" && expYear != "") {
                                            var cardInfo = localStorage.getItem('GiftCardDetails');
                                            var obj = JSON.parse(cardInfo);
                                            if (isEmployeePinRequired == true)
                                                AddUpdateGiftCardRecordPIN(obj.GiftCardExists, obj.Amount, obj.GiftCardId, cardCode, obj.CardType, ccName, ccNumber, cvv, expMonth, expYear, paymentType, employeePin);
                                            else
                                                AddUpdateGiftCardRecord(obj.GiftCardExists, obj.Amount, obj.GiftCardId, cardCode, obj.CardType, ccName, ccNumber, cvv, expMonth, expYear, paymentType);
                                        }
                                        else {
                                            //if (ccName == "") {
                                            //    $("#txtCCName").css('border-bottom', errorClassBorder);
                                            //}
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
                                        if (isEmployeePinRequired == true)
                                            AddUpdateGiftCardRecordPIN(obj.GiftCardExists, obj.Amount, obj.GiftCardId, cardCode, obj.CardType, "", "", "", "", "", paymentType, employeePin);
                                        else
                                            AddUpdateGiftCardRecord(obj.GiftCardExists, obj.Amount, obj.GiftCardId, cardCode, obj.CardType, "", "", "", "", "", paymentType);
                                        //console.log(2);
                                    }

                                }
                                else {
                                    $('#hdnIsValidEmployeePIN').val("false");
                                    $("#liPaymentType").hide();
                                    $("#liCCName").hide();
                                    $("#liCCNo").hide();
                                    //console.log(3);
                                    if (isEmployeePinRequired == true)
                                        AddUpdateGiftCardRecordPIN(obj.GiftCardExists, obj.Amount, obj.GiftCardId, cardCode, obj.CardType, "", "", "", "", "", paymentType, employeePin);
                                    else
                                        AddUpdateGiftCardRecord(obj.GiftCardExists, obj.Amount, obj.GiftCardId, cardCode, obj.CardType, "", "", "", "", "", paymentType);
                                }
                            }
                        });


                    }
                    else {

                        var url = global + "/DoesGiftCardExist?giftCardCode=" + encodeURIComponent(cardCode);
                        $.getJSON(url, function (data) {
                            //console.log(data)

                            //$("#hdnValidateCard").val(true);
                            if (data.replace(/"/g, "").indexOf("Message:") > -1) {
                                $('#hdnIsValidEmployeePIN').val("false");
                                $("#txtCardCode").val("");
                                $("#txtCardCode").css('border-bottom', errorClassBorder);
                                $('#btnAddCard').text("Add Card");
                                $("#hdnValidateCard").val(false);
                                $("#hdnCardType").val("");

                                var message = (data.replace(/"/g, "").replace("Message: ", ""));
                                callSweetAlertWarning(message);
                            }
                            else {
                                $('#hdnIsValidEmployeePIN').val("true");
                                var obj = JSON.parse(data);
                                localStorage.setItem('GiftCardDetails', data);
                                if (obj.GiftCardExists == true) {
                                    if (obj.CardType.toUpperCase() != "STORE") {
                                        //console.log("1A");
                                        $("#liPaymentType").show();
                                        var checkedPaymentType = $("input[name='paymentType']:checked").val();
                                        if (checkedPaymentType.toUpperCase() == 'CARD') {
                                            //$("#paymentTypeCard").prop("checked", true);
                                            ////$$("#liCCName").show();
                                            $$("#liCCName").hide();
                                            $$("#liCCNo").show();
                                            $$("#hdnSelectedPaymentType").val("Credit Card");
                                        }
                                        else if (checkedPaymentType.toUpperCase() == 'CASH') {
                                            $$("#liCCName").hide();
                                            $$("#liCCNo").hide();
                                            $$("#hdnSelectedPaymentType").val("Cash");
                                        }

                                        var ccName = $("#txtCCName").val().trim();
                                        var ccNumber = $("#txtCCNumber").val().trim();
                                        var cvv = $("#txtCVV").val().trim();
                                        var expMonth = $("#ddlCCMonth").val();
                                        var expYear = $("#ddlCCYear").val();
                                        var paymentType = $("#hdnSelectedPaymentType").val();

                                        if (paymentType != "" && paymentType.toUpperCase() == "CASH") {
                                            var cardInfo = localStorage.getItem('GiftCardDetails');
                                            var obj = JSON.parse(cardInfo);
                                            if (isEmployeePinRequired == true)
                                                AddUpdateGiftCardRecordPIN(obj.GiftCardExists, obj.Amount, obj.GiftCardId, cardCode, obj.CardType, ccName, ccNumber, cvv, expMonth, expYear, paymentType, employeePin);
                                            else
                                                AddUpdateGiftCardRecord(obj.GiftCardExists, obj.Amount, obj.GiftCardId, cardCode, obj.CardType, ccName, ccNumber, cvv, expMonth, expYear, paymentType);
                                        }
                                            //ccName != "" &&
                                        else if (ccNumber != "" && cvv != "" && expMonth != "" && expYear != "") {
                                            var cardInfo = localStorage.getItem('GiftCardDetails');
                                            var obj = JSON.parse(cardInfo);
                                            if (isEmployeePinRequired == true)
                                                AddUpdateGiftCardRecordPIN(obj.GiftCardExists, obj.Amount, obj.GiftCardId, cardCode, obj.CardType, ccName, ccNumber, cvv, expMonth, expYear, paymentType, employeePin);
                                            else
                                                AddUpdateGiftCardRecord(obj.GiftCardExists, obj.Amount, obj.GiftCardId, cardCode, obj.CardType, ccName, ccNumber, cvv, expMonth, expYear, paymentType);
                                        }
                                        else {
                                            //if (ccName == "") {
                                            //    $("#txtCCName").css('border-bottom', errorClassBorder);
                                            //}
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
                                        $('#hdnIsValidEmployeePIN').val("false");
                                        var cardInfo = localStorage.getItem('GiftCardDetails');
                                        var obj = JSON.parse(cardInfo);
                                        if (isEmployeePinRequired == true)
                                            AddUpdateGiftCardRecordPIN(obj.GiftCardExists, obj.Amount, obj.GiftCardId, cardCode, obj.CardType, "", "", "", "", "", "", employeePin);
                                        else
                                            AddUpdateGiftCardRecord(obj.GiftCardExists, obj.Amount, obj.GiftCardId, cardCode, obj.CardType, "", "", "", "", "", "");
                                        //console.log("2A");
                                    }

                                }
                                else {
                                    $('#hdnIsValidEmployeePIN').val("false");
                                    $("#liPaymentType").hide();
                                    $("#liCCName").hide();
                                    $("#liCCNo").hide();
                                    //console.log("3A");
                                    if (isEmployeePinRequired == true)
                                        AddUpdateGiftCardRecordPIN(obj.GiftCardExists, obj.Amount, obj.GiftCardId, cardCode, obj.CardType, "", "", "", "", "", "", employeePin);
                                    else
                                        AddUpdateGiftCardRecord(obj.GiftCardExists, obj.Amount, obj.GiftCardId, cardCode, obj.CardType, "", "", "", "", "", "");
                                }
                            }
                        });

                    }
                }
            });

        }
        else {
            $('#hdnIsValidEmployeePIN').val("false");
            $('#dvInner').hide();
            if (amount == "" || amount == "0") {
                $("#txtAmount").css('border-bottom', errorClassBorder);
            }
            //if (pin == "" || pin == "0") {
            //    $("#txtGiftCardAddPin").css('border-bottom', errorClassBorder);
            //}
            if (phone == "" || phone == "0") {
                $('#tab-giftcard-new #txtPhone').css('border-bottom', errorClassBorder);
            }
            if (name == "") {
                $('#tab-giftcard-new #txtName').css('border-bottom', errorClassBorder);
            }
            if (email == "") {
                $('#tab-giftcard-new #txtEmail').css('border-bottom', errorClassBorder);
            }
            if (cardCode == "") {
                $("#txtCardCode").css('border-bottom', errorClassBorder);
            }

        }
    }
    else {
        var currentEmployeePIN = $("#txtCurrentUserPIN").val();
        if (currentEmployeePIN == "") {
            $('#hdnIsValidEmployeePIN').val("");
            $("#txtCurrentUserPIN").css('border-bottom', errorClassBorder);
        }
        else {
            $("#txtCurrentUserPIN").css('border-bottom', bottomBorder);
            HideEmployeePINPopup();
            callSweetAlertWarning("Invalid Employee PIN!");
        }
        
    }
}

function AddUpdateGiftCardRecordPIN(exists, gcamount, giftcardId, cardcode, cardType, ccName, ccNumber, cvv, expMonth, expYear, paymentType, employeePin) {
    $('#hdnIsValidEmployeePIN').val("false");
    $("#paymentTypeCard").prop("checked", true);
    var storeId = 0;
    storeId = SetStoreId();
    var loggedInUserId = 0;
    loggedInUserId = window.localStorage.getItem("CustomerId");
    var validStores = $('#hdnValidStoresIds').val();
    $("input[name='checkValidStore']:checked").each(function () {
        var checkedStore = $(this).val();
        validStores += checkedStore + ",";
    });
    validStores = validStores.replace(/,\s*$/, "");
    var expirationDate = $('#txtExpirationDate').val();
    var expirationHour = $('#expirationHour').val();
    var expirationMinute = $('#expirationMinute').val();
    var expirationPeriod = $('#expirationPeriod').val();
    var expirationTime = "";
    if (expirationHour != "" && expirationMinute != "" && expirationPeriod != "") {
        expirationTime = expirationHour + ":" + expirationMinute + " " + expirationPeriod;
    }
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

    var email = encodeURIComponent($('#tab-giftcard-new #txtEmail').val());
    var name = encodeURIComponent($('#tab-giftcard-new #txtName').val());
    //var pin = encodeURIComponent($('#tab-giftcard-new #txtGiftCardAddPin').val());
    //if(pin == "")
    //{
    //    pin = "0";
    //}
    if (isEmail("#tab-giftcard-new #txtEmail") == true && phone != "" && phone != "0" && name != "") {
        var customerId = "0";
        $('#btnAddCard').text("Adding Card...");
        $("#btnAddCard").attr("disabled", true);
        try {
            if (localStorage.getItem("CustomerId") != null) {
                customerId = localStorage.getItem("CustomerId").trim();
            }

            var url = global + "/AddUpdateGiftCardRecordPIN?storeid=" + storeId + "&giftCardCode=" + encodeURIComponent(cardCode) + "&giftcardId=" + giftcardId + "&phone=" + phone + "&amount=" + amount
                + "&email=" + email + "&name=" + name + "&giftCardExists=" + exists + "&gcamount=" + gcamount + "&cardType=" + cardType +
                "&ccName=" + ccName + "&ccNumber=" + ccNumber + "&cvv=" + cvv + "&expMonth=" + expMonth + "&expYear=" + expYear + "&paymentType=" + paymentType + "&loggedInUserId=" + loggedInUserId +
                "&employeePin=" + employeePin;
            //console.log('name: '+name)

            if ((validStores != "" && validStores != null) || (expirationDate != "" && expirationDate != null)) {
                url = global + "/AddUpdateGiftCardRecordAdvancedPIN?storeid=" + storeId + "&giftCardCode=" + encodeURIComponent(cardCode) + "&giftcardId=" + giftcardId + "&phone=" + phone + "&amount=" + amount
                    + "&email=" + email + "&name=" + name + "&giftCardExists=" + exists + "&gcamount=" + gcamount + "&cardType=" + cardType +
                    "&ccName=" + ccName + "&ccNumber=" + ccNumber + "&cvv=" + cvv + "&expMonth=" + expMonth + "&expYear=" + expYear + "&paymentType=" + paymentType + "&loggedInUserId=" + loggedInUserId +
                    "&validStores=" + validStores + "&cardExpirationDate=" + expirationDate + "&cardExpirationTime=" + expirationTime + "&employeePin=" + employeePin;

            }

            var totalHistoryAmount = 0;
            $.getJSON(url, function (data) {
                $('#btnAddCard').text("Add Card");
                $("#btnAddCard").attr("disabled", false);
                $("#tab-giftcard-new #txtCardCode").css('border-bottom', bottomBorder);
                $("#tab-giftcard-new #txtAmount").css('border-bottom', bottomBorder);
                $("#tab-giftcard-new #txtPhone").css('border-bottom', bottomBorder);
                $("#tab-giftcard-new #txtName").css('border-bottom', bottomBorder);
                $("#tab-giftcard-new #txtEmail").css('border-bottom', bottomBorder);
                $("#tab-giftcard-new #txtGiftCardAddPin").css('border-bottom', bottomBorder);



                if (data.replace(/"/g, "").toLowerCase().indexOf("successfull") > -1) {
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
                    $('#tab-giftcard-new #txtGiftCardAddPin').val("");
                    $('#tab-giftcard-new #txtCCName').val("");
                    $('#tab-giftcard-new #txtCCNumber').val("");
                    $('#tab-giftcard-new #txtCVV').val("");
                    $('#tab-giftcard-new #ddlCCMonth').val("");
                    $('#tab-giftcard-new #ddlCCYear').val("");

                    $("#liPaymentType").hide();
                    $("#liCCName").hide();
                    $("#liCCNo").hide();

                }
                else if (data.replace(/"/g, "").toLowerCase().indexOf("failed") > -1) {
                    var displayMessage = data.replace(/"/g, "").split('|');
                    callSweetAlertWarning(displayMessage[1]);
                }
            });
        }
        catch (e) {

        }
    }
    else {
        if (cardCode == "") {
            $("#txtCardCode").css('border-bottom', errorClassBorder);
        }
        if (amount == "" || amount == "0") {
            $("#txtAmount").css('border-bottom', errorClassBorder);
        }
        if (pin == "" || pin == "0") {
            $("#txtGiftCardAddPin").css('border-bottom', errorClassBorder);
        }
        if (phone == "" || phone == "0") {
            $('#tab-giftcard-new #txtPhone').css('border-bottom', errorClassBorder);
        }
        if (name == "") {
            $('#tab-giftcard-new #txtName').css('border-bottom', errorClassBorder);
        }
    }
}

function AddUpdateGiftCardRecord(exists, gcamount, giftcardId, cardcode, cardType, ccName, ccNumber, cvv, expMonth, expYear, paymentType) {
    $('#hdnIsValidEmployeePIN').val("false");
    $("#paymentTypeCard").prop("checked", true);
    var storeId = 0;
    storeId = SetStoreId();
    var loggedInUserId = 0;
    loggedInUserId = window.localStorage.getItem("CustomerId");
    var validStores = $('#hdnValidStoresIds').val();
    $("input[name='checkValidStore']:checked").each(function () {
        var checkedStore = $(this).val();
        validStores += checkedStore + ",";
    });
    validStores = validStores.replace(/,\s*$/, "");
    var expirationDate = $('#txtExpirationDate').val();
    var expirationHour = $('#expirationHour').val();
    var expirationMinute = $('#expirationMinute').val();
    var expirationPeriod = $('#expirationPeriod').val();
    var expirationTime = "";
    if (expirationHour != "" && expirationMinute != "" && expirationPeriod != "")
    {
        expirationTime = expirationHour + ":" + expirationMinute + " " + expirationPeriod;
    }
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

    var email = encodeURIComponent($('#tab-giftcard-new #txtEmail').val());
    var name = encodeURIComponent($('#tab-giftcard-new #txtName').val());
    //var pin = encodeURIComponent($('#tab-giftcard-new #txtGiftCardAddPin').val());
    //if(pin == "")
    //{
    //    pin = "0";
    //}
    if (isEmail("#tab-giftcard-new #txtEmail") == true && phone != "" && phone != "0" && name != "") {
        var customerId = "0";
        $('#btnAddCard').text("Adding Card...");
        $("#btnAddCard").attr("disabled", true);
        try {
            if (localStorage.getItem("CustomerId") != null) {
                customerId = localStorage.getItem("CustomerId").trim();
            }

            var url = global + "/AddUpdateGiftCardRecord?storeid=" + storeId + "&giftCardCode=" + encodeURIComponent(cardCode) + "&giftcardId=" + giftcardId + "&phone=" + phone + "&amount=" + amount
                + "&email=" + email + "&name=" + name + "&giftCardExists=" + exists + "&gcamount=" + gcamount + "&cardType=" + cardType +
                "&ccName=" + ccName + "&ccNumber=" + ccNumber + "&cvv=" + cvv + "&expMonth=" + expMonth + "&expYear=" + expYear + "&paymentType=" + paymentType + "&loggedInUserId=" + loggedInUserId;
            //console.log('name: '+name)

            if ((validStores != "" && validStores != null) || (expirationDate != "" && expirationDate != null))
            {
                url = global + "/AddUpdateGiftCardRecordAdvanced?storeid=" + storeId + "&giftCardCode=" + encodeURIComponent(cardCode) + "&giftcardId=" + giftcardId + "&phone=" + phone + "&amount=" + amount
                + "&email=" + email + "&name=" + name + "&giftCardExists=" + exists + "&gcamount=" + gcamount + "&cardType=" + cardType +
                "&ccName=" + ccName + "&ccNumber=" + ccNumber + "&cvv=" + cvv + "&expMonth=" + expMonth + "&expYear=" + expYear + "&paymentType=" + paymentType + "&loggedInUserId=" + loggedInUserId +
                "&validStores=" + validStores + "&cardExpirationDate=" + expirationDate + "&cardExpirationTime=" + expirationTime;
                
            }

            var totalHistoryAmount = 0;
            $.getJSON(url, function (data) {
                $('#btnAddCard').text("Add Card");
                $("#btnAddCard").attr("disabled", false);
                $("#tab-giftcard-new #txtCardCode").css('border-bottom', bottomBorder);
                $("#tab-giftcard-new #txtAmount").css('border-bottom', bottomBorder);
                $("#tab-giftcard-new #txtPhone").css('border-bottom', bottomBorder);
                $("#tab-giftcard-new #txtName").css('border-bottom', bottomBorder);
                $("#tab-giftcard-new #txtEmail").css('border-bottom', bottomBorder);
                $("#tab-giftcard-new #txtGiftCardAddPin").css('border-bottom', bottomBorder);



                if (data.replace(/"/g, "").toLowerCase().indexOf("successfull") > -1) {
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
                    $('#tab-giftcard-new #txtGiftCardAddPin').val("");
                    $('#tab-giftcard-new #txtCCName').val("");
                    $('#tab-giftcard-new #txtCCNumber').val("");
                    $('#tab-giftcard-new #txtCVV').val("");
                    $('#tab-giftcard-new #ddlCCMonth').val("");
                    $('#tab-giftcard-new #ddlCCYear').val("");

                    $("#liPaymentType").hide();
                    $("#liCCName").hide();
                    $("#liCCNo").hide();

                }
                else if (data.replace(/"/g, "").toLowerCase().indexOf("failed") > -1) {
                    var displayMessage = data.replace(/"/g, "").split('|');
                    callSweetAlertWarning(displayMessage[1]);
                }
            });
        }
        catch (e) {

        }
    }
    else {
        if (cardCode == "") {
            $("#txtCardCode").css('border-bottom', errorClassBorder);
        }
        if (amount == "" || amount == "0") {
            $("#txtAmount").css('border-bottom', errorClassBorder);
        }
        if (pin == "" || pin == "0") {
            $("#txtGiftCardAddPin").css('border-bottom', errorClassBorder);
        }
        if (phone == "" || phone == "0") {
            $('#tab-giftcard-new #txtPhone').css('border-bottom', errorClassBorder);
        }
        if (name == "") {
            $('#tab-giftcard-new #txtName').css('border-bottom', errorClassBorder);
        }
    }
}

function RedeemGiftCard() {
    var storeId = 0;
    var params = getParams();
    $("#txtLoad").css('border-bottom', bottomBorder);
    $("#txtRedeem").css('border-bottom', bottomBorder);
    $("#txtPINSearch").css('border-bottom', bottomBorder);
    $("#txtCardCodeSearch").css('border-bottom', bottomBorder);
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
        if (cardCode != "" && amount != "" && amount != "0" && pin != "" && pin != "0") {
            $('#btnRedeemGiftCard').text("Redeeming...");
            //$('#btnRedeemReward').css("font-size", "22px");
            try {
                url = global + "/GiftCardRedeemNew?storeid=" + storeId + "&giftCardCode=" + encodeURIComponent(cardCode) + "&phone=" + phone + "&amount=" + amount + "&register=" + register + "&pin=" + pin;
                //alert(url);
                $('#tblRedeemHistory tbody').html("");
                var totalHistoryAmount = 0;
                $.getJSON(url, function (data) {
                    $('#btnRedeemGiftCard').text("Redeem");
                    //$('#btnRedeemReward').css("font-size", "24px");
                    $("#txtCardCodeSearch").css('border-bottom', bottomBorder);
                    $("#txtRedeem").css('border-bottom', bottomBorder);
                    $("#txtPhoneSearch").css('border-bottom', bottomBorder);

                    //alert(data);
                    if (data.replace(/"/g, "").toLowerCase().indexOf("failed") > -1) {
                        ////$('#dvInner').show();
                        ////SearchGiftCard();
                        var displayMessage = data.replace(/"/g, "").split('|');
                        callSweetAlertWarning(displayMessage[1]);
                        //$('#txtLoad').val("");
                        //$('#txtRedeem').val("");
                    }
                    else if (data.replace(/"/g, "").toLowerCase().indexOf("successfull") > -1) {
                        ////SearchGiftCard();
                        var displayMessage = data.replace(/"/g, "").split('|');
                        //callSweetAlertSuccess(displayMessage[1]);

                        var displayMessage = data.replace(/"/g, "").split('|');
                        //callSweetAlertSuccess(displayMessage[1]);
                        var arrMessages = displayMessage[1].split(',');
                        var dataRefund = arrMessages[0].split(':');
                        var dataBalance = arrMessages[1].split(':');
                        var popuphtml = "";

                        popuphtml = popuphtml + "<p><span>" + dataRefund[0] + ": </span><span class=\"main-two\">" + dataRefund[1] + "</span></p>";
                        popuphtml = popuphtml + "<p><span>" + dataBalance[0] + ": </span><span class=\"main-two\">" + dataBalance[1] + "</span></p>";

                        swal({
                            title: "Redeem Successful",
                            html: popuphtml,
                            confirmButtonText: "OK",
                            type: "success",
                            confirmButtonColor: '#3b9847',
                        });

                        $('#txtCardCodeSearch').val("");
                        $('#txtPINSearch').val("");
                        $('#txtLoad').val("");
                        $('#txtRedeem').val("");                        
                    }
                });
            }
            catch (e) {

            }
        }
        else {

            if (amount == "" || amount == "0") {
                $("#txtRedeem").css('border-bottom', errorClassBorder);
            }
            if (pin == "" || pin == "0") {
                $("#txtPINSearch").css('border-bottom', errorClassBorder);
            }
            if (cardCode == "") {
                $('#dvInner').hide();
                $("#txtCardCodeSearch").css('border-bottom', errorClassBorder);
                //$("#txtCardCodeSearch").css('border-color', '#ff4848');
                //$("#txtCardCodeSearch").css('border-width', '3px');
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

       html += "<div><i class=\"material-icons popup-material-icons\">attach_money</i><input value=\"" + FormatDecimalWithoutDollar(amount) + "\" type=\"number\" min=\"1\" step=\"any\" onKeyDown=\"if(this.value.length==10) this.value = this.value.slice(0, -1);\" id=\"txtPopupAmount\" class=\"swal2-text popup-input-amount mandatory\" style=\"padding: 5px 5px; font-size: 24px;\" placeholder=\"Amount($)\"></div>";

       html += "<div id=\"divPopupPaymentArea\">";
       html += "<div style=\"display:none;\"><i class=\"material-icons popup-material-icons\">person</i><input type=\"text\" id=\"txtPopupCCName\" class=\"swal2-text popup-input-name mandatory\" style=\"padding: 5px 5px;\" placeholder=\"Name on Card\"></div>";
       html += "<div class=\"popup-col-4\"><i class=\"material-icons popup-material-icons\">credit_card</i><input type=\"number\" min=\"1\" step=\"any\" id=\"txtPopupCCNumber\" class=\"swal2-text popup-input-ccnumber mandatory\" style=\"padding: 5px 5px;\" placeholder=\"Card Number\"  onKeyPress=\"if(this.value.length==16) return false;\"></div>";
       html += "<div class=\"popup-col-6\"><i class=\"material-icons popup-material-icons\">date_range</i><select placeholder=\"MM\" id=\"ddlPopupCCMonth\" required class=\"mandatory popup-input-month\" style=\"padding-left: 10px !important;\">";
       html += "<option value=\"\">MM</option>";
       html += "<option value=\"01\">01</option><option value=\"02\">02</option> <option value=\"03\">03</option>";
       html += "<option value=\"04\">04</option><option value=\"05\">05</option><option value=\"06\">06</option>";
       html += "<option value=\"07\">07</option><option value=\"08\">08</option><option value=\"09\">09</option>";
       html += "<option value=\"10\">10</option><option value=\"11\">11</option> <option value=\"12\">12</option></select><div class=\"popup-input-divider\">/</div>";

       html += "<select placeholder=\"YY\" id=\"ddlPopupCCYear\" required class=\"mandatory popup-input-month\"><option value=\"\">YY</option></select></div>";
       html += "<div class=\"popup-col-5\"><i class=\"material-icons popup-material-icons\">fiber_pin</i><input type=\"number\" id=\"txtPopupCCCVV\" class=\"swal2-text popup-input-cvv mandatory\" style=\"padding: 5px 5px;\" placeholder=\"CVV\" onKeyPress=\"if(this.value.length==4) return false;\"></div>";
       
       
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

    var employeePin = $('#txtCurrentUserPIN').val();

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
        //ccName != ""&& 
   else if (amount > 0 &&  ccNumber != "" && cvv != "" && expMonth != "" && expYear != "")
    {
        validated = true;
    }
    else {
        if (amount == "") {
            $("#txtPopupAmount").css('border-bottom', errorClassBorder);
        }
        //if (ccName == "") {
        //    $("#txtPopupCCName").css('border-bottom', errorClassBorder);
        //}
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
        var url = global + "/GiftCardLoadWithPaymentPIN?storeid=" + storeId + "&giftCardCode=" + encodeURIComponent(cardCode) + "&phone="
          + phone + "&amount=" + amount + "&register=" + register + "&pin=" + pin + "&ccName=" + ccName + "&ccNumber=" + ccNumber + "&cvv=" + cvv + "&expMonth=" + expMonth + "&expYear=" + expYear + "&paymentType=" + paymentType +
          "&employeePin=" + employeePin;
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

            if (data.replace(/"/g, "").toLowerCase().indexOf("payment") > -1) {
                //$('#dvInner').hide();
                var displayMessage = data.replace(/"/g, "").split('|');
                $("#giftcardPayment #popuperror").show();
                $("#giftcardPayment #popuperror").html(displayMessage[1]);
                //callSweetAlertWarning(displayMessage[1]);
            }
           else if (data.replace(/"/g, "").toLowerCase().indexOf("failed") > -1) {
                //$('#dvInner').hide();
                var displayMessage = data.replace(/"/g, "").split('|');
                $('#dvOuter').hide();
                $('#dvOuterText').html("");                                
                callSweetAlertWarning(displayMessage[1]);
                CloseGiftCardPaymentPopup();
            }
            else if (data.replace(/"/g, "").toLowerCase().indexOf("successfull") > -1) {
                //SearchGiftCard();
                CloseGiftCardPaymentPopup();
                var displayMessage = data.replace(/"/g, "").split('|');
                //callSweetAlertSuccess(displayMessage[1]);

                var displayMessage = data.replace(/"/g, "").split('|');
                //callSweetAlertSuccess(displayMessage[1]);
                var arrMessages = displayMessage[1].split(',');
                var dataRefund = arrMessages[0].split(':');
                var dataBalance = arrMessages[1].split(':');
                var popuphtml = "";

                popuphtml = popuphtml + "<p><span>" + dataRefund[0] + ": </span><span class=\"main-two\">" + dataRefund[1] + "</span></p>";
                popuphtml = popuphtml + "<p><span>" + dataBalance[0] + ": </span><span class=\"main-two\">" + dataBalance[1] + "</span></p>";

                swal({
                    title: "Load Successful",
                    html: popuphtml,
                    confirmButtonText: "OK",
                    type: "success",
                    confirmButtonColor: '#3b9847',
                });


                $('#txtCardCodeSearch').val("");
                $('#txtPINSearch').val("");
                $('#txtLoad').val("");
                $('#txtRedeem').val("");
                
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
    $("#txtCardCodeSearch").css('border-bottom', bottomBorder);
    $("#txtPINSearch").css('border-bottom', bottomBorder);
    var storeId = SetStoreId();
    var cardCode = $("#txtCardCodeSearch").val().trim();
    var pin = $("#txtPINSearch").val();
    if (pin == '') {
        pin = '0';
    }
    if (cardCode != "" && pin != "" && pin != "0") {
        var html = "<div class=\"popup-content-area\"><h2 class=\"popup-title\"><span style=\"font-size:18px;\">Refund Gift Card - <span style=\"font-weight:600;font-size: 20px;\">" + cardCode + "</span></span></h2>";
        html += "<h4 id=\"popuperror\" style=\"font-weight:400;color:#ff4848;display:none;\"></h4>";

        html += "<div><i class=\"material-icons popup-material-icons\">attach_money</i><input  type=\"number\" min=\"1\" step=\"any\" onKeyDown=\"if(this.value.length==10) this.value = this.value.slice(0, -1);\" id=\"txtPopupRefund\" class=\"swal2-text popup-input-amount mandatory\" style=\"padding: 5px 5px;\" placeholder=\"Amount($)\"></div>";
        html += "<div><i class=\"material-icons popup-material-icons\">description</i><textarea id=\"txtGCRefundReason\" class=\"swal2-textarea mandatory textarea\" maxlength=\"100\" placeholder=\"Reason\"></textarea></div>";
       


        html += "<div class=\"popup-button-area\"><button id=\"btnGCRefund\" onclick=\"RefundGiftCard();\" type=\"button\" class=\"popup-confirm-medium swal2-styled\" aria-label=\"\" ";
        html += "style=\"background-color: rgb(59, 152, 71); border-left-color: rgb(59, 152, 71); border-right-color: rgb(59, 152, 71);\">Refund</button>";
        html += "<button type=\"button\" onclick=\"CloseRefundGiftCardPopup();\" class=\"swal2-styled popup-no\" aria-label=\"\" style=\"display: inline-block; background-color: rgb(233, 88, 97);\">Cancel</button></div></div>";
        $('#giftcardRefund').html(html);
        $(".popup-overlay").show();
        $('#giftcardRefund').show();
    }
    else {
        if (pin == "" || pin == "0") {
            $("#txtPINSearch").css('border-bottom', errorClassBorder);
        }
        if (cardCode == "") {
            $("#txtCardCodeSearch").css('border-bottom', errorClassBorder);
        }
    }


}
function RefundGiftCard() {
    $("#txtPopupRefund").css('border-bottom', bottomBorder);
    $("#txtGCRefundReason").css('border-bottom', bottomBorder);
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
    if (reason != "" && amount != "" && Number(amount) > 0 && pin != "" && pin != "0") {
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
            url = global + "/GiftCardRefundNew?storeid=" + storeId + "&giftCardCode=" + encodeURIComponent(cardCode) + "&phone=" + phone + "&amount=" + amount + "&pin=" + pin + "&reason=" + encodeURIComponent(reason) + "&register=" + register;
            var totalHistoryAmount = 0;
            $.getJSON(url, function (data) {
                $('#btnGCRefund').css({ "width": "111px" })
                $('#btnGCRefund').text("Refund");
                $("#txtCardCodeSearch").css('border-bottom', bottomBorder);
                $("#txtPopupRefund").css('border-bottom', bottomBorder);
                $("#txtPhoneSearch").css('border-bottom', bottomBorder);
                if (data.replace(/"/g, "").toLowerCase().indexOf("failed") > -1) {
                    $('#tblRedeemHistory tbody').html("");
                    $('#dvInner').hide();
                    $('#dvOuter').hide();
                    //$("#popuperror").show();
                    var displayMessage = data.replace(/"/g, "").split('|');
                    callSweetAlertWarning(displayMessage[1]);
                    CloseRefundGiftCardPopup();
                }
                else if (data.replace(/"/g, "").toLowerCase().indexOf("successfull") > -1) {
                    //SearchGiftCard();
                    CloseRefundGiftCardPopup();
                    var displayMessage = data.replace(/"/g, "").split('|');
                    //callSweetAlertSuccess(displayMessage[1]);
                    var arrMessages = displayMessage[1].split(',');
                    var dataRefund = arrMessages[0].split(':');
                    var dataBalance = arrMessages[1].split(':');
                    var popuphtml = "";

                    popuphtml = popuphtml + "<p><span>" + dataRefund[0] + ": </span><span class=\"main-two\">" + dataRefund[1] + "</span></p>";
                    popuphtml = popuphtml + "<p><span>" + dataBalance[0] + ": </span><span class=\"main-two\">" + dataBalance[1] + "</span></p>";

                    swal({
                        title: "Refunded Successfully.",
                        html: popuphtml,
                        confirmButtonText: "OK",
                        type: "success",
                        confirmButtonColor: '#3b9847',
                    });

                    $('#txtCardCodeSearch').val("");
                    $('#txtPINSearch').val("");
                    $('#txtLoad').val("");
                    $('#txtRedeem').val("");
                }
            });

        }
        catch (e) {

        }
    }
    else {
        if (amount == "" || amount == "0") {
            $("#txtPopupRefund").css('border-bottom', errorClassBorder);
        }
        if (reason == "") {
            $("#txtGCRefundReason").css('border-bottom', errorClassBorder);
        }
        if (pin == "" || pin == "0") {
            $("#txtPINSearch").css('border-bottom', errorClassBorder);
        }
        if (cardCode == "") {
            $("#txtCardCodeSearch").css('border-bottom', errorClassBorder);
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
                    buttonHTML += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></button>";
                    buttonHTML += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    buttonHTML += "<a onclick=\"ChangePopupGiftCardOrderStatusById('Complete'," + value.ID + "," + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    buttonHTML += "<a  onclick=\"ChangePopupGiftCardOrderStatusById('PickedUp'," + value.ID + "," + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    buttonHTML += "<a  onclick=\"ChangePopupGiftCardOrderStatusById('Shipped'," + value.ID + "," + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                    buttonHTML += "</div>";
                    buttonHTML += "</div>";
                }
                else if (value.ORDERSTATUSID.toLowerCase() == "shipped") {
                    // html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></div>";
                    buttonHTML += "<div class=\"dropdown\" id=\"popupgiftcardstatus_" + value.ID + "\">";
                    buttonHTML += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/></button>";
                    buttonHTML += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
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
                    buttonHTML += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></button>";
                    buttonHTML += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
                    buttonHTML += "<a onclick=\"ChangePopupGiftCardOrderStatusById('Complete'," + value.ID + "," + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Complete</span></a>";
                    buttonHTML += "<a  class=\"status-disabled\" onclick=\"HideStatusChangeDropdown(" + value.ID + ");\" id=\"btnPickedUp_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/><span class=\"custom-dropdown-span\"> Picked Up</span></a>";
                    buttonHTML += "<a  onclick=\"ChangePopupGiftCardOrderStatusById('Shipped'," + value.ID + "," + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/> <span class=\"custom-dropdown-span\">Shipped</span></a>";
                    buttonHTML += "</div>";
                    buttonHTML += "</div>";
                }
                else if (value.ORDERSTATUSID.toLowerCase() == "complete") {
                    //html += "<div class=\"order-status-icon\" id=\"carryoutstatus_" + value.ID + "\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                    buttonHTML += "<div class=\"dropdown\" id=\"popupgiftcardstatus_" + value.ID + "\">";
                    buttonHTML += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + value.ID + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                    buttonHTML += "<div id=\"myDropdown_" + value.ID + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + value.ID + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
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
                    buttonHTMLPopup += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + giftCardId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></button>";
                    buttonHTMLPopup += "<div id=\"myDropdown_" + giftCardId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + giftCardId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
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
                    buttonHTMLPopup += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + giftCardId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/></button>";
                    buttonHTMLPopup += "<div id=\"myDropdown_" + giftCardId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + giftCardId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
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
                    buttonHTMLPopup += "<button id=\"btnStatusChange\" onclick=\"myFunction(" + giftCardId + ")\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></button>";
                    buttonHTMLPopup += "<div id=\"myDropdown_" + giftCardId + "\" class=\"dropdown-content\"><div onclick=\"HidePopupStatusChangeDropdown(" + giftCardId + ");\" id =\"close_status_dropdown\" class=\"close_status_dropdown\">X</div>";
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

//Gift Card Check Balance
function CheckGiftCardBalance() {

    $("#txtRedeem").css('border-bottom', bottomBorder)
    $("#txtLoad").css('border-bottom', bottomBorder)
    $("#txtCardCodeSearch").css('border-bottom', bottomBorder);
    $("#txtPINSearch").css('border-bottom', bottomBorder);
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
        if (cardCode != "" && pin != "" && pin != "0") {

            $("#txtCardCodeSearch").css('border-bottom', bottomBorder);
            $("#txtPhoneSearch").css('border-bottom', bottomBorder);
            $("#txtRedeem").css('border-bottom', bottomBorder);
            $("#txtLoad").css('border-bottom', bottomBorder);
            $("#txtPINSearch").css('border-bottom', bottomBorder);
            $('#dvOuter').show();
            $('#dvOuterText').html("");
            $('#hdnSearchCardType').val("");
            try {
                var url = global + "/SearchGiftCardNew?storeid=" + storeId + "&giftCardCode=" + encodeURIComponent(cardCode) + "&pin=" + pin;
                //alert(url);
                $('#tblRedeemHistory tbody').html("");
                var totalHistoryAmount = 0;
                $.getJSON(url, function (data) {
                    console.log(data);
                    $('#tblRedeemHistory tbody').html("");
                    //console.log(data);
                    //console.log(data.replace(/"/g, "").indexOf("Invalid Card Code."));
                    if (data.replace(/"/g, "").toLowerCase().indexOf("failed") > -1) {
                        var displayMessage = data.replace(/"/g, "").split('|');
                        callSweetAlertWarning(displayMessage[1]);
                    }
                    else if (data.replace(/"/g, "").toLowerCase().indexOf("successfull") > -1) {
                        var displayMessage = data.replace(/"/g, "").split('|');
                        //callSweetAlertSuccess(displayMessage[1]);

                        var displayMessage = data.replace(/"/g, "").split('|');
                        //callSweetAlertSuccess(displayMessage[1]);
                        var dataBalance = displayMessage[1].split(':');
                        //var dataBalance = arrMessages[1].split(':');
                        var popuphtml = "";

                        popuphtml = popuphtml + "<p><span>" + dataBalance[0] + ": </span><span class=\"main-two\">" + dataBalance[1] + "</span></p>";

                        swal({
                            title: "",
                            html: popuphtml,
                            confirmButtonText: "OK",
                            type: "success",
                            confirmButtonColor: '#3b9847',
                        });


                    }
                });
            }
            catch (e) {

            }
        }
        else {
            $('#dvInner').hide();
            if (pin == "" || pin == "0") {
                $("#txtPINSearch").css('border-bottom', errorClassBorder);
            }
            if(cardCode == "") {
                $("#txtCardCodeSearch").css('border-bottom', errorClassBorder);
            }            
        }
    }
    else {
        window.location.href = "index.html";
    }

}

//Deactive Gift Card
function OpenGiftCardDeactivePopup() {
    var storeId = SetStoreId();
    var cardCode = $("#txtCardCodeSearch").val().trim();
    if (cardCode != "") {
        var html = "<div class=\"popup-content-area\"><h2 class=\"popup-title\"><span style=\"font-size:18px;\">Deactivate Gift Card - <span style=\"font-weight:600;font-size: 20px;\">" + cardCode + "</span></span></h2>";
        html += "<h4 id=\"popuperror\" style=\"font-weight:400;color:#ff4848;display:none;\"></h4>";

        html += "<div><i class=\"material-icons popup-material-icons\">description</i><textarea id=\"txtDeactiveReason\" class=\"swal2-textarea mandatory textarea\" maxlength=\"100\" placeholder=\"Reason\"></textarea></div>";



        html += "<div class=\"popup-button-area\"><button id=\"btnGCDeactive\" onclick=\"DeactiveGiftCard();\" type=\"button\" class=\"popup-confirm-medium swal2-styled\" aria-label=\"\" ";
        html += "style=\"background-color: rgb(59, 152, 71); border-left-color: rgb(59, 152, 71); border-right-color: rgb(59, 152, 71);\">Deactivate</button>";
        html += "<button type=\"button\" onclick=\"CloseDeactiveGiftCardPopup();\" class=\"swal2-styled popup-no\" aria-label=\"\" style=\"display: inline-block; background-color: rgb(233, 88, 97);\">Cancel</button></div></div>";
        $('#giftcardRefund').html(html);
        $(".popup-overlay").show();
        $('#giftcardRefund').show();
    }
    else {

        $("#txtCardCodeSearch").css('border-bottom', errorClassBorder);
    }    
}

function CloseDeactiveGiftCardPopup() {
    $('#giftcardRefund').html("");
    $(".popup-overlay").hide();
    $('#giftcardRefund').hide();
}


function DeactiveGiftCard() {

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
        var reason = $('#txtDeactiveReason').val();

        if (phone == '') {
            phone = '0';
        }
        var pin = $("#txtPINSearch").val();
        if (pin == '') {
            pin = '0';
        }
        if (cardCode != "" && reason != "") {

            $("#txtCardCodeSearch").css('border-bottom', bottomBorder);
            $("#txtPhoneSearch").css('border-bottom', bottomBorder);
            $("#txtRedeem").css('border-bottom', bottomBorder);
            $("#txtLoad").css('border-bottom', bottomBorder);
            $("#txtPINSearch").css('border-bottom', bottomBorder);
            $("#txtDeactiveReason").css('border-bottom', bottomBorder);
            $('#dvOuter').show();
            $('#dvOuterText').html("");
            $('#hdnSearchCardType').val("");
            try {
                var url = global + "/DeactiveGiftCard?storeid=" + storeId + "&giftCardCode=" + encodeURIComponent(cardCode) + "&pin=" + pin + "&reason=" + reason;
                //alert(url);
                $('#tblRedeemHistory tbody').html("");
                var totalHistoryAmount = 0;
                $.getJSON(url, function (data) {
                    console.log(data);
                    $('#tblRedeemHistory tbody').html("");
                    //console.log(data);
                    //console.log(data.replace(/"/g, "").indexOf("Invalid Card Code."));
                    if (data.replace(/"/g, "").toLowerCase().indexOf("failed") > -1) {
                        var displayMessage = data.replace(/"/g, "").split('|');
                        callSweetAlertWarning(displayMessage[1]);
                        CloseDeactiveGiftCardPopup();
                    }
                    else if (data.replace(/"/g, "").toLowerCase().indexOf("successfull") > -1) {
                        var displayMessage = data.replace(/"/g, "").split('|');
                        callSweetAlertSuccess(displayMessage[1]);
                        CloseDeactiveGiftCardPopup();
                    }
                });
            }
            catch (e) {

            }
        }
        else {
            //$('#dvInner').hide();
            if (reason == "") {
                $("#txtDeactiveReason").css('border-bottom', errorClassBorder);
            }
            if (cardCode == "") {
                $("#txtCardCodeSearch").css('border-bottom', errorClassBorder);
            }            
        }
    }
    else {
        window.location.href = "index.html";
    }

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
function ShowGiftCardAdvancedSection() {

        $('#liExpirationDate').show();
        $('#liValidStores').show();
        $('#liValidStoresList').show();
        $('#hdnShowHideValue').val("hide");

        var storeId = 0;
        storeId = SetStoreId();
        $('#dvValidStoreInner').html("");
        if (Number(storeId) > 0) {

            url = global + "/GetGiftCardsRelatedStores?storeid=" + storeId;

            try {
                $.getJSON(url, function (data) {
                    console.log(data);
                    var obj = JSON.parse(data);
                    var length = Object.keys(obj).length;
                    if (JSON.parse(data).indexOf("No Store(s) found.") < 0) {
                        var count = 0;
                        $.each(JSON.parse(data), function (index, value) {

                            var storeName = value.Name;
                            var storeIdValue = value.Id;
                            var relatedStores = value.RelatedStores;
                            if (relatedStores != "" && relatedStores != null)
                            {
                                var html = "<div class=\"timing-flex-column-container item-media-section\">";//First Div
                                html += "<i class=\"material-icons material-icons-left\"></i>";

                                html += "<label class=\"item-checkbox item-content\" style=\"margin-top: 0px; width: 100% !important;\">";
                                html += "<input type=\"checkbox\" name=\"checkValidStore\" value=\"" + storeIdValue + "\">";
                                html += "<i class=\"icon icon-checkbox\"></i>";
                                html += "<div class=\"item-inner\"><div class=\"item-title\">" + storeName + "</div></div>";
                                html += "</label>";

                                html += "</div>";
                                $("#dvValidStoreInner").append(html);
                            }                            
                        });
                    }
                    else {
                        var html = "<div class=\"order-list list-empty-label-text\">No Store</div>";
                        $("#dvValidStoreInner").html(html);
                    }
                });
            }
            catch (e) {

            }
        }
        else {
            self.app.router.navigate('/login_new/', { reloadCurrent: true });
        }
    
}

function HideGiftCardAdvancedSection(){
    $('#liExpirationDate').hide();
    $('#liValidStores').hide();
    $('#liValidStoresList').hide();
}


function OpenCalender() {
    $('#txtExpirationDate').addClass("input-with-value");
    $('#txtExpirationDate').prop('type', 'date');
    $('#phExpirationDate').hide();
}
//GiftCard Redeem End

//Reward Start
//Reward Start
function SearchReward() {
        
    $("#reward_LoadRedeem #txtLoad_LoadRedeem").css('border-bottom', bottomBorder);
    $("#reward_LoadRedeem #txtRedeem_LoadRedeem").css('border-bottom', bottomBorder);
    $('#reward_LoadRedeem #btnLoadReward').text("Load");
    $('#reward_LoadRedeem #btnRedeemReward').text("Redeem");
    $('#dvOuter').hide();


    var storeId = 0;
    storeId = SetStoreId();
    var memberId = $('#reward_LoadRedeem #txtMemberID_LoadRedeem').val().trim();
    var phone = $('#reward_LoadRedeem #txtPhone_LoadRedeem').val().trim();
    var name = $("#reward_LoadRedeem #txtLastName_LoadRedeem").val().trim();
    var pin = $("#reward_LoadRedeem #txtPIN_LoadRedeem").val().trim();
   
    if (memberId != "" || (phone != "" && phone != '0' )) {
        $("#txtLastName_LoadRedeem").css('border-bottom', bottomBorder);
        $("#txtPhone_LoadRedeem").css('border-bottom', bottomBorder);
        $("#reward_LoadRedeem #txtPIN_LoadRedeem").css('border-bottom', bottomBorder);
        //alert('2');
        try {
            //if (memberId != "") {
            //    phone = "";
            //    lastName = "";
            //}

            url = global + "/SearchRewardPoint?storeid=" + storeId + "&memberId=" + memberId + "&pin=" + pin + "&phone=" + phone + "&name=" + encodeURIComponent(name);

            $('#tblRewardHistory tbody').html("");
            $.getJSON(url, function (data) {
                console.log('data: ' + data);
                $('#tblRewardHistory tbody').html("");
                
                if (data.replace(/"/g, "").indexOf("Invalid Member ID.") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').hide();
                   
                    callSweetAlertWarning("Reward Member not found.");
                    $('#btnLoadReward').addClass("disabled");
                    $('#btnRedeemReward').addClass("disabled");
                }
                else if (data.replace(/"/g, "").indexOf("Message:") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').hide();
                    var message = (data.replace(/"/g, "").replace("Message: ", ""));
                    callSweetAlertWarning(message);
                    //callSweetAlertWarning("Gift Card is NOT Active. Please call (614)356-8000 to activate the Card.");
                    $('#btnLoadReward').addClass("disabled");
                    $('#btnRedeemReward').addClass("disabled");
                }
                else if (data.replace(/"/g, "").indexOf("Reward Member is not active.") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').hide();

                    callSweetAlertWarning("Reward Member is inactive. Please call (614)356-8000 for support.");
                    $('#btnLoadReward').addClass("disabled");
                    $('#btnRedeemReward').addClass("disabled");
                }
                else if (data.replace(/"/g, "").indexOf("Invalid PIN.") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').hide();

                    $("#reward_LoadRedeem #txtPIN_LoadRedeem").css('border-bottom', errorClassBorder);
                    callSweetAlertWarning("Reward Member ID and PIN do not match.");
                    $('#btnLoadReward').addClass("disabled");
                    $('#btnRedeemReward').addClass("disabled");
                }
                else if (data.replace(/"/g, "").indexOf("PIN is required.") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').hide();

                    $("#reward_LoadRedeem #txtPIN_LoadRedeem").css('border-bottom', errorClassBorder);
                    //callSweetAlertWarning("Reward Member ID and PIN do not match.");
                    $('#btnLoadReward').addClass("disabled");
                    $('#btnRedeemReward').addClass("disabled");
                }
                else if (data.replace(/"/g, "").indexOf("Invalid Phone.") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').hide();

                    $("#reward_LoadRedeem #txtPhone_LoadRedeem").css('border-bottom', errorClassBorder);
                    callSweetAlertWarning("Reward Member ID and Phone do not match.");
                    $('#btnLoadReward').addClass("disabled");
                    $('#btnRedeemReward').addClass("disabled");
                }
                else if (data.replace(/"/g, "").indexOf("Phone is required.") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').hide();

                    $("#reward_LoadRedeem #txtPhone_LoadRedeem").css('border-bottom', errorClassBorder);
                    //callSweetAlertWarning("Reward Member ID and PIN do not match.");
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
                                if (value.CustomerName != "") {
                                    firstName = value.CustomerName;
                                }
                                //if (value.LASTNAME != "") {
                                //    lastName = value.LASTNAME;
                                //}
                                if (value.CustomerEmail != "") {
                                    if (value.CustomerEmail.indexOf('@bistroux.com') < 0) {
                                        email = value.CustomerEmail;
                                    }
                                }
                                if (value.CustomerPhone != "") {
                                    phoneNumber = value.CustomerPhone;
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
                                    //$("#txtPhone_LoadRedeem").val(phoneNumber);
                                }
                                $("#txtLastName_LoadRedeem").val(firstName);
                                
                                $('#lblName').html(firstName);
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
    
        callSweetAlertWarning("Please enter Member ID with Phone or PIN.");
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
    var loggedInUserId = 0;
    loggedInUserId = window.localStorage.getItem("CustomerId");
    var memberId = $('#txtMemberID_LoadRedeem').val();
    var phone = $('#txtPhone_LoadRedeem').val();
    if (phone == '') {
        phone = '0';
    }
    var loadPoint = $('#txtLoad_LoadRedeem').val();
    loadPoint = Math.abs(loadPoint);
    if (loadPoint == '')
        loadPoint = '0';
    var pin = $("#reward_LoadRedeem #txtPIN_LoadRedeem").val().trim();

    if (memberId != "" && loadPoint != "" && loadPoint != "0") {
        $('#btnLoadReward').text("Loading...");
        //$("#txtMemberID_LoadRedeem").css('border-bottom', bottomBorder);
        $("#txtLoad_LoadRedeem").css('border-bottom', bottomBorder);
        $("#txtRedeem_LoadRedeem").css('border-bottom', bottomBorder);
        
        try {
            //url = global + "/RewardLoad?storeid=" + storeId + "&rewardMemberId=" + memberId + "&phone=" + phone + "&loadPoint=" + loadPoint;
            url = global + "/RewardLoadRedeem?storeid=" + storeId + "&memberId=" + memberId + "&pin=" + pin + "&phone=" + phone + "&loadPoint=" + loadPoint + "&type=Load" + "&createdBy=" + loggedInUserId;
            //alert(url);
            $.getJSON(url, function (data) {
                $('#btnLoadReward').text("Load");
                //alert(data);
                if (data.replace(/"/g, "").indexOf("Invalid Member ID.") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').hide();

                    callSweetAlertWarning("Reward Member not found.");
                    $('#btnLoadReward').addClass("disabled");
                    $('#btnRedeemReward').addClass("disabled");
                }
                if (data.replace(/"/g, "").indexOf("Message:") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').hide();
                    var message = (data.replace(/"/g, "").replace("Message: ", ""));
                    callSweetAlertWarning(message);
                    //callSweetAlertWarning("Gift Card is NOT Active. Please call (614)356-8000 to activate the Card.");
                    $('#btnLoadReward').addClass("disabled");
                    $('#btnRedeemReward').addClass("disabled");
                }
                else if (data.replace(/"/g, "").indexOf("Reward Member is not active.") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').hide();

                    callSweetAlertWarning("Reward Member is inactive. Please call (614)356-8000 for support.");
                    $('#btnLoadReward').addClass("disabled");
                    $('#btnRedeemReward').addClass("disabled");
                }
                else if (data.replace(/"/g, "").indexOf("Invalid PIN.") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').hide();

                    $("#reward_LoadRedeem #txtPIN_LoadRedeem").css('border-bottom', errorClassBorder);
                    callSweetAlertWarning("Reward Member ID and PIN do not match.");
                    $('#btnLoadReward').addClass("disabled");
                    $('#btnRedeemReward').addClass("disabled");
                }
                else if (data.replace(/"/g, "").indexOf("PIN is required.") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').hide();

                    $("#reward_LoadRedeem #txtPIN_LoadRedeem").css('border-bottom', errorClassBorder);
                    //callSweetAlertWarning("Reward Member ID and PIN do not match.");
                    $('#btnLoadReward').addClass("disabled");
                    $('#btnRedeemReward').addClass("disabled");
                }
                else if (data.replace(/"/g, "").indexOf("Invalid Phone.") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').hide();

                    $("#reward_LoadRedeem #txtPhone_LoadRedeem").css('border-bottom', errorClassBorder);
                    callSweetAlertWarning("Reward Member ID and Phone do not match.");
                    $('#btnLoadReward').addClass("disabled");
                    $('#btnRedeemReward').addClass("disabled");
                }
                else if (data.replace(/"/g, "").indexOf("Phone is required.") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').hide();

                    $("#reward_LoadRedeem #txtPhone_LoadRedeem").css('border-bottom', errorClassBorder);
                    //callSweetAlertWarning("Reward Member ID and PIN do not match.");
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
    var loggedInUserId = 0;
    loggedInUserId = window.localStorage.getItem("CustomerId");
    var memberId = $('#txtMemberID_LoadRedeem').val();
    var phone = $('#txtPhone_LoadRedeem').val();
    if (phone == '') {
        phone = '0';
    }
    var redeemPoint = $('#txtRedeem_LoadRedeem').val();
    redeemPoint = Math.abs(redeemPoint);
    if (redeemPoint == '')
        redeemPoint = '0';
    var pin = $("#reward_LoadRedeem #txtPIN_LoadRedeem").val().trim();

    if (memberId != "" && redeemPoint != "" && redeemPoint != "0") {
        var hdnCurrentStorePoints = $('#hdnCurrentStorePoints').val();
        //alert(hdnCurrentStorePoints);
        //alert(redeemPoint);
        if (parseInt(redeemPoint) <= parseInt(hdnCurrentStorePoints)) {

            $('#btnRedeemReward').text("Redeeming...");
            //$('#btnRedeemReward').css("font-size", "22px");
            try {
                //url = global + "/RewardRedeem?storeid=" + storeId + "&rewardMemberId=" + memberId + "&phone=" + phone + "&redeemPoint=" + redeemPoint;
                url = global + "/RewardLoadRedeem?storeid=" + storeId + "&memberId=" + memberId + "&pin=" + pin + "&phone=" + phone + "&loadPoint=" + redeemPoint + "&type=Redeem" + "&createdBy=" + loggedInUserId;
                //alert(url);
                $.getJSON(url, function (data) {
                    $('#btnRedeemReward').text("Redeem");
                    //$('#btnRedeemReward').css("font-size", "24px");
                    //alert(data);
                    if (data.replace(/"/g, "").indexOf("Invalid Member ID.") > -1) {
                        $('#dvInner_Reward').hide();
                        $('#dvOuter').hide();

                        callSweetAlertWarning("Reward Member not found.");
                        $('#btnLoadReward').addClass("disabled");
                        $('#btnRedeemReward').addClass("disabled");
                    }
                    else if (data.replace(/"/g, "").indexOf("Message:") > -1) {
                        $('#dvInner_Reward').hide();
                        $('#dvOuter').hide();
                        var message = (data.replace(/"/g, "").replace("Message: ", ""));
                        callSweetAlertWarning(message);
                        $('#reward_LoadRedeem #btnLoadReward').addClass("disabled");
                        $('#reward_LoadRedeem #btnRedeemReward').addClass("disabled");
                        $("#txtLoad_LoadRedeem").css('border-bottom', bottomBorder);
                        $("#txtRedeem_LoadRedeem").css('border-bottom', bottomBorder);
                    }
                    else if (data.replace(/"/g, "").indexOf("Reward Member is not active.") > -1) {
                        $('#dvInner_Reward').hide();
                        $('#dvOuter').hide();

                        callSweetAlertWarning("Reward Member is inactive. Please call (614)356-8000 for support.");
                        $('#btnLoadReward').addClass("disabled");
                        $('#btnRedeemReward').addClass("disabled");
                    }
                    else if (data.replace(/"/g, "").indexOf("Invalid PIN.") > -1) {
                        $('#dvInner_Reward').hide();
                        $('#dvOuter').hide();

                        $("#reward_LoadRedeem #txtPIN_LoadRedeem").css('border-bottom', errorClassBorder);
                        callSweetAlertWarning("Reward Member ID and PIN do not match.");
                        $('#btnLoadReward').addClass("disabled");
                        $('#btnRedeemReward').addClass("disabled");
                    }
                    else if (data.replace(/"/g, "").indexOf("PIN is required.") > -1) {
                        $('#dvInner_Reward').hide();
                        $('#dvOuter').hide();

                        $("#reward_LoadRedeem #txtPIN_LoadRedeem").css('border-bottom', errorClassBorder);
                        //callSweetAlertWarning("Reward Member ID and PIN do not match.");
                        $('#btnLoadReward').addClass("disabled");
                        $('#btnRedeemReward').addClass("disabled");
                    }
                    else if (data.replace(/"/g, "").indexOf("Invalid Phone.") > -1) {
                        $('#dvInner_Reward').hide();
                        $('#dvOuter').hide();

                        $("#reward_LoadRedeem #txtPhone_LoadRedeem").css('border-bottom', errorClassBorder);
                        callSweetAlertWarning("Reward Member ID and Phone do not match.");
                        $('#btnLoadReward').addClass("disabled");
                        $('#btnRedeemReward').addClass("disabled");
                    }
                    else if (data.replace(/"/g, "").indexOf("Phone is required.") > -1) {
                        $('#dvInner_Reward').hide();
                        $('#dvOuter').hide();

                        $("#reward_LoadRedeem #txtPhone_LoadRedeem").css('border-bottom', errorClassBorder);
                        //callSweetAlertWarning("Reward Member ID and PIN do not match.");
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
                alert(e);
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
    var loggedInUserId = 0;
    loggedInUserId = window.localStorage.getItem("CustomerId");
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

        if (ValidateReward() == true) {
            var customerId = Number($("#hdnAddMemberPopupCustomerId").val());
            $("#hdnAddMemberPopupCustomerId").val(0)
            $("#btnCreate").text("Adding Member...");
            $("#btnCreate").attr("disabled", true);

            url = global + "/AddMemberID?storeid=" + storeId + "&name=" + encodeURIComponent(name) + "&email=" + encodeURIComponent(email) + "&phone=" + phone + "&points=" + points + "&memberId=" + memberId + "&createdBy=" + loggedInUserId;
            
            $.getJSON(url, function (data1) {
                console.log(data1);
                if (data1.replace(/"/g, "").indexOf("Message:") > -1) {
                    $("#btnCreate").text("Add Member");
                    $("#btnCreate").attr("disabled", false);
                    var message = (data1.replace(/"/g, "").replace("Message: ", ""));
                    callSweetAlertWarning(message);
                    //callSweetAlertWarning("Gift Card is NOT Active. Please call (614)356-8000 to activate the Card.");
                }
                else if (data1.replace(/"/g, "").indexOf("Reward Member is not active.") > -1) {
                    callSweetAlertWarning("Reward Member is NOT Active. Please call (614)356-8000 for support");
                    $("#btnCreate").text("Add Member");
                    $("#btnCreate").attr("disabled", false);
                }
                else if (data1.replace(/"/g, "").indexOf("Reward Member is active.") > -1) {
                    var messageDisplay = data1.replace(/"/g, "");
                    messageDisplay = messageDisplay.replace("Reward Member is active.", "");
                    callSweetAlertWarning(messageDisplay);
                    $("#btnCreate").text("Add Member");
                    $("#btnCreate").attr("disabled", false);
                }
                else {
                    var obj = JSON.parse(data1);
                    $.each(JSON.parse(data1), function (index, value) {
                        // console.log("1: " + value.EMAIL.toLowerCase().indexOf("bistroux.com"))
                        var popuphtml = "";
                        if (value.MemberId != "")
                            popuphtml = popuphtml + "<p><span style='color:#000;'>Member ID:  </span><span class=\"main-one\">" + value.MemberId + "</span></p>";
                        if (points != "")
                            popuphtml = popuphtml + "<p><span style='color:#000;'>Points:  </span><span class=\"main-two\">" + points + "</span></p>";
                        if (name != "") {
                            popuphtml = popuphtml + "<p>" + value.CustomerName + "</p>";
                        }
                        if (phone != "") {
                            if (value.CustomerPhone.length == 10)
                                popuphtml = popuphtml + "<p>" + FormatPhoneNumber(value.CustomerPhone) + "</p>";
                            else
                                popuphtml = popuphtml + "<p>" + value.CustomerPhone + "</p>";
                        }
                        if (email != "")
                            popuphtml = popuphtml + "<p>" + value.CustomerEmail + "</p>";

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
                        return false;

                        $("#btnCreate").text("Add Member");
                        $("#btnCreate").attr("disabled", false);
                    });
                }                
                $("#btnCreate").text("Add Member");
                $("#btnCreate").attr("disabled", false);
            });
        }
}
function UpdateMemberInfo() {

    var $$ = Dom7;
   
    var email = $("#txtEmail_Reward").val().trim();
    var name = $("#txtName_Reward").val().trim();

    var storeId = 0;
    storeId = SetStoreId();
    var valid = true;

    if (ValidateReward() == true) {

        $("#btnCreate").text("Adding Member...");
        if (memberId != "") {
            var url = global + "/CheckCustomerExistsNew?storeid=" + storeId + "&email=" + encodeURIComponent(email) + "&phone=" + phone + "&memberId=" + memberId;
            $.getJSON(url, function (data) {
                //console.log(data);

                var dd = JSON.parse(data);
                if (dd.Message != undefined && dd.Message != null && dd.Message.indexOf("Restaurant not found") > -1) {
                    callSweetAlertWarning("Restaurant not found. Please login again.");
                }
                else {
                    if (dd.CustomerExists.toString().toLowerCase() == "true") {
                        if (Number(dd.Pin) > 0) {
                            if (Number(dd.Points) > 0) {
                                swal({
                                    title: "Member is already in the system.",
                                    type: "warning",
                                    confirmButtonClass: "btn btn-danger",
                                    buttonsStyling: false,
                                    confirmButtonText: "OK",
                                    closeOnConfirm: false,
                                    customClass: 'swal-wide',
                                });
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
                            swal({
                                title: "Member is already in the system.",
                                type: "warning",
                                confirmButtonClass: "btn btn-danger",
                                buttonsStyling: false,
                                confirmButtonText: "OK",
                                closeOnConfirm: false,
                                customClass: 'swal-wide',
                            });

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
            var url = global + "/CheckCustomerExistsDB?storeid=" + storeId + "&email=" + encodeURIComponent(email)
                   + "&phone=" + phone
                  + "&name=" + encodeURIComponent(name);

            $.getJSON(url, function (data1) {
                var obj1 = JSON.parse(data1);
                //console.log('CustomerExists:' + obj1.CustomerExists);
                //console.log('ID:' + obj1.ID);
                //console.log('CustomerList:' + obj1.CustomerList);
                //console.log('NewMemberId:' + obj1.NewMemberId);
                if (obj1.CustomerExistsInSameStore == true) {
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
                        historyHTML += "<div class=\"popup-header-row\" ><div class=\"popup-col-1-header\" style=\"width:20%;\">Reward ID</div>" +
                                "<div class=\"popup-col-2-header\" style=\"width:35%;\">Name</div><div class=\"popup-col-3-header\" style=\"width:45%;\">Email</div></div>";
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
                            if (value.RewardMemberID != null)
                                historyHTML += "<div id=\"memberId_" + value.ID + "\" class=\"popup-col-1\" style=\"width:20%;font-size:18px;\">" + value.RewardMemberID + "</div>";
                            else
                                historyHTML += "<div id=\"memberId_" + value.ID + "\" class=\"popup-col-1\" style=\"width:20%;font-size:18px;\"></div>";

                            historyHTML += "<div id=\"fullName_" + value.ID + "\" class=\"popup-col-1\" style=\"width:35%;font-size:18px;\">" + fullName.trim() + "</div>";
                            if (value.EMAIL != null)
                                historyHTML += "<div id=\"email_" + value.ID + "\" class=\"popup-col-2\" style=\"width:45%;font-size:18px;\">" + value.EMAIL + "</div>";
                            else
                                historyHTML += "<div id=\"email_" + value.ID + "\" class=\"popup-col-2\" style=\"width:45%;font-size:18px;\"></div>";

                            historyHTML += "</div>";


                        });
                        var formattedPhoneNumber = phone;
                        if (phone.length == 10)
                            formattedPhoneNumber = formatPhoneNumber(phone);
                        var html = "<div class=\"popup-content-area\"><h2 class=\"popup-title\"><span style=\"font-size: 18px;\">Phone <span style=\"font-weight:600;font-size: 20px;\">" + formattedPhoneNumber + "</span> matches found:</span></h2>" +
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

                    }
                }


            });


            $$("#btnCreate").text("Add Member");
        }

    }
}
function NewCloseAndUpdateRewardMembersPopup(phone) {
    var customerId = Number($("#selectedCustomerId").val());
  
  
    if (customerId > 0) {
        var fullName = $("#fullName_" + customerId).html();
        var memberId = $("#memberId_" + customerId).html();
        var email = $("#email_" + customerId).html();
        console.log('MemberId: ' + memberId)
        console.log('email: ' + email)
        console.log('fullName: ' + fullName)
        $("#hdnAddMemberPopupCustomerId").val(customerId);
        if(memberId!="")
        {
            $("#txtEmail_Reward").val(email);
            $("#txtName_Reward").val(fullName);
            $("#txtMemberId_Reward").val(memberId);
            $("#txtPhone_Reward").val(phone);
            $("input#txtPhone_Reward").attr("disabled", "disabled");
            $("input#txtMemberId_Reward").attr("disabled", "disabled");
            $("input#txtPoints_Reward").attr("disabled","disabled");
            $$("#btnCreate").text("Update Member");
           
        }
        else {
            $("#txtEmail_Reward").val(email);
            $("#txtName_Reward").val(fullName);
            $$("#btnCreate").text("Add Member");
        }
    }
    else {
        $("#hdnAddMemberPopupCustomerId").val(0);
    }
    $('#rewardMultipleCustomers').html("");
    $(".popup-overlay").hide();
    $('#rewardMultipleCustomers').hide();
}
function NewCloseAndCreateRewardMembersPopup(phone) {
    var customerId = Number($("#selectedCustomerId").val());
   
    if(customerId>0)
    {
        $("#email_" + customerId).html();
        console.log('CustomerId: ' + customerId)
        var fullName = $("#fullName_" + customerId).html();
        var memberId = $("#memberId_"+customerId).html();
        var email = $("#email_" + customerId).html();
       
        if (memberId != undefined && memberId!=null && memberId != "")
        {
            $("#hdnAddMemberPopupCustomerId").val(0);
            $("#txtEmail_Reward").val("");
            $("#txtName_Reward").val("");
            $("#txtPhone_Reward").val("");
            $("#txtMemberId_Reward").val("");
        }
        else {
            $("#hdnAddMemberPopupCustomerId").val(customerId);
            $("#txtEmail_Reward").val(email);
            $("#txtName_Reward").val(fullName);
            $("#txtPhone_Reward").val(phone);
        }
    }
    else {
        $("#hdnAddMemberPopupCustomerId").val(0);
    }
    $('#rewardMultipleCustomers').html("");
    $(".popup-overlay").hide();
    $('#rewardMultipleCustomers').hide();
    //$("#selectedCustomerId").val("0");
}
function NewGoToLoadRedeemRewardMembersPopup(phone) {
    var customerId = Number($("#selectedCustomerId").val());

    if (customerId > 0) {
        console.log('CustomerId: ' + customerId)
        var fullName = $("#fullName_" + customerId).html();
        var memberId = $("#memberId_" + customerId).html();
        var email = $("#email_" + customerId).html();
        //console.log('MemberId: ' + memberId)
        //console.log('email: ' + email)
        //console.log('fullName: ' + fullName)
        if (memberId != undefined && memberId != null && memberId != "") {
            app.tab.show('#reward_LoadRedeem');
           $('#reward_LoadRedeem #txtMemberID_LoadRedeem').val(memberId);
           $('#reward_LoadRedeem #txtPhone_LoadRedeem').val(phone);
           if (fullName!="")
               $("#reward_LoadRedeem #txtLastName_LoadRedeem").val(fullName);

           SearchReward();
        }
        else {
            swal({
                title: "Please Create the MemberID.",
                type: "warning",
                confirmButtonClass: "btn btn-danger",
                buttonsStyling: false,
                confirmButtonText: "OK",
                closeOnConfirm: false,
                customClass: 'swal-wide',
            });
        }
    }
    else {
        $("#hdnAddMemberPopupCustomerId").val(0);
    }
    $('#rewardMultipleCustomers').html("");
    $(".popup-overlay").hide();
    $('#rewardMultipleCustomers').hide();
    //$("#selectedCustomerId").val("0");
}
function CloseAddRewardMemberPopup()
{
    $("#hdnAddMemberPopupCustomerId").val(0);
    $('#rewardMultipleCustomers').html("");
    $(".popup-overlay").hide();
    $('#rewardMultipleCustomers').hide();
}
//Reward End
//check is email or not
function isEmail(el) {

    var email = $(el).val();
    //console.log("email:" + email)

    if (email.trim() != "") {
        var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (!filter.test(email)) {
            console.log("Invalid Email Address");
            $(el).css('border-color', '#ff4848');
            $(el).css('border-width', '3px');
            return false;

        } else {

            console.log("Valid Email Address");
            $(el).css('border-color', '#dedede');
            $(el).css('border-width', '1px');
            return true;

        }
    }
    else {
        $(el).css('border-color', '#dedede');
        $(el).css('border-width', '1px');
        return true;
    }

}


//check is number or not
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
function ValidateReward() {
    var email = $("#txtEmail_Reward").val().trim();
    var phone = $("input#txtPhone_Reward").val();
    var points = $("#txtPoints_Reward").val().trim();
    var name = $("#txtName_Reward").val().trim();
    var memberId = $("#txtMemberId_Reward").val().trim();
    var valid = true;

    if (email.trim() != "") {
        var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (!filter.test(email)) {
            //console.log("Invalid Email Address");
            $("#txtEmail_Reward").css('border-bottom', errorClassBorder);
            valid = false;

        } else {

            //console.log("Valid Email Address");
            $("#txtEmail_Reward").css('border-bottom', bottomBorder);
        }
    }
    else {
        $("#txtEmail_Reward").css('border-bottom', bottomBorder);
    }

    if (phone == "") {
        $("#txtPhone_Reward").css('border-bottom', errorClassBorder);
        valid = false;
    }
    else {
        $("#txtPhone_Reward").css('border-bottom', bottomBorder);

    }

    if (points == "") {
        $("#txtPoints_Reward").css('border-bottom', errorClassBorder);
        valid = false;
    }
    else {
        $("#txtPoints_Reward").css('border-bottom', bottomBorder);
    }
    return valid;
}

function callSweetAlertWarning(message) {

    swal({
        title: message,
        type: "warning",
        confirmButtonClass: "btn btn-danger",
        buttonsStyling: false,
        confirmButtonText: "OK",
        closeOnConfirm: false,
        customClass: 'swal-wide',
    });
}

function callSweetAlertSuccess(message) {

    swal({
        title: message,
        //html: "<p><strong>Member ID:</strong>1082</p><p><strong>Name:</strong>John Smith</p><p><strong>Phone:</strong>(614)805-5665</p><p><strong>Email:</strong>cyberv1@mail.com</p><p><strong>Points:</strong>100</p>",
        //html: popuphtml,
        confirmButtonText: "OK",
        type: "success",
        confirmButtonClass: 'btn btn-success',
        buttonsStyling: false,
        customClass: 'swal-wide',
    });
}

function GotoCarryout() {
    //window.location.href = 'carryout.html';
    $('#aCarryout')[0].click();
}
function GotoGiftCards() {
    //window.location.href = 'giftcard.html';
    //$('#aGiftCard')[0].click();
    var giftCardProgramEnabled = localStorage.getItem("GiftCardProgramEnabled").trim();
    if (giftCardProgramEnabled != "" && giftCardProgramEnabled == "True") {
        $('#aGiftCard')[0].click();
    }
    else {
        GoToGiftCardOrder();
    }
}
function GotoRewards() {
    $('#aReward')[0].click();
    //window.location.href = 'rewards.html';
}

function SetStoreId() {
    var storeId = 0;
    var params = getParams();
    if (localStorage.getItem("StoreId") != null) {
        storeId = localStorage.getItem("StoreId").trim();

    }
    else if (typeof (params["StoreId"]) != "undefined") {
        storeId = params["StoreId"];
    }
    //console.log("SetStoreId(): " + storeId)
    if (storeId > 0)
        return storeId;
    else {
        self.app.router.navigate('/login_new/', { reloadCurrent: false });
    }
}
function SetCustomerId() {
    var customerId = 0;
    var params = getParams();
    if (localStorage.getItem("CustomerId") != null) {
        customerId = localStorage.getItem("CustomerId").trim();

    }
    else if (typeof (params["CustomerId"]) != "undefined") {
        customerId = params["CustomerId"];
    }

    if (customerId > 0)
        return customerId;
    else {
        self.app.router.navigate('/login_new/', { reloadCurrent: false });
    }
}

function SetManageService() {
    var storeId = 0;

    storeId = SetStoreId();
    var url = global + "/GetCarryoutStatus?storeid=" + storeId;
    try {
        $.getJSON(url, function (data) {
            $.each(JSON.parse(data), function (index, value) {
                var carryoutEnabled = value.CARRYOUTENABLED;
                var carryoutcurrentstatus = value.CARRYOUTSTATUS;
                var deliveryEnabled = value.DELIVERYENABLED;
                var deliveryCurrentStatus = value.DELIVERYSTATUS;
                var dineInEnabled = value.DINEINENABLED;

                if (dineInEnabled) {
                    $('#ulDineIn').show();
                }
                else {
                    $('#ulDineIn').hide();
                }

                if (deliveryEnabled) {
                    $('#divDeliverySection').show();
                    $('#dvManageServiceParent').css("margin-top", "45px");
                }
                else {
                    $('#divDeliverySection').hide();
                    $('#dvManageServiceParent').css("margin-top", "120px");
                }

                //if (carryoutEnabled==true)
                $("#dvCarryoutStatus").html("CARRYOUT " + carryoutcurrentstatus);
                if (carryoutcurrentstatus.toLowerCase().trim() == "running") {
                    $("#dvCarryOutStatusChange").html("<a class=\"start-btn-one\" onclick=\"ChangeCarryoutStatus(" + storeId + ",'STOPPED')\"><img src=\"./img/Stop.png\" style=\"display:block;\"></a>");
                }
                else {
                    $("#dvCarryOutStatusChange").html("<a class=\"stop-btn-one\" onclick=\"ChangeCarryoutStatus(" + storeId + ",'RUNNING')\"><img src=\"./img/Start.png\" style=\"display:block;\"></a>");
                }

                $("#dvDeliveryStatus").html("DELIVERY " + deliveryCurrentStatus);
                if (deliveryCurrentStatus.toLowerCase().trim() == "running") {
                    $("#dvDeliveryStatusChange").html("<a class=\"start-btn-one\" onclick=\"ChangeDeliveryStatus(" + storeId + ",'STOPPED')\"><img src=\"./img/Stop.png\" style=\"display:block;\"></a>");
                }
                else {
                    $("#dvDeliveryStatusChange").html("<a class=\"stop-btn-one\" onclick=\"ChangeDeliveryStatus(" + storeId + ",'RUNNING')\"><img src=\"./img/Start.png\" style=\"display:block;\"></a>");
                }
                //alert(carryoutEnabled)
                //alert(carryoutcurrentstatus)
            });
        });
    }
    catch (e) {
    }
}

/*04.04.2019*/


//Profile Section Start//
function GotoProfile() {
    self.app.router.navigate('/my_Profile/', { reloadCurrent: true });
}

function LoadProfileDetails() {
    var storeId = 0;
    storeId = SetStoreId();
    // alert(storeId)
    if (Number(storeId) > 0) {

        var url = global + "/GetStoreByStoreId?storeid=" + storeId;

        try {
            $.getJSON(url, function (data) {
                //console.log(data);
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;
                //console.log("Length: " + data);

                if (JSON.parse(data).indexOf("No record(s) found") < 0) {

                    var count = 0;
                    $.each(JSON.parse(data), function (index, value) {
                        //console.log("LoadProfileDetails: 1");
                        var name = "";
                        var description = "";
                        var address1 = "";
                        var address2 = "";
                        var city = "";
                        var state = "";
                        var zip = "";
                        var phone = "";
                        var fax = "";
                        var sendFax = false;
                        var refundPolicy = "";
                        var restaurantUrl = "";
                        var adminEmail = "";
                        var pickupLeadTime = 0;
                        var carryoutLeadTime = 0;
                        var printerName = "";
                        var hidePriceInPrint = false;
                        //console.log("LoadProfileDetails: 2");
                        if (value.RestaurantDisplayName != "") {
                            name = value.RestaurantDisplayName;
                            $("#tab-profile-info #txtProfileName").val(name);
                        }
                        //console.log("LoadProfileDetails: 3");
                        if (value.Description != "") {
                            description = value.Description;
                            $("#tab-profile-info #txtProfileDescription").val(description);
                        }
                        if (value.Address1 != "") {
                            address1 = value.Address1
                            $("#tab-profile-info #txtProfileAddress1").val(address1);
                        }
                        if (value.Address2 != "") {
                            address2 = value.Address2;
                            $("#tab-profile-info #txtProfileAddress2").val(address2);
                        }
                        if (value.City != "") {
                            city = value.City;
                            $("#tab-profile-info #txtProfileCity").val(city);
                        }
                        if (value.State != "") {
                            state = value.State;
                            if (state.length == 2) {
                                $("#tab-profile-info #ddlProfileState").val(state);
                            }
                            else {
                                $('#tab-profile-info #ddlProfileState option').map(function () {
                                    if ($(this).text() == state) return this;
                                }).attr('selected', 'selected');
                            }
                        }
                        if (value.Zip != "") {
                            zip = value.Zip;
                            $("#tab-profile-info #txtProfileZip").val(zip);
                        }
                        if (value.CompanyPhoneNumber != "") {
                            phone = value.CompanyPhoneNumber;
                            $("#tab-profile-info #txtProfilePhone").val(phone);
                        }
                        if (value.Fax != "") {
                            fax = value.Fax;
                            $("#tab-profile-info #txtProfileFax").val(fax);
                        }
                        if (value.SendFax == true) {
                            sendFax = true;
                            $("#tab-profile-info #checkSendFax").prop('checked', true)
                        }
                        else {
                            sendFax = false;
                            $("#tab-profile-info #checkSendFax").prop('checked', false)
                        }
                        if (value.RefundPolicy != "") {
                            refundPolicy = value.RefundPolicy;
                            $("#tab-profile-info #txtProfileRefundPolicy").val(refundPolicy);
                        }
                        if (value.Url != "") {
                            restaurantUrl = value.Url;
                            $("#tab-profile-info #txtProfileRestaurantURL").val(restaurantUrl);
                        }
                        if (value.FullAdminEmail != "") {
                            $("#tab-profile-info #hdnFullAdminEmail").val(value.FullAdminEmail);
                        }
                        if (value.AdminEmail != "") {
                            adminEmail = value.AdminEmail;
                            $("#tab-profile-info #txtProfileAdminEmail").val(adminEmail);
                        }
                        if (value.PickupLeadTimeInMinutes > 0) {
                            pickupLeadTime = value.PickupLeadTimeInMinutes;
                            if (pickupLeadTime > 0) {
                                $("#tab-profile-info #ddlProfilePickupLeadTime").val(pickupLeadTime);
                            }
                        }
                        if (value.CarryOutLeadTimeInMinutes > 0) {
                            carryoutLeadTime = value.CarryOutLeadTimeInMinutes;
                            if (carryoutLeadTime > 0) {
                                $("#tab-profile-info #ddlProfileCarryOutLeadTime").val(carryoutLeadTime);
                            }
                        }

                        if (value.HidePriceInPrint == true) {
                            hidePriceInPrint = true;
                            $("#tab-profile-info #checkHidePrice").prop('checked', true);
                        }
                        else {
                            hidePriceInPrint = false;
                            $("#tab-profile-info #checkHidePrice").prop('checked', false);
                        }
                        if(value.PrinterName != "")
                        {
                            printerName = value.PrinterName;
                            $("#tab-profile-info #txtprinterName").val(printerName);
                        }


                        //console.log("Name: " + name + " Description: " + description + " Address1: " + address1 + " Address2: " + address2 + " City: " + city + " State: " + state + " Zip: " + zip + " Phone: " + phone + " Fax: " + fax +
                        //" SendFax: " + sendFax + " Refund Policy: " + refundPolicy + " Restaurnat Url: " + restaurantUrl + " Admin Eamil: " + adminEmail + " P Lead Time: " + pickupLeadTime + " C Lead Time: " + carryoutLeadTime);

                    });

                }
                else {
                    // console.log("LoadProfileDetails: 4");
                }
            });
        }
        catch (e) {
        }
    }
    else {
        self.app.router.navigate('/login_new/', { reloadCurrent: true });
    }
}

function SaveStoreInfo() {
    var storeId = 0;
    storeId = SetStoreId();
    var restaurantDisplayName = $("#txtProfileName").val();
    var description = $("#txtProfileDescription").val();
    var address1 = $("#txtProfileAddress1").val();
    var address2 = $("#txtProfileAddress2").val();
    var city = $("#txtProfileCity").val();
    var state = $("#ddlProfileState").val();
    var zip = $("#txtProfileZip").val();
    var phone = $("#txtProfilePhone").val();
    var fax = $("#txtProfileFax").val();
    var sendFax = false;
    if ($("#checkSendFax").prop("checked") == true) {
        sendFax = true;
    }
    var refundPolicy = $("#txtProfileRefundPolicy").val();
    var restaurantUrl = $("#txtProfileRestaurantURL").val();
    var fullAdminEmail = $("#hdnFullAdminEmail").val();
    var adminEmail = $("#txtProfileAdminEmail").val();
    var pickupLeadTime = $("#ddlProfilePickupLeadTime").val();
    var carryoutLeadTime = $("#ddlProfileCarryOutLeadTime").val();
    var hidePriceInPrint = false;
    if ($("#checkHidePrice").prop("checked") == true) {
        hidePriceInPrint = true;
    }
    var printerName = $('#txtprinterName').val();
    var isValid = false;
    isValid = ValidateStoreInfo(restaurantDisplayName, address1, city, state, zip, phone, fax, restaurantUrl, adminEmail, pickupLeadTime, carryoutLeadTime);
    //alert(isValid);
    if ((Number(storeId) > 0)) {
        if (isValid) {
            $('#txtProfileName').css('border-bottom', bottomBorder);
            $('#txtProfileAddress1').css('border-bottom', bottomBorder);
            $('#txtProfileCity').css('border-bottom', bottomBorder);
            $('#ddlProfileState').css('border-bottom', bottomBorder);
            $('#txtProfileZip').css('border-bottom', bottomBorder);
            $('#txtProfilePhone').css('border-bottom', bottomBorder);
            $("#txtProfileFax").css('border-bottom', bottomBorder);
            $('#txtProfileRestaurantURL').css('border-bottom', bottomBorder);
            $('#txtProfileAdminEmail').css('border-bottom', bottomBorder);
            $('#ddlProfilePickupLeadTime').css('border-bottom', bottomBorder);
            $('#ddlProfileCarryOutLeadTime').css('border-bottom', bottomBorder);

            var model = new Object();
            model.StoreId = storeId;
            model.RestaurantDisplayName = restaurantDisplayName;
            model.Description = description;
            model.Address1 = address1;
            model.Address2 = address2;
            model.City = city;
            model.State = state;
            model.Zip = zip;
            model.Phone = phone;
            model.Fax = fax;
            if (sendFax == true) {
                model.SendFax = true;
            }
            else {
                model.SendFax = false;
            }
            model.RefundPolicy = refundPolicy;
            model.RestaurantUrl = restaurantUrl;
            model.FullAdminEmail = fullAdminEmail;
            model.AdminEmail = adminEmail;
            if (pickupLeadTime > 0) {
                model.PickupLeadTimeInMinutes = pickupLeadTime;
            }
            else {
                model.PickupLeadTimeInMinutes = 0;
            }
            if (carryoutLeadTime > 0) {
                model.CarryoutLeadTimeInMinutes = carryoutLeadTime;
            }
            else {
                model.CarryoutLeadTimeInMinutes = 0;
            }
            model.PrinterName = printerName;
            if (hidePriceInPrint == true) {
                model.HidePriceInPrint = true;
            }
            else {
                model.HidePriceInPrint = false;
            }

            try {
                $.post(global + "/SaveStoreInfoNew", model, function (data) {
                    console.log(data.indexOf("Successful"));
                    if (printerName != "") {
                        localStorage.setItem("PrinterName", printerName);
                    }
                    localStorage.setItem("HidePriceInPrint", hidePriceInPrint);
                    //LoadProfileDetails();
                    if (data.indexOf("Successful") > -1) {
                        swal({
                            title: "Profile info saved successfully.",
                            confirmButtonText: "OK",
                            type: "success",
                            confirmButtonClass: 'btn btn-success',
                            buttonsStyling: false,
                            customClass: 'swal-wide',
                        });
                    }
                });
            }
            catch (e) {
            }
        }
    }
    else {
        self.app.router.navigate('/login_new/', { reloadCurrent: true });
    }
}

function ValidateStoreInfo(restaurantDisplayName, address1, city, state, zip, phone, fax, restaurantUrl, adminEmail, pickupLeadTime, carryoutLeadTime) {
    var isValid = true;
    if (restaurantDisplayName == "") {
        $('#txtProfileName').css('border-bottom', errorClassBorder);
        isValid = false;
    }
    if (address1 == "") {
        $('#txtProfileAddress1').css('border-bottom', errorClassBorder);
        isValid = false;
    }
    if (city == "") {
        $('#txtProfileCity').css('border-bottom', errorClassBorder);
        isValid = false;
    }
    if (state == "") {
        $('#ddlProfileState').css('border-bottom', errorClassBorder);
        isValid = false;
    }
    if (zip == "") {
        $('#txtProfileZip').css('border-bottom', errorClassBorder);
        isValid = false;
    }
    if (phone == "") {
        $('#txtProfilePhone').css('border-bottom', errorClassBorder);
        isValid = false;
    }
    else {
        if (phone.length < 10) {
            $('#txtProfilePhone').css('border-bottom', errorClassBorder);
            isValid = false;
        }
    }
    if (fax != "" && fax.length < 10) {
        $("#txtProfileFax").css('border-bottom', errorClassBorder);
        isValid = false;
    }
    if (restaurantUrl == "") {
        $('#txtProfileRestaurantURL').css('border-bottom', errorClassBorder);
        isValid = false;
    }
    if (adminEmail == "") {
        $('#txtProfileAdminEmail').css('border-bottom', errorClassBorder);
        isValid = false;
    }
    else {
        if (isEmail("#txtProfileAdminEmail") != true) {
            $('#txtProfileAdminEmail').css('border-bottom', errorClassBorder);
            isValid = false;
        }
    }
    if (pickupLeadTime <= 0) {
        $('#ddlProfilePickupLeadTime').css('border-bottom', errorClassBorder);
        isValid = false;
    }
    if (carryoutLeadTime <= 0) {
        $('#ddlProfileCarryOutLeadTime').css('border-bottom', errorClassBorder);
        isValid = false;
    }

    return isValid;
}


function ShowStoreTiming() {
    $('.div-content').remove();
    $('#hdnCount').val(8);
    var storeId = 0;
    storeId = SetStoreId();
    var moCount = 1; var tuCount = 1; var weCount = 1; var thCount = 1; var frCount = 1; var saCount = 1; var suCount = 1;
    if (Number(storeId) > 0) {

        var url = global + "/GetStoreTimingsByStoreId?storeid=" + storeId;

        try {
            $.getJSON(url, function (data) {
                //console.log(data);
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;
                //console.log("Length: " + length);

                if (JSON.parse(data).indexOf("No record(s) found") < 0) {
                    //console.log(data);
                    var count = 0;
                    $.each(JSON.parse(data), function (index, value) {
                        var dayName = "";
                        var timingId = 0;
                        var day = "";
                        var openingTime = "";
                        var openingHour = "";
                        var openingMinute = "";
                        var openingPeriod = "";
                        var closingTime = "";
                        var closingHour = "";
                        var closingMinute = "";
                        var closingPeriod = "";
                        if (value.ID > 0) {
                            timingId = value.ID;
                        }
                        if (value.DAY != "") {
                            day = value.DAY;
                        }
                        if (value.OPENINGTIME != "") {
                            openingTime = value.OPENINGTIME;
                            if (value.OPENINGHOUR != "") {
                                openingHour = value.OPENINGHOUR;
                            }
                            if (value.OPENINGMINUTE != "") {
                                openingMinute = value.OPENINGMINUTE;
                            }
                            if (value.OPENINGPERIOD != "") {
                                openingPeriod = value.OPENINGPERIOD;
                            }
                        }
                        if (value.CLOSINGTIME != "") {
                            closingTime = value.CLOSINGTIME;
                            if (value.CLOSINGHOUR != "") {
                                closingHour = value.CLOSINGHOUR;
                            }
                            if (value.CLOSINGMINUTE != "") {
                                closingMinute = value.CLOSINGMINUTE;
                            }
                            if (value.CLOSINGPERIOD != "") {
                                closingPeriod = value.CLOSINGPERIOD;
                            }
                        }

                        //Generate Edit Section Start//
                        var hdnCount = $('#hdnCount').val();

                        if (day == "Mo") {
                            $('#tab-profile-timing #Businesday_0_IsCheck').prop('checked', true);
                            dayName = "Monday";
                            if (moCount > 1) {
                                AppendEditSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                moCount++;
                            }
                            else {
                                $("#tab-profile-timing #Businesday_0_StoreTimingId").val(timingId)
                                $("#tab-profile-timing #Businesday_0_OpeningHour").val(openingHour);
                                $("#tab-profile-timing #Businesday_0_OpeningMinute").val(openingMinute);
                                $("#tab-profile-timing #Businesday_0_OpeningPeriod").val(openingPeriod);

                                $("#tab-profile-timing #Businesday_0_ClosingHour").val(closingHour);
                                $("#tab-profile-timing #Businesday_0_ClosingMinute").val(closingMinute);
                                $("#tab-profile-timing #Businesday_0_ClosingPeriod").val(closingPeriod);
                                moCount++;
                            }
                        }
                        else if (day == "Tu") {
                            $('#tab-profile-timing #Businesday_1_IsCheck').prop('checked', true);
                            dayName = "Tuesday";
                            if (tuCount > 1) {
                                AppendEditSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                tuCount++;
                            }
                            else {
                                $("#tab-profile-timing #Businesday_1_StoreTimingId").val(timingId)
                                $("#tab-profile-timing #Businesday_1_OpeningHour").val(openingHour);
                                $("#tab-profile-timing #Businesday_1_OpeningMinute").val(openingMinute);
                                $("#tab-profile-timing #Businesday_1_OpeningPeriod").val(openingPeriod);

                                $("#tab-profile-timing #Businesday_1_ClosingHour").val(closingHour);
                                $("#tab-profile-timing #Businesday_1_ClosingMinute").val(closingMinute);
                                $("#tab-profile-timing #Businesday_1_ClosingPeriod").val(closingPeriod);
                                tuCount++;
                            }
                        }
                        else if (day == "We") {
                            $('#tab-profile-timing #Businesday_2_IsCheck').prop('checked', true);
                            dayName = "Wednesday";
                            if (weCount > 1) {
                                AppendEditSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                weCount++;
                            }
                            else {
                                $("#tab-profile-timing #Businesday_2_StoreTimingId").val(timingId)
                                $("#tab-profile-timing #Businesday_2_OpeningHour").val(openingHour);
                                $("#tab-profile-timing #Businesday_2_OpeningMinute").val(openingMinute);
                                $("#tab-profile-timing #Businesday_2_OpeningPeriod").val(openingPeriod);

                                $("#tab-profile-timing #Businesday_2_ClosingHour").val(closingHour);
                                $("#tab-profile-timing #Businesday_2_ClosingMinute").val(closingMinute);
                                $("#tab-profile-timing #Businesday_2_ClosingPeriod").val(closingPeriod);
                                weCount++;
                            }
                        }
                        else if (day == "Th") {
                            $('#tab-profile-timing #Businesday_3_IsCheck').prop('checked', true);
                            dayName = "Thursday";
                            if (thCount > 1) {
                                AppendEditSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                thCount++;
                            }
                            else {
                                $("#tab-profile-timing #Businesday_3_StoreTimingId").val(timingId)
                                $("#tab-profile-timing #Businesday_3_OpeningHour").val(openingHour);
                                $("#tab-profile-timing #Businesday_3_OpeningMinute").val(openingMinute);
                                $("#tab-profile-timing #Businesday_3_OpeningPeriod").val(openingPeriod);

                                $("#tab-profile-timing #Businesday_3_ClosingHour").val(closingHour);
                                $("#tab-profile-timing #Businesday_3_ClosingMinute").val(closingMinute);
                                $("#tab-profile-timing #Businesday_3_ClosingPeriod").val(closingPeriod);
                                thCount++;
                            }
                        }
                        else if (day == "Fr") {
                            $('#tab-profile-timing #Businesday_4_IsCheck').prop('checked', true);
                            dayName = "Friday";
                            if (frCount > 1) {
                                AppendEditSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                frCount++;
                            }
                            else {
                                $("#tab-profile-timing #Businesday_4_StoreTimingId").val(timingId)
                                $("#tab-profile-timing #Businesday_4_OpeningHour").val(openingHour);
                                $("#tab-profile-timing #Businesday_4_OpeningMinute").val(openingMinute);
                                $("#tab-profile-timing #Businesday_4_OpeningPeriod").val(openingPeriod);

                                $("#tab-profile-timing #Businesday_4_ClosingHour").val(closingHour);
                                $("#tab-profile-timing #Businesday_4_ClosingMinute").val(closingMinute);
                                $("#tab-profile-timing #Businesday_4_ClosingPeriod").val(closingPeriod);
                                frCount++;
                            }
                        }
                        else if (day == "Sa") {
                            $('#tab-profile-timing #Businesday_5_IsCheck').prop('checked', true);
                            dayName = "Saturday";
                            if (saCount > 1) {
                                AppendEditSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                saCount++;
                            }
                            else {
                                $("#tab-profile-timing #Businesday_5_StoreTimingId").val(timingId)
                                $("#tab-profile-timing #Businesday_5_OpeningHour").val(openingHour);
                                $("#tab-profile-timing #Businesday_5_OpeningMinute").val(openingMinute);
                                $("#tab-profile-timing #Businesday_5_OpeningPeriod").val(openingPeriod);

                                $("#tab-profile-timing #Businesday_5_ClosingHour").val(closingHour);
                                $("#tab-profile-timing #Businesday_5_ClosingMinute").val(closingMinute);
                                $("#tab-profile-timing #Businesday_5_ClosingPeriod").val(closingPeriod);
                                saCount++;
                            }
                        }
                        else if (day == "Su") {
                            $('#tab-profile-timing #Businesday_6_IsCheck').prop('checked', true);
                            dayName = "Sunday";
                            if (suCount > 1) {
                                AppendEditSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                suCount++;
                            }
                            else {
                                $("#tab-profile-timing #Businesday_6_StoreTimingId").val(timingId)
                                $("#tab-profile-timing #Businesday_6_OpeningHour").val(openingHour);
                                $("#tab-profile-timing #Businesday_6_OpeningMinute").val(openingMinute);
                                $("#tab-profile-timing #Businesday_6_OpeningPeriod").val(openingPeriod);

                                $("#tab-profile-timing #Businesday_6_ClosingHour").val(closingHour);
                                $("#tab-profile-timing #Businesday_6_ClosingMinute").val(closingMinute);
                                $("#tab-profile-timing #Businesday_6_ClosingPeriod").val(closingPeriod);
                                suCount++;
                            }
                        }
                        //Generate Edit Section End//

                        count++;

                    });

                }
                else {

                }
            });

        }
        catch (e) {
        }
    }
    else {
        self.app.router.navigate('/login_new/', { reloadCurrent: true });
    }
}

function SaveStoreTiming() {
    var customerId = 0;
    customerId = localStorage.getItem("CustomerId");
    var storeId = 0;
    storeId = SetStoreId();
    var hdnCount = $("#hdnCount").val();
    var arrTimings = [];
    var businessDays = [];
    for (var i = 0; i < 8; i++) {
        var dayKey = $("#Businesday_" + i + "_DayKey").val();
        if ($("#Businesday_" + i + "_IsCheck").prop("checked") == true) {
            businessDays.push(dayKey);
        }
    }

    for (var j = 0; j <= hdnCount; j++) {
        var valueTimingId = 0;
        var valueDayKey = "";
        if ($("#Businesday_" + j + "_DayKey").length) {
            valueDayKey = $("#Businesday_" + j + "_DayKey").val();
            var openingHour = "";
            var openingMinute = "";
            var openingPeriod = "";
            var closingHour = "";
            var closingMinute = "";
            var closingPeriod = "";
            var openingTime = "";
            var closingTime = "";
            if ($("#Businesday_" + j + "_StoreTimingId").length) {
                valueTimingId = $("#Businesday_" + j + "_StoreTimingId").val();
            }

            openingHour = $("#Businesday_" + j + "_OpeningHour").val();
            openingMinute = $("#Businesday_" + j + "_OpeningMinute").val();
            openingPeriod = $("#Businesday_" + j + "_OpeningPeriod").val();
            openingTime = openingHour + ":" + openingMinute + " " + openingPeriod;

            closingHour = $("#Businesday_" + j + "_ClosingHour").val();
            closingMinute = $("#Businesday_" + j + "_ClosingMinute").val();
            closingPeriod = $("#Businesday_" + j + "_ClosingPeriod").val();
            closingTime = closingHour + ":" + closingMinute + " " + closingPeriod;

            var currentValue = { TimingId: valueTimingId, Daykey: valueDayKey, StartTime: openingTime, EndTime: closingTime }
            arrTimings.push(currentValue);
        }
    }

    //console.log(businessDays);
    //console.log(arrTimings);

    if (Number(storeId) > 0) {
        var model = new Object();
        model.CustomerId = customerId;
        model.StoreId = storeId;
        model.BusinessDays = businessDays;
        model.ListTiming = arrTimings;
        //console.log(model);

        $.post(global + "/SaveStoreTiming", model, function (data) {
            console.log(data.indexOf("Successful"));
            if (data.indexOf("Successful") > -1) {
                ShowStoreTiming();
                swal({
                    title: "Profile Timing saved successfully.",
                    confirmButtonText: "OK",
                    type: "success",
                    confirmButtonClass: 'btn btn-success',
                    buttonsStyling: false,
                    customClass: 'swal-wide',
                });
            }
            else {
                callSweetAlertWarning("Unable to save profile.");
            }
        });

    }
    else {
        self.app.router.navigate('/login_new/', { reloadCurrent: true });
    }
}

function AddNewSection(dayName, dayKey, e) {
    var hdnCount = $('#hdnCount').val();
    var idCount = parseInt(hdnCount) + 1;
    var removeParameter = idCount + "," + e;

    var html = "";
    //Html Start Section//
    html += "<div id=\"div_content_" + idCount + "\" class=\"div-content\">";
    //First Column Start//
    html += "<div class=\"timing-flex-column-container\">";
    //Label Section Start//
    html += "<div style=\"flex-basis: 120px;\">";
    html += "<label>Open</label>";
    html += "<input id=\"Businesday_" + idCount + "_StoreTimingId\" name=\"Businesday[" + idCount + "].StoreTimingId\" type=\"hidden\" value=\"0\">";
    html += "<input id=\"Businesday_" + idCount + "_DayKey\" name=\"Businesday[" + idCount + "].DayKey\" type=\"hidden\" value=\"" + dayKey + "\">";
    html += "</div>";
    //Label Section End//

    //Hour Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateHourHtml(idCount, "Opening");
    html += "</div>";
    //Hour Section End//

    //Minute Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateMinuteHtml(idCount, "Opening");
    html += "</div>";
    //Minute Section End//

    //Period Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreatePeriodHtml(idCount, "Opening");
    html += "</div>";
    //Period Section End//

    //Remove Icon Section Start//
    html += "<div style=\"flex-basis: 40px;\">";
    html += "<i id=\"remove_" + idCount + "\" class=\"material-icons\" onclick=\"RemoveSection(" + removeParameter + ");\" style=\"color: #e80000;\">delete</i>";
    html += "</div>";
    //Remove Icon Section End//

    html += "</div>";
    //First Column End//

    //***********************//

    //Second Column Start//
    html += "<div class=\"timing-flex-column-container\">";
    //Label Section Start//
    html += "<div style=\"flex-basis: 120px;\">";
    html += "<label>Close</label>";
    html += "</div>";
    //Label Section End//

    //Hour Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateHourHtml(idCount, "Closing");
    html += "</div>";
    //Hour Section End//

    //Minute Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateMinuteHtml(idCount, "Closing");
    html += "</div>";
    //Minute Section End//

    //Period Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreatePeriodHtml(idCount, "Closing");
    html += "</div>";
    //Period Section End//

    //Remove Icon Section Start//
    html += "<div style=\"flex-basis: 40px;\">";
    html += "</div>";
    //Remove Icon Section End//

    html += "</div>";
    //Second Column Start//

    html += "</div>";
    //Html End Section//

    $("#div_" + dayName).append(html);
    $('#hdnCount').val(idCount);
}

function RemoveSection(idCount, e) {
    $("#div_content_" + idCount + "").remove();
    var hdnCount = $('#hdnCount').val();
    var idCount = parseInt(hdnCount) - 1;
    $('#hdnCount').val(idCount);
}

function AppendEditSection(timingId, dayName, dayKey, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod) {
    var hdnCount = $('#hdnCount').val();
    var idCount = parseInt(hdnCount) + 1;
    var removeParameter = idCount + "," + timingId;

    var html = "";
    //Html Start Section//
    html += "<div id=\"div_content_" + idCount + "\" class=\"div-content\">";
    //First Column Start//
    html += "<div class=\"timing-flex-column-container\">";
    //Label Section Start//
    html += "<div style=\"flex-basis: 120px;\">";
    html += "<label>Open</label>";
    html += "<input id=\"Businesday_" + idCount + "_StoreTimingId\" name=\"Businesday[" + idCount + "].StoreTimingId\" type=\"hidden\" value=\"" + timingId + "\">";
    html += "<input id=\"Businesday_" + idCount + "_DayKey\" name=\"Businesday[" + idCount + "].DayKey\" type=\"hidden\" value=\"" + dayKey + "\">";
    html += "</div>";
    //Label Section End//

    //Hour Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateHourEditHtml(idCount, "Opening", openingHour);
    html += "</div>";
    //Hour Section End//

    //Minute Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateMinuteEditHtml(idCount, "Opening", openingMinute);
    html += "</div>";
    //Minute Section End//

    //Period Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreatePeriodEditHtml(idCount, "Opening", openingPeriod);
    html += "</div>";
    //Period Section End//

    //Remove Icon Section Start//
    html += "<div style=\"flex-basis: 40px;\">";
    html += "<i id=\"remove_" + idCount + "\" class=\"material-icons\" onclick=\"DeleteSection(" + removeParameter + ");\" style=\"color: #e80000;\">delete</i>";
    html += "</div>";
    //Remove Icon Section End//

    html += "</div>";
    //First Column End//

    //***********************//

    //Second Column Start//
    html += "<div class=\"timing-flex-column-container\">";
    //Label Section Start//
    html += "<div style=\"flex-basis: 120px;\">";
    html += "<label>Close</label>";
    html += "</div>";
    //Label Section End//

    //Hour Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateHourEditHtml(idCount, "Closing", closingHour);
    html += "</div>";
    //Hour Section End//

    //Minute Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateMinuteEditHtml(idCount, "Closing", closingMinute);
    html += "</div>";
    //Minute Section End//

    //Period Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreatePeriodEditHtml(idCount, "Closing", closingPeriod);
    html += "</div>";
    //Period Section End//

    //Remove Icon Section Start//
    html += "<div style=\"flex-basis: 40px;\">";
    html += "</div>";
    //Remove Icon Section End//

    html += "</div>";
    //Second Column Start//

    html += "</div>";
    //Html End Section//

    $("#div_" + dayName).append(html);
    $('#hdnCount').val(idCount);
    //return html;
}

function CreateHourHtml(iCount, type) {
    var hourHtml = "";
    hourHtml += "<select id=\"Businesday_" + iCount + "_" + type + "Hour\" name=\"Businesday[" + iCount + "]." + type + "Hour\">";
    for (var i = 0; i < 12; i++) {
        if (i <= 9) {
            hourHtml += "<option value=\"0" + i + "\">0" + i + "</option>";
        }
        else {
            hourHtml += "<option value=\"" + i + "\">" + i + "</option>";
        }
    }
    hourHtml += "</select>";
    return hourHtml;
}
function CreateMinuteHtml(iCount, type) {
    var minuteHtml = "";
    minuteHtml += "<select id=\"Businesday_" + iCount + "_" + type + "Minute\" name=\"Businesday[" + iCount + "]." + type + "Minute\">";
    for (var i = 0; i < 60; i++) {
        if (i <= 9) {
            minuteHtml += "<option value=\"0" + i + "\">0" + i + "</option>";
        }
        else {
            minuteHtml += "<option value=\"" + i + "\">" + i + "</option>";
        }
    }
    minuteHtml += "</select>";
    return minuteHtml;
}
function CreatePeriodHtml(iCount, type) {
    var periodHtml = "";
    periodHtml += "<select id=\"Businesday_" + iCount + "_" + type + "Period\" name=\"Businesday[" + iCount + "]." + type + "Period\">";
    periodHtml += "<option value=\"AM\">AM</option>";
    periodHtml += "<option value=\"PM\">PM</option>";
    periodHtml += "</select>";
    return periodHtml;
}


function CreateHourEditHtml(iCount, type, selectedHour) {
    var hourHtml = "";
    hourHtml += "<select id=\"Businesday_" + iCount + "_" + type + "Hour\" name=\"Businesday[" + iCount + "]." + type + "Hour\">";
    for (var i = 0; i < 12; i++) {
        var hour = "00";
        if (i <= 9) {
            hour = "0" + i;
        }
        else {
            hour = i;
        }
        if (hour == selectedHour || i == selectedHour) {
            hourHtml += "<option value=\"" + hour + "\" selected>" + hour + "</option>";
        }
        else {
            hourHtml += "<option value=\"" + hour + "\">" + hour + "</option>";
        }
    }
    hourHtml += "</select>";
    return hourHtml;
}
function CreateMinuteEditHtml(iCount, type, selectedMinute) {
    var minuteHtml = "";
    minuteHtml += "<select id=\"Businesday_" + iCount + "_" + type + "Minute\" name=\"Businesday[" + iCount + "]." + type + "Minute\">";
    for (var i = 0; i < 60; i++) {
        var minute = "00";
        if (i <= 9) {
            minute = "0" + i;
        }
        else {
            minute = i;
        }
        if (minute == selectedMinute || i == selectedMinute) {
            minuteHtml += "<option value=\"" + minute + "\" selected>" + minute + "</option>";
        }
        else {
            minuteHtml += "<option value=\"" + minute + "\">" + minute + "</option>";
        }
    }
    minuteHtml += "</select>";
    return minuteHtml;
}
function CreatePeriodEditHtml(iCount, type, period) {
    var periodHtml = "";
    periodHtml += "<select id=\"Businesday_" + iCount + "_" + type + "Period\" name=\"Businesday[" + iCount + "]." + type + "Period\">";
    if (period == "AM") {
        periodHtml += "<option value=\"AM\" selected>AM</option>";
        periodHtml += "<option value=\"PM\">PM</option>";
    }
    else if (period == "PM") {
        periodHtml += "<option value=\"AM\">AM</option>";
        periodHtml += "<option value=\"PM\" selected>PM</option>";
    }
    else {
        periodHtml += "<option value=\"AM\">AM</option>";
        periodHtml += "<option value=\"PM\">PM</option>";
    }
    periodHtml += "</select>";
    return periodHtml;
}

function DeleteSection(idCount, timingId) {

    if (timingId > 0) {
        if (confirm("Are you sure want to delete this record?")) {
            $.ajax({
                url: global + '/DeleteStoreTimingById?timingId=' + timingId,
                type: 'POST',
                cache: false,
                success: function (response) {
                    if (response.indexOf("Successful") > -1) {
                        $("#div_content_" + idCount).remove();
                        callSweetAlertSuccess("Timing deleted successfully.");
                    }
                    else {
                        callSweetAlertWarning("Unable to delete timing.");
                    }
                }
            });
        }
        return false;
    }
}

//Carryout Items
function CarryoutItemsList(carryoutpagesize, carryoutcurrentPage) {


    var customerId = 0;
    var storeId = 0;
    currentPage = 0;
    $("#dvFoodItemList").html("");
    storeId = SetStoreId();
    customerId = SetCustomerId();
    //Sorting

    var name = $("#txtFilterItemName").val();
    var category = $("#filterProductCategory").val();
    var status = $("#ddlFilterItemStatus").val();

    var sortValue = $("input[name='radioItemSort']:checked").val();
    var sortByValue = $("input[name='radioItemSortBy']:checked").val();
    
    localStorage.setItem("ItemFilterName", name);
    localStorage.setItem("ItemFilterCategory", category);
    localStorage.setItem("ItemFilterStatus", status);
    localStorage.setItem("ItemFilterSort", sortValue);
    localStorage.setItem("ItemFilterSortBy", sortByValue);

    if (name == undefined) {
        name = "";
    }
    if (category == undefined) {
        category = "0";
    }

    if (status == undefined) {
        status = "";
    }


    if (Number(storeId) > 0) {

        carryoutcurrentPage = Number(carryoutcurrentPage) * Number(carryoutpagesize);
        url = global + "/GetAllCarryOutItems?storeid=" + storeId + "&pagesize=" + carryoutpagesize + "&currentPage=" + carryoutcurrentPage + "&name=" + name + "&category=" + category + "&status=" + status +
           "&sortValue=" + sortValue + "&sortByValue=" + sortByValue;

        try {

            $.getJSON(url, function (data) {
                $('#loader_msg').html("");
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;

                if (JSON.parse(data).indexOf("No item(s) found") < 0) {
                    localStorage.setItem("ItemAvailable", "1");
                    var count = 0;
                    $.each(JSON.parse(data), function (index, value) {
                        var itemPrice = "$0.00";
                        if (value.PRICE != "") {
                            itemPrice = FormatDecimal(value.PRICE);

                        }
                        console.log(value.PUBLISHED)
                        var html = "<div class=\"order-container\"  id='li_" + value.ID + "' style=\"width:100%;padding-left: 20px;\" >";
                        html += "<div id=\"dvItemListInner_" + value.ID + "\" class=\"order-list\">";
                        html += "<div class=\"order-column-two\" style=\"width:100%\">";
                        html += "<div class=\"order-row-container\">";

                        /*------------------Name-----------------------*/
                        //html += "<div class=\"order-pickup order-number\" style=\"text-align:left;font-size:20px;width:70%\" ><div style=\"display:inline-block;\">" + value.NAME+"</div>";
                        html += "<div class=\"order-pickup\" ><div class=\"code\">" + value.NAME + "</div>";
                        //if (value.PUBLISHED == 1) {
                        //    html += "<div style=\"width:33.33%;\"><a><img src=\"./img/icons/active.png\"></a></div>";
                        //}
                        //else {
                        //    html += "<div style=\"width:33.33%;\"><a><img src=\"./img/icons/inactive.png\"></a></div>";
                        //}
                        if (value.PUBLISHED == 1) {
                            html += "<div  class=\"coupon-status-icon\"><img class=\"list-icon\" src=\"./img/icons/active.png\"></div>";
                        }
                        else {
                            html += "<div class=\"coupon-status-icon\"><img class=\"list-icon\" src=\"./img/icons/inactive.png\"></div>";
                        }
                        html += "</div>";
                        /*------------------Button-----------------------*/
                        html += "<div class=\"order-buttons\" style=\"width:30%\">";

                        html += "<div class=\"order-price\" style=\"font-size:20px;width:50%;text-align:right;\">" + itemPrice + "</div>";

                        html += "<div style=\"padding-left:0px;width:50%\"><a onclick=\"GoToItemEdit(" + value.ID + ");\"><img src=\"./img/icons/edit-icon.png\"></a></div>";
                        html += "</div>";

                        html += "</div>";
                        html += "<div class=\"order-row-container\" >";
                        html += "<div class=\"order-date\" style=\"width:100%\">";
                        html += "<div class=\"customer-detail-container\">";

                        if (value.CATEGORY != undefined && value.CATEGORY != null && value.CATEGORY != "")
                            html += "<div  style=\"font-size:14px;width:100%;font-weight:600;\">" + value.CATEGORY + "</div>";

                        /*------------------SHORTDESCRIPTION-----------------------*/
                        if (value.SHORTDESCRIPTION != undefined && value.SHORTDESCRIPTION != null && value.SHORTDESCRIPTION != "")
                            html += "<div  style=\"font-size:16px;width:100%\">" + value.SHORTDESCRIPTION + "</div>";
                        html += "</div>";
                        html += "</div>";


                        html += "</div></div></div></div>";

                        count++;

                        $("#dvFoodItemList").append(html);


                    });

                }


                else {
                    localStorage.setItem("ItemAvailable", "0");
                    var html = "<div class=\"order-list list-empty-label-text\">No Items</div>";

                    $("#dvFoodItemList").html(html);

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

//Carryout Items
function CarryoutItemsListPagination(carryoutpagesize, carryoutcurrentPage) {
    //Shorting

    var customerId = 0;
    var storeId = 0;


    storeId = SetStoreId();
    customerId = SetCustomerId();
    if (Number(storeId) > 0) {

        //Sorting
        var name = $("#txtFilterItemName").val();
        var category = $("#filterProductCategory").val();
        var status = $("#ddlFilterItemStatus").val();

        var sortValue = $("input[name='radioItemSort']:checked").val();
        var sortByValue = $("input[name='radioItemSortBy']:checked").val();

        if (name == undefined) {
            name = "";
        }
        if (category == undefined) {
            category = "0";
        }

        if (status == undefined) {
            status = "";
        }
        console.log("radioItemSortBy: " + sortValue)
        console.log("radioItemSort: " + sortByValue)

        carryoutcurrentPage = Number(carryoutcurrentPage) * Number(carryoutpagesize);
        url = global + "/GetAllCarryOutItems?storeid=" + storeId + "&pagesize=" + carryoutpagesize + "&currentPage=" + carryoutcurrentPage + "&name=" + name + "&category=" + category + "&status=" + status +
           "&sortValue=" + sortValue + "&sortByValue=" + sortByValue;

        try {

            $.getJSON(url, function (data) {
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;

                if (JSON.parse(data).indexOf("No item(s) found") < 0) {
                    localStorage.setItem("ItemAvailable", "1");
                    var count = 0;
                    $.each(JSON.parse(data), function (index, value) {
                        var itemPrice = "$0.00";
                        if (value.PRICE != "") {
                            itemPrice = FormatDecimal(value.PRICE);

                        }

                        var html = "<div class=\"order-container\"  id='li_" + value.ID + "' style=\"width:100%;padding-left: 20px;\" >";
                        html += "<div id=\"dvItemListInner_" + value.ID + "\" class=\"order-list\">";
                        html += "<div class=\"order-column-two\" style=\"width:100%\">";
                        html += "<div class=\"order-row-container\">";

                        /*------------------Name-----------------------*/
                        //html += "<div class=\"order-pickup order-number\" style=\"text-align:left;font-size:20px;width:70%\" ><div style=\"display:inline-block;\">" + value.NAME+"</div>";
                        html += "<div class=\"order-pickup\" ><div class=\"code\">" + value.NAME + "</div>";
                        //if (value.PUBLISHED == 1) {
                        //    html += "<div style=\"width:33.33%;\"><a><img src=\"./img/icons/active.png\"></a></div>";
                        //}
                        //else {
                        //    html += "<div style=\"width:33.33%;\"><a><img src=\"./img/icons/inactive.png\"></a></div>";
                        //}
                        if (value.PUBLISHED == 1) {
                            html += "<div  class=\"coupon-status-icon\"><img class=\"list-icon\" src=\"./img/icons/active.png\"></div>";
                        }
                        else {
                            html += "<div class=\"coupon-status-icon\"><img class=\"list-icon\" src=\"./img/icons/inactive.png\"></div>";
                        }
                        html += "</div>";
                        /*------------------Button-----------------------*/
                        html += "<div class=\"order-buttons\" style=\"width:30%\">";

                        html += "<div class=\"order-price\" style=\"font-size:20px;width:50%;text-align:right;\">" + itemPrice + "</div>";

                        html += "<div style=\"padding-left:0px;width:50%\"><a onclick=\"GoToItemEdit(" + value.ID + ");\"><img src=\"./img/icons/edit-icon.png\"></a></div>";
                        html += "</div>";

                        html += "</div>";
                        html += "<div class=\"order-row-container\" >";
                        html += "<div class=\"order-date\" style=\"width:100%\">";
                        html += "<div class=\"customer-detail-container\">";
                        if (value.CATEGORY != undefined && value.CATEGORY != null && value.CATEGORY != "")
                            html += "<div  style=\"font-size:14px;width:100%;font-weight:600;\">" + value.CATEGORY + "</div>";

                        /*------------------SHORTDESCRIPTION-----------------------*/
                        if (value.SHORTDESCRIPTION != undefined && value.SHORTDESCRIPTION != null && value.SHORTDESCRIPTION != "")
                            html += "<div  style=\"font-size:16px;width:100%\">" + value.SHORTDESCRIPTION + "</div>";

                        //if (value.StartDateUtc != "" && value.EndDateUtc != "") {
                        //    /*------------------Start Date Ende Date-----------------------*/
                        //    html += "<div class=\"giftcard-customer-name\">Start: <span class=\"cc-number\">" + StartDate + "</span></div>";
                        //    html += "<div class=\"giftcard-customer-name\">End: <span class=\"cc-number\">" + EndDate + "</span></div>";
                        //}


                        html += "</div>";
                        html += "</div>";


                        html += "</div></div></div></div>";

                        count++;

                        $("#dvFoodItemList").append(html);


                    });

                }
                else {
                    localStorage.setItem("ItemAvailable", "0");
                    //var html = "<div class=\"order-list list-empty-label-text\">No items</div>";

                    //$("#dvFoodItemList").html(html);

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
//Filter & Sort Items
function FilterSortItems() {
    var pageSize = 10;
    var currentPage = 0;
    localStorage.setItem("CurrentPage", currentPage);
    CarryoutItemsList(10, 0);
}
function GoToItemEdit(productId) {
    localStorage.setItem("HiddenItemId", productId);
    self.app.router.navigate('/foods/', { reloadCurrent: false });
}
function BindItemById(productId) {
    var storeId = 0;
    var productId = localStorage.getItem("HiddenItemId");
    storeId = SetStoreId();
    if (productId > 0 && Number(storeId) > 0) {
        /*-------------HTML Start---------------------------------*/
        var innerHtml = "";
        //console.log("BindCategoy: " + storeId)
        if (storeId > 0) {
            var url = global + "/GetCategoyByStoreId?storeId=" + storeId;

            $.getJSON(url, function (data) {
                //console.log(data)
                if (data.replace(/"/g, "").indexOf("No record(s) found.") > -1) {

                }
                else {
                    $('#productCategory').html("<option value=\"0\">Category</option>");
                    $('#productCategory').append(data);

                    $('.div-contentTiming').remove();
                    $('#hdnAvailTimingCount').val(8);


                    var moCount = 1; var tuCount = 1; var weCount = 1; var thCount = 1; var frCount = 1; var saCount = 1; var suCount = 1;

                    $("#hdnItemId").val(productId);
                    var url = global + "/GetItemById?productId=" + productId;

                    $.getJSON(url, function (data) {
                        if (data.replace(/"/g, "").indexOf("No record(s) found.") > -1) {

                        }
                        else {

                            //localStorage.setItem("HiddenDiscountId", 0);
                            $.each(JSON.parse(data), function (index, value) {

                                //console.log(data);
                                //console.log(value); 
                                var count = 0;
                                if (value.Type == "ItemInfo") {
                                   // console.log("value.IsCarryout : " + value.IsCarryout)

                                    if (value.CategoryId != "") {
                                        // $("#food-page-content #productCategory").val(value.CATEGORYID);
                                        $("#productCategory option[value='" + value.CATEGORYID + "']").attr("selected", "selected");
                                    }
                                    if (value.NAME != "") {
                                        $("#txtProductName").val(value.NAME);
                                    }
                                    if (value.SHORTDESCRIPTION != "") {
                                        var shortDescription = value.SHORTDESCRIPTION.replace("<p>", "").replace("</p>", "");
                                        $("#txtProductDescription").val(shortDescription);

                                    }

                                    if (value.PRICE > 0) {
                                        var price = FormatDecimal(value.PRICE);
                                        if (price.indexOf('$') > -1) {
                                            price = price.replace('$', '');
                                        }
                                        $("#txtProductPrice").val(price);
                                        //console.log(value.MinimumOrderAmount);
                                    }
                                    else {
                                        $("#txtProductPrice").val(FormatDecimal(0.00).replace('$', ''));
                                    }
                                    if (value.FOODSELECTIONTYPE.toLowerCase().indexOf("lunch") > -1) {
                                        $("#chkLunch").prop('checked', true);
                                    }
                                    else {
                                        $("#chkLunch").prop('checked', false);
                                    }
                                    if (value.FOODSELECTIONTYPE.toLowerCase().indexOf("dinner") > -1) {
                                        $("#chkDinner").prop('checked', true);
                                    }
                                    else {
                                        $("#chkDinner").prop('checked', false);
                                    }
                                    if (value.FOODSELECTIONTYPE.toLowerCase().indexOf("breakfast") > -1) {
                                        $("#chkBreakfast").prop('checked', true);
                                    }
                                    else{
                                        $("#chkBreakfast").prop('checked', false);
                                    }
                                    if (value.FOODSELECTIONTYPE.toLowerCase().indexOf("branch") > -1) {
                                        $("#chkBrunch").prop('checked', true);
                                    }
                                    else{
                                        $("#chkBrunch").prop('checked', false);
                                    }

                                    if (value.IsDineIn == 1) {
                                        $("#chkDineIn").prop('checked', true);
                                    }
                                    else {
                                        $("#chkDineIn").prop('checked', false);
                                    }
                                    if (value.IsCarryout == 1) {
                                        $("#chkCarryOut").prop('checked', true);
                                    }
                                    else {
                                        $("#chkCarryOut").prop('checked', false);
                                    }
                                    if (value.PUBLISHED == 1) {
                                        $("#checkItemActive").prop('checked', true);
                                    }
                                    else {
                                        $("#checkItemActive").prop('checked', false);
                                    }
                                    if (value.AVAILABILITYTYPE == "Normal") {
                                        $("#chkNormal").prop('checked', true);
                                        $("#liAvailTiming").hide();
                                    }
                                    else if (value.AVAILABILITYTYPE == "Time Specific") {
                                        $("#chkTimeSpecific").prop('checked', true);
                                        $("#liAvailTiming").show();
                                    }

                                    //console.log("value.CATEGORYID 1: ")
                                }
                                else if (value.Type == "ItemTiming") {
                                    var dayName = "";
                                    var timingId = 0;
                                    var day = "";
                                    var openingTime = "";
                                    var openingHour = "";
                                    var openingMinute = "";
                                    var openingPeriod = "";
                                    var closingTime = "";
                                    var closingHour = "";
                                    var closingMinute = "";
                                    var closingPeriod = "";
                                    var price = 0.00;
                                    if (value.TimingId > 0) {
                                        timingId = value.TimingId;
                                    }
                                    if (value.Day != "") {
                                        day = value.Day;
                                    }
                                    if (value.StartTime != "") {
                                        openingTime = value.StartTime;
                                        if (value.STARTHOUR != "") {
                                            openingHour = value.STARTHOUR;
                                        }
                                        if (value.STARTMINUTE != "") {
                                            openingMinute = value.STARTMINUTE;
                                        }
                                        if (value.STARTPERIOD != "") {
                                            openingPeriod = value.STARTPERIOD;
                                        }
                                    }
                                    if (value.EndTime != "") {
                                        closingTime = value.EndTime;
                                        if (value.ENDHOUR != "") {
                                            closingHour = value.ENDHOUR;
                                        }
                                        if (value.ENDMINUTE != "") {
                                            closingMinute = value.ENDMINUTE;
                                        }
                                        if (value.ENDPERIOD != "") {
                                            closingPeriod = value.ENDPERIOD;
                                        }
                                    }

                                    if (value.Price != "") {
                                        price = FormatDecimal(value.Price);
                                        if (price.indexOf('$') > -1) {
                                            price = price.replace('$', '');
                                        }
                                        //$("#txtProductPrice").val(price);
                                        // price = value.Price;
                                    }

                                    //Generate Edit Section Start//
                                    if (day == "Mo") {
                                        $('#Avail_0_IsCheck').prop('checked', true);
                                        dayName = "Monday";
                                        if (moCount > 1) {
                                            AppendEditAvailTimingSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod, price);
                                            moCount++;
                                        }
                                        else {
                                            $("#Avail_0_TimingId").val(timingId)
                                            $("#Avail_0_StartHour").val(openingHour);
                                            $("#Avail_0_StartMinute").val(openingMinute);
                                            $("#Avail_0_StartPeriod").val(openingPeriod);

                                            $("#Avail_0_EndHour").val(closingHour);
                                            $("#Avail_0_EndMinute").val(closingMinute);
                                            $("#Avail_0_EndPeriod").val(closingPeriod);
                                            $("#Avail_0_Price").val(price);
                                            moCount++;
                                        }
                                    }
                                    else if (day == "Tu") {
                                        $('#Avail_1_IsCheck').prop('checked', true);
                                        dayName = "Tuesday";
                                        if (tuCount > 1) {
                                            AppendEditAvailTimingSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod, price);
                                            tuCount++;
                                        }
                                        else {
                                            $("#Avail_1_TimingId").val(timingId)
                                            $("#Avail_1_StartHour").val(openingHour);
                                            $("#Avail_1_StartMinute").val(openingMinute);
                                            $("#Avail_1_StartPeriod").val(openingPeriod);

                                            $("#Avail_1_EndHour").val(closingHour);
                                            $("#Avail_1_EndMinute").val(closingMinute);
                                            $("#Avail_1_EndPeriod").val(closingPeriod);
                                            $("#Avail_1_Price").val(price);
                                            tuCount++;
                                        }
                                    }
                                    else if (day == "We") {
                                        $('#Avail_2_IsCheck').prop('checked', true);
                                        dayName = "Wednesday";
                                        if (weCount > 1) {
                                            AppendEditAvailTimingSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod, price);
                                            weCount++;
                                        }
                                        else {
                                            $("#Avail_2_TimingId").val(timingId)
                                            $("#Avail_2_StartHour").val(openingHour);
                                            $("#Avail_2_StartMinute").val(openingMinute);
                                            $("#Avail_2_StartPeriod").val(openingPeriod);

                                            $("#Avail_2_EndHour").val(closingHour);
                                            $("#Avail_2_EndMinute").val(closingMinute);
                                            $("#Avail_2_EndPeriod").val(closingPeriod);
                                            $("#Avail_2_Price").val(price);
                                            weCount++;
                                        }
                                    }
                                    else if (day == "Th") {
                                        $('#Avail_3_IsCheck').prop('checked', true);
                                        dayName = "Thursday";
                                        if (thCount > 1) {
                                            AppendEditAvailTimingSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod, price);
                                            thCount++;
                                        }
                                        else {
                                            $("#Avail_3_TimingId").val(timingId)
                                            $("#Avail_3_StartHour").val(openingHour);
                                            $("#Avail_3_StartMinute").val(openingMinute);
                                            $("#Avail_3_StartPeriod").val(openingPeriod);

                                            $("#Avail_3_EndHour").val(closingHour);
                                            $("#Avail_3_EndMinute").val(closingMinute);
                                            $("#Avail_3_EndPeriod").val(closingPeriod);
                                            $("#Avail_3_Price").val(price);
                                            thCount++;
                                        }
                                    }
                                    else if (day == "Fr") {
                                        $('#Avail_4_IsCheck').prop('checked', true);
                                        dayName = "Friday";
                                        if (frCount > 1) {
                                            AppendEditAvailTimingSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod, price);
                                            frCount++;
                                        }
                                        else {
                                            $("#Avail_4_TimingId").val(timingId)
                                            $("#Avail_4_StartHour").val(openingHour);
                                            $("#Avail_4_StartMinute").val(openingMinute);
                                            $("#Avail_4_StartPeriod").val(openingPeriod);

                                            $("#Avail_4_EndHour").val(closingHour);
                                            $("#Avail_4_EndMinute").val(closingMinute);
                                            $("#Avail_4_EndPeriod").val(closingPeriod);
                                            $("#Avail_4_Price").val(price);
                                            frCount++;
                                        }
                                    }
                                    else if (day == "Sa") {
                                        $('#Avail_5_IsCheck').prop('checked', true);
                                        dayName = "Saturday";
                                        if (saCount > 1) {
                                            AppendEditAvailTimingSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod, price);
                                            saCount++;
                                        }
                                        else {
                                            $("#Avail_5_TimingId").val(timingId)
                                            $("#Avail_5_StartHour").val(openingHour);
                                            $("#Avail_5_StartMinute").val(openingMinute);
                                            $("#Avail_5_StartPeriod").val(openingPeriod);

                                            $("#Avail_5_EndHour").val(closingHour);
                                            $("#Avail_5_EndMinute").val(closingMinute);
                                            $("#Avail_5_EndPeriod").val(closingPeriod);
                                            $("#Avail_5_Price").val(price);
                                            saCount++;
                                        }
                                    }
                                    else if (day == "Su") {
                                        $('#Avail_6_IsCheck').prop('checked', true);
                                        dayName = "Sunday";
                                        if (suCount > 1) {
                                            AppendEditAvailTimingSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod, price);
                                            suCount++;
                                        }
                                        else {
                                            $("#Avail_6_TimingId").val(timingId)
                                            $("#Avail_6_StartHour").val(openingHour);
                                            $("#Avail_6_StartMinute").val(openingMinute);
                                            $("#Avail_6_StartPeriod").val(openingPeriod);

                                            $("#Avail_6_EndHour").val(closingHour);
                                            $("#Avail_6_EndMinute").val(closingMinute);
                                            $("#Avail_6_EndPeriod").val(closingPeriod);
                                            $("#Avail_6_Price").val(price);
                                            suCount++;
                                        }
                                    }
                                    //Generate Edit Section End//
                                }
                            });
                        }
                    });
                }
            });
            // $('#' + id).prop('selectedIndex', 0);
            //  
        }

        // console.log("productId: " + productId)

    }

}
function SaveProductInfo() {
    var itemId = 0;
    itemId = $("#hdnItemId").val();
    var customerId = 0;
    customerId = localStorage.getItem("CustomerId");
    var storeId = SetStoreId();
    var isActive = false;
    var isLunch = true;
    var isDineIn = true;
    var isCarryOut = true;
    var isDinner = true;
    var isBrunch = false;
    var isBreakfast = false;
    var foodSelectionType = "";
    var availabilityType = "Normal";
    var categoryId = $("#productCategory").val();
    var name = $("#txtProductName").val();
    var desc = $("#txtProductDescription").val();
    var productprice = $("#txtProductPrice").val();
    if ($("#checkItemActive").prop("checked") == true) {
        isActive = true;
    }
    if ($("#chkLunch").prop("checked") == true) {
        isLunch = true;
    }
    else {
        if (itemId > 0) {
            isLunch = false;
        }
    }
    if ($("#chkBreakfast").prop("checked") == true) {
        isBreakfast = true;

    }
    if ($("#chkDinner").prop("checked") == true) {
        isDinner = true;
    }
    else {
        if (itemId > 0) {
            isDinner = false;
        }
    }
    if ($("#chkBrunch").prop("checked") == true) {
        isBrunch = true;
    }
    if ($("#chkDineIn").prop("checked") == true) {
        isDineIn = true;
    }
    else {
        if (itemId > 0) {
            isDineIn = false;
        }
    }
    if ($("#chkCarryOut").prop("checked") == true) {
        isCarryOut = true;
    }
    else {
        if(itemId>0)
        {
            isCarryOut = false;
        }
    }

    if ($("#chkTimeSpecific").prop("checked") == true) {
        availabilityType = "Time Specific";
    }

    var hdnCount = $("#hdnAvailTimingCount").val();
    var arrTimings = [];
    var offerDays = [];
    for (var i = 0; i < 8; i++) {
        var dayKey = $("#Avail_" + i + "_DayKey").val();
        if ($("#Avail_" + i + "_IsCheck").prop("checked") == true) {
            offerDays.push(dayKey);
        }
    }

    for (var j = 0; j <= hdnCount; j++) {
        var valueTimingId = 0;
        var valueDayKey = "";
        if ($("#Avail_" + j + "_DayKey").length) {
            valueDayKey = $("#Avail_" + j + "_DayKey").val();
            var openingHour = "";
            var openingMinute = "";
            var openingPeriod = "";
            var closingHour = "";
            var closingMinute = "";
            var closingPeriod = "";
            var openingTime = "";
            var closingTime = "";
            var price = "0.00";
            if ($("#Avail_" + j + "_TimingId").length) {
                valueTimingId = $("#Avail_" + j + "_TimingId").val();
            }

            openingHour = $("#Avail_" + j + "_StartHour").val();
            openingMinute = $("#Avail_" + j + "_StartMinute").val();
            openingPeriod = $("#Avail_" + j + "_StartPeriod").val();
            openingTime = openingHour + ":" + openingMinute + " " + openingPeriod;
            price = $("#Avail_" + j + "_Price").val();

            closingHour = $("#Avail_" + j + "_EndHour").val();
            closingMinute = $("#Avail_" + j + "_EndMinute").val();
            closingPeriod = $("#Avail_" + j + "_EndPeriod").val();
            closingTime = closingHour + ":" + closingMinute + " " + closingPeriod;

            var currentValue = { TimingId: valueTimingId, Daykey: valueDayKey, StartTime: openingTime, EndTime: closingTime, Price: price };
            if (price != "" && price != "0.00") {
                arrTimings.push(currentValue);
            }

        }
    }



    if (Number(storeId) > 0) {

        if (name != "" && categoryId != "0" && productprice != "") {
            var model = new Object();
            model.ID = itemId;

            model.CustomerId = customerId;
            model.OfferDays = offerDays;
            model.ListTiming = arrTimings;
            model.StoreId = storeId;
            model.CategoryId = categoryId;
            model.Name = name;
            model.ShortDescription = desc;
            model.Price = productprice;
            model.Published = isActive;
            model.IsDinner = isDinner;
            model.IsBreakFast = isBreakfast;
            model.IsBranch = isBrunch;
            model.IsLunch = isLunch;
            model.IsDineIn = isDineIn;
            model.IsCarryOut = isCarryOut;
            model.AvailabilityType = availabilityType;
            if (model.IsBranch) {
                if (foodSelectionType != "") {
                    foodSelectionType = foodSelectionType + "," + "Branch";
                }
                else {
                    foodSelectionType = "Branch";
                }
            }
            if (model.IsBreakFast) {
                if (foodSelectionType != "") {
                    foodSelectionType = foodSelectionType + "," + "Breakfast";
                }
                else {
                    foodSelectionType = "Breakfast";
                }
            }
            if (model.IsDinner) {
                if (foodSelectionType != "") {
                    foodSelectionType = foodSelectionType + "," + "Dinner";
                }
                else {
                    foodSelectionType = "Dinner";
                }
            }
            if (model.IsLunch) {
                if (foodSelectionType != "") {
                    foodSelectionType = foodSelectionType + "," + "Lunch";
                }
                else {
                    foodSelectionType = "Lunch";
                }
            }

            model.FoodSelectionType = foodSelectionType;
            //console.log(model);
            $.post(global + "/AddUpdateItem", model, function (data) {
                //console.log(data.indexOf("Successful"));
                if (data.indexOf("Successful") > -1 || data == "") {
                    if (Number(itemId) > 0) {
                        swal({
                            title: "Item updated successfully.",
                            confirmButtonText: "OK",
                            type: "success",
                            confirmButtonClass: 'btn btn-success',
                            buttonsStyling: false,
                            customClass: 'swal-wide',
                        }).then(function () {                            
                            self.app.router.navigate('/food_list/', { reloadCurrent: false });
                        });
                    }
                    else {
                        swal({
                            title: "Item added successfully.",
                            confirmButtonText: "OK",
                            type: "success",
                            confirmButtonClass: 'btn btn-success',
                            buttonsStyling: false,
                            customClass: 'swal-wide',
                        }).then(function () {                            
                            self.app.router.navigate('/food_list/', { reloadCurrent: false });
                        });
                    }
                }
                else {
                    if (Number(itemId) > 0) {
                        callSweetAlertWarning("Item update failed.");
                    }
                    else {
                        callSweetAlertWarning("Item add failed.");
                    }

                }
            });
        }
        else {
            if (name == "") {
                $('#txtProductName').css('border-bottom', errorClassBorder);
            } else {
                $('#txtProductName').css('border-bottom', bottomBorder);
            }
            if (categoryId == "0" || categoryId == "") {
                $('#productCategory').css('border-bottom', errorClassBorder);
            } else {
                $('#productCategory').css('border-bottom', bottomBorder);
            }
            if (productprice == "") {
                $('#txtProductPrice').css('border-bottom', errorClassBorder);
            } else {
                $('#txtProductPrice').css('border-bottom', bottomBorder);
            }
        }
    }
    else {
        self.app.router.navigate('/login_new/', { reloadCurrent: true });
    }
}
function BindCategoy(id) {

    var storeId = 0;
    storeId = SetStoreId();
    /*-------------HTML Start---------------------------------*/
    var innerHtml = "";
    //console.log("BindCategoy: " + storeId)
    if (storeId > 0) {
        var url = global + "/GetCategoyByStoreId?storeId=" + storeId;

        $.getJSON(url, function (data) {
            console.log(data)
            if (data.replace(/"/g, "").indexOf("No record(s) found.") > -1) {

            }
            else {

                $('#' + id).html("<option value=\"0\">Category</option>");
                $('#' + id).append(data);
            }
        });
        // $('#' + id).prop('selectedIndex', 0);
        //  
    }

}
function BindAddUpdateCategoy(id) {

    var storeId = 0;
    storeId = SetStoreId();
    /*-------------HTML Start---------------------------------*/
    var innerHtml = "";
    //console.log("BindCategoy: " + storeId)
    if (storeId > 0) {
        var url = global + "/GetCategoyByStoreId?storeId=" + storeId;

        $.getJSON(url, function (data) {
            //console.log(data)
            if (data.replace(/"/g, "").indexOf("No record(s) found.") > -1) {

            }
            else {
                $('#' + id).html("<option value=\"0\">Category</option>");
                $('#' + id).append(data);


            }
        });
        // $('#' + id).prop('selectedIndex', 0);
        //  
    }

}
//Profile Section End//

//Coupon Section Start//

function CouponList(pagesize, currentPage) {

    var storeId = 0;
    $("#CouponDiv").html("");
    storeId = SetStoreId();
    customerId = SetCustomerId();
    currentPage = 0;
    localStorage.setItem("CouponCurrentPage", currentPage);

    var name = $("#txtFilterCouponName").val();
    var startDate = $("#txtFilterCouponStart").val();
    var endDate = $("#txtFilterCouponEnd").val();
    var status = $("#ddlFilterCouponStatus").val();

    //Shorting
    var sortValue = $("input[name='radioCouponSort']:checked").val();
    var sortByValue = $("input[name='radioCouponSortBy']:checked").val();
    //Shorting

    if (name == undefined) {
        name = "";
    }
    if (startDate == undefined) {
        startDate = "";
    }
    if (endDate == undefined) {
        endDate = "";
    }
    if (status == undefined) {
        status = "";
    }
    if (sortValue == undefined) {
        sortValue = "";
    }
    if (sortByValue == undefined) {
        sortByValue = "";
    }

    if (Number(storeId) > 0) {

        url = global + "/GetAllCoupons?storeid=" + storeId + "&name=" + name + "&startDate=" + startDate + "&endDate=" + endDate + "&status=" + status +
           "&sortValue=" + sortValue + "&sortByValue=" + sortByValue + "&pagesize=" + pagesize + "&currentPage=" + currentPage;

        try {
            $.getJSON(url, function (data) {
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;
                if (JSON.parse(data).indexOf("No Coupon(s) found.") < 0) {
                    localStorage.setItem("CouponAvailable", "1");
                    var count = 0;
                    $.each(JSON.parse(data), function (index, value) {

                        var name = "";
                        var code = "";
                        var MinAmt = "";
                        var DiscAmt = "";
                        var StartDate = "";
                        var EndDate = "";

                        if (value.NAME != "") {
                            name = value.NAME;
                        }
                        if (value.CouponCode != "") {
                            code = value.CouponCode;
                        }
                        if (value.MinimumOrderAmount != "") {
                            MinAmt = FormatDecimal(value.MinimumOrderAmount);
                        }
                        else {
                            MinAmt = "$0.00";
                        }
                        if (value.DiscountAmount != "") {
                            DiscAmt = FormatDecimal(value.DiscountAmount);
                        }
                        else {
                            DiscAmt = "$0.00";
                        }
                        if (value.StartDateUtc != "") {
                            StartDate = value.StartDateUtc;
                        }
                        if (value.EndDateUtc != "") {
                            EndDate = value.EndDateUtc;
                        }

                        var html = "<div class=\"order-container\"  id='li_" + value.Id + "' style=\"width:100%;padding-left: 20px;\" >";
                        html += "<div id=\"dvCouponListInner_" + value.Id + "\" class=\"order-list \">";
                        html += "<div class=\"order-column-two\" style=\"width:100%\">";
                        html += "<div class=\"order-row-container\">";

                        /*------------------Name-----------------------*/
                        html += "<div class=\"order-pickup\"><div class=\"code\">" + code + "</div>";

                        if (value.IsActive == 1) {
                            html += "<div class=\"coupon-status-icon\"><img class=\"list-icon\" src=\"./img/icons/active.png\"></div>";
                        }
                        else {
                            html += "<div class=\"coupon-status-icon\"><img class=\"list-icon\" src=\"./img/icons/inactive.png\"></div>";
                        }
                        html += "</div>";
                        /*------------------Button-----------------------*/
                        html += "<div class=\"coupon-buttons\" style=\"width:15%\">";

                        html += "<a onclick=\"GoToCouponEdit(" + value.Id + ");\"><img src=\"./img/icons/edit-icon.png\"></a>";
                        html += "<a style=\"padding-left:10px;\" onclick=\"DeleteCoupon(" + value.Id + ");\"><img src=\"./img/icons/delete.png\"></a>";
                        html += "</div>";

                        html += "</div>";
                        html += "<div class=\"order-row-container\">";
                        html += "<div class=\"order-date\" style=\"width:55%\">";
                        html += "<div class=\"customer-detail-container\">";

                        /*------------------Code-----------------------*/
                        html += "<div class=\"order-number\" style=\"font-size:16px;width:100%\">" + name + "</div>";

                        if (value.StartDateUtc != "" && value.EndDateUtc != "") {
                            /*------------------Start Date Ende Date-----------------------*/
                            html += "<div class=\"giftcard-customer-name\">Start: <span class=\"cc-number\">" + StartDate + "</span></div>";
                            html += "<div class=\"giftcard-customer-name\">End: <span class=\"cc-number\">" + EndDate + "</span></div>";
                        }


                        html += "</div>";
                        html += "</div>";
                        html += "<div class=\"order-items-count\" style=\"width:45%; padding-left: 5px;\">";
                        html += "<div class=\"customer-detail-container\">";

                        /*------------------Discount Amount-----------------------*/
                        html += "<div class=\"cc-number\" style=\"width:100%;font-size:14px\">Discount Amount: <span class=\"order-price\" style=\"font-size:14px\">" + DiscAmt + "</span></div>"

                        /*------------------Minimun Amount-----------------------*/
                        html += "<div class=\"cc-number\" style=\"width:100%;font-size:14px\">Min. Order Amount: <span class=\"order-price\" style=\"font-size:14px\">" + MinAmt + "</span></div>";

                        html += "</div></div></div></div></div></div>";

                        count++;

                        $("#CouponDiv").append(html);
                    });
                }
                else {
                    localStorage.setItem("CouponAvailable", "0");
                    var html = "<div class=\"order-list list-empty-label-text\">No Coupons</div>";
                    $("#CouponDiv").html(html);
                }
            });
        }
        catch (e) {

        }
    }
    else {
        self.app.router.navigate('/login_new/', { reloadCurrent: true });
    }
}


function CouponListPagination(pagesize, currentPage) {

    var storeId = 0;
    storeId = SetStoreId();
    customerId = SetCustomerId();
    localStorage.setItem("CouponCurrentPage", currentPage);

    var name = $("#txtFilterCouponName").val();
    var startDate = $("#txtFilterCouponStart").val();
    var endDate = $("#txtFilterCouponEnd").val();
    var status = $("#ddlFilterCouponStatus").val();

    //Shorting
    var sortValue = $("input[name='radioCouponSort']:checked").val();
    var sortByValue = $("input[name='radioCouponSortBy']:checked").val();
    //Shorting

    if (name == undefined) {
        name = "";
    }
    if (startDate == undefined) {
        startDate = "";
    }
    if (endDate == undefined) {
        endDate = "";
    }
    if (status == undefined) {
        status = "";
    }
    if (sortValue == undefined) {
        sortValue = "";
    }
    if (sortByValue == undefined) {
        sortByValue = "";
    }

    if (Number(storeId) > 0) {
        currentPage = Number(currentPage) * Number(pagesize);
        url = global + "/GetAllCoupons?storeid=" + storeId + "&name=" + name + "&startDate=" + startDate + "&endDate=" + endDate + "&status=" + status +
            "&sortValue=" + sortValue + "&sortByValue=" + sortByValue + "&pagesize=" + pagesize + "&currentPage=" + currentPage;

        try {
            $.getJSON(url, function (data) {
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;
                if (JSON.parse(data).indexOf("No Coupon(s) found.") < 0) {
                    localStorage.setItem("CouponAvailable", "1");
                    var count = 0;
                    $.each(JSON.parse(data), function (index, value) {

                        var name = "";
                        var code = "";
                        var MinAmt = "";
                        var DiscAmt = "";
                        var StartDate = "";
                        var EndDate = "";

                        if (value.NAME != "") {
                            name = value.NAME;
                        }
                        if (value.CouponCode != "") {
                            code = value.CouponCode;
                        }
                        if (value.MinimumOrderAmount != "") {
                            MinAmt = FormatDecimal(value.MinimumOrderAmount);
                        }
                        else {
                            MinAmt = "$0.00";
                        }
                        if (value.DiscountAmount != "") {
                            DiscAmt = FormatDecimal(value.DiscountAmount);
                        }
                        else {
                            DiscAmt = "$0.00";
                        }
                        if (value.StartDateUtc != "") {
                            StartDate = value.StartDateUtc;
                        }
                        if (value.EndDateUtc != "") {
                            EndDate = value.EndDateUtc;
                        }

                        var html = "<div class=\"order-container\"  id='li_" + value.Id + "' style=\"width:100%;padding-left: 20px;\" >";
                        html += "<div id=\"dvCouponListInner_" + value.Id + "\" class=\"order-list \">";
                        html += "<div class=\"order-column-two\" style=\"width:100%\">";
                        html += "<div class=\"order-row-container\">";

                        /*------------------Name-----------------------*/
                        html += "<div class=\"order-pickup\"><div class=\"code\">" + code + "</div>";

                        if (value.IsActive == 1) {
                            html += "<div class=\"coupon-status-icon\"><img class=\"list-icon\" src=\"./img/icons/active.png\"></div>";
                        }
                        else {
                            html += "<div class=\"coupon-status-icon\"><img class=\"list-icon\" src=\"./img/icons/inactive.png\"></div>";
                        }
                        html += "</div>";
                        /*------------------Button-----------------------*/
                        html += "<div class=\"coupon-buttons\" style=\"width:15%\">";

                        html += "<a onclick=\"GoToCouponEdit(" + value.Id + ");\"><img src=\"./img/icons/edit-icon.png\"></a>";
                        html += "<a style=\"padding-left:10px;\" onclick=\"DeleteCoupon(" + value.Id + ");\"><img src=\"./img/icons/delete.png\"></a>";
                        html += "</div>";

                        html += "</div>";
                        html += "<div class=\"order-row-container\">";
                        html += "<div class=\"order-date\" style=\"width:55%\">";
                        html += "<div class=\"customer-detail-container\">";

                        /*------------------Code-----------------------*/
                        html += "<div class=\"order-number\" style=\"font-size:16px;width:100%\">" + name + "</div>";

                        if (value.StartDateUtc != "" && value.EndDateUtc != "") {
                            /*------------------Start Date Ende Date-----------------------*/
                            html += "<div class=\"giftcard-customer-name\">Start: <span class=\"cc-number\">" + StartDate + "</span></div>";
                            html += "<div class=\"giftcard-customer-name\">End: <span class=\"cc-number\">" + EndDate + "</span></div>";
                        }


                        html += "</div>";
                        html += "</div>";
                        html += "<div class=\"order-items-count\" style=\"width:45%; padding-left: 5px;\">";
                        html += "<div class=\"customer-detail-container\">";

                        /*------------------Discount Amount-----------------------*/
                        html += "<div class=\"cc-number\" style=\"width:100%;font-size:14px\">Discount Amount: <span class=\"order-price\" style=\"font-size:14px\">" + DiscAmt + "</span></div>"

                        /*------------------Minimun Amount-----------------------*/
                        html += "<div class=\"cc-number\" style=\"width:100%;font-size:14px\">Min. Order Amount: <span class=\"order-price\" style=\"font-size:14px\">" + MinAmt + "</span></div>";

                        html += "</div></div></div></div></div></div>";

                        count++;

                        $("#CouponDiv").append(html);
                    });
                }
                else {
                    localStorage.setItem("CouponAvailable", "0");
                }
            });
        }
        catch (e) {

        }
    }
    else {
        self.app.router.navigate('/login_new/', { reloadCurrent: true });
    }
}
function DeleteCoupon(id) {
    if (id > 0) {
        if (confirm("Are you sure want to delete this record?")) {
            $.ajax({
                url: global + '/DeleteCouponById?couponId=' + id,
                type: 'POST',
                cache: false,
                success: function (response) {
                    if (response.indexOf("Successful" > -1)) {
                        callSweetAlertSuccess("Coupon deleted successfully.");
                        CouponList(10, 0);
                    }
                    else {
                        callSweetAlertWarning("Unable to delete coupon.");
                    }
                }
            });
        }
        return false;
    }
}

function OpenCouponListDetails(id) {

    var storeId = 0;
    storeId = SetStoreId();
    var moCount = 1; var tuCount = 1; var weCount = 1; var thCount = 1; var frCount = 1; var saCount = 1; var suCount = 1;

    /*-------------HTML Start---------------------------------*/
    var innerHtml = "";

    if (id > 0) {
        $("#dvCoupon").html("");
        var url = global + "/GetCouponByDiscountId?storeId=" + storeId + "&discountId=" + id;

        $.getJSON(url, function (data) {
            $("#dvCoupon").html("<div class=\"order-number\" style=\"font-size:20px;width:100%;padding-top:0px;text-align:center;\" id=\"dvInnerSundayTiming\">No record found</div>");
            if (data.replace(/"/g, "").indexOf("No record(s) found.") > -1) {

            }
            else {

                $.each(JSON.parse(data), function (index, value) {
                    if (value.Type == "DiscountTiming") {
                        $("#dvCoupon").html("");
                        var dayName = "";
                        var timingId = 0;
                        var day = "";
                        var openingTime = "";
                        var openingHour = "";
                        var openingMinute = "";
                        var openingPeriod = "";
                        var closingTime = "";
                        var closingHour = "";
                        var closingMinute = "";
                        var closingPeriod = "";
                        if (value.TimingId > 0) {
                            timingId = value.TimingId;
                        }
                        if (value.Day != "") {
                            day = value.Day;

                        }
                        if (value.StartTime != "") {
                            openingTime = value.StartTime;
                        }
                        if (value.EndTime != "") {
                            closingTime = value.EndTime;
                        }
                        innerHtml = "<div class=\"customer-detail-container\">";

                        if (day == "Mo") {
                            dayName = "Monday";
                            if (moCount == 1) {
                                innerHtml += "<div class=\"order-number\" style=\"font-size:20px;width:100%;padding-top:15px\" id=\"dvInnerMondayTiming\">" + dayName + ": <span class=\"cc-number\" style=\"font-size:16px\">" + openingTime + "</span><span> - </span><span class=\"cc-number\" style=\"font-size:16px\">" + closingTime + "</span></div>";
                            }
                            else {
                                $('#dvInnerMondayTiming').append("<span class=\"cc-number\" style=\"font-size:16px\">, " + openingTime + "</span><span> - </span><span class=\"cc-number\" style=\"font-size:16px\">" + closingTime + "</span>");
                            }

                            innerHtml += "</div>";
                            moCount++;
                        }
                        if (day == "Tu") {
                            dayName = "Tuesday";
                            if (tuCount == 1) {
                                innerHtml += "<div class=\"order-number\" style=\"font-size:20px;width:100%;padding-top:15px\" id=\"dvInnerTuesdayTiming\">" + dayName + ": <span class=\"cc-number\" style=\"font-size:16px\">" + openingTime + "</span><span> - </span><span class=\"cc-number\" style=\"font-size:16px\">" + closingTime + "</span></div>";
                            }
                            else {
                                $('#dvInnerTuesdayTiming').append("<span class=\"cc-number\" style=\"font-size:16px\">, " + openingTime + "</span><span> - </span><span class=\"cc-number\" style=\"font-size:16px\">" + closingTime + "</span>");
                            }
                            innerHtml += "</div>";
                            tuCount++;
                        }
                        if (day == "We") {
                            dayName = "Wednesday";
                            if (weCount == 1) {
                                innerHtml += "<div class=\"order-number\" style=\"font-size:20px;width:100%;padding-top:15px\" id=\"dvInnerWednessdayTiming\">" + dayName + ": <span class=\"cc-number\" style=\"font-size:16px\">" + openingTime + "</span><span> - </span><span class=\"cc-number\" style=\"font-size:16px\">" + closingTime + "</span></div>";
                            }
                            else {
                                $('#dvInnerWednessdayTiming').append("<span class=\"cc-number\" style=\"font-size:16px\">, " + openingTime + "</span><span> - </span><span class=\"cc-number\" style=\"font-size:16px\">" + closingTime + "</span>");
                            }
                            innerHtml += "</div>";
                            weCount++;
                        }
                        if (day == "Th") {
                            dayName = "Thursday";
                            if (thCount == 1) {
                                innerHtml += "<div class=\"order-number\" style=\"font-size:20px;width:100%;padding-top:15px\" id=\"dvInnerThursdayTiming\">" + dayName + ": <span class=\"cc-number\" style=\"font-size:16px\">" + openingTime + "</span><span> - </span><span class=\"cc-number\" style=\"font-size:16px\">" + closingTime + "</span></div>";
                            }
                            else {
                                $('#dvInnerThursdayTiming').append("<span class=\"cc-number\" style=\"font-size:16px\">, " + openingTime + "</span><span> - </span><span class=\"cc-number\" style=\"font-size:16px\">" + closingTime + "</span>");
                            }
                            innerHtml += "</div>";
                            thCount++;
                        }
                        if (day == "Fr") {
                            dayName = "Friday";
                            if (frCount == 1) {
                                innerHtml += "<div class=\"order-number\" style=\"font-size:20px;width:100%;padding-top:15px\" id=\"dvInnerFridayTiming\">" + dayName + ": <span class=\"cc-number\" style=\"font-size:16px\">" + openingTime + "</span><span> - </span><span class=\"cc-number\" style=\"font-size:16px\">" + closingTime + "</span></div>";
                            }
                            else {
                                $('#dvInnerFridayTiming').append("<span class=\"cc-number\" style=\"font-size:16px\">, " + openingTime + "</span><span> - </span><span class=\"cc-number\" style=\"font-size:16px\">" + closingTime + "</span>");
                            }
                            innerHtml += "</div>";
                            frCount++;
                        }
                        if (day == "Sa") {
                            dayName = "Saturday";
                            if (saCount == 1) {
                                innerHtml += "<div class=\"order-number\" style=\"font-size:20px;width:100%;padding-top:15px\" id=\"dvInnerSaturdayTiming\">" + dayName + ": <span class=\"cc-number\" style=\"font-size:16px\">" + openingTime + "</span><span> - </span><span class=\"cc-number\" style=\"font-size:16px\">" + closingTime + "</span></div>";
                            }
                            else {
                                $('#dvInnerSaturdayTiming').append("<span class=\"cc-number\" style=\"font-size:16px\">, " + openingTime + "</span><span> - </span><span class=\"cc-number\" style=\"font-size:16px\">" + closingTime + "</span>");
                            }
                            innerHtml += "</div>";
                            saCount++;
                        }
                        if (day == "Su") {
                            dayName = "Sunday";
                            if (suCount == 1) {
                                innerHtml += "<div class=\"order-number\" style=\"font-size:20px;width:100%;padding-top:15px\" id=\"dvInnerSundayTiming\">" + dayName + ": <span class=\"cc-number\" style=\"font-size:16px\">" + openingTime + "</span><span> - </span><span class=\"cc-number\" style=\"font-size:16px\">" + closingTime + "</span></div>";
                            }
                            else {
                                $('#dvInnerSundayTiming').append("<span class=\"cc-number\" style=\"font-size:16px\">, " + openingTime + "</span><span> - </span><span class=\"cc-number\" style=\"font-size:16px\">" + closingTime + "</span>");
                            }
                            innerHtml += "</div>";
                            suCount++;
                        }
                        $("#dvCoupon").append(innerHtml);
                    }


                });
            }
        });

        //$("#dvCouponDetails").html($("#dvCouponDetailInner").html());
        //$("#dvDetailsPanel").html($("#dvCouponDetailInner").html());
        $('#dvDetailsPanel').html($('#coupon_list #dvCouponDetailInner').html());
    }

}

function ClearCouponDetails() {
    $('#dvCouponDetailInner').hide();
    $('#dvCouponDetails').html("");
}

function GoToCouponEdit(couponId) {
    localStorage.setItem("HiddenDiscountId", couponId);
    self.app.router.navigate('/coupon/', { reloadCurrent: false });
}

function LoadCouponEdit() {
    var couponId = 0;
    if (localStorage.getItem("HiddenDiscountId") != null) {
        couponId = localStorage.getItem("HiddenDiscountId").trim();
    }
    $('.div-contentTiming').remove();
    $('#hdnCouponTimingCount').val(8);
    var storeId = 0;
    storeId = SetStoreId();
    var moCount = 1; var tuCount = 1; var weCount = 1; var thCount = 1; var frCount = 1; var saCount = 1; var suCount = 1;
    if (Number(storeId > 0)) {
        if (Number(couponId) > 0) {
            $("#liDiscountTiming").show();
            $("#hdnDiscountId").val(couponId);
            var url = global + "/GetCouponByDiscountId?storeId=" + storeId + "&discountId=" + couponId;

            $.getJSON(url, function (data) {
                if (data.replace(/"/g, "").indexOf("No record(s) found.") > -1) {

                }
                else {
                    //localStorage.setItem("HiddenDiscountId", 0);
                    $.each(JSON.parse(data), function (index, value) {
                        //console.log(data);
                        //console.log(value); 
                        var count = 0;
                        if (value.Type == "DiscountInfo") {
                            if (value.Name != "") {
                                $("#txtCouponName").val(value.Name);
                            }
                            if (value.CouponCode != "") {
                                $("#txtCouponCode").val(value.CouponCode);
                            }
                            if (value.IsActive == true) {
                                $("#checkCouponActive").prop('checked', true)
                            }
                            else {
                                $("#checkCouponActive").prop('checked', false)
                            }
                            if (value.MinimumOrderAmount > 0) {
                                var mimimumOrderAmount = FormatDecimal(value.MinimumOrderAmount);
                                if (mimimumOrderAmount.indexOf('$') > -1) {
                                    mimimumOrderAmount = mimimumOrderAmount.replace('$', '');
                                }
                                $("#txtCouponMinAmount").val(mimimumOrderAmount);
                                //console.log(value.MinimumOrderAmount);
                            }
                            else {
                                $("#txtCouponMinAmount").val(FormatDecimal(0.00).replace('$', ''));
                            }
                            if (value.DiscountAmount > 0) {
                                var discountAmount = FormatDecimal(value.DiscountAmount);
                                if (discountAmount.indexOf('$') > -1) {
                                    discountAmount = discountAmount.replace('$', '');
                                }
                                $("#txtCouponDiscAmount").val(discountAmount);
                                //console.log(value.DiscountAmount);
                            }
                            else {
                                $("#txtCouponDiscAmount").val(FormatDecimal(0.00).replace('$', ''));
                            }
                            if (value.StartDateUtc != null) {
                                $("#txtCouponStartDate").val(value.StartDateUtc);
                                console.log("StartDate: " + value.StartDateUtc);
                            }
                            if (value.EndDateUtc != null) {
                                $("#txtCouponEndDate").val(value.EndDateUtc);
                                console.log("EndDate: " + value.EndDateUtc);
                            }
                        }
                        else if (value.Type == "DiscountTiming") {
                            var dayName = "";
                            var timingId = 0;
                            var day = "";
                            var openingTime = "";
                            var openingHour = "";
                            var openingMinute = "";
                            var openingPeriod = "";
                            var closingTime = "";
                            var closingHour = "";
                            var closingMinute = "";
                            var closingPeriod = "";
                            if (value.TimingId > 0) {
                                timingId = value.TimingId;
                            }
                            if (value.Day != "") {
                                day = value.Day;
                            }
                            if (value.StartTime != "") {
                                openingTime = value.StartTime;
                                if (value.STARTHOUR != "") {
                                    openingHour = value.STARTHOUR;
                                }
                                if (value.STARTMINUTE != "") {
                                    openingMinute = value.STARTMINUTE;
                                }
                                if (value.STARTPERIOD != "") {
                                    openingPeriod = value.STARTPERIOD;
                                }
                            }
                            if (value.EndTime != "") {
                                closingTime = value.EndTime;
                                if (value.ENDHOUR != "") {
                                    closingHour = value.ENDHOUR;
                                }
                                if (value.ENDMINUTE != "") {
                                    closingMinute = value.ENDMINUTE;
                                }
                                if (value.ENDPERIOD != "") {
                                    closingPeriod = value.ENDPERIOD;
                                }
                            }
                            //console.log("TimingId: " + timingId + " Day: " + day + " OpeningTime: " + openingTime + " ClosingTime: " + closingTime);
                            //console.log("Opening: Hour: " + openingHour + " Minute: " + openingMinute + " Period: " + openingPeriod + " Closing: Hour: " + closingHour + " Minute: " + closingMinute + " Period: " + closingPeriod);
                            //dayName = GetDayNameByDayKey(day);

                            //Generate Edit Section Start//
                            var hdnCount = $('#hdnCount').val();

                            if (day == "Mo") {
                                $('#Offerday_0_IsCheck').prop('checked', true);
                                dayName = "Monday";
                                if (moCount > 1) {
                                    AppendEditTimingSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                    moCount++;
                                }
                                else {
                                    $("#Offerday_0_DiscountTimingId").val(timingId)
                                    $("#Offerday_0_StartHour").val(openingHour);
                                    $("#Offerday_0_StartMinute").val(openingMinute);
                                    $("#Offerday_0_StartPeriod").val(openingPeriod);

                                    $("#Offerday_0_EndHour").val(closingHour);
                                    $("#Offerday_0_EndMinute").val(closingMinute);
                                    $("#Offerday_0_EndPeriod").val(closingPeriod);
                                    moCount++;
                                }
                            }
                            else if (day == "Tu") {
                                $('#Offerday_1_IsCheck').prop('checked', true);
                                dayName = "Tuesday";
                                if (tuCount > 1) {
                                    AppendEditTimingSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                    tuCount++;
                                }
                                else {
                                    $("#Offerday_1_DiscountTimingId").val(timingId)
                                    $("#Offerday_1_StartHour").val(openingHour);
                                    $("#Offerday_1_StartMinute").val(openingMinute);
                                    $("#Offerday_1_StartPeriod").val(openingPeriod);

                                    $("#Offerday_1_EndHour").val(closingHour);
                                    $("#Offerday_1_EndMinute").val(closingMinute);
                                    $("#Offerday_1_EndPeriod").val(closingPeriod);
                                    tuCount++;
                                }
                            }
                            else if (day == "We") {
                                $('#Offerday_2_IsCheck').prop('checked', true);
                                dayName = "Wednesday";
                                if (weCount > 1) {
                                    AppendEditTimingSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                    weCount++;
                                }
                                else {
                                    $("#Offerday_2_DiscountTimingId").val(timingId)
                                    $("#Offerday_2_StartHour").val(openingHour);
                                    $("#Offerday_2_StartMinute").val(openingMinute);
                                    $("#Offerday_2_StartPeriod").val(openingPeriod);

                                    $("#Offerday_2_EndHour").val(closingHour);
                                    $("#Offerday_2_EndMinute").val(closingMinute);
                                    $("#Offerday_2_EndPeriod").val(closingPeriod);
                                    weCount++;
                                }
                            }
                            else if (day == "Th") {
                                $('#Offerday_3_IsCheck').prop('checked', true);
                                dayName = "Thursday";
                                if (thCount > 1) {
                                    AppendEditTimingSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                    thCount++;
                                }
                                else {
                                    $("#Offerday_3_DiscountTimingId").val(timingId)
                                    $("#Offerday_3_StartHour").val(openingHour);
                                    $("#Offerday_3_StartMinute").val(openingMinute);
                                    $("#Offerday_3_StartPeriod").val(openingPeriod);

                                    $("#Offerday_3_EndHour").val(closingHour);
                                    $("#Offerday_3_EndMinute").val(closingMinute);
                                    $("#Offerday_3_EndPeriod").val(closingPeriod);
                                    thCount++;
                                }
                            }
                            else if (day == "Fr") {
                                $('#Offerday_4_IsCheck').prop('checked', true);
                                dayName = "Friday";
                                if (frCount > 1) {
                                    AppendEditTimingSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                    frCount++;
                                }
                                else {
                                    $("#Offerday_4_DiscountTimingId").val(timingId)
                                    $("#Offerday_4_StartHour").val(openingHour);
                                    $("#Offerday_4_StartMinute").val(openingMinute);
                                    $("#Offerday_4_StartPeriod").val(openingPeriod);

                                    $("#Offerday_4_EndHour").val(closingHour);
                                    $("#Offerday_4_EndMinute").val(closingMinute);
                                    $("#Offerday_4_EndPeriod").val(closingPeriod);
                                    frCount++;
                                }
                            }
                            else if (day == "Sa") {
                                $('#Offerday_5_IsCheck').prop('checked', true);
                                dayName = "Saturday";
                                if (saCount > 1) {
                                    AppendEditTimingSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                    saCount++;
                                }
                                else {
                                    $("#Offerday_5_DiscountTimingId").val(timingId)
                                    $("#Offerday_5_StartHour").val(openingHour);
                                    $("#Offerday_5_StartMinute").val(openingMinute);
                                    $("#Offerday_5_StartPeriod").val(openingPeriod);

                                    $("#Offerday_5_EndHour").val(closingHour);
                                    $("#Offerday_5_EndMinute").val(closingMinute);
                                    $("#Offerday_5_EndPeriod").val(closingPeriod);
                                    saCount++;
                                }
                            }
                            else if (day == "Su") {
                                $('#Offerday_6_IsCheck').prop('checked', true);
                                dayName = "Sunday";
                                if (suCount > 1) {
                                    AppendEditTimingSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                    suCount++;
                                }
                                else {
                                    $("#Offerday_6_DiscountTimingId").val(timingId)
                                    $("#Offerday_6_StartHour").val(openingHour);
                                    $("#Offerday_6_StartMinute").val(openingMinute);
                                    $("#Offerday_6_StartPeriod").val(openingPeriod);

                                    $("#Offerday_6_EndHour").val(closingHour);
                                    $("#Offerday_6_EndMinute").val(closingMinute);
                                    $("#Offerday_6_EndPeriod").val(closingPeriod);
                                    suCount++;
                                }
                            }
                            //Generate Edit Section End//
                        }
                    });
                }
            });
        }
        else {
            //self.app.router.navigate('/login_new/', { reloadCurrent: true });
        }
    }
    else {
        self.app.router.navigate('/login_new/', { reloadCurrent: true });
    }
}


function SaveDiscount() {
    var discountId = 0;
    discountId = $("#hdnDiscountId").val();

    var customerId = 0;
    customerId = localStorage.getItem("CustomerId");
    var storeId = 0;
    storeId = SetStoreId();
    var name = $('#txtCouponName').val();
    var couponCode = $("#txtCouponCode").val();
    var isActive = false;
    if ($("#checkCouponActive").prop("checked") == true) {
        isActive = true;
    }
    var minimunOrderAmount = $("#txtCouponMinAmount").val();
    var discountAmount = $("#txtCouponDiscAmount").val();
    var startDate = $("#txtCouponStartDate").val();
    var endDate = $("#txtCouponEndDate").val();

    var hdnCount = $("#hdnCouponTimingCount").val();
    var arrTimings = [];
    var offerDays = [];
    for (var i = 0; i < 8; i++) {
        var dayKey = $("#Offerday_" + i + "_DayKey").val();
        if ($("#Offerday_" + i + "_IsCheck").prop("checked") == true) {
            offerDays.push(dayKey);
        }
    }

    for (var j = 0; j <= hdnCount; j++) {
        var valueTimingId = 0;
        var valueDayKey = "";
        if ($("#Offerday_" + j + "_DayKey").length) {
            valueDayKey = $("#Offerday_" + j + "_DayKey").val();
            var openingHour = "";
            var openingMinute = "";
            var openingPeriod = "";
            var closingHour = "";
            var closingMinute = "";
            var closingPeriod = "";
            var openingTime = "";
            var closingTime = "";
            if ($("#Offerday_" + j + "_DiscountTimingId").length) {
                valueTimingId = $("#Offerday_" + j + "_DiscountTimingId").val();
            }

            openingHour = $("#Offerday_" + j + "_StartHour").val();
            openingMinute = $("#Offerday_" + j + "_StartMinute").val();
            openingPeriod = $("#Offerday_" + j + "_StartPeriod").val();
            openingTime = openingHour + ":" + openingMinute + " " + openingPeriod;

            closingHour = $("#Offerday_" + j + "_EndHour").val();
            closingMinute = $("#Offerday_" + j + "_EndMinute").val();
            closingPeriod = $("#Offerday_" + j + "_EndPeriod").val();
            closingTime = closingHour + ":" + closingMinute + " " + closingPeriod;

            var currentValue = { TimingId: valueTimingId, Daykey: valueDayKey, StartTime: openingTime, EndTime: closingTime }
            arrTimings.push(currentValue);
        }
    }

    //console.log(offerDays);
    //console.log(arrTimings);

    if (Number(storeId) > 0) {
        if (name != "" && couponCode != "") {
            $('#txtCouponName').css('border-bottom', bottomBorder);
            $('#txtCouponCode').css('border-bottom', bottomBorder);
            var model = new Object();
            model.CustomerId = customerId;
            model.DiscountId = discountId;
            model.StoreId = storeId;
            model.Name = name;
            model.CouponCode = couponCode;
            model.IsActive = isActive;
            model.MinimumOrderAmount = minimunOrderAmount;
            model.DiscountAmount = discountAmount;
            model.StartDateUtc = startDate;
            model.EndDateUtc = endDate;

            model.OfferDays = offerDays;
            model.ListTiming = arrTimings;
            console.log(model);


            $.post(global + "/SaveDiscont", model, function (data) {
                // console.log(data.indexOf("Successful"));
                if (data.indexOf("Successful") > -1 || data == "") {
                    //LoadCouponEdit();
                    if (discountId > 0) {
                        swal({
                            title: "Coupon updated successfully.",
                            confirmButtonText: "OK",
                            type: "success",
                            confirmButtonClass: 'btn btn-success',
                            buttonsStyling: false,
                            customClass: 'swal-wide',
                        }).then(function () {
                            self.app.router.navigate('/coupon_list/', { reloadCurrent: false });
                        });;
                    }
                    else {
                        swal({
                            title: "Coupon added successfully.",
                            confirmButtonText: "OK",
                            type: "success",
                            confirmButtonClass: 'btn btn-success',
                            buttonsStyling: false,
                            customClass: 'swal-wide',
                        }).then(function () {
                            self.app.router.navigate('/coupon_list/', { reloadCurrent: false });
                        });;
                    }

                }
                else {
                    if (discountId > 0) {
                        callSweetAlertWarning("Coupon updated failed.");
                    }
                    else {
                        callSweetAlertWarning("Coupon add failed.");
                    }
                }
            });
        }
        else {
            if (name == "") {
                $('#txtCouponName').css('border-bottom', errorClassBorder);
            } else {
                $('#txtCouponName').css('border-bottom', bottomBorder);
            }
            if (couponCode == "") {
                $('#txtCouponCode').css('border-bottom', errorClassBorder);
            } else {
                $('#txtCouponCode').css('border-bottom', bottomBorder);
            }
        }

    }
    else {
        self.app.router.navigate('/login_new/', { reloadCurrent: true });
    }
}

function AddNewTimingSection(dayName, dayKey, e) {
    var hdnCount = $('#hdnCouponTimingCount').val();
    var idCount = parseInt(hdnCount) + 1;
    var removeParameter = idCount + "," + e;

    var html = "";
    //Html Start Section//
    html += "<div id=\"div_contentTiming_" + idCount + "\" class=\"div-contentTiming\">";
    //First Column Start//
    html += "<div class=\"timing-flex-column-container\">";
    //Label Section Start//
    html += "<div style=\"flex-basis: 120px;\">";
    html += "<label>Start</label>";
    html += "<input id=\"Offerday_" + idCount + "_CouponTimingId\" name=\"Offerday[" + idCount + "].CouponTimingId\" type=\"hidden\" value=\"0\">";
    html += "<input id=\"Offerday_" + idCount + "_DayKey\" name=\"Offerday[" + idCount + "].DayKey\" type=\"hidden\" value=\"" + dayKey + "\">";
    html += "</div>";
    //Label Section End//

    //Hour Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateHourTimingHtml(idCount, "Start");
    html += "</div>";
    //Hour Section End//

    //Minute Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateMinuteTimingHtml(idCount, "Start");
    html += "</div>";
    //Minute Section End//

    //Period Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreatePeriodTimingHtml(idCount, "Start");
    html += "</div>";
    //Period Section End//

    //Remove Icon Section Start//
    html += "<div style=\"flex-basis: 40px;\">";
    html += "<i id=\"remove_" + idCount + "\" class=\"material-icons\" onclick=\"RemoveTimingSection(" + removeParameter + ");\" style=\"color: #e80000;\">delete</i>";
    html += "</div>";
    //Remove Icon Section End//

    html += "</div>";
    //First Column End//

    //***********************//

    //Second Column Start//
    html += "<div class=\"timing-flex-column-container\">";
    //Label Section Start//
    html += "<div style=\"flex-basis: 120px;\">";
    html += "<label>End</label>";
    html += "</div>";
    //Label Section End//

    //Hour Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateHourTimingHtml(idCount, "End");
    html += "</div>";
    //Hour Section End//

    //Minute Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateMinuteTimingHtml(idCount, "End");
    html += "</div>";
    //Minute Section End//

    //Period Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreatePeriodTimingHtml(idCount, "End");
    html += "</div>";
    //Period Section End//

    //Remove Icon Section Start//
    html += "<div style=\"flex-basis: 40px;\">";
    html += "</div>";
    //Remove Icon Section End//

    html += "</div>";
    //Second Column Start//

    html += "</div>";
    //Html End Section//

    $("#div_" + dayName).append(html);
    $('#hdnCouponTimingCount').val(idCount);
}

function RemoveTimingSection(idCount, e) {
    $("#div_contentTiming_" + idCount + "").remove();
    var hdnCount = $('#hdnCouponTimingCount').val();
    var idCount = parseInt(hdnCount) - 1;
    $('#hdnCouponTimingCount').val(idCount);
}

function AppendEditTimingSection(timingId, dayName, dayKey, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod) {
    var hdnCount = $('#hdnCouponTimingCount').val();
    var idCount = parseInt(hdnCount) + 1;
    var removeParameter = idCount + "," + timingId;

    var html = "";
    //Html Start Section//
    html += "<div id=\"div_contentTiming_" + idCount + "\" class=\"div-contentTiming\">";
    //First Column Start//
    html += "<div class=\"timing-flex-column-container\">";
    //Label Section Start//
    html += "<div style=\"flex-basis: 120px;\">";
    html += "<label>Start</label>";
    html += "<input id=\"Offerday_" + idCount + "_DiscountTimingId\" name=\"Offerday[" + idCount + "].DiscountTimingId\" type=\"hidden\" value=\"" + timingId + "\">";
    html += "<input id=\"Offerday_" + idCount + "_DayKey\" name=\"Offerday[" + idCount + "].DayKey\" type=\"hidden\" value=\"" + dayKey + "\">";
    html += "</div>";
    //Label Section End//

    //Hour Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateHourEditTimingHtml(idCount, "Start", openingHour);
    html += "</div>";
    //Hour Section End//

    //Minute Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateMinuteEditTimingHtml(idCount, "Start", openingMinute);
    html += "</div>";
    //Minute Section End//

    //Period Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreatePeriodEditTimingHtml(idCount, "Start", openingPeriod);
    html += "</div>";
    //Period Section End//

    //Remove Icon Section Start//
    html += "<div style=\"flex-basis: 40px;\">";
    html += "<i id=\"remove_" + idCount + "\" class=\"material-icons\" onclick=\"DeleteTimingSection(" + removeParameter + ");\" style=\"color: #e80000;\">delete</i>";
    html += "</div>";
    //Remove Icon Section End//

    html += "</div>";
    //First Column End//

    //***********************//

    //Second Column Start//
    html += "<div class=\"timing-flex-column-container\">";
    //Label Section Start//
    html += "<div style=\"flex-basis: 120px;\">";
    html += "<label>End</label>";
    html += "</div>";
    //Label Section End//

    //Hour Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateHourEditTimingHtml(idCount, "End", closingHour);
    html += "</div>";
    //Hour Section End//

    //Minute Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateMinuteEditTimingHtml(idCount, "End", closingMinute);
    html += "</div>";
    //Minute Section End//

    //Period Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreatePeriodEditTimingHtml(idCount, "End", closingPeriod);
    html += "</div>";
    //Period Section End//

    //Remove Icon Section Start//
    html += "<div style=\"flex-basis: 40px;\">";
    html += "</div>";
    //Remove Icon Section End//

    html += "</div>";
    //Second Column Start//

    html += "</div>";
    //Html End Section//

    $("#div_" + dayName).append(html);
    $('#hdnCouponTimingCount').val(idCount);
    //return html;
}

function CreateHourTimingHtml(iCount, type) {
    var hourHtml = "";
    hourHtml += "<select id=\"Offerday_" + iCount + "_" + type + "Hour\" name=\"Offerday[" + iCount + "]." + type + "Hour\">";
    for (var i = 0; i < 12; i++) {
        if (i <= 9) {
            hourHtml += "<option value=\"0" + i + "\">0" + i + "</option>";
        }
        else {
            hourHtml += "<option value=\"" + i + "\">" + i + "</option>";
        }
    }
    hourHtml += "</select>";
    return hourHtml;
}
function CreateMinuteTimingHtml(iCount, type) {
    var minuteHtml = "";
    minuteHtml += "<select id=\"Offerday_" + iCount + "_" + type + "Minute\" name=\"Offerday[" + iCount + "]." + type + "Minute\">";
    for (var i = 0; i < 60; i++) {
        if (i <= 9) {
            minuteHtml += "<option value=\"0" + i + "\">0" + i + "</option>";
        }
        else {
            minuteHtml += "<option value=\"" + i + "\">" + i + "</option>";
        }
    }
    minuteHtml += "</select>";
    return minuteHtml;
}
function CreatePeriodTimingHtml(iCount, type) {
    var periodHtml = "";
    periodHtml += "<select id=\"Offerday_" + iCount + "_" + type + "Period\" name=\"Offerday[" + iCount + "]." + type + "Period\">";
    periodHtml += "<option value=\"AM\">AM</option>";
    periodHtml += "<option value=\"PM\">PM</option>";
    periodHtml += "</select>";
    return periodHtml;
}


function CreateHourEditTimingHtml(iCount, type, selectedHour) {
    var hourHtml = "";
    hourHtml += "<select id=\"Offerday_" + iCount + "_" + type + "Hour\" name=\"Offerday[" + iCount + "]." + type + "Hour\">";
    for (var i = 0; i < 12; i++) {
        var hour = "00";
        if (i <= 9) {
            hour = "0" + i;
        }
        else {
            hour = i;
        }
        if (hour == selectedHour || i == selectedHour) {
            hourHtml += "<option value=\"" + hour + "\" selected>" + hour + "</option>";
        }
        else {
            hourHtml += "<option value=\"" + hour + "\">" + hour + "</option>";
        }
    }
    hourHtml += "</select>";
    return hourHtml;
}
function CreateMinuteEditTimingHtml(iCount, type, selectedMinute) {
    var minuteHtml = "";
    minuteHtml += "<select id=\"Offerday_" + iCount + "_" + type + "Minute\" name=\"Offerday[" + iCount + "]." + type + "Minute\">";
    for (var i = 0; i < 60; i++) {
        var minute = "00";
        if (i <= 9) {
            minute = "0" + i;
        }
        else {
            minute = i;
        }
        if (minute == selectedMinute || i == selectedMinute) {
            minuteHtml += "<option value=\"" + minute + "\" selected>" + minute + "</option>";
        }
        else {
            minuteHtml += "<option value=\"" + i + "\">" + i + "</option>";
        }
    }
    minuteHtml += "</select>";
    return minuteHtml;
}
function CreatePeriodEditTimingHtml(iCount, type, period) {
    var periodHtml = "";
    periodHtml += "<select id=\"Offerday_" + iCount + "_" + type + "Period\" name=\"Offerday[" + iCount + "]." + type + "Period\">";
    if (period == "AM") {
        periodHtml += "<option value=\"AM\" selected>AM</option>";
        periodHtml += "<option value=\"PM\">PM</option>";
    }
    else if (period == "PM") {
        periodHtml += "<option value=\"AM\">AM</option>";
        periodHtml += "<option value=\"PM\" selected>PM</option>";
    }
    else {
        periodHtml += "<option value=\"AM\">AM</option>";
        periodHtml += "<option value=\"PM\">PM</option>";
    }
    periodHtml += "</select>";
    return periodHtml;
}


function DeleteTimingSection(idCount, timingId) {

    if (timingId > 0) {
        if (confirm("Are you sure want to delete this record?")) {
            $.ajax({
                url: global + '/DeleteDiscountTimingById?timingId=' + timingId,
                type: 'POST',
                cache: false,
                success: function (response) {
                    if (response.indexOf("Successful") > -1) {
                        $("#div_contentTiming_" + idCount).remove();
                        callSweetAlertSuccess("Timing deleted successfully.");
                    }
                    else {
                        callSweetAlertWarning("Unable to delete timing.");
                    }
                }
            });
        }
        return false;
    }
}

//Coupon Section End

//Product Section Start
function AddNewAvailTimingSection(dayName, dayKey, e) {
    var hdnCount = $('#hdnAvailTimingCount').val();
    var idCount = parseInt(hdnCount) + 1;
    var removeParameter = idCount + "," + e;

    var html = "";
    //Html Start Section//
    html += "<div id=\"div_contentAvailTiming_" + idCount + "\" class=\"div-contentTiming\">";
    //First Column Start//
    html += "<div class=\"timing-flex-column-container\">";
    //Label Section Start//
    html += "<div style=\"flex-basis: 120px;\">";
    html += "<label>Start</label>";
    html += "<input id=\"Avail_" + idCount + "_TimingId\" name=\"Avail[" + idCount + "].TimingId\" type=\"hidden\" value=\"0\">";
    html += "<input id=\"Avail_" + idCount + "_DayKey\" name=\"Avail[" + idCount + "].DayKey\" type=\"hidden\" value=\"" + dayKey + "\">";
    html += "</div>";
    //Label Section End//

    //Hour Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateAvailHourTimingHtml(idCount, "Start");
    html += "</div>";
    //Hour Section End//

    //Minute Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateAvailMinuteTimingHtml(idCount, "Start");
    html += "</div>";
    //Minute Section End//

    //Period Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateAvailPeriodTimingHtml(idCount, "Start");
    html += "</div>";
    //Period Section End//

    //Remove Icon Section Start//
    html += "<div style=\"flex-basis: 40px;\">";
    html += "<i id=\"remove_" + idCount + "\" class=\"material-icons\" onclick=\"RemoveAvailTimingSection(" + removeParameter + ");\" style=\"color: #e80000;\">delete</i>";
    html += "</div>";
    //Remove Icon Section End//

    html += "</div>";
    //First Column End//

    //***********************//

    //Second Column Start//
    html += "<div class=\"timing-flex-column-container\">";
    //Label Section Start//
    html += "<div style=\"flex-basis: 120px;\">";
    html += "<label>End</label>";
    html += "</div>";
    //Label Section End//

    //Hour Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateAvailHourTimingHtml(idCount, "End");
    html += "</div>";
    //Hour Section End//

    //Minute Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateAvailMinuteTimingHtml(idCount, "End");
    html += "</div>";
    //Minute Section End//

    //Period Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateAvailPeriodTimingHtml(idCount, "End");
    html += "</div>";
    //Period Section End//

    //Remove Icon Section Start//
    html += "<div style=\"flex-basis: 40px;\">";
    html += "</div>";
    //Remove Icon Section End//

    html += "</div>";
    //Second Column Start//

    //***********************//

    //Third Column Start//
    html += "<div class=\"timing-flex-column-container\">";
    //Label Section Start//
    html += "<div style=\"flex-basis: 120px;\">";
    html += "<label>Price</label>";
    html += "</div>";
    //Label Section End//

    //Hour Section Start//
    html += "<div style=\"flex-basis: 240px;\">";
    html += "<input type=\"number\" min=\"1\" step=\"any\" id=\"Avail_" + idCount + "_Price\">";
    html += "</div>";
    //Hour Section End//

    //Remove Icon Section Start//
    html += "<div style=\"flex-basis: 40px;\">";
    html += "</div>";
    //Remove Icon Section End//

    html += "</div>";
    //Third Column Start//

    html += "</div>";
    //Html End Section//

    $("#div_" + dayName).append(html);
    $('#hdnAvailTimingCount').val(idCount);
}
function RemoveAvailTimingSection(idCount, e) {
    $("#div_contentAvailTiming_" + idCount + "").remove();
    var hdnCount = $('#hdnAvailTimingCount').val();
    var idCount = parseInt(hdnCount) - 1;
    $('#hdnAvailTimingCount').val(idCount);
}
function CreateAvailHourTimingHtml(iCount, type) {
    var hourHtml = "";
    hourHtml += "<select id=\"Avail_" + iCount + "_" + type + "Hour\" name=\"Avail[" + iCount + "]." + type + "Hour\">";
    for (var i = 0; i < 12; i++) {
        if (i <= 9) {
            hourHtml += "<option value=\"0" + i + "\">0" + i + "</option>";
        }
        else {
            hourHtml += "<option value=\"" + i + "\">" + i + "</option>";
        }
    }
    hourHtml += "</select>";
    return hourHtml;
}
function CreateAvailMinuteTimingHtml(iCount, type) {
    var minuteHtml = "";
    minuteHtml += "<select id=\"Avail_" + iCount + "_" + type + "Minute\" name=\"Avail[" + iCount + "]." + type + "Minute\">";
    for (var i = 0; i < 60; i++) {
        if (i <= 9) {
            minuteHtml += "<option value=\"0" + i + "\">0" + i + "</option>";
        }
        else {
            minuteHtml += "<option value=\"" + i + "\">" + i + "</option>";
        }
    }
    minuteHtml += "</select>";
    return minuteHtml;
}
function CreateAvailPeriodTimingHtml(iCount, type) {
    var periodHtml = "";
    periodHtml += "<select id=\"Avail_" + iCount + "_" + type + "Period\" name=\"Avail[" + iCount + "]." + type + "Period\">";
    periodHtml += "<option value=\"AM\">AM</option>";
    periodHtml += "<option value=\"PM\">PM</option>";
    periodHtml += "</select>";
    return periodHtml;
}
function AppendEditAvailTimingSection(timingId, dayName, dayKey, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod, price) {
    var hdnCount = $('#hdnAvailTimingCount').val();
    var idCount = parseInt(hdnCount) + 1;
    var removeParameter = idCount + "," + timingId;

    var html = "";
    //Html Start Section//
    html += "<div id=\"div_contentAvailTiming_" + idCount + "\" class=\"div-contentTiming\">";
    //First Column Start//
    html += "<div class=\"timing-flex-column-container\">";
    //Label Section Start//
    html += "<div style=\"flex-basis: 120px;\">";
    html += "<label>Start</label>";
    html += "<input id=\"Avail_" + idCount + "_TimingId\" name=\"Avail[" + idCount + "].TimingId\" type=\"hidden\" value=\"" + timingId + "\">";
    html += "<input id=\"Avail_" + idCount + "_DayKey\" name=\"Avail[" + idCount + "].DayKey\" type=\"hidden\" value=\"" + dayKey + "\">";
    html += "</div>";
    //Label Section End//

    //Hour Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateHourEditAvailTimingHtml(idCount, "Start", openingHour);
    html += "</div>";
    //Hour Section End//

    //Minute Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateMinuteEditAvailTimingHtml(idCount, "Start", openingMinute);
    html += "</div>";
    //Minute Section End//

    //Period Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreatePeriodEditAvailTimingHtml(idCount, "Start", openingPeriod);
    html += "</div>";
    //Period Section End//

    //Remove Icon Section Start//
    html += "<div style=\"flex-basis: 40px;\">";
    html += "<i id=\"remove_" + idCount + "\" class=\"material-icons\" onclick=\"DeleteAvailTimingSection(" + removeParameter + ");\" style=\"color: #e80000;\">delete</i>";
    html += "</div>";
    //Remove Icon Section End//

    html += "</div>";
    //First Column End//

    //***********************//

    //Second Column Start//
    html += "<div class=\"timing-flex-column-container\">";
    //Label Section Start//
    html += "<div style=\"flex-basis: 120px;\">";
    html += "<label>End</label>";
    html += "</div>";
    //Label Section End//

    //Hour Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateHourEditAvailTimingHtml(idCount, "End", closingHour);
    html += "</div>";
    //Hour Section End//

    //Minute Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreateMinuteEditAvailTimingHtml(idCount, "End", closingMinute);
    html += "</div>";
    //Minute Section End//

    //Period Section Start//
    html += "<div style=\"flex-basis: 80px;\">";
    html += CreatePeriodEditAvailTimingHtml(idCount, "End", closingPeriod);
    html += "</div>";
    //Period Section End//

    //Remove Icon Section Start//
    html += "<div style=\"flex-basis: 40px;\">";
    html += "</div>";
    //Remove Icon Section End//

    html += "</div>";
    //Second Column Start//

    //***********************//

    //Third Column Start//
    html += "<div class=\"timing-flex-column-container\">";
    //Label Section Start//
    html += "<div style=\"flex-basis: 120px;\">";
    html += "<label>Price</label>";
    html += "</div>";
    //Label Section End//

    //Hour Section Start//
    html += "<div style=\"flex-basis: 240px;\">";
    html += "<input type=\"number\" min=\"1\" step=\"any\" id=\"Avail_" + idCount + "_Price\" value=\"" + price + "\">";
    html += "</div>";
    //Hour Section End//

    //Remove Icon Section Start//
    html += "<div style=\"flex-basis: 40px;\">";
    html += "</div>";
    //Remove Icon Section End//

    html += "</div>";
    //Third Column Start//

    html += "</div>";
    //Html End Section//

    $("#div_" + dayName).append(html);
    $('#hdnAvailTimingCount').val(idCount);
    //return html;
}
function CreateHourEditAvailTimingHtml(iCount, type, selectedHour) {
    var hourHtml = "";
    hourHtml += "<select id=\"Avail_" + iCount + "_" + type + "Hour\" name=\"Avail[" + iCount + "]." + type + "Hour\">";
    for (var i = 0; i < 12; i++) {
        var hour = "00";
        if (i <= 9) {
            hour = "0" + i;
        }
        else {
            hour = i;
        }
        if (hour == selectedHour || i == selectedHour) {
            hourHtml += "<option value=\"" + hour + "\" selected>" + hour + "</option>";
        }
        else {
            hourHtml += "<option value=\"" + hour + "\">" + hour + "</option>";
        }
    }
    hourHtml += "</select>";
    return hourHtml;
}
function CreateMinuteEditAvailTimingHtml(iCount, type, selectedMinute) {
    var minuteHtml = "";
    minuteHtml += "<select id=\"Avail_" + iCount + "_" + type + "Minute\" name=\"Avail[" + iCount + "]." + type + "Minute\">";
    for (var i = 0; i < 60; i++) {
        var minute = "00";
        if (i <= 9) {
            minute = "0" + i;
        }
        else {
            minute = i;
        }
        if (minute == selectedMinute || i == selectedMinute) {
            minuteHtml += "<option value=\"" + minute + "\" selected>" + minute + "</option>";
        }
        else {
            minuteHtml += "<option value=\"" + i + "\">" + i + "</option>";
        }
    }
    minuteHtml += "</select>";
    return minuteHtml;
}
function CreatePeriodEditAvailTimingHtml(iCount, type, period) {
    var periodHtml = "";
    periodHtml += "<select id=\"Avail_" + iCount + "_" + type + "Period\" name=\"Avail[" + iCount + "]." + type + "Period\">";
    if (period == "AM") {
        periodHtml += "<option value=\"AM\" selected>AM</option>";
        periodHtml += "<option value=\"PM\">PM</option>";
    }
    else if (period == "PM") {
        periodHtml += "<option value=\"AM\">AM</option>";
        periodHtml += "<option value=\"PM\" selected>PM</option>";
    }
    else {
        periodHtml += "<option value=\"AM\">AM</option>";
        periodHtml += "<option value=\"PM\">PM</option>";
    }
    periodHtml += "</select>";
    return periodHtml;
}
function DeleteAvailTimingSection(idCount, timingId) {

    if (timingId > 0) {
        if (confirm("Are you sure want to delete this record?")) {
            $.ajax({
                url: global + '/DeleteProductTimingById?timingId=' + timingId,
                type: 'POST',
                cache: false,
                success: function (response) {
                    if (response.indexOf("Successful") > -1) {
                        $("#div_contentAvailTiming_" + idCount).remove();
                        callSweetAlertSuccess("Timing deleted successfully.");
                    }
                    else {
                        callSweetAlertWarning("Unable to delete timing.");
                    }
                }
            });
        }
        return false;
    }
}

//Product Section End

//Reset functionalities
function ResetRewardLoadRedeem() {
    //$("#txtMemberID_LoadRedeem").val("");
    //$("#txtPhone_LoadRedeem").val("");
    //$("#txtLastName_LoadRedeem").val("");
    $('input[type="text"]').val("");
    $('input[type="text"]').css('border-bottom', bottomBorder);
    $('input[type="number"]').val("");
    $('input[type="number"]').css('border-bottom', bottomBorder);
    $('#lblOurPoints').html("");
    $('#hdnCurrentStorePoints').val("0");
    $('#lblBistroPoints').html("");
    $('#lblRelatedPoints').html("");
    $('#lblName').html("");
    $("#lblPhone").html("");
    $('#iconPhone').hide();
    $('#lblEmail').html("");
    $('#tblRewardHistory tbody').html("");
    $('#reward_LoadRedeem #dvInner_Reward').hide();

    //$("#txtLoad_LoadRedeem").css('border-bottom', bottomBorder);
    //$("#txtRedeem_LoadRedeem").css('border-bottom', bottomBorder);
    //$("#txtPhone_LoadRedeem").css('border-bottom', bottomBorder);
    //$("#txtLastName_LoadRedeem").css('border-bottom', bottomBorder);
    $('#btnLoadReward').text("Load");
    $('#btnRedeemReward').text("Redeem");
    $('#dvOuter').hide();

    $("#btnLoadReward").attr("disabled", "disabled");
    $("#btnRedeemReward").attr("disabled", "disabled");
    $("#btnLoadReward").addClass("disabled");
    $("#btnRedeemReward").addClass("disabled");

    $$(".input-clear-button").click();
}
function ResetRewardNew() {

    $('input[type="text"]').val("");
    $('input[type="text"]').css('border-bottom', bottomBorder);
    $('input[type="number"]').val("");
    $('input[type="number"]').css('border-bottom', bottomBorder);
    $$(".input-clear-button").click();
    $("#btnCreate").text("Add Member");
}
function ResetGiftCardNew() {
    $('input[type="text"]').val("");
    $('input[type="text"]').css('border-bottom', bottomBorder);
    $('input[type="number"]').val("");
    $('input[type="number"]').css('border-bottom', bottomBorder);
    $$(".input-clear-button").click();
    $('#btnAddCard').text("Add Card");
}
function ResetGiftCardLoadRedeem() {
    $('input[type="text"]').val("");
    $('input[type="text"]').css('border-bottom', bottomBorder);
    $('input[type="number"]').val("");
    $('input[type="number"]').css('border-bottom', bottomBorder);
    $("#ddlRegister").val("0");
    $$(".input-clear-button").click();


    $('#lblCutomerName').html("");
    $("#lblCutomerPhone").html("");
    $('#iconPhone').hide();
    $('#iconEmail').hide();
    $("#lblEmail").html("");
    $('#hdnSelectedOrderId').val(0);
    $('#lblCurrentBalance').html("");
    $('#lblOriginalValue').html("");
    $('#tblRedeemHistory tbody').html("");
    $('#dvInner').hide();

    $('#btnRedeemGiftCard').text("Redeem"); 
    //$('#tab-giftcard-loadRedeem #btnLoadGiftCard').attr("disabled", true);
    //$('#tab-giftcard-loadRedeem #btnLoadGiftCard').addClass("disabled");
    //$("#tab-giftcard-loadRedeem #btnRedeemGiftCard").attr("disabled", true);
    //$('#tab-giftcard-loadRedeem #btnRedeemGiftCard').addClass("disabled");
    //$("#tab-giftcard-loadRedeem #btnRefundGiftCard").attr("disabled", true);
    //$('#tab-giftcard-loadRedeem #btnRefundGiftCard').addClass("disabled");

}
function ResetFilters(page) {
    //console.log(page)
    $('input[type="text"]').val("");
    $('input[type="text"]').css('border-bottom', bottomBorder);
    $('input[type="number"]').val("");
    $('input[type="number"]').css('border-bottom', bottomBorder);
    //$$(".input-clear-button").click();
    // $('input[name=radioCarryoutSort]').attr('checked', true);
    if (page == "carryout") {
        $("#ddlFilterCarryoutStatus")[0].selectedIndex = 0;
        $('[name="radioCarryoutSort"]')[0].checked = true;
        $('[name="radioCarryoutSortBy"]')[0].checked = true;
        //$("#phFilterOrderDateFrom").show();
        //$("#phFilterOrderDateTo").show();
        $('#txtFilterOrderDateFrom').flatpickr().clear();
        $('#txtFilterOrderDateTo').flatpickr().clear();
    }
    else if (page == "giftcardorders") {
        $("#ddlFilterStatus")[0].selectedIndex = 0;
        //$("#ddlFilterStatus").val("");
        //$('input[name="radioGiftCardSort"][value="DESC"]').prop("checked", true);
        //$('input[name="radioGiftCardSortBy"][value="Status"]').prop("checked", true);
        $('[name="radioGiftCardSort"]')[1].checked = true;
        $('[name="radioGiftCardSortBy"]')[0].checked = true;
    }
    else if (page == "giftcardhistory") {
        $("#ddlFilterHistoryStatus")[0].selectedIndex = 0;
        $("#ddlFilterHistoryType")[0].selectedIndex = 0;
        $("#phFilterGiftCardHistoryDate").show();
    }
    if (page == "coupons") {
        $("#ddlFilterCouponStatus")[0].selectedIndex = 0;
        //$("#ddlFilterCouponStatus").val("");
        //$('input[name="radioCouponSort"][value="DESC"]').prop("checked", true);
        $('[name="radioCouponSort"]')[1].checked = true;
        $('[name="radioCouponSortBy"]')[0].checked = true;
        $("#phFilterCouponStart").show();
        $("#phFilterCouponEnd").show();
    }
    if (page == "items") {
        //$("#ddlFilterItemStatus").val("");
        $("#ddlFilterItemStatus")[0].selectedIndex = 0;
        //$("#filterProductCategory").val("0");
        $("#filterProductCategory")[0].selectedIndex = 0;

        $('[name="radioItemSort"]')[0].checked = true;
        $('[name="radioItemSortBy"]')[0].checked = true;
    }
    if (page == "dinein_list") {
        $("#ddlFilterDineinStatus")[0].selectedIndex = 0;
        $("#phFilterDineinDate").show();
    }

}

//Pickup Time Change
function OpenPickupTimePopup() {
    var orderId = $("#dvCarryOutDetailsInner #hdnSelectedOrderId").val();
    var selectedPickupTime = $('#hdnSelectedOrderPickUpTime').val();
    console.log('orderId: ' + orderId)
   var storeId = SetStoreId();
    var html = "";

    if (orderId != undefined && Number(orderId > 0) && selectedPickupTime != "" && selectedPickupTime != undefined) {
        var url = global + "/GetCarryoutPickupTimings?storeid=" + storeId + "&pickupTime=" + selectedPickupTime;
        try{
            $.getJSON(url, function (data) {
                if (data.indexOf("No order(s) found.") > -1) {
                    console.log(GetCurrentDateTime() + " - " + " No new order(s) found", browser);
                }
                else {
                    var pickuptime = JSON.parse(data).PickUpTime;
                    console.log(pickuptime);
                    pickuptime.sort((a, b) => dateFromStr(a) - dateFromStr(b));
                    if (pickuptime.length > 0) {
                        var pickupcount = false;
                        var count = 0;
                        var pickuphtml = "<div class=\"popup-content-area\"><h2 class=\"popup-title\"><span style=\"font-size:18px;\">Change Pickup Time - <span style=\"font-weight:600;font-size: 20px;\">#" + orderId + "</span></span></h2>";
                        pickuphtml += "<div class=\"popup-button-area\">";
                        $.each(pickuptime, function (key, value1) {
                            if ($.inArray(selectedPickupTime.trim(), pickuptime) > -1) {

                                if (value1.trim() === selectedPickupTime.trim()) {
                                    //pickuphtml += "<button type=\"button\" onclick=\"SetCurrentPickupTime(" + value1 + ");\" class=\"swal2-styled popup-no pickup-time-box\">" + value1 + "</button>";
                                    pickupcount = true;
                                }
                                else {
                                    if (pickupcount === true) {
                                        if (selectedPickupTime.indexOf('@') > -1) {
                                            pickuphtml += "<button type=\"button\" onclick=\"SetCurrentPickupTime(this);\" class=\"swal2-styled pickup-time-box\">" + value1 + "</button>";
                                        }
                                        else {

                                            var now = new Date();
                                            var pickupdatetime = new Date(GetCurrentDateOnly() + " " + selectedPickupTime);
                                            var dropdownValueDateTime = new Date(GetCurrentDateOnly() + " " + value1);
                                            var minsDiff = Math.floor((dropdownValueDateTime.getTime() - now.getTime()) / 1000 / 60);
                                            var minsDiffFromPickUpTime = Math.floor((dropdownValueDateTime.getTime() - pickupdatetime.getTime()) / 1000 / 60);
                                            if (minsDiffFromPickUpTime <= 120) {
                                                if (minsDiff > 0) {
                                                    pickuphtml += "<button type=\"button\" onclick=\"SetCurrentPickupTime(this);\" class=\"swal2-styled pickup-time-box\">" + value1 + "</button>";
                                                }
                                                else {
                                                    pickuphtml += "<button type=\"button\" onclick=\"SetCurrentPickupTime(this);\" class=\"swal2-styled pickup-time-box\">" + value1 + "</button>";
                                                }

                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                if (minsDiffFromPickUpTime <= 120) {
                                    if (minsDiff > 0) {
                                        pickuphtml += "<button type=\"button\" onclick=\"SetCurrentPickupTime(this);\" class=\"swal2-styled pickup-time-box\">" + value1 + "</button>";
                                    }
                                    else {
                                        pickuphtml += "<button type=\"button\" onclick=\"SetCurrentPickupTime(this);\" class=\"swal2-styled pickup-time-box\">" + value1 + "</button>";
                                    }
                                }
                            }

                        });
                        pickuphtml += "</div>";
                        pickuphtml += "<input id=\"hdnCurrentSelectedPickupTime_" + orderId + "\" type=\"hidden\" value=\"" + selectedPickupTime + "\"/>";
                        pickuphtml += "<div class=\"popup-button-area\">";
                        pickuphtml += "<button id=\"btnChangePickupTimeSave\" onclick=\"ChangePickupTime();\" type=\"button\" class=\"popup-confirm swal2-styled\" aria-label=\"\" ";
                        pickuphtml += "style=\"background-color: rgb(59, 152, 71); border-left-color: rgb(59, 152, 71); border-right-color: rgb(59, 152, 71);display:none;\">Submit</button>";
                        pickuphtml += "<button type=\"button\" onclick=\"ClosePickupTimePopup();\" class=\"swal2-styled popup-no\" aria-label=\"\" style=\"display: inline-block; background-color: rgb(233, 88, 97);\">Close</button>";
                        pickuphtml += "</div></div>";


                        //alert(pickuphtml);
                        $('#pickupTimePopup').html(pickuphtml);
                        $(".popup-overlay").show();
                        $('#pickupTimePopup').show();
                    }
                }
            });

        }
        catch (e) {
            console.log(GetCurrentDateTime() + " - " + " Error GetCarryoutPickupTimings", browser);
        }

    }
}

function ClosePickupTimePopup() {
    $('#pickupTimePopup').html("");
    $(".popup-overlay").hide();
    $('#pickupTimePopup').hide();
}

function SetCurrentPickupTime(elm) {
    var orderId = $("#dvCarryOutDetailsInner #hdnSelectedOrderId").val();
    var pickupTime = $(elm).text();
    $('#hdnCurrentSelectedPickupTime_' + orderId).val(pickupTime);
    $(".popup-button-area button").removeClass("pickup-time-box-focus");
    $(elm).addClass("pickup-time-box-focus");
    $('#btnChangePickupTimeSave').show();
}

function ChangePickupTime() {
    var restaurantDisplayName = "";
    if (localStorage.getItem("RestaurantName") != null)
        restaurantDisplayName = localStorage.getItem("RestaurantName").trim();
    //alert(restaurantDisplayName);
    var storeId = SetStoreId();
    //alert(storeId);
    var orderId = $("#dvCarryOutDetailsInner #hdnSelectedOrderId").val();
    //alert(orderId);
    var pickupTime = $('#hdnCurrentSelectedPickupTime_' + orderId).val();
    var phoneNumber = $('#popupCustomerName_' + orderId).next().text();
    //alert(phoneNumber);
    $("#btnChangePickupTimeSave").html("Submiting....");
    

    $.ajax({
        url: global + 'ChangeOrderPickupTime?storeid=' + storeId + '&orderId=' + orderId + "&pickupTime=" + pickupTime + "&restaurantDisplayName=" + restaurantDisplayName + "&phoneNumber=" + phoneNumber,
        type: 'GET',
        datatype: 'jsonp',
        contenttype: "application/json",
        crossDomain: true,
        //async: false,
        success: function (data) {
            $("#btnChangePickupTimeSave").html("Submit");
            console.log(data)
            if (data.replace(/"/g, "").indexOf("failed") > -1) {
                $('#pickupTimePopup').html("");
                $(".popup-overlay").hide();
                $('#pickupTimePopup').hide();
                callSweetAlertWarning(data.replace(/"/g, ""));
            }
            else {
                OpenCarryoutDetails(orderId);
                callSweetAlertSuccess(data.replace(/"/g, ""));

                $('#pickupTimePopup').html("");
                $(".popup-overlay").hide();
                $('#pickupTimePopup').hide();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            $("#btnChangePickupTimeSave").html("Submit");
            //alert(xhr.responseText);
            //alert(textStatus);
            //alert(errorThrown);
        }
    });

}


//Cancel Order
function OpenCancelOrderPopup() {
    var orderId = $("#dvCarryOutDetailsInner #hdnSelectedOrderId").val();
    console.log('orderId: ' + orderId)
    storeId = SetStoreId();

    if (orderId != undefined && Number(orderId > 0)) {

        var paymentMethod = $("#hdnPaymentmethod_" + orderId).val();
        //if (paymentMethod == "FirstData")
        //{

        var html = "<div class=\"popup-content-area\"><h2 class=\"popup-title\"><span style=\"font-size:18px;\">Refund Order - <span style=\"font-weight:600;font-size: 20px;\">#" + orderId + "</span></span></h2>";
        if (paymentMethod.toLowerCase().indexOf("cash") === -1)
        {
        html += "<h4 style=\"font-weight:600;\" id=\"divRefundText\">Select the type of Refund.</h4>";
        }
        
        html += "<div class=\"popup-button-area\" id=\"divUpperRefundButtonArea\">";
        html += "<button type=\"button\" onclick=\"ShowFullRefund(" + orderId + ");\" class=\"swal2-styled popup-no\" style=\"display: inline-block; background-color: #3b9847;border: none;margin: 5px 40px 30px 0px;padding: 10px 5px;width: 160px;\">FULL Refund</button>";
        html += "<button type=\"button\" onclick=\"ShowPartialRefund(" + orderId + ");\" class=\"swal2-styled popup-no\" style=\"display: inline-block; background-color: #08b3c7;border: none;margin: 5px 10px 30px 20px;padding: 10px 5px;width: 160px;width: 160px;\">Partial Refund</button>";
        html += "</div>";

        html += "<input id=\"hdnRefundType\" type=\"hidden\" value=\"Full\"/>";
        html += "<input id=\"lblRefundAmoutError\" type=\"text\"style=\"display:none;padding-left: 4px;border: 1px solid rgb(221, 221, 221);margin: 0 0 10px 0;border:none;color:red;\" value=\"Refund Amt. cannot be more than Order Amt.\" />";

        html += "<input id=\"txtRefundAmount_" + orderId + "\" type=\"number\" min=\"0.00\" placeholder=\"Refund Amount\" style=\"display:none;padding-left: 4px;border: 1px solid rgb(221, 221, 221);margin: 0 0 10px 0;\" />";
        html += "<textarea id=\"txtcancelReason_" + orderId + "\" class=\"swal2-textarea\" style=\"border:1px solid #ddd;height:160px;padding: 5px 5px;display:none;\" placeholder=\"Reason\">";
        html += "</textarea><div class=\"popup-button-area\"><button id=\"btnCancelSave\" onclick=\"CancelOrder(" + orderId + ");\" type=\"button\" class=\"popup-confirm swal2-styled\" aria-label=\"\" " ;
        html += "style=\"background-color: rgb(59, 152, 71); border-left-color: rgb(59, 152, 71); border-right-color: rgb(59, 152, 71);display:none;\">Refund Order</button>";
        html += "<button type=\"button\" onclick=\"CloseCancelOrderPopup();\" class=\"swal2-styled popup-no\" aria-label=\"\" style=\"display: inline-block; background-color: rgb(233, 88, 97);\">Close</button></div></div>";
        $('#cancelOrder').html(html);
        $(".popup-overlay").show();
        $('#cancelOrder').show();
       
    }

}

function ShowFullRefund(orderId) {
    $('#divUpperRefundButtonArea').hide();
    $('#hdnRefundType').val("Full");
    $('#txtcancelReason_' + orderId).show();
    $('#txtRefundAmount_' + orderId).hide();
    $('#btnCancelSave').show();
    $('#divRefundText').html("The FULL Order Amount will be refunded to the Customer.");
}
function ShowPartialRefund(orderId) {
    $('#divUpperRefundButtonArea').hide();
    $('#hdnRefundType').val("Partial");
    $('#txtRefundAmount_' + orderId).show();
    $('#txtcancelReason_' + orderId).show();
    $('#btnCancelSave').show();
    $('#divRefundText').html("Enter the Amount that will be refunded to the Customer.");
}


function CancelOrder(orderId)
{
    $('#lblRefundAmoutError').hide();
    var refundTypeValidation = "True";
    var refundType = $('#hdnRefundType').val();
    var reason = $("#txtcancelReason_" + orderId).val().trim();
    var orderTotal = $("#popupOrderPrice_" + orderId).html().replace("$", "").trim();

    //alert(refundType);
    var refundAmount = $("#txtRefundAmount_" + orderId).val();
    //alert("Amount: " + refundAmount);
    if (refundType != "" && refundType != "Full") {
        if (refundAmount == "" || parseFloat(refundAmount) <= 0) {
            refundTypeValidation = "False";
            $("#txtRefundAmount_" + orderId).css('border', errorClassBorder);
        }
        else {
            $("#txtRefundAmount_" + orderId).css('border', bottomBorder);
            //alert("Order Total: " + orderTotal);
            if (refundType != "" && refundType != "Full") {
                if (refundAmount == "" || parseFloat(refundAmount) > 0) {//Commented 08/10/2020 - Start
                    ////if (parseFloat(orderTotal) < parseFloat(refundAmount))
                    ////{
                    ////    refundTypeValidation = "False";
                    ////    $('#lblRefundAmoutError').show();
                    ////    $("#txtRefundAmount_" + orderId).css('border', errorClassBorder);
                    ////}
                    //Commented 08/10/2020 - End                    
                }
            }
            //alert("Order Total: After: " + orderTotal);

        }
    }
    //alert("Validation: " + refundTypeValidation);
    if(reason!="" && refundTypeValidation == "True")
    {
        var authorizationCode = $("#hdnAuthorizationId_" + orderId).val();
        var paymentMethod = $("#hdnPaymentmethod_" + orderId).val();
        var popupCustomerName = $("#popupCustomerName_" + orderId).html();
        var popupCustomerEmail = $("#popupCustomerEmail_" + orderId).html();
        var storeName = localStorage.getItem("RestaurantName");
        var storeAddress = localStorage.getItem("StoreAddress");
        var storePhoneNumber = localStorage.getItem("StorePhoneNumber");
        
       
        $("#btnCancelSave").html("Refunding...");
        $("#txtcancelReason_" + orderId).css('border', bottomBorder);
        //if (paymentMethod == "FirstData")
        //{

        $.ajax({
            url: global + 'RefundOrder?storeid=' + storeId + '&orderId=' + orderId + "&status=Cancelled"
                + "&reason=" + reason + "&authorizationCode=" + authorizationCode + "&orderTotal=" + orderTotal
                + "&paymentMethod=" + paymentMethod + "&customerName=" + popupCustomerName + "&customerEmail=" + popupCustomerEmail +
                "&restaurantDisplayName=" + storeName + "&storeAddress=" + storeAddress + "&storePhoneNumber=" + storePhoneNumber + "&refundType=" + refundType + "&refundAmount=" + refundAmount,
            type: 'GET',
            datatype: 'jsonp',
            contenttype: "application/json",
            crossDomain: true,
            //async: false,
            success: function (data) {
                $("#btnCancelSave").html("Refund Order");
                console.log(data)
                if (data.replace(/"/g, "").indexOf("failed") > -1) {
                    $('#cancelOrder').html("");
                    $(".popup-overlay").hide();
                    $('#cancelOrder').hide();
                    callSweetAlertWarning(data.replace(/"/g, ""));
                }
                else {                    
                    callSweetAlertSuccess(data.replace(/"/g, ""));
                    
                    if (refundType == "Full")
                    {
                        var orderhtml = "<div class=\"dropdown\" id=\"carryoutstatus_" + orderId + "\">";
                        orderhtml += "<button id=\"btnStatusChange\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/cancel.png\" alt=\"\"/></button>";
                        orderhtml += "</div>";
                        $("#popUpCarryoutIcon_" + orderId).html(orderhtml);
                        var iconHTML1 = "<button id=\"btnStatusChange\" class=\"dropbtn\"><img class=\"list-icon\" src=\"img/icons/cancel.png\" alt=\"\"></button>";
                        $("#dvAllList #carryoutstatus_" + orderId).html(iconHTML1);
                        $("#li_" + orderId).css("border-left", "#e95861 10px solid");
                    }
                    else {
                        var orderhtml = "<div class=\"dropdown\" id=\"carryoutstatus_" + orderId + "\">";
                        orderhtml += "<button id=\"btnStatusChange\" class=\"dropbtn\"><img class=\"list-icon\"  src=\"img/icons/refund.png\" alt=\"\"/></button>";
                        orderhtml += "</div>";
                        $("#popUpCarryoutIcon_" + orderId).html(orderhtml);
                        var iconHTML1 = "<button id=\"btnStatusChange\" class=\"dropbtn\"><img class=\"list-icon\" src=\"img/icons/refund.png\" alt=\"\"></button>";
                        $("#dvAllList #carryoutstatus_" + orderId).html(iconHTML1);

                        $("#li_" + orderId).css("border-left", "#9c1b8d 10px solid");
                    }

                    OpenCarryoutDetails(orderId);
                    
                    
                    $("#dvCarryOutButtons_" + orderId).html("");
                    $("#popupCarryOutDetails_" + orderId).html("");
                    $("#aCancelOrder").hide();

                    $('#cancelOrder').html("");
                    $(".popup-overlay").hide();
                    $('#cancelOrder').hide();

                    $("#li_" + orderId).css("border-left", "#e95861 10px solid");
                }


            },
            error: function (xhr, textStatus, errorThrown) {
                $("#btnCancelSave").html("Refund Order");
                //alert(xhr.responseText);
                //alert(textStatus);
                //alert(errorThrown);
            }
        });
        
    }
    else {
        $("#txtcancelReason_" + orderId).css('border', errorClassBorder);
    }
}
function CloseCancelOrderPopup()
{
    $('#cancelOrder').html("");
    $(".popup-overlay").hide();
    $('#cancelOrder').hide();
}

function OpenOrderHistoryPopup()
{
    var orderId = $("#dvCarryOutDetailsInner #hdnSelectedOrderId").val();
    var historyHTML = "";
    var url = global + 'GetOrderHistory?orderId=' + orderId;
    $.getJSON(url, function (data) {
        console.log(data)
            var obj = JSON.parse(data);
            var length = Object.keys(obj).length;
             //console.log(data)
            if (JSON.parse(data).indexOf("No order(s) found") < 0) {
               
                var count = 0;
                historyHTML += "<div class=\"popup-header-row\"><div class=\"popup-col-1-header\">Date</div>" +
                    "<div class=\"popup-col-2-header\">Status</div><div class=\"popup-col-3-header\">Notes</div></div>";
                $.each(JSON.parse(data), function (index, value) {
                    historyHTML += "<div class=\"popup-row\">";
                    if (value.CreatedOnUtc != null && value.CreatedOnUtc != undefined) {
                        var arrDateTime = value.CreatedOnUtc.split('~');
                        var orderDate = arrDateTime[0];
                        var orderTime = arrDateTime[1];
                        historyHTML += "<div class=\"popup-col-1\">" + orderDate + " @ " + orderTime + "</div>";
                    }
                    if (value.Status != undefined && value.Status != null)
                    {
                        if (value.Status == "PickedUp")
                            historyHTML += "<div class=\"popup-col-2\">Picked Up</div>";
                        else if (value.Status == "Cancelled")
                            historyHTML += "<div class=\"popup-col-2\">Canceled</div>";
                        else
                            historyHTML += "<div class=\"popup-col-2\">" + value.Status + "</div>";
                    }
                    else {
                        historyHTML += "<div class=\"popup-col-2\"></div>";
                    }
                    
                    if (value.Note != null)
                        historyHTML += "<div class=\"popup-col-3\">" + value.Note + "</div>";
                    historyHTML += "</div>";


                });
                var html = "<div class=\"popup-content-area\"><h2 class=\"popup-title\"><span style=\"font-size: 18px;\">History - <span style=\"font-weight:600;font-size: 20px;\">#" + orderId + "</span></span></h2>" +
          historyHTML +
            "<div class=\"popup-button-area\"><button style=\"width:85px;\" id=\"btnHistoryClose\" onclick=\"CloseHistoryPopup();\" type=\"button\" class=\"popup-confirm swal2-styled\" aria-label=\"\" " +
        "style=\"background-color: rgb(59, 152, 71); border-left-color: rgb(59, 152, 71); border-right-color: rgb(59, 152, 71);\">OK</button></div></div>";
                //console.log(html)
                $('#orderHistory').html(html);
                $(".popup-overlay").show();
                $('#orderHistory').show();

            }
            else {
                
                var html = "<div class=\"popup-row\"></div>";

            }
        });
        
}
function CloseHistoryPopup() {
    $('#orderHistory').html("");
    $(".popup-overlay").hide();
    $('#orderHistory').hide();
}


//Add Charge
function OpenAddChargePopup() {
    var orderId = $("#dvCarryOutDetailsInner #hdnSelectedOrderId").val();
    console.log('orderId: ' + orderId)
    storeId = SetStoreId();

    if (orderId != undefined && Number(orderId > 0)) {

        var paymentMethod = $("#hdnPaymentmethod_" + orderId).val();
        //if (paymentMethod == "FirstData")
        //{

        var html = "<div class=\"popup-content-area\"><h2 class=\"popup-title\"><span style=\"font-size:18px;\">Add Charge - <span style=\"font-weight:600;font-size: 20px;\">#" + orderId + "</span></span></h2>";
        
        html += "<input id=\"txtChargeAmount_" + orderId + "\" type=\"number\" min=\"0.00\" placeholder=\"Charge Amount\" style=\"padding-left: 4px;border: 1px solid rgb(221, 221, 221);margin: 0 0 10px 0;\" />";
        html += "<textarea id=\"txtChargeReason_" + orderId + "\" class=\"swal2-textarea\" style=\"border:1px solid #ddd;height:160px;padding: 5px 5px;\" placeholder=\"Reason\">";
        html += "</textarea><div class=\"popup-button-area\"><button id=\"btnChargeSave\" onclick=\"SubmitAddCharge(" + orderId + ");\" type=\"button\" class=\"popup-confirm swal2-styled\" aria-label=\"\" ";
        html += "style=\"background-color: rgb(59, 152, 71); border-left-color: rgb(59, 152, 71); border-right-color: rgb(59, 152, 71);\">Submit</button>";
        html += "<button type=\"button\" onclick=\"CloseAddChargePopup();\" class=\"swal2-styled popup-no\" aria-label=\"\" style=\"display: inline-block; background-color: rgb(233, 88, 97);\">Close</button></div></div>";
        $('#addChargePopup').html(html);
        $(".popup-overlay").show();
        $('#addChargePopup').show();

    }
}

function SubmitAddCharge(orderId) {
    var chargeTypeValidation = "True";
    var reason = $("#txtChargeReason_" + orderId).val().trim();
    var orderTotal = $("#popupOrderPrice_" + orderId).html().replace("$", "").trim();

    var chargeAmount = $("#txtChargeAmount_" + orderId).val();
    
    if (chargeAmount == "" || parseFloat(chargeAmount) <= 0) {
        chargeTypeValidation = "False";
        $("#txtChargeAmount_" + orderId).css('border', errorClassBorder);
    }
    
    if (reason != "" && chargeTypeValidation == "True") {
        var authorizationCode = $("#hdnAuthorizationId_" + orderId).val();
        var paymentMethod = $("#hdnPaymentmethod_" + orderId).val();
        var popupCustomerName = $("#popupCustomerName_" + orderId).html();
        var popupCustomerEmail = $("#popupCustomerEmail_" + orderId).html();
        var storeName = localStorage.getItem("RestaurantName");
        var storeAddress = localStorage.getItem("StoreAddress");
        var storePhoneNumber = localStorage.getItem("StorePhoneNumber");


        $("#btnChargeSave").html("Charging...");
        $("#txtChargeReason_" + orderId).css('border', bottomBorder);
        

        $.ajax({
            url: global + '/AddCharge?storeid=' + storeId + '&orderId=' + orderId + "&reason=" + reason + "&authorizationCode=" + authorizationCode
                + "&orderTotal=" + orderTotal + "&chargeAmount=" + chargeAmount + "&paymentMethod=" + paymentMethod + "&customerName=" + popupCustomerName
                + "&customerEmail=" + popupCustomerEmail + "&restaurantDisplayName=" + storeName + "&storeAddress=" + storeAddress
                + "&storePhoneNumber=" + storePhoneNumber,
            type: 'GET',
            datatype: 'jsonp',
            contenttype: "application/json",
            crossDomain: true,
            //async: false,
            success: function (data) {
                $("#btnChargeSave").html("Submit");
                console.log(data)
                if (data.replace(/"/g, "").toLowerCase().indexOf("failed") > -1) {
                    $('#addChargePopupv').html("");
                    $(".popup-overlay").hide();
                    $('#addChargePopup').hide();
                    var displayMessage = data.replace(/"/g, "").split('|');
                    callSweetAlertWarning(displayMessage[1]);
                }
                else if (data.replace(/"/g, "").toLowerCase().indexOf("successfull") > -1) {
                    var displayMessage = data.replace(/"/g, "").split('|');
                    callSweetAlertSuccess(displayMessage[1]);
                    $('#addChargePopupv').html("");
                    $(".popup-overlay").hide();
                    $('#addChargePopup').hide();
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                $("#btnChargeSave").html("Submit");
            }
        });

    }
    else {
        $("#txtChargeReason_" + orderId).css('border', errorClassBorder);
    }
}

function CloseAddChargePopup() {
    $('#addChargePopup').html("");
    $(".popup-overlay").hide();
    $('#addChargePopup').hide();
}


//Bistro Card Payment
function BindCCYear(id) {
    var minOffset = 0, maxOffset = 20; // Change to whatever you want
    var thisYear = (new Date()).getFullYear();
    var select = $('<select>');

    for (var i = minOffset; i < 20; i++) {
        var year = thisYear + i;
        var textYear = year.toString().slice(2,4);
        $('#' + id).append($('<option>', {
            value: year,
            text: textYear
        }));
    }
    $('#' + id).change(function () {
        if ($(this).val() == "") $(this).addClass("empty");
        else $(this).removeClass("empty")
    });
    $('#' + id).change();

   
}
function BindCCMonth(id) {
    $('#' + id).change(function () {
        if ($(this).val() == "") $(this).addClass("empty");
        else $(this).removeClass("empty")
    });
    $('#' + id).change();
}


//Gift Card History Start
function GiftCardHistoryList(pagesize, currentPage) {

    var storeId = 0;
    $("#dvHistroyList").html("");
    storeId = SetStoreId();
    customerId = SetCustomerId();
    currentPage = 0;
    localStorage.setItem("GiftCardHistoryCurrentPage", currentPage);

    var date = $("#txtFilterGiftCardHistoryDate").val();
    var status = $("#ddlFilterHistoryStatus").val();
    var code = $("#txtFilterHistoryCode").val();
    var type = $("#ddlFilterHistoryType").val();

    if (code == undefined) {
        code = "";
    }
    if (date == undefined) {
        date = "";
    }
    if (status == undefined) {
        status = "";
    }
    if (type == undefined) {
        type = "";
    }

    if (Number(storeId) > 0) {

        url = global + "/GetAllGiftCardHistory?storeid=" + storeId + "&code=" + code + "&date=" + date + "&status=" + status + "&type=" + type + "&pagesize=" + pagesize + "&currentPage=" + currentPage;

        try {
            $.getJSON(url, function (data) {
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;
                if (JSON.parse(data).indexOf("No History(s) found.") < 0) {
                    localStorage.setItem("GiftCardHistroyAvailable", "1");
                    var count = 0;
                    $.each(JSON.parse(data), function (index, value) {

                        var giftCardHistroyId = value.Id;
                        var code = value.GiftCardCouponCode;
                        var valueStatus = value.Status;
                        var valueStoreId = value.TransactionStoreId;
                        var type = value.Type;
                        var usedValue = FormatDecimal(value.UsedValue);
                        var reason = value.Notes;
                        var dateTime = value.CreatedOnUtc;
                        var storeName = value.RestaurantDisplayName;

                        var html = "<div class=\"order-container\" id=\"li_" + giftCardHistroyId + "\">";//First Div

                        html += "<div class=\"order-list\" data-popup=\".popup-details\">";//Second Div

                        html += "<div class=\"order-column-one\" data-panel=\"left\">";//Third Div
                        if (type.toLowerCase() == "active") {
                            html += "<div class=\"giftcard-order-pickup\" style=\"font-size: 22px;margin-top: 10px;color: #3b9847 !important;\">" + code + "</div>";
                        }
                        else if (type.toLowerCase() == "inactive") {
                            html += "<div class=\"giftcard-order-pickup\" style=\"font-size: 22px;margin-top: 10px;color: #e95861 !important;\">" + code + "</div>";
                        }
                        else {
                            html += "<div class=\"giftcard-order-pickup\" style=\"font-size: 22px;margin-top: 10px;\">" + code + "</div>";
                        }                        
                        //html += "<div style=\"text-align:center;color: #000;\">" + valueStatus + "</div>";
                        html += "</div>";//Third Div End

                        html += "<div class=\"order-column-two\">";//Forth Div
                        
                        html += "<div class=\"order-row-container\">";//Forth Inner Div One

                        html += "<div class=\"giftcard-order-number\" data-panel=\"left\" style=\"width:70%;padding-top:0px;\">";
                        html += "<div>" + dateTime + "</div>";
                        html += "<div>" + storeName + "</div>";
                        html += "</div>";

                        html += "<div class=\"giftcard-buttons\" id=\"btnSet_1513\" style=\"width:30%;font-size:18px;\">";
                        html += "<div class=\"customer-detail-container\">";
                        if (type.toLowerCase() == "active") {
                            html += "<div class=\"order-price\" style=\"font-size:24px;color: #3b9847 !important;\">Active</div>";
                        }
                        else if (type.toLowerCase() == "inactive") {
                            html += "<div class=\"order-price\" style=\"font-size:24px;color: #e95861 !important;\">Inactive</div>";
                        }
                        else if (type.toLowerCase() == "load") {
                            html += "<div class=\"order-price\" style=\"font-size:24px;color: #3b9847 !important;\">" + usedValue + "</div>";
                            html += "<div>" + type + "</div>";
                        }
                        else if (type.toLowerCase() == "redeem" || type.toLowerCase() == "refund") {
                            html += "<div class=\"order-price\" style=\"font-size:24px;color: #08b3c7 !important;\">" + usedValue + "</div>";
                            html += "<div>" + type + "</div>";
                        }
                                                
                        html += "</div>"
                        html += "</div>"

                        html += "</div>";//Forth Inner Div One End
                        
                        if (reason != null && reason != "") {
                            html += "<div class=\"order-row-container\">";//Forth Inner Div Two
                            html += "<div class=\"giftcard-order-number\">";
                            html += "<div>" + reason + "</div>";
                            html += "</div>";
                            html += "</div>";//Forth Inner Div Two End
                        }                        

                        html += "</div>";//Forth Div End


                        html += "</div>";//Second Div End

                        html += "</div>";//First Div End

                        count++;

                        $("#dvHistroyList").append(html);
                    });
                }
                else {
                    localStorage.setItem("GiftCardHistoryAvailable", "0");
                    var html = "<div class=\"order-list list-empty-label-text\">No History</div>";
                    $("#dvHistroyList").html(html);
                }
            });
        }
        catch (e) {

        }
    }
    else {
        self.app.router.navigate('/login_new/', { reloadCurrent: true });
    }
}

function GiftCardHistoryListPagination(pagesize, currentPage) {

    var storeId = 0;
    storeId = SetStoreId();
    customerId = SetCustomerId();

    var date = $("#txtFilterGiftCardHistoryDate").val();
    var status = $("#ddlFilterHistoryStatus").val();
    var code = $("#txtFilterHistoryCode").val();
    var type = $("#ddlFilterHistoryType").val();

    if (code == undefined) {
        code = "";
    }
    if (date == undefined) {
        date = "";
    }
    if (status == undefined) {
        status = "";
    }
    if (type == undefined) {
        type = "";
    }

    if (Number(storeId) > 0) {
        currentPage = Number(currentPage) * Number(pagesize);
        url = global + "/GetAllGiftCardHistory?storeid=" + storeId + "&code=" + code + "&date=" + date + "&status=" + status + "&type=" + type + "&pagesize=" + pagesize + "&currentPage=" + currentPage;

        try {
            $.getJSON(url, function (data) {
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;
                if (JSON.parse(data).indexOf("No History(s) found.") < 0) {
                    localStorage.setItem("GiftCardHistroyAvailable", "1");
                    var count = 0;
                    $.each(JSON.parse(data), function (index, value) {

                        var giftCardHistroyId = value.Id;
                        var code = value.GiftCardCouponCode;
                        var valueStatus = value.Status;
                        var valueStoreId = value.TransactionStoreId;
                        var type = value.Type;
                        var usedValue = FormatDecimal(value.UsedValue);
                        var reason = value.Notes;
                        var dateTime = value.CreatedOnUtc;
                        var storeName = value.RestaurantDisplayName;

                        var html = "<div class=\"order-container\" id=\"li_" + giftCardHistroyId + "\">";//First Div

                        html += "<div class=\"order-list\" data-popup=\".popup-details\">";//Second Div

                        html += "<div class=\"order-column-one\" data-panel=\"left\">";//Third Div
                        if (type.toLowerCase() == "active") {
                            html += "<div class=\"giftcard-order-pickup\" style=\"font-size: 22px;margin-top: 10px;color: #3b9847 !important;\">" + code + "</div>";
                        }
                        else if (type.toLowerCase() == "inactive") {
                            html += "<div class=\"giftcard-order-pickup\" style=\"font-size: 22px;margin-top: 10px;color: #e95861 !important;\">" + code + "</div>";
                        }
                        else {
                            html += "<div class=\"giftcard-order-pickup\" style=\"font-size: 22px;margin-top: 10px;\">" + code + "</div>";
                        }
                        //html += "<div style=\"text-align:center;color: #000;\">" + valueStatus + "</div>";
                        html += "</div>";//Third Div End

                        html += "<div class=\"order-column-two\">";//Forth Div

                        html += "<div class=\"order-row-container\">";//Forth Inner Div One

                        html += "<div class=\"giftcard-order-number\" data-panel=\"left\" style=\"width:70%;padding-top:0px;\">";
                        html += "<div>" + dateTime + "</div>";
                        html += "<div>" + storeName + "</div>";
                        html += "</div>";

                        html += "<div class=\"giftcard-buttons\" id=\"btnSet_1513\" style=\"width:30%;font-size:18px;\">";
                        html += "<div class=\"customer-detail-container\">";
                        if (type.toLowerCase() == "active") {
                            html += "<div class=\"order-price\" style=\"font-size:24px;color: #3b9847 !important;\">Active</div>";
                        }
                        else if (type.toLowerCase() == "inactive") {
                            html += "<div class=\"order-price\" style=\"font-size:24px;color: #e95861 !important;\">Inactive</div>";
                        }
                        else if (type.toLowerCase() == "load") {
                            html += "<div class=\"order-price\" style=\"font-size:24px;color: #3b9847 !important;\">" + usedValue + "</div>";
                            html += "<div>" + type + "</div>";
                        }
                        else if (type.toLowerCase() == "redeem" || type.toLowerCase() == "refund") {
                            html += "<div class=\"order-price\" style=\"font-size:24px;color: #08b3c7 !important;\">" + usedValue + "</div>";
                            html += "<div>" + type + "</div>";
                        }
                        
                        html += "</div>"
                        html += "</div>"

                        html += "</div>";//Forth Inner Div One End

                        if (reason != null && reason != "") {
                            html += "<div class=\"order-row-container\">";//Forth Inner Div Two
                            html += "<div class=\"giftcard-order-number\">";
                            html += "<div>" + reason + "</div>";
                            html += "</div>";
                            html += "</div>";//Forth Inner Div Two End
                        }

                        html += "</div>";//Forth Div End


                        html += "</div>";//Second Div End

                        html += "</div>";//First Div End

                        count++;

                        $("#dvHistroyList").append(html);
                    });
                }
            });
        }
        catch (e) {

        }
    }
    else {
        self.app.router.navigate('/login_new/', { reloadCurrent: true });
    }
}
//Gift Card History End

//Dine-In Queue Section Start

function DineInList(pagesize, currentPage) {

    var storeId = 0;
    $("#dineinDiv").html("");
    storeId = SetStoreId();
    customerId = SetCustomerId();
    currentPage = 0;
    localStorage.setItem("DineinCurrentPage", currentPage);

    var name = $("#txtFilterDiniinName").val();
    var date = $("#txtFilterDineinDate").val();
    var status = $("#ddlFilterDineinStatus").val();
    
    if (name == undefined) {
        name = "";
    }
    if (date == undefined) {
        date = "";
    }
    if (status == undefined) {
        status = "";
    }

    if (Number(storeId) > 0) {

        url = global + "/GetAllDineInQueue?storeid=" + storeId + "&name=" + name + "&date=" + date + "&status=" + status + "&pagesize=" + pagesize + "&currentPage=" + currentPage;

        try {
            $.getJSON(url, function (data) {
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;
                if (JSON.parse(data).indexOf("No Dine-In(s) found.") < 0) {
                    localStorage.setItem("DineinAvailable", "1");
                    var count = 0;
                    $.each(JSON.parse(data), function (index, value) {

                        var dineInId = value.Id;
                        var valueStatus = value.Status;
                        var valueStoreId = value.StoreId;
                        var time = value.CreatedAt;
                        var guestName = value.GuestName;
                        var guestPhone = value.GuestPhone;
                        var guestCount = value.NumberOfGuests;
                        var notes = value.Notes;

                        var html = "<div class=\"order-container\" id=\"li_" + dineInId + "\" style=\"width:100%;padding-left: 20px;\">";//First Div
                        
                        html += "<div id=\"dvDineinListInner_" + dineInId + "\" class=\"order-list\">";//Second Div

                        html += "<div class=\"order-column-two\" style=\"width:100%\">";//Third Div

                        html += "<div class=\"order-row-container\">";//Forth Div

                        html += "<input type=\"hidden\" id=\"hdnDineInValues_" + dineInId + "\" value=\"" + guestName + "~" + guestPhone + "~" + guestCount + "~" + notes + "\"/>";//
                        html += "<input type=\"hidden\" id=\"hdnDineInId_" + dineInId + "\" value=\"" + dineInId + "\"/>";//
                        html += "<input type=\"hidden\" id=\"customerPhone_" + dineInId + "\" value=\"" + guestPhone + "\"/>";//
                        html += "<div class=\"order-pickup\" style=\"width:25%;\" onclick=\"OpenEditDineIn(" + dineInId + ");\">";//Div Time
                        html += "<div class=\"code\">" + time + "</div>";
                        if (valueStatus == "New") {
                            html += "<div id=\"divName_"+dineInId+"\" class=\"order-number\" style=\"font-size:16px;width:100%;\">" + guestName + " (" + guestCount + ")</div>";
                        }
                        else if (valueStatus == "CheckIn") {
                            html += "<div id=\"divName_" + dineInId + "\" class=\"order-number\" style=\"font-size:16px;width:100%;border-bottom: #ffd133 4px solid;\">" + guestName + " (" + guestCount + ")</div>";
                        }
                        else if (valueStatus == "Seated") {
                            html += "<div id=\"divName_" + dineInId + "\" class=\"order-number\" style=\"font-size:16px;width:100%;border-bottom: #62b787 4px solid;\">" + guestName + " (" + guestCount + ")</div>";
                        }
                        else if (valueStatus == "Cancelled") {
                            html += "<div id=\"divName_" + dineInId + "\" class=\"order-number\" style=\"font-size:16px;width:100%;border-bottom: #f00000 4px solid;\">" + guestName + " (" + guestCount + ")</div>";
                        }
                        
                        html += "</div>";//Div Time End

                        html += "<div class=\"coupon-buttons\" style=\"width:75%\">";//Div Buttons
                        html += "<div class=\"coupon-status-icon\" onclick=\"OpenNotifyCustomer(" + dineInId + ");\"><img class=\"list-icon\" style=\"max-width: 85% !important;\" src=\"./img/icons/sms_button.png\"></div>";
                        html += "<div class=\"coupon-status-icon\" onclick=\"SeatedReservation(" + dineInId + ");\"><img class=\"list-icon\" src=\"./img/icons/active.png\"></div>";
                        html += "<div class=\"coupon-status-icon\" onclick=\"UnseatedReservation(" + dineInId + ");\"><img class=\"list-icon\" src=\"./img/icons/inactive_new.png\"></div>";
                        html += "<div class=\"coupon-status-icon\" onclick=\"NoShowReservation(" + dineInId + ");\"><img class=\"list-icon\" src=\"./img/icons/checkout.png\"></div>";
                        html += "<div class=\"coupon-status-icon\" onclick=\"CancelQueueReservation(" + dineInId + ");\"><img class=\"list-icon\" style=\"max-width: 60% !important;\" src=\"./img/icons/delete_new.png\"></div>";

                        html += "</div>";//Div Buttons End

                        html += "</div>";//Forth Div End

                        html += "</div>";//Third Div End

                        html += "</div>";//Second Div End

                        html += "</div>";//First Div End

                        count++;

                        $("#dineinDiv").append(html);
                    });
                }
                else {
                    localStorage.setItem("DineinAvailable", "0");
                    var html = "<div class=\"order-list list-empty-label-text\">No Dine-In Queue</div>";
                    $("#dineinDiv").html(html);
                }
            });
        }
        catch (e) {

        }
    }
    else {
        self.app.router.navigate('/login_new/', { reloadCurrent: true });
    }
}

function DineInListPagination(pagesize, currentPage) {

    var storeId = 0;
    storeId = SetStoreId();
    customerId = SetCustomerId();
    localStorage.setItem("DineinCurrentPage", currentPage);

    var name = $("#txtFilterDiniinName").val();
    var date = $("#txtFilterDineinDate").val();
    var status = $("#ddlFilterDineinStatus").val();
    
    if (name == undefined) {
        name = "";
    }
    if (date == undefined) {
        date = "";
    }
    if (status == undefined) {
        status = "";
    }

    if (Number(storeId) > 0) {
        currentPage = Number(currentPage) * Number(pagesize);
        url = global + "/GetAllDineInQueue?storeid=" + storeId + "&name=" + name + "&date=" + date + "&status=" + status + "&pagesize=" + pagesize + "&currentPage=" + currentPage;

        try {
            $.getJSON(url, function (data) {
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;
                if (JSON.parse(data).indexOf("No Dine-In Queue(s) found.") < 0) {
                    localStorage.setItem("DineinAvailable", "1");
                    var count = 0;
                    $.each(JSON.parse(data), function (index, value) {

                        var dineInId = value.Id;
                        var valueStatus = value.Status;
                        var valueStoreId = value.StoreId;
                        var time = value.CreatedAt;
                        var guestName = value.GuestName;
                        var guestPhone = value.GuestPhone;
                        var guestCount = value.NumberOfGuests;
                        var notes = value.Notes;

                        var html = "<div class=\"order-container\" id=\"li_" + dineInId + "\" style=\"width:100%;padding-left: 20px;\">";//First Div

                        html += "<div id=\"dvDineinListInner_" + dineInId + "\" class=\"order-list\">";//Second Div

                        html += "<div class=\"order-column-two\" style=\"width:100%\">";//Third Div

                        html += "<div class=\"order-row-container\">";//Forth Div

                        html += "<input type=\"hidden\" id=\"hdnDineInValues_" + dineInId + "\" value=\"" + guestName + "~" + guestPhone + "~" + guestCount + "~" + notes + "\"/>";//
                        html += "<input type=\"hidden\" id=\"hdnDineInId_" + dineInId + "\" value=\"" + dineInId + "\"/>";//
                        html += "<input type=\"hidden\" id=\"customerPhone_" + dineInId + "\" value=\"" + guestPhone + "\"/>";//
                        html += "<div class=\"order-pickup\" style=\"width:25%;\" onclick=\"OpenEditDineIn(" + dineInId + ");\">";//Div Time
                        html += "<div class=\"code\">" + time + "</div>";
                        if (valueStatus == "New") {
                            html += "<div id=\"divName_" + dineInId + "\" class=\"order-number\" style=\"font-size:16px;width:100%;\">" + guestName + " (" + guestCount + ")</div>";
                        }
                        else if (valueStatus == "CheckIn") {
                            html += "<div id=\"divName_" + dineInId + "\" class=\"order-number\" style=\"font-size:16px;width:100%;border-bottom: #ffd133 4px solid;\">" + guestName + " (" + guestCount + ")</div>";
                        }
                        else if (valueStatus == "Seated") {
                            html += "<div id=\"divName_" + dineInId + "\" class=\"order-number\" style=\"font-size:16px;width:100%;border-bottom: #62b787 4px solid;\">" + guestName + " (" + guestCount + ")</div>";
                        }
                        else if (valueStatus == "Cancelled") {
                            html += "<div id=\"divName_" + dineInId + "\" class=\"order-number\" style=\"font-size:16px;width:100%;border-bottom: #f00000 4px solid;\">" + guestName + " (" + guestCount + ")</div>";
                        }

                        html += "</div>";//Div Time End

                        html += "<div class=\"coupon-buttons\" style=\"width:75%\">";//Div Buttons
                        html += "<div class=\"coupon-status-icon\" onclick=\"OpenNotifyCustomer(" + dineInId + ");\"><img class=\"list-icon\" style=\"max-width: 85% !important;\" src=\"./img/icons/sms_button.png\"></div>";
                        html += "<div class=\"coupon-status-icon\" onclick=\"SeatedReservation(" + dineInId + ");\"><img class=\"list-icon\" src=\"./img/icons/active.png\"></div>";
                        html += "<div class=\"coupon-status-icon\" onclick=\"UnseatedReservation(" + dineInId + ");\"><img class=\"list-icon\" src=\"./img/icons/inactive_new.png\"></div>";
                        html += "<div class=\"coupon-status-icon\" onclick=\"NoShowReservation(" + dineInId + ");\"><img class=\"list-icon\" src=\"./img/icons/checkout.png\"></div>";
                        html += "<div class=\"coupon-status-icon\" onclick=\"CancelQueueReservation(" + dineInId + ");\"><img class=\"list-icon\" style=\"max-width: 60% !important;\" src=\"./img/icons/delete_new.png\"></div>";

                        html += "</div>";//Div Buttons End

                        html += "</div>";//Forth Div End

                        html += "</div>";//Third Div End

                        html += "</div>";//Second Div End

                        html += "</div>";//First Div End

                        count++;

                        $("#dineinDiv").append(html);
                    });
                }
            });
        }
        catch (e) {

        }
    }
    else {
        self.app.router.navigate('/login_new/', { reloadCurrent: true });
    }
}

function OpenEditDineIn(id){
    var dineInValues = $("#hdnDineInValues_" + id).val();
    if (dineInValues != "") {
        var values = dineInValues.split('~');
        var guestName = values[0];
        var guestPhone = values[1];
        var guestCount = values[2];
        var notes = values[3];


        var html = "<div class=\"popup-content-area\"><h2 class=\"popup-title\"><span style=\"font-size:18px;\">Edit Dine-In Queue</span></h2>";

        html += "<input id=\"txtEditQueueName\" value=\"" + guestName + "\" type=\"text\" placeholder=\"Name\" style=\"padding-left: 4px;border: 1px solid rgb(221, 221, 221);margin: 0 0 10px 0;\" />";
        html += "<input id=\"txtEditQueuePhone\" value=\"" + guestPhone + "\" type=\"number\" placeholder=\"Phone\" onKeyDown=\"if(this.value.length==10) this.value = this.value.slice(0, -1);\" style=\"padding-left: 4px;border: 1px solid rgb(221, 221, 221);margin: 0 0 10px 0;\" />";

        html += "<select id=\"ddlEditQueueNoOfUsers\" placeholder=\"# of Guests\" style=\"padding-left: 4px;border: 1px solid rgb(221, 221, 221);margin: 0 0 10px 0;\">";
        html += "<option value=\"1\">1</option>";
        html += "<option value=\"2\">2</option>";
        html += "<option value=\"3\">3</option>";
        html += "<option value=\"4\">4</option>";
        html += "<option value=\"5\">5</option>";
        html += "<option value=\"6\">6</option>";
        html += "<option value=\"7\">7</option>";
        html += "<option value=\"8\">8</option>";
        html += "<option value=\"9\">9</option>";
        html += "<option value=\"10\">10</option>";
        html += "<option value=\"11\">11</option>";
        html += "<option value=\"12\">12</option>";
        html += "<option value=\"13\">13</option>";
        html += "<option value=\"14\">14</option>";
        html += "<option value=\"15\">15</option>";
        html += "<option value=\"16\">16</option>";
        html += "<option value=\"17\">17</option>";
        html += "<option value=\"18\">18</option>";
        html += "<option value=\"19\">19</option>";
        html += "<option value=\"20\">20</option>";
        html += "<option value=\"21\">Larger Party</option>";

        html += "</select>";

        html += "<textarea id=\"txtEditQueueNotes\" value=\"" + notes + "\" class=\"swal2-textarea\" style=\"border:1px solid #ddd;height:160px;padding: 5px 5px;\" placeholder=\"Notes\">";
        html += "</textarea><div class=\"popup-button-area\"><button id=\"btnSaveQueue\" onclick=\"EditDineInQueue(" + id + ");\" type=\"button\" class=\"popup-confirm swal2-styled\" aria-label=\"\" ";
        html += "style=\"background-color: rgb(59, 152, 71); border-left-color: rgb(59, 152, 71); border-right-color: rgb(59, 152, 71);\">Submit</button>";
        html += "<button type=\"button\" onclick=\"CloseAddDineInPopup();\" class=\"swal2-styled popup-no\" aria-label=\"\" style=\"display: inline-block; background-color: rgb(233, 88, 97);\">Close</button></div></div>";
        $('#addDineIn').html(html);
        $(".popup-overlay").show();
        $('#addDineIn').show();

        $('#ddlEditQueueNoOfUsers').val(guestCount);
        $('#txtEditQueueNotes').val(notes);
    }
}

function NoShowReservation(id) {
    $.ajax({
        url: global + 'NoShowDineIn?id=' + id,
        type: 'GET',
        datatype: 'jsonp',
        contenttype: "application/json",
        crossDomain: true,
        //async: false,
        success: function (data) {
            console.log(data)
            if (data.replace(/"/g, "").toLowerCase().indexOf("failed") > -1) {
                callSweetAlertWarning(data.replace(/"/g, ""));
            }
            else if (data.replace(/"/g, "").toLowerCase().indexOf("successfull") > -1) {
                $('#divName_' + id).css("border-bottom", "#ffd133 4px solid");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
        }
    });
}

function SeatedReservation(id) {
    $.ajax({
        url: global + 'SeatedDineIn?id=' + id,
        type: 'GET',
        datatype: 'jsonp',
        contenttype: "application/json",
        crossDomain: true,
        //async: false,
        success: function (data) {
            console.log(data)
            if (data.replace(/"/g, "").toLowerCase().indexOf("failed") > -1) {
                callSweetAlertWarning(data.replace(/"/g, ""));
            }
            else if (data.replace(/"/g, "").toLowerCase().indexOf("successfull") > -1) {
                $('#divName_' + id).css("border-bottom", "#62b787 4px solid");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
        }
    });

}

function UnseatedReservation(id) {
    $.ajax({
        url: global + 'UnseatedDineIn?id=' + id,
        type: 'GET',
        datatype: 'jsonp',
        contenttype: "application/json",
        crossDomain: true,
        //async: false,
        success: function (data) {
            console.log(data)
            if (data.replace(/"/g, "").toLowerCase().indexOf("failed") > -1) {
                callSweetAlertWarning(data.replace(/"/g, ""));
            }
            else if (data.replace(/"/g, "").toLowerCase().indexOf("successfull") > -1) {
                $('#divName_' + id).css("border-bottom", "none");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
        }
    });
}

function OpenNotifyCustomer(id) {
    storeId = SetStoreId();
    url = global + "/GetStoreTables?storeid=" + storeId;

    try {
        $.getJSON(url, function (data) {
            var obj = JSON.parse(data);
            var length = Object.keys(obj).length;
            if (JSON.parse(data).indexOf("No Table(s) found.") < 0) {
                var count = 0;
                var html = "<div class=\"popup-content-area\"><h2 class=\"popup-title\"><span style=\"font-size:18px;\">Select Table</span></h2>";
                html += "<select id=\"ddlTableNumbers\" placeholder=\"# of Guests\" style=\"padding-left: 4px;border: 1px solid rgb(221, 221, 221);margin: 0 0 10px 0;\">";
                $.each(JSON.parse(data), function (index, value) {

                    var optionText = value.Id;
                    var optionValue = value.TableNumber;
                    html += "<option value=\"" + optionValue + "\">" + optionText + "</option>";

                    count++;                   
                });
                html += "</select>";
                html += "</textarea><div class=\"popup-button-area\"><button id=\"btnSaveQueue\" onclick=\"NotifyCustomer(" + id + ");\" type=\"button\" class=\"popup-confirm swal2-styled\" aria-label=\"\" ";
                html += "style=\"background-color: rgb(59, 152, 71); border-left-color: rgb(59, 152, 71); border-right-color: rgb(59, 152, 71);\">Send</button>";
                html += "<button type=\"button\" onclick=\"CloseNotifyPopup();\" class=\"swal2-styled popup-no\" aria-label=\"\" style=\"display: inline-block; background-color: rgb(233, 88, 97);\">Close</button></div></div>";
                $("#notifyCustomer").html(html);
            }
            else {
                var html = "<div class=\"order-list list-empty-label-text\">No Table(s) found.</div>";
                $("#notifyCustomer").html(html);
            }
        });
    }
    catch (e) {

    }
    $(".popup-overlay").show();
    $('#notifyCustomer').show();
}

function NotifyCustomer(id) {
    var storeId = SetStoreId();
    var tableNumber = $("#ddlTableNumbers option:selected").text();
    var customerPhone = $('#customerPhone_' + id).val();
    var restaurantName = localStorage.getItem("RestaurantName");
    if (tableNumber != "" && tableNumber != "Select Table") {
        $.ajax({
            url: global + 'SendDineInNotification?id=' + id + '&storeId=' + storeId + '&customerPhone=' + customerPhone + '&tableNumber=' + tableNumber + '&restaurantName=' + restaurantName,
            type: 'GET',
            datatype: 'jsonp',
            contenttype: "application/json",
            crossDomain: true,
            //async: false,
            success: function (data) {
                //alert(data)
                if (data.replace(/"/g, "").toLowerCase().indexOf("failed") > -1) {
                    CloseNotifyPopup();
                    callSweetAlertWarning(data.replace(/"/g, ""));
                }
                else if (data.replace(/"/g, "").toLowerCase().indexOf("successfull") > -1) {
                    CloseNotifyPopup();
                    callSweetAlertSuccess(data.replace(/"/g, ""));
                }
            },
            error: function (xhr, textStatus, errorThrown) {
            }
        });
    }
    else {
        alert("Please select a table.");
    }

}

function CloseNotifyPopup() {
    $('#notifyCustomer').html("");
    $(".popup-overlay").hide();
    $('#notifyCustomer').hide();
}

function CancelQueueReservation(id) {
    $.ajax({
        url: global + 'CancelDineIn?id=' + id,
        type: 'GET',
        datatype: 'jsonp',
        contenttype: "application/json",
        crossDomain: true,
        //async: false,
        success: function (data) {
            console.log(data)
            if (data.replace(/"/g, "").toLowerCase().indexOf("failed") > -1) {
                callSweetAlertWarning(data.replace(/"/g, ""));
            }
            else if (data.replace(/"/g, "").toLowerCase().indexOf("successfull") > -1) {
                $('#divName_' + id).css("border-bottom", "#f00000 4px solid");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
        }
    });
}

function OpenAddDineInPopup() {
    
    var html = "<div class=\"popup-content-area\"><h2 class=\"popup-title\"><span style=\"font-size:18px;\">Add Dine-In Queue</span></h2>";
        
    html += "<input id=\"txtAddQueueName\" type=\"text\" placeholder=\"Name\" style=\"padding-left: 4px;border: 1px solid rgb(221, 221, 221);margin: 0 0 10px 0;\" />";
    html += "<input id=\"txtAddQueuePhone\" type=\"number\" placeholder=\"Phone\" onKeyDown=\"if(this.value.length==10) this.value = this.value.slice(0, -1);\" style=\"padding-left: 4px;border: 1px solid rgb(221, 221, 221);margin: 0 0 10px 0;\" />";

    html += "<select id=\"ddlAddQueueNoOfUsers\" placeholder=\"# of Guests\" style=\"padding-left: 4px;border: 1px solid rgb(221, 221, 221);margin: 0 0 10px 0;\">";
    html += "<option value=\"1\">1</option>";
    html += "<option value=\"2\">2</option>";
    html += "<option value=\"3\">3</option>";
    html += "<option value=\"4\">4</option>";
    html += "<option value=\"5\">5</option>";
    html += "<option value=\"6\">6</option>";
    html += "<option value=\"7\">7</option>";
    html += "<option value=\"8\">8</option>";
    html += "<option value=\"9\">9</option>";
    html += "<option value=\"10\">10</option>";
    html += "<option value=\"11\">11</option>";
    html += "<option value=\"12\">12</option>";
    html += "<option value=\"13\">13</option>";
    html += "<option value=\"14\">14</option>";
    html += "<option value=\"15\">15</option>";
    html += "<option value=\"16\">16</option>";
    html += "<option value=\"17\">17</option>";
    html += "<option value=\"18\">18</option>";
    html += "<option value=\"19\">19</option>";
    html += "<option value=\"20\">20</option>";
    html += "<option value=\"21\">Larger Party</option>";

    html += "</select>";

    html += "<textarea id=\"txtAddQueueNotes\" class=\"swal2-textarea\" style=\"border:1px solid #ddd;height:160px;padding: 5px 5px;\" placeholder=\"Notes\">";
    html += "</textarea><div class=\"popup-button-area\"><button id=\"btnSaveQueue\" onclick=\"AddDineInQueue();\" type=\"button\" class=\"popup-confirm swal2-styled\" aria-label=\"\" ";
    html += "style=\"background-color: rgb(59, 152, 71); border-left-color: rgb(59, 152, 71); border-right-color: rgb(59, 152, 71);\">Submit</button>";
    html += "<button type=\"button\" onclick=\"CloseAddDineInPopup();\" class=\"swal2-styled popup-no\" aria-label=\"\" style=\"display: inline-block; background-color: rgb(233, 88, 97);\">Close</button></div></div>";
    $('#addDineIn').html(html);
    $(".popup-overlay").show();
    $('#addDineIn').show();
}

function AddDineInQueue() {
    var storeId = SetStoreId();
    var name = $('#txtAddQueueName').val();
    var phone = $("#txtAddQueuePhone").val();
    var guestCount = $("#ddlAddQueueNoOfUsers").val();
    var notes = $('#txtAddQueueNotes').val();
        
    $("#txtAddQueueName").css('border', bottomBorder);
    $("#txtAddQueuePhone").css('border', bottomBorder);
    $("#ddlAddQueueNoOfUsers").css('border', bottomBorder);

    if (name != "" && phone != "" && guestCount != "") {

        $("#btnSaveQueue").html("Submitting...");

        $.ajax({
            url: global + 'AddQueue?storeid=' + storeId + '&name=' + name + "&phone=" + phone + "&guestCount=" + guestCount + "&notes=" + notes,
            type: 'GET',
            datatype: 'jsonp',
            contenttype: "application/json",
            crossDomain: true,
            //async: false,
            success: function (data) {
                $("#btnSaveQueue").html("Submit");
                console.log(data)
                if (data.replace(/"/g, "").indexOf("failed") > -1) {
                    CloseAddDineInPopup();
                    callSweetAlertWarning(data.replace(/"/g, ""));
                }
                else {
                    var pageSize = 10;
                    var currentPage = 0;
                    DineInList(pageSize, currentPage);
                    callSweetAlertSuccess(data.replace(/"/g, ""));
                    CloseAddDineInPopup();
                }


            },
            error: function (xhr, textStatus, errorThrown) {
                $("#btnSaveQueue").html("Submit");
            }
        });

    }
    else {
        if (name == "") {
            $("#txtAddQueueName").css('border', errorClassBorder);
        }
        if (phone == "") {
            $("#txtAddQueuePhone").css('border', errorClassBorder);
        }
        if (guestCount == "") {
            $("#ddlAddQueueNoOfUsers").css('border', errorClassBorder);
        }
    }
}

function EditDineInQueue(id) {
    var storeId = SetStoreId();
    var name = $('#txtEditQueueName').val();
    var phone = $("#txtEditQueuePhone").val();
    var guestCount = $("#ddlEditQueueNoOfUsers").val();
    var notes = $('#txtEditQueueNotes').val();

    $("#txtEditQueueName").css('border', bottomBorder);
    $("#txtEditQueuePhone").css('border', bottomBorder);
    $("#ddlEditQueueNoOfUsers").css('border', bottomBorder);

    if (name != "" && phone != "" && guestCount != "") {

        $("#btnSaveQueue").html("Submitting...");

        $.ajax({
            url: global + 'EditQueue?id=' + id + "&storeid=" + storeId + "&name=" + name + "&phone=" + phone + "&guestCount=" + guestCount + "&notes=" + notes,
            type: 'GET',
            datatype: 'jsonp',
            contenttype: "application/json",
            crossDomain: true,
            //async: false,
            success: function (data) {
                $("#btnSaveQueue").html("Submit");
                console.log(data)
                if (data.replace(/"/g, "").indexOf("failed") > -1) {
                    $('#hdnDineInValues_' + id).val(name + "~" + phone + "~" + guestCount + "~" + notes);
                    CloseAddDineInPopup();
                    callSweetAlertWarning(data.replace(/"/g, ""));
                }
                else {
                    var pageSize = 10;
                    var currentPage = 0;
                    DineInList(pageSize, currentPage);
                    callSweetAlertSuccess(data.replace(/"/g, ""));
                    CloseAddDineInPopup();
                }


            },
            error: function (xhr, textStatus, errorThrown) {
                $("#btnSaveQueue").html("Submit");
            }
        });

    }
    else {
        if (name == "") {
            $("#txtAddQueueName").css('border', errorClassBorder);
        }
        if (phone == "") {
            $("#txtAddQueuePhone").css('border', errorClassBorder);
        }
        if (guestCount == "") {
            $("#ddlAddQueueNoOfUsers").css('border', errorClassBorder);
        }
    }
}

function CloseAddDineInPopup() {
    $('#addDineIn').html("");
    $(".popup-overlay").hide();
    $('#addDineIn').hide();
}

//Dine-In Queue Section End
