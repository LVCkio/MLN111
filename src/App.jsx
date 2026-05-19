// App.jsx
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import StoryBook from "@pages/StoryBook/PhilosophyStoryBook";
import HomePage from "@layout/mainLayout"; // Layout cha
import Home from "@pages/Home";
import About from "@pages/About/layoutSection";
import Chapters from "@pages/Chapters";
import Quiz from "@pages/Quiz/quizLayout";
import Resources from "@pages/Resources";
import QuizTestPage from "@pages/Quiz/TestModal/QuizTestPage";
import AiAppendix from "@pages/AiAppendix";
// import Faqs from "@pages/HomePage/Faqs";
import endPoint from "@routes/routes";

const router = createBrowserRouter([
  {
    path: endPoint.HOMEPAGE,
    element: <HomePage />, // layout cha
    children: [
      { index: true, element: <Home /> }, // trang chủ
      { path: endPoint.ABOUT, element: <About /> },
      { path: endPoint.CHAPTERS, element: <Chapters /> },
      { path: endPoint.QUIZ, element: <Quiz /> },
      { path: endPoint.RESOURCES, element: <Resources /> },
      {
        path: endPoint.STORYBOOK,
        element: <StoryBook />,
      },
      { path: endPoint.AI_APPENDIX, element: <AiAppendix /> },
    ],
  },
  {
    path: endPoint.QUIZTEST,
    element: <QuizTestPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
