import PaymentClient from "./PaymentClient";

export default function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <PaymentClient params={params} />;
}
