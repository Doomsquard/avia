import {
	getAutoCompleteInstance,
	getDatePickerInstance,
} from '../plugins/materialize';

class FormUI {
	constructor(autocomplete, datepicker) {
		this._form = document.forms['locationControls'];
		this.origin = document.getElementById('autocomplete-origin');
		this.destination = document.getElementById('autocomplete-destination');
		this.depart = document.getElementById('datepicker-depart');
		this.return = document.getElementById('datepicker-return');
		this.originAutocomplete = autocomplete(this.origin);
		this.destinationAutocomplete = autocomplete(this.destination);
		this.departDetePicker = datepicker(this.depart);
		this.returnDetePicker = datepicker(this.return);
	}

	get form() {
		return this._form;
	}

	get originValue() {
		return this.origin.value;
	}

	get destinationValue() {
		return this.destination.value;
	}

	get departDateValue() {
		return this.departDetePicker.toString();
	}

	get returnDateValue() {
		return this.returnDetePicker.toString();
	}

	SetAutocompleteDate(data) {
		this.originAutocomplete.updateData(data);
		this.destinationAutocomplete.updateData(data);
	}
}
const formUI = new FormUI(getAutoCompleteInstance, getDatePickerInstance);
export default formUI;
