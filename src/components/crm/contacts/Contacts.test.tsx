import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contacts from './Contacts';

function wholeText(expected: string) {
  return (_content: string, node: Element | null) => {
    if (!node) return false;
    const has = (n: Element) => n.textContent?.replace(/\s+/g, ' ').trim() === expected;
    return has(node) && Array.from(node.children).every((c) => !has(c));
  };
}

function renderContacts() {
  return render(<Contacts showToast={() => {}} />);
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

describe('Contacts 搜尋', () => {
  it('依姓名過濾，只顯示相符的列', async () => {
    const user = userEvent.setup();
    renderContacts();
    await user.type(screen.getByRole('searchbox', { name: '搜尋聯絡人' }), '佳蓉');

    expect(within(table()).getByText('林佳蓉')).toBeInTheDocument();
    expect(within(table()).queryByText('王俊傑')).not.toBeInTheDocument();
  });

  it('依公司名稱過濾', async () => {
    const user = userEvent.setup();
    renderContacts();
    await user.type(screen.getByRole('searchbox', { name: '搜尋聯絡人' }), '鴻海');

    expect(within(table()).getByText('陳冠宇')).toBeInTheDocument();
    expect(within(table()).queryByText('王俊傑')).not.toBeInTheDocument();
  });

  it('清空關鍵字後還原全部', async () => {
    const user = userEvent.setup();
    renderContacts();
    const box = screen.getByRole('searchbox', { name: '搜尋聯絡人' });
    await user.type(box, '佳蓉');
    await user.clear(box);

    expect(within(table()).getByText('林佳蓉')).toBeInTheDocument();
    expect(within(table()).getByText('王俊傑')).toBeInTheDocument();
  });

  it('無相符時顯示空狀態且「共 N 位」為 0', async () => {
    const user = userEvent.setup();
    renderContacts();
    await user.type(screen.getByRole('searchbox', { name: '搜尋聯絡人' }), 'zzz不存在');

    expect(screen.getByText(/找不到符合.*的聯絡人/)).toBeInTheDocument();
    expect(screen.getByText(wholeText('共 0 位'))).toBeInTheDocument();
  });
});

describe('Contacts 新增', () => {
  it('填妥姓名後儲存，清單多一筆且計數 +1', async () => {
    const user = userEvent.setup();
    renderContacts();
    expect(screen.getByText(wholeText('共 8 位'))).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '新增聯絡人' }));
    await user.type(screen.getByLabelText('姓名'), '新窗口甲');
    await user.click(screen.getByRole('button', { name: '儲存' }));

    expect(within(table()).getByText('新窗口甲')).toBeInTheDocument();
    expect(screen.getByText(wholeText('共 9 位'))).toBeInTheDocument();
  });

  it('姓名空白時按儲存顯示錯誤且不新增', async () => {
    const user = userEvent.setup();
    renderContacts();

    await user.click(screen.getByRole('button', { name: '新增聯絡人' }));
    await user.click(screen.getByRole('button', { name: '儲存' }));

    expect(screen.getByText('請輸入姓名')).toBeInTheDocument();
    expect(screen.getByText(wholeText('共 8 位'))).toBeInTheDocument();
  });
});

describe('Contacts 編輯', () => {
  it('修改姓名後儲存，該列更新且筆數不變', async () => {
    const user = userEvent.setup();
    renderContacts();

    await openDetail(user, '王俊傑');
    await user.click(screen.getByRole('button', { name: '編輯' }));
    const nameInput = screen.getByLabelText('姓名');
    await user.clear(nameInput);
    await user.type(nameInput, '王俊傑改');
    await user.click(screen.getByRole('button', { name: '儲存' }));

    expect(within(table()).getByText('王俊傑改')).toBeInTheDocument();
    expect(within(table()).queryByText('王俊傑')).not.toBeInTheDocument();
    expect(screen.getByText(wholeText('共 8 位'))).toBeInTheDocument();
  });

  it('編輯時清空姓名按儲存顯示錯誤', async () => {
    const user = userEvent.setup();
    renderContacts();

    await openDetail(user, '李欣怡');
    await user.click(screen.getByRole('button', { name: '編輯' }));
    await user.clear(screen.getByLabelText('姓名'));
    await user.click(screen.getByRole('button', { name: '儲存' }));

    expect(screen.getByText('請輸入姓名')).toBeInTheDocument();
  });
});

describe('Contacts 刪除', () => {
  it('點刪除並確認後，該列消失且計數 -1', async () => {
    const user = userEvent.setup();
    renderContacts();

    await openDetail(user, '陳冠宇');
    await user.click(screen.getByRole('button', { name: '刪除聯絡人' }));
    await user.click(screen.getByRole('button', { name: '確定刪除' }));

    expect(within(table()).queryByText('陳冠宇')).not.toBeInTheDocument();
    expect(screen.getByText(wholeText('共 7 位'))).toBeInTheDocument();
  });

  it('取消刪除則該列保留', async () => {
    const user = userEvent.setup();
    renderContacts();

    await openDetail(user, '陳冠宇');
    await user.click(screen.getByRole('button', { name: '刪除聯絡人' }));
    const dialog = screen.getByRole('dialog', { name: '刪除確認' });
    await user.click(within(dialog).getByRole('button', { name: '取消' }));

    expect(within(table()).getByText('陳冠宇')).toBeInTheDocument();
    expect(screen.getByText(wholeText('共 8 位'))).toBeInTheDocument();
  });
});
