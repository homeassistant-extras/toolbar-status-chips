/**
 * Configuration settings for entity display and behavior.
 */
export interface Config {
  /** Additional text label to display alongside the entity */
  additional_label?: string;

  /** Area identifier where this configuration applies */
  area?: string;

  /** Label to display when entity is the only one in its group */
  solo_label?: string;

  /** Path to fetch the entity's current status */
  status_path?: string;

  /** Options to enable disable features **/
  features?: Features[];
}

export type Features = 'optional';
