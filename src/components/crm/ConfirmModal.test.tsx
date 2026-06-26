import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmModal from './ConfirmModal';

function setup(over: Partial<React.ComponentProps<typeof ConfirmModal>> = {}) {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();
  render(
    <ConfirmModal
      open
      title="刪除帳號"
      message="確定要刪除嗎？"
      confirmLabel="確定刪除"
      onConfirm={onConfirm}
      onCancel={onCancel}
      {...over}
    />,
  );
  return { onConfirm, onCancel };
}

describe('ConfirmModal', () => {
  it('open 時以 ariaLabel 呈現 role=dialog', () => {
    setup();
    expect(screen.getByRole('dialog', { name: '刪除確認' })).toBeInTheDocument();
  });

  it('可自訂 ariaLabel', () => {
    setup({ ariaLabel: '移除確認' });
    expect(screen.getByRole('dialog', { name: '移除確認' })).toBeInTheDocument();
  });

  it('按確認鈕觸發 onConfirm', async () => {
    const user = userEvent.setup();
    const { onConfirm, onCancel } = setup();
    await user.click(screen.getByRole('button', { name: '確定刪除' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('按取消鈕觸發 onCancel 且不觸發 onConfirm', async () => {
    const user = userEvent.setup();
    const { onConfirm, onCancel } = setup();
    const dialog = screen.getByRole('dialog', { name: '刪除確認' });
    await user.click(within(dialog).getByRole('button', { name: '取消' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
