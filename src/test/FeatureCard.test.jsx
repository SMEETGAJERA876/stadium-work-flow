import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FeatureCard from '../components/FeatureCard';
import React from 'react';

describe('FeatureCard', () => {
  const defaultProps = {
    id: 'crowdControl',
    name: 'Crowd Control',
    description: 'Monitor crowd density',
    enabled: true,
    onToggle: vi.fn(),
    onSettings: vi.fn(),
    loading: false
  };

  it('renders component correctly', () => {
    render(<FeatureCard {...defaultProps} />);
    expect(screen.getByText('Crowd Control')).toBeInTheDocument();
    expect(screen.getByText('Monitor crowd density')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('calls onToggle when toggle is clicked', () => {
    render(<FeatureCard {...defaultProps} />);
    const toggle = screen.getByRole('switch', { name: /toggle/i });
    fireEvent.click(toggle);
    expect(defaultProps.onToggle).toHaveBeenCalled();
  });

  it('disables settings button when inactive', () => {
    render(<FeatureCard {...defaultProps} enabled={false} />);
    const settingsBtn = screen.getByRole('button', { name: /settings/i });
    expect(settingsBtn).toBeDisabled();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });
});
