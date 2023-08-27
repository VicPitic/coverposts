'use client'

// Import necessary modules and hooks
import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import Link from 'next/link';
import { signInWithEmailAndPassword } from "firebase/auth"; // Import the signInWithEmailAndPassword function
import { auth } from '../../../../firebase'; // Import the Firebase auth object from your firebase.js
import useMounted from 'hooks/useMounted';

const SignIn = () => {

  // Function to handle user login
  const handleSignIn = async (event) => {
    event.preventDefault();
    
    const email = event.target.username.value; // Assuming "username" is the email input
    const password = event.target.password.value;
  
    try {
      // Sign in the user with email and password
      await signInWithEmailAndPassword(auth, email, password);
      
      // Handle successful login, e.g., redirect the user to another page
      console.log("User logged in successfully");
    } catch (error) {
      // Handle login errors
      console.error("Error logging in:", error.message);
    }
  };
  const hasMounted = useMounted();


  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        {/* Card */}
        <Card className="smooth-shadow-md">
          {/* Card body */}
          <Card.Body className="p-6">
            <div className="mb-4">
              <a href="/"><Image src="/images/brand/logo/logo-primary.svg" className="mb-2" alt="" /></a>
              <p className="mb-6">Please enter your user information.</p>
            </div>
            {/* Form */}
            {hasMounted &&
              <Form onSubmit={handleSignIn}>
                {/* Username (email) */}
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username or email</Form.Label>
                  <Form.Control type="email" name="username" placeholder="Enter email here" required="" />
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" name="password" placeholder="**************" required="" />
                </Form.Group>

                {/* Checkbox */}
                <div className="d-lg-flex justify-content-between align-items-center mb-4">
                  <Form.Check type="checkbox" id="rememberme">
                    <Form.Check.Input type="checkbox" />
                    <Form.Check.Label>Remember me</Form.Check.Label>
                  </Form.Check>
                </div>

                <div>
                  {/* Button */}
                  <div className="d-grid">
                    <Button variant="primary" type="submit">Sign In</Button>
                  </div>
                  <div className="d-md-flex justify-content-between mt-4">
                    <div className="mb-2 mb-md-0">
                      <a href="/authentication/sign-up" className="fs-5">Create An Account </a>
                    </div>
                    <div>
                      <a href="/authentication/forget-password" className="text-inherit fs-5">Forgot your password?</a>
                    </div>
                  </div>
                </div>
              </Form>
            }
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SignIn;
