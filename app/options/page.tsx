'use client';

import React, { useMemo, useState } from 'react';
import { useOptionsData } from '@/components/options-data';
import { OptionDirection, OptionMarket } from '@/lib/types';

const DIRECTIONS: { label: string; value: OptionDirection; description: string }[] = [
  { label: '低买 (Put)', value: 'low-buy', description: '寻求低位买入机会，关注PUT行权价' },
  { label: '高卖 (Call)', value: 'high-sell', description: '在高位挂单卖出，关注CALL行权价' }
];

function formatDate(value: string) {
  const date = new Date(value);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

function formatNumber(value: number, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : '-';
}

function groupByAsset(markets: OptionMarket[]) {
  return markets.reduce<Record<string, OptionMarket[]>>((acc, market) => {
    const key = market.asset;
    acc[key] = acc[key] ? [...acc[key], market] : [market];
    return acc;
  }, {});
}

export default function OptionsPage() {
  const [direction, setDirection] = useState<OptionDirection>('low-buy');
  const { markets, loading, error, updatedAt } = useOptionsData(direction);

  const grouped = useMemo(() => groupByAsset(markets), [markets]);

  return (
    <div>
      <div className="tabs">
        {DIRECTIONS.map((tab) => (
          <button
            key={tab.value}
            className={`tab-button ${direction === tab.value ? 'active' : ''}`}
            onClick={() => setDirection(tab.value)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <p className="status-line">{DIRECTIONS.find((t) => t.value === direction)?.description}</p>
      {updatedAt && <p className="status-line">数据刷新时间：{new Date(updatedAt).toLocaleString()}</p>}
      {loading && <p className="loader">加载中...</p>}
      {error && <p className="error">{error}</p>}

      {Object.entries(grouped).map(([asset, list]) => (
        <section key={asset} className="section-card">
          <h3>
            {asset} <span className="tag">{list.length} 条</span>
          </h3>
          <table className="market-grid">
            <thead>
              <tr>
                <th>方向</th>
                <th>行权价</th>
                <th>到期日</th>
                <th>剩余天数</th>
                <th>APR</th>
              </tr>
            </thead>
            <tbody>
              {list.map((market) => (
                <tr key={`${market.asset}-${market.targetPrice}-${market.settlementDate}`}>
                  <td>{market.direction === 'low-buy' ? '低买' : '高卖'}</td>
                  <td>{formatNumber(market.targetPrice, 0)}</td>
                  <td>{formatDate(market.settlementDate)}</td>
                  <td>{market.daysToSettlement}</td>
                  <td>{formatNumber(market.apr)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      {!loading && markets.length === 0 && <p className="status-line">暂无符合筛选的数据</p>}
    </div>
  );
}
