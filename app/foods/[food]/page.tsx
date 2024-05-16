export default function Page({ params }: { params: { food: string } }) {
  return (
    <div>
      <h1>{params.food}</h1>
    </div>
  );
}
