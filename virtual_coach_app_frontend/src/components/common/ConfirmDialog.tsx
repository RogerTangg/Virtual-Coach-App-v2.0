/**
 * ConfirmDialog Component
 * Green-themed modal for confirmation actions
 */

import { Modal, Button, Text, Group } from '@mantine/core';
import { matchaGreen } from '../../theme/colors';

export interface ConfirmDialogProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: string;
  loading?: boolean;
}

/**
 * 確認對話框元件
 * 
 * 綠色主題的確認對話框，用於重要操作的二次確認
 */
export function ConfirmDialog({
  opened,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = '確認',
  cancelLabel = '取消',
  confirmColor = matchaGreen[500],
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="lg" fw={700} c="#1f2937">
          {title}
        </Text>
      }
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
        color: matchaGreen[900],
      }}
      styles={{
        content: {
          borderRadius: '16px',
          padding: '8px',
        },
        header: {
          paddingBottom: '16px',
        },
        body: {
          paddingTop: '8px',
        },
      }}
    >
      <Text size="sm" c="#6b7280" mb="xl">
        {message}
      </Text>

      <Group justify="flex-end" gap="md">
        <Button
          onClick={onClose}
          variant="outline"
          size="md"
          disabled={loading}
          style={{
            borderColor: '#d1d5db',
            color: '#6b7280',
            borderWidth: '2px',
            borderRadius: '8px',
          }}
        >
          {cancelLabel}
        </Button>

        <Button
          onClick={onConfirm}
          size="md"
          loading={loading}
          style={{
            backgroundColor: confirmColor,
            color: 'white',
            borderRadius: '8px',
          }}
        >
          {confirmLabel}
        </Button>
      </Group>
    </Modal>
  );
}
