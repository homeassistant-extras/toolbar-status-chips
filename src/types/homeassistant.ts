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

  /** Map of area IDs to their corresponding areas */
  areas: Record<string, Area>;

  /** Object containing the current theme settings for Home Assistant */
  themes: Themes;
}

/**
 * Represents an area in Home Assistant.
 */
export interface Area {
  /** Unique identifier for the area */
  area_id: string;

  /** Icon associated with the area */
  icon: string;
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
