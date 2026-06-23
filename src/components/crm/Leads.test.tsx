import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
