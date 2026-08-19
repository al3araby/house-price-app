# House Price Prediction App — Redesign Spec

**Binds to**: `.ulpi/design/DESIGN.md` — Every screen must read as the same product if placed side by side.

---

## Flow 1: Home → Predict → Result

### Overview
**Goal**: User enters property details and receives an instant price prediction.

**User Story**: As a home buyer/seller in India, I want to enter my property details and get an accurate price estimate so I can make informed decisions.

**Trigger**: User lands on `/` (home page) or navigates from result page via "Predict Another".

### Entry Points
- [ ] Direct visit to `/` — cold start, no prior state
- [ ] From `/result` via "Predict Another" — fresh form, no prior data
- [ ] Deep link with query params (future) — pre-filled form

### Prerequisites
- [ ] Backend API reachable (health check on mount)
- [ ] Locations list loaded for dropdown

### Flow Diagram
```
[Landing on /]
    │
    ▼
┌─────────────────────┐
│   Hero + Property   │  ← Property Hero Strip (Signature)
│   Hero Strip        │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  Project Intro      │  ← Editorial section: "About this Project"
│  (collapsible)      │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  Prediction Form    │  ← 9 fields, client validation
│  (card, elevated)   │
└─────────────────────┘
    │
    ▼
◇ Submit Clicked?
    │
    ├── Valid ──▶ [Loading: Predicting...]
    │                │
    │                ▼
    │           ◇ API Success?
    │                │
    │                ├── Yes ──▶ [Navigate to /result with sessionStorage]
    │                │
    │                └── No ──▶ [Inline Error Toast + Form stays]
    │
    └── Invalid ──▶ [Inline Field Errors, Focus First Error]
```

### Steps

#### Step 1: Home Page Load
**Screen/Component**: `HomePage` (composed of `HeroStrip`, `ProjectIntro`, `PredictionFormCard`)

**User Action**: View hero, optionally read intro, fill form

**System Response**:
- API health check → shows green/red indicator
- Locations fetch → populates dropdown
- Property hero strip loads images (lazy, staggered reveal)
- Project intro renders collapsed by default

**Data**:
- Input: none
- Output: locations array, health status, hero property data

**Transitions**:
- Success → Step 2 (user fills form)
- API Health Fail → Shows warning banner, form still usable

#### Step 2: Form Interaction
**Screen/Component**: `PredictionForm` inside `PredictionFormCard`

**User Action**:
- Select location (searchable combobox)
- Enter carpet area (number, sqft)
- Select floor (number)
- Select bathrooms, balconies, parking (steppers)
- Select furnishing, transaction, ownership, facing (selects)

**System Response**:
- Real-time validation on blur
- Field-level error messages
- Submit button disabled until all valid

**Validation**:
```typescript
interface FormValidation {
  location: { required: true };
  carpet_area_sqft: { required: true, min: 100, max: 10000 };
  floor_num: { required: true, min: 0, max: 100 };
  bathroom: { required: true, min: 0, max: 10 };
  balcony: { required: true, min: 0, max: 10 };
  car_parking_num: { required: true, min: 0, max: 5 };
  furnishing: { required: true, enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'] };
  transaction: { required: true, enum: ['New Property', 'Resale'] };
  ownership: { required: true, enum: ['Freehold', 'Leasehold', 'Power of Attorney'] };
  facing: { required: true, enum: ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'] };
}
```

**Transitions**:
- All valid + Submit → Step 3
- Invalid + Submit → Inline errors, focus first invalid

#### Step 3: Prediction Submission
**Screen/Component**: `PredictionForm` (loading overlay) → Navigation to `/result`

**User Action**: Click "Predict Price"

**System Response**:
- Button shows spinner, disabled
- POST to `/api/v1/predict`
- On success: store request + response in `sessionStorage`, navigate to `/result`
- On error: toast with message, button re-enabled

**Data**:
- Input: `PredictionRequest` (9 fields)
- Output: `PredictionResponse` { predicted_price: number }

**Transitions**:
- Success → `/result` (Flow 2)
- Network Error → Toast "Unable to reach prediction service. Please try again."
- Validation Error (422) → Inline field errors
- Server Error (500) → Toast "Prediction failed. Please try again later."

---

## Flow 2: Result Page

### Overview
**Goal**: Display the predicted price with context and property details.

**User Story**: As a user, I want to see the predicted price clearly formatted in Indian currency (Cr/Lac) with my property details so I can understand and share the result.

**Trigger**: Navigation from home page after successful prediction.

### Entry Points
- [ ] From `/` via successful prediction (sessionStorage has data)
- [ ] Direct visit to `/result` — redirects to `/` if no sessionStorage data

### Prerequisites
- [ ] `sessionStorage.predictionRequest` exists
- [ ] `sessionStorage.predictionResponse` exists

### Flow Diagram
```
[Navigate to /result]
    │
    ▼
◇ sessionStorage has data?
    │
    ├── No ──▶ [Redirect to /]
    │
    └── Yes ──▶ [Render Result Page]
                    │
                    ▼
            ┌─────────────────┐
            │ Price Hero      │  ← Large formatted price (Cr/Lac)
            │ (accent color)  │
            └─────────────────┘
                    │
                    ▼
            ┌─────────────────┐
            │ Property Specs  │  ← Editorial grid: 2-col zigzag
            │ Grid            │
            └─────────────────┘
                    │
                    ▼
            ┌─────────────────┐
            │ Actions Row     │  ← Predict Another | Share | Save
            └─────────────────┘
                    │
                    ▼
            ┌─────────────────┐
            │ Model Info      │  ← Collapsible: model type, metrics, disclaimer
            └─────────────────┘
```

### Steps

#### Step 1: Result Page Load
**Screen/Component**: `ResultPage` (composed of `PriceHero`, `PropertySpecsGrid`, `ActionRow`, `ModelInfoCard`)

**User Action**: View price, review specs, take action

**System Response**:
- Reads sessionStorage, parses request + response
- Formats price: ₹1.29 Cr / ₹129.86 Lac
- Renders property specs in editorial 2-col zigzag
- Animates price count-up (motivated: reveals final value)

**Data**:
- Input: sessionStorage data
- Output: Formatted price, specs grid, model info

**Transitions**:
- "Predict Another" → Clears sessionStorage, navigates to `/`
- "Share" → Web Share API or clipboard fallback
- "Save" → LocalStorage history (future)

---

## Flow 3: Developer Contact Card

### Overview
**Goal**: User discovers and accesses developer's social links.

**User Story**: As a user, I want to contact the developer or follow their work so I can connect professionally.

**Trigger**: Click "المطور" (Developer) button in top nav.

### Flow Diagram
```
[Click Developer Button]
    │
    ▼
┌─────────────────────┐
│  Developer Card     │  ← Modal/Sheet from top-right
│  (elevated panel)   │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  4 Social Buttons   │  ← Facebook, Instagram, WhatsApp, GitHub
│  (icon + label)     │
└─────────────────────┘
    │
    ▼
◇ Click Social Link
    │
    ├── Facebook ──▶ https://facebook.com/el3araby
    ├── Instagram ──▶ https://instagram.com/priv.3rby
    ├── WhatsApp ──▶ wa.me/+201090390942
    └── GitHub ──────▶ https://github.com/al3araby
```

### States
- **Closed**: Button only visible in nav
- **Open**: Panel slides down from top-right (anchored to button)
- **Hover/Focus**: Each social button has distinct brand color hover
- **Mobile**: Full-width bottom sheet instead of dropdown

---

## State Model Summary

### Home Page States
| State | Trigger | Visual |
|-------|---------|--------|
| Loading | Mount | Skeleton for hero strip, form disabled |
| API OK | Health check success | Green pulse indicator |
| API Error | Health check fail | Red indicator + banner "API unavailable — predictions may fail" |
| Form Pristine | Initial | All fields empty, submit disabled |
| Form Dirty | User input | Live validation on blur |
| Form Submitting | Submit click | Button spinner, all fields disabled |
| Form Error | API error | Toast + field errors if 422 |

### Result Page States
| State | Trigger | Visual |
|-------|---------|--------|
| Loading | Navigate | Price skeleton count-up animation |
| Success | Data ready | Full price hero, specs grid, actions |
| No Data | Direct visit | Redirect to `/` with toast "No prediction found" |

### Developer Card States
| State | Trigger | Visual |
|-------|---------|--------|
| Closed | Default | Nav button only |
| Opening | Click button | Slide-down (150ms ease-out) |
| Open | Animation done | Panel visible, focus trapped |
| Closing | Click outside/Escape | Slide-up (120ms ease-in) |

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| User refreshes on `/result` | sessionStorage persists → page works |
| User closes tab mid-prediction | No persistence needed; fresh start on return |
| API returns 422 validation error | Map backend errors to frontend fields, show inline |
| Network offline | Toast "You're offline. Predictions will retry when online." |
| Slow connection (>3s) | Show progress "Still predicting..." at 3s mark |
| prefers-reduced-motion | Disable price count-up, slide animations instant |
| Mobile viewport | Hero strip → vertical stack; form fields full-width; dev card → bottom sheet |

---

## Accessibility Considerations

- **Focus management**: On form submit error, focus first invalid field. On result page, focus price hero heading.
- **Announcements**: `aria-live="polite"` for price result; `aria-live="assertive"` for errors.
- **Progress indication**: Submit button shows spinner + "Predicting..." text.
- **Error announcement**: Toast uses `role="alert"`.
- **Touch targets**: All interactive ≥ 48dp; dev card buttons 56dp on mobile.
- **Color contrast**: All text/background pairs pass WCAG AA (verified in DESIGN.md).
- **Keyboard**: Tab order logical; Escape closes dev card; Enter activates buttons.

---

## Analytics Events

| Event | Trigger | Properties |
|-------|---------|------------|
| `home_viewed` | Page load | `{ source: 'direct' \| 'predict_another' }` |
| `form_field_focus` | Field focus | `{ field: string }` |
| `form_submitted` | Submit click | `{ valid: boolean }` |
| `prediction_success` | API success | `{ price: number, location: string, area: number }` |
| `prediction_error` | API error | `{ code: number, message: string }` |
| `result_viewed` | Result page load | `{ price: number }` |
| `predict_another_clicked` | Button click | `{ }` |
| `developer_card_opened` | Dev button click | `{ }` |
| `social_link_clicked` | Social click | `{ platform: 'facebook' \| 'instagram' \| 'whatsapp' \| 'github' }` |

---

## Component Specifications

### Component: HeroStrip (Signature Element)

**Purpose**: The signature editorial property showcase — a horizontally scrolling strip of property cards that immediately grounds the app in real estate. Not a carousel; user controls scroll.

**Variants**:
- `default`: Horizontal scroll on desktop, vertical stack on mobile
- `compact`: Reduced height for secondary pages (not used in MVP)

**Props**:
```typescript
interface HeroStripProps {
  /** Array of property showcase items */
  properties: PropertyShowcase[];
  /** Scroll snap alignment */
  snapAlign?: 'start' | 'center' | 'end';
}

interface PropertyShowcase {
  id: string;
  imageUrl: string;           // Property photo (Unsplash source)
  location: string;           // e.g., "Whitefield, Bangalore"
  price: string;              // e.g., "₹1.2 Cr"
  bhk: string;                // e.g., "3 BHK"
  area: string;               // e.g., "1,450 sqft"
  propertyType: 'apartment' | 'villa' | 'plot';
}
```

**States**:
| State | Visual | Behavior |
|-------|--------|----------|
| Default | Cards side-by-side, gaps 16px, scrollable | Horizontal scroll with snap; scrollbar hidden |
| Loading | Skeleton cards (shimmer) | 3 skeletons shown while images load |
| Image Loaded | Photo fades in (150ms) | Staggered: 0ms, 80ms, 160ms per card |
| Hover (desktop) | Card lifts (shadow md → lg), scale 1.02 | Transform + shadow transition 200ms |
| Focus | Accent ring (3px) | Visible focus for keyboard nav |
| Mobile | Vertical stack, full-width cards | No scroll snap; natural scroll |

**Responsive Behavior**:
| Breakpoint | Behavior |
|------------|----------|
| Mobile (<640px) | Vertical stack, each card full-width, 16px gap |
| Tablet (640-1024px) | Horizontal, 2 cards visible, scroll snap |
| Desktop (>1024px) | Horizontal, 3 cards visible, scroll snap |

**Accessibility**:
- **ARIA**: `role="list"`, each card `role="listitem"`
- **Keyboard**: Arrow keys scroll horizontally; Tab moves between cards
- **Screen Reader**: Announces "Property showcase, X properties" on entry
- **Reduced Motion**: No hover lift; instant state changes

**Animations**:
| Trigger | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Enter (staggered) | Fade + translateY(16px) → 0 | 400ms | ease-out-expo |
| Image Load | Opacity 0 → 1 | 150ms | ease-out |
| Hover | Transform scale(1.02) + shadow | 200ms | ease-out |

**Composition**:
- Uses `PropertyCard` compound component internally
- Slot: none (data-driven)

**Dependencies**:
- Required: `framer-motion` (staggered enter), `lucide-react` (icons)
- Peer: `PropertyCard`

**Implementation Notes**:
- Images from Unsplash Source (curated real estate photos) — `https://images.unsplash.com/photo-{id}?w=400&h=300&fit=crop`
- Lazy load with `IntersectionObserver`
- Staggered reveal only on first mount (not on scroll)

**Acceptance Criteria**:
- [ ] Renders 3+ property cards with images, specs, location badges
- [ ] Horizontal scroll with snap on desktop; vertical stack on mobile
- [ ] Staggered entrance animation on mount
- [ ] Hover lift + focus ring on desktop
- [ ] All text passes WCAG AA on image overlay (use gradient overlay)
- [ ] `prefers-reduced-motion` disables entrance + hover animations

---

### Component: ProjectIntro

**Purpose**: Collapsible editorial section explaining the project — ML pipeline, dataset, model, tech stack. Builds trust through transparency.

**Variants**:
- `default`: Collapsed by default, expands on click
- `expanded`: Force open (for direct links)

**Props**:
```typescript
interface ProjectIntroProps {
  /** Initially expanded */
  defaultOpen?: boolean;
  /** Callback when toggle changes */
  onToggle?: (open: boolean) => void;
}
```

**States**:
| State | Visual | Behavior |
|-------|--------|----------|
| Collapsed | Header only: title + chevron down | Click → expands |
| Expanded | Full content: 4 editorial columns | Click → collapses |
| Transition | Height animate, chevron rotate | 300ms ease-out-expo |
| Hover Header | Text color: muted → accent | 150ms |

**Responsive Behavior**:
| Breakpoint | Behavior |
|------------|----------|
| Mobile (<640px) | Single column stack, generous spacing |
| Tablet (640-1024px) | 2-col grid |
| Desktop (>1024px) | 4-col editorial grid |

**Content Structure** (editorial columns):
1. **The Data** — 187K+ listings, India, Kaggle source, cleaning steps
2. **The Model** — RandomForest, 93.4% R², 5-fold CV, feature types
3. **The Stack** — FastAPI, React, Tailwind, Docker, pytest
4. **The Team** — Solo student project, links to GitHub/LinkedIn

**Accessibility**:
- **ARIA**: `aria-expanded` on trigger, `aria-controls` points to content region
- **Keyboard**: Enter/Space toggles; focus stays on trigger
- **Screen Reader**: Announces "Project details, expanded/collapsed"

**Animations**:
| Trigger | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Expand | Height 0 → auto, fade in | 300ms | ease-out-expo |
| Collapse | Height auto → 0, fade out | 225ms | ease-in |

**Dependencies**:
- Peer: `Button` (trigger), `Icon` (chevron)

**Acceptance Criteria**:
- [ ] Collapsed by default, expands on click
- [ ] 4-column editorial layout on desktop
- [ ] Smooth height animation (no layout shift)
- [ ] Chevron rotates 180° on toggle
- [ ] Content readable and well-structured

---

### Component: PredictionFormCard

**Purpose**: Elevated container for the prediction form — provides visual hierarchy and focus.

**Variants**:
- `default`: Standard elevation, full-width on mobile
- `compact`: Reduced padding (not used)

**Props**:
```typescript
interface PredictionFormCardProps {
  /** Form component (render prop) */
  children: React.ReactNode;
  /** Title above form */
  title?: string;
  /** Subtitle/description */
  description?: string;
}
```

**States**:
| State | Visual | Behavior |
|-------|--------|----------|
| Default | Surface bg, elevated shadow, rounded 2xl | Static |
| Form Submitting | Overlay: semi-transparent surface + spinner | Blocks interaction |
| Error Banner | Top border accent, dismissible | Shows API error message |

**Responsive Behavior**:
| Breakpoint | Behavior |
|------------|----------|
| Mobile (<640px) | Full-width, padding 20px, radius lg |
| Tablet (640-1024px) | Max-width 560px, centered, padding 24px |
| Desktop (>1024px) | Max-width 560px, centered, padding 32px |

**Accessibility**:
- **ARIA**: `role="region"`, `aria-labelledby` = title
- **Focus**: Trap not needed; form handles internal focus

**Dependencies**:
- Peer: `PredictionForm`, `Button`, `Toast`

**Acceptance Criteria**:
- [ ] Elevated card with subtle shadow
- [ ] Form submits correctly
- [ ] Loading overlay blocks interaction
- [ ] Error banner dismissible

---

### Component: PredictionForm

**Purpose**: The 9-field prediction form with client-side validation and accessible patterns.

**Variants**: Single (only one form in app)

**Props**:
```typescript
interface PredictionFormProps {
  /** Callback on successful validation + submit */
  onSubmit: (data: PredictionRequest) => Promise<void>;
  /** Whether submission is in progress */
  isSubmitting?: boolean;
  /** Locations for combobox */
  locations: string[];
  /** API health status */
  apiStatus: 'checking' | 'ok' | 'error';
}
```

**Fields** (in order):
1. **Location** — Searchable combobox (autocomplete), required
2. **Carpet Area** — Number input (sqft), min 100, max 10000, step 50
3. **Floor** — Number input, min 0, max 100
4. **Bathrooms** — Stepper (0-10)
5. **Balconies** — Stepper (0-10)
6. **Parking** — Stepper (0-5)
7. **Furnishing** — Select: Furnished / Semi-Furnished / Unfurnished
8. **Transaction** — Select: New Property / Resale
9. **Ownership** — Select: Freehold / Leasehold / Power of Attorney
10. **Facing** — Select: 8 compass directions

**States** (per field):
| State | Visual | Behavior |
|-------|--------|----------|
| Default | Border subtle, bg surface | Ready |
| Focus | Border accent (2px), ring accent/20 | Shows helper text |
| Filled Valid | Border subtle, check icon (muted) | Valid |
| Error | Border danger, error text below | Shake on submit attempt |
| Disabled | Opacity 0.5, cursor not-allowed | Non-interactive |

**Field Groups** (cognitive load ≤ 4):
- Group 1: Location + Area (2 fields)
- Group 2: Floor + Bathrooms + Balconies + Parking (4 fields)
- Group 3: Furnishing + Transaction + Ownership + Facing (4 fields)

**Responsive Behavior**:
| Breakpoint | Behavior |
|------------|----------|
| Mobile (<640px) | Single column, full-width fields, steppers horizontal |
| Tablet (640-1024px) | 2-col: Location/Area + Floor/Rooms; selects 2-col |
| Desktop (>1024px) | Same as tablet, wider fields |

**Accessibility**:
- **ARIA**: Each field `aria-invalid`, `aria-describedby` for error/helper
- **Labels**: Visible `<label>` for every input
- **Keyboard**: Tab order follows visual; Enter on last field → submit
- **Screen Reader**: Announces errors on submit attempt
- **Autocomplete**: `autocomplete` attrs for browser fill

**Validation**:
- On blur: validate single field
- On submit: validate all, focus first invalid
- Real-time: clear error on input after error shown

**Dependencies**:
- Required: `@radix-ui/react-select`, `@radix-ui/react-combobox`, `@radix-ui/react-slider` (or custom stepper)
- Peer: `Input`, `Select`, `Stepper`, `Button`, `Label`, `Toast`

**Acceptance Criteria**:
- [ ] All 9 fields render with correct types
- [ ] Location combobox: searchable, filters, creates "other" for unknown
- [ ] Number inputs: stepper buttons, keyboard arrows, min/max enforced
- [ ] Selects: native or Radix, keyboard navigable
- [ ] Validation on blur + submit
- [ ] Submit disabled until all valid
- [ ] Loading state disables all, shows spinner
- [ ] Error toast on API failure
- [ ] Focus management on error

---

### Component: PriceHero (Result Page)

**Purpose**: Large, dramatic price display — the moment of truth. Formatted in Indian currency (Cr/Lac).

**Variants**:
- `default`: Large display, accent color, count-up animation
- `compact`: Smaller for history/list views (future)

**Props**:
```typescript
interface PriceHeroProps {
  /** Raw price in rupees */
  price: number;
  /** Location for context */
  location?: string;
  /** Whether to animate count-up */
  animate?: boolean;
}
```

**Price Formatting**:
- ≥ 1 Cr: `₹{cr}.{lac} Cr` (e.g., ₹1.29 Cr)
- Also show: `₹{total_lac} Lac` (e.g., ₹129.86 Lac)
- < 1 Cr: `₹{lac}.{thousand} Lac` (e.g., ₹85.50 Lac)

**States**:
| State | Visual | Behavior |
|-------|--------|----------|
| Loading | Skeleton: accent-colored bars | Pulse animation |
| Ready | Large Syne display, accent color | Count-up if animate=true |
| Static | Same, no animation | For reduced motion |

**Responsive Behavior**:
| Breakpoint | Behavior |
|------------|----------|
| Mobile (<640px) | Text-5xl (48px), price + lac on same line |
| Tablet (640-1024px) | Text-7xl (72px), price + lac stacked |
| Desktop (>1024px) | Text-8xl (96px), generous measure |

**Accessibility**:
- **ARIA**: `role="heading"`, `aria-level="1"`, `aria-live="polite"`
- **Screen Reader**: Announces "Predicted price: 1 crore 29 lac rupees"
- **Reduced Motion**: Instant final value

**Animations**:
| Trigger | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Count-up | 0 → target (easing) | 800ms | ease-out-expo |
| Enter | Fade + scale(0.96) → 1 | 400ms | ease-out-expo |

**Dependencies**:
- Required: `framer-motion` (count-up)
- Utility: `formatIndianCurrency(price)` helper

**Acceptance Criteria**:
- [ ] Formats correctly: Cr/Lac with 2 decimals
- [ ] Count-up animation smooth (800ms)
- [ ] Accent color (teal) for price, muted for "Lac" label
- [ ] Location badge below price (muted)
- [ ] Responsive sizing
- [ ] `prefers-reduced-motion` respected

---

### Component: PropertySpecsGrid

**Purpose**: Editorial 2-col zigzag grid showing the input property details with icons.

**Variants**:
- `default`: Zigzag (image-left, text-right alternating) — but we have no images, so: label-value pairs in alternating visual treatment
- `compact`: Dense table (future)

**Props**:
```typescript
interface PropertySpecsGridProps {
  /** The original prediction request */
  request: PredictionRequest;
  /** Formatted price for reference */
  formattedPrice: { cr: string; lac: string };
}
```

**Spec Items** (10 items → 5 rows zigzag):
1. Location
2. Carpet Area
3. Floor
4. Bathrooms
5. Balconies
6. Parking
7. Furnishing
8. Transaction Type
9. Ownership
10. Facing

**States**:
| State | Visual | Behavior |
|-------|--------|----------|
| Default | Alternating surface/elevated rows, icon + label + value | Static |
| Hover Row | Row bg: surface → elevated | Subtle highlight |
| Loading | Skeleton rows | Pulse |

**Responsive Behavior**:
| Breakpoint | Behavior |
|------------|----------|
| Mobile (<640px) | Single column, cards with icon left, label top, value bottom |
| Tablet (640-1024px) | 2-col grid, zigzag background |
| Desktop (>1024px) | 2-col, wider, more generous padding |

**Accessibility**:
- **ARIA**: `role="list"`, each spec `role="listitem"`
- **Screen Reader**: Reads "Location: Whitefield, Bangalore. Carpet Area: 1,200 sqft..."

**Dependencies**:
- Peer: `Icon` (lucide-react), `Typography`

**Acceptance Criteria**:
- [ ] All 10 specs displayed
- [ ] Zigzag visual treatment on desktop
- [ ] Icons meaningful per spec (MapPin, Square, Building, etc.)
- [ ] Mobile: stacked cards
- [ ] Hover highlight on desktop

---

### Component: ActionRow

**Purpose**: Primary actions after seeing result — Predict Again, Share, Save.

**Variants**:
- `default`: 3 buttons, primary + secondary + ghost

**Props**:
```typescript
interface ActionRowProps {
  /** Handler for predict again */
  onPredictAgain: () => void;
  /** Handler for share */
  onShare: () => Promise<void>;
  /** Handler for save (future) */
  onSave?: () => void;
  /** Price for share text */
  price: number;
  /** Location for share text */
  location: string;
}
```

**Buttons**:
1. **Predict Again** — Primary (accent bg), full-width mobile, icon: RefreshCw
2. **Share** — Secondary (border), icon: Share2
3. **Save** — Ghost (text only), icon: Bookmark (disabled in MVP)

**States**:
| State | Visual | Behavior |
|-------|--------|----------|
| Default | Per variant styles | Ready |
| Hover | Per variant hover | Transition 150ms |
| Focus | Accent ring (3px) | Visible |
| Loading (Share) | Spinner + "Sharing..." | Web Share API |
| Disabled (Save) | Opacity 0.4 | Not clickable |

**Responsive Behavior**:
| Breakpoint | Behavior |
|------------|----------|
| Mobile (<640px) | Stacked full-width, Predict Again first |
| Tablet+ | Horizontal, equal width or fit-content |

**Accessibility**:
- **ARIA**: Buttons have clear labels; Share announces "Share dialog opened"
- **Keyboard**: Tab order left-to-right; Enter activates

**Dependencies**:
- Peer: `Button`, `Toast` (share success/error)

**Acceptance Criteria**:
- [ ] Predict Again clears sessionStorage, navigates to `/`
- [ ] Share uses Web Share API, clipboard fallback
- [ ] Save shows "Coming soon" toast (MVP)
- [ ] Responsive layout

---

### Component: ModelInfoCard

**Purpose**: Collapsible technical details — model type, metrics, disclaimer. Builds credibility.

**Variants**:
- `default`: Collapsed, expands on click

**Props**:
```typescript
interface ModelInfoCardProps {
  /** Model metrics from model_metrics.json */
  metrics: ModelMetrics;
}
```

**Content** (when expanded):
- **Model**: RandomForestRegressor (scikit-learn)
- **Training Samples**: 76,210 | **Test Samples**: 19,053
- **Metrics**: MAE: ₹9.52L | RMSE: ₹34.3L | R²: 0.934
- **CV**: 5-Fold RMSE: ₹65.6L ± ₹24.8L
- **Features**: 5 numeric + 4 categorical (top-N grouped)
- **Disclaimer**: "Predictions are estimates based on historical data. Actual prices vary by market conditions, negotiation, and property specifics. Consult a professional for financial decisions."

**States**: Same as `ProjectIntro` (collapsed/expanded)

**Accessibility**: Same as `ProjectIntro`

**Acceptance Criteria**:
- [ ] Collapsed by default
- [ ] Shows all metrics clearly
- [ ] Disclaimer prominent
- [ ] Smooth expand/collapse

---

### Component: DeveloperCard

**Purpose**: Dropdown/bottom-sheet panel with 4 social links — the "المطور" (Developer) button trigger.

**Variants**:
- `dropdown`: Desktop, anchored to nav button
- `bottom-sheet`: Mobile, full-width from bottom

**Props**:
```typescript
interface DeveloperCardProps {
  /** Open state */
  open: boolean;
  /** Close handler */
  onClose: () => void;
}
```

**Social Links**:
| Platform | URL | Brand Color (hover) | Icon |
|----------|-----|---------------------|------|
| Facebook | https://facebook.com/el3araby | #1877F2 | Facebook |
| Instagram | https://instagram.com/priv.3rby | #E4405F (gradient) | Instagram |
| WhatsApp | https://wa.me/+201090390942 | #25D366 | MessageCircle |
| GitHub | https://github.com/al3araby | #FFFFFF (on dark) | Github |

**States**:
| State | Visual | Behavior |
|-------|--------|----------|
| Closed | Hidden | — |
| Opening (dropdown) | Slide down + fade from top-right | 150ms ease-out |
| Opening (sheet) | Slide up + fade from bottom | 200ms ease-out |
| Open | Panel visible, focus trapped | Click outside/Escape → close |
| Closing | Reverse of opening | 120ms/150ms ease-in |
| Hover Button | Brand color bg, white icon | 150ms |

**Responsive Behavior**:
| Breakpoint | Behavior |
|------------|----------|
| Mobile (<640px) | Bottom sheet, 4 large touch targets (56dp), grabber handle |
| Desktop (≥640px) | Dropdown anchored to button, 4 icon+label buttons |

**Accessibility**:
- **ARIA**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` = heading
- **Focus Trap**: Tab cycles within panel; Escape closes
- **Screen Reader**: Announces "Developer contact, 4 links"
- **Keyboard**: Arrow keys navigate between links

**Animations**:
| Trigger | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Open (dropdown) | TranslateY(-8px) → 0, opacity 0→1 | 150ms | ease-out |
| Open (sheet) | TranslateY(100%) → 0, opacity 0→1 | 200ms | ease-out |
| Close | Reverse | 75% of open | ease-in |
| Button Hover | Scale 1.05, brand bg | 150ms | ease-out |

**Dependencies**:
- Required: `@radix-ui/react-dropdown-menu` or `@radix-ui/react-dialog` (sheet)
- Peer: `Button`, `Icon` (lucide-react)

**Acceptance Criteria**:
- [ ] Button in nav: "المطور" + user icon
- [ ] Dropdown on desktop, bottom sheet on mobile
- [ ] 4 social buttons with correct icons, labels, brand colors on hover
- [ ] Links open in new tab (rel="noopener noreferrer")
- [ ] Focus trap + Escape to close
- [ ] Smooth animations, respects reduced motion
- [ ] WhatsApp opens wa.me link with phone number

---

### Component: NavBar

**Purpose**: Top navigation — logo, API status, Developer button.

**Variants**: Single

**Props**:
```typescript
interface NavBarProps {
  /** API health status */
  apiStatus: 'checking' | 'ok' | 'error';
  /** Developer card open handler */
  onDeveloperClick: () => void;
}
```

**Structure**:
- Left: Logo (icon + "HousePrice") — link to `/`
- Center: API status indicator (pulse dot + text)
- Right: Developer button (icon + "المطور")

**States**:
| State | Visual | Behavior |
|-------|--------|----------|
| Default | Fixed top, surface bg, border bottom | Sticky |
| API Checking | Yellow pulse dot | Animated |
| API OK | Green pulse dot | Static |
| API Error | Red pulse dot + "API Unavailable" | Static |

**Responsive Behavior**:
| Breakpoint | Behavior |
|------------|----------|
| Mobile | Logo left, status center (icon only), dev button right |
| Desktop | Full labels, spaced |

**Accessibility**:
- **ARIA**: Status `aria-live="polite"`; dev button `aria-haspopup="dialog"`
- **Keyboard**: All focusable

**Dependencies**:
- Peer: `DeveloperCard`, `Button`, `Indicator`

**Acceptance Criteria**:
- [ ] Fixed top, doesn't scroll away
- [ ] API status updates in real-time
- [ ] Developer button opens card
- [ ] Logo links to home

---

### Component: Toast

**Purpose**: Non-blocking notifications for errors, success, info.

**Variants**:
- `error`: Danger border, danger icon
- `success`: Success border, check icon
- `info`: Info border, info icon
- `warning`: Warning border, alert icon

**Props**:
```typescript
interface ToastProps {
  /** Message */
  message: string;
  /** Variant */
  variant: 'error' | 'success' | 'info' | 'warning';
  /** Auto-dismiss ms (0 = persistent) */
  duration?: number;
  /** Action button */
  action?: { label: string; onClick: () => void };
  /** Dismiss callback */
  onDismiss: () => void;
}
```

**States**:
| State | Visual | Behavior |
|-------|--------|----------|
| Enter | Slide from right + fade | 200ms ease-out |
| Visible | Elevated, border-left accent (variant) | Auto-dismiss if duration |
| Hover | Pause auto-dismiss | Pauses timer |
| Exit | Slide right + fade | 150ms ease-in |

**Responsive Behavior**:
| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full-width bottom, safe area inset |
| Desktop | Top-right, max-width 400px, stack |

**Accessibility**:
- **ARIA**: `role="alert"` (error), `role="status"` (others), `aria-live="assertive"` (error) / "polite"
- **Keyboard**: Focus on mount; Escape dismisses

**Dependencies**:
- Required: `framer-motion` (animations)
- Context: `ToastProvider` for queue management

**Acceptance Criteria**:
- [ ] Multiple toasts queue/stack
- [ ] Auto-dismiss configurable
- [ ] Action button works
- [ ] Respects reduced motion
- [ ] Accessible announcements

---

## Build Handoff

### Target Agent
**`react-vite-tailwind-engineer`** — Pure SPA, client-only, Vite + React 18 + TypeScript + Tailwind CSS v3

### Design System
**Radix UI primitives + shadcn/ui patterns** (headless, accessible, themeable with our locked tokens)
- Install: `npm install @radix-ui/react-* class-variance-authority clsx tailwind-merge lucide-react framer-motion`
- Setup: Copy shadcn/ui `utils.ts` (cn helper), configure Tailwind with our tokens
- **Rule**: Theme the design system with our locked tokens; do NOT re-implement its components.

### Acceptance Criteria
- [ ] **Home Page (`/`)**: HeroStrip (signature) → ProjectIntro → PredictionFormCard → NavBar with API status + Developer button
- [ ] **Result Page (`/result`)**: PriceHero (count-up) → PropertySpecsGrid (zigzag) → ActionRow → ModelInfoCard
- [ ] **DeveloperCard**: Dropdown (desktop) / Bottom Sheet (mobile) with 4 social links (FB, IG, WA, GH) — correct URLs, brand hover colors, new tab
- [ ] **Dark theme only**: All tokens from DESIGN.md applied via Tailwind config (OKLCH → hex mapping)
- [ ] **Typography**: Syne (display), DM Sans (body), JetBrains Mono (utility) — loaded via `@fontsource` or Google Fonts
- [ ] **Animations**: Framer Motion for staggered reveal, count-up, slide transitions — all respect `prefers-reduced-motion`
- [ ] **Accessibility**: All ARIA, focus management, contrast, touch targets as specified
- [ ] **Responsive**: Mobile-first, breakpoints per DESIGN.md (640, 768, 1024, 1280, 1536)
- [ ] **Form**: 9 fields, client validation, combobox for location, steppers for counts, selects for enums
- [ ] **API Integration**: Uses existing `predictionClient.ts`, `sessionStorage` for request/response passing
- [ ] **Toast System**: Queue, variants, auto-dismiss, accessible
- [ ] **Build passes**: `npm run build` no errors, `npm run lint` clean
- [ ] **No drift**: Every visual value traces to DESIGN.md tokens

### File Structure (suggested)
```
frontend/src/
├── components/
│   ├── ui/                    # shadcn-style primitives (Button, Input, Select, etc.)
│   ├── HeroStrip.tsx
│   ├── PropertyCard.tsx
│   ├── ProjectIntro.tsx
│   ├── PredictionFormCard.tsx
│   ├── PredictionForm.tsx
│   ├── PriceHero.tsx
│   ├── PropertySpecsGrid.tsx
│   ├── ActionRow.tsx
│   ├── ModelInfoCard.tsx
│   ├── DeveloperCard.tsx
│   ├── NavBar.tsx
│   └── Toast.tsx
├── pages/
│   ├── HomePage.tsx
│   └── ResultPage.tsx
├── hooks/
│   ├── useToast.ts
│   └── useReducedMotion.ts
├── lib/
│   ├── utils.ts               # cn helper
│   └── formatters.ts          # formatIndianCurrency
├── styles/
│   └── globals.css            # Tailwind + CSS variables for tokens
├── tailwind.config.ts         # Locked tokens from DESIGN.md
└── main.tsx
```

### Key Implementation Notes
1. **Tailwind Config**: Map DESIGN.md tokens to `theme.extend` — colors (OKLCH via hex), fontFamily, spacing, borderRadius, boxShadow, animation, zIndex
2. **CSS Variables**: Define `:root` and `.dark` (only dark) with semantic names (`--color-background`, `--color-accent`, etc.) for Radix theming
3. **Fonts**: `@fontsource/syne`, `@fontsource/dm-sans`, `@fontsource/jetbrains-mono` — variable weights
4. **HeroStrip Images**: Curated Unsplash IDs for Indian real estate — pre-select 6-8 photos, lazy load
5. **Form Validation**: React Hook Form + Zod (schema from spec) — or custom lightweight validation
6. **Location Combobox**: Radix Combobox with filter + "Other" option for unknown locations
7. **Steppers**: Custom component (Radix Slider styled) or number input with buttons
8. **SessionStorage**: Type-safe helpers for `predictionRequest` / `predictionResponse`
9. **Reduced Motion**: `useReducedMotion()` hook → `prefers-reduced-motion` media query

### Revise-and-Justify Log
- Changed accent from indigo to **teal (#14c8a8)** — real estate feels fresh/trustworthy, not corporate blue
- Chose **Syne** over Fraunces/Playfair — geometric display fits editorial + data, not "creative default"
- **Property Hero Strip** as Signature — not a carousel, not a hero image — horizontal scroll strip is distinctive for property browsing
- **Editorial 4-col Project Intro** — not a generic "About" card — builds credibility through transparency
- **Zigzag specs grid** — not 3 equal cards — editorial rhythm, avoids AI slop pattern
- **Bottom sheet on mobile** for dev card — not dropdown — thumb-reachable, native feel
- **No gradient text, no purple glow, no cream backgrounds** — all banned slop patterns avoided