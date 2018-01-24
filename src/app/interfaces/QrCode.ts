import {Size} from './Size';
import {Offset} from './Offset';

export interface QrCode {
  template?: number;
  offset: Offset;
  size: Size;
  variable: string;
  default?: string;
}
