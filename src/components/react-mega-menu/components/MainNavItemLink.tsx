import React from 'react'
import PropTypes from 'prop-types'

// Utils
import { classNames } from '../utils/css'

interface IMainNavItemLink {
  id: string
  role?: string
  href: string
  isBack?: boolean
  isForward?: boolean
  isActive?: boolean
  className?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
  onMouseEnter?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLAnchorElement>) => void
  ariaHaspopup?:
    | boolean
    | 'dialog'
    | 'menu'
    | 'grid'
    | 'listbox'
    | 'tree'
    | 'false'
    | 'true'
  ariaControls?: string
  children: React.ReactNode
}

const MainNavItemLink = ({
  id,
  role,
  href,
  isBack,
  isForward,
  isActive,
  className,
  onMouseEnter,
  onClick,
  onKeyDown,
  ariaHaspopup,
  ariaControls,
  children,
}: IMainNavItemLink) => {
  const rootClasses = classNames(
    'rmm__main-nav-item-link',
    isBack && 'rmm__main-nav-item-link--back',
    isForward && 'rmm__main-nav-item-link--forward',
    isActive && 'rmm__main-nav-item-link--active',
    className && className
  )
  return (
    <a
      id={id}
      role={role}
      href={href}
      className={rootClasses}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onKeyDown={onKeyDown}
      aria-haspopup={ariaHaspopup}
      aria-controls={ariaControls}
    >
      {children}
    </a>
  )
}

export default MainNavItemLink
