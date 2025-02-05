import { expect } from 'chai';
import { createChipConfig } from '../src/config';
import { ChipEntity } from '../src/entity';
import type { HomeAssistant } from '../src/types';

describe('createChipConfig', () => {
  let mockEntity: ChipEntity;
  let mockHass: HomeAssistant;

  beforeEach(() => {
    mockEntity = new ChipEntity('light.living_room', 'on', {
      navigation_path: '/test',
    });
    mockHass = {
      themes: {
        darkMode: false,
      },
    } as HomeAssistant;
  });

  it('should create correct base config', () => {
    const config = createChipConfig(mockEntity, mockHass);
    expect(config.type).to.equal('custom:button-card');
    expect(config.entity).to.equal('light.living_room');
    expect(config.show_name).to.be.false;
    expect(config.show_label).to.be.true;
  });

  it('should set correct navigation action when path exists', () => {
    const config = createChipConfig(mockEntity, mockHass);
    expect(config.tap_action.action).to.equal('navigate');
    expect(config.tap_action.navigation_path).to.equal('/test');
  });

  it('should set more-info action when no navigation path', () => {
    mockEntity = new ChipEntity('light.living_room', 'on', {});
    const config = createChipConfig(mockEntity, mockHass);
    expect(config.tap_action.action).to.equal('more-info');
  });

  it('should apply dark mode styles correctly', () => {
    mockHass.themes.darkMode = true;
    const config = createChipConfig(mockEntity, mockHass);
    expect(config.styles.card[0]?.['box-shadow']).to.equal(
      '0px 2px 4px 0px rgba(0,0,0,0.80)',
    );
  });

  it('should apply light mode styles correctly', () => {
    const config = createChipConfig(mockEntity, mockHass);
    expect(config.styles.card[0]?.['box-shadow']).to.equal('var(--box-shadow)');
  });

  it('should set label only for positive states', () => {
    mockEntity = new ChipEntity('sensor.test', '10', {});
    const config = createChipConfig(mockEntity, mockHass);
    expect(config.label).to.equal('10');

    mockEntity = new ChipEntity('sensor.test', '0', {});
    const config2 = createChipConfig(mockEntity, mockHass);
    expect(config2.label).to.be.null;
  });
});
