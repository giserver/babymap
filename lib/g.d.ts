declare interface IMap {
    triggerRepaint(): void;
    on(e: "move" | "resize", handler: () => void): void;
    getCanvas(): HTMLCanvasElement;
    addLayer(layer: any): void;
    transform: {
        scale: number,
        fov: number,
        height: number,
        width: number,
        pitch: number,
        bearing: number,
        tileSize: number,
        center: { lng: number, lat: number },
        centerOffset: { x: number, y: number },
        _camera?: { position: any },
        _cameraPosition?:[number,number,number],
        elevation: number | Elevation | null | undefined
    }
}

declare type TAxis = "x" | "y" | "z";