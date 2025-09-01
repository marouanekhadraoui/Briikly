( () => {
    let resizer = zro ( "details-panel b-box rs-box" ),
        screenValues = resizer.zro ( "sect[do=screen-display] blocks block set[do=screen] values value > *" );
    
    
    let DATA_resizerDef = {
        ratio: [ 16, 9 ],
        inch: 24,
        width: 1920,
        Height: 1080
    }
    console.log(screenValues);
    
} ) ()