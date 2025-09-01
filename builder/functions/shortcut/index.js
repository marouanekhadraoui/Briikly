zro.win.on ( "keydown", ev => {
    //console.log(ev);
    if ( ev.ctrlKey && "+-0".includes ( ev.key ) ) {
        ev.preventDefault ();
    }
} )
.on ( "wheel", ev=> ev.preventDefault (), { passive: false } );