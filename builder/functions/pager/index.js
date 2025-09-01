let pager = zro ( "body functions pager" ),
    controls = pager.zro ( "controls" ),
    inputPager = pager.zro ( "input" );

engine.define ( "open:pager", ( { isCreate = true, isBlock = true, canImport = true, openImport = false, initialName = "", elem } ) => {
    engine.app ( "show:fns" );
    engine.try ( "clear:desc" );
    engine.app ( "off:toolbox:selected-tool" )
    setTimeout ( () => {
        pager.class ( "show0" );
    }, 250 );
    
    pager.zro ( "add-page txt" ).txt ( ( isCreate ? "New" : "Open" ) + " " + ( isBlock ? "Block" : "Page" ) );
    controls.zro ( "import" ).class ( "inactive", !canImport );
    pager.zro ( "add-page bl-or-pg" ).class ( "b", isBlock )
    engine.setData ( "pager", "open", { initialName, from: null, isBlock, isCreate, elem } );
    inputPager.txt ( initialName ).focus ();
} );
pager.zro ( "add-page bl-or-pg" ).on ( "click", function () {
    this.class ( "b", "tog" );
    engine.getData ( "pager", "open" ).isBlock = this.class ( "b", "has" );
    let { isBlock, isCreate } = engine.getData ( "pager", "open" );
    pager.zro ( "add-page txt" ).txt ( ( isCreate ? "New" : "Open" ) + " " + ( isBlock ? "Block" : "Page" ) );
} );
engine.define ( "close:pager", () => {
    engine.app ( "set:none:tool", engine.elem ( engine.getData ( "pager", "open" ).elem ) );
    pager.class ( "show0", false );
    setTimeout ( () => {
        engine.app ( "hide:fns" );
    }, 250 );

    engine.remData ( "pager", "open" );
    pager.class ( "pages", false );
    inputPager.txt ( "" );
} );
inputPager.on ( "input", function () {
    engine.getData ( "pager", "open" ).initialName = this.val () [ 0 ];
} )
controls.zro ( "exit" ).on ( "click", engine.apply ( "close:pager" ) );
controls.zro ( "import" ).on ( "click", function () {
    if ( this.class ( "inactive", "has" ) ) return;
    this.class ( "open", "tog" );
    pager.class ( "pages", this.class ( "open", "has" ) );
} );
controls.zro ( "valid" ).on ( "click", async () => {
    let { initialName, from, isBlock, isCreate } = engine.getData ( "pager", "open" );
    if ( Base.is ( initialName, /^[^\\/:*?"<>|\r\n]+$/ ) ) {
        if ( isCreate ) {
            engine.app ( "new:page", id, { name: initialName, from, type: isBlock ? "block" : "page", isCreate  } );
            // await engine.app ( "save:page", id, { name: initialName, from, type: isBlock ? "block" : "page" } );
            engine.app ( "open:page", { id } );
        }
        else {
            // must get id from pointer to block
            engine.app ( "open:page", id );
        }
        engine.app ( "open:page", { name: initialName, from, isBlock, isCreate } );
        engine.app ( "close:pager" );
    }
    else {
        engine.app ( "error", {  message: "Invalid name, when open this " + isBlock ? "block" : "page", time: 6000 } );
    }
} );