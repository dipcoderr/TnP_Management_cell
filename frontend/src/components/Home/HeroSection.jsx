import React from "react";
import { FaBuilding, FaSuitcase, FaUsers, FaUserPlus } from "react-icons/fa";

const HeroSection = () => {
  const details = [
    {
      id: 1,
      title: "150+",
      subTitle: "Placements",
      icon: <FaSuitcase />,
    },
    {
      id: 2,
      title: "50+",
      subTitle: "Companies Visit",
      icon: <FaBuilding />,
    },
    {
      id: 3,
      title: "5,000+",
      subTitle: "Students Placed",
      icon: <FaUsers />,
    },
    {
      id: 4,
      title: "100+",
      subTitle: "Campus Drives",
      icon: <FaUserPlus />,
    },
  ];  return (
    <>
      <div id="home" className="heroSection">
        <div className="container">
          <div className="title">
            <h1>Launch Your Career</h1>
            <h1>Through Campus Placements</h1>
            <p>
              Unlock your potential and secure your dream job through our premier campus placement platform. 
              Connect with top companies, showcase your talents, and take the first step towards your 
              professional success.
            </p>
          </div>
          <div className="image">
            <img src="/heroS.jpg" alt="hero" />
          </div>
        </div>
        <div className="details">
          {details.map((element) => {
            return (
              <div className="card" key={element.id}>
                <div className="icon">{element.icon}</div>
                <div className="content">
                  <p>{element.title}</p>
                  <p>{element.subTitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HeroSection;