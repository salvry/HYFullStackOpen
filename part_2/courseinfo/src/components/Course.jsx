import React from "react";
import Header from "./Header";
import Content from "./Content";
import Total from "./Total";

const Course = ({ course }) => {
  const exerciseCount = (accumulator, currentValue) =>
    accumulator + currentValue.exercises;

  return (
    <div>
      <Header header={course.name} />
      <Content parts={course.parts} />
      <Total total={course.parts.reduce(exerciseCount, 0)} />
    </div>
  );
};

export default Course;
