/**
 * Represents the validation status of an entity's state
 * Pass: State exceeds the pass threshold
 * Warning: State is between warning and pass thresholds
 * Error: State is below warning threshold or invalid
 */
enum StateValidation {
  Pass,
  Warning,
  Error,
}

/**
 * Represents a Home Assistant entity with its state and attributes
 */
export class ChipEntity {
  entity_id: string;
  state: string | undefined;
  attributes: Record<string, any>;

  constructor(
    entity_id: string,
    state: string | undefined,
    attributes: Record<string, any>,
  ) {
    this.entity_id = entity_id;
    this.state = state;
    this.attributes = attributes;
  }

  /**
   * Determines if the entity is currently active based on:
   * 1. Custom "on" state defined in attributes.on_state
   * 2. Default "on" state
   * 3. Numeric state greater than 0
   */
  get isActive(): boolean {
    const validation = this.validateState();
    return validation === StateValidation.Error;
  }

  /**
   * Determines if the entity state is a positive number
   */
  get isPositiveState(): boolean {
    return this.isNumeric(this.state) && parseFloat(this.state!) > 0;
  }

  /**
   * Determines the color of the icon based on the entity state
   * For numeric states:
   * - Green if > 30
   * - Amber if > 20
   * - Red if <= 20
   * For non-numeric states:
   * - Uses the original active/inactive logic
   */
  get iconColor(): string {
    const validation = this.validateState();

    switch (validation) {
      case StateValidation.Pass:
        return 'var(--green-color)';
      case StateValidation.Warning:
        return this.attributes.on_color ?? 'var(--amber-color)';
      default:
        // Non-numeric fail or below warning threshold
        return this.attributes.on_color ?? 'var(--red-color)';
    }
  }

  /**
   * Indicates whether an optional entity should be excluded when inactive from the status path.
   */
  get excludeOnStatusPath(): boolean {
    return this.attributes.exclude_on_status_path ?? false;
  }

  /**
   * Checks if a value is numeric
   * don't use ES6 syntax or this will be a key and break fast-deep-equal
   * @param num Value to check
   * @returns True if the value is numeric, false otherwise
   */
  private isNumeric(num: any): boolean {
    return (
      (typeof num === 'number' ||
        (typeof num === 'string' && num.trim() !== '')) &&
      !isNaN(num as number)
    );
  }

  /**
   * Validates a state value against defined thresholds if numeric, or against 'on' state if non-numeric
   * @returns StateValidation indicating if the state passes, warns, or errors
   *
   * For numeric states:
   * If thresholds are defined:
   * - Pass: if value > numeric_state_pass_threshold
   * - Warning: if value > numeric_state_warning_threshold but <= pass_threshold
   * - Error: if value <= warning_threshold
   * If thresholds are not defined:
   * - Pass: if value === 0
   * - Error: if value > 0
   *
   * For non-numeric states:
   * - Error: if matches on_state
   * - Pass: if doesn't match on_state
   */
  private validateState(): StateValidation {
    if (!this.isNumeric(this.state)) {
      return this.validateNonNumericState();
    }

    return this.validateNumericState();
  }

  /**
   * Validates non-numeric state values
   */
  private validateNonNumericState(): StateValidation {
    if (this.attributes.on_state) {
      return this.state === this.attributes.on_state
        ? StateValidation.Error
        : StateValidation.Pass;
    }

    if (this.state && ['on', 'true'].includes(this.state.toLowerCase())) {
      return StateValidation.Error;
    }

    return StateValidation.Pass;
  }

  /**
   * Validates numeric state values
   */
  private validateNumericState(): StateValidation {
    const numericState = parseFloat(this.state!);

    if (this.hasThresholds()) {
      return this.validateWithThresholds(numericState);
    }

    return numericState === 0 ? StateValidation.Pass : StateValidation.Error;
  }

  /**
   * Checks if threshold attributes are defined
   */
  private hasThresholds(): boolean {
    return (
      this.attributes.numeric_state_pass_threshold !== undefined ||
      this.attributes.numeric_state_warning_threshold !== undefined
    );
  }

  /**
   * Validates numeric state using defined thresholds
   */
  private validateWithThresholds(numericState: number): StateValidation {
    if (numericState > this.attributes.numeric_state_pass_threshold) {
      return StateValidation.Pass;
    }
    if (numericState > this.attributes.numeric_state_warning_threshold) {
      return StateValidation.Warning;
    }
    return StateValidation.Error;
  }
}
