/**
 * ExerciseCard Component Tests
 * Test suite for expandable exercise card component with matcha green theme
 */

import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { ExerciseCard } from '../../src/components/workout/ExerciseCard';
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
    name: '伏地挺身',
    description: '鍛鍊胸部、肩膀和手臂的複合動作',
    target_muscle: TargetMuscle.CHEST,
    difficulty_level: DifficultyLevel.INTERMEDIATE,
    equipment_needed: '無需器材',
    video_url: 'https://example.com/pushup.mp4',
    duration_seconds: 60,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  sets: 3,
  reps: 10,
  restSeconds: 60,
};

describe('ExerciseCard', () => {
  it('should render exercise name and description', () => {
    renderWithTheme(<ExerciseCard item={mockWorkoutItem} index={0} />);

    expect(screen.getByText('伏地挺身')).toBeInTheDocument();
    expect(screen.getByText('鍛鍊胸部、肩膀和手臂的複合動作')).toBeInTheDocument();
  });

  it('should display equipment label', () => {
    renderWithTheme(<ExerciseCard item={mockWorkoutItem} index={0} />);

    expect(screen.getByText('無需器材')).toBeInTheDocument();
  });

  it('should display duration label', () => {
    renderWithTheme(<ExerciseCard item={mockWorkoutItem} index={0} />);

    expect(screen.getByText(/60 秒/i)).toBeInTheDocument();
  });

  it('should display difficulty label', () => {
    renderWithTheme(<ExerciseCard item={mockWorkoutItem} index={0} />);

    expect(screen.getByText('中階')).toBeInTheDocument();
  });

  it('should be collapsed by default', () => {
    renderWithTheme(<ExerciseCard item={mockWorkoutItem} index={0} />);

    // Detailed info should not be visible initially
    expect(screen.queryByText('運動說明')).not.toBeInTheDocument();
  });

  it('should expand on click to show detailed info', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ExerciseCard item={mockWorkoutItem} index={0} />);

    const card = screen.getByRole('button');
    
    // Click to expand
    await user.click(card);
    
    await waitFor(() => {
      expect(screen.getByText('運動說明')).toBeInTheDocument();
      expect(screen.getByText('訓練細節')).toBeInTheDocument();
    });
  });

  it('should collapse when clicked again', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ExerciseCard item={mockWorkoutItem} index={0} />);

    const card = screen.getByRole('button');
    
    // Expand
    await user.click(card);
    await waitFor(() => {
      expect(screen.getByText('運動說明')).toBeInTheDocument();
    });

    // Collapse
    await user.click(card);
    await waitFor(() => {
      expect(screen.queryByText('運動說明')).not.toBeInTheDocument();
    });
  });

  it('should handle keyboard navigation (Enter and Space)', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ExerciseCard item={mockWorkoutItem} index={0} />);

    const card = screen.getByRole('button');
    card.focus();

    // Press Enter to expand
    await user.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(screen.getByText('運動說明')).toBeInTheDocument();
    });

    // Press Space to collapse
    await user.keyboard(' ');
    
    await waitFor(() => {
      expect(screen.queryByText('運動說明')).not.toBeInTheDocument();
    });
  });

  it('should display video link when expanded', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ExerciseCard item={mockWorkoutItem} index={0} />);

    const card = screen.getByRole('button');
    
    // Expand
    await user.click(card);
    
    await waitFor(() => {
      const videoLink = screen.getByText('觀看教學影片');
      expect(videoLink).toBeInTheDocument();
      expect(videoLink.closest('a')).toHaveAttribute('href', 'https://example.com/pushup.mp4');
    });
  });

  it('should render without description if not provided', () => {
    const itemWithoutDesc = {
      ...mockWorkoutItem,
      exercise: { ...mockWorkoutItem.exercise, description: null },
    };

    renderWithTheme(<ExerciseCard item={itemWithoutDesc} index={0} />);

    expect(screen.getByText('伏地挺身')).toBeInTheDocument();
    expect(screen.queryByText('鍛鍊胸部、肩膀和手臂的複合動作')).not.toBeInTheDocument();
  });
});
