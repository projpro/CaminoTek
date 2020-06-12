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








