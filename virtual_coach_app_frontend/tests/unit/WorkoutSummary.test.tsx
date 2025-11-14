/**
 * WorkoutSummary Component Tests
 * Test suite for workout summary badge component with matcha green theme
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { WorkoutSummary } from '../../src/components/workout/WorkoutSummary';
import { mantineTheme } from '../../src/theme/mantineTheme';

// Helper to render with Mantine theme
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <MantineProvider theme={mantineTheme}>
      {component}
    </MantineProvider>
  );
};

describe('WorkoutSummary', () => {
  it('should render total duration badge with clock icon', () => {
    renderWithTheme(
      <WorkoutSummary
        totalDurationMinutes={30}
        exerciseCount={6}
        difficulty="intermediate"
      />
    );

    expect(screen.getByText('30 分鐘')).toBeInTheDocument();
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
  });

  it('should render exercise count badge with number icon', () => {
    renderWithTheme(
      <WorkoutSummary
        totalDurationMinutes={25}
        exerciseCount={8}
        difficulty="beginner"
      />
    );

    expect(screen.getByText('8 個運動')).toBeInTheDocument();
    expect(screen.getByTestId('number-icon')).toBeInTheDocument();
  });

  it('should render difficulty badge with star icon', () => {
    renderWithTheme(
      <WorkoutSummary
        totalDurationMinutes={40}
        exerciseCount={5}
        difficulty="advanced"
      />
    );

    expect(screen.getByText('進階')).toBeInTheDocument();
    expect(screen.getByTestId('star-icon')).toBeInTheDocument();
  });

  it('should display correct difficulty labels', () => {
    const { rerender } = renderWithTheme(
      <WorkoutSummary
        totalDurationMinutes={20}
        exerciseCount={4}
        difficulty="beginner"
      />
    );

    expect(screen.getByText('初學者')).toBeInTheDocument();

    rerender(
      <MantineProvider theme={mantineTheme}>
        <WorkoutSummary
          totalDurationMinutes={20}
          exerciseCount={4}
          difficulty="intermediate"
        />
      </MantineProvider>
    );

    expect(screen.getByText('中階')).toBeInTheDocument();

    rerender(
      <MantineProvider theme={mantineTheme}>
        <WorkoutSummary
          totalDurationMinutes={20}
          exerciseCount={4}
          difficulty="advanced"
        />
      </MantineProvider>
    );

    expect(screen.getByText('進階')).toBeInTheDocument();
  });

  it('should render with light green background', () => {
    const { container } = renderWithTheme(
      <WorkoutSummary
        totalDurationMinutes={30}
        exerciseCount={6}
        difficulty="intermediate"
      />
    );

    const summary = container.querySelector('[data-testid="workout-summary"]');
    expect(summary).toHaveStyle({ backgroundColor: expect.stringContaining('#') });
  });

  it('should display badges in horizontal layout', () => {
    const { container } = renderWithTheme(
      <WorkoutSummary
        totalDurationMinutes={30}
        exerciseCount={6}
        difficulty="intermediate"
      />
    );

    const summary = container.querySelector('[data-testid="workout-summary"]');
    expect(summary).toHaveStyle({ display: 'flex' });
  });

  it('should handle single-digit exercise counts', () => {
    renderWithTheme(
      <WorkoutSummary
        totalDurationMinutes={15}
        exerciseCount={3}
        difficulty="beginner"
      />
    );

    expect(screen.getByText('3 個運動')).toBeInTheDocument();
  });

  it('should handle large duration values', () => {
    renderWithTheme(
      <WorkoutSummary
        totalDurationMinutes={90}
        exerciseCount={12}
        difficulty="advanced"
      />
    );

    expect(screen.getByText('90 分鐘')).toBeInTheDocument();
  });

  it('should apply matcha green color to badges', () => {
    const { container } = renderWithTheme(
      <WorkoutSummary
        totalDurationMinutes={30}
        exerciseCount={6}
        difficulty="intermediate"
      />
    );

    const badges = container.querySelectorAll('[data-testid^="badge-"]');
    badges.forEach((badge) => {
      expect(badge).toHaveStyle({ color: expect.stringContaining('#') });
    });
  });

  it('should render all three badges in correct order', () => {
    renderWithTheme(
      <WorkoutSummary
        totalDurationMinutes={30}
        exerciseCount={6}
        difficulty="intermediate"
      />
    );

    const badges = screen.getAllByTestId(/badge-/);
    expect(badges).toHaveLength(3);
    
    // Check order: duration, count, difficulty
    expect(badges[0]).toHaveAttribute('data-testid', 'badge-duration');
    expect(badges[1]).toHaveAttribute('data-testid', 'badge-count');
    expect(badges[2]).toHaveAttribute('data-testid', 'badge-difficulty');
  });
});
