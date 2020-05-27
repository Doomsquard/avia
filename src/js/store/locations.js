import api from '../services/apiService';
import { formatDate } from '../helpers/date';
class Locations {
	constructor(api, helpers) {
		this.api = api;
		this.countries = null;
		this.cities = null;
		this.shortCitiesList = null;
		this.airlines = {};
		this.lastSearch = [];
		this.formatDate = helpers.formatDate;
	}

	createShortCitiesList(cities) {
		return Object.entries(cities).reduce((acc, [, city]) => {
			acc[city.fullName] = null;
			return acc;
		}, {});
	}

	async init() {
		const response = await Promise.all([
			this.api.countries(),
			this.api.cities(),
			this.api.airlines(),
		]);

		const [countries, cities, airlines] = response;
		this.countries = this.serializeCounties(countries);
		this.cities = this.serializeCities(cities);
		this.shortCitiesList = this.createShortCitiesList(this.cities);
		this.airlines = this.serializeAirlines(airlines);

		return response;
	}

	serializeAirlines(airlines) {
		return airlines.reduce((acc, airline) => {
			airline.logo = `http://pics.avs.io/200/200/${airline.code}.png`;
			airline.name = airline.name || airline.name_translations.en;
			acc[airline.code] = airline;
			return acc;
		}, {});
	}
	getAirlinesNamebyCode(code) {
		return this.airlines[code] ? this.airlines[code].name : '';
	}
	getAirlinesLogo(code) {
		return this.airlines[code] ? this.airlines[code].logo : '';
	}

	codeCitiesByCitiesName(key) {
		const city = Object.values(this.cities).find(item => {
			return item.fullName === key;
		});
		const { code } = city.city;

		return code;
	}

	getCityNameByCode(code) {
		return this.cities[code].city.name;
	}

	serializeCounties(countries) {
		return countries.reduce((acc, country) => {
			acc[country.code] = country;
			return acc;
		}, {});
	}

	getCountryNameByCityCode(code) {
		return this.countries[code].name;
	}

	serializeCities(cities) {
		return cities.reduce((acc, city) => {
			const countryName = this.getCountryNameByCityCode(city.country_code);
			city.name = city.name || city.name_translations.en;
			const fullName = city.name
				? `${city.name},${countryName}`
				: `${city.name_translations.en},${countryName}`;
			acc[city.code] = {
				city,
				countryName,
				fullName,
			};
			return acc;
		}, {});
	}

	async fetchTickets(params) {
		const response = await this.api.prices(params);
		this.lastSearch = this.serializeTickets(response.data);
	}

	serializeTickets(tickets) {
		return Object.values(tickets).map(item => {
			return {
				...item,
				origin_name: this.getCityNameByCode(item.origin),

				destination_name: this.getCityNameByCode(item.destination),
				airline_logo: this.getAirlinesLogo(item.airline),
				airline_name: this.getAirlinesNamebyCode(item.airline),
				departur_at: this.formatDate(item.departure_at, 'dd MMM yyyy hh:mm'),
				return_at: this.formatDate(item.return_at, 'dd MMM yyyy hh:mm'),
			};
		});
	}
}

const locations = new Locations(api, { formatDate });
export default locations;
