// ====== YOUR LINKS ======
const IG_PROFILE_URL = "https://www.instagram.com/sheepskull00?igsh=MTh3OWRhcHduanJxOQ==";
const WHATSAPP_NUMBER = "919573958420";
// ========================

const PRICE_TEXT = "₹270";
const COD_TEXT = "No COD";
const DATA_URL = "data/designs.json";

const COLLECTIONS = [
  "All",
  "ABSTRACT",
  "ANIMAL",
  "BOSS MODE",
  "CARTOON",
  "COMIC STYLE",
  "EDGY",
  "FLUID",
  "GAMER",
  "LIMITED",
  "LOVE",
  "MANDALA",
  "MINIMAL",
  "SPIRITUALITY"
];

// DOM
const grid = document.getElementById("grid");
const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const collectionTabs = document.getElementById("collectionTabs");
const resultCount = document.getElementById("resultCount");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalCollection = document.getElementById("modalCollection");
const modalTags = document.getElementById("modalTags");
const modalId = document.getElementById("modalId");
const orderIG = document.getElementById("orderIG");
const orderWA = document.getElementById("orderWA");
const orderText = document.getElementById("orderText");
const copyBtn = document.getElementById("copyBtn");
const copyToast = document.getElementById("copyToast");

const modalScroll = document.querySelector(".modalScroll");

// Years
const year = new Date().getFullYear();
document.getElementById("year").textContent = year;
document.getElementById("year2").textContent = year;

// Links (desktop + mobile)
const ctaInstagramDesktop = document.getElementById("ctaInstagramDesktop");
const ctaWhatsappDesktop = document.getElementById("ctaWhatsappDesktop");
const ctaInstagramMobile = document.getElementById("ctaInstagramMobile");
const ctaWhatsappMobile = document.getElementById("ctaWhatsappMobile");

function waLink(text){
  if (!WHATSAPP_NUMBER || WHATSAPP_NUMBER.includes("X")) return IG_PROFILE_URL;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

ctaInstagramDesktop.href = IG_PROFILE_URL;
ctaInstagramMobile.href = IG_PROFILE_URL;

const waIntro = waLink("Hi SheepSkull! I want to order a case. Please share available models.");
ctaWhatsappDesktop.href = waIntro;
ctaWhatsappMobile.href = waIntro;

/* ---------------- Mobile menu logic ---------------- */
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

function openMenu(){
  menu.classList.add("isOpen");
  menu.setAttribute("aria-hidden", "false");
  menuBtn.setAttribute("aria-expanded", "true");
}
function closeMenu(){
  menu.classList.remove("isOpen");
  menu.setAttribute("aria-hidden", "true");
  menuBtn.setAttribute("aria-expanded", "false");
}
function toggleMenu(){
  menu.classList.contains("isOpen") ? closeMenu() : openMenu();
}

if (menuBtn && menu){
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("isOpen")) return;
    const inside = menu.contains(e.target) || menuBtn.contains(e.target);
    if (!inside) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => closeMenu()));
}

/* ---------------- Best body scroll lock (mobile safe) ---------------- */
let scrollYBeforeModal = 0;

function lockBodyScroll(){
  scrollYBeforeModal = window.scrollY || 0;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollYBeforeModal}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
}

function unlockBodyScroll(){
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollYBeforeModal);
}

/* ---------------- Catalog ---------------- */
let designs = [];
let activeCollection = "All";
let q = "";
let currentOrderMessage = "";

function normalize(s){ return (s || "").toLowerCase().trim(); }

function designImagePath(d){
  return `assets/designs/${encodeURIComponent(d.collection)}/${encodeURIComponent(d.file)}`;
}

function buildOrderMessage(d){
  return [
    "Hi SheepSkull! I want to order this design:",
    `Design ID: ${d.id}`,
    `Design Name: ${d.name || ("Design " + d.id)}`,
    `Collection: ${d.collection}`,
    `Price: ${PRICE_TEXT}`,
    `COD: ${COD_TEXT}`,
    "",
    "Phone Brand & Model: (example: iPhone 14 / S23 Ultra / OnePlus 11)",
    "Quantity: 1"
  ].join("\n");
}

async function copyToClipboard(text){
  try{
    await navigator.clipboard.writeText(text);
    copyToast.textContent = "✅ Copied! Now paste in Instagram/WhatsApp.";
    setTimeout(()=> copyToast.textContent = "", 2500);
  }catch{
    orderText.focus();
    orderText.select();
    document.execCommand("copy");
    copyToast.textContent = "✅ Copied! Now paste in Instagram/WhatsApp.";
    setTimeout(()=> copyToast.textContent = "", 2500);
  }
}

function buildTabs(){
  collectionTabs.innerHTML = "";
  for (const c of COLLECTIONS){
    const btn = document.createElement("button");
    btn.className = "tab" + (c === activeCollection ? " active" : "");
    btn.type = "button";
    btn.textContent = c;
    btn.addEventListener("click", () => {
      activeCollection = c;
      buildTabs();
      render();
    });
    collectionTabs.appendChild(btn);
  }
}

function filtered(){
  const s = normalize(q);
  return designs.filter(d => {
    const col = (d.collection || "").trim();
    const hitCollection = activeCollection === "All" || col === activeCollection;
    const hay = normalize(`${d.id} ${d.name} ${col} ${(d.tags || []).join(" ")}`);
    const hitSearch = !s || hay.includes(s);
    return hitCollection && hitSearch;
  });
}

function render(){
  const items = filtered();
  grid.innerHTML = "";
  resultCount.textContent = `${items.length} design${items.length === 1 ? "" : "s"}`;

  if (!items.length){
    const empty = document.createElement("div");
    empty.className = "muted";
    empty.textContent = "No designs found. Try a different keyword or collection.";
    grid.appendChild(empty);
    return;
  }

  const frag = document.createDocumentFragment();

  items.forEach(d => {
    const card = document.createElement("div");
    card.className = "card";
    card.tabIndex = 0;

    const img = document.createElement("img");
    img.src = designImagePath(d);
    img.alt = d.name || `Design ${d.id}`;
    img.loading = "lazy";
    img.decoding = "async";

    const meta = document.createElement("div");
    meta.className = "cardMeta";

    const name = document.createElement("div");
    name.className = "cardName";
    name.textContent = d.name || `Design ${d.id}`;

    const sub = document.createElement("div");
    sub.className = "cardSub";
    sub.textContent = d.collection || "";

    meta.appendChild(name);
    meta.appendChild(sub);

    card.appendChild(img);
    card.appendChild(meta);

    card.addEventListener("click", () => openModal(d));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openModal(d);
    });

    frag.appendChild(card);
  });

  grid.appendChild(frag);
}

function openModal(d){
  // Reset scroll to top every time ✅
  if (modalScroll) modalScroll.scrollTop = 0;

  modalImg.src = designImagePath(d);
  modalImg.alt = d.name || `Design ${d.id}`;
  modalName.textContent = d.name || `Design ${d.id}`;
  modalCollection.textContent = d.collection || "";
  modalId.textContent = d.id || "";

  modalTags.innerHTML = "";
  (d.tags || []).slice(0, 12).forEach(t => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = t;
    modalTags.appendChild(span);
  });

  currentOrderMessage = buildOrderMessage(d);
  orderText.value = currentOrderMessage;
  copyToast.textContent = "";

  orderIG.href = IG_PROFILE_URL;
  orderIG.onclick = async () => { await copyToClipboard(currentOrderMessage); };

  orderWA.href = waLink(currentOrderMessage);
  copyBtn.onclick = () => copyToClipboard(currentOrderMessage);

  modal.setAttribute("aria-hidden", "false");
  lockBodyScroll(); // ✅ best approach
}

function closeModal(){
  modal.setAttribute("aria-hidden", "true");
  unlockBodyScroll();
}

modal.addEventListener("click", (e) => {
  if (e.target?.dataset?.close === "true") closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
});

searchInput.addEventListener("input", (e) => { q = e.target.value; render(); });

clearBtn.addEventListener("click", () => {
  q = "";
  searchInput.value = "";
  activeCollection = "All";
  buildTabs();
  render();
});

async function init(){
  buildTabs();
  const res = await fetch(DATA_URL, { cache: "no-store" });
  designs = await res.json();
  render();
}
init();
