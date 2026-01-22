export default function Auth({ setIsAuthenticated }) {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Authentication Page</h1>
      <button onClick={() => setIsAuthenticated(true)}>Login</button>
    </div>
  );
}
