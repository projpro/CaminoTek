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








