import React from 'react'
import PropTypes from 'prop-types'

import styles from './index.module.scss'

interface ISkipToMainProps {
  children: React.ReactNode
}

const SkipToMain = ({ children }: ISkipToMainProps) => (
  <a href="#main" className={styles.root}>
    {children}
  </a>
)

export default SkipToMain
