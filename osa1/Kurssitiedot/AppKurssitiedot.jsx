
const App = () => {
 const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const Header = ({course}) => {
  return (
  <div>
  <h1>{course.name}</h1>
  </div>
  )
}

const Content = ({ parts }) => {
  return (
    <div> 
    <Part nimi={parts[0].name} teht={parts[0].exercises} />
    <Part nimi={parts[1].name} teht={parts[1].exercises} />
    <Part nimi={parts[2].name} teht={parts[2].exercises} /> 
    </div>
  )
}

const Total = ({parts}) => {
  return (
  <div>
  <p>Number of exercises {parts[0].exercises + parts[1].exercises + parts[2].exercises}</p>
  </div>
  )
}

const Part = ({nimi, teht}) => {
  return (
  <p> {nimi} {teht} </p> 
)
}
export default App
