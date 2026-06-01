import type { ReactElement } from 'react';

export function LandingFooter(): ReactElement {
  const year = new Date().getFullYear();

  return (
    <footer className="landing-footer">
      <p className="landing-footer-copy">© {year} Blunno</p>
      <p className="landing-footer-tagline">Built for students dealing with study stress</p>
      <a href="mailto:hello@blunno.app" className="landing-footer-link">
        Send feedback
      </a>
    </footer>
  );
}
