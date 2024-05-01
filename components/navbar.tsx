"use client";

function getBarHeight(input:string){ 
  return parseInt(input.slice(-2));
}

export default function Navbar({ height }: { height: string }) {
  const barHeight = getBarHeight(height);
  return (
    <div className="fixed" style={{ height: height }}>
      <div className={`box-content h-17 w-screen bg-[#ffffff] m4`}> 
      <a className={`text-4xl  left-10 `}>
          Hungry Slugs
        </a>
      </div>
      
      <div className="static">
        
        <hr className={`h-px top-10 border-0 dark:bg-yellow-400`}></hr>
      </div>
    </div>
  );
}
