/* eslint-disable @typescript-eslint/no-implied-eval */

export const isBrowser = new Function(
  'try {return this===window;}catch(e){ return false;}',
);

export const isNode = new Function(
  'try {return this===global;}catch(e){return false;}',
);
