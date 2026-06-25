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

describe('郵件範本編輯', () => {
  it('點「編輯範本」開啟抽屜，欄位預填選取範本內容', async () => {
    const user = userEvent.setup();
    renderEmail();

    await user.click(screen.getByRole('button', { name: '編輯範本' }));

    expect(screen.getByLabelText('範本名稱')).toHaveValue('報價單寄送');
    expect(screen.getByLabelText('主旨')).toHaveValue('您的報價單 {{Opportunity.Name}} 已備妥');
  });

  it('改名稱與主旨後儲存，清單與詳情即時反映', async () => {
    const user = userEvent.setup();
    renderEmail();

    await user.click(screen.getByRole('button', { name: '編輯範本' }));
    const name = screen.getByLabelText('範本名稱');
    await user.clear(name);
    await user.type(name, '報價單寄送（改）');
    const subj = screen.getByLabelText('主旨');
    await user.clear(subj);
    await user.type(subj, '新主旨已更新');
    await user.click(screen.getByRole('button', { name: '儲存' }));

    // 舊名稱不再存在（清單列與詳情都已更新），新名稱出現
    expect(screen.queryByText('報價單寄送')).not.toBeInTheDocument();
    expect(screen.getAllByText('報價單寄送（改）').length).toBeGreaterThan(0);
    expect(screen.getByText('新主旨已更新')).toBeInTheDocument();
  });

  it('關閉啟用狀態後儲存，統計「啟用中」減少', async () => {
    const user = userEvent.setup();
    renderEmail();
    const activeBefore = Number(screen.getByLabelText('啟用中範本數').textContent);

    await user.click(screen.getByRole('button', { name: '編輯範本' }));
    await user.click(screen.getByRole('switch', { name: '啟用狀態' }));
    await user.click(screen.getByRole('button', { name: '儲存' }));

    const activeAfter = Number(screen.getByLabelText('啟用中範本數').textContent);
    expect(activeAfter).toBe(activeBefore - 1);
  });

  it('編輯文字內文區塊後儲存，預覽反映；報價/簽名區塊唯讀', async () => {
    const user = userEvent.setup();
    renderEmail();

    await user.click(screen.getByRole('button', { name: '編輯範本' }));
    // quote/sig 區塊唯讀，無對應可編輯輸入，且顯示說明
    expect(screen.queryByLabelText('報價表')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('簽名')).not.toBeInTheDocument();
    expect(screen.getAllByText('此區塊維持原結構，本版不可編輯。').length).toBeGreaterThanOrEqual(2);

    const greet = screen.getByLabelText('問候');
    await user.clear(greet);
    await user.type(greet, '嗨，朋友');
    await user.click(screen.getByRole('button', { name: '儲存' }));

    expect(screen.getByText('嗨，朋友')).toBeInTheDocument();
  });

  it('取消捨棄草稿，來源資料不變', async () => {
    const user = userEvent.setup();
    renderEmail();

    await user.click(screen.getByRole('button', { name: '編輯範本' }));
    const name = screen.getByLabelText('範本名稱');
    await user.clear(name);
    await user.type(name, '不該保存的名稱');
    await user.click(screen.getByRole('button', { name: '取消' }));

    expect(screen.queryByText('不該保存的名稱')).not.toBeInTheDocument();
    expect(screen.getAllByText('報價單寄送').length).toBeGreaterThan(0);
  });

  it('名稱或主旨清空時「儲存」停用並顯示必填提示', async () => {
    const user = userEvent.setup();
    renderEmail();

    await user.click(screen.getByRole('button', { name: '編輯範本' }));
    await user.clear(screen.getByLabelText('範本名稱'));

    expect(screen.getByRole('button', { name: '儲存' })).toBeDisabled();
    expect(screen.getByText('請輸入範本名稱')).toBeInTheDocument();
  });
});
