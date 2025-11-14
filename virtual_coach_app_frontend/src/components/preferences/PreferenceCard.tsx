/**
 * PreferenceCard Component
 * Matcha green themed card for preference sections
 * Features: hover animation, badges, interactive states
 */

import React from 'react';
import { Card, Badge, Group, Text, Stack } from '@mantine/core';
import { motion } from 'framer-motion';
import { matchaGreen } from '../../theme/colors';

export interface PreferenceCardBadge {
  label: string;
  color?: string;
}

export interface PreferenceCardProps {
  title: string;
  description?: string;
  badges?: PreferenceCardBadge[];
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'filled' | 'outlined';
  ariaLabel?: string;
}

export const PreferenceCard: React.FC<PreferenceCardProps> = ({
  title,
  description,
  badges,
  children,
  onClick,
  variant = 'filled',
  ariaLabel,
}) => {
  const isInteractive = !!onClick;

  const cardStyles = {
    backgroundColor: variant === 'filled' ? matchaGreen[50] : 'white',
    borderColor: matchaGreen[500],
    borderWidth: variant === 'outlined' ? 2 : 1,
    cursor: isInteractive ? 'pointer' : 'default',
  };

  const content = (
    <Card
      shadow="sm"
      padding="lg"
      radius="lg"
      withBorder
      style={cardStyles}
      {...(isInteractive && {
        role: 'button',
        tabIndex: 0,
        'aria-label': ariaLabel || title,
        onClick,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        },
      })}
      data-selected={isInteractive ? 'false' : undefined}
    >
      <Stack gap="md">
        {/* Header with title and badges */}
        <div>
          <Group justify="space-between" mb="xs">
            <Text size="lg" fw={600} c={matchaGreen[900]}>
              {title}
            </Text>
            {badges && badges.length > 0 && (
              <Group gap="xs">
                {badges.map((badge, index) => (
                  <Badge
                    key={index}
                    color={badge.color || 'green'}
                    variant="light"
                    size="sm"
                  >
                    {badge.label}
                  </Badge>
                ))}
              </Group>
            )}
          </Group>
          {description && (
            <Text size="sm" c="dimmed">
              {description}
            </Text>
          )}
        </div>

        {/* Card content */}
        <div>{children}</div>
      </Stack>
    </Card>
  );

  // Wrap with Framer Motion for hover animation if interactive
  if (isInteractive) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};
