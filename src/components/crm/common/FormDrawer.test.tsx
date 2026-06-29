import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormDrawer from './FormDrawer';

function setup(over: Partial<React.ComponentProps<typeof FormDrawer>> = {}) {
  const onClose = vi.fn();
  const onSave = vi.fn();
  render(
    <FormDrawer
      crumbRoot="客戶帳號"
      noun="帳號"
      isEdit={false}
      onClose={onClose}
      onSave={onSave}
      {...over}
    >
      <label className="cx-emf-field">
        <span className="l">名稱</span>
        <input />
      </label>
    </FormDrawer>
  );
  return { onClose, onSave };
}

describe('FormDrawer', () => {
  it('isEdit=false 時標題/aria-label 為「新增{noun}」', () => {
    setup({ isEdit: false });
    expect(screen.getByRole('complementary', { name: '新增帳號' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '新增帳號' })).toBeInTheDocument();
  });

  it('isEdit=true 時標題/aria-label 為「編輯{noun}」', () => {
    setup({ isEdit: true });
    expect(screen.getByRole('complementary', { name: '編輯帳號' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '編輯帳號' })).toBeInTheDocument();
  });

  it('麵包屑顯示 crumbRoot ／ 動作', () => {
    setup({ crumbRoot: '聯絡人', noun: '聯絡人', isEdit: true });
    const aside = screen.getByRole('complementary', { name: '編輯聯絡人' });
    expect(aside.textContent).toContain('聯絡人');
    expect(aside.textContent).toContain('編輯');
  });

  it('渲染呼叫端傳入的欄位 children', () => {
    setup();
    expect(screen.getByText('名稱')).toBeInTheDocument();
  });

  it('按取消與關閉鈕都觸發 onClose', async () => {
    const user = userEvent.setup();
    const { onClose, onSave } = setup();
    await user.click(screen.getByRole('button', { name: '取消' }));
    await user.click(screen.getByRole('button', { name: '關閉' }));
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(onSave).not.toHaveBeenCalled();
  });

  it('按儲存觸發 onSave', async () => {
    const user = userEvent.setup();
    const { onClose, onSave } = setup();
    const aside = screen.getByRole('complementary', { name: '新增帳號' });
    await user.click(within(aside).getByRole('button', { name: '儲存' }));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });
});
