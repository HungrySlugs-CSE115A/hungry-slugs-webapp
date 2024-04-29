"use client";

export default function Navbar({ height }: { height: string }) {
  return (
    <div className="fixed" style={{ height: height }}>
      <h1>Hungry Slugs</h1>
    </div>
  );
}
