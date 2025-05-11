export namespace constants {
    // export const WORLD_SIZE = 1024000;
    // export const MERCATOR_A = 6378137.0; // 900913 projection property
    // export const PROJECTION_WORLD_SIZE = WORLD_SIZE / (MERCATOR_A * Math.PI * 2);
    // export const DEG2RAD = Math.PI / 180;
    // export const RAD2DEG = 180 / Math.PI;
    // export const EARTH_CIRCUMFERENCE = 40075000; // In meters

    export const DEG2RAD = Math.PI / 180;
    export const RAD2DEG = 180 / Math.PI;
    export const TILE_SIZE = 512;

    export const WORLD_SIZE = 1024000;
    export const EARTH_RADIUS = 6371008.8; //from Mapbox  https://github.com/mapbox/mapbox-gl-js/blob/0063cbd10a97218fb6a0f64c99bf18609b918f4c/src/geo/lng_lat.js#L11
    export const MERCATOR_A = EARTH_RADIUS;
    export const EARTH_CIRCUMFERENCE = 2 * Math.PI * EARTH_RADIUS;
    export const EARTH_CIRCUMFERENCE_EQUATOR = 40075017; //from Mapbox https://github.com/mapbox/mapbox-gl-js/blob/0063cbd10a97218fb6a0f64c99bf18609b918f4c/src/geo/lng_lat.js#L117
    export const PROJECTION_WORLD_SIZE = WORLD_SIZE / EARTH_CIRCUMFERENCE;
    
    export const FOV = Math.atan(3 / 4); // Math.atan(3/4) radians. If this value is changed, FOV_DEGREES must be calculated
    export const FOV_ORTHO = 0.1 * DEG2RAD;  // closest to 0
    export const FOV_DEGREES = FOV * RAD2DEG; // Math.atan(3/4) in degrees
}