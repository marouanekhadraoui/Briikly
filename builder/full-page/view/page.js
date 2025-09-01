( () => {
    engine.setProp ( "page-ids", [] );
    //#region New Page
    engine.define ( "new:page", ( { name, from, type = "page", ratios, ratio = "16:9", zoom = true, state = "close", ico } = {} ) => {
        let id = XCrypto.genID ( 10, [ 48, 57 ] );
        engine.setData ( "pages", id, {
            header: {
                name,
                from,
                type,
                ico,
                state: state, // "close" | "open" | "active"
                id
            },
            ratios: ratios ?? {
                def: ratio,
                use: ratio,
                [ ratio ]: {
                    setting: {
                        zoom: zoom === true ? 1.4 : zoom === false ? 1 : zoom
                    },
                    kids: [],
                    props: [],
                }
            }
        } );

        engine.getProp ( "page-ids" ).push ( id );
        return id;
    } );
    //#endregion
    //#region Open Page
    engine.define ( "open:page", function ( { id, active = true } ) {
        view.zro ( "full-page > view > main-box > add-block-btn" ).class ( "hide0" );
        view.zro ( "full-page > view > main-box > page-manager" ).class ( "hide0", false );
        if ( engine.getProp ( "page-ids" ).includes ( id ) ) {
            let { header } = engine.getData ( "pages", id );
            if ( header.state === "close" ) {
                engine.builder.add ( "view:tab", {
                    id,
                    title: header.name,
                    ico: header.ico ?? { block: "./ico/view/block.svg", page: "./ico/view/page.svg" } [ header.type ]
                } );
                header.state === "open";
            }
            if ( active ) {
                engine.getData ( "id-tab:relation", id ).do ( "click" );
                header.state = "active";
                engine.setProp ( "active-page", engine.getData ( "pages", id ) );
            }
            
        }
        else {
            throw "there is no page or block with this ID: " + id;
        }
    } );
    //#endregion
    engine.define ( "draw:page", async ( { id } ) => {
        let { header, ratios } = engine.getData ( "pages", id );
        let { kids, props, setting: { zoom: z, inch } } = ratios [ ratios.def ];
        
        await engine.app ( "ref:ratio", { ratio: ratios.use } ).then ( engine.apply ( "zoom:page", { z, set: true } ) );
        let [ w0, h0 ] = engine.app ( "ratio", ratios.def ),
            k0 = inch * 96 / ( w0 ** 2 + h0 ** 2 ) ** .5,
            init_w = k0 * w0,
            init_h = k0 * h0,
            h_p = ( page.height () ) / init_h,
            w_p = ( page.width () ) / init_w;

        engine.app ( "prop:block", { blk: page, props, isPage: true } );
        console.log(init_w,init_h, view_prime_DT.scale);
        kids.forEach ( ( { type, props } ) => {
            let e = page.addH ( `<${ type }></${ type }>` );
            engine.app ( "prop:block", { blk: e, props, h_p, w_p } );
        });
        
    } );

    engine.define ( "prop:block", ( { blk, props, h_p, w_p, isPage = false } ) => {
        if ( blk instanceof Zero ) {
            let { fill, siz_pos } = props,
                res_css = {};
            if ( isPage ) {

            }
            if ( fill ) {
                if ( typeof fill == "string" ) {
                    res_css.background = fill;
                }
                else {
                    res_css.background = engine.app ( fill.type, fill );
                }
            }
            
            if ( siz_pos ) {
                if ( siz_pos.level == 1 || isPage ) {
                    let { free, w, h, x, y } = siz_pos;
                    res_css.width = w * w_p + "px";
                    res_css.height = h * h_p + "px";
                    
                    if ( typeof w == "string" ) {
                        res_css.width = w;
                    }
                    if ( typeof h == "string" ) {
                        res_css.height = h;
                    }
                    if ( free ) {
                        res_css.position =  "absolute";
                        if ( typeof x == "string" ) {
                            res_css.left = x;
                        }
                        if ( typeof y == "string" ) {
                            res_css.top = y;
                        }
                    }
                    else {
                        res_css.margin = `${ y * h_p }px ${ x * w_p }px `
                        // res_css.margin = `${ typeof y == "string" ? y : 0 } ${ typeof x == "string" ? x : 0 } `
                    }
                }
            }
            blk.css ( res_css );
        }
    } );
    engine.define ( "kid:block", ( { blk, kids } ) => {

    } );





    let view_prime_DT = {
        x: 0,
        y: 0,
        z: 1,
        scale: 1,
        l: ( z, wi ) => ( .5 * z - .5 ) * wi,
        r: ( z, wi ) => ( -.5 * z -.5) * wi + 1,
        no: Symbol("no"),
    }
    //#region Rescale Page
    engine.define ( "rescale:page", () => {
        let 
        oscale = view_prime_DT.scale,
        w = viewManager.width () / oscale,
        h = viewManager.height () / oscale,
            mw = pageManager.width () - 64,
            mh = pageManager.height () -64,
            scale = Math.min ( mw / w, mh / h );
        view_prime_DT.scale = scale;
        ratioCircle.css ( { scale } );
        drawer.css ( { boxShadow: `0 0 0 ${ 2 / scale }px #1883d9` } );
    } );
    //#endregion
    //#region Zoom Page
    engine.define ( "zoom:page", ( { z = view_prime_DT.no, set = false, change = 0 } = {} ) => {
        let not = view_prime_DT.no;
        view_prime_DT.z = z === not ? view_prime_DT.z : ( set ? z : view_prime_DT.z + z );
        
        
        if ( view_prime_DT.z < 1 ) view_prime_DT.z = 1;
        z = view_prime_DT.z;


        if ( z > 1.3 ) {
            if ( !ratioCircle.class ( "in", "has" ) ) {
                ratioCircle.class ( "in", true );
                ratioCircle.css ( { transition: ".3s" } );
                engine.app ( "rescale:page" );
                setTimeout ( () => ratioCircle.css ( [ "transition" ] ), 310 );
            }
        }
        else {
            ratioCircle.class ( "in", false ).css ( { transition: ".3s" } ).css ( [ "scale" ] );
            setTimeout ( () => ratioCircle.css ( [ "transition" ] ), 310 );
            drawer.css ( [ "box-shadow" ] );
            view_prime_DT.scale = 1;
        }

        if ( z > 1.5 ) {
            page.css ( { scale: z - .5 } );
            engine.app ( "goto:page" );
        }
        else {
            page.css ( [ "top", "left", "scale" ] );
            view_prime_DT.x = 0;
            view_prime_DT.y = 0;    
        }
        if ( change = 0 ) {
            
        }
        return view_prime_DT;
    } );
    //#endregion
    //#region Goto Page
    engine.define ( "goto:page", ( { x = view_prime_DT.no, y = view_prime_DT.no, set = false } = {} ) => {
        let not = view_prime_DT.no;
        view_prime_DT.x = x === not ? view_prime_DT.x : ( set ? x : view_prime_DT.x + x );
        view_prime_DT.y = y === not ? view_prime_DT.y : ( set ? y : view_prime_DT.y + y );
        
        
        
        let w = viewManager.width (),
            h = viewManager.height (),
            wp = page.width(),
            hp = page.height(),

            scale = view_prime_DT.scale,
            z = Math.max ( view_prime_DT.z - .5, 1 ),
            
            wi = wp /z/w,
            hi = hp /z/h,

            SCW = wp/z/wi/scale, // sizic width constant
            SCH = hp/z/hi/scale, // sizic height constant

            
            lim_r = view_prime_DT.r ( z, wi ),
            lim_l = view_prime_DT.l ( z, wi ),
            lim_t = view_prime_DT.r ( z, hi ),
            lim_b = view_prime_DT.l ( z, hi );

        
        view_prime_DT.x = XMath.edge ( lim_r * SCW, view_prime_DT.x, lim_l * SCW );
        view_prime_DT.y = XMath.edge ( lim_t * SCH, view_prime_DT.y, lim_b * SCH );

        
        x = view_prime_DT.x;
        y = view_prime_DT.y;
        
        page.css ( { top: y + "px", left: x + "px" } );
        return new Promise ( ( r ) => setTimeout ( () => r ( view_prime_DT ), 405 ) );
    } );
    //#endregion
} ) ();

