
// to define global element
engine.setElem ( "toollist", "body full-page tool-box tool-list" );

// to build block builder
engine.builder.build ( "block-btn", ( { ico, description, drag, click } ) => {
    let block = engine.elem ( "toollist" ).addH ( `
        <tool-btn state="0">
            <img src="${ ico }">
        </tool-btn>
    `),
        desc = zro ( "description" ).addH ( `
            <def0 class="hide0 close">
                <b-def0>
                    ${description}
                </b-def0>
            </def0>` );
        
        engine.setData ( "toolbox:desc", block.free [ 0 ], desc );
    block.on ( "click", function () {
        let state = this.attr ( zro.get ( "state" ) ) [ 0 ] [ 0 ];
        engine.app ( `set:${ [ "off", "on", "none" ] [ state ] }:tool`, this );
        
        if ( state == 0 ) {
            engine.app ( "off:toolbox:selected-tool" );
            desc.css ( { height: desc.zro ( "b-def0" ).height () + "px" } ).class ( "close", false );
            engine.setElem ( "toollist:selected", block );
        }
        else if ( state == 1 ) {
            desc.css ( [ "height" ] ).class ( "close" ).class ( "hide0" );
            click ();
        }
        
    } )
        .on ( "dragstart", drag )



        .on ( "mouseenter", function () {
            desc.css ( { top: block.top () + 2.5 + "px" } ).class ( "hide0", false );
        })
        .on ( "mouseleave", function () {
            if ( desc.class ( "close", "has" ) )
                desc.class ( "hide0" );
        } );
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

engine.define ( "off:toolbox:selected-tool", () => {
    let ol = engine.elem ( "toollist:selected" )?.free?.[ 0 ];
    if ( ol ) {
        engine.app ( "set:none:tool", ol );
        engine.getData ( "toolbox:desc", ol ).css ( [ "height" ] ).class ( "hide0" ).class ( "close" );
        engine.remElem ( "toollist:selected" )
    }
} );

