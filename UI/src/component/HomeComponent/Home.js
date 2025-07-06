import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import eventImage from '../../assets/img/harshgujral.jpeg';
import eventImage1 from '../../assets/img/viveksamtani.jpeg';
import eventImage3 from '../../assets/img/sagar.jpeg';
import Footer from '../FooterComponent/Footer';
function Home() {
  return (
    <div style={{ paddingTop: '80px' }}>
      

      {/* Main Banner */}
      <div className="main-banner">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="main-content">
                {/* <h6>Art & Exhibition</h6> */}
                <h2>Discover Amazing Events</h2>
                <div className="main-white-button">
                  <Link to="/events">Discover More</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Events */}
      <div className="featured-events">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading">
                <h2>Featured Events</h2>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="event-item">
                <div className="thumb">
                  <img src={eventImage} alt="Featured Event" />
                  <div className="price">
                    <span>Rs.999 onwards</span>
                  </div>
                </div>
                <div className="down-content">
                  <span className="category">Stand Up Comedy</span>
                  <h4>Harsh Gujral</h4>
                  <p>Jo Boltaa Hai Wohi Hota Hai ft. <b>Harsh Gujral</b>.</p>
                  <div className="main-dark-button">
                    <Link to="/event/1">Discover More</Link>
                  </div>
                  
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="event-item">
                <div className="thumb">
                  <img src={eventImage1} alt="Featured Event" />
                  <div className="price">
                    <span>Rs.499 onwards</span>
                  </div>
                </div>
                <div className="down-content">
                  <span className="category">Stand Up Comedy</span>
                  <h4>Vivek Samtani</h4>
                  <p>Ladies Aadmi ft. <b>Vivek Samtani</b>.</p>
                  <div className="main-dark-button">
                    <Link to="/event/1">Discover More</Link>
                  </div>
                  
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="event-item">
                <div className="thumb">
                  <img src={eventImage3} alt="Featured Event" />
                  <div className="price">
                    <span>Rs.999 onwards</span>
                  </div>
                </div>
                <div className="down-content">
                  <span className="category">Concert</span>
                  <h4>Sagar Bhatia</h4>
                  <p>Sagar Waali Qawwali</p>
                  <div className="main-dark-button">
                    <Link to="/event/1">Discover More</Link>
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

export default Home;
