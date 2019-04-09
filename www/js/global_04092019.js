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

function RegisterToken(storeId, token)
{
    //$.ajax({
    //    url: global + 'Logout?storeid=' + storeId + '&registrationToken=' + token,
    //    type: 'GET',
    //    datatype: 'jsonp',
    //    contenttype: "application/json",
    //    crossDomain: true,
    //    async: false,
    //    success: function (data) {
    //        console.log("DeviceRegistrationToken Deleted from DB successfully")
           
    //        //window.location.href = "index.html";
    //        //window.localStorage.clear();
    //    },
    //    error: function (xhr, textStatus, errorThrown) {
    //        //window.location.href = "index.html";
    //        console.log("Saved to DB failed")
    //    }
    //});
    console.log('RegisterToken StoreId: ' + storeId)
    $.ajax({
        url: global + 'StoreDeviceRegistrationTokenUpdate?storeid=' + storeId + '&registrationToken=' + token,
        type: 'GET',
        datatype: 'jsonp',
        contenttype: "application/json",
        crossDomain: true,
        async: false,
        success: function (data) {
            console.log("Saved to DB successfully")
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
                console.log("data: " + data);
                //console.log("Login 2" + data);
                //alert(data)
                if (data.indexOf("No Data Found") > -1) {
                    $('#lblErr').html("Invalid Email/Password");
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
                           
                            GetStoreCarryOutTimings(storeId);
                        }
                        else {
                          
                            if (giftCardsEnabled != "True" && giftCardProgramEnabled != "True" && rewardEnabled != "True") {
                                $('#lblErr').html();
                                $('#lblErr').html("Carryout/Gift Card/Rewards are not enabled. Please contact system administrator!");
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

function SetMenuNavigation()
{
    var carryOutEnabled = localStorage.getItem("CarryOutEnabled");
    var giftCardsEnabled = localStorage.getItem("GiftCardsEnabled");
    var giftCardProgramEnabled = localStorage.getItem("GiftCardProgramEnabled");
    var rewardEnabled = localStorage.getItem("RewardsEnabled");
    //console.log("carryOutEnabled: " + carryOutEnabled)
    if (carryOutEnabled != "True") {

        //$(".menuCarryout").addClass("disabled");
        $('#manageservice .menuCarryout').each(function () {
            $(this).addClass('disabled');
        });
        $('#manageservice .menuStartStop').each(function () {
            $(this).addClass('disabled');
        });
    }
    else if (rewardEnabled != "True") {
        $("#manageservice .menuReward").addClass("disabled");
    }
    else if (giftCardsEnabled != "True" && giftCardProgramEnabled != "True") {
        $("#manageservice .menuGiftCard").addClass("disabled");
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

    status = $('#hdnCurrentState').val();
    if (status == "New")
    {
        divId = 'dvNewList';
    }
    else if (status == "Processing") {
        divId = 'dvProcessingList';
    }
    else {
        divId = 'dvAllList';
    }
    var customerId = 0;
    var storeId = 0;
    currentPage = 0;
    $("#" + divId).html("");
    storeId=SetStoreId();
    customerId=SetCustomerId();
   
    if (Number(storeId) > 0) {
     
        carryoutcurrentPage = Number(carryoutcurrentPage) * Number(carryoutpagesize);
        url = global + "/GetAllCarryOutOrdersTemp?storeid=" + storeId + "&status=" + status + "&pagesize=" + carryoutpagesize + "&currentPage=" + carryoutcurrentPage;
     
        try {
           
            $.getJSON(url, function (data) {
                $('#loader_msg').html("");
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;

                if (JSON.parse(data).indexOf("No order(s) found") < 0) {
                    localStorage.setItem("OrderAvailable", "1");
                    var count = 0;
                    $.each(JSON.parse(data), function (index, value) {
                        //console.log(value.FIRSTNAME)
                        //console.log(value.BILLINGFIRSTNAME)
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
                        if (value.ORDERTOTAL != "") {
                            ordertotal = FormatDecimal(value.ORDERTOTAL);

                        }
                        else {

                            ordertotal = "$0.00";
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
                        if (value.CARDNUMBER != "" && value.CARDNUMBER != undefined) {
                            cardNumber = value.CARDNUMBER;
                        }
                        /*------------------Order Area-----------------------*/

                        var html = "<div class=\"order-container\"  id='li_" + value.ID + "' >";


                        /*------------------Order Row-----------------------*/

                        html += "<div id=\"dvOrderInner_" + value.ID + "\" class=\"order-list panel-open\" data-panel=\"left\"  data-popup=\".popup-details\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\" >";

                        /*------------------Column 1-----------------------*/

                        html += "<div class=\"order-column-one\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\" >";
                        /*------------------Status Icon--------------------*/
                        if (status == '' || status == "All")
                        {
                            if (value.ORDERSTATUSID.toLowerCase() == "new") {
                                html += "<div class=\"order-status-icon\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></div>";
                            }
                            else if (value.ORDERSTATUSID.toLowerCase() == "processing") {
                                html += "<div class=\"order-status-icon\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></div>";
                            }
                            else if (value.ORDERSTATUSID.toLowerCase() == "complete") {
                                html += "<div class=\"order-status-icon\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></div>";
                            }
                            else if (value.ORDERSTATUSID.toLowerCase() == "pickedup") {
                                html += "<div class=\"order-status-icon\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                            }
                        }
                    
                        /*-----------------Status Icon End----------------*/
                      if (value.PICKUPTIME != undefined) {
                        if (status == '' || status == "All")
                            html += "<div class=\"order-pickup\">" + value.PICKUPTIME + "</div>";
                        else
                            html += "<div class=\"order-pickup  order-pickup-margin-top\" style=\"margin-top:22px;\">" + value.PICKUPTIME + "</div>";
                           
                        }
                      //else {
                      //  if (status == '' || status == "All")
                      //      html += "<div class=\"order-pickup\"></div>";
                      //  else

                      //      html += "<div class=\"order-pickup order-pickup-margin-top\"></div>";
                      //  }
                        html += "</div>";
                        /*------------------Column 1-----------------------*/
                        /*------------------Column 2-----------------------*/
                        html += "<div class=\"order-column-two\">";
                        /*------------------1st Row-----------------------*/
                        html += "<div class=\"order-row-container\">";
                        html += "<div class=\"order-number\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\" >#" + value.ID + "<span> on </span><span>" + orderDate + " @ " + orderTime + "</span></div>";
                        /*------------------Button Row-----------------------*/
                        if (value.ORDERSTATUSID == "New") {

                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnAccept\"><img src=\"./img/icons/accept_button.png\" style=\"width:21%;margin: 0 61px;\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('New'," + value.ID + "," + storeId + ")\"  id=\"btnNew\" style=\"display:none;\"><img src=\"./img/icons/new_button.png\" /></button>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Complete'," + value.ID + "," + storeId + ")\" id=\"btnComplete\" style=\"display:none;\"><img src=\"./img/icons/complete_button.png\"  /></button>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnProcessing\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\"  /></button>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('PickedUp'," + value.ID + "," + storeId + ")\"  id=\"btnPickedUp\" style=\"display:none;\"><img src=\"./img/icons/picked_up_button.png\"  /></button>";
                            buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\" /></button>";
                        }
                        else if (value.ORDERSTATUSID == "Processing") {
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnAccept\"  style=\"display:none;\"><img src=\"./img/icons/accept_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('New'," + value.ID + "," + storeId + ")\"  id=\"btnNew\"><img src=\"./img/icons/new_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Complete'," + value.ID + "," + storeId + ")\"  id=\"btnComplete\"><img src=\"./img/icons/complete_button.png\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnProcessing\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('PickedUp'," + value.ID + "," + storeId + ")\"  id=\"btnPickedUp\" style=\"display:none;\"><img src=\"./img/icons/picked_up_button.png\"/></a>";
                            buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\"  /></a>";
                        }
                        else if (value.ORDERSTATUSID == "Complete") {
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnAccept\"  style=\"display:none;\"><img src=\"./img/icons/accept_button.png\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('New'," + value.ID + "," + storeId + ")\"  id=\"btnNew\" style=\"display:none;\"><img src=\"./img/icons/new_button.png\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Complete'," + value.ID + "," + storeId + ")\"  id=\"btnComplete\" style=\"display:none;\"><img src=\"./img/icons/complete_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnProcessing\" ><img src=\"./img/icons/pending_button.png\" style=\"width:61%;margin:0 0;\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('PickedUp'," + value.ID + "," + storeId + ")\"  id=\"btnPickedUp\"><img src=\"./img/icons/picked_up_button.png\" style=\"width:61%;margin:0 0;\"/></a>";
                            if ($("#hdnSelectedOrderPickUpSMSSentTime").val().trim() == "")
                                buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\"><img src=\"./img/icons/pickup_sms_button.png\"  style=\"width:61%;margin:0 0;\"/></button>";
                            else
                                buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\" style=\"width:61%;margin:0 0;\"/></a>";

                        }
                        else if (value.ORDERSTATUSID == "PickedUp") {
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnAccept\"  style=\"display:none;\"><img src=\"./img/icons/accept_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('New'," + value.ID + "," + storeId + ")\"  id=\"btnNew\" style=\"display:none;\"><img src=\"./img/icons/new_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Complete'," + value.ID + "," + storeId + ")\"  id=\"btnComplete\"><img src=\"./img/icons/complete_button.png\"  style=\"width:21%;margin: 0 61px;\"/></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnProcessing\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('PickedUp'," + value.ID + "," + storeId + ")\"  id=\"btnPickedUp\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\"  /></a>";
                        }
                        html += "<div class=\"order-buttons\">";
                        html += buttonHTML;
                        html += "</div>";

                        /*------------------Button Row-----------------------*/
                        //html += "<div class=\"order-price\">" + ordertotal + "</div>";
                        html += "</div>";
                        /*------------------1st Row-----------------------*/

                        /*------------------2nd Row-----------------------*/
                        html += "<div class=\"order-row-container\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\" >";

                        /*------------------Customer Info-----------------------*/
                        html += "<div class=\"order-date\">";
                        html += "<div class=\"customer-detail-container\">";
                        html += "<div class=\"customer-name\">" + firstName + " " + lastName + "</div>";
                        html += "<div>" + phone + "</div>";
                        //html += "<div class=\"display-label-wrap\">" + email + "</div>";
                        html += "</div>";
                        html += "</div>";
                        /*------------------Customer Info-----------------------*/
                        /*------------------Order Info-----------------------*/
                        html += "<div class=\"order-items-count\">";
                        html += "<div class=\"customer-detail-container\">";
                        html += "<div class=\"order-price\">" + ordertotal + "</div>";
                        if (value.NOOFITEMS == 1)
                            html += "<div>1 item ";
                        else
                            html += "<div>" + value.NOOFITEMS + " items ";
                        if (paymentMethod == "Cash On Delivery") {
                            html += "<span class=\"cc-number\">Due on Pickup</span>";
                        }
                        else {
                            if (cardNumber != "") {
                                $("#lblPaymentValue").html("PAID, CC ending in " + cardNumber);
                                html += "<span class=\"cc-number\">PAID, ";
                                html += "<span class=\"cc-number\"> CC " + cardNumber + "</span></span>";
                            }
                            else {
                                html += "<span class=\"cc-number\">PAID</span>";
                            }
                        }
                        html += "</div>";


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
    }
   
    storeId = SetStoreId();
    customerId = SetCustomerId();
    if (Number(storeId) > 0) {
       
        carryoutcurrentPage = Number(carryoutcurrentPage) * Number(carryoutpagesize);
        url = global + "/GetAllCarryOutOrdersTemp?storeid=" + storeId + "&status=" + status + "&pagesize=" + carryoutpagesize + "&currentPage=" + carryoutcurrentPage;
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
                        if (value.ORDERTOTAL != "") {
                            ordertotal = FormatDecimal(value.ORDERTOTAL);

                        }
                        else {

                            ordertotal = "$0.00";
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

                        var html = "<div class=\"order-container\"  id='li_" + value.ID + "' >";


                        /*------------------Order Row-----------------------*/

                        html += "<div class=\"order-list panel-open\" data-panel=\"left\"  data-popup=\".popup-details\" >";

                        /*------------------Column 1-----------------------*/

                        html += "<div class=\"order-column-one\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\" >";
                        /*------------------Status Icon--------------------*/
                        if (status == '' || status == "All") {
                            if (value.ORDERSTATUSID.toLowerCase() == "new") {
                                html += "<div class=\"order-status-icon\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></div>";
                            }
                            else if (value.ORDERSTATUSID.toLowerCase() == "processing") {
                                html += "<div class=\"order-status-icon\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></div>";
                            }
                            else if (value.ORDERSTATUSID.toLowerCase() == "complete") {
                                html += "<div class=\"order-status-icon\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></div>";
                            }
                            else if (value.ORDERSTATUSID.toLowerCase() == "pickedup") {
                                html += "<div class=\"order-status-icon\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                            }
                        }

                        /*-----------------Status Icon End----------------*/
                        if (value.PICKUPTIME != undefined) {
                            if (status == '' || status == "All")
                                html += "<div class=\"order-pickup\">" + value.PICKUPTIME + "</div>";
                            else
                                html += "<div class=\"order-pickup  order-pickup-margin-top\" style=\"margin-top:22px;\">" + value.PICKUPTIME + "</div>";

                        }
                        else {
                            if (status == '' || status == "All")
                                html += "<div class=\"order-pickup\"></div>";
                            else

                                html += "<div class=\"order-pickup order-pickup-margin-top\"></div>";
                        }
                        html += "</div>";
                        /*------------------Column 1-----------------------*/
                        /*------------------Column 2-----------------------*/
                        html += "<div class=\"order-column-two\">";
                        /*------------------1st Row-----------------------*/
                        html += "<div class=\"order-row-container\">";
                        html += "<div class=\"order-number\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\" >#" + value.ID + "<span> on </span><span>" + orderDate + " @ " + orderTime + "</span></div>";
                        /*------------------Button Row-----------------------*/
                        if (value.ORDERSTATUSID == "New") {

                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnAccept\"><img src=\"./img/icons/accept_button.png\" style=\"width:21%;margin: 0 61px;\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('New'," + value.ID + "," + storeId + ")\"  id=\"btnNew\" style=\"display:none;\"><img src=\"./img/icons/new_button.png\" /></button>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Complete'," + value.ID + "," + storeId + ")\" id=\"btnComplete\" style=\"display:none;\"><img src=\"./img/icons/complete_button.png\"  /></button>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnProcessing\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\"  /></button>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('PickedUp'," + value.ID + "," + storeId + ")\"  id=\"btnPickedUp\" style=\"display:none;\"><img src=\"./img/icons/picked_up_button.png\"  /></button>";
                            buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\" /></button>";
                        }
                        else if (value.ORDERSTATUSID == "Processing") {
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnAccept\"  style=\"display:none;\"><img src=\"./img/icons/accept_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('New'," + value.ID + "," + storeId + ")\"  id=\"btnNew\"><img src=\"./img/icons/new_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Complete'," + value.ID + "," + storeId + ")\"  id=\"btnComplete\"><img src=\"./img/icons/complete_button.png\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnProcessing\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('PickedUp'," + value.ID + "," + storeId + ")\"  id=\"btnPickedUp\" style=\"display:none;\"><img src=\"./img/icons/picked_up_button.png\"/></a>";
                            buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\"  /></a>";
                        }
                        else if (value.ORDERSTATUSID == "Complete") {

                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnAccept\"  style=\"display:none;\"><img src=\"./img/icons/accept_button.png\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('New'," + value.ID + "," + storeId + ")\"  id=\"btnNew\" style=\"display:none;\"><img src=\"./img/icons/new_button.png\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Complete'," + value.ID + "," + storeId + ")\"  id=\"btnComplete\" style=\"display:none;\"><img src=\"./img/icons/complete_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnProcessing\" ><img src=\"./img/icons/pending_button.png\" style=\"width:61%;margin:0 0;\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('PickedUp'," + value.ID + "," + storeId + ")\"  id=\"btnPickedUp\"><img src=\"./img/icons/picked_up_button.png\" style=\"width:61%;margin:0 0;\"/></a>";
                            if ($("#hdnSelectedOrderPickUpSMSSentTime").val().trim() == "")
                                buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\"><img src=\"./img/icons/pickup_sms_button.png\"  style=\"width:61%;margin:0 0;\"/></button>";
                            else
                                buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\" style=\"width:61%;margin:0 0;\"/></a>";

                        }
                        else if (value.ORDERSTATUSID == "PickedUp") {

                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnAccept\"  style=\"display:none;\"><img src=\"./img/icons/accept_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('New'," + value.ID + "," + storeId + ")\"  id=\"btnNew\" style=\"display:none;\"><img src=\"./img/icons/new_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Complete'," + value.ID + "," + storeId + ")\"  id=\"btnComplete\"><img src=\"./img/icons/complete_button.png\"  style=\"width:21%;margin: 0 61px;\"/></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnProcessing\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeOrderStatusNew('PickedUp'," + value.ID + "," + storeId + ")\"  id=\"btnPickedUp\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\"  /></a>";
                        }
                        html += "<div class=\"order-buttons\">";
                        html += buttonHTML;
                        html += "</div>";

                        /*------------------Button Row-----------------------*/
                        html += "</div>";
                        /*------------------1st Row-----------------------*/

                        /*------------------2nd Row-----------------------*/
                        html += "<div class=\"order-row-container\" onclick=\"OpenCarryoutDetails(" + value.ID + ");\" >";

                        /*------------------Customer Info-----------------------*/
                        html += "<div class=\"order-date\">";
                        html += "<div class=\"customer-detail-container\">";
                        html += "<div class=\"customer-name\">" + firstName + " " + lastName + "</div>";
                        html += "<div>" + phone + "</div>";
                        //html += "<div class=\"display-label-wrap\">" + email + "</div>";
                        html += "</div>";
                        html += "</div>";
                        /*------------------Customer Info-----------------------*/
                        /*------------------Order Info-----------------------*/
                        html += "<div class=\"order-items-count\">";
                        html += "<div class=\"customer-detail-container\">";
                        html += "<div class=\"order-price\">" + ordertotal + "</div>";
                        if (value.NOOFITEMS == 1)
                            html += "<div>1 item ";
                        else
                            html += "<div>" + value.NOOFITEMS + " items ";
                        if (paymentMethod == "Cash On Delivery") {
                            html += "<span class=\"cc-number\">Due on Pickup</span>";
                        }
                        else {
                            if (cardNumber != "") {
                                $("#lblPaymentValue").html("PAID, CC ending in " + cardNumber);
                                html += "<span class=\"cc-number\">PAID, ";
                                html += "<span class=\"cc-number\"> CC " + cardNumber + "</span></span>";
                            }
                            else {
                                html += "<span class=\"cc-number\">PAID</span>";
                            }
                        }
                        html += "</div>";


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

   var storeId = SetStoreId();
    if(id>0)
    {
        url = global + "/GetCarryOutOrderDetailsWithAllInfo?orderid=" + id;
        $.getJSON(url, function (data) {
            var html = "";
            var htmlDiscount = "";
            var htmlRewards = "";
            var htmlGiftCard = "";
            var htmlSubTotal = "";
            var htmlOrderTotal = "";
            var subtotalvalue = "0.00";
            var ordertotalvalue = "0.00";
            var orderDiscount = 0.00;

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
            $.each(JSON.parse(data), function (index, value) {
               
                if (value.Type == "OrderInfo") {
   
                    orderDiscount = value.ORDERDISCOUNT;
                    subtotalvalue = value.SUBTOTAL;
                    ordertotalvalue = value.ORDERTOTAL;
                    orderId = value.OID;

                    $("#hdnSelectedOrderId").val(orderId);
                    if (value.ORDERTOTAL != "") {
                        $("#hdnSelectedOrderOrderPrice").val(FormatDecimal(value.ORDERTOTAL));
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

                    if (value.PICKUPTIME != undefined) {
                        $("#hdnSelectedOrderPickUpTime").val(value.PICKUPTIME);
                    }

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

                if (value.ORDERTOTAL != "") {
                    ordertotal = FormatDecimal(value.ORDERTOTAL);

                }
                else {

                    ordertotal = "$0.00";
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
                if (value.CARDNUMBER != "" && value.CARDNUMBER != undefined) {
                    cardNumber = value.CARDNUMBER;
                }
                /*------------------Order Area-----------------------*/
                var buttonHTML = "";
                var orderhtml = "<div class=\"order-container\">";


                /*------------------Order Row-----------------------*/

                orderhtml += "<div>";

                /*------------------Column 1-----------------------*/

                orderhtml += "<div class=\"order-column-one\">";
                /*------------------Status Icon--------------------*/
                if (status == '' || status == "All") {
                    if (value.ORDERSTATUSID.toLowerCase() == "new") {
                        orderhtml += "<div class=\"order-status-icon\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></div>";
                    }
                    else if (value.ORDERSTATUSID.toLowerCase() == "processing") {
                        orderhtml += "<div class=\"order-status-icon\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></div>";
                    }
                    else if (value.ORDERSTATUSID.toLowerCase() == "complete") {
                        orderhtml += "<div class=\"order-status-icon\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></div>";
                    }
                    else if (value.ORDERSTATUSID.toLowerCase() == "pickedup") {
                        orderhtml += "<div class=\"order-status-icon\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                    }
                }

                /*-----------------Status Icon End----------------*/
                if (value.PICKUPTIME != undefined) {
                    if (status == '' || status == "All")
                        orderhtml += "<div class=\"order-pickup\">" + value.PICKUPTIME + "</div>";
                    else
                        orderhtml += "<div class=\"order-pickup  order-pickup-margin-top\">" + value.PICKUPTIME + "</div>";

                }
                else {
                    if (status == '' || status == "All")
                        orderhtml += "<div class=\"order-pickup\"></div>";
                    else

                        orderhtml += "<div class=\"order-pickup order-pickup-margin-top\"></div>";
                }
                orderhtml += "</div>";
                /*------------------Column 1-----------------------*/
                /*------------------Column 2-----------------------*/
                orderhtml += "<div class=\"order-column-two\">";
                /*------------------1st Row-----------------------*/
                orderhtml += "<div class=\"order-row-container\">";
                orderhtml += "<div class=\"order-number\">#" + value.OID + "<span> on </span><span>" + orderDate + " @ " + orderTime + "</span></div>";
                /*------------------Button Row-----------------------*/
                if (value.ORDERSTATUSID == "New") {

                    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnAccept\"><img src=\"./img/icons/accept_button.png\"  /></a>";
                    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('New'," + value.ID + "," + storeId + ")\"  id=\"btnNew\" style=\"display:none;\"><img src=\"./img/icons/new_button.png\" /></button>";
                    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Complete'," + value.ID + "," + storeId + ")\" id=\"btnComplete\" style=\"display:none;\"><img src=\"./img/icons/complete_button.png\"  /></button>";
                    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnProcessing\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\"  /></button>";
                    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('PickedUp'," + value.ID + "," + storeId + ")\"  id=\"btnPickedUp\" style=\"display:none;\"><img src=\"./img/icons/picked_up_button.png\"  /></button>";
                    buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\" /></button>";
                }
                else if (value.ORDERSTATUSID == "Processing") {
                    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnAccept\"  style=\"display:none;\"><img src=\"./img/icons/accept_button.png\"  /></a>";
                    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('New'," + value.ID + "," + storeId + ")\"  id=\"btnNew\"><img src=\"./img/icons/new_button.png\"  /></a>";
                    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Complete'," + value.ID + "," + storeId + ")\"  id=\"btnComplete\"><img src=\"./img/icons/complete_button.png\" /></a>";
                    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnProcessing\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\" /></a>";
                    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('PickedUp'," + value.ID + "," + storeId + ")\"  id=\"btnPickedUp\" style=\"display:none;\"><img src=\"./img/icons/picked_up_button.png\"/></a>";
                    buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\"  /></a>";
                }
                else if (value.ORDERSTATUSID == "Complete") {

                    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnAccept\"  style=\"display:none;\"><img src=\"./img/icons/accept_button.png\" /></a>";
                    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('New'," + value.ID + "," + storeId + ")\"  id=\"btnNew\" style=\"display:none;\"><img src=\"./img/icons/new_button.png\" /></a>";
                    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Complete'," + value.ID + "," + storeId + ")\"  id=\"btnComplete\" style=\"display:none;\"><img src=\"./img/icons/complete_button.png\"  /></a>";
                    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnProcessing\" ><img src=\"./img/icons/pending_button.png\" /></a>";
                    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('PickedUp'," + value.ID + "," + storeId + ")\"  id=\"btnPickedUp\"><img src=\"./img/icons/picked_up_button.png\" /></a>";
                    if ($("#hdnSelectedOrderPickUpSMSSentTime").val().trim() == "")
                        buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\"><img src=\"./img/icons/pickup_sms_button.png\"  /></button>";
                    else
                        buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\" /></a>";

                }
                else if (value.ORDERSTATUSID == "PickedUp") {

                    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnAccept\"  style=\"display:none;\"><img src=\"./img/icons/accept_button.png\"  /></a>";
                    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('New'," + value.ID + "," + storeId + ")\"  id=\"btnNew\" style=\"display:none;\"><img src=\"./img/icons/new_button.png\"  /></a>";
                    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Complete'," + value.ID + "," + storeId + ")\"  id=\"btnComplete\"><img src=\"./img/icons/complete_button.png\"  /></a>";
                    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('Processing'," + value.ID + "," + storeId + ")\"  id=\"btnProcessing\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\"  /></a>";
                    buttonHTML += "<a onclick=\"ChangeOrderStatusNew('PickedUp'," + value.ID + "," + storeId + ")\"  id=\"btnPickedUp\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\"  /></a>";
                    buttonHTML += "<a onclick=\"SendPickUpSMSToCustomer(" + value.ID + ")\"  id=\"btnPickupSMS\" style=\"display:none;\"><img src=\"./img/icons/pickup_sms_button.png\"  /></a>";
                }
                orderhtml += "<div class=\"order-buttons\">";
                orderhtml += buttonHTML;
                orderhtml += "</div>";

                /*------------------Button Row-----------------------*/
                orderhtml += "</div>";
                /*------------------1st Row-----------------------*/

                /*------------------2nd Row-----------------------*/
                orderhtml += "<div class=\"order-row-container\">";

                /*------------------Customer Info-----------------------*/
                orderhtml += "<div class=\"order-date\">";
                orderhtml += "<div class=\"customer-detail-container\">";
                orderhtml += "<div class=\"customer-name\">" + firstName + " " + lastName + "</div>";
                orderhtml += "<div>" + phone + "</div>";
                orderhtml += "<div class=\"display-label-wrap\">" + email + "</div>";
                orderhtml += "</div>";
                orderhtml += "</div>";
                /*------------------Customer Info-----------------------*/
                /*------------------Order Info-----------------------*/
                orderhtml += "<div class=\"order-items-count\">";
                orderhtml += "<div class=\"customer-detail-container\">";
                orderhtml += "<div class=\"order-price\">" + ordertotal + "</div>";
                if (value.NOOFITEMS == 1)
                    orderhtml += "<div>1 item ";
                else
                    orderhtml += "<div>" + value.NOOFITEMS + " items ";
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
                /*------------------Order Info-----------------------*/


                orderhtml += "</div>";
                /*------------------2nd Row-----------------------*/
                orderhtml += "</div>";
                /*------------------Column 2-----------------------*/

                orderhtml += "</div>";
                /*------------------Order Row-----------------------*/

  

                orderhtml += "</div>";
                /*------------------Order Area-----------------------*/
                $("#dvOrderInfo").html(orderhtml);

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
                    htmlOrderTotal += "<td style=\"text-align:right;\">" + FormatDecimal(ordertotalvalue) + "</td>";
                    htmlOrderTotal += "</tr>";
                }
                else {
                    htmlOrderTotal = " <tr>";
                    htmlOrderTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Order Total:</td>";
                    htmlOrderTotal += "<td style=\"text-align:right;\">" + FormatDecimal(ordertotalvalue) + "</td>";
                    htmlOrderTotal += "</tr>";
                }
                //console.log(html)
                $("#dvItem").html(html + htmlSubTotal + htmlDiscount + htmlRewards + htmlGiftCard + htmlOrderTotal + "</tbody>");
                //
                //$("#dvOrderInner_")
                $("#dvCarryOutPanel").html($("#dvCarryOutDetails").html());
                //$("#tableItems tbody").append(html + htmlSubTotal + htmlDiscount + htmlRewards + htmlGiftCard + htmlOrderTotal);
            });

        });
    }

}
function CloseCarryOutDetails()
{
    $("#dvCarryOutPanel").html("");
}
function BindcarryoutTab(status)
{
   // console.log(status)
    localStorage.setItem("CurrentPage", 0);
    $('#hdnCurrentState').val(status);
    CarryoutOrdersList(status, 10, 0, '');
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
function ChangeOrderStatusNew(status,orderId, storeId) {
    

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
               
                if($('#hdnCurrentState').val()=="New")
                {
                    localStorage.setItem("CurrentPage", 0);
                    CarryoutOrdersList('New', 10, 0, 'dvNewList');
                }
                else if ($('#hdnCurrentState').val() == "Processing") {
                   
                    localStorage.setItem("CurrentPage", 0);
                    CarryoutOrdersList('Processing', 10, 0, 'dvProcessingList');
                }
                else {
                   
                    localStorage.setItem("CurrentPage", 0);
                    CarryoutOrdersList('All', 10, 0, 'dvAllList');
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
                    console.log("DiscountInfo: " + value.COUPONCODE);

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
//function SetMenuNavigation(storeId) {
//    console.log(storeId);
//	var sId = window.localStorage.getItem("StoreId").trim();
//	if (storeId === null || storeId === "" || storeId === "0") {
//	}
//	else
//	{
//		storeId=Number(sId);
//	}
//    $("#aManageService").removeAttr("href");
//    $("#aManageService").attr("href", "manageservice.html?StoreId=" + storeId);

//    $("#aCarryout").removeAttr("href");
//    $("#aCarryout").attr("href", "carryout.html?StoreId=" + storeId);

//    $("#aGiftCard").removeAttr("href");
//    $("#aGiftCard").attr("href", "giftcardsredeem.html?StoreId=" + storeId);

//    $("#aReward").removeAttr("href");
//    $("#aReward").attr("href", "rewards.html?StoreId=" + storeId);

//}

function FormatDecimal(decimalValue) {
    var result = "";
    result = "$" + parseFloat(Math.round(decimalValue * 100) / 100).toFixed(2);
    return result;
}
function FormatPhoneNumber(s) {
    var s2 = ("" + s).replace(/\D/g, '');
    var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
}
const dateFromStr = str => new Date('1970/01/01 ' + str);
//function CheckNewOrder() {
//    console.log(GetCurrentDateTime() + " - " + "CheckNewOrder START", browser);
//    var params = getParams();
//    var storeId = 0;
//    storeId = SetStoreId();
//    if (Number(storeId) > 0) {
//        url = global + "/GetLatestCarryOutOrderPopupNew?storeid=" + storeId;
//        try {
//            console.log(GetCurrentDateTime() + " - " + "Searching for new orders", browser);
//            $.getJSON(url, function (data) {
//                var obj = JSON.parse(data).Rows;
//                if (data.indexOf("No order(s) found.") > -1) {
//                    console.log(GetCurrentDateTime() + " - " + " No new order(s) found", browser);
//                }
//                else {

//                    var pickuptime = JSON.parse(data).PickUpTime;
//                    pickuptime.sort((a, b) => dateFromStr(a) - dateFromStr(b));

//                    if (obj != "") {
//                        var html = "";
//                        var orderIds = "";
//                        $.each(obj, function (index, value) {
//                            if (orderIds != "")
//                                orderIds = orderIds + "," + value.ID;
//                            else
//                                orderIds = value.ID;

//                            if (pickuptime.length > 0) {
//                                var pickupcount = false;
//                                var count = 0;
//                                var pickuphtml = "<select class=\"pickup\" id=\"pickuplist_" + value.ID + "\">";
//                                $.each(pickuptime, function (key, value1) {
//                                    var now = new Date();
//                                    var pickupdatetime = new Date(GetCurrentDateOnly() + " " + value.PICKUPTIME);
//                                    var dropdownValueDateTime = new Date(GetCurrentDateOnly() + " " + value1);
//                                    var minsDiff = Math.floor((dropdownValueDateTime.getTime() - now.getTime()) / 1000 / 60);
//                                    var minsDiffFromPickUpTime = Math.floor((dropdownValueDateTime.getTime() - pickupdatetime.getTime()) / 1000 / 60);
//                                    if ($.inArray(value.PICKUPTIME.trim(), pickuptime) > -1) {

//                                        if (value1.trim() === value.PICKUPTIME.trim()) {
//                                            pickuphtml += "<option value='" + value1 + "' selected>" + value1 + "</option>";
//                                            pickupcount = true;

//                                        }
//                                        else {
//                                            if (pickupcount === true) {

//                                                if (minsDiffFromPickUpTime <= 120) {
//                                                    if (minsDiff > 0) {
//                                                        pickuphtml += "<option value='" + value1 + "'>" + value1 + "</option>";
//                                                    }
//                                                    else {
//                                                        pickuphtml += "<option disabled value='" + value1 + "'>" + value1 + "</option>";
//                                                    }

//                                                }

//                                            }

//                                        }
//                                    }
//                                    else {
//                                        if (minsDiffFromPickUpTime <= 120) {
//                                            if (minsDiff > 0) {
//                                                pickuphtml += "<option value='" + value1 + "'>" + value1 + "</option>";
//                                            }
//                                            else {
//                                                pickuphtml += "<option disabled value='" + value1 + "'>" + value1 + "</option>";
//                                            }

//                                        }

//                                    }

//                                });
//                                pickuphtml += "</select>";
//                            }

//                            html += "<div id=\"divAcknowledgement\" style=\"border-bottom:#cecece 1px dotted !important;padding:0 0 10px; 0;\">";
//                            html += "<div class=\"row\">";
//                            html += "<div class=\"col-md-4\" style=\"text-align:left;vertical-align:top;margin-top:10px;\"><span style=\"font-size:17px;font-weight:bold;\">Order #: </span>" + value.ID + "</div>";
//                            if (value.PICKUPTIME != "")
//                            {
//                                html += "<div class=\"col-md-5\" style=\"padding-top:5px;\"><div id=\"pickuptime_" + value.ID + "\" style=\"font-size:28px;color:#08b3c7; float: left;\">" + value.PICKUPTIME + "</div>" + pickuphtml + "</div>";
//                            }
//                            else {
//                                html += "<div class=\"col-md-5\" style=\"padding-top:5px;\"><input type=\"hidden\" name=\"giftcardorder\" id=\"" + value.ID + "\"/><div style=\"font-size:28px;color:#08b3c7; float: left;\">&nbsp;</div></div>";
//                            }
//                            html += "<div class=\"col-md-3\" style=\"text-align:right;vertical-align:top;\"><span style=\"font-size:28px;color:#799427;\" id=\"price\">" + FormatDecimal(value.ORDERTOTAL) + "</span></div></div>";
//                            html += "<div class=\"row\"> <div class=\"col-md-12\" style=\"text-align:left;\"><span style=\"font-size:17px;font-weight:bold;\">Name: </span>" + value.BILLINGFIRSTNAME + " " + value.BILLINGLASTNAME + "</div></div>";;
//                            if (value.BILLINGPHONE.length == 10)
//                                html += "<div class=\"row\">  <div class=\"col-md-12\" style=\"text-align:left;\"><span style=\"font-size:17px;font-weight:bold;\">Phone: </span><span id=\"phone_" + value.ID + "\">" + FormatPhoneNumber(value.BILLINGPHONE) + "</span></div></div>";
//                            else
//                                html += "<div class=\"row\">  <div class=\"col-md-12\" style=\"text-align:left;\"><span style=\"font-size:17px;font-weight:bold;\">Phone: </span><span id=\"phone_" + value.ID + "\">" + value.BILLINGPHONE + "</span></div></div>";
//                            html += "<div class=\"row\"><div class=\"col-md-12\" style=\"margin:10px 0 0 0;\">";

//                            html += "<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" id=\"popUpItems\"> <tbody>";
//                            html += "<tr><td align=\"left\" style=\"font-size:17px;font-weight:bold;border-bottom:1px solid #000;\" width=\"60%\">Items</td><td style=\"font-size:17px;font-weight:bold;border-bottom:1px solid #000;\" align=\"center\" width=\"20%\">Quantity</td> <td style=\"font-size:17px;font-weight:bold;border-bottom:1px solid #000;\" align=\"right\" width=\"20%\">Price</td></tr>";
//                            if (value.OrderItems.indexOf("#") > -1) {
//                                var arrItemRows = value.OrderItems.split('#');
//                                var i;
//                                for (i = 0; i < arrItemRows.length - 1; i++) {
//                                    html += "<tr>";
//                                    var columns = arrItemRows[i].trim();
//                                    if (columns.indexOf('~') > -1) {
//                                        var arrColumn = columns.split('~');
//                                        var j;
//                                        //console.log("arrColumn.length: " + arrColumn.length)
//                                        var name = arrColumn[0];
//                                        var qty = arrColumn[1];
//                                        var price = arrColumn[2];
//                                        var notes = unescape(arrColumn[3]);
//                                        if (notes != "") {
//                                            html += "<td align=\"left\" style=\"font-size:17px;\">" + name + "(" + decode_str(notes) + ")</td>";
//                                        }
//                                        else {
//                                            html += "<td align=\"left\" style=\"font-size:17px;\">" + name + "</td>";
//                                        }

//                                        html += "<td align=\"center\" style=\"font-size:17px;\">" + qty + "</td>";
//                                        html += "<td align=\"right\" style=\"font-size:17px;\">" + FormatDecimal(price) + "</td>";

//                                    }
//                                    html += "</tr>";
//                                }

//                            }

//                            html += "</tbody></table>";


//                            html += "</div></div></div>";


//                        });
//                        //console.log("html: " + html)
//                        $("#dvPopOrders").html(html);
//                        $("#hdnOrderIds").val(orderIds);
//                        console.log(GetCurrentDateTime() + " - " + " Found new orders(" + orderIds + ")", browser);
//                        //$('#myModal').modal();
                        
//                        if (isDevice()) {
//                           // console.log('isDevice 1: ')
//                            playAudio();
//                        }
//                    }
//                    else {
//                        //console.log("2");
//                        console.log(GetCurrentDateTime() + " - " + " No new order(s) found(2)", browser);
//                    }

//                }

//            });
//        }
//        catch (e) {
//            console.log(GetCurrentDateTime() + " - " + " Error CheckNewOrder", browser);
//        }
//    }

//    console.log(GetCurrentDateTime() + " - " + "CheckNewOrder END", browser);
//}
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


//function AcceptOrders() {
//    var orderIds = $("#hdnOrderIds").val().trim();
//    var orders = [];
//    var customerphone = [];
//    var carryoutchanged = 0;
//    var giftcardchanged = 0;
//    if (localStorage.getItem("RestaurantName") != null)
//        restaurantDisplayName = localStorage.getItem("RestaurantName").trim();
//    $(".pickup").each(function (index, element) {
//        // element == this
//        var elemId = $(this).attr("id");
//        var orderId = $(this).attr("id").split('_')[1];

//        var pickup = $(this).val().trim();
//        var oldPickUp = $("#pickuptime_" + orderId).html().trim();
//        var phone = $("#phone_" + orderId).html().trim().replace("(", "").replace(")", "").replace("-", "");
//        //console.log("id: " + $(this).attr("id"));
//        //console.log("oid:" + $(this).attr("id").split('_')[1]);
//        //console.log("pickup: " + $(this).val());
//        orders.push(orderId + "#" + pickup);
//        if (oldPickUp != pickup) {
//            customerphone.push(orderId + "#" + pickup + "#" + phone + "#changed");
//        }
//        else {
//            customerphone.push(orderId + "#" + pickup + "#" + phone + "#notchanged");
//        }
//        carryoutchanged++;

//    });
//    var group = $('input[name="giftcardorder"]');

//    if (group.length > 0) {
//        group.each(function () {
//            var orderId = $(this).attr("id");
//            orders.push(orderId + "#NA");
//            giftcardchanged++;
//        });
//    }
//    //console.log(orders)
//    currentPage = 0;
//    pageSize = 10;
//    $.ajax({
//        url: global + 'ChangeBulkOrderStatus',
//        type: 'GET',
//        data: {
//            orderId: JSON.stringify(orders),
//            status: 'Processing',
//            restaurantDisplayName: restaurantDisplayName,
//            orderDetails: JSON.stringify(customerphone)
//        },
//        datatype: 'jsonp',
//        contenttype: "application/json",
//        crossDomain: true,
//        async: false,
//        success: function (response) {
//            console.log("ChangeBulkOrderStatus: " + response)
//            if (isDevice()) {
//                stopAudio();
//            }

//            //CarryoutOrdersList("Processing", pageSize, currentPage);
//            $("#hdnOrderIds").val("");
//            acceptOrderPopup.close();
//            var storeId = 0;
//            storeId = SetStoreId();
//            if (giftcardchanged > 0 && carryoutchanged > 0) {
//                if (giftcardchanged > carryoutchanged) {
//                    //window.location.href = "giftcardsorders.html?StoreId=" + storeId;
//                    self.app.router.navigate('/giftcard/', { reloadCurrent: false });
//                    localStorage.setItem("loadgiftcardorders", "true");
//                }
//                else {
//                    //window.location.href = "carryout.html?StoreId=" + storeId + "&status=Processing";
//                    self.app.router.navigate('/carryout/', { reloadCurrent: false });
//                    localStorage.setItem("loadcarryoutprocessing", "true");

//                }
//            }
//            else if (giftcardchanged > 0 && carryoutchanged == 0) {
//                //window.location.href = "giftcardsorders.html?StoreId=" + storeId;
//                self.app.router.navigate('/giftcard/', { reloadCurrent: false });
//                localStorage.setItem("loadgiftcardorders", "true");
//            }
//            else if (carryoutchanged > 0 && giftcardchanged == 0) {
//                // window.location.href = "carryout.html?StoreId=" + storeId + "&status=Processing";
//                self.app.router.navigate('/carryout/', { reloadCurrent: false });
//                localStorage.setItem("loadcarryoutprocessing", "true");
//            }
//        },
//        error: function (xhr, textStatus, errorThrown) {
//            //alert(xhr.responseText);
//            //alert(textStatus);
//            //alert(errorThrown);
//        }
//    });
//}

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
            if (giftcardchanged > 0 && carryoutchanged > 0)
            {
                if (giftcardchanged > carryoutchanged)
                {
                    window.location.href = "giftcardsorders.html?StoreId=" + storeId;
                }
                else {
                    window.location.href = "carryout.html?StoreId=" + storeId + "&status=Processing";

                }
            }
            else if(giftcardchanged>0 && carryoutchanged==0)
            {
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

function filterJSON(my_object, my_criteria) {

    var result = my_object.filter(function (entry) {
        return entry.DAY === my_criteria;
    });
    return result;
    //console.log("yahooOnly: " + yahooOnly)
    //console.log("my_object: " + my_object.toString())
    //console.log("my_criteria: " + my_criteria.toString())
    //return my_object.filter(function (obj) {
    //    return Object.keys(my_criteria).every(function (c) {
    //        return obj[c] == my_criteria[c];
    //    });
    //});

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
    //SetMenuNavigation(storeId);
    var carryOutEnabled = localStorage.getItem("CarryOutEnabled").trim();
    var giftCardsEnabled = localStorage.getItem("GiftCardsEnabled").trim();
    var giftCardProgramEnabled = localStorage.getItem("GiftCardProgramEnabled").trim();
    var rewardEnabled = localStorage.getItem("RewardsEnabled").trim();
    //alert(rewardEnabled);
    //alert("GiftCard: " + giftCardsEnabled);
    //alert("GiftCard Program: "+giftCardProgramEnabled);

    if (carryOutEnabled != "" && carryOutEnabled == "True") {
        $('.menuCarryout').removeClass('disabled');
        $('.menuStartStop').removeClass('disabled');
    }
    else {
        $('.menuCarryout').addClass('disabled');
        $('.menuStartStop').addClass('disabled');
    }

    if (giftCardsEnabled != "" && giftCardsEnabled == "True") {
        $('.menuGiftcard').removeClass('disabled');
    }
    else {
        $('.menuGiftcard').addClass('disabled');
    }


    if (rewardEnabled != "" && rewardEnabled == "True") {
        $('.menuReward').removeClass('disabled');
    }
    else {
        $('.menuReward').addClass('disabled');
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
    //$('#dvOuter').hide();
    //$('#dvOuterText').html("");

    //$('#btnRedeemReward').removeClass("search-button");
    $('#btnLoadGiftCard').addClass("disabled");
    //$('#btnLoadReward').removeClass("search-button");
    $('#btnRedeemGiftCard').addClass("disabled");

    $("#txtRedeem").css('border-bottom', bottomBorder)
    $("#txtLoad").css('border-bottom', bottomBorder)
    $("#txtRedeem").val("");
    $("#txtLoad").val("");
    $('#btnLoadGiftCard').text("Load");
    $('#btnRedeemGiftCard').text("Redeem");


    var storeId = 0;
    var params = getParams();
    storeId = SetStoreId();

    if (storeId > 0) {
        var cardCode = $('#txtCardCodeSearch').val();
        var phone = $('#txtPhone').val();
        if (phone == '') {
            phone = '0';
        }
        if (cardCode != "") {
            $("#txtCardCodeSearch").css('border-bottom', bottomBorder);
            $("#txtPhoneSearch").css('border-bottom', bottomBorder);
            $("#txtRedeem").css('border-bottom', bottomBorder);
            $("#txtLoad").css('border-bottom', bottomBorder);

            $('#dvOuter').show();
            $('#dvOuterText').html("");
            try {
                var url = global + "/GiftCardSearch?storeid=" + storeId + "&giftCardCode=" + encodeURIComponent(cardCode) + "&phone=" + phone;
                //alert(url);
                $('#tblRedeemHistory tbody').html("");
                var totalHistoryAmount = 0;
                $.getJSON(url, function (data) {
                    //console.log(data);
                    //console.log(data.replace(/"/g, "").indexOf("Invalid Card Code."));
                    if (data.replace(/"/g, "").indexOf("Phone is not valid.") > -1) {
                        $('#dvInner').hide();
                        //$('#btnLoadReward').prop("disabled", true);
                        //$('#btnRedeemReward').prop("disabled", true);
                        if (phone.trim() === '' || phone === '0') {
                            console.log("1");
                            $('#dvInner').hide();
                            $('#dvOuter').hide();
                            $('#dvOuterText').html("");
                            $("#txtPhoneSearch").css('border-bottom', errorClassBorder);
                        }
                        else {
                            console.log("2");
                            $("#txtPhoneSearch").css('border', noErrorClassBorder);
                            $('#dvInner').hide();
                            $('#dvOuter').hide();

                            callSweetAlertWarning("Invalid Phone Number.");
                        }
                    }
                    else if (data.replace(/"/g, "").indexOf("Invalid Card Code.") > -1) {
                        //$('#btnLoadReward').prop("disabled", true);
                        //$('#btnRedeemReward').prop("disabled", true);
                        //console.log("a");
                        $('#dvInner').hide();
                        $('#dvOuter').hide();

                        callSweetAlertWarning("Invalid Gift Card Code.");
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
                            console.log(value);
                            $('#btnRedeemGiftCard').removeClass("disabled");
                            //$('#btnRedeemReward').addClass("search-button");
                            $('#btnLoadGiftCard').removeClass("disabled");
                            //$('#btnLoadReward').addClass("search-button");
                            //$('#btnLoadReward').prop("disabled", false);
                            //$('#btnRedeemReward').prop("disabled", false);
                            console.log("Value Type: " + value.Type);
                            if (value.Type == "GiftCardInfo") {
                                var htmlHistory = "";
                                var firstName = "";
                                var lastName = "";
                                var email = "";
                                var phoneNumber = "";
                                var orderId = "";
                                var amount = "";
                                var balanceAmount = "";
                                if (value.FIRSTNAME != "") {
                                    firstName = value.FIRSTNAME;
                                }
                                if (value.LASTNAME != "") {
                                    lastName = value.LASTNAME;
                                }
                                if (value.EMAIL != "") {
                                    email = value.EMAIL;
                                }
                                if (value.PHONE != "") {
                                    phoneNumber = value.PHONE;

                                }
                                else {
                                    $("#txtPhoneSearch").val("");
                                }

                                if (value.ORDERID != "") {
                                    orderId = value.ORDERID;
                                }
                                if (value.AMOUNT != "") {
                                    amount = FormatDecimal(value.AMOUNT);
                                    //amount = value.AMOUNT;
                                }
                                console.log("Card Balance: " + value.BALANCEAMOUNT);
                                if (value.BALANCEAMOUNT != "") {
                                    balanceAmount = FormatDecimal(value.BALANCEAMOUNT);
                                    //balanceAmount = value.BALANCEAMOUNT;
                                }
                                else {
                                    balanceAmount = "$0.00";
                                }
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
                                $("#lblEmail").html(email);
                                $('#hdnSelectedOrderId').val(orderId);
                                $('#lblCurrentBalance').html(" " + balanceAmount);
                                $('#lblOriginalValue').html(" " + amount);

                            }
                            else if (value.Type == "UsedHistory") {
                                console.log(value.GiftCardId);
                                var usedDate = value.USEDDATE.replace("~", " @ ");
                                htmlHistory += "<tr>";
                                htmlHistory += "<td>" + usedDate + "</td>";
                                console.log("Used Type: " + value.USEDTYPE + " Used Value: " + value.USEDVALUE);
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
    var amount = $('#txtRedeem').val();
    if (amount == '')
        amount = '0';
    var register = $('#ddlRegister').val();
    if (storeId > 0) {
        if (cardCode != "" && amount != "" && amount != "0") {
            $('#btnRedeemGiftCard').text("Redeeming...");
            //$('#btnRedeemReward').css("font-size", "22px");
            try {
                url = global + "/GiftCardRedeem?storeid=" + storeId + "&giftCardCode=" + encodeURIComponent(cardCode) + "&phone=" + phone + "&amount=" + amount + "&register=" + register;
                //alert(url);
                $('#tblRedeemHistory tbody').html("");
                var totalHistoryAmount = 0;
                $.getJSON(url, function (data) {
                    $('#btnRedeemGiftCard').text("Redeem");
                    //$('#btnRedeemReward').css("font-size", "24px");
                    $("#txtCardCodeSearch").css('border-bottom', bottomBorder);
                    $("#txtRedeem").css('border-bottom', bottomBorder);
                    $("#txtPhoneSearch").css('border-bottom', bottomBorder);

                    console.log("Redeemed: " + data);
                    if (data.replace(/"/g, "").indexOf("Phone is not valid.") > -1) {
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
function ClearSpecialCharacter(obj) {
    var clearoutput = $('#' + obj).val().replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '-').replace(/^(-)+|(-)+$/g, '');
    $('#' + obj).val(clearoutput);

    //if ($('#' + obj).val().trim() != "")
    //{
    //    if ($.isNumeric($('#' + obj).val().trim())) {
    //        console.log("ClearSpecialCharacter: Numpad")
    //        $('#txtCardCode').numpad();
    //    }
    //    else {
    //        console.log("ClearSpecialCharacter: AlphaNumeric");
    //        $("table.nmpd-grid .cancel").click();
    //        //OpenKeyBoard('txtCardCode');
    //    }
    //}

}
function LoadGiftCard() {
    $('#dvOuter').hide();
    $('#dvOuterText').html("");

    $("#txtRedeem").css('border-bottom', bottomBorder);
    var storeId = 0;
    storeId = SetStoreId();
    var cardCode = $('#txtCardCodeSearch').val();
    var phone = $('#txtPhoneSearch').val();
    if (phone == '') {
        phone = '0';
    }
    var amount = $('#txtLoad').val();
    if (amount == '')
        amount = '0';
    //&& amount != "" && amount != "0"
    if (cardCode != "") {

        var regex = /^[a-zA-Z0-9.\-_]+$/;
        var giftCardCode = "";
        if (regex.test(cardCode) == true) {
        }
        else {
            var str = cardCode.replace(/[^0-9\-]/g, '');
            cardCode = str.substring(0, 16);
        }

        $('#btnLoadGiftCard').text("Loading...");
        try {
            url = global + "/GiftCardLoad?storeid=" + storeId + "&giftCardCode=" + encodeURIComponent(cardCode) + "&phone=" + phone + "&amount=" + amount;
            //alert(url);

            var totalHistoryAmount = 0;
            $.getJSON(url, function (data) {
                $('#btnLoadGiftCard').text("Load");
                $("#txtCardCodeSearch").css('border-bottom', bottomBorder);
                $("#txtLoad").css('border-bottom', bottomBorder);
                $("#txtPhoneSearch").css('border-bottom', bottomBorder);

                console.log("Load: " + data);
                if (data.replace(/"/g, "").indexOf("Phone is not valid.") > -1) {
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
        catch (e) {

        }
    }
    else {
        $('#dvInner').hide();
        if (cardCode == "") {
            $("#txtCardCodeSearch").css('border-bottom', errorClassBorder);

            $("#txtLoad").css('border-bottom', bottomBorder);
        }
        else if (amount == "" || amount == "0") {
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

    //&& amount != "" && amount != "0"
    if (cardCode != "" && amount != "" && amount != "0") {

        var regex = /^[a-zA-Z0-9.\-_]+$/;
        var giftCardCode = "";
        if (regex.test(cardCode) == true) {
        }
        else {
            var str = cardCode.replace(/[^0-9\-]/g, '');
            cardCode = str.substring(0, 16);
        }
        //console.log("ssss: " + isEmail("#txtEmail"))
        if (isEmail("#txtEmail") == true) {
            var customerId = "0";
            $('#btnAddCard').text("Adding...");
            try {
                if (localStorage.getItem("CustomerId") != null) {
                    customerId = localStorage.getItem("CustomerId").trim();
                }
                //alert("CustomerId" + customerId);
                var email = encodeURIComponent($('#txtEmail').val());
                var name = encodeURIComponent($('#txtName').val());
                console.log("email: " + email)
                var url = global + "/NewGiftCardLoad?storeid=" + storeId + "&giftCardCode=" + encodeURIComponent(cardCode) + "&phone=" + phone + "&amount=" + amount + "&customerId=" + customerId + "&email=" + email + "&name=" + name;
                //alert(url);

                var totalHistoryAmount = 0;
                $.getJSON(url, function (data) {
                    $('#btnLoadGiftCard').text("Add Card");
                    $("#txtCardCode").css('border-bottom', bottomBorder);
                    $("#txtAmount").css('border-bottom', bottomBorder);
                    $("#txtPhone").css('border-bottom', bottomBorder);
                    $("#txtName").css('border-bottom', bottomBorder);
                    $("#txtEmail").css('border-bottom', bottomBorder);

                    //$("#txtCardCode").css('border-width', '1px');
                    //$("#txtAmount").css('border-width', '1px');
                    //$("#txtPhone").css('border-width', '1px');

                    //$("#txtEmail").css('border-width', '1px');
                    //$("#txtName").css('border-width', '1px');
                    console.log(data);
                    if (data.indexOf("Card is already in the system.") > -1) {
                        $('#dvOuter').hide();
                        //$('#dvInner').hide();
                        //$('#dvOuter').show();
                        //$('#dvOuterText').html("");
                        //$('#dvOuterText').html("Card is already in the system.");

                        callSweetAlertWarning("Card is already in the system.");

                        $("#txtCardCode").css('border-bottom', errorClassBorder);
                        $('#btnAddCard').text("Add Card");
                    }
                    else {
                        $('#dvOuter').hide();
                        //$('#dvOuter').show();
                        //$('#dvOuterText').html("");
                        //$('#dvOuterText').html("Card loaded successfully.");
                        //$('#dvOuterText').attr("style", "color:#3c763d !important");

                        var popuphtml = "<p><span style='color:#000;'>Card Code:  </span><span class=\"main-one\">" + $("#txtCardCode").val() + "</span></p>";

                        if ($('#txtAmount').val() != "")
                            popuphtml = popuphtml + "<p><span style='color:#000;'>Amount:  </span><span class=\"main-two\">" + FormatDecimal($("#txtAmount").val()) + "</span></p>";
                        if ($('#txtName').val() != "")
                            popuphtml = popuphtml + "<p>" + $("#txtName").val() + "</p>";

                        if ($('#txtEmail').val() != "")
                            popuphtml = popuphtml + "<p>" + $("#txtEmail").val() + "</p>";

                        if ($('#txtPhone').val() != "") {
                            if ($('#txtPhone').val().length == 10)
                                popuphtml = popuphtml + "<p>" + FormatPhoneNumber($("#txtPhone").val()) + "</p>";
                            else
                                popuphtml = popuphtml + "<p>" + $("#txtPhone").val() + "</p>";
                        }

                        console.log(popuphtml)


                        //callSweetAlertSuccess("Card loaded successfully.");
                        swal({
                            title: "New Card loaded successfully!",
                            //html: "<p><strong>Member ID:</strong>1082</p><p><strong>Name:</strong>John Smith</p><p><strong>Phone:</strong>(614)805-5665</p><p><strong>Email:</strong>cyberv1@mail.com</p><p><strong>Points:</strong>100</p>",
                            html: popuphtml,
                            confirmButtonText: "OK",
                            type: "success",
                            confirmButtonClass: 'btn btn-success',
                            buttonsStyling: false,
                            customClass: 'swal-wide',
                        });

                        $('#btnAddCard').text("Add Card");

                        $('#txtAmount').val("");
                        $('#txtPhone').val("");
                        $('#txtCardCode').val("");
                        $('#txtEmail').val("");
                        $('#txtName').val("");


                    }
                });
            }
            catch (e) {

            }
        }
        else {

        }

    }
    else {
        $('#dvInner').hide();
        if (cardCode == "") {
            console.log("2:")
            $("#txtCardCode").css('border-bottom', errorClassBorder);
            //$("#txtCardCode").css('border-width', '3px');

        }
        if (amount === "" || amount === "0") {
            console.log("3:")

            $("#txtAmount").css('border-bottom', errorClassBorder);
            //$("#txtAmount").css('border-width', '3px');
        }
    }
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
    //$("#dvItem").html("");

    //$("#lblCutomerName").text("");
    //$("#lblCutomerPhone").text("");
    //$("#lblEmail").text("");
    $("#hdnSelectedOrderId").val("0");
    //$("#iconEmail").hide();
    //$("#iconPhone").hide();
    //$("#titleRedemptionHistory").hide();
    var params = getParams();

    customerId = SetCustomerId();
    storeId = SetStoreId();

    var orderId = $("#txtOrderId").val();
    var giftCardCode = $("#txtGiftCardCode").val();
    var name = $("#txtName").val();

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
        url = global + "/GetStoreAllGiftCards?storeid=" + storeId + "&orderId=" + orderId + "&giftcardcode=" + giftCardCode + "&recipientname=" + name + "&pagesize=" + pagesize + "&currentPage=" + currentPage;

        try {
            $.getJSON(url, function (data) {
                //console.log(data);
                $('#loader_msg').html("");
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;
                console.log("Length: " + length);
                if (length == 0) {
                    $('#dvOuterOrder').show();
                    $("#dvOuterOrderText").show();
                    $('#dvOuterOrderText').html("");
                    $('#dvOuterOrderText').html("No records found.");
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

                        html += "<div class=\"order-column-one panel-open\" data-panel=\"left\" onclick=\"OpenGiftCardDetails(" + value.ID + ");\">";
                        /*------------------Status Icon--------------------*/

                        if (value.ORDERSTATUSID.toLowerCase() == "new") {
                            html += "<div class=\"order-status-icon\"><img class=\"list-icon\" src=\"img/icons/new.png\" alt=\"\"/></div>";
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "processing") {
                            html += "<div class=\"order-status-icon\"><img class=\"list-icon\" src=\"img/icons/pending.png\" alt=\"\"/></div>";
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "shipped") {
                            html += "<div class=\"order-status-icon\"><img class=\"list-icon\" src=\"img/icons/shipped.png\" alt=\"\"/></div>";
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "complete") {
                            html += "<div class=\"order-status-icon\"><img class=\"list-icon\" src=\"img/icons/Complete-Icon.png\" alt=\"\"/></div>";
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "pickedup") {
                            html += "<div class=\"order-status-icon\"><img class=\"list-icon\" src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                        }

                        /*-----------------Status Icon End----------------*/
                        if (value.GIFTCARDCOUPONCODE != undefined) {
                            html += "<div class=\"order-pickup\" id=\'lbl_giftCardCode_" + value.ID + "'>" + value.GIFTCARDCOUPONCODE + "</div>";
                        }
                        else {
                            html += "<div class=\"order-pickup\" id=\'lbl_giftCardCode_" + value.ID + "'></div>";
                        }
                        html += "</div>";
                        /*------------------Column 1-----------------------*/
                        /*------------------Column 2-----------------------*/
                        html += "<div class=\"order-column-two\">";
                        /*------------------1st Row-----------------------*/
                        html += "<div class=\"order-row-container\">";
                        //html += "<div class=\"giftcard-order-number panel-open\" data-panel=\"left\" onclick=\"OpenGiftCardDetails(" + value.ID + ");\">#" + value.ORDERID + "<span> on </span><span>" + orderDate + " @ " + orderTime + "</span></div>";
                        html += "<div class=\"giftcard-order-number panel-open\" data-panel=\"left\" onclick=\"OpenGiftCardDetails(" + value.ID + ");\">#" + value.ORDERID + "<span> on </span><span>" + orderDate + "</span></div>";
                        /*------------------Button Row-----------------------*/
                        if (value.ORDERSTATUSID == "New") {

                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnNew_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/new_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\" style=\"width:21%;margin:0 61px;\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/picked_up_button.png\"/></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/shipped_button.png\"/></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/complete_button.png\" /></a>";

                        }
                        else if (value.ORDERSTATUSID == "Processing") {
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnNew_" + value.ID + "\"><img src=\"./img/icons/new_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/picked_up_button.png\"/></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/shipped_button.png\"/></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img src=\"./img/icons/complete_button.png\" /></a>";
                        }
                        else if (value.ORDERSTATUSID == "Shipped") {
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnNew_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/new_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img src=\"./img/icons/picked_up_button.png\"/></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/shipped_button.png\"/></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img src=\"./img/icons/complete_button.png\" /></a>";

                        }
                        else if (value.ORDERSTATUSID == "PickedUp") {
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnNew_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/new_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/picked_up_button.png\"/></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img src=\"./img/icons/shipped_button.png\"/></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img src=\"./img/icons/complete_button.png\" /></a>";
                        }
                        else if (value.ORDERSTATUSID == "Complete") {
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnNew_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/new_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\" style=\"width:61%;margin:0 0;\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img src=\"./img/icons/picked_up_button.png\" style=\"width:61%;margin:0 0;\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img src=\"./img/icons/shipped_button.png\" style=\"width:61%;margin:0 0;\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/complete_button.png\" /></a>";

                        }
                        html += "<div class=\"order-buttons\">";
                        html += buttonHTML;
                        html += "</div>";

                        /*------------------Button Row-----------------------*/
                        //html += "<div class=\"order-price\">" + ordertotal + "</div>";
                        html += "</div>";
                        /*------------------1st Row-----------------------*/

                        /*------------------2nd Row-----------------------*/
                        html += "<div class=\"order-row-container\">";

                        /*------------------Customer Info-----------------------*/
                        html += "<div class=\"order-date panel-open\" data-panel=\"left\" onclick=\"OpenGiftCardDetails(" + value.ID + ");\">";
                        html += "<div class=\"customer-detail-container\">";
                        html += "<div class=\"customer-name\">" + name + "</div>";
                        html += "<div>" + phone + "</div>";
                        //html += "<div class=\"display-label-wrap\">" + email + "</div>";
                        html += "</div>";
                        html += "</div>";
                        /*------------------Customer Info-----------------------*/
                        /*------------------Order Info-----------------------*/
                        html += "<div class=\"giftcard-order-items-count\">";
                        html += "<div class=\"customer-detail-container\">";
                        html += "<div class=\"order-price\">" + giftcardBalance + "</div>";

                        html += "<div>" + value.GIFTCARDTYPEID + "</div>";


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


    if (Number(storeId) > 0) {
        //SetMenuNavigation(storeId);

        currentPage = Number(currentPage) * Number(pagesize);
        url = global + "/GetStoreAllGiftCards?storeid=" + storeId + "&orderId=" + orderId + "&giftcardcode=" + giftCardCode + "&recipientname=" + name + "&pagesize=" + pagesize + "&currentPage=" + currentPage;

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

                        html += "<div class=\"order-column-one panel-open\" data-panel=\"left\" onclick=\"OpenGiftCardDetails(" + value.ID + ");\">";
                        /*------------------Status Icon--------------------*/

                        if (value.ORDERSTATUSID.toLowerCase() == "new") {
                            html += "<div class=\"order-status-icon\"><img class=\"list-icon\"  src=\"img/icons/new.png\" alt=\"\"/></div>";
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "processing") {
                            html += "<div class=\"order-status-icon\"><img class=\"list-icon\"  src=\"img/icons/pending.png\" alt=\"\"/></div>";
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "shipped") {
                            html += "<div class=\"order-status-icon\"><img class=\"list-icon\"  src=\"img/icons/shipped.png\" alt=\"\"/></div>";
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "complete") {
                            html += "<div class=\"order-status-icon\"><img class=\"list-icon\"  src=\"img/icons/Complete-Icon.png\" alt=\"\"/></div>";
                        }
                        else if (value.ORDERSTATUSID.toLowerCase() == "pickedup") {
                            html += "<div class=\"order-status-icon\"><img class=\"list-icon\"  src=\"img/icons/Picked-Up-Icon.png\" alt=\"\"/></div>";
                        }

                        /*-----------------Status Icon End----------------*/
                        if (value.GIFTCARDCOUPONCODE != undefined) {
                            html += "<div class=\"order-pickup\" id=\'lbl_giftCardCode_" + value.ID + "'>" + value.GIFTCARDCOUPONCODE + "</div>";
                        }
                        else {
                            html += "<div class=\"order-pickup\" id=\'lbl_giftCardCode_" + value.ID + "'></div>";
                        }
                        html += "</div>";
                        /*------------------Column 1-----------------------*/
                        /*------------------Column 2-----------------------*/
                        html += "<div class=\"order-column-two\">";
                        /*------------------1st Row-----------------------*/
                        html += "<div class=\"order-row-container\">";
                        //html += "<div class=\"giftcard-order-number panel-open\" data-panel=\"left\" onclick=\"OpenGiftCardDetails(" + value.ID + ");\">#" + value.ORDERID + "<span> on </span><span>" + orderDate + " @ " + orderTime + "</span></div>";
                        html += "<div class=\"giftcard-order-number panel-open\" data-panel=\"left\" onclick=\"OpenGiftCardDetails(" + value.ID + ");\">#" + value.ORDERID + "<span> on </span><span>" + orderDate + "</span></div>";
                        /*------------------Button Row-----------------------*/
                        if (value.ORDERSTATUSID == "New") {

                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnNew_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/new_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\" style=\"width:21%;margin:0 61px;\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/picked_up_button.png\"/></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/shipped_button.png\"/></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/complete_button.png\" /></a>";

                        }
                        else if (value.ORDERSTATUSID == "Processing") {
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnNew_" + value.ID + "\"><img src=\"./img/icons/new_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/picked_up_button.png\"/></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/shipped_button.png\"/></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img src=\"./img/icons/complete_button.png\" /></a>";
                        }
                        else if (value.ORDERSTATUSID == "Shipped") {
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnNew_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/new_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img src=\"./img/icons/picked_up_button.png\"/></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/shipped_button.png\"/></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img src=\"./img/icons/complete_button.png\" /></a>";

                        }
                        else if (value.ORDERSTATUSID == "PickedUp") {
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnNew_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/new_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/pending_button.png\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/picked_up_button.png\"/></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img src=\"./img/icons/shipped_button.png\"/></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\"><img src=\"./img/icons/complete_button.png\" /></a>";
                        }
                        else if (value.ORDERSTATUSID == "Complete") {
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('New'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnNew_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/new_button.png\"  /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Processing'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnProcessing_" + value.ID + "\"><img src=\"./img/icons/pending_button.png\" style=\"width:61%;margin:0 0;\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('PickedUp'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnPickedUp_" + value.ID + "\"><img src=\"./img/icons/picked_up_button.png\" style=\"width:61%;margin:0 0;\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Shipped'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnShipped_" + value.ID + "\"><img src=\"./img/icons/shipped_button.png\" style=\"width:61%;margin:0 0;\" /></a>";
                            buttonHTML += "<a onclick=\"ChangeGiftCardOrderStatusById('Complete'," + value.ID + ", " + value.ORDERID + ")\" id=\"btnComplete_" + value.ID + "\" style=\"display:none;\"><img src=\"./img/icons/complete_button.png\" /></a>";

                        }
                        html += "<div class=\"order-buttons\">";
                        html += buttonHTML;
                        html += "</div>";

                        /*------------------Button Row-----------------------*/
                        //html += "<div class=\"order-price\">" + ordertotal + "</div>";
                        html += "</div>";
                        /*------------------1st Row-----------------------*/

                        /*------------------2nd Row-----------------------*/
                        html += "<div class=\"order-row-container\">";

                        /*------------------Customer Info-----------------------*/
                        html += "<div class=\"order-date panel-open\" data-panel=\"left\" onclick=\"OpenGiftCardDetails(" + value.ID + ");\">";
                        html += "<div class=\"customer-detail-container\">";
                        html += "<div class=\"customer-name\">" + name + "</div>";
                        html += "<div>" + phone + "</div>";
                        //html += "<div class=\"display-label-wrap\">" + email + "</div>";
                        html += "</div>";
                        html += "</div>";
                        /*------------------Customer Info-----------------------*/
                        /*------------------Order Info-----------------------*/
                        html += "<div class=\"giftcard-order-items-count\">";
                        html += "<div class=\"customer-detail-container\">";
                        html += "<div class=\"order-price\">" + giftcardBalance + "</div>";

                        html += "<div>" + value.GIFTCARDTYPEID + "</div>";


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

                        if (value.ORDERSTATUSID == "New") {
                            $("#btnProcessing_" + value.ID).show();
                            $("#btnPickedUp_" + value.ID).hide();
                            $("#btnShipped_" + value.ID).hide();
                            $("#btnNew_" + value.ID).hide();
                            $("#btnComplete_" + value.ID).hide();

                        }
                        else if (value.ORDERSTATUSID == "Processing") {
                            $("#btnProcessing_" + value.ID).hide();
                            $("#btnPickedUp_" + value.ID).hide();
                            $("#btnShipped_" + value.ID).hide();
                            $("#btnNew_" + value.ID).show();
                            $("#btnComplete_" + value.ID).show();
                        }
                        else if (value.ORDERSTATUSID == "Shipped") {
                            $("#btnProcessing_" + value.ID).hide();
                            $("#btnPickedUp_" + value.ID).show();
                            $("#btnShipped_" + value.ID).hide();
                            $("#btnNew_" + value.ID).hide();
                            $("#btnComplete_" + value.ID).show();
                        }
                        else if (value.ORDERSTATUSID == "PickedUp") {
                            $("#btnProcessing_" + value.ID).hide();
                            $("#btnPickedUp_" + value.ID).hide();
                            $("#btnShipped_" + value.ID).show();
                            $("#btnNew_" + value.ID).hide();
                            $("#btnComplete_" + value.ID).show();
                        }
                        else if (value.ORDERSTATUSID == "Complete") {
                            $("#btnProcessing_" + value.ID).show();
                            $("#btnPickedUp_" + value.ID).show();
                            $("#btnShipped_" + value.ID).show();
                            $("#btnNew_" + value.ID).hide();
                            $("#btnComplete_" + value.ID).hide();
                        }
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
                orderDateTimeHtml = "#" + value.ORDERID + "<span> on </span><span>" + orderDate + " @ " + orderTime + "</span>";
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

                if (value.ORDERSTATUSID == "New") {
                    $("#btnProcessing").show();
                    $("#btnProcessing img").attr("style", "width: 21% !important;");
                    //$("#imgNew").show();

                    $("#btnPickedUp").hide();
                    $("#btnShipped").hide();
                    $("#btnNew").hide();
                    $("#btnComplete").hide();

                }
                else if (value.ORDERSTATUSID == "Processing") {
                    $("#btnProcessing").hide();
                    $("#btnPickedUp").hide();
                    $("#btnShipped").hide();
                    $("#btnNew").show();
                    $("#btnComplete").show();
                    //$("#imgProcessing").show();
                }
                else if (value.ORDERSTATUSID == "Shipped") {
                    $("#btnProcessing").hide();
                    $("#btnPickedUp").show();
                    $("#btnShipped").hide();
                    $("#btnNew").hide();
                    $("#btnComplete").show();
                    //$("#imgShipped").show();
                }
                else if (value.ORDERSTATUSID == "PickedUp") {
                    $("#btnProcessing").hide();
                    $("#btnPickedUp").hide();
                    $("#btnNew").hide();
                    $("#btnShipped").show();
                    $("#btnComplete").show();
                    //$("#imgPickedUp").show();
                }
                else if (value.ORDERSTATUSID == "Complete") {
                    $("#btnProcessing").show();
                    $("#btnPickedUp").show();
                    $("#btnShipped").show();
                    //$("#imgComplete").show();

                    $("#btnProcessing img").attr("style", "width: 61% !important;");
                    $("#btnPickedUp img").attr("style", "width: 61% !important;");
                    $("#btnShipped img").attr("style", "width: 61% !important;");

                    $("#btnNew").hide();
                    $("#btnComplete").hide();
                }
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
    $('#dvGiftCardDetailsInner').show();
    $('#dvGiftCardDetails').html($('#dvGiftCardDetailsInner').html());
}

function ClearGiftCardDetails() {
    $('#dvGiftCardDetailsInner').hide();
    $('#dvGiftCardDetails').html("");
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
                //console.log(data);
                RefreshGiftCards();
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
    $('#dvGiftCardDetails #aEditCode').hide();
    $('#dvGiftCardDetails #aEditCode').prev().hide();
    $('#dvGiftCardDetails #aEditCode').next().show();
    $('#dvGiftCardDetails #txtEditGiftCardCode').show();
    $('#dvGiftCardDetails #txtEditGiftCardCode').val("");
    $("#dvGiftCardDetails #txtEditGiftCardCode").val($('#dvGiftCardDetails #aEditCode').prev().text());
    $('#dvGiftCardDetails #aSaveCode').show();
}
function SaveCardCode() {
    $('#dvGiftCardDetails #aSaveCode').hide();
    $('#dvGiftCardDetails #aSaveCode').prev().hide();
    $('#dvGiftCardDetails #aSaveCode').next().show();
    var giftcardid = $("#dvGiftCardDetails #hdnGiftCardId").val();
    if ($('#dvGiftCardDetails #txtEditGiftCardCode').val() != "")
        UpdateGiftCardCode(giftcardid, encodeURIComponent($('#dvGiftCardDetails #txtEditGiftCardCode').val()));
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
                if (value.ORDERSTATUSID == "New") {
                    $("#btnProcessing").show();
                    $("#btnPickedUp").hide();
                    $("#btnShipped").hide();
                    $("#btnNew").hide();
                    $("#btnComplete").hide();

                }
                else if (value.ORDERSTATUSID == "Processing") {
                    $("#btnProcessing").hide();
                    $("#btnPickedUp").hide();
                    $("#btnShipped").hide();
                    $("#btnNew").show();
                    $("#btnComplete").show();
                }
                else if (value.ORDERSTATUSID == "Shipped") {
                    $("#btnProcessing").hide();
                    $("#btnPickedUp").show();
                    $("#btnShipped").hide();
                    $("#btnNew").hide();
                    $("#btnComplete").show();
                }
                else if (value.ORDERSTATUSID == "PickedUp") {
                    $("#btnProcessing").hide();
                    $("#btnPickedUp").hide();
                    $("#btnShipped").show();
                    $("#btnNew").hide();
                    $("#btnComplete").show();
                }
                else if (value.ORDERSTATUSID == "Complete") {
                    $("#btnProcessing").show();
                    $("#btnPickedUp").show();
                    $("#btnShipped").show();
                    $("#btnNew").hide();
                    $("#btnComplete").hide();
                }
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

                RefreshGiftCards();
                RefreshGiftCardDetails(giftCardId);

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
    RefreshGiftCards();
}
function HideSearch() {
    $('#linkSearchIcon').hide();
}
//Gift Card Orders END

//GiftCard Redeem End

//Reward Start
function SearchReward() {
    //$('#btnRedeemReward').removeClass("search-button");
    //$('#btnRedeemReward').addClass("search-button-one");
    //$('#btnLoadReward').removeClass("search-button");
    //$('#btnLoadReward').addClass("search-button-one");

    $("#txtLoad_LoadRedeem").css('border-bottom', bottomBorder);
    $("#txtRedeem_LoadRedeem").css('border-bottom', bottomBorder);
    $('#btnLoadReward').text("Load");
    $('#btnRedeemReward').text("Redeem");
    $('#dvOuter').hide();


    var storeId = 0;
    storeId = SetStoreId();
    var memberId = $('#txtMemberID_LoadRedeem').val();

    var phone = $('#txtPhone_LoadRedeem').val();

    var lastName = $("#txtLastName_LoadRedeem").val();


    if (memberId != "" || phone != "" || phone != '0' || lastName != "") {

        try {
            url = global + "/RewardSearch?storeid=" + storeId + "&rewardMemberId=" + memberId + "&phone=" + phone + "&lastName=" + encodeURIComponent(lastName);
            //alert(url);
            $('#tblRewardHistory tbody').html("");
            $.getJSON(url, function (data) {
                console.log(data);
                if (data.replace(/"/g, "").indexOf("Phone is not valid.") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#btnLoadReward').addClass("disabled");
                    $('#btnRedeemReward').addClass("disabled");
                    if (phone == '' || phone == '0') {
                        $('#dvInner_Reward').hide();
                        $("#txtPhone_LoadRedeem").css('border', errorClassBorder);

                        $('#dvOuter').hide();
                        $('#dvOuterText').html("");
                    }
                    else if (memberId == "") {
                        $('#dvInner_Reward').hide();
                        $("#txtMemberID_LoadRedeem").css('border', errorClassBorder);

                    }
                    else {
                        $("#txtPhone_LoadRedeem").css('border', errorClassBorder);

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
                    callSweetAlertWarning("Invalid Member Number.");
                    $('#btnLoadReward').addClass("disabled");
                    $('#btnRedeemReward').addClass("disabled");
                }
                else if (data.replace(/"/g, "").indexOf("No record(s) found.") > -1) {
                    $('#dvInner_Reward').hide();
                    $('#dvOuter').show();
                    $('#dvOuterText').html("");
                    $('#dvOuterText').html("No records found.");
                    $('#btnLoadReward').addClass("disabled");
                    $('#btnRedeemReward').addClass("disabled");
                    //WriteLog(SearchGiftCard() + " - " + " No order(s) found.", browser);
                    callSweetAlertWarning("No records found.");
                }
                else {
                    //$("#txtMemberID_LoadRedeem").css('border', noErrorClassBorder);
                    //$("#txtMemberID_LoadRedeem").css('border-bottom', bottomBorder);
                    //$("#txtPhone_LoadRedeem").css('border', noErrorClassBorder);
                    //$("#txtPhone_LoadRedeem").css('border-bottom', bottomBorder);
                    $('#lblMemberId').html(memberId);
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
                            var rewardMemberId = "";
                            if (value.FIRSTNAME != "") {
                                firstName = value.FIRSTNAME;
                            }
                            if (value.LASTNAME != "") {
                                lastName = value.LASTNAME;
                            }
                            if (value.EMAIL != "") {
                                email = value.EMAIL;
                            }
                            if (value.PHONE != "") {
                                phoneNumber = value.PHONE;
                            }
                            if (value.PointsBalance != "") {
                                ourLocationPoint = value.PointsBalance;
                            }
                            if (value.BistroPointsBalance != "") {
                                bistroPoint = value.BistroPointsBalance;
                            }
                            if (value.RelatedStorePointsBalance != "") {
                                relatedStorePointsBalance = value.RelatedStorePointsBalance;
                            }
                            if (value.RewardMemberID != "" && memberId == "") {
                                rewardMemberId = value.RewardMemberID;
                                $("#txtMemberID_LoadRedeem").val(rewardMemberId);
                            }
                            else if (phoneNumber != "") {
                                $("#txtPhone_LoadRedeem").val(phoneNumber);
                            }

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
                            $('#lblRelatedPoints').html(relatedStorePointsBalance);

                        }
                        else if (value.Type == "RewardHistory") {
                            var rewardDate = value.CreatedOnUtc.replace("~", " @ ");
                            htmlHistory += "<tr>";
                            htmlHistory += "<td style=\"text-align:left; width=\"45%\"\">" + rewardDate + "</td>";
                            htmlHistory += "<td style=\"text-align:left; width=\"25%\">" + value.STORENAME + "</td>";
                            if (value.Points != "" && value.Points.toString().startsWith("-")) {
                                htmlHistory += "<td style=\"text-align:center; width=\"15%\">" + value.Points + "</td>";
                            }
                            else if (value.Points != "") {
                                htmlHistory += "<td style=\"text-align:center; width=\"15%\">+" + value.Points + "</td>";
                            }
                            else {
                                htmlHistory += "<td style=\"text-align:center; width=\"15%\"> </td>";
                            }
                            htmlHistory += "<td style=\"text-align:right; width=\"15%\">" + FormatDecimal(value.OrderValue) + "</td>";
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
                        $('#divRelatedStoreName').show();
                        $('#lblRelatedRestauransName').html("(" + relatedStoreName + ")");
                    }
                    else {
                        $('#divRelatedStoreName').hide();
                        $('#lblRelatedStorePoint').hide();
                        $('#lblRelatedPoints').hide();
                    }
                    //$('#tdTotal').html(FormatDecimal(totalHistoryAmount));
                    $('#dvInner_Reward').show();
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

        $('#dvInner_Reward').hide();
        //$("#txtMemberID_LoadRedeem").css('border-bottom', errorClassBorder);

    }
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
        $('#dvInner_Reward').hide();
        if (memberId == "") {
            $("#txtMemberID_LoadRedeem").css('border-bottom', errorClassBorder);
            $("#txtRedeem_LoadRedeem").css('border-bottom', errorClassBorder);
            $("#txtLoad_LoadRedeem").css('border-bottom', errorClassBorder);
        }
        else if (loadPoint == "" || loadPoint == "0") {
            $("#txtMemberID_LoadRedeem").css('border-bottom', errorClassBorder);
            $("#txtRedeem_LoadRedeem").css('border-bottom', errorClassBorder);
            $("#txtLoad_LoadRedeem").css('border-bottom', errorClassBorder);

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
        $('#dvInner_Reward').hide();
        if (memberId == "") {
            $("#txtMemberID_LoadRedeem").css('border-bottom', errorClassBorder);

            $("#txtLoad_LoadRedeem").css('border-bottom', errorClassBorder);
            $("#txtRedeem_LoadRedeem").css('border-bottom', errorClassBorder);

        }
        else if (redeemPoint == "" || redeemPoint == "0") {
            $("#txtMemberID_LoadRedeem").css('border-bottom', errorClassBorder);
            $("#txtLoad_LoadRedeem").css('border-bottom', errorClassBorder);
            $("#txtRedeem_LoadRedeem").css('border-bottom', errorClassBorder);
        }
        $('#dvOuter').show();
        $('#dvOuterText').html("");
    }
}

function AddNewMemberID() {

    var $$ = Dom7;
    $("#txtPhone").css('border-bottom', bottomBorder);
    $("#txtPoints").css('border-bottom', bottomBorder);

    var email = $("#txtEmail_Reward").val().trim();

    var phone = $("input#txtPhone_Reward").val();

    var points = $("#txtPoints_Reward").val().trim();
    var name = $("#txtName_Reward").val().trim();
    var memberId = $("#txtMemberId_Reward").val().trim();

    var storeId = 0;
    storeId = SetStoreId();
    var valid = true;
    if (isEmail("#txtEmail_Reward") == true) {
        valid = true;
    }
    else {
        valid = false;
    }
    if (phone == "") {
        $("#txtPhone_Reward").css('border-bottom', errorClassBorder);

        valid = false;
    }
    else {
        $("#txtPhone_Reward").css('border-bottom', bottomBorder);

        valid = true;
    }

    if (points == "") {
        $("#txtPoints_Reward").css('border-bottom', errorClassBorder);

        valid = false;
    }
    else {
        $("#txtPoints_Reward").css('border-bottom', bottomBorder);

        valid = true;
    }
    if (valid == true) {

        $("#btnCreate").text("Adding...");
        if (memberId != "") {
            var url = global + "/CheckCustomerExists?storeid=" + storeId + "&email=" + encodeURIComponent(email) + "&phone=" + phone + "&memberId=" + memberId;
            $.getJSON(url, function (data) {
                console.log(data);

                var dd = JSON.parse(data);
                if (dd.Message != undefined && dd.Message != null && dd.Message.indexOf("Restaurant not found") > -1) {
                    callSweetAlertWarning("Restaurant not found. Please login again!");
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

                                $("#btnCreate").text("Add Member");
                            }
                            else {
                                var id = dd.ID;
                                url = global + "/GenerateNewMemberID?storeid=" + storeId + "&name=" + encodeURIComponent(name) + "&email=" + encodeURIComponent(email) + "&phone=" + phone + "&points=" + points + "&memberId=" + memberId + "&id=" + id;
                                $.getJSON(url, function (data1) {
                                    console.log(data1);
                                    var obj = JSON.parse(data1);
                                    $.each(JSON.parse(data1), function (index, value) {

                                        var popuphtml = "";
                                        if (value.REWARDMEMBERID != "")
                                            popuphtml = popuphtml + "<p><span style='color:#000;'>Member ID:  </span><span class=\"main-one\">" + value.REWARDMEMBERID + "</span></p>";
                                        if (value.POINTS != "")
                                            popuphtml = popuphtml + "<p><span style='color:#000;'>Points:  </span><span class=\"main-two\">" + value.POINTS + "</span></p>";
                                        if (value.FIRSTNAME != "" || value.LASTNAME != "") {
                                            if (value.FIRSTNAME != "")
                                                popuphtml = popuphtml + "<p>" + value.FIRSTNAME;
                                            if (value.LASTNAME != "")
                                                popuphtml = popuphtml + " " + value.LASTNAME;
                                            popuphtml = popuphtml + "</p>";
                                        }

                                        if (value.PHONE != "") {
                                            if (value.PHONE.length == 10)
                                                popuphtml = popuphtml + "<p>" + FormatPhoneNumber(value.PHONE) + "</p>";
                                            else
                                                popuphtml = popuphtml + "<p>" + value.PHONE + "</p>";

                                        }

                                        if (value.EMAIL != "")
                                            popuphtml = popuphtml + "<p>" + value.EMAIL + "</p>";


                                        if (value.ACTIONTYPE = "ADD") {
                                            (function () {

                                                swal({
                                                    title: "New Member created successfully!",
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
                        url = global + "/GenerateNewMemberID?storeid=" + storeId + "&name=" + encodeURIComponent(name) + "&email=" + encodeURIComponent(email) + "&phone=" + phone + "&points=" + points + "&memberId=" + memberId;
                        $.getJSON(url, function (data1) {
                            console.log(data1);
                            var obj = JSON.parse(data1);
                            $.each(JSON.parse(data1), function (index, value) {

                                var popuphtml = "";
                                if (value.REWARDMEMBERID != "")
                                    popuphtml = popuphtml + "<p><span style='color:#000;'>Member ID:  </span><span class=\"main-one\">" + value.REWARDMEMBERID + "</span></p>";
                                if (value.POINTS != "")
                                    popuphtml = popuphtml + "<p><span style='color:#000;'>Points:  </span><span class=\"main-two\">" + value.POINTS + "</span></p>";
                                if (value.FIRSTNAME != "" || value.LASTNAME != "") {
                                    if (value.FIRSTNAME != "")
                                        popuphtml = popuphtml + "<p>" + value.FIRSTNAME;
                                    if (value.LASTNAME != "")
                                        popuphtml = popuphtml + " " + value.LASTNAME;
                                    popuphtml = popuphtml + "</p>";
                                }

                                if (value.PHONE != "") {
                                    if (value.PHONE.length == 10)
                                        popuphtml = popuphtml + "<p>" + FormatPhoneNumber(value.PHONE) + "</p>";
                                    else
                                        popuphtml = popuphtml + "<p>" + value.PHONE + "</p>";

                                }

                                if (value.EMAIL != "")
                                    popuphtml = popuphtml + "<p>" + value.EMAIL + "</p>";


                                if (value.ACTIONTYPE = "ADD") {
                                    (function () {

                                        swal({
                                            title: "New Member created successfully!",
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


            });
        }
        else {
            url = global + "/GenerateNewMemberID?storeid=" + storeId + "&name=" + encodeURIComponent(name) + "&email=" + encodeURIComponent(email) + "&phone=" + phone + "&points=" + points + "&memberId=" + memberId;
            $.getJSON(url, function (data1) {
                console.log(data1);
                var obj = JSON.parse(data1);
                $.each(JSON.parse(data1), function (index, value) {

                    var popuphtml = "";
                    if (value.REWARDMEMBERID != "")
                        popuphtml = popuphtml + "<p><span style='color:#000;'>Member ID:  </span><span class=\"main-one\">" + value.REWARDMEMBERID + "</span></p>";
                    if (value.POINTS != "")
                        popuphtml = popuphtml + "<p><span style='color:#000;'>Points:  </span><span class=\"main-two\">" + value.POINTS + "</span></p>";
                    if (value.FIRSTNAME != "" || value.LASTNAME != "") {
                        if (value.FIRSTNAME != "")
                            popuphtml = popuphtml + "<p>" + value.FIRSTNAME;
                        if (value.LASTNAME != "")
                            popuphtml = popuphtml + " " + value.LASTNAME;
                        popuphtml = popuphtml + "</p>";
                    }

                    if (value.PHONE != "") {
                        if (value.PHONE.length == 10)
                            popuphtml = popuphtml + "<p>" + FormatPhoneNumber(value.PHONE) + "</p>";
                        else
                            popuphtml = popuphtml + "<p>" + value.PHONE + "</p>";

                    }

                    if (value.EMAIL != "")
                        popuphtml = popuphtml + "<p>" + value.EMAIL + "</p>";


                    if (value.ACTIONTYPE = "ADD") {
                        (function () {

                            swal({
                                title: "New Member created successfully!",
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

            });


            $$("#btnCreate").text("Add Member");
        }

    }
}
//Reward End
//check is email or not
function isEmail(el) {

    var email = $(el).val();
    console.log("email:" + email)

    if (email.trim() != "") {
        var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (!filter.test(email)) {
            console.log("Invalid Email Address");
            $("#txtEmail").css('border-color', '#ff4848');
            $("#txtEmail").css('border-width', '3px');
            return false;

        } else {

            console.log("Valid Email Address");
            $("#txtEmail").css('border-color', '#dedede');
            $("#txtEmail").css('border-width', '1px');
            return true;

        }
    }
    else {
        $("#txtEmail").css('border-color', '#dedede');
        $("#txtEmail").css('border-width', '1px');
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

function SetStoreId()
{
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

                //if (carryoutEnabled==true)
                $("#dvCarryoutStatus").html("CARRYOUT " + carryoutcurrentstatus);
                if (carryoutcurrentstatus.toLowerCase().trim() == "running") {
                    $("#dvCarryOutStatusChange").html("<a class=\"start-btn-one\" onclick=\"ChangeCarryoutStatus(" + storeId + ",'STOPPED')\"><img src=\"./img/Stop.png\" style=\"display:block;\"></a>");
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

/*04.04.2019*/


//Profile Section Start//
function GotoProfile() {
    self.app.router.navigate('/profile/', { reloadCurrent: true });
}

function LoadProfileDetails() {
    var storeId = 0;
    storeId = SetStoreId();

    if (Number(storeId) > 0) {

        var url = global + "/GetStoreByStoreId?storeid=" + storeId;

        try {
            $.getJSON(url, function (data) {
                console.log(data);
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;
                console.log("Length: " + length);

                if (JSON.parse(data).indexOf("No record(s) found") < 0) {
                    var count = 0;
                    $.each(JSON.parse(data), function (index, value) {
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

                        if (value.RestaurantDisplayName != "") {
                            name = value.RestaurantDisplayName;
                            $("#txtProfileName").val(name);
                        }
                        if (value.Description != "") {
                            description = value.Description;
                            $("#txtProfileDescription").val(description);
                        }
                        if (value.Address1 != "") {
                            address1 = value.Address1
                            $("#txtProfileAddress1").val(address1);
                        }
                        if (value.Address2 != "") {
                            address2 = value.Address2;
                            $("#txtProfileAddress2").val(address2);
                        }
                        if (value.City != "") {
                            city = value.City;
                            $("#txtProfileCity").val(city);
                        }
                        if (value.State != "") {
                            state = value.State;
                            if (state.length == 2) {
                                $("#ddlProfileState").val(state);
                            }
                            else {
                                $('#ddlProfileState option').map(function () {
                                    if ($(this).text() == state) return this;
                                }).attr('selected', 'selected');
                            }
                        }
                        if (value.Zip != "") {
                            zip = value.Zip;
                            $("#txtProfileZip").val(zip);
                        }
                        if (value.CompanyPhoneNumber != "") {
                            phone = value.CompanyPhoneNumber;
                            $("#txtProfilePhone").val(phone);
                        }
                        if (value.Fax != "") {
                            fax = value.Fax;
                            $("#txtProfileFax").val(fax);
                        }
                        if (value.SendFax == true) {
                            sendFax = true;
                            $("#checkSendFax").prop('checked', true)
                        }
                        else {
                            sendFax = false;
                            $("#checkSendFax").prop('checked', false)
                        }
                        if (value.RefundPolicy != "") {
                            refundPolicy = value.RefundPolicy;
                            $("#txtProfileRefundPolicy").val(refundPolicy);
                        }
                        if (value.Url != "") {
                            restaurantUrl = value.Url;
                            $("#txtProfileRestaurantURL").val(restaurantUrl);
                        }
                        if (value.FullAdminEmail != "") {
                            $("#hdnFullAdminEmail").val(value.FullAdminEmail);
                        }
                        if (value.AdminEmail != "") {
                            adminEmail = value.AdminEmail;
                            $("#txtProfileAdminEmail").val(adminEmail);
                        }
                        if (value.PickupLeadTimeInMinutes > 0) {
                            pickupLeadTime = value.PickupLeadTimeInMinutes;
                            if (pickupLeadTime > 0) {
                                $("#ddlProfilePickupLeadTime").val(pickupLeadTime);
                            }
                        }
                        if (value.CarryOutLeadTimeInMinutes > 0) {
                            carryoutLeadTime = value.CarryOutLeadTimeInMinutes;
                            if (carryoutLeadTime > 0) {
                                $("#ddlProfileCarryOutLeadTime").val(carryoutLeadTime);
                            }
                        }

                        console.log("Name: " + name + " Description: " + description + " Address1: " + address1 + " Address2: " + address2 + " City: " + city + " State: " + state + " Zip: " + zip + " Phone: " + phone + " Fax: " + fax +
                                " SendFax: " + sendFax + " Refund Policy: " + refundPolicy + " Restaurnat Url: " + restaurantUrl + " Admin Eamil: " + adminEmail + " P Lead Time: " + pickupLeadTime + " C Lead Time: " + carryoutLeadTime);

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


            try {
                $.post(global + "/SaveStoreInfo", model, function (data) {
                    console.log(data.indexOf("Successful"));
                    //LoadProfileDetails();
                    if (data.indexOf("Successful") > -1) {
                        swal({
                            title: "Store Info saved successfully!",
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
                console.log(data);
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;
                console.log("Length: " + length);

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
                        console.log("TimingId: " + timingId + " Day: " + day + " OpeningTime: " + openingTime + " ClosingTime: " + closingTime);
                        console.log("Opening: Hour: " + openingHour + " Minute: " + openingMinute + " Period: " + openingPeriod + " Closing: Hour: " + closingHour + " Minute: " + closingMinute + " Period: " + closingPeriod);
                        //dayName = GetDayNameByDayKey(day);

                        //Generate Edit Section Start//
                        var hdnCount = $('#hdnCount').val();

                        if (day == "Mo") {
                            $('#Businesday_0_IsCheck').prop('checked', true);
                            dayName = "Monday";
                            if (moCount > 1) {
                                AppendEditSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                moCount++;
                            }
                            else {
                                $("#Businesday_0_StoreTimingId").val(timingId)
                                $("#Businesday_0_OpeningHour").val(openingHour);
                                $("#Businesday_0_OpeningMinute").val(openingMinute);
                                $("#Businesday_0_OpeningPeriod").val(openingPeriod);

                                $("#Businesday_0_ClosingHour").val(closingHour);
                                $("#Businesday_0_ClosingMinute").val(closingMinute);
                                $("#Businesday_0_ClosingPeriod").val(closingPeriod);
                                moCount++;
                            }
                        }
                        else if (day == "Tu") {
                            $('#Businesday_1_IsCheck').prop('checked', true);
                            dayName = "Tuesday";
                            if (tuCount > 1) {
                                AppendEditSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                tuCount++;
                            }
                            else {
                                $("#Businesday_1_StoreTimingId").val(timingId)
                                $("#Businesday_1_OpeningHour").val(openingHour);
                                $("#Businesday_1_OpeningMinute").val(openingMinute);
                                $("#Businesday_1_OpeningPeriod").val(openingPeriod);

                                $("#Businesday_1_ClosingHour").val(closingHour);
                                $("#Businesday_1_ClosingMinute").val(closingMinute);
                                $("#Businesday_1_ClosingPeriod").val(closingPeriod);
                                tuCount++;
                            }
                        }
                        else if (day == "We") {
                            $('#Businesday_2_IsCheck').prop('checked', true);
                            dayName = "Wednesday";
                            if (weCount > 1) {
                                AppendEditSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                weCount++;
                            }
                            else {
                                $("#Businesday_2_StoreTimingId").val(timingId)
                                $("#Businesday_2_OpeningHour").val(openingHour);
                                $("#Businesday_2_OpeningMinute").val(openingMinute);
                                $("#Businesday_2_OpeningPeriod").val(openingPeriod);

                                $("#Businesday_2_ClosingHour").val(closingHour);
                                $("#Businesday_2_ClosingMinute").val(closingMinute);
                                $("#Businesday_2_ClosingPeriod").val(closingPeriod);
                                weCount++;
                            }
                        }
                        else if (day == "Th") {
                            $('#Businesday_3_IsCheck').prop('checked', true);
                            dayName = "Thursday";
                            if (thCount > 1) {
                                AppendEditSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                thCount++;
                            }
                            else {
                                $("#Businesday_3_StoreTimingId").val(timingId)
                                $("#Businesday_3_OpeningHour").val(openingHour);
                                $("#Businesday_3_OpeningMinute").val(openingMinute);
                                $("#Businesday_3_OpeningPeriod").val(openingPeriod);

                                $("#Businesday_3_ClosingHour").val(closingHour);
                                $("#Businesday_3_ClosingMinute").val(closingMinute);
                                $("#Businesday_3_ClosingPeriod").val(closingPeriod);
                                thCount++;
                            }
                        }
                        else if (day == "Fr") {
                            $('#Businesday_4_IsCheck').prop('checked', true);
                            dayName = "Friday";
                            if (frCount > 1) {
                                AppendEditSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                frCount++;
                            }
                            else {
                                $("#Businesday_4_StoreTimingId").val(timingId)
                                $("#Businesday_4_OpeningHour").val(openingHour);
                                $("#Businesday_4_OpeningMinute").val(openingMinute);
                                $("#Businesday_4_OpeningPeriod").val(openingPeriod);

                                $("#Businesday_4_ClosingHour").val(closingHour);
                                $("#Businesday_4_ClosingMinute").val(closingMinute);
                                $("#Businesday_4_ClosingPeriod").val(closingPeriod);
                                frCount++;
                            }
                        }
                        else if (day == "Sa") {
                            $('#Businesday_5_IsCheck').prop('checked', true);
                            dayName = "Saturday";
                            if (saCount > 1) {
                                AppendEditSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                saCount++;
                            }
                            else {
                                $("#Businesday_5_StoreTimingId").val(timingId)
                                $("#Businesday_5_OpeningHour").val(openingHour);
                                $("#Businesday_5_OpeningMinute").val(openingMinute);
                                $("#Businesday_5_OpeningPeriod").val(openingPeriod);

                                $("#Businesday_5_ClosingHour").val(closingHour);
                                $("#Businesday_5_ClosingMinute").val(closingMinute);
                                $("#Businesday_5_ClosingPeriod").val(closingPeriod);
                                saCount++;
                            }
                        }
                        else if (day == "Su") {
                            $('#Businesday_6_IsCheck').prop('checked', true);
                            dayName = "Sunday";
                            if (suCount > 1) {
                                AppendEditSection(timingId, dayName, day, openingHour, openingMinute, openingPeriod, closingHour, closingMinute, closingPeriod);
                                suCount++;
                            }
                            else {
                                $("#Businesday_6_StoreTimingId").val(timingId)
                                $("#Businesday_6_OpeningHour").val(openingHour);
                                $("#Businesday_6_OpeningMinute").val(openingMinute);
                                $("#Businesday_6_OpeningPeriod").val(openingPeriod);

                                $("#Businesday_6_ClosingHour").val(closingHour);
                                $("#Businesday_6_ClosingMinute").val(closingMinute);
                                $("#Businesday_6_ClosingPeriod").val(closingPeriod);
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

    console.log(businessDays);
    console.log(arrTimings);

    if (Number(storeId) > 0) {
        var model = new Object();
        model.CustomerId = customerId;
        model.StoreId = storeId;
        model.BusinessDays = businessDays;
        model.ListTiming = arrTimings;
        console.log(model);
        //var url = global + "/SaveStoreTiming";
        //alert(url);

        $.post(global + "/SaveStoreTiming", model, function (data) {
            console.log(data.indexOf("Successful"));
            if (data.indexOf("Successful") > -1) {
                ShowStoreTiming();
                swal({
                    title: "Profile Timing saved successfully!",
                    confirmButtonText: "OK",
                    type: "success",
                    confirmButtonClass: 'btn btn-success',
                    buttonsStyling: false,
                    customClass: 'swal-wide',
                });
            }
            else {
                callSweetAlertWarning("Unable to save profile!");
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
                        callSweetAlertWarning("Unable to delete timing!");
                    }
                }
            });
        }
        return false;
    }
}

//Profile Section End//

//Coupon Section Start//

function CouponList() {

    var storeId = 0;
    currentPage = 0;
    $("#CouponDiv").html("");
    storeId = SetStoreId();
    customerId = SetCustomerId();

    if (Number(storeId) > 0) {

        url = global + "/GetAllCoupons?storeid=" + storeId;

        try {
            $.getJSON(url, function (data) {
                var obj = JSON.parse(data);
                var length = Object.keys(obj).length;
                if (JSON.parse(data).indexOf("No Coupon(s) found.") < 0) {
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
                        html += "<div class=\"order-pickup panel-open\" style=\"text-align:left;font-size:20px;width:60%\" onclick=\"OpenCouponListDetails(" + value.Id + ")\">" + code + "</div>";

                        /*------------------Button-----------------------*/
                        html += "<div class=\"order-buttons\" style=\"width:28%\">";
                        if (value.IsActive == 1) {
                            html += "<a><img src=\"./img/icons/active.png\"></a>";
                        }
                        else {
                            html += "<a><img src=\"./img/icons/inactive.png\"></a>";
                        }
                        html += "<a onclick=\"GoToCouponEdit(" + value.Id + ");\"><img src=\"./img/icons/edit-icon.png\"></a>";
                        html += "</div>";

                        html += "</div>";
                        html += "<div class=\"order-row-container panel-open\" onclick=\"OpenCouponListDetails(" + value.Id + ")\">";
                        html += "<div class=\"order-date\" style=\"width:55%\">";
                        html += "<div class=\"customer-detail-container\">";

                        /*------------------Code-----------------------*/
                        html += "<div class=\"order-number\" style=\"font-size:16px;width:100%\">" + name + "</div>";

                        if (value.StartDateUtc != "" && value.EndDateUtc != "") {
                            /*------------------Start Date Ende Date-----------------------*/
                            html += "<div class=\"customer-name\">Start Date: <span class=\"cc-number\">" + StartDate + "</span></div>";
                            html += "<div class=\"customer-name\">End Date: <span class=\"cc-number\">" + EndDate + "</span></div>";
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
            //console.log(data)
            if (data.replace(/"/g, "").indexOf("No record(s) found.") > -1) {

            }
            else {
                $.each(JSON.parse(data), function (index, value) {
                    if (value.Type == "DiscountTiming") {

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

        $("#dvCouponDetails").html($("#dvCouponDetailInner").html());

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
                                $("#txtCouponMinAmount").val(value.MinimumOrderAmount);
                                console.log(value.MinimumOrderAmount);
                            }
                            else {
                                $("#txtCouponMinAmount").val(0.00);
                            }
                            if (value.DiscountAmount > 0) {
                                $("#txtCouponDiscAmount").val(value.DiscountAmount);
                                console.log(value.DiscountAmount);
                            }
                            else {
                                $("#txtCouponDiscAmount").val(0.00);
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
                            console.log("TimingId: " + timingId + " Day: " + day + " OpeningTime: " + openingTime + " ClosingTime: " + closingTime);
                            console.log("Opening: Hour: " + openingHour + " Minute: " + openingMinute + " Period: " + openingPeriod + " Closing: Hour: " + closingHour + " Minute: " + closingMinute + " Period: " + closingPeriod);
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
                                    $("#BOfferday_2_StartHour").val(openingHour);
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

    console.log(offerDays);
    console.log(arrTimings);

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
                console.log(data.indexOf("Successful"));
                if (data.indexOf("Successful") > -1 || data == "") {
                    LoadCouponEdit();
                    swal({
                        title: "Coupon saved successfully!",
                        confirmButtonText: "OK",
                        type: "success",
                        confirmButtonClass: 'btn btn-success',
                        buttonsStyling: false,
                        customClass: 'swal-wide',
                    });
                }
                else {
                    callSweetAlertWarning("Unable to save coupon!");
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
                        callSweetAlertWarning("Unable to delete timing!");
                    }
                }
            });
        }
        return false;
    }
}

//Coupon Section End