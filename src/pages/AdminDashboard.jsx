import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Newspaper, 
  Plus,
  Edit,
  Trash2,
  Check,
  X
} from 'lucide-react'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({})
  const [posts, setPosts] = useState([])
  const [elections, setElections] = useState([])
  const [clubs, setClubs] = useState([])
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [showPostForm, setShowPostForm] = useState(false)
  const [showElectionForm, setShowElectionForm] = useState(false)
  const [showClubForm, setShowClubForm] = useState(false)
  const [showCandidateForm, setShowCandidateForm] = useState(false)
  const [selectedElection, setSelectedElection] = useState(null)

  const [postForm, setPostForm] = useState({
    type: 'News',
    title: '',
    content: '',
    date: '',
    category: '',
    image: '',
    location: '',
    time: '',
    important: false
  })

  const [electionForm, setElectionForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    eligibleVoters: ''
  })

  const [clubForm, setClubForm] = useState({
    name: '',
    category: '',
    description: '',
    image: '',
    founded: ''
  })

  const [candidateForm, setCandidateForm] = useState({
    name: '',
    position: '',
    department: '',
    year: '',
    studentId: '',
    profileImage: '',
    platform: '',
    bio: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, postsRes, electionsRes, clubsRes, complaintsRes] = await Promise.all([
        axios.get('/api/stats'),
        axios.get('/api/posts'),
        axios.get('/api/elections'),
        axios.get('/api/clubs'),
        axios.get('/api/complaints')
      ])
      
      setStats(statsRes.data)
      setPosts(postsRes.data)
      setElections(electionsRes.data)
      setClubs(clubsRes.data)
      setComplaints(complaintsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Error loading dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/posts', postForm)
      toast.success('Post created successfully!')
      setShowPostForm(false)
      setPostForm({
        type: 'News',
        title: '',
        content: '',
        date: '',
        category: '',
        image: '',
        location: '',
        time: '',
        important: false
      })
      fetchData()
    } catch (error) {
      toast.error('Error creating post')
    }
  }

  const handleCreateElection = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/elections', {
        ...electionForm,
        eligibleVoters: parseInt(electionForm.eligibleVoters),
        candidates: []
      })
      toast.success('Election created successfully!')
      setShowElectionForm(false)
      setElectionForm({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        eligibleVoters: ''
      })
      fetchData()
    } catch (error) {
      toast.error('Error creating election')
    }
  }

  const handleCreateClub = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/clubs', clubForm)
      toast.success('Club created successfully!')
      setShowClubForm(false)
      setClubForm({
        name: '',
        category: '',
        description: '',
        image: '',
        founded: ''
      })
      fetchData()
    } catch (error) {
      toast.error('Error creating club')
    }
  }

  const handleAddCandidate = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`/api/elections/${selectedElection}/candidates`, {
        ...candidateForm,
        platform: candidateForm.platform.split(',').map(p => p.trim())
      })
      toast.success('Candidate added successfully!')
      setShowCandidateForm(false)
      setCandidateForm({
        name: '',
        position: '',
        department: '',
        year: '',
        studentId: '',
        profileImage: '',
        platform: '',
        bio: ''
      })
      setSelectedElection(null)
      fetchData()
    } catch (error) {
      toast.error('Error adding candidate')
    }
  }

  const handleUpdateElectionStatus = async (electionId, status) => {
    try {
      await axios.patch(`/api/elections/${electionId}/status`, { status })
      toast.success(`Election status updated to ${status}`)
      fetchData()
    } catch (error) {
      toast.error('Error updating election status')
    }
  }

  const handleApproveJoinRequest = async (clubId, requestId, status) => {
    try {
      await axios.patch(`/api/clubs/${clubId}/join-requests/${requestId}`, { status })
      toast.success(`Join request ${status}`)
      fetchData()
    } catch (error) {
      toast.error('Error updating join request')
    }
  }

  const handleUpdateComplaintStatus = async (complaintId, status) => {
    try {
      await axios.patch(`/api/complaints/${complaintId}/status`, { status })
      toast.success('Complaint status updated')
      fetchData()
    } catch (error) {
      toast.error('Error updating complaint status')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: Users },
            { id: 'posts', name: 'Posts', icon: Newspaper },
            { id: 'elections', name: 'Elections', icon: Calendar },
            { id: 'clubs', name: 'Clubs', icon: MessageSquare },
            { id: 'complaints', name: 'Complaints', icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card text-center">
            <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800">{stats.totalStudents || 0}</h3>
            <p className="text-gray-600">Total Students</p>
          </div>
          <div className="card text-center">
            <MessageSquare className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800">{stats.totalClubs || 0}</h3>
            <p className="text-gray-600">Total Clubs</p>
          </div>
          <div className="card text-center">
            <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800">{stats.activeElections || 0}</h3>
            <p className="text-gray-600">Active Elections</p>
          </div>
          <div className="card text-center">
            <Newspaper className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-gray-800">{stats.pendingComplaints || 0}</h3>
            <p className="text-gray-600">Pending Complaints</p>
          </div>
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Manage Posts</h2>
            <button
              onClick={() => setShowPostForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Post</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post._id} className="card">
                {post.image && (
                  <img src={post.image} alt={post.title} className="w-full h-32 object-cover rounded-lg mb-4" />
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
                <h3 className="font-semibold text-gray-800 mb-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create Post Modal */}
          {showPostForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Create New Post</h3>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={postForm.type}
                      onChange={(e) => setPostForm({...postForm, type: e.target.value})}
                      className="input-field"
                      required
                    >
                      <option value="News">News</option>
                      <option value="Event">Event</option>
                      <option value="Update">Update</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={postForm.title}
                      onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      value={postForm.content}
                      onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                      className="input-field"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={postForm.date}
                      onChange={(e) => setPostForm({...postForm, date: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="url"
                      value={postForm.image}
                      onChange={(e) => setPostForm({...postForm, image: e.target.value})}
                      className="input-field"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={postForm.location}
                      onChange={(e) => setPostForm({...postForm, location: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={postForm.time}
                      onChange={(e) => setPostForm({...postForm, time: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="important"
                      checked={postForm.important}
                      onChange={(e) => setPostForm({...postForm, important: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="important" className="text-sm font-medium text-gray-700">
                      Mark as Important
                    </label>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowPostForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Create Post
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Elections Tab */}
      {activeTab === 'elections' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Manage Elections</h2>
            <button
              onClick={() => setShowElectionForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Election</span>
            </button>
          </div>

          <div className="space-y-4">
            {elections.map((election) => (
              <div key={election._id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{election.title}</h3>
                    <p className="text-gray-600 mt-1">{election.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    election.status === 'Ongoing' ? 'bg-green-100 text-green-800' :
                    election.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {election.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">{new Date(election.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-medium">{new Date(election.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Votes</p>
                    <p className="font-medium">{election.totalVotes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Candidates</p>
                    <p className="font-medium">{election.candidates?.length || 0}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedElection(election._id)
                        setShowCandidateForm(true)
                      }}
                      className="btn-secondary text-sm"
                      disabled={election.status !== 'Pending'}
                    >
                      Add Candidate
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    {election.status === 'Pending' && (
                      <button
                        onClick={() => handleUpdateElectionStatus(election._id, 'Ongoing')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Start Election
                      </button>
                    )}
                    {election.status === 'Ongoing' && (
                      <button
                        onClick={() => handleUpdateElectionStatus(election._id, 'Completed')}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        End Election
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create Election Modal */}
          {showElectionForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Create New Election</h3>
                <form onSubmit={handleCreateElection} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={electionForm.title}
                      onChange={(e) => setElectionForm({...electionForm, title: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={electionForm.description}
                      onChange={(e) => setElectionForm({...electionForm, description: e.target.value})}
                      className="input-field"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="datetime-local"
                      value={electionForm.startDate}
                      onChange={(e) => setElectionForm({...electionForm, startDate: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="datetime-local"
                      value={electionForm.endDate}
                      onChange={(e) => setElectionForm({...electionForm, endDate: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Eligible Voters</label>
                    <input
                      type="number"
                      value={electionForm.eligibleVoters}
                      onChange={(e) => setElectionForm({...electionForm, eligibleVoters: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowElectionForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Create Election
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add Candidate Modal */}
          {showCandidateForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Add Candidate</h3>
                <form onSubmit={handleAddCandidate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={candidateForm.name}
                      onChange={(e) => setCandidateForm({...candidateForm, name: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input
                      type="text"
                      value={candidateForm.position}
                      onChange={(e) => setCandidateForm({...candidateForm, position: e.target.value})}
                      className="input-field"
                      placeholder="e.g., President, Vice President"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={candidateForm.department}
                      onChange={(e) => setCandidateForm({...candidateForm, department: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <select
                      value={candidateForm.year}
                      onChange={(e) => setCandidateForm({...candidateForm, year: e.target.value})}
                      className="input-field"
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="5th Year">5th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                    <input
                      type="text"
                      value={candidateForm.studentId}
                      onChange={(e) => setCandidateForm({...candidateForm, studentId: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
                    <input
                      type="url"
                      value={candidateForm.profileImage}
                      onChange={(e) => setCandidateForm({...candidateForm, profileImage: e.target.value})}
                      className="input-field"
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform (comma-separated)</label>
                    <textarea
                      value={candidateForm.platform}
                      onChange={(e) => setCandidateForm({...candidateForm, platform: e.target.value})}
                      className="input-field"
                      rows="2"
                      placeholder="Improve student services, Better facilities, More events"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={candidateForm.bio}
                      onChange={(e) => setCandidateForm({...candidateForm, bio: e.target.value})}
                      className="input-field"
                      rows="2"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCandidateForm(false)
                        setSelectedElection(null)
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Add Candidate
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Clubs Tab */}
      {activeTab === 'clubs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Manage Clubs</h2>
            <button
              onClick={() => setShowClubForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Club</span>
            </button>
          </div>

          <div className="space-y-4">
            {clubs.map((club) => (
              <div key={club._id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    {club.image && (
                      <img src={club.image} alt={club.name} className="w-16 h-16 object-cover rounded-lg" />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{club.name}</h3>
                      <p className="text-gray-600">{club.category}</p>
                      <p className="text-sm text-gray-500">{club.members?.length || 0} members</p>
                    </div>
                  </div>
                </div>
                
                {club.joinRequests && club.joinRequests.filter(req => req.status === 'pending').length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800 mb-2">Pending Join Requests</h4>
                    <div className="space-y-2">
                      {club.joinRequests
                        .filter(req => req.status === 'pending')
                        .map((request) => (
                          <div key={request._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div>
                              <p className="font-medium">{request.user?.name}</p>
                              <p className="text-sm text-gray-600">{request.department} - {request.year}</p>
                              {request.reason && <p className="text-sm text-gray-500">{request.reason}</p>}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApproveJoinRequest(club._id, request._id, 'approved')}
                                className="bg-green-600 text-white p-1 rounded hover:bg-green-700"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleApproveJoinRequest(club._id, request._id, 'rejected')}
                                className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Create Club Modal */}
          {showClubForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Create New Club</h3>
                <form onSubmit={handleCreateClub} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={clubForm.name}
                      onChange={(e) => setClubForm({...clubForm, name: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={clubForm.category}
                      onChange={(e) => setClubForm({...clubForm, category: e.target.value})}
                      className="input-field"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Academic">Academic</option>
                      <option value="Sports">Sports</option>
                      <option value="Arts">Arts</option>
                      <option value="Technology">Technology</option>
                      <option value="Social">Social</option>
                      <option value="Cultural">Cultural</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={clubForm.description}
                      onChange={(e) => setClubForm({...clubForm, description: e.target.value})}
                      className="input-field"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="url"
                      value={clubForm.image}
                      onChange={(e) => setClubForm({...clubForm, image: e.target.value})}
                      className="input-field"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Founded Date</label>
                    <input
                      type="date"
                      value={clubForm.founded}
                      onChange={(e) => setClubForm({...clubForm, founded: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowClubForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Create Club
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Complaints Tab */}
      {activeTab === 'complaints' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Complaints</h2>
          
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div key={complaint._id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{complaint.title}</h3>
                    <p className="text-gray-600 mt-1">{complaint.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>By: {complaint.submittedBy?.name}</span>
                      <span>Category: {complaint.category}</span>
                      <span>Branch: {complaint.branch}</span>
                      <span>Priority: {complaint.priority}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {complaint.status}
                    </span>
                    <select
                      value={complaint.status}
                      onChange={(e) => handleUpdateComplaintStatus(complaint._id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="submitted">Submitted</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>
                
                {complaint.responses && complaint.responses.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-medium text-gray-800 mb-2">Responses</h4>
                    <div className="space-y-2">
                      {complaint.responses.map((response, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <p className="text-gray-700">{response.message}</p>
                            <span className="text-xs text-gray-500">
                              {new Date(response.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">- {response.author}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard