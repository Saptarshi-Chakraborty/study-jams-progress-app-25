// Mock data for demonstration
export const MOCK_USERS = [
    { id: 1, name: 'Alice Johnson', email: 'alice.j@example.com' },
    { id: 2, name: 'Bob Williams', email: 'bob.w@example.com' },
    { id: 3, name: 'Charlie Brown', email: 'charlie.b@example.com' },
    { id: 4, name: 'Diana Prince', email: 'diana.p@example.com' },
    { id: 5, name: 'Ethan Hunt', email: 'ethan.h@example.com' },
    { id: 6, name: 'Fiona Glenanne', email: 'fiona.g@example.com' },
    { id: 7, name: 'George Costanza', email: 'george.c@example.com' },
    { id: 8, name: 'Hannah Montana', email: 'hannah.m@example.com' },
];

export const MOCK_REPORTS = {
    1: { progress: '80%', completed: 4, pending: 1, details: 'Completed modules 1-4. Module 5 is in progress.' },
    2: { progress: '100%', completed: 5, pending: 0, details: 'All modules completed successfully.' },
    3: { progress: '40%', completed: 2, pending: 3, details: 'Completed modules 1-2. Needs to start module 3.' },
    4: { progress: '60%', completed: 3, pending: 2, details: 'Completed modules 1-3. Facing issues with module 4.' },
    5: { progress: '20%', completed: 1, pending: 4, details: 'Only module 1 is completed.' },
    6: { progress: '95%', completed: 4, pending: 1, details: 'Almost done, final project submission pending.' },
    7: { progress: '10%', completed: 0, pending: 5, details: 'Has not started any modules yet.' },
    8: { progress: '70%', completed: 3, pending: 2, details: 'Completed 3 modules, working on the 4th.' },
};