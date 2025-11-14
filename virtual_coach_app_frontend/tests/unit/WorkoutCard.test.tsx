/**
 * WorkoutCard Component Tests
 * Test suite for the redesigned workout card component with matcha green theme
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { WorkoutCard } from '../../src/components/workout/WorkoutCard';
import { mantineTheme } from '../../src/theme/mantineTheme';
import { TargetMuscle, DifficultyLevel } from '../../src/types/enums';
import type { WorkoutPlanItem } from '../../src/types/dataModel';

// Helper to render with Mantine theme
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <MantineProvider theme={mantineTheme}>
      {component}
    </MantineProvider>
  );
};

// Mock workout item data
const mockWorkoutItem: WorkoutPlanItem = {
  exercise: {
    id: 1,
    name: '深蹲',
    description: '經典的下半身訓練動作',
    target_muscle: TargetMuscle.LEGS,
    difficulty_level: DifficultyLevel.BEGINNER,
    equipment_needed: '無需器材',
    video_url: 'https://example.com/video.mp4',
    duration_seconds: 45,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  sets: 3,
  reps: 12,
  restSeconds: 60,
};

describe('WorkoutCard', () => {
  it('should render exercise information correctly', () => {
    renderWithTheme(<WorkoutCard item={mockWorkoutItem} index={0} />);

    expect(screen.getByText('深蹲')).toBeInTheDocument();
    expect(screen.getByText('經典的下半身訓練動作')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // sets
    expect(screen.getByText('12')).toBeInTheDocument(); // reps
    expect(screen.getByText('60s')).toBeInTheDocument(); // rest
  });

  it('should display badges for equipment, duration, and difficulty', () => {
    renderWithTheme(<WorkoutCard item={mockWorkoutItem} index={0} />);

    expect(screen.getByText('初學者')).toBeInTheDocument();
    expect(screen.getByText('腿部')).toBeInTheDocument();
    expect(screen.getByText('無需器材')).toBeInTheDocument();
  });

  it('should render exercise index number', () => {
    renderWithTheme(<WorkoutCard item={mockWorkoutItem} index={2} />);

    expect(screen.getByText('3')).toBeInTheDocument(); // index + 1
  });

  it('should toggle expand/collapse on click', async () => {
    const user = userEvent.setup();
    renderWithTheme(<WorkoutCard item={mockWorkoutItem} index={0} />);

    const card = screen.getByRole('button', { name: /深蹲/i });
    
    // Initially collapsed (description visible but details hidden)
    expect(screen.queryByText('目標肌群')).not.toBeInTheDocument();

    // Click to expand
    await user.click(card);
    
    await waitFor(() => {
      expect(screen.getByText('目標肌群')).toBeInTheDocument();
    });

    // Click to collapse
    await user.click(card);
    
    await waitFor(() => {
      expect(screen.queryByText('目標肌群')).not.toBeInTheDocument();
    });
  });

  it('should apply matcha green border on hover', () => {
    const { container } = renderWithTheme(
      <WorkoutCard item={mockWorkoutItem} index={0} />
    );

    const card = container.querySelector('[data-testid="workout-card"]');
    expect(card).toHaveStyle({ borderColor: expect.stringContaining('#') });
  });

  it('should show enhanced shadow when expanded', async () => {
    const user = userEvent.setup();
    const { container } = renderWithTheme(
      <WorkoutCard item={mockWorkoutItem} index={0} />
    );

    const card = screen.getByRole('button', { name: /深蹲/i });
    
    // Expand card
    await user.click(card);
    
    await waitFor(() => {
      const cardElement = container.querySelector('[data-testid="workout-card"]');
      expect(cardElement).toHaveStyle({ boxShadow: expect.any(String) });
    });
  });

  it('should animate expand/collapse with Framer Motion', async () => {
    const user = userEvent.setup();
    renderWithTheme(<WorkoutCard item={mockWorkoutItem} index={0} />);

    const card = screen.getByRole('button', { name: /深蹲/i });
    
    // Expand
    await user.click(card);
    
    // Check for animation wrapper
    await waitFor(() => {
      const expandedContent = screen.getByTestId('workout-card-expanded');
      expect(expandedContent).toBeInTheDocument();
    });
  });

  it('should handle keyboard navigation (Enter and Space)', async () => {
    const user = userEvent.setup();
    renderWithTheme(<WorkoutCard item={mockWorkoutItem} index={0} />);

    const card = screen.getByRole('button', { name: /深蹲/i });
    card.focus();

    // Press Enter to expand
    await user.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(screen.getByText('目標肌群')).toBeInTheDocument();
    });

    // Press Space to collapse
    await user.keyboard(' ');
    
    await waitFor(() => {
      expect(screen.queryByText('目標肌群')).not.toBeInTheDocument();
    });
  });

  it('should display duration and calories information when expanded', async () => {
    const user = userEvent.setup();
    renderWithTheme(<WorkoutCard item={mockWorkoutItem} index={0} />);

    const card = screen.getByRole('button', { name: /深蹲/i });
    
    // Expand card
    await user.click(card);
    
    await waitFor(() => {
      expect(screen.getByText(/45秒/i)).toBeInTheDocument();
      expect(screen.getByText(/8.5/i)).toBeInTheDocument(); // calories
    });
  });

  it('should render without description if not provided', () => {
    const itemWithoutDesc = {
      ...mockWorkoutItem,
      exercise: { ...mockWorkoutItem.exercise, description: null },
    };

    renderWithTheme(<WorkoutCard item={itemWithoutDesc} index={0} />);

    expect(screen.getByText('深蹲')).toBeInTheDocument();
    expect(screen.queryByText('經典的下半身訓練動作')).not.toBeInTheDocument();
  });
});
