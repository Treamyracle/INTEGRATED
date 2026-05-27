import React from 'react';
import Navbar from './Navbar';
import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { SiHuggingface } from 'react-icons/si';
import '../css/aboutme.css';
import fotoProfil from '../assets/images/profile.png';

const AboutMe = () => {
  return (
    <div className="about-page-wrapper">
      <Navbar />
      
      <div className="about-container">
        {/* Left Column: Profile & Quick Facts */}
        <div className="about-left">
          <img src={fotoProfil} alt="Arif Athaya Harahap" className="about-profile-img" />
          <h1>Arif Athaya Harahap</h1>
          <h3>Fullstack Developer & AI-ML Engineer</h3>
          
          <div className="about-quick-facts">
            <p><strong>Location:</strong> <FaMapMarkerAlt style={{marginRight: '8px'}}/> Indonesia</p>
            <p><strong>Email:</strong> <FaEnvelope style={{marginRight: '8px'}}/> <a href="mailto:arifathayaharahap@gmail.com" style={{color: '#555', textDecoration: 'none'}}>arifathayaharahap@gmail.com</a></p>
          </div>
          
          <div className="about-socials">
            <a href="https://huggingface.co/treamyracle" target="_blank" rel="noopener noreferrer">
              <SiHuggingface />
            </a>
            <a href="https://github.com/Treamyracle" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/arifathaya/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="about-right">
          
          <div className="about-section">
            <h2>Biography</h2>
            <p>
              When I see a problem, I see a chance to create a solution. That is the root reason behind all my work. 
              I am an Informatics Engineering student bridging the gap between Advanced AI and Full Stack Development. 
              Whether creating itineraries with LLM Agents or managing facility reservations with custom web apps, 
              I take ownership of the process from concept to live deployment. I build to solve, and I aim to lead.
            </p>
          </div>

          <div className="about-section">
            <h2>Skills & Expertise</h2>
            <div className="skills-container">
              <span className="skill-tag">React.js</span>
              <span className="skill-tag">Node.js</span>
              <span className="skill-tag">Next.js</span>
              <span className="skill-tag">Python</span>
              <span className="skill-tag">Go</span>
              <span className="skill-tag">Machine Learning</span>
              <span className="skill-tag">NLP (IndoBERT)</span>
              <span className="skill-tag">LLM Agents</span>
              <span className="skill-tag">Model Fine-Tuning (CPT/SFT)</span>
              <span className="skill-tag">AI Architecture</span>
              <span className="skill-tag">Tailwind CSS</span>
              <span className="skill-tag">Docker</span>
              <span className="skill-tag">Git / GitHub</span>
            </div>
          </div>

          <div className="about-section">
            <h2>Experience / Focus Areas</h2>
            <ul className="experience-list">
              <li className="experience-item">
                <h4>AI & Machine Learning</h4>
                <span>Natural Language Processing & Generative AI</span>
                <p>
                  Developed state-of-the-art Indonesian NLP models, including the IndoBERT NER Gold model 
                  with 300+ monthly downloads on HuggingFace. Active in creating agentic workflows using 
                  Large Language Models.
                </p>
              </li>
              <li className="experience-item">
                <h4>Full Stack Web Development</h4>
                <span>Modern JavaScript Ecosystems & Go</span>
                <p>
                  Built and deployed numerous scalable applications ranging from university facility 
                  reservation systems (FilkomReserV) to AI-powered document analysis platforms (DocLens).
                </p>
              </li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
