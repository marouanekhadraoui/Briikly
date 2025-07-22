//#region pager

//#endregion


//#region toolbox

// new page
let b = engine.builder.add ( "block-btn", {
    ico: "./ico/page/newpage.svg",
    click: () => {
        console.log("gggg");
        engine.app ( "open:pager" );
    }
} );
engine.setElem ( "toolbox:new-page", b );


//#endregion