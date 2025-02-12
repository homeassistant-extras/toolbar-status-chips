export interface HaFormBaseSchema {
  name: string;
  label: string;
}

export type HaFormSchema = HaFormSelector | HaFormGridSchema;

export interface HaFormSelector extends HaFormBaseSchema {
  type?: never;
  required?: boolean;
  selector: Selector;
}

export interface HaFormGridSchema extends HaFormBaseSchema {
  type: 'grid';
  name: '';
  column_min_width?: string;
  schema: HaFormSchema[];
}

export type Selector =
  | AreaSelector
  | BooleanSelector
  | LabelSelector
  | SelectSelector
  | StringSelector;

export interface AreaSelector {
  area: {};
}

export interface BooleanSelector {
  // eslint-disable-next-line @typescript-eslint/ban-types
  boolean: {};
}

export interface LabelSelector {
  label: {
    multiple?: boolean;
  };
}

export interface SelectSelector {
  select: {
    multiple?: boolean;
    custom_value?: boolean;
    mode?: 'list';
    options: string[] | SelectOption[];
  };
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface StringSelector {
  text: {
    multiline?: boolean;
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
    suffix?: string;
  };
}
