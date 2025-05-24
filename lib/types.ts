export type TMap = {
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
        worldSize: number,
        _camera?: { position: any },
        _cameraPosition?: [number, number, number],
        elevation: any
    }
}

export type TAxis = "x" | "y" | "z";

export type TPosition = [number , number] | [number, number, number] | { lng: number, lat: number, alt?: number };

export type TMeshUnits = "meter" | "screen";