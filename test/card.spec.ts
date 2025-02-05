import { Task } from '@lit/task';
import { expect } from 'chai';
import { html } from 'lit';
import { type SinonStub, stub } from 'sinon';
import ToolbarStatusChips from '../src/card';
import { ChipEntity } from '../src/entity';
import type { HomeAssistant } from '../src/types';

describe('ToolbarStatusChips', () => {
  let element: ToolbarStatusChips;
  let mockHass: HomeAssistant;
  let createChipsTaskStub: SinonStub;

  beforeEach(() => {
    element = new ToolbarStatusChips();
    mockHass = {
      entities: {},
      devices: {},
      states: {},
      themes: { darkMode: false },
    } as HomeAssistant;

    // Stub the _createChipsTask
    createChipsTaskStub = stub(Task.prototype, 'render');
  });

  afterEach(() => {
    createChipsTaskStub.restore();
  });

  describe('Configuration', () => {
    it('should set config when valid', () => {
      const config = { optional: false, status_path: 'home' };
      element.setConfig(config);
      expect((element as any)['_config']).to.deep.equal(config);
    });

    it('should update config only when different', () => {
      const config = { optional: false, status_path: 'home' };
      element.setConfig(config);
      element.setConfig({ ...config });
      expect((element as any)['_config']).to.deep.equal(config);
    });

    it('should return stub config from static method', () => {
      const stubConfig = ToolbarStatusChips.getStubConfig();
      expect(stubConfig).to.deep.equal({
        optional: false,
        status_path: 'home',
      });
    });
  });

  describe('Property getters', () => {
    beforeEach(() => {
      element.setConfig({
        optional: false,
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

    it('should return correct optional value', () => {
      expect(element.optional).to.be.false;
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
      stub(window, 'URL').returns({ pathname: 'foo/slug' } as any);
      element.setConfig({});
      expect(element.area).to.equal((element as any)._slug);
    });
  });

  describe('HASS updates', () => {
    let mockEntities: any[];

    beforeEach(() => {
      element.setConfig({
        optional: false,
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

  describe('Rendering', () => {
    it('should render empty when no entities', () => {
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
