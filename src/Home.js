import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './Context/auth';


function Home() {
    const auth = useAuth();
    const [loading, setLoading] = useState(true); // State to manage loading indicator
    const location = useLocation()

    const verifyUrl = 'http://localhost:8080/auth/verifyToken';

    async function verifyToken(token) {
        try {
            let response = await fetch(verifyUrl, {
                method: 'GET',
                headers: {
                    Authorization: token
                },
            });
            let data = await response.json();
            console.log(data, "xxxx home");
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const verifyAuthentication = async () => {
            if (auth?.user) {
                // User is already authenticated
                setLoading(false); // No need to show loading indicator
            } else {
                // User not authenticated, verify token
                try {
                    let data = await verifyToken("Bearer " + localStorage.getItem("myToken"));
                    if (data) {
                        auth.login(data.userDetail[0]);
                    } else {
                        // Handle case where verification fails
                        console.log('Token verification failed');
                    }
                } catch (error) {
                    console.error('Error verifying token:', error);
                } finally {
                    setLoading(false); // Set loading to false when finished
                }
            }
        };

        verifyAuthentication();
    }, [auth]);

    // Show loading indicator while loading
    if (loading && location.pathname !== '/index') {
        return <div>Loading...</div>; // Replace with your spinner component
    } 

    return (
        <div>
            <Outlet />
        </div>
    );
}

export default Home;
