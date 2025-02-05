import { Task } from '@lit/task';
import { CSSResult, html, LitElement } from 'lit';
import { state } from 'lit/decorators.js';
import { version } from '../package.json';
import { createChipConfig } from './config';
import { ChipEntity } from './entity';
import { addMarginForChips, entitiesThatShouldBeChips } from './helpers';
import { styles } from './styles';
import type { Config, HomeAssistant } from './types';
const equal = require('fast-deep-equal');

declare function loadCardHelpers(): Promise<any>;

export default class ToolbarStatusChips extends LitElement {
  @state()
  private _config!: Config;

  @state()
  private _entities!: ChipEntity[];

  @state()
  private _slug: string | undefined;

  // not state
  private _hass!: HomeAssistant;

  constructor() {
    super();
    this._slug = document?.URL?.split('?')[0]
      ?.split('/')
      ?.pop()
      ?.replace('-', '_');

    console.info(
      `%c🐱 Poat's Tools: toolbar-status-chips - ${version}`,
      'color: #CFC493;',
    );
  }

  override render() {
    return this._entities
      ? this._createChipsTask.render({
          initial: () => html``,
          pending: () => html``,
          complete: (value) => html`<div id="chips">${value}</div>`,
          error: (error) => html`${error}`,
        })
      : html``;
  }

  // styles to position the status chips at the top of on the toolbar
  static override get styles(): CSSResult {
    return styles;
  }

  // config property getters
  get additionalLabel() {
    return this._config.additional_label;
  }

  get area() {
    return this._config.area || this._slug;
  }

  get optional() {
    return this._config.optional !== undefined
      ? this._config.optional
      : this.area === this.statusPath;
  }

  get soloLabel() {
    return this._config.solo_label;
  }

  get statusPath() {
    return this._config.status_path || 'home';
  }

  /*
   * HASS setup
   */

  // The user supplied configuration. Throw an exception and Home Assistant
  // will render an error card.
  setConfig(config: Config) {
    if (!equal(config, this._config)) {
      this._config = config;
    }
  }

  // Whenever the state changes, a new `hass` object is set. Use this to
  // update your content.
  set hass(hass: HomeAssistant) {
    // get entities with the status label
    let entities = Object.values(hass.entities).filter((entity) =>
      entity.labels.includes(this.soloLabel || 'status'),
    );

    // filter entities by additional label if provided or area if not on the status page
    if (!this.soloLabel) {
      // solo label trumps additional filtering
      if (this.additionalLabel !== undefined && this.additionalLabel !== '') {
        entities = entities.filter((entity) =>
          entity.labels.includes(this.additionalLabel!),
        );
      } else if (this.area !== this.statusPath) {
        // filter entities by area as well
        const devices = Object.values(hass.devices)
          .filter((device) => device.area_id === this.area)
          .map((device) => device.id);
        entities = entities.filter(
          (entity) =>
            entity.area_id === this.area || devices.includes(entity.device_id),
        );
      }
    }

    const chips = entitiesThatShouldBeChips(entities, hass, this.optional);

    // check if the entities have changed - update the card
    if (!equal(chips, this._entities)) {
      // no need to check states if entities have changed
      this._entities = chips;
      this._hass = hass;
      this._createChipsTask.run();
    }
  }

  // Task handles async work
  _createChipsTask = new Task(this, {
    task: async () => {
      const helpers = await loadCardHelpers();
      const cards = this._entities.map((entity) =>
        createChipConfig(entity, this._hass),
      );

      if (!cards.length) {
        addMarginForChips(0);
        return;
      }

      var stack = helpers.createCardElement({
        type: 'horizontal-stack',
        cards,
      });
      stack.hass = this._hass;

      addMarginForChips();

      return stack;
    },
    args: () => [],
  });

  static getStubConfig() {
    return {
      optional: false,
      status_path: 'home',
    };
  }
}
