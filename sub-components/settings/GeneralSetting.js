import { useState } from 'react';
import { Col, Row, Form, Card, Button, Image, Modal } from 'react-bootstrap';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import axios from 'axios';

const GeneralSetting = () => {
  const [socialPlatform, setSocialPlatform] = useState('');
  const [postLength, setPostLength] = useState('');
  const [blogUrl, setBlogUrl] = useState('');
  const [generatedPosts, setGeneratedPosts] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
    setSelectedImageIndex(index);
    setShowModal(true);
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
                    <p>{post}</p>
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
                      <Button variant="primary" className="me-2" size="sm" onClick={() => handleImageClick(index)}>
                        Add a picture 📷
                      </Button>
                      <Button variant="primary" size="sm">
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
          <Modal.Title style={{ color: "#C58FFF" }}>Pick an image scraped from the article:</Modal.Title>
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
              <div key={index}>
                <Image
                  src={imageUrl}
                  alt={`Image ${index}`}
                  fluid
                  style={{ height: '100%', objectFit: 'contain' }} // Maintain aspect ratio
                />
              </div>
            ))}
          </Carousel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            Select Image
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
};

export default GeneralSetting;
