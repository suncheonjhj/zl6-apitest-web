"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function Page() {
  const [stations, setStations] = useState([]);
  const [stationId, setStationId] = useState("");
  const [latest, setLatest] = useState(null);
  const [err, setErr] = useState("");

  async function loadStations() {
    setErr("");
    const r = await fetch(`${API_BASE}/api/stations`);
    if (!r.ok) throw new Error(`stations failed: ${r.status}`);
    const data = await r.json();
    const list = Array.isArray(data) ? data : (data.stations || data.items || []);
    setStations(list);
    if (list[0]?.id) setStationId(String(list[0].id));
  }

  async function loadLatest(id) {
    if (!id) return;
    setErr("");
    const r = await fetch(`${API_BASE}/api/latest?station_id=${encodeURIComponent(id)}`);
    if (!r.ok) throw new Error(`latest failed: ${r.status}`);
    const data = await r.json();
    setLatest(data);
  }

  useEffect(() => {
    (async () => {
      try {
        await loadStations();
      } catch (e) {
        setErr(String(e?.message || e));
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await loadLatest(stationId);
      } catch (e) {
        setErr(String(e?.message || e));
      }
    })();
  }, [stationId]);

  const stationOptions = useMemo(() => {
    return stations.map((s, idx) => ({
      id: String(s.id ?? s.station_id ?? s.uuid ?? idx),
      name: String(s.name ?? s.title ?? s.station_name ?? `Station ${idx + 1}`)
    }));
  }, [stations]);

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <h1 style={{ margin: "8px 0 16px" }}>zl6-apitest</h1>

      <section style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ fontWeight: 600 }}>Station</label>
          <select
            value={stationId}
            onChange={(e) => setStationId(e.target.value)}
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", minWidth: 260 }}
          >
            {stationOptions.map((o) => (
              <option key={o.id} value={o.id}>{o.name} ({o.id})</option>
            ))}
          </select>

          <button
            onClick={() => loadLatest(stationId).catch((e) => setErr(String(e?.message || e)))}
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer", background: "#fff" }}
          >
            새로고침
          </button>

          <span style={{ color: "#666" }}>
            (데이터는 1시간 간격 업데이트 기준)
          </span>
        </div>

        {err ? (
          <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "#fff4f4", border: "1px solid #ffd3d3" }}>
            오류: {err}
          </div>
        ) : null}

        <div style={{ marginTop: 16 }}>
          <h3 style={{ margin: "0 0 8px" }}>Latest</h3>
          <pre style={{ margin: 0, padding: 12, borderRadius: 12, background: "#0b1020", color: "white", overflow: "auto" }}>
{JSON.stringify(latest, null, 2)}
          </pre>
        </div>
      </section>
    </main>
  );
}
