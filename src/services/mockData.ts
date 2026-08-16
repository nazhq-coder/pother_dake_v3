const mockData = {
  trips: [
    { id: '1', title: 'Downtown to Airport', subtitle: '45 min · 12 km', fare: '৳ 350', driver: 'Ashraf', status: 'Completed', pickup: 'Downtown', dropoff: 'Airport', time: '2026-08-12 09:00' },
    { id: '2', title: 'City Center to University', subtitle: '20 min · 6 km', fare: '৳ 180', driver: 'Rana', status: 'Scheduled', pickup: 'City Center', dropoff: 'University', time: '2026-08-12 11:30' },
    { id: '3', title: 'Home to Office', subtitle: '15 min · 4 km', fare: '৳ 120', driver: 'Mina', status: 'In Progress', pickup: 'Home', dropoff: 'Office', time: '2026-08-11 08:15' }
  ],
  stats: {
    totalRides: 1245,
    todayRides: 18,
    revenueToday: '৳ 4,520'
  },
  drivers: [
    { id: 'd1', name: 'Ashraf', rating: 4.9, trips: 1200 },
    { id: 'd2', name: 'Rana', rating: 4.6, trips: 320 }
  ]
};

export default mockData;
