/**
 * Configuration settings for entity display and behavior.
 */
export interface Config {
  /** Additional text label to display alongside the entity */
  additional_label?: string;

  /** Area identifier where this configuration applies */
  area?: string;

  /** Flag indicating whether this configuration is optional */
  optional?: boolean;

  /** Label to display when entity is the only one in its group */
  solo_label?: string;

  /** Path to fetch the entity's current status */
  status_path?: string;
}

/**
 * Root interface representing the Home Assistant instance structure.
 * Contains collections of entities and devices managed by Home Assistant.
 */
export interface HomeAssistant {
  /** Map of entity IDs to their corresponding entities */
  entities: Record<string, Entity>;

  /** Map of device IDs to their corresponding devices */
  devices: Record<string, Device>;

  /** Map of entity IDs to their current states */
  states: Record<string, State>;

  /** Object containing the current theme settings for Home Assistant */
  themes: Themes;
}

/**
 * Represents a Home Assistant entity with its relationships to areas and devices.
 */
export interface Entity {
  /** ID of the entity */
  entity_id: string;

  /** ID of the area where this entity is located */
  area_id: string;

  /** ID of the physical device this entity belongs to */
  device_id: string;

  /** Array of descriptive labels associated with this entity */
  labels: string[];
}

/**
 * Represents a physical device in Home Assistant.
 */
export interface Device {
  /** Unique identifier for the device */
  id: string;

  /** ID of the area where this device is located */
  area_id: string;
}

/**
 * Configuration for theme-related settings in the application.
 * Controls the visual appearance and color schemes.
 */
export interface Themes {
  /**
   * Indicates whether dark mode is enabled.
   * true = dark mode active, false = light mode active
   */
  darkMode: boolean;
}

/**
 * Represents the current state and attributes of a Home Assistant entity.
 * Used to track an entity's status and properties at a given moment.
 */
export type State = {
  /**
   * Unique identifier for the entity.
   * Format: `<domain>.<object_id>` (e.g. "light.living_room", "switch.kitchen")
   */
  entity_id: string;

  /**
   * Current state of the entity.
   * Common values include: "on", "off", "unavailable", or numeric values
   */
  state: string;

  /**
   * Collection of additional entity attributes.
   * Can include properties like brightness, color, temperature, etc.
   * Keys are strings, values can be any type
   */
  attributes: Record<string, any>;
};
