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

  export default Course