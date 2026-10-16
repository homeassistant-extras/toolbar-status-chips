import {
  addMarginForChips,
  entitiesThatShouldBeChips,
  getChipsTopOffset,
} from '@/helpers';
import type { Entity, HomeAssistant } from '@type/homeassistant';
import { expect } from 'chai';
import { type SinonStub, stub } from 'sinon';

describe('helpers.ts', () => {
  describe('entitiesThatShouldBeChips', () => {
    let mockHass: HomeAssistant;
    let mockEntities: Entity[];

    beforeEach(() => {
      mockHass = {
        states: {
          'light.living_room': {
            entity_id: 'light.living_room',
            state: 'on',
            attributes: {},
          },
        },
        devices: {},
        entities: {},
        areas: {},
        themes: { darkMode: false },
      } as HomeAssistant;

      mockEntities = [
        {
          entity_id: 'light.living_room',
          area_id: 'living_room',
          device_id: 'device_1',
          labels: ['status'],
        },
      ];
    });

    it('should merge entities with their states', () => {
      const result = entitiesThatShouldBeChips(mockEntities, mockHass, false);
      expect(result[0]?.entity_id).to.equal('light.living_room');
      expect(result[0]?.state).to.equal('on');
    });

    it('should exclude entities with excludeOnStatusPath when optional is true', () => {
      // Create a mock entity with excludeOnStatusPath attribute set to true
      mockEntities = [
        {
          entity_id: 'light.living_room',
          area_id: 'living_room',
          device_id: 'device_1',
          labels: ['status'],
        },
      ];

      // Set up the state with excludeOnStatusPath attribute
      mockHass.states = {
        'light.living_room': {
          entity_id: 'light.living_room',
          state: 'on',
          attributes: {
            exclude_on_status_path: true,
          },
        },
      };

      // Call the function with optional=true
      const result = entitiesThatShouldBeChips(mockEntities, mockHass, true);

      // Assert that no entities are returned because it should be excluded
      expect(result).to.have.lengthOf(0);
    });
  });

  describe('addMarginForChips', () => {
    let matchMediaStub: SinonStub;
    let mockViewContainer: HTMLElement;
    let querySelectorStub: SinonStub;

    beforeEach(() => {
      matchMediaStub = stub(window, 'matchMedia');
      mockViewContainer = document.createElement('div');
      querySelectorStub = stub(document, 'querySelector').returns({
        shadowRoot: {
          querySelector: () => ({
            shadowRoot: {
              querySelector: () => ({
                querySelector: () => ({
                  shadowRoot: {
                    querySelector: () => ({
                      shadowRoot: {
                        querySelector: () => mockViewContainer,
                      },
                    }),
                  },
                }),
              }),
            },
          }),
        },
      } as any);
    });

    afterEach(() => {
      matchMediaStub.restore();
      querySelectorStub.restore();
    });

    it('should add margin on mobile viewport', () => {
      matchMediaStub.returns({ matches: true } as MediaQueryList);
      addMarginForChips(45);
      expect(mockViewContainer.style.marginTop).to.equal('45px');
    });

    it('should not add margin on desktop viewport', () => {
      matchMediaStub.returns({ matches: false } as MediaQueryList);
      addMarginForChips(45);
      expect(mockViewContainer.style.marginTop).to.equal('');
    });

    it('should use default margin of 45px when no value provided', () => {
      matchMediaStub.returns({ matches: true } as MediaQueryList);
      addMarginForChips();
      expect(mockViewContainer.style.marginTop).to.equal('45px');
    });

    it('should handle missing DOM elements gracefully', () => {
      matchMediaStub.returns({ matches: true } as MediaQueryList);
      querySelectorStub.returns(null);
      // Should not throw an error
      expect(() => addMarginForChips()).to.not.throw();
    });
  });

  describe('getChipsTopOffset', () => {
    let matchMediaStub: SinonStub;
    let querySelectorStub: SinonStub;
    let mockHeader: HTMLElement;
    let rect: Partial<DOMRect>;

    beforeEach(() => {
      matchMediaStub = stub(window, 'matchMedia');
      mockHeader = document.createElement('div');
      rect = { top: 0, bottom: 103, height: 103 };
      mockHeader.getBoundingClientRect = () => rect as DOMRect;
      querySelectorStub = stub(document, 'querySelector').returns({
        shadowRoot: {
          querySelector: () => ({
            shadowRoot: {
              querySelector: () => ({
                querySelector: () => ({
                  shadowRoot: {
                    querySelector: () => ({
                      shadowRoot: {
                        querySelector: () => mockHeader,
                      },
                    }),
                  },
                }),
              }),
            },
          }),
        },
      } as any);
    });

    afterEach(() => {
      matchMediaStub.restore();
      querySelectorStub.restore();
    });

    it('should place chips below the header on mobile', () => {
      matchMediaStub.returns({ matches: true } as MediaQueryList);
      expect(getChipsTopOffset()).to.equal(107);
    });

    it('should use a custom gap', () => {
      matchMediaStub.returns({ matches: true } as MediaQueryList);
      expect(getChipsTopOffset(10)).to.equal(113);
    });

    it('should return undefined on desktop', () => {
      matchMediaStub.returns({ matches: false } as MediaQueryList);
      expect(getChipsTopOffset()).to.be.undefined;
    });

    it('should return undefined when the header is hidden', () => {
      matchMediaStub.returns({ matches: true } as MediaQueryList);
      rect = { top: 0, bottom: 0, height: 0 };
      expect(getChipsTopOffset()).to.be.undefined;
    });

    it('should return undefined when the header is at the bottom', () => {
      matchMediaStub.returns({ matches: true } as MediaQueryList);
      const bottom = window.innerHeight;
      rect = { top: bottom - 56, bottom, height: 56 };
      expect(getChipsTopOffset()).to.be.undefined;
    });

    it('should handle missing DOM elements gracefully', () => {
      matchMediaStub.returns({ matches: true } as MediaQueryList);
      querySelectorStub.returns(null);
      expect(getChipsTopOffset()).to.be.undefined;
    });
  });
});
