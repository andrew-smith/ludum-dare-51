

export type Point = { x: number, y: number };

/**
 * @return {boolean} true if (x, y) is in bounds
 */
export function boundsContainsPoint(bounds: Point[], x: number, y: number): boolean {
    //https://rosettacode.org/wiki/Ray-casting_algorithm
    let count = 0;
    for (let b = 0; b < bounds.length; b++) {
        let vertex1 = bounds[b];
        let vertex2 = bounds[(b + 1) % bounds.length];
        if (_west(vertex1, vertex2, y, x))
            ++count;
    }
    return count % 2 !== 0;

}
/**
 * @return {boolean} true if (x,y) is west of the line segment connecting A and B
 */
function _west(A: Point, B: Point, x: number, y: number): boolean {
    if (A.y <= B.y) {
        if (y <= A.y || y > B.y ||
            x >= A.x && x >= B.x) {
            return false;
        } else if (x < A.x && x < B.x) {
            return true;
        } else {
            return (y - A.y) / (x - A.x) > (B.y - A.y) / (B.x - A.x);
        }
    } else {
        return _west(B, A, x, y);
    }
}


/**
 * Find the next point, based on starting x,y - angle, and distance from x,y
 */
export function findNewPoint(x: number, y: number, angleDegrees: number, distance: number): Point {
    // https://stackoverflow.com/a/27572056
    let result: Point = { x: 0, y: 0 };

    result.x = Math.round(Math.cos(angleDegrees * Math.PI / 180) * distance + x);
    result.y = Math.round(Math.sin(angleDegrees * Math.PI / 180) * distance + y);

    console.log(result);
    return result;
}


export function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

export function radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
}
