let engine = new class Engine {
    static Builder = class Builder {
        static Builds = new Map;
        build ( name, fn ) {
            Builder.Builds.set ( name, fn );
        }
        /**
         * 
         * @returns {Zero | HTMLElement>}
         */
        add ( name, params ) {
            if ( typeof params !== "object" && params != null ) {
                throw new Error ( "params must be an object" );
            }
            return Builder.Builds.get ( name ) ( params ?? {} );
        }
    }

    static Error = class Error {
        constructor ( e ) {
            this.e = e;
        }
        throw () {
            throw this.e;
        }
    }


    static fns = new Map;
    /**
     * @type {Map<string, Zero>}
     */
    static elems = new Map;


    constructor () {
        this.builder = new Engine.Builder;
        
        Base.ice ( this, { builder: this.builder, Error: Engine.Error } );
    }


    define ( name, fn, props ) {
        if ( typeof fn == "function" )
            Engine.fns.set ( name, [ fn, props ] );
        else 
            console.error ( "Invalid type, Expected function." );
    }
    reDefine ( name, fn, props ) {
        if ( typeof fn !== "function" ) fn = null;
        if ( typeof props !== "object" ) props = null;
        let old = Engine.fns.get ( name );
        Engine.fns.set ( name, [ fn ?? old, props ?? old ] );
    }
    delete ( name ) {
        return Engine.fns.delete ( name );
    }
    app ( name, ...args ) {
        let fn = Engine.fns.get( name );
        if ( typeof fn ?.[ 0 ] === "function" ) {
            return fn [ 0 ] ( ...( fn ?.[ 1 ]?.before || [] ), ...args, ...( fn ?.[ 1 ]?.after || [] ) );
        }
        else {
            throw new Error ( `Application (${ name }) not found` );
        }
    }
    try ( name, ...args ) { 
        try {
            let fn = Engine.fns.get( name );
            if ( typeof fn ?.[ 0 ] === "function" ) {
                return fn [ 0 ] ( ...( fn ?.[ 1 ]?.before || [] ), ...args, ...( fn ?.[ 1 ]?.after || [] ) );
            }
            else {
                throw new Error ( `Application (${ name }) not found` );
            }
        }
        catch ( e ) {
            return new Engine.Error ( e );
        }
    }
    apply ( name, ...args ) {
        let fn = Engine.fns.get ( name );
        if ( typeof fn ?.[ 0 ] === "function" ) {
            return () => fn [ 0 ] ( ...( fn ?.[ 1 ]?.before || [] ), ...args, ...( fn ?.[ 1 ]?.after || [] ) );
        }
    }

    setElem ( name, elem ) {
        Engine.elems.set ( name, zro ( elem ) );
    }

    elem ( name ) {
        return Engine.elems.get ( name );
    }
    remElem ( name ) {
        return Engine.elems.delete ( name );
    }
}