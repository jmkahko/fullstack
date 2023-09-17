import { useState } from 'react'

const NewBlogForm = ({ createNewBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addNewBlog = (event) => {
    event.preventDefault()

    createNewBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit ={addNewBlog}>
        <div>
          title <input type="text" value={title} name="Title" id="title" onChange={event => setTitle(event.target.value)} />
        </div>
        <div>
          author <input type="text" value={author} name="Author" id="author" onChange={event => setAuthor(event.target.value)} />
        </div>
        <div>
          url <input type="text" value={url} name="Url" id="url" onChange={event => setUrl(event.target.value)} />
        </div>
        <button type="submit" id="createBlogButton">Create</button>
      </form>
    </div>
  )
}

export default NewBlogForm