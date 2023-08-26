import { useState } from 'react';
import { Col, Row, Form, Card, Button, Image } from 'react-bootstrap';
import axios from 'axios';

const GeneralSetting = () => {
  const [socialPlatform, setSocialPlatform] = useState('');
  const [postLength, setPostLength] = useState('');
  const [blogUrl, setBlogUrl] = useState('');
  const [generatedPosts, setGeneratedPosts] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

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

  return (
    <Row className="mb-8">
      <Col xl={12} lg={12} md={12} xs={12}>
        <Card>
          <Card.Body>
            <div className="mb-6">
              <h4 className="mb-1">Generate Social Media Posts</h4>
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
            {/* Display generatedPosts */}
            <div>
              {generatedPosts.map((post, index) => (
                <p key={index}>{post}</p>
              ))}
            </div>
            <div className="image-grid">
              {/* Display imageUrls */}
              {imageUrls.map((imageUrl, index) => (
                <Image key={index} src={imageUrl} alt={`Image ${index}`} fluid />
              ))}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default GeneralSetting;
