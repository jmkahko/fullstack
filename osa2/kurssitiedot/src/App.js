const Header = ({ course }) => {
  return (
    <div>
      <h1>{course.name}</h1>
    </div>
  )
}

const Content = ({ course }) => {
  return (
    <div>
      {course.parts.map(course => 
        <Part key={course.id} course={course} />
      )}
      <TotalCount course={course} />
    </div>
  )
}

const Part = ({ course }) => (
  <>
    <p>{course.name} {course.exercises}</p>
  </>
)

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
    </div>
  )
}

const TotalCount = ({ course }) => {
  let luku = 0
  course.parts.map(value => {
    luku += value.exercises
  })

  return (
    <b>total of {luku} exercises</b>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'JavaScript',
        exercises: 11,
        id: 4
      }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}

export default App