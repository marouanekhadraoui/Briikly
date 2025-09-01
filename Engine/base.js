function base ( any ) {
    return _BASE ( any );
}

let baseMe = new Map ();
class Base {
    static ice ( item, o, deep ) {
        return functions.set.ice ( item, o, deep );
    }
    static optc ( item, ...p ) {
        return functions.set.optc ( item, p );
    }
    static isReal ( item, ...o ) {
        return functions.set.isReal ( item, o );
    }

    //#region Manage
    constructor ( any ) {
        baseMe.set ( this, { me: [ any ], index: 0 } );
    }
    get me () {
        let g = baseMe.get ( this );
        return Base.optc ( g, "me", Base.optc ( g, "index" ) );
    }
    set me ( me ) {
        this.exe ( "me", me );
    }
    exe ( c, ...args ) {
        let g = baseMe.get ( this );
        if ( g === undefined ) {
            throw "This base is free";
        }
        else {
            if ( c === "me" ) {
                g.me.push ( args [ 0 ] );
            }
            else if ( functions.ver.is ( c, [
                "def", "ice",
                //
                "is", "are", "arek", "has", "hask",
                "tp", "aretp", "arektp", "hastp", "hasktp",
                "lik", "likand", "likor",
                "eq", "eqand", "eqor",
                "isReal",
                //
                "just", "justk", "justtp", "justktp",
                "justn", "justnk", "justntp", "justnktp",
                //
                "toArr", "toDo",
                //
                "if", "ifProm", "when", "whenProm",
                //
                "and", "or", "do", "each", "loop", "while",
                "andProm", "orProm", "doProm", "eachProm", "loopProm", "whileProm",


            ] ) ) {
                g.me.append ( this [ c ] ( ...args ) );
            }
            else {
                g.me.append ( this [ c ] );
            }
            g.me.index++;
            return this;
        }
    }
    free () {
        baseMe.delete ( this );
    }
    //#endregion
    



}

class XMath {

}

class XCrypto {

}

class XFile {

}


const 
bx = {
    verfication: {
        math: {}
    },
    free: {
        get math () {
            return defines.math;
        },
        get int () {
            return defines.int;
        },
        get matrix () {
            return defines.matrix;
        },
        get crypto () {
            return defines.crypto;
        }
    },
    ERR: {
        log: class LogicalError extends Error {
            constructor ( message ) {
                super ( message );
                this.name = 'LogicalError';
            }
        }
    },
    $CreateError ( name, fn ) {
        return ( new Function ( "fn",
`return class ${ name } extends Error {
constructor ( message ) {
    super ( message );
    this.name = '${ name }';
    this.message = fn ( this );
}
}` ) ( fn ) );
    },
    errs: new Map ( [
            [ "err", Error ],
            [ "eval", EvalError ],
            [ "rng", RangeError ],
            [ "ref", ReferenceError ],
            [ "syn", SyntaxError ],
            [ "type", TypeError ],
            [ "uri", URIError ],
            [ "", "def" ],
            [ undefined, "def" ],
            [ null, "def" ]
    ] ),
    just ( props = {}, fn ) {
        let s = {};
        if ( typeof props === "object" && props !== null ) {
            for ( const k in props ) {
                if ( props.hasOwnProperty ( k ) ) {
                    s [ k ] = this [ k ];
                    this [ k ] = props [ k ];
                }
            }
        }
        else throw new TypeError ( "Unvalid Type." );
        let res,
            rest = () => {
                for ( const k in s ) {
                    if ( s.hasOwnProperty ( k ) ) {
                        this [ k ] = s [ k ];
                    }
                }
            };
        try {
            res = fn ();
            rest (); // restore
        }
        catch ( err ) {
            rest (); // restore
            throw err;
        }
        return res;
    },
    global: this,
    funx: {
        Map: {},
        Set: {}
    }
},
functions = {
    "_": { // _Nones Methods
        optx ( item, obj ) {
            let r;
            
            for ( const k in obj ) {
                if ( obj.hasOwnProperty ( k ) ) {
                    r = item [ k ];
                    if ( r !== undefined ) {
                        return functions.set.optc ( r, Array.isArray ( obj [ k ] ) ? obj [ k ] : [ obj [ k ] ] );
                    }
                }
            }
        },
        key ( item ) {
            if ( Array.isArray ( item ) ) item = functions.crt.arr ( item.length, i => i );
            else if ( typeof item === "object" && item !== null )
                item = Object.keys ( item );
            else if ( item instanceof Map ) {
                item = item.keys ()
            }
            return [ ...new Set ( item ) ];
        },
        val ( item ) {
            if ( Array.isArray ( item ) );
            else if ( typeof item === "object" && item !== null )
                item = Object.values ( item );
            else if ( item instanceof Map ) {
                item = item.values ()
            }
            return [ ...new Set ( item ) ];
        },
        iss ( item, ares ) {
            if ( item.length === 0 ) {
                return false;
            }
            let t = true;
            for ( let i = 0; i < item.length && t; i++ ) {
                t = functions.ver.is ( item [ i ], ares );
            }
            return t;
        },
        isx ( item, hax ) {
            let t = false;
            for ( let i = 0; i < item.length && !t; i++ ) {
                t = functions.ver.is ( item [ i ], hax );
            }
            return t;
        },
        tps ( item, types ) {
            if ( item.length === 0 ) {
                return false;
            }
            let t = true;
            for ( let i = 0; i < item.length && t; i++ ) {
                t = functions.ver.tp ( item [ i ], types );
            }
            return t;
        },
        tpx ( item, types ) {
            let t = false;
            for ( let i = 0; i < item.length && !t; i++ ) {
                t = functions.ver.tp ( item [ i ], types );
            }
            return t;
        },
        sametp ( a, b ) {
            return (
                functions.set.optc ( a, "constructor" ) === functions.set.optc ( b, "constructor" ) &&
                typeof a == "object" && typeof b == "object" && a !== null
            );
        },
        dpComp ( a, b ) {
            if ( a === b ) {
                return true;
            }
            if (
                typeof a !== typeof b || 
                a === null || b === null || typeof a !== "object" ||
                functions.set.optc ( a, "constructor" ) !== functions.set.optc ( b, "constructor" )
            ) {
                return false;
            }
            if ( Array.isArray ( a ) && Array.isArray ( b ) ) {
                return this.arrlik ( a, b );
            }
            if ( a instanceof Map && b instanceof Map ) {
                if ( a.size !== b.size ) {
                    return false;
                }
                for (let [key, value] of a) {
                    if ( !b.has ( key ) || !this.dpComp ( value, b.get ( key ) ) ) {
                        return false;
                    }
                }
            return true;
            }
            if ( a instanceof Set && b instanceof Set ) {
                if ( a.size !== b.size ) {
                    return false;
                }
                for ( let va of a ) {
                    if ( ![ ...b ].some ( vb => this.dpComp ( va, vb ) ) ) {
                        return false;
                    }
                }
                return true;
            }
            const ka = Object.keys ( a );
            const kb = Object.keys ( b );
        
            if ( ka.length !== kb.length ) {
                return false;
            }
        
            for ( let k of ka ) {
                if ( !this.dpComp ( a [ k ], b [ k ] ) ) {
                    return false;
                }
            }
        
            return true;
        },
        arrlik ( arr1, arr2 ) {
            if (arr1.length !== arr2.length) {
                return false;
            }
            
            const used = new Set();
            
            for ( let v of arr1 ) {
                let found = false;
                for ( let i = 0; i < arr2.length; i++ ) {
                    if ( !used.has ( i ) && this.dpComp ( v, arr2 [ i ] ) ) {
                        used.add ( i );
                        found = true;
                        break;
                    }
                }
                if ( !found ) {
                    return false;
                }
            }
            
            return true;
        },
        dpEq ( a, b ) {
            if (
                typeof a !== typeof b || 
                a === null || b === null
            ) {
                return false;
            }
            if ( a === a ) {
                return true;
            }
            if ( Array.isArray ( a ) ) {
                if ( a.length !== b.length ) return false;
                let t = true;
                for ( let i = 0; i < a.length && t; i++ ) {
                    t = this.dpEq ( a [ i ], b [ i ] );
                }
                return t;
            }
            else {
                let t = a instanceof Set ? "val" : "ent";
                return this.dpEq ( functions.ext [ t ] ( a ), functions.ext [ t ] ( b ) )
            }
        },


        crypto: crypto
    },

    bon: { // (javascript or base) object notation
        str ( obj ) {
            if ( obj === undefined ) {
                return obj + "";
            }
            else if ( typeof obj === "object" ) {
                return JSON.stringify ( obj );
            }
            else {
                return obj.toString ();
            }
        },
        obj ( str ) {
            if ( str === "undefined" ) {
                return undefined;
            }
            return JSON.parse ( str );
        },
        send ( obj ) {
            function conv ( o ) {
                if ( typeof o == "string" ) {
                    if ( bx.bon.includes ( "str" ) ) {
                        return "str" + o;
                    }
                    else {
                        throw "this type is illegal.";
                    }
                }
                else if ( isNaN ( o ) && o + "" === "NaN" ) {
                    if ( bx.bon.includes ( "nan" ) ) {
                        return "nan";
                    }
                    else {
                        throw "this type is illegal.";
                    }
                }
                else if ( typeof o == "number" && 1 / o === 0 ) {
                    if ( bx.bon.includes ( "inf" ) ) {
                        return "in" + ( o > 0 ? "+" : "-" );
                    }
                    else {
                        throw "this type is illegal.";
                    }
                }
                else if ( typeof o == "number" ) {
                    if ( bx.bon.includes ( "num" ) ) {
                        return "num" + o;
                    }
                    else {
                        throw "this type is illegal.";
                    }
                }
                else if ( typeof o == "boolean" ) {
                    if ( bx.bon.includes ( "bool" ) ) {
                        return "bo" + ( o ? 1 : 0 );
                    }
                    else {
                        throw "this type is illegal.";
                    }
                }
                else if ( typeof o == "undefined" ) {
                    if ( bx.bon.includes ( "not" ) ) {
                        return "not";
                    }
                    else {
                        throw "this type is illegal.";
                    }
                }
                else if ( o == null ) {
                    if ( bx.bon.includes ( "nul" ) ) {
                        return "nul";
                    }
                    else {
                        throw "this type is illegal.";
                    }
                }
                else if ( o instanceof RegExp ) {
                    if ( bx.bon.includes ( "rgx" ) ) {
                        return 'rgx' + o.flags + '/' + o.source;
                    }
                    else {
                        throw "this type is illegal.";
                    }
                }
                else if ( typeof o == "function" ) {
                    if ( bx.bon.includes ( "fun" ) ) {
                        return "fun" + functions.bon.str ( o );
                    }
                    else {
                        throw "this type is illegal.";
                    }
                }
                else if ( o instanceof Date ) {
                    if ( bx.bon.includes ( Date ) ) {
                        return "dat" + o;
                    }
                    else {
                        throw "this type is illegal.";
                    }
                }
                else if ( Array.isArray ( o ) ) {
                    if ( bx.bon.includes ( "arr" ) ) {
                        let ar = [];
                        for ( const e of o ) {
                            ar.push ( conv ( e ) );
                        }
                        return ar;
                    }
                    else {
                        throw "this type is illegal.";
                    }
                }
                else if ( typeof o == "object" ) {
                    let ob = {};
                    if ( bx.bon.includes ( "obj" ) ) {
                        for ( const k in o ) {
                            if ( o.hasOwnProperty ( k ) ) {
                                ob [ k ] = conv ( o [ k ] );
                            }
                        }
                        return ob;
                    }
                    else {
                        throw "this type is illegal.";
                    }
                }
                else return undefined;
            }
            return this.str ( conv ( obj ) );
        },
        get ( str ) {
            function conv ( o ) {
                let t;
                if ( typeof o === "string" ) {
                    t = o.slice ( 0, 3 );
                }
                if ( Array.isArray ( o ) ) {
                    if ( bx.bon.includes ( "arr" ) ) {
                        for ( let i = 0; i < o.length; i++ ) {
                            o [ i ] = conv ( o [ i ] );
                        }
                        return o;
                    }
                    else throw "this type is illegal.";
                }
                else if ( typeof o == "object" ) {
                    if ( bx.bon.includes ( "obj" ) ) {
                        for ( const k in o ) {
                            if ( o.hasOwnProperty ( k ) ) {
                                o [ k ] = conv ( o [ k ] );
                            }
                        }
                        return o;
                    }
                    else throw "this type is illegal.";
                }
                else if ( t === "str" ) {
                    if ( bx.bon.includes ( "str" ) ) {
                        return o.slice ( 3 );
                    }
                    else throw "this type is illegal.";
                }
                else if ( t === "num" ) {
                    if ( bx.bon.includes ( "num" ) ) {
                        return parseFloat ( o.slice ( 3 ) );
                    }
                    else throw "this type is illegal.";
                }
                else if ( t === "nan" ) {
                    if ( bx.bon.includes ( "nan" ) ) {
                        return NaN;
                    }
                    else throw "this type is illegal.";
                }
                else if ( t === "in+" || t === "in-" ) {
                    if ( bx.bon.includes ( "inf" ) ) {
                        return ( t [ 2 ] + 1 ) * Infinity;
                    }
                    else throw "this type is illegal.";
                }
                else if ( t === "bo1" || t === "bo0" ) {
                    if ( bx.bon.includes ( "bool" ) ) {
                        return t [ 2 ] === "1";
                    }
                    else throw "this type is illegal.";
                }
                else if ( t === "not" ) {
                    if ( bx.bon.includes ( "not" ) ) {
                        return undefined;
                    }
                    else throw "this type is illegal.";
                }
                else if ( t === "nul" ) {
                    if ( bx.bon.includes ( "nul" ) ) {
                        return null;
                    }
                    else throw "this type is illegal.";
                }
                else if ( t === "rgx" ) {
                    if ( bx.bon.includes ( "rgx" ) ) {
                        o = o.slice ( 3 ).split ( '/' );
                        let f = o.shift ();
                        return RegExp ( o.join ( '/' ), f );
                    }
                    else throw "this type is illegal.";
                }
                else if ( t === "fun" ) {
                    if ( bx.bon.includes ( "fun" ) ) {
                        let get;
                        try {
                            eval ( 'get=' + o.slice ( 3 ) );
                        }
                        catch {
                            eval ( 'get= function ' + o.slice ( 3 ) );
                        }
                        return get;
                    }
                    else throw "this type is illegal.";
                }
                else if ( t === "dat" ) {
                    if ( bx.bon.includes ( Date ) ) {
                        return new Date ( o.slice ( 3 ) );
                    }
                    else throw "this type is illegal.";
                }
            }
            try {
                str = Base.obj ( str );
            } catch {};
            return conv ( str );
        }
    },
    set: { // Setting Methods
        optc ( item, p ) { // alternative to the optional chaining operator "?."
            let r = item;
            for ( const ps of p ) {
                if ( r === undefined || r === null ) {
                    return r;
                }
                if ( Array.isArray ( ps ) ) {
                    for ( const px of ps ) {
                        if ( r [ px ] !== undefined ) {
                            r = r [ px ];
                            break;
                        }
                    }
                }
                else if ( typeof ps === "object" && ps !== null ) {
                    r = functions._.optx ( r, ps );
                }
                else {
                    r = r [ ps ];
                }
            }
            return r;
        },
        nco ( ors ) { // Nullish Coalescing Operator
            let r = ors [ 0 ];
            for ( let i = 1; i < ors.length && ( r === null || r === undefined ); i++ ) {
                r = ors [ i ];
            }
            return r;
        },
        ice ( item, o, deep = true ) { // break the entries o of item
            if ( item === undefined || item == null || o === undefined || o === null || !functions.ver.isReal ( o, [ Object, Array ] ) ) {
                throw new TypeError ( "Unvalid Type." );
            }
            let enumerable = true;
            if ( typeof deep == "object" && deep !== null ) {
                let { enumerable: e = true, deep: d = true } = deep;
                enumerable = el
                deep = d;
            }
            
            let ox = Object.getOwnPropertyDescriptors ( o );
            for ( const k in ox ) {
                if ( o.hasOwnProperty ( k ) ) {
                    let v = ox [ k ];
                    if ( v.get == undefined && v.set == undefined) {
                        if ( deep && functions.ver.isReal ( v.value, [ Object, Array ] ) ) {
                            Object.defineProperty ( item, k, {
                                value: Array.isArray ( v.value ) ? [] : {}, writable: false, configurable: false, enumerable
                            } );
                            this.ice ( item [ k ], v.value, deep );
                        }
                        else {
                            if ( !( Array.isArray ( item ) && k === "length" ) ) {
                                Object.defineProperty ( item, k, {
                                    value: v.value, writable: false, configurable: false, enumerable
                                } );
                            }
                        }
                    }
                    else {
                        Object.defineProperty ( item, k, {
                            get: v.get, set: v.set, configurable: false, enumerable
                        } );                            
                    }
                }
            }
            return item;
        },
        def ( item, o, props = {} ) {
            if ( item === undefined || item == null || o === undefined || o === null || !functions.ver.isReal ( o, [ Object, Array ] ) ) {
                throw new TypeError ( "Unvalid Type." );
            }
            let enumerable = true,
            deep = false,
            configurable = true,
            writable = true;
            if ( typeof props == "object" && props !== null ) {
                let {
                    enumerable: e = true, 
                    deep: d = false,
                    configurable: c = true,
                    writable: w = true
                } = props;
                enumerable = e
                deep = d;
                configurable = c;
                writable = w;
            }
            let ox = Object.getOwnPropertyDescriptors ( o );
            for ( const k in ox ) {
                if ( o.hasOwnProperty ( k ) ) {
                    let v = ox [ k ];
                    if ( v.get == undefined && v.set == undefined) {
                        if ( deep && functions.ver.isReal ( v.value, [ Object, Array ] ) ) {
                            Object.defineProperty ( item, k, {
                                value: Array.isArray ( v.value ) ? [] : {}, writable, configurable, enumerable
                            } );
                            this.ice ( item [ k ], v.value, deep );
                        }
                        else {
                            if ( !( Array.isArray ( item ) && k === "length" ) ) {
                                Object.defineProperty ( item, k, {
                                    value: v.value, writable, configurable, enumerable
                                } );
                            }
                        }
                    }
                    else {
                        Object.defineProperty ( item, k, {
                            get: v.get, set: v.set, configurable, enumerable
                        } );                            
                    }
                }
            }
            return item;
        },
        err ( name, type, fn = ( { message } ) => message ) {

            if ( !(
                functions.ver.is ( name, [ /[a-zA-Z_$](\w|\$)*/ ] ) &&
                typeof type == "string" &&
                typeof fn == "function"
            ) ) {
                throw new TypeError ( "Unvalid Type." );
            }
            bx.ERR [ type ] = bx.$CreateError ( name, fn );
            return bx.ERR [ type ];
        }
    },
    crt: { // Creation Methods
        arr ( len, fn, force = false ) {
            if ( len === undefined && fn === undefined ) {
                return [];
            }
            if ( typeof len == "number" ) {
                if ( typeof fn == "function" ) {
                    let res = [];
                    for ( let i = 0; i < len; i++ ) {
                        res [ i ] = fn ( i, res );
                    }
                    return res;
                }
                else {
                    return new Array ( len ).fill ( fn );
                }
            }
            else if ( Array.isArray ( len ) ) {
                if ( typeof fn == "function" ) {
                    let res = [];
                    if ( force ) {
                        for ( let i = 0; i < len.length; i++ ) {
                            res [ i ] = fn ( i, len );
                        }
                    }
                    else {
                        for ( let i = 0; i < len.length; i++ ) {
                            res [ i ] = len.hasOwnProperty ( i ) ? len [ i ] : fn ( i, len );
                        }
                    }
                    return res;
                }
                else {
                    if ( force ) {
                        return Array ( len.length ).fill ( fn );
                    }
                    else {
                        let res = [];
                        for ( let i = 0; i < len.length; i++ ) {
                            res [ i ] = len.hasOwnProperty ( i ) ? len [ i ] : fn;
                        }
                        return res;
                    }
                }
            }
            else {
                throw new TypeError ( "Unvalid type." )
            }
        },
        obj ( ent ) {
            let obj = {};
            for ( let el of ent ) {
                if ( el instanceof Array || el instanceof Set ) {
                    for ( const it of el ) {
                        obj [ it [ 0 ] ] = it [ 1 ];
                    }
                }
                else if ( el instanceof Map ) {
                    for ( const [ k, v ] of el ) {
                        obj [ k ] = v;
                    }
                }
                else if ( typeof el == "object" && el !== null ) {
                    for ( const it in el ) {
                        if ( el.hasOwnProperty ( it ) ) {
                            obj [ it ] = el [ it ];
                        }
                    }
                }
                else {
                    throw new TypeError ( "Unvalid type." )
                }
            }
            return obj;
        },
        err ( err, typ ) {
            err = functions.con.if ( true, err );
            err = err instanceof Error ? err.message : err;
            try {
                let type = bx.errs.get ( typ );
                if ( type === "def" ) {
                    type = bx.defErr;
                }
                if ( type == undefined ) {
                    type = bx.ERR [ typ ];
                }
                err = new ( type ) ( functions.set.nco ( [ functions.set.optc ( err, [ "message" ] ), functions.bon.str ( err ) ] ) );
            }
            catch {
                throw TypeError ( `Unvalid type '${ type }'` );
            }
            if ( bx.err ) {
                throw err;
            }
            return err;
        },
        rgx ( str ) {
            let x = [ ...str ];
            try {
                let fl = x.pop ();
                return new RegExp ( x.join ( "" ), fl );
            }
            catch {
                return new RegExp ( str.join ( "" ) );
            }
        },
        map ( arr ) {
            let m = new Map ();
            for ( const e of arr ) {
                if ( Array.isArray ( e ) ) {
                    let i = 0;
                    for ( const el of e ) {
                        bx.funx.Map.set.call ( m, ...( el instanceof Array ? el : [ i++, el ] ) );
                    }
                }
                else if ( e instanceof Map ) {
                    for ( const kv of e ) {
                        bx.funx.Map.set.call ( m, ...kv );
                    }
                }
                else if ( e instanceof Set ) {
                    for ( const el of e ) {
                        bx.funx.Map.set.call ( m, el, el );
                    }
                }
                else if ( typeof e == "object" && e !== null ) {
                    for ( const k in e ) {
                        if ( e.hasOwnProperty ( k ) ) {
                            bx.funx.Map.set.call ( m, k, e [ k ] );
                        }
                    }
                }
                else {
                    throw TypeError ( "Unvalid entry type" );
                }
            }
            return m;
        },
        set ( arr ) {
            let s = new Set ();
            for ( const e of arr ) {
                s.add ( e );
            }
            return s;
        }
    },
    ver: { // Verification Methods
        is ( item, iss ) {
            let tIt = typeof item;
            if ( item === undefined && iss.length === 0 ) return true
            for ( const IS of new Set ( iss ) ) {
                let tIS = typeof IS;
                if (
                    item === IS ||
                    ( tIt === "number" && tIS == "number" && item + "" === IS + "" && bx.same ) ||
                    ( tIS === "function" ? IS ( item ) : false ) ||
                    ( IS instanceof RegExp && tIt === "string" ? item.replace ( IS, "" ) === "" && IS.test ( item ) : false )
                ) return true;
            }
            return false;
        },
        are ( item, ares ) {
            item = functions._.val ( item );
            return functions._.iss ( item, ares );
        },
        arek ( item, ares ) {
            item = functions._.key ( item );
            return functions._.iss ( item, ares );
        },
        has ( item, hax ) {
            item = functions._.val ( item );
            return functions._.isx ( item, hax );
        },
        hask ( item, hax ) {
            item = functions._.key ( item );
            return functions._.isx ( item, hax );
        },

        tp ( item, types ) {
            let t = false,
                tps = {
                    str: "string",
                    num: "number",
                    bool: "boolean",
                    fun: "function",
                    obj: "object",
                    big: "bigint",
                    sym: "symbol",
                    not: "undefined",
                    undefined: "undefined"
                },
                nots = [],
                ktps = Object.keys ( tps );
            for ( let i = 0; i < types.length && !t; i++ ) {
                let type = types [ i ];
                if ( ktps.includes ( type ) ) {
                    t = ( typeof item === tps [ type ] );
                }
                else if ( type === "arr" ) {
                    t = Array.isArray ( item );
                }
                else if ( type === "rgx" ) {
                    t = item instanceof RegExp;
                }
                else if ( type === "int" ) {
                    t = Number.isInteger ( item );
                }
                else if ( type === "float" ) {
                    if ( functions.ver.is ( item, [ NaN, Infinity, -Infinity ] ) );
                    else {
                        t = parseFloat ( item ) === item;
                    }
                }
                else if ( type === "nan" ) {
                    t = functions.ver.is ( item, [ NaN ] );
                }
                else if ( type === "inf" ) {
                    t = functions.ver.is ( item, [ Infinity, -Infinity ] );
                }
                else if ( type === "real-obj" ) {
                    t = functions.ver.isReal ( item, [ Object ] );
                }
                else if ( type === "real-arr" ) {
                    t = functions.ver.isReal ( item, [ Array ] );
                }
                else if ( type === "err" ) {
                    t = item instanceof Error;
                }
                else if ( type === "cls" ) {
                    if ( typeof item == "function" ) {
                        t = functions.ver.is ( item.toString (), [ /class.*{.*}/s ] );
                    }
                }
                else if ( type === "gen" ) {
                    if ( typeof item == "function" ) {
                        t = functions.ver.is ( item.toString (), [ /function *\*.*/s ] );
                    }
                }
                else if ( type === "nul" ) {
                    t = item === null;
                }
                else if ( type === "spc" ) { // this mean speacial values
                    t = functions.ver.tp ( item, [ 'nan', 'inf', 'nul' ] );
                }
                else if ( typeof type == "number" ) {
                    if ( type < 0 ) {
                        type = parseInt ( type );
                        nots.push ( ...types.slice ( i + 1, i + 1 - type ) );
                        i -= type;
                    }
                    else;
                }
                else if ( type === undefined || type === null ) {
                    t = false;
                }
                else {
                    try {
                        t = item instanceof type;
                    }
                    catch {}
                }
            }
            t &&= ! functions.ver.tp ( item, nots );
            return t;
        },
        aretp ( item, types ) {
            return functions._.tps ( functions._.val ( item ), types )
        },
        arektp ( item, types ) {
            return functions._.tps ( functions._.key ( item ), types );
        },
        hastp ( item, types ) {
            return functions._.tpx ( functions._.val ( item ), types );
        },
        hasktp ( item, types ) {
            return functions._.tpx ( functions._.key ( item ), types );
        },

        lik ( item, like ) {
            return functions._.dpComp ( item, like );
        },
        likand ( item, likes ) { // lik: like( [ 0, 1 ], [ 1, 0 ] ) -> true
            let t = true;
            for ( let i = 0; i < likes.length && t; i++ ) {
                let like = likes [ i ];
            
                t = functions._.dpComp ( item, like );
            }
        
            return t;
        },
        likor ( item, likes ) {
            let t = false;
            for ( let i = 0; i < likes.length && !t; i++ ) {
                let like = likes [ i ];
            
                t = functions._.dpComp ( item, like );
            }
        
            return t;
        },

        eq ( item, equ ) {
            if ( typeof item !== "object" ||
                functions.set.optc ( item, "constructor" ) !== functions.set.optc ( equ, "constructor" )
            ) {
                return false;
            }
            return functions._.dpEq ( item, equ );
        },
        eqand ( item, eqs ) { // eq ( [ 0, 1 ], [ 0, 1 ] ) -> true
            let t = true;
            for ( let i = 0; i < eqs.length && t; i++ ) {
                let eq = eqs [ i ];
            
                t = functions._.dpEq ( item, eq );
            }
        
            return t;
        },
        eqor ( item, eqs ) {
            let t = false;
            for ( let i = 0; i < eqs.length && !t; i++ ) {
                let eq = eqs [ i ];
            
                t = functions._.dpEq ( item, eq );
            }
        
            return t;
        },

        isReal ( item, o ) { // check if is real o ("parent type") or not.
            if ( item === null || item === undefined ) {
                return false;
            }
            let b = false;
            for ( let i = 0; i < o.length && !b; i++ ) {
                b = Object.getPrototypeOf ( item ) === functions.set.optc ( o, [ i, "prototype" ] ) && functions.set.optc ( item, [ "constructor", "name" ] ) === functions.set.optc ( o, [ i, "name" ] );
            }
            return b;
        }
    },
    ext: { // Extraction Methods
        key ( item ) {
            if ( item instanceof Set ) {
                let ks = [];
                for ( let k of item ) {
                    ks.push ( k );
                }
                return ks;
            }
            else if ( item instanceof Map ) {
                return [ ...item.keys () ];
            }
            else if ( Array.isArray ( item ) || typeof item === "string" ) {
                return Array ( item.length ).fill ().map ( ( _, i ) => i )
            }
            else if ( typeof item === "object" ) {
                return Object.keys ( item );
            }
            return undefined;
        },
        val ( item ) {
            if ( item instanceof Set ) {
                let ks = [];
                for ( let k of item ) {
                    ks.push ( k );
                }
                return ks;
            }
            else if ( item instanceof Map ) {
                return [ ...item.values () ];
            }
            else if ( typeof item === "string" ) {
                return item;
            }
            else if ( Array.isArray ( item ) ) {
                return item.concat();
            }
            else if ( typeof item === "object" ) {
                return Object.values ( item );
            }
            return undefined;
        },
        ent ( item ) {
            if ( item instanceof Set ) {
                return [ ...item.entries () ];
            }
            else if ( item instanceof Map ) {
                return [ ...item ];
            }
            else if ( typeof item === "string" || Array.isArray ( item ) ) {
                let r = [];
                for (let i = 0; i < a.length; i++) {
                    r.push ( [ i, a [ i ] ] );
                }
                return r;
            }
            else if ( typeof item === "object" ) {
                return Object.entries ( item );
            }
            return undefined;
        },

        just ( item, vals ) { // just
            if ( item instanceof Map ) {
                for ( const [ k, v ] of ( item = bx.copy ? new Map ( item ) : item ) ) {
                    if ( !functions.ver.is ( v, vals ) ) {
                        bx.funx.Map.delete.call ( item, k );
                    }
                }
            }
            else if ( item instanceof Set ) {
                for ( const v of ( item = bx.copy ? new Set ( item ) : item ) ) {
                    if ( !functions.ver.is ( v, vals ) ) {
                        bx.funx.Set.delete.call ( item, v );
                    }
                }
            }
            else if ( Array.isArray ( item ) ) {
                if ( bx.copy ) {
                    item = item.filter ( e => functions.ver.is ( e, vals ) );
                }
                else {
                    for ( let i = 0; i < item.length; i++ ) {
                        if ( !functions.ver.is ( item [ i ], vals ) ) {
                            item.splice ( i--, 1 );
                        }
                    }
                }
            }
            else if ( item instanceof Object ) {
                for ( const k in ( item = bx.copy ? { ...item } : item ) ) {
                    if ( item.hasOwnProperty ( k ) ) {
                        if ( ! functions.ver.is ( item [ k ], vals ) ) {
                            delete item [ k ];
                        }
                    }
                }
            }
            else {
                throw new TypeError ( "Unvalid type" );
            }
            return item;
        },
        justk ( item, keys ) { // just key
            if ( item instanceof Map ) {
                for ( const [ k ] of ( item = bx.copy ? new Map ( item ) : item ) ) {
                    if ( !functions.ver.is ( k, keys ) ) {
                        bx.funx.Map.delete.call ( item, k );
                    }
                }
            }
            else if ( item instanceof Set ) {
                let i = 0;
                for ( const k of ( item = bx.copy ? new Set ( item ) : item ) ) {
                    if ( !functions.ver.is ( i++, keys ) ) {
                        bx.funx.Set.delete.call ( item, k );
                    }
                }
            }
            else if ( Array.isArray ( item ) ) {
                if ( bx.copy ) {
                    item = item.filter ( ( _, i ) => functions.ver.is ( i, keys ) );
                }
                else {
                    for ( let i = 0; i < item.length; i++ ) {
                        if ( !functions.ver.is ( i, keys ) ) {
                            item.splice ( i, 1 );
                        }
                    }
                }
            }
            else if ( item instanceof Object ) {
                for ( const k in ( item = bx.copy ? { ...item } : item ) ) {
                    if ( item.hasOwnProperty ( k ) ) {
                        if ( !functions.ver.is ( k, keys ) ) {
                            delete item [ k ];
                        }
                    }
                }
            }
            else {
                throw new TypeError ( "Unvalid type" );
            }
            return item;
        },
        justtp ( item, types ) { // just type
            if ( item instanceof Map ) {
                for ( const [ k, v ] of ( item = bx.copy ? new Map ( item ) : item ) ) {
                    if ( !functions.ver.tp ( v, types ) ) {
                        bx.funx.Map.delete.call ( item, k );
                    }
                }
            }
            else if ( item instanceof Set ) {
                for ( const v of ( item = bx.copy ? new Set ( item ) : item ) ) {
                    if ( !functions.ver.tp ( v, types ) ) {
                        bx.funx.Set.delete.call ( item, v );
                    }
                }
            }
            else if ( Array.isArray ( item ) ) {
                if ( bx.copy ) {
                    item = item.filter ( e => functions.ver.tp ( e, types ) );
                }
                else {
                    for ( let i = 0; i < item.length; i++ ) {
                        if ( !functions.ver.tp ( item [ i ], types ) ) {
                            item.splice ( i, 1 );
                        }
                    }
                }
            }
            else if ( item instanceof Object ) {
                for ( const k in ( item = bx.copy ? { ...item } : item ) ) {
                    if ( item.hasOwnProperty ( k ) ) {
                        if ( ! functions.ver.tp ( item [ k ], types ) ) {
                            delete item [ k ];
                        }
                    }
                }
            }
            else {
                throw new TypeError ( "Unvalid type" );
            }
            return item;
        },
        justktp ( item, types ) { // just key type
            if ( item instanceof Map ) {
                for ( const [ k ] of ( item = bx.copy ? new Map ( item ) : item ) ) {
                    if ( !functions.ver.tp ( k, types ) ) {
                        bx.funx.Map.delete.call ( item, k );
                    }
                }
                return item;
            }
            else if ( item instanceof Set ) {
                for ( const k of ( item = bx.copy ? new Set ( item ) : item ) ) {
                    if ( !functions.ver.tp ( k, types ) ) {
                        bx.funx.Set.delete.call ( item, k );
                    }
                }
                return item;
            }
            else if ( Array.isArray ( item ) || item instanceof Object ) {
                return types.includes ( "str" ) ?
                    item : ( Array.isArray ( item ) ? [] : {} );
            }
            else {
                throw new TypeError ( "Unvalid type" );
            }
        },
        
        justn ( item, vals ) { // just not
            if ( item instanceof Map ) {
                for ( const [ k, v ] of ( item = bx.copy ? new Map ( item ) : item ) ) {
                    if ( functions.ver.is ( v, vals ) ) {
                        bx.funx.Map.delete.call ( item, k );
                    }
                }
            }
            else if ( item instanceof Set ) {
                for ( const v of ( item = bx.copy ? new Set ( item ) : item ) ) {
                    if ( functions.ver.is ( v, vals ) ) {
                        bx.funx.Set.delete.call ( item, v );
                    }
                }
            }
            else if ( Array.isArray ( item ) ) {
                if ( bx.copy ) {
                    item = item.filter ( e => !functions.ver.is ( e, vals ) );
                }
                else {
                    for ( let i = 0; i < item.length; i++ ) {
                        if ( functions.ver.is ( item [ i ], vals ) ) {
                            item.splice ( i--, 1 );
                        }
                    }
                }
            }
            else if ( item instanceof Object ) {
                for ( const k in ( item = bx.copy ? { ...item } : item ) ) {
                    if ( item.hasOwnProperty ( k ) ) {
                        if ( functions.ver.is ( item [ k ], vals ) ) {
                            delete item [ k ];
                        }
                    }
                }
            }
            else {
                throw new TypeError ( "Unvalid type" );
            }
            return item;
        },
        justnk ( item, keys ) { // just not key
            if ( item instanceof Map ) {
                for ( const [ k ] of ( item = bx.copy ? new Map ( item ) : item ) ) {
                    if ( functions.ver.is ( k, keys ) ) {
                        bx.funx.Map.delete.call ( item, k );
                    }
                }
            }
            else if ( item instanceof Set ) {
                let i = 0;
                for ( const k of ( item = bx.copy ? new Set ( item ) : item ) ) {
                    if ( functions.ver.is ( i++, keys ) ) {
                        bx.funx.Set.delete.call ( item, k );
                    }
                }
            }
            else if ( Array.isArray ( item ) ) {
                if ( bx.copy ) {
                    item = item.filter ( ( _, i ) => !functions.ver.is ( i, keys ) );
                }
                else {
                    for ( let i = 0; i < item.length; i++ ) {
                        if ( functions.ver.is ( i, keys ) ) {
                            item.splice ( i, 1 );
                        }
                    }
                }
            }
            else if ( item instanceof Object ) {
                for ( const k in ( item = bx.copy ? { ...item } : item ) ) {
                    if ( item.hasOwnProperty ( k ) ) {
                        if ( functions.ver.is ( k, keys ) ) {
                            delete item [ k ];
                        }
                    }
                }
            }
            else {
                throw new TypeError ( "Unvalid type" );
            }
            return item;
        },
        justntp ( item, types ) { // just not type
            if ( item instanceof Map ) {
                for ( const [ k, v ] of ( item = bx.copy ? new Map ( item ) : item ) ) {
                    if ( functions.ver.tp ( v, types ) ) {
                        bx.funx.Map.delete.call ( item, k );
                    }
                }
            }
            else if ( item instanceof Set ) {
                for ( const v of ( item = bx.copy ? new Set ( item ) : item ) ) {
                    if ( functions.ver.tp ( v, types ) ) {
                        bx.funx.Set.delete.call ( item, v );
                    }
                }
            }
            else if ( Array.isArray ( item ) ) {
                if ( bx.copy ) {
                    item = item.filter ( e => !functions.ver.tp ( e, vals ) );
                }
                else {
                    for ( let i = 0; i < item.length; i++ ) {
                        if ( functions.ver.tp ( item [ i ], vals ) ) {
                            item.splice ( i, 1 );
                        }
                    }
                }
            }
            else if ( item instanceof Object ) {
                for ( const k in ( item = bx.copy ? { ...item } : item ) ) {
                    if ( item.hasOwnProperty ( k ) ) {
                        if ( functions.ver.tp ( item [ k ], types ) ) {
                            delete item [ k ];
                        }
                    }
                }
            }
            else {
                throw new TypeError ( "Unvalid type" );
            }
            return item;
        },
        justnktp ( item, types ) { // just not key type
            if ( item instanceof Map ) {
                for ( const [ k ] of ( item = bx.copy ? new Map ( item ) : item ) ) {
                    if ( functions.ver.tp ( k, types ) ) {
                        bx.funx.Map.delete.call ( item, k );
                    }
                }
                return item;
            }
            else if ( item instanceof Set ) {
                for ( const k of ( item = bx.copy ? new Set ( item ) : item ) ) {
                    if ( functions.ver.tp ( k, types ) ) {
                        bx.funx.Set.delete.call ( item, k );
                    }
                }
                return item;
            }
            else if ( Array.isArray ( item ) || item instanceof Object ) {
                return !types.includes ( "str" ) ?
                    item : ( Array.isArray ( item ) ? [] : {} );
            }
            else {
                throw new TypeError ( "Unvalid type" );
            }
        },
    },
    trn: { // Transformation Methods
        toArr ( item, t = 0 ) {
            if ( t === 1 ) {
                return Array.isArray ( item ) ? item : Array ( item );
            }
            else if ( t === 2 ) {
                return functions.ext.ent ( item );
            }
            else {
                return Array.isArray ( item ) ? item : [ item ];
            }
        },
        toDo ( fn, args = a => a ) {
            return typeof fn === "function" ?
                fn ( args ) : args ( fn );
        }
    },
    con: { // Condition Methods
        if ( condition, fn, ow ) {
            if ( typeof condition == "function" ) {
                condition = condition ();
            }
            if ( condition ) {
                if ( bx.when ) {
                    return [ condition, typeof fn == "function" ? bx.just ( { when: false }, () => fn () ) : fn ];
                }
                return typeof fn == "function" ? fn () : fn;
            }
            else {
                if ( bx.when ) {
                    return [ condition, typeof ow == "function" ? bx.just ( { when: false }, () => ow () ) : ow ];
                }
                return typeof ow == "function" ? ow () : ow;
            }
        },
        async ifProm ( condition, fn, ow ) {
            if ( typeof condition == "function" ) {
                condition = await condition ();
            }
            if ( condition ) {
                if ( bx.when ) {
                    return [ condition, typeof fn == "function" ? await bx.just ( { when: false }, () => fn () ) : fn ];
                }
                return typeof fn == "function" ? await fn () : fn;
            }
            else {
                if ( bx.when ) {
                    return [ condition, typeof ow == "function" ? await bx.just ( { when: false }, () => ow () ) : ow ];
                }
                return typeof ow == "function" ? await ow () : ow;
            }
        },
        ifx ( item, condition, fn, ow ) {
            if ( typeof condition == "function" ) {
                condition = condition ( item );
            }
            if ( condition ) {
                if ( bx.when ) {
                    return [ condition, typeof fn == "function" ? bx.just ( { when: false }, () => fn ( item ) ) : fn ];
                }
                return typeof fn == "function" ? fn ( item ) : fn;
            }
            else {
                if ( bx.when ) {
                    return [ condition, typeof ow == "function" ? bx.just ( { when: false }, () => ow ( item ) ) : ow ];
                }
                return typeof ow == "function" ? ow ( item ) : ow;
            }
        },
        async ifxProm ( item, condition, fn, ow ) {
            if ( typeof condition == "function" ) {
                condition = await condition ( item );
            }
            if ( condition ) {
                if ( bx.when ) {
                    return [ condition, typeof fn == "function" ? await bx.just ( { when: false }, () => fn ( item ) ) : fn ];
                }
                return typeof fn == "function" ? await fn ( item ) : fn;
            }
            else {
                if ( bx.when ) {
                    return [ condition, typeof ow == "function" ? await bx.just ( { when: false }, () => ow ( item ) ) : ow ];
                }
                return typeof ow == "function" ? await w ( item ) : ow;
            }
        },
        when ( when ) {
            let res;
            functions.lop.and ( when, w => {
                if ( Array.isArray ( w ) ) {
                    if ( w.length <= 1 ) {
                        res = this.if ( true, w [ 0 ] );
                    }
                    else {
                        let c;
                        [ c, res ] = bx.just ( { when: true }, () => this.if ( ...w ) );
                        return !c;
                    }
                }
                else {
                    res = this.if ( true, w );
                }
                return false;
            } );
            return res;
        },
        whenx ( item, when ) {
            let res;
            functions.lop.and ( when, w => {
                if ( functions.ver.tp ( w, "arr" ) ) {
                    if ( w.length <= 1 ) {
                        res = this.ifx ( item, true, w [ 0 ] );
                    }
                    else {
                        let c;
                        [ c, res ] = bx.just ( { when: true }, () => this.ifx ( item, ...w ) );
                        return !c;
                    }
                }
                else {
                    res = this.ifx ( item, true, w );
                }
                return false;
            } );
            return res;
        },
        whentp ( item, when ) {
            let res;
            functions.lop.and ( when, w => {
                if ( functions.ver.tp ( w, "arr" ) ) {
                    if ( w.length <= 1 ) {
                        res = this.ifx ( item, true, w [ 0 ] );
                    }
                    else {
                        let c = functions.ver.tp ( item, ...functions.trn.toArr ( w.shift () ) );
                        
                        [ c, res ] = bx.just ( { when: true }, () => this.ifx ( item, c, ...w ) );
                        return !c;
                    }
                }
                else {
                    res = this.ifx ( item, true, w );
                }
                return false;
            } );
            return res;
        }

    },
    lop: {  // Loop Metthods
        and ( item, fn, ow = null, help = {}, thisArg = bx.global ) {
            if ( !functions.ver.tp ( item, [ "arr", "str", "obj", -1, "spc" ] ) ) {
                throw new TypeError ( `Unvalid type` );
            }
            if ( !functions.ver.tp ( fn, [ "fun", -1, "cls" ] ) ) {
                throw new TypeError ( `Unvalid loop function type` );
            }
            if ( !functions.ver.tp ( ow, [ "str", "err", "fun", "nul" ] ) ) {
                throw new TypeError ( `Unvalid otherwise type` );        
            }
            if ( thisArg !== bx.global ) {
                fn = fn.bind ( thisArg );
            }
            item = functions.ext [
                    functions.ver.tp ( item, [ "str", "arr", Set ] ) ?
                        "val" : "ent"
                ] ( item );
            let t = true;
            for ( let i = 0; i < item.length && t; i++ ) {
                t = fn ( item [ i ], i, item, help );
            }
            if ( !t && ow !== null ) {
                return bx.just ( { defErr: bx.ERR.log }, () => functions.trn.toDo ( ow, functions.crt.err ) );
            }
            return t;
        },
        async andProm ( item, fn, ow = null, help = {}, thisArg = bx.global ) {
            if ( !functions.ver.tp ( item, [ "arr", "str", "obj", -1, "spc" ] ) ) {
                throw new TypeError ( `Unvalid type` );
            }
            if ( !functions.ver.tp ( fn, [ "fun", -1, "cls" ] ) ) {
                throw new TypeError ( `Unvalid loop function type` );
            }
            if ( !functions.ver.tp ( ow, [ "str", "err", "fun", "nul" ] ) ) {
                throw new TypeError ( `Unvalid otherwise type` );        
            }
            if ( thisArg !== bx.global ) {
                fn = fn.bind ( thisArg );
            }
            item = functions.ext [
                    functions.ver.tp ( item, [ "str", "arr", Set ] ) ?
                        "val" : "ent"
                ] ( item );
            let t = true;
            for ( let i = 0; i < item.length && t; i++ ) {
                t = await fn ( item [ i ], i, item, help );
            }
            if ( !t && ow !== null ) {
                return bx.just ( { defErr: bx.ERR.log }, () => functions.trn.toDo ( ow, functions.crt.err ) );
            }
            return t;
        },
        or ( item, fn, ow = null, help = {}, thisArg = bx.global ) {
            if ( !functions.ver.tp ( item, [ "arr", "str", "obj", -1, "spc" ] ) ) {
                throw new TypeError ( `Unvalid type` );
            }
            if ( !functions.ver.tp ( fn, [ "fun", -1, "cls" ] ) ) {
                throw new TypeError ( `Unvalid loop function type` );
            }
            if ( !functions.ver.tp ( ow, [ "str", "err", "fun", "nul" ] ) ) {
                throw new TypeError ( `Unvalid otherwise type` );        
            }
            if ( thisArg !== bx.global ) {
                fn = fn.bind ( thisArg );
            }
            item = functions.ext [
                    functions.ver.tp ( item, [ "str", "arr", Set ] ) ?
                        "val" : "ent"
                ] ( item );
            let t = false;
            for ( let i = 0; i < item.length && !t; i++ ) {
                t = fn ( item [ i ], i, item, help );
            }
            if ( !t && ow !== null ) {
                return bx.just ( { defErr: bx.ERR.log }, () => functions.trn.toDo ( ow, functions.crt.err ) );
            }
            return t;
        },
        async orProm ( item, fn, ow = null, help = {}, thisArg = bx.global ) {
            if ( !functions.ver.tp ( item, [ "arr", "str", "obj", -1, "spc" ] ) ) {
                throw new TypeError ( `Unvalid type` );
            }
            if ( !functions.ver.tp ( fn, [ "fun", -1, "cls" ] ) ) {
                throw new TypeError ( `Unvalid loop function type` );
            }
            if ( !functions.ver.tp ( ow, [ "str", "err", "fun", "nul" ] ) ) {
                throw new TypeError ( `Unvalid otherwise type` );        
            }
            if ( thisArg !== bx.global ) {
                fn = fn.bind ( thisArg );
            }
            item = functions.ext [
                    functions.ver.tp ( item, [ "str", "arr", Set ] ) ?
                        "val" : "ent"
                ] ( item );
            let t = false;
            for ( let i = 0; i < item.length && !t; i++ ) {
                t = await fn ( item [ i ], i, item, help );
            }
            if ( !t && ow !== null ) {
                return bx.just ( { defErr: bx.ERR.log }, () => functions.trn.toDo ( ow, functions.crt.err ) );
            }
            return t;
        },
        do ( item, fn, help = {}, thisArg = bx.global ) {
            if ( ! functions.ver.tp ( item, [ "arr", "str", "obj", -1, "spc" ] ) ) {
                throw new TypeError ( `Unvalid type` );
            }
            if ( functions.ver.tp ( item, [ "fun", -1, "cls" ] ) ) {
                throw new TypeError ( `Unvalid loop function type` );
            }
        
            if ( thisArg !== bx.global ) {
                fn = fn.bind ( thisArg );
            }
            if ( Array.isArray ( item ) ) {
                for ( let i = 0; i < item.length; i++ ) {
                    item [ i ] = fn ( item [ i ], i, item, help );
                }
                return item;
            }
            else if ( item instanceof Map ) {
                let i = 0;
                for ( let kv in item ) {
                    if ( item.hasOwnProperty ( kv ) ) {
                        item.set ( ...fn ( kv, i++, item, help ) )
                    }
                }
                return item;
            }
            else {
                let i = 0;
                for ( let k in item ) {
                    if ( item.hasOwnProperty ( k ) ) {
                        [ k, item [ k ] ] = fn ( [ k, item [ k ] ], i++, item, help );
                    }
                }
            }
        },
        async doProm ( item, fn, help = {}, thisArg = bx.global ) {
            if ( ! functions.ver.tp ( item, [ "arr", "str", "obj", -1, "spc" ] ) ) {
                throw new TypeError ( `Unvalid type` );
            }
            if ( functions.ver.tp ( item, [ "fun", -1, "cls" ] ) ) {
                throw new TypeError ( `Unvalid loop function type` );
            }
        
            if ( thisArg !== bx.global ) {
                fn = fn.bind ( thisArg );
            }
            if ( Array.isArray ( item ) ) {
                for ( let i = 0; i < item.length; i++ ) {
                    item [ i ] = await fn ( item [ i ], i, item, help );
                }
                return item;
            }
            else if ( item instanceof Map ) {
                let i = 0;
                for ( let kv in item ) {
                    if ( item.hasOwnProperty ( kv ) ) {
                        item.set ( ...await fn ( kv, i++, item, help ) )
                    }
                }
                return item;
            }
            else {
                let i = 0;
                for ( let k in item ) {
                    if ( item.hasOwnProperty ( k ) ) {
                        [ k, item [ k ] ] = await fn ( [ k, item [ k ] ], i++, item, help );
                    }
                }
            }
        },
        each ( item, fn, help = {}, thisArg = bx.global ) {
            if ( ! functions.ver.tp ( item, [ "arr", "str", "obj", -1, "spc" ] ) ) {
                throw new TypeError ( `Unvalid type` );
            }
            if ( functions.ver.tp ( item, [ "fun", -1, "cls" ] ) ) {
                throw new TypeError ( `Unvalid loop function type` );
            }
            if ( thisArg !== bx.global ) {
                fn = fn.bind ( thisArg );
            }
            let i = 0;
            if ( typeof item == "string" ) {
                let r = [];
                for ( e of item ) {
                    r [ i ] = fn ( e, i++, item, help );
                }
                return r.join ( "" );
            }
            else if ( Array.isArray ( item ) ) {
                let res = item.map ( ( e, i ) => fn ( e, i, item, help ) );
                return res;
            }
            else if ( item instanceof Set ) {
                let res = new Set ();
                for ( const e of item ) {
                    res.add ( fn ( e, i++, item, help ) )
                }
                return res;
            }
            else if ( item instanceof Map ) {
                let map = new Map ();
                item.forEach ( ( v , k ) => map.set ( ...fn ( [ k, v ], i++, item, help ) ) )
                return map;
            }
            else {
                let res = {}
                for ( let k in item ) {
                    if ( item.hasOwnProperty ( k ) ) {
                        [ k, res [ k ] ] = fn ( [ k, item [ k ] ], i++, item, help )
                    }
                }
                return res;
            }
        },
        async eachProm ( item, fn, help = {}, thisArg = bx.global ) {
            if ( ! functions.ver.tp ( item, [ "arr", "str", "obj", -1, "spc" ] ) ) {
                throw new TypeError ( `Unvalid type` );
            }
            if ( functions.ver.tp ( item, [ "fun", -1, "cls" ] ) ) {
                throw new TypeError ( `Unvalid loop function type` );
            }
        
            if ( thisArg !== bx.global ) {
                fn = fn.bind ( thisArg );
            }
            let i = 0;
            if ( Array.isArray ( item ) || typeof item == "string" ) {
                let r = [];
                for ( let i = 0; i < item.length; i++ ) {
                    r.push ( await fn ( item [ i ], i, item, help ) );
                }
                return typeof item === "string" ? r.join ( "" ) : r;
            }
            else if ( item instanceof Set ) {
                let res = new Set ();
                for ( let e of item ) {
                    e = await fn ( e, i++, item, help );
                    res.add ( e )
                }
                return res;
            }
            else if ( item instanceof Map ) {
                let map = new Map ();
                for ( let kv of object ) {
                    kv = await fn ( kv, i++, item, help );
                    map.set ( kv [ 0 ], kv [ 1 ] );
                }
                return map;
            }
            else {
                let res = {}
                for ( let k in item ) {
                    if ( item.hasOwnProperty ( k ) ) {
                        [ k, res [ k ] ] = await fn ( [ k, item [ k ] ], i++, item, help )
                    }
                }
                return res;
            }
        },
        loop ( item, fn, help = {}, jump = () => false, stop = () => false, thisArg = bx.global ) {
            if ( functions.ver.tp ( item, [ 'spc' ] ) ) {
                throw new TypeError ( `Unvalid type` );
            }
            if ( !functions.ver.aretp ( [ fn, jump, stop ], [ "fun" ] ) ) {
                throw new TypeError ( `Unvalid type. callback, jump and stop should be functions` );
            }
            
            if ( thisArg !== bx.global ) {
                fn = fn.bind ( thisArg );
            }
            let om = bx.loop || [ "j", "f", "s" ];
            let r = 0;
            if ( typeof item == "number" ) {
                a: for ( let i = 0; i < item; i++ ) {
                    for ( let is = 0; is < om.length; is++ ) {
                        if ( om [ is ] === "j" ) {
                            if ( jump ( i, item, help ) === true ) {
                                continue a;
                            }
                        }
                        else if ( om [ is ] === "f" ) {
                            fn ( i, item, help );
                            r++
                        }
                        else if ( om [ is ] === "s" ) {
                            if ( stop ( i, item, help ) === true ) {
                                break a;
                            }
                        }
                    }
                }
            }
            else {
                let e;
                if ( item instanceof Set ) {
                    e = functions.ext.val ( item );
                }
                else if ( Array.isArray ( item ) || typeof e == "string" ) {
                    e = item;
                }
                else {
                    e = functions.ext.ent ( item );
                }
                a: for ( let i = 0; i < e.length; i++ ) {
                    for ( let is = 0; is < om.length; is++ ) {
                        if ( om [ is ] === "j" ) {
                            if ( jump ( e [ i ], i, item, help ) === true ) {
                                continue a;
                            }
                        }
                        else if ( om [ is ] === "f" ) {
                            fn ( e [ i ], i, item, help );
                            r++
                        }
                        else if ( om [ is ] === "s" ) {
                            if ( stop ( e [ i ], i, item, help ) === true ) {
                                break a;
                            }
                        }
                    }
                }
            }
            return r;
        },
        async loopProm ( item, fn, help = {}, jump = () => false, stop = () => false, thisArg = bx.global ) {
            if ( functions.ver.tp ( item, [ 'spc' ] ) ) {
                throw new TypeError ( `Unvalid type` );
            }
            if ( !functions.ver.aretp ( [ fn, jump, stop ], [ "fun" ] ) ) {
                throw new TypeError ( `Unvalid type. callback, jump and stop should be functions` );
            }
            
            if ( thisArg !== bx.global ) {
                fn = fn.bind ( thisArg );
            }
            let om = bx.loop || [ "j", "f", "s" ];
            let r = 0;
            if ( typeof item == "number" ) {
                a: for ( let i = 0; i < item; i++ ) {
                    for ( let is = 0; is < om.length; is++ ) {
                        if ( om [ is ] === "j" ) {
                            if ( await jump ( i, item, help ) === true ) {
                                continue a;
                            }
                        }
                        else if ( om [ is ] === "f" ) {
                            await fn ( i, item, help );
                            r++
                        }
                        else if ( om [ is ] === "s" ) {
                            if ( await stop ( i, item, help ) === true ) {
                                break a;
                            }
                        }
                    }
                }
            }
            else {
                let e;
                if ( item instanceof Set ) {
                    e = functions.ext.val ( item );
                }
                else if ( Array.isArray ( item ) || typeof e == "string" ) {
                    e = item;
                }
                else {
                    e = functions.ext.ent ( item );
                }
                a: for ( let i = 0; i < e.length; i++ ) {
                    for ( let is = 0; is < om.length; is++ ) {
                        if ( om [ is ] === "j" ) {
                            if ( await jump ( e [ i ], i, item, help ) === true ) {
                                continue a;
                            }
                        }
                        else if ( om [ is ] === "f" ) {
                            await fn ( e [ i ], i, item, help );
                            r++
                        }
                        else if ( om [ is ] === "s" ) {
                            if ( await stop ( e [ i ], i, item, help ) === true ) {
                                break a;
                            }
                        }
                    }
                }
            }
            return r;
        },
        while ( fn, thisArg = bx.global, params ) {
            if ( functions.ver.tp ( item, [ "fun", -1, "cls" ] ) ) {
                throw new TypeError ( `Unvalid loop function type` );
            }
            while ( fn.call ( thisArg, ...params ) );
        },
        async whileProm ( fn, thisArg = bx.global, params ) {
            if ( functions.ver.tp ( item, [ "fun", -1, "cls" ] ) ) {
                throw new TypeError ( `Unvalid loop function type` );
            }
            while ( await fn.call ( thisArg, ...params ) );
        }
    },


    mth: {
        edge ( min, n, max, props = [] ) {
            if ( typeof n == "function" ) n = n ( ...props, min, max );
            return n < min ? min : n > max ? max : n;
        },
        dom ( num, from, to ) {
            return from <= num && num <= to;
        },
        domx ( num, dom ) {
            if ( !functions.ver.is ( dom, [ /([0-9.epI\[\], &|\+\-]+)/ ] ) ) {
                throw SyntaxError ( `The expected symbols are ( 0-9 e p I "+" "-" "," " " "[" "]" "&" "|"  ).` );
            }
            dom = dom.replace ( /,/g, " " );
            let map = [],
                isB = ( a ) => a == "[" || a =="]";
    
            for ( let i = 0; i < dom.length; i++ ) {
                let l = dom [ i ];
                if ( isB ( l ) ) {
                    if ( isB ( map [ map.length - 1 ] ) ) {
                        throw SyntaxError ( `Unexpected symbol "${ l }" at ${ i + 1 }.` );
                    }
                    map.push ( l );
                }
                else if ( functions.ver.is ( l, "&|" ) ) {
                    if ( isB ( map [ map.length - 1 ] ) ) {
                        map.push ( l );
                    }
                    else {
                        throw SyntaxError ( `Unexpected symbol "${ l }" at ${ i + 1 }.` );
                    }
                }
                else if ( functions.ver.is ( l, [ /([0-9.]|\-|\+|I)/ ] ) ) {
                    if ( !functions.ver.is ( map [ map.length - 1 ], "+-&|" ) ) {
                        let n = l;
                        if ( n == "I" );
                        else if ( functions.ver.is ( n + dom [ i + 1 ], [ /(\+|\-)I/ ] ) ) {
                            n += dom [ ++i ];
                        }
                        else if ( functions.ver.is ( n + dom [ i + 1 ], [ /(\+|\-)[0-9.]/ ] ) || functions.ver.is ( n, [ /[0-9.]/ ] ) ) {
                            let nt = 0;
                            if ( functions.ver.is ( n, "-+" ) ) {
                                i++;
                                l = dom [ i ];
                                if ( l != "." ) {
                                    n += l;
                                }
                            }
                            if ( l == "." ) {
                                n = "0.";
                                nt++
                            }
                            b: for ( let is = i + 1; is < dom.length; is++ ) {
                                let l = dom [ is ];
    
                                if ( ( functions.ver.is ( l, [ /[0-9]/ ] ) && nt < 2 ) || ( l == "." && nt < 1 ) || ( ( l == "e" || l == "p" ) && n [ n.length - 1 ] !== "." ) ) {
                                    n += l;
                                    nt = functions.con.when ( [
                                        functions.ver.is ( l, [ /[0-9]/ ] ) && nt < 2, nt
                                    ], [
                                        l == "." && nt < 1, 1
                                    ], [
                                        ( l == "e" || l == "p" ) && n [ n.length - 1 ] !== ".", 2
                                    ] );
                                    continue b;
                                }
                                else if ( isB ( l ) || l == " " ) {
                                    if ( n [ n.length - 1 ] !== "." ) {
                                        i = --is;
                                        break b;
                                    }
                                }
                                throw SyntaxError ( `Unexpected symbol "${ l }" at ${ is + 1 }.` );
                            }
                        }
                        map.push ( n );
                    }
                    else {
                        throw SyntaxError ( `Unexpected symbol "${ l }" at ${ i + 1 }.` );
                    }
                }
                else if ( l == " " );
                else {
                    throw SyntaxError ( `Unexpected symbol "${ l }" at ${ i + 1 }.` );
                }
            }
            let doms = [],
                flt = ( a ) => {
                    if ( a == "-I" ) {
                        return -Infinity;
                    }
                    else if ( a == "I" || a == "+I" ) {
                        return Infinity;
                    }
                    else {
                        
                        let f = parseFloat ( a ),
                            s = a.replace ( /(\+|\-|)([0-9]*\.[0-9]+|[0-9]+)/, "" );
                        for ( const x of s ) {
                            f *= x == "p" ? Math.PI : Math.E
                        }
                        return f;
                    }
                };
            for ( let i = 0; i < map.length; i+= 5 ) {
                let dm;
                if ( isB ( map [ i ] ) ) {
                    dm = [ map [ i ] == "[" ];
                }
                else {
                    throw SyntaxError ( `Unexpected symbol "${ map [ i ] }" at ${ i + 1 }o.` );
                }
                if ( functions.ver.is ( map [ i + 1 ], [ /(\+|\-|)([0-9]*\.[0-9]+|[0-9]+)[pe]*/, /(\+|\-|)I/ ] ) ) {
                    dm.push ( flt ( map [ i + 1 ] ) );
                }
                else {
                    throw SyntaxError ( `Unexpected symbol "${ map [ i + 1 ] }" at ${ i + 2 }o.` );
                }
                if ( functions.ver.is ( map [ i + 2 ], [ /(\+|\-|)([0-9]*\.[0-9]+|[0-9]+)[pe]*/, /(\+|\-|)I/ ] ) ) {
                    dm.push ( flt ( map [ i + 2 ] ) );
                }
                else {
                    throw SyntaxError ( `Unexpected symbol "${ map [ i + 2 ] }" at ${ i + 3 }o.` );
                }
                if ( isB ( map [ i + 3 ] ) ) {
                    dm.push ( map [ i + 3 ] == "]" );
                    doms.push ( dm );
                }
                else {
                    throw SyntaxError ( `Unexpected symbol "${ map [ i + 3 ] }" at ${ i + 4 }o.` );
                }
                if ( i + 4 == map.length ) {
                    break;
                }
                if ( functions.ver.is ( map [ i + 4 ], ..."&|" ) &&  i + 5 !== map.length ) {
                    doms.push ( map [ i + 4 ] == "|" );
                }
                else {
                    throw SyntaxError ( `Unexpected symbol "${ map [ i + 4 ] }" at ${ i + 5 }o.` );
                }
            }
    
            let domr = ( dom ) => {
                if ( functions.ver.eq ( dom.slice ( 0, 2 ), [ -Infinity, Infinity ] ) ) {
                    return true;
                }
                if ( dom [ 1 ] > dom [ 2 ] ) {
                    return false;
                }
                else if ( dom [ 1 ] == dom [ 2 ] ) {
                    if ( dom [ 0 ] && dom [ 3 ] ) {
                        return num == dom [ 1 ];
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return ( dom [ 1 ] < num && num < dom [ 2 ] ) || ( dom [ 0 ] && dom [ 1 ] == num ) || ( dom [ 3 ] && dom [ 2 ] == num )
                }
            },
                domain = domr ( doms [ 0 ] );
            
            for ( let i = 1; i < doms.length; i += 2 ) {
                if ( doms [ i ] ) {
                    domain ||= domr ( doms [ i + 1] );
                }
                else {
                    domain &&= domr ( doms [ i + 1] );
                }
            }
            return domain;
        },
        domain () {}, // new Domain
        rng ( ...fromto ) {
            if ( fromto.length % 2 == 1 ) {
                throw `to [ ${ ( fromto.length - 1 ) / 2 } ] is empty.`;
            }
            let rng = [];
            for ( let i = 0; i < fromto.length; i++ ) {
                if ( fromto [ i ] >= fromto [ i + 1 ] ) {
                    if ( i % 2 === 1 ) {
                        fromto.splice ( i--, 2 );
                    }
                }
            }
            
            for ( let i = 0; i < fromto.length; i++ ) {
                let from = Math.ceil ( fromto [ i++ ] ),
                    to = Math.floor ( fromto [ i ] ) + 1;
                rng.push ( ...functions.crt.arr ( to - from, ( i ) => i + from ) );
            }
            return rng;
        },
        rngx ( a, ...fromto ) {
            if ( fromto.length % 2 == 1 ) {
                throw `to [ ${ ( fromto.length - 1 ) / 2 } ] is empty.`;
            }
            let rng = [];
            for ( let i = 0; i < fromto.length; i++ ) {
                if ( fromto [ i ] >= fromto [ i + 1 ] ) {
                    fromto.splice ( i--, 2 );
                }
            }
            let f = false;
            if ( Number.isInteger ( a ) ) {
                a *= 1e7;
                fromto = functions.lop.each ( fromto, n => n * 1e7 );            
                f = true;
            }
            for ( let i = 0; i < fromto.length; i++ ) {
                let from = fromto [ i++ ],
                    to = fromto [ i ],
                    arr = [];
                for ( let is = from; is <= to; is += a ) {
                    arr.push ( is );
                }
                rng.push ( ...arr );
            }
            if ( f ) {
                rng = functions.lop.each ( rng, a => a / 1e7 );
            }
            return rng;
        },

        rand ( from = -1, to = 1 ) {
            if ( functions.ver.aretp ( [ from, to ], [ "num", -1, "nan" ] ) ) {
                if ( from > to ) {
                    [ from, to ] = [ to, from ];
                }
                let r0 = to - from;
                return Math.random () * r0 + from;
            }
            else {
                throw TypeError ( "Unvalid type" );
            }
        },
        randint ( from = 0, to = 1 ) {
            if ( functions.ver.aretp ( [ from, to ], [ "num", -1, "nan" ] ) ) {
                if ( from > to ) {
                    [ from, to ] = [ to, from ];
                }
                to++
                from--
                let r0 = to - from;
                return parseInt ( Math.random () * r0 + from );
            }
            else {
                throw TypeError ( "Unvalid type" );
            }
        },

        max ( arr, fn ) {
            
        },
        min ( arr, fn ) {
    
        },

        rot ( num, b ) {
            
        },
        flour ( num, b ) {
    
        },
        ceil ( num, b ) {
    
        },
        // mathimatical functions like cos sin ... but with deg rad and grad and complex numbers
        rad ( num ) {
    
        },
        deg ( num ) {
    
        },
        grad ( num ) {
    
        },
        i ( r, i ) { // complex numbers

        },
        mthfn: {
            pow () {}, root () {},
            e () {}, log () {},
            sin () {}, tan () {}, sec () {}, cos () {}, cot () {}, csc () {}, 
        }
    },

    cpt: {
        genID ( len = 7, fromto = [ 55, 55 ], { not } = {} ) {
            if ( !functions.ver.tp ( len, [ "int" ] ) ) {
                throw TypeError ( "Unvalid type." );
            }
            let alf = [];
            for ( let i = 0; i < fromto.length; i += 2 ) {
                const from = fromto [ i ];
                const to = fromto[i + 1];

                if ( typeof from === "number" && typeof to === "number" ) {
                    for ( let j = from; j <= to; j++ ) {
                        alf.push ( j );
                    }
                }
            }
            let res = "",
                ALFA = ( i ) => String.fromCharCode ( alf [ i ] );
            cryp = crypto.getRandomValues ( new Uint32Array ( len ) );
            for ( let i = 0; i < len; i++ ) {
                res += ALFA ( cryp [ i ] % ( alf.length ) );
            }
        
            if ( !Array.isArray ( not ) ) not = [ not ];
            if ( functions.ver.is ( res, ...not ) ) res = this.genID ( len, [ from, to ] );
            return res;
        }
    },

    fil: {
        mimetp ( file ) {
            if ( typeof file != "string" ) {
                throw TypeError ( "Unvalid Type." );
            }
            const mimeTypes = {
                // img
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.bmp': 'image/bmp',
                '.svg': 'image/svg+xml',
                '.webp': 'image/webp',
                '.tiff': 'image/tiff',
                '.tif': 'image/tiff',
                '.ico': 'image/x-icon',
        
                // vid
                '.mp4': 'video/mp4',
                '.m4v': 'video/x-m4v',
                '.avi': 'video/x-msvideo',
                '.mov': 'video/quicktime',
                '.wmv': 'video/x-ms-wmv',
                '.mkv': 'video/x-matroska',
                '.flv': 'video/x-flv',
                '.webm': 'video/webm',
        
                // aud
                '.mp3': 'audio/mpeg',
                '.wav': 'audio/wav',
                '.ogg': 'audio/ogg',
                '.aac': 'audio/aac',
                '.flac': 'audio/flac',
                '.m4a': 'audio/mp4',
                '.wma': 'audio/x-ms-wma',
                '.opus': 'audio/opus',
        
                // doc 
                '.pdf': 'application/pdf',
                '.doc': 'application/msword',
                '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                '.xls': 'application/vnd.ms-excel',
                '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                '.ppt': 'application/vnd.ms-powerpoint',
                '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                '.rtf': 'application/rtf',
        
                // rar
                '.zip': 'application/zip',
                '.tar': 'application/x-tar',
                '.gz': 'application/gzip',
                '.bz2': 'application/x-bzip2',
                '.xz': 'application/x-xz',
        
                // dta
                '.json': 'application/json',
                '.xml': 'application/xml',
                '.csv': 'text/csv',
                '.txt': 'text/plain',
                '.html': 'text/html',
                '.htm': 'text/html',
        
                // web
                '.css': 'text/css',
                '.js': 'application/javascript',
                '.wasm': 'application/wasm',
                
                // oth
                '.mid': 'audio/midi',
                '.midi': 'audio/midi',
                '.3gp': 'video/3gpp',
                '.3g2': 'video/3gpp2',
                
                // mor
                '.msg': 'application/vnd.ms-outlook',
                '.epub': 'application/epub+zip',
                '.woff': 'font/woff',
                '.woff2': 'font/woff2',
                '.otf': 'font/otf',
                '.ttf': 'font/ttf'
            };
            
            let indFil = file.lastIndexOf ( '.' ),
            ext = ( indFil === -1 || ( indFil + 1 ) === file.length ) ? "" : file.substring ( indFil ).toLowerCase ();
            return mimeTypes [ ext ] || 'application/octet-stream';
        }
    }

},
defines = {
    math: false,
    int: false,
    matrix: false,
    crypto: false,
};
for ( const m of Object.getOwnPropertyNames ( Set.prototype ) ) {
    if ( m !== "size" ) if ( typeof Set.prototype [ m ] == "function" ) {
        bx.funx.Set [ m ] = Set.prototype [ m ];
    }
}

for ( const m of Object.getOwnPropertyNames ( Map.prototype ) ) {
    if ( m !== "size" ) if ( typeof Map.prototype [ m ] == "function" ) {
        bx.funx.Map [ m ] = Map.prototype [ m ];
    }
}
Base.ice ( bx.global, { base, Base } );
//#region define Base
Base.ice ( Base, {
    XMath, XCrypto, XFile,
    //#region bon
    str ( item ) {
        return functions.bon.str ( item );
    },
    obj ( item ) {
        return functions.bon.obj ( item );
    },
    send ( item ) {
        return functions.bon.send ( item );
    },
    get ( item ) {
        return functions.bon.get ( item );
    },
    //#endregion
    //#region set
    optc ( item, ...p ) {
        return functions.set.optc ( item, p );
    },
    nco ( ...or ) {
        return functions.set.nco ( or );
    },
    ice: Base.ice,
    def ( item, o, props = {} ) {
        return functions.set.def ( item, o, props = {} );
    },
    err ( name, type, fn ) {
        return functions.set.err ( name, type, fn );
    },
    //#endregion
    //#region crt
    Arr ( len, fn, force ) {
        return functions.crt.arr ( len, fn, force );
    },
    Obj ( ...ent ) {
        return functions.crt.obj ( ent );
    },
    Err ( err, type ) {
        return functions.crt.err ( err, type );
    },
    Rgx ( ...str ) {
        return functions.crt.rgx ( str );
    },
    Map ( ...arr ) {
        return functions.crt.map ( arr );
    },
    Set ( ...arr ) {
        return functions.crt.set ( arr );
    },
    //#endregion
    //#region ver
    is ( item, ...is ) {
        return functions.ver.is ( item, is );
    },
    are ( item, ...are ) {
        return functions.ver.are ( item, are )
    },
    arek ( item, ...are ) {
        return functions.ver.arek ( item, are )
    },
    has ( item, ...has ) {
        return functions.ver.has ( item, has )
    },
    hask ( item, ...has ) {
        return functions.ver.hask ( item, has )
    },

    tp ( item, ...types ) {
        return functions.ver.tp ( item, types );
    },
    aretp ( item, ...are ) {
        return functions.ver.aretp ( item, are )
    },
    arektp ( item, ...are ) {
        return functions.ver.arektp ( item, are )
    },
    hastp ( item, ...has ) {
        return functions.ver.hastp ( item, has )
    },
    hasktp ( item, ...has ) {
        return functions.ver.hasktp ( item, has )
    },

    lik ( item, like ) {
        return functions.ver.lik ( item, like );
    },
    likand ( item, ...like ) {
        return functions.ver.likand ( item, like );
    },
    likor ( item, ...like ) {
        return functions.ver.likor ( item, like );
    },

    eq ( item, eq ) {
        return functions.ver.eq ( item, eq );
    },
    eqand ( item, ...eq ) {
        return functions.ver.eqand ( item, eq );
    },
    eqor ( item, ...eq ) {
        return functions.ver.eqor ( item, eq );
    },

    isReal ( item, ...o ) {
        return functions.ver.isReal ( item, o );
    },
    //#endregion
    //#region ext
    key ( item ) {
        return functions.ext.key ( item );
    },
    val ( item ) {
        return functions.ext.val ( item );
    },
    ent ( item ) {
        return functions.ext.ent ( item );
    },

    just ( item, ...val ) {
        return functions.ext.just ( item, val );
    },
    justk ( item, ...key ) {
        return functions.ext.justk ( item, key );
    },
    justtp ( item, ...type ) {
        return functions.ext.justtp ( item, type );
    },
    justktp ( item, ...type ) {
        return functions.ext.justktp ( item, type );
    },

    justn ( item, ...val ) {
        return functions.ext.justn ( item, val );
    },
    justnk ( item, ...key ) {
        return functions.ext.justnk ( item, key );
    },
    justntp ( item, ...type ) {
        return functions.ext.justntp ( item, type );
    },
    justnktp ( item, ...type ) {
        return functions.ext.justnktp ( item, type );
    },

    //#endregion
    //#region trn
    toArr ( item, t ) {
        return functions.trn.toArr ( item, t );
    },
    toDo ( fn, ow ) {
        return functions.trn.toDo ( fn, ow );
    },
    //#endregion
    //#region con
    if ( condition, fn, ow ) {
        return functions.con.if ( condition, fn, ow );
    },
    ifProm ( condition, fn, ow ) {
        return functions.con.if ( condition, fn, ow );
    },
    ifx ( item, condition, fn, ow ) {
        return functions.con.ifx ( item, condition, fn, ow );
    },
    ifxProm ( item, condition, fn, ow ) {
        return functions.con.if ( item, condition, fn, ow );
    },
    when ( ...when ) {
        return functions.con.when ( when );
    },
    whenx ( item, ...when ) {
        return functions.con.whenx ( item, when );
    },
    whentp ( item, ...when ) {
        return functions.con.whenx ( item, when );
    },
    //#endregion
    //#region lop
    and ( item, fn, ow, help, thisArg ) {
        return functions.lop.and ( item, fn, ow, help, thisArg );
    },
    andProm ( item, fn, ow, help, thisArg ) {
        return functions.lop.andProm ( item, fn, ow, help, thisArg );
    },
    or ( item, fn, ow, help, thisArg ) {
        return functions.lop.or ( item, fn, ow, help, thisArg );
    },
    orProm ( item, fn, ow, help, thisArg ) {
        return functions.lop.orProm ( item, fn, ow, help, thisArg );
    },
    do ( item, fn, help, thisArg ) {
        return functions.lop.do ( item, fn, help, thisArg );
    },
    doProm ( item, fn, help, thisArg ) {
        return functions.lop.doProm ( item, fn, help, thisArg );
    },
    each ( item, fn, help, thisArg ) {
        return functions.lop.each ( item, fn, help, thisArg );
    },
    eachProm ( item, fn, help, thisArg ) {
        return functions.lop.eachProm ( item, fn, help, thisArg );
    },
    loop ( item, fn, help, jump, stop, thisArg ) {
        return functions.lop.loop ( item, fn, help, jump, stop, thisArg )
    },
    loopProm ( item, fn, help, jump, stop, thisArg ) {
        return functions.lop.loopProm ( item, fn, help, jump, stop, thisArg )
    },
    while ( fn, thisArg, ...params ) {
        return functions.lop.while ( fn, thisArg, ...params );
    },
    whileProm ( fn, thisArg, ...params ) {
        return functions.lop.whileProm ( fn, thisArg, ...params );
    },
    //#endregion
} );
//#region prototyper for Base
let fnsBaseArr = [
    "optc", "nco", "def",
    "Arr", "Obj", "Err", "Rgx", "Map", "Set",
    "is", "are", "arek", "has", "hask",
    "tp", "aretp", "arektp", "hastp", "hasktp",
    "lik", "likand", "likor",
    "eq", "eqand", "eqor",
    "isReal",
    "just", "justk", "justtp", "justktp",
    "justn", "justnk", "justntp", "justnktp",
    "toArr", "toDo",
    "if", "ifProm", "ifx", "ifxProm", "when", "whenx", "whentp",
    "and", "andProm", "or", "orProm",
    "do", "doProm", "each", "eachProm",
    "loop", "loopProm", "while", "whileProm"
],
    getterfFnsBaseArr = [
        "str", "obj", "send", "get",
        "key", "val", "ent",
    ],
    fnsBaseObj = {};
Base.loop ( fnsBaseArr, k => {
    fnsBaseObj [ k ] = function ( ...args ) {
        return Base [ k ] ( this.me, ...args );
    }
} );
Base.loop ( getterfFnsBaseArr, k => {
    Object.defineProperty ( fnsBaseObj, k, {
        get: function () {
            return Base [ k ] ( this.me );
        }
    } );
} );
//#endregion
//#endregion
//#region define XFile
Base.ice ( XFile, {
    mimetp ( file ) {
        return functions.fil.mimetp ( file );
    }
} );
//#endregion
//#region define XCrypto
Base.ice ( XCrypto, {
    genID ( length, dom, props ) {
        return functions.cpt.genID ( length, dom, props );
    }
} );
//#endregion
//#region define XMath
Base.ice ( XMath, {
    edge ( min, n, max, ...props ) {
        return functions.mth.edge ( min, n, max, props );
    }
} );
//#endregion

Base.ice ( Base.prototype, fnsBaseObj );
Base.ice ( bx, bx );
let _BASE = ( any ) => new Base ( any );
Base.ice ( base, { Base, XMath, XCrypto, XFile, get bx () { return bx },
base, var ( type, as ) {
    if ( type === "XMath" && !defines.math ) {
        Base.ice ( bx.global, { [ functions.set.nco ( as, type ) ]: XMath } );
        defines.math = true;
    }
    else if ( type === "Int" && !defines.int ) {
        Base.ice ( bx.global, {
            [ functions.set.nco ( as, type ) ]: function Int (int) {
                int = parseInt ( int );
                if ( !( this instanceof Int ) ) {
                    return typeof int === "number" && !isNaN ( int ) ? int : 0;
                }
                return new Base.math.Int ( int );
            }
        } );
        defines.int = true;
    }
    else if ( type == "Matrix" && !defines.matrix ) {
        Base.ice ( bx.global, { [ functions.set.nco ( as, type ) ]: Matrix } );
        defines.matrix = true;
    }
    else if ( type == "XCrypto" && !defines.crypto ) {
        Base.ice ( bx.global, { [ functions.set.nco ( as, type ) ]: XCrypto } );
        defines.crypto = true;
    }
} } );
base.bx.bon = [ "str", "num", "bool", "arr", "obj", "nan", "inf", "not", "nul", "rgx", "fun", Date ];
base.bx.defErr = Error;
base.bx.err = true;
base.bx.when = false;
base.bx.same = true; // same === true ? is ( NaN, NaN ) -> true : is ( NaN, NaN ) -> false
base.bx.copy = false;

try {
    module.exports = base;
} catch {}