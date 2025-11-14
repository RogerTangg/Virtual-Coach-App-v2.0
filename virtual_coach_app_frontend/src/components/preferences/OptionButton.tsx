/**
 * OptionButton Component
 * Icon + label button for preference options
 * Features: matcha green variants (outline/filled), scale hover effect
 */

import React from 'react';
import { UnstyledButton, Group, Text, Box } from '@mantine/core';
import { motion } from 'framer-motion';
import { matchaGreen, backgroundColor } from '../../theme/colors';

export interface OptionButtonProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  selected: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  icon,
  label,
  value,
  selected,
  onChange,
  disabled = false,
}) => {
  const buttonStyles = {
    padding: '16px 20px',
    borderRadius: '12px',
    border: `2px solid ${selected ? matchaGreen[500] : matchaGreen[200]}`,
    backgroundColor: selected ? matchaGreen[500] : backgroundColor.default,
    color: selected ? 'white' : matchaGreen[900],
    width: '100%',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const handleClick = () => {
    if (!disabled) {
      onChange(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onChange(value);
    }
  };

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ duration: 0.15 }}
      style={{ width: '100%' }}
    >
      <UnstyledButton
        style={buttonStyles}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-pressed={selected}
        data-selected={selected}
      >
        <Group gap="md" justify="center">
          {/* Icon */}
          <Box
            style={{
              fontSize: '32px',
              lineHeight: 1,
              filter: selected ? 'brightness(1.2)' : 'brightness(1)',
            }}
          >
            {icon}
          </Box>

          {/* Label */}
          <Text
            size="md"
            fw={selected ? 600 : 500}
            style={{
              color: selected ? 'white' : matchaGreen[900],
            }}
          >
            {label}
          </Text>
        </Group>
      </UnstyledButton>
    </motion.div>
  );
};
