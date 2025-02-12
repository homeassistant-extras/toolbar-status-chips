import { ChipEntity } from '@/entity';
import type { Entity, HomeAssistant } from './types/homeassistant';

/**
 * Determines if an entity should be included based on its state and path configuration
 * @param {ChipEntity} entity - The entity to check
 * @param {boolean} optional - Whether the entity is optional. Optional entities with
 *                            excludeOnStatusPath set will always be excluded.
 * @returns {boolean} - Whether the entity should be included
 *
 * @example
 * // Regular non-optional entity - only included if active
 * shouldIncludeEntity({ isActive: false, excludeOnStatusPath: false }, false) // returns false
 *
 * // Optional entity without path exclusion - included regardless of status
 * shouldIncludeEntity({ isActive: false, excludeOnStatusPath: false }, true) // returns true
 *
 * // Optional entity with path exclusion - always excluded
 * shouldIncludeEntity({ isActive: true, excludeOnStatusPath: true }, true) // returns false
 */
const shouldIncludeEntity = (
  entity: ChipEntity,
  optional: boolean,
): boolean => {
  // Special case: if the entity is optional but inactive and configured to exclude optional inactive entities,
  // explicitly exclude it regardless of other conditions
  if (optional && entity.excludeOnStatusPath) {
    return false;
  }

  // Standard inclusion logic:
  // - If not optional, entity must be active to be included
  // - If optional, entity is included regardless of active status (unless handled by case above)
  return !optional || entity.isActive;
};

/**
 * Merges two arrays of objects based on a common key, updating items from arr1 with matching properties from arr2.
 * Properties from arr2 will overwrite properties in arr1 if they exist in both objects.
 *
 * @param {any[]} arr1 - The primary array of objects to be updated
 * @param {any[]} arr2 - The secondary array of objects containing update values
 * @param {string} key - The property name to use as the matching key between objects
 * @returns A new array where objects from arr1 are updated with matching properties from arr2
 *
 * @example
 * const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
 * const updates = [{ id: 1, age: 30 }, { id: 2, age: 25 }];
 * mergeArraysUsingMapObject(users, updates, 'id');
 * // Returns: [{ id: 1, name: 'John', age: 30 }, { id: 2, name: 'Jane', age: 25 }]
 */
const mergeArraysUsingMapObject = (arr1: any[], arr2: any[], key: string) => {
  // Create a Map object using arr2, with the specified key as the Map key
  // This provides O(1) lookup time for matching objects
  const map = new Map(arr2.map((item) => [item[key], item]));

  // Map over arr1 and spread both the original item and any matching updates from arr2
  // If no matching item exists in arr2, map.get() returns undefined and no properties are spread
  return arr1.map((item) => ({
    ...item,
    ...map.get(item[key]),
  }));
};

/**
 * Processes entities by merging them with their current states from Home Assistant,
 * filtering based on inclusion criteria, and formatting the final entity objects.
 *
 * @param entities - Array of entity objects to process
 * @param hass - Home Assistant state object containing current states of all entities
 * @param optional - Optional configuration parameters for entity filtering
 * @returns Array of processed entities with their current states and attributes
 */
export const entitiesThatShouldBeChips = (
  entities: Entity[],
  hass: HomeAssistant,
  optional: boolean,
): ChipEntity[] => {
  // First, merge the entity definitions with their current states from Home Assistant
  // Converting hass.states object to array using Object.values()
  const mergedEntities = mergeArraysUsingMapObject(
    entities,
    Object.values(hass.states),
    'entity_id',
  );

  // Filter out entities that don't meet inclusion criteria
  // Then map to a standardized format with only necessary properties
  return mergedEntities
    .map(
      (entity) =>
        new ChipEntity(entity.entity_id, entity.state, entity.attributes),
    )
    .filter((entity) => shouldIncludeEntity(entity, optional));
};

/**
 * Adds top margin to the main Home Assistant view container to accommodate chips on mobile devices.
 * This function only applies margin on mobile viewports (max-width: 768px).
 * It navigates through Home Assistant's shadow DOM structure to find the view container.
 *
 * @param margin - Amount of top margin to add in pixels, defaults to 45
 * @returns void
 *
 * @example
 * // Add default 45px margin
 * addMarginForChips();
 *
 * // Add custom 60px margin
 * addMarginForChips(60);
 */
export const addMarginForChips = (margin = 45): void => {
  // Check if viewport matches mobile breakpoint
  if (!window.matchMedia('only screen and (max-width: 768px)').matches) {
    // Skip margin addition if not on mobile viewport
    return;
  }

  // Navigate through Home Assistant's shadow DOM to find the view container
  // Each querySelector may return null, so we use optional chaining
  const viewContainer = document
    ?.querySelector('home-assistant')
    ?.shadowRoot?.querySelector('home-assistant-main')
    ?.shadowRoot?.querySelector('ha-drawer partial-panel-resolver')
    ?.querySelector('ha-panel-lovelace')
    ?.shadowRoot?.querySelector('hui-root')
    ?.shadowRoot?.querySelector('hui-view-container') as HTMLElement;

  // Set the margin if we found the container
  viewContainer?.style?.setProperty('margin-top', `${margin}px`);
};
