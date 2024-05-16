export default function Page({ params }: { params: { food: string } }) {
  return (
    <div>
      <h1>{decodeURIComponent(params.food)}</h1>
    </div>
  );
}
