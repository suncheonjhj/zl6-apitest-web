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
    loadStations().catch(e => setErr(String(e)));
  }, []);

  useEffect(() => {
    loadLatest(stationId).catch(e => setErr(String(e)));
  }, [stationId]);

  const stationOptions = useMemo(() => {
    return stations.map((s, idx) => ({
      id: String(s.id ?? s.station_id ?? s.uuid ?? idx),
      name: String(s.name ?? s.title ?? `Station ${idx + 1}`)
    }));
  }, [stations]);

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <h1>zl6-apitest</h1>

      <select value={stationId} onChange={e => setStationId(e.target.value)}>
        {stationOptions.map(o => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>

      <button onClick={() => loadLatest(stationId)}>새로고침</button>

      {err && <div style={{ color: "red" }}>{err}</div>}

      <pre>{JSON.stringify(latest, null, 2)}</pre>
    </main>
  );
}
