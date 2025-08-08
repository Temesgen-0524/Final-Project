import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Calendar, MessageSquare, Newspaper, ArrowRight } from 'lucide-react'
import axios from 'axios'

const Home = () => {
  const [stats, setStats] = useState({})
  const [latestPosts, setLatestPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, postsRes] = await Promise.all([
        axios.get('/api/stats'),
        axios.get('/api/posts?limit=3')
      ])
      setStats(statsRes.data)
      setLatestPosts(postsRes.data.slice(0, 3))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl">
        <h1 className="text-5xl font-bold mb-6">Welcome to DBU Student Union</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Your gateway to student life, clubs, elections, and campus activities. 
          Connect, participate, and make your voice heard.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/clubs" className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Explore Clubs
          </Link>
          <Link to="/elections" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
            View Elections
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-gray-800">{stats.totalStudents || 0}</h3>
          <p className="text-gray-600">Active Students</p>
        </div>
        <div className="card text-center">
          <MessageSquare className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-gray-800">{stats.totalClubs || 0}</h3>
          <p className="text-gray-600">Student Clubs</p>
        </div>
        <div className="card text-center">
          <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-gray-800">{stats.activeElections || 0}</h3>
          <p className="text-gray-600">Active Elections</p>
        </div>
        <div className="card text-center">
          <Newspaper className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-gray-800">{stats.totalPosts || 0}</h3>
          <p className="text-gray-600">News & Updates</p>
        </div>
      </section>

      {/* Latest Announcements */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Latest Announcements</h2>
          <Link 
            to="/latest-news" 
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <div key={post._id} className="card hover:shadow-lg transition-shadow">
                {post.image && (
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    post.type === 'Event' ? 'bg-blue-100 text-blue-800' :
                    post.type === 'News' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {post.type}
                  </span>
                  {post.important && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                      Important
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{formatDate(post.date)}</span>
                  {post.location && <span>{post.location}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Announcements Yet</h3>
            <p className="text-gray-500">Check back later for the latest news and updates.</p>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="bg-gray-100 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/clubs" className="card hover:shadow-lg transition-shadow text-center">
            <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Join a Club</h3>
            <p className="text-gray-600">Discover and join student clubs that match your interests</p>
          </Link>
          <Link to="/elections" className="card hover:shadow-lg transition-shadow text-center">
            <Calendar className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Vote in Elections</h3>
            <p className="text-gray-600">Participate in student government elections</p>
          </Link>
          <Link to="/complaints" className="card hover:shadow-lg transition-shadow text-center">
            <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Submit Feedback</h3>
            <p className="text-gray-600">Share your concerns and suggestions with the administration</p>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home