"use strict";
// Dom7
var $$ = Dom7;
var mediaURL = "http://appnotification.bistroux.com/Media/";
var src = mediaURL + "notification.mp3";
var myMedia = null;
var acceptOrderPopup;
// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
    console.log("Device is ready!");
});
// Init App
var app = new Framework7({

    root: '#app',
    theme: 'md',
    routes: routes,
    view : {
      pushState: false
    }
    //pushState: true,
});

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
//self.app.router.navigate('/carryout/', { reloadCurrent: true });
// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    $$('.back-new').click(function () {
        Back();
    });
    //console.log(e.detail.app.form.convertToData('#login'));
    var pageURL = e.detail.route.url;
    var page = e.detail.page;
    //console.log('pageURL: ' + pageURL)
    if (pageURL == "/") {
        setTimeout(function () { self.app.router.navigate('/login_new/', { reloadCurrent: false }); }, 1000);
    }
    else if (pageURL.indexOf('login_new') > -1)//Login
    {
        InitLogin();
        CheckLoggedIn();
        //console.log('login_new')
        $$('#loginnew #btnLogin').click(function () {
            Login();
        });

    }
    else if (pageURL.indexOf('carryout') > -1)//Carry Out
    {
        console.log('carryout')
       // SetMenuNavigation();
        //app.Tab.show('#2');
        //$("#carryOutProcessing").trigger("click");
        //$("#carryOutProcessing").addClass("tab-active").trigger("tab:show");
        CheckGiftCardPermission();
        //app.popup('<div class="popup">Hello, <a href="#" class="close-popup">close me</a></div>', true);
        $$("#hdnCurrentState").val('New');

        var pageSize = 10;
        var currentPage = 0;
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            var src = mediaURL + "notification.mp3";
            myMedia = new Media(src, onSuccess, onError, onStatus);
        }


        localStorage.setItem("CurrentPage", currentPage);
        var loadProcessing = localStorage.getItem("loadcarryoutprocessing");
        //console.log("loadProcessing: " + loadProcessing)
        if (loadProcessing != null && loadProcessing.toString().trim() == "true") {
            //console.log("loadProcessing 1: ")
            app.tab.show('#2');
            BindcarryoutTab('Processing');
            localStorage.setItem("loadcarryoutprocessing", null);

        }

        CarryoutOrdersList('New', 10, 0, 'dvNewList');
        var timeout = null;
        var src = mediaURL + "notification.mp3";
        var myMedia = null;
        var apprefreshinterval = localStorage.getItem("AppRefreshTimeInterval");
        if (apprefreshinterval === null || apprefreshinterval === "" || apprefreshinterval === "0") {
            apprefreshinterval = 120;
            localStorage.setItem("AppRefreshTimeInterval", apprefreshinterval);

        }

        CheckStoreTimings();

        var intervalName = setInterval(CheckStoreTimings, Number(apprefreshinterval) * 1000);
        $$('.page-content').scroll(function () {
            var OrderAvailable = localStorage.getItem("OrderAvailable");
            if (OrderAvailable == "1") {
                currentPage = localStorage.getItem("CurrentPage");
                currentPage = Number(currentPage) + 1;
                // console.log("currentPage: " + currentPage);
                CarryoutOrdersListPagination('New', pageSize, currentPage, 'dvAllList');
                localStorage.setItem("CurrentPage", currentPage);
            }
            else {
                // $('#loader_msg').html("");
            }

        });
     
    }
    else if (pageURL.indexOf('giftcard') > -1)//Gift Card
    {
       
      var  screen_width = document.documentElement.clientWidth;
      var screen_heght = document.documentElement.clientHeight;
      //console.log('screen_width: ' + screen_width)
     // console.log('screen_heght: ' + screen_heght)
        //Check GiftCard and GiftCard Program Enable
        CheckGiftCardPermission();
        var giftCardsEnabled = localStorage.getItem("GiftCardsEnabled").trim();
        var giftCardProgramEnabled = localStorage.getItem("GiftCardProgramEnabled").trim();
        if (giftCardsEnabled != "" && giftCardsEnabled == "True") {

            if (giftCardProgramEnabled == "" || giftCardProgramEnabled != "True") {
                $('#linkGiftCardNew').addClass('disabled');
                $('#linkGiftCardRedeem').addClass('disabled');
                $('.tabs').css({ "transform": "translate3d(-200%, 0px, 0px)" });
                $('#linkGiftCardOrder').addClass('tab-link-active');
                $('#linkGiftCardNew').removeClass('tab-link-active');
                $('#tab-giftcard-order').addClass('tab-active');
                $('#tab-giftcard-new').removeClass('tab-active');

            }
            else if (giftCardProgramEnabled == "True") {
                //$('#txtCardCode').focus();
                $('#linkGiftCardNew').removeClass('disabled');
                $('#linkGiftCardRedeem').removeClass('disabled');
                $('.tabs').css({ "transform": "translate3d(0%, 0px, 0px)" });
            }
        }
        else {
            $('#linkMenuGiftCard').addClass('disabled');
        }

        $('#linkGiftcardMenuReward').addClass('disabled');
       // SetMenuNavigation();
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            $$('#scan').on('click', function () {
                cordova.plugins.barcodeScanner.scan(
          function (result) {
              $("#txtCardCode").val(result.text);
              console.log("We got a barcode\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" +
                    "Cancelled: " + result.cancelled);
          },
          function (error) {
              console.log("Scanning failed: " + error);
          },
          {
              preferFrontCamera: true, // iOS and Android
              showFlipCameraButton: true, // iOS and Android
              showTorchButton: false, // iOS and Android
              torchOn: false, // Android, launch with the torch switched on (if available)
              saveHistory: true, // Android, save scan history (default false)
              prompt: "Place a barcode inside the scan area", // Android
              resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
              //formats: "QR_CODE,PDF_417,CODABAR,CODE_128,CODE_93,CODE_39", // default: all but PDF_417 and RSS_EXPANDED
              orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
              disableAnimations: true, // iOS
              disableSuccessBeep: false // iOS and Android
          }
       );
            });
            $$('#loadredeemscan').on('click', function () {
                cordova.plugins.barcodeScanner.scan(
          function (result) {
              $("#txtCardCodeSearch").val(result.text);
              console.log("We got a barcode\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" +
                    "Cancelled: " + result.cancelled);
          },
          function (error) {
              console.log("Scanning failed: " + error);
          },
          {
              preferFrontCamera: true, // iOS and Android
              showFlipCameraButton: true, // iOS and Android
              showTorchButton: false, // iOS and Android
              torchOn: false, // Android, launch with the torch switched on (if available)
              saveHistory: true, // Android, save scan history (default false)
              prompt: "Place a barcode inside the scan area", // Android
              resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
              //formats: "QR_CODE,PDF_417,CODABAR,CODE_128,CODE_93,CODE_39", // default: all but PDF_417 and RSS_EXPANDED
              orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
              disableAnimations: true, // iOS
              disableSuccessBeep: false // iOS and Android
          }
       );
            });
        }
        
        //Check GiftCard and GiftCard Program Enable

        var pageSize = 10;
        var currentPage = 0;
        //CheckGiftCardPermission();
        var loadgiftcardorders = localStorage.getItem("loadgiftcardorders");
        var loadgiftcardredeem = localStorage.getItem("loadgiftcardredeem");
        if (loadgiftcardorders != null && loadgiftcardorders.toString().trim() == "true") {
            app.tab.show('#3');
            localStorage.setItem("loadgiftcardorders", null);

        }
        else if (loadgiftcardredeem != null && loadgiftcardredeem.toString().trim() == "true") {
            app.tab.show('#2');
            localStorage.setItem("loadgiftcardredeem", null);
        }
        GiftCardOrdersList(pageSize, currentPage);
        //$$('.page-content').css('overflow', 'hidden');
        //GiftCard Load New - Start
        $$('#txtCardCode').on('blur', function () {
            ClearSpecialCharacter('txtCardCode');
        });
        $$('#txtCardCode').on('change', function () {
            if ($('#txtCardCode').val() != "") {
                $('#txtCardCode').css('border-bottom', bottomBorder);
            }
        });
        $$('#txtAmount').on('change', function () {
            if ($('#txtAmount').val() != "") {
                $('#txtAmount').css('border-bottom', bottomBorder);
            }
        });
        $$('#btnAddCard').click(function () {
            LoadNewGiftCard();
        });
        //GiftCard Load New - End

        //GiftCard Load/Redeem - Start
        $$('#txtCardCodeSearch').on('blur', function () {
            ClearSpecialCharacter('txtCardCodeSearch');
        });
        $$('#txtLoad').on('blur', function () {
            ClearSpecialCharacter('txtLoad');
        });
        $$('#txtRedeem').on('blur', function () {
            ClearSpecialCharacter('txtLoad');
        });
        $$('#btnGiftCardSearch').click(function () {
            SearchGiftCard();
        });
        $$('#btnLoadGiftCard').click(function () {
            LoadGiftCard();
        });
        $$('#btnRedeemGiftCard').click(function () {
            RedeemGiftCard();
        });
        //GiftCard Load/Redeem - End

        //GiftCard Orders - Start

        $$('#txtGiftCardCode').on('blur', function () {
            ClearSpecialCharacter('txtCardCodeSearch');
        });
        $$('#btnShowGiftCardSearch').click(function () {
            $('#divGifrCardOrderSerarch').show();
            $('#btnShowGiftCardSearch').hide();
        });
        $$('#btnCloseGifrCardSearchArea').click(function () {
            $('#divGifrCardOrderSerarch').hide();
            $('#btnShowGiftCardSearch').show();
        });


        $$('#btnGiftCardOrderSearch').click(function () {
            LoadGiftCards();
        });

        function LoadGiftCards() {
            GiftCardOrdersList(pageSize, currentPage);
        }

        $$('.page-content').scroll(function () {
            var OrderAvailable = localStorage.getItem("GiftCardAvailable");
            if (OrderAvailable == "1") {
                currentPage = localStorage.getItem("GiftCardCurrentPage");
                currentPage = Number(currentPage) + 1;
                //console.log("currentPage: " + currentPage);
                GiftCardOrdersListPagination(pageSize, currentPage);
                localStorage.setItem("GiftCardCurrentPage", currentPage);
            }
            else {

            }

        });

        //GiftCard Orders - End

        //Sudip - End
    }

    else if (pageURL.indexOf('manageservice') > -1) {
        SetManageService();
        //SetMenuNavigation();
    }

    else if (pageURL.indexOf('new_rewards') > -1)// Add Rewards
    {
        CheckGiftCardPermission();
        //SetMenuNavigation();
        $$('#btnCreate').click(function () {
            AddNewMemberID();
        });

        $$('#btnSearch').click(function () {
            SearchReward();
        });

        $$('#btnLoadReward').click(function () {
            LoadReward();
        });

        $$('#btnRedeemReward').click(function () {
            RedeemReward();
        });
        $$('#txtLoad').on('blur', function () {
            ClearSpecialCharacter('txtLoad');
        });
        $$('#txtRedeem').on('blur', function () {
            ClearSpecialCharacter('txtRedeem');
        });

        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            $$('#scan').on('click', function () {
                cordova.plugins.barcodeScanner.scan(
          function (result) {
              $("#txtMemberId_Reward").val(result.text);
              console.log("We got a barcode\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" +
                    "Cancelled: " + result.cancelled);
          },
          function (error) {
              console.log("Scanning failed: " + error);
          },
          {
              preferFrontCamera: true, // iOS and Android
              showFlipCameraButton: true, // iOS and Android
              showTorchButton: false, // iOS and Android
              torchOn: false, // Android, launch with the torch switched on (if available)
              saveHistory: true, // Android, save scan history (default false)
              prompt: "Place a barcode inside the scan area", // Android
              resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
              //formats: "QR_CODE,PDF_417,CODABAR,CODE_128,CODE_93,CODE_39", // default: all but PDF_417 and RSS_EXPANDED
              orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
              disableAnimations: true, // iOS
              disableSuccessBeep: false // iOS and Android
          }
       );
            });
            $$('#loadredeemscan').on('click', function () {
                cordova.plugins.barcodeScanner.scan(
          function (result) {
              $("#txtMemberID_LoadRedeem").val(result.text);
              console.log("We got a barcode\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" +
                    "Cancelled: " + result.cancelled);
          },
          function (error) {
              console.log("Scanning failed: " + error);
          },
          {
              preferFrontCamera: true, // iOS and Android
              showFlipCameraButton: true, // iOS and Android
              showTorchButton: false, // iOS and Android
              torchOn: false, // Android, launch with the torch switched on (if available)
              saveHistory: true, // Android, save scan history (default false)
              prompt: "Place a barcode inside the scan area", // Android
              resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
              //formats: "QR_CODE,PDF_417,CODABAR,CODE_128,CODE_93,CODE_39", // default: all but PDF_417 and RSS_EXPANDED
              orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
              disableAnimations: true, // iOS
              disableSuccessBeep: false // iOS and Android
          }
       );
            });
        }
    }
});


//Check whether logged in or not
function CheckLoggedIn() {
  
    $('#lblErr').html("");
    var storeId = 0;
    var appRefreshInterval = 120;
    if (localStorage.getItem("StoreId") != null)
        storeId = localStorage.getItem("StoreId").trim();
    console.log("CheckLoggedIn StoreId: " + storeId);
    if (storeId === null || storeId === "" || storeId === "0") {
        //console.log("StoreId: 111")
        return true;

    }
    else {
        // console.log("StoreId: 222")
        if (localStorage.getItem("AppRefreshTimeInterval") != null) {
            appRefreshInterval = localStorage.getItem("AppRefreshTimeInterval").trim();
        }
        if (appRefreshInterval === null || appRefreshInterval === "" || appRefreshInterval === "0") {
        }
        else {
            localStorage.setItem("AppRefreshTimeInterval", appRefreshInterval);
        }
        //console.log("StoreId: 333")
        if (Number(storeId) > 0) {
            //console.log("StoreId: 444");
            //window.location.href = "carryout.html?StoreId=" + storeId;
            self.app.router.navigate('/carryout/', { reloadCurrent: false });
        }





    }
}
function CheckStoreTimings() {

    var isAvailable = false;
    if (localStorage.getItem("storetimings") != null) {

        var storetimings = JSON.parse(localStorage.getItem("storetimings"));
        var dayOfWeek = getCurrentdayOfWeek();
        //WriteLog("dayOfWeek: " + dayOfWeek)
        var filtered_json = filterJSON(JSON.parse(storetimings.toString()), dayOfWeek);

        $.each(JSON.parse(JSON.stringify(filtered_json)), function (key, value) {
            var day = value.DAY;
            //var openingdate = value.OPENINGTIME.split('~')[0];
            var openingdate = GetCurrentDateOnly();
            var openingtime = value.OPENINGTIME.split('~')[1];

            //var closingdate = value.CLOSINGTIME.split('~')[0];
            var closingdate = GetCurrentDateOnly();
            var closingtime = value.CLOSINGTIME.split('~')[1];

            var startTime = Date.parse(openingdate + " " + openingtime);
            var endTime = Date.parse(closingdate + " " + closingtime);
            var currentTime = Date.now();

            if (currentTime >= startTime && currentTime <= endTime) {
                isAvailable = true;
                return false;
            }
            else {
                isAvailable = false;
            }

        });
        if (isAvailable === true) {
            CheckNewOrder();

        }
        else {

            console.log(GetCurrentDateTime() + " - " + "Store is Closed")
        }
    }
    else {
        //alert("2:")
        CheckNewOrder();
        setInterval(CheckNewOrder, Number(apprefreshinterval) * 1000);
    }

    console.log(GetCurrentDateTime() + " - " + "CheckStoreTimings END")
}
function CheckNewOrder() {
    console.log(GetCurrentDateTime() + " - " + "CheckNewOrder START", browser);
    var params = getParams();
    var storeId = 0;
    storeId = SetStoreId();
    if (Number(storeId) > 0) {
        url = global + "/GetLatestCarryOutOrderPopupNew?storeid=" + storeId;
        try {
            console.log(GetCurrentDateTime() + " - " + "Searching for new orders", browser);
            $.getJSON(url, function (data) {
                var obj = JSON.parse(data).Rows;
                if (data.indexOf("No order(s) found.") > -1) {
                    console.log(GetCurrentDateTime() + " - " + " No new order(s) found", browser);
                }
                else {

                    var pickuptime = JSON.parse(data).PickUpTime;
                    pickuptime.sort((a, b) => dateFromStr(a) - dateFromStr(b));

                    if (obj != "") {
                        var html = "";
                        var orderIds = "";
                        $.each(obj, function (index, value) {
                            if (orderIds != "")
                                orderIds = orderIds + "," + value.ID;
                            else
                                orderIds = value.ID;

                            if (pickuptime.length > 0) {
                                var pickupcount = false;
                                var count = 0;

                                var pickuphtml = "<select class=\"pickup\" id=\"pickuplist_" + value.ID + "\">";
                                //var pickuphtml = "<div class=\"selectdiv\"><label><select class=\"pickup\" id=\"pickuplist_" + value.ID + "\">";
                                $.each(pickuptime, function (key, value1) {
                                    var now = new Date();
                                    var pickupdatetime = new Date(GetCurrentDateOnly() + " " + value.PICKUPTIME);
                                    var dropdownValueDateTime = new Date(GetCurrentDateOnly() + " " + value1);
                                    var minsDiff = Math.floor((dropdownValueDateTime.getTime() - now.getTime()) / 1000 / 60);
                                    var minsDiffFromPickUpTime = Math.floor((dropdownValueDateTime.getTime() - pickupdatetime.getTime()) / 1000 / 60);
                                    if ($.inArray(value.PICKUPTIME.trim(), pickuptime) > -1) {

                                        if (value1.trim() === value.PICKUPTIME.trim()) {
                                            pickuphtml += "<option value='" + value1 + "' selected>" + value1 + "</option>";
                                            pickupcount = true;

                                        }
                                        else {
                                            if (pickupcount === true) {

                                                if (minsDiffFromPickUpTime <= 120) {
                                                    if (minsDiff > 0) {
                                                        pickuphtml += "<option value='" + value1 + "'>" + value1 + "</option>";
                                                    }
                                                    else {
                                                        pickuphtml += "<option disabled value='" + value1 + "'>" + value1 + "</option>";
                                                    }

                                                }

                                            }

                                        }
                                    }
                                    else {
                                        if (minsDiffFromPickUpTime <= 120) {
                                            if (minsDiff > 0) {
                                                pickuphtml += "<option value='" + value1 + "'>" + value1 + "</option>";
                                            }
                                            else {
                                                pickuphtml += "<option disabled value='" + value1 + "'>" + value1 + "</option>";
                                            }

                                        }

                                    }

                                });
                                //pickuphtml += "</select></label></div>";
                                pickuphtml += "</select>";
                            }

                            html += "<div id=\"divAcknowledgement\">";
                            html += "<div class=\"popup-row\">";
                            html += "<div  class=\"popup-column-three\"><div class=\"pop-up-display-label\">Order #: <span class=\"pop-up-value-label\">" + value.ID + "</span></div></div>";
                            if (value.PICKUPTIME != "") {
                                html += "<div class=\"popup-column-three\"><div id=\"pickuptime_" + value.ID + "\" style=\"font-size:28px;color:#08b3c7;padding-bottom:10px; float: left;\">" + value.PICKUPTIME + "</div>" + pickuphtml + "</div>";
                            }
                            else {
                                html += "<div class=\"popup-column-three\"><input type=\"hidden\" name=\"giftcardorder\" id=\"" + value.ID + "\"/><div style=\"font-size:28px;color:#08b3c7; float: left;\">&nbsp;</div></div>";
                            }
                            html += "<div class=\"popup-column-three\" style=\"text-align:right;\"><span style=\"font-size:28px;color:#799427;\" id=\"price\">" + FormatDecimal(value.ORDERTOTAL) + "</span></div></div>";
                            html += "<div class=\"popup-row\"> <div class=\"popup-column-one pop-up-display-label \">Name: <span class=\"pop-up-value-label\">" + value.BILLINGFIRSTNAME + " " + value.BILLINGLASTNAME + "</span></div></div>";;
                            if (value.BILLINGPHONE.length == 10)
                                html += "<div class=\"popup-row\">  <div class=\"popup-column-one pop-up-display-label\" >Phone: <span class=\"pop-up-value-label\" id=\"phone_" + value.ID + "\">" + FormatPhoneNumber(value.BILLINGPHONE) + "</span></div></div>";
                            else
                                html += "<div class=\"popup-row\">  <div class=\"popup-column-one pop-up-display-label\">Phone: <span  class=\"pop-up-value-label\" id=\"phone_" + value.ID + "\">" + value.BILLINGPHONE + "</span></div></div>";
                            html += "<div class=\"popup-row\"><div class=\"popup-column-one\" style=\"margin:10px 0 0 0;\">";

                            html += "<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" id=\"popUpItems\"> <tbody>";
                            html += "<tr><td align=\"left\" style=\"font-size:17px;font-weight:bold;border-bottom:1px solid #000;\" width=\"60%\">Items</td><td style=\"font-size:17px;font-weight:bold;border-bottom:1px solid #000;\" align=\"center\" width=\"20%\">Quantity</td> <td style=\"font-size:17px;font-weight:bold;border-bottom:1px solid #000;\" align=\"right\" width=\"20%\">Price</td></tr>";
                            if (value.OrderItems.indexOf("#") > -1) {
                                var arrItemRows = value.OrderItems.split('#');
                                var i;
                                for (i = 0; i < arrItemRows.length - 1; i++) {
                                    html += "<tr>";
                                    var columns = arrItemRows[i].trim();
                                    if (columns.indexOf('~') > -1) {
                                        var arrColumn = columns.split('~');
                                        var j;
                                        //console.log("arrColumn.length: " + arrColumn.length)
                                        var name = arrColumn[0];
                                        var qty = arrColumn[1];
                                        var price = arrColumn[2];
                                        var notes = unescape(arrColumn[3]);
                                        if (notes != "") {
                                            html += "<td align=\"left\" style=\"font-size:17px;\">" + name + "(" + decode_str(notes) + ")</td>";
                                        }
                                        else {
                                            html += "<td align=\"left\" style=\"font-size:17px;\">" + name + "</td>";
                                        }

                                        html += "<td align=\"center\" style=\"font-size:17px;\">" + qty + "</td>";
                                        html += "<td align=\"right\" style=\"font-size:17px;\">" + FormatDecimal(price) + "</td>";

                                    }
                                    html += "</tr>";
                                }

                            }

                            html += "</tbody></table>";


                            html += "</div></div></div>";


                        });
                        //console.log("html: " + html)
                        //$("#dvPopOrders").html(html);
                        $("#hdnOrderIds").val(orderIds);
                        console.log(GetCurrentDateTime() + " - " + " Found new orders(" + orderIds + ")", browser);

                        if (html != "") {
                            acceptOrderPopup = app.popup.create({
                                content: '<div class="popup">' +
                                            '<div class="block">' +
                                             //<button type="button" id="btnAcknowledgement" name="btnAcknowledgement" onclick="AcceptOrders();" class="modal-accept-button">ACCEPT</button>
                                             '<a href="#" class="link popup-close modal-accept-button"  id="btnAcknowledgement" onclick="AcceptOrders();">ACCEPT</a>' +
                                             '<div class="overlay-button-area" id="dvPopOrders">' +
                                              html +
                                               '</div>' +
                                              //'</div><p><a href="#" class="link popup-close">Close me</a></p>' +
                                            '</div>' +
                                          '</div>',
                                on: {
                                    open: function (popup) {
                                        // console.log('Popup open');
                                    },
                                    opened: function (popup) {
                                        //console.log('Popup opened');
                                    },
                                }
                            });
                            // Events also can be assigned on instance later
                            acceptOrderPopup.on('close', function (popup) {
                                console.log('Popup close');
                            });
                            acceptOrderPopup.open();
                        }

                        if (isDevice()) {
                            // console.log('isDevice 1: ')
                            playAudio();
                        }
                    }
                    else {
                        //console.log("2");
                        console.log(GetCurrentDateTime() + " - " + " No new order(s) found(2)", browser);
                    }

                }

            });
        }
        catch (e) {
            console.log(GetCurrentDateTime() + " - " + " Error CheckNewOrder", browser);
        }
    }

    console.log(GetCurrentDateTime() + " - " + "CheckNewOrder END", browser);
}

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
function AcceptOrders() {
    var orderIds = $("#hdnOrderIds").val().trim();
    var orders = [];
    var customerphone = [];
    var carryoutchanged = 0;
    var giftcardchanged = 0;
    var restaurantDisplayName = "";
    if (localStorage.getItem("RestaurantName") != null)
        restaurantDisplayName = localStorage.getItem("RestaurantName").trim();
    $(".pickup").each(function (index, element) {
        // element == this
        var elemId = $(this).attr("id");
        var orderId = $(this).attr("id").split('_')[1];

        var pickup = $(this).val().trim();
        var oldPickUp = $("#pickuptime_" + orderId).html().trim();
        var phone = $("#phone_" + orderId).html().trim().replace("(", "").replace(")", "").replace("-", "");
        //console.log("id: " + $(this).attr("id"));
        //console.log("oid:" + $(this).attr("id").split('_')[1]);
        //console.log("pickup: " + $(this).val());
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
            giftcardchanged++;
        });
    }
    //console.log(orders)
    var currentPage = 0;
    var pageSize = 10;
    $.ajax({
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
            acceptOrderPopup.destroy();
            //console.log("ChangeBulkOrderStatus: " + response)
            if (isDevice()) {
                stopAudio();
            }

            //CarryoutOrdersList("Processing", pageSize, currentPage);
            $("#hdnOrderIds").val("");
            // acceptOrderPopup.close();
            var storeId = 0;
            storeId = SetStoreId();
            if (giftcardchanged > 0 && carryoutchanged > 0) {
                if (giftcardchanged > carryoutchanged) {
                    localStorage.setItem("loadgiftcardorders", "true");
                    //window.location.href = "giftcardsorders.html?StoreId=" + storeId;
                    self.app.router.navigate('/giftcard/', { reloadCurrent: true });

                }
                else {
                    localStorage.setItem("loadcarryoutprocessing", "true");
                    //window.location.href = "carryout.html?StoreId=" + storeId + "&status=Processing";
                    self.app.router.navigate('/carryout/', { reloadCurrent: true });


                }
            }
            else if (giftcardchanged > 0 && carryoutchanged == 0) {
                localStorage.setItem("loadgiftcardorders", "true");
                //window.location.href = "giftcardsorders.html?StoreId=" + storeId;
                self.app.router.navigate('/giftcard/', { reloadCurrent: true });

            }
            else if (carryoutchanged > 0 && giftcardchanged == 0) {
                localStorage.setItem("loadcarryoutprocessing", "true");
                // window.location.href = "carryout.html?StoreId=" + storeId + "&status=Processing";
                self.app.router.navigate('/carryout/', { reloadCurrent: true });

            }
        },
        error: function (xhr, textStatus, errorThrown) {
            //alert(xhr.responseText);
            //alert(textStatus);
            //alert(errorThrown);
        }
    });
}
function Back() {
    console.log('Back')
    //console.log(app.views.main.router);
    console.log(app.views.main.router.url);
    console.log(app.views.main.router.history);
    if (app.views.main.router.history.length > 0)
    {
        var secondLastPage = "";
        var thirdLastPage = "";
        var length = app.views.main.router.history.length;
        if(length>2)
        {
            secondLastPage = app.views.main.router.history[length-2];
            thirdLastPage= app.views.main.router.history[length-3];
        }
        console.log('secondLastPage: ' + secondLastPage);
        console.log('thirdLastPage: ' + thirdLastPage);
        if (secondLastPage!= "/login_new/" && secondLastPage != "/") {
            console.log(1);
            app.views.main.router.back();
        }
        else {

            console.log(2);
            //CheckLoggedIn();
        }
    }
  
    //history.go(-1);
    //navigator.app.backHistory();
}










