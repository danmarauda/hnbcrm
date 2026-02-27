import { useState } from "react";
;
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Lock } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCRPC } from "@/lib/crpc";

interface ChangePasswordScreenProps {
  organizationId: Id<"organizations">;
  onSuccess: () => void;
}

export function ChangePasswordScreen({
  organizationId,
  onSuccess,
}: ChangePasswordScreenProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const crpc = useCRPC();
  const { mutateAsync: changePassword } = useMutation(crpc.nodeActions.changePassword.mutationOptions());

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required.";
    }
    if (!newPassword) {
      newErrors.newPassword = "New password is required.";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "The new password must be at least 8 characters.";
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (newPassword === currentPassword && newPassword) {
      newErrors.newPassword = "The new password must be different from the current password.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await changePassword({
        organizationId,
        currentPassword,
        newPassword,
      });
      toast.success("Password changed successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to change password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-surface-base">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-brand-500/10 mb-4">
            <Lock size={32} className="text-brand-500" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Change Password
          </h1>
          <p className="text-text-secondary text-sm">
            You need to change your temporary password before continuing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setErrors((prev) => ({ ...prev, currentPassword: "" }));
            }}
            error={errors.currentPassword}
            placeholder="Enter your current password"
            autoComplete="current-password"
          />

          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setErrors((prev) => ({ ...prev, newPassword: "" }));
            }}
            error={errors.newPassword}
            placeholder="Minimo 8 caracteres"
            autoComplete="new-password"
          />

          <Input
            label="Confirmar New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
            error={errors.confirmPassword}
            placeholder="Repeat the new password"
            autoComplete="new-password"
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? "Updating..." : "Change Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
