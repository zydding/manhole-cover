import { Attribute } from './Attribute';
import { Literal } from './Literal';
import { QrCode } from './QrCode';

export interface Template {
    id?: number;
  name: string;
  width: number;
  height: number;
  gap: number;
  radius: number;
  primary_font: number;
  secondary_font: number;
  attributes: Attribute[];
  literals: Literal[];
  qr_codes: QrCode[];
  example?: string;
  schema?: string;
  product?: string;
}
