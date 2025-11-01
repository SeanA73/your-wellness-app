export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscle_groups: string[];
  equipment: string[];
  sets?: number;
  reps?: string;
  duration?: number; // in seconds for time-based exercises
  rest_time?: number; // in seconds
  instructions: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  video_url?: string;
  image_url?: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  focus: string[];
  exercises: Exercise[];
  estimated_duration: number; // in minutes
  calories_burned: number;
}

export interface WorkoutProgram {
  id: string;
  name: string;
  category: 'Weightlifting' | 'Bodybuilding' | 'General Fitness' | 'Cardio' | 'Strength' | 'Powerlifting';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration_weeks: number;
  days_per_week: number;
  description: string;
  goals: string[];
  equipment_needed: string[];
  workout_days: WorkoutDay[];
  created_by: string;
  rating: number;
  participants: number;
  is_template: boolean;
}

export const exerciseDatabase: Exercise[] = [
  // Upper Body Exercises
  {
    id: 'bench_press',
    name: 'Bench Press',
    description: 'Classic chest exercise using barbell or dumbbells',
    muscle_groups: ['Chest', 'Triceps', 'Shoulders'],
    equipment: ['Barbell', 'Bench'],
    sets: 4,
    reps: '8-10',
    rest_time: 120,
    instructions: [
      'Lie flat on bench with feet planted on floor',
      'Grip barbell slightly wider than shoulder width',
      'Lower bar to chest with control',
      'Press bar up explosively, fully extending arms'
    ],
    difficulty: 'Intermediate'
  },
  {
    id: 'push_ups',
    name: 'Push-ups',
    description: 'Bodyweight exercise for chest, shoulders, and triceps',
    muscle_groups: ['Chest', 'Triceps', 'Shoulders', 'Core'],
    equipment: ['None'],
    sets: 3,
    reps: '10-15',
    rest_time: 60,
    instructions: [
      'Start in plank position with hands under shoulders',
      'Lower body until chest nearly touches floor',
      'Push back up to starting position',
      'Keep core tight throughout movement'
    ],
    difficulty: 'Beginner'
  },
  {
    id: 'pull_ups',
    name: 'Pull-ups',
    description: 'Compound exercise for back and biceps',
    muscle_groups: ['Back', 'Biceps', 'Forearms'],
    equipment: ['Pull-up Bar'],
    sets: 3,
    reps: '5-8',
    rest_time: 90,
    instructions: [
      'Hang from bar with palms facing away',
      'Pull body up until chin clears bar',
      'Lower with control to full extension',
      'Engage core throughout movement'
    ],
    difficulty: 'Advanced'
  },
  // Lower Body Exercises
  {
    id: 'squats',
    name: 'Squats',
    description: 'Fundamental lower body compound movement',
    muscle_groups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    equipment: ['Barbell', 'Squat Rack'],
    sets: 4,
    reps: '8-12',
    rest_time: 120,
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower by bending at hips and knees',
      'Descend until thighs parallel to floor',
      'Drive through heels to return to start'
    ],
    difficulty: 'Intermediate'
  },
  {
    id: 'deadlifts',
    name: 'Deadlifts',
    description: 'King of all exercises - full body compound movement',
    muscle_groups: ['Hamstrings', 'Glutes', 'Back', 'Traps', 'Core'],
    equipment: ['Barbell'],
    sets: 3,
    reps: '5-6',
    rest_time: 180,
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Bend at hips and knees to grip bar',
      'Keep chest up and back straight',
      'Drive through heels to lift bar, extending hips and knees'
    ],
    difficulty: 'Advanced'
  },
  {
    id: 'lunges',
    name: 'Lunges',
    description: 'Unilateral leg exercise for strength and stability',
    muscle_groups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    equipment: ['Dumbbells'],
    sets: 3,
    reps: '10-12 each leg',
    rest_time: 90,
    instructions: [
      'Step forward into lunge position',
      'Lower back knee toward ground',
      'Keep front knee over ankle',
      'Push through front heel to return to start'
    ],
    difficulty: 'Beginner'
  },
  // Cardio Exercises
  {
    id: 'burpees',
    name: 'Burpees',
    description: 'Full body high-intensity exercise',
    muscle_groups: ['Full Body'],
    equipment: ['None'],
    sets: 3,
    reps: '8-12',
    rest_time: 90,
    instructions: [
      'Start standing, squat down and place hands on floor',
      'Jump feet back into plank position',
      'Perform push-up (optional)',
      'Jump feet forward and explode up with jump'
    ],
    difficulty: 'Intermediate'
  },
  {
    id: 'mountain_climbers',
    name: 'Mountain Climbers',
    description: 'High-intensity cardio and core exercise',
    muscle_groups: ['Core', 'Shoulders', 'Legs'],
    equipment: ['None'],
    duration: 30,
    rest_time: 30,
    instructions: [
      'Start in plank position',
      'Alternate bringing knees to chest rapidly',
      'Keep hips level and core engaged',
      'Maintain steady breathing rhythm'
    ],
    difficulty: 'Beginner'
  },
  // Core Exercises
  {
    id: 'plank',
    name: 'Plank',
    description: 'Isometric core strengthening exercise',
    muscle_groups: ['Core', 'Shoulders'],
    equipment: ['None'],
    duration: 45,
    rest_time: 60,
    instructions: [
      'Start in push-up position on forearms',
      'Keep body in straight line from head to heels',
      'Engage core and glutes',
      'Breathe normally throughout hold'
    ],
    difficulty: 'Beginner'
  }
];

export const preBuiltPrograms: WorkoutProgram[] = [
  {
    id: 'beginner_strength',
    name: 'Beginner Strength Foundation',
    category: 'Strength',
    difficulty: 'Beginner',
    duration_weeks: 8,
    days_per_week: 3,
    description: 'Perfect introduction to strength training with fundamental movements',
    goals: ['Build base strength', 'Learn proper form', 'Establish routine'],
    equipment_needed: ['Barbell', 'Dumbbells', 'Bench'],
    created_by: 'FitMatePro',
    rating: 4.8,
    participants: 2847,
    is_template: true,
    workout_days: [
      {
        id: 'day1_upper',
        name: 'Upper Body Focus',
        focus: ['Chest', 'Back', 'Arms'],
        estimated_duration: 45,
        calories_burned: 280,
        exercises: [
          exerciseDatabase[0], // Bench Press
          exerciseDatabase[2], // Pull-ups
          exerciseDatabase[1], // Push-ups
        ]
      },
      {
        id: 'day2_lower',
        name: 'Lower Body Focus',
        focus: ['Legs', 'Glutes'],
        estimated_duration: 50,
        calories_burned: 320,
        exercises: [
          exerciseDatabase[3], // Squats
          exerciseDatabase[5], // Lunges
          exerciseDatabase[8], // Plank
        ]
      },
      {
        id: 'day3_full',
        name: 'Full Body',
        focus: ['Full Body'],
        estimated_duration: 55,
        calories_burned: 350,
        exercises: [
          exerciseDatabase[4], // Deadlifts
          exerciseDatabase[1], // Push-ups
          exerciseDatabase[6], // Burpees
        ]
      }
    ]
  },
  {
    id: 'bodybuilding_split',
    name: 'Classic Bodybuilding Split',
    category: 'Bodybuilding',
    difficulty: 'Intermediate',
    duration_weeks: 12,
    days_per_week: 5,
    description: 'Traditional bodybuilding approach focusing on muscle hypertrophy',
    goals: ['Muscle growth', 'Improved definition', 'Strength gains'],
    equipment_needed: ['Full Gym Access', 'Dumbbells', 'Cables', 'Machines'],
    created_by: 'Mike Mentzer Jr.',
    rating: 4.9,
    participants: 1956,
    is_template: true,
    workout_days: [
      {
        id: 'chest_day',
        name: 'Chest & Triceps',
        focus: ['Chest', 'Triceps'],
        estimated_duration: 75,
        calories_burned: 420,
        exercises: [
          exerciseDatabase[0], // Bench Press
          exerciseDatabase[1], // Push-ups
        ]
      },
      {
        id: 'back_day',
        name: 'Back & Biceps',
        focus: ['Back', 'Biceps'],
        estimated_duration: 80,
        calories_burned: 380,
        exercises: [
          exerciseDatabase[2], // Pull-ups
          exerciseDatabase[4], // Deadlifts
        ]
      },
      {
        id: 'leg_day',
        name: 'Legs & Glutes',
        focus: ['Legs', 'Glutes'],
        estimated_duration: 90,
        calories_burned: 480,
        exercises: [
          exerciseDatabase[3], // Squats
          exerciseDatabase[5], // Lunges
          exerciseDatabase[4], // Deadlifts
        ]
      }
    ]
  },
  {
    id: 'hiit_cardio',
    name: 'HIIT Cardio Blast',
    category: 'Cardio',
    difficulty: 'Intermediate',
    duration_weeks: 6,
    days_per_week: 4,
    description: 'High-intensity interval training for fat loss and conditioning',
    goals: ['Fat loss', 'Cardiovascular health', 'Endurance'],
    equipment_needed: ['None', 'Bodyweight Only'],
    created_by: 'Sarah Cardio',
    rating: 4.7,
    participants: 3421,
    is_template: true,
    workout_days: [
      {
        id: 'hiit_1',
        name: 'Full Body HIIT',
        focus: ['Full Body', 'Cardio'],
        estimated_duration: 25,
        calories_burned: 350,
        exercises: [
          exerciseDatabase[6], // Burpees
          exerciseDatabase[7], // Mountain Climbers
          exerciseDatabase[1], // Push-ups
        ]
      },
      {
        id: 'hiit_2',
        name: 'Lower Body Power',
        focus: ['Legs', 'Cardio'],
        estimated_duration: 30,
        calories_burned: 380,
        exercises: [
          exerciseDatabase[3], // Squats
          exerciseDatabase[5], // Lunges
          exerciseDatabase[7], // Mountain Climbers
        ]
      }
    ]
  },
  {
    id: 'powerlifting_foundation',
    name: 'Powerlifting Foundation',
    category: 'Powerlifting',
    difficulty: 'Advanced',
    duration_weeks: 16,
    days_per_week: 4,
    description: 'Focus on the big three: squat, bench, deadlift for maximum strength',
    goals: ['Max strength', 'Powerlifting technique', 'Competition prep'],
    equipment_needed: ['Barbell', 'Squat Rack', 'Bench', 'Platform'],
    created_by: 'Ed Coan Jr.',
    rating: 4.9,
    participants: 892,
    is_template: true,
    workout_days: [
      {
        id: 'squat_day',
        name: 'Squat Focus',
        focus: ['Legs', 'Core'],
        estimated_duration: 90,
        calories_burned: 380,
        exercises: [
          exerciseDatabase[3], // Squats
          exerciseDatabase[5], // Lunges
        ]
      },
      {
        id: 'bench_day',
        name: 'Bench Focus',
        focus: ['Chest', 'Triceps'],
        estimated_duration: 75,
        calories_burned: 320,
        exercises: [
          exerciseDatabase[0], // Bench Press
          exerciseDatabase[1], // Push-ups
        ]
      },
      {
        id: 'deadlift_day',
        name: 'Deadlift Focus',
        focus: ['Back', 'Hamstrings'],
        estimated_duration: 85,
        calories_burned: 400,
        exercises: [
          exerciseDatabase[4], // Deadlifts
          exerciseDatabase[2], // Pull-ups
        ]
      }
    ]
  },
  {
    id: 'general_fitness',
    name: 'General Fitness & Wellness',
    category: 'General Fitness',
    difficulty: 'Beginner',
    duration_weeks: 10,
    days_per_week: 4,
    description: 'Well-rounded program for overall health and fitness',
    goals: ['General health', 'Weight management', 'Energy boost'],
    equipment_needed: ['Dumbbells', 'Resistance Bands', 'Mat'],
    created_by: 'Wellness Team',
    rating: 4.6,
    participants: 4235,
    is_template: true,
    workout_days: [
      {
        id: 'cardio_strength',
        name: 'Cardio & Strength',
        focus: ['Cardio', 'Full Body'],
        estimated_duration: 40,
        calories_burned: 320,
        exercises: [
          exerciseDatabase[6], // Burpees
          exerciseDatabase[1], // Push-ups
          exerciseDatabase[3], // Squats
        ]
      },
      {
        id: 'flexibility_core',
        name: 'Flexibility & Core',
        focus: ['Core', 'Flexibility'],
        estimated_duration: 35,
        calories_burned: 180,
        exercises: [
          exerciseDatabase[8], // Plank
          exerciseDatabase[7], // Mountain Climbers
        ]
      }
    ]
  }
];