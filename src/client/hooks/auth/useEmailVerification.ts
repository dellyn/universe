// import { useState, useEffect } from 'react';
// import { Routes } from '@interfaces';
// import { getErrorMessage } from '@api/getErrorMessage';
// import { useHttpClient } from '@hooks/api/useHttpClient';
// import { ApiEndpoints } from '@data/apiInterface';
// import { useNavigate } from 'react-router';

// export function useEmailVerification() {
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [error, setError] = useState('');
//   const [showVerificationDialog, setShowVerificationDialog] = useState(false);
//   const { privateHttpClient } = useHttpClient();
//   const navigate = useNavigate();

//   const showEmailVerification = () => {
//     setShowVerificationDialog(true);
//   };
  
//   const hideEmailVerification = () => {
//     setShowVerificationDialog(false);
//   };

//   const verifyEmailCode = async (code: string) => {
//     setIsVerifying(true);
//     setError('');
    
//     try {
//       const response = await privateHttpClient.post(ApiEndpoints.VerifyEmailCode, { code });
      
//       console.log(response.data);
//       if (response.data.verified) {
//         hideEmailVerification();
//         navigate(Routes.Home, { replace: true });
//       }
      
//       return response.data;
//     } catch (err: any) {
//       setError(getErrorMessage(err));
//       throw err;
//     } finally {
//       setIsVerifying(false);
//     }
//   };
  
//   const resendVerification = async () => {
//     setError('');
//     setIsVerifying(true);
    
//     try {
//       const response = await privateHttpClient.post(ApiEndpoints.ResendVerification);
//       return response.data;
//     } catch (err: any) {
//       setError(getErrorMessage(err));
//       throw err;
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   return {
//     verifyEmailCode,
//     resendVerification,
//     isVerifying,
//     error,
//     clearError: () => setError(''),
//     showVerificationDialog,
//     showEmailVerification,
//     hideEmailVerification
//   };
// } 