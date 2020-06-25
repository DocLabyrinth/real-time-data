import merge from 'deepmerge'
import { toTheme } from '@theme-ui/typography'
import { tailwind } from '@theme-ui/presets'
import zackliveTheme from 'typography-theme-zacklive'

const theme = merge(toTheme(zackliveTheme), {
  colors: tailwind.colors,
  styles: {
    ...zackliveTheme.styles,
    ...tailwind.styles
  },
  sizes: { sidebar: 200, container: 960 }
})

export default theme
