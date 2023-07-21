
const SCROLL_VALUE_EVENT8= 53; // Scrolling value for triggering event8, which indicates user's engagement
const VIEW_TIME_EVENT8 = 65; // View time value for triggering event 8, which helps to filter pseudo-engagement


var wrapUrlWithClickId=(function(){"use strict";function n(n,r){var e;void 0===r&&(r="uclick");var u=null===(e=n.match(/\?.+?$/))||void 0===e?void 0:e[0];return u?Array.from(u.matchAll(new RegExp("[?&](clickid|"+r+")=([^=&]*)","g"))).map((function(n){return{name:n[1],value:n[2]}})):[]}function r(n){var r=n();return 0===r.length?{}:r.reduce((function(n,r){var e;return Object.assign(n,((e={})[r.name]=""+r.value,e))}),{})}function e(e){void 0===e&&(e="uclick");var u,i,t=r((function(){return(function(n){return void 0===n&&(n="uclick"),Array.from(document.cookie.matchAll(new RegExp("(?:^|; )(clickid|"+n+")=([^;]*)","g"))).map((function(n){return{name:n[1],value:n[2]}}))})(e)})),c=r((function(){return n(document.referrer,e)})),a=r((function(){return n(document.location.search,e)}));return(u=[e,"clickid"],i=[t,c,a],u.reduce((function(n,r){return n.concat(i.map((function(n){return[r,n]})))}),[])).map((function(n){return{name:n[0],value:n[1][n[0]]}})).find((function(n){return n.value}))||null}function u(n,r,e){var u=n.replace(new RegExp(r+"=[^=&]*","g"),r+"="+e);return-1!==u.indexOf(r)?u:(function(n,r,e){var u=n.trim(),i=r+"="+e;return-1===u.indexOf("?")?u+"?"+i:u.endsWith("?")?""+u+i:u+"&"+i})(n,r,e)}return function(n,r){void 0===r&&(r="uclick");var i=e(r);return null===i?n:n.includes("cnv_id")?i.name===r?u(n,i.name,i.value):i.value?u(n,"cnv_id",i.value):n:u(n,i.name,i.value)}})();
var img = null;

var click_time = Date.now();
var timedelta = 0;
var sentP = 0; // for scrollPusher
var DOMAIN = window.location.hostname;
var event_sent = false;

console.log('behaviour.js initiated - v. 1.2b')
//console.log('init ok')

function pushEvent(event, value){
    if (img != null) {
        img.remove();
    }
    var img = document.createElement('img');
    img.src = wrapUrlWithClickId('https://' + DOMAIN + '/click.php?'+ event +'=' + value );
    img.referrerPolicy = 'no-referrer-when-downgrade';
    img.style.display = 'none';
    document.body.appendChild(img);
    //console.log('PushEvent ok')
}

function pushAddEvent(event, value){
    if (img != null) {
        img.remove();
    }
    var img = document.createElement('img');
    img.src = wrapUrlWithClickId('https://' + DOMAIN + '/click.php?add_'+ event +'=' + value );
    img.referrerPolicy = 'no-referrer-when-downgrade';
    img.style.display = 'none';
    document.body.appendChild(img);
    //console.log('PushEvent ok')
}


//deprecated
function viewTimePusher(interval){
    setInterval(function(){ 
        timedelta = Math.floor( (Date.now() - click_time) / 1000);
        //console.log('timedelta ' + timedelta);
        pushEvent('event6', timedelta);
    }, interval*1000)
}

function viewTimeAddPusher(interval){
    setInterval(function(){ 
        timedelta = Math.floor( (Date.now() - click_time) / 1000);
        //console.log('interval ' + interval);
        pushAddEvent('event6', interval);
    }, interval*1000)
}

function scrollPercentPusher(minChange, timeout){
    
    function updateEvent(new_value) {
        //console.log('sentP: '+sentP);
        //console.log('new_value: '+new_value);
        if (new_value-sentP>2){
            sentP = new_value;
            //console.log(sentP>100?100:Math.floor(sentP))
            pushEvent('event7', sentP>100?100:Math.floor(sentP));
            //console.log('sentP ' + sentP>100?100:Math.floor(sentP));
            setTimeout(timeout);
        }
        if ((new_value >= SCROLL_VALUE_EVENT8) && (timedelta > VIEW_TIME_EVENT8) && (event_sent == false)){
            pushEvent('event8', 1);
            event_sent = true;
        }
    }

    window.addEventListener('scroll', function(e) {
        scrollpercent = window.pageYOffset/(document.body.scrollHeight-window.screen.height)*100;(updateEvent(scrollpercent))});
}



var VIEW_TIME_PUSH_INTERVAL = 10;
var SCROLL_PERCENT_INTERVAL = 5;
var SCROLL_PERCENT_TIMEOUT = 2000;


viewTimeAddPusher(VIEW_TIME_PUSH_INTERVAL);
scrollPercentPusher(SCROLL_PERCENT_INTERVAL, SCROLL_PERCENT_TIMEOUT);