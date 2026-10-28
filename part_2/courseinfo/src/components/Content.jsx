import React from "react";
import CoursePart from "./CoursePart";

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => (
        <CoursePart key={part.id} part={part} />
      ))}
    </div>
  );
};

export default Content;
