/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'

import Index from '../pages/index'

describe('Index', () => {
  it('renders Index component', () => {
    render(<Index />)

    expect(screen.getByText('Index')).toBeInTheDocument();
  })
});