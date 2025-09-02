import { Suspense } from 'react';
import Login from '@/app/Login'; // adjust path if needed

export default function Page() {
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <Login />
    </Suspense>
  );
}
