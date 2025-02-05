import { expect } from 'chai';
import { ChipEntity } from '../src/entity';

describe('ChipEntity', () => {
  describe('isActive', () => {
    it('should return true for numeric state > 0', () => {
      const entity = new ChipEntity('sensor.test', '1', {});
      expect(entity.isActive).to.be.true;
    });

    it('should return false for numeric state = 0', () => {
      const entity = new ChipEntity('sensor.test', '0', {});
      expect(entity.isActive).to.be.false;
    });

    it('should return true for matching on_state', () => {
      const entity = new ChipEntity('switch.test', 'on', { on_state: 'on' });
      expect(entity.isActive).to.be.true;
    });

    it('should return false for non-matching on_state', () => {
      const entity = new ChipEntity('switch.test', 'off', { on_state: 'on' });
      expect(entity.isActive).to.be.false;
    });
  });

  describe('iconColor', () => {
    it('should return green for passing numeric threshold', () => {
      const entity = new ChipEntity('sensor.test', '35', {
        numeric_state_pass_threshold: 30,
        numeric_state_warning_threshold: 20,
      });
      expect(entity.iconColor).to.equal('var(--green-color)');
    });

    it('should return amber for warning numeric threshold', () => {
      const entity = new ChipEntity('sensor.test', '25', {
        numeric_state_pass_threshold: 30,
        numeric_state_warning_threshold: 20,
      });
      expect(entity.iconColor).to.equal('var(--amber-color)');
    });

    it('should return red for failing numeric threshold', () => {
      const entity = new ChipEntity('sensor.test', '15', {
        numeric_state_pass_threshold: 30,
        numeric_state_warning_threshold: 20,
      });
      expect(entity.iconColor).to.equal('var(--red-color)');
    });

    it('should use custom on_color when provided', () => {
      const entity = new ChipEntity('sensor.test', '25', {
        numeric_state_pass_threshold: 30,
        numeric_state_warning_threshold: 20,
        on_color: 'var(--custom-color)',
      });
      expect(entity.iconColor).to.equal('var(--custom-color)');
    });
  });

  describe('excludeOnStatusPath', () => {
    it('should return true when exclude_on_status_path is true', () => {
      const entity = new ChipEntity('sensor.test', '0', {
        exclude_on_status_path: true,
      });
      expect(entity.excludeOnStatusPath).to.be.true;
    });

    it('should return false by default', () => {
      const entity = new ChipEntity('sensor.test', '0', {});
      expect(entity.excludeOnStatusPath).to.be.false;
    });
  });

  describe('isPositiveState', () => {
    it('should return true for positive numeric state', () => {
      const entity = new ChipEntity('sensor.test', '10', {});
      expect(entity.isPositiveState).to.be.true;
    });

    it('should return false for zero numeric state', () => {
      const entity = new ChipEntity('sensor.test', '0', {});
      expect(entity.isPositiveState).to.be.false;
    });

    it('should return false for non-numeric state', () => {
      const entity = new ChipEntity('sensor.test', 'on', {});
      expect(entity.isPositiveState).to.be.false;
    });
  });
});
