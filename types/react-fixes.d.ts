// Types de compatibilité pour React 19
// Ce fichier fournit les définitions de types manquantes pour React 19

declare module "react" {
  import * as CSS from "csstype";

  // Types de base
  type ReactText = string | number;
  type ReactChild = ReactElement | ReactText;

  interface ReactNodeArray extends Array<ReactNode> {}
  type ReactFragment = {} | ReactNodeArray;
  type ReactNode =
    | ReactChild
    | ReactFragment
    | ReactPortal
    | boolean
    | null
    | undefined;

  type Key = string | number;

  // Props de base
  interface Attributes {
    key?: Key | null | undefined;
  }

  interface RefAttributes<T> extends Attributes {
    ref?: Ref<T> | undefined;
  }

  interface ClassAttributes<T> extends Attributes {
    ref?: LegacyRef<T> | undefined;
  }

  // Types de référence
  type Ref<T> = RefCallback<T> | RefObject<T> | null;
  type LegacyRef<T> = string | Ref<T>;
  type RefCallback<T> = {
    bivarianceHack(instance: T | null): void;
  }["bivarianceHack"];

  interface RefObject<T> {
    readonly current: T | null;
  }

  // Props HTML
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    accessKey?: string | undefined;
    className?: string | undefined;
    contentEditable?: Booleanish | "inherit" | undefined;
    contextMenu?: string | undefined;
    dir?: string | undefined;
    draggable?: Booleanish | undefined;
    hidden?: boolean | undefined;
    id?: string | undefined;
    lang?: string | undefined;
    placeholder?: string | undefined;
    slot?: string | undefined;
    spellCheck?: Booleanish | undefined;
    style?: CSSProperties | undefined;
    tabIndex?: number | undefined;
    title?: string | undefined;
    translate?: "yes" | "no" | undefined;
    radioGroup?: string | undefined;
    role?: AriaRole | undefined;
    about?: string | undefined;
    datatype?: string | undefined;
    inlist?: any;
    prefix?: string | undefined;
    property?: string | undefined;
    resource?: string | undefined;
    typeof?: string | undefined;
    vocab?: string | undefined;
    autoCapitalize?: string | undefined;
    autoCorrect?: string | undefined;
    autoSave?: string | undefined;
    color?: string | undefined;
    itemProp?: string | undefined;
    itemRef?: string | undefined;
    itemScope?: boolean | undefined;
    itemType?: string | undefined;
    itemID?: string | undefined;
    security?: string | undefined;
    unselectable?: "on" | "off" | undefined;
    inputMode?:
      | "none"
      | "text"
      | "tel"
      | "url"
      | "email"
      | "numeric"
      | "decimal"
      | "search"
      | undefined;
    is?: string | undefined;
  }

  // Props ARIA
  interface AriaAttributes {
    "aria-activedescendant"?: string | undefined;
    "aria-atomic"?: Booleanish | undefined;
    "aria-autocomplete"?: "none" | "inline" | "list" | "both" | undefined;
    "aria-busy"?: Booleanish | undefined;
    "aria-checked"?: boolean | "false" | "mixed" | "true" | undefined;
    "aria-colcount"?: number | undefined;
    "aria-colindex"?: number | undefined;
    "aria-colspan"?: number | undefined;
    "aria-controls"?: string | undefined;
    "aria-current"?:
      | boolean
      | "false"
      | "true"
      | "page"
      | "step"
      | "location"
      | "date"
      | "time"
      | undefined;
    "aria-describedby"?: string | undefined;
    "aria-details"?: string | undefined;
    "aria-disabled"?: Booleanish | undefined;
    "aria-dropeffect"?:
      | "none"
      | "copy"
      | "execute"
      | "link"
      | "move"
      | "popup"
      | undefined;
    "aria-errormessage"?: string | undefined;
    "aria-expanded"?: Booleanish | undefined;
    "aria-flowto"?: string | undefined;
    "aria-grabbed"?: Booleanish | undefined;
    "aria-haspopup"?:
      | boolean
      | "false"
      | "true"
      | "menu"
      | "listbox"
      | "tree"
      | "grid"
      | "dialog"
      | undefined;
    "aria-hidden"?: Booleanish | undefined;
    "aria-invalid"?:
      | boolean
      | "false"
      | "true"
      | "grammar"
      | "spelling"
      | undefined;
    "aria-keyshortcuts"?: string | undefined;
    "aria-label"?: string | undefined;
    "aria-labelledby"?: string | undefined;
    "aria-level"?: number | undefined;
    "aria-live"?: "off" | "assertive" | "polite" | undefined;
    "aria-modal"?: Booleanish | undefined;
    "aria-multiline"?: Booleanish | undefined;
    "aria-multiselectable"?: Booleanish | undefined;
    "aria-orientation"?: "horizontal" | "vertical" | undefined;
    "aria-owns"?: string | undefined;
    "aria-placeholder"?: string | undefined;
    "aria-posinset"?: number | undefined;
    "aria-pressed"?: boolean | "false" | "mixed" | "true" | undefined;
    "aria-readonly"?: Booleanish | undefined;
    "aria-relevant"?:
      | "additions"
      | "additions removals"
      | "additions text"
      | "all"
      | "removals"
      | "removals additions"
      | "removals text"
      | "text"
      | "text additions"
      | "text removals"
      | undefined;
    "aria-required"?: Booleanish | undefined;
    "aria-roledescription"?: string | undefined;
    "aria-rowcount"?: number | undefined;
    "aria-rowindex"?: number | undefined;
    "aria-rowspan"?: number | undefined;
    "aria-selected"?: Booleanish | undefined;
    "aria-setsize"?: number | undefined;
    "aria-sort"?: "none" | "ascending" | "descending" | "other" | undefined;
    "aria-valuemax"?: number | undefined;
    "aria-valuemin"?: number | undefined;
    "aria-valuenow"?: number | undefined;
    "aria-valuetext"?: string | undefined;
  }

  type AriaRole =
    | "alert"
    | "alertdialog"
    | "application"
    | "article"
    | "banner"
    | "button"
    | "cell"
    | "checkbox"
    | "columnheader"
    | "combobox"
    | "complementary"
    | "contentinfo"
    | "definition"
    | "dialog"
    | "directory"
    | "document"
    | "feed"
    | "figure"
    | "form"
    | "grid"
    | "gridcell"
    | "group"
    | "heading"
    | "img"
    | "link"
    | "list"
    | "listbox"
    | "listitem"
    | "log"
    | "main"
    | "marquee"
    | "math"
    | "menu"
    | "menubar"
    | "menuitem"
    | "menuitemcheckbox"
    | "menuitemradio"
    | "navigation"
    | "none"
    | "note"
    | "option"
    | "presentation"
    | "progressbar"
    | "radio"
    | "radiogroup"
    | "region"
    | "row"
    | "rowgroup"
    | "rowheader"
    | "scrollbar"
    | "search"
    | "searchbox"
    | "separator"
    | "slider"
    | "spinbutton"
    | "status"
    | "switch"
    | "tab"
    | "table"
    | "tablist"
    | "tabpanel"
    | "term"
    | "textbox"
    | "timer"
    | "toolbar"
    | "tooltip"
    | "tree"
    | "treegrid"
    | "treeitem"
    | (string & {});

  // Types de DOM
  interface DOMAttributes<T> {
    children?: ReactNode | undefined;
    dangerouslySetInnerHTML?:
      | {
          __html: string;
        }
      | undefined;

    // Clipboard Events
    onCopy?: ClipboardEventHandler<T> | undefined;
    onCopyCapture?: ClipboardEventHandler<T> | undefined;
    onCut?: ClipboardEventHandler<T> | undefined;
    onCutCapture?: ClipboardEventHandler<T> | undefined;
    onPaste?: ClipboardEventHandler<T> | undefined;
    onPasteCapture?: ClipboardEventHandler<T> | undefined;

    // Composition Events
    onCompositionEnd?: CompositionEventHandler<T> | undefined;
    onCompositionEndCapture?: CompositionEventHandler<T> | undefined;
    onCompositionStart?: CompositionEventHandler<T> | undefined;
    onCompositionStartCapture?: CompositionEventHandler<T> | undefined;
    onCompositionUpdate?: CompositionEventHandler<T> | undefined;
    onCompositionUpdateCapture?: CompositionEventHandler<T> | undefined;

    // Focus Events
    onFocus?: FocusEventHandler<T> | undefined;
    onFocusCapture?: FocusEventHandler<T> | undefined;
    onBlur?: FocusEventHandler<T> | undefined;
    onBlurCapture?: FocusEventHandler<T> | undefined;

    // Form Events
    onChange?: FormEventHandler<T> | undefined;
    onChangeCapture?: FormEventHandler<T> | undefined;
    onBeforeInput?: FormEventHandler<T> | undefined;
    onBeforeInputCapture?: FormEventHandler<T> | undefined;
    onInput?: FormEventHandler<T> | undefined;
    onInputCapture?: FormEventHandler<T> | undefined;
    onReset?: FormEventHandler<T> | undefined;
    onResetCapture?: FormEventHandler<T> | undefined;
    onSubmit?: FormEventHandler<T> | undefined;
    onSubmitCapture?: FormEventHandler<T> | undefined;
    onInvalid?: FormEventHandler<T> | undefined;
    onInvalidCapture?: FormEventHandler<T> | undefined;

    // Image Events
    onLoad?: ReactEventHandler<T> | undefined;
    onLoadCapture?: ReactEventHandler<T> | undefined;
    onError?: ReactEventHandler<T> | undefined;
    onErrorCapture?: ReactEventHandler<T> | undefined;

    // Keyboard Events
    onKeyDown?: KeyboardEventHandler<T> | undefined;
    onKeyDownCapture?: KeyboardEventHandler<T> | undefined;
    onKeyPress?: KeyboardEventHandler<T> | undefined;
    onKeyPressCapture?: KeyboardEventHandler<T> | undefined;
    onKeyUp?: KeyboardEventHandler<T> | undefined;
    onKeyUpCapture?: KeyboardEventHandler<T> | undefined;

    // Media Events
    onAbort?: ReactEventHandler<T> | undefined;
    onAbortCapture?: ReactEventHandler<T> | undefined;
    onCanPlay?: ReactEventHandler<T> | undefined;
    onCanPlayCapture?: ReactEventHandler<T> | undefined;
    onCanPlayThrough?: ReactEventHandler<T> | undefined;
    onCanPlayThroughCapture?: ReactEventHandler<T> | undefined;
    onDurationChange?: ReactEventHandler<T> | undefined;
    onDurationChangeCapture?: ReactEventHandler<T> | undefined;
    onEmptied?: ReactEventHandler<T> | undefined;
    onEmptiedCapture?: ReactEventHandler<T> | undefined;
    onEncrypted?: ReactEventHandler<T> | undefined;
    onEncryptedCapture?: ReactEventHandler<T> | undefined;
    onEnded?: ReactEventHandler<T> | undefined;
    onEndedCapture?: ReactEventHandler<T> | undefined;
    onLoadedData?: ReactEventHandler<T> | undefined;
    onLoadedDataCapture?: ReactEventHandler<T> | undefined;
    onLoadedMetadata?: ReactEventHandler<T> | undefined;
    onLoadedMetadataCapture?: ReactEventHandler<T> | undefined;
    onLoadStart?: ReactEventHandler<T> | undefined;
    onLoadStartCapture?: ReactEventHandler<T> | undefined;
    onPause?: ReactEventHandler<T> | undefined;
    onPauseCapture?: ReactEventHandler<T> | undefined;
    onPlay?: ReactEventHandler<T> | undefined;
    onPlayCapture?: ReactEventHandler<T> | undefined;
    onPlaying?: ReactEventHandler<T> | undefined;
    onPlayingCapture?: ReactEventHandler<T> | undefined;
    onProgress?: ReactEventHandler<T> | undefined;
    onProgressCapture?: ReactEventHandler<T> | undefined;
    onRateChange?: ReactEventHandler<T> | undefined;
    onRateChangeCapture?: ReactEventHandler<T> | undefined;
    onSeeked?: ReactEventHandler<T> | undefined;
    onSeekedCapture?: ReactEventHandler<T> | undefined;
    onSeeking?: ReactEventHandler<T> | undefined;
    onSeekingCapture?: ReactEventHandler<T> | undefined;
    onStalled?: ReactEventHandler<T> | undefined;
    onStalledCapture?: ReactEventHandler<T> | undefined;
    onSuspend?: ReactEventHandler<T> | undefined;
    onSuspendCapture?: ReactEventHandler<T> | undefined;
    onTimeUpdate?: ReactEventHandler<T> | undefined;
    onTimeUpdateCapture?: ReactEventHandler<T> | undefined;
    onVolumeChange?: ReactEventHandler<T> | undefined;
    onVolumeChangeCapture?: ReactEventHandler<T> | undefined;
    onWaiting?: ReactEventHandler<T> | undefined;
    onWaitingCapture?: ReactEventHandler<T> | undefined;

    // MouseEvents
    onAuxClick?: MouseEventHandler<T> | undefined;
    onAuxClickCapture?: MouseEventHandler<T> | undefined;
    onClick?: MouseEventHandler<T> | undefined;
    onClickCapture?: MouseEventHandler<T> | undefined;
    onContextMenu?: MouseEventHandler<T> | undefined;
    onContextMenuCapture?: MouseEventHandler<T> | undefined;
    onDoubleClick?: MouseEventHandler<T> | undefined;
    onDoubleClickCapture?: MouseEventHandler<T> | undefined;
    onDrag?: DragEventHandler<T> | undefined;
    onDragCapture?: DragEventHandler<T> | undefined;
    onDragEnd?: DragEventHandler<T> | undefined;
    onDragEndCapture?: DragEventHandler<T> | undefined;
    onDragEnter?: DragEventHandler<T> | undefined;
    onDragEnterCapture?: DragEventHandler<T> | undefined;
    onDragExit?: DragEventHandler<T> | undefined;
    onDragExitCapture?: DragEventHandler<T> | undefined;
    onDragLeave?: DragEventHandler<T> | undefined;
    onDragLeaveCapture?: DragEventHandler<T> | undefined;
    onDragOver?: DragEventHandler<T> | undefined;
    onDragOverCapture?: DragEventHandler<T> | undefined;
    onDragStart?: DragEventHandler<T> | undefined;
    onDragStartCapture?: DragEventHandler<T> | undefined;
    onDrop?: DragEventHandler<T> | undefined;
    onDropCapture?: DragEventHandler<T> | undefined;
    onMouseDown?: MouseEventHandler<T> | undefined;
    onMouseDownCapture?: MouseEventHandler<T> | undefined;
    onMouseEnter?: MouseEventHandler<T> | undefined;
    onMouseLeave?: MouseEventHandler<T> | undefined;
    onMouseMove?: MouseEventHandler<T> | undefined;
    onMouseMoveCapture?: MouseEventHandler<T> | undefined;
    onMouseOut?: MouseEventHandler<T> | undefined;
    onMouseOutCapture?: MouseEventHandler<T> | undefined;
    onMouseOver?: MouseEventHandler<T> | undefined;
    onMouseOverCapture?: MouseEventHandler<T> | undefined;
    onMouseUp?: MouseEventHandler<T> | undefined;
    onMouseUpCapture?: MouseEventHandler<T> | undefined;

    // Selection Events
    onSelect?: ReactEventHandler<T> | undefined;
    onSelectCapture?: ReactEventHandler<T> | undefined;

    // Touch Events
    onTouchCancel?: TouchEventHandler<T> | undefined;
    onTouchCancelCapture?: TouchEventHandler<T> | undefined;
    onTouchEnd?: TouchEventHandler<T> | undefined;
    onTouchEndCapture?: TouchEventHandler<T> | undefined;
    onTouchMove?: TouchEventHandler<T> | undefined;
    onTouchMoveCapture?: TouchEventHandler<T> | undefined;
    onTouchStart?: TouchEventHandler<T> | undefined;
    onTouchStartCapture?: TouchEventHandler<T> | undefined;

    // Pointer Events
    onPointerDown?: PointerEventHandler<T> | undefined;
    onPointerDownCapture?: PointerEventHandler<T> | undefined;
    onPointerMove?: PointerEventHandler<T> | undefined;
    onPointerMoveCapture?: PointerEventHandler<T> | undefined;
    onPointerUp?: PointerEventHandler<T> | undefined;
    onPointerUpCapture?: PointerEventHandler<T> | undefined;
    onPointerCancel?: PointerEventHandler<T> | undefined;
    onPointerCancelCapture?: PointerEventHandler<T> | undefined;
    onPointerEnter?: PointerEventHandler<T> | undefined;
    onPointerEnterCapture?: PointerEventHandler<T> | undefined;
    onPointerLeave?: PointerEventHandler<T> | undefined;
    onPointerLeaveCapture?: PointerEventHandler<T> | undefined;
    onPointerOver?: PointerEventHandler<T> | undefined;
    onPointerOverCapture?: PointerEventHandler<T> | undefined;
    onPointerOut?: PointerEventHandler<T> | undefined;
    onPointerOutCapture?: PointerEventHandler<T> | undefined;
    onGotPointerCapture?: PointerEventHandler<T> | undefined;
    onGotPointerCaptureCapture?: PointerEventHandler<T> | undefined;
    onLostPointerCapture?: PointerEventHandler<T> | undefined;
    onLostPointerCaptureCapture?: PointerEventHandler<T> | undefined;

    // UI Events
    onScroll?: UIEventHandler<T> | undefined;
    onScrollCapture?: UIEventHandler<T> | undefined;

    // Wheel Events
    onWheel?: WheelEventHandler<T> | undefined;
    onWheelCapture?: WheelEventHandler<T> | undefined;

    // Animation Events
    onAnimationStart?: AnimationEventHandler<T> | undefined;
    onAnimationStartCapture?: AnimationEventHandler<T> | undefined;
    onAnimationEnd?: AnimationEventHandler<T> | undefined;
    onAnimationEndCapture?: AnimationEventHandler<T> | undefined;
    onAnimationIteration?: AnimationEventHandler<T> | undefined;
    onAnimationIterationCapture?: AnimationEventHandler<T> | undefined;

    // Transition Events
    onTransitionEnd?: TransitionEventHandler<T> | undefined;
    onTransitionEndCapture?: TransitionEventHandler<T> | undefined;
  }

  type CSSProperties = CSS.Properties<string | number>;

  type Booleanish = boolean | "true" | "false";

  // Event handlers
  type EventHandler<E extends SyntheticEvent<any>> = {
    bivarianceHack(event: E): void;
  }["bivarianceHack"];

  type ReactEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
  type ClipboardEventHandler<T = Element> = EventHandler<ClipboardEvent<T>>;
  type CompositionEventHandler<T = Element> = EventHandler<CompositionEvent<T>>;
  type DragEventHandler<T = Element> = EventHandler<DragEvent<T>>;
  type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>;
  type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
  type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;
  type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>;
  type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;
  type TouchEventHandler<T = Element> = EventHandler<TouchEvent<T>>;
  type PointerEventHandler<T = Element> = EventHandler<PointerEvent<T>>;
  type UIEventHandler<T = Element> = EventHandler<UIEvent<T>>;
  type WheelEventHandler<T = Element> = EventHandler<WheelEvent<T>>;
  type AnimationEventHandler<T = Element> = EventHandler<AnimationEvent<T>>;
  type TransitionEventHandler<T = Element> = EventHandler<TransitionEvent<T>>;

  // Event types
  interface BaseSyntheticEvent<E = object, C = any, T = any> {
    nativeEvent: E;
    currentTarget: C;
    target: T;
    bubbles: boolean;
    cancelable: boolean;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    preventDefault(): void;
    isDefaultPrevented(): boolean;
    stopPropagation(): void;
    isPropagationStopped(): boolean;
    persist(): void;
    timeStamp: number;
    type: string;
  }

  interface SyntheticEvent<T = Element, E = Event>
    extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}

  interface ClipboardEvent<T = Element>
    extends SyntheticEvent<T, NativeClipboardEvent> {
    clipboardData: DataTransfer;
  }

  interface CompositionEvent<T = Element>
    extends SyntheticEvent<T, NativeCompositionEvent> {
    data: string;
  }

  interface DragEvent<T = Element> extends MouseEvent<T, NativeDragEvent> {
    dataTransfer: DataTransfer;
  }

  interface PointerEvent<T = Element>
    extends MouseEvent<T, NativePointerEvent> {
    pointerId: number;
    pressure: number;
    tangentialPressure: number;
    tiltX: number;
    tiltY: number;
    twist: number;
    width: number;
    height: number;
    pointerType: "mouse" | "pen" | "touch";
    isPrimary: boolean;
  }

  interface FocusEvent<Target = Element, RelatedTarget = Element>
    extends SyntheticEvent<Target, NativeFocusEvent> {
    relatedTarget: (EventTarget & RelatedTarget) | null;
    target: EventTarget & Target;
  }

  interface FormEvent<T = Element> extends SyntheticEvent<T> {}

  interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }

  interface KeyboardEvent<T = Element> extends UIEvent<T, NativeKeyboardEvent> {
    altKey: boolean;
    charCode: number;
    ctrlKey: boolean;
    code: string;
    getModifierState(key: string): boolean;
    key: string;
    keyCode: number;
    locale: string;
    location: number;
    metaKey: boolean;
    repeat: boolean;
    shiftKey: boolean;
    which: number;
  }

  interface MouseEvent<T = Element, E = NativeMouseEvent>
    extends UIEvent<T, E> {
    altKey: boolean;
    button: number;
    buttons: number;
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    getModifierState(key: string): boolean;
    metaKey: boolean;
    movementX: number;
    movementY: number;
    pageX: number;
    pageY: number;
    relatedTarget: EventTarget | null;
    screenX: number;
    screenY: number;
    shiftKey: boolean;
  }

  interface TouchEvent<T = Element> extends UIEvent<T, NativeTouchEvent> {
    altKey: boolean;
    changedTouches: TouchList;
    ctrlKey: boolean;
    getModifierState(key: string): boolean;
    metaKey: boolean;
    shiftKey: boolean;
    targetTouches: TouchList;
    touches: TouchList;
  }

  interface UIEvent<T = Element, E = NativeUIEvent>
    extends SyntheticEvent<T, E> {
    detail: number;
    view: AbstractView;
  }

  interface WheelEvent<T = Element> extends MouseEvent<T, NativeWheelEvent> {
    deltaMode: number;
    deltaX: number;
    deltaY: number;
    deltaZ: number;
  }

  interface AnimationEvent<T = Element>
    extends SyntheticEvent<T, NativeAnimationEvent> {
    animationName: string;
    elapsedTime: number;
    pseudoElement: string;
  }

  interface TransitionEvent<T = Element>
    extends SyntheticEvent<T, NativeTransitionEvent> {
    elapsedTime: number;
    propertyName: string;
    pseudoElement: string;
  }

  // Native event types
  type NativeAnimationEvent = globalThis.AnimationEvent;
  type NativeClipboardEvent = globalThis.ClipboardEvent;
  type NativeCompositionEvent = globalThis.CompositionEvent;
  type NativeDragEvent = globalThis.DragEvent;
  type NativeFocusEvent = globalThis.FocusEvent;
  type NativeKeyboardEvent = globalThis.KeyboardEvent;
  type NativeMouseEvent = globalThis.MouseEvent;
  type NativePointerEvent = globalThis.PointerEvent;
  type NativeTouchEvent = globalThis.TouchEvent;
  type NativeTransitionEvent = globalThis.TransitionEvent;
  type NativeUIEvent = globalThis.UIEvent;
  type NativeWheelEvent = globalThis.WheelEvent;

  // Component types
  interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
    propTypes?: WeakValidationMap<P> | undefined;
    contextTypes?: ValidationMap<any> | undefined;
    defaultProps?: Partial<P> | undefined;
    displayName?: string | undefined;
  }

  interface ComponentClass<P = {}, S = ComponentState>
    extends StaticLifecycle<P, S> {
    new (props: P, context?: any): Component<P, S>;
    propTypes?: WeakValidationMap<P> | undefined;
    contextType?: Context<any> | undefined;
    contextTypes?: ValidationMap<any> | undefined;
    childContextTypes?: ValidationMap<any> | undefined;
    defaultProps?: Partial<P> | undefined;
    displayName?: string | undefined;
  }

  type FC<P = {}> = FunctionComponent<P>;

  type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

  type JSXElementConstructor<P> =
    | ((props: P) => ReactElement<any, any> | null)
    | (new (props: P) => Component<any, any>);

  interface ReactElement<
    P = any,
    T extends string | JSXElementConstructor<any> =
      | string
      | JSXElementConstructor<any>
  > {
    type: T;
    props: P;
    key: Key | null;
  }

  interface ReactComponentElement<
    T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
    P = T extends JSXElementConstructor<infer Props>
      ? Props
      : T extends keyof JSX.IntrinsicElements
      ? JSX.IntrinsicElements[T]
      : {}
  > extends ReactElement<P, Exclude<T, number>> {}

  type ReactHTML = ReactElement<HTMLAttributes<HTMLElement>, string>;

  interface ReactPortal extends ReactElement {
    key: Key | null;
    children: ReactNode;
  }

  // Component class
  interface ComponentState {}

  interface Component<P = {}, S = {}, SS = any>
    extends ComponentLifecycle<P, S, SS> {}

  class Component<P, S> {
    constructor(props: Readonly<P> | P);
    constructor(props: P, context: any);

    setState<K extends keyof S>(
      state:
        | ((
            prevState: Readonly<S>,
            props: Readonly<P>
          ) => Pick<S, K> | S | null)
        | (Pick<S, K> | S | null),
      callback?: () => void
    ): void;

    forceUpdate(callback?: () => void): void;
    render(): ReactNode;

    readonly props: Readonly<P> &
      Readonly<{ children?: ReactNode | undefined }>;
    state: Readonly<S>;
    context: any;
    refs: {
      [key: string]: ReactInstance;
    };
  }

  interface ComponentLifecycle<P, S, SS = any>
    extends NewLifecycle<P, S, SS>,
      DeprecatedLifecycle<P, S> {
    componentDidMount?(): void;
    shouldComponentUpdate?(
      nextProps: Readonly<P>,
      nextState: Readonly<S>,
      nextContext: any
    ): boolean;
    componentWillUnmount?(): void;
    componentDidCatch?(error: Error, errorInfo: ErrorInfo): void;
  }

  interface StaticLifecycle<P, S> {
    getDerivedStateFromProps?: GetDerivedStateFromProps<P, S> | undefined;
    getDerivedStateFromError?: GetDerivedStateFromError<P, S> | undefined;
  }

  type GetDerivedStateFromProps<P, S> = (
    nextProps: Readonly<P>,
    prevState: S
  ) => Partial<S> | null;

  type GetDerivedStateFromError<P, S> = (error: any) => Partial<S> | null;

  interface NewLifecycle<P, S, SS> {
    getSnapshotBeforeUpdate?(
      prevProps: Readonly<P>,
      prevState: Readonly<S>
    ): SS | null;
    componentDidUpdate?(
      prevProps: Readonly<P>,
      prevState: Readonly<S>,
      snapshot?: SS
    ): void;
  }

  interface DeprecatedLifecycle<P, S> {
    componentWillMount?(): void;
    UNSAFE_componentWillMount?(): void;
    componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
    UNSAFE_componentWillReceiveProps?(
      nextProps: Readonly<P>,
      nextContext: any
    ): void;
    componentWillUpdate?(
      nextProps: Readonly<P>,
      nextState: Readonly<S>,
      nextContext: any
    ): void;
    UNSAFE_componentWillUpdate?(
      nextProps: Readonly<P>,
      nextState: Readonly<S>,
      nextContext: any
    ): void;
  }

  interface ErrorInfo {
    componentStack: string;
  }

  // forwardRef
  interface ForwardRefRenderFunction<T, P = {}> {
    (props: P, ref: ForwardedRef<T>): ReactElement | null;
    displayName?: string | undefined;
    defaultProps?: never | undefined;
    propTypes?: never | undefined;
  }

  interface ForwardRefExoticComponent<P> extends NamedExoticComponent<P> {
    defaultProps?: never | undefined;
    propTypes?: never | undefined;
  }

  function forwardRef<T, P = {}>(
    render: ForwardRefRenderFunction<T, P>
  ): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;

  type ForwardedRef<T> =
    | ((instance: T | null) => void)
    | MutableRefObject<T | null>
    | null;

  // Props utilities
  type PropsWithChildren<P = unknown> = P & {
    children?: ReactNode | undefined;
  };

  type PropsWithoutRef<P> = P extends any
    ? "ref" extends keyof P
      ? Pick<P, Exclude<keyof P, "ref">>
      : P
    : P;

  type PropsWithRef<P> = P extends any
    ? "ref" extends keyof P
      ? P extends { ref?: infer R | undefined }
        ? string extends R
          ? PropsWithoutRef<P> & { ref?: Exclude<R, string> | undefined }
          : P
        : P
      : P
    : P;

  // Context
  interface Context<T> {
    Provider: Provider<T>;
    Consumer: Consumer<T>;
    displayName?: string | undefined;
  }

  type Provider<T> = ProviderExoticComponent<ProviderProps<T>>;

  type Consumer<T> = ExoticComponent<ConsumerProps<T>>;

  interface ProviderProps<T> {
    value: T;
    children?: ReactNode | undefined;
  }

  interface ConsumerProps<T> {
    children: (value: T) => ReactNode;
  }

  interface ProviderExoticComponent<P> extends ExoticComponent<P> {
    propTypes?: never | undefined;
  }

  type ContextType<C extends Context<any>> = C extends Context<infer T>
    ? T
    : never;

  // Exotic component types
  interface ExoticComponent<P = {}> {
    (props: P): ReactElement | null;
    readonly $$typeof: symbol;
  }

  interface NamedExoticComponent<P = {}> extends ExoticComponent<P> {
    displayName?: string | undefined;
  }

  // Hook types
  type Dispatch<A> = (value: A) => void;
  type SetStateAction<S> = S | ((prevState: S) => S);

  // Hooks
  function useState<S>(
    initialState: S | (() => S)
  ): [S, Dispatch<SetStateAction<S>>];
  function useState<S = undefined>(): [
    S | undefined,
    Dispatch<SetStateAction<S | undefined>>
  ];

  function useEffect(effect: EffectCallback, deps?: DependencyList): void;
  type EffectCallback = () => void | (() => void | undefined);
  type DependencyList = ReadonlyArray<any>;

  function useContext<T>(context: Context<T>): T;

  function useReducer<R extends Reducer<any, any>, I>(
    reducer: R,
    initializerArg: I,
    initializer: (arg: I) => ReducerState<R>
  ): [ReducerState<R>, Dispatch<ReducerAction<R>>];

  function useReducer<R extends Reducer<any, any>>(
    reducer: R,
    initialState: ReducerState<R>,
    initializer?: undefined
  ): [ReducerState<R>, Dispatch<ReducerAction<R>>];

  type Reducer<S, A> = (prevState: S, action: A) => S;
  type ReducerState<R extends Reducer<any, any>> = R extends Reducer<
    infer S,
    any
  >
    ? S
    : never;
  type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<
    any,
    infer A
  >
    ? A
    : never;

  function useCallback<T extends Function>(
    callback: T,
    deps: DependencyList
  ): T;

  function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;

  function useRef<T>(initialValue: T): MutableRefObject<T>;
  function useRef<T>(initialValue: T | null): RefObject<T>;
  function useRef<T = undefined>(): MutableRefObject<T | undefined>;

  interface MutableRefObject<T> {
    current: T;
  }

  function useImperativeHandle<T, R extends T>(
    ref: Ref<T> | undefined,
    init: () => R,
    deps?: DependencyList
  ): void;

  function useLayoutEffect(effect: EffectCallback, deps?: DependencyList): void;

  function useDebugValue<T>(value: T, format?: (value: T) => any): void;

  // Additional hooks for React 18+
  function useId(): string;

  function useDeferredValue<T>(value: T): T;

  function useTransition(): [boolean, (callback: () => void) => void];

  function useSyncExternalStore<T>(
    subscribe: (onStoreChange: () => void) => () => void,
    getSnapshot: () => T,
    getServerSnapshot?: () => T
  ): T;

  function useInsertionEffect(
    effect: EffectCallback,
    deps?: DependencyList
  ): void;

  // Validation
  interface Validator<T> {
    (
      object: T,
      key: string,
      componentName: string,
      location: string,
      propFullName: string
    ): Error | null;
  }

  interface Requireable<T> extends Validator<T> {
    isRequired: Validator<NonNullable<T>>;
  }

  type ValidationMap<T> = { [K in keyof T]?: Validator<T[K]> };

  type WeakValidationMap<T> = {
    [K in keyof T]?: null extends T[K]
      ? Validator<T[K] | null | undefined>
      : undefined extends T[K]
      ? Validator<T[K] | null | undefined>
      : Validator<T[K]>;
  };

  // React Instance
  type ReactInstance = Component<any> | Element;

  // createElement
  function createElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
    type: keyof ReactHTML,
    props?: (ClassAttributes<T> & P) | null,
    ...children: ReactNode[]
  ): DetailedReactHTMLElement<P, T>;

  function createElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
    type: string,
    props?: (ClassAttributes<T> & P) | null,
    ...children: ReactNode[]
  ): ReactElement<P>;

  function createElement<P extends SVGAttributes<T>, T extends SVGElement>(
    type: keyof ReactSVG,
    props?: (ClassAttributes<T> & P) | null,
    ...children: ReactNode[]
  ): ReactSVGElement;

  function createElement<P extends DOMAttributes<T>, T extends Element>(
    type: string,
    props?: (ClassAttributes<T> & P) | null,
    ...children: ReactNode[]
  ): DOMElement<P, T>;

  function createElement<P extends {}>(
    type: FunctionComponent<P>,
    props?: (Attributes & P) | null,
    ...children: ReactNode[]
  ): FunctionComponentElement<P>;

  function createElement<P extends {}>(
    type: ComponentClass<P>,
    props?: (ClassAttributes<ComponentClass<P>> & P) | null,
    ...children: ReactNode[]
  ): CElement<P, ComponentClass<P>>;

  function createElement<P extends {}>(
    type: FunctionComponent<P> | ComponentClass<P> | string,
    props?: (Attributes & P) | null,
    ...children: ReactNode[]
  ): ReactElement<P>;

  // Detailed element types
  interface DetailedReactHTMLElement<
    P extends HTMLAttributes<T>,
    T extends HTMLElement
  > extends ReactElement<P, string> {
    type: keyof ReactHTML;
    props: P;
    key: Key | null;
  }

  interface ReactSVGElement
    extends ReactElement<SVGAttributes<SVGElement>, string> {
    type: keyof ReactSVG;
    props: SVGAttributes<SVGElement>;
    key: Key | null;
  }

  interface DOMElement<
    P extends HTMLAttributes<T> | SVGAttributes<T>,
    T extends Element
  > extends ReactElement<P, string> {
    type: string;
    props: P;
    key: Key | null;
  }

  interface FunctionComponentElement<P>
    extends ReactElement<P, FunctionComponent<P>> {
    type: FunctionComponent<P>;
    props: P;
    key: Key | null;
  }

  interface CElement<P, T extends Component<P, ComponentState>>
    extends ReactElement<P, ComponentClass<P>> {
    type: ComponentClass<P>;
    props: P;
    key: Key | null;
  }

  // SVG types
  interface ReactSVG {
    animate: SVGProps<SVGElement>;
    circle: SVGProps<SVGCircleElement>;
    clipPath: SVGProps<SVGClipPathElement>;
    defs: SVGProps<SVGDefsElement>;
    desc: SVGProps<SVGDescElement>;
    ellipse: SVGProps<SVGEllipseElement>;
    feBlend: SVGProps<SVGFEBlendElement>;
    feColorMatrix: SVGProps<SVGFEColorMatrixElement>;
    feComponentTransfer: SVGProps<SVGFEComponentTransferElement>;
    feComposite: SVGProps<SVGFECompositeElement>;
    feConvolveMatrix: SVGProps<SVGFEConvolveMatrixElement>;
    feDiffuseLighting: SVGProps<SVGFEDiffuseLightingElement>;
    feDisplacementMap: SVGProps<SVGFEDisplacementMapElement>;
    feDistantLight: SVGProps<SVGFEDistantLightElement>;
    feDropShadow: SVGProps<SVGFEDropShadowElement>;
    feFlood: SVGProps<SVGFEFloodElement>;
    feFuncA: SVGProps<SVGFEFuncAElement>;
    feFuncB: SVGProps<SVGFEFuncBElement>;
    feFuncG: SVGProps<SVGFEFuncGElement>;
    feFuncR: SVGProps<SVGFEFuncRElement>;
    feGaussianBlur: SVGProps<SVGFEGaussianBlurElement>;
    feImage: SVGProps<SVGFEImageElement>;
    feMerge: SVGProps<SVGFEMergeElement>;
    feMergeNode: SVGProps<SVGFEMergeNodeElement>;
    feMorphology: SVGProps<SVGFEMorphologyElement>;
    feOffset: SVGProps<SVGFEOffsetElement>;
    fePointLight: SVGProps<SVGFEPointLightElement>;
    feSpecularLighting: SVGProps<SVGFESpecularLightingElement>;
    feSpotLight: SVGProps<SVGFESpotLightElement>;
    feTile: SVGProps<SVGFETileElement>;
    feTurbulence: SVGProps<SVGFETurbulenceElement>;
    filter: SVGProps<SVGFilterElement>;
    foreignObject: SVGProps<SVGForeignObjectElement>;
    g: SVGProps<SVGGElement>;
    image: SVGProps<SVGImageElement>;
    line: SVGProps<SVGLineElement>;
    linearGradient: SVGProps<SVGLinearGradientElement>;
    marker: SVGProps<SVGMarkerElement>;
    mask: SVGProps<SVGMaskElement>;
    metadata: SVGProps<SVGMetadataElement>;
    path: SVGProps<SVGPathElement>;
    pattern: SVGProps<SVGPatternElement>;
    polygon: SVGProps<SVGPolygonElement>;
    polyline: SVGProps<SVGPolylineElement>;
    radialGradient: SVGProps<SVGRadialGradientElement>;
    rect: SVGProps<SVGRectElement>;
    stop: SVGProps<SVGStopElement>;
    style: SVGProps<SVGStyleElement>;
    svg: SVGProps<SVGSVGElement>;
    switch: SVGProps<SVGSwitchElement>;
    symbol: SVGProps<SVGSymbolElement>;
    text: SVGProps<SVGTextElement>;
    textPath: SVGProps<SVGTextPathElement>;
    title: SVGProps<SVGTitleElement>;
    tspan: SVGProps<SVGTSpanElement>;
    use: SVGProps<SVGUseElement>;
    view: SVGProps<SVGViewElement>;
  }

  interface SVGProps<T> extends SVGAttributes<T>, ClassAttributes<T> {}

  interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string | undefined;
    color?: string | undefined;
    height?: number | string | undefined;
    id?: string | undefined;
    lang?: string | undefined;
    max?: number | string | undefined;
    media?: string | undefined;
    method?: string | undefined;
    min?: number | string | undefined;
    name?: string | undefined;
    style?: CSSProperties | undefined;
    target?: string | undefined;
    type?: string | undefined;
    width?: number | string | undefined;
    role?: AriaRole | undefined;
    tabIndex?: number | undefined;
    crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;

    accentHeight?: number | string | undefined;
    accumulate?: "none" | "sum" | undefined;
    additive?: "replace" | "sum" | undefined;
    alignmentBaseline?:
      | "auto"
      | "baseline"
      | "before-edge"
      | "text-before-edge"
      | "middle"
      | "central"
      | "after-edge"
      | "text-after-edge"
      | "ideographic"
      | "alphabetic"
      | "hanging"
      | "mathematical"
      | "inherit"
      | undefined;
    allowReorder?: "no" | "yes" | undefined;
    alphabetic?: number | string | undefined;
    amplitude?: number | string | undefined;
    arabicForm?: "initial" | "medial" | "terminal" | "isolated" | undefined;
    ascent?: number | string | undefined;
    attributeName?: string | undefined;
    attributeType?: string | undefined;
    autoReverse?: Booleanish | undefined;
    azimuth?: number | string | undefined;
    baseFrequency?: number | string | undefined;
    baselineShift?: number | string | undefined;
    baseProfile?: number | string | undefined;
    bbox?: number | string | undefined;
    begin?: number | string | undefined;
    bias?: number | string | undefined;
    by?: number | string | undefined;
    calcMode?: number | string | undefined;
    capHeight?: number | string | undefined;
    clip?: number | string | undefined;
    clipPath?: string | undefined;
    clipPathUnits?: number | string | undefined;
    clipRule?: number | string | undefined;
    colorInterpolation?: number | string | undefined;
    colorInterpolationFilters?:
      | "auto"
      | "sRGB"
      | "linearRGB"
      | "inherit"
      | undefined;
    colorProfile?: number | string | undefined;
    colorRendering?: number | string | undefined;
    contentScriptType?: number | string | undefined;
    contentStyleType?: number | string | undefined;
    cursor?: number | string | undefined;
    cx?: number | string | undefined;
    cy?: number | string | undefined;
    d?: string | undefined;
    decelerate?: number | string | undefined;
    descent?: number | string | undefined;
    diffuseConstant?: number | string | undefined;
    direction?: number | string | undefined;
    display?: number | string | undefined;
    divisor?: number | string | undefined;
    dominantBaseline?: number | string | undefined;
    dur?: number | string | undefined;
    dx?: number | string | undefined;
    dy?: number | string | undefined;
    edgeMode?: number | string | undefined;
    elevation?: number | string | undefined;
    enableBackground?: number | string | undefined;
    end?: number | string | undefined;
    exponent?: number | string | undefined;
    externalResourcesRequired?: Booleanish | undefined;
    fill?: string | undefined;
    fillOpacity?: number | string | undefined;
    fillRule?: "nonzero" | "evenodd" | "inherit" | undefined;
    filter?: string | undefined;
    filterRes?: number | string | undefined;
    filterUnits?: number | string | undefined;
    floodColor?: number | string | undefined;
    floodOpacity?: number | string | undefined;
    focusable?: Booleanish | "auto" | undefined;
    fontFamily?: string | undefined;
    fontSize?: number | string | undefined;
    fontSizeAdjust?: number | string | undefined;
    fontStretch?: number | string | undefined;
    fontStyle?: number | string | undefined;
    fontVariant?: number | string | undefined;
    fontWeight?: number | string | undefined;
    format?: number | string | undefined;
    from?: number | string | undefined;
    fx?: number | string | undefined;
    fy?: number | string | undefined;
    g1?: number | string | undefined;
    g2?: number | string | undefined;
    glyphName?: number | string | undefined;
    glyphOrientationHorizontal?: number | string | undefined;
    glyphOrientationVertical?: number | string | undefined;
    glyphRef?: number | string | undefined;
    gradientTransform?: string | undefined;
    gradientUnits?: string | undefined;
    hanging?: number | string | undefined;
    horizAdvX?: number | string | undefined;
    horizOriginX?: number | string | undefined;
    href?: string | undefined;
    ideographic?: number | string | undefined;
    imageRendering?: number | string | undefined;
    in2?: number | string | undefined;
    in?: string | undefined;
    intercept?: number | string | undefined;
    k1?: number | string | undefined;
    k2?: number | string | undefined;
    k3?: number | string | undefined;
    k4?: number | string | undefined;
    k?: number | string | undefined;
    kernelMatrix?: number | string | undefined;
    kernelUnitLength?: number | string | undefined;
    kerning?: number | string | undefined;
    keyPoints?: number | string | undefined;
    keySplines?: number | string | undefined;
    keyTimes?: number | string | undefined;
    lengthAdjust?: number | string | undefined;
    letterSpacing?: number | string | undefined;
    lightingColor?: number | string | undefined;
    limitingConeAngle?: number | string | undefined;
    local?: number | string | undefined;
    markerEnd?: string | undefined;
    markerHeight?: number | string | undefined;
    markerMid?: string | undefined;
    markerStart?: string | undefined;
    markerUnits?: number | string | undefined;
    markerWidth?: number | string | undefined;
    mask?: string | undefined;
    maskContentUnits?: number | string | undefined;
    maskUnits?: number | string | undefined;
    mathematical?: number | string | undefined;
    mode?: number | string | undefined;
    numOctaves?: number | string | undefined;
    offset?: number | string | undefined;
    opacity?: number | string | undefined;
    operator?: number | string | undefined;
    order?: number | string | undefined;
    orient?: number | string | undefined;
    orientation?: number | string | undefined;
    origin?: number | string | undefined;
    overflow?: number | string | undefined;
    overlinePosition?: number | string | undefined;
    overlineThickness?: number | string | undefined;
    paintOrder?: number | string | undefined;
    panose1?: number | string | undefined;
    path?: string | undefined;
    pathLength?: number | string | undefined;
    patternContentUnits?: string | undefined;
    patternTransform?: number | string | undefined;
    patternUnits?: string | undefined;
    pointerEvents?: number | string | undefined;
    points?: string | undefined;
    pointsAtX?: number | string | undefined;
    pointsAtY?: number | string | undefined;
    pointsAtZ?: number | string | undefined;
    preserveAlpha?: Booleanish | undefined;
    preserveAspectRatio?: string | undefined;
    primitiveUnits?: number | string | undefined;
    r?: number | string | undefined;
    radius?: number | string | undefined;
    refX?: number | string | undefined;
    refY?: number | string | undefined;
    renderingIntent?: number | string | undefined;
    repeatCount?: number | string | undefined;
    repeatDur?: number | string | undefined;
    requiredExtensions?: number | string | undefined;
    requiredFeatures?: number | string | undefined;
    restart?: number | string | undefined;
    result?: string | undefined;
    rotate?: number | string | undefined;
    rx?: number | string | undefined;
    ry?: number | string | undefined;
    scale?: number | string | undefined;
    seed?: number | string | undefined;
    shapeRendering?: number | string | undefined;
    slope?: number | string | undefined;
    spacing?: number | string | undefined;
    specularConstant?: number | string | undefined;
    specularExponent?: number | string | undefined;
    speed?: number | string | undefined;
    spreadMethod?: string | undefined;
    startOffset?: number | string | undefined;
    stdDeviation?: number | string | undefined;
    stemh?: number | string | undefined;
    stemv?: number | string | undefined;
    stitchTiles?: number | string | undefined;
    stopColor?: string | undefined;
    stopOpacity?: number | string | undefined;
    strikethroughPosition?: number | string | undefined;
    strikethroughThickness?: number | string | undefined;
    string?: number | string | undefined;
    stroke?: string | undefined;
    strokeDasharray?: string | number | undefined;
    strokeDashoffset?: string | number | undefined;
    strokeLinecap?: "butt" | "round" | "square" | "inherit" | undefined;
    strokeLinejoin?: "miter" | "round" | "bevel" | "inherit" | undefined;
    strokeMiterlimit?: number | string | undefined;
    strokeOpacity?: number | string | undefined;
    strokeWidth?: number | string | undefined;
    surfaceScale?: number | string | undefined;
    systemLanguage?: number | string | undefined;
    tableValues?: number | string | undefined;
    targetX?: number | string | undefined;
    targetY?: number | string | undefined;
    textAnchor?: string | undefined;
    textDecoration?: number | string | undefined;
    textLength?: number | string | undefined;
    textRendering?: number | string | undefined;
    to?: number | string | undefined;
    transform?: string | undefined;
    u1?: number | string | undefined;
    u2?: number | string | undefined;
    underlinePosition?: number | string | undefined;
    underlineThickness?: number | string | undefined;
    unicode?: number | string | undefined;
    unicodeBidi?: number | string | undefined;
    unicodeRange?: number | string | undefined;
    unitsPerEm?: number | string | undefined;
    vAlphabetic?: number | string | undefined;
    values?: string | undefined;
    vectorEffect?: number | string | undefined;
    version?: string | undefined;
    vertAdvY?: number | string | undefined;
    vertOriginX?: number | string | undefined;
    vertOriginY?: number | string | undefined;
    vHanging?: number | string | undefined;
    vIdeographic?: number | string | undefined;
    viewBox?: string | undefined;
    viewTarget?: number | string | undefined;
    visibility?: number | string | undefined;
    vMathematical?: number | string | undefined;
    widths?: number | string | undefined;
    wordSpacing?: number | string | undefined;
    writingMode?: number | string | undefined;
    x1?: number | string | undefined;
    x2?: number | string | undefined;
    x?: number | string | undefined;
    xChannelSelector?: string | undefined;
    xHeight?: number | string | undefined;
    xlinkActuate?: string | undefined;
    xlinkArcrole?: string | undefined;
    xlinkHref?: string | undefined;
    xlinkRole?: string | undefined;
    xlinkShow?: string | undefined;
    xlinkTitle?: string | undefined;
    xlinkType?: string | undefined;
    xmlBase?: string | undefined;
    xmlLang?: string | undefined;
    xmlns?: string | undefined;
    xmlnsXlink?: string | undefined;
    xmlSpace?: string | undefined;
    y1?: number | string | undefined;
    y2?: number | string | undefined;
    y?: number | string | undefined;
    yChannelSelector?: string | undefined;
    z?: number | string | undefined;
    zoomAndPan?: string | undefined;
  }

  // cloneElement
  function cloneElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
    element: DetailedReactHTMLElement<P, T>,
    props?: P,
    ...children: ReactNode[]
  ): DetailedReactHTMLElement<P, T>;

  function cloneElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
    element: ReactHTMLElement<T>,
    props?: P,
    ...children: ReactNode[]
  ): ReactHTMLElement<T>;

  function cloneElement<P extends SVGAttributes<T>, T extends SVGElement>(
    element: ReactSVGElement,
    props?: P,
    ...children: ReactNode[]
  ): ReactSVGElement;

  function cloneElement<P extends DOMAttributes<T>, T extends Element>(
    element: DOMElement<P, T>,
    props?: DOMAttributes<T> & P,
    ...children: ReactNode[]
  ): DOMElement<P, T>;

  function cloneElement<P>(
    element: FunctionComponentElement<P>,
    props?: Partial<P> & Attributes,
    ...children: ReactNode[]
  ): FunctionComponentElement<P>;

  function cloneElement<P, T extends Component<P, ComponentState>>(
    element: CElement<P, T>,
    props?: Partial<P> & ClassAttributes<T>,
    ...children: ReactNode[]
  ): CElement<P, T>;

  function cloneElement<P>(
    element: ReactElement<P>,
    props?: Partial<P> & Attributes,
    ...children: ReactNode[]
  ): ReactElement<P>;

  // createContext
  function createContext<T>(defaultValue: T): Context<T>;

  // isValidElement
  function isValidElement<P>(
    object: {} | null | undefined
  ): object is ReactElement<P>;

  // Children utilities
  interface ReactChildren {
    map<T, C>(
      children: C | ReadonlyArray<C>,
      fn: (child: C, index: number) => T
    ): C extends null | undefined
      ? C
      : Array<Exclude<T, boolean | null | undefined>>;
    forEach<C>(
      children: C | ReadonlyArray<C>,
      fn: (child: C, index: number) => void
    ): void;
    count(children: any): number;
    only<C>(children: C): C extends any[] ? never : C;
    toArray(
      children: ReactNode | ReactNode[]
    ): Array<Exclude<ReactNode, boolean | null | undefined>>;
  }

  const Children: ReactChildren;

  // Fragment
  const Fragment: ExoticComponent<{ children?: ReactNode | undefined }>;

  // StrictMode
  const StrictMode: ExoticComponent<{ children?: ReactNode | undefined }>;

  // Suspense
  interface SuspenseProps {
    children?: ReactNode | undefined;
    fallback?: ReactNode;
  }

  const Suspense: ExoticComponent<SuspenseProps>;

  // Lazy
  function lazy<T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>
  ): LazyExoticComponent<T>;

  interface LazyExoticComponent<T extends ComponentType<any>>
    extends ExoticComponent<ComponentPropsWithRef<T>> {
    readonly _result: T;
  }

  type ComponentPropsWithRef<T extends ElementType> = T extends new (
    props: infer P
  ) => Component<any, any>
    ? PropsWithoutRef<P> & RefAttributes<InstanceType<T>>
    : ComponentProps<T>;

  type ComponentProps<
    T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
  > = T extends JSXElementConstructor<infer P>
    ? P
    : T extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[T]
    : {};

  type ElementType<P = any> =
    | {
        [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K]
          ? K
          : never;
      }[keyof JSX.IntrinsicElements]
    | ComponentType<P>;

  // Memo
  function memo<P extends object>(
    Component: FunctionComponent<P>,
    propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
  ): NamedExoticComponent<P>;

  function memo<T extends ComponentType<any>>(
    Component: T,
    propsAreEqual?: (
      prevProps: Readonly<ComponentProps<T>>,
      nextProps: Readonly<ComponentProps<T>>
    ) => boolean
  ): MemoExoticComponent<T>;

  interface MemoExoticComponent<T extends ComponentType<any>>
    extends NamedExoticComponent<ComponentPropsWithRef<T>> {
    readonly type: T;
  }

  // Profiler
  type ProfilerOnRenderCallback = (
    id: string,
    phase: "mount" | "update",
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number,
    interactions: Set<SchedulerInteraction>
  ) => void;

  interface ProfilerProps {
    children?: ReactNode | undefined;
    id: string;
    onRender: ProfilerOnRenderCallback;
  }

  const Profiler: ExoticComponent<ProfilerProps>;

  interface SchedulerInteraction {
    id: number;
    name: string;
    timestamp: number;
  }

  // createRef
  function createRef<T>(): RefObject<T>;

  // ReactHTML elements
  type ReactHTML = {
    [K in keyof HTMLElementTagNameMap]: DetailedHTMLFactory<
      HTMLAttributes<HTMLElementTagNameMap[K]>,
      HTMLElementTagNameMap[K]
    >;
  };

  interface DetailedHTMLFactory<
    P extends DOMAttributes<T>,
    T extends HTMLElement
  > extends DOMFactory<P, T> {
    (
      props?: (ClassAttributes<T> & P) | null,
      ...children: ReactNode[]
    ): DOMElement<P, T>;
  }
}

// Types de compatibilité pour React 19
// Ce fichier fournit les définitions de types manquantes pour React 19

declare module "react" {
  import * as CSS from "csstype";

  // Types de base
  type ReactText = string | number;
  type ReactChild = ReactElement | ReactText;

  interface ReactNodeArray extends Array<ReactNode> {}
  type ReactFragment = {} | ReactNodeArray;
  type ReactNode =
    | ReactChild
    | ReactFragment
    | ReactPortal
    | boolean
    | null
    | undefined;

  type Key = string | number;

  // Props de base
  interface Attributes {
    key?: Key | null | undefined;
  }

  interface RefAttributes<T> extends Attributes {
    ref?: Ref<T> | undefined;
  }

  interface ClassAttributes<T> extends Attributes {
    ref?: LegacyRef<T> | undefined;
  }

  // Types de référence
  type Ref<T> = RefCallback<T> | RefObject<T> | null;
  type LegacyRef<T> = string | Ref<T>;
  type RefCallback<T> = {
    bivarianceHack(instance: T | null): void;
  }["bivarianceHack"];

  interface RefObject<T> {
    readonly current: T | null;
  }

  // Props HTML
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    accessKey?: string | undefined;
    className?: string | undefined;
    contentEditable?: Booleanish | "inherit" | undefined;
    contextMenu?: string | undefined;
    dir?: string | undefined;
    draggable?: Booleanish | undefined;
    hidden?: boolean | undefined;
    id?: string | undefined;
    lang?: string | undefined;
    placeholder?: string | undefined;
    slot?: string | undefined;
    spellCheck?: Booleanish | undefined;
    style?: CSSProperties | undefined;
    tabIndex?: number | undefined;
    title?: string | undefined;
    translate?: "yes" | "no" | undefined;
    radioGroup?: string | undefined;
    role?: AriaRole | undefined;
    about?: string | undefined;
    datatype?: string | undefined;
    inlist?: any;
    prefix?: string | undefined;
    property?: string | undefined;
    resource?: string | undefined;
    typeof?: string | undefined;
    vocab?: string | undefined;
    autoCapitalize?: string | undefined;
    autoCorrect?: string | undefined;
    autoSave?: string | undefined;
    color?: string | undefined;
    itemProp?: string | undefined;
    itemRef?: string | undefined;
    itemScope?: boolean | undefined;
    itemType?: string | undefined;
    itemID?: string | undefined;
    security?: string | undefined;
    unselectable?: "on" | "off" | undefined;
    inputMode?:
      | "none"
      | "text"
      | "tel"
      | "url"
      | "email"
      | "numeric"
      | "decimal"
      | "search"
      | undefined;
    is?: string | undefined;
  }

  // Props ARIA
  interface AriaAttributes {
    "aria-activedescendant"?: string | undefined;
    "aria-atomic"?: Booleanish | undefined;
    "aria-autocomplete"?: "none" | "inline" | "list" | "both" | undefined;
    "aria-busy"?: Booleanish | undefined;
    "aria-checked"?: boolean | "false" | "mixed" | "true" | undefined;
    "aria-colcount"?: number | undefined;
    "aria-colindex"?: number | undefined;
    "aria-colspan"?: number | undefined;
    "aria-controls"?: string | undefined;
    "aria-current"?:
      | boolean
      | "false"
      | "true"
      | "page"
      | "step"
      | "location"
      | "date"
      | "time"
      | undefined;
    "aria-describedby"?: string | undefined;
    "aria-details"?: string | undefined;
    "aria-disabled"?: Booleanish | undefined;
    "aria-dropeffect"?:
      | "none"
      | "copy"
      | "execute"
      | "link"
      | "move"
      | "popup"
      | undefined;
    "aria-errormessage"?: string | undefined;
    "aria-expanded"?: Booleanish | undefined;
    "aria-flowto"?: string | undefined;
    "aria-grabbed"?: Booleanish | undefined;
    "aria-haspopup"?:
      | boolean
      | "false"
      | "true"
      | "menu"
      | "listbox"
      | "tree"
      | "grid"
      | "dialog"
      | undefined;
    "aria-hidden"?: Booleanish | undefined;
    "aria-invalid"?:
      | boolean
      | "false"
      | "true"
      | "grammar"
      | "spelling"
      | undefined;
    "aria-keyshortcuts"?: string | undefined;
    "aria-label"?: string | undefined;
    "aria-labelledby"?: string | undefined;
    "aria-level"?: number | undefined;
    "aria-live"?: "off" | "assertive" | "polite" | undefined;
    "aria-modal"?: Booleanish | undefined;
    "aria-multiline"?: Booleanish | undefined;
    "aria-multiselectable"?: Booleanish | undefined;
    "aria-orientation"?: "horizontal" | "vertical" | undefined;
    "aria-owns"?: string | undefined;
    "aria-placeholder"?: string | undefined;
    "aria-posinset"?: number | undefined;
    "aria-pressed"?: boolean | "false" | "mixed" | "true" | undefined;
    "aria-readonly"?: Booleanish | undefined;
    "aria-relevant"?:
      | "additions"
      | "additions removals"
      | "additions text"
      | "all"
      | "removals"
      | "removals additions"
      | "removals text"
      | "text"
      | "text additions"
      | "text removals"
      | undefined;
    "aria-required"?: Booleanish | undefined;
    "aria-roledescription"?: string | undefined;
    "aria-rowcount"?: number | undefined;
    "aria-rowindex"?: number | undefined;
    "aria-rowspan"?: number | undefined;
    "aria-selected"?: Booleanish | undefined;
    "aria-setsize"?: number | undefined;
    "aria-sort"?: "none" | "ascending" | "descending" | "other" | undefined;
    "aria-valuemax"?: number | undefined;
    "aria-valuemin"?: number | undefined;
    "aria-valuenow"?: number | undefined;
    "aria-valuetext"?: string | undefined;
  }

  type AriaRole =
    | "alert"
    | "alertdialog"
    | "application"
    | "article"
    | "banner"
    | "button"
    | "cell"
    | "checkbox"
    | "columnheader"
    | "combobox"
    | "complementary"
    | "contentinfo"
    | "definition"
    | "dialog"
    | "directory"
    | "document"
    | "feed"
    | "figure"
    | "form"
    | "grid"
    | "gridcell"
    | "group"
    | "heading"
    | "img"
    | "link"
    | "list"
    | "listbox"
    | "listitem"
    | "log"
    | "main"
    | "marquee"
    | "math"
    | "menu"
    | "menubar"
    | "menuitem"
    | "menuitemcheckbox"
    | "menuitemradio"
    | "navigation"
    | "none"
    | "note"
    | "option"
    | "presentation"
    | "progressbar"
    | "radio"
    | "radiogroup"
    | "region"
    | "row"
    | "rowgroup"
    | "rowheader"
    | "scrollbar"
    | "search"
    | "searchbox"
    | "separator"
    | "slider"
    | "spinbutton"
    | "status"
    | "switch"
    | "tab"
    | "table"
    | "tablist"
    | "tabpanel"
    | "term"
    | "textbox"
    | "timer"
    | "toolbar"
    | "tooltip"
    | "tree"
    | "treegrid"
    | "treeitem"
    | (string & {});

  // Types de DOM
  interface DOMAttributes<T> {
    children?: ReactNode | undefined;
    dangerouslySetInnerHTML?:
      | {
          __html: string;
        }
      | undefined;

    // Clipboard Events
    onCopy?: ClipboardEventHandler<T> | undefined;
    onCopyCapture?: ClipboardEventHandler<T> | undefined;
    onCut?: ClipboardEventHandler<T> | undefined;
    onCutCapture?: ClipboardEventHandler<T> | undefined;
    onPaste?: ClipboardEventHandler<T> | undefined;
    onPasteCapture?: ClipboardEventHandler<T> | undefined;

    // Composition Events
    onCompositionEnd?: CompositionEventHandler<T> | undefined;
    onCompositionEndCapture?: CompositionEventHandler<T> | undefined;
    onCompositionStart?: CompositionEventHandler<T> | undefined;
    onCompositionStartCapture?: CompositionEventHandler<T> | undefined;
    onCompositionUpdate?: CompositionEventHandler<T> | undefined;
    onCompositionUpdateCapture?: CompositionEventHandler<T> | undefined;

    // Focus Events
    onFocus?: FocusEventHandler<T> | undefined;
    onFocusCapture?: FocusEventHandler<T> | undefined;
    onBlur?: FocusEventHandler<T> | undefined;
    onBlurCapture?: FocusEventHandler<T> | undefined;

    // Form Events
    onChange?: FormEventHandler<T> | undefined;
    onChangeCapture?: FormEventHandler<T> | undefined;
    onBeforeInput?: FormEventHandler<T> | undefined;
    onBeforeInputCapture?: FormEventHandler<T> | undefined;
    onInput?: FormEventHandler<T> | undefined;
    onInputCapture?: FormEventHandler<T> | undefined;
    onReset?: FormEventHandler<T> | undefined;
    onResetCapture?: FormEventHandler<T> | undefined;
    onSubmit?: FormEventHandler<T> | undefined;
    onSubmitCapture?: FormEventHandler<T> | undefined;
    onInvalid?: FormEventHandler<T> | undefined;
    onInvalidCapture?: FormEventHandler<T> | undefined;

    // Image Events
    onLoad?: ReactEventHandler<T> | undefined;
    onLoadCapture?: ReactEventHandler<T> | undefined;
    onError?: ReactEventHandler<T> | undefined;
    onErrorCapture?: ReactEventHandler<T> | undefined;

    // Keyboard Events
    onKeyDown?: KeyboardEventHandler<T> | undefined;
    onKeyDownCapture?: KeyboardEventHandler<T> | undefined;
    onKeyPress?: KeyboardEventHandler<T> | undefined;
    onKeyPressCapture?: KeyboardEventHandler<T> | undefined;
    onKeyUp?: KeyboardEventHandler<T> | undefined;
    onKeyUpCapture?: KeyboardEventHandler<T> | undefined;

    // Media Events
    onAbort?: ReactEventHandler<T> | undefined;
    onAbortCapture?: ReactEventHandler<T> | undefined;
    onCanPlay?: ReactEventHandler<T> | undefined;
    onCanPlayCapture?: ReactEventHandler<T> | undefined;
    onCanPlayThrough?: ReactEventHandler<T> | undefined;
    onCanPlayThroughCapture?: ReactEventHandler<T> | undefined;
    onDurationChange?: ReactEventHandler<T> | undefined;
    onDurationChangeCapture?: ReactEventHandler<T> | undefined;
    onEmptied?: ReactEventHandler<T> | undefined;
    onEmptiedCapture?: ReactEventHandler<T> | undefined;
    onEncrypted?: ReactEventHandler<T> | undefined;
    onEncryptedCapture?: ReactEventHandler<T> | undefined;
    onEnded?: ReactEventHandler<T> | undefined;
    onEndedCapture?: ReactEventHandler<T> | undefined;
    onLoadedData?: ReactEventHandler<T> | undefined;
    onLoadedDataCapture?: ReactEventHandler<T> | undefined;
    onLoadedMetadata?: ReactEventHandler<T> | undefined;
    onLoadedMetadataCapture?: ReactEventHandler<T> | undefined;
    onLoadStart?: ReactEventHandler<T> | undefined;
    onLoadStartCapture?: ReactEventHandler<T> | undefined;
    onPause?: ReactEventHandler<T> | undefined;
    onPauseCapture?: ReactEventHandler<T> | undefined;
    onPlay?: ReactEventHandler<T> | undefined;
    onPlayCapture?: ReactEventHandler<T> | undefined;
    onPlaying?: ReactEventHandler<T> | undefined;
    onPlayingCapture?: ReactEventHandler<T> | undefined;
    onProgress?: ReactEventHandler<T> | undefined;
    onProgressCapture?: ReactEventHandler<T> | undefined;
    onRateChange?: ReactEventHandler<T> | undefined;
    onRateChangeCapture?: ReactEventHandler<T> | undefined;
    onSeeked?: ReactEventHandler<T> | undefined;
    onSeekedCapture?: ReactEventHandler<T> | undefined;
    onSeeking?: ReactEventHandler<T> | undefined;
    onSeekingCapture?: ReactEventHandler<T> | undefined;
    onStalled?: ReactEventHandler<T> | undefined;
    onStalledCapture?: ReactEventHandler<T> | undefined;
    onSuspend?: ReactEventHandler<T> | undefined;
    onSuspendCapture?: ReactEventHandler<T> | undefined;
    onTimeUpdate?: ReactEventHandler<T> | undefined;
    onTimeUpdateCapture?: ReactEventHandler<T> | undefined;
    onVolumeChange?: ReactEventHandler<T> | undefined;
    onVolumeChangeCapture?: ReactEventHandler<T> | undefined;
    onWaiting?: ReactEventHandler<T> | undefined;
    onWaitingCapture?: ReactEventHandler<T> | undefined;

    // MouseEvents
    onAuxClick?: MouseEventHandler<T> | undefined;
    onAuxClickCapture?: MouseEventHandler<T> | undefined;
    onClick?: MouseEventHandler<T> | undefined;
    onClickCapture?: MouseEventHandler<T> | undefined;
    onContextMenu?: MouseEventHandler<T> | undefined;
    onContextMenuCapture?: MouseEventHandler<T> | undefined;
    onDoubleClick?: MouseEventHandler<T> | undefined;
    onDoubleClickCapture?: MouseEventHandler<T> | undefined;
    onDrag?: DragEventHandler<T> | undefined;
    onDragCapture?: DragEventHandler<T> | undefined;
    onDragEnd?: DragEventHandler<T> | undefined;
    onDragEndCapture?: DragEventHandler<T> | undefined;
    onDragEnter?: DragEventHandler<T> | undefined;
    onDragEnterCapture?: DragEventHandler<T> | undefined;
    onDragExit?: DragEventHandler<T> | undefined;
    onDragExitCapture?: DragEventHandler<T> | undefined;
    onDragLeave?: DragEventHandler<T> | undefined;
    onDragLeaveCapture?: DragEventHandler<T> | undefined;
    onDragOver?: DragEventHandler<T> | undefined;
    onDragOverCapture?: DragEventHandler<T> | undefined;
    onDragStart?: DragEventHandler<T> | undefined;
    onDragStartCapture?: DragEventHandler<T> | undefined;
    onDrop?: DragEventHandler<T> | undefined;
    onDropCapture?: DragEventHandler<T> | undefined;
    onMouseDown?: MouseEventHandler<T> | undefined;
    onMouseDownCapture?: MouseEventHandler<T> | undefined;
    onMouseEnter?: MouseEventHandler<T> | undefined;
    onMouseLeave?: MouseEventHandler<T> | undefined;
    onMouseMove?: MouseEventHandler<T> | undefined;
    onMouseMoveCapture?: MouseEventHandler<T> | undefined;
    onMouseOut?: MouseEventHandler<T> | undefined;
    onMouseOutCapture?: MouseEventHandler<T> | undefined;
    onMouseOver?: MouseEventHandler<T> | undefined;
    onMouseOverCapture?: MouseEventHandler<T> | undefined;
    onMouseUp?: MouseEventHandler<T> | undefined;
    onMouseUpCapture?: MouseEventHandler<T> | undefined;

    // Selection Events
    onSelect?: ReactEventHandler<T> | undefined;
    onSelectCapture?: ReactEventHandler<T> | undefined;

    // Touch Events
    onTouchCancel?: TouchEventHandler<T> | undefined;
    onTouchCancelCapture?: TouchEventHandler<T> | undefined;
    onTouchEnd?: TouchEventHandler<T> | undefined;
    onTouchEndCapture?: TouchEventHandler<T> | undefined;
    onTouchMove?: TouchEventHandler<T> | undefined;
    onTouchMoveCapture?: TouchEventHandler<T> | undefined;
    onTouchStart?: TouchEventHandler<T> | undefined;
    onTouchStartCapture?: TouchEventHandler<T> | undefined;

    // Pointer Events
    onPointerDown?: PointerEventHandler<T> | undefined;
    onPointerDownCapture?: PointerEventHandler<T> | undefined;
    onPointerMove?: PointerEventHandler<T> | undefined;
    onPointerMoveCapture?: PointerEventHandler<T> | undefined;
    onPointerUp?: PointerEventHandler<T> | undefined;
    onPointerUpCapture?: PointerEventHandler<T> | undefined;
    onPointerCancel?: PointerEventHandler<T> | undefined;
    onPointerCancelCapture?: PointerEventHandler<T> | undefined;
    onPointerEnter?: PointerEventHandler<T> | undefined;
    onPointerEnterCapture?: PointerEventHandler<T> | undefined;
    onPointerLeave?: PointerEventHandler<T> | undefined;
    onPointerLeaveCapture?: PointerEventHandler<T> | undefined;
    onPointerOver?: PointerEventHandler<T> | undefined;
    onPointerOverCapture?: PointerEventHandler<T> | undefined;
    onPointerOut?: PointerEventHandler<T> | undefined;
    onPointerOutCapture?: PointerEventHandler<T> | undefined;
    onGotPointerCapture?: PointerEventHandler<T> | undefined;
    onGotPointerCaptureCapture?: PointerEventHandler<T> | undefined;
    onLostPointerCapture?: PointerEventHandler<T> | undefined;
    onLostPointerCaptureCapture?: PointerEventHandler<T> | undefined;

    // UI Events
    onScroll?: UIEventHandler<T> | undefined;
    onScrollCapture?: UIEventHandler<T> | undefined;

    // Wheel Events
    onWheel?: WheelEventHandler<T> | undefined;
    onWheelCapture?: WheelEventHandler<T> | undefined;

    // Animation Events
    onAnimationStart?: AnimationEventHandler<T> | undefined;
    onAnimationStartCapture?: AnimationEventHandler<T> | undefined;
    onAnimationEnd?: AnimationEventHandler<T> | undefined;
    onAnimationEndCapture?: AnimationEventHandler<T> | undefined;
    onAnimationIteration?: AnimationEventHandler<T> | undefined;
    onAnimationIterationCapture?: AnimationEventHandler<T> | undefined;

    // Transition Events
    onTransitionEnd?: TransitionEventHandler<T> | undefined;
    onTransitionEndCapture?: TransitionEventHandler<T> | undefined;
  }

  type CSSProperties = CSS.Properties<string | number>;

  type Booleanish = boolean | "true" | "false";

  // Event handlers
  type EventHandler<E extends SyntheticEvent<any>> = {
    bivarianceHack(event: E): void;
  }["bivarianceHack"];

  type ReactEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
  type ClipboardEventHandler<T = Element> = EventHandler<ClipboardEvent<T>>;
  type CompositionEventHandler<T = Element> = EventHandler<CompositionEvent<T>>;
  type DragEventHandler<T = Element> = EventHandler<DragEvent<T>>;
  type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>;
  type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
  type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;
  type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>;
  type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;
  type TouchEventHandler<T = Element> = EventHandler<TouchEvent<T>>;
  type PointerEventHandler<T = Element> = EventHandler<PointerEvent<T>>;
  type UIEventHandler<T = Element> = EventHandler<UIEvent<T>>;
  type WheelEventHandler<T = Element> = EventHandler<WheelEvent<T>>;
  type AnimationEventHandler<T = Element> = EventHandler<AnimationEvent<T>>;
  type TransitionEventHandler<T = Element> = EventHandler<TransitionEvent<T>>;

  // Event types
  interface BaseSyntheticEvent<E = object, C = any, T = any> {
    nativeEvent: E;
    currentTarget: C;
    target: T;
    bubbles: boolean;
    cancelable: boolean;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    preventDefault(): void;
    isDefaultPrevented(): boolean;
    stopPropagation(): void;
    isPropagationStopped(): boolean;
    persist(): void;
    timeStamp: number;
    type: string;
  }

  interface SyntheticEvent<T = Element, E = Event>
    extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}

  interface ClipboardEvent<T = Element>
    extends SyntheticEvent<T, NativeClipboardEvent> {
    clipboardData: DataTransfer;
  }

  interface CompositionEvent<T = Element>
    extends SyntheticEvent<T, NativeCompositionEvent> {
    data: string;
  }

  interface DragEvent<T = Element> extends MouseEvent<T, NativeDragEvent> {
    dataTransfer: DataTransfer;
  }

  interface PointerEvent<T = Element>
    extends MouseEvent<T, NativePointerEvent> {
    pointerId: number;
    pressure: number;
    tangentialPressure: number;
    tiltX: number;
    tiltY: number;
    twist: number;
    width: number;
    height: number;
    pointerType: "mouse" | "pen" | "touch";
    isPrimary: boolean;
  }

  interface FocusEvent<Target = Element, RelatedTarget = Element>
    extends SyntheticEvent<Target, NativeFocusEvent> {
    relatedTarget: (EventTarget & RelatedTarget) | null;
    target: EventTarget & Target;
  }

  interface FormEvent<T = Element> extends SyntheticEvent<T> {}

  interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }

  interface KeyboardEvent<T = Element> extends UIEvent<T, NativeKeyboardEvent> {
    altKey: boolean;
    charCode: number;
    ctrlKey: boolean;
    code: string;
    getModifierState(key: string): boolean;
    key: string;
    keyCode: number;
    locale: string;
    location: number;
    metaKey: boolean;
    repeat: boolean;
    shiftKey: boolean;
    which: number;
  }

  interface MouseEvent<T = Element, E = NativeMouseEvent>
    extends UIEvent<T, E> {
    altKey: boolean;
    button: number;
    buttons: number;
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    getModifierState(key: string): boolean;
    metaKey: boolean;
    movementX: number;
    movementY: number;
    pageX: number;
    pageY: number;
    relatedTarget: EventTarget | null;
    screenX: number;
    screenY: number;
    shiftKey: boolean;
  }

  interface TouchEvent<T = Element> extends UIEvent<T, NativeTouchEvent> {
    altKey: boolean;
    changedTouches: TouchList;
    ctrlKey: boolean;
    getModifierState(key: string): boolean;
    metaKey: boolean;
    shiftKey: boolean;
    targetTouches: TouchList;
    touches: TouchList;
  }

  interface UIEvent<T = Element, E = NativeUIEvent>
    extends SyntheticEvent<T, E> {
    detail: number;
    view: AbstractView;
  }

  interface WheelEvent<T = Element> extends MouseEvent<T, NativeWheelEvent> {
    deltaMode: number;
    deltaX: number;
    deltaY: number;
    deltaZ: number;
  }

  interface AnimationEvent<T = Element>
    extends SyntheticEvent<T, NativeAnimationEvent> {
    animationName: string;
    elapsedTime: number;
    pseudoElement: string;
  }

  interface TransitionEvent<T = Element>
    extends SyntheticEvent<T, NativeTransitionEvent> {
    elapsedTime: number;
    propertyName: string;
    pseudoElement: string;
  }

  // Native event types
  type NativeAnimationEvent = globalThis.AnimationEvent;
  type NativeClipboardEvent = globalThis.ClipboardEvent;
  type NativeCompositionEvent = globalThis.CompositionEvent;
  type NativeDragEvent = globalThis.DragEvent;
  type NativeFocusEvent = globalThis.FocusEvent;
  type NativeKeyboardEvent = globalThis.KeyboardEvent;
  type NativeMouseEvent = globalThis.MouseEvent;
  type NativePointerEvent = globalThis.PointerEvent;
  type NativeTouchEvent = globalThis.TouchEvent;
  type NativeTransitionEvent = globalThis.TransitionEvent;
  type NativeUIEvent = globalThis.UIEvent;
  type NativeWheelEvent = globalThis.WheelEvent;

  // Component types
  interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
    propTypes?: WeakValidationMap<P> | undefined;
    contextTypes?: ValidationMap<any> | undefined;
    defaultProps?: Partial<P> | undefined;
    displayName?: string | undefined;
  }

  interface ComponentClass<P = {}, S = ComponentState>
    extends StaticLifecycle<P, S> {
    new (props: P, context?: any): Component<P, S>;
    propTypes?: WeakValidationMap<P> | undefined;
    contextType?: Context<any> | undefined;
    contextTypes?: ValidationMap<any> | undefined;
    childContextTypes?: ValidationMap<any> | undefined;
    defaultProps?: Partial<P> | undefined;
    displayName?: string | undefined;
  }

  type FC<P = {}> = FunctionComponent<P>;

  type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

  type JSXElementConstructor<P> =
    | ((props: P) => ReactElement<any, any> | null)
    | (new (props: P) => Component<any, any>);

  interface ReactElement<
    P = any,
    T extends string | JSXElementConstructor<any> =
      | string
      | JSXElementConstructor<any>
  > {
    type: T;
    props: P;
    key: Key | null;
  }

  interface ReactComponentElement<
    T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
    P = T extends JSXElementConstructor<infer Props>
      ? Props
      : T extends keyof JSX.IntrinsicElements
      ? JSX.IntrinsicElements[T]
      : {}
  > extends ReactElement<P, Exclude<T, number>> {}

  type ReactHTML = ReactElement<HTMLAttributes<HTMLElement>, string>;

  interface ReactPortal extends ReactElement {
    key: Key | null;
    children: ReactNode;
  }

  // Component class
  interface ComponentState {}

  interface Component<P = {}, S = {}, SS = any>
    extends ComponentLifecycle<P, S, SS> {}

  class Component<P, S> {
    constructor(props: Readonly<P> | P);
    constructor(props: P, context: any);

    setState<K extends keyof S>(
      state:
        | ((
            prevState: Readonly<S>,
            props: Readonly<P>
          ) => Pick<S, K> | S | null)
        | (Pick<S, K> | S | null),
      callback?: () => void
    ): void;

    forceUpdate(callback?: () => void): void;
    render(): ReactNode;

    readonly props: Readonly<P> &
      Readonly<{ children?: ReactNode | undefined }>;
    state: Readonly<S>;
    context: any;
    refs: {
      [key: string]: ReactInstance;
    };
  }

  interface ComponentLifecycle<P, S, SS = any>
    extends NewLifecycle<P, S, SS>,
      DeprecatedLifecycle<P, S> {
    componentDidMount?(): void;
    shouldComponentUpdate?(
      nextProps: Readonly<P>,
      nextState: Readonly<S>,
      nextContext: any
    ): boolean;
    componentWillUnmount?(): void;
    componentDidCatch?(error: Error, errorInfo: ErrorInfo): void;
  }

  interface StaticLifecycle<P, S> {
    getDerivedStateFromProps?: GetDerivedStateFromProps<P, S> | undefined;
    getDerivedStateFromError?: GetDerivedStateFromError<P, S> | undefined;
  }

  type GetDerivedStateFromProps<P, S> = (
    nextProps: Readonly<P>,
    prevState: S
  ) => Partial<S> | null;

  type GetDerivedStateFromError<P, S> = (error: any) => Partial<S> | null;

  interface NewLifecycle<P, S, SS> {
    getSnapshotBeforeUpdate?(
      prevProps: Readonly<P>,
      prevState: Readonly<S>
    ): SS | null;
    componentDidUpdate?(
      prevProps: Readonly<P>,
      prevState: Readonly<S>,
      snapshot?: SS
    ): void;
  }

  interface DeprecatedLifecycle<P, S> {
    componentWillMount?(): void;
    UNSAFE_componentWillMount?(): void;
    componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
    UNSAFE_componentWillReceiveProps?(
      nextProps: Readonly<P>,
      nextContext: any
    ): void;
    componentWillUpdate?(
      nextProps: Readonly<P>,
      nextState: Readonly<S>,
      nextContext: any
    ): void;
    UNSAFE_componentWillUpdate?(
      nextProps: Readonly<P>,
      nextState: Readonly<S>,
      nextContext: any
    ): void;
  }

  interface ErrorInfo {
    componentStack: string;
  }

  // forwardRef
  interface ForwardRefRenderFunction<T, P = {}> {
    (props: P, ref: ForwardedRef<T>): ReactElement | null;
    displayName?: string | undefined;
    defaultProps?: never | undefined;
    propTypes?: never | undefined;
  }

  interface ForwardRefExoticComponent<P> extends NamedExoticComponent<P> {
    defaultProps?: never | undefined;
    propTypes?: never | undefined;
  }

  function forwardRef<T, P = {}>(
    render: ForwardRefRenderFunction<T, P>
  ): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;

  type ForwardedRef<T> =
    | ((instance: T | null) => void)
    | MutableRefObject<T | null>
    | null;

  // Props utilities
  type PropsWithChildren<P = unknown> = P & {
    children?: ReactNode | undefined;
  };

  type PropsWithoutRef<P> = P extends any
    ? "ref" extends keyof P
      ? Pick<P, Exclude<keyof P, "ref">>
      : P
    : P;

  type PropsWithRef<P> = P extends any
    ? "ref" extends keyof P
      ? P extends { ref?: infer R | undefined }
        ? string extends R
          ? PropsWithoutRef<P> & { ref?: Exclude<R, string> | undefined }
          : P
        : P
      : P
    : P;

  // Context
  interface Context<T> {
    Provider: Provider<T>;
    Consumer: Consumer<T>;
    displayName?: string | undefined;
  }

  type Provider<T> = ProviderExoticComponent<ProviderProps<T>>;

  type Consumer<T> = ExoticComponent<ConsumerProps<T>>;

  interface ProviderProps<T> {
    value: T;
    children?: ReactNode | undefined;
  }

  interface ConsumerProps<T> {
    children: (value: T) => ReactNode;
  }

  interface ProviderExoticComponent<P> extends ExoticComponent<P> {
    propTypes?: never | undefined;
  }

  type ContextType<C extends Context<any>> = C extends Context<infer T>
    ? T
    : never;

  // Exotic component types
  interface ExoticComponent<P = {}> {
    (props: P): ReactElement | null;
    readonly $$typeof: symbol;
  }

  interface NamedExoticComponent<P = {}> extends ExoticComponent<P> {
    displayName?: string | undefined;
  }

  // Hook types
  type Dispatch<A> = (value: A) => void;
  type SetStateAction<S> = S | ((prevState: S) => S);

  // Hooks
  function useState<S>(
    initialState: S | (() => S)
  ): [S, Dispatch<SetStateAction<S>>];
  function useState<S = undefined>(): [
    S | undefined,
    Dispatch<SetStateAction<S | undefined>>
  ];

  function useEffect(effect: EffectCallback, deps?: DependencyList): void;
  type EffectCallback = () => void | (() => void | undefined);
  type DependencyList = ReadonlyArray<any>;

  function useContext<T>(context: Context<T>): T;

  function useReducer<R extends Reducer<any, any>, I>(
    reducer: R,
    initializerArg: I,
    initializer: (arg: I) => ReducerState<R>
  ): [ReducerState<R>, Dispatch<ReducerAction<R>>];

  function useReducer<R extends Reducer<any, any>>(
    reducer: R,
    initialState: ReducerState<R>,
    initializer?: undefined
  ): [ReducerState<R>, Dispatch<ReducerAction<R>>];

  type Reducer<S, A> = (prevState: S, action: A) => S;
  type ReducerState<R extends Reducer<any, any>> = R extends Reducer<
    infer S,
    any
  >
    ? S
    : never;
  type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<
    any,
    infer A
  >
    ? A
    : never;

  function useCallback<T extends Function>(
    callback: T,
    deps: DependencyList
  ): T;

  function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;

  function useRef<T>(initialValue: T): MutableRefObject<T>;
  function useRef<T>(initialValue: T | null): RefObject<T>;
  function useRef<T = undefined>(): MutableRefObject<T | undefined>;

  interface MutableRefObject<T> {
    current: T;
  }

  function useImperativeHandle<T, R extends T>(
    ref: Ref<T> | undefined,
    init: () => R,
    deps?: DependencyList
  ): void;

  function useLayoutEffect(effect: EffectCallback, deps?: DependencyList): void;

  function useDebugValue<T>(value: T, format?: (value: T) => any): void;

  // Additional hooks for React 18+
  function useId(): string;

  function useDeferredValue<T>(value: T): T;

  function useTransition(): [boolean, (callback: () => void) => void];

  function useSyncExternalStore<T>(
    subscribe: (onStoreChange: () => void) => () => void,
    getSnapshot: () => T,
    getServerSnapshot?: () => T
  ): T;

  function useInsertionEffect(
    effect: EffectCallback,
    deps?: DependencyList
  ): void;

  // Validation
  interface Validator<T> {
    (
      object: T,
      key: string,
      componentName: string,
      location: string,
      propFullName: string
    ): Error | null;
  }

  interface Requireable<T> extends Validator<T> {
    isRequired: Validator<NonNullable<T>>;
  }

  type ValidationMap<T> = { [K in keyof T]?: Validator<T[K]> };

  type WeakValidationMap<T> = {
    [K in keyof T]?: null extends T[K]
      ? Validator<T[K] | null | undefined>
      : undefined extends T[K]
      ? Validator<T[K] | null | undefined>
      : Validator<T[K]>;
  };

  // React Instance
  type ReactInstance = Component<any> | Element;

  // createElement
  function createElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
    type: keyof ReactHTML,
    props?: (ClassAttributes<T> & P) | null,
    ...children: ReactNode[]
  ): DetailedReactHTMLElement<P, T>;

  function createElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
    type: string,
    props?: (ClassAttributes<T> & P) | null,
    ...children: ReactNode[]
  ): ReactElement<P>;

  function createElement<P extends SVGAttributes<T>, T extends SVGElement>(
    type: keyof ReactSVG,
    props?: (ClassAttributes<T> & P) | null,
    ...children: ReactNode[]
  ): ReactSVGElement;

  function createElement<P extends DOMAttributes<T>, T extends Element>(
    type: string,
    props?: (ClassAttributes<T> & P) | null,
    ...children: ReactNode[]
  ): DOMElement<P, T>;

  function createElement<P extends {}>(
    type: FunctionComponent<P>,
    props?: (Attributes & P) | null,
    ...children: ReactNode[]
  ): FunctionComponentElement<P>;

  function createElement<P extends {}>(
    type: ComponentClass<P>,
    props?: (ClassAttributes<ComponentClass<P>> & P) | null,
    ...children: ReactNode[]
  ): CElement<P, ComponentClass<P>>;

  function createElement<P extends {}>(
    type: FunctionComponent<P> | ComponentClass<P> | string,
    props?: (Attributes & P) | null,
    ...children: ReactNode[]
  ): ReactElement<P>;

  // Detailed element types
  interface DetailedReactHTMLElement<
    P extends HTMLAttributes<T>,
    T extends HTMLElement
  > extends ReactElement<P, string> {
    type: keyof ReactHTML;
    props: P;
    key: Key | null;
  }

  interface ReactSVGElement
    extends ReactElement<SVGAttributes<SVGElement>, string> {
    type: keyof ReactSVG;
    props: SVGAttributes<SVGElement>;
    key: Key | null;
  }

  interface DOMElement<
    P extends HTMLAttributes<T> | SVGAttributes<T>,
    T extends Element
  > extends ReactElement<P, string> {
    type: string;
    props: P;
    key: Key | null;
  }

  interface FunctionComponentElement<P>
    extends ReactElement<P, FunctionComponent<P>> {
    type: FunctionComponent<P>;
    props: P;
    key: Key | null;
  }

  interface CElement<P, T extends Component<P, ComponentState>>
    extends ReactElement<P, ComponentClass<P>> {
    type: ComponentClass<P>;
    props: P;
    key: Key | null;
  }

  // SVG types
  interface ReactSVG {
    animate: SVGProps<SVGElement>;
    circle: SVGProps<SVGCircleElement>;
    clipPath: SVGProps<SVGClipPathElement>;
    defs: SVGProps<SVGDefsElement>;
    desc: SVGProps<SVGDescElement>;
    ellipse: SVGProps<SVGEllipseElement>;
    feBlend: SVGProps<SVGFEBlendElement>;
    feColorMatrix: SVGProps<SVGFEColorMatrixElement>;
    feComponentTransfer: SVGProps<SVGFEComponentTransferElement>;
    feComposite: SVGProps<SVGFECompositeElement>;
    feConvolveMatrix: SVGProps<SVGFEConvolveMatrixElement>;
    feDiffuseLighting: SVGProps<SVGFEDiffuseLightingElement>;
    feDisplacementMap: SVGProps<SVGFEDisplacementMapElement>;
    feDistantLight: SVGProps<SVGFEDistantLightElement>;
    feDropShadow: SVGProps<SVGFEDropShadowElement>;
    feFlood: SVGProps<SVGFEFloodElement>;
    feFuncA: SVGProps<SVGFEFuncAElement>;
    feFuncB: SVGProps<SVGFEFuncBElement>;
    feFuncG: SVGProps<SVGFEFuncGElement>;
    feFuncR: SVGProps<SVGFEFuncRElement>;
    feGaussianBlur: SVGProps<SVGFEGaussianBlurElement>;
    feImage: SVGProps<SVGFEImageElement>;
    feMerge: SVGProps<SVGFEMergeElement>;
    feMergeNode: SVGProps<SVGFEMergeNodeElement>;
    feMorphology: SVGProps<SVGFEMorphologyElement>;
    feOffset: SVGProps<SVGFEOffsetElement>;
    fePointLight: SVGProps<SVGFEPointLightElement>;
    feSpecularLighting: SVGProps<SVGFESpecularLightingElement>;
    feSpotLight: SVGProps<SVGFESpotLightElement>;
    feTile: SVGProps<SVGFETileElement>;
    feTurbulence: SVGProps<SVGFETurbulenceElement>;
    filter: SVGProps<SVGFilterElement>;
    foreignObject: SVGProps<SVGForeignObjectElement>;
    g: SVGProps<SVGGElement>;
    image: SVGProps<SVGImageElement>;
    line: SVGProps<SVGLineElement>;
    linearGradient: SVGProps<SVGLinearGradientElement>;
    marker: SVGProps<SVGMarkerElement>;
    mask: SVGProps<SVGMaskElement>;
    metadata: SVGProps<SVGMetadataElement>;
    path: SVGProps<SVGPathElement>;
    pattern: SVGProps<SVGPatternElement>;
    polygon: SVGProps<SVGPolygonElement>;
    polyline: SVGProps<SVGPolylineElement>;
    radialGradient: SVGProps<SVGRadialGradientElement>;
    rect: SVGProps<SVGRectElement>;
    stop: SVGProps<SVGStopElement>;
    style: SVGProps<SVGStyleElement>;
    svg: SVGProps<SVGSVGElement>;
    switch: SVGProps<SVGSwitchElement>;
    symbol: SVGProps<SVGSymbolElement>;
    text: SVGProps<SVGTextElement>;
    textPath: SVGProps<SVGTextPathElement>;
    title: SVGProps<SVGTitleElement>;
    tspan: SVGProps<SVGTSpanElement>;
    use: SVGProps<SVGUseElement>;
    view: SVGProps<SVGViewElement>;
  }

  interface SVGProps<T> extends SVGAttributes<T>, ClassAttributes<T> {}

  interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string | undefined;
    color?: string | undefined;
    height?: number | string | undefined;
    id?: string | undefined;
    lang?: string | undefined;
    max?: number | string | undefined;
    media?: string | undefined;
    method?: string | undefined;
    min?: number | string | undefined;
    name?: string | undefined;
    style?: CSSProperties | undefined;
    target?: string | undefined;
    type?: string | undefined;
    width?: number | string | undefined;
    role?: AriaRole | undefined;
    tabIndex?: number | undefined;
    crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;

    accentHeight?: number | string | undefined;
    accumulate?: "none" | "sum" | undefined;
    additive?: "replace" | "sum" | undefined;
    alignmentBaseline?:
      | "auto"
      | "baseline"
      | "before-edge"
      | "text-before-edge"
      | "middle"
      | "central"
      | "after-edge"
      | "text-after-edge"
      | "ideographic"
      | "alphabetic"
      | "hanging"
      | "mathematical"
      | "inherit"
      | undefined;
    allowReorder?: "no" | "yes" | undefined;
    alphabetic?: number | string | undefined;
    amplitude?: number | string | undefined;
    arabicForm?: "initial" | "medial" | "terminal" | "isolated" | undefined;
    ascent?: number | string | undefined;
    attributeName?: string | undefined;
    attributeType?: string | undefined;
    autoReverse?: Booleanish | undefined;
    azimuth?: number | string | undefined;
    baseFrequency?: number | string | undefined;
    baselineShift?: number | string | undefined;
    baseProfile?: number | string | undefined;
    bbox?: number | string | undefined;
    begin?: number | string | undefined;
    bias?: number | string | undefined;
    by?: number | string | undefined;
    calcMode?: number | string | undefined;
    capHeight?: number | string | undefined;
    clip?: number | string | undefined;
    clipPath?: string | undefined;
    clipPathUnits?: number | string | undefined;
    clipRule?: number | string | undefined;
    colorInterpolation?: number | string | undefined;
    colorInterpolationFilters?:
      | "auto"
      | "sRGB"
      | "linearRGB"
      | "inherit"
      | undefined;
    colorProfile?: number | string | undefined;
    colorRendering?: number | string | undefined;
    contentScriptType?: number | string | undefined;
    contentStyleType?: number | string | undefined;
    cursor?: number | string | undefined;
    cx?: number | string | undefined;
    cy?: number | string | undefined;
    d?: string | undefined;
    decelerate?: number | string | undefined;
    descent?: number | string | undefined;
    diffuseConstant?: number | string | undefined;
    direction?: number | string | undefined;
    display?: number | string | undefined;
    divisor?: number | string | undefined;
    dominantBaseline?: number | string | undefined;
    dur?: number | string | undefined;
    dx?: number | string | undefined;
    dy?: number | string | undefined;
    edgeMode?: number | string | undefined;
    elevation?: number | string | undefined;
    enableBackground?: number | string | undefined;
    end?: number | string | undefined;
    exponent?: number | string | undefined;
    externalResourcesRequired?: Booleanish | undefined;
    fill?: string | undefined;
    fillOpacity?: number | string | undefined;
    fillRule?: "nonzero" | "evenodd" | "inherit" | undefined;
    filter?: string | undefined;
    filterRes?: number | string | undefined;
    filterUnits?: number | string | undefined;
    floodColor?: number | string | undefined;
    floodOpacity?: number | string | undefined;
    focusable?: Booleanish | "auto" | undefined;
    fontFamily?: string | undefined;
    fontSize?: number | string | undefined;
    fontSizeAdjust?: number | string | undefined;
    fontStretch?: number | string | undefined;
    fontStyle?: number | string | undefined;
    fontVariant?: number | string | undefined;
    fontWeight?: number | string | undefined;
    format?: number | string | undefined;
    from?: number | string | undefined;
    fx?: number | string | undefined;
    fy?: number | string | undefined;
    g1?: number | string | undefined;
    g2?: number | string | undefined;
    glyphName?: number | string | undefined;
    glyphOrientationHorizontal?: number | string | undefined;
    glyphOrientationVertical?: number | string | undefined;
    glyphRef?: number | string | undefined;
    gradientTransform?: string | undefined;
    gradientUnits?: string | undefined;
    hanging?: number | string | undefined;
    horizAdvX?: number | string | undefined;
    horizOriginX?: number | string | undefined;
    href?: string | undefined;
    ideographic?: number | string | undefined;
    imageRendering?: number | string | undefined;
    in2?: number | string | undefined;
    in?: string | undefined;
    intercept?: number | string | undefined;
    k1?: number | string | undefined;
    k2?: number | string | undefined;
    k3?: number | string | undefined;
    k4?: number | string | undefined;
    k?: number | string | undefined;
    kernelMatrix?: number | string | undefined;
    kernelUnitLength?: number | string | undefined;
    kerning?: number | string | undefined;
    keyPoints?: number | string | undefined;
    keySplines?: number | string | undefined;
    keyTimes?: number | string | undefined;
    lengthAdjust?: number | string | undefined;
    letterSpacing?: number | string | undefined;
    lightingColor?: number | string | undefined;
    limitingConeAngle?: number | string | undefined;
    local?: number | string | undefined;
    markerEnd?: string | undefined;
    markerHeight?: number | string | undefined;
    markerMid?: string | undefined;
    markerStart?: string | undefined;
    markerUnits?: number | string | undefined;
    markerWidth?: number | string | undefined;
    mask?: string | undefined;
    maskContentUnits?: number | string | undefined;
    maskUnits?: number | string | undefined;
    mathematical?: number | string | undefined;
    mode?: number | string | undefined;
    numOctaves?: number | string | undefined;
    offset?: number | string | undefined;
    opacity?: number | string | undefined;
    operator?: number | string | undefined;
    order?: number | string | undefined;
    orient?: number | string | undefined;
    orientation?: number | string | undefined;
    origin?: number | string | undefined;
    overflow?: number | string | undefined;
    overlinePosition?: number | string | undefined;
    overlineThickness?: number | string | undefined;
    paintOrder?: number | string | undefined;
    panose1?: number | string | undefined;
    path?: string | undefined;
    pathLength?: number | string | undefined;
    patternContentUnits?: string | undefined;
    patternTransform?: number | string | undefined;
    patternUnits?: string | undefined;
    pointerEvents?: number | string | undefined;
    points?: string | undefined;
    pointsAtX?: number | string | undefined;
    pointsAtY?: number | string | undefined;
    pointsAtZ?: number | string | undefined;
    preserveAlpha?: Booleanish | undefined;
    preserveAspectRatio?: string | undefined;
    primitiveUnits?: number | string | undefined;
    r?: number | string | undefined;
    radius?: number | string | undefined;
    refX?: number | string | undefined;
    refY?: number | string | undefined;
    renderingIntent?: number | string | undefined;
    repeatCount?: number | string | undefined;
    repeatDur?: number | string | undefined;
    requiredExtensions?: number | string | undefined;
    requiredFeatures?: number | string | undefined;
    restart?: number | string | undefined;
    result?: string | undefined;
    rotate?: number | string | undefined;
    rx?: number | string | undefined;
    ry?: number | string | undefined;
    scale?: number | string | undefined;
    seed?: number | string | undefined;
    shapeRendering?: number | string | undefined;
    slope?: number | string | undefined;
    spacing?: number | string | undefined;
    specularConstant?: number | string | undefined;
    specularExponent?: number | string | undefined;
    speed?: number | string | undefined;
    spreadMethod?: string | undefined;
    startOffset?: number | string | undefined;
    stdDeviation?: number | string | undefined;
    stemh?: number | string | undefined;
    stemv?: number | string | undefined;
    stitchTiles?: number | string | undefined;
    stopColor?: string | undefined;
    stopOpacity?: number | string | undefined;
    strikethroughPosition?: number | string | undefined;
    strikethroughThickness?: number | string | undefined;
    string?: number | string | undefined;
    stroke?: string | undefined;
    strokeDasharray?: string | number | undefined;
    strokeDashoffset?: string | number | undefined;
    strokeLinecap?: "butt" | "round" | "square" | "inherit" | undefined;
    strokeLinejoin?: "miter" | "round" | "bevel" | "inherit" | undefined;
    strokeMiterlimit?: number | string | undefined;
    strokeOpacity?: number | string | undefined;
    strokeWidth?: number | string | undefined;
    surfaceScale?: number | string | undefined;
    systemLanguage?: number | string | undefined;
    tableValues?: number | string | undefined;
    targetX?: number | string | undefined;
    targetY?: number | string | undefined;
    textAnchor?: string | undefined;
    textDecoration?: number | string | undefined;
    textLength?: number | string | undefined;
    textRendering?: number | string | undefined;
    to?: number | string | undefined;
    transform?: string | undefined;
    u1?: number | string | undefined;
    u2?: number | string | undefined;
    underlinePosition?: number | string | undefined;
    underlineThickness?: number | string | undefined;
    unicode?: number | string | undefined;
    unicodeBidi?: number | string | undefined;
    unicodeRange?: number | string | undefined;
    unitsPerEm?: number | string | undefined;
    vAlphabetic?: number | string | undefined;
    values?: string | undefined;
    vectorEffect?: number | string | undefined;
    version?: string | undefined;
    vertAdvY?: number | string | undefined;
    vertOriginX?: number | string | undefined;
    vertOriginY?: number | string | undefined;
    vHanging?: number | string | undefined;
    vIdeographic?: number | string | undefined;
    viewBox?: string | undefined;
    viewTarget?: number | string | undefined;
    visibility?: number | string | undefined;
    vMathematical?: number | string | undefined;
    widths?: number | string | undefined;
    wordSpacing?: number | string | undefined;
    writingMode?: number | string | undefined;
    x1?: number | string | undefined;
    x2?: number | string | undefined;
    x?: number | string | undefined;
    xChannelSelector?: string | undefined;
    xHeight?: number | string | undefined;
    xlinkActuate?: string | undefined;
    xlinkArcrole?: string | undefined;
    xlinkHref?: string | undefined;
    xlinkRole?: string | undefined;
    xlinkShow?: string | undefined;
    xlinkTitle?: string | undefined;
    xlinkType?: string | undefined;
    xmlBase?: string | undefined;
    xmlLang?: string | undefined;
    xmlns?: string | undefined;
    xmlnsXlink?: string | undefined;
    xmlSpace?: string | undefined;
    y1?: number | string | undefined;
    y2?: number | string | undefined;
    y?: number | string | undefined;
    yChannelSelector?: string | undefined;
    z?: number | string | undefined;
    zoomAndPan?: string | undefined;
  }

  // cloneElement
  function cloneElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
    element: DetailedReactHTMLElement<P, T>,
    props?: P,
    ...children: ReactNode[]
  ): DetailedReactHTMLElement<P, T>;

  function cloneElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
    element: ReactHTMLElement<T>,
    props?: P,
    ...children: ReactNode[]
  ): ReactHTMLElement<T>;

  function cloneElement<P extends SVGAttributes<T>, T extends SVGElement>(
    element: ReactSVGElement,
    props?: P,
    ...children: ReactNode[]
  ): ReactSVGElement;

  function cloneElement<P extends DOMAttributes<T>, T extends Element>(
    element: DOMElement<P, T>,
    props?: DOMAttributes<T> & P,
    ...children: ReactNode[]
  ): DOMElement<P, T>;

  function cloneElement<P>(
    element: FunctionComponentElement<P>,
    props?: Partial<P> & Attributes,
    ...children: ReactNode[]
  ): FunctionComponentElement<P>;

  function cloneElement<P, T extends Component<P, ComponentState>>(
    element: CElement<P, T>,
    props?: Partial<P> & ClassAttributes<T>,
    ...children: ReactNode[]
  ): CElement<P, T>;

  function cloneElement<P>(
    element: ReactElement<P>,
    props?: Partial<P> & Attributes,
    ...children: ReactNode[]
  ): ReactElement<P>;

  // createContext
  function createContext<T>(defaultValue: T): Context<T>;

  // isValidElement
  function isValidElement<P>(
    object: {} | null | undefined
  ): object is ReactElement<P>;

  // Children utilities
  interface ReactChildren {
    map<T, C>(
      children: C | ReadonlyArray<C>,
      fn: (child: C, index: number) => T
    ): C extends null | undefined
      ? C
      : Array<Exclude<T, boolean | null | undefined>>;
    forEach<C>(
      children: C | ReadonlyArray<C>,
      fn: (child: C, index: number) => void
    ): void;
    count(children: any): number;
    only<C>(children: C): C extends any[] ? never : C;
    toArray(
      children: ReactNode | ReactNode[]
    ): Array<Exclude<ReactNode, boolean | null | undefined>>;
  }

  const Children: ReactChildren;

  // Fragment
  const Fragment: ExoticComponent<{ children?: ReactNode | undefined }>;

  // StrictMode
  const StrictMode: ExoticComponent<{ children?: ReactNode | undefined }>;

  // Suspense
  interface SuspenseProps {
    children?: ReactNode | undefined;
    fallback?: ReactNode;
  }

  const Suspense: ExoticComponent<SuspenseProps>;

  // Lazy
  function lazy<T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>
  ): LazyExoticComponent<T>;

  interface LazyExoticComponent<T extends ComponentType<any>>
    extends ExoticComponent<ComponentPropsWithRef<T>> {
    readonly _result: T;
  }
}

// JSX namespace declaration
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }
    interface ElementAttributesProperty {
      props: {};
    }
    interface ElementChildrenAttribute {
      children: {};
    }
    interface IntrinsicAttributes extends React.Attributes {}
    interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> {}

    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
