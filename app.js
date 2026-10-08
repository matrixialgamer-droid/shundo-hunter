function startHunter() {
    const code = document.getElementById("trainerCode").value;
    const status = document.getElementById("status");

    if (!code) {
        status.textContent = "Enter your Trainer Code.";
        return;
    }

    status.textContent = "Shiny checking enabled.";

    document.getElementById("results").innerHTML = `
        <div class="result">
            <h2>✨ Waiting for candidates...</h2>
            <p>Trainer Code: ${code}</p>
            <p>No live spawn data connected yet.</p>
        </div>
    `;
}
