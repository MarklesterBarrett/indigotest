// Filters responsive nav
$(function() {
    if ($(".filters").length > 0) {
        var navigation = responsiveNav(".filters", {
            insert: "before", label: "Filters", navClass: "filter-collapse"
        });
    }

    // Table of contents responsive nav toggle class

    $(".filtercolumn .nav-toggle").click(function (event) {
        event.preventDefault();
        $(this).toggleClass("nav-toggle-open");
    });
});
