const replies = {
    welcome: "مساء الخير يافندم اهلا بحضرتك في ايزي اوردرز , كل سنة وحضرتك طيب.. تحب اساعد حضرتك تكمل عملية التسجيل وتفعيل المتجر بتاعك ",
    product: "دي طريقة رفع المنتجات على متجرك https://youtu.be/tWs2gQ6DgII?si=xpeZPBX74fh1ga6Pودا لينك قناة اليوتيوب بتاعتنا فيها شرح لكل جزئية في المنصة https://www.youtube.com/@easy-orders",
    domain: "تقدر تربط الدومين من الإعدادات → الدومين.",
    follow: "حابب أطمن هل قدرت تكمل إعداد المتجر؟"
};

function getTextarea() {
    return document.querySelector('textarea[placeholder="Type a message"]');
}

function setNativeValue(element, value) {
    const valueSetter = Object.getOwnPropertyDescriptor(
        element.__proto__,
        "value"
    ).set;

    valueSetter.call(element, value);

    element.dispatchEvent(new Event("input", { bubbles: true }));
}

function insertButtons() {

    const textarea = getTextarea();
    if (!textarea) return;

    if (document.getElementById("quick-replies")) return;

    const container = document.createElement("div");
    container.id = "quick-replies";
    container.style.marginBottom = "8px";

    Object.keys(replies).forEach(key => {

        const btn = document.createElement("button");
        btn.innerText = key;

        btn.style.marginRight = "6px";
        btn.style.padding = "6px 10px";
        btn.style.border = "none";
        btn.style.background = "#2d89ef";
        btn.style.color = "white";
        btn.style.borderRadius = "6px";
        btn.style.cursor = "pointer";

        btn.onclick = () => {

            const box = getTextarea();
            if (!box) return;

            box.focus();

            setNativeValue(box, replies[key]);

        };

        container.appendChild(btn);
    });

    textarea.parentNode.parentNode.insertBefore(container, textarea.parentNode);

}

setInterval(insertButtons, 2000);