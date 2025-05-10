declare interface IMap {
    triggerRepaint(): void;
    on(e: "move" | "resize", handler: () => void): void;
    getCanvas(): HTMLCanvasElement;
    addLayer(layer: any): void;
}

declare type TAxis = "x" | "y" | "z";