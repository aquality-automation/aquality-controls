export class AQColumn {
  name: string;
  property: string;
  filter: boolean;
  sorting: boolean;
  type: string;
  editable: boolean;
  editTextOptions?: EditTextOptions;
  class?: string;
  lookup?: Lookup;
}

export class EditTextOptions {
  maxLenght: number;
  minLenght: number;
}

export class Lookup {
  array: any[];
  propertiesToShow: string[];
  required: boolean;
}
