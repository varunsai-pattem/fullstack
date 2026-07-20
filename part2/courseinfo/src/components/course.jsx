// Header component: Renders individual course title
const Header = ({ name }) => {
  return (
    <h2>{name}</h2>
  )
}

// Part component: Renders a single part's name and exercise count
const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

// Content component: Dynamically maps the parts array to Part components
const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  )
}

// Total component: Calculates the sum using the.reduce() array helper (Exercise 2.3*)
const Total = ({ parts }) => {
  // s is the accumulator (accumulator starts at 0)
  // p is the current part object in the iteration loop
  const totalExercises = parts.reduce((accumulator, currentPart) => {
    return accumulator + currentPart.exercises
  }, 0)

  return (
    <strong>total of {totalExercises} exercises</strong>
  )
}

// Main Course Component wrapping sub-components
const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course