const fs = require('fs');

let c = fs.readFileSync('src/AdminPage.jsx', 'utf8');

c = c.replace('useState("Gallery")', 'useState("Dashboard")');
c = c.replace(/const TABS = \[.*?\];/, 'const TABS = ["Dashboard", "Events", "Points", "Setup"];');

const tabs = ["Gallery", "Houses", "Authorities", "Management", "Games", "Registrations", "Winners", "Points", "Students", "T-Shirts", "Settings", "Exports", "Config"];
const b = {};

function extract(content, tab) {
    const rx = new RegExp(`\\{tab === "${tab}" && \\(\\r?\\n([\\s\\S]*?)\\n\\s*\\)\\}`);
    const m = content.match(rx);
    return m ? m[1] : '';
}

function rem(content, tab) {
    const rx = new RegExp(`\\{tab === "${tab}" && \\(\\r?\\n([\\s\\S]*?)\\n\\s*\\)\\}`);
    return content.replace(rx, '');
}

for (let t of tabs) {
    b[t] = extract(c, t);
    c = rem(c, t); // remove from current
}

function f(t, arr) {
    return '{tab === "' + t + '" && (\\n<div style={{ display: "flex", flexDirection: "column", gap: 32 }}>\\n' + arr.filter(Boolean).join('\\n') + '\\n</div>\\n)}';
}

const statsPanel = `
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
    <div style={{...cS}}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#8B0000" }}>{registrations.length}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: dark ? "#aaa" : "#888", textTransform: "uppercase" }}>Total Registrations</div>
    </div>
    <div style={{...cS}}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#4B0082" }}>{studentsDB.length}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: dark ? "#aaa" : "#888", textTransform: "uppercase" }}>Master Students DB</div>
    </div>
    <div style={{...cS}}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#2E8B57" }}>{adminGames.length}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: dark ? "#aaa" : "#888", textTransform: "uppercase" }}>Total Events</div>
    </div>
</div>
`;

const d = f("Dashboard", [statsPanel, b.Exports, b.Registrations, b.Students, b['T-Shirts']]);
const e = f("Events", [b.Games, b.Gallery]);
const p = f("Points", [b.Winners, b.Points]);
const s = f("Setup", [b.Config, b.Settings, b.Houses, b.Authorities, b.Management]);

// Insert back before the closing div of the AdminPage component
const insertIdx = c.lastIndexOf('</div>\n    );\n}');
if (insertIdx !== -1) {
    c = c.substring(0, insertIdx) + '\\n' + d + '\\n' + e + '\\n' + p + '\\n' + s + '\\n</div>\\n    );\\n}';
} else {
    // If windows line endings
    const insertIdx2 = c.lastIndexOf('</div>\\r\\n    );\\r\\n}');
    if (insertIdx2 !== -1) {
        c = c.substring(0, insertIdx2) + '\\r\\n' + d + '\\r\\n' + e + '\\r\\n' + p + '\\r\\n' + s + '\\r\\n</div>\\r\\n    );\\r\\n}';
    }
}

fs.writeFileSync('src/AdminPage.jsx', c);
console.log('done');
