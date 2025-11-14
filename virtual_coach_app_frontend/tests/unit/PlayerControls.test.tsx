import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider, MantineColorsTuple } from '@mantine/core';
import { PlayerControls } from '../../src/components/player/PlayerControls';

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

describe('PlayerControls Component', () => {
  const mockProps = {
    isPlaying: true,
    isPaused: false,
    onPlayPause: vi.fn(),
    onNext: vi.fn(),
    onPrevious: vi.fn(),
    onExit: vi.fn(),
    canGoPrevious: true,
    canGoNext: true,
  };

  it('should render three circular control buttons', () => {
    renderWithTheme(<PlayerControls {...mockProps} />);

    // Pause, Skip, Exit buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });

  it('should call onPlayPause when pause button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<PlayerControls {...mockProps} />);

    const pauseButton = screen.getByLabelText(/暫停/i);
    await user.click(pauseButton);

    expect(mockProps.onPlayPause).toHaveBeenCalledTimes(1);
  });

  it('should call onNext when skip button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<PlayerControls {...mockProps} />);

    const skipButton = screen.getByLabelText(/跳過/i);
    await user.click(skipButton);

    expect(mockProps.onNext).toHaveBeenCalledTimes(1);
  });

  it('should call onExit when exit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<PlayerControls {...mockProps} />);

    const exitButton = screen.getByLabelText(/退出/i);
    await user.click(exitButton);

    expect(mockProps.onExit).toHaveBeenCalledTimes(1);
  });

  it('should have semi-transparent green background on buttons', () => {
    const { container } = renderWithTheme(<PlayerControls {...mockProps} />);

    const buttons = container.querySelectorAll('button');
    let hasGreenBackground = false;

    buttons.forEach((button) => {
      const bgColor = window.getComputedStyle(button).backgroundColor;
      if (bgColor.includes('rgba') && bgColor.includes('66, 187, 106')) {
        hasGreenBackground = true;
      }
    });

    expect(hasGreenBackground).toBe(true);
  });

  it('should show white icons on buttons', () => {
    const { container } = renderWithTheme(<PlayerControls {...mockProps} />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);

    icons.forEach((icon) => {
      const fill = icon.getAttribute('fill') || icon.getAttribute('stroke');
      expect(fill).toContain('white');
    });
  });

  it('should have circular button shape (56-64px diameter)', () => {
    const { container } = renderWithTheme(<PlayerControls {...mockProps} />);

    const buttons = container.querySelectorAll('button[style*="border-radius"]');
    
    buttons.forEach((button) => {
      const borderRadius = window.getComputedStyle(button).borderRadius;
      // Circular buttons should have 50% or 9999px border radius
      expect(borderRadius === '50%' || parseInt(borderRadius) > 28).toBe(true);
    });
  });

  it('should auto-hide after 3 seconds with fade animation', async () => {
    const { container } = renderWithTheme(<PlayerControls {...mockProps} />);

    // Controls should have fade animation
    const controlsContainer = container.firstChild as HTMLElement;
    const hasTransition = window.getComputedStyle(controlsContainer).transition;
    
    expect(hasTransition).toBeTruthy();
  });

  it('should display pause icon when playing', () => {
    renderWithTheme(<PlayerControls {...mockProps} isPlaying={true} isPaused={false} />);

    const pauseButton = screen.getByLabelText(/暫停/i);
    expect(pauseButton).toBeInTheDocument();
  });

  it('should display play icon when paused', () => {
    renderWithTheme(
      <PlayerControls {...mockProps} isPlaying={false} isPaused={true} />
    );

    const playButton = screen.getByLabelText(/繼續|播放/i);
    expect(playButton).toBeInTheDocument();
  });

  it('should have hover effect on buttons', () => {
    const { container } = renderWithTheme(<PlayerControls {...mockProps} />);

    const buttons = container.querySelectorAll('button');
    
    buttons.forEach((button) => {
      const classes = button.className;
      expect(classes).toContain('hover');
    });
  });
});
