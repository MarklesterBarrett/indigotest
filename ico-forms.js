// File upload fields in forms
(function ($) {
    if ($.validator) {
        $.validator.addMethod("uploadRequired",
            function(val, element) {
                var hiddenFieldId = element.id + "_file";
                var deleteFieldId = element.id + "_delete";
                var hiddenField = $("#" + hiddenFieldId);
                if (val || (hiddenField.length && hiddenField.first().attr("value")) && deleteFieldId) {
                    return true;
                }
                return false;
            },
            "Please upload a file");


        $.validator.addMethod("form-postcode",
            function (val, element) {
                if (this.optional(element)) {
                    return true;
                }
                var country = $(element).closest("fieldset").find("select.form-country").first();
                if (country === undefined || country == null || country.val() != "GB") {
                    return true;
                }
                var re = new RegExp(/^([A-Z]{1,2}[0-9][0-9A-Z]?)\s*([0-9][A-Z]{2})$/i);
                return re.test(val);
            },
            "Please enter a valid UK postcode. Or, select a different country");

        $("select.form-country").on("change", function(e) {
            $(this).closest("fieldset").find("input.form-postcode").first().valid();
        });
    }

    // 'hide' event supplied by jquery.showandtell
    $("div.contourField.icofileupload,.contourFieldSet").on("hide", function(e) {
        var deleteField = $(this).find("input[id$='_delete']");
        deleteField.prop("checked", true);
        deleteField.val("hideAndDelete");
        $(this).find("input.file-upload-hidden-flag").first().val("true");
    });

    $("div.contourField.icofileupload,.contourFieldSet").on("show", function(e) {
        var deleteField = $(this).find("input[id$='_delete']");
        deleteField.prop("checked", false);
        deleteField.val("delete");
        $(this).find("input.file-upload-hidden-flag").first().val("false");
    });

    $("div.contourField.icoregistrationorderreference").on("hide", function (e) {
        $(this).find("input.registration-order-reference-hidden-flag").first().val("true");
    });

    $("div.contourField.icoregistrationorderreference").on("show", function (e) {
        $(this).find("input.registration-order-reference-hidden-flag").first().val("false");
    });

    $("div.contourField.icoaddressfield").on("hide", function(e) {
        $(this).find("input.form-address-hidden-flag").first().val("true");
    });

    $("div.contourField.icoaddressfield").on("show", function(e) {
        $(this).find("input.form-address-hidden-flag").first().val("false");
        $(this).find("select.form-country").first().val("GB");
    });

    $(".contour form [data-name='submitbtn']").on("dblclick click", function (e) {
        e.preventDefault();
        $(this).prop("disabled", true);
        var isValidated = $(this).closest('form').valid();
        $(this).prop("disabled", isValidated);
        if (isValidated) {
            $(".contour form")[0].submit();
        } 
    });

    $("div.contourField").on("hide", function (e) {
        //#1550 - Clear the value from within the item
        clearElementValue($(this));
    });

    function clearElementValue($element) {
        if ($element.is("input")) {
            var elementsToClear = [ "file", "password", "text" ]; 
            if (elementsToClear.indexOf($element.attr("type")) > -1) {
                $element.val("");
            }
        }
        else if ($element.is("textarea")) {
            $element.html("");
        }
        else {
            var $children = $element.children();
            if ($children !== null && $children.length > 0) {
                $children.each(function () {
                    clearElementValue($(this));
                });
            }
        }
    }

    function uploadContainer($container)  {

        this.fileInput          = $("[data-file-input]", $container);
        this.cancelLink         = $("[data-cancel-link]", $container);
        this.checkBox           = $("[data-checkbox]", $container);
        this.uploadCurrent      = $("[data-upload-current]", $container);
        this.uploadNew          = $("[data-upload-new]", $container);
        this.container          = $container;
        
        this.hasUploadCurrent = this.checkBox.length> 0 && this.uploadCurrent.length > 0 && this.uploadNew.length > 0
        this.hasCancelLink = this.cancelLink.length > 0;
        
        var self = this;

        if(this.hasCancelLink){
            
            this.cancelLink.hide().removeClass("invisible");

            this.cancelLink.on('click', function(){
                self.fileInput.val('');
                self.toggleInputHightlight();
                self.toggleCancelLink();
            });

            this.fileInput.on('change', function(){
                self.toggleInputHightlight();
                self.toggleCancelLink();
                if (self.fileInput.hasClass('uploadRequired')) {
                    self.fileInput.valid();
                }
            });

        }

        if(this.hasUploadCurrent){
            this.checkBox.on('change', function(){
                self.uploadCurrent.fadeOut('fast', function(){
                    self.uploadCurrent.addClass('file-upload-current--hide');
                });
            });
        }
      
        this.toggleInputHightlight = function(){
            if(this.fileInput.val()){
                this.fileInput.addClass("file-upload--bold");
            }
            else{
                this.fileInput.removeClass("file-upload--bold");
            }
        }

        this.toggleCancelLink = function(){
            if(this.fileInput.val()){
                this.cancelLink.fadeIn('fast').css("display", "inline-block");
            }
            else{
                this.cancelLink.fadeOut('fast').css("display", "inline-block");
            }
        }

    }

    $('[data-container="upload"]').each(function(){
        new uploadContainer($(this));
    });

})(jQuery);
