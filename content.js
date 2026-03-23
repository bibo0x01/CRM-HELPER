const replies = {
welcome: "مساء الخير يا فندم 👋 مع حضرتك يوسف من EasyOrders، أتمنى تكون بخير 🙏\nحابب أساعدك تكمل تفعيل متجرك وتبدأ البيع؟",


activate: "علشان تبدأ تشتغل على متجرك محتاج تفعل الحساب الأول عن طريق شحن المحفظة 👍 وبعدها تقدر تضيف منتجات وتبدأ تستقبل طلبات.",

wallet: "شحن المحفظة معناه إنك بتحط رصيد في حسابك، وبيتم خصم تكلفة بسيطة جدًا على كل أوردر فقط (مفيش اشتراك شهري) 👌",

walletVideo: "تقدر تشوف طريقة شحن المحفظة خطوة بخطوة من الفيديو ده 👇\nhttps://youtu.be/Sa2-Alb8Lvg",

domain: "تقدر تربط الدومين من إعدادات المتجر → الدومين 👌 ولو حابب شرح بالفيديو:",

domainVideo: "ده شرح ربط الدومين خطوة بخطوة 👇\nhttps://youtu.be/llFb2ayELFs",

product: "دي طريقة إضافة المنتجات على متجرك 👇\nhttps://www.youtube.com/watch?v=tWs2gQ6DgII",

fullTutorial: "تقدر تشوف الشرح الكامل للمنصة من هنا 👇\nhttps://www.youtube.com/watch?v=dmeKAMb_1Zc",

shipping: "تقدر تتعاقد مع شركة الشحن اللي تناسبك، ولو موجودة عندنا تقدر تربطها بسهولة داخل المنصة 🚚",

payment: "تقدر تستقبل الدفع عن طريق المحافظ الإلكترونية أو الفيزا البنكية 💳 بكل سهولة.",

pricing: "إحنا مش بناخد اشتراك شهري 👍\nبيتم خصم حوالي 4 سنت على كل أوردر فقط.",

follow: "حابب أطمن هل قدرت تكمل إعداد المتجر؟ 👀 لو في أي حاجة واقفة معاك قولّي وأنا أساعدك.",

sendStore: "بعد ما تفعل المتجر ابعتلي اللينك علشان أتأكد إن كل حاجة تمام ونبدأ نجهزه للبيع 🚀",

close: "تمام كده 🔥 أول ما تخلص الإعدادات هتقدر تبدأ تستقبل طلبات فورًا، وأنا معاك لحد أول أوردر إن شاء الله."


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

    // زرار تصدير كل العملاء
    const exportAllBtn = document.createElement("button");
    exportAllBtn.innerText = "Export All CSV";
    exportAllBtn.style.marginRight = "6px";
    exportAllBtn.style.padding = "6px 10px";
    exportAllBtn.style.border = "none";
    exportAllBtn.style.background = "#28a745";
    exportAllBtn.style.color = "white";
    exportAllBtn.style.borderRadius = "6px";
    exportAllBtn.style.cursor = "pointer";
    exportAllBtn.onclick = () => exportCustomersCSV("allCustomers");
    container.appendChild(exportAllBtn);

    // زرار تصدير العملاء اللي تم شحنهم
    const exportShippedBtn = document.createElement("button");
    exportShippedBtn.innerText = "Export Shipped CSV";
    exportShippedBtn.style.marginRight = "6px";
    exportShippedBtn.style.padding = "6px 10px";
    exportShippedBtn.style.border = "none";
    exportShippedBtn.style.background = "#ff9800";
    exportShippedBtn.style.color = "white";
    exportShippedBtn.style.borderRadius = "6px";
    exportShippedBtn.style.cursor = "pointer";
    exportShippedBtn.onclick = () => exportCustomersCSV("shippedCustomers");
    container.appendChild(exportShippedBtn);

    // زرار لإضافة العميل الحالي للشحن
    const addShippedBtn = document.createElement("button");
    addShippedBtn.innerText = "Add to Shipped";
    addShippedBtn.style.marginRight = "6px";
    addShippedBtn.style.padding = "6px 10px";
    addShippedBtn.style.border = "none";
    addShippedBtn.style.background = "#d32f2f";
    addShippedBtn.style.color = "white";
    addShippedBtn.style.borderRadius = "6px";
    addShippedBtn.style.cursor = "pointer";
    addShippedBtn.onclick = addCustomerToShipped;
    container.appendChild(addShippedBtn);

    textarea.parentNode.parentNode.insertBefore(container, textarea.parentNode);
}

function getCustomerData() {
    const name =
        document.querySelector("header h6")?.innerText ||
        document.querySelector(".MuiTypography-h6")?.innerText ||
        "";
    const phone =
        document.querySelector('a[href^="tel"]')?.innerText ||
        document.body.innerText.match(/\+?\d{10,15}/)?.[0] ||
        "";
    return { name, phone, date: new Date().toISOString() };
}

function saveCustomer(customer, key = "allCustomers") {
    if (!customer.phone) return;

    chrome.storage.local.get([key], (result) => {
        const customers = result[key] || [];
        const exists = customers.find(c => c.phone === customer.phone);
        if (!exists) {
            customers.push(customer);
            chrome.storage.local.set({ [key]: customers });
            console.log(`Customer saved in ${key}:`, customer);
        }
    });
}

function watchCustomer() {
    const customer = getCustomerData();
    if (customer.phone) saveCustomer(customer, "allCustomers");
}

function addCustomerToShipped() {
    const customer = getCustomerData();
    if (!customer.phone) return;
    saveCustomer(customer, "shippedCustomers");
    alert(`تم إضافة ${customer.name} للشحن`);
}

function exportCustomersCSV(key) {
    chrome.storage.local.get([key], (result) => {
        const customers = result[key] || [];
        if (!customers.length) {
            alert("لا يوجد عملاء محفوظين");
            return;
        }

        let csv = "Name,Phone,Date\n";
        customers.forEach(c => {
            csv += `${c.name},${c.phone},${c.date}\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${key}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}

setInterval(insertButtons, 2000);
setInterval(watchCustomer, 1500);