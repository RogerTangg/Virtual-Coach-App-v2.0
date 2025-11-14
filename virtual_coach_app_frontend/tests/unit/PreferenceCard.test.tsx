/**
 * PreferenceCard Component Tests
 * Test suite for the redesigned preference card component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { PreferenceCard } from '../../src/components/preferences/PreferenceCard';
import { mantineTheme } from '../../src/theme/mantineTheme';

// Helper to render with Mantine theme
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <MantineProvider theme={mantineTheme}>
      {component}
    </MantineProvider>
  );
};

describe('PreferenceCard', () => {
  it('should render with title and description', () => {
    renderWithTheme(
      <PreferenceCard
        title="訓練目標"
        description="選擇您的健身目標"
      >
        <div>Card content</div>
      </PreferenceCard>
    );

    expect(screen.getByText('訓練目標')).toBeInTheDocument();
    expect(screen.getByText('選擇您的健身目標')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should display badges when provided', () => {
    renderWithTheme(
      <PreferenceCard
        title="運動強度"
        badges={[
          { label: '必填', color: 'red' },
          { label: '推薦', color: 'green' }
        ]}
      >
        <div>Content</div>
      </PreferenceCard>
    );

    expect(screen.getByText('必填')).toBeInTheDocument();
    expect(screen.getByText('推薦')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    
    renderWithTheme(
      <PreferenceCard
        title="可點擊卡片"
        onClick={handleClick}
      >
        <div>Click me</div>
      </PreferenceCard>
    );

    const card = screen.getByText('可點擊卡片').closest('div[role="button"]');
    expect(card).toBeInTheDocument();
    
    if (card) {
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    }
  });

  it('should apply hover styles when interactive', () => {
    renderWithTheme(
      <PreferenceCard
        title="Hover Card"
        onClick={() => {}}
      >
        <div>Content</div>
      </PreferenceCard>
    );

    const card = screen.getByText('Hover Card').closest('div[role="button"]');
    expect(card).toBeInTheDocument();
    expect(card).toHaveStyle({ cursor: 'pointer' });
  });

  it('should not be interactive without onClick', () => {
    renderWithTheme(
      <PreferenceCard title="Static Card">
        <div>Content</div>
      </PreferenceCard>
    );

    const card = screen.getByText('Static Card').closest('div');
    expect(card).not.toHaveAttribute('role', 'button');
  });

  it('should support matcha green border variant', () => {
    renderWithTheme(
      <PreferenceCard
        title="Green Card"
        variant="outlined"
      >
        <div>Content</div>
      </PreferenceCard>
    );

    const card = screen.getByText('Green Card').closest('div');
    expect(card).toBeInTheDocument();
  });

  it('should be accessible with proper ARIA attributes', () => {
    const handleClick = vi.fn();
    
    renderWithTheme(
      <PreferenceCard
        title="Accessible Card"
        onClick={handleClick}
        ariaLabel="Select training goal"
      >
        <div>Content</div>
      </PreferenceCard>
    );

    const card = screen.getByLabelText('Select training goal');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('role', 'button');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('should support keyboard navigation', () => {
    const handleClick = vi.fn();
    
    renderWithTheme(
      <PreferenceCard
        title="Keyboard Card"
        onClick={handleClick}
      >
        <div>Content</div>
      </PreferenceCard>
    );

    const card = screen.getByText('Keyboard Card').closest('div[role="button"]');
    
    if (card) {
      // Test Enter key
      fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Test Space key
      fireEvent.keyDown(card, { key: ' ', code: 'Space' });
      expect(handleClick).toHaveBeenCalledTimes(2);
    }
  });
});
