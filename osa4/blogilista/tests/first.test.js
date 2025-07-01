const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
    }
    
  ]
  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
  test('list has more than one blog', () => {
  const manyblogs = [
   {
      title: 'Big blogger party',
      author: 'John Testman',
      likes: 7
    },
    {
      title: 'Small blogger party',
      author: 'John Testman',
      likes: 7
    },
  ]
  const result = listHelper.totalLikes(manyblogs)
  assert.strictEqual(result, 14)
})})

describe('favorite blog', () => {
  const blogs = [
    {
      title: 'Big blogger party',
      author: 'John Testman',
      likes: 7
    },
    {
      title: 'Small blogger party',
      author: 'John Testman',
      likes: 7
    },
    {
      title: 'Another blog',
      author: 'Mary',
      likes: 3
    }
  ]

  test('return most liked blog', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, {
      title: 'Big blogger party',
      author: 'John Testman',
      likes: 7
    })
  })
})

describe('most blogs', () => {
  const blogs = [
    {
      title: 'Big blogger party',
      author: 'John Testman',
      likes: 7
    },
    {
      title: 'Small blogger party',
      author: 'John Testman',
      likes: 7
    },
    {
      title: 'Another blog',
      author: 'Mary',
      likes: 3
    }
  ]
  test('returns author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: 'John Testman',
      blogs: 2
    })
  })
})

describe('most likes', () => {
  const blogs = [
  {
      title: 'Big blogger party',
      author: 'John Testman',
      likes: 8
    },
    {
      title: 'Small blogger party',
      author: 'John Testman',
      likes: 7
    },
    {
      title: 'Another blog',
      author: 'Mary',
      likes: 3
    }
     ,{
      title: 'Another blog2',
      author: 'Mary',
      likes: 7
    }
  ]

  test('blogger with most likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
      author: 'John Testman',
      likes: 15
    })
  })
})

