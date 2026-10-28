import React from "react";

const CoursePart = ({ part }) => {
  return (
    <div>
      <li>
        {part.name} {part.exercises}
      </li>
    </div>
  );
};

export default CoursePart;
