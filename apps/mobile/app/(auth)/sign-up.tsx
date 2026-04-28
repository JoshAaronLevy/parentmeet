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

const signUpSchema = z
  .object({
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    passwordConfirmation: z.string().min(6)
  })
  .refine((value) => value.password === value.passwordConfirmation, {
    message: "Passwords must match.",
    path: ["passwordConfirmation"]
  });

const signInHref = "/(auth)/sign-in" as Href;

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const parsed = signUpSchema.safeParse({
      email,
      password,
      passwordConfirmation
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your sign up details.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setNotice(null);

    try {
      await signUp(parsed.data.email, parsed.data.password);
      setNotice(
        "Account created. If email confirmation is enabled, check your inbox before signing in."
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create account."
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
          <AppText variant="title">Create an account</AppText>
          <AppText variant="subtitle">
            Start with email and password. Household setup comes next.
          </AppText>
        </YStack>

        {error ? <ErrorState body={error} title="Sign up failed" /> : null}
        {notice ? (
          <AppCard backgroundColor="$tagBackground" borderColor="$tagText">
            <AppText color="$tagText">{notice}</AppText>
          </AppCard>
        ) : null}

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
              textContentType="newPassword"
              value={password}
            />
            <AppInput
              autoCapitalize="none"
              onChangeText={setPasswordConfirmation}
              placeholder="Confirm password"
              secureTextEntry
              textContentType="newPassword"
              value={passwordConfirmation}
            />
            <AppButton disabled={isSubmitting} onPress={handleSubmit}>
              {isSubmitting ? "Creating account" : "Create account"}
            </AppButton>
          </YStack>
        </AppCard>

        <AppText color="$muted">
          Already have an account?{" "}
          <Link href={signInHref}>
            <AppText color="$accent" fontWeight="700">
              Sign in
            </AppText>
          </Link>
        </AppText>
      </Screen>
    </KeyboardAvoidingView>
  );
}
