import React, { useState, useEffect, useRef } from "react";
import "../roomtemp-dashboard.css"; // sesuaikan path jika perlu

const DEFAULT_API = "https://esp-32-room-temp.vercel.app/api/latest";

const RoomTempDashboard = ({ apiUrl = DEFAULT_API, pollInterval = 2000 }) => {
  const [temp, setTemp] = useState(null);
  const [hum, setHum] = useState(null);
  const [ts, setTs] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | ok | error | loading
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    let timer = null;

    const fetchData = async () => {
      setStatus("loading");
      try {
        const res = await fetch(apiUrl, { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const j = await res.json();
        if (!j || !j.ok) {
          setStatus("error");
          return;
        }
        setTemp(Number(j.temp));
        setHum(Number(j.hum));
        setTs(j.ts || Date.now());
        setStatus("ok");
      } catch (err) {
        /* eslint-disable no-console */
        console.error("rt: fetch error:", err);
        /* eslint-enable no-console */
        setStatus("error");
      }
    };

    // initial fetch immediately, then poll
    fetchData();
    timer = setInterval(fetchData, pollInterval);

    return () => {
      mounted.current = false;
      if (timer) clearInterval(timer);
    };
  }, [apiUrl, pollInterval]);

  const formattedTemp = temp === null || Number.isNaN(temp) ? "--.-" : temp.toFixed(1);
  const formattedHum = hum === null || Number.isNaN(hum) ? "--.-" : hum.toFixed(1);
  const formattedTs = ts ? new Date(ts).toLocaleString() : "--";

  return (
    <div className="rt-dashboard-container" role="region" aria-label="Room Temperature Dashboard">
      <header className="rt-header">
        <div className="rt-title-block">
          <h1 className="rt-title">Room Temp</h1>
          <p className="rt-subtitle">Realtime temperature &amp; humidity</p>
        </div>

        <div className={`rt-status-pill rt-status-${status}`}>
          <span className="rt-status-dot" aria-hidden="true" />
          <span className="rt-status-text">
            {status === "loading" && "Loading"}
            {status === "ok" && "Connected"}
            {status === "error" && "Disconnected"}
            {status === "idle" && "Idle"}
          </span>
        </div>
      </header>

      <main className="rt-card">
        <section className="rt-main-row">
          <div className="rt-temp-col">
            <div className="rt-temp-label">Temperature</div>
            <div className="rt-temp-value">
              {formattedTemp} <span className="rt-temp-unit">°C</span>
            </div>
            <div className="rt-meta">
              Updated: <span className="rt-meta-strong">{formattedTs}</span>
            </div>
          </div>

          <div className="rt-divider" />

          <div className="rt-hum-col">
            <div className="rt-hum-label">Humidity</div>
            <div className="rt-hum-value">
              {formattedHum} <span className="rt-hum-unit">%</span>
            </div>

            <div className="rt-hum-bar-wrapper" aria-hidden="true">
              <div className="rt-hum-bar">
                <div
                  className="rt-hum-bar-fill"
                  style={{ width: `${Math.max(0, Math.min(100, hum || 0))}%` }}
                />
              </div>
              <div className="rt-hum-caption">Relative</div>
            </div>
          </div>
        </section>

        {status === "error" && (
          <div className="rt-error-note" role="alert">
            Gagal memuat data — periksa koneksi atau server.
          </div>
        )}

        <footer className="rt-footer">
          <small>
            Data diambil tiap {pollInterval / 1000}s — API:{" "}
            <span className="rt-footer-api">{apiUrl}</span>
          </small>
        </footer>
      </main>
    </div>
  );
};

export default RoomTempDashboard;
