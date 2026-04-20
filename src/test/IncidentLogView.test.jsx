import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import IncidentLogView from '../components/views/IncidentLogView';
import React from 'react';

describe('IncidentLogView', () => {
  const mockShowToast = vi.fn();

  it('renders the incident log table', () => {
    render(<IncidentLogView showToast={mockShowToast} />);
    expect(screen.getByText('Incident Log')).toBeDefined();
    expect(screen.getByRole('table')).toBeDefined();
  });

  it('filters incidents by search term', () => {
    render(<IncidentLogView showToast={mockShowToast} />);
    const searchInput = screen.getByPlaceholderText('Search incidents...');
    
    fireEvent.change(searchInput, { target: { value: 'INC-2026-0847' } });
    
    // Should show the specific incident
    expect(screen.getByText('INC-2026-0847')).toBeDefined();
    // Should NOT show others
    expect(screen.queryByText('INC-2026-0834')).toBeNull();
  });

  it('filters incidents by severity', () => {
    render(<IncidentLogView showToast={mockShowToast} />);
    const severitySelect = screen.getByLabelText('Filter by severity');
    
    fireEvent.change(severitySelect, { target: { value: 'Critical' } });
    
    // Check table rows (excluding header)
    const rows = screen.getAllByRole('row').slice(1);
    rows.forEach(row => {
      expect(row.innerHTML).toContain('Critical');
      expect(row.innerHTML).not.toContain('Warning');
    });
  });

  it('triggers export toast', () => {
    render(<IncidentLogView showToast={mockShowToast} />);
    const exportButton = screen.getByText('Export CSV');
    
    fireEvent.click(exportButton);
    expect(mockShowToast).toHaveBeenCalledWith(expect.stringContaining('Exporting'), 'info');
  });
});
