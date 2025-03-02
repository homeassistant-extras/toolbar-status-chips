import ToolbarStatusChips from '@/card';
import { ChipEntity } from '@/entity';
import type { HomeAssistant } from '@/types/homeassistant';
import { Task } from '@lit/task';
import { expect } from 'chai';
import { html } from 'lit';
import { stub } from 'sinon';
import { version } from '../package.json';

describe('card.ts', () => {
  let element: ToolbarStatusChips;
  let mockHass: HomeAssistant;
  let consoleInfoStub: sinon.SinonStub;
  let createChipsTaskStub: sinon.SinonStub;

  beforeEach(() => {
    consoleInfoStub = stub(console, 'info');
    createChipsTaskStub = stub(Task.prototype, 'render');
    element = new ToolbarStatusChips();
    mockHass = {
      entities: {
        'light.living_room': {
          entity_id: 'light.living_room',
          labels: ['status'],
          area_id: 'living_room',
          device_id: 'device_1',
        },
      },
      devices: {},
      states: {},
      areas: {},
      themes: { darkMode: false },
    } as HomeAssistant;
    element.setConfig({ area: '' });
    element.hass = mockHass as HomeAssistant;
  });

  afterEach(() => {
    consoleInfoStub.restore();
    createChipsTaskStub.restore();
  });

  describe('constructor', () => {
    it('should log the version with proper formatting', () => {
      // Assert that console.info was called once
      expect(consoleInfoStub.calledOnce).to.be.true;

      // Assert that it was called with the expected arguments
      expect(
        consoleInfoStub.calledWithExactly(
          `%c🐱 Poat's Tools: toolbar-status-chips - ${version}`,
          'color: #CFC493;',
        ),
      ).to.be.true;
    });
  });

  describe('Configuration', () => {
    it('should set config when valid', () => {
      expect((element as any)['_config']).to.deep.equal({
        area: '',
      });
    });

    it('should update config only when different', () => {
      const config = { area: '' };
      element.setConfig(config);
      element.setConfig({ ...config });
      expect((element as any)['_config']).to.deep.equal(config);
    });

    it('should return correct editor element', () => {
      const editor = ToolbarStatusChips.getConfigElement();
      expect(editor.tagName.toLowerCase()).to.equal(
        'toolbar-status-chips-editor',
      );
    });
  });

  describe('Property getters', () => {
    beforeEach(() => {
      element.setConfig({
        status_path: 'home',
        area: 'living_room',
        additional_label: 'test',
        solo_label: 'solo',
      });
    });

    it('should return correct additionalLabel', () => {
      expect(element.additionalLabel).to.equal('test');
    });

    it('should return correct area', () => {
      expect(element.area).to.equal('living_room');
    });

    it('should return correct optional value when not on status_path', () => {
      expect(element.optional).to.be.false;
    });

    it('should return correct optional value when set', () => {
      element.setConfig({ features: ['optional'] });
      expect(element.optional).to.be.true;
    });

    it('should return correct optional value when on status_path', () => {
      element.setConfig({ status_path: 'foo', area: 'foo' });
      expect(element.optional).to.be.true;
    });

    it('should return correct soloLabel', () => {
      expect(element.soloLabel).to.equal('solo');
    });

    it('should return correct statusPath', () => {
      expect(element.statusPath).to.equal('home');
    });

    it('should use default statusPath when not provided', () => {
      element.setConfig({});
      expect(element.statusPath).to.equal('home');
    });

    it('should use slug as area when area not provided', () => {
      const windowStub = stub(window, 'URL');
      windowStub.returns({ pathname: 'foo/slug' } as any);
      element.setConfig({});
      expect(element.area).to.equal((element as any)._slug);
      windowStub.restore();
    });
  });

  describe('HASS updates', () => {
    let mockEntities: any[];

    beforeEach(() => {
      element.setConfig({
        status_path: 'home',
      });

      mockEntities = [
        {
          entity_id: 'light.living_room',
          labels: ['status'],
          state: 'on',
          attributes: {},
        },
      ];

      mockHass.entities = {
        'light.living_room': mockEntities[0],
      };
    });

    it('should update entities when hass changes', () => {
      element.hass = mockHass;
      expect((element as any)._entities).to.not.be.undefined;
    });

    it('should filter entities by solo label', () => {
      element.setConfig({
        solo_label: 'test_label',
      });
      mockEntities[0].labels = ['test_label'];
      element.hass = mockHass;
      expect((element as any)._entities).to.have.lengthOf(1);
    });

    it('should filter entities by area', () => {
      element.setConfig({
        area: 'test_area',
      });
      mockHass.devices = {
        device1: {
          id: 'device1',
          area_id: 'test_area',
        },
      };
      mockEntities[0].device_id = 'device1';
      element.hass = mockHass;
      expect((element as any)._entities).to.have.lengthOf(1);
    });
  });

  describe('Stub Config Generation', () => {
    it('should return config for area with most status entities', async () => {
      mockHass.areas = {
        area1: { area_id: 'area1', icon: '' },
        area2: { area_id: 'area2', icon: '' },
      };

      mockHass.devices = {
        device1: { id: 'device1', area_id: 'area1' },
        device2: { id: 'device2', area_id: 'area2' },
      };

      mockHass.entities = {
        'light.area1_1': {
          entity_id: 'light.area1_1',
          device_id: 'device1',
          labels: ['status'],
          area_id: '',
        },
        'light.area1_2': {
          entity_id: 'light.area1_2',
          device_id: 'device1',
          labels: ['status'],
          area_id: '',
        },
        'light.area2_1': {
          entity_id: 'light.area2_1',
          device_id: 'device2',
          labels: ['status'],
          area_id: '',
        },
      };

      const stubConfig = await ToolbarStatusChips.getStubConfig(mockHass);
      expect(stubConfig).to.deep.equal({
        area: 'area1', // area1 has 2 status entities vs area2's 1
      });
    });

    it('should handle areas with no status entities', async () => {
      mockHass.areas = {
        area1: { area_id: 'area1', icon: '' },
      };

      mockHass.devices = {
        device1: { id: 'device1', area_id: 'area1' },
      };

      mockHass.entities = {
        'light.area1_1': {
          entity_id: 'light.area1_1',
          device_id: 'device1',
          labels: ['not-status'],
          area_id: '',
        },
      };

      const stubConfig = await ToolbarStatusChips.getStubConfig(mockHass);
      expect(stubConfig).to.deep.equal({
        area: '', // No areas have status entities
      });
    });
  });

  describe('isEditing Property', () => {
    it('should return true when editMode is true', () => {
      element.editMode = true;
      expect(element.isEditing).to.be.true;
    });

    it('should return true when parent has preview class', async () => {
      // Create a mock parent element
      const mockParentElement = {
        classList: {
          contains: (className: string) => className === 'preview',
        },
      };

      // Use Object.defineProperty to mock the parentElement property
      Object.defineProperty(element, 'parentElement', {
        get: () => mockParentElement,
        configurable: true, // Allow the property to be redefined later
      });

      // Verify isEditing returns true
      expect(element.isEditing).to.be.true;

      // Clean up - restore the original property descriptor
      Object.defineProperty(element, 'parentElement', {
        value: null,
        configurable: true,
      });
    });

    it('should return false when neither condition is met', () => {
      element.editMode = false;
      expect(element.isEditing).to.be.false;
    });
  });

  describe('Rendering', () => {
    it('should render empty when no entities', () => {
      mockHass.entities = {};
      element.hass = mockHass;
      const result = element.render();
      expect(result).to.deep.equal(html``);
    });

    it('should render chips when entities exist', () => {
      (element as any)._entities = [new ChipEntity('test.entity', 'on', {})];
      element.render();
      expect(createChipsTaskStub.called).to.be.true;
    });
  });
});
