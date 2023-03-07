(function () {
    function recalc() {
        var clientWidth = document.documentElement.clientWidth;
        if (!clientWidth) return;
        document.documentElement.style.fontSize = 10 * (clientWidth / 750) + 'px';
    }
    if (!document.addEventListener) return;
    window.addEventListener('resize', recalc, false);
    document.addEventListener('DOMContentLoaded', recalc, false);
})()
