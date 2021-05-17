var FormSummary = function ($) {


    function displaySummaryField(summaryFieldId, fieldSetId) {

        var formId = $("input[name='FormId']").val().replace(/-/g, "");
        var $hiddenField = $("#values_" + formId);
        if ($hiddenField.length > 0) {
            var jsonContent = $hiddenField.val();
            var labelId = "labelSummaryFor_" + fieldSetId;
            var fieldId = "fieldSummaryFor_" + fieldSetId;

            $.ajax({
                url: "/Umbraco/IcoApi/Form/GetFormFieldSummary",
                data: { "FormId": formId, "FieldId": fieldSetId, "JsonValues": jsonContent },
                method: "GET",
                success: function (response) {
                    response.forEach(function (e, i) {
                        addSummaryField(summaryFieldId, labelId + "_" + i, fieldId + "_" + i, e.FieldLabel, e.FieldValue);
                    });
                }
            });
        }
        else {
            renderLiveFieldSet(fieldSetId);
        }
    }

    function renderLiveFieldSet(fieldSetId) {
        var $renderedField = $("#" + fieldSetId);

        //Does the field exist?
        if ($renderedField.length > 0) {

            //Create a reference to the fields
            var fieldList = [];

            //Get the element type
            var elementType = $renderedField[0].type;
            if (elementType === "fieldset") {

                //A fieldset may have multiple elements
                $renderedField.find("label").each(function (e) {
                    var $field = $("#" + $(this).attr("for"));
                    fieldList.push({ label: $(this), field: $field });
                });
            }
            else {
                var $label = $(document).find("label [for = '" + fieldSetId + "']");
                fieldList.push({ label: $label, field: $renderedField });
            }

            bindUpdateFields(fieldSetId, fieldList);
        }
    }

    function bindUpdateFields(summaryFieldId, fieldSetId, fieldList) {
        fieldList.forEach(function (item) {

            var id = item.field.attr("id");
            if (id === "") {
                id = fieldSetId;
            }

            var labelId = "labelSummaryFor_" + id;
            var fieldId = "fieldSummaryFor_" + id;
            addSummaryField(summaryFieldId, labelId, fieldId, item.label.children().remove().end().text());

            if (item.field.length > 0) {
                updateElementText(fieldId, item.field);
                item.field.off().on("blur change textchange update", function () {
                    updateElementText(fieldId, item.field);
                });
            }
        });
    }

    function updateElementText(summaryFieldId, $field) {

        var fieldContent = "";

        if ($field.length > 0) {
            var elementType = $field[0].type;
            if (elementType === "textarea") {
                $field.html();
            }
            else if (elementType === "select") {

                //Get value from a dropdown
                fieldContent = $field.find("option:selected").text();

            }
            else if (inputType == "checkbox") {
                if ($field.is(':checked')) {
                    fieldContent = "true";
                } else {
                    fieldContent = "false";
                }
            }
            else if (elementType === "input") {

                //Figure out what type of input
                var inputType = $field.attr("type");

                if (inputType == "checkbox") {
                    if ($field.is(':checked')) {
                        fieldContent = "true";
                    } else {
                        fieldContent = "false";
                    }
                }
                else {
                    fieldContent = $field.val();
                }
            }
            else {
                fieldContent = $field.val();
            }
        }
        $("#" + summaryFieldId).html(fieldContent);
    }

    function addSummaryField(summaryFieldId, labelId, fieldId, labelText, fieldText) {

        var $summaryField = $("#" + summaryFieldId);
        var $labelField = $("#" + labelId);
        var $displayField = $("#" + fieldId);

        var $summaryFieldDiv = null;
        if ($labelField.length > 0) {
            $summaryFieldDiv = $labelField.parent("div");
        } else if ($displayField.length > 0) {
            $summaryFieldDiv = $displayField.parent("div");
        }

        if ($summaryFieldDiv === null || $summaryFieldDiv.length === 0) {
            $summaryFieldDiv = $("<div />").addClass("form-control").addClass("contourField");
            $summaryField.append($summaryFieldDiv);
        }

        //Create label Element if it does not exist
        if ($labelField.length === 0) {
            $labelField = $("<label />").attr("id", labelId).addClass("fieldLabel");
            $summaryFieldDiv.append($labelField);
        }

        //Create display element if they do not exist
        if ($displayField.length === 0) {
            if (UseTextArea(fieldText)) {
                $displayField = $("<textarea />").attr("cols", "20").attr("rows", "2");
            } else {
                $displayField = $("<input />").attr("type","text").addClass("text");
            }
            $displayField.attr("id", fieldId).attr("disabled", "disabled").addClass("valid disabled");
            $summaryFieldDiv.append($displayField);
        }

        //Set Label and Field Text Values
        $labelField.html(labelText);
        if (UseTextArea(fieldText)) {
            $displayField.html(fieldText);
        } else {
            $displayField.val(fieldText);
        }
    }

    function UseTextArea(fieldText) {
        if (fieldText.length > 80) {
            return true;
        } else if (fieldText.indexOf("<br") > -1) {
            return true;
        } else if (fieldText.indexOf("\r\n") > -1) {
            return true;
        }
        return false;
    }

    return {
        InitField: function (id, fieldId) {
            displaySummaryField(id, fieldId);
        }
    }

}(jQuery);