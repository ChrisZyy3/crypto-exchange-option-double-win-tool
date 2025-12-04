import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h2>Welcome</h2>
      <p>Use the options monitor to screen BTC/ETH chains.</p>
      <Link className="tab-button active" href="/options">
        Go to Options Dashboard
      </Link>
    </div>
  );
}
