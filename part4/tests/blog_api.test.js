const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    // Create a default user for testing relationships
    const defaultUser = new User({
      username: 'testadmin',
      passwordHash: 'dummyhash'
    })
    await defaultUser.save()

    const blogObjects = helper.initialBlogs
     .map(blog => new Blog({...blog, user: defaultUser._id }))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('blogs are returned as json', async () => {
    await api
     .get('/api/blogs')
     .expect(200)
     .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier property of blogs is named id', async () => {
    const response = await api.get('/api/blogs')
    const firstBlog = response.body[0]
    assert.ok(firstBlog.id)
    assert.strictEqual(firstBlog._id, undefined)
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data if token is provided', async () => {
      // 1. Create a user and get a valid JWT token
      const userCredentials = { username: 'testuser', password: 'password123' }
      await api.post('/api/users').send(userCredentials)
      const loginResponse = await api.post('/api/login').send(userCredentials)
      const token = loginResponse.body.token

      const newBlog = {
        title: 'Async/Await is elegant',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/'
      }

      await api
       .post('/api/blogs')
       .set('Authorization', `Bearer ${token}`) // Inject auth token header
       .send(newBlog)
       .expect(201)
       .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert.ok(titles.includes('Async/Await is elegant'))
    })

    test('fails with status code 401 Unauthorized if token is missing', async () => {
      const newBlog = {
        title: 'Unauthorized post',
        author: 'Unknown',
        url: 'http://unauthorized.com'
      }

      await api
       .post('/api/blogs')
       .send(newBlog)
       .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('if likes property is missing, it defaults to 0', async () => {
      const userCredentials = { username: 'testuser2', password: 'password123' }
      await api.post('/api/users').send(userCredentials)
      const loginResponse = await api.post('/api/login').send(userCredentials)
      const token = loginResponse.body.token

      const blogWithoutLikes = {
        title: 'Zero Likes Blog',
        author: 'Martin Fowler',
        url: 'http://martinfowler.com'
      }

      const response = await api
       .post('/api/blogs')
       .set('Authorization', `Bearer ${token}`)
       .send(blogWithoutLikes)
       .expect(201)

      assert.strictEqual(response.body.likes, 0)
    })

    test('fails with status code 400 if title or url are missing', async () => {
      const userCredentials = { username: 'testuser3', password: 'password123' }
      await api.post('/api/users').send(userCredentials)
      const loginResponse = await api.post('/api/login').send(userCredentials)
      const token = loginResponse.body.token

      const badBlog = {
        author: 'No Title No Url'
      }

      await api
       .post('/api/blogs')
       .set('Authorization', `Bearer ${token}`)
       .send(badBlog)
       .expect(400)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id and token are valid', async () => {
      const userCredentials = { username: 'creator', password: 'password123' }
      await api.post('/api/users').send(userCredentials)
      const loginResponse = await api.post('/api/login').send(userCredentials)
      const token = loginResponse.body.token

      const blogToSave = {
        title: 'Delete this blog',
        url: 'http://todelete.com'
      }

      const postResponse = await api
       .post('/api/blogs')
       .set('Authorization', `Bearer ${token}`)
       .send(blogToSave)

      const savedBlog = postResponse.body

      await api
       .delete(`/api/blogs/${savedBlog.id}`)
       .set('Authorization', `Bearer ${token}`)
       .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})