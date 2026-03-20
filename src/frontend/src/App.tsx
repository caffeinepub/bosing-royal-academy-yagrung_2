import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import About from "./pages/About";
import Academics from "./pages/Academics";
import Achievements from "./pages/Achievements";
import AdminPanel from "./pages/AdminPanel";
import Admissions from "./pages/Admissions";
import ChairmansDeskPage from "./pages/ChairmansDeskPage";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import FAQs from "./pages/FAQs";
import Gallery from "./pages/Gallery";
import Home from "./pages/Home";
import ManagingDirectorsMessage from "./pages/ManagingDirectorsMessage";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import PrincipalsMessage from "./pages/PrincipalsMessage";
import Staff from "./pages/Staff";
import StudentLife from "./pages/StudentLife";

export type Route =
  | "/"
  | "/about"
  | "/principals-message"
  | "/chairmans-desk"
  | "/managing-directors-message"
  | "/staff"
  | "/academics"
  | "/admissions"
  | "/news"
  | "/news/detail"
  | "/events"
  | "/gallery"
  | "/student-life"
  | "/achievements"
  | "/contact"
  | "/faqs"
  | "/admin";

export function navigate(to: string) {
  window.location.hash = to;
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

function getRoute(): string {
  const hash = window.location.hash.replace("#", "") || "/";
  return hash;
}

export default function App() {
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const handler = () => setRoute(getRoute());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const renderPage = () => {
    if (route === "/" || route === "") return <Home />;
    if (route === "/about") return <About />;
    if (route === "/principals-message") return <PrincipalsMessage />;
    if (route === "/chairmans-desk") return <ChairmansDeskPage />;
    if (route === "/managing-directors-message")
      return <ManagingDirectorsMessage />;
    if (route === "/staff") return <Staff />;
    if (route === "/academics") return <Academics />;
    if (route === "/admissions") return <Admissions />;
    if (route === "/news") return <News />;
    if (route.startsWith("/news/"))
      return <NewsDetail id={route.replace("/news/", "")} />;
    if (route === "/events") return <Events />;
    if (route === "/gallery") return <Gallery />;
    if (route === "/student-life") return <StudentLife />;
    if (route === "/achievements") return <Achievements />;
    if (route === "/contact") return <Contact />;
    if (route === "/faqs") return <FAQs />;
    if (route === "/admin") return <AdminPanel />;
    return <Home />;
  };

  return <Layout currentRoute={route}>{renderPage()}</Layout>;
}
