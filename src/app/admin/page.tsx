import { FC } from 'react'
import AttendanceDashboard from '../components/admin/admin-dashboard'

interface pageProps {
  
}

const page: FC<pageProps> = ({}) => {
  return <div>
    <AttendanceDashboard />
  </div>
}

export default page