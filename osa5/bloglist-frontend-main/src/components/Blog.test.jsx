import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

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


//test3
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