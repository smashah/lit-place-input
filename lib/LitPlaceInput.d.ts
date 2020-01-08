import { TextField } from '@material/mwc-textfield';
import '@google-web-components/google-apis/google-maps-api.js';
import '@material/mwc-icon/mwc-icon-font.js';
declare class LitPlaceInput extends TextField {
    apiKey: string;
    apiLoaded: boolean;
    hideError: boolean;
    hideIcon: boolean;
    _geocoder: any;
    searchCountryCode: any;
    searchBounds: {};
    searchType: any;
    invalid: boolean;
    searchBoundsStrict: boolean;
    _invalid: boolean;
    latLng: {
        lat: number;
        lng: number;
    };
    place: any;
    _place: {};
    _places: any;
    language: string;
    minimizeApi: boolean;
    valueObject: any;
    _value: any;
    constructor();
    updated(changedProperties: any): void;
    readonly root: this | ShadowRoot;
    gbid(tag: string): any;
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
    geocode(address: string, options: any): Promise<unknown>;
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
export { LitPlaceInput };
//# sourceMappingURL=LitPlaceInput.d.ts.map