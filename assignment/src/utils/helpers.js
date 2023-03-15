import {SIZE} from './sizes';

export const hitSlop = number => ({
  top: SIZE.widthPixel(number),
  left: SIZE.widthPixel(number),
  right: SIZE.widthPixel(number),
  bottom: SIZE.widthPixel(number),
});
