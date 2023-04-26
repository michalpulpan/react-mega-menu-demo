import React from 'react'
import PropTypes from 'prop-types'

// Utils
import { classNames } from '../utils/css'

interface INavProps {
  id: string
  ariaLabel: string
  activeState: '' | 'open' | 'closed'
  children: React.ReactNode
}

const Nav = ({
  id,
  ariaLabel = 'Main Navigation',
  activeState = '',
  children,
}: INavProps) => {
  const rootClasses = classNames(
    'rmm__nav',
    activeState && `rmm__nav--${activeState}`
  )

  return (
    <nav id={id} className={rootClasses} aria-label={ariaLabel}>
      {children}
    </nav>
  )
}

export default Nav
