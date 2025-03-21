// authService.ts
import { useSignIn, useSignUp, useOAuth, useAuth } from '@clerk/clerk-expo'

export const useAuthService = () => {
  const { signIn, setActive: setActiveSignIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, setActive: setActiveSignUp, isLoaded: isSignUpLoaded } = useSignUp();
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: facebookAuth } = useOAuth({ strategy: 'oauth_facebook' });

  const signInWithEmail = async (email: string, password: string) => {
    if (!isSignInLoaded || !signIn) return;
    
    try {
      const signInAttempt = await signIn.create({ identifier: email, password });
      if (signInAttempt.status === 'complete') {
        await setActiveSignIn({ session: signInAttempt.createdSessionId });
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    if (!isSignUpLoaded || !signUp) return;

    try {
      await signUp.create({ emailAddress: email, password, firstName: name });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const messages = err.errors.map((error: any) => error.longMessage).join(', ');
        throw messages;
      } else {
        throw err.message || 'Unknown error';
      }
    }
    
  };

  const verifyEmailCode = async (code: string) => {
    if (!isSignUpLoaded || !signUp) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      if (completeSignUp.status === 'complete') {
        await setActiveSignUp({ session: completeSignUp.createdSessionId });
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        const messages = err.errors.map((error: any) => error.longMessage).join(', ');
        throw messages;
      } else {
        throw err.message || 'Unknown error';
      }
    }
  };

  const signInWithOAuth = async (strategy: "oauth_google" | "oauth_facebook") => {
    try {
      let authResult;
      if (strategy === "oauth_google") {
        authResult = await googleAuth();
      } else if (strategy === "oauth_facebook") {
        authResult = await facebookAuth();
      }
  
      console.log("OAuth result:", authResult);
  
      if (authResult?.createdSessionId) {
        await setActiveSignIn!({ session: authResult.createdSessionId });
  
        // ⏳ Чекаємо оновлення сесії
        const { getToken, isSignedIn, userId } = useAuth();
        let tries = 0;
        while (!isSignedIn && !userId && tries < 5) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          tries++;
        }
  
        if (!isSignedIn || !userId) {
          console.error("User ID not available after OAuth login");
          return;
        }
  
        const token = await getToken({ template: "supabase" });
        console.log("Updated Supabase token:", token);
      } else {
        console.error("No session ID returned from OAuth!");
      }
    } catch (err: any) {
      console.log("OAuth error:", JSON.stringify(err, null, 2));
    }
  };
  



  return {
    signInWithEmail,
    signUpWithEmail,
    verifyEmailCode,
    signInWithOAuth,
  };
};
