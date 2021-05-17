//	This javascript tags file downloads and external links in Google Analytics.
//	You need to be using the Google Analytics New Tracking Code (ga.js) 
//	for this script to work.
//	To use, place this file on all pages just above the Google Analytics tracking code.
//	All outbound links and links to non-html files should now be automatically tracked.
//
//	VKI has made changes as indicated below.

function gaLoaded() {
    if (window._gaq) {
        return true;
    }
    return false;
}
//process links
if (document.getElementsByTagName) {

    // Initialize external link handlers
    var hrefs = document.getElementsByTagName("a");
    for (var l = 0; l < hrefs.length; l++) {
        // try {} catch{} block added by erikvold VKI
        try {
            //protocol, host, hostname, port, pathname, search, hash
            if (hrefs[l].protocol == "mailto:") {
                startListening(hrefs[l], "click", trackMailto);
            } else if (hrefs[l].hostname == location.host) {
                var path = hrefs[l].pathname + hrefs[l].search;
                var isDoc = path.match(/\.(?:doc|docx|zipx|xlsx|eps|jpg|png|svg|xls|ppt|pptx|pps|pdf|ashx|xls|zip|txt|vsd|xml|xsd|xslt|swf|vxd|js|csv|rar|exe|wma|mov|avi|wmv|mp3)($|\&|\?)/i);
                if (isDoc) {
                    startListening(hrefs[l], "click", trackExternalLinks);
                }
            } else if (!hrefs[l].href.match(/^javascript:/)) {
                startListening(hrefs[l], "click", trackExternalLinks);
            }
        }
        catch (e) {
            continue;
        }
    }
    //process forms
    var divs = document.getElementsByTagName('div');
    for (var i = 0, max = divs.length; i < max; i++) {
        if (divs[i].getAttribute('class') === 'scfForm') {
            //iterate over labels first to associate with inputs etc
            //makes processing quicker for events
            var labels = document.getElementsByTagName('label');
            for (var l = 0, lmax = labels.length; l < lmax; l++) {
                if (labels[l].htmlFor != '') {
                    var elem = document.getElementById(labels[l].htmlFor);
                    if (elem) {
                        elem.label = labels[l];
                    }
                }
            }

            //track inputs
            var inputs = divs[i].getElementsByTagName('input');
            for (var j = 0, jmax = inputs.length; j < jmax; j++) {
                var type = inputs[j].getAttribute('type');
                if (!type || type === 'text') {
                    startListening(inputs[j], 'blur', trackIncompleteForm);
                }
            }

            //track textareas
            var texts = divs[i].getElementsByTagName('textarea');
            for (var k = 0, kmax = texts.length; k < kmax; k++) {
                startListening(texts[k], 'blur', trackIncompleteForm);
            }
        }
    }
}

function startListening(obj, evnt, func) {
    if (obj.addEventListener) {
        obj.addEventListener(evnt, func, false);
    } else if (obj.attachEvent) {
        obj.attachEvent("on" + evnt, func);
    }
}

function trackMailto(evnt) {
    if (gaLoaded()) {
        var href = (evnt.srcElement) ? evnt.srcElement.href : this.href;
        var mailto = "/mailto/" + href.substring(7);
        _gaq.push(['_trackPageview', mailto]);
    }
}

function trackExternalLinks(evnt) {
    if (gaLoaded()) {
        var e = (evnt.srcElement) ? evnt.srcElement : this;
        while (e.tagName != "A") {
            e = e.parentNode;
        }
        var lnk = (e.pathname.charAt(0) == "/") ? e.pathname : "/" + e.pathname;
        if (e.search && e.pathname.indexOf(e.search) == -1) lnk += e.search;
        if (e.hostname === location.host) {
            lnk = "/downloads/" + e.hostname + lnk;
        } else if (e.hostname != location.host) {
            lnk = "/external/" + e.hostname + lnk;
        }
        _gaq.push(['_trackPageview', lnk]);
    }
}

function trackIncompleteForm(evnt) {
    if (gaLoaded()) {
        var field = evnt.srcElement;
        if (field.value != '') {
            _gaq.push(['_trackPageview', '/forms/' + location.pathname + '/' + field.label.innerHTML]);
        }
    }
}