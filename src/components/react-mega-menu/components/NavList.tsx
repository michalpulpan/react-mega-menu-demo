import React from 'react'
import PropTypes from 'prop-types'

// Utils
import { classNames } from '../utils/css'

interface INavListProps {
  id: string
  role?: string
  isSub?: boolean
  isSubSub?: boolean
  isDropdown?: boolean
  activeState: '' | 'open' | 'closed'
  ariaLabelledby: string
  children: React.ReactNode
}

const NavList = ({
  id,
  role = 'menubar',
  isSub = false,
  isSubSub = false,
  isDropdown = false,
  activeState = '',
  ariaLabelledby,
  children,
}: INavListProps) => {
  const rootClasses = classNames(
    'rmm__nav-list',
    `rmm__nav-list--${activeState}`,
    isSub && 'rmm__nav-list--sub',
    isSubSub && 'rmm__nav-list--sub-sub',
    isDropdown && 'rmm__nav-list--dropdown'
  )
  return (
    <ul
      id={id}
      role={role}
      aria-labelledby={ariaLabelledby}
      className={rootClasses}
    >
      {children}
    </ul>
  )
}

export default NavList
