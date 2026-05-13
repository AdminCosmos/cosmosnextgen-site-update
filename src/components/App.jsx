import { Routes, Route } from "react-router-dom";

import Navbar from "./Navbar.jsx";
import Hero from "./Hero.jsx";
import About from "./About.jsx";
import Services from "./Services.jsx";
import WhyUs from "./WhyUs.jsx";
import Contact from "./Contact.jsx";
import Careers from "./Careers.jsx";
import Footer from "./Footer.jsx";
import Training from "./Training.jsx";
import ScrollToHash from "./ScrollToHash.jsx";

function Home() {
    return (
        <>
            <Hero />
            <About />
            <Services />
            <WhyUs />
            <Contact />
            <Careers />
        </>
    );
}

export default function App() {
    return (
        <>
            <Navbar />
            <ScrollToHash />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/training" element={<Training />} />
            </Routes>
            <Footer />
        </>
    );
}
