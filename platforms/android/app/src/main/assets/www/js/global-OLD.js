


function InitLogin() {
    console.log('Init Login');
    var mydate = new Date()
    var year = mydate.getYear()
    if (year < 1000)
        year += 1900
    $("#footerYear").html(year);
}


