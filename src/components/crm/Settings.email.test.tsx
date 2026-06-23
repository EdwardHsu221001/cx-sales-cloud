import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Settings from './Settings';

// Settings 透過 next/navigation 解析 activeTab；mock 成郵件設定頁。
vi.mock('next/navigation', () => ({
  usePathname: () => '/settings/email',
  useRouter: () => ({ push: vi.fn() }),
}));

function renderEmail() {
  return render(<Settings showToast={() => {}} />);
}

describe('郵件設定頁', () => {
  it('顯示標題並預設選取第一個範本（顯示其主旨）', () => {
    renderEmail();
    expect(screen.getByRole('heading', { name: /郵件設定/ })).toBeInTheDocument();
    // 第一個範本 quote_send 的主旨：您的報價單 {{Opportunity.Name}} 已備妥
    expect(screen.getByText(/已備妥/)).toBeInTheDocument();
  });

  it('搜尋過濾清單：相符顯示、不相符隱藏', async () => {
    const user = userEvent.setup();
    renderEmail();
    const box = screen.getByRole('searchbox', { name: '搜尋範本' });

    await user.type(box, '月報');

    expect(screen.getByText('月度電子報')).toBeInTheDocument();
    // 非選取且不相符的範本應自清單消失
    expect(screen.queryByText('提案後跟進')).not.toBeInTheDocument();
  });

  it('搜尋框可連續輸入多個字元（輸入不失焦）', async () => {
    const user = userEvent.setup();
    renderEmail();
    const box = screen.getByRole('searchbox', { name: '搜尋範本' });

    await user.type(box, '報價單');

    expect(screen.getByRole('searchbox', { name: '搜尋範本' })).toHaveValue('報價單');
  });

  it('搜尋無結果顯示提示', async () => {
    const user = userEvent.setup();
    renderEmail();
    const box = screen.getByRole('searchbox', { name: '搜尋範本' });

    await user.type(box, 'zzzzzz');

    expect(screen.getByText('查無符合的範本')).toBeInTheDocument();
  });

  it('點選另一個範本後右側詳情更新', async () => {
    const user = userEvent.setup();
    renderEmail();

    await user.click(screen.getByText('贏單恭賀通知'));

    // won_notify 主旨：歡迎加入！感謝 {{Account.Name}} 選擇 CX CRM
    expect(screen.getByText(/選擇 CX CRM/)).toBeInTheDocument();
  });
});
