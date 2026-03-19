# Bosing Royal Academy Yagrung

## Current State
Empty scaffolded project with default Motoko actor and no frontend pages.

## Requested Changes (Diff)

### Add
- Full school website with 13 public-facing pages:
  1. Home (hero, highlights, quick links)
  2. About Us (history, vision, mission)
  3. Principal's Message
  4. Staff & Faculty (profiles with photo, name, role)
  5. Academics (programs, curriculum overview)
  6. Admissions (process, requirements, fees)
  7. News & Announcements (list of posts)
  8. Events (upcoming events)
  9. Gallery (photo gallery)
  10. Student Life
  11. Achievements & Awards
  12. Contact Us (contact info, map placeholder)
  13. FAQs
- Admin panel (login-gated) for managing:
  - News & Announcements (create, edit, delete)
  - Events (create, edit, delete)
  - Staff profiles (create, edit, delete)
  - Gallery images (upload, delete)
  - FAQs (create, edit, delete)
  - Achievements (create, edit, delete)
- Role-based access: admin users can manage content
- Blob storage for gallery images and staff profile photos

### Modify
- Replace default backend actor with full school CMS actor
- Replace default frontend with multi-page school website

### Remove
- Default empty actor and placeholder frontend

## Implementation Plan
1. Select authorization and blob-storage components
2. Generate Motoko actor with data types and CRUD for: News, Events, Staff, Gallery, FAQs, Achievements, and SiteInfo
3. Build React frontend with:
   - Public navigation with 13 pages
   - Home page with hero section and highlights
   - Content pages rendering data from backend
   - Admin dashboard (role-protected) with forms for all content types
   - Gallery page with image upload via blob-storage
   - Staff page with photo upload
   - Contact page with school info
