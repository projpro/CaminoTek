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
            var dataPrint = "data:image/png;base64,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ijA8ZForAgkoghWBg6IuiYAIiIAImCJYOgiimoAEK6qHT50XAREQgTRLQIKVZoc2feyYBCt9jLP2UgREQASijYAEK9pGTP2NRUCCpQNCBERABEQgEglIsCJxVNSnsAlIsMJGpRVFQAREQARSkIAEKwVha1PJT0CClfxM1aIIiIAIiEDSCUiwks5QLaQiAQlWKsLXpkVABERABBIkIMHSwRHVBCRYUT186rwIiIAIpFkCEqw0O7TpY8ckWOljnLWXIiACIhBtBCRY0TZi6m8sAhIsHRAiIAIiIAKRSECCFYmjoj6FTUCCFTYqrSgCIiACIpCCBCRYKQhbm0p+AhKs5GeqFkVABERABJJOQIKVdIZqIRUJSLBSEb42LQIiIAIikCABCZYOjqgmIMGK6uFT50VABEQgzRKQYKXZoU0fOybBSh/jrL0UAREQgWgjIMGKthFTf2MRkGDpgBABERABEYhEAhKsSBwV9SlsAhKssFGlrxX37NljgwYNsg8++MCeffZZa968efoCoL1NVgInTpyw77//3ubPn29t27a13LlzJ2v7aix8AlE0FhKs8IdVa0YggXgF6+TJkyt27NhRcezYsTZ16lTbvn27VahQwZo0aWK33nqrnX/++RG4K/F3ib6/+eab9t577/kK2bNn9325++677c4777Q8efIkaV8OHTpkK1eutP/+979WrVo1y5w5c6Lbo43x48fbM888E/Nd+lWrVi1r2rSp1a1b17JkyZLodpPyBQlWUugl33f//PNPF5MJEybYlVdeGXWi+9dff9kvv/xiEydOtDFjxtimTZusaNGidtttt1mHDh0sf/78fv6MGjXKFixYYL/99ps1aNDA2rRpY9dee62dc845dvjwYZs1a5b16dPHduzY4edu+/btrWTJkvGC/vXXX23SpEne5h9//GEtWrRwqStQoICvf7rPk2/0IqulKBwLCVZkHULqTSIJxCtYmzZtWtG/f/+KSAkXsXz58vlFrly5cvb8889HpWBNnz7dypYtaxkzZrStW7cad3EdO3a0zp07W7Zs2RKJ7X+rnzx50tasWeORnksvvdQ6dep0RiIUCNZLL73kvAsWLGj8bf369f7/+Ttim5KLBCslace/rWPHjtmSJUtcTPLmzWtXXXVV1AkWx/Fnn31my5cv9xuG1atX23333WeZMmXymx0+X7p0qV9T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eLFPpEk0C8kIjSohe0yl8Oabb8bAJ0356quvejE8qbc+ffp4BAhZo5+k/khdkmJj+gb+jcQF4kabH3zwgU+iilCSYiRiRVSL9GcgRbSJGHXr1u1vU0MgRUTCYEN/KNIncke6kMgdohmkBKnFQugoXkf0iAgG27nhhhucEdtC0AoXLuxpRGQP2VSBe1Sfc+q8CIhAeAQkWOFx0loRSiAswTpV34lmBVMLKLISoaOsbomACIhA9BGQYEXfmKnHIQSSLFihUwsosqJjSwREQAREIJkISLCSCaSaSR0CSRKsoKic6RJI852qMD11dk9bFQEREAERiFICEqwoHTh1+38EkiRYgigCIiACIiACZ4mABOssgVWzKUNAgpUynLUVERABERCBxBGQYCWOl9aOMAISrAgbEHVHBERABETACUiwdCBENQEJVlQPnzovAiIgAmmWgAQrzQ5t+tgxCVb6GGftpQiIgAhEGwEJVrSNmPobi4AESweECIiACIhAJBKQYEXiqKhPYROQYIWNSiuKgAiIgAikIAEJVgrC1qaSn4AEK/mZqkUREAEREIGkE5BgJZ2hWkhFAhKsVISvTYuACIiACCRIQIKlgyOqCUiwonr41HkREAERSLMEJFhpdmjTx45JsNLHOGsvRUAERCDaCEiwom3E1N9YBCRYOiBEQAREQAQikYAEKxJHRX0Km8D/A6FXb8IGFdyiAAAAAElFTkSuQmCC";
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








