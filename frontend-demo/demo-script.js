/* ============================================
   Vaultix — DEMO Script
   ============================================ */

const landingPage = document.getElementById("landing-page");
const appDashboard = document.getElementById("app-dashboard");
const connectBtn = document.getElementById("btn-connect-wallet");

const views = {
    mainMenu: document.getElementById("view-main-menu"),
    heir: document.getElementById("view-heir"),
    guardian: document.getElementById("view-guardian"),
    create: document.getElementById("view-create"),
    owner: document.getElementById("view-owner-sb")
};

// --- MOCK STATE ---
let currentRole = "owner"; 
const MOCK_WALLETS = {
    owner: "0xOWNER8921AC37...",
    guardian: "0xGUARD1a5bC992...",
    heir: "0xHEIR00000FFccB..."
};

let vaultState = {
    balance: 2.50,
    hasPendingRequest: false,
    requestAmount: 0,
    heirTimeRemaining: 31536000 // 1 year in seconds by default
};

let heirInterval;

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    // Nav 
    document.getElementById("btn-nav-create").onclick = () => switchView("create");
    document.getElementById("btn-nav-heir").onclick = () => switchView("heir");
    document.getElementById("btn-nav-guardian").onclick = () => switchView("guardian");
    document.getElementById("btn-nav-owner").onclick = () => switchView("owner");

    // Demo Controls
    const btnOwner = document.getElementById("demo-role-owner");
    const btnGuardian = document.getElementById("demo-role-guardian");
    const btnHeir = document.getElementById("demo-role-heir");

    function setRole(role, btn) {
        currentRole = role;
        [btnOwner, btnGuardian, btnHeir].forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        // auto update the welcome banner if already connected
        if(!appDashboard.classList.contains("hidden")) {
            document.getElementById("display-wallet").textContent = MOCK_WALLETS[currentRole];
            switchView("mainMenu");
        }
    }

    btnOwner.onclick = () => setRole("owner", btnOwner);
    btnGuardian.onclick = () => setRole("guardian", btnGuardian);
    btnHeir.onclick = () => setRole("heir", btnHeir);

    // Connect flow
    if (connectBtn) {
        connectBtn.addEventListener("click", () => {
            connectBtn.disabled = true;
            connectBtn.innerHTML = `Connecting...`;
            
            setTimeout(() => {
                landingPage.classList.add("hidden");
                appDashboard.classList.remove("hidden");
                document.getElementById("display-wallet").textContent = MOCK_WALLETS[currentRole];
                switchView("mainMenu");
            }, 800);
        });
    }

    // Owner logic
    document.getElementById("btn-sb-deposit").onclick = () => {
        const amt = parseFloat(document.getElementById("dep-amount").value);
        if(!amt) return;
        const btn = document.getElementById("btn-sb-deposit");
        btn.textContent = "Processing...";
        setTimeout(() => {
            vaultState.balance += amt;
            document.getElementById("sb-balance").innerHTML = `${vaultState.balance.toFixed(2)} <span class="unit">ETH</span>`;
            document.getElementById("owner-msg").textContent = "Deposit successful!";
            document.getElementById("owner-msg").style.color = "var(--success)";
            btn.textContent = "Deposit";
            document.getElementById("dep-amount").value = "";
        }, 1200);
    };

    document.getElementById("btn-sb-withdraw").onclick = () => {
        const amt = parseFloat(document.getElementById("with-amount").value);
        if(!amt || amt > vaultState.balance) {
            alert("Invalid amount.");
            return;
        }
        const btn = document.getElementById("btn-sb-withdraw");
        btn.textContent = "Requesting...";
        setTimeout(() => {
            vaultState.hasPendingRequest = true;
            vaultState.requestAmount = amt;
            document.getElementById("owner-msg").textContent = "Withdrawal request sent to Guardians.";
            document.getElementById("owner-msg").style.color = "var(--emerald)";
            btn.textContent = "Request";
            document.getElementById("with-amount").value = "";
        }, 1200);
    };

    // Guardian Logic
    document.getElementById("btn-check-requests").onclick = () => {
        const addr = document.getElementById("guardian-sb-address").value;
        const container = document.getElementById("guardian-requests");
        const msg = document.getElementById("guardian-msg");
        msg.textContent = "";

        if(currentRole !== "guardian") {
            container.innerHTML = "";
            msg.style.color = "var(--danger)";
            msg.textContent = "Permission Denied: You are not connecting as Guardian. Switch role from Demo Controls.";
            return;
        }

        container.innerHTML = "<p class='placeholder-text text-center'>Fetching requests...</p>";
        
        setTimeout(() => {
            if(!vaultState.hasPendingRequest) {
                container.innerHTML = "<p class='placeholder-text text-center'>No active requests found.</p>";
                return;
            }

            container.innerHTML = `
                <div class="action-card" id="req-card">
                    <h4>Request #001</h4>
                    <p class="mb-1">Amount: <b>${vaultState.requestAmount} ETH</b></p>
                    <p class="text-sm mb-1">To: ${MOCK_WALLETS.owner}</p>
                    <div class="split-container">
                        <button class="split btn secondary-btn" onclick="approveReq()">Approve</button>
                        <button class="split btn outline-btn danger-outline" onclick="rejectReq()">Reject</button>
                    </div>
                </div>
            `;
        }, 800);
    };

    // Heir Logic
    document.getElementById("btn-check-heir").onclick = () => {
        const stats = document.getElementById("heir-stats");
        const msg = document.getElementById("heir-msg");
        
        if(currentRole !== "heir") {
            stats.classList.add("hidden");
            msg.style.color = "var(--danger)";
            msg.textContent = "Permission Denied: You are not connecting as Heir. Switch role from Demo Controls.";
            return;
        }

        msg.textContent = "";
        stats.classList.remove("hidden");

        if (heirInterval) clearInterval(heirInterval);

        updateHeirTimer();
        heirInterval = setInterval(updateHeirTimer, 1000);
    };

    // Create / Deploy Logic
    document.getElementById("create-sb-form").onsubmit = (e) => {
        e.preventDefault();
        const msg = document.getElementById("create-msg");
        msg.textContent = "Deploying Vault...";
        msg.style.color = "var(--text-primary)";
        setTimeout(() => {
            msg.textContent = "Vault successfully deployed!";
            msg.style.color = "var(--success)";
            setTimeout(() => switchView("mainMenu"), 2000);
        }, 1500);
    };

});

// Global functions for inline onclicks
window.switchView = function(viewName) {
    Object.values(views).forEach(v => {
        if(v) { v.classList.remove("active"); v.classList.add("hidden"); }
    });
    if(views[viewName]) {
        views[viewName].classList.remove("hidden");
        views[viewName].classList.add("active");
    }
};

window.approveReq = function() {
    alert("Approving... (Mocked)");
    vaultState.balance -= vaultState.requestAmount;
    vaultState.hasPendingRequest = false;
    vaultState.requestAmount = 0;
    document.getElementById("req-card").innerHTML = "<p style='color:var(--success)'>Approved successfully.</p>";
};

window.rejectReq = function() {
    alert("Rejecting... (Mocked)");
    vaultState.hasPendingRequest = false;
    vaultState.requestAmount = 0;
    document.getElementById("req-card").innerHTML = "<p style='color:var(--danger)'>Rejected successfully.</p>";
};

function updateHeirTimer() {
    const el = document.getElementById("heir-countdown");
    if (vaultState.heirTimeRemaining <= 0) {
        clearInterval(heirInterval);
        el.textContent = "AVAILABLE";
        el.style.color = "var(--success)";
        document.getElementById("btn-inherit").disabled = false;
        
        document.getElementById("btn-inherit").onclick = () => {
            const btn = document.getElementById("btn-inherit");
            btn.textContent = "Claiming...";
            setTimeout(() => {
                alert("You successfully claimed the Vault funds!");
                btn.textContent = "Claimed!";
                btn.disabled = true;
            }, 1500);
        };
    } else {
        vaultState.heirTimeRemaining -= 1;
        const diff = vaultState.heirTimeRemaining;
        const d = Math.floor(diff / (60 * 60 * 24));
        const h = Math.floor((diff / (60 * 60)) % 24);
        const m = Math.floor((diff / 60) % 60);
        const s = Math.floor(diff % 60);
        el.textContent = `${d}d ${h}h ${m}m ${s}s`;
        el.style.color = "var(--emerald)";
    }
}

window.fastForwardTime = function() {
    vaultState.heirTimeRemaining = 0;
    updateHeirTimer();
};
