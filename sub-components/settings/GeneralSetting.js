import { useState } from 'react';
import { Col, Row, Form, Card, Button, Image, Modal } from 'react-bootstrap';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from '../../firebase'; // Import the Firebase auth object from your firebase.js
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { css } from '@emotion/react'; // Import css for styling the spinner
import { SyncLoader } from 'react-spinners';
import firebase from 'firebase/compat/app';
import axios from 'axios';

const GeneralSetting = () => {
  const [socialPlatform, setSocialPlatform] = useState('');
  const [postLength, setPostLength] = useState('');
  const [blogUrl, setBlogUrl] = useState('');
  const [generatedPosts, setGeneratedPosts] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [showPostPreview, setShowPostPreview] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [userId, setUserId] = useState();
  const [userCredits, setUserCredits] = useState(null);

  // Add a state variable to track the loading state
  const [isLoading, setIsLoading] = useState(false);

  // Define a CSS override for the spinner
  const spinnerStyle = css`
    display: block;
    margin: 0 auto;
    border-color: red; // Customize the spinner color
  `;


  const customArrowStyles = {
    position: 'absolute',
    zIndex: 2,
    top: 'calc(50% - 15px)', // Adjust as needed for vertical alignment
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '2.5rem', // Adjust the size of the arrow icons
    color: '#C58FFF', // Highlighted color for the arrows
  };

  const socialMediaShareOptions = [
    { platform: 'facebook', label: 'Facebook', icon: 'facebook', shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(selectedPost?.picture || "")}` },
    { platform: 'twitter', label: 'Twitter', icon: 'twitter', shareUrl: `https://twitter.com/intent/tweet?url=${encodeURIComponent(selectedPost?.picture || "")}&text=${encodeURIComponent(selectedPost?.text || "")}` },
    { platform: 'linkedin', label: 'LinkedIn', icon: 'linkedin', shareUrl: `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(selectedPost?.picture || "")}&title=${encodeURIComponent(selectedPost?.text || "")}` },
    { platform: 'reddit', label: 'Reddit', icon: 'reddit', shareUrl: `https://www.reddit.com/submit?url=${encodeURIComponent(selectedPost?.picture || "")}&title=${encodeURIComponent(selectedPost?.text || "")}` },
    { platform: 'instagram', label: 'Instagram', icon: 'instagram', shareUrl: `https://www.instagram.com/?url=${encodeURIComponent(selectedPost?.picture || "")}` },
    // Add more social media platforms and their share URLs here
  ];

  const handleShareOnSocialMedia = (platform) => {
    const selectedOption = socialMediaShareOptions.find(option => option.platform === platform);
    if (selectedOption) {
      window.open(selectedOption.shareUrl, '_blank');
    }
  };




  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
        console.log('User ID:', userId);
        setUserId(userId);

        // Fetch the user's credits from Firestore
        try {
          const userDocRef = doc(db, 'users', userId);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const credits = userData.credits || 0; // Use 0 as the default value if credits field doesn't exist
            setUserCredits(credits);
          }
        } catch (error) {
          console.error('Error fetching user credits:', error);
        }
      } else {
        console.log('No user signed in.');
      }
    });
  }, []);




  const handleGeneratePosts = async (e) => {
    e.preventDefault();
  
    if (userCredits > 0) {
      // Decrement the user's credits
      const updatedCredits = userCredits - 1;
  
      try {
        // Update the credits in Firestore
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, { credits: updatedCredits });
  
        // Set isLoading to true when starting the generation process
        setIsLoading(true);
  
        const response = await axios.post('https://coverpostsapi.onrender.com/generate_posts', {
          social_platform: socialPlatform,
          post_length: postLength,
          blog_url: blogUrl
        });
  
        if (response.status === 200) {
          const data = response.data;
          setGeneratedPosts(data);
  
         
          // Scrape images for the provided blog URL
          const scrapeResponse = await axios.post('https://coverpostsapi.onrender.com/scrape_images', {
            blog_url: blogUrl
          });
  
          if (scrapeResponse.status === 200) {
            const images = scrapeResponse.data;
            setImageUrls(images);
  
            // Add the data to Firestore here
            if (userId && data && images) {
              try {
                console.log(userId)
                const userPostsRef = collection(db, 'users', userId, 'posts');
                const batch = [];
  
                // Loop through generatedPosts and imageUrls to create batched Firestore writes
                for (let i = 0; i < Math.min(data.length, images.length); i++) {
                  const post = data[i];
                  const imageUrl = images[i];
  
                  const postDoc = {
                    text: post,
                    imageUrl: imageUrl,
                    timestamp: new Date(),
                  };
  
                  batch.push(addDoc(userPostsRef, postDoc));
                }
  
                // Commit the batched writes
                await Promise.all(batch);
                console.log('Data added to Firestore');
              } catch (error) {
                console.error('Error adding data to Firestore:', error);
              }
            }
          }
  
  
        } else {
          console.error('Error generating posts');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        // Set isLoading to false when the generation process is completed (whether it succeeded or failed)
        setIsLoading(false);
      }
    } else {
      // Handle the case where the user doesn't have enough credits
      toast('Not enough credits', {
        icon: '☹️',
      });
    }
  };
  

      
  

  const handleImageClick = (index) => {
    setSelectedPostIndex(index); // Store the index of the clicked card
    setShowModal(true);
  };

  const handlePost = (index) => {
    setSelectedPost({
      text: generatedPosts[index],
      picture: imageUrls[selectedImageIndex]
    });
    setShowPostPreview(true);
  };

  const showFullPost = (post) => {
    Swal.fire({
      title: 'Full Post',
      html: `<div style="white-space: pre-line;">${post}</div>`, // Preserve line breaks
      showCloseButton: true,
    });
  };

  const handleImageSelect = () => {
    const selectedPost = {
      text: generatedPosts[selectedPostIndex], // Use the selectedPostIndex
      picture: imageUrls[selectedImageIndex] // Use the selectedImageIndex
    };

    // Do something with the selected post, like sending it to the server or updating state
    console.log('Selected Post:', selectedPost);

    // Close the modal
    setShowModal(false);
  };


  return (
    <Row className="mb-8">
      <Toaster />
      <Col xl={12} lg={12} md={12} xs={12}>
        <Card>
          <Card.Body>
            <div className="mb-6">
              <h4 className="mb-1">Fill in the filters below and we'll generate 5 scoial media posts including illustration, pictures, and so on.</h4>
            </div>
            <Form onSubmit={handleGeneratePosts}>
              <Row className="mb-3">
                <Form.Label className="col-sm-3 col-form-label" htmlFor="socialPlatform">
                  Social Platform
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    as="select"
                    id="socialPlatform"
                    value={socialPlatform}
                    onChange={(e) => setSocialPlatform(e.target.value)}
                    required
                  >
                    <option value="">Select a platform</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Reddit">Reddit</option>
                    <option value="LinkedIn">LinkedIn</option>
                    {/* Add more platform options here */}
                  </Form.Control>
                </Col>
              </Row>
              <Row className="mb-3">
                <Form.Label className="col-sm-3 col-form-label" htmlFor="postLength">
                  Post Length
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    as="select"
                    id="postLength"
                    value={postLength}
                    onChange={(e) => setPostLength(e.target.value)}
                    required
                  >
                    <option value="">Select post length</option>
                    <option value="short">Short (50-150 words)</option>
                    <option value="medium">Medium (150 - 300 words)</option>
                    <option value="long">Long (300+ words)</option>
                  </Form.Control>
                </Col>
              </Row>
              <Row className="mb-3">
                <Form.Label className="col-sm-3 col-form-label" htmlFor="blogUrl">
                  Blog URL
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="url"
                    id="blogUrl"
                    value={blogUrl}
                    onChange={(e) => setBlogUrl(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              {isLoading ? (
                <div className="text-center">
                  <SyncLoader css={spinnerStyle} size={10} color={'#C58FFF'} loading={isLoading} />
                </div>
              ) : (
                <Button variant="primary" type="submit">
                Generate Posts
              </Button>
              )}
            </Form>

            <div className="mt-6">
              <h4 className="mb-1"><b>Here are your generated posts:</b></h4>
            </div>

            {/* Display generatedPosts */}
            <div className="flex-container" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              {generatedPosts.map((post, index) => (
                <Card key={index} style={{ flex: '0 0 calc(20% - 2%)', margin: '1%' }} className="rounded shadow mb-3">
                  <Card.Body>
                    {/* Limit post to 250 characters */}
                    <p>{post.length > 250 ? `${post.slice(0, 500)}...` : post} {post.length > 250 && (
                      <Button variant="link" size="sm" onClick={() => showFullPost(post)}>
                        Read More
                      </Button>
                    )}</p>


                    <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
                      <Button variant="secondary" className="me-2" size="sm" onClick={() => handleImageClick(index)}>
                        Add a picture 📷
                      </Button>
                      <Button onClick={() => handlePost(index)} variant="primary" size="sm">
                        Post 🚀
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
            <div style={{ display: "none" }} className="image-grid">
              {imageUrls.map((imageUrl, index) => (
                <Image
                  key={index}
                  src={imageUrl}
                  alt={`Image ${index}`}
                  fluid
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#C58FFF" }}>
            Pick an image scraped from the article:
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel
            selectedItem={selectedImageIndex}
            sx={{ maxWidth: '600px', mx: 'auto', mb: '20px', height: 'auto' }} // Set modal dimension and image styles
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
              hasPrev && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  title={label}
                  style={{ ...customArrowStyles, left: '20px' }} // Adjust for left arrow
                >
                  &larr;
                </button>
              )
            }
            renderArrowNext={(onClickHandler, hasNext, label) =>
              hasNext && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  title={label}
                  style={{ ...customArrowStyles, right: '20px' }} // Adjust for right arrow
                >
                  &rarr;
                </button>
              )
            }
          >
            {imageUrls.map((imageUrl, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedImageIndex(index); toast('Good Job! You selected a picture for your post', {
                    icon: '👏',
                  });
                }}
                onMouseEnter={() => setIsImageHovered(true)} // Set hover state
                onMouseLeave={() => setIsImageHovered(false)} // Set hover state
                style={{ position: 'relative', cursor: 'pointer' }}
              >
                <Image
                  src={imageUrl}
                  alt={`Image ${index}`}
                  fluid
                  style={{ height: '100%', objectFit: 'contain' }}
                />
                {isImageHovered && ( // Show overlay only when hovered
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(0, 0, 0, 0.7)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                  >
                    <p>Click on image to select it</p>
                    <span className="material-icons">📷</span> {/* Add your icon */}
                  </div>
                )}
              </div>
            ))}
          </Carousel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleImageSelect}>
            Done
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPostPreview} onHide={() => setShowPostPreview(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#C58FFF" }}>
            Preview Selected Post
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPost && (
            <div>
              <h5>Text:</h5>
              <p>{selectedPost.text}</p>
              <h5>Picture:</h5>
              <Image src={selectedPost.picture} fluid />
            </div>
          )}

          {selectedPost && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: "10px" }}>
              {socialMediaShareOptions.map((option) => (
                <Button key={option.platform} variant="primary" onClick={() => handleShareOnSocialMedia(option.platform)}>
                  <span className={`material-icons ${option.icon}`}>{option.icon}</span>
                </Button>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPostPreview(false)}>
            Close
          </Button>

        </Modal.Footer>
      </Modal>
    </Row>
  );
};

export default GeneralSetting;
