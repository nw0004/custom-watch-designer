"use client";
import { useState, useRef } from "react";

// ─── ข้อมูลตัวเลือกทั้งหมด ───────────────────────────────────
const FACES = [
  { id: "black",  name: "Black Classic",  th: "คลาสสิคดำ",      fill: "#111111", sw: "#111111" },
  { id: "silver", name: "Silver Sunray",  th: "ซิลเวอร์ซันเรย์", fill: "#C8C8C8", sw: "#C8C8C8" },
  { id: "blue",   name: "Blue Ocean",     th: "บลูโอเชียน",      fill: "#1A3A5C", sw: "#1A3A5C" },
  { id: "white",  name: "White Minimal",  th: "ไวท์มินิมอล",     fill: "#F0EDE8", sw: "#F0EDE8" },
];

const STRAPS = [
  { id: "mesh",  name: "Stainless Mesh", th: "เมชสแตนเลส",   fill: "#A8A8A8", sw: "#A8A8A8", extra: 0    },
  { id: "brown", name: "Brown Leather",  th: "หนังน้ำตาล",    fill: "#6B4226", sw: "#6B4226", extra: 1000 },
  { id: "black", name: "Black Leather",  th: "หนังดำ",        fill: "#222222", sw: "#222222", extra: 1000 },
  { id: "steel", name: "Silver Steel",   th: "สแตนเลสเงิน",   fill: "#C0C0C0", sw: "#C0C0C0", extra: 0    },
];

const CASES = [
  { id: "silver",  name: "Silver",    th: "ซิลเวอร์",   fill: "#C0C0C0", sw: "#C0C0C0" },
  { id: "black",   name: "Black",     th: "แบล็ค",      fill: "#2A2A2A", sw: "#2A2A2A" },
  { id: "gold",    name: "Gold",      th: "ทอง",        fill: "#C9A84C", sw: "#C9A84C" },
  { id: "rosegold",name: "Rose Gold", th: "โรสโกลด์",   fill: "#C89B8C", sw: "#C89B8C" },
];

const STEP_LABELS = [
  "Step 1 of 4 — Watch Face (หน้าปัด)",
  "Step 2 of 4 — Strap (สาย)",
  "Step 3 of 4 — Case & Colour (ตัวเรือน)",
  "Step 4 of 4 — Engraving (สลักชื่อ)",
];

// ─── ราคา ────────────────────────────────────────────────────
const BASE_PRICE     = 8900;
const UPLOAD_PRICE   = 2000;
const ENGRAVE_PRICE  = 500;
const DELIVERY_PRICE = 150;

function calcPrice(props: any){
  const { strap, faceType, engraving } = props;

  let p = BASE_PRICE;
  p += strap?.extra ?? 0;
  if (faceType === "upload") p += UPLOAD_PRICE;
  if (engraving?.trim()) p += ENGRAVE_PRICE;
  return p;
}

function fmt(n: number) {   // ✅ บอก TypeScript ว่า n เป็น number
  return n.toLocaleString("th-TH");
}

// ─── SVG Watch Preview ────────────────────────────────────────
function WatchSVG({ face, strap, cas, engraving, faceType, uploadUrl, imgScale, imgRotate }) {
  const faceFill  = face?.fill  ?? "#111";
  const strapFill = strap?.fill ?? "#4A4A4A";
  const casFill   = cas?.fill   ?? "#C0C0C0";
  const mColor    = faceFill === "#F0EDE8" ? "#2A2A2A" : "#C9A84C";
  const hColor    = faceFill === "#F0EDE8" ? "#1A1A1A" : "#E8C96A";
  const bevColor  = cas?.id === "gold" ? "#A0792E" : casFill;
  const logoColor = faceFill === "#F0EDE8" ? "#555555" : "#C9A84C";
  const sc = imgScale / 50;

  return (
    <svg viewBox="0 0 200 260" width={190} height={247} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="dc"><circle cx="100" cy="130" r="54" /></clipPath>
        <radialGradient id="fg" cx="38%" cy="33%" r="60%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.07)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
        </radialGradient>
      </defs>

      {/* Strap top */}
      <rect x="77" y="12" width="46" height="48" rx="5" fill={strapFill} />
      <rect x="80" y="16" width="40" height="40" rx="3" fill="none"
        stroke="rgba(255,255,255,0.05)" strokeWidth=".8" strokeDasharray="3 2" />

      {/* Case */}
      <circle cx="100" cy="130" r="68" fill={casFill} />
      <circle cx="100" cy="130" r="62" fill="none" stroke={bevColor} strokeWidth="3.5" />

      {/* Face */}
      <circle cx="100" cy="130" r="56" fill={faceFill} />
      <circle cx="100" cy="130" r="56" fill="url(#fg)" />

      {/* Hour markers */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
        const rad = (deg - 90) * Math.PI / 180;
        const major = i % 3 === 0;
        const r1 = major ? 46 : 48;
        const r2 = major ? 54 : 52;
        return (
          <line key={deg}
            x1={100 + r1 * Math.cos(rad)} y1={130 + r1 * Math.sin(rad)}
            x2={100 + r2 * Math.cos(rad)} y2={130 + r2 * Math.sin(rad)}
            stroke={mColor} strokeWidth={major ? 1.8 : 1} strokeLinecap="round"
          />
        );
      })}

      {/* Brand */}
      <text x="100" y="119" textAnchor="middle"
        fontFamily="Georgia, serif" fontSize="7" fill={logoColor} letterSpacing="2.5">MAISON</text>
      <text x="100" y="127" textAnchor="middle"
        fontFamily="Georgia, serif" fontSize="5" fill="#5A5650" letterSpacing="1.8">CHRONO</text>

      {/* Upload overlay */}
      {uploadUrl && faceType === "upload" && (
        <image href={uploadUrl} x="46" y="76" width="108" height="108"
          clipPath="url(#dc)" opacity=".55" preserveAspectRatio="xMidYMid slice"
          transform={`translate(100,130) scale(${sc}) rotate(${imgRotate}) translate(-100,-130)`}
        />
      )}

      {/* Hands */}
      <line x1="100" y1="130" x2="100" y2="100" stroke={hColor} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="100" y1="130" x2="122" y2="130" stroke={hColor} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="100" y1="130" x2="100" y2="87"  stroke="#F5F0E8" strokeWidth=".8" strokeLinecap="round" opacity=".6" />
      <circle cx="100" cy="130" r="3"   fill="#C9A84C" />
      <circle cx="100" cy="130" r="1.2" fill="#000" />

      {/* Crown */}
      <rect x="164" y="124" width="9" height="14" rx="3" fill={casFill} />

      {/* Strap bottom */}
      <rect x="77" y="198" width="46" height="48" rx="5" fill={strapFill} />
      <rect x="80" y="202" width="40" height="40" rx="3" fill="none"
        stroke="rgba(255,255,255,0.05)" strokeWidth=".8" strokeDasharray="3 2" />

      {/* Buckle */}
      <rect x="88" y="234" width="24" height="9" rx="2" fill="none"
        stroke={cas?.id === "gold" ? "#C9A84C" : "#888888"} strokeWidth=".9" />
      <line x1="100" y1="234" x2="100" y2="243"
        stroke={cas?.id === "gold" ? "#C9A84C" : "#888888"} strokeWidth=".7" />

      {/* Engraving on strap */}
      {engraving && (
        <text x="100" y="227" textAnchor="middle"
          fontFamily="Georgia, serif" fontStyle="italic"
          fontSize="6.5" fill="rgba(201,168,76,0.4)" letterSpacing=".8">
          {engraving.slice(0, 20)}
        </text>
      )}
    </svg>
  );
}

// ─── Stepper ──────────────────────────────────────────────────
function Stepper({ step }) {
  return (
    <div className="px-5 pt-4">
      <div className="flex items-center">
        {[1, 2, 3, 4].map((n, i) => (
          <div key={n} className={`flex items-center ${i < 3 ? "flex-1" : ""}`}>
            {/* Dot */}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0 transition-all duration-300
              ${n < step  ? "bg-yellow-500 text-black"
              : n === step ? "border border-yellow-500 text-yellow-500"
              :              "border border-zinc-700 text-zinc-600"}`}>
              {n < step ? "✓" : n}
            </div>
            {/* Line */}
            {i < 3 && (
              <div className="flex-1 h-px mx-1 bg-zinc-800 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-yellow-500 transition-all duration-500"
                  style={{ width: n < step ? "100%" : "0%" }} />
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-[9px] text-zinc-600 tracking-widest uppercase mt-3 text-center">
        {STEP_LABELS[step - 1]}
      </p>
    </div>
  );
}

// ─── Option Card ─────────────────────────────────────────────
function OptionCard({ option, selected, onSelect }) {
  const isSel = selected?.id === option.id;
  return (
    <button onClick={() => onSelect(option)}
      className={`relative text-left p-3 rounded-sm border transition-all duration-200
        ${isSel ? "border-yellow-500 bg-yellow-500/5" : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"}`}>
      {isSel && <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-yellow-500" />}
      <div className="w-8 h-8 rounded-full mb-3 border border-white/10"
        style={{ backgroundColor: option.sw }} />
      <p className="text-[11px] text-white/90 leading-tight">{option.name}</p>
      <p className="text-[10px] text-zinc-500 mt-0.5">{option.th}</p>
      {option.extra != null && (
        <span className={`inline-block mt-2 text-[9px] px-2 py-0.5 rounded-full
          ${option.extra > 0 ? "bg-yellow-500/10 text-yellow-500" : "bg-white/[0.03] text-zinc-500"}`}>
          {option.extra > 0 ? `+${fmt(option.extra)} THB` : "Included"}
        </span>
      )}
    </button>
  );
}

// ─── Step 1: Face ─────────────────────────────────────────────
function StepFace({ face, setFace, faceType, setFaceType, uploadUrl, setUploadUrl, setUploadName, imgScale, setImgScale, imgRotate, setImgRotate }) {
  const fileRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("ไฟล์ใหญ่เกิน 5MB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { setUploadUrl(ev.target.result); setUploadName(file.name); };
    reader.readAsDataURL(file);
  }

  return (
    <div className="px-4 pb-2">
      <h2 className="text-2xl font-light mb-0.5" style={{ fontFamily: "Georgia, serif" }}>Watch Face</h2>
      <p className="text-[10px] text-zinc-500 tracking-widest uppercase mb-4">เลือกหน้าปัดนาฬิกา</p>

      {/* Face type tabs */}
      <div className="flex border-b border-zinc-800 mb-4">
        {[{ id: "basic", label: "Basic" }, { id: "upload", label: "อัปโหลดลาย +2,000" }].map(t => (
          <button key={t.id} onClick={() => setFaceType(t.id)}
            className={`text-[10px] tracking-widest uppercase px-3 py-2 border-b-2 transition-colors
              ${faceType === t.id ? "border-yellow-500 text-yellow-500" : "border-transparent text-zinc-500"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {faceType === "basic" ? (
        <div className="grid grid-cols-2 gap-2.5">
          {FACES.map(f => <OptionCard key={f.id} option={f} selected={face} onSelect={setFace} />)}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Upload zone */}
          <div onClick={() => fileRef.current?.click()}
            className="border border-dashed border-zinc-700 rounded-sm p-5 text-center cursor-pointer hover:border-yellow-500/40 transition-colors">
            <div className="text-zinc-500 text-2xl mb-2">↑</div>
            <p className="text-xs text-zinc-400">{uploadUrl ? "เปลี่ยนรูปภาพ" : "แตะเพื่ออัปโหลด"}</p>
            <p className="text-[10px] text-zinc-600 mt-1">JPG, PNG — ไม่เกิน 5MB</p>
            {uploadUrl && <img src={uploadUrl} alt="" className="max-h-20 mx-auto mt-2 rounded object-cover border border-zinc-700" />}
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="hidden" />
          {uploadUrl && (
            <button onClick={() => { setUploadUrl(null); setUploadName(null); }}
              className="text-[10px] text-yellow-500 w-full text-center">× ลบรูปภาพ</button>
          )}

          {/* Sliders */}
          {[
            { label: "ขนาด", val: imgScale, set: setImgScale, min: 20, max: 100 },
            { label: "หมุน",  val: imgRotate, set: setImgRotate, min: 0,  max: 360 },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-3 text-[10px] text-zinc-400 px-1">
              <span className="w-10">{s.label}</span>
              <input type="range" min={s.min} max={s.max} step="1" value={s.val}
                onChange={e => s.set(+e.target.value)}
                className="flex-1 accent-yellow-500 h-1" />
              <span className="w-6 text-right">{s.val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Step 2: Strap ────────────────────────────────────────────
function StepStrap({ strap, setStrap }) {
  return (
    <div className="px-4 pb-2">
      <h2 className="text-2xl font-light mb-0.5" style={{ fontFamily: "Georgia, serif" }}>Strap</h2>
      <p className="text-[10px] text-zinc-500 tracking-widest uppercase mb-4">เลือกสายนาฬิกา</p>
      <div className="grid grid-cols-2 gap-2.5">
        {STRAPS.map(s => <OptionCard key={s.id} option={s} selected={strap} onSelect={setStrap} />)}
      </div>
    </div>
  );
}

// ─── Step 3: Case ─────────────────────────────────────────────
function StepCase({ cas, setCas }) {
  return (
    <div className="px-4 pb-2">
      <h2 className="text-2xl font-light mb-0.5" style={{ fontFamily: "Georgia, serif" }}>Case &amp; Colour</h2>
      <p className="text-[10px] text-zinc-500 tracking-widest uppercase mb-4">เลือกสีตัวเรือน</p>
      <div className="grid grid-cols-2 gap-2.5">
        {CASES.map(c => <OptionCard key={c.id} option={c} selected={cas} onSelect={setCas} />)}
      </div>
    </div>
  );
}

// ─── Step 4: Engraving ────────────────────────────────────────
function StepEngraving({ engraving, setEngraving, engDate, setEngDate }) {
  return (
    <div className="px-4 pb-2 space-y-4">
      <div>
        <h2 className="text-2xl font-light mb-0.5" style={{ fontFamily: "Georgia, serif" }}>Engraving</h2>
        <p className="text-[10px] text-zinc-500 tracking-widest uppercase mb-4">
          สลักชื่อบนนาฬิกา
          {engraving.trim() && <span className="text-yellow-500 ml-2">+{fmt(ENGRAVE_PRICE)} THB</span>}
        </p>
      </div>
      <div>
        <label className="block text-[9px] text-zinc-400 tracking-widest uppercase mb-1.5">Engraving Text</label>
        <input type="text" maxLength={20} placeholder="ข้อความของคุณ..."
          value={engraving} onChange={e => setEngraving(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-3.5 py-3 rounded-sm placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500 transition-colors" />
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-zinc-600">แสดงบนสายนาฬิกา</span>
          <span className={`text-[9px] ${engraving.length >= 20 ? "text-yellow-500" : "text-zinc-600"}`}>
            {engraving.length}/20
          </span>
        </div>
      </div>
      <div>
        <label className="block text-[9px] text-zinc-400 tracking-widest uppercase mb-1.5">Special Date (optional)</label>
        <input type="date" value={engDate} onChange={e => setEngDate(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-3.5 py-3 rounded-sm focus:outline-none focus:border-yellow-500 transition-colors" />
      </div>
    </div>
  );
}

// ─── Cart Page ────────────────────────────────────────────────
function CartPage({ cart, removeItem, delivery, setDelivery, onCheckout }) {
  const sub = cart.reduce((a, c) => a + c.price, 0);
  const fee = delivery === "delivery" ? DELIVERY_PRICE : 0;

  if (cart.length === 0) return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
      <div className="w-14 h-14 rounded-full border border-zinc-800 flex items-center justify-center mb-4">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
      </div>
      <p className="text-xl font-light mb-1" style={{ fontFamily: "Georgia,serif" }}>Cart is Empty</p>
      <p className="text-xs text-zinc-500 mb-6">ยังไม่มีสินค้าในตะกร้า</p>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
      <h2 className="text-3xl font-light" style={{ fontFamily: "Georgia, serif" }}>Cart</h2>
      <p className="text-[10px] text-zinc-500 tracking-widest uppercase mb-4">ตะกร้าของคุณ — {cart.length} item{cart.length > 1 ? "s" : ""}</p>

      {/* Items */}
      {cart.map((item, i) => (
        <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-light text-base" style={{ fontFamily: "Georgia,serif" }}>Custom Timepiece #{i + 1}</span>
            <div className="flex items-center gap-3">
              <span className="font-light text-yellow-500" style={{ fontFamily: "Georgia,serif" }}>{fmt(item.price)} THB</span>
              <button onClick={() => removeItem(item.id)} className="text-zinc-600 hover:text-red-400 transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {[["Face", item.face], ["Strap", item.strap], ["Case", item.cas], ["Engrave", item.engraving || "—"]].map(([k, v]) => (
              <div key={k}>
                <span className="block text-[9px] text-zinc-500 uppercase tracking-widest mb-0.5">{k}</span>
                <span className="text-[11px] text-white">{v}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Delivery */}
      <div>
        <p className="text-[9px] text-zinc-500 tracking-widest uppercase mb-2 mt-2">Delivery Option</p>
        {[
          { id: "pickup",   label: "รับที่ร้าน",     sub: "Pick up in store — Free" },
          { id: "delivery", label: "จัดส่งถึงบ้าน",  sub: `Home Delivery — +${fmt(DELIVERY_PRICE)} THB` },
        ].map(d => (
          <button key={d.id} onClick={() => setDelivery(d.id)}
            className={`w-full border rounded-sm p-3 flex items-center gap-3 text-left mb-2 transition-all
              ${delivery === d.id ? "border-yellow-500 bg-yellow-500/5" : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"}`}>
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0
              ${delivery === d.id ? "border-yellow-500" : "border-zinc-600"}`}>
              {delivery === d.id && <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />}
            </div>
            <div>
              <p className="text-[12px]">{d.label}</p>
              <p className="text-[10px] text-zinc-500">{d.sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Total */}
      <div className="border border-yellow-500/20 bg-yellow-500/[0.03] rounded-sm p-4 space-y-2">
        {[["Subtotal", `${fmt(sub)} THB`], ["Delivery", fee ? `${fmt(fee)} THB` : "Free"]].map(([k, v]) => (
          <div key={k} className="flex justify-between text-xs text-zinc-400"><span>{k}</span><span>{v}</span></div>
        ))}
        <div className="flex justify-between items-baseline border-t border-zinc-800 pt-2 mt-1">
          <span className="text-sm text-white">Total</span>
          <span className="font-light text-yellow-500 text-2xl" style={{ fontFamily: "Georgia,serif" }}>
            {fmt(sub + fee)} <span className="text-xs text-zinc-500">THB</span>
          </span>
        </div>
      </div>

      <button onClick={onCheckout}
        className="w-full py-4 text-black text-[11px] font-medium tracking-widest uppercase rounded-sm"
        style={{ background: "linear-gradient(135deg,#8B6914,#C9A84C,#E8C96A)" }}>
        ดำเนินการชำระเงิน →
      </button>
    </div>
  );
}

// ─── Shipping Page ────────────────────────────────────────────
function ShippingPage({ delivery, setDelivery, totalPrice, onConfirm, onBack }) {
  const fee = delivery === "delivery" ? DELIVERY_PRICE : 0;
  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
      <button onClick={onBack} className="text-[11px] text-zinc-500 tracking-widest uppercase">← Back</button>
      <h2 className="text-3xl font-light" style={{ fontFamily: "Georgia,serif" }}>Delivery</h2>
      <p className="text-[10px] text-zinc-500 tracking-widest uppercase">เลือกวิธีการรับสินค้า</p>

      {[
        { id: "pickup",   icon: "📍", label: "รับที่ร้าน",    sub: "Pick up in store — Free" },
        { id: "delivery", icon: "🚚", label: "จัดส่งถึงบ้าน", sub: `Home Delivery — +${fmt(DELIVERY_PRICE)} THB` },
      ].map(d => (
        <button key={d.id} onClick={() => setDelivery(d.id)}
          className={`w-full border rounded-sm p-3.5 flex items-center gap-3 text-left transition-all
            ${delivery === d.id ? "border-yellow-500 bg-yellow-500/5" : "border-zinc-800 bg-zinc-900"}`}>
          <div className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center
            ${delivery === d.id ? "border-yellow-500" : "border-zinc-600"}`}>
            {delivery === d.id && <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />}
          </div>
          <div>
            <p className="text-sm">{d.label}</p>
            <p className="text-[10px] text-zinc-500">{d.sub}</p>
          </div>
        </button>
      ))}

      {/* Conditional form */}
      <div className="space-y-2.5">
        {delivery === "pickup" ? (
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-sm p-3 text-[11px] text-yellow-500/80">
            คุณสามารถเลือกรับสินค้าได้ที่สาขาใกล้คุณ — ระบบจะแจ้งเตือนเมื่อสินค้าพร้อมรับ
          </div>
        ) : (
          <>
            <input type="text" placeholder="ชื่อ-นามสกุล"
              className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-3.5 py-3 rounded-sm focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-zinc-600" />
            <textarea placeholder="ที่อยู่สำหรับจัดส่ง" rows={3}
              className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-3.5 py-2.5 rounded-sm focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-zinc-600 resize-none" />
          </>
        )}
        <input type="tel" placeholder="เบอร์โทรศัพท์ติดต่อ"
          className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-3.5 py-3 rounded-sm focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-zinc-600" />
      </div>

      {/* Summary */}
      <div className="border-t border-zinc-800 pt-4 space-y-2">
        {[["ราคาสินค้า", `${fmt(totalPrice)} THB`], ["ค่าจัดส่ง", fee ? `${fmt(fee)} THB` : "Free"]].map(([k, v]) => (
          <div key={k} className="flex justify-between text-xs text-zinc-400"><span>{k}</span><span>{v}</span></div>
        ))}
        <div className="flex justify-between items-baseline border-t border-zinc-800 pt-2">
          <span className="text-sm">รวมทั้งหมด</span>
          <span className="font-light text-yellow-500 text-2xl" style={{ fontFamily: "Georgia,serif" }}>
            {fmt(totalPrice + fee)} <span className="text-xs text-zinc-500">THB</span>
          </span>
        </div>
      </div>
      <button onClick={onConfirm}
        className="w-full py-4 text-black text-[11px] font-medium tracking-widest uppercase rounded-sm"
        style={{ background: "linear-gradient(135deg,#8B6914,#C9A84C,#E8C96A)" }}>
        ยืนยันการสั่งซื้อ — Confirm Order
      </button>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────
function ProfilePage({ designs, onNew }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-5">
      {/* Header */}
      <div className="text-center pb-5 border-b border-zinc-800 mb-5">
        <div className="w-14 h-14 rounded-full border border-yellow-500/30 mx-auto mb-3 flex items-center justify-center bg-yellow-500/5"
          style={{ fontFamily: "Georgia,serif", fontSize: 22, color: "#C9A84C" }}>A</div>
        <p className="text-xl font-light" style={{ fontFamily: "Georgia,serif" }}>Atelier Member</p>
        <p className="text-[11px] text-zinc-500 mt-1">member@maison-chrono.com</p>
        <span className="inline-block mt-2 text-[9px] bg-yellow-500/10 text-yellow-500 px-3 py-0.5 rounded-full tracking-widest uppercase">Gold Member</span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-[9px] text-zinc-500 tracking-widest uppercase">My Designs ({designs.length})</p>
        <button onClick={onNew} className="text-[10px] text-yellow-500 tracking-wider uppercase">+ New</button>
      </div>

      {designs.length === 0 ? (
        <div className="text-center py-12 text-zinc-600">
          <p className="text-xl font-light mb-1" style={{ fontFamily: "Georgia,serif" }}>No saved designs</p>
          <p className="text-xs">ยังไม่มีการออกแบบที่บันทึกไว้</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {designs.slice(0, 8).map((d, i) => (
            <div key={d.id} className="bg-zinc-900 border border-zinc-800 rounded-sm p-3.5 flex justify-between items-center">
              <div>
                <p className="text-sm font-light" style={{ fontFamily: "Georgia,serif" }}>
                  Custom Timepiece #{designs.length - i}
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{d.face} · {d.strap}</p>
                <p className="text-[9px] text-zinc-600 mt-0.5">{d.saved}</p>
              </div>
              <span className="font-light text-yellow-500 text-base" style={{ fontFamily: "Georgia,serif" }}>
                {fmt(d.price)} <span className="text-[9px] text-zinc-500">THB</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home",    label: "Home",    icon: <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>, icon2: <path d="M9 21V12h6v9"/> },
  { id: "design",  label: "Design",  icon: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/><line x1="3" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21" y2="12"/></> },
  { id: "cart",    label: "Cart",    icon: <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></> },
  { id: "profile", label: "Profile", icon: <><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></> },
];

function BottomNav({ view, setView, cartCount }) {
  return (
    <nav className="flex bg-zinc-950 border-t border-zinc-900 h-14 flex-shrink-0">
      {NAV_ITEMS.map(({ id, label, icon }) => {
        const active = view === id;
        return (
          <button key={id} onClick={() => setView(id)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[9px] tracking-widest uppercase transition-colors relative
              ${active ? "text-yellow-500" : "text-zinc-600 hover:text-zinc-400"}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 1.5 : 1.2}>
              {icon}
            </svg>
            {label}
            {id === "cart" && cartCount > 0 && (
              <span className="absolute top-2 right-[calc(50%-14px)] bg-yellow-500 text-black text-[8px] font-semibold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ─── SUCCESS SCREEN ───────────────────────────────────────────
function SuccessScreen({ onHome }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
      <div className="w-16 h-16 rounded-full border border-yellow-500/40 flex items-center justify-center mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 className="text-3xl font-light mb-2" style={{ fontFamily: "Georgia,serif" }}>Order Placed</h2>
      <p className="text-sm text-zinc-400 mb-1">ดำเนินการสั่งซื้อสำเร็จ</p>
      <p className="text-[11px] text-zinc-500 mb-10">Your bespoke timepiece will be crafted<br/>within 14 business days.</p>
      <button onClick={onHome}
        className="py-4 px-10 text-black text-[11px] font-medium tracking-widest uppercase rounded-sm"
        style={{ background: "linear-gradient(135deg,#8B6914,#C9A84C,#E8C96A)" }}>
        Back to Home
      </button>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function CustomWatchApp() {
  // Navigation
  const [view, setView]     = useState("home");
  const [prevView, setPrev] = useState("home");

  // Design state
  const [step,       setStep]       = useState(1);
  const [face,       setFace]       = useState(FACES[0]);
  const [strap,      setStrap]      = useState(STRAPS[0]);
  const [cas,        setCas]        = useState(CASES[0]);
  const [engraving,  setEngraving]  = useState("");
  const [engDate,    setEngDate]    = useState("");
  const [faceType,   setFaceType]   = useState("basic");
  const [uploadUrl,  setUploadUrl]  = useState(null);
  const [uploadName, setUploadName] = useState(null);
  const [imgScale,   setImgScale]   = useState(50);
  const [imgRotate,  setImgRotate]  = useState(0);

  // Cart & shipping
  const [cart,     setCart]     = useState([]);
  const [designs,  setDesigns]  = useState([]);
  const [delivery, setDelivery] = useState("delivery");
  const [ordered,  setOrdered]  = useState(false);

  const price = calcPrice({ strap, faceType, engraving });

  // Navigate helper
  function go(page) {
    setPrev(view);
    setView(page);
  }

  // Reset design flow
  function goDesign() {
    setStep(1);
    go("design");
  }

  // Add to cart (called on last step)
  function addToCart() {
    const item = {
      id: Date.now(),
      face: face.name, strap: strap.name, cas: cas.name,
      engraving, price,
      added: new Date().toLocaleDateString("th-TH"),
    };
    const newCart    = [...cart, item];
    const newDesign  = { ...item, saved: new Date().toLocaleDateString("th-TH") };
    setCart(newCart);
    setDesigns(d => [newDesign, ...d]);
    go("cart");
  }

  // Checkout → shipping
  function checkout() { go("shipping"); }

  // Place order
  function placeOrder() {
    setCart([]);
    setOrdered(true);
    go("success");
  }

  // Step navigation
  function nextStep() {
    if (step < 4) setStep(s => s + 1);
    else addToCart();
  }
  function prevStep() {
    if (step > 1) setStep(s => s - 1);
  }

  // Render step content
  const STEPS = [
    <StepFace key="1" {...{ face, setFace, faceType, setFaceType, uploadUrl, setUploadUrl, setUploadName, imgScale, setImgScale, imgRotate, setImgRotate }} />,
    <StepStrap key="2" strap={strap} setStrap={setStrap} />,
    <StepCase  key="3" cas={cas}     setCas={setCas} />,
    <StepEngraving key="4" {...{ engraving, setEngraving, engDate, setEngDate }} />,
  ];

  return (
    <div className="bg-zinc-950 min-h-screen flex justify-center items-start font-sans text-white">
      <div className="w-full max-w-sm bg-black min-h-screen flex flex-col border-x border-zinc-900 overflow-hidden">

        {/* ── HOME ─────────────────────────────────────────── */}
        {view === "home" && (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center relative overflow-hidden">
            {/* Atmosphere */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-[0.07] blur-3xl"
              style={{ background: "#C9A84C" }} />
            {[220, 320, 420].map(s => (
              <div key={s} className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-500/[0.06]"
                style={{ width: s, height: s }} />
            ))}

            <span className="relative inline-block border border-yellow-500/30 text-yellow-500 text-[9px] tracking-[0.22em] uppercase px-4 py-1.5 rounded-full mb-8">
              Maison Chrono — Atelier de Montres
            </span>
            <h1 className="relative font-light text-center leading-[1.05] mb-3" style={{ fontFamily: "Georgia,serif" }}>
              <span className="block text-[52px] tracking-tight">Design Your</span>
              <span className="block text-[56px] italic"
                style={{ background: "linear-gradient(135deg,#8B6914,#C9A84C,#E8C96A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Time
              </span>
            </h1>
            <p className="text-[11px] text-zinc-400 tracking-[0.12em] uppercase mb-1">Crafted exclusively for you</p>
            <p className="italic text-zinc-500 mb-10" style={{ fontFamily: "Georgia,serif", fontSize: 17 }}>
              ออกแบบนาฬิกาในแบบที่เป็นคุณ
            </p>
            <button onClick={goDesign}
              className="relative py-4 px-10 text-black text-[11px] font-medium tracking-widest uppercase rounded-sm transition-transform hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg,#8B6914,#C9A84C,#E8C96A)" }}>
              เริ่มออกแบบของคุณ →
            </button>
            <div className="flex gap-10 mt-14">
              {[["4","Steps"],["∞","Combinations"],["14","Days"]].map(([n, l]) => (
                <div key={l} className="text-center">
                  <div className="text-2xl text-yellow-500 font-light" style={{ fontFamily: "Georgia,serif" }}>{n}</div>
                  <div className="text-[9px] text-zinc-600 tracking-widest uppercase mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── DESIGN ───────────────────────────────────────── */}
        {view === "design" && (
          <>
            {/* Live preview */}
            <div className="flex flex-col items-center pt-4 pb-1 relative flex-shrink-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full opacity-[0.07]"
                style={{ background: "radial-gradient(circle,#C9A84C,transparent 70%)" }} />
              <WatchSVG {...{ face, strap, cas, engraving, faceType, uploadUrl, imgScale, imgRotate }} />
              {/* Price */}
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-light text-yellow-500 text-2xl" style={{ fontFamily: "Georgia,serif" }}>
                  {fmt(price)}
                </span>
                <span className="text-[11px] text-zinc-500">THB</span>
              </div>
              {/* Config chips */}
              <div className="flex flex-wrap gap-1.5 mt-2 justify-center px-4">
                {[face?.name, strap?.name, cas?.name].map(l => (
                  <span key={l} className="text-[9px] tracking-widest uppercase border border-zinc-800 text-zinc-500 px-2 py-0.5 rounded-sm">{l}</span>
                ))}
              </div>
            </div>

            {/* Stepper */}
            <Stepper step={step} />
            <div className="h-px bg-zinc-900 mx-4 my-2.5" />

            {/* Step content */}
            <div className="flex-1 overflow-y-auto pb-2">
              {STEPS[step - 1]}
            </div>

            {/* Nav buttons */}
            <div className="flex gap-2 px-4 py-3 flex-shrink-0">
              {step > 1 && (
                <button onClick={prevStep}
                  className="flex-none px-5 py-3 border border-zinc-700 text-zinc-400 text-[10px] tracking-widest uppercase rounded-sm hover:border-zinc-600 transition-colors">
                  ← Back
                </button>
              )}
              <button onClick={nextStep}
                className="flex-1 py-3 text-black text-[10px] font-medium tracking-widest uppercase rounded-sm"
                style={{ background: "linear-gradient(135deg,#8B6914,#C9A84C,#E8C96A)" }}>
                {step === 4 ? "เพิ่มลงตะกร้า →" : "Next Step →"}
              </button>
            </div>

            <BottomNav view={view} setView={v => { setView(v); }} cartCount={cart.length} />
          </>
        )}

        {/* ── CART ─────────────────────────────────────────── */}
        {view === "cart" && (
          <>
            <CartPage
              cart={cart}
              removeItem={id => setCart(c => c.filter(i => i.id !== id))}
              delivery={delivery}
              setDelivery={setDelivery}
              onCheckout={checkout}
            />
            <BottomNav view={view} setView={setView} cartCount={cart.length} />
          </>
        )}

        {/* ── SHIPPING ─────────────────────────────────────── */}
        {view === "shipping" && (
          <>
            <ShippingPage
              delivery={delivery}
              setDelivery={setDelivery}
              totalPrice={cart.reduce((a, c) => a + c.price, 0)}
              onConfirm={placeOrder}
              onBack={() => go("cart")}
            />
            <BottomNav view={view} setView={setView} cartCount={cart.length} />
          </>
        )}

        {/* ── PROFILE ──────────────────────────────────────── */}
        {view === "profile" && (
          <>
            <ProfilePage designs={designs} onNew={goDesign} />
            <BottomNav view={view} setView={setView} cartCount={cart.length} />
          </>
        )}

        {/* ── SUCCESS ──────────────────────────────────────── */}
        {view === "success" && (
          <>
            <SuccessScreen onHome={() => { setOrdered(false); go("home"); }} />
            <BottomNav view={view} setView={setView} cartCount={0} />
          </>
        )}
      </div>
    </div>
  );
}
