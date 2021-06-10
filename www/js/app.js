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
            //else if (giftCardsEnabled != "" && giftCardsEnabled == "True") {
            else if (giftCardProgramEnabled != "" && giftCardProgramEnabled == "True") {
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
            setTimeout(function () {
                PrintCarryoutDetails();
            }, 50);            
        });

        $$('#btnPrintCancelOrder').on('click', function () {
            $(this).text("Printing...");
            setTimeout(function () {
                PrintCarryoutDetails();
            }, 50);
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
        
        //Session Filter Start
        var sessionFilterName = localStorage.getItem("ItemFilterName");
        var sessionFilterCategory = localStorage.getItem("ItemFilterCategory");
        var sessionFilterStatus = localStorage.getItem("ItemFilterStatus");
        var sessionFilterSort = localStorage.getItem("ItemFilterSort");
        var sessionFilterSortBy = localStorage.getItem("ItemFilterSortBy");
        
        if (sessionFilterName != null && sessionFilterName != "")
        {
            $$("#txtFilterItemName").val(sessionFilterName);
        }
        if (sessionFilterCategory != null && sessionFilterCategory != "") {
            $$("#filterProductCategory").val(sessionFilterCategory);
        }
        if (sessionFilterStatus != null && sessionFilterStatus != "") {
            $$("#ddlFilterItemStatus").val(sessionFilterStatus);
        }
        if (sessionFilterSort != null && sessionFilterSort != "") {
            $$("input[name='radioItemSort']:checked").val(sessionFilterSort);
        }
        if (sessionFilterSortBy != null && sessionFilterSortBy != "") {
            $$("input[name='radioItemSortBy']:checked").val(sessionFilterSortBy);
        }

        //Session Filter End
        
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
        //if (giftCardsEnabled != "" && giftCardsEnabled == "True") {
        if (giftCardProgramEnabled != "" && giftCardProgramEnabled == "True") {

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
            ////LoadNewGiftCard();
            var IsValidEmployeePIN = $('#hdnIsValidEmployeePIN').val();
            if (IsValidEmployeePIN == "false")
            {
                ShowEmployeePINPopup();
            }
            else {
                LoadNewGiftCard();
            }
            
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

            var IsValidEmployeePIN = $('#hdnIsValidEmployeePIN').val();
            if (IsValidEmployeePIN == "false") {
                ShowEmployeePINPopupLoad();
            }
            else {
                LoadGiftCard();
            }            
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
            if (data.message == "New Order") {
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
            }
            else if (data.message == "Device Ping") {
                localStorage.setItem("PushNotification", "Order accepted");
                myMedia = new Media(src, onSuccess, onError, onStatus);
                $('#myDiv').html('<div class="block">' +
                    '<a href="#" class="link popup-close modal-accept-button" onclick="StopSound();" style=\"top: 40% !important; height: 205px; \">Device Ping</a>' +
                    '<div class="overlay-button-area" id="dvPopOrders" style=\"top: 30px !important;\">' +
                    '</div>' +
                    '</div>');
                $('#myDiv').show();
            }
            else {
                var arrMessage = data.message.split('(Order #');
                var orderId = arrMessage[1].split(')')[0];
                localStorage.setItem("PushNotification", "Order placed");
                ////localStorage.setItem("PushNotification", data.message);
                myMedia = new Media(src, onSuccess, onError, onStatus);
                //CheckNewOrder();
                $('#myDiv').html('<div class="block">' +
                    '<a href="#" class="link popup-close modal-curbside-button"  id="btnAcknowledgement" onclick="StopSoundAndSendCurbsideMessage(' + orderId + ');" style=\"top: 40% !important; height: 205px; font-size:35px;\">' + data.message + '</a>' +
                    '<div class="overlay-button-area" id="dvPopOrders" style=\"top: 30px !important;\">' +
                    '</div>' +
                    '</div>');
                $('#myDiv').show();
            }            

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

function StopSoundAndSendCurbsideMessage(orderId) {
    var customerPhone = $('#hdnSelectedOrderPhone_' + orderId).val();
    var restaurantDisplayName = "";
    if (window.localStorage.getItem("RestaurantName") != null)
        restaurantDisplayName = window.localStorage.getItem("RestaurantName").trim();
    //alert(orderId + " - " + customerPhone + " - " + restaurantDisplayName);
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

    StopSoundAndCurbsideMessageSend(storeId, orderId, customerPhone);//Stop Other Device Sound    
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

function StopSoundAndCurbsideMessageSend(storeId,orderId,customerPhone) {
    var regId = localStorage.getItem('registrationId');
    var restaurantDisplayName = "";
    if (window.localStorage.getItem("RestaurantName") != null)
        restaurantDisplayName = window.localStorage.getItem("RestaurantName").trim();
    $.ajax({
        url: global + 'StopSoundAndSendCurbsideMessage',
        //url: global + 'StopSoundInAllDevices',
        type: 'GET',
        data: {
            storeId: storeId,
            currentDeviceId: deviceUUID,
            orderId: orderId,
            customerPhone: customerPhone,
            restaurantDisplayName: restaurantDisplayName
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
    $('#btnPrintOrder').text("Printing...");
    $('#btnPrintCancelOrder').text("Printing...");
    var id = $("#carryout #dvCarryOutDetailsInner #hdnSelectedOrderId").val();
    //alert("ID: " + id);

    var storeId = SetStoreId();
    var paymentMethod = "";
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

                var finalOrderTotal = "0.00";
                var convenienceFee = "0.00";

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


                        //Logo Start
                        BTPrinter.printBase64(function (data) {
                            console.log("Success");
                            console.log(data);
                        }, function (err) {
                            console.log("Error");
                            console.log(err);
                        }, "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", '1');//base64 string, align

                        //Logo End

                        //Default Tab(\x1b\x44\x00)
                        BTPrinter.printText(function (data) {
                        }, function (err) {
                        }, "\x1b\x6b\x01\x1b\x6c\x01\x1b\x67\x1b\x32" + "\n");// Font + Margin + CPI + Line Spacing(1/8)

                        //BTPrinter.printText(function (data) {
                        //}, function (err) {
                        //}, "\x1b\x21\x20\x1b\x61\x00 " + ordertype + "    #" + orderId + "\n");

                        BTPrinter.printTextSizeAlign(function (data) {
                        }, function (err) {
                        }, ordertype + "   #" + orderId + "\n", '30', '1');

                        if (value.CREATEDONUTC != null && value.CREATEDONUTC != undefined) {
                            var arrDateTime = value.CREATEDONUTC.split('~');
                            orderDate = arrDateTime[0];
                            orderTime = arrDateTime[1];
                        }

                        BTPrinter.printText(function (data) {
                        }, function (err) {
                        }, "\x1b\x21\x31\x1b\x61\x01" + orderDate + "\n");
                        //BTPrinter.printTextSizeAlign(function (data) {
                        //}, function (err) {
                        //}, orderDate + "\n", '10', '1');//20

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

                                if (pickupTimeOnly.charAt(0) === '0') {
                                    pickupTimeOnly = pickupTimeOnly.substr(1);
                                }

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

                        if (value.ServiceFee != undefined && Number(value.ServiceFee) > 0) {
                            convenienceFee = FormatDecimal(value.ServiceFee);
                        }

                        if (value.FINALORDERTOTAL != undefined && Number(value.FINALORDERTOTAL)) {
                            finalOrderTotal = FormatDecimal(value.FINALORDERTOTAL);
                        }

                        if (value.PAYMENTMETHOD != "" && value.PAYMENTMETHOD != undefined) {
                            paymentMethod = value.PAYMENTMETHOD;
                        }
                        if (paymentMethod != "") {
                            if (paymentMethod == "Cash On Delivery") {
                                paymentMethod = "Pay on Pickup";
                            }
                            else {
                                paymentMethod = "Paid";
                            }
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
                                            ////notesValue = notesValue.replace("<i>", "");
                                            ////notesValue = notesValue.replace("</i>", "");
                                            ////notesValue = notesValue.replace("</strong>", "");
                                            notesValue = notesValue.replace(/<i>[\s\S]*?<\/i>/, ' ');
                                            notesValue = notesValue.replace("</strong>:", "-");
                                            notesValue = notesValue.replace("</strong>", "");
                                            notesValue = notesValue.replace(", ", "\n - ");
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
                                            ////notesValue = notesValue.replace("<i>", "");
                                            ////notesValue = notesValue.replace("</i>", "");
                                            ////notesValue = notesValue.replace("</strong>", "");
                                            notesValue = notesValue.replace(/<i>[\s\S]*?<\/i>/, ' ');
                                            notesValue = notesValue.replace("</strong>:", "-");
                                            notesValue = notesValue.replace("</strong>", "");
                                            notesValue = notesValue.replace(", ", "\n - ");
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
                            }, "\n" + "\x1b\x6b\x01\x1b\x21\x31\x1b\x50\x1b\x61\x02" + "Subtotal: " + subTotalWithoutTax + "\n");
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
                            }, "\n" + "\x1b\x6b\x01\x1b\x21\x31\x1b\x50\x1b\x61\x02" + "Subtotal: " + FormatDecimal(subtotalvalue) + "\n");
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
                            }, "\x1b\x6b\x01\x1b\x21\x31\x1b\x50\x1b\x61\x02" + "Delivery: " + shippingValue + "\n");
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
                            }, "\x1b\x6b\x01\x1b\x21\x31\x1b\x50\x1b\x61\x02" + "Tax: " + taxValue + "\n");
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
                            }, "\x1b\x6b\x01\x1b\x21\x31\x1b\x50\x1b\x61\x02" + "Coupon (" + couponCode + "): " + discountValue + "\n");
                            //Print Discount Value End
                        }

                        if (rewardValue != "" && rewardValue != "0.00") {
                            //Print Reward Value Start
                            //BTPrinter.printTextSizeAlign(function (data) {
                            //}, function (err) {
                            //}, "Reward (" + rewardPoints + "): -" + rewardValue + "\n", '20', '2');
                            BTPrinter.printText(function (data) {
                            }, function (err) {
                            }, "\x1b\x6b\x01\x1b\x21\x31\x1b\x50\x1b\x61\x02" + "Reward (" + rewardPoints + "): -" + rewardValue + "\n");
                            //Print Reward Value End
                        }

                        if (giftCardValue != "" && giftCardValue != "0.00") {
                            //Print Gift Card Value Start
                            //BTPrinter.printTextSizeAlign(function (data) {
                            //}, function (err) {
                            //}, "Gift Card (" + giftCardCode + "): -" + giftCardValue + "\n", '20', '2');
                            BTPrinter.printText(function (data) {
                            }, function (err) {
                            }, "\x1b\x6b\x01\x1b\x21\x31\x1b\x50\x1b\x61\x02" + "Gift Card (" + giftCardCode + "): -" + giftCardValue + "\n");
                            //Print Gift Card Value End
                        }

                        if (tipValue != "" && tipValue != "0.00") {
                            //Print Tip Start
                            //BTPrinter.printTextSizeAlign(function (data) {
                            //}, function (err) {
                            //}, "Tip: " + tipValue + "\n", '20', '2');
                            BTPrinter.printText(function (data) {
                            }, function (err) {
                            }, "\x1b\x6b\x01\x1b\x21\x31\x1b\x50\x1b\x61\x02" + "Tip: " + tipValue + "\n");
                            //alert("Print Tip");
                            //Print Tip End
                        }

                        if (convenienceFee != "" && convenienceFee != "0.00") {
                            //Print Convenience Fee Start
                            BTPrinter.printText(function (data) {
                            }, function (err) {
                                }, "\x1b\x6b\x01\x1b\x21\x31\x1b\x50\x1b\x61\x02" + "Convenience Fee: " + convenienceFee + "\n");
                            //alert("Print Tip");
                            //Print Convenience Fee End
                        }




                        //Order Refund and Add. Charge Section Start
                        var urlOrderAdjustment = global + "/GetCarryoutOrderAdjustments?orderid=" + id;
                        $.getJSON(urlOrderAdjustment, function (data) {
                            if (data.indexOf("No record(s) found.") > -1) {
                                BTPrinter.printText(function (data) {
                                }, function (err) {
                                }, "\x1b\x6b\x01\x1b\x21\x31\x1b\x50\x1b\x61\x02\x1b\x45\x01" + "Total: " + grandTotalvalue + "\x1b\x45\x00\n\n\n");
                                //BTPrinter.printTextSizeAlign(function (data) {
                                //}, function (err) {
                                //}, "\n" + "\x1b\x45\x01" + "Total: " + grandTotalvalue + "\x1b\x45\x00" + "\n\n\n", '20', '2');
                            }
                            else {
                                BTPrinter.printText(function (data) {
                                }, function (err) {
                                }, "\x1b\x6b\x01\x1b\x21\x31\x1b\x50\x1b\x61\x02\x1b\x45\x01" + "Total: " + grandTotalvalue + "\x1b\x45\x00\n");
                                //BTPrinter.printTextSizeAlign(function (data) {
                                //}, function (err) {
                                //}, "\n" + "\x1b\x45\x01" + "Total: " + grandTotalvalue + "\x1b\x45\x00" + "\n\n\n", '20', '2');

                                $.each(JSON.parse(data), function (index, value) {
                                    var adjustmentType = "";
                                    var adjustmentNotes = "";
                                    var adjustmentAmont = "";
                                    if (value.Type != "") {
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

                                    BTPrinter.printText(function (data) {
                                    }, function (err) {
                                    }, "\x1b\x6b\x01\x1b\x21\x31\x1b\x50\x1b\x61\x02" + "" + adjustmentType + ": " + adjustmentAmont + "\n");

                                    if (adjustmentNotes != "") {
                                        BTPrinter.printText(function (data) {
                                        }, function (err) {
                                        }, "\x1b\x6b\x01\x1b\x21\x31\x1b\x50\x1b\x61\x02" + "(" + adjustmentNotes + ")\n");
                                    }

                                });

                                BTPrinter.printText(function (data) {
                                }, function (err) {
                                }, "\x1b\x6b\x01\x1b\x21\x31\x1b\x50\x1b\x61\x02\x1b\x45\x01" + "Final Amount: " + finalOrderTotal + "\x1b\x45\x00\n\n\n");
                            }
                        });
                        //Order Refund and Add. Charge Section End

                    }

                }); //-- End Inner Grid


            });//--End


            setTimeout(function () {
                //Print Payment Type Start
                BTPrinter.printTextSizeAlign(function (data) {
                }, function (err) {
                }, paymentMethod + "\n", '30', '1');//20
                //Print Payment Type End

                BTPrinter.printText(function (data) {
                }, function (err) {
                }, "\x1d\x56\x41\x0A" + "\n");//Auto Cut Paper

                BTPrinter.printText(function (data) {
                }, function (err) {
                }, "\x1b\x40" + "\n");//Clear Buffer

                BTPrinter.printText(function (data) {
                    BTPrinter.disconnect(function (data) {
                        $('#btnPrintOrder').text("PRINT");
                        $('#btnPrintCancelOrder').text("PRINT");
                        //alert("Disconnect");
                        console.log(data)
                    }, function (err) {
                        //alert("Disconnect Error");
                        $('#btnPrintOrder').text("PRINT");
                        $('#btnPrintCancelOrder').text("PRINT");
                        console.log(err)
                    }, printerName);//TCKP302-UB//TM-m30_003646
                }, function (err) {
                    $('#btnPrintOrder').text("PRINT");
                    $('#btnPrintCancelOrder').text("PRINT");
                    //alert("Print Error: " + err);
                }, "");
            }, 4100);

        }, function (err) {
            $('#btnPrintOrder').text("PRINT");
            $('#btnPrintCancelOrder').text("PRINT");
            alert("Cannot connect to Printer " + printerName + ".");
        }, printerName);//TCKP302-UB//TM-m30_003646

        //ChangePopupOrderStatusDropdown('Processing', id, storeId);
        UpdateStatusButtonHtml();
    }
}

function UpdateStatusButtonHtml() {
    var storeId = SetStoreId();
    var orderId = $("#carryout #dvCarryOutDetailsInner #hdnSelectedOrderId").val();
    var iconHTML = "";
    var iconHTML1 = "";
    var upperButtonHtml = "";
    var sendSmsButtonHtml = $('#aPopupSMS_' + orderId).parent('div').html();

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
    //upperButtonHtml += "<a id=\"aPopupSMS_" + orderId + "\" class=\"custom-btn-two custom-bg custom-link item-media-section-two\" style=\"background:#303030 !important;\" onclick=\"ConfirmationPickUpSMSSend(" + orderId + ",'" + orderPhone + "','Popup','$0.00')\">Send SMS</a>";
    upperButtonHtml += sendSmsButtonHtml;
    upperButtonHtml += "</div>";

    upperButtonHtml += "</div>"

    $("#divUpperButtonArea").html(upperButtonHtml);
    $("#li_" + orderId).css("border-left", "#2cbcf2 10px solid");

    $("#carryout #carryoutpopstatus_" + orderId).html(iconHTML);
    $("#carryout #carryoutstatus_" + orderId).html(iconHTML1);
}
//Print Order End

        
//Ping Device Start
function PingDevice() {
    localStorage.setItem("PushNotification", "Order placed");
    ////localStorage.setItem("PushNotification", data.message);
    myMedia = new Media(src, onSuccess, onError, onStatus);
    //CheckNewOrder();
    $('#myDiv').html('<div class="block">' +
        '<a href="#" class="link popup-close modal-accept-button"  id="btnAcknowledgement" onclick="StopSoundAndRefreshCarryout();" style=\"top: 40% !important; height: 205px; font-size:35px;\">Device Ping</a>' +
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
//Ping Device End




