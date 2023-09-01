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
} from 'react-bootstrap';
import { css } from '@emotion/react'; // Import Emotion's css function
import Chip from '@mui/material/Chip';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firebase configuration

// simple bar scrolling used for notification item scrolling
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

// import data files
import NotificationList from 'data/Notification';

// import hooks
import useMounted from 'hooks/useMounted';

const QuickMenu = () => {

    const hasMounted = useMounted();

    const isDesktop = useMediaQuery({
        query: '(min-width: 1224px)'
    })


  
    const [userCredits, setUserCredits] = useState(null);
    useEffect(() => {
        const auth = getAuth();

        // Listen for changes in authentication state (user sign-in/sign-out)
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in, you can access the user's properties
                const userId = user.uid;

                // Retrieve the user's credits from Firestore
                const userDocRef = doc(db, 'users', userId); // Adjust the Firestore path
                try {
                    const docSnap = await getDoc(userDocRef);
                    if (docSnap.exists()) {
                        // Assuming you have a 'credits' field in your Firestore document
                        const credits = docSnap.data().credits;
                        setUserCredits(credits);
                    } else {
                        setUserCredits(null); // User document doesn't exist
                    }
                } catch (error) {
                    console.error('Error fetching user credits:', error);
                }
            } else {
                // No user is signed in or the user's session has expired.
                setUserCredits(null); // Reset userCredits if no user is signed in
                window.location.href="/authentication/sign-in"
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
            <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
        <Chip label={"Remaining Credits: " + userCredits} />
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
            {hasMounted && isDesktop ? <QuickMenuDesktop /> : <QuickMenuMobile />}
        </Fragment>
    )
}

export default QuickMenu;