import React from 'react'
import PropTypes from 'prop-types'

interface IHamburgerProps {
  label?: string
  state: '' | 'open' | 'closed'
  onClick?: () => void
}

const Hamburger = ({ label, state, onClick }: IHamburgerProps) => {
  let innerState: string = state
  if (innerState === '') {
    innerState = 'rmm__hamburger--closed'
  } else if (innerState === 'open') {
    innerState = 'rmm__hamburger--open'
  }
  return (
    <button className={`rmm__hamburger ${innerState}`} onClick={onClick}>
      <div className="rmm_hamburger--slice-container">
        <span className="rmm_hamburger--slice"></span>
        <span className="rmm_hamburger--slice"></span>
        <span className="rmm_hamburger--slice"></span>
        <span className="rmm_hamburger--slice"></span>
      </div>
      {label && (
        <div className="rmm_hamburger--label-container">
          <span className="rmm_hamburger--label">{label}</span>
        </div>
      )}
    </button>
  )
}

export default Hamburger
