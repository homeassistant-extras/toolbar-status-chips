import { createChipConfig } from '@/config';
import { ChipEntity } from '@/entity';
import { addMarginForChips, entitiesThatShouldBeChips } from '@/helpers';
import { Task } from '@lit/task';
import type { Config } from '@type/config';
import type { HomeAssistant } from '@type/homeassistant';
import { CSSResult, html, LitElement } from 'lit';
import { state } from 'lit/decorators.js';
import { version } from '../package.json';
import { chipStyles, styles } from './styles';
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

  // for editor
  public editMode: boolean = false;

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
    const styles = chipStyles(this.isEditing);
    return this._entities.length
      ? this._createChipsTask.render({
          initial: () => html``,
          pending: () => html``,
          complete: (value) =>
            html`<div id="chips" style="${styles}">${value}</div>`,
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
    return (
      this._config.features?.includes('optional') ||
      this.area === this.statusPath
    );
  }

  get soloLabel() {
    return this._config.solo_label;
  }

  get statusPath() {
    return this._config.status_path || 'home';
  }

  get isEditing(): boolean {
    return (
      this.editMode ||
      (this as HTMLElement).parentElement?.classList.contains('preview') ||
      false
    );
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
      if (this.additionalLabel && this.additionalLabel !== '') {
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

  // card configuration
  static getConfigElement() {
    return document.createElement('toolbar-status-chips-editor');
  }

  public static async getStubConfig(hass: HomeAssistant): Promise<Config> {
    // Get all area IDs and their details
    const areas = Object.entries(hass.areas);

    // Track area entity counts
    const areaStatusCounts = new Map<string, number>();

    // Count status entities for each area
    areas.forEach(([areaId, _]) => {
      // Get all entities for this area
      const devices = Object.values(hass.devices)
        .filter((device) => device.area_id === areaId)
        .map((device) => device.id);
      const areaEntities = Object.entries(hass.entities).filter(
        ([_, entity]) =>
          entity.area_id === areaId || devices.includes(entity.device_id),
      );

      // Count entities with status label
      const statusCount = areaEntities.filter(([_, entity]) =>
        entity.labels?.includes('status'),
      ).length;

      if (statusCount > 0) {
        areaStatusCounts.set(areaId, statusCount);
      }
    });

    // Find area with highest count
    let maxAreaId = '';
    let maxCount = 0;

    areaStatusCounts.forEach((count, areaId) => {
      if (count > maxCount) {
        maxCount = count;
        maxAreaId = areaId;
      }
    });

    return {
      area: maxAreaId,
    };
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
}
