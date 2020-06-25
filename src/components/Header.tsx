/** @jsx jsx */
import React from 'react'
import { Link, Box, jsx } from 'theme-ui'

const Header = () => (
  <header
    sx={{
      display: 'flex',
      alignItems: 'center',
      variant: 'styles.header',
      bg: 'secondary',
      color: 'white',
      mb: 3
    }}
  >
    <Box p={3}>
      <h2>Logo here</h2>
    </Box>
  </header>
)

export default Header
