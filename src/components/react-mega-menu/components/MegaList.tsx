import React from 'react'
import PropTypes from 'prop-types'

// Utils
import { classNames } from '../utils/css'

interface IMegaListProps {
  id: string
  activeState: '' | 'open' | 'closed'
  children: React.ReactNode
}

const MegaList = ({ id, activeState = '', children }: IMegaListProps) => {
  const rootClasses = classNames(
    'rmm__mega-list',
    activeState && `rmm__mega-list--${activeState}`
  )
  return (
    <ul role="menu" className={rootClasses} id={id} aria-labelledby={id}>
      {children}
    </ul>
  )
}

export default MegaList
