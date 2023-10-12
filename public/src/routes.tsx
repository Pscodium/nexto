import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Map from '../modules/map/map';
import Home from '../modules/home/home';
import Login from '../modules/auth/login';
import Register from '../modules/auth/register';

import Loader from '../common/Loader/index';
import { Toaster } from 'react-hot-toast';
import routes from '../routes/index';

const Dashboard = lazy(() => import('../modules/dashboard/dashboard'));
import DashboardHome from '../modules/dashboard/pages/home';
import Authenticate from '../middleware/authentication';

export default function Router() {
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);


    return loading ? (
        <Loader />
    ) : (
        <>
            <Toaster position='top-right' reverseOrder={false} containerClassName='overflow-auto' />

            <Routes>
                <Route path="/">
                    <Route path="/map" element={<Authenticate children={<Map />} />} />
                    <Route path="/" element={<Authenticate children={<Home />} />} />
                    <Route path='/admin' element={<Authenticate children={<Dashboard />} />}>
                        <Route index element={<DashboardHome />} />
                        {routes.map(({ path, component: Component }) => (
                            <Route
                                path={path}
                                element={
                                    <Suspense fallback={<Loader />}>
                                        <Authenticate children={<Component />} />
                                    </Suspense>
                                }
                            />
                        ))}
                    </Route>
                </Route>
                {/* -- Authentication Routes -- */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </>
    );
}