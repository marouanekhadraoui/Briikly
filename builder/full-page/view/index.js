let view = zro ( "full-page > view" ),
    projBar = view.zro ( "prjs-bar" ),
    pageManager = view.zro ( "page-manager" ),
    viewManager = pageManager.zro ( "main-view" ),
    drawer = pageManager.zro ( "drawer" ),
    cirlcePlace = pageManager.zro ( "ratio-circle" ),
    ratioCircle = cirlcePlace.zro ( "circle" ),
    dataRatio = ratioCircle.zro ( "data-ratio" ),
    inchScreen = dataRatio.zro ( "inch" ),
    page = cirlcePlace.zro ( "page-view" );

view.zro ( "full-page > view > main-box > add-block-btn" ).on ( "click", engine.apply ( "open:pager", { isCreate: true, isBlock: true, canImport: true } ) );


//#region view:tab Builder
engine.builder.build ( "view:tab", ( { title, ico = "./ico/view/block.svg", id } ) => {
    let tab = projBar.addH ( `
        <tab title="${ title }">
            <ico>
                <img src="${ ico }"/>
            </ico>
            <tit>${ title }</tit>
            <close>
                <img src="./ico/view/close.svg"/>
            </close>
        </tab>
    ` );
    engine.setData ( "id-tab:relation", id, tab );
    let w = projBar.width (),
        viewTabs = projBar.zro ( "tab" );
    if ( w > 5 + viewTabs.size * 205 ) {
        point_of_Ltabs = 0;
    }
    else {
        point_of_Ltabs = w - ( 5 + viewTabs.size * 205 );
    }
    refViewTabs ( viewTabs );
    tab.on ( "click", () => {
        engine.app ( "active:view-tab", { tab } );
        engine.app ( "draw:page", { id } );
    } );
    return tab;
} );
engine.define ( "active:view-tab", ( { tab, id } ) => {
    if ( !tab ) tab = engine.getData ( "id-tab:relation", id );
    if ( tab && !tab.class ( "active", "has" ) ) {
        let viewTabs = projBar.zro ( "tab" );
        if ( tab.class ( "ls", "has" ) ) {
            point_of_Ltabs += 201 - tab.width () + 50 - ( tab.left () - projBar.left () ) + 200 - zro ( tab.free [ 0 ].nextElementSibling ).width ();
        }
        else if ( tab.class ( "rs", "has" ) ) {
            point_of_Ltabs -= 201 - tab.width () + 50 + ( tab.right () - projBar.right () ) + 200 - zro ( tab.free [ 0 ].previousElementSibling ).width ();
        }
        else {
            tab.class ( "active" );
            let ac = engine.getData ( "id-tab:relation", "active" );
            if ( ac ) ac.class ( "active", false );
            engine.setData ( "id-tab:relation", "active", tab );
        }
        refViewTabs ( viewTabs );
    }
} );
//#endregion

//#region scroll view:tab

function refViewTabs ( tabs ) {
    let w = projBar.width ();
    if ( point_of_Ltabs >= 0 ) point_of_Ltabs = 0;
    else if ( point_of_Ltabs <= w - ( 5 + tabs.size * 205 ) ) point_of_Ltabs = w - ( 5 + tabs.size * 205 );
    tabs.each ( function ( e, i ) {
        let el = zro ( e ),
            l_i = point_of_Ltabs + i * 205 + 5,
            r_i = l_i + 200,
            
            rit0 = 50 - ( i === 0 ? 45 : 0 ),
            rit1 = w - ( 50 - ( i === this.size - 1 ? 45 : 0 ) );

        if ( l_i < rit0 ) {
            let we = 200 - ( rit0 - l_i );
            el.class ( "ls" );
            if ( we < 40 ) {
                el.css ( { width: 40 + "px", left: Math.max ( rit0 + ( l_i + 110 ), 5 ) + "px" } ).class ( "min" );
            }
            else {
                el.css ( { left: rit0 + "px", width: we + "px" } ).class ( "min", false );
            }
        }
        else if ( r_i > rit1 ) {
            let we = 200 - ( r_i - rit1 );
            el.class ( "rs" );
            if ( we < 40 ) {
                if ( tabs.i ( i + 1 ).class ( "min", "has" ) && !tabs.i ( i - 1 ).class ( "min", "has" ) ) {
                    el.css ( { zIndex: "1" } );
                }
                else {
                    el.css ( [ "z-index" ] );
                }
                el.css ( { width: 40 + "px", left: Math.min ( l_i, w - 45 ) + "px" } ).class ( "min" );
            }
            else {
                el.css ( [ "z-index" ] );
                el.css ( { left: l_i + "px", width: we + "px" } ).class ( "min", false );
            }
        }
        else {
            el.css ( { "left": l_i + "px", "width": "200px" } ).class ( "min", false ).class ( "ls", false ).class ( "rs", false ); // (left | right) side
        }
    } );
}

let point_of_Ltabs = 0;
projBar.on ( "wheel", ev => {
    let w = projBar.width (),
        viewTabs = projBar.zro ( "tab" );
        
    if ( !ev.ctrlKey && !Zero.canZoom && w < 5 + viewTabs.size * 205 ) {
        point_of_Ltabs -= ev.deltaX;
        refViewTabs ( viewTabs );
    }
} ).on ( "resize", () => refViewTabs ( projBar.zro ( "tab" ) ) );
//#endregion



//#region Circle-Ratio Resizing
zro.win.on ( "resize", refratioCircle );
function refratioCircle () { 
    let l = Math.min ( pageManager.width (), pageManager.height () );
    cirlcePlace.css ( { width: l + "px", height: l + "px" } );
    if ( ratioCircle.class ( "in", "has" ) ) {
        engine.app ( "rescale:page" );
    }
}
refratioCircle ();
//#endregion

//#region ratio managing
engine.define ( "ratio", ( ratio, maxDen = 100 ) => {
    if ( typeof ratio == "string" ) {
        let [ w, h ] = ratio.split ( /[:\/]/ );
        w = parseFloat ( w );
        h = parseFloat ( h );
        return isNaN( w * h ) ? false : [ w, h ];
    }
    else if ( typeof ratio == "number" ) {
        let best = [1, 1];
        let minError = Math.abs(ratio - 1);
        for ( let d = 1; d <= maxDen; d++ ) {
            let n = Math.round ( ratio * d );
            let err = Math.abs ( ratio - n / d );
            if ( err < minError ) {
            best = [ n, d ];
            minError = err;
            if ( err < 1e-10 ) break;
            }
        }
        const gcd = ( a, b ) => b ? gcd ( b, a % b ) : a;
        const g = gcd ( best [ 0 ], best [ 1 ] );
        return [ best [ 0 ] / g, best [ 1 ] / g ];
    }
    else if ( Base.aretp ( [ ratio?.w, ratio?.h ], "num" ) ) {
        return isNaN ( w * h ) ? false : [ w, h ];
    }
    else if ( Base.aretp ( [ ratio?.[ 0 ], ratio?.[ 1 ] ], "num" ) ) {
        let [ w, h ] = ratio;
        return isNaN ( w * h ) ? false : [ w, h ];
    }
    else {
        return false;
    }
} )
engine.builder.build ( "ratio-selector", ( { ratio } ) => {
    let ro = engine.app ( "ratio", ratio );
    
    if ( engine.getData ( "ratio-selector", ro.join ( ":" ) ) ) return false;
    let poiter = dataRatio.addH ( `
        <pointer>
            <selector>
                <svg><path></path></svg>
            </selector>
        </pointer>
    ` );
    engine.setData ( "ratio-selector", ro.join ( ":" ), poiter );
    if ( ro [ 0 ] / ro [ 1 ] >= 10 || ro [ 0 ] / ro [ 1 ] <= 0.1 ) {
        poiter.class ( "lim" );
    }
    ro = Math.atan ( ro [ 0 ] / ro [ 1 ] )
    
    poiter.css ( { "rotate": ro + "rad" } );
} )

engine.define ( "ref:ratio", ( { ratio } ) => {
    let wh = engine.app ( "ratio", ratio );
    if ( wh ) {
        let [ w, h ] = wh,
            rd = Math.atan ( h / w ),
            fw = Math.cos ( rd ),
            fh = Math.sin ( rd );
        viewManager.css ( { width: fw * 64 + "%", height: fh * 64 + "%" } );
        inchScreen.css ( { rotate: -rd + "rad" } );
        //engine.app ( "rescale:page" )
    }
    return new Promise ( ( r ) => setTimeout ( () => r ( wh ), 305 ) );
} );
view.on ( "zoom", ev => {
    ev.preventDefault();    
    let delta = Math.abs ( ev.deltaY ) > 20 ? ( ev.deltaY / Math.abs ( ev.deltaY ) ) * 20 : ev.deltaY;
    let z = engine.app ( "zoom:page", { z: -delta * 0.005 } ).z;
} );
view.on ( "wheel", ev => {
    if ( !ev.ctrlKey ) {
        let s = ev.shiftKey
        engine.app ( "goto:page", { [ "xy" [ s + 0 ] ]: -ev.deltaX, [ "yx" [ s + 0 ] ]: -ev.deltaY } );        
    }
} );

// engine.define ( "save:page", function ( { name, from, type } ) {
//     let id = XCrypto.genID ( 10, [ 48, 57 ] )
//     engine.setData ( "open-projects", id, {
//         name,
//         from,
//         type,
//         props: [],
//         kids: []
//     } );
// } );



//#endregion


// engine.define ( "page:draw", ( { event, type } ) => {
//     engine.setData ( "view:drawer", "mode", { event, type, mode: "point-draw" } );
// } );



let blocksStruct = {
    "empty": `<empty></empty>`
}
// page.on ( "pointerdown", ev => {
//     let data0 = engine.getData ( "view:drawer", "mode" );
//     // console.log("pointerdown",data0);
//     if ( !data0 ) return;
//     let { event, type, mode } = data0;
    
//     if ( mode === "point-draw" ) {
//         if ( event === "click" ) {
//             if ( Base.is ( type, "empty" ) ) {
//                 data0.mode = "draw";

//                 let empty = page.addH ( blocksStruct [ type ] );
//                 data0.block = empty;
//                 data0.x = ev.x;
//                 data0.y = ev.y;


//                 empty.css ( { top: data0.y - page.top () + "px", left: data0.x - page.left () + "px" } );
                
//             }
//         }
//         else if ( event === "drag" ) {
//             throw "Not implemented";
//         }
//     }
// } )
// .on ( "pointermove", ev => {
//     let data0 = engine.getData ( "view:drawer", "mode" );
//         // console.log("pointermove",data0);
//     if ( !data0 ) return;
//     let { event, type, mode } = data0;
    
//     if ( mode === "draw" ) {
//         let w = ev.x - data0.x,
//             h = ev.y - data0.y;
//         data0.w = ev.x - data0.x;
//         data0.h = ev.y - data0.y;
//         console.log( w, h );

//         data0.block.css ( { height: data0.h + "px", width: data0.w + "px" } );
        
//     }
// } )
// .on ( "pointerup", ev => { 
//     let data0 = engine.getData ( "view:drawer", "mode" );
//         // console.log("pointermove",data0);
//     if ( !data0 ) return;
//     let { event, type, mode } = data0;

//     if ( mode === "draw" ) {
//         // let w = ev.x - data0.x,
//         //     h = ev.y - data0.y;
//         // data0.w = ev.x - data0.x;
//         // data0.h = ev.y - data0.y;
//         // console.log( w, h );
//         // data0.block.css ( { height: data0.h + "px", wdth: data0.w + "px" } );

//         engine.setData ( "view:drawer", "mode", null );
//         engine.app ( "off:toolbox:selected-tool" )
//     }
// });