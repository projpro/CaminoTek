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
            $('#ulFilterSortGiftCardHistory').hide();
            $('#ulFilterSortCoupon').hide();
            $('#ulFilterSortItem').hide();
        });

        $$('#btnPrintOrder').on('click', function () { 
            $(this).text("Printing...");
            PrintCarryoutDetails();
            
            //Test Print Start            
            //Test Print End
            
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
            $('#ulFilterSortGiftCardHistory').hide();
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
            $('#ulFilterSortGiftCard').show();
            $('#ulFilterSortGiftCardHistory').hide();
            ResetFilters('giftcardorders');
            currentTab = "Order";
            enableScrolling();
            //blockOffScroll();
        });
        $$('#linkGiftCardHistory').click(function () {
            $('#ulFilterSortGiftCard').hide();
            $('#ulFilterSortGiftCardHistory').show();
            ResetFilters('giftcardhistory');
            $("#txtFilterGiftCardHistoryDate").flatpickr({
                enableTime: false,
                dateFormat: "m/d/Y",
                //disableMobile: "false",
                onChange: function (dateObj, dateStr) {
                    //console.log("#txtFilterOrderDateFrom dateObj:" + dateObj);
                    //console.log("#txtFilterOrderDateFrom dateStr:" + dateStr);
                    if (dateStr != undefined && dateStr != null && dateStr.trim() != "") {
                        //console.log("1");
                        $$("#phFilterGiftCardHistoryDate").hide();
                    }
                    else {
                        //console.log("2");
                        $$("#phFilterGiftCardHistoryDate").show();
                    }

                }
            });
            $('#txtFilterGiftCardHistoryDate').change(function () {
                var dateStr = $('#txtFilterGiftCardHistoryDate').val();
                if (dateStr != undefined && dateStr != null && dateStr.trim() != "") {
                    //console.log("1");
                    $$("#phFilterGiftCardHistoryDate").hide();
                }
                else {
                    //console.log("2");
                    $$("#phFilterGiftCardHistoryDate").show();
                }
            });
            currentTab = "History";
            enableScrolling();
            GiftCardHistoryList(pageSize, currentPage);
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
            console.log("Current Tab: " + currentTab);
            if (currentTab == "Order") {
                var OrderAvailable = localStorage.getItem("GiftCardAvailable");
                if (OrderAvailable == "1") {
                    currentPage = localStorage.getItem("GiftCardCurrentPage");
                    currentPage = Number(currentPage) + 1;
                    GiftCardOrdersListPagination(pageSize, currentPage);
                    localStorage.setItem("GiftCardCurrentPage", currentPage);
                }
                else {

                }
            }
            else if (currentTab == "History") {
                var OrderAvailable = localStorage.getItem("GiftCardHistroyAvailable");
                if (OrderAvailable == "1") {
                    currentPage = localStorage.getItem("GiftCardHistoryCurrentPage");
                    currentPage = Number(currentPage) + 1;
                    GiftCardHistoryListPagination(pageSize, currentPage);
                    localStorage.setItem("GiftCardHistoryCurrentPage", currentPage);
                }
                else {

                }
            }
        });

        $$('#linkSearchIcon').click(function () {
            if (currentTab == "Order") {
                $('#ulFilterSortDineIn').hide();
                $('#ulFilterSortGiftCard').show();
                $('#ulFilterSortGiftCardHistory').hide();
            }
            else if (currentTab == "History") {
                $('#ulFilterSortDineIn').hide();
                $('#ulFilterSortGiftCard').hide();
                $('#ulFilterSortGiftCardHistory').show();
            }
            
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
            $('#ulFilterSortGiftCardHistory').hide();
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
    else if (pageURL.indexOf('dinein_list') > -1)//Coupon
    {
        ResetFilters('dinein_list');
        var storeId = 0;
        $("#txtFilterDineinDate").flatpickr({
            enableTime: false,
            dateFormat: "m/d/Y",
            //disableMobile: "false",
            onChange: function (dateObj, dateStr) {
                //console.log("#txtFilterOrderDateFrom dateObj:" + dateObj);
                //console.log("#txtFilterOrderDateFrom dateStr:" + dateStr);
                if (dateStr != undefined && dateStr != null && dateStr.trim() != "") {
                    //console.log("1");
                    $$("#phFilterDineinDate").hide();
                }
                else {
                    //console.log("2");
                    $$("#phFilterDineinDate").show();
                }

            }
        });
        $('#txtFilterDineinDate').change(function () {
            var dateStr = $('#txtFilterDineinDate').val();
            if (dateStr != undefined && dateStr != null && dateStr.trim() != "") {
                //console.log("1");
                $$("#phFilterDineinDate").hide();
            }
            else {
                //console.log("2");
                $$("#phFilterDineinDate").show();
            }
        });
        
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
       
        var pageSize = 10;
        var currentPage = 0;
        $$('#linkFilterIcon').click(function () {
            $('#ulFilterSortDineIn').show();
            $('#ulFilterSortCoupon').hide();
            $('#ulFilterSortCarryout').hide();
            $('#ulFilterSortGiftCard').hide();
            $('#ulFilterSortGiftCardHistory').hide();
            $('#ulFilterSortItem').hide();
        });

        DineInList(pageSize, currentPage);
                
        $$('.page-content').scroll(function () {
            var DineInAvailable = localStorage.getItem("DineinAvailable");
            if (DineInAvailable == "1") {
                currentPage = localStorage.getItem("DineinCurrentPage");
                currentPage = Number(currentPage) + 1;
                //console.log("currentPage: " + currentPage);
                DineInListPagination(pageSize, currentPage);
                localStorage.setItem("DineinCurrentPage", currentPage);
            }
            else {

            }

        });

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


        ////else if (data.message == "Order accepted") {
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
        
        ////else if (data.message == "Device Ping") {
        ////    localStorage.setItem("PushNotification", "Order accepted");
        ////    myMedia = new Media(src, onSuccess, onError, onStatus);
        ////    $('#myDiv').html('<div class="block">' +
        ////                                     '<a href="#" class="link popup-close modal-accept-button" onclick="StopSound();" style=\"top: 40% !important; height: 205px; \">Click To Stop Sound</a>' +
        ////                                     '<div class="overlay-button-area" id="dvPopOrders" style=\"top: 30px !important;\">' +
        ////                                     '</div>' +
        ////                                    '</div>');
        ////    $('#myDiv').show();

        ////    if (isDevice()) {
        ////        // console.log('isDevice 1: ')
        ////        //playAudio();
        ////        myMedia.play();
        ////    }
        ////}

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
                            //Commented for hide Order other section from order popup
                            ////if (value.BILLINGPHONE.length == 10)
                            ////    html += "<div class=\"popup-row\">  <div class=\"popup-column-one pop-up-display-label\" >Phone: <span class=\"pop-up-value-label\" id=\"phone_" + value.ID + "\">" + FormatPhoneNumber(value.BILLINGPHONE) + "</span></div></div>";
                            ////else
                            ////    html += "<div class=\"popup-row\">  <div class=\"popup-column-one pop-up-display-label\">Phone: <span  class=\"pop-up-value-label\" id=\"phone_" + value.ID + "\">" + value.BILLINGPHONE + "</span></div></div>";
                            ////html += "<div class=\"popup-row\"><div class=\"popup-column-one\" style=\"margin:10px 0 10px 0;\">";

                            ////html += "<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" id=\"popUpItems\"> <tbody>";
                            ////html += "<tr><td align=\"left\" style=\"font-size:17px;font-weight:bold;border-bottom:1px solid #000;\" width=\"55%\">Items</td><td style=\"font-size:17px;font-weight:bold;border-bottom:1px solid #000;\" align=\"center\" width=\"15%\">Quantity</td> <td style=\"font-size:17px;font-weight:bold;border-bottom:1px solid #000;\" align=\"right\" width=\"15%\">Price</td> <td style=\"font-size:17px;font-weight:bold;border-bottom:1px solid #000;\" align=\"right\" width=\"15%\">Amount</td></tr>";
                            ////if (value.OrderItems.indexOf("#") > -1) {
                            ////    var arrItemRows = value.OrderItems.split('#');
                            ////    var i;
                            ////    for (i = 0; i < arrItemRows.length - 1; i++) {
                            ////        html += "<tr>";
                            ////        var columns = arrItemRows[i].trim();
                            ////        if (columns.indexOf('~') > -1) {
                            ////            var arrColumn = columns.split('~');
                            ////            var j;
                            ////            //console.log("arrColumn.length: " + arrColumn.length)
                            ////            var name = arrColumn[0];
                            ////            var qty = arrColumn[1];
                            ////            var price = arrColumn[2];
                            ////            var notes = unescape(arrColumn[3]);

                            ////            var amount = parseFloat(price) * parseFloat(qty);

                            ////            if (notes != "") {
                            ////                html += "<td align=\"left\" style=\"font-size:17px;\">" + name + "(" + decode_str(notes) + ")</td>";
                            ////            }
                            ////            else {
                            ////                html += "<td align=\"left\" style=\"font-size:17px;\">" + name + "</td>";
                            ////            }

                            ////            html += "<td align=\"center\" style=\"font-size:17px;\">" + qty + "</td>";
                            ////            html += "<td align=\"right\" style=\"font-size:17px;\">" + FormatDecimal(price) + "</td>";
                            ////            html += "<td align=\"right\" style=\"font-size:17px;\">" + FormatDecimal(amount) + "</td>";

                            ////        }
                            ////        html += "</tr>";
                            ////    }

                            ////}

                            ////html += "</tbody></table></div>";


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
        url: global + 'StopSoundInAllDevicesNew',
        //url: global + 'StopSoundInAllDevices',
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


//Print Order
function PrintCarryoutDetails() {
    var id = $("#carryout #dvCarryOutDetailsInner #hdnSelectedOrderId").val();
    //alert("ID: " + id);
    $('#btnPrintOrder').text("Printing...");

    var storeId = SetStoreId();
    var printerName = "";
    var showPriceInPrint = true;
    if (localStorage.getItem("PrinterName") != null)
        printerName = localStorage.getItem("PrinterName");

    if (localStorage.getItem("HidePriceInPrint") != null) {
        var hidePriceInPrint = localStorage.getItem("HidePriceInPrint");
        if (hidePriceInPrint == "True" || hidePriceInPrint == "true") {
            showPriceInPrint = false;
        }
        else {
            showPriceInPrint = true;
        }
    }

    if (id > 0) {
        var url = global + "/GetCarryOutOrderDetailsForPrint?orderid=" + id;
        //alert(url);

        BTPrinter.connect(function (data) {

            $.getJSON(url, function (data) {
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
                var phone = "";
                var ordertotal = "";

                var orderId = 0;
                var orderDate = "";
                var orderTime = "";
                var pickupTime = "";
                var orderStatus = "";
                var numberOfItems = "";
                var ordertype = "";

                var taxValue = "0.00";
                var shippingValue = "0.00";
                var subTotalWithoutTax = "0.00";
                var curbsidePickup = false;
                var curbsidePickupMessage = "";
                var curbsidePickupDate = "";
                var curbsidePickupTime = "";
                var refundValue = "0.00";

                var tipValue = "0.00";
                var discountValue = "0.00";
                var couponCode = "";
                var rewardValue = "0.00";
                var rewardPoints = "";
                var giftCardValue = "0.00";
                var giftCardCode = "";

                //console.log(data);
                $.each(JSON.parse(data), function (index, value) {
                    //console.log(value);                       

                    if (value.Type == "OrderInfo") {
                        //console.log('value.OID: ' + value.OID)
                        orderId = value.OID;
                        //CurbsidePickup Seciton
                        if (value.CurbsidePickup) {
                            curbsidePickup = true;
                        }
                        else {
                            curbsidePickup = false;
                        }
                        if (value.ORDERTYPE != "") {
                            ordertype = value.ORDERTYPE;
                        }
                        if (ordertype != "" && ordertype == "Delivery") {
                            ordertype = "Delivery";
                        }
                        else if (curbsidePickup) {
                            ordertype = "Curbside";
                        }
                        else {
                            ordertype = "Carry Out";
                        }

                        //Print Order Type, OrderId Start
                        //BTPrinter.printTextSizeAlign(function (data) {
                        //}, function (err) {
                        //}, ordertype + "                              #" + orderId + "\n", '20', '0');//30
                        ////alert("Print #");
                        ////Print Ordet Type, OrderId End

                        BTPrinter.printText(function (data) {
                        }, function (err) {
                        }, "\x1b\x40" + "\n");//Clear Buffer


                        BTPrinter.printBase64(function (data) {
                            console.log("Success");
                            console.log(data);
                        }, function (err) {
                            console.log("Error");
                            console.log(err);
                        }, "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", '1');//base64 string, align

                        //Default Tab(\x1b\x44\x00)
                        BTPrinter.printText(function (data) {
                        }, function (err) {
                        }, "\x1b\x6b\x01\x1b\x6c\x01\x1b\x67\x1b\x32" + "\n");// Font + Margin + CPI + Line Spacing(1/8)
                        
                        BTPrinter.printTextSizeAlign(function (data) {
                        }, function (err) {
                        }, "www.bistroux.com" + "\n", '10', '1');

                        //BTPrinter.printText(function (data) {
                        //}, function (err) {
                        //}, "\x1b\x21\x20\x1b\x61\x00 " + ordertype + "    #" + orderId + "\n");

                        BTPrinter.printTextSizeAlign(function (data) {
                        }, function (err) {
                        }, ordertype + "   #" + orderId + "\n", '30', '1');


                        //console.log(value.PICKUPTIME)
                        if (value.PICKUPTIME != undefined) {
                            //$("#carryout #hdnSelectedOrderPickUpTime").val(value.PICKUPTIME);
                            pickupTime = value.PICKUPTIME;
                            if (pickupTime.charAt(0) === '0') {
                                pickupTime = pickupTime.substr(1);
                            }
                        }
                        if (pickupTime != undefined) {
                            if (pickupTime.indexOf("@") > -1) {
                                var pickupDateOnly = pickupTime.split('@')[0].trim();
                                var pickupTimeOnly = pickupTime.split('@')[1].trim();

                                //Print Time Start
                                BTPrinter.printTextSizeAlign(function (data) {
                                }, function (err) {
                                }, pickupTimeOnly + "\n", '30', '1');//20
                                //alert("Print Time");
                                //Print Time End

                            }
                            else {
                                //Print Time Start
                                BTPrinter.printTextSizeAlign(function (data) {
                                }, function (err) {
                                }, pickupTime + "\n", '30', '1');//20
                                //alert("Print Time");
                            }
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

                        }
                        else {
                            grandTotal = value.ORDERTOTAL;
                            grandTotalvalue = FormatDecimal(grandTotal);
                        }


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
                        if (value.TAX != undefined && Number(value.TAX) > 0) {
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

                        if (value.PHONE != "") {
                            phone = value.PHONE;
                        }
                        else {
                            phone = value.BILLINGPHONE;
                        }

                        if (phone != "" && phone != undefined && phone.length == 10)
                            phone = FormatPhoneNumber(phone);


                        //Print Name, Phone Start
                        //BTPrinter.printTextSizeAlign(function (data) {
                        //}, function (err) {
                        //}, firstName + " " + lastName + "    " + phone + "\n", '11', '0');//5
                        ////alert("Print Name Phone");
                        ////Print Name, Phone End

                        BTPrinter.printText(function (data) {
                        }, function (err) {
                        }, "\x1b\x21\x31" + firstName + " " + lastName + "  " + phone + "\n\n");

                        //BTPrinter.printText(function (data) {
                        //}, function (err) {
                        //}, "\x1b\x67 " + firstName + " " + lastName + "     " + phone + "\n");
                        

                        //if (value.ORDERSTATUSID != "" && value.ORDERSTATUSID != undefined) {
                        //    orderStatus = value.ORDERSTATUSID;
                        //}
                        if (value.NOOFITEMS != "" && value.NOOFITEMS != undefined) {
                            numberOfItems = value.NOOFITEMS;
                        }



                    }
                    else if (value.Type == "DiscountInfo") {
                        discountValue = FormatDecimal(orderDiscount);
                        couponCode = value.COUPONCODE;
                        //htmlDiscount += " <tr>";
                        //htmlDiscount += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Coupon (" + value.COUPONCODE + "):</td>";
                        //htmlDiscount += "<td style=\"text-align:right;\">-" + FormatDecimal(orderDiscount) + "</td>";
                        //htmlDiscount += "</tr>";

                    }
                    else if (value.Type == "RewardInfo") {
                        rewardValue = FormatDecimal(value.USEDAMOUNT);
                        rewardPoints = value.POINTS.toString().replace("-", "");
                        //console.log("RewardInfo: " + value.POINTS);
                        //htmlRewards += " <tr>";
                        //htmlRewards += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Reward Points (" + value.POINTS.toString().replace("-", "") + "):</td>";
                        //htmlRewards += "<td  style=\"text-align:right;\">-" + FormatDecimal(value.USEDAMOUNT) + "</td>";
                        //htmlRewards += "</tr>";
                    }
                    else if (value.Type == "GiftCardInfo") {
                        giftCardValue = FormatDecimal(value.USEDVALUE);
                        giftCardCode = value.GIFTCARDCOUPONCODE.replace("-", "");
                        //console.log("GiftCardInfo: " + value.GIFTCARDCOUPONCODE);
                        //htmlGiftCard += "<tr>";
                        //htmlGiftCard += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Gift Card (" + value.GIFTCARDCOUPONCODE.replace("-", "") + "):</td>";
                        //htmlGiftCard += "<td  style=\"text-align:right;\">-" + FormatDecimal(value.USEDVALUE) + "</td>";
                        //htmlGiftCard += "</tr>";
                    }


                });

                var urlItem = global + "/GetCarryOutOrderItemDetails?orderid=" + id;
                $.getJSON(urlItem, function (data) {
                    //console.log("Histor: " + data);
                    if (data.indexOf("No record(s) found.") > -1) {
                        //$("#carryout #dvItem").html("No record(s) found.");

                    }
                    else {

                        $.each(JSON.parse(data), function (index, value) {

                            if (value.NOTES != "") {
                                //Print Item, Quantity, Price Start
                                if (showPriceInPrint) {
                                    //BTPrinter.printText(function (data) {
                                    //}, function (err) {
                                    //}, "\n" + "\x1b\x21\x10\x1b\x45\x01 " + value.QUANTITY + "X " + value.PRODUCT + "     " + FormatDecimal(value.TOTALPRICE) + " \x1b\x45\x00\x1b\x21\x00" + "\n");
                                    BTPrinter.printTextSizeAlign(function (data) {
                                    }, function (err) {
                                    }, "\n" + "\x1b\x32\x1b\x45\x01" + value.QUANTITY + "X " + value.PRODUCT + " " + FormatDecimal(value.TOTALPRICE) + "\x1b\x45\x00" + "\n", '30', '0');

                                }
                                else {
                                    //BTPrinter.printText(function (data) {
                                    //}, function (err) {
                                    //}, "\n" + "\x1b\x21\x10\x1b\x45\x01 " + value.QUANTITY + "X " + value.PRODUCT + " \x1b\x45\x00\x1b\x21\x00" + "\n");
                                    BTPrinter.printTextSizeAlign(function (data) {
                                    }, function (err) {
                                    }, "\n" + "\x1b\x32\x1b\x45\x01" + value.QUANTITY + "X " + value.PRODUCT + "\x1b\x45\x00" + "\n", '30', '0');
                                }
                                                                

                                value.NOTES = value.NOTES.replace("Special Instructions", "Notes");

                                var arrNotes = [];
                                if (value.NOTES.indexOf("<strong>") > -1) {
                                    arrNotes = value.NOTES.split('<strong>');
                                }
                                if (arrNotes.length > 1) {
                                    for (var i = 1; i < arrNotes.length; i++) {
                                        var notesValue = arrNotes[i];

                                        if (i == 1) {
                                            //html += "<tr><td colspan='4' style='padding:0 0 0 5px'> <i>" + notesValue.replace("</strong>", "") + "</i>  </td></tr>";
                                            notesValue = notesValue.replace("<i>", "");
                                            notesValue = notesValue.replace("</i>", "");
                                            notesValue = notesValue.replace("</strong>", "");
                                            //Print Order Notes 1 Start
                                            //BTPrinter.printTextSizeAlign(function (data) {
                                            //}, function (err) {
                                            //}, "\x1b\x32" + notesValue.replace("</strong>", "") + "\n", '20', '0');

                                            BTPrinter.printText(function (data) {
                                            }, function (err) {
                                            }, "\x1b\x32\x1b\x21\x31" + notesValue + "\n");

                                            //"\x1b\x30 " +

                                            //BTPrinter.printText(function (data) {
                                            //}, function (err) {
                                            //}, "\x1b\x21\x00\x1b\x50\x1b\x61\x00 " + notesValue.replace("</strong>", "") + "\n");//Font Size 8 + Left Align

                                            //alert("Print Item Notes");
                                            //Print Order Notes 1 Start
                                        }
                                        else {
                                            //html += "<tr><td colspan='4' style='padding:0 0 0 5px'> <i>" + notesValue.replace("</strong>", "") + "</i> </td></tr>";
                                            notesValue = notesValue.replace("<i>", "");
                                            notesValue = notesValue.replace("</i>", "");
                                            notesValue = notesValue.replace("</strong>", "");
                                            //Print Order Notes 1 Start
                                            //BTPrinter.printTextSizeAlign(function (data) {
                                            //}, function (err) {
                                            //}, "\x1b\x32" + notesValue.replace("</strong>", "") + "\n", '20', '0');

                                            BTPrinter.printText(function (data) {
                                            }, function (err) {
                                            }, "\x1b\x32\x1b\x21\x31" + notesValue + "\n");


                                            //"\x1b\x30 " + 

                                            //BTPrinter.printText(function (data) {
                                            //}, function (err) {
                                            //}, "\x1b\x21\x00\x1b\x50\x1b\x61\x00 " + notesValue.replace("</strong>", "") + "\n");//Font Size 8 + Left Align

                                            //alert("Print Item Notes");
                                            //Print Order Notes 1 Start
                                        }
                                    }
                                    //BTPrinter.printText(function (data) {
                                    //}, function (err) {
                                    //}, "\x1B\x32 \n");
                                }

                            }
                            else {

                                //Print Item, Quantity, Price Start
                                if (showPriceInPrint) {
                                    //BTPrinter.printText(function (data) {
                                    //}, function (err) {
                                    //}, "\n" + "\x1b\x21\x10\x1b\x45\x01 " + value.QUANTITY + "X " + value.PRODUCT + "     " + FormatDecimal(value.TOTALPRICE) + " \x1b\x45\x00\x1b\x21\x00" + "\n");
                                    BTPrinter.printTextSizeAlign(function (data) {
                                    }, function (err) {
                                    }, "\n" + "\x1b\x32\x1b\x45\x01" + value.QUANTITY + "X " + value.PRODUCT + " " + FormatDecimal(value.TOTALPRICE) + "\x1b\x45\x00" + "\n", '30', '0');

                                }
                                else {
                                    //BTPrinter.printText(function (data) {
                                    //}, function (err) {
                                    //}, "\n" + "\x1b\x21\x10\x1b\x45\x01 " + value.QUANTITY + "X " + value.PRODUCT + " \x1b\x45\x00\x1b\x21\x00" + "\n");
                                    BTPrinter.printTextSizeAlign(function (data) {
                                    }, function (err) {
                                    }, "\n" + "\x1b\x32\x1b\x45\x01" + value.QUANTITY + "X " + value.PRODUCT + "\x1b\x45\x00" + "\n", '30', '0');
                                }
                            }
                            
                            BTPrinter.printText(function (data) {
                            }, function (err) {
                            }, "--------------------------" + "\n");

                        });
                    }

                    if (showPriceInPrint) {
                        //htmlSubTotal = " <tr>";
                        //htmlSubTotal += "<td colspan=\"3\" style=\"text-align:right; font-weight: bold;\">Subtotal:</td>";
                        if (taxValue != "" && taxValue != "0.00") {
                            //htmlSubTotal += "<td style=\"text-align:right;\">" + subTotalWithoutTax + "</td>";
                            //Print Subtotal Start
                            //BTPrinter.printTextSizeAlign(function (data) {
                            //}, function (err) {
                            //}, "\n" + "Subtotal: " + subTotalWithoutTax + "\n", '20', '2');
                            BTPrinter.printText(function (data) {
                            }, function (err) {
                            }, "\n" + "\x1b\x21\x20\x1b\x50\x1b\x61\x02" + "Subtotal: " + subTotalWithoutTax + "\n");
                            //alert("Print Subtotal");
                            //Print Subtotal End
                        }
                        else {
                            //htmlSubTotal += "<td style=\"text-align:right;\">" + FormatDecimal(subtotalvalue) + "</td>";
                            //Print Subtotal Start
                            //BTPrinter.printTextSizeAlign(function (data) {
                            //}, function (err) {
                            //}, "\n" + "Subtotal: " + FormatDecimal(subtotalvalue) + "\n", '20', '2');
                            BTPrinter.printText(function (data) {
                            }, function (err) {
                            }, "\n" + "\x1b\x21\x20\x1b\x50\x1b\x61\x02" + "Subtotal: " + FormatDecimal(subtotalvalue) + "\n");
                            //alert("Print Subtotal");
                            //Print Subtotal End
                        }
                        //htmlSubTotal += "</tr>";

                        if (shippingValue != "" && shippingValue != "0.00") {
                            //Print Delivery Start
                            //BTPrinter.printTextSizeAlign(function (data) {
                            //}, function (err) {
                            //}, "Delivery: " + shippingValue + "\n", '20', '2');
                            BTPrinter.printText(function (data) {
                            }, function (err) {
                            }, "\x1b\x21\x20\x1b\x50\x1b\x61\x02" + "Delivery: " + shippingValue + "\n");
                            //alert("Print Delivery");
                            //Print Delivery End
                        }


                        if (taxValue != "" && taxValue != "0.00") {
                            //Print Tax Value Start
                            //BTPrinter.printTextSizeAlign(function (data) {
                            //}, function (err) {
                            //}, "Tax: " + taxValue + "\n", '20', '2');
                            BTPrinter.printText(function (data) {
                            }, function (err) {
                            }, "\x1b\x21\x20\x1b\x50\x1b\x61\x02" + "Tax: " + taxValue + "\n");
                            ///alert("Print Tax");
                            //Print Tax Value End

                        }

                        if (discountValue != "" && discountValue != "0.00") {
                            //Print Discount Value Start
                            //BTPrinter.printTextSizeAlign(function (data) {
                            //}, function (err) {
                            //}, "Coupon (" + couponCode + "): " + discountValue + "\n", '20', '2');
                            BTPrinter.printText(function (data) {
                            }, function (err) {
                            }, "\x1b\x21\x20\x1b\x50\x1b\x61\x02" + "Coupon (" + couponCode + "): " + discountValue + "\n");
                            //Print Discount Value End
                        }

                        if (rewardValue != "" && rewardValue != "0.00") {
                            //Print Reward Value Start
                            //BTPrinter.printTextSizeAlign(function (data) {
                            //}, function (err) {
                            //}, "Reward (" + rewardPoints + "): -" + rewardValue + "\n", '20', '2');
                            BTPrinter.printText(function (data) {
                            }, function (err) {
                            }, "\x1b\x21\x20\x1b\x50\x1b\x61\x02" + "Reward (" + rewardPoints + "): -" + rewardValue + "\n");
                            //Print Reward Value End
                        }

                        if (giftCardValue != "" && giftCardValue != "0.00") {
                            //Print Gift Card Value Start
                            //BTPrinter.printTextSizeAlign(function (data) {
                            //}, function (err) {
                            //}, "Gift Card (" + giftCardCode + "): -" + giftCardValue + "\n", '20', '2');
                            BTPrinter.printText(function (data) {
                            }, function (err) {
                            }, "\x1b\x21\x20\x1b\x50\x1b\x61\x02" + "Gift Card (" + giftCardCode + "): -" + giftCardValue + "\n");
                            //Print Gift Card Value End
                        }

                        if (tipValue != "" && tipValue != "0.00") {
                            //Print Tip Start
                            //BTPrinter.printTextSizeAlign(function (data) {
                            //}, function (err) {
                            //}, "Tip: " + tipValue + "\n", '20', '2');
                            BTPrinter.printText(function (data) {
                            }, function (err) {
                            }, "\x1b\x21\x20\x1b\x50\x1b\x61\x02" + "Tip: " + tipValue + "\n");
                            //alert("Print Tip");
                            //Print Tip End
                        }


                        if (refundValue != "" && refundValue != "0.00") {
                            BTPrinter.printText(function (data) {
                            }, function (err) {
                            }, "\x1b\x21\x20\x1b\x50\x1b\x61\x02\x1b\x45\x01" + "Total: " + grandTotalvalue + "\x1b\x45\x00\n\n\n");
                            //BTPrinter.printTextSizeAlign(function (data) {
                            //}, function (err) {
                            //}, "\n" + "\x1b\x21\x20\x1b\x45\x01" + "Total: " + grandTotalvalue + "\x1b\x45\x00" + "\n", '20', '2');
                            //alert("Print Total");

                            //BTPrinter.printTextSizeAlign(function (data) {
                            //}, function (err) {
                            //}, "Refund: " + refundValue + "\n\n\n", '20', '2');
                            BTPrinter.printText(function (data) {
                            }, function (err) {
                            }, "\x1b\x21\x20\x1b\x50\x1b\x61\x02 " + "Refund: " + refundValue + "\n\n\n");
                            //alert("Print Refund");
                        }
                        else {
                            BTPrinter.printText(function (data) {
                            }, function (err) {
                            }, "\x1b\x21\x20\x1b\x50\x1b\x61\x02\x1b\x45\x01" + "Total: " + grandTotalvalue + "\x1b\x45\x00\n\n\n");
                            //BTPrinter.printTextSizeAlign(function (data) {
                            //}, function (err) {
                            //}, "\n" + "\x1b\x45\x01" + "Total: " + grandTotalvalue + "\x1b\x45\x00" + "\n\n\n", '20', '2');
                            //alert("Print Total");
                        }
                    }

                }); //-- End Inner Grid


            });//--End
            

            setTimeout(function () {
                
            BTPrinter.printText(function (data) {
                }, function (err) {
                }, "\x1d\x56\x41\x0A" + "\n");//Auto Cut Paper

                BTPrinter.printText(function (data) {
                }, function (err) {
                }, "\x1b\x40" + "\n");//Clear Buffer

                BTPrinter.printText(function (data) {
                    BTPrinter.disconnect(function (data) {
                        $('#btnPrintOrder').text("PRINT");
                        //alert("Disconnect");
                        console.log(data)
                    }, function (err) {
                        //alert("Disconnect Error");
                        $('#btnPrintOrder').text("PRINT");
                        console.log(err)
                    }, printerName);//TCKP302-UB//TM-m30_003646
                }, function (err) {
                    $('#btnPrintOrder').text("PRINT");
                    //alert("Print Error: " + err);
                }, "");
            }, 4000);

        }, function (err) {
            $('#btnPrintOrder').text("PRINT");
            alert("Cannot connect to Printer " + printerName + ".");
        }, printerName);//TCKP302-UB//TM-m30_003646

    }
}
//Print Order End





