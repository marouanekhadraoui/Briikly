( () => {
    let panel = zro ( "details-panel" ),
        hed = panel.zro ( "h-line" ),
        bod = panel.zro ( "b-box" );
    engine.builder.build ( "domain:panel", ( { name, title, ico } ) => {
        let head = hed.addH ( `
            <h-dom title="${ title }">
                <img src="${ ico }">
            </h-dom>
        ` ),
            body = bod.addH ( `<b-dom></b-dom>` );
        engine.setElem ( "domhp:" + name, head );
        engine.setElem ( "dombp:" + name, body );
        head.on ( "click", () => {
            engine.app ( "active-domain", { name } );
        } );
    } );
    engine.define ( "active-domain", ( { name } ) => {
        let h = engine.elem ( "domhp:" + name ).class ( "set-neumorfe1-on" ),
            b = engine.elem ( "dombp:" + name ).class ( "s" );
        let domsp = engine.getProp ( "domsp" );
        if ( domsp ) {
            domsp [ 0 ].class ( "set-neumorfe1-on", false );
            domsp [ 1 ].class ( "s", false );
        }
        engine.setProp ( "domsp", [ h, b ] );
    } );

    engine.builder.build ( "sect:panel", ( { domain, name, levels } ) => {
        
    } )
} ) ()