// Table of contents responsive nav
$(function() {

    if ($(".toc nav").length > 0) {
            var navigation = responsiveNav(".toc nav", {
	        insert: "before", label: "Contents", navClass: "toc-collapse", closeOnNavClick: true
            });
    }

    // Table of contents responsive nav toggle class

    $(".toc .nav-toggle").click(function ( event ) {
	    event.preventDefault();
	    $(this).toggleClass("nav-toggle-open");
    });
});
