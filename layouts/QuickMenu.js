// import node module libraries
import Link from 'next/link';

import { Fragment } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
    Row,
    Col,
    Image,
    Dropdown,
    ListGroup,
    Modal,
    Button
} from 'react-bootstrap';
import { css } from '@emotion/react'; // Import Emotion's css function
import Chip from '@mui/material/Chip';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { db, app } from '../firebase'; // Import your Firebase configuration

// simple bar scrolling used for notification item scrolling
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

// import data files
import NotificationList from 'data/Notification';

// import hooks
import useMounted from 'hooks/useMounted';
import axios from 'axios';

const QuickMenu = () => {

    const hasMounted = useMounted();
    const [showModal, setShowModal] = useState(false);

    // Event handler to handle the Axios POST request for Starter Package
    const handleSelectStarter = () => {
        axios.post("https://coverpostsbillingapi.onrender.com/api/create-standard").then(response => {
            const { url } = response.data;
            console.log(url);
            window.location = url;
        }).catch(err => {
            toast.error(result)
            console.log(err.message);
        })
    };

    // Event handler to handle the Axios POST request for Premium Package
    const handleSelectPremium = () => {
        // Make an Axios POST request to your desired endpoint
        axios.post('https://coverpostsbillingapi.onrender.com/api/create-premium').then(response => {
            const { url } = response.data;
            console.log(url);
            window.location = url;
        }).catch(err => {
            toast.error(result)
            console.log(err.message);
        })
    };

    // Step 3: Event handler to show the modal
    const handleShowModal = () => {
        setShowModal(true);
    };

    // Event handler to hide the modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const isDesktop = useMediaQuery({
        query: '(min-width: 1224px)'
    })

    const centerHorizontally = css`
    display: flex;
    justify-content: center;
    align-items: center;
  `;

    const ModalContent = (
        <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>You are out of credits. Select a plan</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="d-flex flex-wrap justify-between">
                    {/* Pricing Option 1 */}
                    <div className="flex-grow-1 m-2 text-primary-900">
                        <div className="w-72 mx-auto bg-white-600/20 p-4 flex flex-col justify-between">
                            <div>
                                <center>
                                    <img
                                        src="https://ucarecdn.com/f20e2e0e-fbdc-4b40-ba42-f15357b624e2/12.png"
                                        alt="Customizable Layouts image used."
                                        className="mx-auto"
                                    />
                                </center>
                                <h2 className="text-center text-black text-2xl font-bold mt-4">
                                    ✏️ Starter Package
                                </h2>
                                <ul className="text-gray-600 mb-4">
                                    <li>✅ Up to 20 credits/month</li>
                                    <li>✅ Without a watermark</li>
                                    <li>✅ Share posts on the biggest social media platforms</li>
                                    <li>✅ Posts include illustrations based on the article</li>
                                    <li>✅ Saved posts history</li>
                                </ul>
                            </div>
                            <div className="text-center">
                                <span className="text-2xl font-semibold">$10/month</span>
                            </div>
                            <div className="text-center mt-2">
                                <Button onClick={handleSelectStarter} variant="primary">Select</Button>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Option 2 */}
                    <div className="flex-grow-1 m-2 text-primary-900">
                        <div className="w-72 mx-auto bg-white-600/20 p-4 flex flex-col justify-between">
                            <div>
                                <center>
                                    <img
                                        src="https://ucarecdn.com/ce399912-445f-4692-b176-cc3866db557c/13.png"
                                        alt="Customizable Layouts image used."
                                        className="mx-auto"
                                    />
                                </center>
                                <h2 className="text-center text-black text-2xl font-bold mt-4">
                                    💎 Premium Package
                                </h2>
                                <ul className="text-gray-600 mb-4">
                                    <li>✅ Unlimited credits</li>
                                    <li>✅ Without a watermark</li>
                                    <li>✅ Share posts on the biggest social media platforms</li>
                                    <li>✅ Posts include illustrations based on the article</li>
                                    <li>✅ Saved posts history</li>
                                    <li>✅ Multiple post customization options</li>
                                </ul>
                            </div>
                            <div className="text-center">
                                <span className="text-2xl font-semibold">$40/month</span>
                            </div>
                            <div className="text-center mt-2">
                                <Button onClick={handleSelectPremium} variant="primary">Select</Button>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Option 3 */}
                    <div className="flex-grow-1 m-2 text-primary-900">
                        <div className="w-72 mx-auto bg-white-600/20 p-4 flex flex-col justify-between">
                            <div>
                                <center>
                                    <img
                                        src="https://ucarecdn.com/0433bcc6-008f-4d0b-af1c-791e9360017c/14.png"
                                        alt="Automated Content Flywheel image used."
                                        className="mx-auto"
                                    />
                                </center>
                                <h2 className="text-center text-black text-2xl font-bold mt-4">
                                    🦄 Enterprise Package
                                </h2>
                                <ul className="text-gray-600 mb-4">
                                    <li>⭐️ Automated content flywheel implementation using Coverpost's AI automated systems</li>
                                    <li>⭐️ Automatically grabs your chosen blog content from various sources</li>
                                    <li>⭐️ Automatically creates posts</li>
                                    <li>⭐️ Automatically distributes these posts to your social media profiles</li>
                                </ul>
                            </div>
                            <div className="text-center">
                                <span className="text-2xl font-semibold">Custom price</span>
                            </div>
                            <div className="text-center mt-2">
                                <Button className="btn btn--purple" variant="primary">Contact Us</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

    );
    const [userCredits, setUserCredits] = useState(null);
    useEffect(() => {
        const auth = getAuth();

        // Listen for changes in authentication state (user sign-in/sign-out)
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in, you can access the user's properties
                const userId = user.uid;
                const urlParams = new URLSearchParams(window.location.search);
                const sessionId = urlParams.get("session_id");

                if (sessionId) {
                    axios.get(`https://coverpostsbillingapi.onrender.com/api/check-subscription?id=${sessionId}`).then(response => {

                        //Check Stripe Session
                        const db = getFirestore(app);
                        if (response.data.status == "complete") {
                            const userDoc = doc(db, "users", userId);
                            updateDoc(userDoc, { session_id: sessionId, subscription: "PAID" });
                        }

                    }).catch(err => {
                        console.log(err.message);
                    })

                }

                // Retrieve the user's credits from Firestore
                const userDocRef = doc(db, 'users', userId); // Adjust the Firestore path
                try {
                   
                    const docSnap = await getDoc(userDocRef);
                    if (docSnap.exists()) {
                        console.log('d')
                        // Assuming you have a 'credits' field in your Firestore document
                        const credits = docSnap.data().credits;
                        console.log(docSnap.data())
                        if (credits <= 0)
                            setShowModal(true);

                        setUserCredits(credits);
                        console.log('->',credits)
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


    const Notifications = () => {
        return (
            <SimpleBar style={{ maxHeight: '300px' }}>
                <ListGroup variant="flush">
                    {NotificationList.map(function (item, index) {
                        return (
                            <ListGroup.Item className={index === 0 ? 'bg-light' : ''} key={index}>
                                <Row>
                                    <Col>
                                        <a href="#" className="text-muted">
                                            <h5 className=" mb-1">{item.sender}</h5>
                                            <p className="mb-0"> {item.message}</p>
                                        </a>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            </SimpleBar>
        );
    }

    const QuickMenuDesktop = () => {
        const UserCreditsPill = ({ credits }) => css`
        display: inline-block;
        margin-right: 10px; /* Adjust the spacing as needed */
        .badge-pill {
          padding: 6px 12px; /* Adjust the padding as needed */
          border-radius: 20px; /* Adjust the border-radius to make it more like a pill shape */
          font-size: 14px; /* Adjust the font size as needed */
          background-color: #ccc; /* Gray background color */
          color: #000; /* Text color set to black */
        }
      `;
        return (
            <ListGroup as="ul" bsPrefix='navbar-nav' className={`navbar-right-wrap ms-auto d-flex nav-top-wrap ${centerHorizontally}`}>
                <Chip
                    onClick={handleShowModal}
                    label={`Remaining Credits: ${userCredits}`}
                    sx={{ marginTop: '5px', cursor: 'pointer' }}
                />
                <Dropdown as="li" className="ms-2">
                    <Dropdown.Toggle
                        as="a"
                        bsPrefix=' '
                        className="rounded-circle"
                        id="dropdownUser">
                        <div className="avatar avatar-md avatar-indicators avatar-online">
                            <Image alt="avatar" src='/images/avatar/avatar-1.jpg' className="rounded-circle" />
                        </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                        className="dropdown-menu dropdown-menu-end "
                        align="end"
                        aria-labelledby="dropdownUser"
                        show
                    >
                        <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=' '>
                            <div className="lh-1 ">
                                <h5 className="mb-1"> John E. Grainger</h5>
                                <a href="#" className="text-inherit fs-6">View my profile</a>
                            </div>
                            <div className=" dropdown-divider mt-3 mb-2"></div>
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="2">
                            <i className="fe fe-user me-2"></i> Edit Profile
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="3">
                            <i className="fe fe-activity me-2"></i> Activity Log
                        </Dropdown.Item>
                        <Dropdown.Item className="text-primary">
                            <i className="fe fe-star me-2"></i> Go Pro
                        </Dropdown.Item>
                        <Dropdown.Item >
                            <i className="fe fe-settings me-2"></i> Account Settings
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <i className="fe fe-power me-2"></i>Sign Out
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </ListGroup>
        )
    }

    const QuickMenuMobile = () => {
        return (
            <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
                <Dropdown as="li" className="stopevent">
                    <Dropdown.Toggle as="a"
                        bsPrefix=' '
                        id="dropdownNotification"
                        className="btn btn-light btn-icon rounded-circle indicator indicator-primary text-muted">
                        <i className="fe fe-bell"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                        className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-end py-0"
                        aria-labelledby="dropdownNotification"
                        align="end"
                    >
                        <Dropdown.Item className="mt-3" bsPrefix=' ' as="div"  >
                            <div className="border-bottom px-3 pt-0 pb-3 d-flex justify-content-between align-items-end">
                                <span className="h4 mb-0">Notifications</span>
                                <a href="/" className="text-muted">
                                    <span className="align-middle">
                                        <i className="fe fe-settings me-1"></i>
                                    </span>
                                </a>
                            </div>
                            <Notifications />
                            <div className="border-top px-3 pt-3 pb-3">
                                <a href="/dashboard/notification-history" className="text-link fw-semi-bold">
                                    See all Notifications
                                </a>
                            </div>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown as="li" className="ms-2">
                    <Dropdown.Toggle
                        as="a"
                        bsPrefix=' '
                        className="rounded-circle"
                        id="dropdownUser">
                        <div className="avatar avatar-md avatar-indicators avatar-online">
                            <Image alt="avatar" src='/images/avatar/avatar-1.jpg' className="rounded-circle" />
                        </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                        className="dropdown-menu dropdown-menu-end "
                        align="end"
                        aria-labelledby="dropdownUser"
                    >
                        <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=' '>
                            <div className="lh-1 ">
                                <h5 className="mb-1"> John E. Grainger</h5>
                                <a href="#" className="text-inherit fs-6">View my profile</a>
                            </div>
                            <div className=" dropdown-divider mt-3 mb-2"></div>
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="2">
                            <i className="fe fe-user me-2"></i> Edit Profile
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="3">
                            <i className="fe fe-activity me-2"></i> Activity Log
                        </Dropdown.Item>
                        <Dropdown.Item className="text-primary">
                            <i className="fe fe-star me-2"></i> Go Pro
                        </Dropdown.Item>
                        <Dropdown.Item >
                            <i className="fe fe-settings me-2"></i> Account Settings
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <i className="fe fe-power me-2"></i>Sign Out
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </ListGroup>
        )
    }

    return (
        <Fragment>
            {hasMounted && isDesktop ? (
                <QuickMenuDesktop />
            ) : (
                <QuickMenuMobile />
            )}
            {ModalContent} {/* Render the modal content */}
        </Fragment>
    )
}

export default QuickMenu;