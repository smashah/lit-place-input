import { TextField } from '@material/mwc-textfield';
import '@google-web-components/google-apis/google-maps-api.js';
import '@material/mwc-icon/mwc-icon-font.js';
export default class LitPlaceInput extends TextField {
    static get properties() {
        return {
            /**
             * Required: A Maps API key. To obtain an API key, see developers.google.com/maps/documentation/javascript/tutorial#api_key.
             */
            apiKey: {
                type: String,
                notify: true,
            },
            /**
             * Indicates the Google API is loaded and that Autocomplete suggestions and geocoding functions are available
             */
            apiLoaded: {
                type: Boolean,
                notify: true,
                readOnly: true,
            },
            /**
             * Whether to hide the error message
             * If true, the control does not validate that the value is complete (lat/lng, search term, place_id)
             * and has been chosen from the places drop down.
             */
            hideError: {
                type: Boolean,
                value: false,
            },
            /**
             * Whether to hide the place icon
             * If true, the control does not show the place icon in the input box.
             */
            hideIcon: {
                type: Boolean,
                value: false,
            },
            /** @private */
            _geocoder: {
                type: Object,
            },
            /**
             * bias search results to a country code  (ISO 3166-1 Alpha-2 country code, case insensitive).
             */
            searchCountryCode: {
                type: String,
            },
            /**
             * bias search results to a bounding rectangle.
             * object properties (all are required):
             * {
             *    east: number,  // East longitude in degrees.
             *    west: number,  // West longitude in degrees.
             *    north: number, // North latitude in degrees.
             *    south: number, // South latitude in degrees.
             * }
             *
             */
            searchBounds: {
                type: Object,
            },
            /**
             * bias search results by type
             * permitted values:
             *   address
             *   geocode
             *   establishment
             *   (regions)
             *   (cities)
             */
            searchType: {
                type: String,
            },
            /**
             * True if the entered text is not valid - i.e. not a selected place and not previously geocoded
             */
            invalid: {
                type: Boolean,
                notify: true,
                readOnly: true,
                value: false,
            },
            /**
             * Internal representation of invalid, True if the entered text is not valid - i.e. not a selected place and not previously geocoded
             */
            _invalid: {
                type: Boolean,
                value: false,
            },
            /**
             * an object - { lat: number, lng: number } - representing the geolocation of the entered / selected place
             */
            latLng: {
                type: Object,
                notify: true,
                readOnly: true,
            },
            /**
             * An object containing the place selected or geocoded:
             * ```
             *   place_id
             *   formatted_address
             *   latLng { lat: lng: }
             *   search
             *   basic:
             *     name
             *     address
             *     city
             *     state
             *     stateCode
             *     postalCode
             *     country
             *     countryCode
             *     phone
             *   placeDetails: additional properties from the google place result
             *```
             */
            place: {
                type: Object,
                notify: true,
                readOnly: true,
            },
            _place: {
                type: Object,
                notify: true,
                readOnly: true,
            },
            /** @private */
            _places: {
                type: Object,
            },
            /**
             * Sets the desired language for the input and the autocomplete list.
             * Normally, Google Places Autocomplete defaults to the browser default language.
             * This value allows the language to be set to a desired language regardless of the browser default.
             *
             * For a list of language codes supported see https://developers.google.com/maps/faq#languagesupport
             *
             * *** the value should not be modified after the element is loaded ***
             */
            language: {
                type: String,
                value: '',
            },
            /**
             * If true, the element does not load the drawing, geometry or visualization libraries, slightly
             * reducing overall payload size.
             *
             * Important: Do not use this option if the page contains other elements that make usef
             * of the Google Maps Javascript API (e.g. google-map).  This can cause the maps API to be loaded
             * more than once generating errors.
             *
             * Do not change this value after the element is loaded
             *
             */
            minimizeApi: {
                type: Boolean,
                value: false,
            },
            /**
             * An object representing the initial or returned value of the control.
             * ```
             * Properties:
             *   search:  string - the search string
             *   place_id:  string - the google maps place_id
             *   latLng:  object {lat: number, lng: number} - latitude/Longitude
             *```
             */
            valueObject: {
                type: Object,
                notify: true,
            },
            /** @private */
            _value: {
                type: String,
                notify: true,
            },
        };
    }
    constructor() {
        super();
        this.place = {};
        this.latLng = {
            lat: 0,
            lng: 0,
        };
        this.validationMessage = 'Invalid - please select a place';
        this.apiLoaded = false;
        this.searchCountryCode = 'test';
        this.searchBounds = {};
        this.searchBoundsStrict = false;
        this.searchType = 'test';
        this.icon = 'place';
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        changedProperties.forEach((oldValue, propName) => {
            switch (propName) {
                case '_value':
                    this._svalChanged(this._value);
                    break;
                case 'valueObject':
                    this._valueChanged(this.valueObject, oldValue);
                    break;
                case 'searchCountryCode':
                case 'searchBounds':
                case 'searchBoundsStrict':
                case 'searchType':
                case 'apiLoaded':
                    this._searchBiasChanged(this.searchCountryCode, this.searchBounds, this.searchBoundsStrict, this.searchType);
                    break;
                default:
                    break;
            }
        });
    }
    async firstUpdated() {
        super.firstUpdated();
        const gmaps = document.createElement('google-maps-api');
        gmaps.apiKey = this.apiKey;
        gmaps.version = '3.exp';
        gmaps.id = 'gmaps-api';
        gmaps.addEventListener('api-load', (() => {
            this._mapsApiLoaded();
            // eslint-disable-next-line
        }).bind(this));
        this.shadowRoot.append(gmaps);
    }
    _mapsApiLoaded() {
        if (!this._geocoder && !this._places) {
            this._geocoder = new google.maps.Geocoder();
            this._places = new google.maps.places.Autocomplete(this.shadowRoot.getElementById('text-field'), {});
            google.maps.event.addListener(this._places, 'place_changed', this._onChangePlace.bind(this));
            this.apiLoaded = true;
            this._searchBiasChanged();
            this.dispatchEvent(new CustomEvent('api-loaded', {
                detail: {
                    text: 'Google api is ready',
                },
            }));
        }
    }
    /**
     * observer for changes to search bias
     */
    _searchBiasChanged() {
        const { searchCountryCode, searchBounds, searchType } = this;
        if (this.apiLoaded) {
            if (searchBounds &&
                // eslint-disable-next-line
                searchBounds.hasOwnProperty('east') &&
                // eslint-disable-next-line
                searchBounds.hasOwnProperty('west') &&
                // eslint-disable-next-line
                searchBounds.hasOwnProperty('north') &&
                // eslint-disable-next-line
                searchBounds.hasOwnProperty('south')) {
                this._places.setBounds(searchBounds);
            }
            else {
                this._places.setBounds();
            }
            if (searchCountryCode && searchCountryCode.length === 2) {
                this._places.setComponentRestrictions({
                    country: searchCountryCode.toString(),
                });
            }
            else {
                this._places.setComponentRestrictions();
            }
            if (searchType &&
                ['address', 'geocode', 'establishment', '(regions)', '(cities)'].includes(searchType)) {
                this._places.setTypes([searchType.toString()]);
            }
            else {
                this._places.setTypes([]);
            }
        }
    }
    _valueChanged(newValue, oldValue) {
        // update the search term and the invalid flag if the value is being set for the first time,
        // or if the value has changed and is not the same as the search term
        if (!oldValue || newValue.search !== oldValue.search || newValue.search !== this._value) {
            // this._value = newValue && newValue.search ? newValue.search : "";
            this._invalid =
                !newValue ||
                    !(newValue.place_id && newValue.latLng && newValue.latLng.lat && newValue.latLng.lng);
            if (!this.hideError) {
                this._invalid = this.required
                    ? this._invalid
                    : this._invalid && newValue && newValue.search;
            }
        }
    }
    _svalChanged(newValue) {
        // reset the invalid property if the user has typed in the input field
        // if the newValue matches the selected place, which could happen if
        // the user types after selecting a place, then deletes the typing
        if (newValue && this.place && this.place.search && newValue === this.place.search) {
            this.valueObject = {
                place_id: this.place.place_id,
                search: newValue,
                latLng: {
                    lat: this.place.latLng.lat,
                    lng: this.place.latLng.lng,
                },
            };
            this._invalid = false;
            this._invalid = false;
            return;
        }
        // if blank and not a required input
        if (!newValue && !this.required) {
            this.valueObject = {
                place_id: '',
                search: '',
                latLng: {
                    lat: 0,
                    lng: 0,
                },
            };
            this._place = {};
            this._invalid = true;
            if (!this.hideError) {
                this._invalid = false;
            }
            return;
        }
        // if the new _value matches the value.search, which could happen if
        // the value is changed externally (possibly through data binding) which
        // causes _value to be changed triggering this function _svalChanged()
        if (newValue &&
            this.valueObject &&
            this.valueObject.search &&
            newValue === this.valueObject.search) {
            // nothing has really changed, just return
            return;
        }
        // if the existing value is blank, and the new value is not
        if ((!this.valueObject || !this.valueObject.search) && newValue) {
            this.valueObject = {
                place_id: '',
                search: newValue,
                latLng: {
                    lat: 0,
                    lng: 0,
                },
            };
            this._place = {};
            this._invalid = true;
            if (!this.hideError) {
                this._invalid = true;
            }
            return;
        }
        // otherwise, the value is invalid
        this.valueObject = {
            place_id: '',
            search: newValue,
            latLng: {
                lat: 0,
                lng: 0,
            },
        };
        this._place = {};
        this._invalid = true;
        if (!this.hideError) {
            this._invalid = true;
        }
    }
    _clearLocation() {
        this._value = '';
    }
    /**
     * Geocodes an address
     * @param  {string} address address to be geocoded
     * @param  {object} options Optional - Geocoder Request options
     * @return {Promise<place>}         A promise for a place object or a status on failure
     */
    geocode(address, options) {
        return new Promise((resolve, reject) => {
            if (!this._geocoder) {
                reject(new Error('Geocoder not ready.'));
            }
            else {
                const opts = options || {};
                opts.address = address || '';
                this._geocoder.geocode(opts, (results, status) => {
                    if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                        const p = this._extractPlaceInfo(results[0], opts.address);
                        resolve(p);
                    }
                    else {
                        reject(status);
                    }
                });
            }
        });
    }
    /**
     * Reverse Geocodes a latLng
     * @param  {object} latlng latitude/Longitude {lat: , lng: } to be reverse geocoded
     * @param  {object} options Optional - Geocoder Request options
     * @return {Promise<place>}         A promise for a place object or a status on failure
     */
    reverseGeocode(latlng, options) {
        return new Promise((resolve, reject) => {
            if (!this._geocoder) {
                reject(new Error('Geocoder not ready.'));
            }
            else {
                const opts = options || {};
                if (latlng) {
                    opts.location = latlng;
                }
                this._geocoder.geocode(opts, (results, status) => {
                    if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                        const p = this._extractPlaceInfo(results[0], '');
                        resolve(p);
                    }
                    else {
                        reject(status);
                    }
                });
            }
        });
    }
    _onChangePlace() {
        const pl = this._places.getPlace();
        if (pl.geometry) {
            const p = this._extractPlaceInfo(pl, this.shadowRoot.getElementById('text-field').value);
            this._place = p;
            this._invalid = false;
            this._invalid = false;
            this.latLng = {
                lat: p.latLng.lat,
                lng: p.latLng.lng,
            };
            this._value = this.shadowRoot.getElementById('text-field').value;
            this.valueObject = {
                search: this.shadowRoot.getElementById('text-field').value,
                ...p,
            };
        }
    }
    /**
     * extracts and simplifies a google place result
     * @param  PlaceResult pl google place result
     * @return place
     */
    // eslint-disable-next-line
    _extractPlaceInfo(pl, searchTerm) {
        const p = {
            place_id: pl.place_id,
            formatted_address: pl.formatted_address,
            search: searchTerm || pl.formatted_address,
            latLng: {
                lat: pl.geometry.location.lat(),
                lng: pl.geometry.location.lng(),
            },
            basic: {
                name: pl.name || '',
                address: '',
                city: '',
                state: '',
                stateCode: '',
                postalCode: '',
                country: '',
                countryCode: '',
                phone: pl.formatted_phone_number || '',
            },
            placeDetails: {
                address_components: [],
                icon: pl.icon,
                international_phone_number: pl.international_phone_number || '',
                permanently_closed: pl.permanently_closed || false,
                types: pl.types ? JSON.parse(JSON.stringify(pl.types)) : [],
                website: pl.website || '',
                url: pl.url || '',
                utc_offset_minutes: pl.utc_offset_minutes,
            },
        };
        // extract address components
        const address = {
            street_number: '',
            route: '',
        };
        for (let i = 0; i < pl.address_components.length; i + 1) {
            p.placeDetails.address_components.push(JSON.parse(JSON.stringify(pl.address_components[i])));
            switch (pl.address_components[i].types[0]) {
                case 'locality':
                    p.basic.city = pl.address_components[i].long_name;
                    break;
                case 'administrative_area_level_1':
                    p.basic.stateCode = pl.address_components[i].short_name;
                    p.basic.state = pl.address_components[i].long_name;
                    break;
                case 'country':
                    p.basic.country = pl.address_components[i].long_name;
                    p.basic.countryCode = pl.address_components[i].short_name;
                    break;
                case 'postal_code':
                    p.basic.postalCode = pl.address_components[i].long_name;
                    break;
                case 'street_number':
                    address.street_number = pl.address_components[i].short_name;
                    p.basic.address = `${address.street_number} ${address.route}`;
                    p.basic.streetNumber = address.street_number;
                    break;
                case 'route':
                    address.route = pl.address_components[i].long_name;
                    p.basic.address = `${address.street_number} ${address.route}`;
                    p.basic.route = address.route;
                    break;
                default:
                    address[pl.address_components[i].types[0]] = pl.address_components[i].long_name;
            }
        }
        return p;
    }
    /**
     * Updates the current place, value and latLng with the place provided
     * @param  IpipPlace newPlace the new place
     */
    putPlace(newPlace) {
        if (newPlace && newPlace.place_id && newPlace.latLng) {
            this._place = JSON.parse(JSON.stringify(newPlace));
            this.latLng = {
                lat: newPlace.latLng.lat,
                lng: newPlace.latLng.lng,
            };
            this.valueObject = {
                place_id: newPlace.place_id,
                search: newPlace.search,
                latLng: {
                    lat: newPlace.latLng.lat,
                    lng: newPlace.latLng.lng,
                },
            };
            this._value = newPlace.search;
        }
    }
}
window.customElements.define('lit-place-input', LitPlaceInput);
//# sourceMappingURL=LitPlaceInput.js.map