'use client'
// import node module libraries
import { Fragment } from "react";
import Link from 'next/link';
import { Container, Col, Row } from 'react-bootstrap';

import {
    Briefcase,
    ListTask,
    People,
    Bullseye
} from 'react-bootstrap-icons';

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
    collection,
    doc,
    getDoc,
    query as firestoreQuery,
    orderBy,
    limit,
    getDocs,
} from 'firebase/firestore';
import { db } from '../../firebase'; // Import your Firebase configuration

// import widget/custom components
import { StatRightTopIcon } from "widgets";

// import sub components
import {
    ActiveProjects, Teams,
    TasksPerformance
} from "sub-components";


const Home = () => {

    const [ProjectsStatsData, setProjectsStatsData] = useState([
        {
            id: 1,
            title: "Posts generated",
            value: "-",
            icon: <Briefcase size={18} />,
        },
        {
            id: 2,
            title: "Blog URLs used",
            value: "-",
            icon: <ListTask size={18} />,
        },
        {
            id: 3,
            title: "Remaining Credits",
            value: "-",
            icon: <People size={18} />,
        },
        {
            id: 4,
            title: "Productivity",
            value: "-",
            icon: <Bullseye size={18} />,
        }
    ]);

    const [userCredits, setUserCredits] = useState(0);
    useEffect(() => {
        const auth = getAuth();

        // Listen for changes in authentication state (user sign-in/sign-out)
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in, you can access the user's properties
                const userId = user.uid;

                // Retrieve the user's credits from Firestore
                const userDocRef = doc(db, 'users', userId); // Adjust the Firestore path
                const userPostsRef = collection(db, 'users', userId, 'posts'); // Path to user's posts
                try {
                    const docSnap = await getDoc(userDocRef);
                    if (docSnap.exists()) {
                        // Assuming you have a 'credits' field in your Firestore document

                        const query = firestoreQuery(
                            userPostsRef,
                            orderBy('timestamp', 'desc'),
                        );
                        const querySnapshot = await getDocs(query);

                        const posts = [];
                        querySnapshot.forEach((doc) => {
                            // Assuming your posts have a 'text' field, update this to match your data structure
                            const postData = doc.data();
                            console.log(postData);
                            posts.push(postData);

                        });

                        const credits = docSnap.data().credits;
                        console.log(userPostsRef);
                        setUserCredits(credits);
                        setProjectsStatsData([
                            {
                                id: 1,
                                title: "Posts generated",
                                value: posts.length,
                                icon: <Briefcase size={18} />,
                            },
                            {
                                id: 2,
                                title: "Blog URLs used",
                                value: 132,
                                icon: <ListTask size={18} />,
                            },
                            {
                                id: 3,
                                title: "Remaining Credits",
                                value: credits,
                                icon: <People size={18} />,
                            },
                            {
                                id: 4,
                                title: "Productivity",
                                value: '76%',
                                icon: <Bullseye size={18} />,
                            }
                        ])
                    } else {
                        setUserCredits(null); // User document doesn't exist
                    }
                } catch (error) {
                    console.error('Error fetching user credits:', error);
                }
            } else {
                // No user is signed in or the user's session has expired.
                setUserCredits(null); // Reset userCredits if no user is signed in
                window.location.href = "/authentication/sign-in"
            }
        });

        // Clean up the subscription when the component unmounts
        return () => unsubscribe();
    }, []); // The empty array makes this effect run only once on component mount



    return (
        <Fragment>
            <div className="bg-primary pt-10 pb-21"></div>
            <Container fluid className="mt-n22 px-6">
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        {/* Page header */}
                        <div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="mb-2 mb-lg-0">
                                    <h3 className="mb-0 text-white">🎉 Things are always better automated with <b>Coverposts</b></h3>
                                </div>
                                <div>
                                    <a href="/pages/post" className="btn btn-white">Create New Post</a>
                                </div>
                            </div>
                        </div>
                    </Col>
                    {ProjectsStatsData.map((item, index) => {
                        return (
                            <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={index}>
                                <StatRightTopIcon info={item} />
                            </Col>
                        )
                    })}
                </Row>

                {/* Active Projects  */}
                <ActiveProjects />


            </Container>
        </Fragment>
    )
}
export default Home;
