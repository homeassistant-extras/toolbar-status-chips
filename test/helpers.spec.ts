import { expect } from 'chai';
import { type SinonStub, stub } from 'sinon';
import { addMarginForChips, entitiesThatShouldBeChips } from '../src/helpers';
import type { Entity, HomeAssistant } from '../src/types';

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
