import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders React Mega Menu header', () => {
  const appHeadingText = 'React Mega Menu'
  render(<App />)
  expect(screen.getByText(appHeadingText)).toBeInTheDocument()
})
