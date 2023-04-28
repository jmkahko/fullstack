const PersonForm = ({ onSubmit, value, onChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={value[0]} onChange={onChange[0]}/>
      </div>
      <div>
        number: <input value={value[1]} onChange={onChange[1]}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm