function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <p>Please log in first</p>;

  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <img src={user.picture} alt="Profile" />
      <br />
      <button onClick={() => {
        localStorage.removeItem('user');
        window.location.href = '/';
      }}>Logout</button>
    </div>
  );
}

export default Dashboard;
