# Odd Pieces Wholesale Launch — Full Execution Guide
**Date:** March 25, 2026 | **Version:** Final (pre-ClickUp upload)

---

## 🗓️ THIS WEEK (Mar 25–28): Pre-Launch Prep Checklist

Before the official launch sprint begins, Ginny should lock these down:

- [ ] **Finalize wholesale price** — Confirm $19/unit wholesale, $38 MSRP (or adjusted)
- [ ] **Decide minimum order quantity (MOQ)** — Recommend: 12 units (1 case) first order, 6 units reorder
- [ ] **Decide payment terms** — Net 30? Prepay? (Recommend: prepay for first order, Net 30 after)
- [ ] **Pick 3–5 SKUs for wholesale** — Not every puzzle needs to be wholesale. Curate.
- [ ] **Set inventory aside** — How many units allocated to wholesale vs DTC?
- [ ] **Brief Martin on all design tasks** (price list, shelf talker, catalog) in one go
- [ ] **Brief Kayl on Google Form task** — or schedule a 30-min build session with Willis
- [ ] **Draft Hermonie's email scripts** (provided below)
- [ ] **Create the wholesale-specific email address** (wholesale@oddpieces.com or use existing)

---

## TEAM CAPACITY MAP

| Person | Role | Wholesale Tasks | Availability |
|--------|------|-----------------|-------------|
| **Ginny** | Strategy/Operations | Tasks 8, 9, 10 (decisions), final approvals | Available |
| **Martin** | Design | Tasks 1, 3, 6, 7 (all design) | Available — not overloaded |
| **Kayl** | Tech/Ops | Task 2, 5 (Google Form + spreadsheet) | Needs guidance on Form/Zapier |
| **Hermonie** | Customer Ops | Task 4 (emails/templates), ongoing order processing | Needs SOPs + scripts |

---

## THE 10 TASKS — DETAILED BREAKDOWN

---

### TASK 1: Price List / Sell Sheet Redesign

**Overview:** A single-page PDF that retailers receive showing products, wholesale pricing, and order info. This is the first thing a buyer sees — it sells for you when you're not in the room.

**Owner:** Martin (design) · Ginny (content/pricing approval)

**Dependencies:** Finalized wholesale price, selected SKUs, product photos

**Best Course of Action:**
- Use Canva or InDesign. One page, front and back.
- Front: hero product shots, brand story (2 sentences), key selling points
- Back: SKU table, pricing tiers, order info, contact

**Detailed Specs:**

**FRONT SIDE:**
- Odd Pieces logo (top left)
- Tagline: "Mystery Puzzles — Build to Find Out What Happens"
- 2–3 hero product photos (box + completed puzzle side by side)
- 3 bullet selling points:
  - "The box art ≠ the puzzle image — every build is a surprise"
  - "1000 pieces, premium quality, artist-designed"
  - "4.8★ average across 2,000+ reviews"
- Social proof strip: "As seen on Kickstarter — $XXX,XXX funded"

**BACK SIDE:**

| SKU | Product Name | Wholesale (per unit) | MSRP | Case Pack | Min Order |
|-----|-------------|---------------------|------|-----------|-----------|
| OP-001 | [Puzzle Name] | $19.00 | $38.00 | 12 | 12 units |
| OP-002 | [Puzzle Name] | $19.00 | $38.00 | 12 | 12 units |
| OP-3PK | 3-Pack Bundle | $52.00 | $99.00 | 4 | 4 units |

- Order info: email, form link, website
- Payment terms (brief)
- "Shelf talkers & marketing materials included with first order"

**Sell Sheet Revision Notes (Old → New):**
- OLD: Likely had retail pricing only → NEW: Dedicated wholesale column + MSRP
- OLD: No MOQ info → NEW: Clear case pack and minimum order quantities
- OLD: Generic product list → NEW: Curated wholesale SKUs only
- OLD: No social proof → NEW: Review count, Kickstarter funding, star rating
- OLD: No retailer-specific CTA → NEW: Clear "How to Order" section with form link
- OLD: Missing margin info → NEW: Show retailer margin (50% markup at MSRP)

**Timeline:** Start Mar 25 → Draft by Mar 28 → Final by Mar 31

**Success Criteria:** A retailer can look at this sheet and know exactly what they're buying, what it costs, what their margin is, and how to order — in under 60 seconds.

**Risks:** Pricing not finalized delays everything. Lock pricing THIS WEEK.

---

### TASK 2: Google Form + Auto-Reply Setup

**Overview:** The wholesale application/order form. Retailers fill it out, get an automatic confirmation email, and their info flows into your tracking spreadsheet. This replaces manual email back-and-forth.

**Owner:** Kayl (build) · Willis (technical guidance) · Ginny (approve questions)

**Dependencies:** Finalized pricing, wholesale email address, Task 5 (spreadsheet) built simultaneously

**Best Course of Action:** Google Forms + Google Apps Script for auto-reply (simpler than Zapier for this use case). Zapier is overkill here — Apps Script is free and does exactly what's needed.

**⚡ STEP-BY-STEP BUILD GUIDE FOR KAYL:**

**Step 1: Create the Form**
1. Go to forms.google.com → Blank form
2. Title: "Odd Pieces Wholesale Application"
3. Description: "Thanks for your interest in carrying Odd Pieces! Fill out this form and we'll get back to you within 2 business days."

**Step 2: Add These Fields (in order)**

| # | Field | Type | Required? |
|---|-------|------|-----------|
| 1 | Store/Business Name | Short text | Yes |
| 2 | Contact Name | Short text | Yes |
| 3 | Email Address | Short text (email validation) | Yes |
| 4 | Phone Number | Short text | No |
| 5 | Website / Instagram | Short text | No |
| 6 | Store Type | Dropdown: Brick & Mortar / Online Only / Both | Yes |
| 7 | Store Address | Long text | Yes (if B&M) |
| 8 | How did you hear about us? | Dropdown: Instagram / TikTok / Kickstarter / Trade Show / Referral / Other | No |
| 9 | Which puzzles interest you? | Checkboxes: list each wholesale SKU | Yes |
| 10 | Estimated first order quantity | Dropdown: 12-24 / 25-48 / 49-96 / 96+ | Yes |
| 11 | Anything else we should know? | Long text | No |

**Step 3: Link to Google Sheets**
1. In the form editor, click "Responses" tab
2. Click the green Sheets icon → "Create a new spreadsheet"
3. Name it: "Wholesale Applications & Orders"
4. This auto-populates when someone submits

**Step 4: Set Up Auto-Reply (Apps Script)**
1. In the linked Google Sheet, go to Extensions → Apps Script
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
    "Thanks for your interest in carrying Odd Pieces! We're excited you want to bring mystery puzzles to your customers.\n\n" +
    "Here's what happens next:\n" +
    "1. We'll review your application within 2 business days\n" +
    "2. You'll receive our wholesale catalog and price list\n" +
    "3. We'll set up your first order together\n\n" +
    "If you have questions in the meantime, reply to this email or reach out at wholesale@oddpieces.com.\n\n" +
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

4. Click 💾 Save
5. Go to **Triggers** (clock icon on left sidebar)
6. Click **+ Add Trigger**
   - Function: `onFormSubmit`
   - Event source: From spreadsheet
   - Event type: On form submit
7. Click Save → Authorize with Google account
8. **TEST IT:** Submit a test response → Check if auto-reply arrives

**If Apps Script doesn't work (fallback — Zapier):**
1. Create Zapier account (free tier)
2. Trigger: "New Google Form Response"
3. Action: "Send Email via Gmail"
4. Map fields: email, name, store name into template
5. Turn on Zap

**Timeline:** Start Mar 25 → Complete by Mar 27 (it's a 2-hour task with the guide above)

**Success Criteria:** Submit a test form → auto-reply arrives within 1 minute → response appears in spreadsheet with all fields.

**Risks:** 
- Apps Script authorization can be confusing (Kayl should click "Advanced" → "Go to [project name]" if Google warns about unverified app)
- Email might land in spam initially — send a few test emails to warm it up

---

### TASK 3: Wholesale Landing Page

**Overview:** A page on your website (or standalone) where retailers learn about wholesale and access the application form. This is where you send retailers when they ask "do you do wholesale?"

**Owner:** Martin (design) · Ginny (copy approval)

**Dependencies:** Google Form URL (Task 2), price list PDF (Task 1)

**Best Course of Action:** 
- If Shopify: Create a new page at oddpieces.com/wholesale (password-protected optional)
- If standalone: Add to odd-pieces-site.vercel.app

**Detailed Specs:**

**Page Structure:**
1. **Hero:** "Bring Mystery Puzzles to Your Store" + hero image
2. **Why Carry Odd Pieces:** 3–4 selling points (unique product, proven demand, high margins, marketing support)
3. **The Numbers:** "50% retailer margin | $38 MSRP | 4.8★ avg rating | 2,000+ reviews"
4. **What You Get:** Shelf talkers, marketing materials, dedicated support
5. **How It Works:** 3 steps (Apply → Get Approved → Order)
6. **CTA Button:** "Apply Now" → links to Google Form
7. **FAQ:** MOQ, shipping, returns, payment terms (3–5 questions)

**Tone:** Professional but still Odd Pieces — not corporate. "We're not your typical puzzle company, and this isn't your typical wholesale program."

**Timeline:** Start Mar 28 (after Form is live) → Complete by Apr 2

**Success Criteria:** A retailer landing on this page understands the value prop, sees the margin opportunity, and clicks "Apply" — all within 30 seconds of scrolling.

**Risks:** Don't over-design. This page needs to convert, not win awards. Simple > fancy.

---

### TASK 4: Email Templates + Gorgias Templates

**Overview:** Pre-written email templates for every wholesale touchpoint so Hermonie (and anyone) can handle wholesale communications consistently without improvising.

**Owner:** Hermonie (uses them) · Ginny (approves tone) · Willis (drafts)

**Dependencies:** Finalized pricing, T&Cs (Task 9), Form URL (Task 2)

**Best Course of Action:** Create in Google Docs first, then paste into Gorgias as macros/templates.

**Templates Needed (8 total):**

---

**Template 1: Application Received (Auto-reply — already in Task 2)**

**Template 2: Application Approved**
```
Subject: You're in! Welcome to Odd Pieces Wholesale 🧩

Hi [Contact Name],

Great news — [Store Name] has been approved for our wholesale program!

Here's everything you need to get started:
• Wholesale Catalog: [link]
• Price List: [link]  
• Terms & Conditions: [link]
• To place your first order: [order form link or email]

Your first order minimum is [X] units. After that, reorders start at [Y] units.

We include free shelf talkers and marketing materials with your first shipment — no extra charge.

Questions? Just reply here. We're excited to have you!

[Name]
Odd Pieces Wholesale Team
```

**Template 3: Application Declined (Politely)**
```
Subject: Update on your Odd Pieces wholesale application

Hi [Contact Name],

Thanks for your interest in carrying Odd Pieces at [Store Name]. 

After reviewing your application, we're not able to move forward with a wholesale partnership at this time. This isn't a reflection of your store — we're currently limiting our wholesale program to [reason: geographic focus / store type fit / capacity].

We'd love to revisit this in the future. In the meantime, you can always purchase at retail through our website at oddpieces.com.

Thanks for reaching out!

[Name]
Odd Pieces Team
```

**Template 4: First Order Confirmation**
```
Subject: Order confirmed! Here's what's next 🧩

Hi [Contact Name],

Your first wholesale order is confirmed! Here's the summary:

Order #: [number]
Items: [SKU list]
Total: $[amount]
Payment: [status]
Estimated ship date: [date]

What's in your box:
• Your puzzles (obviously)
• Shelf talkers for each SKU
• A mini brand guide for your staff

We'll send tracking as soon as it ships.

Welcome to the Odd Pieces family!

[Name]
```

**Template 5: Reorder Nudge (30 days after first shipment)**
```
Subject: How are the puzzles selling? 🧩

Hi [Contact Name],

It's been about a month since your first Odd Pieces shipment — how's it going?

A few things that might help:
• Our best sellers right now: [SKU names]
• New releases coming soon: [if applicable]
• Quick reorder: just reply with quantities and we'll get it moving

If you have feedback from customers, we'd love to hear it too.

[Name]
```

**Template 6: Payment Reminder (if Net 30)**
```
Subject: Friendly reminder — Invoice #[number] due [date]

Hi [Contact Name],

Just a heads up that Invoice #[number] for $[amount] is due on [date]. 

You can pay via [payment method]. If you've already sent payment, ignore this!

Thanks,
[Name]
```

**Template 7: New Product Announcement**
```
Subject: New puzzle drop — exclusive wholesale preview 🧩

Hi [Contact Name],

We've got something new and we wanted you to see it first.

[Product Name] — [one-line description]

Wholesale: $19/unit | MSRP: $38 | Available: [date]

[Image or link to catalog page]

Want to add it to your next order? Just reply with quantities.

[Name]
```

**Template 8: General Inquiry Response**
```
Subject: Re: Wholesale inquiry

Hi [Name],

Thanks for reaching out about carrying Odd Pieces!

Here's the quick version: We make mystery puzzles where the box art isn't what you build. 1000 pieces, artist-designed, and customers love the surprise element. Retailers typically see strong repeat purchases.

If you're interested, here's how to get started:
→ Apply here: [Google Form link]

We review applications within 2 business days. Happy to answer any questions!

[Name]
Odd Pieces Wholesale Team
```

---

**Scripts for Hermonie — Common Scenarios:**

**Scenario: "Can we get a discount on larger orders?"**
> "Great question! Our standard wholesale price is $19/unit. For orders of 96+ units, we can offer [X% discount / free shipping / discuss]. Let me check with the team and get back to you."

**Scenario: "Can we return unsold inventory?"**
> "We accept returns of unsold inventory in original condition within 90 days of delivery, with a 15% restocking fee. I can send you our full Terms & Conditions if you'd like to review them."

**Scenario: "Do you offer consignment?"**
> "We don't offer consignment at this time — all orders are wholesale purchase. But our puzzles have a strong sell-through rate, and we include marketing materials to help drive sales in your store."

**Scenario: "Can we sell on Amazon/online?"**
> "Our wholesale program is designed for brick-and-mortar retailers. We handle our own Amazon and online sales directly. If you have a physical store with an online component, that's totally fine — we just ask that you don't list below MSRP."

**Scenario: "What's your MAP policy?"**
> "Our minimum advertised price is $38 (MSRP). We ask all retail partners to maintain this pricing to protect the brand and your margins."

**Timeline:** Draft by Mar 27 → Ginny approves by Mar 28 → Load into Gorgias by Mar 31

**Success Criteria:** Hermonie can handle any wholesale email without asking Ginny for help.

**Risks:** Templates sound too robotic. Read them aloud — if they sound like a human wrote them, they're good.

---

### TASK 5: Wholesale Tracking Spreadsheet

**Overview:** A single Google Sheet that tracks every wholesale account from application to reorder. Your wholesale CRM.

**Owner:** Kayl (builds) · Hermonie (maintains) · Ginny (reviews)

**Dependencies:** Google Form (Task 2) — responses auto-populate Tab 1

**Best Course of Action:** Google Sheets. Don't overcomplicate with Airtable or a CRM — you have <50 accounts to start.

**Detailed Specs:**

**Tab 1: Applications (auto-populated from Form)**
- All form fields + Timestamp
- Add manual columns: Status (Pending / Approved / Declined), Notes, Reviewed By, Review Date

**Tab 2: Active Accounts**
| Store Name | Contact | Email | Phone | Address | Date Approved | First Order Date | First Order $ | Last Order Date | Last Order $ | Total Orders | Total Revenue | Next Follow-up | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Tab 3: Orders**
| Order # | Date | Store | SKUs | Qty | Total $ | Payment Status | Ship Date | Tracking # | Notes |
|---|---|---|---|---|---|---|---|---|---|

**Tab 4: Inventory Allocation**
| SKU | Total Inventory | DTC Allocated | Wholesale Allocated | Wholesale Committed | Wholesale Available |
|---|---|---|---|---|---|

**Tab 5: Dashboard (optional, Phase 2)**
- Total wholesale revenue
- # active accounts
- Avg order size
- Reorder rate

**Timeline:** Start Mar 25 → Complete by Mar 27 (basic build is 1–2 hours)

**Success Criteria:** Every wholesale interaction is tracked in one place. Nothing falls through cracks.

**Risks:** Nobody updates it. Make it part of the SOP (Task 8) — every order = update the sheet.

---

### TASK 6: Shelf Talker Design + Print

**Overview:** Small printed cards that sit on retail shelves next to the product, explaining what makes Odd Pieces special. Critical because mystery puzzles need explaining — the box alone doesn't sell the concept.

**Owner:** Martin (design) · Ginny (copy + print order)

**Dependencies:** Final product photos, brand assets

**Best Course of Action:** Design in Illustrator/Canva. Print via VistaPrint, Moo, or local printer. Standard size: 3.5" x 2" (business card size) or 4" x 6" (postcard size that stands up).

**Detailed Specs:**

**Front:**
- Odd Pieces logo
- "The box art isn't what you build."
- Product photo (box vs completed puzzle side-by-side)
- "1000-piece mystery puzzle"

**Back (or bottom half):**
- "How it works: Open the box. Build the puzzle. Discover the surprise."
- QR code → oddpieces.com
- "⭐ 4.8/5 from 2,000+ puzzlers"

**Design Notes:**
- Must stand up on a shelf (fold or with a stand)
- Colors match brand (reference brand-guidelines-v6.html)
- Premium feel — thick card stock (14pt minimum)
- Print quantity: 200–500 to start (include 5–10 per retailer shipment)

**Timeline:** Design start Mar 28 → Design done Apr 2 → Print order Apr 3 → Receive by Apr 10

**Success Criteria:** A customer browsing a puzzle shelf picks up Odd Pieces because the shelf talker caught their eye and explained the concept in 5 seconds.

**Risks:** Print timing. Order early — print + ship takes 7–10 business days.

---

### TASK 7: Wholesale Catalog (4–8 pages)

**Overview:** A polished PDF catalog showcasing all wholesale SKUs with photos, descriptions, and ordering info. Sent to approved retailers. This is the "menu" they order from.

**Owner:** Martin (design) · Ginny (copy/content)

**Dependencies:** Final product photos, pricing, Task 1 (price list — can be the last page of the catalog)

**Best Course of Action:** Design as a PDF in InDesign or Canva. 4–8 pages. Can double as a digital lookbook.

**Detailed Specs:**

**Page 1: Cover**
- "Odd Pieces Wholesale Catalog — [Season/Year]"
- Hero image
- Logo

**Page 2: Brand Story**
- 3–4 sentences: who you are, what makes you different
- Key stats: Kickstarter funding, reviews, repeat rate
- "Mystery puzzles where the box art isn't what you build"

**Pages 3–6: Product Pages**
- One product (or product family) per page
- Large product photo (box + completed puzzle)
- Product name, SKU, piece count
- 2–3 sentence description
- Wholesale price, MSRP, case pack
- "Best for: gift shops, bookstores, game stores, boutiques"

**Page 7: Bundles / Merchandising**
- 3-pack bundle details
- Suggested retail display setup (photo if possible)
- "Include shelf talkers (provided free)"

**Page 8: How to Order**
- Order process (Form link, email, or both)
- Payment terms
- Shipping info
- Contact details
- QR code to wholesale page

**Timeline:** Start Mar 31 (after price list done) → Complete by Apr 7

**Success Criteria:** A retailer flips through this and says "I want to carry these." Every page should make the product look desirable and the ordering process feel easy.

**Risks:** Scope creep — don't let this become a 20-page brand book. 4–6 pages is plenty for launch.

---

### TASK 8: Order SOP (Documented Process)

**Overview:** A step-by-step document that anyone on the team can follow to process a wholesale order from receipt to shipment. This is how you scale without Ginny being the bottleneck.

**Owner:** Ginny (writes/approves) · Hermonie (follows it)

**Dependencies:** Tasks 2, 4, 5 complete (form, templates, spreadsheet)

**Best Course of Action:** Google Doc. Keep it short — numbered steps, not paragraphs. Include screenshots.

**Detailed Specs:**

```
# Odd Pieces Wholesale Order SOP

## When a New Application Comes In
1. Check "Wholesale Applications" Google Sheet (auto-populated from Form)
2. Review the application:
   - Is it a real store? (Check website/Instagram)
   - Is it a good fit? (Puzzle/game/gift/book store = yes. Random Etsy shop = probably no)
3. Update Status column: Approved or Declined
4. Send appropriate email template (Template 2 or 3 from Gorgias)
5. If Approved: Copy their info to "Active Accounts" tab

## When an Order Comes In
1. Verify the account is approved (check Active Accounts tab)
2. Confirm SKUs are in stock (check Inventory Allocation tab)
3. Create order in [Shopify/your system]
4. Send invoice via [payment method]
5. Log order in "Orders" tab of tracking spreadsheet
6. Send Order Confirmation email (Template 4)
7. When payment received: mark Payment Status = Paid

## When Shipping an Order
1. Pick and pack order
2. Include: shelf talkers (5-10 per SKU), brand card
3. Ship via [carrier] — wholesale orders use [shipping method]
4. Update Orders tab with tracking number
5. Send tracking email to retailer

## Monthly Tasks
- Review Active Accounts: anyone due for a reorder nudge? (Template 5)
- Check payment status: anyone overdue? (Template 6)
- Update Inventory Allocation tab
- Report to Ginny: # orders, revenue, new accounts
```

**Timeline:** Write Mar 31 → Test with Hermonie Apr 1–2 → Finalize Apr 3

**Success Criteria:** Hermonie can process an order end-to-end without asking Ginny a single question.

**Risks:** SOP gets written but never used. Solution: have Hermonie process the first 3 orders using ONLY the SOP — if she has questions, the SOP has gaps.

---

### TASK 9: Wholesale Terms & Conditions

**Overview:** A legal-ish document that protects Odd Pieces and sets clear expectations with retailers. Not a contract — more of a "here's how we work together" doc.

**Owner:** Ginny (decisions) · Willis (drafts)

**Dependencies:** Finalized pricing, MOQ, payment terms, returns policy (Task 10)

**Best Course of Action:** Google Doc → PDF. 1–2 pages max. Don't hire a lawyer for v1 — this isn't a Fortune 500 deal.

**Template:**

```
ODD PIECES — WHOLESALE TERMS & CONDITIONS

Effective: [Date]

1. PRICING & PAYMENT
   - Wholesale prices as listed on current price sheet
   - Prices subject to change with 30 days notice
   - Payment: [Prepay via credit card/bank transfer for first order; Net 30 for reorders after first successful order]
   - Late payments: Net 30 accounts overdue by 15+ days will be placed on hold

2. MINIMUM ORDERS
   - First order minimum: [12 units / $228]
   - Reorder minimum: [6 units / $114]
   - No maximum order limit

3. SHIPPING
   - Orders ship within [5-7] business days
   - Shipping costs paid by retailer (or: free shipping on orders over $[X])
   - Carrier: [UPS/FedEx/USPS]

4. RETURNS & DAMAGES
   - Damaged/defective products: replaced at no charge (report within 7 days of receipt with photos)
   - Unsold inventory returns: accepted within 90 days in original condition, 15% restocking fee
   - No returns on opened/damaged packaging

5. MAP POLICY (Minimum Advertised Price)
   - All retail partners must maintain MSRP of $38 (per unit) as the minimum advertised price
   - Violation of MAP policy may result in account suspension

6. ONLINE SALES
   - Wholesale accounts may sell through their own website at or above MSRP
   - Listing on third-party marketplaces (Amazon, eBay, etc.) is not permitted without written approval

7. MARKETING SUPPORT
   - Free shelf talkers included with first order
   - Product photos and descriptions available for your website/social media
   - Co-marketing opportunities available — reach out to discuss

8. ACCOUNT TERMS
   - Odd Pieces reserves the right to approve or decline wholesale applications
   - Either party may terminate the wholesale relationship with 30 days written notice
   - These terms may be updated with 30 days notice to active accounts
```

**Timeline:** Draft Mar 26 → Ginny reviews Mar 27 → Finalize Mar 28

**Success Criteria:** Covers the "what if" scenarios without being intimidating. A retailer should read this and think "fair and professional" not "corporate lawyers."

**Risks:** Over-lawyering it. Keep it simple. You can always add terms later.

---

### TASK 10: Inventory Allocation + Returns Policy

**Overview:** Deciding how much inventory goes to wholesale vs. DTC, and what happens when retailers want to return product.

**Owner:** Ginny (decisions) · Kayl (tracks in spreadsheet)

**Dependencies:** Current inventory counts, sales velocity data

**Best Course of Action:** Simple percentage split to start. Don't over-engineer.

**Detailed Specs:**

**Inventory Allocation Framework:**
- Start conservative: **20% of total inventory** allocated to wholesale
- Never allocate more than you can afford to tie up in Net 30 receivables
- Track in Tab 4 of the spreadsheet (Task 5)
- Review monthly — adjust based on sell-through

**Allocation per SKU:**
| SKU | Total Inventory | DTC (80%) | Wholesale (20%) |
|-----|----------------|-----------|-----------------|
| Fill in per SKU | | | |

**Decision rules:**
- If wholesale available drops below 24 units for any SKU → alert Ginny
- If a large order (96+) comes in, Ginny approves before committing
- During Kickstarter campaigns: wholesale allocation pauses (all inventory to backers)

**Returns Policy (included in T&Cs but expanded here):**
- **Damaged in transit:** Full replacement, no questions. Retailer sends photos within 7 days.
- **Defective product:** Full replacement. Track defect for QC.
- **Unsold returns:** Accept within 90 days, original condition, 15% restocking fee. Retailer pays return shipping.
- **No returns on:** opened puzzles, damaged packaging, orders older than 90 days.

**Timeline:** Decisions by Mar 27 → Documented in spreadsheet by Mar 28

**Success Criteria:** Clear rules that Hermonie can enforce without escalating to Ginny.

**Risks:** Being too generous with returns invites abuse. The 15% restocking fee + 90-day window is industry standard and fair.

---

## 📅 FINAL TIMELINE — PARALLEL TRACKS

### TRACK A: Content & Decisions (Ginny)
| Date | Task |
|------|------|
| Mar 25 | Lock pricing, MOQ, payment terms, SKU selection |
| Mar 26 | Draft T&Cs (Task 9) — Willis provides template |
| Mar 27 | Review/approve T&Cs, decide inventory allocation (Task 10) |
| Mar 28 | Approve email templates (Task 4), approve sell sheet copy (Task 1) |
| Mar 31 | Write Order SOP (Task 8) |
| Apr 1–2 | Test SOP with Hermonie |
| Apr 3 | Final approval on all materials |

### TRACK B: Design (Martin)
| Date | Task |
|------|------|
| Mar 25 | Start price list / sell sheet (Task 1) |
| Mar 28 | Sell sheet done → Start shelf talker (Task 6) + wholesale landing page (Task 3) |
| Apr 2 | Shelf talker done → Start catalog (Task 7). Landing page done. |
| Apr 7 | Catalog done. Print order for shelf talkers. |

### TRACK C: Tech & Ops (Kayl + Willis)
| Date | Task |
|------|------|
| Mar 25 | Build Google Form (Task 2) + tracking spreadsheet (Task 5) |
| Mar 27 | Form + spreadsheet done, tested, auto-reply working |
| Mar 28 | Load email templates into Gorgias (Task 4) |

### TRACK D: Customer Ops (Hermonie)
| Date | Task |
|------|------|
| Mar 28 | Review email templates + scripts |
| Mar 31 | Review Order SOP |
| Apr 1–2 | Process test orders using SOP (flag gaps) |
| Apr 3 | Ready to handle live wholesale inquiries |

### 🚀 LAUNCH READY: April 7, 2026

---

## ✅ PRINTABLE CHECKLIST

```
WEEK 1 (Mar 25–28): FOUNDATIONS
□ Finalize wholesale pricing ($19/unit confirmed)
□ Select wholesale SKUs (3–5 puzzles)
□ Decide MOQ (12 first order, 6 reorder)
□ Decide payment terms (prepay first, Net 30 after)
□ Build Google Form [Kayl]
□ Build tracking spreadsheet [Kayl]
□ Test auto-reply [Kayl]
□ Draft T&Cs [Ginny + Willis]
□ Start sell sheet design [Martin]
□ Draft email templates [Willis]
□ Approve email templates [Ginny]
□ Decide inventory allocation [Ginny]

WEEK 2 (Mar 31 – Apr 4): BUILD
□ Sell sheet finalized [Martin]
□ Shelf talker designed [Martin]
□ Wholesale landing page live [Martin]
□ Order SOP written [Ginny]
□ SOP tested with Hermonie
□ Email templates loaded in Gorgias [Kayl/Hermonie]
□ Hermonie trained on scripts + scenarios
□ Print order placed for shelf talkers

WEEK 3 (Apr 7–11): LAUNCH
□ Catalog finalized [Martin]
□ All materials reviewed + approved [Ginny]
□ Wholesale page live + linked
□ First outreach to target retailers
□ 🚀 WHOLESALE IS LIVE
```

---

## 📋 QUICK REFERENCE CARD

| Question | Answer |
|----------|--------|
| Wholesale price | $19/unit |
| MSRP | $38 |
| Retailer margin | 50% |
| First order MOQ | 12 units ($228) |
| Reorder MOQ | 6 units ($114) |
| Payment (first order) | Prepay |
| Payment (reorders) | Net 30 |
| Returns window | 90 days |
| Restocking fee | 15% |
| MAP | $38 (MSRP) |
| Shipping | Retailer pays (or free over $X) |
| Order method | Google Form or email |
| Contact | wholesale@oddpieces.com |

---

*This guide is ready for ClickUp upload. Each of the 10 tasks maps to a ClickUp task with subtasks, assignees, due dates, and dependencies.*
