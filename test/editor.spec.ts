import { ToolbarStatusChipsEditor } from '@/editor';
import { fixture } from '@open-wc/testing-helpers';
import type { Config } from '@type/config';
import type { HomeAssistant } from '@type/homeassistant';
import { expect } from 'chai';
import { nothing, type TemplateResult } from 'lit';
import { stub } from 'sinon';

describe('editor.ts', () => {
  let card: ToolbarStatusChipsEditor;
  let hass: HomeAssistant;
  let dispatchStub: sinon.SinonStub;

  beforeEach(async () => {
    // Create mock HomeAssistant instance
    hass = {
      states: {},
      entities: {},
      devices: {},
    } as HomeAssistant;
    card = new ToolbarStatusChipsEditor();
    dispatchStub = stub(card, 'dispatchEvent');

    card.hass = hass;
  });

  afterEach(() => {
    dispatchStub.restore();
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(card).to.be.instanceOf(ToolbarStatusChipsEditor);
    });

    it('should have default properties', () => {
      expect(card.hass).to.exist;
      expect(card['_config']).to.be.undefined;
    });
  });

  describe('setConfig', () => {
    it('should set the configuration correctly', () => {
      const testConfig: Config = {
        area: 'area_1',
      };

      card.setConfig(testConfig);
      expect(card['_config']).to.deep.equal(testConfig);
    });
  });

  describe('render', () => {
    it('should return nothing when hass is not set', async () => {
      card.hass = undefined as any;
      const result = card.render();
      expect(result).to.equal(nothing);
    });

    it('should return nothing when config is not set', async () => {
      const result = card.render();
      expect(result).to.equal(nothing);
    });

    it('should render ha-form when both hass and config are set', async () => {
      const testConfig: Config = {
        area: 'area_1',
      };
      card.setConfig(testConfig);

      const el = await fixture(card.render() as TemplateResult);
      expect(el.outerHTML).to.equal(
        `<div>
        <h4>
          All settings are optional if you want to use the url slug area
          matching + labels.
        </h4>
        <ha-form></ha-form>
      </div>`,
      );
    });

    it('should pass correct props to ha-form', async () => {
      const testConfig: Config = {
        area: 'area_1',
      };
      card.setConfig(testConfig);

      const el = await fixture(card.render() as TemplateResult);
      const form = el.querySelector('ha-form');
      expect((form as any).hass).to.deep.equal(hass);
      expect((form as any).data).to.deep.equal(testConfig);
      // Test the computeLabel function behavior
      const computeLabel = (form as any).computeLabel;
      expect(typeof computeLabel).to.equal('function');

      // Test with sample schema items
      const sampleSchema = { name: 'test', label: 'Test Label' };
      expect(computeLabel(sampleSchema)).to.equal('Test Label');
      expect((form as any).schema).to.deep.equal([
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
      ]);
    });
  });

  describe('_valueChanged', () => {
    it('should fire config-changed event with config when features are present', () => {
      const testConfig: Config = {
        area: 'area_1',
      };
      card.setConfig(testConfig);

      // Simulate value-changed event
      const detail = {
        value: {
          area: 'area_1',
          features: ['foo'],
        },
      };

      const event = new CustomEvent('value-changed', { detail });
      card['_valueChanged'](event);

      // Verify event was dispatched with correct data
      expect(dispatchStub.calledOnce).to.be.true;
      expect(dispatchStub.firstCall.args[0].type).to.equal('config-changed');
      expect(dispatchStub.firstCall.args[0].detail.config).to.deep.equal({
        area: 'area_1',
        features: ['foo'],
      });
    });

    it('should remove features property when features array is empty', () => {
      const testConfig: Config = {
        area: 'area_1',
      };
      card.setConfig(testConfig);

      // Simulate value-changed event with empty features
      const detail = {
        value: {
          area: 'area_1',
          features: [],
        },
      };

      const event = new CustomEvent('value-changed', { detail });
      card['_valueChanged'](event);

      // Verify event was dispatched with features property removed
      expect(dispatchStub.calledOnce).to.be.true;
      expect(dispatchStub.firstCall.args[0].type).to.equal('config-changed');
      expect(dispatchStub.firstCall.args[0].detail.config).to.deep.equal({
        area: 'area_1',
      });
      expect(dispatchStub.firstCall.args[0].detail.config.features).to.be
        .undefined;
    });

    it('should handle config without features property', () => {
      const testConfig: Config = {
        area: 'area_1',
      };
      card.setConfig(testConfig);

      // Simulate value-changed event without features
      const detail = {
        value: {
          area: 'area_1',
        },
      };

      const event = new CustomEvent('value-changed', { detail });
      card['_valueChanged'](event);

      // Verify event was dispatched correctly
      expect(dispatchStub.calledOnce).to.be.true;
      expect(dispatchStub.firstCall.args[0].type).to.equal('config-changed');
      expect(dispatchStub.firstCall.args[0].detail.config).to.deep.equal({
        area: 'area_1',
      });
    });
  });
});
