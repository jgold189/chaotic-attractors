export const attractors = {
    'Lorenz': lorenzAttractor,
    'Chen (Multiscroll)': chenAttractor,
    'Lu Chen (Multiscroll)': luChenAttractor,
    'Rossler': rosslerAttractor, 
};

// All functions update a point according to the related attractor equation

// https://en.wikipedia.org/wiki/Lorenz_system
function lorenzAttractor(point, dt) {
    const rho = 28.0
    const sigma = 10.0
    const beta = 8.0 / 3.0

    const x = point.position.x;
    const y = point.position.y;
    const z = point.position.z;

    point.position.x += (sigma * (y - x)) * dt;
    point.position.y += (x * (rho - z) - y) * dt;
    point.position.z += (x * y - beta * z) * dt;
}

// https://en.wikipedia.org/wiki/Multiscroll_attractor#Chen_attractor
function chenAttractor(point, dt) {
    const a = 40;
    const b = 3;
    const c = 28;

    const x = point.position.x;
    const y = point.position.y;
    const z = point.position.z;

    point.position.x += (a * (y - x)) * dt;
    point.position.y += ((c - a) * x - x * z + c * y) * dt;
    point.position.z += (x * y - b * z) * dt;
}

// https://en.wikipedia.org/wiki/Multiscroll_attractor#Lu_Chen_attractor
function luChenAttractor(point, dt) {
    const a = 36;
    const b = 3;
    const c = 20;
    const u = -15.15

    const x = point.position.x;
    const y = point.position.y;
    const z = point.position.z;

    point.position.x += (a * (y - x)) * dt;
    point.position.y += (x - x * z + c * y + u) * dt;
    point.position.z += (x * y - b * z) * dt;
}

// https://en.wikipedia.org/wiki/R%C3%B6ssler_attractor
function rosslerAttractor(point, dt) {
    const a = 0.2;
    const b = 0.2;
    const c = 5.7;

    const x = point.position.x;
    const y = point.position.y;
    const z = point.position.z;

    point.position.x += ((y * -1) - z) * dt;
    point.position.y += (x + a * y) * dt;
    point.position.z += (b + z * (x - c)) * dt;
}