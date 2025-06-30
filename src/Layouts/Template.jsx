import Navbar from '../Components/Navbar';
import { Outlet } from 'react-router-dom';

export default function Template() {
  return (
    <div className="d-flex">
      <Navbar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: '200px' }}>
        <Outlet />
      </div>
    </div>
  );
}
