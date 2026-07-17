import { Search, Sliders } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DoctorCard from '../components/DoctorCard'
import Empty from '../components/Empty'
import Footer from '../components/Footer'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import fetchData from '../helper/apiCall'
import { setLoading } from '../redux/reducers/rootSlice'

const Doctors = () => {
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedFeeRange, setSelectedFeeRange] = useState('')
  const [availableSpecialties, setAvailableSpecialties] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.root)

  const fetchAllDocs = async () => {
    dispatch(setLoading(true))
    try {
      const data = await fetchData(
        `http://localhost:8800/api/doctor/getalldoctors`
      )
      setDoctors(data)
      setFilteredDoctors(data)

      // Extract unique specialties from the data
      const specialties = [
        ...new Set(data.map((doc) => doc.specialization)),
      ].filter(Boolean)
      setAvailableSpecialties(['All Specialties', ...specialties])
    } catch (error) {
      console.error('Error fetching doctors:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    fetchAllDocs()
  }, [])

  useEffect(() => {
    let result = [...doctors]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (doctor) =>
          doctor.userId?.firstname
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          doctor.userId?.lastname
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          doctor.specialization
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          doctor.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply specialty filter
    if (selectedSpecialty && selectedSpecialty !== 'All Specialties') {
      result = result.filter(
        (doctor) => doctor.specialization === selectedSpecialty
      )
    }

    // Apply fee range filter
    if (selectedFeeRange) {
      const [min, max] = selectedFeeRange.split('-').map(Number)
      if (selectedFeeRange === '2000+') {
        result = result.filter((doctor) => doctor.fees >= 2000)
      } else {
        result = result.filter(
          (doctor) => doctor.fees >= min && doctor.fees <= max
        )
      }
    }

    setFilteredDoctors(result)
  }, [searchTerm, selectedSpecialty, selectedFeeRange, doctors])

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Navbar />
      <main className='flex-grow'>
        {loading ? (
          <Loading />
        ) : (
          <section className='container mx-auto px-4 py-8'>
            <div className='max-w-7xl mx-auto'>
              <div className='flex flex-col md:flex-row justify-between items-center mb-8'>
                <h2 className='text-3xl font-bold text-gray-800 mb-4 md:mb-0'>
                  Find Your Doctor
                </h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className='flex items-center gap-2 px-4 py-2 text-gray-600 bg-white rounded-lg shadow-sm hover:bg-gray-50 md:hidden'
                >
                  <Sliders size={20} />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>

              <div
                className={`space-y-4 md:space-y-0 md:flex md:gap-4 mb-6 ${
                  showFilters ? 'block' : 'hidden md:flex'
                }`}
              >
                {/* Search Bar */}
                <div className='relative flex-grow'>
                  <Search
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                    size={20}
                  />
                  <input
                    type='text'
                    placeholder='Search by name or specialty'
                    className='w-full pl-10 pr-4 py-3 border rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Specialty Filter */}
                <select
                  className='w-full md:w-48 px-4 py-3 border rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer'
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  {availableSpecialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <div className='text-gray-600 mb-6'>
                Found {filteredDoctors.length} doctor
                {filteredDoctors.length !== 1 ? 's' : ''}
              </div>

              {/* Doctors Grid */}
              {filteredDoctors.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {filteredDoctors.map((doctor) => (
                    <DoctorCard ele={doctor} key={doctor._id} />
                  ))}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center py-12'>
                  <Empty />
                  <p className='mt-4 text-gray-600'>
                    No doctors found matching your criteria
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Doctors
