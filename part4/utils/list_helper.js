const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const favorite = blogs.reduce((prev, current) => {
    return (prev.likes > current.likes)? prev : current
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

// Exercise 4.6*: Returns the author who has the largest amount of blogs
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorCounts = {}
  blogs.forEach(blog => {
    authorCounts[blog.author] = (authorCounts[blog.author] || 0) + 1
  })

  let maxAuthor = ''
  let maxCount = 0

  for (const author in authorCounts) {
    if (authorCounts[author] > maxCount) {
      maxAuthor = author
      maxCount = authorCounts[author]
    }
  }

  return {
    author: maxAuthor,
    blogs: maxCount
  }
}

// Exercise 4.7*: Returns the author with the highest cumulative like sum
const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authorLikes = {}
  blogs.forEach(blog => {
    authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes
  })

  let maxAuthor = ''
  let maxLikes = 0

  for (const author in authorLikes) {
    if (authorLikes[author] > maxLikes) {
      maxAuthor = author
      maxLikes = authorLikes[author]
    }
  }

  return {
    author: maxAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}