export const SURVEY = {
  plumber: {
    label: 'Plumber',
    icon: '🔧',
    color: 'from-blue-600 to-blue-800',
    questions: [
      {
        id: 'issue',
        question: "What's the plumbing issue?",
        hint: 'Select the option that best describes your problem',
        type: 'cards',
        options: [
          { value: 'leak', label: 'Leaking pipe or tap', icon: '💧' },
          { value: 'blocked', label: 'Blocked drain or toilet', icon: '🚽' },
          { value: 'no_hot_water', label: 'No hot water', icon: '🌡️' },
          { value: 'burst', label: 'Burst pipe', icon: '🚨' },
          { value: 'installation', label: 'New installation', icon: '🔩' },
          { value: 'other', label: 'Something else', icon: '❓' },
        ],
      },
      {
        id: 'location',
        question: 'Where is the problem located?',
        hint: 'Pick the area in your property',
        type: 'cards',
        options: [
          { value: 'kitchen', label: 'Kitchen', icon: '🍳' },
          { value: 'bathroom', label: 'Bathroom', icon: '🛁' },
          { value: 'toilet', label: 'Toilet', icon: '🚽' },
          { value: 'outside', label: 'Outside / Garden', icon: '🌿' },
          { value: 'basement', label: 'Basement', icon: '🏚️' },
          { value: 'multiple', label: 'Multiple areas', icon: '📍' },
        ],
      },
      {
        id: 'urgency',
        question: 'How urgent is this?',
        hint: 'This helps us prioritise your booking',
        type: 'cards',
        options: [
          { value: 'emergency', label: 'Emergency — water is flooding!', icon: '🚨', urgency: 'emergency' },
          { value: 'today', label: 'Urgent — needs fixing today', icon: '⚡', urgency: 'urgent' },
          { value: 'this_week', label: 'This week is fine', icon: '📅' },
          { value: 'flexible', label: 'I\'m flexible', icon: '😊' },
        ],
      },
      {
        id: 'property_type',
        question: 'What type of property?',
        type: 'cards',
        options: [
          { value: 'apartment', label: 'Apartment', icon: '🏢' },
          { value: 'house', label: 'House', icon: '🏠' },
          { value: 'office', label: 'Office', icon: '💼' },
          { value: 'other', label: 'Other', icon: '🏗️' },
        ],
      },
      {
        id: 'details',
        question: 'Anything else we should know?',
        hint: 'Optional — describe the issue in your own words',
        type: 'textarea',
        optional: true,
      },
    ],
  },

  electrician: {
    label: 'Electrician',
    icon: '⚡',
    color: 'from-yellow-500 to-orange-600',
    questions: [
      {
        id: 'issue',
        question: 'What electrical work do you need?',
        type: 'cards',
        options: [
          { value: 'no_power', label: 'Power not working', icon: '🔌' },
          { value: 'new_install', label: 'New installation', icon: '🔧' },
          { value: 'lighting', label: 'Lighting work', icon: '💡' },
          { value: 'inspection', label: 'Safety inspection', icon: '🔍' },
          { value: 'appliance', label: 'Appliance connection', icon: '🖥️' },
          { value: 'other', label: 'Something else', icon: '❓' },
        ],
      },
      {
        id: 'points',
        question: 'How many outlets / fixtures are involved?',
        type: 'cards',
        options: [
          { value: '1_2', label: '1 – 2', icon: '1️⃣' },
          { value: '3_5', label: '3 – 5', icon: '3️⃣' },
          { value: '6_10', label: '6 – 10', icon: '🔟' },
          { value: '10_plus', label: 'More than 10', icon: '➕' },
        ],
      },
      {
        id: 'existing_issue',
        question: 'Are you experiencing any of these?',
        type: 'cards',
        options: [
          { value: 'tripping', label: 'Breakers keep tripping', icon: '⚠️' },
          { value: 'flickering', label: 'Flickering lights', icon: '💡' },
          { value: 'sparks', label: 'Sparks or burning smell', icon: '🔥' },
          { value: 'none', label: 'None — new install only', icon: '✅' },
        ],
      },
      {
        id: 'property_type',
        question: 'Type of property?',
        type: 'cards',
        options: [
          { value: 'apartment', label: 'Apartment', icon: '🏢' },
          { value: 'house', label: 'House', icon: '🏠' },
          { value: 'office', label: 'Office', icon: '💼' },
          { value: 'commercial', label: 'Commercial space', icon: '🏪' },
        ],
      },
      {
        id: 'details',
        question: 'Any additional details?',
        type: 'textarea',
        optional: true,
      },
    ],
  },

  painter: {
    label: 'Painter',
    icon: '🖌️',
    color: 'from-pink-500 to-purple-600',
    questions: [
      {
        id: 'what',
        question: 'What needs to be painted?',
        type: 'cards',
        options: [
          { value: 'walls', label: 'Interior walls', icon: '🏠' },
          { value: 'ceiling', label: 'Ceiling', icon: '⬆️' },
          { value: 'exterior', label: 'Exterior / facade', icon: '🏡' },
          { value: 'doors', label: 'Doors & window frames', icon: '🚪' },
          { value: 'fence', label: 'Fence or gate', icon: '🔑' },
          { value: 'full', label: 'Full apartment / house', icon: '🏘️' },
        ],
      },
      {
        id: 'rooms',
        question: 'How many rooms?',
        type: 'cards',
        options: [
          { value: '1', label: '1 room', icon: '1️⃣' },
          { value: '2_3', label: '2 – 3 rooms', icon: '3️⃣' },
          { value: '4_5', label: '4 – 5 rooms', icon: '5️⃣' },
          { value: '5_plus', label: 'More than 5', icon: '➕' },
        ],
      },
      {
        id: 'size',
        question: 'Approximate room / area size?',
        type: 'cards',
        options: [
          { value: 'small', label: 'Small — under 15m²', icon: '📦' },
          { value: 'medium', label: 'Medium — 15 to 30m²', icon: '🏠' },
          { value: 'large', label: 'Large — 30 to 60m²', icon: '🏡' },
          { value: 'xlarge', label: 'Very large — 60m²+', icon: '🏰' },
        ],
      },
      {
        id: 'surface',
        question: 'What condition are the surfaces in?',
        type: 'cards',
        options: [
          { value: 'good', label: 'Good — just needs a fresh coat', icon: '✅' },
          { value: 'fair', label: 'Fair — minor repairs needed', icon: '🔨' },
          { value: 'poor', label: 'Poor — significant prep needed', icon: '⚠️' },
          { value: 'new', label: 'New walls — never painted', icon: '🆕' },
        ],
      },
      {
        id: 'color',
        question: 'Do you have a colour in mind?',
        type: 'cards',
        options: [
          { value: 'yes', label: 'Yes — I know exactly what I want', icon: '🎨' },
          { value: 'deciding', label: 'Still deciding between options', icon: '🤔' },
          { value: 'advice', label: 'No — I\'d love advice', icon: '💬' },
          { value: 'white', label: 'Keep it simple — white / neutral', icon: '⬜' },
        ],
      },
      {
        id: 'material',
        question: 'Any paint preference?',
        type: 'cards',
        options: [
          { value: 'standard', label: 'Standard paint', icon: '🪣' },
          { value: 'premium', label: 'Premium / washable', icon: '⭐' },
          { value: 'eco', label: 'Eco-friendly / low VOC', icon: '🌿' },
          { value: 'no_pref', label: 'No preference', icon: '👍' },
        ],
      },
    ],
  },

  handyman: {
    label: 'Handyman',
    icon: '🛠️',
    color: 'from-gray-600 to-gray-800',
    questions: [
      {
        id: 'task',
        question: 'What type of job is it?',
        type: 'cards',
        options: [
          { value: 'assembly', label: 'Furniture assembly', icon: '🪑' },
          { value: 'mounting', label: 'Mounting / hanging', icon: '🖼️' },
          { value: 'repair', label: 'Repair work', icon: '🔨' },
          { value: 'installation', label: 'Installation', icon: '🔩' },
          { value: 'moving', label: 'Help with moving items', icon: '📦' },
          { value: 'other', label: 'Something else', icon: '❓' },
        ],
      },
      {
        id: 'quantity',
        question: 'How many items or tasks?',
        type: 'cards',
        options: [
          { value: 'one', label: 'Just one', icon: '1️⃣' },
          { value: '2_5', label: '2 to 5', icon: '5️⃣' },
          { value: '5_plus', label: 'More than 5', icon: '➕' },
        ],
      },
      {
        id: 'materials',
        question: 'Do you have the materials ready?',
        type: 'cards',
        options: [
          { value: 'yes', label: 'Yes — everything is ready', icon: '✅' },
          { value: 'partial', label: 'Partially — need some things', icon: '🛒' },
          { value: 'no', label: 'No — provider should bring', icon: '🚚' },
        ],
      },
      {
        id: 'details',
        question: 'Describe what needs doing',
        type: 'textarea',
        optional: false,
      },
    ],
  },

  carpenter: {
    label: 'Carpenter',
    icon: '🪵',
    color: 'from-amber-600 to-amber-800',
    questions: [
      {
        id: 'work_type',
        question: 'What kind of carpentry work?',
        type: 'cards',
        options: [
          { value: 'assembly', label: 'Furniture assembly', icon: '🪑' },
          { value: 'custom', label: 'Custom-built furniture', icon: '🛋️' },
          { value: 'shelving', label: 'Shelves & storage', icon: '📚' },
          { value: 'doors', label: 'Doors & windows', icon: '🚪' },
          { value: 'flooring', label: 'Flooring / decking', icon: '🏠' },
          { value: 'repair', label: 'Repair existing furniture', icon: '🔧' },
        ],
      },
      {
        id: 'material',
        question: 'Preferred material?',
        type: 'cards',
        options: [
          { value: 'solid_wood', label: 'Solid wood', icon: '🌳' },
          { value: 'mdf', label: 'MDF / engineered wood', icon: '📋' },
          { value: 'mixed', label: 'Mixed materials', icon: '🔀' },
          { value: 'dont_know', label: 'Advise me', icon: '💬' },
        ],
      },
      {
        id: 'project_size',
        question: 'How big is the project?',
        type: 'cards',
        options: [
          { value: 'small', label: 'Small — a few hours', icon: '⏱️' },
          { value: 'medium', label: 'Medium — about a day', icon: '📅' },
          { value: 'large', label: 'Large — multiple days', icon: '🗓️' },
        ],
      },
      {
        id: 'details',
        question: 'Describe your vision',
        hint: 'The more detail you give, the better the quote',
        type: 'textarea',
        optional: false,
      },
    ],
  },

  hvac: {
    label: 'HVAC Technician',
    icon: '❄️',
    color: 'from-cyan-500 to-blue-600',
    questions: [
      {
        id: 'issue',
        question: 'What\'s the problem?',
        type: 'cards',
        options: [
          { value: 'not_cooling', label: 'Not cooling properly', icon: '🌡️' },
          { value: 'not_heating', label: 'Not heating properly', icon: '🔥' },
          { value: 'noise', label: 'Strange noise or smell', icon: '👂' },
          { value: 'maintenance', label: 'Routine maintenance', icon: '🔧' },
          { value: 'new_install', label: 'New unit installation', icon: '🆕' },
        ],
      },
      {
        id: 'system',
        question: 'What type of system?',
        type: 'cards',
        options: [
          { value: 'split', label: 'Split AC unit', icon: '❄️' },
          { value: 'central', label: 'Central / ducted system', icon: '🏠' },
          { value: 'portable', label: 'Portable unit', icon: '📦' },
          { value: 'dont_know', label: 'I\'m not sure', icon: '🤔' },
        ],
      },
      {
        id: 'area_size',
        question: 'What area needs to be covered?',
        type: 'cards',
        options: [
          { value: 'small', label: 'Small — under 30m²', icon: '📦' },
          { value: 'medium', label: 'Medium — 30 to 80m²', icon: '🏠' },
          { value: 'large', label: 'Large — 80 to 150m²', icon: '🏡' },
          { value: 'xlarge', label: 'Very large — 150m²+', icon: '🏰' },
        ],
      },
      {
        id: 'details',
        question: 'Any additional details?',
        type: 'textarea',
        optional: true,
      },
    ],
  },

  locksmith: {
    label: 'Locksmith',
    icon: '🔑',
    color: 'from-slate-600 to-slate-800',
    questions: [
      {
        id: 'service',
        question: 'What do you need?',
        type: 'cards',
        options: [
          { value: 'lockout', label: 'I\'m locked out', icon: '🚪' },
          { value: 'replace', label: 'Lock replacement', icon: '🔒' },
          { value: 'new_lock', label: 'New lock installation', icon: '🆕' },
          { value: 'key_copy', label: 'Key duplication', icon: '🗝️' },
          { value: 'safe', label: 'Safe or vault', icon: '🏦' },
          { value: 'security', label: 'Full security upgrade', icon: '🛡️' },
        ],
      },
      {
        id: 'property',
        question: 'What is it for?',
        type: 'cards',
        options: [
          { value: 'home', label: 'Home / apartment', icon: '🏠' },
          { value: 'car', label: 'Car', icon: '🚗' },
          { value: 'office', label: 'Office', icon: '💼' },
          { value: 'storage', label: 'Storage unit', icon: '📦' },
        ],
      },
      {
        id: 'urgency',
        question: 'How urgent is it?',
        type: 'cards',
        options: [
          { value: 'now', label: 'Emergency — right now!', icon: '🚨', urgency: 'emergency' },
          { value: 'today', label: 'Today please', icon: '⚡', urgency: 'urgent' },
          { value: 'flexible', label: 'I\'m flexible', icon: '😊' },
        ],
      },
    ],
  },

  cleaner: {
    label: 'Cleaner',
    icon: '🧹',
    color: 'from-green-500 to-teal-600',
    questions: [
      {
        id: 'type',
        question: 'What type of cleaning?',
        type: 'cards',
        options: [
          { value: 'regular', label: 'Regular / maintenance clean', icon: '🧹' },
          { value: 'deep', label: 'Deep clean', icon: '✨' },
          { value: 'move', label: 'Move in / move out', icon: '📦' },
          { value: 'post_construction', label: 'Post-construction', icon: '🏗️' },
          { value: 'office', label: 'Office cleaning', icon: '💼' },
          { value: 'windows', label: 'Window cleaning', icon: '🪟' },
        ],
      },
      {
        id: 'size',
        question: 'How big is the property?',
        type: 'cards',
        options: [
          { value: 'studio', label: 'Studio / 1 bedroom', icon: '🛏️' },
          { value: '2_3br', label: '2 – 3 bedrooms', icon: '🏠' },
          { value: '4br_plus', label: '4+ bedrooms', icon: '🏡' },
          { value: 'office_small', label: 'Small office', icon: '🏢' },
          { value: 'office_large', label: 'Large office', icon: '🏗️' },
        ],
      },
      {
        id: 'frequency',
        question: 'How often do you need this?',
        type: 'cards',
        options: [
          { value: 'once', label: 'One time only', icon: '1️⃣' },
          { value: 'weekly', label: 'Every week', icon: '📅' },
          { value: 'biweekly', label: 'Every two weeks', icon: '🗓️' },
          { value: 'monthly', label: 'Monthly', icon: '📆' },
        ],
      },
      {
        id: 'special',
        question: 'Any special requirements?',
        type: 'cards',
        multi: true,
        options: [
          { value: 'eco', label: 'Eco-friendly products', icon: '🌿' },
          { value: 'pets', label: 'Pets at home', icon: '🐾' },
          { value: 'heavy_stains', label: 'Heavy stains', icon: '🧴' },
          { value: 'none', label: 'None — standard clean', icon: '✅' },
        ],
      },
    ],
  },

  gardener: {
    label: 'Gardener',
    icon: '🌱',
    color: 'from-green-600 to-lime-600',
    questions: [
      {
        id: 'services',
        question: 'What services do you need?',
        type: 'cards',
        options: [
          { value: 'mowing', label: 'Lawn mowing', icon: '🌿' },
          { value: 'pruning', label: 'Pruning & trimming', icon: '✂️' },
          { value: 'planting', label: 'Planting & landscaping', icon: '🌸' },
          { value: 'irrigation', label: 'Irrigation system', icon: '💧' },
          { value: 'design', label: 'Garden design', icon: '🎨' },
          { value: 'general', label: 'General maintenance', icon: '🔧' },
        ],
      },
      {
        id: 'size',
        question: 'How big is the garden?',
        type: 'cards',
        options: [
          { value: 'small', label: 'Small — under 50m²', icon: '📦' },
          { value: 'medium', label: 'Medium — 50 to 150m²', icon: '🌿' },
          { value: 'large', label: 'Large — 150m²+', icon: '🏡' },
        ],
      },
      {
        id: 'condition',
        question: 'Current condition of the garden?',
        type: 'cards',
        options: [
          { value: 'good', label: 'Well maintained', icon: '✅' },
          { value: 'fair', label: 'Needs some work', icon: '🔨' },
          { value: 'overgrown', label: 'Overgrown / neglected', icon: '🌾' },
          { value: 'new', label: 'Starting from scratch', icon: '🆕' },
        ],
      },
    ],
  },

  'pest-control': {
    label: 'Pest Control',
    icon: '🐛',
    color: 'from-red-600 to-red-800',
    questions: [
      {
        id: 'pest_type',
        question: 'What type of pest?',
        type: 'cards',
        options: [
          { value: 'cockroaches', label: 'Cockroaches', icon: '🪳' },
          { value: 'ants', label: 'Ants', icon: '🐜' },
          { value: 'mice_rats', label: 'Mice or rats', icon: '🐀' },
          { value: 'bed_bugs', label: 'Bed bugs', icon: '🛏️' },
          { value: 'wasps_bees', label: 'Wasps or bees', icon: '🐝' },
          { value: 'inspection', label: 'General inspection', icon: '🔍' },
        ],
      },
      {
        id: 'severity',
        question: 'How bad is the problem?',
        type: 'cards',
        options: [
          { value: 'few', label: 'Spotted a few — preventive', icon: '👀' },
          { value: 'moderate', label: 'Moderate — seen them often', icon: '⚠️' },
          { value: 'severe', label: 'Severe — serious infestation', icon: '🚨' },
        ],
      },
      {
        id: 'property_type',
        question: 'Type of property?',
        type: 'cards',
        options: [
          { value: 'apartment', label: 'Apartment', icon: '🏢' },
          { value: 'house', label: 'House', icon: '🏠' },
          { value: 'garden', label: 'Garden / outdoor', icon: '🌿' },
          { value: 'office', label: 'Office / commercial', icon: '💼' },
        ],
      },
      {
        id: 'details',
        question: 'Any other details to share?',
        type: 'textarea',
        optional: true,
      },
    ],
  },
};

export const TRADES_LIST = Object.entries(SURVEY).map(([slug, data]) => ({
  slug,
  name: data.label,
  icon: data.icon,
  color: data.color,
}));
