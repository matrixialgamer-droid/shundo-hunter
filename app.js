const SUPABASE_URL = "PASTE_YOUR_PROJECT_URL_HERE";
const SUPABASE_KEY = "PASTE_YOUR_PUBLISHABLE_KEY_HERE";

async function startHunter() {
    const code = document.getElementById("trainerCode").value.trim();
    const status = document.getElementById("status");

    if (!code) {
        status.textContent = "Enter your Trainer Code.";
        return;
    }

    status.textContent = "Saving Trainer Code...";

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/users`,
        {
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
        }
    );

    if (response.ok) {
        status.textContent = "✅ Trainer Code registered!";
    } else {
        const error = await response.text();
        console.error(error);
        status.textContent = "❌ Could not register Trainer Code.";
    }
}
