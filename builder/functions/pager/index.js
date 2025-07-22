let pager = zro ( "body functions pager" ),
    controls = pager.zro ( "controls" );

engine.define ( "open:pager", () => {
    engine.app ( "show:fns" );
    engine.try ( "clear:desc" );
    setTimeout ( () => {
        pager.class ( "show0" );
    }, 250 );
} );
engine.define ( "close:pager", () => {
    engine.app ( "set:none:tool", engine.elem ( "toolbox:new-page" ) )
    pager.class ( "show0", false );
    setTimeout ( () => {
        engine.app ( "hide:fns" );
    }, 250 );
} );

controls.zro ( "exit" ).on ( "click", engine.apply ( "close:pager" ) );
controls.zro ( "import" ).on ( "click", () => {
    
} );