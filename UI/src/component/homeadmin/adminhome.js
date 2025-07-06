import React from 'react';
import { Link } from 'react-router-dom';
import './adminhome.css';
import eventImage from '../../assets/img/event-01.jpg';

function Adminhome() {
  return (
    <div>
     

      {/* Main Banner */}
      <div className="main-banner">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="main-content">
                <h6>Art & Exhibition</h6>
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
                    <span>$35.00</span>
                  </div>
                </div>
                <div className="down-content">
                  <span className="category">Art Gallery</span>
                  <h4>Modern Art Exhibition</h4>
                  <p>Experience the finest contemporary artworks from emerging artists.</p>
                  <div className="main-dark-button">
                    <Link to="/event/1">Discover More</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <p>Copyright 2025 ArtXibition. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Adminhome;
