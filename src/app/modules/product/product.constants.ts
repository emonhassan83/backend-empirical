export const PRODUCT_SIZE = {
  xxs: 'xxs',
  xs: 'xs',
  s: 's',
  m: 'm',
  l: 'l',
  xl: 'xl',
  xxl: 'xxl',
  xxxl: 'xxxl',
  xxxxl: 'xxxxl',
  free_size: 'free_size',
} as const

export type TProductSize = keyof typeof PRODUCT_SIZE
