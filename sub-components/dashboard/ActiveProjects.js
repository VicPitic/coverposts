// import node module libraries
import Link from 'next/link';
import { ProgressBar, Col, Row, Card, Table, Image, Button } from 'react-bootstrap';

import { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../firebase'; // Import the Firebase auth object from your firebase.js
import {
    query as firestoreQuery,
    where,
    orderBy,
    limit,
    getDocs,
} from 'firebase/firestore'; // Import necessary Firestore functions

const ActiveProjects = () => {
    const [userId, setUserId] = useState(null);
    const [lastFivePosts, setLastFivePosts] = useState([]); // State to store the last 5 posts

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userId = user.uid;
                console.log('User ID:', userId);
                setUserId(userId);

                // Fetch the last 5 posts for the user
                try {
                    const userPostsRef = collection(db, 'users', userId, 'posts'); // Path to user's posts
                    const query = firestoreQuery(
                        userPostsRef,
                        orderBy('timestamp', 'desc'),
                        limit(5)
                    );
                    const querySnapshot = await getDocs(query);

                    const posts = [];
                    querySnapshot.forEach((doc) => {
                        // Assuming your posts have a 'text' field, update this to match your data structure
                        const postData = doc.data();
                        posts.push(postData);

                    });

                    // Set the last 5 posts in the state
                    setLastFivePosts(posts);
                    console.log(posts)
                } catch (error) {
                    console.error('Error fetching posts:', error);
                }
            } else {
                console.log('No user signed in.');
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <Row className="mt-6">
            <Col md={12} xs={12}>
                <Card>
                    <Card.Header className="bg-white  py-4">
                        <h4 className="mb-0">Your latest posts</h4>
                    </Card.Header>
                    <Table responsive className="text-nowrap mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Article URL</th>
                                <th>Post Length</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lastFivePosts.map((post, index) => (
                                <tr key={index}>
                                    <td className="align-middle">
                                        <img src={post.imageUrl} height={100} width={150} alt="Post Image" />


                                    </td>
                                    <td className="align-middle">
                                        {post.text.length > 60 ? `${post.text.substring(0, 60)}...` : post.text}
                                    </td>
                                    <td className="align-middle text-dark">
                                        <div className="mt-2">
                                            <Button variant="primary" size="sm">
                                                View post 🚀
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Card.Footer className="bg-white text-center">
                        <a href="#" className="link-primary">
                            View All Projects
                        </a>
                    </Card.Footer>
                </Card>
            </Col>
        </Row>
    );
};

export default ActiveProjects;
