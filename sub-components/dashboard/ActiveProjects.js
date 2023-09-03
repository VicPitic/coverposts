// import node module libraries
import Link from 'next/link';
import { ProgressBar, Col, Row, Card, Table, Image, Button, Modal } from 'react-bootstrap';

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

    const [showPostPreview, setShowPostPreview] = useState(false); // New state variable
    const [selectedPost, setSelectedPost] = useState(null); // New state variable
    const [isHomePage, setIsHomePage] = useState(null); // New state variable

    const socialMediaShareOptions = [
        {
            platform: 'facebook',
            label: 'Facebook',
            icon: 'facebook',
            shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
        },
        {
            platform: 'twitter',
            label: 'Twitter',
            icon: 'twitter',
            shareUrl: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(selectedPost?.text || '')}`,
        },
        {
            platform: 'linkedin',
            label: 'LinkedIn',
            icon: 'linkedin',
            shareUrl: `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(selectedPost?.text || '')}`,
        },
        {
            platform: 'reddit',
            label: 'Reddit',
            icon: 'reddit',
            shareUrl: `https://www.reddit.com/submit?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(selectedPost?.text || '')}`,
        },
        {
            platform: 'instagram',
            label: 'Instagram',
            icon: 'instagram',
            shareUrl: 'https://www.instagram.com',
        },
        // Add more social media platforms and their share URLs here
    ];


    const handlePreviewPost = (post) => {
        setSelectedPost(post);
        setShowPostPreview(true);
      };
    
      const handleShareOnSocialMedia = (platform) => {
        if (selectedPost) {
          const selectedOption = socialMediaShareOptions.find(option => option.platform === platform);
          if (selectedOption) {
            const shareUrl = selectedOption.shareUrl
              .replace('{imageUrl}', encodeURIComponent(selectedPost.imageUrl))
              .replace('{text}', encodeURIComponent(selectedPost.text));
            window.open(shareUrl, '_blank');
          }
        }
      };
    
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            const userId = user.uid;
            setUserId(userId);
    
            try {
              setIsHomePage(window.location.href.includes("pages"));
              const userPostsRef = collection(db, 'users', userId, 'posts');
              const querySnapshot = await getDocs(orderBy(userPostsRef, 'timestamp', 'desc', limit(window.location.href.includes("pages") ? Infinity : 5)));
    
              const posts = [];
              querySnapshot.forEach((doc) => {
                const postData = doc.data();
                posts.push(postData);
              });
    
              setLastFivePosts(posts);
            } catch (error) {
              console.error('Error fetching posts:', error);
            }
          } else {
            console.log('No user signed in.');
          }
        });
    
        return () => {
          unsubscribe();
        };
      }, []);
    
      return (
        <div>
          <Row className="mt-6">
            <Col md={12} xs={12}>
              <Card>
                <Card.Header className="bg-white  py-4">
                  <h4 className="mb-0">Your latest posts</h4>
                </Card.Header>
                <Table responsive className="text-nowrap mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Post image</th>
                      <th>Post Length</th>
                      <th>Create date</th>
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
                        <td className="align-middle">
                          {new Date(post.timestamp.toMillis()).toLocaleString()}
                        </td>
                        <td className="align-middle text-dark">
                          <div className="mt-2">
                            <Button variant="primary" size="sm" onClick={() => handlePreviewPost(post)}>
                              Preview post 🚀
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Card.Footer className="bg-white text-center">
                  {isHomePage ? (
                    <a href="/pages/post" className="link-primary">
                      + Create new posts
                    </a>
                  ) : (
                    <a href="/pages/posts" className="link-primary">
                      View all posts
                    </a>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          </Row>
    
          <Modal show={showPostPreview} onHide={() => setShowPostPreview(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Preview Selected Post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedPost && (
                <div>
                  <h5>Text:</h5>
                  <p>{selectedPost.text}</p>
                  <h5>Image:</h5>
                  <Image src={selectedPost.imageUrl} fluid />
                </div>
              )}
              <br />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                {socialMediaShareOptions.map((option) => (
                  <Button key={option.platform} variant="primary" onClick={() => handleShareOnSocialMedia(option.platform)}>
                    <span className={`material-icons ${option.icon}`}>{option.icon}</span>
                  </Button>
                ))}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowPostPreview(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    };
    
    export default ActiveProjects;