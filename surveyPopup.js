(function () {

    var exposedStuff = {
        Show: showDialogOrPopup,
    };

    var surveySettings;

    var dialogButtons = {
        Yes: "",
        No: "",
        Later: ""
    };


    function isCookieAllowed() {
        var cookieControlCookie;
        var isAllowed = false;
        if (cookieControlCookie = readCookie('CookieControl')) {
            var cookieControl = JSON.parse(cookieControlCookie);
            isAllowed = cookieControl.optionalCookies && cookieControl.optionalCookies.Survey && (cookieControl.optionalCookies.Survey == "accepted" || cookieControl.optionalCookies.Survey == "legitimate interest");
        }
        return isAllowed;
    }

    function showDialogOrPopup(settings) {
        surveySettings = settings;
        if (surveySettings.surveyIsActive) {
            var status = getUserSurveyStatus();
            if (status === surveyStatus.Unknown) {
                showInitialSurveyPrompt();
            }

            if (status === surveyStatus.SurveyIsWanted) {
                showToastPopup();
            }
        }
        /*otherwise, there's nothing to do; either user does not want survey or they've already done it.*/
    };

    function showInitialSurveyPrompt() {
        dialogButtons.Yes = surveySettings.yesButtonText;
        dialogButtons.No = surveySettings.noButtonText;
        dialogButtons.Later = surveySettings.laterButtonText;

        /*create the buttons for the modal dialog
               * Done dynamically as the option for a 'later' button has been added,
               * but we only want to add that one if requested.
               */
        var buttons = [
            {
                "label": dialogButtons.Yes,
                "cssClass": "blue",
                "onClick": function () {
                    (surveySettings.DisplayCorner === true) ? processInitialSurveyDialogResult(dialogButtons.Yes) : processToastClick();
                }
            },
            {
                "label": dialogButtons.No,
                "cssClass": "blue",
                "onClick": function () {
                    processInitialSurveyDialogResult(dialogButtons.No);
                }
            }
        ];

        /* If we have a 'Later' button, add to array of buttons.*/
        if (!(dialogButtons.Later === null || dialogButtons.Later === "")) {
            buttons.push({
                "label": dialogButtons.Later,
                "cssClass": "blue",
                "onClick": function () {
                    processInitialSurveyDialogResult(dialogButtons.Later);
                }
            });
        }

        $.fn.jAlert({
            "title": surveySettings.dialogTitle,
            "message": surveySettings.dialogMessage,
            "imgUrl": surveySettings.surveyImageUrl,
            "theme": "info",
            "closeBtn": false,
            "clickAnywhere": false,
            "hideOnEsc": false,
            "btn": buttons
        });
    };

    /* handler for user clicking one of the buttons on the initial modal dialog.*/
    function processInitialSurveyDialogResult(buttonClicked) {
        var userSelection = surveyStatus.SurveyNotWanted;
        if (buttonClicked === dialogButtons.Yes) {
            userSelection = surveyStatus.SurveyIsWanted;
        } else if (buttonClicked === dialogButtons.Later) {
            userSelection = surveyStatus.RemindUserSoon;
        }

        //store this in the cookie...
        setUserSurveyStatus(userSelection);
        //If user wants the survey, then go straight to toast
        if (userSelection === surveyStatus.SurveyIsWanted) {
            showToastPopup();
        }
    };

    function showToastPopup() {

        Stashy.Notify({
            title: "",
            content: surveySettings.surveyPopupText,
            style: "info",
            contentType: "inline",
            closeArea: "element",
            animDuration: "fast"
        }).toast("right", "bottom");

        /*weirdly, this notify thing doesn't support a callback function on click/close as far as I can tell
                 So this manually hooks into the click event so we can fire off to the survey link.
              */
        $('.st-notify').on("click", function () {
            processToastClick();

        });
    }

    function processToastClick() {
        /*The current toast plug-in closes itself when clicked, so we don't need to do anything
              * in particular to close the toast notification.  We do however have to note that the user
              * has selected to take the survey and stop reminding them, and actually open the link.
              */
        setUserSurveyStatus(surveyStatus.SurveyCompleted);
        window.open(surveySettings.url, '_blank');
    }

    /*List of what we consider to be valid statuses (statii?) for user's mind about the survey.....*/
    var surveyStatus = {
        //we don't know;  user has not said anything, or we have no record of their request.
        Unknown: "Unknown",

        /*User has responded to initial request to suggest they do not want to take the survey.*/
        SurveyNotWanted: "SurveyNotWanted",

        /*User has responded to initial request to state that they DO want to take the survey*/
        SurveyIsWanted: "SurveyIsWanted",

        /*User has basically said, remind me later*/
        RemindUserSoon: "RemindUserSoon",

        /*User has already completed a survey (or at least, followed  a link to do so.*/
        SurveyCompleted: "SurveyCompleted",

        isValid: function (value) {
            return ((value === surveyStatus.Unknown) ||
                (value === surveyStatus.SurveyNotWanted) ||
                (value === surveyStatus.SurveyIsWanted) ||
                (value === surveyStatus.RemindUserSoon) ||
                (value === surveyStatus.SurveyCompleted));
        }
    }

    function getCookieName() {
        return "ico_survey_" + surveySettings.surveyId;
    }

    /*Find out the current status of this survey for the user.*/
    function getUserSurveyStatus() {

        var cookieName = getCookieName();

        var cookieContents = readCookie(cookieName);

        if (!surveyStatus.isValid(cookieContents)) {
            return surveyStatus.Unknown;
        } else {
            return cookieContents;
        }

    }

    function setUserSurveyStatus(status) {
        var cookieName = getCookieName();
        /*Sanity check that we're trying to save a valid status to the cookie.*/
        var newstatus = surveyStatus.isValid(status) ? status : surveyStatus.Unknown;

        /* if user wants reminding later, then we make cookie expire in only a day or two... otherwise we remember forever (ish)*/
        var days = (newstatus === surveyStatus.RemindUserSoon)
            ? surveySettings.daysToWaitBeforeRemindingUnsureUser
            : surveySettings.daysToRememberPreference;

        writeCookie(cookieName, newstatus, days);
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

    function writeCookie(name, value, daysInWhichToExpire) {
        var d = new Date();
        d.setTime(d.getTime() + (daysInWhichToExpire * 24 * 60 * 60 * 1000));
        document.cookie = name + '=' + value + '; expires=' + d.toUTCString() + ';path=/';
    }

    /*Expose survey Settings function for use externally..*/
    window.surveyPopupUtils = exposedStuff;

})();

