import { lazy } from 'react';

const Users = lazy(() => import('../modules/dashboard/pages/users'));


const coreRoutes = [
    {
        path: '/admin/users',
        title: 'Users',
        component: Users,
    },
];

const routes = [...coreRoutes];
export default routes;
