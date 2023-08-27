import { useState } from 'react';
import { Col, Row, Form, Card, Button, Image, Modal } from 'react-bootstrap';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Swal from 'sweetalert2';
import axios from 'axios';

const GeneralSetting = () => {
  const [socialPlatform, setSocialPlatform] = useState('');
  const [postLength, setPostLength] = useState('');
  const [blogUrl, setBlogUrl] = useState('');
  const [generatedPosts, setGeneratedPosts] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false); // Track hover state

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedPostIndex, setSelectedPostIndex] = useState(0); // Add this state variable

  const [showPostPreview, setShowPostPreview] = useState(false); // New state variable
  const [selectedPost, setSelectedPost] = useState(null); // New state variable

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

  const handleGeneratePosts = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:5000/generate_posts', {
        social_platform: socialPlatform,
        post_length: postLength,
        blog_url: blogUrl
      });

      if (response.status === 200) {
        const data = response.data;
        setGeneratedPosts(data);

        // Scrape images for the provided blog URL
        const scrapeResponse = await axios.post('http://127.0.0.1:5000/scrape_images', {
          blog_url: blogUrl
        });

        if (scrapeResponse.status === 200) {
          const images = scrapeResponse.data;
          setImageUrls(images);
        }
      } else {
        console.error('Error generating posts');
      }
    } catch (error) {
      console.error('Error:', error);
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
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
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
              <Button variant="primary" type="submit">
                Generate Posts
              </Button>
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
                onClick={() => setSelectedImageIndex(index)}
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
