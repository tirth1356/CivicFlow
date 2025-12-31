// Map image dimensions for coordinate calculations
export const mapDimensions = {
  width: 1227,
  height: 863
};

// Convert pixel coordinates to percentage
export const pixelToPercentage = (pixelX, pixelY) => {
  return {
    x: (pixelX / mapDimensions.width) * 100,
    y: (pixelY / mapDimensions.height) * 100
  };
};

// Campus map configuration with block coordinates and details
export const campusBlocks = [
  {
    id: 1,
    name: 'A Block',
    coordinates: pixelToPercentage(239, 302),
    description: 'Main academic building with classrooms and laboratories.',
    facilities: ['Classrooms', 'Computer Labs', 'Faculty Offices']
  },
  {
    id: 2,
    name: 'B Block',
    coordinates: pixelToPercentage(236, 534),
    description: 'Engineering and technical departments.',
    facilities: ['Engineering Labs', 'Workshop', 'Technical Library']
  },
  {
    id: 3,
    name: 'C Block',
    coordinates: pixelToPercentage(452, 299),
    description: 'Science and research facilities.',
    facilities: ['Science Labs', 'Research Center', 'Observatory']
  },
  {
    id: 4,
    name: 'D Block',
    coordinates: pixelToPercentage(463, 531),
    description: 'Arts and humanities building.',
    facilities: ['Art Studios', 'Music Room', 'Theater']
  },
  {
    id: 5,
    name: 'ID Block',
    coordinates: pixelToPercentage(215, 415),
    description: 'Identity and documentation services.',
    facilities: ['ID Office', 'Documentation', 'Records']
  },
  {
    id: 6,
    name: 'E Block',
    coordinates: pixelToPercentage(753, 282),
    description: 'Extended academic facilities.',
    facilities: ['Lecture Halls', 'Seminar Rooms', 'Study Areas']
  },
  {
    id: 7,
    name: 'N/W Block',
    coordinates: pixelToPercentage(621, 351),
    description: 'North-West academic block.',
    facilities: ['Classrooms', 'Labs', 'Faculty Offices']
  },
  {
    id: 8,
    name: 'K Canteen',
    coordinates: pixelToPercentage(488, 417),
    description: 'Main canteen facility.',
    facilities: ['Dining Hall', 'Kitchen', 'Seating Area']
  },
  {
    id: 9,
    name: 'Law Canteen',
    coordinates: pixelToPercentage(689, 637),
    description: 'Law department canteen.',
    facilities: ['Food Court', 'Seating', 'Vending Machines']
  },
  {
    id: 10,
    name: 'Pharma Canteen',
    coordinates: pixelToPercentage(1057, 423),
    description: 'Pharmacy department canteen.',
    facilities: ['Cafeteria', 'Snack Bar', 'Outdoor Seating']
  },
  {
    id: 11,
    name: 'Gwalia Canteen',
    coordinates: pixelToPercentage(888, 433),
    description: 'Gwalia hostel canteen.',
    facilities: ['Mess Hall', 'Kitchen', 'Dining Area']
  },
  {
    id: 12,
    name: 'Law Block',
    coordinates: pixelToPercentage(640, 542),
    description: 'Law department building.',
    facilities: ['Lecture Halls', 'Moot Court', 'Library']
  },
  {
    id: 13,
    name: 'Management Block',
    coordinates: pixelToPercentage(948, 293),
    description: 'Management studies building.',
    facilities: ['MBA Classrooms', 'Conference Rooms', 'Case Study Rooms']
  },
  {
    id: 14,
    name: 'Pharma Block',
    coordinates: pixelToPercentage(1149, 295),
    description: 'Pharmacy department building.',
    facilities: ['Pharma Labs', 'Research Labs', 'Dispensary']
  },
  {
    id: 15,
    name: 'Institute of Science',
    coordinates: pixelToPercentage(1117, 530),
    description: 'Science institute building.',
    facilities: ['Science Labs', 'Research Center', 'Observatory']
  },
  {
    id: 16,
    name: 'Dome Ground',
    coordinates: pixelToPercentage(357, 130),
    description: 'Main sports ground with dome.',
    facilities: ['Sports Field', 'Track', 'Dome Structure']
  },
  {
    id: 17,
    name: 'H4 Hostel',
    coordinates: pixelToPercentage(489, 743),
    description: 'Hostel block H4.',
    facilities: ['Student Rooms', 'Common Areas', 'Study Rooms']
  },
  {
    id: 18,
    name: 'H3 Hostel',
    coordinates: pixelToPercentage(663, 710),
    description: 'Hostel block H3.',
    facilities: ['Student Rooms', 'Recreation Room', 'Mess Hall']
  },
  {
    id: 19,
    name: 'H2 Hostel',
    coordinates: pixelToPercentage(764, 562),
    description: 'Hostel block H2.',
    facilities: ['Student Rooms', 'Study Areas', 'Common Room']
  },
  {
    id: 20,
    name: 'H1 Hostel',
    coordinates: pixelToPercentage(812, 778),
    description: 'Hostel block H1.',
    facilities: ['Student Rooms', 'Dining Hall', 'Recreation']
  },
  {
    id: 21,
    name: 'Student Activity Center',
    coordinates: pixelToPercentage(799, 677),
    description: 'Central hub for student activities.',
    facilities: ['Event Halls', 'Club Rooms', 'Meeting Spaces']
  }
];

// Campus block names array for easy access
export const CAMPUS_BLOCK_NAMES = campusBlocks.map(block => block.name);

// Export campus blocks with alias
export const CAMPUS_BLOCKS = campusBlocks.reduce((acc, block) => {
  acc[block.name] = block;
  return acc;
}, {});

// Get block coordinates by name
export const getBlockCoordinates = (blockName) => {
  const block = campusBlocks.find(b => b.name === blockName);
  return block ? block.coordinates : null;
};

// Get category color
export const getCategoryColor = (category) => {
  const colors = {
    'Water': '#3B82F6',
    'Electricity': '#F59E0B', 
    'WiFi': '#8B5CF6',
    'Cleanliness': '#10B981',
    'Infrastructure': '#EF4444',
    'Safety': '#EF4444'
  };
  return colors[category] || '#6B7280';
};

// Convert percentage to pixel coordinates
export const percentageToPixel = (percentX, percentY) => {
  return {
    x: (percentX / 100) * mapDimensions.width,
    y: (percentY / 100) * mapDimensions.height
  };
};

// Calculate issue intensity for visualization
export const calculateIssueIntensity = (issueCount, maxIssues) => {
  if (maxIssues === 0) return 0;
  return Math.min((issueCount / maxIssues) * 100, 100);
};

// Get intensity color based on issue count (darker red scale)
export const getIntensityColor = (issueCount) => {
  if (issueCount === 0) return '#374151'; // Gray for no issues
  if (issueCount < 2) return '#DC2626'; // Dark red
  if (issueCount < 5) return '#B91C1C'; // Darker red
  if (issueCount < 8) return '#991B1B'; // Very dark red
  if (issueCount < 12) return '#7F1D1D'; // Extremely dark red
  return '#450A0A'; // Darkest red for 12+ issues
};

// Get intensity opacity based on issue count
export const getIntensityOpacity = (issueCount) => {
  if (issueCount === 0) return 0.3;
  return Math.max(0.6, Math.min(1, (issueCount / 10) + 0.4));
};