import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Accounts from './Accounts';

// 文字被 <b> 拆成多個節點時，用 textContent 比對整段（不依賴 class）。
function wholeText(expected: string) {
  return (_content: string, node: Element | null) => {
    if (!node) return false;
    const has = (n: Element) => n.textContent?.replace(/\s+/g, ' ').trim() === expected;
    return has(node) && Array.from(node.children).every((c) => !has(c));
  };
}

function renderAccounts() {
  return render(<Accounts showToast={() => {}} />);
}

function table() {
  return screen.getByRole('table');
}

function rowOf(name: string) {
  return within(table()).getByText(name).closest('tr') as HTMLElement;
}

async function openDetail(user: ReturnType<typeof userEvent.setup>, name: string) {
  await user.click(rowOf(name));
}

describe('Accounts 搜尋', () => {
  it('輸入關鍵字後只顯示相符的列', async () => {
    const user = userEvent.setup();
    renderAccounts();
    const box = screen.getByRole('searchbox', { name: '搜尋帳號' });

    await user.type(box, '台積');

    expect(screen.getByText('台積電')).toBeInTheDocument();
    expect(screen.queryByText('鴻海精密')).not.toBeInTheDocument();
  });

  it('依網域過濾（不分大小寫）', async () => {
    const user = userEvent.setup();
    renderAccounts();
    const box = screen.getByRole('searchbox', { name: '搜尋帳號' });

    await user.type(box, 'FOXCONN');

    expect(screen.getByText('鴻海精密')).toBeInTheDocument();
    expect(screen.queryByText('台積電')).not.toBeInTheDocument();
  });

  it('清空關鍵字後還原全部', async () => {
    const user = userEvent.setup();
    renderAccounts();
    const box = screen.getByRole('searchbox', { name: '搜尋帳號' });

    await user.type(box, '台積');
    await user.clear(box);

    expect(screen.getByText('台積電')).toBeInTheDocument();
    expect(screen.getByText('鴻海精密')).toBeInTheDocument();
  });

  it('無相符時顯示空狀態且「共 N 家」為 0', async () => {
    const user = userEvent.setup();
    renderAccounts();
    const box = screen.getByRole('searchbox', { name: '搜尋帳號' });

    await user.type(box, 'zzz不存在');

    expect(screen.getByText(/找不到符合.*的帳號/)).toBeInTheDocument();
    expect(screen.getByText(wholeText('共 0 家'))).toBeInTheDocument();
  });

  it('「共 N 家」反映過濾後的筆數', async () => {
    const user = userEvent.setup();
    renderAccounts();
    const box = screen.getByRole('searchbox', { name: '搜尋帳號' });

    await user.type(box, '台積');

    expect(screen.getByText(wholeText('共 1 家'))).toBeInTheDocument();
  });
});

describe('Accounts 新增', () => {
  it('填妥名稱後儲存，清單多一筆且計數 +1', async () => {
    const user = userEvent.setup();
    renderAccounts();
    expect(screen.getByText(wholeText('共 7 家'))).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '新增帳號' }));
    await user.type(screen.getByLabelText('名稱'), '新創公司甲');
    await user.click(screen.getByRole('button', { name: '儲存' }));

    expect(screen.getByText('新創公司甲')).toBeInTheDocument();
    expect(screen.getByText(wholeText('共 8 家'))).toBeInTheDocument();
  });

  it('名稱空白時按儲存顯示錯誤且不新增', async () => {
    const user = userEvent.setup();
    renderAccounts();

    await user.click(screen.getByRole('button', { name: '新增帳號' }));
    await user.click(screen.getByRole('button', { name: '儲存' }));

    expect(screen.getByText('請輸入帳號名稱')).toBeInTheDocument();
    expect(screen.getByText(wholeText('共 7 家'))).toBeInTheDocument();
  });
});

describe('Accounts 編輯', () => {
  it('修改名稱後儲存，該列更新且筆數不變', async () => {
    const user = userEvent.setup();
    renderAccounts();

    await openDetail(user, '台積電');
    await user.click(screen.getByRole('button', { name: '編輯' }));
    const nameInput = screen.getByLabelText('名稱');
    await user.clear(nameInput);
    await user.type(nameInput, '台積電股份');
    await user.click(screen.getByRole('button', { name: '儲存' }));

    expect(within(table()).getByText('台積電股份')).toBeInTheDocument();
    expect(within(table()).queryByText('台積電')).not.toBeInTheDocument();
    expect(screen.getByText(wholeText('共 7 家'))).toBeInTheDocument();
  });

  it('編輯時清空名稱按儲存顯示錯誤且不更新', async () => {
    const user = userEvent.setup();
    renderAccounts();

    await openDetail(user, '鴻海精密');
    await user.click(screen.getByRole('button', { name: '編輯' }));
    await user.clear(screen.getByLabelText('名稱'));
    await user.click(screen.getByRole('button', { name: '儲存' }));

    expect(screen.getByText('請輸入帳號名稱')).toBeInTheDocument();
  });
});

describe('Accounts 刪除', () => {
  it('點刪除並確認後，該列消失且計數 -1', async () => {
    const user = userEvent.setup();
    renderAccounts();

    await openDetail(user, '鴻海精密');
    await user.click(screen.getByRole('button', { name: '刪除帳號' }));
    await user.click(screen.getByRole('button', { name: '確定刪除' }));

    expect(screen.queryByText('鴻海精密')).not.toBeInTheDocument();
    expect(screen.getByText(wholeText('共 6 家'))).toBeInTheDocument();
  });

  it('取消刪除則該列保留', async () => {
    const user = userEvent.setup();
    renderAccounts();

    await openDetail(user, '鴻海精密');
    await user.click(screen.getByRole('button', { name: '刪除帳號' }));
    const dialog = screen.getByRole('dialog', { name: '刪除確認' });
    await user.click(within(dialog).getByRole('button', { name: '取消' }));

    expect(within(table()).getByText('鴻海精密')).toBeInTheDocument();
    expect(screen.getByText(wholeText('共 7 家'))).toBeInTheDocument();
  });
});
