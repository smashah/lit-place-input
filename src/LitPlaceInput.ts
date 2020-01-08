import { TextField } from '@material/mwc-textfield';
import '@google-web-components/google-apis/google-maps-api.js';
import '@material/mwc-icon/mwc-icon-font.js';
import { property, customElement } from 'lit-element';

@customElement('lit-place-input')
class LitPlaceInput extends TextField {
  @property({ type: String, reflect: true })
  apiKey = '';

  @property({ type: Boolean, reflect: true })
  apiLoaded = false;

  @property({ type: Boolean })
  hideError = false;

  @property({ type: Boolean })
  hideIcon = false;

  @property({ type: Object })
  _geocoder: any;

  @property({ type: String })
  searchCountryCode: any;

  @property({ type: Object })
  searchBounds = {};

  @property({ type: String })
  searchType: any;

  @property({ type: Boolean, reflect: true })
  invalid = false;

  @property({ type: Boolean, reflect: true })
  searchBoundsStrict = false;

  @property({ type: Boolean })
  _invalid = false;

  @property({ type: Object, reflect: true })
  latLng = {
    lat: 0,
    lng: 0,
  };

  @property({ type: Object, reflect: true })
  place: any = {};

  @property({ type: Object })
  _place = {};

  @property({ type: Object })
  _places: any;

  @property({ type: String })
  language = '';

  @property({ type: Boolean })
  minimizeApi = false;

  @property({ type: Object })
  valueObject: any;

  @property({ type: String, reflect: true })
  _value: any;

  constructor() {
    super();
    this.validationMessage = 'Invalid - please select a place';
    this.icon = 'place';
  }

  updated(changedProperties: any) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue: any, propName: string) => {
      // @ts-ignore
      // if(this[propName] && this[propName]!=={} && !this[propName]!=="")
      this.dispatchEvent(
        new CustomEvent(`${propName}-changed`, {
          detail: {
            // @ts-ignore
            [propName]: this[propName],
          },
        }),
      );
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
          this._searchBiasChanged();
          break;
        default:
          break;
      }
    });
  }

  get root() {
    return this.shadowRoot || this;
  }

  gbid(tag: string) {
    // @ts-ignore
    return this.root.getElementById(tag);
  }

  async firstUpdated() {
    super.firstUpdated();
    const gmaps: any = document.createElement('google-maps-api');
    gmaps.apiKey = this.apiKey;
    gmaps.version = '3.exp';
    gmaps.id = 'gmaps-api';
    gmaps.addEventListener(
      'api-load',
      (() => {
        this._mapsApiLoaded();
        // eslint-disable-next-line
      }).bind(this),
    );
    this.root.append(gmaps);
  }

  _mapsApiLoaded() {
    // @ts-ignore
    const { google } = window;
    if (!this._geocoder && !this._places) {
      this._geocoder = new google.maps.Geocoder();
      this._places = new google.maps.places.Autocomplete(this.gbid('text-field'), {});
      google.maps.event.addListener(this._places, 'place_changed', this._onChangePlace.bind(this));
      this.apiLoaded = true;
      this._searchBiasChanged();
      this.dispatchEvent(
        new CustomEvent('api-loaded', {
          detail: {
            text: 'Google api is ready',
          },
        }),
      );
    }
  }

  /**
   * observer for changes to search bias
   */

  _searchBiasChanged() {
    const { searchCountryCode, searchBounds, searchType } = this;
    if (this.apiLoaded) {
      if (
        searchBounds &&
        // eslint-disable-next-line
        searchBounds.hasOwnProperty('east') &&
        // eslint-disable-next-line
        searchBounds.hasOwnProperty('west') &&
        // eslint-disable-next-line
        searchBounds.hasOwnProperty('north') &&
        // eslint-disable-next-line
        searchBounds.hasOwnProperty('south')
      ) {
        this._places.setBounds(searchBounds);
      } else {
        this._places.setBounds();
      }
      if (searchCountryCode && searchCountryCode.length === 2) {
        this._places.setComponentRestrictions({
          country: searchCountryCode.toString(),
        });
      } else {
        this._places.setComponentRestrictions();
      }
      if (
        searchType &&
        ['address', 'geocode', 'establishment', '(regions)', '(cities)'].includes(searchType)
      ) {
        this._places.setTypes([searchType.toString()]);
      } else {
        this._places.setTypes([]);
      }
    }
  }

  _valueChanged(newValue: any, oldValue: any) {
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

  _svalChanged(newValue: any) {
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
    if (
      newValue &&
      this.valueObject &&
      this.valueObject.search &&
      newValue === this.valueObject.search
    ) {
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
  geocode(address: string, options: any) {
    return new Promise((resolve, reject) => {
      if (!this._geocoder) {
        reject(new Error('Geocoder not ready.'));
      } else {
        const opts = options || {};
        opts.address = address || '';
        this._geocoder.geocode(opts, (results: any, status: any) => {
          // @ts-ignore
          // eslint-disable-next-line
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            const p = this._extractPlaceInfo(results[0], opts.address);
            resolve(p);
          } else {
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
  reverseGeocode(latlng: any, options: any) {
    return new Promise((resolve, reject) => {
      if (!this._geocoder) {
        reject(new Error('Geocoder not ready.'));
      } else {
        const opts = options || {};
        if (latlng) {
          opts.location = latlng;
        }
        this._geocoder.geocode(opts, (results: any, status: any) => {
          // @ts-ignore
          // eslint-disable-next-line
          if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
            const p = this._extractPlaceInfo(results[0], '');
            resolve(p);
          } else {
            reject(status);
          }
        });
      }
    });
  }

  _onChangePlace() {
    const pl = this._places.getPlace();
    if (pl.geometry) {
      const p = this._extractPlaceInfo(pl, this.gbid('text-field').value);
      this._place = p;
      // this._invalid = false;
      // this._invalid = false;
      this.latLng = {
        lat: p.latLng.lat,
        lng: p.latLng.lng,
      };
      this._value = this.gbid('text-field').value;
      this.valueObject = {
        search: this.gbid('text-field').value,
        ...p,
      };
      this.place = this.valueObject;
    }
  }

  /**
   * extracts and simplifies a google place result
   * @param  PlaceResult pl google place result
   * @return place
   */

  // eslint-disable-next-line
  _extractPlaceInfo(pl: any, searchTerm: any) {
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
    // eslint-disable-next-line
    for (let i = 0; i < pl.address_components.length; i++) {
      // @ts-ignore
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
          // @ts-ignore
          p.basic.streetNumber = address.street_number;
          break;
        case 'route':
          address.route = pl.address_components[i].long_name;
          p.basic.address = `${address.street_number} ${address.route}`;
          // @ts-ignore
          p.basic.route = address.route;
          break;
        default:
          // @ts-ignore
          address[pl.address_components[i].types[0]] = pl.address_components[i].long_name;
      }
    }
    return p;
  }

  /**
   * Updates the current place, value and latLng with the place provided
   * @param  IpipPlace newPlace the new place
   */
  putPlace(newPlace: any) {
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

// window.customElements.define('lit-place-input', LitPlaceInput);
export { LitPlaceInput };
