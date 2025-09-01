//#region pager

//#endregion


//#region toolbox


// new page
engine.setElem ( "toolbox:new-page", engine.builder.add ( "block-btn", {
    ico: "./ico/page/newpage.svg",
    description: `
        <tit>new Page</tit>
        <line></line>
        <desc>Create a new, customizable, and interactive landing page.</desc>`,
    click: engine.apply ( "open:pager", { isCreate: true, isBlock: false, canImport: true, elem: "toolbox:new-page" } )
} ) );
// new block
engine.setElem ( "toolbox:new-block", engine.builder.add ( "block-btn", {
    ico: "./ico/page/newblock.svg",
    description: `
        <tit>new Block</tit>
        <line></line>
        <desc>Create a new, customizable, and interactive dynamic block.</desc>`,
    click: engine.apply ( "open:pager", { isCreate: true, isBlock: true, canImport: true, elem: "toolbox:new-block" } )
} ) );
// Empty Block
engine.setElem ( "toolbox:empty-block", engine.builder.add ( "block-btn", {
    ico: "./ico/blocs/empty.svg",
    description: `
        <tit>Empty Block</tit>
        <line></line>
        <desc>A fully customizable, empty element that serves as the basis for creating any type of content.</desc>`,
    click: () => {
        engine.app ( "page:draw", { type: "empty", event: "click" } );
    }
} ) );


//#endregion

//#region Details Panel
engine.builder.add ( "domain:panel", { name: "layers", title: "Layers", ico: "./ico/details/layers.svg" } );
engine.builder.add ( "domain:panel", { name: "props", title: "Properties", ico: "./ico/details/props.svg" } );
engine.builder.add ( "domain:panel", { name: "resizer", title: "Resizing System", ico: "./ico/details/resizer.svg" } );
engine.builder.add ( "domain:panel", { name: "sensors", title: "Sensors", ico: "./ico/details/sensor.svg" } );
engine.builder.add ( "domain:panel", { name: "fns", title: "functions", ico: "./ico/details/functions.svg" } );
//#endregion


//#region View

//#region aspect-ratio
engine.builder.add ( "ratio-selector", { ratio: "10:1" } );
engine.builder.add ( "ratio-selector", { ratio: "1:10" } );

engine.builder.add ( "ratio-selector", { ratio: "1:1" } );
engine.builder.add ( "ratio-selector", { ratio: "1:2" } );
engine.builder.add ( "ratio-selector", { ratio: "16:9" } );
engine.builder.add ( "ratio-selector", { ratio: "8:5" } );


//#endregion

//#endregion


let id = engine.app ( "new:page", { name: "try 1", type: "page", ratios: {
    "16:9": {
        setting: { zoom: 1.4, inch: 12 },
        props: {
            //fill: "red",
            siz_pos: { // view page position absolutly x = 0 y = 0
                w: "100%",
                h: "100%",
            }
        },
        kids: [
            {
                type: "empty", id: "123456789",
                props: {
                    //fill: "green",
                    siz_pos: {
                        free: false,
                        level: 1,
                        w: "50%",
                        h: 100,//{ type: "df0", name: "w:h", value: { v: 2 } },
                        x: 0,//"100px",
                        y: 464.7890948056708//"100px",
                    }
                }
            }
        ]
    },
    use: "16:9",
    def: "16:9"
} } );
engine.app ( "open:page", { id } );
