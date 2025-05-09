export interface IMap {
    triggerRepaint(): void;
    on(e: "move" | "resize", handler: () => void): void
}

export type TAxis = "x" | "y" | "z";