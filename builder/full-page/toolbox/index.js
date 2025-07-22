
// to define global element
engine.setElem ( "toollist", "body full-page tool-box tool-show tool-list" );

// to build block builder
engine.builder.build ( "block-btn", ( { ico, drag, click } ) => {
    let block = engine.elem ( "toollist" ).addH ( `
        <tool-btn state="0">
            <img src="${ ico }">
        </tool-btn>
    `);
    block.on ( "click", function () {
        let state = this.attr ( zro.get ( "state" ) ) [ 0 ] [ 0 ];
        console.log(`set:${ [ "off", "on", "none" ] [ state ] }:tool`)
        engine.app ( `set:${ [ "off", "on", "none" ] [ state ] }:tool`, this );
        if ( state == 1 ) {
            click ();
        }
        
    } ).on ( "dragstart", drag );
    return block;
} );
engine.define ( "set:on:tool", function ( block ) {
    zro ( block ).class ( "set-neumorfe1-on" ).class ( "set-neumorfe1-off", false ).attr ( { state: 2 } );;
} );
engine.define ( "set:off:tool", function ( block ) {
    zro ( block ).class ( "set-neumorfe1-on", false ).class ( "set-neumorfe1-off" ).attr ( { state: 1 } );;
})
engine.define ( "set:none:tool", function ( block ) {
    zro ( block ).class ( "set-neumorfe1-on", false ).class ( "set-neumorfe1-off", false ).attr ( { state: 0 } );
} );