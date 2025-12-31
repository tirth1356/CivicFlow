# Quick Map Setup

## Step 1: Add Your Campus Map

1. Get your campus map image (PNG/JPG)
2. Place it in the `public` folder:
   ```
   public/campus-map.jpg
   ```
   (or `campus-map.png`)

## Step 2: Configure Block Positions

Edit `src/config/campusMap.js`:

```javascript
export const CAMPUS_BLOCKS = {
  'Block A': { x: 20, y: 30 },  // Adjust these values
  'Block B': { x: 40, y: 30 },
  // ... etc
};
```

**Coordinates are percentages:**
- `x: 20` means 20% from left
- `y: 30` means 30% from top

## Step 3: Test It!

1. Run `npm run dev`
2. Login to your dashboard
3. Click "View Campus Map"
4. You should see pins on your map!

## Finding Coordinates

**Method 1: Image Editor**
1. Open map in image editor
2. Note pixel position of each block
3. Convert: `(pixel / imageSize) * 100`

**Method 2: Trial and Error**
1. Start with estimated values
2. View map and adjust
3. Refresh to see changes

## Example Coordinates

For a typical campus map (1920x1080):

```
Block A (top-left area):     { x: 15, y: 25 }
Block B (top-center):        { x: 50, y: 25 }
Block C (top-right):         { x: 85, y: 25 }
Hostel (bottom-left):         { x: 20, y: 70 }
Library (center-top):         { x: 50, y: 15 }
Academic Block (right):       { x: 75, y: 50 }
```

Adjust based on your actual map layout!

