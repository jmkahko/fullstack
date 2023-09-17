import { useState } from 'react'
import '../index.css'

const Blog = ({ blog, user, updateBlogLikes, deleteBlog }) => {
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

  const findUser = blog.user.name === undefined ? user.name : blog.user.name

  const updateLikes = ( updateBlog ) => {
    const like = updateBlog.likes + 1
    const blog = { ...updateBlog, likes:like }

    updateBlogLikes(blog)
  }

  const removeButton = () => {
    return (
      <button onClick={() => deleteBlog(blog)}>remove</button>
    )
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        <div>{blog.title} {blog.author} <button onClick={() => setBlogVisible(true)} id="viewBlogButton">view</button></div>
      </div>

      <div style={showWhenVisible} className='blogBackground'>
        <div>{blog.title} {blog.author} <button onClick={() => setBlogVisible(false)}>hide</button></div>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={() => updateLikes(blog)} id="likeBlogButton">like</button></div>
        <div>{findUser}</div>
        <div>{blog.user.username === user.username && removeButton()}</div>
      </div>
    </div>
  )
}

export default Blog