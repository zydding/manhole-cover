import {Offset} from './Offset';

export interface Literal {
  offset: Offset;
  text: string;
  template?: number;
  primary_font?: number;
  secondary_font?: number;
}
