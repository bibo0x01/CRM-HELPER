// ================= DATA (LOAD FROM STORAGE) =================
let replies = JSON.parse(localStorage.getItem("replies") || "{}");

function saveReplies() {
    localStorage.setItem("replies", JSON.stringify(replies));
}

function insertSidebar() {
    if (document.getElementById("crm-sidebar")) return;

    const sidebar = document.createElement("div");
    sidebar.id = "crm-sidebar";

    sidebar.innerHTML = `
        <input type="text" id="searchBox" placeholder="Search reply or type /..." />

        <div style="margin:8px 0;">
            <input id="newKey" placeholder="Reply name" />
            <textarea id="newValue" placeholder="Reply text"></textarea>
            <button id="addReplyBtn">Add Reply</button>
        </div>

        <div id="replies"></div>
    `;

    document.body.appendChild(sidebar);

    const container = document.getElementById("replies");

    // ================= RENDER =================
    function renderReplies(filter) {
        filter = filter || "";
        container.innerHTML = "";

        const keys = Object.keys(replies).filter(key =>
            key.toLowerCase().includes(filter.toLowerCase())
        );

        if (keys.length === 0) {
            container.innerHTML = `<div style="opacity:0.6;padding:10px;">No replies yet...</div>`;
            return;
        }

        keys.forEach(key => {
            const row = document.createElement("div");
            row.style = "display:flex;gap:5px;align-items:center;margin:5px 0;";

            // BUTTON (send)
            const btn = document.createElement("button");
            btn.className = "reply-btn";
            btn.innerText = key;

            btn.onclick = () => sendReply(replies[key]);

            // EDIT
            const editBtn = document.createElement("button");
            editBtn.innerText = "✏️";
            editBtn.onclick = () => {
                const newText = prompt("Edit reply:", replies[key]);
                if (!newText) return;

                replies[key] = newText;
                saveReplies();
                renderReplies(document.getElementById("searchBox").value);
            };

            // DELETE
            const delBtn = document.createElement("button");
            delBtn.innerText = "🗑️";
            delBtn.onclick = () => {
                if (!confirm("Delete this reply?")) return;
                delete replies[key];
                saveReplies();
                renderReplies(document.getElementById("searchBox").value);
            };

            row.appendChild(btn);
            row.appendChild(editBtn);
            row.appendChild(delBtn);

            container.appendChild(row);
        });
    }

    renderReplies("");


    function sendReply(text) {
        const textarea = document.querySelector('textarea[placeholder="Type a message"]');
        if (!textarea) return;

        textarea.focus();

        const setter = Object.getOwnPropertyDescriptor(
            textarea.__proto__,
            "value"
        ).set;

        setter.call(textarea, text);

        textarea.dispatchEvent(new Event("input", { bubbles: true }));

        setTimeout(() => {
            textarea.dispatchEvent(
                new KeyboardEvent("keydown", {
                    bubbles: true,
                    cancelable: true,
                    key: "Enter",
                    code: "Enter"
                })
            );
        }, 100);
    }

    document.getElementById("searchBox").addEventListener("input", function (e) {
        const val = e.target.value.trim();

        // 🧠 SHORTCUT MODE
        if (val.startsWith("/")) {
            const shortcut = val.replace("/", "");

            const matchKey = Object.keys(replies).find(k =>
                k.toLowerCase() === shortcut.toLowerCase()
            );

            if (matchKey) {
                sendReply(replies[matchKey]);
            }
            return;
        }

        renderReplies(val);
    });

    document.getElementById("addReplyBtn").onclick = function () {
        const key = document.getElementById("newKey").value.trim();
        const value = document.getElementById("newValue").value.trim();

        if (!key || !value) return alert("اكتب الاسم والرد");

        replies[key] = value;

        saveReplies();

        document.getElementById("newKey").value = "";
        document.getElementById("newValue").value = "";

        renderReplies(document.getElementById("searchBox").value);
    };
}

setInterval(insertSidebar, 2000);