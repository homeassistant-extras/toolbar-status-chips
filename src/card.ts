import { createChipConfig } from '@/config';
import { ChipEntity } from '@/entity';
import { addMarginForChips, entitiesThatShouldBeChips } from '@/helpers';
import { Task } from '@lit/task';
import type { Config } from '@type/config';
import type { HomeAssistant } from '@type/homeassistant';
import { CSSResult, html, LitElement, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { version } from '../package.json';
import { chipStyles, styles } from './styles';
const equal = require('fast-deep-equal');

/**
 * Declaration for the loadCardHelpers function provided by Home Assistant
 * Used to create and configure card elements
 */
declare function loadCardHelpers(): Promise<any>;

/**
 * Main component class for the Toolbar Status Chips
 * Displays entity statuses as chips in the Home Assistant toolbar
 */
export default class ToolbarStatusChips extends LitElement {
  /**
   * Card configuration object
   * @state Marks this as a reactive property that will trigger updates
   */
  @state()
  private _config!: Config;

  /**
   * Collection of entities to be displayed as chips
   * @state Marks this as a reactive property that will trigger updates
   */
  @state()
  private _entities!: ChipEntity[];

  /**
   * Current URL slug extracted from the document URL
   * Used for automatic area matching when no area is explicitly configured
   * @state Marks this as a reactive property that will trigger updates
   */
  @state()
  private _slug: string | undefined;

  /**
   * Reference to the current Home Assistant instance
   * Not marked as @state as it's handled differently
   */
  private _hass!: HomeAssistant;

  /**
   * Flag indicating whether the card is in edit mode
   * Used by the Home Assistant card editor
   */
  public editMode: boolean = false;

  /**
   * Creates an instance of ToolbarStatusChips
   * Extracts the current URL slug and logs version information
   */
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

  /**
   * Renders the lit element card
   * Displays chips based on the current entities if available
   * @returns {TemplateResult} The rendered HTML template
   */
  override render(): TemplateResult {
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

  /**
   * Defines the CSS styles for the component
   * Positions the status chips at the top of the toolbar
   * @returns {CSSResult} The component styles
   */
  static override get styles(): CSSResult {
    return styles;
  }

  /**
   * Gets the additional label from configuration
   * Used to filter entities by an additional label
   * @returns {string | undefined} The configured additional label
   */
  get additionalLabel() {
    return this._config.additional_label;
  }

  /**
   * Gets the area ID to filter entities by
   * Falls back to the URL slug if no area is configured
   * @returns {string | undefined} The area ID to use for filtering
   */
  get area() {
    return this._config.area || this._slug;
  }

  /**
   * Determines if optional entities should be shown
   * True if explicitly configured or if viewing the status path
   * @returns {boolean} Whether optional entities should be shown
   */
  get optional() {
    return (
      this._config.features?.includes('optional') ||
      this.area === this.statusPath
    );
  }

  /**
   * Gets the solo label from configuration
   * When set, only entities with this label are shown, ignoring area filtering
   * @returns {string | undefined} The configured solo label
   */
  get soloLabel() {
    return this._config.solo_label;
  }

  /**
   * Gets the status path from configuration
   * Defaults to 'home' if not configured
   * @returns {string} The path identifier for the status/home view
   */
  get statusPath() {
    return this._config.status_path || 'home';
  }

  /**
   * Determines if the card is currently in editing mode
   * True if editMode is explicitly set or if parent has 'preview' class
   * @returns {boolean} Whether the card is being edited
   */
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

  /**
   * Sets the card configuration
   * Only updates if the new config is different from the current one
   * @param {Config} config - The new card configuration
   */
  setConfig(config: Config) {
    if (!equal(config, this._config)) {
      this._config = config;
    }
  }

  /**
   * Updates the card when Home Assistant state changes
   * Filters entities based on labels and area, then creates chips for matching entities
   * @param {HomeAssistant} hass - The new Home Assistant state
   */
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

  /**
   * Returns the configuration element for the card editor
   * @returns {HTMLElement} The card editor element
   */
  static getConfigElement() {
    return document.createElement('toolbar-status-chips-editor');
  }

  /**
   * Generates a default configuration based on Home Assistant state
   * Finds the area with the most status-labeled entities
   * @param {HomeAssistant} hass - The Home Assistant state
   * @returns {Promise<Config>} The generated configuration
   */
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

  /**
   * Task that creates the chip cards asynchronously
   * Uses the Home Assistant card helpers to create a horizontal stack of chips
   */
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
