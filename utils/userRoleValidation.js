export function isSuperAdmin(req) {
    return req.user?.role === "SuperAdmin";
}

export function isAdmin(req) {
    return req.user?.role === "Admin";
}


