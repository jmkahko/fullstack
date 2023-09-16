import { useState } from 'react'
import '../index.css'

const Blog = ({ blog }) => {
  const [blogVisible, setBlogVisible] = useState(false)

  const blogStyle = {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: blogVisible ? 'none' : '' }
  const showWhenVisible = { display: blogVisible ? '' : 'none' }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        <div>{blog.title} {blog.author} <button onClick={() => setBlogVisible(true)}>view</button></div>
      </div>

      <div style={showWhenVisible} className='blogBackground'>
        <div>{blog.title} {blog.author} <button onClick={() => setBlogVisible(false)}>hide</button></div>
          <div>{blog.url}</div>
          <div>likes {blog.likes} <button>like</button></div>
          <div>{blog.user.name}</div>
      </div>
    </div>
  )
}

export default Blog