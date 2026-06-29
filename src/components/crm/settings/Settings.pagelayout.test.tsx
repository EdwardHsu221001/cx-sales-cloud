import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Settings from './Settings';

// Settings 由 pathname 解析 activeTab；mock 成頁面版面頁。
vi.mock('next/navigation', () => ({
  usePathname: () => '/settings/pagelayout',
  useRouter: () => ({ push: vi.fn() }),
}));

function renderPageLayout() {
  return render(<Settings showToast={() => {}} />);
}

describe('頁面版面 — 統計與切換', () => {
  it('顯示標題與「版面總數 5」', () => {
    renderPageLayout();
    expect(screen.getByRole('heading', { name: /頁面版面/ })).toBeInTheDocument();
    const label = screen.getByText('版面總數');
    expect(label.previousElementSibling).toHaveTextContent('5');
  });

  it('切換物件（商機→客戶帳號）後 pills 隨之更換', async () => {
    const user = userEvent.setup();
    renderPageLayout();

    expect(screen.getByText('商機 — 主管版面')).toBeInTheDocument(); // 商機有 2 個版面

    await user.selectOptions(screen.getByDisplayValue('商機 Opportunity'), '客戶帳號 Account');

    expect(screen.queryByText('商機 — 主管版面')).not.toBeInTheDocument();
    // 客戶帳號 1 個版面（同名同時出現在 pill 與標題，故用 getAllByText）
    expect(screen.getAllByText('客戶帳號 — 標準版面').length).toBeGreaterThan(0);
  });
});

describe('頁面版面 — 調色盤搜尋', () => {
  it('相符只顯示符合項，無相符顯示提示', async () => {
    const user = userEvent.setup();
    renderPageLayout();
    const box = screen.getByPlaceholderText('搜尋可用項目…');

    await user.type(box, '折扣');
    expect(screen.getByText('折扣率')).toBeInTheDocument();
    expect(screen.queryByText('競爭對手')).not.toBeInTheDocument();

    await user.clear(box);
    await user.type(box, 'zzz不存在');
    expect(screen.getByText('查無符合的項目')).toBeInTheDocument();
  });
});

describe('頁面版面 — 編輯版面', () => {
  it('移除欄位後該欄位消失', async () => {
    const user = userEvent.setup();
    renderPageLayout();

    const field = screen.getByText('商機名稱').closest('.cx-pl-field') as HTMLElement;
    await user.click(within(field).getByTitle('移除'));

    expect(screen.queryByText('商機名稱')).not.toBeInTheDocument();
  });

  it('點區段標題切換折疊', async () => {
    const user = userEvent.setup();
    renderPageLayout();

    const section = screen.getByText('重點資訊').closest('.cx-pl-section') as HTMLElement;
    expect(section).not.toHaveClass('collapsed');

    await user.click(screen.getByText('重點資訊'));

    expect(section).toHaveClass('collapsed');
  });
});
