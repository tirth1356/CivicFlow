# Interactive Campus Map Feature Guide

## Overview

The interactive campus map feature allows users to visualize issues on a campus map with color-coded pins based on issue categories.

## Setup Instructions

### 1. Add Your Campus Map Image

Place your campus map image in the `public` folder:

```
public/
  └── campus-map.jpg  (or .png)
```

**Recommended:**
- Format: JPG or PNG
- Size: 1920x1080 or similar (16:9 aspect ratio works best)
- File size: Under 2MB for faster loading

### 2. Configure Block Coordinates

Edit `src/config/campusMap.js` to match your campus layout:

```javascript
export const CAMPUS_BLOCKS = {
  'Block A': { x: 20, y: 30 },      // x and y are percentages (0-100)
  'Block B': { x: 40, y: 30 },
  'Block C': { x: 60, y: 30 },
  'Hostel': { x: 25, y: 60 },
  'Library': { x: 50, y: 20 },
  'Academic Block': { x: 70, y: 50 },
};
```

**How to find coordinates:**
1. Open your map image in an image editor
2. Note the pixel position of each block
3. Convert to percentage:
   - `x = (pixelX / imageWidth) * 100`
   - `y = (pixelY / imageHeight) * 100`

### 3. Customize Category Colors

Edit `CATEGORY_COLORS` in `src/config/campusMap.js`:

```javascript
export const CATEGORY_COLORS = {
  'Water': '#3B82F6',      // Blue
  'Electricity': '#F59E0B', // Amber
  'WiFi': '#8B5CF6',        // Purple
  'Cleanliness': '#10B981', // Green
  'Infrastructure': '#EF4444', // Red
  // Add your custom categories here
};
```

## How It Works

### Pin Placement

1. **When reporting an issue:**
   - User selects a block from dropdown
   - System automatically gets coordinates from `CAMPUS_BLOCKS`
   - Coordinates are saved with the issue in Firestore

2. **On the map:**
   - Pins are positioned using CSS absolute positioning
   - Coordinates are percentages for responsive design
   - Each block shows a pin with issue count

### Color Coding

- Pins are colored based on the **most common category** for that block
- If multiple issues exist, the first issue's category determines the color
- Hover over pins to see block name and issue count

### Role-Based Rendering

**Students:**
- See only their own reported issues
- Limited information in pin details

**Admins:**
- See all issues across campus
- Full issue details including report time
- Can see all pins regardless of reporter

## Firestore Data Structure

Issues now include map coordinates:

```javascript
{
  title: "Water Leak",
  description: "...",
  category: "Water",
  block: "Block A",
  mapX: 20,        // Percentage (0-100)
  mapY: 30,        // Percentage (0-100)
  reportedBy: "userId",
  createdAt: "2024-01-01T00:00:00.000Z",
  // ... other fields
}
```

## Accessing the Map

- **Route:** `/map`
- **From Dashboard:** Click "View Campus Map" button
- **Requires:** Authentication and email verification

## Features

✅ Interactive pins on campus map
✅ Color-coded by category
✅ Issue count on each pin
✅ Click pins to see issue details
✅ Role-based data visibility
✅ Responsive design
✅ Real-time updates via Firestore

## Troubleshooting

### Map image not showing
- Check file is in `public/` folder
- Verify filename matches: `campus-map.jpg`
- Check browser console for 404 errors

### Pins in wrong position
- Adjust coordinates in `campusMap.js`
- Coordinates are percentages (0-100)
- Test with different values

### No pins showing
- Check if issues exist in Firestore
- Verify block names match exactly (case-sensitive)
- Check browser console for errors

### Colors not matching
- Update `CATEGORY_COLORS` in config
- Ensure category names match exactly

## Customization

### Add More Blocks

1. Add to `CAMPUS_BLOCKS` in `campusMap.js`
2. Add to block dropdown in issue form
3. Update coordinates

### Add More Categories

1. Add to category dropdown in issue form
2. Add color to `CATEGORY_COLORS`
3. Pins will automatically use new colors

### Change Pin Style

Edit `CampusMap.jsx` component:
- Pin size: Change `w-8 h-8` classes
- Pin shape: Modify `rounded-full` class
- Pin border: Adjust `border-2` class

---

**Need help?** Check the browser console (F12) for error messages!

