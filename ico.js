//polyfill legacy code
jQuery.fn.load = function (callback) { $(window).on("load", callback) };

// Toggle search box
var Version = 1087609181;
$("#toggle-siteheader-search").on("click", function (event) {
    event.preventDefault();
    $("#siteheader-search").slideToggle("fast");
    $(this).children(".icon-close").toggle();
    $(this).children(".icon-search").toggle();
});

// Multi-page search validation
if ($('#toc-search').length > 0) {
    var tocSearch = document.getElementById("toc-search");

    tocSearch.addEventListener('keydown', function (event) {
        const key = event.key;

        var searchKey = key;

        if (!searchKey.match("^[A-Za-z0-9 ]+$")) {
            event.preventDefault();
        }
    });
    tocSearch.addEventListener("paste", function (event) {
        var paste = (event.clipboardData || window.clipboardData).getData('text');

        const value = paste;
        var searchQuery = value;

        if (!searchQuery.match("^[A-Za-z0-9 ]+$")) {
            event.preventDefault();
        }
    });
}


// Multi-page search
$('#toc-search-button').on('click keypress', function () {

    $('#toc-search-button-icon').hide();

    $('.toc-search-result').remove();
    $('.filter-count').remove();
    $('.toc-search-keyword').css('background', 'inherit');
    $('.toc-search-keyword').css('color', 'inherit');
    $('.toc-search-keyword').css('padding', '0');

    $('#toc-search-progress-icon').show();

    $('#toc-search-status').text('Loading...');
    $('#toc-search-status').attr('aria-atomic', 'true');
    $('#toc-search-status').attr('aria-live', 'assertive');

});

$('#toc-search-reset').on("click", function () {
    $('.toc-search-result').remove();
    $('.filter-count').remove();
    $('.toc-search-keyword').css('background', 'inherit');
    $('.toc-search-keyword').css('color', 'inherit');
    $('.toc-search-keyword').css('padding', '0');
});

// Header responsive nav

var navigation = responsiveNav(".container-navigation", {
    insert: "before"
});

// Download 

$("#toggle-hiddenpanel-download").on("click", function (event) {
    event.preventDefault();
    $("#hiddenpanel-download").slideToggle("fast");
});

// Toggle footer social links

$("#toggle-hiddenpanel-share").on("click", function (event) {
    event.preventDefault();
    $("#hiddenpanel-share").slideToggle("fast");
});

// Toggle header social links ArticlePage, NewsPage
$("#toggle-hiddenpanel-headershare").on("click", function (event) {
    event.preventDefault();
    $("#hiddenpanel-headershare").slideToggle("fast");
});

//Toggle the display of the brose aloud panel.
$(".toggle-browse-aloud").on("click", function (event) {
    event.preventDefault();
    if (typeof (BrowseAloud) != "undefined") {
        // v2 (IE)
        if (BrowseAloud.analytics) {
            BrowseAloud.no_analytics = { gaTrackEvent: function () { } };
            BrowseAloud.org_analytics = BrowseAloud.analytics;
            BrowseAloud.analytics = BrowseAloud.no_analytics;
        }
        // v3
        if (BrowseAloud.enableBrowsealoudCookies) {
            BrowseAloud.enableBrowsealoudCookies();
        }
        if (BrowseAloud.disableBrowsealoudAnalytics) {
            BrowseAloud.disableBrowsealoudAnalytics();
        }
        // Launch
        BrowseAloud.panel.toggleBar(true, event);
    }
    return false;
});


// Anchor scroll

$(function () {
    var selector = "a[href*='#']:not([href='#'])";
    $(selector).on("click", function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 500);
            }
        }
    });

    $('.lc-anchor').on("click", function (e) {
        e.preventDefault();
        if ($(".wc-initiating:visible").length > 0) {
            $("input[name='wc-name-input']").focus();
        } else {
            $(".wc-message").last().focus();
        }
    });
});

// Show video modal

$(".modal-show").on("click", function (event) {
    event.preventDefault();
    $(this).parent(".itemlink").children(".modal").show();
});

// Hide modal

$(".button-modal-hide").on("click", function (event) {
    event.preventDefault();
    $(".modal").hide();
});

// Back to top link

$(window).on("scroll", function () {
    if ($(this).scrollTop()) {
        $('#button-top').fadeIn();
    } else {
        $('#button-top').fadeOut();
    }
});

// jQuery datepicker

$(function () {
    if ($.datepicker) {
        $("#from").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            changeYear: true,
            showOn: "both",
            buttonText: "Choose a start date (Opens datepicker panel)",
            numberOfMonths: 1,
            dateFormat: "dd/mm/yy",
            onClose: function (selectedDate) {
                $("#to").datepicker("option", "minDate", selectedDate);
            }
        });
        $("#to").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            changeYear: true,
            showOn: "both",
            buttonText: "Choose an end date (Opens datepicker panel)",
            numberOfMonths: 1,
            dateFormat: "dd/mm/yy",
            onClose: function (selectedDate) {
                $("#from").datepicker("option", "maxDate", selectedDate);
            }
        });
    }
});
$(function () {
    if ($(".previousanswers ").length) {
        setTimeout(function () {
            var offset = $(".article-content").offset().top;
            $('html, body').animate({ scrollTop: offset }, 500);
        });
    }

    $(".checkboxlist-all").on("click", function () {
        $(this).parents("ul.form-checkbox-list").find("input:checkbox:not(.checkboxlist-all)").attr('checked', false);
        $(this).parents("form").submit();
    });

    $(".filters .form-checkbox-list input:checkbox:not(.checkboxlist-all)").on("click", function () {
        $(this).parents("ul.form-checkbox-list").find("input.checkboxlist-all").attr('checked', false);
        $(this).parents("form").submit();
    });

    $(".filters .form-checkbox-list input:radio:not(#checkbox-date-custom)").on("click", function () {
        $(this).parents("ul.form-checkbox-list").find("input:text").val('');
        $(this).parents("form").submit();
    });

    $(".filters .form-checkbox-list input.hasDatepicker").on("click", function () {
        $('#checkbox-date-custom').attr('checked', true);
    });
});


// Toggle more filters
$(function () {
    $("#show-filters-hidden").on("click", function (event) {
        event.preventDefault();
        $(this).hide();
        $("#filters-hidden").slideToggle("fast");
        $("#hide-filters-hidden").show().focus();
        $("#hide-filters-hidden").css({ display: "block" });
    });
    $("#hide-filters-hidden").on("click", function (event) {
        event.preventDefault();
        $(this).hide();
        $("#filters-hidden").slideToggle("fast");
        $("#show-filters-hidden").show().focus();
    });
});

$(function () {
    selectValues = [10, 15, 20, 25, 30, 35, 40, 45, 50];
    $(".form-input-entitytype").on("change", function () {
        if ($(this).val() == "Organisation") {
            $(".form-control-publication select").each(function () {
                var $select = $(this);
                $.each(selectValues, function (key, value) {
                    $select.append($("<option/>", {
                        value: value,
                        text: value
                    }));
                });
            });
        } else {
            $(".form-control-publication select option:nth-child(n+7)").remove();
        }
    }).trigger('change');
});

// Form back link
$(function () {
    $("button.prev").hide();
    $(".link-back").show();
    $(".link-back").on("click", function (e) {
        e.preventDefault();
        $(this).closest("form").find("button.prev").click();
    });
});

$(document).on('click', 'a[data-url]', function (e) {
    e.preventDefault();
    var $this = $(this);

    $("nav.article-navigation").hide();
    $("div.itemlink-loading").show();

    $.get($this.data('url'), function (data) {
        if (data) {
            var $resultList = $(data).filter("div.resultlist");
            if ($resultList.length) {
                $("div.resultlist").append($resultList.html());
                $("div.itemlink-loading").hide();
                var $nav = $(data).filter("nav.article-navigation");
                if ($nav.length) {
                    $("nav.article-navigation").html($nav.html());
                    $("nav.article-navigation").show();
                }
            }
        }
    });
});

var ico = (function () {
    return {
        hostIsReal: function () {
            var hostPattern = /\.org\.uk$/;
            var hostname = window.location.hostname;
            return hostPattern.test(hostname);
        }
    };
})();

var initChat = function () {

    chat = new $.webChat({
        queue: chatQueue,
        htmlTemplate: "chat",
        autoOpen: true,
        requireEmail: true,
        validateName: function () {
            return "";
        },
        validateEmail: function (t) {
            return /^[a-zA-Z0-9._%+’-]+@[a-zA-Z0-9.’-]+\.[a-zA-Z]{2,}$/.test(t) || t.trim().length === 0 ? "" : chat.localize("INV_EML");
        },
        trigger: function () {
            return $('[data-name="chat-on"]');
        },
        log: function (logText) {
            //console.log(logText);
        },
        canSaveTranscript: true,
        saveTranscript: function (transcriptText, fileName) {
            if (confirm("Save the following transcript?\r\n\r\n" + transcriptText)) {
                saveTextAs(transcriptText, fileName);
            }
        },
        openContainer: function () {
            $(".wc-webchat .wc-chatbox").slideDown(function () {
                $(this).css('display', '');
                if (!$(this).parent(".wc-webchat").closest("#chat").length) {
                    $(this).parent(".wc-webchat").attr("aria-live", "polite");
                    $(this).parent(".wc-webchat").attr("id", "lc-dialog");
                    $(this).parent(".wc-webchat").find(".wc-title").attr("id", "lc-title");
                    $(this).parent(".wc-webchat").attr("aria-labelledby", "lc-title");
                    $(this).find("#wc-name").focus().attr("name", "wc-name-input");

                    $('.lc-chat-nav').attr("aria-hidden", false);
                }
            });
        },

        closeContainer: function () {
            $(".wc-webchat .wc-chatbox").slideUp(function () { $(this).css('display', ''); });
            $('.lc-chat-nav').attr("aria-hidden", true);
        }
    });

    originalLocalize = chat.localize;
    chat.localize = appChatLocalized;

    $("body").on("click", ".wc-minimise", function (e) {
        var webchat = $(this).closest(".wc-webchat");
        e.stopPropagation();
        if ($(".wc-chatbox", webchat).hasClass("wc-show")) {
            $(".wc-chatbox", webchat).removeClass("wc-show").addClass("wc-hide");
            $(".wc-minimise", webchat).addClass("closed");
        }
        else {
            $(".wc-chatbox", webchat).removeClass("wc-hide").addClass("wc-show");
            $(".wc-minimise", webchat).removeClass("closed");
        }
    });

    //$("body").on("click", ".wc-webchat header", function(e) { $(this).off(e); });

    $("body").on("focus", ".wc-message", function (e) {
        if ($(this).val() === $(this).attr('placeholder')) {
            $(this).val("");
        }
    });


    $("body").on("click", ".wc-terminate-ico", function (e) {
        if (confirm(chat.localize("PRM_END"))) {
            chat.endChat(!1);
            $(".wc-webchat.wc-online").removeClass("wc-show").addClass("wc-hide");
            window.location.reload(true);
        }
    });

    $("body").on("click", ".wc-terminate", function (e) {
        window.location.reload(true);
    });


    if (navigator.userAgent && navigator.userAgent.match(/Android/i)) {
        $("body").on("keyup", ".wc-message", function (e) {
            chat.onChatKeypress(e);
        });
    }

};

function injectChat() {

    var scriptNames = [
        "https://ajax.aspnetcdn.com/ajax/signalr/jquery.signalr-2.1.2.min.js",
        "/scripts/livechat.js?1.4",
        "https://livechat.ico.org.uk/webchat/client/webchat.min.js"
    ];

    if (!$("script[src='" + scriptNames[0] + "']").length) {

        for (var i = 0; i < scriptNames.length; i++) {
            var script = document.createElement("script");
            script.src = scriptNames[i];
            script.type = "text/javascript";
            script.async = false; // This is required for synchronous execution
            script.charset = "UTF-8";
            document.head.appendChild(script);
            if (i === scriptNames.length - 1) {
                script.onload = initChat;
            }
        }
        var styleSheet = document.createElement("link");
        styleSheet.type = "text/css";
        styleSheet.rel = "stylesheet";
        styleSheet.href = "/css/webchat.css?v=5";
        document.getElementsByTagName("head")[0].appendChild(styleSheet);
    } else {
        window.location.reload(true);
    }
}

var loops = 0;
var threshold = 30;

function updateCookieControl() {
    if ($("#ccc").length > 0) {

        if ($("#ccc-recommended-settings").length > 0 && $("#ccc-recommended-settings").text() === "") {
            $("#ccc-recommended-settings").hide();
        }

        if ($("#ccc-reject-settings").length > 0 && $("#ccc-reject-settings").text() === "") {
            $("#ccc-reject-settings").hide();
        }
        
        if ($("header.header-banner").length > 0) {
            $("#ccc").insertBefore($("header.header-banner"));
        }

        $("#ccc-optional-categories .optional-cookie").each(function () {
            var label = $(".optional-cookie-header", $(this)).text();
            var idAttr = (label.split(" ").join("_")).toLowerCase();
            $("<span/>", {
                "class": "invisible",
                for: idAttr,
                text: label + " toggle",
            }).prependTo($(".checkbox-toggle-label", $(this)));
            $(".checkbox-toggle-input", $(this)).attr("id", idAttr);

        });
    }
    else {
        if (loops++ < threshold) {
            setTimeout(updateCookieControl, 300);
        }
    }
}

function updateConfigWithFunctions(config) {

    if (config.optionalCookies) {
        for (var i = 0; i < config.optionalCookies.length; i++) {
            if (config.optionalCookies[i]["onAccept"]) {
                var onAcceptFunction = $.trim(config.optionalCookies[i]["onAccept"].replace(/[\t\n\r]+/g, ""));
                config.optionalCookies[i]["onAccept"] = new Function(onAcceptFunction);
            }
            if (config.optionalCookies[i]["onRevoke"]) {
                var onRevokeFunction = $.trim(config.optionalCookies[i]["onRevoke"].replace(/[\t\n\r]+/g, ""));
                config.optionalCookies[i]["onRevoke"] = new Function(onRevokeFunction);
            }
        }
    }
    return config;
}

$(document).ready(function () {

    if (typeof CookieControl !== "undefined" && typeof ccConfig !== "undefined") {
        CookieControl.load(updateConfigWithFunctions(ccConfig));
        updateCookieControl();
    }

    if ($('[data-name="chat"]').length > 0 && $('[data-name="chat-on"]').length > 0 && $('[data-name="chat-off"]').length > 0 && typeof chatQueue && chatQueue.length > 3) {

        $.post('https://livechat.ico.org.uk/webchat/client/GetQueueStatus', {
            QueueName: chatQueue,
        }).done(function (data) {
            if (typeof data !== "undefined") {

                if (typeof data.QueueModeName !== "undefined" && data.QueueModeName === "Day") {
                    $('[data-name="chat-on"]').on('click', function () {
                        injectChat();
                    });
                    $('[data-name="chat-off"]').fadeOut('fast', function () {
                        $('[data-name="chat-on"]').fadeIn('fast');
                    });

                }
            }
        });
    }

    var languageCookie = readCookie('language');

    var domain = "";
    var pathAndQuery = window.location.pathname + window.location.search;

    if (pathAndQuery === "/") {
        pathAndQuery = "";
    }

    var dropdownlabels = document.querySelectorAll('.dropdown-label');
    dropdownlabels.forEach(function (dropdownlabel) {
        var selectedLanguage = languageCookie;
        if (languageCookie === "Welsh") {
            selectedLanguage = "Cymraeg";
        }
        if (selectedLanguage) {
            dropdownlabel.innerText = selectedLanguage;
        }
    });

    if (languageCookie === 'Welsh' && window.location.host.indexOf('cy') == -1) {
        domain = $('a[name="Welsh"]').attr('href');
        window.location.href = domain + pathAndQuery;
    }

    if (languageCookie === 'English' && window.location.host.indexOf('cy') > -1) {
        domain = $('a[name="English"]').attr('href');
        window.location.href = domain + pathAndQuery;
    }

});

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else {
        var expires = "";
    }

    document.cookie = name + "=" + value + expires + ";" + "domain=" + ".ico.org.uk;" + "path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Function to make IE9+ support forEach:
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

function containsClass(yourObj, yourClass) {
    if (!yourObj || typeof yourClass !== 'string') {
        return false;
    } else if (yourObj.className && yourObj.className.trim().split(/\s+/gi).indexOf(yourClass) > -1) {
        return true;
    } else {
        return false;
    }
}

var dropdownMenus = document.querySelectorAll('.dropdown, .globe-list');
dropdownMenus.forEach(function (dropdownMenu) {
    dropdownMenu.addEventListener('click', dropdownMenuClick);
});

function dropdownMenuClick(e) {
    if (e.preventDefault) {
        e.preventDefault();
    } else { e.returnValue = false; }
    e.stopPropagation();

    var dropdownMenus = document.querySelectorAll('.dropdown');

    dropdownMenus.forEach(function (dropdownMenu) {

        var parent = dropdownMenu;
        var isOpen = parent.classList.contains('open');
        var ul = parent.querySelector('ul');
        var chevrons = null;

        if (!isOpen) {

            chevrons = document.querySelectorAll('.chevron');
            chevrons.forEach(function (chevron) {
                chevron.classList.add('up');
                chevron.classList.remove('down');
            });

            parent.classList.add('open');

            if (ul) {
                ul.setAttribute('aria-expanded', true);
            }
        } else {

            chevrons = document.querySelectorAll('.chevron');
            chevrons.forEach(function (chevron) {
                chevron.classList.add('down');
                chevron.classList.remove('up');
            });

            parent.classList.remove('open');

            if (ul) {
                ul.setAttribute('aria-expanded', false);
            }
        }


    });

}

function dropdownItemSelect(e) {
    if (e.preventDefault) {
        e.preventDefault();
    } else { e.returnValue = false; }
    e.stopPropagation();

    var pathAndQuery = window.location.pathname + window.location.search;
    if (pathAndQuery === "/") {
        pathAndQuery = "";
    }

    var name = $(this).attr('name');
    var siteUrl = $(this).attr('href') + pathAndQuery;
    if (name === 'English') {
        createCookie("language", "English", 7);
    }

    if (name === 'Welsh') {
        createCookie("language", "Welsh", 7);
    }
    window.location.href = siteUrl;
}

var languageItems = document.querySelectorAll('.language-item');
languageItems.forEach(function (languageItem) {
    languageItem.addEventListener('click', dropdownItemSelect);
});

window.onclick = function (event) {

    var matches = event.target.matches ? event.target.matches('.language-dropdown-tab-controls') : event.target.msMatchesSelector('.language-dropdown-tab-controls');

    if (!matches) {

        var dropdowns =
            document.getElementsByClassName("dropdown");

        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('open')) {
                openDropdown.classList.remove('open');
            }
        }

        chevrons = document.querySelectorAll('.chevron');
        chevrons.forEach(function (chevron) {
            chevron.classList.add('down');
            chevron.classList.remove('up');
        });

    }
};

