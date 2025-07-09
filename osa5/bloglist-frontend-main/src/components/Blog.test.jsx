import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import BlogForm from './Blogform'
let blog
let loggedUser

beforeEach(() => {
  blog = {
    title: 'Dealmaker',
    author: 'John testman',
    url: 'https://example.com',
    likes: 5,
    user: { username: 'johnny', name: 'John testman' }
  }
  const loggedUser = { username: 'johnny' }
})

//TEST 1
test('renders blogs title', () => {

  const { container } = render(<Blog blog={blog} loggedUser={loggedUser} />)
  screen.debug()

  const div = container.querySelector('.blog')
  screen.debug(div)

  expect(div).toHaveTextContent('Dealmaker')
  expect(div).not.toHaveTextContent('https://example.com')
  expect(div).not.toHaveTextContent('likes')
})

//TEST 2
test('button pressed, url and likes print', async () => {
  const { container } = render(<Blog blog={blog} loggedUser={loggedUser} />)
  screen.debug()

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const div = container.querySelector('.blog')
  screen.debug(div)

  expect(div).toHaveTextContent('https://example.com')
  expect(div).toHaveTextContent('Likes: 5')
})


//TEST 3
test('liked two times', async () => {
  const mockHandler = vi.fn()
  render(<Blog blog={blog} handleLike={mockHandler} loggedUser={loggedUser} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const button2 = screen.getByText('like')
  await user.click(button2)
  await user.click(button2)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})

//TEST 4
test('createBlog with filled form', async () => {
  const mockHandler = vi.fn()
  const { container } = render(<BlogForm createBlog={mockHandler} />)

  const user = userEvent.setup()
  const inputs = container.querySelectorAll('input')
  const [titleInput, authorInput, urlInput] = inputs

  await user.type(titleInput, 'New Blog')
  await user.type(authorInput, 'Mary 2')
  await user.type(urlInput, 'https://example2.com')

  await user.click(screen.getByText('Create'))

  expect(mockHandler).toHaveBeenCalledTimes(1)
  expect(mockHandler).toHaveBeenCalledWith({
    title: 'New Blog',
    author: 'Mary 2',
    url: 'https://example2.com',
  })
})