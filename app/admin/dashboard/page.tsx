import { Sidebar } from '@/components/ui/sidebar'

const AdminDashboardPage = () => {
  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar />
      <div className='flex-1 p-4'>
        <h1 className='text-2xl font-semibold mb-4'>Admin Dashboard</h1>
        {/* Add your dashboard content here */}
        <p>Welcome to the admin dashboard!</p>
      </div>
    </div>
  )
}

export default AdminDashboardPage
