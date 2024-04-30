"use client";

export default function Navbar({ height }: { height: string }) {
  return (
    <div className="fixed" style={{ height: height }}>
      
      <div>
        <a className="text-4xl">
          Hungry Slugs
        </a>

      </div>
    </div>
  );
}
