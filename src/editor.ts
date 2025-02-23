import { fireEvent } from '@common/fire-event';
import type { Config } from '@type/config';
import type { HaFormSchema } from '@type/ha-form';
import type { HomeAssistant } from '@type/homeassistant';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';

const SCHEMA: HaFormSchema[] = [
  {
    name: 'area',
    label: 'Remove this property if you want to use url slug instead.',
    required: false,
    selector: { area: {} },
  },
  {
    name: 'additional_label',
    label:
      "Have another label to show chips for to combine with area ones? (e.g. 'network', 'lab', etc.)",
    required: false,
    selector: { label: {} },
  },
  {
    name: 'solo_label',
    label:
      'Have a label that will rule them all - use this, ignores area/url slug matching..',
    required: false,
    selector: { label: {} },
  },
  {
    name: 'status_path',
    label: 'Main dashboard path if not "home".',
    selector: { text: {} },
  },
  {
    name: 'features',
    label: 'Features',
    required: false,
    selector: {
      select: {
        multiple: true,
        mode: 'list',
        options: [
          {
            label: 'Hide inactive chips if not on "home" path.',
            value: 'optional',
          },
        ],
      },
    },
  },
];

export class ToolbarStatusChipsEditor extends LitElement {
  /**
   * Card configuration object
   */
  @state()
  private _config!: Config;

  /**
   * Home Assistant instance
   * Not marked as @state as it's handled differently
   */
  public hass!: HomeAssistant;

  /**
   * Renders the lit element card
   * @returns {TemplateResult} The rendered HTML template
   */
  override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) {
      return nothing;
    }

    return html`
      <div>
        <h4>
          All settings are optional if you want to use the url slug area
          matching + labels.
        </h4>
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${SCHEMA}
          .computeLabel=${(s: HaFormSchema) => s.label}
          @value-changed=${this._valueChanged}
        ></ha-form>
      </div>
    `;
  }

  /**
   * Sets up the card configuration
   * @param {EditorConfig} config - The card configuration
   */
  setConfig(config: Config) {
    this._config = config;
  }

  private _valueChanged(ev: CustomEvent) {
    const config = ev.detail.value as Config;
    if (!config.features?.length) {
      delete config.features;
    }

    fireEvent(this, 'config-changed', {
      config,
    });
  }
}
