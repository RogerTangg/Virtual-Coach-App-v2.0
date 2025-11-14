/**
 * DurationSlider Component
 * Matcha green themed slider with real-time value display
 * Features: green track, accessible, keyboard navigation
 */

import React from 'react';
import { Slider, Stack, Group, Text, Box } from '@mantine/core';
import { matchaGreen } from '../../theme/colors';

export interface DurationSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
  ariaLabel?: string;
}

export const DurationSlider: React.FC<DurationSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  unit = '分鐘',
  onChange,
  ariaLabel,
}) => {
  return (
    <Stack gap="sm">
      {/* Label and current value */}
      <Group justify="space-between">
        <Text size="md" fw={500} c={matchaGreen[900]}>
          {label}
        </Text>
        <Box
          style={{
            padding: '4px 12px',
            backgroundColor: matchaGreen[100],
            borderRadius: '16px',
          }}
        >
          <Text size="md" fw={600} c={matchaGreen[700]}>
            {value} {unit}
          </Text>
        </Box>
      </Group>

      {/* Slider */}
      <Slider
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        marks={[
          { value: min, label: `${min} min` },
          { value: max, label: `${max} min` },
        ]}
        color="green"
        size="md"
        aria-label={ariaLabel || label}
        styles={{
          track: {
            backgroundColor: matchaGreen[200],
          },
          bar: {
            backgroundColor: matchaGreen[500],
          },
          thumb: {
            borderColor: matchaGreen[500],
            backgroundColor: 'white',
            borderWidth: 3,
          },
          mark: {
            borderColor: matchaGreen[300],
          },
          markLabel: {
            color: matchaGreen[600],
            fontSize: '12px',
          },
        }}
      />
    </Stack>
  );
};
