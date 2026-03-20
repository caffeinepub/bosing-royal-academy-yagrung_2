# Bosing Royal Academy Yagrung

## Current State
The site has a full backend with SiteInfo, news, events, staff, gallery, FAQs, achievements, and blob-storage. The admin panel manages all content but does not include logo management. The Layout component shows a hardcoded school logo/name.

## Requested Changes (Diff)

### Add
- Backend: `setLogoBlob` and `getLogoBlob` functions to store and retrieve the school logo as a blob via blob-storage
- Admin panel: "Logo" section where admin can upload a new logo image; shows current logo preview
- Layout/Navbar: Display the uploaded logo from backend if available, fallback to text

### Modify
- Layout.tsx: Fetch and display logo from backend blob storage
- AdminPanel.tsx: Add Logo management tab/section

### Remove
- Nothing removed

## Implementation Plan
1. Add `logoBlob` state variable and `setLogoBlob`/`getLogoBlob` functions to backend
2. Update AdminPanel to include logo upload using blob-storage upload flow
3. Update Layout to fetch and display the logo blob URL
