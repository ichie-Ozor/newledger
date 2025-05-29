import React, { useCallback, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './Context/auth';
import { baseUrl } from './Utilities/helper';
import SideBar from './Utilities/SideBar';
import Header from './Utilities/Header';


function Home() {
    const navigate = useNavigate()
    const auth = useAuth();
    const [loading, setLoading] = useState(true); // State to manage loading indicator
    const location = useLocation()

    const verifyUrl = baseUrl + '/auth/verifyToken';
    let token = localStorage.getItem("myToken")

    const verifyToken = useCallback(async () => {
        try {
            let response = await fetch(verifyUrl, {
                method: 'GET',
                headers: {
                    Authorization: token
                },
            });
            let data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    }, [token, verifyUrl])
    // alert(JSON.stringify(token))

    const verifyAuthentication = useCallback(async () => {
        if (!token) {
            setLoading(false)
            navigate('/');
            return;
        }

        if (auth?.user) {
            // User is already authenticated
            setLoading(false); // No need to show loading indicator
        } else {
            // User not authenticated, verify token
            try {
                let data = await verifyToken("Bearer " + token);
                if (data && data.userDetail?.length) {
                    auth.login(data.userDetail[0]);
                } else {
                    // Handle case where verification fails
                    console.log('Token verification failed');
                    navigate("/")
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                setLoading(false)
                navigate('/')
            } finally {
                setLoading(false); // Set loading to false when finished
            }
        }
    }, [auth, navigate, token, verifyToken]);

    useEffect(() => {

        if (token) {
            verifyAuthentication();
        }

    }, [token, verifyAuthentication]);


    // Show loading indicator while loading
    if (loading && location.pathname !== '/') {
        return <div>Loading...{JSON.stringify(loading)}</div>; // Replace with your spinner component
    }

    return (
        <div className='flex'>
            <SideBar />
            <div className=''>
                <Header />
                <Outlet />
            </div>
        </div>
    );
}

export default Home;
