// ==UserScript==
// @name            RGSC-GTAO Discover True Awards Progress Value
// @author          PLTytus
// @version         1.1.0
// @namespace       http://gtaweb.eu/tampermonkey
// @downloadURL     https://github.com/PLTytus/tampermonkey-rgsc-gtao-discover-true-awards-progress-value/raw/master/rgsc-gtao-discover-true-awards-progress-value.user.js
// @updateURL       https://github.com/PLTytus/tampermonkey-rgsc-gtao-discover-true-awards-progress-value/raw/master/rgsc-gtao-discover-true-awards-progress-value.user.js
// @match           https://socialclub.rockstargames.com/games/gtav/pc/career/awards
// @match           https://socialclub.rockstargames.com/games/gtav/pc/career/awards/*
// ==/UserScript==

(function() {
    'use strict';

    let number_format = (number, decimals, dec_point, thousands_sep) => {
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
        let n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function(n, prec){
                let k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if(s[0].length > 3){
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if((s[1] || '').length < prec){
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    };

    let createAlternativeLayout = () => {
        let elements = [], i = -2, j = -1;
        document.querySelectorAll("p.awardsAchieved, ul.awardsList").forEach(x => {
            elements[x.tagName === "P" ? i += 2 : j += 2] = x.outerHTML;
        });
        let result = document.createElement("div");
        result.classList.add("clearfix");
        result.innerHTML = elements.join("");
        result.style.display = 'none';
        result.id = "tt-awards-alternative-layout";
        document.querySelector("#page-header .page-section").append(result);
        let option = document.createElement("option");
        option.value = "alternative-layout";
        option.innerHTML = "ALL REWARDS";
        document.querySelector(".awards-dropdown").prepend(option);
        document.querySelector(".awards-dropdown").onchange = (e) => {
            document.querySelectorAll("#tt-awards-alternative-layout, #tt-awards-alternative-layout > *").forEach(x => {
                x.style.display = e.target.value === "alternative-layout" ? "block" : "none";
            });
        };
    };

    let interval = setInterval(() => {
        let awards = document.querySelectorAll(".gtavContentArea");

        if(awards.length){
            awards.forEach(award => {
                let info = document.createElement("div");
                info.innerText = `${number_format(award.dataset.value, 0, ',', '.')} / ${number_format(award.dataset.target, 0, ',', '.')}`;
                info.style.position = 'absolute';
                info.style.top = '3px';
                info.style.left = '3px';
                info.style.borderWidth = "2px";
                info.style.borderStyle = "solid";
                info.style.borderColor = "#282828";
                info.style.padding = "2px";
                info.style.backgroundColor = "#121212";
                award.style.position = 'relative';
                award.append(info);
            });

            createAlternativeLayout();

            clearInterval(interval);
        }
    }, 1000);
})();