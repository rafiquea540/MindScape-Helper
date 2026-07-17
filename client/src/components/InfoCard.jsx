import { Coffee, Users } from 'lucide-react'
import React from 'react'

const InfoCard = ({ title, value, icon: Icon, buttonText, onClick, trend }) => {
  return (
    <div className='bg-white p-6 rounded-lg shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300 h-64 flex flex-col justify-between'>
      <div>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold text-green-800 truncate'>
            {title}
          </h2>
          <div className='p-3 bg-green-100 rounded-full'>
            <Icon size={24} className='text-green-600' />
          </div>
        </div>
        <p className='text-4xl font-bold text-green-600 mb-2'>{value}</p>
        {trend && (
          <p
            className={`text-sm ${
              trend.type === 'increase' ? 'text-green-500' : 'text-red-500'
            } mb-4`}
          >
            {trend.type === 'increase' ? '↑' : '↓'} {trend.value}% from last{' '}
            {trend.period}
          </p>
        )}
      </div>
      <button
        onClick={onClick}
        className='w-full mt-auto bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300'
      >
        {buttonText}
      </button>
    </div>
  )
}

// Example usage
const ExampleUsage = () => (
  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
    <InfoCard
      title='Patients'
      value='187'
      icon={Users}
      buttonText='View All Patients'
      onClick={() => console.log('View all patients')}
      trend={{ type: 'increase', value: 12, period: 'month' }}
    />
    <InfoCard
      title='Coffee Consumed'
      value='42'
      icon={Coffee}
      buttonText='Order More Coffee'
      onClick={() => console.log('Order more coffee')}
      trend={{ type: 'decrease', value: 5, period: 'week' }}
    />
  </div>
)

export default InfoCard
