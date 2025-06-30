import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../constant';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import dayjs from 'dayjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [monthlyData, setMonthlyData] = useState({});

  useEffect(() => {
    axios.get(`${API_URL}/tickets`)
      .then(res => {
        const grouped = res.data.reduce((acc, ticket) => {
          const month = dayjs(ticket.assign_at).format('MMMM');
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});
        setMonthlyData(grouped);
      })
      .catch(err => console.error('Gagal ambil data tiket', err));
  }, []);

  const labels = Object.keys(monthlyData);
  const values = Object.values(monthlyData);

  const barChartData = {
    labels,
    datasets: [
      {
        label: 'Tiket per bulan',
        data: values,
        backgroundColor: '#4e73df',
        borderRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: false,
        position: 'bottom'
      },
    },
    scales: {
      y: { 
        beginAtZero: true,
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8fafc' }}>
      {/* Header with elegant title */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1" style={{ color: '#2d3748', fontWeight: '600' }}>
            <i className="bi bi-speedometer2 me-2" style={{ color: '#4e73df' }}></i>
            Dashboard Tiket
          </h1>
          <p className="m-0 text-muted" style={{ fontSize: '0.9rem' }}>
            Statistik dan analisis data tiket bulanan
          </p>
        </div>
        <div className="text-muted" style={{ fontSize: '0.9rem' }}>
          <i className="bi bi-calendar me-1"></i>
          {dayjs().format('MMMM YYYY')}
        </div>
      </div>

      {/* Chart Card */}
      <div className="row">
        <div className="col-xl-8 col-lg-10 mx-auto">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-header bg-white border-0 py-3" style={{ borderRadius: '12px 12px 0 0' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="m-0" style={{ color: '#2d3748', fontWeight: '600' }}>
                  <i className="bi bi-bar-chart-line me-2" style={{ color: '#4e73df' }}></i>
                  Statistik Tiket Bulanan
                </h5>
                <span className="badge bg-light text-primary" style={{ fontWeight: '500' }}>
                  Tahun {dayjs().format('YYYY')}
                </span>
              </div>
            </div>
            <div className="card-body px-4 py-3">
              <div style={{ height: '300px', position: 'relative' }}>
                <Bar 
                  data={barChartData} 
                  options={{
                    ...chartOptions,
                    plugins: {
                      tooltip: {
                        backgroundColor: '#4e73df',
                        titleFont: { weight: '600' },
                        padding: 10,
                        cornerRadius: 8
                      }
                    }
                  }} 
                />
              </div>
            </div>
            <div className="card-footer bg-white border-0 text-end py-3" style={{ borderRadius: '0 0 12px 12px', fontSize: '0.85rem' }}>
              <span className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Data diperbarui: {dayjs().format('DD MMM YYYY HH:mm')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Boxes - Optional */}
      <div className="row mt-4 justify-content-center">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow-sm h-100 py-2" style={{ borderRadius: '10px' }}>
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <i className="bi bi-ticket-detailed text-primary" style={{ fontSize: '1.8rem' }}></i>
                </div>
                <div className='d-flex flex-column justify-content-center text-center'>
                  <div className="text-xs text-center font-weight-bold text-primary text-uppercase mb-1">
                    Total Tiket Bulan Ini
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {Object.values(monthlyData).reduce((a, b) => a + b, 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}