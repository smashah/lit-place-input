import { TextField } from '@material/mwc-textfield';
import '@google-web-components/google-apis/google-maps-api.js';
import '@material/mwc-icon/mwc-icon-font.js';
export default class LitPlaceInput extends TextField {
    static readonly properties: {
        /**
         * Required: A Maps API key. To obtain an API key, see developers.google.com/maps/documentation/javascript/tutorial#api_key.
         */
        apiKey: {
            type: StringConstructor;
            notify: boolean;
        };
        /**
         * Indicates the Google API is loaded and that Autocomplete suggestions and geocoding functions are available
         */
        apiLoaded: {
            type: BooleanConstructor;
            notify: boolean;
            readOnly: boolean;
        };
        /**
         * Whether to hide the error message
         * If true, the control does not validate that the value is complete (lat/lng, search term, place_id)
         * and has been chosen from the places drop down.
         */
        hideError: {
            type: BooleanConstructor;
            value: boolean;
        };
        /**
         * Whether to hide the place icon
         * If true, the control does not show the place icon in the input box.
         */
        hideIcon: {
            type: BooleanConstructor;
            value: boolean;
        };
        /** @private */
        _geocoder: {
            type: ObjectConstructor;
        };
        /**
         * bias search results to a country code  (ISO 3166-1 Alpha-2 country code, case insensitive).
         */
        searchCountryCode: {
            type: StringConstructor;
        };
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
            type: ObjectConstructor;
        };
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
            type: StringConstructor;
        };
        /**
         * True if the entered text is not valid - i.e. not a selected place and not previously geocoded
         */
        invalid: {
            type: BooleanConstructor;
            notify: boolean;
            readOnly: boolean;
            value: boolean;
        };
        /**
         * Internal representation of invalid, True if the entered text is not valid - i.e. not a selected place and not previously geocoded
         */
        _invalid: {
            type: BooleanConstructor;
            value: boolean;
        };
        /**
         * an object - { lat: number, lng: number } - representing the geolocation of the entered / selected place
         */
        latLng: {
            type: ObjectConstructor;
            notify: boolean;
            readOnly: boolean;
        };
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
            type: ObjectConstructor;
            notify: boolean;
            readOnly: boolean;
        };
        _place: {
            type: ObjectConstructor;
            notify: boolean;
            readOnly: boolean;
        };
        /** @private */
        _places: {
            type: ObjectConstructor;
        };
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
            type: StringConstructor;
            value: string;
        };
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
            type: BooleanConstructor;
            value: boolean;
        };
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
            type: ObjectConstructor;
            notify: boolean;
        };
        /** @private */
        _value: {
            type: StringConstructor;
            notify: boolean;
        };
    };
    constructor();
    updated(changedProperties: any): void;
    firstUpdated(): Promise<void>;
    _mapsApiLoaded(): void;
    /**
     * observer for changes to search bias
     */
    _searchBiasChanged(): void;
    _valueChanged(newValue: any, oldValue: any): void;
    _svalChanged(newValue: any): void;
    _clearLocation(): void;
    /**
     * Geocodes an address
     * @param  {string} address address to be geocoded
     * @param  {object} options Optional - Geocoder Request options
     * @return {Promise<place>}         A promise for a place object or a status on failure
     */
    geocode(address: any, options: any): Promise<unknown>;
    /**
     * Reverse Geocodes a latLng
     * @param  {object} latlng latitude/Longitude {lat: , lng: } to be reverse geocoded
     * @param  {object} options Optional - Geocoder Request options
     * @return {Promise<place>}         A promise for a place object or a status on failure
     */
    reverseGeocode(latlng: any, options: any): Promise<unknown>;
    _onChangePlace(): void;
    /**
     * extracts and simplifies a google place result
     * @param  PlaceResult pl google place result
     * @return place
     */
    _extractPlaceInfo(pl: any, searchTerm: any): {
        place_id: any;
        formatted_address: any;
        search: any;
        latLng: {
            lat: any;
            lng: any;
        };
        basic: {
            name: any;
            address: string;
            city: string;
            state: string;
            stateCode: string;
            postalCode: string;
            country: string;
            countryCode: string;
            phone: any;
        };
        placeDetails: {
            address_components: never[];
            icon: any;
            international_phone_number: any;
            permanently_closed: any;
            types: any;
            website: any;
            url: any;
            utc_offset_minutes: any;
        };
    };
    /**
     * Updates the current place, value and latLng with the place provided
     * @param  IpipPlace newPlace the new place
     */
    putPlace(newPlace: any): void;
}
//# sourceMappingURL=LitPlaceInput.d.ts.map