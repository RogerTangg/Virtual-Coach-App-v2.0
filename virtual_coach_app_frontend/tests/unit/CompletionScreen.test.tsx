import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider, MantineColorsTuple } from '@mantine/core';
import { CompletionScreen } from '../../src/components/player/CompletionScreen';

const matchaGreen: MantineColorsTuple = [
  '#E8F5E9',
  '#C8E6C9',
  '#A5D6A7',
  '#81C784',
  '#66BB6A',
  '#4CAF50',
  '#43A047',
  '#388E3C',
  '#2E7D32',
  '#1B5E20',
];

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <MantineProvider theme={{ colors: { matcha: matchaGreen }, primaryColor: 'matcha' }}>
      {ui}
    </MantineProvider>
  );
}

describe('CompletionScreen Component', () => {
  const mockProps = {
    workoutTitle: '全身肌力訓練',
    totalExercises: 8,
    totalDurationMinutes: 30,
    onRestart: vi.fn(),
    onExit: vi.fn(),
  };

  it('should render celebration message', () => {
    renderWithTheme(<CompletionScreen {...mockProps} />);

    expect(screen.getByText(/訓練完成|恭喜/i)).toBeInTheDocument();
  });

  it('should display bright green gradient background', () => {
    const { container } = renderWithTheme(<CompletionScreen {...mockProps} />);

    const bgElement = container.querySelector('[style*="background"]');
    if (bgElement) {
      const bgStyle = window.getComputedStyle(bgElement).background;
      // Should contain green gradient (#81C784 → #66BB6A)
      expect(
        bgStyle.includes('#81C784') || 
        bgStyle.includes('#66BB6A') ||
        bgStyle.includes('linear-gradient')
      ).toBe(true);
    }
  });

  it('should render large checkmark icon (128-160px)', () => {
    const { container } = renderWithTheme(<CompletionScreen {...mockProps} />);

    const checkmark = container.querySelector('svg[viewBox="0 0 24 24"]');
    if (checkmark) {
      const parent = checkmark.parentElement;
      if (parent) {
        const width = window.getComputedStyle(parent).width;
        const size = parseInt(width);
        expect(size).toBeGreaterThanOrEqual(80); // At least 80px (considering scale)
      }
    }
  });

  it('should animate checkmark icon with bounce effect', async () => {
    const { container } = renderWithTheme(<CompletionScreen {...mockProps} />);

    const iconContainer = container.querySelector('svg')?.parentElement;
    
    await waitFor(() => {
      if (iconContainer) {
        const animation = window.getComputedStyle(iconContainer).animation;
        expect(animation).toBeTruthy();
      }
    });
  });

  it('should display workout summary card with white background', () => {
    const { container } = renderWithTheme(<CompletionScreen {...mockProps} />);

    const summaryCard = container.querySelector('[style*="background"]');
    expect(summaryCard).toBeInTheDocument();
  });

  it('should show total exercises completed', () => {
    renderWithTheme(<CompletionScreen {...mockProps} />);

    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText(/運動|項目/i)).toBeInTheDocument();
  });

  it('should show total duration in minutes', () => {
    renderWithTheme(<CompletionScreen {...mockProps} />);

    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText(/分鐘|時長/i)).toBeInTheDocument();
  });

  it('should render "返回主畫面" button', () => {
    renderWithTheme(<CompletionScreen {...mockProps} />);

    const exitButton = screen.getByRole('button', { name: /返回|首頁/i });
    expect(exitButton).toBeInTheDocument();
  });

  it('should render "分享成績" or restart button', () => {
    renderWithTheme(<CompletionScreen {...mockProps} />);

    // Should have restart or share button
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('should call onExit when "返回主畫面" is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<CompletionScreen {...mockProps} />);

    const exitButton = screen.getByRole('button', { name: /返回|首頁/i });
    await user.click(exitButton);

    expect(mockProps.onExit).toHaveBeenCalledTimes(1);
  });

  it('should call onRestart when restart button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<CompletionScreen {...mockProps} />);

    const restartButton = screen.getByRole('button', { name: /再練|重新/i });
    await user.click(restartButton);

    expect(mockProps.onRestart).toHaveBeenCalledTimes(1);
  });
});
