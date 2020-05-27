class CurrencyUI {
	constructor() {
		this.currency = document.getElementById('currency');
		this.dectionary = {
			USD: '$',
			EUR: '€',
			RUB: '₽',
		};
	}
	get currencyValue() {
		return this.currency.value;
	}

	getcurrencySymbol() {
		return this.dectionary[this.currencyValue];
	}
}

const currencyUI = new CurrencyUI();
export default currencyUI;
