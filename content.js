let replies = JSON.parse(localStorage.getItem("replies") || "{}");
let pinned = JSON.parse(localStorage.getItem("pinned") || "[]");

function saveAll() {
    localStorage.setItem("replies", JSON.stringify(replies));
    localStorage.setItem("pinned", JSON.stringify(pinned));
}

function init() {
    if (document.getElementById("crm-sidebar")) return;

    const toggle = document.createElement("div");
    toggle.id = "crm-toggle";
    toggle.innerText = "💬";

    const sidebar = document.createElement("div");
    sidebar.id = "crm-sidebar";

    sidebar.innerHTML = `
        <div class="crm-header">
            <span>Quick Replies</span>
            <button id="closeSidebar">✖</button>
        </div>

        <input type="text" id="searchBox" placeholder="Search replies..." />

        <div class="add-box">
            <input id="newKey" placeholder="Reply name" />
            <textarea id="newValue" placeholder="Reply text (Ctrl+Enter)" ></textarea>
            <button id="addReplyBtn">Add Reply</button>
        </div>

        <div id="replies"></div>
    `;

    document.body.appendChild(toggle);
    document.body.appendChild(sidebar);

    const container = document.getElementById("replies");
    const searchBox = document.getElementById("searchBox");

    toggle.onclick = () => sidebar.classList.toggle("open");
    document.getElementById("closeSidebar").onclick = () => sidebar.classList.remove("open");

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") sidebar.classList.remove("open");
    });

    function highlight(text, query) {
        if (!query) return text;

        const regex = new RegExp(`(${query})`, "gi");
        return text.replace(regex, `<mark>$1</mark>`);
    }

    function render(filter = "") {
        container.innerHTML = "";

        let keys = Object.keys(replies).filter(k =>
            k.toLowerCase().includes(filter.toLowerCase())
        );

        keys.sort((a, b) => {
            const ap = pinned.includes(a) ? -1 : 0;
            const bp = pinned.includes(b) ? -1 : 0;
            return ap - bp;
        });

        if (!keys.length) {
            container.innerHTML = `<div class="empty">No replies</div>`;
            return;
        }

        keys.forEach(key => {
            const row = document.createElement("div");
            row.className = "reply-row";

            const btn = document.createElement("button");
            btn.className = "reply-btn";
            btn.innerHTML = highlight(key, filter);
            btn.onclick = () => send(replies[key]);


            const pin = document.createElement("button");
            pin.innerText = pinned.includes(key) ? "📌" : "📍";
            pin.onclick = () => {
                if (pinned.includes(key)) {
                    pinned = pinned.filter(p => p !== key);
                } else {
                    pinned.push(key);
                }
                saveAll();
                render(searchBox.value);
            };


            const editValue = document.createElement("button");
            editValue.innerText = "✏️";
            editValue.onclick = () => {
                const newText = prompt("Edit reply:", replies[key]);
                if (!newText) return;

                replies[key] = newText;
                saveAll();
                render(searchBox.value);
            };


            const editKey = document.createElement("button");
            editKey.innerText = "📝";
            editKey.onclick = () => {
                const newKey = prompt("Rename key:", key);
                if (!newKey || replies[newKey]) return;

                replies[newKey] = replies[key];
                delete replies[key];

                pinned = pinned.map(p => p === key ? newKey : p);

                saveAll();
                render(searchBox.value);
            };

            row.appendChild(btn);
            row.appendChild(pin);
            row.appendChild(editValue);
            row.appendChild(editKey);

            container.appendChild(row);
        });
    }

    render();

    function send(text) {
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

    searchBox.addEventListener("input", (e) => {
        render(e.target.value.trim());
    });

    document.getElementById("addReplyBtn").onclick = () => {
        const key = newKey.value.trim();
        const value = newValue.value.trim();

        if (!key || !value) return;

        replies[key] = value;
        saveAll();

        newKey.value = "";
        newValue.value = "";

        render(searchBox.value);
    };


    document.getElementById("newValue").addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.ctrlKey) {
            document.getElementById("addReplyBtn").click();
        }
    });
}

window.addEventListener("load", init);