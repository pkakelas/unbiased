import Link from "next/link";

export function Masthead() {
  return (
    <header className="mast">
      <div className="brand">
        <Link href="/" className="wordmark">
          unbiased
        </Link>
        <span className="meta">Από τα πρακτικά των δημοτικών συμβουλίων</span>
      </div>
    </header>
  );
}

export function Footer({ note }: { note: string }) {
  return (
    <footer className="foot">
      <span>unbiased · {note}</span>
      <span>Διόρθωση; corrections@[domain]</span>
    </footer>
  );
}
