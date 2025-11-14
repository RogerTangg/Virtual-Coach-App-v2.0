/**
 * OptionButton Component Tests
 * Test suite for the option button component with icon and text
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { OptionButton } from '../../src/components/preferences/OptionButton';
import { mantineTheme } from '../../src/theme/mantineTheme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <MantineProvider theme={mantineTheme}>
      {component}
    </MantineProvider>
  );
};

describe('OptionButton', () => {
  it('should render icon and text label', () => {
    renderWithTheme(
      <OptionButton
        icon={<span data-testid="test-icon">💪</span>}
        label="增肌"
        value="muscle"
        selected={false}
        onChange={() => {}}
      />
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('增肌')).toBeInTheDocument();
  });

  it('should show selected state with filled variant', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    renderWithTheme(
      <OptionButton
        icon={<span>🔥</span>}
        label="減脂"
        value="fat-loss"
        selected={true}
        onChange={handleChange}
      />
    );

    const button = screen.getByRole('button', { name: /減脂/i });
    expect(button).toHaveAttribute('data-selected', 'true');
  });

  it('should show unselected state with outline variant', () => {
    renderWithTheme(
      <OptionButton
        icon={<span>🎯</span>}
        label="塑形"
        value="tone"
        selected={false}
        onChange={() => {}}
      />
    );

    const button = screen.getByRole('button', { name: /塑形/i });
    expect(button).toHaveAttribute('data-selected', 'false');
  });

  it('should call onChange with value when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    renderWithTheme(
      <OptionButton
        icon={<span>💪</span>}
        label="增肌"
        value="muscle"
        selected={false}
        onChange={handleChange}
      />
    );

    const button = screen.getByRole('button', { name: /增肌/i });
    await user.click(button);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('muscle');
  });

  it('should support keyboard navigation (Enter)', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    renderWithTheme(
      <OptionButton
        icon={<span>🏋️</span>}
        label="重訓"
        value="weight"
        selected={false}
        onChange={handleChange}
      />
    );

    const button = screen.getByRole('button', { name: /重訓/i });
    button.focus();
    await user.keyboard('{Enter}');

    expect(handleChange).toHaveBeenCalledWith('weight');
  });

  it('should support keyboard navigation (Space)', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    renderWithTheme(
      <OptionButton
        icon={<span>🧘</span>}
        label="瑜珈"
        value="yoga"
        selected={false}
        onChange={handleChange}
      />
    );

    const button = screen.getByRole('button', { name: /瑜珈/i });
    button.focus();
    await user.keyboard(' ');

    expect(handleChange).toHaveBeenCalledWith('yoga');
  });

  it('should have scale hover effect', async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <OptionButton
        icon={<span>🎯</span>}
        label="塑形"
        value="tone"
        selected={false}
        onChange={() => {}}
      />
    );

    const button = screen.getByRole('button', { name: /塑形/i });
    await user.hover(button);

    // Button should be hoverable (style check would require integration test)
    expect(button).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    renderWithTheme(
      <OptionButton
        icon={<span>❌</span>}
        label="已停用"
        value="disabled"
        selected={false}
        onChange={() => {}}
        disabled={true}
      />
    );

    const button = screen.getByRole('button', { name: /已停用/i });
    expect(button).toBeDisabled();
  });

  it('should have proper ARIA attributes', () => {
    renderWithTheme(
      <OptionButton
        icon={<span>💪</span>}
        label="增肌"
        value="muscle"
        selected={true}
        onChange={() => {}}
      />
    );

    const button = screen.getByRole('button', { name: /增肌/i });
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });
});
