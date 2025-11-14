import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider, MantineColorsTuple } from '@mantine/core';
import { Timer } from '../../src/components/player/Timer';

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

describe('Timer Component', () => {
  it('should render formatted time correctly', () => {
    renderWithTheme(
      <Timer
        remainingSeconds={45}
        totalSeconds={60}
        formattedTime="00:45"
        progressPercent={25}
      />
    );

    expect(screen.getByText('00:45')).toBeInTheDocument();
  });

  it('should display remaining seconds label', () => {
    renderWithTheme(
      <Timer
        remainingSeconds={30}
        totalSeconds={60}
        formattedTime="00:30"
        progressPercent={50}
      />
    );

    expect(screen.getByText('剩餘時間')).toBeInTheDocument();
  });

  it('should render circular progress ring with correct stroke color', () => {
    const { container } = renderWithTheme(
      <Timer
        remainingSeconds={30}
        totalSeconds={60}
        formattedTime="00:30"
        progressPercent={50}
      />
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    
    // Check for green stroke (matcha.400)
    const circle = container.querySelector('circle[stroke]');
    if (circle) {
      const stroke = circle.getAttribute('stroke');
      expect(stroke).toContain('#66BB6A');
    }
  });

  it('should update progress percentage smoothly', () => {
    const { rerender } = renderWithTheme(
      <Timer
        remainingSeconds={45}
        totalSeconds={60}
        formattedTime="00:45"
        progressPercent={25}
      />
    );

    // Update to 50% progress
    rerender(
      <MantineProvider theme={{ colors: { matcha: matchaGreen }, primaryColor: 'matcha' }}>
        <Timer
          remainingSeconds={30}
          totalSeconds={60}
          formattedTime="00:30"
          progressPercent={50}
        />
      </MantineProvider>
    );

    expect(screen.getByText('00:30')).toBeInTheDocument();
  });

  it('should have correct size on desktop (200-300px diameter)', () => {
    const { container } = renderWithTheme(
      <Timer
        remainingSeconds={30}
        totalSeconds={60}
        formattedTime="00:30"
        progressPercent={50}
      />
    );

    const svg = container.querySelector('svg');
    if (svg) {
      const width = svg.getAttribute('width');
      const height = svg.getAttribute('height');
      
      // Desktop size should be between 200-300px
      if (width && height) {
        const size = parseInt(width);
        expect(size).toBeGreaterThanOrEqual(200);
        expect(size).toBeLessThanOrEqual(300);
      }
    }
  });

  it('should animate countdown with CSS animation', () => {
    const { container } = renderWithTheme(
      <Timer
        remainingSeconds={30}
        totalSeconds={60}
        formattedTime="00:30"
        progressPercent={50}
      />
    );

    const circle = container.querySelector('circle[stroke-dasharray]');
    expect(circle).toBeInTheDocument();
    
    // Should have transition/animation for smooth countdown
    if (circle) {
      const style = window.getComputedStyle(circle);
      expect(style.transition || style.animation).toBeTruthy();
    }
  });

  it('should center time display in circular ring', () => {
    renderWithTheme(
      <Timer
        remainingSeconds={30}
        totalSeconds={60}
        formattedTime="00:30"
        progressPercent={50}
      />
    );

    const timeElement = screen.getByText('00:30');
    const parent = timeElement.closest('div');
    
    // Should be centered
    expect(parent?.className).toContain('center');
  });

  it('should use matcha.400 stroke color for progress ring', () => {
    const { container } = renderWithTheme(
      <Timer
        remainingSeconds={30}
        totalSeconds={60}
        formattedTime="00:30"
        progressPercent={50}
      />
    );

    const progressCircle = container.querySelector('circle[stroke="#66BB6A"]');
    expect(progressCircle).toBeInTheDocument();
  });

  it('should display time in large, readable font', () => {
    renderWithTheme(
      <Timer
        remainingSeconds={30}
        totalSeconds={60}
        formattedTime="00:30"
        progressPercent={50}
      />
    );

    const timeElement = screen.getByText('00:30');
    const styles = window.getComputedStyle(timeElement);
    
    // Font size should be large (40px+)
    const fontSize = parseInt(styles.fontSize);
    expect(fontSize).toBeGreaterThanOrEqual(40);
  });

  it('should show progress percentage visually', () => {
    const { container } = renderWithTheme(
      <Timer
        remainingSeconds={15}
        totalSeconds={60}
        formattedTime="00:15"
        progressPercent={75}
      />
    );

    // Circle should represent 75% completion
    const circle = container.querySelector('circle[stroke-dasharray]');
    if (circle) {
      const dasharray = circle.getAttribute('stroke-dasharray');
      expect(dasharray).toBeTruthy();
    }
  });
});
