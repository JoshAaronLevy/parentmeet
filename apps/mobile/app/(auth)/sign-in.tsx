import { Link, type Href } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { YStack } from "tamagui";
import { z } from "zod";

import {
  AppButton,
  AppCard,
  AppInput,
  AppText,
  ErrorState,
  Screen
} from "../../components/ui";
import { useAuth } from "../../src/providers/AuthProvider";

const authSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters.")
});

const signUpHref = "/(auth)/sign-up" as Href;

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const parsed = authSchema.safeParse({ email, password });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your sign in details.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await signIn(parsed.data.email, parsed.data.password);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to sign in."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <Screen justifyContent="center">
        <YStack gap="$2">
          <AppText color="$accent" fontWeight="700" variant="label">
            ParentMeet
          </AppText>
          <AppText variant="title">Sign in</AppText>
          <AppText variant="subtitle">
            Use the email and password connected to your ParentMeet account.
          </AppText>
        </YStack>

        {error ? <ErrorState body={error} title="Sign in failed" /> : null}

        <AppCard>
          <YStack gap="$4">
            <AppInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="Email"
              textContentType="emailAddress"
              value={email}
            />
            <AppInput
              autoCapitalize="none"
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              textContentType="password"
              value={password}
            />
            <AppButton disabled={isSubmitting} onPress={handleSubmit}>
              {isSubmitting ? "Signing in" : "Sign in"}
            </AppButton>
          </YStack>
        </AppCard>

        <AppText color="$muted">
          New to ParentMeet?{" "}
          <Link href={signUpHref}>
            <AppText color="$accent" fontWeight="700">
              Create an account
            </AppText>
          </Link>
        </AppText>
      </Screen>
    </KeyboardAvoidingView>
  );
}
