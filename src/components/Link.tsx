/** @jsx jsx */
import { jsx } from 'theme-ui'
import { Link } from 'react-router-dom'

// adapted from: https://theme-ui.com/recipes/gatsby-link
export default (props: any) => (
  <Link
    {...props}
    style={{ display: 'block' }}
    activeClassName='active'
    sx={{
      mb: 2,
      color: 'primary',
      '&.active': {
        color: 'primary'
      }
    }}
  />
)
