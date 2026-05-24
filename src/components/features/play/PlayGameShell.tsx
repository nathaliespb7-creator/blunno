'use client';

import type { ReactElement, ReactNode } from 'react';

type PlayGameShellProps = {
  testId: string;
  scoreLabel: ReactNode;
  scoreTestId?: string;
  fieldTestId?: string;
  status: string;
  showRestart?: boolean;
  onRestart?: () => void;
  children: ReactNode;
};

export function PlayGameShell({
  testId,
  scoreLabel,
  scoreTestId,
  fieldTestId,
  status,
  showRestart = false,
  onRestart,
  children,
}: PlayGameShellProps): ReactElement {
  return (
    <div className="play-game-shell" data-testid={testId}>
      <div className="play-game-shell__score" data-testid={scoreTestId}>
        {scoreLabel}
      </div>
      <div className="play-game-shell__field" data-testid={fieldTestId}>
        {children}
      </div>
      <p className="play-game-shell__status">{status}</p>
      {showRestart && onRestart && (
        <div className="play-game-shell__actions">
          <button type="button" onClick={onRestart} className="play-game-restart-btn blunno-focus-visible">
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
