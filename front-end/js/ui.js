﻿$(document).ready(function () {
    footer();
});
$(window).resize(function () {
    footer();
});
function footer () {
    if ($(window).height() > $('.container-fluid').height()) {
        $('footer').css('position', 'fixed');
        $('footer').css('bottom', '0');
    }
    else {
        $('footer').css('position', 'relative');
    }
}