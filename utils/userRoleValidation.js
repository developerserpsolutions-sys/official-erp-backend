export function isSuperAdmin(req) {
    return req.user?.role === "SuperAdmin";
}

export function isAdmin(req) {
    return req.user?.role === "Admin";
}

export function isOperator(req) {
    return req.user?.role === "Operator";
}   

export function isExecutive(req) {
    return req.user?.role === "Executive";
}

export function isManager(req) {
    return req.user?.role === "Manager";
}
