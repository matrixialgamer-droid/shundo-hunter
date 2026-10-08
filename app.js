const SUPABASE_URL = "https://tlxdtcgjecnkgwgdqiiu.supabase.co";
const SUPABASE_KEY = "sb_publishable_P089PMI6Gd8TsSgtSGN-LA_FgI7-e6k";

function trainerSeed(trainerCode) {
    let hash = 0;

    for (let i = 0; i < trainerCode.length; i++) {
        hash = ((hash << 5) - hash) + trainerCode.charCodeAt(i);
        hash |= 0;
    }

    return Math.abs(hash);
}

function predictsShiny(trainerCode, spawn) {
    const seed =
        trainerSeed(trainerCode) +
        spawn.id +
        Math.floor(new Date(spawn.created_at).getTime() / 1000);

    // Simulated prediction only
    return seed % 20 === 0;
}

async function startHunter() {
    const code = document.getElementById("trainerCode").value.trim();
    const status = document.getElementById("status");
    const results = document.getElementById("results");

    if (!code) {
        status.textContent = "Enter your Trainer Code.";
        return;
    }

    status.textContent = "🔎 Checking trainer...";
    results.innerHTML = "";

    // Register trainer
    await fetch(`${SUPABASE_URL}/rest/v1/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Prefer": "return=minimal"
        },
        body: JSON.stringify({
            trainer_code: code
        })
    });

    // Get active 100% IV shiny-eligible spawns
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/spawns?attack=eq.15&defense=eq.15&stamina=eq.15&shiny_available=eq.true&expires_at=gt.${new Date().toISOString()}`,
        {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`
            }
        }
    );

    const spawns = await response.json();

    // Apply simulated trainer-specific prediction
    const predictions = spawns.filter(spawn =>
        predictsShiny(code, spawn)
    );

    status.textContent = "✅ Prediction check complete.";

    if (predictions.length === 0) {
        results.innerHTML = `
            <div class="result">
                <h2>🔍 No predicted Shundos</h2>
                <p>No matching simulated shiny predictions right now.</p>
            </div>
        `;
        return;
    }

    results.innerHTML = predictions.map(spawn => `
        <div class="result">
            <h2>✨ ${spawn.pokemon}</h2>
            <p>💯 100% IV — 15/15/15</p>
            <p>📍 ${spawn.latitude}, ${spawn.longitude}</p>
            <p>⏱ Expires: ${new Date(spawn.expires_at).toLocaleTimeString()}</p>
            <p>🎯 Predicted for this trainer</p>
        </div>
    `).join("");
}
