import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type ResizableSidebarLayoutProps = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  storageKey?: string;
  isSidebarOpen: boolean;
  className?: string;
  mainClassName?: string;
  sidebarClassName?: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const ResizableSidebarLayout: React.FC<ResizableSidebarLayoutProps> = ({
  children,
  sidebar,
  sidebarPosition = 'right',
  initialWidth = 320,
  minWidth = 260,
  maxWidth = 480,
  storageKey,
  isSidebarOpen,
  className,
  mainClassName,
  sidebarClassName,
}) => {
  const pointerActiveRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(initialWidth);

  const storedWidth = useMemo(() => {
    if (typeof window === 'undefined' || !storageKey) return undefined;
    const storedValue = Number(window.localStorage.getItem(storageKey));
    if (!Number.isFinite(storedValue)) return undefined;
    return clamp(storedValue, minWidth, maxWidth);
  }, [storageKey, minWidth, maxWidth]);

  const [sidebarWidth, setSidebarWidth] = useState(
    () => storedWidth ?? clamp(initialWidth, minWidth, maxWidth)
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !storageKey) return;
    window.localStorage.setItem(storageKey, String(sidebarWidth));
  }, [sidebarWidth, storageKey]);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!pointerActiveRef.current) return;
      const delta = event.clientX - startXRef.current;
      const direction = sidebarPosition === 'right' ? -1 : 1;
      const nextWidth = clamp(startWidthRef.current + direction * delta, minWidth, maxWidth);
      setSidebarWidth(nextWidth);
    },
    [sidebarPosition, minWidth, maxWidth]
  );

  const stopDragging = useCallback(() => {
    if (!pointerActiveRef.current) return;
    pointerActiveRef.current = false;
    document.body.style.removeProperty('user-select');
    document.body.style.removeProperty('cursor');
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', stopDragging);
    window.removeEventListener('pointercancel', stopDragging);
  }, [handlePointerMove]);

  const startDragging = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isSidebarOpen) return;
      pointerActiveRef.current = true;
      event.preventDefault();
      startXRef.current = event.clientX;
      startWidthRef.current = sidebarWidth;
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', stopDragging);
      window.addEventListener('pointercancel', stopDragging);
    },
    [handlePointerMove, stopDragging, isSidebarOpen, sidebarWidth]
  );

  useEffect(() => () => stopDragging(), [stopDragging]);

  useEffect(() => {
    if (!isSidebarOpen) {
      stopDragging();
    }
  }, [isSidebarOpen, stopDragging]);

  const handleDoubleClick = useCallback(() => {
    setSidebarWidth(clamp(initialWidth, minWidth, maxWidth));
  }, [initialWidth, minWidth, maxWidth]);

  const layoutDirectionClass = sidebarPosition === 'right' ? 'flex-row' : 'flex-row-reverse';
  const handlePositionClass = sidebarPosition === 'right' ? 'left-0 -ml-1.5' : 'right-0 -mr-1.5';
  const sidebarBorderClass = sidebarPosition === 'right' ? 'border-l' : 'border-r';

  return (
    <div className={`flex ${layoutDirectionClass} ${className ?? ''}`}>
      {isSidebarOpen && (
        <aside
          className={`relative flex-shrink-0 h-full ${sidebarBorderClass} border-slate-700/60 bg-slate-900/70 backdrop-blur ${
            sidebarClassName ?? ''
          }`}
          style={{ width: sidebarWidth }}
        >
          <div
            className="absolute inset-y-0 w-3 cursor-col-resize group"
            style={sidebarPosition === 'right' ? { left: 0 } : { right: 0 }}
          >
            <div
              className={`absolute top-0 bottom-0 ${handlePositionClass} w-1 rounded-full bg-slate-700/60 group-hover:bg-blue-500/80 transition-colors`}
              onPointerDown={startDragging}
              onDoubleClick={handleDoubleClick}
              role="separator"
              aria-orientation="vertical"
              aria-hidden="true"
            />
          </div>
          <div className="h-full overflow-hidden">{sidebar}</div>
        </aside>
      )}
      <section className={`flex-1 min-w-0 ${mainClassName ?? ''}`}>{children}</section>
    </div>
  );
};
