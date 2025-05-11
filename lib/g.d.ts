declare interface IMap {
    triggerRepaint(): void;
    on(e: "move" | "resize", handler: () => void): void;
    getCanvas(): HTMLCanvasElement;
    addLayer(layer: any): void;
    transform:{
        scale: number,
        fov: number,
        height:number,
        width: number
    }
}

declare type TAxis = "x" | "y" | "z";