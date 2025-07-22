let zro_map = new Map,
    zro_dom = new Map,
    siz_map = new Map,
    siz_obs = new ResizeObserver ( ( obxs, obse ) => {
        obxs.forEach ( obs => {
            ( siz_map.get ( obs.target ) || [] ).forEach ( fn => fn( obs, obse ) );
        } );
    } );
/**
 * 
 * @param  {...any} elements 
 * @returns {Zero}
 */
function zro ( ...elements ) {
    return new zro.Zero ( zro.Zero.def ( elements ), zro );
}
class Zero extends Set {
    static Get = class Get {
        constructor ( ...props ) {
            this.props = props
        }
    }
    static Toggle = class Toggle {
        constructor ( ...props ) {
            this.props = [ ...new Set ( props ) ]
        }
    }


    static def ( elems, document = zro.document ) {
        let res = [];
        for ( const elem of elems ) {
            if ( typeof elem == "string" ) {
                res.push ( ...document.querySelectorAll ( elem ) );
            }
            else if ( Array.isArray ( elem ) || elem instanceof Set ) {
                res.push ( ...Zero.def ( elem ) );
            }
            else if ( elem instanceof Zero ) {
                res.push ( ...elem );
            }
            else if ( elem instanceof Element ) {
                res.push ( elem );
            }
        }
        return res;
    }
    static def_x ( elems ) {
        let res = [];
        for ( const el of elems ) {
            try {
                this.each ( e => {
                    if ( typeof el == "string" ) {
                        res.push ( ...e.querySelectorAll ( el ) );
                    }
                    else if ( el instanceof Element ) {
                        if ( e.contains ( el ) ) {
                            res.push ( el );
                        }
                    }
                    else if ( Array.isArray ( el ) || el instanceof Set || el instanceof Zero || el instanceof NodeList
                        ||el instanceof  HTMLAllCollection || el instanceof HTMLCollection ) {
                        res.push ( Zero.def_x.call ( this, el ) );
                    }
                } );
            } catch (el) {

            }
        }
        return res.flat ( Infinity );
    }
    static def_b ( elems ) {
        let res = [];
        for ( const el of elems ) {
            try {
                this.each ( e => {
                    if ( typeof el == "string" ) {
                        res.push ( ...e.querySelectorAll ( el ) );
                    }
                    else if ( el instanceof Element ) {
                        if ( e.contains ( el ) ) {
                            res.push ( el );
                        }
                    }
                    else if ( Array.isArray ( el ) || el instanceof Set || el instanceof Zero || el instanceof NodeList
                        || el instanceof  HTMLAllCollection || el instanceof HTMLCollection ) {
                        res.push ( Zero.def_x.call ( this, el ) );
                    }
                    else if ( typeof el === "number" ) {
                        res.push ( e.children [ el ] );
                    }
                } );
            } catch (el) {

            }
        }
        return res.flat ( Infinity );
    }
    static addE ( elem, { css, attr, text, html, t } = {}, document = zro.document ) {
        let ns = /#NAMESPACE-_DEfineR/,
            tns;
        Base.or ( ns, ( [ k, v ] ) => {
            if ( Base.has ( v, elem ) ) {
                tns = k;
                return true;
            }
            return false;
        } );
        elem = zro ( typeof tns == "string" ? document.createElementNS ( tns, elem ) : document.createElement ( elem ) );
        elem.css ( css ).attr ( attr );
        if ( html ) {
            elem.tml ( html );
        }
        else {
            elem.txt ( text );
        }
        return elem.free [ 0 ];
    }
    static free ( zero ) {
        return zro_map.delete ( zero );
    }
    static onresize ( elems, fn ) {
        elems.forEach ( el => {
            if ( siz_map.has ( el ) ) {
                siz_map.get ( el ).add ( fn );
            }
            else {
                siz_map.set ( el, new Set ().add ( fn ) );
            }
            siz_obs.observe ( el );
        } );
    }

    constructor ( elements = [], zero ) {
        super ();
        for ( const element of elements ) {
            base.bx.funx.Set.add.call ( this, element );
        }
        zro_dom.set ( this, zero );
    }
    /**
     * @returns {Array<HTMLElement | SVGElement>}
    */
    get free () {
        return [ ...this ];
    }
    /**
     * 
     * @param { ( this: Zero, element: HTMLElement, i: number, array: Array<any> ) => any } fn 
     * @returns 
     */
    each ( fn, def ) {
        let res = Base.tp ( def, "arrr" ) ? def : [];
        for ( const element of this ) {
            res.push ( fn.call ( this, element, res.length, res ) );
        }
        return res;
    }
    /**
     * 
     * @param { ( this: Zero, element: HTMLElement, i: number, array: Array<any> ) => any } fn 
     * @returns {Array<any>}
     */
    loop ( fn, def ) {
        let res = Base.tp ( def, "arrr" ) ? def : [];
        for ( const element of this ) {
            res.push ( fn.call ( this, element, res.length, res ) );
        }
        return this;
    }
    class ( v, t = "set", i ) {
        if ( t === "set" || t === true ) {
            v = Base.toArr ( v );
            if ( i === undefined ) {
                this.each ( e => e.classList.add ( v ) );
            }
            else {
                if ( typeof i === "number" ) {
                    i = [ i ];
                }
                i.forEach ( ii => this.free [ ii ] instanceof Element ? this.free [ ii ].classList.add ( v ) : null );
            }
        }
        else if ( t === "rem" || t === false ) {
            v = Base.toArr ( v );
            if ( i === undefined ) {
                this.each ( e => e.classList.remove ( v ) );
            }
            else {
                if ( typeof i === "number" ) {
                    i = [ i ];
                }
                i.forEach ( ii => this.free [ ii ] instanceof Element ? this.free [ ii ].classList.remove ( v ) : null );
            }
        }
        else if ( t === "tog" ) {
            v = Base.toArr ( v );
            if ( i === undefined ) {
                this.each ( e => v.forEach ( t => e.classList.toggle ( t ) ) );
            }
            else {
                if ( typeof i === "number" ) {
                    i = [ i ];
                }
                i.forEach ( ii => v.forEach ( t => this.free [ ii ] instanceof Element ? this.free [ ii ].classList.toggle ( t ) : null ) );
            }
        }
        else if ( t === "get" ) {
            v = parseInt ( v );
            return this.free [ v == NaN ? i ?? 0 : v ].className;
        }
        else {
            i = i || 0;
            return this.free [ i ] instanceof Element ? this.free [ i ].classList.contains ( v ) : null;
        }
        return this;
    }
    css ( obj ) {
        if ( Array.isArray ( obj ) ) {
            obj.forEach ( k => this.each ( e => e.style.removeProperty ( k ) ) );
        }
        else if ( obj instanceof Zero.Get ) {
            return this.each ( e => {
                let stl = getComputedStyle ( e );
                return obj.props.map ( k => stl [ k ] );
            } );
        }
        else {
            for ( const k in obj ) {
                if ( obj.hasOwnProperty( k ) ) {
                    this.each ( e => e.style [ k ] = obj [ k ] );
                }
            }
        }
        return this;
    }
    attr ( obj ) {
        if ( Array.isArray ( obj ) ) {
            obj.forEach ( k => this.each ( e => e.removeAttribute ( k ) ) );
        }
        else if ( obj instanceof Zero.Get ) {
            return obj.props.map ( k => this.each ( e => e.getAttribute ( k ) ) );
        }
        else {
            for ( const k in obj ) {
                if ( obj.hasOwnProperty( k ) ) {
                    this.each ( e => e.setAttribute ( k, obj [ k ] ) );
                }
            }
        }
        return this;
    }
    rem () {
        this.each ( ( e => e.remove () ) );
        return this;
    }
    add ( elem ) {
        if ( elem == globalThis ) {
            Set.prototype.add.call ( this, elem );
            return;
        }
        if ( Base.tp ( elem, HTMLElement, SVGElement ) ) {
            let res;
            if ( Base.tp ( elem, "arr", Set ) ) {
                res = [ ...elem ];
            }
            else {
                res = [ elem ];
            }
            this.each ( ( e, i ) => {
                e.append ( ...res );
                if ( i == 0 ) return;
                res.push ( res.map ( e => e.cloneNode ( true ) ) );
            } );
            return res;
        }
        // else if ( Base.tp ( elem, manager.fns.Block ) ) {
        //     let res = [];
        //     this.each ( e => {
        //         let elemBlock = elem.build ();
        //         e.append ( ...elemBlock );
        //         res.push ( elemBlock );
        //     } );
        //     return res;
        // }
    }
    /**
     * 
     * @param {string} elem 
     * @param {{ css: object, t: number }} param1 
     */
    addE ( elem, { css = {}, attr = {}, attr$env, t = 1, html, text } = {} ) {
        elem = Zero.addE ( elem, { css, attr, html, text }, zro_dom.get ( this ).document );
        let res = [];
        this.each ( e => {
            let r = [];
            for (let i = 0; i < t; i++) {
                r.push ( elem.cloneNode ( true ) );
            }
            e.append ( ...r );
            res.push ( ...r );
        } )
        return zro ( res );
    }
    addH ( html, p0 ) {
        html = Base.tp ( html, "str" ) ? html : html.join ( "" );
        let t = document.createElement ( "div" );
        t.innerHTML = html;
        let elems = [ ...t.children ];
        if ( typeof p0 != "number" ) {
            p0 = Base.is ( p0, "b", "before" ) ? 0 : Infinity;
        }
        return zro ( this.each ( e => {
            let res = [];
            for ( let i = 0; i < elems.length; i++ ) {
                let c = e.children,
                    el  = elems [ i ].cloneNode ( true ),
                    ii = i + p0;
                e.insertBefore ( el, c [ ii > c.length ? c.length : ii ] )
                res.push ( el );
            }
            return res;
        } ) );
    }
    i ( i ) {
        return zro ( this.free [ i ] );
    }
    on ( ev, fn, ...options ) {
        Base.toArr ( ev ).forEach ( evv => {
            if ( evv === "resize" && this.free [ 0 ] !== window ) {
                Zero.onresize ( this, fn );
            }
            this.each ( ( e, i ) => { 
                e.addEventListener ( evv, ev => fn.call ( this, ev, e, i ), ...options );
            } )
        } );
        return this;
    }
    do ( ev, options ) {
        this.each ( e => {
            e.dispatchEvent (  ev instanceof Event ? ev : new Event ( ev, options ) );
        } );
        return this;
    }
    onSleep ( fn, delay = 1000 ) {
        this.each ( ( e, i ) => {
            let id;
            let fnx = ( ev ) => {
                fn.call ( this, ev, e, i );
            }
            e.addEventListener ( "mouseenter", ev => id = setTimeout ( fnx, delay, ev ) );
            e.addEventListener ( "mousemove", ev => {
                clearTimeout ( id );
                id = setTimeout ( fnx, delay, ev );
            } );
            e.addEventListener ( "click", ev => {
                clearTimeout ( id );
                id = setTimeout ( fnx, delay, ev );
            } );
            e.addEventListener ( "mouseleave", () => clearTimeout ( id ) );
        } );
        return this;
    }
    zro ( ...elements ) {
        return new Zero ( Zero.def_x.call ( this, elements ) );
    }
    bro ( ...elements ) {
        return new Zero ( Zero.def_b.call ( this.dad, elements ) );
    }
    get dad () {
        let dd = new Zero;
        this.each ( el => {
            Set.prototype.add.call ( dd, el.parentElement );
        } );
        return dd;
    }
    txt ( text ) {
        this.each ( e => {
            if ( e.tagName === "INPUT" || e.tagName === "TEXTAREA" ) {
                e.value = text;
            }
            else {
                e.textContent = text;
                
            }
        } );
        return this;
    }
    val ( isHTML = false ) {
        let res = this.each ( ( e ) => {
            if ( e.tagName === "INPUT" || e.tagName === "TEXTAREA" ) {
                return e.value;
            }
            else {
                return isHTML ? e.innerHTML : e.textContent;
            }
        } );
        if ( res.length === 1 ) {
            res = res [ 0 ];
        }
        return res
    }
    tml ( html ) {
        this.each ( e => e.innerHTML = html );
        return this;
    }
    width ( i = 0 ) {
        return this.me ( i ).width;
    }
    height ( i = 0 ) {
        return this.me ( i ).height;
    }
    me ( i = 0 ) {
        return this.free [ i ].getBoundingClientRect ();
    }
    top ( i = 0 ) {
        return this.me ( i ).top;
    }
    left ( i = 0 ) {
        return this.me ( i ).left;
    }
    right ( i = 0 ) {
        return this.me ( i ).right;
    }
    bottom ( i = 0 ) {
        return this.me ( i ).bottom;
    }
    focus ( i = 0 ) {
        this.free [ i ].focus ();
        return this;
    }
    blur ( i = 0 ) {
        this.free [ i ].blur ();
        return this;
    }
    set data ( d ) {
        zro_map.set ( this, d );
    }
    get data () {
        return zro_map.get ( this );
    }
    dadOf ( ...selector ) {
        return Base.or ( zro ( selector ), s => Base.or ( this, d => d.contains ( s ) ) );
    }
}
zro.Zero = Zero
Base.ice ( zro, { document,
    get ( ...props ) {
        return new Zero.Get ( ...props );
    },
    css ( obj ) {
        if ( Array.isArray ( obj ) ) {
            obj.forEach ( k => document.documentElement.style.removeProperty ( k ) );
        }
        else {
            for ( const k in obj ) {
                if ( obj.hasOwnProperty( k ) ) {
                    document.documentElement.style.setProperty ( k, obj [ k ] );
                }
            }
        }
    }
} );
zro.win = zro ();
zro.win.add ( window );
zro.d = zro ( "html" );
zro.h = zro ( "head" );
zro.b = zro ( "body" );
Base.ice ( zro, {
    b: zro.b,
    h: zro.h,
    d: zro.h,
    win: zro.win,
    simulation ( dcmt ) {
        let _ = zro,
            doc = dcmt || new Document,
            html = doc.createElement ( "html" ),
            head = doc.createElement ( "head" ),
            body = doc.createElement ( "body" );
            if ( !( dcmt instanceof Document ) ) {
                html.append ( head, body );
                doc.append ( html );                    
            }
        let z = function zro ( ...elements ) {
            return new zro.Zero ( _.Zero.def ( elements, doc ), zro );
        }
        z.Zero = _.Zero;
        Base.ice ( z, { document: doc, css ( obj ) {
            if ( Array.isArray ( obj ) ) {
                    obj.forEach ( k => doc.documentElement.style.removeProperty ( k ) );
                }
                else {
                    for ( const k in obj ) {
                        if ( obj.hasOwnProperty( k ) ) {
                            doc.documentElement.style.setProperty ( k, obj [ k ] );
                        }
                    }
                }
        } } )
        Base.ice ( z, {
            b: zro ( body ),
            h: zro ( head ),
            d: zro ( html ),
            win: z ().add ( window ),
        } )
        return z;
    },
    get focus () {
        return zro.document.activeElement;
    }
    /*
        zro.batch ( () => {
            zro.send ( a,b,c )
            zro.get ( d,e )
        } ); // zro.batch will send: { type: "batch", [ { type: "send", id: #ID, way: a, data: b }, { type: "get", id: #ID, way: a } ]}
    */
} );