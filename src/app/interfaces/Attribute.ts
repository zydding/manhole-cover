import {Offset} from './Offset';

export interface Attribute {
  template?: number;
  offset: Offset;
  label: string;
  variable: string;
  default?: string;
  primary_font?: number;
  secondary_font?: number;
}
