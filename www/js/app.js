"use strict";
// Dom7
var $$ = Dom7;
var mediaURL = "http://appnotification.bistroux.com/Media/";
var src = mediaURL + "notification.mp3";
var myMedia = null;
//myMedia = new Media(src, onSuccess, onError, onStatus);
var acceptOrderPopup;
var calendarModalOrderStart;
var calendarModalOrderEnd;
var calendarModalCouponStart;
var calendarModalCouponEnd;
var isShift = false;
var seperator = "/";
var deviceUUID = "";
// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
    console.log("Device is ready!");
   
  
    var storeId = 0;
    //To check this first check in config.xml whether  cordova.plugins.backgroundMode has installed or not
  // document.addEventListener("pause", onPause, false);
    //setTimeout(function () {
    //    cordova.plugins.backgroundMode.enableWakeUp();
    //    //...
    //    cordova.plugins.backgroundMode.wakeUp();
    //        // Modify the currently displayed notification
    //        //cordova.plugins.backgroundMode.configure({
    //        //    text: 'Running in background for more than 5s now.'
    //        //});
    //    }, 5000);
    // Android customization
    //cordova.plugins.backgroundMode.setDefaults({ text: 'Doing heavy tasks.' });
    // Enable background mode
    //cordova.plugins.backgroundMode.enable();

    // Called when background mode has been activated
    //cordova.plugins.backgroundMode.onactivate = function () {
    //    setTimeout(function () {
    //        // Modify the currently displayed notification
    //        cordova.plugins.backgroundMode.configure({
    //            text: 'Running in background for more than 5s now.'
    //        });
    //    }, 5000);
    //}
    //InitPushNotification();
    if (device.platform != "browser") {
        deviceUUID = device.uuid;
        if (localStorage.getItem("StoreId") != null)
            storeId = Number(localStorage.getItem("StoreId"));
        if (storeId > 0) {

            InitPushNotification(storeId, device.manufacturer.toUpperCase(), device.uuid, device.version);
        }
        // start an interval timer
        //To check this first check in config.xml whether  cordova-plugin-insomnia has installed or not
       // var mainloopid = setInterval(mainloop, 10000);   // call the plugin every (say) 10 seconds to keep your app awake
    }

   /// cordova.plugins.backgroundMode.enable();

    //cordova.plugins.backgroundMode.setEnabled(true);
    //setTimeout(function () { // Turn screen on
    //    cordova.plugins.backgroundMode.wakeUp();
    //    // Turn screen on and show app even locked
    //    cordova.plugins.backgroundMode.unlock();
    //}, 3000);//3 seconds
    //document.addEventListener("resume", onResume, false);
});
function mainloop()
{
      // call the plugin every (say) one second to keep your app awake
      window.plugins.insomnia.keepAwake();
}
function onPause() {
    $timeout(function () {
        console.log("Running in background for more than 5s now ...");
    }, 5000);
}
// Handle the resume event
//
function onResume() {
    console.log("Resume")
}
// Init App
var app = new Framework7({

    root: '#app',
    theme: 'md',
    routes: routes,
    view: {
        pushState: false
    },
    statusbar: {
        androidOverlaysWebView: true,
        overlay: false
    },
    //pushState: true,
});


// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
//self.app.router.navigate('/carryout/', { reloadCurrent: true });
// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    $$('.back-new').click(function () {
        Back();
    });

    $$('.toolbar-inner a').click(function () {
        if ($$('html').hasClass('with-panel-right-cover')) {
            $$('.panel-close').click();
        }
    });

    $$('input').keypress(function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if ((code == 13) || (code == 10)) {
            $$(this).blur();
            return false;
        }
    });

    //console.log(e.detail.app.form.convertToData('#login'));
    var pageURL = e.detail.route.url;
    var page = e.detail.page;
    // console.log('pageURL: ' + pageURL)
    if (pageURL == "/") {

        var appRefreshInterval = 120;
        var storeId = 0;
        if (localStorage.getItem("StoreId") != null)
            storeId = localStorage.getItem("StoreId").trim();
        //if (localStorage.getItem("AppRefreshTimeInterval") != null) {
        //    appRefreshInterval = localStorage.getItem("AppRefreshTimeInterval").trim();
        //}
        //if (appRefreshInterval === null || appRefreshInterval === "" || appRefreshInterval === "0") {
        //}
        //else {
        //    localStorage.setItem("AppRefreshTimeInterval", appRefreshInterval);
        //}
        if (storeId > 0) {
            var carryOutEnabled = localStorage.getItem("CarryOutEnabled").trim();
            var giftCardsEnabled = localStorage.getItem("GiftCardsEnabled").trim();
            var giftCardProgramEnabled = localStorage.getItem("GiftCardProgramEnabled").trim();
            var rewardEnabled = localStorage.getItem("RewardsEnabled").trim();

            //console.log('carryOutEnabled: ' + carryOutEnabled)
            //console.log('giftCardsEnabled: ' + giftCardsEnabled)
            //console.log('giftCardProgramEnabled: ' + giftCardProgramEnabled)
            //console.log('rewardEnabled: ' + rewardEnabled)

            if (carryOutEnabled != "" && carryOutEnabled == "True") {
                setTimeout(function () { self.app.router.navigate('/carryout/', { reloadCurrent: false }); }, 1000);
            }
            else if (giftCardsEnabled != "" && giftCardsEnabled == "True") {
                setTimeout(function () { self.app.router.navigate('/giftcard/', { reloadCurrent: false }); }, 1000);
            }
            else if (rewardEnabled != "" && rewardEnabled == "True") {
                setTimeout(function () { self.app.router.navigate('/new_rewards/', { reloadCurrent: false }); }, 1000);
            }


        }
        else
            setTimeout(function () { self.app.router.navigate('/login_new/', { reloadCurrent: false }); }, 1000);

    }
    else if (pageURL.indexOf('login_new') > -1)//Login
    {
        InitLogin();

        $$('#loginnew #btnLogin').click(function () {
            Login();
        });

    }
    else if (pageURL.indexOf('carryout') > -1)//Carry Out
    {
        //CheckNewOrder();//For Testing purpose of New Order Popup
        $("#txtFilterOrderDateFrom").flatpickr({
            enableTime: false,
            dateFormat: "m/d/Y",
            //disableMobile: true,
            onChange: function (selectedDates, dateStr, instance) {
                //console.log("#txtFilterOrderDateFrom dateStr:" + dateStr);
                //console.log("#txtFilterOrderDateFrom selectedDates:" + selectedDates);
                //console.log("#txtFilterOrderDateFrom instance:" + instance);
                //console.log("#txtFilterOrderDateFrom dateStr:" + dateStr);
                if (dateStr != undefined && dateStr != null && dateStr.trim() != "") {
                    console.log("1");
                    $$("#phFilterOrderDateFrom").hide();
                }
                else {
                    console.log("2");
                    $$("#phFilterOrderDateFrom").show();
                }

            },

        });
        $("#txtFilterOrderDateTo").flatpickr({
            enableTime: false,
            dateFormat: "m/d/Y",
            //disableMobile: "false",
            onChange: function (dateObj, dateStr) {
                //console.log("#txtFilterOrderDateFrom dateObj:" + dateObj);
                //console.log("#txtFilterOrderDateFrom dateStr:" + dateStr);
                if (dateStr != undefined && dateStr != null && dateStr.trim() != "") {
                    //console.log("1");
                    $$("#phFilterOrderDateTo").hide();
                }
                else {
                    //console.log("2");
                    $$("#phFilterOrderDateTo").show();
                }

            }
        });
        $('#txtFilterOrderDateFrom').change(function () {
            var dateStr = $('#txtFilterOrderDateFrom').val();
            if (dateStr != undefined && dateStr != null && dateStr.trim() != "") {
                //console.log("1");
                $$("#phFilterOrderDateFrom").hide();
            }
            else {
                //console.log("2");
                $$("#phFilterOrderDateFrom").show();
            }
        });
        $('#txtFilterOrderDateTo').change(function () {
            var dateStr = $('#txtFilterOrderDateTo').val();
            if (dateStr != undefined && dateStr != null && dateStr.trim() != "") {
                //console.log("1");
                $$("#phFilterOrderDateTo").hide();
            }
            else {
                //console.log("2");
                $$("#phFilterOrderDateTo").show();
            }
        });
        $('#dvParentGiftCardDetailsPanel').html("");
        $('#dvDetailsPanel').html("");
        CheckGiftCardPermission();
        $$("#hdnCurrentState").val('New');

        var pageSize = 10;
        var currentPage = 0;

        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {

            var src = mediaURL + "notification.mp3";
            myMedia = new Media(src, onSuccess, onError, onStatus);

            if (device.platform != "browser") {
                deviceUUID = device.uuid;
                if (localStorage.getItem("StoreId") != null)
                    storeId = Number(localStorage.getItem("StoreId"));
                if (storeId > 0) {
                    InitPushNotification(storeId, device.manufacturer, device.uuid, device.version);
                }
            }
        }

        localStorage.setItem("CurrentPage", currentPage);
        var loadProcessing = localStorage.getItem("loadcarryoutprocessing");
        //Commented on 09.20.2019 -  Fir Double Loading
        ////if (loadProcessing != null && loadProcessing.toString().trim() == "true") {
        ////    //console.log("loadProcessing 1: ")
        ////    app.tab.show('#1');
        ////    BindcarryoutTab('New');
        ////    localStorage.setItem("loadcarryoutprocessing", null);

        ////}

        CarryoutOrdersList('New', 10, 0, 'dvNewList');
        var timeout = null;
        var src = mediaURL + "notification.mp3";
        var myMedia = null;
      
        $$('.page-content').scroll(function () {
            var OrderAvailable = localStorage.getItem("OrderAvailable");
            if (OrderAvailable == "1") {
                currentPage = localStorage.getItem("CurrentPage");
                currentPage = Number(currentPage) + 1;
                // console.log("currentPage: " + currentPage);
                var currenttab = $$("#hdnCurrentState").val();
                //alert(currenttab);
                if (currenttab == "New") {
                    //CarryoutOrdersListPaginationCurrent('New', pageSize, currentPage, 'dvNewList');
                    CarryoutOrdersListPagination('New', pageSize, currentPage, 'dvNewList');
                }
                else {
                    CarryoutOrdersListPagination('New', pageSize, currentPage, 'dvAllList');
                }                
                localStorage.setItem("CurrentPage", currentPage);
            }
            else {
                // $('#loader_msg').html("");
                var currentPageCount = localStorage.getItem("CurrentPage");
                console.log("Storage CurrentPage: " + currentPageCount + " CurrentPage: " + currentPage);
                if (currentPageCount == currentPage) {
                    var isLoaded = false;
                    $('#dvAllList').each(function () {
                        if ($(this).children('#divAfterEndScroll').length) {
                            isLoaded = true;
                            //alert("Loded");
                        }

                    });
                    if (!isLoaded)
                    {
                        localStorage.setItem("IsLoaded", "True");
                        for (var c = 0; c <= 15; c++) {
                            $('#dvAllList').append("<div class=\"order-container\" style=\"height:75px;border-bottom: none !important;\" id=\"divAfterEndScroll\"><div class=\"order-list-carryout\" data-popup=\".popup-details\"><div class=\"order-number-carryout\" style=\"white-space: nowrap;\"></div><div class=\"order-pickup-new\"></div></div></div>");
                        }
                    }                    
                }                                
            }

        });

        $('#linkCarryoutFilterIcon').click(function () {
            $('#ulFilterSortCarryout').show();
            $('#ulFilterSortGiftCard').hide();
            $('#ulFilterSortCoupon').hide();
            $('#ulFilterSortItem').hide();
        });
        
        $$('#btnPrintOrder').on('click', function () {
            alert("Print");
            var dataPrint = "data:image/png;base64,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";
            BTPrinter.connect(function (data) {
                BTPrinter.printImage(function (data) {
                    BTPrinter.disconnect(function (data) {
                        alert("Disconnect");
                        console.log(data)
                    }, function (err) {
                        alert("Disconnect Error");
                        console.log(err)
                    }, "TCKP302-UB");
                }, function (err) {
                    alert("Print Error: " + err);
                }, dataPrint);//Data to Print
            }, function (err) {
                alert("Connect Error: " + err);
            }, "TCKP302-UB");
            
        });        
        

    }
    else if (pageURL.indexOf('food_list') > -1) {//carry out food item list
        ResetFilters('items');
        BindCategoy('filterProductCategory');
        $$('#btnAddItem').click(function () {
            localStorage.setItem("HiddenItemId", 0);
            self.app.router.navigate('/foods/', { reloadCurrent: false });
        });
        $$('#linkfoodFilterIcon').click(function () {
            $('#ulFilterSortCarryout').hide();
            $('#ulFilterSortGiftCard').hide();
            $('#ulFilterSortCoupon').hide();
            $('#ulFilterSortItem').show();

        });

        CheckGiftCardPermission();
        var pageSize = 10;
        var currentPage = 0;
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            var src = mediaURL + "notification.mp3";
            myMedia = new Media(src, onSuccess, onError, onStatus);

            if (device.platform != "browser") {
                deviceUUID = device.uuid;
                if (localStorage.getItem("StoreId") != null)
                    storeId = Number(localStorage.getItem("StoreId"));
                if (storeId > 0) {
                    InitPushNotification(storeId, device.manufacturer, device.uuid, device.version);
                }
            }
        }

        localStorage.setItem("CurrentPage", currentPage);
        CarryoutItemsList(10, 0);
        //var timeout = null;
        //var src = mediaURL + "notification.mp3";
        //var myMedia = null;
        $$('.page-content').scroll(function () {
            var ItemAvailable = localStorage.getItem("ItemAvailable");
            if (ItemAvailable == "1") {
                currentPage = localStorage.getItem("CurrentPage");
                currentPage = Number(currentPage) + 1;
                //console.log("currentPage: " + currentPage);
                CarryoutItemsListPagination(pageSize, currentPage);
                localStorage.setItem("CurrentPage", currentPage);
            }


        });
    }

    else if (pageURL.indexOf('foods') > -1)// Product Edit
    {
        var storeId = 0;
        CheckGiftCardPermission();
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            var src = mediaURL + "notification.mp3";
            myMedia = new Media(src, onSuccess, onError, onStatus);

            if (device.platform != "browser") {
                deviceUUID = device.uuid;
                if (localStorage.getItem("StoreId") != null)
                    storeId = Number(localStorage.getItem("StoreId"));
                if (storeId > 0) {
                    InitPushNotification(storeId, device.manufacturer, device.uuid, device.version);
                }
            }
        }
        $('input[type=radio][name=checkAvailability]').change(function () {
            if (this.value == 'TimeSpecific') {
                $('#liAvailTiming').show();
            }
            else if (this.value == 'Normal') {
                $('#liAvailTiming').hide();
            }
        });
        // BindCategoy('productCategory');
        var itemId = 0;
        if (localStorage.getItem("HiddenItemId") != null) {
            itemId = localStorage.getItem("HiddenItemId").trim();
        }
        if (Number(itemId) > 0) {
            BindItemById(itemId);
            $("#dvProductText").text("Edit Item");
        }
        else {
            $("#dvProductText").text("Add Item");
            BindCategoy('productCategory');
        }
    }

    else if (pageURL.indexOf('giftcard') > -1)//Gift Card
    {

        //function preventScroll(e) {
        //    e.preventDefault();
        //}

        //// Call this func to block page scroll
        //function blockScroll() {
        //    $$('.page').on('touchstart touchmove', preventScroll);
        //}
        //function blockOffScroll() {
        //    $$('.page').off('touchstart touchmove', preventScroll);
        //}
        SetUpBarCodeScanButton('giftcardscan');
        BindCCYear('ddlCCYear');
        BindCCMonth('ddlCCMonth');
        $$("#txtCardCode").focus();
        //$$("#txtCardCodeSearch").focus();
        var screen_width = document.documentElement.clientWidth;
        var screen_heght = document.documentElement.clientHeight;

        //alert("screen_width: " + screen_width)
        var currentTab = "New";
        //console.log('screen_width: ' + screen_width)
        // console.log('screen_heght: ' + screen_heght)
        //Check GiftCard and GiftCard Program Enable
        CheckGiftCardPermission();
        var giftCardsEnabled = localStorage.getItem("GiftCardsEnabled").trim();
        var giftCardProgramEnabled = localStorage.getItem("GiftCardProgramEnabled").trim();
        //console.log('giftCardsEnabled: ' + giftCardsEnabled)
        //console.log('giftCardProgramEnabled: ' + giftCardProgramEnabled)
        if (giftCardsEnabled != "" && giftCardsEnabled == "True") {

            if (giftCardProgramEnabled == "" || giftCardProgramEnabled != "True") {
                $('#linkGiftCardNew').addClass('disabled');
                $('#linkGiftCardRedeem').addClass('disabled');
                //$('.tabs').css({ "transform": "translate3d(-200%, 0px, 0px)" });
                $('#linkGiftCardOrder').addClass('tab-link-active');
                $('#linkGiftCardNew').removeClass('tab-link-active');
                $('#tab-giftcard-order').addClass('tab-active');
                $('#tab-giftcard-new').removeClass('tab-active');

            }
            else if (giftCardProgramEnabled == "True") {
                //blockScroll();
                $('#txtCardCode').focus();
                $('#linkGiftCardNew').removeClass('disabled');
                $('#linkGiftCardRedeem').removeClass('disabled');
                //$('.tabs').css({ "transform": "translate3d(0%, 0px, 0px)" });
            }
        }
        else {
            $('#linkMenuGiftCard').addClass('disabled');
        }

        $('#linkGiftcardMenuReward').addClass('disabled');
        // SetMenuNavigation();
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            //console.log("deviceready")
            if (device.platform != "browser") {
                deviceUUID = device.uuid;
                if (localStorage.getItem("StoreId") != null)
                    storeId = Number(localStorage.getItem("StoreId"));
                if (storeId > 0) {
                    InitPushNotification(storeId, device.manufacturer, device.uuid, device.version);
                }
            }
            $$('#giftcardscan').on('click', function () {



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
             preferFrontCamera: false, // iOS and Android
             showFlipCameraButton: true, // iOS and Android
             formats: "CODE_128"
         }

         );
                $('#txtCardCode').codeScanner();
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
              preferFrontCamera: false, // iOS and Android
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
            $$('#giftcardloadredeemscan').on('click', function () {
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
              preferFrontCamera: false, // iOS and Android
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
        $$('#linkGiftCardNew').click(function () {
            BindCCYear('ddlCCYear');
            BindCCMonth('ddlCCMonth');
            $("#liPaymentType").hide();
            $("#liCCName").hide();
            $("#liCCNo").hide();
            ResetGiftCardNew();
            $("#hdnValidateCard").val(false);
            $("#hdnCardType").val("");
            SetUpBarCodeScanButton('giftcardscan');
            $('#txtCardCode').focus();
            currentTab = "New";
            //blockScroll();
            disableScrolling();
           
        });
        $$('#linkGiftCardRedeem').click(function () {
            ResetGiftCardLoadRedeem();
            SetUpBarCodeScanButton('giftcardloadredeemscan');
            
            $('#txtCardCodeSearch').focus();
            if (currentTab == "New") {
                //if (screen_width <= 417) {
                //    $('.tabs').css("transform", "translate3d(-1%, 0px, 0px)");
                //}
                //else {
                //    $('.tabs').css("transform", "translate3d(-30%, 0px, 0px)");
                //    //$('.tabs').css("transform", "translate3d(0%, 0px, 0px)");
                //}
            }
            else {
                //$('.tabs').css("transform", "translate3d(-100%, 0px, 0px)");
            }
            disableScrolling();
            //blockOffScroll();
        });
        $$('#linkGiftCardOrder').click(function () {
            ResetFilters('giftcardorders');
            currentTab = "Order";
            enableScrolling();
            //blockOffScroll();
        });
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
            //ClearSpecialCharacter('txtLoad');
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

        $$('#btnRefundGiftCard').click(function () {
            OpenGiftCardRefundPopup();
        });
        
        $$('#btnCheckBalanceGiftCard').click(function () {
            CheckGiftCardBalance();
        });
        $$('#btnDeactivateGiftCard').click(function () {
            OpenGiftCardDeactivePopup();
        });
        
        $$('input[type=radio][name=paymentType]').change(function () {
            if (this.value.toUpperCase() == 'CARD') {
                //$$("#liPaymentType").show();
                //$$("#liCCName").show();
                $$("#liCCName").hide();
                $$("#liCCNo").show();
                $$("#hdnSelectedPaymentType").val("Credit Card");
            }
            else if (this.value.toUpperCase() == 'CASH') {
                //$$("#liPaymentType").hide();
                $$("#liCCName").hide();
                $$("#liCCNo").hide();
                $$("#hdnSelectedPaymentType").val("Cash");
            }
        });


        //$$('input[type=radio][name=paymentPopupType]').change(function () {
        //    alert("hello");
        //    if (this.value.toUpperCase() == 'CARD') {
        //        $$("#divPopupPaymentArea").show();
        //        //$$("#txtPopupAmount").attr("placeholder", "Amount($)");
        //    }
        //    else if (this.value.toUpperCase() == 'CASH') {
        //        $$("#divPopupPaymentArea").hide();
        //        //$$("#txtPopupAmount").attr("placeholder", "Cash($)");
        //    }
        //});
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

        $$('#linkSearchIcon').click(function () {
            $('#ulFilterSortGiftCard').show();
            $('#ulFilterSortCoupon').hide();
            $('#ulFilterSortCarryout').hide();
            $('#ulFilterSortItem').hide();
        });
        //GiftCard Orders - End

        //Sudip - End
    }

    else if (pageURL.indexOf('manageservice') > -1) {
        var storeId = 0;
        CheckGiftCardPermission();
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {

            var src = mediaURL + "notification.mp3";
            myMedia = new Media(src, onSuccess, onError, onStatus);

            if (device.platform != "browser") {
                deviceUUID = device.uuid;
                if (localStorage.getItem("StoreId") != null)
                    storeId = Number(localStorage.getItem("StoreId"));
                if (storeId > 0) {
                    InitPushNotification(storeId, device.manufacturer, device.uuid, device.version);
                }
            }
        }
        SetManageService();
        //SetMenuNavigation();
    }

    else if (pageURL.indexOf('new_rewards') > -1)// Add Rewards
    {
        $$("#txtMemberId_Reward").focus();
        //$$("#txtMemberID_LoadRedeem").focus();
        CheckGiftCardPermission();
        SetUpBarCodeScanButton('scan');
        $$('#rewards #txtMemberId_Reward').focus();

        //SetMenuNavigation();
        $$('#btnCreate').click(function () {
            AddNewMemberID();
        });

        $$('#btnSearch').click(function () {
            //alert(1)
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

        $$('#txtPhone_Reward').on('input propertychange paste', function () {
            $("#hdnAlredyMemberChecked").val("false");
            // do your stuff
        });
        $$('#txtName_Reward').on('input propertychange paste', function () {
            $("#hdnAlredyMemberChecked").val("false");

            // do your stuff
        });
        $$('#txtEmail_Reward').on('input propertychange paste', function () {
            $("#hdnAlredyMemberChecked").val("false");

            // do your stuff
        });
        $$('#txtMemberID_LoadRedeem').on('change', function () {

            if ($('#txtMemberID_LoadRedeem').val() != "") {
                $('#txtMemberID_LoadRedeem').css('border-bottom', bottomBorder);
            }
        });
        $$('#linkRewardNew').click(function () {
            ResetRewardNew();
            SetUpBarCodeScanButton('scan');
            $('#rewards #txtMemberId_Reward').focus();
            disableScrolling();

        });
        $$('#linkRewardLoadRedeem').click(function () {
            ResetRewardLoadRedeem();
            SetUpBarCodeScanButton('loadredeemscan');
            $('#rewards #txtMemberID_LoadRedeem').focus();
            disableScrolling();

        });
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            console.log("deviceready")
            if (device.platform != "browser") {
                deviceUUID = device.uuid;
            }
            var storeId = 0;
            if (localStorage.getItem("StoreId") != null)
                storeId = localStorage.getItem("StoreId").trim();
            $$('#reward_new #scan').on('click', function () {

                console.log("reward scan click")
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
              preferFrontCamera: false, // iOS and Android
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


            $$('#reward_LoadRedeem #loadredeemscan').on('click', function () {
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
              preferFrontCamera: false, // iOS and Android
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


            if (storeId > 0)
                InitPushNotification(storeId, device.manufacturer, device.uuid, device.version);
        }
    }

    else if (pageURL.indexOf('profile') > -1)//Profile
    {
        var storeId = 0;
        CheckGiftCardPermission();
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            var src = mediaURL + "notification.mp3";
            myMedia = new Media(src, onSuccess, onError, onStatus);

            if (device.platform != "browser") {
                deviceUUID = device.uuid;
                if (localStorage.getItem("StoreId") != null)
                    storeId = Number(localStorage.getItem("StoreId"));
                if (storeId > 0) {
                    InitPushNotification(storeId, device.manufacturer, device.uuid, device.version);
                }
            }
        }
        LoadProfileDetails();
    }

    else if (pageURL.indexOf('coupon_list') > -1)//Coupon
    {
        ResetFilters('coupons');
        var storeId = 0;
        $("#txtFilterCouponStart").flatpickr({
            enableTime: false,
            dateFormat: "m/d/Y",
            //disableMobile: "false",
            onChange: function (dateObj, dateStr) {
                //console.log("#txtFilterOrderDateFrom dateObj:" + dateObj);
                //console.log("#txtFilterOrderDateFrom dateStr:" + dateStr);
                if (dateStr != undefined && dateStr != null && dateStr.trim() != "") {
                    //console.log("1");
                    $$("#phFilterCouponStart").hide();
                }
                else {
                    //console.log("2");
                    $$("#phFilterCouponStart").show();
                }

            }
        });
        $("#txtFilterCouponEnd").flatpickr({
            enableTime: false,
            dateFormat: "m/d/Y",
            onChange: function (dateObj, dateStr) {
                //console.log("#txtFilterOrderDateFrom dateObj:" + dateObj);
                //console.log("#txtFilterOrderDateFrom dateStr:" + dateStr);
                if (dateStr != undefined && dateStr != null && dateStr.trim() != "") {
                    //console.log("1");
                    $$("#phFilterCouponEnd").hide();
                }
                else {
                    //console.log("2");
                    $$("#phFilterCouponEnd").show();
                }

            }
            // disableMobile: "false"
        });
        $('#txtFilterCouponStart').change(function () {
            var dateStr = $('#txtFilterCouponStart').val();
            if (dateStr != undefined && dateStr != null && dateStr.trim() != "") {
                //console.log("1");
                $$("#phFilterCouponStart").hide();
            }
            else {
                //console.log("2");
                $$("#phFilterCouponStart").show();
            }
        });
        $('#txtFilterCouponEnd').change(function () {
            var dateStr = $('#txtFilterCouponEnd').val();
            if (dateStr != undefined && dateStr != null && dateStr.trim() != "") {
                //console.log("1");
                $$("#phFilterCouponEnd").hide();
            }
            else {
                //console.log("2");
                $$("#phFilterCouponEnd").show();
            }
        });
        //if (calendarModalCouponStart != undefined)
        //    calendarModalCouponStart.destroy();
        //if (calendarModalCouponEnd != undefined)
        //    calendarModalCouponEnd.destroy();
        //if (calendarModalOrderStart != undefined)
        //    calendarModalOrderStart.destroy();
        //if (calendarModalOrderEnd != undefined)
        //    calendarModalOrderEnd.destroy();
        //calendarModalCouponStart = app.calendar.create({
        //    inputEl: '#txtFilterCouponStart',
        //    openIn: 'customModal',
        //    header: true,
        //    footer: true,
        //    dateFormat: 'mm/dd/yyyy',
        //});
        //calendarModalCouponEnd = app.calendar.create({
        //    inputEl: '#txtFilterCouponEnd',
        //    openIn: 'customModal',
        //    header: true,
        //    footer: true,
        //    dateFormat: 'mm/dd/yyyy',
        //});
        CheckGiftCardPermission();
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            var src = mediaURL + "notification.mp3";
            myMedia = new Media(src, onSuccess, onError, onStatus);

            if (device.platform != "browser") {
                deviceUUID = device.uuid;

                if (localStorage.getItem("StoreId") != null)
                    storeId = Number(localStorage.getItem("StoreId"));
                if (storeId > 0) {
                    InitPushNotification(storeId, device.manufacturer, device.uuid, device.version);
                }
            }
        }
        //var calendarModalOrderStart = app.calendar.create({
        //    inputEl: '#txtFilterOrderDateFrom',
        //    openIn: 'customModal',
        //    header: true,
        //    footer: true,
        //    dateFormat: 'mm/dd/yyyy',
        //});
        //var calendarModalOrderEnd = app.calendar.create({
        //    inputEl: '#txtFilterOrderDateTo',
        //    openIn: 'customModal',
        //    header: true,
        //    footer: true,
        //    dateFormat: 'mm/dd/yyyy',
        //});


        var pageSize = 10;
        var currentPage = 0;
        $$('#linkFilterIcon').click(function () {
            $('#ulFilterSortCoupon').show();
            $('#ulFilterSortCarryout').hide();
            $('#ulFilterSortGiftCard').hide();
            $('#ulFilterSortItem').hide();
        });

        CouponList(pageSize, currentPage);

        function LoadCouponList() {
            CouponList(pageSize, currentPage);
        }

        $$('#btnAddCoupon').click(function () {
            localStorage.setItem("HiddenDiscountId", 0);
            self.app.router.navigate('/coupon/', { reloadCurrent: false });
        });

        $$('.page-content').scroll(function () {
            var CouponAvailable = localStorage.getItem("CouponAvailable");
            if (CouponAvailable == "1") {
                currentPage = localStorage.getItem("CouponCurrentPage");
                currentPage = Number(currentPage) + 1;
                //console.log("currentPage: " + currentPage);
                CouponListPagination(pageSize, currentPage);
                localStorage.setItem("CouponCurrentPage", currentPage);
            }
            else {

            }

        });

    }
    else if (pageURL.indexOf('coupon') > -1)//Coupon Add Edit
    {

        var storeId = 0;
        CheckGiftCardPermission();
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            var src = mediaURL + "notification.mp3";
            myMedia = new Media(src, onSuccess, onError, onStatus);

            if (device.platform != "browser") {
                deviceUUID = device.uuid;

                if (localStorage.getItem("StoreId") != null)
                    storeId = Number(localStorage.getItem("StoreId"));
                if (storeId > 0) {
                    InitPushNotification(storeId, device.manufacturer, device.uuid, device.version);
                }
            }
        }
        //LoadCouponEdit(45);
        var couponId = 0;
        if (localStorage.getItem("HiddenDiscountId") != null) {
            couponId = localStorage.getItem("HiddenDiscountId").trim();
        }
        if (Number(couponId) > 0) {
            LoadCouponEdit();
            $("#dvCouponHeaderText").text("Edit Coupon");
        }

        $$('#txtCouponStartDate').on('click', function () {
            //console.log($("#Start-picker-date-container").html())
            if ($("#Start-picker-date-container").html() == "") {
                var today = new Date();
                var hours = today.getHours();
                var minutes = today.getMinutes();
                var ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                if (hours <= 9) {
                    hours = "0" + hours;
                }
                minutes = minutes < 30 ? '00' : '30';
                var today = new Date();
                var pickerInline = app.picker.create({
                    containerEl: '#Start-picker-date-container',
                    inputEl: '#txtCouponStartDate',
                    toolbar: false,
                    rotateEffect: true,
                    value: [
                       today.getMonth(),
                      today.getDate(),
                      today.getFullYear(),
                      hours,
                      minutes,
                      ampm

                    ],
                    formatValue: function (values, displayValues) {
                        return displayValues[0] + '/' + values[1] + '/' + values[2] + ' ' + values[3] + ':' + values[4] + ' ' + values[5];
                    },
                    cols: [
                      // Months
                      {
                          values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
                          displayValues: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' '),

                      },
                      // Days
                      {
                          values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                      },
                      // Years
                      {
                          values: (function () {
                              var arr = [];
                              for (var i = 1950; i <= 2030; i++) { arr.push(i); }
                              return arr;
                          })(),
                      },
                      // Space divider
                      {
                          divider: true,
                          content: '&nbsp;&nbsp;'
                      },
                      // Hours
                      {
                          values: (function () {
                              var arr = [];
                              for (var i = 1; i <= 12; i++) {
                                  if (i <= 9) {
                                      arr.push("0" + i);
                                  }
                                  else {
                                      arr.push(i);
                                  }
                              }
                              return arr;
                          })(),
                          displayValues: (function () {
                              var arr = [];
                              for (var i = 1; i <= 12; i++) {
                                  if (i <= 9) {
                                      arr.push("0" + i);
                                  }
                                  else {
                                      arr.push(i);
                                  }
                              }
                              return arr;
                          })()
                      },
                      // Divider
                      {
                          divider: true,
                          content: ':'
                      },
                      // Minutes
                      {
                          values: ('00 30').split(' '),
                          displayValues: ('00 30').split(' '),

                      },
                      // Space divider
                      {
                          divider: true,
                          content: '&nbsp;&nbsp;'
                      },
                      //AM/PM
                      {
                          values: ('AM PM').split(' '),
                          displayValues: ('AM PM').split(' '),

                      }
                    ],
                    on: {
                        change: function (picker, values, displayValues) {
                            var daysInMonth = new Date(picker.value[2], picker.value[0] * 1 + 1, 0).getDate();
                            if (values[1] > daysInMonth) {
                                picker.cols[1].setValue(daysInMonth);
                            }
                        },
                    }
                });
            }
            else {
                $("#Start-picker-date-container").html("");
            }


        });
        $$('#txtCouponEndDate').on('click', function () {
            if ($("#Start-picker-date-container").html() == "") {

                var today = new Date();
                var hours = today.getHours();
                var minutes = today.getMinutes();
                var ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                if (hours <= 9) {
                    hours = "0" + hours;
                }
                minutes = minutes < 30 ? '00' : '30';
                var pickerInline = app.picker.create({
                    containerEl: '#Start-picker-date-container',
                    inputEl: '#txtCouponEndDate',
                    toolbar: false,
                    rotateEffect: true,
                    value: [
                      today.getMonth(),
                      today.getDate(),
                      today.getFullYear(),
                      hours,
                      minutes,
                      ampm
                    ],
                    formatValue: function (values, displayValues) {
                        return displayValues[0] + '/' + values[1] + '/' + values[2] + ' ' + values[3] + ':' + values[4] + ' ' + values[5];
                    },
                    cols: [
                      // Months
                      {
                          values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
                          displayValues: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' '),

                      },
                      // Days
                      {
                          values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                      },
                      // Years
                      {
                          values: (function () {
                              var arr = [];
                              for (var i = 1950; i <= 2030; i++) { arr.push(i); }
                              return arr;
                          })(),
                      },
                      // Space divider
                      {
                          divider: true,
                          content: '&nbsp;&nbsp;'
                      },
                      // Hours
                      {
                          values: (function () {
                              var arr = [];
                              for (var i = 1; i <= 12; i++) {
                                  if (i <= 9) {
                                      arr.push("0" + i);
                                  }
                                  else {
                                      arr.push(i);
                                  }
                              }
                              return arr;
                          })(),
                          displayValues: (function () {
                              var arr = [];
                              for (var i = 1; i <= 12; i++) {
                                  if (i <= 9) {
                                      arr.push("0" + i);
                                  }
                                  else {
                                      arr.push(i);
                                  }
                              }
                              return arr;
                          })()
                      },
                      // Divider
                      {
                          divider: true,
                          content: ':'
                      },
                      // Minutes
                      {
                          values: ('00 30').split(' '),
                          displayValues: ('00 30').split(' '),
                      },
                      // Space divider
                      {
                          divider: true,
                          content: '&nbsp;&nbsp;'
                      },
                      //AM/PM
                      {
                          values: ('AM PM').split(' '),
                          displayValues: ('AM PM').split(' '),
                      }
                    ],
                    on: {
                        change: function (picker, values, displayValues) {
                            var daysInMonth = new Date(picker.value[2], picker.value[0] * 1 + 1, 0).getDate();
                            if (values[1] > daysInMonth) {
                                picker.cols[1].setValue(daysInMonth);
                            }
                        },
                    }
                });
            }
            else {
                $("#Start-picker-date-container").html("");
            }

        });

    }
    else if (pageURL.indexOf('setup') > -1)//Setup
    {
        CheckGiftCardPermission();
    }
});

function InitPushNotification(storeId, name, uuid, version) {

    var push = PushNotification.init({
        "android": {
            "senderID": "771458932582"
        },
        "browser": {},
        "ios": {
            "sound": true,
            "vibration": true,
            "badge": true
        },
        "windows": {}
    });
    // console.log('after init');

    push.on('registration', function (data) {

        var oldRegId = localStorage.getItem('registrationId');

        //if (oldRegId == null || oldRegId == undefined) {
        //    console.log("Save new registration ID")
        //    // Save new registration ID
        //    localStorage.setItem('registrationId', data.registrationId);
        //    RegisterToken(storeId, data.registrationId,name,uuid,version);
        //}
        //else {
        //if (oldRegId !== data.registrationId) {
        console.log("Save new registration ID")
        // Save new registration ID
        localStorage.setItem('registrationId', data.registrationId);
        RegisterToken(storeId, data.registrationId, name, uuid, version);
        // }
        //}



    });

    push.on('error', function (e) {
        console.log("push error = " + e.message);
    });

    push.on('notification', function (data) {
        //setTimeout(function () {
        //    stopAudio();
        //    acceptOrderPopup.destroy();
        //    // Do something after 30 second 
        //}, 30000);
        //console.log('notification event: ' + data.message);
         if (data.message == "SoundOff") {
            localStorage.setItem("PushNotification", "Order accepted");
            ////localStorage.setItem("PushNotification", "SoundOff");
            ////$("#btnAcknowledgement").click();
            StopSound();

        }
        else if (data.message != "") {   ////if (data.message == "A new order has been placed") {  
            localStorage.setItem("PushNotification", "Order placed");
            ////localStorage.setItem("PushNotification", data.message);
            myMedia = new Media(src, onSuccess, onError, onStatus);
            //CheckNewOrder();
            $('#myDiv').html('<div class="block">' +
                                             '<a href="#" class="link popup-close modal-accept-button"  id="btnAcknowledgement" onclick="StopSoundAndRefreshCarryout();" style=\"top: 40% !important; height: 205px; font-size:35px;\">' + data.message + '</a>' +
                                             '<div class="overlay-button-area" id="dvPopOrders" style=\"top: 30px !important;\">' +
                                             '</div>' +
                                            '</div>');
            $('#myDiv').show();

            if (isDevice()) {
                // console.log('isDevice 1: ')
                //playAudio();
                myMedia.play();
            }
        }
        // alert('notification event: ' + data.message + ", " + data.title);
        //navigator.notification.alert(
        //    data.message,         // message
        //    null,                 // callback
        //    data.title,           // title
        //    'Ok'                  // buttonName
        //);
    });
}

function StopSound() {
    $('#myDiv').hide();
    if (isDevice()) {
        myMedia.stop();
    }
}

function StopSoundAndRefreshCarryout() {
    var storeId = SetStoreId();
    StopSound();//Stop Current Device Sound
    
    if (app.views.main.router.url.indexOf('carryout') > -1) {
        //alert("carryout 2");//////////
        app.tab.show('#1');//Commented For Stop Auto Redirect - 09.20.2019
        BindcarryoutTab('New');//Commented For Stop Auto Redirect - 09.20.2019
    }
    else {
        //alert("carryout 2 else");//////////
        localStorage.setItem("loadcarryoutprocessing", "true");
    }
    
    StopSoundOtherDevices(storeId);//Stop Other Device Sound   
}

function disableScrolling() {
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll = function () { window.scrollTo(x, y); };
}

function enableScrolling() {
    window.onscroll = function () { };
}
//Check whether logged in or not
function CheckLoggedIn() {

    $('#lblErr').html("");
    var storeId = 0;
    var appRefreshInterval = 120;
    if (localStorage.getItem("StoreId") != null)
        storeId = localStorage.getItem("StoreId").trim();
    //console.log("CheckLoggedIn StoreId: " + storeId);
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

            self.app.router.navigate('/carryout/', { reloadCurrent: false });
        }
    }
}


function CheckNewOrder() {

    var params = getParams();
    var storeId = 0;
    storeId = SetStoreId();
    if (Number(storeId) > 0) {
        var url = global + "/GetLatestCarryOutOrderPopupNew?storeid=" + storeId;
        try {
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
                            html += "<div id=\"divAcknowledgement\">";
                            if (value.PICKUPTIME != "") {
                                if (value.PICKUPTIME.indexOf("@") > -1) {
                                    var pickupdateOnly = value.PICKUPTIME.split('@')[0].trim();
                                    var pickuptimeOnly = value.PICKUPTIME.split('@')[1].trim();

                                    if (pickuptime.length > 0) {
                                        var pickupcount = false;
                                        var count = 0;
                                        var pickuphtml = "<div  class=\"popup-column-six\">&nbsp;</div><div class=\"popup-column-two\"><div class=\"popup-column-seven\" style=\"margin:auto;\"><input onfocus=\"this.value = this.value;\" style=\"width:80%;\" type=\"text\" class=\"popup_date\" data-input id=\"pickupdate_" + value.ID + "\" value=\"" + pickupdateOnly + "\"/></div><div class=\"popup-column-eight\"><select class=\"pickup\" id=\"pickuplist_" + value.ID + "\">";
                                        $.each(pickuptime, function (key, value1) {
                                            if ($.inArray(pickuptimeOnly.trim(), pickuptime) > -1) {

                                                if (value1.trim() === pickuptimeOnly.trim()) {
                                                    pickuphtml += "<option value='" + value1 + "' selected>" + value1 + "</option>";
                                                    pickupcount = true;
                                                }
                                                else {
                                                    if (pickupcount === true) {
                                                        if (value.PICKUPTIME.indexOf('@') > -1) {
                                                            pickuphtml += "<option value='" + value1 + "'>" + value1 + "</option>";
                                                        }
                                                        else {

                                                            var now = new Date();
                                                            var pickupdatetime = new Date(GetCurrentDateOnly() + " " + value.PICKUPTIME);
                                                            var dropdownValueDateTime = new Date(GetCurrentDateOnly() + " " + value1);
                                                            var minsDiff = Math.floor((dropdownValueDateTime.getTime() - now.getTime()) / 1000 / 60);
                                                            var minsDiffFromPickUpTime = Math.floor((dropdownValueDateTime.getTime() - pickupdatetime.getTime()) / 1000 / 60);
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
                                        pickuphtml += "</select></div></div><div  class=\"popup-column-six\">&nbsp;</div>";
                                    }
                                    html += "<div class=\"popup-row\">";
                                    html += "<div  class=\"popup-column-five\"><div class=\"pop-up-display-label\">Order #: <span class=\"pop-up-value-label\">" + value.ID + "</span></div></div>";
                                    html += "<div class=\"popup-column-four\"><div id=\"pickuptime_" + value.ID + "\" style=\"font-size:20px;color:#08b3c7;padding-bottom:10px;padding-top:4px; text-align:center;\">" + value.PICKUPTIME.split('@')[0].trim() + " @ " + value.PICKUPTIME.split('@')[1].trim() + "</div>" + "</div>";
                                    html += "<div class=\"popup-column-five\" style=\"text-align:right;\"><span style=\"font-size:28px;color:#799427;\" id=\"price\">" + FormatDecimal(value.ORDERTOTAL) + "</span></div></div>";

                                    html += "<div class=\"popup-row\">";
                                    html += pickuphtml;
                                    html += "</div>";



                                }
                                else {
                                    var pickuphtml = "<div class=\"popup-column-two\"><input style=\"display:none;\" type=\"text\" class=\"popup_date\" id=\"pickupdate_" + value.ID + "\" data-dateFormat=\"n/j/Y\"/></div><div class=\"popup-column-two\"><select class=\"pickup\" id=\"pickuplist_" + value.ID + "\">";
                                    $.each(pickuptime, function (key, value1) {

                                        if ($.inArray(value.PICKUPTIME.trim(), pickuptime) > -1) {

                                            if (value1.trim() === value.PICKUPTIME.trim()) {
                                                pickuphtml += "<option value='" + value1 + "' selected>" + value1 + "</option>";
                                                pickupcount = true;
                                            }
                                            else {
                                                if (pickupcount === true) {
                                                    var now = new Date();
                                                    var pickupdatetime = new Date(GetCurrentDateOnly() + " " + value.PICKUPTIME);
                                                    var dropdownValueDateTime = new Date(GetCurrentDateOnly() + " " + value1);
                                                    var minsDiff = Math.floor((dropdownValueDateTime.getTime() - now.getTime()) / 1000 / 60);
                                                    var minsDiffFromPickUpTime = Math.floor((dropdownValueDateTime.getTime() - pickupdatetime.getTime()) / 1000 / 60);
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
                                    pickuphtml += "</select></div>";
                                    html += "<div class=\"popup-row\">";
                                    html += "<div  class=\"popup-column-three\"><div class=\"pop-up-display-label\">Order #: <span class=\"pop-up-value-label\">" + value.ID + "</span></div></div>";
                                    html += "<div class=\"popup-column-three\"><div id=\"pickuptime_" + value.ID + "\" style=\"font-size:28px;color:#08b3c7;padding-bottom:10px; float: left;\">" + value.PICKUPTIME + "</div>" + pickuphtml + "</div>";
                                    html += "<div class=\"popup-column-three\" style=\"text-align:right;\"><span style=\"font-size:28px;color:#799427;\" id=\"price\">" + FormatDecimal(value.ORDERTOTAL) + "</span></div></div>";
                                }
                            }
                            else {
                                html += "<div class=\"popup-row\">";
                                html += "<div  class=\"popup-column-three\"><div class=\"pop-up-display-label\">Order #: <span class=\"pop-up-value-label\">" + value.ID + "</span></div></div>";
                                html += "<div class=\"popup-column-three\"><input type=\"hidden\" name=\"giftcardorder\" id=\"" + value.ID + "\"/><div style=\"font-size:28px;color:#08b3c7; float: left;\">&nbsp;</div></div>";
                                html += "<div class=\"popup-column-three\" style=\"text-align:right;\"><span style=\"font-size:28px;color:#799427;\" id=\"price\">" + FormatDecimal(value.ORDERTOTAL) + "</span></div></div>";

                            }
                            html += "<div class=\"popup-row\"> <div class=\"popup-column-one pop-up-display-label \">Name: <span class=\"pop-up-value-label\">" + value.BILLINGFIRSTNAME + " " + value.BILLINGLASTNAME + "</span></div></div>";;
                            //Below commented code for avoid unknown error on conversion
                            //if (value.BILLINGPHONE.length == 10)
                            //    html += "<div class=\"popup-row\">  <div class=\"popup-column-one pop-up-display-label\" >Phone: <span class=\"pop-up-value-label\" id=\"phone_" + value.ID + "\">" + FormatPhoneNumber(value.BILLINGPHONE) + "</span></div></div>";
                            //else
                            //    html += "<div class=\"popup-row\">  <div class=\"popup-column-one pop-up-display-label\">Phone: <span  class=\"pop-up-value-label\" id=\"phone_" + value.ID + "\">" + value.BILLINGPHONE + "</span></div></div>";
                            //html += "<div class=\"popup-row\"><div class=\"popup-column-one\" style=\"margin:10px 0 10px 0;\">";

                            //html += "<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" id=\"popUpItems\"> <tbody>";
                            //html += "<tr><td align=\"left\" style=\"font-size:17px;font-weight:bold;border-bottom:1px solid #000;\" width=\"55%\">Items</td><td style=\"font-size:17px;font-weight:bold;border-bottom:1px solid #000;\" align=\"center\" width=\"15%\">Quantity</td> <td style=\"font-size:17px;font-weight:bold;border-bottom:1px solid #000;\" align=\"right\" width=\"15%\">Price</td> <td style=\"font-size:17px;font-weight:bold;border-bottom:1px solid #000;\" align=\"right\" width=\"15%\">Amount</td></tr>";
                            //if (value.OrderItems.indexOf("#") > -1) {
                            //    var arrItemRows = value.OrderItems.split('#');
                            //    var i;
                            //    for (i = 0; i < arrItemRows.length - 1; i++) {
                            //        html += "<tr>";
                            //        var columns = arrItemRows[i].trim();
                            //        if (columns.indexOf('~') > -1) {
                            //            var arrColumn = columns.split('~');
                            //            var j;
                            //            //console.log("arrColumn.length: " + arrColumn.length)
                            //            var name = arrColumn[0];
                            //            var qty = arrColumn[1];
                            //            var price = arrColumn[2];
                            //            var notes = unescape(arrColumn[3]);

                            //            var amount = parseFloat(price) * parseFloat(qty);

                            //            if (notes != "") {
                            //                html += "<td align=\"left\" style=\"font-size:17px;\">" + name + "(" + decode_str(notes) + ")</td>";
                            //            }
                            //            else {
                            //                html += "<td align=\"left\" style=\"font-size:17px;\">" + name + "</td>";
                            //            }

                            //            html += "<td align=\"center\" style=\"font-size:17px;\">" + qty + "</td>";
                            //            html += "<td align=\"right\" style=\"font-size:17px;\">" + FormatDecimal(price) + "</td>";
                            //            html += "<td align=\"right\" style=\"font-size:17px;\">" + FormatDecimal(amount) + "</td>";

                            //        }
                            //        html += "</tr>";
                            //    }

                            //}

                            //html += "</tbody></table></div>";


                            html += "</div></div>";


                        });

                        $("#hdnOrderIds").val(orderIds);

                        if (html != "") {
                            // html += "<div class=\"block no-padding no-margin margin-bottom\"><div id=\"popup-picker-date-container\"></div></div>";


                            //acceptOrderPopup = app.popup.create({
                            //    content: '<div class="popup">' +
                            //                '<div class="block">' +
                            //                 //<button type="button" id="btnAcknowledgement" name="btnAcknowledgement" onclick="AcceptOrders();" class="modal-accept-button">ACCEPT</button>
                            //                 '<a href="#" class="link popup-close modal-accept-button"  id="btnAcknowledgement" onclick="AcceptOrders();">ACCEPT</a>' +
                            //                 '<div class="overlay-button-area" id="dvPopOrders">' +
                            //                  html +
                            //                   '</div>' +
                            //                  //'</div><p><a href="#" class="link popup-close">Close me</a></p>' +
                            //                '</div>' +
                            //              '</div>',
                            //    on: {
                            //        open: function (popup) {
                            //            // console.log('Popup open');
                            //        },
                            //        opened: function (popup) {
                            //            //console.log('Popup opened');
                            //        },
                            //    }
                            //});
                            //// Events also can be assigned on instance later
                            //acceptOrderPopup.on('close', function (popup) {
                            //    console.log('Popup close');
                            //});
                            //acceptOrderPopup.open();

                            $('#myDiv').html('<div class="block">' +
                                             //<button type="button" id="btnAcknowledgement" name="btnAcknowledgement" onclick="AcceptOrders();" class="modal-accept-button">ACCEPT</button>
                                             '<a href="#" class="link popup-close modal-accept-button"  id="btnAcknowledgement" onclick="AcceptOrders();">ACCEPT</a>' +
                                             '<div class="overlay-button-area" id="dvPopOrders" style=\"top: 30px !important;\">' +
                                              html +
                                               '</div>' +
                                              //'</div><p><a href="#" class="link popup-close">Close me</a></p>' +
                                            '</div>');
                            $('#myDiv').show();
                            //Reference the Table.
                            var tblForm = document.getElementById("dvPopOrders");

                            //Reference all INPUT elements in the Table.
                            var inputs = document.getElementsByTagName("input");

                            //Loop through all INPUT elements.
                            for (var i = 0; i < inputs.length; i++) {
                                //Check whether the INPUT element is TextBox.
                                if (inputs[i].type == "text") {
                                    $(inputs[i])
                                   .putCursorAtEnd() // should be chainable
                                   .on("focus", function () { // could be on any event
                                       $(inputs[i]).putCursorAtEnd()
                                   });
                                    //Check whether Date Format Validation is required.
                                    if (inputs[i].className.indexOf("popup_date") != 1) {

                                        //Set Max Length.
                                        inputs[i].setAttribute("maxlength", 10);

                                        //Only allow Numeric Keys.
                                        inputs[i].onkeydown = function (e) {
                                            return IsNumeric(this, e.keyCode);
                                        };

                                        //Validate Date as User types.
                                        inputs[i].onkeyup = function (e) {
                                            ValidateDateFormat(this, e.keyCode);
                                        };
                                    }
                                }
                            }
                        }
                        //console.log('isDevice 1: ' + isDevice())
                        if (isDevice()) {
                            // console.log('isDevice 1: ')
                            //playAudio();
                            myMedia.play();
                        }
                    }


                }

            });
        }
        catch (e) {
            console.log(GetCurrentDateTime() + " - " + " Error CheckNewOrder", browser);
        }
    }

    //  console.log(GetCurrentDateTime() + " - " + "CheckNewOrder END", browser);
}

function AcceptOrders() {
    if (isDevice()) {
        myMedia.stop();
    }

    
    var storeId = SetStoreId();
    var orderIds = $("#hdnOrderIds").val().trim();
    var orders = [];
    var customerphone = [];
    var carryoutchanged = 0;
    var giftcardchanged = 0;
    var restaurantDisplayName = "";
    if (localStorage.getItem("RestaurantName") != null)
        restaurantDisplayName = localStorage.getItem("RestaurantName").trim();

    var notification = localStorage.getItem("PushNotification").trim();
    if (notification == "Order accepted") {
        $('#myDiv').hide();
        //acceptOrderPopup.destroy();
        $("#hdnOrderIds").val("");
        //$(".pickup").each(function (index, element) {
          
        //    carryoutchanged++;

        //});
        //var group = $('input[name="giftcardorder"]');
        ////console.log(orders)
        //if (group.length > 0) {
        //    group.each(function () {
               
        //        giftcardchanged++;
        //    });
        //}
        //if (giftcardchanged > 0 && carryoutchanged > 0) {
        //    if (giftcardchanged > carryoutchanged) {
        //        localStorage.setItem("loadgiftcardorders", "true");
        //        self.app.router.navigate('/giftcard/', { reloadCurrent: true });

        //    }
        //    else {
        //        //localStorage.setItem("loadcarryoutprocessing", "true");
        //        //self.app.router.navigate('/carryout/', { reloadCurrent: true });
        //        // alert(app.views.main.router.url)
        //        if (app.views.main.router.url.indexOf('carryout') > -1) {
        //            app.tab.show('#2');
        //            BindcarryoutTab('Processing');
        //        }
        //        else {
        //            localStorage.setItem("loadcarryoutprocessing", "true");
        //            self.app.router.navigate('/carryout/', { reloadCurrent: true });
        //        }

        //    }
        //}
        //else if (giftcardchanged > 0 && carryoutchanged == 0) {
        //    localStorage.setItem("loadgiftcardorders", "true");
        //    self.app.router.navigate('/giftcard/', { reloadCurrent: true });

        //}
        //else if (carryoutchanged > 0 && giftcardchanged == 0) {
        //    //   alert(app.views.main.router.url)
        //    //localStorage.setItem("loadcarryoutprocessing", "true");
        //    //self.app.router.navigate('/carryout/', { reloadCurrent: true });
        //    if (app.views.main.router.url.indexOf('carryout') > -1) {
        //        app.tab.show('#2');
        //        BindcarryoutTab('Processing');
        //    }
        //    else {
        //        localStorage.setItem("loadcarryoutprocessing", "true");
        //        self.app.router.navigate('/carryout/', { reloadCurrent: true });
        //    }
        //}
        //else {
        //    // alert(app.views.main.router.url)
        //    // localStorage.setItem("loadcarryoutprocessing", "true");
        //    //self.app.router.navigate('/carryout/', { reloadCurrent: true });
        //    if (app.views.main.router.url.indexOf('carryout') > -1) {
        //        app.tab.show('#2');
        //        BindcarryoutTab('Processing');
        //    }
        //    else {
        //        localStorage.setItem("loadcarryoutprocessing", "true");
        //        self.app.router.navigate('/carryout/', { reloadCurrent: true });
        //    }
        //}
    }
    else {
        $(".pickup").each(function (index, element) {
            // element == this
            var elemId = $(this).attr("id");
            var orderId = $(this).attr("id").split('_')[1];
            var pickupdate = $("#pickupdate_" + orderId).val();
            //console.log('pickupdate: ' + pickupdate);
            var pickup = $(this).val().trim();
            var oldPickUp = $("#pickuptime_" + orderId).html().trim();
            var oldpickupdate = "";
            var oldpickuptime = "";
            // console.log(oldPickUp)
            if (oldPickUp.indexOf("@") > -1) {
                var phone = $("#phone_" + orderId).html().trim().replace("(", "").replace(")", "").replace("-", "");

                oldpickupdate = oldPickUp.split('@')[0].trim();
                oldpickuptime = oldPickUp.split('@')[1].trim();
                orders.push(orderId + "#" + (pickupdate + "@" + pickup));
                if (oldpickupdate != pickupdate || oldpickuptime != pickup) {
                    customerphone.push(orderId + "#" + (pickupdate + "@" + pickup) + "#" + phone + "#changed");
                }
                else {
                    customerphone.push(orderId + "#" + (pickupdate + "@" + pickup) + "#" + phone + "#notchanged");
                }
            }
            else {
                var phone = $("#phone_" + orderId).html().trim().replace("(", "").replace(")", "").replace("-", "");

                oldpickuptime = oldPickUp;
                orders.push(orderId + "#" + pickup);
                if (oldPickUp != pickup) {
                    customerphone.push(orderId + "#" + pickup + "#" + phone + "#changed");
                }
                else {
                    customerphone.push(orderId + "#" + pickup + "#" + phone + "#notchanged");
                }
            }
            carryoutchanged++;

        });
        var group = $('input[name="giftcardorder"]');
        //console.log(orders)
        if (group.length > 0) {
            group.each(function () {
                var orderId = $(this).attr("id");
                orders.push(orderId + "#NA");
                giftcardchanged++;
            });
        }
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

                //alert(response);//////////

                $('#myDiv').hide();
                //acceptOrderPopup.destroy();
                $("#hdnOrderIds").val("");

                if (giftcardchanged > 0 && carryoutchanged > 0) {
                    //alert("GiftcardChanged > 0 & CarryoutChanged > 0");//////////
                    if (giftcardchanged > carryoutchanged) {
                        localStorage.setItem("loadgiftcardorders", "true");
                        ////self.app.router.navigate('/giftcard/', { reloadCurrent: true });//Commented For Stop Auto Redirect - 09.20.2019

                    }
                    else {
                        //alert("giftcardchanged > carryoutchanged else");//////////
                        //localStorage.setItem("loadcarryoutprocessing", "true");
                        //self.app.router.navigate('/carryout/', { reloadCurrent: true });
                        // alert(app.views.main.router.url)
                        if (app.views.main.router.url.indexOf('carryout') > -1) {
                            //alert("carryout 1");//////////
                            app.tab.show('#1');//Commented For Stop Auto Redirect - 09.20.2019
                            BindcarryoutTab('New');//Commented For Stop Auto Redirect - 09.20.2019
                        }
                        else {
                            //alert("carryout 1 else");//////////
                            localStorage.setItem("loadcarryoutprocessing", "true");
                            ////self.app.router.navigate('/carryout/', { reloadCurrent: true });//Commented For Stop Auto Redirect - 09.20.2019
                        }

                    }
                }
                else if (giftcardchanged > 0 && carryoutchanged == 0) {
                    //alert("GiftcardChanged > 0 & CarryoutChanged == 0");//////////
                    localStorage.setItem("loadgiftcardorders", "true");
                    ////self.app.router.navigate('/giftcard/', { reloadCurrent: true });//Commented For Stop Auto Redirect - 09.20.2019

                }
                else if (carryoutchanged > 0 && giftcardchanged == 0) {
                    //alert("carryoutchanged > 0 & giftcardChanged == 0");//////////
                    //   alert(app.views.main.router.url)
                    //localStorage.setItem("loadcarryoutprocessing", "true");
                    //self.app.router.navigate('/carryout/', { reloadCurrent: true });
                    if (app.views.main.router.url.indexOf('carryout') > -1) {
                        //alert("carryout 2");//////////
                        app.tab.show('#1');//Commented For Stop Auto Redirect - 09.20.2019
                        BindcarryoutTab('New');//Commented For Stop Auto Redirect - 09.20.2019
                    }
                    else {
                        //alert("carryout 2 else");//////////
                        localStorage.setItem("loadcarryoutprocessing", "true");
                        ////self.app.router.navigate('/carryout/', { reloadCurrent: true });//Commented For Stop Auto Redirect - 09.20.2019
                    }
                }
                else {
                    //alert("else");//////////
                    // alert(app.views.main.router.url)
                    // localStorage.setItem("loadcarryoutprocessing", "true");
                    //self.app.router.navigate('/carryout/', { reloadCurrent: true });
                    if (app.views.main.router.url.indexOf('carryout') > -1) {
                        //alert("carryout 3");//////////
                        app.tab.show('#1');//Commented For Stop Auto Redirect - 09.20.2019
                        BindcarryoutTab('New');//Commented For Stop Auto Redirect - 09.20.2019
                    }
                    else {
                        //alert("carryout 3 else");//////////
                        localStorage.setItem("loadcarryoutprocessing", "true");
                        ////self.app.router.navigate('/carryout/', { reloadCurrent: true });//Commented For Stop Auto Redirect - 09.20.2019
                    }
                }
                StopSoundOtherDevices(storeId);
            },
            error: function (xhr, textStatus, errorThrown) {
                //alert(xhr.responseText);
                //alert(textStatus);
                //alert(errorThrown);
            }
        });
    }
    


}
function StopSoundOtherDevices(storeId) {
    var regId = localStorage.getItem('registrationId');

    $.ajax({
        //url: global + 'StopSoundInAllDevices',
        url: global + 'StopSoundInAllDevicesNew',
        type: 'GET',
        data: {
            storeId: storeId,
            currentDeviceId: deviceUUID
        },
        datatype: 'jsonp',
        contenttype: "application/json",
        crossDomain: true,
        async: false,
        success: function (response) {
            console.log(response)

        },
        error: function (xhr, textStatus, errorThrown) {
            //alert(xhr.responseText);
            //alert(textStatus);
            //alert(errorThrown);
        }
    });
}
function Back() {
    // console.log('Back')
    //console.log(app.views.main.router);
    //console.log(app.views.main.router.url);
    //console.log(app.views.main.router.history);
    if (app.views.main.router.history.length > 0) {
        var secondLastPage = "";
        var thirdLastPage = "";
        var length = app.views.main.router.history.length;
        if (length > 2) {
            secondLastPage = app.views.main.router.history[length - 2];
            thirdLastPage = app.views.main.router.history[length - 3];
        }
        ///console.log('secondLastPage: ' + secondLastPage);
        //console.log('thirdLastPage: ' + thirdLastPage);
        if (secondLastPage != "" && secondLastPage != "/login_new/" && secondLastPage != "/") {
            //console.log(1);
            app.views.main.router.back();
        }
        else {

            //console.log(2);
            //CheckLoggedIn();
        }
    }

    //history.go(-1);
    //navigator.app.backHistory();
}

function playAudio() {
    console.log("Playing")
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
    //alert("Stopping")
    // myMedia = new Media(src, onSuccess, onError, onStatus);
    // alert("Stopping");
    myMedia.stop();
}


function IsNumeric(input, keyCode) {
    if (keyCode == 16) {
        isShift = true;
    }
    //Allow only Numeric Keys.
    if (((keyCode >= 48 && keyCode <= 57) || keyCode == 8 || keyCode <= 37 || keyCode <= 39 || (keyCode >= 96 && keyCode <= 105)) && isShift == false) {
        if ((input.value.length == 2 || input.value.length == 5) && keyCode != 8) {
            input.value += seperator;
        }

        return true;
    }
    else {
        return false;
    }
};

function ValidateDateFormat(input, keyCode) {
    var dateString = input.value;
    if (keyCode == 16) {
        isShift = false;
    }
    //var regex = /(((0|1)[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/((19|20)\d\d))$/;
    var regex = /(0[1-9]|1[0-2])\/(((0|1)[0-9]|2[0-9]|3[0-1])\/((19|20)\d\d))$/;

    //Check whether valid dd/MM/yyyy Date Format.
    if (regex.test(dateString) || dateString.length == 0) {
        $(input).css('border-bottom', bottomBorder);

        //ShowHideError(input, "none");
    } else {
        //ShowHideError(input, "block");
        $(input).css('border-bottom', errorClassBorder);

    }
};

function ShowHideError(textbox, display) {
    var row = textbox.parentNode.parentNode;
    var errorMsg = row.getElementsByTagName("span")[0];
    if (errorMsg != null) {
        errorMsg.style.display = display;
    }
};


$.fn.putCursorAtEnd = function () {

    return this.each(function () {

        // Cache references
        var $el = $(this),
            el = this;

        // Only focus if input isn't already
        if (!$el.is(":focus")) {
            $el.focus();
        }

        // If this function exists... (IE 9+)
        if (el.setSelectionRange) {

            // Double the length because Opera is inconsistent about whether a carriage return is one character or two.
            var len = $el.val().length * 2;

            // Timeout seems to be required for Blink
            setTimeout(function () {
                el.setSelectionRange(len, len);
            }, 1);

        } else {

            // As a fallback, replace the contents with itself
            // Doesn't work in Chrome, but Chrome supports setSelectionRange
            $el.val($el.val());

        }

        // Scroll to the bottom, in case we're in a tall textarea
        // (Necessary for Firefox and Chrome)
        this.scrollTop = 999999;

    });

};








