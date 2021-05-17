var navigatePicker = function(picker, keycode, selectedDate, event) {
	var selectedDate = picker.getDate() || new Date();
	var days = 0;

    switch (keycode) {
    case 33: // PageUp
        days = -365;
        break;
    case 34: // PageDown
        days = 365;
        break;
    case 35: // End
        days = -30;
        break;
    case 36: // Home
        days = 30;
        break;
    case 37: // Left
        days = -1;
        break;
    case 39: // Right
        days = 1;
        break;
    case 38: // Top
        days = -7;
        break;
    case 40: // Down
        days = 7;
        break;
    case 13: // Esc
    case 27: // Enter
        picker.hide();
    default:
        //event.blur();      
        return;
	}
    
    picker.setDate(new Date(selectedDate.setDate(selectedDate.getDate() + days)));
    opts.trigger.value = "Test";
}