// Fichier temporaire pour fournir des types pour React 19
declare module 'react' {
  export * from 'react/next';
  
  // Définitions minimales pour React
  export type FC<P = {}> = FunctionComponent<P>;
  export interface FunctionComponent<P = {}> {
    (props: P, context?: any): React.ReactElement<any, any> | null;
  }

  // Fonctions React principales
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useState<T = undefined>(): [T | undefined, (newState: T | ((prevState: T | undefined) => T)) => void];
  
  export function useEffect(effect: () => void | (() => void | undefined), deps?: ReadonlyArray<any>): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>): T;
  export function useMemo<T>(factory: () => T, deps: ReadonlyArray<any> | undefined): T;
  export function useRef<T>(initialValue: T): { current: T };
  
  // Types communs
  export type PropsWithChildren<P = unknown> = P & { children?: React.ReactNode | undefined };
  export type ReactNode = 
    | React.ReactElement
    | string
    | number
    | Iterable<React.ReactNode>
    | boolean
    | null
    | undefined;
  
  export interface ReactElement<P = any, T extends string | React.JSXElementConstructor<any> = string | React.JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: React.Key | null;
  }
  
  export type JSXElementConstructor<P> = ((props: P) => React.ReactElement<any, any> | null);
  export type Key = string | number;

  export interface ChangeEvent<T = Element> {
    target: EventTarget & T;
  }
  
  export interface EventTarget {
    value?: string;
  }
  
  // Définitions JSX
  export namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    
    interface Element extends React.ReactElement<any, any> {}
    
    interface ElementAttributesProperty {
      props: {};
    }
    
    interface ElementChildrenAttribute {
      children: {};
    }
  }

  // Types pour les composants UI
  export interface HTMLAttributes<T> {
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: (event: React.MouseEvent<T>) => void;
    onChange?: (event: React.ChangeEvent<T>) => void;
    onInput?: (event: React.FormEvent<T>) => void;
    onSubmit?: (event: React.FormEvent<T>) => void;
    [key: string]: any;
  }
  
  export interface CSSProperties {
    [key: string]: string | number | undefined;
  }
  
  export interface FormEvent<T = Element> extends React.SyntheticEvent<T> {
    target: EventTarget & T;
  }
  
  export interface MouseEvent<T = Element> extends React.SyntheticEvent<T> {
    target: EventTarget & T;
  }
  
  export interface SyntheticEvent<T = Element> {
    preventDefault(): void;
    stopPropagation(): void;
    target: EventTarget & T;
    currentTarget: EventTarget & T;
    type: string;
  }
}
