import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchPill from './SearchPill';

describe('SearchPill', () => {
  it('以 searchbox 角色加上 label 名稱可查詢', () => {
    render(<SearchPill value="" onChange={() => {}} label="搜尋帳號" />);
    expect(screen.getByRole('searchbox', { name: '搜尋帳號' })).toBeInTheDocument();
  });

  it('輸入時以新值觸發 onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchPill value="" onChange={onChange} label="搜尋帳號" />);
    await user.type(screen.getByRole('searchbox', { name: '搜尋帳號' }), 'a');
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('顯示 placeholder', () => {
    render(
      <SearchPill value="" onChange={() => {}} label="搜尋帳號" placeholder="搜尋名稱或網域" />,
    );
    expect(screen.getByPlaceholderText('搜尋名稱或網域')).toBeInTheDocument();
  });
});
