import '../css/style.css';
import locations from './store/locations';
import './plugins';
import formUI from './views/form';
import currencyUI from './views/currency';
import ticketsUi from './views/tickets';

document.addEventListener('DOMContentLoaded', () => {
	initApp();

	const form = formUI.form;

	// events
	form.addEventListener('submit', e => {
		e.preventDefault();
		onFormSubmit();
	});

	// init Autocomplete,Handlers
	async function initApp() {
		await locations.init();
		formUI.SetAutocompleteDate(locations.shortCitiesList);
	}

	const cityCode = city => {
		const citycode = locations.codeCitiesByCitiesName(city);
		return citycode;
	};

	async function onFormSubmit() {
		const origin = cityCode(formUI.originValue);
		const destination = cityCode(formUI.destinationValue);
		const departDate = formUI.departDateValue;
		const returnDate = formUI.returnDateValue;
		const currency = currencyUI.currencyValue;

		console.log(origin, destination, departDate, returnDate, currency);
		await locations.fetchTickets({
			origin,
			destination,
			departDate,
			returnDate,
			currency,
		});
		ticketsUi.renderTickets(locations.lastSearch);
	}
});
