/**
 * Définitions temporaires pour React DOM avec React 19
 */

declare module 'react-dom/client' {
  export function createRoot(container: Element | DocumentFragment): {
    render(element: React.ReactNode): void;
    unmount(): void;
  };

  export function hydrateRoot(
    container: Element | DocumentFragment,
    element: React.ReactNode
  ): {
    render(element: React.ReactNode): void;
    unmount(): void;
  };
}

declare module 'react-dom' {
  function createPortal(
    children: React.ReactNode,
    container: Element | DocumentFragment,
    key?: null | string
  ): React.ReactPortal;

  function flushSync<R>(fn: () => R): R;
}
