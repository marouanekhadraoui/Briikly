declare function zro ( ...elements: Array<Zero, Array, string, HTMLElement, SVGElement> ): Zero;
declare namespace zro {
    function get ( ...items: Array<string> ): Get;
    function tog ( ...items: Array<string> ): Toggle;
    const b: Zero;
    const h: Zero;
    const d: Zero;
    const win: Zero;
}
type csss = Record<keyof CSSStyleDeclaration, string>;
declare namespace Zero { 
    class Get { 
        constructor ( ...items: Array<string> ): Zero;
    }
    class Toggle { 
        constructor ( ...items: Array<string> ): Zero;
    }
}
declare class Zero extends Set<Element> {

    static readonly canZoom: boolean;

    i ( index: number  ): Zero;
    zro ( ...elements: Array<Zero, Array, string, HTMLElement, SVGElement> ): Zero
    readonly free: Array<HTMLElement | SVGElement>

    each<R, FN extends ( this: Zero, element: HTMLElement | SVGElement, index: number, res: R ) => R> ( fn: FN, def: Array ): Array<R>
    loop<R, FN extends ( this: Zero, element: HTMLElement | SVGElement, index: number, res: R ) => R> ( fn: FN, def: Array ): Zero

    class<T extends "set" | "tog" | "rem" | "has" | "get"> ( v: string | string[], t: T, index: number ): T extends "get" ? string | string[] : T extends "has" ? boolean : Zero 
    css<T extends csss | string[] | typeof Zero.Get>( v: T ): T  extends ( csss | string[]) ? Zero : string[][];
    attr<T extends Record<string, string> | string[] | typeof Zero.Get>( v: T ): T extends ( string | string[]) ? Zero : string[][]
    rem (): Zero

    add ( elem: HTMLElement | SVGElement | Array | Set | Zero ): Zero
    addE ( elem: string, params: { css:  csss, attr: Record<string, string>, t: number, html: string, text: string } ): Zero
    addH ( html: string, position: "before" | "after" | number ): Zero

    txt ( text: string ): Zero;
    tml ( html: string ): Zero;
    val ( html: boolean ): string [];

    on<EV extends keyof HTMLElementEventMap | "zoom"> ( event: EV, fn: ( this: Zero, event: EV extends "zoom" ? WheelEvent : HTMLElementEventMap [EV], element: HTMLElement | SVGElement, index: number ) => void, options: AddEventListenerOptions ): Zero


    width ( index: number ): number;
    height ( index: number ): number;
    top ( index: number ): number;
    left ( index: number ): number;
    right ( index: number ): number;
    bottom ( index: number ): number;

    focus ( index: number ): Zero;
    blur ( index: number ): Zero;
    dadOf ( ...selectors: Array<Zero, Array, string, HTMLElement, SVGElement> ): boolean;
    
}