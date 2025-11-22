module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Mock database - Replace with actual PostgreSQL client when integrating
__turbopack_context__.s([
    "db",
    ()=>db
]);
// Mock data storage
let users = [
    {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        name: 'John Student',
        email: 'john@example.com',
        role: 'student',
        createdAt: new Date().toISOString()
    }
];
let classes = [
    {
        id: 1,
        adminId: 1,
        name: 'Mathematics 101',
        description: 'Introduction to Calculus',
        startTime: new Date().toISOString(),
        durationMinutes: 60,
        locationLat: 40.7128,
        locationLng: -74.006,
        status: 'pending',
        createdAt: new Date().toISOString()
    }
];
let classEnrollments = [];
let attendanceRecords = [];
const db = {
    users,
    classes,
    classEnrollments,
    attendanceRecords
};
}),
"[project]/app/api/attendance/student/[studentId]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
;
async function GET(request, { params }) {
    try {
        const studentId = parseInt(params.studentId);
        const records = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].attendanceRecords.filter((a)=>a.studentId === studentId);
        // Calculate statistics
        const totalClasses = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].classEnrollments.filter((e)=>e.studentId === studentId).length;
        const presentCount = records.filter((r)=>r.status === 'present').length;
        const attendancePercentage = totalClasses > 0 ? Math.round(presentCount / totalClasses * 100) : 0;
        // Enrich with class names
        const enrichedRecords = records.map((record)=>{
            const classData = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].classes.find((c)=>c.id === record.classId);
            return {
                ...record,
                className: classData?.name || 'Unknown',
                durationMinutes: classData?.durationMinutes || 0
            };
        });
        return Response.json({
            attendance: enrichedRecords,
            stats: {
                totalClasses,
                presentCount,
                attendancePercentage
            }
        });
    } catch (error) {
        return Response.json({
            error: 'Failed to fetch student attendance'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a2933f16._.js.map