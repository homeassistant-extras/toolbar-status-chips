/**
 * Base schema interface for Home Assistant form elements
 * Contains the common properties required for all form elements
 */
export interface HaFormBaseSchema {
  /** Unique identifier for the form element */
  name: string;
  /** Display text shown to the user for this form element */
  label: string;
}

/**
 * Union type representing all possible form schemas
 * Can be either a selector-based form element or a grid container
 */
export type HaFormSchema = HaFormSelector | HaFormGridSchema;

/**
 * Interface for selector-based form elements
 * These are input fields using various selector types (boolean, string, area, etc.)
 */
export interface HaFormSelector extends HaFormBaseSchema {
  /** Type is not used for selectors as they're identified by their selector property */
  type?: never;
  /** Indicates if this field must have a value */
  required?: boolean;
  /** The specific selector type that defines the input behavior */
  selector: Selector;
}

/**
 * Interface for grid-based form layouts
 * Used to arrange multiple form elements in a responsive grid
 */
export interface HaFormGridSchema extends HaFormBaseSchema {
  /** Identifies this as a grid container rather than an input element */
  type: 'grid';
  /** Grid containers don't use the name property for data binding */
  name: '';
  /** Minimum width for columns in the grid, using CSS values (e.g., "200px", "10em") */
  column_min_width?: string;
  /** Array of form elements to be arranged within this grid */
  schema: HaFormSchema[];
}

/**
 * Union type for all possible selector types
 * Each selector defines a different type of input UI and behavior
 */
export type Selector =
  | AreaSelector
  | BooleanSelector
  | LabelSelector
  | SelectSelector
  | StringSelector;

/**
 * Selector for choosing an area from the Home Assistant areas registry
 */
export interface AreaSelector {
  /** Empty object as this selector currently takes no additional configuration */
  area: {};
}

/**
 * Selector for boolean values (true/false), typically rendered as a toggle switch
 */
export interface BooleanSelector {
  // eslint-disable-next-line @typescript-eslint/ban-types
  /** Empty object as this selector currently takes no additional configuration */
  boolean: {};
}

/**
 * Selector for choosing entities by their labels
 */
export interface LabelSelector {
  label: {
    /** When true, allows selecting multiple labels */
    multiple?: boolean;
  };
}

/**
 * Selector for dropdown or multi-select inputs
 */
export interface SelectSelector {
  select: {
    /** When true, allows selecting multiple options */
    multiple?: boolean;
    /** When true, allows entering custom values not in the options list */
    custom_value?: boolean;
    /** Defines the display mode for the options */
    mode?: 'list';
    /** Available options, either as simple strings or as value-label pairs */
    options: string[] | SelectOption[];
  };
}

/**
 * Interface for defining select options with separate values and display labels
 */
export interface SelectOption {
  /** The data value to be stored when this option is selected */
  value: string;
  /** The human-readable text shown for this option in the UI */
  label: string;
}

/**
 * Selector for text-based inputs with various formats
 */
export interface StringSelector {
  text: {
    /** When true, allows entering multiple lines of text */
    multiline?: boolean;
    /** Specifies the HTML input type, affecting validation and keyboard on mobile devices */
    type?:
      | 'number'
      | 'text'
      | 'search'
      | 'tel'
      | 'url'
      | 'email'
      | 'password'
      | 'date'
      | 'month'
      | 'week'
      | 'time'
      | 'datetime-local'
      | 'color';
    /** Text to display after the input field (e.g., units like "°C" or "%") */
    suffix?: string;
  };
}
