export namespace constants {
    export const WORLD_SIZE = 1024000;
    export const MERCATOR_A = 6378137.0; // 900913 projection property
    export const PROJECTION_WORLD_SIZE = WORLD_SIZE / (MERCATOR_A * Math.PI * 2);
    export const DEG2RAD = Math.PI / 180;
    export const RAD2DEG = 180 / Math.PI;
    export const EARTH_CIRCUMFERENCE = 40075000; // In meters
}