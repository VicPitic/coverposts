'use client'

// import node module libraries
import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import Link from 'next/link';
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from '../../../../firebase'; // Import the Firebase auth object from your firebase.js

// import hooks
import useMounted from 'hooks/useMounted';

const SignUp = () => {
  const handleSignUp = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      console.log("Creating user with email and password...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      console.log("User created successfully.");
      // You can access the newly created user with userCredential.user
      const user = userCredential.user;

      console.log("Updating user profile...");
      // You can also update the user's profile with additional information
      await updateProfile(auth.currentUser, {
        displayName: username,
      });

      console.log("User profile updated successfully.");

      console.log("Adding user data to Firestore...");
      // Add user data to Firestore
      const userCollection = collection(db, "users"); // Assuming "users" is the name of your Firestore collection
      const userDocRef = doc(userCollection, user.uid); // Use the user's ID as the document ID
      await setDoc(userDocRef, {
        username: username,
        email: email,
        credits: 3,
        // Add any other user data you want to store in Firestore
      });


      console.log("User data added to Firestore successfully.");

      // Handle successful registration, e.g., redirect the user to another page
      console.log("Registration successful, redirecting...");
      window.location.href = "/"; // Redirect to the homepage
    } catch (error) {
      // Handle errors during registration
      console.error("Error registering user:", error.message);
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
              <Form onSubmit={handleSignUp}>
                {/* Username */}
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username or email</Form.Label>
                  <Form.Control type="text" name="username" placeholder="User Name" required="" />
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" placeholder="Enter address here" required="" />
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" name="password" placeholder="**************" required="" />
                </Form.Group>

                {/* Confirm Password */}
                <Form.Group className="mb-3" controlId="confirm-password">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" name="confirm-password" placeholder="**************" required="" />
                </Form.Group>

                {/* Checkbox */}
                <div className="mb-3">
                  <Form.Check type="checkbox" id="check-api-checkbox">
                    <Form.Check.Input type="checkbox" />
                    <Form.Check.Label>
                      I agree to the <a href="#"> Terms of Service </a> and <a href="#"> Privacy Policy.</a>
                    </Form.Check.Label>
                  </Form.Check>
                </div>

                <div>
                  {/* Button */}
                  <div className="d-grid">
                    <Button variant="primary" type="submit">Create Free Account</Button>
                  </div>
                  <div className="d-md-flex justify-content-between mt-4">
                    <div className="mb-2 mb-md-0">
                      <a href="/authentication/sign-in" className="fs-5">Already member? Login </a>
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
  )
}

export default SignUp