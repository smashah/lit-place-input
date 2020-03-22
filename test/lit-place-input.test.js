import { html, fixture, expect } from '@open-wc/testing';

import '../lit-place-input.js';

describe('LitPlaceInput', () => {
  it('has a label "Choose Place" and shows API Error', async () => {
    const el = await fixture(html`
      <lit-place-input></lit-place-input>
    `);

    expect(el.label).to.equal('Please use valid API Key');
    expect(el.disabled).to.equal(true);
  });

  it('has a default label "Choose Place" with valid api key', async () => {
    const el = await fixture(html`
      <lit-place-input .apiKey=${"AIzaSyCQjwnft-x6cXQYDkGNYBzaevanW3mVNBA"} ></lit-place-input>
    `);
    expect(el.label).to.equal('Choose Place');
  });

  it('can override the label via attribute', async () => {
    const el = await fixture(html`
      <lit-place-input .apiKey=${"AIzaSyCQjwnft-x6cXQYDkGNYBzaevanW3mVNBA"} label="attribute label" ></lit-place-input>
    `);

    expect(el.label).to.equal('attribute label');
  });

  // it('passes the a11y audit', async () => {
  //   const el = await fixture(html`
  //     <lit-place-input></lit-place-input>
  //   `);

  //   await expect(el).shadowDom.to.be.accessible();
  // });
});
