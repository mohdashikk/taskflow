const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <aside
          style={{
            width: "220px",
            background: "#111827",
            color: "white",
            padding: "20px",
          }}
        >
          <h2>TaskFlow</h2>

          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>Dashboard</li>
            <li>Tasks</li>
            <li>Projects</li>
          </ul>
        </aside>

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            padding: "24px",
          }}
        >
          {children}
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
