import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [flowList, setFlowList] = useState([]);
  // Asumsikan userId = 1 untuk demonstrasi
  const userId = 1;

  useEffect(() => {
    fetch(`/api/flowlist?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setFlowList(data);
      })
      .catch((error) => {
        console.error("Error fetching flow list:", error);
      });
  }, [userId]);

  const handleAdd = () => {
    const newFlow = {
      userId: userId,
      category: "Shopping",
      amount: 100,
      date: "2025-04-04", // format YYYY-MM-DD
    };

    fetch("/api/flowlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFlow),
    })
      .then((res) => res.json())
      .then((data) => {
        setFlowList((prev) => [...prev, data]);
      })
      .catch((error) => {
        console.error("Error adding flow item:", error);
      });
  };

  const handleRemove = (id) => {
    fetch(`/api/flowlist/${id}?userId=${userId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete");
        }
        setFlowList((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error("Error removing flow item:", error);
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button style={styles.addBtn} onClick={handleAdd}>ADD</button>
        <button style={styles.removeBtn} onClick={() => {
          if (flowList.length > 0) {
            handleRemove(flowList[0].id);
          }
        }}>
          REMOVE
        </button>
      </div>
      <div style={styles.mainContent}>
        <div style={styles.leftPanel}>
          <h3>Grafik Pengeluaran</h3>
          <div style={styles.dummyChart}>[ Tempat Chart ]</div>
        </div>
        <div style={styles.rightPanel}>
          <h3>List Penggunaan</h3>
          <ul style={styles.list}>
            {flowList.map((item) => (
              <li key={item.id} style={styles.listItem}>
                {item.category} - Rp {item.amount} - {item.date}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#333',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
  topBar: {
    backgroundColor: '#A31D1D',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'flex-end',
    borderRadius: '0 0 7px 7px',
  },
  addBtn: {
    backgroundColor: 'limegreen',
    border: 'none',
    color: '#fff',
    padding: '0.5rem 1rem',
    marginRight: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  removeBtn: {
    backgroundColor: '#f00',
    border: 'none',
    color: '#fff',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    padding: '1rem',
    gap: '1rem',
    overflowY: 'auto',
  },
  leftPanel: {
    flex: 1,
    backgroundColor: '#eee',
    color: '#000',
    padding: '1rem',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
  },
  rightPanel: {
    flex: 1,
    backgroundColor: '#eee',
    color: '#000',
    padding: '1rem',
    borderRadius: '4px',
    overflowY: 'auto',
  },
  dummyChart: {
    backgroundColor: '#ddd',
    height: '70%',
    marginTop: '1rem',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    marginBottom: '0.5rem',
    padding: '0.5rem',
    borderBottom: '1px solid #ccc',
  },
};

export default Dashboard;
