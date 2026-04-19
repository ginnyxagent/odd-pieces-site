# Odd Pieces Wholesale Launch — Full Execution Guide

**Date:** March 25, 2026 | **Version:** Final (pre-ClickUp)

---

## 🗓️ THIS WEEK (Mar 25–28): Pre-Launch Prep Checklist

Before official launch sprint:

- [ ] **Finalize wholesale price** — Confirm $19/unit wholesale
- [ ] **Decide MOQ** — Recommend: 12 units (1 case) first order, 6 reorder
- [ ] **Decide payment terms** — Prepay first order, Net 30 after
- [ ] **Select 3–5 SKUs for wholesale** — Curate; not all puzzles need wholesale
- [ ] **Set inventory allocation** — % allocated to wholesale vs DTC
- [ ] **Brief Martin** on all design tasks (price list, shelf talker, catalog)
- [ ] **Brief Kayl** on Google Form task (or schedule build session)
- [ ] **Draft scripts for Hermonie** (email handling)
- [ ] **Create wholesale@oddpieces.com email** (if using separate address)

---

## TEAM CAPACITY MAP

| Person | Wholesale Tasks | Availability |
|--------|-----------------|----------------|
| **Ginny** | Decisions + approvals (Tasks 8, 9, 10) | Available |
| **Martin** | All design (Tasks 1, 3, 6, 7) | Available — not overloaded |
| **Kayl** | Google Form + spreadsheet (Tasks 2, 5) | Needs guidance on Form/Apps Script |
| **Hermonie** | Email templates + order processing (Task 4) | Needs SOPs + scripts |

---

## THE 10 CORE TASKS

### ✅ TASK 1: Price List / Sell Sheet Redesign

**Owner:** Martin (design) + Ginny (approval)

**What it is:** Single-page PDF retailers see first. Shows products, wholesale pricing, and how to order.

**Best approach:** One page, front and back. Use Canva or InDesign.

**Front side:**
- Odd Pieces logo
- Tagline: "Mystery Puzzles — Build to Find Out What Happens"
- 2–3 hero product photos (box + puzzle comparison)
- 3 selling bullets:
  - "The box art ≠ the puzzle — every build surprises"
  - "1000 pieces, premium quality, artist-designed"
  - "4.8★ from 2,000+ reviews"
- Social proof: Kickstarter funding + review count

**Back side:**

| SKU | Product | Wholesale | MSRP | Case Pack |
|-----|---------|-----------|------|-----------| 
| OP-001 | [Name] | $19.00 | $38.00 | 12 units |
| OP-002 | [Name] | $19.00 | $38.00 | 12 units |

- Order info: email + form link
- Payment terms
- "Marketing materials included"

**Detailed revisions from old sheet:**
- OLD: Only retail pricing → NEW: Dedicated wholesale column
- OLD: No MOQ info → NEW: Clear case pack + minimums
- OLD: Generic list → NEW: Curated wholesale SKUs only
- OLD: No social proof → NEW: Reviews, Kickstarter, star rating
- OLD: Missing margin info → NEW: Shows 50% retailer margin

**Timeline:** Start Mar 25 → Draft by Mar 28 → Final by Mar 31

**Success:** Retailer understands price, margin, and how to order in <60 seconds.

---

### ✅ TASK 2: Google Form + Auto-Reply Setup

**Owner:** Kayl (build) + Willis (technical guidance)

**What it is:** Wholesale application form. Retailers fill it out, get instant confirmation, data flows into tracking spreadsheet.

**Best approach:** Google Forms + Apps Script (free, simple). Takes 2 hours with this guide.

#### STEP-BY-STEP FOR KAYL:

**Step 1: Create Form**
1. Go to forms.google.com → New blank form
2. Title: "Odd Pieces Wholesale Application"
3. Description: "Thanks for your interest! We'll respond within 2 business days."

**Step 2: Add Fields**

| # | Field | Type | Required |
|---|-------|------|----------|
| 1 | Store/Business Name | Text | Yes |
| 2 | Contact Name | Text | Yes |
| 3 | Email | Email | Yes |
| 4 | Phone | Text | No |
| 5 | Website/Instagram | Text | No |
| 6 | Store Type | Dropdown: B&M / Online / Both | Yes |
| 7 | Store Address | Long text | Yes if B&M |
| 8 | How did you hear about us? | Dropdown: Instagram / TikTok / Kickstarter / Referral / Other | No |
| 9 | Which puzzles interest you? | Checkboxes: [list SKUs] | Yes |
| 10 | First order estimate | Dropdown: 12-24 / 25-48 / 49-96 / 96+ | Yes |
| 11 | Anything else? | Long text | No |

**Step 3: Link to Google Sheets**
1. Click "Responses" tab → Green Sheets icon → "Create new spreadsheet"
2. Name it: "Wholesale Applications & Orders"
3. Responses auto-populate when submitted

**Step 4: Set Up Auto-Reply**

1. In the linked Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code
3. Paste this:

```javascript
function onFormSubmit(e) {
  var responses = e.namedValues;
  var email = responses['Email Address'][0];
  var storeName = responses['Store/Business Name'][0];
  var contactName = responses['Contact Name'][0];
  
  var subject = "Thanks for applying, " + storeName + "! — Odd Pieces Wholesale";
  
  var body = "Hi " + contactName + ",\n\n" +
    "Thanks for your interest in carrying Odd Pieces!\n\n" +
    "Here's what happens next:\n" +
    "1. We review within 2 business days\n" +
    "2. You get our catalog + price list\n" +
    "3. We set up your first order together\n\n" +
    "Questions? Reply here or email wholesale@oddpieces.com\n\n" +
    "Talk soon!\n" +
    "The Odd Pieces Team";
  
  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: body,
    name: "Odd Pieces Wholesale",
    replyTo: "wholesale@oddpieces.com"
  });
}
```

4. Click **Save**
5. Go to **Triggers** (clock icon) → **Add Trigger**
   - Function: `onFormSubmit`
   - Event source: From spreadsheet
   - Event type: On form submit
6. Click Save → Authorize with Google account
7. **TEST:** Submit a test form → Check inbox for auto-reply

**If Apps Script fails (fallback):**
Use Zapier (free tier):
1. New Zap: "Google Form" trigger
2. Action: "Send email"
3. Map fields → Save

**Timeline:** Start Mar 25 → Done by Mar 27

**Success:** Submit test form → auto-reply arrives within 1 min → response in spreadsheet with all fields

---

### ✅ TASK 3: Wholesale Landing Page

**Owner:** Martin (design) + Ginny (copy)

**What it is:** Page where retailers learn about wholesale and apply. Goes at oddpieces.com/wholesale or standalone.

**Page structure:**
1. **Hero:** "Bring Mystery Puzzles to Your Store" + hero image
2. **Why Carry Us:** 3–4 bullets (unique product, proven demand, 50% margin, support)
3. **The Numbers:** "50% margin | $38 MSRP | 4.8★ avg | 2,000+ reviews"
4. **What You Get:** Shelf talkers, marketing, dedicated support
5. **How It Works:** Apply → Get approved → Order
6. **CTA:** Big "Apply Now" button → Google Form
7. **FAQ:** MOQ, shipping, returns, payment terms

**Tone:** Professional but still Odd Pieces — not corporate.

**Timeline:** Start Mar 28 → Done by Apr 2

**Success:** Retailer lands on page, sees margin opportunity, clicks "Apply" within 30 seconds

---

### ✅ TASK 4: Email Templates + Gorgias Setup

**Owner:** Hermonie (uses) + Ginny (approves)

**8 templates needed:**

1. **Application Received** (auto-reply via Apps Script — covered in Task 2)

2. **Application Approved**
```
Subject: You're in! Welcome to Odd Pieces Wholesale 🧩

Hi [Contact Name],

Great news — [Store Name] is approved for wholesale!

Here's everything you need:
• Wholesale Catalog: [link]
• Price List: [link]
• Terms & Conditions: [link]
• First order minimum: [X] units

We include free shelf talkers + marketing materials with your first shipment.

Questions? Just reply. Excited to have you!

[Name]
Odd Pieces Wholesale Team
```

3. **Application Declined**
```
Subject: Update on your Odd Pieces wholesale application

Hi [Contact Name],

Thanks for your interest in carrying Odd Pieces at [Store Name].

After reviewing, we're not able to move forward at this time. We're currently focusing on [reason: geographic area / store type fit / capacity].

We'd love to revisit this in the future!

[Name]
Odd Pieces Team
```

4. **First Order Confirmation**
```
Subject: Order confirmed! Here's what's next 🧩

Hi [Contact Name],

Your wholesale order is confirmed!

Order #: [number]
Items: [SKU list]
Total: $[amount]
Est. ship: [date]

What's in your box:
• Puzzles
• Shelf talkers for each SKU
• Brand guide for your staff

We'll send tracking when it ships.

Welcome!

[Name]
```

5. **Reorder Nudge (30 days after shipment)**
```
Subject: How are the puzzles selling? 🧩

Hi [Contact Name],

It's been a month — how's it going?

Best sellers right now: [SKU names]
New releases coming: [if applicable]
Quick reorder: just reply with quantities

We'd love your customer feedback too!

[Name]
```

6. **Payment Reminder (if Net 30)**
```
Subject: Friendly reminder — Invoice #[number] due [date]

Hi [Contact Name],

Invoice #[number] for $[amount] is due [date].

Pay via [method]. If you've already sent it, ignore this!

Thanks,
[Name]
```

7. **New Product Announcement**
```
Subject: New puzzle drop — wholesale preview 🧩

Hi [Contact Name],

We've got something new — exclusive wholesale preview!

[Product Name] — [description]
Wholesale: $19/unit | MSRP: $38 | Available: [date]

Want to add it to your next order? Reply with quantities.

[Name]
```

8. **General Inquiry Response**
```
Subject: Re: Wholesale inquiry

Hi [Name],

Thanks for reaching out!

Quick version: Mystery puzzles where the box art isn't what you build. 1000 pieces, artist-designed. Strong repeat purchase rate.

Ready to apply? → [Form link]

We review within 2 business days.

[Name]
Odd Pieces Wholesale Team
```

**Hermonie Scripts — Common Scenarios:**

- **"Can we get a bulk discount?"** → "Our standard is $19/unit. For 96+ units, let me check with the team..."
- **"Can we return unsold inventory?"** → "Yes, within 90 days in original condition. 15% restocking fee. Full T&Cs [link]."
- **"Do you do consignment?"** → "No, wholesale purchase only. Our puzzles have strong sell-through, and we provide marketing materials to help."
- **"Can we sell on Amazon?"** → "Our wholesale is B&M only. Online/third-party requires written approval."
- **"What's your MAP?"** → "Minimum advertised price is $38 (MSRP). We ask all partners to maintain this."

**Timeline:** Draft by Mar 27 → Ginny approves by Mar 28 → Load into Gorgias by Mar 31

---

### ✅ TASK 5: Wholesale Tracking Spreadsheet

**Owner:** Kayl (builds) + Hermonie (maintains)

**What it is:** Your wholesale CRM. Tracks every account from application to reorder.

**4 tabs:**

**Tab 1: Applications** (auto-populated from Google Form)
- All form fields + timestamp
- Add columns: Status (Pending/Approved/Declined), Notes, Reviewed By, Review Date

**Tab 2: Active Accounts**
| Store Name | Contact | Email | Date Approved | First Order $ | Total Revenue | Last Order Date | Next Follow-up |

**Tab 3: Orders**
| Order # | Date | Store | SKUs | Qty | Total $ | Payment Status | Ship Date | Tracking # |

**Tab 4: Inventory Allocation**
| SKU | Total Inventory | DTC (%) | Wholesale (%) | Wholesale Committed | Wholesale Available |

**Timeline:** Start Mar 25 → Complete by Mar 27

---

### ✅ TASK 6: Shelf Talker Design + Print

**Owner:** Martin (design) + Ginny (print order)

**What it is:** Small printed cards on shelves explaining what makes Odd Pieces special. Critical — mystery puzzles need explaining.

**Specs:**
- Size: 3.5" x 2" (business card) or 4" x 6" (postcard, folds to stand)
- Front: Logo + "The box art isn't what you build" + product photo
- Back: "How it works: Open → Build → Discover surprise" + QR code → oddpieces.com + "⭐ 4.8/5"
- Print: 200–500 qty, thick cardstock (14pt+), premium feel

**Timeline:** Design start Mar 28 → Approve by Apr 2 → Print order Apr 3 → Receive Apr 10

---

### ✅ TASK 7: Wholesale Catalog (4–8 pages)

**Owner:** Martin (design) + Ginny (copy)

**What it is:** PDF catalog showing all wholesale SKUs, photos, descriptions, pricing.

**Page structure:**
- Page 1: Cover
- Page 2: Brand story + key stats
- Pages 3–6: Product showcase (1 per page with large photos)
- Page 7: Bundles + merchandising setup
- Page 8: How to order + contact

**Timeline:** Start Mar 31 → Done by Apr 7

---

### ✅ TASK 8: Order SOP (Step-by-Step Process)

**Owner:** Ginny (writes) + Hermonie (follows)

**What it is:** How anyone processes a wholesale order without asking Ginny.

**Structure:**

```
When New Application Arrives:
1. Check Applications tab
2. Verify it's a real store (check website/Instagram)
3. Update Status: Approved or Declined
4. Send appropriate template (Template 2 or 3)
5. If Approved: copy to Active Accounts tab

When Order Comes In:
1. Verify account is approved
2. Confirm inventory available
3. Create order in Shopify/system
4. Send invoice
5. Log in Orders tab
6. Send Order Confirmation email (Template 4)
7. When paid: update Payment Status

When Shipping:
1. Pick & pack
2. Include: shelf talkers (5-10 per SKU)
3. Ship via [carrier]
4. Update tracking in Orders tab
5. Send tracking email

Monthly:
- Review Active Accounts for reorder nudges
- Check payment status (overdue?)
- Update Inventory Allocation
- Report to Ginny: # orders, revenue, new accounts
```

**Timeline:** Write Mar 31 → Test with Hermonie Apr 1–2 → Finalize Apr 3

---

### ✅ TASK 9: Wholesale Terms & Conditions

**Owner:** Ginny (decisions) + Willis (drafts)

**Template:**

```
ODD PIECES — WHOLESALE TERMS & CONDITIONS

1. PRICING & PAYMENT
   • Wholesale: $19/unit (per current price sheet)
   • First order: Prepay via credit card/bank transfer
   • Reorders: Net 30 (due 30 days from invoice)
   • Late payments: 15+ days overdue = account on hold

2. MINIMUM ORDERS
   • First order: 12 units ($228 minimum)
   • Reorders: 6 units ($114 minimum)
   • No maximum limit

3. SHIPPING
   • Ships within 5–7 business days
   • Retailer pays shipping
   • Free shipping on orders over $[X] (optional)

4. RETURNS & DAMAGES
   • Damaged/defective: replaced free (report within 7 days)
   • Unsold returns: within 90 days, original condition, 15% restocking fee
   • No returns on opened/damaged packaging

5. MAP POLICY
   • Maintain $38 (MSRP) as minimum advertised price
   • Violation may result in account suspension

6. ONLINE SALES
   • Own website: OK at or above MSRP
   • Third-party (Amazon/eBay): not permitted without approval

7. MARKETING SUPPORT
   • Free shelf talkers with first order
   • Product photos + descriptions for your website
   • Co-marketing opportunities available

8. ACCOUNT TERMS
   • Either party can terminate with 30 days notice
   • These terms may be updated with 30 days notice
```

**Timeline:** Draft Mar 26 → Ginny review Mar 27 → Finalize Mar 28

---

### ✅ TASK 10: Inventory Allocation + Returns Policy

**Owner:** Ginny (decides)

**Allocation framework:**
- Start: **20% of total inventory** to wholesale
- Never allocate more than you can afford to tie up in Net 30 receivables
- Track in Tab 4 of spreadsheet

**Allocation rules:**
- If any SKU drops below 24 units for wholesale → alert Ginny
- Large orders (96+) → Ginny pre-approves
- During Kickstarter → wholesale pauses (all inventory to backers)

**Returns policy:**
- **Damaged:** Full replacement, no questions
- **Defective:** Full replacement, track for QC
- **Unsold:** Within 90 days, original condition, 15% restocking fee, retailer pays return shipping
- **No returns on:** opened puzzles, damaged packaging, orders >90 days old

**Timeline:** Decisions by Mar 27 → Documented by Mar 28

---

## 📅 FINAL TIMELINE

### TRACK A: Ginny (Decisions + Approval)
- Mar 25: Lock pricing, MOQ, payment terms
- Mar 26: Draft T&Cs
- Mar 27: Review T&Cs, decide inventory allocation
- Mar 28: Approve email templates + sell sheet copy
- Mar 31: Write Order SOP
- Apr 1–2: Test SOP with Hermonie
- Apr 3: Final approval on all materials

### TRACK B: Martin (Design)
- Mar 25: Start price list
- Mar 28: Sell sheet done → Start shelf talker + landing page
- Apr 2: Shelf talker done → Start catalog
- Apr 7: Catalog done

### TRACK C: Kayl (Tech)
- Mar 25: Build Google Form + spreadsheet
- Mar 27: Form + sheet done + tested
- Mar 28: Load email templates in Gorgias

### TRACK D: Hermonie (Ops)
- Mar 28: Review email templates + scripts
- Mar 31: Review Order SOP
- Apr 1–2: Process test orders using SOP
- Apr 3: Ready for live wholesale

### 🚀 LAUNCH: April 7, 2026

---

## ✅ PRINTABLE 3-WEEK CHECKLIST

**WEEK 1 (Mar 25–28): Foundations**
- [ ] Finalize pricing ($19/unit)
- [ ] Select SKUs
- [ ] Decide MOQ, payment terms
- [ ] Build Google Form [Kayl]
- [ ] Build tracking spreadsheet [Kayl]
- [ ] Draft T&Cs [Ginny + Willis]
- [ ] Start sell sheet [Martin]
- [ ] Draft email templates [Willis]
- [ ] Approve templates [Ginny]

**WEEK 2 (Mar 31 – Apr 4): Build**
- [ ] Sell sheet finalized [Martin]
- [ ] Shelf talker designed [Martin]
- [ ] Landing page live [Martin]
- [ ] Order SOP written [Ginny]
- [ ] SOP tested [Hermonie]
- [ ] Email templates in Gorgias [Kayl]
- [ ] Print order placed (shelf talkers)

**WEEK 3 (Apr 7–11): Launch**
- [ ] Catalog finalized [Martin]
- [ ] All materials reviewed + approved [Ginny]
- [ ] Wholesale page live
- [ ] Start outreach to retailers
- [ ] 🚀 WHOLESALE LIVE

---

**Ready to review? This file is deployed to oddpieces.com/wholesale-guide for your review.**
