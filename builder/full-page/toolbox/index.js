
// to define global element
engine.setElem ( "toollist", "body full-page tool-box tool-show tool-list" );

// to build block builder
engine.builder.build ( "block-btn", ( { ico, drag } ) => {
    let block = engine.elem ( "toollist" ).addH ( `
        <tool-btn>
            <img src="${ ico }">
        </tool-btn>
    `);
    let clicks = 0;
    block.on ( "click", function () {
        if ( clicks == 0 ) {
            this.class ( "set-neumorfe1-off" );
            //builder.add ( "toolbox-comment", this, "New Page", "Create a new, customizable, and interactive landing page." )
            clicks++;
        }
        else if ( clicks == 1 ) {
            this.class ( "set-neumorfe1-on" ).class ( "set-neumorfe1-off", false );
            //Engine.command ( "open-pager" );
            clicks++;
        }
        else {
            this.class ( "set-neumorfe1-on", false );
            clicks = 0;
        }
    } ).on ( "dragstart", drag );
    return block;
} );