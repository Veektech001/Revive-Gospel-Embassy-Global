import { createRoot } from "react-dom/client"
import Nav from "./components/Navbar";
import Hero from "./components/Hero";
import Welcome from "./components/welcome";
import Footer from "./components/footer";
import Homepage from "./Pages/Home";
import Give from "./Pages/Give";
import AboutPage from "./Pages/About";
import Prayer from "./components/prayers";
import Missionandvision from "./components/Mission-and-Vision";
import Recent from "./components/RecentMessage";
import SermonPage from "./Pages/SermonsPage";
import Subscribe from "./components/subscribe";
import Form from "./components/form";
const root = createRoot(document.getElementById("root"))

function App() {
  return (
    <>
    <Homepage />
    </>
    
  );
}

export default App;