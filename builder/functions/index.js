engine.setElem ( "fns", "body functions" );
engine.define ( "show:fns", () => {
    engine.elem ( "fns" ).class ( "show0" );
} );
engine.define ( "hide:fns", () => {
    engine.elem ( "fns" ).class ( "show0", false );
} );