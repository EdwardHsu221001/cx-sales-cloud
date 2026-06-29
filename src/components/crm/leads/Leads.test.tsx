import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Leads from './Leads';

// 文字被 <b> 拆成多個節點時，用 textContent 比對整段（不依賴 class）。
function wholeText(expected: string) {
  return (_content: string, node: Element | null) => {
    if (!node) return false;
    const has = (n: Element) => n.textContent?.replace(/\s+/g, ' ').trim() === expected;
    return has(node) && Array.from(node.children).every((c) => !has(c));
  };
}

function renderLeads() {
  return render(<Leads showToast={() => {}} />);
}

describe('Leads 搜尋', () => {
  it('輸入關鍵字後只顯示相符的列', async () => {
    const user = userEvent.setup();
    renderLeads();
    const box = screen.getByRole('searchbox', { name: '搜尋潛客' });

    await user.type(box, '雅婷');

    expect(screen.getByText('陳雅婷')).toBeInTheDocument();
    expect(screen.queryByText('林志明')).not.toBeInTheDocument();
  });

  it('清空關鍵字後還原全部', async () => {
    const user = userEvent.setup();
    renderLeads();
    const box = screen.getByRole('searchbox', { name: '搜尋潛客' });

    await user.type(box, '雅婷');
    await user.clear(box);

    expect(screen.getByText('陳雅婷')).toBeInTheDocument();
    expect(screen.getByText('林志明')).toBeInTheDocument();
  });

  it('無相符時顯示空狀態訊息', async () => {
    const user = userEvent.setup();
    renderLeads();
    const box = screen.getByRole('searchbox', { name: '搜尋潛客' });

    await user.type(box, 'zzz不存在的關鍵字');

    expect(screen.getByText(/找不到符合.*的潛客/)).toBeInTheDocument();
    expect(screen.queryByText('陳雅婷')).not.toBeInTheDocument();
  });

  it('篩選列「共 N 筆」反映過濾後的筆數', async () => {
    const user = userEvent.setup();
    renderLeads();
    const box = screen.getByRole('searchbox', { name: '搜尋潛客' });

    await user.type(box, '雅婷');

    expect(screen.getByText(wholeText('共 1 筆'))).toBeInTheDocument();
  });

  it('分頁列「共 N 筆」總數也反映過濾後的筆數，不殘留 32', async () => {
    const user = userEvent.setup();
    renderLeads();
    const box = screen.getByRole('searchbox', { name: '搜尋潛客' });

    await user.type(box, '雅婷');

    const pagerInfo = screen.getByText((_content, node) => {
      const t = (node?.textContent ?? '').replace(/\s+/g, '');
      const isInfo = t.startsWith('顯示第') && t.includes('筆，共');
      const childIsInfo = Array.from(node?.children ?? []).some((c) =>
        (c.textContent ?? '').replace(/\s+/g, '').startsWith('顯示第'),
      );
      return isInfo && !childIsInfo;
    });
    const normalized = (pagerInfo.textContent ?? '').replace(/\s+/g, '');
    expect(normalized).toContain('共1筆');
    expect(normalized).not.toContain('32');
  });
});

function rowOf(name: string) {
  return screen.getByText(name).closest('tr') as HTMLElement;
}

async function openCreateDrawer(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: '新增潛客' }));
  await user.click(screen.getByText('手動新增'));
}

async function openRowMenu(user: ReturnType<typeof userEvent.setup>, name: string) {
  await user.click(within(rowOf(name)).getByRole('button', { name: '更多操作' }));
}

describe('Leads 新增', () => {
  it('填妥姓名與公司後儲存，清單多一筆且計數 +1', async () => {
    const user = userEvent.setup();
    renderLeads();
    expect(screen.getByText(wholeText('共 6 筆'))).toBeInTheDocument();

    await openCreateDrawer(user);
    await user.type(screen.getByLabelText('姓名'), '新潛客甲');
    await user.type(screen.getByLabelText('公司'), '新創公司');
    await user.click(screen.getByRole('button', { name: '儲存' }));

    expect(screen.getByText('新潛客甲')).toBeInTheDocument();
    expect(screen.getByText(wholeText('共 7 筆'))).toBeInTheDocument();
  });

  it('姓名或公司空白時按儲存顯示錯誤且不新增', async () => {
    const user = userEvent.setup();
    renderLeads();
    await openCreateDrawer(user);

    await user.click(screen.getByRole('button', { name: '儲存' }));

    expect(screen.getByText('請輸入姓名')).toBeInTheDocument();
    expect(screen.getByText('請輸入公司')).toBeInTheDocument();
    expect(screen.getByText(wholeText('共 6 筆'))).toBeInTheDocument();
  });
});

describe('Leads 編輯', () => {
  it('修改姓名後儲存，該列更新', async () => {
    const user = userEvent.setup();
    renderLeads();

    await openRowMenu(user, '黃柏翰');
    await user.click(within(rowOf('黃柏翰')).getByRole('menuitem', { name: '編輯' }));
    const nameInput = screen.getByLabelText('姓名');
    await user.clear(nameInput);
    await user.type(nameInput, '黃柏翰改');
    await user.click(screen.getByRole('button', { name: '儲存' }));

    expect(screen.getByText('黃柏翰改')).toBeInTheDocument();
    expect(screen.queryByText('黃柏翰')).not.toBeInTheDocument();
  });
});

describe('Leads 刪除', () => {
  it('點刪除並確認後，該列消失且計數 -1', async () => {
    const user = userEvent.setup();
    renderLeads();

    await openRowMenu(user, '黃柏翰');
    await user.click(within(rowOf('黃柏翰')).getByRole('menuitem', { name: '刪除' }));
    await user.click(screen.getByRole('button', { name: '確定刪除' }));

    expect(screen.queryByText('黃柏翰')).not.toBeInTheDocument();
    expect(screen.getByText(wholeText('共 5 筆'))).toBeInTheDocument();
  });

  it('取消刪除則該列保留', async () => {
    const user = userEvent.setup();
    renderLeads();

    await openRowMenu(user, '黃柏翰');
    await user.click(within(rowOf('黃柏翰')).getByRole('menuitem', { name: '刪除' }));
    const dialog = screen.getByRole('dialog', { name: '刪除確認' });
    await user.click(within(dialog).getByRole('button', { name: '取消' }));

    expect(screen.getByText('黃柏翰')).toBeInTheDocument();
  });
});

describe('Leads 轉換', () => {
  it('確認轉換後該列變「已轉化」且編輯/刪除停用', async () => {
    const user = userEvent.setup();
    renderLeads();

    await user.click(within(rowOf('林志明')).getByRole('button', { name: '轉換' }));
    await user.click(screen.getByRole('button', { name: '確認轉換' }));

    const row = rowOf('林志明');
    expect(within(row).getAllByText('已轉化').length).toBeGreaterThan(0);
    // 已轉化列鎖定：不再提供操作選單（轉換／編輯／刪除入口皆隱藏）
    expect(within(row).queryByRole('button', { name: '更多操作' })).not.toBeInTheDocument();
    expect(within(row).queryByRole('button', { name: '轉換' })).not.toBeInTheDocument();
  });
});

describe('Leads 狀態篩選', () => {
  it('選定「待轉換」只顯示該狀態的列', async () => {
    const user = userEvent.setup();
    renderLeads();

    await user.selectOptions(screen.getByRole('combobox', { name: '依狀態篩選' }), 'toconvert');

    expect(screen.getByText('林志明')).toBeInTheDocument(); // toconvert
    expect(screen.queryByText('黃柏翰')).not.toBeInTheDocument(); // contacted
  });
});

describe('Leads 抽屜狀態下拉', () => {
  it('不含「已轉化」選項', async () => {
    const user = userEvent.setup();
    renderLeads();
    await openCreateDrawer(user);

    const statusSelect = screen.getByLabelText('狀態');
    expect(within(statusSelect).getByRole('option', { name: '待轉換' })).toBeInTheDocument();
    expect(within(statusSelect).queryByRole('option', { name: '已轉化' })).not.toBeInTheDocument();
  });
});
