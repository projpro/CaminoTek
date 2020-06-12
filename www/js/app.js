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








