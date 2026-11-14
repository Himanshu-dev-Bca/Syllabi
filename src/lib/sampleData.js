/**
 * lib/sampleData.js
 * Realistic starter academic data for demonstration or testing.
 */

export function getSampleData() {
  return {
    user: {
      name: 'Alex Morgan',
      degree: 'B.Tech Computer Science & Engineering',
      semester: 'Semester 5',
    },
    courses: [
      {
        id: 'c-101',
        code: 'CS501',
        name: 'Database Management Systems',
        credits: 4,
        category: 'Core',
        color: 'border-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400',
        accent: 'bg-blue-600',
        units: [
          {
            id: 'u-101-1',
            name: 'Unit 1: Introduction & Data Models',
            topics: [
              { id: 't-1', name: 'ER Diagrams & Relational Model', status: 'Completed', plannedDate: '2026-10-10' },
              { id: 't-2', name: 'Relational Algebra & Calculus', status: 'Completed', plannedDate: '2026-10-15' },
            ],
          },
          {
            id: 'u-101-2',
            name: 'Unit 2: SQL & Normalization',
            topics: [
              { id: 't-3', name: 'Complex SQL Queries & Joins', status: 'Completed', plannedDate: '2026-10-22' },
              { id: 't-4', name: '1NF, 2NF, 3NF & BCNF Normalization', status: 'In Progress', plannedDate: '2026-11-12' },
              { id: 't-5', name: 'Lossless Join Decomposition', status: 'Not Started', plannedDate: '2026-11-18' },
            ],
          },
          {
            id: 'u-101-3',
            name: 'Unit 3: Transaction Management',
            topics: [
              { id: 't-6', name: 'ACID Properties & Concurrency Control', status: 'Not Started', plannedDate: '2026-11-25' },
              { id: 't-7', name: 'Deadlock Handling & Recovery', status: 'Not Started', plannedDate: '2026-12-02' },
            ],
          },
        ],
        assessments: [
          { id: 'a-1', name: 'Internal Assessment 1', maxMarks: 30, obtainedMarks: 26 },
          { id: 'a-2', name: 'Mid-Term Exam', maxMarks: 50, obtainedMarks: 41 },
        ],
      },
      {
        id: 'c-102',
        code: 'CS502',
        name: 'Operating Systems & Architecture',
        credits: 4,
        category: 'Core',
        color: 'border-violet-500 text-violet-700 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-400',
        accent: 'bg-violet-600',
        units: [
          {
            id: 'u-102-1',
            name: 'Unit 1: Process Synchronization',
            topics: [
              { id: 't-8', name: 'Semaphores & Mutex Locks', status: 'Completed', plannedDate: '2026-10-12' },
              { id: 't-9', name: 'Classical Synchronization Problems', status: 'Completed', plannedDate: '2026-10-18' },
            ],
          },
          {
            id: 'u-102-2',
            name: 'Unit 2: Memory Management',
            topics: [
              { id: 't-10', name: 'Paging & Segmentation', status: 'In Progress', plannedDate: '2026-11-05' },
              { id: 't-11', name: 'Virtual Memory & Page Replacement', status: 'Not Started', plannedDate: '2026-11-20' },
            ],
          },
        ],
        assessments: [
          { id: 'a-3', name: 'Internal Assessment 1', maxMarks: 30, obtainedMarks: 22 },
          { id: 'a-4', name: 'Mid-Term Exam', maxMarks: 50, obtainedMarks: 35 },
        ],
      },
      {
        id: 'c-103',
        code: 'CS503',
        name: 'Design & Analysis of Algorithms',
        credits: 4,
        category: 'Core',
        color: 'border-amber-500 text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400',
        accent: 'bg-amber-500',
        units: [
          {
            id: 'u-103-1',
            name: 'Unit 1: Dynamic Programming',
            topics: [
              { id: 't-12', name: '0/1 Knapsack Problem', status: 'Completed', plannedDate: '2026-10-14' },
              { id: 't-13', name: 'Longest Common Subsequence', status: 'Completed', plannedDate: '2026-10-20' },
            ],
          },
          {
            id: 'u-103-2',
            name: 'Unit 2: Graph Algorithms',
            topics: [
              { id: 't-14', name: 'Dijkstra & Bellman-Ford Shortest Paths', status: 'In Progress', plannedDate: '2026-11-10' },
              { id: 't-15', name: 'Minimum Spanning Trees', status: 'Not Started', plannedDate: '2026-11-24' },
            ],
          },
        ],
        assessments: [
          { id: 'a-5', name: 'Internal Assessment 1', maxMarks: 30, obtainedMarks: 27 },
          { id: 'a-6', name: 'Mid-Term Exam', maxMarks: 50, obtainedMarks: 44 },
        ],
      },
      {
        id: 'c-104',
        code: 'CS504',
        name: 'Computer Networks',
        credits: 3,
        category: 'Core',
        color: 'border-teal-500 text-teal-700 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-400',
        accent: 'bg-teal-600',
        units: [
          {
            id: 'u-104-1',
            name: 'Unit 1: Transport & Network Layer Protocols',
            topics: [
              { id: 't-16', name: 'TCP Handshake & Flow Control', status: 'Completed', plannedDate: '2026-10-25' },
              { id: 't-17', name: 'IPv4 & IPv6 Subnetting', status: 'In Progress', plannedDate: '2026-11-14' },
            ],
          },
        ],
        assessments: [
          { id: 'a-7', name: 'Internal Assessment 1', maxMarks: 30, obtainedMarks: 24 },
        ],
      },
    ],
    goals: [
      {
        id: 'g-1',
        title: 'Review Normalization (3NF & BCNF) problems',
        category: 'Daily',
        deadline: '2026-11-15',
        completed: false,
        courseId: 'c-101',
        createdAt: '2026-11-10T10:00:00.000Z',
      },
      {
        id: 'g-2',
        title: 'Implement Dijkstra algorithm in C++',
        category: 'Weekly',
        deadline: '2026-11-18',
        completed: false,
        courseId: 'c-103',
        createdAt: '2026-11-10T10:00:00.000Z',
      },
      {
        id: 'g-3',
        title: 'Solve 10 subnetting numerical questions',
        category: 'Weekly',
        deadline: '2026-11-20',
        completed: true,
        completedAt: '2026-11-13T14:30:00.000Z',
        courseId: 'c-104',
        createdAt: '2026-11-08T10:00:00.000Z',
      },
      {
        id: 'g-4',
        title: 'Revise virtual memory and page replacement algorithms',
        category: 'Monthly',
        deadline: '2026-11-30',
        completed: false,
        courseId: 'c-102',
        createdAt: '2026-11-05T10:00:00.000Z',
      },
    ],
  };
}

