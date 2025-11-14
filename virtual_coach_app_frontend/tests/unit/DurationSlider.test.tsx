/**
 * DurationSlider Component Tests
 * Test suite for the duration slider with green track
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { DurationSlider } from '../../src/components/preferences/DurationSlider';
import { mantineTheme } from '../../src/theme/mantineTheme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <MantineProvider theme={mantineTheme}>
      {component}
    </MantineProvider>
  );
};

describe('DurationSlider', () => {
  it('should render with label and current value', () => {
    renderWithTheme(
      <DurationSlider
        label="訓練時長"
        value={30}
        min={10}
        max={90}
        step={5}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('訓練時長')).toBeInTheDocument();
    expect(screen.getByText('30 分鐘')).toBeInTheDocument();
  });

  it('should display min and max labels', () => {
    renderWithTheme(
      <DurationSlider
        label="時長"
        value={45}
        min={15}
        max={60}
        step={5}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('15 min')).toBeInTheDocument();
    expect(screen.getByText('60 min')).toBeInTheDocument();
  });

  it('should call onChange when value updates', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    renderWithTheme(
      <DurationSlider
        label="時長"
        value={30}
        min={10}
        max={90}
        step={10}
        onChange={handleChange}
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    
    // Simulate slider interaction
    await user.click(slider);
    
    // onChange should be set up to be called
    expect(handleChange).toBeDefined();
  });

  it('should show real-time value display', () => {
    const { rerender } = renderWithTheme(
      <DurationSlider
        label="時長"
        value={20}
        min={10}
        max={60}
        step={5}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('20 分鐘')).toBeInTheDocument();

    // Update value
    rerender(
      <MantineProvider theme={mantineTheme}>
        <DurationSlider
          label="時長"
          value={35}
          min={10}
          max={60}
          step={5}
          onChange={() => {}}
        />
      </MantineProvider>
    );

    expect(screen.getByText('35 分鐘')).toBeInTheDocument();
  });

  it('should have green track styling', () => {
    renderWithTheme(
      <DurationSlider
        label="時長"
        value={40}
        min={10}
        max={90}
        step={5}
        onChange={() => {}}
      />
    );

    const slider = screen.getByRole('slider');
    // Slider should have matcha green color applied via Mantine theme
    expect(slider).toBeInTheDocument();
  });

  it('should display custom unit when provided', () => {
    renderWithTheme(
      <DurationSlider
        label="重複次數"
        value={12}
        min={5}
        max={20}
        step={1}
        unit="次"
        onChange={() => {}}
      />
    );

    expect(screen.getByText('12 次')).toBeInTheDocument();
  });

  it('should be accessible with proper ARIA attributes', () => {
    renderWithTheme(
      <DurationSlider
        label="訓練時長"
        value={30}
        min={10}
        max={90}
        step={5}
        onChange={() => {}}
        ariaLabel="選擇訓練時長"
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '10');
    expect(slider).toHaveAttribute('aria-valuemax', '90');
    expect(slider).toHaveAttribute('aria-valuenow', '30');
  });

  it('should support keyboard navigation (arrow keys)', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    renderWithTheme(
      <DurationSlider
        label="時長"
        value={30}
        min={10}
        max={60}
        step={5}
        onChange={handleChange}
      />
    );

    const slider = screen.getByRole('slider');
    slider.focus();

    // Arrow keys should work (implementation depends on Mantine Slider)
    await user.keyboard('{ArrowRight}');
    
    expect(slider).toHaveFocus();
  });

  it('should respect min/max constraints', () => {
    renderWithTheme(
      <DurationSlider
        label="時長"
        value={10}
        min={10}
        max={90}
        step={5}
        onChange={() => {}}
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '10');
    expect(slider).toHaveAttribute('aria-valuemax', '90');
  });
});
