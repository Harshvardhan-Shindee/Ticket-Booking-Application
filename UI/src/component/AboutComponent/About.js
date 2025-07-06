import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import aboutImage from '../../assets/img/about-image.jpg';
import Footer from '../FooterComponent/Footer';

function About() {
  return (
    <div style={{ paddingTop: '80px' }}>
     

      {/* Main Banner */}
      <div className="about-main-banner">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="main-content">
                <h2>About Us</h2>
                <div className="main-white-button">
                  <Link to="/contact">Contact Us</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="about-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="content">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="about-image">
                      <img src={aboutImage} alt="About Us" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="about-text">
                      <h4>About BookMyShow</h4>
                      <p>If lounging on a sofa with a bowl of popcom has become your daily ritual, you can jazz it up with some live events! Gone are the days when movies were the only source of real entertainment. Now you can take a break from the constant screen time to indulge in some live entertainment near you with the tap of a button. Find a curated list of upcoming events in indore so that you can spot the right event for that perfect weekend.</p>
                      <p>Our mission is to make event accessible to everyone by providing a seamless platform for event discovery and management.</p>
                      <div className="main-button">
                        <Link to="/events">Discover Events</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}

export default About;