let engine = new class Engine {
    static Builder = class Builder {
        static Builds = new Map;
        build ( name, fn ) {
            Builder.Builds.set ( name, fn );
        }
        add ( name, ...params ) {
            return Builder.Builds.get ( name ) ( ...params );
        }
    }


    static fns = new Map;
    /**
     * @type {Map<string, Zero>}
     */
    static elems = new Map;


    constructor () {
        this.builder = new Engine.Builder;
        
        Base.ice ( this, { builder: this.builder } );
    }


    def_fn ( name, fn, props ) {
        if ( typeof fn == "function" )
            Engine.fns.set ( name, [ fn, props ] );
        else 
            console.error ( "Invalid type, Expected function." );
    }
    ref_fn ( name, fn, props ) {
        if ( typeof fn !== "function" ) fn = null;
        if ( typeof props !== "object" ) props = null;
        let old = Engine.fns.get ( name );
        Engine.fns.set ( name, [ fn ?? old, props ?? old ] );
    }
    rem_fn ( name ) {
        return Engine.fns.delete ( name );
    }
    command ( name, ...args ) {
        let fn = Engine.fns.get( name );
        if ( typeof fn ?.[ 0 ] === "function" ) {
            return fn [ 0 ] ( ...( fn ?.[ 1 ]?.before || [] ), ...args, ...( fn ?.[ 1 ]?.after || [] ) );
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