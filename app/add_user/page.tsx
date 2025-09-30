'use client';
import RegisterAdmin from './RegisterAdmin';

export default function AddUserPage() {
  // For now, we'll just pass a dummy function
  const handleClose = () => {
    console.log('Close RegisterAdmin');
  };

  return <RegisterAdmin setaddAdminUser={handleClose} />;
}
